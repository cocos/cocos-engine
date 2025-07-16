/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#ifndef __SIMULATOR_CONFIG_H_
#define __SIMULATOR_CONFIG_H_

#include <string>
#include <vector>

using namespace std;

#include "SimulatorExport.h"
#include "cocos/math/Geometry.h"

#if defined(_WINDOWS)
    #define DIRECTORY_SEPARATOR      "\\"
    #define DIRECTORY_SEPARATOR_CHAR '\\'
#else
    #define DIRECTORY_SEPARATOR      "/"
    #define DIRECTORY_SEPARATOR_CHAR '/'
#endif

typedef struct _SimulatorScreenSize {
    string title;
    int width;
    int height;

    _SimulatorScreenSize(const string &title_, int width_, int height_) {
        title = title_;
        width = width_;
        height = height_;
    }
} SimulatorScreenSize;

typedef vector<SimulatorScreenSize> ScreenSizeArray;
typedef ScreenSizeArray::iterator ScreenSizeArrayIterator;

class CC_LIBSIM_DLL SimulatorConfig {
public:
    static SimulatorConfig *getInstance();

    // predefined screen size
    int getScreenSizeCount() const;
    SimulatorScreenSize getScreenSize(int index) const;
    int checkScreenSize(const cc::Size &size) const;

    // helper
    static void makeNormalizePath(string *path, const char *directorySeparator = NULL);

private:
    SimulatorConfig();

    static SimulatorConfig *_instance;

    ScreenSizeArray _screenSizeArray;
};

#endif // __SIMULATOR_CONFIG_H_
