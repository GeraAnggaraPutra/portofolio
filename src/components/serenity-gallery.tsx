"use client";
import { useEffect, useRef, useState } from "react";
import { Leaf, Pause, Play, RotateCcw, Waves } from "lucide-react";
import type { createSerenityScene, Sanctuary, Season } from "@/lib/serenity-scene";

export function SerenityGallery() {
  const host=useRef<HTMLDivElement>(null);
  const scene=useRef<ReturnType<typeof createSerenityScene>|null>(null);
  const [ready,setReady]=useState(false), [failed,setFailed]=useState(false);
  const [mode,setMode]=useState<Sanctuary>("pond");
  const [season,setSeason]=useState<Season>("Summer");
  const [paused,setPaused]=useState(false), [calm,setCalm]=useState(false);
  const [note,setNote]=useState("Touch the water. Watch the koi find their way to you.");
  useEffect(()=>{
    const el=host.current;if(!el)return;
    let disposed=false;
    const observer=new IntersectionObserver(async([entry])=>{
      if(!entry.isIntersecting)return;observer.disconnect();
      try{const {createSerenityScene}=await import("@/lib/serenity-scene");if(disposed)return;scene.current=createSerenityScene(el);scene.current.season("Summer");setReady(true);}catch{if(!disposed)setFailed(true);}
    },{rootMargin:"160px"});observer.observe(el);
    return()=>{disposed=true;observer.disconnect();scene.current?.dispose();scene.current=null;};
  },[]);
  useEffect(()=>{
    document.documentElement.dataset.calm=String(calm);
    window.dispatchEvent(new Event("portfolio-calm-change"));
    return()=>{delete document.documentElement.dataset.calm;window.dispatchEvent(new Event("portfolio-calm-change"));};
  },[calm]);
  const descriptions:Record<Sanctuary,string>={pond:"Touch the water. Watch the koi find their way to you.",bonsai:"Watch petals bloom, leaves fall, and snow settle. Tap the tree to send a breeze.",jellyfish:"Drifting bells and trailing tentacles. Tap to send a wave of light through the sanctuary.",fireflies:"A small moonlit grove. Tap to gather the fireflies, then release them again."};
  const choose=(value:Sanctuary)=>{setMode(value);scene.current?.mode(value);setNote(descriptions[value]);};
  const button="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs text-[#e3e8d8] transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-emerald-200 disabled:opacity-40";
  return <section id="unwind" className="container-x py-20 sm:py-28" aria-labelledby="serenity-title">
    <div className="flex flex-wrap items-end justify-between gap-6"><div><p className="mono text-xs uppercase tracking-[.25em] text-[#a8c8ad]">Unwind / a quieter corner</p><h2 id="serenity-title" className="mt-4 text-4xl font-medium tracking-tight sm:text-6xl">A little less hurry.<br/><span className="text-[#b6cba5]">A little more wonder.</span></h2></div><p className="max-w-xs text-sm leading-7 text-zinc-400">Four quiet worlds. Water, seasons, ocean light, and a moonlit grove. Stay for a moment, with nothing to finish and nowhere to rush.</p></div>
    <div data-scene={mode} className="serenity-card mt-8 overflow-hidden rounded-[2rem] border border-[#b6cba5]/20">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-5 sm:px-8"><div className="flex flex-wrap gap-2" role="group" aria-label="Choose a sanctuary">{([{id:"pond",name:"Koi Pond"},{id:"bonsai",name:"Bonsai Seasons"},{id:"jellyfish",name:"Jellyfish Sanctuary"},{id:"fireflies",name:"Firefly Grove"}] as const).map(item=><button key={item.id} className={button} disabled={!ready} aria-pressed={mode===item.id} type="button" onClick={()=>choose(item.id)}>{item.name}</button>)}</div><button className={button} type="button" aria-pressed={calm} onClick={()=>setCalm(!calm)}>{calm?"Calm mode · on":"Enable calm mode"}</button></div>
      <div className="relative h-[360px] sm:h-[500px]"><div ref={host} className="absolute inset-0" role="img" aria-label={descriptions[mode]}/>{!ready&&<p role="status" className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-[#d0dec8]">{failed?"3D could not start on this device. Calm mode is still available.":"Preparing a quiet moment…"}</p>}</div>
      <div className="flex flex-wrap justify-center gap-2 px-4">{mode==="pond"?<button className={button} disabled={!ready} type="button" onClick={()=>{scene.current?.ripple();setNote(paused?"A ripple rests on the water. Resume to watch the koi approach.":"A gentle ripple. The koi will gather, then return to their own paths.");}}><Waves size={16}/>Make a ripple</button>:mode==="bonsai"?<><button className={button} disabled={!ready} type="button" onClick={()=>scene.current?.rotate()}><RotateCcw size={16}/>Turn the bonsai</button>{(["Spring","Summer","Autumn","Winter"] as Season[]).map(value=><button className={button} disabled={!ready} type="button" key={value} aria-pressed={season===value} onClick={()=>{setSeason(value);scene.current?.season(value);setNote(value==="Autumn"?"Amber leaves tumble from the branches and settle below.":value==="Winter"?"Bare branches and slowly falling snow.":value==="Spring"?"A new canopy blooms as pink petals drift down.":"A full green canopy, gently moving in the breeze.");}}>{value}</button>)}<button className={button} disabled={!ready} type="button" onClick={()=>scene.current?.animate()}><Leaf size={16}/>Send a breeze</button></>:<button className={button} disabled={!ready} type="button" onClick={()=>{scene.current?.animate();setNote(mode==="jellyfish"?"A soft pulse of light passes through the bells.":"The fireflies change their formation. Tap again to return them.");}}>{mode==="jellyfish"?"Send a light pulse":"Gather / release fireflies"}</button>}<button className={button} disabled={!ready} type="button" aria-pressed={paused} onClick={()=>{scene.current?.pause(!paused);setPaused(!paused);}}>{paused?<Play size={14}/>:<Pause size={14}/>} {paused?"Resume":"Pause motion"}</button></div>
      <p aria-live="polite" className="mx-auto max-w-xl px-6 pb-3 pt-6 text-center text-sm leading-7 text-[#b9c9bb]">{note}</p><p className="pb-6 text-center text-xs text-[#899e8c]">{calm?"Gentle click ripples · slower ambient motion":"Calm mode softens the motion and click effects across this page."}</p>
    </div>
  </section>;
}
