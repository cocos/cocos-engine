/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
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

const RenderComponent = require('../../cocos2d/core/components/CCRenderComponent');
const renderer = require('../../cocos2d/core/renderer');
const renderEngine = require('../../cocos2d/core/renderer/render-engine');
const SpriteMaterial = renderEngine.SpriteMaterial;

let EventTarget = require('../../cocos2d/core/event/event-target');

const Node = require('../../cocos2d/core/CCNode');
const Graphics = require('../../cocos2d/core/graphics/graphics');

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
        _factory: {
            default: null,
            type: dragonBones.CCFactory,
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
            notify () {
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
            notify () {
                // parse the atlas asset data
                this._parseDragonAtlasAsset();
                this._buildArmature();
                this._activateMaterial();
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
            get () {
                return this._armatureName;
            },
            set (value) {
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
            get () {
                return this._animationName;
            },
            set (value) {
                this._animationName = value;
            },
            visible: false
        },

        /**
         * @property {Number} _defaultArmatureIndex
         */
        _defaultArmatureIndex: {
            default: 0,
            notify () {
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
            notify () {
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
            notify () {
                this._armature.animation.timeScale = this.timeScale;
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
            notify () {
                this._initDebugDraw();
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.debug_bones'
        },
    },

    ctor () {
        this._inited = false;
        if (CC_JSB) {
            // TODO Fix me
            // If using the getFactory in JSB.
            // There may be throw errors when close the application.
            this._factory = new dragonBones.CCFactory();
        } else {
            this._factory = dragonBones.CCFactory.getInstance();
        }
    },

    __preload () {
        this._init();
    },

    _init () {
        if (this._inited) return;
        this._inited = true;

        this._parseDragonAsset();
        this._parseDragonAtlasAsset();
        this._refresh();
        this._activateMaterial();
    },

    onEnable () {
        this._super();
        dragonBones.CCFactory.getInstance()._dragonBones.clock.add(this._armature);
    },

    onDisable () {
        this._super();
        dragonBones.CCFactory.getInstance()._dragonBones.clock.remove(this._armature);
    },

    onDestroy () {
        this._super();
        this._armature.dispose();
    },

    _initDebugDraw () {
        if (this.debugBones) {
            if (!this._debugDraw) {
                let debugDrawNode = new Node();
                debugDrawNode.name = 'DEBUG_DRAW_NODE';
                let debugDraw = debugDrawNode.addComponent(Graphics);
                debugDraw.lineWidth = 1;
                debugDraw.strokeColor = cc.color(255, 0, 0, 255);
                
                this._debugDraw = debugDraw;
            }

            this._debugDraw.node.parent = this.node;
        }
        else if (this._debugDraw) {
            this._debugDraw.node.parent = null;
        }
    },

    _activateMaterial () {
        let texture = this.dragonAtlasAsset.texture;
        if (this._material || !texture)
            return;

        // Get material
        let material = new SpriteMaterial();
        material.texture = texture;

        this.setMaterial(material);
    },

    _buildArmature () {
        if (!this.dragonAsset || !this.dragonAtlasAsset || !this.armatureName) return;

        let factory = dragonBones.CCFactory.getInstance();
        this._armature = factory.buildArmatureDisplay(this.armatureName, this.dragonAsset._dragonBonesData.name, this);
        this._armature.animation.timeScale = this.timeScale;

        if (this.animationName) {
            this.playAnimation(this.animationName, this.playTimes);
        }
    },

    _parseDragonAsset () {
        if (this.dragonAsset) {
            this.dragonAsset.init(this._factory);
        }
    },

    _parseDragonAtlasAsset () {
        if (this.dragonAtlasAsset) {
            this.dragonAtlasAsset.init(this._factory);
        }
    },

    _refresh () {
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
    playAnimation (animName, playTimes) {
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
    getArmatureNames () {
        var dragonBonesData = this.dragonAsset && this.dragonAsset._dragonBonesData;
        return (dragonBonesData && dragonBonesData.armatureNames) || [];
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
    getAnimationNames (armatureName) {
        let ret = [];
        if (this.dragonAsset && this.dragonAsset._dragonBonesData) {
            let armatureData = this.dragonAsset._dragonBonesData.getArmature(armatureName);
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
     * @param {String} type - A string representing the event type to listen for.
     * @param {Function} listener - The callback that will be invoked when the event is dispatched.
     * @param {Event} listener.event event
     * @param {Object} [target] - The target (this object) to invoke the callback, can be null
     */
    addEventListener (eventType, listener, target) {
        this.addDBEventListener(eventType, listener, target);
    },

    /**
     * !#en
     * Remove the event listener for the DragonBones Event.
     * !#zh
     * 移除 DragonBones 事件监听器。
     * @method removeEventListener
     * @param {String} type - A string representing the event type to listen for.
     * @param {Function} [listener]
     * @param {Object} [target]
     */
    removeEventListener (eventType, listener, target) {
        this.removeDBEventListener(eventType, listener, target);
    },

    /**
     * !#en
     * Build the armature for specified name.
     * !#zh
     * 构建指定名称的 armature 对象
     * @method buildArmature
     * @param {String} armatureName
     * @param {Node} node
     * @return {dragonBones.ArmatureDisplay}
     */
    buildArmature (armatureName, node) {
        return dragonBones.CCFactory.getInstance().createArmatureNode(this, armatureName, node);
    },

    /**
     * !#en
     * Get the current armature object of the ArmatureDisplay.
     * !#zh
     * 获取 ArmatureDisplay 当前使用的 Armature 对象
     * @method armature
     * @returns {Object}
     */
    armature () {
        return this._armature;
    },

    ////////////////////////////////////
    // dragonbones api
    dbInit (armature) {
        this._armature = armature;
    },

    dbClear () {
        this._armature = null;
    },

    dbUpdate () {
        if (!CC_DEBUG) return;
        this._initDebugDraw();

        let debugDraw = this._debugDraw;
        if (!debugDraw) return;
        
        debugDraw.clear();
        let bones = this._armature.getBones();
        for (let i = 0, l = bones.length; i < l; i++) {
            let bone =  bones[i];
            let boneLength = Math.max(bone.boneData.length, 5);
            let startX = bone.globalTransformMatrix.tx;
            let startY = -bone.globalTransformMatrix.ty;
            let endX = startX + bone.globalTransformMatrix.a * boneLength;
            let endY = startY - bone.globalTransformMatrix.b * boneLength;

            debugDraw.moveTo(startX, startY);
            debugDraw.lineTo(endX, endY);
            debugDraw.stroke();
        }
    },

    advanceTimeBySelf  (on) {
        this.shouldAdvanced = !!on;
    },

    hasDBEventListener (type) {
        return this.hasEventListener(type, false);
    },

    addDBEventListener (type, listener, target) {
        this.on(type, listener, target);
    },

    removeDBEventListener (type, listener, target) {
        this.off(type, listener, target);
    },

    dispatchDBEvent  (type, eventObject) {
        this.emit(type, eventObject);
    },
    ////////////////////////////////////
});

module.exports = dragonBones.ArmatureDisplay = ArmatureDisplay;
