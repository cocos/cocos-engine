engine-native
==========================

<a href="https://travis-ci.org/cocos-creator/engine-native"><img src="https://travis-ci.org/cocos-creator/engine-native.svg?branch=develop " alt="Build Status"></a>

It is the native backend of [Cocos Creator](https://www.cocos.com/en/creator). It works on `iOS`, `Android`, `Mac OS` and `Windows`.

Coding format and coding style
---------------------------------

The coding format file is `.clang-format`, and the coding style fomat file is `.clang-tidy`. Please use [clang-format](https://clang.llvm.org/docs/ClangFormat.html) to format the codes and use [clang-tidy](http://clang.llvm.org/extra/index.html) to fix the coding style before commiting codes. See the [linter auto-fix guide](docs/LINTER_AUTOFIX_GUIDE.md) for more information.

Documentations
--------------------------------
* [Online documentation](https://docs.cocos.com/creator/3.0/manual/en/)

How to start a new game
--------------------------------
You can refer to [the documentation](https://docs.cocos.com/creator/3.0/manual/en/getting-started/) to start a new game.

Build Requirements
--------------------------------
- macOS 10.14+, Xcode 11.5+ to build mac games
- with iOS 12.0+ to build iOS games
- or Windows 7+, Visual Studio 2017 15.7+ / Visual Studio 2019 to build win32 games
- NDK 18-21 is required to build Android games (22+ is not supported)
- Python 2.7+ (includes Python 3) is needed to run scripts
- Cmake 3.8+ is required

Where to get help
--------------------------------

* [English Forum](https://discuss.cocos2d-x.org/)
* [Twitter](http://www.twitter.com/cocos2dx)
* [中文社区](https://forum.cocos.org/c/Creator/58)

Contributing to the Project
--------------------------------

engine-native is licensed under the [MIT License](https://opensource.org/licenses/MIT). We welcome participation!
