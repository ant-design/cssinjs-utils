import React from 'react';
import { render, renderHook } from '@testing-library/react';

import { genStyleUtils } from '../src';
import type { CSSVarRegisterProps, SubStyleComponentProps } from '@/util/genStyleUtils';
import { createCache, StyleProvider } from '@ant-design/cssinjs';

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
    layer: {
      name: 'test',
      dependencies: ['parent'],
    },
  };

  const { genStyleHooks, genSubStyleComponent, genComponentStyleHook } = genStyleUtils<
    TestCompTokenMap,
    object,
    object
  >(mockConfig);

  beforeEach(() => {
    // Clear head style
    const head = document.head;
    head.innerHTML = '';
  });

  describe('genStyleHooks', () => {
    it('should generate style hooks', () => {
      const component = 'TestComponent';
      const styleFn = jest.fn();
      const getDefaultToken = {
        mockCompToken: 'mock',
      };
      const hooks = genStyleHooks(component, styleFn, getDefaultToken);

      expect(hooks).toBeInstanceOf(Function);

      const {
        result: { current },
      } = renderHook(() => hooks('test-prefix'));
      expect(current).toBeInstanceOf(Array);
      expect(current).toHaveLength(2);
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

  describe('genComponentStyleHook should run without getResetStyles', () => {
    it('should generate component style hook', () => {
      const component = 'TestComponent';
      const styleFn = jest.fn();
      const getDefaultToken = jest.fn();
      const { getResetStyles, ...restMockConfig } = mockConfig;
      const { genComponentStyleHook: genComponentStyleHookWithoutReset } = genStyleUtils<
        TestCompTokenMap,
        object,
        object
      >(restMockConfig);
      const hook = genComponentStyleHookWithoutReset(component, styleFn, getDefaultToken);
      const TestComponent: React.FC<SubStyleComponentProps> = ({ prefixCls, rootCls }) => {
        hook(prefixCls, rootCls);
        return <div data-testid="test-component">Test</div>;
      };
      const { container } = render(<TestComponent prefixCls="test-prefix" rootCls="test-root" />);
      expect(() => container).not.toThrow();
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

  it('layer', () => {
    const StyledComponent = genSubStyleComponent(
      'TestComponent',
      () => ({}),
      () => ({}),
    );

    render(
      <StyleProvider cache={createCache()} layer>
        <StyledComponent prefixCls="test" />
      </StyleProvider>,
    );

    expect(document.head.innerHTML).toContain('@layer parent,test;');
  });

  describe('disabledRuntimeStyle', () => {
    it('should work', () => {
      const usePrefix = jest.fn().mockReturnValue({
        rootPrefixCls: 'ant',
        iconPrefixCls: 'anticon',
      });

      const config = {
        ...mockConfig,
        useToken: jest.fn().mockReturnValue({
          theme: {},
          realToken: {},
          hashId: 'hash',
          token: {},
          cssVar: {},
          zeroRuntime: true,
        }),
        usePrefix,
      };
      const { genComponentStyleHook: gen } = genStyleUtils<TestCompTokenMap, object, object>(
        config,
      );

      const styleFn = jest.fn();
      const getDefaultToken = jest.fn();
      const useStyle = gen('TestComponent', styleFn, getDefaultToken);

      const TestComponent: React.FC<SubStyleComponentProps> = ({ prefixCls, rootCls }) => {
        useStyle(prefixCls, rootCls);
        return <div data-testid="test-component">Test</div>;
      };

      const { getByTestId } = render(<TestComponent prefixCls="test-prefix" rootCls="test-root" />);
      expect(getByTestId('test-component')).toHaveTextContent('Test');
      expect(usePrefix).not.toHaveBeenCalled();
    });
  });

  describe('nonce support', () => {
    it('should pass nonce to useCSSVarRegister', () => {
      const testNonce = 'test-nonce-12345';
      const config = {
        usePrefix: jest.fn().mockReturnValue({
          rootPrefixCls: 'ant',
          iconPrefixCls: 'anticon',
        }),
        useToken: jest.fn().mockReturnValue({
          theme: {},
          realToken: { colorPrimary: '#1890ff' },
          hashId: 'hash',
          token: { colorPrimary: '#1890ff' },
          cssVar: {
            prefix: 'ant',
            key: 'test-key',
          },
        }),
        useCSP: jest.fn().mockReturnValue({ nonce: testNonce }),
      };

      const { genStyleHooks: gen } = genStyleUtils<TestCompTokenMap, object, object>(config);

      const useStyle = gen(
        'TestComponent',
        () => ({}),
        () => ({}),
      );

      const TestComponent: React.FC<{ prefixCls: string }> = ({ prefixCls }) => {
        useStyle(prefixCls);
        return <div data-testid="test-component">Test</div>;
      };

      render(
        <StyleProvider cache={createCache()}>
          <TestComponent prefixCls="test-prefix" />
        </StyleProvider>,
      );

      // Check that style tags have the nonce attribute
      const styleTags = document.querySelectorAll('style');
      const hasNonce = Array.from(styleTags).some(
        (style) => style.getAttribute('nonce') === testNonce,
      );
      expect(hasNonce).toBe(true);
    });
  });

  describe('component token same as global token', () => {
    it('should fall back to the global css var', () => {
      const config = {
        ...mockConfig,
        useToken: jest.fn().mockReturnValue({
          theme: {},
          realToken: { borderRadius: 4 },
          hashId: 'hash',
          token: { borderRadius: 4 },
          cssVar: {
            prefix: 'ant',
            key: 'test-key',
          },
        }),
      };

      const { genStyleHooks: gen } = genStyleUtils<TestCompTokenMap, object, object>(config);

      const useStyle = gen(
        'TestComponent',
        (token) => ({
          [`${token.componentCls}`]: {
            borderRadius: token.borderRadius,
          },
        }),
        () => ({ borderRadius: 4 }),
      );

      const TestComponent: React.FC<{ prefixCls: string }> = ({ prefixCls }) => {
        useStyle(prefixCls);
        return <div data-testid="test-component">Test</div>;
      };

      render(
        <StyleProvider cache={createCache()}>
          <TestComponent prefixCls="test-prefix" />
        </StyleProvider>,
      );

      const totalStyle = Array.from(document.querySelectorAll('style'))
        .map((el) => el.textContent)
        .join('\n');

      expect(totalStyle).toContain('border-radius:var(--ant-border-radius)');
      expect(totalStyle).not.toContain('var(--ant-test-component-border-radius)');
    });
  });
});
