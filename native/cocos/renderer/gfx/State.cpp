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

namespace {
    const State __defaultState;
}

State::State()
// blend
: blend(false)
, blendSepartion(false)
, blendColor(0xFFFFFFFF)
, blendEq(BlendOp::ADD)
, blendAlphaEq(BlendOp::ADD)
, blendSrc(BlendFactor::ONE)
, blendDst(BlendFactor::ZERO)
, blendSrcAlpha(BlendFactor::ONE)
, blendDstAlpha(BlendFactor::ZERO)
// depth
, depthTest(false)
, depthWrite(false)
, depthFunc(DepthFunc::LESS)
// stencil
, stencilTest(false)
, stencilSeparation(false)
, stencilFuncFront(StencilFunc::ALWAYS)
, stencilRefFront(0)
, stencilMaskFront(0xFF)
, stencilFailOpFront(StencilOp::KEEP)
, stencilZFailOpFront(StencilOp::KEEP)
, stencilZPassOpFront(StencilOp::KEEP)
, stencilWriteMaskFront(0xFF)
, stencilFuncBack(StencilFunc::ALWAYS)
, stencilRefBack(0)
, stencilMaskBack(0xFF)
, stencilFailOpBack(StencilOp::KEEP)
, stencilZFailOpBack(StencilOp::KEEP)
, stencilZPassOpBack(StencilOp::KEEP)
, stencilWriteMaskBack(0xFF)
// cull-mode
, cullMode(CullMode::BACK)

// primitive-type
, primitiveType(PrimitiveType::TRIANGLES)

// bindings
, maxStream(-1)
, _indexBuffer(nullptr)
, _program(nullptr)
{
}

State::State(const State& o)
{
    *this = o;
}

