// /* eslint-disable no-redeclare */
// import React, { useContext } from 'react';
// import type { ComponentType, FC, ReactElement } from 'react';

// import { token2CSSVar, useCSSVarRegister, useStyleRegister } from '@ant-design/cssinjs';
// import type { CSSInterpolation } from '@ant-design/cssinjs';
// import { warning } from 'rc-util';

// import { ignore, unitless } from '../interface';
// import type {
//   UseComponentStyleResult,
//   DefaultConfigConsumerProps,
//   AliasToken,
//   GlobalToken,
//   OverrideToken,
//   DesignTokenProviderProps,
// } from '../interface';

// import genCalc from './calc';
// import genMaxMin from './maxmin';
// import genUseToken from './genUseToken';
// import genLinkStyle from './genLinkStyle';
// import genCommonStyle from './genCommonStyle';
// import genUseResetIconStyle from './genUseResetIconStyle';

// import AbstractCalculator from './calc/calculator';
// import statisticToken, { merge as mergeToken } from './statistic';

// import useUniqueMemo from '../_util/hooks/useUniqueMemo';
// import type { AnyObject } from '../_util/type';


// export type OverrideComponent<CompTokenMap extends AnyObject> = Extract<keyof CompTokenMap, string>;

// export type GlobalTokenWithComponent<CompTokenMap extends AnyObject, C extends OverrideComponent<CompTokenMap>> = GlobalToken<CompTokenMap> &
//   CompTokenMap[C];

// type ComponentToken<CompTokenMap extends AnyObject, C extends OverrideComponent<CompTokenMap>> = Exclude<OverrideToken<CompTokenMap>[C], undefined>;
// type ComponentTokenKey<CompTokenMap extends AnyObject, C extends OverrideComponent<CompTokenMap>> = keyof ComponentToken<CompTokenMap, C>;

// export interface StyleInfo {
//   hashId: string;
//   prefixCls: string;
//   rootPrefixCls: string;
//   iconPrefixCls: string;
// }

// export type CSSUtil = {
//   calc: (number: any) => AbstractCalculator;
//   max: (...values: (number | string)[]) => number | string;
//   min: (...values: (number | string)[]) => number | string;
// };

// export type TokenWithCommonCls<T> = T & {
//   /** Wrap component class with `.` prefix */
//   componentCls: string;
//   /** Origin prefix which do not have `.` prefix */
//   prefixCls: string;
//   /** Wrap icon class with `.` prefix */
//   iconCls: string;
//   /** Wrap ant prefixCls class with `.` prefix */
//   antCls: string;
// } & CSSUtil;

// export type FullToken<CompTokenMap extends AnyObject, C extends OverrideComponent<CompTokenMap>> = TokenWithCommonCls<
//   GlobalTokenWithComponent<CompTokenMap, C>
// >;

// export type GenStyleFn<CompTokenMap extends AnyObject, C extends OverrideComponent<CompTokenMap>> = (
//   token: FullToken<CompTokenMap, C>,
//   info: StyleInfo,
// ) => CSSInterpolation;


// export type GetDefaultToken<CompTokenMap extends AnyObject, C extends OverrideComponent<CompTokenMap>> =
//   | null
//   | CompTokenMap[C]
//   | ((
//     token: AliasToken & Partial<CompTokenMap[C]>,
//   ) => CompTokenMap[C]);

// const getDefaultComponentToken = <CompTokenMap extends AnyObject, C extends OverrideComponent<CompTokenMap>>(
//   component: C,
//   token: GlobalToken<CompTokenMap>,
//   getDefaultToken: GetDefaultToken<CompTokenMap, C>,
// ) => {
//   if (typeof getDefaultToken === 'function') {
//     return (getDefaultToken as Function)(mergeToken(token, token[component] ?? {}));
//   }
//   return getDefaultToken ?? {};
// };

// const getComponentToken = <CompTokenMap extends AnyObject, C extends OverrideComponent<CompTokenMap>>(
//   component: C,
//   token: GlobalToken<CompTokenMap>,
//   defaultToken: CompTokenMap[C],
//   options?: {
//     deprecatedTokens?: [ComponentTokenKey<CompTokenMap, C>, ComponentTokenKey<CompTokenMap, C>][];
//   },
// ) => {
//   const customToken = { ...(token[component] as ComponentToken<CompTokenMap, C>) };
//   if (options?.deprecatedTokens) {
//     const { deprecatedTokens } = options;
//     deprecatedTokens.forEach(([oldTokenKey, newTokenKey]) => {
//       if (process.env.NODE_ENV !== 'production') {
//         warning(
//           !customToken?.[oldTokenKey],
//           `Component Token \`${String(
//             oldTokenKey,
//           )}\` of ${String(component)} is deprecated. Please use \`${String(newTokenKey)}\` instead.`,
//         );
//       }

