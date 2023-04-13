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

// @ts-expect-error jsb polyfills
(function () {
    if (globalThis.dragonBones === undefined || globalThis.middleware === undefined) return;
    const ArmatureDisplayComponent = cc.internal.ArmatureDisplay;
    if (ArmatureDisplayComponent === undefined) return;
    const dragonBones = globalThis.dragonBones;
    const middleware = globalThis.middleware;

    // dragonbones global time scale.
    Object.defineProperty(dragonBones, 'timeScale', {
        get () {
            return this._timeScale;
        },
        set (value) {
            this._timeScale = value;
            const factory = this.CCFactory.getInstance();
            factory.setTimeScale(value);
        },
        configurable: true,
    });

    middleware.generateGetSet(dragonBones);
    const _slotColor = cc.color(0, 0, 255, 255);
    const _boneColor = cc.color(255, 0, 0, 255);
    const _originColor = cc.color(0, 255, 0, 255);

    ////////////////////////////////////////////////////////////
    // override dragonBones library by native dragonBones
    ////////////////////////////////////////////////////////////
    //--------------------
    // adapt event name
    //--------------------
    dragonBones.EventObject.START = 'start';
    dragonBones.EventObject.LOOP_COMPLETE = 'loopComplete';
    dragonBones.EventObject.COMPLETE = 'complete';
    dragonBones.EventObject.FADE_IN = 'fadeIn';
    dragonBones.EventObject.FADE_IN_COMPLETE = 'fadeInComplete';
    dragonBones.EventObject.FADE_OUT = 'fadeOut';
    dragonBones.EventObject.FADE_OUT_COMPLETE = 'fadeOutComplete';
    dragonBones.EventObject.FRAME_EVENT = 'frameEvent';
    dragonBones.EventObject.SOUND_EVENT = 'soundEvent';

    dragonBones.DragonBones = {
        ANGLE_TO_RADIAN: Math.PI / 180,
        RADIAN_TO_ANGLE: 180 / Math.PI,
    };

    //-------------------
    // native factory
    //-------------------

    const factoryProto = dragonBones.CCFactory.prototype;
    factoryProto.createArmatureNode = function (comp, armatureName, node) {
        node = node || new cc.Node();
        let display = node.getComponent(ArmatureDisplayComponent);
        if (!display) {
            display = node.addComponent(ArmatureDisplayComponent);
        }

        node.name = armatureName;

        display._armatureName = armatureName;
        display._dragonAsset = comp.dragonAsset;
        display._dragonAtlasAsset = comp.dragonAtlasAsset;
        display._init();

        return display;
    };

    const _replaceSkin = factoryProto.replaceSkin;
    factoryProto.replaceSkin = function (armatrue, skinData, isOverride, exclude) {
        if (isOverride === undefined) isOverride = false;
        exclude = exclude || [];
        _replaceSkin.call(this, armatrue, skinData, isOverride, exclude);
    };

    const _changeSkin = factoryProto.changeSkin;
    factoryProto.changeSkin = function (armatrue, skinData, exclude) {
        _changeSkin.call(this, armatrue, skinData, exclude);
    };

    dragonBones.CCFactory.getInstance = function () {
        return dragonBones.CCFactory.getFactory();
    };

    //-------------------
    // native animation state
    //-------------------
    const animationStateProto = dragonBones.AnimationState.prototype;
    const _isPlaying = animationStateProto.isPlaying;
    Object.defineProperty(animationStateProto, 'isPlaying', {
        get () {
            return _isPlaying.call(this);
        },
    });

    //-------------------
    // native armature
    //-------------------
    const armatureProto = dragonBones.Armature.prototype;

    armatureProto.addEventListener = function (eventType, listener, target) {
        this.__persistentDisplay__ = this.getDisplay();
        this.__persistentDisplay__.on(eventType, listener, target);
    };

    armatureProto.removeEventListener = function (eventType, listener, target) {
        this.__persistentDisplay__ = this.getDisplay();
        this.__persistentDisplay__.off(eventType, listener, target);
    };

    //--------------------------
    // native CCArmatureDisplay
    //--------------------------
    const nativeArmatureDisplayProto = dragonBones.CCArmatureDisplay.prototype;

    Object.defineProperty(nativeArmatureDisplayProto, 'node', {
        get () {
            return this;
        },
    });

    nativeArmatureDisplayProto.getRootNode = function () {
        const rootDisplay = this.getRootDisplay();
        return rootDisplay && rootDisplay._ccNode;
    };

    nativeArmatureDisplayProto.convertToWorldSpace = function (point) {
        let newPos = this.convertToRootSpace(point.x, point.y);
        newPos = cc.v3(newPos.x, newPos.y, 0);
        const ccNode = this.getRootNode();
        if (!ccNode) return newPos;
        const finalPos = ccNode._uiProps.uiTransformComp.convertToWorldSpaceAR(newPos);
        return finalPos;
    };

    nativeArmatureDisplayProto.initEvent = function () {
        if (this._eventTarget) {
            return;
        }
        this._eventTarget = new cc.EventTarget();
        this.setDBEventCallback(function (eventObject) {
            this._eventTarget.emit(eventObject.type, eventObject);
        });
    };

    nativeArmatureDisplayProto.on = function (type, listener, target) {
        this.initEvent();
        this._eventTarget.on(type, listener, target);
        this.addDBEventListener(type, listener);
    };

    nativeArmatureDisplayProto.off = function (type, listener, target) {
        this.initEvent();
        this._eventTarget.off(type, listener, target);
        this.removeDBEventListener(type, listener);
    };

    nativeArmatureDisplayProto.once = function (type, listener, target) {
        this.initEvent();
        this._eventTarget.once(type, listener, target);
        this.addDBEventListener(type, listener);
    };

    ////////////////////////////////////////////////////////////
    // override DragonBonesAtlasAsset
    ////////////////////////////////////////////////////////////
    const dbAtlas = cc.internal.DragonBonesAtlasAsset.prototype;
    let _gTextureIdx = 1;
    const _textureKeyMap = {};
    const _textureMap = new WeakMap();
    const _textureIdx2Name = {};

    dbAtlas.removeRecordTexture = function (texture) {
        if (!texture) return;
        delete _textureIdx2Name[texture.image.url];
        const index = texture.__textureIndex__;
        if (index) {
            const texKey = _textureKeyMap[index];
            if (texKey && _textureMap.has(texKey)) {
                _textureMap.delete(texKey);
                delete _textureKeyMap[index];
            }
        }
    };

    dbAtlas.recordTexture = function () {
        if (this._texture && this._oldTexture !== this._texture) {
            this.removeRecordTexture(this._oldTexture);
            const texKey = _textureKeyMap[_gTextureIdx] = { key: _gTextureIdx };
            _textureMap.set(texKey, this._texture);
            this._oldTexture = this._texture;
            this._texture.__textureIndex__ = _gTextureIdx;
            _gTextureIdx++;
        }
    };

    dbAtlas.getTextureByIndex = function (textureIdx) {
        const texKey = _textureKeyMap[textureIdx];
        if (!texKey) return null;
        return _textureMap.get(texKey);
    };

    dbAtlas.updateTextureAtlasData = function (factory) {
        const url = this._texture.image.url;
        const preAtlasInfo = _textureIdx2Name[url];
        let index;

        // If the texture has store the atlas info before,then get native atlas object,and
        // update script texture map.
        if (preAtlasInfo) {
            index = preAtlasInfo.index;
            this._textureAtlasData = factory.getTextureAtlasDataByIndex(preAtlasInfo.name, index);
            const texKey = _textureKeyMap[preAtlasInfo.index];
            _textureMap.set(texKey, this._texture);
            this._texture.__textureIndex__ = index;
            // If script has store the atlas info,but native has no atlas object,then
            // still new native texture2d object,but no call recordTexture to increase
            // textureIndex.
            if (this._textureAtlasData) {
                return;
            }
        } else {
            this.recordTexture();
        }

        index = this._texture.__textureIndex__;
        this.jsbTexture = new middleware.Texture2D();
        this.jsbTexture.setRealTextureIndex(index);
        this.jsbTexture.setPixelsWide(this._texture.width);
        this.jsbTexture.setPixelsHigh(this._texture.height);
        this.jsbTexture.setRealTexture(this._texture);
        this._textureAtlasData = factory.parseTextureAtlasData(this.atlasJson, this.jsbTexture, this._uuid);

        _textureIdx2Name[url] = { name: this._textureAtlasData.name, index };
    };

    dbAtlas.init = function (factory) {
        this._factory = factory;

        // If create by manual, uuid is empty.
        if (!this._uuid) {
            const atlasJsonObj = JSON.parse(this.atlasJson);
            this._uuid = atlasJsonObj.name;
        }

        if (this._textureAtlasData) {
            factory.addTextureAtlasData(this._textureAtlasData, this._uuid);
        } else {
            this.updateTextureAtlasData(factory);
        }
    };

    dbAtlas._clear = function (dontRecordTexture) {
        if (this._factory) {
            this._factory.removeTextureAtlasData(this._uuid, true);
            this._factory.removeDragonBonesDataByUUID(this._uuid, true);
        }
        this._textureAtlasData = null;
        if (!dontRecordTexture) {
            this.recordTexture();
        }
    };

    dbAtlas.destroy = function () {
        this.removeRecordTexture(this._texture);
        this._clear(true);
        cc.Asset.prototype.destroy.call(this);
    };

    ////////////////////////////////////////////////////////////
    // override DragonBonesAsset
    ////////////////////////////////////////////////////////////
    const dbAsset = cc.internal.DragonBonesAsset.prototype;

    dbAsset.init = function (factory, atlasUUID) {
        this._factory = factory || dragonBones.CCFactory.getInstance();

        // If create by manual, uuid is empty.
        // Only support json format, if remote load dbbin, must set uuid by manual.
        if (!this._uuid && this.dragonBonesJson) {
            const rawData = JSON.parse(this.dragonBonesJson);
            this._uuid = rawData.name;
        }

        const armatureKey = `${this._uuid}#${atlasUUID}`;
        const dragonBonesData = this._factory.getDragonBonesData(armatureKey);
        if (dragonBonesData) return armatureKey;

        let filePath = null;
        if (this.dragonBonesJson) {
            filePath = this.dragonBonesJson;
        } else {
            filePath = cacheManager.getCache(this.nativeUrl) || this.nativeUrl;
        }
        this._factory.parseDragonBonesDataByPath(filePath, armatureKey);
        return armatureKey;
    };

    const armatureCacheMgr = dragonBones.ArmatureCacheMgr.getInstance();
    dragonBones.armatureCacheMgr = armatureCacheMgr;
    dbAsset._clear = function () {
        if (this._factory) {
            this._factory.removeDragonBonesDataByUUID(this._uuid, true);
        }
        armatureCacheMgr.removeArmatureCache(this._uuid);
    };

    ////////////////////////////////////////////////////////////
    // override ArmatureDisplay
    ////////////////////////////////////////////////////////////
    const superProto = cc.internal.UIRenderer.prototype;
    const armatureDisplayProto = cc.internal.ArmatureDisplay.prototype;
    const AnimationCacheMode = cc.internal.ArmatureDisplay.AnimationCacheMode;
    const armatureSystem = cc.internal.ArmatureSystem;

    armatureDisplayProto.initFactory = function () {
        this._factory = dragonBones.CCFactory.getFactory();
    };

    Object.defineProperty(armatureDisplayProto, 'armatureName', {
        get () {
            return this._armatureName;
        },
        set (value) {
            this._armatureName = value;
            const animNames = this.getAnimationNames(this._armatureName);

            if (!this.animationName || animNames.indexOf(this.animationName) < 0) {
                this.animationName = '';
            }

            const oldArmature = this._armature;
            if (this._armature) {
                if (!this.isAnimationCached()) {
                    this._factory.remove(this._armature);
                }
                this._armature = null;
            }
            this._nativeDisplay = null;

            this._refresh();

            if (oldArmature && oldArmature !== this._armature) {
                oldArmature.dispose();
            }

            if (this._armature && !this.isAnimationCached() && this.shouldSchedule) {
                this._factory.add(this._armature);
            }
        },
        visible: false,
    });

    Object.defineProperty(armatureDisplayProto, 'premultipliedAlpha', {
        get () {
            if (this._premultipliedAlpha === undefined) {
                return false;
            }
            return this._premultipliedAlpha;
        },
        set (value) {
            this._premultipliedAlpha = value;
            if (this._nativeDisplay) {
                this._nativeDisplay.setOpacityModifyRGB(this._premultipliedAlpha);
            }
        },
    });

    const _initDebugDraw = armatureDisplayProto._initDebugDraw;
    armatureDisplayProto._initDebugDraw = function () {
        _initDebugDraw.call(this);
        if (this._armature && !this.isAnimationCached()) {
            this._nativeDisplay.setDebugBonesEnabled(this.debugBones);
        }
    };

    armatureDisplayProto._buildArmature = function () {
        if (!this.dragonAsset || !this.dragonAtlasAsset || !this.armatureName) {
            return;
        }

        if (this._nativeDisplay) {
            this._nativeDisplay.dispose();
            this._nativeDisplay._comp = null;
            this._nativeDisplay = null;
        }

        const atlasUUID = this.dragonAtlasAsset._uuid;
        this._armatureKey = this.dragonAsset.init(this._factory, atlasUUID);

        if (this.isAnimationCached()) {
            const isShare = this._cacheMode === AnimationCacheMode.SHARED_CACHE;
            this._nativeDisplay = new dragonBones.CCArmatureCacheDisplay(this.armatureName, this._armatureKey, atlasUUID, isShare);
            if (this.shouldSchedule) this._nativeDisplay.beginSchedule();
            this._armature = this._nativeDisplay.armature();
        } else {
            this._nativeDisplay = this._factory.buildArmatureDisplay(this.armatureName, this._armatureKey, '', atlasUUID);
            if (!this._nativeDisplay) {
                return;
            }

            this._nativeDisplay.setDebugBonesEnabled(this.debugBones);
            this._armature = this._nativeDisplay.armature();
            this._armature.animation.timeScale = this.timeScale;
            if (this.shouldSchedule) this._factory.add(this._armature);
        }

        // add all event into native display
        const callbackTable = this._eventTarget._callbackTable;
        // just use to adapt to native api
        const emptyHandle = function () {};
        for (const key in callbackTable) {
            const list = callbackTable[key];
            if (!list || !list.callbackInfos || !list.callbackInfos.length) continue;
            if (this.isAnimationCached()) {
                this._nativeDisplay.addDBEventListener(key);
            } else {
                this._nativeDisplay.addDBEventListener(key, emptyHandle);
            }
        }

        this._preCacheMode = this._cacheMode;
        this._nativeDisplay._ccNode = this.node;
        this._nativeDisplay._comp = this;
        this._nativeDisplay._eventTarget = this._eventTarget;

        this._sharedBufferOffset = this._nativeDisplay.getSharedBufferOffset();
        this._sharedBufferOffset[0] = 0;
        this._useAttach = false;

        this._nativeDisplay.setOpacityModifyRGB(this.premultipliedAlpha);

        const compColor = this.color;
        this._nativeDisplay.setColor(compColor.r, compColor.g, compColor.b, compColor.a);

        this._nativeDisplay.setDBEventCallback(function (eventObject) {
            this._eventTarget.emit(eventObject.type, eventObject);
        });

        const materialTemplate = this.getMaterialTemplate();
        this._nativeDisplay.setMaterial(materialTemplate);
        this._nativeDisplay.setRenderEntity(this._renderEntity.nativeObj);

        this.attachUtil.init(this);
        if (this._armature) {
            const armatureData = this._armature.armatureData;
            const aabb = armatureData.aABB;
            this.node._uiProps.uiTransformComp.setContentSize(aabb.width, aabb.height);
        }
        if (this.animationName) {
            this.playAnimation(this.animationName, this.playTimes);
        }

        this.markForUpdateRenderData();
    };

    armatureDisplayProto._updateColor = function () {
        if (this._nativeDisplay) {
            const compColor = this.color;
            this._nativeDisplay.setColor(compColor.r, compColor.g, compColor.b, compColor.a);
        }
    };

    armatureDisplayProto.playAnimation = function (animName, playTimes) {
        this.playTimes = (playTimes === undefined) ? -1 : playTimes;
        this.animationName = animName;

        if (this._nativeDisplay) {
            if (this.isAnimationCached()) {
                return this._nativeDisplay.playAnimation(animName, this.playTimes);
            } else if (this._armature) {
                    return this._armature.animation.play(animName, this.playTimes);
                }
        }
        return null;
    };

    armatureDisplayProto.updateAnimationCache = function (animName) {
        if (!this.isAnimationCached()) return;
        if (this._nativeDisplay) {
            if (animName) {
                this._nativeDisplay.updateAnimationCache(animName);
            } else {
                this._nativeDisplay.updateAllAnimationCache();
            }
        }
    };

    armatureDisplayProto.invalidAnimationCache = function () {
        if (!this.isAnimationCached()) return;
        if (this._nativeDisplay) {
            this._nativeDisplay.updateAllAnimationCache();
        }
    };

    const _onEnable = superProto.onEnable;
    armatureDisplayProto.onEnable = function () {
        if (_onEnable) {
            _onEnable.call(this);
        }
        this.shouldSchedule = true;
        if (this._armature) {
            if (this.isAnimationCached()) {
                this._nativeDisplay.onEnable();
            } else {
                this._factory.add(this._armature);
            }
        }
        this._flushAssembler();
        armatureSystem.getInstance().add(this);
        middleware.retain();
    };

    const _onDisable = superProto.onDisable;
    armatureDisplayProto.onDisable = function () {
        if (_onDisable) {
            _onDisable.call(this);
        }
        if (this._armature && !this.isAnimationCached()) {
            this._factory.remove(this._armature);
        }
        armatureSystem.getInstance().remove(this);
        middleware.release();
    };

    const _updateMaterial = armatureDisplayProto.updateMaterial;
    armatureDisplayProto.updateMaterial = function () {
        _updateMaterial.call(this);
        if (this._nativeDisplay) {
            const mat = this.getMaterialTemplate();
            this._nativeDisplay.setMaterial(mat);
        }
    };

    armatureDisplayProto.once = function (eventType, listener, target) {
        if (this._nativeDisplay) {
            if (this.isAnimationCached()) {
                this._nativeDisplay.addDBEventListener(eventType);
            } else {
                this._nativeDisplay.addDBEventListener(eventType, listener);
            }
        }
        this._eventTarget.once(eventType, listener, target);
    };

    armatureDisplayProto.addEventListener = function (eventType, listener, target) {
        if (this._nativeDisplay) {
            if (this.isAnimationCached()) {
                this._nativeDisplay.addDBEventListener(eventType);
            } else {
                this._nativeDisplay.addDBEventListener(eventType, listener);
            }
        }
        this._eventTarget.on(eventType, listener, target);
    };

    armatureDisplayProto.removeEventListener = function (eventType, listener, target) {
        if (this._nativeDisplay) {
            if (this.isAnimationCached()) {
                this._nativeDisplay.removeDBEventListener(eventType);
            } else {
                this._nativeDisplay.removeDBEventListener(eventType, listener);
            }
        }
        this._eventTarget.off(eventType, listener, target);
    };

    const _onDestroy = armatureDisplayProto.onDestroy;
    armatureDisplayProto.onDestroy = function () {
        _onDestroy.call(this);
        if (this._nativeDisplay) {
            this._nativeDisplay.dispose();
            this._nativeDisplay._comp = null;
            this._nativeDisplay = null;
        }
    };

    armatureDisplayProto.setAnimationCacheMode = function (cacheMode) {
        if (this._preCacheMode !== cacheMode) {
            this._cacheMode = cacheMode;
            this._buildArmature();
        if (this._armature && !this.isAnimationCached() && this.shouldSchedule) {
            this._factory.add(this._armature);
        }
            this._updateSocketBindings();
            this.markForUpdateRenderData();
        }
    };

    armatureDisplayProto.updateAnimation = function () {
        const nativeDisplay = this._nativeDisplay;
        if (!nativeDisplay) return;

        const node = this.node;
        if (!node) return;

        if (this.__preColor__ === undefined || !this.color.equals(this.__preColor__)) {
            const compColor = this.color;
            nativeDisplay.setColor(compColor.r, compColor.g, compColor.b, compColor.a);
            this.__preColor__ = compColor;
        }

        const socketNodes = this.socketNodes;
        if (!this._useAttach && socketNodes.size > 0) {
            this._useAttach = true;
            nativeDisplay.setAttachEnabled(true);
        }

        this.markForUpdateRenderData();

        if (!this.isAnimationCached() && this._debugDraw && this.debugBones) {
            const nativeDisplay = this._nativeDisplay;
            this._debugData = this._debugData || nativeDisplay.getDebugData();
            if (!this._debugData) return;

            const graphics = this._debugDraw;
            graphics.clear();

            const debugData = this._debugData;
            let debugIdx = 0;

            graphics.lineWidth = 5;
            graphics.strokeColor = _boneColor;
            graphics.fillColor = _slotColor; // Root bone color is same as slot color.

            const debugBonesLen = debugData[debugIdx++];
            for (let i = 0; i < debugBonesLen; i += 4) {
                const bx = debugData[debugIdx++];
                const by = debugData[debugIdx++];
                const x = debugData[debugIdx++];
                const y = debugData[debugIdx++];

                // Bone lengths.
                graphics.moveTo(bx, by);
                graphics.lineTo(x, y);
                graphics.stroke();

                // Bone origins.
                graphics.circle(bx, by, Math.PI * 2);
                graphics.fill();
                if (i === 0) {
                    graphics.fillColor = _originColor;
                }
            }
        }
    };

    const _tempAttachMat4 = cc.mat4();

    armatureDisplayProto._render = function () {
    };

    armatureDisplayProto._updateBatch = function () {
        if (this.nativeDisplay) {
            this.nativeDisplay.setBatchEnabled(this.enableBatch);
            this.markForUpdateRenderData();
        }
    };

    armatureDisplayProto.syncAttachedNode = function () {
        const nativeDisplay = this._nativeDisplay;
        if (!nativeDisplay) return;
        const sharedBufferOffset = this._sharedBufferOffset;
        if (!sharedBufferOffset) return;

        const sockets = this.sockets;
        if (sockets.length > 0) {
            const attachInfoMgr = middleware.attachInfoMgr;
            const attachInfo = attachInfoMgr.attachInfo;

            const attachInfoOffset = sharedBufferOffset[0];
            // reset attach info offset
            sharedBufferOffset[0] = 0;

            const socketNodes = this.socketNodes;
            for (let l = sockets.length - 1; l >= 0; l--) {
                const sock = sockets[l];
                const boneNode = sock.target;
                const boneIdx = sock.boneIndex;

                if (!boneNode) continue;
                // Node has been destroy
                if (!boneNode.isValid) {
                    socketNodes.delete(sock.path);
                    sockets.splice(l, 1);
                    continue;
                }

                const tm = _tempAttachMat4;
                const matOffset = attachInfoOffset + boneIdx * 16;
                tm.m00 = attachInfo[matOffset];
                tm.m01 = attachInfo[matOffset + 1];
                tm.m04 = attachInfo[matOffset + 4];
                tm.m05 = attachInfo[matOffset + 5];
                tm.m12 = attachInfo[matOffset + 12];
                tm.m13 = attachInfo[matOffset + 13];
                boneNode.matrix = tm;
            }
        }
    };

    //////////////////////////////////////////
    // assembler
    const assembler = cc.internal.DragonBonesAssembler;

    // eslint-disable-next-line no-unused-vars
    assembler.createData = function (comp) {
    };

    assembler.updateRenderData = function (comp) {
        comp._render();
    };

    // eslint-disable-next-line no-unused-vars
    assembler.fillBuffers = function (comp, renderer) {
    };
}());
