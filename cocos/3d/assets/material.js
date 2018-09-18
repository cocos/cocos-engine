/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
// @ts-check
import { _decorator } from "../../core/data/index";
const { ccclass, property } = _decorator;
import Asset from "../../assets/CCAsset";
import Texture from './texture';
import renderer from "../../renderer";
import { vec2, vec3, vec4, color3, color4 } from '../../core/vmath/index';
import Effect from "./effect";

function _objArrayClone(val) {
  return val.map(obj => Object.assign({}, obj));
}

@ccclass
export default class Material extends Asset {
  /**
   * @type {Effect}
   */
  @property(Effect)
  _effect = null;

  /**
   * @type {Object}
   */
  @property
  _props = {};

  /**
   * @type {cc.renderer.Effect}
   */
  _effecInst = null;

  _updateEffectInst() {
    let techNum = this._effect.techniques.length;
    /** @type {cc.renderer.Technique[]} */
    let techniques = new Array(techNum);
    let props = {};

    for (let j = 0; j < techNum; ++j) {
      let tech = this._effect.techniques[j];

      for (let k = 0; k < tech.params.length; ++k) {
        let param = tech.params[k];
        switch (param.type) {
          case renderer.PARAM_FLOAT:
            props[param.name] = param.value;
            break;
          case renderer.PARAM_FLOAT2:
            props[param.name] = vec2.create(param.value[0], param.value[1]);
            break;
          case renderer.PARAM_FLOAT3:
            props[param.name] = vec3.create(param.value[0], param.value[1], param.value[2]);
            break;
          case renderer.PARAM_FLOAT4:
            props[param.name] = vec4.create(param.value[0], param.value[1], param.value[2], param.value[3]);
            break;
          case renderer.PARAM_COLOR3:
            props[param.name] = color3.create(param.value[0], param.value[1], param.value[2]);
            break;
          case renderer.PARAM_COLOR4:
            props[param.name] = color4.create(param.value[0], param.value[1], param.value[2], param.value[3]);
            break;
          case renderer.PARAM_TEXTURE_2D:
          case renderer.PARAM_TEXTURE_CUBE:
            props[param.name] = null;
            break;
          default:
            console.warn('unsupport param type in effect json.');
        }
      }

      let passNum = tech.passes.length;
      /** @type {cc.renderer.Pass[]} */
      let passes = new Array(passNum);
      for (let k = 0; k < passNum; ++k) {
        let pass = tech.passes[k];
        passes[k] = new renderer.Pass(pass.program);
        if (pass.depthTest !== undefined && pass.depthWrite !== undefined) {
          passes[k].setDepth(pass.depthTest, pass.depthWrite);
        }
        if (pass.cullMode !== undefined) {
          passes[k].setCullMode(pass.cullMode);
        }
        if (pass.blend === true) {
          passes[k].setBlend(pass.blendEq, pass.blendSrc, pass.blendDst, pass.blendAlphaEq, pass.blendSrcAlpha, pass.blendDstAlpha);
        }
      }

      techniques[j] = new renderer.Technique(tech.stages, tech.params, passes, tech.layer);
    }

    for (let name in props) {
      this._props[name] = props[name];
    }

    // reset material's props
    let defs = _objArrayClone(this._effect.defines);
    let deps = _objArrayClone(this._effect.dependencies);

    if (this._effectInst) {
      this._effectInst.clear();
      this._effectInst._techniques = techniques;
      this._effectInst._properties = props;
      this._effectInst._defines = defs;
      this._effectInst._dependencies = deps;
    } else {
      this._effectInst = new renderer.Effect(techniques, props, defs, deps);
    }
  }

  /**
   * @return {Effect}
   */
  get effect() {
    return this._effect;
  }

  /**
   * @param {Effect} val
   */
  set effect(val) {
    if (this._effect !== val) {
      this._effect = val;
      this._updateEffectInst();
    }
  }

  /**
   * @return {cc.renderer.Effect}
   */
  get effectInst() {
    return this._effectInst;
  }

  /**
   * 
   * @param {Material} mat 
   */
  copy(mat) {
    if (this._effect !== mat._effect) {
      this._effect = mat._effect;
      this._updateEffectInst();
    }

    this._effectInst._defines = _objArrayClone(mat._effectInst._defines);
    this._effectInst._dependencies = _objArrayClone(mat._effectInst._dependencies);
    for (let name in mat._props) {
      this.setProperty(name, mat._props[name]);
    }
  }

  /**
   * 
   * @param {string} name 
   * @param {*} val 
   */
  setProperty(name, val) {
    this._props[name] = val;

    if (val instanceof Texture) {
      this._effectInst.setProperty(name, val._texture);
    } else {
      this._effectInst.setProperty(name, val);
    }
  }

  /**
   * 
   * @param {string} name 
   * @param {*} val 
   */
  define(name, val) {
    this._effectInst.define(name, val);
  }

  destroy() {
    // TODO: what should we do here ???
    return super.destroy();
  }
}

cc.Material = Material;