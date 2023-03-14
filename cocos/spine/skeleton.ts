/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { EDITOR } from 'internal:constants';
import { TrackEntryListeners } from './track-entry-listeners';
import spine from './lib/spine-core.js';
import SkeletonCache, { AnimationCache, AnimationFrame } from './skeleton-cache';
import { AttachUtil } from './attach-util';
import { ccclass, executeInEditMode, help, menu } from '../core/data/class-decorator';
import { UIRenderer } from '../2d/framework/ui-renderer';
import { CCClass, CCObject, Color, Enum, ccenum, logID, warn, RecyclePool, js } from '../core';
import { displayName, displayOrder, editable, override, serializable, tooltip, type, visible } from '../core/data/decorators';
import { SkeletonData } from './skeleton-data';
import { VertexEffectDelegate } from './vertex-effect-delegate';
import { Graphics } from '../2d/components/graphics';
import { MaterialInstance } from '../render-scene';
import { BlendFactor, BlendOp } from '../gfx';
import { legacyCC } from '../core/global-exports';
import { SkeletonSystem } from './skeleton-system';
import { Batcher2D } from '../2d/renderer/batcher-2d';
import { RenderEntity, RenderEntityType } from '../2d/renderer/render-entity';
import { RenderDrawInfo } from '../2d/renderer/render-draw-info';
import { Material, Texture2D } from '../asset/assets';
import { builtinResMgr } from '../asset/asset-manager';
import { Node } from '../scene-graph';

/**
 * @en
 * Animation playback rate.
 * @zh
 * 动画播放速率。
 */
export const timeScale = 1.0;

/**
 * @internal Since v3.7.2, this is an engine private enum, only used in editor.
 */
export enum DefaultSkinsEnum {
    default = 0,
}
ccenum(DefaultSkinsEnum);

/**
 * @internal Since v3.7.2, this is an engine private enum, only used in editor.
 */
export enum DefaultAnimsEnum {
    '<None>' = 0
}
ccenum(DefaultAnimsEnum);

/**
 * @en Enum for animation cache mode type.
 * @zh Spine 动画缓存类型。
 */
export enum AnimationCacheMode {
    /**
     * @en The realtime mode.
     * @zh 实时计算模式。
     */
    REALTIME = 0,
    /**
     * @en The shared cache mode.
     * @zh 共享缓存模式。
     */
    SHARED_CACHE = 1,
    /**
     * @en The private cache mode.
     * @zh 私有缓存模式。
     */
    PRIVATE_CACHE = 2,
}
ccenum(AnimationCacheMode);

function setEnumAttr (obj, propName, enumDef) {
    CCClass.Attr.setClassAttr(obj, propName, 'type', 'Enum');
    CCClass.Attr.setClassAttr(obj, propName, 'enumList', Enum.getList(enumDef));
}

interface AnimationItem {
    animationName: string;
    loop: boolean;
    delay: number;
}

type TrackListener = (x: spine.TrackEntry) => void;
type TrackListener2 = (x: spine.TrackEntry, ev: spine.Event | number) => void;

/**
 * @internal Since v3.7.2, this is an engine private enum.
 */
export enum SpineMaterialType {
    COLORED_TEXTURED = 0,
    TWO_COLORED = 1,
}

/**
 * @internal Since v3.7.2, this is an engine private interface.
 */
export interface SkeletonDrawData {
    material: Material | null;
    texture: Texture2D | null;
    indexOffset: number;
    indexCount: number;
}

/**
 * @en
 * The Sockets attached to bones, synchronous transform with spine animation.
 * @zh
 * Spine 挂点，可附着在目标骨骼上随 spine 动画一起运动。
 * @class SpineSocket
 */
@ccclass('sp.Skeleton.SpineSocket')
export class SpineSocket {
    /**
     * @en Path of the target joint.
     * @zh 此挂点的目标骨骼路径。
     */
    @serializable
    @editable
    public path = '';

    /**
     * @en Transform output node.
     * @zh 此挂点的变换信息输出节点。
     */
    @type(Node)
    @editable
    @serializable
    public target: Node | null = null;

    constructor (path = '', target: Node | null = null) {
        this.path = path;
        this.target = target;
    }
}

js.setClassAlias(SpineSocket, 'sp.Skeleton.SpineSocket');

/**
 * @en
 * The skeleton of Spine <br/>
 * <br/>
 * (Skeleton has a reference to a SkeletonData and stores the state for skeleton instance,
 * which consists of the current pose's bone SRT, slot colors, and which slot attachments are visible. <br/>
 * Multiple skeletons can use the same SkeletonData which includes all animations, skins, and attachments.) <br/>
 * Cocos Creator supports spine versions lower than 3.8.99.
 * @zh
 * Spine 骨骼动画 <br/>
 * <br/>
 * (Skeleton 具有对骨骼数据的引用并且存储了骨骼实例的状态，
 * 它由当前的骨骼动作，slot 颜色，和可见的 slot attachments 组成。<br/>
 * 多个 Skeleton 可以使用相同的骨骼数据，其中包括所有的动画，皮肤和 attachments。
 * Cocos Creator 支持 spine 版本最高到3.8.99。
 * @class Skeleton
 * @extends UIRenderer
 */
@ccclass('sp.Skeleton')
@help('i18n:cc.Spine')
@menu('Spine/Skeleton')
@executeInEditMode
export class Skeleton extends UIRenderer {
    public static SpineSocket = SpineSocket;
    public static AnimationCacheMode = AnimationCacheMode;

    /**
     * @internal Since v3.7.2, this is an engine private interface.
     */
    get drawList () { return this._drawList; }

    protected _updateBuiltinMaterial (): Material {
        const material = builtinResMgr.get<Material>('default-spine-material');
        return material;
    }

    @override
    @type(Material)
    @displayOrder(0)
    @displayName('CustomMaterial')
    get customMaterial () {
        return this._customMaterial;
    }
    set customMaterial (val) {
        this._customMaterial = val;
        this.updateMaterial();
        this.markForUpdateRenderData();
    }

    protected updateMaterial () {
        let mat;
        if (this._customMaterial) mat = this._customMaterial;
        else mat = this._updateBuiltinMaterial();
        this.setMaterial(mat, 0);
        this._cleanMaterialCache();
    }

    /**
     * @en The skeletal animation is paused?
     * @zh 该骨骼动画是否暂停。
     * @property paused
     * @type {Boolean}
     * @default false
     */
    get paused () {
        return this._paused;
    }
    set paused (value: boolean) {
        this._paused = value;
    }

    /** dstBlendFactor
     * @en
     * The skeleton data contains the skeleton information (bind pose bones, slots, draw order,
     * attachments, skins, etc) and animations but does not hold any state.<br/>
     * Multiple skeletons can share the same skeleton data.
     * @zh
     * 骨骼数据包含了骨骼信息（绑定骨骼动作，slots，渲染顺序，
     * attachments，皮肤等等）和动画但不持有任何状态。<br/>
     * 多个 Skeleton 可以共用相同的骨骼数据。
     * @property {sp.SkeletonData} skeletonData
     */
    @editable
    @type(SkeletonData)
    get skeletonData () {
        return this._skeletonData!;
    }
    set skeletonData (value: SkeletonData) {
        if (value) value.resetEnums();
        if (this._skeletonData !== value) {
            this.destroyRenderData();
            this._skeletonData = value as any;
            this._needUpdateSkeltonData = true;
            this.defaultSkin = '';
            this.defaultAnimation = '';
            if (EDITOR && !legacyCC.GAME_VIEW) {
                this._refreshInspector();
            }
            this._updateSkeletonData();
        }
    }

