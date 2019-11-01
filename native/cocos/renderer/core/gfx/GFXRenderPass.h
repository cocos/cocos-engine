#ifndef CC_CORE_GFX_RENDER_PASS_H_
#define CC_CORE_GFX_RENDER_PASS_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXRenderPass : public Object {
 public:
  GFXRenderPass(GFXDevice* device);
  virtual ~GFXRenderPass();
  
 public:
  virtual bool Initialize(const GFXRenderPassInfo& info) = 0;
  virtual void Destroy() = 0;
  
  CC_INLINE GFXDevice* device() const { return device_; }
  CC_INLINE const GFXColorAttachmentList& color_attachments() const { return color_attachments_; }
  CC_INLINE const GFXDepthStencilAttachment& depth_stencil_attachment() const { return depth_stencil_attachment_; }
  CC_INLINE const GFXSubPassList& sub_passes() const { return sub_passes_; }

 protected:
  GFXDevice* device_;
  GFXColorAttachmentList color_attachments_;
  GFXDepthStencilAttachment depth_stencil_attachment_;
  GFXSubPassList sub_passes_;
};

NS_CC_END

#endif // CC_CORE_GFX_RENDER_PASS_H_
