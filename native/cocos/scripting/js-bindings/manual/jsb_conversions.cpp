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

#include "jsb_conversions.hpp"
#include <sstream>
#include <regex>

// seval to native

bool seval_to_int32(const se::Value& v, int32_t* ret)
{
    assert(ret != nullptr);
    if (v.isNumber())
    {
        *ret = v.toInt32();
        return true;
    }
    else if (v.isBoolean())
    {
        *ret = v.toBoolean() ? 1 : 0;
        return true;
    }
    *ret = 0;
    return false;
}

bool seval_to_uint32(const se::Value& v, uint32_t* ret)
{
    assert(ret != nullptr);
    if (v.isNumber())
    {
        *ret = v.toUint32();
        return true;
    }
    else if (v.isBoolean())
    {
        *ret = v.toBoolean() ? 1 : 0;
        return true;
    }
    *ret = 0;
    return false;
}

bool seval_to_int8(const se::Value& v, int8_t* ret)
{
    assert(ret != nullptr);
    if (v.isNumber())
    {
        *ret = v.toInt8();
        return true;
    }
    else if (v.isBoolean())
    {
        *ret = v.toBoolean() ? 1 : 0;
        return true;
    }
    *ret = 0;
    return false;
}

bool seval_to_uint8(const se::Value& v, uint8_t* ret)
{
    assert(ret != nullptr);
    if (v.isNumber())
    {
        *ret = v.toUint8();
        return true;
    }
    else if (v.isBoolean())
    {
        *ret = v.toBoolean() ? 1 : 0;
        return true;
    }
    *ret = 0;
    return false;
}

bool seval_to_int16(const se::Value& v, int16_t* ret)
{
    assert(ret != nullptr);
    if (v.isNumber())
    {
        *ret = v.toInt16();
        return true;
    }
    else if (v.isBoolean())
    {
        *ret = v.toBoolean() ? 1 : 0;
        return true;
    }
    *ret = 0;
    return false;
}

bool seval_to_uint16(const se::Value& v, uint16_t* ret)
{
    assert(ret != nullptr);
    if (v.isNumber())
    {
        *ret = v.toUint16();
        return true;
    }
    else if (v.isBoolean())
    {
        *ret = v.toBoolean() ? 1 : 0;
        return true;
    }
    *ret = 0;
    return false;
}

bool seval_to_boolean(const se::Value& v, bool* ret)
{
    assert(ret != nullptr);
    if (v.isBoolean())
    {
        *ret = v.toBoolean();
    }
    else if (v.isNumber())
    {
        *ret = v.toInt32() != 0 ? true : false;
    }
    else if (v.isNullOrUndefined())
    {
        *ret = false;
    }
    else if (v.isObject())
    {
        *ret = true;
    }
    else if (v.isString())
    {
        *ret = v.toString().empty() ? false : true;
    }
    else
    {
        *ret = false;
        assert(false);
    }

    return true;
}

bool seval_to_float(const se::Value& v, float* ret)
{
    assert(ret != nullptr);
    if (v.isNumber())
    {
        *ret = v.toFloat();
        if (!std::isnan(*ret))
            return true;
    }
    *ret = 0.0f;
    return false;
}

bool seval_to_double(const se::Value& v, double* ret)
{
    if (v.isNumber())
    {
        *ret = v.toNumber();
        if (!std::isnan(*ret))
            return true;
    }
    *ret = 0.0;
    return false;
}

bool seval_to_long(const se::Value& v, long* ret)
{
    assert(ret != nullptr);
    if (v.isNumber())
    {
        *ret = v.toLong();
        return true;
    }
    *ret = 0L;
    return false;
}

bool seval_to_ulong(const se::Value& v, unsigned long* ret)
{
    assert(ret != nullptr);
    if (v.isNumber())
    {
        *ret = v.toUlong();
        return true;
    }
    *ret = 0UL;
    return false;
}

bool seval_to_longlong(const se::Value& v, long long* ret)
{
    assert(ret != nullptr);
    if (v.isNumber())
    {
        *ret = (long long)v.toLong();
        return true;
    }
    *ret = 0LL;
    return false;
}

bool seval_to_ssize(const se::Value& v, ssize_t* ret)
{
    assert(ret != nullptr);
    if (v.isNumber())
    {
        *ret = (ssize_t)v.toLong();
        return true;
    }
    *ret = 0;
    return false;
}

bool seval_to_size(const se::Value& v, size_t* ret)
{
    assert(ret != nullptr);
    if (v.isNumber())
    {
        *ret = (size_t)v.toLong();
        return true;
    }
    *ret = 0;
    return false;
}

bool seval_to_std_string(const se::Value& v, std::string* ret)
{
    assert(ret != nullptr);
    *ret = v.toStringForce();
    return true;
}

