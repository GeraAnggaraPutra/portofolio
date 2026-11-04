import * as T from "three";

export type Season = "Spring" | "Summer" | "Autumn" | "Winter";
export type Sanctuary = "pond" | "bonsai";
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
  const foliage:T.Mesh[]=[];
  for(let i=0;i<9;i++){
    const a=i*2.399,y=.8+i*.15,r=.9-i*.055;
    const end=new T.Vector3(Math.cos(a)*r,y+.4,Math.sin(a)*r);
    mesh(tree,new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(-.1,y-.2,0),new T.Vector3(end.x*.5,y+.1,end.z*.5),end]),8,.055,6,false),bark);
    const leaves=mesh(tree,new T.IcosahedronGeometry(.55,1),foliageMat,end.x,end.y,end.z);leaves.scale.set(1.2,.6,1);foliage.push(leaves);
  }
  for(let i=0;i<5;i++){const a=i*1.25;mesh(tree,new T.DodecahedronGeometry(.14),stone,Math.cos(a)*.85,-.1,Math.sin(a)*.6);}
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
    if(moving){time+=dt;rippleAge+=dt;attraction=Math.max(0,attraction-dt);}
    if(mode==="pond"){
      fish.forEach(({group,tail,angle},i)=>{
        const a=angle+time*(.13+i*.013),r=1.45+(i%3)*.2;
        const goal=attraction>0?target.clone().add(new T.Vector3(Math.cos(a)*.5,0,Math.sin(a)*.5)):new T.Vector3(Math.cos(a)*r,0,Math.sin(a)*r);
        goal.y=-.02;
        if(moving){const delta=goal.clone().sub(group.position);if(delta.lengthSq()>.001)group.rotation.y=Math.atan2(delta.x,delta.z);group.position.lerp(goal,1-Math.exp(-dt*.7));tail.rotation.z=Math.sin(time*3+i)*.25;}
      });
      ripple.visible=rippleAge<3;ripple.scale.setScalar(.12+rippleAge*.55);rippleMat.opacity=Math.max(0,(1-rippleAge/3)*.6);
    }else {currentRotation+=(rotation-currentRotation)*(moving?1-Math.exp(-dt*5):1);tree.rotation.y=currentRotation+(moving?Math.sin(time*.1)*.08:0);}
    renderer.render(scene,camera);
    if(moving)frame=requestAnimationFrame(draw);
  };
  const wake=()=>{if(!frame&&!disposed&&visible&&!document.hidden&&!scrolling){last=0;frame=requestAnimationFrame(draw);}};
  const rippleAt=(x:number,z:number)=>{const point=new T.Vector2(x,z).clampLength(0,2.2);target.set(point.x,-.02,point.y);ripple.position.set(point.x,.16,point.y);rippleAge=motion.matches||paused?1:0;attraction=8;wake();};
  let downX=0,downY=0;
  const down=(e:PointerEvent)=>{downX=e.clientX;downY=e.clientY;};
  const up=(e:PointerEvent)=>{if(mode!=="pond"||Math.hypot(e.clientX-downX,e.clientY-downY)>7)return;const rect=host.getBoundingClientRect();const ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const hit=new T.Vector3();if(ray.ray.intersectPlane(new T.Plane(new T.Vector3(0,1,0),-.12),hit)&&Math.hypot(hit.x,hit.z)<2.85)rippleAt(hit.x,hit.z);};
  renderer.domElement.addEventListener("pointerdown",down);renderer.domElement.addEventListener("pointerup",up);
  const fit=()=>{if(!host.clientWidth||!host.clientHeight)return;renderer.setSize(host.clientWidth,host.clientHeight,false);camera.aspect=host.clientWidth/host.clientHeight;const compact=camera.aspect<1;camera.position.set(0,mode==="pond"?(compact?10:7.5):3.7,compact?12:8);camera.lookAt(0,mode==="pond"?0:.8,0);camera.updateProjectionMatrix();wake();};
  const resize=new ResizeObserver(fit);resize.observe(host);
  const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;}else wake();});observer.observe(host);
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else wake();};
  const onScroll=()=>{scrolling=true;cancelAnimationFrame(frame);frame=0;clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{scrolling=false;wake();},160);};
  document.addEventListener("visibilitychange",visibility);window.addEventListener("scroll",onScroll,{passive:true});motion.addEventListener("change",wake);
  fit();wake();
  return {
    mode(value:Sanctuary){mode=value;pond.visible=value==="pond";tree.visible=value==="bonsai";fit();},
    ripple(){rippleAt(0,0);},
    rotate(){rotation+=Math.PI/4;wake();},
    pause(value:boolean){paused=value;wake();},
    season(value:Season){const colors={Spring:"#d8adc0",Summer:"#6f965e",Autumn:"#ca8950",Winter:"#e2e8df"};foliageMat.color.set(colors[value]);foliage.forEach(leaf=>leaf.scale.set(1.2,value==="Winter"?.25:.6,1));soil.material=value==="Winter"?foliageMat:moss;sun.color.set(value==="Winter"?0xd7e4ff:0xffe3b6);wake();},
    dispose(){disposed=true;cancelAnimationFrame(frame);clearTimeout(scrollTimer);resize.disconnect();observer.disconnect();document.removeEventListener("visibilitychange",visibility);window.removeEventListener("scroll",onScroll);motion.removeEventListener("change",wake);renderer.domElement.removeEventListener("pointerdown",down);renderer.domElement.removeEventListener("pointerup",up);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();},
  };
}
