/*
 Copyright (c) 2018-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
*/

import { EDITOR, JSB, DEV, DEBUG } from 'internal:constants';
import debugInfos from '../../../DebugInfos';
import { legacyCC, ccwindow } from '../global-exports';

const ccdocument = ccwindow.document;

const ERROR_MAP_URL = 'https://github.com/cocos-creator/engine/blob/develop/EngineErrorMap.md';

export type StringSubstitution = number | string;

// The html element displays log in web page (DebugMode.INFO_FOR_WEB_PAGE)
let logList: HTMLTextAreaElement | null = null;

let ccLog = console.log.bind(console);

let ccWarn = ccLog;

let ccError = ccLog;

let ccAssert = (condition: boolean, message?: string, ...optionalParams: StringSubstitution[]): void => {
    if (!condition) {
        console.log(`ASSERT: ${formatString(message, ...optionalParams)}`);
    }
};

let ccDebug = ccLog;

/**
 * Constructs a string from a sequence of js object arguments.
 */
function formatString (...data: unknown[]): string {
    return legacyCC.js.formatStr.apply(null, data) as string;
}

/**
 * @en Outputs a log message to the console. The message may be a single string (with optional substitution values), or it may be any one or more JavaScript objects.
 * @zh 向控制台输出一条日志信息。这条信息可能是单个字符串（包括可选的替代字符串），也可能是一个或多个对象。
 */
export function log (...data: unknown[]): void {
    return ccLog(...data);
}

/**
 * @en
 * Outputs a warning message to the console. The message may be a single string (with optional substitution values), or it may be any one or more JavaScript objects.
 * - In Cocos Creator, warning is yellow.
 * - In Chrome, warning have a yellow warning icon with the message text.
 * @zh
 * 向控制台输出一条警告信息。这条信息可能是单个字符串（包括可选的替代字符串），也可能是一个或多个对象。
 * - 在 Cocos Creator 中，警告信息显示是黄色的。<br/>
 * - 在 Chrome 中，警告信息有着黄色的图标以及黄色的消息文本。<br/>
 */
export function warn (...data: unknown[]): void {
    return ccWarn(...data);
}

/**
 * @en
 * Outputs an error message to the console. The message may be a single string (with optional substitution values), or it may be any one or more JavaScript objects.
 * - In Cocos Creator, error is red.<br/>
 * - In Chrome, error have a red icon along with red message text.<br/>
 * @zh
 * 向控制台输出一条错误信息。这条信息可能是单个字符串（包括可选的替代字符串），也可能是一个或多个对象。
 * - 在 Cocos Creator 中，错误信息显示是红色的。<br/>
 * - 在 Chrome 中，错误信息有红色的图标以及红色的消息文本。<br/>
 */
export function error (...data: unknown[]): void {
    return ccError(...data);
}

/**
 * @en
 * Assert the condition and output error messages if the condition is not true.
 * @zh
 * 对检查测试条件进行检查，如果条件不为 true 则输出错误消息
 * @param condition @zh 需要检查的条件。 @en The condition to check on.
 * @param message @zh 包含零个或多个需要替换的JavaScript字符串。@en JavaScript objects to replace substitution strings in msg.
 * @param optionalParams  @zh 用来替换在message中需要替换的JavaScript对象。@en JavaScript objects with which to replace substitution strings within msg.
 * This gives you additional control over the format of the output.
 */
export function assert (condition: boolean, message?: string, ...optionalParams: StringSubstitution[]): asserts condition {
    return ccAssert(condition, message, ...optionalParams);
}

/**
 * @en Outputs a message at the "debug" log level.
 * @zh 输出一条“调试”日志等级的消息。
 * @param data @zh 输出的消息对象。 @en The output message object.
 */
export function debug (...data: unknown[]): void {
    return ccDebug(...data);
}

/**
 * @engineInternal
 */
