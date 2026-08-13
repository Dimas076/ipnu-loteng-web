@echo off
echo Memperbarui database schema...
call npx prisma db push
echo.
echo Jika tidak ada error merah di atas, berarti database sudah berhasil diupdate!
