#ifndef DRAGONBONES_BASE_OBJECT_H
#define DRAGONBONES_BASE_OBJECT_H

#include "DragonBones.h"

#define BIND_CLASS_TYPE(CLASS) \
public:\
static std::size_t getTypeIndex()\
{\
    static const auto typeIndex = typeid(CLASS).hash_code();\
    return typeIndex;\
}\
virtual std::size_t getClassTypeIndex() const override\
{\
    return CLASS::getTypeIndex();\
}\

DRAGONBONES_NAMESPACE_BEGIN

class BaseObject
{
private:
    static std::size_t _hashCode;
    static std::size_t _defaultMaxCount;
    static std::map<std::size_t, std::size_t> _maxCountMap;
    static std::map<std::size_t, std::vector<BaseObject*>> _poolsMap;

    static void _returnObject(BaseObject *object);

public:
    static void setMaxCount(std::size_t classTypeIndex, std::size_t maxCount);
    static void clearPool(std::size_t classTypeIndex);

    template<typename T>
    static T* borrowObject() 
    {
        const auto classTypeIndex = T::getTypeIndex();
        const auto iterator = _poolsMap.find(classTypeIndex);
        if (iterator != _poolsMap.end())
        {
            auto& pool = iterator->second;
            if (!pool.empty())
            {
                const auto object = dynamic_cast<T*>(pool.back());
                pool.pop_back();

                return object;
            }
        }

        return new (std::nothrow) T();
    }

public:
    const std::size_t hashCode;

public:
    /** @private */
    BaseObject();
    /** @private */
    virtual ~BaseObject() = 0;

protected:
    virtual void _onClear() = 0;

public:
    /** @private */
    virtual std::size_t getClassTypeIndex() const = 0;
    
    void returnToPool();
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_BASE_OBJECT_H
