<p align="center">
    <img src="https://user-images.githubusercontent.com/1503156/50446380-ad88c980-094f-11e9-8eff-0094bde708d0.png">
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
    <a href="https://twitter.com/cocos2dx">
        <img src="https://img.shields.io/twitter/follow/cocos2dx.svg?logo=twitter&label=follow&style=flat-square&colorB=4183c4"
             alt="twitter">
    </a>
</p>

# Cocos Creator

![2.2.0 Main Window](https://user-images.githubusercontent.com/1503156/67261891-3cfdfb00-f4d5-11e9-9b2d-15ff2cb015f4.png)

Cocos Creator is a complete package of game development tools and workflow, including a game engine, resource management, scene editing, game preview, debug and publish one project to multiple platforms. Cocos Creator focused on content creation, which has realized features like thorough scriptability, componentization and data driven, etc. on the basis of Cocos2d-x. With JavaScript, you can scripting your component in no time. The editor and engine extension is also made with JavaScript so you can make games and refine your tool in a single programming language. Cocos Creator is an provides an innovative, easy to use toolset such as the UI system and Animation editor. The toolset will be expanding continuously and quickly, thanks to the open editor extension system.

This repo is the engine framework for Cocos Creator. Cocos Creator's in-editor scene view and web runtime share the same framework, which is the content of this repo. It's originally forked from [Cocos2d-html5](https://github.com/cocos2d/cocos2d-html5/), we build up an Entity Component architecture on it to meet the needs of Cocos Creator. 

This framework is a cross-platform game engine written in JavaScript and licensed under MIT. It supports major desktop and mobile browsers, it's also compatible with [Cocos2d Javascript Binding engine](https://github.com/cocos-creator/cocos2d-x-lite) to support native platforms like iOS, Android, Win32, macOS.

The framework is naturally integrated with Cocos Creator, so it's not designed to be used independently.

## Developer

### Prerequisite

- Install [node.js v8.0.0+](https://nodejs.org/)
- Install [gulp-cli v3.9.0+](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)

### Install

In cloned project folder, run the following command to setup dev environment:

```bash
# Initialize gulp task dependencies
# npm is a builtin CLI when you install Node.js
npm install
```

This is all you have to do to set engine development environment.

### Build

```bash
gulp build
```

If the compilation process encounters a "JavaScript heap out memory" warning, you can use the following command line

```bash
gulp build --max-old-space-size=8192
```

### Test

#### Prerequisite

 - Install [express](http://expressjs.com/): `npm install express`
 - Install gulp-qunit: `npm install gulp-qunit`

#### Unit Test

##### Test in CLI

```bash
npm test
```

##### Test in browser

1. Build for testing. <br>

    ```bash
    gulp build-test
    ```

2. Start express in cloned project folder.

    ```
    node test/qunit/server.js
    ```

3. Open [http://localhost:8511/bin/qunit-runner.html](http://localhost:8511/bin/qunit-runner.html) in your browser.

### DebugInfos

View [EngineErrorMap.md](https://github.com/cocos-creator/engine/blob/master/EngineErrorMap.md)  
All the debug infos are defined in file EngineErrorMap.md.  
The file DebugInfos.json will be generated based on EngineErrorMap.md, when run gulp build* command.

For details below:

1. Define log in EngineErrorMap.md 

    example
    ```
    ### 1001  
      
    cocos2d: removeAction: Target not found
          
    ```

2. Define deprecated log in EngineErrorMap.md 
   The log should be marked as DEPRECATED when then logId is no longer referenced in the project.

    example
    ```
    ### 1000
      
    <!-- DEPRECATED -->
    cc.ActionManager.addAction(): action must be non-null  
    
    ```

## Useful links

* [Official site](http://cocos2d-x.org/creator)
* [Download](http://cocos2d-x.org/download)
* [Documentation](https://docs.cocos2d-x.org/creator/manual/en/)
* [API References](https://docs.cocos2d-x.org/creator/api/en/)
* [Forum](https://discuss.cocos2d-x.org/c/creator)
