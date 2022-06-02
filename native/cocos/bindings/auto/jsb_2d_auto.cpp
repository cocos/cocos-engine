
// clang-format off
#include "cocos/bindings/auto/jsb_2d_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "2d/renderer/RenderEntity.h"
#include "2d/renderer/UIMeshBuffer.h"
#include "2d/renderer/Batcher2d.h"
#include "2d/renderer/AdvanceRenderData.h"

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

static bool js_2d_RenderEntity_getDataHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_getDataHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int32_t result = cobj->getDataHash();
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

static bool js_2d_RenderEntity_setDataHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderEntity>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_RenderEntity_setDataHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int32_t, false> arg0 = {};
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

SE_DECLARE_FINALIZE_FUNC(js_cc_RenderEntity_finalize)

static bool js_2d_RenderEntity_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
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
    cls->defineProperty("bufferId", _SE(js_2d_RenderEntity_getBufferId_asGetter), _SE(js_2d_RenderEntity_setBufferId_asSetter));
    cls->defineProperty("vertexOffset", _SE(js_2d_RenderEntity_getVertexOffset_asGetter), _SE(js_2d_RenderEntity_setVertexOffset_asSetter));
    cls->defineProperty("indexOffset", _SE(js_2d_RenderEntity_getIndexOffset_asGetter), _SE(js_2d_RenderEntity_setIndexOffset_asSetter));
    cls->defineProperty("vbBuffer", _SE(js_2d_RenderEntity_getVbBuffer_asGetter), _SE(js_2d_RenderEntity_setVbBuffer_asSetter));
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
    cls->defineFunction("setRender2dBufferToNative", _SE(js_2d_RenderEntity_setRender2dBufferToNative));
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

static bool js_2d_UIMeshBuffer_setDirty(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::UIMeshBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_UIMeshBuffer_setDirty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->setDirty();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_2d_UIMeshBuffer_setDirty)

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
    cls->defineFunction("initialize", _SE(js_2d_UIMeshBuffer_initialize));
    cls->defineFunction("parseLayout", _SE(js_2d_UIMeshBuffer_parseLayout));
    cls->defineFunction("reset", _SE(js_2d_UIMeshBuffer_reset));
    cls->defineFunction("setDirty", _SE(js_2d_UIMeshBuffer_setDirty));
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

static bool js_2d_Batcher2d_getMeshBufferAttr(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_getMeshBufferAttr : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_Batcher2d_getMeshBufferAttr : Error processing arguments");
        cc::MeshBufferAttr* result = cobj->getMeshBufferAttr(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_Batcher2d_getMeshBufferAttr : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_getMeshBufferAttr)

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

static bool js_2d_Batcher2d_syncMeshBufferAttrToNative(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_syncMeshBufferAttrToNative : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<unsigned int*, false> arg0 = {};
        HolderType<uint8_t, false> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_Batcher2d_syncMeshBufferAttrToNative : Error processing arguments");
        cobj->syncMeshBufferAttrToNative(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_syncMeshBufferAttrToNative)

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
    cls->defineFunction("ItIsDebugFuncInBatcher2d", _SE(js_2d_Batcher2d_ItIsDebugFuncInBatcher2d));
    cls->defineFunction("fillBuffersAndMergeBatches", _SE(js_2d_Batcher2d_fillBuffersAndMergeBatches));
    cls->defineFunction("generateBatch", _SE(js_2d_Batcher2d_generateBatch));
    cls->defineFunction("getMeshBuffer", _SE(js_2d_Batcher2d_getMeshBuffer));
    cls->defineFunction("getMeshBufferAttr", _SE(js_2d_Batcher2d_getMeshBufferAttr));
    cls->defineFunction("initialize", _SE(js_2d_Batcher2d_initialize));
    cls->defineFunction("reset", _SE(js_2d_Batcher2d_reset));
    cls->defineFunction("syncMeshBufferAttrToNative", _SE(js_2d_Batcher2d_syncMeshBufferAttrToNative));
    cls->defineFunction("syncMeshBuffersToNative", _SE(js_2d_Batcher2d_syncMeshBuffersToNative));
    cls->defineFunction("syncRenderEntitiesToNative", _SE(js_2d_Batcher2d_syncRenderEntitiesToNative));
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
se::Object* __jsb_cc_AdvanceRenderData_proto = nullptr; // NOLINT
se::Class* __jsb_cc_AdvanceRenderData_class = nullptr;  // NOLINT

static bool js_2d_AdvanceRenderData_ParseRender2dData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AdvanceRenderData>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_AdvanceRenderData_ParseRender2dData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned char*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_AdvanceRenderData_ParseRender2dData : Error processing arguments");
        cobj->ParseRender2dData(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_AdvanceRenderData_ParseRender2dData)

static bool js_2d_AdvanceRenderData_getColorA(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AdvanceRenderData>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_AdvanceRenderData_getColorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int8_t result = cobj->getColorA();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_AdvanceRenderData_getColorA : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_AdvanceRenderData_getColorA)

static bool js_2d_AdvanceRenderData_getColorB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AdvanceRenderData>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_AdvanceRenderData_getColorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int8_t result = cobj->getColorB();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_AdvanceRenderData_getColorB : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_AdvanceRenderData_getColorB)

static bool js_2d_AdvanceRenderData_getColorG(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AdvanceRenderData>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_AdvanceRenderData_getColorG : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int8_t result = cobj->getColorG();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_AdvanceRenderData_getColorG : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_AdvanceRenderData_getColorG)

static bool js_2d_AdvanceRenderData_getColorR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AdvanceRenderData>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_AdvanceRenderData_getColorR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int8_t result = cobj->getColorR();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_AdvanceRenderData_getColorR : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_AdvanceRenderData_getColorR)

