# What's new
* Add a prebuilt libclang 12.0 in `libclang/`for linux, mac and windows.
* If you want use the prebuilt libclang 12.0 work with Android NDK, then `only the NDK r21 can work corrently` with it.

# Requirements

* python 3.x (64-bit)
* py-yaml version 5.4.1
* cheetah3
* libclang binary files

# Usage

    Usage: generator.py [options] {configfile}

    Options:
      -h, --help   show this help message and exit
      -s SECTION   sets a specific section to be converted
      -t TARGET    specifies the target vm. Will search for TARGET.yaml

Basically, you specify a target vm (spidermonkey is the only current target vm) and the section from
the `.ini` file you want to generate code for.

### Download libclang binary files

* Download the pre-built binaries according to your platform from [here](https://github.com/llvm/llvm-project/releases/tag/llvmorg-12.0.0).
* Unzip or install binaries. For example, unzip `clang+llvm-12.0.0-x86_64-apple-darwin.tar.xz` for macOS.
* Find libclang.dll (windows) or libclang.dylib (macOS)
* Copy the dynamic library to `bindings-generator/libclang` folder.

## Run the simple test with prebuilt libclang 12.0

Included in this repository is a simple test. Use this to confirm the generator is working and that your environment is set up correctly.

#### NOTE

* The test uses the prebuilt 12.0 libclang, so you should use `Android NDK r21` or higher version.
* The test uses \<string\>; and \<stdint.h\>; so you need a C++ implementation that provides these
* Currently, the test script is setup to use the Android NDK's llvm libc++

### Mac OS X

* The OSX 10.9 has a built-in python2.7 and if your os don't have python2.7 then use [Homebrew](http://brew.sh/) to install the python and use pip install the python dependencies.
  ```bash
  brew install python
  ```

* Install python dependices by pip.
  ```bash
  sudo easy_install pip3
  sudo pip3 install PyYAML==5.4.1 Cheetah3
  ```

* Download NDK r21 from [google](https://developer.android.com/ndk/downloads/index.html)
* If you are using python installed from other way, copy user.cfg.sample and rename it as `user.cfg` then set the absolute path to  python `PYTHON_BIN` in `user.cfg`
* Run follow command, it will generate a `userconf.ini`, and check the values in it if it occorus any error.
  ```bash
  export NDK_ROOT=/path/to/android-ndk-r21
  ./test.sh
  ```
### Windows 7 64bit
* Download python3 (`64bit`) from (https://www.python.org).
* Add the installed path of python (e.g. C:\Python39) to PATH environment variable, if not already added in the installer.
* Install python dependices by pip.
  ```bash
  python -m pip install PyYAML==5.4.1 Cheetah3
  ```
* Download NDK r21 or above from [google](https://developer.android.com/ndk/downloads/index.html)
* Set the environment variables (`PYTHON_ROOT` and `NDK_ROOT`) or just them in `test.bat`.
* Run "test.bat". The generated codes will be under "simple_test_bindings".

### Expected output

Upon running the test you might see some warnings but should not see any errors.

The test will create a directory named simple_test_bindings that contains 3 files

* A .hpp header file for the bindings class
* A .cpp file implementing the bindings class
* A .js file that documents how to call (from JavaScript) the methods the C++ class exposes

# The `.ini` file

The `.ini` file is a simple text file specifying the settings for the code generator. Here's the
default one, used for cocos2d-x

    [cocos2d-x]
    prefix = cocos2dx
    events  = CCNode#onEnter CCNode#onExit
    extra_arguments = -I../../cocos2dx/include -I../../cocos2dx/platform -I../../cocos2dx/platform/ios -I../../cocos2dx -I../../cocos2dx/kazmath/include -arch i386 -DTARGET_OS_IPHONE -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneSimulator.platform/Developer/SDKs/iPhoneSimulator5.1.sdk -x c++
    headers = ../../cocos2dx/include/cocos2d.h
    classes = CCSprite
    functions = my_free_function

## Required sections

* prefix: the prefix for the project. Must be a valid identifier for the language of the target vm.
  Most of the time, the name will be intermixed between the class name and the function name, since
  all generated (probably) will be free functions, we do that in order to avoid name collition. The
  script will generate ${prefix}.cpp and ${prefix}.hpp as a result.
* events: a list of identifiers in the form of ClassName#functionName that are events to be called
  from the native world to the target vm.
* extra_arguments: extra arguments to pass to the clang interface. Basically you can think of this
  as the arguments to pass to the "compiler", so add as many as you need here. If you're targetting
  C++, make sure you add "-x c++" as the last argument to force C++ mode on a ".h" file. Otherwise,
  name your header files as ".hpp".
* headers: list of headers to parse. Usually you add a single header that in turn `#include`s the
  rest of the files.
* classes: the classes that will be parsed. Right not is just a string, but it will accept regular
  expressions
* functions: space-separated list of free functions to be binded. Same as with classes, it will
  support regular expressions.
* skip: a space-separated list of `Classes::functions` or just `functions` to not generate any code.

# The templates

The generator is using [Cheetah templates](http://www.cheetahtemplate.org/) to create a more
flexible generator. The way it was thought, is that for every target environment, you should provide
with a way to generate the same C/C++ functionality. Every template has access to the proper meta
information for the code or generator (function, classes, etc.)

Right now it's separated in the following set of templates:

* prelude.c/.h: The header of the generated files.
* ifunction.c/.h: The template for an instance function
* ifunction_overloaded.c: The template for the implementation of an overloaded function. An
  overloaded function is exactly the same as a function, but it has an array of functions sharing
  the same name. The current implementation for spidermonkey only works if the overloading is with
  different number of arguments.
* sfunction.c/.h: The template for a static function
* sfunction_overloaded.c: The template for an overloaded static function
* register.c: Here you should add the constructor/finalizer, the registration function (if needed)
  and the footer of the header file. This is the last chunk being generated

Templates are stored in the `templates/${target}` directory and follow the naming specified above.

One final part of the puzzle is the `${target}.yaml` file, that contains specific type conversion
snippets to be used by the templates. For instance, for spidermonkey, this is the place where we
specify the conversion routines for the native types (to and from int, float, string, etc.)

# Limitations

Currently the generator is leveraging clang in order to get information about the C/C++ code, so we
can only get as much information as clang give us. Known list of things that won't work:

* variable number of arguments. Solution: write a manual wrapper
