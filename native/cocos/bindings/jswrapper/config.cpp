/****************************************************************************
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

#include "config.h"
#include <algorithm>
#include <cstdio>

#if defined(_WIN32) && defined(_WINDOWS)

    #include <windows.h>

static void _winLog(FILE *fp, const char *format, va_list args) {
    static const int MAX_LOG_LENGTH = 16 * 1024;
    int              bufferSize     = MAX_LOG_LENGTH;
    char *           buf            = nullptr;

    do {
        buf = new (std::nothrow) char[bufferSize];
        if (buf == nullptr)
            return; // not enough memory

        int ret = vsnprintf(buf, bufferSize - 3, format, args);
        if (ret < 0) {
            bufferSize *= 2;

            delete[] buf;
        } else
            break;

    } while (true);

    int   pos                         = 0;
    auto  len                         = static_cast<int>(strlen(buf));
    char  tempBuf[MAX_LOG_LENGTH + 1] = {0};
    WCHAR wszBuf[MAX_LOG_LENGTH + 1]  = {0};

    do {
        std::copy(buf + pos, buf + pos + MAX_LOG_LENGTH, tempBuf);

        tempBuf[MAX_LOG_LENGTH] = 0;

        MultiByteToWideChar(CP_UTF8, 0, tempBuf, -1, wszBuf, sizeof(wszBuf));
        OutputDebugStringW(wszBuf);
        WideCharToMultiByte(CP_ACP, 0, wszBuf, -1, tempBuf, sizeof(tempBuf), nullptr, FALSE);

        fprintf(fp, "%s", tempBuf);
        fflush(fp);

        pos += MAX_LOG_LENGTH;

    } while (pos < len);

    fflush(stdout);
    delete[] buf;
}

void seLogD(const char *format, ...) {
    va_list args;
    va_start(args, format);
    _winLog(stdout, format, args);
    va_end(args);
}

void seLogE(const char *format, ...) {
    va_list args;
    va_start(args, format);
    _winLog(stderr, format, args);
    va_end(args);
}

#endif // #if defined(_WIN32) && defined(_WINDOWS)
