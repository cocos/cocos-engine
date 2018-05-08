class Pass {
  constructor(name) {
    this._programName = name;

    // cullmode
    this._cullMode = gfx.CULL_BACK;

    // blending
    this._blend = false;
    this._blendEq = gfx.BLEND_FUNC_ADD;
    this._blendAlphaEq = gfx.BLEND_FUNC_ADD;
    this._blendSrc = gfx.BLEND_ONE;
    this._blendDst = gfx.BLEND_ZERO;
    this._blendSrcAlpha = gfx.BLEND_ONE;
    this._blendDstAlpha = gfx.BLEND_ZERO;
    this._blendColor = 0xffffffff;

    // depth
    this._depthTest = false;
    this._depthWrite = false;
    this._depthFunc = gfx.DS_FUNC_LESS,

    // stencil
    this._stencilTest = false;
    // front
    this._stencilFuncFront = gfx.DS_FUNC_ALWAYS;
    this._stencilRefFront = 0;
    this._stencilMaskFront = 0xff;
    this._stencilFailOpFront = gfx.STENCIL_OP_KEEP;
    this._stencilZFailOpFront = gfx.STENCIL_OP_KEEP;
    this._stencilZPassOpFront = gfx.STENCIL_OP_KEEP;
    this._stencilWriteMaskFront = 0xff;
    // back
    this._stencilFuncBack = gfx.DS_FUNC_ALWAYS;
    this._stencilRefBack = 0;
    this._stencilMaskBack = 0xff;
    this._stencilFailOpBack = gfx.STENCIL_OP_KEEP;
    this._stencilZFailOpBack = gfx.STENCIL_OP_KEEP;
    this._stencilZPassOpBack = gfx.STENCIL_OP_KEEP;
    this._stencilWriteMaskBack = 0xff;

    var binary = new Uint32Array(25);
    binary[0] = this._cullMode;
    binary[1] = this._blendEq;
    binary[2] = this._blendSrc;
    binary[3] = this._blendDst;
    binary[4] = this._blendAlphaEq;
    binary[5] = this._blendSrcAlpha;
    binary[6] = this._blendDstAlpha;
    binary[7] = this._blendColor;
    binary[8] = this._depthTest;
    binary[9] = this._depthWrite;
    binary[10] = this._depthFunc;
    binary[11] = this._stencilFuncFront;
    binary[12] = this._stencilRefFront;
    binary[13] = this._stencilMaskFront;
    binary[14] = this._stencilFailOpFront;
    binary[15] = this._stencilZFailOpFront;
    binary[16] = this._stencilZPassOpFront;
    binary[17] = this._stencilWriteMaskFront;
    binary[18] = this._stencilFuncBack;
    binary[19] = this._stencilRefBack;
    binary[20] = this._stencilMaskBack;
    binary[21] = this._stencilFailOpBack;
    binary[22] = this._stencilZFailOpBack;
    binary[23] = this._stencilZPassOpBack;
    binary[24] = this._stencilWriteMaskBack;
    this._native = new renderer.PassNative();
    this._native.init(this._programName, binary);
  }

  setCullMode(cullMode) {
    this._cullMode = cullMode;

    this._native.setCullMode(cullMode);
  }

  disableStecilTest() {
    this._stencilTest = false;

    this._native.disableStecilTest();
  }

  setBlend(
    blendEq = gfx.BLEND_FUNC_ADD,
    blendSrc = gfx.BLEND_ONE,
    blendDst = gfx.BLEND_ZERO,
    blendAlphaEq = gfx.BLEND_FUNC_ADD,
    blendSrcAlpha = gfx.BLEND_ONE,
    blendDstAlpha = gfx.BLEND_ZERO,
    blendColor = 0xffffffff
  ) {
    this._blend = true;
    this._blendEq = blendEq;
    this._blendSrc = blendSrc;
    this._blendDst = blendDst;
    this._blendAlphaEq = blendAlphaEq;
    this._blendSrcAlpha = blendSrcAlpha;
    this._blendDstAlpha = blendDstAlpha;
    this._blendColor = blendColor;

    this._native.setBlend(blendEq,
                          blendSrc,
                          blendDst,
                          blendAlphaEq,
                          blendSrcAlpha,
                          blendDstAlpha,
                          blendColor);
  }

  setDepth(
    depthTest = false,
    depthWrite = false,
    depthFunc = gfx.DS_FUNC_LESS
  ) {
    this._depthTest = depthTest;
    this._depthWrite = depthWrite;
    this._depthFunc = depthFunc;

    this._native.setDepth(depthTest, depthWrite, depthFunc);
  }

  setStencilFront(
    stencilFunc = gfx.DS_FUNC_ALWAYS,
    stencilRef = 0,
    stencilMask = 0xff,
    stencilFailOp = gfx.STENCIL_OP_KEEP,
    stencilZFailOp = gfx.STENCIL_OP_KEEP,
    stencilZPassOp = gfx.STENCIL_OP_KEEP,
    stencilWriteMask = 0xff
  ) {
    this._stencilTest = true;
    this._stencilFuncFront = stencilFunc;
    this._stencilRefFront = stencilRef;
    this._stencilMaskFront = stencilMask;
    this._stencilFailOpFront = stencilFailOp;
    this._stencilZFailOpFront = stencilZFailOp;
    this._stencilZPassOpFront = stencilZPassOp;
    this._stencilWriteMaskFront = stencilWriteMask;

    this._native.setStencilFront(stencilFunc,
                                 stencilRef,
                                 stencilMask,
                                 stencilFailOp,
                                 stencilZFailOp,
                                 stencilZPassOp,
                                 stencilWriteMask);
  }

  setStencilBack(
    stencilFunc = gfx.DS_FUNC_ALWAYS,
    stencilRef = 0,
    stencilMask = 0xff,
    stencilFailOp = gfx.STENCIL_OP_KEEP,
    stencilZFailOp = gfx.STENCIL_OP_KEEP,
    stencilZPassOp = gfx.STENCIL_OP_KEEP,
    stencilWriteMask = 0xff
  ) {
    this._stencilTest = true;
    this._stencilFuncBack = stencilFunc;
    this._stencilRefBack = stencilRef;
    this._stencilMaskBack = stencilMask;
    this._stencilFailOpBack = stencilFailOp;
    this._stencilZFailOpBack = stencilZFailOp;
    this._stencilZPassOpBack = stencilZPassOp;
    this._stencilWriteMaskBack = stencilWriteMask;

    this._native.setStencilBack(stencilFunc,
                                stencilRef,
                                stencilMask,
                                stencilFailOp,
                                stencilZFailOp,
                                stencilZPassOp,
                                stencilWriteMask);
  }
}

module.exports = Pass;
