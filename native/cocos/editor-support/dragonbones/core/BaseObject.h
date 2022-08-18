/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2018 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
#ifndef DRAGONBONES_BASE_OBJECT_H
#define DRAGONBONES_BASE_OBJECT_H

#include <vector>
#include "DragonBones.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * - The BaseObject is the base class for all objects in the DragonBones framework.
 * All BaseObject instances are cached to the object pool to reduce the performance consumption of frequent requests for memory or memory recovery.
 * @version DragonBones 4.5
 * @language en_US
 */
/**
 * - 基础对象，通常 DragonBones 的对象都继承自该类。
 * 所有基础对象的实例都会缓存到对象池，以减少频繁申请内存或内存回收的性能消耗。
 * @version DragonBones 4.5
 * @language zh_CN
 */
class BaseObject {
public:
    typedef std::function<void(BaseObject*, int)> RecycleOrDestroyCallback;

private:
    static unsigned _hashCode;
    static unsigned _defaultMaxCount;
    static std::map<std::size_t, unsigned> _maxCountMap;
    static std::map<std::size_t, std::vector<BaseObject*>> _poolsMap;
    static void _returnObject(BaseObject* object);

    static RecycleOrDestroyCallback _recycleOrDestroyCallback;

public:
    static void setObjectRecycleOrDestroyCallback(const RecycleOrDestroyCallback& cb);
    /**
     * - Set the maximum cache count of the specify object pool.
     * @param objectConstructor - The specify class. (Set all object pools max cache count if not set)
     * @param maxCount - Max count.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 设置特定对象池的最大缓存数量。
     * @param objectConstructor - 特定的类。 (不设置则设置所有对象池的最大缓存数量)
     * @param maxCount - 最大缓存数量。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    static void setMaxCount(std::size_t classTypeIndex, unsigned maxCount);
    /**
     * - Clear the cached instances of a specify object pool.
     * @param objectConstructor - Specify class. (Clear all cached instances if not set)
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 清除特定对象池的缓存实例。
     * @param objectConstructor - 特定的类。 (不设置则清除所有缓存的实例)
     * @version DragonBones 4.5
     * @language zh_CN
     */
    static void clearPool(std::size_t classTypeIndex = 0);
    template <typename T>
    /**
     * - Get an instance of the specify class from object pool.
     * @param objectConstructor - The specify class.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 从对象池中获取特定类的实例。
     * @param objectConstructor - 特定的类。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    static T* borrowObject() {
        const auto classTypeIndex = T::getTypeIndex();
        const auto iterator = _poolsMap.find(classTypeIndex);
        if (iterator != _poolsMap.end()) {
            auto& pool = iterator->second;
            if (!pool.empty()) {
                const auto object = static_cast<T*>(pool.back());
                pool.pop_back();
                object->_isInPool = false;
                return object;
            }
        }

        const auto object = new (std::nothrow) T();

        return object;
    }

    static std::vector<dragonBones::BaseObject*>& getAllObjects();

public:
    /**
     * - A unique identification number assigned to the object.
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 分配给此实例的唯一标识号。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    const unsigned hashCode;

private:
    static std::vector<dragonBones::BaseObject*> __allDragonBonesObjects;
    bool _isInPool;

public:
    virtual ~BaseObject();

protected:
    BaseObject();

    virtual void _onClear() = 0;

public:
    virtual std::size_t getClassTypeIndex() const = 0;
    /**
     * - Clear the object and return it back to object pool。
     * @version DragonBones 4.5
     * @language en_US
     */
    /**
     * - 清除该实例的所有数据并将其返还对象池。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    void returnToPool();
    inline bool isInPool() const { return _isInPool; }
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_BASE_OBJECT_H
