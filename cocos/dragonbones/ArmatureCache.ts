import { CCFactory } from './CCFactory';
import dragonBones from './lib/dragonBones';

const MaxCacheTime = 30;
const FrameTime = 1 / 60;

const _vertices: number[] = [];
const _indices: number[] = [];
let _boneInfoOffset = 0;
let _vertexOffset = 0;
let _indexOffset = 0;
let _vfOffset = 0;
let _preTexUrl: string | null = null;
let _preBlendMode = null;
let _segVCount = 0;
let _segICount = 0;
let _segOffset = 0;
let _colorOffset = 0;
let _preColor = null;
let _x: number;
let _y: number;

export interface ArmatureInfo {
    curAnimationCache: AnimationCache | null;
    armature: dragonBones.Armature;
    animationsCache: { [key: string]: AnimationCache };
}

export interface ArmatureFrame {
    segments: ArmatureFrameSegment[];
}

export interface ArmatureFrameSegment {

}

//Cache all frames in an animation
export class AnimationCache {
    _privateMode = false;
    _inited = false;
    _invalid = true;
    _enableCacheAttachedInfo = false;
    frames: ArmatureFrame[] = [];
    totalTime = 0;
    isCompleted = false;
    _frameIdx = -1;

    _armatureInfo: ArmatureInfo | null = null;
    _animationName: string | null = null;
    _tempSegments = null;
    _tempColors = null;
    _tempBoneInfos = null;

    constructor () {
    }

    init (armatureInfo: ArmatureInfo, animationName: string) {
        this._inited = true;
        this._armatureInfo = armatureInfo;
        this._animationName = animationName;
    }

    // Clear texture quote.
    clear () {
        this._inited = false;
        for (let i = 0, n = this.frames.length; i < n; i++) {
            const frame = this.frames[i];
            frame.segments.length = 0;
        }
        this.invalidAllFrame();
    }

    begin () {
        if (!this._invalid) return;

        const armatureInfo = this._armatureInfo!;
        const curAnimationCache = armatureInfo.curAnimationCache;
        if (curAnimationCache && curAnimationCache !== this) {
            if (this._privateMode) {
                curAnimationCache.invalidAllFrame();
            } else {
                curAnimationCache.updateToFrame();
            }
        }
        const armature = armatureInfo.armature;
        const animation = armature.animation;
        animation.play(this._animationName, 1);

        armatureInfo.curAnimationCache = this;
        this._invalid = false;
        this._frameIdx = -1;
        this.totalTime = 0;
        this.isCompleted = false;
    }

    end () {
        if (!this._needToUpdate()) {
            this._armatureInfo!.curAnimationCache = null;
            this.frames.length = this._frameIdx + 1;
            this.isCompleted = true;
        }
    }

    _needToUpdate (toFrameIdx?: number) {
        const armatureInfo = this._armatureInfo!;
        const armature = armatureInfo.armature;
        const animation = armature.animation;
        return !animation.isCompleted
            && this.totalTime < MaxCacheTime
            && (toFrameIdx === undefined || this._frameIdx < toFrameIdx);
    }

    updateToFrame (toFrameIdx?: number) {
        if (!this._inited) return;

        this.begin();

        if (!this._needToUpdate(toFrameIdx)) return;

        const armatureInfo = this._armatureInfo!;
        const armature = armatureInfo.armature;

        do {
            // Solid update frame rate 1/60.
            armature.advanceTime(FrameTime);
            this._frameIdx++;
            this._updateFrame(armature, this._frameIdx);
            this.totalTime += FrameTime;
        } while (this._needToUpdate(toFrameIdx));

        this.end();
    }

    isInited () {
        return this._inited;
    }

    isInvalid () {
        return this._invalid;
    }

    invalidAllFrame () {
        this.isCompleted = false;
        this._invalid = true;
    }

    updateAllFrame () {
        this.invalidAllFrame();
        this.updateToFrame();
    }

