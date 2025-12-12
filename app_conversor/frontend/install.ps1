# Script de instalación para el frontend
# Si tienes problemas con la ejecución de scripts, ejecuta primero:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

Write-Host "Instalando dependencias del frontend..." -ForegroundColor Cyan

Set-Location -Path $PSScriptRoot

try {
    npm install
    Write-Host "`nDependencias instaladas correctamente!" -ForegroundColor Green
    Write-Host "`nPara ejecutar el frontend en modo desarrollo:" -ForegroundColor Yellow
    Write-Host "npm run dev" -ForegroundColor White
    Write-Host "`nPara compilar para producción:" -ForegroundColor Yellow
    Write-Host "npm run build" -ForegroundColor White
}
catch {
    Write-Host "`nError al instalar dependencias:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "`nSi ves un error de política de ejecución, ejecuta:" -ForegroundColor Yellow
    Write-Host "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor White
}
