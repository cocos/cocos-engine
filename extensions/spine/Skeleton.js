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

const TrackEntryListeners = require('./track-entry-listeners');
const RenderComponent = require('../../cocos2d/core/components/CCRenderComponent');
const spine = require('./lib/spine');
const renderEngine = require('engine-next');
const SpriteMaterial = renderEngine.SpriteMaterial;
const Node = require('../../cocos2d/core/CCNode');
const Graphics = require('../../cocos2d/core/graphics/graphics');

/**
 * @module sp
 */
let DefaultSkinsEnum = cc.Enum({ 'default': -1 });
let DefaultAnimsEnum = cc.Enum({ '<None>': 0 });

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
 * @extends Component
 */
sp.Skeleton = cc.Class({
    name: 'sp.Skeleton',
    extends: RenderComponent,
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
        paused: {
            default: false,
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
            notify () {
                this.defaultSkin = '';
                this.defaultAnimation = '';
                if (CC_EDITOR) {
                    this._refreshInspector();
                }
                this._updateSkeletonData();
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.skeleton_data'
        },

        ///**
        // * The url of atlas file.
        // * @property {string} file
        // */
        //atlasFile: {
        //    default: '',
        //    url: cc.TextAsset,
        //    notify () {
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
            get () {
                var entry = this.getCurrent(0);
                return (entry && entry.animation.name) || "";
            },
            set (value) {
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
            get () {
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
            set (value) {
                var skinsEnum;
                if (this.skeletonData) {
                    skinsEnum = this.skeletonData.getSkinsEnum();
                }
                if ( !skinsEnum ) {
                    return cc.errorID('',
                        this.name);
                }
                var skinName = skinsEnum[value];
                if (skinName !== undefined) {
                    this.defaultSkin = skinName;
                    if (CC_EDITOR && !cc.engine.isPlaying) {
                        this._refreshInspector();
                    }
                }
                else {
                    cc.errorID(7501, this.name);
                }
            },
            type: DefaultSkinsEnum,
            visible: true,
            displayName: "Default Skin",
            tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.default_skin'
        },

        // value of 0 represents no animation
        _animationIndex: {
            get () {
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
            set (value) {
                if (value === 0) {
                    this.animation = '';
                    return;
                }
                var animsEnum;
                if (this.skeletonData) {
                    animsEnum = this.skeletonData.getAnimsEnum();
                }
                if ( !animsEnum ) {
                    return cc.errorID(7502, this.name);
                }
                var animName = animsEnum[value];
                if (animName !== undefined) {
                    this.animation = animName;
                }
                else {
                    cc.errorID(7503, this.name);
                }

            },
            type: DefaultAnimsEnum,
            visible: true,
            displayName: 'Animation',
            tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.animation'
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
            tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.loop'
        },

        /**
         * !#en Indicates whether to enable premultiplied alpha.
         * You should disable this option when image's transparent area appears to have opaque pixels,
         * or enable this option when image's half transparent area appears to be darken.
         * !#zh 是否启用贴图预乘。
         * 当图片的透明区域出现色块时需要关闭该选项，当图片的半透明区域颜色变黑时需要启用该选项。
         * @property {Boolean} premultipliedAlpha
         * @default true
         */
        premultipliedAlpha: {
            default: true,
            tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.premultipliedAlpha'
        },

        /**
         * !#en The time scale of this skeleton.
         * !#zh 当前骨骼中所有动画的时间缩放率。
         * @property {Number} timeScale
         * @default 1
         */
        timeScale: {
            default: 1,
            tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.time_scale'
        },

        /**
         * !#en Indicates whether open debug slots.
         * !#zh 是否显示 slot 的 debug 信息。
         * @property {Boolean} debugSlots
         * @default false
         */
        debugSlots: {
            default: false,
            editorOnly: true,
            tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.debug_slots'
        },

        /**
         * !#en Indicates whether open debug bones.
         * !#zh 是否显示 bone 的 debug 信息。
         * @property {Boolean} debugBones
         * @default false
         */
        debugBones: {
            default: false,
            editorOnly: true,
            tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.debug_bones'
        }
    },

    // CONSTRUCTOR
    ctor () {
        this._skeleton = null;
        this._rootBone = null;
        this._listener = null;
        this._boundingBox = cc.rect();
        this._material = new SpriteMaterial();
        this._renderDatas = [];
        this._debugNode = new Node();
        this._debugRenderer = this._debugNode.addComponent(Graphics);
    },

    /**
     * !#en
     * Sets runtime skeleton data to sp.Skeleton.<br>
     * This method is different from the `skeletonData` property. This method is passed in the raw data provided by the Spine runtime, and the skeletonData type is the asset type provided by Creator.
     * !#zh
     * 设置底层运行时用到的 SkeletonData。<br>
     * 这个接口有别于 `skeletonData` 属性，这个接口传入的是 Spine runtime 提供的原始数据，而 skeletonData 的类型是 Creator 提供的资源类型。
     * @method setSkeletonData
     * @param {sp.spine.SkeletonData} skeletonData
     */
    setSkeletonData (skeletonData) {
        if (skeletonData.width != null && skeletonData.height != null) {
            this.node.setContentSize(skeletonData.width, skeletonData.height);
        }

        this._skeleton = new spine.Skeleton(skeletonData);
        // this._skeleton.updateWorldTransform();
        this._rootBone = this._skeleton.getRootBone();
    },

    /**
     * !#en Sets animation state data.<br>
     * The parameter type is {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.AnimationStateData.
     * !#zh 设置动画状态数据。<br>
     * 参数是 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.AnimationStateData。
     * @method setAnimationStateData
     * @param {sp.spine.AnimationStateData} stateData
     */
    setAnimationStateData (stateData) {
        var state = new spine.AnimationState(stateData);
        if (this._listener) {
            if (this._state && this._listener) {
                this._state.removeListener(this._listener);
            }
            state.addListener(this._listener);
        }
        this._state = state;
    },

    // IMPLEMENT
    __preload () {
        if (CC_EDITOR) {
            var Flags = cc.Object.Flags;
            this._objFlags |= (Flags.IsAnchorLocked | Flags.IsSizeLocked);
            
            this._refreshInspector();
        }

        this._updateSkeletonData();
    },

    onDestroy () {
        this._super();
        this._debugNode.destroy();
        this._debugRenderer.clear();
        // Render datas will be destroyed automatically by RenderComponent.onDestroy
        this._renderDatas.length = 0;
    },

    // _getLocalBounds: CC_EDITOR && function (out_rect) {
    //     var rect = this._boundingBox;
    //     out_rect.x = rect.x;
    //     out_rect.y = rect.y;
    //     out_rect.width = rect.width;
    //     out_rect.height = rect.height;
    // },

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
    updateWorldTransform () {
        if (this._skeleton) {
            this._skeleton.updateWorldTransform();
        }
    },

    /**
     * !#en Sets the bones and slots to the setup pose.
     * !#zh 还原到起始动作
     * @method setToSetupPose
     */
    setToSetupPose () {
        if (this._skeleton) {
            this._skeleton.setToSetupPose();
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
    setBonesToSetupPose () {
        if (this._skeleton) {
            this._skeleton.setBonesToSetupPose();
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
    setSlotsToSetupPose () {
        if (this._skeleton) {
            this._skeleton.setSlotsToSetupPose();
        }
    },

    /**
     * !#en
     * Finds a bone by name.
     * This does a string comparison for every bone.<br>
     * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Bone object.
     * !#zh
     * 通过名称查找 bone。
     * 这里对每个 bone 的名称进行了对比。<br>
     * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Bone 对象。
     *
     * @method findBone
     * @param {String} boneName
     * @return {sp.spine.Bone}
     */
    findBone (boneName) {
        if (this._skeleton) {
            return this._skeleton.findBone(boneName);
        }
        return null;
    },

    /**
     * !#en
     * Finds a slot by name. This does a string comparison for every slot.<br>
     * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Slot object.
     * !#zh
     * 通过名称查找 slot。这里对每个 slot 的名称进行了比较。<br>
     * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Slot 对象。
     *
     * @method findSlot
     * @param {String} slotName
     * @return {sp.spine.Slot}
     */
    findSlot (slotName) {
        if (this._skeleton) {
            return this._skeleton.findSlot(slotName);
        }
        return null;
    },

    /**
     * !#en
     * Finds a skin by name and makes it the active skin.
     * This does a string comparison for every skin.<br>
     * Note that setting the skin does not change which attachments are visible.<br>
     * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Skin object.
     * !#zh
     * 按名称查找皮肤，激活该皮肤。这里对每个皮肤的名称进行了比较。<br>
     * 注意：设置皮肤不会改变 attachment 的可见性。<br>
     * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Skin 对象。
     *
     * @method setSkin
     * @param {String} skinName
     * @return {sp.spine.Skin}
     */
    setSkin (skinName) {
        if (this._skeleton) {
            return this._skeleton.setSkin(skinName);
        }
        return null;
    },

    /**
     * !#en
     * Returns the attachment for the slot and attachment name.
     * The skeleton looks first in its skin, then in the skeleton data’s default skin.<br>
     * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Attachment object.
     * !#zh
     * 通过 slot 和 attachment 的名称获取 attachment。Skeleton 优先查找它的皮肤，然后才是 Skeleton Data 中默认的皮肤。<br>
     * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Attachment 对象。
     *
     * @method getAttachment
     * @param {String} slotName
     * @param {String} attachmentName
     * @return {sp.spine.Attachment}
     */
    getAttachment (slotName, attachmentName) {
        if (this._skeleton) {
            return this._skeleton.getAttachment(slotName, attachmentName);
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
    setAttachment (slotName, attachmentName) {
        if (this._skeleton) {
            this._skeleton.setAttachment(slotName, attachmentName);
        }
    },

    /**
    * Return the renderer of attachment.
    * @method getTextureAtlas
    * @param {sp.spine.RegionAttachment|spine.BoundingBoxAttachment} regionAttachment
    * @return {sp.spine.TextureAtlasRegion}
    */
    getTextureAtlas (regionAttachment) {
        return regionAttachment.region;
    },

    // ANIMATION
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
    setMix (fromAnimation, toAnimation, duration) {
        if (this._state) {
            this._state.data.setMixWith(fromAnimation, toAnimation, duration);
        }
    },

    /**
     * !#en Sets event listener.
     * !#zh 设置动画事件监听器。
     * @method setAnimationListener
     * @param {Object} target
     * @param {Function} callback
     */
    setAnimationListener (target, callback) {
        if (this._skeleton) {
            this._skeleton.setAnimationListener(target, callback);
        }
    },

    /**
     * !#en Set the current animation. Any queued animations are cleared.<br>
     * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry object.
     * !#zh 设置当前动画。队列中的任何的动画将被清除。<br>
     * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry 对象。
     * @method setAnimation
     * @param {Number} trackIndex
     * @param {String} name
     * @param {Boolean} loop
     * @return {sp.spine.TrackEntry}
     */
    setAnimation (trackIndex, name, loop) {
        if (this._skeleton) {
            var animation = this._skeleton.data.findAnimation(name);
            if (!animation) {
                cc.logID(7509, name);
                return null;
            }
            var res = this._state.setAnimationWith(trackIndex, animation, loop);
            if (CC_EDITOR && !cc.engine.isPlaying) {
                this._state.update(0);
                this._state.clearTracks();
            }
            return res;
        }
        return null;
    },

    /**
     * !#en Adds an animation to be played delay seconds after the current or last queued animation.<br>
     * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry object.
     * !#zh 添加一个动画到动画队列尾部，还可以延迟指定的秒数。<br>
     * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry 对象。
     * @method addAnimation
     * @param {Number} trackIndex
     * @param {String} name
     * @param {Boolean} loop
     * @param {Number} [delay=0]
     * @return {sp.spine.TrackEntry}
     */
    addAnimation (trackIndex, name, loop, delay) {
        if (this._skeleton) {
            delay = delay || 0;
            var animation = this._skeleton.data.findAnimation(name);
            if (!animation) {
                cc.logID(7510, name);
                return null;
            }
            return this._state.addAnimationWith(trackIndex, animation, loop, delay);
        }
        return null;
    },

    /**
     * !#en Find animation with specified name.
     * !#zh 查找指定名称的动画
     * @method findAnimation
     * @param {String} name
     * @returns {sp.spine.Animation}
     */
    findAnimation (name) {
        if (this._skeleton) {
            return this._skeleton.data.findAnimation(name);
        }
        return null;
    },

    /**
     * !#en Returns track entry by trackIndex.<br>
     * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry object.
     * !#zh 通过 track 索引获取 TrackEntry。<br>
     * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry 对象。
     * @method getCurrent
     * @param trackIndex
     * @return {sp.spine.TrackEntry}
     */
    getCurrent (trackIndex) {
        if (this._state) {
            return this._state.getCurrent(trackIndex);
        }
        return null;
    },

    /**
     * !#en Clears all tracks of animation state.
     * !#zh 清除所有 track 的动画状态。
     * @method clearTracks
     */
    clearTracks () {
        if (this._state) {
            this._state.clearTracks();
        }
    },

    /**
     * !#en Clears track of animation state by trackIndex.
     * !#zh 清除出指定 track 的动画状态。
     * @method clearTrack
     * @param {number} trackIndex
     */
    clearTrack (trackIndex) {
        if (this._state) {
            this._state.clearTrack(trackIndex);
            if (CC_EDITOR && !cc.engine.isPlaying) {
                this._state.update(0);
            }
        }
    },

    /**
     * !#en Set the start event listener.
     * !#zh 用来设置开始播放动画的事件监听。
     * @method setStartListener
     * @param {function} listener
     */
    setStartListener (listener) {
        this._ensureListener();
        this._listener.start = listener;
    },

    /**
     * !#en Set the interrupt event listener.
     * !#zh 用来设置动画被打断的事件监听。
     * @method setInterruptListener
     * @param {function} listener
     */
    setInterruptListener (listener) {
        this._ensureListener();
        this._listener.interrupt = listener;
    },

    /**
     * !#en Set the end event listener.
     * !#zh 用来设置动画播放完后的事件监听。
     * @method setEndListener
     * @param {function} listener
     */
    setEndListener (listener) {
        this._ensureListener();
        this._listener.end = listener;
    },

    /**
     * !#en Set the dispose event listener.
     * !#zh 用来设置动画将被销毁的事件监听。
     * @method setDisposeListener
     * @param {function} listener
     */
    setDisposeListener (listener) {
        this._ensureListener();
        this._listener.dispose = listener;
    },

    /**
     * !#en Set the complete event listener.
     * !#zh 用来设置动画播放一次循环结束后的事件监听。
     * @method setCompleteListener
     * @param {function} listener
     */
    setCompleteListener (listener) {
        this._ensureListener();
        this._listener.complete = listener;
    },

    /**
     * !#en Set the animation event listener.
     * !#zh 用来设置动画播放过程中帧事件的监听。
     * @method setEventListener
     * @param {function} listener
     */
    setEventListener (listener) {
        this._ensureListener();
        this._listener.event = listener;
    },

    /**
     * !#en Set the start event listener for specified TrackEntry (only supported on Web).
     * !#zh 用来为指定的 TrackEntry 设置动画开始播放的事件监听。（只支持 Web 平台）
     * @method setTrackStartListener
     * @param {sp.spine.TrackEntry} entry
     * @param {function} listener
     */
    setTrackStartListener (entry, listener) {
        TrackEntryListeners.getListeners(entry).start = listener;
    },

    /**
     * !#en Set the interrupt event listener for specified TrackEntry (only supported on Web).
     * !#zh 用来为指定的 TrackEntry 设置动画被打断的事件监听。（只支持 Web 平台）
     * @method setTrackInterruptListener
     * @param {sp.spine.TrackEntry} entry
     * @param {function} listener
     */
    setTrackInterruptListener (entry, listener) {
        TrackEntryListeners.getListeners(entry).interrupt = listener;
    },

    /**
     * !#en Set the end event listener for specified TrackEntry (only supported on Web).
     * !#zh 用来为指定的 TrackEntry 设置动画播放结束的事件监听。（只支持 Web 平台）
     * @method setTrackEndListener
     * @param {sp.spine.TrackEntry} entry
     * @param {function} listener
     */
    setTrackEndListener (entry, listener) {
        TrackEntryListeners.getListeners(entry).end = listener;
    },

    /**
     * !#en Set the dispose event listener for specified TrackEntry (only supported on Web).
     * !#zh 用来为指定的 TrackEntry 设置动画即将被销毁的事件监听。（只支持 Web 平台）
     * @method setTrackDisposeListener
     * @param {sp.spine.TrackEntry} entry
     * @param {function} listener
     */
    setTrackDisposeListener(entry, listener){
        TrackEntryListeners.getListeners(entry).dispose = listener;
    },

    /**
     * !#en Set the complete event listener for specified TrackEntry (only supported on Web).
     * !#zh 用来为指定的 TrackEntry 设置动画一次循环播放结束的事件监听。（只支持 Web 平台）
     * @method setTrackCompleteListener
     * @param {sp.spine.TrackEntry} entry
     * @param {function} listener
     * @param {sp.spine.TrackEntry} listener.entry
     * @param {Number} listener.loopCount
     */
    setTrackCompleteListener (entry, listener) {
        TrackEntryListeners.getListeners(entry).complete = function (trackEntry) {
            var loopCount = Math.floor(trackEntry.trackTime / trackEntry.animationEnd); 
            listener(trackEntry, loopCount);
        };
    },

    /**
     * !#en Set the event listener for specified TrackEntry (only supported on Web).
     * !#zh 用来为指定的 TrackEntry 设置动画帧事件的监听。（只支持 Web 平台）
     * @method setTrackEventListener
     * @param {sp.spine.TrackEntry} entry
     * @param {function} listener
     */
    setTrackEventListener (entry, listener) {
        TrackEntryListeners.getListeners(entry).event = listener;
    },

    /**
     * !#en Get the animation state object
     * !#zh 获取
     * @method setTrackEventListener
     * @return {sp.spine.AnimationState} state
     */
    getState () {
        return this._state;
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

    _ensureListener () {
        if (!this._listener) {
            this._listener = new TrackEntryListeners();
            this._state.addListener(this._listener);
        }
    },

    _updateSkeletonData () {
        if (this.skeletonData/* && this.atlasFile*/) {
            let data = this.skeletonData.getRuntimeData();
            if (data) {
                try {
                    this.setSkeletonData(data);
                    this.setAnimationStateData(new spine.AnimationStateData(this._skeleton.data));
                    if (this.defaultSkin) {
                        this._skeleton.setSkinByName(this.defaultSkin);
                    }
                }
                catch (e) {
                    cc.warn(e);
                }
                this.animation = this.defaultAnimation;
            }
        }
    },

    _refreshInspector () {
        // update inspector
        this._updateAnimEnum();
        this._updateSkinEnum();
        Editor.Utils.refreshSelectedInspector('node', this.node.uuid);
    }
});

module.exports = sp.Skeleton;