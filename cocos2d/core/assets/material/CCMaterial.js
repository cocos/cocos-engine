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

let _effects = {};
let _instanceId = 0;

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
        this._uuid = _instanceId++;
    },

    properties: {
        _effectAsset: {
            type: EffectAsset,
            default: null,
        },

        // deprecated
        _defines: {
            default: undefined,
            type: Object
        },
        // deprecated
        _props: {
            default: undefined,
            type: Object
        },

        _techniqueIndex: 0,
        _techniqueData: Object,

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

                if (!_effects[this._uuid] || _effects[this._uuid]._asset != this._effectAsset) {
                    _effects[this._uuid] = this._effectAsset.getInstantiatedEffect();
                }
                this._effect = _effects[this._uuid];
            }
        },

        effect: {
            get () {
                return this._effect;
            }
        },

        techniqueIndex: {
            get () {
                return this._techniqueIndex;
            },
            set (v) {
                this._techniqueIndex = v;
                this._effect.switchTechnique(v);
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

    /**
     *
     * @param {string} name
     * @param {Object} val
     */
    setProperty (name, val, passIdx) {
        if (!this._effect) return;
        
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
                return;
            }
        }
        
        this._effect.setProperty(name, val, passIdx);
    },

    getProperty (name) {
        return this._effect.getProperty(name);
    },

    /**
     *
     * @param {string} name
     * @param {Boolean|Number} val
     */
    define (name, val, passIdx, force) {
        this._effect.define(name, val, passIdx, force);
    },

    getDefine (name, passIdx) {
        return this._effect.getDefine(name, passIdx);
    },

    clone () {
        let material = new cc.Material();
        material._uuid = this._uuid;
        material._effect = this._effect.clone();
        material._effectAsset = this._effectAsset;
        material._techniqueIndex = this._techniqueIndex;
        
        let datas = this._techniqueData;
        let newDatas = {};
        for (let index in datas) {
            let data = datas[index];
            if (!data) continue;
            let newData = {};
            if (data.props) {
                newData.props = {};
                for (let name in data.props) {
                    let value = data.props[name];
                    if (value.clone) {
                        value = value.clone();
                    }
                    newData.props[name] = value;
                }
            }
            if (data.defines) {
                newData.defines = Object.assign({}, data.defines);
            }
            newDatas[index] = newData;
        }
        material._techniqueData = newDatas;

        return material;
    },

    updateHash (hash) {
        this._manualHash = hash;
        this._effect && this._effect.updateHash(hash);
    },

    getHash () {
        return this._manualHash || (this._effect && this._effect.getHash());
    },

    _upgrade () {
        if (!this._props && !this._defines) return;
        let passDatas = this._techniqueData;
        let passes = this._effect.passes;
        for (let i = 0; i < passes.length; i++) {
            if (this._props) {
                for (let prop in this._props) {
                    if (passes[i].getProperty(prop) !== undefined) {
                        if (!passDatas[i]) {
                            passDatas[i] = {};
                        }
                        if (!passDatas[i].props) {
                            passDatas[i].props = {};
                        }
                        passDatas[i].props[prop] = this._props[prop];
                    }
                }
            }

            if (this._defines) {
                for (let def in this._defines) {
                    if (passes[i].getDefine(def) !== undefined) {
                        if (!passDatas[i]) {
                            passDatas[i] = {};
                        }
                        if (!passDatas[i].defines) {
                            passDatas[i].defines = {};
                        }
                        passDatas[i].defines[def] = this._defines[def];
                    }
                }
            }
        }

        this._props = undefined;
        this._defines = undefined;
    },

    onLoad () {
        this.effectAsset = this._effectAsset;
        if (!this._effect) return;

        if (this._techniqueIndex) {
            this._effect.switchTechnique(this._techniqueIndex);
        }

        this._techniqueData = this._techniqueData || {};

        this._upgrade();

        let passDatas = this._techniqueData;
        for (let index in passDatas) {
            index = parseInt(index);
            let passData = passDatas[index];
            if (!passData) continue;
            
            for (let def in passData.defines) {
                this.define(def, passData.defines[def], index);
            }
            for (let prop in passData.props) {
                this.setProperty(prop, passData.props[prop], index);
            }
        }

    },
});

export default Material;
cc.Material = Material;
