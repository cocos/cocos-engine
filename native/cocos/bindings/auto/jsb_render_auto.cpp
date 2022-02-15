
// clang-format off
#include "cocos/bindings/auto/jsb_render_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "renderer/pipeline/custom/RenderInterfaceTypes.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_render_Pipeline_proto = nullptr; // NOLINT
se::Class* __jsb_cc_render_Pipeline_class = nullptr;  // NOLINT

static bool js_render_Pipeline_addRenderTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Pipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Pipeline_addRenderTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::gfx::Format, false> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        HolderType<unsigned int, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_Pipeline_addRenderTexture : Error processing arguments");
        unsigned int result = cobj->addRenderTexture(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_Pipeline_addRenderTexture : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_render_Pipeline_addRenderTexture)

bool js_register_render_Pipeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Pipeline", obj, nullptr, nullptr);

    cls->defineFunction("addRenderTexture", _SE(js_render_Pipeline_addRenderTexture));
    cls->install();
    JSBClassType::registerClass<cc::render::Pipeline>(cls);

    __jsb_cc_render_Pipeline_proto = cls->getProto();
    __jsb_cc_render_Pipeline_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
bool register_all_render(se::Object* obj)    // NOLINT
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("render", &nsVal, true))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("render", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_render_Pipeline(ns);
    return true;
}

// clang-format on