export default interface DefaultConfigConsumerProps {
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
  iconPrefixCls: string;
  csp?: CSPConfig;
}

export interface CSPConfig {
  nonce?: string;
}
