(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../math/index.js", "../data/utils/asserts.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../math/index.js"), require("../data/utils/asserts.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.asserts);
    global.skeletalAnimationBlending = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _asserts) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.createBlendStateWriter = createBlendStateWriter;
  _exports.BlendStateBuffer = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var BlendStateBuffer = /*#__PURE__*/function () {
    function BlendStateBuffer() {
      _classCallCheck(this, BlendStateBuffer);

      this._nodeBlendStates = new Map();
    }

    _createClass(BlendStateBuffer, [{
      key: "ref",
      value: function ref(node, property) {
        var nodeBlendState = this._nodeBlendStates.get(node);

        if (!nodeBlendState) {
          nodeBlendState = {
            dirty: false,
            properties: {}
          };

          this._nodeBlendStates.set(node, nodeBlendState);
        }

        var propertyBlendState = nodeBlendState.properties[property];

        if (!propertyBlendState) {
          propertyBlendState = nodeBlendState.properties[property] = new PropertyBlendState(nodeBlendState, isVec3Property(property) ? new _index.Vec3() : new _index.Quat());
        }

        ++propertyBlendState.refCount;
        return propertyBlendState;
      }
    }, {
      key: "deRef",
      value: function deRef(node, property) {
        var nodeBlendState = this._nodeBlendStates.get(node);

        if (!nodeBlendState) {
          return;
        }

        var propertyBlendState = nodeBlendState.properties[property];

        if (!propertyBlendState) {
          return;
        }

        --propertyBlendState.refCount;

        if (propertyBlendState.refCount > 0) {
          return;
        }

        delete nodeBlendState.properties[property];

        if (isEmptyNodeBlendState(nodeBlendState)) {
          this._nodeBlendStates["delete"](node);
        }
      }
    }, {
      key: "apply",
      value: function apply() {
        this._nodeBlendStates.forEach(function (nodeBlendState, node) {
          if (!nodeBlendState.dirty) {
            return;
          }

          nodeBlendState.dirty = false;
          var _nodeBlendState$prope = nodeBlendState.properties,
              position = _nodeBlendState$prope.position,
              scale = _nodeBlendState$prope.scale,
              rotation = _nodeBlendState$prope.rotation,
              eulerAngles = _nodeBlendState$prope.eulerAngles;
          var t;
          var s;
          var r;
          var anyChanged = false;

          if (position && position.weight !== 0) {
            position.weight = 0;
            t = position.value;
            anyChanged = true;
          }

          if (scale && scale.weight !== 0) {
            scale.weight = 0;
            s = scale.value;
            anyChanged = true;
          } // Note: rotation and eulerAngles can not co-exist.


          if (rotation && rotation.weight !== 0) {
            rotation.weight = 0;
            r = rotation.value;
            anyChanged = true;
          }

          if (eulerAngles && eulerAngles.weight !== 0) {
            eulerAngles.weight = 0;
            r = eulerAngles.value;
            anyChanged = true;
          }

          if (anyChanged) {
            node.setRTS(r, t, s);
          }
        });
      }
    }]);

    return BlendStateBuffer;
  }();

  _exports.BlendStateBuffer = BlendStateBuffer;

  function createBlendStateWriter(blendState, node, property, weightProxy, // Effectively equals to AnimationState

  /**
   * True if this writer will write constant value each time.
   */
  constants) {
    var blendFunction = isVec3Property(property) ? additive3D : additiveQuat;
    var propertyBlendState = blendState.ref(node, property);
    var isConstCacheValid = false;
    var lastWeight = -1;
    return {
      destroy: function destroy() {
        (0, _asserts.assertIsNonNullable)(propertyBlendState);

        if (propertyBlendState) {
          blendState.deRef(node, property);
          propertyBlendState = null;
        }
      },
      forTarget: function forTarget() {
        return {
          /**
           * Gets the node's actual property for now.
           */
          get: function get() {
            return node[property];
          },
          set: function set(value) {
            if (!propertyBlendState) {
              return;
            }

            var weight = weightProxy.weight;

            if (constants) {
              if (weight !== 1 || weight !== lastWeight) {
                // If there are multi writer for this property at this time,
                // or if the weight has been changed since last write,
                // we should invalidate the cache.
                isConstCacheValid = false;
              } else if (isConstCacheValid) {
                // Otherwise, we may keep to use the cache.
                // i.e we leave the weight to 0 to prevent the property from modifying.
                return;
              }
            }

            blendFunction(value, weight, propertyBlendState);
            propertyBlendState.weight += weight;
            propertyBlendState.markAsDirty();
            isConstCacheValid = true;
            lastWeight = weight;
          }
        };
      }
    };
  }

  function isQuatProperty(property) {
    return property === 'rotation';
  }

  function isVec3Property(property) {
    return !isQuatProperty(property);
  }

  var PropertyBlendState = /*#__PURE__*/function () {
    /**
     * How many writer reference this property.
     */
    function PropertyBlendState(node, value) {
      _classCallCheck(this, PropertyBlendState);

      this.weight = 0;
      this.value = void 0;
      this.refCount = 0;
      this._node = void 0;
      this._node = node;
      this.value = value;
    }

    _createClass(PropertyBlendState, [{
      key: "markAsDirty",
      value: function markAsDirty() {
        this._node.dirty = true;
      }
    }]);

    return PropertyBlendState;
  }();

  function isEmptyNodeBlendState(nodeBlendState) {
    // Which is equal to `Object.keys(nodeBlendState.properties).length === 0`.
    return !nodeBlendState.properties.position && !nodeBlendState.properties.rotation && !nodeBlendState.properties.eulerAngles && !nodeBlendState.properties.scale;
  }
  /**
   * If propertyBlendState.weight equals to zero, the propertyBlendState.value is dirty.
   * You shall handle this situation correctly.
   */


  function additive3D(value, weight, propertyBlendState) {
    if (propertyBlendState.weight === 0) {
      _index.Vec3.zero(propertyBlendState.value);
    }

    if (weight === 0) {
      return propertyBlendState.value;
    } else if (weight === 1) {
      return _index.Vec3.copy(propertyBlendState.value, value);
    }

    return _index.Vec3.scaleAndAdd(propertyBlendState.value, propertyBlendState.value, value, weight);
  }

  function additiveQuat(value, weight, propertyBlendState) {
    if (propertyBlendState.weight === 0) {
      _index.Quat.identity(propertyBlendState.value);
    }

    if (weight === 0) {
      return propertyBlendState.value;
    } else if (weight === 1) {
      return _index.Quat.copy(propertyBlendState.value, value);
    }

    var t = weight / (propertyBlendState.weight + weight);
    return _index.Quat.slerp(propertyBlendState.value, propertyBlendState.value, value, t);
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYW5pbWF0aW9uL3NrZWxldGFsLWFuaW1hdGlvbi1ibGVuZGluZy50cyJdLCJuYW1lcyI6WyJCbGVuZFN0YXRlQnVmZmVyIiwiX25vZGVCbGVuZFN0YXRlcyIsIk1hcCIsIm5vZGUiLCJwcm9wZXJ0eSIsIm5vZGVCbGVuZFN0YXRlIiwiZ2V0IiwiZGlydHkiLCJwcm9wZXJ0aWVzIiwic2V0IiwicHJvcGVydHlCbGVuZFN0YXRlIiwiUHJvcGVydHlCbGVuZFN0YXRlIiwiaXNWZWMzUHJvcGVydHkiLCJWZWMzIiwiUXVhdCIsInJlZkNvdW50IiwiaXNFbXB0eU5vZGVCbGVuZFN0YXRlIiwiZm9yRWFjaCIsInBvc2l0aW9uIiwic2NhbGUiLCJyb3RhdGlvbiIsImV1bGVyQW5nbGVzIiwidCIsInMiLCJyIiwiYW55Q2hhbmdlZCIsIndlaWdodCIsInZhbHVlIiwic2V0UlRTIiwiY3JlYXRlQmxlbmRTdGF0ZVdyaXRlciIsImJsZW5kU3RhdGUiLCJ3ZWlnaHRQcm94eSIsImNvbnN0YW50cyIsImJsZW5kRnVuY3Rpb24iLCJhZGRpdGl2ZTNEIiwiYWRkaXRpdmVRdWF0IiwicmVmIiwiaXNDb25zdENhY2hlVmFsaWQiLCJsYXN0V2VpZ2h0IiwiZGVzdHJveSIsImRlUmVmIiwiZm9yVGFyZ2V0IiwibWFya0FzRGlydHkiLCJpc1F1YXRQcm9wZXJ0eSIsIl9ub2RlIiwiemVybyIsImNvcHkiLCJzY2FsZUFuZEFkZCIsImlkZW50aXR5Iiwic2xlcnAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVNhQSxnQjs7OztXQUNEQyxnQixHQUE4QyxJQUFJQyxHQUFKLEU7Ozs7OzBCQUUxQ0MsSSxFQUFZQyxRLEVBQTRCO0FBQ2hELFlBQUlDLGNBQWMsR0FBRyxLQUFLSixnQkFBTCxDQUFzQkssR0FBdEIsQ0FBMEJILElBQTFCLENBQXJCOztBQUNBLFlBQUksQ0FBQ0UsY0FBTCxF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cUM7QUFDakNaLGtCQUFLa0MsUUFBTCxDQUFjdEMsa0JBQWtCLENBQUNpQixLQUFqQztBQUNIOztBQUNELFFBQUlELE1BQU0sS0FBSyxDQUFmLEVBQWtCO0FBQ2QsYUFBT2hCLGtCQUFrQixDQUFDaUIsS0FBMUI7QUFDSCxLQUZELE1BRU8sSUFBSUQsTUFBTSxLQUFLLENBQWYsRUFBa0I7QUFDckIsYUFBT1osWUFBS2dDLElBQUwsQ0FBVXBDLGtCQUFrQixDQUFDaUIsS0FBN0IsRUFBb0NBLEtBQXBDLENBQVA7QUFDSDs7QUFDRCxRQUFNTCxDQUFDLEdBQUdJLE1BQU0sSUFBSWhCLGtCQUFrQixDQUFDZ0IsTUFBbkIsR0FBNEJBLE1BQWhDLENBQWhCO0FBQ0EsV0FBT1osWUFBS21DLEtBQUwsQ0FBV3ZDLGtCQUFrQixDQUFDaUIsS0FBOUIsRUFBcUNqQixrQkFBa0IsQ0FBQ2lCLEtBQXhELEVBQStEQSxLQUEvRCxFQUFzRUwsQ0FBdEUsQ0FBUDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyBWZWMzLCBRdWF0IH0gZnJvbSAnLi4vbWF0aCc7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi9zY2VuZS1ncmFwaCc7XHJcbmltcG9ydCB7IElWYWx1ZVByb3h5RmFjdG9yeSB9IGZyb20gJy4vdmFsdWUtcHJveHknO1xyXG5pbXBvcnQgeyBhc3NlcnRJc05vbk51bGxhYmxlIH0gZnJvbSAnLi4vZGF0YS91dGlscy9hc3NlcnRzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBCbGVuZFN0YXRlQnVmZmVyIHtcclxuICAgIHByaXZhdGUgX25vZGVCbGVuZFN0YXRlczogTWFwPE5vZGUsIE5vZGVCbGVuZFN0YXRlPiA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICBwdWJsaWMgcmVmIChub2RlOiBOb2RlLCBwcm9wZXJ0eTogQmxlbmRpbmdQcm9wZXJ0eSkge1xyXG4gICAgICAgIGxldCBub2RlQmxlbmRTdGF0ZSA9IHRoaXMuX25vZGVCbGVuZFN0YXRlcy5nZXQobm9kZSk7XHJcbiAgICAgICAgaWYgKCFub2RlQmxlbmRTdGF0ZSkge1xyXG4gICAgICAgICAgICBub2RlQmxlbmRTdGF0ZSA9IHsgZGlydHk6IGZhbHNlLCBwcm9wZXJ0aWVzOiB7fSB9O1xyXG4gICAgICAgICAgICB0aGlzLl9ub2RlQmxlbmRTdGF0ZXMuc2V0KG5vZGUsIG5vZGVCbGVuZFN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHByb3BlcnR5QmxlbmRTdGF0ZSA9IG5vZGVCbGVuZFN0YXRlLnByb3BlcnRpZXNbcHJvcGVydHldO1xyXG4gICAgICAgIGlmICghcHJvcGVydHlCbGVuZFN0YXRlKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnR5QmxlbmRTdGF0ZSA9IG5vZGVCbGVuZFN0YXRlLnByb3BlcnRpZXNbcHJvcGVydHldID0gbmV3IFByb3BlcnR5QmxlbmRTdGF0ZShcclxuICAgICAgICAgICAgICAgIG5vZGVCbGVuZFN0YXRlLFxyXG4gICAgICAgICAgICAgICAgKGlzVmVjM1Byb3BlcnR5KHByb3BlcnR5KSA/IG5ldyBWZWMzKCkgOiBuZXcgUXVhdCgpKSBhcyBhbnksXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICsrcHJvcGVydHlCbGVuZFN0YXRlLnJlZkNvdW50O1xyXG4gICAgICAgIHJldHVybiBwcm9wZXJ0eUJsZW5kU3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlUmVmIChub2RlOiBOb2RlLCBwcm9wZXJ0eTogQmxlbmRpbmdQcm9wZXJ0eSkge1xyXG4gICAgICAgIGNvbnN0IG5vZGVCbGVuZFN0YXRlID0gdGhpcy5fbm9kZUJsZW5kU3RhdGVzLmdldChub2RlKTtcclxuICAgICAgICBpZiAoIW5vZGVCbGVuZFN0YXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcHJvcGVydHlCbGVuZFN0YXRlID0gbm9kZUJsZW5kU3RhdGUucHJvcGVydGllc1twcm9wZXJ0eV07XHJcbiAgICAgICAgaWYgKCFwcm9wZXJ0eUJsZW5kU3RhdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAtLXByb3BlcnR5QmxlbmRTdGF0ZS5yZWZDb3VudDtcclxuICAgICAgICBpZiAocHJvcGVydHlCbGVuZFN0YXRlLnJlZkNvdW50ID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlbGV0ZSBub2RlQmxlbmRTdGF0ZS5wcm9wZXJ0aWVzW3Byb3BlcnR5XTtcclxuICAgICAgICBpZiAoaXNFbXB0eU5vZGVCbGVuZFN0YXRlKG5vZGVCbGVuZFN0YXRlKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9ub2RlQmxlbmRTdGF0ZXMuZGVsZXRlKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXBwbHkgKCkge1xyXG4gICAgICAgIHRoaXMuX25vZGVCbGVuZFN0YXRlcy5mb3JFYWNoKChub2RlQmxlbmRTdGF0ZSwgbm9kZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIW5vZGVCbGVuZFN0YXRlLmRpcnR5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbm9kZUJsZW5kU3RhdGUuZGlydHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgY29uc3QgeyBwb3NpdGlvbiwgc2NhbGUsIHJvdGF0aW9uLCBldWxlckFuZ2xlcyB9ID0gbm9kZUJsZW5kU3RhdGUucHJvcGVydGllcztcclxuICAgICAgICAgICAgbGV0IHQ6IFZlYzMgfCB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGxldCBzOiBWZWMzIHwgdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBsZXQgcjogUXVhdCB8IFZlYzMgfCB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGxldCBhbnlDaGFuZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbiAmJiBwb3NpdGlvbi53ZWlnaHQgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uLndlaWdodCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0ID0gcG9zaXRpb24udmFsdWU7XHJcbiAgICAgICAgICAgICAgICBhbnlDaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2NhbGUgJiYgc2NhbGUud2VpZ2h0ICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBzY2FsZS53ZWlnaHQgPSAwO1xyXG4gICAgICAgICAgICAgICAgcyA9IHNjYWxlLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgYW55Q2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIE5vdGU6IHJvdGF0aW9uIGFuZCBldWxlckFuZ2xlcyBjYW4gbm90IGNvLWV4aXN0LlxyXG4gICAgICAgICAgICBpZiAocm90YXRpb24gJiYgcm90YXRpb24ud2VpZ2h0ICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByb3RhdGlvbi53ZWlnaHQgPSAwO1xyXG4gICAgICAgICAgICAgICAgciA9IHJvdGF0aW9uLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgYW55Q2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGV1bGVyQW5nbGVzICYmIGV1bGVyQW5nbGVzLndlaWdodCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgZXVsZXJBbmdsZXMud2VpZ2h0ID0gMDtcclxuICAgICAgICAgICAgICAgIHIgPSBldWxlckFuZ2xlcy52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGFueUNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoYW55Q2hhbmdlZCkge1xyXG4gICAgICAgICAgICAgICAgbm9kZS5zZXRSVFMociwgdCwgcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHR5cGUgSUJsZW5kU3RhdGVXcml0ZXIgPSBJVmFsdWVQcm94eUZhY3RvcnkgJiB7IGRlc3Ryb3k6ICgpID0+IHZvaWQgfTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVCbGVuZFN0YXRlV3JpdGVyPFAgZXh0ZW5kcyBCbGVuZGluZ1Byb3BlcnR5PiAoXHJcbiAgICBibGVuZFN0YXRlOiBCbGVuZFN0YXRlQnVmZmVyLFxyXG4gICAgbm9kZTogTm9kZSxcclxuICAgIHByb3BlcnR5OiBQLFxyXG4gICAgd2VpZ2h0UHJveHk6IHsgd2VpZ2h0OiBudW1iZXIgfSwgLy8gRWZmZWN0aXZlbHkgZXF1YWxzIHRvIEFuaW1hdGlvblN0YXRlXHJcbiAgICAvKipcclxuICAgICAqIFRydWUgaWYgdGhpcyB3cml0ZXIgd2lsbCB3cml0ZSBjb25zdGFudCB2YWx1ZSBlYWNoIHRpbWUuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0YW50czogYm9vbGVhbixcclxuKTogSUJsZW5kU3RhdGVXcml0ZXIge1xyXG4gICAgY29uc3QgYmxlbmRGdW5jdGlvbjogQmxlbmRGdW5jdGlvbjxCbGVuZGluZ1Byb3BlcnR5VmFsdWU8UD4+ID1cclxuICAgICAgICBpc1ZlYzNQcm9wZXJ0eShwcm9wZXJ0eSkgPyBhZGRpdGl2ZTNEIGFzIGFueTogYWRkaXRpdmVRdWF0IGFzIGFueTtcclxuICAgIGxldCBwcm9wZXJ0eUJsZW5kU3RhdGU6IFByb3BlcnR5QmxlbmRTdGF0ZTxCbGVuZGluZ1Byb3BlcnR5VmFsdWU8UD4+IHwgbnVsbCA9IGJsZW5kU3RhdGUucmVmKG5vZGUsIHByb3BlcnR5KTtcclxuICAgIGxldCBpc0NvbnN0Q2FjaGVWYWxpZCA9IGZhbHNlO1xyXG4gICAgbGV0IGxhc3RXZWlnaHQgPSAtMTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgICAgIGFzc2VydElzTm9uTnVsbGFibGUocHJvcGVydHlCbGVuZFN0YXRlKTtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5QmxlbmRTdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgYmxlbmRTdGF0ZS5kZVJlZihub2RlLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUJsZW5kU3RhdGUgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb3JUYXJnZXQ6ICgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogR2V0cyB0aGUgbm9kZSdzIGFjdHVhbCBwcm9wZXJ0eSBmb3Igbm93LlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBnZXQ6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0OiAodmFsdWU6IEJsZW5kaW5nUHJvcGVydHlWYWx1ZTxQPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghcHJvcGVydHlCbGVuZFN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd2VpZ2h0ID0gd2VpZ2h0UHJveHkud2VpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb25zdGFudHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdlaWdodCAhPT0gMSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0ICE9PSBsYXN0V2VpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbXVsdGkgd3JpdGVyIGZvciB0aGlzIHByb3BlcnR5IGF0IHRoaXMgdGltZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9yIGlmIHRoZSB3ZWlnaHQgaGFzIGJlZW4gY2hhbmdlZCBzaW5jZSBsYXN0IHdyaXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2Ugc2hvdWxkIGludmFsaWRhdGUgdGhlIGNhY2hlLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb25zdENhY2hlVmFsaWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc0NvbnN0Q2FjaGVWYWxpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSBtYXkga2VlcCB0byB1c2UgdGhlIGNhY2hlLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaS5lIHdlIGxlYXZlIHRoZSB3ZWlnaHQgdG8gMCB0byBwcmV2ZW50IHRoZSBwcm9wZXJ0eSBmcm9tIG1vZGlmeWluZy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBibGVuZEZ1bmN0aW9uKHZhbHVlLCB3ZWlnaHQsIHByb3BlcnR5QmxlbmRTdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlCbGVuZFN0YXRlLndlaWdodCArPSB3ZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlCbGVuZFN0YXRlLm1hcmtBc0RpcnR5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNDb25zdENhY2hlVmFsaWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RXZWlnaHQgPSB3ZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc1F1YXRQcm9wZXJ0eSAocHJvcGVydHk6IEJsZW5kaW5nUHJvcGVydHkpIHtcclxuICAgIHJldHVybiBwcm9wZXJ0eSA9PT0gJ3JvdGF0aW9uJztcclxufVxyXG5cclxuZnVuY3Rpb24gaXNWZWMzUHJvcGVydHkgKHByb3BlcnR5OiBCbGVuZGluZ1Byb3BlcnR5KSB7XHJcbiAgICByZXR1cm4gIWlzUXVhdFByb3BlcnR5KHByb3BlcnR5KTtcclxufVxyXG5cclxudHlwZSBCbGVuZGluZ1Byb3BlcnR5ID0ga2V5b2YgTm9kZUJsZW5kU3RhdGVbJ3Byb3BlcnRpZXMnXTtcclxuXHJcbnR5cGUgQmxlbmRpbmdQcm9wZXJ0eVZhbHVlPFAgZXh0ZW5kcyBCbGVuZGluZ1Byb3BlcnR5PiA9IE5vbk51bGxhYmxlPE5vZGVCbGVuZFN0YXRlWydwcm9wZXJ0aWVzJ11bUF0+Wyd2YWx1ZSddO1xyXG5cclxuY2xhc3MgUHJvcGVydHlCbGVuZFN0YXRlPFQ+IHtcclxuICAgIHB1YmxpYyB3ZWlnaHQgPSAwO1xyXG4gICAgcHVibGljIHZhbHVlOiBUO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSG93IG1hbnkgd3JpdGVyIHJlZmVyZW5jZSB0aGlzIHByb3BlcnR5LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVmQ291bnQgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgX25vZGU6IE5vZGVCbGVuZFN0YXRlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChub2RlOiBOb2RlQmxlbmRTdGF0ZSwgdmFsdWU6IFQpIHtcclxuICAgICAgICB0aGlzLl9ub2RlID0gbm9kZTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG1hcmtBc0RpcnR5ICgpIHtcclxuICAgICAgICB0aGlzLl9ub2RlLmRpcnR5ID0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIE5vZGVCbGVuZFN0YXRlIHtcclxuICAgIGRpcnR5OiBib29sZWFuO1xyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIHBvc2l0aW9uPzogUHJvcGVydHlCbGVuZFN0YXRlPFZlYzM+O1xyXG4gICAgICAgIHJvdGF0aW9uPzogUHJvcGVydHlCbGVuZFN0YXRlPFF1YXQ+O1xyXG4gICAgICAgIGV1bGVyQW5nbGVzPzogUHJvcGVydHlCbGVuZFN0YXRlPFZlYzM+O1xyXG4gICAgICAgIHNjYWxlPzogUHJvcGVydHlCbGVuZFN0YXRlPFZlYzM+O1xyXG4gICAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNFbXB0eU5vZGVCbGVuZFN0YXRlIChub2RlQmxlbmRTdGF0ZTogTm9kZUJsZW5kU3RhdGUpIHtcclxuICAgIC8vIFdoaWNoIGlzIGVxdWFsIHRvIGBPYmplY3Qua2V5cyhub2RlQmxlbmRTdGF0ZS5wcm9wZXJ0aWVzKS5sZW5ndGggPT09IDBgLlxyXG4gICAgcmV0dXJuICFub2RlQmxlbmRTdGF0ZS5wcm9wZXJ0aWVzLnBvc2l0aW9uICYmXHJcbiAgICAgICAgIW5vZGVCbGVuZFN0YXRlLnByb3BlcnRpZXMucm90YXRpb24gJiZcclxuICAgICAgICAhbm9kZUJsZW5kU3RhdGUucHJvcGVydGllcy5ldWxlckFuZ2xlcyAmJlxyXG4gICAgICAgICFub2RlQmxlbmRTdGF0ZS5wcm9wZXJ0aWVzLnNjYWxlO1xyXG59XHJcblxyXG4vKipcclxuICogSWYgcHJvcGVydHlCbGVuZFN0YXRlLndlaWdodCBlcXVhbHMgdG8gemVybywgdGhlIHByb3BlcnR5QmxlbmRTdGF0ZS52YWx1ZSBpcyBkaXJ0eS5cclxuICogWW91IHNoYWxsIGhhbmRsZSB0aGlzIHNpdHVhdGlvbiBjb3JyZWN0bHkuXHJcbiAqL1xyXG50eXBlIEJsZW5kRnVuY3Rpb248VD4gPSAodmFsdWU6IFQsIHdlaWdodDogbnVtYmVyLCBwcm9wZXJ0eUJsZW5kU3RhdGU6IFByb3BlcnR5QmxlbmRTdGF0ZTxUPikgPT4gVDtcclxuXHJcbmZ1bmN0aW9uIGFkZGl0aXZlM0QgKHZhbHVlOiBWZWMzLCB3ZWlnaHQ6IG51bWJlciwgcHJvcGVydHlCbGVuZFN0YXRlOiBQcm9wZXJ0eUJsZW5kU3RhdGU8VmVjMz4pIHtcclxuICAgIGlmIChwcm9wZXJ0eUJsZW5kU3RhdGUud2VpZ2h0ID09PSAwKSB7XHJcbiAgICAgICAgVmVjMy56ZXJvKHByb3BlcnR5QmxlbmRTdGF0ZS52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBpZiAod2VpZ2h0ID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5QmxlbmRTdGF0ZS52YWx1ZTtcclxuICAgIH0gZWxzZSBpZiAod2VpZ2h0ID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIFZlYzMuY29weShwcm9wZXJ0eUJsZW5kU3RhdGUudmFsdWUsIHZhbHVlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBWZWMzLnNjYWxlQW5kQWRkKHByb3BlcnR5QmxlbmRTdGF0ZS52YWx1ZSwgcHJvcGVydHlCbGVuZFN0YXRlLnZhbHVlLCB2YWx1ZSwgd2VpZ2h0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkaXRpdmVRdWF0ICh2YWx1ZTogUXVhdCwgd2VpZ2h0OiBudW1iZXIsIHByb3BlcnR5QmxlbmRTdGF0ZTogUHJvcGVydHlCbGVuZFN0YXRlPFF1YXQ+KSB7XHJcbiAgICBpZiAocHJvcGVydHlCbGVuZFN0YXRlLndlaWdodCA9PT0gMCkge1xyXG4gICAgICAgIFF1YXQuaWRlbnRpdHkocHJvcGVydHlCbGVuZFN0YXRlLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGlmICh3ZWlnaHQgPT09IDApIHtcclxuICAgICAgICByZXR1cm4gcHJvcGVydHlCbGVuZFN0YXRlLnZhbHVlO1xyXG4gICAgfSBlbHNlIGlmICh3ZWlnaHQgPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gUXVhdC5jb3B5KHByb3BlcnR5QmxlbmRTdGF0ZS52YWx1ZSwgdmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdCA9IHdlaWdodCAvIChwcm9wZXJ0eUJsZW5kU3RhdGUud2VpZ2h0ICsgd2VpZ2h0KTtcclxuICAgIHJldHVybiBRdWF0LnNsZXJwKHByb3BlcnR5QmxlbmRTdGF0ZS52YWx1ZSwgcHJvcGVydHlCbGVuZFN0YXRlLnZhbHVlLCB2YWx1ZSwgdCk7XHJcbn1cclxuIl19