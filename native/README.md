Cocos2d-x, compact version
==========================

<a href="https://travis-ci.org/cocos-creator/cocos2d-x-lite"><img src="https://travis-ci.org/cocos-creator/cocos2d-x-lite.svg?branch=develop " alt="Build Status"></a>

It is based on [cocos2d-x](https://github.com/cocos2d/cocos2d-x)[version 3.9], but remove 3D and other features. It works on iOS,OS X,Android and Windows.

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

- Only support iOS,OS X,Android and Windows.
- Remove support for LUA script（It's temporary）
- Remove deprecated classes and functions
- Remove Camera
- Remove Physics integration
- Using FastTileMap instead of TileMap
- Remove C++ implementations of CocoStudio parser
- Remove C++ implementations of CocosBuilder parser
- Remove AssetsManager,AssetsManagerEX
- Remove Allocator
- Remove AutoPolygon
- Remove support for WebP,S3TC,ATITC
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
       $ gulp sign-simulator
       $ gulp gen-simulator
       $ gulp update-simulator-config

    `gulp sign-simulator` only need to run on Mac. It can help you to sign the simulator project in "tools/simulator/frameworks/runtime-src/proj.ios_mac/simulator.xcodeproj", so you can debug the simulator on Mac. This command will open the XCode project in the background. Then you should set the signing manually, and close XCode to make it finished. If you don't want to sign it, just close XCode directly. You need to rerun this command once the project is changed.
    ![](https://user-images.githubusercontent.com/1503156/32046986-3ab1f0b6-ba0a-11e7-9c7f-7fe0a385d338.png)


5. Build prebuilt library

       $ gulp gen-libs

Contributing to the Project
--------------------------------

cocos2d-x-lite is licensed under the [MIT License](https://opensource.org/licenses/MIT). We welcome participation!
