import type { useStyleRegister } from '@ant-design/cssinjs';
import type { UsePrefix } from './usePrefix';

export type UseResetStyle = (
  options: Omit<Parameters<typeof useStyleRegister>[0], 'path'>,
  prefixs: ReturnType<UsePrefix>,
) => void;