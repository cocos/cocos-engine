'use strict';

// cc.initEngine
cc.initEngine = function (config, cb) {
    require('script/jsb.js');
    cc._renderType = cc.game.RENDER_TYPE_OPENGL;
    cc._initDebugSetting(config[cc.game.CONFIG_KEY.debugMode]);
    cc._engineLoaded = true;
    cc.log(cc.ENGINE_VERSION);
    if (cb) cb();
};

require('./jsb-predefine');
require('./jsb-game');
require('./jsb-director');
require('./jsb-tex-sprite-frame');
require('./jsb-scale9sprite');
require('./jsb-label');
require('./jsb-editbox');
require('./jsb-particle');
require('./jsb-enums');
require('./jsb-event');
require('./jsb-etc');

// Check version
var _engineNumberVersion = (function () {
    var result = /Cocos2d\-JS\sv([\d]+)\.([\d]+)/.exec(cc.ENGINE_VERSION);
    if (result && result[1]) {
        return {
            major: parseInt(result[1]),
            minor: parseInt(result[2])
        };
    }
    else {
        return null;
    }
})();

// Version polyfills
if (_engineNumberVersion) {
    if (_engineNumberVersion.major === 3) {
        if (_engineNumberVersion.minor < 6) {
            require('./versions/jsb-polyfill-v3.5');
        }
        if (_engineNumberVersion.minor < 9) {
            require('./versions/jsb-polyfill-v3.8');
        }
        if (_engineNumberVersion.minor < 10) {
            require('./versions/jsb-polyfill-v3.9');
        }
    }
}

// var originLog = console.log;
var log = function () {
    console.log.call(console, cc.formatStr.apply(null, arguments));
};

cc.log   = log;
cc.error = log;
cc.warn  = log;
cc.info  = log;
