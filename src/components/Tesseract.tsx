type Point2D = {
  x: number;
  y: number;
};

type Point3D = {
  x: number;
  y: number;
  z: number;
};

/* ======================
   Cube model
====================== */

function createCube(
  cx: number,
  cy: number,
  cz: number,
  size: number
) {
  const s = size * 0.9;

  const vertices: Point3D[] = [
    { x: cx - s, y: cy - s, z: cz - s },
    { x: cx + s, y: cy - s, z: cz - s },
    { x: cx + s, y: cy + s, z: cz - s },
    { x: cx - s, y: cy + s, z: cz - s },
    { x: cx - s, y: cy - s, z: cz + s },
    { x: cx + s, y: cy - s, z: cz + s },
    { x: cx + s, y: cy + s, z: cz + s },
    { x: cx - s, y: cy + s, z: cz + s },
  ];

  const faces = [
    [0, 1, 2, 3],
    [0, 4, 5, 1],
    [1, 5, 6, 2],
    [3, 2, 6, 7],
    [0, 3, 7, 4],
    [4, 7, 6, 5],
  ];

  return { cx, cy, cz, vertices, faces };
}

/* ======================
   Math helpers
====================== */

function rotateX(cube: ReturnType<typeof createCube>, rad: number) {
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  for (const p of cube.vertices) {
    const y = (p.y - cube.cy) * cos - (p.z - cube.cz) * sin;
    const z = (p.y - cube.cy) * sin + (p.z - cube.cz) * cos;
    p.y = y + cube.cy;
    p.z = z + cube.cz;
  }
}

function rotateY(cube: ReturnType<typeof createCube>, rad: number) {
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  for (const p of cube.vertices) {
    const x = (p.x - cube.cx) * cos - (p.z - cube.cz) * sin;
    const z = (p.x - cube.cx) * sin + (p.z - cube.cz) * cos;
    p.x = x + cube.cx;
    p.z = z + cube.cz;
  }
}

function project(
  points: Point3D[],
  width: number,
  height: number
): Point2D[] {
  const focal = 200;

  return points.map(p => {
    const scale = focal / p.z;
    return {
      x: p.x * scale + width / 2,
      y: p.y * scale + height / 2,
    };
  });
}

/* ======================
   Public API
====================== */

export function initCubeScene(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context not supported");

  let frameId = 0;
  let destroyed = false;

  const mouse = { x: 0, y: 0 };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function draw() {
    if (destroyed) return;

    resize();
    const { width, height } = canvas;
    if (!ctx) throw new Error("2D context not supported");

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#fff";

    const cube = createCube(0, 0, 400, 200);

    rotateX(cube, (mouse.y / height) * 4 - 2);
    rotateY(cube, (mouse.x / width) * 4 - 2);

    const projected = project(cube.vertices, width, height);

    for (const face of cube.faces) {
      ctx.beginPath();
      ctx.moveTo(projected[face[0]].x, projected[face[0]].y);
      ctx.lineTo(projected[face[1]].x, projected[face[1]].y);
      ctx.lineTo(projected[face[2]].x, projected[face[2]].y);
      ctx.lineTo(projected[face[3]].x, projected[face[3]].y);
      ctx.closePath();
      ctx.stroke();
    }

    frameId = requestAnimationFrame(draw);
  }

  function onMouseMove(e: MouseEvent) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  window.addEventListener("resize", resize);
  canvas.addEventListener("mousemove", onMouseMove);

  resize();
  frameId = requestAnimationFrame(draw);

  /* ======================
     Erasable cleanup
  ====================== */

  return () => {
    destroyed = true;
    cancelAnimationFrame(frameId);
    window.removeEventListener("resize", resize);
    canvas.removeEventListener("mousemove", onMouseMove);
  };
}
