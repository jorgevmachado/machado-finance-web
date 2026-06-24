import {
  BACKGROUND_COLOR_CLASS_MAP,
  BORDER_COLOR_CLASS_MAP,
  BORDER_RADIUS_CLASS_MAP,
  BREAK_CLASS_MAP,
  DECORATION_CLASS_MAP,
  DISPLAY_CLASS_MAP,
  FONT_FAMILY_CLASS_MAP,
  HOVER_EFFECT_CLASS_MAP,
  LEADING_CLASS_MAP,
  LINE_CLAMP_CLASS_MAP,
  PADDING_CLASS_MAP,
  SHADOW_CLASS_MAP,
  TEXT_ALIGN_CLASS_MAP,
  TEXT_SIZE_CLASS_MAP,
  TEXT_TONE_CLASS_MAP,
  TRACKING_CLASS_MAP,
  TRANSFORM_CLASS_MAP,
  WEIGHT_CLASS_MAP,
  WHITESPACE_CLASS_MAP,
  WIDTH_CLASS_MAP,
  WRAP_CLASS_MAP,
} from './map';

describe('tailwind class maps', () => {
  it('exposes expected classes for text, spacing and effects', () => {
    expect(TEXT_SIZE_CLASS_MAP['9xl']).toBe('text-9xl');
    expect(TEXT_TONE_CLASS_MAP.secondary).toBe('text-violet-600');
    expect(TEXT_ALIGN_CLASS_MAP.justify).toBe('text-justify');
    expect(TRACKING_CLASS_MAP.widest).toBe('tracking-widest');
    expect(TRANSFORM_CLASS_MAP.none).toBe('normal-case');
    expect(LEADING_CLASS_MAP['10']).toBe('leading-10');
    expect(PADDING_CLASS_MAP.xl).toBe('p-8');
    expect(SHADOW_CLASS_MAP.none).toBe('shadow-none');
    expect(WEIGHT_CLASS_MAP.extralight).toBe('font-extralight');
    expect(HOVER_EFFECT_CLASS_MAP.lift).toContain('hover:-translate-y-1');
  });

  it('exposes expected classes for color, layout and width utilities', () => {
    expect(BACKGROUND_COLOR_CLASS_MAP.transparent).toBe('bg-transparent');
    expect(BORDER_COLOR_CLASS_MAP['slate-200/60']).toBe('border-slate-200/60');
    expect(BORDER_RADIUS_CLASS_MAP.full).toBe('rounded-full');
    expect(DECORATION_CLASS_MAP.lineThrough).toBe('line-through');
    expect(FONT_FAMILY_CLASS_MAP.mono).toBe('font-mono');
    expect(DISPLAY_CLASS_MAP.inlineBlock).toBe('inline-block');
    expect(WHITESPACE_CLASS_MAP.breakSpaces).toBe('whitespace-break-spaces');
    expect(LINE_CLAMP_CLASS_MAP.none).toBe('line-clamp-none');
    expect(BREAK_CLASS_MAP.keep).toBe('break-keep');
    expect(WRAP_CLASS_MAP.balance).toBe('text-balance');
    expect(WIDTH_CLASS_MAP.screen).toBe('max-w-screen');
  });
});
