# Landing page PAC - Aides à l'installation de pompe à chaleur

Landing page de génération de leads pour les aides à l'installation de Pompe à Chaleur (PAC), conforme au Design System de l'État français (DSFR).

## Caractéristiques

- **Design conforme DSFR** : Rendu visuel et UX strictement identique à un site officiel français (.gouv.fr)
- **Accessibilité RGAA** : Structure sémantique, attributs ARIA, navigation au clavier
- **Formulaire multi-étapes** : 4 étapes avec validation complète
- **Responsive** : Mobile-first, adapté à tous les écrans
- **TypeScript** : Typage strict pour une meilleure maintenabilité

## Technologies

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- DSFR (@gouvfr/dsfr)

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Lancer le serveur de développement :
```bash
npm run dev
```

3. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du projet

```
.
├── app/
│   ├── api/
│   │   └── leads/
│   │       └── route.ts      # API route pour soumission formulaire
│   ├── globals.css           # Styles globaux DSFR
│   ├── layout.tsx            # Layout racine avec intégration DSFR
│   └── page.tsx              # Page principale
├── components/
│   ├── Header.tsx            # Header type .gouv.fr
│   ├── Footer.tsx            # Footer institutionnel
│   ├── Hero.tsx              # Section hero
│   ├── InfoSection.tsx       # Section "Qu'est-ce qu'une PAC ?"
│   ├── AidesSection.tsx      # Section des aides disponibles
│   ├── LeadForm.tsx          # Formulaire multi-étapes
│   └── ConfianceSection.tsx  # Section de rassurance
└── lib/
    ├── types.ts              # Types TypeScript
    └── form-validation.ts    # Validation des champs
```

## Formulaire

Le formulaire comprend 4 étapes :

1. **Type de logement** : Maison/Appartement, Résidence principale/secondaire
2. **Localisation** : Code postal, Année de construction
3. **Chauffage actuel** : Gaz, Électricité, Fioul, Bois, Autre
4. **Coordonnées** : Nom, Prénom, Téléphone

## API

L'endpoint `/api/leads` accepte les requêtes POST avec les données du formulaire. Les données sont validées avant traitement.

## Accessibilité

- Structure HTML5 sémantique
- Attributs ARIA appropriés
- Navigation au clavier fonctionnelle
- Messages d'erreur associés aux champs
- Contraste de couleurs conforme RGAA

## Licence

Ce projet est un exemple de landing page conforme au DSFR.


