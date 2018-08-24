#include "scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "cocos2d.h"

se::Object* __jsb_cocos2d_SAXParser_proto = nullptr;
se::Class* __jsb_cocos2d_SAXParser_class = nullptr;

static bool js_cocos2dx_SAXParser_init(se::State& s)
{
    cocos2d::SAXParser* cobj = (cocos2d::SAXParser*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_SAXParser_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        SE_PRECONDITION2(ok, false, "js_cocos2dx_SAXParser_init : Error processing arguments");
        bool result = cobj->init(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_SAXParser_init : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_SAXParser_init)




bool js_register_cocos2dx_SAXParser(se::Object* obj)
{
    auto cls = se::Class::create("PlistParser", obj, nullptr, nullptr);

    cls->defineFunction("init", _SE(js_cocos2dx_SAXParser_init));
    cls->install();
    JSBClassType::registerClass<cocos2d::SAXParser>(cls);

    __jsb_cocos2d_SAXParser_proto = cls->getProto();
    __jsb_cocos2d_SAXParser_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_CanvasGradient_proto = nullptr;
se::Class* __jsb_cocos2d_CanvasGradient_class = nullptr;

static bool js_cocos2dx_CanvasGradient_addColorStop(se::State& s)
{
    cocos2d::CanvasGradient* cobj = (cocos2d::CanvasGradient*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_CanvasGradient_addColorStop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        std::string arg1;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_CanvasGradient_addColorStop : Error processing arguments");
        cobj->addColorStop(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_CanvasGradient_addColorStop)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_CanvasGradient_finalize)

static bool js_cocos2dx_CanvasGradient_constructor(se::State& s)
{
    cocos2d::CanvasGradient* cobj = new (std::nothrow) cocos2d::CanvasGradient();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_CanvasGradient_constructor, __jsb_cocos2d_CanvasGradient_class, js_cocos2d_CanvasGradient_finalize)




static bool js_cocos2d_CanvasGradient_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::CanvasGradient)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::CanvasGradient* cobj = (cocos2d::CanvasGradient*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_CanvasGradient_finalize)

bool js_register_cocos2dx_CanvasGradient(se::Object* obj)
{
    auto cls = se::Class::create("CanvasGradient", obj, nullptr, _SE(js_cocos2dx_CanvasGradient_constructor));

    cls->defineFunction("addColorStop", _SE(js_cocos2dx_CanvasGradient_addColorStop));
    cls->defineFinalizeFunction(_SE(js_cocos2d_CanvasGradient_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::CanvasGradient>(cls);

    __jsb_cocos2d_CanvasGradient_proto = cls->getProto();
    __jsb_cocos2d_CanvasGradient_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_cocos2dx(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("jsb", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("jsb", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_cocos2dx_CanvasGradient(ns);
    js_register_cocos2dx_SAXParser(ns);
    return true;
}

