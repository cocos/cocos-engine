/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#pragma once

#include <string>
#include <base/CCRef.h>
#include "../Macro.h"
#include "../Types.h"

RENDERER_BEGIN

/**
 * @addtogroup renderer
 * @{
 */

/**
 * @brief Pass describes base render pass configurations, including program, cull face, blending, depth testing and stencil testing configs.\n
 * JS API: renderer.Pass
 * @code
 * let pass = new renderer.Pass('sprite');
 * pass.setDepth(false, false);
 * pass.setCullMode(gfx.CULL_NONE);
 * pass.setBlend(
 *     gfx.BLEND_FUNC_ADD,
 *     gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
 *     gfx.BLEND_FUNC_ADD,
 *     gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA
 * );
 * @endcode
 */
class Pass : public Ref
{
public:
    /**
     * @brief Constructor with linked program name.
     * @param[in] programName Shader program name
     */
    Pass(const std::string& programName);
    Pass() {};
    ~Pass();
    
    /**
     *  @brief Sets cull mode.
     *  @param[in] cullMode Cull front or back or both.
     */
    void setCullMode(CullMode cullMode);
    /**
     *  @brief Sets blend mode.
     *  @param[in] blendEq RGB blend equation.
     *  @param[in] blendSrc Src RGB blend factor.
     *  @param[in] blendDst Dst RGB blend factor.
     *  @param[in] blendAlphaEq Alpha blend equation.
     *  @param[in] blendSrcAlpha Src Alpha blend equation.
     *  @param[in] blendDstAlpha Dst Alpha blend equation.
     *  @param[in] blendColor Blend constant color value.
     */
    void setBlend(BlendOp blendEq = BlendOp::ADD,
                  BlendFactor blendSrc = BlendFactor::ONE,
                  BlendFactor blendDst = BlendFactor::ZERO,
                  BlendOp blendAlphaEq = BlendOp::ADD,
                  BlendFactor blendSrcAlpha = BlendFactor::ONE,
                  BlendFactor blendDstAlpha = BlendFactor::ZERO,
                  uint32_t blendColor = 0xffffffff);
    /**
     *  @brief Switch depth test or write, and sets depth test function.
     *  @param[in] depthTest Enable depth test or not.
     *  @param[in] depthWrite Enable depth write or not.
     *  @param[in] depthFunc Depth test function.
     */
    void setDepth(bool depthTest = false,
                  bool depthWrite = false,
                  DepthFunc depthFunc = DepthFunc::LESS);
    /**
     *  @brief Sets stencil front-facing function, reference, mask, fail operation, write mask.
     */
    void setStencilFront(StencilFunc stencilFunc = StencilFunc::ALWAYS,
                         uint32_t stencilRef = 0,
                         uint8_t stencilMask = 0xff,
                         StencilOp stencilFailOp = StencilOp::KEEP,
                         StencilOp stencilZFailOp = StencilOp::KEEP,
                         StencilOp stencilZPassOp = StencilOp::KEEP,
                         uint8_t stencilWriteMask = 0xff);
    /**
     *  @brief Sets stencil back-facing function, reference, mask, fail operation, write mask.
     */
    void setStencilBack(StencilFunc stencilFunc = StencilFunc::ALWAYS,
                        uint32_t stencilRef = 0,
                        uint8_t stencilMask = 0xff,
                        StencilOp stencilFailOp = StencilOp::KEEP,
                        StencilOp stencilZFailOp = StencilOp::KEEP,
                        StencilOp stencilZPassOp = StencilOp::KEEP,
                        uint8_t stencilWriteMask = 0xff);
    /*
     *  @brief Sets stencil test enabled or not.
     */
    inline void setStencilTest(bool value) { _stencilTest = value; }
    /**
     *  @brief Gets stencil test enabled or not.
     */
    inline bool getStencilTest() const { return _stencilTest; }
    /**
     *  @brief Sets linked program name.
     */
    inline void setProgramName(const std::string& programName) { _programName = programName; }
    /**
     *  @brief Gets linked program name.
     */
    inline const std::string& getProgramName() const { return _programName; }
    
    inline size_t getHashName() const { return _hashName; }
    /**
     *  @brief Disable stencil test.
     */
    inline void disableStencilTest() { _stencilTest = false; }
    /**
     *  @brief deep copy from other pass.
     */
    void copy(const Pass& pass);
    
private:
    friend class BaseRenderer;
    
    // blending
    bool _blend = false;
    BlendOp _blendEq = BlendOp::ADD;
    BlendOp _blendAlphaEq = BlendOp::ADD;
    BlendFactor _blendSrc = BlendFactor::SRC_ALPHA;
    BlendFactor _blendDst = BlendFactor::ONE_MINUS_SRC_ALPHA;
    BlendFactor _blendSrcAlpha = BlendFactor::SRC_ALPHA;
    BlendFactor _blendDstAlpha = BlendFactor::ONE_MINUS_SRC_ALPHA;
    uint32_t _blendColor = 0xffffffff;
    
    // depth
    bool _depthTest = false;
    bool _depthWrite = false;
    DepthFunc _depthFunc = DepthFunc::LESS;
    
    // stencil
    bool _stencilTest = false;
    // front
    uint32_t _stencilRefFront = 0;
    StencilFunc _stencilFuncFront = StencilFunc::ALWAYS;
    StencilOp _stencilFailOpFront = StencilOp::KEEP;
    StencilOp _stencilZFailOpFront = StencilOp::KEEP;
    StencilOp _stencilZPassOpFront = StencilOp::KEEP;
    uint8_t _stencilWriteMaskFront = 0xff;
    uint8_t _stencilMaskFront = 0xff;
    // back
    uint32_t _stencilRefBack = 0;
    StencilFunc _stencilFuncBack = StencilFunc::ALWAYS;
    StencilOp _stencilFailOpBack = StencilOp::KEEP;
    StencilOp _stencilZFailOpBack = StencilOp::KEEP;
    StencilOp _stencilZPassOpBack = StencilOp::KEEP;
    uint8_t _stencilWriteMaskBack = 0xff;
    uint8_t _stencilMaskBack = 0xff;
    
    // cull mode
    CullMode _cullMode = CullMode::BACK;
    
    std::string _programName = "";
    size_t _hashName = 0;
};

// end of renderer group
/// @}
RENDERER_END
