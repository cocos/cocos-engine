/*
 Copyright (c) 2018-2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
*/
/**
 * @packageDocumentation
 * @module core
 */

/* eslint-disable no-console */

import { EDITOR, JSB, DEV, DEBUG } from 'internal:constants';
import debugInfos from '../../../DebugInfos';
import { legacyCC } from '../global-exports';

const ERROR_MAP_URL = 'https://github.com/cocos-creator/engine/blob/develop/EngineErrorMap.md';

// The html element displays log in web page (DebugMode.INFO_FOR_WEB_PAGE)
let logList: HTMLTextAreaElement | null = null;

let ccLog = console.log.bind(console);

let ccWarn = ccLog;

let ccError = ccLog;

let ccAssert = (condition: any, message?: any, ...optionalParams: any[]) => {
    if (!condition) {
        console.log(`ASSERT: ${formatString(message, ...optionalParams)}`);
    }
};

let ccDebug = ccLog;

function formatString (message?: any, ...optionalParams: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return legacyCC.js.formatStr.apply(null, [message].concat(optionalParams));
}

/**
 * @en Outputs a message to the Cocos Creator Console (editor) or Web Console (runtime).
 * @zh 输出一条消息到 Cocos Creator 编辑器的 Console 或运行时 Web 端的 Console 中。
 * @param message - A JavaScript string containing zero or more substitution strings.
 * @param optionalParams - JavaScript objects with which to replace substitution strings within msg.
 * This gives you additional control over the format of the output.
 */
export function log (message?: any, ...optionalParams: any[]) {
    return ccLog(message, ...optionalParams);
}

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
export function warn (message?: any, ...optionalParams: any[]) {
    return ccWarn(message, ...optionalParams);
}

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
export function error (message?: any, ...optionalParams: any[]) {
    return ccError(message, ...optionalParams);
}

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
export function assert (value: any, message?: string, ...optionalParams: any[]): asserts value {
    return ccAssert(value, message, ...optionalParams);
}

/**
 * @en Outputs a message at the "debug" log level.
 * @zh 输出一条“调试”日志等级的消息。
 */
export function debug (...data: any[]) {
    return ccDebug(...data);
}

export function _resetDebugSetting (mode: DebugMode) {
    // reset
    ccLog = ccWarn = ccError = ccAssert = ccDebug = () => {
    };

    if (mode === DebugMode.NONE) {
        return;
    }

    if (mode > DebugMode.ERROR) {
        // Log to web page.
        const logToWebPage = (msg: string) => {
            if (!legacyCC.game.canvas) {
                return;
            }

            if (!logList) {
                const logDiv = document.createElement('Div');
                logDiv.setAttribute('id', 'logInfoDiv');
                logDiv.setAttribute('width', '200');
                logDiv.setAttribute('height', legacyCC.game.canvas.height);
                const logDivStyle = logDiv.style;
                logDivStyle.zIndex = '99999';
                logDivStyle.position = 'absolute';
                logDivStyle.top = logDivStyle.left = '0';

                logList = document.createElement('textarea');
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

        ccError = (message?: any, ...optionalParams: any[]) => {
            logToWebPage(`ERROR :  ${formatString(message, ...optionalParams)}`);
        };
        ccAssert = (condition: any, message?: any, ...optionalParams: any[]) => {
            if (!condition) {
                logToWebPage(`ASSERT: ${formatString(message, ...optionalParams)}`);
            }
        };
        if (mode !== DebugMode.ERROR_FOR_WEB_PAGE) {
            ccWarn = (message?: any, ...optionalParams: any[]) => {
                logToWebPage(`WARN :  ${formatString(message, ...optionalParams)}`);
            };
        }
        if (mode === DebugMode.INFO_FOR_WEB_PAGE) {
            ccLog = (message?: any, ...optionalParams: any[]) => {
                logToWebPage(formatString(message, ...optionalParams));
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
            ccError = JSB ? console.error : (message?: any, ...optionalParams: any[]) => console.error.apply(console, [message, ...optionalParams]);
        }
        ccAssert = (condition: any, message?: any, ...optionalParams: any[]) => {
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
            ccWarn = JSB ? console.warn : (message?: any, ...optionalParams: any[]) => console.warn.apply(console, [message, ...optionalParams]);
        }
    }

    if (EDITOR) {
        ccLog = console.log.bind(console);
    } else if (mode === DebugMode.INFO) {
        if (JSB) {
            // @ts-expect-error We have no typing for this
            if (scriptEngineType === 'JavaScriptCore') {
                // console.log has to use `console` as its context for iOS 8~9. Therefore, apply it.
                ccLog = (message?: any, ...optionalParams: any[]) => console.log.apply(console, [message, ...optionalParams]);
            } else {
                ccLog = console.log;
            }
        } else if (console.log.bind) {
            // use bind to avoid pollute call stacks
            ccLog = console.log.bind(console);
        } else {
            ccLog = (message?: any, ...optionalParams: any[]) => console.log.apply(console, [message, ...optionalParams]);
        }
    }

    if (mode <= DebugMode.VERBOSE) {
        if (typeof console.debug === 'function') {
            const vendorDebug = console.debug.bind(console);
            ccDebug = (...data: any[]) => vendorDebug(...data);
        }
    }
}

export function _throw (error_: any) {
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

function getTypedFormatter (type: 'Log' | 'Warning' | 'Error' | 'Assert') {
    return (id: number, ...args: any[]) => {
        const msg = DEBUG ? (debugInfos[id] || 'unknown id') : `${type} ${id}, please go to ${ERROR_MAP_URL}#${id} to see details.`;
        if (args.length === 0) {
            return msg;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return DEBUG ? formatString(msg, ...args) : `${msg} Arguments: ${args.join(', ')}`;
    };
}

const logFormatter = getTypedFormatter('Log');
export function logID (id: number, ...optionalParams: any[]) {
    log(logFormatter(id, ...optionalParams));
}

const warnFormatter = getTypedFormatter('Warning');
export function warnID (id: number, ...optionalParams: any[]) {
    warn(warnFormatter(id, ...optionalParams));
}

const errorFormatter = getTypedFormatter('Error');
export function errorID (id: number, ...optionalParams: any[]) {
    error(errorFormatter(id, ...optionalParams));
}

const assertFormatter = getTypedFormatter('Assert');
export function assertID (condition: any, id: number, ...optionalParams: any[]) {
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
 */
export function getError (errorId: number, ...param: any[]): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return errorFormatter(errorId, ...param);
}

/**
 * @en Returns whether or not to display the FPS and debug information.
 * @zh 是否显示 FPS 信息和部分调试信息。
 */
export function isDisplayStats (): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return legacyCC.profiler ? legacyCC.profiler.isShowingStats() : false;
}

/**
 * @en Sets whether display the FPS and debug informations on the bottom-left corner.
 * @zh 设置是否在左下角显示 FPS 和部分调试。
 */
export function setDisplayStats (displayStats: boolean) {
    if (legacyCC.profiler) {
        displayStats ? legacyCC.profiler.showStats() : legacyCC.profiler.hideStats();
        legacyCC.game.config.showFPS = !!displayStats;
    }
}