export function _resetDebugSetting (mode: DebugMode): void {
    // reset
    ccLog = ccWarn = ccError = ccAssert = ccDebug = (): void => {
    };

    if (mode === DebugMode.NONE) {
        return;
    }

    if (mode > DebugMode.ERROR) {
        // Log to web page.
        const logToWebPage = (msg: string): void => {
            if (!legacyCC.game.canvas) {
                return;
            }

            if (!logList) {
                const logDiv = ccdocument.createElement('Div');
                logDiv.setAttribute('id', 'logInfoDiv');
                logDiv.setAttribute('width', '200');
                logDiv.setAttribute('height', legacyCC.game.canvas.height);
                const logDivStyle = logDiv.style;
                logDivStyle.zIndex = '99999';
                logDivStyle.position = 'absolute';
                logDivStyle.top = logDivStyle.left = '0';

                logList = ccdocument.createElement('textarea');
                logList.setAttribute('rows', '20');
                logList.setAttribute('cols', '30');
                logList.setAttribute('disabled', 'true');
                const logListStyle = logList.style;
                logListStyle.backgroundColor = 'transparent';
                logListStyle.borderBottom = '1px solid #cccccc';
                logListStyle.borderTopWidth = logListStyle.borderLeftWidth = logListStyle.borderRightWidth = '0px';
                logListStyle.borderTopStyle = logListStyle.borderLeftStyle = logListStyle.borderRightStyle = 'none';
                logListStyle.padding = '0px';
                logListStyle.margin = '0px';

                logDiv.appendChild(logList);
                legacyCC.game.canvas.parentNode.appendChild(logDiv);
            }

            logList.value = `${logList.value + msg}\r\n`;
            logList.scrollTop = logList.scrollHeight;
        };

        ccError = (...data: unknown[]): void => {
            logToWebPage(`ERROR :  ${formatString(...data)}`);
        };
        ccAssert = (condition: boolean, message?: unknown, ...optionalParams: unknown[]): void => {
            if (!condition) {
                logToWebPage(`ASSERT: ${formatString(message, ...optionalParams)}`);
            }
        };
        if (mode !== DebugMode.ERROR_FOR_WEB_PAGE) {
            ccWarn = (...data: unknown[]): void => {
                logToWebPage(`WARN :  ${formatString(...data)}`);
            };
        }
        if (mode === DebugMode.INFO_FOR_WEB_PAGE) {
            ccLog = (...data: unknown[]): void => {
                logToWebPage(formatString(...data));
            };
        }
    } else if (console) {
        // Log to console.

        // For JSB
        if (!console.error) {
            console.error = console.log;
        }
        if (!console.warn) {
            console.warn = console.log;
        }

        if (EDITOR || console.error.bind) {
            // use bind to avoid pollute call stacks
            ccError = console.error.bind(console);
        } else {
            ccError = JSB ? console.error : (...data: unknown[]): void => console.error.apply(console, data);
        }
        ccAssert = (condition: boolean, message?: unknown, ...optionalParams: unknown[]): void => {
            if (!condition) {
                const errorText = formatString(message, ...optionalParams);
                if (DEV) {
                    // eslint-disable-next-line no-debugger
                    debugger;
                } else {
                    throw new Error(errorText);
                }
            }
        };
    }

    if (mode !== DebugMode.ERROR) {
        if (EDITOR) {
            ccWarn = console.warn.bind(console);
        } else if (console.warn.bind) {
            // use bind to avoid pollute call stacks
            ccWarn = console.warn.bind(console);
        } else {
            ccWarn = JSB ? console.warn : (...data: unknown[]): void => console.warn.apply(console, data);
        }
    }

    if (EDITOR) {
        ccLog = console.log.bind(console);
    } else if (mode <= DebugMode.INFO) {
        if (JSB) {
            ccLog = console.log;
        } else if (console.log.bind) {
            // use bind to avoid pollute call stacks
            ccLog = console.log.bind(console);
        } else {
            ccLog = (...data: unknown[]): void => console.log.apply(console, data);
        }
    }

    if (mode <= DebugMode.VERBOSE) {
        if (typeof console.debug === 'function') {
            const vendorDebug = console.debug.bind(console);
            ccDebug = (...data: unknown[]): any => vendorDebug(...data);
        }
    }
}

export function _throw (error_: any): any {
    if (EDITOR) {
        return error(error_);
    } else {
        const stack = error_.stack;
        if (stack) {
            error(JSB ? (`${error_}\n${stack}`) : stack);
        } else {
            error(error_);
        }
        return undefined;
    }
}

function getTypedFormatter (type: 'Log' | 'Warning' | 'Error' | 'Assert'): (id: number, ...args: StringSubstitution[]) => string {
    return (id: number, ...args: StringSubstitution[]): string => {
        const msg = DEBUG ? (debugInfos[id] || 'unknown id') : `${type} ${id}, please go to ${ERROR_MAP_URL}#${id} to see details.`;
        if (args.length === 0) {
            return msg;
        }
        return DEBUG ? formatString(msg, ...args) : `${msg} Arguments: ${args.join(', ')}`;
    };
}

const logFormatter = getTypedFormatter('Log');
export function logID (id: number, ...optionalParams: StringSubstitution[]): void {
    log(logFormatter(id, ...optionalParams));
}

const warnFormatter = getTypedFormatter('Warning');
export function warnID (id: number, ...optionalParams: StringSubstitution[]): void {
    warn(warnFormatter(id, ...optionalParams));
}

const errorFormatter = getTypedFormatter('Error');
export function errorID (id: number, ...optionalParams: StringSubstitution[]): void {
    error(errorFormatter(id, ...optionalParams));
}

const assertFormatter = getTypedFormatter('Assert');
export function assertID (condition: boolean, id: number, ...optionalParams: StringSubstitution[]): void {
    if (condition) {
        return;
    }
    assert(false, assertFormatter(id, ...optionalParams));
}

/**
 * @en Enum for debug modes.
 * @zh 调试模式。
 */
export enum DebugMode {
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
    ERROR = 4,

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
}

/**
 * @en Gets error message with the error id and possible parameters.
 * @zh 通过 error id 和必要的参数来获取错误信息。
 * @param errorId @zh 错误的ID。@en Error id.
 * @param param @zh 输出日志。@en Output log.
 */
export function getError (errorId: number, ...param: StringSubstitution[]): string {
    return errorFormatter(errorId, ...param);
}

/**
 * @en Returns whether or not to display the FPS and debug information.
 * @zh 是否显示 FPS 信息和部分调试信息。
 * @deprecated @zh 从v3.6开始不再支持，请使用 profiler.isShowingStates。@en Since v3.6, Please use profiler.isShowingStates instead.
 */
export function isDisplayStats (): boolean {
    return legacyCC.profiler ? legacyCC.profiler.isShowingStats() as boolean : false;
}

/**
 * @en Sets whether display the FPS and debug informations on the bottom-left corner.
 * @zh 设置是否在左下角显示 FPS 和部分调试。
 * @deprecated @zh 从v3.6开始不再支持，请使用 profiler.showStats。@en Since v3.6, Please use profiler.showStats instead.
 */
export function setDisplayStats (displayStats: boolean): void {
    if (legacyCC.profiler) {
        displayStats ? legacyCC.profiler.showStats() : legacyCC.profiler.hideStats();
    }
}
