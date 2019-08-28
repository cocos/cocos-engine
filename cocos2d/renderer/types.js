import enums from './enums';
import { Vec2, Vec3, Vec4, Color, Mat4 } from '../core/value-types';
import Texture2D from '../core/assets/CCTexture2D';

let gfxTexture2D = null, gfxTextureCube = null;
if (CC_JSB && CC_NATIVERENDERER) {
    gfxTexture2D = gfx.Texture2D;
} else {
    gfxTexture2D = require('./gfx/texture-2d');
}

const CCObject = cc.Object;

let ctor2default = {
    [Boolean]: v => v || false,
    [Number]: v => v ? (ArrayBuffer.isView(v) ? v[0] : v) : 0,
    [Vec2]: v => v ? cc.v2(v[0], v[1]) : cc.v2(),
    [Vec3]: v => v ? cc.v3(v[0], v[1], v[2]) : cc.v3(),
    [Vec4]: v => v ? cc.v4(v[0], v[1], v[2], v[3]) : cc.v4(),
    [Color]: v => v ? cc.color(v[0] * 255, v[1] * 255, v[2] * 255,
        (v[3] || 1) * 255) : cc.color(),
    [Mat4]: v => v ? cc.mat4(
        v[0], v[1], v[2], v[3],
        v[4], v[5], v[6], v[7],
        v[8], v[9], v[10], v[11],
        v[12], v[13], v[14], v[15],
    ) : cc.mat4(),
    [Texture2D]: () => null,
    [CCObject]: () => null
};


let enums2ctor = {
    [enums.PARAM_INT]: Number,
    [enums.PARAM_INT2]: Vec2,
    [enums.PARAM_INT3]: Vec3,
    [enums.PARAM_INT4]: Vec4,
    [enums.PARAM_FLOAT]: Number,
    [enums.PARAM_FLOAT2]: Vec2,
    [enums.PARAM_FLOAT3]: Vec3,
    [enums.PARAM_FLOAT4]: Vec4,
    [enums.PARAM_MAT4]: Mat4,
    [enums.PARAM_TEXTURE_2D]: Texture2D,
    
    color: Color,
    number: Number,
    boolean: Boolean,
    default: CCObject
};

export let ctor2enums = {
    [Number]: enums.PARAM_FLOAT,
    [Vec2]: enums.PARAM_FLOAT2,
    [Vec3]: enums.PARAM_FLOAT3,
    [Vec4]: enums.PARAM_FLOAT4,
    [Color]: enums.PARAM_COLOR3,
    [Color]: enums.PARAM_COLOR4,
    [Mat4]: enums.PARAM_MAT4,
    [Texture2D]: enums.PARAM_TEXTURE_2D,
    [gfxTexture2D]: enums.PARAM_TEXTURE_2D,
};

export let enums2default = {
    [enums.PARAM_INT]: new Uint32Array([0]),
    [enums.PARAM_INT2]: new Uint32Array([0, 0]),
    [enums.PARAM_INT3]: new Uint32Array([0, 0, 0]),
    [enums.PARAM_INT4]: new Uint32Array([0, 0, 0, 0]),
    [enums.PARAM_FLOAT]: new Float32Array([0]),
    [enums.PARAM_FLOAT2]: new Float32Array([0, 0]),
    [enums.PARAM_FLOAT3]: new Float32Array([0, 0, 0]),
    [enums.PARAM_FLOAT4]: new Float32Array([0, 0, 0, 0]),
    [enums.PARAM_MAT4]: cc.mat4().m,
    [enums.PARAM_TEXTURE_2D]: null,
    
    number: 0,
    boolean: false,
}

export let getInstanceType = function (t) {
    return enums2ctor[t] || enums2ctor.default;
};
export let getInstanceCtor = function (t) {
    return ctor2default[getInstanceType(t)];
};
export let getClassName = function (t) {
    return cc.js.getClassName(getInstanceType(t));
};

let className2InspectorName = {
    Number: 'number',
    Boolean: 'boolean'
};
export function getInspectorProps (prop) {
    let inspector = {
        type: prop.type
    };

    Object.assign(inspector, prop.inspector);
    
    inspector.defines = prop.defines;
    inspector.value = getInstanceCtor(inspector.type)(prop.value);

    let className = getClassName(inspector.type);
    inspector.typeName = className2InspectorName[className] || className;

    if (inspector.typeName == 'cc.Texture2D') {
        inspector.typeName = 'cc.Asset';
        inspector.assetType = 'cc.Texture2D';
    }

    return inspector;
};