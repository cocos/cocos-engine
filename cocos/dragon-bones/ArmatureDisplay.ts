/**
 * @packageDocumentation
 * @module dragonBones
 */

import { EDITOR } from 'internal:constants';
import { Armature, Bone, EventObject } from '@cocos/dragonbones-js';
import { ccclass, executeInEditMode, help, menu } from '../core/data/class-decorator';
import { Renderable2D } from '../2d/framework/renderable-2d';
import { Node, CCClass, Color, Enum, ccenum, errorID, Texture2D, js, CCObject } from '../core';
import { EventTarget } from '../core/event';
import { BlendFactor } from '../core/gfx';
import { displayName, editable, override, serializable, tooltip, type, visible } from '../core/data/decorators';
import { AnimationCache, ArmatureCache, ArmatureFrame } from './ArmatureCache';
import { AttachUtil } from './AttachUtil';
import { CCFactory } from './CCFactory';
import { DragonBonesAsset } from './DragonBonesAsset';
import { DragonBonesAtlasAsset } from './DragonBonesAtlasAsset';
import { Graphics } from '../2d/components';
import { CCArmatureDisplay } from './CCArmatureDisplay';
import { MeshRenderData } from '../2d/renderer/render-data';
import { IBatcher } from '../2d/renderer/i-batcher';
import { MaterialInstance } from '../core/renderer/core/material-instance';
import { legacyCC } from '../core/global-exports';
import { ArmatureSystem } from './ArmatureSystem';

enum DefaultArmaturesEnum {
    default = -1,
}
ccenum(DefaultArmaturesEnum);

enum DefaultAnimsEnum {
    '<None>' = 0,
}
ccenum(DefaultAnimsEnum);

enum DefaultCacheMode {
    REALTIME = 0,
}
ccenum(DefaultAnimsEnum);

// eslint-disable-next-line prefer-const,import/no-mutable-exports
export let timeScale = 1;

/**
 * @en Enum for cache mode type.
 * @zh Dragonbones渲染类型
 * @enum ArmatureDisplay.AnimationCacheMode
 */
export enum AnimationCacheMode {
    /**
     * @en The realtime mode.
     * @zh 实时计算模式。
     * @property {Number} REALTIME
     */
    REALTIME = 0,
    /**
     * @en The shared cache mode.
     * @zh 共享缓存模式。
     * @property {Number} SHARED_CACHE
     */
    SHARED_CACHE = 1,
    /**
     * @en The private cache mode.
     * @zh 私有缓存模式。
     * @property {Number} PRIVATE_CACHE
     */
    PRIVATE_CACHE = 2
}
ccenum(AnimationCacheMode);

function setEnumAttr (obj, propName, enumDef) {
    CCClass.Attr.setClassAttr(obj, propName, 'type', 'Enum');
    CCClass.Attr.setClassAttr(obj, propName, 'enumList', Enum.getList(enumDef));
}

export interface ArmatureDisplayMeshData {
    renderData: MeshRenderData;
    texture: Texture2D | null;
}

@ccclass('dragonBones.ArmatureDisplay.DragonBoneSocket')
export class DragonBoneSocket {
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

    public boneIndex: number | null = null;

    constructor (path = '', target: Node | null = null) {
        this.path = path;
        this.target = target;
    }
}

js.setClassAlias(DragonBoneSocket, 'dragonBones.ArmatureDisplay.DragonBoneSocket');

interface BoneIndex extends Number {
    _any: number;
}

/**
 * @en
 * The Armature Display of DragonBones <br/>
 * <br/>
 * Armature Display has a reference to a DragonBonesAsset and stores the state for ArmatureDisplay instance,
 * which consists of the current pose's bone SRT, slot colors, and which slot attachments are visible. <br/>
 * Multiple Armature Display can use the same DragonBonesAsset which includes all animations, skins, and attachments. <br/>
 * @zh
 * DragonBones 骨骼动画 <br/>
 * <br/>
 * Armature Display 具有对骨骼数据的引用并且存储了骨骼实例的状态，
 * 它由当前的骨骼动作，slot 颜色，和可见的 slot attachments 组成。<br/>
 * 多个 Armature Display 可以使用相同的骨骼数据，其中包括所有的动画，皮肤和 attachments。<br/>
 *
 * @class ArmatureDisplay
 * @extends RenderComponent
 */
@ccclass('dragonBones.ArmatureDisplay')
@help('i18n:dragonBones.ArmatureDisplay')
@menu('DragonBones/ArmatureDisplay')
@executeInEditMode
export class ArmatureDisplay extends Renderable2D {
    static AnimationCacheMode = AnimationCacheMode;

    /**
     * @en
     * The DragonBones data contains the armatures information (bind pose bones, slots, draw order,
     * attachments, skins, etc) and animations but does not hold any state.<br/>
     * Multiple ArmatureDisplay can share the same DragonBones data.
     * @zh
     * 骨骼数据包含了骨骼信息（绑定骨骼动作，slots，渲染顺序，
     * attachments，皮肤等等）和动画但不持有任何状态。<br/>
     * 多个 ArmatureDisplay 可以共用相同的骨骼数据。
     * @property {DragonBonesAsset} dragonAsset
     */
    @editable
    @type(DragonBonesAsset)
    @tooltip('i18n:COMPONENT.dragon_bones.dragon_bones_asset')
    get dragonAsset () {
        return this._dragonAsset;
    }
    set dragonAsset (value) {
        this._dragonAsset = value;
        this._refresh();
        if (EDITOR) {
            this._defaultArmatureIndex = 0;
            this._animationIndex = 0;
        }
    }

