(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../decorators/index.js", "../../math/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../decorators/index.js"), require("../../math/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index);
    global.compactValueTypeArray = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.combineStorageUnitElementType = combineStorageUnitElementType;
  _exports.extractStorageUnitElementType = extractStorageUnitElementType;
  _exports.isCompactValueTypeArray = isCompactValueTypeArray;
  _exports.CompactValueTypeArray = _exports.ElementType = _exports.StorageUnit = void 0;

  var _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _class3, _temp, _BuiltinElementTypeTr;

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var StorageUnit;
  _exports.StorageUnit = StorageUnit;

  (function (StorageUnit) {
    StorageUnit[StorageUnit["Uint8"] = 0] = "Uint8";
    StorageUnit[StorageUnit["Uint16"] = 1] = "Uint16";
    StorageUnit[StorageUnit["Uint32"] = 2] = "Uint32";
    StorageUnit[StorageUnit["Int8"] = 3] = "Int8";
    StorageUnit[StorageUnit["Int16"] = 4] = "Int16";
    StorageUnit[StorageUnit["Int32"] = 5] = "Int32";
    StorageUnit[StorageUnit["Float32"] = 6] = "Float32";
    StorageUnit[StorageUnit["Float64"] = 7] = "Float64";
  })(StorageUnit || (_exports.StorageUnit = StorageUnit = {}));

  var ElementType;
  _exports.ElementType = ElementType;

  (function (ElementType) {
    ElementType[ElementType["Scalar"] = 0] = "Scalar";
    ElementType[ElementType["Vec2"] = 1] = "Vec2";
    ElementType[ElementType["Vec3"] = 2] = "Vec3";
    ElementType[ElementType["Vec4"] = 3] = "Vec4";
    ElementType[ElementType["Quat"] = 4] = "Quat";
    ElementType[ElementType["Mat4"] = 5] = "Mat4";
  })(ElementType || (_exports.ElementType = ElementType = {}));

  var elementTypeBits = 3;

  function combineStorageUnitElementType(unit, elementType) {
    return (elementType << elementTypeBits) + unit;
  }

  function extractStorageUnitElementType(combined) {
    return {
      storageUnit: ~(-1 << elementTypeBits) & combined,
      elementType: combined >> elementTypeBits
    };
  }

  var CompactValueTypeArray = (_dec = (0, _index.ccclass)('cc.CompactValueTypeArray'), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function () {
    function CompactValueTypeArray() {
      _classCallCheck(this, CompactValueTypeArray);

      _initializerDefineProperty(this, "_byteOffset", _descriptor, this);

      _initializerDefineProperty(this, "_unitCount", _descriptor2, this);

      _initializerDefineProperty(this, "_unitElement", _descriptor3, this);

      _initializerDefineProperty(this, "_length", _descriptor4, this);
    }

    _createClass(CompactValueTypeArray, [{
      key: "decompress",

      /**
       * Decompresses this CVTA.
       * @param arrayBuffer The buffer this CVTA stored in.
       */
      value: function decompress(arrayBuffer) {
        var _extractStorageUnitEl = extractStorageUnitElementType(this._unitElement),
            storageUnit = _extractStorageUnitEl.storageUnit,
            elementType = _extractStorageUnitEl.elementType;

        var elementTraits = getElementTraits(elementType);
        var storageConstructor = getStorageConstructor(storageUnit);
        var storage = new storageConstructor(arrayBuffer, this._byteOffset, this._unitCount);
        var result = new Array(this._length);

        for (var i = 0; i < this._length; ++i) {
          result[i] = elementTraits.decompress(storage, i);
        }

        return result;
      }
    }], [{
      key: "lengthFor",

      /**
       * Returns the length in bytes that a buffer needs to encode the specified value array in form of CVTA.
       * @param values The value array.
       * @param unit Target element type.
       */
      value: function lengthFor(values, elementType, unit) {
        var elementTraits = getElementTraits(elementType);
        return elementTraits.requiredUnits * values.length * getStorageConstructor(unit).BYTES_PER_ELEMENT;
      }
      /**
       * Compresses the specified value array in form of CVTA into target buffer.
       * @param values The value array.
       * @param unit Target element type.
       * @param arrayBuffer Target buffer.
       * @param byteOffset Offset into target buffer.
       */

    }, {
      key: "compress",
      value: function compress(values, elementType, unit, arrayBuffer, byteOffset, presumedByteOffset) {
        var elementTraits = getElementTraits(elementType);
        var storageConstructor = getStorageConstructor(unit);
        var unitCount = elementTraits.requiredUnits * values.length;
        var storage = new storageConstructor(arrayBuffer, byteOffset, unitCount);

        for (var i = 0; i < values.length; ++i) {
          elementTraits.compress(storage, i, values[i]);
        }

        var result = new CompactValueTypeArray();
        result._unitElement = combineStorageUnitElementType(unit, elementType);
        result._byteOffset = presumedByteOffset;
        result._unitCount = unitCount;
        result._length = values.length;
        return result;
      }
    }]);

    return CompactValueTypeArray;
  }(), _class3.StorageUnit = StorageUnit, _class3.ElementType = ElementType, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_byteOffset", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_unitCount", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_unitElement", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return combineStorageUnitElementType(StorageUnit.Uint8, ElementType.Scalar);
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_length", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  })), _class2)) || _class);
  _exports.CompactValueTypeArray = CompactValueTypeArray;

  function getElementTraits(elementType) {
    return BuiltinElementTypeTraits[elementType];
  }

  function getStorageConstructor(unit) {
    switch (unit) {
      case StorageUnit.Uint8:
        return Uint8Array;

      case StorageUnit.Uint16:
        return Uint16Array;

      case StorageUnit.Uint32:
        return Uint32Array;

      case StorageUnit.Int8:
        return Int8Array;

      case StorageUnit.Int16:
        return Int16Array;

      case StorageUnit.Int32:
        return Int32Array;

      case StorageUnit.Float32:
        return Float32Array;

      case StorageUnit.Float64:
        return Float64Array;
    }
  }

  var BuiltinElementTypeTraits = (_BuiltinElementTypeTr = {}, _defineProperty(_BuiltinElementTypeTr, ElementType.Scalar, {
    requiredUnits: 1,
    compress: function compress(storage, index, value) {
      storage[index] = value;
    },
    decompress: function decompress(storage, index) {
      return storage[index];
    }
  }), _defineProperty(_BuiltinElementTypeTr, ElementType.Vec2, {
    requiredUnits: 2,
    compress: function compress(storage, index, value) {
      storage[index * 2] = value.x;
      storage[index * 2 + 1] = value.y;
    },
    decompress: function decompress(storage, index) {
      return new _index2.Vec3(storage[index * 2], storage[index * 2 + 1]);
    }
  }), _defineProperty(_BuiltinElementTypeTr, ElementType.Vec3, {
    requiredUnits: 3,
    compress: function compress(storage, index, value) {
      storage[index * 3] = value.x;
      storage[index * 3 + 1] = value.y;
      storage[index * 3 + 2] = value.z;
    },
    decompress: function decompress(storage, index) {
      return new _index2.Vec3(storage[index * 3], storage[index * 3 + 1], storage[index * 3 + 2]);
    }
  }), _defineProperty(_BuiltinElementTypeTr, ElementType.Vec4, {
    requiredUnits: 4,
    compress: function compress(storage, index, value) {
      storage[index * 4] = value.x;
      storage[index * 4 + 1] = value.y;
      storage[index * 4 + 2] = value.z;
      storage[index * 4 + 3] = value.w;
    },
    decompress: function decompress(storage, index) {
      return new _index2.Vec4(storage[index * 4], storage[index * 4 + 1], storage[index * 4 + 2], storage[index * 4 + 3]);
    }
  }), _defineProperty(_BuiltinElementTypeTr, ElementType.Quat, {
    requiredUnits: 4,
    compress: function compress(storage, index, value) {
      storage[index * 4] = value.x;
      storage[index * 4 + 1] = value.y;
      storage[index * 4 + 2] = value.z;
      storage[index * 4 + 3] = value.w;
    },
    decompress: function decompress(storage, index) {
      return new _index2.Quat(storage[index * 4], storage[index * 4 + 1], storage[index * 4 + 2], storage[index * 4 + 3]);
    }
  }), _defineProperty(_BuiltinElementTypeTr, ElementType.Mat4, {
    requiredUnits: 16,
    compress: function compress(storage, index, value) {
      _index2.Mat4.toArray(storage, value, index * 16);
    },
    decompress: function decompress(storage, index) {
      return _index2.Mat4.fromArray(new _index2.Mat4(), storage, index * 16);
    }
  }), _BuiltinElementTypeTr);

  function isCompactValueTypeArray(value) {
    return value instanceof CompactValueTypeArray;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS91dGlscy9jb21wYWN0LXZhbHVlLXR5cGUtYXJyYXkudHMiXSwibmFtZXMiOlsiU3RvcmFnZVVuaXQiLCJFbGVtZW50VHlwZSIsImVsZW1lbnRUeXBlQml0cyIsImNvbWJpbmVTdG9yYWdlVW5pdEVsZW1lbnRUeXBlIiwidW5pdCIsImVsZW1lbnRUeXBlIiwiZXh0cmFjdFN0b3JhZ2VVbml0RWxlbWVudFR5cGUiLCJjb21iaW5lZCIsInN0b3JhZ2VVbml0IiwiQ29tcGFjdFZhbHVlVHlwZUFycmF5IiwiYXJyYXlCdWZmZXIiLCJfdW5pdEVsZW1lbnQiLCJlbGVtZW50VHJhaXRzIiwiZ2V0RWxlbWVudFRyYWl0cyIsInN0b3JhZ2VDb25zdHJ1Y3RvciIsImdldFN0b3JhZ2VDb25zdHJ1Y3RvciIsInN0b3JhZ2UiLCJfYnl0ZU9mZnNldCIsIl91bml0Q291bnQiLCJyZXN1bHQiLCJBcnJheSIsIl9sZW5ndGgiLCJpIiwiZGVjb21wcmVzcyIsInZhbHVlcyIsInJlcXVpcmVkVW5pdHMiLCJsZW5ndGgiLCJCWVRFU19QRVJfRUxFTUVOVCIsImJ5dGVPZmZzZXQiLCJwcmVzdW1lZEJ5dGVPZmZzZXQiLCJ1bml0Q291bnQiLCJjb21wcmVzcyIsInNlcmlhbGl6YWJsZSIsIlVpbnQ4IiwiU2NhbGFyIiwiQnVpbHRpbkVsZW1lbnRUeXBlVHJhaXRzIiwiVWludDhBcnJheSIsIlVpbnQxNiIsIlVpbnQxNkFycmF5IiwiVWludDMyIiwiVWludDMyQXJyYXkiLCJJbnQ4IiwiSW50OEFycmF5IiwiSW50MTYiLCJJbnQxNkFycmF5IiwiSW50MzIiLCJJbnQzMkFycmF5IiwiRmxvYXQzMiIsIkZsb2F0MzJBcnJheSIsIkZsb2F0NjQiLCJGbG9hdDY0QXJyYXkiLCJpbmRleCIsInZhbHVlIiwiVmVjMiIsIngiLCJ5IiwiVmVjMyIsInoiLCJWZWM0IiwidyIsIlF1YXQiLCJNYXQ0IiwidG9BcnJheSIs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RUFBK0U7QUFDbEYsV0FBT0EsS0FBSyxZQUFZM0MscUJBQXhCO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjY2NsYXNzLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBWZWMzLCBRdWF0LCBWZWM0LCBWZWMyLCBNYXQ0IH0gZnJvbSAnLi4vLi4vbWF0aCc7XHJcblxyXG5leHBvcnQgZW51bSBTdG9yYWdlVW5pdCB7XHJcbiAgICBVaW50OCwgVWludDE2LCBVaW50MzIsXHJcbiAgICBJbnQ4LCBJbnQxNiwgSW50MzIsXHJcbiAgICBGbG9hdDMyLCBGbG9hdDY0LFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBFbGVtZW50VHlwZSB7XHJcbiAgICBTY2FsYXIsXHJcbiAgICBWZWMyLFxyXG4gICAgVmVjMyxcclxuICAgIFZlYzQsXHJcbiAgICBRdWF0LFxyXG4gICAgTWF0NCxcclxufVxyXG5cclxuY29uc3QgZWxlbWVudFR5cGVCaXRzID0gMztcclxuXHJcbmV4cG9ydCB0eXBlIFN0b3JhZ2VVbml0RWxlbWVudFR5cGUgPSBudW1iZXI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZVN0b3JhZ2VVbml0RWxlbWVudFR5cGUgKHVuaXQ6IFN0b3JhZ2VVbml0LCBlbGVtZW50VHlwZTogRWxlbWVudFR5cGUpIHtcclxuICAgIHJldHVybiAoZWxlbWVudFR5cGUgPDwgZWxlbWVudFR5cGVCaXRzKSArIHVuaXQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0U3RvcmFnZVVuaXRFbGVtZW50VHlwZSAoY29tYmluZWQ6IFN0b3JhZ2VVbml0RWxlbWVudFR5cGUpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc3RvcmFnZVVuaXQ6IH4oLTEgPDwgZWxlbWVudFR5cGVCaXRzKSAmIGNvbWJpbmVkLFxyXG4gICAgICAgIGVsZW1lbnRUeXBlOiBjb21iaW5lZCA+PiBlbGVtZW50VHlwZUJpdHMsXHJcbiAgICB9O1xyXG59XHJcblxyXG5AY2NjbGFzcygnY2MuQ29tcGFjdFZhbHVlVHlwZUFycmF5JylcclxuZXhwb3J0IGNsYXNzIENvbXBhY3RWYWx1ZVR5cGVBcnJheSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIFN0b3JhZ2VVbml0ID0gU3RvcmFnZVVuaXQ7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBFbGVtZW50VHlwZSA9IEVsZW1lbnRUeXBlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogT2Zmc2V0IGludG8gYnVmZmVyLCBpbiBieXRlcy5cclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfYnl0ZU9mZnNldCA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbml0IGNvdW50IHRoaXMgQ1ZUQSBvY2N1cGllcy5cclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfdW5pdENvdW50ID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEVsZW1lbnQgdHlwZSB0aGlzIENWVEEgaG9sZHMuXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX3VuaXRFbGVtZW50ID0gY29tYmluZVN0b3JhZ2VVbml0RWxlbWVudFR5cGUoU3RvcmFnZVVuaXQuVWludDgsIEVsZW1lbnRUeXBlLlNjYWxhcik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFbGVtZW50IGNvdW50IHRoaXMgQ1ZUQSBob2xkcy5cclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfbGVuZ3RoID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGxlbmd0aCBpbiBieXRlcyB0aGF0IGEgYnVmZmVyIG5lZWRzIHRvIGVuY29kZSB0aGUgc3BlY2lmaWVkIHZhbHVlIGFycmF5IGluIGZvcm0gb2YgQ1ZUQS5cclxuICAgICAqIEBwYXJhbSB2YWx1ZXMgVGhlIHZhbHVlIGFycmF5LlxyXG4gICAgICogQHBhcmFtIHVuaXQgVGFyZ2V0IGVsZW1lbnQgdHlwZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBsZW5ndGhGb3IgKHZhbHVlczogYW55W10sIGVsZW1lbnRUeXBlOiBFbGVtZW50VHlwZSwgdW5pdDogU3RvcmFnZVVuaXQpOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGVsZW1lbnRUcmFpdHMgPSBnZXRFbGVtZW50VHJhaXRzKGVsZW1lbnRUeXBlKTtcclxuICAgICAgICByZXR1cm4gZWxlbWVudFRyYWl0cy5yZXF1aXJlZFVuaXRzICogdmFsdWVzLmxlbmd0aCAqIGdldFN0b3JhZ2VDb25zdHJ1Y3Rvcih1bml0KS5CWVRFU19QRVJfRUxFTUVOVDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbXByZXNzZXMgdGhlIHNwZWNpZmllZCB2YWx1ZSBhcnJheSBpbiBmb3JtIG9mIENWVEEgaW50byB0YXJnZXQgYnVmZmVyLlxyXG4gICAgICogQHBhcmFtIHZhbHVlcyBUaGUgdmFsdWUgYXJyYXkuXHJcbiAgICAgKiBAcGFyYW0gdW5pdCBUYXJnZXQgZWxlbWVudCB0eXBlLlxyXG4gICAgICogQHBhcmFtIGFycmF5QnVmZmVyIFRhcmdldCBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0gYnl0ZU9mZnNldCBPZmZzZXQgaW50byB0YXJnZXQgYnVmZmVyLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNvbXByZXNzICh2YWx1ZXM6IGFueVtdLCBlbGVtZW50VHlwZTogRWxlbWVudFR5cGUsIHVuaXQ6IFN0b3JhZ2VVbml0LCBhcnJheUJ1ZmZlcjogQXJyYXlCdWZmZXIsIGJ5dGVPZmZzZXQ6IG51bWJlciwgcHJlc3VtZWRCeXRlT2Zmc2V0OiBudW1iZXIpOiBDb21wYWN0VmFsdWVUeXBlQXJyYXkge1xyXG4gICAgICAgIGNvbnN0IGVsZW1lbnRUcmFpdHMgPSBnZXRFbGVtZW50VHJhaXRzKGVsZW1lbnRUeXBlKTtcclxuICAgICAgICBjb25zdCBzdG9yYWdlQ29uc3RydWN0b3IgPSBnZXRTdG9yYWdlQ29uc3RydWN0b3IodW5pdCk7XHJcbiAgICAgICAgY29uc3QgdW5pdENvdW50ID0gZWxlbWVudFRyYWl0cy5yZXF1aXJlZFVuaXRzICogdmFsdWVzLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBzdG9yYWdlID0gbmV3IHN0b3JhZ2VDb25zdHJ1Y3RvcihhcnJheUJ1ZmZlciwgYnl0ZU9mZnNldCwgdW5pdENvdW50KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBlbGVtZW50VHJhaXRzLmNvbXByZXNzKHN0b3JhZ2UsIGksIHZhbHVlc1tpXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgQ29tcGFjdFZhbHVlVHlwZUFycmF5KCk7XHJcbiAgICAgICAgcmVzdWx0Ll91bml0RWxlbWVudCA9IGNvbWJpbmVTdG9yYWdlVW5pdEVsZW1lbnRUeXBlKHVuaXQsIGVsZW1lbnRUeXBlKTtcclxuICAgICAgICByZXN1bHQuX2J5dGVPZmZzZXQgPSBwcmVzdW1lZEJ5dGVPZmZzZXQ7XHJcbiAgICAgICAgcmVzdWx0Ll91bml0Q291bnQgPSB1bml0Q291bnQ7XHJcbiAgICAgICAgcmVzdWx0Ll9sZW5ndGggPSB2YWx1ZXMubGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWNvbXByZXNzZXMgdGhpcyBDVlRBLlxyXG4gICAgICogQHBhcmFtIGFycmF5QnVmZmVyIFRoZSBidWZmZXIgdGhpcyBDVlRBIHN0b3JlZCBpbi5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGRlY29tcHJlc3M8VD4gKGFycmF5QnVmZmVyOiBBcnJheUJ1ZmZlcik6IFRbXSB7XHJcbiAgICAgICAgY29uc3QgeyBzdG9yYWdlVW5pdCwgZWxlbWVudFR5cGUgfSA9IGV4dHJhY3RTdG9yYWdlVW5pdEVsZW1lbnRUeXBlKHRoaXMuX3VuaXRFbGVtZW50KTtcclxuICAgICAgICBjb25zdCBlbGVtZW50VHJhaXRzID0gZ2V0RWxlbWVudFRyYWl0cyhlbGVtZW50VHlwZSk7XHJcbiAgICAgICAgY29uc3Qgc3RvcmFnZUNvbnN0cnVjdG9yID0gZ2V0U3RvcmFnZUNvbnN0cnVjdG9yKHN0b3JhZ2VVbml0KTtcclxuICAgICAgICBjb25zdCBzdG9yYWdlID0gbmV3IHN0b3JhZ2VDb25zdHJ1Y3RvcihhcnJheUJ1ZmZlciwgdGhpcy5fYnl0ZU9mZnNldCwgdGhpcy5fdW5pdENvdW50KTtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgQXJyYXk8VD4odGhpcy5fbGVuZ3RoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2xlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdFtpXSA9IGVsZW1lbnRUcmFpdHMuZGVjb21wcmVzcyhzdG9yYWdlLCBpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RWxlbWVudFRyYWl0cyAoZWxlbWVudFR5cGU6IEVsZW1lbnRUeXBlKSB7XHJcbiAgICByZXR1cm4gQnVpbHRpbkVsZW1lbnRUeXBlVHJhaXRzW2VsZW1lbnRUeXBlXTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U3RvcmFnZUNvbnN0cnVjdG9yICh1bml0OiBTdG9yYWdlVW5pdCkge1xyXG4gICAgc3dpdGNoICh1bml0KSB7XHJcbiAgICAgICAgY2FzZSBTdG9yYWdlVW5pdC5VaW50ODpcclxuICAgICAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXk7XHJcbiAgICAgICAgY2FzZSBTdG9yYWdlVW5pdC5VaW50MTY6XHJcbiAgICAgICAgICAgIHJldHVybiBVaW50MTZBcnJheTtcclxuICAgICAgICBjYXNlIFN0b3JhZ2VVbml0LlVpbnQzMjpcclxuICAgICAgICAgICAgcmV0dXJuIFVpbnQzMkFycmF5O1xyXG4gICAgICAgIGNhc2UgU3RvcmFnZVVuaXQuSW50ODpcclxuICAgICAgICAgICAgcmV0dXJuIEludDhBcnJheTtcclxuICAgICAgICBjYXNlIFN0b3JhZ2VVbml0LkludDE2OlxyXG4gICAgICAgICAgICByZXR1cm4gSW50MTZBcnJheTtcclxuICAgICAgICBjYXNlIFN0b3JhZ2VVbml0LkludDMyOlxyXG4gICAgICAgICAgICByZXR1cm4gSW50MzJBcnJheTtcclxuICAgICAgICBjYXNlIFN0b3JhZ2VVbml0LkZsb2F0MzI6XHJcbiAgICAgICAgICAgIHJldHVybiBGbG9hdDMyQXJyYXk7XHJcbiAgICAgICAgY2FzZSBTdG9yYWdlVW5pdC5GbG9hdDY0OlxyXG4gICAgICAgICAgICByZXR1cm4gRmxvYXQ2NEFycmF5O1xyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgQ29tcGFjdFRyYWl0cyB7XHJcbiAgICByZXF1aXJlZFVuaXRzOiBudW1iZXI7XHJcbiAgICBjb21wcmVzcyAoc3RvcmFnZTogQ29tcGFjdFZhbHVlVHlwZUFycmF5U3RvcmFnZSwgaW5kZXg6IG51bWJlciwgdmFsdWU6IGFueSk6IHZvaWQ7XHJcbiAgICBkZWNvbXByZXNzIChzdG9yYWdlOiBDb21wYWN0VmFsdWVUeXBlQXJyYXlTdG9yYWdlLCBpbmRleDogbnVtYmVyKTogYW55O1xyXG59XHJcblxyXG5jb25zdCBCdWlsdGluRWxlbWVudFR5cGVUcmFpdHM6IFJlY29yZDxFbGVtZW50VHlwZSwgQ29tcGFjdFRyYWl0cz4gPSB7XHJcbiAgICBbRWxlbWVudFR5cGUuU2NhbGFyXToge1xyXG4gICAgICAgIHJlcXVpcmVkVW5pdHM6IDEsXHJcbiAgICAgICAgY29tcHJlc3MgKHN0b3JhZ2U6IENvbXBhY3RWYWx1ZVR5cGVBcnJheVN0b3JhZ2UsIGluZGV4OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgc3RvcmFnZVtpbmRleF0gPSB2YWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlY29tcHJlc3MgKHN0b3JhZ2U6IENvbXBhY3RWYWx1ZVR5cGVBcnJheVN0b3JhZ2UsIGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2VbaW5kZXhdO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBbRWxlbWVudFR5cGUuVmVjMl06IHtcclxuICAgICAgICByZXF1aXJlZFVuaXRzOiAyLFxyXG4gICAgICAgIGNvbXByZXNzIChzdG9yYWdlOiBDb21wYWN0VmFsdWVUeXBlQXJyYXlTdG9yYWdlLCBpbmRleDogbnVtYmVyLCB2YWx1ZTogVmVjMikge1xyXG4gICAgICAgICAgICBzdG9yYWdlW2luZGV4ICogMl0gPSB2YWx1ZS54O1xyXG4gICAgICAgICAgICBzdG9yYWdlW2luZGV4ICogMiArIDFdID0gdmFsdWUueTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlY29tcHJlc3MgKHN0b3JhZ2U6IENvbXBhY3RWYWx1ZVR5cGVBcnJheVN0b3JhZ2UsIGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHN0b3JhZ2VbaW5kZXggKiAyXSwgc3RvcmFnZVtpbmRleCAqIDIgKyAxXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFtFbGVtZW50VHlwZS5WZWMzXToge1xyXG4gICAgICAgIHJlcXVpcmVkVW5pdHM6IDMsXHJcbiAgICAgICAgY29tcHJlc3MgKHN0b3JhZ2U6IENvbXBhY3RWYWx1ZVR5cGVBcnJheVN0b3JhZ2UsIGluZGV4OiBudW1iZXIsIHZhbHVlOiBWZWMzKSB7XHJcbiAgICAgICAgICAgIHN0b3JhZ2VbaW5kZXggKiAzXSA9IHZhbHVlLng7XHJcbiAgICAgICAgICAgIHN0b3JhZ2VbaW5kZXggKiAzICsgMV0gPSB2YWx1ZS55O1xyXG4gICAgICAgICAgICBzdG9yYWdlW2luZGV4ICogMyArIDJdID0gdmFsdWUuejtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlY29tcHJlc3MgKHN0b3JhZ2U6IENvbXBhY3RWYWx1ZVR5cGVBcnJheVN0b3JhZ2UsIGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWMzKHN0b3JhZ2VbaW5kZXggKiAzXSwgc3RvcmFnZVtpbmRleCAqIDMgKyAxXSwgc3RvcmFnZVtpbmRleCAqIDMgKyAyXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFtFbGVtZW50VHlwZS5WZWM0XToge1xyXG4gICAgICAgIHJlcXVpcmVkVW5pdHM6IDQsXHJcbiAgICAgICAgY29tcHJlc3MgKHN0b3JhZ2U6IENvbXBhY3RWYWx1ZVR5cGVBcnJheVN0b3JhZ2UsIGluZGV4OiBudW1iZXIsIHZhbHVlOiBWZWM0KSB7XHJcbiAgICAgICAgICAgIHN0b3JhZ2VbaW5kZXggKiA0XSA9IHZhbHVlLng7XHJcbiAgICAgICAgICAgIHN0b3JhZ2VbaW5kZXggKiA0ICsgMV0gPSB2YWx1ZS55O1xyXG4gICAgICAgICAgICBzdG9yYWdlW2luZGV4ICogNCArIDJdID0gdmFsdWUuejtcclxuICAgICAgICAgICAgc3RvcmFnZVtpbmRleCAqIDQgKyAzXSA9IHZhbHVlLnc7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWNvbXByZXNzIChzdG9yYWdlOiBDb21wYWN0VmFsdWVUeXBlQXJyYXlTdG9yYWdlLCBpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjNChzdG9yYWdlW2luZGV4ICogNF0sIHN0b3JhZ2VbaW5kZXggKiA0ICsgMV0sIHN0b3JhZ2VbaW5kZXggKiA0ICsgMl0sIHN0b3JhZ2VbaW5kZXggKiA0ICsgM10pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBbRWxlbWVudFR5cGUuUXVhdF06IHtcclxuICAgICAgICByZXF1aXJlZFVuaXRzOiA0LFxyXG4gICAgICAgIGNvbXByZXNzIChzdG9yYWdlOiBDb21wYWN0VmFsdWVUeXBlQXJyYXlTdG9yYWdlLCBpbmRleDogbnVtYmVyLCB2YWx1ZTogUXVhdCkge1xyXG4gICAgICAgICAgICBzdG9yYWdlW2luZGV4ICogNF0gPSB2YWx1ZS54O1xyXG4gICAgICAgICAgICBzdG9yYWdlW2luZGV4ICogNCArIDFdID0gdmFsdWUueTtcclxuICAgICAgICAgICAgc3RvcmFnZVtpbmRleCAqIDQgKyAyXSA9IHZhbHVlLno7XHJcbiAgICAgICAgICAgIHN0b3JhZ2VbaW5kZXggKiA0ICsgM10gPSB2YWx1ZS53O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVjb21wcmVzcyAoc3RvcmFnZTogQ29tcGFjdFZhbHVlVHlwZUFycmF5U3RvcmFnZSwgaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFF1YXQoc3RvcmFnZVtpbmRleCAqIDRdLCBzdG9yYWdlW2luZGV4ICogNCArIDFdLCBzdG9yYWdlW2luZGV4ICogNCArIDJdLCBzdG9yYWdlW2luZGV4ICogNCArIDNdKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgW0VsZW1lbnRUeXBlLk1hdDRdOiB7XHJcbiAgICAgICAgcmVxdWlyZWRVbml0czogMTYsXHJcbiAgICAgICAgY29tcHJlc3MgKHN0b3JhZ2U6IENvbXBhY3RWYWx1ZVR5cGVBcnJheVN0b3JhZ2UsIGluZGV4OiBudW1iZXIsIHZhbHVlOiBNYXQ0KSB7XHJcbiAgICAgICAgICAgIE1hdDQudG9BcnJheShzdG9yYWdlLCB2YWx1ZSwgaW5kZXggKiAxNik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWNvbXByZXNzIChzdG9yYWdlOiBDb21wYWN0VmFsdWVUeXBlQXJyYXlTdG9yYWdlLCBpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXQ0LmZyb21BcnJheShuZXcgTWF0NCgpLCBzdG9yYWdlLCBpbmRleCAqIDE2KTtcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxufTtcclxuXHJcbmludGVyZmFjZSBDb21wYWN0VmFsdWVUeXBlQXJyYXlTdG9yYWdlIHtcclxuICAgIHJlYWRvbmx5IGxlbmd0aDogbnVtYmVyO1xyXG4gICAgW246IG51bWJlcl06IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29tcGFjdFZhbHVlVHlwZUFycmF5ICh2YWx1ZTogYW55KTogdmFsdWUgaXMgQ29tcGFjdFZhbHVlVHlwZUFycmF5ICB7XHJcbiAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBDb21wYWN0VmFsdWVUeXBlQXJyYXk7XHJcbn1cclxuIl19