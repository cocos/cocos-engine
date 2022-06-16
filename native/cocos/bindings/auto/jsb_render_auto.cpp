
// clang-format off
#include "cocos/bindings/auto/jsb_render_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "renderer/pipeline/custom/RenderInterfaceTypes.h"
#include "cocos/bindings/auto/jsb_gfx_auto.h"
#include "cocos/bindings/auto/jsb_scene_auto.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphJsb.h"
#include "cocos/renderer/pipeline/custom/RenderCommonJsb.h"
#include "cocos/renderer/pipeline/custom/RenderGraphJsb.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif

#if CC_DEBUG
static bool js_render_getter_return_true(se::State& s) // NOLINT(readability-identifier-naming)
{
    s.rval().setBoolean(true);
    return true;
}
SE_BIND_PROP_GET(js_render_getter_return_true)
#endif
se::Object* __jsb_cc_render_PipelineRuntime_proto = nullptr; // NOLINT
se::Class* __jsb_cc_render_PipelineRuntime_class = nullptr;  // NOLINT

static bool js_render_PipelineRuntime_activate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::PipelineRuntime>(s);
    SE_PRECONDITION2(cobj, false, "js_render_PipelineRuntime_activate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Swapchain*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_PipelineRuntime_activate : Error processing arguments");
        bool result = cobj->activate(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_PipelineRuntime_activate : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_render_PipelineRuntime_activate)

