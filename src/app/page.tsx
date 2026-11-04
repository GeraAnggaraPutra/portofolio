import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { CareerTimeline } from "@/components/career-timeline";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { FloatingIsland } from "@/components/floating-island";
import { Navbar } from "@/components/navbar";
import { Projects } from "@/components/projects";
import { TechStack } from "@/components/stack";
import { Education } from "@/components/education";

export default function Home() {
  return (
    <>
      <div className="relative" style={{ zIndex: 2 }}>
        <Navbar />
        <main id="main-content">
          <Hero />
          <About />
          <Projects />
          <FloatingIsland />
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
