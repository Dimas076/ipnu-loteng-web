@echo off
echo Menjalankan pengecekan tipe data TypeScript...
call npx tsc --noEmit > ts-error.log 2>&1
echo Selesai! Log tersimpan di ts-error.log
