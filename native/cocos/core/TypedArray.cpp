/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include "core/TypedArray.h"

namespace cc {

uint32_t getTypedArrayLength(const TypedArray &arr) {
#define TYPEDARRAY_GET_SIZE(type)         \
    do {                                  \
        auto *p = cc::get_if<type>(&arr); \
        if (p != nullptr) {               \
            return p->length();           \
        }                                 \
    } while (false)

    TYPEDARRAY_GET_SIZE(Float32Array);
    TYPEDARRAY_GET_SIZE(Uint32Array);
    TYPEDARRAY_GET_SIZE(Uint16Array);
    TYPEDARRAY_GET_SIZE(Uint8Array);
    TYPEDARRAY_GET_SIZE(Int32Array);
    TYPEDARRAY_GET_SIZE(Int16Array);
    TYPEDARRAY_GET_SIZE(Int8Array);
    TYPEDARRAY_GET_SIZE(Float64Array);

#undef TYPEDARRAY_GET_SIZE
    return 0;
}

uint32_t getTypedArrayBytesPerElement(const TypedArray &arr) {
#define TYPEDARRAY_GET_BYTES_PER_ELEMENT(type) \
    do {                                       \
        auto *p = cc::get_if<type>(&arr);      \
        if (p != nullptr) {                    \
            return type::BYTES_PER_ELEMENT;    \
        }                                      \
    } while (false)

    TYPEDARRAY_GET_BYTES_PER_ELEMENT(Float32Array);
    TYPEDARRAY_GET_BYTES_PER_ELEMENT(Uint32Array);
    TYPEDARRAY_GET_BYTES_PER_ELEMENT(Uint16Array);
    TYPEDARRAY_GET_BYTES_PER_ELEMENT(Uint8Array);
    TYPEDARRAY_GET_BYTES_PER_ELEMENT(Int32Array);
    TYPEDARRAY_GET_BYTES_PER_ELEMENT(Int16Array);
    TYPEDARRAY_GET_BYTES_PER_ELEMENT(Int8Array);
    TYPEDARRAY_GET_BYTES_PER_ELEMENT(Float64Array);

#undef TYPEDARRAY_GET_BYPES_PER_ELEMENT
    return 0;
}

void setTypedArrayValue(TypedArray &arr, uint32_t idx, const TypedArrayElementType &value) {
#define TYPEDARRAY_SET_VALUE(type, elemType)                                \
    do {                                                                    \
        auto *p = cc::get_if<elemType>(&value);                             \
        if (p != nullptr) {                                                 \
            if (cc::holds_alternative<Float32Array>(arr)) {                 \
                cc::get<Float32Array>(arr)[idx] = static_cast<float>(*p);   \
                return;                                                     \
            }                                                               \
            if (cc::holds_alternative<Uint16Array>(arr)) {                  \
                cc::get<Uint16Array>(arr)[idx] = static_cast<uint16_t>(*p); \
                return;                                                     \
            }                                                               \
            if (cc::holds_alternative<Uint32Array>(arr)) {                  \
                cc::get<Uint32Array>(arr)[idx] = static_cast<uint32_t>(*p); \
                return;                                                     \
            }                                                               \
            if (cc::holds_alternative<Uint8Array>(arr)) {                   \
                cc::get<Uint8Array>(arr)[idx] = static_cast<uint8_t>(*p);   \
                return;                                                     \
            }                                                               \
            if (cc::holds_alternative<Int32Array>(arr)) {                   \
                cc::get<Int32Array>(arr)[idx] = static_cast<int32_t>(*p);   \
                return;                                                     \
            }                                                               \
            if (cc::holds_alternative<Int16Array>(arr)) {                   \
                cc::get<Int16Array>(arr)[idx] = static_cast<int16_t>(*p);   \
                return;                                                     \
            }                                                               \
            if (cc::holds_alternative<Int8Array>(arr)) {                    \
                cc::get<Int8Array>(arr)[idx] = static_cast<int8_t>(*p);     \
                return;                                                     \
            }                                                               \
            if (cc::holds_alternative<Float64Array>(arr)) {                 \
                cc::get<Float64Array>(arr)[idx] = static_cast<double>(*p);  \
                return;                                                     \
            }                                                               \
        }                                                                   \
    } while (false)

    TYPEDARRAY_SET_VALUE(Float32Array, float);
    TYPEDARRAY_SET_VALUE(Uint32Array, uint32_t);
    TYPEDARRAY_SET_VALUE(Uint16Array, uint16_t);
    TYPEDARRAY_SET_VALUE(Uint8Array, uint8_t);
    TYPEDARRAY_SET_VALUE(Int32Array, int32_t);
    TYPEDARRAY_SET_VALUE(Int16Array, int16_t);
    TYPEDARRAY_SET_VALUE(Int8Array, int8_t); // NOLINT
    TYPEDARRAY_SET_VALUE(Float64Array, double);
#undef TYPEDARRAY_SET_VALUE
}

} // namespace cc
