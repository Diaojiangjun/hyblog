---
title: Uni-App（Vue3 + TypeScript）方案结构详解
published: 2025-11-28
updated: 2025-11-28
description: ''
image: "api"
tags: [uniapp,笔记]
category: '前端'
draft: false 
lang: ''
pinned: false
series: ''
---

在本文中，我们将详细解析一个完整的 **Uni-App + Vue3 + TypeScript**工程结构。 带你了解每个文件、目录的用途与作用。

------

### 项目结构总览

```js title="项目结构"
UNIAPP-项目名称/
├─ .idea/                  # VSCode / WebStorm 项目配置文件
├─ dist/                   # 打包输出目录（编译后的文件）
├─ node_modules/           # 第三方依赖库（由 npm 自动生成）
├─ src/                    # 核心源代码目录
│  ├─ api/                 # 与后端通信的接口封装
│  ├─ components/          # 自定义 Vue 组件
│  ├─ hooks/               # 封装的组合式函数（Composition API）
│  ├─ pages/               # 应用页面（每个文件夹代表一个页面）
│  ├─ static/              # 静态资源（图片、音频、字体等）
│  ├─ store/               # 全局状态管理（Pinia 或 Vuex）
│  ├─ utils/               # 工具函数模块（时间格式化、节流、防抖等）
│  ├─ App.vue              # 应用根组件
│  ├─ env.d.ts             # 环境类型声明文件（用于全局类型补充）
│  ├─ main.ts              # 应用入口文件（创建 Vue 应用实例）
│  └─ manifest.json        # Uni-App 运行配置文件（App 权限、启动图等）
│
├─ pages.json              # 页面配置文件（页面路径与导航栏）
├─ shime-uni.d.ts          # Uni-App 全局类型声明文件（为 `uni.*` 提供类型提示）
├─ uni.scss                # 全局样式变量文件（颜色、字体、间距）
├─ .gitignore              # Git 忽略文件列表
├─ eslint.config.mjs       # ESLint 代码规范配置
├─ index.html              # Web 平台入口 HTML 文件（H5 编译时使用）
├─ package-lock.json       # npm 依赖锁定文件（自动生成）
├─ package.json            # 项目信息与依赖声明（最核心的配置）
├─ README.md               # 项目说明文档
├─ shims-uni.d.ts          # 兼容不同平台的 Uni 类型声明
├─ tsconfig.json           # TypeScript 编译配置文件
└─ vite.config.ts          # Vite 构建工具配置文件
```

### 各目录与文件详解

#### 1️⃣ `.idea/`

由 JetBrains（WebStorm、PhpStorm）自动生成，保存 IDE工程设置，不参与构建。

#### 2️⃣ `dist/`

项目打包后生成的产物目录。通常不会手动编辑，发布或部署时使用。

#### 3️⃣ `node_modules/`

项目依赖安装后生成的模块目录，包含所有 npm 包。

#### 4️⃣ `src/` ------ 项目核心代码目录

##### `api/`

用于封装与后端通信的接口模块，示例：

```js title="demo"
import request from '@/utils/request'
export const getUserList = () => request.get('/user/list')
```

##### `components/`

放置全局或局部可复用的 Vue 组件，例如：

```vue

```

##### `hooks/`

自定义组合式函数目录，用于抽离通用逻辑：

```ts
export function useCounter() {
const count = ref(0)
const increment = () => count.value++
return { count, increment }
}
```

##### `pages/`

每个文件夹代表一个独立页面，例如：

```text
pages/
├─ index/
│  └─ index.vue
├─ login/
│  └─ login.vue
```

##### `static/`

放置不会被 Webpack/Vite 处理的静态资源（如图片、音频）。

##### `store/`

用于状态管理，可采用 Pinia：

```ts
import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', {
state: () => ({ name: '张三', token: '' })
})
```

##### `utils/`

封装项目常用工具函数：

```ts
export function formatTime(date: Date) {
return date.toLocaleString()
}
```

##### `App.vue`

应用根组件，是整个项目的启动入口（类似 React 的 App.js）。

##### `main.ts`

项目启动文件，挂载 App 并创建应用实例：

```ts
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
const app = createSSRApp(App)
return { app }
}
```

##### `manifest.json`

App 端运行配置文件，控制应用图标、启动页、权限等。

------

#### 5️⃣ `pages.json`

定义页面路径与导航栏外观，是 UniApp 的"路由表"。

```json
{
"pages": [ //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
		{
			"path": "pages/index/index",
			"style": {
				"navigationBarTitleText": "uni-app"
			}
		}
	]
}    
```

------

#### 6️⃣ `uni.scss`

全局样式变量文件，例如：

