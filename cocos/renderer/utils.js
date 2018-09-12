// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import gfx from '../gfx';
import enums from './enums';
import InputAssembler from './core/input-assembler';
import Pass from './core/pass';
import Technique from './core/technique';
import Effect from './core/effect';

const _stageMap = {
  opaque: enums.STAGE_OPAQUE,
  transparent: enums.STAGE_TRANSPARENT,
  shadowcast: enums.STAGE_SHADOWCAST
};

const _paramTypeMap = {
  int: enums.PARAM_INT,
  int2: enums.PARAM_INT2,
  int3: enums.PARAM_INT3,
  int4: enums.PARAM_INT4,
  float: enums.PARAM_FLOAT,
  float2: enums.PARAM_FLOAT2,
  float3: enums.PARAM_FLOAT3,
  float4: enums.PARAM_FLOAT4,
  color3: enums.PARAM_COLOR3,
  color4: enums.PARAM_COLOR4,
  mat2: enums.PARAM_MAT2,
  mat3: enums.PARAM_MAT3,
  mat4: enums.PARAM_MAT4,
  tex2d: enums.PARAM_TEXTURE_2D,
  texcube: enums.PARAM_TEXTURE_CUBE
};

const _cullMap = {
  none: gfx.CULL_NONE,
  front: gfx.CULL_FRONT,
  back: gfx.CULL_BACK,
  front_and_back: gfx.CULL_FRONT_AND_BACK
};

const _blendFuncMap = {
  add: gfx.BLEND_FUNC_ADD,
  sub: gfx.BLEND_FUNC_SUBTRACT,
  reverse_sub: gfx.BLEND_FUNC_REVERSE_SUBTRACT
};

const _blendFactorMap = {
  zero: gfx.BLEND_ZERO,
  one: gfx.BLEND_ONE,
  src_color: gfx.BLEND_SRC_COLOR,
  one_minus_src_color: gfx.BLEND_ONE_MINUS_SRC_COLOR,
  dst_color: gfx.BLEND_DST_COLOR,
  one_minus_dst_color: gfx.BLEND_ONE_MINUS_DST_COLOR,
  src_alpha: gfx.BLEND_SRC_ALPHA,
  one_minus_src_alpha: gfx.BLEND_ONE_MINUS_SRC_ALPHA,
  dst_alpha: gfx.BLEND_DST_ALPHA,
  one_minus_dst_alpha: gfx.BLEND_ONE_MINUS_DST_ALPHA,
  constant_color: gfx.BLEND_CONSTANT_COLOR,
  one_minus_constant_color: gfx.BLEND_ONE_MINUS_CONSTANT_COLOR,
  constant_alpha: gfx.BLEND_CONSTANT_ALPHA,
  one_minus_constant_alpha: gfx.BLEND_ONE_MINUS_CONSTANT_ALPHA,
  src_alpha_saturate: gfx.BLEND_SRC_ALPHA_SATURATE
};

const _dsFuncMap = {
  never: gfx.DS_FUNC_NEVER,
  less: gfx.DS_FUNC_LESS,
  equal: gfx.DS_FUNC_EQUAL,
  lequal: gfx.DS_FUNC_LEQUAL,
  greater: gfx.DS_FUNC_GREATER,
  notequal: gfx.DS_FUNC_NOTEQUAL,
  gequal: gfx.DS_FUNC_GEQUAL,
  always: gfx.DS_FUNC_ALWAYS
};

const _stencilOpMap = {
  keep: gfx.STENCIL_OP_KEEP,
  zero: gfx.STENCIL_OP_ZERO,
  replace: gfx.STENCIL_OP_REPLACE,
  incr: gfx.STENCIL_OP_INCR,
  incr_wrap: gfx.STENCIL_OP_INCR_WRAP,
  decr: gfx.STENCIL_OP_DECR,
  decr_wrap: gfx.STENCIL_OP_DECR_WRAP,
  inver: gfx.STENCIL_OP_INVERT
};

// blend packing 'func src dst'
function _parseBlend(data, callback) {
  let words = data.split(' ');
  callback(
    _blendFuncMap[words[0]],
    _blendFactorMap[words[1]],
    _blendFactorMap[words[2]]
  );
}

// stencil packing 'func ref mask failOP zfailOp passOp writeMask'
function _parseStencil(data, callback) {
  let words = data.split(' ');
  callback(
    _dsFuncMap[words[0]],
    parseInt(words[1]),
    parseInt(words[2]),
    _stencilOpMap[words[3]],
    _stencilOpMap[words[4]],
    _stencilOpMap[words[5]],
    parseInt(words[6])
  );
}

/**
 * @param {object} json
 */
