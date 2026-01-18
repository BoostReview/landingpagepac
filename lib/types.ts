export interface LeadFormData {
  // Étape 1
  typeLogement: "maison" | "appartement" | "";
  residenceType: "principale" | "secondaire" | "";
  
  // Étape 2
  codePostal: string;
  anneeConstruction: string;
  
  // Étape 3
  chauffageActuel: "gaz" | "electricite" | "fioul" | "bois" | "autre" | "";
  
  // Étape 4
  nom: string;
  prenom: string;
  telephone: string;
}

export interface FormErrors {
  typeLogement?: string;
  residenceType?: string;
  codePostal?: string;
  anneeConstruction?: string;
  chauffageActuel?: string;
  nom?: string;
  prenom?: string;
  telephone?: string;
  submit?: string;
}

