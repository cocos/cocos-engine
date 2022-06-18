cocos-engine native part
==========================

It is the native backend of [Cocos Creator](https://www.cocos.com/en/creator). It works on `iOS`, `Android`, `macOS` and `Windows`.

Coding format and coding style
---------------------------------

The coding format file is `.clang-format`, and the coding style fomat file is `.clang-tidy`. Please use [clang-format](https://clang.llvm.org/docs/ClangFormat.html) to format the codes and use [clang-tidy](http://clang.llvm.org/extra/index.html) to fix the coding style before commiting codes. See the [linter auto-fix guide](docs/LINTER_AUTOFIX_GUIDE.md) for more information.


Build Requirements
--------------------------------
- macOS 10.14+, Xcode 11.5+ to build mac games
- with iOS 11.0+ to build iOS games
- or Windows 7+, Visual Studio 2017 15.7+ / Visual Studio 2019 to build win64 games
- NDK 18-21 is required to build Android games (22+ is not supported)
- Cmake 3.8+ is required

C++ related
--------------------------------
- use C++17, but can only use these C++17 features
  - std::string_view
  - [constexpr if](https://www.codingame.com/playgrounds/2205/7-features-of-c17-that-will-simplify-your-code/constexpr-if)