static bool js_2d_AdvanceRenderData_getU(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AdvanceRenderData>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_AdvanceRenderData_getU : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getU();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_AdvanceRenderData_getU : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_AdvanceRenderData_getU)

static bool js_2d_AdvanceRenderData_getV(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AdvanceRenderData>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_AdvanceRenderData_getV : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getV();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_AdvanceRenderData_getV : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_AdvanceRenderData_getV)

static bool js_2d_AdvanceRenderData_getX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AdvanceRenderData>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_AdvanceRenderData_getX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_AdvanceRenderData_getX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_AdvanceRenderData_getX)

static bool js_2d_AdvanceRenderData_getY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AdvanceRenderData>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_AdvanceRenderData_getY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_AdvanceRenderData_getY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_AdvanceRenderData_getY)

static bool js_2d_AdvanceRenderData_getZ(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AdvanceRenderData>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_AdvanceRenderData_getZ : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getZ();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_2d_AdvanceRenderData_getZ : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_2d_AdvanceRenderData_getZ)

static bool js_2d_AdvanceRenderData_setColorA(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AdvanceRenderData>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_AdvanceRenderData_setColorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int8_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_AdvanceRenderData_setColorA : Error processing arguments");
        cobj->setColorA(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_AdvanceRenderData_setColorA)

static bool js_2d_AdvanceRenderData_setColorB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AdvanceRenderData>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_AdvanceRenderData_setColorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int8_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_AdvanceRenderData_setColorB : Error processing arguments");
        cobj->setColorB(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_AdvanceRenderData_setColorB)

static bool js_2d_AdvanceRenderData_setColorG(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AdvanceRenderData>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_AdvanceRenderData_setColorG : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int8_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_AdvanceRenderData_setColorG : Error processing arguments");
        cobj->setColorG(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_AdvanceRenderData_setColorG)

static bool js_2d_AdvanceRenderData_setColorR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AdvanceRenderData>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_AdvanceRenderData_setColorR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int8_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_AdvanceRenderData_setColorR : Error processing arguments");
        cobj->setColorR(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_AdvanceRenderData_setColorR)

static bool js_2d_AdvanceRenderData_setU(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AdvanceRenderData>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_AdvanceRenderData_setU : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_AdvanceRenderData_setU : Error processing arguments");
        cobj->setU(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_AdvanceRenderData_setU)

static bool js_2d_AdvanceRenderData_setV(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AdvanceRenderData>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_AdvanceRenderData_setV : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_AdvanceRenderData_setV : Error processing arguments");
        cobj->setV(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_AdvanceRenderData_setV)

static bool js_2d_AdvanceRenderData_setX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AdvanceRenderData>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_AdvanceRenderData_setX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_AdvanceRenderData_setX : Error processing arguments");
        cobj->setX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_AdvanceRenderData_setX)

static bool js_2d_AdvanceRenderData_setY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AdvanceRenderData>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_AdvanceRenderData_setY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_AdvanceRenderData_setY : Error processing arguments");
        cobj->setY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_AdvanceRenderData_setY)

static bool js_2d_AdvanceRenderData_setZ(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::AdvanceRenderData>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_AdvanceRenderData_setZ : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_AdvanceRenderData_setZ : Error processing arguments");
        cobj->setZ(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_2d_AdvanceRenderData_setZ)

SE_DECLARE_FINALIZE_FUNC(js_cc_AdvanceRenderData_finalize)

static bool js_2d_AdvanceRenderData_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 9) {
            HolderType<float, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg3 = {};
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg4 = {};
            ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<uint8_t, false> arg5 = {};
            ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<uint8_t, false> arg6 = {};
            ok &= sevalue_to_native(args[6], &arg6, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<uint8_t, false> arg7 = {};
            ok &= sevalue_to_native(args[7], &arg7, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<uint8_t, false> arg8 = {};
            ok &= sevalue_to_native(args[8], &arg8, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::AdvanceRenderData, arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value(), arg6.value(), arg7.value(), arg8.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::AdvanceRenderData);
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_2d_AdvanceRenderData_constructor, __jsb_cc_AdvanceRenderData_class, js_cc_AdvanceRenderData_finalize)

static bool js_cc_AdvanceRenderData_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_AdvanceRenderData_finalize)

bool js_register_2d_AdvanceRenderData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("AdvanceRenderData", obj, nullptr, _SE(js_2d_AdvanceRenderData_constructor));

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_2d_getter_return_true), nullptr);
#endif
    cls->defineProperty("x", _SE(js_2d_AdvanceRenderData_getX_asGetter), _SE(js_2d_AdvanceRenderData_setX_asSetter));
    cls->defineProperty("y", _SE(js_2d_AdvanceRenderData_getY_asGetter), _SE(js_2d_AdvanceRenderData_setY_asSetter));
    cls->defineProperty("z", _SE(js_2d_AdvanceRenderData_getZ_asGetter), _SE(js_2d_AdvanceRenderData_setZ_asSetter));
    cls->defineProperty("u", _SE(js_2d_AdvanceRenderData_getU_asGetter), _SE(js_2d_AdvanceRenderData_setU_asSetter));
    cls->defineProperty("v", _SE(js_2d_AdvanceRenderData_getV_asGetter), _SE(js_2d_AdvanceRenderData_setV_asSetter));
    cls->defineProperty("colorR", _SE(js_2d_AdvanceRenderData_getColorR_asGetter), _SE(js_2d_AdvanceRenderData_setColorR_asSetter));
    cls->defineProperty("colorG", _SE(js_2d_AdvanceRenderData_getColorG_asGetter), _SE(js_2d_AdvanceRenderData_setColorG_asSetter));
    cls->defineProperty("colorB", _SE(js_2d_AdvanceRenderData_getColorB_asGetter), _SE(js_2d_AdvanceRenderData_setColorB_asSetter));
    cls->defineProperty("colorA", _SE(js_2d_AdvanceRenderData_getColorA_asGetter), _SE(js_2d_AdvanceRenderData_setColorA_asSetter));
    cls->defineFunction("ParseRender2dData", _SE(js_2d_AdvanceRenderData_ParseRender2dData));
    cls->defineFinalizeFunction(_SE(js_cc_AdvanceRenderData_finalize));
    cls->install();
    JSBClassType::registerClass<cc::AdvanceRenderData>(cls);

    __jsb_cc_AdvanceRenderData_proto = cls->getProto();
    __jsb_cc_AdvanceRenderData_class = cls;


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

    js_register_2d_AdvanceRenderData(ns);
    js_register_2d_Batcher2d(ns);
    js_register_2d_RenderEntity(ns);
    js_register_2d_UIMeshBuffer(ns);
    return true;
}

// clang-format on