@echo off
title VexLap ID Maker - Local Server
cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel%==0 (
    echo Starting server with Node.js...
    start "" http://localhost:8080
    node server.js
    goto :eof
)

where python >nul 2>nul
if %errorlevel%==0 (
    echo Node.js not found, using Python instead...
    start "" http://localhost:8080
    python -m http.server 8080
    goto :eof
)

where py >nul 2>nul
if %errorlevel%==0 (
    echo Node.js not found, using Python (py launcher) instead...
    start "" http://localhost:8080
    py -m http.server 8080
    goto :eof
)

echo ERROR: Neither Node.js nor Python was found on this computer.
echo Please install Node.js from https://nodejs.org and try again.
pause
