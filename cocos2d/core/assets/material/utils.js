// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  

import enums from '../../../renderer/enums';

// function genHashCode (str) {
//     var hash = 0;
//     if (str.length == 0) {
//         return hash;
//     }
//     for (var i = 0; i < str.length; i++) {
//         var char = str.charCodeAt(i);
//         hash = ((hash<<5)-hash)+char;
//         hash = hash & hash; // Convert to 32bit integer
//     }
//     return hash;
// }

function serializeDefines (defines) {
    let str = '';
    for (let name in defines) {
        str += name + defines[name];
    }
    return str;
}

function serializePass (pass, excludeProperties) {
    let str = pass._programName + pass._cullMode;
    if (pass._blend) {
        str += pass._blendEq + pass._blendAlphaEq + pass._blendSrc + pass._blendDst
            + pass._blendSrcAlpha + pass._blendDstAlpha + pass._blendColor;
    }
    if (pass._depthTest) {
        str += pass._depthWrite + pass._depthFunc;
    }
    if (pass._stencilTest) {
        str += pass._stencilFuncFront + pass._stencilRefFront + pass._stencilMaskFront
            + pass._stencilFailOpFront + pass._stencilZFailOpFront + pass._stencilZPassOpFront
            + pass._stencilWriteMaskFront
            + pass._stencilFuncBack + pass._stencilRefBack + pass._stencilMaskBack
            + pass._stencilFailOpBack + pass._stencilZFailOpBack + pass._stencilZPassOpBack
            + pass._stencilWriteMaskBack;
    }

    if (!excludeProperties) {
        str += serializeUniforms(pass._properties);
    }
    str += serializeDefines(pass._defines);

    return str;
}

function serializePasses (passes) {
    let hashData = '';
    for (let i = 0; i < passes.length; i++) {
        hashData += serializePass(passes[i]);
    }
    return hashData;
}

function serializeUniforms (uniforms) {
    let hashData = '';
    for (let name in uniforms) {
        let param = uniforms[name];
        let prop = param.value;

        if (!prop) {
            continue;
        }

        if (param.type === enums.PARAM_TEXTURE_2D || param.type === enums.PARAM_TEXTURE_CUBE) {
            hashData += prop._id + ';';
        }
        else {
            hashData += prop.toString() + ';';
        }
    }

    return hashData;
}

export default {
    serializeDefines,
    serializePasses,
    serializeUniforms
};