#ifndef CC_GFXGLES2_GLES2_WINDOW_H_
#define CC_GFXGLES2_GLES2_WINDOW_H_

NS_CC_BEGIN

class CC_GLES2_API GLES2Window : public GFXWindow {
public:
  GLES2Window(GFXDevice* device);
  ~GLES2Window();
  
public:
  bool initialize(const GFXWindowInfo& info);
  void destroy();
  void resize(uint width, uint height);
};

NS_CC_END

#endif
