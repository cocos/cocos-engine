<p align="center">
    <a href="https://www.cocos.com/">
        <img src="https://user-images.githubusercontent.com/1503156/112012067-d5cdf580-8b63-11eb-819a-1c32cf253b25.png"
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
    <a href="https://github.com/cocos-creator/engine/releases">
        <img src="https://img.shields.io/github/tag/cocos/cocos-engine.svg?label=version&style=flat-square&colorB=4183c4"
             alt="version">
    </a>
    <a href="./licenses/LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square&colorB=4183c4"
             alt="license">
    </a>
    <a href="https://twitter.com/CocosEngine">
        <img src="https://img.shields.io/twitter/follow/CocosEngine.svg?logo=twitter&label=follow&style=flat-square&colorB=4183c4"
             alt="twitter">
    </a>
</p>

# Cocos Creator 引擎

![image](https://user-images.githubusercontent.com/1503156/111035862-53548000-8457-11eb-8e8b-52d854caf627.png)

Cocos Engine 是 Cocos Creator 编辑器的运行时框架。Cocos Creator 是 Cocos 家族的下一代游戏开发工具，为开发者集成了完整的 3D 能力，并且提供了直观、高效、便于协作的工作流。

Cocos Creator 继承了其以前版本的许多优良品质和酷炫功能，如强大的跨平台支持、资产管理、强大的动画编辑等。此外，Cocos Creator 还将我们的技术推到了一个全新的水平。我们的 GFX 实现是为了适应最新的图形后端 API，支持 WebGL 2 并且可以无缝 fallback 到 WebGL 1，在原生构建中支持 Vulkan 和 Metal。材质系统建立在我们自己基于 GLSL 300 的 Effect 格式，可以很容易地适应低端设备的低版本。使开发人员可以制作高性能、极富表现力的着色器，并具有良好的兼容性。伴随着基于物理的相机和光照，高水平的游戏图形可以很容易地实现。我们的纯 GPU 驱动的骨骼动画也能确保你的游戏运行尽可能的流畅。除了所有这些令人兴奋的功能，Cocos Creator 还有内置的物理支持、地形编辑支持、特效编辑、UI 系统、TypeScript 支持、即时预览等功能。

![image](https://user-images.githubusercontent.com/1503156/111037166-f27c7600-845d-11eb-988f-4c2c8b5c7321.png)

引擎部分主要由 TypeScript 实现，支持用户使用 TypeScript 来编写游戏逻辑。另外在 `native` 目录中则提供了引擎在原生平台上的底层实现。引擎本身大部分是独立的，有成熟的运行时，包括光照、材质、粒子、动画、物理、UI、地形、声音、资源和场景节点管理等模块。同时支持原生和 Web 浏览器，包括 Windows、Mac、iOS、Android、HarmonyOS、Web。更令人兴奋的是，它支持各类小游戏平台，如微信小游戏和 Facebook Instant Games。

此引擎作为关键的运行时库默认集成在 Cocos Creator 中，并不是被设计为独立使用。

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
