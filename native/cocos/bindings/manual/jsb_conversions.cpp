/****************************************************************************
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

#include "jsb_conversions.h"

#include <regex>
#include <sstream>

#include "base/TypeDef.h"
#include "gfx-base/GFXDef.h"
#include "math/Math.h"

// seval to native

bool seval_to_int32(const se::Value &v, int32_t *ret) {
    assert(ret != nullptr);
    if (v.isNumber()) {
        *ret = v.toInt32();
        return true;
    }
    if (v.isBoolean()) {
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
    }
    if (v.isBoolean()) {
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
    }
    if (v.isBoolean()) {
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
    }
    if (v.isBoolean()) {
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
    }
    if (v.isBoolean()) {
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
    }
    if (v.isBoolean()) {
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
        *ret = v.toInt32() != 0;
    } else if (v.isNullOrUndefined()) {
        *ret = false;
    } else if (v.isObject()) {
        *ret = true;
    } else if (v.isString()) {
        *ret = !v.toString().empty();
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
        if (!std::isnan(*ret)) {
            return true;
        }
    }
    *ret = 0.0F;
    return false;
}

bool seval_to_double(const se::Value &v, double *ret) {
    if (v.isNumber()) {
        *ret = v.toDouble();
        if (!std::isnan(*ret)) {
            return true;
        }
    }
    *ret = 0.0;
    return false;
}

bool seval_to_size(const se::Value &v, size_t *ret) {
    assert(ret != nullptr);
    if (v.isNumber()) {
        *ret = v.toSize();
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
    se::Value   x;
    se::Value   y;
    bool        ok = obj->getProperty("x", &x);
    SE_PRECONDITION3(ok && x.isNumber(), false, *pt = cc::Vec2::ZERO);
    ok = obj->getProperty("y", &y);
    SE_PRECONDITION3(ok && y.isNumber(), false, *pt = cc::Vec2::ZERO);
    pt->x = x.toFloat();
    pt->y = y.toFloat();
    return true;
}

bool seval_to_mat(const se::Value &v, int length, float *out) {
    assert(out != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Matrix failed!");
    se::Object *obj = v.toObject();

    se::Value tmp;
    char      propName[3] = {0};
    for (int i = 0; i < length; ++i) {
        snprintf(propName, 3, "m%2d", i);
        obj->getProperty(propName, &tmp);
        *(out + i) = tmp.toFloat();
    }

    return true;
}

bool seval_to_Uint8Array(const se::Value &v, uint8_t *ret) {
    assert(ret != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Array failed!");
    se::Object *obj = v.toObject();
    SE_PRECONDITION2(obj->isArray(), false, "Convert parameter to Array failed!");

    CC_UNUSED bool ok     = true;
    uint32_t       length = 0;
    obj->getArrayLength(&length);
    se::Value value;
    uint8_t   data = 0;
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
        *ret = static_cast<uintptr_t>(v.toDouble());
        return true;
    }
    *ret = 0UL;
    return false;
}

bool seval_to_Size(const se::Value &v, cc::Size *size) {
    assert(size != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Size failed!");
    se::Object *obj = v.toObject();
    se::Value   width;
    se::Value   height;

    bool ok = obj->getProperty("width", &width);
    SE_PRECONDITION3(ok && width.isNumber(), false, *size = cc::Size::ZERO);
    ok = obj->getProperty("height", &height);
    SE_PRECONDITION3(ok && height.isNumber(), false, *size = cc::Size::ZERO);
    size->width  = width.toFloat();
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
            SE_PRECONDITION3(ok, false, *ret = cc::Value::VALUE_NULL);
            *ret = cc::Value(dictVal);
        } else {
            // It's a js array object.
            cc::ValueVector arrVal;
            ok = seval_to_ccvaluevector(v, &arrVal);
            SE_PRECONDITION3(ok, false, *ret = cc::Value::VALUE_NULL);
            *ret = cc::Value(arrVal);
        }
    } else if (v.isString()) {
        *ret = v.toString();
    } else if (v.isNumber()) {
        *ret = v.toDouble();
    } else if (v.isBoolean()) {
        *ret = v.toBoolean();
    } else if (v.isNullOrUndefined()) {
        *ret = cc::Value::VALUE_NULL;
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

    bool      ok = false;
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
        if (!isdigit(c)) {
            return false;
        }
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

    bool      ok = false;
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

    bool      ok = false;
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
    bool      ok = false;
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
        size_t                     bytesPerElements = 0;
        uint8_t *                  data             = nullptr;
        size_t                     dataBytes        = 0;
        se::Object::TypedArrayType type             = obj->getTypedArrayType();

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
        size_t                     bytesPerElements = 0;
        uint8_t *                  data             = nullptr;
        size_t                     dataBytes        = 0;
        se::Object::TypedArrayType type             = obj->getTypedArrayType();

        if (obj->getTypedArrayData(&data, &dataBytes)) {
            for (size_t i = 0; i < dataBytes; i += bytesPerElements) {
                switch (type) {
                    case se::Object::TypedArrayType::INT16:
                    case se::Object::TypedArrayType::UINT16:
                        ret->push_back(*(reinterpret_cast<uint16_t *>(data + i)));
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
        cc::Vec2  pt;
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

    bool        ok = false;
    se::Value   value;
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
    uint8_t *ptr    = nullptr;
    size_t   length = 0;
    bool     ok     = v.toObject()->getTypedArrayData(&ptr, &length);
    if (ok) {
        ret->copy(ptr, length);
    } else {
        ret->clear();
    }

    return ok;
}

bool seval_to_DownloaderHints(const se::Value &v, cc::network::DownloaderHints *ret) {
    const static cc::network::DownloaderHints ZERO{0, 0, ""};
    assert(ret != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to DownloaderHints failed!");
    se::Value   tmp;
    se::Object *obj = v.toObject();
    bool        ok  = false;

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
    ret->setDouble(v);
    return true;
}

bool uintptr_t_to_seval(uintptr_t v, se::Value *ret) {
    ret->setDouble(v);
    return true;
}

bool size_to_seval(size_t v, se::Value *ret) {
    ret->setSize(v);
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
            ret->setDouble(v.asDouble());
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
    bool             ok = true;
    for (const auto &e : v) {
        const std::string &key   = e.first;
        const cc::Value &  value = e.second;

        if (key.empty()) {
            continue;
        }

        se::Value tmp;
        if (!ccvalue_to_seval(value, &tmp)) {
            ok = false;
            ret->setUndefined();
            break;
        }

        obj->setProperty(key.c_str(), tmp);
    }
    if (ok) {
        ret->setObject(obj);
    }

    return ok;
}

bool ccvaluemapintkey_to_seval(const cc::ValueMapIntKey &v, se::Value *ret) {
    assert(ret != nullptr);

    se::HandleObject obj(se::Object::createPlainObject());
    bool             ok = true;
    for (const auto &e : v) {
        std::stringstream keyss;
        keyss << e.first;
        std::string      key   = keyss.str();
        const cc::Value &value = e.second;

        if (key.empty()) {
            continue;
        }

        se::Value tmp;
        if (!ccvalue_to_seval(value, &tmp)) {
            ok = false;
            ret->setUndefined();
            break;
        }

        obj->setProperty(key.c_str(), tmp);
    }
    if (ok) {
        ret->setObject(obj);
    }

    return ok;
}

bool ccvaluevector_to_seval(const cc::ValueVector &v, se::Value *ret) {
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createArrayObject(v.size()));
    bool             ok = true;

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
    if (ok) {
        ret->setObject(obj);
    }

    return ok;
}

namespace {

template <typename T>
bool std_vector_T_to_seval(const std::vector<T> &v, se::Value *ret) {
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createArrayObject(v.size()));
    bool             ok = true;

    uint32_t i = 0;
    for (const auto &value : v) {
        if (!obj->setArrayElement(i, se::Value(value))) {
            ok = false;
            ret->setUndefined();
            break;
        }
        ++i;
    }

    if (ok) {
        ret->setObject(obj);
    }

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
    bool             ok = true;
    for (const auto &e : v) {
        const std::string &key   = e.first;
        const std::string &value = e.second;

        if (key.empty()) {
            continue;
        }

        se::Value tmp;
        if (!std_string_to_seval(value, &tmp)) {
            ok = false;
            ret->setUndefined();
            break;
        }

        obj->setProperty(key.c_str(), tmp);
    }

    if (ok) {
        ret->setObject(obj);
    }

    return ok;
}

namespace {
enum class DataType {
    INT,
    FLOAT
};

void toVec2(void *data, DataType type, se::Value *ret) {
    auto *   intptr   = static_cast<int32_t *>(data);
    auto *   floatptr = static_cast<float *>(data);
    cc::Vec2 vec2;
    if (DataType::INT == type) {
        vec2.x = static_cast<float>(intptr[0]);
        vec2.y = static_cast<float>(intptr[1]);
    } else {
        vec2.x = *floatptr;
        vec2.y = *(floatptr + 1);
    }

    Vec2_to_seval(vec2, ret);
}

void toVec3(void *data, DataType type, se::Value *ret) {
    auto *   intptr   = static_cast<int32_t *>(data);
    auto *   floatptr = static_cast<float *>(data);
    cc::Vec3 vec3;
    if (DataType::INT == type) {
        vec3.x = static_cast<float>(intptr[0]);
        vec3.y = static_cast<float>(intptr[1]);
        vec3.z = static_cast<float>(intptr[2]);
    } else {
        vec3.x = floatptr[0];
        vec3.y = floatptr[1];
        vec3.z = floatptr[2];
    }

    Vec3_to_seval(vec3, ret);
}

void toVec4(void *data, DataType type, se::Value *ret) {
    auto *   intptr   = static_cast<int32_t *>(data);
    auto *   floatptr = static_cast<float *>(data);
    cc::Vec4 vec4;
    if (DataType::INT == type) {
        vec4.x = static_cast<float>(intptr[0]);
        vec4.y = static_cast<float>(intptr[1]);
        vec4.z = static_cast<float>(intptr[2]);
        vec4.w = static_cast<float>(intptr[3]);
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
        if (i < 10) {
            snprintf(propName, 3, "m0%d", i);
        }

        else {
            snprintf(propName, 3, "m%d", i);
        }

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

////////////////// custom types

template <>
bool nativevalue_to_se(const cc::Data &from, se::Value &to, se::Object * /*unused*/) {
    se::Object *buffer = se::Object::createArrayBufferObject(from.getBytes(), from.getSize());
    to.setObject(buffer);
    return true;
}

