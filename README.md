# 简介

国内渠道小游戏 H5 sdk 集成项目

# 特点

1. 集成多渠道开发和打包环境，不需要切换不同项目开发
2. 适配快应用和小游戏开发环境，解决跨域问题
3. 一键打包多渠道sdk

# 使用

## 安装

```bash
pnpm i
```

## 启动

### 微信

```bash
npm run dev:wx
```

使用微信开发者工具，打开 `public/wx`  路径

## 打包

### 微信

```bash
npm run build:wx
```

## 配置

### env 环境变量

注意：一定要 `VITE_` 开头
.env.develop：开发时的全局 import.meta.env 配置
.env.production：打包正式环境时的全局 import.meta.env 配置

# uc

## 调试

启动后，将本地 url 填入 uc 小游戏调试工具：https://minigame.uc.cn/tools/protocal

参考文档： https://juejin.cn/post/7135748553330294797
