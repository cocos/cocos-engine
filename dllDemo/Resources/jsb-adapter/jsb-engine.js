(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

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
require('./jsb-reflection.js');

require('./jsb-bridge.js');

require('./jsb-bridge-wrapper.js');

require('./jsb-assets-manager.js');

require('./jsb-game.js');

require('./jsb-gfx.js');

require('./jsb-scene.js');

require('./jsb-loader.js');

require('./jsb-videoplayer.js');

require('./jsb-webview.js');

require('./jsb-editbox.js');

require('./jsb-editor-support.js');

require('./jsb-spine-skeleton.js');

require('./jsb-dragonbones.js');

if (cc.physics && cc.physics.PhysicsSystem.PHYSICS_PHYSX) {
  require('./jsb-physics.js');
}

},{"./jsb-assets-manager.js":2,"./jsb-bridge-wrapper.js":3,"./jsb-bridge.js":4,"./jsb-dragonbones.js":6,"./jsb-editbox.js":7,"./jsb-editor-support.js":8,"./jsb-game.js":10,"./jsb-gfx.js":11,"./jsb-loader.js":12,"./jsb-physics.js":13,"./jsb-reflection.js":14,"./jsb-scene.js":15,"./jsb-spine-skeleton.js":16,"./jsb-videoplayer.js":17,"./jsb-webview.js":18}],2:[function(require,module,exports){
"use strict";

/*
 * Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
if (jsb.AssetsManager) {
  jsb.AssetsManager.State = {
    UNINITED: 0,
    UNCHECKED: 1,
    PREDOWNLOAD_VERSION: 2,
    DOWNLOADING_VERSION: 3,
    VERSION_LOADED: 4,
    PREDOWNLOAD_MANIFEST: 5,
    DOWNLOADING_MANIFEST: 6,
    MANIFEST_LOADED: 7,
    NEED_UPDATE: 8,
    READY_TO_UPDATE: 9,
    UPDATING: 10,
    UNZIPPING: 11,
    UP_TO_DATE: 12,
    FAIL_TO_UPDATE: 13
  };
  jsb.Manifest.DownloadState = {
    UNSTARTED: 0,
    DOWNLOADING: 1,
    SUCCESSED: 2,
    UNMARKED: 3
  };
  jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST = 0;
  jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST = 1;
  jsb.EventAssetsManager.ERROR_PARSE_MANIFEST = 2;
  jsb.EventAssetsManager.NEW_VERSION_FOUND = 3;
  jsb.EventAssetsManager.ALREADY_UP_TO_DATE = 4;
  jsb.EventAssetsManager.UPDATE_PROGRESSION = 5;
  jsb.EventAssetsManager.ASSET_UPDATED = 6;
  jsb.EventAssetsManager.ERROR_UPDATING = 7;
  jsb.EventAssetsManager.UPDATE_FINISHED = 8;
  jsb.EventAssetsManager.UPDATE_FAILED = 9;
  jsb.EventAssetsManager.ERROR_DECOMPRESS = 10;
}

},{}],3:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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
const JsbBridgeWrapper = {
  eventMap: new Map(),

  addNativeEventListener(eventName, listener) {
    if (!this.eventMap.get(eventName)) {
      this.eventMap.set(eventName, []);
    }

    const arr = this.eventMap.get(eventName);

    if (!arr.find(listener)) {
      arr.push(listener);
    }
  },

  dispatchEventToNative(eventName, arg) {
    jsb.bridge.sendToNative(eventName, arg);
  },

  removeAllListenersForEvent(eventName) {
    return this.eventMap.delete(eventName);
  },

  removeNativeEventListener(eventName, listener) {
    const arr = this.eventMap.get(eventName);

    if (!arr) {
      return false;
    }

    for (let i = 0, l = arr.length; i < l; i++) {
      if (arr[i] === listener) {
        arr.splice(i, 1);
        return true;
      }
    }

    return true;
  },

  removeAllListeners() {
    this.eventMap.clear();
  },

  triggerEvent(eventName, arg) {
    const arr = this.eventMap.get(eventName);

    if (!arr) {
      console.error(`${eventName} does not exist`);
      return;
    }

    arr.map(listener => listener.call(null, arg));
  }

};
Object.defineProperty(jsb, 'jsbBridgeWrapper', {
  get() {
    if (jsb.__JsbBridgeWrapper !== undefined) return jsb.__JsbBridgeWrapper;

    if (window.ScriptNativeBridge && cc.sys.os === cc.sys.OS.ANDROID || cc.sys.os === cc.sys.OS.IOS || cc.sys.os === cc.sys.OS.OSX || cc.sys.os === cc.sys.OS.OHOS) {
      jsb.__JsbBridgeWrapper = JsbBridgeWrapper;

      jsb.bridge.onNative = (methodName, arg1) => {
        console.log(`Trigger event: ${methodName} with argeter: ${arg1}`);

        jsb.__JsbBridgeWrapper.triggerEvent(methodName, arg1);
      };
    } else {
      jsb.__JsbBridgeWrapper = null;
    }

    return jsb.__JsbBridgeWrapper;
  },

  enumerable: true,
  configurable: true,

  set(value) {
    jsb.__JsbBridgeWrapper = value;
  }

});

},{}],4:[function(require,module,exports){
"use strict";

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
// JS to Native bridges
// set to lazy
Object.defineProperty(jsb, 'bridge', {
  get() {
    if (jsb.__ccbridge !== undefined) return jsb.__ccbridge;

    if (window.ScriptNativeBridge && cc.sys.os === cc.sys.OS.ANDROID || cc.sys.os === cc.sys.OS.IOS || cc.sys.os === cc.sys.OS.OSX || cc.sys.os === cc.sys.OS.OHOS) {
      jsb.__ccbridge = new ScriptNativeBridge();
    } else {
      jsb.__ccbridge = null;
    }

    return jsb.__ccbridge;
  },

  enumerable: true,
  configurable: true,

  set(value) {
    jsb.__ccbridge = value;
  }

});

},{}],5:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.
 https://www.cocos.com/
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of cache-manager software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.
 The software or tools in cache-manager License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
const {
  getUserDataPath,
  readJsonSync,
  makeDirSync,
  writeFileSync,
  deleteFile,
  rmdirSync
} = require('./jsb-fs-utils');

var writeCacheFileList = null;
var cleaning = false;
const REGEX = /^\w+:\/\/.*/;
var cacheManager = {
  cacheDir: 'gamecaches',
  cachedFileName: 'cacheList.json',
  deleteInterval: 500,
  writeFileInterval: 2000,
  cachedFiles: null,
  version: '1.1',

  getCache(url) {
    this.updateLastTime(url);
    return this.cachedFiles.has(url) ? `${this.cacheDir}/${this.cachedFiles.get(url).url}` : '';
  },

  getTemp(url) {
    return '';
  },

  init() {
    this.cacheDir = getUserDataPath() + '/' + this.cacheDir;
    var cacheFilePath = this.cacheDir + '/' + this.cachedFileName;
    var result = readJsonSync(cacheFilePath);

    if (result instanceof Error || !result.version || result.version !== this.version) {
      if (!(result instanceof Error)) rmdirSync(this.cacheDir, true);
      this.cachedFiles = new cc.AssetManager.Cache();
      makeDirSync(this.cacheDir, true);
      writeFileSync(cacheFilePath, JSON.stringify({
        files: this.cachedFiles._map,
        version: this.version
      }), 'utf8');
    } else {
      this.cachedFiles = new cc.AssetManager.Cache(result.files);
    }
  },

  updateLastTime(url) {
    if (this.cachedFiles.has(url)) {
      var cache = this.cachedFiles.get(url);
      cache.lastTime = Date.now();
    }
  },

  _write() {
    writeCacheFileList = null;
    writeFileSync(this.cacheDir + '/' + this.cachedFileName, JSON.stringify({
      files: this.cachedFiles._map,
      version: this.version
    }), 'utf8');
  },

  writeCacheFile() {
    if (!writeCacheFileList) {
      writeCacheFileList = setTimeout(this._write.bind(this), this.writeFileInterval);
    }
  },

  cacheFile(id, url, cacheBundleRoot) {
    this.cachedFiles.add(id, {
      bundle: cacheBundleRoot,
      url,
      lastTime: Date.now()
    });
    this.writeCacheFile();
  },

  clearCache() {
    rmdirSync(this.cacheDir, true);
    this.cachedFiles = new cc.AssetManager.Cache();
    makeDirSync(this.cacheDir, true);
    clearTimeout(writeCacheFileList);

    this._write();

    cc.assetManager.bundles.forEach(bundle => {
      if (REGEX.test(bundle.base)) this.makeBundleFolder(bundle.name);
    });
  },

  clearLRU() {
    if (cleaning) return;
    cleaning = true;
    var caches = [];
    var self = this;
    this.cachedFiles.forEach((val, key) => {
      if (val.bundle === 'internal') return;
      caches.push({
        originUrl: key,
        url: this.getCache(key),
        lastTime: val.lastTime
      });
    });
    caches.sort(function (a, b) {
      return a.lastTime - b.lastTime;
    });
    caches.length = Math.floor(caches.length / 3);
    if (caches.length === 0) return;

    for (var i = 0, l = caches.length; i < l; i++) {
      this.cachedFiles.remove(caches[i].originUrl);
    }

    clearTimeout(writeCacheFileList);

    this._write();

    function deferredDelete() {
      var item = caches.pop();
      deleteFile(item.url);

      if (caches.length > 0) {
        setTimeout(deferredDelete, self.deleteInterval);
      } else {
        cleaning = false;
      }
    }

    setTimeout(deferredDelete, self.deleteInterval);
  },

  removeCache(url) {
    if (this.cachedFiles.has(url)) {
      var path = this.getCache(url);
      this.cachedFiles.remove(url);
      clearTimeout(writeCacheFileList);

      this._write();

      deleteFile(path);
    }
  },

  makeBundleFolder(bundleName) {
    makeDirSync(this.cacheDir + '/' + bundleName, true);
  }

};
cc.assetManager.cacheManager = module.exports = cacheManager;

},{"./jsb-fs-utils":9}],6:[function(require,module,exports){
"use strict";

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
const cacheManager = require('./jsb-cache-manager'); // @ts-expect-error jsb polyfills


(function () {
  if (window.dragonBones === undefined || window.middleware === undefined) return;
  const ArmatureDisplayComponent = cc.internal.ArmatureDisplay;
  if (ArmatureDisplayComponent === undefined) return;
  const dragonBones = window.dragonBones;
  const middleware = window.middleware; // dragonbones global time scale.

  Object.defineProperty(dragonBones, 'timeScale', {
    get() {
      return this._timeScale;
    },

    set(value) {
      this._timeScale = value;
      const factory = this.CCFactory.getInstance();
      factory.setTimeScale(value);
    },

    configurable: true
  });
  middleware.generateGetSet(dragonBones);

  const _slotColor = cc.color(0, 0, 255, 255);

  const _boneColor = cc.color(255, 0, 0, 255);

  const _originColor = cc.color(0, 255, 0, 255); ////////////////////////////////////////////////////////////
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
    RADIAN_TO_ANGLE: 180 / Math.PI
  }; //-------------------
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
  }; //-------------------
  // native animation state
  //-------------------


  const animationStateProto = dragonBones.AnimationState.prototype;
  const _isPlaying = animationStateProto.isPlaying;
  Object.defineProperty(animationStateProto, 'isPlaying', {
    get() {
      return _isPlaying.call(this);
    }

  }); //-------------------
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
  }; //--------------------------
  // native CCArmatureDisplay
  //--------------------------


  const nativeArmatureDisplayProto = dragonBones.CCArmatureDisplay.prototype;
  Object.defineProperty(nativeArmatureDisplayProto, 'node', {
    get() {
      return this;
    }

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
  }; ////////////////////////////////////////////////////////////
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
      const texKey = _textureKeyMap[_gTextureIdx] = {
        key: _gTextureIdx
      };

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
    let index; // If the texture has store the atlas info before,then get native atlas object,and
    // update script texture map.

    if (preAtlasInfo) {
      index = preAtlasInfo.index;
      this._textureAtlasData = factory.getTextureAtlasDataByIndex(preAtlasInfo.name, index);
      const texKey = _textureKeyMap[preAtlasInfo.index];

      _textureMap.set(texKey, this._texture);

      this._texture.__textureIndex__ = index; // If script has store the atlas info,but native has no atlas object,then
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
    this._textureAtlasData = factory.parseTextureAtlasData(this.atlasJson, this.jsbTexture, this._uuid);
    _textureIdx2Name[url] = {
      name: this._textureAtlasData.name,
      index
    };
  };

  dbAtlas.init = function (factory) {
    this._factory = factory; // If create by manual, uuid is empty.

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
  }; ////////////////////////////////////////////////////////////
  // override DragonBonesAsset
  ////////////////////////////////////////////////////////////


  const dbAsset = cc.internal.DragonBonesAsset.prototype;

  dbAsset.init = function (factory, atlasUUID) {
    this._factory = factory; // If create by manual, uuid is empty.
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
  }; ////////////////////////////////////////////////////////////
  // override ArmatureDisplay
  ////////////////////////////////////////////////////////////


  const superProto = cc.internal.Renderable2D.prototype;
  const armatureDisplayProto = cc.internal.ArmatureDisplay.prototype;
  const AnimationCacheMode = cc.internal.ArmatureDisplay.AnimationCacheMode;
  const armatureSystem = cc.internal.ArmatureSystem;

  armatureDisplayProto.initFactory = function () {
    this._factory = dragonBones.CCFactory.getFactory();
  };

  Object.defineProperty(armatureDisplayProto, 'armatureName', {
    get() {
      return this._armatureName;
    },

    set(value) {
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

      if (this._armature && !this.isAnimationCached()) {
        this._factory.add(this._armature);
      }
    },

    visible: false
  });
  Object.defineProperty(armatureDisplayProto, 'premultipliedAlpha', {
    get() {
      if (this._premultipliedAlpha === undefined) {
        return false;
      }

      return this._premultipliedAlpha;
    },

    set(value) {
      this._premultipliedAlpha = value;

      if (this._nativeDisplay) {
        this._nativeDisplay.setOpacityModifyRGB(this._premultipliedAlpha);
      }
    }

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
      this._armature = this._nativeDisplay.armature();
    } else {
      this._nativeDisplay = this._factory.buildArmatureDisplay(this.armatureName, this._armatureKey, '', atlasUUID);

      if (!this._nativeDisplay) {
        return;
      }

      this._nativeDisplay.setDebugBonesEnabled(this.debugBones);

      this._armature = this._nativeDisplay.armature();
      this._armature.animation.timeScale = this.timeScale;

      this._factory.add(this._armature);
    } // add all event into native display


    const callbackTable = this._eventTarget._callbackTable; // just use to adapt to native api

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
    this._renderOrder = -1; // store render order and world matrix

    this._paramsBuffer = this._nativeDisplay.getParamsBuffer();
    this._paramsBuffer[0] = -1.0;

    this._nativeDisplay.setOpacityModifyRGB(this.premultipliedAlpha);

    const compColor = this.color;

    this._nativeDisplay.setColor(compColor.r, compColor.g, compColor.b, compColor.a);

    this._nativeDisplay.setDBEventCallback(function (eventObject) {
      this._eventTarget.emit(eventObject.type, eventObject);
    });

    this.attachUtil.init(this);

    if (this.animationName) {
      this.playAnimation(this.animationName, this.playTimes);
    }

    this.syncTransform(true);
    this.markForUpdateRenderData();
  };

  armatureDisplayProto._updateColor = function () {
    if (this._nativeDisplay) {
      const compColor = this.color;

      this._nativeDisplay.setColor(compColor.r, compColor.g, compColor.b, compColor.a);
    }
  };

  armatureDisplayProto.playAnimation = function (animName, playTimes) {
    this.playTimes = playTimes === undefined ? -1 : playTimes;
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

    if (this._armature && !this.isAnimationCached()) {
      this._factory.add(this._armature);
    }

    this.syncTransform(true);

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

  armatureDisplayProto.syncTransform = function (force) {
    const node = this.node;
    if (!node) return;
    const paramsBuffer = this._paramsBuffer;
    if (!paramsBuffer) return;

    if (force || node.hasChangedFlags || node._dirtyFlags) {
      // sync node world matrix to native
      node.updateWorldTransform();
      const worldMat = node._mat;
      paramsBuffer[1] = worldMat.m00;
      paramsBuffer[2] = worldMat.m01;
      paramsBuffer[3] = worldMat.m02;
      paramsBuffer[4] = worldMat.m03;
      paramsBuffer[5] = worldMat.m04;
      paramsBuffer[6] = worldMat.m05;
      paramsBuffer[7] = worldMat.m06;
      paramsBuffer[8] = worldMat.m07;
      paramsBuffer[9] = worldMat.m08;
      paramsBuffer[10] = worldMat.m09;
      paramsBuffer[11] = worldMat.m10;
      paramsBuffer[12] = worldMat.m11;
      paramsBuffer[13] = worldMat.m12;
      paramsBuffer[14] = worldMat.m13;
      paramsBuffer[15] = worldMat.m14;
      paramsBuffer[16] = worldMat.m15;
    }
  };

  armatureDisplayProto.setAnimationCacheMode = function (cacheMode) {
    if (this._preCacheMode !== cacheMode) {
      this._cacheMode = cacheMode;

      this._buildArmature();

      if (this._armature && !this.isAnimationCached()) {
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
    const paramsBuffer = this._paramsBuffer;

    if (this._renderOrder !== middleware.renderOrder) {
      paramsBuffer[0] = middleware.renderOrder;
      this._renderOrder = middleware.renderOrder;
      middleware.renderOrder++;
    }

    this.syncTransform();

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
        const y = debugData[debugIdx++]; // Bone lengths.

        graphics.moveTo(bx, by);
        graphics.lineTo(x, y);
        graphics.stroke(); // Bone origins.

        graphics.circle(bx, by, Math.PI * 2);
        graphics.fill();

        if (i === 0) {
          graphics.fillColor = _originColor;
        }
      }
    }
  };

  const _tempAttachMat4 = cc.mat4();

  const _identityTrans = new cc.Node();

  let _tempBufferIndex;

  let _tempIndicesOffset;

  let _tempIndicesCount;

  armatureDisplayProto._render = function (ui) {
    const nativeDisplay = this._nativeDisplay;
    if (!nativeDisplay) return;
    const node = this.node;
    if (!node) return;
    const sharedBufferOffset = this._sharedBufferOffset;
    if (!sharedBufferOffset) return;
    const renderInfoOffset = sharedBufferOffset[0]; // reset render info offset

    sharedBufferOffset[0] = 0;
    const sockets = this.sockets;

    if (sockets.length > 0) {
      const attachInfoMgr = middleware.attachInfoMgr;
      const attachInfo = attachInfoMgr.attachInfo;
      const attachInfoOffset = sharedBufferOffset[1]; // reset attach info offset

      sharedBufferOffset[1] = 0;
      const socketNodes = this.socketNodes;

      for (let l = sockets.length - 1; l >= 0; l--) {
        const sock = sockets[l];
        const boneNode = sock.target;
        const boneIdx = sock.boneIndex;
        if (!boneNode) continue; // Node has been destroy

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

    const renderInfoMgr = middleware.renderInfoMgr;
    const renderInfo = renderInfoMgr.renderInfo;
    let materialIdx = 0;
    let realTextureIndex;
    let realTexture; // verify render border

    const border = renderInfo[renderInfoOffset + materialIdx++];
    if (border !== 0xffffffff) return;
    const matLen = renderInfo[renderInfoOffset + materialIdx++];
    if (matLen === 0) return;

    for (let index = 0; index < matLen; index++) {
      realTextureIndex = renderInfo[renderInfoOffset + materialIdx++];
      realTexture = this.dragonAtlasAsset.getTextureByIndex(realTextureIndex);
      if (!realTexture) return; //HACK

      const mat = this.material; // cache material

      this.material = this.getMaterialForBlend(renderInfo[renderInfoOffset + materialIdx++], renderInfo[renderInfoOffset + materialIdx++]);
      _tempBufferIndex = renderInfo[renderInfoOffset + materialIdx++];
      _tempIndicesOffset = renderInfo[renderInfoOffset + materialIdx++];
      _tempIndicesCount = renderInfo[renderInfoOffset + materialIdx++];
      const renderData = middleware.RenderInfoLookup[middleware.vfmtPosUvColor][_tempBufferIndex];
      ui.commitComp(this, renderData, realTexture, this._assembler, _identityTrans);
      renderData.updateRange(renderData.vertexStart, renderData.vertexCount, _tempIndicesOffset, _tempIndicesCount);
      this.material = mat;
    }
  }; //////////////////////////////////////////
  // assembler


  const assembler = cc.internal.DragonBonesAssembler; // eslint-disable-next-line no-unused-vars

  assembler.createData = function (comp) {};

  assembler.updateRenderData = function () {}; // eslint-disable-next-line no-unused-vars


  assembler.fillBuffers = function (comp, renderer) {};
})();

},{"./jsb-cache-manager":5}],7:[function(require,module,exports){
"use strict";

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
(function () {
  if (!(cc && cc.internal && cc.internal.EditBox)) {
    return;
  }

  const EditBox = cc.internal.EditBox;
  const KeyboardReturnType = EditBox.KeyboardReturnType;
  const InputMode = EditBox.InputMode;
  const InputFlag = EditBox.InputFlag;
  let worldMat = cc.mat4();

  function getInputType(type) {
    switch (type) {
      case InputMode.EMAIL_ADDR:
        return 'email';

      case InputMode.NUMERIC:
      case InputMode.DECIMAL:
        return 'number';

      case InputMode.PHONE_NUMBER:
        return 'phone';

      case InputMode.URL:
        return 'url';

      case InputMode.SINGLE_LINE:
      case InputMode.ANY:
      default:
        return 'text';
    }
  }

  function getKeyboardReturnType(type) {
    switch (type) {
      case KeyboardReturnType.DEFAULT:
      case KeyboardReturnType.DONE:
        return 'done';

      case KeyboardReturnType.SEND:
        return 'send';

      case KeyboardReturnType.SEARCH:
        return 'search';

      case KeyboardReturnType.GO:
        return 'go';

      case KeyboardReturnType.NEXT:
        return 'next';
    }

    return 'done';
  }

  const BaseClass = EditBox._EditBoxImpl;

  class JsbEditBoxImpl extends BaseClass {
    init(delegate) {
      if (!delegate) {
        cc.error('EditBox init failed');
        return;
      }

      this._delegate = delegate;
    }

    beginEditing() {
      let self = this;
      let delegate = this._delegate;
      let multiline = delegate.inputMode === InputMode.ANY;

      let rect = this._getRect();

      this.setMaxLength(delegate.maxLength);
      let inputTypeString = getInputType(delegate.inputMode);

      if (delegate.inputFlag === InputFlag.PASSWORD) {
        inputTypeString = 'password';
      }

      function onConfirm(res) {
        delegate._editBoxEditingReturn();
      }

      function onInput(res) {
        if (res.value.length > self._maxLength) {
          res.value = res.value.slice(0, self._maxLength);
        }

        if (delegate.string !== res.value) {
          delegate._editBoxTextChanged(res.value);
        }
      }

      function onComplete(res) {
        self.endEditing();
      }

      jsb.inputBox.onInput(onInput);
      jsb.inputBox.onConfirm(onConfirm);
      jsb.inputBox.onComplete(onComplete);

      if (!cc.sys.isMobile) {
        delegate._hideLabels();
      }

      jsb.inputBox.show({
        defaultValue: delegate.string,
        maxLength: self._maxLength,
        multiple: multiline,
        confirmHold: false,
        confirmType: getKeyboardReturnType(delegate.returnType),
        inputType: inputTypeString,
        originX: rect.x,
        originY: rect.y,
        width: rect.width,
        height: rect.height
      });
      this._editing = true;

      delegate._editBoxEditingDidBegan();
    }

    endEditing() {
      this._editing = false;

      if (!cc.sys.isMobile) {
        this._delegate._showLabels();
      }

      jsb.inputBox.offConfirm();
      jsb.inputBox.offInput();
      jsb.inputBox.offComplete();
      jsb.inputBox.hide();

      this._delegate._editBoxEditingDidEnded();
    }

    setMaxLength(maxLength) {
      if (!isNaN(maxLength)) {
        if (maxLength < 0) {
          //we can't set Number.MAX_VALUE to input's maxLength property
          //so we use a magic number here, it should works at most use cases.
          maxLength = 65535;
        }

        this._maxLength = maxLength;
      }
    }

    _getRect() {
      let node = this._delegate.node;
      let viewScaleX = cc.view._scaleX;
      let viewScaleY = cc.view._scaleY;
      let dpr = jsb.device.getDevicePixelRatio() || 1;
      node.getWorldMatrix(worldMat);
      let transform = node._uiProps.uiTransformComp;
      let vec3 = cc.v3();
      let width = 0;
      let height = 0;

      if (transform) {
        const contentSize = transform.contentSize;
        const anchorPoint = transform.anchorPoint;
        width = contentSize.width;
        height = contentSize.height;
        vec3.x = -anchorPoint.x * width;
        vec3.y = -anchorPoint.y * height;
      }

      cc.Mat4.translate(worldMat, worldMat, vec3);
      viewScaleX /= dpr;
      viewScaleY /= dpr;
      let finalScaleX = worldMat.m00 * viewScaleX;
      let finaleScaleY = worldMat.m05 * viewScaleY;
      let viewportRect = cc.view._viewportRect;
      let offsetX = viewportRect.x / dpr,
          offsetY = viewportRect.y / dpr;
      return {
        x: worldMat.m12 * viewScaleX + offsetX,
        y: worldMat.m13 * viewScaleY + offsetY,
        width: width * finalScaleX,
        height: height * finaleScaleY
      };
    }

  }

  EditBox._EditBoxImpl = JsbEditBoxImpl;
})();

},{}],8:[function(require,module,exports){
"use strict";

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
// @ts-expect-error jsb polyfills
(function () {
  if (!window.middleware) return;
  const middleware = window.middleware;
  const middlewareMgr = middleware.MiddlewareManager.getInstance();
  let reference = 0;
  const director = cc.director;
  const game = cc.game;
  const nativeXYZUVC = middleware.vfmtPosUvColor = 9;
  const nativeXYZUVCC = middleware.vfmtPosUvTwoColor = 13;
  const vfmtPosUvColor = cc.internal.vfmtPosUvColor;
  const vfmtPosUvTwoColor = cc.internal.vfmtPosUvTwoColor;
  const renderInfoLookup = middleware.RenderInfoLookup = {};
  renderInfoLookup[nativeXYZUVC] = [];
  renderInfoLookup[nativeXYZUVCC] = [];

  middleware.reset = function () {
    middleware.preRenderComponent = null;
    middleware.preRenderBufferIndex = 0;
    middleware.preRenderBufferType = nativeXYZUVC;
    middleware.renderOrder = 0;
    middleware.indicesStart = 0;
    middleware.resetIndicesStart = false;
  };

  middleware.reset();

  middleware.retain = function () {
    reference++;
  };

  middleware.release = function () {
    if (reference === 0) {
      cc.warn('middleware reference error: reference count should be greater than 0');
      return;
    }

    reference--;

    if (reference === 0) {
      const uvcBuffers = renderInfoLookup[nativeXYZUVC];

      for (let i = 0; i < uvcBuffers.length; i++) {
        cc.UI.MeshRenderData.remove(uvcBuffers[i]);
      }

      uvcBuffers.length = 0;
      const uvccBuffers = renderInfoLookup[nativeXYZUVCC];

      for (let i = 0; i < uvccBuffers.length; i++) {
        cc.UI.MeshRenderData.remove(uvccBuffers[i]);
      }

      uvccBuffers.length = 0;
    }
  };

  function CopyNativeBufferToJS(renderer, nativeFormat, jsFormat) {
    if (!renderer) return;
    const bufferCount = middlewareMgr.getBufferCount(nativeFormat);

    for (let i = 0; i < bufferCount; i++) {
      const ibBytesLength = middlewareMgr.getIBTypedArrayLength(nativeFormat, i);
      const vbBytesLength = middlewareMgr.getVBTypedArrayLength(nativeFormat, i);
      const srcIndicesCount = ibBytesLength / 2; // USHORT

      const srcVertexCount = vbBytesLength / nativeFormat / 4;
      let buffer = renderInfoLookup[nativeFormat][i];

      if (!buffer) {
        buffer = cc.UI.MeshRenderData.add(jsFormat);
      }

      const srcVBuf = middlewareMgr.getVBTypedArray(nativeFormat, i);
      const srcIBuf = middlewareMgr.getIBTypedArray(nativeFormat, i);
      buffer.vData = srcVBuf;
      buffer.iData = srcIBuf;
      buffer.resize(srcVertexCount, srcIndicesCount);
      renderInfoLookup[nativeFormat][i] = buffer;
    }
  }

  director.on(cc.Director.EVENT_BEFORE_UPDATE, () => {
    if (reference === 0) return;
    middlewareMgr.update(game.deltaTime);
  });
  director.on(cc.Director.EVENT_BEFORE_DRAW, () => {
    if (reference === 0) return;
    middlewareMgr.render(game.deltaTime); // reset render order

    middleware.reset();
    const batcher2D = director.root.batcher2D;
    CopyNativeBufferToJS(batcher2D, nativeXYZUVC, vfmtPosUvColor);
    CopyNativeBufferToJS(batcher2D, nativeXYZUVCC, vfmtPosUvTwoColor);
  });
  const renderInfoMgr = middlewareMgr.getRenderInfoMgr();
  renderInfoMgr.renderInfo = renderInfoMgr.getSharedBuffer();
  renderInfoMgr.setResizeCallback(function () {
    this.attachInfo = this.getSharedBuffer();
  });
  renderInfoMgr.__middleware__ = middleware;
  const attachInfoMgr = middlewareMgr.getAttachInfoMgr();
  attachInfoMgr.attachInfo = attachInfoMgr.getSharedBuffer();
  attachInfoMgr.setResizeCallback(function () {
    this.attachInfo = this.getSharedBuffer();
  });
  middleware.renderInfoMgr = renderInfoMgr;
  middleware.attachInfoMgr = attachInfoMgr; // generate get set function

  middleware.generateGetSet = function (moduleObj) {
    for (const classKey in moduleObj) {
      const classProto = moduleObj[classKey] && moduleObj[classKey].prototype;
      if (!classProto) continue;

      for (const getName in classProto) {
        const getPos = getName.search(/^get/);
        if (getPos === -1) continue;
        let propName = getName.replace(/^get/, '');
        const nameArr = propName.split('');
        const lowerFirst = nameArr[0].toLowerCase();
        const upperFirst = nameArr[0].toUpperCase();
        nameArr.splice(0, 1);
        const left = nameArr.join('');
        propName = lowerFirst + left;
        const setName = `set${upperFirst}${left}`; // eslint-disable-next-line no-prototype-builtins

        if (classProto.hasOwnProperty(propName)) continue;
        const setFunc = classProto[setName];
        const hasSetFunc = typeof setFunc === 'function';

        if (hasSetFunc) {
          Object.defineProperty(classProto, propName, {
            get() {
              return this[getName]();
            },

            set(val) {
              this[setName](val);
            },

            configurable: true
          });
        } else {
          Object.defineProperty(classProto, propName, {
            get() {
              return this[getName]();
            },

            configurable: true
          });
        }
      }
    }
  };
})();

},{}],9:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.
 https://www.cocos.com/
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of fsUtils software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.
 The software or tools in fsUtils License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var fs = jsb.fileUtils;
let jsb_downloader = null;
let downloading = new cc.AssetManager.Cache();
let tempDir = '';
var fsUtils = {
  fs,

  initJsbDownloader(jsbDownloaderMaxTasks, jsbDownloaderTimeout) {
    jsb_downloader = new jsb.Downloader({
      countOfMaxProcessingTasks: jsbDownloaderMaxTasks || 32,
      timeoutInSeconds: jsbDownloaderTimeout || 30,
      tempFileNameSuffix: '.tmp'
    });
    tempDir = fsUtils.getUserDataPath() + '/temp';
    !fs.isDirectoryExist(tempDir) && fs.createDirectory(tempDir);
    jsb_downloader.setOnFileTaskSuccess(task => {
      if (!downloading.has(task.requestURL)) return;
      let {
        onComplete
      } = downloading.remove(task.requestURL);
      onComplete && onComplete(null, task.storagePath);
    });
    jsb_downloader.setOnTaskError((task, errorCode, errorCodeInternal, errorStr) => {
      if (!downloading.has(task.requestURL)) return;
      let {
        onComplete
      } = downloading.remove(task.requestURL);
      cc.error(`Download file failed: path: ${task.requestURL} message: ${errorStr}, ${errorCode}`);
      onComplete(new Error(errorStr), null);
    });
    jsb_downloader.setOnTaskProgress((task, bytesReceived, totalBytesReceived, totalBytesExpected) => {
      if (!downloading.has(task.requestURL)) return;
      let {
        onProgress
      } = downloading.get(task.requestURL);
      onProgress && onProgress(totalBytesReceived, totalBytesExpected);
    });
  },

  getUserDataPath() {
    return fs.getWritablePath().replace(/[\/\\]*$/, '');
  },

  checkFsValid() {
    if (!fs) {
      cc.warn('can not get the file system!');
      return false;
    }

    return true;
  },

  deleteFile(filePath, onComplete) {
    var result = fs.removeFile(filePath);

    if (result === true) {
      onComplete && onComplete(null);
    } else {
      cc.warn(`Delete file failed: path: ${filePath}`);
      onComplete && onComplete(new Error('delete file failed'));
    }
  },

  downloadFile(remoteUrl, filePath, header, onProgress, onComplete) {
    downloading.add(remoteUrl, {
      onProgress,
      onComplete
    });
    var storagePath = filePath;
    if (!storagePath) storagePath = tempDir + '/' + performance.now() + cc.path.extname(remoteUrl);
    jsb_downloader.createDownloadFileTask(remoteUrl, storagePath, header);
  },

  saveFile(srcPath, destPath, onComplete) {
    var err = null;
    let result = fs.writeDataToFile(fs.getDataFromFile(srcPath), destPath);
    fs.removeFile(srcPath);

    if (!result) {
      err = new Error(`Save file failed: path: ${srcPath}`);
      cc.warn(err.message);
    }

    onComplete && onComplete(err);
  },

  copyFile(srcPath, destPath, onComplete) {
    var err = null;
    let result = fs.writeDataToFile(fs.getDataFromFile(srcPath), destPath);

    if (!result) {
      err = new Error(`Copy file failed: path: ${srcPath}`);
      cc.warn(err.message);
    }

    onComplete && onComplete(err);
  },

  writeFile(path, data, encoding, onComplete) {
    var result = null;
    var err = null;

    if (encoding === 'utf-8' || encoding === 'utf8') {
      result = fs.writeStringToFile(data, path);
    } else {
      result = fs.writeDataToFile(data, path);
    }

    if (!result) {
      err = new Error(`Write file failed: path: ${path}`);
      cc.warn(err.message);
    }

    onComplete && onComplete(err);
  },

  writeFileSync(path, data, encoding) {
    var result = null;

    if (encoding === 'utf-8' || encoding === 'utf8') {
      result = fs.writeStringToFile(data, path);
    } else {
      result = fs.writeDataToFile(data, path);
    }

    if (!result) {
      cc.warn(`Write file failed: path: ${path}`);
      return new Error(`Write file failed: path: ${path}`);
    }
  },

  readFile(filePath, encoding, onComplete) {
    var content = null,
        err = null;

    if (encoding === 'utf-8' || encoding === 'utf8') {
      content = fs.getStringFromFile(filePath);
    } else {
      content = fs.getDataFromFile(filePath);
    }

    if (!content) {
      err = new Error(`Read file failed: path: ${filePath}`);
      cc.warn(err.message);
    }

    onComplete && onComplete(err, content);
  },

  readDir(filePath, onComplete) {
    var files = null,
        err = null;

    try {
      files = fs.listFiles(filePath);
    } catch (e) {
      cc.warn(`Read dir failed: path: ${filePath} message: ${e.message}`);
      err = new Error(e.message);
    }

    onComplete && onComplete(err, files);
  },

  readText(filePath, onComplete) {
    fsUtils.readFile(filePath, 'utf8', onComplete);
  },

  readArrayBuffer(filePath, onComplete) {
    fsUtils.readFile(filePath, '', onComplete);
  },

  readJson(filePath, onComplete) {
    fsUtils.readFile(filePath, 'utf8', function (err, text) {
      var out = null;

      if (!err) {
        try {
          out = JSON.parse(text);
        } catch (e) {
          cc.warn(`Read json failed: path: ${filePath} message: ${e.message}`);
          err = new Error(e.message);
        }
      }

      onComplete && onComplete(err, out);
    });
  },

  readJsonSync(path) {
    try {
      var str = fs.getStringFromFile(path);
      return JSON.parse(str);
    } catch (e) {
      cc.warn(`Read json failed: path: ${path} message: ${e.message}`);
      return new Error(e.message);
    }
  },

  makeDirSync(path, recursive) {
    let result = fs.createDirectory(path);

    if (!result) {
      cc.warn(`Make directory failed: path: ${path}`);
      return new Error(`Make directory failed: path: ${path}`);
    }
  },

  rmdirSync(dirPath, recursive) {
    let result = fs.removeDirectory(dirPath);

    if (!result) {
      cc.warn(`rm directory failed: path: ${dirPath}`);
      return new Error(`rm directory failed: path: ${dirPath}`);
    }
  },

  exists(filePath, onComplete) {
    var result = fs.isFileExist(filePath);
    onComplete && onComplete(result);
  },

  loadSubpackage(name, onProgress, onComplete) {
    throw new Error('not implement');
  }

};
window.fsUtils = module.exports = fsUtils;

},{}],10:[function(require,module,exports){
"use strict";

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
cc.game.restart = function () {
  // Need to clear scene, or native object destructor won't be invoke.
  cc.director.getScene().destroy();

  cc.Object._deferredDestroy();

  __restartVM();
};

jsb.onError(function (location, message, stack) {
  console.error(location, message, stack);
});

jsb.onMemoryWarning = function () {
  cc.game.emit(cc.Game.EVENT_LOW_MEMORY);
};

},{}],11:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

