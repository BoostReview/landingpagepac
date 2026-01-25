import { NextRequest, NextResponse } from "next/server";

interface LeadFormData {
  statutOccupation: "proprietaire" | "locataire";
  typeLogement: "maison" | "appartement";
  nomComplet: string;
  telephone: string;
  codePostal: string;
  adresse: string;
  email?: string;
  travaux?: "pac" | "ite" | "fenetres" | "solaire" | "renovation";
  chauffageType?: "electrique" | "gaz" | "fioul" | "bois" | "pac" | "autre";
  chauffageConso?: string;
  leadId?: string;
  otpVerified?: boolean;
  otpStatus?: "pending" | "verified";
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadFormData = await request.json();

    // Validation nom complet
    if (!body.nomComplet || body.nomComplet.trim().length < 3) {
      return NextResponse.json(
        { error: "Le nom et prénom doivent contenir au moins 3 caractères." },
        { status: 400 }
      );
    }

    // Validation travaux
    if (
      !body.travaux ||
      !["pac", "ite", "fenetres", "solaire", "renovation"].includes(body.travaux)
    ) {
      return NextResponse.json(
        { error: "Le type de travaux est obligatoire." },
        { status: 400 }
      );
    }

    // Validation chauffage si fourni
    if (body.chauffageType) {
      const allowed = ["electrique", "gaz", "fioul", "bois", "pac", "autre"];
      if (!allowed.includes(body.chauffageType)) {
        return NextResponse.json(
          { error: "Le type de chauffage est invalide." },
          { status: 400 }
        );
      }
    }

    if (body.chauffageConso) {
      const consoNumeric = Number(body.chauffageConso);
      if (Number.isNaN(consoNumeric) || consoNumeric <= 0) {
        return NextResponse.json(
          { error: "La consommation mensuelle doit être un montant valide." },
          { status: 400 }
        );
      }
    }

    // Validation statut d'occupation
    if (body.statutOccupation !== "proprietaire" && body.statutOccupation !== "locataire") {
      return NextResponse.json(
        { error: "Le statut d'occupation est obligatoire." },
        { status: 400 }
      );
    }

    // Validation type de logement
    if (body.typeLogement !== "maison" && body.typeLogement !== "appartement") {
      return NextResponse.json(
        { error: "Le type de logement est obligatoire." },
        { status: 400 }
      );
    }

    // Validation téléphone
    if (!body.telephone) {
      return NextResponse.json(
        { error: "Le numéro de téléphone est obligatoire." },
        { status: 400 }
      );
    }

    // Nettoyer le téléphone (enlever les espaces)
    const telephoneCleaned = body.telephone.replace(/\s/g, "");
    
    // Validation téléphone : 10 chiffres
    if (!/^0[1-9]\d{8}$/.test(telephoneCleaned)) {
      return NextResponse.json(
        { error: "Veuillez saisir un numéro de téléphone valide (10 chiffres)." },
        { status: 400 }
      );
    }

    // Validation code postal
    if (!body.codePostal) {
      return NextResponse.json(
        { error: "Le code postal est obligatoire." },
        { status: 400 }
      );
    }

    if (!/^\d{5}$/.test(body.codePostal)) {
      return NextResponse.json(
        { error: "Le code postal doit contenir 5 chiffres." },
        { status: 400 }
      );
    }

    // Validation adresse
    if (!body.adresse || body.adresse.trim().length < 5) {
      return NextResponse.json(
        { error: "L'adresse doit contenir au moins 5 caractères." },
        { status: 400 }
      );
    }

    // Validation email si fourni
    if (body.email && body.email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { error: "Veuillez saisir une adresse email valide." },
          { status: 400 }
        );
      }
    }

    // Ici, vous pouvez ajouter la logique pour sauvegarder les données
    // Par exemple : envoi à un CRM, base de données, email, etc.
    
    console.log("Lead reçu:", {
      leadId: body.leadId || "",
      statutOccupation: body.statutOccupation,
      typeLogement: body.typeLogement,
      travaux: body.travaux,
      chauffageType: body.chauffageType || "",
      chauffageConso: body.chauffageConso || "",
      nomComplet: body.nomComplet.trim(),
      telephone: telephoneCleaned,
      codePostal: body.codePostal,
      adresse: body.adresse.trim(),
      email: body.email?.trim() || "",
      otpVerified: body.otpVerified === true,
      otpStatus: body.otpStatus || "",
      date: new Date().toISOString(),
    });

    // Réponse de succès
    return NextResponse.json(
      {
        success: true,
        message: "Votre demande a été enregistrée avec succès.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors du traitement de la demande:", error);
    return NextResponse.json(
      {
        error: "Une erreur est survenue lors du traitement de votre demande.",
      },
      { status: 500 }
    );
  }
}
