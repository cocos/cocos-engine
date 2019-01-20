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

const RenderComponent = require('../../cocos2d/core/components/CCRenderComponent');
const SpriteMaterial = require('../../cocos2d/core/renderer/render-engine').SpriteMaterial;

let EventTarget = require('../../cocos2d/core/event/event-target');

const Node = require('../../cocos2d/core/CCNode');
const Graphics = require('../../cocos2d/core/graphics/graphics');
const BlendFactor = require('../../cocos2d/core/platform/CCMacro').BlendFactor;

let ArmatureCache = require('./ArmatureCache');

/**
 * @module dragonBones
 */

let DefaultArmaturesEnum = cc.Enum({ 'default': -1 });
let DefaultAnimsEnum = cc.Enum({ '<None>': 0 });
let DefaultRenderModeEnum = cc.Enum({ 'realtime': 0 });
let RenderModeEnum = cc.Enum({ 'realtime': 0, 'sharedCache': 1, "privateCache": 2 });

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
 * @extends RenderComponent
 */
let ArmatureDisplay = cc.Class({
    name: 'dragonBones.ArmatureDisplay',
    extends: RenderComponent,
    mixins: [EventTarget],

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/DragonBones',
        //help: 'app://docs/html/components/dragonbones.html', // TODO help document of dragonBones
    },
    
    properties: {
        _factory: {
            default: null,
            type: dragonBones.CCFactory,
            serializable: false,
        },

        /**
         * !#en don't try to get or set srcBlendFactor,it doesn't affect,if you want to change dragonbones blend mode,please set it in dragonbones editor directly.
         * !#zh 不要试图去获取或者设置 srcBlendFactor，没有意义，如果你想设置 dragonbones 的 blendMode，直接在 dragonbones 编辑器中设置即可。
         * @property srcBlendFactor
         * @type {macro.BlendFactor}
         */
        srcBlendFactor: {
            get: function() {
                return this._srcBlendFactor;
            },
            set: function(value) {
                // shield set _srcBlendFactor
            },
            animatable: false,
            type:BlendFactor,
            override: true,
            visible: false
        },

        /**
         * !#en don't try to get or set dstBlendFactor,it doesn't affect,if you want to change dragonbones blend mode,please set it in dragonbones editor directly.
         * !#zh 不要试图去获取或者设置 dstBlendFactor，没有意义，如果想设置 dragonbones 的 blendMode，直接在 dragonbones 编辑器中设置即可。
         * @property dstBlendFactor
         * @type {macro.BlendFactor}
         */
        dstBlendFactor: {
            get: function() {
                return this._dstBlendFactor;
            },
            set: function(value) {
                // shield set _dstBlendFactor
            },
            animatable: false,
            type: BlendFactor,
            override: true,
            visible: false
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

                if (this._armature && !this.isCachedMode()) {
                    this._factory._dragonBones.clock.remove(this._armature);
                }

                this._refresh();

                if (this._armature && !this.isCachedMode()) {
                    this._factory._dragonBones.clock.add(this._armature);
                }
                
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
            animatable: false,
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

        _renderMode: {
            default: 0,
            type: RenderModeEnum,
            visible: true,
            animatable: false,
            displayName: "Render Mode",
            tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.render_mode'
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
                if (this._armature) {
                    this._armature.animation.timeScale = this.timeScale;
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
         * !#en Indicates whether to enable premultiplied alpha.
         * You should disable this option when image's transparent area appears to have opaque pixels,
         * or enable this option when image's half transparent area appears to be darken.
         * !#zh 是否启用贴图预乘。
         * 当图片的透明区域出现色块时需要关闭该选项，当图片的半透明区域颜色变黑时需要启用该选项。
         * @property {Boolean} premultipliedAlpha
         * @default false
         */
        premultipliedAlpha: {
            default: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.premultipliedAlpha'
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
                this._updateDebugDraw();
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.debug_bones'
        },

        /**
         * !#en Enabled batch model, if skeleton is complex, do not enable batch, or will lower performance.
         * !#zh 开启合批，如果渲染大量相同纹理，且结构简单的骨骼动画，开启合批可以降低drawcall，否则请不要开启，cpu消耗会上升。
         * @property {Boolean} enabledBatch
         * @default false
         */
        enabledBatch: {
            default: false,
            notify () {
                this._updateBatch();
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.enabled_batch'
        },

        /**
         * Below properties will effect when render mode is sharedCache or privateCache.
         */
        // accumulate time
        _accTime: 0,
        // Frame counter
        _frameCount: 0,
        // Play times counter
        _playCount: 0,
        // Frame cache
        _frameCache: null,
        // Cur frame
        _curFrame: null,
        // Playing flag
        _playing: false,
    },

    ctor () {
        this._material = new SpriteMaterial;
        // Property _materialCache Use to cache material,since dragonBones may use multiple texture,
        // it will clone from the '_material' property,if the dragonbones only have one texture,
        // it will just use the _material,won't clone it.
        // So if invoke getMaterial,it only return _material,if you want to change all materialCache,
        // you can change materialCache directly.
        this._materialCache = {};
        this._inited = false;
        this._factory = dragonBones.CCFactory.getInstance();
    },

    onLoad () {
        // Adapt to old code,remove unuse child which is created by old code.
        // This logic can be remove after 2.2 or later.
        let children = this.node.children;
        for (let i = 0, n = children.length; i < n; i++) {
            let child = children[i];
            let pos = child._name && child._name.search('CHILD_ARMATURE-');
            if (pos === 0) {
                child.destroy();
            }
        }
    },

    _updateBatch () {
        let cache = this._materialCache;
        for (let mKey in cache) {
            let material = cache[mKey];
            if (material) {
                material.useModel = !this.enabledBatch;
            }
        }
    },

    // override
    _updateMaterial (material) {
        this._super(material);
        this._materialCache = {};
    },

    __preload () {
        this._init();
    },

    _init () {
        if (this._inited) return;
        this._inited = true;

        if (CC_JSB) {
            this._renderMode = RenderModeEnum.realtime;
        }

        if (!CC_EDITOR) {
            if (this._renderMode === RenderModeEnum.sharedCache) {
                this._armatureCache = ArmatureCache.sharedCache;
                this._eventObject = {}
            } else if (this._renderMode === RenderModeEnum.privateCache) {
                this._armatureCache = new ArmatureCache;
                this._eventObject = {}
            }
        }
        
        this._parseDragonAsset();
        this._parseDragonAtlasAsset();
        this._refresh();

        let children = this.node.children;
        for (let i = 0, n = children.length; i < n; i++) {
            let child = children[i];
            if (child && child._name === "DEBUG_DRAW_NODE") {
                child.destroy();
            }
        }
        this._updateDebugDraw();
    },

    isCachedMode () {
        if (CC_EDITOR) return false;
        return this._renderMode !== RenderModeEnum.realtime;
    },

    onEnable () {
        this._super();
        // If render mode is cache, no need to update by dragonbones library.
        if (this._armature && !this.isCachedMode()) {
            this._factory._dragonBones.clock.add(this._armature);
        }
    },

    onDisable () {
        this._super();
        // If render mode is cache, no need to update by dragonbones library.
        if (this._armature && !this.isCachedMode()) {
            this._factory._dragonBones.clock.remove(this._armature);
        }
    },

    update (dt) {
        if (!this.isCachedMode()) return;
        if (!this._playing) return;

        let allFrame = this._frameCache.allFrame;
        let totalTime = this._frameCache.totalTime;
        let frameCount = allFrame.length;

        // Animation Start.
        if (this._accTime == 0 && this._playCount == 0) {
            this.emit(dragonBones.EventObject.START, this._eventObject);
        }

        this._accTime += dt * this.timeScale;
        let frameIdx = Math.floor(this._accTime / totalTime * frameCount);
        if (frameIdx >= frameCount) {

            // Animation loop complete.
            this.emit(dragonBones.EventObject.LOOP_COMPLETE, this._eventObject);

            // Animation complete.
            this.emit(dragonBones.EventObject.COMPLETE, this._eventObject);

            this._playCount ++;
            if (this.playTimes === -1 || (this.playTimes > 0 && this._playCount >= this.playTimes)) {
                this._accTime = 0;
                this._playing = false;
                this._playCount = 0;
                return;
            }
            this._accTime = 0;
            frameIdx = 0;
        }

        this._curFrame = allFrame[frameIdx];
        this._frameIdx = frameIdx;
    },

    onDestroy () {
        this._super();
        this._inited = false;

        if (!CC_EDITOR) {
            if (this._renderMode === RenderModeEnum.privateCache) {
                this._armatureCache.dispose();
                this._armatureCache = null;
                this._armature = null;
            } else if (this._renderMode === RenderModeEnum.sharedCache) {
                this._armatureCache = null;
                this._armature = null;
            } else if (this._armature) {
                this._armature.dispose();
                this._armature = null;
            }
        } else {
            if (this._armature) {
                this._armature.dispose();
                this._armature = null;
            }
        }
    },

    _updateDebugDraw () {
        if (this.debugBones) {
            if (!this._debugDraw) {
                let debugDrawNode = new cc.PrivateNode();
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

    _buildArmature () {
        if (!this.dragonAsset || !this.dragonAtlasAsset || !this.armatureName) return;

        let atlasName = this.dragonAtlasAsset._textureAtlasData.name;
        let dragonbonesName = this.dragonAsset._dragonBonesData.name

        if (this.isCachedMode()) {
            this._armature = this._armatureCache.updateDBCache(this.armatureName, dragonbonesName, atlasName);
            if (!this._armature) {
                // Cache fail,swith to realtime render mode.
                this._renderMode = RenderModeEnum.realtime;
            }
        } 
        
        if (CC_EDITOR || this._renderMode === RenderModeEnum.realtime) {
            this._displayProxy = this._factory.buildArmatureDisplay(this.armatureName, dragonbonesName, "", atlasName);
            if (!this._displayProxy) return;
            this._displayProxy._ccNode = this.node;
            this._armature = this._displayProxy._armature;
            this._armature.animation.timeScale = this.timeScale;
        }

        this._updateBatch();
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
            this._updateRenderModeEnum();
            Editor.Utils.refreshSelectedInspector('node', this.node.uuid);
        }
    },

    _updateRenderModeEnum: CC_EDITOR && function () {
        if (this._armature && ArmatureCache.canCache(this._armature)) {
            setEnumAttr(this, '_renderMode', RenderModeEnum);
        } else {
            setEnumAttr(this, '_renderMode', DefaultRenderModeEnum);
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
        
        this.playTimes = (playTimes === undefined) ? -1 : playTimes;
        this.animationName = animName;

        if (this.isCachedMode()) {
            let atlasName = this.dragonAtlasAsset._textureAtlasData.name;
            let dragonbonesName = this.dragonAsset._dragonBonesData.name;
            let cache = this._armatureCache.getRenderCache(this.armatureName, dragonbonesName, atlasName, animName);
            if (!cache) {
                cache = this._armatureCache.updateRenderCache(this.armatureName, dragonbonesName, atlasName, animName);
            }
            if (cache) {
                this._accTime = 0;
                this._frameCount = 0;
                this._playCount = 0;
                this._frameCache = cache;
                this._playing = true;
                this._curFrame = this._frameCache.allFrame[0];
            }
        } else {
            if (this._armature) {
                return this._armature.animation.play(animName, this.playTimes);
            }
        }
    },

    updateCache (animName) {
        if (!this.isCachedMode()) return;
        let atlasName = this.dragonAtlasAsset._textureAtlasData.name;
        let dragonbonesName = this.dragonAsset._dragonBonesData.name;
        let cache = this._armatureCache.updateRenderCache(this.armatureName, dragonbonesName, atlasName, animName);
        this._frameCache = cache || this._frameCache;
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
        let dragonBonesData = this.dragonAsset && this.dragonAsset._dragonBonesData;
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
        if (this._displayProxy) {
            this._displayProxy.addDBEventListener(eventType, listener, target);
        } else {
            this.on(eventType, listener, target);
        }
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
        if (this._displayProxy) {
            this._displayProxy.removeDBEventListener(eventType, listener, target);
        } else {
            this.off(eventType, listener, target);
        }
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
        return this._factory.createArmatureNode(this, armatureName, node);
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
});

module.exports = dragonBones.ArmatureDisplay = ArmatureDisplay;
