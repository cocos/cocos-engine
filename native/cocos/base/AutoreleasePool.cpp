/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

#include "base/AutoreleasePool.h"
#include "base/Log.h"

namespace cc {

LegacyAutoreleasePool::LegacyAutoreleasePool()
#if defined(CC_DEBUG) && (CC_DEBUG > 0)
: _isClearing(false)
#endif
{
    _managedObjectArray.reserve(150);
    PoolManager::getInstance()->push(this);
}

LegacyAutoreleasePool::LegacyAutoreleasePool(std::string name)
: _name(std::move(name))
#if defined(CC_DEBUG) && (CC_DEBUG > 0)
  ,
  _isClearing(false)
#endif
{
    _managedObjectArray.reserve(150);
    PoolManager::getInstance()->push(this);
}

LegacyAutoreleasePool::~LegacyAutoreleasePool() {
    CC_LOG_INFO("deallocing AutoreleasePool: %p", this);
    clear();

    PoolManager::getInstance()->pop();
}

void LegacyAutoreleasePool::addObject(Ref *object) {
    _managedObjectArray.push_back(object);
}

void LegacyAutoreleasePool::clear() {
#if defined(CC_DEBUG) && (CC_DEBUG > 0)
    _isClearing = true;
#endif
    std::vector<Ref *> releasings;
    releasings.swap(_managedObjectArray);
    for (const auto &obj : releasings) {
        obj->release();
    }
#if defined(CC_DEBUG) && (CC_DEBUG > 0)
    _isClearing = false;
#endif
}

bool LegacyAutoreleasePool::contains(Ref *object) const {
    for (const auto &obj : _managedObjectArray) {
        if (obj == object) {
            return true;
        }
    }
    return false;
}

void LegacyAutoreleasePool::dump() {
    CC_LOG_DEBUG("autorelease pool: %s, number of managed object %d\n", _name.c_str(), static_cast<int>(_managedObjectArray.size()));
    CC_LOG_DEBUG("%20s%20s%20s", "Object pointer", "Object id", "reference count");
    for (const auto &obj : _managedObjectArray) {
        CC_UNUSED_PARAM(obj);
        CC_LOG_DEBUG("%20p%20u\n", obj, obj->getReferenceCount());
    }
}

//--------------------------------------------------------------------
//
// PoolManager
//
//--------------------------------------------------------------------

PoolManager *PoolManager::_singleInstance = nullptr;

PoolManager *PoolManager::getInstance() {
    if (_singleInstance == nullptr) {
        _singleInstance = new (std::nothrow) PoolManager();
        _singleInstance->push(new LegacyAutoreleasePool());
    }
    return _singleInstance;
}

void PoolManager::destroyInstance() {
    delete _singleInstance;
    _singleInstance = nullptr;
}

PoolManager::PoolManager() {
    _releasePoolStack.reserve(10);
}

PoolManager::~PoolManager() {
    CC_LOG_INFO("deallocing PoolManager: %p", this);

    while (!_releasePoolStack.empty()) {
        LegacyAutoreleasePool *pool = _releasePoolStack.back();

        delete pool;
    }
}

LegacyAutoreleasePool *PoolManager::getCurrentPool() const {
    if (_releasePoolStack.empty()) {
        return nullptr;
    }
    return _releasePoolStack.back();
}

bool PoolManager::isObjectInPools(Ref *obj) const {
    for (const auto &pool : _releasePoolStack) {
        if (pool->contains(obj)) {
            return true;
        }
    }
    return false;
}

void PoolManager::push(LegacyAutoreleasePool *pool) {
    _releasePoolStack.push_back(pool);
}

void PoolManager::pop() {
    CC_ASSERT(!_releasePoolStack.empty());
    _releasePoolStack.pop_back();
}

} // namespace cc
