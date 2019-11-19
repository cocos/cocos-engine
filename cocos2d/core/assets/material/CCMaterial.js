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

const Asset = require('../CCAsset');
const Texture = require('../CCTexture2D');
const PixelFormat = Texture.PixelFormat;
const EffectAsset = require('../CCEffectAsset');
const textureUtil = require('../../utils/texture-util');

import materialPool from './material-pool';
import CustomProperties from './custom-properties';

/**
 * !#en Material Asset.
 * !#zh 材质资源类。
 * @class Material
 * @extends Asset
 */
let Material = cc.Class({
    name: 'cc.Material',
    extends: Asset,

    ctor () {
        this._manualHash = false;
        this._dirty = true;
        this._effect = null;
        this._owner = null;
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

        _techniqueName: '',

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
                if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
                    return;
                }

                this._effectAsset = asset;
                if (!asset) {
                    cc.error('Can not set an empty effect asset.');
                    return;
                }

                this._effect = this._effectAsset.getInstantiatedEffect();
            }
        },

        effect: {
            get () {
                return this._effect;
            }
        },

        owner: {
            get () {
                return this._owner;
            }
        },

        techniqueName: {
            get () {
                return this._techniqueName;
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
            if (!mat) return mat;
            if (mat._owner === renderComponent) {
                return mat;
            }
            else {
                return materialPool.get(mat, renderComponent);
            }
        }
    },

    setAsVariant (mat) {
        this._effect = new CustomProperties(mat.effect);
        this._effectAsset = mat._effectAsset;
    },

    /**
     *
     * @param {string} name
     * @param {Object} val
     */
    setProperty (name, val, force, passIdx) {
        if (this._props[name] === val && !force) return;
        this._props[name] = val;

        if (this._effect) {
            if (val instanceof Texture) {

                let format = val.getPixelFormat();
                if (format === PixelFormat.RGBA_ETC1 ||
                    format === PixelFormat.RGB_A_PVRTC_4BPPV1 ||
                    format === PixelFormat.RGB_A_PVRTC_2BPPV1) {
                    this.define('CC_USE_ALPHA_ATLAS_' + name.toUpperCase(), true);
                }

                function loaded () {
                    this._effect.setProperty(name, val, passIdx);
                }

                if (!val.loaded) {
                    val.once('load', loaded, this);
                    textureUtil.postLoadTexture(val);
                }
                else {
                    this._effect.setProperty(name, val, passIdx);
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
        this._effect && this._effect.define(name, val);
    },

    getDefine (name) {
        return this._defines[name];
    },

    updateHash (hash) {
        this._manualHash = hash;
        this._effect && this._effect.updateHash(hash);
    },

    getHash () {
        return this._manualHash || (this._effect && this._effect.getHash());
    },

    onLoad () {
        this.effectAsset = this._effectAsset;
        if (!this._effect) return;

        if (this._techniqueName) {
            this._effect.switchTechnique(this._techniqueName);
        }

        for (let def in this._defines) {
            this.define(def, this._defines[def], true);
        }
        for (let prop in this._props) {
            this.setProperty(prop, this._props[prop], true);
        }
    },
});

module.exports = cc.Material = Material;
