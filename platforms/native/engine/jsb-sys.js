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

const sys = cc.sys;

Object.assign(sys, {
    __init () {
        let platform = __getPlatform();
        this.isNative = true;
        this.isBrowser = false;
        this.platform = platform;
        this.isMobile = (platform === this.ANDROID
                        || platform === this.IPAD
                        || platform === this.IPHONE
                        || platform === this.WP8
                        || platform === this.TIZEN
                        || platform === this.BLACKBERRY
                        || platform === this.XIAOMI_QUICK_GAME
                        || platform === this.VIVO_MINI_GAME
                        || platform === this.OPPO_MINI_GAME
                        || platform === this.HUAWEI_QUICK_GAME
                        || platform === this.COCOSPLAY);

        this.os = __getOS();
        this.language = __getCurrentLanguage();
        const languageCode = __getCurrentLanguageCode();
        this.languageCode = languageCode ? languageCode.toLowerCase() : 'unknown';
        this.osVersion = __getOSVersion();
        this.osMainVersion = parseInt(this.osVersion);
        this.browserType = null;
        this.browserVersion = '';

        const w = window.innerWidth;
        const h = window.innerHeight;
        const ratio = window.devicePixelRatio || 1;
        this.windowPixelResolution = {
            width: window.nativeWidth || ratio * w,
            height: window.nativeHeight || ratio * h,
        };

        this.localStorage = window.localStorage;

        let capabilities;
        capabilities = this.capabilities = {
            canvas: false,
            opengl: true,
            webp: true,
            imageBitmap: false,
            touches: this.isMobile,
            mouse: !this.isMobile,
            keyboard: !this.isMobile || (window.JavascriptJavaBridge && cc.sys.os === cc.sys.OS_ANDROID),
            accelerometer: this.isMobile,
        };

        this.__audioSupport = {
            ONLY_ONE: false,
            WEB_AUDIO: false,
            DELAY_CREATE_CTX: false,
            format: ['.mp3'],
        };

        this.__videoSupport = {
            format: ['.mp4'],
        };
        
    },
    
    getNetworkType: jsb.Device.getNetworkType,
    getBatteryLevel: jsb.Device.getBatteryLevel,
    garbageCollect: jsb.garbageCollect,
    restartVM: __restartVM,
    isObjectValid: __isObjectValid,
    
    openURL (url) {
        jsb.openURL(url);
    },

    getSafeAreaRect () {
        // x(top), y(left), z(bottom), w(right)
        var edge = jsb.Device.getSafeAreaEdge();
        var screenSize = cc.view.getFrameSize();
    
        // Get leftBottom and rightTop point in UI coordinates
        var leftBottom = new cc.Vec2(edge.y, screenSize.height - edge.z);
        var rightTop = new cc.Vec2(screenSize.width - edge.w, edge.x);
    
        // Returns the real location in view.
        var relatedPos = {left: 0, top: 0, width: screenSize.width, height: screenSize.height};
        cc.view.convertToLocationInView(leftBottom.x, leftBottom.y, relatedPos, leftBottom);
        cc.view.convertToLocationInView(rightTop.x, rightTop.y, relatedPos, rightTop);
        // convert view point to design resolution size
        cc.view._convertPointWithScale(leftBottom);
        cc.view._convertPointWithScale(rightTop);
    
        return cc.rect(leftBottom.x, leftBottom.y, rightTop.x - leftBottom.x, rightTop.y - leftBottom.y);
    },
});
