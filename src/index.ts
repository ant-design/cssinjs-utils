/* eslint-disable import/prefer-default-export */
import type { GlobalToken, MappingAlgorithm } from './interface';
import compactAlgorithm from './themes/compact';
import darkAlgorithm from './themes/dark';
import defaultAlgorithm from './themes/default';

export type { GlobalToken, MappingAlgorithm };

export default {
  defaultAlgorithm,
  darkAlgorithm,
  compactAlgorithm,
};
