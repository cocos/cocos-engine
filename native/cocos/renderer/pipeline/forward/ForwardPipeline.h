#pragma once

#include "../RenderPipeline.h"

namespace cc {
namespace pipeline {
struct Light;
struct UBOGlobal;
struct UBOShadow;
struct Fog;
struct Ambient;
struct Skybox;
struct Shadows;
struct Sphere;

class CC_DLL ForwardPipeline : public RenderPipeline {
public:
    ForwardPipeline() = default;
    ~ForwardPipeline() = default;

    virtual bool initialize(const RenderPipelineInfo &info) override;
    virtual void destroy() override;
    virtual bool activate() override;
    virtual void render(const vector<RenderView *> &views) override;

    void updateUBOs(RenderView *view);
    CC_INLINE void setHDR(bool isHDR) { _isHDR = isHDR; }

    gfx::RenderPass *getOrCreateRenderPass(gfx::ClearFlags clearFlags);
    void setFog(uint);
    void setAmbient(uint);
    void setSkybox(uint);
    void setShadows(uint);

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
    CC_INLINE Sphere *getReceivedSphere() const { return _receivedSphere; }

    void setRenderObjcts(const RenderObjectList &ro) { _renderObjects = std::move(ro); }
    void setShadowObjects(const RenderObjectList &ro) { _shadowObjects = std::move(ro); }

private:
    bool activeRenderer();
    void updateUBO(RenderView *);

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
    std::array<float, UBOShadow::COUNT> _shadowUBO;
    Sphere *_sphere = nullptr;
    Sphere *_receivedSphere = nullptr;

    float _shadingScale = 1.0f;
    bool _isHDR = false;
    float _fpScale = 1.0f / 1024.0f;
};

} // namespace pipeline
} // namespace cc
