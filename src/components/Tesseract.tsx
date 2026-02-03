class Point2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Point3D {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Cube extends Point3D {
  vertices: Point3D[];
  faces: number[][];

  constructor(x: number, y: number, z: number, size: number) {
    size *= 0.9;
    super(x, y, z);

    this.vertices = [
      new Point3D(x - size, y - size, z - size),
      new Point3D(x + size, y - size, z - size),
      new Point3D(x + size, y + size, z - size),
      new Point3D(x - size, y + size, z - size),
      new Point3D(x - size, y - size, z + size),
      new Point3D(x + size, y - size, z + size),
      new Point3D(x + size, y + size, z + size),
      new Point3D(x - size, y + size, z + size),
    ];

    this.faces = [
      [0, 1, 2, 3],
      [0, 4, 5, 1],
      [1, 5, 6, 2],
      [3, 2, 6, 7],
      [0, 3, 7, 4],
      [4, 7, 6, 5],
    ];
  }

  rotateY(radian: number) {
    const cosine = Math.cos(radian);
    const sine = Math.sin(radian);

    for (let i = this.vertices.length - 1; i >= 0; i--) {
      const p = this.vertices[i];

      const y = (p.y - this.y) * cosine - (p.z - this.z) * sine;
      const z = (p.y - this.y) * sine + (p.z - this.z) * cosine;

      p.y = y + this.y;
      p.z = z + this.z;
    }
  }

  rotateX(radian: number) {
    const cosine = Math.cos(radian);
    const sine = Math.sin(radian);

    for (let i = this.vertices.length - 1; i >= 0; i--) {
      const p = this.vertices[i];

      const x =
        radian <= 0
          ? (p.z - this.z) * -sine + (p.x - this.x) * -cosine
          : (p.z - this.z) * sine + (p.x - this.x) * cosine;

      const z =
        radian <= 0
          ? (p.z - this.z) * -cosine - (p.x - this.x) * -sine
          : (p.z - this.z) * cosine - (p.x - this.x) * sine;

      p.x = x + this.x;
      p.z = z + this.z;
    }
  }

  rotateZ(radian: number) {
    const cosine = Math.cos(radian);
    const sine = Math.sin(radian);

    for (let i = this.vertices.length - 1; i >= 0; i--) {
      const p = this.vertices[i];

      const x = (p.x - this.x) * cosine - (p.y - this.y) * sine;
      const y = (p.x - this.x) * sine + (p.y - this.y) * cosine;

      p.x = x + this.x;
      p.y = y + this.y;
    }
  }
}


function project(
  points3d: Point3D[],
  width: number,
  height: number
): Point2D[] {
  const focalLength = 200;
  const points2d: Point2D[] = new Array(points3d.length);

  for (let i = points3d.length - 1; i >= 0; i--) {
    const p = points3d[i];
    const x = p.x * (focalLength / p.z) + width * 0.5;
    const y = p.y * (focalLength / p.z) + height * 0.5;
    points2d[i] = new Point2D(x, y);
  }

  return points2d;
}

type Mouse = { x?: number; y?: number };
type Rotation = { x?: number; y?: number };

const rotation: Rotation = {};
const mouse: Mouse = {};

const canvas = document.querySelector<HTMLCanvasElement>("canvas");
if (!canvas) throw new Error("Canvas not found");

const context = canvas.getContext("2d");
if (!context) throw new Error("2D context not supported");

let cube = new Cube(0, 0, 400, 200);

function loop(mouse: Mouse) {
  const height = document.documentElement.clientHeight;
  const width = document.documentElement.clientWidth;

  context.canvas.height = height;
  context.canvas.width = width;

  context.fillStyle = "#000000";
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "#ffffff";

  const zeroX = mouse.x !== undefined ? (mouse.x / width) * 4 - 2 : NaN;
  const zeroY = mouse.y !== undefined ? (mouse.y / height) * 4 - 2 : NaN;

  if (!Number.isNaN(zeroX)) rotation.x = zeroX;
  if (!Number.isNaN(zeroY)) rotation.y = zeroY;

  cube.rotateX(rotation.x ?? 0);
  cube.rotateY(rotation.y ?? 0);

  const vertices = project(cube.vertices, width, height);

  for (let i = cube.faces.length - 1; i >= 0; i--) {
    const face = cube.faces[i];

    context.beginPath();
    context.moveTo(vertices[face[0]].x, vertices[face[0]].y);
    context.lineTo(vertices[face[1]].x, vertices[face[1]].y);
    context.lineTo(vertices[face[2]].x, vertices[face[2]].y);
    context.lineTo(vertices[face[3]].x, vertices[face[3]].y);
    context.closePath();
    context.stroke();
  }

  cube = new Cube(0, 0, 400, 200);
}

let lastFrame = Date.now();

canvas.addEventListener("mousemove", (e: MouseEvent) => {
  const now = Date.now();
  if (now - lastFrame < 1000 / 30) return;

  mouse.x = e.clientX;
  mouse.y = e.clientY;

  loop(mouse);
  requestAnimationFrame(() => loop(mouse));
  lastFrame = now;
});

export function initCubeScene(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("2D context not supported");
  }

  type Mouse = { x?: number; y?: number };
  type Rotation = { x?: number; y?: number };

  const mouse: Mouse = {};
  const rotation: Rotation = {};

  let cube = new Cube(0, 0, 400, 200);
  let lastFrame = 0;

  function loop() {
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;

    canvas.width = width;
    canvas.height = height;

    context.fillStyle = "#000";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "#fff";

    const zeroX =
      mouse.x !== undefined ? (mouse.x / width) * 4 - 2 : 0;
    const zeroY =
      mouse.y !== undefined ? (mouse.y / height) * 4 - 2 : 0;

    rotation.x = zeroX;
    rotation.y = zeroY;

    cube.rotateX(rotation.x);
    cube.rotateY(rotation.y);

    const vertices = project(cube.vertices, width, height);

    for (const face of cube.faces) {
      context.beginPath();
      context.moveTo(vertices[face[0]].x, vertices[face[0]].y);
      context.lineTo(vertices[face[1]].x, vertices[face[1]].y);
      context.lineTo(vertices[face[2]].x, vertices[face[2]].y);
      context.lineTo(vertices[face[3]].x, vertices[face[3]].y);
      context.closePath();
      context.stroke();
    }

    cube = new Cube(0, 0, 400, 200);
    requestAnimationFrame(loop);
  }

  canvas.addEventListener("mousemove", (e: MouseEvent) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  requestAnimationFrame(loop);
}
