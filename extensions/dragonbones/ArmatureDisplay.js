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

/**
 * @module dragonBones
 */

var DefaultArmaturesEnum = cc.Enum({ 'default': -1 });
var DefaultAnimsEnum = cc.Enum({ '<None>': 0 });

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
 * @extends _RendererUnderSG
 */
dragonBones.ArmatureDisplay = cc.Class({
    name: 'dragonBones.ArmatureDisplay',
    extends: cc._RendererUnderSG,
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
        dragonAsset : {
            default: null,
            type : dragonBones.DragonBonesAsset,
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
        dragonAtlasAsset : {
            default: null,
            type: dragonBones.DragonBonesAtlasAsset,
            notify: function () {
                // parse the atlas asset data
                this._parseDragonAtlasAsset();

                this._refreshSgNode();
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.dragon_bones_atlas_asset'
        },

        _armatureName : '',
        /**
         * !#en The name of current armature.
         * !#zh 当前的 Armature 名称。
         * @property {String} armatureName
         */
        armatureName: {
            get : function () {
                return this._armatureName;
            },
            set : function (value) {
                this._armatureName = value;
                var animNames = this.getAnimationNames(this._armatureName);

                if (!this.animationName || animNames.indexOf(this.animationName) < 0) {
                    if (CC_EDITOR) {
                        this.animationName = animNames[0];
                    } else {
                        // Not use default animation name at runtime
                        this.animationName = '';
                    }
                }
                this._refresh();
            },
            visible: false
        },

        _animationName : '',
        /**
         * !#en The name of current playing animation.
         * !#zh 当前播放的动画名称。
         * @property {String} animationName
         */
        animationName: {
            get : function () {
                return this._animationName;
            },
            set : function (value) {
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
                var armatureName = '';
                if (this.dragonAsset) {
                    var armaturesEnum;
                    if (this.dragonAsset) {
                        armaturesEnum = this.dragonAsset.getArmatureEnum();
                    }
                    if ( !armaturesEnum ) {
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

                var animsEnum;
                if (this.dragonAsset) {
                    animsEnum = this.dragonAsset.getAnimsEnum(this.armatureName);
                }

                if ( !animsEnum ) {
                    return;
                }

                var animName = animsEnum[this._animationIndex];
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

    // IMPLEMENT
    ctor : function () {
        if (CC_JSB) {
            // TODO Fix me
            // If using the getFactory in JSB.
            // There may be throw errors when close the application.
            this._factory = new dragonBones.CCFactory();
        } else {
            this._factory = dragonBones.CCFactory.getFactory();
        }
    },

    __preload : function () {
        this._parseDragonAsset();
        this._parseDragonAtlasAsset();
        this._refresh();
    },

    _createSgNode: function () {
        if (this.dragonAsset && this.dragonAtlasAsset && this.armatureName) {
            return this._factory.buildArmatureDisplay(this.armatureName, this._dragonBonesData.name);
        }
        return null;
    },

    _initSgNode: function () {
        // set the time scale
        var sgNode = this._sgNode;
        sgNode.animation().timeScale = this.timeScale;

        if (this.animationName) {
            this.playAnimation(this.animationName, this.playTimes);
        }

        if (CC_EDITOR) {
            sgNode.setDebugBones(this.debugBones);
        }
    },

    _parseDragonAsset : function() {
        if (this.dragonAsset) {
            var jsonObj = JSON.parse(this.dragonAsset.dragonBonesJson);
            var data = this._factory.getDragonBonesData(jsonObj.name);
            if (data) {
                // already added asset
                this._dragonBonesData = data;
                return;
            }

            if (CC_JSB) {
                this._dragonBonesData = this._factory.parseDragonBonesData(this.dragonAsset.dragonBonesJson);
            } else {
                this._dragonBonesData = this._factory.parseDragonBonesData(jsonObj);
            }
        }
    },

    _parseDragonAtlasAsset : function() {
        if (this.dragonAtlasAsset) {
            if (CC_JSB) {
                // TODO parse the texture atlas data from json string & texture path
                this._factory.parseTextureAtlasData(this.dragonAtlasAsset.atlasJson, this.dragonAtlasAsset.texture);
            } else {
                var atlasJsonObj = JSON.parse(this.dragonAtlasAsset.atlasJson);
                var atlasName = atlasJsonObj.name;
                var existedAtlasData = null;
                var atlasDataList = this._factory.getTextureAtlasData(atlasName);
                var texturePath = this.dragonAtlasAsset.texture;
                if (atlasDataList && atlasDataList.length > 0) {
                    for (var idx in atlasDataList) {
                        var data = atlasDataList[idx];
                        if (data && data.texture && data.texture.url === texturePath) {
                            existedAtlasData = data;
                            break;
                        }
                    }
                }

                var texture = cc.textureCache.getTextureForKey(texturePath);
                if (existedAtlasData) {
                    existedAtlasData.texture = texture;
                } else {
                    this._factory.parseTextureAtlasData(atlasJsonObj, texture);
                }
            }
        }
    },

    _refreshSgNode : function() {
        var self = this;

        // discard exists sgNode
        var listenersBefore = null;
        if (self._sgNode) {
            listenersBefore = self._sgNode._bubblingListeners; // get the listeners added before
            if ( self.node._sizeProvider === self._sgNode ) {
                self.node._sizeProvider = null;
            }
            self._removeSgNode();
            self._sgNode = null;
        }

        // recreate sgNode...
        var sgNode = self._sgNode = self._createSgNode();
        if (sgNode) {
            if (CC_JSB) {
                sgNode.retain();
            }
            if ( !self.enabledInHierarchy ) {
                sgNode.setVisible(false);
            }

            if (listenersBefore) {
                sgNode._bubblingListeners = listenersBefore; // using the listeners added before
                if (CC_JSB && !sgNode.hasEventCallback()) {
                    // In JSB, should set event callback of the new sgNode
                    // to make the listeners work well.
                    sgNode.setEventCallback(function (eventObject) {
                        sgNode.emit(eventObject.type, eventObject);
                    });
                }
            }

            self._initSgNode();
            self._appendSgNode(sgNode);
            self._registSizeProvider();
        }
    },

    _refresh : function () {
        this._refreshSgNode();

        if (CC_EDITOR) {
            // update inspector
            this._updateArmatureEnum();
            this._updateAnimEnum();
            Editor.Utils.refreshSelectedInspector('node', this.node.uuid);
        }
    },

    // update animation list for editor
    _updateAnimEnum: CC_EDITOR && function () {
        var animEnum;
        if (this.dragonAsset) {
            animEnum = this.dragonAsset.getAnimsEnum(this.armatureName);
        }
        // change enum
        setEnumAttr(this, '_animationIndex', animEnum || DefaultAnimsEnum);
    },

    // update armature list for editor
    _updateArmatureEnum: CC_EDITOR && function () {
        var armatureEnum;
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
    playAnimation: function(animName, playTimes) {
        if (this._sgNode) {
            this.playTimes = (playTimes === undefined) ? -1 : playTimes;
            this.animationName = animName;
            return this._sgNode.animation().play(animName, this.playTimes);
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
    getArmatureNames : function () {
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
    getAnimationNames : function (armatureName) {
        var ret = [];
        if (this._dragonBonesData) {
            var armatureData = this._dragonBonesData.getArmature(armatureName);
            if (armatureData) {
                for (var animName in armatureData.animations) {
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
    addEventListener : function (eventType, listener, target) {
        if (this._sgNode) {
            this._sgNode.addEvent(eventType, listener, target);
        }
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
    removeEventListener : function (eventType, listener, target) {
        if (this._sgNode) {
            this._sgNode.removeEvent(eventType, listener, target);
        }
    },

    /**
     * !#en
     * Build the armature for specified name.
     * !#zh
     * 构建指定名称的 armature 对象
     * @method buildArmature
     * @param {String} armatureName
     * @return {dragonBones.Armature}
     */
    buildArmature : function (armatureName) {
        if (this._factory) {
            return this._factory.buildArmature(armatureName);
        }

        return null;
    },

    /**
     * !#en
     * Get the current armature object of the ArmatureDisplay.
     * !#zh
     * 获取 ArmatureDisplay 当前使用的 Armature 对象
     * @method armature
     * @returns {Object}
     */
    armature : function () {
        if (this._sgNode) {
            return this._sgNode.armature();
        }

        return null;
    }
});