export function parseEffect(json) {
  let techniques = [];

  json.techniques.forEach(techInfo => {
    // construct passes
    let passes = [];
    techInfo.passes.forEach(passInfo => {
      let pass = new Pass(passInfo.program);

      // blend
      if (passInfo.blend) {
        pass._blend = true;

        _parseBlend(passInfo.blend, (func, src, dst) => {
          pass._blendEq = func;
          pass._blendSrc = src;
          pass._blendDst = dst;
        });

        if (passInfo.blendAlpha) {
          _parseBlend(passInfo.blendAlpha, (func, src, dst) => {
            pass._blendAlphaEq = func;
            pass._blendSrcAlpha = src;
            pass._blendDstAlpha = dst;
          });
        } else {
          pass._blendAlphaEq = pass._blendEq;
          pass._blendSrcAlpha = pass._blendSrc;
          pass._blendDstAlpha = pass._blendDst;
        }

        if (passInfo.blendColor) {
          pass._blendColor = (
            (passInfo.blendColor[0] * 255) << 24 |
            (passInfo.blendColor[1] * 255) << 16 |
            (passInfo.blendColor[2] * 255) << 8 |
            passInfo.blendColor[3] * 255
          ) >>> 0;
        }
      }

      // cull
      if (passInfo.cull) {
        pass._cullMode = _cullMap[passInfo.cull];
      }

      // depth-test
      if (passInfo.depthTest) {
        pass._depthTest = true,
        pass._depthFunc = _dsFuncMap[passInfo.depthTest];
      }

      // depth-write
      if (passInfo.depthWrite) {
        pass._depthWrite = passInfo.depthWrite;
      }

      // stencil
      if (passInfo.stencil) {
        pass._stencilTest = true;

        // "func ref mask failOp zFailOp zPassOp writeMask"
        _parseStencil(passInfo.stencil, (func, ref, mask, failOp, zFailOp, zPassOp, writeMask) => {
          pass._stencilFuncFront = func;
          pass._stencilRefFront = func;
          pass._stencilMaskFront = mask;
          pass._stencilFailOpFront = failOp;
          pass._stencilZFailOpFront = zFailOp;
          pass._stencilZPassOpFront = zPassOp;
          pass._stencilWriteMaskFront = writeMask;
        });

        if (passInfo.stencilBack) {
          _parseStencil(passInfo.stencilBack, (func, ref, mask, failOp, zFailOp, zPassOp, writeMask) => {
            pass._stencilFuncBack = func;
            pass._stencilRefBack = func;
            pass._stencilMaskBack = mask;
            pass._stencilFailOpBack = failOp;
            pass._stencilZFailOpBack = zFailOp;
            pass._stencilZPassOpBack = zPassOp;
            pass._stencilWriteMaskBack = writeMask;
          });
        } else {
          pass._stencilFuncBack = pass._stencilFuncFront;
          pass._stencilRefBack = pass._stencilRefFront;
          pass._stencilMaskBack = pass._stencilMaskFront;
          pass._stencilFailOpBack = pass._stencilFailOpFront;
          pass._stencilZFailOpBack = pass._stencilZFailOpFront;
          pass._stencilZPassOpBack = pass._stencilZPassOpFront;
          pass._stencilWriteMaskBack = pass._stencilWriteMaskFront;
        }
      }
      passes.push(pass);
    });

    let stage = 0;
    techInfo.stages.split(' ').forEach(stageInfo => {
      stage = stage | _stageMap[stageInfo];
    });

    let params = [];
    for (let paramKey in techInfo.parameters) {
      params.push({
        name: paramKey,
        type: _paramTypeMap[techInfo.parameters[paramKey].type],
        size: techInfo.parameters.size
      });
    }

    let tech = new Technique(
      stage,
      params,
      passes
    );
    techniques.push(tech);
  });

  return new Effect(techniques);
}

/**
 * @param {gfx.Device} device
 * @param {Object} data
 */
export function createIA(device, data) {
  if (!data.positions) {
    console.error('The data must have positions field');
    return null;
  }

  let verts = [];
  let vcount = data.positions.length / 3;

  for (let i = 0; i < vcount; ++i) {
    verts.push(data.positions[3 * i], data.positions[3 * i + 1], data.positions[3 * i + 2]);

    if (data.normals) {
      verts.push(data.normals[3 * i], data.normals[3 * i + 1], data.normals[3 * i + 2]);
    }

    if (data.uvs) {
      verts.push(data.uvs[2 * i], data.uvs[2 * i + 1]);
    }
  }

  let vfmt = [];
  vfmt.push({ name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 });
  if (data.normals) {
    vfmt.push({ name: gfx.ATTR_NORMAL, type: gfx.ATTR_TYPE_FLOAT32, num: 3 });
  }
  if (data.uvs) {
    vfmt.push({ name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 });
  }

  let vb = new gfx.VertexBuffer(
    device,
    new gfx.VertexFormat(vfmt),
    gfx.USAGE_STATIC,
    new Float32Array(verts),
    vcount
  );

  let ib = null;
  if (data.indices) {
    ib = new gfx.IndexBuffer(
      device,
      gfx.INDEX_FMT_UINT16,
      gfx.USAGE_STATIC,
      new Uint16Array(data.indices),
      data.indices.length
    );
  }

  return new InputAssembler(vb, ib, data.primitiveType);
}