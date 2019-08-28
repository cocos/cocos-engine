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
const EventTarget = require("../../event/event-target");

import Effect from '../../../renderer/core/effect';
import murmurhash2 from '../../../renderer/murmurhash2_gc';
import utils from './utils';

/**
 * !#en Material Asset.
 * !#zh 材质资源类。
 * @class Material
 * @extends Asset
 */
let Material = cc.Class({
    name: 'cc.Material',
    extends: Asset,
    mixins: [EventTarget],

    ctor () {
        this.loaded = false;
        this._manualHash = false;
        this._dirty = true;
        this._effect = null;
        this._owner = null;
        this._hash = 0;
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
                let effectAsset = cc.assetManager.builtins.getBuiltin('effect', val);
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
                this._effect = this._effectAsset.getInstantiatedEffect();;
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
        }
    },

    statics: {
        getBuiltinMaterial (name) {
            return cc.assetManager.builtins.getBuiltin('material', 'builtin-' + name);
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
                instance._uuid = mat._uuid;
                instance._owner = renderComponent;
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
                this._effect.setProperty(name, val);
                let format = val.getPixelFormat();
                if (format === PixelFormat.RGBA_ETC1 ||
                    format === PixelFormat.RGB_A_PVRTC_4BPPV1 ||
                    format === PixelFormat.RGB_A_PVRTC_2BPPV1) {
                    this.define('CC_USE_ALPHA_ATLAS_' + name.toUpperCase(), true);
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
        if (hash === undefined || hash === null) {
            hash = this.computeHash();
        } else {
            this._manualHash = true;
        }
        this._dirty = false;
        this._hash = hash;
        if (this._effect) {
            this._effect.updateHash(this._hash);
        }
    },

    computeHash () {
        let effect = this._effect;
        let hashStr = '';
        if (effect) {
            hashStr += utils.serializeDefines(effect._defines);
            hashStr += utils.serializeTechniques(effect._techniques);
            hashStr += utils.serializeUniforms(effect._properties);
        }
        return murmurhash2(hashStr, 666);
    },

    getHash () {
        if (!this._dirty) return this._hash;
        
        if (!this._manualHash) {
            this.updateHash();
        }

        this._dirty = false;
        return this._hash;
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
        this.loaded = true;
        this.emit("load");
    },
});

module.exports = cc.Material = Material;