/* global gfx */
const deviceProto = gfx.Device.prototype;
const swapchainProto = gfx.Swapchain.prototype;
const bufferProto = gfx.Buffer.prototype;
const textureProto = gfx.Texture.prototype;
const descriptorSetProto = gfx.DescriptorSet.prototype; ///////////////////////////// handle different paradigms /////////////////////////////

const oldCopyTexImagesToTextureFunc = deviceProto.copyTexImagesToTexture;

deviceProto.copyTexImagesToTexture = function (texImages, texture, regions) {
  const images = [];

  if (texImages) {
    for (let i = 0; i < texImages.length; ++i) {
      const texImage = texImages[i];

      if (texImage instanceof HTMLCanvasElement) {
        // Refer to HTMLCanvasElement and ImageData implementation
        images.push(texImage._data.data);
      } else if (texImage instanceof HTMLImageElement) {
        // Refer to HTMLImageElement implementation
        images.push(texImage._data);
      } else {
        console.log('copyTexImagesToTexture: Convert texImages to data buffers failed');
        return;
      }
    }
  }

  oldCopyTexImagesToTextureFunc.call(this, images, texture, regions);
};

const oldDeviceCreateSwapchainFunc = deviceProto.createSwapchain;

deviceProto.createSwapchain = function (info) {
  info.windowHandle = window.windowHandler;
  return oldDeviceCreateSwapchainFunc.call(this, info);
};

