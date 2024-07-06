import type { CSSInterpolation, DerivativeFunc } from '@ant-design/cssinjs';

import type { AliasToken } from './alias';
import type { MapToken } from './maps';
import type { SeedToken } from './seeds';
import type { AnyObject } from '../_util/type';

export type MappingAlgorithm = DerivativeFunc<SeedToken, MapToken>;

export type { AliasToken } from './alias';

export type {
  OverrideToken,
  GlobalToken,
} from './components';

export type { default as DefaultConfigConsumerProps, CSPConfig } from './configProvider';
export type {
  ColorMapToken,
  ColorNeutralMapToken,
  CommonMapToken,
  FontMapToken,
  HeightMapToken,
  MapToken,
  SizeMapToken,
  StyleMapToken,
} from './maps';
export { PresetColors } from './presetColors';
export {
  unitless,
  ignore,
  preserve,
  defaultTheme,
} from './themeProvider';
export type {
  DesignTokenProviderProps,
} from './themeProvider';
export type {
  LegacyColorPalettes,
  ColorPalettes,
  PresetColorKey,
  PresetColorType,
} from './presetColors';
export type { SeedToken } from './seeds';

export type UseComponentStyleResult = [(node: React.ReactNode) => React.ReactElement, string];

export type GenerateStyle<
  ComponentToken extends AnyObject = AliasToken,
  ReturnType = CSSInterpolation,
> = (token: ComponentToken) => ReturnType;
