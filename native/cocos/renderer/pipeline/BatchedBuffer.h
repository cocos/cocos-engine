#pragma once

#include "Define.h"

namespace cc {
class Pass;
class SubModel;
} // namespace cc

namespace cc {
namespace pipeline {

class CC_DLL BatchedBuffer : public cc::Object {
public:
    BatchedBuffer(cc::Pass *pass);
    ~BatchedBuffer() = default;

    void destroy();
    void merge(cc::SubModel *, uint passIdx, RenderObject *);
    void clear();
    void clearUBO();

    CC_INLINE const BatchedItemList &getBaches() const { return _batchedItems; }
    CC_INLINE cc::Pass *getPass() const { return _pass; }

private:
    //    const _localBatched = new UBOLocalBatched();
    BatchedItemList _batchedItems;
    cc::Pass *_pass = nullptr;
};

} // namespace pipeline
} // namespace cc
