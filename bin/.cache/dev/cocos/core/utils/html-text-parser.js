(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../default-constants.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../default-constants.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.defaultConstants, global.globalExports);
    global.htmlTextParser = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.HtmlTextParser = void 0;

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   *
   */
  var eventRegx = /^(click)(\s)*=|(param)(\s)*=/;
  var imageAttrReg = /(\s)*src(\s)*=|(\s)*height(\s)*=|(\s)*width(\s)*=|(\s)*align(\s)*=|(\s)*offset(\s)*=|(\s)*click(\s)*=|(\s)*param(\s)*=/;
  /**
   * A utils class for parsing HTML texts. The parsed results will be an object array.
   */

  var HtmlTextParser = /*#__PURE__*/function () {
    function HtmlTextParser() {
      _classCallCheck(this, HtmlTextParser);

      this._specialSymbolArray = [];
      this._stack = [];
      this._resultObjectArray = [];

      this._specialSymbolArray.push([/&lt;/g, '<']);

      this._specialSymbolArray.push([/&gt;/g, '>']);

      this._specialSymbolArray.push([/&amp;/g, '&']);

      this._specialSymbolArray.push([/&quot;/g, '"']);

      this._specialSymbolArray.push([/&apos;/g, '\'']);
    }

    _createClass(HtmlTextParser, [{
      key: "parse",
      value: function parse(htmlString) {
        this._resultObjectArray.length = 0;
        this._stack.length = 0;
        var startIndex = 0;
        var length = htmlString.length;

        while (startIndex < length) {
          var tagEndIndex = htmlString.indexOf('>', startIndex);
          var tagBeginIndex = -1;

          if (tagEndIndex >= 0) {
            tagBeginIndex = htmlString.lastIndexOf('<', tagEndIndex);
            var noTagBegin = tagBeginIndex < startIndex - 1;

            if (noTagBegin) {
              tagBeginIndex = htmlString.indexOf('<', tagEndIndex + 1);
              tagEndIndex = htmlString.indexOf('>', tagBeginIndex + 1);
            }
          }

          if (tagBeginIndex < 0) {
            this._stack.pop();

            this._processResult(htmlString.substring(startIndex));

            startIndex = length;
          } else {
            var newStr = htmlString.substring(startIndex, tagBeginIndex);
            var tagStr = htmlString.substring(tagBeginIndex + 1, tagEndIndex);
            if (tagStr === "") newStr = htmlString.substring(startIndex, tagEndIndex + 1);

            this._processResult(newStr);

            if (tagEndIndex === -1) {
              // cc.error('The HTML tag is invalid!');
              tagEndIndex = tagBeginIndex;
            } else if (htmlString.charAt(tagBeginIndex + 1) === '\/') {
              this._stack.pop();
            } else {
              this._addToStack(tagStr);
            }

            startIndex = tagEndIndex + 1;
          }
        }

        return this._resultObjectArray;
      }
    }, {
      key: "_attributeToObject",
      value: function _attributeToObject(attribute) {
        attribute = attribute.trim();
        var obj = {};
        var header = attribute.match(/^(color|size)(\s)*=/);
        var tagName = '';
        var nextSpace = 0;
        var eventHanlderString = '';

        if (header) {
          tagName = header[0];
          attribute = attribute.substring(tagName.length).trim();

          if (attribute === '') {
            return obj;
          } // parse color


          nextSpace = attribute.indexOf(' ');

          switch (tagName[0]) {
            case 'c':
              if (nextSpace > -1) {
                obj.color = attribute.substring(0, nextSpace).trim();
              } else {
                obj.color = attribute;
              }

              break;

            case 's':
              obj.size = parseInt(attribute);
              break;
          } // tag has event arguments


          if (nextSpace > -1) {
            eventHanlderString = attribute.substring(nextSpace + 1).trim();
            obj.event = this._processEventHandler(eventHanlderString);
          }

          return obj;
        }

        header = attribute.match(/^(br(\s)*\/)/);

        if (header && header[0].length > 0) {
          tagName = header[0].trim();

          if (tagName.startsWith('br') && tagName[tagName.length - 1] === '/') {
            obj.isNewLine = true;

            this._resultObjectArray.push({
              text: '',
              style: {
                isNewLine: true
              }
            });

            return obj;
          }
        }

        header = attribute.match(/^(img(\s)*src(\s)*=[^>]+\/)/);
        var remainingArgument = '';

        if (header && header[0].length > 0) {
          tagName = header[0].trim();

          if (tagName.startsWith('img') && tagName[tagName.length - 1] === '/') {
            header = attribute.match(imageAttrReg);
            var tagValue;
            var isValidImageTag = false;

            while (header) {
              // skip the invalid tags at first
              attribute = attribute.substring(attribute.indexOf(header[0]));
              tagName = attribute.substr(0, header[0].length); // remove space and = character

              remainingArgument = attribute.substring(tagName.length).trim();
              nextSpace = remainingArgument.indexOf(' ');
              tagValue = nextSpace > -1 ? remainingArgument.substr(0, nextSpace) : remainingArgument;
              tagName = tagName.replace(/[^a-zA-Z]/g, '').trim();
              tagName = tagName.toLocaleLowerCase();
              attribute = remainingArgument.substring(nextSpace).trim();
              if (tagValue.endsWith('\/')) tagValue = tagValue.slice(0, -1);

              if (tagName === 'src') {
                switch (tagValue.charCodeAt(0)) {
                  case 34: // "

                  case 39:
                    // '
                    isValidImageTag = true;
                    tagValue = tagValue.slice(1, -1);
                    break;
                }

                obj.isImage = true;
                obj.src = tagValue;
              } else if (tagName === 'height') {
                obj.imageHeight = parseInt(tagValue);
              } else if (tagName === 'width') {
                obj.imageWidth = parseInt(tagValue);
              } else if (tagName === "align") {
                switch (tagValue.charCodeAt(0)) {
                  case 34: // "

                  case 39:
                    // '
                    tagValue = tagValue.slice(1, -1);
                    break;
                }

                obj.imageAlign = tagValue.toLocaleLowerCase();
              } else if (tagName === "offset") {
                obj.imageOffset = tagValue;
              } else if (tagName === 'click') {
                obj.event = this._processEventHandler(tagName + '=' + tagValue);
              }

              if (obj.event && tagName === 'param') {
                obj.event[tagName] = tagValue.replace(/^\"|\"$/g, '');
              }

              header = attribute.match(imageAttrReg);
            }

            if (isValidImageTag && obj.isImage) {
              this._resultObjectArray.push({
                text: '',
                style: obj
              });
            }

            return {};
          }
        }

        header = attribute.match(/^(outline(\s)*[^>]*)/);

        if (header) {
          attribute = header[0].substring('outline'.length).trim();
          var defaultOutlineObject = {
            color: '#ffffff',
            width: 1
          };

          if (attribute) {
            var outlineAttrReg = /(\s)*color(\s)*=|(\s)*width(\s)*=|(\s)*click(\s)*=|(\s)*param(\s)*=/;
            header = attribute.match(outlineAttrReg);

            var _tagValue;

            while (header) {
              // skip the invalid tags at first
              attribute = attribute.substring(attribute.indexOf(header[0]));
              tagName = attribute.substr(0, header[0].length); // remove space and = character

              remainingArgument = attribute.substring(tagName.length).trim();
              nextSpace = remainingArgument.indexOf(' ');

              if (nextSpace > -1) {
                _tagValue = remainingArgument.substr(0, nextSpace);
              } else {
                _tagValue = remainingArgument;
              }

              tagName = tagName.replace(/[^a-zA-Z]/g, '').trim();
              tagName = tagName.toLocaleLowerCase();
              attribute = remainingArgument.substring(nextSpace).trim();

              if (tagName === 'click') {
                obj.event = this._processEventHandler(tagName + '=' + _tagValue);
              } else if (tagName === 'color') {
                defaultOutlineObject.color = _tagValue;
              } else if (tagName === 'width') {
                defaultOutlineObject.width = parseInt(_tagValue);
              }

              if (obj.event && tagName === 'param') {
                obj.event[tagName] = _tagValue.replace(/^\"|\"$/g, '');
              }

              header = attribute.match(outlineAttrReg);
            }
          }

          obj.outline = defaultOutlineObject;
        }

        header = attribute.match(/^(on|u|b|i)(\s)*/);

        if (header && header[0].length > 0) {
          tagName = header[0];
          attribute = attribute.substring(tagName.length).trim();

          switch (tagName[0]) {
            case 'u':
              obj.underline = true;
              break;

            case 'i':
              obj.italic = true;
              break;

            case 'b':
              obj.bold = true;
              break;
          }

          if (attribute === '') {
            return obj;
          }

          obj.event = this._processEventHandler(attribute);
        }

        return obj;
      }
    }, {
      key: "_processEventHandler",
      value: function _processEventHandler(eventString) {
        var obj = new Map();
        var index = 0;
        var isValidTag = false;
        var eventNames = eventString.match(eventRegx);

        while (eventNames) {
          var eventName = eventNames[0];
          var eventValue = '';
          isValidTag = false;
          eventString = eventString.substring(eventName.length).trim();

          if (eventString.charAt(0) === '\"') {
            index = eventString.indexOf('\"', 1);

            if (index > -1) {
              eventValue = eventString.substring(1, index).trim();
              isValidTag = true;
            }

            index++;
          } else if (eventString.charAt(0) === '\'') {
            index = eventString.indexOf('\'', 1);

            if (index > -1) {
              eventValue = eventString.substring(1, index).trim();
              isValidTag = true;
            }

            index++;
          } else {
            // skip the invalid attribute value
            var match = eventString.match(/(\S)+/);

            if (match) {
              eventValue = match[0];
            } else {
              eventValue = '';
            }

            index = eventValue.length;
          }

          if (isValidTag) {
            eventName = eventName.substring(0, eventName.length - 1).trim();
            obj[eventName] = eventValue;
          }

          eventString = eventString.substring(index).trim();
          eventNames = eventString.match(eventRegx);
        }

        return obj;
      }
    }, {
      key: "_addToStack",
      value: function _addToStack(attribute) {
        var obj = this._attributeToObject(attribute);

        if (this._stack.length === 0) {
          this._stack.push(obj);
        } else {
          if (obj.isNewLine || obj.isImage) {
            return;
          } // for nested tags


          var previousTagObj = this._stack[this._stack.length - 1];

          for (var key in previousTagObj) {
            if (!obj[key]) {
              obj[key] = previousTagObj[key];
            }
          }

          this._stack.push(obj);
        }
      }
    }, {
      key: "_processResult",
      value: function _processResult(value) {
        if (value.length === 0) {
          return;
        }

        value = this._escapeSpecialSymbol(value);

        if (this._stack.length > 0) {
          this._resultObjectArray.push({
            text: value,
            style: this._stack[this._stack.length - 1]
          });
        } else {
          this._resultObjectArray.push({
            text: value
          });
        }
      }
    }, {
      key: "_escapeSpecialSymbol",
      value: function _escapeSpecialSymbol(str) {
        var _iterator = _createForOfIteratorHelper(this._specialSymbolArray),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var symbolArr = _step.value;
            var key = symbolArr[0];
            var value = symbolArr[1];
            str = str.replace(key, value);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return str;
      }
    }]);

    return HtmlTextParser;
  }();

  _exports.HtmlTextParser = HtmlTextParser;

  if (_defaultConstants.TEST) {
    _globalExports.legacyCC._Test.HtmlTextParser = HtmlTextParser;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvdXRpbHMvaHRtbC10ZXh0LXBhcnNlci50cyJdLCJuYW1lcyI6WyJldmVudFJlZ3giLCJpbWFnZUF0dHJSZWciLCJIdG1sVGV4dFBhcnNlciIsIl9zcGVjaWFsU3ltYm9sQXJyYXkiLCJfc3RhY2siLCJfcmVzdWx0T2JqZWN0QXJyYXkiLCJwdXNoIiwiaHRtbFN0cmluZyIsImxlbmd0aCIsInN0YXJ0SW5kZXgiLCJ0YWdFbmRJbmRleCIsImluZGV4T2YiLCJ0YWdCZWdpbkluZGV4IiwibGFzdEluZGV4T2YiLCJub1RhZ0JlZ2luIiwicG9wIiwiX3Byb2Nlc3NSZXN1bHQiLCJzdWJzdHJpbmciLCJuZXdTdHIiLCJ0YWdTdHIiLCJjaGFyQXQiLCJfYWRkVG9TdGFjayIsImF0dHJpYnV0ZSIsInRyaW0iLCJvYmoiLCJoZWFkZXIiLCJtYXRjaCIsInRhZ05hbWUiLCJuZXh0U3BhY2UiLCJldmVudEhhbmxkZXJTdHJpbmciLCJjb2xvciIsInNpemUiLCJwYXJzZUludCIsImV2ZW50IiwiX3Byb2Nlc3NFdmVudEhhbmRsZXIiLCJzdGFydHNXaXRoIiwiaXNOZXdMaW5lIiwidGV4dCIsInN0eWxlIiwicmVtYWluaW5nQXJndW1lbnQiLCJ0YWdWYWx1ZSIsImlzVmFsaWRJbWFnZVRhZyIsInN1YnN0ciIsInJlcGxhY2UiLCJ0b0xvY2FsZUxvd2VyQ2FzZSIsImVuZHNXaXRoIiwic2xpY2UiLCJjaGFyQ29kZUF0IiwiaXNJbWFnZSIsInNyYyIsImltYWdlSGVpZ2h0IiwiaW1hZ2VXaWR0aCIsImltYWdlQWxpZ24iLCJpbWFnZU9mZnNldCIsImRlZmF1bHRPdXRsaW5lT2JqZWN0Iiwid2lkdGgiLCJvdXRsaW5lQXR0clJlZyIsIm91dGxpbmUiLCJ1bmRlcmxpbmUiLCJpdGFsaWMiLCJib2xkIiwiZXZlbnRTdHJpbmciLCJNYXAiLCJpbmRleCIsImlzVmFsaWRUYWciLCJldmVudE5hbWVzIiwiZXZlbnROYW1lIiwiZXZlbnRWYWx1ZSIsIl9hdHRyaWJ1dGVUb09iamVjdCIsInByZXZpb3VzVGFnT2JqIiwia2V5IiwidmFsdWUiLCJfZXNjYXBlU3BlY2lhbFN5bWJvbCIsInN0ciIsInN5bWJvbEFyciIsIlRFU1QiLCJsZWdhY3lDQyIsIl9UZXN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZCQTs7O0FBR0EsTUFBTUEsU0FBUyxHQUFHLDhCQUFsQjtBQUNBLE1BQU1DLFlBQVksR0FBRyx3SEFBckI7QUFDQTs7OztNQTBCYUMsYztBQUtULDhCQUFjO0FBQUE7O0FBQUEsV0FKTkMsbUJBSU0sR0FKeUMsRUFJekM7QUFBQSxXQUhOQyxNQUdNLEdBSDJCLEVBRzNCO0FBQUEsV0FGTkMsa0JBRU0sR0FGMkMsRUFFM0M7O0FBQ1YsV0FBS0YsbUJBQUwsQ0FBeUJHLElBQXpCLENBQThCLENBQUMsT0FBRCxFQUFVLEdBQVYsQ0FBOUI7O0FBQ0EsV0FBS0gsbUJBQUwsQ0FBeUJHLElBQXpCLENBQThCLENBQUMsT0FBRCxFQUFVLEdBQVYsQ0FBOUI7O0FBQ0EsV0FBS0gsbUJBQUwsQ0FBeUJHLElBQXpCLENBQThCLENBQUMsUUFBRCxFQUFXLEdBQVgsQ0FBOUI7O0FBQ0EsV0FBS0gsbUJBQUwsQ0FBeUJHLElBQXpCLENBQThCLENBQUMsU0FBRCxFQUFZLEdBQVosQ0FBOUI7O0FBQ0EsV0FBS0gsbUJBQUwsQ0FBeUJHLElBQXpCLENBQThCLENBQUMsU0FBRCxFQUFZLElBQVosQ0FBOUI7QUFDSDs7Ozs0QkFFYUMsVSxFQUFvQjtBQUM5QixhQUFLRixrQkFBTCxDQUF3QkcsTUFBeEIsR0FBaUMsQ0FBakM7QUFDQSxhQUFLSixNQUFMLENBQVlJLE1BQVosR0FBcUIsQ0FBckI7QUFFQSxZQUFJQyxVQUFVLEdBQUcsQ0FBakI7QUFDQSxZQUFNRCxNQUFNLEdBQUdELFVBQVUsQ0FBQ0MsTUFBMUI7O0FBQ0EsZUFBT0MsVUFBVSxHQUFHRCxNQUFwQixFQUE0QjtBQUN4QixjQUFJRSxX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b250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuaW1wb3J0IHsgVEVTVCB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuLyoqXHJcbiAqXHJcbiAqL1xyXG5jb25zdCBldmVudFJlZ3ggPSAvXihjbGljaykoXFxzKSo9fChwYXJhbSkoXFxzKSo9LztcclxuY29uc3QgaW1hZ2VBdHRyUmVnID0gLyhcXHMpKnNyYyhcXHMpKj18KFxccykqaGVpZ2h0KFxccykqPXwoXFxzKSp3aWR0aChcXHMpKj18KFxccykqYWxpZ24oXFxzKSo9fChcXHMpKm9mZnNldChcXHMpKj18KFxccykqY2xpY2soXFxzKSo9fChcXHMpKnBhcmFtKFxccykqPS87XHJcbi8qKlxyXG4gKiBBIHV0aWxzIGNsYXNzIGZvciBwYXJzaW5nIEhUTUwgdGV4dHMuIFRoZSBwYXJzZWQgcmVzdWx0cyB3aWxsIGJlIGFuIG9iamVjdCBhcnJheS5cclxuICovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElIdG1sVGV4dFBhcnNlclJlc3VsdE9iantcclxuICAgIHRleHQ/OiBzdHJpbmc7XHJcbiAgICBzdHlsZT86IElIdG1sVGV4dFBhcnNlclN0YWNrO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElIdG1sVGV4dFBhcnNlclN0YWNre1xyXG4gICAgY29sb3I/OiBzdHJpbmc7XHJcbiAgICBzaXplPzogbnVtYmVyO1xyXG4gICAgZXZlbnQ/OiBNYXA8c3RyaW5nLCBzdHJpbmc+O1xyXG4gICAgaXNOZXdMaW5lPzogYm9vbGVhbjtcclxuICAgIGlzSW1hZ2U/OiBib29sZWFuO1xyXG4gICAgc3JjPzogc3RyaW5nO1xyXG4gICAgaW1hZ2VXaWR0aD86IG51bWJlcjtcclxuICAgIGltYWdlSGVpZ2h0PzogbnVtYmVyO1xyXG4gICAgaW1hZ2VPZmZzZXQ/OiBzdHJpbmc7XHJcbiAgICBpbWFnZUFsaWduPzogc3RyaW5nO1xyXG4gICAgdW5kZXJsaW5lPzogYm9vbGVhbjtcclxuICAgIGl0YWxpYz86IGJvb2xlYW47XHJcbiAgICBib2xkPzogYm9vbGVhbjtcclxuICAgIG91dGxpbmU/OiB7IGNvbG9yOiBzdHJpbmcsIHdpZHRoOiBudW1iZXIgfTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEh0bWxUZXh0UGFyc2VyIHtcclxuICAgIHByaXZhdGUgX3NwZWNpYWxTeW1ib2xBcnJheTogQXJyYXk8W1JlZ0V4cCwgc3RyaW5nXT4gPSBbXTtcclxuICAgIHByaXZhdGUgX3N0YWNrOiBJSHRtbFRleHRQYXJzZXJTdGFja1tdID0gW107XHJcbiAgICBwcml2YXRlIF9yZXN1bHRPYmplY3RBcnJheTogSUh0bWxUZXh0UGFyc2VyUmVzdWx0T2JqW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKXtcclxuICAgICAgICB0aGlzLl9zcGVjaWFsU3ltYm9sQXJyYXkucHVzaChbLyZsdDsvZywgJzwnXSk7XHJcbiAgICAgICAgdGhpcy5fc3BlY2lhbFN5bWJvbEFycmF5LnB1c2goWy8mZ3Q7L2csICc+J10pO1xyXG4gICAgICAgIHRoaXMuX3NwZWNpYWxTeW1ib2xBcnJheS5wdXNoKFsvJmFtcDsvZywgJyYnXSk7XHJcbiAgICAgICAgdGhpcy5fc3BlY2lhbFN5bWJvbEFycmF5LnB1c2goWy8mcXVvdDsvZywgJ1wiJ10pO1xyXG4gICAgICAgIHRoaXMuX3NwZWNpYWxTeW1ib2xBcnJheS5wdXNoKFsvJmFwb3M7L2csICdcXCcnXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBhcnNlIChodG1sU3RyaW5nOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9yZXN1bHRPYmplY3RBcnJheS5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMuX3N0YWNrLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgIGxldCBzdGFydEluZGV4ID0gMDtcclxuICAgICAgICBjb25zdCBsZW5ndGggPSBodG1sU3RyaW5nLmxlbmd0aDtcclxuICAgICAgICB3aGlsZSAoc3RhcnRJbmRleCA8IGxlbmd0aCkge1xyXG4gICAgICAgICAgICBsZXQgdGFnRW5kSW5kZXggPSBodG1sU3RyaW5nLmluZGV4T2YoJz4nLCBzdGFydEluZGV4KTtcclxuICAgICAgICAgICAgbGV0IHRhZ0JlZ2luSW5kZXggPSAtMTtcclxuICAgICAgICAgICAgaWYgKHRhZ0VuZEluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgIHRhZ0JlZ2luSW5kZXggPSBodG1sU3RyaW5nLmxhc3RJbmRleE9mKCc8JywgdGFnRW5kSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5vVGFnQmVnaW4gPSB0YWdCZWdpbkluZGV4IDwgKHN0YXJ0SW5kZXggLSAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobm9UYWdCZWdpbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhZ0JlZ2luSW5kZXggPSBodG1sU3RyaW5nLmluZGV4T2YoJzwnLCB0YWdFbmRJbmRleCArIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhZ0VuZEluZGV4ID0gaHRtbFN0cmluZy5pbmRleE9mKCc+JywgdGFnQmVnaW5JbmRleCArIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0YWdCZWdpbkluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhY2sucG9wKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9jZXNzUmVzdWx0KGh0bWxTdHJpbmcuc3Vic3RyaW5nKHN0YXJ0SW5kZXgpKTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXggPSBsZW5ndGg7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3U3RyID0gaHRtbFN0cmluZy5zdWJzdHJpbmcoc3RhcnRJbmRleCwgdGFnQmVnaW5JbmRleCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFnU3RyID0gaHRtbFN0cmluZy5zdWJzdHJpbmcodGFnQmVnaW5JbmRleCArIDEsIHRhZ0VuZEluZGV4KTtcclxuICAgICAgICAgICAgICAgIGlmICh0YWdTdHIgPT09IFwiXCIpIG5ld1N0ciA9IGh0bWxTdHJpbmcuc3Vic3RyaW5nKHN0YXJ0SW5kZXgsIHRhZ0VuZEluZGV4ICsgMSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9jZXNzUmVzdWx0KG5ld1N0cik7XHJcbiAgICAgICAgICAgICAgICBpZiAodGFnRW5kSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY2MuZXJyb3IoJ1RoZSBIVE1MIHRhZyBpcyBpbnZhbGlkIScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhZ0VuZEluZGV4ID0gdGFnQmVnaW5JbmRleDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaHRtbFN0cmluZy5jaGFyQXQodGFnQmVnaW5JbmRleCArIDEpID09PSAnXFwvJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0YWNrLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGRUb1N0YWNrKHRhZ1N0cik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzdGFydEluZGV4ID0gdGFnRW5kSW5kZXggKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVzdWx0T2JqZWN0QXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfYXR0cmlidXRlVG9PYmplY3QgKGF0dHJpYnV0ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgYXR0cmlidXRlID0gYXR0cmlidXRlLnRyaW0oKTtcclxuXHJcbiAgICAgICAgY29uc3Qgb2JqOiBJSHRtbFRleHRQYXJzZXJTdGFjayA9IHt9O1xyXG4gICAgICAgIGxldCBoZWFkZXIgPSBhdHRyaWJ1dGUubWF0Y2goL14oY29sb3J8c2l6ZSkoXFxzKSo9Lyk7XHJcbiAgICAgICAgbGV0IHRhZ05hbWUgPSAnJztcclxuICAgICAgICBsZXQgbmV4dFNwYWNlID0gMDtcclxuICAgICAgICBsZXQgZXZlbnRIYW5sZGVyU3RyaW5nID0gJyc7XHJcbiAgICAgICAgaWYgKGhlYWRlcikge1xyXG4gICAgICAgICAgICB0YWdOYW1lID0gaGVhZGVyWzBdO1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGUuc3Vic3RyaW5nKHRhZ05hbWUubGVuZ3RoKS50cmltKCk7XHJcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBwYXJzZSBjb2xvclxyXG4gICAgICAgICAgICBuZXh0U3BhY2UgPSBhdHRyaWJ1dGUuaW5kZXhPZignICcpO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHRhZ05hbWVbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2MnOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0U3BhY2UgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmouY29sb3IgPSBhdHRyaWJ1dGUuc3Vic3RyaW5nKDAsIG5leHRTcGFjZSkudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iai5jb2xvciA9IGF0dHJpYnV0ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdzJzpcclxuICAgICAgICAgICAgICAgICAgICBvYmouc2l6ZSA9IHBhcnNlSW50KGF0dHJpYnV0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHRhZyBoYXMgZXZlbnQgYXJndW1lbnRzXHJcbiAgICAgICAgICAgIGlmIChuZXh0U3BhY2UgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRIYW5sZGVyU3RyaW5nID0gYXR0cmlidXRlLnN1YnN0cmluZyhuZXh0U3BhY2UgKyAxKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICBvYmouZXZlbnQgPSB0aGlzLl9wcm9jZXNzRXZlbnRIYW5kbGVyKGV2ZW50SGFubGRlclN0cmluZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhlYWRlciA9IGF0dHJpYnV0ZS5tYXRjaCgvXihicihcXHMpKlxcLykvKTtcclxuICAgICAgICBpZiAoaGVhZGVyICYmIGhlYWRlclswXS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRhZ05hbWUgPSBoZWFkZXJbMF0udHJpbSgpO1xyXG4gICAgICAgICAgICBpZiAodGFnTmFtZS5zdGFydHNXaXRoKCdicicpICYmIHRhZ05hbWVbdGFnTmFtZS5sZW5ndGggLSAxXSA9PT0gJy8nKSB7XHJcbiAgICAgICAgICAgICAgICBvYmouaXNOZXdMaW5lID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc3VsdE9iamVjdEFycmF5LnB1c2goeyB0ZXh0OiAnJywgc3R5bGU6IHsgaXNOZXdMaW5lOiB0cnVlIH0gYXMgSUh0bWxUZXh0UGFyc2VyU3RhY2sgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoZWFkZXIgPSBhdHRyaWJ1dGUubWF0Y2goL14oaW1nKFxccykqc3JjKFxccykqPVtePl0rXFwvKS8pO1xyXG4gICAgICAgIGxldCByZW1haW5pbmdBcmd1bWVudCA9ICcnO1xyXG4gICAgICAgIGlmIChoZWFkZXIgJiYgaGVhZGVyWzBdLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGFnTmFtZSA9IGhlYWRlclswXS50cmltKCk7XHJcbiAgICAgICAgICAgIGlmICh0YWdOYW1lLnN0YXJ0c1dpdGgoJ2ltZycpICYmIHRhZ05hbWVbdGFnTmFtZS5sZW5ndGggLSAxXSA9PT0gJy8nKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXIgPSBhdHRyaWJ1dGUubWF0Y2goaW1hZ2VBdHRyUmVnKTtcclxuICAgICAgICAgICAgICAgIGxldCB0YWdWYWx1ZTtcclxuICAgICAgICAgICAgICAgIGxldCBpc1ZhbGlkSW1hZ2VUYWcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChoZWFkZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBza2lwIHRoZSBpbnZhbGlkIHRhZ3MgYXQgZmlyc3RcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGUuc3Vic3RyaW5nKGF0dHJpYnV0ZS5pbmRleE9mKGhlYWRlclswXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhZ05hbWUgPSBhdHRyaWJ1dGUuc3Vic3RyKDAsIGhlYWRlclswXS5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBzcGFjZSBhbmQgPSBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgICAgICByZW1haW5pbmdBcmd1bWVudCA9IGF0dHJpYnV0ZS5zdWJzdHJpbmcodGFnTmFtZS5sZW5ndGgpLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0U3BhY2UgPSByZW1haW5pbmdBcmd1bWVudC5pbmRleE9mKCcgJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRhZ1ZhbHVlID0gKG5leHRTcGFjZSA+IC0xKSA/IHJlbWFpbmluZ0FyZ3VtZW50LnN1YnN0cigwLCBuZXh0U3BhY2UpIDogcmVtYWluaW5nQXJndW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFnTmFtZSA9IHRhZ05hbWUucmVwbGFjZSgvW15hLXpBLVpdL2csICcnKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFnTmFtZSA9IHRhZ05hbWUudG9Mb2NhbGVMb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlID0gcmVtYWluaW5nQXJndW1lbnQuc3Vic3RyaW5nKG5leHRTcGFjZSkudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICggdGFnVmFsdWUuZW5kc1dpdGgoICdcXC8nICkgKSB0YWdWYWx1ZSA9IHRhZ1ZhbHVlLnNsaWNlKCAwLCAtMSApO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWdOYW1lID09PSAnc3JjJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRhZ1ZhbHVlLmNoYXJDb2RlQXQoMCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzQ6IC8vIFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM5OiAvLyAnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNWYWxpZEltYWdlVGFnID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWdWYWx1ZSA9IHRhZ1ZhbHVlLnNsaWNlKDEsIC0xKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmouaXNJbWFnZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iai5zcmMgPSB0YWdWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGFnTmFtZSA9PT0gJ2hlaWdodCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmltYWdlSGVpZ2h0ID0gcGFyc2VJbnQodGFnVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0YWdOYW1lID09PSAnd2lkdGgnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pbWFnZVdpZHRoID0gcGFyc2VJbnQodGFnVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0YWdOYW1lID09PSBcImFsaWduXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0YWdWYWx1ZS5jaGFyQ29kZUF0KDApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM0OiAvLyBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzOTogLy8gJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZ1ZhbHVlID0gdGFnVmFsdWUuc2xpY2UoMSwgLTEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iai5pbWFnZUFsaWduID0gdGFnVmFsdWUudG9Mb2NhbGVMb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGFnTmFtZSA9PT0gXCJvZmZzZXRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmouaW1hZ2VPZmZzZXQgPSB0YWdWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGFnTmFtZSA9PT0gJ2NsaWNrJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmouZXZlbnQgPSB0aGlzLl9wcm9jZXNzRXZlbnRIYW5kbGVyKHRhZ05hbWUgKyAnPScgKyB0YWdWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqLmV2ZW50ICYmIHRhZ05hbWUgPT09ICdwYXJhbScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmV2ZW50W3RhZ05hbWVdID0gdGFnVmFsdWUucmVwbGFjZSgvXlxcXCJ8XFxcIiQvZywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyID0gYXR0cmlidXRlLm1hdGNoKGltYWdlQXR0clJlZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzVmFsaWRJbWFnZVRhZyAmJiBvYmouaXNJbWFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jlc3VsdE9iamVjdEFycmF5LnB1c2goeyB0ZXh0OiAnJywgc3R5bGU6IG9iaiB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhlYWRlciA9IGF0dHJpYnV0ZS5tYXRjaCgvXihvdXRsaW5lKFxccykqW14+XSopLyk7XHJcbiAgICAgICAgaWYgKGhlYWRlcikge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGUgPSBoZWFkZXJbMF0uc3Vic3RyaW5nKCdvdXRsaW5lJy5sZW5ndGgpLnRyaW0oKTtcclxuICAgICAgICAgICAgY29uc3QgZGVmYXVsdE91dGxpbmVPYmplY3QgPSB7IGNvbG9yOiAnI2ZmZmZmZicsIHdpZHRoOiAxIH07XHJcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG91dGxpbmVBdHRyUmVnID0gLyhcXHMpKmNvbG9yKFxccykqPXwoXFxzKSp3aWR0aChcXHMpKj18KFxccykqY2xpY2soXFxzKSo9fChcXHMpKnBhcmFtKFxccykqPS87XHJcbiAgICAgICAgICAgICAgICBoZWFkZXIgPSBhdHRyaWJ1dGUubWF0Y2gob3V0bGluZUF0dHJSZWcpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRhZ1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGhlYWRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNraXAgdGhlIGludmFsaWQgdGFncyBhdCBmaXJzdFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZS5zdWJzdHJpbmcoYXR0cmlidXRlLmluZGV4T2YoaGVhZGVyWzBdKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFnTmFtZSA9IGF0dHJpYnV0ZS5zdWJzdHIoMCwgaGVhZGVyWzBdLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHNwYWNlIGFuZCA9IGNoYXJhY3RlclxyXG4gICAgICAgICAgICAgICAgICAgIHJlbWFpbmluZ0FyZ3VtZW50ID0gYXR0cmlidXRlLnN1YnN0cmluZyh0YWdOYW1lLmxlbmd0aCkudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHRTcGFjZSA9IHJlbWFpbmluZ0FyZ3VtZW50LmluZGV4T2YoJyAnKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dFNwYWNlID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnVmFsdWUgPSByZW1haW5pbmdBcmd1bWVudC5zdWJzdHIoMCwgbmV4dFNwYWNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWdWYWx1ZSA9IHJlbWFpbmluZ0FyZ3VtZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0YWdOYW1lID0gdGFnTmFtZS5yZXBsYWNlKC9bXmEtekEtWl0vZywgJycpLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgICAgICB0YWdOYW1lID0gdGFnTmFtZS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGUgPSByZW1haW5pbmdBcmd1bWVudC5zdWJzdHJpbmcobmV4dFNwYWNlKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhZ05hbWUgPT09ICdjbGljaycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmV2ZW50ID0gdGhpcy5fcHJvY2Vzc0V2ZW50SGFuZGxlcih0YWdOYW1lICsgJz0nICsgdGFnVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0YWdOYW1lID09PSAnY29sb3InKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRPdXRsaW5lT2JqZWN0LmNvbG9yID0gdGFnVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRhZ05hbWUgPT09ICd3aWR0aCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdE91dGxpbmVPYmplY3Qud2lkdGggPSBwYXJzZUludCh0YWdWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqLmV2ZW50ICYmIHRhZ05hbWUgPT09ICdwYXJhbScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmV2ZW50W3RhZ05hbWVdID0gdGFnVmFsdWUucmVwbGFjZSgvXlxcXCJ8XFxcIiQvZywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyID0gYXR0cmlidXRlLm1hdGNoKG91dGxpbmVBdHRyUmVnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvYmoub3V0bGluZSA9IGRlZmF1bHRPdXRsaW5lT2JqZWN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaGVhZGVyID0gYXR0cmlidXRlLm1hdGNoKC9eKG9ufHV8YnxpKShcXHMpKi8pO1xyXG4gICAgICAgIGlmIChoZWFkZXIgJiYgaGVhZGVyWzBdLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGFnTmFtZSA9IGhlYWRlclswXTtcclxuICAgICAgICAgICAgYXR0cmlidXRlID0gYXR0cmlidXRlLnN1YnN0cmluZyh0YWdOYW1lLmxlbmd0aCkudHJpbSgpO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHRhZ05hbWVbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3UnOlxyXG4gICAgICAgICAgICAgICAgICAgIG9iai51bmRlcmxpbmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaSc6XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLml0YWxpYyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdiJzpcclxuICAgICAgICAgICAgICAgICAgICBvYmouYm9sZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG9iai5ldmVudCA9IHRoaXMuX3Byb2Nlc3NFdmVudEhhbmRsZXIoYXR0cmlidXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcHJvY2Vzc0V2ZW50SGFuZGxlciAoZXZlbnRTdHJpbmc6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IG9iaiA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gMDtcclxuICAgICAgICBsZXQgaXNWYWxpZFRhZyA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBldmVudE5hbWVzID0gZXZlbnRTdHJpbmcubWF0Y2goZXZlbnRSZWd4KTtcclxuICAgICAgICB3aGlsZSAoZXZlbnROYW1lcykge1xyXG4gICAgICAgICAgICBsZXQgZXZlbnROYW1lID0gZXZlbnROYW1lc1swXTtcclxuICAgICAgICAgICAgbGV0IGV2ZW50VmFsdWUgPSAnJztcclxuICAgICAgICAgICAgaXNWYWxpZFRhZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBldmVudFN0cmluZyA9IGV2ZW50U3RyaW5nLnN1YnN0cmluZyhldmVudE5hbWUubGVuZ3RoKS50cmltKCk7XHJcbiAgICAgICAgICAgIGlmIChldmVudFN0cmluZy5jaGFyQXQoMCkgPT09ICdcXFwiJykge1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSBldmVudFN0cmluZy5pbmRleE9mKCdcXFwiJywgMSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VmFsdWUgPSBldmVudFN0cmluZy5zdWJzdHJpbmcoMSwgaW5kZXgpLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkVGFnID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnRTdHJpbmcuY2hhckF0KDApID09PSAnXFwnJykge1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSBldmVudFN0cmluZy5pbmRleE9mKCdcXCcnLCAxKTtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRWYWx1ZSA9IGV2ZW50U3RyaW5nLnN1YnN0cmluZygxLCBpbmRleCkudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWRUYWcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHNraXAgdGhlIGludmFsaWQgYXR0cmlidXRlIHZhbHVlXHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IGV2ZW50U3RyaW5nLm1hdGNoKC8oXFxTKSsvKTtcclxuICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VmFsdWUgPSBtYXRjaFswXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRWYWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaW5kZXggPSBldmVudFZhbHVlLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGlzVmFsaWRUYWcpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50TmFtZSA9IGV2ZW50TmFtZS5zdWJzdHJpbmcoMCwgZXZlbnROYW1lLmxlbmd0aCAtIDEpLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIG9ialtldmVudE5hbWVdID0gZXZlbnRWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZXZlbnRTdHJpbmcgPSBldmVudFN0cmluZy5zdWJzdHJpbmcoaW5kZXgpLnRyaW0oKTtcclxuICAgICAgICAgICAgZXZlbnROYW1lcyA9IGV2ZW50U3RyaW5nLm1hdGNoKGV2ZW50UmVneCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2FkZFRvU3RhY2sgKGF0dHJpYnV0ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgb2JqID0gdGhpcy5fYXR0cmlidXRlVG9PYmplY3QoYXR0cmlidXRlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3N0YWNrLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdGFjay5wdXNoKG9iaik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKG9iai5pc05ld0xpbmUgfHwgb2JqLmlzSW1hZ2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBmb3IgbmVzdGVkIHRhZ3NcclxuICAgICAgICAgICAgY29uc3QgcHJldmlvdXNUYWdPYmogPSB0aGlzLl9zdGFja1t0aGlzLl9zdGFjay5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gcHJldmlvdXNUYWdPYmopIHtcclxuICAgICAgICAgICAgICAgIGlmICghKG9ialtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ialtrZXldID0gcHJldmlvdXNUYWdPYmpba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9zdGFjay5wdXNoKG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Byb2Nlc3NSZXN1bHQgKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhbHVlID0gdGhpcy5fZXNjYXBlU3BlY2lhbFN5bWJvbCh2YWx1ZSk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3N0YWNrLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVzdWx0T2JqZWN0QXJyYXkucHVzaCh7IHRleHQ6IHZhbHVlLCBzdHlsZTogdGhpcy5fc3RhY2tbdGhpcy5fc3RhY2subGVuZ3RoIC0gMV0gfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVzdWx0T2JqZWN0QXJyYXkucHVzaCh7IHRleHQ6IHZhbHVlIH0gYXMgSUh0bWxUZXh0UGFyc2VyUmVzdWx0T2JqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZXNjYXBlU3BlY2lhbFN5bWJvbCAoc3RyOiBzdHJpbmcpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHN5bWJvbEFyciBvZiB0aGlzLl9zcGVjaWFsU3ltYm9sQXJyYXkpIHtcclxuICAgICAgICAgICAgY29uc3Qga2V5ID0gc3ltYm9sQXJyWzBdO1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHN5bWJvbEFyclsxXTtcclxuXHJcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKGtleSwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgIH1cclxufVxyXG5cclxuaWYgKFRFU1QpIHtcclxuICAgIGxlZ2FjeUNDLl9UZXN0Lkh0bWxUZXh0UGFyc2VyID0gSHRtbFRleHRQYXJzZXI7XHJcbn1cclxuIl19