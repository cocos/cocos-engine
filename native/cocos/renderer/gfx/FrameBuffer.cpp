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

#include "FrameBuffer.h"
#include "RenderTarget.h"
#include "base/CCGLUtils.h"

RENDERER_BEGIN

FrameBuffer::FrameBuffer()
: _device(nullptr)
, _depthBuffer(nullptr)
, _stencilBuffer(nullptr)
, _depthStencilBuffer(nullptr)
{

}

FrameBuffer::~FrameBuffer()
{
    destroy();
}

void FrameBuffer::destroy()
{
    for (auto colorBufffer : _colorBuffers)
        RENDERER_SAFE_RELEASE(colorBufffer);
    _colorBuffers.clear();
    
    RENDERER_SAFE_RELEASE(_depthBuffer);
    _depthBuffer = nullptr;
    
    RENDERER_SAFE_RELEASE(_stencilBuffer);
    _stencilBuffer = nullptr;
    
    RENDERER_SAFE_RELEASE(_depthStencilBuffer);
    _depthStencilBuffer = nullptr;
    
    if (_glID != 0)
    {
        glDeleteFramebuffers(1, &_glID);
        _glID = 0;
    }
}

bool FrameBuffer::init(DeviceGraphics* device, uint16_t width, uint16_t height)
{
    _device = device;
    _width = width;
    _height = height;

    glGenFramebuffers(1, &_glID);

    return true;
}

void FrameBuffer::setColorBuffer(RenderTarget* rt, int index)
{
    if (index >= _colorBuffers.size())
        _colorBuffers.resize(index + 1);
    
    RENDERER_SAFE_RETAIN(rt);
    RENDERER_SAFE_RELEASE(_colorBuffers[index]);
    _colorBuffers[index] = rt;
}

void FrameBuffer::setColorBuffers(const std::vector<RenderTarget*>& renderTargets)
{
    for (auto& colorBufffer : renderTargets)
        RENDERER_SAFE_RETAIN(colorBufffer);
    for (auto& colorBufffer : _colorBuffers)
        RENDERER_SAFE_RELEASE(colorBufffer);
    _colorBuffers = renderTargets;
}

void FrameBuffer::setDepthBuffer(RenderTarget* rt)
{
    RENDERER_SAFE_RETAIN(rt);
    RENDERER_SAFE_RELEASE(_depthBuffer);
    _depthBuffer = rt;
}

void FrameBuffer::setStencilBuffer(RenderTarget* rt)
{
    RENDERER_SAFE_RETAIN(rt);
    RENDERER_SAFE_RELEASE(_stencilBuffer);
    _stencilBuffer = rt;
}

void FrameBuffer::setDepthStencilBuffer(RenderTarget* rt)
{
    RENDERER_SAFE_RETAIN(rt);
    RENDERER_SAFE_RELEASE(_depthStencilBuffer);
    _depthStencilBuffer = rt;
}

const std::vector<RenderTarget*>& FrameBuffer::getColorBuffers() const
{
    return _colorBuffers;
}

const RenderTarget* FrameBuffer::getDepthBuffer() const
{
    return _depthBuffer;
}

const RenderTarget* FrameBuffer::getStencilBuffer() const
{
    return _stencilBuffer;
}

const RenderTarget* FrameBuffer::getDepthStencilBuffer() const
{
    return _depthStencilBuffer;
}

RENDERER_END


