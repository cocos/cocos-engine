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
import TextureBase from '../../assets/texture-base';
import Effect from '../../renderer/core/effect';
import { EffectAsset } from './effect-asset';

@ccclass('cc.Material')
class Material extends Asset {
    /**
     * @type {Object}
     */
    @property
    _defines = {};

    /**
     * @type {Object}
     */
    @property
    _props = {};

    /**
     * @type {EffectAsset}
     */
    @property(EffectAsset)
    _effectAsset = null;

    @property
    set effectAsset(val) {
        if (this.effectName !== val.name) this._setEffect(val);
    }
    get effectAsset() {
        return this._effectAsset;
    }

    // helper setter
    @property
    set effectName(val) {
        if (this.effectName !== val) this._setEffect(val);
    }
    get effectName() {
        return this._effectAsset ? this._effectAsset.name : '';
    }

    /**
     * @type {Effect}
     */
    _effect = null;

    /**
     * @type {Effect}
     */
    get effect() {
        return this._effect;
    }

    /**
     *
     * @param {Material} mat
     */
    copy(mat) {
        Object.assign(this._props, mat._props);
        Object.assign(this._defines, mat._defines);
        this._setEffect(mat.effectAsset);
        this._uuid = mat._uuid;
    }

    /**
     *
     * @param {string} name
     * @param {*} val
     */
    setProperty(name, val) {
        this._props[name] = val;
        if (this._effect) {
            if (val instanceof TextureBase) this._effect.setProperty(name, val._texture);
            else this._effect.setProperty(name, val);
        }
    }

    /**
     *
     * @param {string} name
     * @param {*} val
     */
    define(name, val) {
        this._defines[name] = val;
        if (this._effect) this._effect.define(name, val);
    }

    onLoaded() {
        this._setEffect(this.effectAsset);
    }

    _setEffect(val) {
        let effectAsset = val;
        if (typeof val === 'string' && !(effectAsset = cc.EffectAsset.get(val))) {
            console.warn(`no effect named '${val}' found`);
            return;
        }
        this._effectAsset = effectAsset;
        if (!effectAsset) return;
        this._effect = Effect.parseEffect(effectAsset, this._defines);
        for (let prop in this._props)
            this.setProperty(prop, this._props[prop]);
    }

    static getInstantiatedMaterial(mat, rndCom) {
        if (mat._owner === rndCom) {
            return mat;
        }
        else {
            let instance = new Material();
            instance.copy(mat);
            instance._native = mat._native + ' (Instance)';
            instance._owner = rndCom;
            return instance;
        }
    }
}

export default Material;
cc.Material = Material;
