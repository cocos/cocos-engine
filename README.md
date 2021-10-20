<p align="center">
    <a href="https://www.cocos.com/">
        <img src="https://user-images.githubusercontent.com/1503156/112012067-d5cdf580-8b63-11eb-819a-1c32cf253b25.png"
             alt="Cocos Creator Logo">
    </a>
</p>
<p align="center">
    <a href="https://github.com/cocos-creator/engine/stargazers">
        <img src="https://img.shields.io/github/stars/cocos-creator/engine.svg?style=flat-square&colorB=4183c4"
             alt="stars">
    </a>
    <a href="https://github.com/cocos-creator/engine/network">
        <img src="https://img.shields.io/github/forks/cocos-creator/engine.svg?style=flat-square&colorB=4183c4"
             alt="forks">
    </a>
    <a href="https://github.com/cocos-creator/engine/releases">
        <img src="https://img.shields.io/github/tag/cocos-creator/engine.svg?label=version&style=flat-square&colorB=4183c4"
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

# Cocos Creator

![image](https://user-images.githubusercontent.com/1503156/111035862-53548000-8457-11eb-8e8b-52d854caf627.png)

Cocos Creator is the new generation of game development tool in Cocos family, it brings a complete set of 3D features and provides an intuitive, low cost and collaboration friendly workflow to game developers.

Cocos Creator inherited many good qualities and cool features from its previous versions, such as cross-platform support including instant gaming platforms like WeChat mini game, asset management, powerful animation editing, etc. Furthermore, Cocos Creator has pushed our technology to a whole new level. Our GFX implementation is designed to adapt to the latest graphic backend APIs, it already supports WebGL 2 and can be seamlessly fall back to WebGL 1, it will support Vulkan and Metal in the native build. The material system is built on our own effect format which uses GLSL 300 and can be easily adapted to lower version on low end devices. Developers can produce high performance, extremely expressive shaders with good compatibility. Along with physical based camera and lighting, high level game graphic can be easily achieved. Our pure GPU driven skeleton animation also make sure your game runs as smooth as possible. Besides all these exciting features, Cocos Creator have builtin physics support, terrain editing support, visual effect editing, ui system, TypeScript support, instant preview etc.

![image](https://user-images.githubusercontent.com/1503156/111037166-f27c7600-845d-11eb-988f-4c2c8b5c7321.png)

This repo is the engine part of Cocos Creator, it's mainly written in TypeScript and support users to use TypeScript or ES6 to write game logics. The engine itself is mostly self-contained, with full-fledged runtime modules including lighting, material, particle, animation, physical, UI, terrain, sound, resource and scene-graph management, etc. It supports both native and web platforms, including Windows, Mac, iOS, Android, Web. What's more exciting is that it supports rapidly expanding instant gaming platforms like WeChat Mini Game and Facebook Instant Games.

The engine is naturally integrated within Cocos Creator, designed to only be the essential runtime library and not to be used independently.

## Developer

### Prerequisite

- Install [node.js v9.11.2 +](https://nodejs.org/)
- Install [gulp-cli v2.3.0 +](https://github.com/gulpjs/gulp/tree/master/docs/getting-started)

### Install

In the cloned repo, run the following command to setup dev environment:

```bash
# download & build engine dependencies
npm install
```

This is all you have to do to setup engine development environment.

### Build

- If running inside Cocos Creator, the engine will automatically compile and build after the editor window is opened.

- Outside the editor, you need to run the following command to build:

  ```bash
  npm run build
  ```

## Example Project

- [Example Cases](https://github.com/cocos-creator/example-3d): Simple yet expressive demo scenes for baseline testing and topic-specific case study.
- [Mind Your Step 3D](https://github.com/cocos-creator/tutorial-mind-your-step-3d): Beginner's step-by-step tutorial project repo.
- [UI Demo](https://github.com/cocos-creator/demo-ui/tree/3d): use cases for various kinds of UI components.
- [Test Cases](https://github.com/cocos-creator/test-cases-3d): Unit test scenes for every engine module.

## Links

- [Official site](https://www.cocos.com/products#CocosCreator)
- [Download](https://www.cocos.com/creator)
- [Documentation](https://docs.cocos.com/creator/manual/)
- [API References](https://docs.cocos.com/creator/api/)
- [Forum](https://discuss.cocos2d-x.org/c/creator)
- Road Map: To be announced
