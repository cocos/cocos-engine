/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
const MaxCacheTime = 30;
const FrameTime = 1 / 60; 

let _vertices = [];
let _indices = [];
let _vertexOffset = 0;
let _indexOffset = 0;
let _vfOffset = 0;
let _preTexUrl = null;
let _preBlendMode = null;
let _segVCount = 0;
let _segICount = 0;
let _segOffset = 0;
let _colorOffset = 0;
let _preColor = null;
let _x, _y;

//Cache all frames in an animation
let AnimationCache = cc.Class({
    ctor () {
        this.frames = [];
        this.totalTime = 0;
        this.isCompleted = false;
        this._frameIdx = -1;

        this._armatureInfo = null;
        this._animationName = null;
        this._tempSegments = null;
        this._tempColors = null;
    },

    init (armatureInfo, animationName) {
        this._armatureInfo = armatureInfo;
        this._animationName = animationName;
    },

    // Clear texture quote.
    clear () {
        for (let i = 0, n = this.frames.length; i < n; i++) {
            let frame = this.frames[i];
            frame.segments.length = 0;
        }
    },

    begin () {
        let armatureInfo = this._armatureInfo;
        if (armatureInfo.curAnimationCache) {
            armatureInfo.curAnimationCache.updateToFrame();
        }
        let armature = armatureInfo.armature;
        let animation = armature.animation;
        animation.play(this._animationName, 1);

        armatureInfo.curAnimationCache = this;
        this._frameIdx = -1;
        this.totalTime = 0;
        this.isCompleted = false;
    },

    end () {
        if (!this._needToUpdate()) {
            this._armatureInfo.curAnimationCache = null;
            this.frames.length = this._frameIdx + 1;
            this.isCompleted = true;
        }
    },

    _needToUpdate (toFrameIdx) {
        let armatureInfo = this._armatureInfo;
        let armature = armatureInfo.armature;
        let animation = armature.animation;
        return !animation.isCompleted && 
                this.totalTime < MaxCacheTime && 
                (toFrameIdx == undefined || this._frameIdx < toFrameIdx);
    },

    updateToFrame (toFrameIdx) {
        if (!this._needToUpdate(toFrameIdx)) return;

        let armatureInfo = this._armatureInfo;
        let armature = armatureInfo.armature;

        do {
            // Solid update frame rate 1/60.
            armature.advanceTime(FrameTime);
            this._frameIdx++;
            this._updateFrame(armature, this._frameIdx);
            this.totalTime += FrameTime;
        } while (this._needToUpdate(toFrameIdx));
       
        this.end();
    },

    updateAllFrame () {
        this.begin();
        this.updateToFrame();
    },

    _updateFrame (armature, index) {
        _vfOffset = 0;
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
            segments : [],
            colors : [],
            vertices : null,
            uintVert : null,
            indices : null,
        };
        let frame = this.frames[index];

        let segments = this._tempSegments = frame.segments;
        let colors = this._tempColors = frame.colors;
        this._traverseArmature(armature);
        // At last must handle pre color and segment.
        // Because vertex count will right at the end.
        // Handle pre color.
        if (_colorOffset > 0) {
            colors[_colorOffset - 1].vfOffset = _vfOffset;
        }
        colors.length = _colorOffset;
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
        let vertices = frame.vertices || new Float32Array(_vfOffset);
        let uintVert = frame.uintVert || new Uint32Array(vertices.buffer);
        for (let i = 0, j = 0; i < _vfOffset;) {
            vertices[i++] = _vertices[j++]; // x
            vertices[i++] = _vertices[j++]; // y
            vertices[i++] = _vertices[j++]; // u
            vertices[i++] = _vertices[j++]; // v
            uintVert[i++] = _vertices[j++]; // color
        }

        // Fill indices
        let indices = frame.indices || new Uint16Array(_indexOffset);
        for (let i = 0; i < _indexOffset; i++) {
            indices[i] = _indices[i];
        }

        frame.vertices = vertices;
        frame.uintVert = uintVert;
        frame.indices = indices;
    },

    _traverseArmature (armature) {
        let colors = this._tempColors;
        let segments = this._tempSegments;
        let gVertices = _vertices;
        let gIndices = _indices;
        let slotVertices, slotIndices;
        let slots = armature._slots, slot, slotMatrix, slotMatrixm, slotColor, colorVal;
        let texture;
        let preSegOffset, preSegInfo;

        for (let i = 0, l = slots.length; i < l; i++) {
            slot = slots[i];
            if (!slot._visible || !slot._displayData) continue;

            slot.updateWorldMatrix();

            if (slot.childArmature) {
                this._traverseArmature(slot.childArmature);
                continue;
            }

            texture = slot.getTexture();
            if (!texture) continue;

            slotColor = slot._color;

            if (_preTexUrl !== texture.url || _preBlendMode !== slot._blendMode) {
                _preTexUrl = texture.url;
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
                    tex : texture,
                    blendMode : slot._blendMode,
                    indexCount : 0,
                    vertexCount : 0,
                    vfCount : 0
                };
                _segOffset++;
                _segICount = 0;
                _segVCount = 0;
            }

            colorVal = ((slotColor.a<<24) >>> 0) + (slotColor.b<<16) + (slotColor.g<<8) + slotColor.r;

            if (_preColor !== colorVal) {
                _preColor = colorVal;
                if (_colorOffset > 0) {
                    colors[_colorOffset - 1].vfOffset = _vfOffset;
                }
                colors[_colorOffset++] = {
                    r : slotColor.r,
                    g : slotColor.g,
                    b : slotColor.b,
                    a : slotColor.a,
                    vfOffset : 0
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
            for (let ii = 0, il = slotIndices.length; ii < il; ii ++) {
                gIndices[_indexOffset++] = _segVCount + slotIndices[ii];
            }

            _vertexOffset = _vfOffset / 5;
            _segICount += slotIndices.length;
            _segVCount += slotVertices.length / 4;
        }
    },
});

