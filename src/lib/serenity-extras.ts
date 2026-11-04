import * as T from "three";

export type ExtraSanctuary = "ocean" | "rain" | "lanterns" | "zen";

/** Each world shares the gallery renderer; only the selected world is updated. */
export function createExtraSanctuaries(scene: T.Scene) {
  const groups = { ocean: new T.Group(), rain: new T.Group(), lanterns: new T.Group(), zen: new T.Group() };
  const geometries = new Set<T.BufferGeometry>();
  const materials = new Set<T.Material>();
  Object.values(groups).forEach(group => { group.visible = false; scene.add(group); });
  const mat = (color: string, glow = false) => {
    const material = glow ? new T.MeshBasicMaterial({ color }) : new T.MeshStandardMaterial({ color, roughness: .65 });
    materials.add(material); return material;
  };
  const add = (group:T.Object3D, geometry:T.BufferGeometry, material:T.Material, x=0,y=0,z=0) => {
    geometries.add(geometry); const mesh=new T.Mesh(geometry,material); mesh.position.set(x,y,z);group.add(mesh);return mesh;
  };
  const gold=mat("#f6c785",true), dark=mat("#384d54"), stone=mat("#aaa797"), wood=mat("#775c48");
  const seaGeo=new T.PlaneGeometry(7,6,40,32);
  const sea=add(groups.ocean,seaGeo,mat("#376a83"),0,-.15);sea.rotation.x=-Math.PI/2;
  add(groups.ocean,new T.SphereGeometry(.48,24,16),mat("#e4ebd2",true),0,2.6,-2.8);
  for(let i=0;i<4;i++){const mountain=add(groups.ocean,new T.ConeGeometry(1.1,1.4+i*.2,5),dark,-3+i*2,-.05,-3);mountain.scale.z=.6;}
  const boat=new T.Group();groups.ocean.add(boat);boat.position.set(.8,.1,.7);
  const hull=add(boat,new T.SphereGeometry(.45,16,8),wood);hull.scale.set(.6,.3,1.6);
  add(boat,new T.CylinderGeometry(.015,.015,.85,6),wood,0,.4);
  const sail=add(boat,new T.ConeGeometry(.3,.7,3),mat("#e5d8b8"),.1,.5);sail.scale.z=.07;
  const reflections=Array.from({length:20},(_,i)=>{const light=add(groups.ocean,new T.PlaneGeometry(.15+(i%4)*.13,.035),gold,Math.sin(i*2.4)*.35,.02, -2+i*.19);light.rotation.x=-Math.PI/2;return light;});

  const rainGroup=groups.rain;
  const frameMat=mat("#98856a"), glassMat=new T.MeshStandardMaterial({color:0x90ada7,transparent:true,opacity:.12,depthWrite:false,roughness:.4});materials.add(glassMat);
  add(rainGroup,new T.BoxGeometry(4.6,3.4,.08),glassMat,0,1,0);
  for(const x of [-2.3,0,2.3])add(rainGroup,new T.BoxGeometry(.09,3.5,.16),frameMat,x,1,.08);
  for(const y of [-.75,1,2.75])add(rainGroup,new T.BoxGeometry(4.7,.09,.16),frameMat,0,y,.08);
  add(rainGroup,new T.BoxGeometry(5,.16,.65),wood,0,-.85,.15);
  const greenery=mat("#426a59");
  for(let i=0;i<8;i++){add(rainGroup,new T.ConeGeometry(.6,1.6+(i%3)*.4,8),greenery,-3+i*.85,.1,-1.8-(i%2));}
  for(const x of [-1.7,1.7]){add(rainGroup,new T.CylinderGeometry(.24,.18,.4,12),mat("#b9957b"),x,-.57,.25);for(let j=0;j<5;j++){const leaf=add(rainGroup,new T.SphereGeometry(.17,8,6),greenery,x+Math.sin(j)*.18,-.15+j*.07,.25);leaf.scale.set(.5,2,.5);leaf.rotation.z=Math.sin(j)*.5;}}
  const rainGeo=new T.CylinderGeometry(.007,.007,.18,4);geometries.add(rainGeo);
  const rain=new T.InstancedMesh(rainGeo,mat("#bedad8",true),120);rainGroup.add(rain);
  const dummy=new T.Object3D();

  const lakeMat=mat("#294e56");
  add(groups.lanterns,new T.CylinderGeometry(3.4,3.4,.15,64),lakeMat,0,-.4);
  for(let i=0;i<5;i++)add(groups.lanterns,new T.ConeGeometry(.9,1.6+i*.1,6),dark,-3+i*1.5,.05,-2.9);
  const paper=mat("#c78a50"), lanternCore=mat("#ffe6a4",true);
  const lanterns=Array.from({length:22},()=>{
    const group=new T.Group();groups.lanterns.add(group);
    add(group,new T.CylinderGeometry(.11,.15,.035,8),wood);
    add(group,new T.BoxGeometry(.18,.25,.18),paper,0,.15);
    add(group,new T.BoxGeometry(.13,.17,.185),lanternCore,0,.15);
    const reflection=add(groups.lanterns,new T.CircleGeometry(.09,12),gold,0,-.3);reflection.rotation.x=-Math.PI/2;
    return {group,reflection};
  });

  const sand=mat("#c5b79a");
  add(groups.zen,new T.CylinderGeometry(2.8,2.8,.3,64),wood,0,-.4);
  add(groups.zen,new T.CylinderGeometry(2.7,2.7,.035,64),sand,0,-.22);
  const groove=mat("#a09278");
  const sandRings=Array.from({length:14},(_,i)=>{const ring=add(groups.zen,new T.TorusGeometry(.42+i*.15,.009,4,80),groove,0,-.19);ring.rotation.x=-Math.PI/2;return ring;});
  const stones=Array.from({length:5},(_,i)=>{const rock=add(groups.zen,new T.DodecahedronGeometry(.36-i*.035,1),stone);rock.scale.set(1,.6,.8);return rock;});
  const bamboo=mat("#74916a");
  for(let i=0;i<5;i++){const stem=add(groups.zen,new T.CylinderGeometry(.045,.055,1.8+i*.1,8),bamboo,-1.9+i*.16,.6,-1.2);stem.rotation.z=(i-2)*.06;for(let j=0;j<4;j++)add(groups.zen,new T.TorusGeometry(.057,.008,4,12),wood,-1.9+i*.16,j*.4,-1.2).rotation.x=Math.PI/2;}
  let variation=false, strength=0;
  return {
    groups,
    action(){variation=!variation;},
    update(mode:ExtraSanctuary,time:number,dt:number,moving:boolean){
      strength=moving?T.MathUtils.lerp(strength,variation?1:0,1-Math.exp(-dt*2)):(variation?1:0);
      if(mode==="ocean"){
        const positions=seaGeo.attributes.position;
        for(let i=0;i<positions.count;i++){const x=positions.getX(i),y=positions.getY(i);positions.setZ(i,Math.sin(x*2+time*.7)*Math.cos(y*1.5+time*.4)*(.035+strength*.055));}positions.needsUpdate=true;seaGeo.computeVertexNormals();
        boat.rotation.z=Math.sin(time*.7)*(.04+strength*.05);boat.position.y=.06+Math.sin(time*.9)*.045;
        reflections.forEach((light,i)=>{light.scale.x=.7+Math.sin(time+i)*.25;});
      }
      if(mode==="rain"){
        rain.count=variation?120:65;
        for(let i=0;i<rain.count;i++){dummy.position.set(((i*1.731)%4.4)-2.2,2.65-((time*(.65+strength*.6)+i*.137)%3.3),.15+(i%3)*.03);dummy.rotation.set(0,0,-.08);dummy.scale.setScalar(1);dummy.updateMatrix();rain.setMatrixAt(i,dummy.matrix);}rain.instanceMatrix.needsUpdate=true;
      }
      if(mode==="lanterns")lanterns.forEach(({group,reflection},i)=>{const a=i*2.399,r=.5+(i%7)*.32;group.position.set(Math.cos(a+time*.03)*r,.05+((time*.12+i*.133)%(1.4+strength*2)),Math.sin(a)*r);group.rotation.z=Math.sin(time*.5+i)*.06;reflection.position.x=group.position.x;reflection.position.z=group.position.z;reflection.scale.setScalar(Math.max(.15,1-group.position.y/4));});
      if(mode==="zen"){
        stones.forEach((rock,i)=>{rock.position.set(Math.sin(i*2)*(.9*(1-strength)),.02+i*.36*strength,Math.cos(i*2)*(.7*(1-strength)));});
        sandRings.forEach((ring,i)=>{ring.scale.x=1+Math.sin(time*.12+i*.2)*.025;});
      }
    },
    dispose(){Object.values(groups).forEach(g=>scene.remove(g));geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());},
  };
}
