#include "scripting/js-bindings/auto/jsb_cocos2dx_editor_support_auto.hpp"
#if USE_MIDDLEWARE > 0
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "editor-support/middleware-adapter.h"
#include "editor-support/MiddlewareManager.h"

se::Object* __jsb_cocos2d_middleware_Texture2D_proto = nullptr;
se::Class* __jsb_cocos2d_middleware_Texture2D_class = nullptr;

static bool js_cocos2dx_editor_support_Texture2D_getRealTextureIndex(se::State& s)
{
    cocos2d::middleware::Texture2D* cobj = (cocos2d::middleware::Texture2D*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_editor_support_Texture2D_getRealTextureIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getRealTextureIndex();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_editor_support_Texture2D_getRealTextureIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_editor_support_Texture2D_getRealTextureIndex)

static bool js_cocos2dx_editor_support_Texture2D_setTexParamCallback(se::State& s)
{
    cocos2d::middleware::Texture2D* cobj = (cocos2d::middleware::Texture2D*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_editor_support_Texture2D_setTexParamCallback : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (int, unsigned int, unsigned int, unsigned int, unsigned int)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](int larg0, unsigned int larg1, unsigned int larg2, unsigned int larg3, unsigned int larg4) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(5);
                    ok &= int32_to_seval(larg0, &args[0]);
                    ok &= uint32_to_seval(larg1, &args[1]);
                    ok &= uint32_to_seval(larg2, &args[2]);
                    ok &= uint32_to_seval(larg3, &args[3]);
                    ok &= uint32_to_seval(larg4, &args[4]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_editor_support_Texture2D_setTexParamCallback : Error processing arguments");
        cobj->setTexParamCallback(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_editor_support_Texture2D_setTexParamCallback)

static bool js_cocos2dx_editor_support_Texture2D_setPixelsHigh(se::State& s)
{
    cocos2d::middleware::Texture2D* cobj = (cocos2d::middleware::Texture2D*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_editor_support_Texture2D_setPixelsHigh : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_editor_support_Texture2D_setPixelsHigh : Error processing arguments");
        cobj->setPixelsHigh(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_editor_support_Texture2D_setPixelsHigh)

static bool js_cocos2dx_editor_support_Texture2D_setPixelsWide(se::State& s)
{
    cocos2d::middleware::Texture2D* cobj = (cocos2d::middleware::Texture2D*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_editor_support_Texture2D_setPixelsWide : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_editor_support_Texture2D_setPixelsWide : Error processing arguments");
        cobj->setPixelsWide(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_editor_support_Texture2D_setPixelsWide)

static bool js_cocos2dx_editor_support_Texture2D_getPixelsHigh(se::State& s)
{
    cocos2d::middleware::Texture2D* cobj = (cocos2d::middleware::Texture2D*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_editor_support_Texture2D_getPixelsHigh : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPixelsHigh();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_editor_support_Texture2D_getPixelsHigh : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_editor_support_Texture2D_getPixelsHigh)

static bool js_cocos2dx_editor_support_Texture2D_getPixelsWide(se::State& s)
{
    cocos2d::middleware::Texture2D* cobj = (cocos2d::middleware::Texture2D*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_editor_support_Texture2D_getPixelsWide : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPixelsWide();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_editor_support_Texture2D_getPixelsWide : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_editor_support_Texture2D_getPixelsWide)

static bool js_cocos2dx_editor_support_Texture2D_setRealTextureIndex(se::State& s)
{
    cocos2d::middleware::Texture2D* cobj = (cocos2d::middleware::Texture2D*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_editor_support_Texture2D_setRealTextureIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_editor_support_Texture2D_setRealTextureIndex : Error processing arguments");
        cobj->setRealTextureIndex(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_editor_support_Texture2D_setRealTextureIndex)

static bool js_cocos2dx_editor_support_Texture2D_setTexParameters(se::State& s)
{
    cocos2d::middleware::Texture2D* cobj = (cocos2d::middleware::Texture2D*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_editor_support_Texture2D_setTexParameters : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::middleware::Texture2D::_TexParams arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR _TexParams
        ok = false;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_editor_support_Texture2D_setTexParameters : Error processing arguments");
        cobj->setTexParameters(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_editor_support_Texture2D_setTexParameters)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_middleware_Texture2D_finalize)

static bool js_cocos2dx_editor_support_Texture2D_constructor(se::State& s)
{
    cocos2d::middleware::Texture2D* cobj = new (std::nothrow) cocos2d::middleware::Texture2D();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_editor_support_Texture2D_constructor, __jsb_cocos2d_middleware_Texture2D_class, js_cocos2d_middleware_Texture2D_finalize)




static bool js_cocos2d_middleware_Texture2D_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::middleware::Texture2D)", s.nativeThisObject());
    cocos2d::middleware::Texture2D* cobj = (cocos2d::middleware::Texture2D*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_middleware_Texture2D_finalize)

bool js_register_cocos2dx_editor_support_Texture2D(se::Object* obj)
{
    auto cls = se::Class::create("Texture2D", obj, nullptr, _SE(js_cocos2dx_editor_support_Texture2D_constructor));

    cls->defineFunction("getRealTextureIndex", _SE(js_cocos2dx_editor_support_Texture2D_getRealTextureIndex));
    cls->defineFunction("setTexParamCallback", _SE(js_cocos2dx_editor_support_Texture2D_setTexParamCallback));
    cls->defineFunction("setPixelsHigh", _SE(js_cocos2dx_editor_support_Texture2D_setPixelsHigh));
    cls->defineFunction("setPixelsWide", _SE(js_cocos2dx_editor_support_Texture2D_setPixelsWide));
    cls->defineFunction("getPixelsHigh", _SE(js_cocos2dx_editor_support_Texture2D_getPixelsHigh));
    cls->defineFunction("getPixelsWide", _SE(js_cocos2dx_editor_support_Texture2D_getPixelsWide));
    cls->defineFunction("setRealTextureIndex", _SE(js_cocos2dx_editor_support_Texture2D_setRealTextureIndex));
    cls->defineFunction("setTexParameters", _SE(js_cocos2dx_editor_support_Texture2D_setTexParameters));
    cls->defineFinalizeFunction(_SE(js_cocos2d_middleware_Texture2D_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::middleware::Texture2D>(cls);

    __jsb_cocos2d_middleware_Texture2D_proto = cls->getProto();
    __jsb_cocos2d_middleware_Texture2D_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_middleware_MiddlewareManager_proto = nullptr;
se::Class* __jsb_cocos2d_middleware_MiddlewareManager_class = nullptr;

static bool js_cocos2dx_editor_support_MiddlewareManager_getGLVBID(se::State& s)
{
    cocos2d::middleware::MiddlewareManager* cobj = (cocos2d::middleware::MiddlewareManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_editor_support_MiddlewareManager_getGLVBID : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_editor_support_MiddlewareManager_getGLVBID : Error processing arguments");
        unsigned int result = cobj->getGLVBID(arg0);
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_editor_support_MiddlewareManager_getGLVBID : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_editor_support_MiddlewareManager_getGLVBID)

static bool js_cocos2dx_editor_support_MiddlewareManager_update(se::State& s)
{
    cocos2d::middleware::MiddlewareManager* cobj = (cocos2d::middleware::MiddlewareManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_editor_support_MiddlewareManager_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_editor_support_MiddlewareManager_update : Error processing arguments");
        cobj->update(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_editor_support_MiddlewareManager_update)

static bool js_cocos2dx_editor_support_MiddlewareManager_getGLIBID(se::State& s)
{
    cocos2d::middleware::MiddlewareManager* cobj = (cocos2d::middleware::MiddlewareManager*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_editor_support_MiddlewareManager_getGLIBID : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getGLIBID();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_editor_support_MiddlewareManager_getGLIBID : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_editor_support_MiddlewareManager_getGLIBID)

static bool js_cocos2dx_editor_support_MiddlewareManager_destroyInstance(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cocos2d::middleware::MiddlewareManager::destroyInstance();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_editor_support_MiddlewareManager_destroyInstance)

static bool js_cocos2dx_editor_support_MiddlewareManager_getInstance(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::middleware::MiddlewareManager* result = cocos2d::middleware::MiddlewareManager::getInstance();
        ok &= native_ptr_to_seval<cocos2d::middleware::MiddlewareManager>((cocos2d::middleware::MiddlewareManager*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_editor_support_MiddlewareManager_getInstance : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_editor_support_MiddlewareManager_getInstance)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_middleware_MiddlewareManager_finalize)

static bool js_cocos2dx_editor_support_MiddlewareManager_constructor(se::State& s)
{
    cocos2d::middleware::MiddlewareManager* cobj = new (std::nothrow) cocos2d::middleware::MiddlewareManager();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_editor_support_MiddlewareManager_constructor, __jsb_cocos2d_middleware_MiddlewareManager_class, js_cocos2d_middleware_MiddlewareManager_finalize)




static bool js_cocos2d_middleware_MiddlewareManager_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::middleware::MiddlewareManager)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::middleware::MiddlewareManager* cobj = (cocos2d::middleware::MiddlewareManager*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_middleware_MiddlewareManager_finalize)

bool js_register_cocos2dx_editor_support_MiddlewareManager(se::Object* obj)
{
    auto cls = se::Class::create("MiddlewareManager", obj, nullptr, _SE(js_cocos2dx_editor_support_MiddlewareManager_constructor));

    cls->defineFunction("getGLVBID", _SE(js_cocos2dx_editor_support_MiddlewareManager_getGLVBID));
    cls->defineFunction("update", _SE(js_cocos2dx_editor_support_MiddlewareManager_update));
    cls->defineFunction("getGLIBID", _SE(js_cocos2dx_editor_support_MiddlewareManager_getGLIBID));
    cls->defineStaticFunction("destroyInstance", _SE(js_cocos2dx_editor_support_MiddlewareManager_destroyInstance));
    cls->defineStaticFunction("getInstance", _SE(js_cocos2dx_editor_support_MiddlewareManager_getInstance));
    cls->defineFinalizeFunction(_SE(js_cocos2d_middleware_MiddlewareManager_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::middleware::MiddlewareManager>(cls);

    __jsb_cocos2d_middleware_MiddlewareManager_proto = cls->getProto();
    __jsb_cocos2d_middleware_MiddlewareManager_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_cocos2dx_editor_support(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("middleware", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("middleware", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_cocos2dx_editor_support_MiddlewareManager(ns);
    js_register_cocos2dx_editor_support_Texture2D(ns);
    return true;
}

#endif //#if USE_MIDDLEWARE > 0
