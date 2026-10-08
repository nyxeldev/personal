import Nav from "@/components/Nav/Nav";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Hero from "@/components/Hero/Hero";
import WhoIAm from "@/components/WhoIAm/WhoIAm";
import WhatIBuild from "@/components/WhatIBuild/WhatIBuild";
import Work from "@/components/Work/Work";
import DataStory from "@/components/DataStory/DataStory";
import Decisions from "@/components/Decisions/Decisions";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import CommandCenter from "@/components/CommandCenter/CommandCenter";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <WhoIAm />
        <WhatIBuild />
        <Work />
        <DataStory />
        <Decisions />
        <Contact />
      </main>
      <Footer />
      <CommandCenter />
    </>
  );
}
