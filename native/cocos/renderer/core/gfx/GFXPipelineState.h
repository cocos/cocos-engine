#ifndef CC_CORE_GFX_PIPELINE_STATE_H_
#define CC_CORE_GFX_PIPELINE_STATE_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXPipelineState : public Object {
 public:
  GFXPipelineState(GFXDevice* device);
  virtual ~GFXPipelineState();
  
public:
  virtual bool initialize(const GFXPipelineStateInfo& info) = 0;
  virtual void destroy() = 0;
  
  CC_INLINE GFXDevice* getDevice() const { return _device; }
  CC_INLINE GFXShader* getShader() const { return _shader; }
  CC_INLINE GFXPrimitiveMode getPrimitive() const { return _primitive; }
  CC_INLINE const GFXInputState& getInputState() const { return _inputState; }
  CC_INLINE const GFXRasterizerState& getRasterizerState() const { return _rasterizerState; }
  CC_INLINE const GFXDepthStencilState& getDepthStencilState() const { return _depthStencilState; }
  CC_INLINE const GFXBlendState& getBlendState() const { return _blendState; }
  CC_INLINE const GFXDynamicStateList& getDynamicStates() const { return _dynamicStates; }
  CC_INLINE const GFXPipelineLayout* getPipelineLayout() const { return _layout; }
  CC_INLINE const GFXRenderPass* getRenderPass() const { return _renderPass; }

protected:
  GFXDevice* _device = nullptr;
  GFXShader* _shader = nullptr;
  GFXPrimitiveMode _primitive = GFXPrimitiveMode::TRIANGLE_LIST;
  GFXInputState _inputState;
  GFXRasterizerState _rasterizerState;
  GFXDepthStencilState _depthStencilState;
  GFXBlendState _blendState;
  GFXDynamicStateList _dynamicStates;
  GFXPipelineLayout* _layout = nullptr;
  GFXRenderPass* _renderPass = nullptr;
};

NS_CC_END

#endif // CC_CORE_GFX_PIPELINE_STATE_H_
