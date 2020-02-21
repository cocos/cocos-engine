#ifndef CC_GFXGLES2_GLES2_QUEUE_H_
#define CC_GFXGLES2_GLES2_QUEUE_H_

NS_CC_BEGIN

class CC_GLES2_API GLES2Queue : public GFXQueue {
 public:
  GLES2Queue(GFXDevice* device);
  ~GLES2Queue();

  friend class GLES2Device;
  
 public:
  bool initialize(const GFXQueueInfo& info);
  void destroy();
  void submit(GFXCommandBuffer** cmd_buffs, uint count);
  
    CC_INLINE bool isAsync() const { return _isAsync; }
  
 private:
  bool _isAsync= false;
  uint _numDrawCalls = 0;
  uint _numTriangles = 0;
};

NS_CC_END

#endif
