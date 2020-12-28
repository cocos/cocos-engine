#ifndef CC_GFXGLES2_QUEUE_H_
#define CC_GFXGLES2_QUEUE_H_

namespace cc {
namespace gfx {

class CC_GLES2_API GLES2Queue final : public Queue {
public:
    GLES2Queue(Device *device);
    ~GLES2Queue();

    friend class GLES2Device;

public:
    virtual bool initialize(const QueueInfo &info) override;
    virtual void destroy() override;
    virtual void submit(const CommandBuffer *const *cmdBuffs, uint count, Fence *fence) override;

private:
    uint _numDrawCalls = 0;
    uint _numInstances = 0;
    uint _numTriangles = 0;
};

} // namespace gfx
} // namespace cc

#endif
