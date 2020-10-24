(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["../cocos/physics/ammo/ammo-instantiated.js", "../cocos/physics/ammo/instantiate.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("../cocos/physics/ammo/ammo-instantiated.js"), require("../cocos/physics/ammo/instantiate.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.ammoInstantiated, global.instantiate);
    global.physicsAmmo = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_ammoInstantiated, _instantiate) {
  "use strict";

  _ammoInstantiated = _interopRequireDefault(_ammoInstantiated);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * @hidden
   */
  // polyfill for wechat
  if (window.atob == null) {
    window.atob = function (input) {
      var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var output = "";
      var chr1 = 0,
          chr2 = 0,
          chr3 = 0;
      var enc1 = 0,
          enc2 = 0,
          enc3 = 0,
          enc4 = 0;
      var i = 0;
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));
        chr1 = enc1 << 2 | enc2 >> 4;
        chr2 = (enc2 & 15) << 4 | enc3 >> 2;
        chr3 = (enc3 & 3) << 6 | enc4;
        output = output + String.fromCharCode(chr1);

        if (enc3 !== 64) {
          output = output + String.fromCharCode(chr2);
        }

        if (enc4 !== 64) {
          output = output + String.fromCharCode(chr3);
        }
      } while (i < input.length);

      return output;
    };
  }

  window.Ammo = _ammoInstantiated.default; //polyfill config

  _ammoInstantiated.default['CC_CONFIG'] = {
    'ignoreSelfBody': true,
    'emitStaticCollision': false
  };
  _ammoInstantiated.default['CC_CACHE'] = {
    'btTriangleMesh': {
      'enable': false
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2V4cG9ydHMvcGh5c2ljcy1hbW1vLnRzIl0sIm5hbWVzIjpbIndpbmRvdyIsImF0b2IiLCJpbnB1dCIsImtleVN0ciIsIm91dHB1dCIsImNocjEiLCJjaHIyIiwiY2hyMyIsImVuYzEiLCJlbmMyIiwiZW5jMyIsImVuYzQiLCJpIiwicmVwbGFjZSIsImluZGV4T2YiLCJjaGFyQXQiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJsZW5ndGgiLCJBbW1vIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztBQUlBO0FBQ0EsTUFBSUEsTUFBTSxDQUFDQyxJQUFQLElBQWUsSUFBbkIsRUFBeUI7QUFDckJELElBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxHQUFjLFVBQVVDLEtBQVYsRUFBaUI7QUFDM0IsVUFBSUMsTUFBTSxHQUFHLG1FQUFiO0FBQ0EsVUFBSUMsTUFBTSxHQUFHLEVBQWI7QUFDQSxVQUFJQyxJQUFJLEdBQUcsQ0FBWDtBQUFBLFVBQWNDLElBQUksR0FBRyxDQUFyQjtBQUFBLFVBQXdCQyxJQUFJLEdBQUcsQ0FBL0I7QUFDQSxVQUFJQyxJQUFJLEdBQUcsQ0FBWDtBQUFBLFVBQWNDLElBQUksR0FBRyxDQUFyQjtBQUFBLFVBQXdCQyxJQUFJLEdBQUcsQ0FBL0I7QUFBQSxVQUFrQ0MsSUFBSSxHQUFHLENBQXpDO0FBQ0EsVUFBSUMsQ0FBQyxHQUFHLENBQVI7QUFDQVYsTUFBQUEsS0FBSyxHQUFHQSxLQUFLLENBQUNXLE9BQU4sQ0FBYyxxQkFBZCxFQUFxQyxFQUFyQyxDQUFSOztBQUNBLFNBQUc7QUFDQ0wsUUFBQUEsSUFBSSxHQUFHTCxNQUFNLENBQUNXLE9BQVAsQ0FBZVosS0FBSyxDQUFDYSxNQUFOLENBQWFILENBQUMsRUFBZCxDQUFmLENBQVA7QUFDQUgsUUFBQUEsSUFBSSxHQUFHTixNQUFNLENBQUNXLE9BQVAsQ0FBZVosS0FBSyxDQUFDYSxNQUFOLENBQWFILENBQUMsRUFBZCxDQUFmLENBQVA7QUFDQUYsUUFBQUEsSUFBSSxHQUFHUCxNQUFNLENBQUNXLE9BQVAsQ0FBZVosS0FBSyxDQUFDYSxNQUFOLENBQWFILENBQUMsRUFBZCxDQUFmLENBQVA7QUFDQUQsUUFBQUEsSUFBSSxHQUFHUixNQUFNLENBQUNXLE9BQVAsQ0FBZVosS0FBSyxDQUFDYSxNQUFOLENBQWFILENBQUMsRUFBZCxDQUFmLENBQVA7QUFDQVAsUUFBQUEsSUFBSSxHQUFHRyxJQUFJLElBQUksQ0FBUixHQUFZQyxJQUFJLElBQUksQ0FBM0I7QUFDQUgsUUFBQUEsSUFBSSxHQUFHLENBQUNHLElBQUksR0FBRyxFQUFSLEtBQWUsQ0FBZixHQUFtQkMsSUFBSSxJQUFJLENBQWxDO0FBQ0FILFFBQUFBLElBQUksR0FBRyxDQUFDRyxJQUFJLEdBQUcsQ0FBUixLQUFjLENBQWQsR0FBa0JDLElBQXpCO0FBQ0FQLFFBQUFBLE1BQU0sR0FBR0EsTUFBTSxHQUFHWSxNQUFNLENBQUNDLFlBQVAsQ0FBb0JaLElBQXBCLENBQWxCOztBQUNBLFlBQUlLLElBQUksS0FBSyxFQUFiLEVBQWlCO0FBQ2JOLFVBQUFBLE1BQU0sR0FBR0EsTUFBTSxHQUFHWSxNQUFNLENBQUNDLFlBQVAsQ0FBb0JYLElBQXBCLENBQWxCO0FBQ0g7O0FBQ0QsWUFBSUssSUFBSSxLQUFLLEVBQWIsRUFBaUI7QUFDYlAsVUFBQUEsTUFBTSxHQUFHQSxNQUFNLEdBQUdZLE1BQU0sQ0FBQ0MsWUFBUCxDQUFvQlYsSUFBcEIsQ0FBbEI7QUFDSDtBQUNKLE9BZkQsUUFlU0ssQ0FBQyxHQUFHVixLQUFLLENBQUNnQixNQWZuQjs7QUFnQkEsYUFBT2QsTUFBUDtBQUNILEtBeEJEO0FBeUJIOztBQUdESixFQUFBQSxNQUFNLENBQUNtQixJQUFQLEdBQWNBLHlCQUFkLEMsQ0FFQTs7QUFDQUEsNEJBQUssV0FBTCxJQUFvQjtBQUNoQixzQkFBa0IsSUFERjtBQUVoQiwyQkFBdUI7QUFGUCxHQUFwQjtBQUtBQSw0QkFBSyxVQUFMLElBQW1CO0FBQ2Ysc0JBQWtCO0FBQUUsZ0JBQVU7QUFBWjtBQURILEdBQW5CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG4vLyBwb2x5ZmlsbCBmb3Igd2VjaGF0XHJcbmlmICh3aW5kb3cuYXRvYiA9PSBudWxsKSB7XHJcbiAgICB3aW5kb3cuYXRvYiA9IGZ1bmN0aW9uIChpbnB1dCkge1xyXG4gICAgICAgIHZhciBrZXlTdHIgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89XCI7XHJcbiAgICAgICAgdmFyIG91dHB1dCA9IFwiXCI7XHJcbiAgICAgICAgdmFyIGNocjEgPSAwLCBjaHIyID0gMCwgY2hyMyA9IDA7XHJcbiAgICAgICAgdmFyIGVuYzEgPSAwLCBlbmMyID0gMCwgZW5jMyA9IDAsIGVuYzQgPSAwO1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICBpbnB1dCA9IGlucHV0LnJlcGxhY2UoL1teQS1aYS16MC05XFwrXFwvXFw9XS9nLCBcIlwiKTtcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIGVuYzEgPSBrZXlTdHIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XHJcbiAgICAgICAgICAgIGVuYzIgPSBrZXlTdHIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XHJcbiAgICAgICAgICAgIGVuYzMgPSBrZXlTdHIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XHJcbiAgICAgICAgICAgIGVuYzQgPSBrZXlTdHIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XHJcbiAgICAgICAgICAgIGNocjEgPSBlbmMxIDw8IDIgfCBlbmMyID4+IDQ7XHJcbiAgICAgICAgICAgIGNocjIgPSAoZW5jMiAmIDE1KSA8PCA0IHwgZW5jMyA+PiAyO1xyXG4gICAgICAgICAgICBjaHIzID0gKGVuYzMgJiAzKSA8PCA2IHwgZW5jNDtcclxuICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICsgU3RyaW5nLmZyb21DaGFyQ29kZShjaHIxKTtcclxuICAgICAgICAgICAgaWYgKGVuYzMgIT09IDY0KSB7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGNocjIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVuYzQgIT09IDY0KSB7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGNocjMpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IHdoaWxlIChpIDwgaW5wdXQubGVuZ3RoKTtcclxuICAgICAgICByZXR1cm4gb3V0cHV0XHJcbiAgICB9O1xyXG59XHJcblxyXG5pbXBvcnQgQW1tbyBmcm9tICcuLi9jb2Nvcy9waHlzaWNzL2FtbW8vYW1tby1pbnN0YW50aWF0ZWQnO1xyXG53aW5kb3cuQW1tbyA9IEFtbW87XHJcblxyXG4vL3BvbHlmaWxsIGNvbmZpZ1xyXG5BbW1vWydDQ19DT05GSUcnXSA9IHtcclxuICAgICdpZ25vcmVTZWxmQm9keSc6IHRydWUsXHJcbiAgICAnZW1pdFN0YXRpY0NvbGxpc2lvbic6IGZhbHNlLFxyXG59XHJcblxyXG5BbW1vWydDQ19DQUNIRSddID0ge1xyXG4gICAgJ2J0VHJpYW5nbGVNZXNoJzogeyAnZW5hYmxlJzogZmFsc2UgfSxcclxufVxyXG5cclxuaW1wb3J0ICcuLi9jb2Nvcy9waHlzaWNzL2FtbW8vaW5zdGFudGlhdGUnOyJdfQ==