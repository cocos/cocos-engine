import enums from './enums';
import { Vec2, Vec3, Vec4, Color, Mat4 } from '../core/value-types';
import { vec2, vec3, vec4, color4, mat2, mat3, mat4 } from '../core/vmath';
import Texture2D from '../core/assets/CCTexture2D';

let gfxTexture2D = null, gfxTextureCube = null;
if (CC_JSB && CC_NATIVERENDERER) {
    gfxTexture2D = gfx.Texture2D;
} else {
    gfxTexture2D = require('./gfx/texture-2d');
    gfxTextureCube = require('./gfx/texture-cube');
}

const CCObject = cc.Object;

export let ctor2default = {
    [Number]: v => v || 0,
    [Boolean]: v => v || false,
    [Vec2]: v => v ? cc.v2(v[0], v[1]) : cc.v2(),
    [Vec3]: v => v ? cc.v3(v[0], v[1], v[2]) : cc.v3(),
    [Vec4]: v => v ? cc.v4(v[0], v[1], v[2], v[3]) : cc.v4(),
    [Color]: v => v ? cc.color(v[0] * 255, v[1] * 255, v[2] * 255,
        (v[3] || 1) * 255) : cc.color(),
    [Mat4]: v => v ? cc.mat4(
            v[0],  v[1],  v[2],  v[3],
            v[4],  v[5],  v[6],  v[7],
            v[8],  v[9],  v[10], v[11],
            v[12], v[13], v[14], v[15],
        ) : cc.mat4(),
    [Texture2D]: () => null,
    // [TextureCube]: () => null,
    [CCObject]: () => null
};


export let enums2ctor = {
    [enums.PARAM_INT]: Number,
    [enums.PARAM_INT2]: Vec2,
    [enums.PARAM_INT3]: Vec3,
    [enums.PARAM_INT4]: Vec4,
    [enums.PARAM_FLOAT]: Number,
    [enums.PARAM_FLOAT2]: Vec2,
    [enums.PARAM_FLOAT3]: Vec3,
    [enums.PARAM_FLOAT4]: Vec4,
    [enums.PARAM_COLOR3]: Color,
    [enums.PARAM_COLOR4]: Color,
    [enums.PARAM_MAT4]: Mat4,
    [enums.PARAM_TEXTURE_2D]: Texture2D,
    // [enums.PARAM_TEXTURE_CUBE]: TextureCube,
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
    // [TextureCube]: enums.PARAM_TEXTURE_CUBE,
    // [gfxTextureCube]: enums.PARAM_TEXTURE_CUBE,
};


export let className2TypeFunc = {
    'cc.Color': (out, val) => { return color4.array(out, val); },
    'cc.Vec2':  (out, val) => { return vec2.array(out, val); },
    'cc.Vec3':  (out, val) => { return vec3.array(out, val); },
    'cc.Vec4':  (out, val) => { return vec4.array(out, val); },
    'cc.Mat2':  (out, val) => { return mat2.array(out, val); },
    'cc.Mat3':  (out, val) => { return mat3.array(out, val); },
    'cc.Mat4':  (out, val) => { return mat4.array(out, val); },
    'cc.Texture2D': (out, val) => { return val.getImpl(); },
    'cc.RenderTexture': (out, val) => { return val.getImpl(); }
};


export let getInstanceType = function(t) { 
    return enums2ctor[t] || enums2ctor.default; 
};
export let cloneObjArray = function(val) { 
    return val.map(obj => Object.assign({}, obj)); 
};
export let getInstanceCtor = function(t) { 
    return ctor2default[getInstanceType(t)]; 
};
