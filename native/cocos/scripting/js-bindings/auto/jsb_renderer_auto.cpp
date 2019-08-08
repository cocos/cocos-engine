#include "scripting/js-bindings/auto/jsb_renderer_auto.hpp"
#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "renderer/renderer/Renderer.h"
#include "renderer/scene/scene-bindings.h"

se::Object* __jsb_cocos2d_renderer_ProgramLib_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_ProgramLib_class = nullptr;

static bool js_renderer_ProgramLib_define(se::State& s)
{
    cocos2d::renderer::ProgramLib* cobj = (cocos2d::renderer::ProgramLib*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ProgramLib_define : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        cocos2d::ValueVector arg3;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        ok &= seval_to_ccvaluevector(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_renderer_ProgramLib_define : Error processing arguments");
        cobj->define(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_renderer_ProgramLib_define)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_ProgramLib_finalize)

static bool js_renderer_ProgramLib_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::renderer::DeviceGraphics* arg0 = nullptr;
    std::vector<cocos2d::renderer::ProgramLib::Template> arg1;
    ok &= seval_to_native_ptr(args[0], &arg0);
    ok &= seval_to_std_vector_ProgramLib_Template(args[1], &arg1);
    SE_PRECONDITION2(ok, false, "js_renderer_ProgramLib_constructor : Error processing arguments");
    cocos2d::renderer::ProgramLib* cobj = new (std::nothrow) cocos2d::renderer::ProgramLib(arg0, arg1);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_ProgramLib_constructor, __jsb_cocos2d_renderer_ProgramLib_class, js_cocos2d_renderer_ProgramLib_finalize)




static bool js_cocos2d_renderer_ProgramLib_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::ProgramLib)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::renderer::ProgramLib* cobj = (cocos2d::renderer::ProgramLib*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_ProgramLib_finalize)

bool js_register_renderer_ProgramLib(se::Object* obj)
{
    auto cls = se::Class::create("ProgramLib", obj, nullptr, _SE(js_renderer_ProgramLib_constructor));

    cls->defineFunction("define", _SE(js_renderer_ProgramLib_define));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_ProgramLib_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::ProgramLib>(cls);

    __jsb_cocos2d_renderer_ProgramLib_proto = cls->getProto();
    __jsb_cocos2d_renderer_ProgramLib_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_CustomProperties_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_CustomProperties_class = nullptr;

static bool js_renderer_CustomProperties_define(se::State& s)
{
    cocos2d::renderer::CustomProperties* cobj = (cocos2d::renderer::CustomProperties*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_CustomProperties_define : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        cocos2d::Value arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_ccvalue(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_CustomProperties_define : Error processing arguments");
        cobj->define(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_CustomProperties_define)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_CustomProperties_finalize)

static bool js_renderer_CustomProperties_constructor(se::State& s)
{
    cocos2d::renderer::CustomProperties* cobj = new (std::nothrow) cocos2d::renderer::CustomProperties();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_CustomProperties_constructor, __jsb_cocos2d_renderer_CustomProperties_class, js_cocos2d_renderer_CustomProperties_finalize)




static bool js_cocos2d_renderer_CustomProperties_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::CustomProperties)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::renderer::CustomProperties* cobj = (cocos2d::renderer::CustomProperties*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_CustomProperties_finalize)

bool js_register_renderer_CustomProperties(se::Object* obj)
{
    auto cls = se::Class::create("CustomProperties", obj, nullptr, _SE(js_renderer_CustomProperties_constructor));

    cls->defineFunction("define", _SE(js_renderer_CustomProperties_define));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_CustomProperties_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::CustomProperties>(cls);

    __jsb_cocos2d_renderer_CustomProperties_proto = cls->getProto();
    __jsb_cocos2d_renderer_CustomProperties_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_Pass_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_Pass_class = nullptr;

static bool js_renderer_Pass_getStencilTest(se::State& s)
{
    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Pass_getStencilTest : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getStencilTest();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_getStencilTest : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Pass_getStencilTest)

static bool js_renderer_Pass_setStencilBack(se::State& s)
{
    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Pass_setStencilBack : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->setStencilBack();
        return true;
    }
    if (argc == 1) {
        cocos2d::renderer::ComparisonFunc arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilBack : Error processing arguments");
        cobj->setStencilBack(arg0);
        return true;
    }
    if (argc == 2) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilBack : Error processing arguments");
        cobj->setStencilBack(arg0, arg1);
        return true;
    }
    if (argc == 3) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilBack : Error processing arguments");
        cobj->setStencilBack(arg0, arg1, arg2);
        return true;
    }
    if (argc == 4) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        cocos2d::renderer::StencilOp arg3;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilBack : Error processing arguments");
        cobj->setStencilBack(arg0, arg1, arg2, arg3);
        return true;
    }
    if (argc == 5) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        cocos2d::renderer::StencilOp arg3;
        cocos2d::renderer::StencilOp arg4;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilBack : Error processing arguments");
        cobj->setStencilBack(arg0, arg1, arg2, arg3, arg4);
        return true;
    }
    if (argc == 6) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        cocos2d::renderer::StencilOp arg3;
        cocos2d::renderer::StencilOp arg4;
        cocos2d::renderer::StencilOp arg5;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilBack : Error processing arguments");
        cobj->setStencilBack(arg0, arg1, arg2, arg3, arg4, arg5);
        return true;
    }
    if (argc == 7) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        cocos2d::renderer::StencilOp arg3;
        cocos2d::renderer::StencilOp arg4;
        cocos2d::renderer::StencilOp arg5;
        uint8_t arg6;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        ok &= seval_to_uint8(args[6], (uint8_t*)&arg6);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilBack : Error processing arguments");
        cobj->setStencilBack(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 7);
    return false;
}
SE_BIND_FUNC(js_renderer_Pass_setStencilBack)

static bool js_renderer_Pass_getProgramName(se::State& s)
{
    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Pass_getProgramName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getProgramName();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_getProgramName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Pass_getProgramName)

static bool js_renderer_Pass_setCullMode(se::State& s)
{
    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Pass_setCullMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::CullMode arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::CullMode)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setCullMode : Error processing arguments");
        cobj->setCullMode(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Pass_setCullMode)

static bool js_renderer_Pass_setBlend(se::State& s)
{
    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Pass_setBlend : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->setBlend();
        return true;
    }
    if (argc == 1) {
        cocos2d::renderer::BlendOp arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setBlend : Error processing arguments");
        cobj->setBlend(arg0);
        return true;
    }
    if (argc == 2) {
        cocos2d::renderer::BlendOp arg0;
        cocos2d::renderer::BlendFactor arg1;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setBlend : Error processing arguments");
        cobj->setBlend(arg0, arg1);
        return true;
    }
    if (argc == 3) {
        cocos2d::renderer::BlendOp arg0;
        cocos2d::renderer::BlendFactor arg1;
        cocos2d::renderer::BlendFactor arg2;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setBlend : Error processing arguments");
        cobj->setBlend(arg0, arg1, arg2);
        return true;
    }
    if (argc == 4) {
        cocos2d::renderer::BlendOp arg0;
        cocos2d::renderer::BlendFactor arg1;
        cocos2d::renderer::BlendFactor arg2;
        cocos2d::renderer::BlendOp arg3;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setBlend : Error processing arguments");
        cobj->setBlend(arg0, arg1, arg2, arg3);
        return true;
    }
    if (argc == 5) {
        cocos2d::renderer::BlendOp arg0;
        cocos2d::renderer::BlendFactor arg1;
        cocos2d::renderer::BlendFactor arg2;
        cocos2d::renderer::BlendOp arg3;
        cocos2d::renderer::BlendFactor arg4;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setBlend : Error processing arguments");
        cobj->setBlend(arg0, arg1, arg2, arg3, arg4);
        return true;
    }
    if (argc == 6) {
        cocos2d::renderer::BlendOp arg0;
        cocos2d::renderer::BlendFactor arg1;
        cocos2d::renderer::BlendFactor arg2;
        cocos2d::renderer::BlendOp arg3;
        cocos2d::renderer::BlendFactor arg4;
        cocos2d::renderer::BlendFactor arg5;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setBlend : Error processing arguments");
        cobj->setBlend(arg0, arg1, arg2, arg3, arg4, arg5);
        return true;
    }
    if (argc == 7) {
        cocos2d::renderer::BlendOp arg0;
        cocos2d::renderer::BlendFactor arg1;
        cocos2d::renderer::BlendFactor arg2;
        cocos2d::renderer::BlendOp arg3;
        cocos2d::renderer::BlendFactor arg4;
        cocos2d::renderer::BlendFactor arg5;
        unsigned int arg6 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setBlend : Error processing arguments");
        cobj->setBlend(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 7);
    return false;
}
SE_BIND_FUNC(js_renderer_Pass_setBlend)

static bool js_renderer_Pass_setProgramName(se::State& s)
{
    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Pass_setProgramName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setProgramName : Error processing arguments");
        cobj->setProgramName(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Pass_setProgramName)

static bool js_renderer_Pass_disableStencilTest(se::State& s)
{
    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Pass_disableStencilTest : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->disableStencilTest();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Pass_disableStencilTest)

static bool js_renderer_Pass_setStencilFront(se::State& s)
{
    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Pass_setStencilFront : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->setStencilFront();
        return true;
    }
    if (argc == 1) {
        cocos2d::renderer::ComparisonFunc arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilFront : Error processing arguments");
        cobj->setStencilFront(arg0);
        return true;
    }
    if (argc == 2) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilFront : Error processing arguments");
        cobj->setStencilFront(arg0, arg1);
        return true;
    }
    if (argc == 3) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilFront : Error processing arguments");
        cobj->setStencilFront(arg0, arg1, arg2);
        return true;
    }
    if (argc == 4) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        cocos2d::renderer::StencilOp arg3;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilFront : Error processing arguments");
        cobj->setStencilFront(arg0, arg1, arg2, arg3);
        return true;
    }
    if (argc == 5) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        cocos2d::renderer::StencilOp arg3;
        cocos2d::renderer::StencilOp arg4;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilFront : Error processing arguments");
        cobj->setStencilFront(arg0, arg1, arg2, arg3, arg4);
        return true;
    }
    if (argc == 6) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        cocos2d::renderer::StencilOp arg3;
        cocos2d::renderer::StencilOp arg4;
        cocos2d::renderer::StencilOp arg5;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilFront : Error processing arguments");
        cobj->setStencilFront(arg0, arg1, arg2, arg3, arg4, arg5);
        return true;
    }
    if (argc == 7) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        cocos2d::renderer::StencilOp arg3;
        cocos2d::renderer::StencilOp arg4;
        cocos2d::renderer::StencilOp arg5;
        uint8_t arg6;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        ok &= seval_to_uint8(args[6], (uint8_t*)&arg6);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setStencilFront : Error processing arguments");
        cobj->setStencilFront(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 7);
    return false;
}
SE_BIND_FUNC(js_renderer_Pass_setStencilFront)

