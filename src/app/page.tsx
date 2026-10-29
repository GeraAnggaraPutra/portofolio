import { About } from "@/components/about";
import { AmbientParticles } from "@/components/ambient-particles";
import { BackgroundCanvas } from "@/components/background-canvas";
import { Cursor } from "@/components/cursor";
import { Contact } from "@/components/contact";
import { CareerTimeline } from "@/components/career-timeline";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { IncidentLab } from "@/components/incident-lab";
import { Navbar } from "@/components/navbar";
import { Projects } from "@/components/projects";
import { SmoothScroll } from "@/components/smooth-scroll";
import { TechStack } from "@/components/stack";
import { Education } from "@/components/education";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <BackgroundCanvas />
      <AmbientParticles />
      <div className="relative" style={{ zIndex: 2 }}>
        <Navbar />
        <main id="main-content">
          <Hero />
          <About />
          <Projects />
          <IncidentLab />
          <CareerTimeline />
          <TechStack />
          <Education />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
