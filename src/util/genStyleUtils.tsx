import React from 'react';
import type { ComponentType, FC, ReactElement } from 'react';

import { token2CSSVar, useCSSVarRegister, useStyleRegister } from '@ant-design/cssinjs';
import type { CSSInterpolation, Theme } from '@ant-design/cssinjs';

import {
  useMergedConfigContext,
  useMergedThemeContext,
} from '../context';
import type {
  GetConfigProviderContext,
  GetThemeProviderContext,
  DesignTokenProviderProps,
} from '../context';

import type {
  UseComponentStyleResult,
  AliasToken,
  GlobalToken,
  OverrideToken,
  SeedToken,
  MapToken,
} from '../interface';

import genCalc from './calc';
import genMaxMin from './maxmin';
import genLinkStyle from './genLinkStyle';
import genCommonStyle from './genCommonStyle';
import getCompVarPrefix from './getCompVarPrefix';
import type AbstractCalculator from './calc/calculator';
import getComponentToken from './getComponentToken';
import getDefaultComponentToken from './getDefaultComponentToken';
import statisticToken, { merge as mergeToken } from './statistic';

import useUniqueMemo from '../_util/hooks/useUniqueMemo';


export type OverrideComponent<CompTokenMap extends Object> = Extract<keyof CompTokenMap, string>;

export type GlobalTokenWithComponent<CompTokenMap extends Object, C extends OverrideComponent<CompTokenMap>> = GlobalToken<CompTokenMap> &
  CompTokenMap[C];

export type ComponentToken<CompTokenMap extends Object, C extends OverrideComponent<CompTokenMap>> = Exclude<OverrideToken<CompTokenMap>[C], undefined>;
export type ComponentTokenKey<CompTokenMap extends Object, C extends OverrideComponent<CompTokenMap>> = keyof ComponentToken<CompTokenMap, C>;

export interface StyleInfo {
  hashId: string;
  prefixCls: string;
  rootPrefixCls: string;
  iconPrefixCls: string;
}

export type CSSUtil = {
  calc: (number: any) => AbstractCalculator;
  max: (...values: (number | string)[]) => number | string;
  min: (...values: (number | string)[]) => number | string;
};

export type TokenWithCommonCls<T> = T & {
  /** Wrap component class with `.` prefix */
  componentCls: string;
  /** Origin prefix which do not have `.` prefix */
  prefixCls: string;
  /** Wrap icon class with `.` prefix */
  iconCls: string;
  /** Wrap ant prefixCls class with `.` prefix */
  antCls: string;
} & CSSUtil;

export type FullToken<CompTokenMap extends Object, C extends OverrideComponent<CompTokenMap>> = TokenWithCommonCls<
  GlobalTokenWithComponent<CompTokenMap, C>
>;

export type GenStyleFn<CompTokenMap extends Object, C extends OverrideComponent<CompTokenMap>> = (
  token: FullToken<CompTokenMap, C>,
  info: StyleInfo,
) => CSSInterpolation;

export type GetDefaultTokenFn<
  CompTokenMap extends Object,
  C extends OverrideComponent<CompTokenMap>
> = (token: AliasToken & Partial<CompTokenMap[C]>) => CompTokenMap[C];

export type GetDefaultToken<CompTokenMap extends Object, C extends OverrideComponent<CompTokenMap>> =
  | null
  | CompTokenMap[C]
  | GetDefaultTokenFn<CompTokenMap, C>

export interface SubStyleComponentProps {
  prefixCls: string;
  rootCls?: string;
}

export type CSSVarRegisterProps = {
  rootCls: string;
  component: string;
  cssVar: {
    prefix?: string;
    key?: string;
  };
};