//       // Should wrap with `if` clause, or there will be `undefined` in object.
//       if (customToken?.[oldTokenKey] || customToken?.[newTokenKey]) {
//         customToken[newTokenKey] ??= customToken?.[oldTokenKey];
//       }
//     });
//   }
//   const mergedToken: any = { ...defaultToken, ...customToken };

//   // Remove same value as global token to minimize size
//   Object.keys(mergedToken).forEach((key) => {
//     if (mergedToken[key] === token[key as keyof GlobalToken<CompTokenMap>]) {
//       delete mergedToken[key];
//     }
//   });

//   return mergedToken;
// };

// const getCompVarPrefix = (component: string, prefix?: string) =>
//   `${[
//     prefix,
//     component.replace(/([A-Z]+)([A-Z][a-z]+)/g, '$1-$2').replace(/([a-z])([A-Z])/g, '$1-$2'),
//   ]
//     .filter(Boolean)
//     .join('-')}`;

// export default function genComponentStyleHookFactory<
//   CompTokenMap extends AnyObject,
//   ConfContext extends DefaultConfigConsumerProps,
// >(
//   ConfigContext: React.Context<ConfContext>,
//   DesignTokenContext: React.Context<DesignTokenProviderProps<CompTokenMap>>
// ) {
//   return function genComponentStyleHook<C extends OverrideComponent<CompTokenMap>>(
//     componentName: C | [C, string],
//     styleFn: GenStyleFn<CompTokenMap, C>,
//     getDefaultToken?: GetDefaultToken<CompTokenMap, C>,
//     options: {
//       resetStyle?: boolean;
//       resetFont?: boolean;
//       // Deprecated token key map [["oldTokenKey", "newTokenKey"], ["oldTokenKey", "newTokenKey"]]
//       deprecatedTokens?: [ComponentTokenKey<CompTokenMap, C>, ComponentTokenKey<CompTokenMap, C>][];
//       /**
//        * Only use component style in client side. Ignore in SSR.
//        */
//       clientOnly?: boolean;
//       /**
//        * Set order of component style. Default is -999.
//        */
//       order?: number;
//       injectStyle?: boolean;
//       unitless?: {
//         [key in ComponentTokenKey<CompTokenMap, C>]: boolean;
//       };
//     } = {},
//   ) {
//     const cells = (Array.isArray(componentName) ? componentName : [componentName, componentName]) as [
//       C,
//       string,
//     ];

//     const [component] = cells;
//     const concatComponent = cells.join('-');

//     const useToken = genUseToken(DesignTokenContext);
//     const useResetIconStyle = genUseResetIconStyle(DesignTokenContext);

//     // Return new style hook
//     return (prefixCls: string, rootCls: string = prefixCls): UseComponentStyleResult => {
//       const [theme, realToken, hashId, token, cssVar] = useToken();
//       const { getPrefixCls, iconPrefixCls, csp } = useContext(ConfigContext);
//       const rootPrefixCls = getPrefixCls();

//       const type = cssVar ? 'css' : 'js';

//       // Use unique memo to share the result across all instances
//       const calc = useUniqueMemo(() => {
//         const unitlessCssVar = new Set<string>();
//         if (cssVar) {
//           Object.keys(options.unitless || {}).forEach((key) => {
//             // Some component proxy the AliasToken (e.g. Image) and some not (e.g. Modal)
//             // We should both pass in `unitlessCssVar` to make sure the CSSVar can be unitless.
//             unitlessCssVar.add(token2CSSVar(key, cssVar.prefix));
//             unitlessCssVar.add(token2CSSVar(key, getCompVarPrefix(component, cssVar.prefix)));
//           });
//         }

//         return genCalc(type, unitlessCssVar);
//       }, [type, component, cssVar?.prefix]);
//       const { max, min } = genMaxMin(type);

//       // Shared config
//       const sharedConfig: Omit<Parameters<typeof useStyleRegister>[0], 'path'> = {
//         theme,
//         token,
//         hashId,
//         nonce: () => csp?.nonce!,
//         clientOnly: options.clientOnly,
//         layer: {
//           name: 'antd',
//         },

//         // antd is always at top of styles
//         order: options.order || -999,
//       };

//       // Generate style for all a tags in antd component.
//       useStyleRegister(
//         { ...sharedConfig, clientOnly: false, path: ['Shared', rootPrefixCls] },
//         () => [
//           {
//             // Link
//             '&': genLinkStyle(token),
//           },
//         ],
//       );

//       // Generate style for icons
//       useResetIconStyle(iconPrefixCls, csp);

