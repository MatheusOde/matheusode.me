type Point2D = {
  x: number;
  y: number;
};

type Point3D = {
  x: number;
  y: number;
  z: number;
};

type Point4D = {
  x: number;
  y: number;
  z: number;
  w: number;
};

type Matrix4x4 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

const TESSERACT_EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [0, 2],
  [0, 4],
  [0, 8],
  [1, 3],
  [1, 5],
  [1, 9],
  [2, 3],
  [2, 6],
  [2, 10],
  [3, 7],
  [3, 11],
  [4, 5],
  [4, 6],
  [4, 12],
  [5, 7],
  [5, 13],
  [6, 7],
  [6, 14],
  [7, 15],
  [8, 9],
  [8, 10],
  [8, 12],
  [9, 11],
  [9, 13],
  [10, 11],
  [10, 14],
  [11, 15],
  [12, 13],
  [12, 14],
  [13, 15],
  [14, 15],
];

/* ======================
   Tesseract model
====================== */

function createTesseract(
  cx: number,
  cy: number,
  cz: number,
  cw: number,
  size: number
) {
  const s = size * 0.9;
  const vertices: Point4D[] = [];

  for (let i = 0; i < 16; i += 1) {
    vertices.push({
      x: cx + (i & 1 ? s : -s),
      y: cy + (i & 2 ? s : -s),
      z: cz + (i & 4 ? s : -s),
      w: cw + (i & 8 ? s : -s),
    });
  }

  return { cx, cy, cz, cw, vertices };
}

/* ======================
   Math helpers
====================== */

function rotateMatrixXW(rad: number): Matrix4x4 {
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return [
    cos,
    0,
    0,
    -sin,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    sin,
    0,
    0,
    cos,
  ];
}

function rotateMatrixYW(rad: number): Matrix4x4 {
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return [
    1,
    0,
    0,
    0,
    0,
    cos,
    0,
    -sin,
    0,
    0,
    1,
    0,
    0,
    sin,
    0,
    cos,
  ];
}

function rotateMatrixXY(rad: number): Matrix4x4 {
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return [
    cos,
    -sin,
    0,
    0,
    sin,
    cos,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
  ];
}

function rotateMatrixZW(rad: number): Matrix4x4 {
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    cos,
    -sin,
    0,
    0,
    sin,
    cos,
  ];
}

function multiplyMatrix4Vector(m: Matrix4x4, p: Point4D, out: Point4D) {
  const x = p.x;
  const y = p.y;
  const z = p.z;
  const w = p.w;

  out.x = m[0] * x + m[1] * y + m[2] * z + m[3] * w;
  out.y = m[4] * x + m[5] * y + m[6] * z + m[7] * w;
  out.z = m[8] * x + m[9] * y + m[10] * z + m[11] * w;
  out.w = m[12] * x + m[13] * y + m[14] * z + m[15] * w;
}

function project4Dto3D(points4D: Point4D[], out: Point3D[]) {
  const focal4D = 500;

  for (let i = 0; i < points4D.length; i += 1) {
    const p = points4D[i];
    const scale = focal4D / (focal4D - p.w);
    out[i].x = p.x * scale;
    out[i].y = p.y * scale;
    out[i].z = p.z * scale;
  }
}

function project3Dto2D(points3D: Point3D[], width: number, height: number, out: Point2D[]) {
  const focal3D = 240;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  for (let i = 0; i < points3D.length; i += 1) {
    const p = points3D[i];
    const scale = focal3D / p.z;
    out[i].x = p.x * scale + halfWidth;
    out[i].y = p.y * scale + halfHeight;
  }
}

/* ======================
   Public API
====================== */