    /**
     * @en
     * The atlas asset for the DragonBones.
     * @zh
     * 骨骼数据所需的 Atlas Texture 数据。
     * @property {DragonBonesAtlasAsset} dragonAtlasAsset
     */
    @editable
    @type(DragonBonesAtlasAsset)
    @tooltip('i18n:COMPONENT.dragon_bones.dragon_bones_atlas_asset')
    get dragonAtlasAsset () { return this._dragonAtlasAsset; }
    set dragonAtlasAsset (value) {
        this._dragonAtlasAsset = value;
        this._parseDragonAtlasAsset();
        this._refresh();
    }

    /**
     * @en The name of current armature.
     * @zh 当前的 Armature 名称。
     * @property {String} armatureName
     */
    @visible(false)
    get armatureName () { return this._armatureName; }
    set armatureName (name) {
        this._armatureName = name;
        const animNames = this.getAnimationNames(this._armatureName);

        if (!this.animationName || animNames.indexOf(this.animationName) < 0) {
            if (EDITOR) {
                this.animationName = animNames[0];
            } else {
                // Not use default animation name at runtime
                this.animationName = '';
            }
        }

        if (this._armature && !this.isAnimationCached()) {
            this._factory!._dragonBones.clock.remove(this._armature);
        }

        this._refresh();

        if (this._armature && !this.isAnimationCached()) {
            this._factory!._dragonBones.clock.add(this._armature);
        }
    }

    /**
     * @en The name of current playing animation.
     * @zh 当前播放的动画名称。
     * @property {String} animationName
     */
    @visible(false)
    get animationName () {
        return this._animationName;
    }
    set animationName (value) {
        this._animationName = value;
    }

    @displayName('Armature')
    @editable
    @type(DefaultArmaturesEnum)
    @tooltip('i18n:COMPONENT.dragon_bones.armature_name')
    get _defaultArmatureIndex () {
        return this._defaultArmatureIndexValue;
    }
    set _defaultArmatureIndex (value) {
        this._defaultArmatureIndexValue = value;
        let armatureName = '';
        if (this.dragonAsset) {
            let armaturesEnum;
            if (this.dragonAsset) {
                armaturesEnum = this.dragonAsset.getArmatureEnum();
            }
            if (!armaturesEnum) {
                errorID(7400, this.name);
                return;
            }

            armatureName = armaturesEnum[this._defaultArmatureIndex];
        }

        if (armatureName !== undefined) {
            this.armatureName = armatureName;
        } else {
            errorID(7401, this.name);
        }
        this.resetRenderData();
        this.markForUpdateRenderData();
    }

    @editable
    @type(DefaultAnimsEnum)
    @displayName('Animation')
    @tooltip('i18n:COMPONENT.dragon_bones.animation_name')
    get _animationIndex () {
        return this._animationIndexValue;
    }

    set _animationIndex (value) {
        this._animationIndexValue = value;

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

        const animName = animsEnum[this._animationIndex];
        if (animName !== undefined) {
            this.playAnimation(animName, this.playTimes);
        } else {
            errorID(7402, this.name);
        }
    }

    @editable
    @displayName('Animation Cache Mode')
    @tooltip('i18n:COMPONENT.dragon_bones.animation_cache_mode')
    get _defaultCacheMode () { return this._defaultCacheModeValue; }
    set _defaultCacheMode (value) {
        this._defaultCacheModeValue = value;

        if (this._defaultCacheMode !== AnimationCacheMode.REALTIME) {
            if (this._armature && !ArmatureCache.canCache(this._armature)) {
                this._defaultCacheMode = AnimationCacheMode.REALTIME;
                console.warn('Animation cache mode doesn\'t support skeletal nesting');
                return;
            }
        }
        this.setAnimationCacheMode(this._defaultCacheMode);
    }
    /**
     * @en The time scale of this armature.
     * @zh 当前骨骼中所有动画的时间缩放率。
     * @property {Number} timeScale
     * @default 1
     */
    @editable
    @tooltip('i18n:COMPONENT.dragon_bones.time_scale')
    @serializable
    get timeScale () { return this._timeScale; }
    set timeScale (value) {
        this._timeScale = value;

        if (this._armature && !this.isAnimationCached()) {
            this._armature.animation.timeScale = this.timeScale;
        }
    }

    /**
     * @en The play times of the default animation.
     *      -1 means using the value of config file;
     *      0 means repeat for ever
     *      >0 means repeat times
     * @zh 播放默认动画的循环次数
     *      -1 表示使用配置文件中的默认值;
     *      0 表示无限循环
     *      >0 表示循环次数
     * @property {Number} playTimes
     * @default -1
     */
    @tooltip('i18n:COMPONENT.dragon_bones.play_times')
    @editable
    @serializable
    public playTimes = -1;

