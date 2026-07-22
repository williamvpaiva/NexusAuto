@echo off
REM Dashboard Startup Script for Windows
REM Inicia API e Web Server do Líder Dashboard

echo 🚀 Iniciando Líder Dashboard...
echo.

REM Verificar se node_modules existe
if not exist "node_modules\" (
    echo 📦 Instalando dependências...
    call npm install
    echo.
)

REM Iniciar API e Web simultaneamente
echo 🌐 Iniciando API (porta 3001) e Web Server (porta 3000)...
echo.
echo 📊 Dashboard disponível em: http://localhost:3000
echo 📡 API disponível em: http://localhost:3001
echo.
echo Pressione Ctrl+C para parar
echo.

call npm run dev