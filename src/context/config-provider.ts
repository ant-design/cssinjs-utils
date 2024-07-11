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

  const [ConfigProviderContext] = getConfigProviderContext?.() ?? [];

  const defaultContext = React.useContext(DefaultConfigProviderContext);

  const context = React.useContext<DefaultConfigConsumerProps>(ConfigProviderContext);

  const mergedContext = React.useMemo(() => {
    return {
      ...defaultContext,
      ...context
    };
  }, [context, defaultContext]);

  return mergedContext;
}