const oldSwapchainInitializeFunc = swapchainProto.initialize;

swapchainProto.initialize = function (info) {
  info.windowHandle = window.windowHandler;
  oldSwapchainInitializeFunc.call(this, info);
};

const oldUpdate = bufferProto.update;

bufferProto.update = function (buffer, size) {
  if (buffer.byteLength === 0) return;
  let buffSize;

  if (this.cachedUsage & 0x40) {
    // BufferUsageBit.INDIRECT
    // It is a IIndirectBuffer object.
    const {
      drawInfos
    } = buffer;
    buffer = new Uint32Array(drawInfos.length * 7);
    let baseIndex = 0;
    let drawInfo;

    for (let i = 0; i < drawInfos.length; ++i) {
      baseIndex = i * 7;
      drawInfo = drawInfos[i];
      buffer[baseIndex] = drawInfo.vertexCount;
      buffer[baseIndex + 1] = drawInfo.firstVertex;
      buffer[baseIndex + 2] = drawInfo.indexCount;
      buffer[baseIndex + 3] = drawInfo.firstIndex;
      buffer[baseIndex + 4] = drawInfo.vertexOffset;
      buffer[baseIndex + 5] = drawInfo.instanceCount;
      buffer[baseIndex + 6] = drawInfo.firstInstance;
    }

    buffSize = buffer.byteLength;
  } else if (size !== undefined) {
    buffSize = size;
  } else {
    buffSize = buffer.byteLength;
  }

  oldUpdate.call(this, buffer, buffSize);
};

const oldDeviceCreateBufferFun = deviceProto.createBuffer;

deviceProto.createBuffer = function (info) {
  let buffer;

  if (info.buffer) {
    buffer = oldDeviceCreateBufferFun.call(this, info, true);
  } else {
    buffer = oldDeviceCreateBufferFun.call(this, info, false);
  }

  buffer.cachedUsage = info.usage;
  return buffer;
};

const oldBufferInitializeFunc = bufferProto.initialize;

bufferProto.initialize = function (info) {
  if (info.buffer) {
    oldBufferInitializeFunc.call(this, info, true);
  } else {
    oldBufferInitializeFunc.call(this, info, false);
  }
};

const oldDeviceCreateTextureFun = deviceProto.createTexture;

deviceProto.createTexture = function (info) {
  if (info.texture) {
    return oldDeviceCreateTextureFun.call(this, info, true);
  }

  return oldDeviceCreateTextureFun.call(this, info, false);
};

const oldTextureInitializeFunc = textureProto.initialize;

textureProto.initialize = function (info) {
  if (info.texture) {
    oldTextureInitializeFunc.call(this, info, true);
  } else {
    oldTextureInitializeFunc.call(this, info, false);
  }
}; ///////////////////////////// optimizations /////////////////////////////
// Cache dirty to avoid invoking gfx.DescriptorSet.update().


descriptorSetProto.bindBuffer = function (binding, buffer, index) {
  this.dirtyJSB = descriptorSetProto.bindBufferJSB.call(this, binding, buffer, index || 0);
};

descriptorSetProto.bindSampler = function (binding, sampler, index) {
  this.dirtyJSB = descriptorSetProto.bindSamplerJSB.call(this, binding, sampler, index || 0);
};

descriptorSetProto.bindTexture = function (bindding, texture, index) {
  this.dirtyJSB = descriptorSetProto.bindTextureJSB.call(this, bindding, texture, index || 0);
};

const oldDSUpdate = descriptorSetProto.update;

descriptorSetProto.update = function () {
  if (!this.dirtyJSB) return;
  oldDSUpdate.call(this);
  this.dirtyJSB = false;
};

