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

#pragma once

#include "base/Log.h"
#include "base/std/any.h"
#include "base/std/container/string.h"
#include "core/builtin/DebugInfos.h"

namespace cc {
namespace debug {

const ccstd::string ERROR_MAP_URL{"https://github.com/cocos-creator/engine/blob/3d/EngineErrorMap.md"};

enum class DebugMode {

    /**
     * @en The debug mode none.
     * @zh 禁止模式，禁止显示任何日志消息。
     */
    NONE = 0,

    /**
     * @en The debug mode none.
     * @zh 调试模式，显示所有日志消息。
     */
    VERBOSE = 1,

    /**
     * @en Information mode, which display messages with level higher than "information" level.
     * @zh 信息模式，显示“信息”级别以上的日志消息。
     */
    INFO = 2,

    /**
     * @en Information mode, which display messages with level higher than "warning" level.
     * @zh 警告模式，显示“警告”级别以上的日志消息。
     */
    WARN = 3,

    /**
     * @en Information mode, which display only messages with "error" level.
     * @zh 错误模式，仅显示“错误”级别的日志消息。
     */
    ERROR_MODE = 4, // ERROR has been defined by MACRO

    /**
     * @en The debug mode info for web page.
     * @zh 信息模式（仅 WEB 端有效），在画面上输出所有信息。
     */
    INFO_FOR_WEB_PAGE = 5,

    /**
     * @en The debug mode warn for web page.
     * @zh 警告模式（仅 WEB 端有效），在画面上输出 warn 级别以上的（包含 error）信息。
     */
    WARN_FOR_WEB_PAGE = 6,

    /**
     * @en The debug mode error for web page.
     * @zh 错误模式（仅 WEB 端有效），在画面上输出 error 信息。
     */
    ERROR_FOR_WEB_PAGE = 7,
};

/**
 * @en Outputs a message to the Cocos Creator Console (editor) or Web Console (runtime).
 * @zh 输出一条消息到 Cocos Creator 编辑器的 Console 或运行时 Web 端的 Console 中。
 * @param message - A JavaScript string containing zero or more substitution strings.
 * @param optionalParams - JavaScript objects with which to replace substitution strings within msg.
 * This gives you additional control over the format of the output.
 */

template <typename... Args>
void log(ccstd::any message, Args... optionalParams);

/**
 * @en
 * Outputs a warning message to the Cocos Creator Console (editor) or Web Console (runtime).
 * - In Cocos Creator, warning is yellow.
 * - In Chrome, warning have a yellow warning icon with the message text.
 * @zh
 * 输出警告消息到 Cocos Creator 编辑器的 Console 或运行时 Web 端的 Console 中。<br/>
 * - 在 Cocos Creator 中，警告信息显示是黄色的。<br/>
 * - 在 Chrome 中，警告信息有着黄色的图标以及黄色的消息文本。<br/>
 * @param message - A JavaScript string containing zero or more substitution strings.
 * @param optionalParams - JavaScript objects with which to replace substitution strings within msg.
 * This gives you additional control over the format of the output.
 */
template <typename... Args>
void warn(ccstd::any message, Args... optionalParams);

/**
 * @en
 * Outputs an error message to the Cocos Creator Console (editor) or Web Console (runtime).<br/>
 * - In Cocos Creator, error is red.<br/>
 * - In Chrome, error have a red icon along with red message text.<br/>
 * @zh
 * 输出错误消息到 Cocos Creator 编辑器的 Console 或运行时页面端的 Console 中。<br/>
 * - 在 Cocos Creator 中，错误信息显示是红色的。<br/>
 * - 在 Chrome 中，错误信息有红色的图标以及红色的消息文本。<br/>
 * @param message - A JavaScript string containing zero or more substitution strings.
 * @param optionalParams - JavaScript objects with which to replace substitution strings within msg.
 * This gives you additional control over the format of the output.
 */
template <typename... Args>
void error(ccstd::any message, Args... optionalParams);

/**
 * @en
 * Assert the condition and output error messages if the condition is not true.
 * @zh
 * 对检查测试条件进行检查，如果条件不为 true 则输出错误消息
 * @param value - The condition to check on
 * @param message - A JavaScript string containing zero or more substitution strings.
 * @param optionalParams - JavaScript objects with which to replace substitution strings within msg.
 * This gives you additional control over the format of the output.
 */

template <typename... Args>
void _assert(ccstd::any value, ccstd::string message, Args... optionalParams); // NOLINT //assert is a reserved word

/**
 * @en Outputs a message at the "debug" log level.
 * @zh 输出一条“调试”日志等级的消息。
 */
template <typename... Args>
void debug(Args... data);

void resetDebugSetting(DebugMode mode);

/**
 * @en Gets error message with the error id and possible parameters.
 * @zh 通过 error id 和必要的参数来获取错误信息。
 */
template <typename... Args>
ccstd::string getError(uint32_t errorId, Args... param);

/**
 * @en Returns whether or not to display the FPS and debug information.
 * @zh 是否显示 FPS 信息和部分调试信息。
 */
bool isDisplayStats();

/**
 * @en Sets whether display the FPS and debug informations on the bottom-left corner.
 * @zh 设置是否在左下角显示 FPS 和部分调试。
 */

void setDisplayStats(bool displayStats);

ccstd::string getTypedFormatter(DebugMode mode, uint32_t id);

const ccstd::string &getPrefixTag(DebugMode mode);

LogLevel getLogLevel(DebugMode mode);

template <typename T>
T unpackParams(T value) {
    return value;
}

void printLog(DebugMode mode, const ccstd::string &fmt, ccstd::any *arr, int paramsLength);

template <typename... Args>
void logID(uint32_t id, Args... optionalParams) {
    ccstd::string msg = getTypedFormatter(DebugMode::VERBOSE, id);
    int size = sizeof...(optionalParams);
    ccstd::any arr[] = {0, unpackParams(optionalParams)...};
    printLog(DebugMode::VERBOSE, msg, arr, size);
}

template <typename... Args>
void warnID(uint32_t id, Args... optionalParams) {
    ccstd::string msg = getTypedFormatter(DebugMode::WARN, id);
    int size = sizeof...(optionalParams);
    ccstd::any arr[] = {0, unpackParams(optionalParams)...};
    printLog(DebugMode::WARN, msg, arr, size);
}

template <typename... Args>
void errorID(uint32_t id, Args... optionalParams) {
    ccstd::string msg = getTypedFormatter(DebugMode::ERROR_MODE, id);
    int size = sizeof...(optionalParams);
    ccstd::any arr[] = {0, unpackParams(optionalParams)...};
    printLog(DebugMode::ERROR_MODE, msg, arr, size);
}

template <typename... Args>
void assertID(bool condition, uint32_t id, Args... optionalParams) {
    if (condition) {
        return;
    }
    ccstd::string msg = getTypedFormatter(DebugMode::INFO, id);
    int size = sizeof...(optionalParams);
    ccstd::any arr[] = {0, unpackParams(optionalParams)...};
    printLog(DebugMode::INFO, msg, arr, size);
    CC_ABORT();
}

void _throw(); // NOLINT // throw is a reserved word
} // namespace debug

} // namespace cc
