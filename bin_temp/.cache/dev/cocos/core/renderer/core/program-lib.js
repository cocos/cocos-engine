(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../gfx/define.js", "../../gfx/device.js", "../../gfx/input-assembler.js", "../../gfx/shader.js", "../../pipeline/define.js", "./pass-utils.js", "../../global-exports.js", "./memory-pools.js", "../../gfx/descriptor-set.js", "../../gfx/descriptor-set-layout.js", "../../gfx/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../gfx/define.js"), require("../../gfx/device.js"), require("../../gfx/input-assembler.js"), require("../../gfx/shader.js"), require("../../pipeline/define.js"), require("./pass-utils.js"), require("../../global-exports.js"), require("./memory-pools.js"), require("../../gfx/descriptor-set.js"), require("../../gfx/descriptor-set-layout.js"), require("../../gfx/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define, global.device, global.inputAssembler, global.shader, global.define, global.passUtils, global.globalExports, global.memoryPools, global.descriptorSet, global.descriptorSetLayout, global.index);
    global.programLib = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define, _device, _inputAssembler, _shader, _define2, _passUtils, _globalExports, _memoryPools, _descriptorSet, _descriptorSetLayout, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.programLib = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var _dsLayoutInfo = new _descriptorSetLayout.GFXDescriptorSetLayoutInfo();

  function getBitCount(cnt) {
    return Math.ceil(Math.log2(Math.max(cnt, 2)));
  }

  function mapDefine(info, def) {
    switch (info.type) {
      case 'boolean':
        return (typeof def === 'number' ? def : def ? 1 : 0) + '';

      case 'string':
        return def !== undefined ? def : info.options[0];

      case 'number':
        return (def !== undefined ? def : info.range[0]) + '';
    }

    console.warn("unknown define type '".concat(info.type, "'"));
    return '-1'; // should neven happen
  }

  function prepareDefines(defs, tDefs) {
    var macros = [];

    for (var i = 0; i < tDefs.length; i++) {
      var tmpl = tDefs[i];
      var name = tmpl.name;
      var v = defs[name];

      var _value = mapDefine(tmpl, v);

      var isDefault = !v || v === '0';
      macros.push({
        name: name,
        value: _value,
        isDefault: isDefault
      });
    }

    return macros;
  }

  function getShaderInstanceName(name, macros) {
    return name + macros.reduce(function (acc, cur) {
      return cur.isDefault ? acc : "".concat(acc, "|").concat(cur.name).concat(cur.value);
    }, '');
  }

  function insertBuiltinBindings(tmpl, source, type) {
    var target = tmpl.builtins[type];
    var tempBlocks = [];

    for (var i = 0; i < target.blocks.length; i++) {
      var b = target.blocks[i];
      var info = source.layouts[b.name];

      if (!info || !(source.bindings[info.binding].descriptorType & _descriptorSet.DESCRIPTOR_BUFFER_TYPE)) {
        console.warn("builtin UBO '".concat(b.name, "' not available!"));
        continue;
      }

      tempBlocks.push(info);
    }

    Array.prototype.unshift.apply(tmpl.gfxBlocks, tempBlocks);
    var tempSamplers = [];

    for (var _i = 0; _i < target.samplers.length; _i++) {
      var s = target.samplers[_i];
      var _info = source.layouts[s.name];

      if (!_info || !(source.bindings[_info.binding].descriptorType & _descriptorSet.DESCRIPTOR_SAMPLER_TYPE)) {
        console.warn("builtin sampler '".concat(s.name, "' not available!"));
        continue;
      }

      tempSamplers.push(_info);
    }

    Array.prototype.unshift.apply(tmpl.gfxSamplers, tempSamplers);
  }

  function getSize(block) {
    return block.members.reduce(function (s, m) {
      return s + (0, _define.GFXGetTypeSize)(m.type) * m.count;
    }, 0);
  }

  function genHandles(tmpl) {
    var handleMap = {}; // block member handles

    for (var i = 0; i < tmpl.blocks.length; i++) {
      var block = tmpl.blocks[i];
      var members = block.members;
      var offset = 0;

      for (var j = 0; j < members.length; j++) {
        var uniform = members[j];
        handleMap[uniform.name] = (0, _passUtils.genHandle)(_passUtils.PropertyType.UBO, _define2.SetIndex.MATERIAL, block.binding, uniform.type, offset);
        offset += ((0, _define.GFXGetTypeSize)(uniform.type) >> 2) * uniform.count;
      }
    } // sampler handles


    for (var _i2 = 0; _i2 < tmpl.samplers.length; _i2++) {
      var sampler = tmpl.samplers[_i2];
      handleMap[sampler.name] = (0, _passUtils.genHandle)(_passUtils.PropertyType.SAMPLER, _define2.SetIndex.MATERIAL, sampler.binding, sampler.type);
    }

    return handleMap;
  }

  function dependencyCheck(dependencies, defines) {
    for (var i = 0; i < dependencies.length; i++) {
      var d = dependencies[i];

      if (d[0] === '!') {
        if (defines[d.slice(1)]) {
          return false;
        }
      } // negative dependency
      else if (!defines[d]) {
          return false;
        }
    }

    return true;
  }

  function getActiveAttributes(tmpl, defines) {
    var out = [];
    var attributes = tmpl.attributes,
        gfxAttributes = tmpl.gfxAttributes;

    for (var i = 0; i < attributes.length; i++) {
      if (!dependencyCheck(attributes[i].defines, defines)) {
        continue;
      }

      out.push(gfxAttributes[i]);
    }

    return out;
  }

  var _dsLayout = null;
  /**
   * @zh
   * 维护 shader 资源实例的全局管理器。
   */

  var ProgramLib = /*#__PURE__*/function () {
    function ProgramLib() {
      _classCallCheck(this, ProgramLib);

      this._templates = {};
      this._pipelineLayouts = {};
      this._cache = {};
    }

    _createClass(ProgramLib, [{
      key: "define",

      /**
       * @zh
       * 根据 effect 信息注册 shader 模板。
       */
      value: function define(prog) {
        var curTmpl = this._templates[prog.name];

        if (curTmpl && curTmpl.hash === prog.hash) {
          return;
        }

        var tmpl = Object.assign({}, prog); // calculate option mask offset

        var offset = 0;

        var _loop = function _loop(i) {
          var def = tmpl.defines[i];
          var cnt = 1;

          if (def.type === 'number') {
            var range = def.range;
            cnt = getBitCount(range[1] - range[0] + 1); // inclusive on both ends

            def._map = function (value) {
              return value - range[0];
            };
          } else if (def.type === 'string') {
            cnt = getBitCount(def.options.length);

            def._map = function (value) {
              return Math.max(0, def.options.findIndex(function (s) {
                return s === value;
              }));
            };
          } else if (def.type === 'boolean') {
            def._map = function (value) {
              return value ? 1 : 0;
            };
          }

          def._offset = offset;
          offset += cnt;
        };

        for (var i = 0; i < tmpl.defines.length; i++) {
          _loop(i);
        }

        if (offset > 31) {
          tmpl.uber = true;
        } // cache material-specific descriptor set layout


        tmpl.samplerStartBinding = tmpl.blocks.length;
        tmpl.gfxBlocks = [];
        tmpl.gfxSamplers = [];
        tmpl.bindings = [];
        tmpl.blockSizes = [];

        for (var _i3 = 0; _i3 < tmpl.blocks.length; _i3++) {
          var block = tmpl.blocks[_i3];
          tmpl.blockSizes.push(getSize(block));
          tmpl.bindings.push(new _descriptorSetLayout.GFXDescriptorSetLayoutBinding(block.descriptorType || _define.GFXDescriptorType.UNIFORM_BUFFER, 1, block.stageFlags));
          tmpl.gfxBlocks.push(new _shader.GFXUniformBlock(_define2.SetIndex.MATERIAL, block.binding, block.name, block.members.map(function (m) {
            return new _shader.GFXUniform(m.name, m.type, m.count);
          }), 1)); // effect compiler guarantees block count = 1
        }

        for (var _i4 = 0; _i4 < tmpl.samplers.length; _i4++) {
          var sampler = tmpl.samplers[_i4];
          tmpl.bindings.push(new _descriptorSetLayout.GFXDescriptorSetLayoutBinding(sampler.descriptorType || _define.GFXDescriptorType.SAMPLER, sampler.count, sampler.stageFlags));
          tmpl.gfxSamplers.push(new _shader.GFXUniformSampler(_define2.SetIndex.MATERIAL, sampler.binding, sampler.name, sampler.type, sampler.count));
        }

        tmpl.gfxAttributes = [];

        for (var _i5 = 0; _i5 < tmpl.attributes.length; _i5++) {
          var attr = tmpl.attributes[_i5];
          tmpl.gfxAttributes.push(new _inputAssembler.GFXAttribute(attr.name, attr.format, attr.isNormalized, 0, attr.isInstanced, attr.location));
        }

        tmpl.gfxStages = [];
        tmpl.gfxStages.push(new _shader.GFXShaderStage(_define.GFXShaderStageFlagBit.VERTEX, ''));
        tmpl.gfxStages.push(new _shader.GFXShaderStage(_define.GFXShaderStageFlagBit.FRAGMENT, ''));
        tmpl.handleMap = genHandles(tmpl); // store it

        this._templates[prog.name] = tmpl;
        this._pipelineLayouts[prog.name] = {
          hPipelineLayout: _memoryPools.NULL_HANDLE,
          setLayouts: []
        };
      }
    }, {
      key: "getTemplate",
      value: function getTemplate(name) {
        return this._templates[name];
      }
    }, {
      key: "getPipelineLayout",
      value: function getPipelineLayout(name) {
        return this._pipelineLayouts[name];
      }
      /**
       * @en
       * Does this library has the specified program?
       * @zh
       * 当前是否有已注册的指定名字的 shader？
       * @param name 目标 shader 名
       */

    }, {
      key: "hasProgram",
      value: function hasProgram(name) {
        return this._templates[name] !== undefined;
      }
      /**
       * @zh
       * 根据 shader 名和预处理宏列表获取 shader key。
       * @param name 目标 shader 名
       * @param defines 目标预处理宏列表
       */

    }, {
      key: "getKey",
      value: function getKey(name, defines) {
        var tmpl = this._templates[name];
        var tmplDefs = tmpl.defines;

        if (tmpl.uber) {
          var key = '';

          for (var i = 0; i < tmplDefs.length; i++) {
            var tmplDef = tmplDefs[i];
            var _value2 = defines[tmplDef.name];

            if (!_value2 || !tmplDef._map) {
              continue;
            }

            var mapped = tmplDef._map(_value2);

            var offset = tmplDef._offset;
            key += offset + (mapped + '|');
          }

          return key + tmpl.hash;
        } else {
          var _key = 0;

          for (var _i6 = 0; _i6 < tmplDefs.length; _i6++) {
            var _tmplDef = tmplDefs[_i6];
            var _value3 = defines[_tmplDef.name];

            if (!_value3 || !_tmplDef._map) {
              continue;
            }

            var _mapped = _tmplDef._map(_value3);

            var _offset = _tmplDef._offset;
            _key |= _mapped << _offset;
          }

          return "".concat(_key.toString(16), "|").concat(tmpl.hash);
        }
      }
      /**
       * @zh
       * 销毁所有完全满足指定预处理宏特征的 shader 实例。
       * @param defines 用于筛选的预处理宏列表
       */

    }, {
      key: "destroyShaderByDefines",
      value: function destroyShaderByDefines(defines) {
        var _this = this;

        var names = Object.keys(defines);

        if (!names.length) {
          return;
        }

        var regexes = names.map(function (cur) {
          var val = defines[cur];

          if (typeof val === 'boolean') {
            val = val ? '1' : '0';
          }

          return new RegExp(cur + val);
        });
        var keys = Object.keys(this._cache).filter(function (k) {
          return regexes.every(function (re) {
            return re.test(_memoryPools.ShaderPool.get(_this._cache[k]).name);
          });
        });

        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];

          var prog = _memoryPools.ShaderPool.get(this._cache[k]);

          console.log("destroyed shader ".concat(prog.name));
          prog.destroy();
          delete this._cache[k];
        }
      }
      /**
       * @zh
       * 获取指定 shader 的渲染资源实例
       * @param device 渲染设备 [[GFXDevice]]
       * @param name shader 名字
       * @param defines 预处理宏列表
       * @param pipeline 实际渲染命令执行时所属的 [[RenderPipeline]]
       */

    }, {
      key: "getGFXShader",
      value: function getGFXShader(device, name, defines, pipeline, key) {
        Object.assign(defines, pipeline.macros);
        if (!key) key = this.getKey(name, defines);
        var res = this._cache[key];

        if (res) {
          return res;
        }

        var tmpl = this._templates[name];
        var layout = this._pipelineLayouts[name];

        if (!layout.hPipelineLayout) {
          insertBuiltinBindings(tmpl, _define2.localDescriptorSetLayout, 'locals');
          insertBuiltinBindings(tmpl, _define2.globalDescriptorSetLayout, 'globals');
          layout.setLayouts[_define2.SetIndex.GLOBAL] = pipeline.descriptorSetLayout; // material set layout should already been created in pass, but if not
          // (like when the same shader is overriden) we create it again here

          if (!layout.setLayouts[_define2.SetIndex.MATERIAL]) {
            _dsLayoutInfo.bindings = tmpl.bindings;
            layout.setLayouts[_define2.SetIndex.MATERIAL] = device.createDescriptorSetLayout(_dsLayoutInfo);
          }

          _dsLayoutInfo.bindings = _define2.localDescriptorSetLayout.bindings;
          layout.setLayouts[_define2.SetIndex.LOCAL] = _dsLayout = _dsLayout || device.createDescriptorSetLayout(_dsLayoutInfo);
          layout.hPipelineLayout = _memoryPools.PipelineLayoutPool.alloc(device, new _index.GFXPipelineLayoutInfo(layout.setLayouts));
        }

        var macroArray = prepareDefines(defines, tmpl.defines);
        var prefix = macroArray.reduce(function (acc, cur) {
          return "".concat(acc, "#define ").concat(cur.name, " ").concat(cur.value, "\n");
        }, '') + '\n';
        var src = tmpl.glsl3;

        switch (device.gfxAPI) {
          case _device.GFXAPI.GLES2:
          case _device.GFXAPI.WEBGL:
            src = tmpl.glsl1;
            break;

          case _device.GFXAPI.GLES3:
          case _device.GFXAPI.WEBGL2:
            src = tmpl.glsl3;
            break;

          case _device.GFXAPI.VULKAN:
          case _device.GFXAPI.METAL:
            src = tmpl.glsl4;
            break;

          default:
            console.error('Invalid GFX API!');
            break;
        }

        tmpl.gfxStages[0].source = prefix + src.vert;
        tmpl.gfxStages[1].source = prefix + src.frag; // strip out the active attributes only, instancing depend on this

        var attributes = getActiveAttributes(tmpl, defines);
        var instanceName = getShaderInstanceName(name, macroArray);
        var shaderInfo = new _shader.GFXShaderInfo(instanceName, tmpl.gfxStages, attributes, tmpl.gfxBlocks, tmpl.gfxSamplers);
        return this._cache[key] = _memoryPools.ShaderPool.alloc(device, shaderInfo);
      }
    }]);

    return ProgramLib;
  }();

  var programLib = new ProgramLib();
  _exports.programLib = programLib;
  _globalExports.legacyCC.programLib = programLib;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvY29yZS9wcm9ncmFtLWxpYi50cyJdLCJuYW1lcyI6WyJfZHNMYXlvdXRJbmZvIiwiR0ZYRGVzY3JpcHRvclNldExheW91dEluZm8iLCJnZXRCaXRDb3VudCIsImNudCIsIk1hdGgiLCJjZWlsIiwibG9nMiIsIm1heCIsIm1hcERlZmluZSIsImluZm8iLCJkZWYiLCJ0eXBlIiwidW5kZWZpbmVkIiwib3B0aW9ucyIsInJhbmdlIiwiY29uc29sZSIsIndhcm4iLCJwcmVwYXJlRGVmaW5lcyIsImRlZnMiLCJ0RGVmcyIsIm1hY3JvcyIsImkiLCJsZW5ndGgiLCJ0bXBsIiwibmFtZSIsInYiLCJ2YWx1ZSIsImlzRGVmYXVsdCIsInB1c2giLCJnZXRTaGFkZXJJbnN0YW5jZU5hbWUiLCJyZWR1Y2UiLCJhY2MiLCJjdXIiLCJpbnNlcnRCdWlsdGluQmluZGluZ3MiLCJzb3VyY2UiLCJ0YXJnZXQiLCJidWlsdGlucyIsInRlbXBCbG9ja3MiLCJibG9ja3MiLCJiIiwibGF5b3V0cyIsImJpbmRpbmdzIiwiYmluZGluZyIsImRlc2NyaXB0b3JUeXBlIiwiREVTQ1JJUFRPUl9CVUZGRVJfVFlQRSIsIkFycmF5IiwicHJvdG90eXBlIiwidW5zaGlmdCIsImFwcGx5IiwiZ2Z4QmxvY2tzIiwidGVtcFNhbXBsZXJzIiwic2FtcGxlcnMiLCJzIiwiREVTQ1JJUFRPUl9TQU1QTEVSX1RZUEUiLCJnZnhTYW1wbGVycyIsImdldFNpemUiLCJibG9jayIsIm1lbWJlcnMiLCJtIiwiY291bnQiLCJnZW5IYW5kbGVzIiwiaGFuZGxlTWFwIiwib2Zmc2V0IiwiaiIsInVuaWZvcm0iLCJQcm9wZXJ0eVR5cGUiLCJVQk8iLCJTZXRJbmRleCIsIk1BVEVSSUFMIiwic2FtcGxlciIsIlNBTVBMRVIiLCJkZXBlbmRlbmN5Q2hlY2siLCJkZXBlbmRlbmNpZXMiLCJkZWZpbmVzIiwiZCIsInNsaWNlIiwiZ2V0QWN0aXZlQXR0cmlidXRlcyIsIm91dCIsImF0dHJpYnV0ZXMiLCJnZnhBdHRyaWJ1dGVzIiwiX2RzTGF5b3V0IiwiUHJvZ3JhbUxpYiIsIl90ZW1wbGF0ZXMiLCJfcGlwZWxpbmVMYXlvdXRzIiwiX2NhY2hlIiwicHJvZyIsImN1clRtcGwiLCJoYXNoIiwiT2JqZWN0IiwiYXNzaWduIiwiX21hcCIsImZpbmRJbmRleCIsIl9vZmZzZXQiLCJ1YmVyIiwic2FtcGxlclN0YXJ0QmluZGluZyIsImJsb2NrU2l6ZXMiLCJHRlhEZXNjcmlwdG9yU2V0TGF5b3V0QmluZGluZyIsIkdGWERlc2NyaXB0b3JUeXBlIiwiVU5JRk9STV9CVUZGRVIiLCJzdGFnZUZsYWdzIiwiR0ZYVW5pZm9ybUJsb2NrIiwibWFwIiwiR0ZYVW5pZm9ybSIsIkdGWFVuaWZvcm1TYW1wbGVyIiwiYXR0ciIsIkdGWEF0dHJpYnV0ZSIsImZvcm1hdCIsImlzTm9ybWFsaXplZCIsImlzSW5zdGFuY2VkIiwibG9jYXRpb24iLCJnZnhTdGFnZXMiLCJHRlhTaGFkZXJTdGFnZSIsIkdGWFNoYWRlclN0YWdlRmxhZ0JpdCIsIlZFUlRFWCIsIkZSQUdNRU5UIiwiaFBpcGVsaW5lTGF5b3V0IiwiTlVMTF9IQU5ETEUiLCJzZXRMYXlvdXRzIiwidG1wbERlZnMiLCJrZXkiLCJ0bXBsRGVmIiwibWFwcGVkIiwidG9TdHJpbmciLCJuYW1lcyIsImtleXMiLCJyZWdleGVzIiwidmFsIiwiUmVnRXhwIiwiZmlsdGVyIiwiayIsImV2ZXJ5IiwicmUiLCJ0ZXN0IiwiU2hhZGVyUG9vbCIsImdldCIsImxvZyIsImRlc3Ryb3kiLCJkZXZpY2UiLCJwaXBlbGluZSIsImdldEtleSIsInJlcyIsImxheW91dCIsImxvY2FsRGVzY3JpcHRvclNldExheW91dCIsImdsb2JhbERlc2NyaXB0b3JTZXRMYXlvdXQiLCJHTE9CQUwiLCJkZXNjcmlwdG9yU2V0TGF5b3V0IiwiY3JlYXRlRGVzY3JpcHRvclNldExheW91dCIsIkxPQ0FMIiwiUGlwZWxpbmVMYXlvdXRQb29sIiwiYWxsb2MiLCJHRlhQaXBlbGluZUxheW91dEluZm8iLCJtYWNyb0FycmF5IiwicHJlZml4Iiwic3JjIiwiZ2xzbDMiLCJnZnhBUEkiLCJHRlhBUEkiLCJHTEVTMiIsIldFQkdMIiwiZ2xzbDEiLCJHTEVTMyIsIldFQkdMMiIsIlZVTEtBTiIsIk1FVEFMIiwiZ2xzbDQiLCJlcnJvciIsInZlcnQiLCJmcmFnIiwiaW5zdGFuY2VOYW1lIiwic2hhZGVySW5mbyIsIkdGWFNoYWRlckluZm8iLCJwcm9ncmFtTGliIiwibGVnYWN5Q0MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkNBLE1BQU1BLGFBQWEsR0FBRyxJQUFJQywrQ0FBSixFQUF0Qjs7QUE4QkEsV0FBU0MsV0FBVCxDQUFzQkMsR0FBdEIsRUFBbUM7QUFDL0IsV0FBT0MsSUFBSSxDQUFDQyxJQUFMLENBQVVELElBQUksQ0FBQ0UsSUFBTCxDQUFVRixJQUFJLENBQUNHLEdBQUwsQ0FBU0osR0FBVCxFQUFjLENBQWQsQ0FBVixDQUFWLENBQVA7QUFDSDs7QUFFRCxXQUFTSyxTQUFULENBQW9CQyxJQUFwQixFQUF1Q0MsR0FBdkMsRUFBdUU7QUFDbkUsWUFBUUQsSUFBSSxDQUFDRSxJQUFiO0FBQ0ksV0FBSyxTQUFMO0FBQWdCLGVBQU8sQ0FBQyxPQUFPRCxHQUFQLEtBQWUsUUFBZixHQUEwQkEsR0FBMUIsR0FBaUNBLEdBQUcsR0FBRyxDQUFILEdBQU8sQ0FBNUMsSUFBa0QsRUFBekQ7O0FBQ2hCLFdBQUssUUFBTDtBQUFlLGVBQU9BLEdBQUcsS0FBS0UsU0FBUixHQUFvQkYsR0FBcEIsR0FBb0NELElBQUksQ0FBQ0ksT0FBTCxDQUFjLENBQWQsQ0FBM0M7O0FBQ2YsV0FBSyxRQUFMO0FBQWUsZUFBTyxDQUFDSCxHQUFHLEtBQUtFLFNBQVIsR0FBb0JGLEdBQXBCLEdBQW9DRCxJQUFJLENBQUNLLEtBQUwsQ0FBWSxDQUFaLENBQXJDLElBQXVELEVBQTlEO0FBSG5COztBQUtBQyxJQUFBQSxPQUFPLENBQUNDLElB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QUFPLENBQUNzSixLQUFSLENBQWMsa0JBQWQ7QUFBbUM7QUFQaEQ7O0FBU0E5SSxRQUFBQSxJQUFJLENBQUN1RixTQUFMLENBQWUsQ0FBZixFQUFrQjVFLE1BQWxCLEdBQTJCc0gsTUFBTSxHQUFHQyxHQUFHLENBQUNhLElBQXhDO0FBQ0EvSSxRQUFBQSxJQUFJLENBQUN1RixTQUFMLENBQWUsQ0FBZixFQUFrQjVFLE1BQWxCLEdBQTJCc0gsTUFBTSxHQUFHQyxHQUFHLENBQUNjLElBQXhDLENBdENnSCxDQXdDaEg7O0FBQ0EsWUFBTXpGLFVBQVUsR0FBR0YsbUJBQW1CLENBQUNyRCxJQUFELEVBQU9rRCxPQUFQLENBQXRDO0FBRUEsWUFBTStGLFlBQVksR0FBRzNJLHFCQUFxQixDQUFDTCxJQUFELEVBQU8rSCxVQUFQLENBQTFDO0FBQ0EsWUFBTWtCLFVBQVUsR0FBRyxJQUFJQyxxQkFBSixDQUFrQkYsWUFBbEIsRUFBZ0NqSixJQUFJLENBQUN1RixTQUFyQyxFQUFnRGhDLFVBQWhELEVBQTREdkQsSUFBSSxDQUFDMEIsU0FBakUsRUFBNEUxQixJQUFJLENBQUMrQixXQUFqRixDQUFuQjtBQUNBLGVBQU8sS0FBSzhCLE1BQUwsQ0FBWW1DLEdBQVosSUFBbUJjLHdCQUFXZ0IsS0FBWCxDQUFpQlosTUFBakIsRUFBeUJnQyxVQUF6QixDQUExQjtBQUNIOzs7Ozs7QUFHRSxNQUFNRSxVQUFVLEdBQUcsSUFBSTFGLFVBQUosRUFBbkI7O0FBQ1AyRiwwQkFBU0QsVUFBVCxHQUFzQkEsVUFBdEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IG1hdGVyaWFsXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgSUJsb2NrSW5mbywgSUJ1aWx0aW5JbmZvLCBJRGVmaW5lSW5mbywgSVNoYWRlckluZm8gfSBmcm9tICcuLi8uLi9hc3NldHMvZWZmZWN0LWFzc2V0JztcclxuaW1wb3J0IHsgR0ZYRGVzY3JpcHRvclR5cGUsIEdGWEdldFR5cGVTaXplLCBHRlhTaGFkZXJTdGFnZUZsYWdCaXQgfSBmcm9tICcuLi8uLi9nZngvZGVmaW5lJztcclxuaW1wb3J0IHsgR0ZYQVBJLCBHRlhEZXZpY2UgfSBmcm9tICcuLi8uLi9nZngvZGV2aWNlJztcclxuaW1wb3J0IHsgR0ZYQXR0cmlidXRlIH0gZnJvbSAnLi4vLi4vZ2Z4L2lucHV0LWFzc2VtYmxlcic7XHJcbmltcG9ydCB7IEdGWFVuaWZvcm1CbG9jaywgR0ZYU2hhZGVySW5mbywgR0ZYVW5pZm9ybVNhbXBsZXIsIEdGWFVuaWZvcm0sIEdGWFNoYWRlclN0YWdlIH0gZnJvbSAnLi4vLi4vZ2Z4L3NoYWRlcic7XHJcbmltcG9ydCB7IFNldEluZGV4LCBJRGVzY3JpcHRvclNldExheW91dEluZm8sIGdsb2JhbERlc2NyaXB0b3JTZXRMYXlvdXQsIGxvY2FsRGVzY3JpcHRvclNldExheW91dCB9IGZyb20gJy4uLy4uL3BpcGVsaW5lL2RlZmluZSc7XHJcbmltcG9ydCB7IFJlbmRlclBpcGVsaW5lIH0gZnJvbSAnLi4vLi4vcGlwZWxpbmUvcmVuZGVyLXBpcGVsaW5lJztcclxuaW1wb3J0IHsgZ2VuSGFuZGxlLCBNYWNyb1JlY29yZCwgUHJvcGVydHlUeXBlIH0gZnJvbSAnLi9wYXNzLXV0aWxzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IFNoYWRlclBvb2wsIFNoYWRlckhhbmRsZSwgUGlwZWxpbmVMYXlvdXRIYW5kbGUsIFBpcGVsaW5lTGF5b3V0UG9vbCwgTlVMTF9IQU5ETEUgfSBmcm9tICcuL21lbW9yeS1wb29scyc7XHJcbmltcG9ydCB7IERFU0NSSVBUT1JfU0FNUExFUl9UWVBFLCBERVNDUklQVE9SX0JVRkZFUl9UWVBFIH0gZnJvbSAnLi4vLi4vZ2Z4L2Rlc2NyaXB0b3Itc2V0JztcclxuaW1wb3J0IHsgR0ZYRGVzY3JpcHRvclNldExheW91dCwgR0ZYRGVzY3JpcHRvclNldExheW91dEJpbmRpbmcsIEdGWERlc2NyaXB0b3JTZXRMYXlvdXRJbmZvIH0gZnJvbSAnLi4vLi4vZ2Z4L2Rlc2NyaXB0b3Itc2V0LWxheW91dCc7XHJcbmltcG9ydCB7IEdGWFBpcGVsaW5lTGF5b3V0SW5mbyB9IGZyb20gJy4uLy4uL2dmeCc7XHJcblxyXG5jb25zdCBfZHNMYXlvdXRJbmZvID0gbmV3IEdGWERlc2NyaXB0b3JTZXRMYXlvdXRJbmZvKCk7XHJcblxyXG5pbnRlcmZhY2UgSURlZmluZVJlY29yZCBleHRlbmRzIElEZWZpbmVJbmZvIHtcclxuICAgIF9tYXA6ICh2YWx1ZTogYW55KSA9PiBudW1iZXI7XHJcbiAgICBfb2Zmc2V0OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVByb2dyYW1JbmZvIGV4dGVuZHMgSVNoYWRlckluZm8ge1xyXG4gICAgYmxvY2tTaXplczogbnVtYmVyW107XHJcbiAgICBnZnhBdHRyaWJ1dGVzOiBHRlhBdHRyaWJ1dGVbXTtcclxuICAgIGdmeEJsb2NrczogR0ZYVW5pZm9ybUJsb2NrW107XHJcbiAgICBnZnhTYW1wbGVyczogR0ZYVW5pZm9ybVNhbXBsZXJbXTtcclxuICAgIGdmeFN0YWdlczogR0ZYU2hhZGVyU3RhZ2VbXTtcclxuICAgIGRlZmluZXM6IElEZWZpbmVSZWNvcmRbXTtcclxuICAgIGhhbmRsZU1hcDogUmVjb3JkPHN0cmluZywgbnVtYmVyPjtcclxuICAgIGJpbmRpbmdzOiBHRlhEZXNjcmlwdG9yU2V0TGF5b3V0QmluZGluZ1tdO1xyXG4gICAgc2FtcGxlclN0YXJ0QmluZGluZzogbnVtYmVyO1xyXG4gICAgdWJlcjogYm9vbGVhbjsgLy8gbWFjcm8gbnVtYmVyIGV4Y2VlZHMgZGVmYXVsdCBsaW1pdHMsIHdpbGwgZmFsbGJhY2sgdG8gc3RyaW5nIGhhc2hcclxufVxyXG5pbnRlcmZhY2UgSU1hY3JvSW5mbyB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICB2YWx1ZTogc3RyaW5nO1xyXG4gICAgaXNEZWZhdWx0OiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQaXBlbGluZUxheW91dEluZm8ge1xyXG4gICAgc2V0TGF5b3V0czogR0ZYRGVzY3JpcHRvclNldExheW91dFtdO1xyXG4gICAgaFBpcGVsaW5lTGF5b3V0OiBQaXBlbGluZUxheW91dEhhbmRsZTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Qml0Q291bnQgKGNudDogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gTWF0aC5jZWlsKE1hdGgubG9nMihNYXRoLm1heChjbnQsIDIpKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1hcERlZmluZSAoaW5mbzogSURlZmluZUluZm8sIGRlZjogbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbikge1xyXG4gICAgc3dpdGNoIChpbmZvLnR5cGUpIHtcclxuICAgICAgICBjYXNlICdib29sZWFuJzogcmV0dXJuICh0eXBlb2YgZGVmID09PSAnbnVtYmVyJyA/IGRlZiA6IChkZWYgPyAxIDogMCkpICsgJyc7XHJcbiAgICAgICAgY2FzZSAnc3RyaW5nJzogcmV0dXJuIGRlZiAhPT0gdW5kZWZpbmVkID8gZGVmIGFzIHN0cmluZyA6IGluZm8ub3B0aW9ucyFbMF07XHJcbiAgICAgICAgY2FzZSAnbnVtYmVyJzogcmV0dXJuIChkZWYgIT09IHVuZGVmaW5lZCA/IGRlZiBhcyBudW1iZXIgOiBpbmZvLnJhbmdlIVswXSkgKyAnJztcclxuICAgIH1cclxuICAgIGNvbnNvbGUud2FybihgdW5rbm93biBkZWZpbmUgdHlwZSAnJHtpbmZvLnR5cGV9J2ApO1xyXG4gICAgcmV0dXJuICctMSc7IC8vIHNob3VsZCBuZXZlbiBoYXBwZW5cclxufVxyXG5cclxuZnVuY3Rpb24gcHJlcGFyZURlZmluZXMgKGRlZnM6IE1hY3JvUmVjb3JkLCB0RGVmczogSURlZmluZUluZm9bXSkge1xyXG4gICAgY29uc3QgbWFjcm9zOiBJTWFjcm9JbmZvW10gPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdERlZnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCB0bXBsID0gdERlZnNbaV07XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IHRtcGwubmFtZTtcclxuICAgICAgICBjb25zdCB2ID0gZGVmc1tuYW1lXTtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IG1hcERlZmluZSh0bXBsLCB2KTtcclxuICAgICAgICBjb25zdCBpc0RlZmF1bHQgPSAhdiB8fCB2ID09PSAnMCc7XHJcbiAgICAgICAgbWFjcm9zLnB1c2goeyBuYW1lLCB2YWx1ZSwgaXNEZWZhdWx0IH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1hY3JvcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2hhZGVySW5zdGFuY2VOYW1lIChuYW1lOiBzdHJpbmcsIG1hY3JvczogSU1hY3JvSW5mb1tdKSB7XHJcbiAgICByZXR1cm4gbmFtZSArIG1hY3Jvcy5yZWR1Y2UoKGFjYywgY3VyKSA9PiBjdXIuaXNEZWZhdWx0ID8gYWNjIDogYCR7YWNjfXwke2N1ci5uYW1lfSR7Y3VyLnZhbHVlfWAsICcnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5zZXJ0QnVpbHRpbkJpbmRpbmdzICh0bXBsOiBJUHJvZ3JhbUluZm8sIHNvdXJjZTogSURlc2NyaXB0b3JTZXRMYXlvdXRJbmZvLCB0eXBlOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHRhcmdldCA9IHRtcGwuYnVpbHRpbnNbdHlwZV0gYXMgSUJ1aWx0aW5JbmZvO1xyXG4gICAgY29uc3QgdGVtcEJsb2NrczogR0ZYVW5pZm9ybUJsb2NrW10gPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFyZ2V0LmJsb2Nrcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGIgPSB0YXJnZXQuYmxvY2tzW2ldO1xyXG4gICAgICAgIGNvbnN0IGluZm8gPSBzb3VyY2UubGF5b3V0c1tiLm5hbWVdIGFzIEdGWFVuaWZvcm1CbG9jayB8IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAoIWluZm8gfHwgIShzb3VyY2UuYmluZGluZ3NbaW5mby5iaW5kaW5nXS5kZXNjcmlwdG9yVHlwZSAmIERFU0NSSVBUT1JfQlVGRkVSX1RZUEUpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgYnVpbHRpbiBVQk8gJyR7Yi5uYW1lfScgbm90IGF2YWlsYWJsZSFgKTtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRlbXBCbG9ja3MucHVzaChpbmZvKTtcclxuICAgIH1cclxuICAgIEFycmF5LnByb3RvdHlwZS51bnNoaWZ0LmFwcGx5KHRtcGwuZ2Z4QmxvY2tzLCB0ZW1wQmxvY2tzKTtcclxuICAgIGNvbnN0IHRlbXBTYW1wbGVyczogR0ZYVW5pZm9ybVNhbXBsZXJbXSA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXJnZXQuc2FtcGxlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBzID0gdGFyZ2V0LnNhbXBsZXJzW2ldO1xyXG4gICAgICAgIGNvbnN0IGluZm8gPSBzb3VyY2UubGF5b3V0c1tzLm5hbWVdIGFzIEdGWFVuaWZvcm1TYW1wbGVyO1xyXG4gICAgICAgIGlmICghaW5mbyB8fCAhKHNvdXJjZS5iaW5kaW5nc1tpbmZvLmJpbmRpbmddLmRlc2NyaXB0b3JUeXBlICYgREVTQ1JJUFRPUl9TQU1QTEVSX1RZUEUpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgYnVpbHRpbiBzYW1wbGVyICcke3MubmFtZX0nIG5vdCBhdmFpbGFibGUhYCk7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ZW1wU2FtcGxlcnMucHVzaChpbmZvKTtcclxuICAgIH1cclxuICAgIEFycmF5LnByb3RvdHlwZS51bnNoaWZ0LmFwcGx5KHRtcGwuZ2Z4U2FtcGxlcnMsIHRlbXBTYW1wbGVycyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNpemUgKGJsb2NrOiBJQmxvY2tJbmZvKSB7XHJcbiAgICByZXR1cm4gYmxvY2subWVtYmVycy5yZWR1Y2UoKHMsIG0pID0+IHMgKyBHRlhHZXRUeXBlU2l6ZShtLnR5cGUpICogbS5jb3VudCwgMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlbkhhbmRsZXMgKHRtcGw6IElQcm9ncmFtSW5mbykge1xyXG4gICAgY29uc3QgaGFuZGxlTWFwOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge307XHJcbiAgICAvLyBibG9jayBtZW1iZXIgaGFuZGxlc1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0bXBsLmJsb2Nrcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGJsb2NrID0gdG1wbC5ibG9ja3NbaV07XHJcbiAgICAgICAgY29uc3QgbWVtYmVycyA9IGJsb2NrLm1lbWJlcnM7XHJcbiAgICAgICAgbGV0IG9mZnNldCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBtZW1iZXJzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVuaWZvcm0gPSBtZW1iZXJzW2pdO1xyXG4gICAgICAgICAgICBoYW5kbGVNYXBbdW5pZm9ybS5uYW1lXSA9IGdlbkhhbmRsZShQcm9wZXJ0eVR5cGUuVUJPLCBTZXRJbmRleC5NQVRFUklBTCwgYmxvY2suYmluZGluZywgdW5pZm9ybS50eXBlLCBvZmZzZXQpO1xyXG4gICAgICAgICAgICBvZmZzZXQgKz0gKEdGWEdldFR5cGVTaXplKHVuaWZvcm0udHlwZSkgPj4gMikgKiB1bmlmb3JtLmNvdW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIHNhbXBsZXIgaGFuZGxlc1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0bXBsLnNhbXBsZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3Qgc2FtcGxlciA9IHRtcGwuc2FtcGxlcnNbaV07XHJcbiAgICAgICAgaGFuZGxlTWFwW3NhbXBsZXIubmFtZV0gPSBnZW5IYW5kbGUoUHJvcGVydHlUeXBlLlNBTVBMRVIsIFNldEluZGV4Lk1BVEVSSUFMLCBzYW1wbGVyLmJpbmRpbmcsIHNhbXBsZXIudHlwZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaGFuZGxlTWFwO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZXBlbmRlbmN5Q2hlY2sgKGRlcGVuZGVuY2llczogc3RyaW5nW10sIGRlZmluZXM6IE1hY3JvUmVjb3JkKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGQgPSBkZXBlbmRlbmNpZXNbaV07XHJcbiAgICAgICAgaWYgKGRbMF0gPT09ICchJykgeyBpZiAoZGVmaW5lc1tkLnNsaWNlKDEpXSkgeyByZXR1cm4gZmFsc2U7IH0gfSAvLyBuZWdhdGl2ZSBkZXBlbmRlbmN5XHJcbiAgICAgICAgZWxzZSBpZiAoIWRlZmluZXNbZF0pIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5mdW5jdGlvbiBnZXRBY3RpdmVBdHRyaWJ1dGVzICh0bXBsOiBJUHJvZ3JhbUluZm8sIGRlZmluZXM6IE1hY3JvUmVjb3JkKSB7XHJcbiAgICBjb25zdCBvdXQ6IEdGWEF0dHJpYnV0ZVtdID0gW107XHJcbiAgICBjb25zdCB7IGF0dHJpYnV0ZXMsIGdmeEF0dHJpYnV0ZXMgfSA9IHRtcGw7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoIWRlcGVuZGVuY3lDaGVjayhhdHRyaWJ1dGVzW2ldLmRlZmluZXMsIGRlZmluZXMpKSB7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgb3V0LnB1c2goZ2Z4QXR0cmlidXRlc1tpXSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0O1xyXG59XHJcblxyXG5sZXQgX2RzTGF5b3V0OiBHRlhEZXNjcmlwdG9yU2V0TGF5b3V0IHwgbnVsbCA9IG51bGw7XHJcblxyXG4vKipcclxuICogQHpoXHJcbiAqIOe7tOaKpCBzaGFkZXIg6LWE5rqQ5a6e5L6L55qE5YWo5bGA566h55CG5Zmo44CCXHJcbiAqL1xyXG5jbGFzcyBQcm9ncmFtTGliIHtcclxuICAgIHByb3RlY3RlZCBfdGVtcGxhdGVzOiBSZWNvcmQ8c3RyaW5nLCBJUHJvZ3JhbUluZm8+ID0ge307XHJcbiAgICBwcm90ZWN0ZWQgX3BpcGVsaW5lTGF5b3V0czogUmVjb3JkPHN0cmluZywgSVBpcGVsaW5lTGF5b3V0SW5mbz4gPSB7fTtcclxuICAgIHByb3RlY3RlZCBfY2FjaGU6IFJlY29yZDxzdHJpbmcsIFNoYWRlckhhbmRsZT4gPSB7fTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5qC55o2uIGVmZmVjdCDkv6Hmga/ms6jlhowgc2hhZGVyIOaooeadv+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGVmaW5lIChwcm9nOiBJU2hhZGVySW5mbykge1xyXG4gICAgICAgIGNvbnN0IGN1clRtcGwgPSB0aGlzLl90ZW1wbGF0ZXNbcHJvZy5uYW1lXTtcclxuICAgICAgICBpZiAoY3VyVG1wbCAmJiBjdXJUbXBsLmhhc2ggPT09IHByb2cuaGFzaCkgeyByZXR1cm47IH1cclxuICAgICAgICBjb25zdCB0bXBsID0gT2JqZWN0LmFzc2lnbih7fSwgcHJvZykgYXMgSVByb2dyYW1JbmZvO1xyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBvcHRpb24gbWFzayBvZmZzZXRcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRtcGwuZGVmaW5lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBkZWYgPSB0bXBsLmRlZmluZXNbaV07XHJcbiAgICAgICAgICAgIGxldCBjbnQgPSAxO1xyXG4gICAgICAgICAgICBpZiAoZGVmLnR5cGUgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByYW5nZSA9IGRlZi5yYW5nZSE7XHJcbiAgICAgICAgICAgICAgICBjbnQgPSBnZXRCaXRDb3VudChyYW5nZVsxXSAtIHJhbmdlWzBdICsgMSk7IC8vIGluY2x1c2l2ZSBvbiBib3RoIGVuZHNcclxuICAgICAgICAgICAgICAgIGRlZi5fbWFwID0gKHZhbHVlOiBudW1iZXIpID0+IHZhbHVlIC0gcmFuZ2VbMF07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVmLnR5cGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICBjbnQgPSBnZXRCaXRDb3VudChkZWYub3B0aW9ucyEubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIGRlZi5fbWFwID0gKHZhbHVlOiBhbnkpID0+IE1hdGgubWF4KDAsIGRlZi5vcHRpb25zIS5maW5kSW5kZXgoKHMpID0+IHMgPT09IHZhbHVlKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVmLnR5cGUgPT09ICdib29sZWFuJykge1xyXG4gICAgICAgICAgICAgICAgZGVmLl9tYXAgPSAodmFsdWU6IGFueSkgPT4gdmFsdWUgPyAxIDogMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWYuX29mZnNldCA9IG9mZnNldDtcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IGNudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9mZnNldCA+IDMxKSB7IHRtcGwudWJlciA9IHRydWU7IH1cclxuXHJcbiAgICAgICAgLy8gY2FjaGUgbWF0ZXJpYWwtc3BlY2lmaWMgZGVzY3JpcHRvciBzZXQgbGF5b3V0XHJcbiAgICAgICAgdG1wbC5zYW1wbGVyU3RhcnRCaW5kaW5nID0gdG1wbC5ibG9ja3MubGVuZ3RoO1xyXG4gICAgICAgIHRtcGwuZ2Z4QmxvY2tzID0gW107IHRtcGwuZ2Z4U2FtcGxlcnMgPSBbXTtcclxuICAgICAgICB0bXBsLmJpbmRpbmdzID0gW107IHRtcGwuYmxvY2tTaXplcyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG1wbC5ibG9ja3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0bXBsLmJsb2Nrc1tpXTtcclxuICAgICAgICAgICAgdG1wbC5ibG9ja1NpemVzLnB1c2goZ2V0U2l6ZShibG9jaykpO1xyXG4gICAgICAgICAgICB0bXBsLmJpbmRpbmdzLnB1c2gobmV3IEdGWERlc2NyaXB0b3JTZXRMYXlvdXRCaW5kaW5nKGJsb2NrLmRlc2NyaXB0b3JUeXBlIHx8IEdGWERlc2NyaXB0b3JUeXBlLlVOSUZPUk1fQlVGRkVSLCAxLCBibG9jay5zdGFnZUZsYWdzKSk7XHJcbiAgICAgICAgICAgIHRtcGwuZ2Z4QmxvY2tzLnB1c2gobmV3IEdGWFVuaWZvcm1CbG9jayhTZXRJbmRleC5NQVRFUklBTCwgYmxvY2suYmluZGluZywgYmxvY2submFtZSxcclxuICAgICAgICAgICAgICAgIGJsb2NrLm1lbWJlcnMubWFwKChtKSA9PiBuZXcgR0ZYVW5pZm9ybShtLm5hbWUsIG0udHlwZSwgbS5jb3VudCkpLCAxKSk7IC8vIGVmZmVjdCBjb21waWxlciBndWFyYW50ZWVzIGJsb2NrIGNvdW50ID0gMVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRtcGwuc2FtcGxlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgc2FtcGxlciA9IHRtcGwuc2FtcGxlcnNbaV07XHJcbiAgICAgICAgICAgIHRtcGwuYmluZGluZ3MucHVzaChuZXcgR0ZYRGVzY3JpcHRvclNldExheW91dEJpbmRpbmcoc2FtcGxlci5kZXNjcmlwdG9yVHlwZSB8fCBHRlhEZXNjcmlwdG9yVHlwZS5TQU1QTEVSLCBzYW1wbGVyLmNvdW50LCBzYW1wbGVyLnN0YWdlRmxhZ3MpKTtcclxuICAgICAgICAgICAgdG1wbC5nZnhTYW1wbGVycy5wdXNoKG5ldyBHRlhVbmlmb3JtU2FtcGxlcihTZXRJbmRleC5NQVRFUklBTCwgc2FtcGxlci5iaW5kaW5nLCBzYW1wbGVyLm5hbWUsIHNhbXBsZXIudHlwZSwgc2FtcGxlci5jb3VudCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0bXBsLmdmeEF0dHJpYnV0ZXMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRtcGwuYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBhdHRyID0gdG1wbC5hdHRyaWJ1dGVzW2ldO1xyXG4gICAgICAgICAgICB0bXBsLmdmeEF0dHJpYnV0ZXMucHVzaChuZXcgR0ZYQXR0cmlidXRlKGF0dHIubmFtZSwgYXR0ci5mb3JtYXQsIGF0dHIuaXNOb3JtYWxpemVkLCAwLCBhdHRyLmlzSW5zdGFuY2VkLCBhdHRyLmxvY2F0aW9uKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0bXBsLmdmeFN0YWdlcyA9IFtdO1xyXG4gICAgICAgIHRtcGwuZ2Z4U3RhZ2VzLnB1c2gobmV3IEdGWFNoYWRlclN0YWdlKEdGWFNoYWRlclN0YWdlRmxhZ0JpdC5WRVJURVgsICcnKSk7XHJcbiAgICAgICAgdG1wbC5nZnhTdGFnZXMucHVzaChuZXcgR0ZYU2hhZGVyU3RhZ2UoR0ZYU2hhZGVyU3RhZ2VGbGFnQml0LkZSQUdNRU5ULCAnJykpO1xyXG5cclxuICAgICAgICB0bXBsLmhhbmRsZU1hcCA9IGdlbkhhbmRsZXModG1wbCk7XHJcblxyXG4gICAgICAgIC8vIHN0b3JlIGl0XHJcbiAgICAgICAgdGhpcy5fdGVtcGxhdGVzW3Byb2cubmFtZV0gPSB0bXBsO1xyXG4gICAgICAgIHRoaXMuX3BpcGVsaW5lTGF5b3V0c1twcm9nLm5hbWVdID0geyBoUGlwZWxpbmVMYXlvdXQ6IE5VTExfSEFORExFLCBzZXRMYXlvdXRzOiBbXSB9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRUZW1wbGF0ZSAobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlc1tuYW1lXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UGlwZWxpbmVMYXlvdXQgKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9waXBlbGluZUxheW91dHNbbmFtZV07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIERvZXMgdGhpcyBsaWJyYXJ5IGhhcyB0aGUgc3BlY2lmaWVkIHByb2dyYW0/XHJcbiAgICAgKiBAemhcclxuICAgICAqIOW9k+WJjeaYr+WQpuacieW3suazqOWGjOeahOaMh+WumuWQjeWtl+eahCBzaGFkZXLvvJ9cclxuICAgICAqIEBwYXJhbSBuYW1lIOebruaghyBzaGFkZXIg5ZCNXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBoYXNQcm9ncmFtIChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGVtcGxhdGVzW25hbWVdICE9PSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOagueaNriBzaGFkZXIg5ZCN5ZKM6aKE5aSE55CG5a6P5YiX6KGo6I635Y+WIHNoYWRlciBrZXnjgIJcclxuICAgICAqIEBwYXJhbSBuYW1lIOebruaghyBzaGFkZXIg5ZCNXHJcbiAgICAgKiBAcGFyYW0gZGVmaW5lcyDnm67moIfpooTlpITnkIblro/liJfooahcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEtleSAobmFtZTogc3RyaW5nLCBkZWZpbmVzOiBNYWNyb1JlY29yZCkge1xyXG4gICAgICAgIGNvbnN0IHRtcGwgPSB0aGlzLl90ZW1wbGF0ZXNbbmFtZV07XHJcbiAgICAgICAgY29uc3QgdG1wbERlZnMgPSB0bXBsLmRlZmluZXM7XHJcbiAgICAgICAgaWYgKHRtcGwudWJlcikge1xyXG4gICAgICAgICAgICBsZXQga2V5ID0gJyc7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG1wbERlZnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRtcGxEZWYgPSB0bXBsRGVmc1tpXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZGVmaW5lc1t0bXBsRGVmLm5hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF2YWx1ZSB8fCAhdG1wbERlZi5fbWFwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXBwZWQgPSB0bXBsRGVmLl9tYXAodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gdG1wbERlZi5fb2Zmc2V0O1xyXG4gICAgICAgICAgICAgICAga2V5ICs9IG9mZnNldCArIChtYXBwZWQgKyAnfCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBrZXkgKyB0bXBsLmhhc2g7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGtleSA9IDA7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG1wbERlZnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRtcGxEZWYgPSB0bXBsRGVmc1tpXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZGVmaW5lc1t0bXBsRGVmLm5hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF2YWx1ZSB8fCAhdG1wbERlZi5fbWFwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXBwZWQgPSB0bXBsRGVmLl9tYXAodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gdG1wbERlZi5fb2Zmc2V0O1xyXG4gICAgICAgICAgICAgICAga2V5IHw9IG1hcHBlZCA8PCBvZmZzZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGAke2tleS50b1N0cmluZygxNil9fCR7dG1wbC5oYXNofWA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDplIDmr4HmiYDmnInlrozlhajmu6HotrPmjIflrprpooTlpITnkIblro/nibnlvoHnmoQgc2hhZGVyIOWunuS+i+OAglxyXG4gICAgICogQHBhcmFtIGRlZmluZXMg55So5LqO562b6YCJ55qE6aKE5aSE55CG5a6P5YiX6KGoXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZXN0cm95U2hhZGVyQnlEZWZpbmVzIChkZWZpbmVzOiBNYWNyb1JlY29yZCkge1xyXG4gICAgICAgIGNvbnN0IG5hbWVzID0gT2JqZWN0LmtleXMoZGVmaW5lcyk7IGlmICghbmFtZXMubGVuZ3RoKSB7IHJldHVybjsgfVxyXG4gICAgICAgIGNvbnN0IHJlZ2V4ZXMgPSBuYW1lcy5tYXAoKGN1cikgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdmFsID0gZGVmaW5lc1tjdXJdO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ2Jvb2xlYW4nKSB7IHZhbCA9IHZhbCA/ICcxJyA6ICcwJzsgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChjdXIgKyB2YWwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLl9jYWNoZSkuZmlsdGVyKChrKSA9PiByZWdleGVzLmV2ZXJ5KChyZSkgPT4gcmUudGVzdChTaGFkZXJQb29sLmdldCh0aGlzLl9jYWNoZVtrXSkubmFtZSkpKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgayA9IGtleXNbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IHByb2cgPSBTaGFkZXJQb29sLmdldCh0aGlzLl9jYWNoZVtrXSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBkZXN0cm95ZWQgc2hhZGVyICR7cHJvZy5uYW1lfWApO1xyXG4gICAgICAgICAgICBwcm9nLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2NhY2hlW2tdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5oyH5a6aIHNoYWRlciDnmoTmuLLmn5PotYTmupDlrp7kvotcclxuICAgICAqIEBwYXJhbSBkZXZpY2Ug5riy5p+T6K6+5aSHIFtbR0ZYRGV2aWNlXV1cclxuICAgICAqIEBwYXJhbSBuYW1lIHNoYWRlciDlkI3lrZdcclxuICAgICAqIEBwYXJhbSBkZWZpbmVzIOmihOWkhOeQhuWuj+WIl+ihqFxyXG4gICAgICogQHBhcmFtIHBpcGVsaW5lIOWunumZhea4suafk+WRveS7pOaJp+ihjOaXtuaJgOWxnueahCBbW1JlbmRlclBpcGVsaW5lXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEdGWFNoYWRlciAoZGV2aWNlOiBHRlhEZXZpY2UsIG5hbWU6IHN0cmluZywgZGVmaW5lczogTWFjcm9SZWNvcmQsIHBpcGVsaW5lOiBSZW5kZXJQaXBlbGluZSwga2V5Pzogc3RyaW5nKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihkZWZpbmVzLCBwaXBlbGluZS5tYWNyb3MpO1xyXG4gICAgICAgIGlmICgha2V5KSBrZXkgPSB0aGlzLmdldEtleShuYW1lLCBkZWZpbmVzKTtcclxuICAgICAgICBjb25zdCByZXMgPSB0aGlzLl9jYWNoZVtrZXldO1xyXG4gICAgICAgIGlmIChyZXMpIHsgcmV0dXJuIHJlczsgfVxyXG5cclxuICAgICAgICBjb25zdCB0bXBsID0gdGhpcy5fdGVtcGxhdGVzW25hbWVdO1xyXG4gICAgICAgIGNvbnN0IGxheW91dCA9IHRoaXMuX3BpcGVsaW5lTGF5b3V0c1tuYW1lXTtcclxuXHJcbiAgICAgICAgaWYgKCFsYXlvdXQuaFBpcGVsaW5lTGF5b3V0KSB7XHJcbiAgICAgICAgICAgIGluc2VydEJ1aWx0aW5CaW5kaW5ncyh0bXBsLCBsb2NhbERlc2NyaXB0b3JTZXRMYXlvdXQsICdsb2NhbHMnKTtcclxuICAgICAgICAgICAgaW5zZXJ0QnVpbHRpbkJpbmRpbmdzKHRtcGwsIGdsb2JhbERlc2NyaXB0b3JTZXRMYXlvdXQsICdnbG9iYWxzJyk7XHJcbiAgICAgICAgICAgIGxheW91dC5zZXRMYXlvdXRzW1NldEluZGV4LkdMT0JBTF0gPSBwaXBlbGluZS5kZXNjcmlwdG9yU2V0TGF5b3V0O1xyXG4gICAgICAgICAgICAvLyBtYXRlcmlhbCBzZXQgbGF5b3V0IHNob3VsZCBhbHJlYWR5IGJlZW4gY3JlYXRlZCBpbiBwYXNzLCBidXQgaWYgbm90XHJcbiAgICAgICAgICAgIC8vIChsaWtlIHdoZW4gdGhlIHNhbWUgc2hhZGVyIGlzIG92ZXJyaWRlbikgd2UgY3JlYXRlIGl0IGFnYWluIGhlcmVcclxuICAgICAgICAgICAgaWYgKCFsYXlvdXQuc2V0TGF5b3V0c1tTZXRJbmRleC5NQVRFUklBTF0pIHtcclxuICAgICAgICAgICAgICAgIF9kc0xheW91dEluZm8uYmluZGluZ3MgPSB0bXBsLmJpbmRpbmdzO1xyXG4gICAgICAgICAgICAgICAgbGF5b3V0LnNldExheW91dHNbU2V0SW5kZXguTUFURVJJQUxdID0gZGV2aWNlLmNyZWF0ZURlc2NyaXB0b3JTZXRMYXlvdXQoX2RzTGF5b3V0SW5mbyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX2RzTGF5b3V0SW5mby5iaW5kaW5ncyA9IGxvY2FsRGVzY3JpcHRvclNldExheW91dC5iaW5kaW5ncztcclxuICAgICAgICAgICAgbGF5b3V0LnNldExheW91dHNbU2V0SW5kZXguTE9DQUxdID0gX2RzTGF5b3V0ID0gX2RzTGF5b3V0IHx8IGRldmljZS5jcmVhdGVEZXNjcmlwdG9yU2V0TGF5b3V0KF9kc0xheW91dEluZm8pO1xyXG4gICAgICAgICAgICBsYXlvdXQuaFBpcGVsaW5lTGF5b3V0ID0gUGlwZWxpbmVMYXlvdXRQb29sLmFsbG9jKGRldmljZSwgbmV3IEdGWFBpcGVsaW5lTGF5b3V0SW5mbyhsYXlvdXQuc2V0TGF5b3V0cykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbWFjcm9BcnJheSA9IHByZXBhcmVEZWZpbmVzKGRlZmluZXMsIHRtcGwuZGVmaW5lcyk7XHJcbiAgICAgICAgY29uc3QgcHJlZml4ID0gbWFjcm9BcnJheS5yZWR1Y2UoKGFjYywgY3VyKSA9PiBgJHthY2N9I2RlZmluZSAke2N1ci5uYW1lfSAke2N1ci52YWx1ZX1cXG5gLCAnJykgKyAnXFxuJztcclxuXHJcbiAgICAgICAgbGV0IHNyYyA9IHRtcGwuZ2xzbDM7XHJcbiAgICAgICAgc3dpdGNoIChkZXZpY2UuZ2Z4QVBJKSB7XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYQVBJLkdMRVMyOlxyXG4gICAgICAgICAgICBjYXNlIEdGWEFQSS5XRUJHTDogc3JjID0gdG1wbC5nbHNsMTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYQVBJLkdMRVMzOlxyXG4gICAgICAgICAgICBjYXNlIEdGWEFQSS5XRUJHTDI6IHNyYyA9IHRtcGwuZ2xzbDM7IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEdGWEFQSS5WVUxLQU46XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYQVBJLk1FVEFMOiBzcmMgPSB0bXBsLmdsc2w0OyBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDogY29uc29sZS5lcnJvcignSW52YWxpZCBHRlggQVBJIScpOyBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdG1wbC5nZnhTdGFnZXNbMF0uc291cmNlID0gcHJlZml4ICsgc3JjLnZlcnQ7XHJcbiAgICAgICAgdG1wbC5nZnhTdGFnZXNbMV0uc291cmNlID0gcHJlZml4ICsgc3JjLmZyYWc7XHJcblxyXG4gICAgICAgIC8vIHN0cmlwIG91dCB0aGUgYWN0aXZlIGF0dHJpYnV0ZXMgb25seSwgaW5zdGFuY2luZyBkZXBlbmQgb24gdGhpc1xyXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBnZXRBY3RpdmVBdHRyaWJ1dGVzKHRtcGwsIGRlZmluZXMpO1xyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZU5hbWUgPSBnZXRTaGFkZXJJbnN0YW5jZU5hbWUobmFtZSwgbWFjcm9BcnJheSk7XHJcbiAgICAgICAgY29uc3Qgc2hhZGVySW5mbyA9IG5ldyBHRlhTaGFkZXJJbmZvKGluc3RhbmNlTmFtZSwgdG1wbC5nZnhTdGFnZXMsIGF0dHJpYnV0ZXMsIHRtcGwuZ2Z4QmxvY2tzLCB0bXBsLmdmeFNhbXBsZXJzKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY2FjaGVba2V5XSA9IFNoYWRlclBvb2wuYWxsb2MoZGV2aWNlLCBzaGFkZXJJbmZvKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHByb2dyYW1MaWIgPSBuZXcgUHJvZ3JhbUxpYigpO1xyXG5sZWdhY3lDQy5wcm9ncmFtTGliID0gcHJvZ3JhbUxpYjtcclxuIl19