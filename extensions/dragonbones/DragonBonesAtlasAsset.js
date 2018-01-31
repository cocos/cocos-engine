/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji reserves all rights not expressly granted to you.

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
        this.reset();
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
                this.reset();
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
                this.reset();
            }
        },
    },

    statics: {
        preventDeferredLoadDependents: true
    },

    reset () {
        this._textureAtlasData = null;  // instance of CCTextureAtlasData
    },

    createNode: CC_EDITOR &&  function (callback) {
        var node = new cc.Node(this.name);
        var armatureDisplay = node.addComponent(dragonBones.ArmatureDisplay);
        armatureDisplay.dragonAtlasAsset = this;

        return callback(null, node);
    },

    init (factory) {
        if (this._textureAtlasData) {
            cc.log('Has textureAtlasData');
            factory.addTextureAtlasData(this._textureAtlasData);
        }
        else {
            this._textureAtlasData = factory.parseTextureAtlasData(this.atlasJson, this.texture);
        }
        //// solve the error effect of DragonBones when re-enter an auto-released scene (#5053)
        // var atlasName = atlasJsonObj.name;
        // var atlasDataList = factory.getTextureAtlasData(atlasName);
        // if (atlasDataList && atlasDataList.length > 0) {
        //     var texturePath = this.texture && this.texture.url;
        //     for (var idx in atlasDataList) {
        //         var data = atlasDataList[idx];
        //         if (data && data.texture && data.texture.url === texturePath) {
        //             // found same named atlas, renew texture
        //             data.texture = this.texture;
        //             return;
        //         }
        //     }
        // }
    },

    destroy () {
        var useGlobalFactory = !CC_JSB;
        if (useGlobalFactory && this._textureAtlasData) {
            var factory = dragonBones.CCFactory.getFactory();
            // If the texture still referenced by any DragonBonesData in the factory,
            // remember to remove them at the same time!
            var name = this._textureAtlasData.name;
            factory.removeTextureAtlasData(name, true);
            factory.removeDragonBonesData(name, true);
        }
        this._super();
    },
});

dragonBones.DragonBonesAtlasAsset = module.exports = DragonBonesAtlasAsset;
