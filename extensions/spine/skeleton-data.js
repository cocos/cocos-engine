/****************************************************************************
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
 * @module sp
 */
let SkeletonCache = !CC_JSB && require('./skeleton-cache').sharedCache;

/**
 * !#en The skeleton data of spine.
 * !#zh Spine 的 骨骼数据。
 * @class SkeletonData
 * @extends Asset
 */
var SkeletonData = cc.Class({
    name: 'sp.SkeletonData',
    extends: cc.Asset,

    ctor: function () {
        this.reset();
    },

    properties: {
        _skeletonJson: null,

        // use by jsb
        skeletonJsonStr: {
            get: function () {
                if (this._skeletonJson) {
                    return JSON.stringify(this._skeletonJson);
                } else {
                    return "";
                }
            }
        },

        /**
         * !#en See http://en.esotericsoftware.com/spine-json-format
         * !#zh 可查看 Spine 官方文档 http://zh.esotericsoftware.com/spine-json-format
         * @property {Object} skeletonJson
         */
        skeletonJson: {
            get: function () {
                return this._skeletonJson;
            },
            set: function (value) {
                if (typeof(value) == "string") {
                    this._skeletonJson = JSON.parse(value);
                } else {
                    this._skeletonJson = value;
                }
                // If create by manual, uuid is empty.
                if (!this._uuid && value.skeleton) {
                    this._uuid = value.skeleton.hash;
                }
                this.reset();
            }
        },

        _atlasText: "",

        /**
         * @property {String} atlasText
         */
        atlasText: {
            get: function () {
                return this._atlasText;
            },
            set: function (value) {
                this._atlasText = value;
                this.reset();
            }
        },

        /**
         * @property {Texture2D[]} textures
         */
        textures: {
            default: [],
            type: [cc.Texture2D]
        },

        /**
         * @property {String[]} textureNames
         * @private
         */
        textureNames: {
            default: [],
            type: [cc.String]
        },

        /**
         * !#en
         * A scale can be specified on the JSON or binary loader which will scale the bone positions,
         * image sizes, and animation translations.
         * This can be useful when using different sized images than were used when designing the skeleton
         * in Spine. For example, if using images that are half the size than were used in Spine,
         * a scale of 0.5 can be used. This is commonly used for games that can run with either low or high
         * resolution texture atlases.
         * see http://en.esotericsoftware.com/spine-using-runtimes#Scaling
         * !#zh 可查看 Spine 官方文档： http://zh.esotericsoftware.com/spine-using-runtimes#Scaling
         * @property {Number} scale
         */
        scale: 1
    },

    statics: {
        preventDeferredLoadDependents: true,
        preventPreloadNativeObject: true,
    },

    // PUBLIC

    createNode: CC_EDITOR && function (callback) {
        var node = new cc.Node(this.name);
        var skeleton = node.addComponent(sp.Skeleton);
        skeleton.skeletonData = this;

        return callback(null, node);
    },

    reset: function () {
        /**
         * @property {sp.spine.SkeletonData} _skeletonData
         * @private
         */
        this._skeletonCache = null;
        /**
         * @property {sp.spine.Atlas} _atlasCache
         * @private
         */
        this._atlasCache = null;
        if (CC_EDITOR) {
            this._skinsEnum = null;
            this._animsEnum = null;
        }
    },

    ensureTexturesLoaded (loaded, caller) {
        let textures = this.textures; 
        let texsLen = textures.length;
        if (texsLen == 0) {
            loaded.call(caller, false);
            return;
        }
        let loadedCount = 0;
        let loadedItem = function () {
            loadedCount++;
            if (loadedCount >= texsLen) {
                loaded && loaded.call(caller, true);
                loaded = null;
            }
        }
        for (let i = 0; i < texsLen; i++) {
            let tex = textures[i];
            if (tex.loaded) {
                loadedItem();
            } else {
                tex.once('load', loadedItem);
            }
        }
    },

    /**
     * !#en Get the included SkeletonData used in spine runtime.<br>
     * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.SkeletonData object.
     * !#zh 获取 Spine Runtime 使用的 SkeletonData。<br>
     * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.SkeletonData 对象。
     * @method getRuntimeData
     * @param {Boolean} [quiet=false]
     * @return {sp.spine.SkeletonData}
     */
    getRuntimeData: function (quiet) {
        if (this._skeletonCache) {
            return this._skeletonCache;
        }

        if ( !(this.textures && this.textures.length > 0) && this.textureNames && this.textureNames.length > 0 ) {
            if ( !quiet ) {
                cc.errorID(7507, this.name);
            }
            return null;
        }

        var atlas = this._getAtlas(quiet);
        if (! atlas) {
            return null;
        }
        var attachmentLoader = new sp.spine.AtlasAttachmentLoader(atlas);
        var jsonReader = new sp.spine.SkeletonJson(attachmentLoader);
        jsonReader.scale = this.scale;

        var json = this.skeletonJson;
        this._skeletonCache = jsonReader.readSkeletonData(json);
        atlas.dispose(jsonReader);

        return this._skeletonCache;
    },

    // EDITOR

    getSkinsEnum: CC_EDITOR && function () {
        if (this._skinsEnum) {
            return this._skinsEnum;
        }
        var sd = this.getRuntimeData(true);
        if (sd) {
            var skins = sd.skins;
            var enumDef = {};
            for (var i = 0; i < skins.length; i++) {
                var name = skins[i].name;
                enumDef[name] = i;
            }
            return this._skinsEnum = cc.Enum(enumDef);
        }
        return null;
    },

    getAnimsEnum: CC_EDITOR && function () {
        if (this._animsEnum) {
            return this._animsEnum;
        }
        var sd = this.getRuntimeData(true);
        if (sd) {
            var enumDef = { '<None>': 0 };
            var anims = sd.animations;
            for (var i = 0; i < anims.length; i++) {
                var name = anims[i].name;
                enumDef[name] = i + 1;
            }
            return this._animsEnum = cc.Enum(enumDef);
        }
        return null;
    },

    // PRIVATE

    _getTexture: function (line) {
        var names = this.textureNames;
        for (var i = 0; i < names.length; i++) {
            if (names[i] === line) {
                var texture = this.textures[i];
                var tex = new sp.SkeletonTexture({ width: texture.width, height: texture.height });
                tex.setRealTexture(texture);
                return tex;
            }
        }
        cc.errorID(7506, line);
        return null;
    },

    /**
     * @method _getAtlas
     * @param {boolean} [quiet=false]
     * @return {sp.spine.Atlas}
     * @private
     */
    _getAtlas: function (quiet) {
        if (this._atlasCache) {
            return this._atlasCache;
        }

        if ( !this.atlasText ) {
            if ( !quiet ) {
                cc.errorID(7508, this.name);
            }
            return null;
        }

        return this._atlasCache = new sp.spine.TextureAtlas(this.atlasText, this._getTexture.bind(this));
    },

    destroy () {
        if (!CC_JSB) {
            SkeletonCache.removeSkeleton(this._uuid);
        }
        this._super();
    },
});

sp.SkeletonData = module.exports = SkeletonData;
