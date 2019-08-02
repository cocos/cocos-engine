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

#include "Pass.h"

RENDERER_BEGIN

Pass::Pass(const std::string& programName)
: _programName(programName)
{
    _hashName = std::hash<std::string>{}(programName);
//    RENDERER_LOGD("Pass constructor: %p", this);
}

Pass::~Pass()
{
//    RENDERER_LOGD("Pass destructor: %p", this);
}

void Pass::setCullMode(CullMode cullMode)
{
    _cullMode = cullMode;
}

void Pass::setBlend(BlendOp blendEq,
                    BlendFactor blendSrc,
                    BlendFactor blendDst,
                    BlendOp blendAlphaEq,
                    BlendFactor blendSrcAlpha,
                    BlendFactor blendDstAlpha,
                    uint32_t blendColor)
{
    _blend = true;
    _blendEq = blendEq;
    _blendSrc = blendSrc;
    _blendDst = blendDst;
    _blendAlphaEq = blendAlphaEq;
    _blendSrcAlpha = blendSrcAlpha;
    _blendDstAlpha = blendDstAlpha;
    _blendColor = blendColor;
}

void Pass::setDepth(bool depthTest, bool depthWrite, DepthFunc depthFunc)
{
    _depthTest = depthTest;
    _depthWrite = depthWrite;
    _depthFunc = depthFunc;
}

void Pass::setStencilFront(StencilFunc stencilFunc,
                           uint32_t stencilRef,
                           uint8_t stencilMask,
                           StencilOp stencilFailOp,
                           StencilOp stencilZFailOp,
                           StencilOp stencilZPassOp,
                           uint8_t stencilWriteMask)
{
    _stencilTest = true;
    _stencilFuncFront = stencilFunc;
    _stencilRefFront = stencilRef;
    _stencilMaskFront = stencilMask;
    _stencilFailOpFront = stencilFailOp;
    _stencilZFailOpFront = stencilZFailOp;
    _stencilZPassOpFront = stencilZPassOp;
    _stencilWriteMaskFront = stencilWriteMask;
}

void Pass::setStencilBack(StencilFunc stencilFunc,
                          uint32_t stencilRef,
                          uint8_t stencilMask,
                          StencilOp stencilFailOp,
                          StencilOp stencilZFailOp,
                          StencilOp stencilZPassOp,
                          uint8_t stencilWriteMask)
{
    _stencilTest = true;
    _stencilFuncBack = stencilFunc;
    _stencilRefBack = stencilRef;
    _stencilMaskBack = stencilMask;
    _stencilFailOpBack = stencilFailOp;
    _stencilZFailOpBack = stencilZFailOp;
    _stencilZPassOpBack = stencilZPassOp;
    _stencilWriteMaskBack = stencilWriteMask;
}

void Pass::copy(const Pass& pass)
{
    // blending
    _blend = pass._blend;
    _blendEq = pass._blendEq;
    _blendAlphaEq = pass._blendAlphaEq;
    _blendSrc = pass._blendSrc;
    _blendDst = pass._blendDst;
    _blendSrcAlpha = pass._blendSrcAlpha;
    _blendDstAlpha = pass._blendDstAlpha;
    _blendColor = pass._blendColor;
    
    // depth
    _depthTest = pass._depthTest;
    _depthWrite = pass._depthWrite;
    _depthFunc = pass._depthFunc;
    
    // stencil
    
    _stencilTest = pass._stencilTest;
    // front
    _stencilRefFront = pass._stencilRefFront;
    _stencilFuncFront = pass._stencilFuncFront;
    _stencilFailOpFront = pass._stencilFailOpFront;
    _stencilZFailOpFront = pass._stencilZFailOpFront;
    _stencilZPassOpFront = pass._stencilZPassOpFront;
    _stencilWriteMaskFront = pass._stencilWriteMaskFront;
    _stencilMaskFront = pass._stencilMaskFront;
    // back
    _stencilRefBack = pass._stencilRefBack;
    _stencilFuncBack = pass._stencilFuncBack;
    _stencilFailOpBack = pass._stencilFailOpBack;
    _stencilZFailOpBack = pass._stencilZFailOpBack;
    _stencilZPassOpBack = pass._stencilZPassOpBack;
    _stencilWriteMaskBack = pass._stencilWriteMaskBack;
    _stencilMaskBack = pass._stencilMaskBack;
    
    // cull mode
    _cullMode = pass._cullMode;
    
    _programName = pass._programName;
    _hashName = pass._hashName;
}

RENDERER_END
