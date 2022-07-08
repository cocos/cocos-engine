
// clang-format off
#include "cocos/bindings/auto/jsb_2d_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "2d/renderer/RenderDrawInfo.h"
#include "2d/renderer/UIMeshBuffer.h"
#include "2d/renderer/Batcher2d.h"
#include "2d/renderer/RenderEntity.h"
#include "2d/renderer/UIModelProxy.h"
#include "2d/renderer/StencilManager.h"
#include "cocos/bindings/auto/jsb_scene_auto.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif

#if CC_DEBUG
static bool js_2d_getter_return_true(se::State& s) // NOLINT(readability-identifier-naming)
{
    s.rval().setBoolean(true);
    return true;
}
SE_BIND_PROP_GET(js_2d_getter_return_true)
#endif
se::Object* __jsb_cc_UIMeshBuffer_proto = nullptr; // NOLINT
se::Class* __jsb_cc_UIMeshBuffer_class = nullptr;  // NOLINT

static bool js_2d_UIMeshBuffer_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_destroy : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_UIMeshBuffer_destroy)

static bool js_2d_UIMeshBuffer_getIData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_getIData : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned short* result = cobj->getIData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_UIMeshBuffer_getIData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_UIMeshBuffer_getIData)

static bool js_2d_UIMeshBuffer_getVData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_getVData : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float* result = cobj->getVData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_UIMeshBuffer_getVData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_UIMeshBuffer_getVData)

static bool js_2d_UIMeshBuffer_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_initialize : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<cc::gfx::Device*, false> arg0 = {};
        HolderType<std::vector<cc::gfx::Attribute *>, true> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        HolderType<unsigned int, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_UIMeshBuffer_initialize : Error processing arguments");
        cobj->initialize(arg0.value(), std::move(arg1.value()), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_2d_UIMeshBuffer_initialize)

static bool js_2d_UIMeshBuffer_reset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_reset : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->reset();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_UIMeshBuffer_reset)

static bool js_2d_UIMeshBuffer_setIData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_setIData : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned short*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_UIMeshBuffer_setIData : Error processing arguments");
        cobj->setIData(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_UIMeshBuffer_setIData)

static bool js_2d_UIMeshBuffer_setVData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_setVData : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_UIMeshBuffer_setVData : Error processing arguments");
        cobj->setVData(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_UIMeshBuffer_setVData)

static bool js_2d_UIMeshBuffer_syncSharedBufferToNative(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_syncSharedBufferToNative : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_UIMeshBuffer_syncSharedBufferToNative : Error processing arguments");
        cobj->syncSharedBufferToNative(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_UIMeshBuffer_syncSharedBufferToNative)

static bool js_2d_UIMeshBuffer_uploadBuffers(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_uploadBuffers : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->uploadBuffers();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_UIMeshBuffer_uploadBuffers)

SE_DECLARE_FINALIZE_FUNC(js_cc_UIMeshBuffer_finalize)

static bool js_2d_UIMeshBuffer_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::UIMeshBuffer);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_2d_UIMeshBuffer_constructor, __jsb_cc_UIMeshBuffer_class, js_cc_UIMeshBuffer_finalize)

static bool js_cc_UIMeshBuffer_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_UIMeshBuffer_finalize)

bool js_register_2d_UIMeshBuffer(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("UIMeshBuffer", obj, nullptr, _SE(js_2d_UIMeshBuffer_constructor));

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_2d_getter_return_true), nullptr);
#endif
    cls->defineProperty("vData", _SE(js_2d_UIMeshBuffer_getVData_asGetter), _SE(js_2d_UIMeshBuffer_setVData_asSetter));
    cls->defineProperty("iData", _SE(js_2d_UIMeshBuffer_getIData_asGetter), _SE(js_2d_UIMeshBuffer_setIData_asSetter));
    cls->defineFunction("destroy", _SE(js_2d_UIMeshBuffer_destroy));
    cls->defineFunction("initialize", _SE(js_2d_UIMeshBuffer_initialize));
    cls->defineFunction("reset", _SE(js_2d_UIMeshBuffer_reset));
    cls->defineFunction("syncSharedBufferToNative", _SE(js_2d_UIMeshBuffer_syncSharedBufferToNative));
    cls->defineFunction("uploadBuffers", _SE(js_2d_UIMeshBuffer_uploadBuffers));
    cls->defineFinalizeFunction(_SE(js_cc_UIMeshBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::UIMeshBuffer>(cls);

    __jsb_cc_UIMeshBuffer_proto = cls->getProto();
    __jsb_cc_UIMeshBuffer_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_RenderDrawInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_RenderDrawInfo_class = nullptr;  // NOLINT

static bool js_2d_RenderDrawInfo_getAccId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getAccId : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getAccId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getAccId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderDrawInfo_getAccId)

static bool js_2d_RenderDrawInfo_getAttrSharedBufferForJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getAttrSharedBufferForJS : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::ArrayBuffer& result = cobj->getAttrSharedBufferForJS();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getAttrSharedBufferForJS : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_RenderDrawInfo_getAttrSharedBufferForJS)

