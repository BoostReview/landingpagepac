export type TravauxKey = "pac" | "ite" | "fenetres" | "solaire" | "renovation";

export type CampaignContent = {
  key: TravauxKey;
  label: string;
  heroTitle: string;
  heroLead: string;
  infoTitle: string;
  infoIntro: string;
  infoBullets: string[];
  aidesTitle: string;
  aidesLead: string;
  confianceLead: string;
  confianceBody: string;
  footerDesc: string;
};

const COMMON_AIDES = "MaPrimeRénov', CEE et aides locales.";

const CAMPAIGNS: Record<TravauxKey, CampaignContent> = {
  renovation: {
    key: "renovation",
    label: "Rénovation énergétique",
    heroTitle: "Vérifier votre éligibilité aux aides pour vos travaux de rénovation énergétique",
    heroLead:
      "Des dispositifs d'aides publiques existent pour améliorer la performance énergétique de votre logement. Vérifiez votre éligibilité en quelques minutes.",
    infoTitle: "Pourquoi rénover énergétiquement votre logement ?",
    infoIntro:
      "Les travaux de rénovation énergétique améliorent le confort, réduisent la consommation d'énergie et valorisent votre bien.",
    infoBullets: [
      "Réduction des dépenses d'énergie et meilleure stabilité thermique.",
      "Confort accru été comme hiver grâce à une meilleure isolation.",
      "Contribution à la transition énergétique et baisse des émissions.",
    ],
    aidesTitle: "Quelles aides sont disponibles pour vos travaux ?",
    aidesLead: `Plusieurs dispositifs peuvent financer votre projet : ${COMMON_AIDES}`,
    confianceLead: "Démarche encadrée dans le cadre des dispositifs publics de rénovation énergétique.",
    confianceBody:
      "Cette vérification d'éligibilité s'inscrit dans les politiques publiques de transition énergétique. Les informations collectées sont traitées conformément à la réglementation en vigueur sur la protection des données personnelles.",
    footerDesc: "Information sur les aides à la rénovation énergétique.",
  },
  pac: {
    key: "pac",
    label: "Pompe à chaleur",
    heroTitle: "Vérifier votre éligibilité aux aides pour l'installation d'une pompe à chaleur",
    heroLead:
      "Des dispositifs d'aides publiques sont disponibles pour vous accompagner dans l'installation d'une pompe à chaleur. Vérifiez votre éligibilité en quelques minutes.",
    infoTitle: "Qu'est-ce qu'une pompe à chaleur ?",
    infoIntro:
      "Une pompe à chaleur (PAC) utilise les énergies renouvelables présentes dans l'environnement pour produire de la chaleur et chauffer efficacement votre logement.",
    infoBullets: [
      "Réduction significative de la consommation énergétique.",
      "Amélioration de la performance thermique du logement.",
      "Contribution à la transition énergétique.",
    ],
    aidesTitle: "Quelles aides sont disponibles pour une pompe à chaleur ?",
    aidesLead: `Plusieurs dispositifs d'aides publiques peuvent vous accompagner : ${COMMON_AIDES}`,
    confianceLead: "Démarche encadrée dans le cadre des dispositifs publics de rénovation énergétique.",
    confianceBody:
      "Cette vérification d'éligibilité s'inscrit dans les politiques publiques de transition énergétique. Les informations collectées sont traitées conformément à la réglementation en vigueur sur la protection des données personnelles.",
    footerDesc: "Information sur les aides à la rénovation énergétique et l'installation de pompe à chaleur.",
  },
  ite: {
    key: "ite",
    label: "Isolation par l'extérieur",
    heroTitle: "Vérifier votre éligibilité aux aides pour l'isolation par l'extérieur",
    heroLead:
      "Les aides publiques peuvent financer l'isolation thermique par l'extérieur (ITE). Vérifiez votre éligibilité rapidement.",
    infoTitle: "Pourquoi faire une isolation par l'extérieur ?",
    infoIntro:
      "L'ITE améliore l'isolation de votre logement, réduit les pertes de chaleur et améliore le confort.",
    infoBullets: [
      "Réduction des déperditions thermiques sur les façades.",
      "Confort thermique renforcé et économies d'énergie.",
      "Valorisation de votre bien et amélioration de la performance énergétique.",
    ],
    aidesTitle: "Quelles aides sont disponibles pour l'ITE ?",
    aidesLead: `Des aides publiques peuvent financer vos travaux : ${COMMON_AIDES}`,
    confianceLead: "Démarche encadrée dans le cadre des dispositifs publics de rénovation énergétique.",
    confianceBody:
      "Cette vérification d'éligibilité s'inscrit dans les politiques publiques de transition énergétique. Les informations collectées sont traitées conformément à la réglementation en vigueur sur la protection des données personnelles.",
    footerDesc: "Information sur les aides à la rénovation énergétique et l'isolation par l'extérieur.",
  },
  fenetres: {
    key: "fenetres",
    label: "Fenêtres",
    heroTitle: "Vérifier votre éligibilité aux aides pour le remplacement des fenêtres",
    heroLead:
      "Le remplacement des fenêtres améliore l'isolation et peut être financé par des aides publiques. Vérifiez votre éligibilité.",
    infoTitle: "Pourquoi remplacer vos fenêtres ?",
    infoIntro:
      "Des fenêtres performantes réduisent les pertes de chaleur et améliorent le confort acoustique.",
    infoBullets: [
      "Réduction des déperditions thermiques et des courants d'air.",
      "Amélioration du confort et des performances énergétiques.",
      "Valorisation du logement grâce à une meilleure isolation.",
    ],
    aidesTitle: "Quelles aides sont disponibles pour les fenêtres ?",
    aidesLead: `Plusieurs dispositifs peuvent financer vos travaux : ${COMMON_AIDES}`,
    confianceLead: "Démarche encadrée dans le cadre des dispositifs publics de rénovation énergétique.",
    confianceBody:
      "Cette vérification d'éligibilité s'inscrit dans les politiques publiques de transition énergétique. Les informations collectées sont traitées conformément à la réglementation en vigueur sur la protection des données personnelles.",
    footerDesc: "Information sur les aides à la rénovation énergétique et le remplacement des fenêtres.",
  },
  solaire: {
    key: "solaire",
    label: "Panneaux solaires",
    heroTitle: "Vérifier votre éligibilité aux aides pour l'installation de panneaux solaires",
    heroLead:
      "Les aides publiques peuvent soutenir l'installation de panneaux solaires. Vérifiez votre éligibilité en quelques minutes.",
    infoTitle: "Pourquoi installer des panneaux solaires ?",
    infoIntro:
      "Les panneaux solaires permettent de produire une énergie renouvelable et de réduire la facture énergétique.",
    infoBullets: [
      "Production d'une énergie propre et renouvelable.",
      "Réduction de la dépendance énergétique et des factures.",
      "Contribution à la transition énergétique.",
    ],
    aidesTitle: "Quelles aides sont disponibles pour le solaire ?",
    aidesLead: `Des dispositifs existent pour financer votre installation : ${COMMON_AIDES}`,
    confianceLead: "Démarche encadrée dans le cadre des dispositifs publics de rénovation énergétique.",
    confianceBody:
      "Cette vérification d'éligibilité s'inscrit dans les politiques publiques de transition énergétique. Les informations collectées sont traitées conformément à la réglementation en vigueur sur la protection des données personnelles.",
    footerDesc: "Information sur les aides à la rénovation énergétique et l'installation de panneaux solaires.",
  },
};

export const getCampaign = (key?: string): CampaignContent => {
  if (!key) {
    return CAMPAIGNS.renovation;
  }
  const normalized = key.toLowerCase() as TravauxKey;
  return CAMPAIGNS[normalized] ?? CAMPAIGNS.renovation;
};

export const TRAVAUX_LINKS: Array<{ key: TravauxKey; label: string; href: string }> = [
  { key: "pac", label: "Pompe à chaleur", href: "/pac" },
  { key: "ite", label: "Isolation par l'exterieur", href: "/ite" },
  { key: "fenetres", label: "Fenêtres", href: "/fenetres" },
  { key: "solaire", label: "Panneaux solaires", href: "/solaire" },
];
