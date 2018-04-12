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

class Pass
{
public:
    Pass(const std::string& programName);
    Pass() {}
    ~Pass();
    
    void setCullMode(CullMode cullMode);
    void setBlend(BlendOp blendEq = BlendOp::ADD,
                  BlendFactor blendSrc = BlendFactor::ONE,
                  BlendFactor blendDst = BlendFactor::ZERO,
                  BlendOp blendAlphaEq = BlendOp::ADD,
                  BlendFactor blendSrcAlpha = BlendFactor::ONE,
                  BlendFactor blendDstAlpha = BlendFactor::ZERO,
                  uint32_t blendColor = 0xffffffff);
    void setDepth(bool depthTest = false,
                  bool depthWrite = false,
                  DepthFunc depthFunc = DepthFunc::LESS);
    void setStencilFront(StencilFunc stencilFunc = StencilFunc::ALWAYS,
                         uint32_t stencilRef = 0,
                         uint8_t stencilMask = 0xff,
                         StencilOp stencilFailOp = StencilOp::KEEP,
                         StencilOp stencilZFailOp = StencilOp::KEEP,
                         StencilOp stencilZPassOp = StencilOp::KEEP,
                         uint8_t stencilWriteMask = 0xff);
    void setStencilBack(StencilFunc stencilFunc = StencilFunc::ALWAYS,
                        uint32_t stencilRef = 0,
                        uint8_t stencilMask = 0xff,
                        StencilOp stencilFailOp = StencilOp::KEEP,
                        StencilOp stencilZFailOp = StencilOp::KEEP,
                        StencilOp stencilZPassOp = StencilOp::KEEP,
                        uint8_t stencilWriteMask = 0xff);
    inline void setStencilTest(bool value) { _stencilTest = value; }
    inline bool getStencilTest() const { return _stencilTest; }
    inline void setProgramName(const std::string& programName) { _programName = programName; }
    
private:
    friend class BaseRenderer;
    
    // blending
    bool _blend = false;
    BlendOp _blendEq = BlendOp::ADD;
    BlendOp _blendAlphaEq = BlendOp::ADD;
    BlendFactor _blendSrc = BlendFactor::ONE;
    BlendFactor _blendDst = BlendFactor::ZERO;
    BlendFactor _blendSrcAlpha = BlendFactor::ONE;
    BlendFactor _blendDstAlpha = BlendFactor::ZERO;
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
};

RENDERER_END
