(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../assets/mesh.js", "../../gfx/define.js", "../../gfx/input-assembler.js", "../../math/index.js", "./buffer.js", "./buffer-blob.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../assets/mesh.js"), require("../../gfx/define.js"), require("../../gfx/input-assembler.js"), require("../../math/index.js"), require("./buffer.js"), require("./buffer-blob.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.mesh, global.define, global.inputAssembler, global.index, global.buffer, global.bufferBlob);
    global.createMesh = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _mesh, _define, _inputAssembler, _index, _buffer, _bufferBlob) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.createMesh = createMesh;

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var _defAttrs = [new _inputAssembler.GFXAttribute(_define.GFXAttributeName.ATTR_POSITION, _define.GFXFormat.RGB32F), new _inputAssembler.GFXAttribute(_define.GFXAttributeName.ATTR_NORMAL, _define.GFXFormat.RGB32F), new _inputAssembler.GFXAttribute(_define.GFXAttributeName.ATTR_TEX_COORD, _define.GFXFormat.RG32F), new _inputAssembler.GFXAttribute(_define.GFXAttributeName.ATTR_TANGENT, _define.GFXFormat.RGBA32F), new _inputAssembler.GFXAttribute(_define.GFXAttributeName.ATTR_COLOR, _define.GFXFormat.RGBA32F)];
  var v3_1 = new _index.Vec3();

  function createMesh(geometry, out, options) {
    options = options || {}; // Collect attributes and calculate length of result vertex buffer.

    var attributes = [];
    var stride = 0;
    var channels = [];
    var vertCount = 0;
    var attr;
    var positions = geometry.positions.slice();

    if (positions.length > 0) {
      attr = null;

      if (geometry.attributes) {
        var _iterator = _createForOfIteratorHelper(geometry.attributes),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var att = _step.value;

            if (att.name === _define.GFXAttributeName.ATTR_POSITION) {
              attr = att;
              break;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      if (!attr) {
        attr = _defAttrs[0];
      }

      attributes.push(attr);
      var info = _define.GFXFormatInfos[attr.format];
      vertCount = Math.max(vertCount, Math.floor(positions.length / info.count));
      channels.push({
        offset: stride,
        data: positions,
        attribute: attr
      });
      stride += info.size;
    }

    if (geometry.normals && geometry.normals.length > 0) {
      attr = null;

      if (geometry.attributes) {
        var _iterator2 = _createForOfIteratorHelper(geometry.attributes),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _att = _step2.value;

            if (_att.name === _define.GFXAttributeName.ATTR_NORMAL) {
              attr = _att;
              break;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }

      if (!attr) {
        attr = _defAttrs[1];
      }

      var _info = _define.GFXFormatInfos[attr.format];
      attributes.push(attr);
      vertCount = Math.max(vertCount, Math.floor(geometry.normals.length / _info.count));
      channels.push({
        offset: stride,
        data: geometry.normals,
        attribute: attr
      });
      stride += _info.size;
    }

    if (geometry.uvs && geometry.uvs.length > 0) {
      attr = null;

      if (geometry.attributes) {
        var _iterator3 = _createForOfIteratorHelper(geometry.attributes),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _att2 = _step3.value;

            if (_att2.name === _define.GFXAttributeName.ATTR_TEX_COORD) {
              attr = _att2;
              break;
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }

      if (!attr) {
        attr = _defAttrs[2];
      }

      var _info2 = _define.GFXFormatInfos[attr.format];
      attributes.push(attr);
      vertCount = Math.max(vertCount, Math.floor(geometry.uvs.length / _info2.count));
      channels.push({
        offset: stride,
        data: geometry.uvs,
        attribute: attr
      });
      stride += _info2.size;
    }

    if (geometry.tangents && geometry.tangents.length > 0) {
      attr = null;

      if (geometry.attributes) {
        var _iterator4 = _createForOfIteratorHelper(geometry.attributes),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var _att3 = _step4.value;

            if (_att3.name === _define.GFXAttributeName.ATTR_TANGENT) {
              attr = _att3;
              break;
            }
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }

      if (!attr) {
        attr = _defAttrs[3];
      }

      var _info3 = _define.GFXFormatInfos[attr.format];
      attributes.push(attr);
      vertCount = Math.max(vertCount, Math.floor(geometry.tangents.length / _info3.count));
      channels.push({
        offset: stride,
        data: geometry.tangents,
        attribute: attr
      });
      stride += _info3.size;
    }

    if (geometry.colors && geometry.colors.length > 0) {
      attr = null;

      if (geometry.attributes) {
        var _iterator5 = _createForOfIteratorHelper(geometry.attributes),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var _att4 = _step5.value;

            if (_att4.name === _define.GFXAttributeName.ATTR_COLOR) {
              attr = _att4;
              break;
            }
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }

      if (!attr) {
        attr = _defAttrs[4];
      }

      var _info4 = _define.GFXFormatInfos[attr.format];
      attributes.push(attr);
      vertCount = Math.max(vertCount, Math.floor(geometry.colors.length / _info4.count));
      channels.push({
        offset: stride,
        data: geometry.colors,
        attribute: attr
      });
      stride += _info4.size;
    }

    if (geometry.customAttributes) {
      var _iterator6 = _createForOfIteratorHelper(geometry.customAttributes),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var ca = _step6.value;
          var _info5 = _define.GFXFormatInfos[ca.attr.format];
          attributes.push(ca.attr);
          vertCount = Math.max(vertCount, Math.floor(ca.values.length / _info5.count));
          channels.push({
            offset: stride,
            data: ca.values,
            attribute: ca.attr
          });
          stride += _info5.size;
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    } // Use this to generate final merged buffer.


    var bufferBlob = new _bufferBlob.BufferBlob(); // Fill vertex buffer.

    var vertexBuffer = new ArrayBuffer(vertCount * stride);
    var vertexBufferView = new DataView(vertexBuffer);

    for (var _i = 0, _channels = channels; _i < _channels.length; _i++) {
      var channel = _channels[_i];
      (0, _buffer.writeBuffer)(vertexBufferView, channel.data, channel.attribute.format, channel.offset, stride);
    }

    bufferBlob.setNextAlignment(0);
    var vertexBundle = {
      attributes: attributes,
      view: {
        offset: bufferBlob.getLength(),
        length: vertexBuffer.byteLength,
        count: vertCount,
        stride: stride
      }
    };
    bufferBlob.addBuffer(vertexBuffer); // Fill index buffer.

    var indexBuffer = null;
    var idxCount = 0;
    var idxStride = 2;

    if (geometry.indices) {
      var indices = geometry.indices;
      idxCount = indices.length;
      indexBuffer = new ArrayBuffer(idxStride * idxCount);
      var indexBufferView = new DataView(indexBuffer);
      (0, _buffer.writeBuffer)(indexBufferView, indices, _define.GFXFormat.R16UI);
    } // Create primitive.


    var primitive = {
      primitiveMode: geometry.primitiveMode || _define.GFXPrimitiveMode.TRIANGLE_LIST,
      vertexBundelIndices: [0]
    };

    if (indexBuffer) {
      bufferBlob.setNextAlignment(idxStride);
      primitive.indexView = {
        offset: bufferBlob.getLength(),
        length: indexBuffer.byteLength,
        count: idxCount,
        stride: idxStride
      };
      bufferBlob.addBuffer(indexBuffer);
    }

    var minPosition = geometry.minPos;

    if (!minPosition && options.calculateBounds) {
      minPosition = _index.Vec3.set(new _index.Vec3(), Infinity, Infinity, Infinity);

      for (var iVertex = 0; iVertex < vertCount; ++iVertex) {
        _index.Vec3.set(v3_1, positions[iVertex * 3 + 0], positions[iVertex * 3 + 1], positions[iVertex * 3 + 2]);

        _index.Vec3.min(minPosition, minPosition, v3_1);
      }
    }

    var maxPosition = geometry.maxPos;

    if (!maxPosition && options.calculateBounds) {
      maxPosition = _index.Vec3.set(new _index.Vec3(), -Infinity, -Infinity, -Infinity);

      for (var _iVertex = 0; _iVertex < vertCount; ++_iVertex) {
        _index.Vec3.set(v3_1, positions[_iVertex * 3 + 0], positions[_iVertex * 3 + 1], positions[_iVertex * 3 + 2]);

        _index.Vec3.max(maxPosition, maxPosition, v3_1);
      }
    } // Create mesh struct.


    var meshStruct = {
      vertexBundles: [vertexBundle],
      primitives: [primitive]
    };

    if (minPosition) {
      meshStruct.minPosition = new _index.Vec3(minPosition.x, minPosition.y, minPosition.z);
    }

    if (maxPosition) {
      meshStruct.maxPosition = new _index.Vec3(maxPosition.x, maxPosition.y, maxPosition.z);
    } // Create mesh.


    if (!out) {
      out = new _mesh.Mesh();
    }

    out.reset({
      struct: meshStruct,
      data: new Uint8Array(bufferBlob.getCombined())
    });
    return out;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvM2QvbWlzYy9jcmVhdGUtbWVzaC50cyJdLCJuYW1lcyI6WyJfZGVmQXR0cnMiLCJHRlhBdHRyaWJ1dGUiLCJHRlhBdHRyaWJ1dGVOYW1lIiwiQVRUUl9QT1NJVElPTiIsIkdGWEZvcm1hdCIsIlJHQjMyRiIsIkFUVFJfTk9STUFMIiwiQVRUUl9URVhfQ09PUkQiLCJSRzMyRiIsIkFUVFJfVEFOR0VOVCIsIlJHQkEzMkYiLCJBVFRSX0NPTE9SIiwidjNfMSIsIlZlYzMiLCJjcmVhdGVNZXNoIiwiZ2VvbWV0cnkiLCJvdXQiLCJvcHRpb25zIiwiYXR0cmlidXRlcyIsInN0cmlkZSIsImNoYW5uZWxzIiwidmVydENvdW50IiwiYXR0ciIsInBvc2l0aW9ucyIsInNsaWNlIiwibGVuZ3RoIiwiYXR0IiwibmFtZSIsInB1c2giLCJpbmZvIiwiR0ZYRm9ybWF0SW5mb3MiLCJmb3JtYXQiLCJNYXRoIiwibWF4IiwiZmxvb3IiLCJjb3VudCIsIm9mZnNldCIsImRhdGEiLCJhdHRyaWJ1dGUiLCJzaXplIiwibm9ybWFscyIsInV2cyIsInRhbmdlbnRzIiwiY29sb3JzIiwiY3VzdG9tQXR0cmlidXRlcyIsImNhIiwidmFsdWVzIiwiYnVmZmVyQmxvYiIsIkJ1ZmZlckJsb2IiLCJ2ZXJ0ZXhCdWZmZXIiLCJBcnJheUJ1ZmZlciIsInZlcnRleEJ1ZmZlclZpZXciLCJEYXRhVmlldyIsImNoYW5uZWwiLCJzZXROZXh0QWxpZ25tZW50IiwidmVydGV4QnVuZGxlIiwidmlldyIsImdldExlbmd0aCIsImJ5dGVMZW5ndGgiLCJhZGRCdWZmZXIiLCJpbmRleEJ1ZmZlciIsImlkeENvdW50IiwiaWR4U3RyaWRlIiwiaW5kaWNlcyIsImluZGV4QnVmZmVyVmlldyIsIlIxNlVJIiwicHJpbWl0aXZlIiwicHJpbWl0aXZlTW9kZSIsIkdGWFByaW1pdGl2ZU1vZGUiLCJUUklBTkdMRV9MSVNUIiwidmVydGV4QnVuZGVsSW5kaWNlcyIsImluZGV4VmlldyIsIm1pblBvc2l0aW9uIiwibWluUG9zIiwiY2FsY3VsYXRlQm91bmRzIiwic2V0IiwiSW5maW5pdHkiLCJpVmVydGV4IiwibWluIiwibWF4UG9zaXRpb24iLCJtYXhQb3MiLCJtZXNoU3RydWN0IiwidmVydGV4QnVuZGxlcyIsInByaW1pdGl2ZXMiLCJ4IiwieSIsInoiLCJNZXNoIiwicmVzZXQiLCJzdHJ1Y3QiLCJVaW50OEFycmF5IiwiZ2V0Q29tYmluZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUEsTUFBTUEsU0FBeUIsR0FBRyxDQUM5QixJQUFJQyw0QkFBSixDQUFpQkMseUJBQWlCQyxhQUFsQyxFQUFpREMsa0JBQVVDLE1BQTNELENBRDhCLEVBRTlCLElBQUlKLDRCQUFKLENBQWlCQyx5QkFBaUJJLFdBQWxDLEVBQStDRixrQkFBVUMsTUFBekQsQ0FGOEIsRUFHOUIsSUFBSUosNEJBQUosQ0FBaUJDLHlCQUFpQkssY0FBbEMsRUFBa0RILGtCQUFVSSxLQUE1RCxDQUg4QixFQUk5QixJQUFJUCw0QkFBSixDQUFpQkMseUJBQWlCTyxZQUFsQyxFQUFnREwsa0JBQVVNLE9BQTFELENBSjhCLEVBSzlCLElBQUlULDRCQUFKLENBQWlCQyx5QkFBaUJTLFVBQWxDLEVBQThDUCxrQkFBVU0sT0FBeEQsQ0FMOEIsQ0FBbEM7QUFRQSxNQUFNRSxJQUFJLEdBQUcsSUFBSUMsV0FBSixFQUFiOztBQUNPLFdBQVNDLFVBQVQsQ0FBcUJDLFFBQXJCLEVBQTBDQyxHQUExQyxFQUFzREMsT0FBdEQsRUFBcUY7QUFDeEZBLElBQUFBLE9BQU8sR0FBR0EsT0FBTyxJQUFJLEVBQXJCLENBRHdGLENBRXhGOztBQUNBLFFBQU1DLFVBQTBCLEdBQUcsRUFBbkM7QUFDQSxRQUFJQyxNQUFNLEdBQUcsQ0FBYjtBQUNBLFFBQU1DLFFBQXdFLEdBQUcsRUFBakY7QUFDQSxRQUFJQyxTQUFTLEdBQUcsQ0FBaEI7QUFFQSxRQUFJQyxJQUFKO0FBRUEsUUFB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QUZBLEtBQVY7QUFLQSxXQUFPM0UsR0FBUDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWVzaCB9IGZyb20gJy4uLy4uL2Fzc2V0cy9tZXNoJztcclxuaW1wb3J0IHsgR0ZYQXR0cmlidXRlTmFtZSwgR0ZYRm9ybWF0LCBHRlhGb3JtYXRJbmZvcywgR0ZYUHJpbWl0aXZlTW9kZSB9IGZyb20gJy4uLy4uL2dmeC9kZWZpbmUnO1xyXG5pbXBvcnQgeyBHRlhBdHRyaWJ1dGUgfSBmcm9tICcuLi8uLi9nZngvaW5wdXQtYXNzZW1ibGVyJztcclxuaW1wb3J0IHsgVmVjMyB9IGZyb20gJy4uLy4uL21hdGgnO1xyXG5pbXBvcnQgeyBJR2VvbWV0cnkgfSBmcm9tICcuLi8uLi9wcmltaXRpdmUvZGVmaW5lJztcclxuaW1wb3J0IHsgd3JpdGVCdWZmZXIgfSBmcm9tICcuL2J1ZmZlcic7XHJcbmltcG9ydCB7IEJ1ZmZlckJsb2IgfSBmcm9tICcuL2J1ZmZlci1ibG9iJztcclxuXHJcbmNvbnN0IF9kZWZBdHRyczogR0ZYQXR0cmlidXRlW10gPSBbXHJcbiAgICBuZXcgR0ZYQXR0cmlidXRlKEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9QT1NJVElPTiwgR0ZYRm9ybWF0LlJHQjMyRiksXHJcbiAgICBuZXcgR0ZYQXR0cmlidXRlKEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9OT1JNQUwsIEdGWEZvcm1hdC5SR0IzMkYpLFxyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfVEVYX0NPT1JELCBHRlhGb3JtYXQuUkczMkYpLFxyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfVEFOR0VOVCwgR0ZYRm9ybWF0LlJHQkEzMkYpLFxyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfQ09MT1IsIEdGWEZvcm1hdC5SR0JBMzJGKSxcclxuXTtcclxuXHJcbmNvbnN0IHYzXzEgPSBuZXcgVmVjMygpO1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTWVzaCAoZ2VvbWV0cnk6IElHZW9tZXRyeSwgb3V0PzogTWVzaCwgb3B0aW9ucz86IGNyZWF0ZU1lc2guSU9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgLy8gQ29sbGVjdCBhdHRyaWJ1dGVzIGFuZCBjYWxjdWxhdGUgbGVuZ3RoIG9mIHJlc3VsdCB2ZXJ0ZXggYnVmZmVyLlxyXG4gICAgY29uc3QgYXR0cmlidXRlczogR0ZYQXR0cmlidXRlW10gPSBbXTtcclxuICAgIGxldCBzdHJpZGUgPSAwO1xyXG4gICAgY29uc3QgY2hhbm5lbHM6IHsgb2Zmc2V0OiBudW1iZXI7IGRhdGE6IG51bWJlcltdOyBhdHRyaWJ1dGU6IEdGWEF0dHJpYnV0ZTsgfVtdID0gW107XHJcbiAgICBsZXQgdmVydENvdW50ID0gMDtcclxuXHJcbiAgICBsZXQgYXR0cjogR0ZYQXR0cmlidXRlIHwgbnVsbDtcclxuXHJcbiAgICBjb25zdCBwb3NpdGlvbnMgPSBnZW9tZXRyeS5wb3NpdGlvbnMuc2xpY2UoKTtcclxuICAgIGlmIChwb3NpdGlvbnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGF0dHIgPSBudWxsO1xyXG4gICAgICAgIGlmIChnZW9tZXRyeS5hdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgYXR0IG9mIGdlb21ldHJ5LmF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhdHQubmFtZSA9PT0gR0ZYQXR0cmlidXRlTmFtZS5BVFRSX1BPU0lUSU9OKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0ciA9IGF0dDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFhdHRyKSB7XHJcbiAgICAgICAgICAgIGF0dHIgPSBfZGVmQXR0cnNbMF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhdHRyaWJ1dGVzLnB1c2goYXR0cik7XHJcbiAgICAgICAgY29uc3QgaW5mbyA9IEdGWEZvcm1hdEluZm9zW2F0dHIuZm9ybWF0XTtcclxuICAgICAgICB2ZXJ0Q291bnQgPSBNYXRoLm1heCh2ZXJ0Q291bnQsIE1hdGguZmxvb3IocG9zaXRpb25zLmxlbmd0aCAvIGluZm8uY291bnQpKTtcclxuICAgICAgICBjaGFubmVscy5wdXNoKHsgb2Zmc2V0OiBzdHJpZGUsIGRhdGE6IHBvc2l0aW9ucywgYXR0cmlidXRlOiBhdHRyIH0pO1xyXG4gICAgICAgIHN0cmlkZSArPSBpbmZvLnNpemU7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGlmIChnZW9tZXRyeS5ub3JtYWxzICYmIGdlb21ldHJ5Lm5vcm1hbHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGF0dHIgPSBudWxsO1xyXG4gICAgICAgIGlmIChnZW9tZXRyeS5hdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgYXR0IG9mIGdlb21ldHJ5LmF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhdHQubmFtZSA9PT0gR0ZYQXR0cmlidXRlTmFtZS5BVFRSX05PUk1BTCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGF0dHIgPSBhdHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghYXR0cikge1xyXG4gICAgICAgICAgICBhdHRyID0gX2RlZkF0dHJzWzFdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5mbyA9IEdGWEZvcm1hdEluZm9zW2F0dHIuZm9ybWF0XTtcclxuICAgICAgICBhdHRyaWJ1dGVzLnB1c2goYXR0cik7XHJcbiAgICAgICAgdmVydENvdW50ID0gTWF0aC5tYXgodmVydENvdW50LCBNYXRoLmZsb29yKGdlb21ldHJ5Lm5vcm1hbHMubGVuZ3RoIC8gaW5mby5jb3VudCkpO1xyXG4gICAgICAgIGNoYW5uZWxzLnB1c2goeyBvZmZzZXQ6IHN0cmlkZSwgZGF0YTogZ2VvbWV0cnkubm9ybWFscywgYXR0cmlidXRlOiBhdHRyIH0pO1xyXG4gICAgICAgIHN0cmlkZSArPSBpbmZvLnNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGdlb21ldHJ5LnV2cyAmJiBnZW9tZXRyeS51dnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGF0dHIgPSBudWxsO1xyXG4gICAgICAgIGlmIChnZW9tZXRyeS5hdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgYXR0IG9mIGdlb21ldHJ5LmF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhdHQubmFtZSA9PT0gR0ZYQXR0cmlidXRlTmFtZS5BVFRSX1RFWF9DT09SRCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGF0dHIgPSBhdHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghYXR0cikge1xyXG4gICAgICAgICAgICBhdHRyID0gX2RlZkF0dHJzWzJdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5mbyA9IEdGWEZvcm1hdEluZm9zW2F0dHIuZm9ybWF0XTtcclxuICAgICAgICBhdHRyaWJ1dGVzLnB1c2goYXR0cik7XHJcbiAgICAgICAgdmVydENvdW50ID0gTWF0aC5tYXgodmVydENvdW50LCBNYXRoLmZsb29yKGdlb21ldHJ5LnV2cy5sZW5ndGggLyBpbmZvLmNvdW50KSk7XHJcbiAgICAgICAgY2hhbm5lbHMucHVzaCh7IG9mZnNldDogc3RyaWRlLCBkYXRhOiBnZW9tZXRyeS51dnMsIGF0dHJpYnV0ZTogYXR0ciB9KTtcclxuICAgICAgICBzdHJpZGUgKz0gaW5mby5zaXplO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChnZW9tZXRyeS50YW5nZW50cyAmJiBnZW9tZXRyeS50YW5nZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgYXR0ciA9IG51bGw7XHJcbiAgICAgICAgaWYgKGdlb21ldHJ5LmF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBhdHQgb2YgZ2VvbWV0cnkuYXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGF0dC5uYW1lID09PSBHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfVEFOR0VOVCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGF0dHIgPSBhdHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghYXR0cikge1xyXG4gICAgICAgICAgICBhdHRyID0gX2RlZkF0dHJzWzNdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5mbyA9IEdGWEZvcm1hdEluZm9zW2F0dHIuZm9ybWF0XTtcclxuICAgICAgICBhdHRyaWJ1dGVzLnB1c2goYXR0cik7XHJcbiAgICAgICAgdmVydENvdW50ID0gTWF0aC5tYXgodmVydENvdW50LCBNYXRoLmZsb29yKGdlb21ldHJ5LnRhbmdlbnRzLmxlbmd0aCAvIGluZm8uY291bnQpKTtcclxuICAgICAgICBjaGFubmVscy5wdXNoKHsgb2Zmc2V0OiBzdHJpZGUsIGRhdGE6IGdlb21ldHJ5LnRhbmdlbnRzLCBhdHRyaWJ1dGU6IGF0dHIgfSk7XHJcbiAgICAgICAgc3RyaWRlICs9IGluZm8uc2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZ2VvbWV0cnkuY29sb3JzICYmIGdlb21ldHJ5LmNvbG9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgYXR0ciA9IG51bGw7XHJcbiAgICAgICAgaWYgKGdlb21ldHJ5LmF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBhdHQgb2YgZ2VvbWV0cnkuYXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGF0dC5uYW1lID09PSBHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfQ09MT1IpIHtcclxuICAgICAgICAgICAgICAgICAgICBhdHRyID0gYXR0O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWF0dHIpIHtcclxuICAgICAgICAgICAgYXR0ciA9IF9kZWZBdHRyc1s0XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGluZm8gPSBHRlhGb3JtYXRJbmZvc1thdHRyLmZvcm1hdF07XHJcbiAgICAgICAgYXR0cmlidXRlcy5wdXNoKGF0dHIpO1xyXG4gICAgICAgIHZlcnRDb3VudCA9IE1hdGgubWF4KHZlcnRDb3VudCwgTWF0aC5mbG9vcihnZW9tZXRyeS5jb2xvcnMubGVuZ3RoIC8gaW5mby5jb3VudCkpO1xyXG4gICAgICAgIGNoYW5uZWxzLnB1c2goeyBvZmZzZXQ6IHN0cmlkZSwgZGF0YTogZ2VvbWV0cnkuY29sb3JzLCBhdHRyaWJ1dGU6IGF0dHIgfSk7XHJcbiAgICAgICAgc3RyaWRlICs9IGluZm8uc2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZ2VvbWV0cnkuY3VzdG9tQXR0cmlidXRlcykge1xyXG4gICAgICAgIGZvciAoY29uc3QgY2Egb2YgZ2VvbWV0cnkuY3VzdG9tQXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICBjb25zdCBpbmZvID0gR0ZYRm9ybWF0SW5mb3NbY2EuYXR0ci5mb3JtYXRdO1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goY2EuYXR0cik7XHJcbiAgICAgICAgICAgIHZlcnRDb3VudCA9IE1hdGgubWF4KHZlcnRDb3VudCwgTWF0aC5mbG9vcihjYS52YWx1ZXMubGVuZ3RoIC8gaW5mby5jb3VudCkpO1xyXG4gICAgICAgICAgICBjaGFubmVscy5wdXNoKHsgb2Zmc2V0OiBzdHJpZGUsIGRhdGE6IGNhLnZhbHVlcywgYXR0cmlidXRlOiBjYS5hdHRyIH0pO1xyXG4gICAgICAgICAgICBzdHJpZGUgKz0gaW5mby5zaXplO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBVc2UgdGhpcyB0byBnZW5lcmF0ZSBmaW5hbCBtZXJnZWQgYnVmZmVyLlxyXG4gICAgY29uc3QgYnVmZmVyQmxvYiA9IG5ldyBCdWZmZXJCbG9iKCk7XHJcblxyXG4gICAgLy8gRmlsbCB2ZXJ0ZXggYnVmZmVyLlxyXG4gICAgY29uc3QgdmVydGV4QnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKHZlcnRDb3VudCAqIHN0cmlkZSk7XHJcbiAgICBjb25zdCB2ZXJ0ZXhCdWZmZXJWaWV3ID0gbmV3IERhdGFWaWV3KHZlcnRleEJ1ZmZlcik7XHJcbiAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgY2hhbm5lbHMpIHtcclxuICAgICAgICB3cml0ZUJ1ZmZlcih2ZXJ0ZXhCdWZmZXJWaWV3LCBjaGFubmVsLmRhdGEsIGNoYW5uZWwuYXR0cmlidXRlLmZvcm1hdCwgY2hhbm5lbC5vZmZzZXQsIHN0cmlkZSk7XHJcbiAgICB9XHJcbiAgICBidWZmZXJCbG9iLnNldE5leHRBbGlnbm1lbnQoMCk7XHJcbiAgICBjb25zdCB2ZXJ0ZXhCdW5kbGU6IE1lc2guSVZlcnRleEJ1bmRsZSA9IHtcclxuICAgICAgICBhdHRyaWJ1dGVzLFxyXG4gICAgICAgIHZpZXc6IHtcclxuICAgICAgICAgICAgb2Zmc2V0OiBidWZmZXJCbG9iLmdldExlbmd0aCgpLFxyXG4gICAgICAgICAgICBsZW5ndGg6IHZlcnRleEJ1ZmZlci5ieXRlTGVuZ3RoLFxyXG4gICAgICAgICAgICBjb3VudDogdmVydENvdW50LFxyXG4gICAgICAgICAgICBzdHJpZGUsXHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbiAgICBidWZmZXJCbG9iLmFkZEJ1ZmZlcih2ZXJ0ZXhCdWZmZXIpO1xyXG5cclxuICAgIC8vIEZpbGwgaW5kZXggYnVmZmVyLlxyXG4gICAgbGV0IGluZGV4QnVmZmVyOiBBcnJheUJ1ZmZlciB8IG51bGwgPSBudWxsO1xyXG4gICAgbGV0IGlkeENvdW50ID0gMDtcclxuICAgIGNvbnN0IGlkeFN0cmlkZSA9IDI7XHJcbiAgICBpZiAoZ2VvbWV0cnkuaW5kaWNlcykge1xyXG4gICAgICAgIGNvbnN0IHsgaW5kaWNlcyB9ID0gZ2VvbWV0cnk7XHJcbiAgICAgICAgaWR4Q291bnQgPSBpbmRpY2VzLmxlbmd0aDtcclxuICAgICAgICBpbmRleEJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihpZHhTdHJpZGUgKiBpZHhDb3VudCk7XHJcbiAgICAgICAgY29uc3QgaW5kZXhCdWZmZXJWaWV3ID0gbmV3IERhdGFWaWV3KGluZGV4QnVmZmVyKTtcclxuICAgICAgICB3cml0ZUJ1ZmZlcihpbmRleEJ1ZmZlclZpZXcsIGluZGljZXMsIEdGWEZvcm1hdC5SMTZVSSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ3JlYXRlIHByaW1pdGl2ZS5cclxuICAgIGNvbnN0IHByaW1pdGl2ZTogTWVzaC5JU3ViTWVzaCA9IHtcclxuICAgICAgICBwcmltaXRpdmVNb2RlOiBnZW9tZXRyeS5wcmltaXRpdmVNb2RlIHx8IEdGWFByaW1pdGl2ZU1vZGUuVFJJQU5HTEVfTElTVCxcclxuICAgICAgICB2ZXJ0ZXhCdW5kZWxJbmRpY2VzOiBbMF0sXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChpbmRleEJ1ZmZlcikge1xyXG4gICAgICAgIGJ1ZmZlckJsb2Iuc2V0TmV4dEFsaWdubWVudChpZHhTdHJpZGUpO1xyXG4gICAgICAgIHByaW1pdGl2ZS5pbmRleFZpZXcgPSB7XHJcbiAgICAgICAgICAgIG9mZnNldDogYnVmZmVyQmxvYi5nZXRMZW5ndGgoKSxcclxuICAgICAgICAgICAgbGVuZ3RoOiBpbmRleEJ1ZmZlci5ieXRlTGVuZ3RoLFxyXG4gICAgICAgICAgICBjb3VudDogaWR4Q291bnQsXHJcbiAgICAgICAgICAgIHN0cmlkZTogaWR4U3RyaWRlLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgYnVmZmVyQmxvYi5hZGRCdWZmZXIoaW5kZXhCdWZmZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBtaW5Qb3NpdGlvbiA9IGdlb21ldHJ5Lm1pblBvcztcclxuICAgIGlmICghbWluUG9zaXRpb24gJiYgb3B0aW9ucy5jYWxjdWxhdGVCb3VuZHMpIHtcclxuICAgICAgICBtaW5Qb3NpdGlvbiA9IFZlYzMuc2V0KG5ldyBWZWMzKCksIEluZmluaXR5LCBJbmZpbml0eSwgSW5maW5pdHkpO1xyXG4gICAgICAgIGZvciAobGV0IGlWZXJ0ZXggPSAwOyBpVmVydGV4IDwgdmVydENvdW50OyArK2lWZXJ0ZXgpIHtcclxuICAgICAgICAgICAgVmVjMy5zZXQodjNfMSwgcG9zaXRpb25zW2lWZXJ0ZXggKiAzICsgMF0sIHBvc2l0aW9uc1tpVmVydGV4ICogMyArIDFdLCBwb3NpdGlvbnNbaVZlcnRleCAqIDMgKyAyXSk7XHJcbiAgICAgICAgICAgIFZlYzMubWluKG1pblBvc2l0aW9uLCBtaW5Qb3NpdGlvbiwgdjNfMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IG1heFBvc2l0aW9uID0gZ2VvbWV0cnkubWF4UG9zO1xyXG4gICAgaWYgKCFtYXhQb3NpdGlvbiAmJiBvcHRpb25zLmNhbGN1bGF0ZUJvdW5kcykge1xyXG4gICAgICAgIG1heFBvc2l0aW9uID0gVmVjMy5zZXQobmV3IFZlYzMoKSwgLUluZmluaXR5LCAtSW5maW5pdHksIC1JbmZpbml0eSk7XHJcbiAgICAgICAgZm9yIChsZXQgaVZlcnRleCA9IDA7IGlWZXJ0ZXggPCB2ZXJ0Q291bnQ7ICsraVZlcnRleCkge1xyXG4gICAgICAgICAgICBWZWMzLnNldCh2M18xLCBwb3NpdGlvbnNbaVZlcnRleCAqIDMgKyAwXSwgcG9zaXRpb25zW2lWZXJ0ZXggKiAzICsgMV0sIHBvc2l0aW9uc1tpVmVydGV4ICogMyArIDJdKTtcclxuICAgICAgICAgICAgVmVjMy5tYXgobWF4UG9zaXRpb24sIG1heFBvc2l0aW9uLCB2M18xKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ3JlYXRlIG1lc2ggc3RydWN0LlxyXG4gICAgY29uc3QgbWVzaFN0cnVjdDogTWVzaC5JU3RydWN0ID0ge1xyXG4gICAgICAgIHZlcnRleEJ1bmRsZXM6IFt2ZXJ0ZXhCdW5kbGVdLFxyXG4gICAgICAgIHByaW1pdGl2ZXM6IFtwcmltaXRpdmVdLFxyXG4gICAgfTtcclxuICAgIGlmIChtaW5Qb3NpdGlvbikge1xyXG4gICAgICAgIG1lc2hTdHJ1Y3QubWluUG9zaXRpb24gPSBuZXcgVmVjMyhtaW5Qb3NpdGlvbi54LCBtaW5Qb3NpdGlvbi55LCBtaW5Qb3NpdGlvbi56KTtcclxuICAgIH1cclxuICAgIGlmIChtYXhQb3NpdGlvbikge1xyXG4gICAgICAgIG1lc2hTdHJ1Y3QubWF4UG9zaXRpb24gPSBuZXcgVmVjMyhtYXhQb3NpdGlvbi54LCBtYXhQb3NpdGlvbi55LCBtYXhQb3NpdGlvbi56KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDcmVhdGUgbWVzaC5cclxuICAgIGlmICghb3V0KSB7XHJcbiAgICAgICAgb3V0ID0gbmV3IE1lc2goKTtcclxuICAgIH1cclxuICAgIG91dC5yZXNldCh7XHJcbiAgICAgICAgc3RydWN0OiBtZXNoU3RydWN0LFxyXG4gICAgICAgIGRhdGE6IG5ldyBVaW50OEFycmF5KGJ1ZmZlckJsb2IuZ2V0Q29tYmluZWQoKSksXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gb3V0O1xyXG59XHJcblxyXG5leHBvcnQgZGVjbGFyZSBuYW1lc3BhY2UgY3JlYXRlTWVzaCB7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zIHtcclxuICAgICAgICBjYWxjdWxhdGVCb3VuZHM/OiBib29sZWFuO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==