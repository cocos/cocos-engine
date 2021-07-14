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

#include <cstdint>
#include <memory>
#include <vector>
#include "base/TypeDef.h"
#include "bindings/manual/jsb_conversions.h"

namespace cc {
namespace physics {

enum class ETouchState : uint8_t {
    ENTER = 0,
    STAY  = 1,
    EXIT  = 2,
};

struct TriggerEventPair {
    uintptr_t                shapeA;
    uintptr_t                shapeB;
    ETouchState              state;
    static constexpr uint8_t COUNT = 3;
    TriggerEventPair(const uintptr_t a, const uintptr_t b)
    : shapeA(a),
      shapeB(b),
      state(ETouchState::ENTER) {}
};

struct ContactPoint {
    Vec3                     position;
    float                    separation;
    Vec3                     normal;
    uint32_t                 internalFaceIndex0;
    Vec3                     impulse;
    uint32_t                 internalFaceIndex1;
    static constexpr uint8_t COUNT = 12;
};

struct ContactEventPair {
    uintptr_t                 shapeA;
    uintptr_t                 shapeB;
    ETouchState               state;
    std::vector<ContactPoint> contacts;
    static constexpr uint8_t  COUNT = 4;
    ContactEventPair(const uintptr_t a, const uintptr_t b)
    : shapeA(a),
      shapeB(b),
      state(ETouchState::ENTER) {}
};

struct ConvexDesc {
    void *   positions;
    uint32_t positionLength;
};

struct TrimeshDesc : ConvexDesc {
    void *   triangles;
    uint32_t triangleLength;
    bool     isU16;
};

struct HeightFieldDesc {
    uint32_t rows;
    uint32_t columns;
    void *   samples;
};

struct RaycastOptions {
    cc::Vec3 origin;
    float    distance;
    cc::Vec3 unitDir;
    uint32_t mask;
    bool     queryTrigger;
};

struct RaycastResult {
    uintptr_t shape{0};
    cc::Vec3  hitPoint;
    float     distance;
    cc::Vec3  hitNormal;
    RaycastResult() = default;
};

class IPhysicsWorld {
public:
    virtual ~IPhysicsWorld() = default;
    ;
    virtual void                                            setGravity(float x, float y, float z)      = 0;
    virtual void                                            setAllowSleep(bool v)                      = 0;
    virtual void                                            step(float s)                              = 0;
    virtual void                                            emitEvents()                               = 0;
    virtual void                                            syncSceneToPhysics()                       = 0;
    virtual void                                            syncSceneWithCheck()                       = 0;
    virtual void                                            destroy()                                  = 0;
    virtual void                                            setCollisionMatrix(uint32_t i, uint32_t m) = 0;
    virtual std::vector<std::shared_ptr<TriggerEventPair>> &getTriggerEventPairs()                     = 0;
    virtual std::vector<std::shared_ptr<ContactEventPair>> &getContactEventPairs()                     = 0;
    virtual bool                                            raycast(RaycastOptions &opt)               = 0;
    virtual bool                                            raycastClosest(RaycastOptions &opt)        = 0;
    virtual std::vector<RaycastResult> &                    raycastResult()                            = 0;
    virtual RaycastResult &                                 raycastClosestResult()                     = 0;
    virtual uintptr_t                                       createConvex(ConvexDesc &desc)             = 0;
    virtual uintptr_t                                       createTrimesh(TrimeshDesc &desc)           = 0;
    virtual uintptr_t                                       createHeightField(HeightFieldDesc &desc)   = 0;
    virtual uintptr_t                                       createMaterial(uint16_t id, float f, float df, float r,
                                                                           uint8_t m0, uint8_t m1)     = 0;
};

} // namespace physics
} // namespace cc

