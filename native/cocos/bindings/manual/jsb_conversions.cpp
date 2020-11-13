/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

#include "jsb_conversions.h"
#include "base/TypeDef.h"
#include "math/Math.h"
#include "renderer/core/gfx/GFXDef.h"
#include <sstream>
#include <regex>

// seval to native

bool seval_to_int32(const se::Value &v, int32_t *ret) {
    assert(ret != nullptr);
    if (v.isNumber()) {
        *ret = v.toInt32();
        return true;
    } else if (v.isBoolean()) {
        *ret = v.toBoolean() ? 1 : 0;
        return true;
    }
    *ret = 0;
    return false;
}

bool seval_to_uint32(const se::Value &v, uint32_t *ret) {
    assert(ret != nullptr);
    if (v.isNumber()) {
        *ret = v.toUint32();
        return true;
    } else if (v.isBoolean()) {
        *ret = v.toBoolean() ? 1 : 0;
        return true;
    }
    *ret = 0;
    return false;
}

bool seval_to_uint(const se::Value &v, unsigned int *ret) {
    assert(ret != nullptr);
    if (v.isNumber()) {
        *ret = v.toUint();
        return true;
    } else if (v.isBoolean()) {
        *ret = v.toBoolean() ? 1 : 0;
        return true;
    }
    *ret = 0;
    return false;
}

bool seval_to_int8(const se::Value &v, int8_t *ret) {
    assert(ret != nullptr);
    if (v.isNumber()) {
        *ret = v.toInt8();
        return true;
    } else if (v.isBoolean()) {
        *ret = v.toBoolean() ? 1 : 0;
        return true;
    }
    *ret = 0;
    return false;
}

bool seval_to_uint8(const se::Value &v, uint8_t *ret) {
    assert(ret != nullptr);
    if (v.isNumber()) {
        *ret = v.toUint8();
        return true;
    } else if (v.isBoolean()) {
        *ret = v.toBoolean() ? 1 : 0;
        return true;
    }
    *ret = 0;
    return false;
}

bool seval_to_int16(const se::Value &v, int16_t *ret) {
    assert(ret != nullptr);
    if (v.isNumber()) {
        *ret = v.toInt16();
        return true;
    } else if (v.isBoolean()) {
        *ret = v.toBoolean() ? 1 : 0;
        return true;
    }
    *ret = 0;
    return false;
}

bool seval_to_uint16(const se::Value &v, uint16_t *ret) {
    assert(ret != nullptr);
    if (v.isNumber()) {
        *ret = v.toUint16();
        return true;
    } else if (v.isBoolean()) {
        *ret = v.toBoolean() ? 1 : 0;
        return true;
    }
    *ret = 0;
    return false;
}

bool seval_to_boolean(const se::Value &v, bool *ret) {
    assert(ret != nullptr);
    if (v.isBoolean()) {
        *ret = v.toBoolean();
    } else if (v.isNumber()) {
        *ret = v.toInt32() != 0 ? true : false;
    } else if (v.isNullOrUndefined()) {
        *ret = false;
    } else if (v.isObject()) {
        *ret = true;
    } else if (v.isString()) {
        *ret = v.toString().empty() ? false : true;
    } else {
        *ret = false;
        assert(false);
    }

    return true;
}

bool seval_to_float(const se::Value &v, float *ret) {
    assert(ret != nullptr);
    if (v.isNumber()) {
        *ret = v.toFloat();
        if (!std::isnan(*ret))
            return true;
    }
    *ret = 0.0f;
    return false;
}

bool seval_to_double(const se::Value &v, double *ret) {
    if (v.isNumber()) {
        *ret = v.toNumber();
        if (!std::isnan(*ret))
            return true;
    }
    *ret = 0.0;
    return false;
}

bool seval_to_long(const se::Value &v, long *ret) {
    assert(ret != nullptr);
    if (v.isNumber()) {
        *ret = v.toLong();
        return true;
    }
    *ret = 0L;
    return false;
}

bool seval_to_ulong(const se::Value &v, unsigned long *ret) {
    assert(ret != nullptr);
    if (v.isNumber()) {
        *ret = v.toUlong();
        return true;
    }
    *ret = 0UL;
    return false;
}

bool seval_to_longlong(const se::Value &v, long long *ret) {
    assert(ret != nullptr);
    if (v.isNumber()) {
        *ret = (long long)v.toLong();
        return true;
    }
    *ret = 0LL;
    return false;
}

bool seval_to_size(const se::Value &v, size_t *ret) {
    assert(ret != nullptr);
    if (v.isNumber()) {
        *ret = (size_t)v.toLong();
        return true;
    }
    *ret = 0;
    return false;
}

bool seval_to_std_string(const se::Value &v, std::string *ret) {
    assert(ret != nullptr);
    *ret = v.toStringForce();
    return true;
}