export function initCubeScene(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2D context not supported");
  const ctx: CanvasRenderingContext2D = context;

  let frameId = 0;
  let destroyed = false;

  const mouseDrag = {
    x: 0,
    y: 0,
    isDown: false,
    lastX: 0,
    lastY: 0,
    angleXY: 0,
    angleZW: 0,
  };
  const tesseract = createTesseract(0, 0, 420, 0, 160);
  const baseVertices = tesseract.vertices;
  const rotatedVertices = baseVertices.map(vertex => ({ ...vertex }));
  const projected3DVertices = baseVertices.map(() => ({ x: 0, y: 0, z: 0 }));
  const projectedVertices = baseVertices.map(() => ({ x: 0, y: 0 }));
  const tempVertex = { x: 0, y: 0, z: 0, w: 0 };
  let sceneWidth = 0;
  let sceneHeight = 0;

  function resize() {
    sceneWidth = window.innerWidth;
    sceneHeight = window.innerHeight;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(sceneWidth * dpr);
    canvas.height = Math.floor(sceneHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "#000";
  }

  function draw() {
    if (destroyed) return;

    const angleXW = (mouseDrag.y / sceneHeight) * 4 - 2;
    const angleYW = (mouseDrag.x / sceneWidth) * 4 - 2;
    const matrixXW = rotateMatrixXW(angleXW);
    const matrixYW = rotateMatrixYW(angleYW);
    const matrixXY = rotateMatrixXY(mouseDrag.angleXY);
    const matrixZW = rotateMatrixZW(mouseDrag.angleZW);

    for (let i = 0; i < baseVertices.length; i += 1) {
      const p = baseVertices[i];
      tempVertex.x = p.x - tesseract.cx;
      tempVertex.y = p.y - tesseract.cy;
      tempVertex.z = p.z - tesseract.cz;
      tempVertex.w = p.w - tesseract.cw;

      multiplyMatrix4Vector(matrixXW, tempVertex, rotatedVertices[i]);
      multiplyMatrix4Vector(matrixYW, rotatedVertices[i], tempVertex);
      multiplyMatrix4Vector(matrixXY, tempVertex, rotatedVertices[i]);
      multiplyMatrix4Vector(matrixZW, rotatedVertices[i], tempVertex);

      rotatedVertices[i].x = tempVertex.x + tesseract.cx;
      rotatedVertices[i].y = tempVertex.y + tesseract.cy;
      rotatedVertices[i].z = tempVertex.z + tesseract.cz;
      rotatedVertices[i].w = tempVertex.w + tesseract.cw;
    }

    project4Dto3D(rotatedVertices, projected3DVertices);
    project3Dto2D(projected3DVertices, sceneWidth, sceneHeight, projectedVertices);
    ctx.fillRect(0, 0, sceneWidth, sceneHeight);

    for (const edge of TESSERACT_EDGES) {
      ctx.beginPath();
      ctx.moveTo(projectedVertices[edge[0]].x, projectedVertices[edge[0]].y);
      ctx.lineTo(projectedVertices[edge[1]].x, projectedVertices[edge[1]].y);
      ctx.stroke();
    }

    frameId = requestAnimationFrame(draw);
  }

  function onMouseDown(e: MouseEvent) {
    mouseDrag.isDown = true;
    mouseDrag.lastX = e.clientX;
    mouseDrag.lastY = e.clientY;
  }

  function onMouseMove(e: MouseEvent) {
    mouseDrag.x = e.clientX;
    mouseDrag.y = e.clientY;
    if (!mouseDrag.isDown) return;

    const deltaX = e.clientX - mouseDrag.lastX;
    const deltaY = e.clientY - mouseDrag.lastY;
    const sensitivity = 0.008;

    mouseDrag.angleXY += deltaX * sensitivity;
    mouseDrag.angleZW += deltaY * sensitivity;

    mouseDrag.lastX = e.clientX;
    mouseDrag.lastY = e.clientY;
  }

  function onMouseUp() {
    mouseDrag.isDown = false;
  }

  window.addEventListener("resize", resize);
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mouseleave", onMouseUp);

  mouseDrag.x = window.innerWidth / 2;
  mouseDrag.y = window.innerHeight / 2;

  resize();
  frameId = requestAnimationFrame(draw);

  /* ======================
     Erasable cleanup
  ====================== */

  return () => {
    destroyed = true;
    cancelAnimationFrame(frameId);
    window.removeEventListener("resize", resize);
    canvas.removeEventListener("mousedown", onMouseDown);
    canvas.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    canvas.removeEventListener("mouseleave", onMouseUp);
  };
}
