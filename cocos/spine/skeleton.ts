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
import { EDITOR_NOT_IN_PREVIEW, JSB } from 'internal:constants';
import { ccclass, executeInEditMode, help, menu, serializable, type, displayName, override, displayOrder, editable, tooltip } from 'cc.decorator';
import { Material, Texture2D } from '../asset/assets';
import { errorID, warn } from '../core/platform/debug';
import { Enum, ccenum } from '../core/value-types/enum';
import { Component, Node } from '../scene-graph';
import { CCBoolean, CCClass, CCFloat, CCObject, Color, Mat4, RecyclePool, js } from '../core';
import { SkeletonData } from './skeleton-data';
import { Graphics, UIRenderer, UITransform } from '../2d';
import { Batcher2D } from '../2d/renderer/batcher-2d';
import { BlendFactor, BlendOp } from '../gfx';
import { MaterialInstance } from '../render-scene';
import { builtinResMgr } from '../asset/asset-manager';
import { legacyCC } from '../core/global-exports';
import { SkeletonSystem } from './skeleton-system';
import { RenderEntity, RenderEntityType } from '../2d/renderer/render-entity';
import { AttachUtil } from './attach-util';
import { RenderDrawInfo } from '../2d/renderer/render-draw-info';
import { SPINE_WASM } from './lib/instantiated';
import spine from './lib/spine-core.js';
import { VertexEffectDelegate } from './vertex-effect-delegate';
import SkeletonCache, { AnimationCache, AnimationFrame } from './skeleton-cache';
import { TrackEntryListeners } from './track-entry-listeners';

const spineTag = SPINE_WASM;
const CachedFrameTime = 1 / 60;

type TrackListener = (x: spine.TrackEntry) => void;
type TrackListener2 = (x: spine.TrackEntry, ev: spine.Event) => void;
/**
 * @en
 * Animation playback rate.
 * @zh
 * 动画播放速率。
 */
export const timeScale = 1.0;

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
 * @internal Since v3.7.2, this is an engine private enum.
 */
export enum SpineMaterialType {
    COLORED_TEXTURED = 0,
    TWO_COLORED = 1,
}

interface AnimationItem {
    animationName: string;
    loop: boolean;
    delay: number;
}

/**
 * @engineInternal Since v3.7.2, this is an engine private interface.
 */
export interface SkeletonDrawData {
    material: Material | null;
    indexOffset: number;
    indexCount: number;
}

