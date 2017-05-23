/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/


cc._logToWebPage = function (msg) {
    if (!cc._canvas)
        return;

    var logList = cc._logList;
    var doc = document;
    if (!logList) {
        var logDiv = doc.createElement("Div");
        var logDivStyle = logDiv.style;

        logDiv.setAttribute("id", "logInfoDiv");
        cc._canvas.parentNode.appendChild(logDiv);
        logDiv.setAttribute("width", "200");
        logDiv.setAttribute("height", cc._canvas.height);
        logDivStyle.zIndex = "99999";
        logDivStyle.position = "absolute";
        logDivStyle.top = "0";
        logDivStyle.left = "0";

        logList = cc._logList = doc.createElement("textarea");
        var logListStyle = logList.style;

        logList.setAttribute("rows", "20");
        logList.setAttribute("cols", "30");
        logList.setAttribute("disabled", true);
        logDiv.appendChild(logList);
        logListStyle.backgroundColor = "transparent";
        logListStyle.borderBottom = "1px solid #cccccc";
        logListStyle.borderRightWidth = "0px";
        logListStyle.borderLeftWidth = "0px";
        logListStyle.borderTopWidth = "0px";
        logListStyle.borderTopStyle = "none";
        logListStyle.borderRightStyle = "none";
        logListStyle.borderLeftStyle = "none";
        logListStyle.padding = "0px";
        logListStyle.margin = 0;

    }
    logList.value = logList.value + msg + "\r\n";
    logList.scrollTop = logList.scrollHeight;
};

var Enum = require('./cocos2d/core/platform/CCEnum');

/**
 * !#en Enum for debug modes.
 * !#zh 调试模式
 * @enum DebugMode
 */
cc.DebugMode = Enum({
    /**
     * !#en The debug mode none.
     * !#zh 禁止模式，禁止显示任何日志信息。
     * @property NONE
     * @type {Number}
     * @static
     */
    NONE: 0,
    /**
     * !#en The debug mode info.
     * !#zh 信息模式，在 console 中显示所有日志。
     * @property INFO
     * @type {Number}
     * @static
     */
    INFO: 1,
    /**
     * !#en The debug mode warn.
     * !#zh 警告模式，在 console 中只显示 warn 级别以上的（包含 error）日志。
     * @property WARN
     * @type {Number}
     * @static
     */
    WARN: 2,
    /**
     * !#en The debug mode error.
     * !#zh 错误模式，在 console 中只显示 error 日志。
     * @property ERROR
     * @type {Number}
     * @static
     */
    ERROR: 3,
    /**
     * !#en The debug mode info for web page.
     * !#zh 信息模式（仅 WEB 端有效），在画面上输出所有信息。
     * @property INFO_FOR_WEB_PAGE
     * @type {Number}
     * @static
     */
    INFO_FOR_WEB_PAGE: 4,
    /**
     * !#en The debug mode warn for web page.
     * !#zh 警告模式（仅 WEB 端有效），在画面上输出 warn 级别以上的（包含 error）信息。
     * @property WARN_FOR_WEB_PAGE
     * @type {Number}
     * @static
     */
    WARN_FOR_WEB_PAGE: 5,
    /**
     * !#en The debug mode error for web page.
     * !#zh 错误模式（仅 WEB 端有效），在画面上输出 error 信息。
     * @property ERROR_FOR_WEB_PAGE
     * @type {Number}
     * @static
     */
    ERROR_FOR_WEB_PAGE: 6
});

/**
 * @module cc
 */

var jsbLog = cc.log || console.log;

/**
 * !#en Init Debug setting.
 * !#zh 设置调试模式。
 * @method _initDebugSetting
 * @param {DebugMode} mode
 */