template <>
inline bool nativevalue_to_se(const std::vector<std::shared_ptr<cc::physics::TriggerEventPair>> &from, se::Value &to, se::Object * /*ctx*/) {
    se::HandleObject array(se::Object::createArrayObject(from.size() * cc::physics::TriggerEventPair::COUNT));
    for (size_t i = 0; i < from.size(); i++) {
        auto t = i * cc::physics::TriggerEventPair::COUNT;
        array->setArrayElement(static_cast<uint>(t + 0), se::Value(static_cast<double>(from[i]->shapeA)));
        array->setArrayElement(static_cast<uint>(t + 1), se::Value(static_cast<double>(from[i]->shapeB)));
        array->setArrayElement(static_cast<uint>(t + 2), se::Value(static_cast<uint8_t>(from[i]->state)));
    }
    to.setObject(array);
    return true;
}

template <>
inline bool nativevalue_to_se(const std::vector<cc::physics::ContactPoint> &from, se::Value &to, se::Object * /*ctx*/) {
    const auto       contactCount = from.size();
    se::HandleObject array(se::Object::createArrayObject(contactCount));
    for (size_t i = 0; i < contactCount; i++) {
        auto     t = i * cc::physics::ContactPoint::COUNT;
        uint32_t j = 0;
        array->setArrayElement(static_cast<uint>(t + j++), se::Value(from[i].position.x));
        array->setArrayElement(static_cast<uint>(t + j++), se::Value(from[i].position.y));
        array->setArrayElement(static_cast<uint>(t + j++), se::Value(from[i].position.z));
        array->setArrayElement(static_cast<uint>(t + j++), se::Value(from[i].normal.x));
        array->setArrayElement(static_cast<uint>(t + j++), se::Value(from[i].normal.y));
        array->setArrayElement(static_cast<uint>(t + j++), se::Value(from[i].normal.z));
        array->setArrayElement(static_cast<uint>(t + j++), se::Value(from[i].impulse.x));
        array->setArrayElement(static_cast<uint>(t + j++), se::Value(from[i].impulse.y));
        array->setArrayElement(static_cast<uint>(t + j++), se::Value(from[i].impulse.z));
        array->setArrayElement(static_cast<uint>(t + j++), se::Value(from[i].separation));
        array->setArrayElement(static_cast<uint>(t + j++), se::Value(from[i].internalFaceIndex0));
        array->setArrayElement(static_cast<uint>(t + j++), se::Value(from[i].internalFaceIndex1));
    }
    to.setObject(array);
    return true;
}

template <>
inline bool nativevalue_to_se(const std::vector<std::shared_ptr<cc::physics::ContactEventPair>> &from, se::Value &to, se::Object *ctx) {
    se::HandleObject array(se::Object::createArrayObject(from.size() * cc::physics::ContactEventPair::COUNT));
    for (size_t i = 0; i < from.size(); i++) {
        auto t = i * cc::physics::ContactEventPair::COUNT;
        array->setArrayElement(static_cast<uint>(t + 0), se::Value(static_cast<double>(from[i]->shapeA)));
        array->setArrayElement(static_cast<uint>(t + 1), se::Value(static_cast<double>(from[i]->shapeB)));
        array->setArrayElement(static_cast<uint>(t + 2), se::Value(static_cast<uint8_t>(from[i]->state)));
        array->setArrayElement(static_cast<uint>(t + 3), [&]() -> se::Value {
            auto obj = se::Value();
            nativevalue_to_se(from[i]->contacts, obj, ctx);
            return obj;
        }());
    }
    to.setObject(array);
    return true;
}

template <>
inline bool nativevalue_to_se(const cc::physics::RaycastResult &from, se::Value &to, se::Object *ctx) {
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("shape", se::Value(static_cast<double>(from.shape)));
    obj->setProperty("distance", se::Value(from.distance));
    se::Value tmp;
    if (nativevalue_to_se(from.hitPoint, tmp, ctx)) obj->setProperty("hitPoint", tmp);
    if (nativevalue_to_se(from.hitNormal, tmp, ctx)) obj->setProperty("hitNormal", tmp);
    to.setObject(obj);
    return true;
}

