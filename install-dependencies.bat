@echo off
echo ================================
echo Installing Project Dependencies
echo ================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed or not in PATH
    echo Please install npm or reinstall Node.js
    pause
    exit /b 1
)

echo Node.js and npm are available
echo.

REM Get the current directory
set SCRIPT_DIR=%~dp0

echo ================================
echo Installing Backend Dependencies
echo ================================
echo.

REM Navigate to backend directory
cd /d "%SCRIPT_DIR%be"
if errorlevel 1 (
    echo ERROR: Could not navigate to backend directory
    pause
    exit /b 1
)

echo Current directory: %CD%
echo Installing backend dependencies...
echo.

REM Install backend dependencies
npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Backend dependencies installed successfully!
echo.

echo ================================
echo Installing Frontend Dependencies
echo ================================
echo.

REM Navigate to frontend directory
cd /d "%SCRIPT_DIR%fe"
if errorlevel 1 (
    echo ERROR: Could not navigate to frontend directory
    pause
    exit /b 1
)

echo Current directory: %CD%
echo Installing frontend dependencies...
echo.

REM Install frontend dependencies
npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Frontend dependencies installed successfully!
echo.

REM Navigate back to root directory
cd /d "%SCRIPT_DIR%"

echo ================================
echo Installation Complete!
echo ================================
echo.
echo All dependencies have been installed successfully:
echo.
echo Backend dependencies (NestJS, GraphQL, MongoDB, Mongoose, etc.):
echo   - @nestjs/* packages
echo   - mongoose ^8.16.3
echo   - mongodb ^6.17.0
echo   - graphql ^16.11.0
echo   - apollo-server packages
echo   - bcryptjs, passport, jwt packages
echo   - All dev dependencies including TypeScript, Jest, ESLint
echo.
echo Frontend dependencies (Next.js, React, Apollo Client, etc.):
echo   - next ^15.3.5
echo   - react ^19.0.0
echo   - @apollo/client ^3.13.8
echo   - graphql ^16.11.0
echo   - Tailwind CSS, TypeScript, ESLint
echo   - UI components and form handling libraries
echo.
echo You can now run:
echo   Backend: cd be ^&^& npm run start:dev
echo   Frontend: cd fe ^&^& npm run dev
echo.
pause
