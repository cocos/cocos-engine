#ifndef CC_GFXGLES2_GLES2_BINDING_LAYOUT_H_
#define CC_GFXGLES2_GLES2_BINDING_LAYOUT_H_

NS_CC_BEGIN

class GLES2GPUBindingLayout;

class CC_GLES2_API GLES2BindingLayout : public GFXBindingLayout {
 public:
   GLES2BindingLayout(GFXDevice* device);
  ~GLES2BindingLayout();
  
 public:
  bool initialize(const GFXBindingLayoutInfo& info);
  void destroy();
  void update();
  
  CC_INLINE GLES2GPUBindingLayout* gpuBindingLayout() const { return _gpuBindingLayout; }
  
 private:
  GLES2GPUBindingLayout* _gpuBindingLayout = nullptr;
};

NS_CC_END

#endif