    /**
     * @en Indicates whether to enable premultiplied alpha.
     * You should disable this option when image's transparent area appears to have opaque pixels,
     * or enable this option when image's half transparent area appears to be darken.
     * @zh 是否启用贴图预乘。
     * 当图片的透明区域出现色块时需要关闭该选项，当图片的半透明区域颜色变黑时需要启用该选项。
     * @property {Boolean} premultipliedAlpha
     * @default false
     */
    @serializable
    @editable
    @tooltip('i18n:COMPONENT.skeleton.premultipliedAlpha')
    public premultipliedAlpha = false;

    /**
     * @en Indicates whether open debug bones.
     * @zh 是否显示 bone 的 debug 信息。
     * @property {Boolean} debugBones
     * @default false
     */
    @tooltip('i18n:COMPONENT.dragon_bones.debug_bones')
    @editable
    get debugBones () { return this._debugBones; }
    set debugBones (value) {
        this._debugBones = value;
        this._updateDebugDraw();
    }
    /**
     * @en Enabled batch model, if skeleton is complex, do not enable batch, or will lower performance.
     * @zh 开启合批，如果渲染大量相同纹理，且结构简单的骨骼动画，开启合批可以降低drawcall，否则请不要开启，cpu消耗会上升。
     * @property {Boolean} enableBatch
     * @default false
     */
    // @editable
    // @tooltip('i18n:COMPONENT.dragon_bones.enabled_batch')
    // get enableBatch () { return this._enableBatch; }
    // set enableBatch (value) {
    //     this._enableBatch = value;
    //     this._updateBatch();
    // }

    /**
     * @en
     * The bone sockets this animation component maintains.<br>
     * Sockets have to be registered here before attaching custom nodes to animated bones.
     * @zh
     * 当前动画组件维护的挂点数组。要挂载自定义节点到受动画驱动的骨骼上，必须先在此注册挂点。
     */
    @type([DragonBoneSocket])
    @tooltip('i18n:animation.sockets')
    get sockets (): DragonBoneSocket[] {
        return this._sockets;
    }

    set sockets (val: DragonBoneSocket[]) {
        this._verifySockets(val);
        this._sockets = val;
        this._updateSocketBindings();
        // this.attachUtil._syncAttachedNode();
        if (val.length > 0 && this._frameCache) {
            this._frameCache.enableCacheAttachedInfo();
        }
    }

    get socketNodes () { return this._socketNodes; }

    /* protected */ _armature: Armature | null = null;

    public attachUtil: AttachUtil;

    get meshRenderDataArray () { return this._meshRenderDataArray; }

    @serializable
    protected _defaultArmatureIndexValue: DefaultArmaturesEnum = DefaultArmaturesEnum.default;
    @serializable
    /* protected */ _dragonAsset: DragonBonesAsset | null = null;
    @serializable
    /* protected */ _dragonAtlasAsset: DragonBonesAtlasAsset | null = null;
    @serializable
    /* protected */ _armatureName = '';
    @serializable
    protected _animationName = '';
    @serializable
    protected _animationIndexValue: DefaultAnimsEnum = 0;
    protected _preCacheMode = -1;
    protected _cacheMode: AnimationCacheMode = AnimationCacheMode.REALTIME;
    @serializable
    protected _defaultCacheModeValue: AnimationCacheMode = AnimationCacheMode.REALTIME;
    @serializable
    protected _timeScale = 1;
    @serializable
    protected _playTimes = -1;

    @serializable
    protected _debugBones = false;
    /* protected */ _debugDraw: Graphics | null = null;

    @serializable
    public _enableBatch = false;

    // DragonBones data store key.
    protected _armatureKey = '';

    // Below properties will effect when cache mode is SHARED_CACHE or PRIVATE_CACHE.
    // accumulate time
    protected _accTime = 0;
    // Play times counter
    protected _playCount = 0;
    // Frame cache
    protected _frameCache: AnimationCache | null = null;
    // Cur frame
    /* protected */ _curFrame: ArmatureFrame | null = null;
    // Playing flag
    protected _playing = false;
    // Armature cache
    protected _armatureCache: ArmatureCache | null = null;

    protected _eventTarget: EventTarget;

    protected _factory: CCFactory | null = null;

    protected _displayProxy: CCArmatureDisplay | null = null;

    protected _meshRenderDataArray: ArmatureDisplayMeshData[] = [];
    protected _materialCache: { [key: string]: MaterialInstance } = {} as any;

    protected _enumArmatures: any = Enum({});
    protected _enumAnimations: any = Enum({});

    protected _socketNodes: Map<string, Node> = new Map();
    protected _cachedSockets: Map<string, BoneIndex> = new Map();

    @serializable
    protected _sockets: DragonBoneSocket[] = [];

    private _inited;

    constructor () {
        super();
        // Property _materialCache Use to cache material,since dragonBones may use multiple texture,
        // it will clone from the '_material' property,if the dragonbones only have one texture,
        // it will just use the _material,won't clone it.
        // So if invoke getMaterial,it only return _material,if you want to change all materialCache,
        // you can change materialCache directly.
        this._eventTarget = new EventTarget();
        this._inited = false;
        this.attachUtil = new AttachUtil();
        this.initFactory();
        setEnumAttr(this, '_animationIndex', this._enumAnimations);
        setEnumAttr(this, '_defaultArmatureIndex', this._enumArmatures);
    }

