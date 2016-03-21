/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

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
 * @module sp
 */

var DefaultSkinsEnum = cc.Enum({ 'default': -1 });
var DefaultAnimsEnum = cc.Enum({ '<None>': 0 });

function setEnumAttr (obj, propName, enumDef) {
    cc.Class.attr(obj, propName, {
        type: 'Enum',
        enumList: cc.Enum.getList(enumDef)
    });
}

/**
 * The skeleton of Spine <br/>
 * <br/>
 * (Skeleton has a reference to a SkeletonData and stores the state for skeleton instance,
 * which consists of the current pose's bone SRT, slot colors, and which slot attachments are visible. <br/>
 * Multiple skeletons can use the same SkeletonData which includes all animations, skins, and attachments.) <br/>
 *
 * @class Skeleton
 * @extends cc._RendererUnderSG
 * @constructor
 */

// 由于 Spine 的 _sgNode 需要参数才能初始化, 所以这里的 _sgNode 不在构造函数中赋值, 每次访问前都要先判断一次是否初始化了

sp.Skeleton = cc.Class({
    name: 'sp.Skeleton',
    extends: cc._RendererUnderSG,
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/Spine Skeleton',
        help: 'app://docs/html/components/spine.html',
        //playOnFocus: true
    },

    properties: {

        /**
         * The skeleton data contains the skeleton information (bind pose bones, slots, draw order,
         * attachments, skins, etc) and animations but does not hold any state.
         * Multiple skeletons can share the same skeleton data.
         * @property {SkeletonData} skeletonData
         */
        skeletonData: {
            default: null,
            type: sp.SkeletonData,
            notify: function () {
                this.defaultSkin = '';
                this.defaultAnimation = '';
                this._refresh();
            },
            tooltip: 'i18n:COMPONENT.skeleton.skeleton_data'
        },

        ///**
        // * The url of atlas file.
        // * @property {string} file
        // */
        //atlasFile: {
        //    default: '',
        //    url: cc.TextAsset,
        //    notify: function () {
        //        this.defaultSkin = '';
        //        this.defaultAnimation = '';
        //        this._applyAsset();
        //    },
        //},

        // 由于 spine 的 skin 是无法二次替换的，所以只能设置默认的 skin
        /**
         * The name of default skin.
         * @property {string} defaultSkin
         */
        defaultSkin: {
            default: '',
            visible: false
        },

        /**
         * The name of default animation.
         * @property {string} defaultAnimation
         */
        defaultAnimation: {
            default: '',
            visible: false
        },

        /**
         * The name of current playing animation.
         * @property {string} animation
         */
        animation: {
            get: function () {
                var entry = this.getCurrent(0);
                return (entry && entry.animation.name) || "";
            },
            set: function (value) {
                this.defaultAnimation = value;
                if (value) {
                    this.setAnimation(0, value, this.loop);
                }
                else {
                    this.clearTrack(0);
                    this.setToSetupPose();
                }
            },
            visible: false
        },

        /**
         * @property {number} _defaultSkinIndex
         */
        _defaultSkinIndex: {
            get: function () {
                if (this.skeletonData && this.defaultSkin) {
                    var skinsEnum = this.skeletonData.getSkinsEnum();
                    if (skinsEnum) {
                        var skinIndex = skinsEnum[this.defaultSkin];
                        if (skinIndex !== undefined) {
                            return skinIndex;
                        }
                    }
                }
                return 0;
            },
            set: function (value) {
                var skinsEnum;
                if (this.skeletonData) {
                    skinsEnum = this.skeletonData.getSkinsEnum();
                }
                if ( !skinsEnum ) {
                    return cc.error('Failed to set _defaultSkinIndex for "%s" because its skeletonData is invalid.',
                        this.name);
                }
                var skinName = skinsEnum[value];
                if (skinName !== undefined) {
                    this.defaultSkin = skinName;
                    if (CC_EDITOR && !cc.engine.isPlaying) {
                        this._refresh();
                    }
                }
                else {
                    cc.error('Failed to set _defaultSkinIndex for "%s" because the index is out of range.', this.name);
                }
            },
            type: DefaultSkinsEnum,
            visible: true,
            displayName: "Default Skin",
            tooltip: 'i18n:COMPONENT.skeleton.default_skin'
        },

        // value of 0 represents no animation
        _animationIndex: {
            get: function () {
                var animationName = (!CC_EDITOR || cc.engine.isPlaying) ? this.animation : this.defaultAnimation;
                if (this.skeletonData && animationName) {
                    var animsEnum = this.skeletonData.getAnimsEnum();
                    if (animsEnum) {
                        var animIndex = animsEnum[animationName];
                        if (animIndex !== undefined) {
                            return animIndex;
                        }
                    }
                }
                return 0;
            },
            set: function (value) {
                if (value === 0) {
                    this.animation = '';
                    return;
                }
                var animsEnum;
                if (this.skeletonData) {
                    animsEnum = this.skeletonData.getAnimsEnum();
                }
                if ( !animsEnum ) {
                    return cc.error('Failed to set _animationIndex for "%s" because its skeletonData is invalid.', this.name);
                }
                var animName = animsEnum[value];
                if (animName !== undefined) {
                    this.animation = animName;
                }
                else {
                    cc.error('Failed to set _animationIndex for "%s" because the index is out of range.', this.name);
                }

            },
            type: DefaultAnimsEnum,
            visible: true,
            displayName: 'Animation',
            tooltip: 'i18n:COMPONENT.skeleton.animation'
        },

        //// for inspector
        //_animationList: {
        //    default: [],
        //    type: cc.String,
        //    serializable: false
        //},
        //
        //// for inspector
        //_skinList: {
        //    default: [],
        //    type: cc.String,
        //    serializable: false
        //},

        /**
         * @property {boolean} loop
         * @default true
         */
        loop: {
            default: true,
            type: Boolean,
            tooltip: 'i18n:COMPONENT.skeleton.loop'
        },


        /**
         * The time scale of this skeleton.
         * @property {number} timeScale
         * @default 1
         */
        timeScale: {
            default: 1,
            notify: function () {
                if (this._sgNode) {
                    this._sgNode.setTimeScale(this.timeScale);
                }
            },
            tooltip: 'i18n:COMPONENT.skeleton.time_scale'
        },

        /**
         * Indicates whether open debug slots.
         * @property {boolean} debugSlots
         * @default false
         */
        debugSlots: {
            default: false,
            notify: function () {
                if (this._sgNode) {
                    this._sgNode.setDebugSlotsEnabled(this.debugSlots);
                }
            },
            editorOnly: true,
            tooltip: 'i18n:COMPONENT.skeleton.debug_slots'
        },

        /**
         * Indicates whether open debug bones.
         * @property {boolean} debugBones
         * @default false
         */
        debugBones: {
            default: false,
            notify: function () {
                if (this._sgNode) {
                    this._sgNode.setDebugBonesEnabled(this.debugBones);
                }
            },
            editorOnly: true,
            tooltip: 'i18n:COMPONENT.skeleton.debug_bones'
        }
    },

    // IMPLEMENT

    onLoad: function () {
        var Flags = cc.Object.Flags;
        this._objFlags |= (Flags.IsAnchorLocked | Flags.IsSizeLocked);
        this._refresh();
    },

    _createSgNode: function () {
        if (this.skeletonData/* && self.atlasFile*/) {
            if (CC_JSB) {
                var uuid = this.skeletonData._uuid;
                if ( !uuid ) {
                    cc.error('Can not render dynamic created SkeletonData');
                    return null;
                }
                var jsonFile = this.skeletonData.rawUrl;
                var atlasFile = this.skeletonData.atlasUrl;
                if (atlasFile) {
                    if (typeof atlasFile !== 'string') {
                        cc.error('Invalid type of atlasFile, atlas should be registered as raw asset.');
                        return null;
                    }
                    return new sp._SGSkeletonAnimation(jsonFile, atlasFile, this.skeletonData.scale);
                }
            }
            else {
                var data = this.skeletonData.getRuntimeData();
                if (data) {
                    return new sp._SGSkeletonAnimation(data, null, this.skeletonData.scale);
                }
            }
        }
        return null;
    },

    _initSgNode: function () {
        var sgNode = this._sgNode;
        sgNode.setTimeScale(this.timeScale);
        //if (!CC_EDITOR) {
        //    function animationCallback (ccObj, trackIndex, type, event, loopCount) {
        //        var eventType = AnimEvents[type];3
        //        var detail = {
        //            trackIndex: trackIndex
        //        };
        //        if (type === sp.ANIMATION_EVENT_TYPE.COMPLETE) {
        //            detail.loopCount = loopCount;
        //        }
        //        else if (type === sp.ANIMATION_EVENT_TYPE.EVENT) {
        //            detail.event = event;
        //        }
        //        //Fire.log("[animationCallback] eventType: %s, time: '%s'", eventType, Fire.Time.time);
        //        self.entity.emit(eventType, detail);
        //    }
        //    sgNode.setAnimationListener(target, animationCallback);
        //}
        if (this.defaultSkin) {
            try {
                sgNode.setSkin(this.defaultSkin);
            }
            catch (e) {
                cc._throw(e);
            }
        }
        this.animation = this.defaultAnimation;
        if (CC_EDITOR) {
            sgNode.setDebugSlotsEnabled(this.debugSlots);
            sgNode.setDebugBonesEnabled(this.debugBones);
        }
    },

    _getLocalBounds: CC_EDITOR && function (out_rect) {
        if (this._sgNode) {
            var rect = this._sgNode.getBoundingBox();
            out_rect.x = rect.x;
            out_rect.y = rect.y;
            out_rect.width = rect.width;
            out_rect.height = rect.height;
        }
        else {
            out_rect.x = 0;
            out_rect.y = 0;
            out_rect.width = 0;
            out_rect.height = 0;
        }
    },

    // RENDERER

    /**
     * Sets the bones and slots to the setup pose.
     * @method setToSetupPose
     */
    setToSetupPose: function () {
        if (this._sgNode) {
            this._sgNode.setToSetupPose();
        }
    },

    /**
     * Sets the bones to the setup pose, using the values from the `BoneData` list in the `SkeletonData`.
     * @method setBonesToSetupPose
     */
    setBonesToSetupPose: function () {
        if (this._sgNode) {
            this._sgNode.setBonesToSetupPose();
        }
    },

    /**
     * Sets the slots to the setup pose, using the values from the `SlotData` list in the `SkeletonData`.
     * @method setSlotsToSetupPose
     */
    setSlotsToSetupPose: function () {
        if (this._sgNode) {
            this._sgNode.setSlotsToSetupPose();
        }
    },

    /**
     * Finds a bone by name. This does a string comparison for every bone.
     * @method findBone
     * @param {string} boneName
     * @return {spine.Bone}
     */
    findBone: function (boneName) {
        if (this._sgNode) {
            return this._sgNode.findBone(boneName);
        }
        return null;
    },

    /**
     * Finds a slot by name. This does a string comparison for every slot.
     * @method findSlot
     * @param {string} slotName
     * @return {spine.Slot}
     */
    findSlot: function (slotName) {
        if (this._sgNode) {
            return this._sgNode.findSlot(slotName);
        }
        return null;
    },

    /**
     * Finds a skin by name and makes it the active skin. This does a string comparison for every skin. Note that setting the skin does not change which attachments are visible.
     * @method setSkin
     * @param {string} skinName
     * @return {spine.Skin}
     */
    setSkin: function (skinName) {
        if (this._sgNode) {
            return this._sgNode.setSkin(skinName);
        }
        return null;
    },

    /**
     * Returns the attachment for the slot and attachment name. The skeleton looks first in its skin, then in the skeleton data’s default skin.
     * @method getAttachment
     * @param {string} slotName
     * @param {string} attachmentName
     * @return {spine.RegionAttachment|sp.spine.BoundingBoxAttachment}
     */
    getAttachment: function (slotName, attachmentName) {
        if (this._sgNode) {
            return this._sgNode.getAttachment(slotName, attachmentName);
        }
        return null;
    },

    /**
     * Sets the attachment for the slot and attachment name. The skeleton looks first in its skin, then in the skeleton data’s default skin.
     * @method setAttachment
     * @param {string} slotName
     * @param {string} attachmentName
     */
    setAttachment: function (slotName, attachmentName) {
        if (this._sgNode) {
            this._sgNode.setAttachment(slotName, attachmentName);
        }
    },

    /**
     * Sets skeleton data to sp.Skeleton.
     * @method setSkeletonData
     * @param {spine.SkeletonData} skeletonData
     * @param {spine.SkeletonData} ownsSkeletonData
     */
    setSkeletonData: function (skeletonData, ownsSkeletonData) {
        if (this._sgNode) {
            this._sgNode.setSkeletonData(skeletonData, ownsSkeletonData);
        }
    },

    ///**
    // * Return the renderer of attachment.
    // * @method getTextureAtlas
    // * @param {spine.RegionAttachment|sp.spine.BoundingBoxAttachment} regionAttachment
    // * @return {_ccsg.Node}
    // */
    //getTextureAtlas: function (regionAttachment) {
    //    if (this._sgNode) {
    //        this._sgNode.getTextureAtlas(regionAttachment);
    //    }
    //},

    // ANIMATION

    /**
     * Sets animation state data.
     * @method setAnimationStateData
     * @param {spine.AnimationStateData} stateData
     */
    setAnimationStateData: function (stateData) {
        if (this._sgNode) {
            return this._sgNode.setAnimationStateData(stateData);
        }
    },

    /**
     * Mix applies all keyframe values, interpolated for the specified time and mixed with the current values.
     * @method setMix
     * @param {string} fromAnimation
     * @param {string} toAnimation
     * @param {number} duration
     */
    setMix: function (fromAnimation, toAnimation, duration) {
        if (this._sgNode) {
            this._sgNode.setMix(fromAnimation, toAnimation, duration);
        }
    },

    /**
     * Sets event listener.
     * @method setAnimationListener
     * @param {object} target
     * @param {function} callback
     */
    setAnimationListener: function (target, callback) {
        if (this._sgNode) {
            this._sgNode.setAnimationListener(target, callback);
        }
    },

    /**
     * Set the current animation. Any queued animations are cleared.
     * @method setAnimation
     * @param {number} trackIndex
     * @param {string} name
     * @param {boolean} loop
     * @return {spine.TrackEntry}
     */
    setAnimation: function (trackIndex, name, loop) {
        if (this._sgNode) {
            var res = this._sgNode.setAnimation(trackIndex, name, loop);
            if (CC_EDITOR && !cc.engine.isPlaying) {
                this._sample();
                this.clearTrack(trackIndex);
            }
            return res;
        }
        return null;
    },

    _sample: function () {
        if (this._sgNode) {
            this._sgNode.update(0);
        }
    },

    /**
     * Adds an animation to be played delay seconds after the current or last queued animation.
     * @method addAnimation
     * @param {number} trackIndex
     * @param {string} name
     * @param {boolean} loop
     * @param {number} [delay=0]
     * @return {spine.TrackEntry}
     */
    addAnimation: function (trackIndex, name, loop, delay) {
        if (this._sgNode) {
            return this._sgNode.addAnimation(trackIndex, name, loop, delay);
        }
        return null;
    },

    /**
     * Returns track entry by trackIndex.
     * @method getCurrent
     * @param trackIndex
     * @return {spine.TrackEntry}
     */
    getCurrent: function (trackIndex) {
        if (this._sgNode) {
            return this._sgNode.getCurrent(trackIndex);
        }
        return null;
    },

    /**
     * Clears all tracks of animation state.
     * @method clearTracks
     */
    clearTracks: function () {
        if (this._sgNode) {
            this._sgNode.clearTracks();
        }
    },

    /**
     * Clears track of animation state by trackIndex.
     * @method clearTrack
     * @param {number} trackIndex
     */
    clearTrack: function (trackIndex) {
        if (this._sgNode) {
            this._sgNode.clearTrack(trackIndex);
            if (CC_EDITOR && !cc.engine.isPlaying) {
                this._sample();
            }
        }
    },

    // update animation list for editor
    _updateAnimEnum: CC_EDITOR && function () {
        var animEnum;
        if (this.skeletonData) {
            animEnum = this.skeletonData.getAnimsEnum();
        }
        // change enum
        setEnumAttr(this, '_animationIndex', animEnum || DefaultAnimsEnum);
    },
    // update skin list for editor
    _updateSkinEnum: CC_EDITOR && function () {
        var skinEnum;
        if (this.skeletonData) {
            skinEnum = this.skeletonData.getSkinsEnum();
        }
        // change enum
        setEnumAttr(this, '_defaultSkinIndex', skinEnum || DefaultSkinsEnum);
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

    /**
     * Set the start event listener.
     * @method setStartListener
     * @param {function} listener
     */
    setStartListener: function (listener) {
        if (this._sgNode) {
            this._sgNode.setStartListener(listener);
        }
    },

    /**
     * Set the end event listener.
     * @method setEndListener
     * @param {function} listener
     */
    setEndListener: function (listener) {
        if (this._sgNode) {
            this._sgNode.setEndListener(listener);
        }
    },

    setCompleteListener: function (listener) {
        if (this._sgNode) {
            this._sgNode.setCompleteListener(listener);
        }
    },

    setEventListener: function (listener) {
        if (this._sgNode) {
            this._sgNode.setEventListener(listener);
        }
    },

    setTrackStartListener: function (entry, listener) {
        if (this._sgNode) {
            this._sgNode.setTrackStartListener(entry, listener);
        }
    },

    setTrackEndListener: function (entry, listener) {
        if (this._sgNode) {
            this._sgNode.setTrackEndListener(entry, listener);
        }
    },

    setTrackCompleteListener: function (entry, listener) {
        if (this._sgNode) {
            this._sgNode.setTrackCompleteListener(entry, listener);
        }
    },

    setTrackEventListener: function (entry, listener) {
        if (this._sgNode) {
            this._sgNode.setTrackEventListener(entry, listener);
        }
    },

    //

    getState: function () {
        if (this._sgNode) {
            return this._sgNode.getState();
        }
    },

    _refresh: function () {
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
            sgNode.retain();
            self._initSgNode();
            self._appendSgNode(sgNode);
            if ( !self.node._sizeProvider ) {
                self.node._sizeProvider = sgNode;
            }
        }

        // sgNode 的尺寸不是很可靠 同时 Node 的框框也没办法和渲染匹配 只好先强制尺寸为零
        self.node.setContentSize(0, 0);

        if (CC_EDITOR) {
            // update inspector
            self._updateAnimEnum();
            self._updateSkinEnum();
            self._refreshInspector();
        }
    }
});
