let box2d = require('../../../external/box2d/box2d');

let sys = cc.sys;
if (sys.platform === sys.TAOBAO_MINIGAME) {
    //b2 exist at TAOBAO_MINIGAME platform.
    window.b2 = b2 ? b2 : {};
} else {
    window.b2 = {};
}

for (var key in box2d) {
    if (key.indexOf('b2_') !== -1) {
        continue;
    }
    let newKey = key.replace('b2', '');
    b2[newKey] = box2d[key];
}

b2.maxPolygonVertices = 8;
