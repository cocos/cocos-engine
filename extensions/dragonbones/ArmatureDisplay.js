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

        /**
         * !#en The name of default armature.
         * !#zh 默认的 Armature 名称。
         * @property {String} defaultArmature
         */
        defaultArmature: {
            default: '',
            visible: false
        },

        /**
         * !#en The name of current playing animation.
         * !#zh 当前播放的动画名称。
         * @property {String} animation
         */
        animation: {
            //get: function () {
            //    var entry = this.getCurrent(0);
            //    return (entry && entry.animation.name) || "";
            //},
            //set: function (value) {
            //    this.defaultAnimation = value;
            //    if (value) {
            //        this.setAnimation(0, value, this.loop);
            //    }
            //    else {
            //        this.clearTrack(0);
            //        this.setToSetupPose();
            //    }
            //},
            default: '',
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
                    this.defaultArmature = armatureName;
                    if (CC_EDITOR && !cc.engine.isPlaying) {
                        this._refresh();
                    }
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
                    this.animation = '';
                    return;
                }

                var animsEnum;
                if (this.dragonAsset) {
                    animsEnum = this.dragonAsset.getAnimsEnum(this.defaultArmature);
                }

                if ( !animsEnum ) {
                    return;
                }

                var animName = animsEnum[this._animationIndex];
                if (animName !== undefined) {
                    this.animation = animName;
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
    },

    __preload: function () {
        this._parseDragonAsset();
        this._parseDragonAtlasAsset();
        this._refresh();
    },

    _createSgNode: function () {
        if (this.dragonAsset && this.dragonAtlasAsset && this.defaultArmature) {
            return dragonBones.getFactory().buildArmatureDisplay(this.defaultArmature);
        }
        return null;
    },

    _initSgNode: function () {
        //var sgNode = this._sgNode;
        //sgNode.setTimeScale(this.timeScale);
        //
        //var self = this;
        //sgNode.onEnter = function () {
        //    _ccsg.Node.prototype.onEnter.call(this);
        //    if (self._paused) {
        //        this.pause();
        //    }
        //};
        //
        //if (this.defaultSkin) {
        //    try {
        //        sgNode.setSkin(this.defaultSkin);
        //    }
        //    catch (e) {
        //        cc._throw(e);
        //    }
        //}
        //this.animation = this.defaultAnimation;
        //if (CC_EDITOR) {
        //    sgNode.setDebugSlotsEnabled(this.debugSlots);
        //    sgNode.setDebugBonesEnabled(this.debugBones);
        //}
    },

    _parseDragonAsset : function() {
        if (this.dragonAsset) {
            if (CC_JSB) {
                dragonBones.getFactory().parseDragonBonesData(this.dragonAsset.dragonBonesJson);
            } else {
                var jsonObj = JSON.parse(this.dragonAsset.dragonBonesJson);
                dragonBones.getFactory().parseDragonBonesData(jsonObj);
            }
        }
    },

    _parseDragonAtlasAsset : function() {
        if (this.dragonAtlasAsset) {
            if (CC_JSB) {
                // TODO parse the texture atlas data from json string & texture path
                //dragonBones.getFactory().parseTextureAtlasData(this.dragonAtlasAsset.atlasJson, this.dragonAtlasAsset.texture);
            } else {
                var atlasJsonObj = JSON.parse(this.dragonAtlasAsset.atlasJson);
                var texture = cc.loader.getRes(this.dragonAtlasAsset.texture);
                dragonBones.getFactory().parseTextureAtlasData(atlasJsonObj, texture);
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
            animEnum = this.dragonAsset.getAnimsEnum(this.defaultArmature);
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
});
