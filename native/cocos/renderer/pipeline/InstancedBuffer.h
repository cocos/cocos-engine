#pragma once

#include "Define.h"

NS_CC_BEGIN
class Pass;
struct InstancedAttributeBlock;
struct PSOCreateInfo;
class SubModel;
NS_CC_END

NS_PP_BEGIN

class InstancedBuffer : public cocos2d::Object {
public:
    static const uint INITIAL_CAPACITY = 32;
    static const uint MAX_CAPACITY = 1024;

    InstancedBuffer(cocos2d::Pass *pass);
    ~InstancedBuffer() = default;

    void destroy();
    void merge(cocos2d::SubModel *, const cocos2d::InstancedAttributeBlock &, const cocos2d::PSOCreateInfo &);
    void uploadBuffers();
    void clear();

    CC_INLINE const InstancedItemList &getInstances() const { return _instancedItems; }
    //    CC_INLINE const cocos2d::PSOCreateInfo &getPSOCreateInfo() const { return _PSOCreateInfo; }
    CC_INLINE cocos2d::Pass *getPass() const { return _pass; }

private:
    InstancedItemList _instancedItems;
    //    cocos2d::PSOCreateInfo _PSOCreateInfo;
    cocos2d::Pass *_pass = nullptr;
};

NS_PP_END