    enableCacheAttachedInfo () {
        if (!this._enableCacheAttachedInfo) {
            this._enableCacheAttachedInfo = true;
            this.invalidAllFrame();
        }
    }

    _updateFrame (armature, index) {
        _vfOffset = 0;
        _boneInfoOffset = 0;
        _indexOffset = 0;
        _vertexOffset = 0;
        _preTexUrl = null;
        _preBlendMode = null;
        _segVCount = 0;
        _segICount = 0;
        _segOffset = 0;
        _colorOffset = 0;
        _preColor = null;

        this.frames[index] = this.frames[index] || {
            segments: [],
            colors: [],
            boneInfos: [],
            vertices: null,
            uintVert: null,
            indices: null,
        };
        const frame = this.frames[index];

        const segments = this._tempSegments = frame.segments;
        const colors = this._tempColors = frame.colors;
        const boneInfos = this._tempBoneInfos = frame.boneInfos;

        this._traverseArmature(armature, 1.0);
        // At last must handle pre color and segment.
        // Because vertex count will right at the end.
        // Handle pre color.
        if (_colorOffset > 0) {
            colors[_colorOffset - 1].vfOffset = _vfOffset;
        }
        colors.length = _colorOffset;
        boneInfos.length = _boneInfoOffset;

        // Handle pre segment
        let preSegOffset = _segOffset - 1;
        if (preSegOffset >= 0) {
            if (_segICount > 0) {
                let preSegInfo = segments[preSegOffset];
                preSegInfo.indexCount = _segICount;
                preSegInfo.vfCount = _segVCount * 5;
                preSegInfo.vertexCount = _segVCount;
                segments.length = _segOffset;
            } else {
                segments.length = _segOffset - 1;
            }
        }

        // Discard all segments.
        if (segments.length === 0) return;

        // Fill vertices
        let vertices = frame.vertices;
        let uintVert = frame.uintVert;
        if (!vertices || vertices.length < _vfOffset) {
            vertices = frame.vertices = new Float32Array(_vfOffset);
            uintVert = frame.uintVert = new Uint32Array(vertices.buffer);
        }

        for (let i = 0, j = 0; i < _vfOffset;) {
            vertices[i++] = _vertices[j++]; // x
            vertices[i++] = _vertices[j++]; // y
            vertices[i++] = _vertices[j++]; // u
            vertices[i++] = _vertices[j++]; // v
            uintVert[i++] = _vertices[j++]; // color
        }

        // Fill indices
        let indices = frame.indices;
        if (!indices || indices.length < _indexOffset) {
            indices = frame.indices = new Uint16Array(_indexOffset);
        }

        for (let i = 0; i < _indexOffset; i++) {
            indices[i] = _indices[i];
        }

        frame.vertices = vertices;
        frame.uintVert = uintVert;
        frame.indices = indices;
    }

