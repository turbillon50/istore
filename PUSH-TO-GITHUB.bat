@echo off
echo ================================================
echo  iStore Pro v2 — Push a GitHub
echo ================================================
cd /d "%~dp0"

echo.
echo [1/4] Inicializando git...
git init
git remote remove origin 2>nul
git remote add origin https://github.com/turbillon50/istore.git

echo.
echo [2/4] Agregando todos los archivos...
git add -A

echo.
echo [3/4] Creando commit...
git commit -m "feat: rebuild completo iStore Pro v2 — tienda premium de tecnologia

- Schema Prisma completo (35+ modelos: productos, inventario, pedidos, CMS, etc.)
- Frontend premium Apple Store-like con hero cinematografico
- Panel admin ERP con tablas profesionales
- CMS dinamico completo (banners, carruseles, paginas, menus)
- Import/Export XLSX/CSV con preview y validacion
- Integraciones: Clerk, Stripe, MercadoPago, Resend, Cloudinary
- Webhooks: Stripe, MercadoPago, Clerk
- n8n automation flows preparados
- AI Assistant 'Iris' con streaming
- Paginas: Servicios, Financiamiento, Trade-In
- Configuracion completa del sistema
- Seed de base de datos con datos reales MX"

echo.
echo [4/4] Subiendo a GitHub...
git branch -M main
git push -f origin main

echo.
echo ================================================
echo  LISTO! Codigo subido a GitHub.
echo  Vercel detectara el push y desplegara automaticamente.
echo ================================================
pause