    /**
     * @en The name of current playing animation.
     * @zh 当前播放的动画名称。
     * @property {String} animation
     */

    get animation (): string {
        if (this.isAnimationCached()) {
            return this._animationName;
        }
        const entry = this.getCurrent(0);
        return (entry && entry.animation.name) || '';
    }
    set animation (value: string) {
        if (value) {
            this.setAnimation(0, value, this.loop);
            this.markForUpdateRenderData();
        } else if (!this.isAnimationCached()) {
            this.clearTrack(0);
            this.setToSetupPose();
        }
    }

    /**
     * @internal Since v3.7.2, this is an engine private interface
     */
    @displayName('Default Skin')
    @type(DefaultSkinsEnum)
    @tooltip('i18n:COMPONENT.skeleton.default_skin')
    get _defaultSkinIndex (): number {
        if (this.skeletonData) {
            const skinsEnum = this.skeletonData.getSkinsEnum();
            if (skinsEnum) {
                if (this.defaultSkin === '') {
                    // eslint-disable-next-line no-prototype-builtins
                    if (skinsEnum.hasOwnProperty(0)) {
                        this._defaultSkinIndex = 0;
                        return 0;
                    }
                } else {
                    const skinIndex = skinsEnum[this.defaultSkin];
                    if (skinIndex !== undefined) {
                        return skinIndex;
                    }
                }
            }
        }
        return 0;
    }
    /**
     * @internal Since v3.7.2, this is an engine private interface.
     */
    set _defaultSkinIndex (value: number) {
        let skinsEnum;
        if (this.skeletonData) {
            skinsEnum = this.skeletonData.getSkinsEnum();
        }
        if (!skinsEnum) {
            console.error(`${this.name} skin enums are invalid`);
            return;
        }

        const skinName = skinsEnum[value];
        if (skinName !== undefined) {
            this.defaultSkin = skinName;
            this.setSkin(this.defaultSkin);
            if (EDITOR && !legacyCC.GAME_VIEW /* && !cc.engine.isPlaying */) {
                this._refreshInspector();
                this.markForUpdateRenderData();
            }
        } else {
            console.error(`${this.name} skin enums are invalid`);
        }
    }

    // value of 0 represents no animation
    /**
     * @internal
     */
    @displayName('Animation')
    @type(DefaultAnimsEnum)
    @tooltip('i18n:COMPONENT.skeleton.animation')
    get _animationIndex () {
        const animationName = EDITOR && !legacyCC.GAME_VIEW ? this.defaultAnimation : this.animation;
        if (this.skeletonData) {
            if (animationName) {
                const animsEnum = this.skeletonData.getAnimsEnum();
                if (animsEnum) {
                    const animIndex = animsEnum[animationName];
                    if (animIndex !== undefined) {
                        return animIndex;
                    }
                }
            } else {
                this._refreshInspector();
            }
        }
        return 0;
    }
    /**
     * @internal
     */
    set _animationIndex (value: number) {
        let animsEnum;
        if (this.skeletonData) {
            animsEnum = this.skeletonData.getAnimsEnum();
        }
        if (!animsEnum) {
            console.error(`${this.name} animation enums are invalid`);
            return;
        }
        const animName = animsEnum[value];
        if (animName !== undefined) {
            this.animation = animName;
            if (EDITOR && !legacyCC.GAME_VIEW) {
                this.defaultAnimation = animName;
                this._refreshInspector();
            } else {
                this.animation = animName;
            }
        } else {
            console.error(`${this.name} animation enums are invalid`);
        }
    }

    /**
     * @en Animation mode, with options for real-time mode, private cached, or public cached mode.
     * @zh 动画模式，可选实时模式，私有 cached 或公共 cached 模式。
     */
    @displayName('Animation Cache Mode')
    @tooltip('i18n:COMPONENT.skeleton.animation_cache_mode')
    @editable
    @type(AnimationCacheMode)
    get defaultCacheMode () {
        return this._defaultCacheMode;
    }
    set defaultCacheMode (mode: AnimationCacheMode) {
        this._defaultCacheMode = mode;
        this.setAnimationCacheMode(this._defaultCacheMode);
    }

    /**
     * @en Whether play animations in loop mode.
     * @zh 是否循环播放当前骨骼动画。
     */
    @serializable
    @tooltip('i18n:COMPONENT.skeleton.loop')
    public loop = true;

    /**
     * @en Whether premultipliedAlpha enabled.
     * @zh 是否启用 alpha 预乘。
     */
    @editable
    @tooltip('i18n:COMPONENT.skeleton.premultipliedAlpha')
    get premultipliedAlpha (): boolean { return this._premultipliedAlpha; }
    set premultipliedAlpha (v: boolean) {
        if (v !== this._premultipliedAlpha) {
            this._premultipliedAlpha = v;
            this.markForUpdateRenderData();
        }
    }

    /**
     * @en The time scale of this skeleton.
     * @zh 当前骨骼中所有动画的时间缩放率。
     */
    @tooltip('i18n:COMPONENT.skeleton.time_scale')
    @editable
    get timeScale () { return this._timeScale; }
    set timeScale (value) {
        if (value !== this._timeScale) {
            this._timeScale = value;
        }
    }

    /**
     * @en Indicates whether open debug slots.
     * @zh 是否显示 slot 的 debug 信息。
     */
    @editable
    @tooltip('i18n:COMPONENT.skeleton.debug_slots')
    get debugSlots () { return this._debugSlots; }
    set debugSlots (v: boolean) {
        if (v !== this._debugSlots) {
            this._debugSlots = v;
            this._updateDebugDraw();
            this.markForUpdateRenderData();
        }
    }

    /**
     * @en Indicates whether open debug bones.
     * @zh 是否显示 bone 的 debug 信息。
     */
    @editable
    @tooltip('i18n:COMPONENT.skeleton.debug_bones')
    get debugBones () { return this._debugBones; }
    set debugBones (v: boolean) {
        if (v !== this._debugBones) {
            this._debugBones = v;
            this._updateDebugDraw();
            this.markForUpdateRenderData();
        }
    }

    /**
     * @en Indicates whether open debug mesh.
     * @zh 是否显示 mesh 的 debug 信息。
     */
    @editable
    @tooltip('i18n:COMPONENT.skeleton.debug_mesh')
    get debugMesh () { return this._debugMesh; }
    set debugMesh (value) {
        if (value !== this._debugMesh) {
            this._debugMesh = value;
            this._updateDebugDraw();
            this.markForUpdateRenderData();
        }
    }

