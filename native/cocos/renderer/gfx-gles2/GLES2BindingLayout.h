#ifndef CC_GFXGLES2_GLES2_BINDING_LAYOUT_H_
#define CC_GFXGLES2_GLES2_BINDING_LAYOUT_H_

NS_CC_BEGIN

class GLES2GPUBindingLayout;

class CC_GLES2_API GLES2BindingLayout : public GFXBindingLayout {
 public:
   GLES2BindingLayout(GFXDevice* device);
  ~GLES2BindingLayout();
  
 public:
  bool Initialize(const GFXBindingLayoutInfo& info);
  void destroy();
  void Update();
  
  CC_INLINE GLES2GPUBindingLayout* gpu_binding_layout() const { return gpu_binding_layout_; }
  
 private:
  GLES2GPUBindingLayout* gpu_binding_layout_;
};

NS_CC_END

#endif
