import { TEXT_TONE_CLASS_MAP } from './map';
import { buildColorTone } from './tailwind';

describe('buildColorTone', () => {
  it('returns explicit color first when provided', () => {
    expect(
      buildColorTone({
        color: 'text-custom-500',
        tone: 'danger',
        optTone: 'info',
        optColor: 'text-fallback',
        classMap: TEXT_TONE_CLASS_MAP,
      }),
    ).toBe('text-custom-500');
  });

  it('returns tone class when no explicit color exists', () => {
    expect(
      buildColorTone({
        tone: 'danger',
        classMap: TEXT_TONE_CLASS_MAP,
      }),
    ).toBe('text-rose-600');
  });

  it('returns optional tone class when primary tone is absent', () => {
    expect(
      buildColorTone({
        optTone: 'info',
        classMap: TEXT_TONE_CLASS_MAP,
      }),
    ).toBe('text-sky-600');
  });

  it('returns optional color when no tone mapping can be resolved', () => {
    expect(
      buildColorTone({
        optColor: 'text-muted-fallback',
      }),
    ).toBe('text-muted-fallback');
  });

  it('returns undefined when no input can resolve a class', () => {
    expect(buildColorTone({})).toBeUndefined();
    expect(
      buildColorTone({
        tone: 'danger',
      }),
    ).toBeUndefined();
  });
});
