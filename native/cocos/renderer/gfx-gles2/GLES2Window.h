#ifndef CC_GFXGLES2_GLES2_WINDOW_H_
#define CC_GFXGLES2_GLES2_WINDOW_H_

CC_NAMESPACE_BEGIN

class CC_GLES2_API GLES2Window : public GFXWindow {
public:
  GLES2Window(GFXDevice* device);
  ~GLES2Window();
  
public:
  bool Initialize(const GFXWindowInfo& info);
  void Destroy();
  void Resize(uint width, uint height);
};

CC_NAMESPACE_END

#endif
