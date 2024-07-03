# @ant-design/cssinjs-util
A cssinjs util library to support Ant Design (antd) and its ecosystem libraries.

## Install
``` bash
npm i @ant-design/cssinjs-util --save
```

## Usage

## Example
http://localhost:8000

## Development
``` bash
npm install
npm start
```

## API

## Test Case
```
npm test
npm run coverage
```
open coverage/ dir

## License
cssinjs-util is released under the MIT license.


## Summary
将 `antd` 仓库 [ant-design/components/theme](https://github.com/ant-design/ant-design/tree/master/components/theme) 路径下，可通用样式工具迁移至 `@ant-design/cssinjs-util`

## Motivation
之前，我们在 [[RFC] Migrate the genCalc util from antd repo](https://github.com/ant-design/cssinjs/pull/184) 对目前 antd 生态库书写样式的方案进行了分析:
> 当前 antd 有类似`@ant-design/web3`、`@ant-design/x` 等生态库，在生态库中编写组件样式时目前几种选择：
> 1. 照搬 antd repo 中的代码至各生态库
> 2. 生态库内仅使用 `@ant-design/cssinjs` 简单实现类似的功能封装
> 3. 将可抽离的通用逻辑迁移至 `@ant-design/cssinjs` ，尽可能减少重复代码

最终我们选择了方案三，但该 RFC 存在一些遗留未解决问题：仅解决了部分代码重复问题，仍然有大部分代码需要下沉。

另外，我们还面临其他一些问题：
1. 部分通用样式工具不适合迁移至 `@ant-design/cssinjs`，如 `genStyleHooks`、`genSubStyleComponent` 等。
2. 部分代码并不需要下沉到任何一个仓库，因为其仅服务于 `antd` 内部。

本 RFC 旨在彻底解决该类问题，让 `antd` 生态库可以更合理的书写样式代码且符合整体设计规范。同时新增 `@ant-design/cssinjs-util` 工具包来承担这个使命。

## API
涉及两类 API 变更操作：
1. Migrate - 由 `antd` 迁移至 `@ant-design/cssinjs-util`
2. Refactor - 保留原 `antd` 中的 API 但涉及重构
3. Keep - 保留原 `antd` 中的 API 不涉及任何改动

### Migrate ``


## Basic Example

## Unresolved questions
由于 antd 中常用API `genStyleHooks` 调用 `genSubStyleComponent` 调用 `genCalc`,迁移 `genCalc` 仅解决部分代码重复问题，后续仍需要持续优化。

另外，需要在 antd 中提 PR 对此次变更兼容。后续将补充。