    initFactory () {
        this._factory = CCFactory.getInstance();
    }

    onLoad () {
        // Adapt to old code,remove unuse child which is created by old code.
        // This logic can be remove after 2.2 or later.
        const children = this.node.children;
        for (let i = 0, n = children.length; i < n; i++) {
            const child = children[i];
            const pos = child.name && child.name.search('CHILD_ARMATURE-');
            if (pos === 0) {
                child.destroy();
            }
        }
    }

    public requestMeshRenderData () {
        const arr = this._meshRenderDataArray;
        if (arr.length > 0 && arr[arr.length - 1].renderData.vertexCount === 0) {
            return arr[arr.length - 1];
        }
        const renderData = new MeshRenderData();
        const comb = { renderData, texture: null };
        arr.push(comb);
        return comb;
    }

    public destroyRenderData () {
        if (this._meshRenderDataArray) {
            this._meshRenderDataArray.forEach((rd) => { rd.renderData.reset(); });
            this._meshRenderDataArray.length = 0;
        }
    }

    public resetRenderData () {
        if (this._meshRenderDataArray) {
            this._meshRenderDataArray.forEach((rd) => { rd.renderData.reset(); });
        }
    }

    public getMaterialForBlend (src: BlendFactor, dst: BlendFactor): MaterialInstance {
        const key = `${src}/${dst}`;
        let inst = this._materialCache[key];
        if (inst) {
            return inst;
        }
        const material = this.getMaterial(0)!;
        const matInfo = {
            parent: material,
            subModelIdx: 0,
            owner: this,
        };
        inst = new MaterialInstance(matInfo);
        inst.recompileShaders({ USE_LOCAL: false }, 0); // TODO: not supported by ui
        this._materialCache[key] = inst;
        inst.overridePipelineStates({
            blendState: {
                targets: [{
                    blendSrc: src, blendDst: dst,
                }],
            },
        });
        return inst;
    }

    public _meshRenderDataArrayIdx = 0;
    protected _render (ui: IBatcher) {
        if (this._meshRenderDataArray) {
            for (let i = 0; i < this._meshRenderDataArray.length; i++) {
                // HACK
                const mat = this.material;
                this._meshRenderDataArrayIdx = i;
                const m = this._meshRenderDataArray[i];
                if (m.renderData.material) {
                    this.material = m.renderData.material;
                }
                if (m.texture) {
                    ui.commitComp(this, m.texture, this._assembler, null);
                }
                this.material = mat;
            }
        }
    }

    // if change use batch mode, just clear material cache
    _updateBatch () {
        // const baseMaterial = this.getMaterial(0);
        // if (baseMaterial) {
        //     baseMaterial.define('CC_USE_MODEL', !this.enableBatch);
        // }
        this._materialCache = {};
        this.destroyRenderData();
        this.markForUpdateRenderData();
    }

    // override base class _updateMaterial to set define value and clear material cache
    _updateMaterial () {
        // const baseMaterial = this.getMaterial(0);
        // if (baseMaterial) {
        //     baseMaterial.define('CC_USE_MODEL', !this.enableBatch);
        //     baseMaterial.define('USE_TEXTURE', true);

        //     const srcBlendFactor = this.premultipliedAlpha ? cc.gfx.BLEND_ONE : cc.gfx.BLEND_SRC_ALPHA;
        //     const dstBlendFactor = cc.gfx.BLEND_ONE_MINUS_SRC_ALPHA;

        //     baseMaterial.setBlend(
        //         true,
        //         ccBLEND_FUNC_ADD,
        //         srcBlendFactor, srcBlendFactor,
        //         cc.gfx.BLEND_FUNC_ADD,
        //         dstBlendFactor, dstBlendFactor
        //     );
        // }
        this.markForUpdateRenderData();
    }

    // override base class disableRender to clear post render flag
    disableRender () {
        // this._super();
        // this.node._renderFlag &= ~FLAG_POST_RENDER;
    }

    _validateRender () {
        const texture = this.dragonAtlasAsset && this.dragonAtlasAsset.texture;
        if (!texture) {
            this.disableRender();
            return false;
        }
        return true;
    }

    __preload () {
        super.__preload();
        this._init();
    }

    _init () {
        if (EDITOR) {
            const Flags = CCObject.Flags;
            this._objFlags |= (Flags.IsAnchorLocked | Flags.IsSizeLocked);
            // this._refreshInspector();
        }

        this._cacheMode = this._defaultCacheMode;

        if (this._inited) return;
        this._inited = true;

        // this._resetAssembler();
        // this._activateMaterial();

        this._parseDragonAtlasAsset();
        this._refresh();

        const children = this.node.children;
        for (let i = 0, n = children.length; i < n; i++) {
            const child = children[i];
            if (child && child.name === 'DEBUG_DRAW_NODE') {
                child.destroy();
            }
        }
        this._updateDebugDraw();
        this._indexBoneSockets();
        this._updateSocketBindings();
    }

