# 原生工程打包/生成工具

原生功能打包工具是基于 CocosCreator 定制的，用于快速将 CocosCreator 生成的普通资源项目文件夹整合成标准的原生平台功能代码，支持快速编译、运行对应的原生平台工程。

处理的原生工程目录需要为以下的目录结构：

```dir
- build
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

1. 在开发原生相关代码的过程中，可以先使用构建生成一份不加密的平台构建包，删掉 `build/[platform]/proj` 以及 `[projectPath]/native` 后，直接在 engine 仓库快速执行命令编译验证逻辑。

2. 如何注册新平台？

(1) 需要编写对应平台的打包代码类，可以参考现有平台例如 `WindowsPackTool` 之类的写法，可以自行选择要继承于默认的类还是已有的平台类。

(2) 在代码入口 `source/index` 里注册新的平台以及打包工具类

```ts
import { WindowsPackTool } from './platforms/windows';
nativePackToolMg.register('windows', new WindowsPackTool());
```

(3) 保障新的类里，`create, make, run` 的逻辑都正常，直接使用命令行测试即可。

(4) 构建插件是直接加载的入口脚本，所有如果有其他闭源插件想要做平台插件注册，直接在 `hooks` 脚本的 `load` 钩子里加载 `nativePackToolMg` 后执行注册逻辑即可。
