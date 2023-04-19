/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "Log.h"

#include <cstdarg>
#include <ctime>
#include "base/std/container/string.h"
#include "base/std/container/vector.h"

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #ifndef WIN32_LEAN_AND_MEAN
        #define WIN32_LEAN_AND_MEAN
    #endif
    #include <Windows.h>

    #define COLOR_FATAL                   FOREGROUND_INTENSITY | FOREGROUND_RED
    #define COLOR_ERROR                   FOREGROUND_RED
    #define COLOR_WARN                    6
    #define COLOR_INFO                    FOREGROUND_GREEN | FOREGROUND_BLUE
    #define COLOR_DEBUG                   7
    #define COLOR_NORMAL                  8
    #define SET_CONSOLE_TEXT_COLOR(color) SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), color)

#elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include <android/log.h>
#elif CC_PLATFORM == CC_PLATFORM_OHOS
    #include <hilog/log.h>
#elif (CC_PLATFORM == CC_PLATFORM_OPENHARMONY)
    #include <hilog/log.h>
#endif

namespace cc {

#define LOG_USE_TIMESTAMP
#if (CC_DEBUG == 1)
LogLevel Log::slogLevel = LogLevel::LEVEL_DEBUG;
#else
LogLevel Log::slogLevel = LogLevel::INFO;
#endif

FILE *Log::slogFile = nullptr;
const ccstd::vector<ccstd::string> LOG_LEVEL_DESCS{"FATAL", "ERROR", "WARN", "INFO", "DEBUG"};

void Log::setLogFile(const ccstd::string &filename) {
#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    if (slogFile) {
        fclose(slogFile);
    }

    slogFile = fopen(filename.c_str(), "w");

    if (slogFile) {
        ccstd::string msg;
        msg += "------------------------------------------------------\n";

        struct tm *tm_time;
        time_t ct_time;
        time(&ct_time);
        tm_time = localtime(&ct_time);
        char dateBuffer[256] = {0};
        snprintf(dateBuffer, sizeof(dateBuffer), "LOG DATE: %04d-%02d-%02d %02d:%02d:%02d\n",
                 tm_time->tm_year + 1900,
                 tm_time->tm_mon + 1,
                 tm_time->tm_mday,
                 tm_time->tm_hour,
                 tm_time->tm_min,
                 tm_time->tm_sec);

        msg += dateBuffer;

        msg += "------------------------------------------------------\n";

        fputs(msg.c_str(), slogFile);
        fflush(slogFile);
    }
#endif
}

void Log::close() {
    if (slogFile) {
        fclose(slogFile);
        slogFile = nullptr;
    }
}

void Log::logMessage(LogType type, LogLevel level, const char *formats, ...) {
    char buff[4096];
    char *p = buff;
    char *last = buff + sizeof(buff) - 3;

#if defined(LOG_USE_TIMESTAMP)
    struct tm *tmTime;
    time_t ctTime;
    time(&ctTime);
    tmTime = localtime(&ctTime);

    p += sprintf(p, "%02d:%02d:%02d ", tmTime->tm_hour, tmTime->tm_min, tmTime->tm_sec);
#endif

    p += sprintf(p, "[%s]: ", LOG_LEVEL_DESCS[static_cast<int>(level)].c_str());

    va_list args;
    va_start(args, formats);
    // p += StringUtil::vprintf(p, last, formats, args);

    std::ptrdiff_t count = (last - p);
    int ret = vsnprintf(p, count, formats, args);
    if (ret >= count - 1) {
        p += (count - 1);
    } else if (ret >= 0) {
        p += ret;
    }

    va_end(args);

    *p++ = '\n';
    *p = 0;

    if (slogFile) {
        fputs(buff, slogFile);
        fflush(slogFile);
    }

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    WCHAR wszBuf[4096] = {0};
    MultiByteToWideChar(CP_UTF8, 0, buff, -1, wszBuf, sizeof(wszBuf));

    WORD color;
    switch (level) {
        case LogLevel::LEVEL_DEBUG: color = COLOR_DEBUG; break;
        case LogLevel::INFO: color = COLOR_INFO; break;
        case LogLevel::WARN: color = COLOR_WARN; break;
        case LogLevel::ERR: color = COLOR_ERROR; break;
        case LogLevel::FATAL: color = COLOR_FATAL; break;
        default: color = COLOR_INFO;
    }
    SET_CONSOLE_TEXT_COLOR(color);
    wprintf(L"%s", wszBuf);
    SET_CONSOLE_TEXT_COLOR(COLOR_NORMAL);

    OutputDebugStringW(wszBuf);
#elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
    android_LogPriority priority;
    switch (level) {
        case LogLevel::LEVEL_DEBUG:
            priority = ANDROID_LOG_DEBUG;
            break;
        case LogLevel::INFO:
            priority = ANDROID_LOG_INFO;
            break;
        case LogLevel::WARN:
            priority = ANDROID_LOG_WARN;
            break;
        case LogLevel::ERR:
            priority = ANDROID_LOG_ERROR;
            break;
        case LogLevel::FATAL:
            priority = ANDROID_LOG_FATAL;
            break;
        default:
            priority = ANDROID_LOG_INFO;
    }

    __android_log_write(priority, (type == LogType::KERNEL ? "Cocos" : "CocosScript"), buff);
#elif (CC_PLATFORM == CC_PLATFORM_OHOS)
    const char *typeStr = (type == LogType::KERNEL ? "Cocos %{public}s" : "CocosScript %{public}s");
    switch (level) {
        case LogLevel::LEVEL_DEBUG:
            HILOG_DEBUG(LOG_APP, typeStr, (const char *)buff);
            break;
        case LogLevel::INFO:
            HILOG_INFO(LOG_APP, typeStr, buff);
            break;
        case LogLevel::WARN:
            HILOG_WARN(LOG_APP, typeStr, buff);
            break;
        case LogLevel::ERR:
            HILOG_ERROR(LOG_APP, typeStr, buff);
            break;
        case LogLevel::FATAL:
            HILOG_FATAL(LOG_APP, typeStr, buff);
            break;
        default:
            HILOG_DEBUG(LOG_APP, typeStr, buff);
    }
#elif (CC_PLATFORM == CC_PLATFORM_OPENHARMONY)
    ::LogLevel ohosLoglevel = ::LogLevel::LOG_DEBUG;
    switch (level) {
        case LogLevel::LEVEL_DEBUG:
        ohosLoglevel = ::LogLevel::LOG_DEBUG;
        break;
        case LogLevel::INFO:
        ohosLoglevel = ::LogLevel::LOG_INFO;
        break;
        case LogLevel::WARN:
        ohosLoglevel = ::LogLevel::LOG_WARN;
        break;
        case LogLevel::ERR:
        ohosLoglevel = ::LogLevel::LOG_ERROR;
        break;
        case LogLevel::FATAL:
        ohosLoglevel = ::LogLevel::LOG_FATAL;
        break;
        default:
        ohosLoglevel = ::LogLevel::LOG_INFO;
        break;
    }
    OH_LOG_Print(LOG_APP, ohosLoglevel, LOG_DOMAIN, "HMG_LOG", "%{public}s", buff);
#else
    fputs(buff, stdout);
#endif
#if CC_REMOTE_LOG
    logRemote(buff);
#endif
}

} // namespace cc
