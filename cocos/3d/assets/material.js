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
import { _decorator } from "../../core/data";
const { ccclass, property } = _decorator;
import Asset from "../../assets/CCAsset";
import Texture from '../../assets/CCTexture2D';
import renderer from "../../renderer";
import { vec2, vec3, vec4, color3, color4 } from '../../core/vmath';
import Effect from '../../renderer/core/effect';

function _objArrayClone(val) {
    return val.map(obj => Object.assign({}, obj));
}

@ccclass('cc.Material')
export default class Material extends Asset {
    /**
     * @type {cc.Effect}
     */
    @property(cc.Effect)
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
            this._effectInst = Effect.parseEffect(this._effect);
            let propCls = cc.js.getClassByName(Effect.getPropertyClassName(this._effect));
            this._props = propCls ? new propCls() : {}
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
            this._effecInst = Effect.parseEffect(this._effect);
        }

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

    _serialize() {
        // todo: this may be refactored for it is editor only
        return {
            effect: (this._effect && this._effect._uuid) || 'unknown',
            props: Editor.serialize(this._props),
        };
    }

    _deserialize(data, handle) {
        console.log(`try to deserialize material`);
        if (data.effect.indexOf('builtin-effect') !== -1) {
            this._effect = cc.game._builtins[data.effect];
            this._effecInst = Effect.parseEffect(this._effect);
            this._props = cc.deserialize(data.props);
        } else {
            // todo: add custom effect
            console.error('Cannot support custom effect now')
        }
    }

    static getInstantiatedMaterial(mat, rndCom) {
        if (mat._owner === rndCom) {
            return this;
        }
        else {
            let instance = new Material();
            instance.copy(mat);
            instance._native = mat._native + ' (Instance)';
            instance._owner = rndCom;
        }
    }
}

cc.Material = Material;
