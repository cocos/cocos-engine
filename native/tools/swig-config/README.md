## Introduction

From Cocos Creator 3.7.0，we switch the approach of generating JS binding code from [bindings-generator](https://github.com/cocos/cocos-engine/tree/d08a11244d2a31da1aac7af7d2aa8f1b6152e30c/native/tools/bindings-generator) to [Swig](https://www.swig.org). Swig has many benefits in generating glue code by parsing  its custom `interface` file (IDL) which is compatible with `C++`. For more about why we switch to Swig, you could refer to [the issue](https://github.com/cocos/cocos-engine/issues/10792) .

## Generate JS Binding Code for Engine

- Make sure you have installed NodeJS ( `>= v8.9.4` )

- Open Terminal ( macOS / Linux) or Command Line Tool ( Windows ), navigate to `engine/native/tools/swig-config`

- Run `node genbindings.js`

- If succeed, you'll see the text:
  
  ```
  ======================================================================
      Congratulations, JS binding code was generated successfully!
  ======================================================================
  ```

- If failed, you need to check the output and figure out whether there're some errors in `.i` files.

## Generate JS Bindings Code for Developer's Project

- Make sure you have installed NodeJS ( `>= v8.9.4` )

- Open Terminal ( macOS / Linux) or Command Line Tool ( Windows )

- Create a directory for generated code, e.g. `/Users/abc/my-project/native/engine/common/Classes/bindings/auto`

- Write a JS configuration file
  
  - Create the JS configruation file, e.g.  `/Users/abc/my-project/tools/swig-config/swig-config.js` with the following content
    
    ```js
    'use strict';
    const path = require('path');
    
    // Developer's custom module configuration
    // configList is required
    const configList = [
        [ 'your_module_interface_0.i', 'jsb_your_module_interface_0_auto.cpp' ],
        [ 'your_module_interface_1.i', 'jsb_your_module_interface_1_auto.cpp' ],
        // ......
    ];
    
    const projectRoot = path.resolve(path.join(__dirname, '..', '..'));
    // interfaceDir is optional
    const interfacesDir = path.join(projectRoot, 'tools', 'swig-config');
    // bindingsOutDir is optional
    const bindingsOutDir = path.join(projectRoot, 'native', 'engine', 'common', 'Classes', 'bindings', 'auto');
    
    module.exports = {
        interfacesDir, // optional, if it isn't exported, the items in configList should be absolute or relative to current directory of swig-config.js
        bindingsOutDir, // optional, if it isn't exported, the items in configList should be absolute or relative to current directory of swig-config.js
        configList // required
    };
    ```
  
  - Run the following command
    
    ```bash
    # If current workspace is not in '/Users/abc/my-project/tools/swig-config'
    $ node < Engine Root Path >/native/tools/swig-config/genbindings.js -c /Users/abc/my-project/tools/swig-config/swig-config.js
    ```
    
    ```bash
    # If you have already navigate to '/Users/abc/my-project/tools/swig-config' directory, you could run the command without -c argument like:
    $ cd /Users/abc/my-project/tools/swig-config
    $ node < Engine Root Path >/native/tools/swig-config/genbindings.js
    ```

## Swig Interface File

- There is a [swig-interface-template.i](swig-interface-template.i) in `engine/native/tools/swig-config` directory, just copy and rename it to some place in your project. There some comments demonstrate how to configure your module in `.i` file.  You could also reference engine internal `.i` files in `engine/native/tools/swig-config`, for instance, `scene.i` or `assets.i` for a quick start.
- If you're using `Visual Studio Code`, you could install `SWIG Language` extension which was developed by `Hong-She Liang` for highlight syntax support.
- For more details of writing `.i` file, please visit [tutorial](#Tutorial) section.

## Tutorial

Please visit [tutorial/index.md](tutorial/index.md),  which includes binding a new module in engine or user's project step by step.    
