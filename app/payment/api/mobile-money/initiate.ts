import type { NextApiRequest, NextApiResponse } from "next";

// Exemple de fonction pour appeler l'API Mobile Money de l'opérateur
async function callMobileMoneyAPI(phone: string, amount: number, orderId: string): Promise<{ paymentUrl: string }> {
  const payload = {
    amount,
    currency: "XAF",
    customerPhone: phone,
    externalId: orderId,
  };

  const response = await fetch("https://api.orange.com/orange-money-webpay/v1/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ORANGE_MONEY_ACCESS_TOKEN}`, // clé API dans .env
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mobile Money API error: ${errorText}`);
  }

  const data = await response.json();
  return { paymentUrl: data.paymentUrl }; // selon API réelle
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone, amount, orderId } = req.body;

  if (!phone || !amount || !orderId) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const { paymentUrl } = await callMobileMoneyAPI(phone, amount, orderId);
    return res.status(200).json({ paymentUrl });
  } catch (error: any) {
    console.error("Payment initiation error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
