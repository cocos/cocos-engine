const systemInfo = require('../common/engine3d/globalAdapter/BaseSystemInfo');
let _env = null;
let adaptSysFunc = systemInfo.adaptSys;

Object.assign(systemInfo, {
    // Overrider init interface
    init (cb) {
        if (swan.getOpenDataContext) {
            _env = __globalAdapter.getSystemInfoSync();
            swan.getOpenDataContext().postMessage({
                fromAdapter: true,
                event: 'main-context-info',
                sysInfo: _env,
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
                devicePixelRatio: window.devicePixelRatio,
            });
            cb && cb();
        }
        else {
            swan.onMessage(function (data) {
                if (data.fromAdapter) {
                    if (data.event === 'main-context-info') {
                        _env = data.sysInfo;
                        Object.defineProperty(window, 'innerWidth', {
                            enumerable: true,
                            get () {
                                return data.innerWidth;
                            },
                        });
                        Object.defineProperty(window, 'innerHeight', {
                            enumerable: true,
                            get () {
                                return data.innerHeight;
                            },
                        });
                        Object.defineProperty(window, 'devicePixelRatio', {
                            enumerable: true,
                            get () {
                                return data.devicePixelRatio;
                            },
                        });

                        cb && cb();
                    }
                }
            });
        }
    },

    // Extend adaptSys interface
    adaptSys (sys) {
        adaptSysFunc.call(this, sys, _env);
        sys.platform = sys.BAIDU_MINI_GAME;
    }
});

__globalAdapter.init = systemInfo.init;
__globalAdapter.adaptSys = systemInfo.adaptSys;