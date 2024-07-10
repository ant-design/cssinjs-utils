import React from 'react';

export interface DefaultConfigConsumerProps extends Object {
  getPrefixCls?: (suffixCls?: string, customizePrefixCls?: string) => string;
  iconPrefixCls?: string;
  csp?: CSPConfig;
}

interface CSPConfig {
  nonce?: string;
}

const defaultGetPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) {
    return customizePrefixCls;
  }
  return suffixCls ? `ant-${suffixCls}` : 'ant';
};

const defaultIconPrefixCls = 'anticon';


export const DefaultConfigProviderContext = React.createContext<DefaultConfigConsumerProps>({
  // We provide a default function for Context without provider
  getPrefixCls: defaultGetPrefixCls,
  iconPrefixCls: defaultIconPrefixCls,
});

export type GetConfigProviderContext = () => [React.Context<DefaultConfigConsumerProps>];

export function useMergedConfigContext(getConfigProviderContext?: GetConfigProviderContext) {

  const [ConfigProviderContext = {}] = getConfigProviderContext?.() ?? [];

  return React.useContext({
    ...DefaultConfigProviderContext,
    ...ConfigProviderContext,
  })
}