let ArmatureCache = cc.Class({
    ctor () {
        this._animationPool = {};
        this._armatureCache = {};
    },

    // If cache is private, cache will be destroy when dragonbones node destroy.
    dispose () {
        for (var key in this._armatureCache) {
            var armatureInfo = this._armatureCache[key];
            if (armatureInfo) {
                let armature = armatureInfo.armature;
                armature && armature.dispose();
            }
        }
        this._armatureCache = null;
        this._animationPool = null;
    },

    _removeArmature (armatureKey) {
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
    },

    // When db assets be destroy, remove armature from db cache.
    resetArmature (uuid) {
        for (var armatureKey in this._armatureCache) {
            if (armatureKey.indexOf(uuid) == -1) continue;
            this._removeArmature(armatureKey);
        }
    },

    getArmatureCache (armatureName, armatureKey, atlasUUID) {
        let armatureInfo = this._armatureCache[armatureKey];
        let armature;
        if (!armatureInfo) {
            let factory = dragonBones.CCFactory.getInstance();
            let proxy = factory.buildArmatureDisplay(armatureName, armatureKey, "", atlasUUID);
            if (!proxy || !proxy._armature) return;
            armature = proxy._armature;
            // If armature has child armature, can not be cache, because it's
            // animation data can not be precompute.
            if (!ArmatureCache.canCache(armature)) {
                armature.dispose();
                return;
            }

            this._armatureCache[armatureKey] = {
                armature : armature,
                // Cache all kinds of animation frame.
                // When armature is dispose, clear all animation cache.
                animationsCache : {},
                curAnimationCache: null,
            };
        } else {
            armature = armatureInfo.armature;
        }
        return armature;
    },

    getAnimationCache (armatureKey, animationName) {
        let armatureInfo = this._armatureCache[armatureKey];
        if (!armatureInfo) return null;

        let animationsCache = armatureInfo.animationsCache;
        return animationsCache[animationName];
    },

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
            }
            animationCache.init(armatureInfo, animationName);
            animationsCache[animationName] = animationCache;
        }
        return animationCache;
    },

    updateAnimationCache (armatureKey, animationName) {
        let animationCache = this.initAnimationCache(armatureKey, animationName);
        if (!animationCache) return;
        animationCache.updateAllFrame();
        if (animationCache.totalTime >= MaxCacheTime) {
            cc.warn("Animation cache is overflow, maybe animation's frame is infinite, please change armature render mode to REALTIME, dragonbones uuid is [%s], animation name is [%s]", armatureKey, animationName);
        }
        return animationCache;
    }
});

ArmatureCache.FrameTime = FrameTime;
ArmatureCache.sharedCache = new ArmatureCache();
ArmatureCache.canCache = function (armature) {
    let slots = armature._slots;
    for (let i = 0, l = slots.length; i < l; i++) {
        let slot = slots[i];
        if (slot.childArmature) {
            return false;
        }
    }
    return true;
},

module.exports = ArmatureCache;