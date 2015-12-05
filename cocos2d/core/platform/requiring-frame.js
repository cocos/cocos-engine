var requiringFrames = [];  // the requiring frame infos

cc._RFpush = function (module, uuid, script) {
    if (arguments.length === 2) {
        script = uuid;
        uuid = '';
    }
    requiringFrames.push({
        uuid: uuid,
        script: script,
        module: module,
        exports: module.exports,    // original exports
        beh: null
    });
};

cc._RFpop = function () {
    var frameInfo = requiringFrames.pop();
    // check exports
    var module = frameInfo.module;
    var exports = module.exports;
    if (exports === frameInfo.exports) {
        for (var anyKey in exports) {
            // exported
            return;
        }
        // auto export component
        module.exports = exports = frameInfo.beh;
    }
};

cc._RFpeek = function () {
    return requiringFrames[requiringFrames.length - 1];
};

if (CC_EDITOR) {
    cc._RFreset = function () {
        requiringFrames = [];
    };
}
