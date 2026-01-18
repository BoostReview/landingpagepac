export default function AidesSection() {
  return (
    <section className="section-spacing" id="aides-energie" style={{ backgroundColor: "#f6f6f6" }}>
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12">
            <h2 className="fr-h2 fr-text--center fr-mb-3w">Quelles aides sont disponibles ?</h2>
            <p className="fr-text fr-text--center fr-mt-3w fr-mb-4w fr-mb-md-5w">
              Plusieurs dispositifs d'aides publiques peuvent vous accompagner dans votre projet d'installation d'une pompe à chaleur.
            </p>
          </div>
        </div>
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12 fr-col-md-4 fr-mb-3w fr-mb-md-0">
            <div className="card-dsfr">
              <h3 className="fr-h4 fr-mb-2w">MaPrimeRénov'</h3>
              <p className="fr-text">
                Dispositif d'aide à la rénovation énergétique des logements. Le montant de l'aide varie selon vos ressources et les performances de l'équipement installé.
              </p>
            </div>
          </div>
          <div className="fr-col-12 fr-col-md-4 fr-mb-3w fr-mb-md-0">
            <div className="card-dsfr">
              <h3 className="fr-h4 fr-mb-2w">Certificats d'Économies d'Énergie (CEE)</h3>
              <p className="fr-text">
                Aides financières versées par les fournisseurs d'énergie dans le cadre de leurs obligations. Ces aides peuvent être cumulées avec MaPrimeRénov'.
              </p>
            </div>
          </div>
          <div className="fr-col-12 fr-col-md-4">
            <div className="card-dsfr">
              <h3 className="fr-h4 fr-mb-2w">Aides locales</h3>
              <p className="fr-text">
                Certaines collectivités territoriales proposent des aides complémentaires pour la rénovation énergétique. Renseignez-vous auprès de votre commune ou de votre région.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