cc._initDebugSetting = function (mode) {
    // reset
    cc.log = cc.logID = cc.warn = cc.warnID = cc.error = cc.errorID = cc._throw = cc.assert = cc.assertID = function () { };

    if (mode === cc.DebugMode.NONE)
        return;

    var locLog;
    if (!CC_JSB && mode > cc.DebugMode.ERROR) {
        //log to web page
        locLog = cc._logToWebPage.bind(cc);
        cc.error = function () {
            locLog("ERROR :  " + cc.js.formatStr.apply(null, arguments));
        };
        cc.assert = function (cond, msg) {
            'use strict';
            if (!cond && msg) {
                msg = cc.js.formatStr.apply(null, cc.js.shiftArguments.apply(null, arguments));
                locLog("ASSERT: " + msg);
            }
        };
        if (mode !== cc.DebugMode.ERROR_FOR_WEB_PAGE) {
            cc.warn = function () {
                locLog("WARN :  " + cc.js.formatStr.apply(null, arguments));
            };
        }
        if (mode === cc.DebugMode.INFO_FOR_WEB_PAGE) {
            cc.log = cc.info = function () {
                locLog(cc.js.formatStr.apply(null, arguments));
            };
        }
    }
    else if (console && console.log.apply) {//console is null when user doesn't open dev tool on IE9
        //log to console

        // For JSB
        if (!console.error) console.error = console.log;
        if (!console.warn) console.warn = console.log;

        /**
         * !#en
         * Outputs an error message to the Cocos Creator Console (editor) or Web Console (runtime).<br/>
         * - In Cocos Creator, error is red.<br/>
         * - In Chrome, error have a red icon along with red message text.<br/>
         * !#zh
         * 输出错误消息到 Cocos Creator 编辑器的 Console 或运行时页面端的 Console 中。<br/>
         * - 在 Cocos Creator 中，错误信息显示是红色的。<br/>
         * - 在 Chrome 中，错误信息有红色的图标以及红色的消息文本。<br/>
         *
         * @method error
         * @param {any} obj - A JavaScript string containing zero or more substitution strings.
         * @param {any} ...subst - JavaScript objects with which to replace substitution strings within msg. This gives you additional control over the format of the output.
         */
        if (CC_EDITOR) {
            cc.error = Editor.error;
        }
        else if (console.error.bind) {
            // use bind to avoid pollute call stacks
            cc.error = console.error.bind(console);
        }
        else {
            cc.error = CC_JSB ? console.error : function () {
                return console.error.apply(console, arguments);
            };
        }
        cc.assert = CC_JSB ? function (cond, ...args) {
            var msg = args[0];
            if (!cond && msg) {
                msg = cc.js.formatStr.apply(null, args);
                throw new Error(msg);
            }
        } : function (cond, msg) {
            if (!cond) {
                if (msg) {
                    msg = cc.js.formatStr.apply(null, cc.js.shiftArguments.apply(null, arguments));
                }
                if (CC_DEV) {
                    debugger;
                }
                if (CC_TEST) {
                    ok(false, msg);
                }
                else {
                    throw new Error(msg);
                }
            }
        }
    }
    if (mode !== cc.DebugMode.ERROR) {
        /**
         * !#en
         * Outputs a warning message to the Cocos Creator Console (editor) or Web Console (runtime).
         * - In Cocos Creator, warning is yellow.
         * - In Chrome, warning have a yellow warning icon with the message text.
         * !#zh
         * 输出警告消息到 Cocos Creator 编辑器的 Console 或运行时 Web 端的 Console 中。<br/>
         * - 在 Cocos Creator 中，警告信息显示是黄色的。<br/>
         * - 在 Chrome 中，警告信息有着黄色的图标以及黄色的消息文本。<br/>
         * @method warn
         * @param {any} obj - A JavaScript string containing zero or more substitution strings.
         * @param {any} ...subst - JavaScript objects with which to replace substitution strings within msg. This gives you additional control over the format of the output.
         */
        if (CC_EDITOR) {
            cc.warn = Editor.warn;
        }
        else if (console.warn.bind) {
            // use bind to avoid pollute call stacks
            cc.warn = console.warn.bind(console);
        }
        else {
            cc.warn = CC_JSB ? console.warn : function () {
                return console.warn.apply(console, arguments);
            };
        }
    }
    if (CC_EDITOR) {
        cc.log = Editor.log;
        cc.info = Editor.info;
    }
    else if (mode === cc.DebugMode.INFO) {
        /**
         * !#en Outputs a message to the Cocos Creator Console (editor) or Web Console (runtime).
         * !#zh 输出一条消息到 Cocos Creator 编辑器的 Console 或运行时 Web 端的 Console 中。
         * @method log
         * @param {String|any} obj - A JavaScript string containing zero or more substitution strings.
         * @param {any} ...subst - JavaScript objects with which to replace substitution strings within msg. This gives you additional control over the format of the output.
         */
        if (CC_JSB) {
            cc.log = jsbLog;
        }
        else if (console.log.bind) {
            // use bind to avoid pollute call stacks
            cc.log = console.log.bind(console);
        }
        else {
            cc.log = function () {
                return console.log.apply(console, arguments);
            };
        }
        /**
         * !#en
         * Outputs an informational message to the Cocos Creator Console (editor) or Web Console (runtime).
         * - In Cocos Creator, info is blue.
         * - In Firefox and Chrome, a small "i" icon is displayed next to these items in the Web Console's log.
         * !#zh
         * 输出一条信息消息到 Cocos Creator 编辑器的 Console 或运行时 Web 端的 Console 中。
         * - 在 Cocos Creator 中，Info 信息显示是蓝色的。<br/>
         * - 在 Firefox 和  Chrome 中，Info 信息有着小 “i” 图标。
         * @method info
         * @param {any} obj - A JavaScript string containing zero or more substitution strings.
         * @param {any} ...subst - JavaScript objects with which to replace substitution strings within msg. This gives you additional control over the format of the output.
         */
        cc.info = CC_JSB ? jsbLog : function () {
            (console.info || console.log).apply(console, arguments);
        };
    }

    cc.warnID = genLogFunc(cc.warn, 'Warning');
    cc.errorID = genLogFunc(cc.error, 'Error');
    cc.logID = genLogFunc(cc.log, 'Log');
    var assertFailed = genLogFunc(function () {
        // actually no need to protect arguments leak here in case of an error...
        var argsArr = [false];
        for (var i = 0; i < arguments.length; ++i) {
            argsArr.push(arguments[i]);
        }
        cc.assert.apply(null, argsArr);
    }, 'Assert');
    cc.assertID = CC_JSB ? function (cond, ...args) {
        if (cond) {
            return;
        }
        assertFailed.apply(null, args);
    } : function (cond) {
        'use strict';
        if (cond) {
            return;
        }
        assertFailed.apply(null, cc.js.shiftArguments.apply(null, arguments));
    };
};
cc._throw = CC_EDITOR ? Editor.error : function (error) {
    var stack = error.stack;
    if (stack) {
        cc.error(CC_JSB ? (error + '\n' + stack) : stack);
    }
    else {
        cc.error(error);
    }
};