function setEnumAttr (obj, propName, enumDef) {
    CCClass.Attr.setClassAttr(obj, propName, 'type', 'Enum');
    CCClass.Attr.setClassAttr(obj, propName, 'enumList', Enum.getList(enumDef));
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

    @serializable
    protected _skeletonData: SkeletonData | null = null;
    @serializable
    protected defaultSkin = '';
    @serializable
    protected defaultAnimation = '';
    /**
     * @en Indicates whether to enable premultiplied alpha.
     * You should disable this option when image's transparent area appears to have opaque pixels,
     * or enable this option when image's half transparent area appears to be darken.
     * @zh 是否启用贴图预乘。
     * 当图片的透明区域出现色块时需要关闭该选项，当图片的半透明区域颜色变黑时需要启用该选项。
     */
    @serializable
    protected _premultipliedAlpha = true;
    @serializable
    protected _timeScale = 1;
    @serializable
    protected _cacheMode = AnimationCacheMode.REALTIME;
    @serializable
    protected _defaultCacheMode: AnimationCacheMode = AnimationCacheMode.REALTIME;
    @serializable
    protected _sockets: SpineSocket[] = [];
    @serializable
    protected _useTint = false;
    @serializable
    protected _debugMesh = false;
    @serializable
    protected _debugBones = false;
    @serializable
    protected _debugSlots = false;
    @serializable
    protected _enableBatch = false;

    protected _runtimeData: spine.SkeletonData | null = null;
    public _skeleton: spine.Skeleton = null!;
    protected _instance: spine.SkeletonInstance = null!;
    protected _state: spine.AnimationState = null!;
    protected _texture: Texture2D | null = null;
    // Animation name
    protected _animationName = '';
    protected _skinName = '';
    protected _drawList = new RecyclePool<SkeletonDrawData>(() => ({
        material: null,
        indexOffset: 0,
        indexCount: 0,
    }), 1);
    protected _materialCache: { [key: string]: MaterialInstance } = {} as any;
    public paused = false;
    protected _enumSkins: any = Enum({});
    protected _enumAnimations: any = Enum({});
    protected attachUtil: AttachUtil;
    protected _socketNodes: Map<number, Node> = new Map();
    protected _cachedSockets: Map<string, number> = new Map<string, number>();

    // Below properties will effect when cache mode is SHARED_CACHE or PRIVATE_CACHE.
    // accumulate time
    protected _accTime = 0;
    // Play times counter
    protected _playCount = 0;
    // Skeleton cache
    protected _skeletonCache: SkeletonCache | null = null;
    protected _animCache: AnimationCache | null = null;
    /**
     * @engineInternal
     */
    public _curFrame: AnimationFrame | null = null;
    // Is need update skeltonData
    protected _needUpdateSkeltonData = true;
    protected _listener: TrackEntryListeners | null = null;

    /**
     * @engineInternal
     */
    public _debugRenderer: Graphics | null = null;

    constructor () {
        super();
        this._useVertexOpacity = true;
        if (!JSB) {
            this._instance = new spine.SkeletonInstance();
        }
        this.attachUtil = new AttachUtil();
    }

    /**
     * @engineInternal Since v3.7.2, this is an engine private interface.
     */
    get drawList () { return this._drawList; }

    /**
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
    @displayName('SkeletonData')
    get skeletonData () {
        return this._skeletonData;
    }
    set skeletonData (value: SkeletonData | null) {
        if (value) value.resetEnums();
        if (this._skeletonData !== value) {
            this.destroyRenderData();
            this._skeletonData = value as any;
            this.defaultSkin = '';
            this.defaultAnimation = '';
            this._updateSkeletonData();
            this._updateUITransform();
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
            this._refreshInspector();
            this.markForUpdateRenderData();
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
        const animationName = EDITOR_NOT_IN_PREVIEW ? this.defaultAnimation : this.animation;
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
            if (EDITOR_NOT_IN_PREVIEW) {
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
     * @en Whether premultipliedAlpha enabled.
     * @zh 是否启用 alpha 预乘。
     */
    @editable
    @tooltip('i18n:COMPONENT.skeleton.premultipliedAlpha')
    get premultipliedAlpha (): boolean { return this._premultipliedAlpha; }
    set premultipliedAlpha (v: boolean) {
        if (v !== this._premultipliedAlpha) {
            this._premultipliedAlpha = v;
            this._instance.setPremultipliedAlpha(v);
            this.markForUpdateRenderData();
        }
    }

    /**
     * @en Whether play animations in loop mode.
     * @zh 是否循环播放当前骨骼动画。
     */
    @serializable
    @tooltip('i18n:COMPONENT.skeleton.loop')
    public loop = true;

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
        if (EDITOR_NOT_IN_PREVIEW) {
            this._verifySockets(val);
        }
        this._sockets = val;
        this._updateSocketBindings();
        this.syncAttachedNode();
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
    get socketNodes () { return this._socketNodes; }

    /**
     * @en The name of current playing animation.
     * @zh 当前播放的动画名称。
     * @property {String} animation
     */

    get animation (): string {
        return this._animationName;
    }
    set animation (value: string) {
        if (value) {
            this.setAnimation(0, value, this.loop);
        } else {
            this.clearAnimation();
        }
    }

    /**
     * @en The customMaterial。
     * @zh 用户自定材质。
     */
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

    public __preload () {
        super.__preload();
    }

    public onRestore () {

    }
    /**
     * @en Be called when component state becomes available.
     * @zh 组件状态变为可用时调用。
     */
    public onEnable () {
        super.onEnable();
        this._updateSkeletonData();
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

    public onDestroy () {
        this.destroyRenderData();
        this._cleanMaterialCache();
        if (!JSB) {
            spine.wasmUtil.destroySpineInstance(this._instance);
        }
        super.onDestroy();
    }
    /**
     * @en Clear animation and set to setup pose.
     * @zh 清除动画并还原到初始姿势。
     */
    public clearAnimation () {
        if (!this.isAnimationCached()) {
            this.clearTrack(0);
            this.setToSetupPose();
        }
    }

    protected _updateSkeletonData () {
        const skeletonData = this._skeletonData;
        if (!skeletonData) {
            this._texture = null;
            return;
        }
        this._texture = skeletonData.textures[0];

        this._runtimeData = skeletonData.getRuntimeData();
        if (!this._runtimeData) return;
        this.setSkeletonData(this._runtimeData);

        this._refreshInspector();
        if (this.defaultAnimation) this.animation = this.defaultAnimation;
        if (this.defaultSkin) this.setSkin(this.defaultSkin);

        this._updateUseTint();

        this._indexBoneSockets();
        this._updateSocketBindings();
        this.attachUtil.init(this);
    }

    /**
     * @en
     * Sets runtime skeleton data to sp.Skeleton.<br>
     * This method is different from the `skeletonData` property. This method is passed in the raw data provided by the
     *  Spine runtime, and the skeletonData type is the asset type provided by Creator.
     * @zh
     * 设置底层运行时用到的 SkeletonData。<br>
     * 这个接口有别于 `skeletonData` 属性，这个接口传入的是 Spine runtime 提供的原始数据，而 skeletonData 的类型是 Creator 提供的资源类型。
     * @param skeletonData @en The skeleton data contains the skeleton information (bind pose bones, slots, draw order, attachments,
     * skins, etc) and animations but does not hold any state. @zh 骨架数据(SkeletonData)包含骨架信息(绑定pose的骨骼、槽位、绘制顺序、附件、
     * 皮肤等)和动画, 但不保存任何状态。
     */
    public setSkeletonData (skeletonData: spine.SkeletonData) {
        if (!EDITOR_NOT_IN_PREVIEW) {
            if (this._cacheMode === AnimationCacheMode.SHARED_CACHE) {
                this._skeletonCache = SkeletonCache.sharedCache;
            } else if (this._cacheMode === AnimationCacheMode.PRIVATE_CACHE) {
                this._skeletonCache = new SkeletonCache();
            }
        }

        if (this.isAnimationCached()) {
            if (this.debugBones || this.debugSlots) {
                warn('Debug bones or slots is invalid in cached mode');
            }
        } else {
            this._skeleton = this._instance.initSkeleton(skeletonData);
            this._state = this._instance.getAnimationState();
            this._instance.setPremultipliedAlpha(this._premultipliedAlpha);
        }
        // Recreate render data and mark dirty
        this._flushAssembler();
    }

    /**
     * @en Set the current animation. Any queued animations are cleared.<br>
     * @zh 设置当前动画。队列中的任何的动画将被清除。<br>
     * @param trackIndex @en Index of track. @zh 动画通道索引。
     * @param name @en The name of animation. @zh 动画名称。
     * @param loop @en Use loop mode or not. @zh 是否使用循环播放模式。
     */
    public setAnimation (trackIndex: number, name: string, loop?: boolean) {
        if (loop === undefined) loop = true;

        if (this.isAnimationCached()) {
            if (trackIndex !== 0) {
                warn('Track index can not greater than 0 in cached mode.');
            }
            this._animationName = name;
            if (!this._skeletonCache) return;
            let cache = this._skeletonCache.getAnimationCache(this._skeletonData!._uuid, this._animationName);
            if (!cache) {
                cache = this._skeletonCache.initAnimationCache(this._skeletonData!, this._animationName);
            }
            this._skeleton = cache.skeleton;
            if (this._cacheMode === AnimationCacheMode.PRIVATE_CACHE) {
                cache.invalidAnimationFrames();
            }
            this._animCache = cache;
            this._accTime = 0;
            this._playCount = 0;
        } else {
            this._animationName = name;
            this._instance.setAnimation(trackIndex, name, loop);
        }
        this.markForUpdateRenderData();
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
     * @param skinName @en The name of skin. @zh 皮肤名称。
     */
    public setSkin (name: string) {
        this._skinName = name;
        if (this.isAnimationCached()) {
            if (this._animCache) {
                this._animCache.setSkin(name);
            }
        } else {
            this._instance.setSkin(name);
        }
    }

    /**
     * @en Update skeleton animation.
     * @zh 更新骨骼动画。
     * @param dt @en delta time. @zh 时间差。
     */
    public updateAnimation (dt: number) {
        if (EDITOR_NOT_IN_PREVIEW) return;
        if (this.paused) return;
        dt *= this._timeScale * timeScale;
        if (this.isAnimationCached()) {
            this._accTime += dt;
            const frameIdx = Math.floor(this._accTime / CachedFrameTime);
            this._animCache!.updateToFrame(frameIdx);
            this._curFrame = this._animCache!.getFrame(frameIdx);
        } else {
            this._instance.updateAnimation(dt);
        }
        this.markForUpdateRenderData();
    }

    /**
     * @engineInternal
     */
    public updateRenderData (): any {
        if (this.isAnimationCached()) {
            if (!this._curFrame) return null;
            const model = this._curFrame.model;
            return model;
        } else {
            const model = this._instance.updateRenderData();
            return model;
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
                const dc = this._drawList.data[i];
                if (this._texture) {
                    batcher.commitMiddleware(this, meshBuffer, origin + dc.indexOffset,
                        dc.indexCount, this._texture, dc.material!, this._enableBatch);
                }
                indicesCount += dc.indexCount;
            }
            const subIndices = rd.indices!.subarray(0, indicesCount);
            accessor.appendIndices(chunk.bufferId, subIndices);
        }
    }

    /**
     * @engineInternal
     */
    public requestDrawData (material: Material, indexOffset: number, indexCount: number) {
        const draw = this._drawList.add();
        draw.material = material;
        draw.indexOffset = indexOffset;
        draw.indexCount = indexCount;
        return draw;
    }

    protected _updateBuiltinMaterial (): Material {
        const material = builtinResMgr.get<Material>('default-spine-material');
        return material;
    }
    /**
     * @engineInternal
     */
    public updateMaterial () {
        let mat;
        if (this._customMaterial) mat = this._customMaterial;
        else mat = this._updateBuiltinMaterial();
        this.setMaterial(mat, 0);
        this._cleanMaterialCache();
    }

    private getMaterialTemplate (): Material {
        if (this.customMaterial !== null) return this.customMaterial;
        if (this.material) return this.material;
        this.updateMaterial();
        return this.material!;
    }
    private _cleanMaterialCache () {
        for (const val in this._materialCache) {
            this._materialCache[val].destroy();
        }
        this._materialCache = {};
    }

    /**
     * @engineInternal Since v3.7.2, this is an engine private interface.
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

    protected _refreshInspector () {
        if (EDITOR_NOT_IN_PREVIEW) {
            // update inspector
            this._updateAnimEnum();
            this._updateSkinEnum();
            // TODO: refresh inspector
            // Editor.Utils.refreshSelectedInspector('node', this.node.uuid);
        }
    }

    /**
     * @en Call this method to destroy the rendering data.
     * @zh 调用该方法销毁渲染数据。
     */
    public destroyRenderData () {
        this._drawList.reset();
        super.destroyRenderData();
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

    /**
     * @en Whether in cached mode.
     * @zh 当前是否处于缓存模式。
     */
    public isAnimationCached () {
        if (EDITOR_NOT_IN_PREVIEW) return false;
        return this._cacheMode !== AnimationCacheMode.REALTIME;
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
        if (this._cacheMode !== cacheMode) {
            this._cacheMode = cacheMode;
            this._updateSkeletonData();
            this._updateUseTint();
            this._updateSocketBindings();
            this.markForUpdateRenderData();
        }
    }

    /**
     * @en Sets the bones and slots to the setup pose.
     * @zh 还原到起始动作。
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
     */
    public setSlotsToSetupPose () {
        if (this._skeleton) {
            this._skeleton.setSlotsToSetupPose();
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
     * @param boneName @en The name of bone. @zh 骨骼名称。
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
     * @param slotName @en The name of slot. @zh 插槽名称。
     */
    public findSlot (slotName: string) {
        if (this._skeleton) {
            return this._skeleton.findSlot(slotName);
        }
        return null;
    }

    // ANIMATION
    /**
     * @en
     * Mix applies all keyframe values,
     * interpolated for the specified time and mixed with the current values.
     * @zh 为所有关键帧设定混合及混合时间（从当前值开始差值）。
     * @param fromAnimation @en Mix start animation. @zh 过渡起始动画。
     * @param toAnimation @en Mix end animation. @zh 过渡结束动画。
     * @param duration @ Time of animation mix. @zh 动画过渡时间。
     */
    public setMix (fromAnimation: string, toAnimation: string, duration: number): void {
        if (this.isAnimationCached()) {
            console.warn('cached mode not support setMix!!!');
            return;
        }
        if (this._state) {
            this._instance.setMix(fromAnimation, toAnimation, duration);
            //this._state.data.setMix(fromAnimation, toAnimation, duration);
        }
    }

    /**
     * @en Clears all tracks of animation state.
     * @zh 清除所有 track 的动画状态。
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
     * @param trackIndex @en Index of track. @zh 动画通道索引。
     */
    public clearTrack (trackIndex: number) {
        if (this.isAnimationCached()) {
            warn('\'clearTrack\' interface can not be invoked in cached mode.');
        } else if (this._state) {
            this._state.clearTrack(trackIndex);
            if (EDITOR_NOT_IN_PREVIEW) {
                this._state.update(0);
            }
        }
    }

    /**
     * @en Computes the world SRT from the local SRT for each bone.
     * @zh 重新更新所有骨骼的世界 Transform，
     * 当获取 bone 的数值未更新时，即可使用该函数进行更新数值。
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

    // if change use tint mode, just clear material cache
    protected _updateUseTint () {
        this._cleanMaterialCache();
        this.destroyRenderData();
        if (!JSB) {
            if (!this.isAnimationCached()) {
                this._instance.setUseTint(this._useTint);
            }
        }
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

            if (this.isAnimationCached()) {
                warn('Debug bones or slots is invalid in cached mode');
            } else {
                this._instance.setDebugMode(true);
            }
        } else if (this._debugRenderer) {
            this._debugRenderer.node.destroy();
            this._debugRenderer = null;
            if (!this.isAnimationCached()) {
                this._instance.setDebugMode(false);
            }
        }
    }

    private _updateUITransform () {
        const uiTrans = this.node._uiProps.uiTransformComp!;
        const skeletonData = this._runtimeData;
        if (!skeletonData) {
            uiTrans.setContentSize(100, 100);
            uiTrans.anchorX = 0.5;
            uiTrans.anchorX = 0.5;
            return;
        }
        const width = skeletonData.width;
        const height = skeletonData.height;
        if (width && height) {
            uiTrans.setContentSize(width, height);
            if (width !== 0) uiTrans.anchorX = Math.abs(skeletonData.x) / width;
            if (height !== 0) uiTrans.anchorY = Math.abs(skeletonData.y) / height;
        }
    }

    protected _updateColor () {
        this.node._uiProps.colorDirty = true;
        const r = this._color.r / 255.0;
        const g = this._color.g / 255.0;
        const b = this._color.b / 255.0;
        const a = this._color.a / 255.0;
        this._instance.setColor(r, g, b, a);
    }

    /**
     * @en Sets vertex effect delegate.
     * @zh 设置顶点特效动画代理。
     * @param effectDelegate @en Vertex effect delegate. @zh 顶点特效代理。
     */
    public setVertexEffectDelegate (effectDelegate: VertexEffectDelegate | null | undefined) {
        if (!effectDelegate) {
            this._instance.clearEffect();
            return;
        }
        const effectType = effectDelegate?.getEffectType();
        if (effectType === 'jitter') {
            const jitterEffect = effectDelegate?.getJitterVertexEffect();
            this._instance.setJitterEffect(jitterEffect);
        } else if (effectType === 'swirl') {
            const swirlEffect = effectDelegate?.getJitterVertexEffect();
            this._instance.setSwirlEffect(swirlEffect);
        }
    }

    protected _ensureListener () {
        if (!this._listener) {
            this._listener = new TrackEntryListeners();
        }
    }

    /**
     * @en Sets the start event listener.
     * @zh 用来设置开始播放动画的事件监听。
     * @param listener @en Listener for registering callback functions. @zh 监听器对象，可注册回调方法。
     */
    public setStartListener (listener: TrackListener) {
        this._ensureListener();
        const listenerID = TrackEntryListeners.addListener(listener);
        this._instance.setListener(listenerID, spine.EventType.start);
        this._listener!.start = listener;
    }

    /**
     * @en Sets the interrupt event listener.
     * @zh 用来设置动画被打断的事件监听。
     * @param listener @en Listener for registering callback functions. @zh 监听器对象，可注册回调方法。
     */
    public setInterruptListener (listener: TrackListener) {
        this._ensureListener();
        const listenerID = TrackEntryListeners.addListener(listener);
        this._instance.setListener(listenerID, spine.EventType.interrupt);
        this._listener!.interrupt = listener;
    }

    /**
     * @en Sets the end event listener.
     * @zh 用来设置动画播放完后的事件监听。
     * @param listener @en Listener for registering callback functions. @zh 监听器对象，可注册回调方法。
     */
    public setEndListener (listener: TrackListener) {
        this._ensureListener();
        const listenerID = TrackEntryListeners.addListener(listener);
        this._instance.setListener(listenerID, spine.EventType.end);
        this._listener!.end = listener;
    }

    /**
     * @en Sets the dispose event listener.
     * @zh 用来设置动画将被销毁的事件监听。
     * @param listener @en Listener for registering callback functions. @zh 监听器对象，可注册回调方法。
     */
    public setDisposeListener (listener: TrackListener) {
        this._ensureListener();
        const listenerID = TrackEntryListeners.addListener(listener);
        this._instance.setListener(listenerID, spine.EventType.dispose);
        this._listener!.dispose = listener;
    }

    /**
     * @en Sets the complete event listener.
     * @zh 用来设置动画播放一次循环结束后的事件监听。
     * @param listener @en Listener for registering callback functions. @zh 监听器对象，可注册回调方法。
     */
    public setCompleteListener (listener: TrackListener) {
        this._ensureListener();
        const listenerID = TrackEntryListeners.addListener(listener);
        this._instance.setListener(listenerID, spine.EventType.complete);
        this._listener!.complete = listener;
    }

    /**
     * @en Sets the animation event listener.
     * @zh 用来设置动画播放过程中帧事件的监听。
     * @param listener @en Listener for registering callback functions. @zh 监听器对象，可注册回调方法。
     */
    public setEventListener (listener: TrackListener2) {
        this._ensureListener();
        const listenerID = TrackEntryListeners.addListener(listener);
        this._instance.setListener(listenerID, spine.EventType.event);
        this._listener!.event = listener;
    }

    /**
     * @en Sets the start event listener for specified TrackEntry.
     * @zh 用来为指定的 TrackEntry 设置动画开始播放的事件监听。
     * @param entry @en Animation track entry. @zh Track entry。
     * @param listener @en Listener for registering callback functions. @zh 监听器对象，可注册回调方法。
     */
    public setTrackStartListener (entry: spine.TrackEntry, listener: TrackListener) {
        TrackEntryListeners.getListeners(entry).start = listener;
    }

    /**
     * @en Sets the interrupt event listener for specified TrackEntry.
     * @zh 用来为指定的 TrackEntry 设置动画被打断的事件监听。
     * @param entry
     * @param listener @en Listener for registering callback functions. @zh 监听器对象，可注册回调方法。
     */
    public setTrackInterruptListener (entry: spine.TrackEntry, listener: TrackListener) {
        TrackEntryListeners.getListeners(entry).interrupt = listener;
    }

    /**
     * @en Sets the end event listener for specified TrackEntry.
     * @zh 用来为指定的 TrackEntry 设置动画播放结束的事件监听。
     * @param entry
     * @param listener @en Listener for registering callback functions. @zh 监听器对象，可注册回调方法。
     */
    public setTrackEndListener (entry: spine.TrackEntry, listener: TrackListener) {
        TrackEntryListeners.getListeners(entry).end = listener;
    }

    /**
     * @en Sets the dispose event listener for specified TrackEntry.
     * @zh 用来为指定的 TrackEntry 设置动画即将被销毁的事件监听。
     * @param entry
     * @param listener @en Listener for registering callback functions. @zh 监听器对象，可注册回调方法。
     */
    public setTrackDisposeListener (entry: spine.TrackEntry, listener: TrackListener) {
        TrackEntryListeners.getListeners(entry).dispose = listener;
    }

    /**
     * @en Sets the complete event listener for specified TrackEntry.
     * @zh 用来为指定的 TrackEntry 设置动画一次循环播放结束的事件监听。
     * @param entry
     * @param listener @en Listener for registering callback functions. @zh 监听器对象，可注册回调方法。
     */
    public setTrackCompleteListener (entry: spine.TrackEntry, listener: TrackListener2) {
        // TODO
        // TrackEntryListeners.getListeners(entry).complete = function (trackEntry) {
        //     const loopCount = Math.floor(trackEntry.trackTime / trackEntry.animationEnd);
        //     listener(trackEntry, loopCount);
        // };
    }

    /**
     * @en Sets the event listener for specified TrackEntry.
     * @zh 用来为指定的 TrackEntry 设置动画帧事件的监听。
     * @param entry
     * @param listener @en Listener for registering callback functions. @zh 监听器对象，可注册回调方法。
     */
    public setTrackEventListener (entry: spine.TrackEntry, listener: TrackListener|TrackListener2) {
        TrackEntryListeners.getListeners(entry).event = listener;
    }

    /**
     * @engineInternal
    */
    public getDebugShapes (): any {
        return this._instance.getDebugShapes();
    }
}

legacyCC.internal.SpineSkeleton = Skeleton;
