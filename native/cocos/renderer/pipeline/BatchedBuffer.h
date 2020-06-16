#pragma once

#include "Define.h"

namespace cc {
class Pass;
class SubModel;
}

NS_PP_BEGIN

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

NS_PP_END
