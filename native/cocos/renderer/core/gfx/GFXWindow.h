#ifndef CC_CORE_GFX_WINDOW_H_
#define CC_CORE_GFX_WINDOW_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXWindow : public GFXObject {
 public:
  GFXWindow(GFXDevice* device);
  virtual ~GFXWindow();
  
 public:
  virtual bool initialize(const GFXWindowInfo& info) = 0;
  virtual void destroy() = 0;
  virtual void resize(uint width, uint height) = 0;
  
  CC_INLINE GFXDevice* getDevice() const { return _device; }
  CC_INLINE const String& getTitle() const { return _title; }
  CC_INLINE int getLeft() const { return _left; }
  CC_INLINE int getTop() const { return _top; }
  CC_INLINE uint getWidth() const { return _width; }
  CC_INLINE uint getHeight() const { return _height; }
  CC_INLINE uint getNativeWidth() const { return _nativeWidth; }
  CC_INLINE uint getNativeHeight() const { return _nativeHeight; }
  CC_INLINE GFXFormat getColorFormat() const { return _colorFmt; }
  CC_INLINE GFXFormat getDepthStencilFormat() const { return _depthStencilFmt; }
  CC_INLINE bool isOffscreen() const { return _isOffscreen; }
  CC_INLINE GFXRenderPass* getRenderPass() const { return _renderPass; }
  CC_INLINE GFXTexture* getColorTexture() const { return _colorTex; }
  CC_INLINE GFXTexture* getDepthStencilTexture() const { return _depthStencilTex; }
  CC_INLINE GFXFramebuffer* getFramebuffer() const { return _framebuffer; }
  
 protected:
  GFXDevice* _device = nullptr;
  String _title;
  int _left = 0;
  int _top = 0;
  uint _width = 0;
  uint _height = 0;
  uint _nativeWidth = 0;
  uint _nativeHeight = 0;
  GFXFormat _colorFmt = GFXFormat::UNKNOWN;
  GFXFormat _depthStencilFmt = GFXFormat::UNKNOWN;
  bool _isOffscreen = false;
  bool _isFullscreen = false;
  GFXRenderPass* _renderPass = nullptr;
  GFXTexture* _colorTex = nullptr;
  GFXTexture* _depthStencilTex = nullptr;
  GFXFramebuffer* _framebuffer = nullptr;
};

NS_CC_END

#endif // CC_CORE_GFX_TEXTURE_VIEW_H_