    /**
     * @en
     * The key of dragonbones cache data, which is regard as 'dragonbonesName', when you want to change dragonbones cloth.
     * @zh
     * 缓存龙骨数据的key值，换装的时会使用到该值，作为dragonbonesName使用
     * @method getArmatureKey
     * @return {String}
     * @example
     * let factory = dragonBones.CCFactory.getInstance();
     * let needChangeSlot = needChangeArmature.armature().getSlot("changeSlotName");
     * factory.replaceSlotDisplay(toChangeArmature.getArmatureKey(), "armatureName", "slotName", "displayName", needChangeSlot);
     */
    getArmatureKey () {
        return this._armatureKey;
    }

    /**
     * @en
     * It's best to set cache mode before set property 'dragonAsset', or will waste some cpu time.
     * If set the mode in editor, then no need to worry about order problem.
     * @zh
     * 若想切换渲染模式，最好在设置'dragonAsset'之前，先设置好渲染模式，否则有运行时开销。
     * 若在编辑中设置渲染模式，则无需担心设置次序的问题。
     *
     * @method setAnimationCacheMode
     * @param {AnimationCacheMode} cacheMode
     * @example
     * armatureDisplay.setAnimationCacheMode(dragonBones.ArmatureDisplay.AnimationCacheMode.SHARED_CACHE);
     */
    setAnimationCacheMode (cacheMode: AnimationCacheMode) {
        if (this._preCacheMode !== cacheMode) {
            this._cacheMode = cacheMode;
            this._buildArmature();
            if (this._armature && !this.isAnimationCached()) {
                this._factory!._dragonBones.clock.add(this._armature);
            }
            this._updateSocketBindings();
            this.markForUpdateRenderData();
        }
    }

    /**
     * @en Whether in cached mode.
     * @zh 当前是否处于缓存模式。
     * @method isAnimationCached
     * @return {Boolean}
     */
    isAnimationCached () {
        if (EDITOR) return false;
        return this._cacheMode !== AnimationCacheMode.REALTIME;
    }

    onEnable () {
        super.onEnable();
        // If cache mode is cache, no need to update by dragonbones library.
        if (this._armature && !this.isAnimationCached()) {
            this._factory!._dragonBones.clock.add(this._armature);
        }
        this._flushAssembler();
        ArmatureSystem.getInstance().add(this);
    }

    onDisable () {
        super.onDisable();
        // If cache mode is cache, no need to update by dragonbones library.
        if (this._armature && !this.isAnimationCached()) {
            this._factory!._dragonBones.clock.remove(this._armature);
        }
        ArmatureSystem.getInstance().remove(this);
    }

    _emitCacheCompleteEvent () {
        // Animation loop complete, the event diffrent from dragonbones inner event,
        // It has no event object.
        this._eventTarget.emit(EventObject.LOOP_COMPLETE);

        // Animation complete the event diffrent from dragonbones inner event,
        // It has no event object.
        this._eventTarget.emit(EventObject.COMPLETE);
    }

    updateAnimation (dt) {
        if (!this.isAnimationCached()) return;
        if (!this._frameCache) return;

        this.markForUpdateRenderData();

        const frameCache = this._frameCache;
        if (!frameCache.isInited()) {
            return;
        }

        const frames = frameCache.frames;
        if (!this._playing) {
            if (frameCache.isInvalid()) {
                frameCache.updateToFrame();
                this._curFrame = frames[frames.length - 1];
            }
            return;
        }

        const frameTime = ArmatureCache.FrameTime;

        // Animation Start, the event different from dragonbones inner event,
        // It has no event object.
        if (this._accTime === 0 && this._playCount === 0) {
            this._eventTarget.emit(EventObject.START);
        }

        const globalTimeScale = timeScale;
        this._accTime += dt * this.timeScale * globalTimeScale;
        let frameIdx = Math.floor(this._accTime / frameTime);
        if (!frameCache.isCompleted) {
            frameCache.updateToFrame(frameIdx);
        }

        if (frameCache.isCompleted && frameIdx >= frames.length) {
            this._playCount++;
            if ((this.playTimes > 0 && this._playCount >= this.playTimes)) {
                // set frame to end frame.
                this._curFrame = frames[frames.length - 1];
                this._accTime = 0;
                this._playing = false;
                this._playCount = 0;
                this._emitCacheCompleteEvent();
                this.attachUtil._syncAttachedNode();
                return;
            }
            this._accTime = 0;
            frameIdx = 0;
            this._emitCacheCompleteEvent();
        }

        this._curFrame = frames[frameIdx];
        this.attachUtil._syncAttachedNode();
    }

    onDestroy () {
        this._materialInstances = this._materialInstances.filter((instance) => !!instance);
        super.onDestroy();
        this._inited = false;

        if (!EDITOR) {
            if (this._cacheMode === AnimationCacheMode.PRIVATE_CACHE) {
                this._armatureCache!.dispose();
                this._armatureCache = null;
                this._armature = null;
            } else if (this._cacheMode === AnimationCacheMode.SHARED_CACHE) {
                this._armatureCache = null;
                this._armature = null;
            } else if (this._armature) {
                this._armature.dispose();
                this._armature = null;
            }
        } else if (this._armature) {
            this._armature.dispose();
            this._armature = null;
        }
        this.destroyRenderData();
    }

