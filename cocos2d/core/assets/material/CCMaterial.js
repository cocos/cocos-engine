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
const EffectAsset = require('./CCEffectAsset');
const textureUtil = require('../../utils/texture-util');
const gfx = cc.gfx;

/**
 * !#en Material builtin name
 * !#zh 内置材质名字
 * @enum Material.BUILTIN_NAME
 */
const BUILTIN_NAME = cc.Enum({
    /**
     * @property SPRITE
     * @readonly
     * @type {String}
     */
    SPRITE: '2d-sprite',
    /**
     * @property GRAY_SPRITE
     * @readonly
     * @type {String}
     */
    GRAY_SPRITE: '2d-gray-sprite',
    /**
     * @property UNLIT
     * @readonly
     * @type {String}
     */
    UNLIT: 'unlit',
});


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
        this.loaded = false;
        this._manualHash = false;
        this._dirty = true;
        this._effect = null;
    },

    properties: {
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

        _effectAsset: {
            type: EffectAsset,
            default: null,
        },

        _techniqueIndex: 0,
        _techniqueData: Object,

        effectName: CC_EDITOR ? {
            get () {
                return this._effectAsset && this._effectAsset.name;
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

                this._effect = this._effectAsset.getInstantiatedEffect();
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
        /**
         * !#en Get built-in materials
         * !#zh 获取内置材质
         * @static
         * @method getBuiltinMaterial
         * @param {string} name 
         * @return {Material}
         */
        getBuiltinMaterial (name) {
            if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
                return new cc.Material();
            }
            return cc.assetManager.builtins.getBuiltin('material', 'builtin-' + name);
        },

        BUILTIN_NAME,
        
        /**
         * !#en Creates a Material with builtin Effect.
         * !#zh 使用内建 Effect 创建一个材质。
         * @static
         * @method createWithBuiltin
         * @param {string} effectName 
         * @param {number} [techniqueIndex] 
         * @return {Material}
         */
        createWithBuiltin (effectName, techniqueIndex = 0) {
            let effectAsset = cc.assetManager.builtins.getBuiltin('effect', 'builtin-' + effectName);
            return Material.create(effectAsset, techniqueIndex);
        },
        /**
         * !#en Creates a Material.
         * !#zh 创建一个材质。
         * @static
         * @method create
         * @param {EffectAsset} effectAsset 
         * @param {number} [techniqueIndex] 
         * @return {Material}
         */
        create (effectAsset, techniqueIndex = 0) {
            if (!effectAsset) return null;
            let material = new Material();
            material.effectAsset = effectAsset;
            material.techniqueIndex = techniqueIndex;
            return material;
        }
    },

    /**
     * !#en Sets the Material property
     * !#zh 设置材质的属性
     * @method setProperty
     * @param {string} name
     * @param {Object} val
     * @param {number} [passIdx]
     * @param {boolean} [directly]
     */
    setProperty (name, val, passIdx, directly) {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) return;

        if (typeof passIdx === 'string') {
            passIdx = parseInt(passIdx);
        }

        if (val instanceof Texture) {
            let isAlphaAtlas = val.isAlphaAtlas();
            let key = 'CC_USE_ALPHA_ATLAS_' + name;
            let def = this.getDefine(key, passIdx);
            if (isAlphaAtlas || def) {
                this.define(key, isAlphaAtlas);
            }
            if (!val.loaded) {
                cc.assetManager.postLoadNative(val);
            }
        }

        this._effect.setProperty(name, val, passIdx, directly);
    },

    /**
     * !#en Gets the Material property.
     * !#zh 获取材质的属性。
     * @method getProperty
     * @param {string} name 
     * @param {number} passIdx 
     * @return {Object}
     */
    getProperty (name, passIdx) {
        if (typeof passIdx === 'string') {
            passIdx = parseInt(passIdx);
        }
        return this._effect.getProperty(name, passIdx);
    },

    /**
     * !#en Sets the Material define.
     * !#zh 设置材质的宏定义。
     * @method define
     * @param {string} name
     * @param {boolean|number} val
     * @param {number} [passIdx]
     * @param {boolean} [force]
     */
    define (name, val, passIdx, force) {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) return;

        if (typeof passIdx === 'string') {
            passIdx = parseInt(passIdx);
        }
        this._effect.define(name, val, passIdx, force);
    },

    /**
     * !#en Gets the Material define.
     * !#zh 获取材质的宏定义。
     * @method getDefine
     * @param {string} name 
     * @param {number} [passIdx] 
     * @return {boolean|number}
     */
    getDefine (name, passIdx) {
        if (typeof passIdx === 'string') {
            passIdx = parseInt(passIdx);
        }
        return this._effect.getDefine(name, passIdx);
    },

    /**
     * !#en Sets the Material cull mode.
     * !#zh 设置材质的裁减模式。
     * @method setCullMode
     * @param {number} cullMode 
     * @param {number} passIdx 
     */
    setCullMode (cullMode = gfx.CULL_BACK, passIdx) {
        this._effect.setCullMode(cullMode, passIdx);
    },

    /**
     * !#en Sets the Material depth states.
     * !#zh 设置材质的深度渲染状态。
     * @method setDepth
     * @param {boolean} depthTest 
     * @param {boolean} depthWrite 
     * @param {number} depthFunc 
     * @param {number} passIdx 
     */
    setDepth (
        depthTest = false,
        depthWrite = false,
        depthFunc = gfx.DS_FUNC_LESS,
        passIdx
    ) {
        this._effect.setDepth(depthTest, depthWrite, depthFunc, passIdx);
    },

    /**
     * !#en Sets the Material blend states.
     * !#zh 设置材质的混合渲染状态。
     * @method setBlend
     * @param {boolean} enabled 
     * @param {number} blendEq 
     * @param {number} blendSrc 
     * @param {number} blendDst 
     * @param {number} blendAlphaEq 
     * @param {number} blendSrcAlpha 
     * @param {number} blendDstAlpha 
     * @param {number} blendColor 
     * @param {number} passIdx 
     */
    setBlend (
        enabled = false,
        blendEq = gfx.BLEND_FUNC_ADD,
        blendSrc = gfx.BLEND_SRC_ALPHA,
        blendDst = gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        blendAlphaEq = gfx.BLEND_FUNC_ADD,
        blendSrcAlpha = gfx.BLEND_SRC_ALPHA,
        blendDstAlpha = gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        blendColor = 0xffffffff,
        passIdx
    ) {
        this._effect.setBlend(enabled, blendEq, blendSrc, blendDst, blendAlphaEq, blendSrcAlpha, blendDstAlpha, blendColor, passIdx);
    },

    /**
     * !#en Sets whether enable the stencil test.
     * !#zh 设置是否开启模板测试。
     * @method setStencilEnabled
     * @param {number} stencilTest 
     * @param {number} passIdx 
     */
    setStencilEnabled (stencilTest = gfx.STENCIL_INHERIT, passIdx) {
        this._effect.setStencilEnabled(stencilTest, passIdx);
    },

    /**
     * !#en Sets the Material stencil render states.
     * !#zh 设置材质的模板测试渲染参数。
     * @method setStencil
     * @param {number} stencilTest 
     * @param {number} stencilFunc 
     * @param {number} stencilRef 
     * @param {number} stencilMask 
     * @param {number} stencilFailOp 
     * @param {number} stencilZFailOp 
     * @param {number} stencilZPassOp 
     * @param {number} stencilWriteMask 
     * @param {number} passIdx 
     */
    setStencil (
        stencilTest = gfx.STENCIL_INHERIT,
        stencilFunc = gfx.DS_FUNC_ALWAYS,
        stencilRef = 0,
        stencilMask = 0xff,
        stencilFailOp = gfx.STENCIL_OP_KEEP,
        stencilZFailOp = gfx.STENCIL_OP_KEEP,
        stencilZPassOp = gfx.STENCIL_OP_KEEP,
        stencilWriteMask = 0xff,
        passIdx
    ) {
        this._effect.setStencil(stencilTest, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask, passIdx);
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

        if (this._techniqueIndex) {
            this._effect.switchTechnique(this._techniqueIndex);
        }

        this._techniqueData = this._techniqueData || {};

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
