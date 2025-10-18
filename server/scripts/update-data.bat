@echo off
echo Updating database with new data...
echo.

echo Running seed script...
npx prisma db seed

echo.
echo Data update completed!
echo.
echo You can now:
echo 1. View posts at http://localhost:5173
echo 2. Login with any email from allowed domains (gmail.com, yahoo.com, outlook.com, test.com)
echo 3. Test the nested comments system
echo.
pause
