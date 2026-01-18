import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InfoSection from "@/components/InfoSection";
import AidesSection from "@/components/AidesSection";
import LeadForm from "@/components/LeadForm";
import LogosSection from "@/components/LogosSection";
import ConfianceSection from "@/components/ConfianceSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main role="main" id="main">
        <Hero />
        <LeadForm />
        <AidesSection />
        <LogosSection />
        <InfoSection />
        <ConfianceSection />
      </main>
      <Footer />
    </>
  );
}