    /**
     * @en Enabled two color tint.
     * @zh 是否启用染色效果。
     */
    @editable
    @tooltip('i18n:COMPONENT.skeleton.use_tint')
    get useTint () { return this._useTint; }
    set useTint (value) {
        if (value !== this._useTint) {
            this._useTint = value;
            this._updateUseTint();
        }
    }
    /**
     * @en If rendering a large number of identical textures and simple skeletal animations,
     * enabling batching can reduce the number of draw calls and improve rendering performance.
     * @zh 如果渲染大量相同纹理，且结构简单的骨骼动画，开启合批可以降低 draw call 数量提升渲染性能。
     */
    @editable
    @tooltip('i18n:COMPONENT.skeleton.enabled_batch')
    get enableBatch () { return this._enableBatch; }
    set enableBatch (value) {
        if (value !== this._enableBatch) {
            this._enableBatch = value;
            this._updateBatch();
        }
    }

    /**
     * @en
     * The bone sockets this animation component maintains.<br>
     * A SpineSocket object contains a path reference to bone, and a target node.
     * @zh
     * 当前动画组件维护的挂点数组。一个挂点组件包括动画节点路径和目标节点。
     */
    @type([SpineSocket])
    @tooltip('i18n:animation.sockets')
    get sockets (): SpineSocket[] {
        return this._sockets;
    }

    set sockets (val: SpineSocket[]) {
        if (EDITOR && !legacyCC.GAME_VIEW) {
            this._verifySockets(val);
        }
        this._sockets = val;
        this._updateSocketBindings();
        this.attachUtil._syncAttachedNode();
    }

    /**
     * @en
     * All the target nodes been set in the array of SpineSocket.
     * @zh 当前所有设置在 SpineSocket 数组中的 target nodes。
     */
    get socketNodes () { return this._socketNodes; }

    // Frame cache
    /**
     * @internal
     */
    public _frameCache: AnimationCache | null = null;
    // Cur frame
    /**
     * @internal
     */
    public _curFrame: AnimationFrame | null = null;

    /**
     * @internal
     */
    public _effectDelegate: VertexEffectDelegate | null | undefined = null;
    /**
     * @internal
     */
    public _skeleton: spine.Skeleton | null;
    /**
     * @internal
     */
    public _clipper?: spine.SkeletonClipping;
    /**
     * @internal
     */
    public _debugRenderer: Graphics | null;
    /**
     * @internal
     */
    public _startSlotIndex;
    /**
     * @internal
     */
    public _endSlotIndex;
    /**
     * @internal
     */
    public _startEntry;
    /**
     * @internal
     */
    public _endEntry;
    /**
     * @internal
     */
    public attachUtil: AttachUtil;
    /**
     * @internal
     */
    public maxVertexCount = 0;
    /**
     * @internal
     */
    public maxIndexCount = 0;

    protected _materialCache: { [key: string]: MaterialInstance } = {} as any;
    protected _enumSkins: any = Enum({});
    protected _enumAnimations: any = Enum({});

    // Play times
    protected _playTimes = 0;
    // Time scale
    @serializable
    protected _timeScale = 1;
    // Paused or playing state
    protected _paused = false;

    // Below properties will effect when cache mode is SHARED_CACHE or PRIVATE_CACHE.
    // accumulate time
    protected _accTime = 0;
    // Play times counter
    protected _playCount = 0;
    // Skeleton cache
    protected _skeletonCache: SkeletonCache | null = null;
    // Animation name
    protected _animationName = '';
    // Animation queue
    protected _animationQueue: AnimationItem[] = [];
    // Head animation info of
    protected _headAniInfo: AnimationItem | null = null;
    // Is animation complete.
    protected _isAniComplete = true;
    // Is need update skeltonData
    protected _needUpdateSkeltonData = true;

    @serializable
    protected _useTint = false;
    // Record pre cache mode.
    @serializable
    protected _preCacheMode = -1;
    @serializable
    protected _cacheMode = AnimationCacheMode.REALTIME;
    @serializable
    protected _defaultCacheMode: AnimationCacheMode = AnimationCacheMode.REALTIME;
    @serializable
    protected _debugBones = false;
    @serializable
    protected _debugSlots = false;

    @serializable
    protected _skeletonData: SkeletonData | null = null;

    /**
     * @en Indicates whether to enable premultiplied alpha.
     * You should disable this option when image's transparent area appears to have opaque pixels,
     * or enable this option when image's half transparent area appears to be darken.
     * @zh 是否启用贴图预乘。
     * 当图片的透明区域出现色块时需要关闭该选项，当图片的半透明区域颜色变黑时需要启用该选项。
     */
    @serializable
    protected _premultipliedAlpha = true;

    // 由于 spine 的 skin 是无法二次替换的，所以只能设置默认的 skin
    /**
     * @en
     * The name of default skin.
     * @zh
     * 默认的皮肤名称。
     * @property {String} defaultSkin
     */
    @serializable
    @visible(false)
    protected defaultSkin = '';

    /**
     * @en
     * The name of default animation.
     * @zh
     * 默认的动画名称。
     * @property {String} defaultAnimation
     */
    @visible(false)
    @serializable
    protected defaultAnimation = '';

    @serializable
    protected _enableBatch = false;

    @serializable
    protected _sockets: SpineSocket[] = [];

    protected _drawIdx = 0;
    protected _drawList = new RecyclePool<SkeletonDrawData>(() => ({
        material: null,
        texture: null,
        indexOffset: 0,
        indexCount: 0,
    }), 1);
    @serializable
    protected _debugMesh = false;
    protected _rootBone: spine.Bone | null;
    protected _state?: spine.AnimationState;
    protected _listener: spine.AnimationStateListener | null;

    protected _socketNodes: Map<number, Node> = new Map();
    protected _cachedSockets: Map<string, number> = new Map<string, number>();
    private _drawInfoList: RenderDrawInfo[] = [];

    private requestDrawInfo (idx: number) {
        if (!this._drawInfoList[idx]) {
            this._drawInfoList[idx] = new RenderDrawInfo();
        }
        return this._drawInfoList[idx];
    }
    // CONSTRUCTOR
    constructor () {
        super();
        this._effectDelegate = null;
        this._skeleton = null;
        this._rootBone = null;
        this._listener = null;
        this._debugRenderer = null;
        this._startSlotIndex = -1;
        this._endSlotIndex = -1;
        this._startEntry = { animation: { name: '' }, trackIndex: 0 } as any;
        this._endEntry = { animation: { name: '' }, trackIndex: 0 } as any;
        this.attachUtil = new AttachUtil();
        setEnumAttr(this, '_defaultSkinIndex', this._enumSkins);
        setEnumAttr(this, '_animationIndex', this._enumAnimations);
        this._useVertexOpacity = true;
    }

