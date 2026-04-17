// utils/invoiceWithQRGenerator.ts
import { Address } from "@/sanity/types";
import { QrCode } from "lucide-react";

export interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  trackingNumber: string;
  pickupCode: string;
  date: string;
  dueDate: string;
  expectedDeliveryDate: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: Address | null;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  deliveryStatus: string;
}

export async function generateInvoiceWithQRHTML(data: InvoiceData): Promise<string> {
  // Générer les QR codes
  const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/track-order/${data.orderNumber}?code=${data.pickupCode}`;
  const pickupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pickup/${data.orderNumber}?code=${data.pickupCode}`;
  
  const qrCodeTracking = await QRCode.toDataURL(trackingUrl, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 150,
  });
  
  const qrCodePickup = await QRCode.toDataURL(pickupUrl, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 150,
  });

  const qrCodeData = await QRCode.toDataURL(JSON.stringify({
    orderNumber: data.orderNumber,
    trackingNumber: data.trackingNumber,
    pickupCode: data.pickupCode,
    customerName: data.customer.name,
    total: data.total,
  }), {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 150,
  });

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Facture ${data.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Arial', sans-serif;
      background: #f5f5f5;
      padding: 40px 20px;
    }
    .invoice-container {
      max-width: 1100px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .invoice-header {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      padding: 30px 40px;
    }
    .invoice-title { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
    .invoice-subtitle { font-size: 14px; opacity: 0.9; }
    .invoice-body { padding: 40px; }
    .company-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
    }
    .company-details h3 { color: #1e3c72; margin-bottom: 10px; }
    .company-details p { color: #666; font-size: 14px; margin: 5px 0; }
    .invoice-details { text-align: right; }
    .invoice-details p { margin: 5px 0; color: #666; }
    .invoice-details strong { color: #333; }
    
    /* QR Codes Section */
    .qr-section {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    .qr-card {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 15px;
      text-align: center;
      border: 1px solid #e0e0e0;
    }
    .qr-card h4 {
      color: #1e3c72;
      margin-bottom: 10px;
      font-size: 14px;
    }
    .qr-card .code {
      font-family: monospace;
      font-size: 12px;
      background: white;
      padding: 5px;
      border-radius: 4px;
      margin-top: 8px;
      word-break: break-all;
    }
    
    .customer-info {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .customer-info h4 { color: #1e3c72; margin-bottom: 15px; font-size: 16px; }
    .customer-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .customer-details p { color: #555; font-size: 14px; }
    
    .tracking-info {
      background: #e3f2fd;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 30px;
      border-left: 4px solid #2196f3;
    }
    .tracking-info h4 { color: #1565c0; margin-bottom: 10px; }
    .tracking-info p { font-size: 14px; margin: 5px 0; }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
    }
    .status-pending { background: #fff3e0; color: #e65100; }
    .status-paid { background: #e8f5e9; color: #2e7d32; }
    .status-shipped { background: #e3f2fd; color: #1565c0; }
    .status-delivered { background: #e8f5e9; color: #2e7d32; }
    
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .items-table th {
      background: #f8f9fa;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #e0e0e0;
    }
    .items-table td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
      color: #555;
    }
    .items-table .text-right { text-align: right; }
    
    .summary {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
    .summary-table { width: 300px; border-collapse: collapse; }
    .summary-table td { padding: 8px; border-bottom: 1px solid #e0e0e0; }
    .summary-table .total { font-size: 18px; font-weight: bold; color: #1e3c72; }
    
    .payment-info {
      margin-top: 30px;
      padding: 20px;
      background: #e8f5e9;
      border-radius: 8px;
      border-left: 4px solid #4caf50;
    }
    .payment-info h4 { color: #2e7d32; margin-bottom: 10px; }
    .payment-info p { color: #555; font-size: 14px; margin: 5px 0; }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      text-align: center;
      border-top: 1px solid #e0e0e0;
      color: #999;
      font-size: 12px;
    }
    @media print {
      body { background: white; padding: 0; }
      .invoice-container { box-shadow: none; border-radius: 0; }
      .no-print { display: none; }
    }
    .no-print { text-align: center; margin-top: 20px; }
    .btn-download {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 30px;
      font-size: 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .btn-download:hover { transform: translateY(-2px); }
    @media (max-width: 768px) {
      .qr-section { grid-template-columns: 1fr; }
      .company-info { flex-direction: column; }
      .invoice-details { text-align: left; margin-top: 15px; }
      .customer-details { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="invoice-header">
      <div class="invoice-title">FACTURE AVEC SUIVI</div>
      <div class="invoice-subtitle">Document officiel de transaction - QR Code de suivi inclus</div>
    </div>
    
    <div class="invoice-body">
      <!-- Company Info -->
      <div class="company-info">
        <div class="company-details">
          <h3>KUAKU MARKET</h3>
          <p>123 Avenue Principale</p>
          <p>Douala, Cameroun</p>
          <p>Tél: +237 6XX XXX XXX</p>
          <p>Email: contact@kuakumarket.com</p>
          <p>NIF: CI-2026-123456</p>
        </div>
        <div class="invoice-details">
          <p><strong>Facture N°:</strong> ${data.invoiceNumber}</p>
          <p><strong>Commande N°:</strong> ${data.orderNumber}</p>
          <p><strong>N° Suivi:</strong> ${data.trackingNumber}</p>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Date d'échéance:</strong> ${data.dueDate}</p>
          <p><strong>Livraison prévue:</strong> ${data.expectedDeliveryDate}</p>
        </div>
      </div>
      
      <!-- QR Codes Section -->
      <div class="qr-section">
        <div class="qr-card">
          <h4>📱 QR Code de suivi</h4>
          <img src="${qrCodeTracking}" alt="QR Code Suivi" style="width: 120px; height: 120px; margin: 10px auto;">
          <p class="code">Code: ${data.pickupCode}</p>
          <p style="font-size: 11px; color: #666;">Scannez pour suivre votre commande</p>
        </div>
        <div class="qr-card">
          <h4>🏪 QR Code de retrait</h4>
          <img src="${qrCodePickup}" alt="QR Code Retrait" style="width: 120px; height: 120px; margin: 10px auto;">
          <p class="code">Code: ${data.pickupCode}</p>
          <p style="font-size: 11px; color: #666;">Présentez au point de retrait</p>
        </div>
        <div class="qr-card">
          <h4>📦 QR Code commande</h4>
          <img src="${qrCodeData}" alt="QR Code Commande" style="width: 120px; height: 120px; margin: 10px auto;">
          <p class="code">ID: ${data.orderNumber.substring(0, 8)}</p>
          <p style="font-size: 11px; color: #666;">Identification de la commande</p>
        </div>
      </div>
      
      <!-- Tracking Info -->
      <div class="tracking-info">
        <h4>🚚 Informations de suivi</h4>
        <p><strong>Statut actuel:</strong> <span class="status-badge status-${data.deliveryStatus}">${getStatusText(data.deliveryStatus)}</span></p>
        <p><strong>Lien de suivi:</strong> <a href="${trackingUrl}" target="_blank">${trackingUrl}</a></p>
        <p><strong>Code de retrait:</strong> <strong style="font-family: monospace; font-size: 16px;">${data.pickupCode}</strong></p>
      </div>
      
      <!-- Customer Info -->
      <div class="customer-info">
        <h4>Facturé à :</h4>
        <div class="customer-details">
          <p><strong>Nom:</strong> ${data.customer.name}</p>
          <p><strong>Email:</strong> ${data.customer.email}</p>
          <p><strong>Téléphone:</strong> ${data.customer.phone}</p>
          ${data.customer.address ? `
            <p><strong>Adresse:</strong> ${data.customer.address.city || ''}, ${data.customer.address.state || ''}</p>
          ` : ''}
        </div>
      </div>
      
      <!-- Items Table -->
      <table class="items-table">
        <thead>
          <tr><th>Description</th><th class="text-right">Qté</th><th class="text-right">Prix unitaire</th><th class="text-right">Total</th></tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
            <tr><td>${item.name}</td><td class="text-right">${item.quantity}</td><td class="text-right">${formatPrice(item.unitPrice)}</td><td class="text-right">${formatPrice(item.total)}</td></tr>
          `).join('')}
        </tbody>
      </table>
      
      <!-- Summary -->
      <div class="summary">
        <table class="summary-table">
          <tr><td>Sous-total</td><td class="text-right">${formatPrice(data.subtotal)}</td></tr>
          <tr><td>Remise</td><td class="text-right">${formatPrice(data.discount)}</td></tr>
          <tr><td class="total">Total</td><td class="text-right total">${formatPrice(data.total)}</td></tr>
        </table>
      </div>
      
      <!-- Payment Info -->
      <div class="payment-info">
        <h4>💰 Informations de paiement</h4>
        <p><strong>Mode de paiement:</strong> ${data.paymentMethod === 'mtn' ? '📱 MTN Money' : '🟠 Orange Money'}</p>
        <p><strong>Statut:</strong> ${data.paymentStatus === 'paid' ? '✅ Payé' : '⏳ En attente'}</p>
        <p><strong>ID Transaction:</strong> ${data.transactionId}</p>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <p>Merci de votre confiance !</p>
        <p>Cette facture est générée automatiquement et fait foi de preuve d'achat.</p>
        <p>Pour toute question, contactez notre service client.</p>
      </div>
    </div>
  </div>
  
  <div class="no-print">
    <button class="btn-download" onclick="window.print()">
      📄 Télécharger la facture (PDF)
    </button>
  </div>
</body>
</html>`;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF'
  }).format(price);
}

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: '⏳ En attente',
    paid: '✅ Payé',
    processing: '🔧 En traitement',
    shipped: '📦 Expédié',
    out_for_delivery: '🚚 En livraison',
    delivered: '🏠 Livré',
    ready_for_pickup: '📍 Prêt pour retrait',
    picked_up: '✓ Retiré',
  };
  return statusMap[status] || status;
}