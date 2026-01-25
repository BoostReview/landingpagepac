"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { TRAVAUX_LINKS } from "@/lib/campaigns";

export default function Header() {
  const pathname = usePathname();
  const [travauxOpen, setTravauxOpen] = useState(false);
  return (
    <header role="banner" className="fr-header">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
              <div className="fr-header__service">
                <Link href="/" title="Accueil - Aides à la rénovation énergétique">
                  <p className="fr-header__service-title">Aides à la rénovation énergétique</p>
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
                <Link className="fr-nav__link" href="/" aria-current={pathname === "/" ? "page" : undefined}>
                  Accueil
                </Link>
              </li>
              <li className="fr-nav__item travaux-menu">
                <button
                  type="button"
                  className="fr-nav__link travaux-menu__btn"
                  aria-expanded={travauxOpen}
                  aria-controls="travaux-menu-list"
                  onClick={() => setTravauxOpen((prev) => !prev)}
                >
                  Travaux
                </button>
                {travauxOpen && (
                  <ul id="travaux-menu-list" className="travaux-menu__list" role="menu">
                    {TRAVAUX_LINKS.map((item) => (
                      <li key={item.key} role="none">
                        <Link
                          className="travaux-menu__link"
                          href={item.href}
                          aria-current={pathname === item.href ? "page" : undefined}
                          role="menuitem"
                          onClick={() => setTravauxOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
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

