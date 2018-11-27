Cocos2d-x, compact version
==========================

<a href="https://travis-ci.org/cocos-creator/cocos2d-x-lite"><img src="https://travis-ci.org/cocos-creator/cocos2d-x-lite.svg?branch=develop " alt="Build Status"></a>

It is based on [cocos2d-x](https://github.com/cocos2d/cocos2d-x)[version 3.9], but remove 3D and other features. It works on iOS,OS X, Android and Windows.

------------------------------------------------

The major change:

- Remove 3D features
  - Sprite3D
  - Skybox
  - Terrain
  - Light
  - Navmesh
  - Physics3D
  - BillBoard
  - Animate3D
  - Bundle3D
  - MeshSkin
  - etc..

- Only support iOS, macOS, Android and Windows.
- Remove support for LUA script
- Remove deprecated classes and functions
- Remove Camera
- Remove Physics integration
- Using FastTileMap instead of TileMap
- Remove C++ implementations of CocoStudio parser
- Remove C++ implementations of CocosBuilder parser
- Remove AssetsManager, AssetsManagerEX
- Remove Allocator
- Remove AutoPolygon
- Remove support for WebP, S3TC, ATITC
- Remove support for game controller
- Improved robustness and many bugs have been fixed

Git user attention
-----------------------

1. Clone the repo from GitHub.

       $ git clone https://github.com/cocos-creator/cocos2d-x-lite.git

2. After cloning the repo, please execute `download-deps.py` to download and install dependencies.

       $ cd cocos2d-x-lite
       $ python download-deps.py

3. After running `download-deps.py`.

       $ git submodule update --init

4. Build simulator

       $ npm install
       $ gulp gen-simulator
       $ gulp update-simulator-config

    If you need to debug the simulator on macOS, you should sign the "./simulator/mac/simulator.app" by using `codesign` after build, or manually build the simulator project ("./tools/simulator/frameworks/runtime-src/proj.ios_mac/simulator.xcodeproj") in Xcode and enable Signing.
    ![](https://user-images.githubusercontent.com/1503156/32046986-3ab1f0b6-ba0a-11e7-9c7f-7fe0a385d338.png)

Contributing to the Project
--------------------------------

cocos2d-x-lite is licensed under the [MIT License](https://opensource.org/licenses/MIT). We welcome participation!
