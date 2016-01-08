'use strict';

require('./jsb-predefine');
require('./jsb-game');
require('./jsb-director');
require('./jsb-tex-sprite-frame');
require('./jsb-label');
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
        if (_engineNumberVersion.minor < 9) {
            require('./versions/jsb-polyfill-v3.8');
        }
        if (_engineNumberVersion.minor < 10) {
            require('./versions/jsb-polyfill-v3.9');
        }
    }
}