//       const wrapSSR = useStyleRegister(
//         { ...sharedConfig, path: [concatComponent, prefixCls, iconPrefixCls] },
//         () => {
//           if (options.injectStyle === false) {
//             return [];
//           }

//           const { token: proxyToken, flush } = statisticToken(token);

//           const defaultComponentToken = getDefaultComponentToken(
//             component,
//             realToken,
//             getDefaultToken,
//           );

//           const componentCls = `.${prefixCls}`;
//           const componentToken = getComponentToken(component, realToken, defaultComponentToken, {
//             deprecatedTokens: options.deprecatedTokens,
//           });

//           if (cssVar) {
//             Object.keys(defaultComponentToken).forEach((key) => {
//               defaultComponentToken[key] = `var(${token2CSSVar(
//                 key,
//                 getCompVarPrefix(component, cssVar.prefix),
//               )})`;
//             });
//           }
//           const mergedToken = mergeToken(
//             proxyToken,
//             {
//               componentCls,
//               prefixCls,
//               iconCls: `.${iconPrefixCls}`,
//               antCls: `.${rootPrefixCls}`,
//               calc,
//               // @ts-ignore
//               max,
//               // @ts-ignore
//               min,
//             },
//             cssVar ? defaultComponentToken : componentToken,
//           ) as FullToken<CompTokenMap, C>;

//           const styleInterpolation = styleFn(mergedToken, {
//             hashId,
//             prefixCls,
//             rootPrefixCls,
//             iconPrefixCls,
//           });
//           flush(component, componentToken);
//           return [
//             options.resetStyle === false
//               ? null
//               : genCommonStyle(mergedToken, prefixCls, rootCls, options.resetFont),
//             styleInterpolation,
//           ];
//         },
//       );

//       return [wrapSSR as any, hashId];
//     };
//   }
// }



// export interface SubStyleComponentProps {
//   prefixCls: string;
//   rootCls?: string;
// }

// export function genSubStyleComponentFactory<
//   CompTokenMap extends AnyObject,
//   ConfContext extends DefaultConfigConsumerProps,
// >(
//   ConfigContext: React.Context<ConfContext>,
//   DesignTokenContext: React.Context<DesignTokenProviderProps<CompTokenMap>>
// ) {
//   return function genSubStyleComponent<C extends OverrideComponent<CompTokenMap>>(
//     componentName: C | [C, string],
//     styleFn: GenStyleFn<CompTokenMap, C>,
//     getDefaultToken?: GetDefaultToken<CompTokenMap, C>,
//     options: {
//       resetStyle?: boolean;
//       resetFont?: boolean;
//       // Deprecated token key map [["oldTokenKey", "newTokenKey"], ["oldTokenKey", "newTokenKey"]]
//       deprecatedTokens?: [ComponentTokenKey<CompTokenMap, C>, ComponentTokenKey<CompTokenMap, C>][];
//       /**
//        * Only use component style in client side. Ignore in SSR.
//        */
//       clientOnly?: boolean;
//       /**
//        * Set order of component style. Default is -999.
//        */
//       order?: number;
//       injectStyle?: boolean;
//       unitless?: {
//         [key in ComponentTokenKey<CompTokenMap, C>]: boolean;
//       };
//     } = {},
//   ) {
//     const genComponentStyleHook = genComponentStyleHookFactory<CompTokenMap, ConfContext>(ConfigContext, DesignTokenContext);

//     const useStyle = genComponentStyleHook(componentName, styleFn, getDefaultToken, {
//       resetStyle: false,

//       // Sub Style should default after root one
//       order: -998,
//       ...options,
//     });

//     const StyledComponent: ComponentType<SubStyleComponentProps> = ({
//       prefixCls,
//       rootCls = prefixCls,
//     }: SubStyleComponentProps) => {
//       useStyle(prefixCls, rootCls);
//       return null;
//     };

//     if (process.env.NODE_ENV !== 'production') {
//       StyledComponent.displayName = `SubStyle_${String(Array.isArray(componentName) ? componentName.join('.') : componentName)}`;
//     }

//     return StyledComponent;
//   };
// }

// export type CSSVarRegisterProps = {
//   rootCls: string;
//   component: string;
//   cssVar: {
//     prefix?: string;
//     key?: string;
//   };
// };

// function genCSSVarRegisterFactory<
//   CompTokenMap extends AnyObject,
//   ConfContext extends DefaultConfigConsumerProps,
// >(
//   ConfigContext: React.Context<ConfContext>,
//   DesignTokenContext: React.Context<DesignTokenProviderProps<CompTokenMap>>
// ) {

