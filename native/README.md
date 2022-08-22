cocos-engine native part
==========================

It is the native backend of [Cocos Creator](https://www.cocos.com/en/creator). It works on `iOS`, `Android`, `macOS` and `Windows`.

Coding format and coding style
---------------------------------

The coding format file is `.clang-format`, and the coding style format file is `.clang-tidy`. Please use [clang-format](https://clang.llvm.org/docs/ClangFormat.html) to format the codes and use [clang-tidy](http://clang.llvm.org/extra/index.html) to fix the coding style before committing codes. See the [linter auto-fix guide](docs/LINTER_AUTOFIX_GUIDE.md) for more information.


Build Requirements
--------------------------------
- Xcode 11.5+ to build mac games
- or Visual Studio 2017 15.7+ / Visual Studio 2019 to build win64 games
- NDK 21-22 is required to build Android games (23+ is not supported)
- Cmake 3.8+ is required

System Requirements
--------------------------------
- macOS 10.14+
- iOS 11.0+
- iOS Simulator 13.0+
- 64-bit Windows 7+ 
  - with vulkan 1.0 to 1.2 if want to run with vulkan
- Android 4.4+
  - Android 7+ if want to run with vulkan

C++ related
--------------------------------
- use C++17, but can only use these C++17 features
  - std::string_view
  - [constexpr if](https://www.codingame.com/playgrounds/2205/7-features-of-c17-that-will-simplify-your-code/constexpr-if)
