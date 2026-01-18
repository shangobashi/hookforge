$ErrorActionPreference = "Stop"

Write-Host "HookForge deployment to Vercel"

if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
  Write-Host "Vercel CLI not found. Installing locally via npx..."
}

Write-Host "Launching Vercel deployment (login required if not already authenticated)."
npx vercel --prod
