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
 * !#en
 * The skeleton of Spine <br/>
 * <br/>
 * (Skeleton has a reference to a SkeletonData and stores the state for skeleton instance,
 * which consists of the current pose's bone SRT, slot colors, and which slot attachments are visible. <br/>
 * Multiple skeletons can use the same SkeletonData which includes all animations, skins, and attachments.) <br/>
 * !#zh
 * Spine 骨骼动画 <br/>
 * <br/>
 * (Skeleton 具有对骨骼数据的引用并且存储了骨骼实例的状态，
 * 它由当前的骨骼动作，slot 颜色，和可见的 slot attachments 组成。<br/>
 * 多个 Skeleton 可以使用相同的骨骼数据，其中包括所有的动画，皮肤和 attachments。
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
         * !#en The skeletal animation is paused?
         * !#zh 该骨骼动画是否暂停。
         * @property paused
         * @type {Boolean}
         * @readOnly
         * @default false
         */
        _paused: false,
        paused: {
            get: function () {
                return this._paused;
            },
            set: function (value) {
                this._paused = value;
                if (!this._sgNode) {
                    return;
                }
                if (value) {
                    this._sgNode.pause();
                }
                else {
                    this._sgNode.resume();
                }
            },
            visible: false
        },

        /**
         * !#en
         * The skeleton data contains the skeleton information (bind pose bones, slots, draw order,
         * attachments, skins, etc) and animations but does not hold any state.<br/>
         * Multiple skeletons can share the same skeleton data.
         * !#zh
         * 骨骼数据包含了骨骼信息（绑定骨骼动作，slots，渲染顺序，
         * attachments，皮肤等等）和动画但不持有任何状态。<br/>
         * 多个 Skeleton 可以共用相同的骨骼数据。
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
         * !#en The name of default skin.
         * !#zh 默认的皮肤名称。
         * @property {String} defaultSkin
         */
        defaultSkin: {
            default: '',
            visible: false
        },

        /**
         * !#en The name of default animation.
         * !#zh 默认的动画名称。
         * @property {String} defaultAnimation
         */
        defaultAnimation: {
            default: '',
            visible: false
        },

        /**
         * !#en The name of current playing animation.
         * !#zh 当前播放的动画名称。
         * @property {String} animation
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
         * @property {Number} _defaultSkinIndex
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
         * !#en TODO
         * !#zh 是否循环播放当前骨骼动画。
         * @property {Boolean} loop
         * @default true
         */
        loop: {
            default: true,
            tooltip: 'i18n:COMPONENT.skeleton.loop'
        },


        /**
         * !#en The time scale of this skeleton.
         * !#zh 当前骨骼中所有动画的时间缩放率。
         * @property {Number} timeScale
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
         * !#en Indicates whether open debug slots.
         * !#zh 是否显示 slot 的 debug 信息。
         * @property {Boolean} debugSlots
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
         * !#en Indicates whether open debug bones.
         * !#zh 是否显示 bone 的 debug 信息。
         * @property {Boolean} debugBones
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

    __preload: function () {
        // sgNode 的尺寸不是很可靠 同时 Node 的框框也没办法和渲染匹配 只好强制尺寸为零
        var Flags = cc.Object.Flags;
        this._objFlags |= (Flags.IsAnchorLocked | Flags.IsSizeLocked);
        this.node.setContentSize(0, 0);
        //
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

        var self = this;
        sgNode.onEnter = function () {
            _ccsg.Node.prototype.onEnter.call(this);
            if (self._paused) {
                this.pause();
            }
        };

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
     * !#en Computes the world SRT from the local SRT for each bone.
     * !#zh 重新更新所有骨骼的世界 Transform，
     * 当获取 bone 的数值未更新时，即可使用该函数进行更新数值。
     * @method updateWorldTransform
     * @example
     * var bone = spine.findBone('head');
     * cc.log(bone.worldX); // return 0;
     * spine.updateWorldTransform();
     * bone = spine.findBone('head');
     * cc.log(bone.worldX); // return -23.12;
     */
    updateWorldTransform: function () {
        if (this._sgNode) {
            this._sgNode.updateWorldTransform();
        }
    },

    /**
     * !#en Sets the bones and slots to the setup pose.
     * !#zh 还原到起始动作
     * @method setToSetupPose
     */
    setToSetupPose: function () {
        if (this._sgNode) {
            this._sgNode.setToSetupPose();
        }
    },

    /**
     * !#en
     * Sets the bones to the setup pose,
     * using the values from the `BoneData` list in the `SkeletonData`.
     * !#zh
     * 设置 bone 到起始动作
     * 使用 SkeletonData 中的 BoneData 列表中的值。
     * @method setBonesToSetupPose
     */
    setBonesToSetupPose: function () {
        if (this._sgNode) {
            this._sgNode.setBonesToSetupPose();
        }
    },

    /**
     * !#en
     * Sets the slots to the setup pose,
     * using the values from the `SlotData` list in the `SkeletonData`.
     * !#zh
     * 设置 slot 到起始动作。
     * 使用 SkeletonData 中的 SlotData 列表中的值。
     * @method setSlotsToSetupPose
     */
    setSlotsToSetupPose: function () {
        if (this._sgNode) {
            this._sgNode.setSlotsToSetupPose();
        }
    },

    /**
     * !#en
     * Finds a bone by name.
     * This does a string comparison for every bone.
     * !#zh
     * 通过名称查找 bone。
     * 这里对每个 bone 的名称进行了对比。
     * @method findBone
     * @param {String} boneName
     * @return {spine.Bone}
     */
    findBone: function (boneName) {
        if (this._sgNode) {
            return this._sgNode.findBone(boneName);
        }
        return null;
    },

    /**
     * !#en
     * Finds a slot by name.
     * This does a string comparison for every slot.
     * !#zh
     * 通过名称查找 slot。
     * 这里对每个 slot 的名称进行了比较。
     * @method findSlot
     * @param {String} slotName
     * @return {spine.Slot}
     */
    findSlot: function (slotName) {
        if (this._sgNode) {
            return this._sgNode.findSlot(slotName);
        }
        return null;
    },

    /**
     * !#en
     * Finds a skin by name and makes it the active skin.
     * This does a string comparison for every skin.
     * Note that setting the skin does not change which attachments are visible.
     * !#zh
     * 按名称查找皮肤，激活该皮肤。
     * 这里对每个皮肤的名称进行了比较。
     * 注意：设置皮肤不会改变 attachment 的可见性。。
     * @method setSkin
     * @param {String} skinName
     * @return {spine.Skin}
     */
    setSkin: function (skinName) {
        if (this._sgNode) {
            return this._sgNode.setSkin(skinName);
        }
        return null;
    },

    /**
     * !#en
     * Returns the attachment for the slot and attachment name.
     * The skeleton looks first in its skin, then in the skeleton data’s default skin.
     * !#zh
     * 通过 slot 和 attachment 的名称获取 attachment。
     * Skeleton 优先查找它的皮肤，然后才是 Skeleton Data 中默认的皮肤。
     * @method getAttachment
     * @param {String} slotName
     * @param {String} attachmentName
     * @return {spine.RegionAttachment|sp.spine.BoundingBoxAttachment}
     */
    getAttachment: function (slotName, attachmentName) {
        if (this._sgNode) {
            return this._sgNode.getAttachment(slotName, attachmentName);
        }
        return null;
    },

    /**
     * !#en
     * Sets the attachment for the slot and attachment name.
     * The skeleton looks first in its skin, then in the skeleton data’s default skin.
     * !#zh
     * 通过 slot 和 attachment 的名字来设置 attachment。
     * Skeleton 优先查找它的皮肤，然后才是 Skeleton Data 中默认的皮肤。
     * @method setAttachment
     * @param {String} slotName
     * @param {String} attachmentName
     */
    setAttachment: function (slotName, attachmentName) {
        if (this._sgNode) {
            this._sgNode.setAttachment(slotName, attachmentName);
        }
    },

    /**
     * !#en Sets skeleton data to sp.Skeleton.
     * !#zh 设置 Skeleton 中的 Skeleton Data。
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
     * !#en Sets animation state data.
     * !#zh 设置动画状态数据。
     * @method setAnimationStateData
     * @param {spine.AnimationStateData} stateData
     */
    setAnimationStateData: function (stateData) {
        if (this._sgNode) {
            return this._sgNode.setAnimationStateData(stateData);
        }
    },

    /**
     * !#en
     * Mix applies all keyframe values,
     * interpolated for the specified time and mixed with the current values.
     * !#zh 为所有关键帧设定混合及混合时间（从当前值开始差值）。
     * @method setMix
     * @param {String} fromAnimation
     * @param {String} toAnimation
     * @param {Number} duration
     */
    setMix: function (fromAnimation, toAnimation, duration) {
        if (this._sgNode) {
            this._sgNode.setMix(fromAnimation, toAnimation, duration);
        }
    },

    /**
     * !#en Sets event listener.
     * !#zh 设置动画事件监听器。
     * @method setAnimationListener
     * @param {Object} target
     * @param {Function} callback
     */
    setAnimationListener: function (target, callback) {
        if (this._sgNode) {
            this._sgNode.setAnimationListener(target, callback);
        }
    },

    /**
     * !#en Set the current animation. Any queued animations are cleared.
     * !#zh 设置当前动画。队列中的任何的动画将被清除。
     * @method setAnimation
     * @param {Number} trackIndex
     * @param {String} name
     * @param {Boolean} loop
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
     * !#en Adds an animation to be played delay seconds after the current or last queued animation.
     * !#zh 添加一个动画到动画队列尾部，还可以延迟指定的秒数。
     * @method addAnimation
     * @param {Number} trackIndex
     * @param {String} name
     * @param {Boolean} loop
     * @param {Number} [delay=0]
     * @return {spine.TrackEntry}
     */
    addAnimation: function (trackIndex, name, loop, delay) {
        if (this._sgNode) {
            return this._sgNode.addAnimation(trackIndex, name, loop, delay);
        }
        return null;
    },

    /**
     * !#en Returns track entry by trackIndex.
     * !#zh 通过 track 索引获取 TrackEntry。
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
     * !#en Clears all tracks of animation state.
     * !#zh 清除所有 track 的动画状态。
     * @method clearTracks
     */
    clearTracks: function () {
        if (this._sgNode) {
            this._sgNode.clearTracks();
        }
    },

    /**
     * !#en Clears track of animation state by trackIndex.
     * !#zh 清除出指定 track 的动画状态。
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
     * !#en Set the start event listener.
     * !#zh 用来设置开始播放动画的事件监听。
     * @method setStartListener
     * @param {function} listener
     */
    setStartListener: function (listener) {
        if (this._sgNode) {
            this._sgNode.setStartListener(listener);
        }
    },

    /**
     * !#en Set the end event listener.
     * !#zh 用来设置动画播放完后的事件监听。
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
            if (CC_JSB) {
                sgNode.retain();
            }
            if ( !self.enabledInHierarchy ) {
                sgNode.setVisible(false);
            }
            sgNode.setContentSize(0, 0);    // restore content size
            self._initSgNode();
            self._appendSgNode(sgNode);
            self._registSizeProvider();
        }

        if (CC_EDITOR) {
            // update inspector
            self._updateAnimEnum();
            self._updateSkinEnum();
            self._refreshInspector();
        }
    }
});