    /**
     * @en
     * Sets runtime skeleton data to sp.Skeleton.<br>
     * This method is different from the `skeletonData` property. This method is passed in the raw data provided by the
     *  Spine runtime, and the skeletonData type is the asset type provided by Creator.
     * @zh
     * 设置底层运行时用到的 SkeletonData。<br>
     * 这个接口有别于 `skeletonData` 属性，这个接口传入的是 Spine runtime 提供的原始数据，而 skeletonData 的类型是 Creator 提供的资源类型。
     * @method setSkeletonData
     * @param {sp.spine.SkeletonData} skeletonData
     */
    public setSkeletonData (skeletonData: spine.SkeletonData) {
        const uiTrans = this.node._uiProps.uiTransformComp!;
        uiTrans.setContentSize(skeletonData.width, skeletonData.height);
        if (skeletonData.width !== 0) uiTrans.anchorX = Math.abs(skeletonData.x) / skeletonData.width;
        if (skeletonData.height !== 0) uiTrans.anchorY = Math.abs(skeletonData.y) / skeletonData.height;

        if (!EDITOR || legacyCC.GAME_VIEW) {
            if (this._cacheMode === AnimationCacheMode.SHARED_CACHE) {
                this._skeletonCache = SkeletonCache.sharedCache;
            } else if (this._cacheMode === AnimationCacheMode.PRIVATE_CACHE) {
                this._skeletonCache = new SkeletonCache();
                this._skeletonCache.enablePrivateMode();
            }
        }

        if (this.isAnimationCached()) {
            if (this.debugBones || this.debugSlots) {
                warn('Debug bones or slots is invalid in cached mode');
            }
            const skeletonInfo = this._skeletonCache!.getSkeletonCache((this.skeletonData as any)._uuid, skeletonData);
            this._skeleton = skeletonInfo.skeleton;
            this._clipper = skeletonInfo.clipper;
            this._rootBone = this._skeleton.getRootBone();
        } else {
            this._skeleton = new spine.Skeleton(skeletonData);
            this._clipper = new spine.SkeletonClipping();
            this._rootBone = this._skeleton.getRootBone();
        }
        // Recreate render data and mark dirty
        this._flushAssembler();
    }

    /**
     * @en Sets slots visible range.
     * @zh 设置骨骼插槽可视范围。
     */
    public setSlotsRange (startSlotIndex, endSlotIndex) {
        if (this.isAnimationCached()) {
            warn('Slots visible range can not be modified in cached mode.');
        } else {
            this._startSlotIndex = startSlotIndex;
            this._endSlotIndex = endSlotIndex;
        }
    }

    /**
     * @en Sets animation state data.<br>
     * The parameter type is {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.AnimationStateData.
     * @zh 设置动画状态数据。<br>
     * 参数是 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.AnimationStateData。
     */
    public setAnimationStateData (stateData) {
        if (this.isAnimationCached()) {
            warn('\'setAnimationStateData\' interface can not be invoked in cached mode.');
        } else {
            const state = new spine.AnimationState(stateData);
            if (this._listener) {
                if (this._state) {
                    this._state.removeListener(this._listener);
                }
                state.addListener(this._listener);
            }
            this._state = state;
        }
    }

    // IMPLEMENT
    public __preload () {
        super.__preload();
        if (EDITOR && !legacyCC.GAME_VIEW) {
            const Flags = CCObject.Flags;
            this._objFlags |= (Flags.IsAnchorLocked | Flags.IsSizeLocked);
            // this._refreshInspector();
        }

        const children = this.node.children;
        for (let i = 0, n = children.length; i < n; i++) {
            const child = children[i];
            if (child && child.name === 'DEBUG_DRAW_NODE') {
                child.destroy();
            }
        }

        this._updateSkeletonData();
        this._updateDebugDraw();

        if (EDITOR && !legacyCC.GAME_VIEW) { this._refreshInspector(); }
    }

    /**
     * @en
     * It's best to set cache mode before set property 'dragonAsset', or will waste some cpu time.
     * If set the mode in editor, then no need to worry about order problem.
     * @zh
     * 若想切换渲染模式，最好在设置'dragonAsset'之前，先设置好渲染模式，否则有运行时开销。
     * 若在编辑中设置渲染模式，则无需担心设置次序的问题。
     *
     * @example
     * skeleton.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.SHARED_CACHE);
     */
    public setAnimationCacheMode (cacheMode: AnimationCacheMode) {
        if (this._preCacheMode !== cacheMode) {
            this._cacheMode = cacheMode;
            this._needUpdateSkeltonData = true;
            this._updateSkeletonData();
            this._updateUseTint();
            this._updateSocketBindings();
            this.markForUpdateRenderData();
        }
    }

    /**
     * @en Whether in cached mode.
     * @zh 当前是否处于缓存模式。
     */
    public isAnimationCached () {
        if (EDITOR && !legacyCC.GAME_VIEW) return false;
        return this._cacheMode !== AnimationCacheMode.REALTIME;
    }

    /**
     * @en Update skeleton animation.
     * @zh 更新骨骼动画。
     * @param dt @en delta time. @zh 时间差。
     */
    public updateAnimation (dt: number) {
        this.markForUpdateRenderData();
        if (EDITOR && !legacyCC.GAME_VIEW) return;
        if (this.paused) return;

        dt *= this._timeScale * timeScale;
        if (this.isAnimationCached()) {
            // Cache mode and has animation queue.
            if (this._isAniComplete) {
                if (this._animationQueue.length === 0 && !this._headAniInfo) {
                    const frameCache = this._frameCache;
                    if (frameCache && frameCache.isInvalid()) {
                        frameCache.updateToFrame();
                        const frames = frameCache.frames;
                        this._curFrame = frames[frames.length - 1];
                    }
                    return;
                }
                if (!this._headAniInfo) {
                    this._headAniInfo = this._animationQueue.shift()!;
                }
                this._accTime += dt;
                if (this._accTime > this._headAniInfo.delay) {
                    const aniInfo = this._headAniInfo;
                    this._headAniInfo = null;
                    this.setAnimation(0, aniInfo.animationName, aniInfo.loop);
                }
                return;
            }

            this._updateCache(dt);
        } else {
            this._updateRealtime(dt);
        }
    }

    /**
     * @en Sets vertex effect delegate.
     * @zh 设置顶点特效动画代理。
     * @param effectDelegate @en Vertex effect delegate. @zh 顶点特效代理。
     */
    public setVertexEffectDelegate (effectDelegate: VertexEffectDelegate | null | undefined) {
        this._effectDelegate = effectDelegate;
    }

    /**
     * @en Sets the bones and slots to the setup pose.
     * @zh 还原到起始动作。
     * @method setToSetupPose
     */
    public setToSetupPose () {
        if (this._skeleton) {
            this._skeleton.setToSetupPose();
        }
    }

    /**
     * @en
     * Sets the bones to the setup pose,
     * using the values from the `BoneData` list in the `SkeletonData`.
     * @zh
     * 设置 bone 到起始动作。
     * 使用 SkeletonData 中的 BoneData 列表中的值。
     * @method setBonesToSetupPose
     */
    public setBonesToSetupPose () {
        if (this._skeleton) {
            this._skeleton.setBonesToSetupPose();
        }
    }

    /**
     * @en
     * Sets the slots to the setup pose,
     * using the values from the `SlotData` list in the `SkeletonData`.
     * @zh
     * 设置 slot 到起始动作。
     * 使用 SkeletonData 中的 SlotData 列表中的值。
     * @method setSlotsToSetupPose
     */
    public setSlotsToSetupPose () {
        if (this._skeleton) {
            this._skeleton.setSlotsToSetupPose();
        }
    }

