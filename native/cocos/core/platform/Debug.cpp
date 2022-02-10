/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

 http =//www.cocos.com

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

#include "Debug.h"

namespace cc {
namespace debug {
const std::string CONSOLE_LOG   = "log";
const std::string CONSOLE_WARN  = "warn";
const std::string CONSOLE_ERROR = "error";
const std::string CONSOLE_ASSET = "assert";

const std::string &getPrefixTag(DebugMode mode) {
    switch (mode) {
        case DebugMode::VERBOSE:
            return CONSOLE_LOG;
        case DebugMode::WARN:
            return CONSOLE_WARN;
        case DebugMode::ERROR_MODE:
            return CONSOLE_ERROR;
        default:
            return CONSOLE_ASSET;
    }
}

LogLevel getLogLevel(DebugMode mode) {
    switch (mode) {
        case DebugMode::VERBOSE:
            return LogLevel::LEVEL_DEBUG;
        case DebugMode::WARN:
            return LogLevel::WARN;
        case DebugMode::ERROR_MODE:
            return LogLevel::ERR;
        default:
            return LogLevel::FATAL;
    }
}

std::string getTypedFormatter(DebugMode mode, uint32_t id) {
    const std::string &tag = getPrefixTag(mode);
    std::string       msg;
#if CC_DEBUG > 0
    if (debugInfos.find(id) == debugInfos.end()) {
        msg = "unknown id";
    } else {
        msg = debugInfos[id];
    }
#else
    char szTmp[1024] = {0};
    snprintf(szTmp, sizeof(szTmp), "%s %d, please go to %s#%d to see details.", tag.c_str(), id, ERROR_MAP_URL.c_str(), id);
    msg = szTmp;
#endif

    return msg;
}

void printLog(DebugMode mode, const std::string &fmt, cc::any *arr, int paramsLength) {
    std::string        msg      = fmt;
    const std::string &prefix   = getPrefixTag(mode);
    LogLevel           logLevel = getLogLevel(mode);

    size_t pos;
    for (int i = 1; i <= paramsLength; i++) {
        pos                = msg.find('%');
        bool needToReplace = false;
        if (pos != std::string::npos && pos != (msg.length() - 1) && (msg[pos + 1] == 'd' || msg[pos + 1] == 's' || msg[pos + 1] == 'f')) {
            needToReplace = true;
        }

        if (arr[i].type() == typeid(const std::string)) {
            const std::string s = cc::any_cast<const std::string>(arr[i]);
            if (needToReplace) {
                msg.replace(pos, 2, s);
            } else {
                msg += " " + s;
            }
        } else if (arr[i].type() == typeid(std::string)) {
            std::string s = cc::any_cast<std::string>(arr[i]);
            if (needToReplace) {
                msg.replace(pos, 2, s);
            } else {
                msg += " " + s;
            }
        } else if (arr[i].type() == typeid(int)) {
            int value = cc::any_cast<int>(arr[i]);
            if (needToReplace) {
                msg.replace(pos, 2, std::to_string(value));
            } else {
                msg += " " + std::to_string(value);
            }
        } else if (arr[i].type() == typeid(float)) {
            auto value = cc::any_cast<float>(arr[i]);
            if (needToReplace) {
                msg.replace(pos, 2, std::to_string(value));
            } else {
                msg += " " + std::to_string(value);
            }
        } else if (arr[i].type() == typeid(const char *)) {
            std::string s = cc::any_cast<const char *>(arr[i]);
            if (needToReplace) {
                msg.replace(pos, 2, s);
            } else {
                msg += " " + s;
            }
        } else {
            CC_LOG_ERROR("unsupport params data type");
            return;
        }
    }

    cc::Log::logMessage(cc::LogType::KERNEL, logLevel, "%s %s", prefix.c_str(), msg.c_str());
}

} // namespace debug
} //namespace cc