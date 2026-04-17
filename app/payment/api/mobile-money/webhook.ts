import type { NextApiRequest, NextApiResponse } from "next";

// Exemple de gestion de webhook Mobile Money
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Exemple : valider la signature ou token envoyé par l'opérateur (à adapter selon doc API)
  const signature = req.headers["x-signature"] || req.headers["x-api-key"];
  if (!signature || signature !== process.env.MOBILE_MONEY_WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const event = req.body;

  // Traitez ici la notification de paiement
  // Par exemple, vérifier le statut, mettre à jour la commande dans votre base de données
  console.log("Received Mobile Money webhook event:", event);

  // Répondre rapidement pour confirmer la réception
  res.status(200).json({ status: "received" });
}