    /**
     * @en
     * Updating an animation cache to calculate all frame data in the animation is a cost in
     * performance due to calculating all data in a single frame.
     * To update the cache, use the invalidAnimationCache method with high performance.
     * @zh
     * 更新某个动画缓存, 预计算动画中所有帧数据，由于在单帧计算所有数据，所以较消耗性能。
     * 若想更新缓存，可使用 invalidAnimationCache 方法，具有较高性能。
     * @method updateAnimationCache
     * @param {String} animName
     */
    public updateAnimationCache (animName) {
        if (!this.isAnimationCached()) return;
        const uuid = this._skeletonData!._uuid;
        if (this._skeletonCache) {
            this._skeletonCache.updateAnimationCache(uuid, animName);
        }
    }

    /**
     * @en
     * Invalidates the animation cache, which is then recomputed on each frame.
     * @zh
     * 使动画缓存失效，之后会在每帧重新计算。
     * @method invalidAnimationCache
     */
    public invalidAnimationCache () {
        if (!this.isAnimationCached()) return;
        if (this._skeletonCache) {
            this._skeletonCache.invalidAnimationCache(this._skeletonData!._uuid);
        }
    }

    /**
     * @en
     * Finds a bone by name.
     * This does a string comparison for every bone.<br>
     * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Bone object.
     * @zh
     * 通过名称查找 bone。
     * 这里对每个 bone 的名称进行了对比。<br>
     * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Bone 对象。
     *
     * @method findBone
     * @param {String} boneName
     * @return {sp.spine.Bone}
     */
    public findBone (boneName: string) {
        if (this._skeleton) {
            return this._skeleton.findBone(boneName);
        }
        return null;
    }

    /**
     * @en
     * Finds a slot by name. This does a string comparison for every slot.<br>
     * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Slot object.
     * @zh
     * 通过名称查找 slot。这里对每个 slot 的名称进行了比较。<br>
     * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Slot 对象。
     *
     * @method findSlot
     * @param {String} slotName
     * @return {sp.spine.Slot}
     */
    public findSlot (slotName: string) {
        if (this._skeleton) {
            return this._skeleton.findSlot(slotName);
        }
        return null;
    }

    /**
     * @en
     * Finds a skin by name and makes it the active skin.
     * This does a string comparison for every skin.<br>
     * Note that setting the skin does not change which attachments are visible.<br>
     * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Skin object.
     * @zh
     * 按名称查找皮肤，激活该皮肤。这里对每个皮肤的名称进行了比较。<br>
     * 注意：设置皮肤不会改变 attachment 的可见性。<br>
     * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Skin 对象。
     *
     * @method setSkin
     * @param {String} skinName
     */
    public setSkin (skinName: string) {
        if (this._skeleton) {
            this._skeleton.setSkinByName(skinName);
            this._skeleton.setSlotsToSetupPose();
        }
        this.invalidAnimationCache();
    }

    /**
     * @en
     * Returns the attachment for the slot and attachment name.
     * The skeleton looks first in its skin, then in the skeleton data’s default skin.<br>
     * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Attachment object.
     * @zh
     * 通过 slot 和 attachment 的名称获取 attachment。Skeleton 优先查找它的皮肤，然后才是 Skeleton Data 中默认的皮肤。<br>
     * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Attachment 对象。
     *
     * @method getAttachment
     * @param {String} slotName
     * @param {String} attachmentName
     * @return {sp.spine.Attachment}
     */
    public getAttachment (slotName: string, attachmentName: string) {
        if (this._skeleton) {
            return this._skeleton.getAttachmentByName(slotName, attachmentName);
        }
        return null;
    }

    /**
     * @en
     * Sets the attachment for the slot and attachment name.
     * The skeleton looks first in its skin, then in the skeleton data’s default skin.
     * @zh
     * 通过 slot 和 attachment 的名字来设置 attachment。
     * Skeleton 优先查找它的皮肤，然后才是 Skeleton Data 中默认的皮肤。
     * @method setAttachment
     * @param {String} slotName
     * @param {String} attachmentName
     */
    public setAttachment (slotName: string, attachmentName: string) {
        if (this._skeleton) {
            this._skeleton.setAttachment(slotName, attachmentName);
        }
        this.invalidAnimationCache();
    }

    /**
     * @en
     * Get Texture Atlas used in attachments.
     * @zh 获取附件图集。
     * @param regionAttachment An attachment type of RegionAttachment or BoundingBoxAttachment.
     * @return TextureRegion contains texture and atlas text information.
     */
    public getTextureAtlas (regionAttachment: spine.RegionAttachment | spine.BoundingBoxAttachment) {
        return (regionAttachment as spine.RegionAttachment).region;
    }

    // ANIMATION
    /**
     * @en
     * Mix applies all keyframe values,
     * interpolated for the specified time and mixed with the current values.
     * @zh 为所有关键帧设定混合及混合时间（从当前值开始差值）。
     * @method setMix
     * @param {String} fromAnimation
     * @param {String} toAnimation
     * @param {Number} duration
     */
    public setMix (fromAnimation: string, toAnimation: string, duration: number): void {
        if (this._state) {
            this._state.data.setMix(fromAnimation, toAnimation, duration);
        }
    }

    /**
     * @en Set the current animation. Any queued animations are cleared.<br>
     * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry object.
     * @zh 设置当前动画。队列中的任何的动画将被清除。<br>
     * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry 对象。
     * @method setAnimation
     * @param {Number} trackIndex
     * @param {String} name
     * @param {Boolean} loop
     * @return {sp.spine.TrackEntry}
     */
    public setAnimation (trackIndex: number, name: string, loop: boolean) {
        this._playTimes = loop ? 0 : 1;
        this._animationName = name;

        if (this.isAnimationCached()) {
            if (trackIndex !== 0) {
                warn('Track index can not greater than 0 in cached mode.');
            }
            if (!this._skeletonCache) return null;
            let cache = this._skeletonCache.getAnimationCache(this._skeletonData!._uuid, name);
            if (!cache) {
                cache = this._skeletonCache.initAnimationCache(this._skeletonData!._uuid, name);
            }
            if (cache) {
                this._isAniComplete = false;
                this._accTime = 0;
                this._playCount = 0;
                this._frameCache = cache;
                if (this._socketNodes.size > 0) {
                    this._frameCache.enableCacheAttachedInfo();
                }
                this._frameCache.updateToFrame(0);
                this._curFrame = this._frameCache.frames[0];
            }
        } else if (this._skeleton) {
            const animation = this._skeleton.data.findAnimation(name);
            if (!animation) {
                logID(7509, name);
                return null;
            }
            const res = this._state!.setAnimationWith(trackIndex, animation, loop);
            this._state!.apply(this._skeleton);
            return res;
        }
        return null;
    }

