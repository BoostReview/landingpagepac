import type { Metadata } from "next";
import "./globals.css";
import DSFRInit from "@/components/DSFRInit";

export const metadata: Metadata = {
  title: "Vérifier votre éligibilité aux aides pour l'installation d'une pompe à chaleur",
  description: "Vérifiez votre éligibilité aux aides publiques pour l'installation d'une pompe à chaleur dans le cadre de la rénovation énergétique.",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000091",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Marianne:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <DSFRInit />
        {children}
      </body>
    </html>
  );
}

