#pragma once

#include "Define.h"

namespace cc {
namespace gfx {
class Device;
}
namespace pipeline {
struct ModelView;
struct SubModelView;
struct PassView;
struct InstancedAttributeBlock;
struct PSOInfo;

struct CC_DLL InstancedItem {
    uint count = 0;
    uint capacity = 0;
    gfx::Buffer *vb = nullptr;
    uint8_t *data = nullptr;
    gfx::InputAssembler *ia = nullptr;
    uint stride = 0;
    gfx::Shader *shader = nullptr;
    gfx::DescriptorSet *descriptorSet = nullptr;
    gfx::Texture *lightingMap = nullptr;
};
typedef vector<InstancedItem> InstancedItemList;

class InstancedBuffer : public Object {
public:
    static constexpr uint INITIAL_CAPACITY = 32;
    static constexpr uint MAX_CAPACITY = 1024;
    static InstancedBuffer *get(uint pass);

    InstancedBuffer(const PassView *pass);
    virtual ~InstancedBuffer();

    void destroy();
    void merge(const ModelView *, const SubModelView *, uint);
    void uploadBuffers();
    void clear();

    CC_INLINE const InstancedItemList &getInstances() const { return _instances; }
    CC_INLINE const PassView *getPass() const { return _pass; }
    CC_INLINE bool hasPendingModels() const { return _hasPendingModels; }
    CC_INLINE const vector<uint> &dynamicOffsets() const { return _dynamicoffsets; }

private:
    static map<uint, InstancedBuffer *> _buffers;
    InstancedItemList _instances;
    const PassView *_pass = nullptr;
    bool _hasPendingModels = false;
    vector<uint> _dynamicoffsets;
    gfx::Device *_device = nullptr;
};

} // namespace pipeline
} // namespace cc
