
// clang-format off
#include "cocos/bindings/auto/jsb_2d_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "2d/renderer/RenderEntity.h"
#include "2d/renderer/UIMeshBuffer.h"
#include "2d/renderer/Batcher2d.h"

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
se::Object* __jsb_cc_RenderEntity_proto = nullptr; // NOLINT
se::Class* __jsb_cc_RenderEntity_class = nullptr;  // NOLINT

static bool js_2d_RenderEntity_ItIsDebugFuncInRenderEntity(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_ItIsDebugFuncInRenderEntity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->ItIsDebugFuncInRenderEntity();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_RenderEntity_ItIsDebugFuncInRenderEntity)

static bool js_2d_RenderEntity_getBlendHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getBlendHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getBlendHash();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getBlendHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getBlendHash)

static bool js_2d_RenderEntity_getBufferId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getBufferId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getBufferId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getBufferId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getBufferId)

static bool js_2d_RenderEntity_getCurrIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getCurrIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getCurrIndex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getCurrIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_RenderEntity_getCurrIndex)

static bool js_2d_RenderEntity_getDataHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getDataHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getDataHash();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getDataHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getDataHash)

static bool js_2d_RenderEntity_getIDataBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getIDataBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned short* result = cobj->getIDataBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getIDataBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getIDataBuffer)

static bool js_2d_RenderEntity_getIbBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getIbBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned short* result = cobj->getIbBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getIbBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getIbBuffer)

static bool js_2d_RenderEntity_getIndexOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getIndexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getIndexOffset();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getIndexOffset : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getIndexOffset)

static bool js_2d_RenderEntity_getIsMeshBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getIsMeshBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getIsMeshBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getIsMeshBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getIsMeshBuffer)

static bool js_2d_RenderEntity_getMaterial(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getMaterial : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Material* result = cobj->getMaterial();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getMaterial : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getMaterial)

static bool js_2d_RenderEntity_getNextIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getNextIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getNextIndex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getNextIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_RenderEntity_getNextIndex)

static bool js_2d_RenderEntity_getNode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getNode : Invalid Native Object");
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

static bool js_2d_RenderEntity_getRender2dLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getRender2dLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getRender2dLayout : Error processing arguments");
        cc::Render2dLayout* result = cobj->getRender2dLayout(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getRender2dLayout : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_RenderEntity_getRender2dLayout)

static bool js_2d_RenderEntity_getSampler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Sampler* result = cobj->getSampler();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getSampler : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getSampler)

static bool js_2d_RenderEntity_getStencilStage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getStencilStage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getStencilStage();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getStencilStage : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getStencilStage)

static bool js_2d_RenderEntity_getTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Texture* result = cobj->getTexture();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getTexture : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getTexture)

static bool js_2d_RenderEntity_getTextureHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getTextureHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getTextureHash();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getTextureHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getTextureHash)

static bool js_2d_RenderEntity_getVDataBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getVDataBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float* result = cobj->getVDataBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getVDataBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getVDataBuffer)

static bool js_2d_RenderEntity_getVbBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getVbBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float* result = cobj->getVbBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getVbBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getVbBuffer)

static bool js_2d_RenderEntity_getVertDirty(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getVertDirty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getVertDirty();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getVertDirty : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getVertDirty)

static bool js_2d_RenderEntity_getVertexOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getVertexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getVertexOffset();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_getVertexOffset : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_RenderEntity_getVertexOffset)

static bool js_2d_RenderEntity_setBlendHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setBlendHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setBlendHash : Error processing arguments");
        cobj->setBlendHash(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setBlendHash)

static bool js_2d_RenderEntity_setBufferId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setBufferId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setBufferId : Error processing arguments");
        cobj->setBufferId(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setBufferId)

static bool js_2d_RenderEntity_setCurrIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setCurrIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setCurrIndex : Error processing arguments");
        cobj->setCurrIndex(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_RenderEntity_setCurrIndex)

static bool js_2d_RenderEntity_setDataHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setDataHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setDataHash : Error processing arguments");
        cobj->setDataHash(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setDataHash)

static bool js_2d_RenderEntity_setIDataBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setIDataBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned short*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setIDataBuffer : Error processing arguments");
        cobj->setIDataBuffer(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setIDataBuffer)

static bool js_2d_RenderEntity_setIbBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setIbBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned short*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setIbBuffer : Error processing arguments");
        cobj->setIbBuffer(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setIbBuffer)