bool seval_to_Vec2(const se::Value& v, cocos2d::Vec2* pt)
{
    assert(pt != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Vec2 failed!");
    se::Object* obj = v.toObject();
    se::Value x;
    se::Value y;
    bool ok = obj->getProperty("x", &x);
    SE_PRECONDITION3(ok && x.isNumber(), false, *pt = cocos2d::Vec2::ZERO);
    ok = obj->getProperty("y", &y);
    SE_PRECONDITION3(ok && y.isNumber(), false, *pt = cocos2d::Vec2::ZERO);
    pt->x = x.toFloat();
    pt->y = y.toFloat();
    return true;
}

bool seval_to_Vec3(const se::Value& v, cocos2d::Vec3* pt)
{
    assert(pt != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Vec3 failed!");
    se::Object* obj = v.toObject();
    se::Value x;
    se::Value y;
    se::Value z;
    bool ok = obj->getProperty("x", &x);
    SE_PRECONDITION3(ok && x.isNumber(), false, *pt = cocos2d::Vec3::ZERO);
    ok = obj->getProperty("y", &y);
    SE_PRECONDITION3(ok && y.isNumber(), false, *pt = cocos2d::Vec3::ZERO);
    ok = obj->getProperty("z", &z);
    SE_PRECONDITION3(ok && z.isNumber(), false, *pt = cocos2d::Vec3::ZERO);
    pt->x = x.toFloat();
    pt->y = y.toFloat();
    pt->z = z.toFloat();
    return true;
}

bool seval_to_Vec4(const se::Value& v, cocos2d::Vec4* pt)
{
    assert(pt != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Vec4 failed!");
    pt->x = pt->y = pt->z = pt->w = 0.0f;
    se::Object* obj = v.toObject();
    se::Value x;
    se::Value y;
    se::Value z;
    se::Value w;
    bool ok = obj->getProperty("x", &x);
    SE_PRECONDITION3(ok && x.isNumber(), false, *pt = cocos2d::Vec4::ZERO);
    ok = obj->getProperty("y", &y);
    SE_PRECONDITION3(ok && y.isNumber(), false, *pt = cocos2d::Vec4::ZERO);
    ok = obj->getProperty("z", &z);
    SE_PRECONDITION3(ok && z.isNumber(), false, *pt = cocos2d::Vec4::ZERO);
    ok = obj->getProperty("w", &w);
    SE_PRECONDITION3(ok && w.isNumber(), false, *pt = cocos2d::Vec4::ZERO);
    pt->x = x.toFloat();
    pt->y = y.toFloat();
    pt->z = z.toFloat();
    pt->w = w.toFloat();
    return true;
}

bool seval_to_mat(const se::Value& v, int length, float* out)
{
    assert(out != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Matrix failed!");
    se::Object* obj = v.toObject();
    
    se::Value tmp;
    char propName[3] = {0};
    for (int i = 0; i < length; ++i)
    {
        snprintf(propName, 3, "m%2d", i);
        obj->getProperty(propName, &tmp);
        *(out + i) = tmp.toFloat();
    }

    return true;
}

bool seval_to_Mat4(const se::Value& v, cocos2d::Mat4* mat)
{
    assert(mat != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Matrix4 failed!");
    se::Object* obj = v.toObject();

    if (obj->isTypedArray())
    {
        // typed array
        SE_PRECONDITION2(obj->isTypedArray(), false, "Convert parameter to Matrix4 failed!");
        
        size_t length = 0;
        uint8_t* ptr = nullptr;
        obj->getTypedArrayData(&ptr, &length);
        
        memcpy(mat->m, ptr, length);
    }
    else {
        bool ok = false;
        se::Value tmp;
        std::string prefix = "m";
        for (uint32_t i = 0; i < 16; ++i)
        {
            std::string name;
            if (i < 10)
            {
                name = prefix + "0" + std::to_string(i);
            }
            else
            {
                name = prefix + std::to_string(i);
            }
            ok = obj->getProperty(name.c_str(), &tmp);
            SE_PRECONDITION3(ok, false, *mat = cocos2d::Mat4::IDENTITY);

            if (tmp.isNumber())
            {
                mat->m[i] = tmp.toFloat();
            }
            else
            {
                SE_REPORT_ERROR("%u, not supported type in matrix", i);
                *mat = cocos2d::Mat4::IDENTITY;
                return false;
            }

            tmp.setUndefined();
        }
    }

    return true;
}

bool seval_to_Size(const se::Value& v, cocos2d::Size* size)
{
    assert(size != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Size failed!");
    se::Object* obj = v.toObject();
    se::Value width;
    se::Value height;

    bool ok = obj->getProperty("width", &width);
    SE_PRECONDITION3(ok && width.isNumber(), false, *size = cocos2d::Size::ZERO);
    ok = obj->getProperty("height", &height);
    SE_PRECONDITION3(ok && height.isNumber(), false, *size = cocos2d::Size::ZERO);
    size->width = width.toFloat();
    size->height = height.toFloat();
    return true;
}

//bool seval_to_Rect(const se::Value& v, cocos2d::Rect* rect)
//{
//    assert(rect != nullptr);
//    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Rect failed!");
//    se::Object* obj = v.toObject();
//    se::Value x;
//    se::Value y;
//    se::Value width;
//    se::Value height;
//
//    bool ok = obj->getProperty("x", &x);
//    SE_PRECONDITION3(ok && x.isNumber(), false, *rect = cocos2d::Rect::ZERO);
//    ok = obj->getProperty("y", &y);
//    SE_PRECONDITION3(ok && y.isNumber(), false, *rect = cocos2d::Rect::ZERO);
//    ok = obj->getProperty("width", &width);
//    SE_PRECONDITION3(ok && width.isNumber(), false, *rect = cocos2d::Rect::ZERO);
//    ok = obj->getProperty("height", &height);
//    SE_PRECONDITION3(ok && height.isNumber(), false, *rect = cocos2d::Rect::ZERO);
//    rect->origin.x = x.toFloat();
//    rect->origin.y = y.toFloat();
//    rect->size.width = width.toFloat();
//    rect->size.height = height.toFloat();
//
//    return true;
//}

bool seval_to_Color3B(const se::Value& v, cocos2d::Color3B* color)
{
    assert(color != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Color3B failed!");
    se::Object* obj = v.toObject();
    se::Value r;
    se::Value g;
    se::Value b;
    bool ok = obj->getProperty("r", &r);
    SE_PRECONDITION3(ok && r.isNumber(), false, *color = cocos2d::Color3B::BLACK);
    ok = obj->getProperty("g", &g);
    SE_PRECONDITION3(ok && g.isNumber(), false, *color = cocos2d::Color3B::BLACK);
    ok = obj->getProperty("b", &b);
    SE_PRECONDITION3(ok && b.isNumber(), false, *color = cocos2d::Color3B::BLACK);
    color->r = (GLubyte)r.toUint16();
    color->g = (GLubyte)g.toUint16();
    color->b = (GLubyte)b.toUint16();
    return true;
}

bool seval_to_Color4B(const se::Value& v, cocos2d::Color4B* color)
{
    assert(color != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Color4B failed!");
    se::Object* obj = v.toObject();
    se::Value r;
    se::Value g;
    se::Value b;
    se::Value a;
    bool ok = obj->getProperty("r", &r);
    SE_PRECONDITION3(ok && r.isNumber(), false, *color = cocos2d::Color4B::BLACK);
    ok = obj->getProperty("g", &g);
    SE_PRECONDITION3(ok && g.isNumber(), false, *color = cocos2d::Color4B::BLACK);
    ok = obj->getProperty("b", &b);
    SE_PRECONDITION3(ok && b.isNumber(), false, *color = cocos2d::Color4B::BLACK);
    ok = obj->getProperty("a", &a);
    SE_PRECONDITION3(ok && b.isNumber(), false, *color = cocos2d::Color4B::BLACK);
    color->r = (GLubyte)r.toUint16();
    color->g = (GLubyte)g.toUint16();
    color->b = (GLubyte)b.toUint16();
    color->a = (GLubyte)a.toUint16();
    return true;
}

bool seval_to_Color4F(const se::Value& v, cocos2d::Color4F* color)
{
    assert(color != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Color4F failed!");
    se::Object* obj = v.toObject();
    se::Value r;
    se::Value g;
    se::Value b;
    se::Value a;
    bool ok = obj->getProperty("r", &r);
    SE_PRECONDITION3(ok && r.isNumber(), false, *color = cocos2d::Color4F::BLACK);
    ok = obj->getProperty("g", &g);
    SE_PRECONDITION3(ok && g.isNumber(), false, *color = cocos2d::Color4F::BLACK);
    ok = obj->getProperty("b", &b);
    SE_PRECONDITION3(ok && b.isNumber(), false, *color = cocos2d::Color4F::BLACK);
    ok = obj->getProperty("a", &a);
    SE_PRECONDITION3(ok && b.isNumber(), false, *color = cocos2d::Color4F::BLACK);
    color->r = r.toFloat();
    color->g = g.toFloat();
    color->b = b.toFloat();
    color->a = a.toFloat();
    return true;
}

bool seval_to_Color3F(const se::Value& v, cocos2d::Color3F* color)
{
    assert(color != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Color3F failed!");
    se::Object* obj = v.toObject();
    se::Value r;
    se::Value g;
    se::Value b;
    bool ok = obj->getProperty("r", &r);
    SE_PRECONDITION3(ok && r.isNumber(), false, *color = cocos2d::Color3F::BLACK);
    ok = obj->getProperty("g", &g);
    SE_PRECONDITION3(ok && g.isNumber(), false, *color = cocos2d::Color3F::BLACK);
    ok = obj->getProperty("b", &b);
    SE_PRECONDITION3(ok && b.isNumber(), false, *color = cocos2d::Color3F::BLACK);
    color->r = r.toFloat();
    color->g = g.toFloat();
    color->b = b.toFloat();
    return true;
}

bool seval_to_ccvalue(const se::Value& v, cocos2d::Value* ret)
{
    assert(ret != nullptr);
    bool ok = true;
    if (v.isObject())
    {
        se::Object* jsobj = v.toObject();
        if (!jsobj->isArray())
        {
            // It's a normal js object.
            cocos2d::ValueMap dictVal;
            ok = seval_to_ccvaluemap(v, &dictVal);
            SE_PRECONDITION3(ok, false, *ret = cocos2d::Value::Null);
            *ret = cocos2d::Value(dictVal);
        }
        else
        {
            // It's a js array object.
            cocos2d::ValueVector arrVal;
            ok = seval_to_ccvaluevector(v, &arrVal);
            SE_PRECONDITION3(ok, false, *ret = cocos2d::Value::Null);
            *ret = cocos2d::Value(arrVal);
        }
    }
    else if (v.isString())
    {
        *ret = v.toString();
    }
    else if (v.isNumber())
    {
        *ret = v.toNumber();
    }
    else if (v.isBoolean())
    {
        *ret = v.toBoolean();
    }
    else if (v.isNullOrUndefined())
    {
        *ret = cocos2d::Value::Null;
    }
    else
    {
        SE_PRECONDITION2(false, false, "type not supported!");
    }

    return ok;
}

bool seval_to_ccvaluemap(const se::Value& v, cocos2d::ValueMap* ret)
{
    assert(ret != nullptr);

    if (v.isNullOrUndefined())
    {
        ret->clear();
        return true;
    }

    SE_PRECONDITION3(v.isObject(), false, ret->clear());
    SE_PRECONDITION3(!v.isNullOrUndefined(), false, ret->clear());

    se::Object* obj = v.toObject();

    cocos2d::ValueMap& dict = *ret;

    std::vector<std::string> allKeys;
    SE_PRECONDITION3(obj->getAllKeys(&allKeys), false, ret->clear());

    bool ok = false;
    se::Value value;
    cocos2d::Value ccvalue;
    for (const auto& key : allKeys)
    {
        SE_PRECONDITION3(obj->getProperty(key.c_str(), &value), false, ret->clear());
        ok = seval_to_ccvalue(value, &ccvalue);
        SE_PRECONDITION3(ok, false, ret->clear());
        dict.emplace(key, ccvalue);
    }

    return true;
}

static bool isNumberString(const std::string& str)
{
    for (const auto& c : str)
    {
        if (!isdigit(c))
            return false;
    }
    return true;
}

bool seval_to_ccvaluemapintkey(const se::Value& v, cocos2d::ValueMapIntKey* ret)
{
    assert(ret != nullptr);
    if (v.isNullOrUndefined())
    {
        ret->clear();
        return true;
    }

    SE_PRECONDITION3(v.isObject(), false, ret->clear());
    SE_PRECONDITION3(!v.isNullOrUndefined(), false, ret->clear());

    se::Object* obj = v.toObject();

    cocos2d::ValueMapIntKey& dict = *ret;

    std::vector<std::string> allKeys;
    SE_PRECONDITION3(obj->getAllKeys(&allKeys), false, ret->clear());

    bool ok = false;
    se::Value value;
    cocos2d::Value ccvalue;
    for (const auto& key : allKeys)
    {
        SE_PRECONDITION3(obj->getProperty(key.c_str(), &value), false, ret->clear());

        if (!isNumberString(key))
        {
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

bool seval_to_ccvaluevector(const se::Value& v,  cocos2d::ValueVector* ret)
{
    assert(ret != nullptr);

    SE_PRECONDITION3(v.isObject(), false, ret->clear());

    se::Object* obj = v.toObject();
    SE_PRECONDITION3(obj->isArray(), false, ret->clear());

    uint32_t len = 0;
    obj->getArrayLength(&len);

    bool ok = false;
    se::Value value;
    cocos2d::Value ccvalue;
    for (uint32_t i = 0; i < len; ++i)
    {
        if (obj->getArrayElement(i, &value))
        {
            ok = seval_to_ccvalue(value, &ccvalue);
            SE_PRECONDITION3(ok, false, ret->clear());
            ret->push_back(ccvalue);
        }
    }
    
    return true;
}

bool sevals_variadic_to_ccvaluevector(const se::ValueArray& args, cocos2d::ValueVector* ret)
{
    bool ok = false;
    cocos2d::Value ccvalue;

    for (const auto& arg : args)
    {
        ok = seval_to_ccvalue(arg, &ccvalue);
        SE_PRECONDITION3(ok, false, ret->clear());
        ret->push_back(ccvalue);
    }

    return true;
}

bool seval_to_blendfunc(const se::Value& v, cocos2d::BlendFunc* ret)
{
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to BlendFunc failed!");
    se::Object* obj = v.toObject();
    se::Value value;
    bool ok = false;

    ok = obj->getProperty("src", &value);
    SE_PRECONDITION3(ok, false, *ret = cocos2d::BlendFunc::DISABLE);
    ret->src = value.toUint32();
    ok = obj->getProperty("dst", &value);
    SE_PRECONDITION3(ok, false, *ret = cocos2d::BlendFunc::DISABLE);

    ret->dst = value.toUint32();
    return true;
}

bool seval_to_std_vector_string(const se::Value& v, std::vector<std::string>* ret)
{
    assert(ret != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to vector of String failed!");
    se::Object* obj = v.toObject();
    SE_PRECONDITION2(obj->isArray(), false, "Convert parameter to vector of String failed!");
    uint32_t len = 0;
    if (obj->getArrayLength(&len))
    {
        se::Value value;
        for (uint32_t i = 0; i < len; ++i)
        {
            SE_PRECONDITION3(obj->getArrayElement(i, &value) && value.isString(), false, ret->clear());
            ret->push_back(value.toString());
        }
        return true;
    }

    ret->clear();
    return true;
}

bool seval_to_std_vector_int(const se::Value& v, std::vector<int>* ret)
{
    assert(ret != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to vector of int failed!");
    se::Object* obj = v.toObject();

    if (obj->isArray())
    {
        uint32_t len = 0;
        if (obj->getArrayLength(&len))
        {
            se::Value value;
            for (uint32_t i = 0; i < len; ++i)
            {
                SE_PRECONDITION3(obj->getArrayElement(i, &value) && value.isNumber(), false, ret->clear());
                ret->push_back(value.toInt32());
            }
            return true;
        }
    }
    else if (obj->isTypedArray())
    {
        size_t bytesPerElements = 0;
        uint8_t* data = nullptr;
        size_t dataBytes = 0;
        se::Object::TypedArrayType type = obj->getTypedArrayType();

#define SE_UINT8_PTR_TO_INT(ptr)  (*((uint8_t*)(ptr)))
#define SE_UINT16_PTR_TO_INT(ptr) (*((uint16_t*)(ptr)))
#define SE_UINT32_PTR_TO_INT(ptr) (*((uint32_t*)(ptr)))

        if (obj->getTypedArrayData(&data, &dataBytes))
        {
            for (size_t i = 0; i < dataBytes; i += bytesPerElements)
            {
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
    }
    else
    {
        assert(false);
    }

    ret->clear();
    return true;
}

bool seval_to_std_vector_uint16(const se::Value& v, std::vector<uint16_t>* ret)
{
    assert(ret != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to vector of uint16 failed!");
    se::Object* obj = v.toObject();
    
    if (obj->isArray())
    {
        uint32_t len = 0;
        if (obj->getArrayLength(&len))
        {
            se::Value value;
            for (uint32_t i = 0; i < len; ++i)
            {
                SE_PRECONDITION3(obj->getArrayElement(i, &value) && value.isNumber(), false, ret->clear());
                ret->push_back(value.toUint16());
            }
            return true;
        }
    }
    else if (obj->isTypedArray())
    {
        size_t bytesPerElements = 0;
        uint8_t* data = nullptr;
        size_t dataBytes = 0;
        se::Object::TypedArrayType type = obj->getTypedArrayType();
        
        if (obj->getTypedArrayData(&data, &dataBytes))
        {
            for (size_t i = 0; i < dataBytes; i += bytesPerElements)
            {
                switch (type) {
                    case se::Object::TypedArrayType::INT16:
                    case se::Object::TypedArrayType::UINT16:
                        ret->push_back(*((uint16_t*)(data + i)));
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
    }
    else
    {
        assert(false);
    }
    ret->clear();
    return true;
}

bool seval_to_std_vector_float(const se::Value& v, std::vector<float>* ret)
{
    assert(ret != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to vector of float failed!");
    se::Object* obj = v.toObject();
    SE_PRECONDITION2(obj->isArray(), false, "Convert parameter to vector of float failed!");
    uint32_t len = 0;
    if (obj->getArrayLength(&len))
    {
        se::Value value;
        for (uint32_t i = 0; i < len; ++i)
        {
            SE_PRECONDITION3(obj->getArrayElement(i, &value) && value.isNumber(), false, ret->clear());
            ret->push_back(value.toFloat());
        }
        return true;
    }

    ret->clear();
    return true;
}

bool seval_to_std_vector_Vec2(const se::Value& v, std::vector<cocos2d::Vec2>* ret)
{
    assert(ret != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to vector of Vec2 failed!");
    se::Object* obj = v.toObject();
    SE_PRECONDITION2(obj->isArray(), false, "Convert parameter to vector of Vec2 failed!");
    uint32_t len = 0;
    if (obj->getArrayLength(&len))
    {
        se::Value value;
        cocos2d::Vec2 pt;
        for (uint32_t i = 0; i < len; ++i)
        {
            SE_PRECONDITION3(obj->getArrayElement(i, &value) && seval_to_Vec2(value, &pt), false, ret->clear());
            ret->push_back(pt);
        }
        return true;
    }

    ret->clear();
    return true;
}

//bool seval_to_std_vector_Touch(const se::Value& v, std::vector<cocos2d::Touch*>* ret)
//{
//    assert(ret != nullptr);
//    assert(v.isObject());
//    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to vector of Touch failed!");
//    se::Object* obj = v.toObject();
//    assert(obj->isArray());
//    SE_PRECONDITION2(obj->isArray(), false, "Convert parameter to vector of Touch failed!");
//    uint32_t len = 0;
//    if (obj->getArrayLength(&len))
//    {
//        se::Value value;
//        cocos2d::Touch* touch = nullptr;
//        for (uint32_t i = 0; i < len; ++i)
//        {
//            SE_PRECONDITION3(obj->getArrayElement(i, &value), false, ret->clear());
//            assert(value.isObject());
//            touch = (cocos2d::Touch*)value.toObject()->getPrivateData();
//            ret->push_back(touch);
//        }
//        return true;
//    }
//
//    ret->clear();
//    return false;
//}

bool seval_to_std_map_string_string(const se::Value& v, std::map<std::string, std::string>* ret)
{
    assert(ret != nullptr);

    if (v.isNullOrUndefined())
    {
        ret->clear();
        return true;
    }

    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to map of String to String failed!");
    SE_PRECONDITION3(!v.isNullOrUndefined(), false, ret->clear());

    se::Object* obj = v.toObject();

    std::vector<std::string> allKeys;
    SE_PRECONDITION3(obj->getAllKeys(&allKeys), false, ret->clear());

    bool ok = false;
    se::Value value;
    std::string strValue;
    for (const auto& key : allKeys)
    {
        SE_PRECONDITION3(obj->getProperty(key.c_str(), &value), false, ret->clear());
        ok = seval_to_std_string(value, &strValue);
        SE_PRECONDITION3(ok, false, ret->clear());
        ret->emplace(key, strValue);
    }
    
    return true;
}

//
//bool seval_to_Quaternion(const se::Value& v, cocos2d::Quaternion* ret)
//{
//    assert(ret != nullptr);
//    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Quaternion failed!");
//    se::Object* obj = v.toObject();
//    bool ok = false;
//    se::Value tmp;
//
//    ok = obj->getProperty("x", &tmp);
//    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = cocos2d::Quaternion::ZERO);
//    ret->x = tmp.toFloat();
//
//    ok = obj->getProperty("y", &tmp);
//    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = cocos2d::Quaternion::ZERO);
//    ret->y = tmp.toFloat();
//
//    ok = obj->getProperty("z", &tmp);
//    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = cocos2d::Quaternion::ZERO);
//    ret->z = tmp.toFloat();
//
//    ok = obj->getProperty("w", &tmp);
//    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = cocos2d::Quaternion::ZERO);
//    ret->w = tmp.toFloat();
//
//    return true;
//}
//
//bool seval_to_AffineTransform(const se::Value& v, cocos2d::AffineTransform* ret)
//{
//    static cocos2d::AffineTransform ZERO = {0, 0, 0, 0, 0, 0};
//
//    assert(ret != nullptr);
//    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to AffineTransform failed!");
//    se::Value tmp;
//    se::Object* obj = v.toObject();
//    bool ok = false;
//
//    ok = obj->getProperty("a", &tmp);
//    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
//    ret->a = tmp.toFloat();
//
//    ok = obj->getProperty("b", &tmp);
//    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
//    ret->b = tmp.toFloat();
//
//    ok = obj->getProperty("c", &tmp);
//    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
//    ret->c = tmp.toFloat();
//
//    ok = obj->getProperty("d", &tmp);
//    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
//    ret->d = tmp.toFloat();
//
//    ok = obj->getProperty("tx", &tmp);
//    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
//    ret->tx = tmp.toFloat();
//
//    ok = obj->getProperty("ty", &tmp);
//    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
//    ret->ty = tmp.toFloat();
//
//    return true;
//}

//bool seval_to_Viewport(const se::Value& v, cocos2d::experimental::Viewport* ret)
//{
//    static cocos2d::experimental::Viewport ZERO = {0, 0, 0, 0};
//
//    assert(ret != nullptr);
//    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to Viewport failed!");
//    se::Value tmp;
//    se::Object* obj = v.toObject();
//    bool ok = false;
//
//    ok = obj->getProperty("left", &tmp);
//    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
//    ret->_left = tmp.toFloat();
//
//    ok = obj->getProperty("bottom", &tmp);
//    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
//    ret->_bottom = tmp.toFloat();
//
//    ok = obj->getProperty("width", &tmp);
//    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
//    ret->_width = tmp.toFloat();
//
//    ok = obj->getProperty("height", &tmp);
//    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
//    ret->_height = tmp.toFloat();
//
//    return true;
//}

bool seval_to_Data(const se::Value& v, cocos2d::Data* ret)
{
    assert(ret != nullptr);
    SE_PRECONDITION2(v.isObject() && v.toObject()->isTypedArray(), false, "Convert parameter to Data failed!");
    uint8_t* ptr = nullptr;
    size_t length = 0;
    bool ok = v.toObject()->getTypedArrayData(&ptr, &length);
    if (ok)
    {
        ret->copy(ptr, length);
    }
    else
    {
        ret->clear();
    }

    return ok;
}

bool seval_to_DownloaderHints(const se::Value& v, cocos2d::network::DownloaderHints* ret)
{
    static cocos2d::network::DownloaderHints ZERO = {0, 0, ""};
    assert(ret != nullptr);
    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to DownloaderHints failed!");
    se::Value tmp;
    se::Object* obj = v.toObject();
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
//
//bool seval_to_TTFConfig(const se::Value& v, cocos2d::TTFConfig* ret)
//{
//    se::Value js_fontFilePath;
//    se::Value js_fontSize;
//    se::Value js_outlineSize;
//    se::Value js_glyphs;
//    se::Value js_customGlyphs;
//    se::Value js_distanceFieldEnable;
//
//    std::string fontFilePath,customGlyphs;
//
//    bool ok = v.isObject();
//    if (ok)
//    {
//        se::Object* obj = v.toObject();
//        if (obj->getProperty("fontFilePath", &js_fontFilePath) && js_fontFilePath.isString())
//        {
//            ok &= seval_to_std_string(js_fontFilePath, &ret->fontFilePath);
//        }
//
//        if (obj->getProperty("fontSize", &js_fontSize) && js_fontSize.isNumber())
//        {
//            ret->fontSize = (float)js_fontSize.toNumber();
//        }
//
//        if (obj->getProperty("outlineSize", &js_outlineSize) && js_outlineSize.isNumber())
//        {
//            ret->outlineSize = (int)js_outlineSize.toNumber();
//        }
//
//        if (obj->getProperty("glyphs", &js_glyphs) && js_glyphs.isNumber())
//        {
//            ret->glyphs = (cocos2d::GlyphCollection)(js_glyphs.toInt32());
//        }
//
//        if (obj->getProperty("customGlyphs", &js_customGlyphs) && js_customGlyphs.isString())
//        {
//            ok &= seval_to_std_string(js_customGlyphs,&customGlyphs);
//        }
//        if(ret->glyphs == cocos2d::GlyphCollection::CUSTOM && !customGlyphs.empty())
//            ret->customGlyphs = customGlyphs.c_str();
//        else
//            ret->customGlyphs = "";
//
//        if (obj->getProperty("distanceFieldEnable", &js_distanceFieldEnable) && js_distanceFieldEnable.isBoolean())
//        {
//            ret->distanceFieldEnabled = js_distanceFieldEnable.toBoolean();
//        }
//    }
//
//    SE_PRECONDITION2(ok, false, "Error processing arguments");
//
//    return true;
//}
//
//bool seval_to_b2Vec2(const se::Value& v, b2Vec2* ret)
//{
//    static b2Vec2 ZERO(0.0f, 0.0f);
//    assert(ret != nullptr);
//    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to b2Vec2 failed!");
//    se::Object* obj = v.toObject();
//    se::Value x;
//    se::Value y;
//    bool ok = obj->getProperty("x", &x);
//    SE_PRECONDITION3(ok && x.isNumber(), false, *ret = ZERO);
//    ok = obj->getProperty("y", &y);
//    SE_PRECONDITION3(ok && y.isNumber(), false, *ret = ZERO);
//    ret->x = x.toFloat();
//    ret->y = y.toFloat();
//    return true;
//}
//
//bool seval_to_b2AABB(const se::Value& v, b2AABB* ret)
//{
//    static b2AABB ZERO;
//    static bool __isFirst = true;
//    if (__isFirst)
//    {
//        ZERO.lowerBound.x = ZERO.lowerBound.y = 0;
//        ZERO.upperBound.x = ZERO.upperBound.y = 0;
//        __isFirst = false;
//    }
//
//    assert(ret != nullptr);
//    SE_PRECONDITION2(v.isObject(), false, "Convert parameter to b2AABB failed!");
//    se::Object* obj = v.toObject();
//
//    bool ok = false;
//    se::Value tmp;
//    ok = obj->getProperty("lowerBound", &tmp);
//    SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
//    ok = seval_to_b2Vec2(tmp, &ret->lowerBound);
//    SE_PRECONDITION3(ok, false, *ret = ZERO);
//
//    ok = obj->getProperty("upperBound", &tmp);
//    SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
//    ok = seval_to_b2Vec2(tmp, &ret->upperBound);
//    SE_PRECONDITION3(ok, false, *ret = ZERO);
//
//    return true;
//}

#if USE_GFX_RENDERER

#endif // USE_GFX_RENDERER > 0

//////////////////////////////////////////////////////////////////////////////////
// native to seval

bool int32_to_seval(int32_t v, se::Value* ret)
{
    ret->setInt32(v);
    return true;
}

bool uint32_to_seval(uint32_t v, se::Value* ret)
{
    ret->setUint32(v);
    return true;
}

bool int16_to_seval(uint16_t v, se::Value* ret)
{
    ret->setInt16(v);
    return true;
}

bool uint16_to_seval(uint16_t v, se::Value* ret)
{
    ret->setUint16(v);
    return true;
}

bool int8_to_seval(int8_t v, se::Value* ret)
{
    ret->setInt8(v);
    return true;
}

bool uint8_to_seval(uint8_t v, se::Value* ret)
{
    ret->setUint8(v);
    return true;
}

bool boolean_to_seval(bool v, se::Value* ret)
{
    ret->setBoolean(v);
    return true;
}

bool float_to_seval(float v, se::Value* ret)
{
    ret->setFloat(v);
    return true;
}

bool double_to_seval(double v, se::Value* ret)
{
    ret->setNumber(v);
    return true;
}

bool long_to_seval(long v, se::Value* ret)
{
    ret->setLong(v);
    return true;
}

bool ulong_to_seval(unsigned long v, se::Value* ret)
{
    ret->setUlong(v);
    return true;
}

bool longlong_to_seval(long long v, se::Value* ret)
{
    ret->setLong((long)v);
    return true;
}

bool ssize_to_seval(ssize_t v, se::Value* ret)
{
    ret->setLong((long)v);
    return true;
}

bool size_to_seval(size_t v, se::Value* ret)
{
    ret->setLong((unsigned long)v);
    return true;
}

bool std_string_to_seval(const std::string& v, se::Value* ret)
{
    ret->setString(v);
    return true;
}

bool Vec2_to_seval(const cocos2d::Vec2& v, se::Value* ret)
{
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("x", se::Value(v.x));
    obj->setProperty("y", se::Value(v.y));
    ret->setObject(obj);

    return true;
}

bool Vec3_to_seval(const cocos2d::Vec3& v, se::Value* ret)
{
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("x", se::Value(v.x));
    obj->setProperty("y", se::Value(v.y));
    obj->setProperty("z", se::Value(v.z));
    ret->setObject(obj);

    return true;
}

bool Vec4_to_seval(const cocos2d::Vec4& v, se::Value* ret)
{
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("x", se::Value(v.x));
    obj->setProperty("y", se::Value(v.y));
    obj->setProperty("z", se::Value(v.z));
    obj->setProperty("w", se::Value(v.w));
    ret->setObject(obj);

    return true;
}

bool Mat4_to_seval(const cocos2d::Mat4& v, se::Value* ret)
{
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createArrayObject(16));

    for (uint8_t i = 0; i < 16; ++i)
    {
        obj->setArrayElement(i, se::Value(v.m[i]));
    }

    ret->setObject(obj);
    return true;
}

bool Size_to_seval(const cocos2d::Size& v, se::Value* ret)
{
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("width", se::Value(v.width));
    obj->setProperty("height", se::Value(v.height));
    ret->setObject(obj);
    return true;
}

bool Rect_to_seval(const cocos2d::Rect& v, se::Value* ret)
{
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("x", se::Value(v.origin.x));
    obj->setProperty("y", se::Value(v.origin.y));
    obj->setProperty("width", se::Value(v.size.width));
    obj->setProperty("height", se::Value(v.size.height));
    ret->setObject(obj);

    return true;
}

bool Color3B_to_seval(const cocos2d::Color3B& v, se::Value* ret)
{
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("r", se::Value(v.r));
    obj->setProperty("g", se::Value(v.g));
    obj->setProperty("b", se::Value(v.b));
    obj->setProperty("a", se::Value(255));
    ret->setObject(obj);

    return true;
}

bool Color4B_to_seval(const cocos2d::Color4B& v, se::Value* ret)
{
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("r", se::Value(v.r));
    obj->setProperty("g", se::Value(v.g));
    obj->setProperty("b", se::Value(v.b));
    obj->setProperty("a", se::Value(v.a));
    ret->setObject(obj);

    return true;
}

bool Color4F_to_seval(const cocos2d::Color4F& v, se::Value* ret)
{
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("r", se::Value(v.r));
    obj->setProperty("g", se::Value(v.g));
    obj->setProperty("b", se::Value(v.b));
    obj->setProperty("a", se::Value(v.a));
    ret->setObject(obj);

    return true;
}

bool Color3F_to_seval(const cocos2d::Color3F& v, se::Value* ret)
{
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("r", se::Value(v.r));
    obj->setProperty("g", se::Value(v.g));
    obj->setProperty("b", se::Value(v.b));
    ret->setObject(obj);
    return true;
}

bool ccvalue_to_seval(const cocos2d::Value& v, se::Value* ret)
{
    assert(ret != nullptr);
    bool ok = true;
    switch (v.getType())
    {
        case cocos2d::Value::Type::NONE:
            ret->setNull();
            break;
        case cocos2d::Value::Type::UNSIGNED:
            ret->setUint32(v.asUnsignedInt());
            break;
        case cocos2d::Value::Type::BOOLEAN:
            ret->setBoolean(v.asBool());
            break;
        case cocos2d::Value::Type::FLOAT:
        case cocos2d::Value::Type::DOUBLE:
            ret->setNumber(v.asDouble());
            break;
        case cocos2d::Value::Type::INTEGER:
            ret->setInt32(v.asInt());
            break;
        case cocos2d::Value::Type::STRING:
            ret->setString(v.asString());
            break;
        case cocos2d::Value::Type::VECTOR:
            ok = ccvaluevector_to_seval(v.asValueVector(), ret);
            break;
        case cocos2d::Value::Type::MAP:
            ok = ccvaluemap_to_seval(v.asValueMap(), ret);
            break;
        case cocos2d::Value::Type::INT_KEY_MAP:
            ok = ccvaluemapintkey_to_seval(v.asIntKeyMap(), ret);
            break;
        default:
            SE_LOGE("Could not the way to convert cocos2d::Value::Type (%d) type!", (int)v.getType());
            ok = false;
            break;
    }

    return ok;
}

bool ccvaluemap_to_seval(const cocos2d::ValueMap& v, se::Value* ret)
{
    assert(ret != nullptr);

    se::HandleObject obj(se::Object::createPlainObject());
    bool ok = true;
    for (const auto& e : v)
    {
        const std::string& key = e.first;
        const cocos2d::Value& value = e.second;

        if (key.empty())
            continue;

        se::Value tmp;
        if (!ccvalue_to_seval(value, &tmp))
        {
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

bool ccvaluemapintkey_to_seval(const cocos2d::ValueMapIntKey& v, se::Value* ret)
{
    assert(ret != nullptr);

    se::HandleObject obj(se::Object::createPlainObject());
    bool ok = true;
    for (const auto& e : v)
    {
        std::stringstream keyss;
        keyss << e.first;
        std::string key = keyss.str();
        const cocos2d::Value& value = e.second;

        if (key.empty())
            continue;

        se::Value tmp;
        if (!ccvalue_to_seval(value, &tmp))
        {
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

bool ccvaluevector_to_seval(const cocos2d::ValueVector& v, se::Value* ret)
{
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createArrayObject(v.size()));
    bool ok = true;

    uint32_t i = 0;
    for (const auto& value : v)
    {
        se::Value tmp;
        if (!ccvalue_to_seval(value, &tmp))
        {
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

bool blendfunc_to_seval(const cocos2d::BlendFunc& v, se::Value* ret)
{
    assert(ret != nullptr);
    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("src", se::Value(v.src));
    obj->setProperty("dst", se::Value(v.dst));
    ret->setObject(obj);

    return true;
}

namespace {

    template<typename T>
    bool std_vector_T_to_seval(const std::vector<T>& v, se::Value* ret)
    {
        assert(ret != nullptr);
        se::HandleObject obj(se::Object::createArrayObject(v.size()));
        bool ok = true;

        uint32_t i = 0;
        for (const auto& value : v)
        {
            if (!obj->setArrayElement(i, se::Value(value)))
            {
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

}

bool std_vector_string_to_seval(const std::vector<std::string>& v, se::Value* ret)
{
    return std_vector_T_to_seval(v, ret);
}

bool std_vector_int_to_seval(const std::vector<int>& v, se::Value* ret)
{
    return std_vector_T_to_seval(v, ret);
}

bool std_vector_uint16_to_seval(const std::vector<uint16_t>& v, se::Value* ret)
{
    return std_vector_T_to_seval(v, ret);
}

bool std_vector_float_to_seval(const std::vector<float>& v, se::Value* ret)
{
    return std_vector_T_to_seval(v, ret);
}

//bool std_vector_Touch_to_seval(const std::vector<cocos2d::Touch*>& v, se::Value* ret)
//{
//    assert(ret != nullptr);
//    se::HandleObject arr(se::Object::createArrayObject(v.size()));
//
//    uint32_t i = 0;
//    se::Value tmp;
//    bool ok = true;
//    for (const auto& touch : v)
//    {
//        if (!native_ptr_to_seval<cocos2d::Touch>(touch, &tmp))
//        {
//            ok = false;
//            break;
//        }
//        arr->setArrayElement(i, tmp);
//        ++i;
//    }
//    if (ok)
//        ret->setObject(arr);
//    else
//        ret->setUndefined();
//
//    return ok;
//}

bool std_map_string_string_to_seval(const std::map<std::string, std::string>& v, se::Value* ret)
{
    assert(ret != nullptr);

    se::HandleObject obj(se::Object::createPlainObject());
    bool ok = true;
    for (const auto& e : v)
    {
        const std::string& key = e.first;
        const std::string& value = e.second;

        if (key.empty())
            continue;

        se::Value tmp;
        if (!std_string_to_seval(value, &tmp))
        {
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

namespace
{
    enum class DataType
    {
        INT,
        FLOAT
    };
    
    void toVec2(void* data, DataType type, se::Value* ret)
    {
        int32_t* intptr = (int32_t*)data;
        float* floatptr = (float*)data;
        cocos2d::Vec2 vec2;
        if (DataType::INT == type)
        {
            vec2.x = *intptr;
            vec2.y = *(intptr + 1);
        }
        else
        {
            vec2.x = *floatptr;
            vec2.y = *(floatptr + 1);
        }
        
        Vec2_to_seval(vec2, ret);
    }
    
    void toVec3(void* data, DataType type, se::Value* ret)
    {
        int32_t* intptr = (int32_t*)data;
        float* floatptr = (float*)data;
        cocos2d::Vec3 vec3;
        if (DataType::INT == type)
        {
            vec3.x = *intptr;
            vec3.y = *(intptr + 1);
            vec3.z = *(intptr + 2);
        }
        else
        {
            vec3.x = *floatptr;
            vec3.y = *(floatptr + 1);
            vec3.z = *(floatptr + 2);
        }
        
        Vec3_to_seval(vec3, ret);
    }
    
    void toVec4(void* data, DataType type, se::Value* ret)
    {
        int32_t* intptr = (int32_t*)data;
        float* floatptr = (float*)data;
        cocos2d::Vec4 vec4;
        if (DataType::INT == type)
        {
            vec4.x = *intptr;
            vec4.y = *(intptr + 1);
            vec4.z = *(intptr + 2);
            vec4.w = *(intptr + 3);
        }
        else
        {
            vec4.x = *floatptr;
            vec4.y = *(floatptr + 1);
            vec4.z = *(floatptr + 2);
            vec4.w = *(floatptr + 3);
        }
        
        Vec4_to_seval(vec4, ret);
    }
    
    void toMat(float* data, int num, se::Value* ret)
    {
        se::HandleObject obj(se::Object::createPlainObject());
        
        char propName[4] = {0};
        for (int i  = 0; i < num; ++i)
        {
            if (i < 10)
                snprintf(propName, 3, "m0%d", i);
            else
                snprintf(propName, 3, "m%d", i);
            
            obj->setProperty(propName, se::Value(*(data + i)));
        }
        ret->setObject(obj);
    }
}

bool ManifestAsset_to_seval(const cocos2d::extension::ManifestAsset& v, se::Value* ret)
{
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

//IDEA: why v has to be a pointer?
//bool uniform_to_seval(const cocos2d::Uniform* v, se::Value* ret)
//{
//    assert(v != nullptr && ret != nullptr);
//    se::HandleObject obj(se::Object::createPlainObject());
//    obj->setProperty("location", se::Value(v->location));
//    obj->setProperty("size", se::Value(v->size));
//    obj->setProperty("type", se::Value(v->type));
//    obj->setProperty("name", se::Value(v->name));
//    ret->setObject(obj);
//
//    return true;
//}
//
//
//bool Quaternion_to_seval(const cocos2d::Quaternion& v, se::Value* ret)
//{
//    assert(ret != nullptr);
//    se::HandleObject obj(se::Object::createPlainObject());
//    obj->setProperty("x", se::Value(v.x));
//    obj->setProperty("y", se::Value(v.y));
//    obj->setProperty("z", se::Value(v.z));
//    obj->setProperty("w", se::Value(v.w));
//    ret->setObject(obj);
//
//    return true;
//}
//
//bool AffineTransform_to_seval(const cocos2d::AffineTransform& v, se::Value* ret)
//{
//    assert(ret != nullptr);
//    se::HandleObject obj(se::Object::createPlainObject());
//    obj->setProperty("a", se::Value(v.a));
//    obj->setProperty("b", se::Value(v.b));
//    obj->setProperty("c", se::Value(v.c));
//    obj->setProperty("d", se::Value(v.d));
//    obj->setProperty("tx", se::Value(v.tx));
//    obj->setProperty("ty", se::Value(v.ty));
//    ret->setObject(obj);
//
//    return true;
//}

//bool Viewport_to_seval(const cocos2d::experimental::Viewport& v, se::Value* ret)
//{
//    assert(ret != nullptr);
//    se::HandleObject obj(se::Object::createPlainObject());
//    obj->setProperty("left", se::Value(v._left));
//    obj->setProperty("bottom", se::Value(v._bottom));
//    obj->setProperty("width", se::Value(v._width));
//    obj->setProperty("height", se::Value(v._height));
//    ret->setObject(obj);
//
//    return true;
//}

bool Data_to_seval(const cocos2d::Data& v, se::Value* ret)
{
    assert(ret != nullptr);
    if (v.isNull())
    {
        ret->setNull();
    }
    else
    {
        se::HandleObject obj(se::Object::createTypedArray(se::Object::TypedArrayType::UINT8, v.getBytes(), v.getSize()));
        ret->setObject(obj, true);
    }
    return true;
}

bool DownloadTask_to_seval(const cocos2d::network::DownloadTask& v, se::Value* ret)
{
    assert(ret != nullptr);

    se::HandleObject obj(se::Object::createPlainObject());
    obj->setProperty("identifier", se::Value(v.identifier));
    obj->setProperty("requestURL", se::Value(v.requestURL));
    obj->setProperty("storagePath", se::Value(v.storagePath));
    ret->setObject(obj);

    return true;
}
bool std_vector_EffectDefine_to_seval(const std::vector<cocos2d::ValueMap>& v, se::Value* ret)
{
    assert(ret != nullptr);
    se::HandleObject arr(se::Object::createArrayObject(v.size()));
    ret->setObject(arr);
    
    uint32_t i  = 0;
    for (const auto&valueMap : v)
    {
        se::Value out = se::Value::Null;
        ccvaluemap_to_seval(valueMap, &out);
        arr->setArrayElement(i, out);
        
        ++i;
    }
    
    return true;
}

#if USE_GFX_RENDERER
#endif // USE_GFX_RENDERER > 0