var errorMapUrl = 'https://github.com/cocos-creator/engine/blob/master/EngineErrorMap.md';

function genLogFunc(func, type) {
    return CC_JSB ? function (...args) {
        var id = args[0];
        if (args.length === 1) {
            CC_DEBUG ? func(cc._LogInfos[id]) : func(type + ' ' + id + ', please go to ' + errorMapUrl + '#' + id + ' to see details.');
            return;
        }
        if (CC_DEBUG) {
            args[0] = cc._LogInfos[id];
            func.apply(cc, args);
        } else {
            var msg = '';
            if (args.length === 2) {
                msg = 'Arguments: ' + args[1];
            } else if (args.length > 2) {
                msg = 'Arguments: ' + args.slice(1).join(', ');
            }
            func(type + ' ' + id + ', please go to ' + errorMapUrl + '#' + id + ' to see details. ' + msg);
        }
    } : function (id) {
        'use strict';
        if (arguments.length === 1) {
            CC_DEBUG ? func(cc._LogInfos[id]) : func(type + ' ' + id + ', please go to ' + errorMapUrl + '#' + id + ' to see details.');
            return;
        }
        if (CC_DEBUG) {
            let argsArr = cc.js.shiftArguments.apply(null, arguments);
            func.apply(cc, [cc._LogInfos[id]].concat(argsArr));
        } else {
            var msg = '';
            if (arguments.length === 2) {
                msg = 'Arguments: ' + arguments[1];
            } else if (arguments.length > 2) {
                msg = 'Arguments: ' + cc.js.shiftArguments.apply(null, arguments).join(', ');
            }
            func(type + ' ' + id + ', please go to ' + errorMapUrl + '#' + id + ' to see details. ' + msg);
        }
    };
}
