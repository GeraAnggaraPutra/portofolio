import { AmbientBackdrop } from "@/components/ambient-backdrop";
import { GameArcade } from "@/components/game-arcade";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { CareerTimeline } from "@/components/career-timeline";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Projects } from "@/components/projects";
import { TechStack } from "@/components/stack";
import { Education } from "@/components/education";

export default function Home() {
  return (
    <>
      <AmbientBackdrop />
      <div className="relative" style={{ zIndex: 2 }}>
        <Navbar />
        <main id="main-content">
          <Hero />
          <About />
          <Projects />
          <CareerTimeline />
          <TechStack />
          <Education />
          <GameArcade />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
