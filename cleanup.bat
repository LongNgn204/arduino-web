@echo off
:: Arduino Hub - Cleanup Script
:: Xóa folder Next.js cũ và rename web-vite thành web

echo ========================================
echo   Arduino Hub - Cleanup Script v2.0
echo ========================================
echo.

cd /d "C:\Users\Administrator\Documents\GitHub\arduino-web"

echo [1/3] Đang kiểm tra folder apps\web...
if exist "apps\web" (
    echo      - Tìm thấy folder Next.js cũ
) else (
    echo      - Không tìm thấy folder cũ. Đã sạch!
    goto :check_vite
)

echo.
echo [2/3] Đang xóa apps\web (Next.js cũ)...
rd /s /q "apps\web" 2>nul
if exist "apps\web" (
    echo      [LỖI] Không thể xóa! Vui lòng đóng VS Code và thử lại.
    pause
    exit /b 1
) else (
    echo      - Đã xóa thành công!
)

:check_vite
echo.
echo [3/3] Đang rename apps\web-vite thành apps\web...
if exist "apps\web-vite" (
    ren "apps\web-vite" "web"
    if exist "apps\web" (
        echo      - Đã rename thành công!
    ) else (
        echo      [LỖI] Không thể rename!
        pause
        exit /b 1
    )
) else (
    echo      - Folder web-vite không tồn tại hoặc đã được rename.
)

echo.
echo ========================================
echo   HOÀN TẤT! 
echo   Folder mới: apps\web (Vite)
echo ========================================
echo.
pause
