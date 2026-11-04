"use client";
import type { BufferGeometry } from "three";
import { useEffect, useRef, useState } from "react";

export function FloatingIsland() {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{ night: () => void; zoom: (factor: number) => void; reset: () => void; rotate: (angle: number) => void; interact: (value: boolean) => void; inspect: (name: string) => void } | null>(null);
  const [active, setActive] = useState(false);
  const [night, setNight] = useState(false);
  const [note, setNote] = useState("A cabin, a waterfall, and a little room to breathe. Select a landmark to discover the island.");
  const [status, setStatus] = useState("Loading your little world…");
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      try {
        const T = await import("three");
        const { OrbitControls } = await import("three/addons/controls/OrbitControls.js");
        if (disposed) return;
        const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
        el.appendChild(renderer.domElement);
        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(40, 1, .1, 100);
        camera.position.set(10, 8, 12);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, .3, 0); controls.enablePan = false; controls.enableZoom = false; controls.enabled = false;
        controls.minDistance = 8; controls.maxDistance = 24; controls.maxPolarAngle = Math.PI / 2.15;
        renderer.domElement.style.touchAction = "pan-y";
        const ambient = new T.HemisphereLight(0xd6f4ff, 0x574342, 2.4); scene.add(ambient);
        const sun = new T.DirectionalLight(0xffdcad, 3); sun.position.set(-3,8,4); scene.add(sun);
        const materials = new Map<string, InstanceType<typeof T.MeshStandardMaterial>>();
        const mat = (color: string) => { if (!materials.has(color)) materials.set(color, new T.MeshStandardMaterial({ color, roughness: .85, flatShading: true })); return materials.get(color)!; };
        const add = (geometry: BufferGeometry, color: string, x: number, y: number, z: number, name = "") => { const mesh = new T.Mesh(geometry, mat(color)); mesh.position.set(x,y,z); mesh.name = name; scene.add(mesh); return mesh; };
        const box = (w:number,h:number,d:number,c:string,x:number,y:number,z:number,n="") => add(new T.BoxGeometry(w,h,d),c,x,y,z,n);
        add(new T.CylinderGeometry(3.7,.8,3.1,9),"#5d5768",0,-1.65,0);
        add(new T.CylinderGeometry(3.8,3.6,.35,9),"#709d77",0,.05,0);
        for(let i=0;i<18;i++){ const a=i*2.4; const r=2.7+(i%3)*.2; const rock=add(new T.DodecahedronGeometry(.35+(i%4)*.12),"#777385",Math.cos(a)*r,-.6-i%3*.4,Math.sin(a)*r); rock.rotation.set(i,.3*i,0); }
        box(1.5,1.2,1.4,"#e5c7a2",-.8,.8,-.45,"Cabin");
        const roof=add(new T.CylinderGeometry(0,1.35,.9,4),"#99625b",-.8,1.85,-.45,"Cabin"); roof.rotation.y=Math.PI/4;
        box(.35,.7,.08,"#665347",-.8,.58,.29,"Cabin");
        for(const x of [-1.3,-.3]) box(.3,.35,.08,"#ffd78a",x,.95,.3,"Cabin");
        box(.25,.8,.25,"#655e65",-1.25,2,-.8,"Cabin");
        for(let i=0;i<7;i++) box(.44,.06,.36,"#d9ccb2",-.8+i*.25,.27,.6+i*.31);
        for(let i=0;i<11;i++){ const a=i*2.399; const x=Math.cos(a)*2.7,z=Math.sin(a)*2.7; if(z>1&&x<1)continue; const h=1+(i%3)*.25; add(new T.CylinderGeometry(.08,.12,h,6),"#7c6252",x,h/2+.2,z,"Forest"); for(let j=0;j<3;j++)add(new T.ConeGeometry(.55-j*.12,.9,7),j%2?"#477765":"#568b70",x,h*.65+j*.35,z,"Forest"); }
        box(.8,.08,3.3,"#81cee0",1.7,.26,1.5,"Waterfall");
        box(.8,2.8,.12,"#9adbea",1.7,-1.12,3.15,"Waterfall");
        for(let i=0;i<5;i++)box(.035,2.5,.035,"#d8f4f0",1.38+i*.15,-1,3.23,"Waterfall");
        for(let i=0;i<9;i++){const cloud=new T.Group();for(let j=0;j<3;j++){const m=new T.Mesh(new T.IcosahedronGeometry(.5,1),mat("#e6e5e3"));m.position.set(j*.55,Math.sin(j)*.1,0);m.scale.y=.55;cloud.add(m);}cloud.position.set(Math.cos(i*2.3)*5,-1.5+(i%3)*1.5,Math.sin(i*2.3)*5);scene.add(cloud);}
        const details: Record<string,string> = { Cabin: "The hilltop cabin — warm windows, a copper roof, and a quiet place above the clouds.", Forest: "The evergreen grove — layered canopies and rocky roots surround the island's little hideaway.", Waterfall: "The skyfall — a turquoise stream spills over the rock shelf and disappears into the clouds." };
        let visible=true;
        const render=()=>{ if(!disposed&&visible)renderer.render(scene,camera); };
        const inspect=(name:string)=>{setNote(details[name]); render();};
        controls.addEventListener("change",render);
        let downX=0,downY=0;
        const down=(e:PointerEvent)=>{downX=e.clientX;downY=e.clientY;};
        const pick=(e:PointerEvent)=>{if(Math.hypot(e.clientX-downX,e.clientY-downY)>6)return; const rect=el.getBoundingClientRect();const ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const hit=ray.intersectObjects(scene.children,true)[0];if(hit&&details[hit.object.name])inspect(hit.object.name);};
        renderer.domElement.addEventListener("pointerdown",down);renderer.domElement.addEventListener("pointerup",pick);
        const resize=new ResizeObserver(()=>{renderer.setSize(el.clientWidth,el.clientHeight);camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();render();});resize.observe(el);
        const visibility=new IntersectionObserver(([e])=>{visible=e.isIntersecting;render();});visibility.observe(el);
        let dark=false;
        api.current={rotate:(angle)=>{camera.position.sub(controls.target).applyAxisAngle(new T.Vector3(0,1,0),angle).add(controls.target);controls.update();render();},night:()=>{dark=!dark;ambient.intensity=dark?.65:2.4;sun.intensity=dark?.6:3;sun.color.set(dark?0x9dbbff:0xffdcad);mat("#ffd78a").emissive.set(dark?0xffa144:0x000000);render();},zoom:(factor)=>{camera.position.sub(controls.target).multiplyScalar(factor).clampLength(8,24).add(controls.target);controls.update();render();},reset:()=>{camera.position.set(10,8,12);controls.update();render();},interact:(value)=>{controls.enabled=value;renderer.domElement.style.touchAction=value?"none":"pan-y";},inspect};
        controls.update();render();setStatus("");
        cleanup=()=>{resize.disconnect();visibility.disconnect();controls.dispose();renderer.domElement.removeEventListener("pointerdown",down);renderer.domElement.removeEventListener("pointerup",pick);scene.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose();});materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();api.current=null;};
      } catch { if(!disposed)setStatus("3D is unavailable on this device. You can still explore the island landmarks below."); }
    },{rootMargin:"200px"});observer.observe(el);
    return()=>{disposed=true;observer.disconnect();cleanup();};
  },[]);
  const button="disabled:opacity-40 min-h-11 rounded-full border border-white/20 px-4 py-2 text-xs text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-amber-200";
  return <section id="island" className="container-x py-20 sm:py-28" aria-labelledby="island-title"><p className="mono text-xs uppercase tracking-[.2em] text-amber-200">Beyond the everyday / Interactive world</p><h2 id="island-title" className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">A little world<br/><span className="text-amber-200">to explore.</span></h2><p className="mt-5 max-w-lg text-sm leading-7 text-zinc-400">Take a breath above the clouds. Wander around a floating island, find a quiet cabin, and watch the light change.</p>
    <div className={`mt-8 overflow-hidden rounded-[2rem] border border-white/15 ${night?"bg-[#101a30]":"bg-[#233c48]"}`}><div className="flex flex-wrap items-center justify-between gap-3 p-5"><span className="mono text-xs text-white/60">THE SKY GARDEN / 01</span><button className={button} disabled={!!status} type="button" aria-pressed={night} onClick={()=>{api.current?.night();setNight(!night);}}>{night?"Bring back daylight":"Switch to moonlight"}</button></div>
    <div ref={host} className="relative h-[360px] sm:h-[540px]" role="img" aria-label="Interactive floating island with a cabin, evergreen forest, clouds and waterfall">{status&&<p className="absolute inset-0 grid place-items-center p-8 text-center text-sm text-white/70">{status}</p>}</div>
    <div className="flex flex-wrap justify-center gap-2 px-4"><button className={button} disabled={!!status} type="button" aria-pressed={active} onClick={()=>{api.current?.interact(!active);setActive(!active);}}>{active?"Finish exploring · enable scroll":"Explore · drag to rotate"}</button><button className={button} disabled={!!status} type="button" onClick={()=>api.current?.zoom(.85)}>Zoom in</button><button className={button} disabled={!!status} type="button" onClick={()=>api.current?.zoom(1.15)}>Zoom out</button><button className={button} disabled={!!status} type="button" onClick={()=>api.current?.rotate(-.3)}>Rotate left</button><button className={button} disabled={!!status} type="button" onClick={()=>api.current?.rotate(.3)}>Rotate right</button><button className={button} disabled={!!status} type="button" onClick={()=>api.current?.reset()}>Reset view</button></div>
    <p className="px-5 pt-3 text-center text-xs text-white/50">{active?"Drag to orbit. Finish exploring to scroll over the scene again.":"Scroll freely. Enable Explore when you want to rotate the island."}</p>
    <div className="m-5 rounded-2xl border border-white/10 bg-black/15 p-5"><div className="flex flex-wrap gap-2">{["Cabin","Forest","Waterfall"].map(name=><button type="button" className={button} key={name} onClick={()=>{const fallback:Record<string,string>={Cabin:"A warm hilltop cabin above the clouds.",Forest:"An evergreen grove surrounding the island.",Waterfall:"A turquoise stream falling into the sky."};setNote(fallback[name]);api.current?.inspect(name);}}>{name}</button>)}</div><p aria-live="polite" className="mt-4 min-h-12 text-sm leading-7 text-white/70">{note}</p></div></div></section>;
}
