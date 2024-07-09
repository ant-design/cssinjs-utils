import React from 'react';
import type { Theme } from '@ant-design/cssinjs';

import defaultSeedToken from '../themes/seed';

import type { AnyObject } from '../_util/type';
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


// export type OverrideToken<CompTokenMap extends AnyObject> = {
//   [key in keyof CompTokenMap]: Partial<CompTokenMap[key]> & Partial<AliasToken>;
// };

// /** Final token which contains the components level override */
// export type GlobalToken<CompTokenMap extends AnyObject> = AliasToken & CompTokenMap;



type ComponentsToken<CompTokenMap extends AnyObject> = {
  [key in keyof OverrideToken<CompTokenMap>]?: OverrideToken<CompTokenMap>[key] & {
    theme?: Theme<SeedToken, MapToken>;
  };
};

export interface DesignTokenProviderProps<CompTokenMap extends AnyObject> {
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

export type UseThemeProviderContext<CompTokenMap extends AnyObject> = () => [React.Context<DesignTokenProviderProps<CompTokenMap>>];

export function useMergedThemeContext<CompTokenMap extends AnyObject> (useThemeProviderContext?: UseThemeProviderContext<CompTokenMap>) {
  const DefaultThemeProviderContext = React.createContext<DesignTokenProviderProps<CompTokenMap>>(DefaultThemeProviderContextConfig as DesignTokenProviderProps<CompTokenMap>);

  if (typeof useThemeProviderContext === 'function') {
    const [ThemeProviderContext] = useThemeProviderContext();

    return React.useContext({
      ...DefaultThemeProviderContext,
      ...ThemeProviderContext,
    });
  }

  return React.useContext(DefaultThemeProviderContext);
}