template <>
bool nativevalue_to_se(const cc::Value &from, se::Value &to, se::Object * /*unused*/) {
    return ccvalue_to_seval(from, &to);
}

template <>
bool nativevalue_to_se(const std::unordered_map<std::string, cc::Value> &from, se::Value &to, se::Object * /*unused*/) {
    return ccvaluemap_to_seval(from, &to);
}

template <>
bool nativevalue_to_se(const cc::Vec4 &from, se::Value &to, se::Object * /*unused*/) {
    return Vec4_to_seval(from, &to);
}

template <>
bool nativevalue_to_se(const cc::Vec2 &from, se::Value &to, se::Object * /*unused*/) {
    return Vec2_to_seval(from, &to);
}

template <>
bool nativevalue_to_se(const cc::Vec3 &from, se::Value &to, se::Object * /*unused*/) {
    return Vec3_to_seval(from, &to);
}

template <>
bool nativevalue_to_se(const cc::Size &from, se::Value &to, se::Object * /*unused*/) {
    return Size_to_seval(from, &to);
}

template <>
bool nativevalue_to_se(const cc::extension::ManifestAsset &from, se::Value &to, se::Object * /*unused*/) {
    return ManifestAsset_to_seval(from, &to);
}

template <>
bool nativevalue_to_se(const cc::Rect &from, se::Value &to, se::Object * /*unused*/) {
    return Rect_to_seval(from, &to);
}

