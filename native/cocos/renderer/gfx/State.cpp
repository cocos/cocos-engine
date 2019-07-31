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

#include "State.h"

#include "VertexBuffer.h"
#include "IndexBuffer.h"
#include "Texture2D.h"
#include "Program.h"

RENDERER_BEGIN

State::State()
{
    _textureUnits.resize(10);
    _vertexBuffers.resize(10);
    _vertexBufferOffsets.resize(10);
    
    reset();
}

State::~State()
{
    for (auto vertexBuf : _vertexBuffers)
    {
        RENDERER_SAFE_RELEASE(vertexBuf);
    }

    RENDERER_SAFE_RELEASE(_indexBuffer);

    for (auto texture : _textureUnits)
    {
        RENDERER_SAFE_RELEASE(texture);
    }

    RENDERER_SAFE_RELEASE(_program);
}

void State::reset()
{
    blend = false;
    blendSeparation = false;
    blendColor = 0xFFFFFFFF;
    blendEq = BlendOp::ADD;
    blendAlphaEq = BlendOp::ADD;
    blendSrc = BlendFactor::ONE;
    blendDst = BlendFactor::ZERO;
    blendSrcAlpha = BlendFactor::ONE;
    blendDstAlpha = BlendFactor::ZERO;
    // depth
    depthTest = false;
    depthWrite = false;
    depthFunc = DepthFunc::LESS;
    // stencil
    stencilTest = false;
    stencilSeparation = false;
    stencilFuncFront = StencilFunc::ALWAYS;
    stencilRefFront = 0;
    stencilMaskFront = 0xFF;
    stencilFailOpFront = StencilOp::KEEP;
    stencilZFailOpFront = StencilOp::KEEP;
    stencilZPassOpFront = StencilOp::KEEP;
    stencilWriteMaskFront = 0xFF;
    stencilFuncBack = StencilFunc::ALWAYS;
    stencilRefBack = 0;
    stencilMaskBack = 0xFF;
    stencilFailOpBack = StencilOp::KEEP;
    stencilZFailOpBack = StencilOp::KEEP;
    stencilZPassOpBack = StencilOp::KEEP;
    stencilWriteMaskBack = 0xFF;
    // cull-mode
    cullMode = CullMode::BACK;
    
    // primitive-type
    primitiveType = PrimitiveType::TRIANGLES;
    
    // bindings
    maxStream = -1;
    
    
    for (auto i = 0; i < _textureUnits.size(); i++) {
        if (_textureUnits[i]) {
            RENDERER_SAFE_RELEASE(_textureUnits[i]);
        }
        _textureUnits[i] = nullptr;
    }
    
    for (auto i = 0; i < _vertexBuffers.size(); i++) {
        if (_vertexBuffers[i]) {
            RENDERER_SAFE_RELEASE(_vertexBuffers[i]);
        }
        _vertexBuffers[i] = nullptr;
    }
    
    if (_indexBuffer)
    {
        RENDERER_SAFE_RELEASE(_indexBuffer);
    }
    _indexBuffer = nullptr;
    
    if (_program)
    {
        RENDERER_SAFE_RELEASE(_program);
    }
    _program = nullptr;
}

void State::setVertexBuffer(size_t index, VertexBuffer* vertBuf)
{
    if (index >= _vertexBuffers.size())
    {
        _vertexBuffers.resize(index + 1);
    }

    VertexBuffer* oldBuf = _vertexBuffers[index];
    if (oldBuf != vertBuf)
    {
        RENDERER_SAFE_RELEASE(oldBuf);
        _vertexBuffers[index] = vertBuf;
        RENDERER_SAFE_RETAIN(vertBuf);
    }
}

VertexBuffer* State::getVertexBuffer(size_t index) const
{
    if (_vertexBuffers.empty())
        return nullptr;
    assert(index < _vertexBuffers.size());
    return _vertexBuffers[index];
}

void State::setVertexBufferOffset(size_t index, int32_t offset)
{
    if (index >= _vertexBufferOffsets.size())
    {
        _vertexBufferOffsets.resize(index + 1);
    }

    _vertexBufferOffsets[index] = offset;
}

int32_t State::getVertexBufferOffset(size_t index) const
{
    assert(index < _vertexBufferOffsets.size());
    return _vertexBufferOffsets[index];
}

void State::setIndexBuffer(IndexBuffer* indexBuf)
{
    if (_indexBuffer != indexBuf)
    {
        RENDERER_SAFE_RELEASE(_indexBuffer);
        _indexBuffer = indexBuf;
        RENDERER_SAFE_RETAIN(_indexBuffer);
    }
}

IndexBuffer* State::getIndexBuffer() const
{
    return _indexBuffer;
}

void State::setTexture(size_t index, Texture* texture)
{
    if (index >= _textureUnits.size())
    {
        _textureUnits.resize(index + 1);
    }

    Texture* oldTexture = _textureUnits[index];
    if (oldTexture != texture)
    {
        RENDERER_SAFE_RELEASE(oldTexture);
        _textureUnits[index] = texture;
        RENDERER_SAFE_RETAIN(texture);
    }
}

Texture* State::getTexture(size_t index) const
{
    if (_textureUnits.empty())
        return nullptr;
    assert(index < _textureUnits.size());
    return _textureUnits[index];
}

void State::setProgram(Program* program)
{
    assert(program != nullptr);
    if (_program != program)
    {
        RENDERER_SAFE_RELEASE(_program);
        _program = program;
        RENDERER_SAFE_RETAIN(_program);
    }
}

Program* State::getProgram() const
{
    return _program;
}

RENDERER_END
