import React from 'react';
import type { Theme } from '@ant-design/cssinjs';

import defaultSeedToken from '../themes/seed';

import type { AliasToken, OverrideToken, MapToken, SeedToken, GlobalToken } from '../interface';

export const unitless: {
  [key in keyof AliasToken]?: boolean;
} = {
  lineHeight: true,
  lineHeightSM: true,
  lineHeightLG: true,
  lineHeightHeading1: true,
  lineHeightHeading2: true,
  lineHeightHeading3: true,
  lineHeightHeading4: true,
  lineHeightHeading5: true,
  opacityLoading: true,
  fontWeightStrong: true,
  zIndexPopupBase: true,
  zIndexBase: true,
};

export const ignore: {
  [key in keyof AliasToken]?: boolean;
} = {
  size: true,
  sizeSM: true,
  sizeLG: true,
  sizeMD: true,
  sizeXS: true,
  sizeXXS: true,
  sizeMS: true,
  sizeXL: true,
  sizeXXL: true,
  sizeUnit: true,
  sizeStep: true,
  motionBase: true,
  motionUnit: true,
};

type ComponentsToken<CompTokenMap extends Object> = {
  [key in keyof OverrideToken<CompTokenMap>]?: OverrideToken<CompTokenMap>[key] & {
    theme?: Theme<SeedToken, MapToken>;
  };
};

export interface DesignTokenProviderProps<CompTokenMap extends Object> {
  token: GlobalToken<CompTokenMap>;
  /** Just merge `token` & `override` at top to save perf */
  override: { override: Partial<AliasToken> } & ComponentsToken<CompTokenMap>;
  realToken?: GlobalToken<CompTokenMap>;
  hashId?: string;
  theme?: Theme<SeedToken, MapToken>;
  components?: ComponentsToken<CompTokenMap>;
  hashed?: string | boolean;
  cssVar?: {
    prefix?: string;
    key?: string;
  };
}

// To ensure snapshot stable. We disable hashed in test env.
export const DefaultThemeProviderContextConfig = {
  token: defaultSeedToken,
  override: { override: defaultSeedToken },
  hashed: true,
};

export type GetThemeProviderContext<CompTokenMap extends Object> = () => [React.Context<DesignTokenProviderProps<CompTokenMap>>];

export function useMergedThemeContext<CompTokenMap extends Object> (getThemeProviderContext?: GetThemeProviderContext<CompTokenMap>) {
  const DefaultThemeProviderContext = React.createContext<DesignTokenProviderProps<CompTokenMap>>(
    DefaultThemeProviderContextConfig as DesignTokenProviderProps<CompTokenMap>
  );

  const [ThemeProviderContext = {}] = getThemeProviderContext?.() ?? [];

  return React.useContext({
    ...DefaultThemeProviderContext,
    ...ThemeProviderContext,
  });
}

