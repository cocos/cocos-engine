# Cocos Creator 3D

Cocos Creator 3D is the new generation of game development tool in Cocos family, it brings a complete set of 3d features and provides an intuitive, low cost and collaboration friendly workflow to game developers.

Cocos Creator 3D inherited many good qualities and cool features from its previous versions, such as cross-platform support including instant gaming platforms like WeChat mini game, asset management, powerful animation editing, etc. Furthermore, Cocos Creator 3D has pushed our technology to a whole new level. Our GFX implementation is designed to adapt to the latest graphic backend APIs, it already supports WebGL 2 and can be seamlessly fall back to WebGL 1, it will support Vulkan and Metal in the native build. The material system is built on our own effect format which uses GLSL 300 and can be easily adapted to lower version on low end devices. Developers can produce high performance, extremely expressive shaders with good compatibility. Along with physical based camera and lighting, high level game graphic can be easily achieved. Our pure GPU driven skeleton animation also make sure your game runs as smooth as possible. Besides all these exciting features, Cocos Creator 3D have builtin physics support, terrain editing support, visual effect editing, ui system, TypeScript support, instant preview etc.

This repo is the engine part of Cocos Creator 3D, it's mainly written in TypeScript and support users to use TypeScript or ES6 to write game logics. The engine itself is mostly self-contained, with full-fledged runtime modules including lighting, material, particle, animation, physical, UI, terrain, sound, resource and scene-graph management, etc. It supports both native and web platforms, including Windows, Mac, iOS, Android, Web. What's more exciting is that it supports rapidly expanding instant gaming platforms like WeChat Mini Game and Facebook Instant Games.

The engine is naturally integrated within Cocos Creator 3D, designed to only be the essential runtime library and not to be used independently.

## Developer

### Prerequisite

- Install [node.js v9.11.2 +](https://nodejs.org/)
- Install [gulp-cli v3.9.0 +](https://github.com/gulpjs/gulp/tree/master/docs/getting-started)

### Install

In the cloned repo, run the following command to setup dev environment:

```bash
# download & build engine dependencies
npm install
```

This is all you have to do to setup engine development environment.

### Build

- If running inside Cocos Creator 3D, the engine will automatically compile and build after the editor window is opened.

- Outside the editor, you need to run the following command to build:

  ```bash
  npm run build:dev
  ```

## Example Project

- [Example Cases](https://github.com/cocos-creator/example-3d): Simple yet expressive demo scenes for baseline testing and topic-specific case study.
- [Mind Your Steip 3D](https://github.com/cocos-creator/tutorial-mind-your-step-3d): Beginner's step-by-step tutorial project repo.
- [UI Demo](https://github.com/cocos-creator/demo-ui/tree/3d): use cases for various kinds of UI components.
- [Test Cases](https://github.com/cocos-creator/test-cases-3d): Unit test scenes for every engine module.

## Links

- [Official site](http://www.cocos.com/en)
- [Forum](https://forum.cocos.org/c/3D)
- [Documentation](https://docs.cocos.com/creator3d/manual/zh)
- [API Referencess](https://docs.cocos.com/creator3d/api/zh)
- [Download](https://www.cocos.com/creator3d)
- Road Map: To be announced