template <>
inline bool sevalue_to_native(const se::Value &from, cc::physics::ConvexDesc *to, se::Object *ctx) {
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto *      data = static_cast<cc::physics::ConvexDesc *>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }

    se::Value field;
    bool      ok = true;

    json->getProperty("positionLength", &field);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &to->positionLength, ctx);

    CC_UNUSED size_t dataLength = 0;
    json->getProperty("positions", &field);
    if (!field.isNullOrUndefined()) {
        se::Object *obj = field.toObject();
        if (obj->isArrayBuffer()) {
            ok &= obj->getArrayBufferData(reinterpret_cast<uint8_t **>(&to->positions), &dataLength);
            SE_PRECONDITION2(ok, false, "getArrayBufferData failed!");
        } else if (obj->isTypedArray()) {
            ok &= obj->getTypedArrayData(reinterpret_cast<uint8_t **>(&to->positions), &dataLength);
            SE_PRECONDITION2(ok, false, "getTypedArrayData failed!");
        } else {
            ok &= false;
        }
    }
    return ok;
}

template <>
inline bool sevalue_to_native(const se::Value &from, cc::physics::TrimeshDesc *to, se::Object *ctx) {
    if (!sevalue_to_native(from, reinterpret_cast<cc::physics::ConvexDesc *>(to), ctx)) {
        return false;
    }

    assert(from.isObject());
    se::Object *json = from.toObject();
    auto *      data = static_cast<cc::physics::TrimeshDesc *>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool      ok = true;

    json->getProperty("triangleLength", &field);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &(to->triangleLength), ctx);

    json->getProperty("isU16", &field);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &(to->isU16), ctx);

    CC_UNUSED size_t dataLength = 0;
    json->getProperty("triangles", &field);
    if (!field.isNullOrUndefined()) {
        se::Object *obj = field.toObject();
        if (obj->isArrayBuffer()) {
            ok &= obj->getArrayBufferData(reinterpret_cast<uint8_t **>(&to->triangles), &dataLength);
            SE_PRECONDITION2(ok, false, "getArrayBufferData failed!");
        } else if (obj->isTypedArray()) {
            ok &= obj->getTypedArrayData(reinterpret_cast<uint8_t **>(&to->triangles), &dataLength);
            SE_PRECONDITION2(ok, false, "getTypedArrayData failed!");
        } else {
            ok &= false;
        }
    }

    return ok;
}

template <>
inline bool sevalue_to_native(const se::Value &from, cc::physics::HeightFieldDesc *to, se::Object *ctx) {
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto *      data = static_cast<cc::physics::HeightFieldDesc *>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }

    se::Value field;
    bool      ok = true;

    json->getProperty("rows", &field);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &to->rows, ctx);

    json->getProperty("columns", &field);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &to->columns, ctx);

    CC_UNUSED size_t dataLength = 0;
    json->getProperty("samples", &field);
    if (!field.isNullOrUndefined()) {
        se::Object *obj = field.toObject();
        if (obj->isArrayBuffer()) {
            ok &= obj->getArrayBufferData(reinterpret_cast<uint8_t **>(&to->samples), &dataLength);
            SE_PRECONDITION2(ok, false, "getArrayBufferData failed!");
        } else if (obj->isTypedArray()) {
            ok &= obj->getTypedArrayData(reinterpret_cast<uint8_t **>(&to->samples), &dataLength);
            SE_PRECONDITION2(ok, false, "getTypedArrayData failed!");
        } else {
            ok &= false;
        }
    }
    return ok;
}

template <>
inline bool sevalue_to_native(const se::Value &from, cc::physics::RaycastOptions *to, se::Object *ctx) {
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto *      data = static_cast<cc::physics::RaycastOptions *>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }

    se::Value field;
    bool      ok = true;

    json->getProperty("origin", &field);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &to->origin, ctx);

    json->getProperty("unitDir", &field);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &to->unitDir, ctx);

    json->getProperty("mask", &field);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &to->mask, ctx);

    json->getProperty("distance", &field);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &to->distance, ctx);

    json->getProperty("queryTrigger", &field);
    if (!field.isNullOrUndefined()) ok &= sevalue_to_native(field, &to->queryTrigger, ctx);

    return ok;
}
