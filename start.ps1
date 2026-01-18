$ErrorActionPreference = "Stop"

Write-Host "HookForge setup starting..."

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js is required. Install from https://nodejs.org and rerun." -ForegroundColor Red
  exit 1
}

if (-not (Test-Path ".env.local")) {
  Write-Host "Creating .env.local (press Enter to skip optional values)."
  $groq = Read-Host "GROQ_API_KEY"
  $supabaseUrl = Read-Host "NEXT_PUBLIC_SUPABASE_URL (optional)"
  $supabaseAnon = Read-Host "NEXT_PUBLIC_SUPABASE_ANON_KEY (optional)"
  $supabaseService = Read-Host "SUPABASE_SERVICE_ROLE_KEY (optional)"
  $stripeKey = Read-Host "STRIPE_SECRET_KEY (optional)"
  $stripePrice = Read-Host "STRIPE_PRICE_ID (optional)"
  $stripeWebhook = Read-Host "STRIPE_WEBHOOK_SECRET (optional)"
  $appUrl = Read-Host "NEXT_PUBLIC_APP_URL (default http://localhost:3000)"
  if (-not $appUrl) { $appUrl = "http://localhost:3000" }

  @"
GROQ_API_KEY=$groq
GROQ_MODEL=moonshotai/kimi-k2-instruct-0905,qwen/qwen3-32b,openai/gpt-oss-120b
NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl
NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabaseAnon
SUPABASE_SERVICE_ROLE_KEY=$supabaseService
STRIPE_SECRET_KEY=$stripeKey
STRIPE_PRICE_ID=$stripePrice
STRIPE_WEBHOOK_SECRET=$stripeWebhook
NEXT_PUBLIC_APP_URL=$appUrl
"@ | Set-Content ".env.local"
}

if (-not (Test-Path "node_modules")) {
  Write-Host "Installing dependencies..."
  npm install
}

Write-Host "Starting dev server on http://localhost:3000"
npm run dev
