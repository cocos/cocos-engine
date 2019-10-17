#ifndef CC_GFXGLES2_GLES2_BINDING_LAYOUT_H_
#define CC_GFXGLES2_GLES2_BINDING_LAYOUT_H_

CC_NAMESPACE_BEGIN

class GLES2GPUBindingLayout;

class CC_GLES2_API GLES2BindingLayout : public GFXBindingLayout {
 public:
   GLES2BindingLayout(GFXDevice* device);
  ~GLES2BindingLayout();
  
 public:
  bool Initialize(const GFXBindingLayoutInfo& info);
  void Destroy();
  void Update();
  
  CC_INLINE GLES2GPUBindingLayout* gpu_binding_layout() const { return gpu_binding_layout_; }
  
 private:
  GLES2GPUBindingLayout* gpu_binding_layout_;
};

CC_NAMESPACE_END

#endif
