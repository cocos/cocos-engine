<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [The Tutorial of Swig Workflow in Cocos Creator](#the-tutorial-of-swig-workflow-in-cocos-creator)
  - [How to Bind a New Module in Engine](#how-to-bind-a-new-module-in-engine)
    - [Add a new module interface file](#add-a-new-module-interface-file)
    - [Modify swig-config.js](#modify-swig-configjs)
    - [Generate bindings](#generate-bindings)
    - [Modify `engine/native/cocos/CMakeLists.txt`](#modify-enginenativecocoscmakeliststxt)
    - [Register the new module to Script Engine](#register-the-new-module-to-script-engine)
  - [How to Bind a New Module in Developer's Project](#how-to-bind-a-new-module-in-developers-project)
    - [Bind a simple class](#bind-a-simple-class)
      - [Create a simple class](#create-a-simple-class)
      - [Write an interface file](#write-an-interface-file)
      - [Write a swig config file](#write-a-swig-config-file)
      - [Generate bindings](#generate-bindings-1)
      - [Modify project's CMakeLists.txt](#modify-projects-cmakeliststxt)
      - [Open project](#open-project)
      - [Register the new module to Script Engine](#register-the-new-module-to-script-engine-1)
      - [Test binding](#test-binding)
      - [Section Conclusion](#section-conclusion)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# The Tutorial of Swig Workflow in Cocos Creator

## How to Bind a New Module in Engine

### Add a new module interface file

- Add a new module interface file to `native/tools/swig-config` directory, e.g. `new-engine-module.i`

- Copy the content in [swig-interface-template.i](../swig-interface-template.i) to new-engine-module.i

- Add necessary configuration, you refer to the existed  `.i` files in `native/tools/swig-config` directory or refer to [the following section](#How to Bind a New Module in Developer's Project)
  

### Modify swig-config.js

```js
// ......
// Engine Module Configuration
const configList = [
    [ '2d.i', 'jsb_2d_auto.cpp' ],
    // ......
    [ 'renderer.i', 'jsb_render_auto.cpp' ],
    [ 'new-engine-module.i', 'jsb_new_engine_module_auto.cpp' ], // Add this line
];
//......
```

### Generate bindings

```bash
cd engine/native/tools/swig-config
node genbindings.js
```

### Modify `engine/native/cocos/CMakeLists.txt`

```cmake
######## auto
cocos_source_files(
    NO_WERROR   NO_UBUILD   cocos/bindings/auto/jsb_new_engine_module_auto.cpp # Added
                            cocos/bindings/auto/jsb_new_engine_module_auto.h # Added
    NO_WERROR   NO_UBUILD   cocos/bindings/auto/jsb_cocos_auto.cpp
                            cocos/bindings/auto/jsb_cocos_auto.h
    ......
```

### Register the new module to Script Engine

Open jsb_module_register.cpp and do the following modifications

```c++
......
#if CC_USE_PHYSICS_PHYSX
    #include "cocos/bindings/auto/jsb_physics_auto.h"
#endif
#include "cocos/bindings/auto/jsb_new_engine_module_auto.h" // Add this line

bool jsb_register_all_modules() {
    se::ScriptEngine *se = se::ScriptEngine::getInstance();
    ......
    se->addRegisterCallback(register_all_my_new_engine_module); // Add this line

    se->addAfterCleanupHook([]() {
        cc::DeferredReleasePool::clear();
        JSBClassType::cleanup();
    });
    return true;   
}
```

## How to Bind a New Module in Developer's Project

Suppose we have a Cocos Creator project located at `/Users/james/NewProject` directory.

Built a native project in Cocos Creator's build panel, we get `/Users/james/NewProject/native` directory.

### Bind a simple class

#### Create a simple class

Create a header file in `/Users/james/NewProject/native/engine/Classes/MyObject.h` , its content is 

```c++
// MyObject.h
#pragma once
#include "cocos/cocos.h"
class MyObject {
public:
  MyObject() = default;
  MyObject(int a, bool b) {}
  ~MyObject() = default;
  void print() {
    CC_LOG_DEBUG("==> a: %d, b: %d\n", _a, (int)_b);
  }
  
  float publicFloatProperty{1.23F};
private:
  int _a{100};
  bool _b{true};
};
```

#### Write an interface file

Create an interface called `my-module.i` file in  `/Users/james/NewProject/tools/swig-config`

```c++
// my-module.i
%module(target_namespace="my_ns") my_module

// Insert code at the beginning of generated header file (.h)
%insert(header_file) %{
#pragma once
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"

#include "MyObject.h" // Add this line
%}

// Insert code at the beginning of generated source file (.cpp)
%{
#include "bindings/auto/jsb_my_module_auto.h"
%}

%include "MyObject.h"
```

#### Write a swig config file

Create a file called swig-config.js in `/Users/james/NewProject/tools/swig-config`

```js
// swig-config.js
'use strict';
const path = require('path');
const configList = [
    [ 'my-module.i', 'jsb_my_module_auto.cpp' ],
];

const projectRoot = path.resolve(path.join(__dirname, '..', '..'));
const interfacesDir = path.join(projectRoot, 'tools', 'swig-config');
const bindingsOutDir = path.join(projectRoot, 'native', 'engine', 'common', 'bindings', 'auto');
// includeDirs means header search path for Swig parser
const includeDirs = [
    path.join(projectRoot, 'native', 'engine', 'common', 'Classes'),
];

module.exports = {
    interfacesDir,
    bindingsOutDir,
    includeDirs,
    configList
};
```

#### Generate bindings

```bash
$ cd /Users/james/NewProject/tools/swig-config
$ node < Engine Root >/native/tools/swig-config/genbindings.js
```

If succeed, the files ( jsb_my_module_auto.cpp/.h ) contain JS binding code will be generated at `/Users/james/NewProject/native/engine/bindings/auto` directory

#### Modify project's CMakeLists.txt

- Open `/Users/james/NewProject/native/engine/common/CMakeLists.txt`, add `MyObject.h` and its binding code

  ```cmake
  include(${COCOS_X_PATH}/CMakeLists.txt)
  
  list(APPEND CC_COMMON_SOURCES
      ${CMAKE_CURRENT_LIST_DIR}/Classes/Game.h
      ${CMAKE_CURRENT_LIST_DIR}/Classes/Game.cpp
      ############### Add the following lines ##############
      ${CMAKE_CURRENT_LIST_DIR}/Classes/MyObject.h 
      ${CMAKE_CURRENT_LIST_DIR}/bindings/auto/jsb_my_module_auto.h
      ${CMAKE_CURRENT_LIST_DIR}/bindings/auto/jsb_my_module_auto.cpp
      ########################################################
  )
  ```

- Modify `/Users/james/NewProject/native/engine/mac/CMakeLists.txt`

  ```cmake
  cmake_minimum_required(VERSION 3.8)
  # ......
  cc_mac_before_target(${EXECUTABLE_NAME})
  add_executable(${EXECUTABLE_NAME} ${CC_ALL_SOURCES})
  ############### Add the following lines ##############
  target_include_directories(${EXECUTABLE_NAME} PRIVATE
      ${CC_PROJECT_DIR}/../common
  )
  ########################################################
  cc_mac_after_target(${EXECUTABLE_NAME})
  ```

  

#### Open project 

macOS: `/Users/james/NewProject/build/mac/proj/NewProject.xcodeproj ` 

Windows: `< A specific directory >/NewProject/build/win64/proj/NewProject.sln`

#### Register the new module to Script Engine

Modify `Game.cpp` :

```c++
#include "Game.h"
#include "bindings/auto/jsb_my_module_auto.h" // Add this line
//......
int Game::init() {
  // ......
  se::ScriptEngine::getInstance()->addRegisterCallback(register_all_my_module); // Add this line
  BaseGame::init();
  return 0;
}
// ......
```

#### Test binding

- Add a `my-module.d.ts` file in the root of project directory to make TS compiler know our binding class.

  ```ts
  // my-module.d.ts
  declare namespace my_ns {
  class MyObject {
      constructor();
      constructor(a: number, b: number);
  
      publicFloatProperty : number;
      print() : void;
  }
  }
  ```

- Modify `/Users/james/NewProject/temp/tsconfig.cocos.json` file

  ```js
  {
    "$schema": "https://json.schemastore.org/tsconfig",
    "compilerOptions": {
      "target": "ES2015",
      "module": "ES2015",
      "strict": true,
      "types": [
        "./temp/declarations/cc.custom-macro",
        "./temp/declarations/jsb",
        "./temp/declarations/cc",
        "./temp/declarations/cc.env",
        "./my-module" // Add this line
      ],
      // ......
      "forceConsistentCasingInFileNames": true
    }
  }
  ```

- Open NewProject in Cocos Creator, create a cube object in scene and attach a script to cube, the script's content is

  ```ts
  import { _decorator, Component } from 'cc';
  const { ccclass } = _decorator;
  
  @ccclass('MyComponent')
  export class MyComponent extends Component {
      start() {
          const myObj = new my_ns.MyObject();
          myObj.print(); // Invoke native print method
          console.log(`==> myObj.publicFloatProperty: ${myObj.publicFloatProperty}`); // Get property defined in native
      }
  }
  ```

- Run project, if succeed, you could find the following logs in console 

  ```
  17:31:44 [DEBUG]: ==> a: 100, b: 1
  17:31:44 [DEBUG]: D/ JS: ==> myObj.publicFloatProperty: 1.2300000190734863
  ```

#### Section Conclusion

In this section, we have learned how to use `Swig` tool to bind a simple class, export its public methods and properties to JS. This section also cover the entire flow of binding native classes. Start from next section, we will focus on using more `Swig` features to satisfy more needs of JS bindings, for example:

- How to import depended header files and don't generate binding code for imported file

- How to ignore or rename classes, methods, properties, attributes
- How to define attributes which bind c++ getter and setter as a JS property
- How to make a module configuration
