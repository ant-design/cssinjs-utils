import { warning } from 'rc-util';
import type { GlobalToken } from '../interface';
import type { OverrideComponent, ComponentTokenKey, ComponentToken } from './genStyleUtils';

export default function getComponentToken<CompTokenMap, C extends OverrideComponent<CompTokenMap>>(
  component: C,
  token: GlobalToken<CompTokenMap>,
  defaultToken: CompTokenMap[C],
  options?: {
    deprecatedTokens?: [ComponentTokenKey<CompTokenMap, C>, ComponentTokenKey<CompTokenMap, C>][];
  },
) {
  const customToken = { ...(token[component] as ComponentToken<CompTokenMap, C>) };
  if (options?.deprecatedTokens) {
    const { deprecatedTokens } = options;
    deprecatedTokens.forEach(([oldTokenKey, newTokenKey]) => {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          !customToken?.[oldTokenKey],
          `Component Token \`${String(
            oldTokenKey,
          )}\` of ${String(component)} is deprecated. Please use \`${String(newTokenKey)}\` instead.`,
        );
      }

      // Should wrap with `if` clause, or there will be `undefined` in object.
      if (customToken?.[oldTokenKey] || customToken?.[newTokenKey]) {
        customToken[newTokenKey] ??= customToken?.[oldTokenKey];
      }
    });
  }
  const mergedToken: any = { ...defaultToken, ...customToken };

  // Remove same value as global token to minimize size
  Object.keys(mergedToken).forEach((key) => {
    if (mergedToken[key] === token[key as keyof GlobalToken<CompTokenMap>]) {
      delete mergedToken[key];
    }
  });

  return mergedToken;
};