State::State(State&& o)
{
    *this = std::move(o);
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

State& State::operator=(const State& o)
{
    if (this != &o)
    {
        // blend
        blend = o.blend;
        blendSepartion = o.blendSepartion;
        blendColor = o.blendColor;
        blendEq = o.blendEq;
        blendAlphaEq = o.blendAlphaEq;
        blendSrc = o.blendSrc;
        blendDst = o.blendDst;
        blendSrcAlpha = o.blendSrcAlpha;
        blendDstAlpha = o.blendDstAlpha;
        // depth
        depthTest = o.depthTest;
        depthWrite = o.depthWrite;
        depthFunc = o.depthFunc;
        // stencil
        stencilTest = o.stencilTest;
        stencilSeparation = o.stencilSeparation;
        stencilFuncFront = o.stencilFuncFront;
        stencilRefFront = o.stencilRefFront;
        stencilMaskFront = o.stencilMaskFront;
        stencilFailOpFront = o.stencilFailOpFront;
        stencilZFailOpFront = o.stencilZFailOpFront;
        stencilZPassOpFront = o.stencilZPassOpFront;
        stencilWriteMaskFront = o.stencilWriteMaskFront;
        stencilFuncBack = o.stencilFuncBack;
        stencilRefBack = o.stencilRefBack;
        stencilMaskBack = o.stencilMaskBack;
        stencilFailOpBack = o.stencilFailOpBack;
        stencilZFailOpBack = o.stencilZFailOpBack;
        stencilZPassOpBack = o.stencilZPassOpBack;
        stencilWriteMaskBack = o.stencilWriteMaskBack;
        // cull-mode
        cullMode = o.cullMode;

        // primitive-type
        primitiveType = o.primitiveType;

        // bindings
        maxStream = o.maxStream;

        _vertexBufferOffsets = o._vertexBufferOffsets;

        for (auto vertexBuf : _vertexBuffers)
        {
            RENDERER_SAFE_RELEASE(vertexBuf);
        }

        if (o._vertexBuffers.empty())
        {
            _vertexBuffers.clear();
        }
        else
        {
            _vertexBuffers.resize(o._vertexBuffers.size());

            for (size_t i = 0, len = o._vertexBuffers.size(); i < len; ++i)
            {
                _vertexBuffers[i] = o._vertexBuffers[i];
                RENDERER_SAFE_RETAIN(_vertexBuffers[i]);
            }
        }

        if (_indexBuffer != o._indexBuffer)
        {
            RENDERER_SAFE_RETAIN(o._indexBuffer);
            RENDERER_SAFE_RELEASE(_indexBuffer);
            _indexBuffer = o._indexBuffer;
        }

        for (auto texture : _textureUnits)
        {
            RENDERER_SAFE_RELEASE(texture);
        }

        if (o._textureUnits.empty())
        {
            _textureUnits.clear();
        }
        else
        {
            _textureUnits.resize(o._textureUnits.size());
            for (size_t i = 0, len = o._textureUnits.size(); i < len; ++i)
            {
                _textureUnits[i] = o._textureUnits[i];
                RENDERER_SAFE_RETAIN(_textureUnits[i]);
            }
        }

        if (_program != o._program)
        {
            RENDERER_SAFE_RETAIN(o._program);
            RENDERER_SAFE_RELEASE(_program);
            _program = o._program;
        }
    }

    return *this;
}

State& State::operator=(State&& o)
{
    if (this != &o)
    {
        // blend
        blend = o.blend;
        blendSepartion = o.blendSepartion;
        blendColor = o.blendColor;
        blendEq = o.blendEq;
        blendAlphaEq = o.blendAlphaEq;
        blendSrc = o.blendSrc;
        blendDst = o.blendDst;
        blendSrcAlpha = o.blendSrcAlpha;
        blendDstAlpha = o.blendDstAlpha;
        // depth
        depthTest = o.depthTest;
        depthWrite = o.depthWrite;
        depthFunc = o.depthFunc;
        // stencil
        stencilTest = o.stencilTest;
        stencilSeparation = o.stencilSeparation;
        stencilFuncFront = o.stencilFuncFront;
        stencilRefFront = o.stencilRefFront;
        stencilMaskFront = o.stencilMaskFront;
        stencilFailOpFront = o.stencilFailOpFront;
        stencilZFailOpFront = o.stencilZFailOpFront;
        stencilZPassOpFront = o.stencilZPassOpFront;
        stencilWriteMaskFront = o.stencilWriteMaskFront;
        stencilFuncBack = o.stencilFuncBack;
        stencilRefBack = o.stencilRefBack;
        stencilMaskBack = o.stencilMaskBack;
        stencilFailOpBack = o.stencilFailOpBack;
        stencilZFailOpBack = o.stencilZFailOpBack;
        stencilZPassOpBack = o.stencilZPassOpBack;
        stencilWriteMaskBack = o.stencilWriteMaskBack;
        // cull-mode
        cullMode = o.cullMode;

        // primitive-type
        primitiveType = o.primitiveType;

        // bindings
        maxStream = o.maxStream;

        _vertexBufferOffsets = std::move(o._vertexBufferOffsets);

        for (auto vertexBuf : _vertexBuffers)
        {
            RENDERER_SAFE_RELEASE(vertexBuf);
        }
        _vertexBuffers = std::move(o._vertexBuffers);

        RENDERER_SAFE_RELEASE(_indexBuffer);
        _indexBuffer = o._indexBuffer;
        o._indexBuffer = nullptr;

        for (auto texture : _textureUnits)
        {
            RENDERER_SAFE_RELEASE(texture);
        }
        _textureUnits = std::move(o._textureUnits);

        RENDERER_SAFE_RELEASE(_program);
        _program = o._program;
        o._program = nullptr;

        // reset o
        o.blend = false;
        o.blendSepartion = false;
        o.blendColor = 0xFFFFFFFF;
        o.blendEq = BlendOp::ADD;
        o.blendAlphaEq = BlendOp::ADD;
        o.blendSrc = BlendFactor::ONE;
        o.blendDst = BlendFactor::ZERO;
        o.blendSrcAlpha = BlendFactor::ONE;
        o.blendDstAlpha = BlendFactor::ZERO;
        // depth
        o.depthTest = false;
        o.depthWrite = false;
        o.depthFunc = DepthFunc::LESS;
        // stencil
        o.stencilTest = false;
        o.stencilSeparation = false;
        o.stencilFuncFront = StencilFunc::ALWAYS;
        o.stencilRefFront = 0;
        o.stencilMaskFront = 0xFF;
        o.stencilFailOpFront = StencilOp::KEEP;
        o.stencilZFailOpFront = StencilOp::KEEP;
        o.stencilZPassOpFront = StencilOp::KEEP;
        o.stencilWriteMaskFront = 0xFF;
        o.stencilFuncBack = StencilFunc::ALWAYS;
        o.stencilRefBack = 0;
        o.stencilMaskBack = 0xFF;
        o.stencilFailOpBack = StencilOp::KEEP;
        o.stencilZFailOpBack = StencilOp::KEEP;
        o.stencilZPassOpBack = StencilOp::KEEP;
        o.stencilWriteMaskBack = 0xFF;
        // cull-mode
        o.cullMode = CullMode::BACK;

        // primitive-type
        o.primitiveType = PrimitiveType::TRIANGLES;

        // bindings
        o.maxStream = -1;
    }

    return *this;
}

void State::reset()
{
    *this = __defaultState;
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
