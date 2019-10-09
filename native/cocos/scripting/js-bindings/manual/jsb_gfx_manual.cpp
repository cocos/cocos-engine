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
#include "base/ccConfig.h"
#include "jsb_gfx_manual.hpp"
#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include "cocos/scripting/js-bindings/auto/jsb_gfx_auto.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "gfx/GFX.h"

using namespace cocos2d;
using namespace cocos2d::renderer;

static bool js_gfx_DeviceGraphics_clear(se::State& s)
{
    cocos2d::renderer::DeviceGraphics* cobj = (cocos2d::renderer::DeviceGraphics*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceGraphics_clear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        uint8_t flags = 0;
        Color4F color(Color4F::BLACK);
        double depth = 1.0;
        int32_t stencil = 0;

        se::Object* arg1 = args[0].toObject();

        se::Value colorVal, depthVal, stencilVal;
        if (arg1->getProperty("color", &colorVal))
        {
            flags |= ClearFlag::COLOR;

            if (colorVal.isObject() && colorVal.toObject()->isArray())
            {
                se::Object* colorObj = colorVal.toObject();
                uint32_t length = 0;
                if (colorObj->getArrayLength(&length) && length == 4)
                {
                    se::Value tmp;
                    if (colorObj->getArrayElement(0, &tmp) && tmp.isNumber())
                    {
                        color.r = tmp.toFloat();
                    }
                    if (colorObj->getArrayElement(1, &tmp) && tmp.isNumber())
                    {
                        color.g = tmp.toFloat();
                    }
                    if (colorObj->getArrayElement(2, &tmp) && tmp.isNumber())
                    {
                        color.b = tmp.toFloat();
                    }
                    if (colorObj->getArrayElement(3, &tmp) && tmp.isNumber())
                    {
                        color.a = tmp.toFloat();
                    }
                }
            }
            else
            {
                SE_LOGE("Invalid clear color flag!\n");
            }
        }

        if (arg1->getProperty("depth", &depthVal))
        {
            flags |= ClearFlag::DEPTH;

            if (depthVal.isNumber())
            {
                depth = depthVal.toNumber();
            }
        }

        if (arg1->getProperty("stencil", &stencilVal))
        {
            flags |= ClearFlag::STENCIL;

            if (stencilVal.isNumber())
            {
                stencil = stencilVal.toInt32();
            }
        }

        cobj->clear(flags, &color, depth, stencil);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_DeviceGraphics_clear)

static bool js_gfx_DeviceGraphics_setUniform(se::State& s)
{
    cocos2d::renderer::DeviceGraphics* cobj = (cocos2d::renderer::DeviceGraphics*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceGraphics_setUniform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string name;
        ok = seval_to_std_string(args[0], &name);
        SE_PRECONDITION2(ok, false, "Convert uniform name failed!");

        auto hashName = std::hash<std::string>{}(name);
        
        se::Value arg1 = args[1];
        if (arg1.isObject())
        {
            se::Object* value = arg1.toObject();
            if (value->isTypedArray())
            {
                uint8_t* data = nullptr;
                size_t bytes = 0;
                if (value->getTypedArrayData(&data, &bytes))
                    cobj->setUniform(hashName, data, bytes, UniformElementType::FLOAT);
            }
            else
            {
                assert(false);
            }
        }
        else if (arg1.isNumber())
        {
            float number = arg1.toFloat();
            cobj->setUniformf(hashName, number);
        }
        else if (arg1.isBoolean())
        {
            int v = arg1.toBoolean() ? 1 : 0;
            cobj->setUniformi(hashName, v);
        }
        else
        {
            assert(false);
        }

        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_DeviceGraphics_setUniform)

static VertexFormat* getVertexFormatFromValue(const se::Value& elementVal)
{
    std::vector<VertexFormat::Info> formatInfos;

    if (elementVal.isObject() && elementVal.toObject()->isArray())
    {
        se::Object* fmtArr = elementVal.toObject();
        uint32_t length = 0;
        if (fmtArr->getArrayLength(&length) && length > 0)
        {
            se::Value tmp;
            se::Value nameVal;
            se::Value typeVal;
            se::Value numVal;
            se::Value normalizeVal;
            bool normalized = false;
            for (uint32_t i = 0; i < length; ++i)
            {
                if (fmtArr->getArrayElement(i, &tmp) && tmp.isObject())
                {
                    tmp.toObject()->getProperty("name", &nameVal);
                    tmp.toObject()->getProperty("type", &typeVal);
                    tmp.toObject()->getProperty("num", &numVal);
                    if (tmp.toObject()->getProperty("normalize", &normalizeVal))
                    {
                        seval_to_boolean(normalizeVal, &normalized);
                    }

                    formatInfos.push_back({ nameVal.toString(), (AttribType)typeVal.toUint16(), numVal.toUint32(), normalized });
                }
            }
        }
    }
    
    auto vertexFormat = new VertexFormat(formatInfos);

    return vertexFormat;
}

static bool js_gfx_VertexBuffer_init(se::State& s)
{
    cocos2d::renderer::VertexBuffer* cobj = (cocos2d::renderer::VertexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_VertexBuffer_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        cocos2d::renderer::DeviceGraphics* device;
        ok &= seval_to_native_ptr(args[0], &device);

//        VertexFormat* format = getVertexFormatFromValue(args[1]);
        VertexFormat* format = static_cast<cocos2d::renderer::VertexFormat*>(args[1].toObject()->getPrivateData());
        Usage usage = (Usage) args[2].toUint16();
        uint8_t* data = nullptr;
        size_t dataByteLength = 0;
        uint32_t numVertices = 0;

        const se::Value& arg3 = args[3];
        se::Object* typedArr = nullptr;
        if (arg3.isObject())
        {
            typedArr = arg3.toObject();
            assert(typedArr->isTypedArray());
            ok = typedArr->getTypedArrayData(&data, &dataByteLength);
            assert(ok);
        }

        ok = seval_to_uint32(args[4], &numVertices);
        assert(ok);

        cobj->init(device, format, usage, data, dataByteLength, numVertices);
//        delete format;

        se::Object* thisObj = s.thisObject();
        cobj->setFetchDataCallback([thisObj](size_t* bytes) ->uint8_t* {

            uint8_t* ret = nullptr;
            se::Value dataVal;
            if (thisObj->getProperty("_data", &dataVal) && dataVal.isObject())
            {
                assert(dataVal.toObject()->isTypedArray());
                dataVal.toObject()->getTypedArrayData(&ret, bytes);
            }

            return ret;
        });

        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_gfx_VertexBuffer_init)

static bool js_gfx_VertexBuffer_self(se::State& s)
{
    cocos2d::renderer::VertexBuffer* cobj = (cocos2d::renderer::VertexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_VertexBuffer_update : Invalid Native Object");
    
    auto addr = (unsigned long)cobj;
    s.rval().setNumber(addr);
    return true;
}
SE_BIND_FUNC(js_gfx_VertexBuffer_self)

// uint32_t offset, const void* data, size_t dataByteLength
static bool js_gfx_VertexBuffer_update(se::State& s)
{
    cocos2d::renderer::VertexBuffer* cobj = (cocos2d::renderer::VertexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_VertexBuffer_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        uint32_t offset = 0;
        ok = seval_to_uint32(args[0], &offset);
        SE_PRECONDITION2(ok, false, "Convert arg0 offset failed!");
        if (args[1].isObject())
        {
            se::Object* arg1 = args[1].toObject();
            if (arg1->isTypedArray())
            {
                uint8_t* data = nullptr;
                size_t dataLen = 0;
                if (arg1->getTypedArrayData(&data, &dataLen))
                {
                    cobj->update(offset, data, dataLen);
                }
                else
                {
                    SE_PRECONDITION2(false, false, "get typed array data failed!");
                }
            }
            else
            {
                SE_PRECONDITION2(false, false, "arg1 isn't a typed array!");
            }
        }
        else
        {
            SE_PRECONDITION2(false, false, "arg1 isn't an object!");
        }

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_gfx_VertexBuffer_update)

static bool js_gfx_VertexBuffer_prop_setFormat(se::State& s)
{
    cocos2d::renderer::VertexBuffer* cobj = (cocos2d::renderer::VertexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_VertexBuffer_prop_setFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1)
    {
        se::Value formatVal;
        args[0].toObject()->getProperty("_nativeObj", &formatVal);
        auto format = static_cast<VertexFormat*>(formatVal.toObject()->getPrivateData());
        cobj->setFormat(format);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_VertexBuffer_prop_setFormat)

//static bool js_gfx_VertexBuffer_prop_getFormat(se::State& s)
//{
//    cocos2d::renderer::VertexBuffer* cobj = (cocos2d::renderer::VertexBuffer*)s.nativeThisObject();
//    SE_PRECONDITION2(cobj, false, "js_gfx_VertexBuffer_prop_getFormat : Invalid Native Object");
//    const auto& args = s.args();
//    size_t argc = args.size();
//    CC_UNUSED bool ok = true;
//    assert(false); //IDEA:
//    if (argc == 0) {
//        return true;
//    }
//
//    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
//    return false;
//}
//SE_BIND_PROP_GET(js_gfx_VertexBuffer_prop_getFormat)

static bool js_gfx_VertexBuffer_prop_setUsage(se::State& s)
{
    cocos2d::renderer::VertexBuffer* cobj = (cocos2d::renderer::VertexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_VertexBuffer_prop_setUsage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        uint16_t usage;
        ok = seval_to_uint16(args[0], &usage);
        SE_PRECONDITION2(ok, false, "Convert arg0 offset failed!");
        cobj->setUsage((cocos2d::renderer::Usage)usage);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_VertexBuffer_prop_setUsage)

static bool js_gfx_VertexBuffer_prop_getUsage(se::State& s)
{
    cocos2d::renderer::VertexBuffer* cobj = (cocos2d::renderer::VertexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_VertexBuffer_prop_getUsage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::renderer::Usage usage = cobj->getUsage();
        s.rval().setUint16((uint16_t)usage);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_VertexBuffer_prop_getUsage)

static bool js_gfx_VertexBuffer_prop_setNumVertices(se::State& s)
{
    cocos2d::renderer::VertexBuffer* cobj = (cocos2d::renderer::VertexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_VertexBuffer_prop_setNumVertices : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        uint32_t count = 0;
        ok = seval_to_uint32(args[0], &count);
        SE_PRECONDITION2(ok, false, "Convert arg0 offset failed!");
        cobj->setCount(count);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_VertexBuffer_prop_setNumVertices)

static bool js_gfx_VertexBuffer_prop_getNumVertices(se::State& s)
{
    cocos2d::renderer::VertexBuffer* cobj = (cocos2d::renderer::VertexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_VertexBuffer_prop_getNumVertices : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uint32_t count = cobj->getCount();
        s.rval().setUint32(count);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_VertexBuffer_prop_getNumVertices)

static bool js_gfx_VertexBuffer_prop_setBytes(se::State& s)
{
    cocos2d::renderer::VertexBuffer* cobj = (cocos2d::renderer::VertexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_VertexBuffer_prop_setBytes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        uint32_t count = 0;
        ok = seval_to_uint32(args[0], &count);
        SE_PRECONDITION2(ok, false, "Convert arg0 offset failed!");
        cobj->setBytes(count);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_VertexBuffer_prop_setBytes)

static bool js_gfx_VertexBuffer_prop_getBytes(se::State& s)
{
    cocos2d::renderer::VertexBuffer* cobj = (cocos2d::renderer::VertexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_VertexBuffer_prop_getBytes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uint32_t count = cobj->getBytes();
        s.rval().setUint32(count);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_VertexBuffer_prop_getBytes)

static bool js_gfx_IndexBuffer_init(se::State& s)
{
    cocos2d::renderer::IndexBuffer* cobj = (cocos2d::renderer::IndexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_IndexBuffer_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        cocos2d::renderer::DeviceGraphics* device;
        ok &= seval_to_native_ptr(args[0], &device);

        IndexFormat format = (IndexFormat)args[1].toUint16();
        Usage usage = (Usage) args[2].toUint16();

        uint8_t* data = nullptr;
        size_t dataByteLength = 0;
        uint32_t numIndices = 0;

        const auto& arg3 = args[3];
        if (arg3.isObject())
        {
            se::Object* typedArr = args[3].toObject();
            assert(typedArr->isTypedArray());
            ok = typedArr->getTypedArrayData(&data, &dataByteLength);
            assert(ok);
        }

        ok = seval_to_uint32(args[4], &numIndices);
        assert(ok);

        cobj->init(device, format, usage, data, dataByteLength, numIndices);

        se::Object* thisObj = s.thisObject();
        cobj->setFetchDataCallback([thisObj](size_t* bytes) ->uint8_t* {

            uint8_t* ret = nullptr;
            se::Value dataVal;
            if (thisObj->getProperty("_data", &dataVal) && dataVal.isObject())
            {
                assert(dataVal.toObject()->isTypedArray());
                dataVal.toObject()->getTypedArrayData(&ret, bytes);
            }

            return ret;
        });

        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_gfx_IndexBuffer_init)

static bool js_gfx_IndexBuffer_self(se::State& s)
{
    cocos2d::renderer::IndexBuffer* cobj = (cocos2d::renderer::IndexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_VertexBuffer_update : Invalid Native Object");
    
    auto addr = (unsigned long)cobj;
    s.rval().setNumber(addr);
    return true;
}
SE_BIND_FUNC(js_gfx_IndexBuffer_self);

// uint32_t offset, const void* data, size_t dataByteLength
static bool js_gfx_IndexBuffer_update(se::State& s)
{
    cocos2d::renderer::IndexBuffer* cobj = (cocos2d::renderer::IndexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_VertexBuffer_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        uint32_t offset = 0;
        ok = seval_to_uint32(args[0], &offset);
        SE_PRECONDITION2(ok, false, "Convert arg0 offset failed!");
        if (args[1].isObject())
        {
            se::Object* arg1 = args[1].toObject();
            if (arg1->isTypedArray())
            {
                uint8_t* data = nullptr;
                size_t dataLen = 0;
                if (arg1->getTypedArrayData(&data, &dataLen))
                {
                    cobj->update(offset, data, dataLen);
                }
                else
                {
                    SE_PRECONDITION2(false, false, "get typed array data failed!");
                }
            }
            else
            {
                SE_PRECONDITION2(false, false, "arg1 isn't a typed array!");
            }
        }
        else
        {
            SE_PRECONDITION2(false, false, "arg1 isn't an object!");
        }

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_gfx_IndexBuffer_update)

static bool js_gfx_IndexBuffer_prop_setFormat(se::State& s)
{
    cocos2d::renderer::IndexBuffer* cobj = (cocos2d::renderer::IndexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_IndexBuffer_prop_setFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        uint16_t format;
        ok = seval_to_uint16(args[0], &format);
        SE_PRECONDITION2(ok, false, "Convert arg0 offset failed!");
        cobj->setFormat((cocos2d::renderer::IndexFormat)format);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_IndexBuffer_prop_setFormat)

static bool js_gfx_IndexBuffer_prop_getFormat(se::State& s)
{
    cocos2d::renderer::IndexBuffer* cobj = (cocos2d::renderer::IndexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_IndexBuffer_prop_getFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::renderer::IndexFormat format = cobj->getFormat();
        s.rval().setUint16((uint16_t)format);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_IndexBuffer_prop_getFormat)

static bool js_gfx_IndexBuffer_prop_setUsage(se::State& s)
{
    cocos2d::renderer::IndexBuffer* cobj = (cocos2d::renderer::IndexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_IndexBuffer_prop_setUsage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        uint16_t usage;
        ok = seval_to_uint16(args[0], &usage);
        SE_PRECONDITION2(ok, false, "Convert arg0 offset failed!");
        cobj->setUsage((cocos2d::renderer::Usage)usage);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_IndexBuffer_prop_setUsage)

static bool js_gfx_IndexBuffer_prop_getUsage(se::State& s)
{
    cocos2d::renderer::IndexBuffer* cobj = (cocos2d::renderer::IndexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_IndexBuffer_prop_getUsage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::renderer::Usage usage = cobj->getUsage();
        s.rval().setUint16((uint16_t)usage);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_IndexBuffer_prop_getUsage)

static bool js_gfx_IndexBuffer_prop_setNumIndices(se::State& s)
{
    cocos2d::renderer::IndexBuffer* cobj = (cocos2d::renderer::IndexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_IndexBuffer_prop_setNumIndices : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        uint32_t count = 0;
        ok = seval_to_uint32(args[0], &count);
        SE_PRECONDITION2(ok, false, "Convert arg0 offset failed!");
        cobj->setCount(count);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_IndexBuffer_prop_setNumIndices)

static bool js_gfx_IndexBuffer_prop_getNumIndices(se::State& s)
{
    cocos2d::renderer::IndexBuffer* cobj = (cocos2d::renderer::IndexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_IndexBuffer_prop_getNumIndices : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uint32_t count = cobj->getCount();
        s.rval().setUint32(count);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_IndexBuffer_prop_getNumIndices)

static bool js_gfx_IndexBuffer_prop_setBytesPerIndex(se::State& s)
{
    cocos2d::renderer::IndexBuffer* cobj = (cocos2d::renderer::IndexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_IndexBuffer_prop_setBytesPerIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        uint32_t count = 0;
        ok = seval_to_uint32(args[0], &count);
        SE_PRECONDITION2(ok, false, "Convert arg0 offset failed!");
        cobj->setBytesPerIndex(count);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_IndexBuffer_prop_setBytesPerIndex)

static bool js_gfx_IndexBuffer_prop_getBytesPerIndex(se::State& s)
{
    cocos2d::renderer::IndexBuffer* cobj = (cocos2d::renderer::IndexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_IndexBuffer_prop_getBytesPerIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uint32_t count = cobj->getBytesPerIndex();
        s.rval().setUint32(count);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_IndexBuffer_prop_getBytesPerIndex)

static bool js_gfx_IndexBuffer_prop_setBytes(se::State& s)
{
    cocos2d::renderer::IndexBuffer* cobj = (cocos2d::renderer::IndexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_IndexBuffer_prop_setBytes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        uint32_t count = 0;
        ok = seval_to_uint32(args[0], &count);
        SE_PRECONDITION2(ok, false, "Convert arg0 offset failed!");
        cobj->setBytes(count);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_IndexBuffer_prop_setBytes)

static bool js_gfx_IndexBuffer_prop_getBytes(se::State& s)
{
    cocos2d::renderer::IndexBuffer* cobj = (cocos2d::renderer::IndexBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_IndexBuffer_prop_getBytes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uint32_t count = cobj->getBytes();
        s.rval().setUint32(count);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_IndexBuffer_prop_getBytes)

static bool js_gfx_FrameBuffer_init(se::State& s)
{
    cocos2d::renderer::FrameBuffer* cobj = (cocos2d::renderer::FrameBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_FrameBuffer_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        cocos2d::renderer::DeviceGraphics* device = nullptr;
        uint16_t width = 0;
        uint16_t height = 0;
        ok &= seval_to_native_ptr(args[0], &device);
        ok &= seval_to_uint16(args[1], &width);
        ok &= seval_to_uint16(args[2], &height);
        SE_PRECONDITION2(ok, false, "js_gfx_FrameBuffer_init : Error processing arguments");
        SE_PRECONDITION2(args[3].isObject(), false, "options argument isn't an object!");

        std::vector<RenderTarget*> colors;
        RenderTarget* depth = nullptr;
        RenderTarget* stencil = nullptr;
        RenderTarget* depthStencil = nullptr;
        se::Object* optionsObj = args[3].toObject();
        se::Value colorsVal;

        bool result = cobj->init(device, width, height);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_FrameBuffer_init : Error processing arguments");

        if (optionsObj->getProperty("colors", &colorsVal) && colorsVal.isObject() && colorsVal.toObject()->isArray())
        {
            uint32_t len = 0;
            if (colorsVal.toObject()->getArrayLength(&len) && len > 0)
            {
                for (uint32_t i = 0; i < len; ++i)
                {
                    RenderTarget* colorTarget = nullptr;
                    se::Value colorTargetVal;
                    colorsVal.toObject()->getArrayElement(i, &colorTargetVal);
                    seval_to_native_ptr(colorTargetVal, &colorTarget);
                    colors.push_back(colorTarget);
                }

                cobj->setColorBuffers(colors);
            }
        }

        se::Value depthVal;
        if (optionsObj->getProperty("depth", &depthVal) && depthVal.isObject())
        {
            seval_to_native_ptr(depthVal, &depth);
            cobj->setDepthBuffer(depth);
        }

        se::Value stencilVal;
        if (optionsObj->getProperty("stencil", &stencilVal) && stencilVal.isObject())
        {
            seval_to_native_ptr(stencilVal, &stencil);
            cobj->setStencilBuffer(stencil);
        }

        se::Value depthStencilVal;
        if (optionsObj->getProperty("depthStencil", &depthStencilVal) && depthStencilVal.isObject())
        {
            seval_to_native_ptr(depthStencilVal, &depthStencil);
            cobj->setDepthStencilBuffer(depthStencil);
        }

        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_gfx_FrameBuffer_init)

se::Object* __jsb_cocos2d_renderer_VertexFormat_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_VertexFormat_class = nullptr;

static bool js_cocos2d_renderer_VertexFormat_finalize(se::State& s)
{
    cocos2d::renderer::VertexFormat* cobj = (cocos2d::renderer::VertexFormat*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_VertexFormat_getElement : Invalid Native Object");
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_VertexFormat_finalize)

static bool js_gfx_VertexFormat_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    if (1 == argc)
    {
        auto vertexFormat = getVertexFormatFromValue(args[0]);
        s.thisObject()->setPrivateData(vertexFormat);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_VertexFormat_constructor, __jsb_cocos2d_renderer_VertexFormat_class, js_cocos2d_renderer_VertexFormat_finalize)


bool js_register_gfx_VertexFormat(se::Object* obj)
{
    auto cls = se::Class::create("VertexFormatNative", obj, nullptr, _SE(js_gfx_VertexFormat_constructor));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_VertexFormat_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::VertexFormat>(cls);
    
    __jsb_cocos2d_renderer_VertexFormat_proto = cls->getProto();
    __jsb_cocos2d_renderer_VertexFormat_class = cls;
    
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool jsb_register_gfx_manual(se::Object* global)
{
    // Get the ns
    se::Value nsVal;
    if (!global->getProperty("gfx", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        global->setProperty("gfx", nsVal);
    }
    se::Object* ns = nsVal.toObject();
    
    js_register_gfx_VertexFormat(ns);
    
    __jsb_cocos2d_renderer_DeviceGraphics_proto->defineFunction("clear", _SE(js_gfx_DeviceGraphics_clear));
    __jsb_cocos2d_renderer_DeviceGraphics_proto->defineFunction("setUniform", _SE(js_gfx_DeviceGraphics_setUniform));

    __jsb_cocos2d_renderer_VertexBuffer_proto->defineFunction("init", _SE(js_gfx_VertexBuffer_init));
    __jsb_cocos2d_renderer_VertexBuffer_proto->defineFunction("update", _SE(js_gfx_VertexBuffer_update));
    __jsb_cocos2d_renderer_VertexBuffer_proto->defineProperty("_format", nullptr, _SE(js_gfx_VertexBuffer_prop_setFormat));
    __jsb_cocos2d_renderer_VertexBuffer_proto->defineProperty("_usage", _SE(js_gfx_VertexBuffer_prop_getUsage), _SE(js_gfx_VertexBuffer_prop_setUsage));
    __jsb_cocos2d_renderer_VertexBuffer_proto->defineProperty("_bytes", _SE(js_gfx_VertexBuffer_prop_getBytes), _SE(js_gfx_VertexBuffer_prop_setBytes));
    __jsb_cocos2d_renderer_VertexBuffer_proto->defineProperty("_numVertices", _SE(js_gfx_VertexBuffer_prop_getNumVertices), _SE(js_gfx_VertexBuffer_prop_setNumVertices));
    __jsb_cocos2d_renderer_VertexBuffer_proto->defineFunction("self", _SE(js_gfx_VertexBuffer_self));

    __jsb_cocos2d_renderer_IndexBuffer_proto->defineFunction("init", _SE(js_gfx_IndexBuffer_init));
    __jsb_cocos2d_renderer_IndexBuffer_proto->defineFunction("update", _SE(js_gfx_IndexBuffer_update));
    __jsb_cocos2d_renderer_IndexBuffer_proto->defineProperty("_format", _SE(js_gfx_IndexBuffer_prop_getFormat), _SE(js_gfx_IndexBuffer_prop_setFormat));
    __jsb_cocos2d_renderer_IndexBuffer_proto->defineProperty("_usage", _SE(js_gfx_IndexBuffer_prop_getUsage), _SE(js_gfx_IndexBuffer_prop_setUsage));
    __jsb_cocos2d_renderer_IndexBuffer_proto->defineProperty("_bytesPerIndex", _SE(js_gfx_IndexBuffer_prop_getBytesPerIndex), _SE(js_gfx_IndexBuffer_prop_setBytesPerIndex));
    __jsb_cocos2d_renderer_IndexBuffer_proto->defineProperty("_bytes", _SE(js_gfx_IndexBuffer_prop_getBytes), _SE(js_gfx_IndexBuffer_prop_setBytes));
    __jsb_cocos2d_renderer_IndexBuffer_proto->defineProperty("_numIndices", _SE(js_gfx_IndexBuffer_prop_getNumIndices), _SE(js_gfx_IndexBuffer_prop_setNumIndices));
    __jsb_cocos2d_renderer_IndexBuffer_proto->defineFunction("self", _SE(js_gfx_IndexBuffer_self));

    __jsb_cocos2d_renderer_FrameBuffer_proto->defineFunction("init", _SE(js_gfx_FrameBuffer_init));

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
#endif //#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
