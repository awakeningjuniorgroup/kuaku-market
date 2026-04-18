// utils/qrGenerator.ts
import QRCode from "qrcode";

export interface QRData {
  orderNumber: string;
  trackingNumber: string;
  customerName: string;
  customerPhone: string;
  pickupCode: string;
  deliveryStatus: string;
  createdAt: string;
  expectedDeliveryDate: string;
  totalAmount?: number;
}

/**
 * Génère un QR code complet pour le suivi de commande
 * @param data - Les données de la commande
 * @returns QR code en format base64 dataURL
 */
export async function generateOrderQRCode(data: QRData): Promise<string> {
  try {
    // Créer l'URL de suivi complète
    const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/track-order/${data.orderNumber}?code=${data.pickupCode}`;
    
    // Données à encoder dans le QR code
    const qrData = {
      orderNumber: data.orderNumber,
      trackingNumber: data.trackingNumber,
      pickupCode: data.pickupCode,
      trackingUrl: trackingUrl,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      deliveryStatus: data.deliveryStatus,
      createdAt: data.createdAt,
      expectedDeliveryDate: data.expectedDeliveryDate,
      totalAmount: data.totalAmount,
    };

    // Générer le QR code en base64
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    return qrCode;
  } catch (error) {
    console.error("Error generating order QR code:", error);
    throw error;
  }
}

/**
 * Génère un QR code spécifique pour le retrait de la commande
 * @param orderNumber - Numéro de la commande
 * @param pickupCode - Code de retrait unique
 * @returns QR code en format base64 dataURL
 */
export async function generatePickupQRCode(orderNumber: string, pickupCode: string): Promise<string> {
  try {
    // Créer l'URL de retrait
    const pickupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pickup/${orderNumber}?code=${pickupCode}`;
    
    // Données pour le QR code de retrait
    const pickupData = {
      orderNumber: orderNumber,
      pickupCode: pickupCode,
      pickupUrl: pickupUrl,
      timestamp: new Date().toISOString(),
    };
    
    const qrCode = await QRCode.toDataURL(JSON.stringify(pickupData), {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 250,
      color: {
        dark: '#1e3c72',
        light: '#ffffff'
      }
    });

    return qrCode;
  } catch (error) {
    console.error("Error generating pickup QR code:", error);
    throw error;
  }
}

/**
 * Génère un QR code simple pour un texte ou une URL
 * @param text - Texte ou URL à encoder
 * @param size - Taille du QR code (défaut: 200)
 * @returns QR code en format base64 dataURL
 */
export async function generateSimpleQRCode(text: string, size: number = 200): Promise<string> {
  try {
    const qrCode = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: size,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    return qrCode;
  } catch (error) {
    console.error("Error generating simple QR code:", error);
    throw error;
  }
}

/**
 * Génère un QR code pour le suivi en format image buffer (pour API)
 * @param data - Les données de la commande
 * @returns Buffer du QR code
 */
export async function generateOrderQRCodeBuffer(data: QRData): Promise<Buffer> {
  try {
    const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/track-order/${data.orderNumber}?code=${data.pickupCode}`;
    
    const qrData = {
      orderNumber: data.orderNumber,
      trackingNumber: data.trackingNumber,
      pickupCode: data.pickupCode,
      trackingUrl: trackingUrl,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
    };

    const qrBuffer = await QRCode.toBuffer(JSON.stringify(qrData), {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300,
      type: 'png',
    });

    return qrBuffer;
  } catch (error) {
    console.error("Error generating order QR code buffer:", error);
    throw error;
  }
}

/**
 * Génère un QR code de retrait en format image buffer (pour API)
 * @param orderNumber - Numéro de la commande
 * @param pickupCode - Code de retrait
 * @returns Buffer du QR code
 */
export async function generatePickupQRCodeBuffer(orderNumber: string, pickupCode: string): Promise<Buffer> {
  try {
    const pickupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pickup/${orderNumber}?code=${pickupCode}`;
    
    const qrBuffer = await QRCode.toBuffer(pickupUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 250,
      type: 'png',
    });

    return qrBuffer;
  } catch (error) {
    console.error("Error generating pickup QR code buffer:", error);
    throw error;
  }
}