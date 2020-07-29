#ifndef CC_CORE_GFX_PIPELINE_STATE_H_
#define CC_CORE_GFX_PIPELINE_STATE_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_DLL PipelineState : public GFXObject {
public:
    PipelineState(Device *device);
    virtual ~PipelineState();

public:
    virtual bool initialize(const PipelineStateInfo &info) = 0;
    virtual void destroy() = 0;

    CC_INLINE Device *getDevice() const { return _device; }
    CC_INLINE Shader *getShader() const { return _shader; }
    CC_INLINE PrimitiveMode getPrimitive() const { return _primitive; }
    CC_INLINE DynamicStateFlags getDynamicStates() const { return _dynamicStates; }
    CC_INLINE const InputState &getInputState() const { return _inputState; }
    CC_INLINE const RasterizerState &getRasterizerState() const { return _rasterizerState; }
    CC_INLINE const DepthStencilState &getDepthStencilState() const { return _depthStencilState; }
    CC_INLINE const BlendState &getBlendState() const { return _blendState; }
    CC_INLINE const RenderPass *getRenderPass() const { return _renderPass; }

protected:
    Device *_device = nullptr;
    Shader *_shader = nullptr;
    PrimitiveMode _primitive = PrimitiveMode::TRIANGLE_LIST;
    DynamicStateFlags _dynamicStates = DynamicStateFlags::NONE;
    InputState _inputState;
    RasterizerState _rasterizerState;
    DepthStencilState _depthStencilState;
    BlendState _blendState;
    RenderPass *_renderPass = nullptr;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_PIPELINE_STATE_H_
