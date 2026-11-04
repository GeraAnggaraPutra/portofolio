"use client";

import { useEffect, useRef, useState } from "react";
import { Aperture, Expand, Orbit, Pause, Play, RotateCcw, Sparkles } from "lucide-react";

type Command = "burst" | "assemble" | "orbit" | "palette" | "reset" | "pause";
const palettes = ["Aurora", "Solar", "Amethyst"];

export function CrystalObservatory() {
  const host = useRef<HTMLDivElement>(null);
  const command = useRef<((value: Command) => void) | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [palette, setPalette] = useState(0);
  const [message, setMessage] = useState("Tap the crystal. Something happens every time.");

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let cancelled = false;
    let dispose = () => {};
    const loader = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      loader.disconnect();
      try {
        const T = await import("three");
        if (cancelled) return;
        const renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.domElement.style.cssText = "display:block;width:100%;height:100%;touch-action:pan-y";
        element.appendChild(renderer.domElement);
        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(40, 1, .1, 80);
        camera.position.set(0, 1, 12);
        camera.lookAt(0, 0, 0);
        scene.add(new T.HemisphereLight(0xcceeff, 0x201239, 2));
        const key = new T.DirectionalLight(0xffffff, 4); key.position.set(3, 5, 5); scene.add(key);
        const rim = new T.PointLight(0x8a62ff, 25); rim.position.set(-3, 1, 2); scene.add(rim);
        const group = new T.Group(); scene.add(group);
        const material = new T.MeshStandardMaterial({ color: 0x75e1df, metalness: .65, roughness: .22, flatShading: true, emissive: 0x123d42, emissiveIntensity: .5 });
        const core = new T.Mesh(new T.IcosahedronGeometry(.85, 0), material); group.add(core);
        const shardGeometry = new T.OctahedronGeometry(.5, 0);
        const shards = Array.from({ length: 24 }, (_, i) => {
          const y = 1 - (i / 23) * 2;
          const a = i * 2.399963;
          const direction = new T.Vector3(Math.cos(a) * Math.sqrt(1 - y*y), y, Math.sin(a) * Math.sqrt(1 - y*y));
          const mesh = new T.Mesh(shardGeometry, material);
          mesh.scale.set(.48, 1.5, .48);
          mesh.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), direction);
          group.add(mesh);
          return { mesh, direction };
        });
        const ringMaterial = new T.MeshBasicMaterial({ color: 0x96f5e8, transparent: true, opacity: .5 });
        const ringGeometry = new T.TorusGeometry(2.65, .012, 6, 100);
        const rings = Array.from({ length: 3 }, (_, i) => { const ring = new T.Mesh(ringGeometry, ringMaterial); ring.rotation.set(.5 + i * .8, i * .6, i); scene.add(ring); return ring; });
        const starGeometry = new T.BufferGeometry();
        const stars = new Float32Array(240 * 3);
        for(let i=0;i<240;i++){const a=i*2.399; const r=4+(i%13)*.35; stars[i*3]=Math.cos(a)*r;stars[i*3+1]=Math.sin(a)*r;stars[i*3+2]=-2-(i%7);}
        starGeometry.setAttribute("position",new T.BufferAttribute(stars,3));
        const starMaterial = new T.PointsMaterial({color:0xb4c8ed,size:.025});
        scene.add(new T.Points(starGeometry,starMaterial));
        let scrollTimer: ReturnType<typeof setTimeout> | undefined;
        let scrolling=false;
        let frame=0, visible=true, manualPause=false, radius=1.25, targetRadius=1.25, rotation=0, targetRotation=0, pulse=0, colorIndex=0, last=0;
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const colors=[0x75e1df,0xffbc70,0xc0a0ff];
        const render = (now:number) => {
          frame=0;
          if(cancelled||!visible||document.hidden||scrolling)return;
          const speed=document.documentElement.dataset.calm === "true" ? .25 : 1;
          const dt=Math.min((now-last)/1000 || .016,.04)*speed;last=now;
          const still=motion.matches||manualPause;
          const blend=still?1:1-Math.exp(-dt*7);
          radius+=(targetRadius-radius)*blend;
          rotation+=(targetRotation-rotation)*blend;
          if(!still){group.rotation.y+=dt*.16;group.rotation.z=Math.sin(now*.0002)*.12;pulse*=Math.exp(-dt*3);}
          else pulse=0;
          group.rotation.x=rotation;
          core.scale.setScalar(1+pulse*.25);
          shards.forEach(({mesh,direction},i)=>{mesh.position.copy(direction).multiplyScalar(radius+pulse*.5);if(!still)mesh.rotateY(dt*(i%2?.12:-.12));});
          rings.forEach((ring,i)=>{if(!still)ring.rotation.z+=dt*(i%2?.1:-.08);ring.scale.setScalar(1+pulse*.15);});
          renderer.render(scene,camera);
          if(!still)frame=requestAnimationFrame(render);
        };
        const wake=()=>{if(!frame&&!cancelled&&visible&&!document.hidden&&!scrolling){last=performance.now();frame=requestAnimationFrame(render);}};
        const run=(value:Command)=>{
          if(value==="burst"){targetRadius=3; pulse=1;}
          if(value==="assemble"){targetRadius=1.25;pulse=.7;}
          if(value==="orbit")targetRotation+=Math.PI/2;
          if(value==="palette"){colorIndex=(colorIndex+1)%3;material.color.setHex(colors[colorIndex]);ringMaterial.color.setHex(colors[colorIndex]);rim.color.setHex(colors[colorIndex]);pulse=.8;}
          if(value==="pause")manualPause=!manualPause;
          if(value==="reset"){targetRadius=1.25;targetRotation=0;group.rotation.set(0,0,0);pulse=0;}
          wake();
        };
        command.current=run;
        let startX=0,startY=0;
        const down=(e:PointerEvent)=>{startX=e.clientX;startY=e.clientY;};
        const up=(e:PointerEvent)=>{if(Math.hypot(e.clientX-startX,e.clientY-startY)>8)return; const value=targetRadius>2?"assemble":"burst";run(value);setMessage(value==="burst"?"Supernova — 24 crystal fragments released.":"Gravity restored. The fragments return home.");};
        renderer.domElement.addEventListener("pointerdown",down);renderer.domElement.addEventListener("pointerup",up);
        const fit=()=>{if(!element.clientWidth||!element.clientHeight)return;renderer.setSize(element.clientWidth,element.clientHeight,false);camera.aspect=element.clientWidth/element.clientHeight;camera.position.z=camera.aspect<1?17:12;camera.updateProjectionMatrix();wake();};
        const resize=new ResizeObserver(fit);resize.observe(element);
        const visibility=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;}else wake();});visibility.observe(element);
        const visibilityChange=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else wake();};
        const onScroll=()=>{scrolling=true;cancelAnimationFrame(frame);frame=0;clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{scrolling=false;wake();},160);};
        window.addEventListener("scroll",onScroll,{passive:true});
        document.addEventListener("visibilitychange",visibilityChange);motion.addEventListener("change",wake);
        dispose=()=>{clearTimeout(scrollTimer);window.removeEventListener("scroll",onScroll);cancelAnimationFrame(frame);resize.disconnect();visibility.disconnect();document.removeEventListener("visibilitychange",visibilityChange);motion.removeEventListener("change",wake);renderer.domElement.removeEventListener("pointerdown",down);renderer.domElement.removeEventListener("pointerup",up);core.geometry.dispose();shardGeometry.dispose();ringGeometry.dispose();starGeometry.dispose();material.dispose();ringMaterial.dispose();starMaterial.dispose();renderer.dispose();renderer.domElement.remove();command.current=null;};
        fit();wake();setReady(true);
      } catch { if(!cancelled)setFailed(true); }
    },{rootMargin:"160px"});loader.observe(element);
    return()=>{cancelled=true;loader.disconnect();dispose();};
  },[]);

  const act=(value:Command)=>{
    command.current?.(value);
    const messages={burst:"Supernova — 24 crystal fragments released.",assemble:"Gravity restored. The fragments return home.",orbit:"A new perspective. Rotating the crystal axis.",palette:"A new spectrum washes across the crystal.",reset:"Back to the original constellation.",pause:paused?"Motion resumed.":"Motion paused. You can still use every control."};
    setMessage(messages[value]);
    if(value==="pause")setPaused(!paused);
    if(value==="palette")setPalette((palette+1)%3);
  };
  return <section id="island" className="container-x py-20 sm:py-28" aria-labelledby="crystal-title">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-6"><div><p className="mono text-xs uppercase tracking-[.25em] text-cyan-200">An experiment in light & motion</p><h2 id="crystal-title" className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Beautifully<br/><span className="text-cyan-200">out of orbit.</span></h2></div><p className="max-w-xs text-sm leading-7 text-zinc-400">Break it apart. Bring it together. Change its atmosphere. This little universe responds to you.</p></div>
    <div className="crystal-stage overflow-hidden rounded-[2rem] border border-cyan-200/20">
      <div className="flex items-center justify-between gap-3 px-5 pt-5 sm:px-8"><span className="mono text-xs tracking-widest text-cyan-100">PRISM / OBSERVATORY</span><button disabled={!ready} type="button" onClick={()=>act("pause")} aria-pressed={paused} className="flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-xs text-white disabled:opacity-40">{paused?<Play size={14}/>:<Pause size={14}/>} {paused?"Resume":"Pause"}</button></div>
      <div className="relative h-[380px] sm:h-[520px]">
        <div ref={host} className="absolute inset-0" role="img" aria-label="A rotating faceted crystal surrounded by orbital rings. Use the buttons below to transform it." />
        {!ready&&<div role="status" className="absolute inset-0 grid place-items-center p-8 text-center text-sm text-cyan-100">{failed?"This device could not start 3D. The animated background remains available.":"Preparing your constellation…"}</div>}
        <span className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs tracking-wider text-cyan-100/60">TAP THE SCENE TO RELEASE / RECALL</span>
      </div>
      <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-8">{([{value:"burst",label:"Supernova",hint:"Scatter the fragments",icon:Sparkles},{value:"assemble",label:"Gravity",hint:"Bring everything home",icon:Aperture},{value:"orbit",label:"New orbit",hint:"Rotate the whole axis",icon:Orbit},{value:"palette",label:palettes[palette],hint:"Change the spectrum",icon:Expand}] as const).map(item=><button key={item.value} disabled={!ready} onClick={()=>act(item.value)} type="button" className="crystal-action min-h-28 rounded-2xl border border-cyan-200/20 p-4 text-left text-cyan-100 focus-visible:outline-2 focus-visible:outline-cyan-200 disabled:opacity-40"><item.icon size={20}/><span className="mt-3 block text-sm font-semibold">{item.label}</span><span className="mt-1 block text-xs leading-5 text-slate-400">{item.hint}</span></button>)}</div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-6 sm:px-8"><p aria-live="polite" className="text-xs leading-6 text-slate-400">{message}</p><button disabled={!ready} type="button" className="flex min-h-11 items-center gap-2 text-xs text-cyan-200 disabled:opacity-40" onClick={()=>act("reset")}><RotateCcw size={14}/>Reset composition</button></div>
    </div>
  </section>;
}
