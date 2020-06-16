#pragma once

#include "core/CoreStd.h"
#include "Define.h"

namespace cc {
class GFXDevice;
class GFXInputAssembler;
class GFXTexture;
class GFXBuffer;
class GFXRenderPass;
class Light;
class Root;
class Model;
class Camera;
} // namespace cc

namespace cc {
namespace pipeline {

class RenderView;

class CC_DLL RenderPipeline : public cc::Object {
public:
    virtual ~RenderPipeline() = default;

    virtual void destroy() = 0;
    virtual cc::vector<cc::Light *>::type &getValidLights() const = 0;
    virtual cc::vector<float>::type &getLightIndexOffsets() const = 0;
    virtual cc::vector<float>::type &getLightIndices() const = 0;
    virtual cc::vector<cc::GFXBuffer *>::type &getLightBuffers() const = 0;

    virtual bool initialize(const RenderPipelineInfo &info);
    virtual bool activate(cc::Root *root);
    virtual void render(RenderView *view);
    virtual void rebuild();
    virtual void resize(uint width, uint height);
    virtual void updateUBOs(RenderView *view);
    virtual void sceneCulling();

    void swapFBOS();
    void addRenderPass(uint stage, cc::GFXRenderPass *renderPass);
    cc::GFXRenderPass *getRenderPass(uint stage) const;
    void removeRenderPass(uint stage);
    void clearRenderPasses();
    void destroyFlows();
    RenderFlow *getFlow(const cc::String &name) const;
    void updateMacros();
    cc::GFXTexture *getTexture(const cc::String &name) const;
    cc::GFXTexture *getRenderTexture(const cc::String &name) const;
    cc::GFXBuffer *getFrameBuffer(const cc::String &name) const;

    //    CC_INLINE const Root* getRoot() const {  }
    CC_INLINE cc::GFXDevice *getDevice() const { return _device; }
    CC_INLINE cc::GFXTexture *getDefaultTexture() const { return _defaultTexture; }
    CC_INLINE cc::GFXInputAssembler *getQuadIA() const { return _quadIA; }
    CC_INLINE const RenderFlowList &getFlows() const { return _flows; }
    CC_INLINE const RenderFlowList &getActiveFlows() const { return _activeFlows; }
    CC_INLINE const RenderObjectList &getRenderObjects() const { return _renderObjects; }
    CC_INLINE float getFpScale() const { return _fpScale; }
    CC_INLINE float getFpScaleInv() const { return _fpScaleInv; }
    CC_INLINE float getShadingScale() const { return _shadingScale; }
    CC_INLINE float getLightMeterScale() const { return _lightMeterScale; }
    CC_INLINE const cc::String &getCurrentShading() const { return _currIdx; }
    CC_INLINE const cc::String &getPreviousShading() const { return _prevIdx; }
    CC_INLINE const cc::String &getName() const { return _name; }
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
    cc::GFXFormat getTextureFormat(cc::GFXFormat format, cc::GFXTextureUsageBit usage) const;

protected:
    cc::String _name;
    cc::String _currIdx = "shading";
    cc::String _prevIdx = "shading1";
    RenderObjectList _renderObjects;
    RenderFlowList _flows;
    RenderFlowList _activeFlows;
    cc::GFXDevice *_device = nullptr;
    cc::GFXInputAssembler *_quadIA = nullptr;
    cc::GFXTexture *_defaultTexture = nullptr;
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