    /**
     * @en Adds an animation to be played delay seconds after the current or last queued animation.<br>
     * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry object.
     * @zh 添加一个动画到动画队列尾部，还可以延迟指定的秒数。<br>
     * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry 对象。
     * @method addAnimation
     * @param {Number} trackIndex
     * @param {String} name
     * @param {Boolean} loop
     * @param {Number} [delay=0]
     * @return {sp.spine.TrackEntry}
     */
    public addAnimation (trackIndex: number, name: string, loop: boolean, delay?: number) {
        delay = delay || 0;
        if (this.isAnimationCached()) {
            if (trackIndex !== 0) {
                warn('Track index can not greater than 0 in cached mode.');
            }
            this._animationQueue.push({ animationName: name, loop, delay });
        } else if (this._skeleton) {
            const animation = this._skeleton.data.findAnimation(name);
            if (!animation) {
                logID(7510, name);
                return null;
            }
            return this._state?.addAnimationWith(trackIndex, animation, loop, delay);
        }
        return null;
    }

    /**
     * @en Find animation with specified name.
     * @zh 查找指定名称的动画。
     * @method findAnimation
     * @param {String} name
     * @returns {sp.spine.Animation}
     */
    public findAnimation (name: string) {
        if (this._skeleton) {
            return this._skeleton.data.findAnimation(name);
        }
        return null;
    }

    /**
     * @en Returns track entry by trackIndex.<br>
     * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry object.
     * @zh 通过 track 索引获取 TrackEntry。<br>
     * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry 对象。
     * @method getCurrent
     * @param trackIndex
     * @return {sp.spine.TrackEntry}
     */
    public getCurrent (trackIndex: number) {
        if (this.isAnimationCached()) {
            warn('\'getCurrent\' interface can not be invoked in cached mode.');
        } else if (this._state) {
            return this._state.getCurrent(trackIndex);
        }
        return null;
    }

    /**
     * @en Clears all tracks of animation state.
     * @zh 清除所有 track 的动画状态。
     * @method clearTracks
     */
    public clearTracks () {
        if (this.isAnimationCached()) {
            warn('\'clearTracks\' interface can not be invoked in cached mode.');
        } else if (this._state) {
            this._state.clearTracks();
            this.setToSetupPose();
        }
    }

    /**
     * @en Clears track of animation state by trackIndex.
     * @zh 清除出指定 track 的动画状态。
     * @method clearTrack
     * @param {number} trackIndex
     */
    public clearTrack (trackIndex: number) {
        if (this.isAnimationCached()) {
            warn('\'clearTrack\' interface can not be invoked in cached mode.');
        } else if (this._state) {
            this._state.clearTrack(trackIndex);
            if (EDITOR && !legacyCC.GAME_VIEW/* && !cc.engine.isPlaying */) {
                this._state.update(0);
            }
        }
    }

    /**
     * @en Sets the start event listener.
     * @zh 用来设置开始播放动画的事件监听。
     * @method setStartListener
     * @param {function} listener
     */
    public setStartListener (listener: TrackListener) {
        this._ensureListener();
        this._listener!.start = listener;
    }

    /**
     * @en Sets the interrupt event listener.
     * @zh 用来设置动画被打断的事件监听。
     * @method setInterruptListener
     * @param {function} listener
     */
    public setInterruptListener (listener: TrackListener) {
        this._ensureListener();
        this._listener!.interrupt = listener;
    }

    /**
     * @en Sets the end event listener.
     * @zh 用来设置动画播放完后的事件监听。
     * @method setEndListener
     * @param {function} listener
     */
    public setEndListener (listener: TrackListener) {
        this._ensureListener();
        this._listener!.end = listener;
    }

    /**
     * @en Sets the dispose event listener.
     * @zh 用来设置动画将被销毁的事件监听。
     * @method setDisposeListener
     * @param {function} listener
     */
    public setDisposeListener (listener: TrackListener) {
        this._ensureListener();
        this._listener!.dispose = listener;
    }

    /**
     * @en Sets the complete event listener.
     * @zh 用来设置动画播放一次循环结束后的事件监听。
     * @method setCompleteListener
     * @param {function} listener
     */
    public setCompleteListener (listener: TrackListener) {
        this._ensureListener();
        this._listener!.complete = listener;
    }

    /**
     * @en Sets the animation event listener.
     * @zh 用来设置动画播放过程中帧事件的监听。
     * @method setEventListener
     * @param {function} listener
     */
    public setEventListener (listener: TrackListener2) {
        this._ensureListener();
        this._listener!.event = listener;
    }

    /**
     * @en Sets the start event listener for specified TrackEntry.
     * @zh 用来为指定的 TrackEntry 设置动画开始播放的事件监听。
     * @method setTrackStartListener
     * @param {sp.spine.TrackEntry} entry
     * @param {function} listener
     */
    public setTrackStartListener (entry: spine.TrackEntry, listener: TrackListener) {
        TrackEntryListeners.getListeners(entry).start = listener;
    }

    /**
     * @en Sets the interrupt event listener for specified TrackEntry.
     * @zh 用来为指定的 TrackEntry 设置动画被打断的事件监听。
     * @method setTrackInterruptListener
     * @param {sp.spine.TrackEntry} entry
     * @param {function} listener
     */
    public setTrackInterruptListener (entry: spine.TrackEntry, listener: TrackListener) {
        TrackEntryListeners.getListeners(entry).interrupt = listener;
    }

    /**
     * @en Sets the end event listener for specified TrackEntry.
     * @zh 用来为指定的 TrackEntry 设置动画播放结束的事件监听。
     * @method setTrackEndListener
     * @param {sp.spine.TrackEntry} entry
     * @param {function} listener
     */
    public setTrackEndListener (entry: spine.TrackEntry, listener: TrackListener) {
        TrackEntryListeners.getListeners(entry).end = listener;
    }

    /**
     * @en Sets the dispose event listener for specified TrackEntry.
     * @zh 用来为指定的 TrackEntry 设置动画即将被销毁的事件监听。
     * @method setTrackDisposeListener
     * @param {sp.spine.TrackEntry} entry
     * @param {function} listener
     */
    public setTrackDisposeListener (entry: spine.TrackEntry, listener: TrackListener) {
        TrackEntryListeners.getListeners(entry).dispose = listener;
    }

    /**
     * @en Sets the complete event listener for specified TrackEntry.
     * @zh 用来为指定的 TrackEntry 设置动画一次循环播放结束的事件监听。
     * @method setTrackCompleteListener
     * @param {sp.spine.TrackEntry} entry
     * @param {function} listener
     * @param {sp.spine.TrackEntry} listener.entry
     * @param {Number} listener.loopCount
     */
    public setTrackCompleteListener (entry: spine.TrackEntry, listener: TrackListener2) {
        TrackEntryListeners.getListeners(entry).complete = function (trackEntry) {
            const loopCount = Math.floor(trackEntry.trackTime / trackEntry.animationEnd);
            listener(trackEntry, loopCount);
        };
    }

    /**
     * @en Sets the event listener for specified TrackEntry.
     * @zh 用来为指定的 TrackEntry 设置动画帧事件的监听。
     * @method setTrackEventListener
     * @param {sp.spine.TrackEntry} entry
     * @param {function} listener
     */
    public setTrackEventListener (entry: spine.TrackEntry, listener: TrackListener|TrackListener2) {
        TrackEntryListeners.getListeners(entry).event = listener;
    }

