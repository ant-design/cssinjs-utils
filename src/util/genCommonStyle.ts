import type { CSSObject } from '@ant-design/cssinjs';

import type { AliasToken } from '../interface';

const genCommonStyle = (
  token: AliasToken,
  componentPrefixCls: string,
  rootCls?: string,
  resetFont?: boolean,
): CSSObject => {
  const prefixSelector = `[class^="${componentPrefixCls}"], [class*=" ${componentPrefixCls}"]`;
  const rootPrefixSelector = rootCls ? `.${rootCls}` : prefixSelector;

  const resetStyle: CSSObject = {
    boxSizing: 'border-box',

    '&::before, &::after': {
      boxSizing: 'border-box',
    },
  };

  let resetFontStyle: CSSObject = {};

  if (resetFont !== false) {
    resetFontStyle = {
      fontFamily: token.fontFamily,
      fontSize: token.fontSize,
    };
  }

  return {
    [rootPrefixSelector]: {
      ...resetFontStyle,
      ...resetStyle,

      [prefixSelector]: resetStyle,
    },
  };
};

export default genCommonStyle;