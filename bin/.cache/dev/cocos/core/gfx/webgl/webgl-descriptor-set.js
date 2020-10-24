(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../descriptor-set.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../descriptor-set.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.descriptorSet);
    global.webglDescriptorSet = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _descriptorSet) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGLDescriptorSet = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGLDescriptorSet = /*#__PURE__*/function (_GFXDescriptorSet) {
    _inherits(WebGLDescriptorSet, _GFXDescriptorSet);

    function WebGLDescriptorSet() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGLDescriptorSet);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGLDescriptorSet)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gpuDescriptorSet = null;
      return _this;
    }

    _createClass(WebGLDescriptorSet, [{
      key: "initialize",
      value: function initialize(info) {
        this._layout = info.layout;
        var _gpuDescriptorSetLayo = info.layout.gpuDescriptorSetLayout,
            bindings = _gpuDescriptorSetLayo.bindings,
            descriptorCount = _gpuDescriptorSetLayo.descriptorCount,
            descriptorIndices = _gpuDescriptorSetLayo.descriptorIndices;
        this._buffers = Array(descriptorCount).fill(null);
        this._textures = Array(descriptorCount).fill(null);
        this._samplers = Array(descriptorCount).fill(null);
        var gpuDescriptors = [];
        this._gpuDescriptorSet = {
          gpuDescriptors: gpuDescriptors,
          descriptorIndices: descriptorIndices
        };

        for (var i = 0; i < bindings.length; ++i) {
          var binding = bindings[i];

          for (var j = 0; j < binding.count; j++) {
            gpuDescriptors.push({
              type: binding.descriptorType,
              gpuBuffer: null,
              gpuTexture: null,
              gpuSampler: null
            });
          }
        }

        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._layout = null;
        this._gpuDescriptorSet = null;
      }
    }, {
      key: "update",
      value: function update() {
        if (this._isDirty && this._gpuDescriptorSet) {
          var descriptors = this._gpuDescriptorSet.gpuDescriptors;

          for (var i = 0; i < descriptors.length; ++i) {
            if (descriptors[i].type & _descriptorSet.DESCRIPTOR_BUFFER_TYPE) {
              var buffer = this._buffers[i];

              if (buffer) {
                descriptors[i].gpuBuffer = buffer.gpuBuffer || buffer.gpuBufferView;
              }
            } else if (descriptors[i].type & _descriptorSet.DESCRIPTOR_SAMPLER_TYPE) {
              if (this._textures[i]) {
                descriptors[i].gpuTexture = this._textures[i].gpuTexture;
              }

              if (this._samplers[i]) {
                descriptors[i].gpuSampler = this._samplers[i].gpuSampler;
              }
            }
          }

          this._isDirty = false;
        }
      }
    }, {
      key: "gpuDescriptorSet",
      get: function get() {
        return this._gpuDescriptorSet;
      }
    }]);

    return WebGLDescriptorSet;
  }(_descriptorSet.GFXDescriptorSet);

  _exports.WebGLDescriptorSet = WebGLDescriptorSet;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsL3dlYmdsLWRlc2NyaXB0b3Itc2V0LnRzIl0sIm5hbWVzIjpbIldlYkdMRGVzY3JpcHRvclNldCIsIl9ncHVEZXNjcmlwdG9yU2V0IiwiaW5mbyIsIl9sYXlvdXQiLCJsYXlvdXQiLCJncHVEZXNjcmlwdG9yU2V0TGF5b3V0IiwiYmluZGluZ3MiLCJkZXNjcmlwdG9yQ291bnQiLCJkZXNjcmlwdG9ySW5kaWNlcyIsIl9idWZmZXJzIiwiQXJyYXkiLCJmaWxsIiwiX3RleHR1cmVzIiwiX3NhbXBsZXJzIiwiZ3B1RGVzY3JpcHRvcnMiLCJpIiwibGVuZ3RoIiwiYmluZGluZyIsImoiLCJjb3VudCIsInB1c2giLCJ0eXBlIiwiZGVzY3JpcHRvclR5cGUiLCJncHVCdWZmZXIiLCJncHVUZXh0dXJlIiwiZ3B1U2FtcGxlciIsIl9pc0RpcnR5IiwiZGVzY3JpcHRvcnMiLCJERVNDUklQVE9SX0JVRkZFUl9UWVBFIiwiYnVmZmVyIiwiZ3B1QnVmZmVyVmlldyIsIkRFU0NSSVBUT1JfU0FNUExFUl9UWVBFIiwiR0ZYRGVzY3JpcHRvclNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFPYUEsa0I7Ozs7Ozs7Ozs7Ozs7OztZQU1EQyxpQixHQUFtRCxJOzs7Ozs7aUNBRXhDQyxJLEVBQXFDO0FBRXBELGFBQUtDLE9BQUwsR0FBZUQsSUFBSSxDQUFDRSxNQUFwQjtBQUZvRCxvQ0FHTUYsSUFBSSxDQUFDRSxNQUFOLENBQTBDQyxzQkFIL0M7QUFBQSxZQUc1Q0MsUUFINEMseUJBRzVDQSxRQUg0QztBQUFBLFlBR2xDQyxlQUhrQyx5QkFHbENBLGVBSGtDO0FBQUEsWUFHakJDLGlCQUhpQix5QkFHakJBLGlCQUhpQjtBQUtwRCxhQUFLQyxRQUFMLEdBQWdCQyxLQUFLLENBQUNILGVBQUQsQ0FBTCxDQUF1QkksSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBaEI7QUFDQSxhQUFLQyxTQUFMLEdBQWlCRixLQUFLLENBQUNILGVBQUQsQ0FBTCxDQUF1QkksSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBakI7QUFDQSxhQUFLRSxTQUFMLEdBQWlCSCxLQUFLLENBQUNILGVBQUQsQ0FBTCxDQUF1QkksSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBakI7QUFFQSxZQUFNRyxjQUFxQyxHQUFHLEVBQTlDO0FBQ0EsYUFBS2IsaUJBQUwsR0FBeUI7QUFBRWEsVUFBQUEsY0FBYyxFQUFkQSxjQUFGO0FBQWtCTixVQUFBQSxpQkFBaUIsRUFBakJBO0FBQWxCLFNBQXpCOztBQUVBLGFBQUssSUFBSU8sQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR1QsUUFBUSxDQUFDVSxNQUE3QixFQUFxQyxFQUFFRCxDQUF2QyxFQUEwQztBQUN0QyxjQUFNRSxPQUFPLEdBQUdYLFFBQVEsQ0FBQ1MsQ0FBRCxDQUF4Qjs7QUFDQSxlQUFLLElBQUlHLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdELE9BQU8sQ0FBQ0UsS0FBNUIsRUFBbUNELENBQUMsRUFBcEMsRUFBd0M7QUFDcENKLFlBQUFBLGNBQWMsQ0FBQ00sSUFBZixDQUFvQjtBQUNoQkMsY0FBQUEsSUFBSSxFQUFFSixPQUFPLENBQUNLLGNBREU7QUFFaEJDLGNBQUFBLFNBQVMsRUFBRSxJQUZLO0FBR2hCQyxjQUFBQSxVQUFVLEVBQUUsSUFISTtBQUloQkMsY0FBQUEsVUFBVSxFQUFFO0FBSkksYUFBcEI7QUFNSDtBQUNKOztBQUVELGVBQU8sSUFBUDtBQUNIOzs7Z0NBRWlCO0FBQ2QsYUFBS3RCLE9BQUwsR0FBZSxJQUFmO0FBQ0EsYUFBS0YsaUJBQUwsR0FBeUIsSUFBekI7QUFDSDs7OytCQUVnQjtBQUNiLFlBQUksS0FBS3lCLFFBQUwsSUFBaUIsS0FBS3pCLGlCQUExQixFQUE2QztBQUN6QyxjQUFNMEIsV0FBVyxHQUFHLEtBQUsxQixpQkFBTCxDQUF3QmEsY0FBNUM7O0FBQ0EsZUFBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHWSxXQUFXLENBQUNYLE1BQWhDLEVBQXdDLEVBQUVELENBQTFDLEVBQTZDO0FBQ3pDLGdCQUFJWSxXQUFXLENBQUNaLENBQUQsQ0FBWCxDQUFlTSxJQUFmLEdBQXNCTyxxQ0FBMUIsRUFBa0Q7QUFDOUMsa0JBQU1DLE1BQU0sR0FBRyxLQUFLcEIsUUFBTCxDQUFjTSxDQUFkLENBQWY7O0FBQ0Esa0JBQUljLE1BQUosRUFBWTtBQUNSRixnQkFBQUEsV0FBVyxDQUFDWixDQUFELENBQVgsQ0FBZVEsU0FBZixHQUEyQk0sTUFBTSxDQUFDTixTQUFQLElBQW9CTSxNQUFNLENBQUNDLGFBQXREO0FBQ0g7QUFDSixhQUxELE1BS08sSUFBSUgsV0FBVyxDQUFDWixDQUFELENBQVgsQ0FBZU0sSUFBZixHQUFzQlUsc0NBQTFCLEVBQW1EO0FBQ3RELGtCQUFJLEtBQUtuQixTQUFMLENBQWVHLENBQWYsQ0FBSixFQUF1QjtBQUNuQlksZ0JBQUFBLFdBQVcsQ0FBQ1osQ0FBRCxDQUFYLENBQWVTLFVBQWYsR0FBNkIsS0FBS1osU0FBTCxDQUFlRyxDQUFmLENBQUQsQ0FBb0NTLFVBQWhFO0FBQ0g7O0FBQ0Qsa0JBQUksS0FBS1gsU0FBTCxDQUFlRSxDQUFmLENBQUosRUFBdUI7QUFDbkJZLGdCQUFBQSxXQUFXLENBQUNaLENBQUQsQ0FBWCxDQUFlVSxVQUFmLEdBQTZCLEtBQUtaLFNBQUwsQ0FBZUUsQ0FBZixDQUFELENBQW9DVSxVQUFoRTtBQUNIO0FBQ0o7QUFDSjs7QUFDRCxlQUFLQyxRQUFMLEdBQWdCLEtBQWhCO0FBQ0g7QUFDSjs7OzBCQTFEK0M7QUFDNUMsZUFBTyxLQUFLekIsaUJBQVo7QUFDSDs7OztJQUptQytCLCtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR0ZYRGVzY3JpcHRvclNldCwgR0ZYRGVzY3JpcHRvclNldEluZm8sIERFU0NSSVBUT1JfU0FNUExFUl9UWVBFLCBERVNDUklQVE9SX0JVRkZFUl9UWVBFIH0gZnJvbSAnLi4vZGVzY3JpcHRvci1zZXQnO1xyXG5pbXBvcnQgeyBXZWJHTEJ1ZmZlciB9IGZyb20gJy4vd2ViZ2wtYnVmZmVyJztcclxuaW1wb3J0IHsgSVdlYkdMR1BVRGVzY3JpcHRvclNldCwgSVdlYkdMR1BVRGVzY3JpcHRvciB9IGZyb20gJy4vd2ViZ2wtZ3B1LW9iamVjdHMnO1xyXG5pbXBvcnQgeyBXZWJHTFNhbXBsZXIgfSBmcm9tICcuL3dlYmdsLXNhbXBsZXInO1xyXG5pbXBvcnQgeyBXZWJHTFRleHR1cmUgfSBmcm9tICcuL3dlYmdsLXRleHR1cmUnO1xyXG5pbXBvcnQgeyBXZWJHTERlc2NyaXB0b3JTZXRMYXlvdXQgfSBmcm9tICcuL3dlYmdsLWRlc2NyaXB0b3Itc2V0LWxheW91dCc7XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0xEZXNjcmlwdG9yU2V0IGV4dGVuZHMgR0ZYRGVzY3JpcHRvclNldCB7XHJcblxyXG4gICAgZ2V0IGdwdURlc2NyaXB0b3JTZXQgKCk6IElXZWJHTEdQVURlc2NyaXB0b3JTZXQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ncHVEZXNjcmlwdG9yU2V0IGFzIElXZWJHTEdQVURlc2NyaXB0b3JTZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ3B1RGVzY3JpcHRvclNldDogSVdlYkdMR1BVRGVzY3JpcHRvclNldCB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBHRlhEZXNjcmlwdG9yU2V0SW5mbyk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICB0aGlzLl9sYXlvdXQgPSBpbmZvLmxheW91dDtcclxuICAgICAgICBjb25zdCB7IGJpbmRpbmdzLCBkZXNjcmlwdG9yQ291bnQsIGRlc2NyaXB0b3JJbmRpY2VzIH0gPSAoaW5mby5sYXlvdXQgYXMgV2ViR0xEZXNjcmlwdG9yU2V0TGF5b3V0KS5ncHVEZXNjcmlwdG9yU2V0TGF5b3V0O1xyXG5cclxuICAgICAgICB0aGlzLl9idWZmZXJzID0gQXJyYXkoZGVzY3JpcHRvckNvdW50KS5maWxsKG51bGwpO1xyXG4gICAgICAgIHRoaXMuX3RleHR1cmVzID0gQXJyYXkoZGVzY3JpcHRvckNvdW50KS5maWxsKG51bGwpO1xyXG4gICAgICAgIHRoaXMuX3NhbXBsZXJzID0gQXJyYXkoZGVzY3JpcHRvckNvdW50KS5maWxsKG51bGwpO1xyXG5cclxuICAgICAgICBjb25zdCBncHVEZXNjcmlwdG9yczogSVdlYkdMR1BVRGVzY3JpcHRvcltdID0gW107XHJcbiAgICAgICAgdGhpcy5fZ3B1RGVzY3JpcHRvclNldCA9IHsgZ3B1RGVzY3JpcHRvcnMsIGRlc2NyaXB0b3JJbmRpY2VzIH07XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmluZGluZ3MubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgYmluZGluZyA9IGJpbmRpbmdzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJpbmRpbmcuY291bnQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgZ3B1RGVzY3JpcHRvcnMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogYmluZGluZy5kZXNjcmlwdG9yVHlwZSxcclxuICAgICAgICAgICAgICAgICAgICBncHVCdWZmZXI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgZ3B1VGV4dHVyZTogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBncHVTYW1wbGVyOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICB0aGlzLl9sYXlvdXQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2dwdURlc2NyaXB0b3JTZXQgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9pc0RpcnR5ICYmIHRoaXMuX2dwdURlc2NyaXB0b3JTZXQpIHtcclxuICAgICAgICAgICAgY29uc3QgZGVzY3JpcHRvcnMgPSB0aGlzLl9ncHVEZXNjcmlwdG9yU2V0IS5ncHVEZXNjcmlwdG9ycztcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXNjcmlwdG9ycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRlc2NyaXB0b3JzW2ldLnR5cGUgJiBERVNDUklQVE9SX0JVRkZFUl9UWVBFKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYnVmZmVyID0gdGhpcy5fYnVmZmVyc1tpXSBhcyBXZWJHTEJ1ZmZlciB8IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdG9yc1tpXS5ncHVCdWZmZXIgPSBidWZmZXIuZ3B1QnVmZmVyIHx8IGJ1ZmZlci5ncHVCdWZmZXJWaWV3O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVzY3JpcHRvcnNbaV0udHlwZSAmIERFU0NSSVBUT1JfU0FNUExFUl9UWVBFKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RleHR1cmVzW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0b3JzW2ldLmdwdVRleHR1cmUgPSAodGhpcy5fdGV4dHVyZXNbaV0gYXMgV2ViR0xUZXh0dXJlKS5ncHVUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2FtcGxlcnNbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvcnNbaV0uZ3B1U2FtcGxlciA9ICh0aGlzLl9zYW1wbGVyc1tpXSBhcyBXZWJHTFNhbXBsZXIpLmdwdVNhbXBsZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2lzRGlydHkgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19