#ifndef CC_CORE_GFX_FRAME_BUFFER_H_
#define CC_CORE_GFX_FRAME_BUFFER_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXFramebuffer : public Object {
 public:
  GFXFramebuffer(GFXDevice* device);
  virtual ~GFXFramebuffer();
  
 public:
  virtual bool initialize(const GFXFramebufferInfo& info) = 0;
  virtual void destroy() = 0;
  
  CC_INLINE GFXDevice* getDevice() const { return _device; }
  CC_INLINE GFXRenderPass* getRenderPass() const { return _renderPass; }
  CC_INLINE const GFXTextureViewList& getColorViews() const { return _colorViews; }
  CC_INLINE GFXTextureView* getDepthStencilView() const { return _depthStencilView; }
  CC_INLINE bool isOffscreen() const { return _isOffscreen; }
  
 protected:
  GFXDevice* _device = nullptr;
  GFXRenderPass* _renderPass = nullptr;
  GFXTextureViewList _colorViews;
  GFXTextureView* _depthStencilView = nullptr;
  bool _isOffscreen = true;
};

NS_CC_END

#endif // CC_CORE_GFX_FRAME_BUFFER_H_
