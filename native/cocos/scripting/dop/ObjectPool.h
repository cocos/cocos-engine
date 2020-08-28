/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/

#pragma once

#include "cocos/base/Object.h"
#include "cocos/scripting/js-bindings/jswrapper/Object.h"
#include "cocos/base/memory/StlAlloc.h"
#include "cocos/base/Macros.h"
#include "cocos/base/TypeDef.h"
#include "PoolType.h"

namespace se {

class CC_DLL ObjectPool final : public cc::Object {
public:
    CC_INLINE static const cc::map<PoolType, ObjectPool *> &getPoolMap() { return ObjectPool::_poolMap; }
    
    ObjectPool(PoolType type, Object *jsArr);
    ~ObjectPool();

    template <class Type>
    Type *getTypedObject(uint id) const {
        id = _indexMask & id;
        uint len = 0;
        bool ok = _jsArr->getArrayLength(&len);
        CCASSERT(ok && id < len, "ObjectPool: Invalid buffer pool entry id");

        se::Value jsEntry;
        ok = _jsArr->getArrayElement(id, &jsEntry);
        if (!ok || !jsEntry.isObject()) {
            return nullptr;
        }
        Type *entry = (Type *)jsEntry.toObject()->getPrivateData();
        return entry;
    }

private:
    static cc::map<PoolType, ObjectPool *> _poolMap;
    
    PoolType _type = PoolType::RASTERIZER_STATE;
    Object *_jsArr = nullptr;
    uint _poolFlag = 1 << 29;
    uint _indexMask = 0;
};

} // namespace se
