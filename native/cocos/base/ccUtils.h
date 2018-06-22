/****************************************************************************
Copyright (c) 2010      cocos2d-x.org
Copyright (c) 2013-2016 Chukong Technologies Inc.
Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
#pragma once

#include <vector>
#include <string>
#include "base/ccMacros.h"

/** @file ccUtils.h
Misc free functions
*/

NS_CC_BEGIN

namespace
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include <winsock.h>
    extern "C" int gettimeofday(struct timeval * val, void *);
#endif
}
/*
utils::nextPOT function is licensed under the same license that is used in Texture2D.m.
*/

/** Returns the Next Power of Two value.

Examples:
- If "value" is 15, it will return 16.
- If "value" is 16, it will return 16.
- If "value" is 17, it will return 32.
@param value The value to get next power of two.
@return Returns the next power of two value.
@since v0.99.5
*/

namespace utils
{
    CC_DLL int nextPOT(int x);
    /** Same to ::atof, but strip the string, remain 7 numbers after '.' before call atof.
     * Why we need this? Because in android c++_static, atof ( and std::atof ) is unsupported for numbers have long decimal part and contain
     * several numbers can approximate to 1 ( like 90.099998474121094 ), it will return inf. This function is used to fix this bug.
     * @param str The string be to converted to double.
     * @return Returns converted value of a string.
     */
    CC_DLL double  atof(const char* str);

    /** Get current exact time, accurate to nanoseconds.
     * @return Returns the time in seconds since the Epoch.
     */
    CC_DLL double  gettime();

    /**
     * Get current time in milliseconds, accurate to nanoseconds
     *
     * @return  Returns the time in milliseconds since the Epoch.
     */
    CC_DLL long long  getTimeInMilliseconds();
}

NS_CC_END