static bool js_2d_RenderEntity_setIndexOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setIndexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setIndexOffset : Error processing arguments");
        cobj->setIndexOffset(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setIndexOffset)

static bool js_2d_RenderEntity_setIsMeshBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setIsMeshBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setIsMeshBuffer : Error processing arguments");
        cobj->setIsMeshBuffer(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setIsMeshBuffer)

static bool js_2d_RenderEntity_setMaterial(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setMaterial : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Material*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setMaterial : Error processing arguments");
        cobj->setMaterial(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setMaterial)

static bool js_2d_RenderEntity_setNextIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setNextIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setNextIndex : Error processing arguments");
        cobj->setNextIndex(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_RenderEntity_setNextIndex)

static bool js_2d_RenderEntity_setNode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setNode : Invalid Native Object");
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

static bool js_2d_RenderEntity_setRender2dBufferToNative(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setRender2dBufferToNative : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setRender2dBufferToNative : Error processing arguments");
        cobj->setRender2dBufferToNative(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_2d_RenderEntity_setRender2dBufferToNative)

static bool js_2d_RenderEntity_setSampler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Sampler*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setSampler : Error processing arguments");
        cobj->setSampler(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setSampler)

static bool js_2d_RenderEntity_setStencilStage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setStencilStage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setStencilStage : Error processing arguments");
        cobj->setStencilStage(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setStencilStage)

static bool js_2d_RenderEntity_setTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Texture*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setTexture : Error processing arguments");
        cobj->setTexture(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setTexture)

static bool js_2d_RenderEntity_setTextureHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setTextureHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setTextureHash : Error processing arguments");
        cobj->setTextureHash(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setTextureHash)

static bool js_2d_RenderEntity_setVDataBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setVDataBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setVDataBuffer : Error processing arguments");
        cobj->setVDataBuffer(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setVDataBuffer)

static bool js_2d_RenderEntity_setVbBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setVbBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setVbBuffer : Error processing arguments");
        cobj->setVbBuffer(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setVbBuffer)

static bool js_2d_RenderEntity_setVertDirty(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setVertDirty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setVertDirty : Error processing arguments");
        cobj->setVertDirty(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setVertDirty)

static bool js_2d_RenderEntity_setVertexOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setVertexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_setVertexOffset : Error processing arguments");
        cobj->setVertexOffset(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_RenderEntity_setVertexOffset)

static bool js_2d_RenderEntity_syncSharedBufferToNative(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_syncSharedBufferToNative : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_RenderEntity_syncSharedBufferToNative : Error processing arguments");
        cobj->syncSharedBufferToNative(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_RenderEntity_syncSharedBufferToNative)

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
    do {
        if (argc == 3) {
            HolderType<int, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<int, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<int, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::RenderEntity, arg0.value(), arg1.value(), arg2.value());
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
    cls->defineProperty("bufferId", _SE(js_2d_RenderEntity_getBufferId_asGetter), _SE(js_2d_RenderEntity_setBufferId_asSetter));
    cls->defineProperty("vertexOffset", _SE(js_2d_RenderEntity_getVertexOffset_asGetter), _SE(js_2d_RenderEntity_setVertexOffset_asSetter));
    cls->defineProperty("indexOffset", _SE(js_2d_RenderEntity_getIndexOffset_asGetter), _SE(js_2d_RenderEntity_setIndexOffset_asSetter));
    cls->defineProperty("vbBuffer", _SE(js_2d_RenderEntity_getVbBuffer_asGetter), _SE(js_2d_RenderEntity_setVbBuffer_asSetter));
    cls->defineProperty("ibBuffer", _SE(js_2d_RenderEntity_getIbBuffer_asGetter), _SE(js_2d_RenderEntity_setIbBuffer_asSetter));
    cls->defineProperty("vDataBuffer", _SE(js_2d_RenderEntity_getVDataBuffer_asGetter), _SE(js_2d_RenderEntity_setVDataBuffer_asSetter));
    cls->defineProperty("iDataBuffer", _SE(js_2d_RenderEntity_getIDataBuffer_asGetter), _SE(js_2d_RenderEntity_setIDataBuffer_asSetter));
    cls->defineProperty("node", _SE(js_2d_RenderEntity_getNode_asGetter), _SE(js_2d_RenderEntity_setNode_asSetter));
    cls->defineProperty("vertDirty", _SE(js_2d_RenderEntity_getVertDirty_asGetter), _SE(js_2d_RenderEntity_setVertDirty_asSetter));
    cls->defineProperty("dataHash", _SE(js_2d_RenderEntity_getDataHash_asGetter), _SE(js_2d_RenderEntity_setDataHash_asSetter));
    cls->defineProperty("stencilStage", _SE(js_2d_RenderEntity_getStencilStage_asGetter), _SE(js_2d_RenderEntity_setStencilStage_asSetter));
    cls->defineProperty("isMeshBuffer", _SE(js_2d_RenderEntity_getIsMeshBuffer_asGetter), _SE(js_2d_RenderEntity_setIsMeshBuffer_asSetter));
    cls->defineProperty("material", _SE(js_2d_RenderEntity_getMaterial_asGetter), _SE(js_2d_RenderEntity_setMaterial_asSetter));
    cls->defineProperty("texture", _SE(js_2d_RenderEntity_getTexture_asGetter), _SE(js_2d_RenderEntity_setTexture_asSetter));
    cls->defineProperty("textureHash", _SE(js_2d_RenderEntity_getTextureHash_asGetter), _SE(js_2d_RenderEntity_setTextureHash_asSetter));
    cls->defineProperty("sampler", _SE(js_2d_RenderEntity_getSampler_asGetter), _SE(js_2d_RenderEntity_setSampler_asSetter));
    cls->defineProperty("blendHash", _SE(js_2d_RenderEntity_getBlendHash_asGetter), _SE(js_2d_RenderEntity_setBlendHash_asSetter));
    cls->defineFunction("ItIsDebugFuncInRenderEntity", _SE(js_2d_RenderEntity_ItIsDebugFuncInRenderEntity));
    cls->defineFunction("getCurrIndex", _SE(js_2d_RenderEntity_getCurrIndex));
    cls->defineFunction("getNextIndex", _SE(js_2d_RenderEntity_getNextIndex));
    cls->defineFunction("getRender2dLayout", _SE(js_2d_RenderEntity_getRender2dLayout));
    cls->defineFunction("setCurrIndex", _SE(js_2d_RenderEntity_setCurrIndex));
    cls->defineFunction("setNextIndex", _SE(js_2d_RenderEntity_setNextIndex));
    cls->defineFunction("setRender2dBufferToNative", _SE(js_2d_RenderEntity_setRender2dBufferToNative));
    cls->defineFunction("syncSharedBufferToNative", _SE(js_2d_RenderEntity_syncSharedBufferToNative));
    cls->defineFinalizeFunction(_SE(js_cc_RenderEntity_finalize));
    cls->install();
    JSBClassType::registerClass<cc::RenderEntity>(cls);

    __jsb_cc_RenderEntity_proto = cls->getProto();
    __jsb_cc_RenderEntity_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_UIMeshBuffer_proto = nullptr; // NOLINT
se::Class* __jsb_cc_UIMeshBuffer_class = nullptr;  // NOLINT

static bool js_2d_UIMeshBuffer_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_destroy : Invalid Native Object");
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

static bool js_2d_UIMeshBuffer_getByteOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_getByteOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getByteOffset();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_UIMeshBuffer_getByteOffset : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_UIMeshBuffer_getByteOffset)

static bool js_2d_UIMeshBuffer_getDirty(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_getDirty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getDirty();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_UIMeshBuffer_getDirty : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_UIMeshBuffer_getDirty)

static bool js_2d_UIMeshBuffer_getFloatsPerVertex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_getFloatsPerVertex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getFloatsPerVertex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_UIMeshBuffer_getFloatsPerVertex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_UIMeshBuffer_getFloatsPerVertex)

static bool js_2d_UIMeshBuffer_getIData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_getIData : Invalid Native Object");
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

static bool js_2d_UIMeshBuffer_getIndexOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_getIndexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getIndexOffset();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_UIMeshBuffer_getIndexOffset : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_UIMeshBuffer_getIndexOffset)

static bool js_2d_UIMeshBuffer_getVData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_getVData : Invalid Native Object");
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

static bool js_2d_UIMeshBuffer_getVertexOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_getVertexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getVertexOffset();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_UIMeshBuffer_getVertexOffset : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_UIMeshBuffer_getVertexOffset)

static bool js_2d_UIMeshBuffer_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<cc::gfx::Device*, false> arg0 = {};
        HolderType<std::vector<cc::gfx::Attribute *>, true> arg1 = {};
        HolderType<int, false> arg2 = {};
        HolderType<int, false> arg3 = {};
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

static bool js_2d_UIMeshBuffer_parseLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_parseLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->parseLayout();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_UIMeshBuffer_parseLayout)

