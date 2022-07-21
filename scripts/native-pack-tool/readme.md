# 原生工程打包/生成工具

原生功能打包工具是基于 CocosCreator 定制的，用于快速将 CocosCreator 构建生成的普通资源项目文件夹整合成标准的原生平台功能代码，支持快速编译、运行对应的原生平台工程。

处理的原生工程目录需要为以下的目录结构：

```dir
- build
  - windows
    -- data // 原始的构建工程资源
    -- cocos.compile.config.json // 所有原生工程需要的配置信息（包括项目路径等等）都放置在此文件中，这个文件将在每次构建后更新
```

## 快速开始

在使用之前请先执行以下命令

```bash
1. npm install
2. tsc (需要全局安装 typescript) 或 npm run build
```

## 支持的命令

```bash
npm run pack [projectBuildPath] create // 根据原始构建后的目录资源生成基础的原生模板
npm run pack [projectBuildPath] generate // 根据基础原生模板，调用 cmake 生成完整工程
npm run pack [projectBuildPath] make // 编译/生成指定的原生工程
npm run pack [projectBuildPath] run // 运行已经编译好的原生导出软件

npm run pack [projectBuildPath] create,generate,make,run
```

> [projectBuildPath] 指代 `build/[platform]` 路径

## 开发须知

1. 在开发原生相关代码的过程中，可以先使用构建生成一份不加密的平台构建包，删掉 `build/[platform]/proj` 以及 `[projectPath]/native` 后，直接在 `engine` 仓库快速执行命令来编译生成验证逻辑。

2. 如何注册新平台？

(1) 需要编写对应平台的打包代码类，可以参考现有平台例如 `WindowsPackTool` 之类的写法，可以自行选择要继承于默认的类还是已有的平台类。

(2) 在代码入口 `source/index` 里注册新的平台以及打包工具类。

```ts
import { WindowsPackTool } from './platforms/windows';
nativePackToolMg.register('windows', new WindowsPackTool());
```

(3) 保障新的类里，`create, generate, make, run` 的逻辑都正常，直接使用命令行测试即可。

(4) 构建的内置平台是直接调用的命令行执行的生成、编译逻辑，所有如果有其他闭源插件想要添加新平台的定制打包逻辑，可以在 `hooks` 脚本的 `load` 或者 `beforeBuild` 之类的钩子里加载 `nativePackToolMg` 后执行注册逻辑即可，通过命令行和直接加载脚本的差异主要在于脚本加载有缓存，通过这种方式可能会取到被多个不同插件加工过的原生平台打包逻辑。

(5) 所有原生平台的打包参数，都要在构建阶段整理，写入到 `cocos.compile.config.json`，关于 `nativePackToolMg` 的调用方式，可以参考 `scripts/task` 内的写法。

3. 调试打包工具

相对来说调试打包工具应该尽量在本仓库内直接调试好，构建阶段调用即可，可以在 `.vscode.launch.json` 内配置调试参数，如下图

```json5
    {
        "command": "npm run pack",
        "name": "npm run pack",
        "request": "launch",
        "cwd": "${workspaceRoot}/scripts/native-pack-tool", // 实际的构建项目目录（cocos.compile.config.json 所在目录）
        "args": [
            "E:\\test-cases-3d\\build\\android2",
            "create"
        ],
        "type": "node-terminal"
    },
```
