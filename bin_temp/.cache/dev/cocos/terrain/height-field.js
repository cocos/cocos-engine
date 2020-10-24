(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/math/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/math/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index);
    global.heightField = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.HeightField = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var HeightField = /*#__PURE__*/function () {
    function HeightField(w, h) {
      _classCallCheck(this, HeightField);

      this.data = new Uint16Array();
      this.w = 0;
      this.h = 0;
      this.w = w;
      this.h = h;
      this.data = new Uint16Array(w * h);

      for (var i = 0; i < w * h; ++i) {
        this.data[i] = 0;
      }
    }

    _createClass(HeightField, [{
      key: "set",
      value: function set(i, j, value) {
        this.data[j * this.w + i] = value;
      }
    }, {
      key: "get",
      value: function get(i, j) {
        return this.data[j * this.w + i];
      }
    }, {
      key: "getClamp",
      value: function getClamp(i, j) {
        i = (0, _index.clamp)(i, 0, this.w - 1);
        j = (0, _index.clamp)(j, 0, this.h - 1);
        return this.get(i, j);
      }
    }, {
      key: "getAt",
      value: function getAt(x, y) {
        var fx = x;
        var fy = y;
        var ix0 = Math.floor(fx);
        var iz0 = Math.floor(fy);
        var ix1 = ix0 + 1;
        var iz1 = iz0 + 1;
        var dx = fx - ix0;
        var dz = fy - iz0;
        ix0 = (0, _index.clamp)(ix0, 0, this.w - 1);
        iz0 = (0, _index.clamp)(iz0, 0, this.h - 1);
        ix1 = (0, _index.clamp)(ix1, 0, this.w - 1);
        iz1 = (0, _index.clamp)(iz1, 0, this.h - 1);
        var a = this.get(ix0, iz0);
        var b = this.get(ix1, iz0);
        var c = this.get(ix0, iz1);
        var d = this.get(ix1, iz1);
        var m = (b + c) * 0.5;

        if (dx + dz <= 1.0) {
          d = m + (m - a);
        } else {
          a = m + (m - d);
        }

        var h1 = a * (1.0 - dx) + b * dx;
        var h2 = c * (1.0 - dx) + d * dx;
        var h = h1 * (1.0 - dz) + h2 * dz;
        return h;
      }
    }]);

    return HeightField;
  }();

  _exports.HeightField = HeightField;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3RlcnJhaW4vaGVpZ2h0LWZpZWxkLnRzIl0sIm5hbWVzIjpbIkhlaWdodEZpZWxkIiwidyIsImgiLCJkYXRhIiwiVWludDE2QXJyYXkiLCJpIiwiaiIsInZhbHVlIiwiZ2V0IiwieCIsInkiLCJmeCIsImZ5IiwiaXgwIiwiTWF0aCIsImZsb29yIiwiaXowIiwiaXgxIiwiaXoxIiwiZHgiLCJkeiIsImEiLCJiIiwiYyIsImQiLCJtIiwiaDEiLCJoMiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFNYUEsVztBQUtULHlCQUFhQyxDQUFiLEVBQXdCQyxDQUF4QixFQUFtQztBQUFBOztBQUFBLFdBSjVCQyxJQUk0QixHQUpSLElBQUlDLFdBQUosRUFJUTtBQUFBLFdBSDVCSCxDQUc0QixHQUhoQixDQUdnQjtBQUFBLFdBRjVCQyxDQUU0QixHQUZoQixDQUVnQjtBQUMvQixXQUFLRCxDQUFMLEdBQVNBLENBQVQ7QUFDQSxXQUFLQyxDQUFMLEdBQVNBLENBQVQ7QUFDQSxXQUFLQyxJQUFMLEdBQVksSUFBSUMsV0FBSixDQUFnQkgsQ0FBQyxHQUFHQyxDQUFwQixDQUFaOztBQUVBLFdBQUssSUFBSUcsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0osQ0FBQyxHQUFHQyxDQUF4QixFQUEyQixFQUFFRyxDQUE3QixFQUFnQztBQUM1QixhQUFLRixJQUFMLENBQVVFLENBQVYsSUFBZSxDQUFmO0FBQ0g7QUFDSjs7OzswQkFFV0EsQyxFQUFXQyxDLEVBQVdDLEssRUFBZTtBQUM3QyxhQUFLSixJQUFMLENBQVVHLENBQUMsR0FBRyxLQUFLTCxDQUFULEdBQWFJLENBQXZCLElBQTRCRSxLQUE1QjtBQUNIOzs7MEJBRVdGLEMsRUFBV0MsQyxFQUFXO0FBQzlCLGVBQU8sS0FBS0gsSUFBTCxDQUFVRyxDQUFDLEdBQUcsS0FBS0wsQ0FBVCxHQUFhSSxDQUF2QixDQUFQO0FBQ0g7OzsrQkFFZ0JBLEMsRUFBV0MsQyxFQUFXO0FBQ25DRCxRQUFBQSxDQUFDLEdBQUcsa0JBQU1BLENBQU4sRUFBUyxDQUFULEVBQVksS0FBS0osQ0FBTCxHQUFTLENBQXJCLENBQUo7QUFDQUssUUFBQUEsQ0FBQyxHQUFHLGtCQUFNQSxDQUFOLEVBQVMsQ0FBVCxFQUFZLEtBQUtKLENBQUwsR0FBVSxDQUF0QixDQUFKO0FBRUEsZUFBTyxLQUFLTSxHQUFMLENBQVNILENBQVQsRUFBWUMsQ0FBWixDQUFQO0FBQ0g7Ozs0QkFFYUcsQyxFQUFXQyxDLEVBQVc7QUFDaEMsWUFBTUMsRUFBRSxHQUFHRixDQUFYO0FBQ0EsWUFBTUcsRUFBRSxHQUFHRixDQUFYO0FBRUEsWUFBSUcsR0FBRyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0osRUFBWCxDQUFWO0FBQ0EsWUFBSUssR0FBRyxHQUFHRixJQUFJLENBQUNDLEtBQUwsQ0FBV0gsRUFBWCxDQUFWO0FBQ0EsWUFBSUssR0FBRyxHQUFHSixHQUFHLEdBQUcsQ0FBaEI7QUFDQSxZQUFJSyxHQUFHLEdBQUdGLEdBQUcsR0FBRyxDQUFoQjtBQUNBLFlBQU1HLEVBQUUsR0FBR1IsRUFBRSxHQUFHRSxHQUFoQjtBQUNBLFlBQU1PLEVBQUUsR0FBR1IsRUFBRSxHQUFHSSxHQUFoQjtBQUVBSCxRQUFBQSxHQUFHLEdBQUcsa0JBQU1BLEdBQU4sRUFBVyxDQUFYLEVBQWMsS0FBS1osQ0FBTCxHQUFTLENBQXZCLENBQU47QUFDQWUsUUFBQUEsR0FBRyxHQUFHLGtCQUFNQSxHQUFOLEVBQVcsQ0FBWCxFQUFjLEtBQUtkLENBQUwsR0FBUyxDQUF2QixDQUFOO0FBQ0FlLFFBQUFBLEdBQUcsR0FBRyxrQkFBTUEsR0FBTixFQUFXLENBQVgsRUFBYyxLQUFLaEIsQ0FBTCxHQUFTLENBQXZCLENBQU47QUFDQWlCLFFBQUFBLEdBQUcsR0FBRyxrQkFBTUEsR0FBTixFQUFXLENBQVgsRUFBYyxLQUFLaEIsQ0FBTCxHQUFTLENBQXZCLENBQU47QUFFQSxZQUFJbUIsQ0FBQyxHQUFHLEtBQUtiLEdBQUwsQ0FBU0ssR0FBVCxFQUFjRyxHQUFkLENBQVI7QUFDQSxZQUFNTSxDQUFDLEdBQUcsS0FBS2QsR0FBTCxDQUFTUyxHQUFULEVBQWNELEdBQWQsQ0FBVjtBQUNBLFlBQU1PLENBQUMsR0FBRyxLQUFLZixHQUFMLENBQVNLLEdBQVQsRUFBY0ssR0FBZCxDQUFWO0FBQ0EsWUFBSU0sQ0FBQyxHQUFHLEtBQUtoQixHQUFMLENBQVNTLEdBQVQsRUFBY0MsR0FBZCxDQUFSO0FBQ0EsWUFBTU8sQ0FBQyxHQUFHLENBQUNILENBQUMsR0FBR0MsQ0FBTCxJQUFVLEdBQXBCOztBQUVBLFlBQUlKLEVBQUUsR0FBR0MsRUFBTCxJQUFXLEdBQWYsRUFBb0I7QUFDaEJJLFVBQUFBLENBQUMsR0FBR0MsQ0FBQyxJQUFJQSxDQUFDLEdBQUdKLENBQVIsQ0FBTDtBQUNILFNBRkQsTUFHSztBQUNEQSxVQUFBQSxDQUFDLEdBQUdJLENBQUMsSUFBSUEsQ0FBQyxHQUFHRCxDQUFSLENBQUw7QUFDSDs7QUFFRCxZQUFNRSxFQUFFLEdBQUdMLENBQUMsSUFBSSxNQUFNRixFQUFWLENBQUQsR0FBaUJHLENBQUMsR0FBR0gsRUFBaEM7QUFDQSxZQUFNUSxFQUFFLEdBQUdKLENBQUMsSUFBSSxNQUFNSixFQUFWLENBQUQsR0FBaUJLLENBQUMsR0FBR0wsRUFBaEM7QUFFQSxZQUFNakIsQ0FBQyxHQUFHd0IsRUFBRSxJQUFJLE1BQU1OLEVBQVYsQ0FBRixHQUFrQk8sRUFBRSxHQUFHUCxFQUFqQztBQUVBLGVBQU9sQixDQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IHRlcnJhaW5cclxuICovXHJcblxyXG5pbXBvcnQgeyBjbGFtcCB9IGZyb20gJy4uL2NvcmUvbWF0aCc7XHJcblxyXG5leHBvcnQgY2xhc3MgSGVpZ2h0RmllbGQge1xyXG4gICAgcHVibGljIGRhdGE6IFVpbnQxNkFycmF5ID0gbmV3IFVpbnQxNkFycmF5KCk7XHJcbiAgICBwdWJsaWMgdzogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBoOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICh3OiBudW1iZXIsIGg6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMudyA9IHc7XHJcbiAgICAgICAgdGhpcy5oID0gaDtcclxuICAgICAgICB0aGlzLmRhdGEgPSBuZXcgVWludDE2QXJyYXkodyAqIGgpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHcgKiBoOyArK2kpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhW2ldID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCAoaTogbnVtYmVyLCBqOiBudW1iZXIsIHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmRhdGFbaiAqIHRoaXMudyArIGldID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCAoaTogbnVtYmVyLCBqOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhW2ogKiB0aGlzLncgKyBpXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q2xhbXAgKGk6IG51bWJlciwgajogbnVtYmVyKSB7XHJcbiAgICAgICAgaSA9IGNsYW1wKGksIDAsIHRoaXMudyAtIDEpO1xyXG4gICAgICAgIGogPSBjbGFtcChqLCAwLCB0aGlzLmggIC0gMSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmdldChpLCBqKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0QXQgKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZnggPSB4O1xyXG4gICAgICAgIGNvbnN0IGZ5ID0geTtcclxuXHJcbiAgICAgICAgbGV0IGl4MCA9IE1hdGguZmxvb3IoZngpO1xyXG4gICAgICAgIGxldCBpejAgPSBNYXRoLmZsb29yKGZ5KTtcclxuICAgICAgICBsZXQgaXgxID0gaXgwICsgMTtcclxuICAgICAgICBsZXQgaXoxID0gaXowICsgMTtcclxuICAgICAgICBjb25zdCBkeCA9IGZ4IC0gaXgwO1xyXG4gICAgICAgIGNvbnN0IGR6ID0gZnkgLSBpejA7XHJcblxyXG4gICAgICAgIGl4MCA9IGNsYW1wKGl4MCwgMCwgdGhpcy53IC0gMSk7XHJcbiAgICAgICAgaXowID0gY2xhbXAoaXowLCAwLCB0aGlzLmggLSAxKTtcclxuICAgICAgICBpeDEgPSBjbGFtcChpeDEsIDAsIHRoaXMudyAtIDEpO1xyXG4gICAgICAgIGl6MSA9IGNsYW1wKGl6MSwgMCwgdGhpcy5oIC0gMSk7XHJcblxyXG4gICAgICAgIGxldCBhID0gdGhpcy5nZXQoaXgwLCBpejApO1xyXG4gICAgICAgIGNvbnN0IGIgPSB0aGlzLmdldChpeDEsIGl6MCk7XHJcbiAgICAgICAgY29uc3QgYyA9IHRoaXMuZ2V0KGl4MCwgaXoxKTtcclxuICAgICAgICBsZXQgZCA9IHRoaXMuZ2V0KGl4MSwgaXoxKTtcclxuICAgICAgICBjb25zdCBtID0gKGIgKyBjKSAqIDAuNTtcclxuXHJcbiAgICAgICAgaWYgKGR4ICsgZHogPD0gMS4wKSB7XHJcbiAgICAgICAgICAgIGQgPSBtICsgKG0gLSBhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGEgPSBtICsgKG0gLSBkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGgxID0gYSAqICgxLjAgLSBkeCkgKyBiICogZHg7XHJcbiAgICAgICAgY29uc3QgaDIgPSBjICogKDEuMCAtIGR4KSArIGQgKiBkeDtcclxuXHJcbiAgICAgICAgY29uc3QgaCA9IGgxICogKDEuMCAtIGR6KSArIGgyICogZHo7XHJcblxyXG4gICAgICAgIHJldHVybiBoO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==