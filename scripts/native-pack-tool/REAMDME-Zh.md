# 原生工程打包/生成工具

原生功能打包工具是基于 CocosCreator 定制的，用于快速将 CocosCreator 生成的普通资源项目文件夹整合成标准的原生平台功能代码，支持快速编译、运行对应的原生平台工程。

处理的原生工程目录需要为以下的目录结构：

```dir
- windows
    -- data // 原始的构建工程资源
    -- cocos.compile.json // 所有原生工程需要的配置信息（包括项目路径等等）都放置在此文件中，这个文件将在每次构建后更新
```

## 快速开始

在使用之前请先执行以下命令

```bash
npm install
npm run build
```

## 支持的命令

```bash
npm run pack [projectPath] create // 根据原始构建后的目录资源生成基础的原生资源工程
npm run pack [projectPath] make // 编译指定的原生工程
npm run pack [projectPath] run // 运行已经编译好的原生导出软件

npm run pack [projectPath] init,make,run
```

## 开发须知

在开发原生相关代码的过程中，可以先使用构建生成一份不加密的平台构建包，删掉 `proj` 后，直接在 engine 仓库快速执行命令编译验证逻辑。
