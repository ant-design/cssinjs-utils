# Action Items for @ant-design/cssinjs

## 优化 CSS 变量注入以减少冗余

### 当前问题
在 `@rc-component/util` 的 `genStyleUtils` 中新增了 `extraCssVarPrefixCls` 选项，允许为多个 prefixCls 注册 CSS 变量。当前实现需要为每个 scope 调用一次 `useCSSVarRegister`，导致：

1. **代码冗余**：多个 scope 会生成相同值的 CSS 变量
2. **性能开销**：大量 DOM 操作会带来性能问题

### 当前生成的 CSS
```css
.xxx-hashId { --btn-color: #1890ff; }
.xxx-hashId.ant-btn-compact { --btn-color: #1890ff; }
.xxx-hashId.ant-btn-large { --btn-color: #1890ff; }
```

### 建议的优化方案
支持在 `useCSSVarRegister` 的 config 中传入多个 scope，生成逗号分隔的选择器：

```css
.xxx-hashId, .xxx-hashId.ant-btn-compact, .xxx-hashId.ant-btn-large {
  --btn-color: #1890ff;
}
```

### API 变更建议
```typescript
// 当前 API
useCSSVarRegister(
  { ..., scope: 'ant-btn-compact' },  // 单个 scope
  tokenGenerator
);

// 建议的 API（兼容现有）
useCSSVarRegister(
  { ..., scope: 'ant-btn-compact' },  // 仍然支持单个 scope
  tokenGenerator
);
useCSSVarRegister(
  { ..., scopes: ['ant-btn', 'ant-btn-compact', 'ant-btn-large'] },  // 新增支持数组的 scopes
  tokenGenerator
);
```

### 需要修改的文件
- `lib/hooks/useCSSVarRegister.js` - 接受 `scopes` 数组并修改 `serializeCSSVar` 生成逻辑
- `lib/util/css-variables.js` - 修改 `serializeCSSVar` 支持多个 scope 生成逗号分隔选择器
- 对应的 TypeScript 类型定义文件

### 注意事项
1. 保持向后兼容，`scope` 仍然可用
2. 这属于性能优化，不是破坏性变更