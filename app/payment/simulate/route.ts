// app/payment/simulate/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderNumber = searchParams.get("order");
  const amount = searchParams.get("amount");
  const method = searchParams.get("method");
  
  const confirmationCode = Math.floor(Math.random() * 1000000);
  const merchantCode = Math.floor(Math.random() * 1000000);
  const ussdCode = method === "mtn" 
    ? `*126*${merchantCode}*${amount}#`
    : `#144*${merchantCode}*${amount}#`;
  
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Paiement - Kuaku Market</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 24px;
      padding: 32px;
      max-width: 500px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: fadeIn 0.5s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .icon {
      width: 80px;
      height: 80px;
      background: #4caf50;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      animation: scale 0.5s ease;
    }
    @keyframes scale {
      0% { transform: scale(0); }
      80% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    h1 { font-size: 28px; margin-bottom: 12px; color: #1a202c; }
    .amount { font-size: 36px; font-weight: bold; color: #4caf50; margin: 16px 0; }
    .info { background: #f7fafc; border-radius: 16px; padding: 20px; margin: 24px 0; text-align: left; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .info-row:last-child { border-bottom: none; }
    .label { color: #718096; font-weight: 500; }
    .value { color: #2d3748; font-weight: 600; }
    .code-box { background: #edf2f7; padding: 16px; border-radius: 12px; text-align: center; margin: 16px 0; }
    .code { font-family: monospace; font-size: 20px; font-weight: bold; letter-spacing: 2px; color: #2d3748; }
    .btn { background: #4caf50; color: white; border: none; padding: 14px 28px; border-radius: 40px; font-size: 16px; font-weight: 600; cursor: pointer; width: 100%; transition: all 0.2s; margin-top: 16px; }
    .btn:hover { background: #43a047; transform: translateY(-2px); }
    .btn-secondary { background: #e2e8f0; color: #4a5568; margin-top: 12px; }
    .btn-secondary:hover { background: #cbd5e0; transform: translateY(-2px); }
    .timer { margin-top: 20px; font-size: 14px; color: #a0aec0; }
    @media (max-width: 480px) { .card { padding: 24px; } h1 { font-size: 24px; } .amount { font-size: 28px; } }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
    </div>
    
    <h1>Paiement prêt !</h1>
    <p style="color: #718096;">Mode développement - Test réussi</p>
    
    <div class="amount">${Number(amount).toLocaleString()} FCFA</div>
    
    <div class="info">
      <div class="info-row">
        <span class="label">Mode de paiement</span>
        <span class="value">${method === 'mtn' ? '📱 MTN Money' : '🟠 Orange Money'}</span>
      </div>
      <div class="info-row">
        <span class="label">Numéro de commande</span>
        <span class="value">${orderNumber?.substring(0, 8)}...</span>
      </div>
      <div class="info-row">
        <span class="label">Code confirmation</span>
        <span class="value">${confirmationCode}</span>
      </div>
    </div>
    
    <div class="code-box">
      <div style="font-size: 12px; color: #718096; margin-bottom: 8px;">Code USSD à composer</div>
      <div class="code">${ussdCode}</div>
    </div>
    
    <button class="btn" onclick="window.location.href='/success?orderNumber=${orderNumber}&sim=true'">
      ✅ Confirmer la commande
    </button>
    
    <button class="btn-secondary" onclick="window.location.href='/cart'">
      🔄 Annuler et retourner
    </button>
    
    <div class="timer">
      ⏳ Redirection automatique dans <span id="countdown">5</span> secondes...
    </div>
  </div>
  
  <script>
    let countdown = 5;
    const timer = setInterval(() => {
      countdown--;
      document.getElementById('countdown').innerText = countdown;
      if (countdown <= 0) {
        clearInterval(timer);
        window.location.href = '/success?orderNumber=${orderNumber}&sim=true';
      }
    }, 1000);
  </script>
</body>
</html>`;
  
  return new NextResponse(html, {
    headers: { 
      "Content-Type": "text/html",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    },
  });
}