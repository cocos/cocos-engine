(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../scene/model.js", "../scene/submodel.js", "../core/memory-pools.js", "../../pipeline/define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../scene/model.js"), require("../scene/submodel.js"), require("../core/memory-pools.js"), require("../../pipeline/define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.model, global.submodel, global.memoryPools, global.define);
    global.uiBatchModel = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _model, _submodel, _memoryPools, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.UIBatchModel = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

  var UIBatchModel = /*#__PURE__*/function (_Model) {
    _inherits(UIBatchModel, _Model);

    function UIBatchModel() {
      var _this;

      _classCallCheck(this, UIBatchModel);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(UIBatchModel).call(this));
      _this.type = _model.ModelType.UI_BATCH;
      return _this;
    }

    _createClass(UIBatchModel, [{
      key: "initialize",
      value: function initialize() {
        _get(_getPrototypeOf(UIBatchModel.prototype), "initialize", this).call(this);

        this._subModel = new UISubModel();

        this._subModel.initialize();

        this._subModels[0] = this._subModel;
      }
    }, {
      key: "updateTransform",
      value: function updateTransform() {}
    }, {
      key: "updateUBOs",
      value: function updateUBOs(stamp) {
        // Should updatePass when updateUBOs
        var subModels = this._subModels;

        for (var i = 0; i < subModels.length; i++) {
          subModels[i].update();
        }

        this._updateStamp = stamp;

        if (!this._transformUpdated) {
          return;
        }

        this._transformUpdated = false;
      }
    }, {
      key: "directInitialize",
      value: function directInitialize(batch) {
        this._subModel.directInitialize(batch.material.passes, batch.hInputAssembler, batch.hDescriptorSet);

        _memoryPools.SubModelArrayPool.assign(this._subModelArrayHandle, 0, this._subModel.handle);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._subModel.destroy();

        _get(_getPrototypeOf(UIBatchModel.prototype), "destroy", this).call(this);
      }
    }]);

    return UIBatchModel;
  }(_model.Model);

  _exports.UIBatchModel = UIBatchModel;

  var UISubModel = /*#__PURE__*/function (_SubModel) {
    _inherits(UISubModel, _SubModel);

    function UISubModel() {
      _classCallCheck(this, UISubModel);

      return _possibleConstructorReturn(this, _getPrototypeOf(UISubModel).apply(this, arguments));
    }

    _createClass(UISubModel, [{
      key: "initialize",
      value: function initialize() {
        this._handle = _memoryPools.SubModelPool.alloc();

        _memoryPools.SubModelPool.set(this._handle, _memoryPools.SubModelView.PRIORITY, _define.RenderPriority.DEFAULT);
      }
    }, {
      key: "directInitialize",
      value: function directInitialize(passes, iaHandle, dsHandle) {
        this._passes = passes;

        this._flushPassInfo();

        _memoryPools.SubModelPool.set(this._handle, _memoryPools.SubModelView.INPUT_ASSEMBLER, iaHandle);

        _memoryPools.SubModelPool.set(this._handle, _memoryPools.SubModelView.DESCRIPTOR_SET, dsHandle);

        this._inputAssembler = _memoryPools.IAPool.get(iaHandle);
        this._descriptorSet = _memoryPools.DSPool.get(dsHandle);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _memoryPools.SubModelPool.free(this._handle);

        this._descriptorSet = null;
        this._inputAssembler = null;
        this._priority = _define.RenderPriority.DEFAULT;
        this._handle = _memoryPools.NULL_HANDLE;
        this._patches = null;
        this._subMesh = null;
        this._passes = null;
      }
    }]);

    return UISubModel;
  }(_submodel.SubModel);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvdWkvdWktYmF0Y2gtbW9kZWwudHMiXSwibmFtZXMiOlsiVUlCYXRjaE1vZGVsIiwidHlwZSIsIk1vZGVsVHlwZSIsIlVJX0JBVENIIiwiX3N1Yk1vZGVsIiwiVUlTdWJNb2RlbCIsImluaXRpYWxpemUiLCJfc3ViTW9kZWxzIiwic3RhbXAiLCJzdWJNb2RlbHMiLCJpIiwibGVuZ3RoIiwidXBkYXRlIiwiX3VwZGF0ZVN0YW1wIiwiX3RyYW5zZm9ybVVwZGF0ZWQiLCJiYXRjaCIsImRpcmVjdEluaXRpYWxpemUiLCJtYXRlcmlhbCIsInBhc3NlcyIsImhJbnB1dEFzc2VtYmxlciIsImhEZXNjcmlwdG9yU2V0IiwiU3ViTW9kZWxBcnJheVBvb2wiLCJhc3NpZ24iLCJfc3ViTW9kZWxBcnJheUhhbmRsZSIsImhhbmRsZSIsImRlc3Ryb3kiLCJNb2RlbCIsIl9oYW5kbGUiLCJTdWJNb2RlbFBvb2wiLCJhbGxvYyIsInNldCIsIlN1Yk1vZGVsVmlldyIsIlBSSU9SSVRZIiwiUmVuZGVyUHJpb3JpdHkiLCJERUZBVUxUIiwiaWFIYW5kbGUiLCJkc0hhbmRsZSIsIl9wYXNzZXMiLCJfZmx1c2hQYXNzSW5mbyIsIklOUFVUX0FTU0VNQkxFUiIsIkRFU0NSSVBUT1JfU0VUIiwiX2lucHV0QXNzZW1ibGVyIiwiSUFQb29sIiwiZ2V0IiwiX2Rlc2NyaXB0b3JTZXQiLCJEU1Bvb2wiLCJmcmVlIiwiX3ByaW9yaXR5IiwiTlVMTF9IQU5ETEUiLCJfcGF0Y2hlcyIsIl9zdWJNZXNoIiwiU3ViTW9kZWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQW1DYUEsWTs7O0FBSVQsNEJBQWU7QUFBQTs7QUFBQTs7QUFDWDtBQUNBLFlBQUtDLElBQUwsR0FBWUMsaUJBQVVDLFFBQXRCO0FBRlc7QUFHZDs7OzttQ0FFb0I7QUFDakI7O0FBRUEsYUFBS0MsU0FBTCxHQUFpQixJQUFJQyxVQUFKLEVBQWpCOztBQUNBLGFBQUtELFNBQUwsQ0FBZUUsVUFBZjs7QUFDQSxhQUFLQyxVQUFMLENBQWdCLENBQWhCLElBQXFCLEtBQUtILFNBQTFCO0FBQ0g7Ozt3Q0FFeUIsQ0FBRTs7O2lDQUVUSSxLLEVBQWU7QUFDOUI7QUFDQSxZQUFNQyxTQUFTLEdBQUcsS0FBS0YsVUFBdkI7O0FBQ0EsYUFBSyxJQUFJRyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRCxTQUFTLENBQUNFLE1BQTlCLEVBQXNDRCxDQUFDLEVBQXZDLEVBQTJDO0FBQ3ZDRCxVQUFBQSxTQUFTLENBQUNDLENBQUQsQ0FBVCxDQUFhRSxNQUFiO0FBQ0g7O0FBQ0QsYUFBS0MsWUFBTCxHQUFvQkwsS0FBcEI7O0FBRUEsWUFBSSxDQUFDLEtBQUtNLGlCQUFWLEVBQTZCO0FBQUU7QUFBUzs7QUFDeEMsYUFBS0EsaUJBQUwsR0FBeUIsS0FBekI7QUFDSDs7O3VDQUV3QkMsSyxFQUFvQjtBQUN6QyxhQUFLWCxTQUFMLENBQWVZLGdCQUFmLENBQWdDRCxLQUFLLENBQUNFLFFBQU4sQ0FBZ0JDLE1BQWhELEVBQXdESCxLQUFLLENBQUNJLGVBQTlELEVBQStFSixLQUFLLENBQUNLLGNBQXJGOztBQUNBQyx1Q0FBa0JDLE1BQWxCLENBQXlCLEtBQUtDLG9CQUE5QixFQUFvRCxDQUFwRCxFQUF1RCxLQUFLbkIsU0FBTCxDQUFlb0IsTUFBdEU7QUFDSDs7O2dDQUVpQjtBQUNkLGFBQUtwQixTQUFMLENBQWVxQixPQUFmOztBQUNBO0FBQ0g7Ozs7SUF2QzZCQyxZOzs7O01BMEM1QnJCLFU7Ozs7Ozs7Ozs7O21DQUVtQjtBQUNqQixhQUFLc0IsT0FBTCxHQUFlQywwQkFBYUMsS0FBYixFQUFmOztBQUNBRCxrQ0FBYUUsR0FBYixDQUFpQixLQUFLSCxPQUF0QixFQUErQkksMEJBQWFDLFFBQTVDLEVBQXNEQyx1QkFBZUMsT0FBckU7QUFDSDs7O3VDQUV3QmhCLE0sRUFBZ0JpQixRLEVBQWdDQyxRLEVBQStCO0FBQ3BHLGFBQUtDLE9BQUwsR0FBZW5CLE1BQWY7O0FBQ0EsYUFBS29CLGNBQUw7O0FBRUFWLGtDQUFhRSxHQUFiLENBQWlCLEtBQUtILE9BQXRCLEVBQStCSSwwQkFBYVEsZUFBNUMsRUFBNkRKLFFBQTdEOztBQUNBUCxrQ0FBYUUsR0FBYixDQUFpQixLQUFLSCxPQUF0QixFQUErQkksMEJBQWFTLGNBQTVDLEVBQTRESixRQUE1RDs7QUFFQSxhQUFLSyxlQUFMLEdBQXVCQyxvQkFBT0MsR0FBUCxDQUFXUixRQUFYLENBQXZCO0FBQ0EsYUFBS1MsY0FBTCxHQUFzQkMsb0JBQU9GLEdBQVAsQ0FBV1AsUUFBWCxDQUF0QjtBQUNIOzs7Z0NBRWlCO0FBQ2RSLGtDQUFha0IsSUFBYixDQUFrQixLQUFLbkIsT0FBdkI7O0FBRUEsYUFBS2lCLGNBQUwsR0FBc0IsSUFBdEI7QUFDQSxhQUFLSCxlQUFMLEdBQXVCLElBQXZCO0FBQ0EsYUFBS00sU0FBTCxHQUFpQmQsdUJBQWVDLE9BQWhDO0FBQ0EsYUFBS1AsT0FBTCxHQUFlcUIsd0JBQWY7QUFFQSxhQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsYUFBS0MsUUFBTCxHQUFnQixJQUFoQjtBQUNBLGFBQUtiLE9BQUwsR0FBZSxJQUFmO0FBQ0g7Ozs7SUE3Qm9CYyxrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyBNb2RlbCwgTW9kZWxUeXBlIH0gZnJvbSAnLi4vc2NlbmUvbW9kZWwnO1xyXG5pbXBvcnQgeyBTdWJNb2RlbCB9IGZyb20gJy4uL3NjZW5lL3N1Ym1vZGVsJztcclxuaW1wb3J0IHsgVUlEcmF3QmF0Y2ggfSBmcm9tICcuL3VpLWRyYXctYmF0Y2gnO1xyXG5pbXBvcnQgeyBQYXNzIH0gZnJvbSAnLi4vY29yZS9wYXNzJztcclxuaW1wb3J0IHsgU3ViTW9kZWxQb29sLCBJbnB1dEFzc2VtYmxlckhhbmRsZSwgRGVzY3JpcHRvclNldEhhbmRsZSwgU3ViTW9kZWxWaWV3LCBJQVBvb2wsIERTUG9vbCwgTlVMTF9IQU5ETEUsIFN1Yk1vZGVsQXJyYXlQb29sIH0gZnJvbSAnLi4vY29yZS9tZW1vcnktcG9vbHMnO1xyXG5pbXBvcnQgeyBSZW5kZXJQcmlvcml0eSB9IGZyb20gJy4uLy4uL3BpcGVsaW5lL2RlZmluZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgVUlCYXRjaE1vZGVsIGV4dGVuZHMgTW9kZWwge1xyXG5cclxuICAgIHByaXZhdGUgX3N1Yk1vZGVsITogVUlTdWJNb2RlbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnR5cGUgPSBNb2RlbFR5cGUuVUlfQkFUQ0g7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXRpYWxpemUgKCkge1xyXG4gICAgICAgIHN1cGVyLmluaXRpYWxpemUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fc3ViTW9kZWwgPSBuZXcgVUlTdWJNb2RlbCgpO1xyXG4gICAgICAgIHRoaXMuX3N1Yk1vZGVsLmluaXRpYWxpemUoKTtcclxuICAgICAgICB0aGlzLl9zdWJNb2RlbHNbMF0gPSB0aGlzLl9zdWJNb2RlbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlVHJhbnNmb3JtICgpIHt9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZVVCT3MgKHN0YW1wOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBTaG91bGQgdXBkYXRlUGFzcyB3aGVuIHVwZGF0ZVVCT3NcclxuICAgICAgICBjb25zdCBzdWJNb2RlbHMgPSB0aGlzLl9zdWJNb2RlbHM7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJNb2RlbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgc3ViTW9kZWxzW2ldLnVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl91cGRhdGVTdGFtcCA9IHN0YW1wO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX3RyYW5zZm9ybVVwZGF0ZWQpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgdGhpcy5fdHJhbnNmb3JtVXBkYXRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXJlY3RJbml0aWFsaXplIChiYXRjaDogVUlEcmF3QmF0Y2gpIHtcclxuICAgICAgICB0aGlzLl9zdWJNb2RlbC5kaXJlY3RJbml0aWFsaXplKGJhdGNoLm1hdGVyaWFsIS5wYXNzZXMsIGJhdGNoLmhJbnB1dEFzc2VtYmxlciwgYmF0Y2guaERlc2NyaXB0b3JTZXQhKTtcclxuICAgICAgICBTdWJNb2RlbEFycmF5UG9vbC5hc3NpZ24odGhpcy5fc3ViTW9kZWxBcnJheUhhbmRsZSwgMCwgdGhpcy5fc3ViTW9kZWwuaGFuZGxlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgdGhpcy5fc3ViTW9kZWwuZGVzdHJveSgpO1xyXG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVUlTdWJNb2RlbCBleHRlbmRzIFN1Yk1vZGVsIHtcclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoKSB7XHJcbiAgICAgICAgdGhpcy5faGFuZGxlID0gU3ViTW9kZWxQb29sLmFsbG9jKCk7XHJcbiAgICAgICAgU3ViTW9kZWxQb29sLnNldCh0aGlzLl9oYW5kbGUsIFN1Yk1vZGVsVmlldy5QUklPUklUWSwgUmVuZGVyUHJpb3JpdHkuREVGQVVMVCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpcmVjdEluaXRpYWxpemUgKHBhc3NlczogUGFzc1tdLCBpYUhhbmRsZTogSW5wdXRBc3NlbWJsZXJIYW5kbGUsIGRzSGFuZGxlOiBEZXNjcmlwdG9yU2V0SGFuZGxlKSB7XHJcbiAgICAgICAgdGhpcy5fcGFzc2VzID0gcGFzc2VzO1xyXG4gICAgICAgIHRoaXMuX2ZsdXNoUGFzc0luZm8oKTtcclxuXHJcbiAgICAgICAgU3ViTW9kZWxQb29sLnNldCh0aGlzLl9oYW5kbGUsIFN1Yk1vZGVsVmlldy5JTlBVVF9BU1NFTUJMRVIsIGlhSGFuZGxlKTtcclxuICAgICAgICBTdWJNb2RlbFBvb2wuc2V0KHRoaXMuX2hhbmRsZSwgU3ViTW9kZWxWaWV3LkRFU0NSSVBUT1JfU0VULCBkc0hhbmRsZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2lucHV0QXNzZW1ibGVyID0gSUFQb29sLmdldChpYUhhbmRsZSk7XHJcbiAgICAgICAgdGhpcy5fZGVzY3JpcHRvclNldCA9IERTUG9vbC5nZXQoZHNIYW5kbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICBTdWJNb2RlbFBvb2wuZnJlZSh0aGlzLl9oYW5kbGUpO1xyXG5cclxuICAgICAgICB0aGlzLl9kZXNjcmlwdG9yU2V0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9pbnB1dEFzc2VtYmxlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fcHJpb3JpdHkgPSBSZW5kZXJQcmlvcml0eS5ERUZBVUxUO1xyXG4gICAgICAgIHRoaXMuX2hhbmRsZSA9IE5VTExfSEFORExFO1xyXG5cclxuICAgICAgICB0aGlzLl9wYXRjaGVzID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9zdWJNZXNoID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9wYXNzZXMgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==