    /**
     * @en Gets the animation state object.
     * @zh 获取动画状态。
     * @method getState
     * @return {sp.spine.AnimationState} state
     */
    public getState () {
        return this._state;
    }

    /**
     * @en Be called when component state becomes available.
     * @zh 组件状态变为可用时调用。
     */
    public onEnable () {
        super.onEnable();
        this._flushAssembler();
        SkeletonSystem.getInstance().add(this);
    }
    /**
     * @en Be called when component state becomes disabled.
     * @zh 组件状态变为禁用状态时调用。
     */
    public onDisable () {
        super.onDisable();
        SkeletonSystem.getInstance().remove(this);
    }
    /**
     * @en Be called before components are destroyed.
     * @zh 组件被销毁前调用。
     */
    public onDestroy () {
        this._cleanMaterialCache();
        this._drawList.destroy();
        super.onDestroy();
    }
    /**
     * @en Call this method to destroy the rendering data.
     * @zh 调用该方法销毁渲染数据。
     */
    public destroyRenderData () {
        this._drawList.reset();
        super.destroyRenderData();
    }

    private getMaterialTemplate (): Material {
        if (this.customMaterial !== null) return this.customMaterial;
        if (this.material) return this.material;
        this.updateMaterial();
        return this.material!;
    }
    /**
     * @internal Since v3.7.2, this is an engine private interface.
     */
    public getMaterialForBlendAndTint (src: BlendFactor, dst: BlendFactor, type: SpineMaterialType): MaterialInstance {
        const key = `${type}/${src}/${dst}`;
        let inst = this._materialCache[key];
        if (inst) {
            return inst;
        }

        const material = this.getMaterialTemplate();
        const matInfo = {
            parent: material,
            subModelIdx: 0,
            owner: this,
        };
        inst = new MaterialInstance(matInfo);
        this._materialCache[key] = inst;
        inst.overridePipelineStates({
            blendState: {
                blendColor: Color.WHITE,
                targets: [{
                    blendEq: BlendOp.ADD,
                    blendAlphaEq: BlendOp.ADD,
                    blendSrc: src,
                    blendDst: dst,
                    blendSrcAlpha: src,
                    blendDstAlpha: dst,
                }],
            },
        });
        let useTwoColor = false;
        if (type === SpineMaterialType.TWO_COLORED) {
            useTwoColor = true;
        }
        const useLocal = !this._enableBatch;
        inst.recompileShaders({ TWO_COLORED: useTwoColor, USE_LOCAL: useLocal });
        return inst;
    }

    // For Redo, Undo
    // call markForUpdateRenderData to make sure renderData will be re-built.
    /**
     * @internal Since v3.7.2, this is an engine private interface.
     */
    public onRestore () {
        this.updateMaterial();
        this.markForUpdateRenderData();
    }

    /**
     * @en Query all bones that can attach sockets.
     * @zh 查询所有可以添加挂点的所有骨骼。
     * @return String typed array of bones's path.
     */
    public querySockets () {
        if (!this._skeleton) {
            return [];
        }
        if (this._cachedSockets.size === 0) {
            this._indexBoneSockets();
        }

        if (this._cachedSockets.size > 0) {
            return Array.from(this._cachedSockets.keys()).sort();
        }
        return [];
    }

    /**
     * @internal
     */
    public _requestDrawData (material: Material, texture: Texture2D, indexOffset: number, indexCount: number) {
        const draw = this._drawList.add();
        draw.material = material;
        draw.texture = texture;
        draw.indexOffset = indexOffset;
        draw.indexCount = indexCount;
        return draw;
    }
    /**
     * @en Submit rendering data to batcher2d.
     * @zh 提交渲染数据。
     */
    protected _render (batcher: Batcher2D) {
        let indicesCount = 0;
        if (this.renderData && this._drawList) {
            const rd = this.renderData;
            const chunk = rd.chunk;
            const accessor = chunk.vertexAccessor;
            const meshBuffer = rd.getMeshBuffer()!;
            const origin = meshBuffer.indexOffset;
            // Fill index buffer
            for (let i = 0; i < this._drawList.length; i++) {
                this._drawIdx = i;
                const dc = this._drawList.data[i];
                if (dc.texture) {
                    batcher.commitMiddleware(this, meshBuffer, origin + dc.indexOffset,
                        dc.indexCount, dc.texture, dc.material!, this._enableBatch);
                }
                indicesCount += dc.indexCount;
            }
            const subIndices = rd.indices!.subarray(0, indicesCount);
            accessor.appendIndices(chunk.bufferId, subIndices);
        }
    }

    // RENDERER

    /**
     * @en Computes the world SRT from the local SRT for each bone.
     * @zh 重新更新所有骨骼的世界 Transform，
     * 当获取 bone 的数值未更新时，即可使用该函数进行更新数值。
     * @method updateWorldTransform
     * @example
     * var bone = spine.findBone('head');
     * cc.log(bone.worldX); // return 0;
     * spine.updateWorldTransform();
     * bone = spine.findBone('head');
     * cc.log(bone.worldX); // return -23.12;
     */
    protected updateWorldTransform () {
        if (!this.isAnimationCached()) return;

        if (this._skeleton) {
            this._skeleton.updateWorldTransform();
        }
    }

    protected _emitCacheCompleteEvent () {
        if (!this._listener) return;
        this._endEntry.animation.name = this._animationName;
        if (this._listener.complete) this._listener.complete(this._endEntry);
        if (this._listener.end) this._listener.end(this._endEntry);
    }

    protected _updateCache (dt: number) {
        const frameCache = this._frameCache!;
        if (!frameCache.isInited()) {
            return;
        }
        const frames = frameCache.frames;
        const frameTime = SkeletonCache.FrameTime;

        // Animation Start, the event different from dragonbones inner event,
        // It has no event object.
        if (this._accTime === 0 && this._playCount === 0) {
            this._startEntry.animation.name = this._animationName;
            if (this._listener && this._listener.start) this._listener.start(this._startEntry);
        }

        this._accTime += dt;
        let frameIdx = Math.floor(this._accTime / frameTime);
        if (!frameCache.isCompleted) {
            frameCache.updateToFrame(frameIdx);
            // Update render data size if needed
            if (this.renderData
                && (this.renderData.vertexCount < frameCache.maxVertexCount
                || this.renderData.indexCount < frameCache.maxIndexCount)) {
                this.maxVertexCount = frameCache.maxVertexCount > this.maxVertexCount ? frameCache.maxVertexCount : this.maxVertexCount;
                this.maxIndexCount = frameCache.maxIndexCount > this.maxIndexCount ? frameCache.maxIndexCount : this.maxIndexCount;
                this.renderData.resize(this.maxVertexCount, this.maxIndexCount);
                if (!this.renderData.indices || this.maxIndexCount > this.renderData.indices.length) {
                    this.renderData.indices = new Uint16Array(this.maxIndexCount);
                }
            }
        }

        if (frameCache.isCompleted && frameIdx >= frames.length) {
            this._playCount++;
            if (this._playTimes > 0 && this._playCount >= this._playTimes) {
                // set frame to end frame.
                this._curFrame = frames[frames.length - 1];
                this._accTime = 0;
                this._playCount = 0;
                this._isAniComplete = true;
                this._emitCacheCompleteEvent();
                return;
            }
            this._accTime = 0;
            frameIdx = 0;
            this._emitCacheCompleteEvent();
        }
        this._curFrame = frames[frameIdx];
    }

