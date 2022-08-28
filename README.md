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

# Engine for Cocos Creator

**Cocos Creator is the new generation of game development tool in Cocos family, it brings a complete set of 3D and 2D features while providing an intuitive, low cost and collaboration friendly workflow to game developers.** Cocos Engine is the runtime framework for Cocos Creator editor.

![image](https://www.cocos.com/wp-content/uploads/2022/08/13f41f1c975e8255fdc06f59597b9546-7.png)

Cocos Creator inherited many good qualities and cool features from its previous versions, such as high performance low level C++ implementation, intuitive editor, cross-platform support. It supports native platforms, web platforms and rapidly expanding instant gaming platforms, including Windows, Mac, iOS, Android, HarmonyOS, Web, Facebook Instant Games, WeChat Mini Game and TikTok Mini Games.

Furthermore, Cocos Creator has pushed our technology to a whole new level for high performance with scalability on various platforms, full extensibility and easy development.

1. **Modern Graphics**: Our GFX implementation is designed to adapt to the modern graphics APIs, it uses Vulkan on Windows and Android, Metal on Mac OS and iOS, WebGL on Web platform.
2. **High Performance**: The runtime engine is built with half C++ and half TypeScript, low level infrastructure, native platform adaptation, renderer and scene management are all written in C++ to ensure high runtime performance. We continue to move heavy lifting work to native as much as possible.
3. **Customizable Render Pipeline**: The render pipeline is designed to be fully customizable, it has supported the builtin forward and deferred render pipeline across all platforms. Developers can customize their own render pipeline following the same approach.
4. **Extensible Surface Shader**: The material system is built on our own effect format which uses GLSL 300, the shader programs will be converted to suitable runtime format automatically. The surface shader permit to fully customize the surface material while ensuring universal lighting model.
5. **Physically Based Rendering**: Our standard effect adopts physically based rendering, along with the physically based camera and the lighting based on physical metrics, developers can easily achieve realistic and seamless rendering results across different environment.
6. **Easy TypeScript API**: Our user level API set is provided in TypeScript, along with the powerful VSCode editor, development with Cocos Creator is incredibly efficient.

Besides all these highlights, Cocos Creator also provides builtin animation system, physics system, particle system, terrain editing support, complex UI system, instant preview etc.

![image](https://user-images.githubusercontent.com/1503156/111037166-f27c7600-845d-11eb-988f-4c2c8b5c7321.png)

This open source repository is the runtime engine of Cocos Creator, the engine is naturally integrated within Cocos Creator, designed to only be the essential runtime library and not to be used independently.

## Development and Contribution Notice

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

- If running inside Cocos Creator, the engine will automatically compile and build after the editor window is opened. For more instructions on modifying the engine in Cocos Creator, please refer to [Engine Customization Workflow](https://docs.cocos.com/creator/manual/en/advanced-topics/engine-customization.html).
- Outside the editor, you need to run the following command to build:

  ```bash
  npm run build
  ```

Please refer to [native readme](native/README.md) if want to develop native applications.

## Example Project

- [Mind Your Step 3D](https://github.com/cocos/cocos-tutorial-mind-your-step): Beginner's step-by-step tutorial project repo.
- [Test Cases](https://github.com/cocos/cocos-test-projects): Unit test scenes for every engine module.
- [Example Cases](https://github.com/cocos/cocos-example-projects): Simple yet expressive demo scenes for baseline testing and topic-specific case study.
- [Awesome Cocos](https://github.com/cocos/awesome-cocos): You can find out other useful tools and show cases here.

## Links

- [Official site](https://www.cocos.com/)
- [Download](https://www.cocos.com/creator/download)
- [Documentation](https://docs.cocos.com/creator/manual/en/)
- [API References](https://docs.cocos.com/creator/api/en/)
- [Forum](https://discuss.cocos2d-x.org/c/creator)
- [Projects and road map](https://github.com/orgs/cocos/projects?query=is%3Aopen&type=new)
