#include "jsb_gfx_manual.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "scripting/js-bindings/jswrapper/SeApi.h"
#include "scripting/js-bindings/auto/jsb_gfx_auto.hpp"
#include "platform/CCPlatformConfig.h"
#include "scripting/js-bindings/auto/jsb_gles3_auto.hpp"
#include "renderer/gfx-gles3/GFXGLES3.h"

#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
#define USE_GLES2
#endif

#ifdef USE_GLES2
#include "scripting/js-bindings/auto/jsb_gles2_auto.hpp"
#include "renderer/gfx-gles2/GFXGLES2.h"
#endif





#include <fstream>
#include <sstream>

#define GFX_MAX_VERTEX_ATTRIBUTES 16
#define GFX_MAX_TEXTURE_UNITS 16
#define GFX_MAX_ATTACHMENTS 4
#define GFX_MAX_BUFFER_BINDINGS 24
#define GFX_INVALID_BINDING ((uint8_t)-1)
#define GFX_INVALID_HANDLE ((uint)-1)

bool js_GFXDevice_copyBuffersToTexture(se::State& s, cocos2d::GFXDevice* cobj)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::GFXDataArray arg0;
        cocos2d::GFXTexture* arg1 = nullptr;
        std::vector<cocos2d::GFXBufferTextureCopy> arg2;
        if (args[0].isObject())
        {
            se::Object* dataObj = args[0].toObject();
            SE_PRECONDITION2(dataObj->isArray(), false, "Buffers must be an array!");
            uint32_t length = 0;
            dataObj->getArrayLength(&length);
            arg0.datas.resize(length);
            
            se::Value value;
            for (uint32_t i = 0; i < length; ++i)
            {
                if (dataObj->getArrayElement(i, &value))
                {
                    uint8_t* ptr = nullptr;
                    CC_UNUSED size_t dataLength = 0;
                    se::Object* obj = value.toObject();
                    if (obj->isArrayBuffer())
                    {
                        ok = obj->getArrayBufferData(&ptr, &dataLength);
                        SE_PRECONDITION2(ok, false, "getArrayBufferData failed!");
                    }
                    else if (obj->isTypedArray())
                    {
                        ok = obj->getTypedArrayData(&ptr, &dataLength);
                        SE_PRECONDITION2(ok, false, "getTypedArrayData failed!");
                    }
                    else
                    {
                        assert(false);
                    }
                    arg0.datas[i] = ptr;
                }
            }
        }
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_std_vector(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_copyBuffersToTexture : Error processing arguments");
        cobj->copyBuffersToTexture(arg0, arg1, arg2);
        return true;
    }
    
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}