Object.defineProperty(deviceProto, 'uboOffsetAlignment', {
  get() {
    if (this.cachedUboOffsetAlignment === undefined) {
      this.cachedUboOffsetAlignment = this.getUboOffsetAlignment();
    }

    return this.cachedUboOffsetAlignment;
  }

});

},{}],12:[function(require,module,exports){
/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
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
'use strict';

const cacheManager = require('./jsb-cache-manager');

const {
  downloadFile,
  readText,
  readArrayBuffer,
  readJson,
  getUserDataPath,
  initJsbDownloader
} = require('./jsb-fs-utils');

const REGEX = /^\w+:\/\/.*/;
const downloader = cc.assetManager.downloader;
const parser = cc.assetManager.parser;
const presets = cc.assetManager.presets;
downloader.maxConcurrency = 30;
downloader.maxRequestsPerFrame = 60;
presets['preload'].maxConcurrency = 15;
presets['preload'].maxRequestsPerFrame = 30;
presets['scene'].maxConcurrency = 32;
presets['scene'].maxRequestsPerFrame = 64;
presets['bundle'].maxConcurrency = 32;
presets['bundle'].maxRequestsPerFrame = 64;
let suffix = 0;
const failureMap = {};
const maxRetryCountFromBreakpoint = 5;
const loadedScripts = {};

function downloadScript(url, options, onComplete) {
  if (typeof options === 'function') {
    onComplete = options;
    options = null;
  }

  if (loadedScripts[url]) return onComplete && onComplete();
  download(url, function (src, options, onComplete) {
    window.require(src);

    loadedScripts[url] = true;
    onComplete && onComplete(null);
  }, options, options.onFileProgress, onComplete);
}

function download(url, func, options, onFileProgress, onComplete) {
  var result = transformUrl(url, options);

  if (result.inLocal) {
    func(result.url, options, onComplete);
  } else if (result.inCache) {
    cacheManager.updateLastTime(url);
    func(result.url, options, function (err, data) {
      if (err) {
        cacheManager.removeCache(url);
      }

      onComplete(err, data);
    });
  } else {
    var time = Date.now();
    var storagePath = '';
    var failureRecord = failureMap[url];

    if (failureRecord) {
      storagePath = failureRecord.storagePath;
    } else if (options.__cacheBundleRoot__) {
      storagePath = `${options.__cacheBundleRoot__}/${time}${suffix++}${cc.path.extname(url)}`;
    } else {
      storagePath = `${time}${suffix++}${cc.path.extname(url)}`;
    }

    downloadFile(url, `${cacheManager.cacheDir}/${storagePath}`, options.header, onFileProgress, function (err, path) {
      if (err) {
        if (failureRecord) {
          failureRecord.retryCount++;

          if (failureRecord.retryCount >= maxRetryCountFromBreakpoint) {
            delete failureMap[url];
          }
        } else {
          failureMap[url] = {
            retryCount: 0,
            storagePath
          };
        }

        onComplete(err, null);
        return;
      }

      delete failureMap[url];
      func(path, options, function (err, data) {
        if (!err) {
          cacheManager.cacheFile(url, storagePath, options.__cacheBundleRoot__);
        }

        onComplete(err, data);
      });
    });
  }
}

function transformUrl(url, options) {
  var inLocal = false;
  var inCache = false;

  if (REGEX.test(url)) {
    if (options.reload) {
      return {
        url
      };
    } else {
      var cache = cacheManager.getCache(url);

      if (cache) {
        inCache = true;
        url = cache;
      }
    }
  } else {
    inLocal = true;
  }

  return {
    url,
    inLocal,
    inCache
  };
}

function doNothing(content, options, onComplete) {
  onComplete(null, content);
}

function downloadAsset(url, options, onComplete) {
  download(url, doNothing, options, options.onFileProgress, onComplete);
}

function _getFontFamily(fontHandle) {
  var ttfIndex = fontHandle.lastIndexOf(".ttf");
  if (ttfIndex === -1) return fontHandle;
  var slashPos = fontHandle.lastIndexOf("/");
  var fontFamilyName;

  if (slashPos === -1) {
    fontFamilyName = fontHandle.substring(0, ttfIndex) + "_LABEL";
  } else {
    fontFamilyName = fontHandle.substring(slashPos + 1, ttfIndex) + "_LABEL";
  }

  if (fontFamilyName.indexOf(' ') !== -1) {
    fontFamilyName = '"' + fontFamilyName + '"';
  }

  return fontFamilyName;
}

function parseText(url, options, onComplete) {
  readText(url, onComplete);
}

function parseJson(url, options, onComplete) {
  readJson(url, onComplete);
}

function downloadText(url, options, onComplete) {
  download(url, parseText, options, options.onFileProgress, onComplete);
}

function parseArrayBuffer(url, options, onComplete) {
  readArrayBuffer(url, onComplete);
}

function downloadJson(url, options, onComplete) {
  download(url, parseJson, options, options.onFileProgress, onComplete);
}

function downloadBundle(nameOrUrl, options, onComplete) {
  let bundleName = cc.path.basename(nameOrUrl);
  var version = options.version || downloader.bundleVers[bundleName];
  let url;

  if (REGEX.test(nameOrUrl) || nameOrUrl.startsWith(getUserDataPath())) {
    url = nameOrUrl;
    cacheManager.makeBundleFolder(bundleName);
  } else {
    if (downloader.remoteBundles.indexOf(bundleName) !== -1) {
      url = `${downloader.remoteServerAddress}remote/${bundleName}`;
      cacheManager.makeBundleFolder(bundleName);
    } else {
      url = `assets/${bundleName}`;
    }
  }

  var config = `${url}/cc.config.${version ? version + '.' : ''}json`;
  options.__cacheBundleRoot__ = bundleName;
  downloadJson(config, options, function (err, response) {
    if (err) {
      return onComplete(err, null);
    }

    let out = response;
    out && (out.base = url + '/');
    var js = `${url}/index.${version ? version + '.' : ''}${out.encrypted ? 'jsc' : `js`}`;
    downloadScript(js, options, function (err) {
      if (err) {
        return onComplete(err, null);
      }

      onComplete(null, out);
    });
  });
}

;

const downloadCCON = (url, options, onComplete) => {
  downloadJson(url, options, (err, json) => {
    if (err) {
      onComplete(err);
      return;
    }

    const cconPreface = cc.internal.parseCCONJson(json);
    const chunkPromises = Promise.all(cconPreface.chunks.map(chunk => new Promise((resolve, reject) => {
      downloadArrayBuffer(`${cc.path.mainFileName(url)}${chunk}`, {}, (errChunk, chunkBuffer) => {
        if (errChunk) {
          reject(errChunk);
        } else {
          resolve(new Uint8Array(chunkBuffer));
        }
      });
    })));
    chunkPromises.then(chunks => {
      const ccon = new cc.internal.CCON(cconPreface.document, chunks);
      onComplete(null, ccon);
    }).catch(err => {
      onComplete(err);
    });
  });
};

const downloadCCONB = (url, options, onComplete) => {
  downloadArrayBuffer(url, options, (err, arrayBuffer) => {
    if (err) {
      onComplete(err);
      return;
    }

    try {
      const ccon = cc.internal.decodeCCONBinary(new Uint8Array(arrayBuffer));
      onComplete(null, ccon);
    } catch (err) {
      onComplete(err);
    }
  });
};

function downloadArrayBuffer(url, options, onComplete) {
  download(url, parseArrayBuffer, options, options.onFileProgress, onComplete);
}

function loadFont(url, options, onComplete) {
  let fontFamilyName = _getFontFamily(url);

  let fontFace = new FontFace(fontFamilyName, "url('" + url + "')");
  document.fonts.add(fontFace);
  fontFace.load();
  fontFace.loaded.then(function () {
    onComplete(null, fontFamilyName);
  }, function () {
    cc.warnID(4933, fontFamilyName);
    onComplete(null, fontFamilyName);
  });
}

const originParsePlist = parser.parsePlist;

let parsePlist = function (url, options, onComplete) {
  readText(url, function (err, file) {
    if (err) return onComplete(err);
    originParsePlist(file, options, onComplete);
  });
};

parser.parsePVRTex = downloader.downloadDomImage;
parser.parsePKMTex = downloader.downloadDomImage;
parser.parseASTCTex = downloader.downloadDomImage;
parser.parsePlist = parsePlist;
downloader.downloadScript = downloadScript;

function loadAudioPlayer(url, options, onComplete) {
  cc.AudioPlayer.load(url).then(player => {
    const audioMeta = {
      player,
      url,
      duration: player.duration,
      type: player.type
    };
    onComplete(null, audioMeta);
  }).catch(err => {
    onComplete(err);
  });
}

downloader.register({
  // JS
  '.js': downloadScript,
  '.jsc': downloadScript,
  // Images
  '.png': downloadAsset,
  '.jpg': downloadAsset,
  '.bmp': downloadAsset,
  '.jpeg': downloadAsset,
  '.gif': downloadAsset,
  '.ico': downloadAsset,
  '.tiff': downloadAsset,
  '.webp': downloadAsset,
  '.image': downloadAsset,
  '.pvr': downloadAsset,
  '.pkm': downloadAsset,
  '.astc': downloadAsset,
  // Audio
  '.mp3': downloadAsset,
  '.ogg': downloadAsset,
  '.wav': downloadAsset,
  '.m4a': downloadAsset,
  '.ccon': downloadCCON,
  '.cconb': downloadCCONB,
  // Video
  '.mp4': downloadAsset,
  '.avi': downloadAsset,
  '.mov': downloadAsset,
  '.mpg': downloadAsset,
  '.mpeg': downloadAsset,
  '.rm': downloadAsset,
  '.rmvb': downloadAsset,
  // Text
  '.txt': downloadAsset,
  '.xml': downloadAsset,
  '.vsh': downloadAsset,
  '.fsh': downloadAsset,
  '.atlas': downloadAsset,
  '.tmx': downloadAsset,
  '.tsx': downloadAsset,
  '.fnt': downloadAsset,
  '.plist': downloadAsset,
  '.json': downloadJson,
  '.ExportJson': downloadAsset,
  '.binary': downloadAsset,
  '.bin': downloadAsset,
  '.dbbin': downloadAsset,
  '.skel': downloadAsset,
  // Font
  '.font': downloadAsset,
  '.eot': downloadAsset,
  '.ttf': downloadAsset,
  '.woff': downloadAsset,
  '.svg': downloadAsset,
  '.ttc': downloadAsset,
  'bundle': downloadBundle,
  'default': downloadText
});
parser.register({
  // Images
  '.png': downloader.downloadDomImage,
  '.jpg': downloader.downloadDomImage,
  '.bmp': downloader.downloadDomImage,
  '.jpeg': downloader.downloadDomImage,
  '.gif': downloader.downloadDomImage,
  '.ico': downloader.downloadDomImage,
  '.tiff': downloader.downloadDomImage,
  '.webp': downloader.downloadDomImage,
  '.image': downloader.downloadDomImage,
  // Audio
  '.mp3': loadAudioPlayer,
  '.ogg': loadAudioPlayer,
  '.wav': loadAudioPlayer,
  '.m4a': loadAudioPlayer,
  // compressed texture
  '.pvr': downloader.downloadDomImage,
  '.pkm': downloader.downloadDomImage,
  '.astc': downloader.downloadDomImage,
  '.binary': parseArrayBuffer,
  '.bin': parseArrayBuffer,
  '.dbbin': parseArrayBuffer,
  '.skel': parseArrayBuffer,
  // Text
  '.txt': parseText,
  '.xml': parseText,
  '.vsh': parseText,
  '.fsh': parseText,
  '.atlas': parseText,
  '.tmx': parseText,
  '.tsx': parseText,
  '.fnt': parseText,
  '.plist': parsePlist,
  // Font
  '.font': loadFont,
  '.eot': loadFont,
  '.ttf': loadFont,
  '.woff': loadFont,
  '.svg': loadFont,
  '.ttc': loadFont,
  '.ExportJson': parseJson
});
cc.assetManager.transformPipeline.append(function (task) {
  var input = task.output = task.input;

  for (var i = 0, l = input.length; i < l; i++) {
    var item = input[i];

    if (item.config) {
      item.options.__cacheBundleRoot__ = item.config.name;
    }

    if (item.ext === '.cconb') {
      item.url = item.url.replace(item.ext, '.bin');
    } else if (item.ext === '.ccon') {
      item.url = item.url.replace(item.ext, '.json');
    }
  }
});
var originInit = cc.assetManager.init;

cc.assetManager.init = function (options) {
  originInit.call(cc.assetManager, options);
  initJsbDownloader(options.jsbDownloaderMaxTasks, options.jsbDownloaderTimeout);
  cacheManager.init();
};

},{"./jsb-cache-manager":5,"./jsb-fs-utils":9}],13:[function(require,module,exports){
'use strict';

const jsbPhy = globalThis['jsb.physics'];
jsbPhy['CACHE'] = {
  trimesh: {},
  convex: {},
  height: {},
  material: {}
};
jsbPhy['OBJECT'] = {
  books: [],
  ptrToObj: {},
  raycastOptions: {
    origin: null,
    unitDir: null,
    distance: 0,
    mask: 0,
    queryTrigger: true
  }
};
jsbPhy['CONFIG'] = {
  heightScale: 1 / 5000
};
const books = jsbPhy['OBJECT'].books;
const ptrToObj = jsbPhy['OBJECT'].ptrToObj;
const raycastOptions = jsbPhy['OBJECT'].raycastOptions;
const TriggerEventObject = {
  type: 'onTriggerEnter',
  selfCollider: null,
  otherCollider: null,
  impl: null
};
const CollisionEventObject = {
  type: 'onCollisionEnter',
  selfCollider: null,
  otherCollider: null,
  contacts: [],
  impl: null
};

function emitTriggerEvent(t, c0, c1, impl) {
  TriggerEventObject.type = t;
  TriggerEventObject.impl = impl;

  if (c0.needTriggerEvent) {
    TriggerEventObject.selfCollider = c0;
    TriggerEventObject.otherCollider = c1;
    c0.emit(t, TriggerEventObject);
  }

  if (c1.needTriggerEvent) {
    TriggerEventObject.selfCollider = c1;
    TriggerEventObject.otherCollider = c0;
    c1.emit(t, TriggerEventObject);
  }
}

const quat = new cc.Quat();
const contactsPool = [];
const contactBufferElementLength = 12;

class ContactPoint {
  constructor(e) {
    this.event = e;
    this.impl = null;
    this.colliderA = null;
    this.colliderB = null;
    this.index = 0;
  }

  get isBodyA() {
    return this.colliderA.uuid === this.event.selfCollider.uuid;
  }

  getLocalPointOnA(o) {
    this.getWorldPointOnB(o);
    cc.Vec3.subtract(o, o, this.colliderA.node.worldPosition);
  }

  getLocalPointOnB(o) {
    this.getWorldPointOnB(o);
    cc.Vec3.subtract(o, o, this.colliderB.node.worldPosition);
  }

  getWorldPointOnA(o) {
    this.getWorldPointOnB(o);
  }

  getWorldPointOnB(o) {
    const i = this.index * contactBufferElementLength;
    o.x = this.impl[i];
    o.y = this.impl[i + 1];
    o.z = this.impl[i + 2];
  }

  getLocalNormalOnA(o) {
    this.getWorldNormalOnA(o);
    cc.Quat.conjugate(quat, this.colliderA.node.worldRotation);
    cc.Vec3.transformQuat(o, o, quat);
  }

  getLocalNormalOnB(o) {
    this.getWorldNormalOnB(o);
    cc.Quat.conjugate(quat, this.colliderB.node.worldRotation);
    cc.Vec3.transformQuat(out, out, quat);
  }

  getWorldNormalOnA(o) {
    this.getWorldNormalOnB(o);
    if (!this.isBodyA) cc.Vec3.negate(o, o);
  }

  getWorldNormalOnB(o) {
    const i = this.index * contactBufferElementLength + 3;
    o.x = this.impl[i];
    o.y = this.impl[i + 1];
    o.z = this.impl[i + 2];
  }

}

function emitCollisionEvent(t, c0, c1, impl, b) {
  CollisionEventObject.type = t;
  CollisionEventObject.impl = impl;
  const contacts = CollisionEventObject.contacts;
  contactsPool.push.apply(contactsPool, contacts);
  contacts.length = 0;
  const contactCount = b.length / contactBufferElementLength;

  for (let i = 0; i < contactCount; i++) {
    let c = contactsPool.length > 0 ? contactsPool.pop() : new ContactPoint(CollisionEventObject);
    c.colliderA = c0;
    c.colliderB = c1;
    c.impl = b;
    c.index = i;
    contacts.push(c);
  }

  if (c0.needCollisionEvent) {
    CollisionEventObject.selfCollider = c0;
    CollisionEventObject.otherCollider = c1;
    c0.emit(t, CollisionEventObject);
  }

  if (c1.needCollisionEvent) {
    CollisionEventObject.selfCollider = c1;
    CollisionEventObject.otherCollider = c0;
    c1.emit(t, CollisionEventObject);
  }
}

class PhysicsWorld {
  get impl() {
    return this._impl;
  }

  constructor() {
    this._impl = new jsbPhy.World();
  }

  setGravity(v) {
    this._impl.setGravity(v.x, v.y, v.z);
  }

  setAllowSleep(v) {
    this._impl.setAllowSleep(v);
  }

  setDefaultMaterial(v) {}

  step(f, t, m) {
    // books.forEach((v) => { v.syncToNativeTransform(); });
    this._impl.step(f);
  }

  raycast(r, o, p, rs) {
    raycastOptions.origin = r.o;
    raycastOptions.unitDir = r.d;
    raycastOptions.mask = o.mask >>> 0;
    raycastOptions.distance = o.maxDistance;
    raycastOptions.queryTrigger = !!o.queryTrigger;

    const isHit = this._impl.raycast(raycastOptions);

    if (isHit) {
      const hits = this._impl.raycastResult();

      for (let i = 0; i < hits.length; i++) {
        const hit = hits[i];
        const out = p.add();

        out._assign(hit.hitPoint, hit.distance, ptrToObj[hit.shape].collider, hit.hitNormal);

        rs.push(out);
      }
    }

    return isHit;
  }

  raycastClosest(r, o, out) {
    raycastOptions.origin = r.o;
    raycastOptions.unitDir = r.d;
    raycastOptions.mask = o.mask >>> 0;
    raycastOptions.distance = o.maxDistance;
    raycastOptions.queryTrigger = !!o.queryTrigger;

    const isHit = this._impl.raycastClosest(raycastOptions);

    if (isHit) {
      const hit = this._impl.raycastClosestResult();

      out._assign(hit.hitPoint, hit.distance, ptrToObj[hit.shape].collider, hit.hitNormal);
    }

    return isHit;
  }

  emitEvents() {
    this.emitTriggerEvent();
    this.emitCollisionEvent();

    this._impl.emitEvents();
  }

  syncSceneToPhysics() {
    this._impl.syncSceneToPhysics();
  }

  syncAfterEvents() {// this._impl.syncSceneToPhysics() 
  }

  destroy() {
    this._impl.destroy();
  }

  emitTriggerEvent() {
    const teps = this._impl.getTriggerEventPairs();

    const len = teps.length / 3;

    for (let i = 0; i < len; i++) {
      const t = i * 3;
      const sa = ptrToObj[teps[t + 0]],
            sb = ptrToObj[teps[t + 1]];
      if (!sa || !sb) continue;
      const c0 = sa.collider,
            c1 = sb.collider;
      if (!(c0 && c0.isValid && c1 && c1.isValid)) continue;
      if (!c0.needTriggerEvent && !c1.needTriggerEvent) continue;
      const state = teps[t + 2];

      if (state === 1) {
        emitTriggerEvent('onTriggerStay', c0, c1, teps);
      } else if (state === 0) {
        emitTriggerEvent('onTriggerEnter', c0, c1, teps);
      } else {
        emitTriggerEvent('onTriggerExit', c0, c1, teps);
      }
    }
  }

  emitCollisionEvent() {
    const ceps = this._impl.getContactEventPairs();

    const len2 = ceps.length / 4;

    for (let i = 0; i < len2; i++) {
      const t = i * 4;
      const sa = ptrToObj[ceps[t + 0]],
            sb = ptrToObj[ceps[t + 1]];
      if (!sa || !sb) continue;
      const c0 = sa.collider,
            c1 = sb.collider;
      if (!(c0 && c0.isValid && c1 && c1.isValid)) continue;
      if (!c0.needCollisionEvent && !c1.needCollisionEvent) continue;
      const state = ceps[t + 2];

      if (state === 1) {
        emitCollisionEvent('onCollisionStay', c0, c1, ceps, ceps[t + 3]);
      } else if (state === 0) {
        emitCollisionEvent('onCollisionEnter', c0, c1, ceps, ceps[t + 3]);
      } else {
        emitCollisionEvent('onCollisionExit', c0, c1, ceps, ceps[t + 3]);
      }
    }
  }

}

function bookNode(v) {
  if (v._physicsBookIndex === undefined) {
    v._physicsBookIndex = books.length;
    books.push(v);
  }
}

function unBookNode(v) {
  const index = v._physicsBookIndex;

  if (index !== undefined) {
    books[index] = books[books.length - 1];
    books[index]._physicsBookIndex = index;
    books.length -= 1;
    v._physicsBookIndex = undefined;
  }
}

function updateCollisionMatrix() {
  const phy = cc.PhysicsSystem.instance;
  const world = phy.physicsWorld.impl;
  const cm = phy.collisionMatrix;

  if (cm.updateArray && cm.updateArray.length > 0) {
    cm.updateArray.forEach(e => {
      const key = `${1 << e}`;
      const mask = cm[key];
      world.setCollisionMatrix(e, mask);
    });
    cm.updateArray.length = 0;
  }
}

class RigidBody {
  get impl() {
    return this._impl;
  }

  get rigidBody() {
    return this._com;
  }

  get isAwake() {
    return this._impl.isAwake();
  }

  get isSleepy() {
    return false;
  }

  get isSleeping() {
    return this._impl.isSleeping();
  }

  constructor() {
    updateCollisionMatrix();
    this._impl = new jsbPhy.RigidBody();
    this._isUsingCCD = false;
  }

  initialize(v) {
    v.node.updateWorldTransform();
    this._com = v;

    this._impl.initialize(v.node.native, v.type, v._group);

    bookNode(v.node);
  }

  onEnable() {
    this.setType(this._com.type);
    this.setMass(this._com.mass);
    this.setAllowSleep(this._com.allowSleep);
    this.setLinearDamping(this._com.linearDamping);
    this.setAngularDamping(this._com.angularDamping);
    this.setLinearFactor(this._com.linearFactor);
    this.setAngularFactor(this._com.angularFactor);
    this.useGravity(this._com.useGravity);

    this._impl.onEnable();
  }

  onDisable() {
    this._impl.onDisable();
  }

  onDestroy() {
    unBookNode(this._com.node);

    this._impl.onDestroy();
  }

  setGroup(v) {
    this._impl.setGroup(v);
  }

  getGroup() {
    return this._impl.getGroup();
  }

  addGroup(v) {
    this.setGroup(this.getGroup() | v);
  }

  removeGroup(v) {
    this.setGroup(this.getGroup() & ~v);
  }

  setMask(v) {
    this._impl.setMask(v >>> 0);
  }

  getMask() {
    return this._impl.getMask();
  }

  addMask(v) {
    this.setMask(this.getMask() | v);
  }

  removeMask(v) {
    this.setMask(this.getMask() & ~v);
  }

  setType(v) {
    this._impl.setType(v);
  }

  setMass(v) {
    this._impl.setMass(v);
  }

  setAllowSleep(v) {
    this._impl.setAllowSleep(v);
  }

  setLinearDamping(v) {
    const dt = cc.PhysicsSystem.instance.fixedTimeStep;

    this._impl.setLinearDamping((1 - (1 - v) ** dt) / dt);
  }

  setAngularDamping(v) {
    const dt = cc.PhysicsSystem.instance.fixedTimeStep;

    this._impl.setAngularDamping((1 - (1 - v) ** dt) / dt);
  }

  isUsingCCD() {
    return this._isUsingCCD;
  }

  useCCD(v) {
    this._isUsingCCD = v;
    return this._impl.useCCD(v);
  }

  useGravity(v) {
    this._impl.useGravity(v);
  }

  setLinearFactor(v) {
    this._impl.setLinearFactor(v.x, v.y, v.z);
  }

  setAngularFactor(v) {
    this._impl.setAngularFactor(v.x, v.y, v.z);
  }

  wakeUp() {
    this._impl.wakeUp();
  }

  sleep() {
    this._impl.sleep();
  }

  clearState() {
    this._impl.clearState();
  }

  clearForces() {
    this._impl.clearForces();
  }

  clearVelocity() {
    this._impl.clearVelocity();
  }

  setSleepThreshold(v) {
    this._impl.setSleepThreshold(v);
  }

  getSleepThreshold() {
    return this._impl.getSleepThreshold();
  }

  getLinearVelocity(o) {
    o.set(this._impl.getLinearVelocity());
  }

  setLinearVelocity(v) {
    this._impl.setLinearVelocity(v.x, v.y, v.z);
  }

  getAngularVelocity(o) {
    o.set(this._impl.getAngularVelocity());
  }

  setAngularVelocity(v) {
    this._impl.setAngularVelocity(v.x, v.y, v.z);
  }

  applyForce(f, p) {
    if (p == null) {
      p = cc.Vec3.ZERO;
    }

    this._impl.applyForce(f.x, f.y, f.z, p.x, p.y, p.z);
  }

  applyLocalForce(f, p) {
    if (p == null) {
      p = cc.Vec3.ZERO;
    }

    this._impl.applyLocalForce(f.x, f.y, f.z, p.x, p.y, p.z);
  }

  applyImpulse(f, p) {
    if (p == null) {
      p = cc.Vec3.ZERO;
    }

    this._impl.applyImpulse(f.x, f.y, f.z, p.x, p.y, p.z);
  }

  applyLocalImpulse(f, p) {
    if (p == null) {
      p = cc.Vec3.ZERO;
    }

    this._impl.applyLocalImpulse(f.x, f.y, f.z, p.x, p.y, p.z);
  }

  applyTorque(t) {
    this._impl.applyTorque(t.x, t.y, t.z);
  }

  applyLocalTorque(t) {
    this._impl.applyLocalTorque(t.x, t.y, t.z);
  }

}

const ESHAPE_FLAG = {
  NONE: 0,
  QUERY_FILTER: 1 << 0,
  QUERY_SINGLE_HIT: 1 << 2,
  DETECT_TRIGGER_EVENT: 1 << 3,
  DETECT_CONTACT_EVENT: 1 << 4,
  DETECT_CONTACT_POINT: 1 << 5,
  DETECT_CONTACT_CCD: 1 << 6
};

class Shape {
  get impl() {
    return this._impl;
  }

  get collider() {
    return this._com;
  }

  get attachedRigidBody() {
    return this._attachedRigidBody;
  }

  constructor() {
    updateCollisionMatrix();
  }

  initialize(v) {
    v.node.updateWorldTransform();
    this._com = v;

    this._impl.initialize(v.node.native);

    ptrToObj[this._impl.getImpl()] = this;
    bookNode(v.node);
  }

  onLoad() {
    this.setMaterial(this._com.sharedMaterial);
    this.setCenter(this._com.center);
    this.setAsTrigger(this._com.isTrigger);
  }

  onEnable() {
    this._impl.onEnable();
  }

  onDisable() {
    this._impl.onDisable();
  }

  onDestroy() {
    unBookNode(this._com.node);
    ptrToObj[this._impl.getImpl()] = null;
    delete ptrToObj[this._impl.getImpl()];

    this._impl.onDestroy();
  }

  setMaterial(v) {
    const ins = cc.PhysicsSystem.instance;
    if (!v) v = ins.defaultMaterial;

    if (!jsbPhy['CACHE'].material[v.id]) {
      jsbPhy['CACHE'].material[v.id] = ins.physicsWorld.impl.createMaterial(v.id, v.friction, v.friction, v.restitution, 2, 2);
    }

    this._impl.setMaterial(v.id, v.friction, v.friction, v.restitution, 2, 2);
  }

  setAsTrigger(v) {
    this._impl.setAsTrigger(v);
  }

  setCenter(v) {
    this._impl.setCenter(v.x, v.y, v.z);
  }

  getAABB(v) {
    v.copy(this._impl.getAABB());
  }

  getBoundingSphere(v) {
    v.copy(this._impl.getBoundingSphere());
  }

  updateEventListener() {
    var flag = 0;
    flag |= ESHAPE_FLAG.DETECT_CONTACT_CCD;
    if (this._com.isTrigger) flag |= ESHAPE_FLAG.IS_TRIGGER;
    if (this._com.needTriggerEvent || this._com.needCollisionEvent) flag |= ESHAPE_FLAG.NEED_EVENT;

    this._impl.updateEventListener(flag);
  }

  setGroup(v) {
    this._impl.setGroup(v);
  }

  getGroup() {
    return this._impl.getGroup();
  }

  addGroup(v) {
    this.setGroup(this.getGroup() | v);
  }

  removeGroup(v) {
    this.setGroup(this.getGroup() & ~v);
  }

  setMask(v) {
    this._impl.setMask(v >>> 0);
  }

  getMask() {
    return this._impl.getMask();
  }

  addMask(v) {
    this.setMask(this.getMask() | v);
  }

  removeMask(v) {
    this.setMask(this.getMask() & ~v);
  }

}

class SphereShape extends Shape {
  constructor() {
    super();
    this._impl = new jsbPhy.SphereShape();
  }

  updateRadius() {
    this._impl.setRadius(this.collider.radius);
  }

  onLoad() {
    super.onLoad();
    this.updateRadius();
  }

}

class BoxShape extends Shape {
  constructor() {
    super();
    this._impl = new jsbPhy.BoxShape();
  }

  updateSize() {
    const v = this.collider.size;

    this._impl.setSize(v.x, v.y, v.z);
  }

  onLoad() {
    super.onLoad();
    this.updateSize();
  }

}

class CapsuleShape extends Shape {
  constructor() {
    super();
    this._impl = new jsbPhy.CapsuleShape();
  }

  setRadius(v) {
    this._impl.setRadius(v);
  }

  setDirection(v) {
    this._impl.setDirection(v);
  }

  setCylinderHeight(v) {
    this._impl.setCylinderHeight(v);
  }

  onLoad() {
    super.onLoad();
    this.setRadius(this._com.radius);
    this.setDirection(this._com.direction);
    this.setCylinderHeight(this._com.cylinderHeight);
  }

}

class PlaneShape extends Shape {
  constructor() {
    super();
    this._impl = new jsbPhy.PlaneShape();
  }

  setConstant(v) {
    this._impl.setConstant(v);
  }

  setNormal(v) {
    this._impl.setNormal(v.x, v.y, v.z);
  }

  onLoad() {
    super.onLoad();
    this.setNormal(this._com.normal);
    this.setConstant(this._com.constant);
  }

}

function getConvexMesh(v) {
  if (!jsbPhy.CACHE.convex[v._uuid]) {
    const posArr = cc.physics.utils.shrinkPositions(v.readAttribute(0, 'a_position'));
    const world = cc.PhysicsSystem.instance.physicsWorld.impl;
    const convex = {
      positions: new Float32Array(posArr),
      positionLength: posArr.length / 3
    };
    jsbPhy.CACHE.convex[v._uuid] = world.createConvex(convex);
  }

  return jsbPhy.CACHE.convex[v._uuid];
}

function getTriangleMesh(v) {
  if (!jsbPhy.CACHE.trimesh[v._uuid]) {
    const indArr = v.readIndices(0); // const posArr = cc.physics.utils.shrinkPositions(v.readAttribute(0, 'a_position'));

    const posArr = v.readAttribute(0, 'a_position');
    const world = cc.PhysicsSystem.instance.physicsWorld.impl;
    const trimesh = {
      positions: new Float32Array(posArr),
      positionLength: posArr.length / 3,
      triangles: new Uint16Array(indArr),
      triangleLength: indArr.length / 3,
      isU16: true
    };
    jsbPhy.CACHE.trimesh[v._uuid] = world.createTrimesh(trimesh);
  }

  return jsbPhy.CACHE.trimesh[v._uuid];
}

function getHeightField(v) {
  if (!jsbPhy.CACHE.height[v._uuid]) {
    const rows = v.getVertexCountI();
    const columns = v.getVertexCountJ();
    const samples = new Int16Array(rows * columns);
    const heightScale = jsbPhy['CONFIG'].heightScale;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        samples[j + i * columns] = v.getHeight(i, j) / heightScale;
      }
    }

    const height = {
      rows,
      columns,
      samples
    };
    const world = cc.PhysicsSystem.instance.physicsWorld.impl;
    jsbPhy.CACHE.height[v._uuid] = world.createHeightField(height);
  }

  return jsbPhy.CACHE.height[v._uuid];
}

