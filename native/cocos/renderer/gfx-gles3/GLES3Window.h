#ifndef CC_GFXGLES3_GLES3_WINDOW_H_
#define CC_GFXGLES3_GLES3_WINDOW_H_

CC_NAMESPACE_BEGIN

class CC_GLES3_API GLES3Window : public GFXWindow {
public:
  GLES3Window(GFXDevice* device);
  ~GLES3Window();
  
public:
  bool Initialize(const GFXWindowInfo& info);
  void Destroy();
  void Resize(uint width, uint height);
};

CC_NAMESPACE_END

#endif
