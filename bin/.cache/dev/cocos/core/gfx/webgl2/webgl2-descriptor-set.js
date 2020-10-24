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
    global.webgl2DescriptorSet = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _descriptorSet) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGL2DescriptorSet = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var WebGL2DescriptorSet = /*#__PURE__*/function (_GFXDescriptorSet) {
    _inherits(WebGL2DescriptorSet, _GFXDescriptorSet);

    function WebGL2DescriptorSet() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGL2DescriptorSet);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGL2DescriptorSet)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gpuDescriptorSet = null;
      return _this;
    }

    _createClass(WebGL2DescriptorSet, [{
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
              if (this._buffers[i]) {
                descriptors[i].gpuBuffer = this._buffers[i].gpuBuffer;
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

    return WebGL2DescriptorSet;
  }(_descriptorSet.GFXDescriptorSet);

  _exports.WebGL2DescriptorSet = WebGL2DescriptorSet;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsMi93ZWJnbDItZGVzY3JpcHRvci1zZXQudHMiXSwibmFtZXMiOlsiV2ViR0wyRGVzY3JpcHRvclNldCIsIl9ncHVEZXNjcmlwdG9yU2V0IiwiaW5mbyIsIl9sYXlvdXQiLCJsYXlvdXQiLCJncHVEZXNjcmlwdG9yU2V0TGF5b3V0IiwiYmluZGluZ3MiLCJkZXNjcmlwdG9yQ291bnQiLCJkZXNjcmlwdG9ySW5kaWNlcyIsIl9idWZmZXJzIiwiQXJyYXkiLCJmaWxsIiwiX3RleHR1cmVzIiwiX3NhbXBsZXJzIiwiZ3B1RGVzY3JpcHRvcnMiLCJpIiwibGVuZ3RoIiwiYmluZGluZyIsImoiLCJjb3VudCIsInB1c2giLCJ0eXBlIiwiZGVzY3JpcHRvclR5cGUiLCJncHVCdWZmZXIiLCJncHVUZXh0dXJlIiwiZ3B1U2FtcGxlciIsIl9pc0RpcnR5IiwiZGVzY3JpcHRvcnMiLCJERVNDUklQVE9SX0JVRkZFUl9UWVBFIiwiREVTQ1JJUFRPUl9TQU1QTEVSX1RZUEUiLCJHRlhEZXNjcmlwdG9yU2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQU9hQSxtQjs7Ozs7Ozs7Ozs7Ozs7O1lBTURDLGlCLEdBQW9ELEk7Ozs7OztpQ0FFekNDLEksRUFBcUM7QUFFcEQsYUFBS0MsT0FBTCxHQUFlRCxJQUFJLENBQUNFLE1BQXBCO0FBRm9ELG9DQUdNRixJQUFJLENBQUNFLE1BQU4sQ0FBMkNDLHNCQUhoRDtBQUFBLFlBRzVDQyxRQUg0Qyx5QkFHNUNBLFFBSDRDO0FBQUEsWUFHbENDLGVBSGtDLHlCQUdsQ0EsZUFIa0M7QUFBQSxZQUdqQkMsaUJBSGlCLHlCQUdqQkEsaUJBSGlCO0FBS3BELGFBQUtDLFFBQUwsR0FBZ0JDLEtBQUssQ0FBQ0gsZUFBRCxDQUFMLENBQXVCSSxJQUF2QixDQUE0QixJQUE1QixDQUFoQjtBQUNBLGFBQUtDLFNBQUwsR0FBaUJGLEtBQUssQ0FBQ0gsZUFBRCxDQUFMLENBQXVCSSxJQUF2QixDQUE0QixJQUE1QixDQUFqQjtBQUNBLGFBQUtFLFNBQUwsR0FBaUJILEtBQUssQ0FBQ0gsZUFBRCxDQUFMLENBQXVCSSxJQUF2QixDQUE0QixJQUE1QixDQUFqQjtBQUVBLFlBQU1HLGNBQXNDLEdBQUcsRUFBL0M7QUFDQSxhQUFLYixpQkFBTCxHQUF5QjtBQUFFYSxVQUFBQSxjQUFjLEVBQWRBLGNBQUY7QUFBa0JOLFVBQUFBLGlCQUFpQixFQUFqQkE7QUFBbEIsU0FBekI7O0FBRUEsYUFBSyxJQUFJTyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHVCxRQUFRLENBQUNVLE1BQTdCLEVBQXFDLEVBQUVELENBQXZDLEVBQTBDO0FBQ3RDLGNBQU1FLE9BQU8sR0FBR1gsUUFBUSxDQUFDUyxDQUFELENBQXhCOztBQUNBLGVBQUssSUFBSUcsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0QsT0FBTyxDQUFDRSxLQUE1QixFQUFtQ0QsQ0FBQyxFQUFwQyxFQUF3QztBQUNwQ0osWUFBQUEsY0FBYyxDQUFDTSxJQUFmLENBQW9CO0FBQ2hCQyxjQUFBQSxJQUFJLEVBQUVKLE9BQU8sQ0FBQ0ssY0FERTtBQUVoQkMsY0FBQUEsU0FBUyxFQUFFLElBRks7QUFHaEJDLGNBQUFBLFVBQVUsRUFBRSxJQUhJO0FBSWhCQyxjQUFBQSxVQUFVLEVBQUU7QUFKSSxhQUFwQjtBQU1IO0FBQ0o7O0FBRUQsZUFBTyxJQUFQO0FBQ0g7OztnQ0FFaUI7QUFDZCxhQUFLdEIsT0FBTCxHQUFlLElBQWY7QUFDQSxhQUFLRixpQkFBTCxHQUF5QixJQUF6QjtBQUNIOzs7K0JBRWdCO0FBQ2IsWUFBSSxLQUFLeUIsUUFBTCxJQUFpQixLQUFLekIsaUJBQTFCLEVBQTZDO0FBQ3pDLGNBQU0wQixXQUFXLEdBQUcsS0FBSzFCLGlCQUFMLENBQXdCYSxjQUE1Qzs7QUFDQSxlQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdZLFdBQVcsQ0FBQ1gsTUFBaEMsRUFBd0MsRUFBRUQsQ0FBMUMsRUFBNkM7QUFDekMsZ0JBQUlZLFdBQVcsQ0FBQ1osQ0FBRCxDQUFYLENBQWVNLElBQWYsR0FBc0JPLHFDQUExQixFQUFrRDtBQUM5QyxrQkFBSSxLQUFLbkIsUUFBTCxDQUFjTSxDQUFkLENBQUosRUFBc0I7QUFDbEJZLGdCQUFBQSxXQUFXLENBQUNaLENBQUQsQ0FBWCxDQUFlUSxTQUFmLEdBQTRCLEtBQUtkLFFBQUwsQ0FBY00sQ0FBZCxDQUFELENBQW1DUSxTQUE5RDtBQUNIO0FBQ0osYUFKRCxNQUlPLElBQUlJLFdBQVcsQ0FBQ1osQ0FBRCxDQUFYLENBQWVNLElBQWYsR0FBc0JRLHNDQUExQixFQUFtRDtBQUN0RCxrQkFBSSxLQUFLakIsU0FBTCxDQUFlRyxDQUFmLENBQUosRUFBdUI7QUFDbkJZLGdCQUFBQSxXQUFXLENBQUNaLENBQUQsQ0FBWCxDQUFlUyxVQUFmLEdBQTZCLEtBQUtaLFNBQUwsQ0FBZUcsQ0FBZixDQUFELENBQXFDUyxVQUFqRTtBQUNIOztBQUNELGtCQUFJLEtBQUtYLFNBQUwsQ0FBZUUsQ0FBZixDQUFKLEVBQXVCO0FBQ25CWSxnQkFBQUEsV0FBVyxDQUFDWixDQUFELENBQVgsQ0FBZVUsVUFBZixHQUE2QixLQUFLWixTQUFMLENBQWVFLENBQWYsQ0FBRCxDQUFxQ1UsVUFBakU7QUFDSDtBQUNKO0FBQ0o7O0FBQ0QsZUFBS0MsUUFBTCxHQUFnQixLQUFoQjtBQUNIO0FBQ0o7OzswQkF6RGdEO0FBQzdDLGVBQU8sS0FBS3pCLGlCQUFaO0FBQ0g7Ozs7SUFKb0M2QiwrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdGWERlc2NyaXB0b3JTZXQsIEdGWERlc2NyaXB0b3JTZXRJbmZvLCBERVNDUklQVE9SX0JVRkZFUl9UWVBFLCBERVNDUklQVE9SX1NBTVBMRVJfVFlQRSB9IGZyb20gJy4uL2Rlc2NyaXB0b3Itc2V0JztcclxuaW1wb3J0IHsgV2ViR0wyQnVmZmVyIH0gZnJvbSAnLi93ZWJnbDItYnVmZmVyJztcclxuaW1wb3J0IHsgSVdlYkdMMkdQVURlc2NyaXB0b3JTZXQsIElXZWJHTDJHUFVEZXNjcmlwdG9yIH0gZnJvbSAnLi93ZWJnbDItZ3B1LW9iamVjdHMnO1xyXG5pbXBvcnQgeyBXZWJHTDJTYW1wbGVyIH0gZnJvbSAnLi93ZWJnbDItc2FtcGxlcic7XHJcbmltcG9ydCB7IFdlYkdMMlRleHR1cmUgfSBmcm9tICcuL3dlYmdsMi10ZXh0dXJlJztcclxuaW1wb3J0IHsgV2ViR0wyRGVzY3JpcHRvclNldExheW91dCB9IGZyb20gJy4vd2ViZ2wyLWRlc2NyaXB0b3Itc2V0LWxheW91dCc7XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0wyRGVzY3JpcHRvclNldCBleHRlbmRzIEdGWERlc2NyaXB0b3JTZXQge1xyXG5cclxuICAgIGdldCBncHVEZXNjcmlwdG9yU2V0ICgpOiBJV2ViR0wyR1BVRGVzY3JpcHRvclNldCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dwdURlc2NyaXB0b3JTZXQgYXMgSVdlYkdMMkdQVURlc2NyaXB0b3JTZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ3B1RGVzY3JpcHRvclNldDogSVdlYkdMMkdQVURlc2NyaXB0b3JTZXQgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoaW5mbzogR0ZYRGVzY3JpcHRvclNldEluZm8pOiBib29sZWFuIHtcclxuXHJcbiAgICAgICAgdGhpcy5fbGF5b3V0ID0gaW5mby5sYXlvdXQ7XHJcbiAgICAgICAgY29uc3QgeyBiaW5kaW5ncywgZGVzY3JpcHRvckNvdW50LCBkZXNjcmlwdG9ySW5kaWNlcyB9ID0gKGluZm8ubGF5b3V0IGFzIFdlYkdMMkRlc2NyaXB0b3JTZXRMYXlvdXQpLmdwdURlc2NyaXB0b3JTZXRMYXlvdXQ7XHJcblxyXG4gICAgICAgIHRoaXMuX2J1ZmZlcnMgPSBBcnJheShkZXNjcmlwdG9yQ291bnQpLmZpbGwobnVsbCk7XHJcbiAgICAgICAgdGhpcy5fdGV4dHVyZXMgPSBBcnJheShkZXNjcmlwdG9yQ291bnQpLmZpbGwobnVsbCk7XHJcbiAgICAgICAgdGhpcy5fc2FtcGxlcnMgPSBBcnJheShkZXNjcmlwdG9yQ291bnQpLmZpbGwobnVsbCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGdwdURlc2NyaXB0b3JzOiBJV2ViR0wyR1BVRGVzY3JpcHRvcltdID0gW107XHJcbiAgICAgICAgdGhpcy5fZ3B1RGVzY3JpcHRvclNldCA9IHsgZ3B1RGVzY3JpcHRvcnMsIGRlc2NyaXB0b3JJbmRpY2VzIH07XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmluZGluZ3MubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgYmluZGluZyA9IGJpbmRpbmdzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJpbmRpbmcuY291bnQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgZ3B1RGVzY3JpcHRvcnMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogYmluZGluZy5kZXNjcmlwdG9yVHlwZSxcclxuICAgICAgICAgICAgICAgICAgICBncHVCdWZmZXI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgZ3B1VGV4dHVyZTogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBncHVTYW1wbGVyOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICB0aGlzLl9sYXlvdXQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2dwdURlc2NyaXB0b3JTZXQgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9pc0RpcnR5ICYmIHRoaXMuX2dwdURlc2NyaXB0b3JTZXQpIHtcclxuICAgICAgICAgICAgY29uc3QgZGVzY3JpcHRvcnMgPSB0aGlzLl9ncHVEZXNjcmlwdG9yU2V0IS5ncHVEZXNjcmlwdG9ycztcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXNjcmlwdG9ycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRlc2NyaXB0b3JzW2ldLnR5cGUgJiBERVNDUklQVE9SX0JVRkZFUl9UWVBFKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2J1ZmZlcnNbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvcnNbaV0uZ3B1QnVmZmVyID0gKHRoaXMuX2J1ZmZlcnNbaV0gYXMgV2ViR0wyQnVmZmVyKS5ncHVCdWZmZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkZXNjcmlwdG9yc1tpXS50eXBlICYgREVTQ1JJUFRPUl9TQU1QTEVSX1RZUEUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fdGV4dHVyZXNbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvcnNbaV0uZ3B1VGV4dHVyZSA9ICh0aGlzLl90ZXh0dXJlc1tpXSBhcyBXZWJHTDJUZXh0dXJlKS5ncHVUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2FtcGxlcnNbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvcnNbaV0uZ3B1U2FtcGxlciA9ICh0aGlzLl9zYW1wbGVyc1tpXSBhcyBXZWJHTDJTYW1wbGVyKS5ncHVTYW1wbGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9pc0RpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==