    _updateDebugDraw () {
        if (this.debugBones) {
            if (!this._debugDraw) {
                const debugDrawNode = new Node('DEBUG_DRAW_NODE');
                debugDrawNode.hideFlags |= CCObject.Flags.DontSave | CCObject.Flags.HideInHierarchy;
                const debugDraw = debugDrawNode.addComponent(Graphics);
                debugDraw.lineWidth = 1;
                debugDraw.strokeColor = new Color(255, 0, 0, 255);

                this._debugDraw = debugDraw;
            }

            this._debugDraw.node.parent = this.node;
        } else if (this._debugDraw) {
            this._debugDraw.node.parent = null;
        }
        this.destroyRenderData();
        this.markForUpdateRenderData();
    }

    _buildArmature () {
        if (!this.dragonAsset || !this.dragonAtlasAsset || !this.armatureName) return;

        // Switch Asset or Atlas or cacheMode will rebuild armature.
        if (this._armature) {
            // dispose pre build armature
            if (!EDITOR) {
                if (this._preCacheMode === AnimationCacheMode.PRIVATE_CACHE) {
                    this._armatureCache!.dispose();
                } else if (this._preCacheMode === AnimationCacheMode.REALTIME) {
                    this._armature.dispose();
                }
            } else {
                this._armature.dispose();
            }

            this._armatureCache = null;
            this._armature = null;
            this._displayProxy = null;
            this._frameCache = null;
            this._curFrame = null;
            this._playing = false;
            this._preCacheMode = -1;
        }

        if (!EDITOR) {
            if (this._cacheMode === AnimationCacheMode.SHARED_CACHE) {
                this._armatureCache = ArmatureCache.sharedCache;
            } else if (this._cacheMode === AnimationCacheMode.PRIVATE_CACHE) {
                this._armatureCache = new ArmatureCache();
                this._armatureCache.enablePrivateMode();
            }
        }

        const atlasUUID = this.dragonAtlasAsset._uuid;
        this._armatureKey = this.dragonAsset.init(this._factory!, atlasUUID);

        if (this.isAnimationCached()) {
            this._armature = this._armatureCache!.getArmatureCache(this.armatureName, this._armatureKey, atlasUUID);
            if (!this._armature) {
                // Cache fail,swith to REALTIME cache mode.
                this._cacheMode = AnimationCacheMode.REALTIME;
            }
        }

        this._preCacheMode = this._cacheMode;
        if (EDITOR || this._cacheMode === AnimationCacheMode.REALTIME) {
            this._displayProxy = this._factory!.buildArmatureDisplay(this.armatureName, this._armatureKey, '', atlasUUID) as CCArmatureDisplay;
            if (!this._displayProxy) return;
            this._displayProxy._ccNode = this.node;
            this._displayProxy._ccComponent = this;
            this._displayProxy.setEventTarget(this._eventTarget);
            this._armature = this._displayProxy._armature;
            this._armature!.animation.timeScale = this.timeScale;
            // If change mode or armature, armature must insert into clock.
            // this._factory._dragonBones.clock.add(this._armature);
        }

        if (this._cacheMode !== AnimationCacheMode.REALTIME && this.debugBones) {
            console.warn('Debug bones is invalid in cached mode');
        }

        if (this._armature) {
            const armatureData = this._armature.armatureData;
            const aabb = armatureData.aabb;
            this.node._uiProps.uiTransformComp!.setContentSize(aabb.width, aabb.height);
        }

        this._updateBatch();
        this.attachUtil.init(this);

        if (this.animationName) {
            this.playAnimation(this.animationName, this.playTimes);
        }

        this.destroyRenderData();
        this.markForUpdateRenderData();
    }

    public querySockets () {
        if (!this._armature) {
            return [];
        }
        if (this._cachedSockets.size === 0) {
            this._indexBoneSockets();
        }
        return Array.from(this._cachedSockets.keys()).sort();
    }

    public setBlendHash () {
        if (this._blendHash !== -1) this._blendHash = -1;
    }

    /**
     * @en Query socket path with slot or bone name.
     * @zh 查询 Socket 路径
     * @param name Slot name or Bone name
     */
    public querySocketPathByName (name: string) {
        const ret: string[] = [];
        for (const key of this._cachedSockets.keys()) {
            if (key.endsWith(name)) {
                ret.push(key);
            }
        }
        return ret;
    }

    _parseDragonAtlasAsset () {
        if (this.dragonAtlasAsset) {
            this.dragonAtlasAsset.init(this._factory!);
        }
    }

    _refresh () {
        this._buildArmature();
        this._indexBoneSockets();
        if (EDITOR) {
            // update inspector
            this._updateArmatureEnum();
            this._updateAnimEnum();
            this._updateCacheModeEnum();
            // Editor.Utils.refreshSelectedInspector('node', this.node.uuid);
        }
        this.markForUpdateRenderData();
    }

    _cacheModeEnum: any;
    // EDITOR
    _updateCacheModeEnum () {
        this._cacheModeEnum = Enum({});
        if (this._armature) {
            Object.assign(this._cacheModeEnum, AnimationCacheMode);
        } else {
            Object.assign(this._cacheModeEnum, DefaultCacheMode);
        }
        setEnumAttr(this, '_defaultCacheMode', this._cacheModeEnum);
    }

