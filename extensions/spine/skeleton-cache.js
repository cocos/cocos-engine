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
const TrackEntryListeners = require('./track-entry-listeners');
const spine = require('./lib/spine');
// Permit max cache time, unit is second.
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
let _preFinalColor = null;
let _preDarkColor = null;
// x y u v c1 c2
let _perVertexSize = 6;
// x y u v r1 g1 b1 a1 r2 g2 b2 a2
let _perClipVertexSize = 12;
let _vfCount = 0, _indexCount = 0;
let _tempr, _tempg, _tempb, _tempa;
let _finalColor32, _darkColor32;
let _finalColor = new spine.Color(1, 1, 1, 1);
let _darkColor = new spine.Color(1, 1, 1, 1);
let _quadTriangles = [0, 1, 2, 2, 3, 0];

//Cache all frames in an animation
let AnimationCache = cc.Class({
    ctor () {
        this.frames = [];
        this.totalTime = 0;
        this._frameIdx = -1;
        this.isCompleted = false;

        this._skeletonInfo = null;
        this._animationName = null;
        this._tempSegments = null;
        this._tempColors = null;
    },

    init (skeletonInfo, animationName) {
        this._animationName = animationName;
        this._skeletonInfo = skeletonInfo;
    },

    // Clear texture quote.
    clear () {
        for (let i = 0, n = this.frames.length; i < n; i++) {
            let frame = this.frames[i];
            frame.segments.length = 0;
        }
    },

    bind (listener) {
        let completeHandle = function (entry) {
            if (entry && entry.animation.name === this._animationName) {
                this.isCompleted = true;
            }
        }.bind(this);

        listener.complete = completeHandle;
    },

    unbind (listener) {
        listener.complete = null;
    },

    begin () {
        let skeletonInfo = this._skeletonInfo;
        // If pre animation not finished, play it to the end.
        if (skeletonInfo.curAnimationCache) {
            skeletonInfo.curAnimationCache.updateToFrame();
        }

        let skeleton = skeletonInfo.skeleton;
        let listener = skeletonInfo.listener;
        let state = skeletonInfo.state;

        let animation = skeleton.data.findAnimation(this._animationName);
        state.setAnimationWith(0, animation, false);
        this.bind(listener);

        // record cur animation cache
        skeletonInfo.curAnimationCache = this;
        this._frameIdx = -1;
        this.isCompleted = false;
        this.totalTime = 0;
    },

    end () {
        if (!this._needToUpdate()) {
            // clear cur animation cache
            this._skeletonInfo.curAnimationCache = null;
            this.frames.length = this._frameIdx + 1;
            this.isCompleted = true;
            this.unbind(this._skeletonInfo.listener);
        }
    },

    _needToUpdate (toFrameIdx) {
        return !this.isCompleted && 
                this.totalTime < MaxCacheTime && 
                (toFrameIdx == undefined || this._frameIdx < toFrameIdx);
    },

    updateToFrame (toFrameIdx) {
        if (!this._needToUpdate(toFrameIdx)) return;

        let skeletonInfo = this._skeletonInfo;
        let skeleton = skeletonInfo.skeleton;
        let clipper = skeletonInfo.clipper;
        let state = skeletonInfo.state;

        do {
            // Solid update frame rate 1/60.
            skeleton.update(FrameTime);
            state.update(FrameTime);
            state.apply(skeleton);
            skeleton.updateWorldTransform();
            this._frameIdx++;
            this._updateFrame(skeleton, clipper, this._frameIdx);
            this.totalTime += FrameTime;
        } while (this._needToUpdate(toFrameIdx));

        this.end();
    },

    updateAllFrame () {
        this.begin();
        this.updateToFrame();
    },

    _updateFrame (skeleton, clipper, index) {
        _vfOffset = 0;
        _indexOffset = 0;
        _vertexOffset = 0;
        _preTexUrl = null;
        _preBlendMode = null;
        _segVCount = 0;
        _segICount = 0;
        _segOffset = 0;
        _colorOffset = 0;
        _preFinalColor = null;
        _preDarkColor = null;

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
        this._traverseSkeleton(skeleton, clipper);
        if (_colorOffset > 0) {
            colors[_colorOffset - 1].vfOffset = _vfOffset;
        }
        colors.length = _colorOffset;
        // Handle pre segment.
        let preSegOffset = _segOffset - 1;
        if (preSegOffset >= 0) {
            // Judge segment vertex count is not empty.
            if (_segICount > 0) {
                let preSegInfo = segments[preSegOffset];
                preSegInfo.indexCount = _segICount;
                preSegInfo.vfCount = _segVCount * _perVertexSize;
                preSegInfo.vertexCount = _segVCount;
                segments.length = _segOffset;
            } else {
                // Discard pre segment.
                segments.length = _segOffset - 1;
            }
        }

        // Segments is empty,discard all segments.
        if (segments.length == 0) return;

        // Fill vertices
        let vertices = frame.vertices || new Float32Array(_vfOffset);
        let uintVert = frame.uintVert || new Uint32Array(vertices.buffer);
        for (let i = 0, j = 0; i < _vfOffset;) {
            vertices[i++] = _vertices[j++]; // x
            vertices[i++] = _vertices[j++]; // y
            vertices[i++] = _vertices[j++]; // u
            vertices[i++] = _vertices[j++]; // v
            uintVert[i++] = _vertices[j++]; // color1
            uintVert[i++] = _vertices[j++]; // color2
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

    fillVertices (skeletonColor, attachmentColor, slotColor, clipper, slot) {

        _tempa = slotColor.a * attachmentColor.a * skeletonColor.a * 255;
        _tempr = attachmentColor.r * skeletonColor.r * 255;
        _tempg = attachmentColor.g * skeletonColor.g * 255;
        _tempb = attachmentColor.b * skeletonColor.b * 255;
        
        _finalColor.r = _tempr * slotColor.r;
        _finalColor.g = _tempg * slotColor.g;
        _finalColor.b = _tempb * slotColor.b;
        _finalColor.a = _tempa;

        if (slot.darkColor == null) {
            _darkColor.set(0.0, 0, 0, 1.0);
        } else {
            _darkColor.r = slot.darkColor.r * _tempr;
            _darkColor.g = slot.darkColor.g * _tempg;
            _darkColor.b = slot.darkColor.b * _tempb;
        }
        _darkColor.a = 0;

        _finalColor32 = ((_finalColor.a<<24) >>> 0) + (_finalColor.b<<16) + (_finalColor.g<<8) + _finalColor.r;
        _darkColor32 = ((_darkColor.a<<24) >>> 0) + (_darkColor.b<<16) + (_darkColor.g<<8) + _darkColor.r;

        if (_preFinalColor !== _finalColor32 || _preDarkColor !== _darkColor32) {
            let colors = this._tempColors;
            _preFinalColor = _finalColor32;
            _preDarkColor = _darkColor32;
            if (_colorOffset > 0) {
                colors[_colorOffset - 1].vfOffset = _vfOffset;
            }
            colors[_colorOffset++] = {
                fr : _finalColor.r,
                fg : _finalColor.g,
                fb : _finalColor.b,
                fa : _finalColor.a,
                dr : _darkColor.r,
                dg : _darkColor.g,
                db : _darkColor.b,
                da : _darkColor.a,
                vfOffset : 0
            }
        }

        if (!clipper.isClipping()) {
            
            for (let v = _vfOffset, n = _vfOffset + _vfCount; v < n; v += _perVertexSize) {
                _vertices[v + 4]  = _finalColor32;     // light color
                _vertices[v + 5]  = _darkColor32;      // dark color
            }
            
        } else {
            clipper.clipTriangles(_vertices, _vfCount, _indices, _indexCount, _vertices, _finalColor, _darkColor, true, _perVertexSize, _indexOffset, _vfOffset, _vfOffset + 2);
            let clippedVertices = clipper.clippedVertices;
            let clippedTriangles = clipper.clippedTriangles;
            
            // insure capacity
            _indexCount = clippedTriangles.length;
            _vfCount = clippedVertices.length / _perClipVertexSize * _perVertexSize;

            // fill indices
            for (let ii = 0, jj = _indexOffset, nn = clippedTriangles.length; ii < nn;) {
                _indices[jj++] = clippedTriangles[ii++];
            }

            // fill vertices contain x y u v light color dark color
            for (let v = 0, n = clippedVertices.length, offset = _vfOffset; v < n; v += 12, offset += _perVertexSize) {
                _vertices[offset] = clippedVertices[v];                 // x
                _vertices[offset + 1] = clippedVertices[v + 1];         // y
                _vertices[offset + 2] = clippedVertices[v + 6];         // u
                _vertices[offset + 3] = clippedVertices[v + 7];         // v

                _vertices[offset + 4] = _finalColor32;
                _vertices[offset + 5] = _darkColor32;
            }
        }
    },

    _traverseSkeleton (skeleton, clipper) {
        let segments = this._tempSegments;
        let skeletonColor = skeleton.color;
        let attachment, attachmentColor, slotColor, uvs, triangles;
        let isRegion, isMesh, isClip;
        let texture;
        let preSegOffset, preSegInfo;
        let blendMode;
        let slot;

        for (let slotIdx = 0, slotCount = skeleton.drawOrder.length; slotIdx < slotCount; slotIdx++) {
            slot = skeleton.drawOrder[slotIdx];
    
            _vfCount = 0;
            _indexCount = 0;

            attachment = slot.getAttachment();
            if (!attachment) {
                clipper.clipEndWithSlot(slot);
                continue;
            }

            isRegion = attachment instanceof spine.RegionAttachment;
            isMesh = attachment instanceof spine.MeshAttachment;
            isClip = attachment instanceof spine.ClippingAttachment;

            if (isClip) {
                clipper.clipStart(slot, attachment);
                continue;
            }

            if (!isRegion && !isMesh) {
                clipper.clipEndWithSlot(slot);
                continue;
            }

            texture = attachment.region.texture._texture;
            if (!texture) {
                clipper.clipEndWithSlot(slot);
                continue;
            }
    
            blendMode = slot.data.blendMode;
            if (_preTexUrl !== texture.url || _preBlendMode !== blendMode) {
                _preTexUrl = texture.url;
                _preBlendMode = blendMode;
                // Handle pre segment.
                preSegOffset = _segOffset - 1;
                if (preSegOffset >= 0) {
                    if (_segICount > 0) {
                        preSegInfo = segments[preSegOffset];
                        preSegInfo.indexCount = _segICount;
                        preSegInfo.vertexCount = _segVCount;
                        preSegInfo.vfCount = _segVCount * _perVertexSize;
                    } else {
                        // Discard pre segment.
                        _segOffset--;
                    }
                }
                // Handle now segment.
                segments[_segOffset] = {
                    tex : texture,
                    blendMode : blendMode,
                    indexCount : 0,
                    vertexCount : 0,
                    vfCount : 0
                };
                _segOffset++;
                _segICount = 0;
                _segVCount = 0;
            }

            if (isRegion) {
                
                triangles = _quadTriangles;
    
                // insure capacity
                _vfCount = 4 * _perVertexSize;
                _indexCount = 6;
    
                // compute vertex and fill x y
                attachment.computeWorldVertices(slot.bone, _vertices, _vfOffset, _perVertexSize);
            }
            else if (isMesh) {
                
                triangles = attachment.triangles;
    
                // insure capacity
                _vfCount = (attachment.worldVerticesLength >> 1) * _perVertexSize;
                _indexCount = triangles.length;
    
                // compute vertex and fill x y
                attachment.computeWorldVertices(slot, 0, attachment.worldVerticesLength, _vertices, _vfOffset, _perVertexSize);
            }
    
            if (_vfCount == 0 || _indexCount == 0) {
                clipper.clipEndWithSlot(slot);
                continue;
            }
    
            // fill indices
            for (let ii = 0, jj = _indexOffset, nn = triangles.length; ii < nn;) {
                _indices[jj++] = triangles[ii++];
            }

            // fill u v
            uvs = attachment.uvs;
            for (let v = _vfOffset, n = _vfOffset + _vfCount, u = 0; v < n; v += _perVertexSize, u += 2) {
                _vertices[v + 2] = uvs[u];           // u
                _vertices[v + 3] = uvs[u + 1];       // v
            }

            attachmentColor = attachment.color;
            slotColor = slot.color;

            this.fillVertices(skeletonColor, attachmentColor, slotColor, clipper, slot);
    
            if (_indexCount > 0) {
                for (let ii = _indexOffset, nn = _indexOffset + _indexCount; ii < nn; ii++) {
                    _indices[ii] += _segVCount;
                }
                _indexOffset += _indexCount;
                _vfOffset += _vfCount;
                _vertexOffset = _vfOffset / _perVertexSize;
                _segICount += _indexCount;
                _segVCount += _vfCount / _perVertexSize;
            }
    
            clipper.clipEndWithSlot(slot);
        }
    
        clipper.clipEnd();
    }
});

let SkeletonCache = cc.Class({
    ctor () {
        this._animationPool = {};
        this._skeletonCache = {};
    },

    clear () {
        this._animationPool = {};
        this._skeletonCache = {};
    },

    removeSkeleton (uuid) {
        var skeletonInfo = this._skeletonCache[uuid];
        if (!skeletonInfo) return;
        let animationsCache = skeletonInfo.animationsCache;
        for (var aniKey in animationsCache) {
            // Clear cache texture, and put cache into pool.
            // No need to create TypedArray next time.
            let animationCache = animationsCache[aniKey];
            if (!animationCache) continue;
            this._animationPool[uuid + "#" + aniKey] = animationCache;
            animationCache.clear();
        }

        delete this._skeletonCache[uuid];
    },

    getSkeletonCache (uuid, skeletonData) {
        let skeletonInfo = this._skeletonCache[uuid];
        if (!skeletonInfo) {
            let skeleton = new spine.Skeleton(skeletonData);
            let clipper = new spine.SkeletonClipping();
            let stateData = new spine.AnimationStateData(skeleton.data);
            let state = new spine.AnimationState(stateData);
            let listener = new TrackEntryListeners();
            state.addListener(listener);

            this._skeletonCache[uuid] = skeletonInfo = {
                skeleton : skeleton,
                clipper : clipper,
                state : state,
                listener : listener,
                // Cache all kinds of animation frame.
                // When skeleton is dispose, clear all animation cache.
                animationsCache : {},
                curAnimationCache: null
            };
        }
        return skeletonInfo;
    },

    getAnimationCache (uuid, animationName) {
        let skeletonInfo = this._skeletonCache[uuid];
        if (!skeletonInfo) return null;

        let animationsCache = skeletonInfo.animationsCache;
        return animationsCache[animationName];
    },

    updateSkeletonSkin (uuid, skinName) {
        let skeletonInfo = this._skeletonCache[uuid];
        let skeleton = skeletonInfo && skeletonInfo.skeleton;
        if (!skeleton) return;
        skeleton.setSkinByName(skinName);
        skeleton.setSlotsToSetupPose();

        skeletonInfo.curAnimationCache = null;
        let animationsCache = skeletonInfo.animationsCache;
        for (var aniKey in animationsCache) {
            let animationCache = animationsCache[aniKey];
            animationCache.updateAllFrame();
        }
    },

    initAnimationCache (uuid, animationName) {
        if (!animationName) return null;
        let skeletonInfo = this._skeletonCache[uuid];
        let skeleton = skeletonInfo && skeletonInfo.skeleton;
        if (!skeleton) return null;

        let animation = skeleton.data.findAnimation(animationName);
        if (!animation) {
            return null;
        }

        let animationsCache = skeletonInfo.animationsCache;
        let animationCache = animationsCache[animationName];
        if (!animationCache) {
            // If cache exist in pool, then just use it.
            let poolKey = uuid + "#" + animationName;
            animationCache = this._animationPool[poolKey];
            if (animationCache) {
                delete this._animationPool[poolKey];
            } else {
                animationCache = new AnimationCache();
            }
            animationCache.init(skeletonInfo, animationName);
            animationsCache[animationName] = animationCache;
        }
        return animationCache;
    },

    updateAnimationCache (uuid, animationName) {
        let animationCache = this.initAnimationCache(uuid, animationName);
        if (!animationCache) return null;
        animationCache.updateAllFrame();
        if (animationCache.totalTime >= MaxCacheTime) {
            cc.warn("Animation cache is overflow, maybe animation's frame is infinite, please change skeleton render mode to REALTIME, animation name is [%s]",animationName);
        }
        return animationCache;
    }
});

SkeletonCache.FrameTime = FrameTime;
SkeletonCache.sharedCache = new SkeletonCache();
module.exports = SkeletonCache;