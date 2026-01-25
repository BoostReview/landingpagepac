type InfoSectionProps = {
  title: string;
  intro: string;
  bullets: string[];
};

export default function InfoSection({ title, intro, bullets }: InfoSectionProps) {
  return (
    <section className="section-spacing" id="demarches">
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-10 fr-col-lg-8">
            <h2 className="fr-h2 fr-mb-3w">{title}</h2>
            <p className="fr-text fr-mt-3w">
              {intro}
            </p>
            <p className="fr-text fr-mt-2w fr-mb-2w">
              Les principaux avantages :
            </p>
            <ul className="fr-list fr-mt-3w">
              {bullets.map((bullet) => (
                <li key={bullet} className="fr-text">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

