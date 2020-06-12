#pragma once

#include "core/CoreStd.h"
#include "Define.h"

NS_CC_BEGIN
class GFXDevice;
class GFXInputAssembler;
class GFXTexture;
class GFXBuffer;
class GFXRenderPass;
class Light;
class Root;
class Model;
class Camera;
NS_CC_END

NS_PP_BEGIN

class RenderView;

class CC_DLL RenderPipeline : public cocos2d::Object {
public:
    virtual ~RenderPipeline() = default;

    virtual void destroy() = 0;
    virtual cocos2d::vector<cocos2d::Light *>::type &getValidLights() const = 0;
    virtual cocos2d::vector<float>::type &getLightIndexOffsets() const = 0;
    virtual cocos2d::vector<float>::type &getLightIndices() const = 0;
    virtual cocos2d::vector<cocos2d::GFXBuffer *>::type &getLightBuffers() const = 0;

    virtual bool initialize(const RenderPipelineInfo &info);
    virtual bool activate(cocos2d::Root *root);
    virtual void render(RenderView *view);
    virtual void rebuild();
    virtual void resize(uint width, uint height);
    virtual void updateUBOs(RenderView *view);
    virtual void sceneCulling();

    void swapFBOS();
    void addRenderPass(uint stage, cocos2d::GFXRenderPass *renderPass);
    cocos2d::GFXRenderPass *getRenderPass(uint stage) const;
    void removeRenderPass(uint stage);
    void clearRenderPasses();
    void destroyFlows();
    RenderFlow *getFlow(const cocos2d::String &name) const;
    void updateMacros();
    cocos2d::GFXTexture *getTexture(const cocos2d::String &name) const;
    cocos2d::GFXTexture *getRenderTexture(const cocos2d::String &name) const;
    cocos2d::GFXBuffer *getFrameBuffer(const cocos2d::String &name) const;

    //    CC_INLINE const Root* getRoot() const {  }
    CC_INLINE cocos2d::GFXDevice *getDevice() const { return _device; }
    CC_INLINE cocos2d::GFXTexture *getDefaultTexture() const { return _defaultTexture; }
    CC_INLINE cocos2d::GFXInputAssembler *getQuadIA() const { return _quadIA; }
    CC_INLINE const RenderFlowList &getFlows() const { return _flows; }
    CC_INLINE const RenderFlowList &getActiveFlows() const { return _activeFlows; }
    CC_INLINE const RenderObjectList &getRenderObjects() const { return _renderObjects; }
    CC_INLINE float getFpScale() const { return _fpScale; }
    CC_INLINE float getFpScaleInv() const { return _fpScaleInv; }
    CC_INLINE float getShadingScale() const { return _shadingScale; }
    CC_INLINE float getLightMeterScale() const { return _lightMeterScale; }
    CC_INLINE const cocos2d::String &getCurrentShading() const { return _currIdx; }
    CC_INLINE const cocos2d::String &getPreviousShading() const { return _prevIdx; }
    CC_INLINE const cocos2d::String &getName() const { return _name; }
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
    void addVisibleModel(cocos2d::Model *model, cocos2d::Camera *camera);

private:
    void activateFlow(RenderFlow *flow);
    cocos2d::GFXFormat getTextureFormat(cocos2d::GFXFormat format, cocos2d::GFXTextureUsageBit usage) const;

protected:
    cocos2d::String _name;
    cocos2d::String _currIdx = "shading";
    cocos2d::String _prevIdx = "shading1";
    RenderObjectList _renderObjects;
    RenderFlowList _flows;
    RenderFlowList _activeFlows;
    cocos2d::GFXDevice *_device = nullptr;
    cocos2d::GFXInputAssembler *_quadIA = nullptr;
    cocos2d::GFXTexture *_defaultTexture = nullptr;
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

NS_PP_END
