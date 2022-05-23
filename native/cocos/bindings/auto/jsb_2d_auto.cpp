
// clang-format off
#include "cocos/bindings/auto/jsb_2d_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "2d/renderer/RenderEntity.h"
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

static bool js_2d_Batcher2d_updateRenderEntities(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Batcher2d>(s);
    SE_PRECONDITION2(cobj, false, "js_2d_Batcher2d_updateRenderEntities : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::RenderEntity *>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_2d_Batcher2d_updateRenderEntities : Error processing arguments");
        cobj->updateRenderEntities(std::move(arg0.value()));
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_2d_Batcher2d_updateRenderEntities)

SE_DECLARE_FINALIZE_FUNC(js_cc_Batcher2d_finalize)

static bool js_2d_Batcher2d_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Batcher2d);
    s.thisObject()->setPrivateObject(ptr);
    return true;
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
    cls->defineFunction("updateRenderEntities", _SE(js_2d_Batcher2d_updateRenderEntities));
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
    return true;
}

// clang-format on