import { About } from "@/components/about";
import { BackgroundCanvas } from "@/components/background-canvas";
import { Cursor } from "@/components/cursor";
import { Contact } from "@/components/contact";
import { ExperienceTimeline } from "@/components/experience";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Projects } from "@/components/projects";
import { SmoothScroll } from "@/components/smooth-scroll";
import { SystemFlow } from "@/components/system-flow";
import { TechStack } from "@/components/stack";
import { TechnicalNotes } from "@/components/notes";
import { Education } from "@/components/education";
import { ValueProps } from "@/components/value-props";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <BackgroundCanvas />
      <div className="relative" style={{ zIndex: 2 }}>
        <Navbar />
        <main>
          <Hero />
          <About />
          <SystemFlow />
          <Projects />
          <ValueProps />
          <ExperienceTimeline />
          <TechStack />
          <Education />
          <TechnicalNotes />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
