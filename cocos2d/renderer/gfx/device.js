import State from './state';
import { enums } from './enums';

import Texture2D from './texture-2d';
import TextureCube from './texture-cube';

const GL_INT = 5124;
const GL_FLOAT = 5126;
const GL_FLOAT_VEC2 = 35664;
const GL_FLOAT_VEC3 = 35665;
const GL_FLOAT_VEC4 = 35666;
const GL_INT_VEC2 = 35667;
const GL_INT_VEC3 = 35668;
const GL_INT_VEC4 = 35669;
const GL_BOOL = 35670;
const GL_BOOL_VEC2 = 35671;
const GL_BOOL_VEC3 = 35672;
const GL_BOOL_VEC4 = 35673;
const GL_FLOAT_MAT2 = 35674;
const GL_FLOAT_MAT3 = 35675;
const GL_FLOAT_MAT4 = 35676;
const GL_SAMPLER_2D = 35678;
const GL_SAMPLER_CUBE = 35680;

/**
 * _type2uniformCommit
 */
let _type2uniformCommit = {
  [GL_INT]: function (gl, id, value) {
    gl.uniform1i(id, value);
  },

  [GL_FLOAT]: function (gl, id, value) {
    gl.uniform1f(id, value);
  },

  [GL_FLOAT_VEC2]: function (gl, id, value) {
    gl.uniform2fv(id, value);
  },

  [GL_FLOAT_VEC3]: function (gl, id, value) {
    gl.uniform3fv(id, value);
  },

  [GL_FLOAT_VEC4]: function (gl, id, value) {
    gl.uniform4fv(id, value);
  },

  [GL_INT_VEC2]: function (gl, id, value) {
    gl.uniform2iv(id, value);
  },

  [GL_INT_VEC3]: function (gl, id, value) {
    gl.uniform3iv(id, value);
  },

  [GL_INT_VEC4]: function (gl, id, value) {
    gl.uniform4iv(id, value);
  },

  [GL_BOOL]: function (gl, id, value) {
    gl.uniform1i(id, value);
  },

  [GL_BOOL_VEC2]: function (gl, id, value) {
    gl.uniform2iv(id, value);
  },

  [GL_BOOL_VEC3]: function (gl, id, value) {
    gl.uniform3iv(id, value);
  },

  [GL_BOOL_VEC4]: function (gl, id, value) {
    gl.uniform4iv(id, value);
  },

  [GL_FLOAT_MAT2]: function (gl, id, value) {
    gl.uniformMatrix2fv(id, false, value);
  },

  [GL_FLOAT_MAT3]: function (gl, id, value) {
    gl.uniformMatrix3fv(id, false, value);
  },

  [GL_FLOAT_MAT4]: function (gl, id, value) {
    gl.uniformMatrix4fv(id, false, value);
  },

  [GL_SAMPLER_2D]: function (gl, id, value) {
    gl.uniform1i(id, value);
  },

  [GL_SAMPLER_CUBE]: function (gl, id, value) {
    gl.uniform1i(id, value);
  },
};

/**
 * _type2uniformArrayCommit
 */
let _type2uniformArrayCommit = {
  [GL_INT]: function (gl, id, value) {
    gl.uniform1iv(id, value);
  },

  [GL_FLOAT]: function (gl, id, value) {
    gl.uniform1fv(id, value);
  },

  [GL_FLOAT_VEC2]: function (gl, id, value) {
    gl.uniform2fv(id, value);
  },

  [GL_FLOAT_VEC3]: function (gl, id, value) {
    gl.uniform3fv(id, value);
  },

  [GL_FLOAT_VEC4]: function (gl, id, value) {
    gl.uniform4fv(id, value);
  },

  [GL_INT_VEC2]: function (gl, id, value) {
    gl.uniform2iv(id, value);
  },

  [GL_INT_VEC3]: function (gl, id, value) {
    gl.uniform3iv(id, value);
  },

  [GL_INT_VEC4]: function (gl, id, value) {
    gl.uniform4iv(id, value);
  },

  [GL_BOOL]: function (gl, id, value) {
    gl.uniform1iv(id, value);
  },

  [GL_BOOL_VEC2]: function (gl, id, value) {
    gl.uniform2iv(id, value);
  },

  [GL_BOOL_VEC3]: function (gl, id, value) {
    gl.uniform3iv(id, value);
  },

  [GL_BOOL_VEC4]: function (gl, id, value) {
    gl.uniform4iv(id, value);
  },

  [GL_FLOAT_MAT2]: function (gl, id, value) {
    gl.uniformMatrix2fv(id, false, value);
  },

  [GL_FLOAT_MAT3]: function (gl, id, value) {
    gl.uniformMatrix3fv(id, false, value);
  },

  [GL_FLOAT_MAT4]: function (gl, id, value) {
    gl.uniformMatrix4fv(id, false, value);
  },

  [GL_SAMPLER_2D]: function (gl, id, value) {
    gl.uniform1iv(id, value);
  },

  [GL_SAMPLER_CUBE]: function (gl, id, value) {
    gl.uniform1iv(id, value);
  },
};

