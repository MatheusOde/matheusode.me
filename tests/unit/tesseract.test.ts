import { describe, expect, test } from 'vitest';
import {
  EDGE_COUNT,
  VERTEX_COUNT,
  edges,
  projectScene,
  projectTo3D,
  rotate4,
  vertices,
  type Rotation4D,
} from '../../src/lib/features/portfolio/tesseract';

function isFiniteVector(values: readonly number[]): boolean {
  return values.every((value) => Number.isFinite(value));
}

describe('tesseract geometry', () => {
  test('has sixteen unique four-dimensional vertices', () => {
    expect(vertices).toHaveLength(VERTEX_COUNT);
    expect(new Set(vertices.map((vertex) => vertex.join(','))).size).toBe(VERTEX_COUNT);
    for (const vertex of vertices) {
      expect(vertex).toHaveLength(4);
      for (const coordinate of vertex) expect([-1, 1]).toContain(coordinate);
    }
  });

  test('has thirty-two unique edges, four per vertex, each differing in one coordinate', () => {
    expect(edges).toHaveLength(EDGE_COUNT);
    expect(new Set(edges.map(([a, b]) => `${a}-${b}`)).size).toBe(EDGE_COUNT);
    const degree = new Array<number>(VERTEX_COUNT).fill(0);
    for (const [a, b] of edges) {
      const differences = vertices[a].reduce(
        (count, coordinate, axis) => count + (coordinate === vertices[b][axis] ? 0 : 1),
        0,
      );
      expect(differences).toBe(1);
      degree[a] += 1;
      degree[b] += 1;
    }
    expect(degree).toEqual(new Array<number>(VERTEX_COUNT).fill(4));
  });
});

describe('tesseract projection', () => {
  const rotations: Rotation4D[] = [];
  for (const xy of [0, Math.PI / 3]) {
    for (const xz of [0, -Math.PI / 2]) {
      for (const xw of [0, Math.PI, Math.PI / 5]) {
        for (const yz of [0, Math.PI / 4]) {
          for (const yw of [0, Math.PI / 6]) {
            for (const zw of [0, Math.PI / 7]) {
              rotations.push({ xy, xz, xw, yz, yw, zw });
            }
          }
        }
      }
    }
  }

  test('stays finite across supported rotation angles', () => {
    for (const rotation of rotations) {
      for (const vertex of vertices) {
        const projected = projectTo3D(rotate4(vertex, rotation));
        expect(isFiniteVector(projected), JSON.stringify(rotation)).toBe(true);
      }
    }
  });

  test('projects a centered scene that fits narrow and wide containers', () => {
    for (const [width, height] of [
      [320, 240],
      [1280, 400],
      [480, 720],
      [200, 200],
    ]) {
      const padding = 10;
      for (const rotation of rotations) {
        const scene = projectScene(rotation, width, height, padding);
        expect(scene).toHaveLength(VERTEX_COUNT);
        for (const { point, depth } of scene) {
          expect(isFiniteVector(point)).toBe(true);
          expect(depth).toBeGreaterThanOrEqual(0);
          expect(depth).toBeLessThanOrEqual(1);
          const distance = Math.hypot(point[0] - width / 2, point[1] - height / 2);
          expect(distance).toBeLessThanOrEqual(Math.min(width, height) / 2 - padding + 1e-6);
        }
      }
    }
  });
});
