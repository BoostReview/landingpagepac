import { NextRequest, NextResponse } from "next/server";

// Clé API Unimtx
// IMPORTANT: Pour utiliser votre propre clé, créez un fichier .env.local à la racine du projet avec:
// UNIMTX_ACCESS_KEY_ID=votre_cle_complete_ici
const UNIMTX_ACCESS_KEY_ID =
  process.env.UNIMTX_ACCESS_KEY_ID || "4GscLqoQmxGSk6nGK4vF5h";
const UNIMTX_API_URL = "https://api.unimtx.com";

// Stockage temporaire en mémoire (en production, utilisez Redis ou une base de données)
const otpStore = new Map<string, { expiresAt: number; telephone: string; verificationId?: string }>();

// Convertir un numéro français (0X XX XX XX XX) en format E.164 (+33XXXXXXXXX)
function formatInternationalPhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, "");
  if (cleaned.startsWith("0")) {
    return `+33${cleaned.substring(1)}`;
  }
  if (cleaned.startsWith("33")) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith("+33")) {
    return cleaned;
  }
  return `+33${cleaned}`;
}

// Nettoyer les codes expirés
function cleanExpiredOTPs() {
  const now = Date.now();
  otpStore.forEach((value, key) => {
    if (value.expiresAt < now) {
      otpStore.delete(key);
    }
  });
}

// Route POST pour envoyer le code OTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { telephone } = body;

    if (!telephone) {
      return NextResponse.json(
        { error: "Le numéro de téléphone est requis." },
        { status: 400 }
      );
    }

    // Nettoyer le téléphone
    const telephoneCleaned = telephone.replace(/\s/g, "");

    // Validation téléphone
    if (!/^0[1-9]\d{8}$/.test(telephoneCleaned)) {
      return NextResponse.json(
        { error: "Numéro de téléphone invalide." },
        { status: 400 }
      );
    }

    // Nettoyer les codes expirés
    cleanExpiredOTPs();

    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Convertir le numéro en format E.164
    const phoneInternational = formatInternationalPhone(telephoneCleaned);

    try {
      if (!UNIMTX_ACCESS_KEY_ID || UNIMTX_ACCESS_KEY_ID.trim().length === 0) {
        throw new Error("Clé API Unimtx manquante");
      }

      const cleanedAccessKey = UNIMTX_ACCESS_KEY_ID.trim().replace(/\s/g, "");

      const requestBody = {
        to: phoneInternational,
        digits: 4,
      };

      const response = await fetch(
        `${UNIMTX_API_URL}/?action=otp.send&accessKeyId=${encodeURIComponent(
          cleanedAccessKey
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const responseData = await response.json();

      if (!response.ok || responseData.code !== "0") {
        throw new Error(
          responseData.message || "Erreur lors de l'envoi du code OTP."
        );
      }

      otpStore.set(telephoneCleaned, {
        expiresAt,
        telephone: telephoneCleaned,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Code OTP envoyé par SMS.",
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Erreur lors de l'envoi du code OTP via Unimtx:", error);
      return NextResponse.json(
        {
          error: "Une erreur est survenue lors de l'envoi du code OTP.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi du code OTP:", error);
    return NextResponse.json(
      {
        error: "Une erreur est survenue lors de l'envoi du code OTP.",
      },
      { status: 500 }
    );
  }
}

// Route PUT pour vérifier le code OTP
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { telephone, code } = body;

    if (!telephone || !code) {
      return NextResponse.json(
        { error: "Le numéro de téléphone et le code sont requis." },
        { status: 400 }
      );
    }

    // Nettoyer le téléphone
    const telephoneCleaned = telephone.replace(/\s/g, "");
    const phoneInternational = formatInternationalPhone(telephoneCleaned);

    // Nettoyer les codes expirés
    cleanExpiredOTPs();

    // Si on a une entrée locale, vérifier l'expiration (mais ne pas bloquer si absent)
    const stored = otpStore.get(telephoneCleaned);
    if (stored && stored.expiresAt < Date.now()) {
      otpStore.delete(telephoneCleaned);
      return NextResponse.json(
        { error: "Code OTP expiré. Veuillez en demander un nouveau." },
        { status: 400 }
      );
    }

    // Vérifier le code via Unimtx API
    try {
      const cleanedAccessKey = UNIMTX_ACCESS_KEY_ID.trim().replace(/\s/g, "");

      const checkResponse = await fetch(
        `${UNIMTX_API_URL}/?action=otp.verify&accessKeyId=${encodeURIComponent(
          cleanedAccessKey
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: phoneInternational,
            code: String(code).trim(),
          }),
        }
      );

      const checkData = await checkResponse.json();
      const message = typeof checkData?.message === "string" ? checkData.message.toLowerCase() : "";
      const status = typeof checkData?.status === "string" ? checkData.status.toLowerCase() : "";
      const responseCode =
        typeof checkData?.code === "string" ? checkData.code : String(checkData?.code ?? "");
      const isVerified =
        responseCode === "0" &&
        (checkData?.data?.verified === true ||
          checkData?.data?.isValid === true ||
          checkData?.verified === true ||
          checkData?.valid === true) &&
        !message.includes("invalid") &&
        !message.includes("incorrect") &&
        !message.includes("wrong") &&
        !message.includes("expired");

      if (!checkResponse.ok || !isVerified) {
        return NextResponse.json(
          { error: "Code OTP incorrect." },
          { status: 400 }
        );
      }

      otpStore.delete(telephoneCleaned);
      return NextResponse.json(
        {
          success: true,
          message: "Code OTP vérifié avec succès.",
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Erreur lors de la vérification via Unimtx:", error);
      return NextResponse.json(
        { error: "Code OTP incorrect." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la vérification du code OTP:", error);
    return NextResponse.json(
      {
        error: "Une erreur est survenue lors de la vérification du code OTP.",
      },
      { status: 500 }
    );
  }
}

