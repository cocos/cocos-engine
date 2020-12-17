Object.assign(cc.sys, {
    __init () {
        let env = __globalAdapter.getSystemInfoSync();
        this.isNative = false;
        this.isBrowser = false;
        this.isMobile = true;
        this.language = env.language.substr(0, 2);
        this.languageCode = env.language.toLowerCase();
        var system = env.system.toLowerCase();
        var platform = env.platform.toLowerCase();

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

        var w = env.windowWidth;
        var h = env.windowHeight;
        var ratio = env.pixelRatio || 1;
        this.windowPixelResolution = {
            width: ratio * w,
            height: ratio * h
        };

        this.localStorage = window.localStorage;

        var _supportWebGL = __globalAdapter.isSubContext ? false : true;
        var _supportWebp = false;
        try {
            var _canvas = document.createElement("canvas");
            _supportWebp = _canvas.toDataURL('image/webp').startsWith('data:image/webp');
        }
        catch (err) { }

        this.capabilities = {
            "canvas": true,
            "opengl": !!_supportWebGL,
            "webp": _supportWebp
        };
        this.__audioSupport = {
            ONLY_ONE: false,
            WEB_AUDIO: false,
            DELAY_CREATE_CTX: false,
            format: ['.mp3']
        };
    },
});