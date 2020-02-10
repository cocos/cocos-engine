#ifndef CC_CORE_GFX_RENDER_PASS_H_
#define CC_CORE_GFX_RENDER_PASS_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXRenderPass : public Object {
 public:
  GFXRenderPass(GFXDevice* device);
  virtual ~GFXRenderPass();
  
 public:
  virtual bool initialize(const GFXRenderPassInfo& info) = 0;
  virtual void destroy() = 0;
  
  CC_INLINE GFXDevice* device() const { return _device; }
  CC_INLINE const GFXColorAttachmentList& colorAttachments() const { return _colorAttachments; }
  CC_INLINE const GFXDepthStencilAttachment& depthStencilAttachment() const { return _depthStencilAttachment; }
  CC_INLINE const GFXSubPassList& subPasses() const { return _subPasses; }

 protected:
  GFXDevice* _device = nullptr;
  GFXColorAttachmentList _colorAttachments;
  GFXDepthStencilAttachment _depthStencilAttachment;
  GFXSubPassList _subPasses;
};

NS_CC_END

#endif // CC_CORE_GFX_RENDER_PASS_H_
