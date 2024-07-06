import React from 'react';
import type { Theme } from '@ant-design/cssinjs';
import { useCacheToken } from '@ant-design/cssinjs';

import version from '../version';
import type { DesignTokenProviderProps } from '../interface';
import {
  defaultTheme,
  unitless,
  ignore,
  preserve
} from '../interface';
import type { AliasToken, GlobalToken, MapToken, SeedToken } from '../interface';
import defaultSeedToken from '../themes/seed';
import formatToken from './alias';
import type { AnyObject } from '../_util/type';

export const getComputedToken = <CompTokenMap extends AnyObject>(
  originToken: SeedToken,
  overrideToken: DesignTokenProviderProps<CompTokenMap>['components'] & {
    override?: Partial<AliasToken>;
  },
  theme: Theme<any, any>,
) => {
  const derivativeToken = theme.getDerivativeToken(originToken);

  const { override, ...components } = overrideToken;

  // Merge with override
  let mergedDerivativeToken = {
    ...derivativeToken,
    override,
  };

  // Format if needed
  mergedDerivativeToken = formatToken(mergedDerivativeToken);

  if (components) {
    Object.entries(components).forEach(([key, value]) => {
      const { theme: componentTheme, ...componentTokens } = value;
      let mergedComponentToken = componentTokens;
      if (componentTheme) {
        mergedComponentToken = getComputedToken(
          {
            ...mergedDerivativeToken,
            ...componentTokens,
          },
          {
            override: componentTokens,
          } as any,
          componentTheme,
        );
      }
      mergedDerivativeToken[key] = mergedComponentToken;
    });
  }

  return mergedDerivativeToken;
};

// ================================== Hook ==================================
export default function genUseToken<CompTokenMap extends AnyObject>(
  DesignTokenContext: React.Context<DesignTokenProviderProps<CompTokenMap>>
) {

  return function useToken(): [
    theme: Theme<SeedToken, MapToken>,
    token: GlobalToken<CompTokenMap>,
    hashId: string,
    realToken: GlobalToken<CompTokenMap>,
    cssVar?: DesignTokenProviderProps<CompTokenMap>['cssVar'],
  ] {
    const {
      token: rootDesignToken,
      hashed,
      theme,
      override,
      cssVar,
    } = React.useContext(DesignTokenContext);

    const salt = `${version}-${hashed || ''}`;

    const mergedTheme = theme || defaultTheme;

    const [token, hashId, realToken] = useCacheToken<GlobalToken<CompTokenMap>, SeedToken>(
      mergedTheme,
      [defaultSeedToken, rootDesignToken],
      {
        salt,
        override,
        getComputedToken,
        // formatToken will not be consumed after 1.15.0 with getComputedToken.
        // But token will break if @ant-design/cssinjs is under 1.15.0 without it
        formatToken,
        cssVar: cssVar && {
          prefix: cssVar.prefix,
          key: cssVar.key,
          unitless,
          ignore,
          preserve,
        },
      } as any,
    );

    return [mergedTheme, realToken, hashed ? hashId : '', token, cssVar];
  }
}