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

#pragma once

#include "Macros.h"
#include "base/std/container/string.h"

namespace cc {

enum class LogType {
    KERNEL,
    SCRIPT,
    COUNT,
};

enum class LogLevel {
    FATAL,
    ERR,
    WARN,
    INFO,
    LEVEL_DEBUG, // DEBUG is a macro on windows, so use LEVEL_DEBUG instead.
    COUNT,
};

class CC_DLL Log {
public:
    static LogLevel slogLevel; // for read only

    static inline void setLogLevel(LogLevel level) { slogLevel = level; }
    static inline FILE *getLogFile() { return slogFile; }
    static void setLogFile(const ccstd::string &filename);
    static void close();
    static void logMessage(LogType type, LogLevel level, const char *formats, ...);

private:
    static void logRemote(const char *msg);
    static FILE *slogFile;
};

} // namespace cc

#define CC_LOG_DEBUG(formats, ...) \
    if (cc::Log::slogLevel >= cc::LogLevel::LEVEL_DEBUG) cc::Log::logMessage(cc::LogType::KERNEL, cc::LogLevel::LEVEL_DEBUG, formats, ##__VA_ARGS__)
#define CC_LOG_INFO(formats, ...) \
    if (cc::Log::slogLevel >= cc::LogLevel::INFO) cc::Log::logMessage(cc::LogType::KERNEL, cc::LogLevel::INFO, formats, ##__VA_ARGS__)
#define CC_LOG_WARNING(formats, ...) \
    if (cc::Log::slogLevel >= cc::LogLevel::WARN) cc::Log::logMessage(cc::LogType::KERNEL, cc::LogLevel::WARN, formats, ##__VA_ARGS__)
#define DO_CC_LOG_ERROR(formats, ...) \
    if (cc::Log::slogLevel >= cc::LogLevel::ERR) cc::Log::logMessage(cc::LogType::KERNEL, cc::LogLevel::ERR, formats, ##__VA_ARGS__)
#define CC_LOG_FATAL(formats, ...) \
    if (cc::Log::slogLevel >= cc::LogLevel::FATAL) cc::Log::logMessage(cc::LogType::KERNEL, cc::LogLevel::FATAL, formats, ##__VA_ARGS__)

#define CC_LOG_ERROR(formats, ...)                                        \
    do {                                                                  \
        DO_CC_LOG_ERROR("[ERROR] file %s: line %d ", __FILE__, __LINE__); \
        DO_CC_LOG_ERROR(formats, ##__VA_ARGS__);                          \
    } while (0)
