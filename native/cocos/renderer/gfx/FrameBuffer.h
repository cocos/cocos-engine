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

#include <vector>
#include "../Macro.h"
#include "../Types.h"
#include "GraphicsHandle.h"

RENDERER_BEGIN

class DeviceGraphics;
class RenderTarget;

/**
 * @addtogroup gfx
 * @{
 */

/**
 * The FrameBuffer class can store the render results of DeviceGraphics.
 * It contains color buffers, depth buffers and stencil buffers,
 * they are destinations for drawing, clearing and writing operations during the render process.
 */
class FrameBuffer final : public GraphicsHandle
{
public:
    /**
     * Create a FrameBuffer object with device and size
     */
    RENDERER_DEFINE_CREATE_METHOD_3(FrameBuffer, init,  DeviceGraphics*, uint16_t, uint16_t)

    FrameBuffer();
    /**
     * Inits the frame buffer with device and size
     */
    bool init(DeviceGraphics* device, uint16_t width, uint16_t height);
    /**
     * Destroys the GL buffers created by this frame buffer object
     */
    void destroy();

    /**
     * Sets the color buffers as drawing and clearing destinations
     */
    void setColorBuffers(const std::vector<RenderTarget*>& renderTargets);
    /**
     * Sets a color buffer at specific index
     */
    void setColorBuffer(RenderTarget* rt, int index);
    /**
     * Sets the depth buffer as depth writing destination
     */
    void setDepthBuffer(RenderTarget* rt);
    /**
     * Sets the stencil buffer as stencil writing destination
     */
    void setStencilBuffer(RenderTarget* rt);
    /**
     * Sets the depth and stencil buffer at the same time.
     * If you want to set both with the same RenderTarget, you should use this instead of setting them separatly.
     */
    void setDepthStencilBuffer(RenderTarget* rt);
    
    /**
     * Sets the width of frame buffer
     */
    inline int getWidth() const { return _width; }
    /**
     * Sets the width of frame buffer
     */
    inline int getHeight() const { return _height; }
    
    /**
     * Gets the color buffers
     */
    const std::vector<RenderTarget*>& getColorBuffers() const;
    /**
     * Gets the depth buffer
     */
    const RenderTarget* getDepthBuffer() const;
    /**
     * Gets the stencil buffer
     */
    const RenderTarget* getStencilBuffer() const;
    /**
     * Gets the depth and stencil buffer if they share the same one.
     */
    const RenderTarget* getDepthStencilBuffer() const;

private:
    virtual ~FrameBuffer();

    DeviceGraphics* _device;
    std::vector<RenderTarget*> _colorBuffers;
    RenderTarget* _depthBuffer;
    RenderTarget* _stencilBuffer;
    RenderTarget* _depthStencilBuffer;
    uint16_t _width;
    uint16_t _height;
};

// end of gfx group
/// @}

RENDERER_END
