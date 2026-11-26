// Authoring models for the directional sprite sheets. Forward is negative Z.
import * as T from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const material = (color, options = {}) =>
  new T.MeshStandardMaterial({ color, roughness: 0.55, ...options });
function part(parent, geometry, surface, x = 0, y = 0, z = 0) {
  const mesh = new T.Mesh(geometry, surface);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}
function oval(parent, surface, x, y, z, width, height, depth) {
  const mesh = part(parent, new T.SphereGeometry(1, 28, 18), surface, x, y, z);
  mesh.scale.set(width, height, depth);
  return mesh;
}
function beam(parent, surface, from, to, radius) {
  const a = new T.Vector3(...from),
    b = new T.Vector3(...to),
    delta = b.clone().sub(a);
  const rod = part(parent, new T.CylinderGeometry(radius, radius, delta.length(), 12), surface);
  rod.position.copy(a).lerp(b, 0.5);
  rod.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), delta.normalize());
  return rod;
}
function slab(parent, surface, outline, height, elevation = 0) {
  const shape = new T.Shape(outline.map(([x, z]) => new T.Vector2(x, -z)));
  const mesh = part(
    parent,
    new T.ExtrudeGeometry(shape, {
      depth: height,
      bevelSegments: 2,
      bevelSize: 0.025,
      bevelThickness: 0.025,
    }),
    surface,
    0,
    elevation,
  );
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}
function paintedTexture(painter) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  painter(canvas.getContext("2d"));
  const texture = new T.CanvasTexture(canvas);
  texture.colorSpace = T.SRGBColorSpace;
  return texture;
}
function random(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

export function koi() {
  const root = new T.Group();
  const skin = paintedTexture((ctx) => {
    const rnd = random(16);
    ctx.fillStyle = "#e7dfbf";
    ctx.fillRect(0, 0, 512, 256);
    for (const [color, count] of [
      ["#c23f14", 24],
      ["#843215", 6],
      ["#303028", 5],
    ]) {
      ctx.fillStyle = color;
      for (let i = 0; i < count; i++) {
        const x = rnd() * 512,
          y = rnd() * 256,
          rx = 9 + rnd() * 42,
          ry = 7 + rnd() * 22;
        for (const offset of [-512, 0, 512]) {
          ctx.beginPath();
          ctx.ellipse(x + offset, y, rx, ry, 0.45, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.strokeStyle = "rgba(84,66,36,.28)";
    for (let j = 0; j < 32; j++)
      for (let i = 0; i < 64; i++) {
        ctx.beginPath();
        ctx.arc(i * 8 + (j % 2) * 4, j * 8, 4, 0.15, 2.99);
        ctx.stroke();
      }
  });
  // Tapered cross sections give the fish a broad head and narrow caudal peduncle.
  const rings = [
    [-1.12, 0.03, 0.04],
    [-1.02, 0.21, 0.16],
    [-0.83, 0.32, 0.23],
    [-0.54, 0.36, 0.27],
    [0, 0.32, 0.25],
    [0.44, 0.21, 0.18],
    [0.79, 0.09, 0.1],
    [0.97, 0.05, 0.06],
  ];
  const pos = [],
    uv = [],
    index = [];
  rings.forEach(([z, w, h], j) => {
    for (let k = 0; k <= 40; k++) {
      const a = (k * Math.PI) / 20;
      pos.push(Math.cos(a) * w, Math.sin(a) * h, z);
      uv.push(k / 40, (z + 1.12) / 2.09);
      if (j && k) {
        const n = j * 41 + k;
        index.push(n - 42, n - 41, n, n - 42, n, n - 1);
      }
    }
  });
  const geo = new T.BufferGeometry();
  geo.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
  geo.setIndex(index);
  geo.computeVertexNormals();
  part(root, geo, material("white", { map: skin, side: T.DoubleSide, roughness: 0.38 }));
  const fin = material("#e7c89c", { roughness: 0.42 });
  const tail = new T.Group();
  tail.position.z = 0.89;
  root.add(tail);
  const pectorals = [];
  for (const side of [-1, 1]) {
    const blade = oval(tail, fin, side * 0.12, 0, 0.19, 0.1, 0.033, 0.34);
    blade.rotation.y = side * 0.52;
    const paddle = oval(root, fin, side * 0.33, -0.08, -0.28, 0.13, 0.035, 0.32);
    paddle.rotation.y = side * 0.78;
    pectorals.push({ paddle, side });
    oval(root, material("#151913"), side * 0.235, 0.095, -0.85, 0.048, 0.045, 0.055);
    beam(root, fin, [side * 0.105, -0.045, -1.04], [side * 0.19, -0.12, -1.17], 0.012);
  }
  oval(root, fin, 0, 0.22, -0.02, 0.032, 0.11, 0.5);
  const base = geo.attributes.position.array.slice();
  return {
    root,
    pose(phase) {
      const vertices = geo.attributes.position;
      for (let i = 0; i < vertices.count; i++) {
        const z = base[i * 3 + 2],
          weight = Math.max(0, (z + 0.42) / 1.4);
        vertices.setX(i, base[i * 3] + Math.sin(phase - z * 1.4) * 0.21 * weight * weight);
      }
      vertices.needsUpdate = true;
      geo.computeVertexNormals();
      for (const { paddle, side } of pectorals) {
        paddle.rotation.y = side * (0.78 + Math.sin(phase + .6) * .20);
        paddle.rotation.z = side * Math.cos(phase + .6) * .18;
      }
      tail.position.x = Math.sin(phase - 1.3) * 0.2;
      tail.rotation.y = Math.cos(phase - 1.3) * 0.48;
    },
  };
}
export function boat() {
  const root = new T.Group(),
    wood = material("#74401f"),
    rim = material("#cc9958"),
    dark = material("#453023");
  const stations = [
    [-1.52, 0.018, 0.23],
    [-1.22, 0.31, 0.09],
    [-0.8, 0.48, 0.02],
    [0, 0.53, 0],
    [0.85, 0.43, 0.03],
    [1.27, 0.23, 0.1],
    [1.4, 0.02, 0.18],
  ];
  for (let j = 1; j < stations.length; j++) {
    const [z0, w0, h0] = stations[j - 1],
      [z1, w1, h1] = stations[j];
    for (const side of [-1, 1]) {
      for (let p = 0; p < 4; p++) {
        const point = (z, w, h, row) => [
          side * w * (0.35 + (0.65 * row) / 4),
          h - 0.26 + (0.46 * row) / 4,
          z,
        ];
        const pts = [
          point(z0, w0, h0, p),
          point(z1, w1, h1, p),
          point(z1, w1, h1, p + 1),
          point(z0, w0, h0, p + 1),
        ];
        const g = new T.BufferGeometry();
        g.setAttribute("position", new T.Float32BufferAttribute(pts.flat(), 3));
        g.setIndex([0, 1, 2, 0, 2, 3]);
        g.computeVertexNormals();
        part(root, g, material(["#61391f", "#89532c", "#a76838", "#865130"][p], { side: T.DoubleSide }));
      }
      beam(root, rim, [side * w0, h0 + 0.2, z0], [side * w1, h1 + 0.2, z1], 0.033);
    }
  }
  oval(root, dark, 0, -0.12, 0, 0.41, 0.08, 1.27);
  for (const z of [-0.72, -0.05, 0.68]) part(root, new T.BoxGeometry(0.76, 0.06, 0.16), rim, 0, 0.14, z);
  const coat = material("#314e49"),
    hat = material("#cda86b");
  oval(root, coat, 0, 0.36, 0.11, 0.17, 0.24, 0.13);
  oval(root, material("#aa7151"), 0, 0.61, 0.085, 0.1, 0.12, 0.1);
  part(root, new T.ConeGeometry(0.27, 0.16, 36), hat, 0, 0.74, 0.095);
  const oars = [];
  for (const side of [-1, 1]) {
    const oar = new T.Group();
    root.add(oar);
    oar.position.set(side * 0.44, 0.18, 0);
    beam(oar, wood, [-side * 0.31, 0.16, -0.1], [side * 0.73, -0.17, 0.43], 0.035);
    const blade = oval(oar, rim, side * 0.68, -0.14, 0.39, 0.091, 0.038, 0.24);
    blade.rotation.y = side * 0.96;
    oars.push(oar);
  }
  return {
    root,
    pose(p) {
      oars.forEach((o, i) => {
        o.rotation.y = (i ? 1 : -1) * Math.sin(p) * 0.52;
        o.rotation.z = Math.cos(p) * 0.13 * (i ? 1 : -1);
      });
    },
  };
}
export function drone() {
  const root = new T.Group(),
    ceramic = material("#e4dfcb"),
    carbon = material("#2a3531", { metalness: 0.45 }),
    copper = material("#bf713c", { metalness: 0.65 });
  oval(root, ceramic, 0, 0.13, 0, 0.34, 0.2, 0.48);
  oval(root, carbon, 0, -0.02, 0, 0.32, 0.14, 0.43);
  const pack = material("#51605a", {metalness: .42});
  oval(root, pack, 0, .27, .09, .235, .09, .32);
  for (let i = 0; i < 5; i++) {
    part(root, new T.BoxGeometry(.23, .014, .023), carbon, 0, .355, -.03 + i * .045);
  }
  for (const side of [-1, 1]) {
    beam(root, copper, [side * .245, .22, -.25], [side * .28, .21, .24], .022);
  }
  const rotors = [];
  for (const x of [-1, 1])
    for (const z of [-1, 1]) {
      const px = x * 0.68,
        pz = z * 0.53;
      beam(root, carbon, [x * 0.2, 0.09, z * 0.19], [px, 0.19, pz], 0.065);
      beam(root, ceramic, [x * .25, .15, z * .22], [x * .53, .21, z * .43], .061);
      part(root, new T.CylinderGeometry(0.099, 0.084, 0.16, 20), copper, px, 0.23, pz);
      const rotor = new T.Group();
      root.add(rotor);
      rotor.position.set(px, 0.34, pz);
      for (const dir of [-1, 1])
        oval(rotor, carbon, dir * 0.16, 0, 0, 0.22, 0.017, 0.047).rotation.y = 0.18;
      rotors.push(rotor);
      beam(root, carbon, [x * 0.21, -0.03, z * 0.22], [x * 0.35, -0.3, z * 0.33], 0.028);
      oval(
        root,
        material(x < 0 ? "#ef8653" : "#9dddb4", { emissive: x < 0 ? "#993300" : "#167157" }),
        px,
        0.16,
        pz,
        0.075,
        0.036,
        0.065,
      );
    }
  for (const x of [-0.35, 0.35]) beam(root, carbon, [x, -0.3, -0.41], [x, -0.3, 0.41], 0.031);
  oval(root, material("#628f91", { metalness: 0.4 }), 0, -0.17, 0.04, 0.2, 0.17, 0.25);
  oval(root, carbon, 0, 0.025, -0.43, 0.13, 0.105, 0.12);
  return {
    root,
    pose(p) {
      rotors.forEach((r, i) => (r.rotation.y = p * (i % 2 ? 1 : -1) + i * 0.8));
    },
  };
}
export function ship() {
  const root = new T.Group(),
    alloy = material("#aab6bd", { metalness: 0.63, roughness: 0.36 }),
    graphite = material("#394651", { metalness: 0.6 }),
    brass = material("#c88849", { metalness: 0.53 });
  slab(
    root,
    alloy,
    [
      [0, -1.45],
      [0.31, -0.44],
      [0.46, 0.58],
      [0.25, 1.02],
      [-0.25, 1.02],
      [-0.46, 0.58],
      [-0.31, -0.44],
    ],
    0.14,
  );
  for (const s of [-1, 1]) {
    slab(
      root,
      graphite,
      [
        [s * 0.18, -0.63],
        [s * 1.12, 0.6],
        [s * 0.98, 0.96],
        [s * 0.26, 0.69],
      ],
      0.08,
    );
    slab(
      root,
      alloy,
      [
        [s * 0.3, -0.26],
        [s * 0.93, 0.59],
        [s * 0.87, 0.69],
        [s * 0.34, 0.46],
      ],
      0.045,
      0.095,
    );
    slab(
      root,
      brass,
      [
        [s * 0.43, 0.12],
        [s * 0.79, 0.48],
        [s * 0.75, 0.49],
        [s * 0.41, 0.16],
      ],
      0.015,
      0.17,
    );
    const engine = part(
      root,
      new T.CylinderGeometry(0.145, 0.17, 0.86, 24),
      graphite,
      s * 0.39,
      0.1,
      0.58,
    );
    engine.rotation.x = Math.PI / 2;
    for (const z of [0.78, 0.87, 0.97]) {
      const collar = part(root, new T.TorusGeometry(0.155, 0.024, 8, 24), alloy, s * 0.39, 0.1, z);
      collar.rotation.z = 0.2;
    }
    oval(
      root,
      material("#b4f5ff", { emissive: "#35b5f8", emissiveIntensity: 2 }),
      s * 0.39,
      0.1,
      1.012,
      0.115,
      0.114,
      0.02,
    );
  }
  oval(root, graphite, 0, 0.15, -0.22, 0.235, 0.16, 0.61);
  oval(
    root,
    material("#437c95", { metalness: 0.76, roughness: 0.16 }),
    0,
    0.21,
    -0.29,
    0.18,
    0.14,
    0.42,
  );
  for (let i = 0; i < 5; i++)
    part(root, new T.BoxGeometry(0.26, 0.04, 0.035), brass, 0, 0.22, 0.31 + i * 0.09);
  return { root };
}
export function sapling() {
  const root = new T.Group(),
    rand = random(93),
    bark = material("#6a4930");
  beam(root, bark, [0, -0.7, 0], [0.04, 0.77, 0.05], 0.048);
  const greens = ["#61783d", "#426c36", "#779448", "#91a356", "#376440"].map((c) => material(c));
  for (let i = 0; i < 25; i++) {
    const h = -0.27 + i * 0.04,
      a = i * 2.399,
      r = (1 - i / 36) * 0.54;
    const x = Math.cos(a) * r,
      z = Math.sin(a) * r;
    beam(root, bark, [0, h, 0], [x, h + 0.19, z], 0.014);
    for (let j = 0; j < 8; j++) {
      const leaf = oval(
        root,
        greens[(i + j) % greens.length],
        x + (rand() - 0.5) * 0.24,
        h + 0.17 + rand() * 0.13,
        z + (rand() - 0.5) * 0.24,
        0.07,
        0.022,
        0.15,
      );
      leaf.rotation.set(rand() - 0.5, a + rand() * 1.6, rand() - 0.5);
    }
  }
  return { root };
}
export function asteroid() {
  const root = new T.Group(),
    g = new T.IcosahedronGeometry(0.79, 14),
    p = g.attributes.position,
    colors = [];
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i),
      y = p.getY(i),
      z = p.getZ(i);
    const noise =
      Math.sin(7 * x + 3 * y) * Math.cos(9 * z - 2 * x) * 0.13 + Math.sin(21 * y + 17 * z) * 0.035;
    p.setXYZ(i, x * (1 + noise) * 1.17, y * (1 + noise) * 0.8, z * (1 + noise));
    const grain = Math.sin(x * 97 + y * 37) * Math.cos(z * 83 - y * 59);
    const ridge = Math.abs(Math.sin(11 * x + 7 * y + 4 * z));
    const col = new T.Color("#70635b").multiplyScalar(.49 + ridge * .45 + noise * 1.8 + grain * .18);
    colors.push(col.r, col.g, col.b);
  }
  g.setAttribute("color", new T.Float32BufferAttribute(colors, 3));
  g.computeVertexNormals();
  part(root, g, material("white", { vertexColors: true, roughness: 0.98 }));
  return { root };
}
export async function lantern() {
  // Wooden Lantern 01, Poly Haven (CC0): https://polyhaven.com/a/wooden_lantern_01
  const source = new URL("./wooden-lantern/wooden_lantern_01_1k.gltf", import.meta.url);
  const { scene } = await new GLTFLoader().loadAsync(source.href);
  const root = new T.Group();
  root.add(scene);
  const bounds = new T.Box3().setFromObject(scene),
    scale = 1.9 / bounds.getSize(new T.Vector3()).y;
  scene.position.copy(bounds.getCenter(new T.Vector3())).multiplyScalar(-scale);
  scene.scale.setScalar(scale);
  const light = new T.PointLight(0xffb954, 2.5);
  light.position.y = -0.08;
  root.add(light);
  oval(
    root,
    material("#fff1c7", { emissive: "#ffae44", emissiveIntensity: 2 }),
    0,
    -0.2,
    0,
    0.11,
    0.24,
    0.11,
  );
  return { root };
}
