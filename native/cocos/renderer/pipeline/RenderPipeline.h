#pragma once

#include "core/CoreStd.h"
#include "Define.h"

namespace cc {
class Light;
class Root;
class Model;
class Camera;

namespace gfx {
class Device;
class InputAssembler;
class Texture;
class Buffer;
class RenderPass;
} // namespace gfx

namespace pipeline {

class RenderView;

struct CC_DLL RenderPipelineInfo {
    //TODO
};

class CC_DLL RenderPipeline : public gfx::Object {
public:
    virtual ~RenderPipeline() = default;

    virtual void destroy() = 0;
    virtual vector<cc::Light *> &getValidLights() const = 0;
    virtual vector<float> &getLightIndexOffsets() const = 0;
    virtual vector<float> &getLightIndices() const = 0;
    virtual vector<gfx::Buffer *> &getLightBuffers() const = 0;

    virtual bool activate(cc::Root *root);
    virtual bool initialize(const RenderPipelineInfo &info);
    virtual void rebuild();
    virtual void render(RenderView *view);
    virtual void resize(uint width, uint height);
    virtual void sceneCulling();
    virtual void updateUBOs(RenderView *view);

    void addRenderPass(uint stage, gfx::RenderPass *renderPass);
    void clearRenderPasses();
    void destroyFlows();
    RenderFlow *getFlow(const String &name) const;
    gfx::Buffer *getFrameBuffer(const String &name) const;
    gfx::RenderPass *getRenderPass(uint stage) const;
    gfx::Texture *getRenderTexture(const String &name) const;
    gfx::Texture *getTexture(const String &name) const;
    void removeRenderPass(uint stage);
    void swapFBOS();
    void updateMacros();

    //    CC_INLINE const Root* getRoot() const {  }
    CC_INLINE const RenderFlowList &getActiveFlows() const { return _activeFlows; }
    CC_INLINE const RenderFlowList &getFlows() const { return _flows; }
    CC_INLINE const String &getCurrentShading() const { return _currIdx; }
    CC_INLINE const String &getPreviousShading() const { return _prevIdx; }
    CC_INLINE gfx::Device *getDevice() const { return _device; }
    CC_INLINE gfx::Texture *getDefaultTexture() const { return _defaultTexture; }
    CC_INLINE float getLightMeterScale() const { return _lightMeterScale; }
    CC_INLINE float getFpScale() const { return _fpScale; }
    CC_INLINE float getFpScaleInv() const { return _fpScaleInv; }
    CC_INLINE const RenderObjectList &getRenderObjects() const { return _renderObjects; }
    CC_INLINE float getShadingScale() const { return _shadingScale; }
    CC_INLINE gfx::InputAssembler *getQuadIA() const { return _quadIA; }
    
    CC_INLINE const String &getName() const { return _name; }
    CC_INLINE bool isHDRSupported() const { return _isHDRSupported; }
    CC_INLINE bool isUsePostProcess() const { return _isUsePostProcess; }
    CC_INLINE bool isHDR() const { return _isHDR; }
    CC_INLINE bool isUseMSAA() const { return _isUseMSAA; }
    // public get globalBindings
    // public get macros (): IDefineMap
    // public get defaultGlobalUBOData ()

protected:
    void initRenderResource();
    // _destroy() in JS.
    void doDestroy();
    void resizeFOBs(uint width, uint height);
    bool createQuadInputAssembler();
    void destroyQuadInputAssembler();
    bool createUBOs();
    void destroyUBOs();
    void addVisibleModel(cc::Model *model, cc::Camera *camera);

private:
    void activateFlow(RenderFlow *flow);
    gfx::Format getTextureFormat(gfx::Format format, gfx::TextureUsageBit usage) const;

protected:
    String _name;
    String _currIdx = "shading";
    String _prevIdx = "shading1";
    RenderObjectList _renderObjects;
    RenderFlowList _flows;
    RenderFlowList _activeFlows;
    gfx::Device *_device = nullptr;
    gfx::InputAssembler *_quadIA = nullptr;
    gfx::Texture *_defaultTexture = nullptr;
    float _shadingScale = 1.f;
    float _lightMeterScale = 1000.f;
    float _fpScale = 1.f / 1024;
    float _fpScaleInv = 1024.0;
    bool _isUsePostProcess = false;
    bool _isHDRSupported = false;
    bool _isHDR = false;
    bool _isUseMSAA = false;
    bool _isUseDynamicBatching = false;
};

} // namespace pipeline
} // namespace cc
