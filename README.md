# RBAC Admin

一个基于 Vue 3 + TypeScript + Element Plus 的 RBAC 权限管理系统。

## 功能特性

- 🚀 使用 Vue 3 + TypeScript + Vite 开发，提供更好的开发体验
- 💪 采用 Vue 3 Composition API 及 `<script setup>` 语法糖
- 🔥 使用 Pinia 状态管理，更好的代码组织
- 📦 集成 Element Plus，提供美观的用户界面
- 🎨 使用 SCSS 预处理器，更灵活的样式处理
- 🔒 基于 RBAC 的权限管理，包括：
  - 用户管理：用户的增删改查、分配角色
  - 角色管理：角色的增删改查、分配权限
  - 权限管理：权限的增删改查、树形展示

## 技术栈

- [Vue 3](https://v3.vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Element Plus](https://element-plus.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Axios](https://axios-http.com/)

## 项目结构

```
├── src
│   ├── api                 # API 接口
│   │   ├── auth.ts        # 认证相关接口
│   │   └── system         # 系统管理模块接口
│   ├── assets             # 静态资源
│   ├── components         # 公共组件
│   ├── layout             # 布局组件
│   │   ├── components     # 布局相关组件
│   │   └── index.vue      # 主布局文件
│   ├── router             # 路由配置
│   │   ├── index.ts       # 路由主文件
│   │   └── permission.ts  # 路由权限控制
│   ├── store              # Pinia 状态管理
│   │   ├── app.ts         # 应用配置状态
│   │   └── user.ts        # 用户状态
│   ├── styles             # 全局样式
│   ├── utils              # 工具函数
│   │   └── request.ts     # Axios 封装
│   └── views              # 页面组件
│       ├── login          # 登录页
│       └── system         # 系统管理页面
├── .env                   # 环境变量
├── .eslintrc.js          # ESLint 配置
├── .gitignore            # Git 忽略文件
├── index.html            # HTML 模板
├── package.json          # 项目依赖
├── tsconfig.json         # TypeScript 配置
└── vite.config.ts        # Vite 配置
```

## 快速开始

### 环境要求

- Node.js >= 16
- pnpm >= 7

### 安装依赖

```bash
pnpm install
```

### 开发环境运行

```bash
pnpm dev
```

### 生产环境构建

```bash
pnpm build
```

### 代码检查

```bash
pnpm lint
```

## 功能模块

### 用户管理
- 用户列表展示
- 新增/修改/删除用户
- 修改用户状态
- 给用户分配角色

### 角色管理
- 角色列表展示
- 新增/修改/删除角色
- 修改角色状态
- 给角色分配权限

### 权限管理
- 权限树形展示
- 新增/修改/删除权限
- 权限类型：菜单、按钮
- 权限状态控制

## 接口文档
[后端服务: https://github.com/bystart/rbac-server](https://github.com/bystart/rbac-server)

接口文档使用 Swagger，启动后端服务后访问：`http://localhost:8080/doc.html`

## 浏览器支持

推荐使用最新版本的 Chrome、Firefox、Safari 和 Edge 浏览器。

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request


## 致谢

- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