    // update animation list for editor
    _updateAnimEnum () {
        let animEnum;
        if (this.dragonAsset) {
            animEnum = this.dragonAsset.getAnimsEnum(this.armatureName);
        } else {
            animEnum = DefaultAnimsEnum;
        }

        this._enumAnimations = Enum({});
        Object.assign(this._enumAnimations, animEnum || DefaultAnimsEnum);
        Enum.update(this._enumAnimations);
        // change enum
        setEnumAttr(this, '_animationIndex', this._enumAnimations);
    }

    // update armature list for editor
    _updateArmatureEnum () {
        let armatureEnum;
        if (this.dragonAsset) {
            armatureEnum = this.dragonAsset.getArmatureEnum();
        } else {
            armatureEnum = DefaultArmaturesEnum;
        }

        this._enumArmatures = Enum({});
        Object.assign(this._enumArmatures, armatureEnum || DefaultArmaturesEnum);
        Enum.update(this._enumArmatures);
        // change enum
        setEnumAttr(this, '_defaultArmatureIndex', this._enumArmatures);
    }

    _indexBoneSockets () {
        if (!this._armature) {
            return;
        }
        this._cachedSockets.clear();
        const nameToBone = this._cachedSockets;
        const cacheBoneName = (bi: BoneIndex, bones: Bone[], cache: Map<BoneIndex, string>): string => {
            if (cache.has(bi)) { return cache.get(bi)!; }
            const bone = bones[bi as unknown as number];
            if (!bone.parent) {
                cache.set(bi, bone.name);
                (bone as any).path = bone.name;
                return bone.name;
            }
            const name = `${cacheBoneName((bone.parent as any)._boneIndex, bones, cache)}/${bone.name}`;
            cache.set(bi, name);
            (bone as any).path = name;
            return name;
        };
        const walkArmature = (prefix: string, armature: Armature) => {
            const bones = armature.getBones();
            const boneToName = new Map<BoneIndex, string>();
            for (let i = 0; i < bones.length; i++) {
                (bones[i] as any)._boneIndex = i;
            }
            for (let i = 0; i < bones.length; i++) {
                cacheBoneName(i as unknown as BoneIndex, bones, boneToName);
            }
            for (const bone of boneToName.keys()) {
                nameToBone.set(`${prefix}${boneToName.get(bone)!}`, bone);
            }
            const slots = armature.getSlots();
            for (let i = 0; i < slots.length; i++) {
                if (slots[i].childArmature) {
                    walkArmature(slots[i].name, slots[i].childArmature!);
                }
            }
        };
        walkArmature('', this._armature);
    }

