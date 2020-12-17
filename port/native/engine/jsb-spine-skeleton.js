/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
const cacheManager = require('./jsb-cache-manager');

(function(){
    if (window.spine === undefined || window.middleware === undefined) return;

    middleware.generateGetSet(spine);

    // spine global time scale
    Object.defineProperty(spine, 'timeScale', {
        get () {
            return this._timeScale;
        },
        set (value) {
            this._timeScale = value;
            spine.SkeletonAnimation.setGlobalTimeScale(value);
        },
        configurable: true,
    });
    
    let _slotColor = cc.color(0, 0, 255, 255);
    let _boneColor = cc.color(255, 0, 0, 255);
    let _meshColor = cc.color(255, 255, 0, 255);
    let _originColor = cc.color(0, 255, 0, 255);
    
    let skeletonDataProto = cc.internal.SpineSkeletonData.prototype;
    let _gTextureIdx = 1;
    let _textureKeyMap = {};
    let _textureMap = new WeakMap();

    let skeletonDataMgr = spine.SkeletonDataMgr.getInstance();
    spine.skeletonDataMgr = skeletonDataMgr;
    skeletonDataMgr.setDestroyCallback(function (textureIndex) { 
        if (!textureIndex) return;
        let texKey = _textureKeyMap[textureIndex];
        if (texKey && _textureMap.has(texKey)) {
            _textureMap.delete(texKey);
            delete _textureKeyMap[textureIndex];
        }
    });

    let skeletonCacheMgr = spine.SkeletonCacheMgr.getInstance();
    spine.skeletonCacheMgr = skeletonCacheMgr;
    skeletonDataProto.destroy = function () {
        this.reset();
        skeletonCacheMgr.removeSkeletonCache(this._uuid);
        cc.Asset.prototype.destroy.call(this);
    };

    skeletonDataProto.reset = function () {
        if (this._skeletonCache) {
            spine.disposeSkeletonData(this._uuid);
            this._jsbTextures = null;
            this._skeletonCache = null;
        }
        this._atlasCache = null;
    };

    skeletonDataProto.getRuntimeData = function () {
        if (!this._skeletonCache) {
            this.init();
        }
        return this._skeletonCache;
    };

    skeletonDataProto.init = function () {
        if (this._skeletonCache) return;

        let uuid = this._uuid;
        if (!uuid) {
            cc.errorID(7504);
            return;
        }

        let skeletonCache = spine.retainSkeletonData(uuid);
        if (skeletonCache) {
            this._skeletonCache = skeletonCache;
            this.width = this._skeletonCache.getWidth();
            this.height = this._skeletonCache.getHeight();                 
            return;
        }

        let atlasText = this.atlasText;
        if (!atlasText) {
            cc.errorID(7508, this.name);
            return;
        }

        let textures = this.textures;
        let textureNames = this.textureNames;
        if (!(textures && textures.length > 0 && textureNames && textureNames.length > 0)) {
            cc.errorID(7507, this.name);
            return;
        }

        let jsbTextures = {};
        for (let i = 0; i < textures.length; ++i) {
            let texture = textures[i];
            let textureIdx = this.recordTexture(texture);
            let spTex = new middleware.Texture2D();
            spTex.setRealTextureIndex(textureIdx);
            spTex.setPixelsWide(texture.width);
            spTex.setPixelsHigh(texture.height);
            jsbTextures[textureNames[i]] = spTex;
        }
        this._jsbTextures = jsbTextures;

        let filePath = null;
        if (this.skeletonJsonStr) {
            filePath = this.skeletonJsonStr;
        } else {
            filePath = cacheManager.getCache(this.nativeUrl) || this.nativeUrl;
        }
        this._skeletonCache = spine.initSkeletonData(uuid, filePath, atlasText, jsbTextures, this.scale);
        if (this._skeletonCache) {
            this.width = this._skeletonCache.getWidth();
            this.height = this._skeletonCache.getHeight();
        }        
    };

    skeletonDataProto.recordTexture = function (texture) {
        let index = _gTextureIdx;
        let texKey = _textureKeyMap[index] = {key:index};
        _textureMap.set(texKey, texture);
        _gTextureIdx++;
        return index;
    };

    skeletonDataProto.getTextureByIndex = function (textureIdx) {
        let texKey = _textureKeyMap[textureIdx];
        if (!texKey) return;
        return _textureMap.get(texKey);
    };

    let animation = spine.SkeletonAnimation.prototype;
    // The methods are added to be compatibility with old versions.
    animation.setCompleteListener = function (listener) {
        this._compeleteListener = listener;
        this.setCompleteListenerNative(function (trackEntry) {
            let loopCount = Math.floor(trackEntry.trackTime / trackEntry.animationEnd);
            this._compeleteListener && this._compeleteListener(trackEntry, loopCount);
        });
    };

    // The methods are added to be compatibility with old versions.
    animation.setTrackCompleteListener = function (trackEntry, listener) {
        this._trackCompeleteListener = listener;
        this.setTrackCompleteListenerNative(trackEntry, function (trackEntryNative) {
            let loopCount = Math.floor(trackEntryNative.trackTime / trackEntryNative.animationEnd);
            this._trackCompeleteListener && this._trackCompeleteListener(trackEntryNative, loopCount);
        });
    };

    // Temporary solution before upgrade the Spine API
    animation.setAnimationListener = function (target, callback) {
        this._target = target;
        this._callback = callback;

        
        let AnimationEventType = legacyCC.internal.SpineAnimationEventType;

        this.setStartListener(function (trackEntry) {
            if (this._target && this._callback) {
                this._callback.call(this._target, this, trackEntry, AnimationEventType.START, null, 0);
            }
        });

        this.setInterruptListener(function (trackEntry) {
            if (this._target && this._callback) {
                this._callback.call(this._target, this, trackEntry, AnimationEventType.INTERRUPT, null, 0);
            }
        });

        this.setEndListener(function (trackEntry) {
            if (this._target && this._callback) {
                this._callback.call(this._target, this, trackEntry, AnimationEventType.END, null, 0);
            }
        });

        this.setDisposeListener(function (trackEntry) {
            if (this._target && this._callback) {
                this._callback.call(this._target, this, trackEntry, AnimationEventType.DISPOSE, null, 0);
            }
        });

        this.setCompleteListener(function (trackEntry, loopCount) {
            if (this._target && this._callback) {
                this._callback.call(this._target, this, trackEntry, AnimationEventType.COMPLETE, null, loopCount);
            }
        });

        this.setEventListener(function (trackEntry, event) {
            if (this._target && this._callback) {
                this._callback.call(this._target, this, trackEntry, AnimationEventType.EVENT, event, 0);
            }
        });
    };

    let skeleton = cc.internal.SpineSkeleton.prototype;
    const AnimationCacheMode = cc.internal.SpineSkeleton.AnimationCacheMode;
    Object.defineProperty(skeleton, 'paused', {
        get () {
            return this._paused || false;
        },
        set (value) {
            this._paused = value;
            if (this._nativeSkeleton) {
                this._nativeSkeleton.paused(value);
            }
        }
    });

    Object.defineProperty(skeleton, "premultipliedAlpha", {
        get () {
            if (this._premultipliedAlpha === undefined){
                return true;
            }
            return this._premultipliedAlpha;
        },
        set (value) {
            this._premultipliedAlpha = value;
            if (this._nativeSkeleton) {
                this._nativeSkeleton.setOpacityModifyRGB(this._premultipliedAlpha);
            }
        }
    });

    Object.defineProperty(skeleton, "timeScale", {
        get () {
            if (this._timeScale === undefined) return 1.0;
            return this._timeScale;
        },
        set (value) {
            this._timeScale = value;
            if (this._nativeSkeleton) {
                this._nativeSkeleton.setTimeScale(this._timeScale);
            }
        }
    });

    let _updateDebugDraw = skeleton._updateDebugDraw;
    skeleton._updateDebugDraw = function () {
        _updateDebugDraw.call(this);
        if (this._nativeSkeleton && !this.isAnimationCached()) {
            this._nativeSkeleton.setDebugMeshEnabled(this.debugMesh);
            this._nativeSkeleton.setDebugSlotsEnabled(this.debugSlots);
            this._nativeSkeleton.setDebugBonesEnabled(this.debugBones);
        }
    };

    let _updateUseTint = skeleton._updateUseTint;
    skeleton._updateUseTint = function () {
        _updateUseTint.call(this);
        if (this._nativeSkeleton) {
            this._nativeSkeleton.setUseTint(this.useTint);
        }
    };

    let _updateBatch = skeleton._updateBatch;
    skeleton._updateBatch = function () {
        _updateBatch.call(this);
        if (this._nativeSkeleton) {
            this._nativeSkeleton.setBatchEnabled(this.enableBatch);
        }
    };

    skeleton.setSkeletonData = function (skeletonData) {
        null != skeletonData.width && null != skeletonData.height && this.node.setContentSize(skeletonData.width, skeletonData.height);

        let uuid = skeletonData._uuid;
        if (!uuid) {
            cc.errorID(7504);
            return;
        }

        let texValues = skeletonData.textures;
        let texKeys = skeletonData.textureNames;
        if (!(texValues && texValues.length > 0 && texKeys && texKeys.length > 0)) {
            cc.errorID(7507, skeletonData.name);
            return;
        }

        if (this._nativeSkeleton) {
            this._nativeSkeleton.stopSchedule();
            this._nativeSkeleton._comp = null;
            this._nativeSkeleton = null;
        }

        let nativeSkeleton = null;
        if (this.isAnimationCached()) {
            nativeSkeleton = new spine.SkeletonCacheAnimation(uuid, this._cacheMode == AnimationCacheMode.SHARED_CACHE);
        } else {
            nativeSkeleton = new spine.SkeletonAnimation();
            try {
                spine.initSkeletonRenderer(nativeSkeleton, uuid);
            } catch (e) {
                cc._throw(e);
                return;
            }
            nativeSkeleton.setDebugSlotsEnabled(this.debugSlots);
            nativeSkeleton.setDebugMeshEnabled(this.debugMesh);
            nativeSkeleton.setDebugBonesEnabled(this.debugBones);
        }

        this._nativeSkeleton = nativeSkeleton;
        nativeSkeleton._comp = this;

        nativeSkeleton.setUseTint(this.useTint);
        nativeSkeleton.setOpacityModifyRGB(this.premultipliedAlpha);
        nativeSkeleton.setTimeScale(this.timeScale);
        nativeSkeleton.setBatchEnabled(this.enableBatch);
        let compColor = this.color;
        nativeSkeleton.setColor(compColor.r, compColor.g, compColor.b, compColor.a);

        this._skeleton = nativeSkeleton.getSkeleton();

        // init skeleton listener
        this._startListener && this.setStartListener(this._startListener);
        this._endListener && this.setEndListener(this._endListener);
        this._completeListener && this.setCompleteListener(this._completeListener);
        this._eventListener && this.setEventListener(this._eventListener);
        this._interruptListener && this.setInterruptListener(this._interruptListener);
        this._disposeListener && this.setDisposeListener(this._disposeListener);

        this._sharedBufferOffset = nativeSkeleton.getSharedBufferOffset();
        this._sharedBufferOffset[0] = 0;
        this._renderSegmentInfo = {};
        this._useAttach = false;

        // store render order and world matrix
        this._paramsBuffer = nativeSkeleton.getParamsBuffer();

        this.markForUpdateRenderData();
    };

    skeleton._updateColor = function () {
        if (this._nativeSkeleton) {
            let compColor = this.color;
            this._nativeSkeleton.setColor(compColor.r, compColor.g, compColor.b, compColor.a);
        }
    };

    skeleton.setAnimationStateData = function (stateData) {
        if (this._nativeSkeleton && !this.isAnimationCached()) {
            this._stateData = stateData;
            return this._nativeSkeleton.setAnimationStateData(stateData);
        }
    };

    let _onEnable = skeleton.onEnable;
    skeleton.onEnable = function () {
        _onEnable.call(this);
        
        if (this._nativeSkeleton) {
            this._nativeSkeleton.onEnable();
        }
    };

    let _onDisable = skeleton.onDisable;
    skeleton.onDisable = function () {
        _onDisable.call(this);
        if (this._nativeSkeleton) {
            this._nativeSkeleton.onDisable();
        }
    };

    skeleton.setVertexEffectDelegate = function (effectDelegate) {
        if (this._nativeSkeleton && !this.isAnimationCached()) {
            this._nativeSkeleton.setVertexEffectDelegate(effectDelegate);
        }
    };

    skeleton.update = function () {
        let nativeSkeleton = this._nativeSkeleton;
        if (!nativeSkeleton) return;

        let node = this.node;
        if (!node) return;
        
        let paramsBuffer = this._paramsBuffer;
        paramsBuffer[0] = middleware.renderOrder;
        middleware.renderOrder++;

        // sync node world matrix to native
        node.updateWorldTransform();
        let worldMat = node._mat;
        paramsBuffer[1]  = worldMat.m00;
        paramsBuffer[2]  = worldMat.m01;
        paramsBuffer[3]  = worldMat.m02;
        paramsBuffer[4]  = worldMat.m03;
        paramsBuffer[5]  = worldMat.m04;
        paramsBuffer[6]  = worldMat.m05;
        paramsBuffer[7]  = worldMat.m06;
        paramsBuffer[8]  = worldMat.m07;
        paramsBuffer[9]  = worldMat.m08;
        paramsBuffer[10] = worldMat.m09;
        paramsBuffer[11] = worldMat.m10;
        paramsBuffer[12] = worldMat.m11;
        paramsBuffer[13] = worldMat.m12;
        paramsBuffer[14] = worldMat.m13;
        paramsBuffer[15] = worldMat.m14;
        paramsBuffer[16] = worldMat.m15;

        if (this.__preColor__ === undefined || !this.color.equals(this.__preColor__)) {
            let compColor = this.color;
            nativeSkeleton.setColor(compColor.r, compColor.g, compColor.b, compColor.a);
            this.__preColor__ = compColor;
        }
        
        const socketNodes = this.socketNodes;
        if (!this._useAttach && socketNodes.size > 0) {
            this._useAttach = true;
            nativeSkeleton.setAttachEnabled(true);
        }

        if (!this.isAnimationCached() && (this.debugBones || this.debugSlots || this.debugMesh) && this._debugRenderer) {
            
            let graphics = this._debugRenderer;
            graphics.clear();
            graphics.lineWidth = 2;
            
            let debugData = this._debugData || nativeSkeleton.getDebugData();
            if (!debugData) return;
            let debugIdx = 0, debugType = 0, debugLen = 0;
    
            while (true) {
                debugType = debugData[debugIdx++];
                if (debugType == 0) break;
                debugLen = debugData[debugIdx++];

                switch (debugType) {
                    case 1: // slots
                        graphics.strokeColor = _slotColor;
                        for(let i = 0; i < debugLen; i += 8){
                            graphics.moveTo(debugData[debugIdx++], debugData[debugIdx++]);
                            graphics.lineTo(debugData[debugIdx++], debugData[debugIdx++]);
                            graphics.lineTo(debugData[debugIdx++], debugData[debugIdx++]);
                            graphics.lineTo(debugData[debugIdx++], debugData[debugIdx++]);
                            graphics.close();
                            graphics.stroke();
                        }
                    break;
                    case 2: // mesh
                        graphics.strokeColor = _meshColor;
                        for(let i = 0; i < debugLen; i += 6) {
                            graphics.moveTo(debugData[debugIdx++], debugData[debugIdx++]);
                            graphics.lineTo(debugData[debugIdx++], debugData[debugIdx++]);
                            graphics.lineTo(debugData[debugIdx++], debugData[debugIdx++]);
                            graphics.close();
                            graphics.stroke();
                        }
                    break;
                    case 3: // bones
                        graphics.strokeColor = _boneColor;
                        graphics.fillColor = _slotColor; // Root bone color is same as slot color.
                        for (let i = 0; i < debugLen; i += 4) {
                            let bx = debugData[debugIdx++];
                            let by = debugData[debugIdx++];
                            let x = debugData[debugIdx++];
                            let y = debugData[debugIdx++];
            
                            // Bone lengths.
                            graphics.moveTo(bx, by);
                            graphics.lineTo(x, y);
                            graphics.stroke();
            
                            // Bone origins.
                            graphics.circle(bx, by, Math.PI * 1.5);
                            graphics.fill();
                            if (i === 0) {
                                graphics.fillColor = _originColor;
                            }
                        }
                    break;
                    default:
                    return;
                }
            }
        }
    };

    skeleton.updateWorldTransform = function () {
        if (this._nativeSkeleton && !this.isAnimationCached()) {
            this._nativeSkeleton.updateWorldTransform();
        }
    };

    skeleton.setToSetupPose = function () {
        if (this._nativeSkeleton) {
            this._nativeSkeleton.setToSetupPose();
        }
    };

    skeleton.setBonesToSetupPose = function () {
        if (this._nativeSkeleton) {
            this._nativeSkeleton.setBonesToSetupPose();
        }
    };

    skeleton.setSlotsToSetupPose = function () {
        if (this._nativeSkeleton) {
            this._nativeSkeleton.setSlotsToSetupPose();
        }
    };

    skeleton.setSlotsRange = function (startSlotIndex, endSlotIndex) {
        if (this._nativeSkeleton && !this.isAnimationCached()) {
            this._nativeSkeleton.setSlotsRange(startSlotIndex, endSlotIndex);
        }
    };

    skeleton.updateAnimationCache = function (animName) {
        if (!this.isAnimationCached()) return;
        if (this._nativeSkeleton) {
            if (animName) {
                this._nativeSkeleton.updateAnimationCache(animName);
            } else {
                this._nativeSkeleton.updateAllAnimationCache();
            }
        }
    };

    skeleton.invalidAnimationCache = function () {
        if (!this.isAnimationCached()) return;
        if (this._nativeSkeleton) {
            this._nativeSkeleton.updateAllAnimationCache();
        }
    };

    skeleton.findBone = function (boneName) {
        if (this._nativeSkeleton) return this._nativeSkeleton.findBone(boneName);
        return null;
    };

    skeleton.findSlot = function (slotName) {
        if (this._nativeSkeleton) return this._nativeSkeleton.findSlot(slotName);
        return null;
    };

    skeleton.setSkin = function (skinName) {
        if (this._nativeSkeleton) return this._nativeSkeleton.setSkin(skinName);
        return null;
    };

    skeleton.getAttachment = function (slotName, attachmentName) {
        if (this._nativeSkeleton) return this._nativeSkeleton.getAttachment(slotName, attachmentName);
        return null;
    };

    skeleton.setAttachment = function (slotName, attachmentName) {
        this._nativeSkeleton && this._nativeSkeleton.setAttachment(slotName, attachmentName);
    };

    skeleton.getTextureAtlas = function (regionAttachment) {
        cc.warn("Spine Skeleton getTextureAtlas not support in native");
        return null;
    };

    skeleton.setMix = function (fromAnimation, toAnimation, duration) {
        if (this._nativeSkeleton && !this.isAnimationCached()) {
            this._nativeSkeleton.setMix(fromAnimation, toAnimation, duration);
        }
    };

    skeleton.setAnimation = function (trackIndex, name, loop) {
        if (this._nativeSkeleton) {
            if (this.isAnimationCached()) {
                return this._nativeSkeleton.setAnimation(name, loop);
            } else {
                return this._nativeSkeleton.setAnimation(trackIndex, name, loop);
            }
        }
        return null;
    };

    skeleton.addAnimation = function (trackIndex, name, loop, delay) {
        if (this._nativeSkeleton) {
            delay = delay || 0;
            if (this.isAnimationCached()) {
                return this._nativeSkeleton.addAnimation(name, loop, delay);
            } else {
                return this._nativeSkeleton.addAnimation(trackIndex, name, loop, delay);
            }
        }
        return null;
    };

    skeleton.findAnimation = function (name) {
        if (this._nativeSkeleton) return this._nativeSkeleton.findAnimation(name);
        return null;
    };

    skeleton.getCurrent = function (trackIndex) {
        if (this._nativeSkeleton && !this.isAnimationCached()) {
            return this._nativeSkeleton.getCurrent(trackIndex);
        }
        return null;
    };

    skeleton.clearTracks = function () {
        if (this._nativeSkeleton && !this.isAnimationCached()) {
            this._nativeSkeleton.clearTracks();
        }
    };

    skeleton.clearTrack = function (trackIndex) {
        if (this._nativeSkeleton && !this.isAnimationCached()) {
            this._nativeSkeleton.clearTrack(trackIndex);
        }
    };

    skeleton.setStartListener = function (listener) {
        this._startListener = listener;
        if (this._nativeSkeleton) {
            if (this.isAnimationCached()) {
                this._nativeSkeleton.setStartListener(function (animationName) {
                    let self = this._comp;
                    self._startEntry.animation.name = animationName;
                    self._startListener && self._startListener(self._startEntry);
                });
            } else {
                this._nativeSkeleton.setStartListener(listener);
            }
        }
    };

    skeleton.setInterruptListener = function (listener) {
        this._interruptListener = listener;
        if (this._nativeSkeleton && !this.isAnimationCached()) {
            this._nativeSkeleton.setInterruptListener(listener);
        }
    };

    skeleton.setEndListener = function (listener) {
        this._endListener = listener;
        if (this._nativeSkeleton) {
            if (this.isAnimationCached()) {
                this._nativeSkeleton.setEndListener(function (animationName) {
                    let self = this._comp;
                    self._endEntry.animation.name = animationName;
                    self._endListener && self._endListener(self._endEntry);
                });
            } else {
                this._nativeSkeleton.setEndListener(listener);
            }
        }
    };

    skeleton.setDisposeListener = function (listener) {
        this._disposeListener = listener;
        if (this._nativeSkeleton && !this.isAnimationCached()) {
            this._nativeSkeleton.setDisposeListener(listener);
        }
    };

    skeleton.setCompleteListener = function (listener) {
        this._completeListener = listener;
        if (this._nativeSkeleton) {
            if (this.isAnimationCached()) {
                this._nativeSkeleton.setCompleteListener(function (animationName) {
                    let self = this._comp;
                    self._endEntry.animation.name = animationName;
                    self._completeListener && self._completeListener(self._endEntry);
                });
            } else {
                this._nativeSkeleton.setCompleteListener(listener);
            }
        }
    };

    skeleton.setEventListener = function (listener) {
        this._eventListener = listener;
        if (this._nativeSkeleton && !this.isAnimationCached()) {
            this._nativeSkeleton.setEventListener(listener);
        }
    };

    skeleton.setTrackStartListener = function (entry, listener) {
        if (this._nativeSkeleton && !this.isAnimationCached()) {
            this._nativeSkeleton.setTrackStartListener(entry, listener);
        }
    };

    skeleton.setTrackInterruptListener = function (entry, listener) {
        if (this._nativeSkeleton && !this.isAnimationCached()) {
            this._nativeSkeleton.setTrackInterruptListener(entry, listener);
        }
    };

    skeleton.setTrackEndListener = function (entry, listener) {
        if (this._nativeSkeleton && !this.isAnimationCached()) {
            this._nativeSkeleton.setTrackEndListener(entry, listener);
        }
    };

    skeleton.setTrackDisposeListener = function (entry, listener) {
        if (this._nativeSkeleton && !this.isAnimationCached()) {
            this._nativeSkeleton.setTrackDisposeListener(entry, listener);
        }
    };

    skeleton.setTrackCompleteListener = function (entry, listener) {
        if (this._nativeSkeleton && !this.isAnimationCached()) {
            this._nativeSkeleton.setTrackCompleteListener(entry, listener);
        }
    };

    skeleton.setTrackEventListener = function (entry, listener) {
        if (this._nativeSkeleton && !this.isAnimationCached()) {
            this._nativeSkeleton.setTrackEventListener(entry, listener);
        }
    };

    skeleton.getState = function () {
        if (this._nativeSkeleton && !this.isAnimationCached()) {
            return this._nativeSkeleton.getState();
        }
    };

    skeleton._ensureListener = function () {
        cc.warn("Spine Skeleton _ensureListener not need in native");
    };

    skeleton._updateSkeletonData = function () {
        if (this.skeletonData) {
            this.skeletonData.init();
            this.setSkeletonData(this.skeletonData);

            this.attachUtil.init(this);
            this._preCacheMode = this._cacheMode;

            this.defaultSkin && this._nativeSkeleton.setSkin(this.defaultSkin);
            this.animation = this.defaultAnimation;
        } else {
            if (this._nativeSkeleton) {
                this._nativeSkeleton.stopSchedule();
                this._nativeSkeleton._comp = null;
                this._nativeSkeleton = null;
            }
        }
    };

    let _onDestroy = skeleton.onDestroy;
    skeleton.onDestroy = function(){
        _onDestroy.call(this);
        if (this._nativeSkeleton) {
            this._nativeSkeleton.stopSchedule();
            this._nativeSkeleton._comp = null;
            this._nativeSkeleton = null;
        }
        this._stateData = null;
    };

    let _tempAttachMat4 = new Mat4();
    skeleton._render = function (ui) {
        let nativeSkeleton = this._nativeSkeleton;
        if (!nativeSkeleton) return;

        let node = this.node;
        if (!node) return;

        let sharedBufferOffset = this._sharedBufferOffset;
        if (!sharedBufferOffset) return;

        let renderInfoOffset = sharedBufferOffset[0];
        // reset render info offset
        sharedBufferOffset[0] = 0;
        
        const socketNodes = this.socketNodes;
        if (socketNodes.size > 0) {
            let attachInfoMgr = middleware.attachInfoMgr;
            let attachInfo = attachInfoMgr.attachInfo;

            let attachInfoOffset = sharedBufferOffset[1];
            // reset attach info offset
            sharedBufferOffset[1] = 0;
            for (const boneIdx of socketNodes.keys()) {
                const boneNode = socketNodes.get(boneIdx);
                // Node has been destroy
                if (!boneNode || !boneNode.isValid) {
                    socketNodes.delete(boneIdx);
                    continue;
                }

                let tm = _tempAttachMat4;
                tm.m00 = attachInfo[attachInfoOffset];
                tm.m01 = attachInfo[attachInfoOffset + 1];
                tm.m04 = attachInfo[attachInfoOffset + 4];
                tm.m05 = attachInfo[attachInfoOffset + 5];
                tm.m12 = attachInfo[attachInfoOffset + 12];
                tm.m13 = attachInfo[attachInfoOffset + 13];
                node.matrix = _tempMat4;
                node.scale = this.node.scale;
            }
        }

        let renderInfoMgr = middleware.renderInfoMgr;
        let renderInfo = renderInfoMgr.renderInfo;

        let materialIdx = 0, realTextureIndex, realTexture;
        // verify render border
        let border = renderInfo[renderInfoOffset + materialIdx++];
        if (border !== 0xffffffff) return;

        let matLen = renderInfo[renderInfoOffset + materialIdx++];
        let useTint = this.useTint;
        let vfmt = useTint ? middleware.vfmtPosUvTwoColor : middleware.vfmtPosUvColor;
        
        let renderSegmentInfo = this._renderSegmentInfo;
        renderSegmentInfo.vfmt = vfmt;

        if (matLen == 0) return;

        for (let index = 0; index < matLen; index++) {
            realTextureIndex = renderInfo[renderInfoOffset + materialIdx++];
            realTexture = this.skeletonData.getTextureByIndex(realTextureIndex);
            if (!realTexture) return;

            // SpineMaterialType.TWO_COLORED 2
            // SpineMaterialType.COLORED_TEXTURED 0
            // cache material
            this.material = this.getMaterialForBlendAndTint(
                renderInfo[renderInfoOffset + materialIdx++], 
                renderInfo[renderInfoOffset + materialIdx++], 
                useTint ? 2: 0);

            renderSegmentInfo.rIB = renderInfo[renderInfoOffset + materialIdx++];
            renderSegmentInfo.rVB = renderInfo[renderInfoOffset + materialIdx++];
            renderSegmentInfo.indicesOffset = renderInfo[renderInfoOffset + materialIdx++];
            renderSegmentInfo.indicesCount = renderInfo[renderInfoOffset + materialIdx++];
            renderSegmentInfo.vertexFloatOffset = renderInfo[renderInfoOffset + materialIdx++];
            renderSegmentInfo.vertexFloatCount = renderInfo[renderInfoOffset + materialIdx++];

            ui.commitComp(this, realTexture._texture, this._assembler, null);
        }

        // sync attached node matrix
        comp.attachUtil._syncAttachedNode();
    }

    //////////////////////////////////////////
    // assembler
    const assembler = cc.internal.SpineAssembler;
    
    assembler.updateRenderData = function () {
    };
    
    assembler.fillBuffers = function (comp, renderer) {
        let nativeSkeleton = comp._skeleton;
        if (!nativeSkeleton) return;

        let node = comp.node;
        if (!node) return;

        let renderSegmentInfo = comp._renderSegmentInfo;
        let vfmt = renderSegmentInfo.vfmt;
        let rIB = renderSegmentInfo.rIB;
        let rVB = renderSegmentInfo.rVB;
        let srcIndicesOffset = renderSegmentInfo.indicesOffset;
        let srcIndicesCount = renderSegmentInfo.indicesCount;
        let srcVertexFloatOffset = renderSegmentInfo.vertexFloatOffset;
        let srcVertexFloatCount = renderSegmentInfo.vertexFloatCount;
        let srcVertexCount = srcVertexFloatCount / vfmt;

        let vfmtPosUvColor = cc.internal.vfmtPosUvColor;
        let vfmtPosUvTwoColor = cc.internal.vfmtPosUvTwoColor;    

        let buffer = renderer.acquireBufferBatch(vfmt === middleware.vfmtPosUvColor ? vfmtPosUvColor : vfmtPosUvTwoColor);
        let floatOffset = buffer.byteOffset >> 2;
        let indicesOffset = buffer.indicesOffset;
        let vertexOffset = buffer.vertexOffset;

        let middlewareMgr = middleware.MiddlewareManager.getInstance();

        const isRecreate = buffer.request(srcVertexCount, srcIndicesCount);
        if (!isRecreate) {
            buffer = renderer.currBufferBatch;
            floatOffset = 0;
            indicesOffset = 0;
            vertexOffset = 0;
        }

        const vBuf = buffer.vData;
        const iBuf = buffer.iData;

        const srcVBuf = middlewareMgr.getVBTypedArray(vfmt, rVB);
        const srcIBuf = middlewareMgr.getIBTypedArray(vfmt, rIB);

        vBuf.set(srcVBuf.subarray(srcVertexFloatOffset, srcVertexFloatOffset + srcVertexFloatCount), floatOffset);

        vertexOffset -= srcVertexFloatOffset / vfmt;
        if (vertexOffset == 0) {
            iBuf.set(srcIBuf.subarray(srcIndicesOffset, srcIndicesOffset + srcIndicesCount), indicesOffset);
        } else {
            for (let i = 0; i < srcIndicesCount; i += 1) {
                iBuf[i + indicesOffset] = srcIBuf[i + srcIndicesOffset] + vertexOffset;
            }
        }
    };
})();
