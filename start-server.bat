@echo off
chcp 65001 >nul
set PYTHONIOENCODING=utf-8
cd /d "%~dp0"

where python >nul 2>nul
if errorlevel 1 (
  echo [X] Python not found in PATH.
  echo     Install Python first, then run this file again.
  pause
  exit /b 1
)

python server.py %*
echo.
echo Server stopped.
pause