/**
 * _commitBlendStates
 */
function _commitBlendStates(gl, cur, next) {
  // enable/disable blend
  if (cur.blend !== next.blend) {
    if (!next.blend) {
      gl.disable(gl.BLEND);
      return;
    }

    gl.enable(gl.BLEND);

    if (
      next.blendSrc === enums.BLEND_CONSTANT_COLOR ||
      next.blendSrc === enums.BLEND_ONE_MINUS_CONSTANT_COLOR ||
      next.blendDst === enums.BLEND_CONSTANT_COLOR ||
      next.blendDst === enums.BLEND_ONE_MINUS_CONSTANT_COLOR
    ) {
      gl.blendColor(
        (next.blendColor >> 24) / 255,
        (next.blendColor >> 16 & 0xff) / 255,
        (next.blendColor >> 8 & 0xff) / 255,
        (next.blendColor & 0xff) / 255
      );
    }

    if (next.blendSep) {
      gl.blendFuncSeparate(next.blendSrc, next.blendDst, next.blendSrcAlpha, next.blendDstAlpha);
      gl.blendEquationSeparate(next.blendEq, next.blendAlphaEq);
    } else {
      gl.blendFunc(next.blendSrc, next.blendDst);
      gl.blendEquation(next.blendEq);
    }

    return;
  }

  // nothing to update
  if (next.blend === false) {
    return;
  }

  // blend-color
  if (cur.blendColor !== next.blendColor) {
    gl.blendColor(
      (next.blendColor >> 24) / 255,
      (next.blendColor >> 16 & 0xff) / 255,
      (next.blendColor >> 8 & 0xff) / 255,
      (next.blendColor & 0xff) / 255
    );
  }

  // separate diff, reset all
  if (cur.blendSep !== next.blendSep) {
    if (next.blendSep) {
      gl.blendFuncSeparate(next.blendSrc, next.blendDst, next.blendSrcAlpha, next.blendDstAlpha);
      gl.blendEquationSeparate(next.blendEq, next.blendAlphaEq);
    } else {
      gl.blendFunc(next.blendSrc, next.blendDst);
      gl.blendEquation(next.blendEq);
    }

    return;
  }

  if (next.blendSep) {
    // blend-func-separate
    if (
      cur.blendSrc !== next.blendSrc ||
      cur.blendDst !== next.blendDst ||
      cur.blendSrcAlpha !== next.blendSrcAlpha ||
      cur.blendDstAlpha !== next.blendDstAlpha
    ) {
      gl.blendFuncSeparate(next.blendSrc, next.blendDst, next.blendSrcAlpha, next.blendDstAlpha);
    }

    // blend-equation-separate
    if (
      cur.blendEq !== next.blendEq ||
      cur.blendAlphaEq !== next.blendAlphaEq
    ) {
      gl.blendEquationSeparate(next.blendEq, next.blendAlphaEq);
    }
  } else {
    // blend-func
    if (
      cur.blendSrc !== next.blendSrc ||
      cur.blendDst !== next.blendDst
    ) {
      gl.blendFunc(next.blendSrc, next.blendDst);
    }

    // blend-equation
    if (cur.blendEq !== next.blendEq) {
      gl.blendEquation(next.blendEq);
    }
  }
}

/**
 * _commitDepthStates
 */
