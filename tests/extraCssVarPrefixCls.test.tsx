import React from 'react';
import { render } from '@testing-library/react';
import { createCache, StyleProvider } from '@ant-design/cssinjs';
import { genStyleUtils } from '../src';

interface TestTokenMap {
  TestComponent: Record<string, any>;
}

describe('extraCssVarPrefixCls', () => {
  const mockConfig = {
    usePrefix: () => ({
      rootPrefixCls: 'ant',
      iconPrefixCls: 'anticon',
    }),
    useToken: () => ({
      theme: {
        id: 'test',
      } as any,
      realToken: { colorPrimary: '#1890ff', fontSize: 14 },
      hashId: 'css-dev-only-do-not-override-abc123',
      token: { colorPrimary: '#1890ff', fontSize: 14 },
      cssVar: {
        prefix: 'ant',
        key: 'test',
      },
    }),
    useCSP: () => ({ nonce: 'nonce' }),
    getResetStyles: () => [],
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
      () => ({}),
      () => ({}),
      {
        extraCssVarPrefixCls: ['custom-a', 'custom-b'],
        injectStyle: true,
      },
    );

    const TestComponent = () => {
      const [hashId] = hooks('test-prefix');
      return <div>{hashId}</div>;
    };

    render(
      <StyleProvider cache={createCache()}>
        <TestComponent />
      </StyleProvider>,
    );

    const totalStyle = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent)
      .join('\n');

    console.log('Total CSS:', totalStyle);

    expect(totalStyle).toContain('.test-prefix');
    expect(totalStyle).toContain('.custom-a');
    expect(totalStyle).toContain('.custom-b');
  });
});
