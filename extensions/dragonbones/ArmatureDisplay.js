/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const RenderComponent = require('../../cocos2d/core/components/CCRenderComponent');
const renderer = require('../../cocos2d/core/renderer');
const renderEngine = require('../../cocos2d/core/renderer/render-engine');
const RenderData = renderEngine.RenderData;
const SpriteMaterial = renderEngine.SpriteMaterial;

let EventTarget = require('../../cocos2d/core/event/event-target');

/**
 * @module dragonBones
 */

let DefaultArmaturesEnum = cc.Enum({ 'default': -1 });
let DefaultAnimsEnum = cc.Enum({ '<None>': 0 });

function setEnumAttr (obj, propName, enumDef) {
    cc.Class.attr(obj, propName, {
        type: 'Enum',
        enumList: cc.Enum.getList(enumDef)
    });
}

/**
 * !#en
 * The Armature Display of DragonBones <br/>
 * <br/>
 * (Armature Display has a reference to a DragonBonesAsset and stores the state for ArmatureDisplay instance,
 * which consists of the current pose's bone SRT, slot colors, and which slot attachments are visible. <br/>
 * Multiple Armature Display can use the same DragonBonesAsset which includes all animations, skins, and attachments.) <br/>
 * !#zh
 * DragonBones 骨骼动画 <br/>
 * <br/>
 * (Armature Display 具有对骨骼数据的引用并且存储了骨骼实例的状态，
 * 它由当前的骨骼动作，slot 颜色，和可见的 slot attachments 组成。<br/>
 * 多个 Armature Display 可以使用相同的骨骼数据，其中包括所有的动画，皮肤和 attachments。)<br/>
 *
 * @class ArmatureDisplay
 * @extends Component
 */
