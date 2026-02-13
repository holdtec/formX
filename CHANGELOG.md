# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-02-13

### Added
- Shunting-yard 算法实现安全表达式解析
- 支持 Math 函数: `Math.pow`, `Math.round`, `Math.floor`, `Math.ceil`, `Math.abs`, `Math.max`, `Math.min`
- 支持比较运算符: `>`, `<`, `>=`, `<=`, `==`, `!=`
- 支持逻辑运算符: `&&`, `||`, `!`
- 支持 IF 条件函数
- 新增 `@enginx/formx-react` 独立组件包
  - `FormProvider` 上下文组件
  - `FormField` 字段渲染组件
  - `useField` 字段状态 Hook
  - `useFormEngine` 引擎访问 Hook
- 支持 18+ 字段类型
  - `TEXT` - 文本输入
  - `TEXTAREA` - 多行文本
  - `NUMBER` - 数字输入
  - `MONETARY` - 货币金额
  - `SLIDER` - 滑块选择
  - `BOOLEAN` - 复选框
  - `SWITCH` - 开关切换
  - `ENUM` - 下拉选择
  - `RADIO` - 单选按钮
  - `CHECKBOX` - 多选框组
  - `DATE` - 日期选择
  - `DATETIME` - 日期时间
  - `DIMENSION` - 级联维度
  - `RATING` - 评分组件
  - `COLOR` - 颜色选择
  - `FILE` - 文件上传
  - `READONLY` - 只读字段
  - `HIDDEN` - 隐藏字段
- Grid 布局支持，字段 `span` 属性控制宽度
- 表达式自动计算功能
- 演示页面左侧导航平滑动画

### Changed
- 顶部导航栏新增下拉菜单整合演示入口
- 使用 `fixed` 定位优化下拉菜单体验

### Fixed
- 修复表达式求值死循环问题
- 修复下拉菜单影响导航栏高度问题

## [1.0.0] - 2026-02-13

### Added
- 核心引擎 `FormxEngine` 实现
  - Schema 驱动的表单状态管理
  - DAG 依赖图自动构建
  - 表达式解析与计算
  - 字段值变化监听
- 基础字段类型支持
  - `TEXT`, `NUMBER`, `MONETARY`, `ENUM`, `BOOLEAN`, `DATE`
- 表达式计算支持
  - 四则运算: `+`, `-`, `*`, `/`
  - 聚合函数: `SUM`
- 项目文档和演示页面

### Security
- 移除 `eval` 和 `new Function`，使用安全表达式解析

---

## 版本说明

### 版本号规则

- **主版本号 (MAJOR)**: 不兼容的 API 变更
- **次版本号 (MINOR)**: 向后兼容的功能新增
- **修订号 (PATCH)**: 向后兼容的问题修复

### 变更类型

- `Added`: 新增功能
- `Changed`: 功能变更
- `Deprecated`: 即将废弃的功能
- `Removed`: 已移除的功能
- `Fixed`: 问题修复
- `Security`: 安全相关