//   return function genCSSVarRegister<C extends OverrideComponent<CompTokenMap>>(
//     component: C,
//     getDefaultToken: GetDefaultToken<CompTokenMap, C> | undefined,
//     options: {
//       unitless?: {
//         [key in ComponentTokenKey<CompTokenMap, C>]: boolean;
//       };
//       deprecatedTokens?: [ComponentTokenKey<CompTokenMap, C>, ComponentTokenKey<CompTokenMap, C>][];
//       injectStyle?: boolean;
//       prefixToken: (key: string) => string;
//     },
//   ) {
//     const { unitless: compUnitless, injectStyle = true, prefixToken } = options;

//     const useToken = genUseToken(DesignTokenContext);


//     const CSSVarRegister: FC<CSSVarRegisterProps> = ({ rootCls, cssVar }) => {
//       const [, realToken] = useToken();
//       useCSSVarRegister(
//         {
//           path: [component],
//           prefix: cssVar.prefix,
//           key: cssVar?.key!,
//           unitless: compUnitless,
//           ignore,
//           token: realToken,
//           scope: rootCls,
//         },
//         () => {
//           const defaultToken = getDefaultComponentToken(component, realToken, getDefaultToken);
//           const componentToken = getComponentToken(component, realToken, defaultToken, {
//             deprecatedTokens: options?.deprecatedTokens,
//           });
//           Object.keys(defaultToken).forEach((key) => {
//             componentToken[prefixToken(key)] = componentToken[key];
//             delete componentToken[key];
//           });
//           return componentToken;
//         },
//       );
//       return null;
//     };

//     const useCSSVar = (rootCls: string) => {
//       const [, , , , cssVar] = useToken();

//       return [
//         (node: ReactElement): ReactElement =>
//           injectStyle && cssVar ? (
//             <>
//               <CSSVarRegister rootCls={rootCls} cssVar={cssVar} component={component} />
//               {node}
//             </>
//           ) : (
//             node
//           ),
//         cssVar?.key,
//       ] as const;
//     };

//     return useCSSVar;
//   };
// }

// export function genStyleHooksFactory<
//   CompTokenMap extends AnyObject,
//   ConfContext extends DefaultConfigConsumerProps,
// >(
//   ConfigContext: React.Context<ConfContext>,
//   DesignTokenContext: React.Context<DesignTokenProviderProps<CompTokenMap>>
// ) {
//   return function genStyleHooks<C extends OverrideComponent<CompTokenMap>>(
//     component: C | [C, string],
//     styleFn: GenStyleFn<CompTokenMap, C>,
//     getDefaultToken?: GetDefaultToken<CompTokenMap, C>,
//     options?: {
//       resetStyle?: boolean;
//       resetFont?: boolean;
//       deprecatedTokens?: [ComponentTokenKey<CompTokenMap, C>, ComponentTokenKey<CompTokenMap, C>][];
//       /**
//        * Component tokens that do not need unit.
//        */
//       unitless?: {
//         [key in ComponentTokenKey<CompTokenMap, C>]: boolean;
//       };
//       /**
//        * Only use component style in client side. Ignore in SSR.
//        */
//       clientOnly?: boolean;
//       /**
//        * Set order of component style.
//        * @default -999
//        */
//       order?: number;
//       /**
//        * Whether generate styles
//        * @default true
//        */
//       injectStyle?: boolean;
//     },
//   ) {
//     const componentName = Array.isArray(component) ? component[0] : component;

//     function prefixToken(key: string) {
//       return `${String(componentName)}${key.slice(0, 1).toUpperCase()}${key.slice(1)}`;
//     }

//     // Fill unitless
//     const originUnitless = options?.unitless || {};
//     const compUnitless: any = {
//       ...unitless,
//       [prefixToken('zIndexPopup')]: true,
//     };
//     Object.keys(originUnitless).forEach((key) => {
//       compUnitless[prefixToken(key)] = originUnitless[key as keyof ComponentTokenKey<CompTokenMap, C>];
//     });

//     // Options
//     const mergedOptions = {
//       ...options,
//       unitless: compUnitless,
//       prefixToken,
//     };

//     const genComponentStyleHook = genComponentStyleHookFactory<CompTokenMap, ConfContext>(ConfigContext, DesignTokenContext);

//     // Hooks
//     const useStyle = genComponentStyleHook(component, styleFn, getDefaultToken, mergedOptions);

//     const genCSSVarRegister = genCSSVarRegisterFactory<CompTokenMap, ConfContext>(ConfigContext, DesignTokenContext);

//     const useCSSVar = genCSSVarRegister(componentName, getDefaultToken, mergedOptions);

//     return (prefixCls: string, rootCls: string = prefixCls) => {
//       const [, hashId] = useStyle(prefixCls, rootCls);
//       const [wrapCSSVar, cssVarCls] = useCSSVar(rootCls);

//       return [wrapCSSVar, hashId, cssVarCls] as const;
//     };
//   };
// }