static bool js_2d_RenderDrawInfo_getBlendHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getBlendHash : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getBlendHash();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getBlendHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderDrawInfo_getBlendHash)

static bool js_2d_RenderDrawInfo_getBufferId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getBufferId : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getBufferId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getBufferId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderDrawInfo_getBufferId)

static bool js_2d_RenderDrawInfo_getDataHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getDataHash : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getDataHash();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getDataHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderDrawInfo_getDataHash)

static bool js_2d_RenderDrawInfo_getIDataBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getIDataBuffer : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned short* result = cobj->getIDataBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getIDataBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderDrawInfo_getIDataBuffer)

static bool js_2d_RenderDrawInfo_getIbBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getIbBuffer : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned short* result = cobj->getIbBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getIbBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderDrawInfo_getIbBuffer)

static bool js_2d_RenderDrawInfo_getIbCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getIbCount : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getIbCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getIbCount : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderDrawInfo_getIbCount)

static bool js_2d_RenderDrawInfo_getIndexOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getIndexOffset : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getIndexOffset();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getIndexOffset : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderDrawInfo_getIndexOffset)

static bool js_2d_RenderDrawInfo_getIsMeshBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getIsMeshBuffer : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getIsMeshBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getIsMeshBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderDrawInfo_getIsMeshBuffer)

static bool js_2d_RenderDrawInfo_getMaterial(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getMaterial : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Material* result = cobj->getMaterial();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getMaterial : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderDrawInfo_getMaterial)

static bool js_2d_RenderDrawInfo_getMeshBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getMeshBuffer : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::UIMeshBuffer* result = cobj->getMeshBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getMeshBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_RenderDrawInfo_getMeshBuffer)

static bool js_2d_RenderDrawInfo_getModel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getModel : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Model* result = cobj->getModel();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getModel : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_RenderDrawInfo_getModel)

static bool js_2d_RenderDrawInfo_getSampler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getSampler : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Sampler* result = cobj->getSampler();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getSampler : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderDrawInfo_getSampler)

static bool js_2d_RenderDrawInfo_getStencilStage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getStencilStage : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getStencilStage();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getStencilStage : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderDrawInfo_getStencilStage)

static bool js_2d_RenderDrawInfo_getTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getTexture : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Texture* result = cobj->getTexture();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getTexture : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderDrawInfo_getTexture)

static bool js_2d_RenderDrawInfo_getTextureHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getTextureHash : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getTextureHash();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getTextureHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderDrawInfo_getTextureHash)

static bool js_2d_RenderDrawInfo_getVDataBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getVDataBuffer : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float* result = cobj->getVDataBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getVDataBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderDrawInfo_getVDataBuffer)

static bool js_2d_RenderDrawInfo_getVbBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getVbBuffer : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float* result = cobj->getVbBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getVbBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderDrawInfo_getVbBuffer)

static bool js_2d_RenderDrawInfo_getVbCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getVbCount : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getVbCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getVbCount : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderDrawInfo_getVbCount)

static bool js_2d_RenderDrawInfo_getVertDirty(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getVertDirty : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getVertDirty();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getVertDirty : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderDrawInfo_getVertDirty)

static bool js_2d_RenderDrawInfo_getVertexOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_getVertexOffset : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getVertexOffset();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_getVertexOffset : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderDrawInfo_getVertexOffset)

