#ifndef CC_GFXGLES2_GLES2_QUEUE_H_
#define CC_GFXGLES2_GLES2_QUEUE_H_

CC_NAMESPACE_BEGIN

class CC_GLES2_API GLES2Queue : public GFXQueue {
 public:
  GLES2Queue(GFXDevice* device);
  ~GLES2Queue();

  friend class GLES2Device;
  
 public:
  bool Initialize(const GFXQueueInfo& info);
  void Destroy();
  void submit(GFXCommandBuffer** cmd_buffs, uint count);
  
  CC_INLINE bool is_async() const { return is_async_; }
  
 private:
  bool is_async_;
  uint num_draw_calls_;
  uint num_tris_;
};

CC_NAMESPACE_END

#endif
