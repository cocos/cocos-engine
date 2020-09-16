#pragma once

#include "cocos/base/Object.h"
#include "cocos/bindings/jswrapper/Object.h"
#include "cocos/base/memory/StlAlloc.h"
#include "cocos/base/Macros.h"
#include "cocos/base/TypeDef.h"
#include "PoolType.h"

namespace se {

class CC_DLL ArrayPool final : public cc::Object {
public:
    static uint32_t *getArray(PoolType type, uint index);
    
    ArrayPool(PoolType type, uint size);
    ~ArrayPool();

    Object *alloc(uint index);
    Object *resize(Object *origin, uint size, uint index);

private:
    static cc::map<PoolType, ArrayPool *> _pools;

    cc::map<uint, Object *> _objects;
    PoolType _type;
    uint _size = 0;
};

} // namespace se
