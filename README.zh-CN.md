<p align="center">
    <a href="https://www.cocos.com/">
        <img src="./ui.png"
             alt="Cocos Creator Logo">
    </a>
</p>
<p align="center">
    <a href="https://github.com/cocos/cocos-engine/stargazers">
        <img src="https://img.shields.io/github/stars/cocos/cocos-engine.svg?style=flat-square&colorB=4183c4"
             alt="stars">
    </a>
    <a href="https://github.com/cocos-creator/engine/network">
        <img src="https://img.shields.io/github/forks/cocos/cocos-engine.svg?style=flat-square&colorB=4183c4"
             alt="forks">
    </a>
    <a href="./LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square&colorB=4183c4"
             alt="license">
    </a>
    <a href="https://twitter.com/CocosEngine">
        <img src="https://img.shields.io/twitter/follow/CocosEngine.svg?logo=twitter&label=follow&style=flat-square&colorB=4183c4"
             alt="twitter">
    </a>
</p>

# COCOS 4

COCOS 4 是一个开源的、高性能的、跨平台的游戏和交互式内容开发引擎。基于成熟的 C++ 架构，它提供强大的渲染能力和灵活的脚本绑定，支持"一次编写，随处运行"的哲学。

以前，_Cocos Creator_ 指的是结合了引擎和编辑器的产品，跨越 1.x、2.x 和 3.x 版本。为了采纳纯开源模式并充分整合 AI，我们正在将引擎与编辑器分离。这是一个重大且必要的演进。往后：

**COCOS** 将专指引擎，主版本号升级到 **COCOS 4**。跨平台框架和编辑器的核心组件将被转换为 CLI 工具并整合到引擎的核心功能中。这代表着这个开源版本的一个重要新增功能。

## 引擎特性

1. **现代图形技术**：GFX 实现设计用于适配现代图形 API，在 Windows 和 Android 上使用 Vulkan，在 Mac OS 和 iOS 上使用 Metal，在 Web 平台上使用 WebGL。
2. **高性能**：运行时引擎由 C++ 和 TypeScript 各占一半构成，低层基础设施、原生平台适配、渲染器和场景管理都用 C++ 编写以保证高运行时性能。我们不断将更多的繁重工作转移到原生代码中。
3. **可定制化渲染管线**：渲染管线被设计为完全可定制的，已在所有平台上支持内置的正向和延迟渲染管线。开发者可以按照相同的方法自定义他们的渲染管线。
4. **可扩展的表面着色器**：材质系统建立在 Cocos 的 effect 格式之上，使用 GLSL 300，着色器程序将自动转换为合适的运行时格式。表面着色器允许充分定制表面材质，同时确保通用的光照模型。
5. **基于物理的渲染（PBR）**：标准效果采用基于物理的渲染，结合基于物理的摄像机和基于物理参数的光照，开发者可以轻松在不同环境中实现逼真、无缝的渲染效果。
6. **易用的 TypeScript API**：用户级 API 集由 TypeScript 提供，加上强大的 VSCode 编辑器，使用 Cocos Creator 开发效率极高。

![image](https://user-images.githubusercontent.com/1503156/111037166-f27c7600-845d-11eb-988f-4c2c8b5c7321.png)

引擎部分主要由 TypeScript 实现，支持用户使用 TypeScript 来编写游戏逻辑。另外在 `native` 目录中则提供了引擎在原生平台上的底层实现。引擎本身大部分是独立的，有成熟的运行时，包括光照、材质、粒子、动画、物理、UI、地形、声音、资源和场景节点管理等模块。同时支持原生和 Web 浏览器，包括 Windows、Mac、iOS、Android、HarmonyOS、Web。更令人兴奋的是，它支持各类小游戏平台，如微信小游戏和 Facebook Instant Games。

## 开发

### 环境要求

- 安装 [node.js v9.11.2 +](https://nodejs.org/)
- 安装 [gulp-cli v2.3.0 +](https://github.com/gulpjs/gulp/tree/master/docs/getting-started)

### 安装

在本地克隆仓库中，运行以下命令设置开发环境：

```bash
# 下载 & 构建引擎依赖
npm install
```

这就完成了引擎开发环境搭建工作。

### 编译

- Cocos Creator 将在编辑器窗口打开后自动编译和构建引擎。更多在 Cocos Creator 中修改引擎的说明，请参考 [引擎定制工作流程](https://docs.cocos.com/creator/manual/zh/advanced-topics/engine-customization.html)。
- 如果在编辑器之外单独使用，你需要运行以下命令来构建：

  ```bash
  npm run build
  ```

## 范例工程

- [Example Cases](https://github.com/cocos/cocos-example-projects)：简单而富有表现力的演示场景，用于基线测试和特定主题的案例学习
- [Mind Your Step 3D](https://github.com/cocos/cocos-tutorial-mind-your-step)：初学者的逐步教程项目
- [UI Demo](https://github.com/cocos/cocos-example-ui)：各种 UI 组件的使用案例
- [Test Cases](https://github.com/cocos/cocos-test-projects)：引擎各模块的测试场景

## 链接

- [官网](https://www.cocos.com/products#CocosCreator)
- [下载](https://www.cocos.com/creator)
- [文档](https://docs.cocos.com/creator/manual/zh/)
- [API 参考](https://docs.cocos.com/creator/api/zh/)
- [论坛](http://forum.cocos.org/c/Creator)
- [Road Map](https://trello.com/b/JWVRRxMG/cocos-creator-roadmap)
