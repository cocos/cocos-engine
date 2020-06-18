#pragma once

#include "Define.h"

namespace cc {
class Pass;
struct InstancedAttributeBlock;
struct PSOCreateInfo;
class SubModel;

namespace pipeline {

struct CC_DLL InstancedItem {
    gfx::GFXBuffer *vb = nullptr;
    uint8_t *data = nullptr;
    gfx::GFXInputAssembler *ia = nullptr;
    uint count = 0;
    uint capacity = 0;
    uint stride = 0;
};
typedef vector<InstancedItem> InstancedItemList;

class InstancedBuffer : public gfx::Object {
public:
    static const uint INITIAL_CAPACITY = 32;
    static const uint MAX_CAPACITY = 1024;

    InstancedBuffer(cc::Pass *pass);
    ~InstancedBuffer() = default;

    void destroy();
    void merge(cc::SubModel *, const cc::InstancedAttributeBlock &, const cc::PSOCreateInfo &);
    void uploadBuffers();
    void clear();

    CC_INLINE const InstancedItemList &getInstances() const { return _instancedItems; }
    //    CC_INLINE const cc::PSOCreateInfo &getPSOCreateInfo() const { return _PSOCreateInfo; }
    CC_INLINE cc::Pass *getPass() const { return _pass; }

private:
    InstancedItemList _instancedItems;
    //    cc::PSOCreateInfo _PSOCreateInfo;
    cc::Pass *_pass = nullptr;
};

} // namespace pipeline
} // namespace cc
