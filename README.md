# Cocos Creator 3D

Cocos Creator 3D is a complete package of game development tools and workflow, including a game engine, resource management, scene editing, game preview, debug and publish one project to multiple platforms. Based on Cocos Creator,it has been aggresively refactored to meet the complex needs of 3D projects while retaining most of the original features where applicable.

This is the repo for Cocos Creator 3D engine, which is written mostly in TypeScript and conforms to the HTML5 standard, supporting mainstream desktop and mobile browsers and all sorts of WebGL-interfaced native in-app platforms. The engine itself is mostly self-contained, with full-fledged runtime modules including lighting, material, particle, animation, physical, UI, terrain, sound, resource and scene-graph management, etc.

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

- [Official site]()
- [Download]()
- [Documentation](https://github.com/cocos-creator/docs-3d)
- [API References]()
- [Forum](https://forum.cocos.com/c/3D)
- [Road Map]()
