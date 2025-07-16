/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "jsb_geometry_manual.h"

#include "bindings/manual/jsb_global.h"
#include "cocos/bindings/auto/jsb_geometry_auto.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global_init.h"

template <typename T>
static bool bindAsExternalBuffer(se::State &s) { // NOLINT
    auto *self = SE_THIS_OBJECT<T>(s);
    if (!self) {
        return false;
    }
    // NOLINTNEXTLINE
    se::HandleObject buffer(se::Object::createExternalArrayBufferObject(self, sizeof(*self), [](void *, size_t, void *) {}));
    s.rval().setObject(buffer);
    return true;
}

#define REG_UNDERLINE_DATA(type) \
    __jsb_cc_geometry_##type##_proto->defineFunction("underlyingData", _SE(js_cc_geometry_##type##_underlyingData))

#define DESC_OFFSET_OF(type, field) \
    static_cast<int>(reinterpret_cast<uintptr_t>(&(static_cast<type *>(nullptr)->field)))

#define DESC_UNDERLINE_DATA_BEGIN(kls)          \
    {                                           \
        using current_type = cc::geometry::kls; \
        se::HandleObject info{se::Object::createPlainObject()};

#define DESC_UNDERLINE_DATA_FIELD(field)                                                        \
    {                                                                                           \
        se::HandleObject fieldInfo{se::Object::createPlainObject()};                            \
        int fieldOffset = DESC_OFFSET_OF(current_type, field);                                  \
        constexpr int fieldSize = static_cast<int>(sizeof(std::declval<current_type>().field)); \
        fieldInfo->setProperty("fieldName", se::Value(#field));                                 \
        fieldInfo->setProperty("fieldOffset", se::Value(fieldOffset));                          \
        fieldInfo->setProperty("fieldSize", se::Value(fieldSize));                              \
        info->setProperty(#field, se::Value(fieldInfo));                                        \
    }

#define DESC_UNDERLINE_DATA_END(kls)                                        \
    se::Value protoVal;                                                     \
    __jsb_cc_geometry_##kls##_proto->getProperty("constructor", &protoVal); \
    protoVal.toObject()->setProperty("__nativeFields__", se::Value(info));  \
    }                                                                       \
    REG_UNDERLINE_DATA(kls);

#define IMPL_UNDERLINE_DATA(type)                                      \
    static bool js_cc_geometry_##type##_underlyingData(se::State &s) { \
        return bindAsExternalBuffer<cc::geometry::type>(s);            \
    }                                                                  \
    SE_BIND_FUNC(js_cc_geometry_##type##_underlyingData)

IMPL_UNDERLINE_DATA(Line)
IMPL_UNDERLINE_DATA(Plane)
IMPL_UNDERLINE_DATA(Ray)
IMPL_UNDERLINE_DATA(Triangle)
IMPL_UNDERLINE_DATA(Sphere)
IMPL_UNDERLINE_DATA(AABB)
IMPL_UNDERLINE_DATA(Capsule)
IMPL_UNDERLINE_DATA(Frustum)

bool register_all_geometry_manual(se::Object * /*obj*/) { // NOLINT(readability-identifier-naming)

    DESC_UNDERLINE_DATA_BEGIN(Line)
    DESC_UNDERLINE_DATA_FIELD(s)
    DESC_UNDERLINE_DATA_FIELD(e)
    DESC_UNDERLINE_DATA_END(Line)

    DESC_UNDERLINE_DATA_BEGIN(Plane)
    DESC_UNDERLINE_DATA_FIELD(n)
    DESC_UNDERLINE_DATA_FIELD(d)
    DESC_UNDERLINE_DATA_END(Plane)

    DESC_UNDERLINE_DATA_BEGIN(Ray)
    DESC_UNDERLINE_DATA_FIELD(o)
    DESC_UNDERLINE_DATA_FIELD(d)
    DESC_UNDERLINE_DATA_END(Ray)

    DESC_UNDERLINE_DATA_BEGIN(Triangle)
    DESC_UNDERLINE_DATA_FIELD(a)
    DESC_UNDERLINE_DATA_FIELD(b)
    DESC_UNDERLINE_DATA_FIELD(c)
    DESC_UNDERLINE_DATA_END(Triangle)

    DESC_UNDERLINE_DATA_BEGIN(Sphere)
    DESC_UNDERLINE_DATA_FIELD(_center)
    DESC_UNDERLINE_DATA_FIELD(_radius)
    DESC_UNDERLINE_DATA_END(Sphere)

    DESC_UNDERLINE_DATA_BEGIN(AABB)
    DESC_UNDERLINE_DATA_FIELD(center)
    DESC_UNDERLINE_DATA_FIELD(halfExtents)
    DESC_UNDERLINE_DATA_END(AABB)

    DESC_UNDERLINE_DATA_BEGIN(Capsule)
    DESC_UNDERLINE_DATA_FIELD(radius)
    DESC_UNDERLINE_DATA_FIELD(halfHeight)
    DESC_UNDERLINE_DATA_FIELD(axis)
    DESC_UNDERLINE_DATA_FIELD(center)
    DESC_UNDERLINE_DATA_FIELD(rotation)
    DESC_UNDERLINE_DATA_FIELD(ellipseCenter0)
    DESC_UNDERLINE_DATA_FIELD(ellipseCenter1)
    DESC_UNDERLINE_DATA_END(Capsule)

    // underlying data not required for Frustum
    // DESC_UNDERLINE_DATA_BEGIN(Frustum)
    // DESC_UNDERLINE_DATA_FIELD(vertices)
    // DESC_UNDERLINE_DATA_FIELD(planes)
    // DESC_UNDERLINE_DATA_END(Frustum)

    return true;
}
