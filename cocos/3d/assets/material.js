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
import Effect from '../../renderer/core/effect';

@ccclass('cc.Material')
class Material extends Asset {
    /**
     * @type {string}
     */
    @property
    _effectName = '';

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
     * @type {Effect}
     */
    _effect = null;

    /**
     * @return {string}
     */
    get effectName() {
        return this._effectName;
    }

    /**
     * @param {string} val
     */
    set effectName(val) {
        if (this._effectName !== val) {
            this._effectName = val;
            const effectAsset = cc.game._builtins[val];
            if (!effectAsset) {
                console.warn(`no effect named '${val}' found`);
                return;
            }
            this._effect = Effect.parseEffect(effectAsset);
            let propCls = cc.js.getClassByName(Effect.getPropertyClassName(effectAsset));
            this._props = propCls ? new propCls() : {};
            let defCls = cc.js.getClassByName(Effect.getDefineClassName(effectAsset));
            this._defines = defCls ? new defCls() : {};
        }
    }

    /**
     * @return {Effect}
     */
    get effect() {
        return this._effect;
    }

    /**
     *
     * @param {Material} mat
     */
    copy(mat) {
        this.effectName = mat.effectName;

        Object.keys(mat._defines).forEach(name => {
            this.define(name, mat._defines[name]);
        });

        Object.keys(mat._props).forEach(name => {
            this.setProperty(name, mat._props[name]);
        });
    }

    /**
     *
     * @param {string} name
     * @param {*} val
     */
    setProperty(name, val) {
        this._props[name] = val;
        if (this._effect) {
            if (val instanceof Texture) {
                this._effect.setProperty(name, val._texture);
            } else {
                this._effect.setProperty(name, val);
            }
        }
    }

    /**
     *
     * @param {string} name
     * @param {*} val
     */
    define(name, val) {
        this._defines[name] = val;
        if (this._effect) {
            this._effect.define(name, val);
        }
    }

    _deserialize(data) {
        this.effectName = data._effectName;

        let defines = cc.deserialize(data._defines);
        Object.keys(defines).forEach(name => {
            this.define(name, defines[name]);
        });
        let props = cc.deserialize(data.props);
        Object.keys(props).forEach(name => {
            this.setProperty(name, props[name]);
        });
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

if (CC_EDITOR) {
    Material.prototype._serialize = function() {
        return {
            effectName: this._effectName,
            props: Editor.serialize(this._props),
            defines: Editor.serialize(this._defines)
        };
    };
}

export default Material;
cc.Material = Material;