static bool js_2d_UIMeshBuffer_reset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_reset : Invalid Native Object");
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

static bool js_2d_UIMeshBuffer_setByteOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_setByteOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_UIMeshBuffer_setByteOffset : Error processing arguments");
        cobj->setByteOffset(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_UIMeshBuffer_setByteOffset)

static bool js_2d_UIMeshBuffer_setDirty(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    SE_PRECONDITION2( cobj, false, "js_2d_UIMeshBuffer_setDirty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<bool, false> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            cobj->setDirty(arg0.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {

            cobj->setDirty();
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_2d_UIMeshBuffer_setDirty)

static bool js_2d_UIMeshBuffer_setFloatsPerVertex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_setFloatsPerVertex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_UIMeshBuffer_setFloatsPerVertex : Error processing arguments");
        cobj->setFloatsPerVertex(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_UIMeshBuffer_setFloatsPerVertex)

static bool js_2d_UIMeshBuffer_setIData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_setIData : Invalid Native Object");
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

static bool js_2d_UIMeshBuffer_setIndexOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_setIndexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_UIMeshBuffer_setIndexOffset : Error processing arguments");
        cobj->setIndexOffset(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_UIMeshBuffer_setIndexOffset)

static bool js_2d_UIMeshBuffer_setVData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_setVData : Invalid Native Object");
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

static bool js_2d_UIMeshBuffer_setVertexOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_setVertexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_UIMeshBuffer_setVertexOffset : Error processing arguments");
        cobj->setVertexOffset(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_UIMeshBuffer_setVertexOffset)

static bool js_2d_UIMeshBuffer_syncSharedBufferToNative(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_syncSharedBufferToNative : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int*, false> arg0 = {};
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
    SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_uploadBuffers : Invalid Native Object");
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
    cls->defineFunction("getByteOffset", _SE(js_2d_UIMeshBuffer_getByteOffset));
    cls->defineFunction("getDirty", _SE(js_2d_UIMeshBuffer_getDirty));
    cls->defineFunction("getFloatsPerVertex", _SE(js_2d_UIMeshBuffer_getFloatsPerVertex));
    cls->defineFunction("getIndexOffset", _SE(js_2d_UIMeshBuffer_getIndexOffset));
    cls->defineFunction("getVertexOffset", _SE(js_2d_UIMeshBuffer_getVertexOffset));
    cls->defineFunction("initialize", _SE(js_2d_UIMeshBuffer_initialize));
    cls->defineFunction("parseLayout", _SE(js_2d_UIMeshBuffer_parseLayout));
    cls->defineFunction("reset", _SE(js_2d_UIMeshBuffer_reset));
    cls->defineFunction("setByteOffset", _SE(js_2d_UIMeshBuffer_setByteOffset));
    cls->defineFunction("setDirty", _SE(js_2d_UIMeshBuffer_setDirty));
    cls->defineFunction("setFloatsPerVertex", _SE(js_2d_UIMeshBuffer_setFloatsPerVertex));
    cls->defineFunction("setIndexOffset", _SE(js_2d_UIMeshBuffer_setIndexOffset));
    cls->defineFunction("setVertexOffset", _SE(js_2d_UIMeshBuffer_setVertexOffset));
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
se::Object* __jsb_cc_Batcher2d_proto = nullptr; // NOLINT
se::Class* __jsb_cc_Batcher2d_class = nullptr;  // NOLINT

static bool js_2d_Batcher2d_ItIsDebugFuncInBatcher2d(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_ItIsDebugFuncInBatcher2d : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->ItIsDebugFuncInBatcher2d();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_ItIsDebugFuncInBatcher2d)

static bool js_2d_Batcher2d_addNewRenderEntity(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_addNewRenderEntity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::RenderEntity*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_Batcher2d_addNewRenderEntity : Error processing arguments");
        cobj->addNewRenderEntity(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_addNewRenderEntity)

static bool js_2d_Batcher2d_fillBuffersAndMergeBatches(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_fillBuffersAndMergeBatches : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->fillBuffersAndMergeBatches();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_fillBuffersAndMergeBatches)

static bool js_2d_Batcher2d_generateBatch(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_generateBatch : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::RenderEntity*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_Batcher2d_generateBatch : Error processing arguments");
        cobj->generateBatch(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_generateBatch)

static bool js_2d_Batcher2d_getCurrFrameHeadIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_getCurrFrameHeadIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getCurrFrameHeadIndex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_Batcher2d_getCurrFrameHeadIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_Batcher2d_getCurrFrameHeadIndex)

static bool js_2d_Batcher2d_getDevice(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Device* result = cobj->getDevice();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_Batcher2d_getDevice : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_getDevice)

static bool js_2d_Batcher2d_getMeshBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_getMeshBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_Batcher2d_getMeshBuffer : Error processing arguments");
        cc::UIMeshBuffer* result = cobj->getMeshBuffer(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_Batcher2d_getMeshBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_getMeshBuffer)

static bool js_2d_Batcher2d_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_initialize : Invalid Native Object");
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

static bool js_2d_Batcher2d_reset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_reset : Invalid Native Object");
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

static bool js_2d_Batcher2d_resetRenderStates(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_resetRenderStates : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->resetRenderStates();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_resetRenderStates)

static bool js_2d_Batcher2d_setCurrFrameHeadIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_setCurrFrameHeadIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_Batcher2d_setCurrFrameHeadIndex : Error processing arguments");
        cobj->setCurrFrameHeadIndex(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_Batcher2d_setCurrFrameHeadIndex)

static bool js_2d_Batcher2d_syncMeshBuffersToNative(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_syncMeshBuffersToNative : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::vector<cc::UIMeshBuffer *>, true> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_Batcher2d_syncMeshBuffersToNative : Error processing arguments");
        cobj->syncMeshBuffersToNative(std::move(arg0.value()), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_syncMeshBuffersToNative)

static bool js_2d_Batcher2d_syncRenderEntitiesToNative(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_syncRenderEntitiesToNative : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::RenderEntity *>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_Batcher2d_syncRenderEntitiesToNative : Error processing arguments");
        cobj->syncRenderEntitiesToNative(std::move(arg0.value()));
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_syncRenderEntitiesToNative)

static bool js_2d_Batcher2d_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_update : Invalid Native Object");
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

static bool js_2d_Batcher2d_updateDescriptorSet(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_updateDescriptorSet : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateDescriptorSet();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_updateDescriptorSet)

static bool js_2d_Batcher2d_uploadBuffers(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_uploadBuffers : Invalid Native Object");
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
    cls->defineProperty("currFrameHeadIndex", _SE(js_2d_Batcher2d_getCurrFrameHeadIndex_asGetter), _SE(js_2d_Batcher2d_setCurrFrameHeadIndex_asSetter));
    cls->defineFunction("ItIsDebugFuncInBatcher2d", _SE(js_2d_Batcher2d_ItIsDebugFuncInBatcher2d));
    cls->defineFunction("addNewRenderEntity", _SE(js_2d_Batcher2d_addNewRenderEntity));
    cls->defineFunction("fillBuffersAndMergeBatches", _SE(js_2d_Batcher2d_fillBuffersAndMergeBatches));
    cls->defineFunction("generateBatch", _SE(js_2d_Batcher2d_generateBatch));
    cls->defineFunction("getDevice", _SE(js_2d_Batcher2d_getDevice));
    cls->defineFunction("getMeshBuffer", _SE(js_2d_Batcher2d_getMeshBuffer));
    cls->defineFunction("initialize", _SE(js_2d_Batcher2d_initialize));
    cls->defineFunction("reset", _SE(js_2d_Batcher2d_reset));
    cls->defineFunction("resetRenderStates", _SE(js_2d_Batcher2d_resetRenderStates));
    cls->defineFunction("syncMeshBuffersToNative", _SE(js_2d_Batcher2d_syncMeshBuffersToNative));
    cls->defineFunction("syncRenderEntitiesToNative", _SE(js_2d_Batcher2d_syncRenderEntitiesToNative));
    cls->defineFunction("update", _SE(js_2d_Batcher2d_update));
    cls->defineFunction("updateDescriptorSet", _SE(js_2d_Batcher2d_updateDescriptorSet));
    cls->defineFunction("uploadBuffers", _SE(js_2d_Batcher2d_uploadBuffers));
    cls->defineFinalizeFunction(_SE(js_cc_Batcher2d_finalize));
    cls->install();
    JSBClassType::registerClass<cc::Batcher2d>(cls);

    __jsb_cc_Batcher2d_proto = cls->getProto();
    __jsb_cc_Batcher2d_class = cls;


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
    js_register_2d_RenderEntity(ns);
    js_register_2d_UIMeshBuffer(ns);
    return true;
}

// clang-format on