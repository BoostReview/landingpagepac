import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InfoSection from "@/components/InfoSection";
import AidesSection from "@/components/AidesSection";
import LeadForm from "@/components/LeadForm";
import LogosSection from "@/components/LogosSection";
import ConfianceSection from "@/components/ConfianceSection";
import Footer from "@/components/Footer";
import { getCampaign } from "@/lib/campaigns";

export default function TravauxPage({ params }: { params: { travaux: string } }) {
  const content = getCampaign(params.travaux);

  return (
    <>
      <Header />
      <main role="main" id="main">
        <Hero title={content.heroTitle} lead={content.heroLead} />
        <LeadForm travaux={content.key} />
        <AidesSection title={content.aidesTitle} lead={content.aidesLead} />
        <LogosSection />
        <InfoSection title={content.infoTitle} intro={content.infoIntro} bullets={content.infoBullets} />
        <ConfianceSection lead={content.confianceLead} body={content.confianceBody} />
      </main>
      <Footer description={content.footerDesc} />
    </>
  );
}
