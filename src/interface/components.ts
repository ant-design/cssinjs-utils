import type { TokenType } from '@ant-design/cssinjs';

export type TokenMap = Record<string, TokenType>;

export type TokenMapKey<CompTokenMap extends TokenMap> = Extract<keyof CompTokenMap, string>;

export type OverrideTokenMap<CompTokenMap extends TokenMap> = Partial<CompTokenMap>;

export type GlobalTokenWithComponent<CompTokenMap extends TokenMap, C extends TokenMapKey<CompTokenMap>> = CompTokenMap &
  CompTokenMap[C];

export type ComponentToken<CompTokenMap extends TokenMap, C extends TokenMapKey<CompTokenMap>> = Exclude<OverrideTokenMap<CompTokenMap>[C], undefined>;

export type ComponentTokenKey<CompTokenMap extends TokenMap, C extends TokenMapKey<CompTokenMap>> = keyof ComponentToken<CompTokenMap, C>;