    _traverseArmature (armature, parentOpacity) {
        let colors = this._tempColors;
        let segments = this._tempSegments;
        let boneInfos = this._tempBoneInfos;
        let gVertices = _vertices;
        let gIndices = _indices;
        let slotVertices, slotIndices;
        let slots = armature._slots, slot, slotMatrix, slotMatrixm, slotColor, colorVal;
        let texture;
        let preSegOffset, preSegInfo;
        let bones = armature._bones;

        if (this._enableCacheAttachedInfo) {
            for (let i = 0, l = bones.length; i < l; i++, _boneInfoOffset++) {
                let bone = bones[i];
                let boneInfo = boneInfos[_boneInfoOffset];
                if (!boneInfo) {
                    boneInfo = boneInfos[_boneInfoOffset] = {
                        globalTransformMatrix: new dragonBones.Matrix(),
                    };
                }
                let boneMat = bone.globalTransformMatrix;
                let cacheBoneMat = boneInfo.globalTransformMatrix;
                cacheBoneMat.copyFrom(boneMat);
            }
        }

        for (let i = 0, l = slots.length; i < l; i++) {
            slot = slots[i];
            if (!slot._visible || !slot._displayData) continue;

            slot.updateWorldMatrix();
            slotColor = slot._color;

            if (slot.childArmature) {
                this._traverseArmature(slot.childArmature, parentOpacity * slotColor.a / 255);
                continue;
            }

            texture = slot.getTexture();
            if (!texture) continue;

            if (_preTexUrl !== texture.nativeUrl || _preBlendMode !== slot._blendMode) {
                _preTexUrl = texture.nativeUrl;
                _preBlendMode = slot._blendMode;
                // Handle pre segment.
                preSegOffset = _segOffset - 1;
                if (preSegOffset >= 0) {
                    if (_segICount > 0) {
                        preSegInfo = segments[preSegOffset];
                        preSegInfo.indexCount = _segICount;
                        preSegInfo.vertexCount = _segVCount;
                        preSegInfo.vfCount = _segVCount * 5;
                    } else {
                        // Discard pre segment.
                        _segOffset--;
                    }
                }
                // Handle now segment.
                segments[_segOffset] = {
                    tex: texture,
                    blendMode: slot._blendMode,
                    indexCount: 0,
                    vertexCount: 0,
                    vfCount: 0
                };
                _segOffset++;
                _segICount = 0;
                _segVCount = 0;
            }

            colorVal = ((slotColor.a * parentOpacity << 24) >>> 0) + (slotColor.b << 16) + (slotColor.g << 8) + slotColor.r;

            if (_preColor !== colorVal) {
                _preColor = colorVal;
                if (_colorOffset > 0) {
                    colors[_colorOffset - 1].vfOffset = _vfOffset;
                }
                colors[_colorOffset++] = {
                    r: slotColor.r,
                    g: slotColor.g,
                    b: slotColor.b,
                    a: slotColor.a * parentOpacity,
                    vfOffset: 0
                }
            }

            slotVertices = slot._localVertices;
            slotIndices = slot._indices;

            slotMatrix = slot._worldMatrix;
            slotMatrixm = slotMatrix.m;

            for (let j = 0, vl = slotVertices.length; j < vl;) {
                _x = slotVertices[j++];
                _y = slotVertices[j++];
                gVertices[_vfOffset++] = _x * slotMatrixm[0] + _y * slotMatrixm[4] + slotMatrixm[12];
                gVertices[_vfOffset++] = _x * slotMatrixm[1] + _y * slotMatrixm[5] + slotMatrixm[13];
                gVertices[_vfOffset++] = slotVertices[j++];
                gVertices[_vfOffset++] = slotVertices[j++];
                gVertices[_vfOffset++] = colorVal;
            }

            // This place must use segment vertex count to calculate vertex offset.
            // Assembler will calculate vertex offset again for different segment.
            for (let ii = 0, il = slotIndices.length; ii < il; ii++) {
                gIndices[_indexOffset++] = _segVCount + slotIndices[ii];
            }

            _vertexOffset = _vfOffset / 5;
            _segICount += slotIndices.length;
            _segVCount += slotVertices.length / 4;
        }
    }
}

export class ArmatureCache {

    protected _privateMode: boolean = false;
    protected _animationPool: Record<string, AnimationCache> = {};
    protected _armatureCache: Record<string, ArmatureInfo> = {};

    constructor () {
    }

    enablePrivateMode () {
        this._privateMode = true;
    }

    // If cache is private, cache will be destroy when dragonbones node destroy.
    dispose () {
        for (var key in this._armatureCache) {
            var armatureInfo = this._armatureCache[key];
            if (armatureInfo) {
                let armature = armatureInfo.armature;
                armature && armature.dispose();
            }
        }
        this._armatureCache = {};
        this._animationPool = {};
    }

    _removeArmature (armatureKey: string) {
        var armatureInfo = this._armatureCache[armatureKey];
        let animationsCache = armatureInfo.animationsCache;
        for (var aniKey in animationsCache) {
            // Clear cache texture, and put cache into pool.
            // No need to create TypedArray next time.
            let animationCache = animationsCache[aniKey];
            if (!animationCache) continue;
            this._animationPool[armatureKey + "#" + aniKey] = animationCache;
            animationCache.clear();
        }

        let armature = armatureInfo.armature;
        armature && armature.dispose();
        delete this._armatureCache[armatureKey];
    }