static bool js_2d_RenderDrawInfo_requestIA(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_requestIA : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Device*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_requestIA : Error processing arguments");
        cc::gfx::InputAssembler* result = cobj->requestIA(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_requestIA : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_RenderDrawInfo_requestIA)

static bool js_2d_RenderDrawInfo_resetMeshIA(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_resetMeshIA : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->resetMeshIA();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_RenderDrawInfo_resetMeshIA)

static bool js_2d_RenderDrawInfo_setAccId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setAccId : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setAccId : Error processing arguments");
        cobj->setAccId(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderDrawInfo_setAccId)

static bool js_2d_RenderDrawInfo_setBlendHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setBlendHash : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setBlendHash : Error processing arguments");
        cobj->setBlendHash(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderDrawInfo_setBlendHash)

static bool js_2d_RenderDrawInfo_setBufferId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setBufferId : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setBufferId : Error processing arguments");
        cobj->setBufferId(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderDrawInfo_setBufferId)

static bool js_2d_RenderDrawInfo_setDataHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setDataHash : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setDataHash : Error processing arguments");
        cobj->setDataHash(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderDrawInfo_setDataHash)

static bool js_2d_RenderDrawInfo_setIDataBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setIDataBuffer : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned short*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setIDataBuffer : Error processing arguments");
        cobj->setIDataBuffer(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderDrawInfo_setIDataBuffer)

static bool js_2d_RenderDrawInfo_setIbBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setIbBuffer : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned short*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setIbBuffer : Error processing arguments");
        cobj->setIbBuffer(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderDrawInfo_setIbBuffer)

static bool js_2d_RenderDrawInfo_setIbCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setIbCount : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setIbCount : Error processing arguments");
        cobj->setIbCount(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderDrawInfo_setIbCount)

static bool js_2d_RenderDrawInfo_setIndexOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setIndexOffset : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setIndexOffset : Error processing arguments");
        cobj->setIndexOffset(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderDrawInfo_setIndexOffset)

static bool js_2d_RenderDrawInfo_setIsMeshBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setIsMeshBuffer : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setIsMeshBuffer : Error processing arguments");
        cobj->setIsMeshBuffer(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderDrawInfo_setIsMeshBuffer)

static bool js_2d_RenderDrawInfo_setMaterial(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setMaterial : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Material*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setMaterial : Error processing arguments");
        cobj->setMaterial(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderDrawInfo_setMaterial)

static bool js_2d_RenderDrawInfo_setModel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setModel : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Model*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setModel : Error processing arguments");
        cobj->setModel(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_RenderDrawInfo_setModel)

static bool js_2d_RenderDrawInfo_setRender2dBufferToNative(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setRender2dBufferToNative : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<unsigned char*, false> arg0 = {};
        HolderType<uint8_t, false> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setRender2dBufferToNative : Error processing arguments");
        cobj->setRender2dBufferToNative(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_2d_RenderDrawInfo_setRender2dBufferToNative)

static bool js_2d_RenderDrawInfo_setSampler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setSampler : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Sampler*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setSampler : Error processing arguments");
        cobj->setSampler(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderDrawInfo_setSampler)

static bool js_2d_RenderDrawInfo_setStencilStage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setStencilStage : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setStencilStage : Error processing arguments");
        cobj->setStencilStage(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderDrawInfo_setStencilStage)

static bool js_2d_RenderDrawInfo_setTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setTexture : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Texture*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setTexture : Error processing arguments");
        cobj->setTexture(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderDrawInfo_setTexture)

static bool js_2d_RenderDrawInfo_setTextureHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setTextureHash : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setTextureHash : Error processing arguments");
        cobj->setTextureHash(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderDrawInfo_setTextureHash)

static bool js_2d_RenderDrawInfo_setVDataBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setVDataBuffer : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setVDataBuffer : Error processing arguments");
        cobj->setVDataBuffer(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderDrawInfo_setVDataBuffer)

static bool js_2d_RenderDrawInfo_setVbBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setVbBuffer : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setVbBuffer : Error processing arguments");
        cobj->setVbBuffer(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderDrawInfo_setVbBuffer)

static bool js_2d_RenderDrawInfo_setVbCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setVbCount : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setVbCount : Error processing arguments");
        cobj->setVbCount(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderDrawInfo_setVbCount)

static bool js_2d_RenderDrawInfo_setVertDirty(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setVertDirty : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setVertDirty : Error processing arguments");
        cobj->setVertDirty(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderDrawInfo_setVertDirty)

static bool js_2d_RenderDrawInfo_setVertexOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_setVertexOffset : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderDrawInfo_setVertexOffset : Error processing arguments");
        cobj->setVertexOffset(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderDrawInfo_setVertexOffset)

static bool js_2d_RenderDrawInfo_uploadBuffers(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderDrawInfo>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderDrawInfo_uploadBuffers : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->uploadBuffers();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_RenderDrawInfo_uploadBuffers)

SE_DECLARE_FINALIZE_FUNC(js_cc_RenderDrawInfo_finalize)

static bool js_2d_RenderDrawInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<cc::Batcher2d*, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::RenderDrawInfo, arg0.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::RenderDrawInfo);
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 3) {
            HolderType<int, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<unsigned int, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<unsigned int, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::RenderDrawInfo, arg0.value(), arg1.value(), arg2.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_2d_RenderDrawInfo_constructor, __jsb_cc_RenderDrawInfo_class, js_cc_RenderDrawInfo_finalize)

static bool js_cc_RenderDrawInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_RenderDrawInfo_finalize)

bool js_register_2d_RenderDrawInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RenderDrawInfo", obj, nullptr, _SE(js_2d_RenderDrawInfo_constructor));

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_2d_getter_return_true), nullptr);
#endif
    cls->defineProperty("bufferId", _SE(js_2d_RenderDrawInfo_getBufferId_asGetter), _SE(js_2d_RenderDrawInfo_setBufferId_asSetter));
    cls->defineProperty("accId", _SE(js_2d_RenderDrawInfo_getAccId_asGetter), _SE(js_2d_RenderDrawInfo_setAccId_asSetter));
    cls->defineProperty("vertexOffset", _SE(js_2d_RenderDrawInfo_getVertexOffset_asGetter), _SE(js_2d_RenderDrawInfo_setVertexOffset_asSetter));
    cls->defineProperty("indexOffset", _SE(js_2d_RenderDrawInfo_getIndexOffset_asGetter), _SE(js_2d_RenderDrawInfo_setIndexOffset_asSetter));
    cls->defineProperty("vbBuffer", _SE(js_2d_RenderDrawInfo_getVbBuffer_asGetter), _SE(js_2d_RenderDrawInfo_setVbBuffer_asSetter));
    cls->defineProperty("ibBuffer", _SE(js_2d_RenderDrawInfo_getIbBuffer_asGetter), _SE(js_2d_RenderDrawInfo_setIbBuffer_asSetter));
    cls->defineProperty("vDataBuffer", _SE(js_2d_RenderDrawInfo_getVDataBuffer_asGetter), _SE(js_2d_RenderDrawInfo_setVDataBuffer_asSetter));
    cls->defineProperty("iDataBuffer", _SE(js_2d_RenderDrawInfo_getIDataBuffer_asGetter), _SE(js_2d_RenderDrawInfo_setIDataBuffer_asSetter));
    cls->defineProperty("vbCount", _SE(js_2d_RenderDrawInfo_getVbCount_asGetter), _SE(js_2d_RenderDrawInfo_setVbCount_asSetter));
    cls->defineProperty("ibCount", _SE(js_2d_RenderDrawInfo_getIbCount_asGetter), _SE(js_2d_RenderDrawInfo_setIbCount_asSetter));
    cls->defineProperty("vertDirty", _SE(js_2d_RenderDrawInfo_getVertDirty_asGetter), _SE(js_2d_RenderDrawInfo_setVertDirty_asSetter));
    cls->defineProperty("dataHash", _SE(js_2d_RenderDrawInfo_getDataHash_asGetter), _SE(js_2d_RenderDrawInfo_setDataHash_asSetter));
    cls->defineProperty("stencilStage", _SE(js_2d_RenderDrawInfo_getStencilStage_asGetter), _SE(js_2d_RenderDrawInfo_setStencilStage_asSetter));
    cls->defineProperty("isMeshBuffer", _SE(js_2d_RenderDrawInfo_getIsMeshBuffer_asGetter), _SE(js_2d_RenderDrawInfo_setIsMeshBuffer_asSetter));
    cls->defineProperty("material", _SE(js_2d_RenderDrawInfo_getMaterial_asGetter), _SE(js_2d_RenderDrawInfo_setMaterial_asSetter));
    cls->defineProperty("texture", _SE(js_2d_RenderDrawInfo_getTexture_asGetter), _SE(js_2d_RenderDrawInfo_setTexture_asSetter));
    cls->defineProperty("textureHash", _SE(js_2d_RenderDrawInfo_getTextureHash_asGetter), _SE(js_2d_RenderDrawInfo_setTextureHash_asSetter));
    cls->defineProperty("sampler", _SE(js_2d_RenderDrawInfo_getSampler_asGetter), _SE(js_2d_RenderDrawInfo_setSampler_asSetter));
    cls->defineProperty("blendHash", _SE(js_2d_RenderDrawInfo_getBlendHash_asGetter), _SE(js_2d_RenderDrawInfo_setBlendHash_asSetter));
    cls->defineFunction("getAttrSharedBufferForJS", _SE(js_2d_RenderDrawInfo_getAttrSharedBufferForJS));
    cls->defineFunction("getMeshBuffer", _SE(js_2d_RenderDrawInfo_getMeshBuffer));
    cls->defineFunction("getModel", _SE(js_2d_RenderDrawInfo_getModel));
    cls->defineFunction("requestIA", _SE(js_2d_RenderDrawInfo_requestIA));
    cls->defineFunction("resetMeshIA", _SE(js_2d_RenderDrawInfo_resetMeshIA));
    cls->defineFunction("setModel", _SE(js_2d_RenderDrawInfo_setModel));
    cls->defineFunction("setRender2dBufferToNative", _SE(js_2d_RenderDrawInfo_setRender2dBufferToNative));
    cls->defineFunction("uploadBuffers", _SE(js_2d_RenderDrawInfo_uploadBuffers));
    cls->defineFinalizeFunction(_SE(js_cc_RenderDrawInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::RenderDrawInfo>(cls);

    __jsb_cc_RenderDrawInfo_proto = cls->getProto();
    __jsb_cc_RenderDrawInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_StencilManager_proto = nullptr; // NOLINT
se::Class* __jsb_cc_StencilManager_class = nullptr;  // NOLINT

static bool js_2d_StencilManager_getDepthStencilState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::StencilManager>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_StencilManager_getDepthStencilState : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::StencilStage, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_StencilManager_getDepthStencilState : Error processing arguments");
        cc::gfx::DepthStencilState* result = cobj->getDepthStencilState(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_StencilManager_getDepthStencilState : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 2) {
        HolderType<cc::StencilStage, false> arg0 = {};
        HolderType<cc::Material*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_StencilManager_getDepthStencilState : Error processing arguments");
        cc::gfx::DepthStencilState* result = cobj->getDepthStencilState(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_StencilManager_getDepthStencilState : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_2d_StencilManager_getDepthStencilState)

static bool js_2d_StencilManager_getExitWriteMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::StencilManager>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_StencilManager_getExitWriteMask : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getExitWriteMask();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_StencilManager_getExitWriteMask : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_StencilManager_getExitWriteMask)

static bool js_2d_StencilManager_getStencilHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::StencilManager>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_StencilManager_getStencilHash : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::StencilStage, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_StencilManager_getStencilHash : Error processing arguments");
        unsigned int result = cobj->getStencilHash(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_StencilManager_getStencilHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_StencilManager_getStencilHash)

static bool js_2d_StencilManager_getStencilRef(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::StencilManager>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_StencilManager_getStencilRef : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getStencilRef();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_StencilManager_getStencilRef : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_StencilManager_getStencilRef)

static bool js_2d_StencilManager_getStencilSharedBufferForJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::StencilManager>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_StencilManager_getStencilSharedBufferForJS : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::ArrayBuffer& result = cobj->getStencilSharedBufferForJS();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_StencilManager_getStencilSharedBufferForJS : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_StencilManager_getStencilSharedBufferForJS)

static bool js_2d_StencilManager_getStencilStage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::StencilManager>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_StencilManager_getStencilStage : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getStencilStage());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_StencilManager_getStencilStage : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_StencilManager_getStencilStage)

