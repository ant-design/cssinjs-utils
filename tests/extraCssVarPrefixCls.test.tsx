import React from 'react';
import { render } from '@testing-library/react';
import { createCache, StyleProvider } from '@ant-design/cssinjs';
import { genStyleUtils } from '../src';

interface TestTokenMap {
  TestComponent: {
    colorPrimary?: string;
    fontSize?: number;
  };
}

describe('extraCssVarPrefixCls', () => {
  const mockConfig = {
    usePrefix: jest.fn().mockReturnValue({
      rootPrefixCls: 'ant',
      iconPrefixCls: 'anticon',
    }),
    useToken: jest.fn().mockReturnValue({
      theme: {
        id: 'test',
      } as any,
      realToken: {
        colorPrimary: '#1890ff',
        fontSize: 14,
        TestComponent: {
          colorPrimary: '#ff0000',
          fontSize: 16,
        },
      },
      hashId: 'css-dev-only-do-not-override-abc123',
      token: {
        colorPrimary: '#1890ff',
        fontSize: 14,
        TestComponent: {
          colorPrimary: '#ff0000',
          fontSize: 16,
        },
      },
      cssVar: {
        prefix: 'ant',
        key: 'test',
      },
    }),
    useCSP: jest.fn().mockReturnValue({ nonce: 'nonce' }),
    getResetStyles: jest.fn().mockReturnValue([]),
    layer: {
      name: 'test',
      dependencies: ['parent'],
    },
  };

  const { genStyleHooks } = genStyleUtils<TestTokenMap, any, any>(mockConfig);

  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('should inject CSS vars for extraCssVarPrefixCls', () => {
    const hooks = genStyleHooks(
      'TestComponent',
      (token) => ({
        [`${token.componentCls}`]: {
          color: token.colorPrimary,
          fontSize: token.fontSize,
        },
      }),
      () => ({
        colorPrimary: '#ff0000',
        fontSize: 16,
      }),
      {
        extraCssVarPrefixCls: ['custom-a', 'custom-b'],
      },
    );

    const TestComponent = () => {
      const [hashId, cssVarCls] = hooks('test-prefix');
      const className = [hashId, cssVarCls].filter(Boolean).join(' ');
      return <div className={className}>{hashId}</div>;
    };

    render(
      <StyleProvider cache={createCache()}>
        <TestComponent />
      </StyleProvider>,
    );

    const totalStyle = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent)
      .join('\n');

    expect(totalStyle).toContain('.custom-a');
    expect(totalStyle).toContain('.custom-b');
  });
});