bool seval_to_Vec2(const se::Value &v, cc::Vec2 *pt) {
    assert(pt != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Vec2 failed!");
    se::Object *obj = v.toObject();
    se::Value x;
    se::Value y;
    bool ok = obj->getProperty("x", &x);
    SE_PRECONDITION3(ok && x.isNumber(), false, *pt = cc::Vec2::ZERO);
    ok = obj->getProperty("y", &y);
    SE_PRECONDITION3(ok && y.isNumber(), false, *pt = cc::Vec2::ZERO);
    pt->x = x.toFloat();
    pt->y = y.toFloat();
    return true;
}

bool seval_to_Vec3(const se::Value &v, cc::Vec3 *pt) {
    assert(pt != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Vec3 failed!");
    se::Object *obj = v.toObject();
    se::Value x;
    se::Value y;
    se::Value z;
    bool ok = obj->getProperty("x", &x);
    SE_PRECONDITION3(ok && x.isNumber(), false, *pt = cc::Vec3::ZERO);
    ok = obj->getProperty("y", &y);
    SE_PRECONDITION3(ok && y.isNumber(), false, *pt = cc::Vec3::ZERO);
    ok = obj->getProperty("z", &z);
    SE_PRECONDITION3(ok && z.isNumber(), false, *pt = cc::Vec3::ZERO);
    pt->x = x.toFloat();
    pt->y = y.toFloat();
    pt->z = z.toFloat();
    return true;
}

bool seval_to_Vec4(const se::Value &v, cc::Vec4 *pt) {
    assert(pt != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Vec4 failed!");
    pt->x = pt->y = pt->z = pt->w = 0.0f;
    se::Object *obj = v.toObject();
    se::Value x;
    se::Value y;
    se::Value z;
    se::Value w;
    bool ok = obj->getProperty("x", &x);
    SE_PRECONDITION3(ok && x.isNumber(), false, *pt = cc::Vec4::ZERO);
    ok = obj->getProperty("y", &y);
    SE_PRECONDITION3(ok && y.isNumber(), false, *pt = cc::Vec4::ZERO);
    ok = obj->getProperty("z", &z);
    SE_PRECONDITION3(ok && z.isNumber(), false, *pt = cc::Vec4::ZERO);
    ok = obj->getProperty("w", &w);
    SE_PRECONDITION3(ok && w.isNumber(), false, *pt = cc::Vec4::ZERO);
    pt->x = x.toFloat();
    pt->y = y.toFloat();
    pt->z = z.toFloat();
    pt->w = w.toFloat();
    return true;
}

bool seval_to_mat(const se::Value &v, int length, float *out) {
    assert(out != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Matrix failed!");
    se::Object *obj = v.toObject();

    se::Value tmp;
    char propName[3] = {0};
    for (int i = 0; i < length; ++i) {
        snprintf(propName, 3, "m%2d", i);
        obj->getProperty(propName, &tmp);
        *(out + i) = tmp.toFloat();
    }

    return true;
}

bool seval_to_Mat4(const se::Value &v, cc::Mat4 *mat) {
    assert(mat != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Matrix4 failed!");
    se::Object *obj = v.toObject();

    if (obj->isTypedArray()) {
        // typed array
        SE_PRECONDITION2(obj->isTypedArray(), false, "Convert parameter to Matrix4 failed!");

        size_t length = 0;
        uint8_t *ptr = nullptr;
        obj->getTypedArrayData(&ptr, &length);

        memcpy(mat->m, ptr, length);
    } else {
        bool ok = false;
        se::Value tmp;
        std::string prefix = "m";
        for (uint32_t i = 0; i < 16; ++i) {
            std::string name;
            if (i < 10) {
                name = prefix + "0" + std::to_string(i);
            } else {
                name = prefix + std::to_string(i);
            }
            ok = obj->getProperty(name.c_str(), &tmp);
            SE_PRECONDITION3(ok, false, *mat = cc::Mat4::IDENTITY);

            if (tmp.isNumber()) {
                mat->m[i] = tmp.toFloat();
            } else {
                SE_REPORT_ERROR("%u, not supported type in matrix", i);
                *mat = cc::Mat4::IDENTITY;
                return false;
            }

            tmp.setUndefined();
        }
    }

    return true;
}

bool seval_to_Uint8Array(const se::Value &v, uint8_t *ret) {
    assert(ret != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Array failed!");
    se::Object *obj = v.toObject();
    SE_PRECONDITION2(obj->isArray(), false, "Convert parameter to Array failed!");

    CC_UNUSED bool ok = true;
    uint32_t length = 0;
    obj->getArrayLength(&length);
    se::Value value;
    uint8_t data = 0;
    for (uint32_t i = 0; i < length; ++i) {
        if (obj->getArrayElement(i, &value)) {
            ok = seval_to_uint8(value, &data);
            SE_PRECONDITION2(ok, false, "Convert parameter to Array failed!");
            ret[i] = data;
        }
    }

    return true;
}

bool seval_to_uintptr_t(const se::Value &v, uintptr_t *ret) {
    assert(ret != nullptr);
    if (v.isNumber()) {
        *ret = v.toUIntptr_t();
        return true;
    }
    *ret = 0UL;
    return false;
}

bool seval_to_Size(const se::Value &v, cc::Size *size) {
    assert(size != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Size failed!");
    se::Object *obj = v.toObject();
    se::Value width;
    se::Value height;

    bool ok = obj->getProperty("width", &width);
    SE_PRECONDITION3(ok && width.isNumber(), false, *size = cc::Size::ZERO);
    ok = obj->getProperty("height", &height);
    SE_PRECONDITION3(ok && height.isNumber(), false, *size = cc::Size::ZERO);
    size->width = width.toFloat();
    size->height = height.toFloat();
    return true;
}

bool seval_to_ccvalue(const se::Value &v, cc::Value *ret) {
    assert(ret != nullptr);
    bool ok = true;
    if (v.isObject()) {
        se::Object *jsobj = v.toObject();
        if (!jsobj->isArray()) {
            // It's a normal js object.
            cc::ValueMap dictVal;
            ok = seval_to_ccvaluemap(v, &dictVal);
            SE_PRECONDITION3(ok, false, *ret = cc::Value::Null);
            *ret = cc::Value(dictVal);
        } else {
            // It's a js array object.
            cc::ValueVector arrVal;
            ok = seval_to_ccvaluevector(v, &arrVal);
            SE_PRECONDITION3(ok, false, *ret = cc::Value::Null);
            *ret = cc::Value(arrVal);
        }
    } else if (v.isString()) {
        *ret = v.toString();
    } else if (v.isNumber()) {
        *ret = v.toNumber();
    } else if (v.isBoolean()) {
        *ret = v.toBoolean();
    } else if (v.isNullOrUndefined()) {
        *ret = cc::Value::Null;
    } else {
        SE_PRECONDITION2(false, false, "type not supported!");
    }

    return ok;
}

bool seval_to_ccvaluemap(const se::Value &v, cc::ValueMap *ret) {
    assert(ret != nullptr);

    if (v.isNullOrUndefined()) {
        ret->clear();
        return true;
    }

    SE_PRECONDITION3(v.isObject(), false, ret->clear());
    SE_PRECONDITION3(!v.isNullOrUndefined(), false, ret->clear());

    se::Object *obj = v.toObject();

    cc::ValueMap &dict = *ret;

    std::vector<std::string> allKeys;
    SE_PRECONDITION3(obj->getAllKeys(&allKeys), false, ret->clear());

    bool ok = false;
    se::Value value;
    cc::Value ccvalue;
    for (const auto &key : allKeys) {
        SE_PRECONDITION3(obj->getProperty(key.c_str(), &value), false, ret->clear());
        ok = seval_to_ccvalue(value, &ccvalue);
        SE_PRECONDITION3(ok, false, ret->clear());
        dict.emplace(key, ccvalue);
    }

    return true;
}

static bool isNumberString(const std::string &str) {
    for (const auto &c : str) {
        if (!isdigit(c))
            return false;
    }
    return true;
}

bool seval_to_ccvaluemapintkey(const se::Value &v, cc::ValueMapIntKey *ret) {
    assert(ret != nullptr);
    if (v.isNullOrUndefined()) {
        ret->clear();
        return true;
    }

    SE_PRECONDITION3(v.isObject(), false, ret->clear());
    SE_PRECONDITION3(!v.isNullOrUndefined(), false, ret->clear());

    se::Object *obj = v.toObject();

    cc::ValueMapIntKey &dict = *ret;

    std::vector<std::string> allKeys;
    SE_PRECONDITION3(obj->getAllKeys(&allKeys), false, ret->clear());

    bool ok = false;
    se::Value value;
    cc::Value ccvalue;
    for (const auto &key : allKeys) {
        SE_PRECONDITION3(obj->getProperty(key.c_str(), &value), false, ret->clear());

        if (!isNumberString(key)) {
            SE_LOGD("seval_to_ccvaluemapintkey, found not numeric key: %s", key.c_str());
            continue;
        }

        int intKey = atoi(key.c_str());

        ok = seval_to_ccvalue(value, &ccvalue);
        SE_PRECONDITION3(ok, false, ret->clear());
        dict.emplace(intKey, ccvalue);
    }

    return true;
}

bool seval_to_ccvaluevector(const se::Value &v, cc::ValueVector *ret) {
    assert(ret != nullptr);

    SE_PRECONDITION3(v.isObject(), false, ret->clear());

    se::Object *obj = v.toObject();
    SE_PRECONDITION3(obj->isArray(), false, ret->clear());

    uint32_t len = 0;
    obj->getArrayLength(&len);

    bool ok = false;
    se::Value value;
    cc::Value ccvalue;
    for (uint32_t i = 0; i < len; ++i) {
        if (obj->getArrayElement(i, &value)) {
            ok = seval_to_ccvalue(value, &ccvalue);
            SE_PRECONDITION3(ok, false, ret->clear());
            ret->push_back(ccvalue);
        }
    }

    return true;
}

bool sevals_variadic_to_ccvaluevector(const se::ValueArray &args, cc::ValueVector *ret) {
    bool ok = false;
    cc::Value ccvalue;

    for (const auto &arg : args) {
        ok = seval_to_ccvalue(arg, &ccvalue);
        SE_PRECONDITION3(ok, false, ret->clear());
        ret->push_back(ccvalue);
    }

    return true;
}

bool seval_to_std_vector_string(const se::Value &v, std::vector<std::string> *ret) {
    assert(ret != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to vector of String failed!");
    se::Object *obj = v.toObject();
    SE_PRECONDITION2(obj->isArray(), false, "Convert parameter to vector of String failed!");
    uint32_t len = 0;
    if (obj->getArrayLength(&len)) {
        se::Value value;
        for (uint32_t i = 0; i < len; ++i) {
            SE_PRECONDITION3(obj->getArrayElement(i, &value) && value.isString(), false, ret->clear());
            ret->push_back(value.toString());
        }
        return true;
    }

    ret->clear();
    return true;
}

bool seval_to_std_vector_int(const se::Value &v, std::vector<int> *ret) {
    assert(ret != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to vector of int failed!");
    se::Object *obj = v.toObject();

    if (obj->isArray()) {
        uint32_t len = 0;
        if (obj->getArrayLength(&len)) {
            se::Value value;
            for (uint32_t i = 0; i < len; ++i) {
                SE_PRECONDITION3(obj->getArrayElement(i, &value) && value.isNumber(), false, ret->clear());
                ret->push_back(value.toInt32());
            }
            return true;
        }
    } else if (obj->isTypedArray()) {
        size_t bytesPerElements = 0;
        uint8_t *data = nullptr;
        size_t dataBytes = 0;
        se::Object::TypedArrayType type = obj->getTypedArrayType();

#define SE_UINT8_PTR_TO_INT(ptr)  (*((uint8_t *)(ptr)))
#define SE_UINT16_PTR_TO_INT(ptr) (*((uint16_t *)(ptr)))
#define SE_UINT32_PTR_TO_INT(ptr) (*((uint32_t *)(ptr)))

        if (obj->getTypedArrayData(&data, &dataBytes)) {
            for (size_t i = 0; i < dataBytes; i += bytesPerElements) {
                switch (type) {
                    case se::Object::TypedArrayType::INT8:
                    case se::Object::TypedArrayType::UINT8:
                    case se::Object::TypedArrayType::UINT8_CLAMPED:
                        ret->push_back(SE_UINT8_PTR_TO_INT(data + i));
                        bytesPerElements = 1;
                        break;
                    case se::Object::TypedArrayType::INT16:
                    case se::Object::TypedArrayType::UINT16:
                        ret->push_back(SE_UINT16_PTR_TO_INT(data + i));
                        bytesPerElements = 2;
                        break;
                    case se::Object::TypedArrayType::INT32:
                    case se::Object::TypedArrayType::UINT32:
                        ret->push_back(SE_UINT32_PTR_TO_INT(data + i));
                        bytesPerElements = 4;
                        break;
                    default:
                        SE_LOGE("Unsupported typed array: %d\n", (int)type);
                        assert(false);
                        break;
                }
            }
        }

#undef SE_UINT8_PTR_TO_INT
#undef SE_UINT16_PTR_TO_INT
#undef SE_UINT32_PTR_TO_INT

        return true;
    } else {
        assert(false);
    }

    ret->clear();
    return true;
}

bool seval_to_std_vector_uint16(const se::Value &v, std::vector<uint16_t> *ret) {
    assert(ret != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to vector of uint16 failed!");
    se::Object *obj = v.toObject();

    if (obj->isArray()) {
        uint32_t len = 0;
        if (obj->getArrayLength(&len)) {
            se::Value value;
            for (uint32_t i = 0; i < len; ++i) {
                SE_PRECONDITION3(obj->getArrayElement(i, &value) && value.isNumber(), false, ret->clear());
                ret->push_back(value.toUint16());
            }
            return true;
        }
    } else if (obj->isTypedArray()) {
        size_t bytesPerElements = 0;
        uint8_t *data = nullptr;
        size_t dataBytes = 0;
        se::Object::TypedArrayType type = obj->getTypedArrayType();

        if (obj->getTypedArrayData(&data, &dataBytes)) {
            for (size_t i = 0; i < dataBytes; i += bytesPerElements) {
                switch (type) {
                    case se::Object::TypedArrayType::INT16:
                    case se::Object::TypedArrayType::UINT16:
                        ret->push_back(*((uint16_t *)(data + i)));
                        bytesPerElements = 2;
                        break;
                    default:
                        SE_LOGE("Unsupported typed array: %d\n", (int)type);
                        assert(false);
                        break;
                }
            }
        }
        return true;
    } else {
        assert(false);
    }
    ret->clear();
    return true;
}

bool seval_to_std_vector_float(const se::Value &v, std::vector<float> *ret) {
    assert(ret != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to vector of float failed!");
    se::Object *obj = v.toObject();
    SE_PRECONDITION2(obj->isArray(), false, "Convert parameter to vector of float failed!");
    uint32_t len = 0;
    if (obj->getArrayLength(&len)) {
        se::Value value;
        for (uint32_t i = 0; i < len; ++i) {
            SE_PRECONDITION3(obj->getArrayElement(i, &value) && value.isNumber(), false, ret->clear());
            ret->push_back(value.toFloat());
        }
        return true;
    }

    ret->clear();
    return true;
}

bool seval_to_std_vector_Vec2(const se::Value &v, std::vector<cc::Vec2> *ret) {
    assert(ret != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to vector of Vec2 failed!");
    se::Object *obj = v.toObject();
    SE_PRECONDITION2(obj->isArray(), false, "Convert parameter to vector of Vec2 failed!");
    uint32_t len = 0;
    if (obj->getArrayLength(&len)) {
        se::Value value;
        cc::Vec2 pt;
        for (uint32_t i = 0; i < len; ++i) {
            SE_PRECONDITION3(obj->getArrayElement(i, &value) && seval_to_Vec2(value, &pt), false, ret->clear());
            ret->push_back(pt);
        }
        return true;
    }

    ret->clear();
    return true;
}

bool seval_to_std_map_string_string(const se::Value &v, std::map<std::string, std::string> *ret) {
    assert(ret != nullptr);

    if (v.isNullOrUndefined()) {
        ret->clear();
        return true;
    }

    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to map of String to String failed!");
    SE_PRECONDITION3(!v.isNullOrUndefined(), false, ret->clear());

    se::Object *obj = v.toObject();

    std::vector<std::string> allKeys;
    SE_PRECONDITION3(obj->getAllKeys(&allKeys), false, ret->clear());

    bool ok = false;
    se::Value value;
    std::string strValue;
    for (const auto &key : allKeys) {
        SE_PRECONDITION3(obj->getProperty(key.c_str(), &value), false, ret->clear());
        ok = seval_to_std_string(value, &strValue);
        SE_PRECONDITION3(ok, false, ret->clear());
        ret->emplace(key, strValue);
    }

    return true;
}

bool seval_to_Data(const se::Value &v, cc::Data *ret) {
    assert(ret != nullptr);
    SE_PRECONDITION2(v.isObject() && v.toObject()->isTypedArray(), false, "Convert parameter to Data failed!");
    uint8_t *ptr = nullptr;
    size_t length = 0;
    bool ok = v.toObject()->getTypedArrayData(&ptr, &length);
    if (ok) {
        ret->copy(ptr, length);
    } else {
        ret->clear();
    }

    return ok;
}

bool seval_to_DownloaderHints(const se::Value &v, cc::network::DownloaderHints *ret) {
    static cc::network::DownloaderHints ZERO = {0, 0, ""};
    assert(ret != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to DownloaderHints failed!");
    se::Value tmp;
    se::Object *obj = v.toObject();
    bool ok = false;

    ok = obj->getProperty("countOfMaxProcessingTasks", &tmp);
    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
    ret->countOfMaxProcessingTasks = tmp.toUint32();

    ok = obj->getProperty("timeoutInSeconds", &tmp);
    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
    ret->timeoutInSeconds = tmp.toUint32();

    ok = obj->getProperty("tempFileNameSuffix", &tmp);
    SE_PRECONDITION3(ok && tmp.isString(), false, *ret = ZERO);
    ret->tempFileNameSuffix = tmp.toString();

    return ok;
}

bool seval_to_gfx_rect(const se::Value &v, cc::gfx::Rect *rect) {
    assert(rect != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::Rect failed!");
    se::Object *obj = v.toObject();
    se::Value val;

    bool ok = obj->getProperty("x", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get x from Rect!");
    rect->x = val.toUint32();

    ok = obj->getProperty("y", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get y from Rect!");
    rect->y = val.toUint32();

    ok = obj->getProperty("width", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get width from Rect!");
    rect->width = val.toUint();

    ok = obj->getProperty("height", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get height from Rect!");
    rect->height = val.toUint();

    return true;
}

bool seval_to_gfx_viewport(const se::Value &v, cc::gfx::Viewport *viewport) {
    assert(viewport != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::Viewport failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("left", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get left from Viewport!");
    viewport->left = val.toUint32();

    ok = obj->getProperty("top", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get top from Viewport!");
    viewport->top = val.toUint32();

    ok = obj->getProperty("width", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get width from Viewport!");
    viewport->top = val.toUint();

    ok = obj->getProperty("height", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get height from Viewport!");
    viewport->height = val.toUint();

    ok = obj->getProperty("minDepth", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get minDepth from Viewport!");
    viewport->minDepth = val.toFloat();

    ok = obj->getProperty("maxDepth", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get maxDepth from Viewport!");
    viewport->maxDepth = val.toFloat();

    return true;
}

bool seval_to_gfx_color(const se::Value &v, cc::gfx::Color *color) {
    assert(color != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::Color failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("x", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get x from Color!");
    color->x = val.toFloat();

    ok = obj->getProperty("y", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get y from Color!");
    color->y = val.toFloat();

    ok = obj->getProperty("z", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get z from Color!");
    color->z = val.toFloat();

    ok = obj->getProperty("w", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get w from Color!");
    color->w = val.toFloat();

    return true;
}

bool seval_to_gfx_color_list(const se::Value &v, cc::vector<cc::gfx::Color> *colorList) {
    assert(colorList != nullptr);
    SE_PRECONDITION2(v.isObject() && v.toObject()->isArray(), false, "Convert parameter to cc::gfx::ColorList failed!");
    se::Object *obj = v.toObject();

    uint32_t len = 0;
    if (obj->getArrayLength(&len)) {
        colorList->resize(len);
        se::Value value;
        for (uint32_t i = 0; i < len; ++i) {
            SE_PRECONDITION2(obj->getArrayElement(i, &value), false, "get cc::gfx::Color failed");
            seval_to_gfx_color(value, &(*colorList)[i]);
        }
    }

    return true;
}

bool seval_to_gfx_offset(const se::Value &v, cc::gfx::Offset *offset) {
    assert(offset != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::Offset failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("x", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get x from Offset!");
    offset->x = val.toUint32();

    ok = obj->getProperty("y", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get y from Offset!");
    offset->y = val.toUint32();

    ok = obj->getProperty("z", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get z from Offset!");
    offset->z = val.toUint32();

    return true;
}

bool seval_to_gfx_extent(const se::Value &v, cc::gfx::Extent *extent) {
    assert(extent != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::Extent failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("width", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get x from Extent!");
    extent->width = val.toUint();

    ok = obj->getProperty("height", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get height from Extent!");
    extent->height = val.toUint();

    ok = obj->getProperty("depth", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get depth from Extent!");
    extent->depth = val.toUint();

    return true;
}

bool seval_to_gfx_texture_subres(const se::Value &v, cc::gfx::TextureSubres *textureSubres) {
    assert(textureSubres != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::TextureSubres failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("mipLevel", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get mipLevel from TextureSubres!");
    textureSubres->mipLevel = val.toUint();

    ok = obj->getProperty("baseArrayLayer", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get baseArrayLayer from TextureSubres!");
    textureSubres->baseArrayLayer = val.toUint();

    ok = obj->getProperty("layerCount", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get layerCount from TextureSubres!");
    textureSubres->layerCount = val.toUint();

    return true;
}

bool seval_to_gfx_texture_copy(const se::Value &v, cc::gfx::TextureCopy *textureCopy) {
    assert(textureCopy != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::TextureCopy failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("srcSubres", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get srcSubres from TextureCopy!");
    seval_to_gfx_texture_subres(val, &textureCopy->srcSubres);

    ok = obj->getProperty("dstSubres", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get dstSubres from TextureCopy!");
    seval_to_gfx_texture_subres(val, &textureCopy->dstSubres);

    ok = obj->getProperty("srcOffset", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get srcOffset from TextureCopy!");
    seval_to_gfx_offset(val, &textureCopy->srcOffset);

    ok = obj->getProperty("dstOffset", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get dstOffset from TextureCopy!");
    seval_to_gfx_offset(val, &textureCopy->dstOffset);

    ok = obj->getProperty("extent", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get extent from TextureCopy!");
    seval_to_gfx_extent(val, &textureCopy->extent);

    return true;
}

bool seval_to_gfx_buffer_texture_copy(const se::Value &v, cc::gfx::BufferTextureCopy *bufferTextureCopy) {
    assert(bufferTextureCopy != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::BufferTextureCopy failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("buffStride", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get buffStride from BufferTextureCopy!");
    bufferTextureCopy->buffStride = val.toUint();

    ok = obj->getProperty("buffTexHeight", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get buffTexHeight from BufferTextureCopy!");
    bufferTextureCopy->buffTexHeight = val.toUint();

    ok = obj->getProperty("texOffset", &val);
    SE_PRECONDITION2(ok, false, "Can not get texOffset from BufferTextureCopy!");
    seval_to_gfx_offset(val, &bufferTextureCopy->texOffset);

    ok = obj->getProperty("texExtent", &val);
    SE_PRECONDITION2(ok, false, "Can not get texExtent from BufferTextureCopy!");
    seval_to_gfx_extent(val, &bufferTextureCopy->texExtent);

    ok = obj->getProperty("texSubres", &val);
    SE_PRECONDITION2(ok, false, "Can not get texSubres from BufferTextureCopy!");
    seval_to_gfx_texture_subres(val, &bufferTextureCopy->texSubres);

    return true;
}

bool seval_to_gfx_buffer_texture_copy_list(const se::Value &v, cc::vector<cc::gfx::BufferTextureCopy> *bufferTextureCopyList) {
    assert(bufferTextureCopyList != nullptr);
    SE_PRECONDITION2(v.isObject() && v.toObject()->isArray(), false, "Convert parameter to cc::gfx::BufferTextureCopyList failed!");
    se::Object *obj = v.toObject();

    uint32_t len = 0;
    if (obj->getArrayLength(&len)) {
        bufferTextureCopyList->resize(len);
        se::Value value;
        for (uint32_t i = 0; i < len; ++i) {
            SE_PRECONDITION2(obj->getArrayElement(i, &value), false, "get BufferTextureCopy failed");
            seval_to_gfx_buffer_texture_copy(value, &(*bufferTextureCopyList)[i]);
        }
    }

    return true;
}

bool seval_to_gfx_buffer_info(const se::Value &v, cc::gfx::BufferInfo *bufferInfo) {
    assert(bufferInfo != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::BufferInfo failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("usage", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get usage from BufferInfo!");
    bufferInfo->usage = (cc::gfx::BufferUsage)val.toUint();

    ok = obj->getProperty("memUsage", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get memUsage from BufferInfo!");
    bufferInfo->memUsage = (cc::gfx::MemoryUsage)val.toUint();

    ok = obj->getProperty("size", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get size from BufferInfo!");
    bufferInfo->size = val.toUint();

    ok = obj->getProperty("stride", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get stride from BufferInfo!");
    bufferInfo->stride = val.toUint();

    ok = obj->getProperty("flags", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get flags from BufferInfo!");
    bufferInfo->flags = (cc::gfx::BufferFlags)val.toUint();

    return true;
}

bool seval_to_gfx_buffer_view_info(const se::Value &v, cc::gfx::BufferViewInfo *bufferViewInfo) {
    assert(bufferViewInfo != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::BufferViewInfo failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("buffer", &val);
    SE_PRECONDITION2(ok && val.isObject(), false, "Can not get buffer from BufferViewInfo!");
    bufferViewInfo->buffer = static_cast<cc::gfx::Buffer *>(val.toObject()->getPrivateData());

    ok = obj->getProperty("offset", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get offset from BufferViewInfo!");
    bufferViewInfo->offset = val.toUint();

    ok = obj->getProperty("range", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get range from BufferViewInfo!");
    bufferViewInfo->range = val.toUint();

    return true;
}

bool seval_to_gfx_texture_info(const se::Value &v, cc::gfx::TextureInfo *textureInfo) {
    assert(textureInfo != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::TextureInfo failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("type", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get type from TextureInfo!");
    textureInfo->type = (cc::gfx::TextureType)val.toUint();

    ok = obj->getProperty("usage", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get usage from TextureInfo!");
    textureInfo->usage = (cc::gfx::TextureUsage)val.toUint();

    ok = obj->getProperty("format", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get format from TextureInfo!");
    textureInfo->format = (cc::gfx::Format)val.toUint();

    ok = obj->getProperty("width", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get width from TextureInfo!");
    textureInfo->width = val.toUint();

    ok = obj->getProperty("height", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get height from TextureInfo!");
    textureInfo->height = val.toUint();

    ok = obj->getProperty("flags", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get flags from TextureInfo!");
    textureInfo->flags = (cc::gfx::TextureFlags)val.toUint();

    ok = obj->getProperty("layerCount", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get layerCount from TextureInfo!");
    textureInfo->layerCount = val.toUint();

    ok = obj->getProperty("levelCount", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get levelCount from TextureInfo!");
    textureInfo->levelCount = val.toUint();

    ok = obj->getProperty("samples", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get samples from TextureInfo!");
    textureInfo->samples = (cc::gfx::SampleCount)val.toUint();

    ok = obj->getProperty("depth", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get depth from TextureInfo!");
    textureInfo->depth = val.toUint();

    return true;
}

bool seval_to_gfx_descriptor_set_info(const se::Value &v, cc::gfx::DescriptorSetInfo *descriptorSetInfo) {
    assert(descriptorSetInfo != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::DescriptorSetInfo failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("layout", &val);
    SE_PRECONDITION2(ok && val.isObject(), false, "Can not get layout from TextureInfo!");
    descriptorSetInfo->layout = static_cast<cc::gfx::DescriptorSetLayout *>(val.toObject()->getPrivateData());

    return true;
}

bool seval_to_gfx_binding_mapping_info(const se::Value &v, cc::gfx::BindingMappingInfo *bindingMappingInfo) {
    assert(bindingMappingInfo != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::BindingMappingInfo failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("bufferOffsets", &val);
    SE_PRECONDITION2(ok && val.isObject(), false, "Can not get bufferOffsets from BindingMappingInfo!");
    seval_to_std_vector(val, &bindingMappingInfo->bufferOffsets);

    ok = obj->getProperty("samplerOffsets", &val);
    SE_PRECONDITION2(ok && val.isObject(), false, "Can not get samplerOffsets from BindingMappingInfo!");
    seval_to_std_vector(val, &bindingMappingInfo->samplerOffsets);

    ok = obj->getProperty("flexibleSet", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get flexibleSet from BindingMappingInfo!");
    bindingMappingInfo->flexibleSet = val.toUint();

    return true;
}

bool seval_to_gfx_shader_stage(const se::Value &v, cc::gfx::ShaderStage *shaderStage) {
    assert(shaderStage != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::ShaderStage failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("stage", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get stage from ShaderStage!");
    shaderStage->stage = (cc::gfx::ShaderStageFlags)val.toUint();

    obj->getProperty("source", &val);
    SE_PRECONDITION2(ok && val.isString(), false, "Can not get source from ShaderStage!");
    seval_to_std_string(val, &shaderStage->source);

    return true;
}

bool seval_to_gfx_uniform_sampler(const se::Value &v, cc::gfx::UniformSampler *uniformSampler) {
    assert(uniformSampler != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::UniformSampler failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("set", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get set from UniformSampler!");
    uniformSampler->set = val.toUint();

    ok = obj->getProperty("binding", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get binding from UniformSampler!");
    uniformSampler->binding = val.toUint();

    ok = obj->getProperty("name", &val);
    SE_PRECONDITION2(ok && val.isString(), false, "Can not get name from UniformSampler!");
    seval_to_std_string(val, &uniformSampler->name);

    ok = obj->getProperty("type", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get type from UniformSampler!");
    uniformSampler->type = (cc::gfx::Type)val.toUint();

    ok = obj->getProperty("count", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get count from UniformSampler!");
    uniformSampler->count = val.toUint();

    return true;
}

bool seval_to_gfx_uniform(const se::Value &v, cc::gfx::Uniform *uniform) {
    assert(uniform != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::Uniform failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("name", &val);
    SE_PRECONDITION2(ok && val.isString(), false, "Can not get name from Uniform!");
    seval_to_std_string(val, &uniform->name);

    ok = obj->getProperty("type", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get type from Uniform!");
    uniform->type = (cc::gfx::Type)val.toUint();

    ok = obj->getProperty("count", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get count from Uniform!");
    uniform->count = val.toUint();

    return true;
}

bool seval_to_gfx_uniform_block(const se::Value &v, cc::gfx::UniformBlock *uniformBlock) {
    assert(uniformBlock != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::UniformBlock failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("set", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get set from UniformBlock!");
    uniformBlock->set = val.toUint();

    ok = obj->getProperty("binding", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get binding from UniformBlock!");
    uniformBlock->binding = val.toUint();

    ok = obj->getProperty("name", &val);
    SE_PRECONDITION2(ok && val.isString(), false, "Can not get name from UniformBlock!");
    seval_to_std_string(val, &uniformBlock->name);

    ok = obj->getProperty("members", &val);
    SE_PRECONDITION2(ok && val.isObject() && val.toObject()->isArray(), false, "Can not get members from UniformBlock!");
    auto membersObj = val.toObject();
    uint32_t len;
    if (membersObj->getArrayLength(&len)) {
        uniformBlock->members.resize(len);
        se::Value memberVal;
        for (uint32_t i = 0; i < len; ++i) {
            membersObj->getArrayElement(i, &memberVal);
            seval_to_gfx_uniform(memberVal, &uniformBlock->members[i]);
        }
    }

    ok = obj->getProperty("count", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get count from UniformBlock!");
    uniformBlock->count = val.toUint();

    return true;
}

bool seval_to_gfx_shader_info(const se::Value &v, cc::gfx::ShaderInfo *shaderInfo) {
    assert(shaderInfo != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::UniformBlock failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("name", &val);
    SE_PRECONDITION2(ok && val.isString(), false, "Can not get set from ShaderInfo!");
    seval_to_std_string(val, &shaderInfo->name);

    ok = obj->getProperty("stages", &val);
    SE_PRECONDITION2(ok && val.isObject() && val.toObject()->isArray(), false, "Can not get stages from ShaderInfo!");
    auto stagesObj = val.toObject();
    uint32_t len;
    if (stagesObj->getArrayLength(&len)) {
        shaderInfo->stages.resize(len);
        se::Value stageVal;
        for (uint32_t i = 0; i < len; ++i) {
            stagesObj->getArrayElement(i, &stageVal);
            seval_to_gfx_shader_stage(stageVal, &shaderInfo->stages[i]);
        }
    }

    ok = obj->getProperty("attributes", &val);
    SE_PRECONDITION2(ok && val.isObject() && val.toObject()->isArray(), false, "Can not get stages from ShaderInfo!");
    auto attrubtesObj = val.toObject();
    if (attrubtesObj->getArrayLength(&len)) {
        se::Value attributeVal;
        for (uint32_t i = 0; i < len; ++i) {
            attrubtesObj->getArrayElement(i, &attributeVal);
            shaderInfo->attributes.push_back(*static_cast<cc::gfx::Attribute *>(attributeVal.toObject()->getPrivateData()));
        }
    }

    ok = obj->getProperty("blocks", &val);
    SE_PRECONDITION2(ok && val.isObject() && val.toObject()->isArray(), false, "Can not get blocks from ShaderInfo!");
    auto blocksObj = val.toObject();
    if (blocksObj->getArrayLength(&len)) {
        se::Value blockVal;
        for (uint32_t i = 0; i < len; ++i) {
            shaderInfo->blocks.resize(len);
            blocksObj->getArrayElement(i, &blockVal);
            seval_to_gfx_uniform_block(blockVal, &shaderInfo->blocks[i]);
        }
    }

    ok = obj->getProperty("samplers", &val);
    SE_PRECONDITION2(ok && val.isObject() && val.toObject()->isArray(), false, "Can not get samplers from ShaderInfo!");
    auto samplersObj = val.toObject();
    if (samplersObj->getArrayLength(&len)) {
        shaderInfo->samplers.resize(len);
        se::Value samplerVal;
        for (uint32_t i = 0; i < len; ++i) {
            samplersObj->getArrayElement(i, &samplerVal);
            seval_to_gfx_uniform_sampler(samplerVal, &shaderInfo->samplers[i]);
        }
    }

    return true;
}

bool seval_to_gfx_draw_info(const se::Value &v, cc::gfx::DrawInfo *drawInfo) {
    assert(drawInfo != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::DrawInfo failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("vertexCount", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get vertexCount from DrawInfo!");
    drawInfo->vertexCount = val.toUint();

    ok = obj->getProperty("firstVertex", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get firstVertex from DrawInfo!");
    drawInfo->firstVertex = val.toUint();

    ok = obj->getProperty("indexCount", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get indexCount from DrawInfo!");
    drawInfo->indexCount = val.toUint();

    ok = obj->getProperty("firstIndex", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get firstIndex from DrawInfo!");
    drawInfo->firstIndex = val.toUint();

    ok = obj->getProperty("vertexOffset", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get vertexOffset from DrawInfo!");
    drawInfo->vertexOffset = val.toUint();

    ok = obj->getProperty("instanceCount", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get instanceCount from DrawInfo!");
    drawInfo->instanceCount = val.toUint();

    ok = obj->getProperty("firstInstance", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get firstInstance from DrawInfo!");
    drawInfo->firstInstance = val.toUint();

    return true;
}

bool seval_to_gfx_indirect_buffer(const se::Value &v, cc::gfx::IndirectBuffer *indirectBuffer) {
    assert(indirectBuffer != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::IndirectBuffer failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("drawInfos", &val);
    SE_PRECONDITION2(ok && val.isObject() && val.toObject()->isArray(), false, "Can not get drawInfos from IndirectBuffer!");
    auto drawInfosObj = val.toObject();
    uint32_t len = 0;
    if (drawInfosObj->getArrayLength(&len)) {
        indirectBuffer->drawInfos.resize(len);
        se::Value drawInfoVal;
        for (uint32_t i = 0; i < len; ++i) {
            drawInfosObj->getArrayElement(i, &drawInfoVal);
            seval_to_gfx_draw_info(drawInfoVal, &indirectBuffer->drawInfos[i]);
        }
    }

    return true;
}

bool seval_to_gfx_sampler_info(const se::Value &v, cc::gfx::SamplerInfo *samplerInfo) {
    assert(samplerInfo != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::SamplerInfo failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("minFilter", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get minFilter from SamplerInfo!");
    samplerInfo->minFilter = (cc::gfx::Filter)val.toUint();

    ok = obj->getProperty("magFilter", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get magFilter from SamplerInfo!");
    samplerInfo->magFilter = (cc::gfx::Filter)val.toUint();

    obj->getProperty("mipFilter", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get mipFilter from SamplerInfo!");
    samplerInfo->mipFilter = (cc::gfx::Filter)val.toUint();

    obj->getProperty("addressU", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get addressU from SamplerInfo!");
    samplerInfo->addressU = (cc::gfx::Address)val.toUint();

    obj->getProperty("addressV", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get addressV from SamplerInfo!");
    samplerInfo->addressV = (cc::gfx::Address)val.toUint();

    obj->getProperty("addressW", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get addressW from SamplerInfo!");
    samplerInfo->addressV = (cc::gfx::Address)val.toUint();

    obj->getProperty("maxAnisotropy", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get maxAnisotropy from SamplerInfo!");
    samplerInfo->maxAnisotropy = val.toUint();

    obj->getProperty("cmpFunc", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get cmpFunc from SamplerInfo!");
    samplerInfo->cmpFunc = (cc::gfx::ComparisonFunc)val.toUint();

    obj->getProperty("borderColor", &val);
    SE_PRECONDITION2(ok && val.isObject(), false, "Can not get borderColor from SamplerInfo!");
    seval_to_gfx_color(val, &samplerInfo->borderColor);

    obj->getProperty("minLOD", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get minLOD from SamplerInfo!");
    samplerInfo->minLOD = val.toUint();

    obj->getProperty("maxLOD", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get maxLOD from SamplerInfo!");
    samplerInfo->maxLOD = val.toUint();

    obj->getProperty("mipLODBias", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get mipLODBias from SamplerInfo!");
    samplerInfo->mipLODBias = val.toFloat();

    return true;
}

bool seval_to_gfx_depth_stencil_attachment(const se::Value &v, cc::gfx::DepthStencilAttachment *depthStencilAttachment) {
    assert(depthStencilAttachment != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::DepthStencilAttachment failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("format", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get format from DepthStencilAttachment!");
    depthStencilAttachment->format = (cc::gfx::Format)val.toUint();

    ok = obj->getProperty("sampleCount", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get sampleCount from DepthStencilAttachment!");
    depthStencilAttachment->sampleCount = val.toUint();

    ok = obj->getProperty("depthLoadOp", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get depthLoadOp from DepthStencilAttachment!");
    depthStencilAttachment->depthLoadOp = (cc::gfx::LoadOp)val.toUint();

    ok = obj->getProperty("depthStoreOp", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get depthStoreOp from DepthStencilAttachment!");
    depthStencilAttachment->depthStoreOp = (cc::gfx::StoreOp)val.toUint();

    ok = obj->getProperty("stencilLoadOp", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get stencilLoadOp from DepthStencilAttachment!");
    depthStencilAttachment->stencilLoadOp = (cc::gfx::LoadOp)val.toUint();

    ok = obj->getProperty("stencilStoreOp", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get stencilStoreOp from DepthStencilAttachment!");
    depthStencilAttachment->stencilStoreOp = (cc::gfx::StoreOp)val.toUint();

    ok = obj->getProperty("beginLayout", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get beginLayout from DepthStencilAttachment!");
    depthStencilAttachment->beginLayout = (cc::gfx::TextureLayout)val.toUint();

    ok = obj->getProperty("endLayout", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get endLayout from DepthStencilAttachment!");
    depthStencilAttachment->endLayout = (cc::gfx::TextureLayout)val.toUint();

    return true;
}

bool seval_to_gfx_color_attachment(const se::Value &v, cc::gfx::ColorAttachment *colorAttachment) {
    assert(colorAttachment != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::ColorAttachment failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("format", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get format from ColorAttachment!");
    colorAttachment->format = (cc::gfx::Format)val.toUint();

    ok = obj->getProperty("sampleCount", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get sampleCount from ColorAttachment!");
    colorAttachment->sampleCount = val.toUint();

    ok = obj->getProperty("loadOp", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get loadOp from ColorAttachment!");
    colorAttachment->loadOp = (cc::gfx::LoadOp)val.toUint();

    ok = obj->getProperty("storeOp", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get storeOp from ColorAttachment!");
    colorAttachment->storeOp = (cc::gfx::StoreOp)val.toUint();

    ok = obj->getProperty("beginLayout", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get beginLayout from ColorAttachment!");
    colorAttachment->beginLayout = (cc::gfx::TextureLayout)val.toUint();

    ok = obj->getProperty("endLayout", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get endLayout from ColorAttachment!");
    colorAttachment->endLayout = (cc::gfx::TextureLayout)val.toUint();

    return true;
}

bool seval_to_gfx_sub_pass_info(const se::Value &v, cc::gfx::SubPassInfo *subPassInfo) {
    assert(subPassInfo != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::SubPassInfo failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("bindPoint", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get format from SubPassInfo!");
    subPassInfo->bindPoint = (cc::gfx::PipelineBindPoint)val.toUint();

    obj->getProperty("inputs", &val);
    SE_PRECONDITION2(ok && val.isObject(), false, "Can not get inputs from SubPassInfo!");
    seval_to_std_vector(val, &subPassInfo->inputs);

    obj->getProperty("colors", &val);
    SE_PRECONDITION2(ok && val.isObject(), false, "Can not get colors from SubPassInfo!");
    seval_to_std_vector(val, &subPassInfo->colors);

    obj->getProperty("resolves", &val);
    SE_PRECONDITION2(ok && val.isObject(), false, "Can not get resolves from SubPassInfo!");
    seval_to_std_vector(val, &subPassInfo->resolves);

    ok = obj->getProperty("depthStencil", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get depthStencil from SubPassInfo!");
    subPassInfo->depthStencil = val.toUint();

    obj->getProperty("preserves", &val);
    SE_PRECONDITION2(ok && val.isObject(), false, "Can not get preserves from SubPassInfo!");
    seval_to_std_vector(val, &subPassInfo->preserves);

    return true;
}

bool seval_to_gfx_render_pass_info(const se::Value &v, cc::gfx::RenderPassInfo *renderPassInfo) {
    assert(renderPassInfo != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::RenderPassInfo failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("colorAttachments", &val);
    SE_PRECONDITION2(ok && val.isObject() && val.toObject()->isArray(), false, "Can not get colorAttachments from RenderPassInfo!");
    auto colorAttachmentsObj = val.toObject();
    uint32_t len = 0;
    if (colorAttachmentsObj->getArrayLength(&len)) {
        renderPassInfo->colorAttachments.resize(len);
        se::Value colorAttachmentVal;
        for (uint32_t i = 0; i < len; ++i) {
            colorAttachmentsObj->getArrayElement(i, &colorAttachmentVal);
            seval_to_gfx_color_attachment(colorAttachmentVal, &renderPassInfo->colorAttachments[i]);
        }
    }

    ok = obj->getProperty("depthStencilAttachment", &val);
    SE_PRECONDITION2(ok && val.isObject(), false, "Can not get depthStencilAttachment from RenderPassInfo!");
    seval_to_gfx_depth_stencil_attachment(val, &renderPassInfo->depthStencilAttachment);

    ok = obj->getProperty("subPasses", &val);
    SE_PRECONDITION2(ok && val.isObject() && val.toObject()->isArray(), false, "Can not get subPasses from RenderPassInfo!");
    auto subPassesObj = val.toObject();
    if (subPassesObj->getArrayLength(&len)) {
        renderPassInfo->subPasses.resize(len);
        se::Value subpassVal;
        for (uint32_t i = 0; i < len; ++i) {
            subPassesObj->getArrayElement(i, &subpassVal);
            seval_to_gfx_sub_pass_info(subpassVal, &renderPassInfo->subPasses[i]);
        }
    }

    return true;
}

bool seval_to_gfx_queue_info(const se::Value &v, cc::gfx::QueueInfo *queueInfo) {
    assert(queueInfo != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::QueueInfo failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("type", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get type from QueueInfo!");
    queueInfo->type = (cc::gfx::QueueType)val.toUint();

    return true;
}

bool seval_to_gfx_pipeline_layout_info(const se::Value &v, cc::gfx::PipelineLayoutInfo *pipelineLayoutInfo) {
    assert(pipelineLayoutInfo != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::PipelineLayoutInfo failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("setLayouts", &val);
    SE_PRECONDITION2(ok && val.isObject() && val.toObject()->isArray(), false, "Can not get setLayouts from PipelineLayoutInfo!");
    auto setLayoutsObj = val.toObject();
    uint32_t len = 0;
    if (setLayoutsObj->getArrayLength(&len)) {
        pipelineLayoutInfo->setLayouts.resize(len);
        se::Value setLayoutVal;
        for (uint32_t i = 0; i < len; ++i) {
            setLayoutsObj->getArrayElement(i, &setLayoutVal);
            pipelineLayoutInfo->setLayouts[i] = static_cast<cc::gfx::DescriptorSetLayout *>(setLayoutVal.toObject()->getPrivateData());
        }
    }

    return true;
}

bool seval_to_gfx_descriptor_set_layout_binding(const se::Value &v, cc::gfx::DescriptorSetLayoutBinding *dscriptorSetLayoutBinding) {
    assert(dscriptorSetLayoutBinding != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::DescriptorSetLayoutBinding failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    bool ok = obj->getProperty("binding", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get binding from DescriptorSetLayoutBinding!");
    dscriptorSetLayoutBinding->binding = val.toUint();

    ok = obj->getProperty("descriptorType", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get descriptorType from DescriptorSetLayoutBinding!");
    dscriptorSetLayoutBinding->descriptorType = (cc::gfx::DescriptorType)val.toUint();

    ok = obj->getProperty("count", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get count from DescriptorSetLayoutBinding!");
    dscriptorSetLayoutBinding->count = val.toUint();

    ok = obj->getProperty("stageFlags", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get stageFlags from DescriptorSetLayoutBinding!");
    dscriptorSetLayoutBinding->stageFlags = (cc::gfx::ShaderStageFlags)val.toUint();

    ok = obj->getProperty("immutableSamplers", &val);
    SE_PRECONDITION2(ok && val.isObject() && val.toObject()->isArray(), false, "Can not get immutableSamplers from DescriptorSetLayoutBinding!");
    auto immutableSamplersObj = val.toObject();
    uint32_t len = 0;
    if (immutableSamplersObj->getArrayLength(&len)) {
        dscriptorSetLayoutBinding->immutableSamplers.resize(len);
        se::Value samplerVal;
        for (uint32_t i = 0; i < len; ++i) {
            immutableSamplersObj->getArrayElement(i, &samplerVal);
            dscriptorSetLayoutBinding->immutableSamplers[i] = static_cast<cc::gfx::Sampler *>(samplerVal.toObject()->getPrivateData());
        }
    }

    return true;
}

bool seval_to_gfx_descriptor_set_layout_info(const se::Value &v, cc::gfx::DescriptorSetLayoutInfo *dscriptorSetLayoutInfo) {
    assert(dscriptorSetLayoutInfo != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::DescriptorSetLayoutInfo failed!");
    se::Object *obj = v.toObject();
    se::Value val;

    bool ok = obj->getProperty("bindings", &val);
    SE_PRECONDITION2(ok && val.isObject() && val.toObject()->isArray(), false, "Can not get bindings from DescriptorSetLayoutInfo!");
    auto bindingsObj = val.toObject();
    uint32_t len = 0;
    if (bindingsObj->getArrayLength(&len)) {
        dscriptorSetLayoutInfo->bindings.resize(len);
        se::Value bindingVal;
        for (uint32_t i = 0; i < len; ++i) {
            bindingsObj->getArrayElement(i, &bindingVal);
            seval_to_gfx_descriptor_set_layout_binding(bindingVal, &dscriptorSetLayoutInfo->bindings[i]);
        }
    }

    return true;
}

bool seval_to_gfx_frame_buffer_info(const se::Value &v, cc::gfx::FramebufferInfo *framebufferInfo) {
    assert(framebufferInfo != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::FramebufferInfo failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    
    bool ok = obj->getProperty("renderPass", &val);
    SE_PRECONDITION2(ok, false, "Can not get renderPass from FramebufferInfo!");
    if (!val.isNullOrUndefined()) framebufferInfo->renderPass = static_cast<cc::gfx::RenderPass *>(val.toObject()->getPrivateData());
    
     ok  = obj->getProperty("colorTextures", &val);
    SE_PRECONDITION2(ok, false, "Can not get colorTextures from FramebufferInfo!");
    se::Object *colorTexturesObj = val.toObject();
    if (!val.isNullOrUndefined()) {
        uint32_t len = 0;
        if (colorTexturesObj->getArrayLength(&len)) {
            framebufferInfo->colorTextures.resize(len);
            se::Value colorTextureVal;
            for (uint32_t i = 0; i < len; ++i) {
                colorTexturesObj->getArrayElement(i, &colorTextureVal);
                if (colorTextureVal.isNullOrUndefined()) framebufferInfo->colorTextures[i] = nullptr;
                else framebufferInfo->colorTextures[i] = static_cast<cc::gfx::Texture *>(colorTextureVal.toObject()->getPrivateData());
            }
        }
    }
    
    ok = obj->getProperty("depthStencilTexture", &val);
    SE_PRECONDITION2(ok, false, "Can not get depthStencilTexture from FramebufferInfo!");
    if (!val.isNullOrUndefined()) framebufferInfo->depthStencilTexture = static_cast<cc::gfx::Texture *>(val.toObject()->getPrivateData());
    
    ok = obj->getProperty("colorMipmapLevels", &val);
    SE_PRECONDITION2(ok && val.isObject() && val.toObject()->isArray(), false, "Can not get colorMipmapLevels from FramebufferInfo!");
    seval_to_std_vector(val, &framebufferInfo->colorMipmapLevels);
    
    ok = obj->getProperty("depStencilMipmapLevel", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get depStencilMipmapLevel from FramebufferInfo!");
    framebufferInfo->depthStencilMipmapLevel = val.toUint();
    
    return true;
}

bool seval_to_gfx_command_buffer_info(const se::Value &v, cc::gfx::CommandBufferInfo *commandBufferInfo) {
    assert(commandBufferInfo != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::CommandBufferInfo failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    
    obj->getProperty("queue", &val);
    if (!val.isNullOrUndefined()) commandBufferInfo->queue = static_cast<cc::gfx::Queue *>(val.toObject()->getPrivateData());
    
    bool ok = obj->getProperty("type", &val);
    SE_PRECONDITION2(ok && val.isNumber(), false, "Can not get type from FramebufferInfo!");
    commandBufferInfo->type = (cc::gfx::CommandBufferType)val.toUint();
    
    return true;
}

bool seval_to_gfx_input_assembler_info(const se::Value &v, cc::gfx::InputAssemblerInfo *inputAssemblerInfo) {
    assert(inputAssemblerInfo != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to cc::gfx::InputAssemblerInfo failed!");
    se::Object *obj = v.toObject();
    se::Value val;
    
    bool ok = obj->getProperty("attributes", &val);
    SE_PRECONDITION2(ok && val.isObject() && val.toObject()->isArray(), false, "Can not get attributes from cc::gfx::InputAssemblerInfo!");
    se::Object *attributesObj = val.toObject();
    uint32_t len = 0;
    if (attributesObj->getArrayLength(&len)) {
        inputAssemblerInfo->attributes.resize(len);
        se::Value attributeVal;
        for (uint32_t i = 0; i < len; ++i) {
            attributesObj->getArrayElement(i, &attributeVal);
            inputAssemblerInfo->attributes[i] = *static_cast<cc::gfx::Attribute *>(attributeVal.toObject()->getPrivateData());
        }
    }
    
    ok = obj->getProperty("vertexBuffers", &val);
    SE_PRECONDITION2(ok && val.isObject() && val.toObject()->isArray(), false, "Can not get vertexBuffers from cc::gfx::InputAssemblerInfo!");
    se::Object *vertexBuffersObj = val.toObject();
    if (vertexBuffersObj->getArrayLength(&len)) {
        inputAssemblerInfo->vertexBuffers.resize(len);
        se::Value vertexBufferVal;
        for (uint32_t i = 0; i < len; ++i) {
            vertexBuffersObj->getArrayElement(i, &vertexBufferVal);
            inputAssemblerInfo->vertexBuffers[i] = static_cast<cc::gfx::Buffer *>(vertexBufferVal.toObject()->getPrivateData());
        }
    }
    
    ok = obj->getProperty("indexBuffer", &val);
    SE_PRECONDITION2(ok, false, "Can not get indexBuffer from cc::gfx::InputAssemblerInfo!");
    if (!val.isNullOrUndefined()) inputAssemblerInfo->indexBuffer = static_cast<cc::gfx::Buffer *>(val.toObject()->getPrivateData());
    
    ok = obj->getProperty("indirectBuffer", &val);
    SE_PRECONDITION2(ok, false, "Can not get indirectBuffer from cc::gfx::InputAssemblerInfo!");
    if (!val.isNullOrUndefined()) inputAssemblerInfo->indirectBuffer = static_cast<cc::gfx::Buffer *>(val.toObject()->getPrivateData());
    
    return true;
}

#if USE_GFX_RENDERER

#endif // USE_GFX_RENDERER > 0

//////////////////////////////////////////////////////////////////////////////////
// native to seval

bool int32_to_seval(int32_t v, se::Value *ret) {
    ret->setInt32(v);
    return true;
}

bool uint32_to_seval(uint32_t v, se::Value *ret) {
    ret->setUint32(v);
    return true;
}

bool int16_to_seval(uint16_t v, se::Value *ret) {
    ret->setInt16(v);
    return true;
}

bool uint16_to_seval(uint16_t v, se::Value *ret) {
    ret->setUint16(v);
    return true;
}

bool int8_to_seval(int8_t v, se::Value *ret) {
    ret->setInt8(v);
    return true;
}

bool uint8_to_seval(uint8_t v, se::Value *ret) {
    ret->setUint8(v);
    return true;
}

bool boolean_to_seval(bool v, se::Value *ret) {
    ret->setBoolean(v);
    return true;
}

bool float_to_seval(float v, se::Value *ret) {
    ret->setFloat(v);
    return true;
}

bool double_to_seval(double v, se::Value *ret) {
    ret->setNumber(v);
    return true;
}

bool long_to_seval(long v, se::Value *ret) {
    ret->setLong(v);
    return true;
}

bool ulong_to_seval(unsigned long v, se::Value *ret) {
    ret->setUlong(v);
    return true;
}

bool longlong_to_seval(long long v, se::Value *ret) {
    ret->setLong((long)v);
    return true;
}

bool uintptr_t_to_seval(uintptr_t v, se::Value *ret) {
    ret->setUIntptr_t(v);
    return true;
}

bool size_to_seval(size_t v, se::Value *ret) {
    ret->setLong((unsigned long)v);
    return true;
}

bool std_string_to_seval(const std::string &v, se::Value *ret) {
    ret->setString(v);
    return true;
}

bool Vec2_to_seval(const cc::Vec2 &v, se::Value *ret) {
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("x", se::Value(v.x));
    obj->setProperty("y", se::Value(v.y));
    ret->setObject(obj);

    return true;
}

bool Vec3_to_seval(const cc::Vec3 &v, se::Value *ret) {
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("x", se::Value(v.x));
    obj->setProperty("y", se::Value(v.y));
    obj->setProperty("z", se::Value(v.z));
    ret->setObject(obj);

    return true;
}

bool Vec4_to_seval(const cc::Vec4 &v, se::Value *ret) {
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("x", se::Value(v.x));
    obj->setProperty("y", se::Value(v.y));
    obj->setProperty("z", se::Value(v.z));
    obj->setProperty("w", se::Value(v.w));
    ret->setObject(obj);

    return true;
}

bool Mat4_to_seval(const cc::Mat4 &v, se::Value *ret) {
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createArrayObject(16));

    for (uint8_t i = 0; i < 16; ++i) {
        obj->setArrayElement(i, se::Value(v.m[i]));
    }

    ret->setObject(obj);
    return true;
}

bool Size_to_seval(const cc::Size &v, se::Value *ret) {
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("width", se::Value(v.width));
    obj->setProperty("height", se::Value(v.height));
    ret->setObject(obj);
    return true;
}

bool Rect_to_seval(const cc::Rect &v, se::Value *ret) {
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("x", se::Value(v.origin.x));
    obj->setProperty("y", se::Value(v.origin.y));
    obj->setProperty("width", se::Value(v.size.width));
    obj->setProperty("height", se::Value(v.size.height));
    ret->setObject(obj);

    return true;
}

bool ccvalue_to_seval(const cc::Value &v, se::Value *ret) {
    assert(ret != nullptr);
    bool ok = true;
    switch (v.getType()) {
        case cc::Value::Type::NONE:
            ret->setNull();
            break;
        case cc::Value::Type::UNSIGNED:
            ret->setUint32(v.asUnsignedInt());
            break;
        case cc::Value::Type::BOOLEAN:
            ret->setBoolean(v.asBool());
            break;
        case cc::Value::Type::FLOAT:
        case cc::Value::Type::DOUBLE:
            ret->setNumber(v.asDouble());
            break;
        case cc::Value::Type::INTEGER:
            ret->setInt32(v.asInt());
            break;
        case cc::Value::Type::STRING:
            ret->setString(v.asString());
            break;
        case cc::Value::Type::VECTOR:
            ok = ccvaluevector_to_seval(v.asValueVector(), ret);
            break;
        case cc::Value::Type::MAP:
            ok = ccvaluemap_to_seval(v.asValueMap(), ret);
            break;
        case cc::Value::Type::INT_KEY_MAP:
            ok = ccvaluemapintkey_to_seval(v.asIntKeyMap(), ret);
            break;
        default:
            SE_LOGE("Could not the way to convert cc::Value::Type (%d) type!", (int)v.getType());
            ok = false;
            break;
    }

    return ok;
}

bool ccvaluemap_to_seval(const cc::ValueMap &v, se::Value *ret) {
    assert(ret != nullptr);

    se::HandleObject obj(se::Object::createPlainObject());
    bool ok = true;
    for (const auto &e : v) {
        const std::string &key = e.first;
        const cc::Value &value = e.second;

        if (key.empty())
            continue;

        se::Value tmp;
        if (!ccvalue_to_seval(value, &tmp)) {
            ok = false;
            ret->setUndefined();
            break;
        }

        obj->setProperty(key.c_str(), tmp);
    }
    if (ok)
        ret->setObject(obj);

    return ok;
}

bool ccvaluemapintkey_to_seval(const cc::ValueMapIntKey &v, se::Value *ret) {
    assert(ret != nullptr);

    se::HandleObject obj(se::Object::createPlainObject());
    bool ok = true;
    for (const auto &e : v) {
        std::stringstream keyss;
        keyss << e.first;
        std::string key = keyss.str();
        const cc::Value &value = e.second;

        if (key.empty())
            continue;

        se::Value tmp;
        if (!ccvalue_to_seval(value, &tmp)) {
            ok = false;
            ret->setUndefined();
            break;
        }

        obj->setProperty(key.c_str(), tmp);
    }
    if (ok)
        ret->setObject(obj);

    return ok;
}

bool ccvaluevector_to_seval(const cc::ValueVector &v, se::Value *ret) {
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createArrayObject(v.size()));
    bool ok = true;

    uint32_t i = 0;
    for (const auto &value : v) {
        se::Value tmp;
        if (!ccvalue_to_seval(value, &tmp)) {
            ok = false;
            ret->setUndefined();
            break;
        }

        obj->setArrayElement(i, tmp);
        ++i;
    }
    if (ok)
        ret->setObject(obj);

    return ok;
}

namespace {

template <typename T>
bool std_vector_T_to_seval(const std::vector<T> &v, se::Value *ret) {
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createArrayObject(v.size()));
    bool ok = true;

    uint32_t i = 0;
    for (const auto &value : v) {
        if (!obj->setArrayElement(i, se::Value(value))) {
            ok = false;
            ret->setUndefined();
            break;
        }
        ++i;
    }

    if (ok)
        ret->setObject(obj);

    return ok;
}

} // namespace

bool std_vector_string_to_seval(const std::vector<std::string> &v, se::Value *ret) {
    return std_vector_T_to_seval(v, ret);
}

bool std_vector_int_to_seval(const std::vector<int> &v, se::Value *ret) {
    return std_vector_T_to_seval(v, ret);
}

bool std_vector_uint16_to_seval(const std::vector<uint16_t> &v, se::Value *ret) {
    return std_vector_T_to_seval(v, ret);
}

bool std_vector_float_to_seval(const std::vector<float> &v, se::Value *ret) {
    return std_vector_T_to_seval(v, ret);
}

bool std_map_string_string_to_seval(const std::map<std::string, std::string> &v, se::Value *ret) {
    assert(ret != nullptr);

    se::HandleObject obj(se::Object::createPlainObject());
    bool ok = true;
    for (const auto &e : v) {
        const std::string &key = e.first;
        const std::string &value = e.second;

        if (key.empty())
            continue;

        se::Value tmp;
        if (!std_string_to_seval(value, &tmp)) {
            ok = false;
            ret->setUndefined();
            break;
        }

        obj->setProperty(key.c_str(), tmp);
    }

    if (ok)
        ret->setObject(obj);

    return ok;
}

namespace {
enum class DataType {
    INT,
    FLOAT
};

void toVec2(void *data, DataType type, se::Value *ret) {
    int32_t *intptr = (int32_t *)data;
    float *floatptr = (float *)data;
    cc::Vec2 vec2;
    if (DataType::INT == type) {
        vec2.x = *intptr;
        vec2.y = *(intptr + 1);
    } else {
        vec2.x = *floatptr;
        vec2.y = *(floatptr + 1);
    }

    Vec2_to_seval(vec2, ret);
}

void toVec3(void *data, DataType type, se::Value *ret) {
    int32_t *intptr = (int32_t *)data;
    float *floatptr = (float *)data;
    cc::Vec3 vec3;
    if (DataType::INT == type) {
        vec3.x = *intptr;
        vec3.y = *(intptr + 1);
        vec3.z = *(intptr + 2);
    } else {
        vec3.x = *floatptr;
        vec3.y = *(floatptr + 1);
        vec3.z = *(floatptr + 2);
    }

    Vec3_to_seval(vec3, ret);
}

void toVec4(void *data, DataType type, se::Value *ret) {
    int32_t *intptr = (int32_t *)data;
    float *floatptr = (float *)data;
    cc::Vec4 vec4;
    if (DataType::INT == type) {
        vec4.x = *intptr;
        vec4.y = *(intptr + 1);
        vec4.z = *(intptr + 2);
        vec4.w = *(intptr + 3);
    } else {
        vec4.x = *floatptr;
        vec4.y = *(floatptr + 1);
        vec4.z = *(floatptr + 2);
        vec4.w = *(floatptr + 3);
    }

    Vec4_to_seval(vec4, ret);
}

void toMat(float *data, int num, se::Value *ret) {
    se::HandleObject obj(se::Object::createPlainObject());

    char propName[4] = {0};
    for (int i = 0; i < num; ++i) {
        if (i < 10)
            snprintf(propName, 3, "m0%d", i);
        else
            snprintf(propName, 3, "m%d", i);

        obj->setProperty(propName, se::Value(*(data + i)));
    }
    ret->setObject(obj);
}
} // namespace

bool ManifestAsset_to_seval(const cc::extension::ManifestAsset &v, se::Value *ret) {
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("md5", se::Value(v.md5));
    obj->setProperty("path", se::Value(v.path));
    obj->setProperty("compressed", se::Value(v.compressed));
    obj->setProperty("size", se::Value(v.size));
    obj->setProperty("downloadState", se::Value(v.downloadState));
    ret->setObject(obj);

    return true;
}

bool Data_to_seval(const cc::Data &v, se::Value *ret) {
    assert(ret != nullptr);
    if (v.isNull()) {
        ret->setNull();
    } else {
        se::HandleObject obj(se::Object::createTypedArray(se::Object::TypedArrayType::UINT8, v.getBytes(), v.getSize()));
        ret->setObject(obj, true);
    }
    return true;
}

bool DownloadTask_to_seval(const cc::network::DownloadTask &v, se::Value *ret) {
    assert(ret != nullptr);

    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("identifier", se::Value(v.identifier));
    obj->setProperty("requestURL", se::Value(v.requestURL));
    obj->setProperty("storagePath", se::Value(v.storagePath));
    ret->setObject(obj);

    return true;
}

#if USE_GFX_RENDERER
#endif // USE_GFX_RENDERER > 0
