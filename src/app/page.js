import Nav from "@/components/Nav/Nav";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Hero from "@/components/Hero/Hero";
import WhoIAm from "@/components/WhoIAm/WhoIAm";
import WhatIBuild from "@/components/WhatIBuild/WhatIBuild";
import Work from "@/components/Work/Work";
import DataStory from "@/components/DataStory/DataStory";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";

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
        <Contact />
      </main>
      <Footer />
    </>
  );
}