bool js_GFXDevice_copyTexImagesToTexture(se::State& s, cocos2d::GFXDevice* cobj)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::GFXDataArray arg0;
        cocos2d::GFXTexture* arg1 = nullptr;
        std::vector<cocos2d::GFXBufferTextureCopy> arg2;
        if (args[0].isObject())
        {
            se::Object* dataObj = args[0].toObject();
            SE_PRECONDITION2(dataObj->isArray(), false, "Buffers must be an array!");
            uint32_t length = 0;
            dataObj->getArrayLength(&length);
            arg0.datas.resize(length);
            
            se::Value value;
            for (uint32_t i = 0; i < length; ++i)
            {
                if (dataObj->getArrayElement(i, &value))
                {
                    CC_UNUSED size_t dataLength = 0;
                    cocos2d::Data bufferData;
                    ok &= seval_to_Data(value, &bufferData);
                    arg0.datas[i] = bufferData.takeBuffer();
                }
            }
        }
        else
        {
            ok &= false;
        }
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_std_vector(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXDevice_copyBuffersToTexture : Error processing arguments");
        cobj->copyBuffersToTexture(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}

#ifdef USE_GLES2
static bool js_gfx_GLES2Device_copyBuffersToTexture(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_copyBuffersToTexture : Invalid Native Object");
    return js_GFXDevice_copyBuffersToTexture(s, cobj);
}
SE_BIND_FUNC(js_gfx_GLES2Device_copyBuffersToTexture)

static bool js_gfx_GLES2Device_copyTexImagesToTexture(se::State& s)
{
    cocos2d::GLES2Device* cobj = (cocos2d::GLES2Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES2Device_copyBuffersToTexture : Invalid Native Object");
    return js_GFXDevice_copyTexImagesToTexture(s, cobj);
}
SE_BIND_FUNC(js_gfx_GLES2Device_copyTexImagesToTexture);
#endif // USE_GLES2

static bool js_gfx_GLES3Device_copyBuffersToTexture(se::State& s)
{
    cocos2d::GLES3Device* cobj = (cocos2d::GLES3Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES3Device_copyBuffersToTexture : Invalid Native Object");
    return js_GFXDevice_copyBuffersToTexture(s, cobj);
}
SE_BIND_FUNC(js_gfx_GLES3Device_copyBuffersToTexture)

static bool js_gfx_GLES3Device_copyTexImagesToTexture(se::State& s)
{
    cocos2d::GLES3Device* cobj = (cocos2d::GLES3Device*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GLES3Device_copyBuffersToTexture : Invalid Native Object");
    return js_GFXDevice_copyTexImagesToTexture(s, cobj);
}
SE_BIND_FUNC(js_gfx_GLES3Device_copyTexImagesToTexture);

static bool js_gfx_GFXBuffer_update(se::State& s)
{
    cocos2d::GFXBuffer* cobj = (cocos2d::GFXBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;

    uint8_t* arg0 = nullptr;
    CC_UNUSED size_t dataLength = 0;
    se::Object* obj = args[0].toObject();
    if (obj->isArrayBuffer())
    {
        ok = obj->getArrayBufferData(&arg0, &dataLength);
        SE_PRECONDITION2(ok, false, "getArrayBufferData failed!");
    }
    else if (obj->isTypedArray())
    {
        ok = obj->getTypedArrayData(&arg0, &dataLength);
        SE_PRECONDITION2(ok, false, "getTypedArrayData failed!");
    }
    else
    {
        ok = false;
    }
    
    if (argc == 1) {
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_update : Error processing arguments");
        cobj->update(arg0, 0, static_cast<uint>(dataLength));
        return true;
    }
    if (argc == 2) {
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_update : Error processing arguments");
        cobj->update(arg0, arg1, static_cast<uint>(dataLength));
        return true;
    }
    if (argc == 3) {
        unsigned int arg1 = 0;
        unsigned int arg2 = 0;
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_update : Error processing arguments");
        cobj->update(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_update)

se::Object* __jsb_cocos2d_GFXSubPass_proto = nullptr;
se::Class* __jsb_cocos2d_GFXSubPass_class = nullptr;

static bool js_gfx_GFXSubPass_get_bind_point(se::State& s)
{
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_get_bind_point : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->bindPoint, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSubPass_get_bind_point)

static bool js_gfx_GFXSubPass_set_bind_point(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_set_bind_point : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cocos2d::GFXPipelineBindPoint arg0 = cocos2d::GFXPipelineBindPoint::GRAPHICS;
    do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXPipelineBindPoint)tmp; } while(false);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_set_bind_point : Error processing new value");
    cobj->bindPoint = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSubPass_set_bind_point)

static bool js_gfx_GFXSubPass_get_inputs(se::State& s)
{
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_get_inputs : Invalid Native Object");

    se::Value jsret;
    se::HandleObject obj(se::Object::createArrayObject(GFX_MAX_ATTACHMENTS));
    for (uint8_t i = 0; i < GFX_MAX_ATTACHMENTS; ++i)
    {
        obj->setArrayElement(i, se::Value(cobj->inputs[i]));
    }
    jsret.setObject(obj);
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSubPass_get_inputs)

static bool js_gfx_GFXSubPass_set_inputs(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_set_inputs : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= seval_to_Uint8Array(args[0], cobj->inputs);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_set_inputs : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSubPass_set_inputs)

static bool js_gfx_GFXSubPass_get_colors(se::State& s)
{
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_get_colors : Invalid Native Object");

    se::Value jsret;
    se::HandleObject obj(se::Object::createArrayObject(GFX_MAX_ATTACHMENTS));
    for (uint8_t i = 0; i < GFX_MAX_ATTACHMENTS; ++i)
    {
        obj->setArrayElement(i, se::Value(cobj->colors[i]));
    }
    jsret.setObject(obj);
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSubPass_get_colors)

static bool js_gfx_GFXSubPass_set_colors(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_set_colors : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= seval_to_Uint8Array(args[0], cobj->colors);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_set_colors : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSubPass_set_colors)

static bool js_gfx_GFXSubPass_get_resolves(se::State& s)
{
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_get_resolves : Invalid Native Object");

    se::Value jsret;
    se::HandleObject obj(se::Object::createArrayObject(GFX_MAX_ATTACHMENTS));
    for (uint8_t i = 0; i < GFX_MAX_ATTACHMENTS; ++i)
    {
        obj->setArrayElement(i, se::Value(cobj->resolves[i]));
    }
    jsret.setObject(obj);
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSubPass_get_resolves)

static bool js_gfx_GFXSubPass_set_resolves(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_set_resolves : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= seval_to_Uint8Array(args[0], cobj->resolves);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_set_resolves : Error processing new value");

    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSubPass_set_resolves)

static bool js_gfx_GFXSubPass_get_depth_stencil(se::State& s)
{
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_get_depth_stencil : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint8_to_seval((unsigned char)cobj->depthStencil, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSubPass_get_depth_stencil)

static bool js_gfx_GFXSubPass_set_depth_stencil(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_set_depth_stencil : Invalid Native Object");

    CC_UNUSED bool ok = true;
    uint8_t arg0;
    ok &= seval_to_uint8(args[0], (uint8_t*)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_set_depth_stencil : Error processing new value");
    cobj->depthStencil = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSubPass_set_depth_stencil)

static bool js_gfx_GFXSubPass_get_preserves(se::State& s)
{
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_get_preserves : Invalid Native Object");

    se::Value jsret;
    se::HandleObject obj(se::Object::createArrayObject(GFX_MAX_ATTACHMENTS));
    for (uint8_t i = 0; i < GFX_MAX_ATTACHMENTS; ++i)
    {
        obj->setArrayElement(i, se::Value(cobj->preserves[i]));
    }
    jsret.setObject(obj);
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXSubPass_get_preserves)

static bool js_gfx_GFXSubPass_set_preserves(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_set_preserves : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= seval_to_Uint8Array(args[0], cobj->preserves);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_set_preserves : Error processing new value");

    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXSubPass_set_preserves)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_GFXSubPass_finalize)

static bool js_gfx_GFXSubPass_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cocos2d::GFXSubPass* cobj = new (std::nothrow) cocos2d::GFXSubPass();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cocos2d::GFXSubPass* cobj = new (std::nothrow) cocos2d::GFXSubPass();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);

        cocos2d::GFXPipelineBindPoint arg0 = cocos2d::GFXPipelineBindPoint::GRAPHICS;
        json->getProperty("bind_point", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".bind_point\" is undefined!");
            return false;
        }
        do { int32_t tmp = 0; ok &= seval_to_int32(field, &tmp); arg0 = (cocos2d::GFXPipelineBindPoint)tmp; } while(false);
        cobj->bindPoint = arg0;
        
        json->getProperty("inputs", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".inputs\" is undefined!");
            return false;
        } 
        ok &= seval_to_Uint8Array(field, cobj->inputs);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_constructor : Error processing inputs value");

        json->getProperty("colors", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".colors\" is undefined!");
            return false;
        }
        ok &= seval_to_Uint8Array(field, cobj->colors);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_constructor : Error processing colors value");

        json->getProperty("resolves", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".resolves\" is undefined!");
            return false;
        }
        ok &= seval_to_Uint8Array(field, cobj->resolves);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_constructor : Error processing resolves value");

        json->getProperty("depth_stencil", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".depth_stencil\" is undefined!");
            return false;
        }
        ok &= seval_to_uint8(field, (uint8_t*)&cobj->depthStencil);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_constructor : Error processing depth_stencil value");
        
        json->getProperty("preserves", &field);  
        if(field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".preserves\" is undefined!");
            return false;
        }
        ok &= seval_to_Uint8Array(field, cobj->preserves);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_constructor : Error processing preserves value");

        return true;
    }
    else if(argc == 6)
    {
        cocos2d::GFXSubPass* cobj = new (std::nothrow) cocos2d::GFXSubPass();
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);

        cocos2d::GFXPipelineBindPoint arg0 = cocos2d::GFXPipelineBindPoint::GRAPHICS;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::GFXPipelineBindPoint)tmp; } while(false);
        cobj->bindPoint = arg0;

        ok &= seval_to_Uint8Array(args[1], (uint8_t*)&cobj->inputs);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_constructor : Error processing inputs value");

        ok &= seval_to_Uint8Array(args[2], (uint8_t*)&cobj->colors);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_constructor : Error processing colors value");

        ok &= seval_to_Uint8Array(args[3], (uint8_t*)&cobj->resolves);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_constructor : Error processing resolves value");

        ok &= seval_to_uint8(args[4], (uint8_t*)&cobj->depthStencil);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_constructor : Error processing depth_stencil value");

        ok &= seval_to_Uint8Array(args[5], (uint8_t*)&cobj->preserves);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_constructor : Error processing preserves value");
        
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_GFXSubPass_constructor, __jsb_cocos2d_GFXSubPass_class, js_cocos2d_GFXSubPass_finalize)