static bool js_2d_StencilManager_getWriteMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::StencilManager>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_StencilManager_getWriteMask : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getWriteMask();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_StencilManager_getWriteMask : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_StencilManager_getWriteMask)

static bool js_2d_StencilManager_setDepthStencilStateFromStage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::StencilManager>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_StencilManager_setDepthStencilStateFromStage : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::StencilStage, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_StencilManager_setDepthStencilStateFromStage : Error processing arguments");
        cobj->setDepthStencilStateFromStage(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_StencilManager_setDepthStencilStateFromStage)

static bool js_2d_StencilManager_setStencilStage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::StencilManager>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_StencilManager_setStencilStage : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_StencilManager_setStencilStage : Error processing arguments");
        cobj->setStencilStage(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_StencilManager_setStencilStage)

static bool js_2d_StencilManager_getInstance_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::StencilManager* result = cc::StencilManager::getInstance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_StencilManager_getInstance_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_StencilManager_getInstance_static)

SE_DECLARE_FINALIZE_FUNC(js_cc_StencilManager_finalize)

static bool js_2d_StencilManager_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::StencilManager);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_2d_StencilManager_constructor, __jsb_cc_StencilManager_class, js_cc_StencilManager_finalize)

static bool js_cc_StencilManager_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_StencilManager_finalize)

