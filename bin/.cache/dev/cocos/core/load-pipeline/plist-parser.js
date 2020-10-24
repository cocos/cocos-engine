(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../default-constants.js", "../platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../default-constants.js"), require("../platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.defaultConstants, global.debug);
    global.plistParser = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _defaultConstants, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * A SAX Parser
   * @class saxParser
   */
  var SAXParser = /*#__PURE__*/function () {
    function SAXParser() {
      _classCallCheck(this, SAXParser);

      this._isSupportDOMParser = void 0;
      this._parser = void 0;

      if (!_defaultConstants.EDITOR && window.DOMParser) {
        this._isSupportDOMParser = true;
        this._parser = new DOMParser();
      } else {
        this._isSupportDOMParser = false;
        this._parser = null;
      }
    }
    /**
     * @method parse
     * @param {String} xmlTxt
     * @return {Document}
     */


    _createClass(SAXParser, [{
      key: "parse",
      value: function parse(xmlTxt) {
        return this._parseXML(xmlTxt);
      }
    }, {
      key: "_parseXML",
      value: function _parseXML(textxml) {
        // get a reference to the requested corresponding xml file
        var xmlDoc;

        if (this._isSupportDOMParser) {
          xmlDoc = this._parser.parseFromString(textxml, "text/xml");
        } else {
          // Internet Explorer (untested!)
          xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
          xmlDoc.async = "false";
          xmlDoc.loadXML(textxml);
        }

        return xmlDoc;
      }
    }]);

    return SAXParser;
  }();
  /**
   *
   * plistParser is a singleton object for parsing plist files
   * @class plistParser
   * @extends SAXParser
   */


  var PlistParser = /*#__PURE__*/function (_SAXParser) {
    _inherits(PlistParser, _SAXParser);

    function PlistParser() {
      _classCallCheck(this, PlistParser);

      return _possibleConstructorReturn(this, _getPrototypeOf(PlistParser).apply(this, arguments));
    }

    _createClass(PlistParser, [{
      key: "parse",

      /**
       * @en parse a xml string as plist object.
       * @zh 将xml字符串解析为plist对象。
       * @param {String} xmlTxt - plist xml contents
       * @return {*} plist object
       */
      value: function parse(xmlTxt) {
        var xmlDoc = this._parseXML(xmlTxt);

        var plist = xmlDoc.documentElement;

        if (plist.tagName !== 'plist') {
          (0, _debug.warnID)(5100);
          return {};
        } // Get first real node


        var node = null;

        for (var i = 0, len = plist.childNodes.length; i < len; i++) {
          node = plist.childNodes[i]; // @ts-ignore

          if (node.nodeType === 1) break;
        }

        xmlDoc = null;
        return this._parseNode(node);
      }
    }, {
      key: "_parseNode",
      value: function _parseNode(node) {
        var data = null,
            tagName = node.tagName;

        if (tagName === "dict") {
          data = this._parseDict(node);
        } else if (tagName === "array") {
          data = this._parseArray(node);
        } else if (tagName === "string") {
          if (node.childNodes.length === 1) data = node.firstChild.nodeValue;else {
            //handle Firefox's 4KB nodeValue limit
            data = "";

            for (var i = 0; i < node.childNodes.length; i++) {
              data += node.childNodes[i].nodeValue;
            }
          }
        } else if (tagName === "false") {
          data = false;
        } else if (tagName === "true") {
          data = true;
        } else if (tagName === "real") {
          data = parseFloat(node.firstChild.nodeValue);
        } else if (tagName === "integer") {
          data = parseInt(node.firstChild.nodeValue, 10);
        }

        return data;
      }
    }, {
      key: "_parseArray",
      value: function _parseArray(node) {
        var data = [];

        for (var i = 0, len = node.childNodes.length; i < len; i++) {
          var child = node.childNodes[i];
          if (child.nodeType !== 1) continue;
          data.push(this._parseNode(child));
        }

        return data;
      }
    }, {
      key: "_parseDict",
      value: function _parseDict(node) {
        var data = {};
        var key = null;

        for (var i = 0, len = node.childNodes.length; i < len; i++) {
          var child = node.childNodes[i];
          if (child.nodeType !== 1) continue; // Grab the key, next noe should be the value

          if (child.tagName === 'key') key = child.firstChild.nodeValue;else // @ts-ignore
            data[key] = this._parseNode(child); // Parse the value node
        }

        return data;
      }
    }]);

    return PlistParser;
  }(SAXParser);
  /**
   * @name plistParser
   * A Plist Parser
   */


  var plistParser = new PlistParser();
  var _default = plistParser;
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbG9hZC1waXBlbGluZS9wbGlzdC1wYXJzZXIudHMiXSwibmFtZXMiOlsiU0FYUGFyc2VyIiwiX2lzU3VwcG9ydERPTVBhcnNlciIsIl9wYXJzZXIiLCJFRElUT1IiLCJ3aW5kb3ciLCJET01QYXJzZXIiLCJ4bWxUeHQiLCJfcGFyc2VYTUwiLCJ0ZXh0eG1sIiwieG1sRG9jIiwicGFyc2VGcm9tU3RyaW5nIiwiQWN0aXZlWE9iamVjdCIsImFzeW5jIiwibG9hZFhNTCIsIlBsaXN0UGFyc2VyIiwicGxpc3QiLCJkb2N1bWVudEVsZW1lbnQiLCJ0YWdOYW1lIiwibm9kZSIsImkiLCJsZW4iLCJjaGlsZE5vZGVzIiwibGVuZ3RoIiwibm9kZVR5cGUiLCJfcGFyc2VOb2RlIiwiZGF0YSIsIl9wYXJzZURpY3QiLCJfcGFyc2VBcnJheSIsImZpcnN0Q2hpbGQiLCJub2RlVmFsdWUiLCJwYXJzZUZsb2F0IiwicGFyc2VJbnQiLCJjaGlsZCIsInB1c2giLCJrZXkiLCJwbGlzdFBhcnNlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQ0E7Ozs7TUFJTUEsUztBQUdGLHlCQUFlO0FBQUE7O0FBQUEsV0FGUEMsbUJBRU87QUFBQSxXQURQQyxPQUNPOztBQUNYLFVBQUksQ0FBQ0Msd0JBQUQsSUFBV0MsTUFBTSxDQUFDQyxTQUF0QixFQUFpQztBQUM3QixhQUFLSixtQkFBTCxHQUEyQixJQUEzQjtBQUNBLGFBQUtDLE9BQUwsR0FBZSxJQUFJRyxTQUFKLEVBQWY7QUFDSCxPQUhELE1BR087QUFDSCxhQUFLSixtQkFBTCxHQUEyQixLQUEzQjtBQUNBLGFBQUtDLE9BQUwsR0FBZSxJQUFmO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7Ozs7NEJBS09JLE0sRUFBTztBQUNWLGVBQU8sS0FBS0MsU0FBTCxDQUFlRCxNQUFmLENBQVA7QUFDSDs7O2dDQUVVRSxPLEVB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QUQsQ0FBSixHQUFZLEtBQUtWLFVBQUwsQ0FBZ0JRLEtBQWhCLENBQVosQ0FWb0QsQ0FVQTtBQUMzRDs7QUFDRCxlQUFPUCxJQUFQO0FBQ0g7Ozs7SUFqRnFCekIsUztBQW9GMUI7Ozs7OztBQUlBLE1BQUltQyxXQUFXLEdBQUcsSUFBSXJCLFdBQUosRUFBbEI7aUJBRWVxQixXIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAwOC0yMDEwIFJpY2FyZG8gUXVlc2FkYVxyXG4gQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgY29jb3MyZC14Lm9yZ1xyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xyXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxyXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXHJcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG5cclxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXHJcbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuICovXHJcblxyXG4vKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEVESVRPUiB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IHdhcm5JRCB9IGZyb20gJy4uL3BsYXRmb3JtL2RlYnVnJztcclxuXHJcbi8qKlxyXG4gKiBBIFNBWCBQYXJzZXJcclxuICogQGNsYXNzIHNheFBhcnNlclxyXG4gKi9cclxuY2xhc3MgU0FYUGFyc2VyIHtcclxuICAgIHByaXZhdGUgX2lzU3VwcG9ydERPTVBhcnNlcjtcclxuICAgIHByaXZhdGUgX3BhcnNlcjtcclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBpZiAoIUVESVRPUiAmJiB3aW5kb3cuRE9NUGFyc2VyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzU3VwcG9ydERPTVBhcnNlciA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9pc1N1cHBvcnRET01QYXJzZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fcGFyc2VyID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbWV0aG9kIHBhcnNlXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30geG1sVHh0XHJcbiAgICAgKiBAcmV0dXJuIHtEb2N1bWVudH1cclxuICAgICAqL1xyXG4gICAgcGFyc2UgKHhtbFR4dCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnNlWE1MKHhtbFR4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3BhcnNlWE1MICh0ZXh0eG1sKSB7XHJcbiAgICAgICAgLy8gZ2V0IGEgcmVmZXJlbmNlIHRvIHRoZSByZXF1ZXN0ZWQgY29ycmVzcG9uZGluZyB4bWwgZmlsZVxyXG4gICAgICAgIGxldCB4bWxEb2M7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzU3VwcG9ydERPTVBhcnNlcikge1xyXG4gICAgICAgICAgICB4bWxEb2MgPSB0aGlzLl9wYXJzZXIucGFyc2VGcm9tU3RyaW5nKHRleHR4bWwsIFwidGV4dC94bWxcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gSW50ZXJuZXQgRXhwbG9yZXIgKHVudGVzdGVkISlcclxuICAgICAgICAgICAgeG1sRG9jID0gbmV3IEFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MRE9NXCIpO1xyXG4gICAgICAgICAgICB4bWxEb2MuYXN5bmMgPSBcImZhbHNlXCI7XHJcbiAgICAgICAgICAgIHhtbERvYy5sb2FkWE1MKHRleHR4bWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geG1sRG9jO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICpcclxuICogcGxpc3RQYXJzZXIgaXMgYSBzaW5nbGV0b24gb2JqZWN0IGZvciBwYXJzaW5nIHBsaXN0IGZpbGVzXHJcbiAqIEBjbGFzcyBwbGlzdFBhcnNlclxyXG4gKiBAZXh0ZW5kcyBTQVhQYXJzZXJcclxuICovXHJcbmNsYXNzIFBsaXN0UGFyc2VyIGV4dGVuZHMgU0FYUGFyc2VyIHtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIHBhcnNlIGEgeG1sIHN0cmluZyBhcyBwbGlzdCBvYmplY3QuXHJcbiAgICAgKiBAemgg5bCGeG1s5a2X56ym5Liy6Kej5p6Q5Li6cGxpc3Tlr7nosaHjgIJcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB4bWxUeHQgLSBwbGlzdCB4bWwgY29udGVudHNcclxuICAgICAqIEByZXR1cm4geyp9IHBsaXN0IG9iamVjdFxyXG4gICAgICovXHJcbiAgICBwYXJzZSAoeG1sVHh0KSB7XHJcbiAgICAgICAgbGV0IHhtbERvYyA9IHRoaXMuX3BhcnNlWE1MKHhtbFR4dCk7XHJcbiAgICAgICAgbGV0IHBsaXN0ID0geG1sRG9jLmRvY3VtZW50RWxlbWVudDtcclxuICAgICAgICBpZiAocGxpc3QudGFnTmFtZSAhPT0gJ3BsaXN0Jykge1xyXG4gICAgICAgICAgICB3YXJuSUQoNTEwMCk7XHJcbiAgICAgICAgICAgIHJldHVybiB7fTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEdldCBmaXJzdCByZWFsIG5vZGVcclxuICAgICAgICBsZXQgbm9kZSA9IG51bGw7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHBsaXN0LmNoaWxkTm9kZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgbm9kZSA9IHBsaXN0LmNoaWxkTm9kZXNbaV07XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgeG1sRG9jID0gbnVsbDtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFyc2VOb2RlKG5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIF9wYXJzZU5vZGUgKG5vZGUpIHtcclxuICAgICAgICBsZXQgZGF0YTogYW55ID0gbnVsbCwgdGFnTmFtZSA9IG5vZGUudGFnTmFtZTtcclxuICAgICAgICBpZih0YWdOYW1lID09PSBcImRpY3RcIil7XHJcbiAgICAgICAgICAgIGRhdGEgPSB0aGlzLl9wYXJzZURpY3Qobm9kZSk7XHJcbiAgICAgICAgfWVsc2UgaWYodGFnTmFtZSA9PT0gXCJhcnJheVwiKXtcclxuICAgICAgICAgICAgZGF0YSA9IHRoaXMuX3BhcnNlQXJyYXkobm9kZSk7XHJcbiAgICAgICAgfWVsc2UgaWYodGFnTmFtZSA9PT0gXCJzdHJpbmdcIil7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmNoaWxkTm9kZXMubGVuZ3RoID09PSAxKVxyXG4gICAgICAgICAgICAgICAgZGF0YSA9IG5vZGUuZmlyc3RDaGlsZC5ub2RlVmFsdWU7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy9oYW5kbGUgRmlyZWZveCdzIDRLQiBub2RlVmFsdWUgbGltaXRcclxuICAgICAgICAgICAgICAgIGRhdGEgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YSArPSBub2RlLmNoaWxkTm9kZXNbaV0ubm9kZVZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2UgaWYodGFnTmFtZSA9PT0gXCJmYWxzZVwiKXtcclxuICAgICAgICAgICAgZGF0YSA9IGZhbHNlO1xyXG4gICAgICAgIH1lbHNlIGlmKHRhZ05hbWUgPT09IFwidHJ1ZVwiKXtcclxuICAgICAgICAgICAgZGF0YSA9IHRydWU7XHJcbiAgICAgICAgfWVsc2UgaWYodGFnTmFtZSA9PT0gXCJyZWFsXCIpe1xyXG4gICAgICAgICAgICBkYXRhID0gcGFyc2VGbG9hdChub2RlLmZpcnN0Q2hpbGQubm9kZVZhbHVlKTtcclxuICAgICAgICB9ZWxzZSBpZih0YWdOYW1lID09PSBcImludGVnZXJcIil7XHJcbiAgICAgICAgICAgIGRhdGEgPSBwYXJzZUludChub2RlLmZpcnN0Q2hpbGQubm9kZVZhbHVlLCAxMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIF9wYXJzZUFycmF5IChub2RlKSB7XHJcbiAgICAgICAgbGV0IGRhdGE6IEFycmF5PGFueT4gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IG5vZGUuY2hpbGROb2Rlc1tpXTtcclxuICAgICAgICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlICE9PSAxKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIGRhdGEucHVzaCh0aGlzLl9wYXJzZU5vZGUoY2hpbGQpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgX3BhcnNlRGljdCAobm9kZSkge1xyXG4gICAgICAgIGxldCBkYXRhID0ge307XHJcbiAgICAgICAgbGV0IGtleSA9IG51bGw7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgY2hpbGQgPSBub2RlLmNoaWxkTm9kZXNbaV07XHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSAhPT0gMSlcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgLy8gR3JhYiB0aGUga2V5LCBuZXh0IG5vZSBzaG91bGQgYmUgdGhlIHZhbHVlXHJcbiAgICAgICAgICAgIGlmIChjaGlsZC50YWdOYW1lID09PSAna2V5JylcclxuICAgICAgICAgICAgICAgIGtleSA9IGNoaWxkLmZpcnN0Q2hpbGQubm9kZVZhbHVlO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICBkYXRhW2tleV0gPSB0aGlzLl9wYXJzZU5vZGUoY2hpbGQpOyAgICAgICAgICAgICAgICAgLy8gUGFyc2UgdGhlIHZhbHVlIG5vZGVcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAbmFtZSBwbGlzdFBhcnNlclxyXG4gKiBBIFBsaXN0IFBhcnNlclxyXG4gKi9cclxubGV0IHBsaXN0UGFyc2VyID0gbmV3IFBsaXN0UGFyc2VyKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBwbGlzdFBhcnNlcjtcclxuIl19