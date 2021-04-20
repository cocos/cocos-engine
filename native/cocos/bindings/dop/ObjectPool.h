/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include "PoolType.h"
#include "cocos/base/Macros.h"
#include "cocos/base/Object.h"
#include "cocos/base/TypeDef.h"
#include "cocos/base/memory/StlAlloc.h"
#include "cocos/bindings/jswrapper/Object.h"

namespace se {

class CC_DLL ObjectPool final : public cc::Object {
public:
    CC_INLINE static const cc::vector<ObjectPool *> &getPoolMap() { return ObjectPool::poolMap; }

    ObjectPool(PoolType type, Object *jsArr);
    ~ObjectPool() override;

    template <class Type>
    Type *getTypedObject(uint id) const {
        id = _indexMask & id;

#ifdef CC_DEBUG
        CCASSERT(id < _array.size(), "ObjectPool: Invalid buffer pool entry id");
#endif

        return static_cast<Type *>(_array[id]->getPrivateData());
    }

    void bind(uint id, Object *);

private:
    static cc::vector<ObjectPool *> poolMap;

    cc::vector<Object *> _array;
    PoolType             _type      = PoolType::SHADER;
    Object *             _jsArr     = nullptr;
    uint                 _poolFlag  = 1 << 29;
    uint                 _indexMask = 0;
};

} // namespace se
