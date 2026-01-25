import Link from "next/link";

type FooterProps = {
  description: string;
};

export default function Footer({ description }: FooterProps) {
  return (
    <footer className="fr-footer" role="contentinfo" id="footer">
      <div className="fr-container">
        <div className="fr-footer__body">
          <div className="fr-footer__content">
            <p className="fr-footer__content-desc">{description}</p>
            <ul className="fr-footer__content-list">
              <li className="fr-footer__content-item">
                <Link className="fr-footer__content-link" href="#accessibilite">
                  Accessibilité
                </Link>
              </li>
              <li className="fr-footer__content-item">
                <Link className="fr-footer__content-link" href="#mentions-legales">
                  Mentions légales
                </Link>
              </li>
              <li className="fr-footer__content-item">
                <Link className="fr-footer__content-link" href="#donnees-personnelles">
                  Données personnelles
                </Link>
              </li>
              <li className="fr-footer__content-item">
                <Link className="fr-footer__content-link" href="https://www.service-public.fr" target="_blank" rel="noopener noreferrer">
                  Service public
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="fr-footer__bottom">
          <ul className="fr-footer__bottom-list">
            <li className="fr-footer__bottom-item">
              <Link className="fr-footer__bottom-link" href="#">
                Plan du site
              </Link>
            </li>
            <li className="fr-footer__bottom-item">
              <Link className="fr-footer__bottom-link" href="#">
                Politique de confidentialité
              </Link>
            </li>
          </ul>
          <div className="fr-footer__bottom-copy">
            <p>
              Sauf mention contraire, tous les contenus de ce site sont sous{" "}
              <a
                href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                licence etalab-2.0
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

