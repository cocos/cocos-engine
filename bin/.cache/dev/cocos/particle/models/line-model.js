(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/assets/mesh.js", "../../core/gfx/buffer.js", "../../core/gfx/define.js", "../../core/math/index.js", "../../core/renderer/index.js", "../../core/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/assets/mesh.js"), require("../../core/gfx/buffer.js"), require("../../core/gfx/define.js"), require("../../core/math/index.js"), require("../../core/renderer/index.js"), require("../../core/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.mesh, global.buffer, global.define, global.index, global.index, global.index);
    global.lineModel = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _mesh, _buffer, _define, _index, _index2, _index3) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.LineModel = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var _vertex_attrs = [new _index3.GFXAttribute(_define.GFXAttributeName.ATTR_POSITION, _define.GFXFormat.RGB32F), // xyz:position
  new _index3.GFXAttribute(_define.GFXAttributeName.ATTR_TEX_COORD, _define.GFXFormat.RGBA32F), // x:index y:size zw:texcoord
  new _index3.GFXAttribute(_define.GFXAttributeName.ATTR_TEX_COORD1, _define.GFXFormat.RGB32F), // xyz:velocity
  new _index3.GFXAttribute(_define.GFXAttributeName.ATTR_COLOR, _define.GFXFormat.RGBA8, true)];

  var _temp_v1 = new _index.Vec3();

  var _temp_v2 = new _index.Vec3();

  var LineModel = /*#__PURE__*/function (_scene$Model) {
    _inherits(LineModel, _scene$Model);

    function LineModel() {
      var _this;

      _classCallCheck(this, LineModel);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(LineModel).call(this));
      _this._capacity = void 0;
      _this._vertSize = 0;
      _this._vBuffer = null;
      _this._vertAttrsFloatCount = 0;
      _this._vdataF32 = null;
      _this._vdataUint32 = null;
      _this._iaInfo = void 0;
      _this._iaInfoBuffer = void 0;
      _this._subMeshData = null;
      _this._vertCount = 0;
      _this._indexCount = 0;
      _this._material = null;
      _this.type = _index2.scene.ModelType.LINE;
      _this._capacity = 100;
      _this._iaInfo = new _buffer.GFXIndirectBuffer([new _index3.GFXDrawInfo()]);
      _this._iaInfoBuffer = _this._device.createBuffer(new _index3.GFXBufferInfo(_define.GFXBufferUsageBit.INDIRECT, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, _buffer.GFX_DRAW_INFO_SIZE, _buffer.GFX_DRAW_INFO_SIZE));
      return _this;
    }

    _createClass(LineModel, [{
      key: "setCapacity",
      value: function setCapacity(capacity) {
        this._capacity = capacity;
        this.createBuffer();
      }
    }, {
      key: "createBuffer",
      value: function createBuffer() {
        this._vertSize = 0;

        var _iterator = _createForOfIteratorHelper(_vertex_attrs),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var a = _step.value;
            a.offset = this._vertSize;
            this._vertSize += _define.GFXFormatInfos[a.format].size;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        this._vertAttrsFloatCount = this._vertSize / 4; // number of float

        this._vBuffer = this.createSubMeshData();
        this._vdataF32 = new Float32Array(this._vBuffer);
        this._vdataUint32 = new Uint32Array(this._vBuffer);
      }
    }, {
      key: "updateMaterial",
      value: function updateMaterial(mat) {
        this._material = mat;

        _get(_getPrototypeOf(LineModel.prototype), "setSubModelMaterial", this).call(this, 0, mat);
      }
    }, {
      key: "createSubMeshData",
      value: function createSubMeshData() {
        if (this._subMeshData) {
          this.destroySubMeshData();
        }

        this._vertCount = 2;
        this._indexCount = 6;

        var vertexBuffer = this._device.createBuffer(new _index3.GFXBufferInfo(_define.GFXBufferUsageBit.VERTEX | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, this._vertSize * this._capacity * this._vertCount, this._vertSize));

        var vBuffer = new ArrayBuffer(this._vertSize * this._capacity * this._vertCount);
        vertexBuffer.update(vBuffer);
        var indices = new Uint16Array((this._capacity - 1) * this._indexCount);
        var dst = 0;

        for (var i = 0; i < this._capacity - 1; ++i) {
          var baseIdx = 2 * i;
          indices[dst++] = baseIdx;
          indices[dst++] = baseIdx + 1;
          indices[dst++] = baseIdx + 2;
          indices[dst++] = baseIdx + 3;
          indices[dst++] = baseIdx + 2;
          indices[dst++] = baseIdx + 1;
        }

        var indexBuffer = this._device.createBuffer(new _index3.GFXBufferInfo(_define.GFXBufferUsageBit.INDEX | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, (this._capacity - 1) * this._indexCount * Uint16Array.BYTES_PER_ELEMENT, Uint16Array.BYTES_PER_ELEMENT));

        indexBuffer.update(indices);
        this._iaInfo.drawInfos[0].vertexCount = this._capacity * this._vertCount;
        this._iaInfo.drawInfos[0].indexCount = (this._capacity - 1) * this._indexCount;

        this._iaInfoBuffer.update(this._iaInfo);

        this._subMeshData = new _mesh.RenderingSubMesh([vertexBuffer], _vertex_attrs, _define.GFXPrimitiveMode.TRIANGLE_LIST, indexBuffer, this._iaInfoBuffer);
        this.initSubModel(0, this._subMeshData, this._material);
        return vBuffer;
      }
    }, {
      key: "addLineVertexData",
      value: function addLineVertexData(positions, width, color) {
        if (positions.length > 1) {
          var offset = 0;

          _index.Vec3.subtract(_temp_v1, positions[1], positions[0]);

          this._vdataF32[offset++] = positions[0].x;
          this._vdataF32[offset++] = positions[0].y;
          this._vdataF32[offset++] = positions[0].z;
          this._vdataF32[offset++] = 0;
          this._vdataF32[offset++] = width.evaluate(0, 1);
          this._vdataF32[offset++] = 0;
          this._vdataF32[offset++] = 0;
          this._vdataF32[offset++] = _temp_v1.x;
          this._vdataF32[offset++] = _temp_v1.y;
          this._vdataF32[offset++] = _temp_v1.z;
          this._vdataUint32[offset++] = color.evaluate(0, 1)._val;
          this._vdataF32[offset++] = positions[0].x;
          this._vdataF32[offset++] = positions[0].y;
          this._vdataF32[offset++] = positions[0].z;
          this._vdataF32[offset++] = 1;
          this._vdataF32[offset++] = width.evaluate(0, 1);
          this._vdataF32[offset++] = 0;
          this._vdataF32[offset++] = 1;
          this._vdataF32[offset++] = _temp_v1.x;
          this._vdataF32[offset++] = _temp_v1.y;
          this._vdataF32[offset++] = _temp_v1.z;
          this._vdataUint32[offset++] = color.evaluate(0, 1)._val;

          for (var i = 1; i < positions.length - 1; i++) {
            _index.Vec3.subtract(_temp_v1, positions[i - 1], positions[i]);

            _index.Vec3.subtract(_temp_v2, positions[i + 1], positions[i]);

            _index.Vec3.subtract(_temp_v2, _temp_v2, _temp_v1);

            var seg = i / positions.length;
            this._vdataF32[offset++] = positions[i].x;
            this._vdataF32[offset++] = positions[i].y;
            this._vdataF32[offset++] = positions[i].z;
            this._vdataF32[offset++] = 0;
            this._vdataF32[offset++] = width.evaluate(seg, 1);
            this._vdataF32[offset++] = seg;
            this._vdataF32[offset++] = 0;
            this._vdataF32[offset++] = _temp_v2.x;
            this._vdataF32[offset++] = _temp_v2.y;
            this._vdataF32[offset++] = _temp_v2.z;
            this._vdataUint32[offset++] = color.evaluate(seg, 1)._val;
            this._vdataF32[offset++] = positions[i].x;
            this._vdataF32[offset++] = positions[i].y;
            this._vdataF32[offset++] = positions[i].z;
            this._vdataF32[offset++] = 1;
            this._vdataF32[offset++] = width.evaluate(seg, 1);
            this._vdataF32[offset++] = seg;
            this._vdataF32[offset++] = 1;
            this._vdataF32[offset++] = _temp_v2.x;
            this._vdataF32[offset++] = _temp_v2.y;
            this._vdataF32[offset++] = _temp_v2.z;
            this._vdataUint32[offset++] = color.evaluate(seg, 1)._val;
          }

          _index.Vec3.subtract(_temp_v1, positions[positions.length - 1], positions[positions.length - 2]);

          this._vdataF32[offset++] = positions[positions.length - 1].x;
          this._vdataF32[offset++] = positions[positions.length - 1].y;
          this._vdataF32[offset++] = positions[positions.length - 1].z;
          this._vdataF32[offset++] = 0;
          this._vdataF32[offset++] = width.evaluate(1, 1);
          this._vdataF32[offset++] = 1;
          this._vdataF32[offset++] = 0;
          this._vdataF32[offset++] = _temp_v1.x;
          this._vdataF32[offset++] = _temp_v1.y;
          this._vdataF32[offset++] = _temp_v1.z;
          this._vdataUint32[offset++] = color.evaluate(1, 1)._val;
          this._vdataF32[offset++] = positions[positions.length - 1].x;
          this._vdataF32[offset++] = positions[positions.length - 1].y;
          this._vdataF32[offset++] = positions[positions.length - 1].z;
          this._vdataF32[offset++] = 1;
          this._vdataF32[offset++] = width.evaluate(1, 1);
          this._vdataF32[offset++] = 1;
          this._vdataF32[offset++] = 1;
          this._vdataF32[offset++] = _temp_v1.x;
          this._vdataF32[offset++] = _temp_v1.y;
          this._vdataF32[offset++] = _temp_v1.z;
          this._vdataUint32[offset++] = color.evaluate(1, 1)._val;
        }

        this.updateIA(Math.max(0, positions.length - 1));
      }
    }, {
      key: "updateIA",
      value: function updateIA(count) {
        var ia = this._subModels[0].inputAssembler;
        ia.vertexBuffers[0].update(this._vdataF32);
        this._iaInfo.drawInfos[0].firstIndex = 0;
        this._iaInfo.drawInfos[0].indexCount = this._indexCount * count;

        this._iaInfoBuffer.update(this._iaInfo);
      }
    }, {
      key: "destroySubMeshData",
      value: function destroySubMeshData() {
        if (this._subMeshData) {
          this._subMeshData.destroy();

          this._subMeshData = null;
        }
      }
    }]);

    return LineModel;
  }(_index2.scene.Model);

  _exports.LineModel = LineModel;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL21vZGVscy9saW5lLW1vZGVsLnRzIl0sIm5hbWVzIjpbIl92ZXJ0ZXhfYXR0cnMiLCJHRlhBdHRyaWJ1dGUiLCJHRlhBdHRyaWJ1dGVOYW1lIiwiQVRUUl9QT1NJVElPTiIsIkdGWEZvcm1hdCIsIlJHQjMyRiIsIkFUVFJfVEVYX0NPT1JEIiwiUkdCQTMyRiIsIkFUVFJfVEVYX0NPT1JEMSIsIkFUVFJfQ09MT1IiLCJSR0JBOCIsIl90ZW1wX3YxIiwiVmVjMyIsIl90ZW1wX3YyIiwiTGluZU1vZGVsIiwiX2NhcGFjaXR5IiwiX3ZlcnRTaXplIiwiX3ZCdWZmZXIiLCJfdmVydEF0dHJzRmxvYXRDb3VudCIsIl92ZGF0YUYzMiIsIl92ZGF0YVVpbnQzMiIsIl9pYUluZm8iLCJfaWFJbmZvQnVmZmVyIiwiX3N1Yk1lc2hEYXRhIiwiX3ZlcnRDb3VudCIsIl9pbmRleENvdW50IiwiX21hdGVyaWFsIiwidHlwZSIsInNjZW5lIiwiTW9kZWxUeXBlIiwiTElORSIsIkdGWEluZGlyZWN0QnVmZmVyIiwiR0ZYRHJhd0luZm8iLCJfZGV2aWNlIiwiY3JlYXRlQnVmZmVyIiwiR0ZYQnVmZmVySW5mbyIsIkdGWEJ1ZmZlclVzYWdlQml0IiwiSU5ESVJFQ1QiLCJHRlhNZW1vcnlVc2FnZUJpdCIsIkhPU1QiLCJERVZJQ0UiLCJHRlhfRFJBV19JTkZPX1NJWkUiLCJjYXBhY2l0eSIsImEiLCJvZmZzZXQiLCJHRlhGb3JtYXRJbmZvcyIsImZvcm1hdCIsInNpemUiLCJjcmVhdGVTdWJNZXNoRGF0YSIsIkZsb2F0MzJBcnJheSIsIlVpbnQzMkFycmF5IiwibWF0IiwiZGVzdHJveVN1Yk1lc2hEYXRhIiwidmVydGV4QnVmZmVyIiwiVkVSVEVYIiwiVFJBTlNGRVJfRFNUIiwidkJ1ZmZlciIsIkFycmF5QnVmZmVyIiwidXBkYXRlIiwiaW5kaWNlcyIsIlVpbnQxNkFycmF5IiwiZHN0IiwiaSIsImJhc2VJZHgiLCJpbmRleEJ1ZmZlciIsIklOREVYIiwiQllURVNfUEVSX0VMRU1FTlQiLCJkcmF3SW5mb3MiLCJ2ZXJ0ZXhDb3VudCIsImluZGV4Q291bnQiLCJSZW5kZXJpbmdTdWJNZXNoIiwiR0ZYUHJpbWl0aXZlTW9kZSIsIlRSSUFOR0xFX0xJU1QiLCJpbml0U3ViTW9kZWwiLCJwb3NpdGlvbnMiLCJ3aWR0aCIsImNvbG9yIiwibGVuZ3RoIiwic3VidHJhY3QiLCJ4IiwieSIsInoiLCJldmFsdWF0ZSIsIl92YWwiLCJzZWciLCJ1cGRhdGVJQSIsIk1hdGgiLCJtYXgiLCJjb3VudCIsImlhIiwiX3N1Yk1vZGVscyIsImlucHV0QXNzZW1ibGVyIiwidmVydGV4QnVmZmVycyIsImZpcnN0SW5kZXgiLCJkZXN0cm95IiwiTW9kZWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWNBLE1BQU1BLGFBQWEsR0FBRyxDQUNsQixJQUFJQyxvQkFBSixDQUFpQkMseUJBQWlCQyxhQUFsQyxFQUFpREMsa0JBQVVDLE1BQTNELENBRGtCLEVBQ2tEO0FBQ3BFLE1BQUlKLG9CQUFKLENBQWlCQyx5QkFBaUJJLGNBQWxDLEVBQWtERixrQkFBVUcsT0FBNUQsQ0FGa0IsRUFFb0Q7QUFDdEUsTUFBSU4sb0JBQUosQ0FBaUJDLHlCQUFpQk0sZUFBbEMsRUFBbURKLGtCQUFVQyxNQUE3RCxDQUhrQixFQUdvRDtBQUN0RSxNQUFJSixvQkFBSixDQUFpQkMseUJBQWlCTyxVQUFsQyxFQUE4Q0wsa0JBQVVNLEtBQXhELEVBQStELElBQS9ELENBSmtCLENBQXRCOztBQU9BLE1BQU1DLFFBQVEsR0FBRyxJQUFJQyxXQUFKLEVBQWpCOztBQUNBLE1BQU1DLFFBQVEsR0FBRyxJQUFJRCxXQUFKLEVBQWpCOztNQUVhRSxTOzs7QUFlVCx5QkFBZTtBQUFBOztBQUFBOztBQUNYO0FBRFcsWUFiUEMsU0FhTztBQUFBLFlBWlBDLFNBWU8sR0FaYSxDQVliO0FBQUEsWUFYUEMs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QSxlQUFLdkUsWUFBTCxHQUFvQixJQUFwQjtBQUNIO0FBQ0o7Ozs7SUE3TDBCSyxjQUFNbUUsSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgUmVuZGVyaW5nU3ViTWVzaCB9IGZyb20gJy4uLy4uL2NvcmUvYXNzZXRzL21lc2gnO1xyXG5pbXBvcnQgeyBHRlhfRFJBV19JTkZPX1NJWkUsIEdGWEJ1ZmZlciwgR0ZYSW5kaXJlY3RCdWZmZXIgfSBmcm9tICcuLi8uLi9jb3JlL2dmeC9idWZmZXInO1xyXG5pbXBvcnQgeyBHRlhBdHRyaWJ1dGVOYW1lLCBHRlhCdWZmZXJVc2FnZUJpdCwgR0ZYRm9ybWF0LCBHRlhGb3JtYXRJbmZvcywgR0ZYTWVtb3J5VXNhZ2VCaXQsIEdGWFByaW1pdGl2ZU1vZGUgfSBmcm9tICcuLi8uLi9jb3JlL2dmeC9kZWZpbmUnO1xyXG5pbXBvcnQgeyBWZWMzIH0gZnJvbSAnLi4vLi4vY29yZS9tYXRoJztcclxuaW1wb3J0IHsgc2NlbmUgfSBmcm9tICcuLi8uLi9jb3JlL3JlbmRlcmVyJztcclxuaW1wb3J0IEN1cnZlUmFuZ2UgZnJvbSAnLi4vYW5pbWF0b3IvY3VydmUtcmFuZ2UnO1xyXG5pbXBvcnQgR3JhZGllbnRSYW5nZSBmcm9tICcuLi9hbmltYXRvci9ncmFkaWVudC1yYW5nZSc7XHJcbmltcG9ydCB7IE1hdGVyaWFsIH0gZnJvbSAnLi4vLi4vY29yZS9hc3NldHMnO1xyXG5pbXBvcnQgeyBHRlhBdHRyaWJ1dGUsIEdGWEJ1ZmZlckluZm8sIEdGWERyYXdJbmZvIH0gZnJvbSAnLi4vLi4vY29yZSc7XHJcblxyXG5jb25zdCBfdmVydGV4X2F0dHJzID0gW1xyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfUE9TSVRJT04sIEdGWEZvcm1hdC5SR0IzMkYpLCAvLyB4eXo6cG9zaXRpb25cclxuICAgIG5ldyBHRlhBdHRyaWJ1dGUoR0ZYQXR0cmlidXRlTmFtZS5BVFRSX1RFWF9DT09SRCwgR0ZYRm9ybWF0LlJHQkEzMkYpLCAvLyB4OmluZGV4IHk6c2l6ZSB6dzp0ZXhjb29yZFxyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfVEVYX0NPT1JEMSwgR0ZYRm9ybWF0LlJHQjMyRiksIC8vIHh5ejp2ZWxvY2l0eVxyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfQ09MT1IsIEdGWEZvcm1hdC5SR0JBOCwgdHJ1ZSksXHJcbl07XHJcblxyXG5jb25zdCBfdGVtcF92MSA9IG5ldyBWZWMzKCk7XHJcbmNvbnN0IF90ZW1wX3YyID0gbmV3IFZlYzMoKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBMaW5lTW9kZWwgZXh0ZW5kcyBzY2VuZS5Nb2RlbCB7XHJcblxyXG4gICAgcHJpdmF0ZSBfY2FwYWNpdHk6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3ZlcnRTaXplOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfdkJ1ZmZlcjogQXJyYXlCdWZmZXIgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3ZlcnRBdHRyc0Zsb2F0Q291bnQ6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF92ZGF0YUYzMjogRmxvYXQzMkFycmF5IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF92ZGF0YVVpbnQzMjogVWludDMyQXJyYXkgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX2lhSW5mbzogR0ZYSW5kaXJlY3RCdWZmZXI7XHJcbiAgICBwcml2YXRlIF9pYUluZm9CdWZmZXI6IEdGWEJ1ZmZlcjtcclxuICAgIHByaXZhdGUgX3N1Yk1lc2hEYXRhOiBSZW5kZXJpbmdTdWJNZXNoIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF92ZXJ0Q291bnQ6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9pbmRleENvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfbWF0ZXJpYWw6IE1hdGVyaWFsIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy50eXBlID0gc2NlbmUuTW9kZWxUeXBlLkxJTkU7XHJcbiAgICAgICAgdGhpcy5fY2FwYWNpdHkgPSAxMDA7XHJcbiAgICAgICAgdGhpcy5faWFJbmZvID0gbmV3IEdGWEluZGlyZWN0QnVmZmVyKFtuZXcgR0ZYRHJhd0luZm8oKV0pO1xyXG4gICAgICAgIHRoaXMuX2lhSW5mb0J1ZmZlciA9IHRoaXMuX2RldmljZS5jcmVhdGVCdWZmZXIobmV3IEdGWEJ1ZmZlckluZm8oXHJcbiAgICAgICAgICAgIEdGWEJ1ZmZlclVzYWdlQml0LklORElSRUNULFxyXG4gICAgICAgICAgICBHRlhNZW1vcnlVc2FnZUJpdC5IT1NUIHwgR0ZYTWVtb3J5VXNhZ2VCaXQuREVWSUNFLFxyXG4gICAgICAgICAgICBHRlhfRFJBV19JTkZPX1NJWkUsXHJcbiAgICAgICAgICAgIEdGWF9EUkFXX0lORk9fU0laRSxcclxuICAgICAgICApKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Q2FwYWNpdHkgKGNhcGFjaXR5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9jYXBhY2l0eSA9IGNhcGFjaXR5O1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZUJ1ZmZlciAoKSB7XHJcbiAgICAgICAgdGhpcy5fdmVydFNpemUgPSAwO1xyXG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBfdmVydGV4X2F0dHJzKSB7XHJcbiAgICAgICAgICAgIChhIGFzIGFueSkub2Zmc2V0ID0gdGhpcy5fdmVydFNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRTaXplICs9IEdGWEZvcm1hdEluZm9zW2EuZm9ybWF0XS5zaXplO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl92ZXJ0QXR0cnNGbG9hdENvdW50ID0gdGhpcy5fdmVydFNpemUgLyA0OyAvLyBudW1iZXIgb2YgZmxvYXRcclxuICAgICAgICB0aGlzLl92QnVmZmVyID0gdGhpcy5jcmVhdGVTdWJNZXNoRGF0YSgpO1xyXG4gICAgICAgIHRoaXMuX3ZkYXRhRjMyID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLl92QnVmZmVyKTtcclxuICAgICAgICB0aGlzLl92ZGF0YVVpbnQzMiA9IG5ldyBVaW50MzJBcnJheSh0aGlzLl92QnVmZmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlTWF0ZXJpYWwgKG1hdDogTWF0ZXJpYWwpIHtcclxuICAgICAgICB0aGlzLl9tYXRlcmlhbCA9IG1hdDtcclxuICAgICAgICBzdXBlci5zZXRTdWJNb2RlbE1hdGVyaWFsKDAsIG1hdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTdWJNZXNoRGF0YSAoKTogQXJyYXlCdWZmZXIge1xyXG4gICAgICAgIGlmICh0aGlzLl9zdWJNZXNoRGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3lTdWJNZXNoRGF0YSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl92ZXJ0Q291bnQgPSAyO1xyXG4gICAgICAgIHRoaXMuX2luZGV4Q291bnQgPSA2O1xyXG4gICAgICAgIGNvbnN0IHZlcnRleEJ1ZmZlciA9IHRoaXMuX2RldmljZS5jcmVhdGVCdWZmZXIobmV3IEdGWEJ1ZmZlckluZm8oXHJcbiAgICAgICAgICAgIEdGWEJ1ZmZlclVzYWdlQml0LlZFUlRFWCB8IEdGWEJ1ZmZlclVzYWdlQml0LlRSQU5TRkVSX0RTVCxcclxuICAgICAgICAgICAgR0ZYTWVtb3J5VXNhZ2VCaXQuSE9TVCB8IEdGWE1lbW9yeVVzYWdlQml0LkRFVklDRSxcclxuICAgICAgICAgICAgdGhpcy5fdmVydFNpemUgKiB0aGlzLl9jYXBhY2l0eSAqIHRoaXMuX3ZlcnRDb3VudCxcclxuICAgICAgICAgICAgdGhpcy5fdmVydFNpemUsXHJcbiAgICAgICAgKSk7XHJcbiAgICAgICAgY29uc3QgdkJ1ZmZlcjogQXJyYXlCdWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIodGhpcy5fdmVydFNpemUgKiB0aGlzLl9jYXBhY2l0eSAqIHRoaXMuX3ZlcnRDb3VudCk7XHJcbiAgICAgICAgdmVydGV4QnVmZmVyLnVwZGF0ZSh2QnVmZmVyKTtcclxuXHJcbiAgICAgICAgY29uc3QgaW5kaWNlczogVWludDE2QXJyYXkgPSBuZXcgVWludDE2QXJyYXkoKHRoaXMuX2NhcGFjaXR5IC0gMSkgKiB0aGlzLl9pbmRleENvdW50KTtcclxuICAgICAgICBsZXQgZHN0ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2NhcGFjaXR5IC0gMTsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJhc2VJZHggPSAyICogaTtcclxuICAgICAgICAgICAgaW5kaWNlc1tkc3QrK10gPSBiYXNlSWR4O1xyXG4gICAgICAgICAgICBpbmRpY2VzW2RzdCsrXSA9IGJhc2VJZHggKyAxO1xyXG4gICAgICAgICAgICBpbmRpY2VzW2RzdCsrXSA9IGJhc2VJZHggKyAyO1xyXG4gICAgICAgICAgICBpbmRpY2VzW2RzdCsrXSA9IGJhc2VJZHggKyAzO1xyXG4gICAgICAgICAgICBpbmRpY2VzW2RzdCsrXSA9IGJhc2VJZHggKyAyO1xyXG4gICAgICAgICAgICBpbmRpY2VzW2RzdCsrXSA9IGJhc2VJZHggKyAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5kZXhCdWZmZXIgPSB0aGlzLl9kZXZpY2UuY3JlYXRlQnVmZmVyKG5ldyBHRlhCdWZmZXJJbmZvKFxyXG4gICAgICAgICAgICBHRlhCdWZmZXJVc2FnZUJpdC5JTkRFWCB8IEdGWEJ1ZmZlclVzYWdlQml0LlRSQU5TRkVSX0RTVCxcclxuICAgICAgICAgICAgR0ZYTWVtb3J5VXNhZ2VCaXQuSE9TVCB8IEdGWE1lbW9yeVVzYWdlQml0LkRFVklDRSxcclxuICAgICAgICAgICAgKHRoaXMuX2NhcGFjaXR5IC0gMSkgKiB0aGlzLl9pbmRleENvdW50ICogVWludDE2QXJyYXkuQllURVNfUEVSX0VMRU1FTlQsXHJcbiAgICAgICAgICAgIFVpbnQxNkFycmF5LkJZVEVTX1BFUl9FTEVNRU5ULFxyXG4gICAgICAgICkpO1xyXG5cclxuICAgICAgICBpbmRleEJ1ZmZlci51cGRhdGUoaW5kaWNlcyk7XHJcblxyXG4gICAgICAgIHRoaXMuX2lhSW5mby5kcmF3SW5mb3NbMF0udmVydGV4Q291bnQgPSB0aGlzLl9jYXBhY2l0eSAqIHRoaXMuX3ZlcnRDb3VudDtcclxuICAgICAgICB0aGlzLl9pYUluZm8uZHJhd0luZm9zWzBdLmluZGV4Q291bnQgPSAodGhpcy5fY2FwYWNpdHkgLSAxKSAqIHRoaXMuX2luZGV4Q291bnQ7XHJcbiAgICAgICAgdGhpcy5faWFJbmZvQnVmZmVyLnVwZGF0ZSh0aGlzLl9pYUluZm8pO1xyXG5cclxuICAgICAgICB0aGlzLl9zdWJNZXNoRGF0YSA9IG5ldyBSZW5kZXJpbmdTdWJNZXNoKFt2ZXJ0ZXhCdWZmZXJdLCBfdmVydGV4X2F0dHJzLCBHRlhQcmltaXRpdmVNb2RlLlRSSUFOR0xFX0xJU1QsIGluZGV4QnVmZmVyLCB0aGlzLl9pYUluZm9CdWZmZXIpO1xyXG4gICAgICAgIHRoaXMuaW5pdFN1Yk1vZGVsKDAsIHRoaXMuX3N1Yk1lc2hEYXRhLCB0aGlzLl9tYXRlcmlhbCEpO1xyXG4gICAgICAgIHJldHVybiB2QnVmZmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRMaW5lVmVydGV4RGF0YSAocG9zaXRpb25zOiBWZWMzW10sIHdpZHRoOiBDdXJ2ZVJhbmdlLCBjb2xvcjogR3JhZGllbnRSYW5nZSkge1xyXG4gICAgICAgIGlmIChwb3NpdGlvbnMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICBsZXQgb2Zmc2V0OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICBWZWMzLnN1YnRyYWN0KF90ZW1wX3YxLCBwb3NpdGlvbnNbMV0sIHBvc2l0aW9uc1swXSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwb3NpdGlvbnNbMF0ueDtcclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHBvc2l0aW9uc1swXS55O1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbb2Zmc2V0KytdID0gcG9zaXRpb25zWzBdLno7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSAwO1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbb2Zmc2V0KytdID0gd2lkdGguZXZhbHVhdGUoMCwgMSkhO1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbb2Zmc2V0KytdID0gMDtcclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBfdGVtcF92MS54O1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbb2Zmc2V0KytdID0gX3RlbXBfdjEueTtcclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IF90ZW1wX3YxLno7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhVWludDMyIVtvZmZzZXQrK10gPSBjb2xvci5ldmFsdWF0ZSgwLCAxKS5fdmFsO1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbb2Zmc2V0KytdID0gcG9zaXRpb25zWzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwb3NpdGlvbnNbMF0ueTtcclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHBvc2l0aW9uc1swXS56O1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbb2Zmc2V0KytdID0gMTtcclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHdpZHRoLmV2YWx1YXRlKDAsIDEpITtcclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSAxO1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbb2Zmc2V0KytdID0gX3RlbXBfdjEueDtcclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IF90ZW1wX3YxLnk7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBfdGVtcF92MS56O1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YVVpbnQzMiFbb2Zmc2V0KytdID0gY29sb3IuZXZhbHVhdGUoMCwgMSkuX3ZhbDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwb3NpdGlvbnMubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBWZWMzLnN1YnRyYWN0KF90ZW1wX3YxLCBwb3NpdGlvbnNbaSAtIDFdLCBwb3NpdGlvbnNbaV0pO1xyXG4gICAgICAgICAgICAgICAgVmVjMy5zdWJ0cmFjdChfdGVtcF92MiwgcG9zaXRpb25zW2kgKyAxXSwgcG9zaXRpb25zW2ldKTtcclxuICAgICAgICAgICAgICAgIFZlYzMuc3VidHJhY3QoX3RlbXBfdjIsIF90ZW1wX3YyLCBfdGVtcF92MSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzZWcgPSBpIC8gcG9zaXRpb25zLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwb3NpdGlvbnNbaV0ueDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwb3NpdGlvbnNbaV0ueTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwb3NpdGlvbnNbaV0uejtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHdpZHRoLmV2YWx1YXRlKHNlZywgMSkhO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHNlZztcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IF90ZW1wX3YyLng7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbb2Zmc2V0KytdID0gX3RlbXBfdjIueTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBfdGVtcF92Mi56O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmRhdGFVaW50MzIhW29mZnNldCsrXSA9IGNvbG9yLmV2YWx1YXRlKHNlZywgMSkuX3ZhbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwb3NpdGlvbnNbaV0ueDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwb3NpdGlvbnNbaV0ueTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwb3NpdGlvbnNbaV0uejtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSAxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHdpZHRoLmV2YWx1YXRlKHNlZywgMSkhO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHNlZztcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSAxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IF90ZW1wX3YyLng7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbb2Zmc2V0KytdID0gX3RlbXBfdjIueTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBfdGVtcF92Mi56O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmRhdGFVaW50MzIhW29mZnNldCsrXSA9IGNvbG9yLmV2YWx1YXRlKHNlZywgMSkuX3ZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBWZWMzLnN1YnRyYWN0KF90ZW1wX3YxLCBwb3NpdGlvbnNbcG9zaXRpb25zLmxlbmd0aCAtIDFdLCBwb3NpdGlvbnNbcG9zaXRpb25zLmxlbmd0aCAtIDJdKTtcclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHBvc2l0aW9uc1twb3NpdGlvbnMubGVuZ3RoIC0gMV0ueDtcclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHBvc2l0aW9uc1twb3NpdGlvbnMubGVuZ3RoIC0gMV0ueTtcclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IHBvc2l0aW9uc1twb3NpdGlvbnMubGVuZ3RoIC0gMV0uejtcclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSB3aWR0aC5ldmFsdWF0ZSgxLCAxKSE7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSAxO1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbb2Zmc2V0KytdID0gMDtcclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IF90ZW1wX3YxLng7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBfdGVtcF92MS55O1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbb2Zmc2V0KytdID0gX3RlbXBfdjEuejtcclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFVaW50MzIhW29mZnNldCsrXSA9IGNvbG9yLmV2YWx1YXRlKDEsIDEpLl92YWw7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwb3NpdGlvbnNbcG9zaXRpb25zLmxlbmd0aCAtIDFdLng7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwb3NpdGlvbnNbcG9zaXRpb25zLmxlbmd0aCAtIDFdLnk7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBwb3NpdGlvbnNbcG9zaXRpb25zLmxlbmd0aCAtIDFdLno7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSAxO1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbb2Zmc2V0KytdID0gd2lkdGguZXZhbHVhdGUoMSwgMSkhO1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbb2Zmc2V0KytdID0gMTtcclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IDE7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhRjMyIVtvZmZzZXQrK10gPSBfdGVtcF92MS54O1xyXG4gICAgICAgICAgICB0aGlzLl92ZGF0YUYzMiFbb2Zmc2V0KytdID0gX3RlbXBfdjEueTtcclxuICAgICAgICAgICAgdGhpcy5fdmRhdGFGMzIhW29mZnNldCsrXSA9IF90ZW1wX3YxLno7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZkYXRhVWludDMyIVtvZmZzZXQrK10gPSBjb2xvci5ldmFsdWF0ZSgxLCAxKS5fdmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZUlBKE1hdGgubWF4KDAsIHBvc2l0aW9ucy5sZW5ndGggLSAxKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZUlBIChjb3VudDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgaWEgPSB0aGlzLl9zdWJNb2RlbHNbMF0uaW5wdXRBc3NlbWJsZXI7XHJcbiAgICAgICAgaWEudmVydGV4QnVmZmVyc1swXS51cGRhdGUodGhpcy5fdmRhdGFGMzIhKTtcclxuICAgICAgICB0aGlzLl9pYUluZm8uZHJhd0luZm9zWzBdLmZpcnN0SW5kZXggPSAwO1xyXG4gICAgICAgIHRoaXMuX2lhSW5mby5kcmF3SW5mb3NbMF0uaW5kZXhDb3VudCA9IHRoaXMuX2luZGV4Q291bnQgKiBjb3VudDtcclxuICAgICAgICB0aGlzLl9pYUluZm9CdWZmZXIudXBkYXRlKHRoaXMuX2lhSW5mbyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXN0cm95U3ViTWVzaERhdGEgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9zdWJNZXNoRGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJNZXNoRGF0YS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1Yk1lc2hEYXRhID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19