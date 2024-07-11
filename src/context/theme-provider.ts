import React from 'react';
import type { Theme, TokenType } from '@ant-design/cssinjs';

import type { OverrideTokenMap, TokenMap } from '../interface';

export type TokenMapWithTheme<
  CompTokenMap extends TokenMap,
  DesignToken extends TokenType,
  AliasToken extends TokenType,
> = {
    [key in keyof OverrideTokenMap<CompTokenMap>]?: OverrideTokenMap<CompTokenMap>[key] & {
      theme?: Theme<DesignToken, AliasToken>;
    };
  };

export interface DesignTokenProviderProps<
  CompTokenMap extends TokenMap,
  DesignToken extends TokenType,
  AliasToken extends TokenType,
> {
  token: OverrideTokenMap<CompTokenMap>;
  realToken?: OverrideTokenMap<CompTokenMap>;
  /** Just merge `token` & `override` at top to save perf */
  override: { override: OverrideTokenMap<CompTokenMap> };
  theme?: Theme<DesignToken, AliasToken>;
  components?: TokenMapWithTheme<CompTokenMap, DesignToken, AliasToken>;
  hashId?: string;
  hashed?: string | boolean;
  cssVar?: {
    prefix?: string;
    key?: string;
  };
}

// To ensure snapshot stable. We disable hashed in test env.
export const DefaultThemeProviderContextConfig = {
  token: {},
  override: { override: {} },
  hashed: true,
};

export type GetThemeProviderContext<
  CompTokenMap extends TokenMap,
  DesignToken extends TokenType,
  AliasToken extends TokenType,
> = () => [React.Context<DesignTokenProviderProps<CompTokenMap, DesignToken, AliasToken>>];

export function useMergedThemeContext<
  CompTokenMap extends TokenMap,
  DesignToken extends TokenType,
  AliasToken extends TokenType,
>(getThemeProviderContext?: GetThemeProviderContext<CompTokenMap, DesignToken, AliasToken>) {
  const DefaultThemeProviderContext = React.createContext<DesignTokenProviderProps<CompTokenMap, DesignToken, AliasToken>>({
    token: {},
    override: { override: {} },
    hashed: true,
  });

  const [ThemeProviderContext] = getThemeProviderContext?.() ?? [];

  const defaultContext = React.useContext(DefaultThemeProviderContext);

  const context = React.useContext(ThemeProviderContext);

  const mergedContext = React.useMemo(() => {
    return {
      ...defaultContext,
      ...context
    };
  }, [context, defaultContext]);

  return mergedContext;
}

