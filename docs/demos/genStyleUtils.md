---
title: genStyleUtils
nav:
  title: API
  path: /genStyleUtils
---
# `genStyleUtils` 使用文档

`genStyleUtils` 提供了用于在 `antd` 生态开发中，生成和管理样式的实用工具函数集。

## 入参介绍

### `genStyleUtils<CompTokenMap>(getConfigProviderContext?, getThemeProviderContext?)`
- `getConfigProviderContext`: 可选，用于获取配置上下文的钩子函数。
- `getThemeProviderContext`: 可选，用于获取主题上下文的钩子函数。
- `CompTokenMap`: 范型参数，表示组件 token 映射
> 使用建议：为了更好的获得 TS 类型支持，建议您在使用 `genStyleUtils` 的时候传入范型参数 `CompTokenMap`

## 如何使用
``` typescript
import React from 'react';
import { genStyleUtils } from '@ant-design/cssinjs-utils';

// Step1: 定义组件 Token 映射
interface YourCompTokenMap {
  Button?: {};
  Avatar?: {};
  // ...
}

// Step2: 定义配置上下文
function getConfigProviderContext () {
  // ... do something
  return React.createContext({
    // ... your config context
  });
}

// Step3: 定义主题上下文
function getThemeProviderContext () {
  // ...do something
  return React.createContext({
    // ... your theme context
  });
}
// Step4: 使用 `genStyleUtils` 生成工具函数集
const {
  genStyleHooks,
  genComponentStyleHook,
  genSubStyleComponent,
  useToken,
} = genStyleUtils<YourCompTokenMap>(getConfigProviderContext, getThemeProviderContext);
```

## 工具介绍

### `genStyleHooks(component, styleFn, getDefaultToken?, options?)`

- `component`: 组件名称 `ComponentName` 或组件名称数组 `[ComponentName, ComponentName]`。
- `styleFn`: 根据标记和样式信息生成 CSS 插值的函数。
- `getDefaultToken`: 可选，用于检索默认标记的函数或值。
- `options`: 可选，包含额外的配置选项如 `resetStyle`、`resetFont`、`deprecatedTokens`、`clientOnly` 等。

### `genComponentStyleHook(component, styleFn, getDefaultToken?, options?)`

- `component`: 组件名称 `ComponentName` 或组件名称数组 `[ComponentName, ComponentName]`。
- `styleFn`: 根据标记和样式信息生成 CSS 插值的函数。
- `getDefaultToken`: 可选，用于检索默认标记的函数或值。
- `options`: 可选，包含额外的配置选项如 `resetStyle`、`resetFont`、`deprecatedTokens`、`clientOnly` 等。

### `genSubStyleComponent(component, styleFn, getDefaultToken?, options?)`

- `component`: 组件名称 `ComponentName` 或组件名称数组 `[ComponentName, ComponentName]`。
- `styleFn`: 根据标记和样式信息生成 CSS 插值的函数。
- `getDefaultToken`: 可选，用于检索默认标记的函数或值。
- `options`: 可选，包含额外的配置选项如 `resetStyle`、`resetFont`、`deprecatedTokens`、`clientOnly` 等。

### `useToken()`

 - 无参数。

## 示例用法

### `genStyleHooks`

```javascript
const useStyle = genStyleHooks('Button', styleFn, getDefaultToken, { resetStyle: true });
const [wrapStyle, hashId] = useStyle('button');
```

### `genComponentStyleHook`

```javascript
const useStyle = genComponentStyleHook('Button', styleFn, getDefaultToken, { clientOnly: true });
const [wrapStyle, hashId] = useStyle('button');
```

### `genSubStyleComponent`

```javascript
const SubButtonStyle = genSubStyleComponent('Button', styleFn, getDefaultToken, { resetFont: true });

() => <SubButtonStyle prefixCls="sub-button" />;
```

### `useToken`

```javascript
const [theme, token, hashId, realToken, cssVar] = useToken();
```
