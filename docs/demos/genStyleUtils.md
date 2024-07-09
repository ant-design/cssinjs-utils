---
title: genStyleUtils
nav:
  title: API
  path: /genStyleUtils
---
### 介绍
`genStyleUtils` 是一个生成器，用于生成在 `antd` 生态下开发组件样式的工具集。它返回这些工具：
 - `genComponentStyleHook`: 用于生成组件样式
 - `genStyleHooks`: 用于生成组件样式集合
 - `genSubStyleComponent`: 用于生成子组件样式
 - `useToken`: 获取 token 的钩子函数

### 使用建议
为了更好的获得 TS 类型支持，建议您在使用 `genStyleUtils` 的时候传入范型参数 `CompTokenMap`，比如：
``` typescript
import { genStyleUtils } from '@ant-design/cssinjs-util';

interface YourCompTokenMap {
  Button?: {};
};

genStyleUtils<YourCompTokenMap>();
```

### 基础使用
> 最简单的用法，适用于对上下文无扩展需要
``` typescript
import { genStyleUtils } from '@ant-design/cssinjs-util';

const utils = genStyleUtils<YourCompTokenMap>();

const {
  genComponentStyleHook,
  genStyleHooks,
  genSubStyleComponent,
  useToken
} = utils;
```

### 扩展上下文
> 使用 `genStyleUtils` 的时候传入 `getConfigProviderContext` 和 `getThemeProviderContext` 两个函数，用于扩展 `ConfigProvider` 和 `ThemeProvider` 的上下文。
``` typescript
import React from 'react';
import { genStyleUtils } from '@ant-design/cssinjs-util';

function getConfigProviderContext () {
  // ... do something
  return React.createContext({
    // ... your config context
  });
}

function getThemeProviderContext () {
  // ...do something
  return React.createContext({
    // ... your theme context
  });
}

const utils = genStyleUtils<YourCompTokenMap>(getConfigProviderContext, getThemeProviderContext);
```
