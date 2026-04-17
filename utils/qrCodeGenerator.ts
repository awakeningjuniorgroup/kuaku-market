// utils/qrCodeGenerator.ts
import QRCode from 'qrcode';

export async function generateOrderQRCode(data: any): Promise<string> {
  try {
    // Créer l'URL de suivi
    const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/track-order/${data.orderNumber}?code=${data.pickupCode}`;
    
    // Générer le QR code en DataURL
    const qrCodeDataURL = await QRCode.toDataURL(trackingUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating order QR code:', error);
    throw error;
  }
}

export async function generatePickupQRCode(orderNumber: string, pickupCode: string): Promise<string> {
  try {
    // Créer l'URL de retrait
    const pickupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pickup/${orderNumber}?code=${pickupCode}`;
    
    // Générer le QR code en DataURL
    const qrCodeDataURL = await QRCode.toDataURL(pickupUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating pickup QR code:', error);
    throw error;
  }
}

export async function generateInvoiceQRCode(data: any): Promise<string> {
  try {
    const qrData = JSON.stringify({
      orderNumber: data.orderNumber,
      trackingNumber: data.trackingNumber,
      pickupCode: data.pickupCode,
      customerName: data.customerName,
      total: data.total,
    });
    
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating invoice QR code:', error);
    throw error;
  }
}