bool js_register_2d_StencilManager(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("StencilManager", obj, nullptr, _SE(js_2d_StencilManager_constructor));

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_2d_getter_return_true), nullptr);
#endif
    cls->defineFunction("getDepthStencilState", _SE(js_2d_StencilManager_getDepthStencilState));
    cls->defineFunction("getExitWriteMask", _SE(js_2d_StencilManager_getExitWriteMask));
    cls->defineFunction("getStencilHash", _SE(js_2d_StencilManager_getStencilHash));
    cls->defineFunction("getStencilRef", _SE(js_2d_StencilManager_getStencilRef));
    cls->defineFunction("getStencilSharedBufferForJS", _SE(js_2d_StencilManager_getStencilSharedBufferForJS));
    cls->defineFunction("getStencilStage", _SE(js_2d_StencilManager_getStencilStage));
    cls->defineFunction("getWriteMask", _SE(js_2d_StencilManager_getWriteMask));
    cls->defineFunction("setDepthStencilStateFromStage", _SE(js_2d_StencilManager_setDepthStencilStateFromStage));
    cls->defineFunction("setStencilStage", _SE(js_2d_StencilManager_setStencilStage));
    cls->defineStaticFunction("getInstance", _SE(js_2d_StencilManager_getInstance_static));
    cls->defineFinalizeFunction(_SE(js_cc_StencilManager_finalize));
    cls->install();
    JSBClassType::registerClass<cc::StencilManager>(cls);

    __jsb_cc_StencilManager_proto = cls->getProto();
    __jsb_cc_StencilManager_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_RenderEntity_proto = nullptr; // NOLINT
se::Class* __jsb_cc_RenderEntity_class = nullptr;  // NOLINT

static bool js_2d_RenderEntity_addDynamicRenderDrawInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_addDynamicRenderDrawInfo : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::RenderDrawInfo*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_addDynamicRenderDrawInfo : Error processing arguments");
        cobj->addDynamicRenderDrawInfo(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_RenderEntity_addDynamicRenderDrawInfo)

static bool js_2d_RenderEntity_getCommitModelMaterial(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getCommitModelMaterial : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Material* result = cobj->getCommitModelMaterial();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getCommitModelMaterial : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getCommitModelMaterial)

static bool js_2d_RenderEntity_getCustomMaterial(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getCustomMaterial : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Material* result = cobj->getCustomMaterial();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getCustomMaterial : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getCustomMaterial)

static bool js_2d_RenderEntity_getEntitySharedBufferForJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getEntitySharedBufferForJS : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::ArrayBuffer& result = cobj->getEntitySharedBufferForJS();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getEntitySharedBufferForJS : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_RenderEntity_getEntitySharedBufferForJS)

static bool js_2d_RenderEntity_getLocalOpacity(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getLocalOpacity : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getLocalOpacity();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getLocalOpacity : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_RenderEntity_getLocalOpacity)

