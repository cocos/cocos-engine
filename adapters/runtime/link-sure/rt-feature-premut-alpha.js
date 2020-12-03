'use strict';

// Please go to :
// https://github.com/cocos-creator-packages/jsb-adapter/pull/130
// to see more information about function clamp and unpremutAlpha
let _clamp = function (value) {
    value = Math.round(value);
    return value < 0 ? 0 : value < 255 ? value : 255;
};

// Because the blend factor is modified to SRC_ALPHA, here must perform unpremult alpha.
let _premultAlpha = function(data, premult) {
    let alpha;
    if (premult) {
        for (let i = 0, len = data._data.length; i < len; i += 4) {
            alpha = data._data[i + 3] / 255;
            if (alpha > 0 && alpha < 255) {
                data._data[i + 0] = clamp(data._data[i + 0] * alpha);
                data._data[i + 1] = clamp(data._data[i + 1] * alpha);
                data._data[i + 2] = clamp(data._data[i + 2] * alpha);
            }
        }
    } else {
        for (let i = 0, len = data._data.length; i < len; i += 4) {
            alpha = 255 / data._data[i + 3];
            if (alpha > 0 && alpha < 255) {
                data._data[i + 0] = _clamp(data._data[i + 0] * alpha);
                data._data[i + 1] = _clamp(data._data[i + 1] * alpha);
                data._data[i + 2] = _clamp(data._data[i + 2] * alpha);
            }
        }
    }
}

do {
    let rt = window.wuji;
    if (typeof rt != "object") {
        console.error("not quick game platform");
        break;
    }
    if (typeof cc !== "object") {
        console.error("can not get cocos creator version");
        break;
    }
    // Judge version，is newer than 2.0.9
    let versionJudge = "2.0.9";
    let engineVersion = cc.ENGINE_VERSION;
    let versionJudgeNum = versionJudge.replace(/[a-zA-Z]/g, (match, i) => match.charCodeAt()).replace(/[^\d]/g, '') - 0;
    let engineVersionNum = engineVersion.replace(/[a-zA-Z]/g, (match, i) => match.charCodeAt()).replace(/[^\d]/g, '') - 0;
    let isEngineVersionNew = (engineVersionNum >= versionJudgeNum);
    let isRTSupportFeature = ((typeof rt.getFeature == "function") && (typeof rt.setFeature === "function"));
    let featureName = "canvas.context2d.premultiply_image_data";

    let shouldPremult = false;
    if (!isEngineVersionNew && !isRTSupportFeature) {
        // old creator old runtime
        break;
    }
    if (!isEngineVersionNew) {
        shouldPremult = true;
    }
    if (isRTSupportFeature) {
        rt.setFeature(featureName, shouldPremult);
        if (rt.getFeature(featureName) === shouldPremult) {
            break;
        }
    }
    // set feature fail
    let dataDescriptor = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, "_data");
    let dataGetter;
    // get old getter
    if (typeof dataDescriptor === "object") {
        dataGetter = dataDescriptor["get"];
    }
    // delete old runtime version _data property
    delete HTMLCanvasElement.prototype._data;
    let _newDataGetter = function () {
        let data;
        if (typeof dataGetter === "function") {
            data = dataGetter.bind(this)();
        } else {
            // old runtime version
            data = this._dataInner;
        }
        if (data === null) {
            return null;
        }
        let premultHandled = data["_premultHandled"];
        if (premultHandled === true) {
            return data;
        }
        _premultAlpha(data, shouldPremult);
        data["_premultHandled"] = true;
        return data;
    }
    Object.defineProperty(HTMLCanvasElement.prototype, "_data", {
        get: _newDataGetter,
        set: function (params) {
            this._dataInner = params;
        }
    });
} while (false);