import React from 'react';
import type { Theme } from '@ant-design/cssinjs';

import type { AnyObject } from '../_util/type';

import type { AliasToken, OverrideToken, MapToken, SeedToken } from '../interface';

import defaultSeedToken from '../themes/seed';


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

export const preserve: {
  [key in keyof AliasToken]?: boolean;
} = {
  screenXS: true,
  screenXSMin: true,
  screenXSMax: true,
  screenSM: true,
  screenSMMin: true,
  screenSMMax: true,
  screenMD: true,
  screenMDMin: true,
  screenMDMax: true,
  screenLG: true,
  screenLGMin: true,
  screenLGMax: true,
  screenXL: true,
  screenXLMin: true,
  screenXLMax: true,
  screenXXL: true,
  screenXXLMin: true,
};


// ================================ Context =================================
// To ensure snapshot stable. We disable hashed in test env.
export const DefaultThemeProviderContextConfig = {
  token: defaultSeedToken,
  override: { override: defaultSeedToken },
  hashed: true,
  theme: undefined,
  components: undefined,
  cssVar: undefined,
};

export type ComponentsToken<CompTokenMap extends AnyObject> = {
  [key in keyof OverrideToken<CompTokenMap>]?: OverrideToken<CompTokenMap>[key] & {
    theme?: Theme<SeedToken, MapToken>;
  };
};

export interface DesignTokenProviderProps<CompTokenMap extends AnyObject> {
  token: Partial<AliasToken>;
  theme?: Theme<SeedToken, MapToken>;
  components?: ComponentsToken<CompTokenMap>;
  /** Just merge `token` & `override` at top to save perf */
  override: { override: Partial<AliasToken> } & ComponentsToken<CompTokenMap>;
  hashed?: string | boolean;
  cssVar?: {
    prefix?: string;
    key?: string;
  };
}

export type UseThemeProviderContext<CompTokenMap extends AnyObject> = () => [React.Context<DesignTokenProviderProps<CompTokenMap>>];

export function useMergedThemeContext<CompTokenMap extends AnyObject> (useThemeProviderContext?: UseThemeProviderContext<CompTokenMap>) {
  const DefaultThemeProviderContext = React.createContext(DefaultThemeProviderContextConfig);

  if (typeof useThemeProviderContext === 'function') {
    const [ThemeProviderContext] = useThemeProviderContext();

    return React.useContext({
      ...DefaultThemeProviderContext,
      ...ThemeProviderContext,
    });
  }

  return React.useContext(DefaultThemeProviderContext);
}

