import React from 'react';
import { AnyObject } from '../_util/type';

export interface DefaultConfigConsumerProps {
  getPrefixCls?: (suffixCls?: string, customizePrefixCls?: string) => string;
  iconPrefixCls?: string;
  csp?: CSPConfig;
}

export interface CSPConfig {
  nonce?: string;
}

const defaultGetPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) {
    return customizePrefixCls;
  }
  return suffixCls ? `ant-${suffixCls}` : 'ant';
};

export const defaultIconPrefixCls = 'anticon';


export const DefaultConfigProviderContext = React.createContext<DefaultConfigConsumerProps>({
  // We provide a default function for Context without provider
  getPrefixCls: defaultGetPrefixCls,
  iconPrefixCls: defaultIconPrefixCls,
});

export type UseConfigProviderContext = () => [React.Context<DefaultConfigConsumerProps & AnyObject>];

export function useMergedConfigContext (useConfigProviderContext?: UseConfigProviderContext) {
  if (typeof useConfigProviderContext === 'function') {
    const [ConfigProviderContext] = useConfigProviderContext();

    return React.useContext({
      ...DefaultConfigProviderContext,
      ...ConfigProviderContext,
    })
  }

  return React.useContext(DefaultConfigProviderContext);
}