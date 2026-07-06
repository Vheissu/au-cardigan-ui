import { CardiganThemes, isThemeName, resolveTheme } from '../src/themes';
import { buildThemeCss } from '../src/theme';
import { CardiganConfiguration } from '../src/configuration';
import type { IContainer } from '@aurelia/kernel';

class StubContainer {
  public registered: unknown[] = [];
  register(...params: unknown[]) {
    this.registered.push(...params);
    return this;
  }
}

describe('Cardigan themes', () => {
  afterEach(() => {
    document.querySelector('style[data-au-cardigan-theme]')?.remove();
  });

  test('ships light, dark, ocean, forest and sunset presets', () => {
    expect(Object.keys(CardiganThemes).sort()).toEqual(
      ['dark', 'forest', 'light', 'ocean', 'sunset']
    );
  });

  test('every preset defines the full semantic token set', () => {
    for (const [name, preset] of Object.entries(CardiganThemes)) {
      for (const token of ['primary', 'background', 'surface', 'text', 'textMuted', 'border']) {
        expect({ name, token, value: preset.colors?.[token] }).toEqual({
          name,
          token,
          value: expect.stringMatching(/^#[0-9A-Fa-f]{6}$/),
        });
      }
    }
  });

  test('resolveTheme resolves preset names', () => {
    expect(resolveTheme('dark')).toBe(CardiganThemes.dark);
  });

  test('resolveTheme passes custom options through untouched', () => {
    const custom = { colors: { primary: '#ABCDEF' } };
    expect(resolveTheme(custom)).toBe(custom);
  });

  test('resolveTheme returns undefined for no theme', () => {
    expect(resolveTheme()).toBeUndefined();
  });

  test('resolveTheme throws a helpful error for unknown names', () => {
    expect(() => resolveTheme('neon' as never)).toThrow(/Unknown Cardigan theme: "neon"/);
  });

  test('isThemeName narrows preset names', () => {
    expect(isThemeName('ocean')).toBe(true);
    expect(isThemeName('neon')).toBe(false);
    expect(isThemeName({ colors: {} })).toBe(false);
  });

  test('buildThemeCss emits semantic tokens', () => {
    const css = buildThemeCss(CardiganThemes.dark);
    expect(css).toContain('--au-cardigan-color-background: #101317;');
    expect(css).toContain('--au-cardigan-color-text: #E9ECEF;');
    expect(css).toContain('--au-cardigan-color-primary: #5C9DFF;');
  });

  test('configuration accepts a preset name', () => {
    const config = CardiganConfiguration.withTheme('dark');
    const container = new StubContainer();

    config.register(container as unknown as IContainer);

    const style = document.querySelector('style[data-au-cardigan-theme]');
    expect(style?.textContent).toContain('--au-cardigan-color-primary: #5C9DFF;');
  });

  test('configuration from() accepts a preset name alongside other options', () => {
    const config = CardiganConfiguration.from({ theme: 'sunset', exclude: ['au-toast'] });
    const container = new StubContainer();

    config.register(container as unknown as IContainer);

    const style = document.querySelector('style[data-au-cardigan-theme]');
    expect(style?.textContent).toContain('--au-cardigan-color-primary: #E85D04;');
  });
});
