import React from 'react';

export interface DefaultConfigConsumerProps extends Object {
  getPrefixCls?: (suffixCls?: string, customizePrefixCls?: string) => string;
  iconPrefixCls?: string;
  csp?: CSPConfig;
}

interface CSPConfig {
  nonce?: string;
}

export const DefaultConfigProviderContext = React.createContext<DefaultConfigConsumerProps>({});

export type GetConfigProviderContext = () => [React.Context<DefaultConfigConsumerProps>];

export function useMergedConfigContext(getConfigProviderContext?: GetConfigProviderContext) {

  const [ConfigProviderContext = {}] = getConfigProviderContext?.() ?? [];

  return React.useContext({
    ...DefaultConfigProviderContext,
    ...ConfigProviderContext,
  })
}