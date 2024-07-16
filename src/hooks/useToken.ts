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

export type GlobalToken<
  CompTokenMap extends TokenMap,
  AliasToken extends TokenType,
> = Partial<AliasToken & CompTokenMap>;

export interface UseTokenReturn<
  CompTokenMap extends TokenMap,
  DesignToken extends TokenType,
  AliasToken extends TokenType,
> {
  token: GlobalToken<CompTokenMap, AliasToken>;
  realToken?: GlobalToken<CompTokenMap, AliasToken>;
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

export type UseToken<
  CompTokenMap extends TokenMap,
  DesignToken extends TokenType,
  AliasToken extends TokenType,
> = () => UseTokenReturn<CompTokenMap, DesignToken, AliasToken>;