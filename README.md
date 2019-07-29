# Cocos Creator 3D

Cocos Creator 3D 是一套完整的游戏开发及构建工作流工具，包含了游戏引擎、资源管理、场景编辑、游戏预览、调试及将项目发布到平台等功能，它在部分继承于 Cocos Creator 的基础上，进行了升级重构，能够满足 3D 项目的复杂需求，且延续了 Cocos Creator 的良好特性。

此仓库是 Cocos Creator 3D 的游戏引擎部分，该引擎使用TypeScript编写并符合HTML5标准，支持主流的桌面和移动浏览器及各类小游戏。其包含了渲染核心、场景管理、基于物理的光照系统、材质系统、粒子系统、动画系统、物理系统、UI系统、声音系统、资源管理等游戏引擎的常用模块。

此引擎设计与 Cocos Creator 3D 编辑器集成，因此它并非为独立使用而设计的，配合 Cocos Creator 3D 编辑器，可以完成游戏开发的全部工作，而不需要借助其他 3D 游戏编辑工具。

## 开发者

### 环境需求

运行该引擎需要的环境

- 安装[node.js v9.11.2 +](https://nodejs.org/)
- 安装[gulp-cli v3.9.0 +](https://github.com/gulpjs/gulp/tree/master/docs/getting-started)

### 安装

在克隆的项目文件夹中，运行以下命令以设置开发环境：

```bash
#初始化 gulp 依赖项
#在安装 Node.js 时，npm是内置CLI
npm install
```

以上即为设置引擎开发环境的全部工作。

### 构建引擎

- 如果使用 Cocos Creator 3D 编辑器，在打开编辑器时引擎会自动编译构建，用户无需额外关心。

- 如果只安装了引擎，那么请运行如下命令：

```bash
npm run build:dev
```

在成功之后可以用浏览器打开文件目录 playground 中的 [simple.html](./playground/simple.html) 文件查看引擎是否正常工作,如果看到由很多基本几何体在空间中做螺旋运动则引擎正常工作。

## 演示和范例项目

- [范例集合](https://github.com/cocos-creator/example-3d)：从基本组件的使用到渲染效果的展示，这个项目里包括了多个侧重功能不同的场景提供给用户参考。
- [一步两步](https://github.com/cocos-creator/tutorial-mind-your-step-3d)：用户手册中里分步讲解制作的游戏。
- [UI 展示 Demo](https://github.com/cocos-creator/demo-ui/tree/3d)：展示了 UI 的各种使用方法。

## 相关链接

- [官方网站]()
- [编辑器]()
- [开发者论坛](https://forum.cocos.com/c/3D)
- [用户手册]()
- [API 文档]()
- [Road Map]()