static bool js_renderer_Pass_setDepth(se::State& s)
{
    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Pass_setDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->setDepth();
        return true;
    }
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setDepth : Error processing arguments");
        cobj->setDepth(arg0);
        return true;
    }
    if (argc == 2) {
        bool arg0;
        bool arg1;
        ok &= seval_to_boolean(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setDepth : Error processing arguments");
        cobj->setDepth(arg0, arg1);
        return true;
    }
    if (argc == 3) {
        bool arg0;
        bool arg1;
        cocos2d::renderer::ComparisonFunc arg2;
        ok &= seval_to_boolean(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Pass_setDepth : Error processing arguments");
        cobj->setDepth(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_renderer_Pass_setDepth)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_Pass_finalize)

static bool js_renderer_Pass_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            cocos2d::renderer::Pass* cobj = new (std::nothrow) cocos2d::renderer::Pass();
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 1) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::renderer::Pass* cobj = new (std::nothrow) cocos2d::renderer::Pass(arg0);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_renderer_Pass_constructor, __jsb_cocos2d_renderer_Pass_class, js_cocos2d_renderer_Pass_finalize)




static bool js_cocos2d_renderer_Pass_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::Pass)", s.nativeThisObject());
    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_Pass_finalize)

bool js_register_renderer_Pass(se::Object* obj)
{
    auto cls = se::Class::create("PassNative", obj, nullptr, _SE(js_renderer_Pass_constructor));

    cls->defineFunction("getStencilTest", _SE(js_renderer_Pass_getStencilTest));
    cls->defineFunction("setStencilBack", _SE(js_renderer_Pass_setStencilBack));
    cls->defineFunction("getProgramName", _SE(js_renderer_Pass_getProgramName));
    cls->defineFunction("setCullMode", _SE(js_renderer_Pass_setCullMode));
    cls->defineFunction("setBlend", _SE(js_renderer_Pass_setBlend));
    cls->defineFunction("setProgramName", _SE(js_renderer_Pass_setProgramName));
    cls->defineFunction("disableStencilTest", _SE(js_renderer_Pass_disableStencilTest));
    cls->defineFunction("setStencilFront", _SE(js_renderer_Pass_setStencilFront));
    cls->defineFunction("setDepth", _SE(js_renderer_Pass_setDepth));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_Pass_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::Pass>(cls);

    __jsb_cocos2d_renderer_Pass_proto = cls->getProto();
    __jsb_cocos2d_renderer_Pass_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_Effect_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_Effect_class = nullptr;

static bool js_renderer_Effect_getProperty(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_getProperty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_getProperty : Error processing arguments");
        const cocos2d::renderer::Technique::Parameter& result = cobj->getProperty(arg0);
        ok &= TechniqueParameter_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_getProperty : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_getProperty)

static bool js_renderer_Effect_setStencilTest(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_setStencilTest : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_setStencilTest : Error processing arguments");
        cobj->setStencilTest(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_setStencilTest)

static bool js_renderer_Effect_getTechnique(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_getTechnique : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_getTechnique : Error processing arguments");
        cocos2d::renderer::Technique* result = cobj->getTechnique(arg0);
        ok &= native_ptr_to_seval<cocos2d::renderer::Technique>((cocos2d::renderer::Technique*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_getTechnique : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_getTechnique)

static bool js_renderer_Effect_getDefine(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_getDefine : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_getDefine : Error processing arguments");
        cocos2d::Value result = cobj->getDefine(arg0);
        ok &= ccvalue_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_getDefine : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_getDefine)

static bool js_renderer_Effect_setCullMode(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_setCullMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::CullMode arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::CullMode)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_setCullMode : Error processing arguments");
        cobj->setCullMode(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_setCullMode)

static bool js_renderer_Effect_setStencil(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_setStencil : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->setStencil();
        return true;
    }
    if (argc == 1) {
        cocos2d::renderer::ComparisonFunc arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_setStencil : Error processing arguments");
        cobj->setStencil(arg0);
        return true;
    }
    if (argc == 2) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_setStencil : Error processing arguments");
        cobj->setStencil(arg0, arg1);
        return true;
    }
    if (argc == 3) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_setStencil : Error processing arguments");
        cobj->setStencil(arg0, arg1, arg2);
        return true;
    }
    if (argc == 4) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        cocos2d::renderer::StencilOp arg3;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_setStencil : Error processing arguments");
        cobj->setStencil(arg0, arg1, arg2, arg3);
        return true;
    }
    if (argc == 5) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        cocos2d::renderer::StencilOp arg3;
        cocos2d::renderer::StencilOp arg4;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_setStencil : Error processing arguments");
        cobj->setStencil(arg0, arg1, arg2, arg3, arg4);
        return true;
    }
    if (argc == 6) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        cocos2d::renderer::StencilOp arg3;
        cocos2d::renderer::StencilOp arg4;
        cocos2d::renderer::StencilOp arg5;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_setStencil : Error processing arguments");
        cobj->setStencil(arg0, arg1, arg2, arg3, arg4, arg5);
        return true;
    }
    if (argc == 7) {
        cocos2d::renderer::ComparisonFunc arg0;
        unsigned int arg1 = 0;
        uint8_t arg2;
        cocos2d::renderer::StencilOp arg3;
        cocos2d::renderer::StencilOp arg4;
        cocos2d::renderer::StencilOp arg5;
        uint8_t arg6;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ComparisonFunc)tmp; } while(false);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::renderer::StencilOp)tmp; } while(false);
        ok &= seval_to_uint8(args[6], (uint8_t*)&arg6);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_setStencil : Error processing arguments");
        cobj->setStencil(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 7);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_setStencil)

static bool js_renderer_Effect_setBlend(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_setBlend : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->setBlend();
        return true;
    }
    if (argc == 1) {
        cocos2d::renderer::BlendOp arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_setBlend : Error processing arguments");
        cobj->setBlend(arg0);
        return true;
    }
    if (argc == 2) {
        cocos2d::renderer::BlendOp arg0;
        cocos2d::renderer::BlendFactor arg1;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_setBlend : Error processing arguments");
        cobj->setBlend(arg0, arg1);
        return true;
    }
    if (argc == 3) {
        cocos2d::renderer::BlendOp arg0;
        cocos2d::renderer::BlendFactor arg1;
        cocos2d::renderer::BlendFactor arg2;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_setBlend : Error processing arguments");
        cobj->setBlend(arg0, arg1, arg2);
        return true;
    }
    if (argc == 4) {
        cocos2d::renderer::BlendOp arg0;
        cocos2d::renderer::BlendFactor arg1;
        cocos2d::renderer::BlendFactor arg2;
        cocos2d::renderer::BlendOp arg3;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_setBlend : Error processing arguments");
        cobj->setBlend(arg0, arg1, arg2, arg3);
        return true;
    }
    if (argc == 5) {
        cocos2d::renderer::BlendOp arg0;
        cocos2d::renderer::BlendFactor arg1;
        cocos2d::renderer::BlendFactor arg2;
        cocos2d::renderer::BlendOp arg3;
        cocos2d::renderer::BlendFactor arg4;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_setBlend : Error processing arguments");
        cobj->setBlend(arg0, arg1, arg2, arg3, arg4);
        return true;
    }
    if (argc == 6) {
        cocos2d::renderer::BlendOp arg0;
        cocos2d::renderer::BlendFactor arg1;
        cocos2d::renderer::BlendFactor arg2;
        cocos2d::renderer::BlendOp arg3;
        cocos2d::renderer::BlendFactor arg4;
        cocos2d::renderer::BlendFactor arg5;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_setBlend : Error processing arguments");
        cobj->setBlend(arg0, arg1, arg2, arg3, arg4, arg5);
        return true;
    }
    if (argc == 7) {
        cocos2d::renderer::BlendOp arg0;
        cocos2d::renderer::BlendFactor arg1;
        cocos2d::renderer::BlendFactor arg2;
        cocos2d::renderer::BlendOp arg3;
        cocos2d::renderer::BlendFactor arg4;
        cocos2d::renderer::BlendFactor arg5;
        unsigned int arg6 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (cocos2d::renderer::BlendOp)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[5], &tmp); arg5 = (cocos2d::renderer::BlendFactor)tmp; } while(false);
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_setBlend : Error processing arguments");
        cobj->setBlend(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 7);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_setBlend)

static bool js_renderer_Effect_getHash(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_getHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        double result = cobj->getHash();
        ok &= double_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_getHash : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_getHash)

