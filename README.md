# vue3-rabbit

基于 Vue 3 + Vite 开发的小兔鲜电商前台项目，覆盖商城首页、分类浏览、商品详情、购物车、结算下单、支付页、登录和会员中心等常见电商业务流程。

## 功能特性

- 首页展示：商品分类导航、轮播图、新鲜好物、人气推荐、商品模块
- 分类浏览：一级分类、二级分类、筛选条件和商品列表
- 商品详情：图片预览、规格 SKU 选择、数量选择、详情图懒加载、热销推荐
- 购物车：未登录本地购物车、登录后服务端购物车、购物车合并、删除和金额统计
- 用户登录：Element Plus 表单校验、Token 持久化、请求头自动携带 Authorization
- 订单结算：收货地址选择/新增、商品确认、金额汇总、创建订单
- 支付流程：订单支付页、支付结果回跳页
- 会员中心：个人中心、订单列表、订单状态筛选和分页
- 全局能力：Axios 请求封装、Pinia 状态管理、图片懒加载指令、全局业务组件注册

## 技术栈

| 类型 | 技术 |
| --- | --- |
| 构建工具 | Vite 7 |
| 前端框架 | Vue 3 |
| 路由 | Vue Router |
| 状态管理 | Pinia、pinia-plugin-persistedstate |
| UI 组件库 | Element Plus |
| HTTP 请求 | Axios |
| 样式 | SCSS |
| 工具库 | VueUse |
| 自动导入 | unplugin-auto-import、unplugin-vue-components |

## 快速开始

### 环境要求

Node.js 版本需要满足：

```sh
^20.19.0 || >=22.12.0
```

### 安装依赖

```sh
npm install
```

如果希望严格按照 `package-lock.json` 安装，也可以使用：

```sh
npm ci
```

### 本地开发

```sh
npm run dev
```

启动后在终端提示的本地地址中访问项目。

### 生产构建

```sh
npm run build
```

### 本地预览构建产物

```sh
npm run preview
```

## 可用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | 构建生产环境静态资源 |
| `npm run preview` | 预览生产构建产物 |

## 项目结构

```text
vue3-rabbit
├─ public/                 # 静态资源
├─ src/
│  ├─ apis/                # 接口请求模块
│  ├─ assets/              # 图片、基础样式等资源
│  ├─ components/          # 全局业务组件
│  │  ├─ ImageView/        # 商品图片预览组件
│  │  └─ XtxSku/           # 商品 SKU 选择组件
│  ├─ directives/          # 自定义指令
│  ├─ router/              # 路由配置
│  ├─ stores/              # Pinia 状态模块
│  ├─ styles/              # 公共 SCSS、变量和 Element Plus 样式覆盖
│  ├─ utils/               # Axios 封装、支付相关工具
│  └─ views/               # 页面视图
├─ vite.config.js          # Vite 配置
├─ package.json
└─ README.md
```

## 页面路由

| 路径 | 页面 |
| --- | --- |
| `/` | 首页 |
| `/login` | 登录页 |
| `/category/:id` | 一级分类页 |
| `/category/sub/:id` | 二级分类页 |
| `/detail/:id` | 商品详情页 |
| `/cartlist` | 购物车页 |
| `/checkout` | 订单结算页 |
| `/pay` | 支付页 |
| `/payback` | 支付回跳页 |
| `/member/user` | 会员中心-个人信息 |
| `/member/order` | 会员中心-订单列表 |

## 接口说明

开发环境下，项目通过 Vite 代理将 `/api` 转发到小兔鲜测试接口：

```js
server: {
  proxy: {
    '/api': {
      target: 'https://pcapi-xiaotuxian-front-devtest.itheima.net',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

Axios 实例统一封装在 `src/utils/http.js`：

- 基础路径：`/api`
- 超时时间：`5000ms`
- 请求拦截：从 Pinia 用户状态中读取 Token，并写入 `Authorization`
- 响应拦截：统一返回业务数据、处理错误提示，遇到 `401` 时清理用户信息并跳转登录页

项目内置登录页默认账号：

```text
账号：xiaotuxian001
密码：123456
```

## 状态管理

项目使用 Pinia 管理业务状态：

- `userStore`：用户信息、登录、退出、Token 持久化
- `cartStore`：购物车列表、添加商品、删除商品、购物车合并、总数量和总价统计
- `categoryStore`：首页导航分类数据

`pinia-plugin-persistedstate` 用于持久化用户和购物车状态，刷新页面后仍可保留关键数据。

## 开发说明

- `@` 已配置为 `src` 目录别名。
- Element Plus 组件通过 `unplugin-auto-import` 和 `unplugin-vue-components` 按需导入。
- 公共 SCSS 变量和 Element Plus 样式覆盖在 `vite.config.js` 中自动注入。
- 商品图片懒加载指令定义在 `src/directives/index.js`，模板中可使用 `v-img-lazy`。
- `XtxImageView` 和 `XtxSkuView` 在 `src/components/index.js` 中注册为全局组件。

## 部署注意事项

项目路由使用 `createWebHistory`，部署到 Nginx、Vercel、Netlify 或其他静态资源服务器时，需要配置 SPA fallback，将未匹配的前端路由回退到 `index.html`。

生产环境如果不使用 Vite dev server，需要自行配置 `/api` 到真实接口服务的反向代理，或根据部署环境调整请求基础路径。