static bool js_2d_RenderEntity_getNode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getNode : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Node* result = cobj->getNode();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getNode : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getNode)

static bool js_2d_RenderEntity_getOpacity(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getOpacity : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getOpacity();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getOpacity : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_RenderEntity_getOpacity)

static bool js_2d_RenderEntity_getStaticDrawInfoSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getStaticDrawInfoSize : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getStaticDrawInfoSize();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getStaticDrawInfoSize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getStaticDrawInfoSize)

static bool js_2d_RenderEntity_getStaticRenderDrawInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getStaticRenderDrawInfo : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getStaticRenderDrawInfo : Error processing arguments");
        cc::RenderDrawInfo* result = cobj->getStaticRenderDrawInfo(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getStaticRenderDrawInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_RenderEntity_getStaticRenderDrawInfo)

static bool js_2d_RenderEntity_getStaticRenderDrawInfos(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getStaticRenderDrawInfos : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::array<cc::RenderDrawInfo, 4>& result = cobj->getStaticRenderDrawInfos();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getStaticRenderDrawInfos : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_RenderEntity_getStaticRenderDrawInfos)

static bool js_2d_RenderEntity_getStencilStage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getStencilStage : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getStencilStage();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getStencilStage : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getStencilStage)

static bool js_2d_RenderEntity_removeDynamicRenderDrawInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_removeDynamicRenderDrawInfo : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->removeDynamicRenderDrawInfo();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_RenderEntity_removeDynamicRenderDrawInfo)

static bool js_2d_RenderEntity_setColorDirty(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setColorDirty : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setColorDirty : Error processing arguments");
        cobj->setColorDirty(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_RenderEntity_setColorDirty)

static bool js_2d_RenderEntity_setCommitModelMaterial(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setCommitModelMaterial : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Material*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setCommitModelMaterial : Error processing arguments");
        cobj->setCommitModelMaterial(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setCommitModelMaterial)

static bool js_2d_RenderEntity_setCustomMaterial(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setCustomMaterial : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Material*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setCustomMaterial : Error processing arguments");
        cobj->setCustomMaterial(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setCustomMaterial)

static bool js_2d_RenderEntity_setDynamicRenderDrawInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setDynamicRenderDrawInfo : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::RenderDrawInfo*, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setDynamicRenderDrawInfo : Error processing arguments");
        cobj->setDynamicRenderDrawInfo(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_2d_RenderEntity_setDynamicRenderDrawInfo)

static bool js_2d_RenderEntity_setNode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setNode : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setNode : Error processing arguments");
        cobj->setNode(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setNode)

static bool js_2d_RenderEntity_setOpacity(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setOpacity : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setOpacity : Error processing arguments");
        cobj->setOpacity(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_RenderEntity_setOpacity)

static bool js_2d_RenderEntity_setRenderEntityType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setRenderEntityType : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setRenderEntityType : Error processing arguments");
        cobj->setRenderEntityType(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_RenderEntity_setRenderEntityType)

static bool js_2d_RenderEntity_setStaticDrawInfoSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setStaticDrawInfoSize : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setStaticDrawInfoSize : Error processing arguments");
        cobj->setStaticDrawInfoSize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setStaticDrawInfoSize)

static bool js_2d_RenderEntity_setStencilStage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setStencilStage : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setStencilStage : Error processing arguments");
        cobj->setStencilStage(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setStencilStage)

SE_DECLARE_FINALIZE_FUNC(js_cc_RenderEntity_finalize)

static bool js_2d_RenderEntity_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<cc::Batcher2d*, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::RenderEntity, arg0.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::RenderEntity);
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_2d_RenderEntity_constructor, __jsb_cc_RenderEntity_class, js_cc_RenderEntity_finalize)

static bool js_cc_RenderEntity_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_RenderEntity_finalize)

