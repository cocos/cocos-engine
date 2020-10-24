(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../DebugInfos.js", "../default-constants.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../DebugInfos.js"), require("../default-constants.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.DebugInfos, global.defaultConstants, global.globalExports);
    global.debug = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _DebugInfos, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.log = log;
  _exports.warn = warn;
  _exports.error = error;
  _exports.assert = assert;
  _exports._resetDebugSetting = _resetDebugSetting;
  _exports._throw = _throw;
  _exports.logID = logID;
  _exports.warnID = warnID;
  _exports.errorID = errorID;
  _exports.assertID = assertID;
  _exports.getError = getError;
  _exports.isDisplayStats = isDisplayStats;
  _exports.setDisplayStats = setDisplayStats;
  _exports.DebugMode = void 0;
  _DebugInfos = _interopRequireDefault(_DebugInfos);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /*
   Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.
  
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
  */

  /**
   * @category core
   */

  /* eslint-disable no-console */
  var ERROR_MAP_URL = 'https://github.com/cocos-creator/engine/blob/3d/EngineErrorMap.md'; // The html element displays log in web page (DebugMode.INFO_FOR_WEB_PAGE)

  var logList = null;
  var ccLog = console.log;
  var ccWarn = console.log;
  var ccError = console.log;

  var ccAssert = function ccAssert(condition, message) {
    if (!condition) {
      for (var _len = arguments.length, optionalParams = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        optionalParams[_key - 2] = arguments[_key];
      }

      console.log('ASSERT: ' + formatString.apply(void 0, [message].concat(optionalParams)));
    }
  };

  function formatString(message) {
    for (var _len2 = arguments.length, optionalParams = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      optionalParams[_key2 - 1] = arguments[_key2];
    }

    return _globalExports.legacyCC.js.formatStr.apply(null, [message].concat(optionalParams));
  }
  /**
   * @en Outputs a message to the Cocos Creator Console (editor) or Web Console (runtime).
   * @zh 输出一条消息到 Cocos Creator 编辑器的 Console 或运行时 Web 端的 Console 中。
   * @param message - A JavaScript string containing zero or more substitution strings.
   * @param optionalParams - JavaScript objects with which to replace substitution strings within msg.
   * This gives you additional control over the format of the output.
   */


  function log(message) {
    for (var _len3 = arguments.length, optionalParams = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      optionalParams[_key3 - 1] = arguments[_key3];
    }

    return ccLog.apply(void 0, [message].concat(optionalParams));
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


  function warn(message) {
    for (var _len4 = arguments.length, optionalParams = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      optionalParams[_key4 - 1] = arguments[_key4];
    }

    return ccWarn.apply(void 0, [message].concat(optionalParams));
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


  function error(message) {
    for (var _len5 = arguments.length, optionalParams = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
      optionalParams[_key5 - 1] = arguments[_key5];
    }

    return ccError.apply(void 0, [message].concat(optionalParams));
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


  function assert(value, message) {
    for (var _len6 = arguments.length, optionalParams = new Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
      optionalParams[_key6 - 2] = arguments[_key6];
    }

    return ccAssert.apply(void 0, [value, message].concat(optionalParams));
  }

  function _resetDebugSetting(mode) {
    // reset
    ccLog = ccWarn = ccError = ccAssert = function ccAssert() {};

    if (mode === DebugMode.NONE) {
      return;
    }

    if (mode > DebugMode.ERROR) {
      // Log to web page.
      var logToWebPage = function logToWebPage(msg) {
        if (!_globalExports.legacyCC.game.canvas) {
          return;
        }

        if (!logList) {
          var logDiv = document.createElement('Div');
          logDiv.setAttribute('id', 'logInfoDiv');
          logDiv.setAttribute('width', '200');
          logDiv.setAttribute('height', _globalExports.legacyCC.game.canvas.height);
          var logDivStyle = logDiv.style;
          logDivStyle.zIndex = '99999';
          logDivStyle.position = 'absolute';
          logDivStyle.top = logDivStyle.left = '0';
          logList = document.createElement('textarea');
          logList.setAttribute('rows', '20');
          logList.setAttribute('cols', '30');
          logList.setAttribute('disabled', 'true');
          var logListStyle = logList.style;
          logListStyle.backgroundColor = 'transparent';
          logListStyle.borderBottom = '1px solid #cccccc';
          logListStyle.borderTopWidth = logListStyle.borderLeftWidth = logListStyle.borderRightWidth = '0px';
          logListStyle.borderTopStyle = logListStyle.borderLeftStyle = logListStyle.borderRightStyle = 'none';
          logListStyle.padding = '0px';
          logListStyle.margin = '0px';
          logDiv.appendChild(logList);

          _globalExports.legacyCC.game.canvas.parentNode.appendChild(logDiv);
        }

        logList.value = logList.value + msg + '\r\n';
        logList.scrollTop = logList.scrollHeight;
      };

      ccError = function ccError(message) {
        for (var _len7 = arguments.length, optionalParams = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
          optionalParams[_key7 - 1] = arguments[_key7];
        }

        logToWebPage('ERROR :  ' + formatString.apply(void 0, [message].concat(optionalParams)));
      };

      ccAssert = function ccAssert(condition, message) {
        if (!condition) {
          for (var _len8 = arguments.length, optionalParams = new Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
            optionalParams[_key8 - 2] = arguments[_key8];
          }

          logToWebPage('ASSERT: ' + formatString.apply(void 0, [message].concat(optionalParams)));
        }
      };

      if (mode !== DebugMode.ERROR_FOR_WEB_PAGE) {
        ccWarn = function ccWarn(message) {
          for (var _len9 = arguments.length, optionalParams = new Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
            optionalParams[_key9 - 1] = arguments[_key9];
          }

          logToWebPage('WARN :  ' + formatString.apply(void 0, [message].concat(optionalParams)));
        };
      }

      if (mode === DebugMode.INFO_FOR_WEB_PAGE) {
        ccLog = function ccLog(message) {
          for (var _len10 = arguments.length, optionalParams = new Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
            optionalParams[_key10 - 1] = arguments[_key10];
          }

          logToWebPage(formatString.apply(void 0, [message].concat(optionalParams)));
        };
      }
    } else if (console && console.log.apply) {
      // console is null when user doesn't open dev tool on IE9
      // Log to console.
      // For JSB
      if (!console.error) {
        console.error = console.log;
      }

      if (!console.warn) {
        console.warn = console.log;
      }

      if (_defaultConstants.EDITOR || console.error.bind) {
        // use bind to avoid pollute call stacks
        ccError = console.error.bind(console);
      } else {
        ccError = _defaultConstants.JSB ? console.error : function (message) {
          for (var _len11 = arguments.length, optionalParams = new Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
            optionalParams[_key11 - 1] = arguments[_key11];
          }

          return console.error.apply(console, [message].concat(optionalParams));
        };
      }

      ccAssert = function ccAssert(condition, message) {
        if (!condition) {
          for (var _len12 = arguments.length, optionalParams = new Array(_len12 > 2 ? _len12 - 2 : 0), _key12 = 2; _key12 < _len12; _key12++) {
            optionalParams[_key12 - 2] = arguments[_key12];
          }

          var errorText = formatString.apply(void 0, [message].concat(optionalParams));

          if (_defaultConstants.DEV) {
            // tslint:disable:no-debugger
            debugger;
          } else {
            throw new Error(errorText);
          }
        }
      };
    }

    if (mode !== DebugMode.ERROR) {
      if (_defaultConstants.EDITOR) {
        ccWarn = console.warn.bind(console);
      } else if (console.warn.bind) {
        // use bind to avoid pollute call stacks
        ccWarn = console.warn.bind(console);
      } else {
        ccWarn = _defaultConstants.JSB ? console.warn : function (message) {
          for (var _len13 = arguments.length, optionalParams = new Array(_len13 > 1 ? _len13 - 1 : 0), _key13 = 1; _key13 < _len13; _key13++) {
            optionalParams[_key13 - 1] = arguments[_key13];
          }

          return console.warn.apply(console, [message].concat(optionalParams));
        };
      }
    }

    if (_defaultConstants.EDITOR) {
      ccLog = console.log.bind(console);
    } else if (mode === DebugMode.INFO) {
      if (_defaultConstants.JSB) {
        // @ts-ignore
        if (scriptEngineType === 'JavaScriptCore') {
          // console.log has to use `console` as its context for iOS 8~9. Therefore, apply it.
          ccLog = function ccLog(message) {
            for (var _len14 = arguments.length, optionalParams = new Array(_len14 > 1 ? _len14 - 1 : 0), _key14 = 1; _key14 < _len14; _key14++) {
              optionalParams[_key14 - 1] = arguments[_key14];
            }

            return console.log.apply(console, [message].concat(optionalParams));
          };
        } else {
          ccLog = console.log;
        }
      } else if (console.log.bind) {
        // use bind to avoid pollute call stacks
        ccLog = console.log.bind(console);
      } else {
        ccLog = function ccLog(message) {
          for (var _len15 = arguments.length, optionalParams = new Array(_len15 > 1 ? _len15 - 1 : 0), _key15 = 1; _key15 < _len15; _key15++) {
            optionalParams[_key15 - 1] = arguments[_key15];
          }

          return console.log.apply(console, [message].concat(optionalParams));
        };
      }
    }
  }

  function _throw(error_) {
    if (_defaultConstants.EDITOR) {
      return error(error_);
    } else {
      var stack = error_.stack;

      if (stack) {
        error(_defaultConstants.JSB ? error_ + '\n' + stack : stack);
      } else {
        error(error_);
      }
    }
  }

  function getTypedFormatter(type) {
    return function (id) {
      var msg = _defaultConstants.DEBUG ? _DebugInfos.default[id] || 'unknown id' : "".concat(type, " ").concat(id, ", please go to ").concat(ERROR_MAP_URL, "#").concat(id, " to see details.");

      for (var _len16 = arguments.length, args = new Array(_len16 > 1 ? _len16 - 1 : 0), _key16 = 1; _key16 < _len16; _key16++) {
        args[_key16 - 1] = arguments[_key16];
      }

      if (args.length === 0) {
        return msg;
      }

      return _defaultConstants.DEBUG ? formatString.apply(void 0, [msg].concat(args)) : msg + ' Arguments: ' + args.join(', ');
    };
  }

  var logFormatter = getTypedFormatter('Log');

  function logID(id) {
    for (var _len17 = arguments.length, optionalParams = new Array(_len17 > 1 ? _len17 - 1 : 0), _key17 = 1; _key17 < _len17; _key17++) {
      optionalParams[_key17 - 1] = arguments[_key17];
    }

    log(logFormatter.apply(void 0, [id].concat(optionalParams)));
  }

  var warnFormatter = getTypedFormatter('Warning');

  function warnID(id) {
    for (var _len18 = arguments.length, optionalParams = new Array(_len18 > 1 ? _len18 - 1 : 0), _key18 = 1; _key18 < _len18; _key18++) {
      optionalParams[_key18 - 1] = arguments[_key18];
    }

    warn(warnFormatter.apply(void 0, [id].concat(optionalParams)));
  }

  var errorFormatter = getTypedFormatter('Error');

  function errorID(id) {
    for (var _len19 = arguments.length, optionalParams = new Array(_len19 > 1 ? _len19 - 1 : 0), _key19 = 1; _key19 < _len19; _key19++) {
      optionalParams[_key19 - 1] = arguments[_key19];
    }

    error(errorFormatter.apply(void 0, [id].concat(optionalParams)));
  }

  var assertFormatter = getTypedFormatter('Assert');

  function assertID(condition, id) {
    if (condition) {
      return;
    }

    for (var _len20 = arguments.length, optionalParams = new Array(_len20 > 2 ? _len20 - 2 : 0), _key20 = 2; _key20 < _len20; _key20++) {
      optionalParams[_key20 - 2] = arguments[_key20];
    }

    assert(false, assertFormatter.apply(void 0, [id].concat(optionalParams)));
  }
  /**
   * @en Enum for debug modes.
   * @zh 调试模式
   */


  var DebugMode;
  /**
   * @en Gets error message with the error id and possible parameters.
   * @zh 通过 error id 和必要的参数来获取错误信息。
   */

  _exports.DebugMode = DebugMode;

  (function (DebugMode) {
    DebugMode[DebugMode["NONE"] = 0] = "NONE";
    DebugMode[DebugMode["INFO"] = 1] = "INFO";
    DebugMode[DebugMode["WARN"] = 2] = "WARN";
    DebugMode[DebugMode["ERROR"] = 3] = "ERROR";
    DebugMode[DebugMode["INFO_FOR_WEB_PAGE"] = 4] = "INFO_FOR_WEB_PAGE";
    DebugMode[DebugMode["WARN_FOR_WEB_PAGE"] = 5] = "WARN_FOR_WEB_PAGE";
    DebugMode[DebugMode["ERROR_FOR_WEB_PAGE"] = 6] = "ERROR_FOR_WEB_PAGE";
  })(DebugMode || (_exports.DebugMode = DebugMode = {}));

  function getError(errorId) {
    for (var _len21 = arguments.length, param = new Array(_len21 > 1 ? _len21 - 1 : 0), _key21 = 1; _key21 < _len21; _key21++) {
      param[_key21 - 1] = arguments[_key21];
    }

    return errorFormatter.apply(void 0, [errorId].concat(param));
  }
  /**
   * @en Returns whether or not to display the FPS and debug information.
   * @zh 是否显示 FPS 信息和部分调试信息。
   */


  function isDisplayStats() {
    return _globalExports.legacyCC.profiler ? _globalExports.legacyCC.profiler.isShowingStats() : false;
  }
  /**
   * @en Sets whether display the FPS and debug informations on the bottom-left corner.
   * @zh 设置是否在左下角显示 FPS 和部分调试。
   */


  function setDisplayStats(displayStats) {
    if (_globalExports.legacyCC.profiler) {
      displayStats ? _globalExports.legacyCC.profiler.showStats() : _globalExports.legacyCC.profiler.hideStats();
      _globalExports.legacyCC.game.config.showFPS = !!displayStats;
    }
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGxhdGZvcm0vZGVidWcudHMiXSwibmFtZXMiOlsiRVJST1JfTUFQX1VSTCIsImxvZ0xpc3QiLCJjY0xvZyIsImNvbnNvbGUiLCJsb2ciLCJjY1dhcm4iLCJjY0Vycm9yIiwiY2NBc3NlcnQiLCJjb25kaXRpb24iLCJtZXNzYWdlIiwib3B0aW9uYWxQYXJhbXMiLCJmb3JtYXRTdHJpbmciLCJsZWdhY3lDQyIsImpzIiwiZm9ybWF0U3RyIiwiYXBwbHkiLCJjb25jYXQiLCJ3YXJuIiwiZXJyb3IiLCJhc3NlcnQiLCJ2YWx1ZSIsIl9yZXNldERlYnVnU2V0dGluZyIsIm1vZGUiLCJEZWJ1Z01vZGUiLCJOT05FIiwiRVJST1IiLCJsb2dUb1dlYlBhZ2UiLCJtc2ciLCJnYW1lIiwiY2FudmFzIiwibG9nRGl2IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwiaGVpZ2h0IiwibG9nRGl2U3R5bGUiLCJzdHlsZSIsInpJbmRleCIsInBvc2l0aW9uIiwidG9wIiwibGVmdCIsImxvZ0xpc3RTdHlsZSIsImJhY2tncm91bmRDb2xvciIsImJvcmRlckJvdHRvbSIsImJvcmRlclRvcFdpZHRoIiwiYm9yZGVyTGVmdFdpZHRoIiwiYm9yZGVyUmlnaHRXaWR0aCIsImJvcmRlclRvcFN0eWxlIiwiYm9yZGVyTGVmdFN0eWxlIiwiYm9yZGVyUmlnaHRTdHlsZSIsInBhZGRpbmciLCJtYXJnaW4iLCJhcHBlbmRDaGlsZCIsInBhcmVudE5vZGUiLCJzY3JvbGxUb3AiLCJzY3JvbGxIZWlnaHQiLCJFUlJPUl9GT1JfV0VCX1BBR0UiLCJJTkZPX0ZPUl9XRUJfUEFHRSIsIkVESVRPUiIsImJpbmQiLCJKU0IiLCJlcnJvclRleHQiLCJERVYiLCJFcnJvciIsIklORk8iLCJzY3JpcHRFbmdpbmVUeXBlIiwiX3Rocm93IiwiZXJyb3JfIiwic3RhY2siLCJnZXRUeXBlZEZvcm1hdHRlciIsInR5cGUiLCJpZCIsIkRFQlVHIiwiZGVidWdJbmZvcyIsImFyZ3MiLCJsZW5ndGgiLCJqb2luIiwibG9nRm9ybWF0dGVyIiwibG9nSUQiLCJ3YXJuRm9ybWF0dGVyIiwid2FybklEIiwiZXJyb3JGb3JtYXR0ZXIiLCJlcnJvcklEIiwiYXNzZXJ0Rm9ybWF0dGVyIiwiYXNzZXJ0SUQiLCJnZXRFcnJvciIsImVycm9ySWQiLCJwYXJhbSIsImlzRGlzcGxheVN0YXRzIiwicHJvZmlsZXIiLCJpc1Nob3dpbmdTdGF0cyIsInNldERpc3BsYXlTdGF0cyIsImRpc3BsYXlTdGF0cyIsInNob3dTdGF0cyIsImhpZGVTdGF0cyIsImNvbmZpZyIsInNob3dGUFMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0JBOzs7O0FBSUE7QUFLQSxNQUFNQSxhQUFhLEdBQUcsbUVBQXRCLEMsQ0FFQTs7QUFDQSxNQUFJQyxPQUFtQyxHQUFHLElBQTFDO0FBRUEsTUFBSUMsS0FBSyxHQUFHQyxPQUFPLENBQUNDLEdBQXBCO0FBRUEsTUFBSUMsTUFBTSxHQUFHRixPQUFPLENBQUNDLEdBQXJCO0FBRUEsTUFBSUUsT0FBTyxHQUFHSCxPQUFPLENBQUNDLEdBQXRCOztBQUVBLE1BQUlHLFFBQVEsR0FBRyxrQkFBQ0MsU0FBRCxFQUFpQkMsT0FBakIsRUFBNkQ7QUFDeEUsUUFBSSxDQUFDRCxTQUFMLEVBQWdCO0FBQUEsd0NBRDhCRSxjQUM5QjtBQUQ4QkEsUUFBQUEsY0FDOUI7QUFBQTs7QUFDWlAsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksYUFBYU8sWUFBWSxNQUFaLFVBQWFGLE9BQWIsU0FBeUJDLGNBQXpCLEVBQXpCO0FBQ0g7QUFDSixHQUpEOztBQU1BLFdBQVNDLFlBQVQsQ0FBdUJGLE9BQXZCLEVBQWdFO0FBQUEsdUNBQXZCQyxjQUF1QjtBQUF2QkEsTUFBQUEsY0FBdUI7QUFBQTs7QUFDNUQsV0FBT0Usd0JBQVND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LFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7S0FBQUEsUywwQkFBQUEsUzs7QUFnREwsV0FBUzhELFFBQVQsQ0FBbUJDLE9BQW5CLEVBQTBEO0FBQUEsd0NBQXRCQyxLQUFzQjtBQUF0QkEsTUFBQUEsS0FBc0I7QUFBQTs7QUFDN0QsV0FBT04sY0FBYyxNQUFkLFVBQWVLLE9BQWYsU0FBMkJDLEtBQTNCLEVBQVA7QUFDSDtBQUVEOzs7Ozs7QUFJTyxXQUFTQyxjQUFULEdBQW9DO0FBQ3ZDLFdBQU81RSx3QkFBUzZFLFFBQVQsR0FBb0I3RSx3QkFBUzZFLFFBQVQsQ0FBa0JDLGNBQWxCLEVBQXBCLEdBQXlELEtBQWhFO0FBQ0g7QUFFRDs7Ozs7O0FBSU8sV0FBU0MsZUFBVCxDQUEwQkMsWUFBMUIsRUFBaUQ7QUFDcEQsUUFBSWhGLHdCQUFTNkUsUUFBYixFQUF1QjtBQUNuQkcsTUFBQUEsWUFBWSxHQUFHaEYsd0JBQVM2RSxRQUFULENBQWtCSSxTQUFsQixFQUFILEdBQW1DakYsd0JBQVM2RSxRQUFULENBQWtCSyxTQUFsQixFQUEvQztBQUNBbEYsOEJBQVNnQixJQUFULENBQWNtRSxNQUFkLENBQXFCQyxPQUFyQixHQUErQixDQUFDLENBQUNKLFlBQWpDO0FBQ0g7QUFDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgY29yZVxyXG4gKi9cclxuXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cclxuXHJcbmltcG9ydCBkZWJ1Z0luZm9zIGZyb20gJy4uLy4uLy4uL0RlYnVnSW5mb3MnO1xyXG5pbXBvcnQgeyBFRElUT1IsIEpTQiwgREVWLCBERUJVRyB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5jb25zdCBFUlJPUl9NQVBfVVJMID0gJ2h0dHBzOi8vZ2l0aHViLmNvbS9jb2Nvcy1jcmVhdG9yL2VuZ2luZS9ibG9iLzNkL0VuZ2luZUVycm9yTWFwLm1kJztcclxuXHJcbi8vIFRoZSBodG1sIGVsZW1lbnQgZGlzcGxheXMgbG9nIGluIHdlYiBwYWdlIChEZWJ1Z01vZGUuSU5GT19GT1JfV0VCX1BBR0UpXHJcbmxldCBsb2dMaXN0OiBIVE1MVGV4dEFyZWFFbGVtZW50IHwgbnVsbCA9IG51bGw7XHJcblxyXG5sZXQgY2NMb2cgPSBjb25zb2xlLmxvZztcclxuXHJcbmxldCBjY1dhcm4gPSBjb25zb2xlLmxvZztcclxuXHJcbmxldCBjY0Vycm9yID0gY29uc29sZS5sb2c7XHJcblxyXG5sZXQgY2NBc3NlcnQgPSAoY29uZGl0aW9uOiBhbnksIG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSkgPT4ge1xyXG4gICAgaWYgKCFjb25kaXRpb24pIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnQVNTRVJUOiAnICsgZm9ybWF0U3RyaW5nKG1lc3NhZ2UsIC4uLm9wdGlvbmFsUGFyYW1zKSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBmb3JtYXRTdHJpbmcgKG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSkge1xyXG4gICAgcmV0dXJuIGxlZ2FjeUNDLmpzLmZvcm1hdFN0ci5hcHBseShudWxsLCBbbWVzc2FnZV0uY29uY2F0KG9wdGlvbmFsUGFyYW1zKSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gT3V0cHV0cyBhIG1lc3NhZ2UgdG8gdGhlIENvY29zIENyZWF0b3IgQ29uc29sZSAoZWRpdG9yKSBvciBXZWIgQ29uc29sZSAocnVudGltZSkuXHJcbiAqIEB6aCDovpPlh7rkuIDmnaHmtojmga/liLAgQ29jb3MgQ3JlYXRvciDnvJbovpHlmajnmoQgQ29uc29sZSDmiJbov5DooYzml7YgV2ViIOerr+eahCBDb25zb2xlIOS4reOAglxyXG4gKiBAcGFyYW0gbWVzc2FnZSAtIEEgSmF2YVNjcmlwdCBzdHJpbmcgY29udGFpbmluZyB6ZXJvIG9yIG1vcmUgc3Vic3RpdHV0aW9uIHN0cmluZ3MuXHJcbiAqIEBwYXJhbSBvcHRpb25hbFBhcmFtcyAtIEphdmFTY3JpcHQgb2JqZWN0cyB3aXRoIHdoaWNoIHRvIHJlcGxhY2Ugc3Vic3RpdHV0aW9uIHN0cmluZ3Mgd2l0aGluIG1zZy5cclxuICogVGhpcyBnaXZlcyB5b3UgYWRkaXRpb25hbCBjb250cm9sIG92ZXIgdGhlIGZvcm1hdCBvZiB0aGUgb3V0cHV0LlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGxvZyAobWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKSB7XHJcbiAgICByZXR1cm4gY2NMb2cobWVzc2FnZSwgLi4ub3B0aW9uYWxQYXJhbXMpO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIE91dHB1dHMgYSB3YXJuaW5nIG1lc3NhZ2UgdG8gdGhlIENvY29zIENyZWF0b3IgQ29uc29sZSAoZWRpdG9yKSBvciBXZWIgQ29uc29sZSAocnVudGltZSkuXHJcbiAqIC0gSW4gQ29jb3MgQ3JlYXRvciwgd2FybmluZyBpcyB5ZWxsb3cuXHJcbiAqIC0gSW4gQ2hyb21lLCB3YXJuaW5nIGhhdmUgYSB5ZWxsb3cgd2FybmluZyBpY29uIHdpdGggdGhlIG1lc3NhZ2UgdGV4dC5cclxuICogQHpoXHJcbiAqIOi+k+WHuuitpuWRiua2iOaBr+WIsCBDb2NvcyBDcmVhdG9yIOe8lui+keWZqOeahCBDb25zb2xlIOaIlui/kOihjOaXtiBXZWIg56uv55qEIENvbnNvbGUg5Lit44CCPGJyLz5cclxuICogLSDlnKggQ29jb3MgQ3JlYXRvciDkuK3vvIzorablkYrkv6Hmga/mmL7npLrmmK/pu4ToibLnmoTjgII8YnIvPlxyXG4gKiAtIOWcqCBDaHJvbWUg5Lit77yM6K2m5ZGK5L+h5oGv5pyJ552A6buE6Imy55qE5Zu+5qCH5Lul5Y+K6buE6Imy55qE5raI5oGv5paH5pys44CCPGJyLz5cclxuICogQHBhcmFtIG1lc3NhZ2UgLSBBIEphdmFTY3JpcHQgc3RyaW5nIGNvbnRhaW5pbmcgemVybyBvciBtb3JlIHN1YnN0aXR1dGlvbiBzdHJpbmdzLlxyXG4gKiBAcGFyYW0gb3B0aW9uYWxQYXJhbXMgLSBKYXZhU2NyaXB0IG9iamVjdHMgd2l0aCB3aGljaCB0byByZXBsYWNlIHN1YnN0aXR1dGlvbiBzdHJpbmdzIHdpdGhpbiBtc2cuXHJcbiAqIFRoaXMgZ2l2ZXMgeW91IGFkZGl0aW9uYWwgY29udHJvbCBvdmVyIHRoZSBmb3JtYXQgb2YgdGhlIG91dHB1dC5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB3YXJuIChtZXNzYWdlPzogYW55LCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pIHtcclxuICAgIHJldHVybiBjY1dhcm4obWVzc2FnZSwgLi4ub3B0aW9uYWxQYXJhbXMpO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIE91dHB1dHMgYW4gZXJyb3IgbWVzc2FnZSB0byB0aGUgQ29jb3MgQ3JlYXRvciBDb25zb2xlIChlZGl0b3IpIG9yIFdlYiBDb25zb2xlIChydW50aW1lKS48YnIvPlxyXG4gKiAtIEluIENvY29zIENyZWF0b3IsIGVycm9yIGlzIHJlZC48YnIvPlxyXG4gKiAtIEluIENocm9tZSwgZXJyb3IgaGF2ZSBhIHJlZCBpY29uIGFsb25nIHdpdGggcmVkIG1lc3NhZ2UgdGV4dC48YnIvPlxyXG4gKiBAemhcclxuICog6L6T5Ye66ZSZ6K+v5raI5oGv5YiwIENvY29zIENyZWF0b3Ig57yW6L6R5Zmo55qEIENvbnNvbGUg5oiW6L+Q6KGM5pe26aG16Z2i56uv55qEIENvbnNvbGUg5Lit44CCPGJyLz5cclxuICogLSDlnKggQ29jb3MgQ3JlYXRvciDkuK3vvIzplJnor6/kv6Hmga/mmL7npLrmmK/nuqLoibLnmoTjgII8YnIvPlxyXG4gKiAtIOWcqCBDaHJvbWUg5Lit77yM6ZSZ6K+v5L+h5oGv5pyJ57qi6Imy55qE5Zu+5qCH5Lul5Y+K57qi6Imy55qE5raI5oGv5paH5pys44CCPGJyLz5cclxuICogQHBhcmFtIG1lc3NhZ2UgLSBBIEphdmFTY3JpcHQgc3RyaW5nIGNvbnRhaW5pbmcgemVybyBvciBtb3JlIHN1YnN0aXR1dGlvbiBzdHJpbmdzLlxyXG4gKiBAcGFyYW0gb3B0aW9uYWxQYXJhbXMgLSBKYXZhU2NyaXB0IG9iamVjdHMgd2l0aCB3aGljaCB0byByZXBsYWNlIHN1YnN0aXR1dGlvbiBzdHJpbmdzIHdpdGhpbiBtc2cuXHJcbiAqIFRoaXMgZ2l2ZXMgeW91IGFkZGl0aW9uYWwgY29udHJvbCBvdmVyIHRoZSBmb3JtYXQgb2YgdGhlIG91dHB1dC5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBlcnJvciAobWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKSB7XHJcbiAgICByZXR1cm4gY2NFcnJvcihtZXNzYWdlLCAuLi5vcHRpb25hbFBhcmFtcyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogQXNzZXJ0IHRoZSBjb25kaXRpb24gYW5kIG91dHB1dCBlcnJvciBtZXNzYWdlcyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCB0cnVlLlxyXG4gKiBAemhcclxuICog5a+55qOA5p+l5rWL6K+V5p2h5Lu26L+b6KGM5qOA5p+l77yM5aaC5p6c5p2h5Lu25LiN5Li6IHRydWUg5YiZ6L6T5Ye66ZSZ6K+v5raI5oGvXHJcbiAqIEBwYXJhbSB2YWx1ZSAtIFRoZSBjb25kaXRpb24gdG8gY2hlY2sgb25cclxuICogQHBhcmFtIG1lc3NhZ2UgLSBBIEphdmFTY3JpcHQgc3RyaW5nIGNvbnRhaW5pbmcgemVybyBvciBtb3JlIHN1YnN0aXR1dGlvbiBzdHJpbmdzLlxyXG4gKiBAcGFyYW0gb3B0aW9uYWxQYXJhbXMgLSBKYXZhU2NyaXB0IG9iamVjdHMgd2l0aCB3aGljaCB0byByZXBsYWNlIHN1YnN0aXR1dGlvbiBzdHJpbmdzIHdpdGhpbiBtc2cuXHJcbiAqIFRoaXMgZ2l2ZXMgeW91IGFkZGl0aW9uYWwgY29udHJvbCBvdmVyIHRoZSBmb3JtYXQgb2YgdGhlIG91dHB1dC5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnQgKHZhbHVlOiBhbnksIG1lc3NhZ2U/OiBzdHJpbmcsIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSkge1xyXG4gICAgcmV0dXJuIGNjQXNzZXJ0KHZhbHVlLCBtZXNzYWdlLCAuLi5vcHRpb25hbFBhcmFtcyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfcmVzZXREZWJ1Z1NldHRpbmcgKG1vZGU6IERlYnVnTW9kZSkge1xyXG4gICAgLy8gcmVzZXRcclxuICAgIGNjTG9nID0gY2NXYXJuID0gY2NFcnJvciA9IGNjQXNzZXJ0ID0gKCkgPT4ge1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAobW9kZSA9PT0gRGVidWdNb2RlLk5PTkUpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1vZGUgPiBEZWJ1Z01vZGUuRVJST1IpIHtcclxuICAgICAgICAvLyBMb2cgdG8gd2ViIHBhZ2UuXHJcbiAgICAgICAgY29uc3QgbG9nVG9XZWJQYWdlID0gKG1zZzogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghbGVnYWN5Q0MuZ2FtZS5jYW52YXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFsb2dMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2dEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdEaXYnKTtcclxuICAgICAgICAgICAgICAgIGxvZ0Rpdi5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2xvZ0luZm9EaXYnKTtcclxuICAgICAgICAgICAgICAgIGxvZ0Rpdi5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzIwMCcpO1xyXG4gICAgICAgICAgICAgICAgbG9nRGl2LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgbGVnYWN5Q0MuZ2FtZS5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxvZ0RpdlN0eWxlID0gbG9nRGl2LnN0eWxlO1xyXG4gICAgICAgICAgICAgICAgbG9nRGl2U3R5bGUuekluZGV4ID0gJzk5OTk5JztcclxuICAgICAgICAgICAgICAgIGxvZ0RpdlN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgICAgICAgICAgICAgIGxvZ0RpdlN0eWxlLnRvcCA9IGxvZ0RpdlN0eWxlLmxlZnQgPSAnMCc7XHJcblxyXG4gICAgICAgICAgICAgICAgbG9nTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XHJcbiAgICAgICAgICAgICAgICBsb2dMaXN0LnNldEF0dHJpYnV0ZSgncm93cycsICcyMCcpO1xyXG4gICAgICAgICAgICAgICAgbG9nTGlzdC5zZXRBdHRyaWJ1dGUoJ2NvbHMnLCAnMzAnKTtcclxuICAgICAgICAgICAgICAgIGxvZ0xpc3Quc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICd0cnVlJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2dMaXN0U3R5bGUgPSBsb2dMaXN0LnN0eWxlO1xyXG4gICAgICAgICAgICAgICAgbG9nTGlzdFN0eWxlLmJhY2tncm91bmRDb2xvciA9ICd0cmFuc3BhcmVudCc7XHJcbiAgICAgICAgICAgICAgICBsb2dMaXN0U3R5bGUuYm9yZGVyQm90dG9tID0gJzFweCBzb2xpZCAjY2NjY2NjJztcclxuICAgICAgICAgICAgICAgIGxvZ0xpc3RTdHlsZS5ib3JkZXJUb3BXaWR0aCA9IGxvZ0xpc3RTdHlsZS5ib3JkZXJMZWZ0V2lkdGggPSBsb2dMaXN0U3R5bGUuYm9yZGVyUmlnaHRXaWR0aCA9ICcwcHgnO1xyXG4gICAgICAgICAgICAgICAgbG9nTGlzdFN0eWxlLmJvcmRlclRvcFN0eWxlID0gbG9nTGlzdFN0eWxlLmJvcmRlckxlZnRTdHlsZSA9IGxvZ0xpc3RTdHlsZS5ib3JkZXJSaWdodFN0eWxlID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAgICAgbG9nTGlzdFN0eWxlLnBhZGRpbmcgPSAnMHB4JztcclxuICAgICAgICAgICAgICAgIGxvZ0xpc3RTdHlsZS5tYXJnaW4gPSAnMHB4JztcclxuXHJcbiAgICAgICAgICAgICAgICBsb2dEaXYuYXBwZW5kQ2hpbGQobG9nTGlzdCk7XHJcbiAgICAgICAgICAgICAgICBsZWdhY3lDQy5nYW1lLmNhbnZhcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGxvZ0Rpdik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxvZ0xpc3QudmFsdWUgPSBsb2dMaXN0LnZhbHVlICsgbXNnICsgJ1xcclxcbic7XHJcbiAgICAgICAgICAgIGxvZ0xpc3Quc2Nyb2xsVG9wID0gbG9nTGlzdC5zY3JvbGxIZWlnaHQ7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY2NFcnJvciA9IChtZXNzYWdlPzogYW55LCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pID0+IHtcclxuICAgICAgICAgICAgbG9nVG9XZWJQYWdlKCdFUlJPUiA6ICAnICsgZm9ybWF0U3RyaW5nKG1lc3NhZ2UsIC4uLm9wdGlvbmFsUGFyYW1zKSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjY0Fzc2VydCA9IChjb25kaXRpb246IGFueSwgbWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghY29uZGl0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dUb1dlYlBhZ2UoJ0FTU0VSVDogJyArIGZvcm1hdFN0cmluZyhtZXNzYWdlLCAuLi5vcHRpb25hbFBhcmFtcykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAobW9kZSAhPT0gRGVidWdNb2RlLkVSUk9SX0ZPUl9XRUJfUEFHRSkge1xyXG4gICAgICAgICAgICBjY1dhcm4gPSAobWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsb2dUb1dlYlBhZ2UoJ1dBUk4gOiAgJyArIGZvcm1hdFN0cmluZyhtZXNzYWdlLCAuLi5vcHRpb25hbFBhcmFtcykpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobW9kZSA9PT0gRGVidWdNb2RlLklORk9fRk9SX1dFQl9QQUdFKSB7XHJcbiAgICAgICAgICAgIGNjTG9nID0gKG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbG9nVG9XZWJQYWdlKGZvcm1hdFN0cmluZyhtZXNzYWdlLCAuLi5vcHRpb25hbFBhcmFtcykpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGNvbnNvbGUgJiYgY29uc29sZS5sb2cuYXBwbHkpIHsvLyBjb25zb2xlIGlzIG51bGwgd2hlbiB1c2VyIGRvZXNuJ3Qgb3BlbiBkZXYgdG9vbCBvbiBJRTlcclxuICAgICAgICAvLyBMb2cgdG8gY29uc29sZS5cclxuXHJcbiAgICAgICAgLy8gRm9yIEpTQlxyXG4gICAgICAgIGlmICghY29uc29sZS5lcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yID0gY29uc29sZS5sb2c7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghY29uc29sZS53YXJuKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybiA9IGNvbnNvbGUubG9nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEVESVRPUiB8fCBjb25zb2xlLmVycm9yLmJpbmQpIHtcclxuICAgICAgICAgICAgLy8gdXNlIGJpbmQgdG8gYXZvaWQgcG9sbHV0ZSBjYWxsIHN0YWNrc1xyXG4gICAgICAgICAgICBjY0Vycm9yID0gY29uc29sZS5lcnJvci5iaW5kKGNvbnNvbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY2NFcnJvciA9IEpTQiA/IGNvbnNvbGUuZXJyb3IgOiAobWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvci5hcHBseShjb25zb2xlLCBbbWVzc2FnZSwgLi4ub3B0aW9uYWxQYXJhbXNdKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2NBc3NlcnQgPSAoY29uZGl0aW9uOiBhbnksIG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWNvbmRpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3JUZXh0ID0gZm9ybWF0U3RyaW5nKG1lc3NhZ2UsIC4uLm9wdGlvbmFsUGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIGlmIChERVYpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTpuby1kZWJ1Z2dlclxyXG4gICAgICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yVGV4dCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChtb2RlICE9PSBEZWJ1Z01vZGUuRVJST1IpIHtcclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIGNjV2FybiA9IGNvbnNvbGUud2Fybi5iaW5kKGNvbnNvbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjb25zb2xlLndhcm4uYmluZCkge1xyXG4gICAgICAgICAgICAvLyB1c2UgYmluZCB0byBhdm9pZCBwb2xsdXRlIGNhbGwgc3RhY2tzXHJcbiAgICAgICAgICAgIGNjV2FybiA9IGNvbnNvbGUud2Fybi5iaW5kKGNvbnNvbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY2NXYXJuID0gSlNCID8gY29uc29sZS53YXJuIDogKG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUud2Fybi5hcHBseShjb25zb2xlLCBbbWVzc2FnZSwgLi4ub3B0aW9uYWxQYXJhbXNdKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgIGNjTG9nID0gY29uc29sZS5sb2cuYmluZChjb25zb2xlKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG1vZGUgPT09IERlYnVnTW9kZS5JTkZPKSB7XHJcbiAgICAgICAgaWYgKEpTQikge1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIGlmIChzY3JpcHRFbmdpbmVUeXBlID09PSAnSmF2YVNjcmlwdENvcmUnKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyBoYXMgdG8gdXNlIGBjb25zb2xlYCBhcyBpdHMgY29udGV4dCBmb3IgaU9TIDh+OS4gVGhlcmVmb3JlLCBhcHBseSBpdC5cclxuICAgICAgICAgICAgICAgIGNjTG9nID0gKG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBbbWVzc2FnZSwgLi4ub3B0aW9uYWxQYXJhbXNdKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjY0xvZyA9IGNvbnNvbGUubG9nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGNvbnNvbGUubG9nLmJpbmQpIHtcclxuICAgICAgICAgICAgLy8gdXNlIGJpbmQgdG8gYXZvaWQgcG9sbHV0ZSBjYWxsIHN0YWNrc1xyXG4gICAgICAgICAgICBjY0xvZyA9IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjY0xvZyA9IChtZXNzYWdlPzogYW55LCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBbbWVzc2FnZSwgLi4ub3B0aW9uYWxQYXJhbXNdKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfdGhyb3cgKGVycm9yXzogYW55KSB7XHJcbiAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgcmV0dXJuIGVycm9yKGVycm9yXyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHN0YWNrID0gZXJyb3JfLnN0YWNrO1xyXG4gICAgICAgIGlmIChzdGFjaykge1xyXG4gICAgICAgICAgICBlcnJvcihKU0IgPyAoZXJyb3JfICsgJ1xcbicgKyBzdGFjaykgOiBzdGFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBlcnJvcihlcnJvcl8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VHlwZWRGb3JtYXR0ZXIgKHR5cGU6ICdMb2cnIHwgJ1dhcm5pbmcnIHwgJ0Vycm9yJyB8ICdBc3NlcnQnKSB7XHJcbiAgICByZXR1cm4gKGlkOiBudW1iZXIsIC4uLmFyZ3M6IGFueVtdKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbXNnID0gREVCVUcgPyAoZGVidWdJbmZvc1tpZF0gfHwgJ3Vua25vd24gaWQnKSA6IGAke3R5cGV9ICR7aWR9LCBwbGVhc2UgZ28gdG8gJHtFUlJPUl9NQVBfVVJMfSMke2lkfSB0byBzZWUgZGV0YWlscy5gO1xyXG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbXNnO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gREVCVUcgPyBmb3JtYXRTdHJpbmcobXNnLCAuLi5hcmdzKSA6IG1zZyArICcgQXJndW1lbnRzOiAnICsgYXJncy5qb2luKCcsICcpO1xyXG4gICAgfTtcclxufVxyXG5cclxuY29uc3QgbG9nRm9ybWF0dGVyID0gZ2V0VHlwZWRGb3JtYXR0ZXIoJ0xvZycpO1xyXG5leHBvcnQgZnVuY3Rpb24gbG9nSUQgKGlkOiBudW1iZXIsIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSkge1xyXG4gICAgbG9nKGxvZ0Zvcm1hdHRlcihpZCwgLi4ub3B0aW9uYWxQYXJhbXMpKTtcclxufVxyXG5cclxuY29uc3Qgd2FybkZvcm1hdHRlciA9IGdldFR5cGVkRm9ybWF0dGVyKCdXYXJuaW5nJyk7XHJcbmV4cG9ydCBmdW5jdGlvbiB3YXJuSUQgKGlkOiBudW1iZXIsIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSkge1xyXG4gICAgd2Fybih3YXJuRm9ybWF0dGVyKGlkLCAuLi5vcHRpb25hbFBhcmFtcykpO1xyXG59XHJcblxyXG5jb25zdCBlcnJvckZvcm1hdHRlciA9IGdldFR5cGVkRm9ybWF0dGVyKCdFcnJvcicpO1xyXG5leHBvcnQgZnVuY3Rpb24gZXJyb3JJRCAoaWQ6IG51bWJlciwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKSB7XHJcbiAgICBlcnJvcihlcnJvckZvcm1hdHRlcihpZCwgLi4ub3B0aW9uYWxQYXJhbXMpKTtcclxufVxyXG5cclxuY29uc3QgYXNzZXJ0Rm9ybWF0dGVyID0gZ2V0VHlwZWRGb3JtYXR0ZXIoJ0Fzc2VydCcpO1xyXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0SUQgKGNvbmRpdGlvbjogYW55LCBpZDogbnVtYmVyLCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pIHtcclxuICAgIGlmIChjb25kaXRpb24pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBhc3NlcnQoZmFsc2UsIGFzc2VydEZvcm1hdHRlcihpZCwgLi4ub3B0aW9uYWxQYXJhbXMpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiBFbnVtIGZvciBkZWJ1ZyBtb2Rlcy5cclxuICogQHpoIOiwg+ivleaooeW8j1xyXG4gKi9cclxuZXhwb3J0IGVudW0gRGVidWdNb2RlIHtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBkZWJ1ZyBtb2RlIG5vbmUuXHJcbiAgICAgKiBAemgg56aB5q2i5qih5byP77yM56aB5q2i5pi+56S65Lu75L2V5pel5b+X5L+h5oGv44CCXHJcbiAgICAgKi9cclxuICAgIE5PTkUgPSAwLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBkZWJ1ZyBtb2RlIGluZm8uXHJcbiAgICAgKiBAemgg5L+h5oGv5qih5byP77yM5ZyoIGNvbnNvbGUg5Lit5pi+56S65omA5pyJ5pel5b+X44CCXHJcbiAgICAgKi9cclxuICAgIElORk8gPSAxLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBkZWJ1ZyBtb2RlIHdhcm4uXHJcbiAgICAgKiBAemgg6K2m5ZGK5qih5byP77yM5ZyoIGNvbnNvbGUg5Lit5Y+q5pi+56S6IHdhcm4g57qn5Yir5Lul5LiK55qE77yI5YyF5ZCrIGVycm9y77yJ5pel5b+X44CCXHJcbiAgICAgKi9cclxuICAgIFdBUk4gPSAyLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBkZWJ1ZyBtb2RlIGVycm9yLlxyXG4gICAgICogQHpoIOmUmeivr+aooeW8j++8jOWcqCBjb25zb2xlIOS4reWPquaYvuekuiBlcnJvciDml6Xlv5fjgIJcclxuICAgICAqL1xyXG4gICAgRVJST1IgPSAzLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBkZWJ1ZyBtb2RlIGluZm8gZm9yIHdlYiBwYWdlLlxyXG4gICAgICogQHpoIOS/oeaBr+aooeW8j++8iOS7hSBXRUIg56uv5pyJ5pWI77yJ77yM5Zyo55S76Z2i5LiK6L6T5Ye65omA5pyJ5L+h5oGv44CCXHJcbiAgICAgKi9cclxuICAgIElORk9fRk9SX1dFQl9QQUdFID0gNCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZGVidWcgbW9kZSB3YXJuIGZvciB3ZWIgcGFnZS5cclxuICAgICAqIEB6aCDorablkYrmqKHlvI/vvIjku4UgV0VCIOerr+acieaViO+8ie+8jOWcqOeUu+mdouS4iui+k+WHuiB3YXJuIOe6p+WIq+S7peS4iueahO+8iOWMheWQqyBlcnJvcu+8ieS/oeaBr+OAglxyXG4gICAgICovXHJcbiAgICBXQVJOX0ZPUl9XRUJfUEFHRSA9IDUsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGRlYnVnIG1vZGUgZXJyb3IgZm9yIHdlYiBwYWdlLlxyXG4gICAgICogQHpoIOmUmeivr+aooeW8j++8iOS7hSBXRUIg56uv5pyJ5pWI77yJ77yM5Zyo55S76Z2i5LiK6L6T5Ye6IGVycm9yIOS/oeaBr+OAglxyXG4gICAgICovXHJcbiAgICBFUlJPUl9GT1JfV0VCX1BBR0UgPSA2LFxyXG59XHJcblxyXG4vKipcclxuICogQGVuIEdldHMgZXJyb3IgbWVzc2FnZSB3aXRoIHRoZSBlcnJvciBpZCBhbmQgcG9zc2libGUgcGFyYW1ldGVycy5cclxuICogQHpoIOmAmui/hyBlcnJvciBpZCDlkozlv4XopoHnmoTlj4LmlbDmnaXojrflj5bplJnor6/kv6Hmga/jgIJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRFcnJvciAoZXJyb3JJZDogYW55LCAuLi5wYXJhbTogYW55W10pOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGVycm9yRm9ybWF0dGVyKGVycm9ySWQsIC4uLnBhcmFtKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRvIGRpc3BsYXkgdGhlIEZQUyBhbmQgZGVidWcgaW5mb3JtYXRpb24uXHJcbiAqIEB6aCDmmK/lkKbmmL7npLogRlBTIOS/oeaBr+WSjOmDqOWIhuiwg+ivleS/oeaBr+OAglxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzRGlzcGxheVN0YXRzICgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiBsZWdhY3lDQy5wcm9maWxlciA/IGxlZ2FjeUNDLnByb2ZpbGVyLmlzU2hvd2luZ1N0YXRzKCkgOiBmYWxzZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiBTZXRzIHdoZXRoZXIgZGlzcGxheSB0aGUgRlBTIGFuZCBkZWJ1ZyBpbmZvcm1hdGlvbnMgb24gdGhlIGJvdHRvbS1sZWZ0IGNvcm5lci5cclxuICogQHpoIOiuvue9ruaYr+WQpuWcqOW3puS4i+inkuaYvuekuiBGUFMg5ZKM6YOo5YiG6LCD6K+V44CCXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2V0RGlzcGxheVN0YXRzIChkaXNwbGF5U3RhdHM6IGJvb2xlYW4pIHtcclxuICAgIGlmIChsZWdhY3lDQy5wcm9maWxlcikge1xyXG4gICAgICAgIGRpc3BsYXlTdGF0cyA/IGxlZ2FjeUNDLnByb2ZpbGVyLnNob3dTdGF0cygpIDogbGVnYWN5Q0MucHJvZmlsZXIuaGlkZVN0YXRzKCk7XHJcbiAgICAgICAgbGVnYWN5Q0MuZ2FtZS5jb25maWcuc2hvd0ZQUyA9ICEhZGlzcGxheVN0YXRzO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==