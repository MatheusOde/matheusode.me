import { expect, test } from 'vitest';
import { conversionEvents, conversionPayload, isConversionEvent } from '../../src/lib/analytics';
test('only five fixed conversion events are accepted, with no visitor data', () => {
  for (const event of conversionEvents) expect(conversionPayload(event)).toEqual({name:event});
  expect(isConversionEvent('someone@example.com')).toBe(false);
  expect(isConversionEvent(undefined)).toBe(false);
});
