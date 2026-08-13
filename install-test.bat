@echo off
echo Menginstal Jest dan React Testing Library...
call npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node ts-jest @types/jest --legacy-peer-deps
echo Selesai!