    /**
     * @en
     * Play the specified animation.
     * Parameter animName specify the animation name.
     * Parameter playTimes specify the repeat times of the animation.
     * -1 means use the value of the config file.
     * 0 means play the animation for ever.
     * >0 means repeat times.
     * @zh
     * 播放指定的动画.
     * animName 指定播放动画的名称。
     * playTimes 指定播放动画的次数。
     * -1 为使用配置文件中的次数。
     * 0 为无限循环播放。
     * >0 为动画的重复次数。
     */
    playAnimation (animName: string, playTimes?: number) {
        this.playTimes = (playTimes === undefined) ? -1 : playTimes;
        this.animationName = animName;

        if (this.isAnimationCached()) {
            let cache = this._armatureCache!.getAnimationCache(this._armatureKey, animName);
            if (!cache) {
                cache = this._armatureCache!.initAnimationCache(this._armatureKey, animName);
            }
            if (cache) {
                this._accTime = 0;
                this._playCount = 0;
                this._frameCache = cache;
                if (this._sockets.length > 0) {
                    this._frameCache.enableCacheAttachedInfo();
                }
                this._frameCache.updateToFrame(0);
                this._playing = true;
                this._curFrame = this._frameCache.frames[0];
            }
        } else if (this._armature) {
            return this._armature.animation.play(animName, this.playTimes);
        }
        this.markForUpdateRenderData();
        return null;
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
    updateAnimationCache (animName: string) {
        if (!this.isAnimationCached()) return;
        this._armatureCache!.updateAnimationCache(this._armatureKey, animName);
    }

    /**
     * @en
     * Invalidates the animation cache, which is then recomputed on each frame..
     * @zh
     * 使动画缓存失效，之后会在每帧重新计算。
     * @method invalidAnimationCache
     */
    invalidAnimationCache () {
        if (!this.isAnimationCached()) return;
        this._armatureCache!.invalidAnimationCache(this._armatureKey);
    }

    /**
     * @en
     * Get the all armature names in the DragonBones Data.
     * @zh
     * 获取 DragonBones 数据中所有的 armature 名称
     * @method getArmatureNames
     * @returns {Array}
     */
    getArmatureNames () {
        const dragonBonesData = this._factory!.getDragonBonesData(this._armatureKey);
        return (dragonBonesData && dragonBonesData.armatureNames) || [];
    }

    /**
     * @en
     * Get the all animation names of specified armature.
     * @zh
     * 获取指定的 armature 的所有动画名称。
     * @method getAnimationNames
     * @param {String} armatureName
     * @returns {Array}
     */
    getAnimationNames (armatureName: string) {
        const ret: string[] = [];
        const dragonBonesData = this._factory!.getDragonBonesData(this._armatureKey);
        if (dragonBonesData) {
            const armatureData = dragonBonesData.getArmature(armatureName);
            if (armatureData) {
                for (const animName in armatureData.animations) {
                    // eslint-disable-next-line no-prototype-builtins
                    if (armatureData.animations.hasOwnProperty(animName)) {
                        ret.push(animName);
                    }
                }
            }
        }
        return ret;
    }

    /**
     * @en
     * Add event listener for the DragonBones Event, the same to addEventListener.
     * @zh
     * 添加 DragonBones 事件监听器，与 addEventListener 作用相同。
     * @method on
     * @param {String} type - A string representing the event type to listen for.
     * @param {Function} listener - The callback that will be invoked when the event is dispatched.
     * @param {Event} listener.event event
     * @param {Object} [target] - The target (this object) to invoke the callback, can be null
     */
    on (eventType: string, listener, target) {
        this.addEventListener(eventType, listener, target);
    }

    /**
     * @en
     * Remove the event listener for the DragonBones Event, the same to removeEventListener.
     * @zh
     * 移除 DragonBones 事件监听器，与 removeEventListener 作用相同。
     * @method off
     * @param {String} type - A string representing the event type to listen for.
     * @param {Function} [listener]
     * @param {Object} [target]
     */
    off (eventType: string, listener, target) {
        this.removeEventListener(eventType, listener, target);
    }

    /**
     * @en
     * Add DragonBones one-time event listener, the callback will remove itself after the first time it is triggered.
     * @zh
     * 添加 DragonBones 一次性事件监听器，回调会在第一时间被触发后删除自身。
     * @method once
     * @param {String} type - A string representing the event type to listen for.
     * @param {Function} listener - The callback that will be invoked when the event is dispatched.
     * @param {Event} listener.event event
     * @param {Object} [target] - The target (this object) to invoke the callback, can be null
     */
    once (eventType: string, listener, target) {
        this._eventTarget.once(eventType, listener, target);
    }

    /**
     * @en
     * Add event listener for the DragonBones Event.
     * @zh
     * 添加 DragonBones 事件监听器。
     * @method addEventListener
     * @param {String} type - A string representing the event type to listen for.
     * @param {Function} listener - The callback that will be invoked when the event is dispatched.
     * @param {Event} listener.event event
     * @param {Object} [target] - The target (this object) to invoke the callback, can be null
     */
    addEventListener (eventType, listener, target) {
        this._eventTarget.on(eventType, listener, target);
    }

    /**
     * @en
     * Remove the event listener for the DragonBones Event.
     * @zh
     * 移除 DragonBones 事件监听器。
     * @method removeEventListener
     * @param {String} type - A string representing the event type to listen for.
     * @param {Function} [listener]
     * @param {Object} [target]
     */
    removeEventListener (eventType, listener, target) {
        this._eventTarget.off(eventType, listener, target);
    }

    /**
     * @en
     * Build the armature for specified name.
     * @zh
     * 构建指定名称的 armature 对象
     * @method buildArmature
     * @param {String} armatureName
     * @param {Node} node
     * @return {dragonBones.ArmatureDisplay}
     */
    buildArmature (armatureName: string, node?: Node) {
        return this._factory!.createArmatureNode(this, armatureName, node);
    }

    /**
     * @en
     * Get the current armature object of the ArmatureDisplay.
     * @zh
     * 获取 ArmatureDisplay 当前使用的 Armature 对象
     * @method armature
     * @returns {Object}
     */
    armature () {
        return this._armature;
    }

    protected _flushAssembler () {
        const assembler = ArmatureDisplay.Assembler.getAssembler(this);
        if (this._assembler !== assembler) {
            this._assembler = assembler;
        }
        if (this._meshRenderDataArray.length === 0) {
            if (this._assembler && this._assembler.createData) {
                this._assembler.createData(this);
                this.markForUpdateRenderData();
                this._updateColor();
            }
        }
    }

    protected _updateSocketBindings () {
        if (!this._armature) return;
        this._socketNodes.clear();
        for (let i = 0, l = this._sockets.length; i < l; i++) {
            const socket = this._sockets[i];
            if (socket.path && socket.target) {
                const bone = this._cachedSockets.get(socket.path);
                if (!bone) {
                    console.error(`Skeleton data does not contain path ${socket.path}`);
                    continue;
                }
                socket.boneIndex = bone as unknown as number;
                this._socketNodes.set(socket.path, socket.target);
            }
        }
    }

    private _verifySockets (sockets: DragonBoneSocket[]) {
        for (let i = 0, l = sockets.length; i < l; i++) {
            const target = sockets[i].target;
            if (target) {
                if (!target.parent || (target.parent !== this.node)) {
                    console.error(`Target node ${target.name} is expected to be a direct child of ${this.node.name}`);
                    continue;
                }
            }
        }
    }
}

legacyCC.internal.ArmatureDisplay = ArmatureDisplay;