static bool js_renderer_Effect_updateHash(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_updateHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        double arg0 = 0;
        ok &= seval_to_double(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_updateHash : Error processing arguments");
        cobj->updateHash(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_updateHash)

static bool js_renderer_Effect_copy(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_copy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const cocos2d::renderer::Effect* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_copy : Error processing arguments");
        cobj->copy(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_copy)

static bool js_renderer_Effect_clear(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_clear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clear();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_clear)

static bool js_renderer_Effect_define(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_define : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        cocos2d::Value arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_ccvalue(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_define : Error processing arguments");
        cobj->define(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_define)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_Effect_finalize)

static bool js_renderer_Effect_constructor(se::State& s)
{
    cocos2d::renderer::Effect* cobj = new (std::nothrow) cocos2d::renderer::Effect();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_Effect_constructor, __jsb_cocos2d_renderer_Effect_class, js_cocos2d_renderer_Effect_finalize)




static bool js_cocos2d_renderer_Effect_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::Effect)", s.nativeThisObject());
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_Effect_finalize)

bool js_register_renderer_Effect(se::Object* obj)
{
    auto cls = se::Class::create("EffectNative", obj, nullptr, _SE(js_renderer_Effect_constructor));

    cls->defineFunction("getProperty", _SE(js_renderer_Effect_getProperty));
    cls->defineFunction("setStencilTest", _SE(js_renderer_Effect_setStencilTest));
    cls->defineFunction("getTechnique", _SE(js_renderer_Effect_getTechnique));
    cls->defineFunction("getDefine", _SE(js_renderer_Effect_getDefine));
    cls->defineFunction("setCullMode", _SE(js_renderer_Effect_setCullMode));
    cls->defineFunction("setStencil", _SE(js_renderer_Effect_setStencil));
    cls->defineFunction("setBlend", _SE(js_renderer_Effect_setBlend));
    cls->defineFunction("getHash", _SE(js_renderer_Effect_getHash));
    cls->defineFunction("updateHash", _SE(js_renderer_Effect_updateHash));
    cls->defineFunction("copy", _SE(js_renderer_Effect_copy));
    cls->defineFunction("clear", _SE(js_renderer_Effect_clear));
    cls->defineFunction("define", _SE(js_renderer_Effect_define));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_Effect_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::Effect>(cls);

    __jsb_cocos2d_renderer_Effect_proto = cls->getProto();
    __jsb_cocos2d_renderer_Effect_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_AssemblerBase_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_AssemblerBase_class = nullptr;

static bool js_renderer_AssemblerBase_disableDirty(se::State& s)
{
    cocos2d::renderer::AssemblerBase* cobj = (cocos2d::renderer::AssemblerBase*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_AssemblerBase_disableDirty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_AssemblerBase_disableDirty : Error processing arguments");
        cobj->disableDirty(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_AssemblerBase_disableDirty)

static bool js_renderer_AssemblerBase_reset(se::State& s)
{
    cocos2d::renderer::AssemblerBase* cobj = (cocos2d::renderer::AssemblerBase*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_AssemblerBase_reset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->reset();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_AssemblerBase_reset)

static bool js_renderer_AssemblerBase_setUseModel(se::State& s)
{
    cocos2d::renderer::AssemblerBase* cobj = (cocos2d::renderer::AssemblerBase*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_AssemblerBase_setUseModel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_AssemblerBase_setUseModel : Error processing arguments");
        cobj->setUseModel(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_AssemblerBase_setUseModel)

static bool js_renderer_AssemblerBase_isDirty(se::State& s)
{
    cocos2d::renderer::AssemblerBase* cobj = (cocos2d::renderer::AssemblerBase*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_AssemblerBase_isDirty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_AssemblerBase_isDirty : Error processing arguments");
        bool result = cobj->isDirty(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_AssemblerBase_isDirty : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_AssemblerBase_isDirty)

static bool js_renderer_AssemblerBase_setDirty(se::State& s)
{
    cocos2d::renderer::AssemblerBase* cobj = (cocos2d::renderer::AssemblerBase*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_AssemblerBase_setDirty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        se_object_ptr arg0 = nullptr;
        arg0 = args[0].toObject();
        SE_PRECONDITION2(ok, false, "js_renderer_AssemblerBase_setDirty : Error processing arguments");
        cobj->setDirty(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_AssemblerBase_setDirty)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_AssemblerBase_finalize)

static bool js_renderer_AssemblerBase_constructor(se::State& s)
{
    cocos2d::renderer::AssemblerBase* cobj = new (std::nothrow) cocos2d::renderer::AssemblerBase();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_AssemblerBase_constructor, __jsb_cocos2d_renderer_AssemblerBase_class, js_cocos2d_renderer_AssemblerBase_finalize)

static bool js_renderer_AssemblerBase_ctor(se::State& s)
{
    cocos2d::renderer::AssemblerBase* cobj = new (std::nothrow) cocos2d::renderer::AssemblerBase();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_renderer_AssemblerBase_ctor, __jsb_cocos2d_renderer_AssemblerBase_class, js_cocos2d_renderer_AssemblerBase_finalize)


    


static bool js_cocos2d_renderer_AssemblerBase_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::AssemblerBase)", s.nativeThisObject());
    cocos2d::renderer::AssemblerBase* cobj = (cocos2d::renderer::AssemblerBase*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_AssemblerBase_finalize)

bool js_register_renderer_AssemblerBase(se::Object* obj)
{
    auto cls = se::Class::create("AssemblerBase", obj, nullptr, _SE(js_renderer_AssemblerBase_constructor));

    cls->defineFunction("disableDirty", _SE(js_renderer_AssemblerBase_disableDirty));
    cls->defineFunction("reset", _SE(js_renderer_AssemblerBase_reset));
    cls->defineFunction("setUseModel", _SE(js_renderer_AssemblerBase_setUseModel));
    cls->defineFunction("isDirty", _SE(js_renderer_AssemblerBase_isDirty));
    cls->defineFunction("setDirty", _SE(js_renderer_AssemblerBase_setDirty));
    cls->defineFunction("ctor", _SE(js_renderer_AssemblerBase_ctor));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_AssemblerBase_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::AssemblerBase>(cls);

    __jsb_cocos2d_renderer_AssemblerBase_proto = cls->getProto();
    __jsb_cocos2d_renderer_AssemblerBase_class = cls;

    jsb_set_extend_property("renderer", "AssemblerBase");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_MemPool_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_MemPool_class = nullptr;

static bool js_renderer_MemPool_removeCommonData(se::State& s)
{
    cocos2d::renderer::MemPool* cobj = (cocos2d::renderer::MemPool*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MemPool_removeCommonData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        size_t arg0 = 0;
        ok &= seval_to_size(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_MemPool_removeCommonData : Error processing arguments");
        cobj->removeCommonData(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_MemPool_removeCommonData)

static bool js_renderer_MemPool_updateCommonData(se::State& s)
{
    cocos2d::renderer::MemPool* cobj = (cocos2d::renderer::MemPool*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MemPool_updateCommonData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        size_t arg0 = 0;
        se_object_ptr arg1 = nullptr;
        se_object_ptr arg2 = nullptr;
        ok &= seval_to_size(args[0], &arg0);
        arg1 = args[1].toObject();
        arg2 = args[2].toObject();
        SE_PRECONDITION2(ok, false, "js_renderer_MemPool_updateCommonData : Error processing arguments");
        cobj->updateCommonData(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_renderer_MemPool_updateCommonData)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_MemPool_finalize)

static bool js_renderer_MemPool_constructor(se::State& s)
{
    cocos2d::renderer::MemPool* cobj = new (std::nothrow) cocos2d::renderer::MemPool();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_MemPool_constructor, __jsb_cocos2d_renderer_MemPool_class, js_cocos2d_renderer_MemPool_finalize)




static bool js_cocos2d_renderer_MemPool_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::MemPool)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::renderer::MemPool* cobj = (cocos2d::renderer::MemPool*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_MemPool_finalize)

bool js_register_renderer_MemPool(se::Object* obj)
{
    auto cls = se::Class::create("MemPool", obj, nullptr, _SE(js_renderer_MemPool_constructor));

    cls->defineFunction("removeCommonData", _SE(js_renderer_MemPool_removeCommonData));
    cls->defineFunction("updateCommonData", _SE(js_renderer_MemPool_updateCommonData));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_MemPool_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::MemPool>(cls);

    __jsb_cocos2d_renderer_MemPool_proto = cls->getProto();
    __jsb_cocos2d_renderer_MemPool_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_NodeProxy_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_NodeProxy_class = nullptr;

static bool js_renderer_NodeProxy_disableVisit(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_disableVisit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->disableVisit();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_disableVisit)

static bool js_renderer_NodeProxy_notifyUpdateParent(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_notifyUpdateParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->notifyUpdateParent();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_notifyUpdateParent)

static bool js_renderer_NodeProxy_destroyImmediately(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_destroyImmediately : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroyImmediately();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_destroyImmediately)

static bool js_renderer_NodeProxy_enableVisit(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_enableVisit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->enableVisit();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_enableVisit)

static bool js_renderer_NodeProxy_setName(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_setName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_setName : Error processing arguments");
        cobj->setName(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_setName)

static bool js_renderer_NodeProxy_clearAssembler(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_clearAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clearAssembler();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_clearAssembler)

static bool js_renderer_NodeProxy_setAssembler(se::State& s)
{
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeProxy_setAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::AssemblerBase* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_setAssembler : Error processing arguments");
        cobj->setAssembler(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeProxy_setAssembler)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_NodeProxy_finalize)

static bool js_renderer_NodeProxy_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t arg0 = 0;
    size_t arg1 = 0;
    std::string arg2;
    std::string arg3;
    ok &= seval_to_size(args[0], &arg0);
    ok &= seval_to_size(args[1], &arg1);
    ok &= seval_to_std_string(args[2], &arg2);
    ok &= seval_to_std_string(args[3], &arg3);
    SE_PRECONDITION2(ok, false, "js_renderer_NodeProxy_constructor : Error processing arguments");
    cocos2d::renderer::NodeProxy* cobj = new (std::nothrow) cocos2d::renderer::NodeProxy(arg0, arg1, arg2, arg3);
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_NodeProxy_constructor, __jsb_cocos2d_renderer_NodeProxy_class, js_cocos2d_renderer_NodeProxy_finalize)




static bool js_cocos2d_renderer_NodeProxy_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::NodeProxy)", s.nativeThisObject());
    cocos2d::renderer::NodeProxy* cobj = (cocos2d::renderer::NodeProxy*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_NodeProxy_finalize)

bool js_register_renderer_NodeProxy(se::Object* obj)
{
    auto cls = se::Class::create("NodeProxy", obj, nullptr, _SE(js_renderer_NodeProxy_constructor));

    cls->defineFunction("disableVisit", _SE(js_renderer_NodeProxy_disableVisit));
    cls->defineFunction("notifyUpdateParent", _SE(js_renderer_NodeProxy_notifyUpdateParent));
    cls->defineFunction("destroyImmediately", _SE(js_renderer_NodeProxy_destroyImmediately));
    cls->defineFunction("enableVisit", _SE(js_renderer_NodeProxy_enableVisit));
    cls->defineFunction("setName", _SE(js_renderer_NodeProxy_setName));
    cls->defineFunction("clearAssembler", _SE(js_renderer_NodeProxy_clearAssembler));
    cls->defineFunction("setAssembler", _SE(js_renderer_NodeProxy_setAssembler));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_NodeProxy_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::NodeProxy>(cls);

    __jsb_cocos2d_renderer_NodeProxy_proto = cls->getProto();
    __jsb_cocos2d_renderer_NodeProxy_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_BaseRenderer_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_BaseRenderer_class = nullptr;

static bool js_renderer_BaseRenderer_getProgramLib(se::State& s)
{
    cocos2d::renderer::BaseRenderer* cobj = (cocos2d::renderer::BaseRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_BaseRenderer_getProgramLib : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::renderer::ProgramLib* result = cobj->getProgramLib();
        ok &= native_ptr_to_seval<cocos2d::renderer::ProgramLib>((cocos2d::renderer::ProgramLib*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_BaseRenderer_getProgramLib : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_BaseRenderer_getProgramLib)

static bool js_renderer_BaseRenderer_init(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::renderer::BaseRenderer* cobj = (cocos2d::renderer::BaseRenderer*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_renderer_BaseRenderer_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 3) {
            cocos2d::renderer::DeviceGraphics* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::vector<cocos2d::renderer::ProgramLib::Template> arg1;
            ok &= seval_to_std_vector_ProgramLib_Template(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::renderer::Texture2D* arg2 = nullptr;
            ok &= seval_to_native_ptr(args[2], &arg2);
            if (!ok) { ok = true; break; }
            bool result = cobj->init(arg0, arg1, arg2);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_renderer_BaseRenderer_init : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            cocos2d::renderer::DeviceGraphics* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::vector<cocos2d::renderer::ProgramLib::Template> arg1;
            ok &= seval_to_std_vector_ProgramLib_Template(args[1], &arg1);
            if (!ok) { ok = true; break; }
            bool result = cobj->init(arg0, arg1);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_renderer_BaseRenderer_init : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_renderer_BaseRenderer_init)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_BaseRenderer_finalize)

static bool js_renderer_BaseRenderer_constructor(se::State& s)
{
    cocos2d::renderer::BaseRenderer* cobj = new (std::nothrow) cocos2d::renderer::BaseRenderer();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_BaseRenderer_constructor, __jsb_cocos2d_renderer_BaseRenderer_class, js_cocos2d_renderer_BaseRenderer_finalize)




static bool js_cocos2d_renderer_BaseRenderer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::BaseRenderer)", s.nativeThisObject());
    cocos2d::renderer::BaseRenderer* cobj = (cocos2d::renderer::BaseRenderer*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_BaseRenderer_finalize)

bool js_register_renderer_BaseRenderer(se::Object* obj)
{
    auto cls = se::Class::create("Base", obj, nullptr, _SE(js_renderer_BaseRenderer_constructor));

    cls->defineFunction("getProgramLib", _SE(js_renderer_BaseRenderer_getProgramLib));
    cls->defineFunction("init", _SE(js_renderer_BaseRenderer_init));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_BaseRenderer_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::BaseRenderer>(cls);

    __jsb_cocos2d_renderer_BaseRenderer_proto = cls->getProto();
    __jsb_cocos2d_renderer_BaseRenderer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_View_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_View_class = nullptr;

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_View_finalize)

static bool js_renderer_View_constructor(se::State& s)
{
    cocos2d::renderer::View* cobj = new (std::nothrow) cocos2d::renderer::View();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_View_constructor, __jsb_cocos2d_renderer_View_class, js_cocos2d_renderer_View_finalize)




static bool js_cocos2d_renderer_View_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::View)", s.nativeThisObject());
    cocos2d::renderer::View* cobj = (cocos2d::renderer::View*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_View_finalize)

bool js_register_renderer_View(se::Object* obj)
{
    auto cls = se::Class::create("View", obj, nullptr, _SE(js_renderer_View_constructor));

    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_View_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::View>(cls);

    __jsb_cocos2d_renderer_View_proto = cls->getProto();
    __jsb_cocos2d_renderer_View_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_Camera_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_Camera_class = nullptr;

static bool js_renderer_Camera_getDepth(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getDepth();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getDepth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getDepth)

static bool js_renderer_Camera_setFov(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setFov : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setFov : Error processing arguments");
        cobj->setFov(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setFov)

static bool js_renderer_Camera_getFrameBuffer(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getFrameBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::renderer::FrameBuffer* result = cobj->getFrameBuffer();
        ok &= native_ptr_to_seval<cocos2d::renderer::FrameBuffer>((cocos2d::renderer::FrameBuffer*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getFrameBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getFrameBuffer)

static bool js_renderer_Camera_setStencil(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setStencil : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setStencil : Error processing arguments");
        cobj->setStencil(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setStencil)

static bool js_renderer_Camera_setPriority(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setPriority : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setPriority : Error processing arguments");
        cobj->setPriority(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setPriority)

static bool js_renderer_Camera_getOrthoHeight(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getOrthoHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getOrthoHeight();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getOrthoHeight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getOrthoHeight)

static bool js_renderer_Camera_setCullingMask(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setCullingMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setCullingMask : Error processing arguments");
        cobj->setCullingMask(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setCullingMask)

static bool js_renderer_Camera_getStencil(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getStencil : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getStencil();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getStencil : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getStencil)

static bool js_renderer_Camera_setType(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::ProjectionType arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::ProjectionType)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setType : Error processing arguments");
        cobj->setType(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setType)

static bool js_renderer_Camera_getPriority(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getPriority : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPriority();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getPriority : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getPriority)

static bool js_renderer_Camera_setFar(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setFar : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setFar : Error processing arguments");
        cobj->setFar(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setFar)

static bool js_renderer_Camera_setFrameBuffer(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setFrameBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::FrameBuffer* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setFrameBuffer : Error processing arguments");
        cobj->setFrameBuffer(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setFrameBuffer)

static bool js_renderer_Camera_setRect(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setRect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setRect : Error processing arguments");
        cobj->setRect(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setRect)

static bool js_renderer_Camera_setClearFlags(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setClearFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        uint8_t arg0;
        ok &= seval_to_uint8(args[0], (uint8_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setClearFlags : Error processing arguments");
        cobj->setClearFlags(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setClearFlags)

static bool js_renderer_Camera_getFar(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getFar : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFar();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getFar : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getFar)

static bool js_renderer_Camera_getType(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getType)

static bool js_renderer_Camera_getCullingMask(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getCullingMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getCullingMask();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getCullingMask : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getCullingMask)

static bool js_renderer_Camera_setNear(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setNear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setNear : Error processing arguments");
        cobj->setNear(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setNear)

static bool js_renderer_Camera_setStages(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setStages : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::vector<std::string> arg0;
        ok &= seval_to_std_vector_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setStages : Error processing arguments");
        cobj->setStages(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setStages)

static bool js_renderer_Camera_setOrthoHeight(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setOrthoHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setOrthoHeight : Error processing arguments");
        cobj->setOrthoHeight(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setOrthoHeight)

static bool js_renderer_Camera_setDepth(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setDepth : Error processing arguments");
        cobj->setDepth(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setDepth)

static bool js_renderer_Camera_getStages(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getStages : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<std::string>& result = cobj->getStages();
        ok &= std_vector_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getStages : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getStages)

static bool js_renderer_Camera_getFov(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getFov : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFov();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getFov : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getFov)

static bool js_renderer_Camera_setColor(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setColor : Error processing arguments");
        cobj->setColor(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setColor)

static bool js_renderer_Camera_setWorldMatrix(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setWorldMatrix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Mat4 arg0;
        ok &= seval_to_Mat4(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setWorldMatrix : Error processing arguments");
        cobj->setWorldMatrix(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setWorldMatrix)

static bool js_renderer_Camera_getNear(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getNear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getNear();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getNear : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getNear)

static bool js_renderer_Camera_getClearFlags(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getClearFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uint8_t result = cobj->getClearFlags();
        ok &= uint8_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_getClearFlags : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getClearFlags)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_Camera_finalize)

static bool js_renderer_Camera_constructor(se::State& s)
{
    cocos2d::renderer::Camera* cobj = new (std::nothrow) cocos2d::renderer::Camera();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_Camera_constructor, __jsb_cocos2d_renderer_Camera_class, js_cocos2d_renderer_Camera_finalize)




static bool js_cocos2d_renderer_Camera_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::Camera)", s.nativeThisObject());
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_Camera_finalize)

bool js_register_renderer_Camera(se::Object* obj)
{
    auto cls = se::Class::create("Camera", obj, nullptr, _SE(js_renderer_Camera_constructor));

    cls->defineFunction("getDepth", _SE(js_renderer_Camera_getDepth));
    cls->defineFunction("setFov", _SE(js_renderer_Camera_setFov));
    cls->defineFunction("getFrameBuffer", _SE(js_renderer_Camera_getFrameBuffer));
    cls->defineFunction("setStencil", _SE(js_renderer_Camera_setStencil));
    cls->defineFunction("setPriority", _SE(js_renderer_Camera_setPriority));
    cls->defineFunction("getOrthoHeight", _SE(js_renderer_Camera_getOrthoHeight));
    cls->defineFunction("setCullingMask", _SE(js_renderer_Camera_setCullingMask));
    cls->defineFunction("getStencil", _SE(js_renderer_Camera_getStencil));
    cls->defineFunction("setType", _SE(js_renderer_Camera_setType));
    cls->defineFunction("getPriority", _SE(js_renderer_Camera_getPriority));
    cls->defineFunction("setFar", _SE(js_renderer_Camera_setFar));
    cls->defineFunction("setFrameBuffer", _SE(js_renderer_Camera_setFrameBuffer));
    cls->defineFunction("setRect", _SE(js_renderer_Camera_setRect));
    cls->defineFunction("setClearFlags", _SE(js_renderer_Camera_setClearFlags));
    cls->defineFunction("getFar", _SE(js_renderer_Camera_getFar));
    cls->defineFunction("getType", _SE(js_renderer_Camera_getType));
    cls->defineFunction("getCullingMask", _SE(js_renderer_Camera_getCullingMask));
    cls->defineFunction("setNear", _SE(js_renderer_Camera_setNear));
    cls->defineFunction("setStages", _SE(js_renderer_Camera_setStages));
    cls->defineFunction("setOrthoHeight", _SE(js_renderer_Camera_setOrthoHeight));
    cls->defineFunction("setDepth", _SE(js_renderer_Camera_setDepth));
    cls->defineFunction("getStages", _SE(js_renderer_Camera_getStages));
    cls->defineFunction("getFov", _SE(js_renderer_Camera_getFov));
    cls->defineFunction("setColor", _SE(js_renderer_Camera_setColor));
    cls->defineFunction("setWorldMatrix", _SE(js_renderer_Camera_setWorldMatrix));
    cls->defineFunction("getNear", _SE(js_renderer_Camera_getNear));
    cls->defineFunction("getClearFlags", _SE(js_renderer_Camera_getClearFlags));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_Camera_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::Camera>(cls);

    __jsb_cocos2d_renderer_Camera_proto = cls->getProto();
    __jsb_cocos2d_renderer_Camera_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_ForwardRenderer_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_ForwardRenderer_class = nullptr;

static bool js_renderer_ForwardRenderer_renderCamera(se::State& s)
{
    cocos2d::renderer::ForwardRenderer* cobj = (cocos2d::renderer::ForwardRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ForwardRenderer_renderCamera : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::renderer::Camera* arg0 = nullptr;
        cocos2d::renderer::Scene* arg1 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_ForwardRenderer_renderCamera : Error processing arguments");
        cobj->renderCamera(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_ForwardRenderer_renderCamera)

static bool js_renderer_ForwardRenderer_init(se::State& s)
{
    cocos2d::renderer::ForwardRenderer* cobj = (cocos2d::renderer::ForwardRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ForwardRenderer_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        cocos2d::renderer::DeviceGraphics* arg0 = nullptr;
        std::vector<cocos2d::renderer::ProgramLib::Template> arg1;
        cocos2d::renderer::Texture2D* arg2 = nullptr;
        int arg3 = 0;
        int arg4 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_std_vector_ProgramLib_Template(args[1], &arg1);
        ok &= seval_to_native_ptr(args[2], &arg2);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[3], &tmp); arg3 = (int)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[4], &tmp); arg4 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_ForwardRenderer_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1, arg2, arg3, arg4);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_ForwardRenderer_init : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_renderer_ForwardRenderer_init)

static bool js_renderer_ForwardRenderer_render(se::State& s)
{
    cocos2d::renderer::ForwardRenderer* cobj = (cocos2d::renderer::ForwardRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ForwardRenderer_render : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Scene* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_ForwardRenderer_render : Error processing arguments");
        cobj->render(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_ForwardRenderer_render)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_ForwardRenderer_finalize)

static bool js_renderer_ForwardRenderer_constructor(se::State& s)
{
    cocos2d::renderer::ForwardRenderer* cobj = new (std::nothrow) cocos2d::renderer::ForwardRenderer();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_ForwardRenderer_constructor, __jsb_cocos2d_renderer_ForwardRenderer_class, js_cocos2d_renderer_ForwardRenderer_finalize)



extern se::Object* __jsb_cocos2d_renderer_BaseRenderer_proto;

static bool js_cocos2d_renderer_ForwardRenderer_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::ForwardRenderer)", s.nativeThisObject());
    cocos2d::renderer::ForwardRenderer* cobj = (cocos2d::renderer::ForwardRenderer*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_ForwardRenderer_finalize)

bool js_register_renderer_ForwardRenderer(se::Object* obj)
{
    auto cls = se::Class::create("ForwardRenderer", obj, __jsb_cocos2d_renderer_BaseRenderer_proto, _SE(js_renderer_ForwardRenderer_constructor));

    cls->defineFunction("renderCamera", _SE(js_renderer_ForwardRenderer_renderCamera));
    cls->defineFunction("init", _SE(js_renderer_ForwardRenderer_init));
    cls->defineFunction("render", _SE(js_renderer_ForwardRenderer_render));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_ForwardRenderer_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::ForwardRenderer>(cls);

    __jsb_cocos2d_renderer_ForwardRenderer_proto = cls->getProto();
    __jsb_cocos2d_renderer_ForwardRenderer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_Light_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_Light_class = nullptr;

static bool js_renderer_Light_getRange(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRange();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getRange : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getRange)

static bool js_renderer_Light_setShadowFrustumSize(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setShadowFrustumSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setShadowFrustumSize : Error processing arguments");
        cobj->setShadowFrustumSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setShadowFrustumSize)

static bool js_renderer_Light_setShadowResolution(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setShadowResolution : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setShadowResolution : Error processing arguments");
        cobj->setShadowResolution(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setShadowResolution)

static bool js_renderer_Light_getFrustumEdgeFalloff(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getFrustumEdgeFalloff : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getFrustumEdgeFalloff();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getFrustumEdgeFalloff : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getFrustumEdgeFalloff)

static bool js_renderer_Light_setSpotExp(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setSpotExp : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setSpotExp : Error processing arguments");
        cobj->setSpotExp(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setSpotExp)

static bool js_renderer_Light_setShadowType(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setShadowType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Light::ShadowType arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::Light::ShadowType)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setShadowType : Error processing arguments");
        cobj->setShadowType(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setShadowType)

static bool js_renderer_Light_setType(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Light::LightType arg0;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (cocos2d::renderer::Light::LightType)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setType : Error processing arguments");
        cobj->setType(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setType)

static bool js_renderer_Light_getViewProjMatrix(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getViewProjMatrix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Mat4& result = cobj->getViewProjMatrix();
        ok &= Mat4_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getViewProjMatrix : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getViewProjMatrix)

static bool js_renderer_Light_getPositionUniform(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getPositionUniform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Vec3& result = cobj->getPositionUniform();
        ok &= Vec3_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getPositionUniform : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getPositionUniform)

static bool js_renderer_Light_getShadowBias(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getShadowBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowBias();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getShadowBias : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getShadowBias)

static bool js_renderer_Light_getShadowDarkness(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getShadowDarkness : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowDarkness();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getShadowDarkness : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getShadowDarkness)

static bool js_renderer_Light_getSpotAngle(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getSpotAngle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getSpotAngle();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getSpotAngle : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getSpotAngle)

static bool js_renderer_Light_getDirectionUniform(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getDirectionUniform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Vec3& result = cobj->getDirectionUniform();
        ok &= Vec3_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getDirectionUniform : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getDirectionUniform)

static bool js_renderer_Light_getSpotExp(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getSpotExp : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getSpotExp();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getSpotExp : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getSpotExp)

static bool js_renderer_Light_setShadowDepthScale(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setShadowDepthScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setShadowDepthScale : Error processing arguments");
        cobj->setShadowDepthScale(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setShadowDepthScale)

static bool js_renderer_Light_getViewPorjMatrix(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getViewPorjMatrix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Mat4 result = cobj->getViewPorjMatrix();
        ok &= Mat4_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getViewPorjMatrix : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getViewPorjMatrix)

static bool js_renderer_Light_getType(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getType)

static bool js_renderer_Light_getColorUniform(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getColorUniform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Vec3& result = cobj->getColorUniform();
        ok &= Vec3_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getColorUniform : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getColorUniform)

static bool js_renderer_Light_getIntensity(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getIntensity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getIntensity();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getIntensity : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getIntensity)

static bool js_renderer_Light_getShadowMaxDepth(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getShadowMaxDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowMaxDepth();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getShadowMaxDepth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getShadowMaxDepth)

static bool js_renderer_Light_getWorldMatrix(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getWorldMatrix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Mat4& result = cobj->getWorldMatrix();
        ok &= Mat4_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getWorldMatrix : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getWorldMatrix)

static bool js_renderer_Light_getShadowMap(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getShadowMap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::renderer::Texture2D* result = cobj->getShadowMap();
        ok &= native_ptr_to_seval<cocos2d::renderer::Texture2D>((cocos2d::renderer::Texture2D*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getShadowMap : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getShadowMap)

static bool js_renderer_Light_getColor(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Color3F result = cobj->getColor();
        ok &= Color3F_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getColor)

static bool js_renderer_Light_setIntensity(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setIntensity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setIntensity : Error processing arguments");
        cobj->setIntensity(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setIntensity)

static bool js_renderer_Light_getShadowMinDepth(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getShadowMinDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowMinDepth();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getShadowMinDepth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getShadowMinDepth)

static bool js_renderer_Light_setShadowMinDepth(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setShadowMinDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setShadowMinDepth : Error processing arguments");
        cobj->setShadowMinDepth(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setShadowMinDepth)

static bool js_renderer_Light_update(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::DeviceGraphics* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_update : Error processing arguments");
        cobj->update(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_update)

static bool js_renderer_Light_setShadowDarkness(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setShadowDarkness : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setShadowDarkness : Error processing arguments");
        cobj->setShadowDarkness(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setShadowDarkness)

static bool js_renderer_Light_setWorldMatrix(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setWorldMatrix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Mat4 arg0;
        ok &= seval_to_Mat4(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setWorldMatrix : Error processing arguments");
        cobj->setWorldMatrix(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setWorldMatrix)

static bool js_renderer_Light_setSpotAngle(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setSpotAngle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setSpotAngle : Error processing arguments");
        cobj->setSpotAngle(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setSpotAngle)

static bool js_renderer_Light_setRange(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setRange : Error processing arguments");
        cobj->setRange(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setRange)

static bool js_renderer_Light_setColor(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setColor : Error processing arguments");
        cobj->setColor(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setColor)

static bool js_renderer_Light_setShadowMaxDepth(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setShadowMaxDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setShadowMaxDepth : Error processing arguments");
        cobj->setShadowMaxDepth(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setShadowMaxDepth)

static bool js_renderer_Light_setFrustumEdgeFalloff(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setFrustumEdgeFalloff : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setFrustumEdgeFalloff : Error processing arguments");
        cobj->setFrustumEdgeFalloff(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setFrustumEdgeFalloff)

static bool js_renderer_Light_getShadowResolution(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getShadowResolution : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getShadowResolution();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getShadowResolution : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getShadowResolution)

static bool js_renderer_Light_getShadowDepthScale(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getShadowDepthScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowDepthScale();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getShadowDepthScale : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getShadowDepthScale)

static bool js_renderer_Light_getShadowType(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_getShadowType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getShadowType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Light_getShadowType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_getShadowType)

static bool js_renderer_Light_setShadowBias(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setShadowBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setShadowBias : Error processing arguments");
        cobj->setShadowBias(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setShadowBias)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_Light_finalize)

static bool js_renderer_Light_constructor(se::State& s)
{
    cocos2d::renderer::Light* cobj = new (std::nothrow) cocos2d::renderer::Light();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_Light_constructor, __jsb_cocos2d_renderer_Light_class, js_cocos2d_renderer_Light_finalize)




static bool js_cocos2d_renderer_Light_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::Light)", s.nativeThisObject());
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_Light_finalize)

bool js_register_renderer_Light(se::Object* obj)
{
    auto cls = se::Class::create("Light", obj, nullptr, _SE(js_renderer_Light_constructor));

    cls->defineFunction("getRange", _SE(js_renderer_Light_getRange));
    cls->defineFunction("setShadowFrustumSize", _SE(js_renderer_Light_setShadowFrustumSize));
    cls->defineFunction("setShadowResolution", _SE(js_renderer_Light_setShadowResolution));
    cls->defineFunction("getFrustumEdgeFalloff", _SE(js_renderer_Light_getFrustumEdgeFalloff));
    cls->defineFunction("setSpotExp", _SE(js_renderer_Light_setSpotExp));
    cls->defineFunction("setShadowType", _SE(js_renderer_Light_setShadowType));
    cls->defineFunction("setType", _SE(js_renderer_Light_setType));
    cls->defineFunction("getViewProjMatrix", _SE(js_renderer_Light_getViewProjMatrix));
    cls->defineFunction("getPositionUniform", _SE(js_renderer_Light_getPositionUniform));
    cls->defineFunction("getShadowBias", _SE(js_renderer_Light_getShadowBias));
    cls->defineFunction("getShadowDarkness", _SE(js_renderer_Light_getShadowDarkness));
    cls->defineFunction("getSpotAngle", _SE(js_renderer_Light_getSpotAngle));
    cls->defineFunction("getDirectionUniform", _SE(js_renderer_Light_getDirectionUniform));
    cls->defineFunction("getSpotExp", _SE(js_renderer_Light_getSpotExp));
    cls->defineFunction("setShadowDepthScale", _SE(js_renderer_Light_setShadowDepthScale));
    cls->defineFunction("getViewPorjMatrix", _SE(js_renderer_Light_getViewPorjMatrix));
    cls->defineFunction("getType", _SE(js_renderer_Light_getType));
    cls->defineFunction("getColorUniform", _SE(js_renderer_Light_getColorUniform));
    cls->defineFunction("getIntensity", _SE(js_renderer_Light_getIntensity));
    cls->defineFunction("getShadowMaxDepth", _SE(js_renderer_Light_getShadowMaxDepth));
    cls->defineFunction("getWorldMatrix", _SE(js_renderer_Light_getWorldMatrix));
    cls->defineFunction("getShadowMap", _SE(js_renderer_Light_getShadowMap));
    cls->defineFunction("getColor", _SE(js_renderer_Light_getColor));
    cls->defineFunction("setIntensity", _SE(js_renderer_Light_setIntensity));
    cls->defineFunction("getShadowMinDepth", _SE(js_renderer_Light_getShadowMinDepth));
    cls->defineFunction("setShadowMinDepth", _SE(js_renderer_Light_setShadowMinDepth));
    cls->defineFunction("update", _SE(js_renderer_Light_update));
    cls->defineFunction("setShadowDarkness", _SE(js_renderer_Light_setShadowDarkness));
    cls->defineFunction("setWorldMatrix", _SE(js_renderer_Light_setWorldMatrix));
    cls->defineFunction("setSpotAngle", _SE(js_renderer_Light_setSpotAngle));
    cls->defineFunction("setRange", _SE(js_renderer_Light_setRange));
    cls->defineFunction("setColor", _SE(js_renderer_Light_setColor));
    cls->defineFunction("setShadowMaxDepth", _SE(js_renderer_Light_setShadowMaxDepth));
    cls->defineFunction("setFrustumEdgeFalloff", _SE(js_renderer_Light_setFrustumEdgeFalloff));
    cls->defineFunction("getShadowResolution", _SE(js_renderer_Light_getShadowResolution));
    cls->defineFunction("getShadowDepthScale", _SE(js_renderer_Light_getShadowDepthScale));
    cls->defineFunction("getShadowType", _SE(js_renderer_Light_getShadowType));
    cls->defineFunction("setShadowBias", _SE(js_renderer_Light_setShadowBias));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_Light_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::Light>(cls);

    __jsb_cocos2d_renderer_Light_proto = cls->getProto();
    __jsb_cocos2d_renderer_Light_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_Scene_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_Scene_class = nullptr;

static bool js_renderer_Scene_getCameraCount(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_getCameraCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getCameraCount();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_getCameraCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_getCameraCount)

static bool js_renderer_Scene_removeCamera(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_removeCamera : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Camera* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_removeCamera : Error processing arguments");
        cobj->removeCamera(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_removeCamera)

static bool js_renderer_Scene_getLightCount(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_getLightCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getLightCount();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_getLightCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_getLightCount)

static bool js_renderer_Scene_removeView(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_removeView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::View* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_removeView : Error processing arguments");
        cobj->removeView(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_removeView)

static bool js_renderer_Scene_getLights(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_getLights : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Vector<cocos2d::renderer::Light *> result = cobj->getLights();
        ok &= Vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_getLights : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_getLights)

static bool js_renderer_Scene_removeLight(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_removeLight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Light* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_removeLight : Error processing arguments");
        cobj->removeLight(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_removeLight)

static bool js_renderer_Scene_addCamera(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_addCamera : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Camera* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_addCamera : Error processing arguments");
        cobj->addCamera(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_addCamera)

static bool js_renderer_Scene_getLight(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_getLight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_getLight : Error processing arguments");
        cocos2d::renderer::Light* result = cobj->getLight(arg0);
        ok &= native_ptr_to_seval<cocos2d::renderer::Light>((cocos2d::renderer::Light*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_getLight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_getLight)

static bool js_renderer_Scene_addLight(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_addLight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Light* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_addLight : Error processing arguments");
        cobj->addLight(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_addLight)

static bool js_renderer_Scene_getCameras(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_getCameras : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Vector<cocos2d::renderer::Camera *>& result = cobj->getCameras();
        ok &= Vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_getCameras : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_getCameras)

static bool js_renderer_Scene_sortCameras(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_sortCameras : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->sortCameras();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_sortCameras)

static bool js_renderer_Scene_setDebugCamera(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_setDebugCamera : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Camera* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_setDebugCamera : Error processing arguments");
        cobj->setDebugCamera(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_setDebugCamera)

static bool js_renderer_Scene_reset(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_reset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->reset();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_reset)

static bool js_renderer_Scene_getCamera(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_getCamera : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_getCamera : Error processing arguments");
        cocos2d::renderer::Camera* result = cobj->getCamera(arg0);
        ok &= native_ptr_to_seval<cocos2d::renderer::Camera>((cocos2d::renderer::Camera*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_getCamera : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_getCamera)

static bool js_renderer_Scene_addView(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_addView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::View* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_addView : Error processing arguments");
        cobj->addView(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_addView)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_Scene_finalize)

static bool js_renderer_Scene_constructor(se::State& s)
{
    cocos2d::renderer::Scene* cobj = new (std::nothrow) cocos2d::renderer::Scene();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_Scene_constructor, __jsb_cocos2d_renderer_Scene_class, js_cocos2d_renderer_Scene_finalize)




static bool js_cocos2d_renderer_Scene_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::Scene)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_Scene_finalize)

bool js_register_renderer_Scene(se::Object* obj)
{
    auto cls = se::Class::create("Scene", obj, nullptr, _SE(js_renderer_Scene_constructor));

    cls->defineFunction("getCameraCount", _SE(js_renderer_Scene_getCameraCount));
    cls->defineFunction("removeCamera", _SE(js_renderer_Scene_removeCamera));
    cls->defineFunction("getLightCount", _SE(js_renderer_Scene_getLightCount));
    cls->defineFunction("removeView", _SE(js_renderer_Scene_removeView));
    cls->defineFunction("getLights", _SE(js_renderer_Scene_getLights));
    cls->defineFunction("removeLight", _SE(js_renderer_Scene_removeLight));
    cls->defineFunction("addCamera", _SE(js_renderer_Scene_addCamera));
    cls->defineFunction("getLight", _SE(js_renderer_Scene_getLight));
    cls->defineFunction("addLight", _SE(js_renderer_Scene_addLight));
    cls->defineFunction("getCameras", _SE(js_renderer_Scene_getCameras));
    cls->defineFunction("sortCameras", _SE(js_renderer_Scene_sortCameras));
    cls->defineFunction("setDebugCamera", _SE(js_renderer_Scene_setDebugCamera));
    cls->defineFunction("reset", _SE(js_renderer_Scene_reset));
    cls->defineFunction("getCamera", _SE(js_renderer_Scene_getCamera));
    cls->defineFunction("addView", _SE(js_renderer_Scene_addView));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_Scene_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::Scene>(cls);

    __jsb_cocos2d_renderer_Scene_proto = cls->getProto();
    __jsb_cocos2d_renderer_Scene_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_NodeMemPool_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_NodeMemPool_class = nullptr;

static bool js_renderer_NodeMemPool_removeNodeData(se::State& s)
{
    cocos2d::renderer::NodeMemPool* cobj = (cocos2d::renderer::NodeMemPool*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeMemPool_removeNodeData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        size_t arg0 = 0;
        ok &= seval_to_size(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_NodeMemPool_removeNodeData : Error processing arguments");
        cobj->removeNodeData(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeMemPool_removeNodeData)

static bool js_renderer_NodeMemPool_updateNodeData(se::State& s)
{
    cocos2d::renderer::NodeMemPool* cobj = (cocos2d::renderer::NodeMemPool*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_NodeMemPool_updateNodeData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 11) {
        size_t arg0 = 0;
        se_object_ptr arg1 = nullptr;
        se_object_ptr arg2 = nullptr;
        se_object_ptr arg3 = nullptr;
        se_object_ptr arg4 = nullptr;
        se_object_ptr arg5 = nullptr;
        se_object_ptr arg6 = nullptr;
        se_object_ptr arg7 = nullptr;
        se_object_ptr arg8 = nullptr;
        se_object_ptr arg9 = nullptr;
        se_object_ptr arg10 = nullptr;
        ok &= seval_to_size(args[0], &arg0);
        arg1 = args[1].toObject();
        arg2 = args[2].toObject();
        arg3 = args[3].toObject();
        arg4 = args[4].toObject();
        arg5 = args[5].toObject();
        arg6 = args[6].toObject();
        arg7 = args[7].toObject();
        arg8 = args[8].toObject();
        arg9 = args[9].toObject();
        arg10 = args[10].toObject();
        SE_PRECONDITION2(ok, false, "js_renderer_NodeMemPool_updateNodeData : Error processing arguments");
        cobj->updateNodeData(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 11);
    return false;
}
SE_BIND_FUNC(js_renderer_NodeMemPool_updateNodeData)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_NodeMemPool_finalize)

static bool js_renderer_NodeMemPool_constructor(se::State& s)
{
    cocos2d::renderer::NodeMemPool* cobj = new (std::nothrow) cocos2d::renderer::NodeMemPool();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_NodeMemPool_constructor, __jsb_cocos2d_renderer_NodeMemPool_class, js_cocos2d_renderer_NodeMemPool_finalize)



extern se::Object* __jsb_cocos2d_renderer_MemPool_proto;

static bool js_cocos2d_renderer_NodeMemPool_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::NodeMemPool)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::renderer::NodeMemPool* cobj = (cocos2d::renderer::NodeMemPool*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_NodeMemPool_finalize)

bool js_register_renderer_NodeMemPool(se::Object* obj)
{
    auto cls = se::Class::create("NodeMemPool", obj, __jsb_cocos2d_renderer_MemPool_proto, _SE(js_renderer_NodeMemPool_constructor));

    cls->defineFunction("removeNodeData", _SE(js_renderer_NodeMemPool_removeNodeData));
    cls->defineFunction("updateNodeData", _SE(js_renderer_NodeMemPool_updateNodeData));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_NodeMemPool_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::NodeMemPool>(cls);

    __jsb_cocos2d_renderer_NodeMemPool_proto = cls->getProto();
    __jsb_cocos2d_renderer_NodeMemPool_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_RenderDataList_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_RenderDataList_class = nullptr;

static bool js_renderer_RenderDataList_updateMesh(se::State& s)
{
    cocos2d::renderer::RenderDataList* cobj = (cocos2d::renderer::RenderDataList*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderDataList_updateMesh : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        size_t arg0 = 0;
        se_object_ptr arg1 = nullptr;
        se_object_ptr arg2 = nullptr;
        ok &= seval_to_size(args[0], &arg0);
        arg1 = args[1].toObject();
        arg2 = args[2].toObject();
        SE_PRECONDITION2(ok, false, "js_renderer_RenderDataList_updateMesh : Error processing arguments");
        cobj->updateMesh(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderDataList_updateMesh)

static bool js_renderer_RenderDataList_clear(se::State& s)
{
    cocos2d::renderer::RenderDataList* cobj = (cocos2d::renderer::RenderDataList*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderDataList_clear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clear();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderDataList_clear)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_RenderDataList_finalize)

static bool js_renderer_RenderDataList_constructor(se::State& s)
{
    cocos2d::renderer::RenderDataList* cobj = new (std::nothrow) cocos2d::renderer::RenderDataList();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_RenderDataList_constructor, __jsb_cocos2d_renderer_RenderDataList_class, js_cocos2d_renderer_RenderDataList_finalize)




static bool js_cocos2d_renderer_RenderDataList_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::RenderDataList)", s.nativeThisObject());
    cocos2d::renderer::RenderDataList* cobj = (cocos2d::renderer::RenderDataList*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_RenderDataList_finalize)

bool js_register_renderer_RenderDataList(se::Object* obj)
{
    auto cls = se::Class::create("RenderDataList", obj, nullptr, _SE(js_renderer_RenderDataList_constructor));

    cls->defineFunction("updateMesh", _SE(js_renderer_RenderDataList_updateMesh));
    cls->defineFunction("clear", _SE(js_renderer_RenderDataList_clear));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_RenderDataList_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::RenderDataList>(cls);

    __jsb_cocos2d_renderer_RenderDataList_proto = cls->getProto();
    __jsb_cocos2d_renderer_RenderDataList_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_Assembler_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_Assembler_class = nullptr;

static bool js_renderer_Assembler_setVertexFormat(se::State& s)
{
    cocos2d::renderer::Assembler* cobj = (cocos2d::renderer::Assembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Assembler_setVertexFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::VertexFormat* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Assembler_setVertexFormat : Error processing arguments");
        cobj->setVertexFormat(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Assembler_setVertexFormat)

static bool js_renderer_Assembler_isIgnoreOpacityFlag(se::State& s)
{
    cocos2d::renderer::Assembler* cobj = (cocos2d::renderer::Assembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Assembler_isIgnoreOpacityFlag : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isIgnoreOpacityFlag();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Assembler_isIgnoreOpacityFlag : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Assembler_isIgnoreOpacityFlag)

static bool js_renderer_Assembler_ignoreWorldMatrix(se::State& s)
{
    cocos2d::renderer::Assembler* cobj = (cocos2d::renderer::Assembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Assembler_ignoreWorldMatrix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->ignoreWorldMatrix();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Assembler_ignoreWorldMatrix)

static bool js_renderer_Assembler_updateVerticesRange(se::State& s)
{
    cocos2d::renderer::Assembler* cobj = (cocos2d::renderer::Assembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Assembler_updateVerticesRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        size_t arg0 = 0;
        int arg1 = 0;
        int arg2 = 0;
        ok &= seval_to_size(args[0], &arg0);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Assembler_updateVerticesRange : Error processing arguments");
        cobj->updateVerticesRange(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_renderer_Assembler_updateVerticesRange)

static bool js_renderer_Assembler_setRenderDataList(se::State& s)
{
    cocos2d::renderer::Assembler* cobj = (cocos2d::renderer::Assembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Assembler_setRenderDataList : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::RenderDataList* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Assembler_setRenderDataList : Error processing arguments");
        cobj->setRenderDataList(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Assembler_setRenderDataList)

static bool js_renderer_Assembler_updateMeshIndex(se::State& s)
{
    cocos2d::renderer::Assembler* cobj = (cocos2d::renderer::Assembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Assembler_updateMeshIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        size_t arg0 = 0;
        int arg1 = 0;
        ok &= seval_to_size(args[0], &arg0);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Assembler_updateMeshIndex : Error processing arguments");
        cobj->updateMeshIndex(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_Assembler_updateMeshIndex)

static bool js_renderer_Assembler_updateEffect(se::State& s)
{
    cocos2d::renderer::Assembler* cobj = (cocos2d::renderer::Assembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Assembler_updateEffect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        size_t arg0 = 0;
        cocos2d::renderer::Effect* arg1 = nullptr;
        ok &= seval_to_size(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_Assembler_updateEffect : Error processing arguments");
        cobj->updateEffect(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_Assembler_updateEffect)

static bool js_renderer_Assembler_getCustomProperties(se::State& s)
{
    cocos2d::renderer::Assembler* cobj = (cocos2d::renderer::Assembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Assembler_getCustomProperties : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::renderer::CustomProperties* result = cobj->getCustomProperties();
        ok &= native_ptr_to_seval<cocos2d::renderer::CustomProperties>((cocos2d::renderer::CustomProperties*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Assembler_getCustomProperties : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Assembler_getCustomProperties)

static bool js_renderer_Assembler_updateIndicesRange(se::State& s)
{
    cocos2d::renderer::Assembler* cobj = (cocos2d::renderer::Assembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Assembler_updateIndicesRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        size_t arg0 = 0;
        int arg1 = 0;
        int arg2 = 0;
        ok &= seval_to_size(args[0], &arg0);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[1], &tmp); arg1 = (int)tmp; } while(false);
        do { int32_t tmp = 0; ok &= seval_to_int32(args[2], &tmp); arg2 = (int)tmp; } while(false);
        SE_PRECONDITION2(ok, false, "js_renderer_Assembler_updateIndicesRange : Error processing arguments");
        cobj->updateIndicesRange(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_renderer_Assembler_updateIndicesRange)

static bool js_renderer_Assembler_ignoreOpacityFlag(se::State& s)
{
    cocos2d::renderer::Assembler* cobj = (cocos2d::renderer::Assembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Assembler_ignoreOpacityFlag : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->ignoreOpacityFlag();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Assembler_ignoreOpacityFlag)

static bool js_renderer_Assembler_setCustomProperties(se::State& s)
{
    cocos2d::renderer::Assembler* cobj = (cocos2d::renderer::Assembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Assembler_setCustomProperties : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::CustomProperties* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Assembler_setCustomProperties : Error processing arguments");
        cobj->setCustomProperties(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Assembler_setCustomProperties)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_Assembler_finalize)

static bool js_renderer_Assembler_constructor(se::State& s)
{
    cocos2d::renderer::Assembler* cobj = new (std::nothrow) cocos2d::renderer::Assembler();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_Assembler_constructor, __jsb_cocos2d_renderer_Assembler_class, js_cocos2d_renderer_Assembler_finalize)

static bool js_renderer_Assembler_ctor(se::State& s)
{
    cocos2d::renderer::Assembler* cobj = new (std::nothrow) cocos2d::renderer::Assembler();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_renderer_Assembler_ctor, __jsb_cocos2d_renderer_Assembler_class, js_cocos2d_renderer_Assembler_finalize)


    

extern se::Object* __jsb_cocos2d_renderer_AssemblerBase_proto;

static bool js_cocos2d_renderer_Assembler_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::Assembler)", s.nativeThisObject());
    cocos2d::renderer::Assembler* cobj = (cocos2d::renderer::Assembler*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_Assembler_finalize)

bool js_register_renderer_Assembler(se::Object* obj)
{
    auto cls = se::Class::create("Assembler", obj, __jsb_cocos2d_renderer_AssemblerBase_proto, _SE(js_renderer_Assembler_constructor));

    cls->defineFunction("setVertexFormat", _SE(js_renderer_Assembler_setVertexFormat));
    cls->defineFunction("isIgnoreOpacityFlag", _SE(js_renderer_Assembler_isIgnoreOpacityFlag));
    cls->defineFunction("ignoreWorldMatrix", _SE(js_renderer_Assembler_ignoreWorldMatrix));
    cls->defineFunction("updateVerticesRange", _SE(js_renderer_Assembler_updateVerticesRange));
    cls->defineFunction("setRenderDataList", _SE(js_renderer_Assembler_setRenderDataList));
    cls->defineFunction("updateMeshIndex", _SE(js_renderer_Assembler_updateMeshIndex));
    cls->defineFunction("updateEffect", _SE(js_renderer_Assembler_updateEffect));
    cls->defineFunction("getCustomProperties", _SE(js_renderer_Assembler_getCustomProperties));
    cls->defineFunction("updateIndicesRange", _SE(js_renderer_Assembler_updateIndicesRange));
    cls->defineFunction("ignoreOpacityFlag", _SE(js_renderer_Assembler_ignoreOpacityFlag));
    cls->defineFunction("setCustomProperties", _SE(js_renderer_Assembler_setCustomProperties));
    cls->defineFunction("ctor", _SE(js_renderer_Assembler_ctor));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_Assembler_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::Assembler>(cls);

    __jsb_cocos2d_renderer_Assembler_proto = cls->getProto();
    __jsb_cocos2d_renderer_Assembler_class = cls;

    jsb_set_extend_property("renderer", "Assembler");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_CustomAssembler_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_CustomAssembler_class = nullptr;

static bool js_renderer_CustomAssembler_clearEffect(se::State& s)
{
    cocos2d::renderer::CustomAssembler* cobj = (cocos2d::renderer::CustomAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_CustomAssembler_clearEffect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clearEffect();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_CustomAssembler_clearEffect)

static bool js_renderer_CustomAssembler_updateEffect(se::State& s)
{
    cocos2d::renderer::CustomAssembler* cobj = (cocos2d::renderer::CustomAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_CustomAssembler_updateEffect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        size_t arg0 = 0;
        cocos2d::renderer::Effect* arg1 = nullptr;
        ok &= seval_to_size(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_CustomAssembler_updateEffect : Error processing arguments");
        cobj->updateEffect(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_CustomAssembler_updateEffect)

static bool js_renderer_CustomAssembler_updateIABuffer(se::State& s)
{
    cocos2d::renderer::CustomAssembler* cobj = (cocos2d::renderer::CustomAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_CustomAssembler_updateIABuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        size_t arg0 = 0;
        cocos2d::renderer::VertexBuffer* arg1 = nullptr;
        cocos2d::renderer::IndexBuffer* arg2 = nullptr;
        ok &= seval_to_size(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_native_ptr(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_renderer_CustomAssembler_updateIABuffer : Error processing arguments");
        cobj->updateIABuffer(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_renderer_CustomAssembler_updateIABuffer)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_CustomAssembler_finalize)

static bool js_renderer_CustomAssembler_constructor(se::State& s)
{
    cocos2d::renderer::CustomAssembler* cobj = new (std::nothrow) cocos2d::renderer::CustomAssembler();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_CustomAssembler_constructor, __jsb_cocos2d_renderer_CustomAssembler_class, js_cocos2d_renderer_CustomAssembler_finalize)

static bool js_renderer_CustomAssembler_ctor(se::State& s)
{
    cocos2d::renderer::CustomAssembler* cobj = new (std::nothrow) cocos2d::renderer::CustomAssembler();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_renderer_CustomAssembler_ctor, __jsb_cocos2d_renderer_CustomAssembler_class, js_cocos2d_renderer_CustomAssembler_finalize)


    

extern se::Object* __jsb_cocos2d_renderer_AssemblerBase_proto;

static bool js_cocos2d_renderer_CustomAssembler_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::CustomAssembler)", s.nativeThisObject());
    cocos2d::renderer::CustomAssembler* cobj = (cocos2d::renderer::CustomAssembler*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_CustomAssembler_finalize)

bool js_register_renderer_CustomAssembler(se::Object* obj)
{
    auto cls = se::Class::create("CustomAssembler", obj, __jsb_cocos2d_renderer_AssemblerBase_proto, _SE(js_renderer_CustomAssembler_constructor));

    cls->defineFunction("clearEffect", _SE(js_renderer_CustomAssembler_clearEffect));
    cls->defineFunction("updateEffect", _SE(js_renderer_CustomAssembler_updateEffect));
    cls->defineFunction("updateIABuffer", _SE(js_renderer_CustomAssembler_updateIABuffer));
    cls->defineFunction("ctor", _SE(js_renderer_CustomAssembler_ctor));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_CustomAssembler_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::CustomAssembler>(cls);

    __jsb_cocos2d_renderer_CustomAssembler_proto = cls->getProto();
    __jsb_cocos2d_renderer_CustomAssembler_class = cls;

    jsb_set_extend_property("renderer", "CustomAssembler");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_RenderFlow_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_RenderFlow_class = nullptr;

static bool js_renderer_RenderFlow_render(se::State& s)
{
    cocos2d::renderer::RenderFlow* cobj = (cocos2d::renderer::RenderFlow*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_RenderFlow_render : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::renderer::NodeProxy* arg0 = nullptr;
        float arg1 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_RenderFlow_render : Error processing arguments");
        cobj->render(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_RenderFlow_render)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_RenderFlow_finalize)

static bool js_renderer_RenderFlow_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cocos2d::renderer::DeviceGraphics* arg0 = nullptr;
    cocos2d::renderer::Scene* arg1 = nullptr;
    cocos2d::renderer::ForwardRenderer* arg2 = nullptr;
    ok &= seval_to_native_ptr(args[0], &arg0);
    ok &= seval_to_native_ptr(args[1], &arg1);
    ok &= seval_to_native_ptr(args[2], &arg2);
    SE_PRECONDITION2(ok, false, "js_renderer_RenderFlow_constructor : Error processing arguments");
    cocos2d::renderer::RenderFlow* cobj = new (std::nothrow) cocos2d::renderer::RenderFlow(arg0, arg1, arg2);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_RenderFlow_constructor, __jsb_cocos2d_renderer_RenderFlow_class, js_cocos2d_renderer_RenderFlow_finalize)




static bool js_cocos2d_renderer_RenderFlow_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::RenderFlow)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cocos2d::renderer::RenderFlow* cobj = (cocos2d::renderer::RenderFlow*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_RenderFlow_finalize)

bool js_register_renderer_RenderFlow(se::Object* obj)
{
    auto cls = se::Class::create("RenderFlow", obj, nullptr, _SE(js_renderer_RenderFlow_constructor));

    cls->defineFunction("render", _SE(js_renderer_RenderFlow_render));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_RenderFlow_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::RenderFlow>(cls);

    __jsb_cocos2d_renderer_RenderFlow_proto = cls->getProto();
    __jsb_cocos2d_renderer_RenderFlow_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_AssemblerSprite_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_AssemblerSprite_class = nullptr;

static bool js_renderer_AssemblerSprite_setLocalData(se::State& s)
{
    cocos2d::renderer::AssemblerSprite* cobj = (cocos2d::renderer::AssemblerSprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_AssemblerSprite_setLocalData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        se_object_ptr arg0 = nullptr;
        arg0 = args[0].toObject();
        SE_PRECONDITION2(ok, false, "js_renderer_AssemblerSprite_setLocalData : Error processing arguments");
        cobj->setLocalData(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_AssemblerSprite_setLocalData)


extern se::Object* __jsb_cocos2d_renderer_Assembler_proto;


bool js_register_renderer_AssemblerSprite(se::Object* obj)
{
    auto cls = se::Class::create("AssemblerSprite", obj, __jsb_cocos2d_renderer_Assembler_proto, nullptr);

    cls->defineFunction("setLocalData", _SE(js_renderer_AssemblerSprite_setLocalData));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::AssemblerSprite>(cls);

    __jsb_cocos2d_renderer_AssemblerSprite_proto = cls->getProto();
    __jsb_cocos2d_renderer_AssemblerSprite_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_SimpleSprite2D_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_SimpleSprite2D_class = nullptr;

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_SimpleSprite2D_finalize)

static bool js_renderer_SimpleSprite2D_constructor(se::State& s)
{
    cocos2d::renderer::SimpleSprite2D* cobj = new (std::nothrow) cocos2d::renderer::SimpleSprite2D();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_SimpleSprite2D_constructor, __jsb_cocos2d_renderer_SimpleSprite2D_class, js_cocos2d_renderer_SimpleSprite2D_finalize)

static bool js_renderer_SimpleSprite2D_ctor(se::State& s)
{
    cocos2d::renderer::SimpleSprite2D* cobj = new (std::nothrow) cocos2d::renderer::SimpleSprite2D();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_renderer_SimpleSprite2D_ctor, __jsb_cocos2d_renderer_SimpleSprite2D_class, js_cocos2d_renderer_SimpleSprite2D_finalize)


    

extern se::Object* __jsb_cocos2d_renderer_AssemblerSprite_proto;

static bool js_cocos2d_renderer_SimpleSprite2D_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::SimpleSprite2D)", s.nativeThisObject());
    cocos2d::renderer::SimpleSprite2D* cobj = (cocos2d::renderer::SimpleSprite2D*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_SimpleSprite2D_finalize)

bool js_register_renderer_SimpleSprite2D(se::Object* obj)
{
    auto cls = se::Class::create("SimpleSprite2D", obj, __jsb_cocos2d_renderer_AssemblerSprite_proto, _SE(js_renderer_SimpleSprite2D_constructor));

    cls->defineFunction("ctor", _SE(js_renderer_SimpleSprite2D_ctor));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_SimpleSprite2D_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::SimpleSprite2D>(cls);

    __jsb_cocos2d_renderer_SimpleSprite2D_proto = cls->getProto();
    __jsb_cocos2d_renderer_SimpleSprite2D_class = cls;

    jsb_set_extend_property("renderer", "SimpleSprite2D");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_MaskAssembler_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_MaskAssembler_class = nullptr;

static bool js_renderer_MaskAssembler_setMaskInverted(se::State& s)
{
    cocos2d::renderer::MaskAssembler* cobj = (cocos2d::renderer::MaskAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MaskAssembler_setMaskInverted : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_MaskAssembler_setMaskInverted : Error processing arguments");
        cobj->setMaskInverted(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_MaskAssembler_setMaskInverted)

static bool js_renderer_MaskAssembler_setImageStencil(se::State& s)
{
    cocos2d::renderer::MaskAssembler* cobj = (cocos2d::renderer::MaskAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MaskAssembler_setImageStencil : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_MaskAssembler_setImageStencil : Error processing arguments");
        cobj->setImageStencil(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_MaskAssembler_setImageStencil)

static bool js_renderer_MaskAssembler_setClearSubHandle(se::State& s)
{
    cocos2d::renderer::MaskAssembler* cobj = (cocos2d::renderer::MaskAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MaskAssembler_setClearSubHandle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Assembler* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_MaskAssembler_setClearSubHandle : Error processing arguments");
        cobj->setClearSubHandle(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_MaskAssembler_setClearSubHandle)

static bool js_renderer_MaskAssembler_getMaskInverted(se::State& s)
{
    cocos2d::renderer::MaskAssembler* cobj = (cocos2d::renderer::MaskAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MaskAssembler_getMaskInverted : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getMaskInverted();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_MaskAssembler_getMaskInverted : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_MaskAssembler_getMaskInverted)

static bool js_renderer_MaskAssembler_setRenderSubHandle(se::State& s)
{
    cocos2d::renderer::MaskAssembler* cobj = (cocos2d::renderer::MaskAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_MaskAssembler_setRenderSubHandle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Assembler* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_MaskAssembler_setRenderSubHandle : Error processing arguments");
        cobj->setRenderSubHandle(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_MaskAssembler_setRenderSubHandle)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_MaskAssembler_finalize)

static bool js_renderer_MaskAssembler_constructor(se::State& s)
{
    cocos2d::renderer::MaskAssembler* cobj = new (std::nothrow) cocos2d::renderer::MaskAssembler();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_MaskAssembler_constructor, __jsb_cocos2d_renderer_MaskAssembler_class, js_cocos2d_renderer_MaskAssembler_finalize)

static bool js_renderer_MaskAssembler_ctor(se::State& s)
{
    cocos2d::renderer::MaskAssembler* cobj = new (std::nothrow) cocos2d::renderer::MaskAssembler();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_renderer_MaskAssembler_ctor, __jsb_cocos2d_renderer_MaskAssembler_class, js_cocos2d_renderer_MaskAssembler_finalize)


    

extern se::Object* __jsb_cocos2d_renderer_SimpleSprite2D_proto;

static bool js_cocos2d_renderer_MaskAssembler_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::MaskAssembler)", s.nativeThisObject());
    cocos2d::renderer::MaskAssembler* cobj = (cocos2d::renderer::MaskAssembler*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_MaskAssembler_finalize)

bool js_register_renderer_MaskAssembler(se::Object* obj)
{
    auto cls = se::Class::create("MaskAssembler", obj, __jsb_cocos2d_renderer_SimpleSprite2D_proto, _SE(js_renderer_MaskAssembler_constructor));

    cls->defineFunction("setMaskInverted", _SE(js_renderer_MaskAssembler_setMaskInverted));
    cls->defineFunction("setImageStencil", _SE(js_renderer_MaskAssembler_setImageStencil));
    cls->defineFunction("setClearSubHandle", _SE(js_renderer_MaskAssembler_setClearSubHandle));
    cls->defineFunction("getMaskInverted", _SE(js_renderer_MaskAssembler_getMaskInverted));
    cls->defineFunction("setRenderSubHandle", _SE(js_renderer_MaskAssembler_setRenderSubHandle));
    cls->defineFunction("ctor", _SE(js_renderer_MaskAssembler_ctor));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_MaskAssembler_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::MaskAssembler>(cls);

    __jsb_cocos2d_renderer_MaskAssembler_proto = cls->getProto();
    __jsb_cocos2d_renderer_MaskAssembler_class = cls;

    jsb_set_extend_property("renderer", "MaskAssembler");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_TiledMapAssembler_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_TiledMapAssembler_class = nullptr;

static bool js_renderer_TiledMapAssembler_updateNodes(se::State& s)
{
    cocos2d::renderer::TiledMapAssembler* cobj = (cocos2d::renderer::TiledMapAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_TiledMapAssembler_updateNodes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        size_t arg0 = 0;
        std::vector<std::string> arg1;
        ok &= seval_to_size(args[0], &arg0);
        ok &= seval_to_std_vector_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_TiledMapAssembler_updateNodes : Error processing arguments");
        cobj->updateNodes(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_TiledMapAssembler_updateNodes)

static bool js_renderer_TiledMapAssembler_clearNodes(se::State& s)
{
    cocos2d::renderer::TiledMapAssembler* cobj = (cocos2d::renderer::TiledMapAssembler*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_TiledMapAssembler_clearNodes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        size_t arg0 = 0;
        ok &= seval_to_size(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_TiledMapAssembler_clearNodes : Error processing arguments");
        cobj->clearNodes(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_TiledMapAssembler_clearNodes)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_TiledMapAssembler_finalize)

static bool js_renderer_TiledMapAssembler_constructor(se::State& s)
{
    cocos2d::renderer::TiledMapAssembler* cobj = new (std::nothrow) cocos2d::renderer::TiledMapAssembler();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_TiledMapAssembler_constructor, __jsb_cocos2d_renderer_TiledMapAssembler_class, js_cocos2d_renderer_TiledMapAssembler_finalize)

static bool js_renderer_TiledMapAssembler_ctor(se::State& s)
{
    cocos2d::renderer::TiledMapAssembler* cobj = new (std::nothrow) cocos2d::renderer::TiledMapAssembler();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_renderer_TiledMapAssembler_ctor, __jsb_cocos2d_renderer_TiledMapAssembler_class, js_cocos2d_renderer_TiledMapAssembler_finalize)


    

extern se::Object* __jsb_cocos2d_renderer_Assembler_proto;

static bool js_cocos2d_renderer_TiledMapAssembler_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::TiledMapAssembler)", s.nativeThisObject());
    cocos2d::renderer::TiledMapAssembler* cobj = (cocos2d::renderer::TiledMapAssembler*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_TiledMapAssembler_finalize)

bool js_register_renderer_TiledMapAssembler(se::Object* obj)
{
    auto cls = se::Class::create("TiledMapAssembler", obj, __jsb_cocos2d_renderer_Assembler_proto, _SE(js_renderer_TiledMapAssembler_constructor));

    cls->defineFunction("updateNodes", _SE(js_renderer_TiledMapAssembler_updateNodes));
    cls->defineFunction("clearNodes", _SE(js_renderer_TiledMapAssembler_clearNodes));
    cls->defineFunction("ctor", _SE(js_renderer_TiledMapAssembler_ctor));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_TiledMapAssembler_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::TiledMapAssembler>(cls);

    __jsb_cocos2d_renderer_TiledMapAssembler_proto = cls->getProto();
    __jsb_cocos2d_renderer_TiledMapAssembler_class = cls;

    jsb_set_extend_property("renderer", "TiledMapAssembler");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_renderer_SlicedSprite2D_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_SlicedSprite2D_class = nullptr;

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_SlicedSprite2D_finalize)

static bool js_renderer_SlicedSprite2D_constructor(se::State& s)
{
    cocos2d::renderer::SlicedSprite2D* cobj = new (std::nothrow) cocos2d::renderer::SlicedSprite2D();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_SlicedSprite2D_constructor, __jsb_cocos2d_renderer_SlicedSprite2D_class, js_cocos2d_renderer_SlicedSprite2D_finalize)

static bool js_renderer_SlicedSprite2D_ctor(se::State& s)
{
    cocos2d::renderer::SlicedSprite2D* cobj = new (std::nothrow) cocos2d::renderer::SlicedSprite2D();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_renderer_SlicedSprite2D_ctor, __jsb_cocos2d_renderer_SlicedSprite2D_class, js_cocos2d_renderer_SlicedSprite2D_finalize)


    

extern se::Object* __jsb_cocos2d_renderer_AssemblerSprite_proto;

static bool js_cocos2d_renderer_SlicedSprite2D_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::SlicedSprite2D)", s.nativeThisObject());
    cocos2d::renderer::SlicedSprite2D* cobj = (cocos2d::renderer::SlicedSprite2D*)s.nativeThisObject();
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_SlicedSprite2D_finalize)

bool js_register_renderer_SlicedSprite2D(se::Object* obj)
{
    auto cls = se::Class::create("SlicedSprite2D", obj, __jsb_cocos2d_renderer_AssemblerSprite_proto, _SE(js_renderer_SlicedSprite2D_constructor));

    cls->defineFunction("ctor", _SE(js_renderer_SlicedSprite2D_ctor));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_SlicedSprite2D_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::SlicedSprite2D>(cls);

    __jsb_cocos2d_renderer_SlicedSprite2D_proto = cls->getProto();
    __jsb_cocos2d_renderer_SlicedSprite2D_class = cls;

    jsb_set_extend_property("renderer", "SlicedSprite2D");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_renderer(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("renderer", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("renderer", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_renderer_ProgramLib(ns);
    js_register_renderer_Camera(ns);
    js_register_renderer_AssemblerBase(ns);
    js_register_renderer_MemPool(ns);
    js_register_renderer_NodeProxy(ns);
    js_register_renderer_Assembler(ns);
    js_register_renderer_AssemblerSprite(ns);
    js_register_renderer_SimpleSprite2D(ns);
    js_register_renderer_Effect(ns);
    js_register_renderer_CustomProperties(ns);
    js_register_renderer_MaskAssembler(ns);
    js_register_renderer_Light(ns);
    js_register_renderer_NodeMemPool(ns);
    js_register_renderer_TiledMapAssembler(ns);
    js_register_renderer_BaseRenderer(ns);
    js_register_renderer_ForwardRenderer(ns);
    js_register_renderer_View(ns);
    js_register_renderer_RenderFlow(ns);
    js_register_renderer_SlicedSprite2D(ns);
    js_register_renderer_Scene(ns);
    js_register_renderer_RenderDataList(ns);
    js_register_renderer_Pass(ns);
    js_register_renderer_CustomAssembler(ns);
    return true;
}

#endif //#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
