/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#include <string>
#include <vector>
#include "base/Ref.h"

namespace cc {

/**
 * A pool for managing autorelease objects.
 */
class CC_DLL LegacyAutoreleasePool {
public:
    /**
     * @warning Don't create an autorelease pool in heap, create it in stack.
     */
    LegacyAutoreleasePool();

    /**
     * Create an autorelease pool with specific name. This name is useful for debugging.
     * @warning Don't create an autorelease pool in heap, create it in stack.
     *
     * @param name The name of created autorelease pool.
     */
    explicit LegacyAutoreleasePool(std::string name);

    ~LegacyAutoreleasePool();

    /**
     * Add a given object to this autorelease pool.
     *
     * The same object may be added several times to an autorelease pool. When the
     * pool is destructed, the object's `Ref::release()` method will be called
     * the same times as it was added.
     *
     * @param object    The object to be added into the autorelease pool.
     */
    void addObject(Ref *object);

    /**
     * Clear the autorelease pool.
     *
     * It will invoke each element's `release()` function.
     */
    void clear();

#if defined(CC_DEBUG) && (CC_DEBUG > 0)
    /**
     * Whether the autorelease pool is doing `clear` operation.
     *
     * @return True if autorelease pool is clearing, false if not.
     */
    bool isClearing() const { return _isClearing; };
#endif

    /**
     * Checks whether the autorelease pool contains the specified object.
     *
     * @param object The object to be checked.
     * @return True if the autorelease pool contains the object, false if not
     */
    bool contains(Ref *object) const;

    /**
     * Dump the objects that are put into the autorelease pool. It is used for debugging.
     *
     * The result will look like:
     * Object pointer address     object id     reference count
     */
    void dump();

private:
    /**
     * The underlying array of object managed by the pool.
     *
     * Although Array retains the object once when an object is added, proper
     * Ref::release() is called outside the array to make sure that the pool
     * does not affect the managed object's reference count. So an object can
     * be destructed properly by calling Ref::release() even if the object
     * is in the pool.
     */
    std::vector<Ref *> _managedObjectArray;
    std::string        _name;

#if defined(CC_DEBUG) && (CC_DEBUG > 0)
    /**
     *  The flag for checking whether the pool is doing `clear` operation.
     */
    bool _isClearing;
#endif
};

class CC_DLL PoolManager {
public:
    static PoolManager *getInstance();

    static void destroyInstance();

    /**
     * Get current auto release pool, there is at least one auto release pool that created by engine.
     * You can create your own auto release pool at demand, which will be put into auto release pool stack.
     */
    LegacyAutoreleasePool *getCurrentPool() const;

    bool isObjectInPools(Ref *obj) const;

    friend class LegacyAutoreleasePool;

private:
    PoolManager();
    ~PoolManager();

    void push(LegacyAutoreleasePool *pool);
    void pop();

    static PoolManager *_singleInstance;

    std::vector<LegacyAutoreleasePool *> _releasePoolStack;
};

} // namespace cc