    // When db assets be destroy, remove armature from db cache.
    resetArmature (uuid: string) {
        for (var armatureKey in this._armatureCache) {
            if (armatureKey.indexOf(uuid) == -1) continue;
            this._removeArmature(armatureKey);
        }
    }

    getArmatureCache (armatureName: string, armatureKey: string, atlasUUID: string) {
        let armatureInfo = this._armatureCache[armatureKey];
        let armature: dragonBones.Armature;
        if (!armatureInfo) {
            let factory = CCFactory.getInstance();
            let proxy = factory.buildArmatureDisplay(armatureName, armatureKey, "", atlasUUID) as CCArmatureDisplay;
            if (!proxy || !proxy.armature) return;
            armature = proxy.armature;
            // If armature has child armature, can not be cache, because it's
            // animation data can not be precompute.
            if (!ArmatureCache.canCache(armature)) {
                armature.dispose();
                return;
            }

            this._armatureCache[armatureKey] = {
                armature: armature,
                // Cache all kinds of animation frame.
                // When armature is dispose, clear all animation cache.
                animationsCache: {},
                curAnimationCache: null,
            };
        } else {
            armature = armatureInfo.armature;
        }
        return armature;
    }

    getAnimationCache (armatureKey, animationName) {
        let armatureInfo = this._armatureCache[armatureKey];
        if (!armatureInfo) return null;

        let animationsCache = armatureInfo.animationsCache;
        return animationsCache[animationName];
    }

    initAnimationCache (armatureKey, animationName) {
        if (!animationName) return null;

        let armatureInfo = this._armatureCache[armatureKey];
        let armature = armatureInfo && armatureInfo.armature;
        if (!armature) return null;
        let animation = armature.animation;
        let hasAni = animation.hasAnimation(animationName);
        if (!hasAni) return null;

        let animationsCache = armatureInfo.animationsCache;
        let animationCache = animationsCache[animationName];
        if (!animationCache) {
            // If cache exist in pool, then just use it.
            let poolKey = armatureKey + "#" + animationName;
            animationCache = this._animationPool[poolKey];
            if (animationCache) {
                delete this._animationPool[poolKey];
            } else {
                animationCache = new AnimationCache();
                animationCache._privateMode = this._privateMode;
            }
            animationCache.init(armatureInfo, animationName);
            animationsCache[animationName] = animationCache;
        }
        return animationCache;
    }

    invalidAnimationCache (armatureKey) {
        let armatureInfo = this._armatureCache[armatureKey];
        let armature = armatureInfo && armatureInfo.armature;
        if (!armature) return null;

        let animationsCache = armatureInfo.animationsCache;
        for (var aniKey in animationsCache) {
            let animationCache = animationsCache[aniKey];
            animationCache.invalidAllFrame();
        }
    }

    updateAnimationCache (armatureKey, animationName) {
        if (animationName) {
            let animationCache = this.initAnimationCache(armatureKey, animationName);
            if (!animationCache) return;
            animationCache.updateAllFrame();
        } else {
            let armatureInfo = this._armatureCache[armatureKey];
            let armature = armatureInfo && armatureInfo.armature;
            if (!armature) return null;

            let animationsCache = armatureInfo.animationsCache;
            for (var aniKey in animationsCache) {
                let animationCache = animationsCache[aniKey];
                animationCache.updateAllFrame();
            }
        }
    }

    static canCache (armature: dragonBones.Armature) {
        let slots = armature._slots;
        for (let i = 0, l = slots.length; i < l; i++) {
            let slot = slots[i];
            if (slot.childArmature) {
                return false;
            }
        }
        return true;
    }

    static FrameTime = FrameTime;
    static sharedCache = new ArmatureCache();
}