template <>
bool sevalue_to_native(const se::Value &from, cc::Vec4 *to, se::Object * /*unused*/) {
    SE_PRECONDITION2(from.isObject(), false, "Convert parameter to Vec4 failed!");
    se::Object *obj = from.toObject();
    se::Value   x;
    se::Value   y;
    se::Value   z;
    se::Value   w;
    bool        ok = obj->getProperty("x", &x);
    SE_PRECONDITION3(ok && x.isNumber(), false, *to = cc::Vec4::ZERO);
    ok = obj->getProperty("y", &y);
    SE_PRECONDITION3(ok && y.isNumber(), false, *to = cc::Vec4::ZERO);
    ok = obj->getProperty("z", &z);
    SE_PRECONDITION3(ok && z.isNumber(), false, *to = cc::Vec4::ZERO);
    ok = obj->getProperty("w", &w);
    SE_PRECONDITION3(ok && w.isNumber(), false, *to = cc::Vec4::ZERO);
    to->x = x.toFloat();
    to->y = y.toFloat();
    to->z = z.toFloat();
    to->w = w.toFloat();
    return true;
}

template <>
bool sevalue_to_native(const se::Value &from, cc::Mat4 *to, se::Object * /*unused*/) {
    SE_PRECONDITION2(from.isObject(), false, "Convert parameter to Matrix4 failed!");
    se::Object *obj = from.toObject();

    if (obj->isTypedArray()) {
        // typed array
        SE_PRECONDITION2(obj->isTypedArray(), false, "Convert parameter to Matrix4 failed!");

        size_t   length = 0;
        uint8_t *ptr    = nullptr;
        obj->getTypedArrayData(&ptr, &length);

        memcpy(to->m, ptr, length);
    } else {
        bool        ok = false;
        se::Value   tmp;
        std::string prefix = "m";
        for (uint32_t i = 0; i < 16; ++i) {
            std::string name;
            if (i < 10) {
                name = prefix + "0" + std::to_string(i);
            } else {
                name = prefix + std::to_string(i);
            }
            ok = obj->getProperty(name.c_str(), &tmp);
            SE_PRECONDITION3(ok, false, *to = cc::Mat4::IDENTITY);

            if (tmp.isNumber()) {
                to->m[i] = tmp.toFloat();
            } else {
                SE_REPORT_ERROR("%u, not supported type in matrix", i);
                *to = cc::Mat4::IDENTITY;
                return false;
            }

            tmp.setUndefined();
        }
    }

    return true;
}

