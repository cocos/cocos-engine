(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../../core/math/index.js", "../../../../core/memop/index.js", "../../../../core/renderer/ui/render-data.js", "../helper.js", "../types.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../../core/math/index.js"), require("../../../../core/memop/index.js"), require("../../../../core/renderer/ui/render-data.js"), require("../helper.js"), require("../types.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.renderData, global.helper, global.types);
    global.impl = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _renderData, _helper, _types) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Impl = _exports.Path = _exports.Point = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var Point = /*#__PURE__*/function (_Vec) {
    _inherits(Point, _Vec);

    function Point(x, y) {
      var _this;

      _classCallCheck(this, Point);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Point).call(this, x, y));
      _this.dx = 0;
      _this.dy = 0;
      _this.dmx = 0;
      _this.dmy = 0;
      _this.flags = 0;
      _this.len = 0;

      _this.reset();

      return _this;
    }

    _createClass(Point, [{
      key: "reset",
      value: function reset() {
        this.dx = 0;
        this.dy = 0;
        this.dmx = 0;
        this.dmy = 0;
        this.flags = 0;
        this.len = 0;
      }
    }]);

    return Point;
  }(_index.Vec2);

  _exports.Point = Point;

  var Path = /*#__PURE__*/function () {
    function Path() {
      _classCallCheck(this, Path);

      this.closed = false;
      this.bevel = 0;
      this.complex = true;
      this.points = [];
      this.reset();
    }

    _createClass(Path, [{
      key: "reset",
      value: function reset() {
        this.closed = false;
        this.bevel = 0;
        this.complex = true;

        if (this.points) {
          this.points.length = 0;
        } else {
          this.points = [];
        }
      }
    }]);

    return Path;
  }();

  _exports.Path = Path;

  var Impl = /*#__PURE__*/function () {
    function Impl() {
      _classCallCheck(this, Impl);

      this.dataOffset = 0;
      this.updatePathOffset = false;
      this.pathLength = 0;
      this.pathOffset = 0;
      this.paths = [];
      this.tessTol = 0.25;
      this.distTol = 0.01;
      this.fillColor = _index.Color.WHITE.clone();
      this.lineCap = _types.LineCap.BUTT;
      this.strokeColor = _index.Color.BLACK.clone();
      this.lineJoin = _types.LineJoin.MITER;
      this.lineWidth = 0;
      this.pointsOffset = 0;
      this._commandX = 0;
      this._commandY = 0;
      this._points = [];
      this._renderDataPool = new _index2.RecyclePool(function () {
        return new _renderData.MeshRenderData();
      }, 16);
      this._renderDataList = [];
      this._curPath = null;
    }

    _createClass(Impl, [{
      key: "moveTo",
      value: function moveTo(x, y) {
        if (this.updatePathOffset) {
          this.pathOffset = this.pathLength;
          this.updatePathOffset = false;
        }

        this._addPath();

        this.addPoint(x, y, _types.PointFlags.PT_CORNER);
        this._commandX = x;
        this._commandY = y;
      }
    }, {
      key: "lineTo",
      value: function lineTo(x, y) {
        this.addPoint(x, y, _types.PointFlags.PT_CORNER);
        this._commandX = x;
        this._commandY = y;
      }
    }, {
      key: "bezierCurveTo",
      value: function bezierCurveTo(c1x, c1y, c2x, c2y, x, y) {
        var path = this._curPath;
        var last = path.points[path.points.length - 1];

        if (!last) {
          return;
        }

        if (last.x === c1x && last.y === c1y && c2x === x && c2y === y) {
          this.lineTo(x, y);
          return;
        }

        (0, _helper.tesselateBezier)(this, last.x, last.y, c1x, c1y, c2x, c2y, x, y, 0, _types.PointFlags.PT_CORNER);
        this._commandX = x;
        this._commandY = y;
      }
    }, {
      key: "quadraticCurveTo",
      value: function quadraticCurveTo(cx, cy, x, y) {
        var x0 = this._commandX;
        var y0 = this._commandY;
        this.bezierCurveTo(x0 + 2.0 / 3.0 * (cx - x0), y0 + 2.0 / 3.0 * (cy - y0), x + 2.0 / 3.0 * (cx - x), y + 2.0 / 3.0 * (cy - y), x, y);
      }
    }, {
      key: "arc",
      value: function arc(cx, cy, r, startAngle, endAngle, counterclockwise) {
        (0, _helper.arc)(this, cx, cy, r, startAngle, endAngle, counterclockwise);
      }
    }, {
      key: "ellipse",
      value: function ellipse(cx, cy, rx, ry) {
        (0, _helper.ellipse)(this, cx, cy, rx, ry);
        this._curPath.complex = false;
      }
    }, {
      key: "circle",
      value: function circle(cx, cy, r) {
        (0, _helper.ellipse)(this, cx, cy, r, r);
        this._curPath.complex = false;
      }
    }, {
      key: "rect",
      value: function rect(x, y, w, h) {
        this.moveTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x + w, y + h);
        this.lineTo(x, y + h);
        this.close();
        this._curPath.complex = false;
      }
    }, {
      key: "roundRect",
      value: function roundRect(x, y, w, h, r) {
        (0, _helper.roundRect)(this, x, y, w, h, r);
        this._curPath.complex = false;
      }
    }, {
      key: "clear",
      value: function clear() {
        var clean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        this.pathLength = 0;
        this.pathOffset = 0;
        this.pointsOffset = 0;
        this.dataOffset = 0;
        this._curPath = null;
        this.paths.length = 0;
        this._points.length = 0;
        var dataList = this._renderDataList;

        for (var i = 0, l = dataList.length; i < l; i++) {
          var data = dataList[i];

          if (!data) {
            continue;
          }

          data.reset();
        }

        this._renderDataList.length = 0;

        if (clean) {
          this._renderDataPool.reset();
        }
      }
    }, {
      key: "close",
      value: function close() {
        this._curPath.closed = true;
      }
    }, {
      key: "requestRenderData",
      value: function requestRenderData() {
        var renderData = this._renderDataPool.add();

        this._renderDataList.push(renderData);

        return renderData;
      }
    }, {
      key: "getRenderData",
      value: function getRenderData() {
        if (this._renderDataList.length === 0) {
          this.requestRenderData();
        }

        return this._renderDataList;
      }
    }, {
      key: "addPoint",
      value: function addPoint(x, y, flags) {
        var path = this._curPath;

        if (!path) {
          return;
        }

        var points = this._points;
        var pathPoints = path.points;
        var offset = this.pointsOffset++;
        var pt = points[offset];

        if (!pt) {
          pt = new Point(x, y);
          points.push(pt);
        } else {
          pt.x = x;
          pt.y = y;
        }

        pt.flags = flags;
        pathPoints.push(pt);
      }
    }, {
      key: "_addPath",
      value: function _addPath() {
        var offset = this.pathLength;
        var path = this.paths[offset];

        if (!path) {
          path = new Path();
          this.paths.push(path);
        } else {
          path.reset();
        }

        this.pathLength++;
        this._curPath = path;
        return path;
      }
    }]);

    return Impl;
  }();

  _exports.Impl = Impl;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2Fzc2VtYmxlci9ncmFwaGljcy93ZWJnbC9pbXBsLnRzIl0sIm5hbWVzIjpbIlBvaW50IiwieCIsInkiLCJkeCIsImR5IiwiZG14IiwiZG15IiwiZmxhZ3MiLCJsZW4iLCJyZXNldCIsIlZlYzIiLCJQYXRoIiwiY2xvc2VkIiwiYmV2ZWwiLCJjb21wbGV4IiwicG9pbnRzIiwibGVuZ3RoIiwiSW1wbCIsImRhdGFPZmZzZXQiLCJ1cGRhdGVQYXRoT2Zmc2V0IiwicGF0aExlbmd0aCIsInBhdGhPZmZzZXQiLCJwYXRocyIsInRlc3NUb2wiLCJkaXN0VG9sIiwiZmlsbENvbG9yIiwiQ29sb3IiLCJXSElURSIsImNsb25lIiwibGluZUNhcCIsIkxpbmVDYXAiLCJCVVRUIiwic3Ryb2tlQ29sb3IiLCJCTEFDSyIsImxpbmVKb2luIiwiTGluZUpvaW4iLCJNSVRFUiIsImxpbmVXaWR0aCIsInBvaW50c09mZnNldCIsIl9jb21tYW5kWCIsIl9jb21tYW5kWSIsIl9wb2ludHMiLCJfcmVuZGVyRGF0YVBvb2wiLCJSZWN5Y2xlUG9vbCIsIk1lc2hSZW5kZXJEYXRhIiwiX3JlbmRlckRhdGFMaXN0IiwiX2N1clBhdGgiLCJfYWRkUGF0aCIsImFkZFBvaW50IiwiUG9pbnRGbGFncyIsIlBUX0NPUk5FUiIsImMxeCIsImMxeSIsImMyeCIsImMyeSIsInBhdGgiLCJsYXN0IiwibGluZVRvIiwiY3giLCJjeSIsIngwIiwieTAiLCJiZXppZXJDdXJ2ZVRvIiwiciIsInN0YXJ0QW5nbGUiLCJlbmRBbmdsZSIsImNvdW50ZXJjbG9ja3dpc2UiLCJyeCIsInJ5IiwidyIsImgiLCJtb3ZlVG8iLCJjbG9zZSIsImNsZWFuIiwiZGF0YUxpc3QiLCJpIiwibCIsImRhdGEiLCJyZW5kZXJEYXRhIiwiYWRkIiwicHVzaCIsInJlcXVlc3RSZW5kZXJEYXRhIiwicGF0aFBvaW50cyIsIm9mZnNldCIsInB0Il0sIm1hcHBpbmdz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QUFJLENBQUM1QixJQUFMLEVBQVc7QUFDUEEsVUFBQUEsSUFBSSxHQUFHLElBQUk1QyxJQUFKLEVBQVA7QUFFQSxlQUFLVyxLQUFMLENBQVcwRCxJQUFYLENBQWdCekIsSUFBaEI7QUFDSCxTQUpELE1BSU87QUFDSEEsVUFBQUEsSUFBSSxDQUFDOUMsS0FBTDtBQUNIOztBQUVELGFBQUtXLFVBQUw7QUFDQSxhQUFLMEIsUUFBTCxHQUFnQlMsSUFBaEI7QUFFQSxlQUFPQSxJQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgQ29sb3IsIFZlYzIgfSBmcm9tICcuLi8uLi8uLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBSZWN5Y2xlUG9vbCB9IGZyb20gJy4uLy4uLy4uLy4uL2NvcmUvbWVtb3AnO1xyXG5pbXBvcnQgeyBNZXNoUmVuZGVyRGF0YSB9IGZyb20gJy4uLy4uLy4uLy4uL2NvcmUvcmVuZGVyZXIvdWkvcmVuZGVyLWRhdGEnO1xyXG5pbXBvcnQgeyBhcmMsIGVsbGlwc2UsIHJvdW5kUmVjdCwgdGVzc2VsYXRlQmV6aWVyIH0gZnJvbSAnLi4vaGVscGVyJztcclxuaW1wb3J0IHsgTGluZUNhcCwgTGluZUpvaW4sIFBvaW50RmxhZ3N9IGZyb20gJy4uL3R5cGVzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBQb2ludCBleHRlbmRzIFZlYzIge1xyXG4gICAgcHVibGljIGR4ID0gMDtcclxuICAgIHB1YmxpYyBkeSA9IDA7XHJcbiAgICBwdWJsaWMgZG14ID0gMDtcclxuICAgIHB1YmxpYyBkbXkgPSAwO1xyXG4gICAgcHVibGljIGZsYWdzID0gMDtcclxuICAgIHB1YmxpYyBsZW4gPSAwO1xyXG4gICAgY29uc3RydWN0b3IgKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIoeCwgeSk7XHJcbiAgICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXNldCAoKSB7XHJcbiAgICAgICAgdGhpcy5keCA9IDA7XHJcbiAgICAgICAgdGhpcy5keSA9IDA7XHJcbiAgICAgICAgdGhpcy5kbXggPSAwO1xyXG4gICAgICAgIHRoaXMuZG15ID0gMDtcclxuICAgICAgICB0aGlzLmZsYWdzID0gMDtcclxuICAgICAgICB0aGlzLmxlbiA9IDA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQYXRoIHtcclxuICAgIHB1YmxpYyBjbG9zZWQgPSBmYWxzZTtcclxuICAgIHB1YmxpYyBiZXZlbCA9IDA7XHJcbiAgICBwdWJsaWMgY29tcGxleCA9IHRydWU7XHJcbiAgICBwdWJsaWMgcG9pbnRzOiBQb2ludFtdID0gW107XHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXNldCAoKSB7XHJcbiAgICAgICAgdGhpcy5jbG9zZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmJldmVsID0gMDtcclxuICAgICAgICB0aGlzLmNvbXBsZXggPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wb2ludHMpIHtcclxuICAgICAgICAgICAgdGhpcy5wb2ludHMubGVuZ3RoID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRzID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW1wbCB7XHJcblxyXG4gICAgcHVibGljIGRhdGFPZmZzZXQgPSAwO1xyXG4gICAgcHVibGljIHVwZGF0ZVBhdGhPZmZzZXQgPSBmYWxzZTtcclxuXHJcbiAgICBwdWJsaWMgcGF0aExlbmd0aCA9IDA7XHJcbiAgICBwdWJsaWMgcGF0aE9mZnNldCA9IDA7XHJcblxyXG4gICAgcHVibGljIHBhdGhzOiBQYXRoW10gPSBbXTtcclxuICAgIC8vIGlubmVyIHByb3BlcnRpZXNcclxuICAgIHB1YmxpYyB0ZXNzVG9sID0gMC4yNTtcclxuICAgIHB1YmxpYyBkaXN0VG9sID0gMC4wMTtcclxuICAgIHB1YmxpYyBmaWxsQ29sb3IgPSBDb2xvci5XSElURS5jbG9uZSgpO1xyXG4gICAgcHVibGljIGxpbmVDYXAgPSBMaW5lQ2FwLkJVVFQ7XHJcbiAgICBwdWJsaWMgc3Ryb2tlQ29sb3IgPSBDb2xvci5CTEFDSy5jbG9uZSgpO1xyXG4gICAgcHVibGljIGxpbmVKb2luID0gTGluZUpvaW4uTUlURVI7XHJcbiAgICBwdWJsaWMgbGluZVdpZHRoID0gMDtcclxuXHJcbiAgICBwdWJsaWMgcG9pbnRzT2Zmc2V0ID0gMDtcclxuXHJcbiAgICBwcml2YXRlIF9jb21tYW5kWCA9IDA7XHJcbiAgICBwcml2YXRlIF9jb21tYW5kWSA9IDA7XHJcbiAgICBwcml2YXRlIF9wb2ludHM6IFBvaW50W10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIF9yZW5kZXJEYXRhUG9vbDogUmVjeWNsZVBvb2w8TWVzaFJlbmRlckRhdGE+ID0gbmV3IFJlY3ljbGVQb29sKCgpID0+ICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNZXNoUmVuZGVyRGF0YSgpO1xyXG4gICAgfSwgMTYpO1xyXG4gICAgcHJpdmF0ZSBfcmVuZGVyRGF0YUxpc3Q6IE1lc2hSZW5kZXJEYXRhW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIF9jdXJQYXRoOiBQYXRoIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIG1vdmVUbyAoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy51cGRhdGVQYXRoT2Zmc2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMucGF0aE9mZnNldCA9IHRoaXMucGF0aExlbmd0aDtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQYXRoT2Zmc2V0ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9hZGRQYXRoKCk7XHJcbiAgICAgICAgdGhpcy5hZGRQb2ludCh4LCB5LCBQb2ludEZsYWdzLlBUX0NPUk5FUik7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbW1hbmRYID0geDtcclxuICAgICAgICB0aGlzLl9jb21tYW5kWSA9IHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxpbmVUbyAoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmFkZFBvaW50KHgsIHksIFBvaW50RmxhZ3MuUFRfQ09STkVSKTtcclxuXHJcbiAgICAgICAgdGhpcy5fY29tbWFuZFggPSB4O1xyXG4gICAgICAgIHRoaXMuX2NvbW1hbmRZID0geTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmV6aWVyQ3VydmVUbyAoYzF4OiBudW1iZXIsIGMxeTogbnVtYmVyLCBjMng6IG51bWJlciwgYzJ5OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuX2N1clBhdGghO1xyXG4gICAgICAgIGNvbnN0IGxhc3QgPSBwYXRoLnBvaW50c1twYXRoLnBvaW50cy5sZW5ndGggLSAxXTtcclxuICAgICAgICBpZiAoIWxhc3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGxhc3QueCA9PT0gYzF4ICYmIGxhc3QueSA9PT0gYzF5ICYmIGMyeCA9PT0geCAmJiBjMnkgPT09IHkpIHtcclxuICAgICAgICAgICAgdGhpcy5saW5lVG8oeCwgeSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRlc3NlbGF0ZUJlemllcih0aGlzLCBsYXN0LngsIGxhc3QueSwgYzF4LCBjMXksIGMyeCwgYzJ5LCB4LCB5LCAwLCBQb2ludEZsYWdzLlBUX0NPUk5FUik7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbW1hbmRYID0geDtcclxuICAgICAgICB0aGlzLl9jb21tYW5kWSA9IHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHF1YWRyYXRpY0N1cnZlVG8gKGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgeDAgPSB0aGlzLl9jb21tYW5kWDtcclxuICAgICAgICBjb25zdCB5MCA9IHRoaXMuX2NvbW1hbmRZO1xyXG4gICAgICAgIHRoaXMuYmV6aWVyQ3VydmVUbyh4MCArIDIuMCAvIDMuMCAqIChjeCAtIHgwKSwgeTAgKyAyLjAgLyAzLjAgKiAoY3kgLSB5MCksIHggKyAyLjAgLyAzLjAgKiAoY3ggLSB4KSwgeSArIDIuMCAvIDMuMCAqIChjeSAtIHkpLCB4LCB5KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXJjIChjeDogbnVtYmVyLCBjeTogbnVtYmVyLCByOiBudW1iZXIsIHN0YXJ0QW5nbGU6IG51bWJlciwgZW5kQW5nbGU6IG51bWJlciwgY291bnRlcmNsb2Nrd2lzZTogYm9vbGVhbikge1xyXG4gICAgICAgIGFyYyh0aGlzLCBjeCwgY3ksIHIsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCBjb3VudGVyY2xvY2t3aXNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZWxsaXBzZSAoY3g6IG51bWJlciwgY3k6IG51bWJlciwgcng6IG51bWJlciwgcnk6IG51bWJlcikge1xyXG4gICAgICAgIGVsbGlwc2UodGhpcywgY3gsIGN5LCByeCwgcnkpO1xyXG4gICAgICAgIHRoaXMuX2N1clBhdGghLmNvbXBsZXggPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2lyY2xlIChjeDogbnVtYmVyLCBjeTogbnVtYmVyLCByOiBudW1iZXIpIHtcclxuICAgICAgICBlbGxpcHNlKHRoaXMsIGN4LCBjeSwgciwgcik7XHJcbiAgICAgICAgdGhpcy5fY3VyUGF0aCEuY29tcGxleCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWN0ICh4OiBudW1iZXIsIHk6IG51bWJlciwgdzogbnVtYmVyLCBoOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLm1vdmVUbyh4LCB5KTtcclxuICAgICAgICB0aGlzLmxpbmVUbyh4ICsgdywgeSk7XHJcbiAgICAgICAgdGhpcy5saW5lVG8oeCArIHcsIHkgKyBoKTtcclxuICAgICAgICB0aGlzLmxpbmVUbyh4LCB5ICsgaCk7XHJcblxyXG4gICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICB0aGlzLl9jdXJQYXRoIS5jb21wbGV4ID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJvdW5kUmVjdCAoeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyLCByOiBudW1iZXIpIHtcclxuICAgICAgICByb3VuZFJlY3QodGhpcywgeCwgeSwgdywgaCwgcik7XHJcbiAgICAgICAgdGhpcy5fY3VyUGF0aCEuY29tcGxleCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhciAoY2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgIHRoaXMucGF0aExlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5wYXRoT2Zmc2V0ID0gMDtcclxuICAgICAgICB0aGlzLnBvaW50c09mZnNldCA9IDA7XHJcbiAgICAgICAgdGhpcy5kYXRhT2Zmc2V0ID0gMDtcclxuICAgICAgICB0aGlzLl9jdXJQYXRoID0gbnVsbDtcclxuICAgICAgICB0aGlzLnBhdGhzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5fcG9pbnRzLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGFMaXN0ID0gdGhpcy5fcmVuZGVyRGF0YUxpc3Q7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBkYXRhTGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGRhdGFMaXN0W2ldO1xyXG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkYXRhLnJlc2V0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9yZW5kZXJEYXRhTGlzdC5sZW5ndGggPSAwO1xyXG4gICAgICAgIGlmIChjbGVhbikge1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJEYXRhUG9vbC5yZXNldCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvc2UgKCkge1xyXG4gICAgICAgIHRoaXMuX2N1clBhdGghLmNsb3NlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlcXVlc3RSZW5kZXJEYXRhICgpIHtcclxuICAgICAgICBjb25zdCByZW5kZXJEYXRhID0gdGhpcy5fcmVuZGVyRGF0YVBvb2wuYWRkKCk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyRGF0YUxpc3QucHVzaChyZW5kZXJEYXRhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlbmRlckRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFJlbmRlckRhdGEgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9yZW5kZXJEYXRhTGlzdC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0UmVuZGVyRGF0YSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlckRhdGFMaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRQb2ludCAoeDogbnVtYmVyLCB5OiBudW1iZXIsIGZsYWdzOiBQb2ludEZsYWdzKSB7XHJcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuX2N1clBhdGg7XHJcbiAgICAgICAgaWYgKCFwYXRoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBvaW50cyA9IHRoaXMuX3BvaW50cztcclxuICAgICAgICBjb25zdCBwYXRoUG9pbnRzID0gcGF0aC5wb2ludHM7XHJcblxyXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHRoaXMucG9pbnRzT2Zmc2V0Kys7XHJcbiAgICAgICAgbGV0IHB0OiBQb2ludCA9IHBvaW50c1tvZmZzZXRdO1xyXG5cclxuICAgICAgICBpZiAoIXB0KSB7XHJcbiAgICAgICAgICAgIHB0ID0gbmV3IFBvaW50KHgsIHkpO1xyXG4gICAgICAgICAgICBwb2ludHMucHVzaChwdCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcHQueCA9IHg7XHJcbiAgICAgICAgICAgIHB0LnkgPSB5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHQuZmxhZ3MgPSBmbGFncztcclxuICAgICAgICBwYXRoUG9pbnRzLnB1c2gocHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2FkZFBhdGggKCkge1xyXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHRoaXMucGF0aExlbmd0aDtcclxuICAgICAgICBsZXQgcGF0aCA9IHRoaXMucGF0aHNbb2Zmc2V0XTtcclxuXHJcbiAgICAgICAgaWYgKCFwYXRoKSB7XHJcbiAgICAgICAgICAgIHBhdGggPSBuZXcgUGF0aCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wYXRocy5wdXNoKHBhdGgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHBhdGgucmVzZXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGF0aExlbmd0aCsrO1xyXG4gICAgICAgIHRoaXMuX2N1clBhdGggPSBwYXRoO1xyXG5cclxuICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgIH1cclxufVxyXG4iXX0=