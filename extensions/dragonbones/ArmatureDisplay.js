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

var DefaultArmaturesEnum = cc.Enum({ 'default': -1 });
var DefaultAnimsEnum = cc.Enum({ '<None>': 0 });

function setEnumAttr (obj, propName, enumDef) {
    cc.Class.attr(obj, propName, {
        type: 'Enum',
        enumList: cc.Enum.getList(enumDef)
    });
}

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

        dragonAsset : {
            default: null,
            type : dragonBones.DragonBonesAsset,
            notify: function () {
                // parse the asset data
                this._parseDragonAsset();

                this._refresh();
                this._defaultArmatureIndex = 0;
                this._animationIndex = 0;
            },
            tooltip: 'i18n:COMPONENT.dragon_bones.dragon_bones_asset'
        },

        dragonAtlasAsset : {
            default: null,
            type: dragonBones.DragonBonesAtlasAsset,
            notify: function () {
                // parse the atlas asset data
                this._parseDragonAtlasAsset();

                this._refreshSgNode();
            },
            tooltip: 'i18n:COMPONENT.dragon_bones.dragon_bones_atlas_asset'
        },

        _armatureName : '',
        /**
         * !#en The name of default armature.
         * !#zh 默认的 Armature 名称。
         * @property {String} armatureName
         */
        armatureName: {
            get : function () {
                return this._armatureName;
            },
            set : function (value) {
                this._armatureName = value;
                var animNames = this.getAnimationNames(this._armatureName);
                this.animationName = animNames[0];
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
                        return cc.error('Failed to set _defaultArmatureIndex for "%s" because its dragonAsset is invalid.', this.name);
                    }

                    armatureName = armaturesEnum[this._defaultArmatureIndex];
                }

                if (armatureName !== undefined) {
                    this.armatureName = armatureName;
                }
                else {
                    cc.error('Failed to set _defaultArmatureIndex for "%s" because the index is out of range.', this.name);
                }
            },
            type: DefaultArmaturesEnum,
            visible: true,
            editorOnly: true,
            serializable: false,
            displayName: "Default Armature"
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
                    cc.error('Failed to set _animationIndex for "%s" because the index is out of range.', this.name);
                }
            },
            type: DefaultAnimsEnum,
            visible: true,
            editorOnly: true,
            serializable: false,
            displayName: 'Animation'
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
            }
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
            default: -1
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
            editorOnly: true
        },
    },

    ctor : function () {
        this._factory = new dragonBones.CCFactory();
    },

    onDestroy : function () {
        // TODO destroy the factory??
    },

    __preload : function () {
        this._parseDragonAsset();
        this._parseDragonAtlasAsset();
        this._refresh();
    },

    _createSgNode: function () {
        if (this.dragonAsset && this.dragonAtlasAsset && this.armatureName) {
            return this._factory.buildArmatureDisplay(this.armatureName);
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
            if (CC_JSB) {
                this._dragonBonesData = this._factory.parseDragonBonesData(this.dragonAsset.dragonBonesJson);
            } else {
                var jsonObj = JSON.parse(this.dragonAsset.dragonBonesJson);
                this._dragonBonesData = this._factory.parseDragonBonesData(jsonObj);
            }
        }
    },

    _parseDragonAtlasAsset : function() {
        if (this.dragonAtlasAsset) {
            if (CC_JSB) {
                // TODO parse the texture atlas data from json string & texture path
                //this._factory.parseTextureAtlasData(this.dragonAtlasAsset.atlasJson, this.dragonAtlasAsset.texture);
            } else {
                var atlasJsonObj = JSON.parse(this.dragonAtlasAsset.atlasJson);
                var texture = cc.loader.getRes(this.dragonAtlasAsset.texture);
                this._factory.parseTextureAtlasData(atlasJsonObj, texture);
            }
        }
    },

    _refreshSgNode : function() {
        var self = this;

        // discard exists sgNode
        if (self._sgNode) {
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
            this._refreshInspector();
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

    // force refresh inspector
    _refreshInspector: CC_EDITOR && function () {
        var ga = Editor.Selection.curGlobalActivate();
        var inspecting = (ga && ga.id === this.node.uuid && ga.type === 'node');
        if (inspecting) {
            Editor.Selection.unselect('node', this.node.uuid);
            ga = Editor.Selection.curGlobalActivate();
            var id = this.node.uuid;
            var inspectOther = (ga && ga.type === 'node' && ga.id);
            if (inspectOther) {
                setTimeout(function () {
                    Editor.Selection.select('node', id, false);
                }, 200);
            }
            else {
                Editor.Selection.select('node', id, false);
            }
        }
    },

    playAnimation: function(animName, playTimes) {
        if (this._sgNode) {
            this.animationName = animName;
            this._sgNode.animation().play(animName, playTimes);
        }
    },

    getArmatureNames : function () {
        if (this._dragonBonesData) {
            return this._dragonBonesData.armatureNames;
        }

        return [];
    },

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

    addEventListener : function (eventType, listener, target) {
        if (this._sgNode) {
            this._sgNode.addEvent(eventType, listener, target);
        }
    },

    removeEventListener : function (eventType, listener, target) {
        if (this._sgNode) {
            this._sgNode.removeEvent(eventType, listener, target);
        }
    },

    buildArmature : function (armatureName) {
        if (this._factory) {
            return this._factory.buildArmature(armatureName);
        }

        return null;
    },

    armature : function () {
        if (this._sgNode) {
            return this._sgNode.armature();
        }

        return null;
    }
});
