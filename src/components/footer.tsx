import { ArrowUp } from "lucide-react";
import Image from "next/image";
import horizon from "@/assets/footer/horizon.webp";
import styles from "./footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.panorama} aria-hidden="true">
        <Image src={horizon} alt="" fill sizes="(max-width: 660px) 660px, 100vw" />
        <div className={styles.farValley} />
        <div className={styles.nearValley} />
      </div>
      <a href="#home" className={styles.backToTop}>
        Back to the top
        <span className={styles.arrow} aria-hidden="true">
          <ArrowUp strokeWidth={1.25} />
        </span>
      </a>
    </footer>
  );
}
