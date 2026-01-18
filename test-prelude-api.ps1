# Script de test pour vérifier la clé API Unimtx (PowerShell)
# Usage: .\test-prelude-api.ps1 -AccessKeyId "VOTRE_ACCESS_KEY_ID" -Phone "+337..."

param(
    [string]$AccessKeyId = "4GscLqoQmxGSk6nGK4vF5h",
    [string]$Phone = "+33767602972",
    [string]$Code = ""
)

Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🧪 Test de la clé API Unimtx" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "AccessKeyId (début): $($AccessKeyId.Substring(0, [Math]::Min(8, $AccessKeyId.Length)))..." -ForegroundColor Yellow
Write-Host "Longueur: $($AccessKeyId.Length) caractères" -ForegroundColor Yellow
Write-Host "Numéro de test: $Phone" -ForegroundColor Yellow
Write-Host ""

Write-Host "Test: Envoi OTP (otp.send)" -ForegroundColor Green
Write-Host "─────────────────────────────────────" -ForegroundColor Gray

try {
    $sendBody = @{
        to = $Phone
        digits = 4
    } | ConvertTo-Json -Depth 10

    $sendResponse = Invoke-RestMethod -Uri "https://api.unimtx.com/?action=otp.send&accessKeyId=$AccessKeyId" `
        -Method Post `
        -Headers @{ "Content-Type" = "application/json" } `
        -Body $sendBody `
        -ErrorAction Stop
    
    Write-Host "✅ OTP envoyé!" -ForegroundColor Green
    Write-Host ($sendResponse | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "❌ ERREUR:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Détails:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Status HTTP: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

Write-Host ""

if ($Code -ne "") {
    Write-Host "Test: Vérification OTP (otp.verify)" -ForegroundColor Green
    Write-Host "─────────────────────────────────────" -ForegroundColor Gray
    try {
        $verifyBody = @{
            to = $Phone
            code = $Code
        } | ConvertTo-Json -Depth 10

        $verifyResponse = Invoke-RestMethod -Uri "https://api.unimtx.com/?action=otp.verify&accessKeyId=$AccessKeyId" `
            -Method Post `
            -Headers @{ "Content-Type" = "application/json" } `
            -Body $verifyBody `
            -ErrorAction Stop

        Write-Host "✅ OTP vérifié!" -ForegroundColor Green
        Write-Host ($verifyResponse | ConvertTo-Json -Depth 10)
    } catch {
        Write-Host "❌ ERREUR:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "Détails:" -ForegroundColor Yellow
            Write-Host $_.ErrorDetails.Message -ForegroundColor Yellow
        }
        Write-Host ""
        Write-Host "Status HTTP: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Note: l'OTP est géré côté Unimtx (pas de fallback local)." -ForegroundColor Yellow
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
