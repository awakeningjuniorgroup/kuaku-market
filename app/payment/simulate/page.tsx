"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SimulatePaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderNumber = searchParams.get("order") || "unknown";
  const amountParam = searchParams.get("amount") || "0";
  const method = searchParams.get("method") || "mtn";

  const amount = Number(amountParam);

  const confirmationCode = Math.floor(Math.random() * 1000000);
  const merchantCode = Math.floor(Math.random() * 1000000);

  const ussdCode =
    method === "mtn"
      ? `*126*${merchantCode}*${amount}#`
      : `#144*${merchantCode}*${amount}#`;

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) {
      router.push(`/success?orderNumber=${orderNumber}&sim=true`);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, orderNumber, router]);

  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 24,
          padding: 32,
          maxWidth: 500,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          animation: "fadeIn 0.5s ease",
        }}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scale {
            0% { transform: scale(0); }
            80% { transform: scale(1.1); }
            100% { transform: scale(1); }
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
          .btn {
            background: #4caf50;
            color: white;
            border: none;
            padding: 14px 28px;
            border-radius: 40px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            transition: all 0.2s;
            margin-top: 16px;
          }
          .btn:hover {
            background: #43a047;
            transform: translateY(-2px);
          }
          .btn-secondary {
            background: #e2e8f0;
            color: #4a5568;
            margin-top: 12px;
            width: 100%;
            padding: 14px 28px;
            border-radius: 40px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
          }
          .btn-secondary:hover {
            background: #cbd5e0;
            transform: translateY(-2px);
          }
          @media (max-width: 480px) {
            div[style*="padding: 32px"] {
              padding: 24px !important;
            }
            h1 {
              font-size: 24px !important;
            }
            .amount {
              font-size: 28px !important;
            }
          }
        `}</style>

        <div className="icon" aria-hidden="true">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 style={{ fontSize: 28, marginBottom: 12, color: "#1a202c" }}>
          Paiement prêt !
        </h1>
        <p style={{ color: "#718096" }}>Mode développement - Test réussi</p>

        <div
          className="amount"
          style={{
            fontSize: 36,
            fontWeight: "bold",
            color: "#4caf50",
            margin: "16px 0",
          }}
        >
          {amount.toLocaleString()} FCFA
        </div>

        <div
          style={{
            background: "#f7fafc",
            borderRadius: 16,
            padding: 20,
            margin: "24px 0",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <span style={{ color: "#718096", fontWeight: 500 }}>
              Mode de paiement
            </span>
            <span style={{ color: "#2d3748", fontWeight: 600 }}>
              {method === "mtn" ? "📱 MTN Money" : "🟠 Orange Money"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <span style={{ color: "#718096", fontWeight: 500 }}>
              Numéro de commande
            </span>
            <span style={{ color: "#2d3748", fontWeight: 600 }}>
              {orderNumber?.substring(0, 8)}...
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
            }}
          >
            <span style={{ color: "#718096", fontWeight: 500 }}>
              Code confirmation
            </span>
            <span style={{ color: "#2d3748", fontWeight: 600 }}>
              {confirmationCode}
            </span>
          </div>
        </div>

        <div
          style={{
            background: "#edf2f7",
            padding: 16,
            borderRadius: 12,
            textAlign: "center",
            margin: "16px 0",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#718096",
              marginBottom: 8,
            }}
          >
            Code USSD à composer
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 20,
              fontWeight: "bold",
              letterSpacing: 2,
              color: "#2d3748",
            }}
          >
            {ussdCode}
          </div>
        </div>

        <button
          className="btn"
          onClick={() =>
            router.push(`/success?orderNumber=${orderNumber}&sim=true`)
          }
          type="button"
        >
          ✅ Confirmer la commande
        </button>

        <button
          className="btn-secondary"
          onClick={() => router.push("/cart")}
          type="button"
        >
          🔄 Annuler et retourner
        </button>

        <div
          style={{ marginTop: 20, fontSize: 14, color: "#a0aec0" }}
          aria-live="polite"
        >
          ⏳ Redirection automatique dans <span>{countdown}</span> secondes...
        </div>
      </div>
    </div>
  );
}
