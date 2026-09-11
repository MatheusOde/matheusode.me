<script lang="ts">
  import { onMount } from 'svelte';
  import { edges, projectScene, type Rotation4D } from '../tesseract';

  const AUTOROTATION = { xz: 0.05, zw: 0.02 };
  const POINTER_RANGE = 0.9;
  const POINTER_EASING = 0.04;
  const MAX_PIXEL_RATIO = 2;
  const LINE_PADDING = 24;

  let canvas = $state<HTMLCanvasElement>();

  let context: CanvasRenderingContext2D | null = null;
  let accent = '166, 205, 244';
  let frame = 0;
  let resizeObserver: ResizeObserver | null = null;
  let autoRotate = true;
  let spin = { xz: 0, zw: 0 };
  let pointerTarget = { xw: 0, yw: 0 };
  let pointerCurrent = { xw: 0, yw: 0 };
  let lastTime = 0;
  let dirty = true;

  function currentRotation(): Rotation4D {
    return {
      xy: 0,
      xz: spin.xz,
      xw: pointerCurrent.xw,
      yz: 0,
      yw: pointerCurrent.yw,
      zw: spin.zw,
    };
  }

  function render() {
    if (!canvas || !context) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) return;

    const scene = projectScene(currentRotation(), width, height, LINE_PADDING);
    context.clearRect(0, 0, width, height);
    context.lineCap = 'round';

    const ordered = edges
      .map((edge) => ({
        edge,
        depth: (scene[edge[0]].depth + scene[edge[1]].depth) / 2,
      }))
      .sort((first, second) => first.depth - second.depth);

    for (const { edge, depth } of ordered) {
      context.beginPath();
      context.moveTo(scene[edge[0]].point[0], scene[edge[0]].point[1]);
      context.lineTo(scene[edge[1]].point[0], scene[edge[1]].point[1]);
      context.strokeStyle = `rgba(${accent}, ${0.08 + depth * 0.46})`;
      context.lineWidth = 2.5 + depth * 6.5;
      context.stroke();
    }
  }

  function resize() {
    if (!canvas || !context) return;
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    render();
  }

  function tick(time: number) {
    frame = requestAnimationFrame(tick);
    const delta = lastTime === 0 ? 0 : (time - lastTime) / 1000;
    lastTime = time;

    if (autoRotate && !document.hidden) {
      spin.xz += delta * AUTOROTATION.xz;
      spin.zw += delta * AUTOROTATION.zw;
      dirty = true;
    }

    const dx = pointerTarget.xw - pointerCurrent.xw;
    const dy = pointerTarget.yw - pointerCurrent.yw;
    if (Math.abs(dx) > 0.0002 || Math.abs(dy) > 0.0002) {
      pointerCurrent.xw += dx * POINTER_EASING;
      pointerCurrent.yw += dy * POINTER_EASING;
      dirty = true;
    }

    if (dirty) {
      render();
      dirty = false;
    }
  }

  function startLoop() {
    if (frame === 0) {
      lastTime = 0;
      frame = requestAnimationFrame(tick);
    }
  }

  function stopLoop() {
    if (frame !== 0) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }

  function handleVisibility() {
    if (document.hidden) stopLoop();
    else startLoop();
  }

  function handlePointerMove(event: PointerEvent) {
    if (event.pointerType !== 'mouse') return;
    const width = window.innerWidth || 1;
    const height = window.innerHeight || 1;
    pointerTarget.xw = ((event.clientX / width) * 2 - 1) * POINTER_RANGE;
    pointerTarget.yw = ((event.clientY / height) * 2 - 1) * POINTER_RANGE;
  }

  onMount(() => {
    const element = canvas;
    if (!element) return;
    context = element.getContext('2d');
    if (!context) return;

    const accentValue = getComputedStyle(element).getPropertyValue('--accent').trim();
    const hex = /^#?([0-9a-f]{6})$/i.exec(accentValue);
    if (hex) {
      const value = Number.parseInt(hex[1], 16);
      accent = `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
    }

    autoRotate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element);

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pointermove', handlePointerMove);

    resize();
    startLoop();

    return () => {
      stopLoop();
      resizeObserver?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  });
</script>

<canvas bind:this={canvas} class="tesseract-canvas" aria-hidden="true"></canvas>

<style>
  .tesseract-canvas {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    display: block;
    pointer-events: none;
    filter: blur(6px);
  }
</style>
