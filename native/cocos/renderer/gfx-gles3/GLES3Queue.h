#ifndef CC_GFXGLES3_GLES3_QUEUE_H_
#define CC_GFXGLES3_GLES3_QUEUE_H_

namespace cc {
namespace gfx {

class CC_GLES3_API GLES3Queue : public Queue {
public:
    GLES3Queue(Device *device);
    ~GLES3Queue();

    friend class GLES3Device;

public:
    virtual bool initialize(const QueueInfo &info) override;
    virtual void destroy() override;
    virtual void submit(const vector<CommandBuffer *> &cmdBuffs, Fence *fence) override;

private:
    uint _numDrawCalls = 0;
    uint _numInstances = 0;
    uint _numTriangles = 0;
};

} // namespace gfx
} // namespace cc

#endif
