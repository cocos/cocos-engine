let systemInfo = {
    init (cb) {
        cb && cb();
    },

    adaptSys (sys, env) {
        if (!env) {
            env = __globalAdapter.getSystemInfoSync();
        }
        sys.isNative = false;
        sys.isBrowser = false;
        sys.isMobile = true;
        sys.language = env.language.substr(0, 2);
        sys.languageCode = env.language.toLowerCase();
        var system = env.system.toLowerCase();
        var platform = env.platform.toLowerCase();

        if (platform === "android") {
            sys.os = sys.OS_ANDROID;
        }
        else if (platform === "ios") {
            sys.os = sys.OS_IOS;
        }

        // Adaptation to Android P
        if (system === 'android p') {
            system = 'android p 9.0';
        }

        var version = /[\d\.]+/.exec(system);
        sys.osVersion = version ? version[0] : system;
        sys.osMainVersion = parseInt(sys.osVersion);

        sys.browserType = null;
        sys.browserVersion = null;

        var w = env.windowWidth;
        var h = env.windowHeight;
        var ratio = env.pixelRatio || 1;
        sys.windowPixelResolution = {
            width: ratio * w,
            height: ratio * h
        };

        sys.localStorage = window.localStorage;

        var _supportWebGL = __globalAdapter.isSubContext ? false : true;
        var _supportWebp = false;
        try {
            var _canvas = document.createElement("canvas");
            _supportWebp = _canvas.toDataURL('image/webp').startsWith('data:image/webp');
        }
        catch (err) { }

        sys.capabilities = {
            "canvas": true,
            "opengl": !!_supportWebGL,
            "webp": _supportWebp
        };
        sys.__audioSupport = {
            ONLY_ONE: false,
            WEB_AUDIO: false,
            DELAY_CREATE_CTX: false,
            format: ['.mp3']
        };
    },
};

module.exports = systemInfo;