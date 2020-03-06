#ifndef CC_GFXGLES3_GLES3_QUEUE_H_
#define CC_GFXGLES3_GLES3_QUEUE_H_

NS_CC_BEGIN

class CC_GLES3_API GLES3Queue : public GFXQueue {
 public:
  GLES3Queue(GFXDevice* device);
  ~GLES3Queue();

  friend class GLES3Device;
  
 public:
  bool initialize(const GFXQueueInfo& info);
  void destroy();
  void submit(const std::vector<GFXCommandBuffer*>& cmd_buffs);
  
  CC_INLINE bool isAsync() const { return _isAsync; }
  
 private:
  bool _isAsync = false;
  uint _numDrawCalls = 0;
  uint _numTriangles = 0;
};

NS_CC_END

#endif
