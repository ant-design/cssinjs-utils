import { CSSObject, useStyleRegister } from '@ant-design/cssinjs';

import type { CSPConfig, DesignTokenProviderProps } from '../interface';
import genUseToken from './genUseToken';
import type { AnyObject } from '../_util/type';

export const resetIcon = (): CSSObject => ({
  display: 'inline-flex',
  alignItems: 'center',
  color: 'inherit',
  fontStyle: 'normal',
  lineHeight: 0,
  textAlign: 'center',
  textTransform: 'none',
  // for SVG icon, see https://blog.prototypr.io/align-svg-icons-to-text-and-say-goodbye-to-font-icons-d44b3d7b26b4
  verticalAlign: '-0.125em',
  textRendering: 'optimizeLegibility',
  '-webkit-font-smoothing': 'antialiased',
  '-moz-osx-font-smoothing': 'grayscale',

  '> *': {
    lineHeight: 1,
  },

  svg: {
    display: 'inline-block',
  },
});

export default function genUseResetIconStyle<CompTokenMap extends AnyObject>(
  DesignTokenContext: React.Context<DesignTokenProviderProps<CompTokenMap>>,
) {
  const useToken = genUseToken(DesignTokenContext);

  return function useResetIconStyle(iconPrefixCls: string, csp?: CSPConfig) {
    const [theme, token] = useToken();
  
    // Generate style for icons
    return useStyleRegister(
      {
        theme,
        token,
        hashId: '',
        path: ['ant-design-icons', iconPrefixCls],
        nonce: () => csp?.nonce!,
        layer: {
          name: 'antd',
        },
      },
      () => [
        {
          [`.${iconPrefixCls}`]: {
            ...resetIcon(),
            [`.${iconPrefixCls} .${iconPrefixCls}-icon`]: {
              display: 'block',
            },
          },
        },
      ],
    );
  };
}