template <>
bool sevalue_to_native(const se::Value &from, cc::Vec3 *to, se::Object * /*unused*/) {
    SE_PRECONDITION2(from.isObject(), false, "Convert parameter to Vec3 failed!");
    if (!from.isObject()) {
    }
    se::Object *obj = from.toObject();
    se::Value   x;
    se::Value   y;
    se::Value   z;
    bool        ok = obj->getProperty("x", &x);
    SE_PRECONDITION3(ok && x.isNumber(), false, *to = cc::Vec3::ZERO);
    ok = obj->getProperty("y", &y);
    SE_PRECONDITION3(ok && y.isNumber(), false, *to = cc::Vec3::ZERO);
    ok = obj->getProperty("z", &z);
    SE_PRECONDITION3(ok && z.isNumber(), false, *to = cc::Vec3::ZERO);
    to->x = x.toFloat();
    to->y = y.toFloat();
    to->z = z.toFloat();
    return true;
}

template <>
bool sevalue_to_native(const se::Value &from, cc::Vec2 *to, se::Object * /*unused*/) {
    SE_PRECONDITION2(from.isObject(), false, "Convert parameter to Vec2 failed!");
    if (!from.isObject()) {
    }
    se::Object *obj = from.toObject();
    se::Value   x;
    se::Value   y;
    bool        ok = obj->getProperty("x", &x);
    SE_PRECONDITION3(ok && x.isNumber(), false, *to = cc::Vec2::ZERO);
    ok = obj->getProperty("y", &y);
    SE_PRECONDITION3(ok && y.isNumber(), false, *to = cc::Vec2::ZERO);
    to->x = x.toFloat();
    to->y = y.toFloat();
    return true;
}

