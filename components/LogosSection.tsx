"use client";

export default function LogosSection() {
  return (
    <section className="section-spacing" style={{ backgroundColor: "#ffffff" }}>
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12">
            <h2 className="fr-h3 fr-text--center fr-mb-4w">Dispositifs et certifications</h2>
            <p className="fr-text fr-text--center fr-mb-5w">
              Ce service s'inscrit dans le cadre des dispositifs publics de rénovation énergétique.
            </p>
            
            {/* Logos officiels */}
            <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
              {/* MaPrimeRénov' */}
              <div className="fr-col-6 fr-col-md-3 fr-mb-3w fr-mb-md-0">
                <div className="logo-container" style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  padding: "1.5rem",
                  border: "1px solid #e5e5e5",
                  borderRadius: "4px",
                  height: "100%",
                  minHeight: "120px"
                }}>
                  <div style={{ textAlign: "center", width: "100%" }}>
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/fr/thumb/d/d5/Maprimerenov_logo.jpg/1280px-Maprimerenov_logo.jpg?20221021134710"
                      alt="MaPrimeRénov'"
                      style={{ 
                        maxWidth: "100%", 
                        height: "auto",
                        maxHeight: "80px",
                        objectFit: "contain",
                        display: "block",
                        margin: "0 auto"
                      }}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const fallback = target.nextElementSibling as HTMLElement | null;
                        if (fallback) {
                          fallback.classList.remove("hidden");
                          fallback.style.display = "block";
                        }
                      }}
                    />
                    <div className="hidden" style={{ 
                      fontSize: "1.25rem", 
                      fontWeight: "700", 
                      color: "#000091",
                      marginTop: "0.5rem"
                    }}>
                      MaPrimeRénov'
                    </div>
                  </div>
                </div>
              </div>

              {/* CEE */}
              <div className="fr-col-6 fr-col-md-3 fr-mb-3w fr-mb-md-0">
                <div className="logo-container" style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  padding: "1.5rem",
                  border: "1px solid #e5e5e5",
                  borderRadius: "4px",
                  height: "100%",
                  minHeight: "120px"
                }}>
                  <div style={{ textAlign: "center", width: "100%" }}>
                    <img 
                      src="https://cdn.prod.website-files.com/66a1412dd5a5e17166b0ef32/686255927dc248a0aa4c2720_logo-cee.webp"
                      alt="Certificats d'Économies d'Énergie"
                      style={{ 
                        maxWidth: "100%", 
                        height: "auto",
                        maxHeight: "80px",
                        objectFit: "contain",
                        display: "block",
                        margin: "0 auto"
                      }}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const fallback = target.nextElementSibling as HTMLElement | null;
                        if (fallback) {
                          fallback.classList.remove("hidden");
                          fallback.style.display = "block";
                        }
                      }}
                    />
                    <div className="hidden" style={{ 
                      fontSize: "1.1rem", 
                      fontWeight: "700", 
                      color: "#000091",
                      marginTop: "0.5rem"
                    }}>
                      CEE
                    </div>
                  </div>
                </div>
              </div>

              {/* RGE */}
              <div className="fr-col-6 fr-col-md-3 fr-mb-3w fr-mb-md-0">
                <div className="logo-container" style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  padding: "1.5rem",
                  border: "1px solid #e5e5e5",
                  borderRadius: "4px",
                  height: "100%",
                  minHeight: "120px"
                }}>
                  <div style={{ textAlign: "center", width: "100%" }}>
                    <img 
                      src="https://www.rocket.eu/wp-content/uploads/2021/06/RGE-950x280.jpg"
                      alt="Reconnu Garant de l'Environnement - RGE"
                      style={{ 
                        maxWidth: "100%", 
                        height: "auto",
                        maxHeight: "80px",
                        objectFit: "contain",
                        display: "block",
                        margin: "0 auto",
                        width: "auto"
                      }}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = parent.querySelector(".rge-fallback-text") as HTMLElement | null;
                          if (fallback) {
                            fallback.classList.remove("hidden");
                            fallback.style.display = "block";
                          }
                        }
                      }}
                    />
                    <div className="hidden rge-fallback-text" style={{ 
                      fontSize: "1.5rem", 
                      fontWeight: "700", 
                      color: "#000091",
                      marginBottom: "0.5rem"
                    }}>
                      RGE
                    </div>
                    <div className="hidden rge-fallback-text" style={{ fontSize: "0.75rem", color: "#666" }}>
                      Reconnu Garant<br />de l'Environnement
                    </div>
                  </div>
                </div>
              </div>

              {/* France Rénov' */}
              <div className="fr-col-6 fr-col-md-3">
                <div className="logo-container" style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  padding: "1.5rem",
                  border: "1px solid #e5e5e5",
                  borderRadius: "4px",
                  height: "100%",
                  minHeight: "120px"
                }}>
                  <div style={{ textAlign: "center", width: "100%" }}>
                    <img 
                      src="https://www.maison-eco-paysanne.fr/wp-content/uploads/sites/62/2023/10/Logo-France-Renov-1920x971-1.png"
                      alt="France Rénov'"
                      style={{ 
                        maxWidth: "100%", 
                        height: "auto",
                        maxHeight: "80px",
                        objectFit: "contain",
                        display: "block",
                        margin: "0 auto"
                      }}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const fallback = target.nextElementSibling as HTMLElement | null;
                        if (fallback) {
                          fallback.classList.remove("hidden");
                          fallback.style.display = "block";
                        }
                      }}
                    />
                    <div className="hidden" style={{ 
                      fontSize: "1.1rem", 
                      fontWeight: "700", 
                      color: "#000091",
                      marginTop: "0.5rem"
                    }}>
                      France Rénov'
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
