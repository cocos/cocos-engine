#include "BaseObject.h"
DRAGONBONES_NAMESPACE_BEGIN

std::vector<BaseObject*> BaseObject::__allDragonBonesObjects;
unsigned BaseObject::_hashCode = 0;
unsigned BaseObject::_defaultMaxCount = 3000;
std::map<std::size_t, unsigned> BaseObject::_maxCountMap;
std::map<std::size_t, std::vector<BaseObject*>> BaseObject::_poolsMap;
BaseObject::RecycleOrDestroyCallback BaseObject::_recycleOrDestroyCallback = nullptr;

void BaseObject::_returnObject(BaseObject* object) {
    const auto classType = object->getClassTypeIndex();
    const auto maxCountIterator = _maxCountMap.find(classType);
    const auto maxCount = maxCountIterator != _maxCountMap.end() ? maxCountIterator->second : _defaultMaxCount;
    auto& pool = _poolsMap[classType];
    // If script engine gc,then alway push object into pool,not immediately delete
    // Because object will be referenced more then one place possibly,if delete it immediately,will
    // crash.
    if (!DragonBones::checkInPool || pool.size() < maxCount) {
        if (!object->_isInPool) {
            object->_isInPool = true;
            pool.push_back(object);
            if (_recycleOrDestroyCallback != nullptr)
                _recycleOrDestroyCallback(object, 0);
        } else {
            // If script engine gc,repeat push into pool will happen.
            if (DragonBones::checkInPool) {
                DRAGONBONES_ASSERT(false, "The object is already in the pool.");
            }
        }
    } else {
        delete object;
    }
}

void BaseObject::setObjectRecycleOrDestroyCallback(const std::function<void(BaseObject*, int)>& cb) {
    _recycleOrDestroyCallback = cb;
}

void BaseObject::setMaxCount(std::size_t classType, unsigned maxCount) {
    if (classType > 0) {
        const auto iterator = _poolsMap.find(classType);
        if (iterator != _poolsMap.end()) {
            auto& pool = iterator->second;
            if (pool.size() > (size_t)maxCount) {
                for (auto i = (size_t)maxCount, l = pool.size(); i < l; ++i) {
                    delete pool[i];
                }

                pool.resize(maxCount);
            }
        }

        _maxCountMap[classType] = maxCount;
    } else {
        _defaultMaxCount = maxCount;
        for (auto& pair : _poolsMap) {
            auto& pool = pair.second;
            if (pool.size() > (size_t)maxCount) {
                for (auto i = (size_t)maxCount, l = pool.size(); i < l; ++i) {
                    delete pool[i];
                }

                pool.resize(maxCount);
            }

            if (_maxCountMap.find(pair.first) != _maxCountMap.end()) {
                _maxCountMap[pair.first] = maxCount;
            }
        }
    }
}
void BaseObject::clearPool(std::size_t classType) {
    if (classType > 0) {
        const auto iterator = _poolsMap.find(classType);
        if (iterator != _poolsMap.end()) {
            auto& pool = iterator->second;
            if (!pool.empty()) {
                for (auto object : pool) {
                    delete object;
                }

                pool.clear();
            }
        }
    } else {
        for (auto& pair : _poolsMap) {
            auto& pool = pair.second;
            if (!pool.empty()) {
                for (auto object : pool) {
                    delete object;
                }

                pool.clear();
            }
        }
    }
}

BaseObject::BaseObject()
: hashCode(BaseObject::_hashCode++), _isInPool(false) {
    __allDragonBonesObjects.push_back(this);
}

BaseObject::~BaseObject() {
    if (_recycleOrDestroyCallback != nullptr)
        _recycleOrDestroyCallback(this, 1);

    auto iter = std::find(__allDragonBonesObjects.begin(), __allDragonBonesObjects.end(), this);
    if (iter != __allDragonBonesObjects.end()) {
        __allDragonBonesObjects.erase(iter);
    }
}

void BaseObject::returnToPool() {
    _onClear();
    BaseObject::_returnObject(this);
}

std::vector<BaseObject*>& BaseObject::getAllObjects() {
    return __allDragonBonesObjects;
}

DRAGONBONES_NAMESPACE_END