template <>
bool sevalue_to_native(const se::Value &from, cc::Quaternion *to, se::Object * /*unused*/) {
    SE_PRECONDITION2(from.isObject(), false, "Convert parameter to Quaternion failed!");
    if (!from.isObject()) {
    }
    se::Object *obj = from.toObject();
    se::Value   x;
    se::Value   y;
    se::Value   z;
    se::Value   w;
    bool        ok = obj->getProperty("x", &x);
    SE_PRECONDITION3(ok && x.isNumber(), false, *to = cc::Quaternion::ZERO);
    ok = obj->getProperty("y", &y);
    SE_PRECONDITION3(ok && y.isNumber(), false, *to = cc::Quaternion::ZERO);
    ok = obj->getProperty("z", &z);
    SE_PRECONDITION3(ok && z.isNumber(), false, *to = cc::Quaternion::ZERO);
    ok = obj->getProperty("w", &w);
    SE_PRECONDITION3(ok && w.isNumber(), false, *to = cc::Quaternion::ZERO);
    to->x = x.toFloat();
    to->y = y.toFloat();
    to->z = z.toFloat();
    to->w = w.toFloat();
    return true;
}

#if USE_SPINE

template <>
bool sevalue_to_native(const se::Value &val, spine::String *obj, se::Object * /*unused*/) {
    *obj = val.toString().data();
    return true;
}

template <>
bool sevalue_to_native(const se::Value &v, spine::Vector<spine::String> *ret, se::Object * /*unused*/) {
    assert(v.isObject());
    se::Object *obj = v.toObject();
    assert(obj->isArray());

    bool     ok  = true;
    uint32_t len = 0;
    ok           = obj->getArrayLength(&len);
    if (!ok) {
        ret->clear();
        return false;
    }

    se::Value tmp;
    for (uint32_t i = 0; i < len; ++i) {
        ok = obj->getArrayElement(i, &tmp);
        if (!ok || !tmp.isObject()) {
            ret->clear();
            return false;
        }

        const char *str = tmp.toString().c_str();
        ret->add(str);
    }

    return true;
}

template <>
bool nativevalue_to_se(const spine::String &obj, se::Value &val, se::Object * /*unused*/) {
    val.setString(obj.buffer());
    return true;
}

template <>
bool nativevalue_to_se(const spine::Vector<spine::String> &v, se::Value &ret, se::Object * /*unused*/) {
    se::HandleObject obj(se::Object::createArrayObject(v.size()));
    bool             ok = true;

    spine::Vector<spine::String> tmpv = v;
    for (uint32_t i = 0, count = static_cast<uint32_t>(tmpv.size()); i < count; i++) {
        if (!obj->setArrayElement(i, se::Value(tmpv[i].buffer()))) {
            ok = false;
            ret.setUndefined();
            break;
        }
    }

    if (ok) {
        ret.setObject(obj);
    }

    return ok;
}

template <>
bool seval_to_Map_string_key(const se::Value &v, cc::Map<std::string, cc::middleware::Texture2D *> *ret) {
    assert(ret != nullptr);
    assert(v.isObject());
    se::Object *obj = v.toObject();

    std::vector<std::string> allKeys;
    bool                     ok = obj->getAllKeys(&allKeys);
    if (!ok) {
        ret->clear();
        return false;
    }

    se::Value tmp;
    for (const auto &key : allKeys) {
        auto pngPos = key.find(".png");
        if (pngPos == std::string::npos) {
            continue;
        }

        ok = obj->getProperty(key.c_str(), &tmp);
        if (!ok || !tmp.isObject()) {
            ret->clear();
            return false;
        }

        auto *nativeObj = static_cast<cc::middleware::Texture2D *>(tmp.toObject()->getPrivateData());
        ret->insert(key, nativeObj);
    }

    return true;
}

#endif
