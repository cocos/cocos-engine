(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../gfx/index.js", "./texture-2d.js", "./image-asset.js", "../renderer/core/sampler-lib.js", "../pipeline/define.js", "../platform/debug.js", "../data/utils/asserts.js", "../math/bits.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../gfx/index.js"), require("./texture-2d.js"), require("./image-asset.js"), require("../renderer/core/sampler-lib.js"), require("../pipeline/define.js"), require("../platform/debug.js"), require("../data/utils/asserts.js"), require("../math/bits.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.texture2d, global.imageAsset, global.samplerLib, global.define, global.debug, global.asserts, global.bits, global.globalExports);
    global.morphRendering = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _texture2d, _imageAsset, _samplerLib, _define, _debug, _asserts, _bits, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.StdMorphRendering = void 0;

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * True if force to use cpu computing based sub-mesh rendering.
   */
  var preferCpuComputing = false;
  /**
   * Standard morph rendering.
   * The standard morph rendering renders each of sub-mesh morph separately.
   * Sub-mesh morph rendering may select different technique according sub-mesh morph itself.
   */

  var StdMorphRendering = /*#__PURE__*/function () {
    function StdMorphRendering(mesh, gfxDevice) {
      _classCallCheck(this, StdMorphRendering);

      this._mesh = void 0;
      this._subMeshRenderings = [];
      this._mesh = mesh;

      if (!this._mesh.struct.morph) {
        return;
      }

      var nSubMeshes = this._mesh.struct.primitives.length;
      this._subMeshRenderings = new Array(nSubMeshes).fill(null);

      for (var iSubMesh = 0; iSubMesh < nSubMeshes; ++iSubMesh) {
        var subMeshMorph = this._mesh.struct.morph.subMeshMorphs[iSubMesh];

        if (!subMeshMorph) {
          continue;
        }

        if (subMeshMorph.targets.length > _define.UBOMorph.MAX_MORPH_TARGET_COUNT) {
          (0, _debug.warnID)(10002, _define.UBOMorph.MAX_MORPH_TARGET_COUNT, subMeshMorph.targets.length);
          continue;
        }

        if (preferCpuComputing) {
          this._subMeshRenderings[iSubMesh] = new CpuComputing(this._mesh, iSubMesh, this._mesh.struct.morph, gfxDevice);
        } else {
          this._subMeshRenderings[iSubMesh] = new GpuComputing(this._mesh, iSubMesh, this._mesh.struct.morph, gfxDevice);
        }
      }
    }

    _createClass(StdMorphRendering, [{
      key: "createInstance",
      value: function createInstance() {
        var _this = this;

        var nSubMeshes = this._mesh.struct.primitives.length;
        var subMeshInstances = new Array(nSubMeshes);

        for (var iSubMesh = 0; iSubMesh < nSubMeshes; ++iSubMesh) {
          var _this$_subMeshRenderi, _this$_subMeshRenderi2;

          subMeshInstances[iSubMesh] = (_this$_subMeshRenderi = (_this$_subMeshRenderi2 = this._subMeshRenderings[iSubMesh]) === null || _this$_subMeshRenderi2 === void 0 ? void 0 : _this$_subMeshRenderi2.createInstance()) !== null && _this$_subMeshRenderi !== void 0 ? _this$_subMeshRenderi : null;
        }

        return {
          setWeights: function setWeights(subMeshIndex, weights) {
            var _subMeshInstances$sub;

            (_subMeshInstances$sub = subMeshInstances[subMeshIndex]) === null || _subMeshInstances$sub === void 0 ? void 0 : _subMeshInstances$sub.setWeights(weights);
          },
          requiredPatches: function requiredPatches(subMeshIndex) {
            (0, _asserts.assertIsNonNullable)(_this._mesh.struct.morph);
            var subMeshMorph = _this._mesh.struct.morph.subMeshMorphs[subMeshIndex];
            var subMeshRenderingInstance = subMeshInstances[subMeshIndex];

            if (subMeshRenderingInstance === null) {
              return;
            }

            (0, _asserts.assertIsNonNullable)(subMeshMorph);
            var patches = [{
              name: 'CC_USE_MORPH',
              value: true
            }, {
              name: 'CC_MORPH_TARGET_COUNT',
              value: subMeshMorph.targets.length
            }];

            if (subMeshMorph.attributes.includes(_index.GFXAttributeName.ATTR_POSITION)) {
              patches.push({
                name: 'CC_MORPH_TARGET_HAS_POSITION',
                value: true
              });
            }

            if (subMeshMorph.attributes.includes(_index.GFXAttributeName.ATTR_NORMAL)) {
              patches.push({
                name: 'CC_MORPH_TARGET_HAS_NORMAL',
                value: true
              });
            }

            if (subMeshMorph.attributes.includes(_index.GFXAttributeName.ATTR_TANGENT)) {
              patches.push({
                name: 'CC_MORPH_TARGET_HAS_TANGENT',
                value: true
              });
            }

            patches.push.apply(patches, _toConsumableArray(subMeshRenderingInstance.requiredPatches()));
            return patches;
          },
          adaptPipelineState: function adaptPipelineState(subMeshIndex, descriptorSet) {
            var _subMeshInstances$sub2;

            (_subMeshInstances$sub2 = subMeshInstances[subMeshIndex]) === null || _subMeshInstances$sub2 === void 0 ? void 0 : _subMeshInstances$sub2.adaptPipelineState(descriptorSet);
          },
          destroy: function destroy() {
            var _iterator = _createForOfIteratorHelper(subMeshInstances),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var subMeshInstance = _step.value;
                subMeshInstance === null || subMeshInstance === void 0 ? void 0 : subMeshInstance.destroy();
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          }
        };
      }
    }]);

    return StdMorphRendering;
  }();
  /**
   * Describes how to render a sub-mesh morph.
   */


  _exports.StdMorphRendering = StdMorphRendering;

  /**
   * (General purpose) Gpu computing based sub-mesh morph rendering.
   * This technique computes final attribute displacements on GPU.
   * Target displacements of each attribute are transferred through vertex texture, say, morph texture.
   */
  var GpuComputing = /*#__PURE__*/function () {
    function GpuComputing(mesh, subMeshIndex, morph, gfxDevice) {
      _classCallCheck(this, GpuComputing);

      this._gfxDevice = void 0;
      this._subMeshMorph = void 0;
      this._textureInfo = void 0;
      this._attributes = void 0;
      this._gfxDevice = gfxDevice;
      var subMeshMorph = morph.subMeshMorphs[subMeshIndex];
      (0, _asserts.assertIsNonNullable)(subMeshMorph);
      this._subMeshMorph = subMeshMorph;
      enableVertexId(mesh, subMeshIndex, gfxDevice);
      var nVertices = mesh.struct.vertexBundles[mesh.struct.primitives[subMeshIndex].vertexBundelIndices[0]].view.count;
      var nTargets = subMeshMorph.targets.length; // Head includes N vector 4, where N is number of targets.
      // Every r channel of the pixel denotes the index of the data pixel of corresponding target.
      // [ (target1_data_offset), (target2_data_offset), .... ] target_data

      var vec4Required = nTargets + nVertices * nTargets;
      var vec4TextureFactory = createVec4TextureFactory(gfxDevice, vec4Required);
      this._textureInfo = {
        width: vec4TextureFactory.width,
        height: vec4TextureFactory.height
      }; // Creates texture for each attribute.

      this._attributes = subMeshMorph.attributes.map(function (attributeName, attributeIndex) {
        var vec4Tex = vec4TextureFactory.create();
        var valueView = vec4Tex.valueView; // if (DEV) { // Make it easy to view texture in profilers...
        //     for (let i = 0; i < valueView.length / 4; ++i) {
        //         valueView[i * 4 + 3] = 1.0;
        //     }
        // }

        {
          var pHead = 0;
          var nVec4s = subMeshMorph.targets.length;
          subMeshMorph.targets.forEach(function (morphTarget) {
            var displacementsView = morphTarget.displacements[attributeIndex];
            var displacements = new Float32Array(mesh.data.buffer, mesh.data.byteOffset + displacementsView.offset, displacementsView.count);
            var nVec3s = displacements.length / 3; // See `Mesh.prototype.enableVertexIdChannel` for the magic `0.5`.

            valueView[pHead] = nVec4s + 0.5;
            var displacementsOffset = nVec4s * 4;

            for (var iVec3 = 0; iVec3 < nVec3s; ++iVec3) {
              valueView[displacementsOffset + 4 * iVec3 + 0] = displacements[3 * iVec3 + 0];
              valueView[displacementsOffset + 4 * iVec3 + 1] = displacements[3 * iVec3 + 1];
              valueView[displacementsOffset + 4 * iVec3 + 2] = displacements[3 * iVec3 + 2];
            }

            pHead += 4;
            nVec4s += nVec3s;
          });
        }
        vec4Tex.updatePixels();
        return {
          name: attributeName,
          morphTexture: vec4Tex
        };
      });
    }

    _createClass(GpuComputing, [{
      key: "destroy",
      value: function destroy() {
        var _iterator2 = _createForOfIteratorHelper(this._attributes),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var attribute = _step2.value;
            attribute.morphTexture.destroy();
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    }, {
      key: "createInstance",
      value: function createInstance() {
        var _this2 = this;

        var morphUniforms = new MorphUniforms(this._gfxDevice, this._subMeshMorph.targets.length);
        morphUniforms.setMorphTextureInfo(this._textureInfo.width, this._textureInfo.height);
        morphUniforms.commit();
        return {
          setWeights: function setWeights(weights) {
            morphUniforms.setWeights(weights);
            morphUniforms.commit();
          },
          requiredPatches: function requiredPatches() {
            return [{
              name: 'CC_MORPH_TARGET_USE_TEXTURE',
              value: true
            }];
          },
          adaptPipelineState: function adaptPipelineState(descriptorSet) {
            var _iterator3 = _createForOfIteratorHelper(_this2._attributes),
                _step3;

            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var attribute = _step3.value;
                var binding = void 0;

                switch (attribute.name) {
                  case _index.GFXAttributeName.ATTR_POSITION:
                    binding = _define.UNIFORM_POSITION_MORPH_TEXTURE_BINDING;
                    break;

                  case _index.GFXAttributeName.ATTR_NORMAL:
                    binding = _define.UNIFORM_NORMAL_MORPH_TEXTURE_BINDING;
                    break;

                  case _index.GFXAttributeName.ATTR_TANGENT:
                    binding = _define.UNIFORM_TANGENT_MORPH_TEXTURE_BINDING;
                    break;

                  default:
                    (0, _debug.warn)("Unexpected attribute!");
                    break;
                }

                if (binding !== undefined) {
                  descriptorSet.bindSampler(binding, attribute.morphTexture.sampler);
                  descriptorSet.bindTexture(binding, attribute.morphTexture.texture);
                }
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }

            descriptorSet.bindBuffer(_define.UBOMorph.BINDING, morphUniforms.buffer);
            descriptorSet.update();
          },
          destroy: function destroy() {}
        };
      }
    }]);

    return GpuComputing;
  }();
  /**
   * Cpu computing based sub-mesh morph rendering.
   * This technique computes final attribute displacements on CPU.
   * The displacements, then, are passed to GPU.
   */


  var CpuComputing = /*#__PURE__*/function () {
    function CpuComputing(mesh, subMeshIndex, morph, gfxDevice) {
      _classCallCheck(this, CpuComputing);

      this._gfxDevice = void 0;
      this._attributes = [];
      this._gfxDevice = gfxDevice;
      var subMeshMorph = morph.subMeshMorphs[subMeshIndex];
      (0, _asserts.assertIsNonNullable)(subMeshMorph);
      enableVertexId(mesh, subMeshIndex, gfxDevice);
      this._attributes = subMeshMorph.attributes.map(function (attributeName, attributeIndex) {
        return {
          name: attributeName,
          targets: subMeshMorph.targets.map(function (attributeDisplacement) {
            return {
              displacements: new Float32Array(mesh.data.buffer, mesh.data.byteOffset + attributeDisplacement.displacements[attributeIndex].offset, attributeDisplacement.displacements[attributeIndex].count)
            };
          })
        };
      });
    }
    /**
     * DO NOT use this field.
     */


    _createClass(CpuComputing, [{
      key: "createInstance",
      value: function createInstance() {
        return new CpuComputingRenderingInstance(this, this._attributes[0].targets[0].displacements.length / 3, this._gfxDevice);
      }
    }, {
      key: "data",
      get: function get() {
        return this._attributes;
      }
    }]);

    return CpuComputing;
  }();

  var CpuComputingRenderingInstance = /*#__PURE__*/function () {
    function CpuComputingRenderingInstance(owner, nVertices, gfxDevice) {
      _classCallCheck(this, CpuComputingRenderingInstance);

      this._attributes = void 0;
      this._owner = void 0;
      this._morphUniforms = void 0;
      this._owner = owner;
      this._morphUniforms = new MorphUniforms(gfxDevice, 0
      /* TODO? */
      );
      var vec4TextureFactory = createVec4TextureFactory(gfxDevice, nVertices);

      this._morphUniforms.setMorphTextureInfo(vec4TextureFactory.width, vec4TextureFactory.height);

      this._morphUniforms.commit();

      this._attributes = this._owner.data.map(function (attributeMorph, attributeIndex) {
        var morphTexture = vec4TextureFactory.create();
        return {
          attributeName: attributeMorph.name,
          morphTexture: morphTexture
        };
      });
    }

    _createClass(CpuComputingRenderingInstance, [{
      key: "setWeights",
      value: function setWeights(weights) {
        for (var iAttribute = 0; iAttribute < this._attributes.length; ++iAttribute) {
          var myAttribute = this._attributes[iAttribute];
          var valueView = myAttribute.morphTexture.valueView;
          var attributeMorph = this._owner.data[iAttribute];
          (0, _asserts.assertIsTrue)(weights.length === attributeMorph.targets.length);

          for (var iTarget = 0; iTarget < attributeMorph.targets.length; ++iTarget) {
            var targetDisplacements = attributeMorph.targets[iTarget].displacements;
            var weight = weights[iTarget];
            var nVertices = targetDisplacements.length / 3;

            if (iTarget === 0) {
              for (var iVertex = 0; iVertex < nVertices; ++iVertex) {
                valueView[4 * iVertex + 0] = targetDisplacements[3 * iVertex + 0] * weight;
                valueView[4 * iVertex + 1] = targetDisplacements[3 * iVertex + 1] * weight;
                valueView[4 * iVertex + 2] = targetDisplacements[3 * iVertex + 2] * weight;
              }
            } else {
              for (var _iVertex = 0; _iVertex < nVertices; ++_iVertex) {
                valueView[4 * _iVertex + 0] += targetDisplacements[3 * _iVertex + 0] * weight;
                valueView[4 * _iVertex + 1] += targetDisplacements[3 * _iVertex + 1] * weight;
                valueView[4 * _iVertex + 2] += targetDisplacements[3 * _iVertex + 2] * weight;
              }
            }
          } // Normalize displacements to [0, 1].


          if (false) {
            var n = attributeMorph.targets[0].displacements.length / 3;

            for (var c = 0; c < 3; ++c) {
              var min = Number.POSITIVE_INFINITY;
              var max = Number.NEGATIVE_INFINITY;

              for (var i = 0; i < n; ++i) {
                var x = valueView[i * 4 + c];
                max = Math.max(x, max);
                min = Math.min(x, min);
              }

              var d = max - min;

              if (d !== 0) {
                for (var _i = 0; _i < n; ++_i) {
                  var _x = valueView[_i * 4 + c];
                  valueView[_i * 4 + c] = (_x - min) / d;
                }
              }
            }
          } // Randomize displacements.


          if (false) {
            for (var _i2 = 0; _i2 < valueView.length; ++_i2) {
              if (_i2 % 3 === 1) {
                valueView[_i2] = _globalExports.legacyCC.director.getTotalFrames() % 500 * 0.001;
              } else {
                valueView[_i2] = 0;
              }
            }
          }

          myAttribute.morphTexture.updatePixels();
        }
      }
    }, {
      key: "requiredPatches",
      value: function requiredPatches() {
        return [{
          name: 'CC_MORPH_TARGET_USE_TEXTURE',
          value: true
        }, {
          name: 'CC_MORPH_PRECOMPUTED',
          value: true
        }];
      }
    }, {
      key: "adaptPipelineState",
      value: function adaptPipelineState(descriptorSet) {
        var _iterator4 = _createForOfIteratorHelper(this._attributes),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var attribute = _step4.value;
            var attributeName = attribute.attributeName;
            var binding = void 0;

            switch (attributeName) {
              case _index.GFXAttributeName.ATTR_POSITION:
                binding = _define.UNIFORM_POSITION_MORPH_TEXTURE_BINDING;
                break;

              case _index.GFXAttributeName.ATTR_NORMAL:
                binding = _define.UNIFORM_NORMAL_MORPH_TEXTURE_BINDING;
                break;

              case _index.GFXAttributeName.ATTR_TANGENT:
                binding = _define.UNIFORM_TANGENT_MORPH_TEXTURE_BINDING;
                break;

              default:
                (0, _debug.warn)("Unexpected attribute!");
                break;
            }

            if (binding !== undefined) {
              descriptorSet.bindSampler(binding, attribute.morphTexture.sampler);
              descriptorSet.bindTexture(binding, attribute.morphTexture.texture);
            }
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        descriptorSet.bindBuffer(_define.UBOMorph.BINDING, this._morphUniforms.buffer);
        descriptorSet.update();
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._morphUniforms.destroy();

        for (var iAttribute = 0; iAttribute < this._attributes.length; ++iAttribute) {
          var myAttribute = this._attributes[iAttribute];
          myAttribute.morphTexture.destroy();
        }
      }
    }]);

    return CpuComputingRenderingInstance;
  }();
  /**
   * Provides the access to morph related uniforms.
   */


  var MorphUniforms = /*#__PURE__*/function () {
    function MorphUniforms(gfxDevice, targetCount) {
      _classCallCheck(this, MorphUniforms);

      this._targetCount = void 0;
      this._localBuffer = void 0;
      this._remoteBuffer = void 0;
      this._targetCount = targetCount;
      this._localBuffer = new DataView(new ArrayBuffer(_define.UBOMorph.SIZE));
      this._remoteBuffer = gfxDevice.createBuffer(new _index.GFXBufferInfo(_index.GFXBufferUsageBit.UNIFORM | _index.GFXBufferUsageBit.TRANSFER_DST, _index.GFXMemoryUsageBit.HOST | _index.GFXMemoryUsageBit.DEVICE, _define.UBOMorph.SIZE, _define.UBOMorph.SIZE));
    }

    _createClass(MorphUniforms, [{
      key: "destroy",
      value: function destroy() {
        this._remoteBuffer.destroy();
      }
    }, {
      key: "setWeights",
      value: function setWeights(weights) {
        (0, _asserts.assertIsTrue)(weights.length === this._targetCount);

        for (var iWeight = 0; iWeight < weights.length; ++iWeight) {
          this._localBuffer.setFloat32(_define.UBOMorph.OFFSET_OF_WEIGHTS + 4 * iWeight, weights[iWeight], _globalExports.legacyCC.sys.isLittleEndian);
        }
      }
    }, {
      key: "setMorphTextureInfo",
      value: function setMorphTextureInfo(width, height) {
        this._localBuffer.setFloat32(_define.UBOMorph.OFFSET_OF_DISPLACEMENT_TEXTURE_WIDTH, width, _globalExports.legacyCC.sys.isLittleEndian);

        this._localBuffer.setFloat32(_define.UBOMorph.OFFSET_OF_DISPLACEMENT_TEXTURE_HEIGHT, height, _globalExports.legacyCC.sys.isLittleEndian);
      }
    }, {
      key: "commit",
      value: function commit() {
        this._remoteBuffer.update(this._localBuffer.buffer, this._localBuffer.byteOffset, this._localBuffer.byteLength);
      }
    }, {
      key: "buffer",
      get: function get() {
        return this._remoteBuffer;
      }
    }]);

    return MorphUniforms;
  }();
  /**
   *
   * @param gfxDevice
   * @param vec4Capacity Capacity of vec4.
   */


  function createVec4TextureFactory(gfxDevice, vec4Capacity) {
    var hasFeatureFloatTexture = gfxDevice.hasFeature(_index.GFXFeature.TEXTURE_FLOAT);
    var pixelRequired;
    var pixelFormat;
    var pixelBytes;
    var updateViewConstructor;

    if (hasFeatureFloatTexture) {
      pixelRequired = vec4Capacity;
      pixelBytes = 16;
      pixelFormat = _texture2d.Texture2D.PixelFormat.RGBA32F;
      updateViewConstructor = Float32Array;
    } else {
      pixelRequired = 4 * vec4Capacity;
      pixelBytes = 4;
      pixelFormat = _texture2d.Texture2D.PixelFormat.RGBA8888;
      updateViewConstructor = Uint8Array;
    }

    var _bestSizeToHavePixels = bestSizeToHavePixels(pixelRequired),
        width = _bestSizeToHavePixels.width,
        height = _bestSizeToHavePixels.height;

    (0, _asserts.assertIsTrue)(width * height >= pixelRequired);
    return {
      width: width,
      height: height,
      create: function create() {
        var arrayBuffer = new ArrayBuffer(width * height * pixelBytes);
        var valueView = new Float32Array(arrayBuffer);
        var updateView = updateViewConstructor === Float32Array ? valueView : new updateViewConstructor(arrayBuffer);
        var image = new _imageAsset.ImageAsset({
          width: width,
          height: height,
          _data: updateView,
          _compressed: false,
          format: pixelFormat
        });
        var textureAsset = new _texture2d.Texture2D();
        textureAsset.setFilters(_texture2d.Texture2D.Filter.NEAREST, _texture2d.Texture2D.Filter.NEAREST);
        textureAsset.setMipFilter(_texture2d.Texture2D.Filter.NONE);
        textureAsset.setWrapMode(_texture2d.Texture2D.WrapMode.CLAMP_TO_EDGE, _texture2d.Texture2D.WrapMode.CLAMP_TO_EDGE, _texture2d.Texture2D.WrapMode.CLAMP_TO_EDGE);
        textureAsset.image = image;

        if (!textureAsset.getGFXTexture()) {
          (0, _debug.warn)("Unexpected: failed to create morph texture?");
        }

        var sampler = _samplerLib.samplerLib.getSampler(gfxDevice, textureAsset.getSamplerHash());

        return {
          /**
           * Gets the GFX texture.
           */
          get texture() {
            return textureAsset.getGFXTexture();
          },

          /**
           * Gets the GFX sampler.
           */
          get sampler() {
            return sampler;
          },

          /**
           * Value view.
           */
          get valueView() {
            return valueView;
          },

          /**
           * Destroy the texture. Release its GPU resources.
           */
          destroy: function destroy() {
            textureAsset.destroy(); // Samplers allocated from `samplerLib` are not required and
            // should not be destroyed.
            // this._sampler.destroy();
          },

          /**
           * Update the pixels content to `valueView`.
           */
          updatePixels: function updatePixels() {
            textureAsset.uploadData(updateView);
          }
        };
      }
    };
  }

  /**
   * When use vertex-texture-fetch technique, we do need
   * `gl_vertexId` when we sample per-vertex data.
   * WebGL 1.0 does not have `gl_vertexId`; WebGL 2.0, however, does.
   * @param mesh
   * @param subMeshIndex
   * @param gfxDevice
   */
  function enableVertexId(mesh, subMeshIndex, gfxDevice) {
    mesh.renderingSubMeshes[subMeshIndex].enableVertexIdChannel(gfxDevice);
  }
  /**
   * Decides a best texture size to have the specified pixel capacity at least.
   * The decided width and height has the following characteristics:
   * - the width and height are both power of 2;
   * - if the width and height are different, the width would be set to the larger once;
   * - the width is ensured to be multiple of 4.
   * @param nPixels Least pixel capacity.
   */


  function bestSizeToHavePixels(nPixels) {
    if (nPixels < 5) {
      nPixels = 5;
    }

    var aligned = (0, _bits.nextPow2)(nPixels);
    var epxSum = (0, _bits.log2)(aligned);
    var h = epxSum >> 1;
    var w = epxSum & 1 ? h + 1 : h;
    return {
      width: 1 << w,
      height: 1 << h
    };
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL21vcnBoLXJlbmRlcmluZy50cyJdLCJuYW1lcyI6WyJwcmVmZXJDcHVDb21wdXRpbmciLCJTdGRNb3JwaFJlbmRlcmluZyIsIm1lc2giLCJnZnhEZXZpY2UiLCJfbWVzaCIsIl9zdWJNZXNoUmVuZGVyaW5ncyIsInN0cnVjdCIsIm1vcnBoIiwiblN1Yk1lc2hlcyIsInByaW1pdGl2ZXMiLCJsZW5ndGgiLCJBcnJheSIsImZpbGwiLCJpU3ViTWVzaCIsInN1Yk1lc2hNb3JwaCIsInN1Yk1lc2hNb3JwaHMiLCJ0YXJnZXRzIiwiVUJPTW9ycGgiLCJNQVhfTU9SUEhfVEFSR0VUX0NPVU5UIiwiQ3B1Q29tcHV0aW5nIiwiR3B1Q29tcHV0aW5nIiwic3ViTWVzaEluc3RhbmNlcyIsImNyZWF0ZUluc3RhbmNlIiwic2V0V2VpZ2h0cyIsInN1Yk1lc2hJbmRleCIsIndlaWdodHMiLCJyZXF1aXJlZFBhdGNoZXMiLCJzdWJNZXNoUmVuZGVyaW5nSW5zdGFuY2UiLCJwYXRjaGVzIiwibmFtZSIsInZhbHVlIiwiYXR0cmlidXRlcyIsImluY2x1ZGVzIiwiR0ZYQXR0cmlidXRlTmFtZSIsIkFUVFJfUE9TSVRJT04iLCJwdXNoIiwiQVRUUl9OT1JNQUwiLCJBVFRSX1RBTkdFTlQiLCJhZGFwdFBpcGVsaW5lU3RhdGUiLCJkZXNjcmlwdG9yU2V0IiwiZGVzdHJveSIsInN1Yk1lc2hJbnN0YW5jZSIsIl9nZnhEZXZpY2UiLCJfc3ViTWVzaE1vcnBoIiwiX3RleHR1cmVJbmZvIiwiX2F0dHJpYnV0ZXMiLCJlbmFibGVWZXJ0ZXhJZCIsIm5WZXJ0aWNlcyIsInZlcnRleEJ1bmRsZXMiLCJ2ZXJ0ZXhCdW5kZWxJbmRpY2VzIiwidmlldyIsImNvdW50IiwiblRhcmdldHMiLCJ2ZWM0UmVxdWlyZWQiLCJ2ZWM0VGV4dHVyZUZhY3RvcnkiLCJjcmVhdGVWZWM0VGV4dHVyZUZhY3RvcnkiLCJ3aWR0aCIsImhlaWdodCIsIm1hcCIsImF0dHJpYnV0ZU5hbWUiLCJhdHRyaWJ1dGVJbmRleCIsInZlYzRUZXgiLCJjcmVhdGUiLCJ2YWx1ZVZpZXciLCJwSGVhZCIsIm5WZWM0cyIsImZvckVhY2giLCJtb3JwaFRhcmdldCIsImRpc3BsYWNlbWVudHNWaWV3IiwiZGlzcGxhY2VtZW50cyIsIkZsb2F0MzJBcnJheSIsImRhdGEiLCJidWZmZXIiLCJieXRlT2Zmc2V0Iiwib2Zmc2V0IiwiblZlYzNzIiwiZGlzcGxhY2VtZW50c09mZnNldCIsImlWZWMzIiwidXBkYXRlUGl4ZWxzIiwibW9ycGhUZXh0dXJlIiwiYXR0cmlidXRlIiwibW9ycGhVbmlmb3JtcyIsIk1vcnBoVW5pZm9ybXMiLCJzZXRNb3JwaFRleHR1cmVJbmZvIiwiY29tbWl0IiwiYmluZGluZyIsIlVOSUZPUk1fUE9TSVRJT05fTU9SUEhfVEVYVFVSRV9CSU5ESU5HIiwiVU5JRk9STV9OT1JNQUxfTU9SUEhfVEVYVFVSRV9CSU5ESU5HIiwiVU5JRk9STV9UQU5HRU5UX01PUlBIX1RFWFRVUkVfQklORElORyIsInVuZGVmaW5lZCIsImJpbmRTYW1wbGVyIiwic2FtcGxlciIsImJpbmRUZXh0dXJlIiwidGV4dHVyZSIsImJpbmRCdWZmZXIiLCJCSU5ESU5HIiwidXBkYXRlIiwiYXR0cmlidXRlRGlzcGxhY2VtZW50IiwiQ3B1Q29tcHV0aW5nUmVuZGVyaW5nSW5zdGFuY2UiLCJvd25lciIsIl9vd25lciIsIl9tb3JwaFVuaWZvcm1zIiwiYXR0cmlidXRlTW9ycGgiLCJpQXR0cmlidXRlIiwibXlBdHRyaWJ1dGUiLCJpVGFyZ2V0IiwidGFyZ2V0RGlzcGxhY2VtZW50cyIsIndlaWdodCIsImlWZXJ0ZXgiLCJuIiwiYyIsIm1pbiIsIk51bWJlciIsIlBPU0lUSVZFX0lORklOSVRZIiwibWF4IiwiTkVHQVRJVkVfSU5GSU5JVFkiLCJpIiwieCIsIk1hdGgiLCJkIiwibGVnYWN5Q0MiLCJkaXJlY3RvciIsImdldFRvdGFsRnJhbWVzIiwidGFyZ2V0Q291bnQiLCJfdGFyZ2V0Q291bnQiLCJfbG9jYWxCdWZmZXIiLCJfcmVtb3RlQnVmZmVyIiwiRGF0YVZpZXciLCJBcnJheUJ1ZmZlciIsIlNJWkUiLCJjcmVhdGVCdWZmZXIiLCJHRlhCdWZmZXJJbmZvIiwiR0ZYQnVmZmVyVXNhZ2VCaXQiLCJVTklGT1JNIiwiVFJBTlNGRVJfRFNUIiwiR0ZYTWVtb3J5VXNhZ2VCaXQiLCJIT1NUIiwiREVWSUNFIiwiaVdlaWdodCIsInNldEZsb2F0MzIiLCJPRkZTRVRfT0ZfV0VJR0hUUyIsInN5cyIsImlzTGl0dGxlRW5kaWFuIiwiT0ZGU0VUX09GX0RJU1BMQUNFTUVOVF9URVhUVVJFX1dJRFRIIiwiT0ZGU0VUX09GX0RJU1BMQUNFTUVOVF9URVhUVVJFX0hFSUdIVCIsImJ5dGVMZW5ndGgiLCJ2ZWM0Q2FwYWNpdHkiLCJoYXNGZWF0dXJlRmxvYXRUZXh0dXJlIiwiaGFzRmVhdHVyZSIsIkdGWEZlYXR1cmUiLCJURVhUVVJFX0ZMT0FUIiwicGl4ZWxSZXF1aXJlZCIsInBpeGVsRm9ybWF0IiwicGl4ZWxCeXRlcyIsInVwZGF0ZVZpZXdDb25zdHJ1Y3RvciIsIlRleHR1cmUyRCIsIlBpeGVsRm9ybWF0IiwiUkdCQTMyRiIsIlJHQkE4ODg4IiwiVWludDhBcnJheSIsImJlc3RTaXplVG9IYXZlUGl4ZWxzIiwiYXJyYXlCdWZmZXIiLCJ1cGRhdGVWaWV3IiwiaW1hZ2UiLCJJbWFnZUFzc2V0IiwiX2RhdGEiLCJfY29tcHJlc3NlZCIsImZvcm1hdCIsInRleHR1cmVBc3NldCIsInNldEZpbHRlcnMiLCJGaWx0ZXIiLCJORUFSRVNUIiwic2V0TWlwRmlsdGVyIiwiTk9ORSIsInNldFdyYXBNb2RlIiwiV3JhcE1vZGUiLCJDTEFNUF9UT19FREdFIiwiZ2V0R0ZYVGV4dHVyZSIsInNhbXBsZXJMaWIiLCJnZXRTYW1wbGVyIiwiZ2V0U2FtcGxlckhhc2giLCJ1cGxvYWREYXRhIiwicmVuZGVyaW5nU3ViTWVzaGVzIiwiZW5hYmxlVmVydGV4SWRDaGFubmVsIiwiblBpeGVscyIsImFs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QUlGLE1BQU0sR0FBRyxDQUFWLEdBQWdCQyxDQUFDLEdBQUcsQ0FBcEIsR0FBeUJBLENBQW5DO0FBQ0EsV0FBTztBQUNIbkksTUFBQUEsS0FBSyxFQUFFLEtBQUtvSSxDQURUO0FBRUhuSSxNQUFBQSxNQUFNLEVBQUUsS0FBS2tJO0FBRlYsS0FBUDtBQUlIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyBHRlhBdHRyaWJ1dGVOYW1lLCBHRlhCdWZmZXIsIEdGWEJ1ZmZlclVzYWdlQml0LCBHRlhEZXZpY2UsIEdGWEZlYXR1cmUsIEdGWE1lbW9yeVVzYWdlQml0LCBHRlhEZXNjcmlwdG9yU2V0LCBHRlhCdWZmZXJJbmZvIH0gZnJvbSAnLi4vZ2Z4JztcclxuaW1wb3J0IHsgTWVzaCB9IGZyb20gJy4vbWVzaCc7XHJcbmltcG9ydCB7IFRleHR1cmUyRCB9IGZyb20gJy4vdGV4dHVyZS0yZCc7XHJcbmltcG9ydCB7IEltYWdlQXNzZXQgfSBmcm9tICcuL2ltYWdlLWFzc2V0JztcclxuaW1wb3J0IHsgc2FtcGxlckxpYiB9IGZyb20gJy4uL3JlbmRlcmVyL2NvcmUvc2FtcGxlci1saWInO1xyXG5pbXBvcnQgeyBVQk9Nb3JwaCwgVU5JRk9STV9OT1JNQUxfTU9SUEhfVEVYVFVSRV9CSU5ESU5HLCBVTklGT1JNX1BPU0lUSU9OX01PUlBIX1RFWFRVUkVfQklORElORywgVU5JRk9STV9UQU5HRU5UX01PUlBIX1RFWFRVUkVfQklORElORyB9IGZyb20gJy4uL3BpcGVsaW5lL2RlZmluZSc7XHJcbmltcG9ydCB7IHdhcm4sIHdhcm5JRCB9IGZyb20gJy4uL3BsYXRmb3JtL2RlYnVnJztcclxuaW1wb3J0IHsgTW9ycGgsIE1vcnBoUmVuZGVyaW5nLCBNb3JwaFJlbmRlcmluZ0luc3RhbmNlLCBTdWJNZXNoTW9ycGggfSBmcm9tICcuL21vcnBoJztcclxuaW1wb3J0IHsgYXNzZXJ0SXNOb25OdWxsYWJsZSwgYXNzZXJ0SXNUcnVlIH0gZnJvbSAnLi4vZGF0YS91dGlscy9hc3NlcnRzJztcclxuaW1wb3J0IHsgbG9nMiwgbmV4dFBvdzIgfSBmcm9tICcuLi9tYXRoL2JpdHMnO1xyXG5pbXBvcnQgeyBJTWFjcm9QYXRjaCB9IGZyb20gJy4uL3JlbmRlcmVyJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IFBpeGVsRm9ybWF0IH0gZnJvbSAnLi9hc3NldC1lbnVtJztcclxuaW1wb3J0IHsgRFNQb29sIH0gZnJvbSAnLi4vcmVuZGVyZXIvY29yZS9tZW1vcnktcG9vbHMnO1xyXG5cclxuLyoqXHJcbiAqIFRydWUgaWYgZm9yY2UgdG8gdXNlIGNwdSBjb21wdXRpbmcgYmFzZWQgc3ViLW1lc2ggcmVuZGVyaW5nLlxyXG4gKi9cclxuY29uc3QgcHJlZmVyQ3B1Q29tcHV0aW5nID0gZmFsc2U7XHJcblxyXG4vKipcclxuICogU3RhbmRhcmQgbW9ycGggcmVuZGVyaW5nLlxyXG4gKiBUaGUgc3RhbmRhcmQgbW9ycGggcmVuZGVyaW5nIHJlbmRlcnMgZWFjaCBvZiBzdWItbWVzaCBtb3JwaCBzZXBhcmF0ZWx5LlxyXG4gKiBTdWItbWVzaCBtb3JwaCByZW5kZXJpbmcgbWF5IHNlbGVjdCBkaWZmZXJlbnQgdGVjaG5pcXVlIGFjY29yZGluZyBzdWItbWVzaCBtb3JwaCBpdHNlbGYuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU3RkTW9ycGhSZW5kZXJpbmcgaW1wbGVtZW50cyBNb3JwaFJlbmRlcmluZyB7XHJcbiAgICBwcml2YXRlIF9tZXNoOiBNZXNoO1xyXG4gICAgcHJpdmF0ZSBfc3ViTWVzaFJlbmRlcmluZ3M6IChTdWJNZXNoTW9ycGhSZW5kZXJpbmcgfCBudWxsKVtdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IgKG1lc2g6IE1lc2gsIGdmeERldmljZTogR0ZYRGV2aWNlKSB7XHJcbiAgICAgICAgdGhpcy5fbWVzaCA9IG1lc2g7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9tZXNoLnN0cnVjdC5tb3JwaCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBuU3ViTWVzaGVzID0gdGhpcy5fbWVzaC5zdHJ1Y3QucHJpbWl0aXZlcy5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5fc3ViTWVzaFJlbmRlcmluZ3MgPSBuZXcgQXJyYXkoblN1Yk1lc2hlcykuZmlsbChudWxsKTtcclxuICAgICAgICBmb3IgKGxldCBpU3ViTWVzaCA9IDA7IGlTdWJNZXNoIDwgblN1Yk1lc2hlczsgKytpU3ViTWVzaCkge1xyXG4gICAgICAgICAgICBjb25zdCBzdWJNZXNoTW9ycGggPSB0aGlzLl9tZXNoLnN0cnVjdC5tb3JwaC5zdWJNZXNoTW9ycGhzW2lTdWJNZXNoXTtcclxuICAgICAgICAgICAgaWYgKCFzdWJNZXNoTW9ycGgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc3ViTWVzaE1vcnBoLnRhcmdldHMubGVuZ3RoID4gVUJPTW9ycGguTUFYX01PUlBIX1RBUkdFVF9DT1VOVCkge1xyXG4gICAgICAgICAgICAgICAgd2FybklEKDEwMDAyLCBVQk9Nb3JwaC5NQVhfTU9SUEhfVEFSR0VUX0NPVU5ULCBzdWJNZXNoTW9ycGgudGFyZ2V0cy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChwcmVmZXJDcHVDb21wdXRpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N1Yk1lc2hSZW5kZXJpbmdzW2lTdWJNZXNoXSA9IG5ldyBDcHVDb21wdXRpbmcoXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWVzaCxcclxuICAgICAgICAgICAgICAgICAgICBpU3ViTWVzaCxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tZXNoLnN0cnVjdC5tb3JwaCxcclxuICAgICAgICAgICAgICAgICAgICBnZnhEZXZpY2UsXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3ViTWVzaFJlbmRlcmluZ3NbaVN1Yk1lc2hdID0gbmV3IEdwdUNvbXB1dGluZyhcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tZXNoLFxyXG4gICAgICAgICAgICAgICAgICAgIGlTdWJNZXNoLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21lc2guc3RydWN0Lm1vcnBoLFxyXG4gICAgICAgICAgICAgICAgICAgIGdmeERldmljZSxcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZUluc3RhbmNlICgpOiBNb3JwaFJlbmRlcmluZ0luc3RhbmNlIHtcclxuICAgICAgICBjb25zdCBuU3ViTWVzaGVzID0gdGhpcy5fbWVzaC5zdHJ1Y3QucHJpbWl0aXZlcy5sZW5ndGg7XHJcbiAgICAgICAgY29uc3Qgc3ViTWVzaEluc3RhbmNlczogKFN1Yk1lc2hNb3JwaFJlbmRlcmluZ0luc3RhbmNlIHwgbnVsbClbXSA9IG5ldyBBcnJheShuU3ViTWVzaGVzKTtcclxuICAgICAgICBmb3IgKGxldCBpU3ViTWVzaCA9IDA7IGlTdWJNZXNoIDwgblN1Yk1lc2hlczsgKytpU3ViTWVzaCkge1xyXG4gICAgICAgICAgICBzdWJNZXNoSW5zdGFuY2VzW2lTdWJNZXNoXSA9IHRoaXMuX3N1Yk1lc2hSZW5kZXJpbmdzW2lTdWJNZXNoXT8uY3JlYXRlSW5zdGFuY2UoKSA/PyBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzZXRXZWlnaHRzOiAoc3ViTWVzaEluZGV4OiBudW1iZXIsIHdlaWdodHM6IG51bWJlcltdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzdWJNZXNoSW5zdGFuY2VzW3N1Yk1lc2hJbmRleF0/LnNldFdlaWdodHMod2VpZ2h0cyk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICByZXF1aXJlZFBhdGNoZXM6IChzdWJNZXNoSW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgYXNzZXJ0SXNOb25OdWxsYWJsZSh0aGlzLl9tZXNoLnN0cnVjdC5tb3JwaCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJNZXNoTW9ycGggPSB0aGlzLl9tZXNoLnN0cnVjdC5tb3JwaC5zdWJNZXNoTW9ycGhzW3N1Yk1lc2hJbmRleF07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJNZXNoUmVuZGVyaW5nSW5zdGFuY2UgPSBzdWJNZXNoSW5zdGFuY2VzW3N1Yk1lc2hJbmRleF07XHJcbiAgICAgICAgICAgICAgICBpZiAoc3ViTWVzaFJlbmRlcmluZ0luc3RhbmNlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYXNzZXJ0SXNOb25OdWxsYWJsZShzdWJNZXNoTW9ycGgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGF0Y2hlczogSU1hY3JvUGF0Y2hbXSA9IFtcclxuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6ICdDQ19VU0VfTU9SUEgnLCB2YWx1ZTogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJ0NDX01PUlBIX1RBUkdFVF9DT1VOVCcsIHZhbHVlOiBzdWJNZXNoTW9ycGgudGFyZ2V0cy5sZW5ndGggfVxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIGlmIChzdWJNZXNoTW9ycGguYXR0cmlidXRlcy5pbmNsdWRlcyhHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfUE9TSVRJT04pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2hlcy5wdXNoKHsgbmFtZTogJ0NDX01PUlBIX1RBUkdFVF9IQVNfUE9TSVRJT04nLCB2YWx1ZTogdHJ1ZX0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHN1Yk1lc2hNb3JwaC5hdHRyaWJ1dGVzLmluY2x1ZGVzKEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9OT1JNQUwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2hlcy5wdXNoKHsgbmFtZTogJ0NDX01PUlBIX1RBUkdFVF9IQVNfTk9STUFMJywgdmFsdWU6IHRydWV9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChzdWJNZXNoTW9ycGguYXR0cmlidXRlcy5pbmNsdWRlcyhHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfVEFOR0VOVCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXRjaGVzLnB1c2goeyBuYW1lOiAnQ0NfTU9SUEhfVEFSR0VUX0hBU19UQU5HRU5UJywgdmFsdWU6IHRydWV9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHBhdGNoZXMucHVzaCguLi5zdWJNZXNoUmVuZGVyaW5nSW5zdGFuY2UucmVxdWlyZWRQYXRjaGVzKCkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdGNoZXM7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGFwdFBpcGVsaW5lU3RhdGU6IChzdWJNZXNoSW5kZXg6IG51bWJlciwgZGVzY3JpcHRvclNldDogR0ZYRGVzY3JpcHRvclNldCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3ViTWVzaEluc3RhbmNlc1tzdWJNZXNoSW5kZXhdPy5hZGFwdFBpcGVsaW5lU3RhdGUoZGVzY3JpcHRvclNldCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBkZXN0cm95OiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHN1Yk1lc2hJbnN0YW5jZSBvZiBzdWJNZXNoSW5zdGFuY2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3ViTWVzaEluc3RhbmNlPy5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIERlc2NyaWJlcyBob3cgdG8gcmVuZGVyIGEgc3ViLW1lc2ggbW9ycGguXHJcbiAqL1xyXG5pbnRlcmZhY2UgU3ViTWVzaE1vcnBoUmVuZGVyaW5nIHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIHJlbmRlcmluZyBpbnN0YW5jZS5cclxuICAgICAqL1xyXG4gICAgY3JlYXRlSW5zdGFuY2UgKCk6IFN1Yk1lc2hNb3JwaFJlbmRlcmluZ0luc3RhbmNlO1xyXG59XHJcblxyXG4vKipcclxuICogVGhlIGluc3RhbmNlIG9mIG9uY2Ugc3ViLW1lc2ggbW9ycGggcmVuZGVyaW5nLlxyXG4gKi9cclxuaW50ZXJmYWNlIFN1Yk1lc2hNb3JwaFJlbmRlcmluZ0luc3RhbmNlIHtcclxuICAgIC8qKlxyXG4gICAgICogU2V0IHdlaWdodHMgb2YgZWFjaCBtb3JwaCB0YXJnZXQuXHJcbiAgICAgKiBAcGFyYW0gd2VpZ2h0cyBUaGUgd2VpZ2h0cy5cclxuICAgICAqL1xyXG4gICAgc2V0V2VpZ2h0cyAod2VpZ2h0czogbnVtYmVyW10pOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXNrcyB0aGUgZGVmaW5lIG92ZXJyaWRlcyBuZWVkZWQgdG8gZG8gdGhlIHJlbmRlcmluZy5cclxuICAgICAqL1xyXG4gICAgcmVxdWlyZWRQYXRjaGVzICgpOiBJTWFjcm9QYXRjaFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRhcHRzIHRoZSBwaXBlbGluZVN0YXRlIHRvIGFwcGx5IHRoZSByZW5kZXJpbmcuXHJcbiAgICAgKiBAcGFyYW0gcGlwZWxpbmVTdGF0ZVxyXG4gICAgICovXHJcbiAgICBhZGFwdFBpcGVsaW5lU3RhdGUgKGRlc2NyaXB0b3JTZXQ6IEdGWERlc2NyaXB0b3JTZXQpOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGVzdHJveSB0aGlzIGluc3RhbmNlLlxyXG4gICAgICovXHJcbiAgICBkZXN0cm95ICgpOiB2b2lkO1xyXG59XHJcblxyXG4vKipcclxuICogKEdlbmVyYWwgcHVycG9zZSkgR3B1IGNvbXB1dGluZyBiYXNlZCBzdWItbWVzaCBtb3JwaCByZW5kZXJpbmcuXHJcbiAqIFRoaXMgdGVjaG5pcXVlIGNvbXB1dGVzIGZpbmFsIGF0dHJpYnV0ZSBkaXNwbGFjZW1lbnRzIG9uIEdQVS5cclxuICogVGFyZ2V0IGRpc3BsYWNlbWVudHMgb2YgZWFjaCBhdHRyaWJ1dGUgYXJlIHRyYW5zZmVycmVkIHRocm91Z2ggdmVydGV4IHRleHR1cmUsIHNheSwgbW9ycGggdGV4dHVyZS5cclxuICovXHJcbmNsYXNzIEdwdUNvbXB1dGluZyBpbXBsZW1lbnRzIFN1Yk1lc2hNb3JwaFJlbmRlcmluZyB7XHJcbiAgICBwcml2YXRlIF9nZnhEZXZpY2U6IEdGWERldmljZTtcclxuICAgIHByaXZhdGUgX3N1Yk1lc2hNb3JwaDogU3ViTWVzaE1vcnBoO1xyXG4gICAgcHJpdmF0ZSBfdGV4dHVyZUluZm86IHtcclxuICAgICAgICB3aWR0aDogbnVtYmVyO1xyXG4gICAgICAgIGhlaWdodDogbnVtYmVyO1xyXG4gICAgfTtcclxuICAgIHByaXZhdGUgX2F0dHJpYnV0ZXM6IHtcclxuICAgICAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgbW9ycGhUZXh0dXJlOiBNb3JwaFRleHR1cmU7XHJcbiAgICB9W107XHJcblxyXG4gICAgY29uc3RydWN0b3IgKG1lc2g6IE1lc2gsIHN1Yk1lc2hJbmRleDogbnVtYmVyLCBtb3JwaDogTW9ycGgsIGdmeERldmljZTogR0ZYRGV2aWNlKSB7XHJcbiAgICAgICAgdGhpcy5fZ2Z4RGV2aWNlID0gZ2Z4RGV2aWNlO1xyXG4gICAgICAgIGNvbnN0IHN1Yk1lc2hNb3JwaCA9IG1vcnBoLnN1Yk1lc2hNb3JwaHNbc3ViTWVzaEluZGV4XTtcclxuICAgICAgICBhc3NlcnRJc05vbk51bGxhYmxlKHN1Yk1lc2hNb3JwaCk7XHJcbiAgICAgICAgdGhpcy5fc3ViTWVzaE1vcnBoID0gc3ViTWVzaE1vcnBoO1xyXG5cclxuICAgICAgICBlbmFibGVWZXJ0ZXhJZChtZXNoLCBzdWJNZXNoSW5kZXgsIGdmeERldmljZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5WZXJ0aWNlcyA9IG1lc2guc3RydWN0LnZlcnRleEJ1bmRsZXNbbWVzaC5zdHJ1Y3QucHJpbWl0aXZlc1tzdWJNZXNoSW5kZXhdLnZlcnRleEJ1bmRlbEluZGljZXNbMF1dLnZpZXcuY291bnQ7XHJcbiAgICAgICAgY29uc3QgblRhcmdldHMgPSBzdWJNZXNoTW9ycGgudGFyZ2V0cy5sZW5ndGg7XHJcbiAgICAgICAgLy8gSGVhZCBpbmNsdWRlcyBOIHZlY3RvciA0LCB3aGVyZSBOIGlzIG51bWJlciBvZiB0YXJnZXRzLlxyXG4gICAgICAgIC8vIEV2ZXJ5IHIgY2hhbm5lbCBvZiB0aGUgcGl4ZWwgZGVub3RlcyB0aGUgaW5kZXggb2YgdGhlIGRhdGEgcGl4ZWwgb2YgY29ycmVzcG9uZGluZyB0YXJnZXQuXHJcbiAgICAgICAgLy8gWyAodGFyZ2V0MV9kYXRhX29mZnNldCksICh0YXJnZXQyX2RhdGFfb2Zmc2V0KSwgLi4uLiBdIHRhcmdldF9kYXRhXHJcbiAgICAgICAgY29uc3QgdmVjNFJlcXVpcmVkID0gblRhcmdldHMgKyBuVmVydGljZXMgKiBuVGFyZ2V0cztcclxuXHJcbiAgICAgICAgY29uc3QgdmVjNFRleHR1cmVGYWN0b3J5ID0gY3JlYXRlVmVjNFRleHR1cmVGYWN0b3J5KGdmeERldmljZSwgdmVjNFJlcXVpcmVkKTtcclxuICAgICAgICB0aGlzLl90ZXh0dXJlSW5mbyA9IHtcclxuICAgICAgICAgICAgd2lkdGg6IHZlYzRUZXh0dXJlRmFjdG9yeS53aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiB2ZWM0VGV4dHVyZUZhY3RvcnkuaGVpZ2h0LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZXMgdGV4dHVyZSBmb3IgZWFjaCBhdHRyaWJ1dGUuXHJcbiAgICAgICAgdGhpcy5fYXR0cmlidXRlcyA9IHN1Yk1lc2hNb3JwaC5hdHRyaWJ1dGVzLm1hcCgoYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdmVjNFRleCA9IHZlYzRUZXh0dXJlRmFjdG9yeS5jcmVhdGUoKTtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWVWaWV3ID0gdmVjNFRleC52YWx1ZVZpZXc7XHJcbiAgICAgICAgICAgIC8vIGlmIChERVYpIHsgLy8gTWFrZSBpdCBlYXN5IHRvIHZpZXcgdGV4dHVyZSBpbiBwcm9maWxlcnMuLi5cclxuICAgICAgICAgICAgLy8gICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVWaWV3Lmxlbmd0aCAvIDQ7ICsraSkge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIHZhbHVlVmlld1tpICogNCArIDNdID0gMS4wO1xyXG4gICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCBwSGVhZCA9IDA7XHJcbiAgICAgICAgICAgICAgICBsZXQgblZlYzRzID0gc3ViTWVzaE1vcnBoLnRhcmdldHMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgc3ViTWVzaE1vcnBoLnRhcmdldHMuZm9yRWFjaCgobW9ycGhUYXJnZXQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXNwbGFjZW1lbnRzVmlldyA9IG1vcnBoVGFyZ2V0LmRpc3BsYWNlbWVudHNbYXR0cmlidXRlSW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpc3BsYWNlbWVudHMgPSBuZXcgRmxvYXQzMkFycmF5KG1lc2guZGF0YS5idWZmZXIsIG1lc2guZGF0YS5ieXRlT2Zmc2V0ICsgZGlzcGxhY2VtZW50c1ZpZXcub2Zmc2V0LCBkaXNwbGFjZW1lbnRzVmlldy5jb3VudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgblZlYzNzID0gZGlzcGxhY2VtZW50cy5sZW5ndGggLyAzO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNlZSBgTWVzaC5wcm90b3R5cGUuZW5hYmxlVmVydGV4SWRDaGFubmVsYCBmb3IgdGhlIG1hZ2ljIGAwLjVgLlxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlVmlld1twSGVhZF0gPSBuVmVjNHMgKyAwLjU7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlzcGxhY2VtZW50c09mZnNldCA9IG5WZWM0cyAqIDQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaVZlYzMgPSAwOyBpVmVjMyA8IG5WZWMzczsgKytpVmVjMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVZpZXdbZGlzcGxhY2VtZW50c09mZnNldCArIDQgKiBpVmVjMyArIDBdID0gZGlzcGxhY2VtZW50c1szICogaVZlYzMgKyAwXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVWaWV3W2Rpc3BsYWNlbWVudHNPZmZzZXQgKyA0ICogaVZlYzMgKyAxXSA9IGRpc3BsYWNlbWVudHNbMyAqIGlWZWMzICsgMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlVmlld1tkaXNwbGFjZW1lbnRzT2Zmc2V0ICsgNCAqIGlWZWMzICsgMl0gPSBkaXNwbGFjZW1lbnRzWzMgKiBpVmVjMyArIDJdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwSGVhZCArPSA0O1xyXG4gICAgICAgICAgICAgICAgICAgIG5WZWM0cyArPSBuVmVjM3M7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2ZWM0VGV4LnVwZGF0ZVBpeGVscygpO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogYXR0cmlidXRlTmFtZSxcclxuICAgICAgICAgICAgICAgIG1vcnBoVGV4dHVyZTogdmVjNFRleCxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBhdHRyaWJ1dGUgb2YgdGhpcy5fYXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGUubW9ycGhUZXh0dXJlLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZUluc3RhbmNlICgpIHtcclxuICAgICAgICBjb25zdCBtb3JwaFVuaWZvcm1zID0gbmV3IE1vcnBoVW5pZm9ybXModGhpcy5fZ2Z4RGV2aWNlLCB0aGlzLl9zdWJNZXNoTW9ycGgudGFyZ2V0cy5sZW5ndGgpO1xyXG4gICAgICAgIG1vcnBoVW5pZm9ybXMuc2V0TW9ycGhUZXh0dXJlSW5mbyh0aGlzLl90ZXh0dXJlSW5mby53aWR0aCwgdGhpcy5fdGV4dHVyZUluZm8uaGVpZ2h0KTtcclxuICAgICAgICBtb3JwaFVuaWZvcm1zLmNvbW1pdCgpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNldFdlaWdodHM6ICh3ZWlnaHRzOiBudW1iZXJbXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbW9ycGhVbmlmb3Jtcy5zZXRXZWlnaHRzKHdlaWdodHMpO1xyXG4gICAgICAgICAgICAgICAgbW9ycGhVbmlmb3Jtcy5jb21taXQoKTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIHJlcXVpcmVkUGF0Y2hlczogKCk6IElNYWNyb1BhdGNoW10gPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFt7IG5hbWU6ICdDQ19NT1JQSF9UQVJHRVRfVVNFX1RFWFRVUkUnLCB2YWx1ZTogdHJ1ZSwgfV07XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBhZGFwdFBpcGVsaW5lU3RhdGU6IChkZXNjcmlwdG9yU2V0OiBHRlhEZXNjcmlwdG9yU2V0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGF0dHJpYnV0ZSBvZiB0aGlzLl9hdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJpbmRpbmc6IG51bWJlciB8IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGF0dHJpYnV0ZS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgR0ZYQXR0cmlidXRlTmFtZS5BVFRSX1BPU0lUSU9OOiBiaW5kaW5nID0gVU5JRk9STV9QT1NJVElPTl9NT1JQSF9URVhUVVJFX0JJTkRJTkc7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9OT1JNQUw6IGJpbmRpbmcgPSBVTklGT1JNX05PUk1BTF9NT1JQSF9URVhUVVJFX0JJTkRJTkc7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9UQU5HRU5UOiBiaW5kaW5nID0gVU5JRk9STV9UQU5HRU5UX01PUlBIX1RFWFRVUkVfQklORElORzsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YXJuKGBVbmV4cGVjdGVkIGF0dHJpYnV0ZSFgKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChiaW5kaW5nICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvclNldC5iaW5kU2FtcGxlcihiaW5kaW5nLCBhdHRyaWJ1dGUubW9ycGhUZXh0dXJlLnNhbXBsZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdG9yU2V0LmJpbmRUZXh0dXJlKGJpbmRpbmcsIGF0dHJpYnV0ZS5tb3JwaFRleHR1cmUudGV4dHVyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRvclNldC5iaW5kQnVmZmVyKFVCT01vcnBoLkJJTkRJTkcsIG1vcnBoVW5pZm9ybXMuYnVmZmVyKTtcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0b3JTZXQudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBkZXN0cm95OiAoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcHUgY29tcHV0aW5nIGJhc2VkIHN1Yi1tZXNoIG1vcnBoIHJlbmRlcmluZy5cclxuICogVGhpcyB0ZWNobmlxdWUgY29tcHV0ZXMgZmluYWwgYXR0cmlidXRlIGRpc3BsYWNlbWVudHMgb24gQ1BVLlxyXG4gKiBUaGUgZGlzcGxhY2VtZW50cywgdGhlbiwgYXJlIHBhc3NlZCB0byBHUFUuXHJcbiAqL1xyXG5jbGFzcyBDcHVDb21wdXRpbmcgaW1wbGVtZW50cyBTdWJNZXNoTW9ycGhSZW5kZXJpbmcge1xyXG4gICAgcHJpdmF0ZSBfZ2Z4RGV2aWNlOiBHRlhEZXZpY2U7XHJcbiAgICBwcml2YXRlIF9hdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgbmFtZTogc3RyaW5nO1xyXG4gICAgICAgIHRhcmdldHM6IHtcclxuICAgICAgICAgICAgZGlzcGxhY2VtZW50czogRmxvYXQzMkFycmF5O1xyXG4gICAgICAgIH1bXTtcclxuICAgIH1bXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChtZXNoOiBNZXNoLCBzdWJNZXNoSW5kZXg6IG51bWJlciwgbW9ycGg6IE1vcnBoLCBnZnhEZXZpY2U6IEdGWERldmljZSkge1xyXG4gICAgICAgIHRoaXMuX2dmeERldmljZSA9IGdmeERldmljZTtcclxuICAgICAgICBjb25zdCBzdWJNZXNoTW9ycGggPSBtb3JwaC5zdWJNZXNoTW9ycGhzW3N1Yk1lc2hJbmRleF07XHJcbiAgICAgICAgYXNzZXJ0SXNOb25OdWxsYWJsZShzdWJNZXNoTW9ycGgpO1xyXG4gICAgICAgIGVuYWJsZVZlcnRleElkKG1lc2gsIHN1Yk1lc2hJbmRleCwgZ2Z4RGV2aWNlKTtcclxuICAgICAgICB0aGlzLl9hdHRyaWJ1dGVzID0gc3ViTWVzaE1vcnBoLmF0dHJpYnV0ZXMubWFwKChhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVJbmRleCkgPT4gIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IGF0dHJpYnV0ZU5hbWUsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRzOiBzdWJNZXNoTW9ycGgudGFyZ2V0cy5tYXAoKGF0dHJpYnV0ZURpc3BsYWNlbWVudCkgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGFjZW1lbnRzOiBuZXcgRmxvYXQzMkFycmF5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNoLmRhdGEuYnVmZmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNoLmRhdGEuYnl0ZU9mZnNldCArIGF0dHJpYnV0ZURpc3BsYWNlbWVudC5kaXNwbGFjZW1lbnRzW2F0dHJpYnV0ZUluZGV4XS5vZmZzZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZURpc3BsYWNlbWVudC5kaXNwbGFjZW1lbnRzW2F0dHJpYnV0ZUluZGV4XS5jb3VudCksXHJcbiAgICAgICAgICAgICAgICB9KSksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBETyBOT1QgdXNlIHRoaXMgZmllbGQuXHJcbiAgICAgKi9cclxuICAgIGdldCBkYXRhICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYXR0cmlidXRlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlSW5zdGFuY2UgKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ3B1Q29tcHV0aW5nUmVuZGVyaW5nSW5zdGFuY2UoXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIHRoaXMuX2F0dHJpYnV0ZXNbMF0udGFyZ2V0c1swXS5kaXNwbGFjZW1lbnRzLmxlbmd0aCAvIDMsXHJcbiAgICAgICAgICAgIHRoaXMuX2dmeERldmljZSxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbmNsYXNzIENwdUNvbXB1dGluZ1JlbmRlcmluZ0luc3RhbmNlIGltcGxlbWVudHMgU3ViTWVzaE1vcnBoUmVuZGVyaW5nSW5zdGFuY2Uge1xyXG4gICAgcHJpdmF0ZSBfYXR0cmlidXRlczoge1xyXG4gICAgICAgIGF0dHJpYnV0ZU5hbWU6IHN0cmluZztcclxuICAgICAgICBtb3JwaFRleHR1cmU6IE1vcnBoVGV4dHVyZTtcclxuICAgIH1bXTtcclxuICAgIHByaXZhdGUgX293bmVyOiBDcHVDb21wdXRpbmc7XHJcbiAgICBwcml2YXRlIF9tb3JwaFVuaWZvcm1zOiBNb3JwaFVuaWZvcm1zO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvciAob3duZXI6IENwdUNvbXB1dGluZywgblZlcnRpY2VzOiBudW1iZXIsIGdmeERldmljZTogR0ZYRGV2aWNlKSB7XHJcbiAgICAgICAgdGhpcy5fb3duZXIgPSBvd25lcjtcclxuICAgICAgICB0aGlzLl9tb3JwaFVuaWZvcm1zID0gbmV3IE1vcnBoVW5pZm9ybXMoZ2Z4RGV2aWNlLCAwIC8qIFRPRE8/ICovICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHZlYzRUZXh0dXJlRmFjdG9yeSA9IGNyZWF0ZVZlYzRUZXh0dXJlRmFjdG9yeShnZnhEZXZpY2UsIG5WZXJ0aWNlcyk7XHJcbiAgICAgICAgdGhpcy5fbW9ycGhVbmlmb3Jtcy5zZXRNb3JwaFRleHR1cmVJbmZvKHZlYzRUZXh0dXJlRmFjdG9yeS53aWR0aCwgdmVjNFRleHR1cmVGYWN0b3J5LmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5fbW9ycGhVbmlmb3Jtcy5jb21taXQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fYXR0cmlidXRlcyA9IHRoaXMuX293bmVyLmRhdGEubWFwKChhdHRyaWJ1dGVNb3JwaCwgYXR0cmlidXRlSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbW9ycGhUZXh0dXJlID0gdmVjNFRleHR1cmVGYWN0b3J5LmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlTmFtZTogYXR0cmlidXRlTW9ycGgubmFtZSxcclxuICAgICAgICAgICAgICAgIG1vcnBoVGV4dHVyZSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0V2VpZ2h0cyAod2VpZ2h0czogbnVtYmVyW10pIHtcclxuICAgICAgICBmb3IgKGxldCBpQXR0cmlidXRlID0gMDsgaUF0dHJpYnV0ZSA8IHRoaXMuX2F0dHJpYnV0ZXMubGVuZ3RoOyArK2lBdHRyaWJ1dGUpIHtcclxuICAgICAgICAgICAgY29uc3QgbXlBdHRyaWJ1dGUgPSB0aGlzLl9hdHRyaWJ1dGVzW2lBdHRyaWJ1dGVdO1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZVZpZXcgPSBteUF0dHJpYnV0ZS5tb3JwaFRleHR1cmUudmFsdWVWaWV3O1xyXG4gICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGVNb3JwaCA9IHRoaXMuX293bmVyLmRhdGFbaUF0dHJpYnV0ZV07XHJcbiAgICAgICAgICAgIGFzc2VydElzVHJ1ZSh3ZWlnaHRzLmxlbmd0aCA9PT0gYXR0cmlidXRlTW9ycGgudGFyZ2V0cy5sZW5ndGgpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpVGFyZ2V0ID0gMDsgaVRhcmdldCA8IGF0dHJpYnV0ZU1vcnBoLnRhcmdldHMubGVuZ3RoOyArK2lUYXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldERpc3BsYWNlbWVudHMgPSBhdHRyaWJ1dGVNb3JwaC50YXJnZXRzW2lUYXJnZXRdLmRpc3BsYWNlbWVudHM7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB3ZWlnaHQgPSB3ZWlnaHRzW2lUYXJnZXRdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgblZlcnRpY2VzID0gdGFyZ2V0RGlzcGxhY2VtZW50cy5sZW5ndGggLyAzO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlUYXJnZXQgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpVmVydGV4ID0gMDsgaVZlcnRleCA8IG5WZXJ0aWNlczsgKytpVmVydGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlVmlld1s0ICogaVZlcnRleCArIDBdID0gdGFyZ2V0RGlzcGxhY2VtZW50c1szICogaVZlcnRleCArIDBdICogd2VpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVZpZXdbNCAqIGlWZXJ0ZXggKyAxXSA9IHRhcmdldERpc3BsYWNlbWVudHNbMyAqIGlWZXJ0ZXggKyAxXSAqIHdlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVWaWV3WzQgKiBpVmVydGV4ICsgMl0gPSB0YXJnZXREaXNwbGFjZW1lbnRzWzMgKiBpVmVydGV4ICsgMl0gKiB3ZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpVmVydGV4ID0gMDsgaVZlcnRleCA8IG5WZXJ0aWNlczsgKytpVmVydGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlVmlld1s0ICogaVZlcnRleCArIDBdICs9IHRhcmdldERpc3BsYWNlbWVudHNbMyAqIGlWZXJ0ZXggKyAwXSAqIHdlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVWaWV3WzQgKiBpVmVydGV4ICsgMV0gKz0gdGFyZ2V0RGlzcGxhY2VtZW50c1szICogaVZlcnRleCArIDFdICogd2VpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVZpZXdbNCAqIGlWZXJ0ZXggKyAyXSArPSB0YXJnZXREaXNwbGFjZW1lbnRzWzMgKiBpVmVydGV4ICsgMl0gKiB3ZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBOb3JtYWxpemUgZGlzcGxhY2VtZW50cyB0byBbMCwgMV0uXHJcbiAgICAgICAgICAgIGlmIChmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbiA9IGF0dHJpYnV0ZU1vcnBoLnRhcmdldHNbMF0uZGlzcGxhY2VtZW50cy5sZW5ndGggLyAzO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCAzOyArK2MpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWluID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBtYXggPSBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IHZhbHVlVmlld1tpICogNCArIGNdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXggPSBNYXRoLm1heCh4LCBtYXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW4gPSBNYXRoLm1pbih4LCBtaW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkID0gbWF4IC0gbWluO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gdmFsdWVWaWV3W2kgKiA0ICsgY107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVZpZXdbaSAqIDQgKyBjXSA9ICh4IC0gbWluKSAvIGQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFJhbmRvbWl6ZSBkaXNwbGFjZW1lbnRzLlxyXG4gICAgICAgICAgICBpZiAoZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVWaWV3Lmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgJSAzID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlVmlld1tpXSA9IChsZWdhY3lDQy5kaXJlY3Rvci5nZXRUb3RhbEZyYW1lcygpICUgNTAwKSAqIDAuMDAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlVmlld1tpXSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBteUF0dHJpYnV0ZS5tb3JwaFRleHR1cmUudXBkYXRlUGl4ZWxzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXF1aXJlZFBhdGNoZXMgKCk6IElNYWNyb1BhdGNoW10ge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ0NDX01PUlBIX1RBUkdFVF9VU0VfVEVYVFVSRScsIHZhbHVlOiB0cnVlLCB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6ICdDQ19NT1JQSF9QUkVDT01QVVRFRCcsIHZhbHVlOiB0cnVlLCB9LFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkYXB0UGlwZWxpbmVTdGF0ZSAoZGVzY3JpcHRvclNldDogR0ZYRGVzY3JpcHRvclNldCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgYXR0cmlidXRlIG9mIHRoaXMuX2F0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IGF0dHJpYnV0ZS5hdHRyaWJ1dGVOYW1lO1xyXG4gICAgICAgICAgICBsZXQgYmluZGluZzogbnVtYmVyIHwgdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGF0dHJpYnV0ZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgR0ZYQXR0cmlidXRlTmFtZS5BVFRSX1BPU0lUSU9OOiBiaW5kaW5nID0gVU5JRk9STV9QT1NJVElPTl9NT1JQSF9URVhUVVJFX0JJTkRJTkc7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfTk9STUFMOiBiaW5kaW5nID0gVU5JRk9STV9OT1JNQUxfTU9SUEhfVEVYVFVSRV9CSU5ESU5HOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgR0ZYQXR0cmlidXRlTmFtZS5BVFRSX1RBTkdFTlQ6IGJpbmRpbmcgPSBVTklGT1JNX1RBTkdFTlRfTU9SUEhfVEVYVFVSRV9CSU5ESU5HOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgd2FybihgVW5leHBlY3RlZCBhdHRyaWJ1dGUhYCk7IGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChiaW5kaW5nICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0b3JTZXQuYmluZFNhbXBsZXIoYmluZGluZywgYXR0cmlidXRlLm1vcnBoVGV4dHVyZS5zYW1wbGVyKTtcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0b3JTZXQuYmluZFRleHR1cmUoYmluZGluZywgYXR0cmlidXRlLm1vcnBoVGV4dHVyZS50ZXh0dXJlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBkZXNjcmlwdG9yU2V0LmJpbmRCdWZmZXIoVUJPTW9ycGguQklORElORywgdGhpcy5fbW9ycGhVbmlmb3Jtcy5idWZmZXIpO1xyXG4gICAgICAgIGRlc2NyaXB0b3JTZXQudXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHRoaXMuX21vcnBoVW5pZm9ybXMuZGVzdHJveSgpO1xyXG4gICAgICAgIGZvciAobGV0IGlBdHRyaWJ1dGUgPSAwOyBpQXR0cmlidXRlIDwgdGhpcy5fYXR0cmlidXRlcy5sZW5ndGg7ICsraUF0dHJpYnV0ZSkge1xyXG4gICAgICAgICAgICBjb25zdCBteUF0dHJpYnV0ZSA9IHRoaXMuX2F0dHJpYnV0ZXNbaUF0dHJpYnV0ZV07XHJcbiAgICAgICAgICAgIG15QXR0cmlidXRlLm1vcnBoVGV4dHVyZS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogUHJvdmlkZXMgdGhlIGFjY2VzcyB0byBtb3JwaCByZWxhdGVkIHVuaWZvcm1zLlxyXG4gKi9cclxuY2xhc3MgTW9ycGhVbmlmb3JtcyB7XHJcbiAgICBwcml2YXRlIF90YXJnZXRDb3VudDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfbG9jYWxCdWZmZXI6IERhdGFWaWV3O1xyXG4gICAgcHJpdmF0ZSBfcmVtb3RlQnVmZmVyOiBHRlhCdWZmZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGdmeERldmljZTogR0ZYRGV2aWNlLCB0YXJnZXRDb3VudDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0Q291bnQgPSB0YXJnZXRDb3VudDtcclxuICAgICAgICB0aGlzLl9sb2NhbEJ1ZmZlciA9IG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoVUJPTW9ycGguU0laRSkpO1xyXG4gICAgICAgIHRoaXMuX3JlbW90ZUJ1ZmZlciA9IGdmeERldmljZS5jcmVhdGVCdWZmZXIobmV3IEdGWEJ1ZmZlckluZm8oXHJcbiAgICAgICAgICAgIEdGWEJ1ZmZlclVzYWdlQml0LlVOSUZPUk0gfCBHRlhCdWZmZXJVc2FnZUJpdC5UUkFOU0ZFUl9EU1QsXHJcbiAgICAgICAgICAgIEdGWE1lbW9yeVVzYWdlQml0LkhPU1QgfCBHRlhNZW1vcnlVc2FnZUJpdC5ERVZJQ0UsXHJcbiAgICAgICAgICAgIFVCT01vcnBoLlNJWkUsXHJcbiAgICAgICAgICAgIFVCT01vcnBoLlNJWkUsXHJcbiAgICAgICAgKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHRoaXMuX3JlbW90ZUJ1ZmZlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBidWZmZXIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZW1vdGVCdWZmZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFdlaWdodHMgKHdlaWdodHM6IG51bWJlcltdKSB7XHJcbiAgICAgICAgYXNzZXJ0SXNUcnVlKHdlaWdodHMubGVuZ3RoID09PSB0aGlzLl90YXJnZXRDb3VudCk7XHJcbiAgICAgICAgZm9yIChsZXQgaVdlaWdodCA9IDA7IGlXZWlnaHQgPCB3ZWlnaHRzLmxlbmd0aDsgKytpV2VpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvY2FsQnVmZmVyLnNldEZsb2F0MzIoVUJPTW9ycGguT0ZGU0VUX09GX1dFSUdIVFMgKyA0ICogaVdlaWdodCwgd2VpZ2h0c1tpV2VpZ2h0XSwgbGVnYWN5Q0Muc3lzLmlzTGl0dGxlRW5kaWFuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE1vcnBoVGV4dHVyZUluZm8gKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fbG9jYWxCdWZmZXIuc2V0RmxvYXQzMihVQk9Nb3JwaC5PRkZTRVRfT0ZfRElTUExBQ0VNRU5UX1RFWFRVUkVfV0lEVEgsIHdpZHRoLCBsZWdhY3lDQy5zeXMuaXNMaXR0bGVFbmRpYW4pO1xyXG4gICAgICAgIHRoaXMuX2xvY2FsQnVmZmVyLnNldEZsb2F0MzIoVUJPTW9ycGguT0ZGU0VUX09GX0RJU1BMQUNFTUVOVF9URVhUVVJFX0hFSUdIVCwgaGVpZ2h0LCBsZWdhY3lDQy5zeXMuaXNMaXR0bGVFbmRpYW4pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb21taXQgKCkge1xyXG4gICAgICAgIHRoaXMuX3JlbW90ZUJ1ZmZlci51cGRhdGUoXHJcbiAgICAgICAgICAgIHRoaXMuX2xvY2FsQnVmZmVyLmJ1ZmZlcixcclxuICAgICAgICAgICAgdGhpcy5fbG9jYWxCdWZmZXIuYnl0ZU9mZnNldCxcclxuICAgICAgICAgICAgdGhpcy5fbG9jYWxCdWZmZXIuYnl0ZUxlbmd0aCxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICpcclxuICogQHBhcmFtIGdmeERldmljZVxyXG4gKiBAcGFyYW0gdmVjNENhcGFjaXR5IENhcGFjaXR5IG9mIHZlYzQuXHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVWZWM0VGV4dHVyZUZhY3RvcnkgKGdmeERldmljZTogR0ZYRGV2aWNlLCB2ZWM0Q2FwYWNpdHk6IG51bWJlcikge1xyXG4gICAgY29uc3QgaGFzRmVhdHVyZUZsb2F0VGV4dHVyZSA9IGdmeERldmljZS5oYXNGZWF0dXJlKEdGWEZlYXR1cmUuVEVYVFVSRV9GTE9BVCk7XHJcblxyXG4gICAgbGV0IHBpeGVsUmVxdWlyZWQ6IG51bWJlcjtcclxuICAgIGxldCBwaXhlbEZvcm1hdDogUGl4ZWxGb3JtYXQ7XHJcbiAgICBsZXQgcGl4ZWxCeXRlczogbnVtYmVyO1xyXG4gICAgbGV0IHVwZGF0ZVZpZXdDb25zdHJ1Y3RvcjogdHlwZW9mIEZsb2F0MzJBcnJheSB8IHR5cGVvZiBVaW50OEFycmF5O1xyXG4gICAgaWYgKGhhc0ZlYXR1cmVGbG9hdFRleHR1cmUpIHtcclxuICAgICAgICBwaXhlbFJlcXVpcmVkID0gdmVjNENhcGFjaXR5O1xyXG4gICAgICAgIHBpeGVsQnl0ZXMgPSAxNjtcclxuICAgICAgICBwaXhlbEZvcm1hdCA9IFRleHR1cmUyRC5QaXhlbEZvcm1hdC5SR0JBMzJGO1xyXG4gICAgICAgIHVwZGF0ZVZpZXdDb25zdHJ1Y3RvciA9IEZsb2F0MzJBcnJheTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcGl4ZWxSZXF1aXJlZCA9IDQgKiB2ZWM0Q2FwYWNpdHk7XHJcbiAgICAgICAgcGl4ZWxCeXRlcyA9IDQ7XHJcbiAgICAgICAgcGl4ZWxGb3JtYXQgPSBUZXh0dXJlMkQuUGl4ZWxGb3JtYXQuUkdCQTg4ODg7XHJcbiAgICAgICAgdXBkYXRlVmlld0NvbnN0cnVjdG9yID0gVWludDhBcnJheTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGJlc3RTaXplVG9IYXZlUGl4ZWxzKHBpeGVsUmVxdWlyZWQpO1xyXG4gICAgYXNzZXJ0SXNUcnVlKHdpZHRoICogaGVpZ2h0ID49IHBpeGVsUmVxdWlyZWQpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgIGNyZWF0ZTogKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhcnJheUJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcih3aWR0aCAqIGhlaWdodCAqIHBpeGVsQnl0ZXMpO1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZVZpZXcgPSBuZXcgRmxvYXQzMkFycmF5KGFycmF5QnVmZmVyKTtcclxuICAgICAgICAgICAgY29uc3QgdXBkYXRlVmlldyA9IHVwZGF0ZVZpZXdDb25zdHJ1Y3RvciA9PT0gRmxvYXQzMkFycmF5ID8gdmFsdWVWaWV3IDogbmV3IHVwZGF0ZVZpZXdDb25zdHJ1Y3RvcihhcnJheUJ1ZmZlcik7XHJcbiAgICAgICAgICAgIGNvbnN0IGltYWdlID0gbmV3IEltYWdlQXNzZXQoe1xyXG4gICAgICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBfZGF0YTogdXBkYXRlVmlldyxcclxuICAgICAgICAgICAgICAgIF9jb21wcmVzc2VkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGZvcm1hdDogcGl4ZWxGb3JtYXQsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb25zdCB0ZXh0dXJlQXNzZXQgPSBuZXcgVGV4dHVyZTJEKCk7XHJcbiAgICAgICAgICAgIHRleHR1cmVBc3NldC5zZXRGaWx0ZXJzKFRleHR1cmUyRC5GaWx0ZXIuTkVBUkVTVCwgVGV4dHVyZTJELkZpbHRlci5ORUFSRVNUKTtcclxuICAgICAgICAgICAgdGV4dHVyZUFzc2V0LnNldE1pcEZpbHRlcihUZXh0dXJlMkQuRmlsdGVyLk5PTkUpO1xyXG4gICAgICAgICAgICB0ZXh0dXJlQXNzZXQuc2V0V3JhcE1vZGUoVGV4dHVyZTJELldyYXBNb2RlLkNMQU1QX1RPX0VER0UsIFRleHR1cmUyRC5XcmFwTW9kZS5DTEFNUF9UT19FREdFLCBUZXh0dXJlMkQuV3JhcE1vZGUuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgICAgIHRleHR1cmVBc3NldC5pbWFnZSA9IGltYWdlO1xyXG4gICAgICAgICAgICBpZiAoIXRleHR1cmVBc3NldC5nZXRHRlhUZXh0dXJlKCkpIHtcclxuICAgICAgICAgICAgICAgIHdhcm4oYFVuZXhwZWN0ZWQ6IGZhaWxlZCB0byBjcmVhdGUgbW9ycGggdGV4dHVyZT9gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBzYW1wbGVyID0gc2FtcGxlckxpYi5nZXRTYW1wbGVyKGdmeERldmljZSwgdGV4dHVyZUFzc2V0LmdldFNhbXBsZXJIYXNoKCkpO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBHZXRzIHRoZSBHRlggdGV4dHVyZS5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZ2V0IHRleHR1cmUgKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0dXJlQXNzZXQuZ2V0R0ZYVGV4dHVyZSgpITtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBHZXRzIHRoZSBHRlggc2FtcGxlci5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZ2V0IHNhbXBsZXIgKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzYW1wbGVyO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFZhbHVlIHZpZXcuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGdldCB2YWx1ZVZpZXcgKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVZpZXc7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogRGVzdHJveSB0aGUgdGV4dHVyZS4gUmVsZWFzZSBpdHMgR1BVIHJlc291cmNlcy5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dHVyZUFzc2V0LmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBTYW1wbGVycyBhbGxvY2F0ZWQgZnJvbSBgc2FtcGxlckxpYmAgYXJlIG5vdCByZXF1aXJlZCBhbmRcclxuICAgICAgICAgICAgICAgICAgICAvLyBzaG91bGQgbm90IGJlIGRlc3Ryb3llZC5cclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLl9zYW1wbGVyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBVcGRhdGUgdGhlIHBpeGVscyBjb250ZW50IHRvIGB2YWx1ZVZpZXdgLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB1cGRhdGVQaXhlbHMgKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHR1cmVBc3NldC51cGxvYWREYXRhKHVwZGF0ZVZpZXcpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxufVxyXG5cclxudHlwZSBNb3JwaFRleHR1cmUgPSBSZXR1cm5UeXBlPFJldHVyblR5cGU8dHlwZW9mIGNyZWF0ZVZlYzRUZXh0dXJlRmFjdG9yeT5bJ2NyZWF0ZSddPjtcclxuXHJcbi8qKlxyXG4gKiBXaGVuIHVzZSB2ZXJ0ZXgtdGV4dHVyZS1mZXRjaCB0ZWNobmlxdWUsIHdlIGRvIG5lZWRcclxuICogYGdsX3ZlcnRleElkYCB3aGVuIHdlIHNhbXBsZSBwZXItdmVydGV4IGRhdGEuXHJcbiAqIFdlYkdMIDEuMCBkb2VzIG5vdCBoYXZlIGBnbF92ZXJ0ZXhJZGA7IFdlYkdMIDIuMCwgaG93ZXZlciwgZG9lcy5cclxuICogQHBhcmFtIG1lc2hcclxuICogQHBhcmFtIHN1Yk1lc2hJbmRleFxyXG4gKiBAcGFyYW0gZ2Z4RGV2aWNlXHJcbiAqL1xyXG5mdW5jdGlvbiBlbmFibGVWZXJ0ZXhJZCAobWVzaDogTWVzaCwgc3ViTWVzaEluZGV4OiBudW1iZXIsIGdmeERldmljZTogR0ZYRGV2aWNlKSB7XHJcbiAgICBtZXNoLnJlbmRlcmluZ1N1Yk1lc2hlc1tzdWJNZXNoSW5kZXhdLmVuYWJsZVZlcnRleElkQ2hhbm5lbChnZnhEZXZpY2UpO1xyXG59XHJcblxyXG4vKipcclxuICogRGVjaWRlcyBhIGJlc3QgdGV4dHVyZSBzaXplIHRvIGhhdmUgdGhlIHNwZWNpZmllZCBwaXhlbCBjYXBhY2l0eSBhdCBsZWFzdC5cclxuICogVGhlIGRlY2lkZWQgd2lkdGggYW5kIGhlaWdodCBoYXMgdGhlIGZvbGxvd2luZyBjaGFyYWN0ZXJpc3RpY3M6XHJcbiAqIC0gdGhlIHdpZHRoIGFuZCBoZWlnaHQgYXJlIGJvdGggcG93ZXIgb2YgMjtcclxuICogLSBpZiB0aGUgd2lkdGggYW5kIGhlaWdodCBhcmUgZGlmZmVyZW50LCB0aGUgd2lkdGggd291bGQgYmUgc2V0IHRvIHRoZSBsYXJnZXIgb25jZTtcclxuICogLSB0aGUgd2lkdGggaXMgZW5zdXJlZCB0byBiZSBtdWx0aXBsZSBvZiA0LlxyXG4gKiBAcGFyYW0gblBpeGVscyBMZWFzdCBwaXhlbCBjYXBhY2l0eS5cclxuICovXHJcbmZ1bmN0aW9uIGJlc3RTaXplVG9IYXZlUGl4ZWxzIChuUGl4ZWxzOiBudW1iZXIpIHtcclxuICAgIGlmIChuUGl4ZWxzIDwgNSkge1xyXG4gICAgICAgIG5QaXhlbHMgPSA1O1xyXG4gICAgfVxyXG4gICAgY29uc3QgYWxpZ25lZCA9IG5leHRQb3cyKG5QaXhlbHMpO1xyXG4gICAgY29uc3QgZXB4U3VtID0gbG9nMihhbGlnbmVkKTtcclxuICAgIGNvbnN0IGggPSBlcHhTdW0gPj4gMTtcclxuICAgIGNvbnN0IHcgPSAoZXB4U3VtICYgMSkgPyAoaCArIDEpIDogaDtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgd2lkdGg6IDEgPDwgdyxcclxuICAgICAgICBoZWlnaHQ6IDEgPDwgaCxcclxuICAgIH07XHJcbn1cclxuIl19