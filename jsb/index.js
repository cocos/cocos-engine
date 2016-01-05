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
    var result = /Cocos2d\-JS\sv([\.\d]+)/.exec(cc.ENGINE_VERSION);
    if (result && result[1]) {
        return parseFloat(result[1]);
    }
    else {
        return null;
    }
})();

// Version polyfills
if (_engineNumberVersion) {
    if (_engineNumberVersion < 3.9) {
        require('./versions/jsb-polyfill-v3.8');
    }
}