#ifndef CC_CORE_GFX_WINDOW_H_
#define CC_CORE_GFX_WINDOW_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXWindow : public Object {
 public:
  GFXWindow(GFXDevice* device);
  virtual ~GFXWindow();
  
 public:
  virtual bool initialize(const GFXWindowInfo& info) = 0;
  virtual void destroy() = 0;
  virtual void resize(uint width, uint height) = 0;
  
  CC_INLINE GFXDevice* device() const { return _device; }
  CC_INLINE const String& title() const { return _title; }
  CC_INLINE int left() const { return _left; }
  CC_INLINE int top() const { return _top; }
  CC_INLINE uint width() const { return _width; }
  CC_INLINE uint height() const { return _height; }
  CC_INLINE uint nativeWidth() const { return _nativeWidth; }
  CC_INLINE uint nativeHeight() const { return _nativeHeight; }
  CC_INLINE GFXFormat colorFormat() const { return _colorFmt; }
  CC_INLINE GFXFormat detphStencilFormat() const { return _depthStencilFmt; }
  CC_INLINE bool isOffscreen() const { return _isOffscreen; }
  CC_INLINE GFXRenderPass* renderPass() const { return _renderPass; }
  CC_INLINE GFXTexture* colorTexture() const { return _colorTex; }
  CC_INLINE GFXTextureView* colorTexView() const { return _colorTexView; }
  CC_INLINE GFXTexture* depthStencilTexture() const { return _depthStencilTex; }
  CC_INLINE GFXTextureView* depthStencilTexView() const { return _depthStencilTexView; }
  CC_INLINE GFXFramebuffer* framebuffer() const { return _framebuffer; }
  
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
  GFXTextureView* _colorTexView = nullptr;
  GFXTexture* _depthStencilTex = nullptr;
  GFXTextureView* _depthStencilTexView = nullptr;
  GFXFramebuffer* _framebuffer = nullptr;
};

NS_CC_END

#endif // CC_CORE_GFX_TEXTURE_VIEW_H_
