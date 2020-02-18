#include "jsb_gfx_manual.hpp"
#if (USE_GFX_RENDERER > 0) && (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_WINDOWS)
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "scripting/js-bindings/jswrapper/SeApi.h"
#include "scripting/js-bindings/auto/jsb_gfx_auto.hpp"
#include "renderer/gfx-gles2/GFXGLES2.h"

#define GFX_MAX_VERTEX_ATTRIBUTES 16
#define GFX_MAX_TEXTURE_UNITS 16
#define GFX_MAX_ATTACHMENTS 4
#define GFX_MAX_BUFFER_BINDINGS 24
#define GFX_INVALID_BINDING ((uint8_t)-1)
#define GFX_INVALID_HANDLE ((uint)-1)

se::Object* __jsb_cocos2d_GFXSubPass_proto = nullptr;
se::Class* __jsb_cocos2d_GFXSubPass_class = nullptr;

static bool js_gfx_GFXSubPass_get_bind_point(se::State& s)
{
    cocos2d::GFXSubPass* cobj = (cocos2d::GFXSubPass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXSubPass_get_bind_point : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->bind_point, &jsret);
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
    cobj->bind_point = arg0;
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
    ok &= uint8_to_seval((unsigned char)cobj->depth_stencil, &jsret);
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
    cobj->depth_stencil = arg0;
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
        cobj->bind_point = arg0;
        
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
        ok &= seval_to_uint8(field, (uint8_t*)&cobj->depth_stencil);
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
        cobj->bind_point = arg0;

        ok &= seval_to_Uint8Array(args[1], (uint8_t*)&cobj->inputs);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_constructor : Error processing inputs value");

        ok &= seval_to_Uint8Array(args[2], (uint8_t*)&cobj->colors);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_constructor : Error processing colors value");

        ok &= seval_to_Uint8Array(args[3], (uint8_t*)&cobj->resolves);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_constructor : Error processing resolves value");

        ok &= seval_to_uint8(args[4], (uint8_t*)&cobj->depth_stencil);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_constructor : Error processing depth_stencil value");

        ok &= seval_to_Uint8Array(args[5], (uint8_t*)&cobj->preserves);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXSubPass_constructor : Error processing preserves value");
        
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_SUB_CLS_CTOR(js_gfx_GFXSubPass_constructor, __jsb_cocos2d_GFXSubPass_class, js_cocos2d_GFXSubPass_finalize)

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

    cls->defineProperty("bind_point", _SE(js_gfx_GFXSubPass_get_bind_point), _SE(js_gfx_GFXSubPass_set_bind_point));
    cls->defineProperty("inputs", _SE(js_gfx_GFXSubPass_get_inputs), _SE(js_gfx_GFXSubPass_set_inputs));
    cls->defineProperty("colors", _SE(js_gfx_GFXSubPass_get_colors), _SE(js_gfx_GFXSubPass_set_colors));
    cls->defineProperty("resolves", _SE(js_gfx_GFXSubPass_get_resolves), _SE(js_gfx_GFXSubPass_set_resolves));
    cls->defineProperty("depth_stencil", _SE(js_gfx_GFXSubPass_get_depth_stencil), _SE(js_gfx_GFXSubPass_set_depth_stencil));
    cls->defineProperty("preserves", _SE(js_gfx_GFXSubPass_get_preserves), _SE(js_gfx_GFXSubPass_set_preserves));
    cls->defineFinalizeFunction(_SE(js_cocos2d_GFXSubPass_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::GFXSubPass>(cls);

    __jsb_cocos2d_GFXSubPass_proto = cls->getProto();
    __jsb_cocos2d_GFXSubPass_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_gfx_manual(se::Object* obj)
{
    js_register_gfx_GFXSubPass(obj);
    return true;
}

#endif //#if (USE_GFX_RENDERER > 0) && (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_WINDOWS) \n#define GFX_MAX_VERTEX_ATTRIBUTES 16