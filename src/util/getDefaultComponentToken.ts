import { merge as mergeToken } from './statistic';
import type { GlobalToken } from '../interface';
import type { OverrideComponent, GetDefaultToken } from './genStyleUtils';

export default function getDefaultComponentToken<CompTokenMap, C extends OverrideComponent<CompTokenMap>>(
  component: C,
  token: GlobalToken<CompTokenMap>,
  getDefaultToken: GetDefaultToken<CompTokenMap, C>,
) {
  if (typeof getDefaultToken === 'function') {
    return (getDefaultToken as Function)(mergeToken(token, token[component] ?? {}));
  }
  return getDefaultToken ?? {};
};