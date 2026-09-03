import { ErrorCode } from '../../../src/common/exceptions/error-code.enum.js';
import { parseYoutubeVideoId } from '../../../src/modules/playlist/infrastructure/external/youtube-url.parser.js';

describe('parseYoutubeVideoId', () => {
  it.each([
    ['https://www.youtube.com/watch?v=jfKfPfyJRdk', 'jfKfPfyJRdk'],
    ['https://youtu.be/jfKfPfyJRdk?t=10', 'jfKfPfyJRdk'],
    ['https://music.youtube.com/watch?v=jfKfPfyJRdk', 'jfKfPfyJRdk'],
    ['https://youtube.com/shorts/jfKfPfyJRdk', 'jfKfPfyJRdk'],
  ])('extracts the id from %s', (url, expected) => {
    expect(parseYoutubeVideoId(url)).toBe(expected);
  });

  it.each([
    'not-a-url',
    'https://example.com/watch?v=jfKfPfyJRdk',
    'https://youtube.com/playlist?list=PL123',
  ])('rejects invalid video URL %s', (url) => {
    expect(() => parseYoutubeVideoId(url)).toThrowError(
      expect.objectContaining({ code: ErrorCode.INVALID_YOUTUBE_URL }),
    );
  });
});
