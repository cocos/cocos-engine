/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http =//www.cocos.com

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

#include "Debug.h"

namespace cc {
namespace debug {
const ccstd::string CONSOLE_LOG = "log";
const ccstd::string CONSOLE_WARN = "warn";
const ccstd::string CONSOLE_ERROR = "error";
const ccstd::string CONSOLE_ASSET = "assert";

const ccstd::string &getPrefixTag(DebugMode mode) {
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

ccstd::string getTypedFormatter(DebugMode mode, uint32_t id) {
    const ccstd::string &tag = getPrefixTag(mode);
    ccstd::string msg;
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

void printLog(DebugMode mode, const ccstd::string &fmt, ccstd::any *arr, int paramsLength) {
    ccstd::string msg = fmt;
    const ccstd::string &prefix = getPrefixTag(mode);
    LogLevel logLevel = getLogLevel(mode);

    size_t pos;
    for (int i = 1; i <= paramsLength; i++) {
        pos = msg.find('%');
        bool needToReplace = false;
        if (pos != ccstd::string::npos && pos != (msg.length() - 1) && (msg[pos + 1] == 'd' || msg[pos + 1] == 's' || msg[pos + 1] == 'f')) {
            needToReplace = true;
        }
        const auto &elemTypeId = arr[i].type();
        if (elemTypeId == typeid(const ccstd::string)) {
            const auto s = ccstd::any_cast<const ccstd::string>(arr[i]);
            if (needToReplace) {
                msg.replace(pos, 2, s);
            } else {
                msg += " " + s;
            }
        } else if (elemTypeId == typeid(ccstd::string)) {
            auto s = ccstd::any_cast<ccstd::string>(arr[i]);
            if (needToReplace) {
                msg.replace(pos, 2, s);
            } else {
                msg += " " + s;
            }
        } else if (elemTypeId == typeid(int)) {
            int value = ccstd::any_cast<int>(arr[i]);
            if (needToReplace) {
                msg.replace(pos, 2, std::to_string(value));
            } else {
                msg += " " + std::to_string(value);
            }
        } else if (elemTypeId == typeid(unsigned int)) {
            auto value = ccstd::any_cast<unsigned int>(arr[i]);
            if (needToReplace) {
                msg.replace(pos, 2, std::to_string(value));
            } else {
                msg += " " + std::to_string(value);
            }

        } else if (elemTypeId == typeid(float)) {
            auto value = ccstd::any_cast<float>(arr[i]);
            if (needToReplace) {
                msg.replace(pos, 2, std::to_string(value));
            } else {
                msg += " " + std::to_string(value);
            }
        } else if (elemTypeId == typeid(const char *)) {
            ccstd::string s = ccstd::any_cast<const char *>(arr[i]);
            if (needToReplace) {
                msg.replace(pos, 2, s);
            } else {
                msg += " " + s;
            }
        } else {
            CC_LOG_ERROR("DebugInfos: unsupport params data type: '%s'", elemTypeId.name());
            CC_LOG_ERROR(" fmt: \"%s\", parameter index: %d", fmt.c_str(), i);
            return;
        }
    }

    cc::Log::logMessage(cc::LogType::KERNEL, logLevel, "%s %s", prefix.c_str(), msg.c_str());
}

} // namespace debug
} // namespace cc
