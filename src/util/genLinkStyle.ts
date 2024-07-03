import type { CSSObject } from '@ant-design/cssinjs';
import type { AliasToken } from '../interface';

const genLinkStyle = (token: AliasToken): CSSObject => ({
  a: {
    color: token.colorLink,
    textDecoration: token.linkDecoration,
    backgroundColor: 'transparent', // remove the gray background on active links in IE 10.
    outline: 'none',
    cursor: 'pointer',
    transition: `color ${token.motionDurationSlow}`,
    '-webkit-text-decoration-skip': 'objects', // remove gaps in links underline in iOS 8+ and Safari 8+.

    '&:hover': {
      color: token.colorLinkHover,
    },

    '&:active': {
      color: token.colorLinkActive,
    },

    '&:active, &:hover': {
      textDecoration: token.linkHoverDecoration,
      outline: 0,
    },

    // https://github.com/ant-design/ant-design/issues/22503
    '&:focus': {
      textDecoration: token.linkFocusDecoration,
      outline: 0,
    },

    '&[disabled]': {
      color: token.colorTextDisabled,
      cursor: 'not-allowed',
    },
  },
});

export default genLinkStyle;