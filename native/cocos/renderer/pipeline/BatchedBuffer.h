#pragma once

#include "Define.h"

NS_CC_BEGIN
class Pass;
class SubModel;
NS_CC_END

NS_PP_BEGIN

class CC_DLL BatchedBuffer : public cocos2d::Object {
public:
    BatchedBuffer(cocos2d::Pass *pass);
    ~BatchedBuffer() = default;

    void destroy();
    void merge(cocos2d::SubModel *, uint passIdx, RenderObject *);
    void clear();
    void clearUBO();

    CC_INLINE const BatchedItemList &getBaches() const { return _batchedItems; }
    CC_INLINE cocos2d::Pass *getPass() const { return _pass; }

private:
    //    const _localBatched = new UBOLocalBatched();
    BatchedItemList _batchedItems;
    cocos2d::Pass *_pass = nullptr;
};

NS_PP_END
