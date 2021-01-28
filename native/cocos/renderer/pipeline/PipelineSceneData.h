/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

#include "helper/SharedMemory.h"
#include "Define.h"

namespace cc {

namespace gfx {
class Framebuffer;
}

namespace pipeline {

class RenderPipeline;

class CC_DLL PipelineSceneData : public Object {
public:
    PipelineSceneData() = default;
    virtual ~PipelineSceneData() = default;
    void activate(gfx::Device *device, RenderPipeline *pipeline);
    void setPipelineSharedSceneData (uint handle);
    void destroy();

    CC_INLINE void setShadowFramebuffer(const Light *light, gfx::Framebuffer *framebuffer) { _shadowFrameBufferMap.emplace(light, framebuffer); }
    CC_INLINE const std::unordered_map<const Light *, gfx::Framebuffer *> &getShadowFramebufferMap() const { return _shadowFrameBufferMap; }
    CC_INLINE PipelineSharedSceneData* getSharedData() const { return _sharedSceneData; }
    CC_INLINE const RenderObjectList &getRenderObjects() const { return _renderObjects; }
    CC_INLINE const RenderObjectList &getShadowObjects() const { return _shadowObjects; }
    CC_INLINE void setRenderObjects(RenderObjectList &&ro) { _renderObjects = std::forward<RenderObjectList>(ro); }
    CC_INLINE void setShadowObjects(RenderObjectList &&ro) { _shadowObjects = std::forward<RenderObjectList>(ro); }
    CC_INLINE Sphere* getSphere() const {return _sphere; }
private:
    RenderObjectList _renderObjects;
    RenderObjectList _shadowObjects;
    
    PipelineSharedSceneData *_sharedSceneData = nullptr;
    RenderPipeline *_pipeline = nullptr;
    gfx::Device *_device = nullptr;
    Sphere *_sphere = nullptr;
    
    std::unordered_map<const Light *, gfx::Framebuffer *> _shadowFrameBufferMap;
};

} // namespace pipeline
} // namespace cc
