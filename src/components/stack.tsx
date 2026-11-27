"use client";

import { useState, type CSSProperties } from "react";
import { skillGroups } from "@/data/portfolio";
import styles from "./stack.module.css";

// Station coordinates in the portfolio data use this track's 1200 × 240 viewBox.
const mainTrack = "M0 139 H370 C400 139 394 114 427 114 H540 C570 114 564 88 598 88 H757 C804 88 799 150 849 150 H957 C988 150 995 170 1022 170 S1053 159 1080 159 H1200";

function Tracks({ activeX }: { activeX: number }) {
  return (
    <svg className={styles.tracks} viewBox="0 0 1200 240" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="stack-grid" width="100" height="48" patternUnits="userSpaceOnUse">
          <path d="M0 48 V0 H100" fill="none" stroke="#ac9270" strokeOpacity=".13" />
          <path d="M-3 0 H3 M0 -3 V3" stroke="#bca584" strokeOpacity=".32" />
        </pattern>
        <linearGradient id="stack-track-ink">
          <stop offset="24%" stopColor="#c9a65f" />
          <stop offset="41%" stopColor="#7fa99a" />
          <stop offset="72%" stopColor="#7fa99a" />
          <stop offset="85%" stopColor="#c77e66" />
        </linearGradient>
        <clipPath id="stack-signal">
          <rect className={styles.signal} x="-6" width="12" height="240" rx="5" style={{ transform: `translateX(${activeX}px)` }} />
        </clipPath>
      </defs>
      <rect width="1200" height="240" fill="url(#stack-grid)" />
      <g fill="none" strokeWidth="3" strokeLinecap="round">
        <path d="M0 154 H46 C67 154 69 139 91 139 M1100 159 H1200" stroke="#bb7965" />
        <path d="M0 147 H51 C71 147 71 139 92 139 M1098 159 C1123 159 1120 171 1148 171 H1200" stroke="#73988a" />
        <path d="M300 139 V172 Q300 202 331 202 H852 Q900 202 900 150" stroke="#a78550" />
        <path d={mainTrack} stroke="url(#stack-track-ink)" />
        <path d={mainTrack} stroke="#ffe8a6" strokeWidth="6" clipPath="url(#stack-signal)" />
      </g>
    </svg>
  );
}

export function TechStack() {
  const [selected, setSelected] = useState(1);

  return (
    <section id="stack" aria-labelledby="stack-heading" className="container-x py-24 sm:py-32">
      <div className={styles.atlas}>
        <header className={styles.heading}>
          <h2 id="stack-heading">Stack</h2>
          <span className={styles.rule} aria-hidden="true" />
          <p>Select a station to explore its tools.</p>
        </header>
        <fieldset className={styles.fieldset}>
          <legend className="sr-only">Technology stations</legend>
          <div className={styles.map} style={{ "--active-index": selected } as CSSProperties}>
            <Tracks activeX={skillGroups[selected].station.x} />
            <span className={styles.mobileSignal} aria-hidden="true" />
            {skillGroups.map((group, index) => {
              const active = index === selected;
              const panelId = `stack-tools-${index}`;
              const position = {
                "--x": `${group.station.x / 1200 * 100}%`,
                "--y": `${group.station.y / 240 * 100}%`,
              } as CSSProperties;
              const Icon = group.icon;

              return (
                <div key={group.title} className={styles.station} style={position}>
                  <label className={styles.control}>
                    <input
                      type="radio"
                      name="stack-station"
                      value={group.title}
                      checked={active}
                      aria-controls={panelId}
                      onChange={() => setSelected(index)}
                    />
                    <span className={styles.face}>
                      <span className={styles.marker} aria-hidden="true" />
                      <span className={styles.name}>{group.title}</span>
                    </span>
                  </label>
                  <div id={panelId} hidden={!active} className={styles.panel}>
                    <div className={styles.ticket} aria-hidden="true"><Icon size={18} />{group.title}</div>
                    <ul className={styles.tools} aria-label={`${group.title} tools`}>
                      {group.items.map(item => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </fieldset>
      </div>
    </section>
  );
}