```scss
$primary-color: #3b82f6;
$text-color: #333;
```

所有 `.vue` 页面都可直接使用这些变量。

------

#### 7️⃣ `vite.config.ts`

Vite 构建配置文件，定义插件与路径别名：

```ts
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { fileURLToPath, URL } from 'node:url'
export default defineConfig({
resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
plugins: [uni()]
})
```

------

#### 8️⃣ `tsconfig.json`

TypeScript 的核心配置文件，控制类型检查、语法支持和路径解析：

```json
{
"compilerOptions": {
"target": "ESNext",
"strict": true,
"baseUrl": ".",
"paths": { "@/*": ["./src/*"] }
}
}
```

------

#### 9️⃣ `.eslintrc.cjs / eslint.config.mjs`

代码规范配置文件，控制 ESLint 行为，比如是否允许多余空格、未使用变量等。

------

#### 其他文件说明

文件 说明

------

`.gitignore` 控制哪些文件不提交到 Git
`index.html` H5 运行入口
`package.json` 项目依赖、脚本命令
`package-lock.json` 锁定依赖版本
`README.md` 项目说明文档
`shims-uni.d.ts` / `env.d.ts` 提供 UniApp、环境变量的类型声明

------

### 路由封装（和vue用法一致）

该路由系统基于 Uni-App 与 Vue3 构建，统一封装了页面跳转与参数管理逻辑。
它自动解析 URL 中的参数（支持多层 JSON 与编码），并提供类型安全的路由对象。
开发者通过 `useRouter()` 即可在任意页面中获取参数、执行跳转、重定向或返回，简化页面通信与导航流程。

分别负责 URL 拼接 → 参数传递 → 参数解析 → 页面 Hook

基础工具 utils/params.ts 负责把参数对象拼接或解析成 URL
路由核心类 utils/router.ts 封装 uni.navigateTo / redirectTo 等操作
参数解析Hook useQuery/index.ts 负责在页面加载时解析 URL 参数并返回响应式对象
路由Hook useRouter/index.ts 将 Router 与 useQuery 结合，实现页面级路由对象

1️⃣ params.ts —— URL 参数工具

```csharp
    功能：拼接或解析 URL 参数。
    提供函数：
    setParams(url, params)：把对象转成 ?a=1&b=2。
    getParams(url)：从 URL 提取参数对象。
    服务对象：被 router.ts 调用，用来生成跳转链接。
```

2️⃣ router.ts —— 路由核心类

```lua
    功能：封装 uni.navigateTo、redirectTo、switchTab、back。
    核心点：
    统一参数处理（调用 setParams() 拼接）。
    维护当前 path 与 query。
    提供生命周期回调 ready() / runReady()。
    服务对象：被 useRouter.ts 实例化，用来操作页面跳转。
```

3️⃣ useQuery —— 参数解析 Hook

```javascript
    功能：在页面加载时自动解析 URL 参数。
    特性：
    两次 decodeURIComponent 解码。
    自动识别 JSON 并递归解析。
    支持合并默认值。
    输出：返回响应式对象 query。
    服务对象：被 useRouter.ts 调用，用于读取当前页参数。
```

4️⃣ useRouter —— 页面路由 Hook（整合层）

```erlang
    功能：把 Router + useQuery 结合成页面可直接使用的路由对象。
    逻辑：
    创建 query = useQuery()；
    创建响应式 router = new Router()；
    在 onLoad 时写入 query 和当前路径；
    页面渲染完成后执行 router.runReady() 回调。
    输出：一个带跳转功能、含当前参数的 router 实例。
```

四者协作流程

```bash
    页面加载
        ↓
        useRouter()
        ├─ 调用 useQuery() → 解析 URL 参数
        ├─ 创建 Router() → 管理跳转与状态
        ├─ 写入 query/path
        └─ nextTick → runReady() 触发回调
```

✅ 一句话总结：

```scss
params.ts 负责拼接，router.ts 负责跳转，
useQuery 负责解析，useRouter 负责整合。
页面通过 useRouter() 一步即可完成「参数解析 + 路由操作」。
```

### 总结

Lighting-UniApp 是一个基于 **Vue3 + TypeScript + Uni-App**
的跨平台项目， 通过 `vite` 构建、`tsconfig.json`
提供类型支持、`pages.json` 控制页面结构、`manifest.json` 管理应用权限。

这一结构清晰、模块划分明确的项目架构，非常适合前端工程化与移动端多端开发。

------

> ✨ 作者建议：写项目时，保持 `api`、`store`、`utils` 的独立性；保持
> `pages.json` 的整洁，可以让你的 UniApp 项目结构清晰、易维护。