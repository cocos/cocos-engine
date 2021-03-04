(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

!function () {
  function e(e) {
    this.message = e;
  }

  var t = "undefined" != typeof exports ? exports : "undefined" != typeof self ? self : $.global,
      r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  e.prototype = new Error(), e.prototype.name = "InvalidCharacterError", t.btoa || (t.btoa = function (t) {
    for (var o, n, a = String(t), i = 0, f = r, c = ""; a.charAt(0 | i) || (f = "=", i % 1); c += f.charAt(63 & o >> 8 - i % 1 * 8)) {
      if (n = a.charCodeAt(i += .75), n > 255) throw new e("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      o = o << 8 | n;
    }

    return c;
  }), t.atob || (t.atob = function (t) {
    var o = String(t).replace(/[=]+$/, "");
    if (o.length % 4 == 1) throw new e("'atob' failed: The string to be decoded is not correctly encoded.");

    for (var n, a, i = 0, f = 0, c = ""; a = o.charAt(f++); ~a && (n = i % 4 ? 64 * n + a : a, i++ % 4) ? c += String.fromCharCode(255 & n >> (-2 * i & 6)) : 0) {
      a = r.indexOf(a);
    }

    return c;
  });
}();

},{}],2:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

!function (n) {
  "use strict";

  function t(n, t) {
    var r = (65535 & n) + (65535 & t);
    return (n >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r;
  }

  function r(n, t) {
    return n << t | n >>> 32 - t;
  }

  function e(n, e, o, u, c, f) {
    return t(r(t(t(e, n), t(u, f)), c), o);
  }

  function o(n, t, r, o, u, c, f) {
    return e(t & r | ~t & o, n, t, u, c, f);
  }

  function u(n, t, r, o, u, c, f) {
    return e(t & o | r & ~o, n, t, u, c, f);
  }

  function c(n, t, r, o, u, c, f) {
    return e(t ^ r ^ o, n, t, u, c, f);
  }

  function f(n, t, r, o, u, c, f) {
    return e(r ^ (t | ~o), n, t, u, c, f);
  }

  function i(n, r) {
    n[r >> 5] |= 128 << r % 32, n[14 + (r + 64 >>> 9 << 4)] = r;
    var e,
        i,
        a,
        d,
        h,
        l = 1732584193,
        g = -271733879,
        v = -1732584194,
        m = 271733878;

    for (e = 0; e < n.length; e += 16) {
      i = l, a = g, d = v, h = m, g = f(g = f(g = f(g = f(g = c(g = c(g = c(g = c(g = u(g = u(g = u(g = u(g = o(g = o(g = o(g = o(g, v = o(v, m = o(m, l = o(l, g, v, m, n[e], 7, -680876936), g, v, n[e + 1], 12, -389564586), l, g, n[e + 2], 17, 606105819), m, l, n[e + 3], 22, -1044525330), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 4], 7, -176418897), g, v, n[e + 5], 12, 1200080426), l, g, n[e + 6], 17, -1473231341), m, l, n[e + 7], 22, -45705983), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 8], 7, 1770035416), g, v, n[e + 9], 12, -1958414417), l, g, n[e + 10], 17, -42063), m, l, n[e + 11], 22, -1990404162), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 12], 7, 1804603682), g, v, n[e + 13], 12, -40341101), l, g, n[e + 14], 17, -1502002290), m, l, n[e + 15], 22, 1236535329), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 1], 5, -165796510), g, v, n[e + 6], 9, -1069501632), l, g, n[e + 11], 14, 643717713), m, l, n[e], 20, -373897302), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 5], 5, -701558691), g, v, n[e + 10], 9, 38016083), l, g, n[e + 15], 14, -660478335), m, l, n[e + 4], 20, -405537848), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 9], 5, 568446438), g, v, n[e + 14], 9, -1019803690), l, g, n[e + 3], 14, -187363961), m, l, n[e + 8], 20, 1163531501), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 13], 5, -1444681467), g, v, n[e + 2], 9, -51403784), l, g, n[e + 7], 14, 1735328473), m, l, n[e + 12], 20, -1926607734), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 5], 4, -378558), g, v, n[e + 8], 11, -2022574463), l, g, n[e + 11], 16, 1839030562), m, l, n[e + 14], 23, -35309556), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 1], 4, -1530992060), g, v, n[e + 4], 11, 1272893353), l, g, n[e + 7], 16, -155497632), m, l, n[e + 10], 23, -1094730640), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 13], 4, 681279174), g, v, n[e], 11, -358537222), l, g, n[e + 3], 16, -722521979), m, l, n[e + 6], 23, 76029189), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 9], 4, -640364487), g, v, n[e + 12], 11, -421815835), l, g, n[e + 15], 16, 530742520), m, l, n[e + 2], 23, -995338651), v = f(v, m = f(m, l = f(l, g, v, m, n[e], 6, -198630844), g, v, n[e + 7], 10, 1126891415), l, g, n[e + 14], 15, -1416354905), m, l, n[e + 5], 21, -57434055), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 12], 6, 1700485571), g, v, n[e + 3], 10, -1894986606), l, g, n[e + 10], 15, -1051523), m, l, n[e + 1], 21, -2054922799), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 8], 6, 1873313359), g, v, n[e + 15], 10, -30611744), l, g, n[e + 6], 15, -1560198380), m, l, n[e + 13], 21, 1309151649), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 4], 6, -145523070), g, v, n[e + 11], 10, -1120210379), l, g, n[e + 2], 15, 718787259), m, l, n[e + 9], 21, -343485551), l = t(l, i), g = t(g, a), v = t(v, d), m = t(m, h);
    }

    return [l, g, v, m];
  }

  function a(n) {
    var t,
        r = "",
        e = 32 * n.length;

    for (t = 0; t < e; t += 8) {
      r += String.fromCharCode(n[t >> 5] >>> t % 32 & 255);
    }

    return r;
  }

  function d(n) {
    var t,
        r = [];

    for (r[(n.length >> 2) - 1] = void 0, t = 0; t < r.length; t += 1) {
      r[t] = 0;
    }

    var e = 8 * n.length;

    for (t = 0; t < e; t += 8) {
      r[t >> 5] |= (255 & n.charCodeAt(t / 8)) << t % 32;
    }

    return r;
  }

  function h(n) {
    return a(i(d(n), 8 * n.length));
  }

  function l(n, t) {
    var r,
        e,
        o = d(n),
        u = [],
        c = [];

    for (u[15] = c[15] = void 0, o.length > 16 && (o = i(o, 8 * n.length)), r = 0; r < 16; r += 1) {
      u[r] = 909522486 ^ o[r], c[r] = 1549556828 ^ o[r];
    }

    return e = i(u.concat(d(t)), 512 + 8 * t.length), a(i(c.concat(e), 640));
  }

  function g(n) {
    var t,
        r,
        e = "";

    for (r = 0; r < n.length; r += 1) {
      t = n.charCodeAt(r), e += "0123456789abcdef".charAt(t >>> 4 & 15) + "0123456789abcdef".charAt(15 & t);
    }

    return e;
  }

  function v(n) {
    return unescape(encodeURIComponent(n));
  }

  function m(n) {
    return h(v(n));
  }

  function p(n) {
    return g(m(n));
  }

  function s(n, t) {
    return l(v(n), v(t));
  }

  function C(n, t) {
    return g(s(n, t));
  }

  function A(n, t, r) {
    return t ? r ? s(t, n) : C(t, n) : r ? m(n) : p(n);
  }

  "function" == typeof define && define.amd ? define(function () {
    return A;
  }) : "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && module.exports ? module.exports = A : n.md5 = A;
}(void 0);

},{}],3:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _HTMLAudioElement2 = _interopRequireDefault(require("./HTMLAudioElement"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Audio = function (_HTMLAudioElement) {
  _inherits(Audio, _HTMLAudioElement);

  var _super = _createSuper(Audio);

  function Audio(url) {
    _classCallCheck(this, Audio);

    return _super.call(this, url);
  }

  return Audio;
}(_HTMLAudioElement2["default"]);

exports["default"] = Audio;

},{"./HTMLAudioElement":14}],4:[function(require,module,exports){
(function (global){(function (){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global) {
  (function (factory) {
    if (typeof define === "function" && define.amd) {
      define(["exports"], factory);
    } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof exports.nodeName !== "string") {
      factory(exports);
    } else {
      factory(global);
    }
  })(function (exports) {
    "use strict";

    exports.URL = global.URL || global.webkitURL;

    if (global.Blob && global.URL) {
      try {
        new Blob();
        return;
      } catch (e) {}
    }

    var BlobBuilder = global.BlobBuilder || global.WebKitBlobBuilder || global.MozBlobBuilder || function () {
      var get_class = function get_class(object) {
        return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
      },
          FakeBlobBuilder = function BlobBuilder() {
        this.data = [];
      },
          FakeBlob = function Blob(data, type, encoding) {
        this.data = data;
        this.size = data.length;
        this.type = type;
        this.encoding = encoding;
      },
          FBB_proto = FakeBlobBuilder.prototype,
          FB_proto = FakeBlob.prototype,
          FileReaderSync = global.FileReaderSync,
          FileException = function FileException(type) {
        this.code = this[this.name = type];
      },
          file_ex_codes = ("NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR " + "NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR").split(" "),
          file_ex_code = file_ex_codes.length,
          real_URL = global.URL || global.webkitURL || exports,
          real_create_object_URL = real_URL.createObjectURL,
          real_revoke_object_URL = real_URL.revokeObjectURL,
          URL = real_URL,
          btoa = global.btoa,
          atob = global.atob,
          ArrayBuffer = global.ArrayBuffer,
          Uint8Array = global.Uint8Array,
          origin = /^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/;

      FakeBlob.fake = FB_proto.fake = true;

      while (file_ex_code--) {
        FileException.prototype[file_ex_codes[file_ex_code]] = file_ex_code + 1;
      }

      if (!real_URL.createObjectURL) {
        URL = exports.URL = function (uri) {
          var uri_info = document.createElementNS("http://www.w3.org/1999/xhtml", "a"),
              uri_origin;
          uri_info.href = uri;

          if (!("origin" in uri_info)) {
            if (uri_info.protocol.toLowerCase() === "data:") {
              uri_info.origin = null;
            } else {
              uri_origin = uri.match(origin);
              uri_info.origin = uri_origin && uri_origin[1];
            }
          }

          return uri_info;
        };
      }

      URL.createObjectURL = function (blob) {
        var type = blob.type,
            data_URI_header;

        if (type === null) {
          type = "application/octet-stream";
        }

        if (blob instanceof FakeBlob) {
          data_URI_header = "data:" + type;

          if (blob.encoding === "base64") {
            return data_URI_header + ";base64," + blob.data;
          } else if (blob.encoding === "URI") {
            return data_URI_header + "," + decodeURIComponent(blob.data);
          }

          if (btoa) {
            return data_URI_header + ";base64," + btoa(blob.data);
          } else {
            return data_URI_header + "," + encodeURIComponent(blob.data);
          }
        } else if (real_create_object_URL) {
          return real_create_object_URL.call(real_URL, blob);
        }
      };

      URL.revokeObjectURL = function (object_URL) {
        if (object_URL.substring(0, 5) !== "data:" && real_revoke_object_URL) {
          real_revoke_object_URL.call(real_URL, object_URL);
        }
      };

      FBB_proto.append = function (data) {
        var bb = this.data;

        if (Uint8Array && (data instanceof ArrayBuffer || data instanceof Uint8Array)) {
          var str = "",
              buf = new Uint8Array(data),
              i = 0,
              buf_len = buf.length;

          for (; i < buf_len; i++) {
            str += String.fromCharCode(buf[i]);
          }

          bb.push(str);
        } else if (get_class(data) === "Blob" || get_class(data) === "File") {
          if (FileReaderSync) {
            var fr = new FileReaderSync();
            bb.push(fr.readAsBinaryString(data));
          } else {
            throw new FileException("NOT_READABLE_ERR");
          }
        } else if (data instanceof FakeBlob) {
          if (data.encoding === "base64" && atob) {
            bb.push(atob(data.data));
          } else if (data.encoding === "URI") {
            bb.push(decodeURIComponent(data.data));
          } else if (data.encoding === "raw") {
            bb.push(data.data);
          }
        } else {
          if (typeof data !== "string") {
            data += "";
          }

          bb.push(unescape(encodeURIComponent(data)));
        }
      };

      FBB_proto.getBlob = function (type) {
        if (!arguments.length) {
          type = null;
        }

        return new FakeBlob(this.data.join(""), type, "raw");
      };

      FBB_proto.toString = function () {
        return "[object BlobBuilder]";
      };

      FB_proto.slice = function (start, end, type) {
        var args = arguments.length;

        if (args < 3) {
          type = null;
        }

        return new FakeBlob(this.data.slice(start, args > 1 ? end : this.data.length), type, this.encoding);
      };

      FB_proto.toString = function () {
        return "[object Blob]";
      };

      FB_proto.close = function () {
        this.size = 0;
        delete this.data;
      };

      return FakeBlobBuilder;
    }();

    exports.Blob = function (blobParts, options) {
      var type = options ? options.type || "" : "";
      var builder = new BlobBuilder();

      if (blobParts) {
        for (var i = 0, len = blobParts.length; i < len; i++) {
          if (Uint8Array && blobParts[i] instanceof Uint8Array) {
            builder.append(blobParts[i].buffer);
          } else {
            builder.append(blobParts[i]);
          }
        }
      }

      var blob = builder.getBlob(type);

      if (!blob.slice && blob.webkitSlice) {
        blob.slice = blob.webkitSlice;
      }

      return blob;
    };

    var getPrototypeOf = Object.getPrototypeOf || function (object) {
      return object.__proto__;
    };

    exports.Blob.prototype = getPrototypeOf(new exports.Blob());
  });
})(typeof self !== "undefined" && self || typeof window !== "undefined" && window || typeof global !== "undefined" && global || (void 0).content || void 0);

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DOMTokenList = function () {
  function DOMTokenList() {
    _classCallCheck(this, DOMTokenList);

    this.length = 0;
  }

  _createClass(DOMTokenList, [{
    key: "add",
    value: function add() {
      console.warn("DOMTokenList add isn't implemented!");
    }
  }, {
    key: "contains",
    value: function contains() {
      console.warn("DOMTokenList contains isn't implemented!");
    }
  }, {
    key: "entries",
    value: function entries() {
      console.warn("DOMTokenList entries isn't implemented!");
    }
  }, {
    key: "forEach",
    value: function forEach() {
      console.warn("DOMTokenList forEach isn't implemented!");
    }
  }, {
    key: "item",
    value: function item() {
      console.warn("DOMTokenList item isn't implemented!");
    }
  }, {
    key: "keys",
    value: function keys() {
      console.warn("DOMTokenList keys isn't implemented!");
    }
  }, {
    key: "remove",
    value: function remove() {
      console.warn("DOMTokenList remove isn't implemented!");
    }
  }, {
    key: "replace",
    value: function replace() {
      console.warn("DOMTokenList replace isn't implemented!");
    }
  }, {
    key: "supports",
    value: function supports() {
      console.warn("DOMTokenList supports isn't implemented!");
    }
  }, {
    key: "toggle",
    value: function toggle() {}
  }, {
    key: "value",
    value: function value() {
      console.warn("DOMTokenList value isn't implemented!");
    }
  }, {
    key: "values",
    value: function values() {
      console.warn("DOMTokenList values isn't implemented!");
    }
  }]);

  return DOMTokenList;
}();

exports["default"] = DOMTokenList;

},{}],6:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Event2 = _interopRequireDefault(require("./Event"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var DeviceMotionEvent = function (_Event) {
  _inherits(DeviceMotionEvent, _Event);

  var _super = _createSuper(DeviceMotionEvent);

  function DeviceMotionEvent(initArgs) {
    var _this;

    _classCallCheck(this, DeviceMotionEvent);

    _this = _super.call(this, 'devicemotion');

    if (initArgs) {
      _this._acceleration = initArgs.acceleration ? initArgs.acceleration : {
        x: 0,
        y: 0,
        z: 0
      };
      _this._accelerationIncludingGravity = initArgs.accelerationIncludingGravity ? initArgs.accelerationIncludingGravity : {
        x: 0,
        y: 0,
        z: 0
      };
      _this._rotationRate = initArgs.rotationRate ? initArgs.rotationRate : {
        alpha: 0,
        beta: 0,
        gamma: 0
      };
      _this._interval = initArgs.interval;
    } else {
      _this._acceleration = {
        x: 0,
        y: 0,
        z: 0
      };
      _this._accelerationIncludingGravity = {
        x: 0,
        y: 0,
        z: 0
      };
      _this._rotationRate = {
        alpha: 0,
        beta: 0,
        gamma: 0
      };
      _this._interval = 0;
    }

    return _this;
  }

  _createClass(DeviceMotionEvent, [{
    key: "acceleration",
    get: function get() {
      return this._acceleration;
    }
  }, {
    key: "accelerationIncludingGravity",
    get: function get() {
      return this._accelerationIncludingGravity;
    }
  }, {
    key: "rotationRate",
    get: function get() {
      return this._rotationRate;
    }
  }, {
    key: "interval",
    get: function get() {
      return this._interval;
    }
  }]);

  return DeviceMotionEvent;
}(_Event2["default"]);

exports["default"] = DeviceMotionEvent;

},{"./Event":9}],7:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Audio = _interopRequireDefault(require("./Audio"));

var _FontFaceSet = _interopRequireDefault(require("./FontFaceSet"));

var _Node2 = _interopRequireDefault(require("./Node"));

var _NodeList = _interopRequireDefault(require("./NodeList"));

var _HTMLAnchorElement = _interopRequireDefault(require("./HTMLAnchorElement"));

var _HTMLElement = _interopRequireDefault(require("./HTMLElement"));

var _HTMLHtmlElement = _interopRequireDefault(require("./HTMLHtmlElement"));

var _HTMLBodyElement = _interopRequireDefault(require("./HTMLBodyElement"));

var _HTMLHeadElement = _interopRequireDefault(require("./HTMLHeadElement"));

var _HTMLCanvasElement = _interopRequireDefault(require("./HTMLCanvasElement"));

var _HTMLVideoElement = _interopRequireDefault(require("./HTMLVideoElement"));

var _HTMLScriptElement = _interopRequireDefault(require("./HTMLScriptElement"));

var _HTMLStyleElement = _interopRequireDefault(require("./HTMLStyleElement"));

var _HTMLInputElement = _interopRequireDefault(require("./HTMLInputElement"));

var _WeakMap = _interopRequireDefault(require("./util/WeakMap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _html = new _HTMLHtmlElement["default"]();

var Document = function (_Node) {
  _inherits(Document, _Node);

  var _super = _createSuper(Document);

  _createClass(Document, [{
    key: "characterSet",
    get: function get() {
      return "UTF-8";
    }
  }, {
    key: "scripts",
    get: function get() {
      return _WeakMap["default"].get(this).scripts.slice(0);
    }
  }]);

  function Document() {
    var _this;

    _classCallCheck(this, Document);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "head", new _HTMLHeadElement["default"](_html));

    _defineProperty(_assertThisInitialized(_this), "body", new _HTMLBodyElement["default"](_html));

    _defineProperty(_assertThisInitialized(_this), "fonts", new _FontFaceSet["default"]());

    _defineProperty(_assertThisInitialized(_this), "cookie", "");

    _defineProperty(_assertThisInitialized(_this), "documentElement", _html);

    _defineProperty(_assertThisInitialized(_this), "readyState", "complete");

    _defineProperty(_assertThisInitialized(_this), "visibilityState", "visible");

    _defineProperty(_assertThisInitialized(_this), "hidden", false);

    _defineProperty(_assertThisInitialized(_this), "style", {});

    _defineProperty(_assertThisInitialized(_this), "location", window.location);

    _defineProperty(_assertThisInitialized(_this), "ontouchstart", null);

    _defineProperty(_assertThisInitialized(_this), "ontouchmove", null);

    _defineProperty(_assertThisInitialized(_this), "ontouchend", null);

    _html.appendChild(_this.head);

    _html.appendChild(_this.body);

    _WeakMap["default"].get(_assertThisInitialized(_this)).scripts = [];
    return _this;
  }

  _createClass(Document, [{
    key: "createElement",
    value: function createElement(tagName) {
      if (typeof tagName !== "string") {
        return null;
      }

      tagName = tagName.toUpperCase();

      if (tagName === 'CANVAS') {
        return new _HTMLCanvasElement["default"]();
      } else if (tagName === 'IMG') {
        return new Image();
      } else if (tagName === 'VIDEO') {
        return new _HTMLVideoElement["default"]();
      } else if (tagName === 'SCRIPT') {
        return new _HTMLScriptElement["default"]();
      } else if (tagName === "INPUT") {
        return new _HTMLInputElement["default"]();
      } else if (tagName === "AUDIO") {
        return new _Audio["default"]();
      } else if (tagName === "STYLE") {
        return new _HTMLStyleElement["default"]();
      } else if (tagName === "A") {
        return new _HTMLAnchorElement["default"]();
      }

      return new _HTMLElement["default"](tagName);
    }
  }, {
    key: "createElementNS",
    value: function createElementNS(namespaceURI, qualifiedName, options) {
      return this.createElement(qualifiedName);
    }
  }, {
    key: "createEvent",
    value: function createEvent(type) {
      if (window[type]) {
        return new window[type]();
      }

      return null;
    }
  }, {
    key: "createTextNode",
    value: function createTextNode() {
      console.warn("document.createTextNode() is not support!");
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent() {
      if (_html.dispatchEvent.apply(_html, arguments)) {
        return _get(_getPrototypeOf(Document.prototype), "dispatchEvent", this).apply(this, arguments);
      }

      return false;
    }
  }, {
    key: "appendChild",
    value: function appendChild(node) {
      var nodeName = node.nodeName;

      if (nodeName === "SCRIPT") {
        _WeakMap["default"].get(this).scripts.push(node);
      }

      return _get(_getPrototypeOf(Document.prototype), "appendChild", this).call(this, node);
    }
  }, {
    key: "removeChild",
    value: function removeChild(node) {
      var nodeName = node.nodeName;

      if (nodeName === "SCRIPT") {
        var scripts = _WeakMap["default"].get(this).scripts;

        for (var index = 0, length = scripts.length; index < length; ++index) {
          if (node === scripts[index]) {
            scripts.slice(index, 1);
            break;
          }
        }
      }

      return _get(_getPrototypeOf(Document.prototype), "removeChild", this).call(this, node);
    }
  }, {
    key: "getElementById",
    value: function getElementById(id) {
      if (!arguments.length) {
        throw "Uncaught TypeError: Failed to execute 'getElementById' on 'Document': 1 argument required, but only 0 present.";
      }

      var rootElement = this.documentElement;
      var elementArr = [].concat(rootElement.childNodes);
      var element;

      if (id === "canvas" || id === "glcanvas") {
        while (element = elementArr.pop()) {
          if (element.id === "canvas" || element.id === "glcanvas") {
            return element;
          }

          elementArr = elementArr.concat(element.childNodes);
        }
      } else {
        while (element = elementArr.pop()) {
          if (element.id === id) {
            return element;
          }

          elementArr = elementArr.concat(element.childNodes);
        }
      }

      return null;
    }
  }, {
    key: "getElementsByClassName",
    value: function getElementsByClassName(names) {
      if (!arguments.length) {
        throw "Uncaught TypeError: Failed to execute 'getElementsByClassName' on 'Document': 1 argument required, but only 0 present.";
      }

      if (typeof names !== "string" && names instanceof String) {
        return new _NodeList["default"]();
      }

      return this.documentElement.getElementsByClassName(names);
    }
  }, {
    key: "getElementsByTagName",
    value: function getElementsByTagName(tagName) {
      if (!arguments.length) {
        throw "Uncaught TypeError: Failed to execute 'getElementsByTagName' on 'Document': 1 argument required, but only 0 present.";
      }

      tagName = tagName.toUpperCase();
      var rootElement = this.documentElement;
      var result = new _NodeList["default"]();

      switch (tagName) {
        case "HEAD":
          {
            result.push(document.head);
            break;
          }

        case "BODY":
          {
            result.push(document.body);
            break;
          }

        default:
          {
            result = result.concat(rootElement.getElementsByTagName(tagName));
          }
      }

      return result;
    }
  }, {
    key: "getElementsByName",
    value: function getElementsByName(name) {
      if (!arguments.length) {
        throw "Uncaught TypeError: Failed to execute 'getElementsByName' on 'Document': 1 argument required, but only 0 present.";
      }

      var elementArr = [].concat(this.childNodes);
      var result = new _NodeList["default"]();
      var element;

      while (element = elementArr.pop()) {
        if (element.name === name) {
          result.push(element);
        }

        elementArr = elementArr.concat(element.childNodes);
      }

      return result;
    }
  }, {
    key: "querySelector",
    value: function querySelector(selectors) {
      if (!arguments.length) {
        throw "Uncaught TypeError: Failed to execute 'querySelectorAll' on 'Document': 1 argument required, but only 0 present.";
      }

      var nodeList = new _NodeList["default"]();

      switch (selectors) {
        case null:
        case undefined:
        case NaN:
        case true:
        case false:
        case "":
          return null;
      }

      if (typeof selectors !== "string" && selectors instanceof String) {
        throw "Uncaught DOMException: Failed to execute 'querySelectorAll' on 'Document': '" + selectors + "' is not a valid selector.";
      }

      var reg = /^[A-Za-z]+$/;
      var result = selectors.match(reg);

      if (result) {
        return this.getElementsByTagName(selectors);
      }

      reg = /^\.[A-Za-z$_][A-Za-z$_0-9\- ]*$/;
      result = selectors.match(reg);

      if (result) {
        var selectorArr = selectors.split(" ");
        var selector = selectorArr.shift();
        nodeList = this.getElementsByClassName(selector.substr(1));
        var length = selectorArr.length;

        if (length) {
          selectors = selectorArr.join(" ");
          length = nodeList.length;

          for (var index = 0; index < length; index++) {
            var subNodeList = nodeList[index].querySelector(selectors);

            if (subNodeList.length) {
              return subNodeList[0];
            }
          }
        }

        return nodeList[0];
      }

      reg = /^#[A-Za-z$_][A-Za-z$_0-9\-]*$/;
      result = selectors.match(reg);

      if (result) {
        var element = this.getElementById(selectors.substr(1));

        if (element) {
          nodeList.push(element);
        }
      }

      if (selectors === "*") {
        return this.getElementsByTagName(selectors);
      }

      return nodeList[0];
    }
  }, {
    key: "querySelectorAll",
    value: function querySelectorAll(selectors) {
      if (!arguments.length) {
        throw "Uncaught TypeError: Failed to execute 'querySelectorAll' on 'Document': 1 argument required, but only 0 present.";
      }

      var nodeList = new _NodeList["default"]();

      switch (selectors) {
        case null:
        case undefined:
        case NaN:
        case true:
        case false:
        case "":
          return nodeList;
      }

      if (typeof selectors !== "string" && selectors instanceof String) {
        throw "Uncaught DOMException: Failed to execute 'querySelectorAll' on 'Document': '" + selectors + "' is not a valid selector.";
      }

      var reg = /^[A-Za-z]+$/;
      var result = selectors.match(reg);

      if (result) {
        return this.getElementsByTagName(selectors);
      }

      reg = /^\.[A-Za-z$_][A-Za-z$_0-9\-]*$/;
      result = selectors.match(reg);

      if (result) {
        return this.getElementsByClassName(selectors.substr(1));
      }

      reg = /^#[A-Za-z$_][A-Za-z$_0-9\-]*$/;
      result = selectors.match(reg);

      if (result) {
        var element = this.getElementById(selectors.substr(1));

        if (element) {
          nodeList.push(element);
        }
      }

      if (selectors === "*") {
        return this.getElementsByTagName(selectors);
      }

      return nodeList;
    }
  }]);

  return Document;
}(_Node2["default"]);

exports["default"] = Document;

},{"./Audio":3,"./FontFaceSet":12,"./HTMLAnchorElement":13,"./HTMLBodyElement":15,"./HTMLCanvasElement":16,"./HTMLElement":17,"./HTMLHeadElement":18,"./HTMLHtmlElement":19,"./HTMLInputElement":21,"./HTMLScriptElement":23,"./HTMLStyleElement":24,"./HTMLVideoElement":25,"./Node":30,"./NodeList":31,"./util/WeakMap":53}],8:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Node2 = _interopRequireDefault(require("./Node"));

var _NodeList = _interopRequireDefault(require("./NodeList"));

var _DOMTokenList = _interopRequireDefault(require("./DOMToken\u200BList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Element = function (_Node) {
  _inherits(Element, _Node);

  var _super = _createSuper(Element);

  function Element(tagName) {
    var _this;

    _classCallCheck(this, Element);

    _this = _super.call(this, tagName);

    _defineProperty(_assertThisInitialized(_this), "className", '');

    _defineProperty(_assertThisInitialized(_this), "children", []);

    _defineProperty(_assertThisInitialized(_this), "classList", new _DOMTokenList["default"]());

    _defineProperty(_assertThisInitialized(_this), "value", 1);

    _defineProperty(_assertThisInitialized(_this), "content", "");

    _defineProperty(_assertThisInitialized(_this), "scrollLeft", 0);

    _defineProperty(_assertThisInitialized(_this), "scrollTop", 0);

    _defineProperty(_assertThisInitialized(_this), "clientLeft", 0);

    _defineProperty(_assertThisInitialized(_this), "clientTop", 0);

    return _this;
  }

  _createClass(Element, [{
    key: "getBoundingClientRect",
    value: function getBoundingClientRect() {
      return {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        top: 0,
        left: 0,
        bottom: window.innerHeight,
        right: window.innerWidth
      };
    }
  }, {
    key: "getElementsByTagName",
    value: function getElementsByTagName(tagName) {
      tagName = tagName.toUpperCase();
      var result = new _NodeList["default"]();
      var childNodes = this.childNodes;
      var length = childNodes.length;

      for (var index = 0; index < length; index++) {
        var element = childNodes[index];

        if (element.tagName === tagName || tagName === "*") {
          result.push(element);
        }

        result = result.concat(element);
      }

      return result;
    }
  }, {
    key: "getElementsByClassName",
    value: function getElementsByClassName(names) {
      if (!arguments.length) {
        throw "Uncaught TypeError: Failed to execute 'getElementsByClassName' on 'Document': 1 argument required, but only 0 present.";
      }

      var result = new _NodeList["default"]();

      if (typeof names !== "string" && names instanceof String) {
        return result;
      }

      var elementArr = [].concat(this.childNodes);
      var element;

      while (element = elementArr.pop()) {
        var classStr = element["class"];

        if (classStr) {
          var classArr = classStr.split(" ");
          var length = classArr.length;

          for (var index = 0; index < length; index++) {
            if (classArr[index] === names) {
              result.push(element);
              break;
            }
          }
        }

        elementArr = elementArr.concat(element.childNodes);
      }

      return result;
    }
  }, {
    key: "querySelector",
    value: function querySelector(selectors) {
      if (!arguments.length) {
        throw "Uncaught TypeError: Failed to execute 'querySelectorAll' on 'Document': 1 argument required, but only 0 present.";
      }

      var nodeList = new _NodeList["default"]();

      switch (selectors) {
        case null:
        case undefined:
        case NaN:
        case true:
        case false:
        case "":
          return null;
      }

      if (typeof selectors !== "string" && selectors instanceof String) {
        throw "Uncaught DOMException: Failed to execute 'querySelectorAll' on 'Document': '" + selectors + "' is not a valid selector.";
      }

      var reg = /^[A-Za-z]+$/;
      var result = selectors.match(reg);

      if (result) {
        return this.getElementsByTagName(selectors);
      }

      reg = /^.[A-Za-z$_][A-Za-z$_0-9\- ]*$/;
      result = selectors.match(reg);

      if (result) {
        var selectorArr = selectors.split(" ");
        var selector = selectorArr.shift();
        nodeList = this.getElementsByClassName(selector.substr(1));
        var length = selectorArr.length;

        if (length) {
          selectors = selectorArr.join(" ");
          length = nodeList.length;

          for (var index = 0; index < length; index++) {
            var subNodeList = nodeList[index].querySelector(selectors);

            if (subNodeList.length) {
              return subNodeList[0];
            }
          }
        }

        return nodeList[0];
      }

      reg = /^#[A-Za-z$_][A-Za-z$_0-9\-]*$/;
      result = selectors.match(reg);

      if (result) {
        var element = this.getElementById(selectors.substr(1));

        if (element) {
          nodeList.push(element);
        }
      }

      if (selectors === "*") {
        return this.getElementsByTagName(selectors);
      }

      return nodeList[0];
    }
  }, {
    key: "add",
    value: function add() {}
  }, {
    key: "requestFullscreen",
    value: function requestFullscreen() {}
  }, {
    key: "removeAttribute",
    value: function removeAttribute(attrName) {
      if (attrName === "style") {
        for (var styleName in this["style"]) {
          this["style"][styleName] = "";
        }
      } else {
        this[attrName] = "";
      }
    }
  }, {
    key: "setAttribute",
    value: function setAttribute(name, value) {
      if (name === "style") {
        if (typeof value == "undefined" || value == null || value == "") {
          for (var styleName in this["style"]) {
            this["style"][styleName] = "";
          }
        } else {
          value = value.replace(/\s*/g, "");
          var valueArray = value.split(";");

          for (var index in valueArray) {
            if (valueArray[index] != "") {
              var valueTemp = valueArray[index].split(":");
              this["style"][valueTemp[0]] = valueTemp[1];
            }
          }
        }
      } else {
        this[name] = value;
      }
    }
  }, {
    key: "getAttribute",
    value: function getAttribute(name) {
      var attributeValue = null;

      if (name == "style") {
        attributeValue = JSON.stringify(this["style"]);
      } else {
        attributeValue = this[name];
      }

      return attributeValue;
    }
  }, {
    key: "setAttributeNS",
    value: function setAttributeNS(ns, name, value) {
      this.setAttribute(name, value);
    }
  }, {
    key: "focus",
    value: function focus() {}
  }, {
    key: "blur",
    value: function blur() {}
  }, {
    key: "lastChild",
    get: function get() {
      var lastChild = this.childNodes[this.childNodes.length - 1];
      return lastChild ? lastChild : this.innerHTML ? new HTMLElement() : undefined;
    }
  }, {
    key: "firstChild",
    get: function get() {
      var child = this.childNodes[0];
      return child ? child : this.innerHTML ? new HTMLElement() : undefined;
    }
  }, {
    key: "firstElementChild",
    get: function get() {
      var child = this.childNodes[0];
      return child ? child : this.innerHTML ? new HTMLElement() : undefined;
    }
  }, {
    key: "clientHeight",
    get: function get() {
      var style = this.style || {};
      return parseInt(style.fontSize || "0");
    }
  }, {
    key: "tagName",
    get: function get() {
      return this.nodeName;
    }
  }]);

  return Element;
}(_Node2["default"]);

exports["default"] = Element;

},{"./DOMToken​List":5,"./Node":30,"./NodeList":31}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Event = function () {
  function Event(type, eventInit) {
    _classCallCheck(this, Event);

    this._type = type;
    this._target = null;
    this._eventPhase = 2;
    this._currentTarget = null;
    this._canceled = false;
    this._stopped = false;
    this._passiveListener = null;
    this._timeStamp = Date.now();
  }

  _createClass(Event, [{
    key: "composedPath",
    value: function composedPath() {
      var currentTarget = this._currentTarget;

      if (currentTarget === null) {
        return [];
      }

      return [currentTarget];
    }
  }, {
    key: "stopPropagation",
    value: function stopPropagation() {}
  }, {
    key: "stopImmediatePropagation",
    value: function stopImmediatePropagation() {
      this._stopped = true;
    }
  }, {
    key: "preventDefault",
    value: function preventDefault() {
      if (this._passiveListener !== null) {
        console.warn("Event#preventDefault() was called from a passive listener:", this._passiveListener);
        return;
      }

      if (!this.cancelable) {
        return;
      }

      this._canceled = true;
    }
  }, {
    key: "type",
    get: function get() {
      return this._type;
    }
  }, {
    key: "target",
    get: function get() {
      return this._target;
    }
  }, {
    key: "currentTarget",
    get: function get() {
      return this._currentTarget;
    }
  }, {
    key: "isTrusted",
    get: function get() {
      return false;
    }
  }, {
    key: "timeStamp",
    get: function get() {
      return this._timeStamp;
    },
    set: function set(value) {
      if (this.type.indexOf("touch")) {
        this._timeStamp = value;
      }
    }
  }, {
    key: "eventPhase",
    get: function get() {
      return this._eventPhase;
    }
  }, {
    key: "bubbles",
    get: function get() {
      return false;
    }
  }, {
    key: "cancelable",
    get: function get() {
      return true;
    }
  }, {
    key: "defaultPrevented",
    get: function get() {
      return this._canceled;
    }
  }, {
    key: "composed",
    get: function get() {
      return false;
    }
  }]);

  return Event;
}();

exports["default"] = Event;
Event.NONE = 0;
Event.CAPTURING_PHASE = 1;
Event.AT_TARGET = 2;
Event.BUBBLING_PHASE = 3;

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _TouchEvent = _interopRequireDefault(require("./TouchEvent"));

var _WeakMap = _interopRequireDefault(require("./util/WeakMap"));

var _DeviceMotionEvent = _interopRequireDefault(require("./DeviceMotionEvent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _listenerStat = {};

var _onTouchStart = function _onTouchStart(e) {
  var event = new _TouchEvent["default"]("touchstart");
  window.dispatchEvent(Object.assign(event, e));
};

var _onTouchMove = function _onTouchMove(e) {
  var event = new _TouchEvent["default"]("touchmove");
  window.dispatchEvent(Object.assign(event, e));
};

var _onTouchCancel = function _onTouchCancel(e) {
  var event = new _TouchEvent["default"]("touchcancel");
  window.dispatchEvent(Object.assign(event, e));
};

var _onTouchEnd = function _onTouchEnd(e) {
  var event = new _TouchEvent["default"]("touchend");
  window.dispatchEvent(Object.assign(event, e));
};

var _systemInfo = ral.getSystemInfoSync();

var _isAndroid = _systemInfo.platform.toLowerCase() === "android";

var _alpha = 0.8;
var _gravity = [0, 0, 0];

var _onAccelerometerChange = function _onAccelerometerChange(e) {
  if (_isAndroid) {
    e.x *= -10;
    e.y *= -10;
    e.z *= -10;
  } else {
    e.x *= 10;
    e.y *= 10;
    e.z *= 10;
  }

  _gravity[0] = _alpha * _gravity[0] + (1 - _alpha) * e.x;
  _gravity[1] = _alpha * _gravity[1] + (1 - _alpha) * e.y;
  _gravity[2] = _alpha * _gravity[2] + (1 - _alpha) * e.z;
  var event = new _DeviceMotionEvent["default"]({
    acceleration: {
      x: e.x - _gravity[0],
      y: e.y - _gravity[1],
      z: e.z - _gravity[2]
    },
    accelerationIncludingGravity: {
      x: e.x,
      y: e.y,
      z: e.z
    }
  });
  window.dispatchEvent(event);
};

var EventTarget = function () {
  function EventTarget() {
    _classCallCheck(this, EventTarget);

    _WeakMap["default"].set(this, {});
  }

  _createClass(EventTarget, [{
    key: "addEventListener",
    value: function addEventListener(type, listener) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var privateThis = _WeakMap["default"].get(this);

      if (!privateThis) {
        _WeakMap["default"].set(this, privateThis = {});
      }

      var events = _WeakMap["default"].get(privateThis);

      if (!events) {
        _WeakMap["default"].set(privateThis, events = {});
      }

      if (!events[type]) {
        events[type] = [];
      }

      var listenerArray = events[type];
      var length = listenerArray.length;

      for (var index = 0; index < length; ++index) {
        if (listenerArray[index] === listener) {
          return;
        }
      }

      listenerArray.push(listener);

      if (_listenerStat[type]) {
        ++_listenerStat[type];
      } else {
        _listenerStat[type] = 1;

        switch (type) {
          case "touchstart":
            {
              ral.onTouchStart(_onTouchStart);
              break;
            }

          case "touchmove":
            {
              ral.onTouchMove(_onTouchMove);
              break;
            }

          case "touchcancel":
            {
              ral.onTouchCancel(_onTouchCancel);
              break;
            }

          case "touchend":
            {
              ral.onTouchEnd(_onTouchEnd);
              break;
            }

          case "devicemotion":
            {
              ral.onAccelerometerChange(_onAccelerometerChange);
              ral.device.setMotionEnabled(true);
              break;
            }
        }
      }

      if (options.capture) {}

      if (options.once) {}

      if (options.passive) {}
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, listener) {
      var privateThis = _WeakMap["default"].get(this);

      var events;

      if (privateThis) {
        events = _WeakMap["default"].get(privateThis);
      }

      if (events) {
        var listeners = events[type];

        if (listeners && listeners.length > 0) {
          for (var i = listeners.length; i--; i > 0) {
            if (listeners[i] === listener) {
              listeners.splice(i, 1);

              if (--_listenerStat[type] === 0) {
                switch (type) {
                  case "touchstart":
                    {
                      ral.offTouchStart(_onTouchStart);
                      break;
                    }

                  case "touchmove":
                    {
                      ral.offTouchMove(_onTouchMove);
                      break;
                    }

                  case "touchcancel":
                    {
                      ral.offTouchCancel(_onTouchCancel);
                      break;
                    }

                  case "touchend":
                    {
                      ral.offTouchEnd(_onTouchEnd);
                      break;
                    }

                  case "devicemotion":
                    {
                      ral.offAccelerometerChange(_onAccelerometerChange);
                      ral.device.setMotionEnabled(false);
                      break;
                    }
                }
              }

              break;
            }
          }
        }
      }
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      event._target = event._currentTarget = this;

      if (event instanceof _TouchEvent["default"]) {
        var toucheArray = event.touches;
        var length = toucheArray.length;

        for (var index = 0; index < length; ++index) {
          toucheArray[index].target = this;
        }

        toucheArray = event.changedTouches;
        length = toucheArray.length;

        for (var _index = 0; _index < length; ++_index) {
          toucheArray[_index].target = this;
        }
      }

      var callback = this["on" + event.type];

      if (typeof callback === "function") {
        callback.call(this, event);
      }

      var privateThis = _WeakMap["default"].get(this);

      var events;

      if (privateThis) {
        events = _WeakMap["default"].get(privateThis);
      }

      if (events) {
        var listeners = events[event.type];

        if (listeners) {
          for (var i = 0; i < listeners.length; i++) {
            listeners[i].call(this, event);
          }
        }
      }

      event._target = event._currentTarget = null;
      return true;
    }
  }]);

  return EventTarget;
}();

exports["default"] = EventTarget;

},{"./DeviceMotionEvent":6,"./TouchEvent":33,"./util/WeakMap":53}],11:[function(require,module,exports){
"use strict";

var _WeakMap = _interopRequireDefault(require("./util/WeakMap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FontFace = function () {
  function FontFace(family, source, descriptors) {
    _classCallCheck(this, FontFace);

    this.family = family;
    this.source = source;
    this.descriptors = descriptors;
    var self = this;
    var _selfPrivate = {
      status: "unloaded",
      _status: "unloaded",
      load: function load() {
        this.status = "loading";
        var source;

        if (self.source.match(/url\(\s*'\s*(.*?)\s*'\s*\)/)) {
          source = self.source;
        } else {
          source = "url('" + self.source + "')";
        }

        var family = ral.loadFont(self.family, source);

        if (family) {
          this._status = "loaded";
        } else {
          this._status = "error";
        }

        setTimeout(function () {
          var status = _selfPrivate.status = _selfPrivate._status;

          if (status === "loaded") {
            _selfPrivate.loadResolve();
          } else {
            _selfPrivate.loadReject();
          }
        });
      }
    };

    _WeakMap["default"].set(this, _selfPrivate);

    _selfPrivate.loaded = new Promise(function (resolve, reject) {
      _selfPrivate.loadResolve = resolve;
      _selfPrivate.loadReject = reject;
    });
  }

  _createClass(FontFace, [{
    key: "load",
    value: function load() {
      _WeakMap["default"].get(this).load();

      return _WeakMap["default"].get(this).loaded;
    }
  }, {
    key: "status",
    get: function get() {
      return _WeakMap["default"].get(this).status;
    }
  }, {
    key: "loaded",
    get: function get() {
      return _WeakMap["default"].get(this).loaded;
    }
  }]);

  return FontFace;
}();

module.exports = FontFace;

},{"./util/WeakMap":53}],12:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _EventTarget2 = _interopRequireDefault(require("./EventTarget"));

var _Event = _interopRequireDefault(require("./Event"));

var _WeakMap = _interopRequireDefault(require("./util/WeakMap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var FontFaceSet = function (_EventTarget) {
  _inherits(FontFaceSet, _EventTarget);

  var _super = _createSuper(FontFaceSet);

  function FontFaceSet() {
    var _this;

    _classCallCheck(this, FontFaceSet);

    _this = _super.call(this);

    var self = _assertThisInitialized(_this);

    _WeakMap["default"].get(_assertThisInitialized(_this)).status = "loaded";
    _WeakMap["default"].get(_assertThisInitialized(_this)).ready = new Promise(function (resolve, reject) {
      _WeakMap["default"].get(self).readyResolve = resolve;
      _WeakMap["default"].get(self).readyReject = reject;
    });
    _WeakMap["default"].get(_assertThisInitialized(_this)).fontFaceSet = [];
    return _this;
  }

  _createClass(FontFaceSet, [{
    key: "add",
    value: function add(fontFace) {
      _WeakMap["default"].get(this).fontFaceSet.push(fontFace);
    }
  }, {
    key: "check",
    value: function check() {
      console.warn("FontFaceSet.check() not implements");
    }
  }, {
    key: "clear",
    value: function clear() {
      console.warn("FontFaceSet.clear() not implements");
    }
  }, {
    key: "delete",
    value: function _delete() {
      console.warn("FontFaceSet.delete() not implements");
    }
  }, {
    key: "load",
    value: function load() {
      var self = this;
      _WeakMap["default"].get(this).status = "loading";
      this.dispatchEvent(new _Event["default"]('loading'));
      return new Promise(function (resolve, reject) {
        var fontFaceSet = _WeakMap["default"].get(self).fontFaceSet;

        if (fontFaceSet) {
          for (var index in fontFaceSet) {
            var fontFace = fontFaceSet[index];

            var status = _WeakMap["default"].get(fontFace).status;

            if (status === "unloaded" || status === "error") {
              fontFace.load();

              if (_WeakMap["default"].get(fontFace)._status !== "loaded") {
                break;
              }
            }
          }

          _WeakMap["default"].get(self).status = "loaded";

          _WeakMap["default"].get(self).readyResolve([].concat(_WeakMap["default"].get(self).fontFaceSet));

          resolve([].concat(_WeakMap["default"].get(self).fontFaceSet));
          self.dispatchEvent(new _Event["default"]('loadingdone'));
          return;
        }

        _WeakMap["default"].get(self).status = "loaded";

        _WeakMap["default"].get(self).readyReject();

        reject();
        self.dispatchEvent(new _Event["default"]('loadingerror'));
      });
    }
  }, {
    key: "status",
    get: function get() {
      return _WeakMap["default"].get(this).status;
    }
  }, {
    key: "ready",
    get: function get() {
      return _WeakMap["default"].get(this).ready;
    }
  }]);

  return FontFaceSet;
}(_EventTarget2["default"]);

exports["default"] = FontFaceSet;

},{"./Event":9,"./EventTarget":10,"./util/WeakMap":53}],13:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _HTMLElement2 = _interopRequireDefault(require("./HTMLElement"));

var _WeakMap = _interopRequireDefault(require("./util/WeakMap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var HTMLAnchorElement = function (_HTMLElement) {
  _inherits(HTMLAnchorElement, _HTMLElement);

  var _super = _createSuper(HTMLAnchorElement);

  function HTMLAnchorElement() {
    var _this;

    _classCallCheck(this, HTMLAnchorElement);

    _this = _super.call(this, "A");
    _WeakMap["default"].get(_assertThisInitialized(_this)).protocol = ":";
    return _this;
  }

  _createClass(HTMLAnchorElement, [{
    key: "protocol",
    get: function get() {
      return _WeakMap["default"].get(this).protocol;
    }
  }]);

  return HTMLAnchorElement;
}(_HTMLElement2["default"]);

exports["default"] = HTMLAnchorElement;

},{"./HTMLElement":17,"./util/WeakMap":53}],14:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _HTMLMediaElement2 = _interopRequireDefault(require("./HTMLMediaElement"));

var _Event = _interopRequireDefault(require("./Event"));

var _WeakMap = _interopRequireDefault(require("./util/WeakMap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }

function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new Error('failed to set property'); } return value; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _ERROR = -1;

var _INITIALIZING = 0;
var _PLAYING = 1;
var _PAUSE = 2;

var _audio_valid_id = function _audio_valid_id(audioID) {
  return typeof audioID === "number";
};

var _audio_valid_src = function _audio_valid_src(src) {
  return typeof src === "string" && src !== "";
};

var HTMLAudioElement = function (_HTMLMediaElement) {
  _inherits(HTMLAudioElement, _HTMLMediaElement);

  var _super = _createSuper(HTMLAudioElement);

  function HTMLAudioElement(url) {
    _classCallCheck(this, HTMLAudioElement);

    return _super.call(this, url, 'AUDIO');
  }

  _createClass(HTMLAudioElement, [{
    key: "canPlayType",
    value: function canPlayType() {
      var mediaType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (typeof mediaType !== 'string') {
        return '';
      }

      if (mediaType.indexOf('audio/mpeg') > -1 || mediaType.indexOf('audio/mp4')) {
        return 'probably';
      }

      return '';
    }
  }, {
    key: "load",
    value: function load() {
      var privateThis = _WeakMap["default"].get(this);

      var audioID = privateThis.audioID;

      if (_audio_valid_id(audioID)) {
        ral.AudioEngine.stop(audioID);
        privateThis.audioID = null;
      }

      var src = this.src;

      if (_audio_valid_src(src)) {
        this.dispatchEvent({
          type: "loadstart"
        });
        var self = this;
        ral.AudioEngine.preload(this.src, function () {
          setTimeout(function () {
            if (self.src === src) {
              if (self.autoplay) {
                self.play();
              }

              self.dispatchEvent(new _Event["default"]("loadedmetadata"));
              self.dispatchEvent(new _Event["default"]("loadeddata"));
              self.dispatchEvent(new _Event["default"]("canplay"));
              self.dispatchEvent(new _Event["default"]("canplaythrough"));
            }
          });
        });
      } else {
        if (src !== "") {
          console.error("invalid src: ", src);
        }

        this.dispatchEvent(new _Event["default"]("error"));
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      var audioID = _WeakMap["default"].get(this).audioID;

      if (_audio_valid_id(audioID)) {
        var state = ral.AudioEngine.getState(audioID);

        if (state === _INITIALIZING || state === _PLAYING) {
          ral.AudioEngine.pause(audioID);
          this.dispatchEvent(new _Event["default"]("pause"));
        }
      }
    }
  }, {
    key: "play",
    value: function play() {
      if (!_audio_valid_src(this.src)) {
        this.dispatchEvent({
          type: "emptied"
        });
        console.error("Audio play: please define src before play");
        return;
      }

      var audioID = _WeakMap["default"].get(this).audioID;

      if (_audio_valid_id(audioID)) {
        var state = ral.AudioEngine.getState(audioID);

        switch (state) {
          case _PAUSE:
            {
              ral.AudioEngine.resume(audioID);
              this.dispatchEvent(new _Event["default"]("play"));
              this.dispatchEvent(new _Event["default"]("playing"));
              return;
            }

          case _PLAYING:
            {
              this.currentTime = 0;
              return;
            }

          case _INITIALIZING:
            {
              return;
            }

          case _ERROR:
          default:
            {}
        }
      }

      var self = this;
      audioID = ral.AudioEngine.play(this.src, this.loop, this.volume);

      if (audioID === -1) {
        setTimeout(function () {
          self.dispatchEvent(new _Event["default"]("error"));
          self.dispatchEvent(new _Event["default"]("ended"));
        });
        return;
      }

      var currentTime = this.currentTime;

      if (typeof currentTime === "number" && currentTime > 0) {
        ral.AudioEngine.setCurrentTime(audioID, currentTime);
      }

      this.dispatchEvent(new _Event["default"]("play"));
      ral.AudioEngine.setFinishCallback(audioID, function () {
        _WeakMap["default"].get(self).audioID = null;
        self.dispatchEvent(new _Event["default"]("ended"));
      });

      if (typeof ral.AudioEngine.setErrorCallback !== "undefined") {
        ral.AudioEngine.setErrorCallback(audioID, function () {
          _WeakMap["default"].get(self).audioID = null;
          self.dispatchEvent(new _Event["default"]("error"));
        });
      }

      if (typeof ral.AudioEngine.setWaitingCallback !== "undefined") {
        ral.AudioEngine.setWaitingCallback(audioID, function () {
          self.dispatchEvent(new _Event["default"]("waiting"));
        });
      }

      if (typeof ral.AudioEngine.setCanPlayCallback === "function") {
        ral.AudioEngine.setCanPlayCallback(audioID, function () {
          self.dispatchEvent(new _Event["default"]("canplay"));
        });
      }

      _WeakMap["default"].get(this).audioID = audioID;
    }
  }, {
    key: "currentTime",
    get: function get() {
      var audioID = _WeakMap["default"].get(this).audioID;

      if (_audio_valid_id(audioID)) {
        return ral.AudioEngine.getCurrentTime(audioID);
      } else {
        return _get(_getPrototypeOf(HTMLAudioElement.prototype), "currentTime", this);
      }
    },
    set: function set(value) {
      var audioID = _WeakMap["default"].get(this).audioID;

      if (_audio_valid_id(audioID)) {
        ral.AudioEngine.setCurrentTime(audioID, value);
      }

      _set(_getPrototypeOf(HTMLAudioElement.prototype), "currentTime", value, this, true);
    }
  }, {
    key: "duration",
    get: function get() {
      var audioID = _WeakMap["default"].get(this).audioID;

      if (_audio_valid_id(audioID)) {
        return ral.AudioEngine.getDuration(audioID);
      } else {
        return _get(_getPrototypeOf(HTMLAudioElement.prototype), "duration", this);
      }
    }
  }, {
    key: "loop",
    get: function get() {
      var audioID = _WeakMap["default"].get(this).audioID;

      if (_audio_valid_id(audioID)) {
        return ral.AudioEngine.isLoop(audioID);
      } else {
        return _get(_getPrototypeOf(HTMLAudioElement.prototype), "loop", this);
      }
    },
    set: function set(value) {
      var audioID = _WeakMap["default"].get(this).audioID;

      if (_audio_valid_id(audioID)) {
        ral.AudioEngine.setLoop(audioID, value);
      }

      _set(_getPrototypeOf(HTMLAudioElement.prototype), "loop", value, this, true);
    }
  }, {
    key: "volume",
    get: function get() {
      var audioID = _WeakMap["default"].get(this).audioID;

      if (_audio_valid_id(audioID)) {
        return ral.AudioEngine.getVolume(audioID);
      } else {
        return _get(_getPrototypeOf(HTMLAudioElement.prototype), "volume", this);
      }
    },
    set: function set(value) {
      var audioID = _WeakMap["default"].get(this).audioID;

      if (_audio_valid_id(audioID)) {
        ral.AudioEngine.setVolume(audioID, value);
      }

      _set(_getPrototypeOf(HTMLAudioElement.prototype), "volume", value, this, true);
    }
  }, {
    key: "src",
    get: function get() {
      return _get(_getPrototypeOf(HTMLAudioElement.prototype), "src", this);
    },
    set: function set(value) {
      var privateThis = _WeakMap["default"].get(this);

      var audioID = privateThis.audioID;

      if (_audio_valid_id(audioID)) {
        ral.AudioEngine.stop(audioID);
        privateThis.audioID = null;
      }

      _set(_getPrototypeOf(HTMLAudioElement.prototype), "src", value, this, true);

      if (_audio_valid_src(value)) {
        if (this.autoplay || this.preload === "auto") {
          this.load();
        }
      } else {
        if (value !== "") {
          console.error("invalid src: ", value);
        }

        this.dispatchEvent(new _Event["default"]("error"));
      }
    }
  }]);

  return HTMLAudioElement;
}(_HTMLMediaElement2["default"]);

exports["default"] = HTMLAudioElement;

},{"./Event":9,"./HTMLMediaElement":22,"./util/WeakMap":53}],15:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _HTMLElement2 = _interopRequireDefault(require("./HTMLElement.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var HTMLBodyElement = function (_HTMLElement) {
  _inherits(HTMLBodyElement, _HTMLElement);

  var _super = _createSuper(HTMLBodyElement);

  function HTMLBodyElement(parentNode) {
    var _this;

    _classCallCheck(this, HTMLBodyElement);

    _this = _super.call(this, "BODY");

    _defineProperty(_assertThisInitialized(_this), "parentNode", null);

    _this.parentNode = parentNode;
    return _this;
  }

  return HTMLBodyElement;
}(_HTMLElement2["default"]);

exports["default"] = HTMLBodyElement;

},{"./HTMLElement.js":17}],16:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _HTMLElement2 = _interopRequireDefault(require("./HTMLElement"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

if (ral.getFeatureProperty("HTMLCanvasElement", "spec") === "vivo_platform_support") {
  var HTMLCanvasElement = window.HTMLCanvasElement;
  module.exports = HTMLCanvasElement;
} else {
  var CANVAS_DEFAULT_WIDTH = 300;
  var CANVAS_DEFAULT_HEIGHT = 150;
  window.ral = window.ral || {};
  var _createCanvas = ral.createCanvas;

  var _HTMLCanvasElement = function (_HTMLElement) {
    _inherits(_HTMLCanvasElement, _HTMLElement);

    var _super = _createSuper(_HTMLCanvasElement);

    function _HTMLCanvasElement(width, height) {
      var _this;

      _classCallCheck(this, _HTMLCanvasElement);

      _this = _super.call(this, 'CANVAS');
      _this.id = 'glcanvas';
      _this.type = 'canvas';
      _this.top = 0;
      _this.left = 0;

      if (typeof ral.getFeatureProperty("ral.createCanvas", "spec") === "undefined") {
        var canvas = _createCanvas();

        canvas.__proto__.__proto__ = _HTMLCanvasElement.prototype;
        Object.keys(_assertThisInitialized(_this)).forEach(function (key) {
          canvas[key] = this[key];
        }.bind(_assertThisInitialized(_this)));
        canvas.width = width >= 0 ? Math.ceil(width) : CANVAS_DEFAULT_WIDTH;
        canvas.height = height >= 0 ? Math.ceil(height) : CANVAS_DEFAULT_HEIGHT;
        canvas._targetID = _this._targetID;
        canvas._listenerCount = _this._listenerCount;
        canvas._listeners = _this._listeners;
        return _possibleConstructorReturn(_this, canvas);
      } else {
        _this._width = width ? Math.ceil(width) : CANVAS_DEFAULT_WIDTH;
        _this._height = height ? Math.ceil(height) : CANVAS_DEFAULT_HEIGHT;
        _this._context2D = null;
        _this._alignment = _this._width % 2 === 0 ? 8 : 4;
      }

      return _this;
    }

    _createClass(_HTMLCanvasElement, [{
      key: "getContext",
      value: function getContext(name, opts) {
        var self = this;

        if (name === 'webgl' || name === 'experimental-webgl') {
          return window.__gl;
        } else if (name === '2d') {
          if (!this._context2D) {
            this._context2D = new CanvasRenderingContext2D(this.width, this.height);
            this._context2D._innerCanvas = this;
          }

          return this._context2D;
        }

        return null;
      }
    }, {
      key: "clientWidth",
      get: function get() {
        return this.width;
      }
    }, {
      key: "clientHeight",
      get: function get() {
        return this.height;
      }
    }, {
      key: "width",
      set: function set(width) {
        width = parseInt(width);

        if (isNaN(width)) {
          width = CANVAS_DEFAULT_WIDTH;
        } else if (width < 0) {
          width = CANVAS_DEFAULT_WIDTH;
        }

        this._width = width;
        this._alignment = this._width % 2 === 0 ? 8 : 4;

        if (this._context2D) {
          this._context2D._width = width;
        }
      },
      get: function get() {
        return this._width;
      }
    }, {
      key: "height",
      set: function set(height) {
        height = parseInt(height);

        if (isNaN(height)) {
          height = CANVAS_DEFAULT_HEIGHT;
        } else if (height < 0) {
          height = CANVAS_DEFAULT_HEIGHT;
        }

        this._height = height;

        if (this._context2D) {
          this._context2D._height = height;
        }
      },
      get: function get() {
        return this._height;
      }
    }]);

    return _HTMLCanvasElement;
  }(_HTMLElement2["default"]);

  module.exports = _HTMLCanvasElement;
}

},{"./HTMLElement":17}],17:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Element2 = _interopRequireDefault(require("./Element"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var HTMLElement = function (_Element) {
  _inherits(HTMLElement, _Element);

  var _super = _createSuper(HTMLElement);

  function HTMLElement(tagName) {
    var _this;

    _classCallCheck(this, HTMLElement);

    _this = _super.call(this, tagName);

    _defineProperty(_assertThisInitialized(_this), "className", '');

    _defineProperty(_assertThisInitialized(_this), "childern", []);

    _defineProperty(_assertThisInitialized(_this), "style", {
      width: "".concat(window.innerWidth, "px"),
      height: "".concat(window.innerHeight, "px")
    });

    _defineProperty(_assertThisInitialized(_this), "insertBefore", function () {});

    _defineProperty(_assertThisInitialized(_this), "innerHTML", '');

    return _this;
  }

  _createClass(HTMLElement, [{
    key: "setAttribute",
    value: function setAttribute(name, value) {
      this[name] = value;
    }
  }, {
    key: "getAttribute",
    value: function getAttribute(name) {
      return this[name];
    }
  }, {
    key: "clientWidth",
    get: function get() {
      var ret = parseInt(this.style.fontSize, 10) * this.innerHTML.length;
      return Number.isNaN(ret) ? 0 : ret;
    }
  }, {
    key: "clientHeight",
    get: function get() {
      var ret = parseInt(this.style.fontSize, 10);
      return Number.isNaN(ret) ? 0 : ret;
    }
  }]);

  return HTMLElement;
}(_Element2["default"]);

exports["default"] = HTMLElement;

},{"./Element":8}],18:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _HTMLElement2 = _interopRequireDefault(require("./HTMLElement.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var HTMLHeadElement = function (_HTMLElement) {
  _inherits(HTMLHeadElement, _HTMLElement);

  var _super = _createSuper(HTMLHeadElement);

  function HTMLHeadElement(parentNode) {
    var _this;

    _classCallCheck(this, HTMLHeadElement);

    _this = _super.call(this, "HEAD");

    _defineProperty(_assertThisInitialized(_this), "parentNode", null);

    _this.parentNode = parentNode;
    return _this;
  }

  return HTMLHeadElement;
}(_HTMLElement2["default"]);

exports["default"] = HTMLHeadElement;

},{"./HTMLElement.js":17}],19:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _HTMLElement2 = _interopRequireDefault(require("./HTMLElement"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var HTMLHtmlElement = function (_HTMLElement) {
  _inherits(HTMLHtmlElement, _HTMLElement);

  var _super = _createSuper(HTMLHtmlElement);

  function HTMLHtmlElement() {
    _classCallCheck(this, HTMLHtmlElement);

    return _super.call(this, "HTML");
  }

  _createClass(HTMLHtmlElement, [{
    key: "version",
    get: function get() {
      return "";
    }
  }]);

  return HTMLHtmlElement;
}(_HTMLElement2["default"]);

exports["default"] = HTMLHtmlElement;

},{"./HTMLElement":17}],20:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _HTMLElement2 = _interopRequireDefault(require("./HTMLElement"));

var _Event = _interopRequireDefault(require("./Event"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

if (ral.getFeatureProperty("HTMLImageElement", "spec") === "vivo_platform_support") {
  var HTMLImageElement = window.HTMLImageElement;
  module.exports = HTMLImageElement;
} else {
  window.ral = window.ral || {};
  var _creteImage = ral.createImage;

  var _image;

  var _setter;

  var _getter;

  console.error("=====ral.getFeaturePropertyl:", ral.getFeatureProperty("ral.createImage", "spec"), typeof ral.getFeatureProperty("ral.createImage", "spec") === "undefined");

  if (typeof ral.getFeatureProperty("ral.createImage", "spec") === "undefined") {
    _image = _creteImage();

    var _descriptor = Object.getOwnPropertyDescriptor(_image.__proto__, "src");

    _setter = _descriptor.set;
    _getter = _descriptor.get;
  }

  var _HTMLImageElement = function (_HTMLElement) {
    _inherits(_HTMLImageElement, _HTMLElement);

    var _super = _createSuper(_HTMLImageElement);

    function _HTMLImageElement(width, height, isCalledFromImage) {
      var _this;

      _classCallCheck(this, _HTMLImageElement);

      if (!isCalledFromImage) {
        throw new TypeError("Illegal constructor, use 'new Image(w, h); instead!'");
      }

      _this = _super.call(this, 'IMG');
      _this.complete = false;
      _this.crossOrigin = null;
      _this.naturalWidth = 0;
      _this.naturalHeight = 0;
      _this.width = width || 0;
      _this.height = height || 0;

      if (typeof ral.getFeatureProperty("ral.createImage", "spec") === "undefined") {
        var image = _creteImage();

        Object.keys(_assertThisInitialized(_this)).forEach(function (key) {
          image[key] = this[key];
        }.bind(_assertThisInitialized(_this)));

        image._onload = function () {
          this.complete = true;
          this.naturalWidth = this.width;
          this.naturalHeight = this.height;
          this.dispatchEvent(new _Event["default"]("load"));
        }.bind(image);

        image._onerror = function () {
          this.dispatchEvent(new _Event["default"]("error"));
        }.bind(image);

        Object.defineProperty(image, "src", {
          configurable: true,
          enumerable: true,
          get: function get() {
            return _getter.call(this);
          },
          set: function set(value) {
            this.complete = false;
            return _setter.call(this, value);
          }
        });
        return _possibleConstructorReturn(_this, image);
      }

      return _this;
    }

    _createClass(_HTMLImageElement, [{
      key: "getBoundingClientRect",
      value: function getBoundingClientRect() {
        return new DOMRect(0, 0, this.width, this.height);
      }
    }, {
      key: "src",
      set: function set(src) {
        var _this2 = this;

        this._src = src;

        if (src === "") {
          this.width = 0;
          this.height = 0;
          this._data = null;
          this._imageMeta = null;
          this.complete = true;
          this._glFormat = this._glInternalFormat = 0x1908;
          this.crossOrigin = null;
          return;
        }

        ral.loadImageData(src, function (info) {
          if (!info) {
            var _event = new _Event["default"]('error');

            _this2.dispatchEvent(_event);

            return;
          }

          _this2._imageMeta = info;
          _this2.width = _this2.naturalWidth = info.width;
          _this2.height = _this2.naturalHeight = info.height;
          _this2._data = info.data;
          _this2._glFormat = info.glFormat;
          _this2._glInternalFormat = info.glInternalFormat;
          _this2._glType = info.glType;
          _this2._numberOfMipmaps = info.numberOfMipmaps;
          _this2._compressed = info.compressed;
          _this2._bpp = info.bpp;
          _this2._premultiplyAlpha = info.premultiplyAlpha;
          _this2._alignment = 1;

          if ((_this2._numberOfMipmaps == 0 || _this2._numberOfMipmaps == 1) && !_this2._compressed) {
            var bytesPerRow = _this2.width * _this2._bpp / 8;
            if (bytesPerRow % 8 == 0) _this2._alignment = 8;else if (bytesPerRow % 4 == 0) _this2._alignment = 4;else if (bytesPerRow % 2 == 0) _this2._alignment = 2;
          }

          _this2.complete = true;
          var event = new _Event["default"]('load');

          _this2.dispatchEvent(event);
        });
      },
      get: function get() {
        return this._src;
      }
    }, {
      key: "clientWidth",
      get: function get() {
        return this.width;
      }
    }, {
      key: "clientHeight",
      get: function get() {
        return this.height;
      }
    }]);

    return _HTMLImageElement;
  }(_HTMLElement2["default"]);

  module.exports = _HTMLImageElement;
}

},{"./Event":9,"./HTMLElement":17}],21:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _HTMLElement2 = _interopRequireDefault(require("./HTMLElement"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

window.ral = window.ral || {};

var HTMLInputElement = function (_HTMLElement) {
  _inherits(HTMLInputElement, _HTMLElement);

  var _super = _createSuper(HTMLInputElement);

  function HTMLInputElement() {
    _classCallCheck(this, HTMLInputElement);

    return _super.call(this, "INPUT");
  }

  _createClass(HTMLInputElement, [{
    key: "focus",
    value: function focus() {
      _get(_getPrototypeOf(HTMLInputElement.prototype), "focus", this).call(this);

      if (!this.target.editable) {
        return;
      }

      var that = this;

      var onKeyboardInput = function onKeyboardInput(res) {
        var str = res ? res.value : "";
        that.inputTarget.text = str;
        that.target.event("input");
      };

      var onKeyboardConfirm = function onKeyboardConfirm(res) {
        var str = res ? res.value : "";
        that.target.text = str;
        that.target.event("input");
        that.target.focus = false;
        ral.offKeyboardConfirm(onKeyboardConfirm);
        ral.offKeyboardInput(onKeyboardInput);
        ral.hideKeyboard({});
      };

      ral.offKeyboardInput(onKeyboardInput);
      ral.offKeyboardConfirm(onKeyboardConfirm);
      ral.showKeyboard({
        defaultValue: this.value,
        maxLength: this.maxLength,
        multiple: this.target.multiline,
        confirmHold: false,
        inputType: this.target.type,
        success: function success(res) {},
        fail: function fail(res) {}
      });
      ral.onKeyboardInput(onKeyboardInput);
      ral.onKeyboardConfirm(onKeyboardConfirm);
    }
  }, {
    key: "blur",
    value: function blur() {
      _get(_getPrototypeOf(HTMLInputElement.prototype), "blur", this).call(this);

      ral.hideKeyboard({});
    }
  }]);

  return HTMLInputElement;
}(_HTMLElement2["default"]);

exports["default"] = HTMLInputElement;

},{"./HTMLElement":17}],22:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _HTMLElement2 = _interopRequireDefault(require("./HTMLElement"));

var _MediaError = _interopRequireDefault(require("./MediaError"));

var _WeakMap = _interopRequireDefault(require("./util/WeakMap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var HTMLMediaElement = function (_HTMLElement) {
  _inherits(HTMLMediaElement, _HTMLElement);

  var _super = _createSuper(HTMLMediaElement);

  _createClass(HTMLMediaElement, null, [{
    key: "NETWORK_EMPTY",
    get: function get() {
      return 0;
    }
  }, {
    key: "NETWORK_IDLE",
    get: function get() {
      return 1;
    }
  }, {
    key: "NETWORK_LOADING",
    get: function get() {
      return 2;
    }
  }, {
    key: "NETWORK_NO_SOURCE",
    get: function get() {
      return 3;
    }
  }, {
    key: "HAVE_NOTHING",
    get: function get() {
      return 0;
    }
  }, {
    key: "HAVE_METADATA",
    get: function get() {
      return 1;
    }
  }, {
    key: "HAVE_CURRENT_DATA",
    get: function get() {
      return 2;
    }
  }, {
    key: "HAVE_FUTURE_DATA",
    get: function get() {
      return 3;
    }
  }, {
    key: "HAVE_ENOUGH_DATA",
    get: function get() {
      return 4;
    }
  }]);

  function HTMLMediaElement(url, type) {
    var _this;

    _classCallCheck(this, HTMLMediaElement);

    _this = _super.call(this, type);

    _defineProperty(_assertThisInitialized(_this), "audioTracks", undefined);

    _defineProperty(_assertThisInitialized(_this), "autoplay", false);

    _defineProperty(_assertThisInitialized(_this), "controller", null);

    _defineProperty(_assertThisInitialized(_this), "controls", false);

    _defineProperty(_assertThisInitialized(_this), "crossOrigin", null);

    _defineProperty(_assertThisInitialized(_this), "defaultMuted", false);

    _defineProperty(_assertThisInitialized(_this), "defaultPlaybackRate", 1.0);

    _defineProperty(_assertThisInitialized(_this), "mediaGroup", undefined);

    _defineProperty(_assertThisInitialized(_this), "mediaKeys", null);

    _defineProperty(_assertThisInitialized(_this), "mozAudioChannelType", undefined);

    _defineProperty(_assertThisInitialized(_this), "muted", false);

    _defineProperty(_assertThisInitialized(_this), "networkState", HTMLMediaElement.NETWORK_EMPTY);

    _defineProperty(_assertThisInitialized(_this), "playbackRate", 1);

    _defineProperty(_assertThisInitialized(_this), "preload", "auto");

    _defineProperty(_assertThisInitialized(_this), "loop", false);

    Object.assign(_WeakMap["default"].get(_assertThisInitialized(_this)), {
      buffered: undefined,
      currentSrc: url || "",
      duration: 0,
      ended: false,
      error: null,
      initialTime: 0,
      paused: true,
      readyState: HTMLMediaElement.HAVE_NOTHING,
      volume: 1.0,
      currentTime: 0
    });

    _this.addEventListener("ended", function () {
      _WeakMap["default"].get(this).ended = true;
    });

    _this.addEventListener("play", function () {
      _WeakMap["default"].get(this).ended = false;
      _WeakMap["default"].get(this).error = null;
      _WeakMap["default"].get(this).paused = false;
    });

    _this.addEventListener("error", function () {
      _WeakMap["default"].get(this).error = true;
      _WeakMap["default"].get(this).ended = true;
      _WeakMap["default"].get(this).paused = false;
    });

    return _this;
  }

  _createClass(HTMLMediaElement, [{
    key: "canPlayType",
    value: function canPlayType(mediaType) {
      return 'maybe';
    }
  }, {
    key: "captureStream",
    value: function captureStream() {}
  }, {
    key: "fastSeek",
    value: function fastSeek() {}
  }, {
    key: "load",
    value: function load() {}
  }, {
    key: "pause",
    value: function pause() {}
  }, {
    key: "play",
    value: function play() {}
  }, {
    key: "currentTime",
    get: function get() {
      return _WeakMap["default"].get(this).currentTime;
    },
    set: function set(value) {
      _WeakMap["default"].get(this).currentTime = value;
    }
  }, {
    key: "src",
    get: function get() {
      return _WeakMap["default"].get(this).currentSrc;
    },
    set: function set(value) {
      _WeakMap["default"].get(this).currentSrc = value;
    }
  }, {
    key: "buffered",
    get: function get() {
      return _WeakMap["default"].get(this).buffered;
    }
  }, {
    key: "currentSrc",
    get: function get() {
      return _WeakMap["default"].get(this).currentSrc;
    }
  }, {
    key: "duration",
    get: function get() {
      return _WeakMap["default"].get(this).duration;
    }
  }, {
    key: "ended",
    get: function get() {
      return _WeakMap["default"].get(this).ended;
    }
  }, {
    key: "error",
    get: function get() {
      return _WeakMap["default"].get(this).error;
    }
  }, {
    key: "initialTime",
    get: function get() {
      return _WeakMap["default"].get(this).initialTime;
    }
  }, {
    key: "paused",
    get: function get() {
      return _WeakMap["default"].get(this).paused;
    }
  }, {
    key: "volume",
    get: function get() {
      return _WeakMap["default"].get(this).volume;
    },
    set: function set(value) {
      _WeakMap["default"].get(this).volume = value;
    }
  }]);

  return HTMLMediaElement;
}(_HTMLElement2["default"]);

exports["default"] = HTMLMediaElement;

},{"./HTMLElement":17,"./MediaError":28,"./util/WeakMap":53}],23:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _HTMLElement2 = _interopRequireDefault(require("./HTMLElement"));

var _Event = _interopRequireDefault(require("./Event"));

var _FileCache = _interopRequireDefault(require("./util/FileCache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _BASE64_NAME = "data:application/javascript;base64,";
var _URI_NAME = "data:application/javascript,";

var _getPathFromBase64String = function _getPathFromBase64String(src) {
  if (src === null || src === undefined) {
    return src;
  }

  if (src.startsWith(_BASE64_NAME)) {
    var content = src.substring(_BASE64_NAME.length);
    var source = window.atob(content);
    var len = source.length;

    if (len > 0) {
      return _getDiskPathFromArrayBuffer(source, len);
    } else {
      return src;
    }
  } else if (src.startsWith(_URI_NAME)) {
    var _content = src.substring(_URI_NAME.length);

    var _source = decodeURIComponent(_content);

    var _len = _source.length;

    if (_len > 0) {
      return _getDiskPathFromArrayBuffer(_source, _len);
    } else {
      return src;
    }
  } else {
    return src;
  }
};

function _getDiskPathFromArrayBuffer(source, len) {
  var arrayBuffer = new ArrayBuffer(len);
  var uint8Array = new Uint8Array(arrayBuffer);

  for (var i = 0; i < len; i++) {
    uint8Array[i] = source.charCodeAt(i);
  }

  return _FileCache["default"].getCache(arrayBuffer);
}

var HTMLScriptElement = function (_HTMLElement) {
  _inherits(HTMLScriptElement, _HTMLElement);

  var _super = _createSuper(HTMLScriptElement);

  function HTMLScriptElement() {
    var _this;

    _classCallCheck(this, HTMLScriptElement);

    _this = _super.call(this, 'SCRIPT');

    var self = _assertThisInitialized(_this);

    var onAppend = function onAppend() {
      self.removeEventListener("append", onAppend);

      var src = _getPathFromBase64String(self.src);

      require(src);

      self.dispatchEvent(new _Event["default"]('load'));
    };

    _this.addEventListener("append", onAppend);

    return _this;
  }

  return HTMLScriptElement;
}(_HTMLElement2["default"]);

exports["default"] = HTMLScriptElement;

},{"./Event":9,"./HTMLElement":17,"./util/FileCache":52}],24:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _FontFace = _interopRequireDefault(require("./FontFace"));

var _HTMLElement2 = _interopRequireDefault(require("./HTMLElement"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var HTMLStyleElement = function (_HTMLElement) {
  _inherits(HTMLStyleElement, _HTMLElement);

  var _super = _createSuper(HTMLStyleElement);

  function HTMLStyleElement() {
    var _this;

    _classCallCheck(this, HTMLStyleElement);

    _this = _super.call(this, "STYLE");

    var self = _assertThisInitialized(_this);

    var onAppend = function onAppend() {
      self.removeEventListener("append", onAppend);
      var textContent = self.textContent || self.innerHTML || "";
      var fontFaceStr = "";
      var start = 0;
      var length = textContent.length;
      var flag = 0;

      for (var index = 0; index < length; ++index) {
        if (start > 0) {
          if (textContent[index] === "{") {
            flag++;
          } else if (textContent[index] === "}") {
            flag--;

            if (flag === 0) {
              fontFaceStr = textContent.substring(start, index + 1);
              break;
            } else if (flag < 0) {
              break;
            }
          }
        } else {
          if (textContent[index] === "@" && textContent.substr(index, "@font-face".length) === "@font-face") {
            index += 9;
            start = index + 1;
          }
        }
      }

      if (fontFaceStr) {
        var fontFamily;
        var _length = fontFaceStr.length;

        var _start = fontFaceStr.indexOf("font-family");

        if (_start === -1) {
          return;
        }

        _start += "font-family".length + 1;
        var end = _start;

        for (; end < _length; ++end) {
          if (fontFaceStr[end] === ";") {
            fontFamily = fontFaceStr.substring(_start, end).trim();
            break;
          } else if (fontFaceStr[end] === ":") {
            _start = end + 1;
          }
        }

        if (!fontFamily) {
          return;
        }

        end = fontFaceStr.indexOf("url(");
        _start = 0;
        var source;

        for (; end < _length; ++end) {
          if (fontFaceStr[end] === "'" || fontFaceStr[end] === '"') {
            if (_start > 0) {
              source = fontFaceStr.substring(_start, end).trim();
              break;
            }

            _start = end + 1;
          }
        }

        if (source) {
          var fontFace = new _FontFace["default"](fontFamily, source);
          fontFace.load();
          document.fonts.add(fontFace);
        }
      }
    };

    _this.addEventListener("append", onAppend);

    return _this;
  }

  return HTMLStyleElement;
}(_HTMLElement2["default"]);

exports["default"] = HTMLStyleElement;

},{"./FontFace":11,"./HTMLElement":17}],25:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _HTMLMediaElement2 = _interopRequireDefault(require("./HTMLMediaElement"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var HTMLVideoElement = function (_HTMLMediaElement) {
  _inherits(HTMLVideoElement, _HTMLMediaElement);

  var _super = _createSuper(HTMLVideoElement);

  function HTMLVideoElement() {
    _classCallCheck(this, HTMLVideoElement);

    return _super.call(this, 'VIDEO');
  }

  _createClass(HTMLVideoElement, [{
    key: "canPlayType",
    value: function canPlayType(type) {
      return type === 'video/mp4';
    }
  }]);

  return HTMLVideoElement;
}(_HTMLMediaElement2["default"]);

exports["default"] = HTMLVideoElement;

},{"./HTMLMediaElement":22}],26:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _HTMLImageElement2 = _interopRequireDefault(require("./HTMLImageElement"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _Image = window.Image;

var Image = function (_HTMLImageElement) {
  _inherits(Image, _HTMLImageElement);

  var _super = _createSuper(Image);

  function Image(width, height) {
    _classCallCheck(this, Image);

    return _super.call(this, width, height, true);
  }

  return Image;
}(_HTMLImageElement2["default"]);

exports["default"] = Image;
var _creteImage = ral.createImage;

if (_creteImage) {
  _Image.prototype.__proto__ = Image.prototype;
}

},{"./HTMLImageElement":20}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Location = function () {
  function Location() {
    _classCallCheck(this, Location);

    _defineProperty(this, "ancestorOrigins", "");

    _defineProperty(this, "hash", "");

    _defineProperty(this, "host", "");

    _defineProperty(this, "hostname", "");

    _defineProperty(this, "href", "game.js");

    _defineProperty(this, "origin", "");

    _defineProperty(this, "password", "");

    _defineProperty(this, "pathname", "game.js");

    _defineProperty(this, "port", "");

    _defineProperty(this, "protocol", "");

    _defineProperty(this, "search", "");

    _defineProperty(this, "username", "");
  }

  _createClass(Location, [{
    key: "assign",
    value: function assign() {}
  }, {
    key: "reload",
    value: function reload() {}
  }, {
    key: "replace",
    value: function replace() {}
  }, {
    key: "toString",
    value: function toString() {
      return "";
    }
  }]);

  return Location;
}();

exports["default"] = Location;

},{}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MEDIA_ERR_ABORTED = 1;
var MEDIA_ERR_NETWORK = 2;
var MEDIA_ERR_DECODE = 3;
var MEDIA_ERR_SRC_NOT_SUPPORTED = 4;

var MediaError = function () {
  function MediaError() {
    _classCallCheck(this, MediaError);
  }

  _createClass(MediaError, [{
    key: "code",
    get: function get() {
      return MEDIA_ERR_ABORTED;
    }
  }, {
    key: "message",
    get: function get() {
      return "";
    }
  }]);

  return MediaError;
}();

exports["default"] = MediaError;
module.exports = MediaError;

},{}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Navigator = function Navigator(platform, language) {
  _classCallCheck(this, Navigator);

  _defineProperty(this, "platform", "");

  _defineProperty(this, "language", "");

  _defineProperty(this, "appVersion", '5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1');

  _defineProperty(this, "userAgent", 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 NetType/WIFI Language/zh_CN');

  _defineProperty(this, "onLine", true);

  _defineProperty(this, "maxTouchPoints", 10);

  _defineProperty(this, "geolocation", {
    getCurrentPosition: function getCurrentPosition() {},
    watchPosition: function watchPosition() {},
    clearWatch: function clearWatch() {}
  });

  this.platform = platform;
  this.language = language;
};

exports["default"] = Navigator;

},{}],30:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _EventTarget2 = _interopRequireDefault(require("./EventTarget"));

var _Event = _interopRequireDefault(require("./Event"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Node = function (_EventTarget) {
  _inherits(Node, _EventTarget);

  var _super = _createSuper(Node);

  function Node(nodeName) {
    var _this;

    _classCallCheck(this, Node);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "childNodes", []);

    _defineProperty(_assertThisInitialized(_this), "parentNode", null);

    _defineProperty(_assertThisInitialized(_this), "_nodeName", "");

    _this._nodeName = nodeName;
    return _this;
  }

  _createClass(Node, [{
    key: "appendChild",
    value: function appendChild(node) {
      this.childNodes.push(node);
      node.parentNode = this;
      var nodeName = node.nodeName;

      if (nodeName === "SCRIPT" || nodeName === "STYLE") {
        node.dispatchEvent(new _Event["default"]("append"));
      }

      return node;
    }
  }, {
    key: "cloneNode",
    value: function cloneNode() {
      var copyNode = Object.create(this);
      Object.assign(copyNode, this);
      copyNode.parentNode = null;
      return copyNode;
    }
  }, {
    key: "removeChild",
    value: function removeChild(node) {
      var index = this.childNodes.findIndex(function (child) {
        return child === node;
      });

      if (index > -1) {
        var _node = this.childNodes.splice(index, 1)[0];
        _node.parentNode = null;
        return _node;
      }

      return null;
    }
  }, {
    key: "contains",
    value: function contains(node) {
      return this.childNodes.indexOf(node) > -1;
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent() {
      var result = true;
      var length = this.childNodes.length;

      for (var index = length - 1; result && index >= 0; --index) {
        var _this$childNodes$inde;

        result = (_this$childNodes$inde = this.childNodes[index]).dispatchEvent.apply(_this$childNodes$inde, arguments);
      }

      if (result) {
        return _get(_getPrototypeOf(Node.prototype), "dispatchEvent", this).apply(this, arguments);
      }

      return false;
    }
  }, {
    key: "nodeName",
    get: function get() {
      return this._nodeName;
    }
  }]);

  return Node;
}(_EventTarget2["default"]);

exports["default"] = Node;

},{"./Event":9,"./EventTarget":10}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _WeakMap = _interopRequireDefault(require("./util/WeakMap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var NodeList = function () {
  function NodeList() {
    _classCallCheck(this, NodeList);

    _WeakMap["default"].set(this, {
      array: []
    });

    return new Proxy(this, {
      get: function get(target, key) {
        if (_typeof(key) === "symbol") {
          return function () {
            return "";
          };
        }

        if (/^[0-9]*$/.test(key)) {
          return _WeakMap["default"].get(target).array[key];
        }

        var result = target[key];

        if (typeof result === "function") {
          result = result.bind(target);
        }

        return result;
      }
    });
  }

  _createClass(NodeList, [{
    key: "push",
    value: function push(element) {
      _WeakMap["default"].get(this).array.push(element);
    }
  }, {
    key: "item",
    value: function item(index) {
      return _WeakMap["default"].get(this).array[index];
    }
  }, {
    key: "concat",
    value: function concat() {
      var array = _WeakMap["default"].get(this).array;

      return array.concat.apply(array, arguments);
    }
  }, {
    key: "length",
    get: function get() {
      return _WeakMap["default"].get(this).array.length;
    }
  }]);

  return NodeList;
}();

exports["default"] = NodeList;

},{"./util/WeakMap":53}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

window.ral = window.ral || {};

var Screen = function () {
  function Screen() {
    _classCallCheck(this, Screen);

    _defineProperty(this, "availTop", 0);

    _defineProperty(this, "availLeft", 0);

    _defineProperty(this, "availHeight", window.innerHeight);

    _defineProperty(this, "availWidth", window.innerWidth);

    _defineProperty(this, "colorDepth", 8);

    _defineProperty(this, "pixelDepth", 0);

    _defineProperty(this, "left", 0);

    _defineProperty(this, "top", 0);

    _defineProperty(this, "width", window.innerWidth);

    _defineProperty(this, "height", window.innerHeight);

    _defineProperty(this, "orientation", {
      type: 'portrait-primary'
    });
  }

  _createClass(Screen, [{
    key: "onorientationchange",
    value: function onorientationchange() {}
  }]);

  return Screen;
}();

exports["default"] = Screen;

},{}],33:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Event2 = _interopRequireDefault(require("./Event"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var TouchEvent = function (_Event) {
  _inherits(TouchEvent, _Event);

  var _super = _createSuper(TouchEvent);

  function TouchEvent(type) {
    var _this;

    _classCallCheck(this, TouchEvent);

    _this = _super.call(this, type);
    _this.touches = [];
    _this.targetTouches = [];
    _this.changedTouches = [];
    return _this;
  }

  return TouchEvent;
}(_Event2["default"]);

exports["default"] = TouchEvent;

},{"./Event":9}],34:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Event = _interopRequireDefault(require("./Event"));

var _FileCache = _interopRequireDefault(require("./util/FileCache"));

var _XMLHttpRequestEventTarget = _interopRequireDefault(require("./XMLHttpRequestEventTarget"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var fsm = ral.getFileSystemManager();
var _XMLHttpRequest = window.XMLHttpRequest;
window.ral = window.ral || {};

var XMLHttpRequest = function (_XMLHttpRequestEventT) {
  _inherits(XMLHttpRequest, _XMLHttpRequestEventT);

  var _super = _createSuper(XMLHttpRequest);

  function XMLHttpRequest() {
    var _this;

    _classCallCheck(this, XMLHttpRequest);

    _this = _super.call(this, new _XMLHttpRequest());

    _defineProperty(_assertThisInitialized(_this), "_isLocal", false);

    _defineProperty(_assertThisInitialized(_this), "_readyState", void 0);

    _defineProperty(_assertThisInitialized(_this), "_response", void 0);

    _defineProperty(_assertThisInitialized(_this), "_responseText", void 0);

    _defineProperty(_assertThisInitialized(_this), "_responseURL", void 0);

    _defineProperty(_assertThisInitialized(_this), "_responseXML", void 0);

    _defineProperty(_assertThisInitialized(_this), "_status", void 0);

    _defineProperty(_assertThisInitialized(_this), "_statusText", void 0);

    var xhr = _this._xhr;

    xhr.onreadystatechange = function (e) {
      var event = new _Event["default"]("readystatechange");
      this.dispatchEvent(Object.assign(event, e));
    }.bind(_assertThisInitialized(_this));

    return _this;
  }

  _createClass(XMLHttpRequest, [{
    key: "abort",
    value: function abort() {
      this._xhr.abort();
    }
  }, {
    key: "getAllResponseHeaders",
    value: function getAllResponseHeaders() {
      return this._xhr.getAllResponseHeaders();
    }
  }, {
    key: "getResponseHeader",
    value: function getResponseHeader(name) {
      return this._xhr.getResponseHeader(name);
    }
  }, {
    key: "open",
    value: function open(method, url, async, user, password) {
      if (typeof url === "string") {
        var _url = url.toLocaleString();

        if (_url.startsWith("http://") || _url.startsWith("https://")) {
          var _this$_xhr;

          this._isLocal = false;
          return (_this$_xhr = this._xhr).open.apply(_this$_xhr, arguments);
        }
      }

      this._isLocal = true;
      this._url = url;
    }
  }, {
    key: "overrideMimeType",
    value: function overrideMimeType() {
      var _this$_xhr2;

      return (_this$_xhr2 = this._xhr).overrideMimeType.apply(_this$_xhr2, arguments);
    }
  }, {
    key: "send",
    value: function send() {
      if (this._isLocal) {
        var self = this;
        var isBinary = this._xhr.responseType === "arraybuffer";
        fsm.readFile({
          filePath: this._url,
          encoding: isBinary ? "binary" : "utf8",
          success: function success(res) {
            self._status = 200;
            self._readyState = 4;
            self._response = self._responseText = res.data;

            if (isBinary) {
              _FileCache["default"].setCache(self._url, res.data);
            }

            var eventProgressStart = new _Event["default"]("progress");
            eventProgressStart.loaded = 0;
            eventProgressStart.total = isBinary ? res.data.byteLength : res.data.length;
            var eventProgressEnd = new _Event["default"]("progress");
            eventProgressEnd.loaded = eventProgressStart.total;
            eventProgressEnd.total = eventProgressStart.total;
            self.dispatchEvent(new _Event["default"]("loadstart"));
            self.dispatchEvent(eventProgressStart);
            self.dispatchEvent(eventProgressEnd);
            self.dispatchEvent(new _Event["default"]("load"));
          },
          fail: function (res) {
            if (res.errCode === 1) {
              self._status = 404;
              self._readyState = 4;
              self.dispatchEvent(new _Event["default"]("loadstart"));
              self.dispatchEvent(new _Event["default"]("load"));
            } else {
              this.dispatchEvent(new _Event["default"]("error"));
            }
          }.bind(this),
          complete: function () {
            this.dispatchEvent(new _Event["default"]("loadend"));
          }.bind(this)
        });
      } else {
        var _this$_xhr3;

        (_this$_xhr3 = this._xhr).send.apply(_this$_xhr3, arguments);
      }
    }
  }, {
    key: "setRequestHeader",
    value: function setRequestHeader() {
      var _this$_xhr4;

      (_this$_xhr4 = this._xhr).setRequestHeader.apply(_this$_xhr4, arguments);
    }
  }, {
    key: "readyState",
    get: function get() {
      if (this._isLocal) {
        return this._readyState;
      } else {
        return this._xhr.readyState;
      }
    }
  }, {
    key: "response",
    get: function get() {
      if (this._isLocal) {
        return this._response;
      } else {
        return this._xhr.response;
      }
    }
  }, {
    key: "responseText",
    get: function get() {
      if (this._isLocal) {
        return this._responseText;
      } else {
        return this._xhr.responseText;
      }
    }
  }, {
    key: "responseType",
    get: function get() {
      return this._xhr.responseType;
    },
    set: function set(value) {
      this._xhr.responseType = value;
    }
  }, {
    key: "responseURL",
    get: function get() {
      if (this._isLocal) {
        return this._responseURL;
      } else {
        return this._xhr.responseURL;
      }
    }
  }, {
    key: "responseXML",
    get: function get() {
      if (this._isLocal) {
        return this._responseXML;
      } else {
        return this._xhr.responseXML;
      }
    }
  }, {
    key: "status",
    get: function get() {
      if (this._isLocal) {
        return this._status;
      } else {
        return this._xhr.status;
      }
    }
  }, {
    key: "statusText",
    get: function get() {
      if (this._isLocal) {
        return this._statusText;
      } else {
        return this._xhr.statusText;
      }
    }
  }, {
    key: "timeout",
    get: function get() {
      return this._xhr.timeout;
    },
    set: function set(value) {
      this._xhr.timeout = value;
    }
  }, {
    key: "upload",
    get: function get() {
      return this._xhr.upload;
    }
  }, {
    key: "withCredentials",
    set: function set(value) {
      this._xhr.withCredentials = value;
    },
    get: function get() {
      return this._xhr.withCredentials;
    }
  }]);

  return XMLHttpRequest;
}(_XMLHttpRequestEventTarget["default"]);

exports["default"] = XMLHttpRequest;

},{"./Event":9,"./XMLHttpRequestEventTarget":35,"./util/FileCache":52}],35:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _EventTarget2 = _interopRequireDefault(require("./EventTarget"));

var _Event = _interopRequireDefault(require("./Event"));

var _FileCache = _interopRequireDefault(require("./util/FileCache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var XMLHttpRequestEventTarget = function (_EventTarget) {
  _inherits(XMLHttpRequestEventTarget, _EventTarget);

  var _super = _createSuper(XMLHttpRequestEventTarget);

  function XMLHttpRequestEventTarget(xhr) {
    var _this;

    _classCallCheck(this, XMLHttpRequestEventTarget);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "_xhr", void 0);

    _this._xhr = xhr;

    xhr.onabort = function (e) {
      var event = new _Event["default"]("abort");
      this.dispatchEvent(Object.assign(event, e));
    }.bind(_assertThisInitialized(_this));

    xhr.onerror = function (e) {
      var event = new _Event["default"]("error");
      this.dispatchEvent(Object.assign(event, e));
    }.bind(_assertThisInitialized(_this));

    xhr.onload = function (e) {
      if (this.response instanceof ArrayBuffer) {
        _FileCache["default"].setItem(this.response, this._url);
      }

      var event = new _Event["default"]("load");
      this.dispatchEvent(Object.assign(event, e));
    }.bind(_assertThisInitialized(_this));

    xhr.onloadstart = function (e) {
      var event = new _Event["default"]("loadstart");
      this.dispatchEvent(Object.assign(event, e));
    }.bind(_assertThisInitialized(_this));

    xhr.onprogress = function (e) {
      var event = new _Event["default"]("progress");
      this.dispatchEvent(Object.assign(event, e));
    }.bind(_assertThisInitialized(_this));

    xhr.ontimeout = function (e) {
      var event = new _Event["default"]("timeout");
      this.dispatchEvent(Object.assign(event, e));
    }.bind(_assertThisInitialized(_this));

    xhr.onloadend = function (e) {
      var event = new _Event["default"]("loadend");
      this.dispatchEvent(Object.assign(event, e));
    }.bind(_assertThisInitialized(_this));

    return _this;
  }

  return XMLHttpRequestEventTarget;
}(_EventTarget2["default"]);

exports["default"] = XMLHttpRequestEventTarget;

},{"./Event":9,"./EventTarget":10,"./util/FileCache":52}],36:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _AudioNode2 = _interopRequireDefault(require("./AudioNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var AnalyserNode = function (_AudioNode) {
  _inherits(AnalyserNode, _AudioNode);

  var _super = _createSuper(AnalyserNode);

  function AnalyserNode(context, options) {
    var _this;

    _classCallCheck(this, AnalyserNode);

    _this = _super.call(this, context);
    _this._fftSize;
    _this.frequencyBinCount;
    _this.minDecibels;
    _this.maxDecibels;
    _this.smoothingTimeConstant;
    return _this;
  }

  _createClass(AnalyserNode, [{
    key: "getFloatFrequencyData",
    value: function getFloatFrequencyData(array) {}
  }, {
    key: "getByteFrequencyData",
    value: function getByteFrequencyData(dataArray) {
      return new Uint8Array(dataArray.length);
    }
  }, {
    key: "getFloatTimeDomainData",
    value: function getFloatTimeDomainData(dataArray) {}
  }, {
    key: "getByteTimeDomainData",
    value: function getByteTimeDomainData(dataArray) {}
  }, {
    key: "fftSize",
    set: function set(value) {
      this._fftSize = value;
      this.frequencyBinCount = value / 2;
    },
    get: function get() {
      return this._fftSize;
    }
  }]);

  return AnalyserNode;
}(_AudioNode2["default"]);

var _default = AnalyserNode;
exports["default"] = _default;

},{"./AudioNode":42}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _FileCache = _interopRequireDefault(require("../util/FileCache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ae = ral.AudioEngine;

var AudioBuffer = function () {
  function AudioBuffer(context, buffer) {
    _classCallCheck(this, AudioBuffer);

    this.context = context;
    this.url = "";
    this._sampleRate = 48000;
    this._length = 386681;
    this._duration = 0;
    this._numberOfChannels = 48000;

    _FileCache["default"].getPath(buffer, function (url) {
      if (!url) {
        return;
      }

      this.url = url;
      ae.preload(url, function (isSucceed, duration) {
        if (isSucceed) {
          this._duration = duration;
        }
      }.bind(this));
    }.bind(this));
  }

  _createClass(AudioBuffer, [{
    key: "sampleRate",
    get: function get() {
      return this._sampleRate;
    }
  }, {
    key: "length",
    get: function get() {
      return this._length;
    }
  }, {
    key: "duration",
    get: function get() {
      return this._duration;
    }
  }, {
    key: "numberOfChannels",
    get: function get() {
      return this._numberOfChannels;
    }
  }]);

  return AudioBuffer;
}();

var _default = AudioBuffer;
exports["default"] = _default;

},{"../util/FileCache":52}],38:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _AudioNode2 = _interopRequireDefault(require("./AudioNode"));

var _AudioParam = _interopRequireDefault(require("./AudioParam"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var AudioBufferSourceNode = function (_AudioNode) {
  _inherits(AudioBufferSourceNode, _AudioNode);

  var _super = _createSuper(AudioBufferSourceNode);

  function AudioBufferSourceNode(context, options) {
    var _this;

    _classCallCheck(this, AudioBufferSourceNode);

    _this = _super.call(this, context);
    _this.buffer = null;
    _this.detune = new _AudioParam["default"]({
      value: 0
    });
    _this._loop = false;
    _this.loopStart = 0;
    _this.loopEnd = 0;
    _this._playbackRate = new _AudioParam["default"]({
      value: 1.0
    });
    _this.audioEngine = ral.AudioEngine;
    _this.audioID = -1;
    return _this;
  }

  _createClass(AudioBufferSourceNode, [{
    key: "start",
    value: function start(when, offset, duration) {
      if (!this.buffer) {
        return;
      }

      var audioEngine = this.audioEngine;

      if (this.audioID !== -1) {
        audioEngine.stop(this.audioID);
      }

      var audioID = this.audioID = audioEngine.play(this.buffer.url, this.loop, 1);
      audioEngine.setFinishCallback(audioID, this.onended);
      audioEngine.setCurrentTime(audioID, this.loopStart);
    }
  }, {
    key: "stop",
    value: function stop(when) {
      var audioEngine = this.audioEngine;

      if (this.audioID === -1) {
        return;
      }

      audioEngine.stop(this.audioID);
      this.audioID = -1;
    }
  }, {
    key: "onended",
    value: function onended() {}
  }, {
    key: "playbackRate",
    set: function set(value) {
      console.warn("playbackRate nonsupport");
      this._playbackRate = value;
    },
    get: function get() {
      return this._playbackRate;
    }
  }, {
    key: "loop",
    set: function set(value) {
      var audioEngine = this.audioEngine;
      var audioID = this.audioID;
      var loop = !!value;

      if (audioID !== -1 && audioEngine) {
        audioEngine.setLoop(audioID, loop);
      }

      this._loop = loop;
    },
    get: function get() {
      return this._loop;
    }
  }]);

  return AudioBufferSourceNode;
}(_AudioNode2["default"]);

var _default = AudioBufferSourceNode;
exports["default"] = _default;

},{"./AudioNode":42,"./AudioParam":43}],39:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _BaseAudioContext2 = _interopRequireDefault(require("./BaseAudioContext"));

var _MediaElementAudioSourceNode = _interopRequireDefault(require("./MediaElementAudioSourceNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var AudioContext = function (_BaseAudioContext) {
  _inherits(AudioContext, _BaseAudioContext);

  var _super = _createSuper(AudioContext);

  function AudioContext(options) {
    var _this;

    _classCallCheck(this, AudioContext);

    _this = _super.call(this);
    _this.baseLatency;
    _this.outputLatency;
    return _this;
  }

  _createClass(AudioContext, [{
    key: "close",
    value: function close() {
      console.log("AudioContext close");
    }
  }, {
    key: "createMediaElementSource",
    value: function createMediaElementSource(myMediaElement) {
      return new _MediaElementAudioSourceNode["default"](this, {
        mediaElement: myMediaElement
      });
    }
  }, {
    key: "createMediaStreamSource",
    value: function createMediaStreamSource() {}
  }, {
    key: "createMediaStreamDestination",
    value: function createMediaStreamDestination() {}
  }, {
    key: "createMediaStreamTrackSource",
    value: function createMediaStreamTrackSource() {}
  }, {
    key: "getOutputTimestamp",
    value: function getOutputTimestamp() {}
  }, {
    key: "resume",
    value: function resume() {}
  }, {
    key: "suspend",
    value: function suspend() {}
  }]);

  return AudioContext;
}(_BaseAudioContext2["default"]);

var _default = AudioContext;
exports["default"] = _default;

},{"./BaseAudioContext":45,"./MediaElementAudioSourceNode":48}],40:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _AudioNode2 = _interopRequireDefault(require("./AudioNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var AudioDestinationNode = function (_AudioNode) {
  _inherits(AudioDestinationNode, _AudioNode);

  var _super = _createSuper(AudioDestinationNode);

  function AudioDestinationNode(context) {
    var _this;

    _classCallCheck(this, AudioDestinationNode);

    _this = _super.call(this, context);
    _this.maxChannelCount = 2;
    return _this;
  }

  return AudioDestinationNode;
}(_AudioNode2["default"]);

var _default = AudioDestinationNode;
exports["default"] = _default;

},{"./AudioNode":42}],41:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _AudioNode2 = _interopRequireDefault(require("./AudioNode"));

var _AudioParam = _interopRequireDefault(require("./AudioParam"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var AudioListener = function (_AudioNode) {
  _inherits(AudioListener, _AudioNode);

  var _super = _createSuper(AudioListener);

  function AudioListener(context) {
    var _this;

    _classCallCheck(this, AudioListener);

    _this = _super.call(this, context);
    _this.positionX = new _AudioParam["default"]({
      value: 0
    });
    _this.positionY = new _AudioParam["default"]({
      value: 0
    });
    _this.positionZ = new _AudioParam["default"]({
      value: 0
    });
    _this.forwardX = new _AudioParam["default"]({
      value: 0
    });
    _this.forwardY = new _AudioParam["default"]({
      value: 0
    });
    _this.forwardZ = new _AudioParam["default"]({
      value: -1
    });
    _this.upX = new _AudioParam["default"]({
      value: 0
    });
    _this.upY = new _AudioParam["default"]({
      value: 1
    });
    _this.upZ = new _AudioParam["default"]({
      value: 0
    });
    return _this;
  }

  _createClass(AudioListener, [{
    key: "setOrientation",
    value: function setOrientation(x, y, z) {}
  }, {
    key: "setPosition",
    value: function setPosition(x, y, z) {
      x = x || 0;
      y = y || 0;
      z = z || 0;
      this.positionX.value = x;
      this.positionY.value = y;
      this.positionZ.value = z;
    }
  }]);

  return AudioListener;
}(_AudioNode2["default"]);

var _default = AudioListener;
exports["default"] = _default;

},{"./AudioNode":42,"./AudioParam":43}],42:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _EventTarget2 = _interopRequireDefault(require("../EventTarget"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var AudioNode = function (_EventTarget) {
  _inherits(AudioNode, _EventTarget);

  var _super = _createSuper(AudioNode);

  function AudioNode(context) {
    var _this;

    _classCallCheck(this, AudioNode);

    _this = _super.call(this);
    _this._context = context;
    _this.numberOfInputs = 1;
    _this.numberOfOutputs = 1;
    _this.channelCount = 2;
    _this.channelCountMode = "explicit";
    _this.channelInterpretation = "speakers";
    return _this;
  }

  _createClass(AudioNode, [{
    key: "connect",
    value: function connect(destination, outputIndex, inputIndex) {}
  }, {
    key: "disconnect",
    value: function disconnect() {}
  }, {
    key: "isNumber",
    value: function isNumber(obj) {
      return typeof obj === 'number' || obj instanceof Number;
    }
  }, {
    key: "context",
    get: function get() {
      return this._context;
    }
  }]);

  return AudioNode;
}(_EventTarget2["default"]);

var _default = AudioNode;
exports["default"] = _default;

},{"../EventTarget":10}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AudioParam = function () {
  function AudioParam() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, AudioParam);

    this.automationRate = options.automationRate || "a-rate";
    this._defaultValue = options.defaultValue || 1;
    this._maxValue = options.maxValue || Number.MAX_VALUE;
    this._minValue = options.minValue || -Number.MAX_VALUE;
    this.value = options.value || 1;
  }

  _createClass(AudioParam, [{
    key: "setValueAtTime",
    value: function setValueAtTime(value, startTime) {
      this.value = value;
    }
  }, {
    key: "linearRampToValueAtTime",
    value: function linearRampToValueAtTime(value, endTime) {
      if (endTime < 0) {
        return;
      }

      var k = value / endTime;
      var self = this;

      var func = function func(dt) {
        dt = dt / 1000;

        if (dt > endTime) {
          dt = endTime;
        }

        if (dt < 0) {
          dt = 0;
        }

        endTime -= dt;
        self.value += dt * k;

        if (endTime > 0) {
          requestAnimationFrame(func);
        }
      };

      requestAnimationFrame(func);
    }
  }, {
    key: "exponentialRampToValueAtTime",
    value: function exponentialRampToValueAtTime() {}
  }, {
    key: "setTargetAtTime",
    value: function setTargetAtTime(target, startTime, timeConstant) {
      this.value = target;
    }
  }, {
    key: "setValueCurveAtTime",
    value: function setValueCurveAtTime() {}
  }, {
    key: "cancelScheduledValues",
    value: function cancelScheduledValues() {}
  }, {
    key: "cancelAndHoldAtTime",
    value: function cancelAndHoldAtTime() {}
  }, {
    key: "defaultValue",
    get: function get() {
      return this._defaultValue;
    }
  }, {
    key: "maxValue",
    get: function get() {
      return this._maxValue;
    }
  }, {
    key: "minValue",
    get: function get() {
      return this._minValue;
    }
  }, {
    key: "value",
    set: function set(value) {
      value = Math.min(this._maxValue, value);
      this._value = Math.max(this._minValue, value);
    },
    get: function get() {
      return this._value;
    }
  }]);

  return AudioParam;
}();

var _default = AudioParam;
exports["default"] = _default;

},{}],44:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _AudioNode2 = _interopRequireDefault(require("./AudioNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var AudioScheduledSourceNode = function (_AudioNode) {
  _inherits(AudioScheduledSourceNode, _AudioNode);

  var _super = _createSuper(AudioScheduledSourceNode);

  function AudioScheduledSourceNode(context) {
    _classCallCheck(this, AudioScheduledSourceNode);

    return _super.call(this, context);
  }

  _createClass(AudioScheduledSourceNode, [{
    key: "onended",
    value: function onended(event) {}
  }, {
    key: "start",
    value: function start(when, offset, duration) {}
  }, {
    key: "stop",
    value: function stop(when) {}
  }]);

  return AudioScheduledSourceNode;
}(_AudioNode2["default"]);

var _default = AudioScheduledSourceNode;
exports["default"] = _default;

},{"./AudioNode":42}],45:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _EventTarget2 = _interopRequireDefault(require("../EventTarget"));

var _AudioListener = _interopRequireDefault(require("./AudioListener"));

var _PeriodicWave = _interopRequireDefault(require("./PeriodicWave"));

var _AudioBuffer = _interopRequireDefault(require("./AudioBuffer"));

var _DynamicsCompressorNode = _interopRequireDefault(require("./DynamicsCompressorNode"));

var _AudioBufferSourceNode = _interopRequireDefault(require("./AudioBufferSourceNode"));

var _AudioDestinationNode = _interopRequireDefault(require("./AudioDestinationNode"));

var _OscillatorNode = _interopRequireDefault(require("./OscillatorNode"));

var _AnalyserNode = _interopRequireDefault(require("./AnalyserNode"));

var _PannerNode = _interopRequireDefault(require("./PannerNode"));

var _GainNode = _interopRequireDefault(require("./GainNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var BaseAudioContext = function (_EventTarget) {
  _inherits(BaseAudioContext, _EventTarget);

  var _super = _createSuper(BaseAudioContext);

  function BaseAudioContext() {
    var _this;

    _classCallCheck(this, BaseAudioContext);

    _this = _super.call(this);
    _this.audioWorklet;
    _this.currentTime = 0;
    _this.destination = new _AudioDestinationNode["default"](_assertThisInitialized(_this));
    _this.listener = new _AudioListener["default"](_assertThisInitialized(_this));
    _this.sampleRate;
    _this.state = "running";
    return _this;
  }

  _createClass(BaseAudioContext, [{
    key: "createAnalyser",
    value: function createAnalyser() {
      return new _AnalyserNode["default"](this);
    }
  }, {
    key: "createBiquadFilter",
    value: function createBiquadFilter() {}
  }, {
    key: "createBuffer",
    value: function createBuffer() {}
  }, {
    key: "createBufferSource",
    value: function createBufferSource() {
      return new _AudioBufferSourceNode["default"](this);
    }
  }, {
    key: "createConstantSource",
    value: function createConstantSource() {}
  }, {
    key: "createChannelMerger",
    value: function createChannelMerger() {}
  }, {
    key: "createChannelSplitter",
    value: function createChannelSplitter() {}
  }, {
    key: "createConvolver",
    value: function createConvolver() {}
  }, {
    key: "createDelay",
    value: function createDelay() {}
  }, {
    key: "createDynamicsCompressor",
    value: function createDynamicsCompressor() {
      return new _DynamicsCompressorNode["default"](this);
    }
  }, {
    key: "createGain",
    value: function createGain() {
      return new _GainNode["default"](this);
    }
  }, {
    key: "createIIRFilter",
    value: function createIIRFilter() {}
  }, {
    key: "createOscillator",
    value: function createOscillator() {
      return new _OscillatorNode["default"](this);
    }
  }, {
    key: "createPanner",
    value: function createPanner() {
      return new _PannerNode["default"](this);
    }
  }, {
    key: "createPeriodicWave",
    value: function createPeriodicWave() {
      return new _PeriodicWave["default"](this);
    }
  }, {
    key: "createScriptProcessor",
    value: function createScriptProcessor() {}
  }, {
    key: "createStereoPanner",
    value: function createStereoPanner() {}
  }, {
    key: "createWaveShaper",
    value: function createWaveShaper() {}
  }, {
    key: "decodeAudioData",
    value: function decodeAudioData(audioData, callFunc) {
      callFunc(new _AudioBuffer["default"](this, audioData));
    }
  }, {
    key: "onstatechange",
    value: function onstatechange() {}
  }]);

  return BaseAudioContext;
}(_EventTarget2["default"]);

var _default = BaseAudioContext;
exports["default"] = _default;

},{"../EventTarget":10,"./AnalyserNode":36,"./AudioBuffer":37,"./AudioBufferSourceNode":38,"./AudioDestinationNode":40,"./AudioListener":41,"./DynamicsCompressorNode":46,"./GainNode":47,"./OscillatorNode":49,"./PannerNode":50,"./PeriodicWave":51}],46:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _AudioNode2 = _interopRequireDefault(require("./AudioNode"));

var _AudioParam = _interopRequireDefault(require("./AudioParam"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var DynamicsCompressorNode = function (_AudioNode) {
  _inherits(DynamicsCompressorNode, _AudioNode);

  var _super = _createSuper(DynamicsCompressorNode);

  function DynamicsCompressorNode(context) {
    var _this;

    _classCallCheck(this, DynamicsCompressorNode);

    _this = _super.call(this, context);
    _this._threshold = new _AudioParam["default"]({
      value: -24,
      defaultValue: -24,
      maxValue: 0,
      minValue: -100
    });
    _this._knee = new _AudioParam["default"]({
      value: 30,
      defaultValue: 30,
      maxValue: 40,
      minValue: 0
    });
    _this._ratio = new _AudioParam["default"]({
      value: 12,
      defaultValue: 12,
      maxValue: 20,
      minValue: 1
    });
    _this._reduction = new _AudioParam["default"]({
      value: 0,
      defaultValue: 0,
      maxValue: 0,
      minValue: -20
    });
    _this._attack = new _AudioParam["default"]({
      value: 0.003,
      defaultValue: 0.003,
      maxValue: 1,
      minValue: 0
    });
    _this._release = new _AudioParam["default"]({
      value: 0.25,
      defaultValue: 0.25,
      maxValue: 1,
      minValue: 0
    });
    return _this;
  }

  _createClass(DynamicsCompressorNode, [{
    key: "threshold",
    get: function get() {
      return this._threshold;
    }
  }, {
    key: "keen",
    get: function get() {
      return this._keen;
    }
  }, {
    key: "ratio",
    get: function get() {
      return this._ratio;
    }
  }, {
    key: "reduction",
    get: function get() {
      return this._reduction;
    }
  }, {
    key: "attack",
    get: function get() {
      return this._attack;
    }
  }, {
    key: "release",
    get: function get() {
      return this._release;
    }
  }]);

  return DynamicsCompressorNode;
}(_AudioNode2["default"]);

var _default = DynamicsCompressorNode;
exports["default"] = _default;

},{"./AudioNode":42,"./AudioParam":43}],47:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _AudioNode2 = _interopRequireDefault(require("./AudioNode"));

var _AudioParam = _interopRequireDefault(require("./AudioParam"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var GainNode = function (_AudioNode) {
  _inherits(GainNode, _AudioNode);

  var _super = _createSuper(GainNode);

  function GainNode(context, options) {
    var _this;

    _classCallCheck(this, GainNode);

    _this = _super.call(this, context);
    _this._gain = options && options.gain || new _AudioParam["default"]();
    return _this;
  }

  _createClass(GainNode, [{
    key: "gain",
    get: function get() {
      return this._gain;
    }
  }]);

  return GainNode;
}(_AudioNode2["default"]);

var _default = GainNode;
exports["default"] = _default;

},{"./AudioNode":42,"./AudioParam":43}],48:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _AudioNode2 = _interopRequireDefault(require("./AudioNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var MediaElementAudioSourceNode = function (_AudioNode) {
  _inherits(MediaElementAudioSourceNode, _AudioNode);

  var _super = _createSuper(MediaElementAudioSourceNode);

  function MediaElementAudioSourceNode(context, options) {
    _classCallCheck(this, MediaElementAudioSourceNode);

    return _super.call(this, context);
  }

  return MediaElementAudioSourceNode;
}(_AudioNode2["default"]);

var _default = MediaElementAudioSourceNode;
exports["default"] = _default;

},{"./AudioNode":42}],49:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _AudioScheduledSourceNode = _interopRequireDefault(require("./AudioScheduledSourceNode"));

var _AudioParam = _interopRequireDefault(require("./AudioParam"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var types = {
  "sine": 0,
  "square": 0,
  "sawtooth": 0,
  "triangle": 0,
  "custom": 0
};

var OscillatorNode = function (_AudioScheduledSource) {
  _inherits(OscillatorNode, _AudioScheduledSource);

  var _super = _createSuper(OscillatorNode);

  function OscillatorNode(context, options) {
    var _this;

    _classCallCheck(this, OscillatorNode);

    _this = _super.call(this);
    options = options || {};
    _this.frequency = new _AudioParam["default"]({
      value: _this.isNumber(options.frequency) ? options.frequency : 440
    });
    _this.detune = new _AudioParam["default"]({
      value: _this.isNumber(options.detune) ? options.detune : 0
    });
    _this.type = options.type in types ? options.type : "sine";
    return _this;
  }

  _createClass(OscillatorNode, [{
    key: "setPeriodicWave",
    value: function setPeriodicWave(wave) {}
  }, {
    key: "start",
    value: function start(when) {}
  }, {
    key: "stop",
    value: function stop(wen) {}
  }]);

  return OscillatorNode;
}(_AudioScheduledSourceNode["default"]);

var _default = OscillatorNode;
exports["default"] = _default;

},{"./AudioParam":43,"./AudioScheduledSourceNode":44}],50:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _AudioNode2 = _interopRequireDefault(require("./AudioNode"));

var _AudioParam = _interopRequireDefault(require("./AudioParam"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var PannerNode = function (_AudioNode) {
  _inherits(PannerNode, _AudioNode);

  var _super = _createSuper(PannerNode);

  function PannerNode(context, options) {
    var _this;

    _classCallCheck(this, PannerNode);

    _this = _super.call(this, context);
    _this.coneInnerAngle = 360;
    _this.coneOuterAngle = 360;
    _this.coneOuterGain = 0;
    _this.distanceModel = "inverse";
    _this.maxDistance = 10000;
    _this.orientationX = new _AudioParam["default"]({
      value: 1
    });
    _this.orientationY = new _AudioParam["default"]({
      value: 0
    });
    _this.orientationZ = new _AudioParam["default"]({
      value: 0
    });
    _this.panningModel = "equalpower";
    _this.positionX = new _AudioParam["default"]({
      value: 0
    });
    _this.positionY = new _AudioParam["default"]({
      value: 0
    });
    _this.positionZ = new _AudioParam["default"]({
      value: 0
    });
    _this.refDistance = 1;
    _this.rolloffFactor = 1;
    return _this;
  }

  _createClass(PannerNode, [{
    key: "setPosition",
    value: function setPosition(x, y, z) {
      this.positionX = x;
      this.positionY = y;
      this.positionZ = z;
    }
  }, {
    key: "setOrientation",
    value: function setOrientation(x, y, z) {
      this.orientationX = x;
      this.orientationY = y;
      this.orientationZ = z;
    }
  }, {
    key: "setVelocity",
    value: function setVelocity() {}
  }]);

  return PannerNode;
}(_AudioNode2["default"]);

var _default = PannerNode;
exports["default"] = _default;

},{"./AudioNode":42,"./AudioParam":43}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PeriodicWave = function PeriodicWave(context, options) {
  _classCallCheck(this, PeriodicWave);
};

var _default = PeriodicWave;
exports["default"] = _default;

},{}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var md5 = require("../../lib/md5.min");

var fileMgr = ral.getFileSystemManager();
var cacheDir = ral.env.USER_DATA_PATH + "/fileCache/";

var FileCache = function () {
  function FileCache() {
    _classCallCheck(this, FileCache);

    this._caches = {};
  }

  _createClass(FileCache, [{
    key: "getCache",
    value: function getCache(data) {
      var key = FileCache._genDataKey(data);

      if (key in this._caches) {
        return this._caches[key];
      } else {
        return "";
      }
    }
  }, {
    key: "setCache",
    value: function setCache(path, data) {
      var key = FileCache._genDataKey(data);

      this._caches[key] = path;
    }
  }, {
    key: "setItem",
    value: function setItem(data, path, key, callBack) {
      key = key || FileCache._genDataKey(data);
      var caches = this._caches;

      if (key in caches) {
        callBack && callBack(caches[key]);
        return;
      }

      if (!path) {
        path = cacheDir + key;
        fileMgr.writeFile({
          filePath: path,
          data: data,
          encoding: "binary",
          success: function success() {
            caches[key] = path;
            callBack && callBack(path);
          },
          fail: function fail() {
            callBack && callBack();
            throw path + "writeFile fail!";
          }
        });
      }
    }
  }, {
    key: "getPath",
    value: function getPath(data, callBack) {
      var key = FileCache._genDataKey(data);

      var caches = this._caches;

      if (key in caches) {
        callBack(caches[key]);
      } else {
        this.setItem(data, undefined, key, callBack);
      }
    }
  }], [{
    key: "_genDataKey",
    value: function _genDataKey(data) {
      var view = new DataView(data);
      var length = view.byteLength / 4;
      var count = 10;
      var space = length / count;
      var key = "length:" + length;
      key += "first:" + view.getInt32(0);
      key += "last:" + view.getInt32(length - 1);

      while (count--) {
        key += count + ":" + view.getInt32(Math.floor(space * count));
      }

      return md5(key);
    }
  }]);

  return FileCache;
}();

try {
  fileMgr.accessSync(cacheDir);
  fileMgr.rmdirSync(cacheDir, true);
} catch (e) {}

fileMgr.mkdirSync(cacheDir, true);

var _default = new FileCache();

exports["default"] = _default;

},{"../../lib/md5.min":2}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = new WeakMap();

exports["default"] = _default;

},{}],54:[function(require,module,exports){
"use strict";

var _Audio = _interopRequireDefault(require("./Audio"));

var _AudioContext = _interopRequireDefault(require("./audioContext/AudioContext"));

var _DeviceMotionEvent = _interopRequireDefault(require("./DeviceMotionEvent"));

var _Document = _interopRequireDefault(require("./Document"));

var _Event = _interopRequireDefault(require("./Event"));

var _FontFace = _interopRequireDefault(require("./FontFace"));

var _FontFaceSet = _interopRequireDefault(require("./FontFaceSet"));

var _EventTarget = _interopRequireDefault(require("./EventTarget"));

var _HTMLElement = _interopRequireDefault(require("./HTMLElement"));

var _HTMLAudioElement = _interopRequireDefault(require("./HTMLAudioElement"));

var _HTMLCanvasElement = _interopRequireDefault(require("./HTMLCanvasElement"));

var _HTMLImageElement = _interopRequireDefault(require("./HTMLImageElement"));

var _Image = _interopRequireDefault(require("./Image"));

var _Location = _interopRequireDefault(require("./Location"));

var _Navigator = _interopRequireDefault(require("./Navigator"));

var _Screen = _interopRequireDefault(require("./Screen"));

var _TouchEvent = _interopRequireDefault(require("./TouchEvent"));

var _XMLHttpRequest = _interopRequireDefault(require("./XMLHttpRequest"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

window.ral = window.ral || {};

var _systemInfo = window.ral.getSystemInfoSync();

window.clientTop = 0;
window.clientLeft = 0;
window.devicePixelRatio = _systemInfo.pixelRatio;
window.document = new _Document["default"]();
window.frameElement = null;
window.fullScreen = true;
window.innerHeight = _systemInfo.screenHeight;
window.innerWidth = _systemInfo.screenWidth;
window.length = 0;
window.location = new _Location["default"]();
window.name = "runtime";
window.navigator = new _Navigator["default"](_systemInfo.platform, _systemInfo.language);
window.outerHeight = _systemInfo.screenHeight;
window.outerWidth = _systemInfo.screenWidth;
window.pageXOffset = 0;
window.pageYOffset = 0;
window.parent = window;
window.screen = new _Screen["default"]();
window.screenLeft = 0;
window.screenTop = 0;
window.screenX = 0;
window.screenY = 0;
window.scrollX = 0;
window.scrollY = 0;
window.self = window;
window.top = window;
window.window = window;
window.alert = window.console.error;

var _require = require('../lib/base64.min.js'),
    btoa = _require.btoa,
    atob = _require.atob;

window.atob = atob;
window.btoa = btoa;

window.close = function () {
  console.warn("window.close() is deprecated!");
};

window.print = window.console.log;
window.addEventListener = _EventTarget["default"].prototype.addEventListener;
window.removeEventListener = _EventTarget["default"].prototype.removeEventListener;
var _dispatchEvent = _EventTarget["default"].prototype.dispatchEvent;

window.dispatchEvent = function (event) {
  if (window.document.dispatchEvent(event)) {
    return _dispatchEvent.apply(this || window, arguments);
  }

  return false;
};

window.getComputedStyle = function () {
  return {
    position: 'absolute',
    left: '0px',
    top: '0px',
    height: '0px',
    paddingLeft: 0
  };
};

ral.onWindowResize && ral.onWindowResize(function (width, height) {
  window.innerWidth = width;
  window.innerHeight = height;
  window.outerWidth = window.innerWidth;
  window.outerHeight = window.innerHeight;
  window.screen.availWidth = window.innerWidth;
  window.screen.availHeight = window.innerHeight;
  window.screen.width = window.innerWidth;
  window.screen.height = window.innerHeight;
  var event = new _Event["default"]("resize");
  window.dispatchEvent(event);
});

window.stop = function () {
  console.warn("window.stop() not implemented");
};

window.Audio = _Audio["default"];
window.AudioContext = _AudioContext["default"];
window.DeviceMotionEvent = _DeviceMotionEvent["default"];
window.Event = _Event["default"];
window.FontFace = _FontFace["default"];
window.FontFaceSet = _FontFaceSet["default"];
window.HTMLElement = _HTMLElement["default"];
window.HTMLAudioElement = _HTMLAudioElement["default"];
window.HTMLCanvasElement = _HTMLCanvasElement["default"];
window.HTMLImageElement = _HTMLImageElement["default"];
window.Image = _Image["default"];
window.TouchEvent = _TouchEvent["default"];
window.XMLHttpRequest = _XMLHttpRequest["default"];

if (!window.Blob || !window.URL) {
  var _require2 = require('./Blob.js'),
      Blob = _require2.Blob,
      URL = _require2.URL;

  window.Blob = Blob;
  window.URL = URL;
}

if (!window.DOMParser) {
  window.DOMParser = require('./xmldom/dom-parser.js').DOMParser;
}

},{"../lib/base64.min.js":1,"./Audio":3,"./Blob.js":4,"./DeviceMotionEvent":6,"./Document":7,"./Event":9,"./EventTarget":10,"./FontFace":11,"./FontFaceSet":12,"./HTMLAudioElement":14,"./HTMLCanvasElement":16,"./HTMLElement":17,"./HTMLImageElement":20,"./Image":26,"./Location":27,"./Navigator":29,"./Screen":32,"./TouchEvent":33,"./XMLHttpRequest":34,"./audioContext/AudioContext":39,"./xmldom/dom-parser.js":55}],55:[function(require,module,exports){
"use strict";

function DOMParser(options) {
  this.options = options || {
    locator: {}
  };
}

DOMParser.prototype.parseFromString = function (source, mimeType) {
  var options = this.options;
  var sax = new XMLReader();
  var domBuilder = options.domBuilder || new DOMHandler();
  var errorHandler = options.errorHandler;
  var locator = options.locator;
  var defaultNSMap = options.xmlns || {};
  var isHTML = /\/x?html?$/.test(mimeType);
  var entityMap = isHTML ? htmlEntity.entityMap : {
    'lt': '<',
    'gt': '>',
    'amp': '&',
    'quot': '"',
    'apos': "'"
  };

  if (locator) {
    domBuilder.setDocumentLocator(locator);
  }

  sax.errorHandler = buildErrorHandler(errorHandler, domBuilder, locator);
  sax.domBuilder = options.domBuilder || domBuilder;

  if (isHTML) {
    defaultNSMap[''] = 'http://www.w3.org/1999/xhtml';
  }

  defaultNSMap.xml = defaultNSMap.xml || 'http://www.w3.org/XML/1998/namespace';

  if (source) {
    sax.parse(source, defaultNSMap, entityMap);
  } else {
    sax.errorHandler.error("invalid doc source");
  }

  return domBuilder.doc;
};

function buildErrorHandler(errorImpl, domBuilder, locator) {
  if (!errorImpl) {
    if (domBuilder instanceof DOMHandler) {
      return domBuilder;
    }

    errorImpl = domBuilder;
  }

  var errorHandler = {};
  var isCallback = errorImpl instanceof Function;
  locator = locator || {};

  function build(key) {
    var fn = errorImpl[key];

    if (!fn && isCallback) {
      fn = errorImpl.length == 2 ? function (msg) {
        errorImpl(key, msg);
      } : errorImpl;
    }

    errorHandler[key] = fn && function (msg) {
      fn('[xmldom ' + key + ']\t' + msg + _locator(locator));
    } || function () {};
  }

  build('warning');
  build('error');
  build('fatalError');
  return errorHandler;
}

function DOMHandler() {
  this.cdata = false;
}

function position(locator, node) {
  node.lineNumber = locator.lineNumber;
  node.columnNumber = locator.columnNumber;
}

DOMHandler.prototype = {
  startDocument: function startDocument() {
    this.doc = new DOMImplementation().createDocument(null, null, null);

    if (this.locator) {
      this.doc.documentURI = this.locator.systemId;
    }
  },
  startElement: function startElement(namespaceURI, localName, qName, attrs) {
    var doc = this.doc;
    var el = doc.createElementNS(namespaceURI, qName || localName);
    var len = attrs.length;
    appendElement(this, el);
    this.currentElement = el;
    this.locator && position(this.locator, el);

    for (var i = 0; i < len; i++) {
      var namespaceURI = attrs.getURI(i);
      var value = attrs.getValue(i);
      var qName = attrs.getQName(i);
      var attr = doc.createAttributeNS(namespaceURI, qName);
      this.locator && position(attrs.getLocator(i), attr);
      attr.value = attr.nodeValue = value;
      el.setAttributeNode(attr);
    }
  },
  endElement: function endElement(namespaceURI, localName, qName) {
    var current = this.currentElement;
    var tagName = current.tagName;
    this.currentElement = current.parentNode;
  },
  startPrefixMapping: function startPrefixMapping(prefix, uri) {},
  endPrefixMapping: function endPrefixMapping(prefix) {},
  processingInstruction: function processingInstruction(target, data) {
    var ins = this.doc.createProcessingInstruction(target, data);
    this.locator && position(this.locator, ins);
    appendElement(this, ins);
  },
  ignorableWhitespace: function ignorableWhitespace(ch, start, length) {},
  characters: function characters(chars, start, length) {
    chars = _toString.apply(this, arguments);

    if (chars) {
      if (this.cdata) {
        var charNode = this.doc.createCDATASection(chars);
      } else {
        var charNode = this.doc.createTextNode(chars);
      }

      if (this.currentElement) {
        this.currentElement.appendChild(charNode);
      } else if (/^\s*$/.test(chars)) {
        this.doc.appendChild(charNode);
      }

      this.locator && position(this.locator, charNode);
    }
  },
  skippedEntity: function skippedEntity(name) {},
  endDocument: function endDocument() {
    this.doc.normalize();
  },
  setDocumentLocator: function setDocumentLocator(locator) {
    if (this.locator = locator) {
      locator.lineNumber = 0;
    }
  },
  comment: function comment(chars, start, length) {
    chars = _toString.apply(this, arguments);
    var comm = this.doc.createComment(chars);
    this.locator && position(this.locator, comm);
    appendElement(this, comm);
  },
  startCDATA: function startCDATA() {
    this.cdata = true;
  },
  endCDATA: function endCDATA() {
    this.cdata = false;
  },
  startDTD: function startDTD(name, publicId, systemId) {
    var impl = this.doc.implementation;

    if (impl && impl.createDocumentType) {
      var dt = impl.createDocumentType(name, publicId, systemId);
      this.locator && position(this.locator, dt);
      appendElement(this, dt);
    }
  },
  warning: function warning(error) {
    console.warn('[xmldom warning]\t' + error, _locator(this.locator));
  },
  error: function error(_error) {
    console.error('[xmldom error]\t' + _error, _locator(this.locator));
  },
  fatalError: function fatalError(error) {
    console.error('[xmldom fatalError]\t' + error, _locator(this.locator));
    throw error;
  }
};

function _locator(l) {
  if (l) {
    return '\n@' + (l.systemId || '') + '#[line:' + l.lineNumber + ',col:' + l.columnNumber + ']';
  }
}

function _toString(chars, start, length) {
  if (typeof chars == 'string') {
    return chars.substr(start, length);
  } else {
    if (chars.length >= start + length || start) {
      return new java.lang.String(chars, start, length) + '';
    }

    return chars;
  }
}

"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g, function (key) {
  DOMHandler.prototype[key] = function () {
    return null;
  };
});

function appendElement(hander, node) {
  if (!hander.currentElement) {
    hander.doc.appendChild(node);
  } else {
    hander.currentElement.appendChild(node);
  }
}

var htmlEntity = require('./entities');

var XMLReader = require('./sax').XMLReader;

var DOMImplementation = exports.DOMImplementation = require('./dom').DOMImplementation;

exports.XMLSerializer = require('./dom').XMLSerializer;
exports.DOMParser = DOMParser;

},{"./dom":56,"./entities":57,"./sax":58}],56:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function copy(src, dest) {
  for (var p in src) {
    dest[p] = src[p];
  }
}

function _extends(Class, Super) {
  var pt = Class.prototype;

  if (!(pt instanceof Super)) {
    var t = function t() {};

    ;
    t.prototype = Super.prototype;
    t = new t();
    copy(pt, t);
    Class.prototype = pt = t;
  }

  if (pt.constructor != Class) {
    if (typeof Class != 'function') {
      console.error("unknow Class:" + Class);
    }

    pt.constructor = Class;
  }
}

var htmlns = 'http://www.w3.org/1999/xhtml';
var NodeType = {};
var ELEMENT_NODE = NodeType.ELEMENT_NODE = 1;
var ATTRIBUTE_NODE = NodeType.ATTRIBUTE_NODE = 2;
var TEXT_NODE = NodeType.TEXT_NODE = 3;
var CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE = 4;
var ENTITY_REFERENCE_NODE = NodeType.ENTITY_REFERENCE_NODE = 5;
var ENTITY_NODE = NodeType.ENTITY_NODE = 6;
var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE = NodeType.COMMENT_NODE = 8;
var DOCUMENT_NODE = NodeType.DOCUMENT_NODE = 9;
var DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE = 10;
var DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE = 11;
var NOTATION_NODE = NodeType.NOTATION_NODE = 12;
var ExceptionCode = {};
var ExceptionMessage = {};
var INDEX_SIZE_ERR = ExceptionCode.INDEX_SIZE_ERR = (ExceptionMessage[1] = "Index size error", 1);
var DOMSTRING_SIZE_ERR = ExceptionCode.DOMSTRING_SIZE_ERR = (ExceptionMessage[2] = "DOMString size error", 2);
var HIERARCHY_REQUEST_ERR = ExceptionCode.HIERARCHY_REQUEST_ERR = (ExceptionMessage[3] = "Hierarchy request error", 3);
var WRONG_DOCUMENT_ERR = ExceptionCode.WRONG_DOCUMENT_ERR = (ExceptionMessage[4] = "Wrong document", 4);
var INVALID_CHARACTER_ERR = ExceptionCode.INVALID_CHARACTER_ERR = (ExceptionMessage[5] = "Invalid character", 5);
var NO_DATA_ALLOWED_ERR = ExceptionCode.NO_DATA_ALLOWED_ERR = (ExceptionMessage[6] = "No data allowed", 6);
var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = (ExceptionMessage[7] = "No modification allowed", 7);
var NOT_FOUND_ERR = ExceptionCode.NOT_FOUND_ERR = (ExceptionMessage[8] = "Not found", 8);
var NOT_SUPPORTED_ERR = ExceptionCode.NOT_SUPPORTED_ERR = (ExceptionMessage[9] = "Not supported", 9);
var INUSE_ATTRIBUTE_ERR = ExceptionCode.INUSE_ATTRIBUTE_ERR = (ExceptionMessage[10] = "Attribute in use", 10);
var INVALID_STATE_ERR = ExceptionCode.INVALID_STATE_ERR = (ExceptionMessage[11] = "Invalid state", 11);
var SYNTAX_ERR = ExceptionCode.SYNTAX_ERR = (ExceptionMessage[12] = "Syntax error", 12);
var INVALID_MODIFICATION_ERR = ExceptionCode.INVALID_MODIFICATION_ERR = (ExceptionMessage[13] = "Invalid modification", 13);
var NAMESPACE_ERR = ExceptionCode.NAMESPACE_ERR = (ExceptionMessage[14] = "Invalid namespace", 14);
var INVALID_ACCESS_ERR = ExceptionCode.INVALID_ACCESS_ERR = (ExceptionMessage[15] = "Invalid access", 15);

function DOMException(code, message) {
  if (message instanceof Error) {
    var error = message;
  } else {
    error = this;
    Error.call(this, ExceptionMessage[code]);
    this.message = ExceptionMessage[code];
    if (Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
  }

  error.code = code;
  if (message) this.message = this.message + ": " + message;
  return error;
}

;
DOMException.prototype = Error.prototype;
copy(ExceptionCode, DOMException);

function NodeList() {}

;
NodeList.prototype = {
  length: 0,
  item: function item(index) {
    return this[index] || null;
  },
  toString: function toString(isHTML, nodeFilter) {
    for (var buf = [], i = 0; i < this.length; i++) {
      serializeToString(this[i], buf, isHTML, nodeFilter);
    }

    return buf.join('');
  }
};

function LiveNodeList(node, refresh) {
  this._node = node;
  this._refresh = refresh;

  _updateLiveList(this);
}

function _updateLiveList(list) {
  var inc = list._node._inc || list._node.ownerDocument._inc;

  if (list._inc != inc) {
    var ls = list._refresh(list._node);

    __set__(list, 'length', ls.length);

    copy(ls, list);
    list._inc = inc;
  }
}

LiveNodeList.prototype.item = function (i) {
  _updateLiveList(this);

  return this[i];
};

_extends(LiveNodeList, NodeList);

function NamedNodeMap() {}

;

function _findNodeIndex(list, node) {
  var i = list.length;

  while (i--) {
    if (list[i] === node) {
      return i;
    }
  }
}

function _addNamedNode(el, list, newAttr, oldAttr) {
  if (oldAttr) {
    list[_findNodeIndex(list, oldAttr)] = newAttr;
  } else {
    list[list.length++] = newAttr;
  }

  if (el) {
    newAttr.ownerElement = el;
    var doc = el.ownerDocument;

    if (doc) {
      oldAttr && _onRemoveAttribute(doc, el, oldAttr);

      _onAddAttribute(doc, el, newAttr);
    }
  }
}

function _removeNamedNode(el, list, attr) {
  var i = _findNodeIndex(list, attr);

  if (i >= 0) {
    var lastIndex = list.length - 1;

    while (i < lastIndex) {
      list[i] = list[++i];
    }

    list.length = lastIndex;

    if (el) {
      var doc = el.ownerDocument;

      if (doc) {
        _onRemoveAttribute(doc, el, attr);

        attr.ownerElement = null;
      }
    }
  } else {
    throw DOMException(NOT_FOUND_ERR, new Error(el.tagName + '@' + attr));
  }
}

NamedNodeMap.prototype = {
  length: 0,
  item: NodeList.prototype.item,
  getNamedItem: function getNamedItem(key) {
    var i = this.length;

    while (i--) {
      var attr = this[i];

      if (attr.nodeName == key) {
        return attr;
      }
    }
  },
  setNamedItem: function setNamedItem(attr) {
    var el = attr.ownerElement;

    if (el && el != this._ownerElement) {
      throw new DOMException(INUSE_ATTRIBUTE_ERR);
    }

    var oldAttr = this.getNamedItem(attr.nodeName);

    _addNamedNode(this._ownerElement, this, attr, oldAttr);

    return oldAttr;
  },
  setNamedItemNS: function setNamedItemNS(attr) {
    var el = attr.ownerElement,
        oldAttr;

    if (el && el != this._ownerElement) {
      throw new DOMException(INUSE_ATTRIBUTE_ERR);
    }

    oldAttr = this.getNamedItemNS(attr.namespaceURI, attr.localName);

    _addNamedNode(this._ownerElement, this, attr, oldAttr);

    return oldAttr;
  },
  removeNamedItem: function removeNamedItem(key) {
    var attr = this.getNamedItem(key);

    _removeNamedNode(this._ownerElement, this, attr);

    return attr;
  },
  removeNamedItemNS: function removeNamedItemNS(namespaceURI, localName) {
    var attr = this.getNamedItemNS(namespaceURI, localName);

    _removeNamedNode(this._ownerElement, this, attr);

    return attr;
  },
  getNamedItemNS: function getNamedItemNS(namespaceURI, localName) {
    var i = this.length;

    while (i--) {
      var node = this[i];

      if (node.localName == localName && node.namespaceURI == namespaceURI) {
        return node;
      }
    }

    return null;
  }
};

function DOMImplementation(features) {
  this._features = {};

  if (features) {
    for (var feature in features) {
      this._features = features[feature];
    }
  }
}

;
DOMImplementation.prototype = {
  hasFeature: function hasFeature(feature, version) {
    var versions = this._features[feature.toLowerCase()];

    if (versions && (!version || version in versions)) {
      return true;
    } else {
      return false;
    }
  },
  createDocument: function createDocument(namespaceURI, qualifiedName, doctype) {
    var doc = new Document();
    doc.implementation = this;
    doc.childNodes = new NodeList();
    doc.doctype = doctype;

    if (doctype) {
      doc.appendChild(doctype);
    }

    if (qualifiedName) {
      var root = doc.createElementNS(namespaceURI, qualifiedName);
      doc.appendChild(root);
    }

    return doc;
  },
  createDocumentType: function createDocumentType(qualifiedName, publicId, systemId) {
    var node = new DocumentType();
    node.name = qualifiedName;
    node.nodeName = qualifiedName;
    node.publicId = publicId;
    node.systemId = systemId;
    return node;
  }
};

function Node() {}

;
Node.prototype = {
  firstChild: null,
  lastChild: null,
  previousSibling: null,
  nextSibling: null,
  attributes: null,
  parentNode: null,
  childNodes: null,
  ownerDocument: null,
  nodeValue: null,
  namespaceURI: null,
  prefix: null,
  localName: null,
  insertBefore: function insertBefore(newChild, refChild) {
    return _insertBefore(this, newChild, refChild);
  },
  replaceChild: function replaceChild(newChild, oldChild) {
    this.insertBefore(newChild, oldChild);

    if (oldChild) {
      this.removeChild(oldChild);
    }
  },
  removeChild: function removeChild(oldChild) {
    return _removeChild(this, oldChild);
  },
  appendChild: function appendChild(newChild) {
    return this.insertBefore(newChild, null);
  },
  hasChildNodes: function hasChildNodes() {
    return this.firstChild != null;
  },
  cloneNode: function cloneNode(deep) {
    return _cloneNode(this.ownerDocument || this, this, deep);
  },
  normalize: function normalize() {
    var child = this.firstChild;

    while (child) {
      var next = child.nextSibling;

      if (next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE) {
        this.removeChild(next);
        child.appendData(next.data);
      } else {
        child.normalize();
        child = next;
      }
    }
  },
  isSupported: function isSupported(feature, version) {
    return this.ownerDocument.implementation.hasFeature(feature, version);
  },
  hasAttributes: function hasAttributes() {
    return this.attributes.length > 0;
  },
  lookupPrefix: function lookupPrefix(namespaceURI) {
    var el = this;

    while (el) {
      var map = el._nsMap;

      if (map) {
        for (var n in map) {
          if (map[n] == namespaceURI) {
            return n;
          }
        }
      }

      el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
    }

    return null;
  },
  lookupNamespaceURI: function lookupNamespaceURI(prefix) {
    var el = this;

    while (el) {
      var map = el._nsMap;

      if (map) {
        if (prefix in map) {
          return map[prefix];
        }
      }

      el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
    }

    return null;
  },
  isDefaultNamespace: function isDefaultNamespace(namespaceURI) {
    var prefix = this.lookupPrefix(namespaceURI);
    return prefix == null;
  }
};

function _xmlEncoder(c) {
  return c == '<' && '&lt;' || c == '>' && '&gt;' || c == '&' && '&amp;' || c == '"' && '&quot;' || '&#' + c.charCodeAt() + ';';
}

copy(NodeType, Node);
copy(NodeType, Node.prototype);

function _visitNode(node, callback) {
  if (callback(node)) {
    return true;
  }

  if (node = node.firstChild) {
    do {
      if (_visitNode(node, callback)) {
        return true;
      }
    } while (node = node.nextSibling);
  }
}

function Document() {}

function _onAddAttribute(doc, el, newAttr) {
  doc && doc._inc++;
  var ns = newAttr.namespaceURI;

  if (ns == 'http://www.w3.org/2000/xmlns/') {
    el._nsMap[newAttr.prefix ? newAttr.localName : ''] = newAttr.value;
  }
}

function _onRemoveAttribute(doc, el, newAttr, remove) {
  doc && doc._inc++;
  var ns = newAttr.namespaceURI;

  if (ns == 'http://www.w3.org/2000/xmlns/') {
    delete el._nsMap[newAttr.prefix ? newAttr.localName : ''];
  }
}

function _onUpdateChild(doc, el, newChild) {
  if (doc && doc._inc) {
    doc._inc++;
    var cs = el.childNodes;

    if (newChild) {
      cs[cs.length++] = newChild;
    } else {
      var child = el.firstChild;
      var i = 0;

      while (child) {
        cs[i++] = child;
        child = child.nextSibling;
      }

      cs.length = i;
    }
  }
}

function _removeChild(parentNode, child) {
  var previous = child.previousSibling;
  var next = child.nextSibling;

  if (previous) {
    previous.nextSibling = next;
  } else {
    parentNode.firstChild = next;
  }

  if (next) {
    next.previousSibling = previous;
  } else {
    parentNode.lastChild = previous;
  }

  _onUpdateChild(parentNode.ownerDocument, parentNode);

  return child;
}

function _insertBefore(parentNode, newChild, nextChild) {
  var cp = newChild.parentNode;

  if (cp) {
    cp.removeChild(newChild);
  }

  if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
    var newFirst = newChild.firstChild;

    if (newFirst == null) {
      return newChild;
    }

    var newLast = newChild.lastChild;
  } else {
    newFirst = newLast = newChild;
  }

  var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;
  newFirst.previousSibling = pre;
  newLast.nextSibling = nextChild;

  if (pre) {
    pre.nextSibling = newFirst;
  } else {
    parentNode.firstChild = newFirst;
  }

  if (nextChild == null) {
    parentNode.lastChild = newLast;
  } else {
    nextChild.previousSibling = newLast;
  }

  do {
    newFirst.parentNode = parentNode;
  } while (newFirst !== newLast && (newFirst = newFirst.nextSibling));

  _onUpdateChild(parentNode.ownerDocument || parentNode, parentNode);

  if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
    newChild.firstChild = newChild.lastChild = null;
  }

  return newChild;
}

function _appendSingleChild(parentNode, newChild) {
  var cp = newChild.parentNode;

  if (cp) {
    var pre = parentNode.lastChild;
    cp.removeChild(newChild);
    var pre = parentNode.lastChild;
  }

  var pre = parentNode.lastChild;
  newChild.parentNode = parentNode;
  newChild.previousSibling = pre;
  newChild.nextSibling = null;

  if (pre) {
    pre.nextSibling = newChild;
  } else {
    parentNode.firstChild = newChild;
  }

  parentNode.lastChild = newChild;

  _onUpdateChild(parentNode.ownerDocument, parentNode, newChild);

  return newChild;
}

Document.prototype = {
  nodeName: '#document',
  nodeType: DOCUMENT_NODE,
  doctype: null,
  documentElement: null,
  _inc: 1,
  insertBefore: function insertBefore(newChild, refChild) {
    if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
      var child = newChild.firstChild;

      while (child) {
        var next = child.nextSibling;
        this.insertBefore(child, refChild);
        child = next;
      }

      return newChild;
    }

    if (this.documentElement == null && newChild.nodeType == ELEMENT_NODE) {
      this.documentElement = newChild;
    }

    return _insertBefore(this, newChild, refChild), newChild.ownerDocument = this, newChild;
  },
  removeChild: function removeChild(oldChild) {
    if (this.documentElement == oldChild) {
      this.documentElement = null;
    }

    return _removeChild(this, oldChild);
  },
  importNode: function importNode(importedNode, deep) {
    return _importNode(this, importedNode, deep);
  },
  getElementById: function getElementById(id) {
    var rtv = null;

    _visitNode(this.documentElement, function (node) {
      if (node.nodeType == ELEMENT_NODE) {
        if (node.getAttribute('id') == id) {
          rtv = node;
          return true;
        }
      }
    });

    return rtv;
  },
  createElement: function createElement(tagName) {
    var node = new Element();
    node.ownerDocument = this;
    node.nodeName = tagName;
    node.tagName = tagName;
    node.childNodes = new NodeList();
    var attrs = node.attributes = new NamedNodeMap();
    attrs._ownerElement = node;
    return node;
  },
  createDocumentFragment: function createDocumentFragment() {
    var node = new DocumentFragment();
    node.ownerDocument = this;
    node.childNodes = new NodeList();
    return node;
  },
  createTextNode: function createTextNode(data) {
    var node = new Text();
    node.ownerDocument = this;
    node.appendData(data);
    return node;
  },
  createComment: function createComment(data) {
    var node = new Comment();
    node.ownerDocument = this;
    node.appendData(data);
    return node;
  },
  createCDATASection: function createCDATASection(data) {
    var node = new CDATASection();
    node.ownerDocument = this;
    node.appendData(data);
    return node;
  },
  createProcessingInstruction: function createProcessingInstruction(target, data) {
    var node = new ProcessingInstruction();
    node.ownerDocument = this;
    node.tagName = node.target = target;
    node.nodeValue = node.data = data;
    return node;
  },
  createAttribute: function createAttribute(name) {
    var node = new Attr();
    node.ownerDocument = this;
    node.name = name;
    node.nodeName = name;
    node.localName = name;
    node.specified = true;
    return node;
  },
  createEntityReference: function createEntityReference(name) {
    var node = new EntityReference();
    node.ownerDocument = this;
    node.nodeName = name;
    return node;
  },
  createElementNS: function createElementNS(namespaceURI, qualifiedName) {
    var node = new Element();
    var pl = qualifiedName.split(':');
    var attrs = node.attributes = new NamedNodeMap();
    node.childNodes = new NodeList();
    node.ownerDocument = this;
    node.nodeName = qualifiedName;
    node.tagName = qualifiedName;
    node.namespaceURI = namespaceURI;

    if (pl.length == 2) {
      node.prefix = pl[0];
      node.localName = pl[1];
    } else {
      node.localName = qualifiedName;
    }

    attrs._ownerElement = node;
    return node;
  },
  createAttributeNS: function createAttributeNS(namespaceURI, qualifiedName) {
    var node = new Attr();
    var pl = qualifiedName.split(':');
    node.ownerDocument = this;
    node.nodeName = qualifiedName;
    node.name = qualifiedName;
    node.namespaceURI = namespaceURI;
    node.specified = true;

    if (pl.length == 2) {
      node.prefix = pl[0];
      node.localName = pl[1];
    } else {
      node.localName = qualifiedName;
    }

    return node;
  }
};

_extends(Document, Node);

function Element() {
  this._nsMap = {};
}

;
Element.prototype = {
  nodeType: ELEMENT_NODE,
  hasAttribute: function hasAttribute(name) {
    return this.getAttributeNode(name) != null;
  },
  getAttribute: function getAttribute(name) {
    var attr = this.getAttributeNode(name);
    return attr && attr.value || '';
  },
  getAttributeNode: function getAttributeNode(name) {
    return this.attributes.getNamedItem(name);
  },
  setAttribute: function setAttribute(name, value) {
    var attr = this.ownerDocument.createAttribute(name);
    attr.value = attr.nodeValue = "" + value;
    this.setAttributeNode(attr);
  },
  removeAttribute: function removeAttribute(name) {
    var attr = this.getAttributeNode(name);
    attr && this.removeAttributeNode(attr);
  },
  appendChild: function appendChild(newChild) {
    if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return this.insertBefore(newChild, null);
    } else {
      return _appendSingleChild(this, newChild);
    }
  },
  setAttributeNode: function setAttributeNode(newAttr) {
    return this.attributes.setNamedItem(newAttr);
  },
  setAttributeNodeNS: function setAttributeNodeNS(newAttr) {
    return this.attributes.setNamedItemNS(newAttr);
  },
  removeAttributeNode: function removeAttributeNode(oldAttr) {
    return this.attributes.removeNamedItem(oldAttr.nodeName);
  },
  removeAttributeNS: function removeAttributeNS(namespaceURI, localName) {
    var old = this.getAttributeNodeNS(namespaceURI, localName);
    old && this.removeAttributeNode(old);
  },
  hasAttributeNS: function hasAttributeNS(namespaceURI, localName) {
    return this.getAttributeNodeNS(namespaceURI, localName) != null;
  },
  getAttributeNS: function getAttributeNS(namespaceURI, localName) {
    var attr = this.getAttributeNodeNS(namespaceURI, localName);
    return attr && attr.value || '';
  },
  setAttributeNS: function setAttributeNS(namespaceURI, qualifiedName, value) {
    var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
    attr.value = attr.nodeValue = "" + value;
    this.setAttributeNode(attr);
  },
  getAttributeNodeNS: function getAttributeNodeNS(namespaceURI, localName) {
    return this.attributes.getNamedItemNS(namespaceURI, localName);
  },
  getElementsByTagName: function getElementsByTagName(tagName) {
    return new LiveNodeList(this, function (base) {
      var ls = [];

      _visitNode(base, function (node) {
        if (node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)) {
          ls.push(node);
        }
      });

      return ls;
    });
  },
  getElementsByTagNameNS: function getElementsByTagNameNS(namespaceURI, localName) {
    return new LiveNodeList(this, function (base) {
      var ls = [];

      _visitNode(base, function (node) {
        if (node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)) {
          ls.push(node);
        }
      });

      return ls;
    });
  }
};
Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;

_extends(Element, Node);

function Attr() {}

;
Attr.prototype.nodeType = ATTRIBUTE_NODE;

_extends(Attr, Node);

function CharacterData() {}

;
CharacterData.prototype = {
  data: '',
  substringData: function substringData(offset, count) {
    return this.data.substring(offset, offset + count);
  },
  appendData: function appendData(text) {
    text = this.data + text;
    this.nodeValue = this.data = text;
    this.length = text.length;
  },
  insertData: function insertData(offset, text) {
    this.replaceData(offset, 0, text);
  },
  appendChild: function appendChild(newChild) {
    throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR]);
  },
  deleteData: function deleteData(offset, count) {
    this.replaceData(offset, count, "");
  },
  replaceData: function replaceData(offset, count, text) {
    var start = this.data.substring(0, offset);
    var end = this.data.substring(offset + count);
    text = start + text + end;
    this.nodeValue = this.data = text;
    this.length = text.length;
  }
};

_extends(CharacterData, Node);

function Text() {}

;
Text.prototype = {
  nodeName: "#text",
  nodeType: TEXT_NODE,
  splitText: function splitText(offset) {
    var text = this.data;
    var newText = text.substring(offset);
    text = text.substring(0, offset);
    this.data = this.nodeValue = text;
    this.length = text.length;
    var newNode = this.ownerDocument.createTextNode(newText);

    if (this.parentNode) {
      this.parentNode.insertBefore(newNode, this.nextSibling);
    }

    return newNode;
  }
};

_extends(Text, CharacterData);

function Comment() {}

;
Comment.prototype = {
  nodeName: "#comment",
  nodeType: COMMENT_NODE
};

_extends(Comment, CharacterData);

function CDATASection() {}

;
CDATASection.prototype = {
  nodeName: "#cdata-section",
  nodeType: CDATA_SECTION_NODE
};

_extends(CDATASection, CharacterData);

function DocumentType() {}

;
DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;

_extends(DocumentType, Node);

function Notation() {}

;
Notation.prototype.nodeType = NOTATION_NODE;

_extends(Notation, Node);

function Entity() {}

;
Entity.prototype.nodeType = ENTITY_NODE;

_extends(Entity, Node);

function EntityReference() {}

;
EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;

_extends(EntityReference, Node);

function DocumentFragment() {}

;
DocumentFragment.prototype.nodeName = "#document-fragment";
DocumentFragment.prototype.nodeType = DOCUMENT_FRAGMENT_NODE;

_extends(DocumentFragment, Node);

function ProcessingInstruction() {}

ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;

_extends(ProcessingInstruction, Node);

function XMLSerializer() {}

XMLSerializer.prototype.serializeToString = function (node, isHtml, nodeFilter) {
  return nodeSerializeToString.call(node, isHtml, nodeFilter);
};

Node.prototype.toString = nodeSerializeToString;

function nodeSerializeToString(isHtml, nodeFilter) {
  var buf = [];
  var refNode = this.nodeType == 9 && this.documentElement || this;
  var prefix = refNode.prefix;
  var uri = refNode.namespaceURI;

  if (uri && prefix == null) {
    var prefix = refNode.lookupPrefix(uri);

    if (prefix == null) {
      var visibleNamespaces = [{
        namespace: uri,
        prefix: null
      }];
    }
  }

  serializeToString(this, buf, isHtml, nodeFilter, visibleNamespaces);
  return buf.join('');
}

function needNamespaceDefine(node, isHTML, visibleNamespaces) {
  var prefix = node.prefix || '';
  var uri = node.namespaceURI;

  if (!prefix && !uri) {
    return false;
  }

  if (prefix === "xml" && uri === "http://www.w3.org/XML/1998/namespace" || uri == 'http://www.w3.org/2000/xmlns/') {
    return false;
  }

  var i = visibleNamespaces.length;

  while (i--) {
    var ns = visibleNamespaces[i];

    if (ns.prefix == prefix) {
      return ns.namespace != uri;
    }
  }

  return true;
}

function serializeToString(node, buf, isHTML, nodeFilter, visibleNamespaces) {
  if (nodeFilter) {
    node = nodeFilter(node);

    if (node) {
      if (typeof node == 'string') {
        buf.push(node);
        return;
      }
    } else {
      return;
    }
  }

  switch (node.nodeType) {
    case ELEMENT_NODE:
      if (!visibleNamespaces) visibleNamespaces = [];
      var startVisibleNamespaces = visibleNamespaces.length;
      var attrs = node.attributes;
      var len = attrs.length;
      var child = node.firstChild;
      var nodeName = node.tagName;
      isHTML = htmlns === node.namespaceURI || isHTML;
      buf.push('<', nodeName);

      for (var i = 0; i < len; i++) {
        var attr = attrs.item(i);

        if (attr.prefix == 'xmlns') {
          visibleNamespaces.push({
            prefix: attr.localName,
            namespace: attr.value
          });
        } else if (attr.nodeName == 'xmlns') {
          visibleNamespaces.push({
            prefix: '',
            namespace: attr.value
          });
        }
      }

      for (var i = 0; i < len; i++) {
        var attr = attrs.item(i);

        if (needNamespaceDefine(attr, isHTML, visibleNamespaces)) {
          var prefix = attr.prefix || '';
          var uri = attr.namespaceURI;
          var ns = prefix ? ' xmlns:' + prefix : " xmlns";
          buf.push(ns, '="', uri, '"');
          visibleNamespaces.push({
            prefix: prefix,
            namespace: uri
          });
        }

        serializeToString(attr, buf, isHTML, nodeFilter, visibleNamespaces);
      }

      if (needNamespaceDefine(node, isHTML, visibleNamespaces)) {
        var prefix = node.prefix || '';
        var uri = node.namespaceURI;
        var ns = prefix ? ' xmlns:' + prefix : " xmlns";
        buf.push(ns, '="', uri, '"');
        visibleNamespaces.push({
          prefix: prefix,
          namespace: uri
        });
      }

      if (child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)) {
        buf.push('>');

        if (isHTML && /^script$/i.test(nodeName)) {
          while (child) {
            if (child.data) {
              buf.push(child.data);
            } else {
              serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces);
            }

            child = child.nextSibling;
          }
        } else {
          while (child) {
            serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces);
            child = child.nextSibling;
          }
        }

        buf.push('</', nodeName, '>');
      } else {
        buf.push('/>');
      }

      return;

    case DOCUMENT_NODE:
    case DOCUMENT_FRAGMENT_NODE:
      var child = node.firstChild;

      while (child) {
        serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces);
        child = child.nextSibling;
      }

      return;

    case ATTRIBUTE_NODE:
      return buf.push(' ', node.name, '="', node.value.replace(/[<&"]/g, _xmlEncoder), '"');

    case TEXT_NODE:
      return buf.push(node.data.replace(/[<&]/g, _xmlEncoder));

    case CDATA_SECTION_NODE:
      return buf.push('<![CDATA[', node.data, ']]>');

    case COMMENT_NODE:
      return buf.push("<!--", node.data, "-->");

    case DOCUMENT_TYPE_NODE:
      var pubid = node.publicId;
      var sysid = node.systemId;
      buf.push('<!DOCTYPE ', node.name);

      if (pubid) {
        buf.push(' PUBLIC "', pubid);

        if (sysid && sysid != '.') {
          buf.push('" "', sysid);
        }

        buf.push('">');
      } else if (sysid && sysid != '.') {
        buf.push(' SYSTEM "', sysid, '">');
      } else {
        var sub = node.internalSubset;

        if (sub) {
          buf.push(" [", sub, "]");
        }

        buf.push(">");
      }

      return;

    case PROCESSING_INSTRUCTION_NODE:
      return buf.push("<?", node.target, " ", node.data, "?>");

    case ENTITY_REFERENCE_NODE:
      return buf.push('&', node.nodeName, ';');

    default:
      buf.push('??', node.nodeName);
  }
}

function _importNode(doc, node, deep) {
  var node2;

  switch (node.nodeType) {
    case ELEMENT_NODE:
      node2 = node.cloneNode(false);
      node2.ownerDocument = doc;

    case DOCUMENT_FRAGMENT_NODE:
      break;

    case ATTRIBUTE_NODE:
      deep = true;
      break;
  }

  if (!node2) {
    node2 = node.cloneNode(false);
  }

  node2.ownerDocument = doc;
  node2.parentNode = null;

  if (deep) {
    var child = node.firstChild;

    while (child) {
      node2.appendChild(_importNode(doc, child, deep));
      child = child.nextSibling;
    }
  }

  return node2;
}

function _cloneNode(doc, node, deep) {
  var node2 = new node.constructor();

  for (var n in node) {
    var v = node[n];

    if (_typeof(v) != 'object') {
      if (v != node2[n]) {
        node2[n] = v;
      }
    }
  }

  if (node.childNodes) {
    node2.childNodes = new NodeList();
  }

  node2.ownerDocument = doc;

  switch (node2.nodeType) {
    case ELEMENT_NODE:
      var attrs = node.attributes;
      var attrs2 = node2.attributes = new NamedNodeMap();
      var len = attrs.length;
      attrs2._ownerElement = node2;

      for (var i = 0; i < len; i++) {
        node2.setAttributeNode(_cloneNode(doc, attrs.item(i), true));
      }

      break;
      ;

    case ATTRIBUTE_NODE:
      deep = true;
  }

  if (deep) {
    var child = node.firstChild;

    while (child) {
      node2.appendChild(_cloneNode(doc, child, deep));
      child = child.nextSibling;
    }
  }

  return node2;
}

function __set__(object, key, value) {
  object[key] = value;
}

try {
  if (Object.defineProperty) {
    var getTextContent = function getTextContent(node) {
      switch (node.nodeType) {
        case ELEMENT_NODE:
        case DOCUMENT_FRAGMENT_NODE:
          var buf = [];
          node = node.firstChild;

          while (node) {
            if (node.nodeType !== 7 && node.nodeType !== 8) {
              buf.push(getTextContent(node));
            }

            node = node.nextSibling;
          }

          return buf.join('');

        default:
          return node.nodeValue;
      }
    };

    Object.defineProperty(LiveNodeList.prototype, 'length', {
      get: function get() {
        _updateLiveList(this);

        return this.$$length;
      }
    });
    Object.defineProperty(Node.prototype, 'textContent', {
      get: function get() {
        return getTextContent(this);
      },
      set: function set(data) {
        switch (this.nodeType) {
          case ELEMENT_NODE:
          case DOCUMENT_FRAGMENT_NODE:
            while (this.firstChild) {
              this.removeChild(this.firstChild);
            }

            if (data || String(data)) {
              this.appendChild(this.ownerDocument.createTextNode(data));
            }

            break;

          default:
            this.data = data;
            this.value = data;
            this.nodeValue = data;
        }
      }
    });

    __set__ = function __set__(object, key, value) {
      object['$$' + key] = value;
    };
  }
} catch (e) {}

exports.DOMImplementation = DOMImplementation;
exports.XMLSerializer = XMLSerializer;

},{}],57:[function(require,module,exports){
"use strict";

exports.entityMap = {
  lt: '<',
  gt: '>',
  amp: '&',
  quot: '"',
  apos: "'",
  Agrave: "À",
  Aacute: "Á",
  Acirc: "Â",
  Atilde: "Ã",
  Auml: "Ä",
  Aring: "Å",
  AElig: "Æ",
  Ccedil: "Ç",
  Egrave: "È",
  Eacute: "É",
  Ecirc: "Ê",
  Euml: "Ë",
  Igrave: "Ì",
  Iacute: "Í",
  Icirc: "Î",
  Iuml: "Ï",
  ETH: "Ð",
  Ntilde: "Ñ",
  Ograve: "Ò",
  Oacute: "Ó",
  Ocirc: "Ô",
  Otilde: "Õ",
  Ouml: "Ö",
  Oslash: "Ø",
  Ugrave: "Ù",
  Uacute: "Ú",
  Ucirc: "Û",
  Uuml: "Ü",
  Yacute: "Ý",
  THORN: "Þ",
  szlig: "ß",
  agrave: "à",
  aacute: "á",
  acirc: "â",
  atilde: "ã",
  auml: "ä",
  aring: "å",
  aelig: "æ",
  ccedil: "ç",
  egrave: "è",
  eacute: "é",
  ecirc: "ê",
  euml: "ë",
  igrave: "ì",
  iacute: "í",
  icirc: "î",
  iuml: "ï",
  eth: "ð",
  ntilde: "ñ",
  ograve: "ò",
  oacute: "ó",
  ocirc: "ô",
  otilde: "õ",
  ouml: "ö",
  oslash: "ø",
  ugrave: "ù",
  uacute: "ú",
  ucirc: "û",
  uuml: "ü",
  yacute: "ý",
  thorn: "þ",
  yuml: "ÿ",
  nbsp: " ",
  iexcl: "¡",
  cent: "¢",
  pound: "£",
  curren: "¤",
  yen: "¥",
  brvbar: "¦",
  sect: "§",
  uml: "¨",
  copy: "©",
  ordf: "ª",
  laquo: "«",
  not: "¬",
  shy: "­­",
  reg: "®",
  macr: "¯",
  deg: "°",
  plusmn: "±",
  sup2: "²",
  sup3: "³",
  acute: "´",
  micro: "µ",
  para: "¶",
  middot: "·",
  cedil: "¸",
  sup1: "¹",
  ordm: "º",
  raquo: "»",
  frac14: "¼",
  frac12: "½",
  frac34: "¾",
  iquest: "¿",
  times: "×",
  divide: "÷",
  forall: "∀",
  part: "∂",
  exist: "∃",
  empty: "∅",
  nabla: "∇",
  isin: "∈",
  notin: "∉",
  ni: "∋",
  prod: "∏",
  sum: "∑",
  minus: "−",
  lowast: "∗",
  radic: "√",
  prop: "∝",
  infin: "∞",
  ang: "∠",
  and: "∧",
  or: "∨",
  cap: "∩",
  cup: "∪",
  'int': "∫",
  there4: "∴",
  sim: "∼",
  cong: "≅",
  asymp: "≈",
  ne: "≠",
  equiv: "≡",
  le: "≤",
  ge: "≥",
  sub: "⊂",
  sup: "⊃",
  nsub: "⊄",
  sube: "⊆",
  supe: "⊇",
  oplus: "⊕",
  otimes: "⊗",
  perp: "⊥",
  sdot: "⋅",
  Alpha: "Α",
  Beta: "Β",
  Gamma: "Γ",
  Delta: "Δ",
  Epsilon: "Ε",
  Zeta: "Ζ",
  Eta: "Η",
  Theta: "Θ",
  Iota: "Ι",
  Kappa: "Κ",
  Lambda: "Λ",
  Mu: "Μ",
  Nu: "Ν",
  Xi: "Ξ",
  Omicron: "Ο",
  Pi: "Π",
  Rho: "Ρ",
  Sigma: "Σ",
  Tau: "Τ",
  Upsilon: "Υ",
  Phi: "Φ",
  Chi: "Χ",
  Psi: "Ψ",
  Omega: "Ω",
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  epsilon: "ε",
  zeta: "ζ",
  eta: "η",
  theta: "θ",
  iota: "ι",
  kappa: "κ",
  lambda: "λ",
  mu: "μ",
  nu: "ν",
  xi: "ξ",
  omicron: "ο",
  pi: "π",
  rho: "ρ",
  sigmaf: "ς",
  sigma: "σ",
  tau: "τ",
  upsilon: "υ",
  phi: "φ",
  chi: "χ",
  psi: "ψ",
  omega: "ω",
  thetasym: "ϑ",
  upsih: "ϒ",
  piv: "ϖ",
  OElig: "Œ",
  oelig: "œ",
  Scaron: "Š",
  scaron: "š",
  Yuml: "Ÿ",
  fnof: "ƒ",
  circ: "ˆ",
  tilde: "˜",
  ensp: " ",
  emsp: " ",
  thinsp: " ",
  zwnj: "‌",
  zwj: "‍",
  lrm: "‎",
  rlm: "‏",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  sbquo: "‚",
  ldquo: "“",
  rdquo: "”",
  bdquo: "„",
  dagger: "†",
  Dagger: "‡",
  bull: "•",
  hellip: "…",
  permil: "‰",
  prime: "′",
  Prime: "″",
  lsaquo: "‹",
  rsaquo: "›",
  oline: "‾",
  euro: "€",
  trade: "™",
  larr: "←",
  uarr: "↑",
  rarr: "→",
  darr: "↓",
  harr: "↔",
  crarr: "↵",
  lceil: "⌈",
  rceil: "⌉",
  lfloor: "⌊",
  rfloor: "⌋",
  loz: "◊",
  spades: "♠",
  clubs: "♣",
  hearts: "♥",
  diams: "♦"
};

},{}],58:[function(require,module,exports){
"use strict";

var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
var nameChar = new RegExp("[\\-\\.0-9" + nameStartChar.source.slice(1, -1) + "\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
var tagNamePattern = new RegExp('^' + nameStartChar.source + nameChar.source + '*(?:\:' + nameStartChar.source + nameChar.source + '*)?$');
var S_TAG = 0;
var S_ATTR = 1;
var S_ATTR_SPACE = 2;
var S_EQ = 3;
var S_ATTR_NOQUOT_VALUE = 4;
var S_ATTR_END = 5;
var S_TAG_SPACE = 6;
var S_TAG_CLOSE = 7;

function XMLReader() {}

XMLReader.prototype = {
  parse: function parse(source, defaultNSMap, entityMap) {
    var domBuilder = this.domBuilder;
    domBuilder.startDocument();

    _copy(defaultNSMap, defaultNSMap = {});

    _parse(source, defaultNSMap, entityMap, domBuilder, this.errorHandler);

    domBuilder.endDocument();
  }
};

function _parse(source, defaultNSMapCopy, entityMap, domBuilder, errorHandler) {
  function fixedFromCharCode(code) {
    if (code > 0xffff) {
      code -= 0x10000;
      var surrogate1 = 0xd800 + (code >> 10),
          surrogate2 = 0xdc00 + (code & 0x3ff);
      return String.fromCharCode(surrogate1, surrogate2);
    } else {
      return String.fromCharCode(code);
    }
  }

  function entityReplacer(a) {
    var k = a.slice(1, -1);

    if (k in entityMap) {
      return entityMap[k];
    } else if (k.charAt(0) === '#') {
      return fixedFromCharCode(parseInt(k.substr(1).replace('x', '0x')));
    } else {
      errorHandler.error('entity not found:' + a);
      return a;
    }
  }

  function appendText(end) {
    if (end > start) {
      var xt = source.substring(start, end).replace(/&#?\w+;/g, entityReplacer);
      locator && position(start);
      domBuilder.characters(xt, 0, end - start);
      start = end;
    }
  }

  function position(p, m) {
    while (p >= lineEnd && (m = linePattern.exec(source))) {
      lineStart = m.index;
      lineEnd = lineStart + m[0].length;
      locator.lineNumber++;
    }

    locator.columnNumber = p - lineStart + 1;
  }

  var lineStart = 0;
  var lineEnd = 0;
  var linePattern = /.*(?:\r\n?|\n)|.*$/g;
  var locator = domBuilder.locator;
  var parseStack = [{
    currentNSMap: defaultNSMapCopy
  }];
  var closeMap = {};
  var start = 0;

  while (true) {
    try {
      var tagStart = source.indexOf('<', start);

      if (tagStart < 0) {
        if (!source.substr(start).match(/^\s*$/)) {
          var doc = domBuilder.doc;
          var text = doc.createTextNode(source.substr(start));
          doc.appendChild(text);
          domBuilder.currentElement = text;
        }

        return;
      }

      if (tagStart > start) {
        appendText(tagStart);
      }

      switch (source.charAt(tagStart + 1)) {
        case '/':
          var end = source.indexOf('>', tagStart + 3);
          var tagName = source.substring(tagStart + 2, end);
          var config = parseStack.pop();

          if (end < 0) {
            tagName = source.substring(tagStart + 2).replace(/[\s<].*/, '');
            errorHandler.error("end tag name: " + tagName + ' is not complete:' + config.tagName);
            end = tagStart + 1 + tagName.length;
          } else if (tagName.match(/\s</)) {
            tagName = tagName.replace(/[\s<].*/, '');
            errorHandler.error("end tag name: " + tagName + ' maybe not complete');
            end = tagStart + 1 + tagName.length;
          }

          var localNSMap = config.localNSMap;
          var endMatch = config.tagName == tagName;
          var endIgnoreCaseMach = endMatch || config.tagName && config.tagName.toLowerCase() == tagName.toLowerCase();

          if (endIgnoreCaseMach) {
            domBuilder.endElement(config.uri, config.localName, tagName);

            if (localNSMap) {
              for (var prefix in localNSMap) {
                domBuilder.endPrefixMapping(prefix);
              }
            }

            if (!endMatch) {
              errorHandler.fatalError("end tag name: " + tagName + ' is not match the current start tagName:' + config.tagName);
            }
          } else {
            parseStack.push(config);
          }

          end++;
          break;

        case '?':
          locator && position(tagStart);
          end = parseInstruction(source, tagStart, domBuilder);
          break;

        case '!':
          locator && position(tagStart);
          end = parseDCC(source, tagStart, domBuilder, errorHandler);
          break;

        default:
          locator && position(tagStart);
          var el = new ElementAttributes();
          var currentNSMap = parseStack[parseStack.length - 1].currentNSMap;
          var end = parseElementStartPart(source, tagStart, el, currentNSMap, entityReplacer, errorHandler);
          var len = el.length;

          if (!el.closed && fixSelfClosed(source, end, el.tagName, closeMap)) {
            el.closed = true;

            if (!entityMap.nbsp) {
              errorHandler.warning('unclosed xml attribute');
            }
          }

          if (locator && len) {
            var locator2 = copyLocator(locator, {});

            for (var i = 0; i < len; i++) {
              var a = el[i];
              position(a.offset);
              a.locator = copyLocator(locator, {});
            }

            domBuilder.locator = locator2;

            if (appendElement(el, domBuilder, currentNSMap)) {
              parseStack.push(el);
            }

            domBuilder.locator = locator;
          } else {
            if (appendElement(el, domBuilder, currentNSMap)) {
              parseStack.push(el);
            }
          }

          if (el.uri === 'http://www.w3.org/1999/xhtml' && !el.closed) {
            end = parseHtmlSpecialContent(source, end, el.tagName, entityReplacer, domBuilder);
          } else {
            end++;
          }

      }
    } catch (e) {
      errorHandler.error('element parse error: ' + e);
      end = -1;
    }

    if (end > start) {
      start = end;
    } else {
      appendText(Math.max(tagStart, start) + 1);
    }
  }
}

function copyLocator(f, t) {
  t.lineNumber = f.lineNumber;
  t.columnNumber = f.columnNumber;
  return t;
}

function parseElementStartPart(source, start, el, currentNSMap, entityReplacer, errorHandler) {
  var attrName;
  var value;
  var p = ++start;
  var s = S_TAG;

  while (true) {
    var c = source.charAt(p);

    switch (c) {
      case '=':
        if (s === S_ATTR) {
          attrName = source.slice(start, p);
          s = S_EQ;
        } else if (s === S_ATTR_SPACE) {
          s = S_EQ;
        } else {
          throw new Error('attribute equal must after attrName');
        }

        break;

      case '\'':
      case '"':
        if (s === S_EQ || s === S_ATTR) {
            if (s === S_ATTR) {
              errorHandler.warning('attribute value must after "="');
              attrName = source.slice(start, p);
            }

            start = p + 1;
            p = source.indexOf(c, start);

            if (p > 0) {
              value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
              el.add(attrName, value, start - 1);
              s = S_ATTR_END;
            } else {
              throw new Error('attribute value no end \'' + c + '\' match');
            }
          } else if (s == S_ATTR_NOQUOT_VALUE) {
          value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
          el.add(attrName, value, start);
          errorHandler.warning('attribute "' + attrName + '" missed start quot(' + c + ')!!');
          start = p + 1;
          s = S_ATTR_END;
        } else {
          throw new Error('attribute value must after "="');
        }

        break;

      case '/':
        switch (s) {
          case S_TAG:
            el.setTagName(source.slice(start, p));

          case S_ATTR_END:
          case S_TAG_SPACE:
          case S_TAG_CLOSE:
            s = S_TAG_CLOSE;
            el.closed = true;

          case S_ATTR_NOQUOT_VALUE:
          case S_ATTR:
          case S_ATTR_SPACE:
            break;

          default:
            throw new Error("attribute invalid close char('/')");
        }

        break;

      case '':
        errorHandler.error('unexpected end of input');

        if (s == S_TAG) {
          el.setTagName(source.slice(start, p));
        }

        return p;

      case '>':
        switch (s) {
          case S_TAG:
            el.setTagName(source.slice(start, p));

          case S_ATTR_END:
          case S_TAG_SPACE:
          case S_TAG_CLOSE:
            break;

          case S_ATTR_NOQUOT_VALUE:
          case S_ATTR:
            value = source.slice(start, p);

            if (value.slice(-1) === '/') {
              el.closed = true;
              value = value.slice(0, -1);
            }

          case S_ATTR_SPACE:
            if (s === S_ATTR_SPACE) {
              value = attrName;
            }

            if (s == S_ATTR_NOQUOT_VALUE) {
              errorHandler.warning('attribute "' + value + '" missed quot(")!!');
              el.add(attrName, value.replace(/&#?\w+;/g, entityReplacer), start);
            } else {
              if (currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !value.match(/^(?:disabled|checked|selected)$/i)) {
                errorHandler.warning('attribute "' + value + '" missed value!! "' + value + '" instead!!');
              }

              el.add(value, value, start);
            }

            break;

          case S_EQ:
            throw new Error('attribute value missed!!');
        }

        return p;

      case "\x80":
        c = ' ';

      default:
        if (c <= ' ') {
          switch (s) {
            case S_TAG:
              el.setTagName(source.slice(start, p));
              s = S_TAG_SPACE;
              break;

            case S_ATTR:
              attrName = source.slice(start, p);
              s = S_ATTR_SPACE;
              break;

            case S_ATTR_NOQUOT_VALUE:
              var value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
              errorHandler.warning('attribute "' + value + '" missed quot(")!!');
              el.add(attrName, value, start);

            case S_ATTR_END:
              s = S_TAG_SPACE;
              break;
          }
        } else {
          switch (s) {
            case S_ATTR_SPACE:
              var tagName = el.tagName;

              if (currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !attrName.match(/^(?:disabled|checked|selected)$/i)) {
                errorHandler.warning('attribute "' + attrName + '" missed value!! "' + attrName + '" instead2!!');
              }

              el.add(attrName, attrName, start);
              start = p;
              s = S_ATTR;
              break;

            case S_ATTR_END:
              errorHandler.warning('attribute space is required"' + attrName + '"!!');

            case S_TAG_SPACE:
              s = S_ATTR;
              start = p;
              break;

            case S_EQ:
              s = S_ATTR_NOQUOT_VALUE;
              start = p;
              break;

            case S_TAG_CLOSE:
              throw new Error("elements closed character '/' and '>' must be connected to");
          }
        }

    }

    p++;
  }
}

function appendElement(el, domBuilder, currentNSMap) {
  var tagName = el.tagName;
  var localNSMap = null;
  var i = el.length;

  while (i--) {
    var a = el[i];
    var qName = a.qName;
    var value = a.value;
    var nsp = qName.indexOf(':');

    if (nsp > 0) {
      var prefix = a.prefix = qName.slice(0, nsp);
      var localName = qName.slice(nsp + 1);
      var nsPrefix = prefix === 'xmlns' && localName;
    } else {
      localName = qName;
      prefix = null;
      nsPrefix = qName === 'xmlns' && '';
    }

    a.localName = localName;

    if (nsPrefix !== false) {
      if (localNSMap == null) {
        localNSMap = {};

        _copy(currentNSMap, currentNSMap = {});
      }

      currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
      a.uri = 'http://www.w3.org/2000/xmlns/';
      domBuilder.startPrefixMapping(nsPrefix, value);
    }
  }

  var i = el.length;

  while (i--) {
    a = el[i];
    var prefix = a.prefix;

    if (prefix) {
      if (prefix === 'xml') {
        a.uri = 'http://www.w3.org/XML/1998/namespace';
      }

      if (prefix !== 'xmlns') {
        a.uri = currentNSMap[prefix || ''];
      }
    }
  }

  var nsp = tagName.indexOf(':');

  if (nsp > 0) {
    prefix = el.prefix = tagName.slice(0, nsp);
    localName = el.localName = tagName.slice(nsp + 1);
  } else {
    prefix = null;
    localName = el.localName = tagName;
  }

  var ns = el.uri = currentNSMap[prefix || ''];
  domBuilder.startElement(ns, localName, tagName, el);

  if (el.closed) {
    domBuilder.endElement(ns, localName, tagName);

    if (localNSMap) {
      for (prefix in localNSMap) {
        domBuilder.endPrefixMapping(prefix);
      }
    }
  } else {
    el.currentNSMap = currentNSMap;
    el.localNSMap = localNSMap;
    return true;
  }
}

function parseHtmlSpecialContent(source, elStartEnd, tagName, entityReplacer, domBuilder) {
  if (/^(?:script|textarea)$/i.test(tagName)) {
    var elEndStart = source.indexOf('</' + tagName + '>', elStartEnd);
    var text = source.substring(elStartEnd + 1, elEndStart);

    if (/[&<]/.test(text)) {
      if (/^script$/i.test(tagName)) {
        domBuilder.characters(text, 0, text.length);
        return elEndStart;
      }

      text = text.replace(/&#?\w+;/g, entityReplacer);
      domBuilder.characters(text, 0, text.length);
      return elEndStart;
    }
  }

  return elStartEnd + 1;
}

function fixSelfClosed(source, elStartEnd, tagName, closeMap) {
  var pos = closeMap[tagName];

  if (pos == null) {
    pos = source.lastIndexOf('</' + tagName + '>');

    if (pos < elStartEnd) {
      pos = source.lastIndexOf('</' + tagName);
    }

    closeMap[tagName] = pos;
  }

  return pos < elStartEnd;
}

function _copy(source, target) {
  for (var n in source) {
    target[n] = source[n];
  }
}

function parseDCC(source, start, domBuilder, errorHandler) {
  var next = source.charAt(start + 2);

  switch (next) {
    case '-':
      if (source.charAt(start + 3) === '-') {
        var end = source.indexOf('-->', start + 4);

        if (end > start) {
          domBuilder.comment(source, start + 4, end - start - 4);
          return end + 3;
        } else {
          errorHandler.error("Unclosed comment");
          return -1;
        }
      } else {
        return -1;
      }

    default:
      if (source.substr(start + 3, 6) == 'CDATA[') {
        var end = source.indexOf(']]>', start + 9);
        domBuilder.startCDATA();
        domBuilder.characters(source, start + 9, end - start - 9);
        domBuilder.endCDATA();
        return end + 3;
      }

      var matchs = split(source, start);
      var len = matchs.length;

      if (len > 1 && /!doctype/i.test(matchs[0][0])) {
        var name = matchs[1][0];
        var pubid = len > 3 && /^public$/i.test(matchs[2][0]) && matchs[3][0];
        var sysid = len > 4 && matchs[4][0];
        var lastMatch = matchs[len - 1];
        domBuilder.startDTD(name, pubid && pubid.replace(/^(['"])(.*?)\1$/, '$2'), sysid && sysid.replace(/^(['"])(.*?)\1$/, '$2'));
        domBuilder.endDTD();
        return lastMatch.index + lastMatch[0].length;
      }

  }

  return -1;
}

function parseInstruction(source, start, domBuilder) {
  var end = source.indexOf('?>', start);

  if (end) {
    var match = source.substring(start, end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);

    if (match) {
      var len = match[0].length;
      domBuilder.processingInstruction(match[1], match[2]);
      return end + 2;
    } else {
      return -1;
    }
  }

  return -1;
}

function ElementAttributes(source) {}

ElementAttributes.prototype = {
  setTagName: function setTagName(tagName) {
    if (!tagNamePattern.test(tagName)) {
      throw new Error('invalid tagName:' + tagName);
    }

    this.tagName = tagName;
  },
  add: function add(qName, value, offset) {
    if (!tagNamePattern.test(qName)) {
      throw new Error('invalid attribute:' + qName);
    }

    this[this.length++] = {
      qName: qName,
      value: value,
      offset: offset
    };
  },
  length: 0,
  getLocalName: function getLocalName(i) {
    return this[i].localName;
  },
  getLocator: function getLocator(i) {
    return this[i].locator;
  },
  getQName: function getQName(i) {
    return this[i].qName;
  },
  getURI: function getURI(i) {
    return this[i].uri;
  },
  getValue: function getValue(i) {
    return this[i].value;
  }
};

function split(source, start) {
  var match;
  var buf = [];
  var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
  reg.lastIndex = start;
  reg.exec(source);

  while (match = reg.exec(source)) {
    buf.push(match);
    if (match[1]) return buf;
  }
}

exports.XMLReader = XMLReader;

},{}]},{},[54]);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ3ZWItYWRhcHRlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpKHsxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG4hZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBlKGUpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBlO1xuICB9XG5cbiAgdmFyIHQgPSBcInVuZGVmaW5lZFwiICE9IHR5cGVvZiBleHBvcnRzID8gZXhwb3J0cyA6IFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIHNlbGYgPyBzZWxmIDogJC5nbG9iYWwsXG4gICAgICByID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPVwiO1xuICBlLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpLCBlLnByb3RvdHlwZS5uYW1lID0gXCJJbnZhbGlkQ2hhcmFjdGVyRXJyb3JcIiwgdC5idG9hIHx8ICh0LmJ0b2EgPSBmdW5jdGlvbiAodCkge1xuICAgIGZvciAodmFyIG8sIG4sIGEgPSBTdHJpbmcodCksIGkgPSAwLCBmID0gciwgYyA9IFwiXCI7IGEuY2hhckF0KDAgfCBpKSB8fCAoZiA9IFwiPVwiLCBpICUgMSk7IGMgKz0gZi5jaGFyQXQoNjMgJiBvID4+IDggLSBpICUgMSAqIDgpKSB7XG4gICAgICBpZiAobiA9IGEuY2hhckNvZGVBdChpICs9IC43NSksIG4gPiAyNTUpIHRocm93IG5ldyBlKFwiJ2J0b2EnIGZhaWxlZDogVGhlIHN0cmluZyB0byBiZSBlbmNvZGVkIGNvbnRhaW5zIGNoYXJhY3RlcnMgb3V0c2lkZSBvZiB0aGUgTGF0aW4xIHJhbmdlLlwiKTtcbiAgICAgIG8gPSBvIDw8IDggfCBuO1xuICAgIH1cblxuICAgIHJldHVybiBjO1xuICB9KSwgdC5hdG9iIHx8ICh0LmF0b2IgPSBmdW5jdGlvbiAodCkge1xuICAgIHZhciBvID0gU3RyaW5nKHQpLnJlcGxhY2UoL1s9XSskLywgXCJcIik7XG4gICAgaWYgKG8ubGVuZ3RoICUgNCA9PSAxKSB0aHJvdyBuZXcgZShcIidhdG9iJyBmYWlsZWQ6IFRoZSBzdHJpbmcgdG8gYmUgZGVjb2RlZCBpcyBub3QgY29ycmVjdGx5IGVuY29kZWQuXCIpO1xuXG4gICAgZm9yICh2YXIgbiwgYSwgaSA9IDAsIGYgPSAwLCBjID0gXCJcIjsgYSA9IG8uY2hhckF0KGYrKyk7IH5hICYmIChuID0gaSAlIDQgPyA2NCAqIG4gKyBhIDogYSwgaSsrICUgNCkgPyBjICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoMjU1ICYgbiA+PiAoLTIgKiBpICYgNikpIDogMCkge1xuICAgICAgYSA9IHIuaW5kZXhPZihhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYztcbiAgfSk7XG59KCk7XG5cbn0se31dLDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuIWZ1bmN0aW9uIChuKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGZ1bmN0aW9uIHQobiwgdCkge1xuICAgIHZhciByID0gKDY1NTM1ICYgbikgKyAoNjU1MzUgJiB0KTtcbiAgICByZXR1cm4gKG4gPj4gMTYpICsgKHQgPj4gMTYpICsgKHIgPj4gMTYpIDw8IDE2IHwgNjU1MzUgJiByO1xuICB9XG5cbiAgZnVuY3Rpb24gcihuLCB0KSB7XG4gICAgcmV0dXJuIG4gPDwgdCB8IG4gPj4+IDMyIC0gdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGUobiwgZSwgbywgdSwgYywgZikge1xuICAgIHJldHVybiB0KHIodCh0KGUsIG4pLCB0KHUsIGYpKSwgYyksIG8pO1xuICB9XG5cbiAgZnVuY3Rpb24gbyhuLCB0LCByLCBvLCB1LCBjLCBmKSB7XG4gICAgcmV0dXJuIGUodCAmIHIgfCB+dCAmIG8sIG4sIHQsIHUsIGMsIGYpO1xuICB9XG5cbiAgZnVuY3Rpb24gdShuLCB0LCByLCBvLCB1LCBjLCBmKSB7XG4gICAgcmV0dXJuIGUodCAmIG8gfCByICYgfm8sIG4sIHQsIHUsIGMsIGYpO1xuICB9XG5cbiAgZnVuY3Rpb24gYyhuLCB0LCByLCBvLCB1LCBjLCBmKSB7XG4gICAgcmV0dXJuIGUodCBeIHIgXiBvLCBuLCB0LCB1LCBjLCBmKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGYobiwgdCwgciwgbywgdSwgYywgZikge1xuICAgIHJldHVybiBlKHIgXiAodCB8IH5vKSwgbiwgdCwgdSwgYywgZik7XG4gIH1cblxuICBmdW5jdGlvbiBpKG4sIHIpIHtcbiAgICBuW3IgPj4gNV0gfD0gMTI4IDw8IHIgJSAzMiwgblsxNCArIChyICsgNjQgPj4+IDkgPDwgNCldID0gcjtcbiAgICB2YXIgZSxcbiAgICAgICAgaSxcbiAgICAgICAgYSxcbiAgICAgICAgZCxcbiAgICAgICAgaCxcbiAgICAgICAgbCA9IDE3MzI1ODQxOTMsXG4gICAgICAgIGcgPSAtMjcxNzMzODc5LFxuICAgICAgICB2ID0gLTE3MzI1ODQxOTQsXG4gICAgICAgIG0gPSAyNzE3MzM4Nzg7XG5cbiAgICBmb3IgKGUgPSAwOyBlIDwgbi5sZW5ndGg7IGUgKz0gMTYpIHtcbiAgICAgIGkgPSBsLCBhID0gZywgZCA9IHYsIGggPSBtLCBnID0gZihnID0gZihnID0gZihnID0gZihnID0gYyhnID0gYyhnID0gYyhnID0gYyhnID0gdShnID0gdShnID0gdShnID0gdShnID0gbyhnID0gbyhnID0gbyhnID0gbyhnLCB2ID0gbyh2LCBtID0gbyhtLCBsID0gbyhsLCBnLCB2LCBtLCBuW2VdLCA3LCAtNjgwODc2OTM2KSwgZywgdiwgbltlICsgMV0sIDEyLCAtMzg5NTY0NTg2KSwgbCwgZywgbltlICsgMl0sIDE3LCA2MDYxMDU4MTkpLCBtLCBsLCBuW2UgKyAzXSwgMjIsIC0xMDQ0NTI1MzMwKSwgdiA9IG8odiwgbSA9IG8obSwgbCA9IG8obCwgZywgdiwgbSwgbltlICsgNF0sIDcsIC0xNzY0MTg4OTcpLCBnLCB2LCBuW2UgKyA1XSwgMTIsIDEyMDAwODA0MjYpLCBsLCBnLCBuW2UgKyA2XSwgMTcsIC0xNDczMjMxMzQxKSwgbSwgbCwgbltlICsgN10sIDIyLCAtNDU3MDU5ODMpLCB2ID0gbyh2LCBtID0gbyhtLCBsID0gbyhsLCBnLCB2LCBtLCBuW2UgKyA4XSwgNywgMTc3MDAzNTQxNiksIGcsIHYsIG5bZSArIDldLCAxMiwgLTE5NTg0MTQ0MTcpLCBsLCBnLCBuW2UgKyAxMF0sIDE3LCAtNDIwNjMpLCBtLCBsLCBuW2UgKyAxMV0sIDIyLCAtMTk5MDQwNDE2MiksIHYgPSBvKHYsIG0gPSBvKG0sIGwgPSBvKGwsIGcsIHYsIG0sIG5bZSArIDEyXSwgNywgMTgwNDYwMzY4MiksIGcsIHYsIG5bZSArIDEzXSwgMTIsIC00MDM0MTEwMSksIGwsIGcsIG5bZSArIDE0XSwgMTcsIC0xNTAyMDAyMjkwKSwgbSwgbCwgbltlICsgMTVdLCAyMiwgMTIzNjUzNTMyOSksIHYgPSB1KHYsIG0gPSB1KG0sIGwgPSB1KGwsIGcsIHYsIG0sIG5bZSArIDFdLCA1LCAtMTY1Nzk2NTEwKSwgZywgdiwgbltlICsgNl0sIDksIC0xMDY5NTAxNjMyKSwgbCwgZywgbltlICsgMTFdLCAxNCwgNjQzNzE3NzEzKSwgbSwgbCwgbltlXSwgMjAsIC0zNzM4OTczMDIpLCB2ID0gdSh2LCBtID0gdShtLCBsID0gdShsLCBnLCB2LCBtLCBuW2UgKyA1XSwgNSwgLTcwMTU1ODY5MSksIGcsIHYsIG5bZSArIDEwXSwgOSwgMzgwMTYwODMpLCBsLCBnLCBuW2UgKyAxNV0sIDE0LCAtNjYwNDc4MzM1KSwgbSwgbCwgbltlICsgNF0sIDIwLCAtNDA1NTM3ODQ4KSwgdiA9IHUodiwgbSA9IHUobSwgbCA9IHUobCwgZywgdiwgbSwgbltlICsgOV0sIDUsIDU2ODQ0NjQzOCksIGcsIHYsIG5bZSArIDE0XSwgOSwgLTEwMTk4MDM2OTApLCBsLCBnLCBuW2UgKyAzXSwgMTQsIC0xODczNjM5NjEpLCBtLCBsLCBuW2UgKyA4XSwgMjAsIDExNjM1MzE1MDEpLCB2ID0gdSh2LCBtID0gdShtLCBsID0gdShsLCBnLCB2LCBtLCBuW2UgKyAxM10sIDUsIC0xNDQ0NjgxNDY3KSwgZywgdiwgbltlICsgMl0sIDksIC01MTQwMzc4NCksIGwsIGcsIG5bZSArIDddLCAxNCwgMTczNTMyODQ3MyksIG0sIGwsIG5bZSArIDEyXSwgMjAsIC0xOTI2NjA3NzM0KSwgdiA9IGModiwgbSA9IGMobSwgbCA9IGMobCwgZywgdiwgbSwgbltlICsgNV0sIDQsIC0zNzg1NTgpLCBnLCB2LCBuW2UgKyA4XSwgMTEsIC0yMDIyNTc0NDYzKSwgbCwgZywgbltlICsgMTFdLCAxNiwgMTgzOTAzMDU2MiksIG0sIGwsIG5bZSArIDE0XSwgMjMsIC0zNTMwOTU1NiksIHYgPSBjKHYsIG0gPSBjKG0sIGwgPSBjKGwsIGcsIHYsIG0sIG5bZSArIDFdLCA0LCAtMTUzMDk5MjA2MCksIGcsIHYsIG5bZSArIDRdLCAxMSwgMTI3Mjg5MzM1MyksIGwsIGcsIG5bZSArIDddLCAxNiwgLTE1NTQ5NzYzMiksIG0sIGwsIG5bZSArIDEwXSwgMjMsIC0xMDk0NzMwNjQwKSwgdiA9IGModiwgbSA9IGMobSwgbCA9IGMobCwgZywgdiwgbSwgbltlICsgMTNdLCA0LCA2ODEyNzkxNzQpLCBnLCB2LCBuW2VdLCAxMSwgLTM1ODUzNzIyMiksIGwsIGcsIG5bZSArIDNdLCAxNiwgLTcyMjUyMTk3OSksIG0sIGwsIG5bZSArIDZdLCAyMywgNzYwMjkxODkpLCB2ID0gYyh2LCBtID0gYyhtLCBsID0gYyhsLCBnLCB2LCBtLCBuW2UgKyA5XSwgNCwgLTY0MDM2NDQ4NyksIGcsIHYsIG5bZSArIDEyXSwgMTEsIC00MjE4MTU4MzUpLCBsLCBnLCBuW2UgKyAxNV0sIDE2LCA1MzA3NDI1MjApLCBtLCBsLCBuW2UgKyAyXSwgMjMsIC05OTUzMzg2NTEpLCB2ID0gZih2LCBtID0gZihtLCBsID0gZihsLCBnLCB2LCBtLCBuW2VdLCA2LCAtMTk4NjMwODQ0KSwgZywgdiwgbltlICsgN10sIDEwLCAxMTI2ODkxNDE1KSwgbCwgZywgbltlICsgMTRdLCAxNSwgLTE0MTYzNTQ5MDUpLCBtLCBsLCBuW2UgKyA1XSwgMjEsIC01NzQzNDA1NSksIHYgPSBmKHYsIG0gPSBmKG0sIGwgPSBmKGwsIGcsIHYsIG0sIG5bZSArIDEyXSwgNiwgMTcwMDQ4NTU3MSksIGcsIHYsIG5bZSArIDNdLCAxMCwgLTE4OTQ5ODY2MDYpLCBsLCBnLCBuW2UgKyAxMF0sIDE1LCAtMTA1MTUyMyksIG0sIGwsIG5bZSArIDFdLCAyMSwgLTIwNTQ5MjI3OTkpLCB2ID0gZih2LCBtID0gZihtLCBsID0gZihsLCBnLCB2LCBtLCBuW2UgKyA4XSwgNiwgMTg3MzMxMzM1OSksIGcsIHYsIG5bZSArIDE1XSwgMTAsIC0zMDYxMTc0NCksIGwsIGcsIG5bZSArIDZdLCAxNSwgLTE1NjAxOTgzODApLCBtLCBsLCBuW2UgKyAxM10sIDIxLCAxMzA5MTUxNjQ5KSwgdiA9IGYodiwgbSA9IGYobSwgbCA9IGYobCwgZywgdiwgbSwgbltlICsgNF0sIDYsIC0xNDU1MjMwNzApLCBnLCB2LCBuW2UgKyAxMV0sIDEwLCAtMTEyMDIxMDM3OSksIGwsIGcsIG5bZSArIDJdLCAxNSwgNzE4Nzg3MjU5KSwgbSwgbCwgbltlICsgOV0sIDIxLCAtMzQzNDg1NTUxKSwgbCA9IHQobCwgaSksIGcgPSB0KGcsIGEpLCB2ID0gdCh2LCBkKSwgbSA9IHQobSwgaCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtsLCBnLCB2LCBtXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGEobikge1xuICAgIHZhciB0LFxuICAgICAgICByID0gXCJcIixcbiAgICAgICAgZSA9IDMyICogbi5sZW5ndGg7XG5cbiAgICBmb3IgKHQgPSAwOyB0IDwgZTsgdCArPSA4KSB7XG4gICAgICByICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoblt0ID4+IDVdID4+PiB0ICUgMzIgJiAyNTUpO1xuICAgIH1cblxuICAgIHJldHVybiByO1xuICB9XG5cbiAgZnVuY3Rpb24gZChuKSB7XG4gICAgdmFyIHQsXG4gICAgICAgIHIgPSBbXTtcblxuICAgIGZvciAoclsobi5sZW5ndGggPj4gMikgLSAxXSA9IHZvaWQgMCwgdCA9IDA7IHQgPCByLmxlbmd0aDsgdCArPSAxKSB7XG4gICAgICByW3RdID0gMDtcbiAgICB9XG5cbiAgICB2YXIgZSA9IDggKiBuLmxlbmd0aDtcblxuICAgIGZvciAodCA9IDA7IHQgPCBlOyB0ICs9IDgpIHtcbiAgICAgIHJbdCA+PiA1XSB8PSAoMjU1ICYgbi5jaGFyQ29kZUF0KHQgLyA4KSkgPDwgdCAlIDMyO1xuICAgIH1cblxuICAgIHJldHVybiByO1xuICB9XG5cbiAgZnVuY3Rpb24gaChuKSB7XG4gICAgcmV0dXJuIGEoaShkKG4pLCA4ICogbi5sZW5ndGgpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGwobiwgdCkge1xuICAgIHZhciByLFxuICAgICAgICBlLFxuICAgICAgICBvID0gZChuKSxcbiAgICAgICAgdSA9IFtdLFxuICAgICAgICBjID0gW107XG5cbiAgICBmb3IgKHVbMTVdID0gY1sxNV0gPSB2b2lkIDAsIG8ubGVuZ3RoID4gMTYgJiYgKG8gPSBpKG8sIDggKiBuLmxlbmd0aCkpLCByID0gMDsgciA8IDE2OyByICs9IDEpIHtcbiAgICAgIHVbcl0gPSA5MDk1MjI0ODYgXiBvW3JdLCBjW3JdID0gMTU0OTU1NjgyOCBeIG9bcl07XG4gICAgfVxuXG4gICAgcmV0dXJuIGUgPSBpKHUuY29uY2F0KGQodCkpLCA1MTIgKyA4ICogdC5sZW5ndGgpLCBhKGkoYy5jb25jYXQoZSksIDY0MCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZyhuKSB7XG4gICAgdmFyIHQsXG4gICAgICAgIHIsXG4gICAgICAgIGUgPSBcIlwiO1xuXG4gICAgZm9yIChyID0gMDsgciA8IG4ubGVuZ3RoOyByICs9IDEpIHtcbiAgICAgIHQgPSBuLmNoYXJDb2RlQXQociksIGUgKz0gXCIwMTIzNDU2Nzg5YWJjZGVmXCIuY2hhckF0KHQgPj4+IDQgJiAxNSkgKyBcIjAxMjM0NTY3ODlhYmNkZWZcIi5jaGFyQXQoMTUgJiB0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHYobikge1xuICAgIHJldHVybiB1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQobikpO1xuICB9XG5cbiAgZnVuY3Rpb24gbShuKSB7XG4gICAgcmV0dXJuIGgodihuKSk7XG4gIH1cblxuICBmdW5jdGlvbiBwKG4pIHtcbiAgICByZXR1cm4gZyhtKG4pKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHMobiwgdCkge1xuICAgIHJldHVybiBsKHYobiksIHYodCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gQyhuLCB0KSB7XG4gICAgcmV0dXJuIGcocyhuLCB0KSk7XG4gIH1cblxuICBmdW5jdGlvbiBBKG4sIHQsIHIpIHtcbiAgICByZXR1cm4gdCA/IHIgPyBzKHQsIG4pIDogQyh0LCBuKSA6IHIgPyBtKG4pIDogcChuKTtcbiAgfVxuXG4gIFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgZGVmaW5lICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBBO1xuICB9KSA6IFwib2JqZWN0XCIgPT0gKHR5cGVvZiBtb2R1bGUgPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZihtb2R1bGUpKSAmJiBtb2R1bGUuZXhwb3J0cyA/IG1vZHVsZS5leHBvcnRzID0gQSA6IG4ubWQ1ID0gQTtcbn0odm9pZCAwKTtcblxufSx7fV0sMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfSFRNTEF1ZGlvRWxlbWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0hUTUxBdWRpb0VsZW1lbnRcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuZnVuY3Rpb24gX2NyZWF0ZVN1cGVyKERlcml2ZWQpIHsgdmFyIGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QgPSBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCk7IHJldHVybiBmdW5jdGlvbiBfY3JlYXRlU3VwZXJJbnRlcm5hbCgpIHsgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLCByZXN1bHQ7IGlmIChoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KSB7IHZhciBOZXdUYXJnZXQgPSBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3I7IHJlc3VsdCA9IFJlZmxlY3QuY29uc3RydWN0KFN1cGVyLCBhcmd1bWVudHMsIE5ld1RhcmdldCk7IH0gZWxzZSB7IHJlc3VsdCA9IFN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH0gcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIHJlc3VsdCk7IH07IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbnZhciBBdWRpbyA9IGZ1bmN0aW9uIChfSFRNTEF1ZGlvRWxlbWVudCkge1xuICBfaW5oZXJpdHMoQXVkaW8sIF9IVE1MQXVkaW9FbGVtZW50KTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKEF1ZGlvKTtcblxuICBmdW5jdGlvbiBBdWRpbyh1cmwpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQXVkaW8pO1xuXG4gICAgcmV0dXJuIF9zdXBlci5jYWxsKHRoaXMsIHVybCk7XG4gIH1cblxuICByZXR1cm4gQXVkaW87XG59KF9IVE1MQXVkaW9FbGVtZW50MltcImRlZmF1bHRcIl0pO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEF1ZGlvO1xuXG59LHtcIi4vSFRNTEF1ZGlvRWxlbWVudFwiOjE0fV0sNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4oZnVuY3Rpb24gKGdsb2JhbCl7KGZ1bmN0aW9uICgpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuKGZ1bmN0aW9uIChnbG9iYWwpIHtcbiAgKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICBkZWZpbmUoW1wiZXhwb3J0c1wiXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICgodHlwZW9mIGV4cG9ydHMgPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZihleHBvcnRzKSkgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGV4cG9ydHMubm9kZU5hbWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGZhY3RvcnkoZXhwb3J0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZhY3RvcnkoZ2xvYmFsKTtcbiAgICB9XG4gIH0pKGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBleHBvcnRzLlVSTCA9IGdsb2JhbC5VUkwgfHwgZ2xvYmFsLndlYmtpdFVSTDtcblxuICAgIGlmIChnbG9iYWwuQmxvYiAmJiBnbG9iYWwuVVJMKSB7XG4gICAgICB0cnkge1xuICAgICAgICBuZXcgQmxvYigpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cblxuICAgIHZhciBCbG9iQnVpbGRlciA9IGdsb2JhbC5CbG9iQnVpbGRlciB8fCBnbG9iYWwuV2ViS2l0QmxvYkJ1aWxkZXIgfHwgZ2xvYmFsLk1vekJsb2JCdWlsZGVyIHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBnZXRfY2xhc3MgPSBmdW5jdGlvbiBnZXRfY2xhc3Mob2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KS5tYXRjaCgvXlxcW29iamVjdFxccyguKilcXF0kLylbMV07XG4gICAgICB9LFxuICAgICAgICAgIEZha2VCbG9iQnVpbGRlciA9IGZ1bmN0aW9uIEJsb2JCdWlsZGVyKCkge1xuICAgICAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICAgIH0sXG4gICAgICAgICAgRmFrZUJsb2IgPSBmdW5jdGlvbiBCbG9iKGRhdGEsIHR5cGUsIGVuY29kaW5nKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIHRoaXMuc2l6ZSA9IGRhdGEubGVuZ3RoO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLmVuY29kaW5nID0gZW5jb2Rpbmc7XG4gICAgICB9LFxuICAgICAgICAgIEZCQl9wcm90byA9IEZha2VCbG9iQnVpbGRlci5wcm90b3R5cGUsXG4gICAgICAgICAgRkJfcHJvdG8gPSBGYWtlQmxvYi5wcm90b3R5cGUsXG4gICAgICAgICAgRmlsZVJlYWRlclN5bmMgPSBnbG9iYWwuRmlsZVJlYWRlclN5bmMsXG4gICAgICAgICAgRmlsZUV4Y2VwdGlvbiA9IGZ1bmN0aW9uIEZpbGVFeGNlcHRpb24odHlwZSkge1xuICAgICAgICB0aGlzLmNvZGUgPSB0aGlzW3RoaXMubmFtZSA9IHR5cGVdO1xuICAgICAgfSxcbiAgICAgICAgICBmaWxlX2V4X2NvZGVzID0gKFwiTk9UX0ZPVU5EX0VSUiBTRUNVUklUWV9FUlIgQUJPUlRfRVJSIE5PVF9SRUFEQUJMRV9FUlIgRU5DT0RJTkdfRVJSIFwiICsgXCJOT19NT0RJRklDQVRJT05fQUxMT1dFRF9FUlIgSU5WQUxJRF9TVEFURV9FUlIgU1lOVEFYX0VSUlwiKS5zcGxpdChcIiBcIiksXG4gICAgICAgICAgZmlsZV9leF9jb2RlID0gZmlsZV9leF9jb2Rlcy5sZW5ndGgsXG4gICAgICAgICAgcmVhbF9VUkwgPSBnbG9iYWwuVVJMIHx8IGdsb2JhbC53ZWJraXRVUkwgfHwgZXhwb3J0cyxcbiAgICAgICAgICByZWFsX2NyZWF0ZV9vYmplY3RfVVJMID0gcmVhbF9VUkwuY3JlYXRlT2JqZWN0VVJMLFxuICAgICAgICAgIHJlYWxfcmV2b2tlX29iamVjdF9VUkwgPSByZWFsX1VSTC5yZXZva2VPYmplY3RVUkwsXG4gICAgICAgICAgVVJMID0gcmVhbF9VUkwsXG4gICAgICAgICAgYnRvYSA9IGdsb2JhbC5idG9hLFxuICAgICAgICAgIGF0b2IgPSBnbG9iYWwuYXRvYixcbiAgICAgICAgICBBcnJheUJ1ZmZlciA9IGdsb2JhbC5BcnJheUJ1ZmZlcixcbiAgICAgICAgICBVaW50OEFycmF5ID0gZ2xvYmFsLlVpbnQ4QXJyYXksXG4gICAgICAgICAgb3JpZ2luID0gL15bXFx3LV0rOlxcLypcXFs/W1xcd1xcLjotXStcXF0/KD86OlswLTldKyk/LztcblxuICAgICAgRmFrZUJsb2IuZmFrZSA9IEZCX3Byb3RvLmZha2UgPSB0cnVlO1xuXG4gICAgICB3aGlsZSAoZmlsZV9leF9jb2RlLS0pIHtcbiAgICAgICAgRmlsZUV4Y2VwdGlvbi5wcm90b3R5cGVbZmlsZV9leF9jb2Rlc1tmaWxlX2V4X2NvZGVdXSA9IGZpbGVfZXhfY29kZSArIDE7XG4gICAgICB9XG5cbiAgICAgIGlmICghcmVhbF9VUkwuY3JlYXRlT2JqZWN0VVJMKSB7XG4gICAgICAgIFVSTCA9IGV4cG9ydHMuVVJMID0gZnVuY3Rpb24gKHVyaSkge1xuICAgICAgICAgIHZhciB1cmlfaW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIiwgXCJhXCIpLFxuICAgICAgICAgICAgICB1cmlfb3JpZ2luO1xuICAgICAgICAgIHVyaV9pbmZvLmhyZWYgPSB1cmk7XG5cbiAgICAgICAgICBpZiAoIShcIm9yaWdpblwiIGluIHVyaV9pbmZvKSkge1xuICAgICAgICAgICAgaWYgKHVyaV9pbmZvLnByb3RvY29sLnRvTG93ZXJDYXNlKCkgPT09IFwiZGF0YTpcIikge1xuICAgICAgICAgICAgICB1cmlfaW5mby5vcmlnaW4gPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdXJpX29yaWdpbiA9IHVyaS5tYXRjaChvcmlnaW4pO1xuICAgICAgICAgICAgICB1cmlfaW5mby5vcmlnaW4gPSB1cmlfb3JpZ2luICYmIHVyaV9vcmlnaW5bMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHVyaV9pbmZvO1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBVUkwuY3JlYXRlT2JqZWN0VVJMID0gZnVuY3Rpb24gKGJsb2IpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBibG9iLnR5cGUsXG4gICAgICAgICAgICBkYXRhX1VSSV9oZWFkZXI7XG5cbiAgICAgICAgaWYgKHR5cGUgPT09IG51bGwpIHtcbiAgICAgICAgICB0eXBlID0gXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChibG9iIGluc3RhbmNlb2YgRmFrZUJsb2IpIHtcbiAgICAgICAgICBkYXRhX1VSSV9oZWFkZXIgPSBcImRhdGE6XCIgKyB0eXBlO1xuXG4gICAgICAgICAgaWYgKGJsb2IuZW5jb2RpbmcgPT09IFwiYmFzZTY0XCIpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhX1VSSV9oZWFkZXIgKyBcIjtiYXNlNjQsXCIgKyBibG9iLmRhdGE7XG4gICAgICAgICAgfSBlbHNlIGlmIChibG9iLmVuY29kaW5nID09PSBcIlVSSVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YV9VUklfaGVhZGVyICsgXCIsXCIgKyBkZWNvZGVVUklDb21wb25lbnQoYmxvYi5kYXRhKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoYnRvYSkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFfVVJJX2hlYWRlciArIFwiO2Jhc2U2NCxcIiArIGJ0b2EoYmxvYi5kYXRhKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFfVVJJX2hlYWRlciArIFwiLFwiICsgZW5jb2RlVVJJQ29tcG9uZW50KGJsb2IuZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHJlYWxfY3JlYXRlX29iamVjdF9VUkwpIHtcbiAgICAgICAgICByZXR1cm4gcmVhbF9jcmVhdGVfb2JqZWN0X1VSTC5jYWxsKHJlYWxfVVJMLCBibG9iKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgVVJMLnJldm9rZU9iamVjdFVSTCA9IGZ1bmN0aW9uIChvYmplY3RfVVJMKSB7XG4gICAgICAgIGlmIChvYmplY3RfVVJMLnN1YnN0cmluZygwLCA1KSAhPT0gXCJkYXRhOlwiICYmIHJlYWxfcmV2b2tlX29iamVjdF9VUkwpIHtcbiAgICAgICAgICByZWFsX3Jldm9rZV9vYmplY3RfVVJMLmNhbGwocmVhbF9VUkwsIG9iamVjdF9VUkwpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBGQkJfcHJvdG8uYXBwZW5kID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdmFyIGJiID0gdGhpcy5kYXRhO1xuXG4gICAgICAgIGlmIChVaW50OEFycmF5ICYmIChkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgfHwgZGF0YSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpKSB7XG4gICAgICAgICAgdmFyIHN0ciA9IFwiXCIsXG4gICAgICAgICAgICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGRhdGEpLFxuICAgICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgICAgYnVmX2xlbiA9IGJ1Zi5sZW5ndGg7XG5cbiAgICAgICAgICBmb3IgKDsgaSA8IGJ1Zl9sZW47IGkrKykge1xuICAgICAgICAgICAgc3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBiYi5wdXNoKHN0cik7XG4gICAgICAgIH0gZWxzZSBpZiAoZ2V0X2NsYXNzKGRhdGEpID09PSBcIkJsb2JcIiB8fCBnZXRfY2xhc3MoZGF0YSkgPT09IFwiRmlsZVwiKSB7XG4gICAgICAgICAgaWYgKEZpbGVSZWFkZXJTeW5jKSB7XG4gICAgICAgICAgICB2YXIgZnIgPSBuZXcgRmlsZVJlYWRlclN5bmMoKTtcbiAgICAgICAgICAgIGJiLnB1c2goZnIucmVhZEFzQmluYXJ5U3RyaW5nKGRhdGEpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEZpbGVFeGNlcHRpb24oXCJOT1RfUkVBREFCTEVfRVJSXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChkYXRhIGluc3RhbmNlb2YgRmFrZUJsb2IpIHtcbiAgICAgICAgICBpZiAoZGF0YS5lbmNvZGluZyA9PT0gXCJiYXNlNjRcIiAmJiBhdG9iKSB7XG4gICAgICAgICAgICBiYi5wdXNoKGF0b2IoZGF0YS5kYXRhKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChkYXRhLmVuY29kaW5nID09PSBcIlVSSVwiKSB7XG4gICAgICAgICAgICBiYi5wdXNoKGRlY29kZVVSSUNvbXBvbmVudChkYXRhLmRhdGEpKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEuZW5jb2RpbmcgPT09IFwicmF3XCIpIHtcbiAgICAgICAgICAgIGJiLnB1c2goZGF0YS5kYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBkYXRhICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBkYXRhICs9IFwiXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYmIucHVzaCh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoZGF0YSkpKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgRkJCX3Byb3RvLmdldEJsb2IgPSBmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICB0eXBlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgRmFrZUJsb2IodGhpcy5kYXRhLmpvaW4oXCJcIiksIHR5cGUsIFwicmF3XCIpO1xuICAgICAgfTtcblxuICAgICAgRkJCX3Byb3RvLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbb2JqZWN0IEJsb2JCdWlsZGVyXVwiO1xuICAgICAgfTtcblxuICAgICAgRkJfcHJvdG8uc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCwgdHlwZSkge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgICAgICAgaWYgKGFyZ3MgPCAzKSB7XG4gICAgICAgICAgdHlwZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IEZha2VCbG9iKHRoaXMuZGF0YS5zbGljZShzdGFydCwgYXJncyA+IDEgPyBlbmQgOiB0aGlzLmRhdGEubGVuZ3RoKSwgdHlwZSwgdGhpcy5lbmNvZGluZyk7XG4gICAgICB9O1xuXG4gICAgICBGQl9wcm90by50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW29iamVjdCBCbG9iXVwiO1xuICAgICAgfTtcblxuICAgICAgRkJfcHJvdG8uY2xvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IDA7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmRhdGE7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gRmFrZUJsb2JCdWlsZGVyO1xuICAgIH0oKTtcblxuICAgIGV4cG9ydHMuQmxvYiA9IGZ1bmN0aW9uIChibG9iUGFydHMsIG9wdGlvbnMpIHtcbiAgICAgIHZhciB0eXBlID0gb3B0aW9ucyA/IG9wdGlvbnMudHlwZSB8fCBcIlwiIDogXCJcIjtcbiAgICAgIHZhciBidWlsZGVyID0gbmV3IEJsb2JCdWlsZGVyKCk7XG5cbiAgICAgIGlmIChibG9iUGFydHMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGJsb2JQYXJ0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGlmIChVaW50OEFycmF5ICYmIGJsb2JQYXJ0c1tpXSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHtcbiAgICAgICAgICAgIGJ1aWxkZXIuYXBwZW5kKGJsb2JQYXJ0c1tpXS5idWZmZXIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBidWlsZGVyLmFwcGVuZChibG9iUGFydHNbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgYmxvYiA9IGJ1aWxkZXIuZ2V0QmxvYih0eXBlKTtcblxuICAgICAgaWYgKCFibG9iLnNsaWNlICYmIGJsb2Iud2Via2l0U2xpY2UpIHtcbiAgICAgICAgYmxvYi5zbGljZSA9IGJsb2Iud2Via2l0U2xpY2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBibG9iO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0UHJvdG90eXBlT2YgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gKG9iamVjdCkge1xuICAgICAgcmV0dXJuIG9iamVjdC5fX3Byb3RvX187XG4gICAgfTtcblxuICAgIGV4cG9ydHMuQmxvYi5wcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZihuZXcgZXhwb3J0cy5CbG9iKCkpO1xuICB9KTtcbn0pKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmIHNlbGYgfHwgdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgfHwgdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWwgfHwgKHZvaWQgMCkuY29udGVudCB8fCB2b2lkIDApO1xuXG59KS5jYWxsKHRoaXMpfSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG59LHt9XSw1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxudmFyIERPTVRva2VuTGlzdCA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRE9NVG9rZW5MaXN0KCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBET01Ub2tlbkxpc3QpO1xuXG4gICAgdGhpcy5sZW5ndGggPSAwO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKERPTVRva2VuTGlzdCwgW3tcbiAgICBrZXk6IFwiYWRkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZCgpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIkRPTVRva2VuTGlzdCBhZGQgaXNuJ3QgaW1wbGVtZW50ZWQhXCIpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjb250YWluc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb250YWlucygpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIkRPTVRva2VuTGlzdCBjb250YWlucyBpc24ndCBpbXBsZW1lbnRlZCFcIik7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImVudHJpZXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW50cmllcygpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIkRPTVRva2VuTGlzdCBlbnRyaWVzIGlzbid0IGltcGxlbWVudGVkIVwiKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZm9yRWFjaFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmb3JFYWNoKCkge1xuICAgICAgY29uc29sZS53YXJuKFwiRE9NVG9rZW5MaXN0IGZvckVhY2ggaXNuJ3QgaW1wbGVtZW50ZWQhXCIpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpdGVtXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGl0ZW0oKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJET01Ub2tlbkxpc3QgaXRlbSBpc24ndCBpbXBsZW1lbnRlZCFcIik7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImtleXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24ga2V5cygpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIkRPTVRva2VuTGlzdCBrZXlzIGlzbid0IGltcGxlbWVudGVkIVwiKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIkRPTVRva2VuTGlzdCByZW1vdmUgaXNuJ3QgaW1wbGVtZW50ZWQhXCIpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZXBsYWNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlcGxhY2UoKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJET01Ub2tlbkxpc3QgcmVwbGFjZSBpc24ndCBpbXBsZW1lbnRlZCFcIik7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInN1cHBvcnRzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN1cHBvcnRzKCkge1xuICAgICAgY29uc29sZS53YXJuKFwiRE9NVG9rZW5MaXN0IHN1cHBvcnRzIGlzbid0IGltcGxlbWVudGVkIVwiKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidG9nZ2xlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvZ2dsZSgpIHt9XG4gIH0sIHtcbiAgICBrZXk6IFwidmFsdWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWUoKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJET01Ub2tlbkxpc3QgdmFsdWUgaXNuJ3QgaW1wbGVtZW50ZWQhXCIpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ2YWx1ZXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWVzKCkge1xuICAgICAgY29uc29sZS53YXJuKFwiRE9NVG9rZW5MaXN0IHZhbHVlcyBpc24ndCBpbXBsZW1lbnRlZCFcIik7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIERPTVRva2VuTGlzdDtcbn0oKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBET01Ub2tlbkxpc3Q7XG5cbn0se31dLDY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX0V2ZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vRXZlbnRcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5mdW5jdGlvbiBfY3JlYXRlU3VwZXIoRGVyaXZlZCkgeyB2YXIgaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCA9IF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKTsgcmV0dXJuIGZ1bmN0aW9uIF9jcmVhdGVTdXBlckludGVybmFsKCkgeyB2YXIgU3VwZXIgPSBfZ2V0UHJvdG90eXBlT2YoRGVyaXZlZCksIHJlc3VsdDsgaWYgKGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QpIHsgdmFyIE5ld1RhcmdldCA9IF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3RvcjsgcmVzdWx0ID0gUmVmbGVjdC5jb25zdHJ1Y3QoU3VwZXIsIGFyZ3VtZW50cywgTmV3VGFyZ2V0KTsgfSBlbHNlIHsgcmVzdWx0ID0gU3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfSByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgcmVzdWx0KTsgfTsgfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7IHJldHVybiBjYWxsOyB9IHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpOyB9XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikgeyBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkgeyBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7IGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7IGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7IHRyeSB7IERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoRGF0ZSwgW10sIGZ1bmN0aW9uICgpIHt9KSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7IH07IHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7IH1cblxudmFyIERldmljZU1vdGlvbkV2ZW50ID0gZnVuY3Rpb24gKF9FdmVudCkge1xuICBfaW5oZXJpdHMoRGV2aWNlTW90aW9uRXZlbnQsIF9FdmVudCk7XG5cbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihEZXZpY2VNb3Rpb25FdmVudCk7XG5cbiAgZnVuY3Rpb24gRGV2aWNlTW90aW9uRXZlbnQoaW5pdEFyZ3MpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRGV2aWNlTW90aW9uRXZlbnQpO1xuXG4gICAgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCAnZGV2aWNlbW90aW9uJyk7XG5cbiAgICBpZiAoaW5pdEFyZ3MpIHtcbiAgICAgIF90aGlzLl9hY2NlbGVyYXRpb24gPSBpbml0QXJncy5hY2NlbGVyYXRpb24gPyBpbml0QXJncy5hY2NlbGVyYXRpb24gOiB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDAsXG4gICAgICAgIHo6IDBcbiAgICAgIH07XG4gICAgICBfdGhpcy5fYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSA9IGluaXRBcmdzLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkgPyBpbml0QXJncy5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5IDoge1xuICAgICAgICB4OiAwLFxuICAgICAgICB5OiAwLFxuICAgICAgICB6OiAwXG4gICAgICB9O1xuICAgICAgX3RoaXMuX3JvdGF0aW9uUmF0ZSA9IGluaXRBcmdzLnJvdGF0aW9uUmF0ZSA/IGluaXRBcmdzLnJvdGF0aW9uUmF0ZSA6IHtcbiAgICAgICAgYWxwaGE6IDAsXG4gICAgICAgIGJldGE6IDAsXG4gICAgICAgIGdhbW1hOiAwXG4gICAgICB9O1xuICAgICAgX3RoaXMuX2ludGVydmFsID0gaW5pdEFyZ3MuaW50ZXJ2YWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIF90aGlzLl9hY2NlbGVyYXRpb24gPSB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDAsXG4gICAgICAgIHo6IDBcbiAgICAgIH07XG4gICAgICBfdGhpcy5fYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSA9IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMCxcbiAgICAgICAgejogMFxuICAgICAgfTtcbiAgICAgIF90aGlzLl9yb3RhdGlvblJhdGUgPSB7XG4gICAgICAgIGFscGhhOiAwLFxuICAgICAgICBiZXRhOiAwLFxuICAgICAgICBnYW1tYTogMFxuICAgICAgfTtcbiAgICAgIF90aGlzLl9pbnRlcnZhbCA9IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKERldmljZU1vdGlvbkV2ZW50LCBbe1xuICAgIGtleTogXCJhY2NlbGVyYXRpb25cIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hY2NlbGVyYXRpb247XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHlcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyb3RhdGlvblJhdGVcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yb3RhdGlvblJhdGU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImludGVydmFsXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5faW50ZXJ2YWw7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIERldmljZU1vdGlvbkV2ZW50O1xufShfRXZlbnQyW1wiZGVmYXVsdFwiXSk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRGV2aWNlTW90aW9uRXZlbnQ7XG5cbn0se1wiLi9FdmVudFwiOjl9XSw3OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9BdWRpbyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vQXVkaW9cIikpO1xuXG52YXIgX0ZvbnRGYWNlU2V0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9Gb250RmFjZVNldFwiKSk7XG5cbnZhciBfTm9kZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL05vZGVcIikpO1xuXG52YXIgX05vZGVMaXN0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9Ob2RlTGlzdFwiKSk7XG5cbnZhciBfSFRNTEFuY2hvckVsZW1lbnQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0hUTUxBbmNob3JFbGVtZW50XCIpKTtcblxudmFyIF9IVE1MRWxlbWVudCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vSFRNTEVsZW1lbnRcIikpO1xuXG52YXIgX0hUTUxIdG1sRWxlbWVudCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vSFRNTEh0bWxFbGVtZW50XCIpKTtcblxudmFyIF9IVE1MQm9keUVsZW1lbnQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0hUTUxCb2R5RWxlbWVudFwiKSk7XG5cbnZhciBfSFRNTEhlYWRFbGVtZW50ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9IVE1MSGVhZEVsZW1lbnRcIikpO1xuXG52YXIgX0hUTUxDYW52YXNFbGVtZW50ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9IVE1MQ2FudmFzRWxlbWVudFwiKSk7XG5cbnZhciBfSFRNTFZpZGVvRWxlbWVudCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vSFRNTFZpZGVvRWxlbWVudFwiKSk7XG5cbnZhciBfSFRNTFNjcmlwdEVsZW1lbnQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0hUTUxTY3JpcHRFbGVtZW50XCIpKTtcblxudmFyIF9IVE1MU3R5bGVFbGVtZW50ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9IVE1MU3R5bGVFbGVtZW50XCIpKTtcblxudmFyIF9IVE1MSW5wdXRFbGVtZW50ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9IVE1MSW5wdXRFbGVtZW50XCIpKTtcblxudmFyIF9XZWFrTWFwID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi91dGlsL1dlYWtNYXBcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2dldCh0YXJnZXQsIHByb3BlcnR5LCByZWNlaXZlcikgeyBpZiAodHlwZW9mIFJlZmxlY3QgIT09IFwidW5kZWZpbmVkXCIgJiYgUmVmbGVjdC5nZXQpIHsgX2dldCA9IFJlZmxlY3QuZ2V0OyB9IGVsc2UgeyBfZ2V0ID0gZnVuY3Rpb24gX2dldCh0YXJnZXQsIHByb3BlcnR5LCByZWNlaXZlcikgeyB2YXIgYmFzZSA9IF9zdXBlclByb3BCYXNlKHRhcmdldCwgcHJvcGVydHkpOyBpZiAoIWJhc2UpIHJldHVybjsgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJhc2UsIHByb3BlcnR5KTsgaWYgKGRlc2MuZ2V0KSB7IHJldHVybiBkZXNjLmdldC5jYWxsKHJlY2VpdmVyKTsgfSByZXR1cm4gZGVzYy52YWx1ZTsgfTsgfSByZXR1cm4gX2dldCh0YXJnZXQsIHByb3BlcnR5LCByZWNlaXZlciB8fCB0YXJnZXQpOyB9XG5cbmZ1bmN0aW9uIF9zdXBlclByb3BCYXNlKG9iamVjdCwgcHJvcGVydHkpIHsgd2hpbGUgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSkpIHsgb2JqZWN0ID0gX2dldFByb3RvdHlwZU9mKG9iamVjdCk7IGlmIChvYmplY3QgPT09IG51bGwpIGJyZWFrOyB9IHJldHVybiBvYmplY3Q7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5mdW5jdGlvbiBfY3JlYXRlU3VwZXIoRGVyaXZlZCkgeyB2YXIgaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCA9IF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKTsgcmV0dXJuIGZ1bmN0aW9uIF9jcmVhdGVTdXBlckludGVybmFsKCkgeyB2YXIgU3VwZXIgPSBfZ2V0UHJvdG90eXBlT2YoRGVyaXZlZCksIHJlc3VsdDsgaWYgKGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QpIHsgdmFyIE5ld1RhcmdldCA9IF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3RvcjsgcmVzdWx0ID0gUmVmbGVjdC5jb25zdHJ1Y3QoU3VwZXIsIGFyZ3VtZW50cywgTmV3VGFyZ2V0KTsgfSBlbHNlIHsgcmVzdWx0ID0gU3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfSByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgcmVzdWx0KTsgfTsgfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7IHJldHVybiBjYWxsOyB9IHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpOyB9XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikgeyBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkgeyBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7IGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7IGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7IHRyeSB7IERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoRGF0ZSwgW10sIGZ1bmN0aW9uICgpIHt9KSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7IH07IHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIF9odG1sID0gbmV3IF9IVE1MSHRtbEVsZW1lbnRbXCJkZWZhdWx0XCJdKCk7XG5cbnZhciBEb2N1bWVudCA9IGZ1bmN0aW9uIChfTm9kZSkge1xuICBfaW5oZXJpdHMoRG9jdW1lbnQsIF9Ob2RlKTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKERvY3VtZW50KTtcblxuICBfY3JlYXRlQ2xhc3MoRG9jdW1lbnQsIFt7XG4gICAga2V5OiBcImNoYXJhY3RlclNldFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIFwiVVRGLThcIjtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2NyaXB0c1wiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQodGhpcykuc2NyaXB0cy5zbGljZSgwKTtcbiAgICB9XG4gIH1dKTtcblxuICBmdW5jdGlvbiBEb2N1bWVudCgpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRG9jdW1lbnQpO1xuXG4gICAgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJoZWFkXCIsIG5ldyBfSFRNTEhlYWRFbGVtZW50W1wiZGVmYXVsdFwiXShfaHRtbCkpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcImJvZHlcIiwgbmV3IF9IVE1MQm9keUVsZW1lbnRbXCJkZWZhdWx0XCJdKF9odG1sKSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwiZm9udHNcIiwgbmV3IF9Gb250RmFjZVNldFtcImRlZmF1bHRcIl0oKSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwiY29va2llXCIsIFwiXCIpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcImRvY3VtZW50RWxlbWVudFwiLCBfaHRtbCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwicmVhZHlTdGF0ZVwiLCBcImNvbXBsZXRlXCIpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcInZpc2liaWxpdHlTdGF0ZVwiLCBcInZpc2libGVcIik7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwiaGlkZGVuXCIsIGZhbHNlKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJzdHlsZVwiLCB7fSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwibG9jYXRpb25cIiwgd2luZG93LmxvY2F0aW9uKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJvbnRvdWNoc3RhcnRcIiwgbnVsbCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwib250b3VjaG1vdmVcIiwgbnVsbCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwib250b3VjaGVuZFwiLCBudWxsKTtcblxuICAgIF9odG1sLmFwcGVuZENoaWxkKF90aGlzLmhlYWQpO1xuXG4gICAgX2h0bWwuYXBwZW5kQ2hpbGQoX3RoaXMuYm9keSk7XG5cbiAgICBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpKS5zY3JpcHRzID0gW107XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKERvY3VtZW50LCBbe1xuICAgIGtleTogXCJjcmVhdGVFbGVtZW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodGFnTmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiB0YWdOYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICB0YWdOYW1lID0gdGFnTmFtZS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICBpZiAodGFnTmFtZSA9PT0gJ0NBTlZBUycpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBfSFRNTENhbnZhc0VsZW1lbnRbXCJkZWZhdWx0XCJdKCk7XG4gICAgICB9IGVsc2UgaWYgKHRhZ05hbWUgPT09ICdJTUcnKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1hZ2UoKTtcbiAgICAgIH0gZWxzZSBpZiAodGFnTmFtZSA9PT0gJ1ZJREVPJykge1xuICAgICAgICByZXR1cm4gbmV3IF9IVE1MVmlkZW9FbGVtZW50W1wiZGVmYXVsdFwiXSgpO1xuICAgICAgfSBlbHNlIGlmICh0YWdOYW1lID09PSAnU0NSSVBUJykge1xuICAgICAgICByZXR1cm4gbmV3IF9IVE1MU2NyaXB0RWxlbWVudFtcImRlZmF1bHRcIl0oKTtcbiAgICAgIH0gZWxzZSBpZiAodGFnTmFtZSA9PT0gXCJJTlBVVFwiKSB7XG4gICAgICAgIHJldHVybiBuZXcgX0hUTUxJbnB1dEVsZW1lbnRbXCJkZWZhdWx0XCJdKCk7XG4gICAgICB9IGVsc2UgaWYgKHRhZ05hbWUgPT09IFwiQVVESU9cIikge1xuICAgICAgICByZXR1cm4gbmV3IF9BdWRpb1tcImRlZmF1bHRcIl0oKTtcbiAgICAgIH0gZWxzZSBpZiAodGFnTmFtZSA9PT0gXCJTVFlMRVwiKSB7XG4gICAgICAgIHJldHVybiBuZXcgX0hUTUxTdHlsZUVsZW1lbnRbXCJkZWZhdWx0XCJdKCk7XG4gICAgICB9IGVsc2UgaWYgKHRhZ05hbWUgPT09IFwiQVwiKSB7XG4gICAgICAgIHJldHVybiBuZXcgX0hUTUxBbmNob3JFbGVtZW50W1wiZGVmYXVsdFwiXSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IF9IVE1MRWxlbWVudFtcImRlZmF1bHRcIl0odGFnTmFtZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNyZWF0ZUVsZW1lbnROU1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJLCBxdWFsaWZpZWROYW1lLCBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gdGhpcy5jcmVhdGVFbGVtZW50KHF1YWxpZmllZE5hbWUpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjcmVhdGVFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVFdmVudCh0eXBlKSB7XG4gICAgICBpZiAod2luZG93W3R5cGVdKSB7XG4gICAgICAgIHJldHVybiBuZXcgd2luZG93W3R5cGVdKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjcmVhdGVUZXh0Tm9kZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVUZXh0Tm9kZSgpIHtcbiAgICAgIGNvbnNvbGUud2FybihcImRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCkgaXMgbm90IHN1cHBvcnQhXCIpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkaXNwYXRjaEV2ZW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQoKSB7XG4gICAgICBpZiAoX2h0bWwuZGlzcGF0Y2hFdmVudC5hcHBseShfaHRtbCwgYXJndW1lbnRzKSkge1xuICAgICAgICByZXR1cm4gX2dldChfZ2V0UHJvdG90eXBlT2YoRG9jdW1lbnQucHJvdG90eXBlKSwgXCJkaXNwYXRjaEV2ZW50XCIsIHRoaXMpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYXBwZW5kQ2hpbGRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYXBwZW5kQ2hpbGQobm9kZSkge1xuICAgICAgdmFyIG5vZGVOYW1lID0gbm9kZS5ub2RlTmFtZTtcblxuICAgICAgaWYgKG5vZGVOYW1lID09PSBcIlNDUklQVFwiKSB7XG4gICAgICAgIF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQodGhpcykuc2NyaXB0cy5wdXNoKG5vZGUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX2dldChfZ2V0UHJvdG90eXBlT2YoRG9jdW1lbnQucHJvdG90eXBlKSwgXCJhcHBlbmRDaGlsZFwiLCB0aGlzKS5jYWxsKHRoaXMsIG5vZGUpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZW1vdmVDaGlsZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVDaGlsZChub2RlKSB7XG4gICAgICB2YXIgbm9kZU5hbWUgPSBub2RlLm5vZGVOYW1lO1xuXG4gICAgICBpZiAobm9kZU5hbWUgPT09IFwiU0NSSVBUXCIpIHtcbiAgICAgICAgdmFyIHNjcmlwdHMgPSBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KHRoaXMpLnNjcmlwdHM7XG5cbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwLCBsZW5ndGggPSBzY3JpcHRzLmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7ICsraW5kZXgpIHtcbiAgICAgICAgICBpZiAobm9kZSA9PT0gc2NyaXB0c1tpbmRleF0pIHtcbiAgICAgICAgICAgIHNjcmlwdHMuc2xpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfZ2V0KF9nZXRQcm90b3R5cGVPZihEb2N1bWVudC5wcm90b3R5cGUpLCBcInJlbW92ZUNoaWxkXCIsIHRoaXMpLmNhbGwodGhpcywgbm9kZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEVsZW1lbnRCeUlkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEVsZW1lbnRCeUlkKGlkKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgXCJVbmNhdWdodCBUeXBlRXJyb3I6IEZhaWxlZCB0byBleGVjdXRlICdnZXRFbGVtZW50QnlJZCcgb24gJ0RvY3VtZW50JzogMSBhcmd1bWVudCByZXF1aXJlZCwgYnV0IG9ubHkgMCBwcmVzZW50LlwiO1xuICAgICAgfVxuXG4gICAgICB2YXIgcm9vdEVsZW1lbnQgPSB0aGlzLmRvY3VtZW50RWxlbWVudDtcbiAgICAgIHZhciBlbGVtZW50QXJyID0gW10uY29uY2F0KHJvb3RFbGVtZW50LmNoaWxkTm9kZXMpO1xuICAgICAgdmFyIGVsZW1lbnQ7XG5cbiAgICAgIGlmIChpZCA9PT0gXCJjYW52YXNcIiB8fCBpZCA9PT0gXCJnbGNhbnZhc1wiKSB7XG4gICAgICAgIHdoaWxlIChlbGVtZW50ID0gZWxlbWVudEFyci5wb3AoKSkge1xuICAgICAgICAgIGlmIChlbGVtZW50LmlkID09PSBcImNhbnZhc1wiIHx8IGVsZW1lbnQuaWQgPT09IFwiZ2xjYW52YXNcIikge1xuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZWxlbWVudEFyciA9IGVsZW1lbnRBcnIuY29uY2F0KGVsZW1lbnQuY2hpbGROb2Rlcyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdoaWxlIChlbGVtZW50ID0gZWxlbWVudEFyci5wb3AoKSkge1xuICAgICAgICAgIGlmIChlbGVtZW50LmlkID09PSBpZCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZWxlbWVudEFyciA9IGVsZW1lbnRBcnIuY29uY2F0KGVsZW1lbnQuY2hpbGROb2Rlcyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEVsZW1lbnRzQnlDbGFzc05hbWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShuYW1lcykge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IFwiVW5jYXVnaHQgVHlwZUVycm9yOiBGYWlsZWQgdG8gZXhlY3V0ZSAnZ2V0RWxlbWVudHNCeUNsYXNzTmFtZScgb24gJ0RvY3VtZW50JzogMSBhcmd1bWVudCByZXF1aXJlZCwgYnV0IG9ubHkgMCBwcmVzZW50LlwiO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIG5hbWVzICE9PSBcInN0cmluZ1wiICYmIG5hbWVzIGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBuZXcgX05vZGVMaXN0W1wiZGVmYXVsdFwiXSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5kb2N1bWVudEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShuYW1lcyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEVsZW1lbnRzQnlUYWdOYW1lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEVsZW1lbnRzQnlUYWdOYW1lKHRhZ05hbWUpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICB0aHJvdyBcIlVuY2F1Z2h0IFR5cGVFcnJvcjogRmFpbGVkIHRvIGV4ZWN1dGUgJ2dldEVsZW1lbnRzQnlUYWdOYW1lJyBvbiAnRG9jdW1lbnQnOiAxIGFyZ3VtZW50IHJlcXVpcmVkLCBidXQgb25seSAwIHByZXNlbnQuXCI7XG4gICAgICB9XG5cbiAgICAgIHRhZ05hbWUgPSB0YWdOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgICB2YXIgcm9vdEVsZW1lbnQgPSB0aGlzLmRvY3VtZW50RWxlbWVudDtcbiAgICAgIHZhciByZXN1bHQgPSBuZXcgX05vZGVMaXN0W1wiZGVmYXVsdFwiXSgpO1xuXG4gICAgICBzd2l0Y2ggKHRhZ05hbWUpIHtcbiAgICAgICAgY2FzZSBcIkhFQURcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChkb2N1bWVudC5oZWFkKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICBjYXNlIFwiQk9EWVwiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGRvY3VtZW50LmJvZHkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAge1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmNvbmNhdChyb290RWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSh0YWdOYW1lKSk7XG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRFbGVtZW50c0J5TmFtZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRFbGVtZW50c0J5TmFtZShuYW1lKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgXCJVbmNhdWdodCBUeXBlRXJyb3I6IEZhaWxlZCB0byBleGVjdXRlICdnZXRFbGVtZW50c0J5TmFtZScgb24gJ0RvY3VtZW50JzogMSBhcmd1bWVudCByZXF1aXJlZCwgYnV0IG9ubHkgMCBwcmVzZW50LlwiO1xuICAgICAgfVxuXG4gICAgICB2YXIgZWxlbWVudEFyciA9IFtdLmNvbmNhdCh0aGlzLmNoaWxkTm9kZXMpO1xuICAgICAgdmFyIHJlc3VsdCA9IG5ldyBfTm9kZUxpc3RbXCJkZWZhdWx0XCJdKCk7XG4gICAgICB2YXIgZWxlbWVudDtcblxuICAgICAgd2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50QXJyLnBvcCgpKSB7XG4gICAgICAgIGlmIChlbGVtZW50Lm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW1lbnRBcnIgPSBlbGVtZW50QXJyLmNvbmNhdChlbGVtZW50LmNoaWxkTm9kZXMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJxdWVyeVNlbGVjdG9yXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JzKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgXCJVbmNhdWdodCBUeXBlRXJyb3I6IEZhaWxlZCB0byBleGVjdXRlICdxdWVyeVNlbGVjdG9yQWxsJyBvbiAnRG9jdW1lbnQnOiAxIGFyZ3VtZW50IHJlcXVpcmVkLCBidXQgb25seSAwIHByZXNlbnQuXCI7XG4gICAgICB9XG5cbiAgICAgIHZhciBub2RlTGlzdCA9IG5ldyBfTm9kZUxpc3RbXCJkZWZhdWx0XCJdKCk7XG5cbiAgICAgIHN3aXRjaCAoc2VsZWN0b3JzKSB7XG4gICAgICAgIGNhc2UgbnVsbDpcbiAgICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgIGNhc2UgTmFOOlxuICAgICAgICBjYXNlIHRydWU6XG4gICAgICAgIGNhc2UgZmFsc2U6XG4gICAgICAgIGNhc2UgXCJcIjpcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBzZWxlY3RvcnMgIT09IFwic3RyaW5nXCIgJiYgc2VsZWN0b3JzIGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgICAgIHRocm93IFwiVW5jYXVnaHQgRE9NRXhjZXB0aW9uOiBGYWlsZWQgdG8gZXhlY3V0ZSAncXVlcnlTZWxlY3RvckFsbCcgb24gJ0RvY3VtZW50JzogJ1wiICsgc2VsZWN0b3JzICsgXCInIGlzIG5vdCBhIHZhbGlkIHNlbGVjdG9yLlwiO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVnID0gL15bQS1aYS16XSskLztcbiAgICAgIHZhciByZXN1bHQgPSBzZWxlY3RvcnMubWF0Y2gocmVnKTtcblxuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRFbGVtZW50c0J5VGFnTmFtZShzZWxlY3RvcnMpO1xuICAgICAgfVxuXG4gICAgICByZWcgPSAvXlxcLltBLVphLXokX11bQS1aYS16JF8wLTlcXC0gXSokLztcbiAgICAgIHJlc3VsdCA9IHNlbGVjdG9ycy5tYXRjaChyZWcpO1xuXG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHZhciBzZWxlY3RvckFyciA9IHNlbGVjdG9ycy5zcGxpdChcIiBcIik7XG4gICAgICAgIHZhciBzZWxlY3RvciA9IHNlbGVjdG9yQXJyLnNoaWZ0KCk7XG4gICAgICAgIG5vZGVMaXN0ID0gdGhpcy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHNlbGVjdG9yLnN1YnN0cigxKSk7XG4gICAgICAgIHZhciBsZW5ndGggPSBzZWxlY3RvckFyci5sZW5ndGg7XG5cbiAgICAgICAgaWYgKGxlbmd0aCkge1xuICAgICAgICAgIHNlbGVjdG9ycyA9IHNlbGVjdG9yQXJyLmpvaW4oXCIgXCIpO1xuICAgICAgICAgIGxlbmd0aCA9IG5vZGVMaXN0Lmxlbmd0aDtcblxuICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHZhciBzdWJOb2RlTGlzdCA9IG5vZGVMaXN0W2luZGV4XS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9ycyk7XG5cbiAgICAgICAgICAgIGlmIChzdWJOb2RlTGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHN1Yk5vZGVMaXN0WzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlTGlzdFswXTtcbiAgICAgIH1cblxuICAgICAgcmVnID0gL14jW0EtWmEteiRfXVtBLVphLXokXzAtOVxcLV0qJC87XG4gICAgICByZXN1bHQgPSBzZWxlY3RvcnMubWF0Y2gocmVnKTtcblxuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuZ2V0RWxlbWVudEJ5SWQoc2VsZWN0b3JzLnN1YnN0cigxKSk7XG5cbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICBub2RlTGlzdC5wdXNoKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWxlY3RvcnMgPT09IFwiKlwiKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEVsZW1lbnRzQnlUYWdOYW1lKHNlbGVjdG9ycyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBub2RlTGlzdFswXTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicXVlcnlTZWxlY3RvckFsbFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBxdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9ycykge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IFwiVW5jYXVnaHQgVHlwZUVycm9yOiBGYWlsZWQgdG8gZXhlY3V0ZSAncXVlcnlTZWxlY3RvckFsbCcgb24gJ0RvY3VtZW50JzogMSBhcmd1bWVudCByZXF1aXJlZCwgYnV0IG9ubHkgMCBwcmVzZW50LlwiO1xuICAgICAgfVxuXG4gICAgICB2YXIgbm9kZUxpc3QgPSBuZXcgX05vZGVMaXN0W1wiZGVmYXVsdFwiXSgpO1xuXG4gICAgICBzd2l0Y2ggKHNlbGVjdG9ycykge1xuICAgICAgICBjYXNlIG51bGw6XG4gICAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICBjYXNlIE5hTjpcbiAgICAgICAgY2FzZSB0cnVlOlxuICAgICAgICBjYXNlIGZhbHNlOlxuICAgICAgICBjYXNlIFwiXCI6XG4gICAgICAgICAgcmV0dXJuIG5vZGVMaXN0O1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHNlbGVjdG9ycyAhPT0gXCJzdHJpbmdcIiAmJiBzZWxlY3RvcnMgaW5zdGFuY2VvZiBTdHJpbmcpIHtcbiAgICAgICAgdGhyb3cgXCJVbmNhdWdodCBET01FeGNlcHRpb246IEZhaWxlZCB0byBleGVjdXRlICdxdWVyeVNlbGVjdG9yQWxsJyBvbiAnRG9jdW1lbnQnOiAnXCIgKyBzZWxlY3RvcnMgKyBcIicgaXMgbm90IGEgdmFsaWQgc2VsZWN0b3IuXCI7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWcgPSAvXltBLVphLXpdKyQvO1xuICAgICAgdmFyIHJlc3VsdCA9IHNlbGVjdG9ycy5tYXRjaChyZWcpO1xuXG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEVsZW1lbnRzQnlUYWdOYW1lKHNlbGVjdG9ycyk7XG4gICAgICB9XG5cbiAgICAgIHJlZyA9IC9eXFwuW0EtWmEteiRfXVtBLVphLXokXzAtOVxcLV0qJC87XG4gICAgICByZXN1bHQgPSBzZWxlY3RvcnMubWF0Y2gocmVnKTtcblxuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHNlbGVjdG9ycy5zdWJzdHIoMSkpO1xuICAgICAgfVxuXG4gICAgICByZWcgPSAvXiNbQS1aYS16JF9dW0EtWmEteiRfMC05XFwtXSokLztcbiAgICAgIHJlc3VsdCA9IHNlbGVjdG9ycy5tYXRjaChyZWcpO1xuXG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50QnlJZChzZWxlY3RvcnMuc3Vic3RyKDEpKTtcblxuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgIG5vZGVMaXN0LnB1c2goZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHNlbGVjdG9ycyA9PT0gXCIqXCIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoc2VsZWN0b3JzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5vZGVMaXN0O1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBEb2N1bWVudDtcbn0oX05vZGUyW1wiZGVmYXVsdFwiXSk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRG9jdW1lbnQ7XG5cbn0se1wiLi9BdWRpb1wiOjMsXCIuL0ZvbnRGYWNlU2V0XCI6MTIsXCIuL0hUTUxBbmNob3JFbGVtZW50XCI6MTMsXCIuL0hUTUxCb2R5RWxlbWVudFwiOjE1LFwiLi9IVE1MQ2FudmFzRWxlbWVudFwiOjE2LFwiLi9IVE1MRWxlbWVudFwiOjE3LFwiLi9IVE1MSGVhZEVsZW1lbnRcIjoxOCxcIi4vSFRNTEh0bWxFbGVtZW50XCI6MTksXCIuL0hUTUxJbnB1dEVsZW1lbnRcIjoyMSxcIi4vSFRNTFNjcmlwdEVsZW1lbnRcIjoyMyxcIi4vSFRNTFN0eWxlRWxlbWVudFwiOjI0LFwiLi9IVE1MVmlkZW9FbGVtZW50XCI6MjUsXCIuL05vZGVcIjozMCxcIi4vTm9kZUxpc3RcIjozMSxcIi4vdXRpbC9XZWFrTWFwXCI6NTN9XSw4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9Ob2RlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vTm9kZVwiKSk7XG5cbnZhciBfTm9kZUxpc3QgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL05vZGVMaXN0XCIpKTtcblxudmFyIF9ET01Ub2tlbkxpc3QgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0RPTVRva2VuXFx1MjAwQkxpc3RcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5mdW5jdGlvbiBfY3JlYXRlU3VwZXIoRGVyaXZlZCkgeyB2YXIgaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCA9IF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKTsgcmV0dXJuIGZ1bmN0aW9uIF9jcmVhdGVTdXBlckludGVybmFsKCkgeyB2YXIgU3VwZXIgPSBfZ2V0UHJvdG90eXBlT2YoRGVyaXZlZCksIHJlc3VsdDsgaWYgKGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QpIHsgdmFyIE5ld1RhcmdldCA9IF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3RvcjsgcmVzdWx0ID0gUmVmbGVjdC5jb25zdHJ1Y3QoU3VwZXIsIGFyZ3VtZW50cywgTmV3VGFyZ2V0KTsgfSBlbHNlIHsgcmVzdWx0ID0gU3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfSByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgcmVzdWx0KTsgfTsgfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7IHJldHVybiBjYWxsOyB9IHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpOyB9XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikgeyBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkgeyBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7IGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7IGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7IHRyeSB7IERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoRGF0ZSwgW10sIGZ1bmN0aW9uICgpIHt9KSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7IH07IHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIEVsZW1lbnQgPSBmdW5jdGlvbiAoX05vZGUpIHtcbiAgX2luaGVyaXRzKEVsZW1lbnQsIF9Ob2RlKTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKEVsZW1lbnQpO1xuXG4gIGZ1bmN0aW9uIEVsZW1lbnQodGFnTmFtZSkge1xuICAgIHZhciBfdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBFbGVtZW50KTtcblxuICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgdGFnTmFtZSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwiY2xhc3NOYW1lXCIsICcnKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJjaGlsZHJlblwiLCBbXSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwiY2xhc3NMaXN0XCIsIG5ldyBfRE9NVG9rZW5MaXN0W1wiZGVmYXVsdFwiXSgpKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJ2YWx1ZVwiLCAxKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJjb250ZW50XCIsIFwiXCIpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcInNjcm9sbExlZnRcIiwgMCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwic2Nyb2xsVG9wXCIsIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcImNsaWVudExlZnRcIiwgMCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwiY2xpZW50VG9wXCIsIDApO1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEVsZW1lbnQsIFt7XG4gICAga2V5OiBcImdldEJvdW5kaW5nQ2xpZW50UmVjdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRCb3VuZGluZ0NsaWVudFJlY3QoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiAwLFxuICAgICAgICB5OiAwLFxuICAgICAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXG4gICAgICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIGJvdHRvbTogd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICByaWdodDogd2luZG93LmlubmVyV2lkdGhcbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEVsZW1lbnRzQnlUYWdOYW1lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEVsZW1lbnRzQnlUYWdOYW1lKHRhZ05hbWUpIHtcbiAgICAgIHRhZ05hbWUgPSB0YWdOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgICB2YXIgcmVzdWx0ID0gbmV3IF9Ob2RlTGlzdFtcImRlZmF1bHRcIl0oKTtcbiAgICAgIHZhciBjaGlsZE5vZGVzID0gdGhpcy5jaGlsZE5vZGVzO1xuICAgICAgdmFyIGxlbmd0aCA9IGNoaWxkTm9kZXMubGVuZ3RoO1xuXG4gICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gY2hpbGROb2Rlc1tpbmRleF07XG5cbiAgICAgICAgaWYgKGVsZW1lbnQudGFnTmFtZSA9PT0gdGFnTmFtZSB8fCB0YWdOYW1lID09PSBcIipcIikge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmNvbmNhdChlbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lKG5hbWVzKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgXCJVbmNhdWdodCBUeXBlRXJyb3I6IEZhaWxlZCB0byBleGVjdXRlICdnZXRFbGVtZW50c0J5Q2xhc3NOYW1lJyBvbiAnRG9jdW1lbnQnOiAxIGFyZ3VtZW50IHJlcXVpcmVkLCBidXQgb25seSAwIHByZXNlbnQuXCI7XG4gICAgICB9XG5cbiAgICAgIHZhciByZXN1bHQgPSBuZXcgX05vZGVMaXN0W1wiZGVmYXVsdFwiXSgpO1xuXG4gICAgICBpZiAodHlwZW9mIG5hbWVzICE9PSBcInN0cmluZ1wiICYmIG5hbWVzIGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBlbGVtZW50QXJyID0gW10uY29uY2F0KHRoaXMuY2hpbGROb2Rlcyk7XG4gICAgICB2YXIgZWxlbWVudDtcblxuICAgICAgd2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50QXJyLnBvcCgpKSB7XG4gICAgICAgIHZhciBjbGFzc1N0ciA9IGVsZW1lbnRbXCJjbGFzc1wiXTtcblxuICAgICAgICBpZiAoY2xhc3NTdHIpIHtcbiAgICAgICAgICB2YXIgY2xhc3NBcnIgPSBjbGFzc1N0ci5zcGxpdChcIiBcIik7XG4gICAgICAgICAgdmFyIGxlbmd0aCA9IGNsYXNzQXJyLmxlbmd0aDtcblxuICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGlmIChjbGFzc0FycltpbmRleF0gPT09IG5hbWVzKSB7XG4gICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50QXJyID0gZWxlbWVudEFyci5jb25jYXQoZWxlbWVudC5jaGlsZE5vZGVzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicXVlcnlTZWxlY3RvclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBxdWVyeVNlbGVjdG9yKHNlbGVjdG9ycykge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IFwiVW5jYXVnaHQgVHlwZUVycm9yOiBGYWlsZWQgdG8gZXhlY3V0ZSAncXVlcnlTZWxlY3RvckFsbCcgb24gJ0RvY3VtZW50JzogMSBhcmd1bWVudCByZXF1aXJlZCwgYnV0IG9ubHkgMCBwcmVzZW50LlwiO1xuICAgICAgfVxuXG4gICAgICB2YXIgbm9kZUxpc3QgPSBuZXcgX05vZGVMaXN0W1wiZGVmYXVsdFwiXSgpO1xuXG4gICAgICBzd2l0Y2ggKHNlbGVjdG9ycykge1xuICAgICAgICBjYXNlIG51bGw6XG4gICAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICBjYXNlIE5hTjpcbiAgICAgICAgY2FzZSB0cnVlOlxuICAgICAgICBjYXNlIGZhbHNlOlxuICAgICAgICBjYXNlIFwiXCI6XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygc2VsZWN0b3JzICE9PSBcInN0cmluZ1wiICYmIHNlbGVjdG9ycyBpbnN0YW5jZW9mIFN0cmluZykge1xuICAgICAgICB0aHJvdyBcIlVuY2F1Z2h0IERPTUV4Y2VwdGlvbjogRmFpbGVkIHRvIGV4ZWN1dGUgJ3F1ZXJ5U2VsZWN0b3JBbGwnIG9uICdEb2N1bWVudCc6ICdcIiArIHNlbGVjdG9ycyArIFwiJyBpcyBub3QgYSB2YWxpZCBzZWxlY3Rvci5cIjtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlZyA9IC9eW0EtWmEtel0rJC87XG4gICAgICB2YXIgcmVzdWx0ID0gc2VsZWN0b3JzLm1hdGNoKHJlZyk7XG5cbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoc2VsZWN0b3JzKTtcbiAgICAgIH1cblxuICAgICAgcmVnID0gL14uW0EtWmEteiRfXVtBLVphLXokXzAtOVxcLSBdKiQvO1xuICAgICAgcmVzdWx0ID0gc2VsZWN0b3JzLm1hdGNoKHJlZyk7XG5cbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgdmFyIHNlbGVjdG9yQXJyID0gc2VsZWN0b3JzLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgdmFyIHNlbGVjdG9yID0gc2VsZWN0b3JBcnIuc2hpZnQoKTtcbiAgICAgICAgbm9kZUxpc3QgPSB0aGlzLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoc2VsZWN0b3Iuc3Vic3RyKDEpKTtcbiAgICAgICAgdmFyIGxlbmd0aCA9IHNlbGVjdG9yQXJyLmxlbmd0aDtcblxuICAgICAgICBpZiAobGVuZ3RoKSB7XG4gICAgICAgICAgc2VsZWN0b3JzID0gc2VsZWN0b3JBcnIuam9pbihcIiBcIik7XG4gICAgICAgICAgbGVuZ3RoID0gbm9kZUxpc3QubGVuZ3RoO1xuXG4gICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIHN1Yk5vZGVMaXN0ID0gbm9kZUxpc3RbaW5kZXhdLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JzKTtcblxuICAgICAgICAgICAgaWYgKHN1Yk5vZGVMaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICByZXR1cm4gc3ViTm9kZUxpc3RbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vZGVMaXN0WzBdO1xuICAgICAgfVxuXG4gICAgICByZWcgPSAvXiNbQS1aYS16JF9dW0EtWmEteiRfMC05XFwtXSokLztcbiAgICAgIHJlc3VsdCA9IHNlbGVjdG9ycy5tYXRjaChyZWcpO1xuXG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50QnlJZChzZWxlY3RvcnMuc3Vic3RyKDEpKTtcblxuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgIG5vZGVMaXN0LnB1c2goZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHNlbGVjdG9ycyA9PT0gXCIqXCIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoc2VsZWN0b3JzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5vZGVMaXN0WzBdO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhZGRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkKCkge31cbiAgfSwge1xuICAgIGtleTogXCJyZXF1ZXN0RnVsbHNjcmVlblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXF1ZXN0RnVsbHNjcmVlbigpIHt9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlQXR0cmlidXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSkge1xuICAgICAgaWYgKGF0dHJOYW1lID09PSBcInN0eWxlXCIpIHtcbiAgICAgICAgZm9yICh2YXIgc3R5bGVOYW1lIGluIHRoaXNbXCJzdHlsZVwiXSkge1xuICAgICAgICAgIHRoaXNbXCJzdHlsZVwiXVtzdHlsZU5hbWVdID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1thdHRyTmFtZV0gPSBcIlwiO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzZXRBdHRyaWJ1dGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKSB7XG4gICAgICBpZiAobmFtZSA9PT0gXCJzdHlsZVwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gXCJ1bmRlZmluZWRcIiB8fCB2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09IFwiXCIpIHtcbiAgICAgICAgICBmb3IgKHZhciBzdHlsZU5hbWUgaW4gdGhpc1tcInN0eWxlXCJdKSB7XG4gICAgICAgICAgICB0aGlzW1wic3R5bGVcIl1bc3R5bGVOYW1lXSA9IFwiXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxzKi9nLCBcIlwiKTtcbiAgICAgICAgICB2YXIgdmFsdWVBcnJheSA9IHZhbHVlLnNwbGl0KFwiO1wiKTtcblxuICAgICAgICAgIGZvciAodmFyIGluZGV4IGluIHZhbHVlQXJyYXkpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZUFycmF5W2luZGV4XSAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgIHZhciB2YWx1ZVRlbXAgPSB2YWx1ZUFycmF5W2luZGV4XS5zcGxpdChcIjpcIik7XG4gICAgICAgICAgICAgIHRoaXNbXCJzdHlsZVwiXVt2YWx1ZVRlbXBbMF1dID0gdmFsdWVUZW1wWzFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1tuYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRBdHRyaWJ1dGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0QXR0cmlidXRlKG5hbWUpIHtcbiAgICAgIHZhciBhdHRyaWJ1dGVWYWx1ZSA9IG51bGw7XG5cbiAgICAgIGlmIChuYW1lID09IFwic3R5bGVcIikge1xuICAgICAgICBhdHRyaWJ1dGVWYWx1ZSA9IEpTT04uc3RyaW5naWZ5KHRoaXNbXCJzdHlsZVwiXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdHRyaWJ1dGVWYWx1ZSA9IHRoaXNbbmFtZV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhdHRyaWJ1dGVWYWx1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2V0QXR0cmlidXRlTlNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0QXR0cmlidXRlTlMobnMsIG5hbWUsIHZhbHVlKSB7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImZvY3VzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZvY3VzKCkge31cbiAgfSwge1xuICAgIGtleTogXCJibHVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGJsdXIoKSB7fVxuICB9LCB7XG4gICAga2V5OiBcImxhc3RDaGlsZFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgdmFyIGxhc3RDaGlsZCA9IHRoaXMuY2hpbGROb2Rlc1t0aGlzLmNoaWxkTm9kZXMubGVuZ3RoIC0gMV07XG4gICAgICByZXR1cm4gbGFzdENoaWxkID8gbGFzdENoaWxkIDogdGhpcy5pbm5lckhUTUwgPyBuZXcgSFRNTEVsZW1lbnQoKSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZmlyc3RDaGlsZFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgdmFyIGNoaWxkID0gdGhpcy5jaGlsZE5vZGVzWzBdO1xuICAgICAgcmV0dXJuIGNoaWxkID8gY2hpbGQgOiB0aGlzLmlubmVySFRNTCA/IG5ldyBIVE1MRWxlbWVudCgpIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJmaXJzdEVsZW1lbnRDaGlsZFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgdmFyIGNoaWxkID0gdGhpcy5jaGlsZE5vZGVzWzBdO1xuICAgICAgcmV0dXJuIGNoaWxkID8gY2hpbGQgOiB0aGlzLmlubmVySFRNTCA/IG5ldyBIVE1MRWxlbWVudCgpIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjbGllbnRIZWlnaHRcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHZhciBzdHlsZSA9IHRoaXMuc3R5bGUgfHwge307XG4gICAgICByZXR1cm4gcGFyc2VJbnQoc3R5bGUuZm9udFNpemUgfHwgXCIwXCIpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0YWdOYW1lXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5ub2RlTmFtZTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gRWxlbWVudDtcbn0oX05vZGUyW1wiZGVmYXVsdFwiXSk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRWxlbWVudDtcblxufSx7XCIuL0RPTVRva2Vu4oCLTGlzdFwiOjUsXCIuL05vZGVcIjozMCxcIi4vTm9kZUxpc3RcIjozMX1dLDk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgRXZlbnQgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEV2ZW50KHR5cGUsIGV2ZW50SW5pdCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBFdmVudCk7XG5cbiAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICB0aGlzLl90YXJnZXQgPSBudWxsO1xuICAgIHRoaXMuX2V2ZW50UGhhc2UgPSAyO1xuICAgIHRoaXMuX2N1cnJlbnRUYXJnZXQgPSBudWxsO1xuICAgIHRoaXMuX2NhbmNlbGVkID0gZmFsc2U7XG4gICAgdGhpcy5fc3RvcHBlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3Bhc3NpdmVMaXN0ZW5lciA9IG51bGw7XG4gICAgdGhpcy5fdGltZVN0YW1wID0gRGF0ZS5ub3coKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhFdmVudCwgW3tcbiAgICBrZXk6IFwiY29tcG9zZWRQYXRoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvc2VkUGF0aCgpIHtcbiAgICAgIHZhciBjdXJyZW50VGFyZ2V0ID0gdGhpcy5fY3VycmVudFRhcmdldDtcblxuICAgICAgaWYgKGN1cnJlbnRUYXJnZXQgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gW2N1cnJlbnRUYXJnZXRdO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzdG9wUHJvcGFnYXRpb25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcFByb3BhZ2F0aW9uKCkge31cbiAgfSwge1xuICAgIGtleTogXCJzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCkge1xuICAgICAgdGhpcy5fc3RvcHBlZCA9IHRydWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInByZXZlbnREZWZhdWx0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0KCkge1xuICAgICAgaWYgKHRoaXMuX3Bhc3NpdmVMaXN0ZW5lciAhPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJFdmVudCNwcmV2ZW50RGVmYXVsdCgpIHdhcyBjYWxsZWQgZnJvbSBhIHBhc3NpdmUgbGlzdGVuZXI6XCIsIHRoaXMuX3Bhc3NpdmVMaXN0ZW5lcik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmNhbmNlbGFibGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jYW5jZWxlZCA9IHRydWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInR5cGVcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl90eXBlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0YXJnZXRcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl90YXJnZXQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImN1cnJlbnRUYXJnZXRcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50VGFyZ2V0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpc1RydXN0ZWRcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidGltZVN0YW1wXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdGltZVN0YW1wO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLnR5cGUuaW5kZXhPZihcInRvdWNoXCIpKSB7XG4gICAgICAgIHRoaXMuX3RpbWVTdGFtcCA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJldmVudFBoYXNlXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZXZlbnRQaGFzZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYnViYmxlc1wiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjYW5jZWxhYmxlXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGVmYXVsdFByZXZlbnRlZFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NhbmNlbGVkO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjb21wb3NlZFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBFdmVudDtcbn0oKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBFdmVudDtcbkV2ZW50Lk5PTkUgPSAwO1xuRXZlbnQuQ0FQVFVSSU5HX1BIQVNFID0gMTtcbkV2ZW50LkFUX1RBUkdFVCA9IDI7XG5FdmVudC5CVUJCTElOR19QSEFTRSA9IDM7XG5cbn0se31dLDEwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfVG91Y2hFdmVudCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vVG91Y2hFdmVudFwiKSk7XG5cbnZhciBfV2Vha01hcCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vdXRpbC9XZWFrTWFwXCIpKTtcblxudmFyIF9EZXZpY2VNb3Rpb25FdmVudCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vRGV2aWNlTW90aW9uRXZlbnRcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgX2xpc3RlbmVyU3RhdCA9IHt9O1xuXG52YXIgX29uVG91Y2hTdGFydCA9IGZ1bmN0aW9uIF9vblRvdWNoU3RhcnQoZSkge1xuICB2YXIgZXZlbnQgPSBuZXcgX1RvdWNoRXZlbnRbXCJkZWZhdWx0XCJdKFwidG91Y2hzdGFydFwiKTtcbiAgd2luZG93LmRpc3BhdGNoRXZlbnQoT2JqZWN0LmFzc2lnbihldmVudCwgZSkpO1xufTtcblxudmFyIF9vblRvdWNoTW92ZSA9IGZ1bmN0aW9uIF9vblRvdWNoTW92ZShlKSB7XG4gIHZhciBldmVudCA9IG5ldyBfVG91Y2hFdmVudFtcImRlZmF1bHRcIl0oXCJ0b3VjaG1vdmVcIik7XG4gIHdpbmRvdy5kaXNwYXRjaEV2ZW50KE9iamVjdC5hc3NpZ24oZXZlbnQsIGUpKTtcbn07XG5cbnZhciBfb25Ub3VjaENhbmNlbCA9IGZ1bmN0aW9uIF9vblRvdWNoQ2FuY2VsKGUpIHtcbiAgdmFyIGV2ZW50ID0gbmV3IF9Ub3VjaEV2ZW50W1wiZGVmYXVsdFwiXShcInRvdWNoY2FuY2VsXCIpO1xuICB3aW5kb3cuZGlzcGF0Y2hFdmVudChPYmplY3QuYXNzaWduKGV2ZW50LCBlKSk7XG59O1xuXG52YXIgX29uVG91Y2hFbmQgPSBmdW5jdGlvbiBfb25Ub3VjaEVuZChlKSB7XG4gIHZhciBldmVudCA9IG5ldyBfVG91Y2hFdmVudFtcImRlZmF1bHRcIl0oXCJ0b3VjaGVuZFwiKTtcbiAgd2luZG93LmRpc3BhdGNoRXZlbnQoT2JqZWN0LmFzc2lnbihldmVudCwgZSkpO1xufTtcblxudmFyIF9zeXN0ZW1JbmZvID0gcmFsLmdldFN5c3RlbUluZm9TeW5jKCk7XG5cbnZhciBfaXNBbmRyb2lkID0gX3N5c3RlbUluZm8ucGxhdGZvcm0udG9Mb3dlckNhc2UoKSA9PT0gXCJhbmRyb2lkXCI7XG5cbnZhciBfYWxwaGEgPSAwLjg7XG52YXIgX2dyYXZpdHkgPSBbMCwgMCwgMF07XG5cbnZhciBfb25BY2NlbGVyb21ldGVyQ2hhbmdlID0gZnVuY3Rpb24gX29uQWNjZWxlcm9tZXRlckNoYW5nZShlKSB7XG4gIGlmIChfaXNBbmRyb2lkKSB7XG4gICAgZS54ICo9IC0xMDtcbiAgICBlLnkgKj0gLTEwO1xuICAgIGUueiAqPSAtMTA7XG4gIH0gZWxzZSB7XG4gICAgZS54ICo9IDEwO1xuICAgIGUueSAqPSAxMDtcbiAgICBlLnogKj0gMTA7XG4gIH1cblxuICBfZ3Jhdml0eVswXSA9IF9hbHBoYSAqIF9ncmF2aXR5WzBdICsgKDEgLSBfYWxwaGEpICogZS54O1xuICBfZ3Jhdml0eVsxXSA9IF9hbHBoYSAqIF9ncmF2aXR5WzFdICsgKDEgLSBfYWxwaGEpICogZS55O1xuICBfZ3Jhdml0eVsyXSA9IF9hbHBoYSAqIF9ncmF2aXR5WzJdICsgKDEgLSBfYWxwaGEpICogZS56O1xuICB2YXIgZXZlbnQgPSBuZXcgX0RldmljZU1vdGlvbkV2ZW50W1wiZGVmYXVsdFwiXSh7XG4gICAgYWNjZWxlcmF0aW9uOiB7XG4gICAgICB4OiBlLnggLSBfZ3Jhdml0eVswXSxcbiAgICAgIHk6IGUueSAtIF9ncmF2aXR5WzFdLFxuICAgICAgejogZS56IC0gX2dyYXZpdHlbMl1cbiAgICB9LFxuICAgIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHk6IHtcbiAgICAgIHg6IGUueCxcbiAgICAgIHk6IGUueSxcbiAgICAgIHo6IGUuelxuICAgIH1cbiAgfSk7XG4gIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn07XG5cbnZhciBFdmVudFRhcmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRXZlbnRUYXJnZXQoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEV2ZW50VGFyZ2V0KTtcblxuICAgIF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5zZXQodGhpcywge30pO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEV2ZW50VGFyZ2V0LCBbe1xuICAgIGtleTogXCJhZGRFdmVudExpc3RlbmVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcblxuICAgICAgdmFyIHByaXZhdGVUaGlzID0gX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldCh0aGlzKTtcblxuICAgICAgaWYgKCFwcml2YXRlVGhpcykge1xuICAgICAgICBfV2Vha01hcFtcImRlZmF1bHRcIl0uc2V0KHRoaXMsIHByaXZhdGVUaGlzID0ge30pO1xuICAgICAgfVxuXG4gICAgICB2YXIgZXZlbnRzID0gX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldChwcml2YXRlVGhpcyk7XG5cbiAgICAgIGlmICghZXZlbnRzKSB7XG4gICAgICAgIF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5zZXQocHJpdmF0ZVRoaXMsIGV2ZW50cyA9IHt9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFldmVudHNbdHlwZV0pIHtcbiAgICAgICAgZXZlbnRzW3R5cGVdID0gW107XG4gICAgICB9XG5cbiAgICAgIHZhciBsaXN0ZW5lckFycmF5ID0gZXZlbnRzW3R5cGVdO1xuICAgICAgdmFyIGxlbmd0aCA9IGxpc3RlbmVyQXJyYXkubGVuZ3RoO1xuXG4gICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICAgIGlmIChsaXN0ZW5lckFycmF5W2luZGV4XSA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGlzdGVuZXJBcnJheS5wdXNoKGxpc3RlbmVyKTtcblxuICAgICAgaWYgKF9saXN0ZW5lclN0YXRbdHlwZV0pIHtcbiAgICAgICAgKytfbGlzdGVuZXJTdGF0W3R5cGVdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2xpc3RlbmVyU3RhdFt0eXBlXSA9IDE7XG5cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgY2FzZSBcInRvdWNoc3RhcnRcIjpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcmFsLm9uVG91Y2hTdGFydChfb25Ub3VjaFN0YXJ0KTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlIFwidG91Y2htb3ZlXCI6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJhbC5vblRvdWNoTW92ZShfb25Ub3VjaE1vdmUpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgXCJ0b3VjaGNhbmNlbFwiOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICByYWwub25Ub3VjaENhbmNlbChfb25Ub3VjaENhbmNlbCk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgY2FzZSBcInRvdWNoZW5kXCI6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJhbC5vblRvdWNoRW5kKF9vblRvdWNoRW5kKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlIFwiZGV2aWNlbW90aW9uXCI6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJhbC5vbkFjY2VsZXJvbWV0ZXJDaGFuZ2UoX29uQWNjZWxlcm9tZXRlckNoYW5nZSk7XG4gICAgICAgICAgICAgIHJhbC5kZXZpY2Uuc2V0TW90aW9uRW5hYmxlZCh0cnVlKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuY2FwdHVyZSkge31cblxuICAgICAgaWYgKG9wdGlvbnMub25jZSkge31cblxuICAgICAgaWYgKG9wdGlvbnMucGFzc2l2ZSkge31cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICB2YXIgcHJpdmF0ZVRoaXMgPSBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KHRoaXMpO1xuXG4gICAgICB2YXIgZXZlbnRzO1xuXG4gICAgICBpZiAocHJpdmF0ZVRoaXMpIHtcbiAgICAgICAgZXZlbnRzID0gX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldChwcml2YXRlVGhpcyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudHMpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IGV2ZW50c1t0eXBlXTtcblxuICAgICAgICBpZiAobGlzdGVuZXJzICYmIGxpc3RlbmVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IGxpc3RlbmVycy5sZW5ndGg7IGktLTsgaSA+IDApIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnNbaV0gPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XG5cbiAgICAgICAgICAgICAgaWYgKC0tX2xpc3RlbmVyU3RhdFt0eXBlXSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgICAgY2FzZSBcInRvdWNoc3RhcnRcIjpcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIHJhbC5vZmZUb3VjaFN0YXJ0KF9vblRvdWNoU3RhcnQpO1xuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgIGNhc2UgXCJ0b3VjaG1vdmVcIjpcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIHJhbC5vZmZUb3VjaE1vdmUoX29uVG91Y2hNb3ZlKTtcbiAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICBjYXNlIFwidG91Y2hjYW5jZWxcIjpcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIHJhbC5vZmZUb3VjaENhbmNlbChfb25Ub3VjaENhbmNlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgY2FzZSBcInRvdWNoZW5kXCI6XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICByYWwub2ZmVG91Y2hFbmQoX29uVG91Y2hFbmQpO1xuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgIGNhc2UgXCJkZXZpY2Vtb3Rpb25cIjpcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIHJhbC5vZmZBY2NlbGVyb21ldGVyQ2hhbmdlKF9vbkFjY2VsZXJvbWV0ZXJDaGFuZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgIHJhbC5kZXZpY2Uuc2V0TW90aW9uRW5hYmxlZChmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGlzcGF0Y2hFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNwYXRjaEV2ZW50KCkge1xuICAgICAgdmFyIGV2ZW50ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcbiAgICAgIGV2ZW50Ll90YXJnZXQgPSBldmVudC5fY3VycmVudFRhcmdldCA9IHRoaXM7XG5cbiAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIF9Ub3VjaEV2ZW50W1wiZGVmYXVsdFwiXSkge1xuICAgICAgICB2YXIgdG91Y2hlQXJyYXkgPSBldmVudC50b3VjaGVzO1xuICAgICAgICB2YXIgbGVuZ3RoID0gdG91Y2hlQXJyYXkubGVuZ3RoO1xuXG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7ICsraW5kZXgpIHtcbiAgICAgICAgICB0b3VjaGVBcnJheVtpbmRleF0udGFyZ2V0ID0gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRvdWNoZUFycmF5ID0gZXZlbnQuY2hhbmdlZFRvdWNoZXM7XG4gICAgICAgIGxlbmd0aCA9IHRvdWNoZUFycmF5Lmxlbmd0aDtcblxuICAgICAgICBmb3IgKHZhciBfaW5kZXggPSAwOyBfaW5kZXggPCBsZW5ndGg7ICsrX2luZGV4KSB7XG4gICAgICAgICAgdG91Y2hlQXJyYXlbX2luZGV4XS50YXJnZXQgPSB0aGlzO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBjYWxsYmFjayA9IHRoaXNbXCJvblwiICsgZXZlbnQudHlwZV07XG5cbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICAgIH1cblxuICAgICAgdmFyIHByaXZhdGVUaGlzID0gX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldCh0aGlzKTtcblxuICAgICAgdmFyIGV2ZW50cztcblxuICAgICAgaWYgKHByaXZhdGVUaGlzKSB7XG4gICAgICAgIGV2ZW50cyA9IF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQocHJpdmF0ZVRoaXMpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXZlbnRzKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSBldmVudHNbZXZlbnQudHlwZV07XG5cbiAgICAgICAgaWYgKGxpc3RlbmVycykge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnNbaV0uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGV2ZW50Ll90YXJnZXQgPSBldmVudC5fY3VycmVudFRhcmdldCA9IG51bGw7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gRXZlbnRUYXJnZXQ7XG59KCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRXZlbnRUYXJnZXQ7XG5cbn0se1wiLi9EZXZpY2VNb3Rpb25FdmVudFwiOjYsXCIuL1RvdWNoRXZlbnRcIjozMyxcIi4vdXRpbC9XZWFrTWFwXCI6NTN9XSwxMTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF9XZWFrTWFwID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi91dGlsL1dlYWtNYXBcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgRm9udEZhY2UgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEZvbnRGYWNlKGZhbWlseSwgc291cmNlLCBkZXNjcmlwdG9ycykge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBGb250RmFjZSk7XG5cbiAgICB0aGlzLmZhbWlseSA9IGZhbWlseTtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLmRlc2NyaXB0b3JzID0gZGVzY3JpcHRvcnM7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBfc2VsZlByaXZhdGUgPSB7XG4gICAgICBzdGF0dXM6IFwidW5sb2FkZWRcIixcbiAgICAgIF9zdGF0dXM6IFwidW5sb2FkZWRcIixcbiAgICAgIGxvYWQ6IGZ1bmN0aW9uIGxvYWQoKSB7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gXCJsb2FkaW5nXCI7XG4gICAgICAgIHZhciBzb3VyY2U7XG5cbiAgICAgICAgaWYgKHNlbGYuc291cmNlLm1hdGNoKC91cmxcXChcXHMqJ1xccyooLio/KVxccyonXFxzKlxcKS8pKSB7XG4gICAgICAgICAgc291cmNlID0gc2VsZi5zb3VyY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc291cmNlID0gXCJ1cmwoJ1wiICsgc2VsZi5zb3VyY2UgKyBcIicpXCI7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmFtaWx5ID0gcmFsLmxvYWRGb250KHNlbGYuZmFtaWx5LCBzb3VyY2UpO1xuXG4gICAgICAgIGlmIChmYW1pbHkpIHtcbiAgICAgICAgICB0aGlzLl9zdGF0dXMgPSBcImxvYWRlZFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3N0YXR1cyA9IFwiZXJyb3JcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBzdGF0dXMgPSBfc2VsZlByaXZhdGUuc3RhdHVzID0gX3NlbGZQcml2YXRlLl9zdGF0dXM7XG5cbiAgICAgICAgICBpZiAoc3RhdHVzID09PSBcImxvYWRlZFwiKSB7XG4gICAgICAgICAgICBfc2VsZlByaXZhdGUubG9hZFJlc29sdmUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3NlbGZQcml2YXRlLmxvYWRSZWplY3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfV2Vha01hcFtcImRlZmF1bHRcIl0uc2V0KHRoaXMsIF9zZWxmUHJpdmF0ZSk7XG5cbiAgICBfc2VsZlByaXZhdGUubG9hZGVkID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgX3NlbGZQcml2YXRlLmxvYWRSZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIF9zZWxmUHJpdmF0ZS5sb2FkUmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEZvbnRGYWNlLCBbe1xuICAgIGtleTogXCJsb2FkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxvYWQoKSB7XG4gICAgICBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KHRoaXMpLmxvYWQoKTtcblxuICAgICAgcmV0dXJuIF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQodGhpcykubG9hZGVkO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzdGF0dXNcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KHRoaXMpLnN0YXR1cztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibG9hZGVkXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldCh0aGlzKS5sb2FkZWQ7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEZvbnRGYWNlO1xufSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZvbnRGYWNlO1xuXG59LHtcIi4vdXRpbC9XZWFrTWFwXCI6NTN9XSwxMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfRXZlbnRUYXJnZXQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9FdmVudFRhcmdldFwiKSk7XG5cbnZhciBfRXZlbnQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0V2ZW50XCIpKTtcblxudmFyIF9XZWFrTWFwID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi91dGlsL1dlYWtNYXBcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5mdW5jdGlvbiBfY3JlYXRlU3VwZXIoRGVyaXZlZCkgeyB2YXIgaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCA9IF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKTsgcmV0dXJuIGZ1bmN0aW9uIF9jcmVhdGVTdXBlckludGVybmFsKCkgeyB2YXIgU3VwZXIgPSBfZ2V0UHJvdG90eXBlT2YoRGVyaXZlZCksIHJlc3VsdDsgaWYgKGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QpIHsgdmFyIE5ld1RhcmdldCA9IF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3RvcjsgcmVzdWx0ID0gUmVmbGVjdC5jb25zdHJ1Y3QoU3VwZXIsIGFyZ3VtZW50cywgTmV3VGFyZ2V0KTsgfSBlbHNlIHsgcmVzdWx0ID0gU3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfSByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgcmVzdWx0KTsgfTsgfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7IHJldHVybiBjYWxsOyB9IHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpOyB9XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikgeyBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkgeyBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7IGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7IGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7IHRyeSB7IERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoRGF0ZSwgW10sIGZ1bmN0aW9uICgpIHt9KSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7IH07IHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7IH1cblxudmFyIEZvbnRGYWNlU2V0ID0gZnVuY3Rpb24gKF9FdmVudFRhcmdldCkge1xuICBfaW5oZXJpdHMoRm9udEZhY2VTZXQsIF9FdmVudFRhcmdldCk7XG5cbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihGb250RmFjZVNldCk7XG5cbiAgZnVuY3Rpb24gRm9udEZhY2VTZXQoKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEZvbnRGYWNlU2V0KTtcblxuICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcyk7XG5cbiAgICB2YXIgc2VsZiA9IF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpO1xuXG4gICAgX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldChfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSkuc3RhdHVzID0gXCJsb2FkZWRcIjtcbiAgICBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpKS5yZWFkeSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQoc2VsZikucmVhZHlSZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQoc2VsZikucmVhZHlSZWplY3QgPSByZWplY3Q7XG4gICAgfSk7XG4gICAgX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldChfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSkuZm9udEZhY2VTZXQgPSBbXTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoRm9udEZhY2VTZXQsIFt7XG4gICAga2V5OiBcImFkZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGQoZm9udEZhY2UpIHtcbiAgICAgIF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQodGhpcykuZm9udEZhY2VTZXQucHVzaChmb250RmFjZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNoZWNrXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNoZWNrKCkge1xuICAgICAgY29uc29sZS53YXJuKFwiRm9udEZhY2VTZXQuY2hlY2soKSBub3QgaW1wbGVtZW50c1wiKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2xlYXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJGb250RmFjZVNldC5jbGVhcigpIG5vdCBpbXBsZW1lbnRzXCIpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkZWxldGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2RlbGV0ZSgpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIkZvbnRGYWNlU2V0LmRlbGV0ZSgpIG5vdCBpbXBsZW1lbnRzXCIpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJsb2FkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxvYWQoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KHRoaXMpLnN0YXR1cyA9IFwibG9hZGluZ1wiO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBfRXZlbnRbXCJkZWZhdWx0XCJdKCdsb2FkaW5nJykpO1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgdmFyIGZvbnRGYWNlU2V0ID0gX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldChzZWxmKS5mb250RmFjZVNldDtcblxuICAgICAgICBpZiAoZm9udEZhY2VTZXQpIHtcbiAgICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBmb250RmFjZVNldCkge1xuICAgICAgICAgICAgdmFyIGZvbnRGYWNlID0gZm9udEZhY2VTZXRbaW5kZXhdO1xuXG4gICAgICAgICAgICB2YXIgc3RhdHVzID0gX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldChmb250RmFjZSkuc3RhdHVzO1xuXG4gICAgICAgICAgICBpZiAoc3RhdHVzID09PSBcInVubG9hZGVkXCIgfHwgc3RhdHVzID09PSBcImVycm9yXCIpIHtcbiAgICAgICAgICAgICAgZm9udEZhY2UubG9hZCgpO1xuXG4gICAgICAgICAgICAgIGlmIChfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KGZvbnRGYWNlKS5fc3RhdHVzICE9PSBcImxvYWRlZFwiKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KHNlbGYpLnN0YXR1cyA9IFwibG9hZGVkXCI7XG5cbiAgICAgICAgICBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KHNlbGYpLnJlYWR5UmVzb2x2ZShbXS5jb25jYXQoX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldChzZWxmKS5mb250RmFjZVNldCkpO1xuXG4gICAgICAgICAgcmVzb2x2ZShbXS5jb25jYXQoX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldChzZWxmKS5mb250RmFjZVNldCkpO1xuICAgICAgICAgIHNlbGYuZGlzcGF0Y2hFdmVudChuZXcgX0V2ZW50W1wiZGVmYXVsdFwiXSgnbG9hZGluZ2RvbmUnKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldChzZWxmKS5zdGF0dXMgPSBcImxvYWRlZFwiO1xuXG4gICAgICAgIF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQoc2VsZikucmVhZHlSZWplY3QoKTtcblxuICAgICAgICByZWplY3QoKTtcbiAgICAgICAgc2VsZi5kaXNwYXRjaEV2ZW50KG5ldyBfRXZlbnRbXCJkZWZhdWx0XCJdKCdsb2FkaW5nZXJyb3InKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic3RhdHVzXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldCh0aGlzKS5zdGF0dXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlYWR5XCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldCh0aGlzKS5yZWFkeTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gRm9udEZhY2VTZXQ7XG59KF9FdmVudFRhcmdldDJbXCJkZWZhdWx0XCJdKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBGb250RmFjZVNldDtcblxufSx7XCIuL0V2ZW50XCI6OSxcIi4vRXZlbnRUYXJnZXRcIjoxMCxcIi4vdXRpbC9XZWFrTWFwXCI6NTN9XSwxMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfSFRNTEVsZW1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9IVE1MRWxlbWVudFwiKSk7XG5cbnZhciBfV2Vha01hcCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vdXRpbC9XZWFrTWFwXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuZnVuY3Rpb24gX2NyZWF0ZVN1cGVyKERlcml2ZWQpIHsgdmFyIGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QgPSBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCk7IHJldHVybiBmdW5jdGlvbiBfY3JlYXRlU3VwZXJJbnRlcm5hbCgpIHsgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLCByZXN1bHQ7IGlmIChoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KSB7IHZhciBOZXdUYXJnZXQgPSBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3I7IHJlc3VsdCA9IFJlZmxlY3QuY29uc3RydWN0KFN1cGVyLCBhcmd1bWVudHMsIE5ld1RhcmdldCk7IH0gZWxzZSB7IHJlc3VsdCA9IFN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH0gcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIHJlc3VsdCk7IH07IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbnZhciBIVE1MQW5jaG9yRWxlbWVudCA9IGZ1bmN0aW9uIChfSFRNTEVsZW1lbnQpIHtcbiAgX2luaGVyaXRzKEhUTUxBbmNob3JFbGVtZW50LCBfSFRNTEVsZW1lbnQpO1xuXG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoSFRNTEFuY2hvckVsZW1lbnQpO1xuXG4gIGZ1bmN0aW9uIEhUTUxBbmNob3JFbGVtZW50KCkge1xuICAgIHZhciBfdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBIVE1MQW5jaG9yRWxlbWVudCk7XG5cbiAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIFwiQVwiKTtcbiAgICBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpKS5wcm90b2NvbCA9IFwiOlwiO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhIVE1MQW5jaG9yRWxlbWVudCwgW3tcbiAgICBrZXk6IFwicHJvdG9jb2xcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KHRoaXMpLnByb3RvY29sO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBIVE1MQW5jaG9yRWxlbWVudDtcbn0oX0hUTUxFbGVtZW50MltcImRlZmF1bHRcIl0pO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEhUTUxBbmNob3JFbGVtZW50O1xuXG59LHtcIi4vSFRNTEVsZW1lbnRcIjoxNyxcIi4vdXRpbC9XZWFrTWFwXCI6NTN9XSwxNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfSFRNTE1lZGlhRWxlbWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0hUTUxNZWRpYUVsZW1lbnRcIikpO1xuXG52YXIgX0V2ZW50ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9FdmVudFwiKSk7XG5cbnZhciBfV2Vha01hcCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vdXRpbC9XZWFrTWFwXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gc2V0KHRhcmdldCwgcHJvcGVydHksIHZhbHVlLCByZWNlaXZlcikgeyBpZiAodHlwZW9mIFJlZmxlY3QgIT09IFwidW5kZWZpbmVkXCIgJiYgUmVmbGVjdC5zZXQpIHsgc2V0ID0gUmVmbGVjdC5zZXQ7IH0gZWxzZSB7IHNldCA9IGZ1bmN0aW9uIHNldCh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSwgcmVjZWl2ZXIpIHsgdmFyIGJhc2UgPSBfc3VwZXJQcm9wQmFzZSh0YXJnZXQsIHByb3BlcnR5KTsgdmFyIGRlc2M7IGlmIChiYXNlKSB7IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJhc2UsIHByb3BlcnR5KTsgaWYgKGRlc2Muc2V0KSB7IGRlc2Muc2V0LmNhbGwocmVjZWl2ZXIsIHZhbHVlKTsgcmV0dXJuIHRydWU7IH0gZWxzZSBpZiAoIWRlc2Mud3JpdGFibGUpIHsgcmV0dXJuIGZhbHNlOyB9IH0gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocmVjZWl2ZXIsIHByb3BlcnR5KTsgaWYgKGRlc2MpIHsgaWYgKCFkZXNjLndyaXRhYmxlKSB7IHJldHVybiBmYWxzZTsgfSBkZXNjLnZhbHVlID0gdmFsdWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZWNlaXZlciwgcHJvcGVydHksIGRlc2MpOyB9IGVsc2UgeyBfZGVmaW5lUHJvcGVydHkocmVjZWl2ZXIsIHByb3BlcnR5LCB2YWx1ZSk7IH0gcmV0dXJuIHRydWU7IH07IH0gcmV0dXJuIHNldCh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSwgcmVjZWl2ZXIpOyB9XG5cbmZ1bmN0aW9uIF9zZXQodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUsIHJlY2VpdmVyLCBpc1N0cmljdCkgeyB2YXIgcyA9IHNldCh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSwgcmVjZWl2ZXIgfHwgdGFyZ2V0KTsgaWYgKCFzICYmIGlzU3RyaWN0KSB7IHRocm93IG5ldyBFcnJvcignZmFpbGVkIHRvIHNldCBwcm9wZXJ0eScpOyB9IHJldHVybiB2YWx1ZTsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG5mdW5jdGlvbiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKSB7IGlmICh0eXBlb2YgUmVmbGVjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBSZWZsZWN0LmdldCkgeyBfZ2V0ID0gUmVmbGVjdC5nZXQ7IH0gZWxzZSB7IF9nZXQgPSBmdW5jdGlvbiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKSB7IHZhciBiYXNlID0gX3N1cGVyUHJvcEJhc2UodGFyZ2V0LCBwcm9wZXJ0eSk7IGlmICghYmFzZSkgcmV0dXJuOyB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYmFzZSwgcHJvcGVydHkpOyBpZiAoZGVzYy5nZXQpIHsgcmV0dXJuIGRlc2MuZ2V0LmNhbGwocmVjZWl2ZXIpOyB9IHJldHVybiBkZXNjLnZhbHVlOyB9OyB9IHJldHVybiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyIHx8IHRhcmdldCk7IH1cblxuZnVuY3Rpb24gX3N1cGVyUHJvcEJhc2Uob2JqZWN0LCBwcm9wZXJ0eSkgeyB3aGlsZSAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KSkgeyBvYmplY3QgPSBfZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTsgaWYgKG9iamVjdCA9PT0gbnVsbCkgYnJlYWs7IH0gcmV0dXJuIG9iamVjdDsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5mdW5jdGlvbiBfY3JlYXRlU3VwZXIoRGVyaXZlZCkgeyB2YXIgaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCA9IF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKTsgcmV0dXJuIGZ1bmN0aW9uIF9jcmVhdGVTdXBlckludGVybmFsKCkgeyB2YXIgU3VwZXIgPSBfZ2V0UHJvdG90eXBlT2YoRGVyaXZlZCksIHJlc3VsdDsgaWYgKGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QpIHsgdmFyIE5ld1RhcmdldCA9IF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3RvcjsgcmVzdWx0ID0gUmVmbGVjdC5jb25zdHJ1Y3QoU3VwZXIsIGFyZ3VtZW50cywgTmV3VGFyZ2V0KTsgfSBlbHNlIHsgcmVzdWx0ID0gU3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfSByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgcmVzdWx0KTsgfTsgfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7IHJldHVybiBjYWxsOyB9IHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpOyB9XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikgeyBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkgeyBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7IGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7IGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7IHRyeSB7IERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoRGF0ZSwgW10sIGZ1bmN0aW9uICgpIHt9KSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7IH07IHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7IH1cblxudmFyIF9FUlJPUiA9IC0xO1xuXG52YXIgX0lOSVRJQUxJWklORyA9IDA7XG52YXIgX1BMQVlJTkcgPSAxO1xudmFyIF9QQVVTRSA9IDI7XG5cbnZhciBfYXVkaW9fdmFsaWRfaWQgPSBmdW5jdGlvbiBfYXVkaW9fdmFsaWRfaWQoYXVkaW9JRCkge1xuICByZXR1cm4gdHlwZW9mIGF1ZGlvSUQgPT09IFwibnVtYmVyXCI7XG59O1xuXG52YXIgX2F1ZGlvX3ZhbGlkX3NyYyA9IGZ1bmN0aW9uIF9hdWRpb192YWxpZF9zcmMoc3JjKSB7XG4gIHJldHVybiB0eXBlb2Ygc3JjID09PSBcInN0cmluZ1wiICYmIHNyYyAhPT0gXCJcIjtcbn07XG5cbnZhciBIVE1MQXVkaW9FbGVtZW50ID0gZnVuY3Rpb24gKF9IVE1MTWVkaWFFbGVtZW50KSB7XG4gIF9pbmhlcml0cyhIVE1MQXVkaW9FbGVtZW50LCBfSFRNTE1lZGlhRWxlbWVudCk7XG5cbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihIVE1MQXVkaW9FbGVtZW50KTtcblxuICBmdW5jdGlvbiBIVE1MQXVkaW9FbGVtZW50KHVybCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBIVE1MQXVkaW9FbGVtZW50KTtcblxuICAgIHJldHVybiBfc3VwZXIuY2FsbCh0aGlzLCB1cmwsICdBVURJTycpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEhUTUxBdWRpb0VsZW1lbnQsIFt7XG4gICAga2V5OiBcImNhblBsYXlUeXBlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNhblBsYXlUeXBlKCkge1xuICAgICAgdmFyIG1lZGlhVHlwZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogJyc7XG5cbiAgICAgIGlmICh0eXBlb2YgbWVkaWFUeXBlICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG5cbiAgICAgIGlmIChtZWRpYVR5cGUuaW5kZXhPZignYXVkaW8vbXBlZycpID4gLTEgfHwgbWVkaWFUeXBlLmluZGV4T2YoJ2F1ZGlvL21wNCcpKSB7XG4gICAgICAgIHJldHVybiAncHJvYmFibHknO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImxvYWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbG9hZCgpIHtcbiAgICAgIHZhciBwcml2YXRlVGhpcyA9IF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQodGhpcyk7XG5cbiAgICAgIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcblxuICAgICAgaWYgKF9hdWRpb192YWxpZF9pZChhdWRpb0lEKSkge1xuICAgICAgICByYWwuQXVkaW9FbmdpbmUuc3RvcChhdWRpb0lEKTtcbiAgICAgICAgcHJpdmF0ZVRoaXMuYXVkaW9JRCA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciBzcmMgPSB0aGlzLnNyYztcblxuICAgICAgaWYgKF9hdWRpb192YWxpZF9zcmMoc3JjKSkge1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgIHR5cGU6IFwibG9hZHN0YXJ0XCJcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgcmFsLkF1ZGlvRW5naW5lLnByZWxvYWQodGhpcy5zcmMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLnNyYyA9PT0gc3JjKSB7XG4gICAgICAgICAgICAgIGlmIChzZWxmLmF1dG9wbGF5KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5wbGF5KCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBzZWxmLmRpc3BhdGNoRXZlbnQobmV3IF9FdmVudFtcImRlZmF1bHRcIl0oXCJsb2FkZWRtZXRhZGF0YVwiKSk7XG4gICAgICAgICAgICAgIHNlbGYuZGlzcGF0Y2hFdmVudChuZXcgX0V2ZW50W1wiZGVmYXVsdFwiXShcImxvYWRlZGRhdGFcIikpO1xuICAgICAgICAgICAgICBzZWxmLmRpc3BhdGNoRXZlbnQobmV3IF9FdmVudFtcImRlZmF1bHRcIl0oXCJjYW5wbGF5XCIpKTtcbiAgICAgICAgICAgICAgc2VsZi5kaXNwYXRjaEV2ZW50KG5ldyBfRXZlbnRbXCJkZWZhdWx0XCJdKFwiY2FucGxheXRocm91Z2hcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzcmMgIT09IFwiXCIpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiaW52YWxpZCBzcmM6IFwiLCBzcmMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBfRXZlbnRbXCJkZWZhdWx0XCJdKFwiZXJyb3JcIikpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJwYXVzZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwYXVzZSgpIHtcbiAgICAgIHZhciBhdWRpb0lEID0gX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldCh0aGlzKS5hdWRpb0lEO1xuXG4gICAgICBpZiAoX2F1ZGlvX3ZhbGlkX2lkKGF1ZGlvSUQpKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IHJhbC5BdWRpb0VuZ2luZS5nZXRTdGF0ZShhdWRpb0lEKTtcblxuICAgICAgICBpZiAoc3RhdGUgPT09IF9JTklUSUFMSVpJTkcgfHwgc3RhdGUgPT09IF9QTEFZSU5HKSB7XG4gICAgICAgICAgcmFsLkF1ZGlvRW5naW5lLnBhdXNlKGF1ZGlvSUQpO1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgX0V2ZW50W1wiZGVmYXVsdFwiXShcInBhdXNlXCIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJwbGF5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBsYXkoKSB7XG4gICAgICBpZiAoIV9hdWRpb192YWxpZF9zcmModGhpcy5zcmMpKSB7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCh7XG4gICAgICAgICAgdHlwZTogXCJlbXB0aWVkXCJcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJBdWRpbyBwbGF5OiBwbGVhc2UgZGVmaW5lIHNyYyBiZWZvcmUgcGxheVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgYXVkaW9JRCA9IF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQodGhpcykuYXVkaW9JRDtcblxuICAgICAgaWYgKF9hdWRpb192YWxpZF9pZChhdWRpb0lEKSkge1xuICAgICAgICB2YXIgc3RhdGUgPSByYWwuQXVkaW9FbmdpbmUuZ2V0U3RhdGUoYXVkaW9JRCk7XG5cbiAgICAgICAgc3dpdGNoIChzdGF0ZSkge1xuICAgICAgICAgIGNhc2UgX1BBVVNFOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICByYWwuQXVkaW9FbmdpbmUucmVzdW1lKGF1ZGlvSUQpO1xuICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IF9FdmVudFtcImRlZmF1bHRcIl0oXCJwbGF5XCIpKTtcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBfRXZlbnRbXCJkZWZhdWx0XCJdKFwicGxheWluZ1wiKSk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgX1BMQVlJTkc6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFRpbWUgPSAwO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlIF9JTklUSUFMSVpJTkc6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgX0VSUk9SOlxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB7fVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGF1ZGlvSUQgPSByYWwuQXVkaW9FbmdpbmUucGxheSh0aGlzLnNyYywgdGhpcy5sb29wLCB0aGlzLnZvbHVtZSk7XG5cbiAgICAgIGlmIChhdWRpb0lEID09PSAtMSkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLmRpc3BhdGNoRXZlbnQobmV3IF9FdmVudFtcImRlZmF1bHRcIl0oXCJlcnJvclwiKSk7XG4gICAgICAgICAgc2VsZi5kaXNwYXRjaEV2ZW50KG5ldyBfRXZlbnRbXCJkZWZhdWx0XCJdKFwiZW5kZWRcIikpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3VycmVudFRpbWUgPSB0aGlzLmN1cnJlbnRUaW1lO1xuXG4gICAgICBpZiAodHlwZW9mIGN1cnJlbnRUaW1lID09PSBcIm51bWJlclwiICYmIGN1cnJlbnRUaW1lID4gMCkge1xuICAgICAgICByYWwuQXVkaW9FbmdpbmUuc2V0Q3VycmVudFRpbWUoYXVkaW9JRCwgY3VycmVudFRpbWUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IF9FdmVudFtcImRlZmF1bHRcIl0oXCJwbGF5XCIpKTtcbiAgICAgIHJhbC5BdWRpb0VuZ2luZS5zZXRGaW5pc2hDYWxsYmFjayhhdWRpb0lELCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQoc2VsZikuYXVkaW9JRCA9IG51bGw7XG4gICAgICAgIHNlbGYuZGlzcGF0Y2hFdmVudChuZXcgX0V2ZW50W1wiZGVmYXVsdFwiXShcImVuZGVkXCIpKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodHlwZW9mIHJhbC5BdWRpb0VuZ2luZS5zZXRFcnJvckNhbGxiYWNrICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJhbC5BdWRpb0VuZ2luZS5zZXRFcnJvckNhbGxiYWNrKGF1ZGlvSUQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KHNlbGYpLmF1ZGlvSUQgPSBudWxsO1xuICAgICAgICAgIHNlbGYuZGlzcGF0Y2hFdmVudChuZXcgX0V2ZW50W1wiZGVmYXVsdFwiXShcImVycm9yXCIpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgcmFsLkF1ZGlvRW5naW5lLnNldFdhaXRpbmdDYWxsYmFjayAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByYWwuQXVkaW9FbmdpbmUuc2V0V2FpdGluZ0NhbGxiYWNrKGF1ZGlvSUQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLmRpc3BhdGNoRXZlbnQobmV3IF9FdmVudFtcImRlZmF1bHRcIl0oXCJ3YWl0aW5nXCIpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgcmFsLkF1ZGlvRW5naW5lLnNldENhblBsYXlDYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJhbC5BdWRpb0VuZ2luZS5zZXRDYW5QbGF5Q2FsbGJhY2soYXVkaW9JRCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuZGlzcGF0Y2hFdmVudChuZXcgX0V2ZW50W1wiZGVmYXVsdFwiXShcImNhbnBsYXlcIikpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldCh0aGlzKS5hdWRpb0lEID0gYXVkaW9JRDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY3VycmVudFRpbWVcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHZhciBhdWRpb0lEID0gX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldCh0aGlzKS5hdWRpb0lEO1xuXG4gICAgICBpZiAoX2F1ZGlvX3ZhbGlkX2lkKGF1ZGlvSUQpKSB7XG4gICAgICAgIHJldHVybiByYWwuQXVkaW9FbmdpbmUuZ2V0Q3VycmVudFRpbWUoYXVkaW9JRCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gX2dldChfZ2V0UHJvdG90eXBlT2YoSFRNTEF1ZGlvRWxlbWVudC5wcm90b3R5cGUpLCBcImN1cnJlbnRUaW1lXCIsIHRoaXMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgIHZhciBhdWRpb0lEID0gX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldCh0aGlzKS5hdWRpb0lEO1xuXG4gICAgICBpZiAoX2F1ZGlvX3ZhbGlkX2lkKGF1ZGlvSUQpKSB7XG4gICAgICAgIHJhbC5BdWRpb0VuZ2luZS5zZXRDdXJyZW50VGltZShhdWRpb0lELCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIF9zZXQoX2dldFByb3RvdHlwZU9mKEhUTUxBdWRpb0VsZW1lbnQucHJvdG90eXBlKSwgXCJjdXJyZW50VGltZVwiLCB2YWx1ZSwgdGhpcywgdHJ1ZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImR1cmF0aW9uXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICB2YXIgYXVkaW9JRCA9IF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQodGhpcykuYXVkaW9JRDtcblxuICAgICAgaWYgKF9hdWRpb192YWxpZF9pZChhdWRpb0lEKSkge1xuICAgICAgICByZXR1cm4gcmFsLkF1ZGlvRW5naW5lLmdldER1cmF0aW9uKGF1ZGlvSUQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIF9nZXQoX2dldFByb3RvdHlwZU9mKEhUTUxBdWRpb0VsZW1lbnQucHJvdG90eXBlKSwgXCJkdXJhdGlvblwiLCB0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibG9vcFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgdmFyIGF1ZGlvSUQgPSBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KHRoaXMpLmF1ZGlvSUQ7XG5cbiAgICAgIGlmIChfYXVkaW9fdmFsaWRfaWQoYXVkaW9JRCkpIHtcbiAgICAgICAgcmV0dXJuIHJhbC5BdWRpb0VuZ2luZS5pc0xvb3AoYXVkaW9JRCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gX2dldChfZ2V0UHJvdG90eXBlT2YoSFRNTEF1ZGlvRWxlbWVudC5wcm90b3R5cGUpLCBcImxvb3BcIiwgdGhpcyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgdmFyIGF1ZGlvSUQgPSBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KHRoaXMpLmF1ZGlvSUQ7XG5cbiAgICAgIGlmIChfYXVkaW9fdmFsaWRfaWQoYXVkaW9JRCkpIHtcbiAgICAgICAgcmFsLkF1ZGlvRW5naW5lLnNldExvb3AoYXVkaW9JRCwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBfc2V0KF9nZXRQcm90b3R5cGVPZihIVE1MQXVkaW9FbGVtZW50LnByb3RvdHlwZSksIFwibG9vcFwiLCB2YWx1ZSwgdGhpcywgdHJ1ZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInZvbHVtZVwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgdmFyIGF1ZGlvSUQgPSBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KHRoaXMpLmF1ZGlvSUQ7XG5cbiAgICAgIGlmIChfYXVkaW9fdmFsaWRfaWQoYXVkaW9JRCkpIHtcbiAgICAgICAgcmV0dXJuIHJhbC5BdWRpb0VuZ2luZS5nZXRWb2x1bWUoYXVkaW9JRCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gX2dldChfZ2V0UHJvdG90eXBlT2YoSFRNTEF1ZGlvRWxlbWVudC5wcm90b3R5cGUpLCBcInZvbHVtZVwiLCB0aGlzKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICB2YXIgYXVkaW9JRCA9IF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQodGhpcykuYXVkaW9JRDtcblxuICAgICAgaWYgKF9hdWRpb192YWxpZF9pZChhdWRpb0lEKSkge1xuICAgICAgICByYWwuQXVkaW9FbmdpbmUuc2V0Vm9sdW1lKGF1ZGlvSUQsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgX3NldChfZ2V0UHJvdG90eXBlT2YoSFRNTEF1ZGlvRWxlbWVudC5wcm90b3R5cGUpLCBcInZvbHVtZVwiLCB2YWx1ZSwgdGhpcywgdHJ1ZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNyY1wiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIF9nZXQoX2dldFByb3RvdHlwZU9mKEhUTUxBdWRpb0VsZW1lbnQucHJvdG90eXBlKSwgXCJzcmNcIiwgdGhpcyk7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgdmFyIHByaXZhdGVUaGlzID0gX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldCh0aGlzKTtcblxuICAgICAgdmFyIGF1ZGlvSUQgPSBwcml2YXRlVGhpcy5hdWRpb0lEO1xuXG4gICAgICBpZiAoX2F1ZGlvX3ZhbGlkX2lkKGF1ZGlvSUQpKSB7XG4gICAgICAgIHJhbC5BdWRpb0VuZ2luZS5zdG9wKGF1ZGlvSUQpO1xuICAgICAgICBwcml2YXRlVGhpcy5hdWRpb0lEID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgX3NldChfZ2V0UHJvdG90eXBlT2YoSFRNTEF1ZGlvRWxlbWVudC5wcm90b3R5cGUpLCBcInNyY1wiLCB2YWx1ZSwgdGhpcywgdHJ1ZSk7XG5cbiAgICAgIGlmIChfYXVkaW9fdmFsaWRfc3JjKHZhbHVlKSkge1xuICAgICAgICBpZiAodGhpcy5hdXRvcGxheSB8fCB0aGlzLnByZWxvYWQgPT09IFwiYXV0b1wiKSB7XG4gICAgICAgICAgdGhpcy5sb2FkKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gXCJcIikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJpbnZhbGlkIHNyYzogXCIsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgX0V2ZW50W1wiZGVmYXVsdFwiXShcImVycm9yXCIpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gSFRNTEF1ZGlvRWxlbWVudDtcbn0oX0hUTUxNZWRpYUVsZW1lbnQyW1wiZGVmYXVsdFwiXSk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gSFRNTEF1ZGlvRWxlbWVudDtcblxufSx7XCIuL0V2ZW50XCI6OSxcIi4vSFRNTE1lZGlhRWxlbWVudFwiOjIyLFwiLi91dGlsL1dlYWtNYXBcIjo1M31dLDE1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9IVE1MRWxlbWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0hUTUxFbGVtZW50LmpzXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7IHZhciBoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0ID0gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpOyByZXR1cm4gZnVuY3Rpb24gX2NyZWF0ZVN1cGVySW50ZXJuYWwoKSB7IHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSwgcmVzdWx0OyBpZiAoaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCkgeyB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yOyByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpOyB9IGVsc2UgeyByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9IHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpOyB9OyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7IH1cblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7IGlmIChzZWxmID09PSB2b2lkIDApIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7IGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTsgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTsgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTsgdHJ5IHsgRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChSZWZsZWN0LmNvbnN0cnVjdChEYXRlLCBbXSwgZnVuY3Rpb24gKCkge30pKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgSFRNTEJvZHlFbGVtZW50ID0gZnVuY3Rpb24gKF9IVE1MRWxlbWVudCkge1xuICBfaW5oZXJpdHMoSFRNTEJvZHlFbGVtZW50LCBfSFRNTEVsZW1lbnQpO1xuXG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoSFRNTEJvZHlFbGVtZW50KTtcblxuICBmdW5jdGlvbiBIVE1MQm9keUVsZW1lbnQocGFyZW50Tm9kZSkge1xuICAgIHZhciBfdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBIVE1MQm9keUVsZW1lbnQpO1xuXG4gICAgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBcIkJPRFlcIik7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwicGFyZW50Tm9kZVwiLCBudWxsKTtcblxuICAgIF90aGlzLnBhcmVudE5vZGUgPSBwYXJlbnROb2RlO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIHJldHVybiBIVE1MQm9keUVsZW1lbnQ7XG59KF9IVE1MRWxlbWVudDJbXCJkZWZhdWx0XCJdKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBIVE1MQm9keUVsZW1lbnQ7XG5cbn0se1wiLi9IVE1MRWxlbWVudC5qc1wiOjE3fV0sMTY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxudmFyIF9IVE1MRWxlbWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0hUTUxFbGVtZW50XCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuZnVuY3Rpb24gX2NyZWF0ZVN1cGVyKERlcml2ZWQpIHsgdmFyIGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QgPSBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCk7IHJldHVybiBmdW5jdGlvbiBfY3JlYXRlU3VwZXJJbnRlcm5hbCgpIHsgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLCByZXN1bHQ7IGlmIChoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KSB7IHZhciBOZXdUYXJnZXQgPSBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3I7IHJlc3VsdCA9IFJlZmxlY3QuY29uc3RydWN0KFN1cGVyLCBhcmd1bWVudHMsIE5ld1RhcmdldCk7IH0gZWxzZSB7IHJlc3VsdCA9IFN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH0gcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIHJlc3VsdCk7IH07IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbmlmIChyYWwuZ2V0RmVhdHVyZVByb3BlcnR5KFwiSFRNTENhbnZhc0VsZW1lbnRcIiwgXCJzcGVjXCIpID09PSBcInZpdm9fcGxhdGZvcm1fc3VwcG9ydFwiKSB7XG4gIHZhciBIVE1MQ2FudmFzRWxlbWVudCA9IHdpbmRvdy5IVE1MQ2FudmFzRWxlbWVudDtcbiAgbW9kdWxlLmV4cG9ydHMgPSBIVE1MQ2FudmFzRWxlbWVudDtcbn0gZWxzZSB7XG4gIHZhciBDQU5WQVNfREVGQVVMVF9XSURUSCA9IDMwMDtcbiAgdmFyIENBTlZBU19ERUZBVUxUX0hFSUdIVCA9IDE1MDtcbiAgd2luZG93LnJhbCA9IHdpbmRvdy5yYWwgfHwge307XG4gIHZhciBfY3JlYXRlQ2FudmFzID0gcmFsLmNyZWF0ZUNhbnZhcztcblxuICB2YXIgX0hUTUxDYW52YXNFbGVtZW50ID0gZnVuY3Rpb24gKF9IVE1MRWxlbWVudCkge1xuICAgIF9pbmhlcml0cyhfSFRNTENhbnZhc0VsZW1lbnQsIF9IVE1MRWxlbWVudCk7XG5cbiAgICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKF9IVE1MQ2FudmFzRWxlbWVudCk7XG5cbiAgICBmdW5jdGlvbiBfSFRNTENhbnZhc0VsZW1lbnQod2lkdGgsIGhlaWdodCkge1xuICAgICAgdmFyIF90aGlzO1xuXG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgX0hUTUxDYW52YXNFbGVtZW50KTtcblxuICAgICAgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCAnQ0FOVkFTJyk7XG4gICAgICBfdGhpcy5pZCA9ICdnbGNhbnZhcyc7XG4gICAgICBfdGhpcy50eXBlID0gJ2NhbnZhcyc7XG4gICAgICBfdGhpcy50b3AgPSAwO1xuICAgICAgX3RoaXMubGVmdCA9IDA7XG5cbiAgICAgIGlmICh0eXBlb2YgcmFsLmdldEZlYXR1cmVQcm9wZXJ0eShcInJhbC5jcmVhdGVDYW52YXNcIiwgXCJzcGVjXCIpID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHZhciBjYW52YXMgPSBfY3JlYXRlQ2FudmFzKCk7XG5cbiAgICAgICAgY2FudmFzLl9fcHJvdG9fXy5fX3Byb3RvX18gPSBfSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlO1xuICAgICAgICBPYmplY3Qua2V5cyhfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgY2FudmFzW2tleV0gPSB0aGlzW2tleV07XG4gICAgICAgIH0uYmluZChfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSkpO1xuICAgICAgICBjYW52YXMud2lkdGggPSB3aWR0aCA+PSAwID8gTWF0aC5jZWlsKHdpZHRoKSA6IENBTlZBU19ERUZBVUxUX1dJRFRIO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0ID49IDAgPyBNYXRoLmNlaWwoaGVpZ2h0KSA6IENBTlZBU19ERUZBVUxUX0hFSUdIVDtcbiAgICAgICAgY2FudmFzLl90YXJnZXRJRCA9IF90aGlzLl90YXJnZXRJRDtcbiAgICAgICAgY2FudmFzLl9saXN0ZW5lckNvdW50ID0gX3RoaXMuX2xpc3RlbmVyQ291bnQ7XG4gICAgICAgIGNhbnZhcy5fbGlzdGVuZXJzID0gX3RoaXMuX2xpc3RlbmVycztcbiAgICAgICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKF90aGlzLCBjYW52YXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3RoaXMuX3dpZHRoID0gd2lkdGggPyBNYXRoLmNlaWwod2lkdGgpIDogQ0FOVkFTX0RFRkFVTFRfV0lEVEg7XG4gICAgICAgIF90aGlzLl9oZWlnaHQgPSBoZWlnaHQgPyBNYXRoLmNlaWwoaGVpZ2h0KSA6IENBTlZBU19ERUZBVUxUX0hFSUdIVDtcbiAgICAgICAgX3RoaXMuX2NvbnRleHQyRCA9IG51bGw7XG4gICAgICAgIF90aGlzLl9hbGlnbm1lbnQgPSBfdGhpcy5fd2lkdGggJSAyID09PSAwID8gOCA6IDQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoX0hUTUxDYW52YXNFbGVtZW50LCBbe1xuICAgICAga2V5OiBcImdldENvbnRleHRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRDb250ZXh0KG5hbWUsIG9wdHMpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGlmIChuYW1lID09PSAnd2ViZ2wnIHx8IG5hbWUgPT09ICdleHBlcmltZW50YWwtd2ViZ2wnKSB7XG4gICAgICAgICAgcmV0dXJuIHdpbmRvdy5fX2dsO1xuICAgICAgICB9IGVsc2UgaWYgKG5hbWUgPT09ICcyZCcpIHtcbiAgICAgICAgICBpZiAoIXRoaXMuX2NvbnRleHQyRCkge1xuICAgICAgICAgICAgdGhpcy5fY29udGV4dDJEID0gbmV3IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICB0aGlzLl9jb250ZXh0MkQuX2lubmVyQ2FudmFzID0gdGhpcztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gdGhpcy5fY29udGV4dDJEO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcImNsaWVudFdpZHRoXCIsXG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGg7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcImNsaWVudEhlaWdodFwiLFxuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlaWdodDtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwid2lkdGhcIixcbiAgICAgIHNldDogZnVuY3Rpb24gc2V0KHdpZHRoKSB7XG4gICAgICAgIHdpZHRoID0gcGFyc2VJbnQod2lkdGgpO1xuXG4gICAgICAgIGlmIChpc05hTih3aWR0aCkpIHtcbiAgICAgICAgICB3aWR0aCA9IENBTlZBU19ERUZBVUxUX1dJRFRIO1xuICAgICAgICB9IGVsc2UgaWYgKHdpZHRoIDwgMCkge1xuICAgICAgICAgIHdpZHRoID0gQ0FOVkFTX0RFRkFVTFRfV0lEVEg7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl93aWR0aCA9IHdpZHRoO1xuICAgICAgICB0aGlzLl9hbGlnbm1lbnQgPSB0aGlzLl93aWR0aCAlIDIgPT09IDAgPyA4IDogNDtcblxuICAgICAgICBpZiAodGhpcy5fY29udGV4dDJEKSB7XG4gICAgICAgICAgdGhpcy5fY29udGV4dDJELl93aWR0aCA9IHdpZHRoO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiaGVpZ2h0XCIsXG4gICAgICBzZXQ6IGZ1bmN0aW9uIHNldChoZWlnaHQpIHtcbiAgICAgICAgaGVpZ2h0ID0gcGFyc2VJbnQoaGVpZ2h0KTtcblxuICAgICAgICBpZiAoaXNOYU4oaGVpZ2h0KSkge1xuICAgICAgICAgIGhlaWdodCA9IENBTlZBU19ERUZBVUxUX0hFSUdIVDtcbiAgICAgICAgfSBlbHNlIGlmIChoZWlnaHQgPCAwKSB7XG4gICAgICAgICAgaGVpZ2h0ID0gQ0FOVkFTX0RFRkFVTFRfSEVJR0hUO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgICAgIGlmICh0aGlzLl9jb250ZXh0MkQpIHtcbiAgICAgICAgICB0aGlzLl9jb250ZXh0MkQuX2hlaWdodCA9IGhlaWdodDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xuICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBfSFRNTENhbnZhc0VsZW1lbnQ7XG4gIH0oX0hUTUxFbGVtZW50MltcImRlZmF1bHRcIl0pO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gX0hUTUxDYW52YXNFbGVtZW50O1xufVxuXG59LHtcIi4vSFRNTEVsZW1lbnRcIjoxN31dLDE3OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9FbGVtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vRWxlbWVudFwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7IHZhciBoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0ID0gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpOyByZXR1cm4gZnVuY3Rpb24gX2NyZWF0ZVN1cGVySW50ZXJuYWwoKSB7IHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSwgcmVzdWx0OyBpZiAoaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCkgeyB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yOyByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpOyB9IGVsc2UgeyByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9IHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpOyB9OyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7IH1cblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7IGlmIChzZWxmID09PSB2b2lkIDApIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7IGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTsgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTsgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTsgdHJ5IHsgRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChSZWZsZWN0LmNvbnN0cnVjdChEYXRlLCBbXSwgZnVuY3Rpb24gKCkge30pKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgSFRNTEVsZW1lbnQgPSBmdW5jdGlvbiAoX0VsZW1lbnQpIHtcbiAgX2luaGVyaXRzKEhUTUxFbGVtZW50LCBfRWxlbWVudCk7XG5cbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihIVE1MRWxlbWVudCk7XG5cbiAgZnVuY3Rpb24gSFRNTEVsZW1lbnQodGFnTmFtZSkge1xuICAgIHZhciBfdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBIVE1MRWxlbWVudCk7XG5cbiAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHRhZ05hbWUpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcImNsYXNzTmFtZVwiLCAnJyk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwiY2hpbGRlcm5cIiwgW10pO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcInN0eWxlXCIsIHtcbiAgICAgIHdpZHRoOiBcIlwiLmNvbmNhdCh3aW5kb3cuaW5uZXJXaWR0aCwgXCJweFwiKSxcbiAgICAgIGhlaWdodDogXCJcIi5jb25jYXQod2luZG93LmlubmVySGVpZ2h0LCBcInB4XCIpXG4gICAgfSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwiaW5zZXJ0QmVmb3JlXCIsIGZ1bmN0aW9uICgpIHt9KTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJpbm5lckhUTUxcIiwgJycpO1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEhUTUxFbGVtZW50LCBbe1xuICAgIGtleTogXCJzZXRBdHRyaWJ1dGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKSB7XG4gICAgICB0aGlzW25hbWVdID0gdmFsdWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEF0dHJpYnV0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRBdHRyaWJ1dGUobmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXNbbmFtZV07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNsaWVudFdpZHRoXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICB2YXIgcmV0ID0gcGFyc2VJbnQodGhpcy5zdHlsZS5mb250U2l6ZSwgMTApICogdGhpcy5pbm5lckhUTUwubGVuZ3RoO1xuICAgICAgcmV0dXJuIE51bWJlci5pc05hTihyZXQpID8gMCA6IHJldDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2xpZW50SGVpZ2h0XCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICB2YXIgcmV0ID0gcGFyc2VJbnQodGhpcy5zdHlsZS5mb250U2l6ZSwgMTApO1xuICAgICAgcmV0dXJuIE51bWJlci5pc05hTihyZXQpID8gMCA6IHJldDtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gSFRNTEVsZW1lbnQ7XG59KF9FbGVtZW50MltcImRlZmF1bHRcIl0pO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEhUTUxFbGVtZW50O1xuXG59LHtcIi4vRWxlbWVudFwiOjh9XSwxODpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfSFRNTEVsZW1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9IVE1MRWxlbWVudC5qc1wiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5mdW5jdGlvbiBfY3JlYXRlU3VwZXIoRGVyaXZlZCkgeyB2YXIgaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCA9IF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKTsgcmV0dXJuIGZ1bmN0aW9uIF9jcmVhdGVTdXBlckludGVybmFsKCkgeyB2YXIgU3VwZXIgPSBfZ2V0UHJvdG90eXBlT2YoRGVyaXZlZCksIHJlc3VsdDsgaWYgKGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QpIHsgdmFyIE5ld1RhcmdldCA9IF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3RvcjsgcmVzdWx0ID0gUmVmbGVjdC5jb25zdHJ1Y3QoU3VwZXIsIGFyZ3VtZW50cywgTmV3VGFyZ2V0KTsgfSBlbHNlIHsgcmVzdWx0ID0gU3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfSByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgcmVzdWx0KTsgfTsgfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7IHJldHVybiBjYWxsOyB9IHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpOyB9XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikgeyBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkgeyBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7IGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7IGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7IHRyeSB7IERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoRGF0ZSwgW10sIGZ1bmN0aW9uICgpIHt9KSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7IH07IHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIEhUTUxIZWFkRWxlbWVudCA9IGZ1bmN0aW9uIChfSFRNTEVsZW1lbnQpIHtcbiAgX2luaGVyaXRzKEhUTUxIZWFkRWxlbWVudCwgX0hUTUxFbGVtZW50KTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKEhUTUxIZWFkRWxlbWVudCk7XG5cbiAgZnVuY3Rpb24gSFRNTEhlYWRFbGVtZW50KHBhcmVudE5vZGUpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgSFRNTEhlYWRFbGVtZW50KTtcblxuICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgXCJIRUFEXCIpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcInBhcmVudE5vZGVcIiwgbnVsbCk7XG5cbiAgICBfdGhpcy5wYXJlbnROb2RlID0gcGFyZW50Tm9kZTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICByZXR1cm4gSFRNTEhlYWRFbGVtZW50O1xufShfSFRNTEVsZW1lbnQyW1wiZGVmYXVsdFwiXSk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gSFRNTEhlYWRFbGVtZW50O1xuXG59LHtcIi4vSFRNTEVsZW1lbnQuanNcIjoxN31dLDE5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9IVE1MRWxlbWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0hUTUxFbGVtZW50XCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuZnVuY3Rpb24gX2NyZWF0ZVN1cGVyKERlcml2ZWQpIHsgdmFyIGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QgPSBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCk7IHJldHVybiBmdW5jdGlvbiBfY3JlYXRlU3VwZXJJbnRlcm5hbCgpIHsgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLCByZXN1bHQ7IGlmIChoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KSB7IHZhciBOZXdUYXJnZXQgPSBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3I7IHJlc3VsdCA9IFJlZmxlY3QuY29uc3RydWN0KFN1cGVyLCBhcmd1bWVudHMsIE5ld1RhcmdldCk7IH0gZWxzZSB7IHJlc3VsdCA9IFN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH0gcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIHJlc3VsdCk7IH07IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbnZhciBIVE1MSHRtbEVsZW1lbnQgPSBmdW5jdGlvbiAoX0hUTUxFbGVtZW50KSB7XG4gIF9pbmhlcml0cyhIVE1MSHRtbEVsZW1lbnQsIF9IVE1MRWxlbWVudCk7XG5cbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihIVE1MSHRtbEVsZW1lbnQpO1xuXG4gIGZ1bmN0aW9uIEhUTUxIdG1sRWxlbWVudCgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgSFRNTEh0bWxFbGVtZW50KTtcblxuICAgIHJldHVybiBfc3VwZXIuY2FsbCh0aGlzLCBcIkhUTUxcIik7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoSFRNTEh0bWxFbGVtZW50LCBbe1xuICAgIGtleTogXCJ2ZXJzaW9uXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gSFRNTEh0bWxFbGVtZW50O1xufShfSFRNTEVsZW1lbnQyW1wiZGVmYXVsdFwiXSk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gSFRNTEh0bWxFbGVtZW50O1xuXG59LHtcIi4vSFRNTEVsZW1lbnRcIjoxN31dLDIwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbnZhciBfSFRNTEVsZW1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9IVE1MRWxlbWVudFwiKSk7XG5cbnZhciBfRXZlbnQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0V2ZW50XCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuZnVuY3Rpb24gX2NyZWF0ZVN1cGVyKERlcml2ZWQpIHsgdmFyIGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QgPSBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCk7IHJldHVybiBmdW5jdGlvbiBfY3JlYXRlU3VwZXJJbnRlcm5hbCgpIHsgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLCByZXN1bHQ7IGlmIChoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KSB7IHZhciBOZXdUYXJnZXQgPSBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3I7IHJlc3VsdCA9IFJlZmxlY3QuY29uc3RydWN0KFN1cGVyLCBhcmd1bWVudHMsIE5ld1RhcmdldCk7IH0gZWxzZSB7IHJlc3VsdCA9IFN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH0gcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIHJlc3VsdCk7IH07IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbmlmIChyYWwuZ2V0RmVhdHVyZVByb3BlcnR5KFwiSFRNTEltYWdlRWxlbWVudFwiLCBcInNwZWNcIikgPT09IFwidml2b19wbGF0Zm9ybV9zdXBwb3J0XCIpIHtcbiAgdmFyIEhUTUxJbWFnZUVsZW1lbnQgPSB3aW5kb3cuSFRNTEltYWdlRWxlbWVudDtcbiAgbW9kdWxlLmV4cG9ydHMgPSBIVE1MSW1hZ2VFbGVtZW50O1xufSBlbHNlIHtcbiAgd2luZG93LnJhbCA9IHdpbmRvdy5yYWwgfHwge307XG4gIHZhciBfY3JldGVJbWFnZSA9IHJhbC5jcmVhdGVJbWFnZTtcblxuICB2YXIgX2ltYWdlO1xuXG4gIHZhciBfc2V0dGVyO1xuXG4gIHZhciBfZ2V0dGVyO1xuXG4gIGNvbnNvbGUuZXJyb3IoXCI9PT09PXJhbC5nZXRGZWF0dXJlUHJvcGVydHlsOlwiLCByYWwuZ2V0RmVhdHVyZVByb3BlcnR5KFwicmFsLmNyZWF0ZUltYWdlXCIsIFwic3BlY1wiKSwgdHlwZW9mIHJhbC5nZXRGZWF0dXJlUHJvcGVydHkoXCJyYWwuY3JlYXRlSW1hZ2VcIiwgXCJzcGVjXCIpID09PSBcInVuZGVmaW5lZFwiKTtcblxuICBpZiAodHlwZW9mIHJhbC5nZXRGZWF0dXJlUHJvcGVydHkoXCJyYWwuY3JlYXRlSW1hZ2VcIiwgXCJzcGVjXCIpID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgX2ltYWdlID0gX2NyZXRlSW1hZ2UoKTtcblxuICAgIHZhciBfZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoX2ltYWdlLl9fcHJvdG9fXywgXCJzcmNcIik7XG5cbiAgICBfc2V0dGVyID0gX2Rlc2NyaXB0b3Iuc2V0O1xuICAgIF9nZXR0ZXIgPSBfZGVzY3JpcHRvci5nZXQ7XG4gIH1cblxuICB2YXIgX0hUTUxJbWFnZUVsZW1lbnQgPSBmdW5jdGlvbiAoX0hUTUxFbGVtZW50KSB7XG4gICAgX2luaGVyaXRzKF9IVE1MSW1hZ2VFbGVtZW50LCBfSFRNTEVsZW1lbnQpO1xuXG4gICAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihfSFRNTEltYWdlRWxlbWVudCk7XG5cbiAgICBmdW5jdGlvbiBfSFRNTEltYWdlRWxlbWVudCh3aWR0aCwgaGVpZ2h0LCBpc0NhbGxlZEZyb21JbWFnZSkge1xuICAgICAgdmFyIF90aGlzO1xuXG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgX0hUTUxJbWFnZUVsZW1lbnQpO1xuXG4gICAgICBpZiAoIWlzQ2FsbGVkRnJvbUltYWdlKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbGxlZ2FsIGNvbnN0cnVjdG9yLCB1c2UgJ25ldyBJbWFnZSh3LCBoKTsgaW5zdGVhZCEnXCIpO1xuICAgICAgfVxuXG4gICAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsICdJTUcnKTtcbiAgICAgIF90aGlzLmNvbXBsZXRlID0gZmFsc2U7XG4gICAgICBfdGhpcy5jcm9zc09yaWdpbiA9IG51bGw7XG4gICAgICBfdGhpcy5uYXR1cmFsV2lkdGggPSAwO1xuICAgICAgX3RoaXMubmF0dXJhbEhlaWdodCA9IDA7XG4gICAgICBfdGhpcy53aWR0aCA9IHdpZHRoIHx8IDA7XG4gICAgICBfdGhpcy5oZWlnaHQgPSBoZWlnaHQgfHwgMDtcblxuICAgICAgaWYgKHR5cGVvZiByYWwuZ2V0RmVhdHVyZVByb3BlcnR5KFwicmFsLmNyZWF0ZUltYWdlXCIsIFwic3BlY1wiKSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICB2YXIgaW1hZ2UgPSBfY3JldGVJbWFnZSgpO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICBpbWFnZVtrZXldID0gdGhpc1trZXldO1xuICAgICAgICB9LmJpbmQoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcykpKTtcblxuICAgICAgICBpbWFnZS5fb25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgIHRoaXMubmF0dXJhbFdpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgICB0aGlzLm5hdHVyYWxIZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IF9FdmVudFtcImRlZmF1bHRcIl0oXCJsb2FkXCIpKTtcbiAgICAgICAgfS5iaW5kKGltYWdlKTtcblxuICAgICAgICBpbWFnZS5fb25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IF9FdmVudFtcImRlZmF1bHRcIl0oXCJlcnJvclwiKSk7XG4gICAgICAgIH0uYmluZChpbWFnZSk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGltYWdlLCBcInNyY1wiLCB7XG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICByZXR1cm4gX2dldHRlci5jYWxsKHRoaXMpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcGxldGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBfc2V0dGVyLmNhbGwodGhpcywgdmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihfdGhpcywgaW1hZ2UpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKF9IVE1MSW1hZ2VFbGVtZW50LCBbe1xuICAgICAga2V5OiBcImdldEJvdW5kaW5nQ2xpZW50UmVjdFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBET01SZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwic3JjXCIsXG4gICAgICBzZXQ6IGZ1bmN0aW9uIHNldChzcmMpIHtcbiAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5fc3JjID0gc3JjO1xuXG4gICAgICAgIGlmIChzcmMgPT09IFwiXCIpIHtcbiAgICAgICAgICB0aGlzLndpZHRoID0gMDtcbiAgICAgICAgICB0aGlzLmhlaWdodCA9IDA7XG4gICAgICAgICAgdGhpcy5fZGF0YSA9IG51bGw7XG4gICAgICAgICAgdGhpcy5faW1hZ2VNZXRhID0gbnVsbDtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLl9nbEZvcm1hdCA9IHRoaXMuX2dsSW50ZXJuYWxGb3JtYXQgPSAweDE5MDg7XG4gICAgICAgICAgdGhpcy5jcm9zc09yaWdpbiA9IG51bGw7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmFsLmxvYWRJbWFnZURhdGEoc3JjLCBmdW5jdGlvbiAoaW5mbykge1xuICAgICAgICAgIGlmICghaW5mbykge1xuICAgICAgICAgICAgdmFyIF9ldmVudCA9IG5ldyBfRXZlbnRbXCJkZWZhdWx0XCJdKCdlcnJvcicpO1xuXG4gICAgICAgICAgICBfdGhpczIuZGlzcGF0Y2hFdmVudChfZXZlbnQpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX3RoaXMyLl9pbWFnZU1ldGEgPSBpbmZvO1xuICAgICAgICAgIF90aGlzMi53aWR0aCA9IF90aGlzMi5uYXR1cmFsV2lkdGggPSBpbmZvLndpZHRoO1xuICAgICAgICAgIF90aGlzMi5oZWlnaHQgPSBfdGhpczIubmF0dXJhbEhlaWdodCA9IGluZm8uaGVpZ2h0O1xuICAgICAgICAgIF90aGlzMi5fZGF0YSA9IGluZm8uZGF0YTtcbiAgICAgICAgICBfdGhpczIuX2dsRm9ybWF0ID0gaW5mby5nbEZvcm1hdDtcbiAgICAgICAgICBfdGhpczIuX2dsSW50ZXJuYWxGb3JtYXQgPSBpbmZvLmdsSW50ZXJuYWxGb3JtYXQ7XG4gICAgICAgICAgX3RoaXMyLl9nbFR5cGUgPSBpbmZvLmdsVHlwZTtcbiAgICAgICAgICBfdGhpczIuX251bWJlck9mTWlwbWFwcyA9IGluZm8ubnVtYmVyT2ZNaXBtYXBzO1xuICAgICAgICAgIF90aGlzMi5fY29tcHJlc3NlZCA9IGluZm8uY29tcHJlc3NlZDtcbiAgICAgICAgICBfdGhpczIuX2JwcCA9IGluZm8uYnBwO1xuICAgICAgICAgIF90aGlzMi5fcHJlbXVsdGlwbHlBbHBoYSA9IGluZm8ucHJlbXVsdGlwbHlBbHBoYTtcbiAgICAgICAgICBfdGhpczIuX2FsaWdubWVudCA9IDE7XG5cbiAgICAgICAgICBpZiAoKF90aGlzMi5fbnVtYmVyT2ZNaXBtYXBzID09IDAgfHwgX3RoaXMyLl9udW1iZXJPZk1pcG1hcHMgPT0gMSkgJiYgIV90aGlzMi5fY29tcHJlc3NlZCkge1xuICAgICAgICAgICAgdmFyIGJ5dGVzUGVyUm93ID0gX3RoaXMyLndpZHRoICogX3RoaXMyLl9icHAgLyA4O1xuICAgICAgICAgICAgaWYgKGJ5dGVzUGVyUm93ICUgOCA9PSAwKSBfdGhpczIuX2FsaWdubWVudCA9IDg7ZWxzZSBpZiAoYnl0ZXNQZXJSb3cgJSA0ID09IDApIF90aGlzMi5fYWxpZ25tZW50ID0gNDtlbHNlIGlmIChieXRlc1BlclJvdyAlIDIgPT0gMCkgX3RoaXMyLl9hbGlnbm1lbnQgPSAyO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIF90aGlzMi5jb21wbGV0ZSA9IHRydWU7XG4gICAgICAgICAgdmFyIGV2ZW50ID0gbmV3IF9FdmVudFtcImRlZmF1bHRcIl0oJ2xvYWQnKTtcblxuICAgICAgICAgIF90aGlzMi5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zcmM7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcImNsaWVudFdpZHRoXCIsXG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGg7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcImNsaWVudEhlaWdodFwiLFxuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlaWdodDtcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gX0hUTUxJbWFnZUVsZW1lbnQ7XG4gIH0oX0hUTUxFbGVtZW50MltcImRlZmF1bHRcIl0pO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gX0hUTUxJbWFnZUVsZW1lbnQ7XG59XG5cbn0se1wiLi9FdmVudFwiOjksXCIuL0hUTUxFbGVtZW50XCI6MTd9XSwyMTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfSFRNTEVsZW1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9IVE1MRWxlbWVudFwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9nZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ICE9PSBcInVuZGVmaW5lZFwiICYmIFJlZmxlY3QuZ2V0KSB7IF9nZXQgPSBSZWZsZWN0LmdldDsgfSBlbHNlIHsgX2dldCA9IGZ1bmN0aW9uIF9nZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHsgdmFyIGJhc2UgPSBfc3VwZXJQcm9wQmFzZSh0YXJnZXQsIHByb3BlcnR5KTsgaWYgKCFiYXNlKSByZXR1cm47IHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlLCBwcm9wZXJ0eSk7IGlmIChkZXNjLmdldCkgeyByZXR1cm4gZGVzYy5nZXQuY2FsbChyZWNlaXZlcik7IH0gcmV0dXJuIGRlc2MudmFsdWU7IH07IH0gcmV0dXJuIF9nZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIgfHwgdGFyZ2V0KTsgfVxuXG5mdW5jdGlvbiBfc3VwZXJQcm9wQmFzZShvYmplY3QsIHByb3BlcnR5KSB7IHdoaWxlICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpKSB7IG9iamVjdCA9IF9nZXRQcm90b3R5cGVPZihvYmplY3QpOyBpZiAob2JqZWN0ID09PSBudWxsKSBicmVhazsgfSByZXR1cm4gb2JqZWN0OyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7IHZhciBoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0ID0gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpOyByZXR1cm4gZnVuY3Rpb24gX2NyZWF0ZVN1cGVySW50ZXJuYWwoKSB7IHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSwgcmVzdWx0OyBpZiAoaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCkgeyB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yOyByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpOyB9IGVsc2UgeyByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9IHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpOyB9OyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7IH1cblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7IGlmIChzZWxmID09PSB2b2lkIDApIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7IGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTsgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTsgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTsgdHJ5IHsgRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChSZWZsZWN0LmNvbnN0cnVjdChEYXRlLCBbXSwgZnVuY3Rpb24gKCkge30pKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG53aW5kb3cucmFsID0gd2luZG93LnJhbCB8fCB7fTtcblxudmFyIEhUTUxJbnB1dEVsZW1lbnQgPSBmdW5jdGlvbiAoX0hUTUxFbGVtZW50KSB7XG4gIF9pbmhlcml0cyhIVE1MSW5wdXRFbGVtZW50LCBfSFRNTEVsZW1lbnQpO1xuXG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoSFRNTElucHV0RWxlbWVudCk7XG5cbiAgZnVuY3Rpb24gSFRNTElucHV0RWxlbWVudCgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgSFRNTElucHV0RWxlbWVudCk7XG5cbiAgICByZXR1cm4gX3N1cGVyLmNhbGwodGhpcywgXCJJTlBVVFwiKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhIVE1MSW5wdXRFbGVtZW50LCBbe1xuICAgIGtleTogXCJmb2N1c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmb2N1cygpIHtcbiAgICAgIF9nZXQoX2dldFByb3RvdHlwZU9mKEhUTUxJbnB1dEVsZW1lbnQucHJvdG90eXBlKSwgXCJmb2N1c1wiLCB0aGlzKS5jYWxsKHRoaXMpO1xuXG4gICAgICBpZiAoIXRoaXMudGFyZ2V0LmVkaXRhYmxlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICB2YXIgb25LZXlib2FyZElucHV0ID0gZnVuY3Rpb24gb25LZXlib2FyZElucHV0KHJlcykge1xuICAgICAgICB2YXIgc3RyID0gcmVzID8gcmVzLnZhbHVlIDogXCJcIjtcbiAgICAgICAgdGhhdC5pbnB1dFRhcmdldC50ZXh0ID0gc3RyO1xuICAgICAgICB0aGF0LnRhcmdldC5ldmVudChcImlucHV0XCIpO1xuICAgICAgfTtcblxuICAgICAgdmFyIG9uS2V5Ym9hcmRDb25maXJtID0gZnVuY3Rpb24gb25LZXlib2FyZENvbmZpcm0ocmVzKSB7XG4gICAgICAgIHZhciBzdHIgPSByZXMgPyByZXMudmFsdWUgOiBcIlwiO1xuICAgICAgICB0aGF0LnRhcmdldC50ZXh0ID0gc3RyO1xuICAgICAgICB0aGF0LnRhcmdldC5ldmVudChcImlucHV0XCIpO1xuICAgICAgICB0aGF0LnRhcmdldC5mb2N1cyA9IGZhbHNlO1xuICAgICAgICByYWwub2ZmS2V5Ym9hcmRDb25maXJtKG9uS2V5Ym9hcmRDb25maXJtKTtcbiAgICAgICAgcmFsLm9mZktleWJvYXJkSW5wdXQob25LZXlib2FyZElucHV0KTtcbiAgICAgICAgcmFsLmhpZGVLZXlib2FyZCh7fSk7XG4gICAgICB9O1xuXG4gICAgICByYWwub2ZmS2V5Ym9hcmRJbnB1dChvbktleWJvYXJkSW5wdXQpO1xuICAgICAgcmFsLm9mZktleWJvYXJkQ29uZmlybShvbktleWJvYXJkQ29uZmlybSk7XG4gICAgICByYWwuc2hvd0tleWJvYXJkKHtcbiAgICAgICAgZGVmYXVsdFZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgICBtYXhMZW5ndGg6IHRoaXMubWF4TGVuZ3RoLFxuICAgICAgICBtdWx0aXBsZTogdGhpcy50YXJnZXQubXVsdGlsaW5lLFxuICAgICAgICBjb25maXJtSG9sZDogZmFsc2UsXG4gICAgICAgIGlucHV0VHlwZTogdGhpcy50YXJnZXQudHlwZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyhyZXMpIHt9LFxuICAgICAgICBmYWlsOiBmdW5jdGlvbiBmYWlsKHJlcykge31cbiAgICAgIH0pO1xuICAgICAgcmFsLm9uS2V5Ym9hcmRJbnB1dChvbktleWJvYXJkSW5wdXQpO1xuICAgICAgcmFsLm9uS2V5Ym9hcmRDb25maXJtKG9uS2V5Ym9hcmRDb25maXJtKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYmx1clwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBibHVyKCkge1xuICAgICAgX2dldChfZ2V0UHJvdG90eXBlT2YoSFRNTElucHV0RWxlbWVudC5wcm90b3R5cGUpLCBcImJsdXJcIiwgdGhpcykuY2FsbCh0aGlzKTtcblxuICAgICAgcmFsLmhpZGVLZXlib2FyZCh7fSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEhUTUxJbnB1dEVsZW1lbnQ7XG59KF9IVE1MRWxlbWVudDJbXCJkZWZhdWx0XCJdKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBIVE1MSW5wdXRFbGVtZW50O1xuXG59LHtcIi4vSFRNTEVsZW1lbnRcIjoxN31dLDIyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9IVE1MRWxlbWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0hUTUxFbGVtZW50XCIpKTtcblxudmFyIF9NZWRpYUVycm9yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9NZWRpYUVycm9yXCIpKTtcblxudmFyIF9XZWFrTWFwID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi91dGlsL1dlYWtNYXBcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5mdW5jdGlvbiBfY3JlYXRlU3VwZXIoRGVyaXZlZCkgeyB2YXIgaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCA9IF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKTsgcmV0dXJuIGZ1bmN0aW9uIF9jcmVhdGVTdXBlckludGVybmFsKCkgeyB2YXIgU3VwZXIgPSBfZ2V0UHJvdG90eXBlT2YoRGVyaXZlZCksIHJlc3VsdDsgaWYgKGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QpIHsgdmFyIE5ld1RhcmdldCA9IF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3RvcjsgcmVzdWx0ID0gUmVmbGVjdC5jb25zdHJ1Y3QoU3VwZXIsIGFyZ3VtZW50cywgTmV3VGFyZ2V0KTsgfSBlbHNlIHsgcmVzdWx0ID0gU3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfSByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgcmVzdWx0KTsgfTsgfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7IHJldHVybiBjYWxsOyB9IHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpOyB9XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikgeyBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkgeyBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7IGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7IGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7IHRyeSB7IERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoRGF0ZSwgW10sIGZ1bmN0aW9uICgpIHt9KSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7IH07IHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIEhUTUxNZWRpYUVsZW1lbnQgPSBmdW5jdGlvbiAoX0hUTUxFbGVtZW50KSB7XG4gIF9pbmhlcml0cyhIVE1MTWVkaWFFbGVtZW50LCBfSFRNTEVsZW1lbnQpO1xuXG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoSFRNTE1lZGlhRWxlbWVudCk7XG5cbiAgX2NyZWF0ZUNsYXNzKEhUTUxNZWRpYUVsZW1lbnQsIG51bGwsIFt7XG4gICAga2V5OiBcIk5FVFdPUktfRU1QVFlcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJORVRXT1JLX0lETEVcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJORVRXT1JLX0xPQURJTkdcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiAyO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJORVRXT1JLX05PX1NPVVJDRVwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIDM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkhBVkVfTk9USElOR1wiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkhBVkVfTUVUQURBVEFcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJIQVZFX0NVUlJFTlRfREFUQVwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIDI7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkhBVkVfRlVUVVJFX0RBVEFcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiAzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJIQVZFX0VOT1VHSF9EQVRBXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gNDtcbiAgICB9XG4gIH1dKTtcblxuICBmdW5jdGlvbiBIVE1MTWVkaWFFbGVtZW50KHVybCwgdHlwZSkge1xuICAgIHZhciBfdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBIVE1MTWVkaWFFbGVtZW50KTtcblxuICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgdHlwZSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwiYXVkaW9UcmFja3NcIiwgdW5kZWZpbmVkKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJhdXRvcGxheVwiLCBmYWxzZSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwiY29udHJvbGxlclwiLCBudWxsKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJjb250cm9sc1wiLCBmYWxzZSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwiY3Jvc3NPcmlnaW5cIiwgbnVsbCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwiZGVmYXVsdE11dGVkXCIsIGZhbHNlKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJkZWZhdWx0UGxheWJhY2tSYXRlXCIsIDEuMCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwibWVkaWFHcm91cFwiLCB1bmRlZmluZWQpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcIm1lZGlhS2V5c1wiLCBudWxsKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJtb3pBdWRpb0NoYW5uZWxUeXBlXCIsIHVuZGVmaW5lZCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwibXV0ZWRcIiwgZmFsc2UpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcIm5ldHdvcmtTdGF0ZVwiLCBIVE1MTWVkaWFFbGVtZW50Lk5FVFdPUktfRU1QVFkpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcInBsYXliYWNrUmF0ZVwiLCAxKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJwcmVsb2FkXCIsIFwiYXV0b1wiKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJsb29wXCIsIGZhbHNlKTtcblxuICAgIE9iamVjdC5hc3NpZ24oX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldChfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSksIHtcbiAgICAgIGJ1ZmZlcmVkOiB1bmRlZmluZWQsXG4gICAgICBjdXJyZW50U3JjOiB1cmwgfHwgXCJcIixcbiAgICAgIGR1cmF0aW9uOiAwLFxuICAgICAgZW5kZWQ6IGZhbHNlLFxuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICBpbml0aWFsVGltZTogMCxcbiAgICAgIHBhdXNlZDogdHJ1ZSxcbiAgICAgIHJlYWR5U3RhdGU6IEhUTUxNZWRpYUVsZW1lbnQuSEFWRV9OT1RISU5HLFxuICAgICAgdm9sdW1lOiAxLjAsXG4gICAgICBjdXJyZW50VGltZTogMFxuICAgIH0pO1xuXG4gICAgX3RoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImVuZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQodGhpcykuZW5kZWQgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgX3RoaXMuYWRkRXZlbnRMaXN0ZW5lcihcInBsYXlcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldCh0aGlzKS5lbmRlZCA9IGZhbHNlO1xuICAgICAgX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldCh0aGlzKS5lcnJvciA9IG51bGw7XG4gICAgICBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KHRoaXMpLnBhdXNlZCA9IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgX3RoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQodGhpcykuZXJyb3IgPSB0cnVlO1xuICAgICAgX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldCh0aGlzKS5lbmRlZCA9IHRydWU7XG4gICAgICBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KHRoaXMpLnBhdXNlZCA9IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEhUTUxNZWRpYUVsZW1lbnQsIFt7XG4gICAga2V5OiBcImNhblBsYXlUeXBlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNhblBsYXlUeXBlKG1lZGlhVHlwZSkge1xuICAgICAgcmV0dXJuICdtYXliZSc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNhcHR1cmVTdHJlYW1cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2FwdHVyZVN0cmVhbSgpIHt9XG4gIH0sIHtcbiAgICBrZXk6IFwiZmFzdFNlZWtcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZmFzdFNlZWsoKSB7fVxuICB9LCB7XG4gICAga2V5OiBcImxvYWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbG9hZCgpIHt9XG4gIH0sIHtcbiAgICBrZXk6IFwicGF1c2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcGF1c2UoKSB7fVxuICB9LCB7XG4gICAga2V5OiBcInBsYXlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcGxheSgpIHt9XG4gIH0sIHtcbiAgICBrZXk6IFwiY3VycmVudFRpbWVcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KHRoaXMpLmN1cnJlbnRUaW1lO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgIF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQodGhpcykuY3VycmVudFRpbWUgPSB2YWx1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic3JjXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldCh0aGlzKS5jdXJyZW50U3JjO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgIF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQodGhpcykuY3VycmVudFNyYyA9IHZhbHVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJidWZmZXJlZFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQodGhpcykuYnVmZmVyZWQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImN1cnJlbnRTcmNcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KHRoaXMpLmN1cnJlbnRTcmM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImR1cmF0aW9uXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldCh0aGlzKS5kdXJhdGlvbjtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZW5kZWRcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KHRoaXMpLmVuZGVkO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJlcnJvclwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQodGhpcykuZXJyb3I7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImluaXRpYWxUaW1lXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldCh0aGlzKS5pbml0aWFsVGltZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicGF1c2VkXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldCh0aGlzKS5wYXVzZWQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInZvbHVtZVwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQodGhpcykudm9sdW1lO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgIF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQodGhpcykudm9sdW1lID0gdmFsdWU7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEhUTUxNZWRpYUVsZW1lbnQ7XG59KF9IVE1MRWxlbWVudDJbXCJkZWZhdWx0XCJdKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBIVE1MTWVkaWFFbGVtZW50O1xuXG59LHtcIi4vSFRNTEVsZW1lbnRcIjoxNyxcIi4vTWVkaWFFcnJvclwiOjI4LFwiLi91dGlsL1dlYWtNYXBcIjo1M31dLDIzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9IVE1MRWxlbWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0hUTUxFbGVtZW50XCIpKTtcblxudmFyIF9FdmVudCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vRXZlbnRcIikpO1xuXG52YXIgX0ZpbGVDYWNoZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vdXRpbC9GaWxlQ2FjaGVcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuZnVuY3Rpb24gX2NyZWF0ZVN1cGVyKERlcml2ZWQpIHsgdmFyIGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QgPSBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCk7IHJldHVybiBmdW5jdGlvbiBfY3JlYXRlU3VwZXJJbnRlcm5hbCgpIHsgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLCByZXN1bHQ7IGlmIChoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KSB7IHZhciBOZXdUYXJnZXQgPSBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3I7IHJlc3VsdCA9IFJlZmxlY3QuY29uc3RydWN0KFN1cGVyLCBhcmd1bWVudHMsIE5ld1RhcmdldCk7IH0gZWxzZSB7IHJlc3VsdCA9IFN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH0gcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIHJlc3VsdCk7IH07IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbnZhciBfQkFTRTY0X05BTUUgPSBcImRhdGE6YXBwbGljYXRpb24vamF2YXNjcmlwdDtiYXNlNjQsXCI7XG52YXIgX1VSSV9OQU1FID0gXCJkYXRhOmFwcGxpY2F0aW9uL2phdmFzY3JpcHQsXCI7XG5cbnZhciBfZ2V0UGF0aEZyb21CYXNlNjRTdHJpbmcgPSBmdW5jdGlvbiBfZ2V0UGF0aEZyb21CYXNlNjRTdHJpbmcoc3JjKSB7XG4gIGlmIChzcmMgPT09IG51bGwgfHwgc3JjID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gc3JjO1xuICB9XG5cbiAgaWYgKHNyYy5zdGFydHNXaXRoKF9CQVNFNjRfTkFNRSkpIHtcbiAgICB2YXIgY29udGVudCA9IHNyYy5zdWJzdHJpbmcoX0JBU0U2NF9OQU1FLmxlbmd0aCk7XG4gICAgdmFyIHNvdXJjZSA9IHdpbmRvdy5hdG9iKGNvbnRlbnQpO1xuICAgIHZhciBsZW4gPSBzb3VyY2UubGVuZ3RoO1xuXG4gICAgaWYgKGxlbiA+IDApIHtcbiAgICAgIHJldHVybiBfZ2V0RGlza1BhdGhGcm9tQXJyYXlCdWZmZXIoc291cmNlLCBsZW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc3JjO1xuICAgIH1cbiAgfSBlbHNlIGlmIChzcmMuc3RhcnRzV2l0aChfVVJJX05BTUUpKSB7XG4gICAgdmFyIF9jb250ZW50ID0gc3JjLnN1YnN0cmluZyhfVVJJX05BTUUubGVuZ3RoKTtcblxuICAgIHZhciBfc291cmNlID0gZGVjb2RlVVJJQ29tcG9uZW50KF9jb250ZW50KTtcblxuICAgIHZhciBfbGVuID0gX3NvdXJjZS5sZW5ndGg7XG5cbiAgICBpZiAoX2xlbiA+IDApIHtcbiAgICAgIHJldHVybiBfZ2V0RGlza1BhdGhGcm9tQXJyYXlCdWZmZXIoX3NvdXJjZSwgX2xlbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzcmM7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBzcmM7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9nZXREaXNrUGF0aEZyb21BcnJheUJ1ZmZlcihzb3VyY2UsIGxlbikge1xuICB2YXIgYXJyYXlCdWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIobGVuKTtcbiAgdmFyIHVpbnQ4QXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcik7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIHVpbnQ4QXJyYXlbaV0gPSBzb3VyY2UuY2hhckNvZGVBdChpKTtcbiAgfVxuXG4gIHJldHVybiBfRmlsZUNhY2hlW1wiZGVmYXVsdFwiXS5nZXRDYWNoZShhcnJheUJ1ZmZlcik7XG59XG5cbnZhciBIVE1MU2NyaXB0RWxlbWVudCA9IGZ1bmN0aW9uIChfSFRNTEVsZW1lbnQpIHtcbiAgX2luaGVyaXRzKEhUTUxTY3JpcHRFbGVtZW50LCBfSFRNTEVsZW1lbnQpO1xuXG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoSFRNTFNjcmlwdEVsZW1lbnQpO1xuXG4gIGZ1bmN0aW9uIEhUTUxTY3JpcHRFbGVtZW50KCkge1xuICAgIHZhciBfdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBIVE1MU2NyaXB0RWxlbWVudCk7XG5cbiAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsICdTQ1JJUFQnKTtcblxuICAgIHZhciBzZWxmID0gX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyk7XG5cbiAgICB2YXIgb25BcHBlbmQgPSBmdW5jdGlvbiBvbkFwcGVuZCgpIHtcbiAgICAgIHNlbGYucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFwcGVuZFwiLCBvbkFwcGVuZCk7XG5cbiAgICAgIHZhciBzcmMgPSBfZ2V0UGF0aEZyb21CYXNlNjRTdHJpbmcoc2VsZi5zcmMpO1xuXG4gICAgICByZXF1aXJlKHNyYyk7XG5cbiAgICAgIHNlbGYuZGlzcGF0Y2hFdmVudChuZXcgX0V2ZW50W1wiZGVmYXVsdFwiXSgnbG9hZCcpKTtcbiAgICB9O1xuXG4gICAgX3RoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImFwcGVuZFwiLCBvbkFwcGVuZCk7XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICByZXR1cm4gSFRNTFNjcmlwdEVsZW1lbnQ7XG59KF9IVE1MRWxlbWVudDJbXCJkZWZhdWx0XCJdKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBIVE1MU2NyaXB0RWxlbWVudDtcblxufSx7XCIuL0V2ZW50XCI6OSxcIi4vSFRNTEVsZW1lbnRcIjoxNyxcIi4vdXRpbC9GaWxlQ2FjaGVcIjo1Mn1dLDI0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9Gb250RmFjZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vRm9udEZhY2VcIikpO1xuXG52YXIgX0hUTUxFbGVtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vSFRNTEVsZW1lbnRcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuZnVuY3Rpb24gX2NyZWF0ZVN1cGVyKERlcml2ZWQpIHsgdmFyIGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QgPSBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCk7IHJldHVybiBmdW5jdGlvbiBfY3JlYXRlU3VwZXJJbnRlcm5hbCgpIHsgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLCByZXN1bHQ7IGlmIChoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KSB7IHZhciBOZXdUYXJnZXQgPSBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3I7IHJlc3VsdCA9IFJlZmxlY3QuY29uc3RydWN0KFN1cGVyLCBhcmd1bWVudHMsIE5ld1RhcmdldCk7IH0gZWxzZSB7IHJlc3VsdCA9IFN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH0gcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIHJlc3VsdCk7IH07IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbnZhciBIVE1MU3R5bGVFbGVtZW50ID0gZnVuY3Rpb24gKF9IVE1MRWxlbWVudCkge1xuICBfaW5oZXJpdHMoSFRNTFN0eWxlRWxlbWVudCwgX0hUTUxFbGVtZW50KTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKEhUTUxTdHlsZUVsZW1lbnQpO1xuXG4gIGZ1bmN0aW9uIEhUTUxTdHlsZUVsZW1lbnQoKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEhUTUxTdHlsZUVsZW1lbnQpO1xuXG4gICAgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBcIlNUWUxFXCIpO1xuXG4gICAgdmFyIHNlbGYgPSBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKTtcblxuICAgIHZhciBvbkFwcGVuZCA9IGZ1bmN0aW9uIG9uQXBwZW5kKCkge1xuICAgICAgc2VsZi5yZW1vdmVFdmVudExpc3RlbmVyKFwiYXBwZW5kXCIsIG9uQXBwZW5kKTtcbiAgICAgIHZhciB0ZXh0Q29udGVudCA9IHNlbGYudGV4dENvbnRlbnQgfHwgc2VsZi5pbm5lckhUTUwgfHwgXCJcIjtcbiAgICAgIHZhciBmb250RmFjZVN0ciA9IFwiXCI7XG4gICAgICB2YXIgc3RhcnQgPSAwO1xuICAgICAgdmFyIGxlbmd0aCA9IHRleHRDb250ZW50Lmxlbmd0aDtcbiAgICAgIHZhciBmbGFnID0gMDtcblxuICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgKytpbmRleCkge1xuICAgICAgICBpZiAoc3RhcnQgPiAwKSB7XG4gICAgICAgICAgaWYgKHRleHRDb250ZW50W2luZGV4XSA9PT0gXCJ7XCIpIHtcbiAgICAgICAgICAgIGZsYWcrKztcbiAgICAgICAgICB9IGVsc2UgaWYgKHRleHRDb250ZW50W2luZGV4XSA9PT0gXCJ9XCIpIHtcbiAgICAgICAgICAgIGZsYWctLTtcblxuICAgICAgICAgICAgaWYgKGZsYWcgPT09IDApIHtcbiAgICAgICAgICAgICAgZm9udEZhY2VTdHIgPSB0ZXh0Q29udGVudC5zdWJzdHJpbmcoc3RhcnQsIGluZGV4ICsgMSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmbGFnIDwgMCkge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRleHRDb250ZW50W2luZGV4XSA9PT0gXCJAXCIgJiYgdGV4dENvbnRlbnQuc3Vic3RyKGluZGV4LCBcIkBmb250LWZhY2VcIi5sZW5ndGgpID09PSBcIkBmb250LWZhY2VcIikge1xuICAgICAgICAgICAgaW5kZXggKz0gOTtcbiAgICAgICAgICAgIHN0YXJ0ID0gaW5kZXggKyAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZm9udEZhY2VTdHIpIHtcbiAgICAgICAgdmFyIGZvbnRGYW1pbHk7XG4gICAgICAgIHZhciBfbGVuZ3RoID0gZm9udEZhY2VTdHIubGVuZ3RoO1xuXG4gICAgICAgIHZhciBfc3RhcnQgPSBmb250RmFjZVN0ci5pbmRleE9mKFwiZm9udC1mYW1pbHlcIik7XG5cbiAgICAgICAgaWYgKF9zdGFydCA9PT0gLTEpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBfc3RhcnQgKz0gXCJmb250LWZhbWlseVwiLmxlbmd0aCArIDE7XG4gICAgICAgIHZhciBlbmQgPSBfc3RhcnQ7XG5cbiAgICAgICAgZm9yICg7IGVuZCA8IF9sZW5ndGg7ICsrZW5kKSB7XG4gICAgICAgICAgaWYgKGZvbnRGYWNlU3RyW2VuZF0gPT09IFwiO1wiKSB7XG4gICAgICAgICAgICBmb250RmFtaWx5ID0gZm9udEZhY2VTdHIuc3Vic3RyaW5nKF9zdGFydCwgZW5kKS50cmltKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9IGVsc2UgaWYgKGZvbnRGYWNlU3RyW2VuZF0gPT09IFwiOlwiKSB7XG4gICAgICAgICAgICBfc3RhcnQgPSBlbmQgKyAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZm9udEZhbWlseSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGVuZCA9IGZvbnRGYWNlU3RyLmluZGV4T2YoXCJ1cmwoXCIpO1xuICAgICAgICBfc3RhcnQgPSAwO1xuICAgICAgICB2YXIgc291cmNlO1xuXG4gICAgICAgIGZvciAoOyBlbmQgPCBfbGVuZ3RoOyArK2VuZCkge1xuICAgICAgICAgIGlmIChmb250RmFjZVN0cltlbmRdID09PSBcIidcIiB8fCBmb250RmFjZVN0cltlbmRdID09PSAnXCInKSB7XG4gICAgICAgICAgICBpZiAoX3N0YXJ0ID4gMCkge1xuICAgICAgICAgICAgICBzb3VyY2UgPSBmb250RmFjZVN0ci5zdWJzdHJpbmcoX3N0YXJ0LCBlbmQpLnRyaW0oKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF9zdGFydCA9IGVuZCArIDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICAgIHZhciBmb250RmFjZSA9IG5ldyBfRm9udEZhY2VbXCJkZWZhdWx0XCJdKGZvbnRGYW1pbHksIHNvdXJjZSk7XG4gICAgICAgICAgZm9udEZhY2UubG9hZCgpO1xuICAgICAgICAgIGRvY3VtZW50LmZvbnRzLmFkZChmb250RmFjZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3RoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImFwcGVuZFwiLCBvbkFwcGVuZCk7XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICByZXR1cm4gSFRNTFN0eWxlRWxlbWVudDtcbn0oX0hUTUxFbGVtZW50MltcImRlZmF1bHRcIl0pO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEhUTUxTdHlsZUVsZW1lbnQ7XG5cbn0se1wiLi9Gb250RmFjZVwiOjExLFwiLi9IVE1MRWxlbWVudFwiOjE3fV0sMjU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX0hUTUxNZWRpYUVsZW1lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9IVE1MTWVkaWFFbGVtZW50XCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuZnVuY3Rpb24gX2NyZWF0ZVN1cGVyKERlcml2ZWQpIHsgdmFyIGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QgPSBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCk7IHJldHVybiBmdW5jdGlvbiBfY3JlYXRlU3VwZXJJbnRlcm5hbCgpIHsgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLCByZXN1bHQ7IGlmIChoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KSB7IHZhciBOZXdUYXJnZXQgPSBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3I7IHJlc3VsdCA9IFJlZmxlY3QuY29uc3RydWN0KFN1cGVyLCBhcmd1bWVudHMsIE5ld1RhcmdldCk7IH0gZWxzZSB7IHJlc3VsdCA9IFN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH0gcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIHJlc3VsdCk7IH07IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbnZhciBIVE1MVmlkZW9FbGVtZW50ID0gZnVuY3Rpb24gKF9IVE1MTWVkaWFFbGVtZW50KSB7XG4gIF9pbmhlcml0cyhIVE1MVmlkZW9FbGVtZW50LCBfSFRNTE1lZGlhRWxlbWVudCk7XG5cbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihIVE1MVmlkZW9FbGVtZW50KTtcblxuICBmdW5jdGlvbiBIVE1MVmlkZW9FbGVtZW50KCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBIVE1MVmlkZW9FbGVtZW50KTtcblxuICAgIHJldHVybiBfc3VwZXIuY2FsbCh0aGlzLCAnVklERU8nKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhIVE1MVmlkZW9FbGVtZW50LCBbe1xuICAgIGtleTogXCJjYW5QbGF5VHlwZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjYW5QbGF5VHlwZSh0eXBlKSB7XG4gICAgICByZXR1cm4gdHlwZSA9PT0gJ3ZpZGVvL21wNCc7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEhUTUxWaWRlb0VsZW1lbnQ7XG59KF9IVE1MTWVkaWFFbGVtZW50MltcImRlZmF1bHRcIl0pO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEhUTUxWaWRlb0VsZW1lbnQ7XG5cbn0se1wiLi9IVE1MTWVkaWFFbGVtZW50XCI6MjJ9XSwyNjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfSFRNTEltYWdlRWxlbWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0hUTUxJbWFnZUVsZW1lbnRcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuZnVuY3Rpb24gX2NyZWF0ZVN1cGVyKERlcml2ZWQpIHsgdmFyIGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QgPSBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCk7IHJldHVybiBmdW5jdGlvbiBfY3JlYXRlU3VwZXJJbnRlcm5hbCgpIHsgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLCByZXN1bHQ7IGlmIChoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KSB7IHZhciBOZXdUYXJnZXQgPSBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3I7IHJlc3VsdCA9IFJlZmxlY3QuY29uc3RydWN0KFN1cGVyLCBhcmd1bWVudHMsIE5ld1RhcmdldCk7IH0gZWxzZSB7IHJlc3VsdCA9IFN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH0gcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIHJlc3VsdCk7IH07IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbnZhciBfSW1hZ2UgPSB3aW5kb3cuSW1hZ2U7XG5cbnZhciBJbWFnZSA9IGZ1bmN0aW9uIChfSFRNTEltYWdlRWxlbWVudCkge1xuICBfaW5oZXJpdHMoSW1hZ2UsIF9IVE1MSW1hZ2VFbGVtZW50KTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKEltYWdlKTtcblxuICBmdW5jdGlvbiBJbWFnZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEltYWdlKTtcblxuICAgIHJldHVybiBfc3VwZXIuY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0LCB0cnVlKTtcbiAgfVxuXG4gIHJldHVybiBJbWFnZTtcbn0oX0hUTUxJbWFnZUVsZW1lbnQyW1wiZGVmYXVsdFwiXSk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gSW1hZ2U7XG52YXIgX2NyZXRlSW1hZ2UgPSByYWwuY3JlYXRlSW1hZ2U7XG5cbmlmIChfY3JldGVJbWFnZSkge1xuICBfSW1hZ2UucHJvdG90eXBlLl9fcHJvdG9fXyA9IEltYWdlLnByb3RvdHlwZTtcbn1cblxufSx7XCIuL0hUTUxJbWFnZUVsZW1lbnRcIjoyMH1dLDI3OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIExvY2F0aW9uID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBMb2NhdGlvbigpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTG9jYXRpb24pO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiYW5jZXN0b3JPcmlnaW5zXCIsIFwiXCIpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiaGFzaFwiLCBcIlwiKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImhvc3RcIiwgXCJcIik7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJob3N0bmFtZVwiLCBcIlwiKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImhyZWZcIiwgXCJnYW1lLmpzXCIpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwib3JpZ2luXCIsIFwiXCIpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwicGFzc3dvcmRcIiwgXCJcIik7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJwYXRobmFtZVwiLCBcImdhbWUuanNcIik7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJwb3J0XCIsIFwiXCIpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwicHJvdG9jb2xcIiwgXCJcIik7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJzZWFyY2hcIiwgXCJcIik7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJ1c2VybmFtZVwiLCBcIlwiKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhMb2NhdGlvbiwgW3tcbiAgICBrZXk6IFwiYXNzaWduXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFzc2lnbigpIHt9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVsb2FkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbG9hZCgpIHt9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVwbGFjZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXBsYWNlKCkge31cbiAgfSwge1xuICAgIGtleTogXCJ0b1N0cmluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBMb2NhdGlvbjtcbn0oKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBMb2NhdGlvbjtcblxufSx7fV0sMjg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgTUVESUFfRVJSX0FCT1JURUQgPSAxO1xudmFyIE1FRElBX0VSUl9ORVRXT1JLID0gMjtcbnZhciBNRURJQV9FUlJfREVDT0RFID0gMztcbnZhciBNRURJQV9FUlJfU1JDX05PVF9TVVBQT1JURUQgPSA0O1xuXG52YXIgTWVkaWFFcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTWVkaWFFcnJvcigpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTWVkaWFFcnJvcik7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoTWVkaWFFcnJvciwgW3tcbiAgICBrZXk6IFwiY29kZVwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIE1FRElBX0VSUl9BQk9SVEVEO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtZXNzYWdlXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gTWVkaWFFcnJvcjtcbn0oKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBNZWRpYUVycm9yO1xubW9kdWxlLmV4cG9ydHMgPSBNZWRpYUVycm9yO1xuXG59LHt9XSwyOTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgTmF2aWdhdG9yID0gZnVuY3Rpb24gTmF2aWdhdG9yKHBsYXRmb3JtLCBsYW5ndWFnZSkge1xuICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTmF2aWdhdG9yKTtcblxuICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJwbGF0Zm9ybVwiLCBcIlwiKTtcblxuICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJsYW5ndWFnZVwiLCBcIlwiKTtcblxuICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJhcHBWZXJzaW9uXCIsICc1LjAgKGlQaG9uZTsgQ1BVIGlQaG9uZSBPUyA5XzEgbGlrZSBNYWMgT1MgWCkgQXBwbGVXZWJLaXQvNjAxLjEuNDYgKEtIVE1MLCBsaWtlIEdlY2tvKSBWZXJzaW9uLzkuMCBNb2JpbGUvMTNCMTQzIFNhZmFyaS82MDEuMScpO1xuXG4gIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInVzZXJBZ2VudFwiLCAnTW96aWxsYS81LjAgKGlQaG9uZTsgQ1BVIGlQaG9uZSBPUyAxMF8zXzEgbGlrZSBNYWMgT1MgWCkgQXBwbGVXZWJLaXQvNjAzLjEuMzAgKEtIVE1MLCBsaWtlIEdlY2tvKSBNb2JpbGUvMTRFODMwMSBOZXRUeXBlL1dJRkkgTGFuZ3VhZ2UvemhfQ04nKTtcblxuICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJvbkxpbmVcIiwgdHJ1ZSk7XG5cbiAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwibWF4VG91Y2hQb2ludHNcIiwgMTApO1xuXG4gIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImdlb2xvY2F0aW9uXCIsIHtcbiAgICBnZXRDdXJyZW50UG9zaXRpb246IGZ1bmN0aW9uIGdldEN1cnJlbnRQb3NpdGlvbigpIHt9LFxuICAgIHdhdGNoUG9zaXRpb246IGZ1bmN0aW9uIHdhdGNoUG9zaXRpb24oKSB7fSxcbiAgICBjbGVhcldhdGNoOiBmdW5jdGlvbiBjbGVhcldhdGNoKCkge31cbiAgfSk7XG5cbiAgdGhpcy5wbGF0Zm9ybSA9IHBsYXRmb3JtO1xuICB0aGlzLmxhbmd1YWdlID0gbGFuZ3VhZ2U7XG59O1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IE5hdmlnYXRvcjtcblxufSx7fV0sMzA6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX0V2ZW50VGFyZ2V0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vRXZlbnRUYXJnZXRcIikpO1xuXG52YXIgX0V2ZW50ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9FdmVudFwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9nZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ICE9PSBcInVuZGVmaW5lZFwiICYmIFJlZmxlY3QuZ2V0KSB7IF9nZXQgPSBSZWZsZWN0LmdldDsgfSBlbHNlIHsgX2dldCA9IGZ1bmN0aW9uIF9nZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHsgdmFyIGJhc2UgPSBfc3VwZXJQcm9wQmFzZSh0YXJnZXQsIHByb3BlcnR5KTsgaWYgKCFiYXNlKSByZXR1cm47IHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlLCBwcm9wZXJ0eSk7IGlmIChkZXNjLmdldCkgeyByZXR1cm4gZGVzYy5nZXQuY2FsbChyZWNlaXZlcik7IH0gcmV0dXJuIGRlc2MudmFsdWU7IH07IH0gcmV0dXJuIF9nZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIgfHwgdGFyZ2V0KTsgfVxuXG5mdW5jdGlvbiBfc3VwZXJQcm9wQmFzZShvYmplY3QsIHByb3BlcnR5KSB7IHdoaWxlICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpKSB7IG9iamVjdCA9IF9nZXRQcm90b3R5cGVPZihvYmplY3QpOyBpZiAob2JqZWN0ID09PSBudWxsKSBicmVhazsgfSByZXR1cm4gb2JqZWN0OyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7IHZhciBoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0ID0gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpOyByZXR1cm4gZnVuY3Rpb24gX2NyZWF0ZVN1cGVySW50ZXJuYWwoKSB7IHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSwgcmVzdWx0OyBpZiAoaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCkgeyB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yOyByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpOyB9IGVsc2UgeyByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9IHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpOyB9OyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7IH1cblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7IGlmIChzZWxmID09PSB2b2lkIDApIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7IGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTsgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTsgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTsgdHJ5IHsgRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChSZWZsZWN0LmNvbnN0cnVjdChEYXRlLCBbXSwgZnVuY3Rpb24gKCkge30pKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgTm9kZSA9IGZ1bmN0aW9uIChfRXZlbnRUYXJnZXQpIHtcbiAgX2luaGVyaXRzKE5vZGUsIF9FdmVudFRhcmdldCk7XG5cbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihOb2RlKTtcblxuICBmdW5jdGlvbiBOb2RlKG5vZGVOYW1lKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE5vZGUpO1xuXG4gICAgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJjaGlsZE5vZGVzXCIsIFtdKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJwYXJlbnROb2RlXCIsIG51bGwpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcIl9ub2RlTmFtZVwiLCBcIlwiKTtcblxuICAgIF90aGlzLl9ub2RlTmFtZSA9IG5vZGVOYW1lO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhOb2RlLCBbe1xuICAgIGtleTogXCJhcHBlbmRDaGlsZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhcHBlbmRDaGlsZChub2RlKSB7XG4gICAgICB0aGlzLmNoaWxkTm9kZXMucHVzaChub2RlKTtcbiAgICAgIG5vZGUucGFyZW50Tm9kZSA9IHRoaXM7XG4gICAgICB2YXIgbm9kZU5hbWUgPSBub2RlLm5vZGVOYW1lO1xuXG4gICAgICBpZiAobm9kZU5hbWUgPT09IFwiU0NSSVBUXCIgfHwgbm9kZU5hbWUgPT09IFwiU1RZTEVcIikge1xuICAgICAgICBub2RlLmRpc3BhdGNoRXZlbnQobmV3IF9FdmVudFtcImRlZmF1bHRcIl0oXCJhcHBlbmRcIikpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2xvbmVOb2RlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsb25lTm9kZSgpIHtcbiAgICAgIHZhciBjb3B5Tm9kZSA9IE9iamVjdC5jcmVhdGUodGhpcyk7XG4gICAgICBPYmplY3QuYXNzaWduKGNvcHlOb2RlLCB0aGlzKTtcbiAgICAgIGNvcHlOb2RlLnBhcmVudE5vZGUgPSBudWxsO1xuICAgICAgcmV0dXJuIGNvcHlOb2RlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZW1vdmVDaGlsZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVDaGlsZChub2RlKSB7XG4gICAgICB2YXIgaW5kZXggPSB0aGlzLmNoaWxkTm9kZXMuZmluZEluZGV4KGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICByZXR1cm4gY2hpbGQgPT09IG5vZGU7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgdmFyIF9ub2RlID0gdGhpcy5jaGlsZE5vZGVzLnNwbGljZShpbmRleCwgMSlbMF07XG4gICAgICAgIF9ub2RlLnBhcmVudE5vZGUgPSBudWxsO1xuICAgICAgICByZXR1cm4gX25vZGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjb250YWluc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb250YWlucyhub2RlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGlsZE5vZGVzLmluZGV4T2Yobm9kZSkgPiAtMTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGlzcGF0Y2hFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNwYXRjaEV2ZW50KCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHRydWU7XG4gICAgICB2YXIgbGVuZ3RoID0gdGhpcy5jaGlsZE5vZGVzLmxlbmd0aDtcblxuICAgICAgZm9yICh2YXIgaW5kZXggPSBsZW5ndGggLSAxOyByZXN1bHQgJiYgaW5kZXggPj0gMDsgLS1pbmRleCkge1xuICAgICAgICB2YXIgX3RoaXMkY2hpbGROb2RlcyRpbmRlO1xuXG4gICAgICAgIHJlc3VsdCA9IChfdGhpcyRjaGlsZE5vZGVzJGluZGUgPSB0aGlzLmNoaWxkTm9kZXNbaW5kZXhdKS5kaXNwYXRjaEV2ZW50LmFwcGx5KF90aGlzJGNoaWxkTm9kZXMkaW5kZSwgYXJndW1lbnRzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICByZXR1cm4gX2dldChfZ2V0UHJvdG90eXBlT2YoTm9kZS5wcm90b3R5cGUpLCBcImRpc3BhdGNoRXZlbnRcIiwgdGhpcykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJub2RlTmFtZVwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX25vZGVOYW1lO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBOb2RlO1xufShfRXZlbnRUYXJnZXQyW1wiZGVmYXVsdFwiXSk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gTm9kZTtcblxufSx7XCIuL0V2ZW50XCI6OSxcIi4vRXZlbnRUYXJnZXRcIjoxMH1dLDMxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfV2Vha01hcCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vdXRpbC9XZWFrTWFwXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgTm9kZUxpc3QgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIE5vZGVMaXN0KCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBOb2RlTGlzdCk7XG5cbiAgICBfV2Vha01hcFtcImRlZmF1bHRcIl0uc2V0KHRoaXMsIHtcbiAgICAgIGFycmF5OiBbXVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBQcm94eSh0aGlzLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCh0YXJnZXQsIGtleSkge1xuICAgICAgICBpZiAoX3R5cGVvZihrZXkpID09PSBcInN5bWJvbFwiKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoL15bMC05XSokLy50ZXN0KGtleSkpIHtcbiAgICAgICAgICByZXR1cm4gX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldCh0YXJnZXQpLmFycmF5W2tleV07XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVzdWx0ID0gdGFyZ2V0W2tleV07XG5cbiAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5iaW5kKHRhcmdldCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKE5vZGVMaXN0LCBbe1xuICAgIGtleTogXCJwdXNoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHB1c2goZWxlbWVudCkge1xuICAgICAgX1dlYWtNYXBbXCJkZWZhdWx0XCJdLmdldCh0aGlzKS5hcnJheS5wdXNoKGVsZW1lbnQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpdGVtXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGl0ZW0oaW5kZXgpIHtcbiAgICAgIHJldHVybiBfV2Vha01hcFtcImRlZmF1bHRcIl0uZ2V0KHRoaXMpLmFycmF5W2luZGV4XTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY29uY2F0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbmNhdCgpIHtcbiAgICAgIHZhciBhcnJheSA9IF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQodGhpcykuYXJyYXk7XG5cbiAgICAgIHJldHVybiBhcnJheS5jb25jYXQuYXBwbHkoYXJyYXksIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImxlbmd0aFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIF9XZWFrTWFwW1wiZGVmYXVsdFwiXS5nZXQodGhpcykuYXJyYXkubGVuZ3RoO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBOb2RlTGlzdDtcbn0oKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBOb2RlTGlzdDtcblxufSx7XCIuL3V0aWwvV2Vha01hcFwiOjUzfV0sMzI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG53aW5kb3cucmFsID0gd2luZG93LnJhbCB8fCB7fTtcblxudmFyIFNjcmVlbiA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU2NyZWVuKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTY3JlZW4pO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiYXZhaWxUb3BcIiwgMCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJhdmFpbExlZnRcIiwgMCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJhdmFpbEhlaWdodFwiLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiYXZhaWxXaWR0aFwiLCB3aW5kb3cuaW5uZXJXaWR0aCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJjb2xvckRlcHRoXCIsIDgpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwicGl4ZWxEZXB0aFwiLCAwKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImxlZnRcIiwgMCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJ0b3BcIiwgMCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJ3aWR0aFwiLCB3aW5kb3cuaW5uZXJXaWR0aCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJoZWlnaHRcIiwgd2luZG93LmlubmVySGVpZ2h0KTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIm9yaWVudGF0aW9uXCIsIHtcbiAgICAgIHR5cGU6ICdwb3J0cmFpdC1wcmltYXJ5J1xuICAgIH0pO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFNjcmVlbiwgW3tcbiAgICBrZXk6IFwib25vcmllbnRhdGlvbmNoYW5nZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvbm9yaWVudGF0aW9uY2hhbmdlKCkge31cbiAgfV0pO1xuXG4gIHJldHVybiBTY3JlZW47XG59KCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gU2NyZWVuO1xuXG59LHt9XSwzMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfRXZlbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9FdmVudFwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5mdW5jdGlvbiBfY3JlYXRlU3VwZXIoRGVyaXZlZCkgeyB2YXIgaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCA9IF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKTsgcmV0dXJuIGZ1bmN0aW9uIF9jcmVhdGVTdXBlckludGVybmFsKCkgeyB2YXIgU3VwZXIgPSBfZ2V0UHJvdG90eXBlT2YoRGVyaXZlZCksIHJlc3VsdDsgaWYgKGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QpIHsgdmFyIE5ld1RhcmdldCA9IF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3RvcjsgcmVzdWx0ID0gUmVmbGVjdC5jb25zdHJ1Y3QoU3VwZXIsIGFyZ3VtZW50cywgTmV3VGFyZ2V0KTsgfSBlbHNlIHsgcmVzdWx0ID0gU3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfSByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgcmVzdWx0KTsgfTsgfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7IHJldHVybiBjYWxsOyB9IHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpOyB9XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikgeyBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkgeyBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7IGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7IGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7IHRyeSB7IERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoRGF0ZSwgW10sIGZ1bmN0aW9uICgpIHt9KSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7IH07IHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7IH1cblxudmFyIFRvdWNoRXZlbnQgPSBmdW5jdGlvbiAoX0V2ZW50KSB7XG4gIF9pbmhlcml0cyhUb3VjaEV2ZW50LCBfRXZlbnQpO1xuXG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoVG91Y2hFdmVudCk7XG5cbiAgZnVuY3Rpb24gVG91Y2hFdmVudCh0eXBlKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFRvdWNoRXZlbnQpO1xuXG4gICAgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCB0eXBlKTtcbiAgICBfdGhpcy50b3VjaGVzID0gW107XG4gICAgX3RoaXMudGFyZ2V0VG91Y2hlcyA9IFtdO1xuICAgIF90aGlzLmNoYW5nZWRUb3VjaGVzID0gW107XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgcmV0dXJuIFRvdWNoRXZlbnQ7XG59KF9FdmVudDJbXCJkZWZhdWx0XCJdKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBUb3VjaEV2ZW50O1xuXG59LHtcIi4vRXZlbnRcIjo5fV0sMzQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX0V2ZW50ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9FdmVudFwiKSk7XG5cbnZhciBfRmlsZUNhY2hlID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi91dGlsL0ZpbGVDYWNoZVwiKSk7XG5cbnZhciBfWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldFwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7IHZhciBoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0ID0gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpOyByZXR1cm4gZnVuY3Rpb24gX2NyZWF0ZVN1cGVySW50ZXJuYWwoKSB7IHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSwgcmVzdWx0OyBpZiAoaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCkgeyB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yOyByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpOyB9IGVsc2UgeyByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9IHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpOyB9OyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7IH1cblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7IGlmIChzZWxmID09PSB2b2lkIDApIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7IGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTsgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTsgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTsgdHJ5IHsgRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChSZWZsZWN0LmNvbnN0cnVjdChEYXRlLCBbXSwgZnVuY3Rpb24gKCkge30pKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgZnNtID0gcmFsLmdldEZpbGVTeXN0ZW1NYW5hZ2VyKCk7XG52YXIgX1hNTEh0dHBSZXF1ZXN0ID0gd2luZG93LlhNTEh0dHBSZXF1ZXN0O1xud2luZG93LnJhbCA9IHdpbmRvdy5yYWwgfHwge307XG5cbnZhciBYTUxIdHRwUmVxdWVzdCA9IGZ1bmN0aW9uIChfWE1MSHR0cFJlcXVlc3RFdmVudFQpIHtcbiAgX2luaGVyaXRzKFhNTEh0dHBSZXF1ZXN0LCBfWE1MSHR0cFJlcXVlc3RFdmVudFQpO1xuXG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoWE1MSHR0cFJlcXVlc3QpO1xuXG4gIGZ1bmN0aW9uIFhNTEh0dHBSZXF1ZXN0KCkge1xuICAgIHZhciBfdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBYTUxIdHRwUmVxdWVzdCk7XG5cbiAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG5ldyBfWE1MSHR0cFJlcXVlc3QoKSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwiX2lzTG9jYWxcIiwgZmFsc2UpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcIl9yZWFkeVN0YXRlXCIsIHZvaWQgMCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwiX3Jlc3BvbnNlXCIsIHZvaWQgMCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwiX3Jlc3BvbnNlVGV4dFwiLCB2b2lkIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcIl9yZXNwb25zZVVSTFwiLCB2b2lkIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcIl9yZXNwb25zZVhNTFwiLCB2b2lkIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcIl9zdGF0dXNcIiwgdm9pZCAwKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJfc3RhdHVzVGV4dFwiLCB2b2lkIDApO1xuXG4gICAgdmFyIHhociA9IF90aGlzLl94aHI7XG5cbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciBldmVudCA9IG5ldyBfRXZlbnRbXCJkZWZhdWx0XCJdKFwicmVhZHlzdGF0ZWNoYW5nZVwiKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChPYmplY3QuYXNzaWduKGV2ZW50LCBlKSk7XG4gICAgfS5iaW5kKF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpKTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhYTUxIdHRwUmVxdWVzdCwgW3tcbiAgICBrZXk6IFwiYWJvcnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWJvcnQoKSB7XG4gICAgICB0aGlzLl94aHIuYWJvcnQoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0QWxsUmVzcG9uc2VIZWFkZXJzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEFsbFJlc3BvbnNlSGVhZGVycygpIHtcbiAgICAgIHJldHVybiB0aGlzLl94aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldFJlc3BvbnNlSGVhZGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFJlc3BvbnNlSGVhZGVyKG5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLl94aHIuZ2V0UmVzcG9uc2VIZWFkZXIobmFtZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm9wZW5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb3BlbihtZXRob2QsIHVybCwgYXN5bmMsIHVzZXIsIHBhc3N3b3JkKSB7XG4gICAgICBpZiAodHlwZW9mIHVybCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB2YXIgX3VybCA9IHVybC50b0xvY2FsZVN0cmluZygpO1xuXG4gICAgICAgIGlmIChfdXJsLnN0YXJ0c1dpdGgoXCJodHRwOi8vXCIpIHx8IF91cmwuc3RhcnRzV2l0aChcImh0dHBzOi8vXCIpKSB7XG4gICAgICAgICAgdmFyIF90aGlzJF94aHI7XG5cbiAgICAgICAgICB0aGlzLl9pc0xvY2FsID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIChfdGhpcyRfeGhyID0gdGhpcy5feGhyKS5vcGVuLmFwcGx5KF90aGlzJF94aHIsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5faXNMb2NhbCA9IHRydWU7XG4gICAgICB0aGlzLl91cmwgPSB1cmw7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm92ZXJyaWRlTWltZVR5cGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb3ZlcnJpZGVNaW1lVHlwZSgpIHtcbiAgICAgIHZhciBfdGhpcyRfeGhyMjtcblxuICAgICAgcmV0dXJuIChfdGhpcyRfeGhyMiA9IHRoaXMuX3hocikub3ZlcnJpZGVNaW1lVHlwZS5hcHBseShfdGhpcyRfeGhyMiwgYXJndW1lbnRzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2VuZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZW5kKCkge1xuICAgICAgaWYgKHRoaXMuX2lzTG9jYWwpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgaXNCaW5hcnkgPSB0aGlzLl94aHIucmVzcG9uc2VUeXBlID09PSBcImFycmF5YnVmZmVyXCI7XG4gICAgICAgIGZzbS5yZWFkRmlsZSh7XG4gICAgICAgICAgZmlsZVBhdGg6IHRoaXMuX3VybCxcbiAgICAgICAgICBlbmNvZGluZzogaXNCaW5hcnkgPyBcImJpbmFyeVwiIDogXCJ1dGY4XCIsXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgICAgIHNlbGYuX3N0YXR1cyA9IDIwMDtcbiAgICAgICAgICAgIHNlbGYuX3JlYWR5U3RhdGUgPSA0O1xuICAgICAgICAgICAgc2VsZi5fcmVzcG9uc2UgPSBzZWxmLl9yZXNwb25zZVRleHQgPSByZXMuZGF0YTtcblxuICAgICAgICAgICAgaWYgKGlzQmluYXJ5KSB7XG4gICAgICAgICAgICAgIF9GaWxlQ2FjaGVbXCJkZWZhdWx0XCJdLnNldENhY2hlKHNlbGYuX3VybCwgcmVzLmRhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZXZlbnRQcm9ncmVzc1N0YXJ0ID0gbmV3IF9FdmVudFtcImRlZmF1bHRcIl0oXCJwcm9ncmVzc1wiKTtcbiAgICAgICAgICAgIGV2ZW50UHJvZ3Jlc3NTdGFydC5sb2FkZWQgPSAwO1xuICAgICAgICAgICAgZXZlbnRQcm9ncmVzc1N0YXJ0LnRvdGFsID0gaXNCaW5hcnkgPyByZXMuZGF0YS5ieXRlTGVuZ3RoIDogcmVzLmRhdGEubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIGV2ZW50UHJvZ3Jlc3NFbmQgPSBuZXcgX0V2ZW50W1wiZGVmYXVsdFwiXShcInByb2dyZXNzXCIpO1xuICAgICAgICAgICAgZXZlbnRQcm9ncmVzc0VuZC5sb2FkZWQgPSBldmVudFByb2dyZXNzU3RhcnQudG90YWw7XG4gICAgICAgICAgICBldmVudFByb2dyZXNzRW5kLnRvdGFsID0gZXZlbnRQcm9ncmVzc1N0YXJ0LnRvdGFsO1xuICAgICAgICAgICAgc2VsZi5kaXNwYXRjaEV2ZW50KG5ldyBfRXZlbnRbXCJkZWZhdWx0XCJdKFwibG9hZHN0YXJ0XCIpKTtcbiAgICAgICAgICAgIHNlbGYuZGlzcGF0Y2hFdmVudChldmVudFByb2dyZXNzU3RhcnQpO1xuICAgICAgICAgICAgc2VsZi5kaXNwYXRjaEV2ZW50KGV2ZW50UHJvZ3Jlc3NFbmQpO1xuICAgICAgICAgICAgc2VsZi5kaXNwYXRjaEV2ZW50KG5ldyBfRXZlbnRbXCJkZWZhdWx0XCJdKFwibG9hZFwiKSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICBpZiAocmVzLmVyckNvZGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgc2VsZi5fc3RhdHVzID0gNDA0O1xuICAgICAgICAgICAgICBzZWxmLl9yZWFkeVN0YXRlID0gNDtcbiAgICAgICAgICAgICAgc2VsZi5kaXNwYXRjaEV2ZW50KG5ldyBfRXZlbnRbXCJkZWZhdWx0XCJdKFwibG9hZHN0YXJ0XCIpKTtcbiAgICAgICAgICAgICAgc2VsZi5kaXNwYXRjaEV2ZW50KG5ldyBfRXZlbnRbXCJkZWZhdWx0XCJdKFwibG9hZFwiKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IF9FdmVudFtcImRlZmF1bHRcIl0oXCJlcnJvclwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IF9FdmVudFtcImRlZmF1bHRcIl0oXCJsb2FkZW5kXCIpKTtcbiAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgX3RoaXMkX3hocjM7XG5cbiAgICAgICAgKF90aGlzJF94aHIzID0gdGhpcy5feGhyKS5zZW5kLmFwcGx5KF90aGlzJF94aHIzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzZXRSZXF1ZXN0SGVhZGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIoKSB7XG4gICAgICB2YXIgX3RoaXMkX3hocjQ7XG5cbiAgICAgIChfdGhpcyRfeGhyNCA9IHRoaXMuX3hocikuc2V0UmVxdWVzdEhlYWRlci5hcHBseShfdGhpcyRfeGhyNCwgYXJndW1lbnRzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVhZHlTdGF0ZVwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgaWYgKHRoaXMuX2lzTG9jYWwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlYWR5U3RhdGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5feGhyLnJlYWR5U3RhdGU7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlc3BvbnNlXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICBpZiAodGhpcy5faXNMb2NhbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5feGhyLnJlc3BvbnNlO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZXNwb25zZVRleHRcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIGlmICh0aGlzLl9pc0xvY2FsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZVRleHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5feGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVzcG9uc2VUeXBlXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5feGhyLnJlc3BvbnNlVHlwZTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICB0aGlzLl94aHIucmVzcG9uc2VUeXBlID0gdmFsdWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlc3BvbnNlVVJMXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICBpZiAodGhpcy5faXNMb2NhbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VVUkw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5feGhyLnJlc3BvbnNlVVJMO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZXNwb25zZVhNTFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgaWYgKHRoaXMuX2lzTG9jYWwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlWE1MO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3hoci5yZXNwb25zZVhNTDtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic3RhdHVzXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICBpZiAodGhpcy5faXNMb2NhbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RhdHVzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3hoci5zdGF0dXM7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInN0YXR1c1RleHRcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIGlmICh0aGlzLl9pc0xvY2FsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0dXNUZXh0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3hoci5zdGF0dXNUZXh0O1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0aW1lb3V0XCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5feGhyLnRpbWVvdXQ7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgdGhpcy5feGhyLnRpbWVvdXQgPSB2YWx1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidXBsb2FkXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5feGhyLnVwbG9hZDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwid2l0aENyZWRlbnRpYWxzXCIsXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgIHRoaXMuX3hoci53aXRoQ3JlZGVudGlhbHMgPSB2YWx1ZTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3hoci53aXRoQ3JlZGVudGlhbHM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFhNTEh0dHBSZXF1ZXN0O1xufShfWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldFtcImRlZmF1bHRcIl0pO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IFhNTEh0dHBSZXF1ZXN0O1xuXG59LHtcIi4vRXZlbnRcIjo5LFwiLi9YTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0XCI6MzUsXCIuL3V0aWwvRmlsZUNhY2hlXCI6NTJ9XSwzNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfRXZlbnRUYXJnZXQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9FdmVudFRhcmdldFwiKSk7XG5cbnZhciBfRXZlbnQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0V2ZW50XCIpKTtcblxudmFyIF9GaWxlQ2FjaGUgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL3V0aWwvRmlsZUNhY2hlXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7IHZhciBoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0ID0gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpOyByZXR1cm4gZnVuY3Rpb24gX2NyZWF0ZVN1cGVySW50ZXJuYWwoKSB7IHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSwgcmVzdWx0OyBpZiAoaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCkgeyB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yOyByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpOyB9IGVsc2UgeyByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9IHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpOyB9OyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7IH1cblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7IGlmIChzZWxmID09PSB2b2lkIDApIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7IGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTsgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTsgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTsgdHJ5IHsgRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChSZWZsZWN0LmNvbnN0cnVjdChEYXRlLCBbXSwgZnVuY3Rpb24gKCkge30pKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldCA9IGZ1bmN0aW9uIChfRXZlbnRUYXJnZXQpIHtcbiAgX2luaGVyaXRzKFhNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXQsIF9FdmVudFRhcmdldCk7XG5cbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0KTtcblxuICBmdW5jdGlvbiBYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0KHhocikge1xuICAgIHZhciBfdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0KTtcblxuICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcyk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwiX3hoclwiLCB2b2lkIDApO1xuXG4gICAgX3RoaXMuX3hociA9IHhocjtcblxuICAgIHhoci5vbmFib3J0ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciBldmVudCA9IG5ldyBfRXZlbnRbXCJkZWZhdWx0XCJdKFwiYWJvcnRcIik7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoT2JqZWN0LmFzc2lnbihldmVudCwgZSkpO1xuICAgIH0uYmluZChfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSk7XG5cbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgZXZlbnQgPSBuZXcgX0V2ZW50W1wiZGVmYXVsdFwiXShcImVycm9yXCIpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KE9iamVjdC5hc3NpZ24oZXZlbnQsIGUpKTtcbiAgICB9LmJpbmQoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcykpO1xuXG4gICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAodGhpcy5yZXNwb25zZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgICAgIF9GaWxlQ2FjaGVbXCJkZWZhdWx0XCJdLnNldEl0ZW0odGhpcy5yZXNwb25zZSwgdGhpcy5fdXJsKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGV2ZW50ID0gbmV3IF9FdmVudFtcImRlZmF1bHRcIl0oXCJsb2FkXCIpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KE9iamVjdC5hc3NpZ24oZXZlbnQsIGUpKTtcbiAgICB9LmJpbmQoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcykpO1xuXG4gICAgeGhyLm9ubG9hZHN0YXJ0ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciBldmVudCA9IG5ldyBfRXZlbnRbXCJkZWZhdWx0XCJdKFwibG9hZHN0YXJ0XCIpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KE9iamVjdC5hc3NpZ24oZXZlbnQsIGUpKTtcbiAgICB9LmJpbmQoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcykpO1xuXG4gICAgeGhyLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIGV2ZW50ID0gbmV3IF9FdmVudFtcImRlZmF1bHRcIl0oXCJwcm9ncmVzc1wiKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChPYmplY3QuYXNzaWduKGV2ZW50LCBlKSk7XG4gICAgfS5iaW5kKF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpKTtcblxuICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIGV2ZW50ID0gbmV3IF9FdmVudFtcImRlZmF1bHRcIl0oXCJ0aW1lb3V0XCIpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KE9iamVjdC5hc3NpZ24oZXZlbnQsIGUpKTtcbiAgICB9LmJpbmQoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcykpO1xuXG4gICAgeGhyLm9ubG9hZGVuZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgZXZlbnQgPSBuZXcgX0V2ZW50W1wiZGVmYXVsdFwiXShcImxvYWRlbmRcIik7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoT2JqZWN0LmFzc2lnbihldmVudCwgZSkpO1xuICAgIH0uYmluZChfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSk7XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICByZXR1cm4gWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldDtcbn0oX0V2ZW50VGFyZ2V0MltcImRlZmF1bHRcIl0pO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IFhNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXQ7XG5cbn0se1wiLi9FdmVudFwiOjksXCIuL0V2ZW50VGFyZ2V0XCI6MTAsXCIuL3V0aWwvRmlsZUNhY2hlXCI6NTJ9XSwzNjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfQXVkaW9Ob2RlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vQXVkaW9Ob2RlXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuZnVuY3Rpb24gX2NyZWF0ZVN1cGVyKERlcml2ZWQpIHsgdmFyIGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QgPSBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCk7IHJldHVybiBmdW5jdGlvbiBfY3JlYXRlU3VwZXJJbnRlcm5hbCgpIHsgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLCByZXN1bHQ7IGlmIChoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KSB7IHZhciBOZXdUYXJnZXQgPSBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3I7IHJlc3VsdCA9IFJlZmxlY3QuY29uc3RydWN0KFN1cGVyLCBhcmd1bWVudHMsIE5ld1RhcmdldCk7IH0gZWxzZSB7IHJlc3VsdCA9IFN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH0gcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIHJlc3VsdCk7IH07IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbnZhciBBbmFseXNlck5vZGUgPSBmdW5jdGlvbiAoX0F1ZGlvTm9kZSkge1xuICBfaW5oZXJpdHMoQW5hbHlzZXJOb2RlLCBfQXVkaW9Ob2RlKTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKEFuYWx5c2VyTm9kZSk7XG5cbiAgZnVuY3Rpb24gQW5hbHlzZXJOb2RlKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQW5hbHlzZXJOb2RlKTtcblxuICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgY29udGV4dCk7XG4gICAgX3RoaXMuX2ZmdFNpemU7XG4gICAgX3RoaXMuZnJlcXVlbmN5QmluQ291bnQ7XG4gICAgX3RoaXMubWluRGVjaWJlbHM7XG4gICAgX3RoaXMubWF4RGVjaWJlbHM7XG4gICAgX3RoaXMuc21vb3RoaW5nVGltZUNvbnN0YW50O1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhBbmFseXNlck5vZGUsIFt7XG4gICAga2V5OiBcImdldEZsb2F0RnJlcXVlbmN5RGF0YVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRGbG9hdEZyZXF1ZW5jeURhdGEoYXJyYXkpIHt9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0Qnl0ZUZyZXF1ZW5jeURhdGFcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEoZGF0YUFycmF5KSB7XG4gICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoZGF0YUFycmF5Lmxlbmd0aCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEZsb2F0VGltZURvbWFpbkRhdGFcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RmxvYXRUaW1lRG9tYWluRGF0YShkYXRhQXJyYXkpIHt9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0Qnl0ZVRpbWVEb21haW5EYXRhXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEJ5dGVUaW1lRG9tYWluRGF0YShkYXRhQXJyYXkpIHt9XG4gIH0sIHtcbiAgICBrZXk6IFwiZmZ0U2l6ZVwiLFxuICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICB0aGlzLl9mZnRTaXplID0gdmFsdWU7XG4gICAgICB0aGlzLmZyZXF1ZW5jeUJpbkNvdW50ID0gdmFsdWUgLyAyO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZmZ0U2l6ZTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQW5hbHlzZXJOb2RlO1xufShfQXVkaW9Ob2RlMltcImRlZmF1bHRcIl0pO1xuXG52YXIgX2RlZmF1bHQgPSBBbmFseXNlck5vZGU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHtcIi4vQXVkaW9Ob2RlXCI6NDJ9XSwzNzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX0ZpbGVDYWNoZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uL3V0aWwvRmlsZUNhY2hlXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxudmFyIGFlID0gcmFsLkF1ZGlvRW5naW5lO1xuXG52YXIgQXVkaW9CdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEF1ZGlvQnVmZmVyKGNvbnRleHQsIGJ1ZmZlcikge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBBdWRpb0J1ZmZlcik7XG5cbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMudXJsID0gXCJcIjtcbiAgICB0aGlzLl9zYW1wbGVSYXRlID0gNDgwMDA7XG4gICAgdGhpcy5fbGVuZ3RoID0gMzg2NjgxO1xuICAgIHRoaXMuX2R1cmF0aW9uID0gMDtcbiAgICB0aGlzLl9udW1iZXJPZkNoYW5uZWxzID0gNDgwMDA7XG5cbiAgICBfRmlsZUNhY2hlW1wiZGVmYXVsdFwiXS5nZXRQYXRoKGJ1ZmZlciwgZnVuY3Rpb24gKHVybCkge1xuICAgICAgaWYgKCF1cmwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgIGFlLnByZWxvYWQodXJsLCBmdW5jdGlvbiAoaXNTdWNjZWVkLCBkdXJhdGlvbikge1xuICAgICAgICBpZiAoaXNTdWNjZWVkKSB7XG4gICAgICAgICAgdGhpcy5fZHVyYXRpb24gPSBkdXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEF1ZGlvQnVmZmVyLCBbe1xuICAgIGtleTogXCJzYW1wbGVSYXRlXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2FtcGxlUmF0ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibGVuZ3RoXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbGVuZ3RoO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkdXJhdGlvblwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2R1cmF0aW9uO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJudW1iZXJPZkNoYW5uZWxzXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbnVtYmVyT2ZDaGFubmVscztcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQXVkaW9CdWZmZXI7XG59KCk7XG5cbnZhciBfZGVmYXVsdCA9IEF1ZGlvQnVmZmVyO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7XCIuLi91dGlsL0ZpbGVDYWNoZVwiOjUyfV0sMzg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX0F1ZGlvTm9kZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0F1ZGlvTm9kZVwiKSk7XG5cbnZhciBfQXVkaW9QYXJhbSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vQXVkaW9QYXJhbVwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7IHZhciBoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0ID0gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpOyByZXR1cm4gZnVuY3Rpb24gX2NyZWF0ZVN1cGVySW50ZXJuYWwoKSB7IHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSwgcmVzdWx0OyBpZiAoaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCkgeyB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yOyByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpOyB9IGVsc2UgeyByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9IHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpOyB9OyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7IH1cblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7IGlmIChzZWxmID09PSB2b2lkIDApIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7IGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTsgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTsgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTsgdHJ5IHsgRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChSZWZsZWN0LmNvbnN0cnVjdChEYXRlLCBbXSwgZnVuY3Rpb24gKCkge30pKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG52YXIgQXVkaW9CdWZmZXJTb3VyY2VOb2RlID0gZnVuY3Rpb24gKF9BdWRpb05vZGUpIHtcbiAgX2luaGVyaXRzKEF1ZGlvQnVmZmVyU291cmNlTm9kZSwgX0F1ZGlvTm9kZSk7XG5cbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihBdWRpb0J1ZmZlclNvdXJjZU5vZGUpO1xuXG4gIGZ1bmN0aW9uIEF1ZGlvQnVmZmVyU291cmNlTm9kZShjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEF1ZGlvQnVmZmVyU291cmNlTm9kZSk7XG5cbiAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGNvbnRleHQpO1xuICAgIF90aGlzLmJ1ZmZlciA9IG51bGw7XG4gICAgX3RoaXMuZGV0dW5lID0gbmV3IF9BdWRpb1BhcmFtW1wiZGVmYXVsdFwiXSh7XG4gICAgICB2YWx1ZTogMFxuICAgIH0pO1xuICAgIF90aGlzLl9sb29wID0gZmFsc2U7XG4gICAgX3RoaXMubG9vcFN0YXJ0ID0gMDtcbiAgICBfdGhpcy5sb29wRW5kID0gMDtcbiAgICBfdGhpcy5fcGxheWJhY2tSYXRlID0gbmV3IF9BdWRpb1BhcmFtW1wiZGVmYXVsdFwiXSh7XG4gICAgICB2YWx1ZTogMS4wXG4gICAgfSk7XG4gICAgX3RoaXMuYXVkaW9FbmdpbmUgPSByYWwuQXVkaW9FbmdpbmU7XG4gICAgX3RoaXMuYXVkaW9JRCA9IC0xO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhBdWRpb0J1ZmZlclNvdXJjZU5vZGUsIFt7XG4gICAga2V5OiBcInN0YXJ0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0YXJ0KHdoZW4sIG9mZnNldCwgZHVyYXRpb24pIHtcbiAgICAgIGlmICghdGhpcy5idWZmZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgYXVkaW9FbmdpbmUgPSB0aGlzLmF1ZGlvRW5naW5lO1xuXG4gICAgICBpZiAodGhpcy5hdWRpb0lEICE9PSAtMSkge1xuICAgICAgICBhdWRpb0VuZ2luZS5zdG9wKHRoaXMuYXVkaW9JRCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBhdWRpb0lEID0gdGhpcy5hdWRpb0lEID0gYXVkaW9FbmdpbmUucGxheSh0aGlzLmJ1ZmZlci51cmwsIHRoaXMubG9vcCwgMSk7XG4gICAgICBhdWRpb0VuZ2luZS5zZXRGaW5pc2hDYWxsYmFjayhhdWRpb0lELCB0aGlzLm9uZW5kZWQpO1xuICAgICAgYXVkaW9FbmdpbmUuc2V0Q3VycmVudFRpbWUoYXVkaW9JRCwgdGhpcy5sb29wU3RhcnQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzdG9wXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0b3Aod2hlbikge1xuICAgICAgdmFyIGF1ZGlvRW5naW5lID0gdGhpcy5hdWRpb0VuZ2luZTtcblxuICAgICAgaWYgKHRoaXMuYXVkaW9JRCA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBhdWRpb0VuZ2luZS5zdG9wKHRoaXMuYXVkaW9JRCk7XG4gICAgICB0aGlzLmF1ZGlvSUQgPSAtMTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwib25lbmRlZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvbmVuZGVkKCkge31cbiAgfSwge1xuICAgIGtleTogXCJwbGF5YmFja1JhdGVcIixcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgY29uc29sZS53YXJuKFwicGxheWJhY2tSYXRlIG5vbnN1cHBvcnRcIik7XG4gICAgICB0aGlzLl9wbGF5YmFja1JhdGUgPSB2YWx1ZTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3BsYXliYWNrUmF0ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibG9vcFwiLFxuICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICB2YXIgYXVkaW9FbmdpbmUgPSB0aGlzLmF1ZGlvRW5naW5lO1xuICAgICAgdmFyIGF1ZGlvSUQgPSB0aGlzLmF1ZGlvSUQ7XG4gICAgICB2YXIgbG9vcCA9ICEhdmFsdWU7XG5cbiAgICAgIGlmIChhdWRpb0lEICE9PSAtMSAmJiBhdWRpb0VuZ2luZSkge1xuICAgICAgICBhdWRpb0VuZ2luZS5zZXRMb29wKGF1ZGlvSUQsIGxvb3ApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9sb29wID0gbG9vcDtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2xvb3A7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEF1ZGlvQnVmZmVyU291cmNlTm9kZTtcbn0oX0F1ZGlvTm9kZTJbXCJkZWZhdWx0XCJdKTtcblxudmFyIF9kZWZhdWx0ID0gQXVkaW9CdWZmZXJTb3VyY2VOb2RlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7XCIuL0F1ZGlvTm9kZVwiOjQyLFwiLi9BdWRpb1BhcmFtXCI6NDN9XSwzOTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfQmFzZUF1ZGlvQ29udGV4dDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0Jhc2VBdWRpb0NvbnRleHRcIikpO1xuXG52YXIgX01lZGlhRWxlbWVudEF1ZGlvU291cmNlTm9kZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vTWVkaWFFbGVtZW50QXVkaW9Tb3VyY2VOb2RlXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuZnVuY3Rpb24gX2NyZWF0ZVN1cGVyKERlcml2ZWQpIHsgdmFyIGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QgPSBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCk7IHJldHVybiBmdW5jdGlvbiBfY3JlYXRlU3VwZXJJbnRlcm5hbCgpIHsgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLCByZXN1bHQ7IGlmIChoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KSB7IHZhciBOZXdUYXJnZXQgPSBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3I7IHJlc3VsdCA9IFJlZmxlY3QuY29uc3RydWN0KFN1cGVyLCBhcmd1bWVudHMsIE5ld1RhcmdldCk7IH0gZWxzZSB7IHJlc3VsdCA9IFN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH0gcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIHJlc3VsdCk7IH07IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbnZhciBBdWRpb0NvbnRleHQgPSBmdW5jdGlvbiAoX0Jhc2VBdWRpb0NvbnRleHQpIHtcbiAgX2luaGVyaXRzKEF1ZGlvQ29udGV4dCwgX0Jhc2VBdWRpb0NvbnRleHQpO1xuXG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoQXVkaW9Db250ZXh0KTtcblxuICBmdW5jdGlvbiBBdWRpb0NvbnRleHQob3B0aW9ucykge1xuICAgIHZhciBfdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBBdWRpb0NvbnRleHQpO1xuXG4gICAgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICBfdGhpcy5iYXNlTGF0ZW5jeTtcbiAgICBfdGhpcy5vdXRwdXRMYXRlbmN5O1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhBdWRpb0NvbnRleHQsIFt7XG4gICAga2V5OiBcImNsb3NlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgICAgY29uc29sZS5sb2coXCJBdWRpb0NvbnRleHQgY2xvc2VcIik7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNyZWF0ZU1lZGlhRWxlbWVudFNvdXJjZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UobXlNZWRpYUVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBuZXcgX01lZGlhRWxlbWVudEF1ZGlvU291cmNlTm9kZVtcImRlZmF1bHRcIl0odGhpcywge1xuICAgICAgICBtZWRpYUVsZW1lbnQ6IG15TWVkaWFFbGVtZW50XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY3JlYXRlTWVkaWFTdHJlYW1Tb3VyY2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlTWVkaWFTdHJlYW1Tb3VyY2UoKSB7fVxuICB9LCB7XG4gICAga2V5OiBcImNyZWF0ZU1lZGlhU3RyZWFtRGVzdGluYXRpb25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlTWVkaWFTdHJlYW1EZXN0aW5hdGlvbigpIHt9XG4gIH0sIHtcbiAgICBrZXk6IFwiY3JlYXRlTWVkaWFTdHJlYW1UcmFja1NvdXJjZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVNZWRpYVN0cmVhbVRyYWNrU291cmNlKCkge31cbiAgfSwge1xuICAgIGtleTogXCJnZXRPdXRwdXRUaW1lc3RhbXBcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0T3V0cHV0VGltZXN0YW1wKCkge31cbiAgfSwge1xuICAgIGtleTogXCJyZXN1bWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVzdW1lKCkge31cbiAgfSwge1xuICAgIGtleTogXCJzdXNwZW5kXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN1c3BlbmQoKSB7fVxuICB9XSk7XG5cbiAgcmV0dXJuIEF1ZGlvQ29udGV4dDtcbn0oX0Jhc2VBdWRpb0NvbnRleHQyW1wiZGVmYXVsdFwiXSk7XG5cbnZhciBfZGVmYXVsdCA9IEF1ZGlvQ29udGV4dDtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se1wiLi9CYXNlQXVkaW9Db250ZXh0XCI6NDUsXCIuL01lZGlhRWxlbWVudEF1ZGlvU291cmNlTm9kZVwiOjQ4fV0sNDA6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX0F1ZGlvTm9kZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0F1ZGlvTm9kZVwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5mdW5jdGlvbiBfY3JlYXRlU3VwZXIoRGVyaXZlZCkgeyB2YXIgaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCA9IF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKTsgcmV0dXJuIGZ1bmN0aW9uIF9jcmVhdGVTdXBlckludGVybmFsKCkgeyB2YXIgU3VwZXIgPSBfZ2V0UHJvdG90eXBlT2YoRGVyaXZlZCksIHJlc3VsdDsgaWYgKGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QpIHsgdmFyIE5ld1RhcmdldCA9IF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3RvcjsgcmVzdWx0ID0gUmVmbGVjdC5jb25zdHJ1Y3QoU3VwZXIsIGFyZ3VtZW50cywgTmV3VGFyZ2V0KTsgfSBlbHNlIHsgcmVzdWx0ID0gU3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfSByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgcmVzdWx0KTsgfTsgfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7IHJldHVybiBjYWxsOyB9IHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpOyB9XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikgeyBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkgeyBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7IGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7IGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7IHRyeSB7IERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoRGF0ZSwgW10sIGZ1bmN0aW9uICgpIHt9KSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7IH07IHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7IH1cblxudmFyIEF1ZGlvRGVzdGluYXRpb25Ob2RlID0gZnVuY3Rpb24gKF9BdWRpb05vZGUpIHtcbiAgX2luaGVyaXRzKEF1ZGlvRGVzdGluYXRpb25Ob2RlLCBfQXVkaW9Ob2RlKTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKEF1ZGlvRGVzdGluYXRpb25Ob2RlKTtcblxuICBmdW5jdGlvbiBBdWRpb0Rlc3RpbmF0aW9uTm9kZShjb250ZXh0KSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEF1ZGlvRGVzdGluYXRpb25Ob2RlKTtcblxuICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgY29udGV4dCk7XG4gICAgX3RoaXMubWF4Q2hhbm5lbENvdW50ID0gMjtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICByZXR1cm4gQXVkaW9EZXN0aW5hdGlvbk5vZGU7XG59KF9BdWRpb05vZGUyW1wiZGVmYXVsdFwiXSk7XG5cbnZhciBfZGVmYXVsdCA9IEF1ZGlvRGVzdGluYXRpb25Ob2RlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7XCIuL0F1ZGlvTm9kZVwiOjQyfV0sNDE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX0F1ZGlvTm9kZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0F1ZGlvTm9kZVwiKSk7XG5cbnZhciBfQXVkaW9QYXJhbSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vQXVkaW9QYXJhbVwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7IHZhciBoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0ID0gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpOyByZXR1cm4gZnVuY3Rpb24gX2NyZWF0ZVN1cGVySW50ZXJuYWwoKSB7IHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSwgcmVzdWx0OyBpZiAoaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCkgeyB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yOyByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpOyB9IGVsc2UgeyByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9IHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpOyB9OyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7IH1cblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7IGlmIChzZWxmID09PSB2b2lkIDApIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7IGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTsgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTsgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTsgdHJ5IHsgRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChSZWZsZWN0LmNvbnN0cnVjdChEYXRlLCBbXSwgZnVuY3Rpb24gKCkge30pKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG52YXIgQXVkaW9MaXN0ZW5lciA9IGZ1bmN0aW9uIChfQXVkaW9Ob2RlKSB7XG4gIF9pbmhlcml0cyhBdWRpb0xpc3RlbmVyLCBfQXVkaW9Ob2RlKTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKEF1ZGlvTGlzdGVuZXIpO1xuXG4gIGZ1bmN0aW9uIEF1ZGlvTGlzdGVuZXIoY29udGV4dCkge1xuICAgIHZhciBfdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBBdWRpb0xpc3RlbmVyKTtcblxuICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgY29udGV4dCk7XG4gICAgX3RoaXMucG9zaXRpb25YID0gbmV3IF9BdWRpb1BhcmFtW1wiZGVmYXVsdFwiXSh7XG4gICAgICB2YWx1ZTogMFxuICAgIH0pO1xuICAgIF90aGlzLnBvc2l0aW9uWSA9IG5ldyBfQXVkaW9QYXJhbVtcImRlZmF1bHRcIl0oe1xuICAgICAgdmFsdWU6IDBcbiAgICB9KTtcbiAgICBfdGhpcy5wb3NpdGlvblogPSBuZXcgX0F1ZGlvUGFyYW1bXCJkZWZhdWx0XCJdKHtcbiAgICAgIHZhbHVlOiAwXG4gICAgfSk7XG4gICAgX3RoaXMuZm9yd2FyZFggPSBuZXcgX0F1ZGlvUGFyYW1bXCJkZWZhdWx0XCJdKHtcbiAgICAgIHZhbHVlOiAwXG4gICAgfSk7XG4gICAgX3RoaXMuZm9yd2FyZFkgPSBuZXcgX0F1ZGlvUGFyYW1bXCJkZWZhdWx0XCJdKHtcbiAgICAgIHZhbHVlOiAwXG4gICAgfSk7XG4gICAgX3RoaXMuZm9yd2FyZFogPSBuZXcgX0F1ZGlvUGFyYW1bXCJkZWZhdWx0XCJdKHtcbiAgICAgIHZhbHVlOiAtMVxuICAgIH0pO1xuICAgIF90aGlzLnVwWCA9IG5ldyBfQXVkaW9QYXJhbVtcImRlZmF1bHRcIl0oe1xuICAgICAgdmFsdWU6IDBcbiAgICB9KTtcbiAgICBfdGhpcy51cFkgPSBuZXcgX0F1ZGlvUGFyYW1bXCJkZWZhdWx0XCJdKHtcbiAgICAgIHZhbHVlOiAxXG4gICAgfSk7XG4gICAgX3RoaXMudXBaID0gbmV3IF9BdWRpb1BhcmFtW1wiZGVmYXVsdFwiXSh7XG4gICAgICB2YWx1ZTogMFxuICAgIH0pO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhBdWRpb0xpc3RlbmVyLCBbe1xuICAgIGtleTogXCJzZXRPcmllbnRhdGlvblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRPcmllbnRhdGlvbih4LCB5LCB6KSB7fVxuICB9LCB7XG4gICAga2V5OiBcInNldFBvc2l0aW9uXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldFBvc2l0aW9uKHgsIHksIHopIHtcbiAgICAgIHggPSB4IHx8IDA7XG4gICAgICB5ID0geSB8fCAwO1xuICAgICAgeiA9IHogfHwgMDtcbiAgICAgIHRoaXMucG9zaXRpb25YLnZhbHVlID0geDtcbiAgICAgIHRoaXMucG9zaXRpb25ZLnZhbHVlID0geTtcbiAgICAgIHRoaXMucG9zaXRpb25aLnZhbHVlID0gejtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQXVkaW9MaXN0ZW5lcjtcbn0oX0F1ZGlvTm9kZTJbXCJkZWZhdWx0XCJdKTtcblxudmFyIF9kZWZhdWx0ID0gQXVkaW9MaXN0ZW5lcjtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se1wiLi9BdWRpb05vZGVcIjo0MixcIi4vQXVkaW9QYXJhbVwiOjQzfV0sNDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX0V2ZW50VGFyZ2V0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uL0V2ZW50VGFyZ2V0XCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuZnVuY3Rpb24gX2NyZWF0ZVN1cGVyKERlcml2ZWQpIHsgdmFyIGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QgPSBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCk7IHJldHVybiBmdW5jdGlvbiBfY3JlYXRlU3VwZXJJbnRlcm5hbCgpIHsgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLCByZXN1bHQ7IGlmIChoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KSB7IHZhciBOZXdUYXJnZXQgPSBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3I7IHJlc3VsdCA9IFJlZmxlY3QuY29uc3RydWN0KFN1cGVyLCBhcmd1bWVudHMsIE5ld1RhcmdldCk7IH0gZWxzZSB7IHJlc3VsdCA9IFN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH0gcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIHJlc3VsdCk7IH07IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbnZhciBBdWRpb05vZGUgPSBmdW5jdGlvbiAoX0V2ZW50VGFyZ2V0KSB7XG4gIF9pbmhlcml0cyhBdWRpb05vZGUsIF9FdmVudFRhcmdldCk7XG5cbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihBdWRpb05vZGUpO1xuXG4gIGZ1bmN0aW9uIEF1ZGlvTm9kZShjb250ZXh0KSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEF1ZGlvTm9kZSk7XG5cbiAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpO1xuICAgIF90aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgICBfdGhpcy5udW1iZXJPZklucHV0cyA9IDE7XG4gICAgX3RoaXMubnVtYmVyT2ZPdXRwdXRzID0gMTtcbiAgICBfdGhpcy5jaGFubmVsQ291bnQgPSAyO1xuICAgIF90aGlzLmNoYW5uZWxDb3VudE1vZGUgPSBcImV4cGxpY2l0XCI7XG4gICAgX3RoaXMuY2hhbm5lbEludGVycHJldGF0aW9uID0gXCJzcGVha2Vyc1wiO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhBdWRpb05vZGUsIFt7XG4gICAga2V5OiBcImNvbm5lY3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY29ubmVjdChkZXN0aW5hdGlvbiwgb3V0cHV0SW5kZXgsIGlucHV0SW5kZXgpIHt9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGlzY29ubmVjdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNjb25uZWN0KCkge31cbiAgfSwge1xuICAgIGtleTogXCJpc051bWJlclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpc051bWJlcihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnbnVtYmVyJyB8fCBvYmogaW5zdGFuY2VvZiBOdW1iZXI7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNvbnRleHRcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jb250ZXh0O1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBBdWRpb05vZGU7XG59KF9FdmVudFRhcmdldDJbXCJkZWZhdWx0XCJdKTtcblxudmFyIF9kZWZhdWx0ID0gQXVkaW9Ob2RlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7XCIuLi9FdmVudFRhcmdldFwiOjEwfV0sNDM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG52YXIgQXVkaW9QYXJhbSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQXVkaW9QYXJhbSgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQXVkaW9QYXJhbSk7XG5cbiAgICB0aGlzLmF1dG9tYXRpb25SYXRlID0gb3B0aW9ucy5hdXRvbWF0aW9uUmF0ZSB8fCBcImEtcmF0ZVwiO1xuICAgIHRoaXMuX2RlZmF1bHRWYWx1ZSA9IG9wdGlvbnMuZGVmYXVsdFZhbHVlIHx8IDE7XG4gICAgdGhpcy5fbWF4VmFsdWUgPSBvcHRpb25zLm1heFZhbHVlIHx8IE51bWJlci5NQVhfVkFMVUU7XG4gICAgdGhpcy5fbWluVmFsdWUgPSBvcHRpb25zLm1pblZhbHVlIHx8IC1OdW1iZXIuTUFYX1ZBTFVFO1xuICAgIHRoaXMudmFsdWUgPSBvcHRpb25zLnZhbHVlIHx8IDE7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQXVkaW9QYXJhbSwgW3tcbiAgICBrZXk6IFwic2V0VmFsdWVBdFRpbWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0VmFsdWVBdFRpbWUodmFsdWUsIHN0YXJ0VGltZSkge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJsaW5lYXJSYW1wVG9WYWx1ZUF0VGltZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsaW5lYXJSYW1wVG9WYWx1ZUF0VGltZSh2YWx1ZSwgZW5kVGltZSkge1xuICAgICAgaWYgKGVuZFRpbWUgPCAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGsgPSB2YWx1ZSAvIGVuZFRpbWU7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHZhciBmdW5jID0gZnVuY3Rpb24gZnVuYyhkdCkge1xuICAgICAgICBkdCA9IGR0IC8gMTAwMDtcblxuICAgICAgICBpZiAoZHQgPiBlbmRUaW1lKSB7XG4gICAgICAgICAgZHQgPSBlbmRUaW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGR0IDwgMCkge1xuICAgICAgICAgIGR0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGVuZFRpbWUgLT0gZHQ7XG4gICAgICAgIHNlbGYudmFsdWUgKz0gZHQgKiBrO1xuXG4gICAgICAgIGlmIChlbmRUaW1lID4gMCkge1xuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJleHBvbmVudGlhbFJhbXBUb1ZhbHVlQXRUaW1lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGV4cG9uZW50aWFsUmFtcFRvVmFsdWVBdFRpbWUoKSB7fVxuICB9LCB7XG4gICAga2V5OiBcInNldFRhcmdldEF0VGltZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRUYXJnZXRBdFRpbWUodGFyZ2V0LCBzdGFydFRpbWUsIHRpbWVDb25zdGFudCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHRhcmdldDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2V0VmFsdWVDdXJ2ZUF0VGltZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRWYWx1ZUN1cnZlQXRUaW1lKCkge31cbiAgfSwge1xuICAgIGtleTogXCJjYW5jZWxTY2hlZHVsZWRWYWx1ZXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2FuY2VsU2NoZWR1bGVkVmFsdWVzKCkge31cbiAgfSwge1xuICAgIGtleTogXCJjYW5jZWxBbmRIb2xkQXRUaW1lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNhbmNlbEFuZEhvbGRBdFRpbWUoKSB7fVxuICB9LCB7XG4gICAga2V5OiBcImRlZmF1bHRWYWx1ZVwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRWYWx1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibWF4VmFsdWVcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tYXhWYWx1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibWluVmFsdWVcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9taW5WYWx1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidmFsdWVcIixcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgdmFsdWUgPSBNYXRoLm1pbih0aGlzLl9tYXhWYWx1ZSwgdmFsdWUpO1xuICAgICAgdGhpcy5fdmFsdWUgPSBNYXRoLm1heCh0aGlzLl9taW5WYWx1ZSwgdmFsdWUpO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEF1ZGlvUGFyYW07XG59KCk7XG5cbnZhciBfZGVmYXVsdCA9IEF1ZGlvUGFyYW07XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHt9XSw0NDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfQXVkaW9Ob2RlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vQXVkaW9Ob2RlXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuZnVuY3Rpb24gX2NyZWF0ZVN1cGVyKERlcml2ZWQpIHsgdmFyIGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QgPSBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCk7IHJldHVybiBmdW5jdGlvbiBfY3JlYXRlU3VwZXJJbnRlcm5hbCgpIHsgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLCByZXN1bHQ7IGlmIChoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KSB7IHZhciBOZXdUYXJnZXQgPSBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3I7IHJlc3VsdCA9IFJlZmxlY3QuY29uc3RydWN0KFN1cGVyLCBhcmd1bWVudHMsIE5ld1RhcmdldCk7IH0gZWxzZSB7IHJlc3VsdCA9IFN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH0gcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIHJlc3VsdCk7IH07IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbnZhciBBdWRpb1NjaGVkdWxlZFNvdXJjZU5vZGUgPSBmdW5jdGlvbiAoX0F1ZGlvTm9kZSkge1xuICBfaW5oZXJpdHMoQXVkaW9TY2hlZHVsZWRTb3VyY2VOb2RlLCBfQXVkaW9Ob2RlKTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKEF1ZGlvU2NoZWR1bGVkU291cmNlTm9kZSk7XG5cbiAgZnVuY3Rpb24gQXVkaW9TY2hlZHVsZWRTb3VyY2VOb2RlKGNvbnRleHQpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQXVkaW9TY2hlZHVsZWRTb3VyY2VOb2RlKTtcblxuICAgIHJldHVybiBfc3VwZXIuY2FsbCh0aGlzLCBjb250ZXh0KTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhBdWRpb1NjaGVkdWxlZFNvdXJjZU5vZGUsIFt7XG4gICAga2V5OiBcIm9uZW5kZWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb25lbmRlZChldmVudCkge31cbiAgfSwge1xuICAgIGtleTogXCJzdGFydFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdGFydCh3aGVuLCBvZmZzZXQsIGR1cmF0aW9uKSB7fVxuICB9LCB7XG4gICAga2V5OiBcInN0b3BcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcCh3aGVuKSB7fVxuICB9XSk7XG5cbiAgcmV0dXJuIEF1ZGlvU2NoZWR1bGVkU291cmNlTm9kZTtcbn0oX0F1ZGlvTm9kZTJbXCJkZWZhdWx0XCJdKTtcblxudmFyIF9kZWZhdWx0ID0gQXVkaW9TY2hlZHVsZWRTb3VyY2VOb2RlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7XCIuL0F1ZGlvTm9kZVwiOjQyfV0sNDU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX0V2ZW50VGFyZ2V0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uL0V2ZW50VGFyZ2V0XCIpKTtcblxudmFyIF9BdWRpb0xpc3RlbmVyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9BdWRpb0xpc3RlbmVyXCIpKTtcblxudmFyIF9QZXJpb2RpY1dhdmUgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL1BlcmlvZGljV2F2ZVwiKSk7XG5cbnZhciBfQXVkaW9CdWZmZXIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0F1ZGlvQnVmZmVyXCIpKTtcblxudmFyIF9EeW5hbWljc0NvbXByZXNzb3JOb2RlID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9EeW5hbWljc0NvbXByZXNzb3JOb2RlXCIpKTtcblxudmFyIF9BdWRpb0J1ZmZlclNvdXJjZU5vZGUgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0F1ZGlvQnVmZmVyU291cmNlTm9kZVwiKSk7XG5cbnZhciBfQXVkaW9EZXN0aW5hdGlvbk5vZGUgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0F1ZGlvRGVzdGluYXRpb25Ob2RlXCIpKTtcblxudmFyIF9Pc2NpbGxhdG9yTm9kZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vT3NjaWxsYXRvck5vZGVcIikpO1xuXG52YXIgX0FuYWx5c2VyTm9kZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vQW5hbHlzZXJOb2RlXCIpKTtcblxudmFyIF9QYW5uZXJOb2RlID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9QYW5uZXJOb2RlXCIpKTtcblxudmFyIF9HYWluTm9kZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vR2Fpbk5vZGVcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5mdW5jdGlvbiBfY3JlYXRlU3VwZXIoRGVyaXZlZCkgeyB2YXIgaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCA9IF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKTsgcmV0dXJuIGZ1bmN0aW9uIF9jcmVhdGVTdXBlckludGVybmFsKCkgeyB2YXIgU3VwZXIgPSBfZ2V0UHJvdG90eXBlT2YoRGVyaXZlZCksIHJlc3VsdDsgaWYgKGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QpIHsgdmFyIE5ld1RhcmdldCA9IF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3RvcjsgcmVzdWx0ID0gUmVmbGVjdC5jb25zdHJ1Y3QoU3VwZXIsIGFyZ3VtZW50cywgTmV3VGFyZ2V0KTsgfSBlbHNlIHsgcmVzdWx0ID0gU3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfSByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgcmVzdWx0KTsgfTsgfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7IHJldHVybiBjYWxsOyB9IHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpOyB9XG5cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikgeyBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuXG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkgeyBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7IGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7IGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7IHRyeSB7IERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoRGF0ZSwgW10sIGZ1bmN0aW9uICgpIHt9KSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7IH07IHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7IH1cblxudmFyIEJhc2VBdWRpb0NvbnRleHQgPSBmdW5jdGlvbiAoX0V2ZW50VGFyZ2V0KSB7XG4gIF9pbmhlcml0cyhCYXNlQXVkaW9Db250ZXh0LCBfRXZlbnRUYXJnZXQpO1xuXG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoQmFzZUF1ZGlvQ29udGV4dCk7XG5cbiAgZnVuY3Rpb24gQmFzZUF1ZGlvQ29udGV4dCgpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQmFzZUF1ZGlvQ29udGV4dCk7XG5cbiAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpO1xuICAgIF90aGlzLmF1ZGlvV29ya2xldDtcbiAgICBfdGhpcy5jdXJyZW50VGltZSA9IDA7XG4gICAgX3RoaXMuZGVzdGluYXRpb24gPSBuZXcgX0F1ZGlvRGVzdGluYXRpb25Ob2RlW1wiZGVmYXVsdFwiXShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSk7XG4gICAgX3RoaXMubGlzdGVuZXIgPSBuZXcgX0F1ZGlvTGlzdGVuZXJbXCJkZWZhdWx0XCJdKF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpKTtcbiAgICBfdGhpcy5zYW1wbGVSYXRlO1xuICAgIF90aGlzLnN0YXRlID0gXCJydW5uaW5nXCI7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEJhc2VBdWRpb0NvbnRleHQsIFt7XG4gICAga2V5OiBcImNyZWF0ZUFuYWx5c2VyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZUFuYWx5c2VyKCkge1xuICAgICAgcmV0dXJuIG5ldyBfQW5hbHlzZXJOb2RlW1wiZGVmYXVsdFwiXSh0aGlzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY3JlYXRlQmlxdWFkRmlsdGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZUJpcXVhZEZpbHRlcigpIHt9XG4gIH0sIHtcbiAgICBrZXk6IFwiY3JlYXRlQnVmZmVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlcigpIHt9XG4gIH0sIHtcbiAgICBrZXk6IFwiY3JlYXRlQnVmZmVyU291cmNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlclNvdXJjZSgpIHtcbiAgICAgIHJldHVybiBuZXcgX0F1ZGlvQnVmZmVyU291cmNlTm9kZVtcImRlZmF1bHRcIl0odGhpcyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNyZWF0ZUNvbnN0YW50U291cmNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZUNvbnN0YW50U291cmNlKCkge31cbiAgfSwge1xuICAgIGtleTogXCJjcmVhdGVDaGFubmVsTWVyZ2VyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZUNoYW5uZWxNZXJnZXIoKSB7fVxuICB9LCB7XG4gICAga2V5OiBcImNyZWF0ZUNoYW5uZWxTcGxpdHRlclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVDaGFubmVsU3BsaXR0ZXIoKSB7fVxuICB9LCB7XG4gICAga2V5OiBcImNyZWF0ZUNvbnZvbHZlclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVDb252b2x2ZXIoKSB7fVxuICB9LCB7XG4gICAga2V5OiBcImNyZWF0ZURlbGF5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZURlbGF5KCkge31cbiAgfSwge1xuICAgIGtleTogXCJjcmVhdGVEeW5hbWljc0NvbXByZXNzb3JcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlRHluYW1pY3NDb21wcmVzc29yKCkge1xuICAgICAgcmV0dXJuIG5ldyBfRHluYW1pY3NDb21wcmVzc29yTm9kZVtcImRlZmF1bHRcIl0odGhpcyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNyZWF0ZUdhaW5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlR2FpbigpIHtcbiAgICAgIHJldHVybiBuZXcgX0dhaW5Ob2RlW1wiZGVmYXVsdFwiXSh0aGlzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY3JlYXRlSUlSRmlsdGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZUlJUkZpbHRlcigpIHt9XG4gIH0sIHtcbiAgICBrZXk6IFwiY3JlYXRlT3NjaWxsYXRvclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVPc2NpbGxhdG9yKCkge1xuICAgICAgcmV0dXJuIG5ldyBfT3NjaWxsYXRvck5vZGVbXCJkZWZhdWx0XCJdKHRoaXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjcmVhdGVQYW5uZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlUGFubmVyKCkge1xuICAgICAgcmV0dXJuIG5ldyBfUGFubmVyTm9kZVtcImRlZmF1bHRcIl0odGhpcyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNyZWF0ZVBlcmlvZGljV2F2ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVQZXJpb2RpY1dhdmUoKSB7XG4gICAgICByZXR1cm4gbmV3IF9QZXJpb2RpY1dhdmVbXCJkZWZhdWx0XCJdKHRoaXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjcmVhdGVTY3JpcHRQcm9jZXNzb3JcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlU2NyaXB0UHJvY2Vzc29yKCkge31cbiAgfSwge1xuICAgIGtleTogXCJjcmVhdGVTdGVyZW9QYW5uZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlU3RlcmVvUGFubmVyKCkge31cbiAgfSwge1xuICAgIGtleTogXCJjcmVhdGVXYXZlU2hhcGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZVdhdmVTaGFwZXIoKSB7fVxuICB9LCB7XG4gICAga2V5OiBcImRlY29kZUF1ZGlvRGF0YVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZWNvZGVBdWRpb0RhdGEoYXVkaW9EYXRhLCBjYWxsRnVuYykge1xuICAgICAgY2FsbEZ1bmMobmV3IF9BdWRpb0J1ZmZlcltcImRlZmF1bHRcIl0odGhpcywgYXVkaW9EYXRhKSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm9uc3RhdGVjaGFuZ2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb25zdGF0ZWNoYW5nZSgpIHt9XG4gIH1dKTtcblxuICByZXR1cm4gQmFzZUF1ZGlvQ29udGV4dDtcbn0oX0V2ZW50VGFyZ2V0MltcImRlZmF1bHRcIl0pO1xuXG52YXIgX2RlZmF1bHQgPSBCYXNlQXVkaW9Db250ZXh0O1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7XCIuLi9FdmVudFRhcmdldFwiOjEwLFwiLi9BbmFseXNlck5vZGVcIjozNixcIi4vQXVkaW9CdWZmZXJcIjozNyxcIi4vQXVkaW9CdWZmZXJTb3VyY2VOb2RlXCI6MzgsXCIuL0F1ZGlvRGVzdGluYXRpb25Ob2RlXCI6NDAsXCIuL0F1ZGlvTGlzdGVuZXJcIjo0MSxcIi4vRHluYW1pY3NDb21wcmVzc29yTm9kZVwiOjQ2LFwiLi9HYWluTm9kZVwiOjQ3LFwiLi9Pc2NpbGxhdG9yTm9kZVwiOjQ5LFwiLi9QYW5uZXJOb2RlXCI6NTAsXCIuL1BlcmlvZGljV2F2ZVwiOjUxfV0sNDY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX0F1ZGlvTm9kZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0F1ZGlvTm9kZVwiKSk7XG5cbnZhciBfQXVkaW9QYXJhbSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vQXVkaW9QYXJhbVwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7IHZhciBoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0ID0gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpOyByZXR1cm4gZnVuY3Rpb24gX2NyZWF0ZVN1cGVySW50ZXJuYWwoKSB7IHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSwgcmVzdWx0OyBpZiAoaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCkgeyB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yOyByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpOyB9IGVsc2UgeyByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9IHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpOyB9OyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7IH1cblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7IGlmIChzZWxmID09PSB2b2lkIDApIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7IGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTsgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTsgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTsgdHJ5IHsgRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChSZWZsZWN0LmNvbnN0cnVjdChEYXRlLCBbXSwgZnVuY3Rpb24gKCkge30pKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG52YXIgRHluYW1pY3NDb21wcmVzc29yTm9kZSA9IGZ1bmN0aW9uIChfQXVkaW9Ob2RlKSB7XG4gIF9pbmhlcml0cyhEeW5hbWljc0NvbXByZXNzb3JOb2RlLCBfQXVkaW9Ob2RlKTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKER5bmFtaWNzQ29tcHJlc3Nvck5vZGUpO1xuXG4gIGZ1bmN0aW9uIER5bmFtaWNzQ29tcHJlc3Nvck5vZGUoY29udGV4dCkge1xuICAgIHZhciBfdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBEeW5hbWljc0NvbXByZXNzb3JOb2RlKTtcblxuICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgY29udGV4dCk7XG4gICAgX3RoaXMuX3RocmVzaG9sZCA9IG5ldyBfQXVkaW9QYXJhbVtcImRlZmF1bHRcIl0oe1xuICAgICAgdmFsdWU6IC0yNCxcbiAgICAgIGRlZmF1bHRWYWx1ZTogLTI0LFxuICAgICAgbWF4VmFsdWU6IDAsXG4gICAgICBtaW5WYWx1ZTogLTEwMFxuICAgIH0pO1xuICAgIF90aGlzLl9rbmVlID0gbmV3IF9BdWRpb1BhcmFtW1wiZGVmYXVsdFwiXSh7XG4gICAgICB2YWx1ZTogMzAsXG4gICAgICBkZWZhdWx0VmFsdWU6IDMwLFxuICAgICAgbWF4VmFsdWU6IDQwLFxuICAgICAgbWluVmFsdWU6IDBcbiAgICB9KTtcbiAgICBfdGhpcy5fcmF0aW8gPSBuZXcgX0F1ZGlvUGFyYW1bXCJkZWZhdWx0XCJdKHtcbiAgICAgIHZhbHVlOiAxMixcbiAgICAgIGRlZmF1bHRWYWx1ZTogMTIsXG4gICAgICBtYXhWYWx1ZTogMjAsXG4gICAgICBtaW5WYWx1ZTogMVxuICAgIH0pO1xuICAgIF90aGlzLl9yZWR1Y3Rpb24gPSBuZXcgX0F1ZGlvUGFyYW1bXCJkZWZhdWx0XCJdKHtcbiAgICAgIHZhbHVlOiAwLFxuICAgICAgZGVmYXVsdFZhbHVlOiAwLFxuICAgICAgbWF4VmFsdWU6IDAsXG4gICAgICBtaW5WYWx1ZTogLTIwXG4gICAgfSk7XG4gICAgX3RoaXMuX2F0dGFjayA9IG5ldyBfQXVkaW9QYXJhbVtcImRlZmF1bHRcIl0oe1xuICAgICAgdmFsdWU6IDAuMDAzLFxuICAgICAgZGVmYXVsdFZhbHVlOiAwLjAwMyxcbiAgICAgIG1heFZhbHVlOiAxLFxuICAgICAgbWluVmFsdWU6IDBcbiAgICB9KTtcbiAgICBfdGhpcy5fcmVsZWFzZSA9IG5ldyBfQXVkaW9QYXJhbVtcImRlZmF1bHRcIl0oe1xuICAgICAgdmFsdWU6IDAuMjUsXG4gICAgICBkZWZhdWx0VmFsdWU6IDAuMjUsXG4gICAgICBtYXhWYWx1ZTogMSxcbiAgICAgIG1pblZhbHVlOiAwXG4gICAgfSk7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKER5bmFtaWNzQ29tcHJlc3Nvck5vZGUsIFt7XG4gICAga2V5OiBcInRocmVzaG9sZFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3RocmVzaG9sZDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwia2VlblwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2tlZW47XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJhdGlvXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmF0aW87XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlZHVjdGlvblwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlZHVjdGlvbjtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYXR0YWNrXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYXR0YWNrO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZWxlYXNlXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVsZWFzZTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gRHluYW1pY3NDb21wcmVzc29yTm9kZTtcbn0oX0F1ZGlvTm9kZTJbXCJkZWZhdWx0XCJdKTtcblxudmFyIF9kZWZhdWx0ID0gRHluYW1pY3NDb21wcmVzc29yTm9kZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se1wiLi9BdWRpb05vZGVcIjo0MixcIi4vQXVkaW9QYXJhbVwiOjQzfV0sNDc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX0F1ZGlvTm9kZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0F1ZGlvTm9kZVwiKSk7XG5cbnZhciBfQXVkaW9QYXJhbSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vQXVkaW9QYXJhbVwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7IHZhciBoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0ID0gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpOyByZXR1cm4gZnVuY3Rpb24gX2NyZWF0ZVN1cGVySW50ZXJuYWwoKSB7IHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSwgcmVzdWx0OyBpZiAoaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCkgeyB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yOyByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpOyB9IGVsc2UgeyByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9IHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpOyB9OyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7IH1cblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7IGlmIChzZWxmID09PSB2b2lkIDApIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7IGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTsgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTsgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTsgdHJ5IHsgRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChSZWZsZWN0LmNvbnN0cnVjdChEYXRlLCBbXSwgZnVuY3Rpb24gKCkge30pKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG52YXIgR2Fpbk5vZGUgPSBmdW5jdGlvbiAoX0F1ZGlvTm9kZSkge1xuICBfaW5oZXJpdHMoR2Fpbk5vZGUsIF9BdWRpb05vZGUpO1xuXG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoR2Fpbk5vZGUpO1xuXG4gIGZ1bmN0aW9uIEdhaW5Ob2RlKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgR2Fpbk5vZGUpO1xuXG4gICAgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBjb250ZXh0KTtcbiAgICBfdGhpcy5fZ2FpbiA9IG9wdGlvbnMgJiYgb3B0aW9ucy5nYWluIHx8IG5ldyBfQXVkaW9QYXJhbVtcImRlZmF1bHRcIl0oKTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoR2Fpbk5vZGUsIFt7XG4gICAga2V5OiBcImdhaW5cIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9nYWluO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBHYWluTm9kZTtcbn0oX0F1ZGlvTm9kZTJbXCJkZWZhdWx0XCJdKTtcblxudmFyIF9kZWZhdWx0ID0gR2Fpbk5vZGU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHtcIi4vQXVkaW9Ob2RlXCI6NDIsXCIuL0F1ZGlvUGFyYW1cIjo0M31dLDQ4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9BdWRpb05vZGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9BdWRpb05vZGVcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IG8uX19wcm90b19fID0gcDsgcmV0dXJuIG87IH07IHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7IH1cblxuZnVuY3Rpb24gX2NyZWF0ZVN1cGVyKERlcml2ZWQpIHsgdmFyIGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QgPSBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCk7IHJldHVybiBmdW5jdGlvbiBfY3JlYXRlU3VwZXJJbnRlcm5hbCgpIHsgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLCByZXN1bHQ7IGlmIChoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KSB7IHZhciBOZXdUYXJnZXQgPSBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3I7IHJlc3VsdCA9IFJlZmxlY3QuY29uc3RydWN0KFN1cGVyLCBhcmd1bWVudHMsIE5ld1RhcmdldCk7IH0gZWxzZSB7IHJlc3VsdCA9IFN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH0gcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIHJlc3VsdCk7IH07IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFJlZmxlY3QuY29uc3RydWN0KERhdGUsIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbnZhciBNZWRpYUVsZW1lbnRBdWRpb1NvdXJjZU5vZGUgPSBmdW5jdGlvbiAoX0F1ZGlvTm9kZSkge1xuICBfaW5oZXJpdHMoTWVkaWFFbGVtZW50QXVkaW9Tb3VyY2VOb2RlLCBfQXVkaW9Ob2RlKTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKE1lZGlhRWxlbWVudEF1ZGlvU291cmNlTm9kZSk7XG5cbiAgZnVuY3Rpb24gTWVkaWFFbGVtZW50QXVkaW9Tb3VyY2VOb2RlKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTWVkaWFFbGVtZW50QXVkaW9Tb3VyY2VOb2RlKTtcblxuICAgIHJldHVybiBfc3VwZXIuY2FsbCh0aGlzLCBjb250ZXh0KTtcbiAgfVxuXG4gIHJldHVybiBNZWRpYUVsZW1lbnRBdWRpb1NvdXJjZU5vZGU7XG59KF9BdWRpb05vZGUyW1wiZGVmYXVsdFwiXSk7XG5cbnZhciBfZGVmYXVsdCA9IE1lZGlhRWxlbWVudEF1ZGlvU291cmNlTm9kZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se1wiLi9BdWRpb05vZGVcIjo0Mn1dLDQ5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9BdWRpb1NjaGVkdWxlZFNvdXJjZU5vZGUgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0F1ZGlvU2NoZWR1bGVkU291cmNlTm9kZVwiKSk7XG5cbnZhciBfQXVkaW9QYXJhbSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vQXVkaW9QYXJhbVwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7IHZhciBoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0ID0gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpOyByZXR1cm4gZnVuY3Rpb24gX2NyZWF0ZVN1cGVySW50ZXJuYWwoKSB7IHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSwgcmVzdWx0OyBpZiAoaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCkgeyB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yOyByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpOyB9IGVsc2UgeyByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9IHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpOyB9OyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7IH1cblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7IGlmIChzZWxmID09PSB2b2lkIDApIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7IGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTsgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTsgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTsgdHJ5IHsgRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChSZWZsZWN0LmNvbnN0cnVjdChEYXRlLCBbXSwgZnVuY3Rpb24gKCkge30pKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG52YXIgdHlwZXMgPSB7XG4gIFwic2luZVwiOiAwLFxuICBcInNxdWFyZVwiOiAwLFxuICBcInNhd3Rvb3RoXCI6IDAsXG4gIFwidHJpYW5nbGVcIjogMCxcbiAgXCJjdXN0b21cIjogMFxufTtcblxudmFyIE9zY2lsbGF0b3JOb2RlID0gZnVuY3Rpb24gKF9BdWRpb1NjaGVkdWxlZFNvdXJjZSkge1xuICBfaW5oZXJpdHMoT3NjaWxsYXRvck5vZGUsIF9BdWRpb1NjaGVkdWxlZFNvdXJjZSk7XG5cbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihPc2NpbGxhdG9yTm9kZSk7XG5cbiAgZnVuY3Rpb24gT3NjaWxsYXRvck5vZGUoY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBfdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBPc2NpbGxhdG9yTm9kZSk7XG5cbiAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpO1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIF90aGlzLmZyZXF1ZW5jeSA9IG5ldyBfQXVkaW9QYXJhbVtcImRlZmF1bHRcIl0oe1xuICAgICAgdmFsdWU6IF90aGlzLmlzTnVtYmVyKG9wdGlvbnMuZnJlcXVlbmN5KSA/IG9wdGlvbnMuZnJlcXVlbmN5IDogNDQwXG4gICAgfSk7XG4gICAgX3RoaXMuZGV0dW5lID0gbmV3IF9BdWRpb1BhcmFtW1wiZGVmYXVsdFwiXSh7XG4gICAgICB2YWx1ZTogX3RoaXMuaXNOdW1iZXIob3B0aW9ucy5kZXR1bmUpID8gb3B0aW9ucy5kZXR1bmUgOiAwXG4gICAgfSk7XG4gICAgX3RoaXMudHlwZSA9IG9wdGlvbnMudHlwZSBpbiB0eXBlcyA/IG9wdGlvbnMudHlwZSA6IFwic2luZVwiO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhPc2NpbGxhdG9yTm9kZSwgW3tcbiAgICBrZXk6IFwic2V0UGVyaW9kaWNXYXZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldFBlcmlvZGljV2F2ZSh3YXZlKSB7fVxuICB9LCB7XG4gICAga2V5OiBcInN0YXJ0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0YXJ0KHdoZW4pIHt9XG4gIH0sIHtcbiAgICBrZXk6IFwic3RvcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9wKHdlbikge31cbiAgfV0pO1xuXG4gIHJldHVybiBPc2NpbGxhdG9yTm9kZTtcbn0oX0F1ZGlvU2NoZWR1bGVkU291cmNlTm9kZVtcImRlZmF1bHRcIl0pO1xuXG52YXIgX2RlZmF1bHQgPSBPc2NpbGxhdG9yTm9kZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se1wiLi9BdWRpb1BhcmFtXCI6NDMsXCIuL0F1ZGlvU2NoZWR1bGVkU291cmNlTm9kZVwiOjQ0fV0sNTA6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX0F1ZGlvTm9kZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0F1ZGlvTm9kZVwiKSk7XG5cbnZhciBfQXVkaW9QYXJhbSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vQXVkaW9QYXJhbVwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7IHZhciBoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0ID0gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpOyByZXR1cm4gZnVuY3Rpb24gX2NyZWF0ZVN1cGVySW50ZXJuYWwoKSB7IHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSwgcmVzdWx0OyBpZiAoaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCkgeyB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yOyByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpOyB9IGVsc2UgeyByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9IHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpOyB9OyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7IH1cblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7IGlmIChzZWxmID09PSB2b2lkIDApIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7IGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTsgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTsgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTsgdHJ5IHsgRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChSZWZsZWN0LmNvbnN0cnVjdChEYXRlLCBbXSwgZnVuY3Rpb24gKCkge30pKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH1cblxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuXG52YXIgUGFubmVyTm9kZSA9IGZ1bmN0aW9uIChfQXVkaW9Ob2RlKSB7XG4gIF9pbmhlcml0cyhQYW5uZXJOb2RlLCBfQXVkaW9Ob2RlKTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKFBhbm5lck5vZGUpO1xuXG4gIGZ1bmN0aW9uIFBhbm5lck5vZGUoY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBfdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQYW5uZXJOb2RlKTtcblxuICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgY29udGV4dCk7XG4gICAgX3RoaXMuY29uZUlubmVyQW5nbGUgPSAzNjA7XG4gICAgX3RoaXMuY29uZU91dGVyQW5nbGUgPSAzNjA7XG4gICAgX3RoaXMuY29uZU91dGVyR2FpbiA9IDA7XG4gICAgX3RoaXMuZGlzdGFuY2VNb2RlbCA9IFwiaW52ZXJzZVwiO1xuICAgIF90aGlzLm1heERpc3RhbmNlID0gMTAwMDA7XG4gICAgX3RoaXMub3JpZW50YXRpb25YID0gbmV3IF9BdWRpb1BhcmFtW1wiZGVmYXVsdFwiXSh7XG4gICAgICB2YWx1ZTogMVxuICAgIH0pO1xuICAgIF90aGlzLm9yaWVudGF0aW9uWSA9IG5ldyBfQXVkaW9QYXJhbVtcImRlZmF1bHRcIl0oe1xuICAgICAgdmFsdWU6IDBcbiAgICB9KTtcbiAgICBfdGhpcy5vcmllbnRhdGlvblogPSBuZXcgX0F1ZGlvUGFyYW1bXCJkZWZhdWx0XCJdKHtcbiAgICAgIHZhbHVlOiAwXG4gICAgfSk7XG4gICAgX3RoaXMucGFubmluZ01vZGVsID0gXCJlcXVhbHBvd2VyXCI7XG4gICAgX3RoaXMucG9zaXRpb25YID0gbmV3IF9BdWRpb1BhcmFtW1wiZGVmYXVsdFwiXSh7XG4gICAgICB2YWx1ZTogMFxuICAgIH0pO1xuICAgIF90aGlzLnBvc2l0aW9uWSA9IG5ldyBfQXVkaW9QYXJhbVtcImRlZmF1bHRcIl0oe1xuICAgICAgdmFsdWU6IDBcbiAgICB9KTtcbiAgICBfdGhpcy5wb3NpdGlvblogPSBuZXcgX0F1ZGlvUGFyYW1bXCJkZWZhdWx0XCJdKHtcbiAgICAgIHZhbHVlOiAwXG4gICAgfSk7XG4gICAgX3RoaXMucmVmRGlzdGFuY2UgPSAxO1xuICAgIF90aGlzLnJvbGxvZmZGYWN0b3IgPSAxO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhQYW5uZXJOb2RlLCBbe1xuICAgIGtleTogXCJzZXRQb3NpdGlvblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRQb3NpdGlvbih4LCB5LCB6KSB7XG4gICAgICB0aGlzLnBvc2l0aW9uWCA9IHg7XG4gICAgICB0aGlzLnBvc2l0aW9uWSA9IHk7XG4gICAgICB0aGlzLnBvc2l0aW9uWiA9IHo7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNldE9yaWVudGF0aW9uXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldE9yaWVudGF0aW9uKHgsIHksIHopIHtcbiAgICAgIHRoaXMub3JpZW50YXRpb25YID0geDtcbiAgICAgIHRoaXMub3JpZW50YXRpb25ZID0geTtcbiAgICAgIHRoaXMub3JpZW50YXRpb25aID0gejtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2V0VmVsb2NpdHlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0VmVsb2NpdHkoKSB7fVxuICB9XSk7XG5cbiAgcmV0dXJuIFBhbm5lck5vZGU7XG59KF9BdWRpb05vZGUyW1wiZGVmYXVsdFwiXSk7XG5cbnZhciBfZGVmYXVsdCA9IFBhbm5lck5vZGU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHtcIi4vQXVkaW9Ob2RlXCI6NDIsXCIuL0F1ZGlvUGFyYW1cIjo0M31dLDUxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBQZXJpb2RpY1dhdmUgPSBmdW5jdGlvbiBQZXJpb2RpY1dhdmUoY29udGV4dCwgb3B0aW9ucykge1xuICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUGVyaW9kaWNXYXZlKTtcbn07XG5cbnZhciBfZGVmYXVsdCA9IFBlcmlvZGljV2F2ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se31dLDUyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxudmFyIG1kNSA9IHJlcXVpcmUoXCIuLi8uLi9saWIvbWQ1Lm1pblwiKTtcblxudmFyIGZpbGVNZ3IgPSByYWwuZ2V0RmlsZVN5c3RlbU1hbmFnZXIoKTtcbnZhciBjYWNoZURpciA9IHJhbC5lbnYuVVNFUl9EQVRBX1BBVEggKyBcIi9maWxlQ2FjaGUvXCI7XG5cbnZhciBGaWxlQ2FjaGUgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEZpbGVDYWNoZSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRmlsZUNhY2hlKTtcblxuICAgIHRoaXMuX2NhY2hlcyA9IHt9O1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEZpbGVDYWNoZSwgW3tcbiAgICBrZXk6IFwiZ2V0Q2FjaGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0Q2FjaGUoZGF0YSkge1xuICAgICAgdmFyIGtleSA9IEZpbGVDYWNoZS5fZ2VuRGF0YUtleShkYXRhKTtcblxuICAgICAgaWYgKGtleSBpbiB0aGlzLl9jYWNoZXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlc1trZXldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNldENhY2hlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldENhY2hlKHBhdGgsIGRhdGEpIHtcbiAgICAgIHZhciBrZXkgPSBGaWxlQ2FjaGUuX2dlbkRhdGFLZXkoZGF0YSk7XG5cbiAgICAgIHRoaXMuX2NhY2hlc1trZXldID0gcGF0aDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2V0SXRlbVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRJdGVtKGRhdGEsIHBhdGgsIGtleSwgY2FsbEJhY2spIHtcbiAgICAgIGtleSA9IGtleSB8fCBGaWxlQ2FjaGUuX2dlbkRhdGFLZXkoZGF0YSk7XG4gICAgICB2YXIgY2FjaGVzID0gdGhpcy5fY2FjaGVzO1xuXG4gICAgICBpZiAoa2V5IGluIGNhY2hlcykge1xuICAgICAgICBjYWxsQmFjayAmJiBjYWxsQmFjayhjYWNoZXNba2V5XSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFwYXRoKSB7XG4gICAgICAgIHBhdGggPSBjYWNoZURpciArIGtleTtcbiAgICAgICAgZmlsZU1nci53cml0ZUZpbGUoe1xuICAgICAgICAgIGZpbGVQYXRoOiBwYXRoLFxuICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgZW5jb2Rpbmc6IFwiYmluYXJ5XCIsXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcygpIHtcbiAgICAgICAgICAgIGNhY2hlc1trZXldID0gcGF0aDtcbiAgICAgICAgICAgIGNhbGxCYWNrICYmIGNhbGxCYWNrKHBhdGgpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZmFpbDogZnVuY3Rpb24gZmFpbCgpIHtcbiAgICAgICAgICAgIGNhbGxCYWNrICYmIGNhbGxCYWNrKCk7XG4gICAgICAgICAgICB0aHJvdyBwYXRoICsgXCJ3cml0ZUZpbGUgZmFpbCFcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRQYXRoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFBhdGgoZGF0YSwgY2FsbEJhY2spIHtcbiAgICAgIHZhciBrZXkgPSBGaWxlQ2FjaGUuX2dlbkRhdGFLZXkoZGF0YSk7XG5cbiAgICAgIHZhciBjYWNoZXMgPSB0aGlzLl9jYWNoZXM7XG5cbiAgICAgIGlmIChrZXkgaW4gY2FjaGVzKSB7XG4gICAgICAgIGNhbGxCYWNrKGNhY2hlc1trZXldKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0SXRlbShkYXRhLCB1bmRlZmluZWQsIGtleSwgY2FsbEJhY2spO1xuICAgICAgfVxuICAgIH1cbiAgfV0sIFt7XG4gICAga2V5OiBcIl9nZW5EYXRhS2V5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9nZW5EYXRhS2V5KGRhdGEpIHtcbiAgICAgIHZhciB2aWV3ID0gbmV3IERhdGFWaWV3KGRhdGEpO1xuICAgICAgdmFyIGxlbmd0aCA9IHZpZXcuYnl0ZUxlbmd0aCAvIDQ7XG4gICAgICB2YXIgY291bnQgPSAxMDtcbiAgICAgIHZhciBzcGFjZSA9IGxlbmd0aCAvIGNvdW50O1xuICAgICAgdmFyIGtleSA9IFwibGVuZ3RoOlwiICsgbGVuZ3RoO1xuICAgICAga2V5ICs9IFwiZmlyc3Q6XCIgKyB2aWV3LmdldEludDMyKDApO1xuICAgICAga2V5ICs9IFwibGFzdDpcIiArIHZpZXcuZ2V0SW50MzIobGVuZ3RoIC0gMSk7XG5cbiAgICAgIHdoaWxlIChjb3VudC0tKSB7XG4gICAgICAgIGtleSArPSBjb3VudCArIFwiOlwiICsgdmlldy5nZXRJbnQzMihNYXRoLmZsb29yKHNwYWNlICogY291bnQpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1kNShrZXkpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBGaWxlQ2FjaGU7XG59KCk7XG5cbnRyeSB7XG4gIGZpbGVNZ3IuYWNjZXNzU3luYyhjYWNoZURpcik7XG4gIGZpbGVNZ3Iucm1kaXJTeW5jKGNhY2hlRGlyLCB0cnVlKTtcbn0gY2F0Y2ggKGUpIHt9XG5cbmZpbGVNZ3IubWtkaXJTeW5jKGNhY2hlRGlyLCB0cnVlKTtcblxudmFyIF9kZWZhdWx0ID0gbmV3IEZpbGVDYWNoZSgpO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHtcIi4uLy4uL2xpYi9tZDUubWluXCI6Mn1dLDUzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbnZhciBfZGVmYXVsdCA9IG5ldyBXZWFrTWFwKCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se31dLDU0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX0F1ZGlvID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9BdWRpb1wiKSk7XG5cbnZhciBfQXVkaW9Db250ZXh0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9hdWRpb0NvbnRleHQvQXVkaW9Db250ZXh0XCIpKTtcblxudmFyIF9EZXZpY2VNb3Rpb25FdmVudCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vRGV2aWNlTW90aW9uRXZlbnRcIikpO1xuXG52YXIgX0RvY3VtZW50ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9Eb2N1bWVudFwiKSk7XG5cbnZhciBfRXZlbnQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0V2ZW50XCIpKTtcblxudmFyIF9Gb250RmFjZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vRm9udEZhY2VcIikpO1xuXG52YXIgX0ZvbnRGYWNlU2V0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9Gb250RmFjZVNldFwiKSk7XG5cbnZhciBfRXZlbnRUYXJnZXQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0V2ZW50VGFyZ2V0XCIpKTtcblxudmFyIF9IVE1MRWxlbWVudCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vSFRNTEVsZW1lbnRcIikpO1xuXG52YXIgX0hUTUxBdWRpb0VsZW1lbnQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0hUTUxBdWRpb0VsZW1lbnRcIikpO1xuXG52YXIgX0hUTUxDYW52YXNFbGVtZW50ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9IVE1MQ2FudmFzRWxlbWVudFwiKSk7XG5cbnZhciBfSFRNTEltYWdlRWxlbWVudCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vSFRNTEltYWdlRWxlbWVudFwiKSk7XG5cbnZhciBfSW1hZ2UgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL0ltYWdlXCIpKTtcblxudmFyIF9Mb2NhdGlvbiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vTG9jYXRpb25cIikpO1xuXG52YXIgX05hdmlnYXRvciA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vTmF2aWdhdG9yXCIpKTtcblxudmFyIF9TY3JlZW4gPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL1NjcmVlblwiKSk7XG5cbnZhciBfVG91Y2hFdmVudCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vVG91Y2hFdmVudFwiKSk7XG5cbnZhciBfWE1MSHR0cFJlcXVlc3QgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL1hNTEh0dHBSZXF1ZXN0XCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbndpbmRvdy5yYWwgPSB3aW5kb3cucmFsIHx8IHt9O1xuXG52YXIgX3N5c3RlbUluZm8gPSB3aW5kb3cucmFsLmdldFN5c3RlbUluZm9TeW5jKCk7XG5cbndpbmRvdy5jbGllbnRUb3AgPSAwO1xud2luZG93LmNsaWVudExlZnQgPSAwO1xud2luZG93LmRldmljZVBpeGVsUmF0aW8gPSBfc3lzdGVtSW5mby5waXhlbFJhdGlvO1xud2luZG93LmRvY3VtZW50ID0gbmV3IF9Eb2N1bWVudFtcImRlZmF1bHRcIl0oKTtcbndpbmRvdy5mcmFtZUVsZW1lbnQgPSBudWxsO1xud2luZG93LmZ1bGxTY3JlZW4gPSB0cnVlO1xud2luZG93LmlubmVySGVpZ2h0ID0gX3N5c3RlbUluZm8uc2NyZWVuSGVpZ2h0O1xud2luZG93LmlubmVyV2lkdGggPSBfc3lzdGVtSW5mby5zY3JlZW5XaWR0aDtcbndpbmRvdy5sZW5ndGggPSAwO1xud2luZG93LmxvY2F0aW9uID0gbmV3IF9Mb2NhdGlvbltcImRlZmF1bHRcIl0oKTtcbndpbmRvdy5uYW1lID0gXCJydW50aW1lXCI7XG53aW5kb3cubmF2aWdhdG9yID0gbmV3IF9OYXZpZ2F0b3JbXCJkZWZhdWx0XCJdKF9zeXN0ZW1JbmZvLnBsYXRmb3JtLCBfc3lzdGVtSW5mby5sYW5ndWFnZSk7XG53aW5kb3cub3V0ZXJIZWlnaHQgPSBfc3lzdGVtSW5mby5zY3JlZW5IZWlnaHQ7XG53aW5kb3cub3V0ZXJXaWR0aCA9IF9zeXN0ZW1JbmZvLnNjcmVlbldpZHRoO1xud2luZG93LnBhZ2VYT2Zmc2V0ID0gMDtcbndpbmRvdy5wYWdlWU9mZnNldCA9IDA7XG53aW5kb3cucGFyZW50ID0gd2luZG93O1xud2luZG93LnNjcmVlbiA9IG5ldyBfU2NyZWVuW1wiZGVmYXVsdFwiXSgpO1xud2luZG93LnNjcmVlbkxlZnQgPSAwO1xud2luZG93LnNjcmVlblRvcCA9IDA7XG53aW5kb3cuc2NyZWVuWCA9IDA7XG53aW5kb3cuc2NyZWVuWSA9IDA7XG53aW5kb3cuc2Nyb2xsWCA9IDA7XG53aW5kb3cuc2Nyb2xsWSA9IDA7XG53aW5kb3cuc2VsZiA9IHdpbmRvdztcbndpbmRvdy50b3AgPSB3aW5kb3c7XG53aW5kb3cud2luZG93ID0gd2luZG93O1xud2luZG93LmFsZXJ0ID0gd2luZG93LmNvbnNvbGUuZXJyb3I7XG5cbnZhciBfcmVxdWlyZSA9IHJlcXVpcmUoJy4uL2xpYi9iYXNlNjQubWluLmpzJyksXG4gICAgYnRvYSA9IF9yZXF1aXJlLmJ0b2EsXG4gICAgYXRvYiA9IF9yZXF1aXJlLmF0b2I7XG5cbndpbmRvdy5hdG9iID0gYXRvYjtcbndpbmRvdy5idG9hID0gYnRvYTtcblxud2luZG93LmNsb3NlID0gZnVuY3Rpb24gKCkge1xuICBjb25zb2xlLndhcm4oXCJ3aW5kb3cuY2xvc2UoKSBpcyBkZXByZWNhdGVkIVwiKTtcbn07XG5cbndpbmRvdy5wcmludCA9IHdpbmRvdy5jb25zb2xlLmxvZztcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyID0gX0V2ZW50VGFyZ2V0W1wiZGVmYXVsdFwiXS5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcbndpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyID0gX0V2ZW50VGFyZ2V0W1wiZGVmYXVsdFwiXS5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcjtcbnZhciBfZGlzcGF0Y2hFdmVudCA9IF9FdmVudFRhcmdldFtcImRlZmF1bHRcIl0ucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQ7XG5cbndpbmRvdy5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIGlmICh3aW5kb3cuZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCkpIHtcbiAgICByZXR1cm4gX2Rpc3BhdGNoRXZlbnQuYXBwbHkodGhpcyB8fCB3aW5kb3csIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG53aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICBsZWZ0OiAnMHB4JyxcbiAgICB0b3A6ICcwcHgnLFxuICAgIGhlaWdodDogJzBweCcsXG4gICAgcGFkZGluZ0xlZnQ6IDBcbiAgfTtcbn07XG5cbnJhbC5vbldpbmRvd1Jlc2l6ZSAmJiByYWwub25XaW5kb3dSZXNpemUoZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQpIHtcbiAgd2luZG93LmlubmVyV2lkdGggPSB3aWR0aDtcbiAgd2luZG93LmlubmVySGVpZ2h0ID0gaGVpZ2h0O1xuICB3aW5kb3cub3V0ZXJXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICB3aW5kb3cub3V0ZXJIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIHdpbmRvdy5zY3JlZW4uYXZhaWxXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICB3aW5kb3cuc2NyZWVuLmF2YWlsSGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICB3aW5kb3cuc2NyZWVuLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gIHdpbmRvdy5zY3JlZW4uaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICB2YXIgZXZlbnQgPSBuZXcgX0V2ZW50W1wiZGVmYXVsdFwiXShcInJlc2l6ZVwiKTtcbiAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufSk7XG5cbndpbmRvdy5zdG9wID0gZnVuY3Rpb24gKCkge1xuICBjb25zb2xlLndhcm4oXCJ3aW5kb3cuc3RvcCgpIG5vdCBpbXBsZW1lbnRlZFwiKTtcbn07XG5cbndpbmRvdy5BdWRpbyA9IF9BdWRpb1tcImRlZmF1bHRcIl07XG53aW5kb3cuQXVkaW9Db250ZXh0ID0gX0F1ZGlvQ29udGV4dFtcImRlZmF1bHRcIl07XG53aW5kb3cuRGV2aWNlTW90aW9uRXZlbnQgPSBfRGV2aWNlTW90aW9uRXZlbnRbXCJkZWZhdWx0XCJdO1xud2luZG93LkV2ZW50ID0gX0V2ZW50W1wiZGVmYXVsdFwiXTtcbndpbmRvdy5Gb250RmFjZSA9IF9Gb250RmFjZVtcImRlZmF1bHRcIl07XG53aW5kb3cuRm9udEZhY2VTZXQgPSBfRm9udEZhY2VTZXRbXCJkZWZhdWx0XCJdO1xud2luZG93LkhUTUxFbGVtZW50ID0gX0hUTUxFbGVtZW50W1wiZGVmYXVsdFwiXTtcbndpbmRvdy5IVE1MQXVkaW9FbGVtZW50ID0gX0hUTUxBdWRpb0VsZW1lbnRbXCJkZWZhdWx0XCJdO1xud2luZG93LkhUTUxDYW52YXNFbGVtZW50ID0gX0hUTUxDYW52YXNFbGVtZW50W1wiZGVmYXVsdFwiXTtcbndpbmRvdy5IVE1MSW1hZ2VFbGVtZW50ID0gX0hUTUxJbWFnZUVsZW1lbnRbXCJkZWZhdWx0XCJdO1xud2luZG93LkltYWdlID0gX0ltYWdlW1wiZGVmYXVsdFwiXTtcbndpbmRvdy5Ub3VjaEV2ZW50ID0gX1RvdWNoRXZlbnRbXCJkZWZhdWx0XCJdO1xud2luZG93LlhNTEh0dHBSZXF1ZXN0ID0gX1hNTEh0dHBSZXF1ZXN0W1wiZGVmYXVsdFwiXTtcblxuaWYgKCF3aW5kb3cuQmxvYiB8fCAhd2luZG93LlVSTCkge1xuICB2YXIgX3JlcXVpcmUyID0gcmVxdWlyZSgnLi9CbG9iLmpzJyksXG4gICAgICBCbG9iID0gX3JlcXVpcmUyLkJsb2IsXG4gICAgICBVUkwgPSBfcmVxdWlyZTIuVVJMO1xuXG4gIHdpbmRvdy5CbG9iID0gQmxvYjtcbiAgd2luZG93LlVSTCA9IFVSTDtcbn1cblxuaWYgKCF3aW5kb3cuRE9NUGFyc2VyKSB7XG4gIHdpbmRvdy5ET01QYXJzZXIgPSByZXF1aXJlKCcuL3htbGRvbS9kb20tcGFyc2VyLmpzJykuRE9NUGFyc2VyO1xufVxuXG59LHtcIi4uL2xpYi9iYXNlNjQubWluLmpzXCI6MSxcIi4vQXVkaW9cIjozLFwiLi9CbG9iLmpzXCI6NCxcIi4vRGV2aWNlTW90aW9uRXZlbnRcIjo2LFwiLi9Eb2N1bWVudFwiOjcsXCIuL0V2ZW50XCI6OSxcIi4vRXZlbnRUYXJnZXRcIjoxMCxcIi4vRm9udEZhY2VcIjoxMSxcIi4vRm9udEZhY2VTZXRcIjoxMixcIi4vSFRNTEF1ZGlvRWxlbWVudFwiOjE0LFwiLi9IVE1MQ2FudmFzRWxlbWVudFwiOjE2LFwiLi9IVE1MRWxlbWVudFwiOjE3LFwiLi9IVE1MSW1hZ2VFbGVtZW50XCI6MjAsXCIuL0ltYWdlXCI6MjYsXCIuL0xvY2F0aW9uXCI6MjcsXCIuL05hdmlnYXRvclwiOjI5LFwiLi9TY3JlZW5cIjozMixcIi4vVG91Y2hFdmVudFwiOjMzLFwiLi9YTUxIdHRwUmVxdWVzdFwiOjM0LFwiLi9hdWRpb0NvbnRleHQvQXVkaW9Db250ZXh0XCI6MzksXCIuL3htbGRvbS9kb20tcGFyc2VyLmpzXCI6NTV9XSw1NTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gRE9NUGFyc2VyKG9wdGlvbnMpIHtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7XG4gICAgbG9jYXRvcjoge31cbiAgfTtcbn1cblxuRE9NUGFyc2VyLnByb3RvdHlwZS5wYXJzZUZyb21TdHJpbmcgPSBmdW5jdGlvbiAoc291cmNlLCBtaW1lVHlwZSkge1xuICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgdmFyIHNheCA9IG5ldyBYTUxSZWFkZXIoKTtcbiAgdmFyIGRvbUJ1aWxkZXIgPSBvcHRpb25zLmRvbUJ1aWxkZXIgfHwgbmV3IERPTUhhbmRsZXIoKTtcbiAgdmFyIGVycm9ySGFuZGxlciA9IG9wdGlvbnMuZXJyb3JIYW5kbGVyO1xuICB2YXIgbG9jYXRvciA9IG9wdGlvbnMubG9jYXRvcjtcbiAgdmFyIGRlZmF1bHROU01hcCA9IG9wdGlvbnMueG1sbnMgfHwge307XG4gIHZhciBpc0hUTUwgPSAvXFwveD9odG1sPyQvLnRlc3QobWltZVR5cGUpO1xuICB2YXIgZW50aXR5TWFwID0gaXNIVE1MID8gaHRtbEVudGl0eS5lbnRpdHlNYXAgOiB7XG4gICAgJ2x0JzogJzwnLFxuICAgICdndCc6ICc+JyxcbiAgICAnYW1wJzogJyYnLFxuICAgICdxdW90JzogJ1wiJyxcbiAgICAnYXBvcyc6IFwiJ1wiXG4gIH07XG5cbiAgaWYgKGxvY2F0b3IpIHtcbiAgICBkb21CdWlsZGVyLnNldERvY3VtZW50TG9jYXRvcihsb2NhdG9yKTtcbiAgfVxuXG4gIHNheC5lcnJvckhhbmRsZXIgPSBidWlsZEVycm9ySGFuZGxlcihlcnJvckhhbmRsZXIsIGRvbUJ1aWxkZXIsIGxvY2F0b3IpO1xuICBzYXguZG9tQnVpbGRlciA9IG9wdGlvbnMuZG9tQnVpbGRlciB8fCBkb21CdWlsZGVyO1xuXG4gIGlmIChpc0hUTUwpIHtcbiAgICBkZWZhdWx0TlNNYXBbJyddID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnO1xuICB9XG5cbiAgZGVmYXVsdE5TTWFwLnhtbCA9IGRlZmF1bHROU01hcC54bWwgfHwgJ2h0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZSc7XG5cbiAgaWYgKHNvdXJjZSkge1xuICAgIHNheC5wYXJzZShzb3VyY2UsIGRlZmF1bHROU01hcCwgZW50aXR5TWFwKTtcbiAgfSBlbHNlIHtcbiAgICBzYXguZXJyb3JIYW5kbGVyLmVycm9yKFwiaW52YWxpZCBkb2Mgc291cmNlXCIpO1xuICB9XG5cbiAgcmV0dXJuIGRvbUJ1aWxkZXIuZG9jO1xufTtcblxuZnVuY3Rpb24gYnVpbGRFcnJvckhhbmRsZXIoZXJyb3JJbXBsLCBkb21CdWlsZGVyLCBsb2NhdG9yKSB7XG4gIGlmICghZXJyb3JJbXBsKSB7XG4gICAgaWYgKGRvbUJ1aWxkZXIgaW5zdGFuY2VvZiBET01IYW5kbGVyKSB7XG4gICAgICByZXR1cm4gZG9tQnVpbGRlcjtcbiAgICB9XG5cbiAgICBlcnJvckltcGwgPSBkb21CdWlsZGVyO1xuICB9XG5cbiAgdmFyIGVycm9ySGFuZGxlciA9IHt9O1xuICB2YXIgaXNDYWxsYmFjayA9IGVycm9ySW1wbCBpbnN0YW5jZW9mIEZ1bmN0aW9uO1xuICBsb2NhdG9yID0gbG9jYXRvciB8fCB7fTtcblxuICBmdW5jdGlvbiBidWlsZChrZXkpIHtcbiAgICB2YXIgZm4gPSBlcnJvckltcGxba2V5XTtcblxuICAgIGlmICghZm4gJiYgaXNDYWxsYmFjaykge1xuICAgICAgZm4gPSBlcnJvckltcGwubGVuZ3RoID09IDIgPyBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIGVycm9ySW1wbChrZXksIG1zZyk7XG4gICAgICB9IDogZXJyb3JJbXBsO1xuICAgIH1cblxuICAgIGVycm9ySGFuZGxlcltrZXldID0gZm4gJiYgZnVuY3Rpb24gKG1zZykge1xuICAgICAgZm4oJ1t4bWxkb20gJyArIGtleSArICddXFx0JyArIG1zZyArIF9sb2NhdG9yKGxvY2F0b3IpKTtcbiAgICB9IHx8IGZ1bmN0aW9uICgpIHt9O1xuICB9XG5cbiAgYnVpbGQoJ3dhcm5pbmcnKTtcbiAgYnVpbGQoJ2Vycm9yJyk7XG4gIGJ1aWxkKCdmYXRhbEVycm9yJyk7XG4gIHJldHVybiBlcnJvckhhbmRsZXI7XG59XG5cbmZ1bmN0aW9uIERPTUhhbmRsZXIoKSB7XG4gIHRoaXMuY2RhdGEgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gcG9zaXRpb24obG9jYXRvciwgbm9kZSkge1xuICBub2RlLmxpbmVOdW1iZXIgPSBsb2NhdG9yLmxpbmVOdW1iZXI7XG4gIG5vZGUuY29sdW1uTnVtYmVyID0gbG9jYXRvci5jb2x1bW5OdW1iZXI7XG59XG5cbkRPTUhhbmRsZXIucHJvdG90eXBlID0ge1xuICBzdGFydERvY3VtZW50OiBmdW5jdGlvbiBzdGFydERvY3VtZW50KCkge1xuICAgIHRoaXMuZG9jID0gbmV3IERPTUltcGxlbWVudGF0aW9uKCkuY3JlYXRlRG9jdW1lbnQobnVsbCwgbnVsbCwgbnVsbCk7XG5cbiAgICBpZiAodGhpcy5sb2NhdG9yKSB7XG4gICAgICB0aGlzLmRvYy5kb2N1bWVudFVSSSA9IHRoaXMubG9jYXRvci5zeXN0ZW1JZDtcbiAgICB9XG4gIH0sXG4gIHN0YXJ0RWxlbWVudDogZnVuY3Rpb24gc3RhcnRFbGVtZW50KG5hbWVzcGFjZVVSSSwgbG9jYWxOYW1lLCBxTmFtZSwgYXR0cnMpIHtcbiAgICB2YXIgZG9jID0gdGhpcy5kb2M7XG4gICAgdmFyIGVsID0gZG9jLmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2VVUkksIHFOYW1lIHx8IGxvY2FsTmFtZSk7XG4gICAgdmFyIGxlbiA9IGF0dHJzLmxlbmd0aDtcbiAgICBhcHBlbmRFbGVtZW50KHRoaXMsIGVsKTtcbiAgICB0aGlzLmN1cnJlbnRFbGVtZW50ID0gZWw7XG4gICAgdGhpcy5sb2NhdG9yICYmIHBvc2l0aW9uKHRoaXMubG9jYXRvciwgZWwpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmFyIG5hbWVzcGFjZVVSSSA9IGF0dHJzLmdldFVSSShpKTtcbiAgICAgIHZhciB2YWx1ZSA9IGF0dHJzLmdldFZhbHVlKGkpO1xuICAgICAgdmFyIHFOYW1lID0gYXR0cnMuZ2V0UU5hbWUoaSk7XG4gICAgICB2YXIgYXR0ciA9IGRvYy5jcmVhdGVBdHRyaWJ1dGVOUyhuYW1lc3BhY2VVUkksIHFOYW1lKTtcbiAgICAgIHRoaXMubG9jYXRvciAmJiBwb3NpdGlvbihhdHRycy5nZXRMb2NhdG9yKGkpLCBhdHRyKTtcbiAgICAgIGF0dHIudmFsdWUgPSBhdHRyLm5vZGVWYWx1ZSA9IHZhbHVlO1xuICAgICAgZWwuc2V0QXR0cmlidXRlTm9kZShhdHRyKTtcbiAgICB9XG4gIH0sXG4gIGVuZEVsZW1lbnQ6IGZ1bmN0aW9uIGVuZEVsZW1lbnQobmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUsIHFOYW1lKSB7XG4gICAgdmFyIGN1cnJlbnQgPSB0aGlzLmN1cnJlbnRFbGVtZW50O1xuICAgIHZhciB0YWdOYW1lID0gY3VycmVudC50YWdOYW1lO1xuICAgIHRoaXMuY3VycmVudEVsZW1lbnQgPSBjdXJyZW50LnBhcmVudE5vZGU7XG4gIH0sXG4gIHN0YXJ0UHJlZml4TWFwcGluZzogZnVuY3Rpb24gc3RhcnRQcmVmaXhNYXBwaW5nKHByZWZpeCwgdXJpKSB7fSxcbiAgZW5kUHJlZml4TWFwcGluZzogZnVuY3Rpb24gZW5kUHJlZml4TWFwcGluZyhwcmVmaXgpIHt9LFxuICBwcm9jZXNzaW5nSW5zdHJ1Y3Rpb246IGZ1bmN0aW9uIHByb2Nlc3NpbmdJbnN0cnVjdGlvbih0YXJnZXQsIGRhdGEpIHtcbiAgICB2YXIgaW5zID0gdGhpcy5kb2MuY3JlYXRlUHJvY2Vzc2luZ0luc3RydWN0aW9uKHRhcmdldCwgZGF0YSk7XG4gICAgdGhpcy5sb2NhdG9yICYmIHBvc2l0aW9uKHRoaXMubG9jYXRvciwgaW5zKTtcbiAgICBhcHBlbmRFbGVtZW50KHRoaXMsIGlucyk7XG4gIH0sXG4gIGlnbm9yYWJsZVdoaXRlc3BhY2U6IGZ1bmN0aW9uIGlnbm9yYWJsZVdoaXRlc3BhY2UoY2gsIHN0YXJ0LCBsZW5ndGgpIHt9LFxuICBjaGFyYWN0ZXJzOiBmdW5jdGlvbiBjaGFyYWN0ZXJzKGNoYXJzLCBzdGFydCwgbGVuZ3RoKSB7XG4gICAgY2hhcnMgPSBfdG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIGlmIChjaGFycykge1xuICAgICAgaWYgKHRoaXMuY2RhdGEpIHtcbiAgICAgICAgdmFyIGNoYXJOb2RlID0gdGhpcy5kb2MuY3JlYXRlQ0RBVEFTZWN0aW9uKGNoYXJzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBjaGFyTm9kZSA9IHRoaXMuZG9jLmNyZWF0ZVRleHROb2RlKGNoYXJzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY3VycmVudEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50RWxlbWVudC5hcHBlbmRDaGlsZChjaGFyTm9kZSk7XG4gICAgICB9IGVsc2UgaWYgKC9eXFxzKiQvLnRlc3QoY2hhcnMpKSB7XG4gICAgICAgIHRoaXMuZG9jLmFwcGVuZENoaWxkKGNoYXJOb2RlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5sb2NhdG9yICYmIHBvc2l0aW9uKHRoaXMubG9jYXRvciwgY2hhck5vZGUpO1xuICAgIH1cbiAgfSxcbiAgc2tpcHBlZEVudGl0eTogZnVuY3Rpb24gc2tpcHBlZEVudGl0eShuYW1lKSB7fSxcbiAgZW5kRG9jdW1lbnQ6IGZ1bmN0aW9uIGVuZERvY3VtZW50KCkge1xuICAgIHRoaXMuZG9jLm5vcm1hbGl6ZSgpO1xuICB9LFxuICBzZXREb2N1bWVudExvY2F0b3I6IGZ1bmN0aW9uIHNldERvY3VtZW50TG9jYXRvcihsb2NhdG9yKSB7XG4gICAgaWYgKHRoaXMubG9jYXRvciA9IGxvY2F0b3IpIHtcbiAgICAgIGxvY2F0b3IubGluZU51bWJlciA9IDA7XG4gICAgfVxuICB9LFxuICBjb21tZW50OiBmdW5jdGlvbiBjb21tZW50KGNoYXJzLCBzdGFydCwgbGVuZ3RoKSB7XG4gICAgY2hhcnMgPSBfdG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB2YXIgY29tbSA9IHRoaXMuZG9jLmNyZWF0ZUNvbW1lbnQoY2hhcnMpO1xuICAgIHRoaXMubG9jYXRvciAmJiBwb3NpdGlvbih0aGlzLmxvY2F0b3IsIGNvbW0pO1xuICAgIGFwcGVuZEVsZW1lbnQodGhpcywgY29tbSk7XG4gIH0sXG4gIHN0YXJ0Q0RBVEE6IGZ1bmN0aW9uIHN0YXJ0Q0RBVEEoKSB7XG4gICAgdGhpcy5jZGF0YSA9IHRydWU7XG4gIH0sXG4gIGVuZENEQVRBOiBmdW5jdGlvbiBlbmRDREFUQSgpIHtcbiAgICB0aGlzLmNkYXRhID0gZmFsc2U7XG4gIH0sXG4gIHN0YXJ0RFREOiBmdW5jdGlvbiBzdGFydERURChuYW1lLCBwdWJsaWNJZCwgc3lzdGVtSWQpIHtcbiAgICB2YXIgaW1wbCA9IHRoaXMuZG9jLmltcGxlbWVudGF0aW9uO1xuXG4gICAgaWYgKGltcGwgJiYgaW1wbC5jcmVhdGVEb2N1bWVudFR5cGUpIHtcbiAgICAgIHZhciBkdCA9IGltcGwuY3JlYXRlRG9jdW1lbnRUeXBlKG5hbWUsIHB1YmxpY0lkLCBzeXN0ZW1JZCk7XG4gICAgICB0aGlzLmxvY2F0b3IgJiYgcG9zaXRpb24odGhpcy5sb2NhdG9yLCBkdCk7XG4gICAgICBhcHBlbmRFbGVtZW50KHRoaXMsIGR0KTtcbiAgICB9XG4gIH0sXG4gIHdhcm5pbmc6IGZ1bmN0aW9uIHdhcm5pbmcoZXJyb3IpIHtcbiAgICBjb25zb2xlLndhcm4oJ1t4bWxkb20gd2FybmluZ11cXHQnICsgZXJyb3IsIF9sb2NhdG9yKHRoaXMubG9jYXRvcikpO1xuICB9LFxuICBlcnJvcjogZnVuY3Rpb24gZXJyb3IoX2Vycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignW3htbGRvbSBlcnJvcl1cXHQnICsgX2Vycm9yLCBfbG9jYXRvcih0aGlzLmxvY2F0b3IpKTtcbiAgfSxcbiAgZmF0YWxFcnJvcjogZnVuY3Rpb24gZmF0YWxFcnJvcihlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1t4bWxkb20gZmF0YWxFcnJvcl1cXHQnICsgZXJyb3IsIF9sb2NhdG9yKHRoaXMubG9jYXRvcikpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfbG9jYXRvcihsKSB7XG4gIGlmIChsKSB7XG4gICAgcmV0dXJuICdcXG5AJyArIChsLnN5c3RlbUlkIHx8ICcnKSArICcjW2xpbmU6JyArIGwubGluZU51bWJlciArICcsY29sOicgKyBsLmNvbHVtbk51bWJlciArICddJztcbiAgfVxufVxuXG5mdW5jdGlvbiBfdG9TdHJpbmcoY2hhcnMsIHN0YXJ0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiBjaGFycyA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBjaGFycy5zdWJzdHIoc3RhcnQsIGxlbmd0aCk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGNoYXJzLmxlbmd0aCA+PSBzdGFydCArIGxlbmd0aCB8fCBzdGFydCkge1xuICAgICAgcmV0dXJuIG5ldyBqYXZhLmxhbmcuU3RyaW5nKGNoYXJzLCBzdGFydCwgbGVuZ3RoKSArICcnO1xuICAgIH1cblxuICAgIHJldHVybiBjaGFycztcbiAgfVxufVxuXG5cImVuZERURCxzdGFydEVudGl0eSxlbmRFbnRpdHksYXR0cmlidXRlRGVjbCxlbGVtZW50RGVjbCxleHRlcm5hbEVudGl0eURlY2wsaW50ZXJuYWxFbnRpdHlEZWNsLHJlc29sdmVFbnRpdHksZ2V0RXh0ZXJuYWxTdWJzZXQsbm90YXRpb25EZWNsLHVucGFyc2VkRW50aXR5RGVjbFwiLnJlcGxhY2UoL1xcdysvZywgZnVuY3Rpb24gKGtleSkge1xuICBET01IYW5kbGVyLnByb3RvdHlwZVtrZXldID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9O1xufSk7XG5cbmZ1bmN0aW9uIGFwcGVuZEVsZW1lbnQoaGFuZGVyLCBub2RlKSB7XG4gIGlmICghaGFuZGVyLmN1cnJlbnRFbGVtZW50KSB7XG4gICAgaGFuZGVyLmRvYy5hcHBlbmRDaGlsZChub2RlKTtcbiAgfSBlbHNlIHtcbiAgICBoYW5kZXIuY3VycmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gIH1cbn1cblxudmFyIGh0bWxFbnRpdHkgPSByZXF1aXJlKCcuL2VudGl0aWVzJyk7XG5cbnZhciBYTUxSZWFkZXIgPSByZXF1aXJlKCcuL3NheCcpLlhNTFJlYWRlcjtcblxudmFyIERPTUltcGxlbWVudGF0aW9uID0gZXhwb3J0cy5ET01JbXBsZW1lbnRhdGlvbiA9IHJlcXVpcmUoJy4vZG9tJykuRE9NSW1wbGVtZW50YXRpb247XG5cbmV4cG9ydHMuWE1MU2VyaWFsaXplciA9IHJlcXVpcmUoJy4vZG9tJykuWE1MU2VyaWFsaXplcjtcbmV4cG9ydHMuRE9NUGFyc2VyID0gRE9NUGFyc2VyO1xuXG59LHtcIi4vZG9tXCI6NTYsXCIuL2VudGl0aWVzXCI6NTcsXCIuL3NheFwiOjU4fV0sNTY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuZnVuY3Rpb24gY29weShzcmMsIGRlc3QpIHtcbiAgZm9yICh2YXIgcCBpbiBzcmMpIHtcbiAgICBkZXN0W3BdID0gc3JjW3BdO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9leHRlbmRzKENsYXNzLCBTdXBlcikge1xuICB2YXIgcHQgPSBDbGFzcy5wcm90b3R5cGU7XG5cbiAgaWYgKCEocHQgaW5zdGFuY2VvZiBTdXBlcikpIHtcbiAgICB2YXIgdCA9IGZ1bmN0aW9uIHQoKSB7fTtcblxuICAgIDtcbiAgICB0LnByb3RvdHlwZSA9IFN1cGVyLnByb3RvdHlwZTtcbiAgICB0ID0gbmV3IHQoKTtcbiAgICBjb3B5KHB0LCB0KTtcbiAgICBDbGFzcy5wcm90b3R5cGUgPSBwdCA9IHQ7XG4gIH1cblxuICBpZiAocHQuY29uc3RydWN0b3IgIT0gQ2xhc3MpIHtcbiAgICBpZiAodHlwZW9mIENsYXNzICE9ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJ1bmtub3cgQ2xhc3M6XCIgKyBDbGFzcyk7XG4gICAgfVxuXG4gICAgcHQuY29uc3RydWN0b3IgPSBDbGFzcztcbiAgfVxufVxuXG52YXIgaHRtbG5zID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnO1xudmFyIE5vZGVUeXBlID0ge307XG52YXIgRUxFTUVOVF9OT0RFID0gTm9kZVR5cGUuRUxFTUVOVF9OT0RFID0gMTtcbnZhciBBVFRSSUJVVEVfTk9ERSA9IE5vZGVUeXBlLkFUVFJJQlVURV9OT0RFID0gMjtcbnZhciBURVhUX05PREUgPSBOb2RlVHlwZS5URVhUX05PREUgPSAzO1xudmFyIENEQVRBX1NFQ1RJT05fTk9ERSA9IE5vZGVUeXBlLkNEQVRBX1NFQ1RJT05fTk9ERSA9IDQ7XG52YXIgRU5USVRZX1JFRkVSRU5DRV9OT0RFID0gTm9kZVR5cGUuRU5USVRZX1JFRkVSRU5DRV9OT0RFID0gNTtcbnZhciBFTlRJVFlfTk9ERSA9IE5vZGVUeXBlLkVOVElUWV9OT0RFID0gNjtcbnZhciBQUk9DRVNTSU5HX0lOU1RSVUNUSU9OX05PREUgPSBOb2RlVHlwZS5QUk9DRVNTSU5HX0lOU1RSVUNUSU9OX05PREUgPSA3O1xudmFyIENPTU1FTlRfTk9ERSA9IE5vZGVUeXBlLkNPTU1FTlRfTk9ERSA9IDg7XG52YXIgRE9DVU1FTlRfTk9ERSA9IE5vZGVUeXBlLkRPQ1VNRU5UX05PREUgPSA5O1xudmFyIERPQ1VNRU5UX1RZUEVfTk9ERSA9IE5vZGVUeXBlLkRPQ1VNRU5UX1RZUEVfTk9ERSA9IDEwO1xudmFyIERPQ1VNRU5UX0ZSQUdNRU5UX05PREUgPSBOb2RlVHlwZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFID0gMTE7XG52YXIgTk9UQVRJT05fTk9ERSA9IE5vZGVUeXBlLk5PVEFUSU9OX05PREUgPSAxMjtcbnZhciBFeGNlcHRpb25Db2RlID0ge307XG52YXIgRXhjZXB0aW9uTWVzc2FnZSA9IHt9O1xudmFyIElOREVYX1NJWkVfRVJSID0gRXhjZXB0aW9uQ29kZS5JTkRFWF9TSVpFX0VSUiA9IChFeGNlcHRpb25NZXNzYWdlWzFdID0gXCJJbmRleCBzaXplIGVycm9yXCIsIDEpO1xudmFyIERPTVNUUklOR19TSVpFX0VSUiA9IEV4Y2VwdGlvbkNvZGUuRE9NU1RSSU5HX1NJWkVfRVJSID0gKEV4Y2VwdGlvbk1lc3NhZ2VbMl0gPSBcIkRPTVN0cmluZyBzaXplIGVycm9yXCIsIDIpO1xudmFyIEhJRVJBUkNIWV9SRVFVRVNUX0VSUiA9IEV4Y2VwdGlvbkNvZGUuSElFUkFSQ0hZX1JFUVVFU1RfRVJSID0gKEV4Y2VwdGlvbk1lc3NhZ2VbM10gPSBcIkhpZXJhcmNoeSByZXF1ZXN0IGVycm9yXCIsIDMpO1xudmFyIFdST05HX0RPQ1VNRU5UX0VSUiA9IEV4Y2VwdGlvbkNvZGUuV1JPTkdfRE9DVU1FTlRfRVJSID0gKEV4Y2VwdGlvbk1lc3NhZ2VbNF0gPSBcIldyb25nIGRvY3VtZW50XCIsIDQpO1xudmFyIElOVkFMSURfQ0hBUkFDVEVSX0VSUiA9IEV4Y2VwdGlvbkNvZGUuSU5WQUxJRF9DSEFSQUNURVJfRVJSID0gKEV4Y2VwdGlvbk1lc3NhZ2VbNV0gPSBcIkludmFsaWQgY2hhcmFjdGVyXCIsIDUpO1xudmFyIE5PX0RBVEFfQUxMT1dFRF9FUlIgPSBFeGNlcHRpb25Db2RlLk5PX0RBVEFfQUxMT1dFRF9FUlIgPSAoRXhjZXB0aW9uTWVzc2FnZVs2XSA9IFwiTm8gZGF0YSBhbGxvd2VkXCIsIDYpO1xudmFyIE5PX01PRElGSUNBVElPTl9BTExPV0VEX0VSUiA9IEV4Y2VwdGlvbkNvZGUuTk9fTU9ESUZJQ0FUSU9OX0FMTE9XRURfRVJSID0gKEV4Y2VwdGlvbk1lc3NhZ2VbN10gPSBcIk5vIG1vZGlmaWNhdGlvbiBhbGxvd2VkXCIsIDcpO1xudmFyIE5PVF9GT1VORF9FUlIgPSBFeGNlcHRpb25Db2RlLk5PVF9GT1VORF9FUlIgPSAoRXhjZXB0aW9uTWVzc2FnZVs4XSA9IFwiTm90IGZvdW5kXCIsIDgpO1xudmFyIE5PVF9TVVBQT1JURURfRVJSID0gRXhjZXB0aW9uQ29kZS5OT1RfU1VQUE9SVEVEX0VSUiA9IChFeGNlcHRpb25NZXNzYWdlWzldID0gXCJOb3Qgc3VwcG9ydGVkXCIsIDkpO1xudmFyIElOVVNFX0FUVFJJQlVURV9FUlIgPSBFeGNlcHRpb25Db2RlLklOVVNFX0FUVFJJQlVURV9FUlIgPSAoRXhjZXB0aW9uTWVzc2FnZVsxMF0gPSBcIkF0dHJpYnV0ZSBpbiB1c2VcIiwgMTApO1xudmFyIElOVkFMSURfU1RBVEVfRVJSID0gRXhjZXB0aW9uQ29kZS5JTlZBTElEX1NUQVRFX0VSUiA9IChFeGNlcHRpb25NZXNzYWdlWzExXSA9IFwiSW52YWxpZCBzdGF0ZVwiLCAxMSk7XG52YXIgU1lOVEFYX0VSUiA9IEV4Y2VwdGlvbkNvZGUuU1lOVEFYX0VSUiA9IChFeGNlcHRpb25NZXNzYWdlWzEyXSA9IFwiU3ludGF4IGVycm9yXCIsIDEyKTtcbnZhciBJTlZBTElEX01PRElGSUNBVElPTl9FUlIgPSBFeGNlcHRpb25Db2RlLklOVkFMSURfTU9ESUZJQ0FUSU9OX0VSUiA9IChFeGNlcHRpb25NZXNzYWdlWzEzXSA9IFwiSW52YWxpZCBtb2RpZmljYXRpb25cIiwgMTMpO1xudmFyIE5BTUVTUEFDRV9FUlIgPSBFeGNlcHRpb25Db2RlLk5BTUVTUEFDRV9FUlIgPSAoRXhjZXB0aW9uTWVzc2FnZVsxNF0gPSBcIkludmFsaWQgbmFtZXNwYWNlXCIsIDE0KTtcbnZhciBJTlZBTElEX0FDQ0VTU19FUlIgPSBFeGNlcHRpb25Db2RlLklOVkFMSURfQUNDRVNTX0VSUiA9IChFeGNlcHRpb25NZXNzYWdlWzE1XSA9IFwiSW52YWxpZCBhY2Nlc3NcIiwgMTUpO1xuXG5mdW5jdGlvbiBET01FeGNlcHRpb24oY29kZSwgbWVzc2FnZSkge1xuICBpZiAobWVzc2FnZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgdmFyIGVycm9yID0gbWVzc2FnZTtcbiAgfSBlbHNlIHtcbiAgICBlcnJvciA9IHRoaXM7XG4gICAgRXJyb3IuY2FsbCh0aGlzLCBFeGNlcHRpb25NZXNzYWdlW2NvZGVdKTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBFeGNlcHRpb25NZXNzYWdlW2NvZGVdO1xuICAgIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgRE9NRXhjZXB0aW9uKTtcbiAgfVxuXG4gIGVycm9yLmNvZGUgPSBjb2RlO1xuICBpZiAobWVzc2FnZSkgdGhpcy5tZXNzYWdlID0gdGhpcy5tZXNzYWdlICsgXCI6IFwiICsgbWVzc2FnZTtcbiAgcmV0dXJuIGVycm9yO1xufVxuXG47XG5ET01FeGNlcHRpb24ucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xuY29weShFeGNlcHRpb25Db2RlLCBET01FeGNlcHRpb24pO1xuXG5mdW5jdGlvbiBOb2RlTGlzdCgpIHt9XG5cbjtcbk5vZGVMaXN0LnByb3RvdHlwZSA9IHtcbiAgbGVuZ3RoOiAwLFxuICBpdGVtOiBmdW5jdGlvbiBpdGVtKGluZGV4KSB7XG4gICAgcmV0dXJuIHRoaXNbaW5kZXhdIHx8IG51bGw7XG4gIH0sXG4gIHRvU3RyaW5nOiBmdW5jdGlvbiB0b1N0cmluZyhpc0hUTUwsIG5vZGVGaWx0ZXIpIHtcbiAgICBmb3IgKHZhciBidWYgPSBbXSwgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzZXJpYWxpemVUb1N0cmluZyh0aGlzW2ldLCBidWYsIGlzSFRNTCwgbm9kZUZpbHRlcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1Zi5qb2luKCcnKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gTGl2ZU5vZGVMaXN0KG5vZGUsIHJlZnJlc2gpIHtcbiAgdGhpcy5fbm9kZSA9IG5vZGU7XG4gIHRoaXMuX3JlZnJlc2ggPSByZWZyZXNoO1xuXG4gIF91cGRhdGVMaXZlTGlzdCh0aGlzKTtcbn1cblxuZnVuY3Rpb24gX3VwZGF0ZUxpdmVMaXN0KGxpc3QpIHtcbiAgdmFyIGluYyA9IGxpc3QuX25vZGUuX2luYyB8fCBsaXN0Ll9ub2RlLm93bmVyRG9jdW1lbnQuX2luYztcblxuICBpZiAobGlzdC5faW5jICE9IGluYykge1xuICAgIHZhciBscyA9IGxpc3QuX3JlZnJlc2gobGlzdC5fbm9kZSk7XG5cbiAgICBfX3NldF9fKGxpc3QsICdsZW5ndGgnLCBscy5sZW5ndGgpO1xuXG4gICAgY29weShscywgbGlzdCk7XG4gICAgbGlzdC5faW5jID0gaW5jO1xuICB9XG59XG5cbkxpdmVOb2RlTGlzdC5wcm90b3R5cGUuaXRlbSA9IGZ1bmN0aW9uIChpKSB7XG4gIF91cGRhdGVMaXZlTGlzdCh0aGlzKTtcblxuICByZXR1cm4gdGhpc1tpXTtcbn07XG5cbl9leHRlbmRzKExpdmVOb2RlTGlzdCwgTm9kZUxpc3QpO1xuXG5mdW5jdGlvbiBOYW1lZE5vZGVNYXAoKSB7fVxuXG47XG5cbmZ1bmN0aW9uIF9maW5kTm9kZUluZGV4KGxpc3QsIG5vZGUpIHtcbiAgdmFyIGkgPSBsaXN0Lmxlbmd0aDtcblxuICB3aGlsZSAoaS0tKSB7XG4gICAgaWYgKGxpc3RbaV0gPT09IG5vZGUpIHtcbiAgICAgIHJldHVybiBpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBfYWRkTmFtZWROb2RlKGVsLCBsaXN0LCBuZXdBdHRyLCBvbGRBdHRyKSB7XG4gIGlmIChvbGRBdHRyKSB7XG4gICAgbGlzdFtfZmluZE5vZGVJbmRleChsaXN0LCBvbGRBdHRyKV0gPSBuZXdBdHRyO1xuICB9IGVsc2Uge1xuICAgIGxpc3RbbGlzdC5sZW5ndGgrK10gPSBuZXdBdHRyO1xuICB9XG5cbiAgaWYgKGVsKSB7XG4gICAgbmV3QXR0ci5vd25lckVsZW1lbnQgPSBlbDtcbiAgICB2YXIgZG9jID0gZWwub3duZXJEb2N1bWVudDtcblxuICAgIGlmIChkb2MpIHtcbiAgICAgIG9sZEF0dHIgJiYgX29uUmVtb3ZlQXR0cmlidXRlKGRvYywgZWwsIG9sZEF0dHIpO1xuXG4gICAgICBfb25BZGRBdHRyaWJ1dGUoZG9jLCBlbCwgbmV3QXR0cik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIF9yZW1vdmVOYW1lZE5vZGUoZWwsIGxpc3QsIGF0dHIpIHtcbiAgdmFyIGkgPSBfZmluZE5vZGVJbmRleChsaXN0LCBhdHRyKTtcblxuICBpZiAoaSA+PSAwKSB7XG4gICAgdmFyIGxhc3RJbmRleCA9IGxpc3QubGVuZ3RoIC0gMTtcblxuICAgIHdoaWxlIChpIDwgbGFzdEluZGV4KSB7XG4gICAgICBsaXN0W2ldID0gbGlzdFsrK2ldO1xuICAgIH1cblxuICAgIGxpc3QubGVuZ3RoID0gbGFzdEluZGV4O1xuXG4gICAgaWYgKGVsKSB7XG4gICAgICB2YXIgZG9jID0gZWwub3duZXJEb2N1bWVudDtcblxuICAgICAgaWYgKGRvYykge1xuICAgICAgICBfb25SZW1vdmVBdHRyaWJ1dGUoZG9jLCBlbCwgYXR0cik7XG5cbiAgICAgICAgYXR0ci5vd25lckVsZW1lbnQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBET01FeGNlcHRpb24oTk9UX0ZPVU5EX0VSUiwgbmV3IEVycm9yKGVsLnRhZ05hbWUgKyAnQCcgKyBhdHRyKSk7XG4gIH1cbn1cblxuTmFtZWROb2RlTWFwLnByb3RvdHlwZSA9IHtcbiAgbGVuZ3RoOiAwLFxuICBpdGVtOiBOb2RlTGlzdC5wcm90b3R5cGUuaXRlbSxcbiAgZ2V0TmFtZWRJdGVtOiBmdW5jdGlvbiBnZXROYW1lZEl0ZW0oa2V5KSB7XG4gICAgdmFyIGkgPSB0aGlzLmxlbmd0aDtcblxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHZhciBhdHRyID0gdGhpc1tpXTtcblxuICAgICAgaWYgKGF0dHIubm9kZU5hbWUgPT0ga2V5KSB7XG4gICAgICAgIHJldHVybiBhdHRyO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgc2V0TmFtZWRJdGVtOiBmdW5jdGlvbiBzZXROYW1lZEl0ZW0oYXR0cikge1xuICAgIHZhciBlbCA9IGF0dHIub3duZXJFbGVtZW50O1xuXG4gICAgaWYgKGVsICYmIGVsICE9IHRoaXMuX293bmVyRWxlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IERPTUV4Y2VwdGlvbihJTlVTRV9BVFRSSUJVVEVfRVJSKTtcbiAgICB9XG5cbiAgICB2YXIgb2xkQXR0ciA9IHRoaXMuZ2V0TmFtZWRJdGVtKGF0dHIubm9kZU5hbWUpO1xuXG4gICAgX2FkZE5hbWVkTm9kZSh0aGlzLl9vd25lckVsZW1lbnQsIHRoaXMsIGF0dHIsIG9sZEF0dHIpO1xuXG4gICAgcmV0dXJuIG9sZEF0dHI7XG4gIH0sXG4gIHNldE5hbWVkSXRlbU5TOiBmdW5jdGlvbiBzZXROYW1lZEl0ZW1OUyhhdHRyKSB7XG4gICAgdmFyIGVsID0gYXR0ci5vd25lckVsZW1lbnQsXG4gICAgICAgIG9sZEF0dHI7XG5cbiAgICBpZiAoZWwgJiYgZWwgIT0gdGhpcy5fb3duZXJFbGVtZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRE9NRXhjZXB0aW9uKElOVVNFX0FUVFJJQlVURV9FUlIpO1xuICAgIH1cblxuICAgIG9sZEF0dHIgPSB0aGlzLmdldE5hbWVkSXRlbU5TKGF0dHIubmFtZXNwYWNlVVJJLCBhdHRyLmxvY2FsTmFtZSk7XG5cbiAgICBfYWRkTmFtZWROb2RlKHRoaXMuX293bmVyRWxlbWVudCwgdGhpcywgYXR0ciwgb2xkQXR0cik7XG5cbiAgICByZXR1cm4gb2xkQXR0cjtcbiAgfSxcbiAgcmVtb3ZlTmFtZWRJdGVtOiBmdW5jdGlvbiByZW1vdmVOYW1lZEl0ZW0oa2V5KSB7XG4gICAgdmFyIGF0dHIgPSB0aGlzLmdldE5hbWVkSXRlbShrZXkpO1xuXG4gICAgX3JlbW92ZU5hbWVkTm9kZSh0aGlzLl9vd25lckVsZW1lbnQsIHRoaXMsIGF0dHIpO1xuXG4gICAgcmV0dXJuIGF0dHI7XG4gIH0sXG4gIHJlbW92ZU5hbWVkSXRlbU5TOiBmdW5jdGlvbiByZW1vdmVOYW1lZEl0ZW1OUyhuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSkge1xuICAgIHZhciBhdHRyID0gdGhpcy5nZXROYW1lZEl0ZW1OUyhuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSk7XG5cbiAgICBfcmVtb3ZlTmFtZWROb2RlKHRoaXMuX293bmVyRWxlbWVudCwgdGhpcywgYXR0cik7XG5cbiAgICByZXR1cm4gYXR0cjtcbiAgfSxcbiAgZ2V0TmFtZWRJdGVtTlM6IGZ1bmN0aW9uIGdldE5hbWVkSXRlbU5TKG5hbWVzcGFjZVVSSSwgbG9jYWxOYW1lKSB7XG4gICAgdmFyIGkgPSB0aGlzLmxlbmd0aDtcblxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHZhciBub2RlID0gdGhpc1tpXTtcblxuICAgICAgaWYgKG5vZGUubG9jYWxOYW1lID09IGxvY2FsTmFtZSAmJiBub2RlLm5hbWVzcGFjZVVSSSA9PSBuYW1lc3BhY2VVUkkpIHtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIERPTUltcGxlbWVudGF0aW9uKGZlYXR1cmVzKSB7XG4gIHRoaXMuX2ZlYXR1cmVzID0ge307XG5cbiAgaWYgKGZlYXR1cmVzKSB7XG4gICAgZm9yICh2YXIgZmVhdHVyZSBpbiBmZWF0dXJlcykge1xuICAgICAgdGhpcy5fZmVhdHVyZXMgPSBmZWF0dXJlc1tmZWF0dXJlXTtcbiAgICB9XG4gIH1cbn1cblxuO1xuRE9NSW1wbGVtZW50YXRpb24ucHJvdG90eXBlID0ge1xuICBoYXNGZWF0dXJlOiBmdW5jdGlvbiBoYXNGZWF0dXJlKGZlYXR1cmUsIHZlcnNpb24pIHtcbiAgICB2YXIgdmVyc2lvbnMgPSB0aGlzLl9mZWF0dXJlc1tmZWF0dXJlLnRvTG93ZXJDYXNlKCldO1xuXG4gICAgaWYgKHZlcnNpb25zICYmICghdmVyc2lvbiB8fCB2ZXJzaW9uIGluIHZlcnNpb25zKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sXG4gIGNyZWF0ZURvY3VtZW50OiBmdW5jdGlvbiBjcmVhdGVEb2N1bWVudChuYW1lc3BhY2VVUkksIHF1YWxpZmllZE5hbWUsIGRvY3R5cGUpIHtcbiAgICB2YXIgZG9jID0gbmV3IERvY3VtZW50KCk7XG4gICAgZG9jLmltcGxlbWVudGF0aW9uID0gdGhpcztcbiAgICBkb2MuY2hpbGROb2RlcyA9IG5ldyBOb2RlTGlzdCgpO1xuICAgIGRvYy5kb2N0eXBlID0gZG9jdHlwZTtcblxuICAgIGlmIChkb2N0eXBlKSB7XG4gICAgICBkb2MuYXBwZW5kQ2hpbGQoZG9jdHlwZSk7XG4gICAgfVxuXG4gICAgaWYgKHF1YWxpZmllZE5hbWUpIHtcbiAgICAgIHZhciByb290ID0gZG9jLmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2VVUkksIHF1YWxpZmllZE5hbWUpO1xuICAgICAgZG9jLmFwcGVuZENoaWxkKHJvb3QpO1xuICAgIH1cblxuICAgIHJldHVybiBkb2M7XG4gIH0sXG4gIGNyZWF0ZURvY3VtZW50VHlwZTogZnVuY3Rpb24gY3JlYXRlRG9jdW1lbnRUeXBlKHF1YWxpZmllZE5hbWUsIHB1YmxpY0lkLCBzeXN0ZW1JZCkge1xuICAgIHZhciBub2RlID0gbmV3IERvY3VtZW50VHlwZSgpO1xuICAgIG5vZGUubmFtZSA9IHF1YWxpZmllZE5hbWU7XG4gICAgbm9kZS5ub2RlTmFtZSA9IHF1YWxpZmllZE5hbWU7XG4gICAgbm9kZS5wdWJsaWNJZCA9IHB1YmxpY0lkO1xuICAgIG5vZGUuc3lzdGVtSWQgPSBzeXN0ZW1JZDtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxufTtcblxuZnVuY3Rpb24gTm9kZSgpIHt9XG5cbjtcbk5vZGUucHJvdG90eXBlID0ge1xuICBmaXJzdENoaWxkOiBudWxsLFxuICBsYXN0Q2hpbGQ6IG51bGwsXG4gIHByZXZpb3VzU2libGluZzogbnVsbCxcbiAgbmV4dFNpYmxpbmc6IG51bGwsXG4gIGF0dHJpYnV0ZXM6IG51bGwsXG4gIHBhcmVudE5vZGU6IG51bGwsXG4gIGNoaWxkTm9kZXM6IG51bGwsXG4gIG93bmVyRG9jdW1lbnQ6IG51bGwsXG4gIG5vZGVWYWx1ZTogbnVsbCxcbiAgbmFtZXNwYWNlVVJJOiBudWxsLFxuICBwcmVmaXg6IG51bGwsXG4gIGxvY2FsTmFtZTogbnVsbCxcbiAgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbiBpbnNlcnRCZWZvcmUobmV3Q2hpbGQsIHJlZkNoaWxkKSB7XG4gICAgcmV0dXJuIF9pbnNlcnRCZWZvcmUodGhpcywgbmV3Q2hpbGQsIHJlZkNoaWxkKTtcbiAgfSxcbiAgcmVwbGFjZUNoaWxkOiBmdW5jdGlvbiByZXBsYWNlQ2hpbGQobmV3Q2hpbGQsIG9sZENoaWxkKSB7XG4gICAgdGhpcy5pbnNlcnRCZWZvcmUobmV3Q2hpbGQsIG9sZENoaWxkKTtcblxuICAgIGlmIChvbGRDaGlsZCkge1xuICAgICAgdGhpcy5yZW1vdmVDaGlsZChvbGRDaGlsZCk7XG4gICAgfVxuICB9LFxuICByZW1vdmVDaGlsZDogZnVuY3Rpb24gcmVtb3ZlQ2hpbGQob2xkQ2hpbGQpIHtcbiAgICByZXR1cm4gX3JlbW92ZUNoaWxkKHRoaXMsIG9sZENoaWxkKTtcbiAgfSxcbiAgYXBwZW5kQ2hpbGQ6IGZ1bmN0aW9uIGFwcGVuZENoaWxkKG5ld0NoaWxkKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zZXJ0QmVmb3JlKG5ld0NoaWxkLCBudWxsKTtcbiAgfSxcbiAgaGFzQ2hpbGROb2RlczogZnVuY3Rpb24gaGFzQ2hpbGROb2RlcygpIHtcbiAgICByZXR1cm4gdGhpcy5maXJzdENoaWxkICE9IG51bGw7XG4gIH0sXG4gIGNsb25lTm9kZTogZnVuY3Rpb24gY2xvbmVOb2RlKGRlZXApIHtcbiAgICByZXR1cm4gX2Nsb25lTm9kZSh0aGlzLm93bmVyRG9jdW1lbnQgfHwgdGhpcywgdGhpcywgZGVlcCk7XG4gIH0sXG4gIG5vcm1hbGl6ZTogZnVuY3Rpb24gbm9ybWFsaXplKCkge1xuICAgIHZhciBjaGlsZCA9IHRoaXMuZmlyc3RDaGlsZDtcblxuICAgIHdoaWxlIChjaGlsZCkge1xuICAgICAgdmFyIG5leHQgPSBjaGlsZC5uZXh0U2libGluZztcblxuICAgICAgaWYgKG5leHQgJiYgbmV4dC5ub2RlVHlwZSA9PSBURVhUX05PREUgJiYgY2hpbGQubm9kZVR5cGUgPT0gVEVYVF9OT0RFKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQobmV4dCk7XG4gICAgICAgIGNoaWxkLmFwcGVuZERhdGEobmV4dC5kYXRhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoaWxkLm5vcm1hbGl6ZSgpO1xuICAgICAgICBjaGlsZCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBpc1N1cHBvcnRlZDogZnVuY3Rpb24gaXNTdXBwb3J0ZWQoZmVhdHVyZSwgdmVyc2lvbikge1xuICAgIHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQuaW1wbGVtZW50YXRpb24uaGFzRmVhdHVyZShmZWF0dXJlLCB2ZXJzaW9uKTtcbiAgfSxcbiAgaGFzQXR0cmlidXRlczogZnVuY3Rpb24gaGFzQXR0cmlidXRlcygpIHtcbiAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzLmxlbmd0aCA+IDA7XG4gIH0sXG4gIGxvb2t1cFByZWZpeDogZnVuY3Rpb24gbG9va3VwUHJlZml4KG5hbWVzcGFjZVVSSSkge1xuICAgIHZhciBlbCA9IHRoaXM7XG5cbiAgICB3aGlsZSAoZWwpIHtcbiAgICAgIHZhciBtYXAgPSBlbC5fbnNNYXA7XG5cbiAgICAgIGlmIChtYXApIHtcbiAgICAgICAgZm9yICh2YXIgbiBpbiBtYXApIHtcbiAgICAgICAgICBpZiAobWFwW25dID09IG5hbWVzcGFjZVVSSSkge1xuICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGVsID0gZWwubm9kZVR5cGUgPT0gQVRUUklCVVRFX05PREUgPyBlbC5vd25lckRvY3VtZW50IDogZWwucGFyZW50Tm9kZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgbG9va3VwTmFtZXNwYWNlVVJJOiBmdW5jdGlvbiBsb29rdXBOYW1lc3BhY2VVUkkocHJlZml4KSB7XG4gICAgdmFyIGVsID0gdGhpcztcblxuICAgIHdoaWxlIChlbCkge1xuICAgICAgdmFyIG1hcCA9IGVsLl9uc01hcDtcblxuICAgICAgaWYgKG1hcCkge1xuICAgICAgICBpZiAocHJlZml4IGluIG1hcCkge1xuICAgICAgICAgIHJldHVybiBtYXBbcHJlZml4XTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlbCA9IGVsLm5vZGVUeXBlID09IEFUVFJJQlVURV9OT0RFID8gZWwub3duZXJEb2N1bWVudCA6IGVsLnBhcmVudE5vZGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIGlzRGVmYXVsdE5hbWVzcGFjZTogZnVuY3Rpb24gaXNEZWZhdWx0TmFtZXNwYWNlKG5hbWVzcGFjZVVSSSkge1xuICAgIHZhciBwcmVmaXggPSB0aGlzLmxvb2t1cFByZWZpeChuYW1lc3BhY2VVUkkpO1xuICAgIHJldHVybiBwcmVmaXggPT0gbnVsbDtcbiAgfVxufTtcblxuZnVuY3Rpb24gX3htbEVuY29kZXIoYykge1xuICByZXR1cm4gYyA9PSAnPCcgJiYgJyZsdDsnIHx8IGMgPT0gJz4nICYmICcmZ3Q7JyB8fCBjID09ICcmJyAmJiAnJmFtcDsnIHx8IGMgPT0gJ1wiJyAmJiAnJnF1b3Q7JyB8fCAnJiMnICsgYy5jaGFyQ29kZUF0KCkgKyAnOyc7XG59XG5cbmNvcHkoTm9kZVR5cGUsIE5vZGUpO1xuY29weShOb2RlVHlwZSwgTm9kZS5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBfdmlzaXROb2RlKG5vZGUsIGNhbGxiYWNrKSB7XG4gIGlmIChjYWxsYmFjayhub2RlKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKG5vZGUgPSBub2RlLmZpcnN0Q2hpbGQpIHtcbiAgICBkbyB7XG4gICAgICBpZiAoX3Zpc2l0Tm9kZShub2RlLCBjYWxsYmFjaykpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSB3aGlsZSAobm9kZSA9IG5vZGUubmV4dFNpYmxpbmcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIERvY3VtZW50KCkge31cblxuZnVuY3Rpb24gX29uQWRkQXR0cmlidXRlKGRvYywgZWwsIG5ld0F0dHIpIHtcbiAgZG9jICYmIGRvYy5faW5jKys7XG4gIHZhciBucyA9IG5ld0F0dHIubmFtZXNwYWNlVVJJO1xuXG4gIGlmIChucyA9PSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nKSB7XG4gICAgZWwuX25zTWFwW25ld0F0dHIucHJlZml4ID8gbmV3QXR0ci5sb2NhbE5hbWUgOiAnJ10gPSBuZXdBdHRyLnZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9vblJlbW92ZUF0dHJpYnV0ZShkb2MsIGVsLCBuZXdBdHRyLCByZW1vdmUpIHtcbiAgZG9jICYmIGRvYy5faW5jKys7XG4gIHZhciBucyA9IG5ld0F0dHIubmFtZXNwYWNlVVJJO1xuXG4gIGlmIChucyA9PSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nKSB7XG4gICAgZGVsZXRlIGVsLl9uc01hcFtuZXdBdHRyLnByZWZpeCA/IG5ld0F0dHIubG9jYWxOYW1lIDogJyddO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9vblVwZGF0ZUNoaWxkKGRvYywgZWwsIG5ld0NoaWxkKSB7XG4gIGlmIChkb2MgJiYgZG9jLl9pbmMpIHtcbiAgICBkb2MuX2luYysrO1xuICAgIHZhciBjcyA9IGVsLmNoaWxkTm9kZXM7XG5cbiAgICBpZiAobmV3Q2hpbGQpIHtcbiAgICAgIGNzW2NzLmxlbmd0aCsrXSA9IG5ld0NoaWxkO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgY2hpbGQgPSBlbC5maXJzdENoaWxkO1xuICAgICAgdmFyIGkgPSAwO1xuXG4gICAgICB3aGlsZSAoY2hpbGQpIHtcbiAgICAgICAgY3NbaSsrXSA9IGNoaWxkO1xuICAgICAgICBjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgfVxuXG4gICAgICBjcy5sZW5ndGggPSBpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVtb3ZlQ2hpbGQocGFyZW50Tm9kZSwgY2hpbGQpIHtcbiAgdmFyIHByZXZpb3VzID0gY2hpbGQucHJldmlvdXNTaWJsaW5nO1xuICB2YXIgbmV4dCA9IGNoaWxkLm5leHRTaWJsaW5nO1xuXG4gIGlmIChwcmV2aW91cykge1xuICAgIHByZXZpb3VzLm5leHRTaWJsaW5nID0gbmV4dDtcbiAgfSBlbHNlIHtcbiAgICBwYXJlbnROb2RlLmZpcnN0Q2hpbGQgPSBuZXh0O1xuICB9XG5cbiAgaWYgKG5leHQpIHtcbiAgICBuZXh0LnByZXZpb3VzU2libGluZyA9IHByZXZpb3VzO1xuICB9IGVsc2Uge1xuICAgIHBhcmVudE5vZGUubGFzdENoaWxkID0gcHJldmlvdXM7XG4gIH1cblxuICBfb25VcGRhdGVDaGlsZChwYXJlbnROb2RlLm93bmVyRG9jdW1lbnQsIHBhcmVudE5vZGUpO1xuXG4gIHJldHVybiBjaGlsZDtcbn1cblxuZnVuY3Rpb24gX2luc2VydEJlZm9yZShwYXJlbnROb2RlLCBuZXdDaGlsZCwgbmV4dENoaWxkKSB7XG4gIHZhciBjcCA9IG5ld0NoaWxkLnBhcmVudE5vZGU7XG5cbiAgaWYgKGNwKSB7XG4gICAgY3AucmVtb3ZlQ2hpbGQobmV3Q2hpbGQpO1xuICB9XG5cbiAgaWYgKG5ld0NoaWxkLm5vZGVUeXBlID09PSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFKSB7XG4gICAgdmFyIG5ld0ZpcnN0ID0gbmV3Q2hpbGQuZmlyc3RDaGlsZDtcblxuICAgIGlmIChuZXdGaXJzdCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3Q2hpbGQ7XG4gICAgfVxuXG4gICAgdmFyIG5ld0xhc3QgPSBuZXdDaGlsZC5sYXN0Q2hpbGQ7XG4gIH0gZWxzZSB7XG4gICAgbmV3Rmlyc3QgPSBuZXdMYXN0ID0gbmV3Q2hpbGQ7XG4gIH1cblxuICB2YXIgcHJlID0gbmV4dENoaWxkID8gbmV4dENoaWxkLnByZXZpb3VzU2libGluZyA6IHBhcmVudE5vZGUubGFzdENoaWxkO1xuICBuZXdGaXJzdC5wcmV2aW91c1NpYmxpbmcgPSBwcmU7XG4gIG5ld0xhc3QubmV4dFNpYmxpbmcgPSBuZXh0Q2hpbGQ7XG5cbiAgaWYgKHByZSkge1xuICAgIHByZS5uZXh0U2libGluZyA9IG5ld0ZpcnN0O1xuICB9IGVsc2Uge1xuICAgIHBhcmVudE5vZGUuZmlyc3RDaGlsZCA9IG5ld0ZpcnN0O1xuICB9XG5cbiAgaWYgKG5leHRDaGlsZCA9PSBudWxsKSB7XG4gICAgcGFyZW50Tm9kZS5sYXN0Q2hpbGQgPSBuZXdMYXN0O1xuICB9IGVsc2Uge1xuICAgIG5leHRDaGlsZC5wcmV2aW91c1NpYmxpbmcgPSBuZXdMYXN0O1xuICB9XG5cbiAgZG8ge1xuICAgIG5ld0ZpcnN0LnBhcmVudE5vZGUgPSBwYXJlbnROb2RlO1xuICB9IHdoaWxlIChuZXdGaXJzdCAhPT0gbmV3TGFzdCAmJiAobmV3Rmlyc3QgPSBuZXdGaXJzdC5uZXh0U2libGluZykpO1xuXG4gIF9vblVwZGF0ZUNoaWxkKHBhcmVudE5vZGUub3duZXJEb2N1bWVudCB8fCBwYXJlbnROb2RlLCBwYXJlbnROb2RlKTtcblxuICBpZiAobmV3Q2hpbGQubm9kZVR5cGUgPT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSkge1xuICAgIG5ld0NoaWxkLmZpcnN0Q2hpbGQgPSBuZXdDaGlsZC5sYXN0Q2hpbGQgPSBudWxsO1xuICB9XG5cbiAgcmV0dXJuIG5ld0NoaWxkO1xufVxuXG5mdW5jdGlvbiBfYXBwZW5kU2luZ2xlQ2hpbGQocGFyZW50Tm9kZSwgbmV3Q2hpbGQpIHtcbiAgdmFyIGNwID0gbmV3Q2hpbGQucGFyZW50Tm9kZTtcblxuICBpZiAoY3ApIHtcbiAgICB2YXIgcHJlID0gcGFyZW50Tm9kZS5sYXN0Q2hpbGQ7XG4gICAgY3AucmVtb3ZlQ2hpbGQobmV3Q2hpbGQpO1xuICAgIHZhciBwcmUgPSBwYXJlbnROb2RlLmxhc3RDaGlsZDtcbiAgfVxuXG4gIHZhciBwcmUgPSBwYXJlbnROb2RlLmxhc3RDaGlsZDtcbiAgbmV3Q2hpbGQucGFyZW50Tm9kZSA9IHBhcmVudE5vZGU7XG4gIG5ld0NoaWxkLnByZXZpb3VzU2libGluZyA9IHByZTtcbiAgbmV3Q2hpbGQubmV4dFNpYmxpbmcgPSBudWxsO1xuXG4gIGlmIChwcmUpIHtcbiAgICBwcmUubmV4dFNpYmxpbmcgPSBuZXdDaGlsZDtcbiAgfSBlbHNlIHtcbiAgICBwYXJlbnROb2RlLmZpcnN0Q2hpbGQgPSBuZXdDaGlsZDtcbiAgfVxuXG4gIHBhcmVudE5vZGUubGFzdENoaWxkID0gbmV3Q2hpbGQ7XG5cbiAgX29uVXBkYXRlQ2hpbGQocGFyZW50Tm9kZS5vd25lckRvY3VtZW50LCBwYXJlbnROb2RlLCBuZXdDaGlsZCk7XG5cbiAgcmV0dXJuIG5ld0NoaWxkO1xufVxuXG5Eb2N1bWVudC5wcm90b3R5cGUgPSB7XG4gIG5vZGVOYW1lOiAnI2RvY3VtZW50JyxcbiAgbm9kZVR5cGU6IERPQ1VNRU5UX05PREUsXG4gIGRvY3R5cGU6IG51bGwsXG4gIGRvY3VtZW50RWxlbWVudDogbnVsbCxcbiAgX2luYzogMSxcbiAgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbiBpbnNlcnRCZWZvcmUobmV3Q2hpbGQsIHJlZkNoaWxkKSB7XG4gICAgaWYgKG5ld0NoaWxkLm5vZGVUeXBlID09IERPQ1VNRU5UX0ZSQUdNRU5UX05PREUpIHtcbiAgICAgIHZhciBjaGlsZCA9IG5ld0NoaWxkLmZpcnN0Q2hpbGQ7XG5cbiAgICAgIHdoaWxlIChjaGlsZCkge1xuICAgICAgICB2YXIgbmV4dCA9IGNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICB0aGlzLmluc2VydEJlZm9yZShjaGlsZCwgcmVmQ2hpbGQpO1xuICAgICAgICBjaGlsZCA9IG5leHQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXdDaGlsZDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kb2N1bWVudEVsZW1lbnQgPT0gbnVsbCAmJiBuZXdDaGlsZC5ub2RlVHlwZSA9PSBFTEVNRU5UX05PREUpIHtcbiAgICAgIHRoaXMuZG9jdW1lbnRFbGVtZW50ID0gbmV3Q2hpbGQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIF9pbnNlcnRCZWZvcmUodGhpcywgbmV3Q2hpbGQsIHJlZkNoaWxkKSwgbmV3Q2hpbGQub3duZXJEb2N1bWVudCA9IHRoaXMsIG5ld0NoaWxkO1xuICB9LFxuICByZW1vdmVDaGlsZDogZnVuY3Rpb24gcmVtb3ZlQ2hpbGQob2xkQ2hpbGQpIHtcbiAgICBpZiAodGhpcy5kb2N1bWVudEVsZW1lbnQgPT0gb2xkQ2hpbGQpIHtcbiAgICAgIHRoaXMuZG9jdW1lbnRFbGVtZW50ID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gX3JlbW92ZUNoaWxkKHRoaXMsIG9sZENoaWxkKTtcbiAgfSxcbiAgaW1wb3J0Tm9kZTogZnVuY3Rpb24gaW1wb3J0Tm9kZShpbXBvcnRlZE5vZGUsIGRlZXApIHtcbiAgICByZXR1cm4gX2ltcG9ydE5vZGUodGhpcywgaW1wb3J0ZWROb2RlLCBkZWVwKTtcbiAgfSxcbiAgZ2V0RWxlbWVudEJ5SWQ6IGZ1bmN0aW9uIGdldEVsZW1lbnRCeUlkKGlkKSB7XG4gICAgdmFyIHJ0diA9IG51bGw7XG5cbiAgICBfdmlzaXROb2RlKHRoaXMuZG9jdW1lbnRFbGVtZW50LCBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgIGlmIChub2RlLmdldEF0dHJpYnV0ZSgnaWQnKSA9PSBpZCkge1xuICAgICAgICAgIHJ0diA9IG5vZGU7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBydHY7XG4gIH0sXG4gIGNyZWF0ZUVsZW1lbnQ6IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodGFnTmFtZSkge1xuICAgIHZhciBub2RlID0gbmV3IEVsZW1lbnQoKTtcbiAgICBub2RlLm93bmVyRG9jdW1lbnQgPSB0aGlzO1xuICAgIG5vZGUubm9kZU5hbWUgPSB0YWdOYW1lO1xuICAgIG5vZGUudGFnTmFtZSA9IHRhZ05hbWU7XG4gICAgbm9kZS5jaGlsZE5vZGVzID0gbmV3IE5vZGVMaXN0KCk7XG4gICAgdmFyIGF0dHJzID0gbm9kZS5hdHRyaWJ1dGVzID0gbmV3IE5hbWVkTm9kZU1hcCgpO1xuICAgIGF0dHJzLl9vd25lckVsZW1lbnQgPSBub2RlO1xuICAgIHJldHVybiBub2RlO1xuICB9LFxuICBjcmVhdGVEb2N1bWVudEZyYWdtZW50OiBmdW5jdGlvbiBjcmVhdGVEb2N1bWVudEZyYWdtZW50KCkge1xuICAgIHZhciBub2RlID0gbmV3IERvY3VtZW50RnJhZ21lbnQoKTtcbiAgICBub2RlLm93bmVyRG9jdW1lbnQgPSB0aGlzO1xuICAgIG5vZGUuY2hpbGROb2RlcyA9IG5ldyBOb2RlTGlzdCgpO1xuICAgIHJldHVybiBub2RlO1xuICB9LFxuICBjcmVhdGVUZXh0Tm9kZTogZnVuY3Rpb24gY3JlYXRlVGV4dE5vZGUoZGF0YSkge1xuICAgIHZhciBub2RlID0gbmV3IFRleHQoKTtcbiAgICBub2RlLm93bmVyRG9jdW1lbnQgPSB0aGlzO1xuICAgIG5vZGUuYXBwZW5kRGF0YShkYXRhKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfSxcbiAgY3JlYXRlQ29tbWVudDogZnVuY3Rpb24gY3JlYXRlQ29tbWVudChkYXRhKSB7XG4gICAgdmFyIG5vZGUgPSBuZXcgQ29tbWVudCgpO1xuICAgIG5vZGUub3duZXJEb2N1bWVudCA9IHRoaXM7XG4gICAgbm9kZS5hcHBlbmREYXRhKGRhdGEpO1xuICAgIHJldHVybiBub2RlO1xuICB9LFxuICBjcmVhdGVDREFUQVNlY3Rpb246IGZ1bmN0aW9uIGNyZWF0ZUNEQVRBU2VjdGlvbihkYXRhKSB7XG4gICAgdmFyIG5vZGUgPSBuZXcgQ0RBVEFTZWN0aW9uKCk7XG4gICAgbm9kZS5vd25lckRvY3VtZW50ID0gdGhpcztcbiAgICBub2RlLmFwcGVuZERhdGEoZGF0YSk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH0sXG4gIGNyZWF0ZVByb2Nlc3NpbmdJbnN0cnVjdGlvbjogZnVuY3Rpb24gY3JlYXRlUHJvY2Vzc2luZ0luc3RydWN0aW9uKHRhcmdldCwgZGF0YSkge1xuICAgIHZhciBub2RlID0gbmV3IFByb2Nlc3NpbmdJbnN0cnVjdGlvbigpO1xuICAgIG5vZGUub3duZXJEb2N1bWVudCA9IHRoaXM7XG4gICAgbm9kZS50YWdOYW1lID0gbm9kZS50YXJnZXQgPSB0YXJnZXQ7XG4gICAgbm9kZS5ub2RlVmFsdWUgPSBub2RlLmRhdGEgPSBkYXRhO1xuICAgIHJldHVybiBub2RlO1xuICB9LFxuICBjcmVhdGVBdHRyaWJ1dGU6IGZ1bmN0aW9uIGNyZWF0ZUF0dHJpYnV0ZShuYW1lKSB7XG4gICAgdmFyIG5vZGUgPSBuZXcgQXR0cigpO1xuICAgIG5vZGUub3duZXJEb2N1bWVudCA9IHRoaXM7XG4gICAgbm9kZS5uYW1lID0gbmFtZTtcbiAgICBub2RlLm5vZGVOYW1lID0gbmFtZTtcbiAgICBub2RlLmxvY2FsTmFtZSA9IG5hbWU7XG4gICAgbm9kZS5zcGVjaWZpZWQgPSB0cnVlO1xuICAgIHJldHVybiBub2RlO1xuICB9LFxuICBjcmVhdGVFbnRpdHlSZWZlcmVuY2U6IGZ1bmN0aW9uIGNyZWF0ZUVudGl0eVJlZmVyZW5jZShuYW1lKSB7XG4gICAgdmFyIG5vZGUgPSBuZXcgRW50aXR5UmVmZXJlbmNlKCk7XG4gICAgbm9kZS5vd25lckRvY3VtZW50ID0gdGhpcztcbiAgICBub2RlLm5vZGVOYW1lID0gbmFtZTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfSxcbiAgY3JlYXRlRWxlbWVudE5TOiBmdW5jdGlvbiBjcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJLCBxdWFsaWZpZWROYW1lKSB7XG4gICAgdmFyIG5vZGUgPSBuZXcgRWxlbWVudCgpO1xuICAgIHZhciBwbCA9IHF1YWxpZmllZE5hbWUuc3BsaXQoJzonKTtcbiAgICB2YXIgYXR0cnMgPSBub2RlLmF0dHJpYnV0ZXMgPSBuZXcgTmFtZWROb2RlTWFwKCk7XG4gICAgbm9kZS5jaGlsZE5vZGVzID0gbmV3IE5vZGVMaXN0KCk7XG4gICAgbm9kZS5vd25lckRvY3VtZW50ID0gdGhpcztcbiAgICBub2RlLm5vZGVOYW1lID0gcXVhbGlmaWVkTmFtZTtcbiAgICBub2RlLnRhZ05hbWUgPSBxdWFsaWZpZWROYW1lO1xuICAgIG5vZGUubmFtZXNwYWNlVVJJID0gbmFtZXNwYWNlVVJJO1xuXG4gICAgaWYgKHBsLmxlbmd0aCA9PSAyKSB7XG4gICAgICBub2RlLnByZWZpeCA9IHBsWzBdO1xuICAgICAgbm9kZS5sb2NhbE5hbWUgPSBwbFsxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZS5sb2NhbE5hbWUgPSBxdWFsaWZpZWROYW1lO1xuICAgIH1cblxuICAgIGF0dHJzLl9vd25lckVsZW1lbnQgPSBub2RlO1xuICAgIHJldHVybiBub2RlO1xuICB9LFxuICBjcmVhdGVBdHRyaWJ1dGVOUzogZnVuY3Rpb24gY3JlYXRlQXR0cmlidXRlTlMobmFtZXNwYWNlVVJJLCBxdWFsaWZpZWROYW1lKSB7XG4gICAgdmFyIG5vZGUgPSBuZXcgQXR0cigpO1xuICAgIHZhciBwbCA9IHF1YWxpZmllZE5hbWUuc3BsaXQoJzonKTtcbiAgICBub2RlLm93bmVyRG9jdW1lbnQgPSB0aGlzO1xuICAgIG5vZGUubm9kZU5hbWUgPSBxdWFsaWZpZWROYW1lO1xuICAgIG5vZGUubmFtZSA9IHF1YWxpZmllZE5hbWU7XG4gICAgbm9kZS5uYW1lc3BhY2VVUkkgPSBuYW1lc3BhY2VVUkk7XG4gICAgbm9kZS5zcGVjaWZpZWQgPSB0cnVlO1xuXG4gICAgaWYgKHBsLmxlbmd0aCA9PSAyKSB7XG4gICAgICBub2RlLnByZWZpeCA9IHBsWzBdO1xuICAgICAgbm9kZS5sb2NhbE5hbWUgPSBwbFsxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZS5sb2NhbE5hbWUgPSBxdWFsaWZpZWROYW1lO1xuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9XG59O1xuXG5fZXh0ZW5kcyhEb2N1bWVudCwgTm9kZSk7XG5cbmZ1bmN0aW9uIEVsZW1lbnQoKSB7XG4gIHRoaXMuX25zTWFwID0ge307XG59XG5cbjtcbkVsZW1lbnQucHJvdG90eXBlID0ge1xuICBub2RlVHlwZTogRUxFTUVOVF9OT0RFLFxuICBoYXNBdHRyaWJ1dGU6IGZ1bmN0aW9uIGhhc0F0dHJpYnV0ZShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlTm9kZShuYW1lKSAhPSBudWxsO1xuICB9LFxuICBnZXRBdHRyaWJ1dGU6IGZ1bmN0aW9uIGdldEF0dHJpYnV0ZShuYW1lKSB7XG4gICAgdmFyIGF0dHIgPSB0aGlzLmdldEF0dHJpYnV0ZU5vZGUobmFtZSk7XG4gICAgcmV0dXJuIGF0dHIgJiYgYXR0ci52YWx1ZSB8fCAnJztcbiAgfSxcbiAgZ2V0QXR0cmlidXRlTm9kZTogZnVuY3Rpb24gZ2V0QXR0cmlidXRlTm9kZShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0obmFtZSk7XG4gIH0sXG4gIHNldEF0dHJpYnV0ZTogZnVuY3Rpb24gc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGF0dHIgPSB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKG5hbWUpO1xuICAgIGF0dHIudmFsdWUgPSBhdHRyLm5vZGVWYWx1ZSA9IFwiXCIgKyB2YWx1ZTtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZU5vZGUoYXR0cik7XG4gIH0sXG4gIHJlbW92ZUF0dHJpYnV0ZTogZnVuY3Rpb24gcmVtb3ZlQXR0cmlidXRlKG5hbWUpIHtcbiAgICB2YXIgYXR0ciA9IHRoaXMuZ2V0QXR0cmlidXRlTm9kZShuYW1lKTtcbiAgICBhdHRyICYmIHRoaXMucmVtb3ZlQXR0cmlidXRlTm9kZShhdHRyKTtcbiAgfSxcbiAgYXBwZW5kQ2hpbGQ6IGZ1bmN0aW9uIGFwcGVuZENoaWxkKG5ld0NoaWxkKSB7XG4gICAgaWYgKG5ld0NoaWxkLm5vZGVUeXBlID09PSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnNlcnRCZWZvcmUobmV3Q2hpbGQsIG51bGwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gX2FwcGVuZFNpbmdsZUNoaWxkKHRoaXMsIG5ld0NoaWxkKTtcbiAgICB9XG4gIH0sXG4gIHNldEF0dHJpYnV0ZU5vZGU6IGZ1bmN0aW9uIHNldEF0dHJpYnV0ZU5vZGUobmV3QXR0cikge1xuICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXMuc2V0TmFtZWRJdGVtKG5ld0F0dHIpO1xuICB9LFxuICBzZXRBdHRyaWJ1dGVOb2RlTlM6IGZ1bmN0aW9uIHNldEF0dHJpYnV0ZU5vZGVOUyhuZXdBdHRyKSB7XG4gICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlcy5zZXROYW1lZEl0ZW1OUyhuZXdBdHRyKTtcbiAgfSxcbiAgcmVtb3ZlQXR0cmlidXRlTm9kZTogZnVuY3Rpb24gcmVtb3ZlQXR0cmlidXRlTm9kZShvbGRBdHRyKSB7XG4gICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlcy5yZW1vdmVOYW1lZEl0ZW0ob2xkQXR0ci5ub2RlTmFtZSk7XG4gIH0sXG4gIHJlbW92ZUF0dHJpYnV0ZU5TOiBmdW5jdGlvbiByZW1vdmVBdHRyaWJ1dGVOUyhuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSkge1xuICAgIHZhciBvbGQgPSB0aGlzLmdldEF0dHJpYnV0ZU5vZGVOUyhuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSk7XG4gICAgb2xkICYmIHRoaXMucmVtb3ZlQXR0cmlidXRlTm9kZShvbGQpO1xuICB9LFxuICBoYXNBdHRyaWJ1dGVOUzogZnVuY3Rpb24gaGFzQXR0cmlidXRlTlMobmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGVOb2RlTlMobmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpICE9IG51bGw7XG4gIH0sXG4gIGdldEF0dHJpYnV0ZU5TOiBmdW5jdGlvbiBnZXRBdHRyaWJ1dGVOUyhuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSkge1xuICAgIHZhciBhdHRyID0gdGhpcy5nZXRBdHRyaWJ1dGVOb2RlTlMobmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpO1xuICAgIHJldHVybiBhdHRyICYmIGF0dHIudmFsdWUgfHwgJyc7XG4gIH0sXG4gIHNldEF0dHJpYnV0ZU5TOiBmdW5jdGlvbiBzZXRBdHRyaWJ1dGVOUyhuYW1lc3BhY2VVUkksIHF1YWxpZmllZE5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGF0dHIgPSB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlTlMobmFtZXNwYWNlVVJJLCBxdWFsaWZpZWROYW1lKTtcbiAgICBhdHRyLnZhbHVlID0gYXR0ci5ub2RlVmFsdWUgPSBcIlwiICsgdmFsdWU7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGVOb2RlKGF0dHIpO1xuICB9LFxuICBnZXRBdHRyaWJ1dGVOb2RlTlM6IGZ1bmN0aW9uIGdldEF0dHJpYnV0ZU5vZGVOUyhuYW1lc3BhY2VVUkksIGxvY2FsTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtTlMobmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpO1xuICB9LFxuICBnZXRFbGVtZW50c0J5VGFnTmFtZTogZnVuY3Rpb24gZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnTmFtZSkge1xuICAgIHJldHVybiBuZXcgTGl2ZU5vZGVMaXN0KHRoaXMsIGZ1bmN0aW9uIChiYXNlKSB7XG4gICAgICB2YXIgbHMgPSBbXTtcblxuICAgICAgX3Zpc2l0Tm9kZShiYXNlLCBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBpZiAobm9kZSAhPT0gYmFzZSAmJiBub2RlLm5vZGVUeXBlID09IEVMRU1FTlRfTk9ERSAmJiAodGFnTmFtZSA9PT0gJyonIHx8IG5vZGUudGFnTmFtZSA9PSB0YWdOYW1lKSkge1xuICAgICAgICAgIGxzLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gbHM7XG4gICAgfSk7XG4gIH0sXG4gIGdldEVsZW1lbnRzQnlUYWdOYW1lTlM6IGZ1bmN0aW9uIGdldEVsZW1lbnRzQnlUYWdOYW1lTlMobmFtZXNwYWNlVVJJLCBsb2NhbE5hbWUpIHtcbiAgICByZXR1cm4gbmV3IExpdmVOb2RlTGlzdCh0aGlzLCBmdW5jdGlvbiAoYmFzZSkge1xuICAgICAgdmFyIGxzID0gW107XG5cbiAgICAgIF92aXNpdE5vZGUoYmFzZSwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUgIT09IGJhc2UgJiYgbm9kZS5ub2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFICYmIChuYW1lc3BhY2VVUkkgPT09ICcqJyB8fCBub2RlLm5hbWVzcGFjZVVSSSA9PT0gbmFtZXNwYWNlVVJJKSAmJiAobG9jYWxOYW1lID09PSAnKicgfHwgbm9kZS5sb2NhbE5hbWUgPT0gbG9jYWxOYW1lKSkge1xuICAgICAgICAgIGxzLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gbHM7XG4gICAgfSk7XG4gIH1cbn07XG5Eb2N1bWVudC5wcm90b3R5cGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUgPSBFbGVtZW50LnByb3RvdHlwZS5nZXRFbGVtZW50c0J5VGFnTmFtZTtcbkRvY3VtZW50LnByb3RvdHlwZS5nZXRFbGVtZW50c0J5VGFnTmFtZU5TID0gRWxlbWVudC5wcm90b3R5cGUuZ2V0RWxlbWVudHNCeVRhZ05hbWVOUztcblxuX2V4dGVuZHMoRWxlbWVudCwgTm9kZSk7XG5cbmZ1bmN0aW9uIEF0dHIoKSB7fVxuXG47XG5BdHRyLnByb3RvdHlwZS5ub2RlVHlwZSA9IEFUVFJJQlVURV9OT0RFO1xuXG5fZXh0ZW5kcyhBdHRyLCBOb2RlKTtcblxuZnVuY3Rpb24gQ2hhcmFjdGVyRGF0YSgpIHt9XG5cbjtcbkNoYXJhY3RlckRhdGEucHJvdG90eXBlID0ge1xuICBkYXRhOiAnJyxcbiAgc3Vic3RyaW5nRGF0YTogZnVuY3Rpb24gc3Vic3RyaW5nRGF0YShvZmZzZXQsIGNvdW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS5zdWJzdHJpbmcob2Zmc2V0LCBvZmZzZXQgKyBjb3VudCk7XG4gIH0sXG4gIGFwcGVuZERhdGE6IGZ1bmN0aW9uIGFwcGVuZERhdGEodGV4dCkge1xuICAgIHRleHQgPSB0aGlzLmRhdGEgKyB0ZXh0O1xuICAgIHRoaXMubm9kZVZhbHVlID0gdGhpcy5kYXRhID0gdGV4dDtcbiAgICB0aGlzLmxlbmd0aCA9IHRleHQubGVuZ3RoO1xuICB9LFxuICBpbnNlcnREYXRhOiBmdW5jdGlvbiBpbnNlcnREYXRhKG9mZnNldCwgdGV4dCkge1xuICAgIHRoaXMucmVwbGFjZURhdGEob2Zmc2V0LCAwLCB0ZXh0KTtcbiAgfSxcbiAgYXBwZW5kQ2hpbGQ6IGZ1bmN0aW9uIGFwcGVuZENoaWxkKG5ld0NoaWxkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKEV4Y2VwdGlvbk1lc3NhZ2VbSElFUkFSQ0hZX1JFUVVFU1RfRVJSXSk7XG4gIH0sXG4gIGRlbGV0ZURhdGE6IGZ1bmN0aW9uIGRlbGV0ZURhdGEob2Zmc2V0LCBjb3VudCkge1xuICAgIHRoaXMucmVwbGFjZURhdGEob2Zmc2V0LCBjb3VudCwgXCJcIik7XG4gIH0sXG4gIHJlcGxhY2VEYXRhOiBmdW5jdGlvbiByZXBsYWNlRGF0YShvZmZzZXQsIGNvdW50LCB0ZXh0KSB7XG4gICAgdmFyIHN0YXJ0ID0gdGhpcy5kYXRhLnN1YnN0cmluZygwLCBvZmZzZXQpO1xuICAgIHZhciBlbmQgPSB0aGlzLmRhdGEuc3Vic3RyaW5nKG9mZnNldCArIGNvdW50KTtcbiAgICB0ZXh0ID0gc3RhcnQgKyB0ZXh0ICsgZW5kO1xuICAgIHRoaXMubm9kZVZhbHVlID0gdGhpcy5kYXRhID0gdGV4dDtcbiAgICB0aGlzLmxlbmd0aCA9IHRleHQubGVuZ3RoO1xuICB9XG59O1xuXG5fZXh0ZW5kcyhDaGFyYWN0ZXJEYXRhLCBOb2RlKTtcblxuZnVuY3Rpb24gVGV4dCgpIHt9XG5cbjtcblRleHQucHJvdG90eXBlID0ge1xuICBub2RlTmFtZTogXCIjdGV4dFwiLFxuICBub2RlVHlwZTogVEVYVF9OT0RFLFxuICBzcGxpdFRleHQ6IGZ1bmN0aW9uIHNwbGl0VGV4dChvZmZzZXQpIHtcbiAgICB2YXIgdGV4dCA9IHRoaXMuZGF0YTtcbiAgICB2YXIgbmV3VGV4dCA9IHRleHQuc3Vic3RyaW5nKG9mZnNldCk7XG4gICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIG9mZnNldCk7XG4gICAgdGhpcy5kYXRhID0gdGhpcy5ub2RlVmFsdWUgPSB0ZXh0O1xuICAgIHRoaXMubGVuZ3RoID0gdGV4dC5sZW5ndGg7XG4gICAgdmFyIG5ld05vZGUgPSB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobmV3VGV4dCk7XG5cbiAgICBpZiAodGhpcy5wYXJlbnROb2RlKSB7XG4gICAgICB0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5ld05vZGUsIHRoaXMubmV4dFNpYmxpbmcpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXdOb2RlO1xuICB9XG59O1xuXG5fZXh0ZW5kcyhUZXh0LCBDaGFyYWN0ZXJEYXRhKTtcblxuZnVuY3Rpb24gQ29tbWVudCgpIHt9XG5cbjtcbkNvbW1lbnQucHJvdG90eXBlID0ge1xuICBub2RlTmFtZTogXCIjY29tbWVudFwiLFxuICBub2RlVHlwZTogQ09NTUVOVF9OT0RFXG59O1xuXG5fZXh0ZW5kcyhDb21tZW50LCBDaGFyYWN0ZXJEYXRhKTtcblxuZnVuY3Rpb24gQ0RBVEFTZWN0aW9uKCkge31cblxuO1xuQ0RBVEFTZWN0aW9uLnByb3RvdHlwZSA9IHtcbiAgbm9kZU5hbWU6IFwiI2NkYXRhLXNlY3Rpb25cIixcbiAgbm9kZVR5cGU6IENEQVRBX1NFQ1RJT05fTk9ERVxufTtcblxuX2V4dGVuZHMoQ0RBVEFTZWN0aW9uLCBDaGFyYWN0ZXJEYXRhKTtcblxuZnVuY3Rpb24gRG9jdW1lbnRUeXBlKCkge31cblxuO1xuRG9jdW1lbnRUeXBlLnByb3RvdHlwZS5ub2RlVHlwZSA9IERPQ1VNRU5UX1RZUEVfTk9ERTtcblxuX2V4dGVuZHMoRG9jdW1lbnRUeXBlLCBOb2RlKTtcblxuZnVuY3Rpb24gTm90YXRpb24oKSB7fVxuXG47XG5Ob3RhdGlvbi5wcm90b3R5cGUubm9kZVR5cGUgPSBOT1RBVElPTl9OT0RFO1xuXG5fZXh0ZW5kcyhOb3RhdGlvbiwgTm9kZSk7XG5cbmZ1bmN0aW9uIEVudGl0eSgpIHt9XG5cbjtcbkVudGl0eS5wcm90b3R5cGUubm9kZVR5cGUgPSBFTlRJVFlfTk9ERTtcblxuX2V4dGVuZHMoRW50aXR5LCBOb2RlKTtcblxuZnVuY3Rpb24gRW50aXR5UmVmZXJlbmNlKCkge31cblxuO1xuRW50aXR5UmVmZXJlbmNlLnByb3RvdHlwZS5ub2RlVHlwZSA9IEVOVElUWV9SRUZFUkVOQ0VfTk9ERTtcblxuX2V4dGVuZHMoRW50aXR5UmVmZXJlbmNlLCBOb2RlKTtcblxuZnVuY3Rpb24gRG9jdW1lbnRGcmFnbWVudCgpIHt9XG5cbjtcbkRvY3VtZW50RnJhZ21lbnQucHJvdG90eXBlLm5vZGVOYW1lID0gXCIjZG9jdW1lbnQtZnJhZ21lbnRcIjtcbkRvY3VtZW50RnJhZ21lbnQucHJvdG90eXBlLm5vZGVUeXBlID0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERTtcblxuX2V4dGVuZHMoRG9jdW1lbnRGcmFnbWVudCwgTm9kZSk7XG5cbmZ1bmN0aW9uIFByb2Nlc3NpbmdJbnN0cnVjdGlvbigpIHt9XG5cblByb2Nlc3NpbmdJbnN0cnVjdGlvbi5wcm90b3R5cGUubm9kZVR5cGUgPSBQUk9DRVNTSU5HX0lOU1RSVUNUSU9OX05PREU7XG5cbl9leHRlbmRzKFByb2Nlc3NpbmdJbnN0cnVjdGlvbiwgTm9kZSk7XG5cbmZ1bmN0aW9uIFhNTFNlcmlhbGl6ZXIoKSB7fVxuXG5YTUxTZXJpYWxpemVyLnByb3RvdHlwZS5zZXJpYWxpemVUb1N0cmluZyA9IGZ1bmN0aW9uIChub2RlLCBpc0h0bWwsIG5vZGVGaWx0ZXIpIHtcbiAgcmV0dXJuIG5vZGVTZXJpYWxpemVUb1N0cmluZy5jYWxsKG5vZGUsIGlzSHRtbCwgbm9kZUZpbHRlcik7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS50b1N0cmluZyA9IG5vZGVTZXJpYWxpemVUb1N0cmluZztcblxuZnVuY3Rpb24gbm9kZVNlcmlhbGl6ZVRvU3RyaW5nKGlzSHRtbCwgbm9kZUZpbHRlcikge1xuICB2YXIgYnVmID0gW107XG4gIHZhciByZWZOb2RlID0gdGhpcy5ub2RlVHlwZSA9PSA5ICYmIHRoaXMuZG9jdW1lbnRFbGVtZW50IHx8IHRoaXM7XG4gIHZhciBwcmVmaXggPSByZWZOb2RlLnByZWZpeDtcbiAgdmFyIHVyaSA9IHJlZk5vZGUubmFtZXNwYWNlVVJJO1xuXG4gIGlmICh1cmkgJiYgcHJlZml4ID09IG51bGwpIHtcbiAgICB2YXIgcHJlZml4ID0gcmVmTm9kZS5sb29rdXBQcmVmaXgodXJpKTtcblxuICAgIGlmIChwcmVmaXggPT0gbnVsbCkge1xuICAgICAgdmFyIHZpc2libGVOYW1lc3BhY2VzID0gW3tcbiAgICAgICAgbmFtZXNwYWNlOiB1cmksXG4gICAgICAgIHByZWZpeDogbnVsbFxuICAgICAgfV07XG4gICAgfVxuICB9XG5cbiAgc2VyaWFsaXplVG9TdHJpbmcodGhpcywgYnVmLCBpc0h0bWwsIG5vZGVGaWx0ZXIsIHZpc2libGVOYW1lc3BhY2VzKTtcbiAgcmV0dXJuIGJ1Zi5qb2luKCcnKTtcbn1cblxuZnVuY3Rpb24gbmVlZE5hbWVzcGFjZURlZmluZShub2RlLCBpc0hUTUwsIHZpc2libGVOYW1lc3BhY2VzKSB7XG4gIHZhciBwcmVmaXggPSBub2RlLnByZWZpeCB8fCAnJztcbiAgdmFyIHVyaSA9IG5vZGUubmFtZXNwYWNlVVJJO1xuXG4gIGlmICghcHJlZml4ICYmICF1cmkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAocHJlZml4ID09PSBcInhtbFwiICYmIHVyaSA9PT0gXCJodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2VcIiB8fCB1cmkgPT0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBpID0gdmlzaWJsZU5hbWVzcGFjZXMubGVuZ3RoO1xuXG4gIHdoaWxlIChpLS0pIHtcbiAgICB2YXIgbnMgPSB2aXNpYmxlTmFtZXNwYWNlc1tpXTtcblxuICAgIGlmIChucy5wcmVmaXggPT0gcHJlZml4KSB7XG4gICAgICByZXR1cm4gbnMubmFtZXNwYWNlICE9IHVyaTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplVG9TdHJpbmcobm9kZSwgYnVmLCBpc0hUTUwsIG5vZGVGaWx0ZXIsIHZpc2libGVOYW1lc3BhY2VzKSB7XG4gIGlmIChub2RlRmlsdGVyKSB7XG4gICAgbm9kZSA9IG5vZGVGaWx0ZXIobm9kZSk7XG5cbiAgICBpZiAobm9kZSkge1xuICAgICAgaWYgKHR5cGVvZiBub2RlID09ICdzdHJpbmcnKSB7XG4gICAgICAgIGJ1Zi5wdXNoKG5vZGUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICBzd2l0Y2ggKG5vZGUubm9kZVR5cGUpIHtcbiAgICBjYXNlIEVMRU1FTlRfTk9ERTpcbiAgICAgIGlmICghdmlzaWJsZU5hbWVzcGFjZXMpIHZpc2libGVOYW1lc3BhY2VzID0gW107XG4gICAgICB2YXIgc3RhcnRWaXNpYmxlTmFtZXNwYWNlcyA9IHZpc2libGVOYW1lc3BhY2VzLmxlbmd0aDtcbiAgICAgIHZhciBhdHRycyA9IG5vZGUuYXR0cmlidXRlcztcbiAgICAgIHZhciBsZW4gPSBhdHRycy5sZW5ndGg7XG4gICAgICB2YXIgY2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICB2YXIgbm9kZU5hbWUgPSBub2RlLnRhZ05hbWU7XG4gICAgICBpc0hUTUwgPSBodG1sbnMgPT09IG5vZGUubmFtZXNwYWNlVVJJIHx8IGlzSFRNTDtcbiAgICAgIGJ1Zi5wdXNoKCc8Jywgbm9kZU5hbWUpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHZhciBhdHRyID0gYXR0cnMuaXRlbShpKTtcblxuICAgICAgICBpZiAoYXR0ci5wcmVmaXggPT0gJ3htbG5zJykge1xuICAgICAgICAgIHZpc2libGVOYW1lc3BhY2VzLnB1c2goe1xuICAgICAgICAgICAgcHJlZml4OiBhdHRyLmxvY2FsTmFtZSxcbiAgICAgICAgICAgIG5hbWVzcGFjZTogYXR0ci52YWx1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGF0dHIubm9kZU5hbWUgPT0gJ3htbG5zJykge1xuICAgICAgICAgIHZpc2libGVOYW1lc3BhY2VzLnB1c2goe1xuICAgICAgICAgICAgcHJlZml4OiAnJyxcbiAgICAgICAgICAgIG5hbWVzcGFjZTogYXR0ci52YWx1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdmFyIGF0dHIgPSBhdHRycy5pdGVtKGkpO1xuXG4gICAgICAgIGlmIChuZWVkTmFtZXNwYWNlRGVmaW5lKGF0dHIsIGlzSFRNTCwgdmlzaWJsZU5hbWVzcGFjZXMpKSB7XG4gICAgICAgICAgdmFyIHByZWZpeCA9IGF0dHIucHJlZml4IHx8ICcnO1xuICAgICAgICAgIHZhciB1cmkgPSBhdHRyLm5hbWVzcGFjZVVSSTtcbiAgICAgICAgICB2YXIgbnMgPSBwcmVmaXggPyAnIHhtbG5zOicgKyBwcmVmaXggOiBcIiB4bWxuc1wiO1xuICAgICAgICAgIGJ1Zi5wdXNoKG5zLCAnPVwiJywgdXJpLCAnXCInKTtcbiAgICAgICAgICB2aXNpYmxlTmFtZXNwYWNlcy5wdXNoKHtcbiAgICAgICAgICAgIHByZWZpeDogcHJlZml4LFxuICAgICAgICAgICAgbmFtZXNwYWNlOiB1cmlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlcmlhbGl6ZVRvU3RyaW5nKGF0dHIsIGJ1ZiwgaXNIVE1MLCBub2RlRmlsdGVyLCB2aXNpYmxlTmFtZXNwYWNlcyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZWVkTmFtZXNwYWNlRGVmaW5lKG5vZGUsIGlzSFRNTCwgdmlzaWJsZU5hbWVzcGFjZXMpKSB7XG4gICAgICAgIHZhciBwcmVmaXggPSBub2RlLnByZWZpeCB8fCAnJztcbiAgICAgICAgdmFyIHVyaSA9IG5vZGUubmFtZXNwYWNlVVJJO1xuICAgICAgICB2YXIgbnMgPSBwcmVmaXggPyAnIHhtbG5zOicgKyBwcmVmaXggOiBcIiB4bWxuc1wiO1xuICAgICAgICBidWYucHVzaChucywgJz1cIicsIHVyaSwgJ1wiJyk7XG4gICAgICAgIHZpc2libGVOYW1lc3BhY2VzLnB1c2goe1xuICAgICAgICAgIHByZWZpeDogcHJlZml4LFxuICAgICAgICAgIG5hbWVzcGFjZTogdXJpXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hpbGQgfHwgaXNIVE1MICYmICEvXig/Om1ldGF8bGlua3xpbWd8YnJ8aHJ8aW5wdXQpJC9pLnRlc3Qobm9kZU5hbWUpKSB7XG4gICAgICAgIGJ1Zi5wdXNoKCc+Jyk7XG5cbiAgICAgICAgaWYgKGlzSFRNTCAmJiAvXnNjcmlwdCQvaS50ZXN0KG5vZGVOYW1lKSkge1xuICAgICAgICAgIHdoaWxlIChjaGlsZCkge1xuICAgICAgICAgICAgaWYgKGNoaWxkLmRhdGEpIHtcbiAgICAgICAgICAgICAgYnVmLnB1c2goY2hpbGQuZGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZXJpYWxpemVUb1N0cmluZyhjaGlsZCwgYnVmLCBpc0hUTUwsIG5vZGVGaWx0ZXIsIHZpc2libGVOYW1lc3BhY2VzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2hpbGQgPSBjaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd2hpbGUgKGNoaWxkKSB7XG4gICAgICAgICAgICBzZXJpYWxpemVUb1N0cmluZyhjaGlsZCwgYnVmLCBpc0hUTUwsIG5vZGVGaWx0ZXIsIHZpc2libGVOYW1lc3BhY2VzKTtcbiAgICAgICAgICAgIGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYnVmLnB1c2goJzwvJywgbm9kZU5hbWUsICc+Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidWYucHVzaCgnLz4nKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuXG4gICAgY2FzZSBET0NVTUVOVF9OT0RFOlxuICAgIGNhc2UgRE9DVU1FTlRfRlJBR01FTlRfTk9ERTpcbiAgICAgIHZhciBjaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcblxuICAgICAgd2hpbGUgKGNoaWxkKSB7XG4gICAgICAgIHNlcmlhbGl6ZVRvU3RyaW5nKGNoaWxkLCBidWYsIGlzSFRNTCwgbm9kZUZpbHRlciwgdmlzaWJsZU5hbWVzcGFjZXMpO1xuICAgICAgICBjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG5cbiAgICBjYXNlIEFUVFJJQlVURV9OT0RFOlxuICAgICAgcmV0dXJuIGJ1Zi5wdXNoKCcgJywgbm9kZS5uYW1lLCAnPVwiJywgbm9kZS52YWx1ZS5yZXBsYWNlKC9bPCZcIl0vZywgX3htbEVuY29kZXIpLCAnXCInKTtcblxuICAgIGNhc2UgVEVYVF9OT0RFOlxuICAgICAgcmV0dXJuIGJ1Zi5wdXNoKG5vZGUuZGF0YS5yZXBsYWNlKC9bPCZdL2csIF94bWxFbmNvZGVyKSk7XG5cbiAgICBjYXNlIENEQVRBX1NFQ1RJT05fTk9ERTpcbiAgICAgIHJldHVybiBidWYucHVzaCgnPCFbQ0RBVEFbJywgbm9kZS5kYXRhLCAnXV0+Jyk7XG5cbiAgICBjYXNlIENPTU1FTlRfTk9ERTpcbiAgICAgIHJldHVybiBidWYucHVzaChcIjwhLS1cIiwgbm9kZS5kYXRhLCBcIi0tPlwiKTtcblxuICAgIGNhc2UgRE9DVU1FTlRfVFlQRV9OT0RFOlxuICAgICAgdmFyIHB1YmlkID0gbm9kZS5wdWJsaWNJZDtcbiAgICAgIHZhciBzeXNpZCA9IG5vZGUuc3lzdGVtSWQ7XG4gICAgICBidWYucHVzaCgnPCFET0NUWVBFICcsIG5vZGUubmFtZSk7XG5cbiAgICAgIGlmIChwdWJpZCkge1xuICAgICAgICBidWYucHVzaCgnIFBVQkxJQyBcIicsIHB1YmlkKTtcblxuICAgICAgICBpZiAoc3lzaWQgJiYgc3lzaWQgIT0gJy4nKSB7XG4gICAgICAgICAgYnVmLnB1c2goJ1wiIFwiJywgc3lzaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgYnVmLnB1c2goJ1wiPicpO1xuICAgICAgfSBlbHNlIGlmIChzeXNpZCAmJiBzeXNpZCAhPSAnLicpIHtcbiAgICAgICAgYnVmLnB1c2goJyBTWVNURU0gXCInLCBzeXNpZCwgJ1wiPicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHN1YiA9IG5vZGUuaW50ZXJuYWxTdWJzZXQ7XG5cbiAgICAgICAgaWYgKHN1Yikge1xuICAgICAgICAgIGJ1Zi5wdXNoKFwiIFtcIiwgc3ViLCBcIl1cIik7XG4gICAgICAgIH1cblxuICAgICAgICBidWYucHVzaChcIj5cIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcblxuICAgIGNhc2UgUFJPQ0VTU0lOR19JTlNUUlVDVElPTl9OT0RFOlxuICAgICAgcmV0dXJuIGJ1Zi5wdXNoKFwiPD9cIiwgbm9kZS50YXJnZXQsIFwiIFwiLCBub2RlLmRhdGEsIFwiPz5cIik7XG5cbiAgICBjYXNlIEVOVElUWV9SRUZFUkVOQ0VfTk9ERTpcbiAgICAgIHJldHVybiBidWYucHVzaCgnJicsIG5vZGUubm9kZU5hbWUsICc7Jyk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgYnVmLnB1c2goJz8/Jywgbm9kZS5ub2RlTmFtZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2ltcG9ydE5vZGUoZG9jLCBub2RlLCBkZWVwKSB7XG4gIHZhciBub2RlMjtcblxuICBzd2l0Y2ggKG5vZGUubm9kZVR5cGUpIHtcbiAgICBjYXNlIEVMRU1FTlRfTk9ERTpcbiAgICAgIG5vZGUyID0gbm9kZS5jbG9uZU5vZGUoZmFsc2UpO1xuICAgICAgbm9kZTIub3duZXJEb2N1bWVudCA9IGRvYztcblxuICAgIGNhc2UgRE9DVU1FTlRfRlJBR01FTlRfTk9ERTpcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBBVFRSSUJVVEVfTk9ERTpcbiAgICAgIGRlZXAgPSB0cnVlO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICBpZiAoIW5vZGUyKSB7XG4gICAgbm9kZTIgPSBub2RlLmNsb25lTm9kZShmYWxzZSk7XG4gIH1cblxuICBub2RlMi5vd25lckRvY3VtZW50ID0gZG9jO1xuICBub2RlMi5wYXJlbnROb2RlID0gbnVsbDtcblxuICBpZiAoZGVlcCkge1xuICAgIHZhciBjaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcblxuICAgIHdoaWxlIChjaGlsZCkge1xuICAgICAgbm9kZTIuYXBwZW5kQ2hpbGQoX2ltcG9ydE5vZGUoZG9jLCBjaGlsZCwgZGVlcCkpO1xuICAgICAgY2hpbGQgPSBjaGlsZC5uZXh0U2libGluZztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbm9kZTI7XG59XG5cbmZ1bmN0aW9uIF9jbG9uZU5vZGUoZG9jLCBub2RlLCBkZWVwKSB7XG4gIHZhciBub2RlMiA9IG5ldyBub2RlLmNvbnN0cnVjdG9yKCk7XG5cbiAgZm9yICh2YXIgbiBpbiBub2RlKSB7XG4gICAgdmFyIHYgPSBub2RlW25dO1xuXG4gICAgaWYgKF90eXBlb2YodikgIT0gJ29iamVjdCcpIHtcbiAgICAgIGlmICh2ICE9IG5vZGUyW25dKSB7XG4gICAgICAgIG5vZGUyW25dID0gdjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAobm9kZS5jaGlsZE5vZGVzKSB7XG4gICAgbm9kZTIuY2hpbGROb2RlcyA9IG5ldyBOb2RlTGlzdCgpO1xuICB9XG5cbiAgbm9kZTIub3duZXJEb2N1bWVudCA9IGRvYztcblxuICBzd2l0Y2ggKG5vZGUyLm5vZGVUeXBlKSB7XG4gICAgY2FzZSBFTEVNRU5UX05PREU6XG4gICAgICB2YXIgYXR0cnMgPSBub2RlLmF0dHJpYnV0ZXM7XG4gICAgICB2YXIgYXR0cnMyID0gbm9kZTIuYXR0cmlidXRlcyA9IG5ldyBOYW1lZE5vZGVNYXAoKTtcbiAgICAgIHZhciBsZW4gPSBhdHRycy5sZW5ndGg7XG4gICAgICBhdHRyczIuX293bmVyRWxlbWVudCA9IG5vZGUyO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIG5vZGUyLnNldEF0dHJpYnV0ZU5vZGUoX2Nsb25lTm9kZShkb2MsIGF0dHJzLml0ZW0oaSksIHRydWUpKTtcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG4gICAgICA7XG5cbiAgICBjYXNlIEFUVFJJQlVURV9OT0RFOlxuICAgICAgZGVlcCA9IHRydWU7XG4gIH1cblxuICBpZiAoZGVlcCkge1xuICAgIHZhciBjaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcblxuICAgIHdoaWxlIChjaGlsZCkge1xuICAgICAgbm9kZTIuYXBwZW5kQ2hpbGQoX2Nsb25lTm9kZShkb2MsIGNoaWxkLCBkZWVwKSk7XG4gICAgICBjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBub2RlMjtcbn1cblxuZnVuY3Rpb24gX19zZXRfXyhvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbn1cblxudHJ5IHtcbiAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkge1xuICAgIHZhciBnZXRUZXh0Q29udGVudCA9IGZ1bmN0aW9uIGdldFRleHRDb250ZW50KG5vZGUpIHtcbiAgICAgIHN3aXRjaCAobm9kZS5ub2RlVHlwZSkge1xuICAgICAgICBjYXNlIEVMRU1FTlRfTk9ERTpcbiAgICAgICAgY2FzZSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFOlxuICAgICAgICAgIHZhciBidWYgPSBbXTtcbiAgICAgICAgICBub2RlID0gbm9kZS5maXJzdENoaWxkO1xuXG4gICAgICAgICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlICE9PSA3ICYmIG5vZGUubm9kZVR5cGUgIT09IDgpIHtcbiAgICAgICAgICAgICAgYnVmLnB1c2goZ2V0VGV4dENvbnRlbnQobm9kZSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBub2RlID0gbm9kZS5uZXh0U2libGluZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gYnVmLmpvaW4oJycpO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIG5vZGUubm9kZVZhbHVlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTGl2ZU5vZGVMaXN0LnByb3RvdHlwZSwgJ2xlbmd0aCcsIHtcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICBfdXBkYXRlTGl2ZUxpc3QodGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuJCRsZW5ndGg7XG4gICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5vZGUucHJvdG90eXBlLCAndGV4dENvbnRlbnQnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIGdldFRleHRDb250ZW50KHRoaXMpO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24gc2V0KGRhdGEpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLm5vZGVUeXBlKSB7XG4gICAgICAgICAgY2FzZSBFTEVNRU5UX05PREU6XG4gICAgICAgICAgY2FzZSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFOlxuICAgICAgICAgICAgd2hpbGUgKHRoaXMuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkYXRhIHx8IFN0cmluZyhkYXRhKSkge1xuICAgICAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMub3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkYXRhKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gZGF0YTtcbiAgICAgICAgICAgIHRoaXMubm9kZVZhbHVlID0gZGF0YTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgX19zZXRfXyA9IGZ1bmN0aW9uIF9fc2V0X18ob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gICAgICBvYmplY3RbJyQkJyArIGtleV0gPSB2YWx1ZTtcbiAgICB9O1xuICB9XG59IGNhdGNoIChlKSB7fVxuXG5leHBvcnRzLkRPTUltcGxlbWVudGF0aW9uID0gRE9NSW1wbGVtZW50YXRpb247XG5leHBvcnRzLlhNTFNlcmlhbGl6ZXIgPSBYTUxTZXJpYWxpemVyO1xuXG59LHt9XSw1NzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5lbnRpdHlNYXAgPSB7XG4gIGx0OiAnPCcsXG4gIGd0OiAnPicsXG4gIGFtcDogJyYnLFxuICBxdW90OiAnXCInLFxuICBhcG9zOiBcIidcIixcbiAgQWdyYXZlOiBcIsOAXCIsXG4gIEFhY3V0ZTogXCLDgVwiLFxuICBBY2lyYzogXCLDglwiLFxuICBBdGlsZGU6IFwiw4NcIixcbiAgQXVtbDogXCLDhFwiLFxuICBBcmluZzogXCLDhVwiLFxuICBBRWxpZzogXCLDhlwiLFxuICBDY2VkaWw6IFwiw4dcIixcbiAgRWdyYXZlOiBcIsOIXCIsXG4gIEVhY3V0ZTogXCLDiVwiLFxuICBFY2lyYzogXCLDilwiLFxuICBFdW1sOiBcIsOLXCIsXG4gIElncmF2ZTogXCLDjFwiLFxuICBJYWN1dGU6IFwiw41cIixcbiAgSWNpcmM6IFwiw45cIixcbiAgSXVtbDogXCLDj1wiLFxuICBFVEg6IFwiw5BcIixcbiAgTnRpbGRlOiBcIsORXCIsXG4gIE9ncmF2ZTogXCLDklwiLFxuICBPYWN1dGU6IFwiw5NcIixcbiAgT2NpcmM6IFwiw5RcIixcbiAgT3RpbGRlOiBcIsOVXCIsXG4gIE91bWw6IFwiw5ZcIixcbiAgT3NsYXNoOiBcIsOYXCIsXG4gIFVncmF2ZTogXCLDmVwiLFxuICBVYWN1dGU6IFwiw5pcIixcbiAgVWNpcmM6IFwiw5tcIixcbiAgVXVtbDogXCLDnFwiLFxuICBZYWN1dGU6IFwiw51cIixcbiAgVEhPUk46IFwiw55cIixcbiAgc3psaWc6IFwiw59cIixcbiAgYWdyYXZlOiBcIsOgXCIsXG4gIGFhY3V0ZTogXCLDoVwiLFxuICBhY2lyYzogXCLDolwiLFxuICBhdGlsZGU6IFwiw6NcIixcbiAgYXVtbDogXCLDpFwiLFxuICBhcmluZzogXCLDpVwiLFxuICBhZWxpZzogXCLDplwiLFxuICBjY2VkaWw6IFwiw6dcIixcbiAgZWdyYXZlOiBcIsOoXCIsXG4gIGVhY3V0ZTogXCLDqVwiLFxuICBlY2lyYzogXCLDqlwiLFxuICBldW1sOiBcIsOrXCIsXG4gIGlncmF2ZTogXCLDrFwiLFxuICBpYWN1dGU6IFwiw61cIixcbiAgaWNpcmM6IFwiw65cIixcbiAgaXVtbDogXCLDr1wiLFxuICBldGg6IFwiw7BcIixcbiAgbnRpbGRlOiBcIsOxXCIsXG4gIG9ncmF2ZTogXCLDslwiLFxuICBvYWN1dGU6IFwiw7NcIixcbiAgb2NpcmM6IFwiw7RcIixcbiAgb3RpbGRlOiBcIsO1XCIsXG4gIG91bWw6IFwiw7ZcIixcbiAgb3NsYXNoOiBcIsO4XCIsXG4gIHVncmF2ZTogXCLDuVwiLFxuICB1YWN1dGU6IFwiw7pcIixcbiAgdWNpcmM6IFwiw7tcIixcbiAgdXVtbDogXCLDvFwiLFxuICB5YWN1dGU6IFwiw71cIixcbiAgdGhvcm46IFwiw75cIixcbiAgeXVtbDogXCLDv1wiLFxuICBuYnNwOiBcIiBcIixcbiAgaWV4Y2w6IFwiwqFcIixcbiAgY2VudDogXCLColwiLFxuICBwb3VuZDogXCLCo1wiLFxuICBjdXJyZW46IFwiwqRcIixcbiAgeWVuOiBcIsKlXCIsXG4gIGJydmJhcjogXCLCplwiLFxuICBzZWN0OiBcIsKnXCIsXG4gIHVtbDogXCLCqFwiLFxuICBjb3B5OiBcIsKpXCIsXG4gIG9yZGY6IFwiwqpcIixcbiAgbGFxdW86IFwiwqtcIixcbiAgbm90OiBcIsKsXCIsXG4gIHNoeTogXCLCrcKtXCIsXG4gIHJlZzogXCLCrlwiLFxuICBtYWNyOiBcIsKvXCIsXG4gIGRlZzogXCLCsFwiLFxuICBwbHVzbW46IFwiwrFcIixcbiAgc3VwMjogXCLCslwiLFxuICBzdXAzOiBcIsKzXCIsXG4gIGFjdXRlOiBcIsK0XCIsXG4gIG1pY3JvOiBcIsK1XCIsXG4gIHBhcmE6IFwiwrZcIixcbiAgbWlkZG90OiBcIsK3XCIsXG4gIGNlZGlsOiBcIsK4XCIsXG4gIHN1cDE6IFwiwrlcIixcbiAgb3JkbTogXCLCulwiLFxuICByYXF1bzogXCLCu1wiLFxuICBmcmFjMTQ6IFwiwrxcIixcbiAgZnJhYzEyOiBcIsK9XCIsXG4gIGZyYWMzNDogXCLCvlwiLFxuICBpcXVlc3Q6IFwiwr9cIixcbiAgdGltZXM6IFwiw5dcIixcbiAgZGl2aWRlOiBcIsO3XCIsXG4gIGZvcmFsbDogXCLiiIBcIixcbiAgcGFydDogXCLiiIJcIixcbiAgZXhpc3Q6IFwi4oiDXCIsXG4gIGVtcHR5OiBcIuKIhVwiLFxuICBuYWJsYTogXCLiiIdcIixcbiAgaXNpbjogXCLiiIhcIixcbiAgbm90aW46IFwi4oiJXCIsXG4gIG5pOiBcIuKIi1wiLFxuICBwcm9kOiBcIuKIj1wiLFxuICBzdW06IFwi4oiRXCIsXG4gIG1pbnVzOiBcIuKIklwiLFxuICBsb3dhc3Q6IFwi4oiXXCIsXG4gIHJhZGljOiBcIuKImlwiLFxuICBwcm9wOiBcIuKInVwiLFxuICBpbmZpbjogXCLiiJ5cIixcbiAgYW5nOiBcIuKIoFwiLFxuICBhbmQ6IFwi4oinXCIsXG4gIG9yOiBcIuKIqFwiLFxuICBjYXA6IFwi4oipXCIsXG4gIGN1cDogXCLiiKpcIixcbiAgJ2ludCc6IFwi4oirXCIsXG4gIHRoZXJlNDogXCLiiLRcIixcbiAgc2ltOiBcIuKIvFwiLFxuICBjb25nOiBcIuKJhVwiLFxuICBhc3ltcDogXCLiiYhcIixcbiAgbmU6IFwi4omgXCIsXG4gIGVxdWl2OiBcIuKJoVwiLFxuICBsZTogXCLiiaRcIixcbiAgZ2U6IFwi4omlXCIsXG4gIHN1YjogXCLiioJcIixcbiAgc3VwOiBcIuKKg1wiLFxuICBuc3ViOiBcIuKKhFwiLFxuICBzdWJlOiBcIuKKhlwiLFxuICBzdXBlOiBcIuKKh1wiLFxuICBvcGx1czogXCLiipVcIixcbiAgb3RpbWVzOiBcIuKKl1wiLFxuICBwZXJwOiBcIuKKpVwiLFxuICBzZG90OiBcIuKLhVwiLFxuICBBbHBoYTogXCLOkVwiLFxuICBCZXRhOiBcIs6SXCIsXG4gIEdhbW1hOiBcIs6TXCIsXG4gIERlbHRhOiBcIs6UXCIsXG4gIEVwc2lsb246IFwizpVcIixcbiAgWmV0YTogXCLOllwiLFxuICBFdGE6IFwizpdcIixcbiAgVGhldGE6IFwizphcIixcbiAgSW90YTogXCLOmVwiLFxuICBLYXBwYTogXCLOmlwiLFxuICBMYW1iZGE6IFwizptcIixcbiAgTXU6IFwizpxcIixcbiAgTnU6IFwizp1cIixcbiAgWGk6IFwizp5cIixcbiAgT21pY3JvbjogXCLOn1wiLFxuICBQaTogXCLOoFwiLFxuICBSaG86IFwizqFcIixcbiAgU2lnbWE6IFwizqNcIixcbiAgVGF1OiBcIs6kXCIsXG4gIFVwc2lsb246IFwizqVcIixcbiAgUGhpOiBcIs6mXCIsXG4gIENoaTogXCLOp1wiLFxuICBQc2k6IFwizqhcIixcbiAgT21lZ2E6IFwizqlcIixcbiAgYWxwaGE6IFwizrFcIixcbiAgYmV0YTogXCLOslwiLFxuICBnYW1tYTogXCLOs1wiLFxuICBkZWx0YTogXCLOtFwiLFxuICBlcHNpbG9uOiBcIs61XCIsXG4gIHpldGE6IFwizrZcIixcbiAgZXRhOiBcIs63XCIsXG4gIHRoZXRhOiBcIs64XCIsXG4gIGlvdGE6IFwizrlcIixcbiAga2FwcGE6IFwizrpcIixcbiAgbGFtYmRhOiBcIs67XCIsXG4gIG11OiBcIs68XCIsXG4gIG51OiBcIs69XCIsXG4gIHhpOiBcIs6+XCIsXG4gIG9taWNyb246IFwizr9cIixcbiAgcGk6IFwiz4BcIixcbiAgcmhvOiBcIs+BXCIsXG4gIHNpZ21hZjogXCLPglwiLFxuICBzaWdtYTogXCLPg1wiLFxuICB0YXU6IFwiz4RcIixcbiAgdXBzaWxvbjogXCLPhVwiLFxuICBwaGk6IFwiz4ZcIixcbiAgY2hpOiBcIs+HXCIsXG4gIHBzaTogXCLPiFwiLFxuICBvbWVnYTogXCLPiVwiLFxuICB0aGV0YXN5bTogXCLPkVwiLFxuICB1cHNpaDogXCLPklwiLFxuICBwaXY6IFwiz5ZcIixcbiAgT0VsaWc6IFwixZJcIixcbiAgb2VsaWc6IFwixZNcIixcbiAgU2Nhcm9uOiBcIsWgXCIsXG4gIHNjYXJvbjogXCLFoVwiLFxuICBZdW1sOiBcIsW4XCIsXG4gIGZub2Y6IFwixpJcIixcbiAgY2lyYzogXCLLhlwiLFxuICB0aWxkZTogXCLLnFwiLFxuICBlbnNwOiBcIuKAglwiLFxuICBlbXNwOiBcIuKAg1wiLFxuICB0aGluc3A6IFwi4oCJXCIsXG4gIHp3bmo6IFwi4oCMXCIsXG4gIHp3ajogXCLigI1cIixcbiAgbHJtOiBcIuKAjlwiLFxuICBybG06IFwi4oCPXCIsXG4gIG5kYXNoOiBcIuKAk1wiLFxuICBtZGFzaDogXCLigJRcIixcbiAgbHNxdW86IFwi4oCYXCIsXG4gIHJzcXVvOiBcIuKAmVwiLFxuICBzYnF1bzogXCLigJpcIixcbiAgbGRxdW86IFwi4oCcXCIsXG4gIHJkcXVvOiBcIuKAnVwiLFxuICBiZHF1bzogXCLigJ5cIixcbiAgZGFnZ2VyOiBcIuKAoFwiLFxuICBEYWdnZXI6IFwi4oChXCIsXG4gIGJ1bGw6IFwi4oCiXCIsXG4gIGhlbGxpcDogXCLigKZcIixcbiAgcGVybWlsOiBcIuKAsFwiLFxuICBwcmltZTogXCLigLJcIixcbiAgUHJpbWU6IFwi4oCzXCIsXG4gIGxzYXF1bzogXCLigLlcIixcbiAgcnNhcXVvOiBcIuKAulwiLFxuICBvbGluZTogXCLigL5cIixcbiAgZXVybzogXCLigqxcIixcbiAgdHJhZGU6IFwi4oSiXCIsXG4gIGxhcnI6IFwi4oaQXCIsXG4gIHVhcnI6IFwi4oaRXCIsXG4gIHJhcnI6IFwi4oaSXCIsXG4gIGRhcnI6IFwi4oaTXCIsXG4gIGhhcnI6IFwi4oaUXCIsXG4gIGNyYXJyOiBcIuKGtVwiLFxuICBsY2VpbDogXCLijIhcIixcbiAgcmNlaWw6IFwi4oyJXCIsXG4gIGxmbG9vcjogXCLijIpcIixcbiAgcmZsb29yOiBcIuKMi1wiLFxuICBsb3o6IFwi4peKXCIsXG4gIHNwYWRlczogXCLimaBcIixcbiAgY2x1YnM6IFwi4pmjXCIsXG4gIGhlYXJ0czogXCLimaVcIixcbiAgZGlhbXM6IFwi4pmmXCJcbn07XG5cbn0se31dLDU4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgbmFtZVN0YXJ0Q2hhciA9IC9bQS1aX2EtelxceEMwLVxceEQ2XFx4RDgtXFx4RjZcXHUwMEY4LVxcdTAyRkZcXHUwMzcwLVxcdTAzN0RcXHUwMzdGLVxcdTFGRkZcXHUyMDBDLVxcdTIwMERcXHUyMDcwLVxcdTIxOEZcXHUyQzAwLVxcdTJGRUZcXHUzMDAxLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRkRdLztcbnZhciBuYW1lQ2hhciA9IG5ldyBSZWdFeHAoXCJbXFxcXC1cXFxcLjAtOVwiICsgbmFtZVN0YXJ0Q2hhci5zb3VyY2Uuc2xpY2UoMSwgLTEpICsgXCJcXFxcdTAwQjdcXFxcdTAzMDAtXFxcXHUwMzZGXFxcXHUyMDNGLVxcXFx1MjA0MF1cIik7XG52YXIgdGFnTmFtZVBhdHRlcm4gPSBuZXcgUmVnRXhwKCdeJyArIG5hbWVTdGFydENoYXIuc291cmNlICsgbmFtZUNoYXIuc291cmNlICsgJyooPzpcXDonICsgbmFtZVN0YXJ0Q2hhci5zb3VyY2UgKyBuYW1lQ2hhci5zb3VyY2UgKyAnKik/JCcpO1xudmFyIFNfVEFHID0gMDtcbnZhciBTX0FUVFIgPSAxO1xudmFyIFNfQVRUUl9TUEFDRSA9IDI7XG52YXIgU19FUSA9IDM7XG52YXIgU19BVFRSX05PUVVPVF9WQUxVRSA9IDQ7XG52YXIgU19BVFRSX0VORCA9IDU7XG52YXIgU19UQUdfU1BBQ0UgPSA2O1xudmFyIFNfVEFHX0NMT1NFID0gNztcblxuZnVuY3Rpb24gWE1MUmVhZGVyKCkge31cblxuWE1MUmVhZGVyLnByb3RvdHlwZSA9IHtcbiAgcGFyc2U6IGZ1bmN0aW9uIHBhcnNlKHNvdXJjZSwgZGVmYXVsdE5TTWFwLCBlbnRpdHlNYXApIHtcbiAgICB2YXIgZG9tQnVpbGRlciA9IHRoaXMuZG9tQnVpbGRlcjtcbiAgICBkb21CdWlsZGVyLnN0YXJ0RG9jdW1lbnQoKTtcblxuICAgIF9jb3B5KGRlZmF1bHROU01hcCwgZGVmYXVsdE5TTWFwID0ge30pO1xuXG4gICAgX3BhcnNlKHNvdXJjZSwgZGVmYXVsdE5TTWFwLCBlbnRpdHlNYXAsIGRvbUJ1aWxkZXIsIHRoaXMuZXJyb3JIYW5kbGVyKTtcblxuICAgIGRvbUJ1aWxkZXIuZW5kRG9jdW1lbnQoKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX3BhcnNlKHNvdXJjZSwgZGVmYXVsdE5TTWFwQ29weSwgZW50aXR5TWFwLCBkb21CdWlsZGVyLCBlcnJvckhhbmRsZXIpIHtcbiAgZnVuY3Rpb24gZml4ZWRGcm9tQ2hhckNvZGUoY29kZSkge1xuICAgIGlmIChjb2RlID4gMHhmZmZmKSB7XG4gICAgICBjb2RlIC09IDB4MTAwMDA7XG4gICAgICB2YXIgc3Vycm9nYXRlMSA9IDB4ZDgwMCArIChjb2RlID4+IDEwKSxcbiAgICAgICAgICBzdXJyb2dhdGUyID0gMHhkYzAwICsgKGNvZGUgJiAweDNmZik7XG4gICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShzdXJyb2dhdGUxLCBzdXJyb2dhdGUyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZW50aXR5UmVwbGFjZXIoYSkge1xuICAgIHZhciBrID0gYS5zbGljZSgxLCAtMSk7XG5cbiAgICBpZiAoayBpbiBlbnRpdHlNYXApIHtcbiAgICAgIHJldHVybiBlbnRpdHlNYXBba107XG4gICAgfSBlbHNlIGlmIChrLmNoYXJBdCgwKSA9PT0gJyMnKSB7XG4gICAgICByZXR1cm4gZml4ZWRGcm9tQ2hhckNvZGUocGFyc2VJbnQoay5zdWJzdHIoMSkucmVwbGFjZSgneCcsICcweCcpKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9ySGFuZGxlci5lcnJvcignZW50aXR5IG5vdCBmb3VuZDonICsgYSk7XG4gICAgICByZXR1cm4gYTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhcHBlbmRUZXh0KGVuZCkge1xuICAgIGlmIChlbmQgPiBzdGFydCkge1xuICAgICAgdmFyIHh0ID0gc291cmNlLnN1YnN0cmluZyhzdGFydCwgZW5kKS5yZXBsYWNlKC8mIz9cXHcrOy9nLCBlbnRpdHlSZXBsYWNlcik7XG4gICAgICBsb2NhdG9yICYmIHBvc2l0aW9uKHN0YXJ0KTtcbiAgICAgIGRvbUJ1aWxkZXIuY2hhcmFjdGVycyh4dCwgMCwgZW5kIC0gc3RhcnQpO1xuICAgICAgc3RhcnQgPSBlbmQ7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcG9zaXRpb24ocCwgbSkge1xuICAgIHdoaWxlIChwID49IGxpbmVFbmQgJiYgKG0gPSBsaW5lUGF0dGVybi5leGVjKHNvdXJjZSkpKSB7XG4gICAgICBsaW5lU3RhcnQgPSBtLmluZGV4O1xuICAgICAgbGluZUVuZCA9IGxpbmVTdGFydCArIG1bMF0ubGVuZ3RoO1xuICAgICAgbG9jYXRvci5saW5lTnVtYmVyKys7XG4gICAgfVxuXG4gICAgbG9jYXRvci5jb2x1bW5OdW1iZXIgPSBwIC0gbGluZVN0YXJ0ICsgMTtcbiAgfVxuXG4gIHZhciBsaW5lU3RhcnQgPSAwO1xuICB2YXIgbGluZUVuZCA9IDA7XG4gIHZhciBsaW5lUGF0dGVybiA9IC8uKig/Olxcclxcbj98XFxuKXwuKiQvZztcbiAgdmFyIGxvY2F0b3IgPSBkb21CdWlsZGVyLmxvY2F0b3I7XG4gIHZhciBwYXJzZVN0YWNrID0gW3tcbiAgICBjdXJyZW50TlNNYXA6IGRlZmF1bHROU01hcENvcHlcbiAgfV07XG4gIHZhciBjbG9zZU1hcCA9IHt9O1xuICB2YXIgc3RhcnQgPSAwO1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciB0YWdTdGFydCA9IHNvdXJjZS5pbmRleE9mKCc8Jywgc3RhcnQpO1xuXG4gICAgICBpZiAodGFnU3RhcnQgPCAwKSB7XG4gICAgICAgIGlmICghc291cmNlLnN1YnN0cihzdGFydCkubWF0Y2goL15cXHMqJC8pKSB7XG4gICAgICAgICAgdmFyIGRvYyA9IGRvbUJ1aWxkZXIuZG9jO1xuICAgICAgICAgIHZhciB0ZXh0ID0gZG9jLmNyZWF0ZVRleHROb2RlKHNvdXJjZS5zdWJzdHIoc3RhcnQpKTtcbiAgICAgICAgICBkb2MuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgICAgICAgZG9tQnVpbGRlci5jdXJyZW50RWxlbWVudCA9IHRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh0YWdTdGFydCA+IHN0YXJ0KSB7XG4gICAgICAgIGFwcGVuZFRleHQodGFnU3RhcnQpO1xuICAgICAgfVxuXG4gICAgICBzd2l0Y2ggKHNvdXJjZS5jaGFyQXQodGFnU3RhcnQgKyAxKSkge1xuICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgICB2YXIgZW5kID0gc291cmNlLmluZGV4T2YoJz4nLCB0YWdTdGFydCArIDMpO1xuICAgICAgICAgIHZhciB0YWdOYW1lID0gc291cmNlLnN1YnN0cmluZyh0YWdTdGFydCArIDIsIGVuZCk7XG4gICAgICAgICAgdmFyIGNvbmZpZyA9IHBhcnNlU3RhY2sucG9wKCk7XG5cbiAgICAgICAgICBpZiAoZW5kIDwgMCkge1xuICAgICAgICAgICAgdGFnTmFtZSA9IHNvdXJjZS5zdWJzdHJpbmcodGFnU3RhcnQgKyAyKS5yZXBsYWNlKC9bXFxzPF0uKi8sICcnKTtcbiAgICAgICAgICAgIGVycm9ySGFuZGxlci5lcnJvcihcImVuZCB0YWcgbmFtZTogXCIgKyB0YWdOYW1lICsgJyBpcyBub3QgY29tcGxldGU6JyArIGNvbmZpZy50YWdOYW1lKTtcbiAgICAgICAgICAgIGVuZCA9IHRhZ1N0YXJ0ICsgMSArIHRhZ05hbWUubGVuZ3RoO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGFnTmFtZS5tYXRjaCgvXFxzPC8pKSB7XG4gICAgICAgICAgICB0YWdOYW1lID0gdGFnTmFtZS5yZXBsYWNlKC9bXFxzPF0uKi8sICcnKTtcbiAgICAgICAgICAgIGVycm9ySGFuZGxlci5lcnJvcihcImVuZCB0YWcgbmFtZTogXCIgKyB0YWdOYW1lICsgJyBtYXliZSBub3QgY29tcGxldGUnKTtcbiAgICAgICAgICAgIGVuZCA9IHRhZ1N0YXJ0ICsgMSArIHRhZ05hbWUubGVuZ3RoO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBsb2NhbE5TTWFwID0gY29uZmlnLmxvY2FsTlNNYXA7XG4gICAgICAgICAgdmFyIGVuZE1hdGNoID0gY29uZmlnLnRhZ05hbWUgPT0gdGFnTmFtZTtcbiAgICAgICAgICB2YXIgZW5kSWdub3JlQ2FzZU1hY2ggPSBlbmRNYXRjaCB8fCBjb25maWcudGFnTmFtZSAmJiBjb25maWcudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09IHRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgIGlmIChlbmRJZ25vcmVDYXNlTWFjaCkge1xuICAgICAgICAgICAgZG9tQnVpbGRlci5lbmRFbGVtZW50KGNvbmZpZy51cmksIGNvbmZpZy5sb2NhbE5hbWUsIHRhZ05hbWUpO1xuXG4gICAgICAgICAgICBpZiAobG9jYWxOU01hcCkge1xuICAgICAgICAgICAgICBmb3IgKHZhciBwcmVmaXggaW4gbG9jYWxOU01hcCkge1xuICAgICAgICAgICAgICAgIGRvbUJ1aWxkZXIuZW5kUHJlZml4TWFwcGluZyhwcmVmaXgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghZW5kTWF0Y2gpIHtcbiAgICAgICAgICAgICAgZXJyb3JIYW5kbGVyLmZhdGFsRXJyb3IoXCJlbmQgdGFnIG5hbWU6IFwiICsgdGFnTmFtZSArICcgaXMgbm90IG1hdGNoIHRoZSBjdXJyZW50IHN0YXJ0IHRhZ05hbWU6JyArIGNvbmZpZy50YWdOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyc2VTdGFjay5wdXNoKGNvbmZpZyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZW5kKys7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnPyc6XG4gICAgICAgICAgbG9jYXRvciAmJiBwb3NpdGlvbih0YWdTdGFydCk7XG4gICAgICAgICAgZW5kID0gcGFyc2VJbnN0cnVjdGlvbihzb3VyY2UsIHRhZ1N0YXJ0LCBkb21CdWlsZGVyKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICchJzpcbiAgICAgICAgICBsb2NhdG9yICYmIHBvc2l0aW9uKHRhZ1N0YXJ0KTtcbiAgICAgICAgICBlbmQgPSBwYXJzZURDQyhzb3VyY2UsIHRhZ1N0YXJ0LCBkb21CdWlsZGVyLCBlcnJvckhhbmRsZXIpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgbG9jYXRvciAmJiBwb3NpdGlvbih0YWdTdGFydCk7XG4gICAgICAgICAgdmFyIGVsID0gbmV3IEVsZW1lbnRBdHRyaWJ1dGVzKCk7XG4gICAgICAgICAgdmFyIGN1cnJlbnROU01hcCA9IHBhcnNlU3RhY2tbcGFyc2VTdGFjay5sZW5ndGggLSAxXS5jdXJyZW50TlNNYXA7XG4gICAgICAgICAgdmFyIGVuZCA9IHBhcnNlRWxlbWVudFN0YXJ0UGFydChzb3VyY2UsIHRhZ1N0YXJ0LCBlbCwgY3VycmVudE5TTWFwLCBlbnRpdHlSZXBsYWNlciwgZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICB2YXIgbGVuID0gZWwubGVuZ3RoO1xuXG4gICAgICAgICAgaWYgKCFlbC5jbG9zZWQgJiYgZml4U2VsZkNsb3NlZChzb3VyY2UsIGVuZCwgZWwudGFnTmFtZSwgY2xvc2VNYXApKSB7XG4gICAgICAgICAgICBlbC5jbG9zZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAoIWVudGl0eU1hcC5uYnNwKSB7XG4gICAgICAgICAgICAgIGVycm9ySGFuZGxlci53YXJuaW5nKCd1bmNsb3NlZCB4bWwgYXR0cmlidXRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGxvY2F0b3IgJiYgbGVuKSB7XG4gICAgICAgICAgICB2YXIgbG9jYXRvcjIgPSBjb3B5TG9jYXRvcihsb2NhdG9yLCB7fSk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgdmFyIGEgPSBlbFtpXTtcbiAgICAgICAgICAgICAgcG9zaXRpb24oYS5vZmZzZXQpO1xuICAgICAgICAgICAgICBhLmxvY2F0b3IgPSBjb3B5TG9jYXRvcihsb2NhdG9yLCB7fSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvbUJ1aWxkZXIubG9jYXRvciA9IGxvY2F0b3IyO1xuXG4gICAgICAgICAgICBpZiAoYXBwZW5kRWxlbWVudChlbCwgZG9tQnVpbGRlciwgY3VycmVudE5TTWFwKSkge1xuICAgICAgICAgICAgICBwYXJzZVN0YWNrLnB1c2goZWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkb21CdWlsZGVyLmxvY2F0b3IgPSBsb2NhdG9yO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoYXBwZW5kRWxlbWVudChlbCwgZG9tQnVpbGRlciwgY3VycmVudE5TTWFwKSkge1xuICAgICAgICAgICAgICBwYXJzZVN0YWNrLnB1c2goZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChlbC51cmkgPT09ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJyAmJiAhZWwuY2xvc2VkKSB7XG4gICAgICAgICAgICBlbmQgPSBwYXJzZUh0bWxTcGVjaWFsQ29udGVudChzb3VyY2UsIGVuZCwgZWwudGFnTmFtZSwgZW50aXR5UmVwbGFjZXIsIGRvbUJ1aWxkZXIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbmQrKztcbiAgICAgICAgICB9XG5cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlcnJvckhhbmRsZXIuZXJyb3IoJ2VsZW1lbnQgcGFyc2UgZXJyb3I6ICcgKyBlKTtcbiAgICAgIGVuZCA9IC0xO1xuICAgIH1cblxuICAgIGlmIChlbmQgPiBzdGFydCkge1xuICAgICAgc3RhcnQgPSBlbmQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwcGVuZFRleHQoTWF0aC5tYXgodGFnU3RhcnQsIHN0YXJ0KSArIDEpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjb3B5TG9jYXRvcihmLCB0KSB7XG4gIHQubGluZU51bWJlciA9IGYubGluZU51bWJlcjtcbiAgdC5jb2x1bW5OdW1iZXIgPSBmLmNvbHVtbk51bWJlcjtcbiAgcmV0dXJuIHQ7XG59XG5cbmZ1bmN0aW9uIHBhcnNlRWxlbWVudFN0YXJ0UGFydChzb3VyY2UsIHN0YXJ0LCBlbCwgY3VycmVudE5TTWFwLCBlbnRpdHlSZXBsYWNlciwgZXJyb3JIYW5kbGVyKSB7XG4gIHZhciBhdHRyTmFtZTtcbiAgdmFyIHZhbHVlO1xuICB2YXIgcCA9ICsrc3RhcnQ7XG4gIHZhciBzID0gU19UQUc7XG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICB2YXIgYyA9IHNvdXJjZS5jaGFyQXQocCk7XG5cbiAgICBzd2l0Y2ggKGMpIHtcbiAgICAgIGNhc2UgJz0nOlxuICAgICAgICBpZiAocyA9PT0gU19BVFRSKSB7XG4gICAgICAgICAgYXR0ck5hbWUgPSBzb3VyY2Uuc2xpY2Uoc3RhcnQsIHApO1xuICAgICAgICAgIHMgPSBTX0VRO1xuICAgICAgICB9IGVsc2UgaWYgKHMgPT09IFNfQVRUUl9TUEFDRSkge1xuICAgICAgICAgIHMgPSBTX0VRO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignYXR0cmlidXRlIGVxdWFsIG11c3QgYWZ0ZXIgYXR0ck5hbWUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdcXCcnOlxuICAgICAgY2FzZSAnXCInOlxuICAgICAgICBpZiAocyA9PT0gU19FUSB8fCBzID09PSBTX0FUVFIpIHtcbiAgICAgICAgICAgIGlmIChzID09PSBTX0FUVFIpIHtcbiAgICAgICAgICAgICAgZXJyb3JIYW5kbGVyLndhcm5pbmcoJ2F0dHJpYnV0ZSB2YWx1ZSBtdXN0IGFmdGVyIFwiPVwiJyk7XG4gICAgICAgICAgICAgIGF0dHJOYW1lID0gc291cmNlLnNsaWNlKHN0YXJ0LCBwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3RhcnQgPSBwICsgMTtcbiAgICAgICAgICAgIHAgPSBzb3VyY2UuaW5kZXhPZihjLCBzdGFydCk7XG5cbiAgICAgICAgICAgIGlmIChwID4gMCkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IHNvdXJjZS5zbGljZShzdGFydCwgcCkucmVwbGFjZSgvJiM/XFx3KzsvZywgZW50aXR5UmVwbGFjZXIpO1xuICAgICAgICAgICAgICBlbC5hZGQoYXR0ck5hbWUsIHZhbHVlLCBzdGFydCAtIDEpO1xuICAgICAgICAgICAgICBzID0gU19BVFRSX0VORDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignYXR0cmlidXRlIHZhbHVlIG5vIGVuZCBcXCcnICsgYyArICdcXCcgbWF0Y2gnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHMgPT0gU19BVFRSX05PUVVPVF9WQUxVRSkge1xuICAgICAgICAgIHZhbHVlID0gc291cmNlLnNsaWNlKHN0YXJ0LCBwKS5yZXBsYWNlKC8mIz9cXHcrOy9nLCBlbnRpdHlSZXBsYWNlcik7XG4gICAgICAgICAgZWwuYWRkKGF0dHJOYW1lLCB2YWx1ZSwgc3RhcnQpO1xuICAgICAgICAgIGVycm9ySGFuZGxlci53YXJuaW5nKCdhdHRyaWJ1dGUgXCInICsgYXR0ck5hbWUgKyAnXCIgbWlzc2VkIHN0YXJ0IHF1b3QoJyArIGMgKyAnKSEhJyk7XG4gICAgICAgICAgc3RhcnQgPSBwICsgMTtcbiAgICAgICAgICBzID0gU19BVFRSX0VORDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2F0dHJpYnV0ZSB2YWx1ZSBtdXN0IGFmdGVyIFwiPVwiJyk7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnLyc6XG4gICAgICAgIHN3aXRjaCAocykge1xuICAgICAgICAgIGNhc2UgU19UQUc6XG4gICAgICAgICAgICBlbC5zZXRUYWdOYW1lKHNvdXJjZS5zbGljZShzdGFydCwgcCkpO1xuXG4gICAgICAgICAgY2FzZSBTX0FUVFJfRU5EOlxuICAgICAgICAgIGNhc2UgU19UQUdfU1BBQ0U6XG4gICAgICAgICAgY2FzZSBTX1RBR19DTE9TRTpcbiAgICAgICAgICAgIHMgPSBTX1RBR19DTE9TRTtcbiAgICAgICAgICAgIGVsLmNsb3NlZCA9IHRydWU7XG5cbiAgICAgICAgICBjYXNlIFNfQVRUUl9OT1FVT1RfVkFMVUU6XG4gICAgICAgICAgY2FzZSBTX0FUVFI6XG4gICAgICAgICAgY2FzZSBTX0FUVFJfU1BBQ0U6XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJhdHRyaWJ1dGUgaW52YWxpZCBjbG9zZSBjaGFyKCcvJylcIik7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnJzpcbiAgICAgICAgZXJyb3JIYW5kbGVyLmVycm9yKCd1bmV4cGVjdGVkIGVuZCBvZiBpbnB1dCcpO1xuXG4gICAgICAgIGlmIChzID09IFNfVEFHKSB7XG4gICAgICAgICAgZWwuc2V0VGFnTmFtZShzb3VyY2Uuc2xpY2Uoc3RhcnQsIHApKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwO1xuXG4gICAgICBjYXNlICc+JzpcbiAgICAgICAgc3dpdGNoIChzKSB7XG4gICAgICAgICAgY2FzZSBTX1RBRzpcbiAgICAgICAgICAgIGVsLnNldFRhZ05hbWUoc291cmNlLnNsaWNlKHN0YXJ0LCBwKSk7XG5cbiAgICAgICAgICBjYXNlIFNfQVRUUl9FTkQ6XG4gICAgICAgICAgY2FzZSBTX1RBR19TUEFDRTpcbiAgICAgICAgICBjYXNlIFNfVEFHX0NMT1NFOlxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIFNfQVRUUl9OT1FVT1RfVkFMVUU6XG4gICAgICAgICAgY2FzZSBTX0FUVFI6XG4gICAgICAgICAgICB2YWx1ZSA9IHNvdXJjZS5zbGljZShzdGFydCwgcCk7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZS5zbGljZSgtMSkgPT09ICcvJykge1xuICAgICAgICAgICAgICBlbC5jbG9zZWQgPSB0cnVlO1xuICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgU19BVFRSX1NQQUNFOlxuICAgICAgICAgICAgaWYgKHMgPT09IFNfQVRUUl9TUEFDRSkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IGF0dHJOYW1lO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocyA9PSBTX0FUVFJfTk9RVU9UX1ZBTFVFKSB7XG4gICAgICAgICAgICAgIGVycm9ySGFuZGxlci53YXJuaW5nKCdhdHRyaWJ1dGUgXCInICsgdmFsdWUgKyAnXCIgbWlzc2VkIHF1b3QoXCIpISEnKTtcbiAgICAgICAgICAgICAgZWwuYWRkKGF0dHJOYW1lLCB2YWx1ZS5yZXBsYWNlKC8mIz9cXHcrOy9nLCBlbnRpdHlSZXBsYWNlciksIHN0YXJ0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChjdXJyZW50TlNNYXBbJyddICE9PSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcgfHwgIXZhbHVlLm1hdGNoKC9eKD86ZGlzYWJsZWR8Y2hlY2tlZHxzZWxlY3RlZCkkL2kpKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JIYW5kbGVyLndhcm5pbmcoJ2F0dHJpYnV0ZSBcIicgKyB2YWx1ZSArICdcIiBtaXNzZWQgdmFsdWUhISBcIicgKyB2YWx1ZSArICdcIiBpbnN0ZWFkISEnKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGVsLmFkZCh2YWx1ZSwgdmFsdWUsIHN0YXJ0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIFNfRVE6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2F0dHJpYnV0ZSB2YWx1ZSBtaXNzZWQhIScpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHA7XG5cbiAgICAgIGNhc2UgXCJcXHg4MFwiOlxuICAgICAgICBjID0gJyAnO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoYyA8PSAnICcpIHtcbiAgICAgICAgICBzd2l0Y2ggKHMpIHtcbiAgICAgICAgICAgIGNhc2UgU19UQUc6XG4gICAgICAgICAgICAgIGVsLnNldFRhZ05hbWUoc291cmNlLnNsaWNlKHN0YXJ0LCBwKSk7XG4gICAgICAgICAgICAgIHMgPSBTX1RBR19TUEFDRTtcbiAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgU19BVFRSOlxuICAgICAgICAgICAgICBhdHRyTmFtZSA9IHNvdXJjZS5zbGljZShzdGFydCwgcCk7XG4gICAgICAgICAgICAgIHMgPSBTX0FUVFJfU1BBQ0U7XG4gICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFNfQVRUUl9OT1FVT1RfVkFMVUU6XG4gICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHNvdXJjZS5zbGljZShzdGFydCwgcCkucmVwbGFjZSgvJiM/XFx3KzsvZywgZW50aXR5UmVwbGFjZXIpO1xuICAgICAgICAgICAgICBlcnJvckhhbmRsZXIud2FybmluZygnYXR0cmlidXRlIFwiJyArIHZhbHVlICsgJ1wiIG1pc3NlZCBxdW90KFwiKSEhJyk7XG4gICAgICAgICAgICAgIGVsLmFkZChhdHRyTmFtZSwgdmFsdWUsIHN0YXJ0KTtcblxuICAgICAgICAgICAgY2FzZSBTX0FUVFJfRU5EOlxuICAgICAgICAgICAgICBzID0gU19UQUdfU1BBQ0U7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzd2l0Y2ggKHMpIHtcbiAgICAgICAgICAgIGNhc2UgU19BVFRSX1NQQUNFOlxuICAgICAgICAgICAgICB2YXIgdGFnTmFtZSA9IGVsLnRhZ05hbWU7XG5cbiAgICAgICAgICAgICAgaWYgKGN1cnJlbnROU01hcFsnJ10gIT09ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJyB8fCAhYXR0ck5hbWUubWF0Y2goL14oPzpkaXNhYmxlZHxjaGVja2VkfHNlbGVjdGVkKSQvaSkpIHtcbiAgICAgICAgICAgICAgICBlcnJvckhhbmRsZXIud2FybmluZygnYXR0cmlidXRlIFwiJyArIGF0dHJOYW1lICsgJ1wiIG1pc3NlZCB2YWx1ZSEhIFwiJyArIGF0dHJOYW1lICsgJ1wiIGluc3RlYWQyISEnKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGVsLmFkZChhdHRyTmFtZSwgYXR0ck5hbWUsIHN0YXJ0KTtcbiAgICAgICAgICAgICAgc3RhcnQgPSBwO1xuICAgICAgICAgICAgICBzID0gU19BVFRSO1xuICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBTX0FUVFJfRU5EOlxuICAgICAgICAgICAgICBlcnJvckhhbmRsZXIud2FybmluZygnYXR0cmlidXRlIHNwYWNlIGlzIHJlcXVpcmVkXCInICsgYXR0ck5hbWUgKyAnXCIhIScpO1xuXG4gICAgICAgICAgICBjYXNlIFNfVEFHX1NQQUNFOlxuICAgICAgICAgICAgICBzID0gU19BVFRSO1xuICAgICAgICAgICAgICBzdGFydCA9IHA7XG4gICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFNfRVE6XG4gICAgICAgICAgICAgIHMgPSBTX0FUVFJfTk9RVU9UX1ZBTFVFO1xuICAgICAgICAgICAgICBzdGFydCA9IHA7XG4gICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFNfVEFHX0NMT1NFOlxuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJlbGVtZW50cyBjbG9zZWQgY2hhcmFjdGVyICcvJyBhbmQgJz4nIG11c3QgYmUgY29ubmVjdGVkIHRvXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcCsrO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFwcGVuZEVsZW1lbnQoZWwsIGRvbUJ1aWxkZXIsIGN1cnJlbnROU01hcCkge1xuICB2YXIgdGFnTmFtZSA9IGVsLnRhZ05hbWU7XG4gIHZhciBsb2NhbE5TTWFwID0gbnVsbDtcbiAgdmFyIGkgPSBlbC5sZW5ndGg7XG5cbiAgd2hpbGUgKGktLSkge1xuICAgIHZhciBhID0gZWxbaV07XG4gICAgdmFyIHFOYW1lID0gYS5xTmFtZTtcbiAgICB2YXIgdmFsdWUgPSBhLnZhbHVlO1xuICAgIHZhciBuc3AgPSBxTmFtZS5pbmRleE9mKCc6Jyk7XG5cbiAgICBpZiAobnNwID4gMCkge1xuICAgICAgdmFyIHByZWZpeCA9IGEucHJlZml4ID0gcU5hbWUuc2xpY2UoMCwgbnNwKTtcbiAgICAgIHZhciBsb2NhbE5hbWUgPSBxTmFtZS5zbGljZShuc3AgKyAxKTtcbiAgICAgIHZhciBuc1ByZWZpeCA9IHByZWZpeCA9PT0gJ3htbG5zJyAmJiBsb2NhbE5hbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvY2FsTmFtZSA9IHFOYW1lO1xuICAgICAgcHJlZml4ID0gbnVsbDtcbiAgICAgIG5zUHJlZml4ID0gcU5hbWUgPT09ICd4bWxucycgJiYgJyc7XG4gICAgfVxuXG4gICAgYS5sb2NhbE5hbWUgPSBsb2NhbE5hbWU7XG5cbiAgICBpZiAobnNQcmVmaXggIT09IGZhbHNlKSB7XG4gICAgICBpZiAobG9jYWxOU01hcCA9PSBudWxsKSB7XG4gICAgICAgIGxvY2FsTlNNYXAgPSB7fTtcblxuICAgICAgICBfY29weShjdXJyZW50TlNNYXAsIGN1cnJlbnROU01hcCA9IHt9KTtcbiAgICAgIH1cblxuICAgICAgY3VycmVudE5TTWFwW25zUHJlZml4XSA9IGxvY2FsTlNNYXBbbnNQcmVmaXhdID0gdmFsdWU7XG4gICAgICBhLnVyaSA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zLyc7XG4gICAgICBkb21CdWlsZGVyLnN0YXJ0UHJlZml4TWFwcGluZyhuc1ByZWZpeCwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBpID0gZWwubGVuZ3RoO1xuXG4gIHdoaWxlIChpLS0pIHtcbiAgICBhID0gZWxbaV07XG4gICAgdmFyIHByZWZpeCA9IGEucHJlZml4O1xuXG4gICAgaWYgKHByZWZpeCkge1xuICAgICAgaWYgKHByZWZpeCA9PT0gJ3htbCcpIHtcbiAgICAgICAgYS51cmkgPSAnaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlJztcbiAgICAgIH1cblxuICAgICAgaWYgKHByZWZpeCAhPT0gJ3htbG5zJykge1xuICAgICAgICBhLnVyaSA9IGN1cnJlbnROU01hcFtwcmVmaXggfHwgJyddO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZhciBuc3AgPSB0YWdOYW1lLmluZGV4T2YoJzonKTtcblxuICBpZiAobnNwID4gMCkge1xuICAgIHByZWZpeCA9IGVsLnByZWZpeCA9IHRhZ05hbWUuc2xpY2UoMCwgbnNwKTtcbiAgICBsb2NhbE5hbWUgPSBlbC5sb2NhbE5hbWUgPSB0YWdOYW1lLnNsaWNlKG5zcCArIDEpO1xuICB9IGVsc2Uge1xuICAgIHByZWZpeCA9IG51bGw7XG4gICAgbG9jYWxOYW1lID0gZWwubG9jYWxOYW1lID0gdGFnTmFtZTtcbiAgfVxuXG4gIHZhciBucyA9IGVsLnVyaSA9IGN1cnJlbnROU01hcFtwcmVmaXggfHwgJyddO1xuICBkb21CdWlsZGVyLnN0YXJ0RWxlbWVudChucywgbG9jYWxOYW1lLCB0YWdOYW1lLCBlbCk7XG5cbiAgaWYgKGVsLmNsb3NlZCkge1xuICAgIGRvbUJ1aWxkZXIuZW5kRWxlbWVudChucywgbG9jYWxOYW1lLCB0YWdOYW1lKTtcblxuICAgIGlmIChsb2NhbE5TTWFwKSB7XG4gICAgICBmb3IgKHByZWZpeCBpbiBsb2NhbE5TTWFwKSB7XG4gICAgICAgIGRvbUJ1aWxkZXIuZW5kUHJlZml4TWFwcGluZyhwcmVmaXgpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBlbC5jdXJyZW50TlNNYXAgPSBjdXJyZW50TlNNYXA7XG4gICAgZWwubG9jYWxOU01hcCA9IGxvY2FsTlNNYXA7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VIdG1sU3BlY2lhbENvbnRlbnQoc291cmNlLCBlbFN0YXJ0RW5kLCB0YWdOYW1lLCBlbnRpdHlSZXBsYWNlciwgZG9tQnVpbGRlcikge1xuICBpZiAoL14oPzpzY3JpcHR8dGV4dGFyZWEpJC9pLnRlc3QodGFnTmFtZSkpIHtcbiAgICB2YXIgZWxFbmRTdGFydCA9IHNvdXJjZS5pbmRleE9mKCc8LycgKyB0YWdOYW1lICsgJz4nLCBlbFN0YXJ0RW5kKTtcbiAgICB2YXIgdGV4dCA9IHNvdXJjZS5zdWJzdHJpbmcoZWxTdGFydEVuZCArIDEsIGVsRW5kU3RhcnQpO1xuXG4gICAgaWYgKC9bJjxdLy50ZXN0KHRleHQpKSB7XG4gICAgICBpZiAoL15zY3JpcHQkL2kudGVzdCh0YWdOYW1lKSkge1xuICAgICAgICBkb21CdWlsZGVyLmNoYXJhY3RlcnModGV4dCwgMCwgdGV4dC5sZW5ndGgpO1xuICAgICAgICByZXR1cm4gZWxFbmRTdGFydDtcbiAgICAgIH1cblxuICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvJiM/XFx3KzsvZywgZW50aXR5UmVwbGFjZXIpO1xuICAgICAgZG9tQnVpbGRlci5jaGFyYWN0ZXJzKHRleHQsIDAsIHRleHQubGVuZ3RoKTtcbiAgICAgIHJldHVybiBlbEVuZFN0YXJ0O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbFN0YXJ0RW5kICsgMTtcbn1cblxuZnVuY3Rpb24gZml4U2VsZkNsb3NlZChzb3VyY2UsIGVsU3RhcnRFbmQsIHRhZ05hbWUsIGNsb3NlTWFwKSB7XG4gIHZhciBwb3MgPSBjbG9zZU1hcFt0YWdOYW1lXTtcblxuICBpZiAocG9zID09IG51bGwpIHtcbiAgICBwb3MgPSBzb3VyY2UubGFzdEluZGV4T2YoJzwvJyArIHRhZ05hbWUgKyAnPicpO1xuXG4gICAgaWYgKHBvcyA8IGVsU3RhcnRFbmQpIHtcbiAgICAgIHBvcyA9IHNvdXJjZS5sYXN0SW5kZXhPZignPC8nICsgdGFnTmFtZSk7XG4gICAgfVxuXG4gICAgY2xvc2VNYXBbdGFnTmFtZV0gPSBwb3M7XG4gIH1cblxuICByZXR1cm4gcG9zIDwgZWxTdGFydEVuZDtcbn1cblxuZnVuY3Rpb24gX2NvcHkoc291cmNlLCB0YXJnZXQpIHtcbiAgZm9yICh2YXIgbiBpbiBzb3VyY2UpIHtcbiAgICB0YXJnZXRbbl0gPSBzb3VyY2Vbbl07XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VEQ0Moc291cmNlLCBzdGFydCwgZG9tQnVpbGRlciwgZXJyb3JIYW5kbGVyKSB7XG4gIHZhciBuZXh0ID0gc291cmNlLmNoYXJBdChzdGFydCArIDIpO1xuXG4gIHN3aXRjaCAobmV4dCkge1xuICAgIGNhc2UgJy0nOlxuICAgICAgaWYgKHNvdXJjZS5jaGFyQXQoc3RhcnQgKyAzKSA9PT0gJy0nKSB7XG4gICAgICAgIHZhciBlbmQgPSBzb3VyY2UuaW5kZXhPZignLS0+Jywgc3RhcnQgKyA0KTtcblxuICAgICAgICBpZiAoZW5kID4gc3RhcnQpIHtcbiAgICAgICAgICBkb21CdWlsZGVyLmNvbW1lbnQoc291cmNlLCBzdGFydCArIDQsIGVuZCAtIHN0YXJ0IC0gNCk7XG4gICAgICAgICAgcmV0dXJuIGVuZCArIDM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXJyb3JIYW5kbGVyLmVycm9yKFwiVW5jbG9zZWQgY29tbWVudFwiKTtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cblxuICAgIGRlZmF1bHQ6XG4gICAgICBpZiAoc291cmNlLnN1YnN0cihzdGFydCArIDMsIDYpID09ICdDREFUQVsnKSB7XG4gICAgICAgIHZhciBlbmQgPSBzb3VyY2UuaW5kZXhPZignXV0+Jywgc3RhcnQgKyA5KTtcbiAgICAgICAgZG9tQnVpbGRlci5zdGFydENEQVRBKCk7XG4gICAgICAgIGRvbUJ1aWxkZXIuY2hhcmFjdGVycyhzb3VyY2UsIHN0YXJ0ICsgOSwgZW5kIC0gc3RhcnQgLSA5KTtcbiAgICAgICAgZG9tQnVpbGRlci5lbmRDREFUQSgpO1xuICAgICAgICByZXR1cm4gZW5kICsgMztcbiAgICAgIH1cblxuICAgICAgdmFyIG1hdGNocyA9IHNwbGl0KHNvdXJjZSwgc3RhcnQpO1xuICAgICAgdmFyIGxlbiA9IG1hdGNocy5sZW5ndGg7XG5cbiAgICAgIGlmIChsZW4gPiAxICYmIC8hZG9jdHlwZS9pLnRlc3QobWF0Y2hzWzBdWzBdKSkge1xuICAgICAgICB2YXIgbmFtZSA9IG1hdGNoc1sxXVswXTtcbiAgICAgICAgdmFyIHB1YmlkID0gbGVuID4gMyAmJiAvXnB1YmxpYyQvaS50ZXN0KG1hdGNoc1syXVswXSkgJiYgbWF0Y2hzWzNdWzBdO1xuICAgICAgICB2YXIgc3lzaWQgPSBsZW4gPiA0ICYmIG1hdGNoc1s0XVswXTtcbiAgICAgICAgdmFyIGxhc3RNYXRjaCA9IG1hdGNoc1tsZW4gLSAxXTtcbiAgICAgICAgZG9tQnVpbGRlci5zdGFydERURChuYW1lLCBwdWJpZCAmJiBwdWJpZC5yZXBsYWNlKC9eKFsnXCJdKSguKj8pXFwxJC8sICckMicpLCBzeXNpZCAmJiBzeXNpZC5yZXBsYWNlKC9eKFsnXCJdKSguKj8pXFwxJC8sICckMicpKTtcbiAgICAgICAgZG9tQnVpbGRlci5lbmREVEQoKTtcbiAgICAgICAgcmV0dXJuIGxhc3RNYXRjaC5pbmRleCArIGxhc3RNYXRjaFswXS5sZW5ndGg7XG4gICAgICB9XG5cbiAgfVxuXG4gIHJldHVybiAtMTtcbn1cblxuZnVuY3Rpb24gcGFyc2VJbnN0cnVjdGlvbihzb3VyY2UsIHN0YXJ0LCBkb21CdWlsZGVyKSB7XG4gIHZhciBlbmQgPSBzb3VyY2UuaW5kZXhPZignPz4nLCBzdGFydCk7XG5cbiAgaWYgKGVuZCkge1xuICAgIHZhciBtYXRjaCA9IHNvdXJjZS5zdWJzdHJpbmcoc3RhcnQsIGVuZCkubWF0Y2goL148XFw/KFxcUyopXFxzKihbXFxzXFxTXSo/KVxccyokLyk7XG5cbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIHZhciBsZW4gPSBtYXRjaFswXS5sZW5ndGg7XG4gICAgICBkb21CdWlsZGVyLnByb2Nlc3NpbmdJbnN0cnVjdGlvbihtYXRjaFsxXSwgbWF0Y2hbMl0pO1xuICAgICAgcmV0dXJuIGVuZCArIDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTE7XG59XG5cbmZ1bmN0aW9uIEVsZW1lbnRBdHRyaWJ1dGVzKHNvdXJjZSkge31cblxuRWxlbWVudEF0dHJpYnV0ZXMucHJvdG90eXBlID0ge1xuICBzZXRUYWdOYW1lOiBmdW5jdGlvbiBzZXRUYWdOYW1lKHRhZ05hbWUpIHtcbiAgICBpZiAoIXRhZ05hbWVQYXR0ZXJuLnRlc3QodGFnTmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCB0YWdOYW1lOicgKyB0YWdOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLnRhZ05hbWUgPSB0YWdOYW1lO1xuICB9LFxuICBhZGQ6IGZ1bmN0aW9uIGFkZChxTmFtZSwgdmFsdWUsIG9mZnNldCkge1xuICAgIGlmICghdGFnTmFtZVBhdHRlcm4udGVzdChxTmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBhdHRyaWJ1dGU6JyArIHFOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzW3RoaXMubGVuZ3RoKytdID0ge1xuICAgICAgcU5hbWU6IHFOYW1lLFxuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgb2Zmc2V0OiBvZmZzZXRcbiAgICB9O1xuICB9LFxuICBsZW5ndGg6IDAsXG4gIGdldExvY2FsTmFtZTogZnVuY3Rpb24gZ2V0TG9jYWxOYW1lKGkpIHtcbiAgICByZXR1cm4gdGhpc1tpXS5sb2NhbE5hbWU7XG4gIH0sXG4gIGdldExvY2F0b3I6IGZ1bmN0aW9uIGdldExvY2F0b3IoaSkge1xuICAgIHJldHVybiB0aGlzW2ldLmxvY2F0b3I7XG4gIH0sXG4gIGdldFFOYW1lOiBmdW5jdGlvbiBnZXRRTmFtZShpKSB7XG4gICAgcmV0dXJuIHRoaXNbaV0ucU5hbWU7XG4gIH0sXG4gIGdldFVSSTogZnVuY3Rpb24gZ2V0VVJJKGkpIHtcbiAgICByZXR1cm4gdGhpc1tpXS51cmk7XG4gIH0sXG4gIGdldFZhbHVlOiBmdW5jdGlvbiBnZXRWYWx1ZShpKSB7XG4gICAgcmV0dXJuIHRoaXNbaV0udmFsdWU7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHNwbGl0KHNvdXJjZSwgc3RhcnQpIHtcbiAgdmFyIG1hdGNoO1xuICB2YXIgYnVmID0gW107XG4gIHZhciByZWcgPSAvJ1teJ10rJ3xcIlteXCJdK1wifFteXFxzPD5cXC89XSs9P3woXFwvP1xccyo+fDwpL2c7XG4gIHJlZy5sYXN0SW5kZXggPSBzdGFydDtcbiAgcmVnLmV4ZWMoc291cmNlKTtcblxuICB3aGlsZSAobWF0Y2ggPSByZWcuZXhlYyhzb3VyY2UpKSB7XG4gICAgYnVmLnB1c2gobWF0Y2gpO1xuICAgIGlmIChtYXRjaFsxXSkgcmV0dXJuIGJ1ZjtcbiAgfVxufVxuXG5leHBvcnRzLlhNTFJlYWRlciA9IFhNTFJlYWRlcjtcblxufSx7fV19LHt9LFs1NF0pO1xuIl0sImZpbGUiOiJ3ZWItYWRhcHRlci5qcyJ9
