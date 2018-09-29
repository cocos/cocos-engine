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
import { ccclass, property } from "../../core/data/class-decorator";
import Asset from "../../assets/CCAsset";
import renderer from "../../renderer";

class AbstractEffect extends Asset {
    /**
     * @type {Object[]}
     */
    _techniques = [];

    /**
     * @type {Object}
     */
    _properties = {};

    /**
     * @type {Object[]}
     */
    _defines = [];

    /**
     * @type {Object[]}
     */
    _dependencies = [];

    /**
     * @param {Object[]}
     */
    set techniques(val) {
        this._techniques = val;
    }

    /**
     * @return {Object[]}
     */
    get techniques() {
        return this._techniques;
    }

    /**
     * @param {Object} val
     */
    set properties(val) {
        this._properties = val;
    }

    /**
     * @return {Object}
     */
    get properties() {
        return this._properties;
    }

    /**
     * @param {Object[]}}
     */
    set defines(val) {
        this._defines = val;
    }

    /**
     * @return {Object[]}}
     */
    get defines() {
        return this._defines;
    }

    /**
     * @param {Object[]} val
     */
    set dependencies(val) {
        this._dependencies = val;
    }

    /**
     * @return {Object[]}
     */
    get dependencies() {
        return this._dependencies;
    }

    destroy() {
        // TODO: what should we do here ???
        return super.destroy();
    }
}

let toCamelCase = function(dashedString) {
    return dashedString
        .replace(/^\w/, c => c.toUpperCase())
        .replace(/-(\w)/g, (c, l) => l.toUpperCase());
};
let _serializeDefines = function(proto, defines) {
    defines.forEach(function(def) {
        property(proto, def.name, {
            initializer: () => { return def.value; }
        });
    });
};
let _type2value = {
    [renderer.PARAM_FLOAT]: v => { return v; },
    [renderer.PARAM_FLOAT2]: v => { return cc.v2(v[0], v[1]); },
    [renderer.PARAM_FLOAT3]: v => { return cc.v3(v[0], v[1], v[2]); },
    [renderer.PARAM_FLOAT4]: v => { return cc.v4(v[0], v[1], v[2], v[3]); },
    [renderer.PARAM_COLOR3]: v => { return cc.color(v[0], v[1], v[2]); },
    [renderer.PARAM_COLOR4]: v => { return cc.color(v[0], v[1], v[2], v[3]); },
    [renderer.PARAM_TEXTURE_2D]: v => { return new cc.Texture2D(v); },
    [renderer.PARAM_TEXTURE_CUBE]: v => { return new cc.Texture2D(v); } // TODO, cube map not ready yet
};
let _serializeTechniques = function(proto, techniques) {
    techniques.forEach(function(tech) {
        tech.params.forEach(function(param) {
            property(proto, param.name, {
                initializer: () => { return _type2value[param.type](param.value); }
            });
        });
    });
};
let EffectFactory = function(name, techniques, defines) {
    class Effect extends AbstractEffect {}
    _serializeTechniques(Effect.prototype, techniques);
    _serializeDefines(Effect.prototype, defines);
    return ccclass(`cc.Effect${toCamelCase(name)}`)(Effect);
};

cc.Effect = AbstractEffect;
export { AbstractEffect, EffectFactory };
