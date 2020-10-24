(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../default-constants.js", "../../animation/transform-utils.js", "../../assets/asset-enum.js", "../../assets/material.js", "../../assets/mesh.js", "../../assets/skeleton.js", "../../assets/texture-2d.js", "../../data/decorators/index.js", "../../data/utils/attribute.js", "../../gfx/define.js", "../../gfx/input-assembler.js", "../../math/index.js", "../misc/buffer.js", "./skinned-mesh-renderer.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../default-constants.js"), require("../../animation/transform-utils.js"), require("../../assets/asset-enum.js"), require("../../assets/material.js"), require("../../assets/mesh.js"), require("../../assets/skeleton.js"), require("../../assets/texture-2d.js"), require("../../data/decorators/index.js"), require("../../data/utils/attribute.js"), require("../../gfx/define.js"), require("../../gfx/input-assembler.js"), require("../../math/index.js"), require("../misc/buffer.js"), require("./skinned-mesh-renderer.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.defaultConstants, global.transformUtils, global.assetEnum, global.material, global.mesh, global.skeleton, global.texture2d, global.index, global.attribute, global.define, global.inputAssembler, global.index, global.buffer, global.skinnedMeshRenderer, global.globalExports);
    global.skinnedMeshBatchRenderer = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _defaultConstants, _transformUtils, _assetEnum, _material, _mesh, _skeleton, _texture2d, _index, _attribute, _define, _inputAssembler, _index2, _buffer, _skinnedMeshRenderer, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SkinnedMeshBatchRenderer = _exports.SkinnedMeshUnit = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _class4, _class5, _descriptor7, _descriptor8, _descriptor9, _temp2;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }

  function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new Error('failed to set property'); } return value; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var repeat = function repeat(n) {
    return n - Math.floor(n);
  };

  var batch_id = new _inputAssembler.GFXAttribute(_define.GFXAttributeName.ATTR_BATCH_ID, _define.GFXFormat.R32F);
  var batch_uv = new _inputAssembler.GFXAttribute(_define.GFXAttributeName.ATTR_BATCH_UV, _define.GFXFormat.RG32F);
  var batch_extras_size = _define.GFXFormatInfos[batch_id.format].size + _define.GFXFormatInfos[batch_uv.format].size;
  var SkinnedMeshUnit = (_dec = (0, _index.ccclass)('cc.SkinnedMeshUnit'), _dec2 = (0, _index.type)(_mesh.Mesh), _dec3 = (0, _index.type)(_skeleton.Skeleton), _dec4 = (0, _index.type)(_material.Material), _dec5 = (0, _index.type)(_skinnedMeshRenderer.SkinnedMeshRenderer), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
    function SkinnedMeshUnit() {
      _classCallCheck(this, SkinnedMeshUnit);

      _initializerDefineProperty(this, "mesh", _descriptor, this);

      _initializerDefineProperty(this, "skeleton", _descriptor2, this);

      _initializerDefineProperty(this, "material", _descriptor3, this);

      _initializerDefineProperty(this, "_localTransform", _descriptor4, this);

      _initializerDefineProperty(this, "_offset", _descriptor5, this);

      _initializerDefineProperty(this, "_size", _descriptor6, this);
    }

    _createClass(SkinnedMeshUnit, [{
      key: "offset",

      /**
       * @en UV offset on texture atlas.
       * @zh 在图集中的 uv 坐标偏移。
       */
      set: function set(offset) {
        _index2.Vec2.copy(this._offset, offset);
      },
      get: function get() {
        return this._offset;
      }
      /**
       * @en UV extent on texture atlas.
       * @zh 在图集中占的 UV 尺寸。
       */

    }, {
      key: "size",
      set: function set(size) {
        _index2.Vec2.copy(this._size, size);
      },
      get: function get() {
        return this._size;
      }
      /**
       * @en Convenient setter, copying all necessary information from target [[SkinnedMeshRenderer]] component.
       * @zh 复制目标 [[SkinnedMeshRenderer]] 的所有属性到本单元，方便快速配置。
       */

    }, {
      key: "copyFrom",
      set: function set(comp) {
        if (!comp) {
          return;
        }

        this.mesh = comp.mesh;
        this.skeleton = comp.skeleton;
        this.material = comp.getMaterial(0);

        if (comp.skinningRoot) {
          (0, _transformUtils.getWorldTransformUntilRoot)(comp.node, comp.skinningRoot, this._localTransform);
        }
      },
      get: function get() {
        return null;
      }
    }]);

    return SkinnedMeshUnit;
  }(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "mesh", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "skeleton", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "material", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_localTransform", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Mat4();
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_offset", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec2(0, 0);
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_size", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec2(1, 1);
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "offset", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "offset"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "size", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "size"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "copyFrom", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "copyFrom"), _class2.prototype)), _class2)) || _class);
  _exports.SkinnedMeshUnit = SkinnedMeshUnit;
  var m4_local = new _index2.Mat4();
  var m4_1 = new _index2.Mat4();
  var v3_1 = new _index2.Vec3();
  /**
   * @en The skinned mesh batch renderer component, batches multiple skeleton-sharing [[SkinnedMeshRenderer]].
   * @zh 蒙皮模型合批组件，用于合并绘制共享同一骨骼资源的所有蒙皮网格。
   */

  var SkinnedMeshBatchRenderer = (_dec6 = (0, _index.ccclass)('cc.SkinnedMeshBatchRenderer'), _dec7 = (0, _index.help)('i18n:cc.SkinnedMeshBatchRenderer'), _dec8 = (0, _index.executionOrder)(100), _dec9 = (0, _index.menu)('Components/SkinnedMeshBatchRenderer'), _dec10 = (0, _index.tooltip)('i18n:batched_skinning_model.atlas_size'), _dec11 = (0, _index.type)([_attribute.CCString]), _dec12 = (0, _index.tooltip)('i18n:batched_skinning_model.batchable_texture_names'), _dec13 = (0, _index.type)([SkinnedMeshUnit]), _dec14 = (0, _index.tooltip)('i18n:batched_skinning_model.units'), _dec15 = (0, _index.visible)(false), _dec16 = (0, _index.visible)(false), _dec6(_class4 = _dec7(_class4 = _dec8(_class4 = (0, _index.executeInEditMode)(_class4 = _dec9(_class4 = (_class5 = (_temp2 = /*#__PURE__*/function (_SkinnedMeshRenderer) {
    _inherits(SkinnedMeshBatchRenderer, _SkinnedMeshRenderer);

    function SkinnedMeshBatchRenderer() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, SkinnedMeshBatchRenderer);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(SkinnedMeshBatchRenderer)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "atlasSize", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "batchableTextureNames", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "units", _descriptor9, _assertThisInitialized(_this));

      _this._textures = {};
      _this._batchMaterial = null;
      return _this;
    }

    _createClass(SkinnedMeshBatchRenderer, [{
      key: "onLoad",
      value: function onLoad() {
        _get(_getPrototypeOf(SkinnedMeshBatchRenderer.prototype), "onLoad", this).call(this);

        this.cook();
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        for (var tex in this._textures) {
          this._textures[tex].destroy();
        }

        this._textures = {};

        if (this._mesh) {
          this._mesh.destroy();

          this._mesh = null;
        }

        _get(_getPrototypeOf(SkinnedMeshBatchRenderer.prototype), "onDestroy", this).call(this);
      }
    }, {
      key: "_onMaterialModified",
      value: function _onMaterialModified(idx, material) {
        this.cookMaterials();

        _get(_getPrototypeOf(SkinnedMeshBatchRenderer.prototype), "_onMaterialModified", this).call(this, idx, this.getMaterialInstance(idx));
      }
    }, {
      key: "cook",
      value: function cook() {
        this.cookMaterials();
        this.cookSkeletons();
        this.cookMeshes();
      }
    }, {
      key: "cookMaterials",
      value: function cookMaterials() {
        var _this2 = this;

        if (!this._batchMaterial) {
          this._batchMaterial = this.getMaterial(0);
        }

        var mat = this.getMaterialInstance(0);

        if (!mat || !this._batchMaterial || !this._batchMaterial.effectAsset) {
          console.warn('incomplete batch material!');
          return;
        }

        mat.copy(this._batchMaterial);
        this.resizeAtlases();
        var tech = mat.effectAsset.techniques[mat.technique];

        var _loop = function _loop(i) {
          var pass = tech.passes[i];

          if (!pass.properties) {
            return "continue";
          }

          var _loop2 = function _loop2(prop) {
            if (pass.properties[prop].type >= _define.GFXType.SAMPLER1D) {
              // samplers
              var tex = null;

              if (_this2.batchableTextureNames.find(function (n) {
                return n === prop;
              })) {
                tex = _this2._textures[prop];

                if (!tex) {
                  tex = _this2.createTexture(prop);
                }

                _this2.cookTextures(tex, prop, i);
              } else {
                _this2.units.some(function (u) {
                  return tex = u.material && u.material.getProperty(prop, i);
                });
              }

              if (tex) {
                mat.setProperty(prop, tex, i);
              }
            } else {
              // vectors
              var value = [];

              for (var u = 0; u < _this2.units.length; u++) {
                var unit = _this2.units[u];

                if (!unit.material) {
                  continue;
                }

                value.push(unit.material.getProperty(prop.slice(0, -3), i));
              }

              mat.setProperty(prop, value, i);
            }
          };

          for (var prop in pass.properties) {
            _loop2(prop);
          }
        };

        for (var i = 0; i < tech.passes.length; i++) {
          var _ret = _loop(i);

          if (_ret === "continue") continue;
        }
      }
    }, {
      key: "cookSkeletons",
      value: function cookSkeletons() {
        var _this3 = this;

        if (!this._skinningRoot) {
          console.warn('no skinning root specified!');
          return;
        } // merge joints accordingly


        var joints = [];
        var bindposes = [];

        for (var u = 0; u < this.units.length; u++) {
          var unit = this.units[u];

          if (!unit || !unit.skeleton) {
            continue;
          }

          var partial = unit.skeleton;

          _index2.Mat4.invert(m4_local, unit._localTransform);

          var _loop3 = function _loop3(i) {
            var path = partial.joints[i];
            var idx = joints.findIndex(function (p) {
              return p === path;
            });

            if (idx >= 0) {
              if (_defaultConstants.EDITOR) {
                // consistency check
                _index2.Mat4.multiply(m4_1, partial.bindposes[i], m4_local);

                if (!m4_1.equals(bindposes[idx])) {
                  console.warn("".concat(_this3.node.name, ": Inconsistent bindpose at ").concat(joints[idx], " in unit ").concat(u, ", artifacts may present"));
                }
              }

              return "continue";
            }

            joints.push(path); // cancel out local transform

            bindposes.push(_index2.Mat4.multiply(new _index2.Mat4(), partial.bindposes[i] || _index2.Mat4.IDENTITY, m4_local));
          };

          for (var i = 0; i < partial.joints.length; i++) {
            var _ret2 = _loop3(i);

            if (_ret2 === "continue") continue;
          }
        } // sort the array to be more cache-friendly


        var idxMap = Array.from(Array(joints.length).keys()).sort(function (a, b) {
          if (joints[a] > joints[b]) {
            return 1;
          }

          if (joints[a] < joints[b]) {
            return -1;
          }

          return 0;
        });
        var skeleton = new _skeleton.Skeleton();
        skeleton.joints = joints.map(function (_, idx, arr) {
          return arr[idxMap[idx]];
        });
        skeleton.bindposes = bindposes.map(function (_, idx, arr) {
          return arr[idxMap[idx]];
        }); // apply

        if (this._skeleton) {
          this._skeleton.destroy();
        }

        this.skeleton = skeleton;
      }
    }, {
      key: "cookMeshes",
      value: function cookMeshes() {
        var _this4 = this;

        var isValid = false;

        for (var u = 0; u < this.units.length; u++) {
          var unit = this.units[u];

          if (unit.mesh) {
            isValid = true;
            break;
          }
        }

        if (!isValid || !this._skinningRoot) {
          return;
        }

        if (this._mesh) {
          this._mesh.destroyRenderingMesh();
        } else {
          this._mesh = new _mesh.Mesh();
        }

        var posOffset = 0;
        var posFormat = _define.GFXFormat.UNKNOWN;
        var normalOffset = 0;
        var normalFormat = _define.GFXFormat.UNKNOWN;
        var tangentOffset = 0;
        var tangentFormat = _define.GFXFormat.UNKNOWN;
        var uvOffset = 0;
        var uvFormat = _define.GFXFormat.UNKNOWN;
        var jointOffset = 0;
        var jointFormat = _define.GFXFormat.UNKNOWN; // prepare joint index map

        var jointIndexMap = new Array(this.units.length);
        var unitLen = this.units.length;

        for (var i = 0; i < unitLen; i++) {
          var _unit = this.units[i];

          if (!_unit || !_unit.skeleton) {
            continue;
          }

          jointIndexMap[i] = _unit.skeleton.joints.map(function (j) {
            return _this4._skeleton.joints.findIndex(function (ref) {
              return j === ref;
            });
          });
        }

        var _loop4 = function _loop4(_i) {
          var unit = _this4.units[_i];

          if (!unit || !unit.mesh || !unit.mesh.data) {
            return "continue";
          }

          var newMesh = _this4._createUnitMesh(_i, unit.mesh);

          var dataView = new DataView(newMesh.data.buffer);

          _index2.Mat4.inverseTranspose(m4_local, unit._localTransform);

          var offset = unit.offset;
          var size = unit.size;

          var _loop5 = function _loop5(b) {
            var bundle = newMesh.struct.vertexBundles[b]; // apply local transform to mesh

            posOffset = bundle.view.offset;
            posFormat = _define.GFXFormat.UNKNOWN;

            for (var a = 0; a < bundle.attributes.length; a++) {
              var attr = bundle.attributes[a];

              if (attr.name === _define.GFXAttributeName.ATTR_POSITION) {
                posFormat = attr.format;
                break;
              }

              posOffset += _define.GFXFormatInfos[attr.format].size;
            }

            if (posFormat) {
              var pos = (0, _buffer.readBuffer)(dataView, posFormat, posOffset, bundle.view.length, bundle.view.stride);

              for (var j = 0; j < pos.length; j += 3) {
                _index2.Vec3.fromArray(v3_1, pos, j);

                _index2.Vec3.transformMat4(v3_1, v3_1, unit._localTransform);

                _index2.Vec3.toArray(pos, v3_1, j);
              }

              (0, _buffer.writeBuffer)(dataView, pos, posFormat, posOffset, bundle.view.stride);
            }

            normalOffset = bundle.view.offset;
            normalFormat = _define.GFXFormat.UNKNOWN;

            for (var _a = 0; _a < bundle.attributes.length; _a++) {
              var _attr = bundle.attributes[_a];

              if (_attr.name === _define.GFXAttributeName.ATTR_NORMAL) {
                normalFormat = _attr.format;
                break;
              }

              normalOffset += _define.GFXFormatInfos[_attr.format].size;
            }

            if (normalFormat) {
              var normal = (0, _buffer.readBuffer)(dataView, normalFormat, normalOffset, bundle.view.length, bundle.view.stride);

              for (var _j = 0; _j < normal.length; _j += 3) {
                _index2.Vec3.fromArray(v3_1, normal, _j);

                _index2.Vec3.transformMat4Normal(v3_1, v3_1, m4_local);

                _index2.Vec3.toArray(normal, v3_1, _j);
              }

              (0, _buffer.writeBuffer)(dataView, normal, normalFormat, normalOffset, bundle.view.stride);
            }

            tangentOffset = bundle.view.offset;
            tangentFormat = _define.GFXFormat.UNKNOWN;

            for (var _a2 = 0; _a2 < bundle.attributes.length; _a2++) {
              var _attr2 = bundle.attributes[_a2];

              if (_attr2.name === _define.GFXAttributeName.ATTR_TANGENT) {
                tangentFormat = _attr2.format;
                break;
              }

              tangentOffset += _define.GFXFormatInfos[_attr2.format].size;
            }

            if (tangentFormat) {
              var tangent = (0, _buffer.readBuffer)(dataView, tangentFormat, tangentOffset, bundle.view.length, bundle.view.stride);

              for (var _j2 = 0; _j2 < tangent.length; _j2 += 3) {
                _index2.Vec3.fromArray(v3_1, tangent, _j2);

                _index2.Vec3.transformMat4Normal(v3_1, v3_1, m4_local);

                _index2.Vec3.toArray(tangent, v3_1, _j2);
              }

              (0, _buffer.writeBuffer)(dataView, tangent, tangentFormat, tangentOffset, bundle.view.stride);
            } // merge UV


            uvOffset = bundle.view.offset;
            uvFormat = _define.GFXFormat.UNKNOWN;

            for (var _a3 = 0; _a3 < bundle.attributes.length; _a3++) {
              var _attr3 = bundle.attributes[_a3];

              if (_attr3.name === _define.GFXAttributeName.ATTR_BATCH_UV) {
                uvFormat = _attr3.format;
                break;
              }

              uvOffset += _define.GFXFormatInfos[_attr3.format].size;
            }

            if (uvFormat) {
              (0, _buffer.mapBuffer)(dataView, function (cur, idx) {
                cur = repeat(cur); // warp to [0, 1] first

                var comp = idx === 0 ? 'x' : 'y';
                return cur * size[comp] + offset[comp];
              }, uvFormat, uvOffset, bundle.view.length, bundle.view.stride, dataView);
            } // merge joint indices


            var idxMap = jointIndexMap[_i];

            if (!idxMap) {
              return "continue";
            }

            jointOffset = bundle.view.offset;
            jointFormat = _define.GFXFormat.UNKNOWN;

            for (var _a4 = 0; _a4 < bundle.attributes.length; _a4++) {
              var _attr4 = bundle.attributes[_a4];

              if (_attr4.name === _define.GFXAttributeName.ATTR_JOINTS) {
                jointFormat = _attr4.format;
                break;
              }

              jointOffset += _define.GFXFormatInfos[_attr4.format].size;
            }

            if (jointFormat) {
              (0, _buffer.mapBuffer)(dataView, function (cur) {
                return idxMap[cur];
              }, jointFormat, jointOffset, bundle.view.length, bundle.view.stride, dataView);
            }
          };

          for (var b = 0; b < newMesh.struct.vertexBundles.length; b++) {
            var _ret4 = _loop5(b);

            if (_ret4 === "continue") continue;
          }

          _this4._mesh.merge(newMesh);
        };

        for (var _i = 0; _i < unitLen; _i++) {
          var _ret3 = _loop4(_i);

          if (_ret3 === "continue") continue;
        }

        this._onMeshChanged(this._mesh);

        this._updateModels();
      }
    }, {
      key: "cookTextures",
      value: function cookTextures(target, prop, passIdx) {
        var texImages = [];
        var texImageRegions = [];
        var texBuffers = [];
        var texBufferRegions = [];

        for (var u = 0; u < this.units.length; u++) {
          var unit = this.units[u];

          if (!unit.material) {
            continue;
          }

          var partial = unit.material.getProperty(prop, passIdx);

          if (partial && partial.image && partial.image.data) {
            var region = new _define.GFXBufferTextureCopy();
            region.texOffset.x = unit.offset.x * this.atlasSize;
            region.texOffset.y = unit.offset.y * this.atlasSize;
            region.texExtent.width = unit.size.x * this.atlasSize;
            region.texExtent.height = unit.size.y * this.atlasSize;
            var data = partial.image.data;

            if (data instanceof HTMLCanvasElement || data instanceof HTMLImageElement) {
              texImages.push(data);
              texImageRegions.push(region);
            } else {
              texBuffers.push(data);
              texBufferRegions.push(region);
            }
          }
        }

        var gfxTex = target.getGFXTexture();
        var device = _globalExports.legacyCC.director.root.device;

        if (texBuffers.length > 0) {
          device.copyBuffersToTexture(texBuffers, gfxTex, texBufferRegions);
        }

        if (texImages.length > 0) {
          device.copyTexImagesToTexture(texImages, gfxTex, texImageRegions);
        }
      }
    }, {
      key: "createTexture",
      value: function createTexture(prop) {
        var tex = new _texture2d.Texture2D();
        tex.setFilters(_assetEnum.Filter.LINEAR, _assetEnum.Filter.LINEAR);
        tex.setMipFilter(_assetEnum.Filter.LINEAR);
        tex.reset({
          width: this.atlasSize,
          height: this.atlasSize,
          format: _assetEnum.PixelFormat.RGBA8888
        });
        tex.loaded = true;
        this._textures[prop] = tex;
        return tex;
      }
    }, {
      key: "resizeAtlases",
      value: function resizeAtlases() {
        for (var prop in this._textures) {
          var tex = this._textures[prop];
          tex.reset({
            width: this.atlasSize,
            height: this.atlasSize,
            format: _assetEnum.PixelFormat.RGBA8888
          });
        }
      }
    }, {
      key: "_createUnitMesh",
      value: function _createUnitMesh(unitIdx, mesh) {
        // add batch ID to this temp mesh
        // first, update bookkeeping
        var newMeshStruct = JSON.parse(JSON.stringify(mesh.struct));
        var modifiedBundles = {};

        for (var p = 0; p < mesh.struct.primitives.length; p++) {
          var primitive = mesh.struct.primitives[p];
          var uvOffset = 0;
          var uvFormat = _define.GFXFormat.UNKNOWN;
          var bundleIdx = 0;

          for (; bundleIdx < primitive.vertexBundelIndices.length; bundleIdx++) {
            var bundle = mesh.struct.vertexBundles[primitive.vertexBundelIndices[bundleIdx]];
            uvOffset = bundle.view.offset;
            uvFormat = _define.GFXFormat.UNKNOWN;

            for (var a = 0; a < bundle.attributes.length; a++) {
              var attr = bundle.attributes[a];

              if (attr.name === _define.GFXAttributeName.ATTR_TEX_COORD) {
                uvFormat = attr.format;
                break;
              }

              uvOffset += _define.GFXFormatInfos[attr.format].size;
            }

            if (uvFormat) {
              break;
            }
          }

          if (modifiedBundles[bundleIdx] !== undefined) {
            continue;
          }

          modifiedBundles[bundleIdx] = [uvFormat, uvOffset];
          var newBundle = newMeshStruct.vertexBundles[bundleIdx]; // put the new UVs in the same bundle with original UVs

          newBundle.attributes.push(batch_id);
          newBundle.attributes.push(batch_uv);
          newBundle.view.offset = 0;
          newBundle.view.length += newBundle.view.count * batch_extras_size;
          newBundle.view.stride += batch_extras_size;
        }

        var totalLength = 0;

        for (var b = 0; b < newMeshStruct.vertexBundles.length; b++) {
          totalLength += newMeshStruct.vertexBundles[b].view.length;
        }

        for (var _p = 0; _p < newMeshStruct.primitives.length; _p++) {
          var pm = newMeshStruct.primitives[_p];

          if (pm.indexView) {
            pm.indexView.offset = totalLength;
            totalLength += pm.indexView.length;
          }
        } // now, we ride!


        var newMeshData = new Uint8Array(totalLength);
        var oldMeshData = mesh.data;
        var newDataView = new DataView(newMeshData.buffer);
        var oldDataView = new DataView(oldMeshData.buffer);
        var isLittleEndian = _globalExports.legacyCC.sys.isLittleEndian;

        for (var _b in modifiedBundles) {
          var _newBundle = newMeshStruct.vertexBundles[_b];
          var oldBundle = mesh.struct.vertexBundles[_b];

          var _modifiedBundles$_b = _slicedToArray(modifiedBundles[_b], 2),
              _uvFormat = _modifiedBundles$_b[0],
              _uvOffset = _modifiedBundles$_b[1];

          var uvs = (0, _buffer.readBuffer)(oldDataView, _uvFormat, _uvOffset, oldBundle.view.length, oldBundle.view.stride);
          var oldView = oldBundle.view;
          var newView = _newBundle.view;
          var oldStride = oldView.stride;
          var newStride = newView.stride;
          var oldOffset = oldView.offset;
          var newOffset = newView.offset;

          for (var j = 0; j < newView.count; j++) {
            var srcVertex = oldMeshData.subarray(oldOffset, oldOffset + oldStride);
            newMeshData.set(srcVertex, newOffset); // insert batch ID

            newDataView.setFloat32(newOffset + oldStride, unitIdx); // insert batch UV

            newDataView.setFloat32(newOffset + oldStride + 4, uvs[j * 2], isLittleEndian);
            newDataView.setFloat32(newOffset + oldStride + 8, uvs[j * 2 + 1], isLittleEndian);
            newOffset += newStride;
            oldOffset += oldStride;
          }
        }

        for (var k = 0; k < newMeshStruct.primitives.length; k++) {
          var oldPrimitive = mesh.struct.primitives[k];
          var newPrimitive = newMeshStruct.primitives[k];

          if (oldPrimitive.indexView && newPrimitive.indexView) {
            var _oldStride = oldPrimitive.indexView.stride;
            var _newStride = newPrimitive.indexView.stride;
            var _oldOffset = oldPrimitive.indexView.offset;
            var _newOffset = newPrimitive.indexView.offset;

            for (var _j3 = 0; _j3 < newPrimitive.indexView.count; _j3++) {
              var srcIndices = oldMeshData.subarray(_oldOffset, _oldOffset + _oldStride);
              newMeshData.set(srcIndices, _newOffset);
              _newOffset += _newStride;
              _oldOffset += _oldStride;
            }
          }
        }

        var newMesh = new _mesh.Mesh();
        newMesh.reset({
          struct: newMeshStruct,
          data: newMeshData
        });
        return newMesh;
      }
    }, {
      key: "mesh",
      get: function get() {
        return _get(_getPrototypeOf(SkinnedMeshBatchRenderer.prototype), "mesh", this);
      },
      set: function set(val) {
        _set(_getPrototypeOf(SkinnedMeshBatchRenderer.prototype), "mesh", val, this, true);
      }
    }, {
      key: "skeleton",
      get: function get() {
        return _get(_getPrototypeOf(SkinnedMeshBatchRenderer.prototype), "skeleton", this);
      },
      set: function set(val) {
        _set(_getPrototypeOf(SkinnedMeshBatchRenderer.prototype), "skeleton", val, this, true);
      }
    }]);

    return SkinnedMeshBatchRenderer;
  }(_skinnedMeshRenderer.SkinnedMeshRenderer), _temp2), (_descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "atlasSize", [_index.serializable, _dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1024;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class5.prototype, "batchableTextureNames", [_dec11, _index.serializable, _dec12], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class5.prototype, "units", [_dec13, _index.serializable, _dec14], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _applyDecoratedDescriptor(_class5.prototype, "mesh", [_index.override, _dec15], Object.getOwnPropertyDescriptor(_class5.prototype, "mesh"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "skeleton", [_index.override, _dec16], Object.getOwnPropertyDescriptor(_class5.prototype, "skeleton"), _class5.prototype)), _class5)) || _class4) || _class4) || _class4) || _class4) || _class4);
  _exports.SkinnedMeshBatchRenderer = SkinnedMeshBatchRenderer;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvM2QvZnJhbWV3b3JrL3NraW5uZWQtbWVzaC1iYXRjaC1yZW5kZXJlci50cyJdLCJuYW1lcyI6WyJyZXBlYXQiLCJuIiwiTWF0aCIsImZsb29yIiwiYmF0Y2hfaWQiLCJHRlhBdHRyaWJ1dGUiLCJHRlhBdHRyaWJ1dGVOYW1lIiwiQVRUUl9CQVRDSF9JRCIsIkdGWEZvcm1hdCIsIlIzMkYiLCJiYXRjaF91diIsIkFUVFJfQkFUQ0hfVVYiLCJSRzMyRiIsImJhdGNoX2V4dHJhc19zaXplIiwiR0ZYRm9ybWF0SW5mb3MiLCJmb3JtYXQiLCJzaXplIiwiU2tpbm5lZE1lc2hVbml0IiwiTWVzaCIsIlNrZWxldG9uIiwiTWF0ZXJpYWwiLCJTa2lubmVkTWVzaFJlbmRlcmVyIiwib2Zmc2V0IiwiVmVjMiIsImNvcHkiLCJfb2Zmc2V0IiwiX3NpemUiLCJjb21wIiwibWVzaCIsInNrZWxldG9uIiwibWF0ZXJpYWwiLCJnZXRNYXRlcmlhbCIsInNraW5uaW5nUm9vdCIsIm5vZGUiLCJfbG9jYWxUcmFuc2Zvcm0iLCJzZXJpYWxpemFibGUiLCJNYXQ0IiwiZWRpdGFibGUiLCJtNF9sb2NhbCIsIm00XzEiLCJ2M18xIiwiVmVjMyIsIlNraW5uZWRNZXNoQmF0Y2hSZW5kZXJlciIsIkNDU3RyaW5nIiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJfdGV4dHVyZXMiLCJfYmF0Y2hNYXRlcmlhbCIsImNvb2siLCJ0ZXgiLCJkZXN0cm95IiwiX21lc2giLCJpZHgiLCJjb29rTWF0ZXJpYWxzIiwiZ2V0TWF0ZXJpYWxJbnN0YW5jZSIsImNvb2tTa2VsZXRvbnMiLCJjb29rTWVzaGVzIiwibWF0IiwiZWZmZWN0QXNzZXQiLCJjb25zb2xlIiwid2FybiIsInJlc2l6ZUF0bGFzZXMiLCJ0ZWNoIiwidGVjaG5pcXVlcyIsInRlY2huaXF1ZSIsImkiLCJwYXNzIiwicGFzc2VzIiwicHJvcGVydGllcyIsInByb3AiLCJ0eXBlIiwiR0ZYVHlwZSIsIlNBTVBMRVIxRCIsImJhdGNoYWJsZVRleHR1cmVOYW1lcyIsImZpbmQiLCJjcmVhdGVUZXh0dXJlIiwiY29va1RleHR1cmVzIiwidW5pdHMiLCJzb21lIiwidSIsImdldFByb3BlcnR5Iiwic2V0UHJvcGVydHkiLCJ2YWx1ZSIsImxlbmd0aCIsInVuaXQiLCJwdXNoIiwic2xpY2UiLCJfc2tpbm5pbmdSb290Iiwiam9pbnRzIiwiYmluZHBvc2VzIiwicGFydGlhbCIsImludmVydCIsInBhdGgiLCJmaW5kSW5kZXgiLCJwIiwiRURJVE9SIiwibXVsdGlwbHkiLCJlcXVhbHMiLCJuYW1lIiwiSURFTlRJVFkiLCJpZHhNYXAiLCJBcnJheSIsImZyb20iLCJrZXlzIiwic29ydCIsImEiLCJiIiwibWFwIiwiXyIsImFyciIsIl9za2VsZXRvbiIsImlzVmFsaWQiLCJkZXN0cm95UmVuZGVyaW5nTWVzaCIsInBvc09mZnNldCIsInBvc0Zvcm1hdCIsIlVOS05PV04iLCJub3JtYWxPZmZzZXQiLCJub3JtYWxGb3JtYXQiLCJ0YW5nZW50T2Zmc2V0IiwidGFuZ2VudEZvcm1hdCIsInV2T2Zmc2V0IiwidXZGb3JtYXQiLCJqb2ludE9mZnNldCIsImpvaW50Rm9ybWF0Iiwiam9pbnRJbmRleE1hcCIsInVuaXRMZW4iLCJqIiwicmVmIiwiZGF0YSIsIm5ld01lc2giLCJfY3JlYXRlVW5pdE1lc2giLCJkYXRhVmlldyIsIkRhdGFWaWV3IiwiYnVmZmVyIiwiaW52ZXJzZVRyYW5zcG9zZSIsImJ1bmRsZSIsInN0cnVjdCIsInZlcnRleEJ1bmRsZXMiLCJ2aWV3IiwiYXR0cmlidXRlcyIsImF0dHIiLCJBVFRSX1BPU0lUSU9OIiwicG9zIiwic3RyaWRlIiwiZnJvbUFycmF5IiwidHJhbnNmb3JtTWF0NCIsInRvQXJyYXkiLCJBVFRSX05PUk1BTCIsIm5vcm1hbCIsInRyYW5zZm9ybU1hdDROb3JtYWwiLCJBVFRSX1RBTkdFTlQiLCJ0YW5nZW50IiwiY3VyIiwiQVRUUl9KT0lOVFMiLCJtZXJnZSIsIl9vbk1lc2hDaGFuZ2VkIiwiX3VwZGF0ZU1vZGVscyIsInRhcmdldCIsInBhc3NJZHgiLCJ0ZXhJbWFnZXMiLCJ0ZXhJbWFnZVJlZ2lvbnMiLCJ0ZXhCdWZmZXJzIiwidGV4QnVmZmVyUmVnaW9ucyIsImltYWdlIiwicmVnaW9uIiwiR0ZYQnVmZmVyVGV4dHVyZUNvcHkiLCJ0ZXhPZmZzZXQiLCJ4IiwiYXRsYXNTaXplIiwieSIsInRleEV4dGVudCIsIndpZHRoIiwiaGVpZ2h0IiwiSFRNTENhbnZhc0VsZW1lbnQiLCJIVE1MSW1hZ2VFbGVtZW50IiwiZ2Z4VGV4IiwiZ2V0R0ZYVGV4dHVyZSIsImRldmljZSIsImxlZ2FjeUNDIiwiZGlyZWN0b3IiLCJyb290IiwiY29weUJ1ZmZlcnNUb1RleHR1cmUiLCJjb3B5VGV4SW1hZ2VzVG9UZXh0dXJlIiwiVGV4dHVyZTJEIiwic2V0RmlsdGVycyIsIkZpbHRlciIsIkxJTkVBUiIsInNldE1pcEZpbHRlciIsInJlc2V0IiwiUGl4ZWxGb3JtYXQiLCJSR0JBODg4OCIsImxvYWRlZCIsInVuaXRJZHgiLCJuZXdNZXNoU3RydWN0IiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5IiwibW9kaWZpZWRCdW5kbGVzIiwicHJpbWl0aXZlcyIsInByaW1pdGl2ZSIsImJ1bmRsZUlkeCIsInZlcnRleEJ1bmRlbEluZGljZXMiLCJBVFRSX1RFWF9DT09SRCIsInVuZGVmaW5lZCIsIm5ld0J1bmRsZSIsImNvdW50IiwidG90YWxMZW5ndGgiLCJwbSIsImluZGV4VmlldyIsIm5ld01lc2hEYXRhIiwiVWludDhBcnJheSIsIm9sZE1lc2hEYXRhIiwibmV3RGF0YVZpZXciLCJvbGREYXRhVmlldyIsImlzTGl0dGxlRW5kaWFuIiwic3lzIiwib2xkQnVuZGxlIiwidXZzIiwib2xkVmlldyIsIm5ld1ZpZXciLCJvbGRTdHJpZGUiLCJuZXdTdHJpZGUiLCJvbGRPZmZzZXQiLCJuZXdPZmZzZXQiLCJzcmNWZXJ0ZXgiLCJzdWJhcnJheSIsInNldCIsInNldEZsb2F0MzIiLCJrIiwib2xkUHJpbWl0aXZlIiwibmV3UHJpbWl0aXZlIiwic3JjSW5kaWNlcyIsInZhbCIsIm92ZXJyaWRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQThDQSxNQUFNQSxNQUFNLEdBQUcsU0FBVEEsTUFBUyxDQUFDQyxDQUFEO0FBQUEsV0FBZUEsQ0FBQyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0YsQ0FBWCxDQUFuQjtBQUFBLEdBQWY7O0FBQ0EsTUFBTUcsUUFBc0IsR0FBRyxJQUFJQyw0QkFBSixDQUFpQkMseUJBQWlCQyxhQUFsQyxFQUFpREMsa0JBQVVDLElBQTNELENBQS9CO0FBQ0EsTUFBTUMsUUFBc0IsR0FBRyxJQUFJTCw0QkFBSixDQUFpQkMseUJBQWlCSyxhQUFsQyxFQUFpREgsa0JBQVVJLEtBQTNELENBQS9CO0FBQ0EsTUFBTUMsaUJBQWlCLEdBQUdDLHVCQUFlVixRQUFRLENBQUNXLE1BQXhCLEVBQWdDQyxJQUFoQyxHQUF1Q0YsdUJBQWVKLFFBQVEsQ0FBQ0ssTUFBeEIsRUFBZ0NDLElBQWpHO01BR2FDLGUsV0FEWixvQkFBUSxvQkFBUixDLFVBT0ksaUJBQUtDLFVBQUwsQyxVQU9BLGlCQUFLQyxrQkFBTCxDLFVBT0EsaUJBQUtDLGtCQUFMLEMsVUFzQ0EsaUJBQUtDLHdDQUFMLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNUJEOzs7O3dCQUtZQyxNLEVBQVE7QUFDaEJDLHFCQUFLQyxJQUFMLENBQVUsS0FBS0MsT0FBZixFQUF3QkgsTUFBeEI7QUFDSCxPOzBCQUNhO0FBQ1YsZUFBTyxLQUFLRyxPQUFaO0FBQ0g7QUFFRDs7Ozs7Ozt3QkFLVVQsSSxFQUFNO0FBQ1pPLHFCQUFLQyxJQUFMLENBQVUsS0FBS0UsS0FBZixFQUFzQlYsSUFBdEI7QUFDSCxPOzBCQUNXO0FBQ1IsZUFBTyxLQUFLVSxLQUFaO0FBQ0g7QUFFRDs7Ozs7Ozt3QkFLY0MsSSxFQUFrQztBQUM1QyxZQUFJ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RyxFQUFLO0FBQ2YsOEVBQWlCQSxHQUFqQjtBQUNIOzs7O0lBbER5Q2xOLHdDLHVGQU16Q2MsbUI7Ozs7O2FBRTBCLEk7O29HQVUxQkEsbUI7Ozs7O2FBRXdDLEU7O29GQU94Q0EsbUI7Ozs7O2FBRWlDLEU7OzREQUtqQ3FNLGUscUpBU0FBLGUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xyXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxyXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXHJcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG5cclxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXHJcbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgbW9kZWxcclxuICovXHJcblxyXG5pbXBvcnQgeyBFRElUT1IgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBnZXRXb3JsZFRyYW5zZm9ybVVudGlsUm9vdCB9IGZyb20gJy4uLy4uL2FuaW1hdGlvbi90cmFuc2Zvcm0tdXRpbHMnO1xyXG5pbXBvcnQgeyBGaWx0ZXIsIFBpeGVsRm9ybWF0IH0gZnJvbSAnLi4vLi4vYXNzZXRzL2Fzc2V0LWVudW0nO1xyXG5pbXBvcnQgeyBNYXRlcmlhbCB9IGZyb20gJy4uLy4uL2Fzc2V0cy9tYXRlcmlhbCc7XHJcbmltcG9ydCB7IE1lc2ggfSBmcm9tICcuLi8uLi9hc3NldHMvbWVzaCc7XHJcbmltcG9ydCB7IFNrZWxldG9uIH0gZnJvbSAnLi4vLi4vYXNzZXRzL3NrZWxldG9uJztcclxuaW1wb3J0IHsgVGV4dHVyZTJEIH0gZnJvbSAnLi4vLi4vYXNzZXRzL3RleHR1cmUtMmQnO1xyXG5pbXBvcnQgeyBjY2NsYXNzLCBoZWxwLCBleGVjdXRlSW5FZGl0TW9kZSwgZXhlY3V0aW9uT3JkZXIsIG1lbnUsIHRvb2x0aXAsIHR5cGUsIHZpc2libGUsIG92ZXJyaWRlLCBzZXJpYWxpemFibGUsIGVkaXRhYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgQ0NTdHJpbmcgfSBmcm9tICcuLi8uLi9kYXRhL3V0aWxzL2F0dHJpYnV0ZSc7XHJcbmltcG9ydCB7IEdGWEF0dHJpYnV0ZU5hbWUsIEdGWEJ1ZmZlclRleHR1cmVDb3B5LCBHRlhGb3JtYXRJbmZvcyB9IGZyb20gJy4uLy4uL2dmeC9kZWZpbmUnO1xyXG5pbXBvcnQgeyBHRlhGb3JtYXQsIEdGWFR5cGUgfSBmcm9tICcuLi8uLi9nZngvZGVmaW5lJztcclxuaW1wb3J0IHsgR0ZYRGV2aWNlIH0gZnJvbSAnLi4vLi4vZ2Z4L2RldmljZSc7XHJcbmltcG9ydCB7IEdGWEF0dHJpYnV0ZSB9IGZyb20gJy4uLy4uL2dmeC9pbnB1dC1hc3NlbWJsZXInO1xyXG5pbXBvcnQgeyBNYXQ0LCBWZWMyLCBWZWMzIH0gZnJvbSAnLi4vLi4vbWF0aCc7XHJcbmltcG9ydCB7IG1hcEJ1ZmZlciwgcmVhZEJ1ZmZlciwgd3JpdGVCdWZmZXIgfSBmcm9tICcuLi9taXNjL2J1ZmZlcic7XHJcbmltcG9ydCB7IFNraW5uZWRNZXNoUmVuZGVyZXIgfSBmcm9tICcuL3NraW5uZWQtbWVzaC1yZW5kZXJlcic7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuY29uc3QgcmVwZWF0ID0gKG46IG51bWJlcikgPT4gbiAtIE1hdGguZmxvb3Iobik7XHJcbmNvbnN0IGJhdGNoX2lkOiBHRlhBdHRyaWJ1dGUgPSBuZXcgR0ZYQXR0cmlidXRlKEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9CQVRDSF9JRCwgR0ZYRm9ybWF0LlIzMkYpO1xyXG5jb25zdCBiYXRjaF91djogR0ZYQXR0cmlidXRlID0gbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfQkFUQ0hfVVYsIEdGWEZvcm1hdC5SRzMyRik7XHJcbmNvbnN0IGJhdGNoX2V4dHJhc19zaXplID0gR0ZYRm9ybWF0SW5mb3NbYmF0Y2hfaWQuZm9ybWF0XS5zaXplICsgR0ZYRm9ybWF0SW5mb3NbYmF0Y2hfdXYuZm9ybWF0XS5zaXplO1xyXG5cclxuQGNjY2xhc3MoJ2NjLlNraW5uZWRNZXNoVW5pdCcpXHJcbmV4cG9ydCBjbGFzcyBTa2lubmVkTWVzaFVuaXQge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNraW5uZWQgbWVzaCBvZiB0aGlzIHVuaXQuXHJcbiAgICAgKiBAemgg5a2Q6JKZ55qu5qih5Z6L55qE572R5qC85qih5Z6L44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKE1lc2gpXHJcbiAgICBwdWJsaWMgbWVzaDogTWVzaCB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNrZWxldG9uIG9mIHRoaXMgdW5pdC5cclxuICAgICAqIEB6aCDlrZDokpnnmq7mqKHlnovnmoTpqqjpqrzjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoU2tlbGV0b24pXHJcbiAgICBwdWJsaWMgc2tlbGV0b246IFNrZWxldG9uIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2tpbm5pbmcgbWF0ZXJpYWwgb2YgdGhpcyB1bml0LlxyXG4gICAgICogQHpoIOWtkOiSmeearuaooeWei+S9v+eUqOeahOadkOi0qOOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShNYXRlcmlhbClcclxuICAgIHB1YmxpYyBtYXRlcmlhbDogTWF0ZXJpYWwgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwdWJsaWMgX2xvY2FsVHJhbnNmb3JtID0gbmV3IE1hdDQoKTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX29mZnNldCA9IG5ldyBWZWMyKDAsIDApO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfc2l6ZSA9IG5ldyBWZWMyKDEsIDEpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFVWIG9mZnNldCBvbiB0ZXh0dXJlIGF0bGFzLlxyXG4gICAgICogQHpoIOWcqOWbvumbhuS4reeahCB1diDlnZDmoIflgY/np7vjgIJcclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBzZXQgb2Zmc2V0IChvZmZzZXQpIHtcclxuICAgICAgICBWZWMyLmNvcHkodGhpcy5fb2Zmc2V0LCBvZmZzZXQpO1xyXG4gICAgfVxyXG4gICAgZ2V0IG9mZnNldCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29mZnNldDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBVViBleHRlbnQgb24gdGV4dHVyZSBhdGxhcy5cclxuICAgICAqIEB6aCDlnKjlm77pm4bkuK3ljaDnmoQgVVYg5bC65a+444CCXHJcbiAgICAgKi9cclxuICAgIEBlZGl0YWJsZVxyXG4gICAgc2V0IHNpemUgKHNpemUpIHtcclxuICAgICAgICBWZWMyLmNvcHkodGhpcy5fc2l6ZSwgc2l6ZSk7XHJcbiAgICB9XHJcbiAgICBnZXQgc2l6ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpemU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ29udmVuaWVudCBzZXR0ZXIsIGNvcHlpbmcgYWxsIG5lY2Vzc2FyeSBpbmZvcm1hdGlvbiBmcm9tIHRhcmdldCBbW1NraW5uZWRNZXNoUmVuZGVyZXJdXSBjb21wb25lbnQuXHJcbiAgICAgKiBAemgg5aSN5Yi255uu5qCHIFtbU2tpbm5lZE1lc2hSZW5kZXJlcl1dIOeahOaJgOacieWxnuaAp+WIsOacrOWNleWFg++8jOaWueS+v+W/q+mAn+mFjee9ruOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShTa2lubmVkTWVzaFJlbmRlcmVyKVxyXG4gICAgc2V0IGNvcHlGcm9tIChjb21wOiBTa2lubmVkTWVzaFJlbmRlcmVyIHwgbnVsbCkge1xyXG4gICAgICAgIGlmICghY29tcCkgeyByZXR1cm47IH1cclxuICAgICAgICB0aGlzLm1lc2ggPSBjb21wLm1lc2g7XHJcbiAgICAgICAgdGhpcy5za2VsZXRvbiA9IGNvbXAuc2tlbGV0b247XHJcbiAgICAgICAgdGhpcy5tYXRlcmlhbCA9IGNvbXAuZ2V0TWF0ZXJpYWwoMCk7XHJcbiAgICAgICAgaWYgKGNvbXAuc2tpbm5pbmdSb290KSB7IGdldFdvcmxkVHJhbnNmb3JtVW50aWxSb290KGNvbXAubm9kZSwgY29tcC5za2lubmluZ1Jvb3QsIHRoaXMuX2xvY2FsVHJhbnNmb3JtKTsgfVxyXG4gICAgfVxyXG4gICAgZ2V0IGNvcHlGcm9tICgpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbTRfbG9jYWwgPSBuZXcgTWF0NCgpO1xyXG5jb25zdCBtNF8xID0gbmV3IE1hdDQoKTtcclxuY29uc3QgdjNfMSA9IG5ldyBWZWMzKCk7XHJcblxyXG4vKipcclxuICogQGVuIFRoZSBza2lubmVkIG1lc2ggYmF0Y2ggcmVuZGVyZXIgY29tcG9uZW50LCBiYXRjaGVzIG11bHRpcGxlIHNrZWxldG9uLXNoYXJpbmcgW1tTa2lubmVkTWVzaFJlbmRlcmVyXV0uXHJcbiAqIEB6aCDokpnnmq7mqKHlnovlkIjmibnnu4Tku7bvvIznlKjkuo7lkIjlubbnu5jliLblhbHkuqvlkIzkuIDpqqjpqrzotYTmupDnmoTmiYDmnInokpnnmq7nvZHmoLzjgIJcclxuICovXHJcbkBjY2NsYXNzKCdjYy5Ta2lubmVkTWVzaEJhdGNoUmVuZGVyZXInKVxyXG5AaGVscCgnaTE4bjpjYy5Ta2lubmVkTWVzaEJhdGNoUmVuZGVyZXInKVxyXG5AZXhlY3V0aW9uT3JkZXIoMTAwKVxyXG5AZXhlY3V0ZUluRWRpdE1vZGVcclxuQG1lbnUoJ0NvbXBvbmVudHMvU2tpbm5lZE1lc2hCYXRjaFJlbmRlcmVyJylcclxuZXhwb3J0IGNsYXNzIFNraW5uZWRNZXNoQmF0Y2hSZW5kZXJlciBleHRlbmRzIFNraW5uZWRNZXNoUmVuZGVyZXIge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNpemUgb2YgdGhlIGdlbmVyYXRlZCB0ZXh0dXJlIGF0bGFzLlxyXG4gICAgICogQHpoIOWQiOWbvueUn+aIkOeahOacgOe7iOWbvumbhueahOi+uemVv+OAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAdG9vbHRpcCgnaTE4bjpiYXRjaGVkX3NraW5uaW5nX21vZGVsLmF0bGFzX3NpemUnKVxyXG4gICAgcHVibGljIGF0bGFzU2l6ZTogbnVtYmVyID0gMTAyNDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGV4dHVyZSBwcm9wZXJ0aWVzIHRoYXQgd2lsbCBiZSBhY3R1YWxseSB1c2luZyB0aGUgZ2VuZXJhdGVkIGF0bGFzLjxicj5cclxuICAgICAqIFRoZSBmaXJzdCB1bml0J3MgdGV4dHVyZSB3aWxsIGJlIHVzZWQgaWYgbm90IHNwZWNpZmllZC5cclxuICAgICAqIEB6aFxyXG4gICAgICog5p2Q6LSo5Lit55yf5q2j5Y+C5LiO5ZCI5Zu+55qE6LS05Zu+5bGe5oCn77yM5LiN5Y+C5LiO55qE5bGe5oCn57uf5LiA5L2/55So56ys5LiA5LiqIHVuaXQg55qE6LS05Zu+44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKFtDQ1N0cmluZ10pXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAdG9vbHRpcCgnaTE4bjpiYXRjaGVkX3NraW5uaW5nX21vZGVsLmJhdGNoYWJsZV90ZXh0dXJlX25hbWVzJylcclxuICAgIHB1YmxpYyBiYXRjaGFibGVUZXh0dXJlTmFtZXM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU291cmNlIHNraW5uaW5nIG1vZGVsIGNvbXBvbmVudHMsIGNvbnRhaW5pbmcgYWxsIHRoZSBkYXRhIHRvIGJlIGJhdGNoZWQuXHJcbiAgICAgKiBAemgg5ZCI5om55YmN55qE5a2Q6JKZ55qu5qih5Z6L5pWw57uE77yM5pyA5Li76KaB55qE5pWw5o2u5p2l5rqQ44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKFtTa2lubmVkTWVzaFVuaXRdKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQHRvb2x0aXAoJ2kxOG46YmF0Y2hlZF9za2lubmluZ19tb2RlbC51bml0cycpXHJcbiAgICBwdWJsaWMgdW5pdHM6IFNraW5uZWRNZXNoVW5pdFtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBfdGV4dHVyZXM6IFJlY29yZDxzdHJpbmcsIFRleHR1cmUyRD4gPSB7fTtcclxuICAgIHByaXZhdGUgX2JhdGNoTWF0ZXJpYWw6IE1hdGVyaWFsIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgQG92ZXJyaWRlXHJcbiAgICBAdmlzaWJsZShmYWxzZSlcclxuICAgIGdldCBtZXNoICgpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIubWVzaDtcclxuICAgIH1cclxuICAgIHNldCBtZXNoICh2YWwpIHtcclxuICAgICAgICBzdXBlci5tZXNoID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIEBvdmVycmlkZVxyXG4gICAgQHZpc2libGUoZmFsc2UpXHJcbiAgICBnZXQgc2tlbGV0b24gKCkge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5za2VsZXRvbjtcclxuICAgIH1cclxuICAgIHNldCBza2VsZXRvbiAodmFsKSB7XHJcbiAgICAgICAgc3VwZXIuc2tlbGV0b24gPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uTG9hZCAoKSB7XHJcbiAgICAgICAgc3VwZXIub25Mb2FkKCk7XHJcbiAgICAgICAgdGhpcy5jb29rKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGVzdHJveSAoKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCB0ZXggaW4gdGhpcy5fdGV4dHVyZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dHVyZXNbdGV4XS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3RleHR1cmVzID0ge307XHJcbiAgICAgICAgaWYgKHRoaXMuX21lc2gpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWVzaC5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX21lc2ggPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdXBlci5vbkRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX29uTWF0ZXJpYWxNb2RpZmllZCAoaWR4OiBudW1iZXIsIG1hdGVyaWFsOiBNYXRlcmlhbCB8IG51bGwpIHtcclxuICAgICAgICB0aGlzLmNvb2tNYXRlcmlhbHMoKTtcclxuICAgICAgICBzdXBlci5fb25NYXRlcmlhbE1vZGlmaWVkKGlkeCwgdGhpcy5nZXRNYXRlcmlhbEluc3RhbmNlKGlkeCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb29rICgpIHtcclxuICAgICAgICB0aGlzLmNvb2tNYXRlcmlhbHMoKTtcclxuICAgICAgICB0aGlzLmNvb2tTa2VsZXRvbnMoKTtcclxuICAgICAgICB0aGlzLmNvb2tNZXNoZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29va01hdGVyaWFscyAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9iYXRjaE1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2JhdGNoTWF0ZXJpYWwgPSB0aGlzLmdldE1hdGVyaWFsKDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBtYXQgPSB0aGlzLmdldE1hdGVyaWFsSW5zdGFuY2UoMCk7XHJcbiAgICAgICAgaWYgKCFtYXQgfHwgIXRoaXMuX2JhdGNoTWF0ZXJpYWwgfHwgIXRoaXMuX2JhdGNoTWF0ZXJpYWwuZWZmZWN0QXNzZXQpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdpbmNvbXBsZXRlIGJhdGNoIG1hdGVyaWFsIScpOyByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1hdC5jb3B5KHRoaXMuX2JhdGNoTWF0ZXJpYWwpOyB0aGlzLnJlc2l6ZUF0bGFzZXMoKTtcclxuICAgICAgICBjb25zdCB0ZWNoID0gbWF0LmVmZmVjdEFzc2V0IS50ZWNobmlxdWVzW21hdC50ZWNobmlxdWVdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGVjaC5wYXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgcGFzcyA9IHRlY2gucGFzc2VzW2ldO1xyXG4gICAgICAgICAgICBpZiAoIXBhc3MucHJvcGVydGllcykgeyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHByb3AgaW4gcGFzcy5wcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFzcy5wcm9wZXJ0aWVzW3Byb3BdLnR5cGUgPj0gR0ZYVHlwZS5TQU1QTEVSMUQpIHsgLy8gc2FtcGxlcnNcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGV4OiBUZXh0dXJlMkQgfCBudWxsID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5iYXRjaGFibGVUZXh0dXJlTmFtZXMuZmluZCgobikgPT4gbiA9PT0gcHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4ID0gdGhpcy5fdGV4dHVyZXNbcHJvcF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGV4KSB7IHRleCA9IHRoaXMuY3JlYXRlVGV4dHVyZShwcm9wKTsgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvb2tUZXh0dXJlcyh0ZXgsIHByb3AsIGkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudW5pdHMuc29tZSgodSkgPT4gdGV4ID0gdS5tYXRlcmlhbCAmJiB1Lm1hdGVyaWFsLmdldFByb3BlcnR5KHByb3AsIGkpIGFzIFRleHR1cmUyRCB8IG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGV4KSB7IG1hdC5zZXRQcm9wZXJ0eShwcm9wLCB0ZXgsIGkpOyB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyB2ZWN0b3JzXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWU6IGFueVtdID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdSA9IDA7IHUgPCB0aGlzLnVuaXRzLmxlbmd0aDsgdSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVuaXQgPSB0aGlzLnVuaXRzW3VdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVuaXQubWF0ZXJpYWwpIHsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUucHVzaCh1bml0Lm1hdGVyaWFsLmdldFByb3BlcnR5KHByb3Auc2xpY2UoMCwgLTMpLCBpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIG1hdC5zZXRQcm9wZXJ0eShwcm9wLCB2YWx1ZSwgaSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvb2tTa2VsZXRvbnMgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fc2tpbm5pbmdSb290KSB7IGNvbnNvbGUud2Fybignbm8gc2tpbm5pbmcgcm9vdCBzcGVjaWZpZWQhJyk7IHJldHVybjsgfVxyXG4gICAgICAgIC8vIG1lcmdlIGpvaW50cyBhY2NvcmRpbmdseVxyXG4gICAgICAgIGNvbnN0IGpvaW50czogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBjb25zdCBiaW5kcG9zZXM6IE1hdDRbXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IHUgPSAwOyB1IDwgdGhpcy51bml0cy5sZW5ndGg7IHUrKykge1xyXG4gICAgICAgICAgICBjb25zdCB1bml0ID0gdGhpcy51bml0c1t1XTtcclxuICAgICAgICAgICAgaWYgKCF1bml0IHx8ICF1bml0LnNrZWxldG9uKSB7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcnRpYWwgPSB1bml0LnNrZWxldG9uO1xyXG4gICAgICAgICAgICBNYXQ0LmludmVydChtNF9sb2NhbCwgdW5pdC5fbG9jYWxUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRpYWwuam9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gcGFydGlhbC5qb2ludHNbaV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpZHggPSBqb2ludHMuZmluZEluZGV4KChwKSA9PiBwID09PSBwYXRoKTtcclxuICAgICAgICAgICAgICAgIGlmIChpZHggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChFRElUT1IpIHsgLy8gY29uc2lzdGVuY3kgY2hlY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0NC5tdWx0aXBseShtNF8xLCBwYXJ0aWFsLmJpbmRwb3Nlc1tpXSwgbTRfbG9jYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW00XzEuZXF1YWxzKGJpbmRwb3Nlc1tpZHhdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGAke3RoaXMubm9kZS5uYW1lfTogSW5jb25zaXN0ZW50IGJpbmRwb3NlIGF0ICR7am9pbnRzW2lkeF19IGluIHVuaXQgJHt1fSwgYXJ0aWZhY3RzIG1heSBwcmVzZW50YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBqb2ludHMucHVzaChwYXRoKTtcclxuICAgICAgICAgICAgICAgIC8vIGNhbmNlbCBvdXQgbG9jYWwgdHJhbnNmb3JtXHJcbiAgICAgICAgICAgICAgICBiaW5kcG9zZXMucHVzaChNYXQ0Lm11bHRpcGx5KG5ldyBNYXQ0KCksIHBhcnRpYWwuYmluZHBvc2VzW2ldIHx8IE1hdDQuSURFTlRJVFksIG00X2xvY2FsKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc29ydCB0aGUgYXJyYXkgdG8gYmUgbW9yZSBjYWNoZS1mcmllbmRseVxyXG4gICAgICAgIGNvbnN0IGlkeE1hcCA9IEFycmF5LmZyb20oQXJyYXkoam9pbnRzLmxlbmd0aCkua2V5cygpKS5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChqb2ludHNbYV0gPiBqb2ludHNbYl0pIHsgcmV0dXJuIDE7IH1cclxuICAgICAgICAgICAgaWYgKGpvaW50c1thXSA8IGpvaW50c1tiXSkgeyByZXR1cm4gLTE7IH1cclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3Qgc2tlbGV0b24gPSBuZXcgU2tlbGV0b24oKTtcclxuICAgICAgICBza2VsZXRvbi5qb2ludHMgPSBqb2ludHMubWFwKChfLCBpZHgsIGFycikgPT4gYXJyW2lkeE1hcFtpZHhdXSk7XHJcbiAgICAgICAgc2tlbGV0b24uYmluZHBvc2VzID0gYmluZHBvc2VzLm1hcCgoXywgaWR4LCBhcnIpID0+IGFycltpZHhNYXBbaWR4XV0pO1xyXG4gICAgICAgIC8vIGFwcGx5XHJcbiAgICAgICAgaWYgKHRoaXMuX3NrZWxldG9uKSB7IHRoaXMuX3NrZWxldG9uLmRlc3Ryb3koKTsgfVxyXG4gICAgICAgIHRoaXMuc2tlbGV0b24gPSBza2VsZXRvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29va01lc2hlcyAoKSB7XHJcbiAgICAgICAgbGV0IGlzVmFsaWQgPSBmYWxzZTtcclxuICAgICAgICBmb3IgKGxldCB1ID0gMDsgdSA8IHRoaXMudW5pdHMubGVuZ3RoOyB1KyspIHtcclxuICAgICAgICAgICAgY29uc3QgdW5pdCA9IHRoaXMudW5pdHNbdV07XHJcbiAgICAgICAgICAgIGlmICh1bml0Lm1lc2gpIHtcclxuICAgICAgICAgICAgICAgIGlzVmFsaWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghaXNWYWxpZCB8fCAhdGhpcy5fc2tpbm5pbmdSb290KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9tZXNoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21lc2guZGVzdHJveVJlbmRlcmluZ01lc2goKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9tZXNoID0gbmV3IE1lc2goKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBwb3NPZmZzZXQgPSAwO1xyXG4gICAgICAgIGxldCBwb3NGb3JtYXQgPSBHRlhGb3JtYXQuVU5LTk9XTjtcclxuICAgICAgICBsZXQgbm9ybWFsT2Zmc2V0ID0gMDtcclxuICAgICAgICBsZXQgbm9ybWFsRm9ybWF0ID0gR0ZYRm9ybWF0LlVOS05PV047XHJcbiAgICAgICAgbGV0IHRhbmdlbnRPZmZzZXQgPSAwO1xyXG4gICAgICAgIGxldCB0YW5nZW50Rm9ybWF0ID0gR0ZYRm9ybWF0LlVOS05PV047XHJcbiAgICAgICAgbGV0IHV2T2Zmc2V0ID0gMDtcclxuICAgICAgICBsZXQgdXZGb3JtYXQgPSBHRlhGb3JtYXQuVU5LTk9XTjtcclxuICAgICAgICBsZXQgam9pbnRPZmZzZXQgPSAwO1xyXG4gICAgICAgIGxldCBqb2ludEZvcm1hdCA9IEdGWEZvcm1hdC5VTktOT1dOO1xyXG5cclxuICAgICAgICAvLyBwcmVwYXJlIGpvaW50IGluZGV4IG1hcFxyXG4gICAgICAgIGNvbnN0IGpvaW50SW5kZXhNYXA6IG51bWJlcltdW10gPSBuZXcgQXJyYXkodGhpcy51bml0cy5sZW5ndGgpO1xyXG4gICAgICAgIGNvbnN0IHVuaXRMZW4gPSB0aGlzLnVuaXRzLmxlbmd0aDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVuaXRMZW47IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB1bml0ID0gdGhpcy51bml0c1tpXTtcclxuICAgICAgICAgICAgaWYgKCF1bml0IHx8ICF1bml0LnNrZWxldG9uKSB7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgIGpvaW50SW5kZXhNYXBbaV0gPSB1bml0LnNrZWxldG9uLmpvaW50cy5tYXAoKGopID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9za2VsZXRvbiEuam9pbnRzLmZpbmRJbmRleCgocmVmKSA9PiBqID09PSByZWYpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdW5pdExlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVuaXQgPSB0aGlzLnVuaXRzW2ldO1xyXG4gICAgICAgICAgICBpZiAoIXVuaXQgfHwgIXVuaXQubWVzaCB8fCAhdW5pdC5tZXNoLmRhdGEpIHsgY29udGludWU7IH1cclxuICAgICAgICAgICAgY29uc3QgbmV3TWVzaCA9IHRoaXMuX2NyZWF0ZVVuaXRNZXNoKGksIHVuaXQubWVzaCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGFWaWV3ID0gbmV3IERhdGFWaWV3KG5ld01lc2guZGF0YS5idWZmZXIpO1xyXG4gICAgICAgICAgICBNYXQ0LmludmVyc2VUcmFuc3Bvc2UobTRfbG9jYWwsIHVuaXQuX2xvY2FsVHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gdW5pdC5vZmZzZXQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHNpemUgPSB1bml0LnNpemU7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGIgPSAwOyBiIDwgbmV3TWVzaC5zdHJ1Y3QudmVydGV4QnVuZGxlcy5sZW5ndGg7IGIrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYnVuZGxlID0gbmV3TWVzaC5zdHJ1Y3QudmVydGV4QnVuZGxlc1tiXTtcclxuICAgICAgICAgICAgICAgIC8vIGFwcGx5IGxvY2FsIHRyYW5zZm9ybSB0byBtZXNoXHJcbiAgICAgICAgICAgICAgICBwb3NPZmZzZXQgPSBidW5kbGUudmlldy5vZmZzZXQ7XHJcbiAgICAgICAgICAgICAgICBwb3NGb3JtYXQgPSBHRlhGb3JtYXQuVU5LTk9XTjtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgYnVuZGxlLmF0dHJpYnV0ZXMubGVuZ3RoOyBhKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhdHRyID0gYnVuZGxlLmF0dHJpYnV0ZXNbYV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHIubmFtZSA9PT0gR0ZYQXR0cmlidXRlTmFtZS5BVFRSX1BPU0lUSU9OKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc0Zvcm1hdCA9IGF0dHIuZm9ybWF0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zT2Zmc2V0ICs9IEdGWEZvcm1hdEluZm9zW2F0dHIuZm9ybWF0XS5zaXplO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHBvc0Zvcm1hdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvcyA9IHJlYWRCdWZmZXIoZGF0YVZpZXcsIHBvc0Zvcm1hdCwgcG9zT2Zmc2V0LCBidW5kbGUudmlldy5sZW5ndGgsIGJ1bmRsZS52aWV3LnN0cmlkZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwb3MubGVuZ3RoOyBqICs9IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVmVjMy5mcm9tQXJyYXkodjNfMSwgcG9zLCBqKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KHYzXzEsIHYzXzEsIHVuaXQuX2xvY2FsVHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVmVjMy50b0FycmF5KHBvcywgdjNfMSwgaik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHdyaXRlQnVmZmVyKGRhdGFWaWV3LCBwb3MsIHBvc0Zvcm1hdCwgcG9zT2Zmc2V0LCBidW5kbGUudmlldy5zdHJpZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbm9ybWFsT2Zmc2V0ID0gYnVuZGxlLnZpZXcub2Zmc2V0O1xyXG4gICAgICAgICAgICAgICAgbm9ybWFsRm9ybWF0ID0gR0ZYRm9ybWF0LlVOS05PV047XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBhID0gMDsgYSA8IGJ1bmRsZS5hdHRyaWJ1dGVzLmxlbmd0aDsgYSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IGJ1bmRsZS5hdHRyaWJ1dGVzW2FdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRyLm5hbWUgPT09IEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9OT1JNQUwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsRm9ybWF0ID0gYXR0ci5mb3JtYXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBub3JtYWxPZmZzZXQgKz0gR0ZYRm9ybWF0SW5mb3NbYXR0ci5mb3JtYXRdLnNpemU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobm9ybWFsRm9ybWF0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9ybWFsID0gcmVhZEJ1ZmZlcihkYXRhVmlldywgbm9ybWFsRm9ybWF0LCBub3JtYWxPZmZzZXQsIGJ1bmRsZS52aWV3Lmxlbmd0aCwgYnVuZGxlLnZpZXcuc3RyaWRlKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5vcm1hbC5sZW5ndGg7IGogKz0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBWZWMzLmZyb21BcnJheSh2M18xLCBub3JtYWwsIGopO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDROb3JtYWwodjNfMSwgdjNfMSwgbTRfbG9jYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBWZWMzLnRvQXJyYXkobm9ybWFsLCB2M18xLCBqKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGVCdWZmZXIoZGF0YVZpZXcsIG5vcm1hbCwgbm9ybWFsRm9ybWF0LCBub3JtYWxPZmZzZXQsIGJ1bmRsZS52aWV3LnN0cmlkZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YW5nZW50T2Zmc2V0ID0gYnVuZGxlLnZpZXcub2Zmc2V0O1xyXG4gICAgICAgICAgICAgICAgdGFuZ2VudEZvcm1hdCA9IEdGWEZvcm1hdC5VTktOT1dOO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYSA9IDA7IGEgPCBidW5kbGUuYXR0cmlidXRlcy5sZW5ndGg7IGErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF0dHIgPSBidW5kbGUuYXR0cmlidXRlc1thXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0ci5uYW1lID09PSBHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfVEFOR0VOVCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YW5nZW50Rm9ybWF0ID0gYXR0ci5mb3JtYXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0YW5nZW50T2Zmc2V0ICs9IEdGWEZvcm1hdEluZm9zW2F0dHIuZm9ybWF0XS5zaXplO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRhbmdlbnRGb3JtYXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YW5nZW50ID0gcmVhZEJ1ZmZlcihkYXRhVmlldywgdGFuZ2VudEZvcm1hdCwgdGFuZ2VudE9mZnNldCwgYnVuZGxlLnZpZXcubGVuZ3RoLCBidW5kbGUudmlldy5zdHJpZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGFuZ2VudC5sZW5ndGg7IGogKz0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBWZWMzLmZyb21BcnJheSh2M18xLCB0YW5nZW50LCBqKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0Tm9ybWFsKHYzXzEsIHYzXzEsIG00X2xvY2FsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVmVjMy50b0FycmF5KHRhbmdlbnQsIHYzXzEsIGopO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB3cml0ZUJ1ZmZlcihkYXRhVmlldywgdGFuZ2VudCwgdGFuZ2VudEZvcm1hdCwgdGFuZ2VudE9mZnNldCwgYnVuZGxlLnZpZXcuc3RyaWRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIG1lcmdlIFVWXHJcbiAgICAgICAgICAgICAgICB1dk9mZnNldCA9IGJ1bmRsZS52aWV3Lm9mZnNldDtcclxuICAgICAgICAgICAgICAgIHV2Rm9ybWF0ID0gR0ZYRm9ybWF0LlVOS05PV047XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBhID0gMDsgYSA8IGJ1bmRsZS5hdHRyaWJ1dGVzLmxlbmd0aDsgYSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IGJ1bmRsZS5hdHRyaWJ1dGVzW2FdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRyLm5hbWUgPT09IEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9CQVRDSF9VVikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1dkZvcm1hdCA9IGF0dHIuZm9ybWF0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdXZPZmZzZXQgKz0gR0ZYRm9ybWF0SW5mb3NbYXR0ci5mb3JtYXRdLnNpemU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodXZGb3JtYXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXBCdWZmZXIoZGF0YVZpZXcsIChjdXIsIGlkeCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXIgPSByZXBlYXQoY3VyKTsgLy8gd2FycCB0byBbMCwgMV0gZmlyc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tcCA9IGlkeCA9PT0gMCA/ICd4JyA6ICd5JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1ciAqIHNpemVbY29tcF0gKyBvZmZzZXRbY29tcF07XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgdXZGb3JtYXQsIHV2T2Zmc2V0LCBidW5kbGUudmlldy5sZW5ndGgsIGJ1bmRsZS52aWV3LnN0cmlkZSwgZGF0YVZpZXcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gbWVyZ2Ugam9pbnQgaW5kaWNlc1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWR4TWFwID0gam9pbnRJbmRleE1hcFtpXTtcclxuICAgICAgICAgICAgICAgIGlmICghaWR4TWFwKSB7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICBqb2ludE9mZnNldCA9IGJ1bmRsZS52aWV3Lm9mZnNldDtcclxuICAgICAgICAgICAgICAgIGpvaW50Rm9ybWF0ID0gR0ZYRm9ybWF0LlVOS05PV047XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBhID0gMDsgYSA8IGJ1bmRsZS5hdHRyaWJ1dGVzLmxlbmd0aDsgYSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IGJ1bmRsZS5hdHRyaWJ1dGVzW2FdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRyLm5hbWUgPT09IEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9KT0lOVFMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgam9pbnRGb3JtYXQgPSBhdHRyLmZvcm1hdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGpvaW50T2Zmc2V0ICs9IEdGWEZvcm1hdEluZm9zW2F0dHIuZm9ybWF0XS5zaXplO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGpvaW50Rm9ybWF0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwQnVmZmVyKGRhdGFWaWV3LCAoY3VyKSA9PiBpZHhNYXBbY3VyXSwgam9pbnRGb3JtYXQsIGpvaW50T2Zmc2V0LCBidW5kbGUudmlldy5sZW5ndGgsIGJ1bmRsZS52aWV3LnN0cmlkZSwgZGF0YVZpZXcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX21lc2ghLm1lcmdlKG5ld01lc2gpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fb25NZXNoQ2hhbmdlZCh0aGlzLl9tZXNoKTtcclxuICAgICAgICB0aGlzLl91cGRhdGVNb2RlbHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29va1RleHR1cmVzICh0YXJnZXQ6IFRleHR1cmUyRCwgcHJvcDogc3RyaW5nLCBwYXNzSWR4OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB0ZXhJbWFnZXM6IFRleEltYWdlU291cmNlW10gPSBbXTtcclxuICAgICAgICBjb25zdCB0ZXhJbWFnZVJlZ2lvbnM6IEdGWEJ1ZmZlclRleHR1cmVDb3B5W10gPSBbXTtcclxuICAgICAgICBjb25zdCB0ZXhCdWZmZXJzOiBBcnJheUJ1ZmZlclZpZXdbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHRleEJ1ZmZlclJlZ2lvbnM6IEdGWEJ1ZmZlclRleHR1cmVDb3B5W10gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCB1ID0gMDsgdSA8IHRoaXMudW5pdHMubGVuZ3RoOyB1KyspIHtcclxuICAgICAgICAgICAgY29uc3QgdW5pdCA9IHRoaXMudW5pdHNbdV07XHJcbiAgICAgICAgICAgIGlmICghdW5pdC5tYXRlcmlhbCkgeyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICBjb25zdCBwYXJ0aWFsID0gdW5pdC5tYXRlcmlhbC5nZXRQcm9wZXJ0eShwcm9wLCBwYXNzSWR4KSBhcyBUZXh0dXJlMkQgfCBudWxsO1xyXG4gICAgICAgICAgICBpZiAocGFydGlhbCAmJiBwYXJ0aWFsLmltYWdlICYmIHBhcnRpYWwuaW1hZ2UuZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVnaW9uID0gbmV3IEdGWEJ1ZmZlclRleHR1cmVDb3B5KCk7XHJcbiAgICAgICAgICAgICAgICByZWdpb24udGV4T2Zmc2V0LnggPSB1bml0Lm9mZnNldC54ICogdGhpcy5hdGxhc1NpemU7XHJcbiAgICAgICAgICAgICAgICByZWdpb24udGV4T2Zmc2V0LnkgPSB1bml0Lm9mZnNldC55ICogdGhpcy5hdGxhc1NpemU7XHJcbiAgICAgICAgICAgICAgICByZWdpb24udGV4RXh0ZW50LndpZHRoID0gdW5pdC5zaXplLnggKiB0aGlzLmF0bGFzU2l6ZTtcclxuICAgICAgICAgICAgICAgIHJlZ2lvbi50ZXhFeHRlbnQuaGVpZ2h0ID0gdW5pdC5zaXplLnkgKiB0aGlzLmF0bGFzU2l6ZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBwYXJ0aWFsLmltYWdlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIEhUTUxDYW52YXNFbGVtZW50IHx8IGRhdGEgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4SW1hZ2VzLnB1c2goZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4SW1hZ2VSZWdpb25zLnB1c2gocmVnaW9uKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4QnVmZmVycy5wdXNoKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRleEJ1ZmZlclJlZ2lvbnMucHVzaChyZWdpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGdmeFRleCA9IHRhcmdldC5nZXRHRlhUZXh0dXJlKCkhO1xyXG4gICAgICAgIGNvbnN0IGRldmljZTogR0ZYRGV2aWNlID0gbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdCEuZGV2aWNlO1xyXG4gICAgICAgIGlmICh0ZXhCdWZmZXJzLmxlbmd0aCA+IDApIHsgZGV2aWNlLmNvcHlCdWZmZXJzVG9UZXh0dXJlKHRleEJ1ZmZlcnMsIGdmeFRleCwgdGV4QnVmZmVyUmVnaW9ucyk7IH1cclxuICAgICAgICBpZiAodGV4SW1hZ2VzLmxlbmd0aCA+IDApIHsgZGV2aWNlLmNvcHlUZXhJbWFnZXNUb1RleHR1cmUodGV4SW1hZ2VzLCBnZnhUZXgsIHRleEltYWdlUmVnaW9ucyk7IH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlVGV4dHVyZSAocHJvcDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgdGV4ID0gbmV3IFRleHR1cmUyRCgpO1xyXG4gICAgICAgIHRleC5zZXRGaWx0ZXJzKEZpbHRlci5MSU5FQVIsIEZpbHRlci5MSU5FQVIpO1xyXG4gICAgICAgIHRleC5zZXRNaXBGaWx0ZXIoRmlsdGVyLkxJTkVBUik7XHJcbiAgICAgICAgdGV4LnJlc2V0KHtcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuYXRsYXNTaXplLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuYXRsYXNTaXplLFxyXG4gICAgICAgICAgICBmb3JtYXQ6IFBpeGVsRm9ybWF0LlJHQkE4ODg4LFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRleC5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3RleHR1cmVzW3Byb3BdID0gdGV4O1xyXG4gICAgICAgIHJldHVybiB0ZXg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlc2l6ZUF0bGFzZXMgKCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgcHJvcCBpbiB0aGlzLl90ZXh0dXJlcykge1xyXG4gICAgICAgICAgICBjb25zdCB0ZXggPSB0aGlzLl90ZXh0dXJlc1twcm9wXTtcclxuICAgICAgICAgICAgdGV4LnJlc2V0KHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmF0bGFzU2l6ZSxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5hdGxhc1NpemUsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXQ6IFBpeGVsRm9ybWF0LlJHQkE4ODg4LFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY3JlYXRlVW5pdE1lc2ggKHVuaXRJZHg6IG51bWJlciwgbWVzaDogTWVzaCkge1xyXG4gICAgICAgIC8vIGFkZCBiYXRjaCBJRCB0byB0aGlzIHRlbXAgbWVzaFxyXG4gICAgICAgIC8vIGZpcnN0LCB1cGRhdGUgYm9va2tlZXBpbmdcclxuICAgICAgICBjb25zdCBuZXdNZXNoU3RydWN0OiBNZXNoLklTdHJ1Y3QgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG1lc2guc3RydWN0KSk7XHJcbiAgICAgICAgY29uc3QgbW9kaWZpZWRCdW5kbGVzOiBSZWNvcmQ8bnVtYmVyLCBbR0ZYRm9ybWF0LCBudW1iZXJdPiA9IHt9O1xyXG4gICAgICAgIGZvciAobGV0IHAgPSAwOyBwIDwgbWVzaC5zdHJ1Y3QucHJpbWl0aXZlcy5sZW5ndGg7IHArKykge1xyXG4gICAgICAgICAgICBjb25zdCBwcmltaXRpdmUgPSBtZXNoLnN0cnVjdC5wcmltaXRpdmVzW3BdO1xyXG4gICAgICAgICAgICBsZXQgdXZPZmZzZXQgPSAwO1xyXG4gICAgICAgICAgICBsZXQgdXZGb3JtYXQgPSBHRlhGb3JtYXQuVU5LTk9XTjtcclxuICAgICAgICAgICAgbGV0IGJ1bmRsZUlkeCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoOyBidW5kbGVJZHggPCBwcmltaXRpdmUudmVydGV4QnVuZGVsSW5kaWNlcy5sZW5ndGg7IGJ1bmRsZUlkeCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBidW5kbGUgPSBtZXNoLnN0cnVjdC52ZXJ0ZXhCdW5kbGVzW3ByaW1pdGl2ZS52ZXJ0ZXhCdW5kZWxJbmRpY2VzW2J1bmRsZUlkeF1dO1xyXG4gICAgICAgICAgICAgICAgdXZPZmZzZXQgPSBidW5kbGUudmlldy5vZmZzZXQ7XHJcbiAgICAgICAgICAgICAgICB1dkZvcm1hdCA9IEdGWEZvcm1hdC5VTktOT1dOO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYSA9IDA7IGEgPCBidW5kbGUuYXR0cmlidXRlcy5sZW5ndGg7IGErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF0dHIgPSBidW5kbGUuYXR0cmlidXRlc1thXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0ci5uYW1lID09PSBHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfVEVYX0NPT1JEKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV2Rm9ybWF0ID0gYXR0ci5mb3JtYXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB1dk9mZnNldCArPSBHRlhGb3JtYXRJbmZvc1thdHRyLmZvcm1hdF0uc2l6ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh1dkZvcm1hdCkgeyBicmVhazsgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChtb2RpZmllZEJ1bmRsZXNbYnVuZGxlSWR4XSAhPT0gdW5kZWZpbmVkKSB7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgIG1vZGlmaWVkQnVuZGxlc1tidW5kbGVJZHhdID0gWyB1dkZvcm1hdCwgdXZPZmZzZXQgXTtcclxuICAgICAgICAgICAgY29uc3QgbmV3QnVuZGxlID0gbmV3TWVzaFN0cnVjdC52ZXJ0ZXhCdW5kbGVzW2J1bmRsZUlkeF07IC8vIHB1dCB0aGUgbmV3IFVWcyBpbiB0aGUgc2FtZSBidW5kbGUgd2l0aCBvcmlnaW5hbCBVVnNcclxuICAgICAgICAgICAgbmV3QnVuZGxlLmF0dHJpYnV0ZXMucHVzaChiYXRjaF9pZCk7XHJcbiAgICAgICAgICAgIG5ld0J1bmRsZS5hdHRyaWJ1dGVzLnB1c2goYmF0Y2hfdXYpO1xyXG4gICAgICAgICAgICBuZXdCdW5kbGUudmlldy5vZmZzZXQgPSAwO1xyXG4gICAgICAgICAgICBuZXdCdW5kbGUudmlldy5sZW5ndGggKz0gbmV3QnVuZGxlLnZpZXcuY291bnQgKiBiYXRjaF9leHRyYXNfc2l6ZTtcclxuICAgICAgICAgICAgbmV3QnVuZGxlLnZpZXcuc3RyaWRlICs9IGJhdGNoX2V4dHJhc19zaXplO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdG90YWxMZW5ndGggPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGIgPSAwOyBiIDwgbmV3TWVzaFN0cnVjdC52ZXJ0ZXhCdW5kbGVzLmxlbmd0aDsgYisrKSB7XHJcbiAgICAgICAgICAgIHRvdGFsTGVuZ3RoICs9IG5ld01lc2hTdHJ1Y3QudmVydGV4QnVuZGxlc1tiXS52aWV3Lmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgcCA9IDA7IHAgPCBuZXdNZXNoU3RydWN0LnByaW1pdGl2ZXMubGVuZ3RoOyBwKyspIHtcclxuICAgICAgICAgICAgY29uc3QgcG0gPSBuZXdNZXNoU3RydWN0LnByaW1pdGl2ZXNbcF07XHJcbiAgICAgICAgICAgIGlmIChwbS5pbmRleFZpZXcpIHtcclxuICAgICAgICAgICAgICAgIHBtLmluZGV4Vmlldy5vZmZzZXQgPSB0b3RhbExlbmd0aDtcclxuICAgICAgICAgICAgICAgIHRvdGFsTGVuZ3RoICs9IHBtLmluZGV4Vmlldy5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gbm93LCB3ZSByaWRlIVxyXG4gICAgICAgIGNvbnN0IG5ld01lc2hEYXRhID0gbmV3IFVpbnQ4QXJyYXkodG90YWxMZW5ndGgpO1xyXG4gICAgICAgIGNvbnN0IG9sZE1lc2hEYXRhID0gbWVzaC5kYXRhO1xyXG4gICAgICAgIGNvbnN0IG5ld0RhdGFWaWV3ID0gbmV3IERhdGFWaWV3KG5ld01lc2hEYXRhLmJ1ZmZlcik7XHJcbiAgICAgICAgY29uc3Qgb2xkRGF0YVZpZXcgPSBuZXcgRGF0YVZpZXcob2xkTWVzaERhdGEuYnVmZmVyKTtcclxuICAgICAgICBjb25zdCBpc0xpdHRsZUVuZGlhbiA9IGxlZ2FjeUNDLnN5cy5pc0xpdHRsZUVuZGlhbjtcclxuICAgICAgICBmb3IgKGNvbnN0IGIgaW4gbW9kaWZpZWRCdW5kbGVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld0J1bmRsZSA9IG5ld01lc2hTdHJ1Y3QudmVydGV4QnVuZGxlc1tiXTtcclxuICAgICAgICAgICAgY29uc3Qgb2xkQnVuZGxlID0gbWVzaC5zdHJ1Y3QudmVydGV4QnVuZGxlc1tiXTtcclxuICAgICAgICAgICAgY29uc3QgWyB1dkZvcm1hdCwgdXZPZmZzZXQgXSA9IG1vZGlmaWVkQnVuZGxlc1tiXTtcclxuICAgICAgICAgICAgY29uc3QgdXZzID0gcmVhZEJ1ZmZlcihvbGREYXRhVmlldywgdXZGb3JtYXQsIHV2T2Zmc2V0LCBvbGRCdW5kbGUudmlldy5sZW5ndGgsIG9sZEJ1bmRsZS52aWV3LnN0cmlkZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG9sZFZpZXcgPSBvbGRCdW5kbGUudmlldztcclxuICAgICAgICAgICAgY29uc3QgbmV3VmlldyA9IG5ld0J1bmRsZS52aWV3O1xyXG4gICAgICAgICAgICBjb25zdCBvbGRTdHJpZGUgPSBvbGRWaWV3LnN0cmlkZTtcclxuICAgICAgICAgICAgY29uc3QgbmV3U3RyaWRlID0gbmV3Vmlldy5zdHJpZGU7XHJcbiAgICAgICAgICAgIGxldCBvbGRPZmZzZXQgPSBvbGRWaWV3Lm9mZnNldDtcclxuICAgICAgICAgICAgbGV0IG5ld09mZnNldCA9IG5ld1ZpZXcub2Zmc2V0O1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5ld1ZpZXcuY291bnQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3JjVmVydGV4ID0gb2xkTWVzaERhdGEuc3ViYXJyYXkob2xkT2Zmc2V0LCBvbGRPZmZzZXQgKyBvbGRTdHJpZGUpO1xyXG4gICAgICAgICAgICAgICAgbmV3TWVzaERhdGEuc2V0KHNyY1ZlcnRleCwgbmV3T2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgIC8vIGluc2VydCBiYXRjaCBJRFxyXG4gICAgICAgICAgICAgICAgbmV3RGF0YVZpZXcuc2V0RmxvYXQzMihuZXdPZmZzZXQgKyBvbGRTdHJpZGUsIHVuaXRJZHgsICk7XHJcbiAgICAgICAgICAgICAgICAvLyBpbnNlcnQgYmF0Y2ggVVZcclxuICAgICAgICAgICAgICAgIG5ld0RhdGFWaWV3LnNldEZsb2F0MzIobmV3T2Zmc2V0ICsgb2xkU3RyaWRlICsgNCwgdXZzW2ogKiAyXSwgaXNMaXR0bGVFbmRpYW4pO1xyXG4gICAgICAgICAgICAgICAgbmV3RGF0YVZpZXcuc2V0RmxvYXQzMihuZXdPZmZzZXQgKyBvbGRTdHJpZGUgKyA4LCB1dnNbaiAqIDIgKyAxXSwgaXNMaXR0bGVFbmRpYW4pO1xyXG4gICAgICAgICAgICAgICAgbmV3T2Zmc2V0ICs9IG5ld1N0cmlkZTtcclxuICAgICAgICAgICAgICAgIG9sZE9mZnNldCArPSBvbGRTdHJpZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBuZXdNZXNoU3RydWN0LnByaW1pdGl2ZXMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgb2xkUHJpbWl0aXZlID0gbWVzaC5zdHJ1Y3QucHJpbWl0aXZlc1trXTtcclxuICAgICAgICAgICAgY29uc3QgbmV3UHJpbWl0aXZlID0gbmV3TWVzaFN0cnVjdC5wcmltaXRpdmVzW2tdO1xyXG4gICAgICAgICAgICBpZiAob2xkUHJpbWl0aXZlLmluZGV4VmlldyAmJiBuZXdQcmltaXRpdmUuaW5kZXhWaWV3KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvbGRTdHJpZGUgPSBvbGRQcmltaXRpdmUuaW5kZXhWaWV3LnN0cmlkZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1N0cmlkZSA9IG5ld1ByaW1pdGl2ZS5pbmRleFZpZXcuc3RyaWRlO1xyXG4gICAgICAgICAgICAgICAgbGV0IG9sZE9mZnNldCA9IG9sZFByaW1pdGl2ZS5pbmRleFZpZXcub2Zmc2V0O1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld09mZnNldCA9IG5ld1ByaW1pdGl2ZS5pbmRleFZpZXcub2Zmc2V0O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuZXdQcmltaXRpdmUuaW5kZXhWaWV3LmNvdW50OyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzcmNJbmRpY2VzID0gb2xkTWVzaERhdGEuc3ViYXJyYXkob2xkT2Zmc2V0LCBvbGRPZmZzZXQgKyBvbGRTdHJpZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld01lc2hEYXRhLnNldChzcmNJbmRpY2VzLCBuZXdPZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld09mZnNldCArPSBuZXdTdHJpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgb2xkT2Zmc2V0ICs9IG9sZFN0cmlkZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBuZXdNZXNoID0gbmV3IE1lc2goKTtcclxuICAgICAgICBuZXdNZXNoLnJlc2V0KHtcclxuICAgICAgICAgICAgc3RydWN0OiBuZXdNZXNoU3RydWN0LFxyXG4gICAgICAgICAgICBkYXRhOiBuZXdNZXNoRGF0YSxcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbmV3TWVzaDtcclxuICAgIH1cclxufVxyXG4iXX0=