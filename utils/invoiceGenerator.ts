// utils/invoiceGenerator.ts
import { Address } from "@/sanity/types";

export interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  date: string;
  dueDate: string;
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
}

export function generateInvoiceHTML(data: InvoiceData): string {
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
      max-width: 1000px;
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
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="invoice-header">
      <div class="invoice-title">FACTURE</div>
      <div class="invoice-subtitle">Document officiel de transaction</div>
    </div>
    <div class="invoice-body">
      <div class="company-info">
        <div class="company-details">
          <h3>KUAKU MARKET</h3>
          <p>123 Avenue Principale, Douala, Cameroun</p>
          <p>Tél: +237 6XX XXX XXX</p>
          <p>Email: contact@kuakumarket.com</p>
        </div>
        <div class="invoice-details">
          <p><strong>Facture N°:</strong> ${data.invoiceNumber}</p>
          <p><strong>Commande N°:</strong> ${data.orderNumber}</p>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Date d'échéance:</strong> ${data.dueDate}</p>
        </div>
      </div>
      <div class="customer-info">
        <h4>Facturé à :</h4>
        <div class="customer-details">
          <p><strong>Nom:</strong> ${data.customer.name}</p>
          <p><strong>Email:</strong> ${data.customer.email}</p>
          <p><strong>Téléphone:</strong> ${data.customer.phone}</p>
        </div>
      </div>
      <table class="items-table">
        <thead><tr><th>Description</th><th class="text-right">Qté</th><th class="text-right">Prix unitaire</th><th class="text-right">Total</th></tr></thead>
        <tbody>
          ${data.items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td class="text-right">${item.quantity}</td>
              <td class="text-right">${formatPrice(item.unitPrice)}</td>
              <td class="text-right">${formatPrice(item.total)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="summary">
        <table class="summary-table">
          <tr><td>Sous-total</td><td class="text-right">${formatPrice(data.subtotal)}</td></tr>
          <tr><td>Remise</td><td class="text-right">${formatPrice(data.discount)}</td></tr>
          <tr class="total"><td>Total</td><td class="text-right">${formatPrice(data.total)}</td></tr>
        </table>
      </div>
      <div class="payment-info">
        <h4>Informations de paiement</h4>
        <p><strong>Mode de paiement:</strong> ${data.paymentMethod === 'mtn' ? 'MTN Money' : 'Orange Money'}</p>
        <p><strong>Statut:</strong> ${data.paymentStatus === 'paid' ? 'Payé' : 'En attente'}</p>
        <p><strong>ID Transaction:</strong> ${data.transactionId}</p>
      </div>
      <div class="footer">
        <p>Merci de votre confiance !</p>
        <p>Cette facture est générée automatiquement.</p>
      </div>
    </div>
  </div>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF'
  }).format(price);
}