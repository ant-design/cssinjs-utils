import React from 'react';
import { render, renderHook } from '@testing-library/react';

import { genStyleUtils } from '../src';
import type { CSSVarRegisterProps, SubStyleComponentProps } from '../src/util/genStyleUtils';

interface TestCompTokenMap {
  TestComponent: object;
}

describe('genStyleUtils', () => {
  const mockConfig = {
    usePrefix: jest.fn().mockReturnValue({
      rootPrefixCls: 'ant',
      iconPrefixCls: 'anticon',
    }),
    useToken: jest.fn().mockReturnValue({
      theme: {},
      realToken: {},
      hashId: 'hash',
      token: {},
      cssVar: {},
    }),
    useCSP: jest.fn().mockReturnValue({ nonce: 'nonce' }),
    getResetStyles: jest.fn().mockReturnValue([]),
  };

  const { genStyleHooks, genSubStyleComponent, genComponentStyleHook } = genStyleUtils<
    TestCompTokenMap,
    object,
    object
  >(mockConfig);

  describe('genStyleHooks', () => {
    it('should generate style hooks', () => {
      const component = 'TestComponent';
      const styleFn = jest.fn();
      const getDefaultToken = jest.fn();
      const hooks = genStyleHooks(component, styleFn, getDefaultToken);

      expect(hooks).toBeInstanceOf(Function);

      const {
        result: { current },
      } = renderHook(() => hooks('test-prefix'));
      expect(current).toBeInstanceOf(Array);
      expect(current).toHaveLength(3);
    });
  });

  describe('genSubStyleComponent', () => {
    it('should generate sub style component', () => {
      const component = 'TestComponent';
      const styleFn = jest.fn();
      const getDefaultToken = jest.fn();
      const StyledComponent = genSubStyleComponent(component, styleFn, getDefaultToken);

      const { container } = render(<StyledComponent prefixCls="test-prefix" rootCls="test-root" />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('genComponentStyleHook', () => {
    it('should generate component style hook', () => {
      const component = 'TestComponent';
      const styleFn = jest.fn();
      const getDefaultToken = jest.fn();
      const hook = genComponentStyleHook(component, styleFn, getDefaultToken);

      const TestComponent: React.FC<SubStyleComponentProps> = ({ prefixCls, rootCls }) => {
        hook(prefixCls, rootCls);
        return <div data-testid="test-component">Test</div>;
      };

      const { getByTestId } = render(<TestComponent prefixCls="test-prefix" rootCls="test-root" />);
      expect(getByTestId('test-component')).toHaveTextContent('Test');
    });
  });

  describe('CSSVarRegister', () => {
    it('should render CSSVarRegister component', () => {
      const CSSVarRegister: React.FC<CSSVarRegisterProps> = ({ rootCls, cssVar = {} }) => {
        return <div data-testid={rootCls}>{cssVar.prefix}</div>;
      };

      const { getByTestId } = render(
        <CSSVarRegister rootCls="test-root" cssVar={{ prefix: 'test-prefix' }} component="test" />,
      );
      expect(getByTestId('test-root')).toHaveTextContent('test-prefix');
    });
  });
});