bool js_register_2d_RenderEntity(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RenderEntity", obj, nullptr, _SE(js_2d_RenderEntity_constructor));

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_2d_getter_return_true), nullptr);
#endif
    cls->defineProperty("node", _SE(js_2d_RenderEntity_getNode_asGetter), _SE(js_2d_RenderEntity_setNode_asSetter));
    cls->defineProperty("staticDrawInfoSize", _SE(js_2d_RenderEntity_getStaticDrawInfoSize_asGetter), _SE(js_2d_RenderEntity_setStaticDrawInfoSize_asSetter));
    cls->defineProperty("stencilStage", _SE(js_2d_RenderEntity_getStencilStage_asGetter), _SE(js_2d_RenderEntity_setStencilStage_asSetter));
    cls->defineProperty("customMaterial", _SE(js_2d_RenderEntity_getCustomMaterial_asGetter), _SE(js_2d_RenderEntity_setCustomMaterial_asSetter));
    cls->defineProperty("commitModelMaterial", _SE(js_2d_RenderEntity_getCommitModelMaterial_asGetter), _SE(js_2d_RenderEntity_setCommitModelMaterial_asSetter));
    cls->defineFunction("addDynamicRenderDrawInfo", _SE(js_2d_RenderEntity_addDynamicRenderDrawInfo));
    cls->defineFunction("getEntitySharedBufferForJS", _SE(js_2d_RenderEntity_getEntitySharedBufferForJS));
    cls->defineFunction("getLocalOpacity", _SE(js_2d_RenderEntity_getLocalOpacity));
    cls->defineFunction("getOpacity", _SE(js_2d_RenderEntity_getOpacity));
    cls->defineFunction("getStaticRenderDrawInfo", _SE(js_2d_RenderEntity_getStaticRenderDrawInfo));
    cls->defineFunction("getStaticRenderDrawInfos", _SE(js_2d_RenderEntity_getStaticRenderDrawInfos));
    cls->defineFunction("removeDynamicRenderDrawInfo", _SE(js_2d_RenderEntity_removeDynamicRenderDrawInfo));
    cls->defineFunction("setColorDirty", _SE(js_2d_RenderEntity_setColorDirty));
    cls->defineFunction("setDynamicRenderDrawInfo", _SE(js_2d_RenderEntity_setDynamicRenderDrawInfo));
    cls->defineFunction("setOpacity", _SE(js_2d_RenderEntity_setOpacity));
    cls->defineFunction("setRenderEntityType", _SE(js_2d_RenderEntity_setRenderEntityType));
    cls->defineFinalizeFunction(_SE(js_cc_RenderEntity_finalize));
    cls->install();
    JSBClassType::registerClass<cc::RenderEntity>(cls);

    __jsb_cc_RenderEntity_proto = cls->getProto();
    __jsb_cc_RenderEntity_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_Batcher2d_proto = nullptr; // NOLINT
se::Class* __jsb_cc_Batcher2d_class = nullptr;  // NOLINT

static bool js_2d_Batcher2d_addRootNode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_addRootNode : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_Batcher2d_addRootNode : Error processing arguments");
        cobj->addRootNode(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_addRootNode)

static bool js_2d_Batcher2d_handleColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_handleColor : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<cc::RenderEntity*, false> arg0 = {};
        HolderType<cc::RenderDrawInfo*, false> arg1 = {};
        HolderType<cc::Node*, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_Batcher2d_handleColor : Error processing arguments");
        cobj->handleColor(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_handleColor)

static bool js_2d_Batcher2d_handleDynamicDrawInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_handleDynamicDrawInfo : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::RenderEntity*, false> arg0 = {};
        HolderType<cc::RenderDrawInfo*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_Batcher2d_handleDynamicDrawInfo : Error processing arguments");
        cobj->handleDynamicDrawInfo(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_handleDynamicDrawInfo)

static bool js_2d_Batcher2d_handleStaticDrawInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_handleStaticDrawInfo : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<cc::RenderEntity*, false> arg0 = {};
        HolderType<cc::RenderDrawInfo*, false> arg1 = {};
        HolderType<cc::Node*, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_Batcher2d_handleStaticDrawInfo : Error processing arguments");
        cobj->handleStaticDrawInfo(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_handleStaticDrawInfo)

static bool js_2d_Batcher2d_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_initialize : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->initialize();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_Batcher2d_initialize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_initialize)

static bool js_2d_Batcher2d_releaseDescriptorSetCache(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_releaseDescriptorSetCache : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::gfx::Texture*, false> arg0 = {};
        HolderType<cc::gfx::Sampler*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_Batcher2d_releaseDescriptorSetCache : Error processing arguments");
        cobj->releaseDescriptorSetCache(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_releaseDescriptorSetCache)

static bool js_2d_Batcher2d_reset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_reset : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->reset();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_reset)

static bool js_2d_Batcher2d_syncMeshBuffersToNative(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_syncMeshBuffersToNative : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<std::vector<cc::UIMeshBuffer *>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_Batcher2d_syncMeshBuffersToNative : Error processing arguments");
        cobj->syncMeshBuffersToNative(arg0.value(), std::move(arg1.value()));
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_syncMeshBuffersToNative)

static bool js_2d_Batcher2d_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_update : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->update();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_update)

static bool js_2d_Batcher2d_uploadBuffers(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_uploadBuffers : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->uploadBuffers();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_uploadBuffers)

SE_DECLARE_FINALIZE_FUNC(js_cc_Batcher2d_finalize)

static bool js_2d_Batcher2d_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<cc::Root*, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Batcher2d, arg0.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Batcher2d);
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_2d_Batcher2d_constructor, __jsb_cc_Batcher2d_class, js_cc_Batcher2d_finalize)

static bool js_cc_Batcher2d_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_Batcher2d_finalize)

