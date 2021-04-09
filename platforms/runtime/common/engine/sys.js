Object.assign(cc.sys, {
    __init() {
        this.isNative = false;
        this.isBrowser = false;
        this.isMobile = true;

        let sysInfo = ral.getSystemInfoSync();
        // TODO: remove __getCurrentLanguage call
        let language = sysInfo.language || (__getCurrentLanguage && __getCurrentLanguage());
        this.language = language.substr(0, 2);
        this.languageCode = language.toLowerCase();
        var system = sysInfo.system.toLowerCase();
        var platform = sysInfo.platform.toLowerCase();

        if (platform === "android") {
            this.os = this.OS_ANDROID;
        }
        else if (platform === "ios") {
            this.os = this.OS_IOS;
        }

        // Adaptation to Android P
        if (system === 'android p') {
            system = 'android p 9.0';
        }

        var version = /[\d\.]+/.exec(system);
        this.osVersion = version ? version[0] : system;
        this.osMainVersion = parseInt(this.osVersion);

        this.browserType = null;
        this.browserVersion = null;

        var w = sysInfo.screenWidth;
        var h = sysInfo.screenHeight;
        var ratio = sysInfo.pixelRatio || 1;
        this.windowPixelResolution = {
            width: ratio * w,
            height: ratio * h
        };

        this.localStorage = window.localStorage;

        var _supportWebp = false;
        try {
            var _canvas = document.createElement("canvas");
            _supportWebp = _canvas.toDataURL('image/webp').startsWith('data:image/webp');
        }
        catch (err) { }

        this.capabilities = {
            canvas: true,
            opengl: true,
            webp: _supportWebp,
            imageBitmap: false,
            touches: true,
            mouse: false,
            keyboard: false,
            accelerometer: true,
        };
        this.__audioSupport = {
            ONLY_ONE: false,
            WEB_AUDIO: false,
            DELAY_CREATE_CTX: false,
            format: ['.mp3']
        };
    },

    openURL(url) {
        console.warn("unspport openURL");
    },

    getBatteryLevel() {
        const batteryInfo = ral.getBatteryInfoSync();
        return batteryInfo && batteryInfo.level;
    },
});