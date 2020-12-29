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

#include "../RenderPipeline.h"
#include "../helper/SharedMemory.h"

namespace cc {
namespace pipeline {
struct UBOGlobal;
struct UBOCamera;
struct UBOShadow;
struct Fog;
struct Ambient;
struct Skybox;
struct Shadows;
struct Sphere;
struct Camera;
class Framebuffer;

class CC_DLL ForwardPipeline : public RenderPipeline {
public:
    ForwardPipeline() = default;
    ~ForwardPipeline() = default;

    virtual bool initialize(const RenderPipelineInfo &info) override;
    virtual void destroy() override;
    virtual bool activate() override;
    virtual void render(const vector<uint> &cameras) override;

    void updateGlobalUBO();
    void updateCameraUBO(Camera *camera);
    void updateShadowUBO(Camera *camera);
    CC_INLINE void setHDR(bool isHDR) { _isHDR = isHDR; }

    gfx::RenderPass *getOrCreateRenderPass(gfx::ClearFlags clearFlags);
    void setFog(uint);
    void setAmbient(uint);
    void setSkybox(uint);
    void setShadows(uint);
    void destroyShadowFrameBuffers();

    CC_INLINE void setShadowFramebuffer(const Light *light, gfx::Framebuffer *framebuffer) { _shadowFrameBufferMap.emplace(light, framebuffer); }
    CC_INLINE const std::unordered_map<const Light *, gfx::Framebuffer *> &getShadowFramebufferMap() const { return _shadowFrameBufferMap; }
    CC_INLINE gfx::Buffer *getLightsUBO() const { return _lightsUBO; }
    CC_INLINE const LightList &getValidLights() const { return _validLights; }
    CC_INLINE const gfx::BufferList &getLightBuffers() const { return _lightBuffers; }
    CC_INLINE const UintList &getLightIndexOffsets() const { return _lightIndexOffsets; }
    CC_INLINE const UintList &getLightIndices() const { return _lightIndices; }
    CC_INLINE const RenderObjectList &getRenderObjects() const { return _renderObjects; }
    CC_INLINE const RenderObjectList &getShadowObjects() const { return _shadowObjects; }
    CC_INLINE const gfx::CommandBufferList &getCommandBuffers() const { return _commandBuffers; }
    CC_INLINE float getShadingScale() const { return _shadingScale; }
    CC_INLINE float getFpScale() const { return _fpScale; }
    CC_INLINE bool isHDR() const { return _isHDR; }
    CC_INLINE const Fog *getFog() const { return _fog; }
    CC_INLINE const Ambient *getAmbient() const { return _ambient; }
    CC_INLINE const Skybox *getSkybox() const { return _skybox; }
    CC_INLINE Shadows *getShadows() const { return _shadows; }
    CC_INLINE Sphere *getSphere() const { return _sphere; }
    CC_INLINE std::array<float, UBOShadow::COUNT> getShadowUBO() const { return _shadowUBO; }

    CC_INLINE void setRenderObjects(RenderObjectList &&ro) { _renderObjects = std::forward<RenderObjectList>(ro); }
    CC_INLINE void setShadowObjects(RenderObjectList &&ro) { _shadowObjects = std::forward<RenderObjectList>(ro); }

private:
    bool activeRenderer();
    void updateUBO(Camera *);

private:
    const Fog *_fog = nullptr;
    const Ambient *_ambient = nullptr;
    const Skybox *_skybox = nullptr;
    Shadows *_shadows = nullptr;
    gfx::Buffer *_lightsUBO = nullptr;
    LightList _validLights;
    gfx::BufferList _lightBuffers;
    UintList _lightIndexOffsets;
    UintList _lightIndices;
    RenderObjectList _renderObjects;
    RenderObjectList _shadowObjects;
    map<gfx::ClearFlags, gfx::RenderPass *> _renderPasses;
    std::array<float, UBOGlobal::COUNT> _globalUBO;
    std::array<float, UBOCamera::COUNT> _cameraUBO;
    std::array<float, UBOShadow::COUNT> _shadowUBO;
    Sphere *_sphere = nullptr;

    float _shadingScale = 1.0f;
    bool _isHDR = false;
    float _fpScale = 1.0f / 1024.0f;

    std::unordered_map<const Light *, gfx::Framebuffer *> _shadowFrameBufferMap;
};

} // namespace pipeline
} // namespace cc