bool js_register_2d_Batcher2d(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Batcher2d", obj, nullptr, _SE(js_2d_Batcher2d_constructor));

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_2d_getter_return_true), nullptr);
#endif
    cls->defineFunction("addRootNode", _SE(js_2d_Batcher2d_addRootNode));
    cls->defineFunction("handleColor", _SE(js_2d_Batcher2d_handleColor));
    cls->defineFunction("handleDynamicDrawInfo", _SE(js_2d_Batcher2d_handleDynamicDrawInfo));
    cls->defineFunction("handleStaticDrawInfo", _SE(js_2d_Batcher2d_handleStaticDrawInfo));
    cls->defineFunction("initialize", _SE(js_2d_Batcher2d_initialize));
    cls->defineFunction("releaseDescriptorSetCache", _SE(js_2d_Batcher2d_releaseDescriptorSetCache));
    cls->defineFunction("reset", _SE(js_2d_Batcher2d_reset));
    cls->defineFunction("syncMeshBuffersToNative", _SE(js_2d_Batcher2d_syncMeshBuffersToNative));
    cls->defineFunction("update", _SE(js_2d_Batcher2d_update));
    cls->defineFunction("uploadBuffers", _SE(js_2d_Batcher2d_uploadBuffers));
    cls->defineFinalizeFunction(_SE(js_cc_Batcher2d_finalize));
    cls->install();
    JSBClassType::registerClass<cc::Batcher2d>(cls);

    __jsb_cc_Batcher2d_proto = cls->getProto();
    __jsb_cc_Batcher2d_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_UIModelProxy_proto = nullptr; // NOLINT
se::Class* __jsb_cc_UIModelProxy_class = nullptr;  // NOLINT

static bool js_2d_UIModelProxy_activeSubModel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIModelProxy>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_UIModelProxy_activeSubModel : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<uint8_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_UIModelProxy_activeSubModel : Error processing arguments");
        cobj->activeSubModel(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_UIModelProxy_activeSubModel)

static bool js_2d_UIModelProxy_attachDrawInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIModelProxy>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_UIModelProxy_attachDrawInfo : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->attachDrawInfo();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_UIModelProxy_attachDrawInfo)

static bool js_2d_UIModelProxy_attachNode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIModelProxy>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_UIModelProxy_attachNode : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_UIModelProxy_attachNode : Error processing arguments");
        cobj->attachNode(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_UIModelProxy_attachNode)

static bool js_2d_UIModelProxy_clear(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIModelProxy>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_UIModelProxy_clear : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clear();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_UIModelProxy_clear)

static bool js_2d_UIModelProxy_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIModelProxy>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_UIModelProxy_destroy : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_UIModelProxy_destroy)

static bool js_2d_UIModelProxy_initModel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIModelProxy>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_UIModelProxy_initModel : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_UIModelProxy_initModel : Error processing arguments");
        cobj->initModel(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_UIModelProxy_initModel)

static bool js_2d_UIModelProxy_updateModels(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIModelProxy>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_UIModelProxy_updateModels : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Model*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_UIModelProxy_updateModels : Error processing arguments");
        cobj->updateModels(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_UIModelProxy_updateModels)

static bool js_2d_UIModelProxy_uploadData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIModelProxy>(s);
    // SE_PRECONDITION2(cobj, false, "js_2d_UIModelProxy_uploadData : Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->uploadData();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_UIModelProxy_uploadData)

SE_DECLARE_FINALIZE_FUNC(js_cc_UIModelProxy_finalize)

static bool js_2d_UIModelProxy_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::UIModelProxy);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_2d_UIModelProxy_constructor, __jsb_cc_UIModelProxy_class, js_cc_UIModelProxy_finalize)

static bool js_cc_UIModelProxy_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_UIModelProxy_finalize)

bool js_register_2d_UIModelProxy(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("UIModelProxy", obj, nullptr, _SE(js_2d_UIModelProxy_constructor));

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_2d_getter_return_true), nullptr);
#endif
    cls->defineFunction("activeSubModel", _SE(js_2d_UIModelProxy_activeSubModel));
    cls->defineFunction("attachDrawInfo", _SE(js_2d_UIModelProxy_attachDrawInfo));
    cls->defineFunction("attachNode", _SE(js_2d_UIModelProxy_attachNode));
    cls->defineFunction("clear", _SE(js_2d_UIModelProxy_clear));
    cls->defineFunction("destroy", _SE(js_2d_UIModelProxy_destroy));
    cls->defineFunction("initModel", _SE(js_2d_UIModelProxy_initModel));
    cls->defineFunction("updateModels", _SE(js_2d_UIModelProxy_updateModels));
    cls->defineFunction("uploadData", _SE(js_2d_UIModelProxy_uploadData));
    cls->defineFinalizeFunction(_SE(js_cc_UIModelProxy_finalize));
    cls->install();
    JSBClassType::registerClass<cc::UIModelProxy>(cls);

    __jsb_cc_UIModelProxy_proto = cls->getProto();
    __jsb_cc_UIModelProxy_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
bool register_all_2d(se::Object* obj)    // NOLINT
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("n2d", &nsVal, true))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("n2d", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_2d_Batcher2d(ns);
    js_register_2d_RenderDrawInfo(ns);
    js_register_2d_RenderEntity(ns);
    js_register_2d_StencilManager(ns);
    js_register_2d_UIMeshBuffer(ns);
    js_register_2d_UIModelProxy(ns);
    return true;
}

// clang-format on