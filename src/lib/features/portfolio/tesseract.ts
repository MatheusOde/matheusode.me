export type Vec2 = readonly [number, number];
export type Vec3 = readonly [number, number, number];
export type Vec4 = readonly [number, number, number, number];

export interface Rotation4D {
  readonly xy: number;
  readonly xz: number;
  readonly xw: number;
  readonly yz: number;
  readonly yw: number;
  readonly zw: number;
}

export interface ProjectedVertex {
  readonly point: Vec2;
  readonly depth: number;
}

export const VERTEX_COUNT = 16;
export const EDGE_COUNT = 32;

export const PROJECTION_4D_DISTANCE = 4;
export const PROJECTION_3D_DISTANCE = 10;

function createVertices(): Vec4[] {
  const result: Vec4[] = [];
  for (let index = 0; index < VERTEX_COUNT; index += 1) {
    result.push([
      index & 1 ? 1 : -1,
      index & 2 ? 1 : -1,
      index & 4 ? 1 : -1,
      index & 8 ? 1 : -1,
    ]);
  }
  return result;
}

export const vertices: readonly Vec4[] = createVertices();

function differsInOneCoordinate(a: Vec4, b: Vec4): boolean {
  let differences = 0;
  for (let axis = 0; axis < 4; axis += 1) {
    if (a[axis] !== b[axis]) differences += 1;
  }
  return differences === 1;
}

function createEdges(): ReadonlyArray<readonly [number, number]> {
  const result: Array<readonly [number, number]> = [];
  for (let first = 0; first < vertices.length; first += 1) {
    for (let second = first + 1; second < vertices.length; second += 1) {
      if (differsInOneCoordinate(vertices[first], vertices[second])) {
        result.push([first, second]);
      }
    }
  }
  return result;
}

export const edges: ReadonlyArray<readonly [number, number]> = createEdges();

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function rotatePlane(vertex: Vec4, first: number, second: number, angle: number): Vec4 {
  if (angle === 0) return vertex;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const next: [number, number, number, number] = [vertex[0], vertex[1], vertex[2], vertex[3]];
  next[first] = vertex[first] * cos - vertex[second] * sin;
  next[second] = vertex[first] * sin + vertex[second] * cos;
  return next;
}

export function rotate4(vertex: Vec4, rotation: Rotation4D): Vec4 {
  let result = vertex;
  result = rotatePlane(result, 0, 1, rotation.xy);
  result = rotatePlane(result, 0, 2, rotation.xz);
  result = rotatePlane(result, 0, 3, rotation.xw);
  result = rotatePlane(result, 1, 2, rotation.yz);
  result = rotatePlane(result, 1, 3, rotation.yw);
  result = rotatePlane(result, 2, 3, rotation.zw);
  return result;
}

export function projectTo3D(vertex: Vec4): Vec3 {
  const scale = PROJECTION_4D_DISTANCE / (PROJECTION_4D_DISTANCE - vertex[3]);
  return [vertex[0] * scale, vertex[1] * scale, vertex[2] * scale];
}

export function projectTo2D(vertex: Vec3): Vec2 {
  const scale = PROJECTION_3D_DISTANCE / (PROJECTION_3D_DISTANCE - vertex[2]);
  return [vertex[0] * scale, vertex[1] * scale];
}

export function projectVertex(vertex: Vec4, rotation: Rotation4D): ProjectedVertex {
  const projected = projectTo3D(rotate4(vertex, rotation));
  return {
    point: projectTo2D(projected),
    depth: clamp((projected[2] + 4) / 8, 0, 1),
  };
}

export function projectScene(
  rotation: Rotation4D,
  width: number,
  height: number,
  padding = 0,
): ProjectedVertex[] {
  const projected = vertices.map((vertex) => projectVertex(vertex, rotation));
  let maxRadius = 0;
  for (const { point } of projected) {
    maxRadius = Math.max(maxRadius, Math.hypot(point[0], point[1]));
  }
  const available = Math.min(width, height) / 2 - padding;
  const scale = maxRadius > 0 && available > 0 ? available / maxRadius : 1;
  const centerX = width / 2;
  const centerY = height / 2;
  return projected.map(({ point, depth }) => ({
    point: [centerX + point[0] * scale, centerY + point[1] * scale] as Vec2,
    depth,
  }));
}
