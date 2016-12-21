#include "BaseObject.h"
DRAGONBONES_NAMESPACE_BEGIN

std::size_t BaseObject::_hashCode = 0;
std::size_t BaseObject::_defaultMaxCount = 5000;
std::map<std::size_t, std::size_t> BaseObject::_maxCountMap;
std::map<std::size_t, std::vector<BaseObject*>> BaseObject::_poolsMap;

void BaseObject::_returnObject(BaseObject* object)
{
    const auto classTypeIndex = object->getClassTypeIndex();
    const auto maxCountIterator = _maxCountMap.find(classTypeIndex);
    const auto maxCount = maxCountIterator != _maxCountMap.end() ? maxCountIterator->second : _defaultMaxCount;

    const auto iterator = _poolsMap.find(classTypeIndex);
    if (iterator != _poolsMap.end())
    {
        auto& pool = iterator->second;
        if (pool.size() >= maxCount) {
            delete object;
            return;
        }

        if (std::find(pool.cbegin(), pool.cend(), object) == pool.cend())
        {
            pool.push_back(object);
        }
        else
        {
            DRAGONBONES_ASSERT(false, "The object aleady in pool.");
        }
    }
    else
    {
        delete object;
    }
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
                    delete object;
                }

                pool.clear();
            }
        }
    }
}

BaseObject::BaseObject() :
    hashCode(BaseObject::_hashCode++)
{}
BaseObject::~BaseObject(){}

void BaseObject::returnToPool()
{
    _onClear();
    _returnObject(this);
}

DRAGONBONES_NAMESPACE_END