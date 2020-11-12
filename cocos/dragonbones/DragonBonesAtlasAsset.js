/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

/**
 * @module dragonBones
 */
let ArmatureCache = !CC_JSB && require('./ArmatureCache').sharedCache;

/**
 * !#en The skeleton atlas data of dragonBones.
 * !#zh dragonBones 的骨骼纹理数据。
 * @class DragonBonesAtlasAsset
 * @extends Asset
 */
var DragonBonesAtlasAsset = cc.Class({
    name: 'dragonBones.DragonBonesAtlasAsset',
    extends: cc.Asset,

    ctor () {
        this._clear();
    },

    properties: {
        _atlasJson : '',

        /**
         * @property {string} atlasJson
         */
        atlasJson: {
            get: function () {
                return this._atlasJson;
            },
            set: function (value) {
                this._atlasJson = value;
                this._atlasJsonData = JSON.parse(this.atlasJson);
                this._clear();
            }
        },

        _texture: {
            default: null,
            type: cc.Texture2D,
            formerlySerializedAs: 'texture'
        },

        /**
         * @property {Texture2D} texture
         */
        texture: {
            get () {
                return this._texture;
            },
            set (value) {
                this._texture = value;
                this._clear();
            }
        },

        _textureAtlasData: null,
    },

    statics: {
        preventDeferredLoadDependents: true
    },

    createNode: CC_EDITOR &&  function (callback) {
        var node = new cc.Node(this.name);
        var armatureDisplay = node.addComponent(dragonBones.ArmatureDisplay);
        armatureDisplay.dragonAtlasAsset = this;

        return callback(null, node);
    },

    init (factory) {
        this._factory = factory;

        if (!this._atlasJsonData) {
            this._atlasJsonData = JSON.parse(this.atlasJson);
        }
        let atlasJsonObj = this._atlasJsonData;

        // If create by manual, uuid is empty.
        this._uuid = this._uuid || atlasJsonObj.name;

        if (this._textureAtlasData) {
            factory.addTextureAtlasData(this._textureAtlasData, this._uuid);
        }
        else {
            this._textureAtlasData = factory.parseTextureAtlasData(atlasJsonObj, this.texture, this._uuid);
        }
    },

    _clear () {
        if (CC_JSB) return;
        if (this._factory) {
            ArmatureCache.resetArmature(this._uuid);
            this._factory.removeTextureAtlasData(this._uuid, true);
            this._factory.removeDragonBonesDataByUUID(this._uuid, true);
        }
        this._textureAtlasData = null;
    },

    destroy () {
        this._clear();
        this._super();
    },
});

dragonBones.DragonBonesAtlasAsset = module.exports = DragonBonesAtlasAsset;
