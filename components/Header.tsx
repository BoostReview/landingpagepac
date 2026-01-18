"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header role="banner" className="fr-header">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
              <div className="fr-header__service">
                <Link href="/" title="Accueil - Aides à l'installation de pompe à chaleur">
                  <p className="fr-header__service-title">Aides à l'installation de pompe à chaleur</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fr-header__menu mobile-menu-hidden">
        <div className="fr-container">
          <nav className="fr-nav" role="navigation" aria-label="Menu principal">
            <ul className="fr-nav__list">
              <li className="fr-nav__item">
                <Link className="fr-nav__link" href="/" aria-current="page">
                  Accueil
                </Link>
              </li>
              <li className="fr-nav__item">
                <Link className="fr-nav__link" href="#demarches">
                  Démarches
                </Link>
              </li>
              <li className="fr-nav__item">
                <Link className="fr-nav__link" href="#aides-energie">
                  Aides énergie
                </Link>
              </li>
              <li className="fr-nav__item">
                <Link className="fr-nav__link" href="#contact">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