class CylinderShape extends Shape {
  constructor() {
    super();
    this._impl = new jsbPhy.CylinderShape();
  }

  setRadius(v) {
    this.updateGeometry();
  }

  setDirection(v) {
    this.updateGeometry();
  }

  setHeight(v) {
    this.updateGeometry();
  }

  updateGeometry() {
    this._impl.setCylinder(this._com.radius, this._com.height, this._com.direction);
  }

  initialize(v) {
    if (!jsbPhy.CACHE.convex["CYLINDER"]) {
      const primitive = cc.physics.utils.cylinder(0.5, 0.5, 2, {
        radialSegments: 32,
        heightSegments: 1
      });
      const posArr = cc.physics.utils.shrinkPositions(primitive.positions);
      const convex = {
        positions: new Float32Array(posArr),
        positionLength: posArr.length / 3
      };
      const handle = cc.PhysicsSystem.instance.physicsWorld.impl.createConvex(convex);
      jsbPhy.CACHE.convex["CYLINDER"] = handle;
    }

    this._com = v;

    this._impl.setCylinder(v.radius, v.height, v.direction);

    this._impl.setConvex(jsbPhy.CACHE.convex["CYLINDER"]);

    super.initialize(v);
  }

}

class ConeShape extends Shape {
  constructor() {
    super();
    this._impl = new jsbPhy.ConeShape();
  }