static bool js_cocos2d_GFXSubPass_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::GFXSubPass)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_GFXSubPass_finalize)

bool js_register_gfx_GFXSubPass(se::Object* obj)
{
    auto cls = se::Class::create("GFXSubPass", obj, nullptr, _SE(js_gfx_GFXSubPass_constructor));

    cls->defineProperty("bindPoint", _SE(js_gfx_GFXSubPass_get_bind_point), _SE(js_gfx_GFXSubPass_set_bind_point));
    cls->defineProperty("inputs", _SE(js_gfx_GFXSubPass_get_inputs), _SE(js_gfx_GFXSubPass_set_inputs));
    cls->defineProperty("colors", _SE(js_gfx_GFXSubPass_get_colors), _SE(js_gfx_GFXSubPass_set_colors));
    cls->defineProperty("resolves", _SE(js_gfx_GFXSubPass_get_resolves), _SE(js_gfx_GFXSubPass_set_resolves));
    cls->defineProperty("depthStencil", _SE(js_gfx_GFXSubPass_get_depth_stencil), _SE(js_gfx_GFXSubPass_set_depth_stencil));
    cls->defineProperty("preserves", _SE(js_gfx_GFXSubPass_get_preserves), _SE(js_gfx_GFXSubPass_set_preserves));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXSubPass_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXSubPass>(cls);

    __jsb_cocos2d_GFXSubPass_proto = cls->getProto();
    __jsb_cocos2d_GFXSubPass_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

static bool js_gfx_GFXPipelineLayout_get_layouts(se::State& s)
{
    cocos2d::GFXPipelineLayout* cobj = (cocos2d::GFXPipelineLayout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXPipelineLayout_layouts : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        const std::vector<cocos2d::GFXBindingLayout *>& result = cobj->getLayouts();
        
        se::Value *layouts = &s.rval();
        se::HandleObject arr(se::Object::createArrayObject(result.size()));
        layouts->setObject(arr);
        
        uint32_t i  = 0;
        for (const auto&layout : result)
        {
            se::Value out = se::Value::Null;
            native_ptr_to_seval(layout, &out);
            arr->setArrayElement(i, out);
            
            ++i;
        }
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXPipelineLayout_get_layouts)

static bool js_gfx_GFXBlendState_get_targets(se::State& s)
{
    cocos2d::GFXBlendState* cobj = (cocos2d::GFXBlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendState_get_targets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value *jsTargets = &s.rval();

    const std::vector<cocos2d::GFXBlendTarget>& targets = cobj->targets;
    se::HandleObject arr(se::Object::createArrayObject(targets.size()));
    jsTargets->setObject(arr);
    
    uint32_t i  = 0;
    for (const auto&target : targets)
    {
        se::Value out = se::Value::Null;
        native_ptr_to_seval(target, &out);
        arr->setArrayElement(i, out);
        
        ++i;
    }
    return true;
}
SE_BIND_PROP_GET(js_gfx_GFXBlendState_get_targets)

static bool js_gfx_GFXBlendState_set_targets(se::State& s)
{
    const auto& args = s.args();
    cocos2d::GFXBlendState* cobj = (cocos2d::GFXBlendState*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendState_set_targets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    std::vector<cocos2d::GFXBlendTarget> arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendState_set_targets : Error processing new value");
    cobj->targets = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_GFXBlendState_set_targets)

static bool js_gfx_GFXCommandBuffer_execute(se::State& s)
{
    cocos2d::GFXCommandBuffer* cobj = (cocos2d::GFXCommandBuffer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXCommandBuffer_execute : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::vector<cocos2d::GFXCommandBuffer *> cmdBufs;
        unsigned int count = 0;
        ok &= seval_to_uint32(args[1], (uint32_t*)&count);
        
        se::Object* jsarr = args[0].toObject();
        assert(jsarr->isArray());
        uint32_t len = 0;
        ok &= jsarr->getArrayLength(&len);
        if (len < count)
        {
            ok = false;
        }
        if (ok)
        {
            cmdBufs.resize(count);
            
            se::Value tmp;
            for (uint32_t i = 0; i < count; ++i)
            {
                ok = jsarr->getArrayElement(i, &tmp);
                if (!ok || !tmp.isObject())
                {
                    cmdBufs.clear();
                    break;
                }
                
                cocos2d::GFXCommandBuffer *cmdBuf = (cocos2d::GFXCommandBuffer*)tmp.toObject()->getPrivateData();
                cmdBufs[i] = cmdBuf;
            }
        }
        
        SE_PRECONDITION2(ok, false, "js_gfx_GFXCommandBuffer_execute : Error processing arguments");
        cobj->execute(cmdBufs, count);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXCommandBuffer_execute)

static bool js_gfx_GFXInputAssembler_extractDrawInfo(se::State& s)
{
    cocos2d::GFXInputAssembler* cobj = (cocos2d::GFXInputAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXInputAssembler_extractDrawInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 1) {
        cocos2d::GFXDrawInfo nativeDrawInfo;
        cobj->extractDrawInfo(nativeDrawInfo);
        
        se::Object* drawInfo = args[0].toObject();
        se::Value attrValue(nativeDrawInfo.vertexCount);
        drawInfo->setProperty("vertexCount", attrValue);
        
        attrValue.setUint32(nativeDrawInfo.firstVertex);
        drawInfo->setProperty("firstVertex", attrValue);
        
        attrValue.setUint32(nativeDrawInfo.indexCount);
        drawInfo->setProperty("indexCount", attrValue);
        
        attrValue.setUint32(nativeDrawInfo.firstIndex);
        drawInfo->setProperty("firstIndex", attrValue);
        
        attrValue.setUint32(nativeDrawInfo.vertexOffset);
        drawInfo->setProperty("vertexOffset", attrValue);
        
        attrValue.setUint32(nativeDrawInfo.instanceCount);
        drawInfo->setProperty("instanceCount", attrValue);
        
        attrValue.setUint32(nativeDrawInfo.firstInstance);
        drawInfo->setProperty("firstInstance", attrValue);

        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXInputAssembler_extractDrawInfo)

bool register_all_gfx_manual(se::Object* obj)
{    
    __jsb_cocos2d_GFXBuffer_proto->defineFunction("update", _SE(js_gfx_GFXBuffer_update));
    
    __jsb_cocos2d_GFXPipelineLayout_proto->defineProperty("layouts", _SE(js_gfx_GFXPipelineLayout_get_layouts), nullptr);
    
    __jsb_cocos2d_GFXBlendState_proto->defineProperty("targets", _SE(js_gfx_GFXBlendState_get_targets), _SE(js_gfx_GFXBlendState_set_targets));
    
    __jsb_cocos2d_GFXCommandBuffer_proto->defineFunction("execute", _SE(js_gfx_GFXCommandBuffer_execute));

    __jsb_cocos2d_GFXInputAssembler_proto->defineFunction("extractDrawInfo", _SE(js_gfx_GFXInputAssembler_extractDrawInfo));
    
    js_register_gfx_GFXSubPass(obj);
    
#ifdef USE_GLES2
    register_all_gles2(obj);
    __jsb_cocos2d_GLES2Device_proto->defineFunction("copyBuffersToTexture", _SE(js_gfx_GLES2Device_copyBuffersToTexture));
    __jsb_cocos2d_GLES2Device_proto->defineFunction("copyTexImagesToTexture", _SE(js_gfx_GLES2Device_copyTexImagesToTexture));
#endif // USE_GLES2
    
    register_all_gles3(obj);
    __jsb_cocos2d_GLES3Device_proto->defineFunction("copyBuffersToTexture", _SE(js_gfx_GLES3Device_copyBuffersToTexture));
    __jsb_cocos2d_GLES3Device_proto->defineFunction("copyTexImagesToTexture", _SE(js_gfx_GLES3Device_copyTexImagesToTexture));
    
    return true;
}
