// app/api/test-kuaku/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const kuakuUrl = process.env.KUAKU_API_URL || "https://api.kuakumarket.com/v1";
  const primaryKey = process.env.KUAKU_PRIMARY_KEY;
  const secondaryKey = process.env.KUAKU_SECONDARY_KEY;

  // Test de connexion à Kuaku
  try {
    const response = await fetch(`${kuakuUrl}/health`, {
      method: "GET",
      headers: {
        "X-Primary-Key": primaryKey || "",
        "X-Secondary-Key": secondaryKey || "",
      },
    });

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      message: response.ok ? "Kuaku API accessible" : "Erreur de connexion",
      config: {
        hasPrimaryKey: !!primaryKey,
        hasSecondaryKey: !!secondaryKey,
        apiUrl: kuakuUrl,
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      config: {
        hasPrimaryKey: !!primaryKey,
        hasSecondaryKey: !!secondaryKey,
        apiUrl: kuakuUrl,
      }
    });
  }
}