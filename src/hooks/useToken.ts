import type { Theme, TokenType } from '@ant-design/cssinjs';

import type { OverrideTokenMap, TokenMap, GlobalToken } from '../interface';

export type TokenMapWithTheme<
  CompTokenMap extends TokenMap,
  AliasToken extends TokenType,
  DesignToken extends TokenType,
> = {
  [key in keyof OverrideTokenMap<CompTokenMap, AliasToken>]?: OverrideTokenMap<
    CompTokenMap,
    AliasToken
  >[key] & {
    theme?: Theme<DesignToken, AliasToken>;
  };
};

export interface UseTokenReturn<
  CompTokenMap extends TokenMap,
  AliasToken extends TokenType,
  DesignToken extends TokenType,
> {
  token: GlobalToken<CompTokenMap, AliasToken>;
  theme?: Theme<DesignToken, AliasToken>;
  hashId?: string;
  components?: TokenMapWithTheme<CompTokenMap, DesignToken, AliasToken>;
  hashed?: string | boolean;
  /**
   * @warring dev only: css var token object. If you use `useToken` in production, you should use `token` instead.
   */
  realToken?: GlobalToken<CompTokenMap, AliasToken>;
  /**
   * @warring dev only: css var options object. If you use `useToken` in production, do not use it.
   */
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
