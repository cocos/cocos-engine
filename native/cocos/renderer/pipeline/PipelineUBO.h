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

#include <array>
#include "helper/SharedMemory.h"
#include "Define.h"

namespace cc {

class Mat4;
class Color;

namespace pipeline {

class RenderPipeline;
class Device;

class CC_DLL PipelineUBO : public Object  {
public:
    static void updateGlobalUBOView(const RenderPipeline *pipeline, std::array<float, UBOGlobal::COUNT> &bufferView);
    static void updateCameraUBOView(const RenderPipeline *pipeline, std::array<float, UBOCamera::COUNT> &bufferView, const Camera *camera, bool hasOffScreenAttachments);
    static void updateShadowUBOView(const RenderPipeline *pipeline, std::array<float, UBOShadow::COUNT> &bufferView, const Camera *camera);
    static void updateShadowUBOLightView(const RenderPipeline *pipeline, std::array<float, UBOShadow::COUNT> &bufferView, const Light *light);
    
public:
    PipelineUBO() = default;
    virtual ~PipelineUBO() = default;
    void activate(gfx::Device *device, RenderPipeline *pipeline);
    void destroy();
    void updateGlobalUBO();
    void updateCameraUBO(const Camera *camera, bool hasOffScreenAttachments);
    void updateShadowUBO(const Camera *camera);
    void updateShadowUBOLight(const Light *light);
    void updateShadowUBORange(uint offset, const Mat4* data);
    void destroyShadowFrameBuffers();
private:
    RenderPipeline *_pipeline = nullptr;
    gfx::Device *_device = nullptr;
    
    std::array<float, UBOGlobal::COUNT> _globalUBO;
    std::array<float, UBOCamera::COUNT> _cameraUBO;
    std::array<float, UBOShadow::COUNT> _shadowUBO;
};

} // namespace pipeline
} // namespace cc