let ArmatureDisplay = cc.Class({
    name: 'dragonBones.ArmatureDisplay',
    extends: RenderComponent,
    mixins: [EventTarget],

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/DragonBones',
        //help: 'app://docs/html/components/spine.html', // TODO help document of dragonBones
    },
    
    properties: {
        _dragonBonesData: {
            default: null,
            type: dragonBones.DragonBonesData,
            serializable: false,
        },

        /**
         * !#en
         * The DragonBones data contains the armatures information (bind pose bones, slots, draw order,
         * attachments, skins, etc) and animations but does not hold any state.<br/>
         * Multiple ArmatureDisplay can share the same DragonBones data.
         * !#zh
         * 骨骼数据包含了骨骼信息（绑定骨骼动作，slots，渲染顺序，
         * attachments，皮肤等等）和动画但不持有任何状态。<br/>
         * 多个 ArmatureDisplay 可以共用相同的骨骼数据。
         * @property {DragonBonesAsset} dragonAsset
         */
        dragonAsset: {
            default: null,
            type: dragonBones.DragonBonesAsset,
            notify: function () {
                // parse the asset data
                this._parseDragonAsset();
                this._refresh();
                if (CC_EDITOR) {
                    this._defaultArmatureIndex = 0;
                    this._animationIndex = 0;
                }
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.dragon_bones_asset'
        },

        /**
         * !#en
         * The atlas asset for the DragonBones.
         * !#zh
         * 骨骼数据所需的 Atlas Texture 数据。
         * @property {DragonBonesAtlasAsset} dragonAtlasAsset
         */
        dragonAtlasAsset: {
            default: null,
            type: dragonBones.DragonBonesAtlasAsset,
            notify: function () {
                // parse the atlas asset data
                this._parseDragonAtlasAsset();
                this._buildArmature();
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.dragon_bones_atlas_asset'
        },

        _armatureName: '',
        /**
         * !#en The name of current armature.
         * !#zh 当前的 Armature 名称。
         * @property {String} armatureName
         */
        armatureName: {
            get: function () {
                return this._armatureName;
            },
            set: function (value) {
                this._armatureName = value;
                let animNames = this.getAnimationNames(this._armatureName);

                if (!this.animationName || animNames.indexOf(this.animationName) < 0) {
                    if (CC_EDITOR) {
                        this.animationName = animNames[0];
                    }
                    else {
                        // Not use default animation name at runtime
                        this.animationName = '';
                    }
                }
                this._refresh();
            },
            visible: false
        },

        _animationName: '',
        /**
         * !#en The name of current playing animation.
         * !#zh 当前播放的动画名称。
         * @property {String} animationName
         */
        animationName: {
            get: function () {
                return this._animationName;
            },
            set: function (value) {
                this._animationName = value;
            },
            visible: false
        },

        /**
         * @property {Number} _defaultArmatureIndex
         */
        _defaultArmatureIndex: {
            default: 0,
            notify: function () {
                let armatureName = '';
                if (this.dragonAsset) {
                    let armaturesEnum;
                    if (this.dragonAsset) {
                        armaturesEnum = this.dragonAsset.getArmatureEnum();
                    }
                    if (!armaturesEnum) {
                        return cc.errorID(7400, this.name);
                    }

                    armatureName = armaturesEnum[this._defaultArmatureIndex];
                }

                if (armatureName !== undefined) {
                    this.armatureName = armatureName;
                }
                else {
                    cc.errorID(7401, this.name);
                }
            },
            type: DefaultArmaturesEnum,
            visible: true,
            editorOnly: true,
            displayName: "Armature",
            tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.armature_name'
        },

        // value of 0 represents no animation
        _animationIndex: {
            default: 0,
            notify: function () {
                if (this._animationIndex === 0) {
                    this.animationName = '';
                    return;
                }

                let animsEnum;
                if (this.dragonAsset) {
                    animsEnum = this.dragonAsset.getAnimsEnum(this.armatureName);
                }

                if (!animsEnum) {
                    return;
                }

                let animName = animsEnum[this._animationIndex];
                if (animName !== undefined) {
                    this.animationName = animName;
                }
                else {
                    cc.errorID(7402, this.name);
                }
            },
            type: DefaultAnimsEnum,
            visible: true,
            editorOnly: true,
            displayName: 'Animation',
            tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.animation_name'
        },

        /**
         * !#en The time scale of this armature.
         * !#zh 当前骨骼中所有动画的时间缩放率。
         * @property {Number} timeScale
         * @default 1
         */
        timeScale: {
            default: 1,
            notify: function () {
                if (this._sgNode) {
                    this._sgNode.animation().timeScale = this.timeScale;
                }
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.time_scale'
        },

        /**
         * !#en The play times of the default animation.
         *      -1 means using the value of config file;
         *      0 means repeat for ever
         *      >0 means repeat times
         * !#zh 播放默认动画的循环次数
         *      -1 表示使用配置文件中的默认值;
         *      0 表示无限循环
         *      >0 表示循环次数
         * @property {Number} playTimes
         * @default -1
         */
        playTimes: {
            default: -1,
            tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.play_times'
        },

        /**
         * !#en Indicates whether open debug bones.
         * !#zh 是否显示 bone 的 debug 信息。
         * @property {Boolean} debugBones
         * @default false
         */
        debugBones: {
            default: false,
            notify: function () {
                if (this._sgNode) {
                    this._sgNode.setDebugBones(this.debugBones);
                }
            },
            editorOnly: true,
            tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.debug_bones'
        },
    },

    ctor: function () {
        this._inited = false;
    },

    __preload: function () {
        this._init();
    },

    _init: function () {
        if (this._inited) return;
        this._inited = true;

        this._parseDragonAsset();
        this._parseDragonAtlasAsset();
        this._refresh();
        this._activateMaterial();
    },

    _onDestroy: function () {
        this._armature.dispose();
    },

    _activateMaterial: function () {
        if (this._material) return;

        let url = this.dragonAtlasAsset.texture;
        let material = renderer.materialUtil.get(url);

        // Get material
        if (!material) {
            material = new SpriteMaterial();
            renderer.materialUtil.register(url, material);
        }
        let texture = cc.loader.getRes(url);
        // TODO: old texture in material have been released by loader
        material.texture = texture ? texture.getImpl() : undefined;

        this._material = material;
    },

    _buildArmature: function () {
        if (!this.dragonAsset || !this.dragonAtlasAsset || !this.armatureName) return;

        let factory = dragonBones.CCFactory.getFactory();
        this._armature = factory.buildArmatureDisplay(this.armatureName, this._dragonBonesData.name, this);
        
        if (this.animationName) {
            this.playAnimation(this.animationName, this.playTimes);
        }
    },

    _parseDragonAsset: function () {
        if (!this.dragonAsset) return;
        
        let factory = dragonBones.CCFactory.getFactory();
        let jsonObj = JSON.parse(this.dragonAsset.dragonBonesJson);
        let data = factory.getDragonBonesData(jsonObj.name);
        if (data) {
            // already added asset
            let armature, dragonBonesData;
            for (let i = 0, len = jsonObj.armature.length; i < len; i++) {
                armature = jsonObj.armature[i];
                if (!data.armatures[armature.name]) {
                    //add new armature
                    if (!dragonBonesData) {
                        dragonBonesData = factory._dataParser.parseDragonBonesData(jsonObj);
                    }
                    data.addArmature(dragonBonesData.armatures[armature.name]);
                }
            }
            this._dragonBonesData = data;
            return;
        }
        this._dragonBonesData = factory.parseDragonBonesData(jsonObj);
    },

    _parseDragonAtlasAsset: function () {
        if (!this.dragonAtlasAsset) return;

        let factory = dragonBones.CCFactory.getFactory();
        let atlasJsonObj = JSON.parse(this.dragonAtlasAsset.atlasJson);
        let atlasName = atlasJsonObj.name;
        let existedAtlasData = null;
        let atlasDataList = factory.getTextureAtlasData(atlasName);
        let texturePath = this.dragonAtlasAsset.texture;
        if (atlasDataList && atlasDataList.length > 0) {
            for (let idx in atlasDataList) {
                let data = atlasDataList[idx];
                if (data && data.texture && data.texture.url === texturePath) {
                    existedAtlasData = data;
                    break;
                }
            }
        }

        let texture = cc.loader.getRes(texturePath);                
        if (existedAtlasData) {
            existedAtlasData.texture = texture;
        }
        else {
            factory.parseTextureAtlasData(atlasJsonObj, texture);
        }
    },

    _refresh: function () {
        this._buildArmature();

        if (CC_EDITOR) {
            // update inspector
            this._updateArmatureEnum();
            this._updateAnimEnum();
            Editor.Utils.refreshSelectedInspector('node', this.node.uuid);
        }
    },

    // update animation list for editor
    _updateAnimEnum: CC_EDITOR && function () {
        let animEnum;
        if (this.dragonAsset) {
            animEnum = this.dragonAsset.getAnimsEnum(this.armatureName);
        }
        // change enum
        setEnumAttr(this, '_animationIndex', animEnum || DefaultAnimsEnum);
    },

    // update armature list for editor
    _updateArmatureEnum: CC_EDITOR && function () {
        let armatureEnum;
        if (this.dragonAsset) {
            armatureEnum = this.dragonAsset.getArmatureEnum();
        }
        // change enum
        setEnumAttr(this, '_defaultArmatureIndex', armatureEnum || DefaultArmaturesEnum);
    },

    /**
     * !#en
     * Play the specified animation.
     * Parameter animName specify the animation name.
     * Parameter playTimes specify the repeat times of the animation.
     * -1 means use the value of the config file.
     * 0 means play the animation for ever.
     * >0 means repeat times.
     * !#zh
     * 播放指定的动画.
     * animName 指定播放动画的名称。
     * playTimes 指定播放动画的次数。
     * -1 为使用配置文件中的次数。
     * 0 为无限循环播放。
     * >0 为动画的重复次数。
     * @method playAnimation
     * @param {String} animName
     * @param {Number} playTimes
     * @return {dragonBones.AnimationState}
     */
    playAnimation: function (animName, playTimes) {
        if (this._armature) {
            this.playTimes = (playTimes === undefined) ? -1 : playTimes;
            this.animationName = animName;
            return this._armature.animation.play(animName, this.playTimes);
        }

        return null;
    },

    /**
     * !#en
     * Get the all armature names in the DragonBones Data.
     * !#zh
     * 获取 DragonBones 数据中所有的 armature 名称
     * @method getArmatureNames
     * @returns {Array}
     */
    getArmatureNames: function () {
        if (this._dragonBonesData) {
            return this._dragonBonesData.armatureNames;
        }

        return [];
    },

    /**
     * !#en
     * Get the all animation names of specified armature.
     * !#zh
     * 获取指定的 armature 的所有动画名称。
     * @method getAnimationNames
     * @param {String} armatureName
     * @returns {Array}
     */
    getAnimationNames: function (armatureName) {
        let ret = [];
        if (this._dragonBonesData) {
            let armatureData = this._dragonBonesData.getArmature(armatureName);
            if (armatureData) {
                for (let animName in armatureData.animations) {
                    if (armatureData.animations.hasOwnProperty(animName)) {
                        ret.push(animName);
                    }
                }
            }
        }

        return ret;
    },

    /**
     * !#en
     * Add event listener for the DragonBones Event.
     * !#zh
     * 添加 DragonBones 事件监听器。
     * @method addEventListener
     * @param {dragonBones.EventObject} eventType
     * @param {function} listener
     * @param {Object} target
     */
    addEventListener: function (eventType, listener, target) {
        if (!this._armature) return;
        this._armature._display.addDBEventListener(eventType, listener, target);
    },

    /**
     * !#en
     * Remove the event listener for the DragonBones Event.
     * !#zh
     * 移除 DragonBones 事件监听器。
     * @method removeEventListener
     * @param {dragonBones.EventObject} eventType
     * @param {function} listener
     * @param {Object} target
     */
    removeEventListener: function (eventType, listener, target) {
        if (!this._armature) return;
        this._armature._display.removeDBEventListener(eventType, listener, target);
    },

    /**
     * !#en
     * Build the armature for specified name.
     * !#zh
     * 构建指定名称的 armature 对象
     * @method buildArmature
     * @param {String} armatureName
     * @param {Node} node
     * @return {dragonBones.Armature}
     */
    buildArmature: function (armatureName) {
        return dragonBones.CCFactory.getFactory().buildArmatureDisplay(armatureName, this._dragonBonesData.name, this);
    },

    buildArmatureDisplay (armatureName, node) {
        node = node || new cc.Node();
        let display = node.addComponent(dragonBones.ArmatureDisplay);
        
        display.armatureName = armatureName;
        display._N$dragonAsset = this.dragonAsset;
        display._N$dragonAtlasAsset = this.dragonAtlasAsset;
        display._init();

        return display;
    },

    /**
     * !#en
     * Get the current armature object of the ArmatureDisplay.
     * !#zh
     * 获取 ArmatureDisplay 当前使用的 Armature 对象
     * @method armature
     * @returns {Object}
     */
    armature: function () {
        return this._armature;
    }
});

module.exports = dragonBones.ArmatureDisplay = ArmatureDisplay;
