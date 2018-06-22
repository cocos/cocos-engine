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

#include "base/ccUtils.h"
#include "base/base64.h"
#include "platform/CCFileUtils.h"

#include <cmath>
#include <stdlib.h>

NS_CC_BEGIN

namespace
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include "platform/CCStdC.h"
    int gettimeofday(struct timeval * val, void *)
    {
        if (val)
        {
            LARGE_INTEGER liTime, liFreq;
            QueryPerformanceFrequency(&liFreq);
            QueryPerformanceCounter(&liTime);
            val->tv_sec = (long)(liTime.QuadPart / liFreq.QuadPart);
            val->tv_usec = (long)(liTime.QuadPart * 1000000.0 / liFreq.QuadPart - val->tv_sec * 1000000.0);
        }
        return 0;
    }
#endif
}

namespace utils
{

#define MAX_ITOA_BUFFER_SIZE 256
double atof(const char* str)
{
    if (str == nullptr)
    {
        return 0.0;
    }
    
    char buf[MAX_ITOA_BUFFER_SIZE];
    strncpy(buf, str, MAX_ITOA_BUFFER_SIZE);
    
    // strip string, only remain 7 numbers after '.'
    char* dot = strchr(buf, '.');
    if (dot != nullptr && dot - buf + 8 <  MAX_ITOA_BUFFER_SIZE)
    {
        dot[8] = '\0';
    }
    
    return ::atof(buf);
}

double gettime()
{
    struct timeval tv;
    gettimeofday(&tv, nullptr);

    return (double)tv.tv_sec + (double)tv.tv_usec/1000000;
}

long long getTimeInMilliseconds()
{
    struct timeval tv;
    gettimeofday (&tv, nullptr);
    return (long long)tv.tv_sec * 1000 + tv.tv_usec / 1000;
}

int nextPOT(int x)
{
    x = x - 1;
    x = x | (x >> 1);
    x = x | (x >> 2);
    x = x | (x >> 4);
    x = x | (x >> 8);
    x = x | (x >> 16);
    return x + 1;
}

}

NS_CC_END