  setRadius(v) {
    this.updateGeometry();
  }

  setDirection(v) {
    this.updateGeometry();
  }

  setHeight(v) {
    this.updateGeometry();
  }

  updateGeometry() {
    this._impl.setCone(this._com.radius, this._com.height, this._com.direction);
  }

  initialize(v) {
    if (!jsbPhy.CACHE.convex["CONE"]) {
      const primitive = cc.physics.utils.cylinder(0, 0.5, 1, {
        radialSegments: 32,
        heightSegments: 1
      });
      const posArr = cc.physics.utils.shrinkPositions(primitive.positions);
      const convex = {
        positions: new Float32Array(posArr),
        positionLength: posArr.length / 3
      };
      const handle = cc.PhysicsSystem.instance.physicsWorld.impl.createConvex(convex);
      jsbPhy.CACHE.convex["CONE"] = handle;
    }

    this._com = v;

    this._impl.setCone(v.radius, v.height, v.direction);

    this._impl.setConvex(jsbPhy.CACHE.convex["CONE"]);

    super.initialize(v);
  }

}

class TrimeshShape extends Shape {
  constructor() {
    super();
    this._impl = new jsbPhy.TrimeshShape();
  }

  setConvex(v) {
    this._impl.useConvex(v);
  }

  setMesh(v) {
    if (!v) return;
    const isConvex = this._com.convex;

    this._impl.useConvex(isConvex);

    const handle = isConvex ? getConvexMesh(v) : getTriangleMesh(v);

    this._impl.setMesh(handle);
  }

  initialize(v) {
    this._com = v;
    this.setConvex(v.convex);
    this.setMesh(v.mesh);
    super.initialize(v);
  }

}

class TerrainShape extends Shape {
  constructor() {
    super();
    this._impl = new jsbPhy.TerrainShape();
  }

  setTerrain(v) {
    if (!v) return;
    const handle = getHeightField(v);

    this._impl.setTerrain(handle, v.tileSize, v.tileSize, jsbPhy['CONFIG'].heightScale);
  }

  initialize(v) {
    this._com = v;
    this.setTerrain(v.terrain);
    super.initialize(v);
  }

}

class Joint {
  get impl() {
    return this._impl;
  }

  get joint() {
    return this._com;
  }

  setEnableCollision(v) {
    this._impl.setEnableCollision(v);
  }

  setConnectedBody(v) {
    this._impl.setConnectedBody(v ? v.body.impl.getNodeHandle() : 0);
  }

  initialize(v) {
    this._com = v;

    this._impl.initialize(v.node.native);

    ptrToObj[this._impl.getImpl()] = this;
    this.onLoad();
  }

  onLoad() {
    this.setConnectedBody(this._com.connectedBody);
    this.setEnableCollision(this._com.enableCollision);
  }

  onEnable() {
    this._impl.onEnable();
  }

  onDisable() {
    this._impl.onDisable();
  }

  onDestroy() {
    ptrToObj[this._impl.getImpl()] = null;
    delete ptrToObj[this._impl.getImpl()];

    this._impl.onDestroy();
  }

}

class DistanceJoint extends Joint {
  constructor() {
    super();
    this._impl = new jsbPhy.DistanceJoint();
  }

  setPivotA(v) {
    this._impl.setPivotA(v.x, v.y, v.z);
  }

  setPivotB(v) {
    this._impl.setPivotB(v.x, v.y, v.z);
  }

  onLoad() {
    super.onLoad();
    this.setPivotA(this._com.pivotA);
    this.setPivotB(this._com.pivotB);
  }

}

class RevoluteJoint extends Joint {
  constructor() {
    super();
    this._impl = new jsbPhy.RevoluteJoint();
  }

  setAxis(v) {
    this._impl.setAxis(v.x, v.y, v.z);
  }

  setPivotA(v) {
    this._impl.setPivotA(v.x, v.y, v.z);
  }

  setPivotB(v) {
    this._impl.setPivotB(v.x, v.y, v.z);
  }

  onLoad() {
    super.onLoad();
    this.setAxis(this._com.axis);
    this.setPivotA(this._com.pivotA);
    this.setPivotB(this._com.pivotB);
  }

}

cc.physics.selector.register("physx", {
  PhysicsWorld: PhysicsWorld,
  RigidBody: RigidBody,
  SphereShape: SphereShape,
  BoxShape: BoxShape,
  PlaneShape: PlaneShape,
  CapsuleShape: CapsuleShape,
  ConeShape: ConeShape,
  CylinderShape: CylinderShape,
  TrimeshShape: TrimeshShape,
  TerrainShape: TerrainShape,
  PointToPointConstraint: DistanceJoint,
  HingeConstraint: RevoluteJoint
});

},{}],14:[function(require,module,exports){
"use strict";

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
// JS to Native bridges
// set to lazy
Object.defineProperty(jsb, 'reflection', {
  get() {
    if (jsb.__bridge !== undefined) return jsb.__bridge;

    if (window.JavascriptJavaBridge && (cc.sys.os === cc.sys.OS.ANDROID || cc.sys.os === cc.sys.OS.OHOS)) {
      jsb.__bridge = new JavascriptJavaBridge();
    } else if (window.JavaScriptObjCBridge && (cc.sys.os === cc.sys.OS.IOS || cc.sys.os === cc.sys.OS.OSX)) {
      jsb.__bridge = new JavaScriptObjCBridge();
    } else {
      jsb.__bridge = null;
    }

    return jsb.__bridge;
  },

  enumerable: true,
  configurable: true,

  set(value) {
    jsb.__bridge = value;
  }

});

},{}],15:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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
// __fastMQ__, __fastMQInfo__ are created in engine-native\cocos\bindings\manual\jsb_scene_manual_ext.cpp
const NULL_PTR = BigInt(0); // @ts-check

const isLittleEndian = new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x78;
let refMap = []; // prevent arguments from GC

const dataViews = [];

function getDataView(idx) {
  if (!dataViews[idx]) {
    dataViews[idx] = new DataView(__fastMQ__[idx]);
  }

  return dataViews[idx];
}

function beginTrans(fn, minBytes) {
  let dataView = getDataView(__fastMQInfo__[0]);
  let startPos = dataView.getUint32(0, isLittleEndian);
  let commands = dataView.getUint32(4, isLittleEndian);

  if (__fastMQInfo__[0] === 0 && commands === 0) {
    // reset all reference at begining
    refMap.length = 0;
  }

  if (dataView.byteLength <= startPos + minBytes + 12) {
    // allocation new ArrayBuffer, same size as __fastMQ__[0]
    if (!__fastMQ__[__fastMQInfo__[0] + 1]) {
      const buffer = new ArrayBuffer(dataView.byteLength);

      __fastMQ__.push(buffer);

      if (__fastMQInfo__[0] + 1 > 5) {
        console.warn(`Too many pending commands in __fastMQ__, forget to flush?`);
      }
    }

    __fastMQInfo__[0] += 1;
    dataView = getDataView(__fastMQInfo__[0]);
    startPos = 8;
    commands = 0;
  }

  let offset = 4; // reserved for block total length

  dataView.setBigUint64(startPos + offset, fn, isLittleEndian);
  offset += 8;
  return {
    writeUint32: value => {
      dataView.setUint32(startPos + offset, value, isLittleEndian);
      offset += 4;
    },
    writeBigUint64: value => {
      dataView.setBigUint64(startPos + offset, value, isLittleEndian);
      offset += 8;
    },
    commit: () => {
      dataView.setUint32(startPos + 0, offset, isLittleEndian); // fn length

      dataView.setUint32(0, startPos + offset, isLittleEndian); // update offset

      dataView.setUint32(4, commands + 1, isLittleEndian); // update cnt

      __fastMQInfo__[1] += 1;
    },

    writePointer(e) {
      if (e) {
        dataView.setBigUint64(startPos + offset, e.__native_ptr__, isLittleEndian);

        if (refMap.indexOf(e) < 0) {
          refMap.push(e);
        }
      } else {
        dataView.setBigUint64(startPos + offset, NULL_PTR, isLittleEndian);
      }

      offset += 8;
    }

  };
} // DrawBatch2D


const DRAW_BATCH_FN_TABLE = ns.DrawBatch2D.fnTable;
Object.defineProperty(ns.DrawBatch2D.prototype, 'visFlags', {
  set(v) {
    const trans = beginTrans(DRAW_BATCH_FN_TABLE.visFlags, 12);
    trans.writePointer(this);
    trans.writeUint32(v);
    trans.commit();
  },

  enumerable: true,
  configurable: true
});
Object.defineProperty(ns.DrawBatch2D.prototype, 'descriptorSet', {
  set(v) {
    const trans = beginTrans(DRAW_BATCH_FN_TABLE.descriptorSet, 16);
    trans.writePointer(this);
    trans.writePointer(v);
    trans.commit();
  },

  enumerable: true,
  configurable: true
});
Object.defineProperty(ns.DrawBatch2D.prototype, 'inputAssembler', {
  set(v) {
    const trans = beginTrans(DRAW_BATCH_FN_TABLE.inputAssembler, 16);
    trans.writePointer(this);
    trans.writePointer(v);
    trans.commit();
  },

  enumerable: true,
  configurable: true
});
Object.defineProperty(ns.DrawBatch2D.prototype, 'passes', {
  set(passes) {
    if (!passes) return;
    const trans = beginTrans(DRAW_BATCH_FN_TABLE.passes, 8 + 4 + passes.length * 8);
    trans.writePointer(this);
    trans.writeUint32(passes.length); // arg

    for (const p of passes) {
      trans.writePointer(p);
    }

    trans.commit();
  },

  enumerable: true,
  configurable: true
});
Object.defineProperty(ns.DrawBatch2D.prototype, 'shaders', {
  set(shaders) {
    if (!shaders) return;
    const trans = beginTrans(DRAW_BATCH_FN_TABLE.shaders, 8 + 4 + shaders.length * 8);
    trans.writePointer(this);
    trans.writeUint32(shaders.length); // arg

    for (const p of shaders) {
      trans.writePointer(p);
    }

    trans.commit();
  },

  enumerable: true,
  configurable: true
}); // Pass