export default function genStyleUtils<CompTokenMap extends Object>(
  getConfigProviderContext?: GetConfigProviderContext,
  getThemeProviderContext?: GetThemeProviderContext<CompTokenMap>,
) {

  function useToken(): [
    theme: Theme<SeedToken, MapToken>,
    token: GlobalToken<CompTokenMap>,
    hashId: string,
    realToken: GlobalToken<CompTokenMap>,
    cssVar?: DesignTokenProviderProps<CompTokenMap>['cssVar'],
  ] {
    const {
      token,
      hashed,
      hashId,
      theme,
      realToken,
      cssVar,
    } = useMergedThemeContext<CompTokenMap>(getThemeProviderContext);

    return [theme, token, hashed ? hashId : '', realToken, cssVar];
  }

  function genStyleHooks<C extends OverrideComponent<CompTokenMap>>(
    component: C | [C, string],
    styleFn: GenStyleFn<CompTokenMap, C>,
    getDefaultToken?: GetDefaultToken<CompTokenMap, C>,
    options?: {
      resetStyle?: boolean;
      resetFont?: boolean;
      deprecatedTokens?: [ComponentTokenKey<CompTokenMap, C>, ComponentTokenKey<CompTokenMap, C>][];
      /**
       * Component tokens that do not need unit.
       */
      unitless?: {
        [key in ComponentTokenKey<CompTokenMap, C>]: boolean;
      };
      /**
       * Only use component style in client side. Ignore in SSR.
       */
      clientOnly?: boolean;
      /**
       * Set order of component style.
       * @default -999
       */
      order?: number;
      /**
       * Whether generate styles
       * @default true
       */
      injectStyle?: boolean;
    },
  ) {
    const componentName = Array.isArray(component) ? component[0] : component;

    function prefixToken(key: string) {
      return `${String(componentName)}${key.slice(0, 1).toUpperCase()}${key.slice(1)}`;
    }

    // Fill unitless
    const originUnitless = options?.unitless || {};
    const compUnitless: any = {
      ...originUnitless,
      [prefixToken('zIndexPopup')]: true,
    };
    Object.keys(originUnitless).forEach((key) => {
      compUnitless[prefixToken(key)] = originUnitless[key as keyof ComponentTokenKey<CompTokenMap, C>];
    });

    // Options
    const mergedOptions = {
      ...options,
      unitless: compUnitless,
      prefixToken,
    };

    // Hooks
    const useStyle = genComponentStyleHook(component, styleFn, getDefaultToken, mergedOptions);

    const useCSSVar = genCSSVarRegister(componentName, getDefaultToken, mergedOptions);

    return (prefixCls: string, rootCls: string = prefixCls) => {
      const [, hashId] = useStyle(prefixCls, rootCls);
      const [wrapCSSVar, cssVarCls] = useCSSVar(rootCls);

      return [wrapCSSVar, hashId, cssVarCls] as const;
    };
  };

  function genCSSVarRegister<C extends OverrideComponent<CompTokenMap>>(
    component: C,
    getDefaultToken: GetDefaultToken<CompTokenMap, C> | undefined,
    options: {
      unitless?: {
        [key in ComponentTokenKey<CompTokenMap, C>]: boolean;
      };
      ignore?: {
        [key in keyof AliasToken]?: boolean;
      };
      deprecatedTokens?: [ComponentTokenKey<CompTokenMap, C>, ComponentTokenKey<CompTokenMap, C>][];
      injectStyle?: boolean;
      prefixToken: (key: string) => string;
    },
  ) {
    const { unitless: compUnitless, injectStyle = true, prefixToken, ignore } = options;

    const CSSVarRegister: FC<CSSVarRegisterProps> = ({ rootCls, cssVar = {} }) => {
      const [, realToken] = useToken();
      useCSSVarRegister(
        {
          path: [component],
          prefix: cssVar.prefix,
          key: cssVar.key!,
          unitless: compUnitless,
          ignore,
          token: realToken,
          scope: rootCls,
        },
        () => {
          const defaultToken = getDefaultComponentToken<CompTokenMap, C>(component, realToken, getDefaultToken);
          const componentToken = getComponentToken<CompTokenMap, C>(component, realToken, defaultToken, {
            deprecatedTokens: options?.deprecatedTokens,
          });
          Object.keys(defaultToken).forEach((key) => {
            componentToken[prefixToken(key)] = componentToken[key];
            delete componentToken[key];
          });
          return componentToken;
        },
      );
      return null;
    };

    const useCSSVar = (rootCls: string) => {
      const [, , , , cssVar] = useToken();

      return [
        (node: ReactElement): ReactElement =>
          injectStyle && cssVar ? (
            <>
              <CSSVarRegister rootCls={rootCls} cssVar={cssVar} component={component} />
              {node}
            </>
          ) : (
            node
          ),
        cssVar?.key,
      ] as const;
    };

    return useCSSVar;
  };

  function genComponentStyleHook<C extends OverrideComponent<CompTokenMap>>(
    componentName: C | [C, string],
    styleFn: GenStyleFn<CompTokenMap, C>,
    getDefaultToken?: GetDefaultToken<CompTokenMap, C>,
    options: {
      resetStyle?: boolean;
      resetFont?: boolean;
      // Deprecated token key map [["oldTokenKey", "newTokenKey"], ["oldTokenKey", "newTokenKey"]]
      deprecatedTokens?: [ComponentTokenKey<CompTokenMap, C>, ComponentTokenKey<CompTokenMap, C>][];
      /**
       * Only use component style in client side. Ignore in SSR.
       */
      clientOnly?: boolean;
      /**
       * Set order of component style. Default is -999.
       */
      order?: number;
      injectStyle?: boolean;
      unitless?: {
        [key in ComponentTokenKey<CompTokenMap, C>]: boolean;
      };
    } = {},
  ) {
    const cells = (Array.isArray(componentName) ? componentName : [componentName, componentName]) as [
      C,
      string,
    ];

    const [component] = cells;
    const concatComponent = cells.join('-');

    // Return new style hook
    return (prefixCls: string, rootCls: string = prefixCls): UseComponentStyleResult => {
      const [theme, realToken, hashId, token, cssVar] = useToken();

      const { getPrefixCls, iconPrefixCls = '', csp = {} } = useMergedConfigContext(getConfigProviderContext);

      const rootPrefixCls = getPrefixCls?.() ?? '';

      const type = cssVar ? 'css' : 'js';

      // Use unique memo to share the result across all instances
      const calc = useUniqueMemo(() => {
        const unitlessCssVar = new Set<string>();
        if (cssVar) {
          Object.keys(options.unitless || {}).forEach((key) => {
            // Some component proxy the AliasToken (e.g. Image) and some not (e.g. Modal)
            // We should both pass in `unitlessCssVar` to make sure the CSSVar can be unitless.
            unitlessCssVar.add(token2CSSVar(key, cssVar.prefix));
            unitlessCssVar.add(token2CSSVar(key, getCompVarPrefix(component, cssVar.prefix)));
          });
        }

        return genCalc(type, unitlessCssVar);
      }, [type, component, cssVar?.prefix]);
      const { max, min } = genMaxMin(type);

      // Shared config
      const sharedConfig: Omit<Parameters<typeof useStyleRegister>[0], 'path'> = {
        theme,
        token,
        hashId,
        nonce: () => csp.nonce!,
        clientOnly: options.clientOnly,
        layer: {
          name: 'antd',
        },

        // antd is always at top of styles
        order: options.order || -999,
      };

      // Generate style for all a tags in antd component.
      useStyleRegister(
        { ...sharedConfig, clientOnly: false, path: ['Shared', rootPrefixCls] },
        () => [
          {
            // Link
            '&': genLinkStyle(token),
          },
        ],
      );

      // Generate style for icons

      const wrapSSR = useStyleRegister(
        { ...sharedConfig, path: [concatComponent, prefixCls, iconPrefixCls] },
        () => {
          if (options.injectStyle === false) {
            return [];
          }

          const { token: proxyToken, flush } = statisticToken(token);

          const defaultComponentToken = getDefaultComponentToken<CompTokenMap, C>(
            component,
            realToken,
            getDefaultToken,
          );

          const componentCls = `.${prefixCls}`;
          const componentToken = getComponentToken<CompTokenMap, C>(component, realToken, defaultComponentToken, {
            deprecatedTokens: options.deprecatedTokens,
          });

          if (cssVar) {
            Object.keys(defaultComponentToken).forEach((key) => {
              defaultComponentToken[key] = `var(${token2CSSVar(
                key,
                getCompVarPrefix(component, cssVar.prefix),
              )})`;
            });
          }
          const mergedToken = mergeToken<any>(
            proxyToken,
            {
              componentCls,
              prefixCls,
              iconCls: !!iconPrefixCls.length ? '' : `.${iconPrefixCls}`,
              antCls: !!rootPrefixCls.length ? '' : `.${rootPrefixCls}`,
              calc,
              // @ts-ignore
              max,
              // @ts-ignore
              min,
            },
            cssVar ? defaultComponentToken : componentToken,
          ) as FullToken<CompTokenMap, C>;

          const styleInterpolation = styleFn(mergedToken, {
            hashId,
            prefixCls,
            rootPrefixCls,
            iconPrefixCls,
          });
          flush(component, componentToken);
          return [
            options.resetStyle === false
              ? null
              : genCommonStyle(mergedToken, prefixCls, rootCls, options.resetFont),
            styleInterpolation,
          ];
        },
      );

      return [wrapSSR as any, hashId];
    };
  }

  function genSubStyleComponent<C extends OverrideComponent<CompTokenMap>>(
    componentName: C | [C, string],
    styleFn: GenStyleFn<CompTokenMap, C>,
    getDefaultToken?: GetDefaultToken<CompTokenMap, C>,
    options: {
      resetStyle?: boolean;
      resetFont?: boolean;
      // Deprecated token key map [["oldTokenKey", "newTokenKey"], ["oldTokenKey", "newTokenKey"]]
      deprecatedTokens?: [ComponentTokenKey<CompTokenMap, C>, ComponentTokenKey<CompTokenMap, C>][];
      /**
       * Only use component style in client side. Ignore in SSR.
       */
      clientOnly?: boolean;
      /**
       * Set order of component style. Default is -999.
       */
      order?: number;
      injectStyle?: boolean;
      unitless?: {
        [key in ComponentTokenKey<CompTokenMap, C>]: boolean;
      };
    } = {},
  ) {

    const useStyle = genComponentStyleHook(componentName, styleFn, getDefaultToken, {
      resetStyle: false,

      // Sub Style should default after root one
      order: -998,
      ...options,
    });

    const StyledComponent: ComponentType<SubStyleComponentProps> = ({
      prefixCls,
      rootCls = prefixCls,
    }: SubStyleComponentProps) => {
      useStyle(prefixCls, rootCls);
      return null;
    };

    if (process.env.NODE_ENV !== 'production') {
      StyledComponent.displayName = `SubStyle_${String(Array.isArray(componentName) ? componentName.join('.') : componentName)}`;
    }

    return StyledComponent;
  };

  return {
    genStyleHooks,
    genSubStyleComponent,
    genComponentStyleHook,
    useToken,
  }
}