import * as T from "three";
import { createExtraSanctuaries, type ExtraSanctuary } from "./serenity-extras";

export type Season = "Spring" | "Summer" | "Autumn" | "Winter";
export type Sanctuary = "pond" | "bonsai" | "jellyfish" | "fireflies" | ExtraSanctuary;
export function createSerenityScene(host: HTMLDivElement) {
  const renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.domElement.style.cssText = "display:block;width:100%;height:100%;touch-action:pan-y";
  host.appendChild(renderer.domElement);
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(39, 1, .1, 60);
  camera.position.set(0, 7.5, 8); camera.lookAt(0, 0, 0);
  const pond = new T.Group(), tree = new T.Group(); scene.add(pond, tree); tree.visible = false;
  scene.add(new T.HemisphereLight(0xe9f2dc, 0x566055, 2.7));
  const sun = new T.DirectionalLight(0xffe3b6, 3); sun.position.set(-3, 7, 4); scene.add(sun);
  const materials: T.Material[] = [], geometries: T.BufferGeometry[] = [];
  const material = (color: string) => { const m = new T.MeshStandardMaterial({ color, roughness: .8 }); materials.push(m); return m; };
  const mesh = (parent: T.Object3D, geometry: T.BufferGeometry, mat: T.Material, x=0, y=0, z=0) => { geometries.push(geometry); const m = new T.Mesh(geometry, mat); m.position.set(x,y,z); parent.add(m); return m; };
  const stone = material("#898b7d"), bark = material("#75604b"), moss = material("#657b4c");
  mesh(pond, new T.CylinderGeometry(3.15, 2.9, .5, 64), stone, 0,-.4);
  mesh(pond, new T.CylinderGeometry(2.86, 2.86, .04, 64), material("#32685f"), 0,-.13);
  const water = new T.MeshStandardMaterial({color:0x82bca7,transparent:true,opacity:.22,roughness:.3,depthWrite:false}); materials.push(water);
  mesh(pond,new T.CircleGeometry(2.85,64),water,0,.12).rotation.x=-Math.PI/2;
  for(let i=0;i<24;i++){const a=i*Math.PI/12;const rock=mesh(pond,new T.DodecahedronGeometry(.24+(i%3)*.04),stone,Math.cos(a)*3,.02,Math.sin(a)*3);rock.scale.set(1.25,.7,1);rock.rotation.y=a;}
  const padMat=material("#58855c"), flowerMat=material("#efc2c0");
  for(let i=0;i<5;i++){
    const a=i*1.6, x=Math.cos(a)*2.05, z=Math.sin(a)*2.05;
    const pad=mesh(pond,new T.CircleGeometry(.35,32, .15, Math.PI*2-.3),padMat,x,.14,z);pad.rotation.x=-Math.PI/2;pad.rotation.z=a;
    if(i%2===0)for(let j=0;j<7;j++){const p=j*Math.PI*2/7; const petal=mesh(pond,new T.SphereGeometry(.12,8,6),flowerMat,x+Math.cos(p)*.13,.2,z+Math.sin(p)*.13);petal.scale.set(.7,.45,1.5);petal.rotation.y=-p;}
  }
  const fish = Array.from({length:6},(_,i)=>{
    const group=new T.Group();pond.add(group);
    const white=material(i%2?"#e4d9c1":"#e1ad63"), orange=material(i%2?"#d77b52":"#f1e7ce");
    mesh(group,new T.SphereGeometry(.18,12,8),white).scale.set(.8,.5,2.3);
    const patch=mesh(group,new T.SphereGeometry(.13,10,6),orange,0,.045,.1);patch.scale.set(.9,.45,1.4);
    const tail=mesh(group,new T.ConeGeometry(.19,.3,3),orange,0,0,-.45);tail.rotation.x=Math.PI/2;tail.scale.y=.7;
    for(const side of [-1,1]){const fin=mesh(group,new T.ConeGeometry(.1,.22,3),white,side*.15,0,-.06);fin.rotation.z=side*Math.PI/2;}
    for(const side of [-1,1])mesh(group,new T.SphereGeometry(.023,6,4),material("#25342d"),side*.095,.04,.29);
    const angle=i*Math.PI/3;group.position.set(Math.cos(angle)*1.7,-.02,Math.sin(angle)*1.7);
    return {group,tail,angle};
  });
  const rippleMat = new T.MeshBasicMaterial({color:0xd8ede1,transparent:true,opacity:0,depthWrite:false});materials.push(rippleMat);
  const ripple=mesh(pond,new T.RingGeometry(.96,1,64),rippleMat,0,.16);ripple.rotation.x=-Math.PI/2;
  const pot=material("#667b7a");
  const bowl=mesh(tree,new T.CylinderGeometry(1.45,1.05,.65,48),pot,0,-.55);bowl.scale.z=.8;
  const soil=mesh(tree,new T.CylinderGeometry(1.3,1.3,.08,48),moss,0,-.19);soil.scale.z=.8;
  const trunkPoints=[new T.Vector3(0,-.2,0),new T.Vector3(-.3,.6,0),new T.Vector3(.08,1.35,.1),new T.Vector3(-.2,2.15,0)];
  mesh(tree,new T.TubeGeometry(new T.CatmullRomCurve3(trunkPoints),24,.16,8,false),bark);
  const foliageMat=material("#b6c995");
  const leafHomes: T.Vector3[] = [];
  const leafGeometry = new T.SphereGeometry(.11, 6, 4); geometries.push(leafGeometry);
  const leafInstances = new T.InstancedMesh(leafGeometry, foliageMat, 180); tree.add(leafInstances);
  const dummy = new T.Object3D();
  const snowMat = material("#e2e8df");
  const snowGeometry = new T.SphereGeometry(.025, 5, 4); geometries.push(snowGeometry);
  const snowfall = new T.InstancedMesh(snowGeometry, snowMat, 70); tree.add(snowfall); snowfall.visible=false;
  for(let i=0;i<9;i++){
    const a=i*2.399,y=.8+i*.15,r=.9-i*.055;
    const end=new T.Vector3(Math.cos(a)*r,y+.4,Math.sin(a)*r);
    mesh(tree,new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(-.1,y-.2,0),new T.Vector3(end.x*.5,y+.1,end.z*.5),end]),8,.055,6,false),bark);
    for(let j=0;j<20;j++){const a=j*2.399, r=.18+Math.sqrt(j/20)*.5; leafHomes.push(end.clone().add(new T.Vector3(Math.cos(a)*r,Math.sin(j*1.7)*.22,Math.sin(a)*r)));}
  }
  for(let i=0;i<5;i++){const a=i*1.25;mesh(tree,new T.DodecahedronGeometry(.14),stone,Math.cos(a)*.85,-.1,Math.sin(a)*.6);}
  const jellyWorld=new T.Group(), grove=new T.Group(); scene.add(jellyWorld,grove); jellyWorld.visible=false;grove.visible=false;
  const jellyMat=new T.MeshStandardMaterial({color:0xa9c9ec,emissive:0x5976b4,emissiveIntensity:.6,transparent:true,opacity:.7,side:T.DoubleSide,roughness:.3,depthWrite:false});materials.push(jellyMat);
  const tentacleMat=material("#b3a2d2");tentacleMat.emissive.setHex(0x463966);
  const jellies=Array.from({length:3},(_,i)=>{const g=new T.Group();jellyWorld.add(g);g.position.set((i-1)*1.8,.9+(i%2)*.7,-(i%2));const bell=mesh(g,new T.SphereGeometry(.65,24,12,0,Math.PI*2,0,Math.PI/2),jellyMat);for(let k=0;k<8;k++){const a=k*Math.PI/4;const points=Array.from({length:8},(_,j)=>new T.Vector3(Math.cos(a)*(.45-j*.025)+Math.sin(j*.8)*.12,-j*.25,Math.sin(a)*(.45-j*.025)));mesh(g,new T.TubeGeometry(new T.CatmullRomCurve3(points),18,.018,4,false),tentacleMat);}const rim=mesh(g,new T.TorusGeometry(.64,.025,6,48),tentacleMat);rim.rotation.x=Math.PI/2;return {g,bell};});
  mesh(grove,new T.CylinderGeometry(2.8,2.5,.3,48),moss,0,-.35);
  for(let i=0;i<7;i++){const a=i*2.399,x=Math.cos(a)*2.2,z=Math.sin(a)*2.2;mesh(grove,new T.CylinderGeometry(.07,.13,2.5+i%2,7),bark,x,1,z);mesh(grove,new T.ConeGeometry(.65,1.4,8),moss,x,2.4,z);}
  const glowMat=new T.MeshBasicMaterial({color:0xe0ed9b});materials.push(glowMat);
  const glowGeometry=new T.SphereGeometry(.035,6,4);geometries.push(glowGeometry);
  const fireflies=new T.InstancedMesh(glowGeometry,glowMat,80);grove.add(fireflies);
  const moon=mesh(grove,new T.SphereGeometry(.35,20,12),glowMat,0,3,-2);
  moon.scale.setScalar(.8);
  const extras=createExtraSanctuaries(scene);
  const isExtra=(value:Sanctuary):value is ExtraSanctuary=>value in extras.groups;
  let currentSeason:Season="Summer", seasonStart=0, breeze=0, pulse=0, gathered=false;
  let mode:Sanctuary="pond", paused=false, visible=true, disposed=false, scrolling=false;
  let frame=0, last=0, time=0, rippleAge=10, attraction=0, rotation=0, currentRotation=0;
  let scrollTimer:ReturnType<typeof setTimeout>|undefined;
  const target=new T.Vector3();
  const motion=window.matchMedia("(prefers-reduced-motion: reduce)");
  const draw=(now:number)=>{
    frame=0;if(disposed||!visible||document.hidden||scrolling)return;
    const dt=Math.min((now-last)/1000||.033,.06);
    if(now-last<32&&!motion.matches&&!paused){frame=requestAnimationFrame(draw);return;}
    last=now;
    const moving=!paused&&!motion.matches;
    if(moving){time+=dt*(document.documentElement.dataset.calm === "true" ? .65 : 1);breeze=Math.max(0,breeze-dt*.3);pulse=Math.max(0,pulse-dt*.5);rippleAge+=dt;attraction=Math.max(0,attraction-dt);}
    if(mode==="pond"){
      fish.forEach(({group,tail,angle},i)=>{
        const a=angle+time*(.13+i*.013),r=1.45+(i%3)*.2;
        const goal=attraction>0?target.clone().add(new T.Vector3(Math.cos(a)*.5,0,Math.sin(a)*.5)):new T.Vector3(Math.cos(a)*r,0,Math.sin(a)*r);
        goal.y=-.02;
        if(moving){const delta=goal.clone().sub(group.position);if(delta.lengthSq()>.001)group.rotation.y=Math.atan2(delta.x,delta.z);group.position.lerp(goal,1-Math.exp(-dt*.7));tail.rotation.z=Math.sin(time*3+i)*.25;}
      });
      ripple.visible=rippleAge<3;ripple.scale.setScalar(.12+rippleAge*.55);rippleMat.opacity=Math.max(0,(1-rippleAge/3)*.6);
    }else if(mode==="bonsai") {currentRotation+=(rotation-currentRotation)*(moving?1-Math.exp(-dt*5):1);tree.rotation.y=currentRotation+(moving?Math.sin(time*.1)*.08:0);}
    if(mode==="bonsai"){
      const elapsed=time-seasonStart;
      leafHomes.forEach((home,i)=>{
        dummy.position.copy(home);dummy.rotation.set(i*.7,i*2.3,Math.sin(time+i)*.1);let size=1;
        if(currentSeason==="Winter")size=0;
        if(currentSeason==="Spring")size=.35+.65*Math.min(1,elapsed*.35);
        const falling=(currentSeason==="Autumn"&&i%3!==0)||(currentSeason==="Spring"&&i%9===0)||breeze>0&&i%5===0;
        if(falling){const travel=(elapsed*.32+i*.137)%3.5;dummy.position.y=Math.max(-.1,home.y-travel);dummy.position.x+=Math.sin(i+time)*.15+travel*.22;dummy.rotation.z=time+i;}
        dummy.scale.set(.8*size,.22*size,1.6*size);dummy.updateMatrix();leafInstances.setMatrixAt(i,dummy.matrix);
      });leafInstances.instanceMatrix.needsUpdate=true;
      snowfall.visible=currentSeason==="Winter";
      if(snowfall.visible)for(let i=0;i<70;i++){dummy.position.set(Math.sin(i*2.399)*1.65+Math.sin(time+i)*.1,3.6-((time*.35+i*.071)%3.8),Math.cos(i*2.399)*1.2);dummy.rotation.set(0,0,0);dummy.scale.setScalar(1);dummy.updateMatrix();snowfall.setMatrixAt(i,dummy.matrix);}snowfall.instanceMatrix.needsUpdate=true;
    }
    if(mode==="jellyfish")jellies.forEach(({g,bell},i)=>{g.position.y=.9+(i%2)*.7+Math.sin(time*.7+i)*.25;g.rotation.z=Math.sin(time*.4+i)*.08;bell.scale.set(1+Math.sin(time*1.5+i)*.08,1+Math.cos(time*1.5+i)*.18+pulse*.25,1+Math.sin(time*1.5+i)*.08);jellyMat.emissiveIntensity=.6+pulse*1.8;});
    if(mode==="fireflies"){
      for(let i=0;i<80;i++){const a=i*2.399+time*.12;const r=gathered?.45+(i%4)*.08:1+(i%11)*.13;dummy.position.set(Math.cos(a)*r, .4+(i%17)*.12+Math.sin(time+i)*.13,Math.sin(a)*r);dummy.scale.setScalar(.6+(Math.sin(time*1.4+i)+1)*.5);dummy.updateMatrix();fireflies.setMatrixAt(i,dummy.matrix);}fireflies.instanceMatrix.needsUpdate=true;
    }
    if(isExtra(mode))extras.update(mode,time,dt,moving);
    renderer.render(scene,camera);
    if(moving)frame=requestAnimationFrame(draw);
  };
  const wake=()=>{if(!frame&&!disposed&&visible&&!document.hidden&&!scrolling){last=0;frame=requestAnimationFrame(draw);}};
  const rippleAt=(x:number,z:number)=>{const point=new T.Vector2(x,z).clampLength(0,2.2);target.set(point.x,-.02,point.y);ripple.position.set(point.x,.16,point.y);rippleAge=motion.matches||paused?1:0;attraction=8;wake();};
  let downX=0,downY=0;
  const down=(e:PointerEvent)=>{downX=e.clientX;downY=e.clientY;};
  const up=(e:PointerEvent)=>{if(Math.hypot(e.clientX-downX,e.clientY-downY)>7)return;if(mode!=="pond"){breeze=1;pulse=1;gathered=!gathered;if(isExtra(mode))extras.action();wake();return;}const rect=host.getBoundingClientRect();const ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const hit=new T.Vector3();if(ray.ray.intersectPlane(new T.Plane(new T.Vector3(0,1,0),-.12),hit)&&Math.hypot(hit.x,hit.z)<2.85)rippleAt(hit.x,hit.z);};
  renderer.domElement.addEventListener("pointerdown",down);renderer.domElement.addEventListener("pointerup",up);
  const fit=()=>{if(!host.clientWidth||!host.clientHeight)return;renderer.setSize(host.clientWidth,host.clientHeight,false);camera.aspect=host.clientWidth/host.clientHeight;const compact=camera.aspect<1;camera.position.set(0,mode==="pond"?(compact?10:7.5):3.7,compact?12:8);camera.lookAt(0,mode==="pond"?0:.8,0);camera.updateProjectionMatrix();wake();};
  const resize=new ResizeObserver(fit);resize.observe(host);
  const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;}else wake();});observer.observe(host);
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else wake();};
  const onScroll=()=>{scrolling=true;cancelAnimationFrame(frame);frame=0;clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{scrolling=false;wake();},160);};
  document.addEventListener("visibilitychange",visibility);window.addEventListener("scroll",onScroll,{passive:true});motion.addEventListener("change",wake);
  fit();wake();
  return {
    mode(value:Sanctuary){mode=value;Object.entries(extras.groups).forEach(([key,group])=>{group.visible=key===value;});pond.visible=value==="pond";tree.visible=value==="bonsai";jellyWorld.visible=value==="jellyfish";grove.visible=value==="fireflies";sun.intensity=value==="jellyfish"||value==="fireflies"?.5:3;fit();},
    ripple(){rippleAt(0,0);},
    rotate(){rotation+=Math.PI/4;wake();},
    pause(value:boolean){paused=value;wake();},
    animate(){breeze=1;pulse=1;gathered=!gathered;if(isExtra(mode))extras.action();wake();},
    season(value:Season){currentSeason=value;seasonStart=time;const colors={Spring:"#e6adc5",Summer:"#6f965e",Autumn:"#d09043",Winter:"#e2e8df"};foliageMat.color.set(colors[value]);soil.material=value==="Winter"?snowMat:moss;sun.color.set(value==="Winter"?0xd7e4ff:0xffe3b6);wake();},
    dispose(){extras.dispose();disposed=true;cancelAnimationFrame(frame);clearTimeout(scrollTimer);resize.disconnect();observer.disconnect();document.removeEventListener("visibilitychange",visibility);window.removeEventListener("scroll",onScroll);motion.removeEventListener("change",wake);renderer.domElement.removeEventListener("pointerdown",down);renderer.domElement.removeEventListener("pointerup",up);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();},
  };
}