const PASS_FN_TABLE = ns.Pass.fnTable;
Object.defineProperty(ns.Pass.prototype, 'blendState', {
  set(v) {
    const trans = beginTrans(PASS_FN_TABLE.blendState, 16);
    trans.writePointer(this);
    trans.writePointer(v);
    trans.commit();
  },

  enumerable: true,
  configurable: true
});
Object.defineProperty(ns.Pass.prototype, 'depthStencilState', {
  set(v) {
    const trans = beginTrans(PASS_FN_TABLE.depthStencilState, 16);
    trans.writePointer(this);
    trans.writePointer(v);
    trans.commit();
  },

  enumerable: true,
  configurable: true
});
Object.defineProperty(ns.Pass.prototype, 'rasterizerState', {
  set(v) {
    const trans = beginTrans(PASS_FN_TABLE.rasterizerState, 16);
    trans.writePointer(this);
    trans.writePointer(v);
    trans.commit();
  },

  enumerable: true,
  configurable: true
});
Object.defineProperty(ns.Pass.prototype, 'descriptorSet', {
  set(v) {
    const trans = beginTrans(PASS_FN_TABLE.descriptorSet, 16);
    trans.writePointer(this);
    trans.writePointer(v);
    trans.commit();
  },

  enumerable: true,
  configurable: true
});

},{}],16:[function(require,module,exports){
"use strict";

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
const cacheManager = require('./jsb-cache-manager'); // @ts-expect-error jsb polyfills


(function () {
  if (window.spine === undefined || window.middleware === undefined) return;
  if (cc.internal.SpineSkeletonData === undefined) return;
  const spine = window.spine;
  const middleware = window.middleware;
  middleware.generateGetSet(spine); // spine global time scale

  Object.defineProperty(spine, 'timeScale', {
    get() {
      return this._timeScale;
    },

    set(value) {
      this._timeScale = value;
      spine.SkeletonAnimation.setGlobalTimeScale(value);
    },

    configurable: true
  });

  const _slotColor = cc.color(0, 0, 255, 255);

  const _boneColor = cc.color(255, 0, 0, 255);

  const _meshColor = cc.color(255, 255, 0, 255);

  const _originColor = cc.color(0, 255, 0, 255);

  const skeletonDataProto = cc.internal.SpineSkeletonData.prototype;
  let _gTextureIdx = 1;
  const _textureKeyMap = {};

  const _textureMap = new WeakMap();

  const skeletonDataMgr = spine.SkeletonDataMgr.getInstance();
  spine.skeletonDataMgr = skeletonDataMgr;
  skeletonDataMgr.setDestroyCallback(textureIndex => {
    if (!textureIndex) return;
    const texKey = _textureKeyMap[textureIndex];

    if (texKey && _textureMap.has(texKey)) {
      _textureMap.delete(texKey);

      delete _textureKeyMap[textureIndex];
    }
  });
  const skeletonCacheMgr = spine.SkeletonCacheMgr.getInstance();
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
    const uuid = this._uuid;

    if (!uuid) {
      cc.errorID(7504);
      return;
    }

    const atlasText = this.atlasText;

    if (!atlasText) {
      cc.errorID(7508, this.name);
      return;
    }

    const textures = this.textures;
    const textureNames = this.textureNames;

    if (!(textures && textures.length > 0 && textureNames && textureNames.length > 0)) {
      cc.errorID(7507, this.name);
      return;
    }

    const jsbTextures = {};

    for (let i = 0; i < textures.length; ++i) {
      const texture = textures[i];
      const textureIdx = this.recordTexture(texture);
      const spTex = new middleware.Texture2D();
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
    const index = _gTextureIdx;
    const texKey = _textureKeyMap[index] = {
      key: index
    };

    _textureMap.set(texKey, texture);

    _gTextureIdx++;
    return index;
  };

  skeletonDataProto.getTextureByIndex = function (textureIdx) {
    const texKey = _textureKeyMap[textureIdx];
    if (!texKey) return null;
    return _textureMap.get(texKey);
  };

  const animation = spine.SkeletonAnimation.prototype; // The methods are added to be compatibility with old versions.

  animation.setCompleteListener = function (listener) {
    this._compeleteListener = listener;
    this.setCompleteListenerNative(function (trackEntry) {
      const loopCount = Math.floor(trackEntry.trackTime / trackEntry.animationEnd);
      this._compeleteListener && this._compeleteListener(trackEntry, loopCount);
    });
  }; // The methods are added to be compatibility with old versions.


  animation.setTrackCompleteListener = function (trackEntry, listener) {
    this._trackCompeleteListener = listener;
    this.setTrackCompleteListenerNative(trackEntry, function (trackEntryNative) {
      const loopCount = Math.floor(trackEntryNative.trackTime / trackEntryNative.animationEnd);
      this._trackCompeleteListener && this._trackCompeleteListener(trackEntryNative, loopCount);
    });
  }; // Temporary solution before upgrade the Spine API


  animation.setAnimationListener = function (target, callback) {
    this._target = target;
    this._callback = callback; // eslint-disable-next-line no-undef

    const AnimationEventType = legacyCC.internal.SpineAnimationEventType;
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

  const skeleton = cc.internal.SpineSkeleton.prototype;
  const AnimationCacheMode = cc.internal.SpineSkeleton.AnimationCacheMode;
  Object.defineProperty(skeleton, 'paused', {
    get() {
      return this._paused || false;
    },

    set(value) {
      this._paused = value;

      if (this._nativeSkeleton) {
        this._nativeSkeleton.paused(value);
      }
    }

  });
  Object.defineProperty(skeleton, 'premultipliedAlpha', {
    get() {
      if (this._premultipliedAlpha === undefined) {
        return true;
      }

      return this._premultipliedAlpha;
    },

    set(value) {
      this._premultipliedAlpha = value;

      if (this._nativeSkeleton) {
        this._nativeSkeleton.setOpacityModifyRGB(this._premultipliedAlpha);
      }
    }

  });
  Object.defineProperty(skeleton, 'timeScale', {
    get() {
      if (this._timeScale === undefined) return 1.0;
      return this._timeScale;
    },

    set(value) {
      this._timeScale = value;

      if (this._nativeSkeleton) {
        this._nativeSkeleton.setTimeScale(this._timeScale);
      }
    }

  });
  const _updateDebugDraw = skeleton._updateDebugDraw;

  skeleton._updateDebugDraw = function () {
    _updateDebugDraw.call(this);

    if (this._nativeSkeleton && !this.isAnimationCached()) {
      this._nativeSkeleton.setDebugMeshEnabled(this.debugMesh);

      this._nativeSkeleton.setDebugSlotsEnabled(this.debugSlots);

      this._nativeSkeleton.setDebugBonesEnabled(this.debugBones);
    }
  };

  const _updateUseTint = skeleton._updateUseTint;

  skeleton._updateUseTint = function () {
    _updateUseTint.call(this);

    if (this._nativeSkeleton) {
      this._nativeSkeleton.setUseTint(this.useTint);
    }
  };

  const _updateBatch = skeleton._updateBatch;

  skeleton._updateBatch = function () {
    _updateBatch.call(this);

    if (this._nativeSkeleton) {
      this._nativeSkeleton.setBatchEnabled(this.enableBatch);
    }
  };

  skeleton.setSkeletonData = function (skeletonData) {
    if (skeletonData.width != null && skeletonData.height != null) {
      const uiTrans = this.node._uiProps.uiTransformComp;
      uiTrans.setContentSize(skeletonData.width, skeletonData.height);
    }

    const uuid = skeletonData._uuid;

    if (!uuid) {
      cc.errorID(7504);
      return;
    }

    const texValues = skeletonData.textures;
    const texKeys = skeletonData.textureNames;

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
      nativeSkeleton = new spine.SkeletonCacheAnimation(uuid, this._cacheMode === AnimationCacheMode.SHARED_CACHE);
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
    const compColor = this.color;
    nativeSkeleton.setColor(compColor.r, compColor.g, compColor.b, compColor.a);
    this._skeleton = nativeSkeleton.getSkeleton(); // init skeleton listener

    this._startListener && this.setStartListener(this._startListener);
    this._endListener && this.setEndListener(this._endListener);
    this._completeListener && this.setCompleteListener(this._completeListener);
    this._eventListener && this.setEventListener(this._eventListener);
    this._interruptListener && this.setInterruptListener(this._interruptListener);
    this._disposeListener && this.setDisposeListener(this._disposeListener);
    this._sharedBufferOffset = nativeSkeleton.getSharedBufferOffset();
    this._sharedBufferOffset[0] = 0;
    this._useAttach = false;
    this._renderOrder = -1; // store render order and world matrix

    this._paramsBuffer = nativeSkeleton.getParamsBuffer();
    this.syncTransform(true);
    this.markForUpdateRenderData();
  };

  skeleton._updateColor = function () {
    if (this._nativeSkeleton) {
      const compColor = this.color;

      this._nativeSkeleton.setColor(compColor.r, compColor.g, compColor.b, compColor.a);

      this.markForUpdateRenderData();
    }
  };

  skeleton.setAnimationStateData = function (stateData) {
    if (this._nativeSkeleton && !this.isAnimationCached()) {
      this._stateData = stateData;

      this._nativeSkeleton.setAnimationStateData(stateData);
    }
  };

  const _onEnable = skeleton.onEnable;

  skeleton.onEnable = function () {
    if (_onEnable) {
      _onEnable.call(this);
    }

    if (this._nativeSkeleton) {
      this._nativeSkeleton.onEnable();
    }

    this.syncTransform(true);
    middleware.retain();
  };

  const _onDisable = skeleton.onDisable;

  skeleton.onDisable = function () {
    if (_onDisable) {
      _onDisable.call(this);
    }

    if (this._nativeSkeleton) {
      this._nativeSkeleton.onDisable();
    }

    middleware.release();
  };

  skeleton.setVertexEffectDelegate = function (effectDelegate) {
    if (this._nativeSkeleton && !this.isAnimationCached()) {
      this._nativeSkeleton.setVertexEffectDelegate(effectDelegate);
    }
  };

  skeleton.syncTransform = function (force) {
    const node = this.node;
    if (!node) return;
    const paramsBuffer = this._paramsBuffer;
    if (!paramsBuffer) return;

    if (force || node.hasChangedFlags || node._dirtyFlags) {
      // sync node world matrix to native
      node.updateWorldTransform();
      const worldMat = node._mat;
      paramsBuffer[1] = worldMat.m00;
      paramsBuffer[2] = worldMat.m01;
      paramsBuffer[3] = worldMat.m02;
      paramsBuffer[4] = worldMat.m03;
      paramsBuffer[5] = worldMat.m04;
      paramsBuffer[6] = worldMat.m05;
      paramsBuffer[7] = worldMat.m06;
      paramsBuffer[8] = worldMat.m07;
      paramsBuffer[9] = worldMat.m08;
      paramsBuffer[10] = worldMat.m09;
      paramsBuffer[11] = worldMat.m10;
      paramsBuffer[12] = worldMat.m11;
      paramsBuffer[13] = worldMat.m12;
      paramsBuffer[14] = worldMat.m13;
      paramsBuffer[15] = worldMat.m14;
      paramsBuffer[16] = worldMat.m15;
    }
  }; // eslint-disable-next-line no-unused-vars


  skeleton.updateAnimation = function (dt) {
    const nativeSkeleton = this._nativeSkeleton;
    if (!nativeSkeleton) return;
    const node = this.node;
    if (!node) return;
    const paramsBuffer = this._paramsBuffer;

    if (this._renderOrder !== middleware.renderOrder) {
      paramsBuffer[0] = middleware.renderOrder;
      this._renderOrder = middleware.renderOrder;
      middleware.renderOrder++;
    }

    this.syncTransform();

    if (this.__preColor__ === undefined || !this.color.equals(this.__preColor__)) {
      const compColor = this.color;
      nativeSkeleton.setColor(compColor.r, compColor.g, compColor.b, compColor.a);
      this.__preColor__ = compColor;
    }

    const socketNodes = this.socketNodes;

    if (!this._useAttach && socketNodes.size > 0) {
      this._useAttach = true;
      nativeSkeleton.setAttachEnabled(true);
    }

    if (!this.isAnimationCached() && (this.debugBones || this.debugSlots || this.debugMesh) && this._debugRenderer) {
      const graphics = this._debugRenderer;
      graphics.clear();
      graphics.lineWidth = 5;
      const debugData = this._debugData || nativeSkeleton.getDebugData();
      if (!debugData) return;
      let debugIdx = 0;
      let debugType = 0;
      let debugLen = 0;
      debugType = debugData[debugIdx++];

      while (debugType !== 0) {
        debugLen = debugData[debugIdx++];

        switch (debugType) {
          case 1:
            // slots
            graphics.strokeColor = _slotColor;

            for (let i = 0; i < debugLen; i += 8) {
              graphics.moveTo(debugData[debugIdx++], debugData[debugIdx++]);
              graphics.lineTo(debugData[debugIdx++], debugData[debugIdx++]);
              graphics.lineTo(debugData[debugIdx++], debugData[debugIdx++]);
              graphics.lineTo(debugData[debugIdx++], debugData[debugIdx++]);
              graphics.close();
              graphics.stroke();
            }

            break;

          case 2:
            // mesh
            graphics.strokeColor = _meshColor;

            for (let i = 0; i < debugLen; i += 6) {
              graphics.moveTo(debugData[debugIdx++], debugData[debugIdx++]);
              graphics.lineTo(debugData[debugIdx++], debugData[debugIdx++]);
              graphics.lineTo(debugData[debugIdx++], debugData[debugIdx++]);
              graphics.close();
              graphics.stroke();
            }

            break;

          case 3:
            // bones
            graphics.strokeColor = _boneColor;
            graphics.fillColor = _slotColor; // Root bone color is same as slot color.

            for (let i = 0; i < debugLen; i += 4) {
              const bx = debugData[debugIdx++];
              const by = debugData[debugIdx++];
              const x = debugData[debugIdx++];
              const y = debugData[debugIdx++]; // Bone lengths.

              graphics.moveTo(bx, by);
              graphics.lineTo(x, y);
              graphics.stroke(); // Bone origins.

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

        debugType = debugData[debugIdx++];
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
  }; // eslint-disable-next-line no-unused-vars


  skeleton.getTextureAtlas = function (regionAttachment) {
    cc.warn('Spine Skeleton getTextureAtlas not support in native');
    return null;
  };

  skeleton.setMix = function (fromAnimation, toAnimation, duration) {
    if (this._nativeSkeleton && !this.isAnimationCached()) {
      this._nativeSkeleton.setMix(fromAnimation, toAnimation, duration);
    }
  };

  skeleton.setAnimation = function (trackIndex, name, loop) {
    const strName = name.toString();
    this._animationName = strName;
    this._playTimes = loop ? 0 : 1;

    if (this._nativeSkeleton) {
      if (this.isAnimationCached()) {
        return this._nativeSkeleton.setAnimation(strName, loop);
      } else {
        return this._nativeSkeleton.setAnimation(trackIndex, strName, loop);
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
          const self = this._comp;
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
          const self = this._comp;
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
          const self = this._comp;
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

    return null;
  };

  skeleton._ensureListener = function () {
    cc.warn('Spine Skeleton _ensureListener not need in native');
  };

  skeleton._updateSkeletonData = function () {
    if (this.skeletonData) {
      this.skeletonData.init();
      this.setSkeletonData(this.skeletonData);

      this._indexBoneSockets();

      this.attachUtil.init(this);
      this._preCacheMode = this._cacheMode;
      this.defaultSkin && this._nativeSkeleton.setSkin(this.defaultSkin);
      this.animation = this.defaultAnimation;
    } else if (this._nativeSkeleton) {
      this._nativeSkeleton.stopSchedule();

      this._nativeSkeleton._comp = null;
      this._nativeSkeleton = null;
    }

    this._needUpdateSkeltonData = false;
  };

  const _onDestroy = skeleton.onDestroy;

  skeleton.onDestroy = function () {
    _onDestroy.call(this);

    if (this._nativeSkeleton) {
      this._nativeSkeleton.stopSchedule();

      this._nativeSkeleton._comp = null;
      this._nativeSkeleton = null;
    }

    this._stateData = null;
  };

  const _tempAttachMat4 = cc.mat4();

  const _identityTrans = new cc.Node();

  let _tempVfmt;

  let _tempBufferIndex;

  let _tempIndicesOffset;

  let _tempIndicesCount;

  skeleton._render = function (ui) {
    const nativeSkeleton = this._nativeSkeleton;
    if (!nativeSkeleton) return;
    const node = this.node;
    if (!node) return;
    const sharedBufferOffset = this._sharedBufferOffset;
    if (!sharedBufferOffset) return;
    const renderInfoOffset = sharedBufferOffset[0]; // reset render info offset

    sharedBufferOffset[0] = 0;
    const socketNodes = this.socketNodes;

    if (socketNodes.size > 0) {
      const attachInfoMgr = middleware.attachInfoMgr;
      const attachInfo = attachInfoMgr.attachInfo;
      const attachInfoOffset = sharedBufferOffset[1]; // reset attach info offset

      sharedBufferOffset[1] = 0;

      for (const boneIdx of socketNodes.keys()) {
        const boneNode = socketNodes.get(boneIdx); // Node has been destroy

        if (!boneNode || !boneNode.isValid) {
          socketNodes.delete(boneIdx);
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

    const renderInfoMgr = middleware.renderInfoMgr;
    const renderInfo = renderInfoMgr.renderInfo;
    let materialIdx = 0;
    let realTextureIndex;
    let realTexture; // verify render border

    const border = renderInfo[renderInfoOffset + materialIdx++];
    if (border !== 0xffffffff) return;
    const matLen = renderInfo[renderInfoOffset + materialIdx++];
    const useTint = this.useTint || this.isAnimationCached();
    const vfmt = useTint ? middleware.vfmtPosUvTwoColor : middleware.vfmtPosUvColor;
    _tempVfmt = vfmt;
    if (matLen === 0) return;

    for (let index = 0; index < matLen; index++) {
      realTextureIndex = renderInfo[renderInfoOffset + materialIdx++];
      realTexture = this.skeletonData.getTextureByIndex(realTextureIndex);
      if (!realTexture) return; // SpineMaterialType.TWO_COLORED 1
      // SpineMaterialType.COLORED_TEXTURED 0
      //HACK

      const mat = this.material; // cache material

      this.material = this.getMaterialForBlendAndTint(renderInfo[renderInfoOffset + materialIdx++], renderInfo[renderInfoOffset + materialIdx++], useTint ? 1 : 0);
      _tempBufferIndex = renderInfo[renderInfoOffset + materialIdx++];
      _tempIndicesOffset = renderInfo[renderInfoOffset + materialIdx++];
      _tempIndicesCount = renderInfo[renderInfoOffset + materialIdx++];
      const renderData = middleware.RenderInfoLookup[_tempVfmt][_tempBufferIndex];
      ui.commitComp(this, renderData, realTexture, this._assembler, _identityTrans);
      renderData.updateRange(renderData.vertexStart, renderData.vertexCount, _tempIndicesOffset, _tempIndicesCount);
      this.material = mat;
    }
  }; //////////////////////////////////////////
  // assembler


  const assembler = cc.internal.SpineAssembler; // eslint-disable-next-line no-unused-vars

  assembler.createData = function (comp) {};

  assembler.updateRenderData = function () {}; // eslint-disable-next-line no-unused-vars


  assembler.fillBuffers = function (comp, renderer) {};
})();

},{"./jsb-cache-manager":5}],17:[function(require,module,exports){
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
'use strict';

if (cc.internal.VideoPlayer) {
  const {
    EventType
  } = cc.internal.VideoPlayer;
  let vec3 = cc.Vec3;
  let mat4 = cc.Mat4;

  let _mat4_temp = new mat4();

  let _topLeft = new vec3();

  let _bottomRight = new vec3();

  cc.internal.VideoPlayerImplManager.getImpl = function (componenet) {
    return new VideoPlayerImplJSB(componenet);
  };

  class VideoPlayerImplJSB extends cc.internal.VideoPlayerImpl {
    constructor(componenet) {
      super(componenet);
      this._matViewProj_temp = new mat4();
    }

    syncClip(clip) {
      this.removeVideoPlayer();

      if (!clip) {
        return;
      }

      this.createVideoPlayer(clip._nativeAsset);
    }

    syncURL(url) {
      this.removeVideoPlayer();

      if (!url) {
        return;
      }

      this.createVideoPlayer(url);
    }

    onCanplay() {
      if (this._loaded) {
        return;
      }

      this._loaded = true;
      this.video.setVisible(this._visible);
      this.dispatchEvent(EventType.READY_TO_PLAY);
      this.delayedPlay();
    }

    _bindEvent() {
      this.video.addEventListener('loadedmetadata', this.onLoadedMetadata.bind(this));
      this.video.addEventListener('suspend', this.onCanPlay.bind(this));
      this.video.addEventListener('play', this.onPlay.bind(this));
      this.video.addEventListener('pause', this.onPause.bind(this));
      this.video.addEventListener('stoped', this.onStoped.bind(this));
      this.video.addEventListener('click', this.onClick.bind(this));
      this.video.addEventListener('ended', this.onEnded.bind(this));
    }

    onLoadedMetadata() {
      this._loadedMeta = true;
      this._forceUpdate = true;

      if (this._visible) {
        this.enable();
      } else {
        this.disable();
      }

      this.dispatchEvent(EventType.META_LOADED);
      this.delayedFullScreen();
      this.delayedPlay();
    }

    createVideoPlayer(url) {
      this._video = new jsb.VideoPlayer();

      this._bindEvent();

      this._video.setVisible(this._visible);

      this._video.setURL(url);

      this._forceUpdate = true;
    }

    removeVideoPlayer() {
      let video = this.video;

      if (video) {
        video.stop();
        video.setVisible(false);
        video.destroy();
        this._playing = false;
        this._loaded = false;
        this._loadedMeta = false;
        this._ignorePause = false;
        this._cachedCurrentTime = 0;
        this._video = null;
      }
    }

    getDuration() {
      if (!this.video) {
        return -1;
      }

      return this.video.duration();
    }

    syncPlaybackRate() {
      cc.warn('The platform does not support');
    }

    syncVolume() {
      cc.warn('The platform does not support');
    }

    syncMute() {
      cc.warn('The platform does not support');
    }

    syncLoop() {
      cc.warn('The platform does not support');
    }

    syncStayOnBottom() {
      cc.warn('The platform does not support');
    }

    getCurrentTime() {
      if (this.video) {
        return this.video.currentTime();
      }

      return -1;
    }

    seekTo(val) {
      let video = this._video;
      if (!video) return;
      video.seekTo(val);
    }

    disable(noPause) {
      if (this.video) {
        if (!noPause) {
          this.video.pause();
        }

        this.video.setVisible(false);
        this._visible = false;
      }
    }

    enable() {
      if (this.video) {
        this.video.setVisible(true);
        this._visible = true;
      }
    }

    canPlay() {
      this.video.play();
      this.syncCurrentTime();
    }

    resume() {
      if (this.video) {
        this.video.resume();
        this.syncCurrentTime();
        this._playing = true;
      }
    }

    pause() {
      if (this.video) {
        this._cachedCurrentTime = this.video.currentTime();
        this.video.pause();
      }
    }

    stop() {
      if (this.video) {
        this._ignorePause = true;
        this.video.seekTo(0);
        this._cachedCurrentTime = 0;
        this.video.stop();
      }
    }

    canFullScreen(enabled) {
      if (this.video) {
        this.video.setFullScreenEnabled(enabled);
      }
    }

    syncKeepAspectRatio(enabled) {
      if (this.video) {
        this.video.setKeepAspectRatioEnabled(enabled);
      }
    }

    syncMatrix() {
      if (!this._video || !this._component || !this._uiTrans) return;
      const camera = this.UICamera;

      if (!camera) {
        return;
      }

      this._component.node.getWorldMatrix(_mat4_temp);

      const {
        width,
        height
      } = this._uiTrans.contentSize;

      if (!this._forceUpdate && camera.matViewProj.equals(this._matViewProj_temp) && this._m00 === _mat4_temp.m00 && this._m01 === _mat4_temp.m01 && this._m04 === _mat4_temp.m04 && this._m05 === _mat4_temp.m05 && this._m12 === _mat4_temp.m12 && this._m13 === _mat4_temp.m13 && this._w === width && this._h === height) {
        return;
      }

      this._matViewProj_temp.set(camera.matViewProj); // update matrix cache


      this._m00 = _mat4_temp.m00;
      this._m01 = _mat4_temp.m01;
      this._m04 = _mat4_temp.m04;
      this._m05 = _mat4_temp.m05;
      this._m12 = _mat4_temp.m12;
      this._m13 = _mat4_temp.m13;
      this._w = width;
      this._h = height;
      let canvas_width = cc.game.canvas.width;
      let canvas_height = cc.game.canvas.height;
      let ap = this._uiTrans.anchorPoint; // Vectors in node space

      vec3.set(_topLeft, -ap.x * this._w, (1.0 - ap.y) * this._h, 0);
      vec3.set(_bottomRight, (1 - ap.x) * this._w, -ap.y * this._h, 0); // Convert to world space

      vec3.transformMat4(_topLeft, _topLeft, _mat4_temp);
      vec3.transformMat4(_bottomRight, _bottomRight, _mat4_temp); // need update camera data

      camera.update(); // Convert to Screen space

      camera.worldToScreen(_topLeft, _topLeft);
      camera.worldToScreen(_bottomRight, _bottomRight);
      let finalWidth = _bottomRight.x - _topLeft.x;
      let finalHeight = _topLeft.y - _bottomRight.y;

      this._video.setFrame(_topLeft.x, canvas_height - _topLeft.y, finalWidth, finalHeight);

      this._forceUpdate = false;
    }

  }
}

},{}],18:[function(require,module,exports){
/****************************************************************************
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
'use strict';

if (cc.internal.WebView) {
  const {
    EventType
  } = cc.internal.WebView;
  let vec3 = cc.Vec3;
  let mat4 = cc.Mat4;

  let _mat4_temp = new mat4();

  let _topLeft = new vec3();

  let _bottomRight = new vec3();

  cc.internal.WebViewImplManager.getImpl = function (componenet) {
    return new WebViewImplJSB(componenet);
  };

  class WebViewImplJSB extends cc.internal.WebViewImpl {
    constructor(componenet) {
      super(componenet);
      this.jsCallback = null;
      this.interfaceSchema = null;
      this._matViewProj_temp = new mat4();
    }

    _bindEvent() {
      let onLoaded = () => {
        this._forceUpdate = true;
        this.dispatchEvent(EventType.LOADED);
      };

      let onError = () => {
        this.dispatchEvent(EventType.ERROR);
      };

      this.webview.setOnDidFinishLoading(onLoaded);
      this.webview.setOnDidFailLoading(onError);
      this.jsCallback && this.setOnJSCallback(this.jsCallback);
      this.interfaceSchema && this.setJavascriptInterfaceScheme(this.interfaceSchema); // remove obj

      this.jsCallback = null;
      this.interfaceSchema = null;
    }

    createWebView() {
      if (!jsb.WebView) {
        console.warn('jsb.WebView is null');
        return;
      }

      this._webview = jsb.WebView.create();

      this._bindEvent();
    }

    removeWebView() {
      let webview = this.webview;

      if (webview) {
        this.webview.destroy();
        this.reset();
      }
    }

    disable() {
      if (this.webview) {
        this.webview.setVisible(false);
      }
    }

    enable() {
      if (this.webview) {
        this.webview.setVisible(true);
      }
    }

    setOnJSCallback(callback) {
      let webview = this.webview;

      if (webview) {
        webview.setOnJSCallback(callback);
      } else {
        this.jsCallback = callback;
      }
    }

    setJavascriptInterfaceScheme(scheme) {
      let webview = this.webview;

      if (webview) {
        webview.setJavascriptInterfaceScheme(scheme);
      } else {
        this.interfaceSchema = scheme;
      }
    }

    loadURL(url) {
      let webview = this.webview;

      if (webview) {
        webview.src = url;
        webview.loadURL(url);
        this.dispatchEvent(EventType.LOADING);
      }
    }

    evaluateJS(str) {
      let webview = this.webview;

      if (webview) {
        return webview.evaluateJS(str);
      }
    }

    syncMatrix() {
      if (!this._webview || !this._component || !this._uiTrans) return;
      const camera = this.UICamera;

      if (!camera) {
        return;
      }

      this._component.node.getWorldMatrix(_mat4_temp);

      const {
        width,
        height
      } = this._uiTrans.contentSize;

      if (!this._forceUpdate && camera.matViewProj.equals(this._matViewProj_temp) && this._m00 === _mat4_temp.m00 && this._m01 === _mat4_temp.m01 && this._m04 === _mat4_temp.m04 && this._m05 === _mat4_temp.m05 && this._m12 === _mat4_temp.m12 && this._m13 === _mat4_temp.m13 && this._w === width && this._h === height) {
        return;
      }

      this._matViewProj_temp.set(camera.matViewProj); // update matrix cache


      this._m00 = _mat4_temp.m00;
      this._m01 = _mat4_temp.m01;
      this._m04 = _mat4_temp.m04;
      this._m05 = _mat4_temp.m05;
      this._m12 = _mat4_temp.m12;
      this._m13 = _mat4_temp.m13;
      this._w = width;
      this._h = height;
      let canvas_width = cc.game.canvas.width;
      let canvas_height = cc.game.canvas.height;
      let ap = this._uiTrans.anchorPoint; // Vectors in node space

      vec3.set(_topLeft, -ap.x * this._w, (1.0 - ap.y) * this._h, 0);
      vec3.set(_bottomRight, (1 - ap.x) * this._w, -ap.y * this._h, 0); // Convert to world space

      vec3.transformMat4(_topLeft, _topLeft, _mat4_temp);
      vec3.transformMat4(_bottomRight, _bottomRight, _mat4_temp); // need update camera data

      camera.update(); // Convert to Screen space

      camera.worldToScreen(_topLeft, _topLeft);
      camera.worldToScreen(_bottomRight, _bottomRight);
      let finalWidth = _bottomRight.x - _topLeft.x;
      let finalHeight = _topLeft.y - _bottomRight.y;

      this._webview.setFrame(_topLeft.x, canvas_height - _topLeft.y, finalWidth, finalHeight);

      this._forceUpdate = false;
    }

  }
}

},{}]},{},[1]);
