import { LeadFormData, FormErrors } from "./types";

export function validateStep1(data: LeadFormData): FormErrors {
  const errors: FormErrors = {};
  
  if (!data.typeLogement) {
    errors.typeLogement = "Veuillez sélectionner le type de logement.";
  }
  
  if (!data.residenceType) {
    errors.residenceType = "Veuillez indiquer le type de résidence.";
  }
  
  return errors;
}

export function validateStep2(data: LeadFormData): FormErrors {
  const errors: FormErrors = {};
  
  if (!data.codePostal) {
    errors.codePostal = "Le code postal est obligatoire.";
  } else if (!/^\d{5}$/.test(data.codePostal)) {
    errors.codePostal = "Le code postal doit contenir 5 chiffres.";
  }
  
  if (!data.anneeConstruction) {
    errors.anneeConstruction = "L'année de construction est obligatoire.";
  } else if (!/^\d{4}$/.test(data.anneeConstruction)) {
    errors.anneeConstruction = "L'année doit contenir 4 chiffres.";
  } else {
    const year = parseInt(data.anneeConstruction, 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1800 || year > currentYear + 1) {
      errors.anneeConstruction = `Veuillez saisir une année valide (entre 1800 et ${currentYear + 1}).`;
    }
  }
  
  return errors;
}

export function validateStep3(data: LeadFormData): FormErrors {
  const errors: FormErrors = {};
  
  if (!data.chauffageActuel) {
    errors.chauffageActuel = "Veuillez sélectionner votre système de chauffage actuel.";
  }
  
  return errors;
}

export function validateStep4(data: LeadFormData): FormErrors {
  const errors: FormErrors = {};
  
  if (!data.nom || data.nom.trim().length < 2) {
    errors.nom = "Le nom doit contenir au moins 2 caractères.";
  }
  
  if (!data.prenom || data.prenom.trim().length < 2) {
    errors.prenom = "Le prénom doit contenir au moins 2 caractères.";
  }
  
  if (!data.telephone) {
    errors.telephone = "Le numéro de téléphone est obligatoire.";
  } else {
    // Nettoyer le numéro de téléphone : enlever espaces, points, tirets, plus
    const phoneCleaned = data.telephone.replace(/[\s.\-+]/g, "");
    
    // Validation téléphone français : 10 chiffres commençant par 0
    // ou 9 chiffres si on enlève le 0 initial
    if (!/^0[1-9]\d{8}$/.test(phoneCleaned) && !/^[1-9]\d{8}$/.test(phoneCleaned)) {
      errors.telephone = "Veuillez saisir un numéro de téléphone valide (10 chiffres).";
    }
  }
  
  return errors;
}

export function validateAllSteps(data: LeadFormData): FormErrors {
  return {
    ...validateStep1(data),
    ...validateStep2(data),
    ...validateStep3(data),
    ...validateStep4(data),
  };
}

