"use client";

export default function Hero() {
  const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const formElement = document.getElementById("formulaire-eligibilite");
    if (formElement) {
      formElement.setAttribute("tabindex", "-1");
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        (formElement as HTMLElement).focus();
      }, 500);
    }
  };

  return (
    <section className="fr-py-6w fr-py-md-8w section-spacing" style={{ backgroundColor: "#f6f6f6" }}>
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-10 fr-col-lg-8">
            <h1 className="fr-h1 fr-mb-2w">
              Vérifier votre éligibilité aux aides pour l'installation d'une pompe à chaleur
            </h1>
            <p className="fr-text--lead fr-mt-3w fr-mb-4w">
              Dans le cadre de la transition énergétique, des dispositifs d'aides publiques sont disponibles pour vous accompagner dans l'installation d'une pompe à chaleur. Vérifiez votre éligibilité en quelques minutes.
            </p>
            <div className="fr-mt-4w fr-mt-md-5w">
              <a
                href="#formulaire-eligibilite"
                className="fr-btn fr-btn--primary fr-btn--lg"
                onClick={scrollToForm}
                aria-label="Accéder au formulaire d'éligibilité"
              >
                Vérifier mon éligibilité
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