function _commitDepthStates(gl, cur, next) {
  // enable/disable depth-test
  if (cur.depthTest !== next.depthTest) {
    if (!next.depthTest) {
      gl.disable(gl.DEPTH_TEST);
      return;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(next.depthFunc);
    gl.depthMask(next.depthWrite);

    return;
  }

  // commit depth-write
  if (cur.depthWrite !== next.depthWrite) {
    gl.depthMask(next.depthWrite);
  }

  // check if depth-write enabled
  if (next.depthTest === false) {
    if (next.depthWrite) {
      next.depthTest = true;
      next.depthFunc = enums.DS_FUNC_ALWAYS;

      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(next.depthFunc);
    }

    return;
  }

  // depth-func
  if (cur.depthFunc !== next.depthFunc) {
    gl.depthFunc(next.depthFunc);
  }
}

/**
 * _commitStencilStates
 */
function _commitStencilStates(gl, cur, next) {
  // inherit stencil states
  if (next.stencilTest === enums.STENCIL_INHERIT) {
    return;
  }

  if (next.stencilTest !== cur.stencilTest) {
    if (next.stencilTest === enums.STENCIL_DISABLE) {
      gl.disable(gl.STENCIL_TEST);
      return;
    }

    gl.enable(gl.STENCIL_TEST);

    if (next.stencilSep) {
      gl.stencilFuncSeparate(gl.FRONT, next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
      gl.stencilMaskSeparate(gl.FRONT, next.stencilWriteMaskFront);
      gl.stencilOpSeparate(gl.FRONT, next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
      gl.stencilFuncSeparate(gl.BACK, next.stencilFuncBack, next.stencilRefBack, next.stencilMaskBack);
      gl.stencilMaskSeparate(gl.BACK, next.stencilWriteMaskBack);
      gl.stencilOpSeparate(gl.BACK, next.stencilFailOpBack, next.stencilZFailOpBack, next.stencilZPassOpBack);
    } else {
      gl.stencilFunc(next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
      gl.stencilMask(next.stencilWriteMaskFront);
      gl.stencilOp(next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
    }

    return;
  }

  // fast return
  if (next.stencilTest === enums.STENCIL_DISABLE) {
    return;
  }

  if (cur.stencilSep !== next.stencilSep) {
    if (next.stencilSep) {
      gl.stencilFuncSeparate(gl.FRONT, next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
      gl.stencilMaskSeparate(gl.FRONT, next.stencilWriteMaskFront);
      gl.stencilOpSeparate(gl.FRONT, next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
      gl.stencilFuncSeparate(gl.BACK, next.stencilFuncBack, next.stencilRefBack, next.stencilMaskBack);
      gl.stencilMaskSeparate(gl.BACK, next.stencilWriteMaskBack);
      gl.stencilOpSeparate(gl.BACK, next.stencilFailOpBack, next.stencilZFailOpBack, next.stencilZPassOpBack);
    } else {
      gl.stencilFunc(next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
      gl.stencilMask(next.stencilWriteMaskFront);
      gl.stencilOp(next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
    }
    return;
  }

  if (next.stencilSep) {
    // front
    if (
      cur.stencilFuncFront !== next.stencilFuncFront ||
      cur.stencilRefFront !== next.stencilRefFront ||
      cur.stencilMaskFront !== next.stencilMaskFront
    ) {
      gl.stencilFuncSeparate(gl.FRONT, next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
    }
    if (cur.stencilWriteMaskFront !== next.stencilWriteMaskFront) {
      gl.stencilMaskSeparate(gl.FRONT, next.stencilWriteMaskFront);
    }
    if (
      cur.stencilFailOpFront !== next.stencilFailOpFront ||
      cur.stencilZFailOpFront !== next.stencilZFailOpFront ||
      cur.stencilZPassOpFront !== next.stencilZPassOpFront
    ) {
      gl.stencilOpSeparate(gl.FRONT, next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
    }

    // back
    if (
      cur.stencilFuncBack !== next.stencilFuncBack ||
      cur.stencilRefBack !== next.stencilRefBack ||
      cur.stencilMaskBack !== next.stencilMaskBack
    ) {
      gl.stencilFuncSeparate(gl.BACK, next.stencilFuncBack, next.stencilRefBack, next.stencilMaskBack);
    }
    if (cur.stencilWriteMaskBack !== next.stencilWriteMaskBack) {
      gl.stencilMaskSeparate(gl.BACK, next.stencilWriteMaskBack);
    }
    if (
      cur.stencilFailOpBack !== next.stencilFailOpBack ||
      cur.stencilZFailOpBack !== next.stencilZFailOpBack ||
      cur.stencilZPassOpBack !== next.stencilZPassOpBack
    ) {
      gl.stencilOpSeparate(gl.BACK, next.stencilFailOpBack, next.stencilZFailOpBack, next.stencilZPassOpBack);
    }
  } else {
    if (
      cur.stencilFuncFront !== next.stencilFuncFront ||
      cur.stencilRefFront !== next.stencilRefFront ||
      cur.stencilMaskFront !== next.stencilMaskFront
    ) {
      gl.stencilFunc(next.stencilFuncFront, next.stencilRefFront, next.stencilMaskFront);
    }
    if (cur.stencilWriteMaskFront !== next.stencilWriteMaskFront) {
      gl.stencilMask(next.stencilWriteMaskFront);
    }
    if (
      cur.stencilFailOpFront !== next.stencilFailOpFront ||
      cur.stencilZFailOpFront !== next.stencilZFailOpFront ||
      cur.stencilZPassOpFront !== next.stencilZPassOpFront
    ) {
      gl.stencilOp(next.stencilFailOpFront, next.stencilZFailOpFront, next.stencilZPassOpFront);
    }
  }

}

/**
 * _commitCullMode
 */
function _commitCullMode(gl, cur, next) {
  if (cur.cullMode === next.cullMode) {
    return;
  }

  if (next.cullMode === enums.CULL_NONE) {
    gl.disable(gl.CULL_FACE);
    return;
  }

  gl.enable(gl.CULL_FACE);
  gl.cullFace(next.cullMode);
}

/**
 * _commitVertexBuffers
 */
function _commitVertexBuffers(device, gl, cur, next) {
  let attrsDirty = false;

  // nothing changed for vertex buffer
  if (next.maxStream === -1) {
    return;
  }

  if (cur.maxStream !== next.maxStream) {
    attrsDirty = true;
  } else if (cur.program !== next.program) {
    attrsDirty = true;
  } else {
    for (let i = 0; i < next.maxStream + 1; ++i) {
      if (
        cur.vertexBuffers[i] !== next.vertexBuffers[i] ||
        cur.vertexBufferOffsets[i] !== next.vertexBufferOffsets[i]
      ) {
        attrsDirty = true;
        break;
      }
    }
  }

  if (attrsDirty) {
    for (let i = 0; i < device._caps.maxVertexAttribs; ++i) {
      device._newAttributes[i] = 0;
    }

    for (let i = 0; i < next.maxStream + 1; ++i) {
      let vb = next.vertexBuffers[i];
      let vbOffset = next.vertexBufferOffsets[i];
      if (!vb || vb._glID === -1) {
        continue;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, vb._glID);

      for (let j = 0; j < next.program._attributes.length; ++j) {
        let attr = next.program._attributes[j];

        let el = vb._format.element(attr.name);
        if (!el) {
          console.warn(`Can not find vertex attribute: ${attr.name}`);
          continue;
        }

        if (device._enabledAttributes[attr.location] === 0) {
          gl.enableVertexAttribArray(attr.location);
          device._enabledAttributes[attr.location] = 1;
        }
        device._newAttributes[attr.location] = 1;

        gl.vertexAttribPointer(
          attr.location,
          el.num,
          el.type,
          el.normalize,
          el.stride,
          el.offset + vbOffset * el.stride
        );
      }
    }

    // disable unused attributes
    for (let i = 0; i < device._caps.maxVertexAttribs; ++i) {
      if (device._enabledAttributes[i] !== device._newAttributes[i]) {
        gl.disableVertexAttribArray(i);
        device._enabledAttributes[i] = 0;
      }
    }
  }
}

/**
 * _commitTextures
 */
function _commitTextures(gl, cur, next) {
  for (let i = 0; i < next.maxTextureSlot + 1; ++i) {
    if (cur.textureUnits[i] !== next.textureUnits[i]) {
      let texture = next.textureUnits[i];
      if (texture && texture._glID !== -1) {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(texture._target, texture._glID);
      }
    }
  }
}

/**
 * _attach
 */
function _attach(gl, location, attachment, face = 0) {
  if (attachment instanceof Texture2D) {
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      location,
      gl.TEXTURE_2D,
      attachment._glID,
      0
    );
  } else if (attachment instanceof TextureCube) {
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      location,
      gl.TEXTURE_CUBE_MAP_POSITIVE_X + face,
      attachment._glID,
      0
    );
  } else {
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      location,
      gl.RENDERBUFFER,
      attachment._glID
    );
  }
}

export default class Device {
  /**
   * @property caps
   */
  get caps() {
    return this._caps;
  }

  /**
   * @param {HTMLElement} canvasEL
   * @param {object} opts
   */
  constructor(canvasEL, opts) {
    let gl;

    // default options
    opts = opts || {};
    if (opts.alpha === undefined) {
      opts.alpha = false;
    }
    if (opts.stencil === undefined) {
      opts.stencil = true;
    }
    if (opts.depth === undefined) {
      opts.depth = true;
    }
    if (opts.antialias === undefined) {
      opts.antialias = false;
    }
    // NOTE: it is said the performance improved in mobile device with this flag off.
    if (opts.preserveDrawingBuffer === undefined) {
      opts.preserveDrawingBuffer = false;
    }

    try {
      gl = canvasEL.getContext('webgl', opts)
        || canvasEL.getContext('experimental-webgl', opts)
        || canvasEL.getContext('webkit-3d', opts)
        || canvasEL.getContext('moz-webgl', opts);
    } catch (err) {
      console.error(err);
      return;
    }

    // No errors are thrown using try catch
    // Tested through ios baidu browser 4.14.1
    if (!gl) {
      console.error('This device does not support webgl');
    }

    // statics
    /**
     * @type {WebGLRenderingContext}
     */
    this._gl = gl;
    this._extensions = {};
    this._caps = {}; // capability
    this._stats = {
      texture: 0,
      vb: 0,
      ib: 0,
      drawcalls: 0,
    };

    // https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Using_Extensions
    this._initExtensions([
      'EXT_texture_filter_anisotropic',
      'EXT_shader_texture_lod',
      'OES_standard_derivatives',
      'OES_texture_float',
      'OES_texture_float_linear',
      'OES_texture_half_float',
      'OES_texture_half_float_linear',
      'OES_vertex_array_object',
      'WEBGL_compressed_texture_atc',
      'WEBGL_compressed_texture_etc',
      'WEBGL_compressed_texture_etc1',
      'WEBGL_compressed_texture_pvrtc',
      'WEBGL_compressed_texture_s3tc',
      'WEBGL_depth_texture',
      'WEBGL_draw_buffers',
    ]);
    this._initCaps();
    this._initStates();

    // runtime
    State.initDefault(this);
    this._current = new State(this);
    this._next = new State(this);
    this._uniforms = {}; // name: { value, num, dirty }
    this._vx = this._vy = this._vw = this._vh = 0;
    this._sx = this._sy = this._sw = this._sh = 0;
    this._framebuffer = null;

    //
    this._enabledAttributes = new Array(this._caps.maxVertexAttribs);
    this._newAttributes = new Array(this._caps.maxVertexAttribs);

    for (let i = 0; i < this._caps.maxVertexAttribs; ++i) {
      this._enabledAttributes[i] = 0;
      this._newAttributes[i] = 0;
    }
  }

  _initExtensions(extensions) {
    const gl = this._gl;

    for (let i = 0; i < extensions.length; ++i) {
      let name = extensions[i];
      let vendorPrefixes = ["", "WEBKIT_", "MOZ_"];

      for (var j = 0; j < vendorPrefixes.length; j++) {
        try {
          let ext = gl.getExtension(vendorPrefixes[j] + name);
          if (ext) {
            this._extensions[name] = ext;
            break;
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  _initCaps() {
    const gl = this._gl;
    const extDrawBuffers = this.ext('WEBGL_draw_buffers');

    this._caps.maxVertexStreams = 4;
    this._caps.maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
    this._caps.maxFragUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
    this._caps.maxTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    this._caps.maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    this._caps.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

    this._caps.maxDrawBuffers = extDrawBuffers ? gl.getParameter(extDrawBuffers.MAX_DRAW_BUFFERS_WEBGL) : 1;
    this._caps.maxColorAttachments = extDrawBuffers ? gl.getParameter(extDrawBuffers.MAX_COLOR_ATTACHMENTS_WEBGL) : 1;
  }

  _initStates() {
    const gl = this._gl;

    // gl.frontFace(gl.CCW);
    gl.disable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ZERO);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendColor(1,1,1,1);

    gl.colorMask(true, true, true, true);

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    gl.disable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    gl.depthMask(false);
    gl.disable(gl.POLYGON_OFFSET_FILL);
    gl.depthRange(0,1);

    gl.disable(gl.STENCIL_TEST);
    gl.stencilFunc(gl.ALWAYS, 0, 0xFF);
    gl.stencilMask(0xFF);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

    // TODO:
    // this.setAlphaToCoverage(false);
    // this.setTransformFeedbackBuffer(null);
    // this.setRaster(true);
    // this.setDepthBias(false);

    gl.clearDepth(1);
    gl.clearColor(0, 0, 0, 0);
    gl.clearStencil(0);

    gl.disable(gl.SCISSOR_TEST);
  }

  _restoreTexture(unit) {
    const gl = this._gl;

    let texture = this._current.textureUnits[unit];
    if (texture && texture._glID !== -1) {
      gl.bindTexture(texture._target, texture._glID);
    } else {
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
  }

  _restoreIndexBuffer () {
    const gl = this._gl;

    let ib = this._current.indexBuffer;
    if (ib && ib._glID !== -1) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib._glID);
    }
    else {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
  }

  /**
   * @method ext
   * @param {string} name
   */
  ext(name) {
    return this._extensions[name];
  }

  allowFloatTexture() {
    return this.ext("OES_texture_float") != null;
  }

  // ===============================
  // Immediate Settings
  // ===============================

  /**
   * @method setFrameBuffer
   * @param {FrameBuffer} fb - null means use the backbuffer
   */
  setFrameBuffer(fb) {
    if (this._framebuffer === fb) {
      return;
    }

    this._framebuffer = fb;
    const gl = this._gl;

    if (fb === null) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return;
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb._glID);

    let numColors = fb._colors.length;
    for (let i = 0; i < numColors; ++i) {
      let colorBuffer = fb._colors[i];
      _attach(gl, gl.COLOR_ATTACHMENT0 + i, colorBuffer);

      // TODO: what about cubemap face??? should be the target parameter for colorBuffer
    }
    for (let i = numColors; i < this._caps.maxColorAttachments; ++i) {
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0 + i,
        gl.TEXTURE_2D,
        null,
        0
      );
    }

    if (fb._depth) {
      _attach(gl, gl.DEPTH_ATTACHMENT, fb._depth);
    }

    if (fb._stencil) {
      _attach(gl, gl.STENCIL_ATTACHMENT, fb._stencil);
    }

    if (fb._depthStencil) {
      _attach(gl, gl.DEPTH_STENCIL_ATTACHMENT, fb._depthStencil);
    }
  }

  /**
   * @method setViewport
   * @param {Number} x
   * @param {Number} y
   * @param {Number} w
   * @param {Number} h
   */
  setViewport(x, y, w, h) {
    if (
      this._vx !== x ||
      this._vy !== y ||
      this._vw !== w ||
      this._vh !== h
    ) {
      this._gl.viewport(x, y, w, h);
      this._vx = x;
      this._vy = y;
      this._vw = w;
      this._vh = h;
    }
  }

  /**
   * @method setScissor
   * @param {Number} x
   * @param {Number} y
   * @param {Number} w
   * @param {Number} h
   */
  setScissor(x, y, w, h) {
    if (
      this._sx !== x ||
      this._sy !== y ||
      this._sw !== w ||
      this._sh !== h
    ) {
      this._gl.scissor(x, y, w, h);
      this._sx = x;
      this._sy = y;
      this._sw = w;
      this._sh = h;
    }
  }

  /**
   * @method clear
   * @param {Object} opts
   * @param {Array} opts.color
   * @param {Number} opts.depth
   * @param {Number} opts.stencil
   */
  clear(opts) {
    if (opts.color === undefined && opts.depth === undefined && opts.stencil === undefined) {
        return;
    }
    const gl = this._gl;
    let flags = 0;

    if (opts.color !== undefined) {
      flags |= gl.COLOR_BUFFER_BIT;
      gl.clearColor(opts.color[0], opts.color[1], opts.color[2], opts.color[3]);
    }

    if (opts.depth !== undefined) {
      flags |= gl.DEPTH_BUFFER_BIT;
      gl.clearDepth(opts.depth);

      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(true);
      gl.depthFunc(gl.ALWAYS);
    }

    if (opts.stencil !== undefined) {
      flags |= gl.STENCIL_BUFFER_BIT;
      gl.clearStencil(opts.stencil);
    }

    gl.clear(flags);

    // restore depth-write
    if (opts.depth !== undefined) {
      if (this._current.depthTest === false) {
        gl.disable(gl.DEPTH_TEST);
      } else {
        if (this._current.depthWrite === false) {
          gl.depthMask(false);
        }
        if (this._current.depthFunc !== enums.DS_FUNC_ALWAYS) {
          gl.depthFunc(this._current.depthFunc);
        }
      }
    }
  }

  // ===============================
  // Deferred States
  // ===============================

  /**
   * @method enableBlend
   */
  enableBlend() {
    this._next.blend = true;
  }

  /**
   * @method enableDepthTest
   */
  enableDepthTest() {
    this._next.depthTest = true;
  }

  /**
   * @method enableDepthWrite
   */
  enableDepthWrite() {
    this._next.depthWrite = true;
  }

  /**
   * @method enableStencilTest
   * @param {Number} stencilTest
   */
  setStencilTest(stencilTest) {
    this._next.stencilTest = stencilTest;
  }

  /**
   * @method setStencilFunc
   * @param {DS_FUNC_*} func
   * @param {Number} ref
   * @param {Number} mask
   */
  setStencilFunc(func, ref, mask) {
    this._next.stencilSep = false;
    this._next.stencilFuncFront = this._next.stencilFuncBack = func;
    this._next.stencilRefFront = this._next.stencilRefBack = ref;
    this._next.stencilMaskFront = this._next.stencilMaskBack = mask;
  }

  /**
   * @method setStencilFuncFront
   * @param {DS_FUNC_*} func
   * @param {Number} ref
   * @param {Number} mask
   */
  setStencilFuncFront(func, ref, mask) {
    this._next.stencilSep = true;
    this._next.stencilFuncFront = func;
    this._next.stencilRefFront = ref;
    this._next.stencilMaskFront = mask;
  }

  /**
   * @method setStencilFuncBack
   * @param {DS_FUNC_*} func
   * @param {Number} ref
   * @param {Number} mask
   */
  setStencilFuncBack(func, ref, mask) {
    this._next.stencilSep = true;
    this._next.stencilFuncBack = func;
    this._next.stencilRefBack = ref;
    this._next.stencilMaskBack = mask;
  }

  /**
   * @method setStencilOp
   * @param {STENCIL_OP_*} failOp
   * @param {STENCIL_OP_*} zFailOp
   * @param {STENCIL_OP_*} zPassOp
   * @param {Number} writeMask
   */
  setStencilOp(failOp, zFailOp, zPassOp, writeMask) {
    this._next.stencilFailOpFront = this._next.stencilFailOpBack = failOp;
    this._next.stencilZFailOpFront = this._next.stencilZFailOpBack = zFailOp;
    this._next.stencilZPassOpFront = this._next.stencilZPassOpBack = zPassOp;
    this._next.stencilWriteMaskFront = this._next.stencilWriteMaskBack = writeMask;
  }

  /**
   * @method setStencilOpFront
   * @param {STENCIL_OP_*} failOp
   * @param {STENCIL_OP_*} zFailOp
   * @param {STENCIL_OP_*} zPassOp
   * @param {Number} writeMask
   */
  setStencilOpFront(failOp, zFailOp, zPassOp, writeMask) {
    this._next.stencilSep = true;
    this._next.stencilFailOpFront = failOp;
    this._next.stencilZFailOpFront = zFailOp;
    this._next.stencilZPassOpFront = zPassOp;
    this._next.stencilWriteMaskFront = writeMask;
  }

  /**
   * @method setStencilOpBack
   * @param {STENCIL_OP_*} failOp
   * @param {STENCIL_OP_*} zFailOp
   * @param {STENCIL_OP_*} zPassOp
   * @param {Number} writeMask
   */
  setStencilOpBack(failOp, zFailOp, zPassOp, writeMask) {
    this._next.stencilSep = true;
    this._next.stencilFailOpBack = failOp;
    this._next.stencilZFailOpBack = zFailOp;
    this._next.stencilZPassOpBack = zPassOp;
    this._next.stencilWriteMaskBack = writeMask;
  }

  /**
   * @method setDepthFunc
   * @param {DS_FUNC_*} depthFunc
   */
  setDepthFunc(depthFunc) {
    this._next.depthFunc = depthFunc;
  }

  /**
   * @method setBlendColor32
   * @param {Number} rgba
   */
  setBlendColor32(rgba) {
    this._next.blendColor = rgba;
  }

  /**
   * @method setBlendColor
   * @param {Number} r
   * @param {Number} g
   * @param {Number} b
   * @param {Number} a
   */
  setBlendColor(r, g, b, a) {
    this._next.blendColor = ((r * 255) << 24 | (g * 255) << 16 | (b * 255) << 8 | a * 255) >>> 0;
  }

  /**
   * @method setBlendFunc
   * @param {BELND_*} src
   * @param {BELND_*} dst
   */
  setBlendFunc(src, dst) {
    this._next.blendSep = false;
    this._next.blendSrc = src;
    this._next.blendDst = dst;
  }

  /**
   * @method setBlendFuncSep
   * @param {BELND_*} src
   * @param {BELND_*} dst
   * @param {BELND_*} srcAlpha
   * @param {BELND_*} dstAlpha
   */
  setBlendFuncSep(src, dst, srcAlpha, dstAlpha) {
    this._next.blendSep = true;
    this._next.blendSrc = src;
    this._next.blendDst = dst;
    this._next.blendSrcAlpha = srcAlpha;
    this._next.blendDstAlpha = dstAlpha;
  }

  /**
   * @method setBlendEq
   * @param {BELND_FUNC_*} eq
   */
  setBlendEq(eq) {
    this._next.blendSep = false;
    this._next.blendEq = eq;
  }

  /**
   * @method setBlendEqSep
   * @param {BELND_FUNC_*} eq
   * @param {BELND_FUNC_*} alphaEq
   */
  setBlendEqSep(eq, alphaEq) {
    this._next.blendSep = true;
    this._next.blendEq = eq;
    this._next.blendAlphaEq = alphaEq;
  }

  /**
   * @method setCullMode
   * @param {CULL_*} mode
   */
  setCullMode(mode) {
    this._next.cullMode = mode;
  }

  /**
   * @method setVertexBuffer
   * @param {Number} stream
   * @param {VertexBuffer} buffer
   * @param {Number} start - start vertex
   */
  setVertexBuffer(stream, buffer, start = 0) {
    this._next.vertexBuffers[stream] = buffer;
    this._next.vertexBufferOffsets[stream] = start;
    if (this._next.maxStream < stream) {
      this._next.maxStream = stream;
    }
  }

  /**
   * @method setIndexBuffer
   * @param {IndexBuffer} buffer
   */
  setIndexBuffer(buffer) {
    this._next.indexBuffer = buffer;
  }

  /**
   * @method setProgram
   * @param {Program} program
   */
  setProgram(program) {
    this._next.program = program;
  }

  /**
   * @method setTexture
   * @param {String} name
   * @param {Texture} texture
   * @param {Number} slot
   */
  setTexture(name, texture, slot) {
    if (slot >= this._caps.maxTextureUnits) {
      console.warn(`Can not set texture ${name} at stage ${slot}, max texture exceed: ${this._caps.maxTextureUnits}`);
      return;
    }

    this._next.textureUnits[slot] = texture;
    this.setUniform(name, slot);

    if (this._next.maxTextureSlot < slot) {
      this._next.maxTextureSlot = slot;
    }
  }

  /**
   * @method setTextureArray
   * @param {String} name
   * @param {Array} textures
   * @param {Int32Array} slots
   */
  setTextureArray(name, textures, slots) {
    let len = textures.length;
    if (len >= this._caps.maxTextureUnits) {
      console.warn(`Can not set ${len} textures for ${name}, max texture exceed: ${this._caps.maxTextureUnits}`);
      return;
    }
    for (let i = 0; i < len; ++i) {
      let slot = slots[i];
      this._next.textureUnits[slot] = textures[i];
    }
    this.setUniform(name, slots);
  }

  /**
   * @method setUniform
   * @param {String} name
   * @param {*} value
   */
  setUniform(name, value) {
    let uniform = this._uniforms[name];

    let sameType = false;
    let isArray = false, isFloat32Array = false, isInt32Array = false;
    do {
      if (!uniform) {
        break;
      }

      isFloat32Array = Array.isArray(value) || value instanceof Float32Array;
      isInt32Array = value instanceof Int32Array;
      isArray = isFloat32Array || isInt32Array;
      if (uniform.isArray !== isArray) {
        break;
      }

      if (uniform.isArray && uniform.value.length !== value.length) {
        break;
      }

      sameType = true;
    } while (false);

    if (!sameType) {
      let newValue = value;
      if (isFloat32Array) {
        newValue = new Float32Array(value);
      }
      else if (isInt32Array) {
        newValue = new Int32Array(value);
      }

      uniform = {
        dirty: true,
        value: newValue,
        isArray: isArray
      };
    } else {
      let oldValue = uniform.value;
      let dirty = false;
      if (uniform.isArray) {
        for (let i = 0, l = oldValue.length; i < l; i++) {
          if (oldValue[i] !== value[i]) {
            dirty = true;
            oldValue[i] = value[i];
          }
        }
      }
      else {
        if (oldValue !== value) {
          dirty = true;
          uniform.value = value;
        }
      }

      if (dirty) {
        uniform.dirty = true;
      }
    }
    this._uniforms[name] = uniform;
  }

  setUniformDirectly(name, value) {
    let uniform = this._uniforms[name];
    if (!uniform) {
      this._uniforms[name] = uniform = {};
    }
    uniform.dirty = true;
    uniform.value = value;
  }

  /**
   * @method setPrimitiveType
   * @param {PT_*} type
   */
  setPrimitiveType(type) {
    this._next.primitiveType = type;
  }

  /**
   * @method resetDrawCalls
   */
  resetDrawCalls () {
    this._stats.drawcalls = 0;
  }
  
  /**
   * @method getDrawCalls
   */
  getDrawCalls () {
    return this._stats.drawcalls;
  }

  /**
   * @method draw
   * @param {Number} base
   * @param {Number} count
   */
  draw(base, count) {
    const gl = this._gl;
    let cur = this._current;
    let next = this._next;

    // commit blend
    _commitBlendStates(gl, cur, next);

    // commit depth
    _commitDepthStates(gl, cur, next);

    // commit stencil
    _commitStencilStates(gl, cur, next);

    // commit cull
    _commitCullMode(gl, cur, next);

    // commit vertex-buffer
    _commitVertexBuffers(this, gl, cur, next);

    // commit index-buffer
    if (cur.indexBuffer !== next.indexBuffer) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, next.indexBuffer && next.indexBuffer._glID !== -1 ? next.indexBuffer._glID : null);
    }

    // commit program
    let programDirty = false;
    if (cur.program !== next.program) {
      if (next.program._linked) {
        gl.useProgram(next.program._glID);
      } else {
        console.warn('Failed to use program: has not linked yet.');
      }
      programDirty = true;
    }

    // commit texture/sampler
    _commitTextures(gl, cur, next);

    // commit uniforms
    for (let i = 0; i < next.program._uniforms.length; ++i) {
      let uniformInfo = next.program._uniforms[i];
      let uniform = this._uniforms[uniformInfo.name];
      if (!uniform) {
        // console.warn(`Can not find uniform ${uniformInfo.name}`);
        continue;
      }

      if (!programDirty && !uniform.dirty) {
        continue;
      }

      uniform.dirty = false;

      // TODO: please consider array uniform: uniformInfo.size > 0

      let commitFunc = (uniformInfo.size === undefined) ? _type2uniformCommit[uniformInfo.type] : _type2uniformArrayCommit[uniformInfo.type];
      if (!commitFunc) {
        console.warn(`Can not find commit function for uniform ${uniformInfo.name}`);
        continue;
      }

      commitFunc(gl, uniformInfo.location, uniform.value);
    }

    if (count) {
      // drawPrimitives
      if (next.indexBuffer) {
        gl.drawElements(
          this._next.primitiveType,
          count,
          next.indexBuffer._format,
          base * next.indexBuffer._bytesPerIndex
        );
      } else {
        gl.drawArrays(
          this._next.primitiveType,
          base,
          count
        );
      }
    }

    // TODO: autogen mipmap for color buffer
    // if (this._framebuffer && this._framebuffer.colors[0].mipmap) {
    //   gl.bindTexture(this._framebuffer.colors[i]._target, colors[i]._glID);
    //   gl.generateMipmap(this._framebuffer.colors[i]._target);
    // }

    // update stats
    this._stats.drawcalls++;

    // reset states
    cur.set(next);
    next.reset();
  }
}