static bool js_render_PipelineRuntime_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::PipelineRuntime>(s);
    SE_PRECONDITION2(cobj, false, "js_render_PipelineRuntime_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->destroy();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_PipelineRuntime_destroy : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_render_PipelineRuntime_destroy)

static bool js_render_PipelineRuntime_getConstantMacros(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::PipelineRuntime>(s);
    SE_PRECONDITION2(cobj, false, "js_render_PipelineRuntime_getConstantMacros : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getConstantMacros();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_PipelineRuntime_getConstantMacros : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_render_PipelineRuntime_getConstantMacros)

static bool js_render_PipelineRuntime_getDescriptorSetLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::PipelineRuntime>(s);
    SE_PRECONDITION2(cobj, false, "js_render_PipelineRuntime_getDescriptorSetLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::DescriptorSetLayout* result = cobj->getDescriptorSetLayout();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_PipelineRuntime_getDescriptorSetLayout : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_render_PipelineRuntime_getDescriptorSetLayout)

static bool js_render_PipelineRuntime_getGeometryRenderer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::PipelineRuntime>(s);
    SE_PRECONDITION2(cobj, false, "js_render_PipelineRuntime_getGeometryRenderer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::pipeline::GeometryRenderer* result = cobj->getGeometryRenderer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_PipelineRuntime_getGeometryRenderer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_render_PipelineRuntime_getGeometryRenderer)

static bool js_render_PipelineRuntime_getGlobalDSManager(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::PipelineRuntime>(s);
    SE_PRECONDITION2(cobj, false, "js_render_PipelineRuntime_getGlobalDSManager : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::pipeline::GlobalDSManager* result = cobj->getGlobalDSManager();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_PipelineRuntime_getGlobalDSManager : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_render_PipelineRuntime_getGlobalDSManager)

static bool js_render_PipelineRuntime_getPipelineSceneData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::PipelineRuntime>(s);
    SE_PRECONDITION2(cobj, false, "js_render_PipelineRuntime_getPipelineSceneData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::pipeline::PipelineSceneData* result = cobj->getPipelineSceneData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_PipelineRuntime_getPipelineSceneData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_render_PipelineRuntime_getPipelineSceneData)

static bool js_render_PipelineRuntime_getProfiler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::PipelineRuntime>(s);
    SE_PRECONDITION2(cobj, false, "js_render_PipelineRuntime_getProfiler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Model* result = cobj->getProfiler();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_PipelineRuntime_getProfiler : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_render_PipelineRuntime_getProfiler)

static bool js_render_PipelineRuntime_getShadingScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::PipelineRuntime>(s);
    SE_PRECONDITION2(cobj, false, "js_render_PipelineRuntime_getShadingScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadingScale();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_PipelineRuntime_getShadingScale : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_render_PipelineRuntime_getShadingScale)

static bool js_render_PipelineRuntime_onGlobalPipelineStateChanged(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::PipelineRuntime>(s);
    SE_PRECONDITION2(cobj, false, "js_render_PipelineRuntime_onGlobalPipelineStateChanged : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onGlobalPipelineStateChanged();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_render_PipelineRuntime_onGlobalPipelineStateChanged)

static bool js_render_PipelineRuntime_render(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::PipelineRuntime>(s);
    SE_PRECONDITION2(cobj, false, "js_render_PipelineRuntime_render : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::scene::Camera *>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_PipelineRuntime_render : Error processing arguments");
        cobj->render(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_render_PipelineRuntime_render)

static bool js_render_PipelineRuntime_setMacroBool(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::PipelineRuntime>(s);
    SE_PRECONDITION2(cobj, false, "js_render_PipelineRuntime_setMacroBool : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<bool, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_PipelineRuntime_setMacroBool : Error processing arguments");
        cobj->setMacroBool(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_PipelineRuntime_setMacroBool)

static bool js_render_PipelineRuntime_setMacroInt(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::PipelineRuntime>(s);
    SE_PRECONDITION2(cobj, false, "js_render_PipelineRuntime_setMacroInt : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<int32_t, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_PipelineRuntime_setMacroInt : Error processing arguments");
        cobj->setMacroInt(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_PipelineRuntime_setMacroInt)

static bool js_render_PipelineRuntime_setMacroString(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::PipelineRuntime>(s);
    SE_PRECONDITION2(cobj, false, "js_render_PipelineRuntime_setMacroString : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_PipelineRuntime_setMacroString : Error processing arguments");
        cobj->setMacroString(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_PipelineRuntime_setMacroString)

static bool js_render_PipelineRuntime_setProfiler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::PipelineRuntime>(s);
    SE_PRECONDITION2(cobj, false, "js_render_PipelineRuntime_setProfiler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Model*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_PipelineRuntime_setProfiler : Error processing arguments");
        cobj->setProfiler(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_render_PipelineRuntime_setProfiler)

static bool js_render_PipelineRuntime_setShadingScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::PipelineRuntime>(s);
    SE_PRECONDITION2(cobj, false, "js_render_PipelineRuntime_setShadingScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_PipelineRuntime_setShadingScale : Error processing arguments");
        cobj->setShadingScale(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_render_PipelineRuntime_setShadingScale)

bool js_register_render_PipelineRuntime(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("PipelineRuntime", obj, nullptr, nullptr);

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_render_getter_return_true), nullptr);
#endif
    cls->defineProperty("globalDSManager", _SE(js_render_PipelineRuntime_getGlobalDSManager_asGetter), nullptr);
    cls->defineProperty("descriptorSetLayout", _SE(js_render_PipelineRuntime_getDescriptorSetLayout_asGetter), nullptr);
    cls->defineProperty("pipelineSceneData", _SE(js_render_PipelineRuntime_getPipelineSceneData_asGetter), nullptr);
    cls->defineProperty("constantMacros", _SE(js_render_PipelineRuntime_getConstantMacros_asGetter), nullptr);
    cls->defineProperty("profiler", _SE(js_render_PipelineRuntime_getProfiler_asGetter), _SE(js_render_PipelineRuntime_setProfiler_asSetter));
    cls->defineProperty("geometryRenderer", _SE(js_render_PipelineRuntime_getGeometryRenderer_asGetter), nullptr);
    cls->defineProperty("shadingScale", _SE(js_render_PipelineRuntime_getShadingScale_asGetter), _SE(js_render_PipelineRuntime_setShadingScale_asSetter));
    cls->defineFunction("activate", _SE(js_render_PipelineRuntime_activate));
    cls->defineFunction("destroy", _SE(js_render_PipelineRuntime_destroy));
    cls->defineFunction("onGlobalPipelineStateChanged", _SE(js_render_PipelineRuntime_onGlobalPipelineStateChanged));
    cls->defineFunction("render", _SE(js_render_PipelineRuntime_render));
    cls->defineFunction("setMacroBool", _SE(js_render_PipelineRuntime_setMacroBool));
    cls->defineFunction("setMacroInt", _SE(js_render_PipelineRuntime_setMacroInt));
    cls->defineFunction("setMacroString", _SE(js_render_PipelineRuntime_setMacroString));
    cls->install();
    JSBClassType::registerClass<cc::render::PipelineRuntime>(cls);

    __jsb_cc_render_PipelineRuntime_proto = cls->getProto();
    __jsb_cc_render_PipelineRuntime_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_render_Setter_proto = nullptr; // NOLINT
se::Class* __jsb_cc_render_Setter_class = nullptr;  // NOLINT

static bool js_render_Setter_setBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Setter>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Setter_setBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::gfx::Buffer*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_Setter_setBuffer : Error processing arguments");
        cobj->setBuffer(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_Setter_setBuffer)

static bool js_render_Setter_setColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Setter>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Setter_setColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::gfx::Color, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_Setter_setColor : Error processing arguments");
        cobj->setColor(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_Setter_setColor)

static bool js_render_Setter_setFloat(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Setter>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Setter_setFloat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_Setter_setFloat : Error processing arguments");
        cobj->setFloat(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_Setter_setFloat)

static bool js_render_Setter_setMat4(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Setter>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Setter_setMat4 : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::Mat4, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_Setter_setMat4 : Error processing arguments");
        cobj->setMat4(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_Setter_setMat4)

static bool js_render_Setter_setQuaternion(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Setter>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Setter_setQuaternion : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::Quaternion, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_Setter_setQuaternion : Error processing arguments");
        cobj->setQuaternion(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_Setter_setQuaternion)

static bool js_render_Setter_setReadWriteBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Setter>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Setter_setReadWriteBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::gfx::Buffer*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_Setter_setReadWriteBuffer : Error processing arguments");
        cobj->setReadWriteBuffer(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_Setter_setReadWriteBuffer)

static bool js_render_Setter_setReadWriteTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Setter>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Setter_setReadWriteTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::gfx::Texture*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_Setter_setReadWriteTexture : Error processing arguments");
        cobj->setReadWriteTexture(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_Setter_setReadWriteTexture)

static bool js_render_Setter_setSampler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Setter>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Setter_setSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::gfx::Sampler*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_Setter_setSampler : Error processing arguments");
        cobj->setSampler(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_Setter_setSampler)

static bool js_render_Setter_setTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Setter>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Setter_setTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::gfx::Texture*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_Setter_setTexture : Error processing arguments");
        cobj->setTexture(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_Setter_setTexture)

static bool js_render_Setter_setVec2(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Setter>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Setter_setVec2 : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::Vec2, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_Setter_setVec2 : Error processing arguments");
        cobj->setVec2(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_Setter_setVec2)

static bool js_render_Setter_setVec4(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Setter>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Setter_setVec4 : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::Vec4, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_Setter_setVec4 : Error processing arguments");
        cobj->setVec4(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_Setter_setVec4)

bool js_register_render_Setter(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Setter", obj, nullptr, nullptr);

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_render_getter_return_true), nullptr);
#endif
    cls->defineFunction("setBuffer", _SE(js_render_Setter_setBuffer));
    cls->defineFunction("setColor", _SE(js_render_Setter_setColor));
    cls->defineFunction("setFloat", _SE(js_render_Setter_setFloat));
    cls->defineFunction("setMat4", _SE(js_render_Setter_setMat4));
    cls->defineFunction("setQuaternion", _SE(js_render_Setter_setQuaternion));
    cls->defineFunction("setReadWriteBuffer", _SE(js_render_Setter_setReadWriteBuffer));
    cls->defineFunction("setReadWriteTexture", _SE(js_render_Setter_setReadWriteTexture));
    cls->defineFunction("setSampler", _SE(js_render_Setter_setSampler));
    cls->defineFunction("setTexture", _SE(js_render_Setter_setTexture));
    cls->defineFunction("setVec2", _SE(js_render_Setter_setVec2));
    cls->defineFunction("setVec4", _SE(js_render_Setter_setVec4));
    cls->install();
    JSBClassType::registerClass<cc::render::Setter>(cls);

    __jsb_cc_render_Setter_proto = cls->getProto();
    __jsb_cc_render_Setter_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_render_RasterQueueBuilder_proto = nullptr; // NOLINT
se::Class* __jsb_cc_render_RasterQueueBuilder_class = nullptr;  // NOLINT

static bool js_render_RasterQueueBuilder_addFullscreenQuad(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::render::RasterQueueBuilder>(s);
    SE_PRECONDITION2( cobj, false, "js_render_RasterQueueBuilder_addFullscreenQuad : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<std::string, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->addFullscreenQuad(arg0.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<std::string, true> arg0 = {};
            HolderType<std::string, true> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->addFullscreenQuad(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_render_RasterQueueBuilder_addFullscreenQuad)

static bool js_render_RasterQueueBuilder_addScene(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::RasterQueueBuilder>(s);
    SE_PRECONDITION2(cobj, false, "js_render_RasterQueueBuilder_addScene : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::render::SceneFlags, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_RasterQueueBuilder_addScene : Error processing arguments");
        cobj->addScene(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_RasterQueueBuilder_addScene)

static bool js_render_RasterQueueBuilder_addSceneOfCamera(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::render::RasterQueueBuilder>(s);
    SE_PRECONDITION2( cobj, false, "js_render_RasterQueueBuilder_addSceneOfCamera : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 3) {
            HolderType<cc::scene::Camera*, false> arg0 = {};
            HolderType<cc::scene::Light*, false> arg1 = {};
            HolderType<cc::render::SceneFlags, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->addSceneOfCamera(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 4) {
            HolderType<cc::scene::Camera*, false> arg0 = {};
            HolderType<cc::scene::Light*, false> arg1 = {};
            HolderType<cc::render::SceneFlags, false> arg2 = {};
            HolderType<std::string, true> arg3 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->addSceneOfCamera(arg0.value(), arg1.value(), arg2.value(), arg3.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_render_RasterQueueBuilder_addSceneOfCamera)

bool js_register_render_RasterQueueBuilder(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RasterQueueBuilder", obj, __jsb_cc_render_Setter_proto, nullptr);

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_render_getter_return_true), nullptr);
#endif
    cls->defineFunction("addFullscreenQuad", _SE(js_render_RasterQueueBuilder_addFullscreenQuad));
    cls->defineFunction("addScene", _SE(js_render_RasterQueueBuilder_addScene));
    cls->defineFunction("addSceneOfCamera", _SE(js_render_RasterQueueBuilder_addSceneOfCamera));
    cls->install();
    JSBClassType::registerClass<cc::render::RasterQueueBuilder>(cls);

    __jsb_cc_render_RasterQueueBuilder_proto = cls->getProto();
    __jsb_cc_render_RasterQueueBuilder_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_render_RasterPassBuilder_proto = nullptr; // NOLINT
se::Class* __jsb_cc_render_RasterPassBuilder_class = nullptr;  // NOLINT

static bool js_render_RasterPassBuilder_addComputeView(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::RasterPassBuilder>(s);
    SE_PRECONDITION2(cobj, false, "js_render_RasterPassBuilder_addComputeView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::render::ComputeView, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_RasterPassBuilder_addComputeView : Error processing arguments");
        cobj->addComputeView(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_RasterPassBuilder_addComputeView)

static bool js_render_RasterPassBuilder_addFullscreenQuad(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::render::RasterPassBuilder>(s);
    SE_PRECONDITION2( cobj, false, "js_render_RasterPassBuilder_addFullscreenQuad : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<std::string, true> arg0 = {};
            HolderType<std::string, true> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->addFullscreenQuad(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<std::string, true> arg0 = {};
            HolderType<std::string, true> arg1 = {};
            HolderType<std::string, true> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->addFullscreenQuad(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<std::string, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->addFullscreenQuad(arg0.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_render_RasterPassBuilder_addFullscreenQuad)

static bool js_render_RasterPassBuilder_addQueue(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::render::RasterPassBuilder>(s);
    SE_PRECONDITION2( cobj, false, "js_render_RasterPassBuilder_addQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<cc::render::QueueHint, false> arg0 = {};
            HolderType<std::string, true> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::render::RasterQueueBuilder* result = cobj->addQueue(arg0.value(), arg1.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_render_RasterPassBuilder_addQueue : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<cc::render::QueueHint, false> arg0 = {};
            HolderType<std::string, true> arg1 = {};
            HolderType<std::string, true> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::render::RasterQueueBuilder* result = cobj->addQueue(arg0.value(), arg1.value(), arg2.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_render_RasterPassBuilder_addQueue : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<cc::render::QueueHint, false> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::render::RasterQueueBuilder* result = cobj->addQueue(arg0.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_render_RasterPassBuilder_addQueue : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_render_RasterPassBuilder_addQueue)

static bool js_render_RasterPassBuilder_addRasterView(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::RasterPassBuilder>(s);
    SE_PRECONDITION2(cobj, false, "js_render_RasterPassBuilder_addRasterView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::render::RasterView, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_RasterPassBuilder_addRasterView : Error processing arguments");
        cobj->addRasterView(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_RasterPassBuilder_addRasterView)

bool js_register_render_RasterPassBuilder(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RasterPassBuilder", obj, __jsb_cc_render_Setter_proto, nullptr);

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_render_getter_return_true), nullptr);
#endif
    cls->defineFunction("addComputeView", _SE(js_render_RasterPassBuilder_addComputeView));
    cls->defineFunction("addFullscreenQuad", _SE(js_render_RasterPassBuilder_addFullscreenQuad));
    cls->defineFunction("addQueue", _SE(js_render_RasterPassBuilder_addQueue));
    cls->defineFunction("addRasterView", _SE(js_render_RasterPassBuilder_addRasterView));
    cls->install();
    JSBClassType::registerClass<cc::render::RasterPassBuilder>(cls);

    __jsb_cc_render_RasterPassBuilder_proto = cls->getProto();
    __jsb_cc_render_RasterPassBuilder_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_render_ComputeQueueBuilder_proto = nullptr; // NOLINT
se::Class* __jsb_cc_render_ComputeQueueBuilder_class = nullptr;  // NOLINT

static bool js_render_ComputeQueueBuilder_addDispatch(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::render::ComputeQueueBuilder>(s);
    SE_PRECONDITION2( cobj, false, "js_render_ComputeQueueBuilder_addDispatch : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 5) {
            HolderType<std::string, true> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};
            HolderType<unsigned int, false> arg2 = {};
            HolderType<unsigned int, false> arg3 = {};
            HolderType<std::string, true> arg4 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->addDispatch(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 6) {
            HolderType<std::string, true> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};
            HolderType<unsigned int, false> arg2 = {};
            HolderType<unsigned int, false> arg3 = {};
            HolderType<std::string, true> arg4 = {};
            HolderType<std::string, true> arg5 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->addDispatch(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 4) {
            HolderType<std::string, true> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};
            HolderType<unsigned int, false> arg2 = {};
            HolderType<unsigned int, false> arg3 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->addDispatch(arg0.value(), arg1.value(), arg2.value(), arg3.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_render_ComputeQueueBuilder_addDispatch)

bool js_register_render_ComputeQueueBuilder(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ComputeQueueBuilder", obj, __jsb_cc_render_Setter_proto, nullptr);

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_render_getter_return_true), nullptr);
#endif
    cls->defineFunction("addDispatch", _SE(js_render_ComputeQueueBuilder_addDispatch));
    cls->install();
    JSBClassType::registerClass<cc::render::ComputeQueueBuilder>(cls);

    __jsb_cc_render_ComputeQueueBuilder_proto = cls->getProto();
    __jsb_cc_render_ComputeQueueBuilder_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_render_ComputePassBuilder_proto = nullptr; // NOLINT
se::Class* __jsb_cc_render_ComputePassBuilder_class = nullptr;  // NOLINT

static bool js_render_ComputePassBuilder_addComputeView(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::ComputePassBuilder>(s);
    SE_PRECONDITION2(cobj, false, "js_render_ComputePassBuilder_addComputeView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::render::ComputeView, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_ComputePassBuilder_addComputeView : Error processing arguments");
        cobj->addComputeView(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_ComputePassBuilder_addComputeView)

static bool js_render_ComputePassBuilder_addDispatch(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::render::ComputePassBuilder>(s);
    SE_PRECONDITION2( cobj, false, "js_render_ComputePassBuilder_addDispatch : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 5) {
            HolderType<std::string, true> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};
            HolderType<unsigned int, false> arg2 = {};
            HolderType<unsigned int, false> arg3 = {};
            HolderType<std::string, true> arg4 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->addDispatch(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 6) {
            HolderType<std::string, true> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};
            HolderType<unsigned int, false> arg2 = {};
            HolderType<unsigned int, false> arg3 = {};
            HolderType<std::string, true> arg4 = {};
            HolderType<std::string, true> arg5 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->addDispatch(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 4) {
            HolderType<std::string, true> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};
            HolderType<unsigned int, false> arg2 = {};
            HolderType<unsigned int, false> arg3 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->addDispatch(arg0.value(), arg1.value(), arg2.value(), arg3.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_render_ComputePassBuilder_addDispatch)

static bool js_render_ComputePassBuilder_addQueue(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::render::ComputePassBuilder>(s);
    SE_PRECONDITION2( cobj, false, "js_render_ComputePassBuilder_addQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<std::string, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::render::ComputeQueueBuilder* result = cobj->addQueue(arg0.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_render_ComputePassBuilder_addQueue : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<std::string, true> arg0 = {};
            HolderType<std::string, true> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::render::ComputeQueueBuilder* result = cobj->addQueue(arg0.value(), arg1.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_render_ComputePassBuilder_addQueue : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {

            cc::render::ComputeQueueBuilder* result = cobj->addQueue();
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_render_ComputePassBuilder_addQueue : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_render_ComputePassBuilder_addQueue)

bool js_register_render_ComputePassBuilder(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ComputePassBuilder", obj, __jsb_cc_render_Setter_proto, nullptr);

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_render_getter_return_true), nullptr);
#endif
    cls->defineFunction("addComputeView", _SE(js_render_ComputePassBuilder_addComputeView));
    cls->defineFunction("addDispatch", _SE(js_render_ComputePassBuilder_addDispatch));
    cls->defineFunction("addQueue", _SE(js_render_ComputePassBuilder_addQueue));
    cls->install();
    JSBClassType::registerClass<cc::render::ComputePassBuilder>(cls);

    __jsb_cc_render_ComputePassBuilder_proto = cls->getProto();
    __jsb_cc_render_ComputePassBuilder_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_render_MovePassBuilder_proto = nullptr; // NOLINT
se::Class* __jsb_cc_render_MovePassBuilder_class = nullptr;  // NOLINT

static bool js_render_MovePassBuilder_addPair(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::MovePassBuilder>(s);
    SE_PRECONDITION2(cobj, false, "js_render_MovePassBuilder_addPair : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::render::MovePair, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_MovePassBuilder_addPair : Error processing arguments");
        cobj->addPair(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_render_MovePassBuilder_addPair)

bool js_register_render_MovePassBuilder(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("MovePassBuilder", obj, nullptr, nullptr);

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_render_getter_return_true), nullptr);
#endif
    cls->defineFunction("addPair", _SE(js_render_MovePassBuilder_addPair));
    cls->install();
    JSBClassType::registerClass<cc::render::MovePassBuilder>(cls);

    __jsb_cc_render_MovePassBuilder_proto = cls->getProto();
    __jsb_cc_render_MovePassBuilder_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_render_CopyPassBuilder_proto = nullptr; // NOLINT
se::Class* __jsb_cc_render_CopyPassBuilder_class = nullptr;  // NOLINT

static bool js_render_CopyPassBuilder_addPair(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::CopyPassBuilder>(s);
    SE_PRECONDITION2(cobj, false, "js_render_CopyPassBuilder_addPair : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::render::CopyPair, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_CopyPassBuilder_addPair : Error processing arguments");
        cobj->addPair(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_render_CopyPassBuilder_addPair)

bool js_register_render_CopyPassBuilder(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("CopyPassBuilder", obj, nullptr, nullptr);

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_render_getter_return_true), nullptr);
#endif
    cls->defineFunction("addPair", _SE(js_render_CopyPassBuilder_addPair));
    cls->install();
    JSBClassType::registerClass<cc::render::CopyPassBuilder>(cls);

    __jsb_cc_render_CopyPassBuilder_proto = cls->getProto();
    __jsb_cc_render_CopyPassBuilder_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_render_SceneVisitor_proto = nullptr; // NOLINT
se::Class* __jsb_cc_render_SceneVisitor_class = nullptr;  // NOLINT

static bool js_render_SceneVisitor_bindInputAssembler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::SceneVisitor>(s);
    SE_PRECONDITION2(cobj, false, "js_render_SceneVisitor_bindInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::InputAssembler*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_SceneVisitor_bindInputAssembler : Error processing arguments");
        cobj->bindInputAssembler(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_render_SceneVisitor_bindInputAssembler)

static bool js_render_SceneVisitor_bindPipelineState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::SceneVisitor>(s);
    SE_PRECONDITION2(cobj, false, "js_render_SceneVisitor_bindPipelineState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::PipelineState*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_SceneVisitor_bindPipelineState : Error processing arguments");
        cobj->bindPipelineState(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_render_SceneVisitor_bindPipelineState)

static bool js_render_SceneVisitor_draw(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::SceneVisitor>(s);
    SE_PRECONDITION2(cobj, false, "js_render_SceneVisitor_draw : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::DrawInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_SceneVisitor_draw : Error processing arguments");
        cobj->draw(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_render_SceneVisitor_draw)

static bool js_render_SceneVisitor_getPipelineSceneData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::SceneVisitor>(s);
    SE_PRECONDITION2(cobj, false, "js_render_SceneVisitor_getPipelineSceneData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::pipeline::PipelineSceneData* result = cobj->getPipelineSceneData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_SceneVisitor_getPipelineSceneData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_render_SceneVisitor_getPipelineSceneData)

static bool js_render_SceneVisitor_setScissor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::SceneVisitor>(s);
    SE_PRECONDITION2(cobj, false, "js_render_SceneVisitor_setScissor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Rect, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_SceneVisitor_setScissor : Error processing arguments");
        cobj->setScissor(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_render_SceneVisitor_setScissor)

static bool js_render_SceneVisitor_setViewport(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::SceneVisitor>(s);
    SE_PRECONDITION2(cobj, false, "js_render_SceneVisitor_setViewport : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Viewport, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_SceneVisitor_setViewport : Error processing arguments");
        cobj->setViewport(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_render_SceneVisitor_setViewport)

bool js_register_render_SceneVisitor(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SceneVisitor", obj, nullptr, nullptr);

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_render_getter_return_true), nullptr);
#endif
    cls->defineProperty("pipelineSceneData", _SE(js_render_SceneVisitor_getPipelineSceneData_asGetter), nullptr);
    cls->defineFunction("bindInputAssembler", _SE(js_render_SceneVisitor_bindInputAssembler));
    cls->defineFunction("bindPipelineState", _SE(js_render_SceneVisitor_bindPipelineState));
    cls->defineFunction("draw", _SE(js_render_SceneVisitor_draw));
    cls->defineFunction("setScissor", _SE(js_render_SceneVisitor_setScissor));
    cls->defineFunction("setViewport", _SE(js_render_SceneVisitor_setViewport));
    cls->install();
    JSBClassType::registerClass<cc::render::SceneVisitor>(cls);

    __jsb_cc_render_SceneVisitor_proto = cls->getProto();
    __jsb_cc_render_SceneVisitor_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_render_SceneTask_proto = nullptr; // NOLINT
se::Class* __jsb_cc_render_SceneTask_class = nullptr;  // NOLINT

static bool js_render_SceneTask_getTaskType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::SceneTask>(s);
    SE_PRECONDITION2(cobj, false, "js_render_SceneTask_getTaskType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getTaskType());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_SceneTask_getTaskType : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_render_SceneTask_getTaskType)

static bool js_render_SceneTask_join(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::SceneTask>(s);
    SE_PRECONDITION2(cobj, false, "js_render_SceneTask_join : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->join();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_render_SceneTask_join)

static bool js_render_SceneTask_start(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::SceneTask>(s);
    SE_PRECONDITION2(cobj, false, "js_render_SceneTask_start : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->start();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_render_SceneTask_start)

static bool js_render_SceneTask_submit(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::SceneTask>(s);
    SE_PRECONDITION2(cobj, false, "js_render_SceneTask_submit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->submit();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_render_SceneTask_submit)

bool js_register_render_SceneTask(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SceneTask", obj, nullptr, nullptr);

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_render_getter_return_true), nullptr);
#endif
    cls->defineProperty("taskType", _SE(js_render_SceneTask_getTaskType_asGetter), nullptr);
    cls->defineFunction("join", _SE(js_render_SceneTask_join));
    cls->defineFunction("start", _SE(js_render_SceneTask_start));
    cls->defineFunction("submit", _SE(js_render_SceneTask_submit));
    cls->install();
    JSBClassType::registerClass<cc::render::SceneTask>(cls);

    __jsb_cc_render_SceneTask_proto = cls->getProto();
    __jsb_cc_render_SceneTask_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_render_SceneTransversal_proto = nullptr; // NOLINT
se::Class* __jsb_cc_render_SceneTransversal_class = nullptr;  // NOLINT

static bool js_render_SceneTransversal_transverse(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::SceneTransversal>(s);
    SE_PRECONDITION2(cobj, false, "js_render_SceneTransversal_transverse : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::render::SceneVisitor*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_SceneTransversal_transverse : Error processing arguments");
        cc::render::SceneTask* result = cobj->transverse(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_SceneTransversal_transverse : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_render_SceneTransversal_transverse)

bool js_register_render_SceneTransversal(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SceneTransversal", obj, nullptr, nullptr);

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_render_getter_return_true), nullptr);
#endif
    cls->defineFunction("transverse", _SE(js_render_SceneTransversal_transverse));
    cls->install();
    JSBClassType::registerClass<cc::render::SceneTransversal>(cls);

    __jsb_cc_render_SceneTransversal_proto = cls->getProto();
    __jsb_cc_render_SceneTransversal_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_render_LayoutGraphBuilder_proto = nullptr; // NOLINT
se::Class* __jsb_cc_render_LayoutGraphBuilder_class = nullptr;  // NOLINT

static bool js_render_LayoutGraphBuilder_addDescriptorBlock(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::LayoutGraphBuilder>(s);
    SE_PRECONDITION2(cobj, false, "js_render_LayoutGraphBuilder_addDescriptorBlock : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<cc::render::DescriptorBlockIndex, true> arg1 = {};
        HolderType<cc::render::DescriptorBlock, true> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_LayoutGraphBuilder_addDescriptorBlock : Error processing arguments");
        cobj->addDescriptorBlock(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_render_LayoutGraphBuilder_addDescriptorBlock)

static bool js_render_LayoutGraphBuilder_addRenderPhase(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::LayoutGraphBuilder>(s);
    SE_PRECONDITION2(cobj, false, "js_render_LayoutGraphBuilder_addRenderPhase : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_LayoutGraphBuilder_addRenderPhase : Error processing arguments");
        unsigned int result = cobj->addRenderPhase(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_LayoutGraphBuilder_addRenderPhase : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_LayoutGraphBuilder_addRenderPhase)

static bool js_render_LayoutGraphBuilder_addRenderStage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::LayoutGraphBuilder>(s);
    SE_PRECONDITION2(cobj, false, "js_render_LayoutGraphBuilder_addRenderStage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_LayoutGraphBuilder_addRenderStage : Error processing arguments");
        unsigned int result = cobj->addRenderStage(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_LayoutGraphBuilder_addRenderStage : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_render_LayoutGraphBuilder_addRenderStage)

static bool js_render_LayoutGraphBuilder_addShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::LayoutGraphBuilder>(s);
    SE_PRECONDITION2(cobj, false, "js_render_LayoutGraphBuilder_addShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_LayoutGraphBuilder_addShader : Error processing arguments");
        cobj->addShader(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_LayoutGraphBuilder_addShader)

static bool js_render_LayoutGraphBuilder_clear(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::LayoutGraphBuilder>(s);
    SE_PRECONDITION2(cobj, false, "js_render_LayoutGraphBuilder_clear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clear();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_render_LayoutGraphBuilder_clear)

static bool js_render_LayoutGraphBuilder_compile(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::LayoutGraphBuilder>(s);
    SE_PRECONDITION2(cobj, false, "js_render_LayoutGraphBuilder_compile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->compile();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_LayoutGraphBuilder_compile : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_render_LayoutGraphBuilder_compile)

static bool js_render_LayoutGraphBuilder_print(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::LayoutGraphBuilder>(s);
    SE_PRECONDITION2(cobj, false, "js_render_LayoutGraphBuilder_print : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->print();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_LayoutGraphBuilder_print : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_render_LayoutGraphBuilder_print)

static bool js_render_LayoutGraphBuilder_reserveDescriptorBlock(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::LayoutGraphBuilder>(s);
    SE_PRECONDITION2(cobj, false, "js_render_LayoutGraphBuilder_reserveDescriptorBlock : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<cc::render::DescriptorBlockIndex, true> arg1 = {};
        HolderType<cc::render::DescriptorBlock, true> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_LayoutGraphBuilder_reserveDescriptorBlock : Error processing arguments");
        cobj->reserveDescriptorBlock(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_render_LayoutGraphBuilder_reserveDescriptorBlock)

bool js_register_render_LayoutGraphBuilder(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("LayoutGraphBuilder", obj, nullptr, nullptr);

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_render_getter_return_true), nullptr);
#endif
    cls->defineFunction("addDescriptorBlock", _SE(js_render_LayoutGraphBuilder_addDescriptorBlock));
    cls->defineFunction("addRenderPhase", _SE(js_render_LayoutGraphBuilder_addRenderPhase));
    cls->defineFunction("addRenderStage", _SE(js_render_LayoutGraphBuilder_addRenderStage));
    cls->defineFunction("addShader", _SE(js_render_LayoutGraphBuilder_addShader));
    cls->defineFunction("clear", _SE(js_render_LayoutGraphBuilder_clear));
    cls->defineFunction("compile", _SE(js_render_LayoutGraphBuilder_compile));
    cls->defineFunction("print", _SE(js_render_LayoutGraphBuilder_print));
    cls->defineFunction("reserveDescriptorBlock", _SE(js_render_LayoutGraphBuilder_reserveDescriptorBlock));
    cls->install();
    JSBClassType::registerClass<cc::render::LayoutGraphBuilder>(cls);

    __jsb_cc_render_LayoutGraphBuilder_proto = cls->getProto();
    __jsb_cc_render_LayoutGraphBuilder_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_render_Pipeline_proto = nullptr; // NOLINT
se::Class* __jsb_cc_render_Pipeline_class = nullptr;  // NOLINT

static bool js_render_Pipeline_addComputePass(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::render::Pipeline>(s);
    SE_PRECONDITION2( cobj, false, "js_render_Pipeline_addComputePass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<std::string, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::render::ComputePassBuilder* result = cobj->addComputePass(arg0.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_render_Pipeline_addComputePass : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<std::string, true> arg0 = {};
            HolderType<std::string, true> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::render::ComputePassBuilder* result = cobj->addComputePass(arg0.value(), arg1.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_render_Pipeline_addComputePass : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_render_Pipeline_addComputePass)

static bool js_render_Pipeline_addCopyPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Pipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Pipeline_addCopyPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_Pipeline_addCopyPass : Error processing arguments");
        cc::render::CopyPassBuilder* result = cobj->addCopyPass(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_Pipeline_addCopyPass : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_render_Pipeline_addCopyPass)

static bool js_render_Pipeline_addDepthStencil(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Pipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Pipeline_addDepthStencil : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::gfx::Format, false> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        HolderType<unsigned int, false> arg3 = {};
        HolderType<cc::render::ResourceResidency, false> arg4 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_Pipeline_addDepthStencil : Error processing arguments");
        unsigned int result = cobj->addDepthStencil(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_Pipeline_addDepthStencil : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_render_Pipeline_addDepthStencil)

static bool js_render_Pipeline_addMovePass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Pipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Pipeline_addMovePass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_Pipeline_addMovePass : Error processing arguments");
        cc::render::MovePassBuilder* result = cobj->addMovePass(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_Pipeline_addMovePass : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_render_Pipeline_addMovePass)

static bool js_render_Pipeline_addRasterPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::render::Pipeline>(s);
    SE_PRECONDITION2( cobj, false, "js_render_Pipeline_addRasterPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 3) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};
            HolderType<std::string, true> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::render::RasterPassBuilder* result = cobj->addRasterPass(arg0.value(), arg1.value(), arg2.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_render_Pipeline_addRasterPass : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 4) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};
            HolderType<std::string, true> arg2 = {};
            HolderType<std::string, true> arg3 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::render::RasterPassBuilder* result = cobj->addRasterPass(arg0.value(), arg1.value(), arg2.value(), arg3.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_render_Pipeline_addRasterPass : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_render_Pipeline_addRasterPass)

static bool js_render_Pipeline_addRenderTarget(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Pipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Pipeline_addRenderTarget : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::gfx::Format, false> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        HolderType<unsigned int, false> arg3 = {};
        HolderType<cc::render::ResourceResidency, false> arg4 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_Pipeline_addRenderTarget : Error processing arguments");
        unsigned int result = cobj->addRenderTarget(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_Pipeline_addRenderTarget : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_render_Pipeline_addRenderTarget)

static bool js_render_Pipeline_addRenderTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Pipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Pipeline_addRenderTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::gfx::Format, false> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        HolderType<unsigned int, false> arg3 = {};
        HolderType<cc::scene::RenderWindow*, false> arg4 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_Pipeline_addRenderTexture : Error processing arguments");
        unsigned int result = cobj->addRenderTexture(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_Pipeline_addRenderTexture : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_render_Pipeline_addRenderTexture)

static bool js_render_Pipeline_beginFrame(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Pipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Pipeline_beginFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->beginFrame();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_render_Pipeline_beginFrame)

static bool js_render_Pipeline_createSceneTransversal(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Pipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Pipeline_createSceneTransversal : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<const cc::scene::Camera*, false> arg0 = {};
        HolderType<const cc::scene::RenderScene*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_Pipeline_createSceneTransversal : Error processing arguments");
        cc::render::SceneTransversal* result = cobj->createSceneTransversal(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_Pipeline_createSceneTransversal : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_Pipeline_createSceneTransversal)

static bool js_render_Pipeline_endFrame(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Pipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Pipeline_endFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->endFrame();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_render_Pipeline_endFrame)

static bool js_render_Pipeline_getDescriptorSetLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Pipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Pipeline_getDescriptorSetLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::render::UpdateFrequency, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_render_Pipeline_getDescriptorSetLayout : Error processing arguments");
        cc::gfx::DescriptorSetLayout* result = cobj->getDescriptorSetLayout(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_Pipeline_getDescriptorSetLayout : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_render_Pipeline_getDescriptorSetLayout)

static bool js_render_Pipeline_getLayoutGraphBuilder(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Pipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Pipeline_getLayoutGraphBuilder : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::render::LayoutGraphBuilder* result = cobj->getLayoutGraphBuilder();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_Pipeline_getLayoutGraphBuilder : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_render_Pipeline_getLayoutGraphBuilder)

static bool js_render_Pipeline_presentAll(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::render::Pipeline>(s);
    SE_PRECONDITION2(cobj, false, "js_render_Pipeline_presentAll : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->presentAll();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_render_Pipeline_presentAll)

bool js_register_render_Pipeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Pipeline", obj, __jsb_cc_render_PipelineRuntime_proto, nullptr);

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_render_getter_return_true), nullptr);
#endif
    cls->defineProperty("layoutGraphBuilder", _SE(js_render_Pipeline_getLayoutGraphBuilder_asGetter), nullptr);
    cls->defineFunction("addComputePass", _SE(js_render_Pipeline_addComputePass));
    cls->defineFunction("addCopyPass", _SE(js_render_Pipeline_addCopyPass));
    cls->defineFunction("addDepthStencil", _SE(js_render_Pipeline_addDepthStencil));
    cls->defineFunction("addMovePass", _SE(js_render_Pipeline_addMovePass));
    cls->defineFunction("addRasterPass", _SE(js_render_Pipeline_addRasterPass));
    cls->defineFunction("addRenderTarget", _SE(js_render_Pipeline_addRenderTarget));
    cls->defineFunction("addRenderTexture", _SE(js_render_Pipeline_addRenderTexture));
    cls->defineFunction("beginFrame", _SE(js_render_Pipeline_beginFrame));
    cls->defineFunction("createSceneTransversal", _SE(js_render_Pipeline_createSceneTransversal));
    cls->defineFunction("endFrame", _SE(js_render_Pipeline_endFrame));
    cls->defineFunction("getDescriptorSetLayout", _SE(js_render_Pipeline_getDescriptorSetLayout));
    cls->defineFunction("presentAll", _SE(js_render_Pipeline_presentAll));
    cls->install();
    JSBClassType::registerClass<cc::render::Pipeline>(cls);

    __jsb_cc_render_Pipeline_proto = cls->getProto();
    __jsb_cc_render_Pipeline_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_render_Factory_proto = nullptr; // NOLINT
se::Class* __jsb_cc_render_Factory_class = nullptr;  // NOLINT

static bool js_render_Factory_createPipeline_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::render::Pipeline* result = cc::render::Factory::createPipeline();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_render_Factory_createPipeline_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_render_Factory_createPipeline_static)
static bool js_cc_render_Factory_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_render_Factory_finalize)

bool js_register_render_Factory(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Factory", obj, nullptr, nullptr);

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_render_getter_return_true), nullptr);
#endif
    cls->defineStaticFunction("createPipeline", _SE(js_render_Factory_createPipeline_static));
    cls->defineFinalizeFunction(_SE(js_cc_render_Factory_finalize));
    cls->install();
    JSBClassType::registerClass<cc::render::Factory>(cls);

    __jsb_cc_render_Factory_proto = cls->getProto();
    __jsb_cc_render_Factory_class = cls;


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

    js_register_render_Setter(ns);
    js_register_render_ComputePassBuilder(ns);
    js_register_render_ComputeQueueBuilder(ns);
    js_register_render_CopyPassBuilder(ns);
    js_register_render_Factory(ns);
    js_register_render_LayoutGraphBuilder(ns);
    js_register_render_MovePassBuilder(ns);
    js_register_render_PipelineRuntime(ns);
    js_register_render_Pipeline(ns);
    js_register_render_RasterPassBuilder(ns);
    js_register_render_RasterQueueBuilder(ns);
    js_register_render_SceneTask(ns);
    js_register_render_SceneTransversal(ns);
    js_register_render_SceneVisitor(ns);
    return true;
}

// clang-format on