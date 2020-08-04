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

#include "ObjectPool.h"

using namespace se;

ObjectPool::ObjectPool(Object *jsArr)
{
    CCASSERT(jsArr->isArray(), "ObjectPool: It must be initialized with a JavaScript array");
    
    _indexMask = 0xffffffff & ~_poolFlag;
    
    _jsArr = jsArr;
    _jsArr->root();
    _jsArr->incRef();
    _jsArr->setPrivateData(this);
}

ObjectPool::~ObjectPool()
{
    // Let GC manages the js array
    _jsArr->setPrivateData(nullptr);
    _jsArr->decRef();
    _jsArr->unroot();
}

template<class Type>
Type *ObjectPool::getTypedObject(uint32_t id)
{
    id = _indexMask & id;
    uint32_t len = 0;
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
