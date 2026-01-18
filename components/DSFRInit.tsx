"use client";

import { useEffect } from "react";

export default function DSFRInit() {
  useEffect(() => {
    // Initialisation DSFR pour les composants interactifs
    if (typeof window !== "undefined" && (window as any).dsfr) {
      (window as any).dsfr.analytics.start();
    }
  }, []);

  return null;
}


