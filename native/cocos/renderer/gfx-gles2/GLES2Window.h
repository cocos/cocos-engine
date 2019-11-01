#ifndef CC_GFXGLES2_GLES2_WINDOW_H_
#define CC_GFXGLES2_GLES2_WINDOW_H_

NS_CC_BEGIN

class CC_GLES2_API GLES2Window : public GFXWindow {
public:
  GLES2Window(GFXDevice* device);
  ~GLES2Window();
  
public:
  bool Initialize(const GFXWindowInfo& info);
  void Destroy();
  void Resize(uint width, uint height);
};

NS_CC_END

#endif
