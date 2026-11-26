import type { Run } from "./game-rules";

// The fragment coordinates use the same 1000 × 562 landscape as swimming and touch input.
// Displacing the photograph keeps the sky reflection and the stones under the water in register.
const fragment = `
precision highp float;
uniform sampler2D plate;
uniform vec4 view;
uniform float seconds;
uniform vec4 crests[20];
varying vec2 uv;
const vec2 size = vec2(1000.,562.);
vec3 photo(vec2 p) { return texture2D(plate,clamp(p/size,0.,1.)).rgb; }
float softOval(vec2 p,vec2 centre,vec2 radii){
  return 1.-smoothstep(.70,1.,length((p-centre)/radii));
}
float wind(vec2 p){
  return sin(seconds*1.16+p.x*.013) * .63 + sin(seconds*2.01-p.y*.028)*.24
       + sin(seconds*3.5+p.x*.09+p.y*.043)*.13;
}
void main() {
  vec2 p=view.xy+uv*view.zw, d=vec2(0.);
  // Leave architectural edges and heavy branches anchored; let the outer canopy flex.
  float canopy=max(softOval(p,vec2(337.,30.),vec2(262.,87.)),
                   softOval(p,vec2(186.,105.),vec2(143.,89.)));
  canopy=max(canopy,softOval(p,vec2(861.,91.),vec2(182.,66.)));
  canopy=max(canopy,softOval(p,vec2(51.,201.),vec2(70.,64.)));
  float breeze=wind(p);
  d+=canopy*vec2(2.6*breeze,1.3*breeze+sin(seconds+p.x*.031)*.5);

  // Two stepped streams on the left bank. Cross-fade moving texture phases to avoid a reset seam.
  float fall=clamp((p.y-190.)/84.,0.,1.);
  float mainJet=(1.-smoothstep(14.,20.,abs(p.x-(162.+35.*fall))))*
                smoothstep(188.,201.,p.y)*(1.-smoothstep(266.,279.,p.y));
  float fineJet=(1.-smoothstep(5.,12.,abs(p.x-(109.+14.*fall))))*
                smoothstep(189.,200.,p.y)*(1.-smoothstep(253.,271.,p.y));
  float jet=max(mainJet,fineJet);
  float shore=231.+54.*(1.-smoothstep(120.,530.,p.x))+81.*smoothstep(723.,995.,p.x);
  float wet=smoothstep(shore,shore+17.,p.y);
  wet*=1.-softOval(p,vec2(12.,548.),vec2(371.,216.));
  wet*=1.-softOval(p,vec2(985.,552.),vec2(324.,145.));
  vec2 normal=vec2(0.);
  if(wet>.001){
    float depth=clamp((p.y-230.)/310.,0.,1.);
    normal=vec2(sin(p.y*.22-seconds*2.2+sin(p.x*.019)),cos(p.x*.047+p.y*.13+seconds*1.6))*(.2+depth*.77);
    for(int i=0;i<20;i++){
      vec4 wave=crests[i];
      vec2 delta=(p-wave.xy)*vec2(1.,1.88);
      float r=length(delta), age=wave.z, front=4.+age*32.;
      if(wave.w>0. && abs(r-front)<17.){
        float envelope=exp(-.020*(r-front)*(r-front))*(1.-age/1.6)*wave.w;
        normal+=delta/max(1.,r)*sin((r-front)*.61)*envelope*3.8;
      }
    }
    vec2 delta=(p-vec2(184.,275.))*vec2(1.,2.7);
    float r=length(delta);
    normal+=delta/max(1.,r)*sin(r*.35-seconds*7.)*exp(-r*.023)*2.8;
    d+=normal*wet;
  }
  vec3 color=photo(p+d);
  if(jet>.001){
    float a=fract(seconds*1.8+p.x*.012), b=fract(a+.5);
    vec2 flow=vec2(3.,13.)*(.5+fall);
    vec3 stream=mix(photo(p-flow*a),photo(p-flow*b),abs(2.*a-1.));
    color=mix(color,stream,jet*.92);
    color+=vec3(.09)*jet*pow(max(0.,sin(p.x*2.4+p.y*.19-seconds*13.)),5.);
  }
  float foam=softOval(p,vec2(182.,275.),vec2(51.,7.));
  color+=vec3(.13,.145,.15)*foam*max(0.,sin(p.x*.72+seconds*6.)*cos(p.y*2.1-seconds*8.));
  color+=vec3(.020,.025,.025)*normal.y*wet;
  gl_FragColor=vec4(color,1.);
}`;

export function createPondSurface(canvas: HTMLCanvasElement, plate: HTMLImageElement) {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;
  const program = gl.createProgram();
  if (!program) return null;
  const shaders: WebGLShader[] = [];
  for (const [kind, source] of [
    [
      gl.VERTEX_SHADER,
      `
    attribute vec2 position; varying vec2 uv;
    void main(){uv=vec2(position.x,-position.y)*.5+.5;gl_Position=vec4(position,0.,1.);}`,
    ],
    [gl.FRAGMENT_SHADER, fragment],
  ] as const) {
    const shader = gl.createShader(kind);
    if (!shader) break;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
    shaders.push(shader);
  }
  gl.linkProgram(program);
  shaders.forEach((shader) => gl.deleteShader(shader));
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  gl.useProgram(program);
  const vertices = gl.createBuffer(),
    texture = gl.createTexture();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const attribute = gl.getAttribLocation(program, "position");
  gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribute);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, plate);
  const view = gl.getUniformLocation(program, "view"),
    time = gl.getUniformLocation(program, "seconds");
  const crests = gl.getUniformLocation(program, "crests[0]"),
    buffer = new Float32Array(20 * 4);
  return {
    draw(run: Run, left: number, top: number, width: number, height: number) {
      if (gl.isContextLost()) return false;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform4f(view, left, top, width, height);
      gl.uniform1f(time, run.time);
      buffer.fill(0);
      const count = Math.min(20, run.ripples.length);
      for (let i = 0; i < count; i++) {
        const wave = run.ripples[run.ripples.length - 1 - i],
          offset = i * 4;
        buffer[offset] = wave.x;
        buffer[offset + 1] = wave.y;
        buffer[offset + 2] = run.time - wave.born;
        buffer[offset + 3] = wave.power;
      }
      gl.uniform4fv(crests, buffer);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      return true;
    },
    dispose() {
      gl.deleteTexture(texture);
      gl.deleteBuffer(vertices);
      gl.deleteProgram(program);
    },
  };
}
