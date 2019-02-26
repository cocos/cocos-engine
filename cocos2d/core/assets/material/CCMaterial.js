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

const Asset = require('../CCAsset');
const Texture = require('../CCTexture2D');
const PixelFormat = Texture.PixelFormat;
const EffectAsset = require('../CCEffectAsset');

import Effect from '../../../renderer/core/effect';
import murmurhash2 from './murmurhash2_gc';
import utils from './utils';

let Material = cc.Class({
    name: 'cc.Material',
    extends: Asset,

    ctor () {
        this._dirty = true;
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
                let effectAsset = cc.AssetLibrary.getBuiltin('effect', val);
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
                this._effect = Effect.parseEffect(asset);
            }
        },

        effect: {
            get () {
                return this._effect;
            }
        }
    },

    statics: {
        getBuiltinMaterial (name) {
            return cc.AssetLibrary.getBuiltin('material', 'builtin-' + name);
        },
        getInstantiatedBuiltinMaterial (name, renderComponent) {
            let builtinMaterial = this.getBuiltinMaterial(name);
            return Material.getInstantiatedMaterial(builtinMaterial, renderComponent);
        },
        getInstantiatedMaterial (mat, renderComponent) {
            if (mat._owner === renderComponent) {
                return mat;
            }
            else {
                let instance = new Material();
                instance.copy(mat);
                instance._name = mat._name + ' (Instance)';
                instance._owner = renderComponent;
                instance._objFlags |= cc.Object.Flags.DontSave;
                return instance;
            }
        }
    },

    /**
     *
     * @param {Material} mat
     */
    copy (mat) {
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
     * @param {Object} val
     */
    setProperty (name, val, force) {
        if (this._props[name] === val && !force) return;
        this._props[name] = val;
        this._dirty = true;

        if (this._effect) {
            if (val instanceof Texture) {
                this._effect.setProperty(name, val.getImpl());
                if (val.getPixelFormat() === PixelFormat.RGBA_ETC1) {
                    this.define('_USE_ETC1_' + name.toUpperCase(), true);
                }
            }
            else {
                this._effect.setProperty(name, val);
            }
        }
    },

    getProperty (name) {
        return this._props[name];
    },

    /**
     *
     * @param {string} name
     * @param {Boolean|Number} val
     */
    define (name, val, force) {
        if (this._defines[name] === val && !force) return;
        this._defines[name] = val;
        this._dirty = true;

        if (this._effect) {
            this._effect.define(name, val);
        }
    },

    getDefine (name) {
        return this._defines[name];
    },

    setDirty (dirty) {
        this._dirty = dirty;
    },

    updateHash (hash) {
        this._dirty = false;
        this._hash = hash;
    },

    getHash () {
        if (!this._dirty) return this._hash;
        this._dirty = false;
        let effect = this._effect;

        let hashStr = '';
        if (effect) {
            hashStr += utils.serializeDefines(effect._defines);
            hashStr += utils.serializeTechniques(effect._techniques);
            hashStr += utils.serializeUniforms(effect._properties);
        }

        return this._hash = murmurhash2(hashStr, 666);
    },

    onLoad () {
        this.effectAsset = this._effectAsset;
        if (!this._effect) return;

        for (let def in this._defines) {
            this.define(def, this._defines[def], true);
        }
        for (let prop in this._props) {
            this.setProperty(prop, this._props[prop], true);
        }
    },
});

module.exports = cc.Material = Material;
