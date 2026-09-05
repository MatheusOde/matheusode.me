import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
const css = readFileSync(new URL('../../src/styles/tokens.css', import.meta.url), 'utf8');
function luminance(token: string) {
  const hex = css.match(new RegExp(`--${token}:\\s*#([0-9a-f]{6})`, 'i'))?.[1];
  if (!hex) throw new Error(`Missing color token: ${token}`);
  const channels = [0,2,4].map(i => parseInt(hex.slice(i,i+2),16)/255).map(c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4);
  return channels[0]*0.2126+channels[1]*0.7152+channels[2]*0.0722;
}
test('text and focus colors meet WCAG AA on all intended surfaces', () => {
  for (const foreground of ['text','text-secondary','accent']) for (const background of ['background','surface','surface-raised','accent-surface']) {
    const values=[luminance(foreground),luminance(background)].sort((a,b)=>b-a);
    expect((values[0]+0.05)/(values[1]+0.05),`${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5);
  }
});
