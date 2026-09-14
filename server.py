#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI 学习路线 · 本地服务器

作用有两个：
1. 把当前文件夹当成网站发布出去，手机连同一个 Wi-Fi 就能访问。
2. 提供一个极简的数据接口 /api/state，把进度存到 data/state.json，
   这样手机和电脑看到的是同一份数据，而不是各存各的。

用法：
    python server.py            # 默认 8000 端口
    python server.py 8080       # 指定端口

只用 Python 标准库，不需要安装任何依赖。
"""

import json
import os
import socket
import sys
import tempfile
import threading
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
STATE_PATH = os.path.join(DATA_DIR, "state.json")
BACKUP_PATH = os.path.join(DATA_DIR, "state.backup.json")
MAX_BODY = 8 * 1024 * 1024  # 8 MB，足够存很多笔记

_lock = threading.Lock()


# ---------------------------------------------------------------- 数据读写
def read_state():
    """读取当前数据；文件不存在或损坏时返回 None。"""
    if not os.path.exists(STATE_PATH):
        return None
    try:
        with open(STATE_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, dict) else None
    except (OSError, ValueError):
        return None


def write_state(state):
    """原子写入，并保留上一版作为备份。"""
    os.makedirs(DATA_DIR, exist_ok=True)
    if os.path.exists(STATE_PATH):
        try:
            with open(STATE_PATH, "r", encoding="utf-8") as src:
                previous = src.read()
            with open(BACKUP_PATH, "w", encoding="utf-8") as dst:
                dst.write(previous)
        except OSError:
            pass

    fd, tmp_path = tempfile.mkstemp(dir=DATA_DIR, suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as tmp:
            json.dump(state, tmp, ensure_ascii=False, indent=2)
        os.replace(tmp_path, STATE_PATH)
    except OSError:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        raise


def _stamp(entry):
    """取出条目的时间戳，用于比较新旧。"""
    if not isinstance(entry, dict):
        return ""
    return str(entry.get("updatedAt") or "")


def merge_state(stored, incoming):
    """
    把手机/电脑两份数据合并成一份。

    规则简单但够用：
    - 任务、日志条目：按条目的 updatedAt 决定谁新，谁新用谁（所以两边改不同的任务不会互相覆盖）
    - 删除日志：用墓碑记录（logDeleted），比日志条目新就保持删除
    - 档案（称呼、开始日期）：谁新用谁
    """
    if not isinstance(stored, dict):
        stored = {}
    if not isinstance(incoming, dict):
        incoming = {}

    merged = {
        "version": 1,
        "profile": {},
        "tasks": {},
        "log": [],
        "logDeleted": {},
    }

    # --- profile ---
    s_profile = stored.get("profile") if isinstance(stored.get("profile"), dict) else {}
    i_profile = incoming.get("profile") if isinstance(incoming.get("profile"), dict) else {}
    merged["profile"] = i_profile if _stamp(i_profile) >= _stamp(s_profile) else s_profile

    # --- tasks ---
    s_tasks = stored.get("tasks") if isinstance(stored.get("tasks"), dict) else {}
    i_tasks = incoming.get("tasks") if isinstance(incoming.get("tasks"), dict) else {}
    for key in set(s_tasks) | set(i_tasks):
        s_entry = s_tasks.get(key)
        i_entry = i_tasks.get(key)
        if s_entry is None:
            merged["tasks"][key] = i_entry
        elif i_entry is None:
            merged["tasks"][key] = s_entry
        else:
            merged["tasks"][key] = i_entry if _stamp(i_entry) >= _stamp(s_entry) else s_entry

    # --- logDeleted（墓碑，取更新的时间） ---
    for source in (stored.get("logDeleted"), incoming.get("logDeleted")):
        if not isinstance(source, dict):
            continue
        for key, value in source.items():
            if str(value) > str(merged["logDeleted"].get(key, "")):
                merged["logDeleted"][key] = value

    # --- log（按 id 合并，再剔除已删除的） ---
    log_by_id = {}
    for source in (stored.get("log"), incoming.get("log")):
        if not isinstance(source, list):
            continue
        for item in source:
            if not isinstance(item, dict):
                continue
            item_id = str(item.get("id") or "")
            if not item_id:
                continue
            current = log_by_id.get(item_id)
            if current is None or _stamp(item) >= _stamp(current):
                log_by_id[item_id] = item

    merged["log"] = [
        item
        for item_id, item in log_by_id.items()
        if str(merged["logDeleted"].get(item_id, "")) <= _stamp(item)
    ]
    merged["log"].sort(key=lambda x: (str(x.get("date") or ""), _stamp(x)), reverse=True)

    # --- 根节点时间戳取最大值 ---
    merged["updatedAt"] = max(str(stored.get("updatedAt") or ""), str(incoming.get("updatedAt") or ""))
    merged["version"] = int(incoming.get("version") or stored.get("version") or 1)
    return merged


# ---------------------------------------------------------------- HTTP 服务
class Handler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".webmanifest": "application/manifest+json",
        ".json": "application/json",
        ".svg": "image/svg+xml",
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def log_message(self, fmt, *args):
        # 默认日志太吵，只保留一行简短记录
        sys.stderr.write("[%s] %s\n" % (datetime.now().strftime("%H:%M:%S"), fmt % args))

    def end_headers(self):
        # 手机浏览器缓存很激进，明确禁掉，避免改了页面看不到效果
        if self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-store")
        else:
            self.send_header("Cache-Control", "no-cache, must-revalidate")
        super().end_headers()

    # -------------------------------------------------- GET
    def do_GET(self):
        if self.path.split("?")[0] == "/api/state":
            with _lock:
                state = read_state()
            self.send_json(200, {"state": state, "serverTime": datetime.now().isoformat(timespec="seconds")})
            return
        super().do_GET()

    # -------------------------------------------------- POST
    def do_POST(self):
        if self.path.split("?")[0] != "/api/state":
            self.send_json(404, {"error": "未知接口"})
            return

        try:
            length = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_BODY:
            self.send_json(400, {"error": "请求体大小不合适"})
            return

        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except (ValueError, UnicodeDecodeError):
            self.send_json(400, {"error": "JSON 解析失败"})
            return

        incoming = payload.get("state") if isinstance(payload, dict) else None
        if not isinstance(incoming, dict):
            self.send_json(400, {"error": "缺少 state 字段"})
            return

        with _lock:
            merged = merge_state(read_state(), incoming)
            try:
                write_state(merged)
            except OSError as exc:
                self.send_json(500, {"error": "写入失败：%s" % exc})
                return

        self.send_json(200, {
            "state": merged,
            "savedAt": datetime.now().isoformat(timespec="seconds"),
        })

    # -------------------------------------------------- 工具
    def send_json(self, code, obj):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


# ---------------------------------------------------------------- 启动
def local_ip():
    """拿到局域网 IP，供手机访问。"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        sock.connect(("223.5.5.5", 80))  # 不会真的发数据，只用来问路由表
        return sock.getsockname()[0]
    except OSError:
        return "127.0.0.1"
    finally:
        sock.close()


def main():
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("端口必须是数字，例如：python server.py 8123")
            return 1

    os.makedirs(DATA_DIR, exist_ok=True)
    ip = local_ip()

    server = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    print("=" * 58)
    print("  AI 学习路线 已启动")
    print("=" * 58)
    print("  本机访问：   http://localhost:%d" % port)
    print("  手机访问：   http://%s:%d" % (ip, port))
    print("  （手机需和这台电脑连同一个 Wi-Fi）")
    print("  数据文件：   %s" % STATE_PATH)
    print("  按 Ctrl + C 停止")
    print("=" * 58)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止。数据已保存在 %s" % STATE_PATH)
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
