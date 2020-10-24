(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../default-constants.js", "../../assets/material.js", "../../components/component.js", "../../data/decorators/index.js", "../../renderer/core/material-instance.js", "../../scene-graph/layers.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../default-constants.js"), require("../../assets/material.js"), require("../../components/component.js"), require("../../data/decorators/index.js"), require("../../renderer/core/material-instance.js"), require("../../scene-graph/layers.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.defaultConstants, global.material, global.component, global.index, global.materialInstance, global.layers, global.globalExports);
    global.renderableComponent = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _defaultConstants, _material, _component, _index, _materialInstance, _layers, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.RenderableComponent = void 0;

  var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var _matInsInfo = {
    parent: null,
    owner: null,
    subModelIdx: 0
  };
  var RenderableComponent = (_dec = (0, _index.ccclass)('cc.RenderableComponent'), _dec2 = (0, _index.type)([_material.Material]), _dec3 = (0, _index.type)(_material.Material), _dec4 = (0, _index.displayName)('Materials'), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
    _inherits(RenderableComponent, _Component);

    function RenderableComponent() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, RenderableComponent);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(RenderableComponent)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_materials", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_visFlags", _descriptor2, _assertThisInitialized(_this));

      _this._materialInstances = [];
      _this._models = [];
      return _this;
    }

    _createClass(RenderableComponent, [{
      key: "getMaterial",

      /**
       * @en Get the shared material asset of the specified sub-model.
       * @zh 获取指定子模型的共享材质资源。
       */
      value: function getMaterial(idx) {
        if (idx < 0 || idx >= this._materials.length) {
          return null;
        }

        return this._materials[idx];
      }
      /**
       * @en Set the shared material asset of the specified sub-model,
       * new material instance will be created automatically if the sub-model is already using one.
       * @zh 设置指定子模型的 sharedMaterial，如果对应位置有材质实例则会创建一个对应的材质实例。
       */

    }, {
      key: "setMaterial",
      value: function setMaterial(material, index) {
        if (material && material instanceof _materialInstance.MaterialInstance) {
          console.error('Can\'t set a material instance to a sharedMaterial slot');
        }

        this._materials[index] = material;
        var inst = this._materialInstances[index];

        if (inst) {
          if (inst.parent !== this._materials[index]) {
            inst.destroy();
            this._materialInstances[index] = null;

            this._onMaterialModified(index, this._materials[index]);
          }
        } else {
          this._onMaterialModified(index, this._materials[index]);
        }
      }
    }, {
      key: "getMaterialInstance",

      /**
       * @en Get the material instance of the specified sub-model.
       * @zh 获取指定子模型的材质实例。
       */
      value: function getMaterialInstance(idx) {
        var mat = this._materials[idx];

        if (!mat) {
          return null;
        }

        if (!this._materialInstances[idx]) {
          _matInsInfo.parent = this._materials[idx];
          _matInsInfo.owner = this;
          _matInsInfo.subModelIdx = idx;
          var instantiated = new _materialInstance.MaterialInstance(_matInsInfo);
          this.setMaterialInstance(idx, instantiated);
        }

        return this._materialInstances[idx];
      }
      /**
       * @en Set the material instance of the specified sub-model.
       * @zh 获取指定子模型的材质实例。
       */

    }, {
      key: "setMaterialInstance",
      value: function setMaterialInstance(index, matInst) {
        if (matInst && matInst.parent) {
          if (matInst !== this._materialInstances[index]) {
            this._materialInstances[index] = matInst;

            this._onMaterialModified(index, matInst);
          }
        } else {
          if (matInst !== this._materials[index]) {
            this.setMaterial(matInst, index);
          }
        }
      }
      /**
       * @en Get the actual rendering material of the specified sub-model.
       * (material instance if there is one, or the shared material asset)
       * @zh 获取指定位置可供渲染的材质，如果有材质实例则使用材质实例，如果没有则使用材质资源
       */

    }, {
      key: "getRenderMaterial",
      value: function getRenderMaterial(index) {
        return this._materialInstances[index] || this._materials[index];
      }
    }, {
      key: "_collectModels",
      value: function _collectModels() {
        return this._models;
      }
    }, {
      key: "_attachToScene",
      value: function _attachToScene() {}
    }, {
      key: "_detachFromScene",
      value: function _detachFromScene() {}
    }, {
      key: "_onMaterialModified",
      value: function _onMaterialModified(index, material) {}
    }, {
      key: "_onRebuildPSO",
      value: function _onRebuildPSO(index, material) {}
    }, {
      key: "_clearMaterials",
      value: function _clearMaterials() {}
    }, {
      key: "_onVisibilityChange",
      value: function _onVisibilityChange(val) {}
    }, {
      key: "visibility",
      get: function get() {
        return this._visFlags;
      },
      set: function set(val) {
        this._visFlags = val;

        this._onVisibilityChange(val);
      }
    }, {
      key: "sharedMaterials",
      get: function get() {
        // if we don't create an array copy, the editor will modify the original array directly.
        return _defaultConstants.EDITOR && this._materials.slice() || this._materials;
      },
      set: function set(val) {
        for (var i = 0; i < val.length; i++) {
          if (val[i] !== this._materials[i]) {
            this.setMaterial(val[i], i);
          }
        }

        if (val.length < this._materials.length) {
          for (var _i = val.length; _i < this._materials.length; _i++) {
            this.setMaterial(null, _i);
          }

          this._materials.splice(val.length);
        }
      }
      /**
       * @en The materials of the model.
       * @zh 模型材质。
       */

    }, {
      key: "materials",
      get: function get() {
        for (var i = 0; i < this._materials.length; i++) {
          this._materialInstances[i] = this.getMaterialInstance(i);
        }

        return this._materialInstances;
      },
      set: function set(val) {
        var dLen = val.length - this._materials.length;

        if (dLen > 0) {
          this._materials.length = val.length;
          this._materialInstances.length = val.length;
        } else if (dLen < 0) {
          for (var i = this._materials.length - dLen; i < this._materials.length; ++i) {
            this.setMaterialInstance(i, null);
          }
        }

        for (var _i2 = 0; _i2 < this._materialInstances.length; _i2++) {
          // tslint:disable-next-line: triple-equals // both of them may be undefined or null
          if (this._materialInstances[_i2] != val[_i2]) {
            this.setMaterialInstance(_i2, val[_i2]);
          }
        }
      }
    }, {
      key: "sharedMaterial",
      get: function get() {
        return this.getMaterial(0);
      }
    }, {
      key: "material",
      get: function get() {
        return this.getMaterialInstance(0);
      },
      set: function set(val) {
        if (this._materials.length === 1 && this._materials[0] === val) {
          return;
        }

        this.setMaterialInstance(0, val);
      }
    }]);

    return RenderableComponent;
  }(_component.Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_materials", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_visFlags", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _layers.Layers.Enum.NONE;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "sharedMaterials", [_dec3, _dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "sharedMaterials"), _class2.prototype)), _class2)) || _class);
  _exports.RenderableComponent = RenderableComponent;
  _globalExports.legacyCC.RenderableComponent = RenderableComponent;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvM2QvZnJhbWV3b3JrL3JlbmRlcmFibGUtY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbIl9tYXRJbnNJbmZvIiwicGFyZW50Iiwib3duZXIiLCJzdWJNb2RlbElkeCIsIlJlbmRlcmFibGVDb21wb25lbnQiLCJNYXRlcmlhbCIsIl9tYXRlcmlhbEluc3RhbmNlcyIsIl9tb2RlbHMiLCJpZHgiLCJfbWF0ZXJpYWxzIiwibGVuZ3RoIiwibWF0ZXJpYWwiLCJpbmRleCIsIk1hdGVyaWFsSW5zdGFuY2UiLCJjb25zb2xlIiwiZXJyb3IiLCJpbnN0IiwiZGVzdHJveSIsIl9vbk1hdGVyaWFsTW9kaWZpZWQiLCJtYXQiLCJpbnN0YW50aWF0ZWQiLCJzZXRNYXRlcmlhbEluc3RhbmNlIiwibWF0SW5zdCIsInNldE1hdGVyaWFsIiwidmFsIiwiX3Zpc0ZsYWdzIiwiX29uVmlzaWJpbGl0eUNoYW5nZSIsIkVESVRPUiIsInNsaWNlIiwiaSIsInNwbGljZSIsImdldE1hdGVyaWFsSW5zdGFuY2UiLCJkTGVuIiwiZ2V0TWF0ZXJpYWwiLCJDb21wb25lbnQiLCJzZXJpYWxpemFibGUiLCJMYXllcnMiLCJFbnVtIiwiTk9ORSIsImxlZ2FjeUNDIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBYUEsTUFBTUEsV0FBa0MsR0FBRztBQUN2Q0MsSUFBQUEsTUFBTSxFQUFFLElBRCtCO0FBRXZDQyxJQUFBQSxLQUFLLEVBQUUsSUFGZ0M7QUFHdkNDLElBQUFBLFdBQVcsRUFBRTtBQUgwQixHQUEzQztNQU9hQyxtQixXQURaLG9CQUFRLHdCQUFSLEMsVUFFSSxpQkFBSyxDQUFDQyxrQkFBRCxDQUFMLEMsVUFlQSxpQkFBS0Esa0JBQUwsQyxVQUNBLHdCQUFZLFdBQVosQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFpRFNDLGtCLEdBQWtELEU7WUFDbERDLE8s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QkFBTCxDQUF5QixDQUF6QixDQUFQO0FBQ0gsTzt3QkFFYVAsRyxFQUFLO0FBQ2YsWUFBSSxLQUFLZixVQUFMLENBQWdCQyxNQUFoQixLQUEyQixDQUEzQixJQUFnQyxLQUFLRCxVQUFMLENBQWdCLENBQWhCLE1BQXVCZSxHQUEzRCxFQUFnRTtBQUM1RDtBQUNIOztBQUNELGFBQUtILG1CQUFMLENBQXlCLENBQXpCLEVBQTRCRyxHQUE1QjtBQUNIOzs7O0lBbkhvQ1Usb0I7Ozs7O2FBRU8sRTs7Z0ZBRTNDQyxtQjs7Ozs7YUFDcUJDLGVBQU9DLElBQVAsQ0FBWUMsSTs7OztBQW9MdENDLDBCQUFTbkMsbUJBQVQsR0FBK0JBLG1CQUEvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgbW9kZWxcclxuICovXHJcblxyXG5pbXBvcnQgeyBFRElUT1IgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBNYXRlcmlhbCB9IGZyb20gJy4uLy4uL2Fzc2V0cy9tYXRlcmlhbCc7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvY29tcG9uZW50JztcclxuaW1wb3J0IHsgY2NjbGFzcywgdHlwZSwgdmlzaWJsZSwgZGlzcGxheU5hbWUsIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IElNYXRlcmlhbEluc3RhbmNlSW5mbywgTWF0ZXJpYWxJbnN0YW5jZSB9IGZyb20gJy4uLy4uL3JlbmRlcmVyL2NvcmUvbWF0ZXJpYWwtaW5zdGFuY2UnO1xyXG5pbXBvcnQgeyBzY2VuZSB9IGZyb20gJy4uLy4uL3JlbmRlcmVyJztcclxuaW1wb3J0IHsgTGF5ZXJzIH0gZnJvbSAnLi4vLi4vc2NlbmUtZ3JhcGgvbGF5ZXJzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5jb25zdCBfbWF0SW5zSW5mbzogSU1hdGVyaWFsSW5zdGFuY2VJbmZvID0ge1xyXG4gICAgcGFyZW50OiBudWxsISxcclxuICAgIG93bmVyOiBudWxsISxcclxuICAgIHN1Yk1vZGVsSWR4OiAwLFxyXG59O1xyXG5cclxuQGNjY2xhc3MoJ2NjLlJlbmRlcmFibGVDb21wb25lbnQnKVxyXG5leHBvcnQgY2xhc3MgUmVuZGVyYWJsZUNvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBAdHlwZShbTWF0ZXJpYWxdKVxyXG4gICAgcHJvdGVjdGVkIF9tYXRlcmlhbHM6IChNYXRlcmlhbCB8IG51bGwpW10gPSBbXTtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3Zpc0ZsYWdzID0gTGF5ZXJzLkVudW0uTk9ORTtcclxuXHJcbiAgICBnZXQgdmlzaWJpbGl0eSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Zpc0ZsYWdzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB2aXNpYmlsaXR5ICh2YWwpIHtcclxuICAgICAgICB0aGlzLl92aXNGbGFncyA9IHZhbDtcclxuICAgICAgICB0aGlzLl9vblZpc2liaWxpdHlDaGFuZ2UodmFsKTtcclxuICAgIH1cclxuXHJcbiAgICBAdHlwZShNYXRlcmlhbClcclxuICAgIEBkaXNwbGF5TmFtZSgnTWF0ZXJpYWxzJylcclxuICAgIGdldCBzaGFyZWRNYXRlcmlhbHMgKCkge1xyXG4gICAgICAgIC8vIGlmIHdlIGRvbid0IGNyZWF0ZSBhbiBhcnJheSBjb3B5LCB0aGUgZWRpdG9yIHdpbGwgbW9kaWZ5IHRoZSBvcmlnaW5hbCBhcnJheSBkaXJlY3RseS5cclxuICAgICAgICByZXR1cm4gRURJVE9SICYmIHRoaXMuX21hdGVyaWFscy5zbGljZSgpIHx8IHRoaXMuX21hdGVyaWFscztcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc2hhcmVkTWF0ZXJpYWxzICh2YWwpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodmFsW2ldICE9PSB0aGlzLl9tYXRlcmlhbHNbaV0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0TWF0ZXJpYWwodmFsW2ldLCBpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodmFsLmxlbmd0aCA8IHRoaXMuX21hdGVyaWFscy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHZhbC5sZW5ndGg7IGkgPCB0aGlzLl9tYXRlcmlhbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0TWF0ZXJpYWwobnVsbCwgaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWxzLnNwbGljZSh2YWwubGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIG1hdGVyaWFscyBvZiB0aGUgbW9kZWwuXHJcbiAgICAgKiBAemgg5qih5Z6L5p2Q6LSo44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBtYXRlcmlhbHMgKCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbWF0ZXJpYWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsSW5zdGFuY2VzW2ldID0gdGhpcy5nZXRNYXRlcmlhbEluc3RhbmNlKGkpIGFzIE1hdGVyaWFsSW5zdGFuY2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXRlcmlhbEluc3RhbmNlcztcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbWF0ZXJpYWxzICh2YWwpIHtcclxuICAgICAgICBjb25zdCBkTGVuID0gdmFsLmxlbmd0aCAtIHRoaXMuX21hdGVyaWFscy5sZW5ndGg7XHJcbiAgICAgICAgaWYgKGRMZW4gPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21hdGVyaWFscy5sZW5ndGggPSB2YWwubGVuZ3RoO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXRlcmlhbEluc3RhbmNlcy5sZW5ndGggPSB2YWwubGVuZ3RoO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZExlbiA8IDApIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX21hdGVyaWFscy5sZW5ndGggLSBkTGVuOyBpIDwgdGhpcy5fbWF0ZXJpYWxzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldE1hdGVyaWFsSW5zdGFuY2UoaSwgbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9tYXRlcmlhbEluc3RhbmNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHRyaXBsZS1lcXVhbHMgLy8gYm90aCBvZiB0aGVtIG1heSBiZSB1bmRlZmluZWQgb3IgbnVsbFxyXG4gICAgICAgICAgICBpZiAodGhpcy5fbWF0ZXJpYWxJbnN0YW5jZXNbaV0gIT0gdmFsW2ldKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldE1hdGVyaWFsSW5zdGFuY2UoaSwgdmFsW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX21hdGVyaWFsSW5zdGFuY2VzOiAoTWF0ZXJpYWxJbnN0YW5jZSB8IG51bGwpW10gPSBbXTtcclxuICAgIHByb3RlY3RlZCBfbW9kZWxzOiBzY2VuZS5Nb2RlbFtdID0gW107XHJcblxyXG4gICAgZ2V0IHNoYXJlZE1hdGVyaWFsICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRNYXRlcmlhbCgwKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgdGhlIHNoYXJlZCBtYXRlcmlhbCBhc3NldCBvZiB0aGUgc3BlY2lmaWVkIHN1Yi1tb2RlbC5cclxuICAgICAqIEB6aCDojrflj5bmjIflrprlrZDmqKHlnovnmoTlhbHkuqvmnZDotKjotYTmupDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE1hdGVyaWFsIChpZHg6IG51bWJlcik6IE1hdGVyaWFsIHwgbnVsbCB7XHJcbiAgICAgICAgaWYgKGlkeCA8IDAgfHwgaWR4ID49IHRoaXMuX21hdGVyaWFscy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXRlcmlhbHNbaWR4XTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTZXQgdGhlIHNoYXJlZCBtYXRlcmlhbCBhc3NldCBvZiB0aGUgc3BlY2lmaWVkIHN1Yi1tb2RlbCxcclxuICAgICAqIG5ldyBtYXRlcmlhbCBpbnN0YW5jZSB3aWxsIGJlIGNyZWF0ZWQgYXV0b21hdGljYWxseSBpZiB0aGUgc3ViLW1vZGVsIGlzIGFscmVhZHkgdXNpbmcgb25lLlxyXG4gICAgICogQHpoIOiuvue9ruaMh+WumuWtkOaooeWei+eahCBzaGFyZWRNYXRlcmlhbO+8jOWmguaenOWvueW6lOS9jee9ruacieadkOi0qOWunuS+i+WImeS8muWIm+W7uuS4gOS4quWvueW6lOeahOadkOi0qOWunuS+i+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TWF0ZXJpYWwgKG1hdGVyaWFsOiBNYXRlcmlhbCB8IG51bGwsIGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAobWF0ZXJpYWwgJiYgbWF0ZXJpYWwgaW5zdGFuY2VvZiBNYXRlcmlhbEluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NhblxcJ3Qgc2V0IGEgbWF0ZXJpYWwgaW5zdGFuY2UgdG8gYSBzaGFyZWRNYXRlcmlhbCBzbG90Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX21hdGVyaWFsc1tpbmRleF0gPSBtYXRlcmlhbDtcclxuICAgICAgICBjb25zdCBpbnN0ID0gdGhpcy5fbWF0ZXJpYWxJbnN0YW5jZXNbaW5kZXhdO1xyXG4gICAgICAgIGlmIChpbnN0KSB7XHJcbiAgICAgICAgICAgIGlmIChpbnN0LnBhcmVudCAhPT0gdGhpcy5fbWF0ZXJpYWxzW2luZGV4XSkge1xyXG4gICAgICAgICAgICAgICAgaW5zdC5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXRlcmlhbEluc3RhbmNlc1tpbmRleF0gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25NYXRlcmlhbE1vZGlmaWVkKGluZGV4LCB0aGlzLl9tYXRlcmlhbHNbaW5kZXhdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29uTWF0ZXJpYWxNb2RpZmllZChpbmRleCwgdGhpcy5fbWF0ZXJpYWxzW2luZGV4XSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBtYXRlcmlhbCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TWF0ZXJpYWxJbnN0YW5jZSgwKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbWF0ZXJpYWwgKHZhbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tYXRlcmlhbHMubGVuZ3RoID09PSAxICYmIHRoaXMuX21hdGVyaWFsc1swXSA9PT0gdmFsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRNYXRlcmlhbEluc3RhbmNlKDAsIHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2V0IHRoZSBtYXRlcmlhbCBpbnN0YW5jZSBvZiB0aGUgc3BlY2lmaWVkIHN1Yi1tb2RlbC5cclxuICAgICAqIEB6aCDojrflj5bmjIflrprlrZDmqKHlnovnmoTmnZDotKjlrp7kvovjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE1hdGVyaWFsSW5zdGFuY2UgKGlkeDogbnVtYmVyKTogTWF0ZXJpYWwgfCBudWxsIHtcclxuICAgICAgICBjb25zdCBtYXQgPSB0aGlzLl9tYXRlcmlhbHNbaWR4XTtcclxuICAgICAgICBpZiAoIW1hdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLl9tYXRlcmlhbEluc3RhbmNlc1tpZHhdKSB7XHJcbiAgICAgICAgICAgIF9tYXRJbnNJbmZvLnBhcmVudCA9IHRoaXMuX21hdGVyaWFsc1tpZHhdITtcclxuICAgICAgICAgICAgX21hdEluc0luZm8ub3duZXIgPSB0aGlzO1xyXG4gICAgICAgICAgICBfbWF0SW5zSW5mby5zdWJNb2RlbElkeCA9IGlkeDtcclxuICAgICAgICAgICAgY29uc3QgaW5zdGFudGlhdGVkID0gbmV3IE1hdGVyaWFsSW5zdGFuY2UoX21hdEluc0luZm8pO1xyXG4gICAgICAgICAgICB0aGlzLnNldE1hdGVyaWFsSW5zdGFuY2UoaWR4LCBpbnN0YW50aWF0ZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fbWF0ZXJpYWxJbnN0YW5jZXNbaWR4XTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTZXQgdGhlIG1hdGVyaWFsIGluc3RhbmNlIG9mIHRoZSBzcGVjaWZpZWQgc3ViLW1vZGVsLlxyXG4gICAgICogQHpoIOiOt+WPluaMh+WumuWtkOaooeWei+eahOadkOi0qOWunuS+i+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TWF0ZXJpYWxJbnN0YW5jZSAoaW5kZXg6IG51bWJlciwgbWF0SW5zdDogTWF0ZXJpYWwgfCBudWxsKSB7XHJcbiAgICAgICAgaWYgKG1hdEluc3QgJiYgbWF0SW5zdC5wYXJlbnQpIHtcclxuICAgICAgICAgICAgaWYgKG1hdEluc3QgIT09IHRoaXMuX21hdGVyaWFsSW5zdGFuY2VzW2luZGV4XSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWxJbnN0YW5jZXNbaW5kZXhdID0gbWF0SW5zdCBhcyBNYXRlcmlhbEluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25NYXRlcmlhbE1vZGlmaWVkKGluZGV4LCBtYXRJbnN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChtYXRJbnN0ICE9PSB0aGlzLl9tYXRlcmlhbHNbaW5kZXhdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldE1hdGVyaWFsKG1hdEluc3QgYXMgTWF0ZXJpYWwsIGluZGV4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgdGhlIGFjdHVhbCByZW5kZXJpbmcgbWF0ZXJpYWwgb2YgdGhlIHNwZWNpZmllZCBzdWItbW9kZWwuXHJcbiAgICAgKiAobWF0ZXJpYWwgaW5zdGFuY2UgaWYgdGhlcmUgaXMgb25lLCBvciB0aGUgc2hhcmVkIG1hdGVyaWFsIGFzc2V0KVxyXG4gICAgICogQHpoIOiOt+WPluaMh+WumuS9jee9ruWPr+S+m+a4suafk+eahOadkOi0qO+8jOWmguaenOacieadkOi0qOWunuS+i+WImeS9v+eUqOadkOi0qOWunuS+i++8jOWmguaenOayoeacieWImeS9v+eUqOadkOi0qOi1hOa6kFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0UmVuZGVyTWF0ZXJpYWwgKGluZGV4OiBudW1iZXIpOiBNYXRlcmlhbCB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXRlcmlhbEluc3RhbmNlc1tpbmRleF0gfHwgdGhpcy5fbWF0ZXJpYWxzW2luZGV4XTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX2NvbGxlY3RNb2RlbHMgKCk6IHNjZW5lLk1vZGVsW10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tb2RlbHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9hdHRhY2hUb1NjZW5lICgpIHtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2RldGFjaEZyb21TY2VuZSAoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9vbk1hdGVyaWFsTW9kaWZpZWQgKGluZGV4OiBudW1iZXIsIG1hdGVyaWFsOiBNYXRlcmlhbCB8IG51bGwpIHtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX29uUmVidWlsZFBTTyAoaW5kZXg6IG51bWJlciwgbWF0ZXJpYWw6IE1hdGVyaWFsIHwgbnVsbCkge1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfY2xlYXJNYXRlcmlhbHMgKCkge1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfb25WaXNpYmlsaXR5Q2hhbmdlICh2YWwpIHtcclxuICAgIH1cclxufVxyXG5cclxubGVnYWN5Q0MuUmVuZGVyYWJsZUNvbXBvbmVudCA9IFJlbmRlcmFibGVDb21wb25lbnQ7XHJcbiJdfQ==