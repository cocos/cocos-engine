# Cocos Creator Engine Framework

This repo is the engine framework for Cocos Creator, Cocos Creator is a game development tool focused on content creation, which has realized features like thorough scriptability, componentization and data driven, etc. on the basis of Cocos2d-x.

Cocos Creator's in-editor scene view and web runtime share the same framework, which is the content of this repo. It's originally forked from [Cocos2d-html5](https://github.com/cocos2d/cocos2d-html5/), we build up an Entity Component architecture on it to meet the needs of Cocos Creator. 

This framework is a cross-platform game engine written in Javascript and licensed under MIT. It supports major desktop and mobile browsers, it's also compatible with [Cocos2d Javascript Binding engine](https://github.com/cocos-creator/cocos2d-x-lite) to support native platforms like iOS, Android, Win32, Mac OS X.

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

#### Visual Test

1. Build for testing.<br>

    ```bash
    gulp build-test
    ```

2. Start express in cloned project folder.

    ```
    node test/visual-tests/server.js
    ```

3. Open [http://localhost:8512/test/visual-tests/index.html](http://localhost:8512/test/visual-tests/index.html) in your browser.

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


## Links

* [Official site](http://cocos2d-x.org/creator)
* [Download](http://cocos2d-x.org/download)
* [Documentation](http://www.cocos2d-x.org/docs/creator/manual/en/)
* [API References](http://www.cocos2d-x.org/docs/creator/api/en/)
* [Forum](http://discuss.cocos2d-x.org/c/editors-and-tools/cocos-creator)
* [Road Map](https://trello.com/b/JWVRRxMG/cocos-creator-roadmap)