    protected _updateRealtime (dt: number) {
        const skeleton = this._skeleton;
        const state = this._state;
        if (skeleton) {
            skeleton.update(dt);
            if (state) {
                state.update(dt);
                state.apply(skeleton);
            }
        }
    }

    protected _indexBoneSockets (): void {
        if (!this._skeleton) {
            return;
        }
        this._cachedSockets.clear();
        const bones = this._skeleton.bones;
        const getBoneName = (bone: spine.Bone) => {
            if (bone.parent == null) return bone.data.name || '<Unamed>';
            return `${getBoneName(bones[bone.parent.data.index]) as string}/${bone.data.name}`;
        };
        for (let i = 0, l = bones.length; i < l; i++) {
            const bd = bones[i].data;
            const boneName = getBoneName(bones[i]);
            this._cachedSockets.set(boneName, bd.index);
        }
    }

    // if change use tint mode, just clear material cache
    protected _updateUseTint () {
        this._cleanMaterialCache();
        this.destroyRenderData();
        if (this._assembler && this._skeleton) {
            this._renderData = this._assembler.createData(this);
            this.markForUpdateRenderData();
        }
    }
    // if change use batch mode, just clear material cache
    protected _updateBatch () {
        this._cleanMaterialCache();
        this.markForUpdateRenderData();
    }

    // update animation list for editor
    protected _updateAnimEnum () {
        let animEnum;
        if (this.skeletonData) {
            animEnum = this.skeletonData.getAnimsEnum();
        } else {
            animEnum = DefaultAnimsEnum;
        }

        // reset enum type
        this._enumAnimations = Enum({});
        Object.assign(this._enumAnimations, animEnum);
        Enum.update(this._enumAnimations);
        setEnumAttr(this, '_animationIndex', this._enumAnimations);
    }

    // update skin list for editor
    protected _updateSkinEnum () {
        let skinEnum;
        if (this.skeletonData) {
            skinEnum = this.skeletonData.getSkinsEnum();
        } else {
            skinEnum = DefaultSkinsEnum;
        }

        this._enumSkins = Enum({});
        Object.assign(this._enumSkins, skinEnum);
        Enum.update(this._enumSkins);
        setEnumAttr(this, '_defaultSkinIndex', this._enumSkins);
    }

    protected _ensureListener () {
        if (!this._listener) {
            this._listener = (new TrackEntryListeners()) as any;
            if (this._state) {
                this._state.addListener(this._listener as any);
            }
        }
    }

    protected _updateSkeletonData () {
        if (!this.skeletonData || this._needUpdateSkeltonData === false) {
            return;
        }

        this._needUpdateSkeltonData = false;
        const data = this.skeletonData.getRuntimeData();
        if (!data) {
            return;
        }

        try {
            this.setSkeletonData(data);
            if (!this.isAnimationCached()) {
                this.setAnimationStateData(new spine.AnimationStateData(this._skeleton!.data));
            }
            if (this.defaultSkin) this.setSkin(this.defaultSkin);
        } catch (e) {
            warn(e);
        }
        this._indexBoneSockets();
        this._updateSocketBindings();
        this.attachUtil.init(this);
        this._preCacheMode = this._cacheMode;
        this.animation = this.defaultAnimation;
    }

    protected _refreshInspector () {
        // update inspector
        this._updateAnimEnum();
        this._updateSkinEnum();
        // TODO: refresh inspector
        // Editor.Utils.refreshSelectedInspector('node', this.node.uuid);
    }

    protected _updateDebugDraw () {
        if (this.debugBones || this.debugSlots || this.debugMesh) {
            if (!this._debugRenderer) {
                const debugDrawNode = new Node('DEBUG_DRAW_NODE');
                debugDrawNode.hideFlags |= CCObject.Flags.DontSave | CCObject.Flags.HideInHierarchy;
                const debugDraw = debugDrawNode.addComponent(Graphics);
                debugDraw.lineWidth = 1;
                debugDraw.strokeColor = new Color(255, 0, 0, 255);

                this._debugRenderer = debugDraw;
                debugDrawNode.parent = this.node;
            }
            // this._debugRenderer.node.active = true;

            if (this.isAnimationCached()) {
                warn('Debug bones or slots is invalid in cached mode');
            }
        } else if (this._debugRenderer) {
            this._debugRenderer.node.destroy();
            this._debugRenderer = null;
            // this._debugRenderer.node.active = false;
        }
    }

    protected _flushAssembler () {
        const assembler = Skeleton.Assembler.getAssembler(this);
        if (this._assembler !== assembler) {
            this._assembler = assembler;
        }
        if (this._skeleton && this._assembler) {
            this._renderData = this._assembler.createData(this);
            this.markForUpdateRenderData();
            this._updateColor();
        }
    }

    protected _updateSocketBindings () {
        if (!this._skeleton) return;
        this._socketNodes.clear();
        for (let i = 0, l = this._sockets.length; i < l; i++) {
            const socket = this._sockets[i];
            if (socket.path && socket.target) {
                const boneIdx = this._cachedSockets.get(socket.path);
                if (!boneIdx) {
                    console.error(`Skeleton data does not contain path ${socket.path}`);
                    continue;
                }
                this._socketNodes.set(boneIdx, socket.target);
            }
        }
    }

    private _verifySockets (sockets: SpineSocket[]) {
        for (let i = 0, l = sockets.length; i < l; i++) {
            const target = sockets[i].target;
            if (target) {
                if (!target.parent || (target.parent !== this.node)) {
                    console.error(`Target node ${target.name} is expected to be a direct child of ${this.node.name}`);
                    continue;
                }
            }
        }
        const uniqueSocketNode: Map<Node, boolean> = new Map();
        sockets.forEach((x: SpineSocket) => {
            if (x.target) {
                if (uniqueSocketNode.get(x.target)) {
                    console.error(`Target node ${x.target.name} has existed.`);
                } else {
                    uniqueSocketNode.set(x.target, true);
                }
            }
        });
    }

    private _cleanMaterialCache () {
        for (const val in this._materialCache) {
            this._materialCache[val].destroy();
        }
        this._materialCache = {};
    }

    protected createRenderEntity () {
        const renderEntity = new RenderEntity(RenderEntityType.DYNAMIC);
        renderEntity.setUseLocal(true);
        return renderEntity;
    }
    /**
     * @en Mark to re-update the rendering data, usually used to force refresh the display.
     * @zh 标记重新更新渲染数据，一般用于强制刷新显示。
     */
    public markForUpdateRenderData (enable = true) {
        super.markForUpdateRenderData(enable);
        if (this._debugRenderer) {
            this._debugRenderer.markForUpdateRenderData(enable);
        }
    }

    /**
     * @engineInternal since v3.7.2 this is an engine private function.
     */
    public syncAttachedNode () {
        // sync attached node matrix
        this.attachUtil._syncAttachedNode();
    }
}

legacyCC.internal.SpineSkeleton = Skeleton;
