#include "BaseObject.h"

DRAGONBONES_NAMESPACE_BEGIN

std::vector<BaseObject*> BaseObject::__allDragonBonesObjects;

std::size_t BaseObject::_hashCode = 0;
std::size_t BaseObject::_defaultMaxCount = 5000;
std::unordered_map<std::size_t, std::size_t> BaseObject::_maxCountMap;
std::unordered_map<std::size_t, std::vector<BaseObject*>> BaseObject::_poolsMap;
BaseObject::RecycleOrDestroyCallback BaseObject::_recycleOrDestroyCallback = nullptr;

void BaseObject::_returnObject(BaseObject* object)
{
    const auto classTypeIndex = object->getClassTypeIndex();
    const auto maxCountIterator = _maxCountMap.find(classTypeIndex);
    const auto maxCount = maxCountIterator != _maxCountMap.end() ? maxCountIterator->second : _defaultMaxCount;

    auto& pool = _poolsMap[classTypeIndex];
    if (pool.size() < maxCount)
    {
        if (std::find(pool.cbegin(), pool.cend(), object) == pool.cend())
        {
            pool.push_back(object);
        }
        else
        {
            DRAGONBONES_ASSERT(false, "The object aleady in pool.");
        }

        object->_isInPool = true;
        if (_recycleOrDestroyCallback != nullptr)
            _recycleOrDestroyCallback(object, 0);
    }
    else
    {
        delete object;
    }
}

void BaseObject::setObjectRecycleOrDestroyCallback(const std::function<void(BaseObject*, int)>& cb)
{
    _recycleOrDestroyCallback = cb;
}

void BaseObject::setMaxCount(std::size_t classTypeIndex, std::size_t maxCount)
{
    if (classTypeIndex)
    {
        _maxCountMap[classTypeIndex] = maxCount;
        const auto iterator = _poolsMap.find(classTypeIndex);
        if (iterator != _poolsMap.end())
        {
            auto& pool = iterator->second;
            if (pool.size() > maxCount)
            {
                for (auto i = maxCount, l = pool.size(); i < l; ++i)
                {
                    delete pool[i];
                }

                pool.resize(maxCount);
            }
        }
    }
    else
    {
        _defaultMaxCount = maxCount;
        for (auto& pair : _poolsMap)
        {
            if (_maxCountMap.find(pair.first) == _maxCountMap.end())
            {
                continue;
            }

            _maxCountMap[pair.first] = maxCount;

            auto& pool = pair.second;
            if (pool.size() > maxCount)
            {
                for (auto i = maxCount, l = pool.size(); i < l; ++i)
                {
                    delete pool[i];
                }

                pool.resize(maxCount);
            }
        }
    }
}

void BaseObject::clearPool(std::size_t classTypeIndex)
{
    if (classTypeIndex)
    {
        const auto iterator = _poolsMap.find(classTypeIndex);
        if (iterator != _poolsMap.end())
        {
            auto& pool = iterator->second;
            if (!pool.empty())
            {
                for (auto object : pool)
                {
                    delete object;
                }

                pool.clear();
            }
        }
    }
    else
    {
        for (auto& pair : _poolsMap)
        {
            auto& pool = pair.second;
            if (!pool.empty())
            {
                for (auto object : pool)
                {
//                    printf("delete object: %s, %p\n", typeid(*object).name(), object);
                    delete object;
                }

                pool.clear();
            }
        }
    }
}

BaseObject::BaseObject()
: hashCode(BaseObject::_hashCode++)
, _isInPool(false)
{
    __allDragonBonesObjects.push_back(this);
}

BaseObject::~BaseObject()
{
    if (_recycleOrDestroyCallback != nullptr)
        _recycleOrDestroyCallback(this, 1);

    auto iter = std::find(__allDragonBonesObjects.begin(), __allDragonBonesObjects.end(), this);
    if (iter != __allDragonBonesObjects.end())
    {
        __allDragonBonesObjects.erase(iter);
    }
}

void BaseObject::returnToPool()
{
    _onClear();
    // _returnObject make delete this BaseObject,
    // so after the function invocation, any other operations of
    // this object should not be done.
    _returnObject(this);
}

std::vector<BaseObject*>& BaseObject::getAllObjects()
{
    return __allDragonBonesObjects;
}

DRAGONBONES_NAMESPACE_END
