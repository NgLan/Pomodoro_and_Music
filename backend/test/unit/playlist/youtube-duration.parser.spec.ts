import { parseYoutubeDuration } from '../../../src/modules/playlist/infrastructure/external/youtube-duration.parser.js';

describe('parseYoutubeDuration', () => {
  it.each([
    ['PT3M12S', 192],
    ['PT1H2M3S', 3723],
    ['P1DT1H', 90000],
    ['PT0S', 0],
  ])('maps %s to %s seconds', (value, expected) => {
    expect(parseYoutubeDuration(value)).toBe(expected);
  });

  it.each([undefined, '', 'unknown'])('returns null for %s', (value) => {
    expect(parseYoutubeDuration(value)).toBeNull();
  });
});
