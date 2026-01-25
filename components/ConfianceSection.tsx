type ConfianceSectionProps = {
  lead: string;
  body: string;
};

export default function ConfianceSection({ lead, body }: ConfianceSectionProps) {
  return (
    <section className="section-spacing" id="contact" style={{ backgroundColor: "#f6f6f6" }}>
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-10 fr-col-lg-8">
            <div className="fr-text--center">
              <p className="fr-text--lead fr-mb-3w">
                {lead}
              </p>
              <p className="fr-text">
                {body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

