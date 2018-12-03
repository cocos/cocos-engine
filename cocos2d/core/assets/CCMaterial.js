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

const Asset = require('./CCAsset');
const Texture = require('./CCTexture2D');
const EffectAsset = require('./CCEffectAsset');

import computeHash from './utils/compute-hash';
import Effect from '../../renderer/effect';

let Material = cc.Class({
    name: 'cc.Material',
    extends: Asset,

    ctor () {
        this._effect = null;
    },

    properties: {
        _effectAsset: {
            type: EffectAsset,
            default: null,
        },
        _defines: {
            default: {},
            type: Object
        },
        _props: {
            default: {},
            type: Object
        },

        effectName: CC_EDITOR ? {
            get () {
                return this._effectAsset.name;
            },
            set (val) {
                let effectAsset = cc.Asset.getBuiltin('effect', val);
                if (!effectAsset) {
                    Editor.warn(`no effect named '${val}' found`);
                    return;
                }
                this.effectAsset = effectAsset;
            }
        } : undefined,

        effectAsset: {
            get () {
                return this._effectAsset;
            },
            set (asset) {
                this._effectAsset = asset;
                if (!asset) {
                    cc.error('Can not set an empty effect asset.');
                    return;
                }
                this._effect = Effect.parseEffect(asset.effect);
            }
        },

        effect: {
            get () {
                return this._effect;
            }
        }
    },

    statics: {
        getInstantiatedBuiltinMaterial(name) {
            let builtinMaterial = cc.Asset.getBuiltin('material', 'builtin-' + name);
            return Material.getInstantiatedMaterial(builtinMaterial, this);
        },
        getInstantiatedMaterial(mat, renderComponent) {
            if (mat._owner === renderComponent) {
                return mat;
            }
            else {
                let instance = new Material();
                instance.copy(mat);
                instance._native = mat._native + ' (Instance)';
                instance._owner = renderComponent;
                return instance;
            }
        }
    },

    /**
     *
     * @param {Material} mat
     */
    copy(mat) {
        this.effectAsset = mat.effectAsset;

        for (let name in mat._defines) {
            this.define(name, mat._defines[name]);
        }

        for (let name in mat._props) {
            this.setProperty(name, mat._props[name]);
        }
    },

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
            }
            else {
                this._effect.setProperty(name, val);
            }
        }
    },

    getProperty(name) {
        return this._props[name];
    },

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
    },

    getDefine(name) {
        return this._defines[name];
    },

    updateHash (val) {
        this._hash = val || computeHash(this);
    },

    onLoad () {
        this.effectAsset = this._effectAsset;
        if (!this._effect) return;
        
        for (let def in this._defines) {
            this._effect.define(def, this._defines[def]);
        }
        for (let prop in this._props) {
            this._effect.setProperty(prop, this._props[prop]);
        }
    },
});

module.exports = cc.Material = Material;
