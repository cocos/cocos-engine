#include "cocos/bindings/auto/jsb_gfx_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "renderer/gfx-base/GFXBase.h"
#include "renderer/GFXDeviceManager.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_gfx_Size_proto = nullptr;
se::Class* __jsb_cc_gfx_Size_class = nullptr;

static bool js_gfx_Size_get_x(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Size>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Size_get_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->x, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->x, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Size_get_x)

static bool js_gfx_Size_set_x(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Size>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Size_set_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->x, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Size_set_x : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Size_set_x)

static bool js_gfx_Size_get_y(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Size>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Size_get_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->y, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->y, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Size_get_y)

static bool js_gfx_Size_set_y(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Size>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Size_set_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->y, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Size_set_y : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Size_set_y)

static bool js_gfx_Size_get_z(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Size>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Size_get_z : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->z, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->z, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Size_get_z)

static bool js_gfx_Size_set_z(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Size>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Size_set_z : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->z, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Size_set_z : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Size_set_z)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::Size * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::Size*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("x", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->x), ctx);
    }
    json->getProperty("y", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->y), ctx);
    }
    json->getProperty("z", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->z), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Size_finalize)

static bool js_gfx_Size_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::Size* cobj = JSB_ALLOC(cc::gfx::Size);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Size* cobj = JSB_ALLOC(cc::gfx::Size);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::Size* cobj = JSB_ALLOC(cc::gfx::Size);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->x), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->y), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->z), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_Size_constructor, __jsb_cc_gfx_Size_class, js_cc_gfx_Size_finalize)



static bool js_cc_gfx_Size_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Size>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::Size>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Size_finalize)

bool js_register_gfx_Size(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Size", obj, nullptr, _SE(js_gfx_Size_constructor));

    cls->defineProperty("x", _SE(js_gfx_Size_get_x), _SE(js_gfx_Size_set_x));
    cls->defineProperty("y", _SE(js_gfx_Size_get_y), _SE(js_gfx_Size_set_y));
    cls->defineProperty("z", _SE(js_gfx_Size_get_z), _SE(js_gfx_Size_set_z));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Size_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Size>(cls);

    __jsb_cc_gfx_Size_proto = cls->getProto();
    __jsb_cc_gfx_Size_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_DeviceCaps_proto = nullptr;
se::Class* __jsb_cc_gfx_DeviceCaps_class = nullptr;

static bool js_gfx_DeviceCaps_get_maxVertexAttributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_maxVertexAttributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxVertexAttributes, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxVertexAttributes, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_maxVertexAttributes)

static bool js_gfx_DeviceCaps_set_maxVertexAttributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_maxVertexAttributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxVertexAttributes, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_maxVertexAttributes : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_maxVertexAttributes)

static bool js_gfx_DeviceCaps_get_maxVertexUniformVectors(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_maxVertexUniformVectors : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxVertexUniformVectors, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxVertexUniformVectors, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_maxVertexUniformVectors)

static bool js_gfx_DeviceCaps_set_maxVertexUniformVectors(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_maxVertexUniformVectors : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxVertexUniformVectors, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_maxVertexUniformVectors : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_maxVertexUniformVectors)

static bool js_gfx_DeviceCaps_get_maxFragmentUniformVectors(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_maxFragmentUniformVectors : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxFragmentUniformVectors, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxFragmentUniformVectors, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_maxFragmentUniformVectors)

static bool js_gfx_DeviceCaps_set_maxFragmentUniformVectors(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_maxFragmentUniformVectors : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxFragmentUniformVectors, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_maxFragmentUniformVectors : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_maxFragmentUniformVectors)

static bool js_gfx_DeviceCaps_get_maxTextureUnits(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_maxTextureUnits : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxTextureUnits, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxTextureUnits, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_maxTextureUnits)

static bool js_gfx_DeviceCaps_set_maxTextureUnits(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_maxTextureUnits : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxTextureUnits, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_maxTextureUnits : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_maxTextureUnits)

static bool js_gfx_DeviceCaps_get_maxImageUnits(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_maxImageUnits : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxImageUnits, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxImageUnits, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_maxImageUnits)

static bool js_gfx_DeviceCaps_set_maxImageUnits(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_maxImageUnits : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxImageUnits, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_maxImageUnits : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_maxImageUnits)

static bool js_gfx_DeviceCaps_get_maxVertexTextureUnits(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_maxVertexTextureUnits : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxVertexTextureUnits, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxVertexTextureUnits, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_maxVertexTextureUnits)

static bool js_gfx_DeviceCaps_set_maxVertexTextureUnits(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_maxVertexTextureUnits : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxVertexTextureUnits, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_maxVertexTextureUnits : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_maxVertexTextureUnits)

static bool js_gfx_DeviceCaps_get_maxColorRenderTargets(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_maxColorRenderTargets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxColorRenderTargets, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxColorRenderTargets, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_maxColorRenderTargets)

static bool js_gfx_DeviceCaps_set_maxColorRenderTargets(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_maxColorRenderTargets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxColorRenderTargets, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_maxColorRenderTargets : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_maxColorRenderTargets)

static bool js_gfx_DeviceCaps_get_maxShaderStorageBufferBindings(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_maxShaderStorageBufferBindings : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxShaderStorageBufferBindings, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxShaderStorageBufferBindings, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_maxShaderStorageBufferBindings)

static bool js_gfx_DeviceCaps_set_maxShaderStorageBufferBindings(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_maxShaderStorageBufferBindings : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxShaderStorageBufferBindings, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_maxShaderStorageBufferBindings : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_maxShaderStorageBufferBindings)

static bool js_gfx_DeviceCaps_get_maxShaderStorageBlockSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_maxShaderStorageBlockSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxShaderStorageBlockSize, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxShaderStorageBlockSize, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_maxShaderStorageBlockSize)

static bool js_gfx_DeviceCaps_set_maxShaderStorageBlockSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_maxShaderStorageBlockSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxShaderStorageBlockSize, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_maxShaderStorageBlockSize : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_maxShaderStorageBlockSize)

static bool js_gfx_DeviceCaps_get_maxUniformBufferBindings(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_maxUniformBufferBindings : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxUniformBufferBindings, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxUniformBufferBindings, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_maxUniformBufferBindings)

static bool js_gfx_DeviceCaps_set_maxUniformBufferBindings(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_maxUniformBufferBindings : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxUniformBufferBindings, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_maxUniformBufferBindings : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_maxUniformBufferBindings)

static bool js_gfx_DeviceCaps_get_maxUniformBlockSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_maxUniformBlockSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxUniformBlockSize, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxUniformBlockSize, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_maxUniformBlockSize)

static bool js_gfx_DeviceCaps_set_maxUniformBlockSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_maxUniformBlockSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxUniformBlockSize, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_maxUniformBlockSize : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_maxUniformBlockSize)

static bool js_gfx_DeviceCaps_get_maxTextureSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_maxTextureSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxTextureSize, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxTextureSize, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_maxTextureSize)

static bool js_gfx_DeviceCaps_set_maxTextureSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_maxTextureSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxTextureSize, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_maxTextureSize : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_maxTextureSize)

static bool js_gfx_DeviceCaps_get_maxCubeMapTextureSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_maxCubeMapTextureSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxCubeMapTextureSize, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxCubeMapTextureSize, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_maxCubeMapTextureSize)

static bool js_gfx_DeviceCaps_set_maxCubeMapTextureSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_maxCubeMapTextureSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxCubeMapTextureSize, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_maxCubeMapTextureSize : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_maxCubeMapTextureSize)

static bool js_gfx_DeviceCaps_get_uboOffsetAlignment(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_uboOffsetAlignment : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->uboOffsetAlignment, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->uboOffsetAlignment, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_uboOffsetAlignment)

static bool js_gfx_DeviceCaps_set_uboOffsetAlignment(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_uboOffsetAlignment : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->uboOffsetAlignment, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_uboOffsetAlignment : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_uboOffsetAlignment)

static bool js_gfx_DeviceCaps_get_maxComputeSharedMemorySize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_maxComputeSharedMemorySize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxComputeSharedMemorySize, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxComputeSharedMemorySize, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_maxComputeSharedMemorySize)

static bool js_gfx_DeviceCaps_set_maxComputeSharedMemorySize(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_maxComputeSharedMemorySize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxComputeSharedMemorySize, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_maxComputeSharedMemorySize : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_maxComputeSharedMemorySize)

static bool js_gfx_DeviceCaps_get_maxComputeWorkGroupInvocations(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_maxComputeWorkGroupInvocations : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxComputeWorkGroupInvocations, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxComputeWorkGroupInvocations, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_maxComputeWorkGroupInvocations)

static bool js_gfx_DeviceCaps_set_maxComputeWorkGroupInvocations(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_maxComputeWorkGroupInvocations : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxComputeWorkGroupInvocations, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_maxComputeWorkGroupInvocations : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_maxComputeWorkGroupInvocations)

static bool js_gfx_DeviceCaps_get_maxComputeWorkGroupSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_maxComputeWorkGroupSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxComputeWorkGroupSize, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxComputeWorkGroupSize, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_maxComputeWorkGroupSize)

static bool js_gfx_DeviceCaps_set_maxComputeWorkGroupSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_maxComputeWorkGroupSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxComputeWorkGroupSize, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_maxComputeWorkGroupSize : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_maxComputeWorkGroupSize)

static bool js_gfx_DeviceCaps_get_maxComputeWorkGroupCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_maxComputeWorkGroupCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxComputeWorkGroupCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxComputeWorkGroupCount, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_maxComputeWorkGroupCount)

static bool js_gfx_DeviceCaps_set_maxComputeWorkGroupCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_maxComputeWorkGroupCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxComputeWorkGroupCount, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_maxComputeWorkGroupCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_maxComputeWorkGroupCount)

static bool js_gfx_DeviceCaps_get_clipSpaceMinZ(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_clipSpaceMinZ : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->clipSpaceMinZ, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->clipSpaceMinZ, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_clipSpaceMinZ)

static bool js_gfx_DeviceCaps_set_clipSpaceMinZ(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_clipSpaceMinZ : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->clipSpaceMinZ, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_clipSpaceMinZ : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_clipSpaceMinZ)

static bool js_gfx_DeviceCaps_get_screenSpaceSignY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_screenSpaceSignY : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->screenSpaceSignY, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->screenSpaceSignY, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_screenSpaceSignY)

static bool js_gfx_DeviceCaps_set_screenSpaceSignY(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_screenSpaceSignY : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->screenSpaceSignY, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_screenSpaceSignY : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_screenSpaceSignY)

static bool js_gfx_DeviceCaps_get_clipSpaceSignY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_get_clipSpaceSignY : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->clipSpaceSignY, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->clipSpaceSignY, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceCaps_get_clipSpaceSignY)

static bool js_gfx_DeviceCaps_set_clipSpaceSignY(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceCaps_set_clipSpaceSignY : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->clipSpaceSignY, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceCaps_set_clipSpaceSignY : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceCaps_set_clipSpaceSignY)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::DeviceCaps * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::DeviceCaps*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("maxVertexAttributes", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxVertexAttributes), ctx);
    }
    json->getProperty("maxVertexUniformVectors", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxVertexUniformVectors), ctx);
    }
    json->getProperty("maxFragmentUniformVectors", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxFragmentUniformVectors), ctx);
    }
    json->getProperty("maxTextureUnits", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxTextureUnits), ctx);
    }
    json->getProperty("maxImageUnits", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxImageUnits), ctx);
    }
    json->getProperty("maxVertexTextureUnits", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxVertexTextureUnits), ctx);
    }
    json->getProperty("maxColorRenderTargets", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxColorRenderTargets), ctx);
    }
    json->getProperty("maxShaderStorageBufferBindings", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxShaderStorageBufferBindings), ctx);
    }
    json->getProperty("maxShaderStorageBlockSize", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxShaderStorageBlockSize), ctx);
    }
    json->getProperty("maxUniformBufferBindings", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxUniformBufferBindings), ctx);
    }
    json->getProperty("maxUniformBlockSize", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxUniformBlockSize), ctx);
    }
    json->getProperty("maxTextureSize", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxTextureSize), ctx);
    }
    json->getProperty("maxCubeMapTextureSize", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxCubeMapTextureSize), ctx);
    }
    json->getProperty("uboOffsetAlignment", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->uboOffsetAlignment), ctx);
    }
    json->getProperty("maxComputeSharedMemorySize", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxComputeSharedMemorySize), ctx);
    }
    json->getProperty("maxComputeWorkGroupInvocations", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxComputeWorkGroupInvocations), ctx);
    }
    json->getProperty("maxComputeWorkGroupSize", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxComputeWorkGroupSize), ctx);
    }
    json->getProperty("maxComputeWorkGroupCount", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxComputeWorkGroupCount), ctx);
    }
    json->getProperty("clipSpaceMinZ", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->clipSpaceMinZ), ctx);
    }
    json->getProperty("screenSpaceSignY", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->screenSpaceSignY), ctx);
    }
    json->getProperty("clipSpaceSignY", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->clipSpaceSignY), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DeviceCaps_finalize)

static bool js_gfx_DeviceCaps_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::DeviceCaps* cobj = JSB_ALLOC(cc::gfx::DeviceCaps);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::DeviceCaps* cobj = JSB_ALLOC(cc::gfx::DeviceCaps);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::DeviceCaps* cobj = JSB_ALLOC(cc::gfx::DeviceCaps);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->maxVertexAttributes), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->maxVertexUniformVectors), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->maxFragmentUniformVectors), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->maxTextureUnits), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->maxImageUnits), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->maxVertexTextureUnits), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->maxColorRenderTargets), nullptr);
    }
    if (argc > 7 && !args[7].isUndefined()) {
        ok &= sevalue_to_native(args[7], &(cobj->maxShaderStorageBufferBindings), nullptr);
    }
    if (argc > 8 && !args[8].isUndefined()) {
        ok &= sevalue_to_native(args[8], &(cobj->maxShaderStorageBlockSize), nullptr);
    }
    if (argc > 9 && !args[9].isUndefined()) {
        ok &= sevalue_to_native(args[9], &(cobj->maxUniformBufferBindings), nullptr);
    }
    if (argc > 10 && !args[10].isUndefined()) {
        ok &= sevalue_to_native(args[10], &(cobj->maxUniformBlockSize), nullptr);
    }
    if (argc > 11 && !args[11].isUndefined()) {
        ok &= sevalue_to_native(args[11], &(cobj->maxTextureSize), nullptr);
    }
    if (argc > 12 && !args[12].isUndefined()) {
        ok &= sevalue_to_native(args[12], &(cobj->maxCubeMapTextureSize), nullptr);
    }
    if (argc > 13 && !args[13].isUndefined()) {
        ok &= sevalue_to_native(args[13], &(cobj->uboOffsetAlignment), nullptr);
    }
    if (argc > 14 && !args[14].isUndefined()) {
        ok &= sevalue_to_native(args[14], &(cobj->maxComputeSharedMemorySize), nullptr);
    }
    if (argc > 15 && !args[15].isUndefined()) {
        ok &= sevalue_to_native(args[15], &(cobj->maxComputeWorkGroupInvocations), nullptr);
    }
    if (argc > 16 && !args[16].isUndefined()) {
        ok &= sevalue_to_native(args[16], &(cobj->maxComputeWorkGroupSize), nullptr);
    }
    if (argc > 17 && !args[17].isUndefined()) {
        ok &= sevalue_to_native(args[17], &(cobj->maxComputeWorkGroupCount), nullptr);
    }
    if (argc > 18 && !args[18].isUndefined()) {
        ok &= sevalue_to_native(args[18], &(cobj->clipSpaceMinZ), nullptr);
    }
    if (argc > 19 && !args[19].isUndefined()) {
        ok &= sevalue_to_native(args[19], &(cobj->screenSpaceSignY), nullptr);
    }
    if (argc > 20 && !args[20].isUndefined()) {
        ok &= sevalue_to_native(args[20], &(cobj->clipSpaceSignY), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_DeviceCaps_constructor, __jsb_cc_gfx_DeviceCaps_class, js_cc_gfx_DeviceCaps_finalize)



static bool js_cc_gfx_DeviceCaps_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceCaps>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DeviceCaps_finalize)

bool js_register_gfx_DeviceCaps(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DeviceCaps", obj, nullptr, _SE(js_gfx_DeviceCaps_constructor));

    cls->defineProperty("maxVertexAttributes", _SE(js_gfx_DeviceCaps_get_maxVertexAttributes), _SE(js_gfx_DeviceCaps_set_maxVertexAttributes));
    cls->defineProperty("maxVertexUniformVectors", _SE(js_gfx_DeviceCaps_get_maxVertexUniformVectors), _SE(js_gfx_DeviceCaps_set_maxVertexUniformVectors));
    cls->defineProperty("maxFragmentUniformVectors", _SE(js_gfx_DeviceCaps_get_maxFragmentUniformVectors), _SE(js_gfx_DeviceCaps_set_maxFragmentUniformVectors));
    cls->defineProperty("maxTextureUnits", _SE(js_gfx_DeviceCaps_get_maxTextureUnits), _SE(js_gfx_DeviceCaps_set_maxTextureUnits));
    cls->defineProperty("maxImageUnits", _SE(js_gfx_DeviceCaps_get_maxImageUnits), _SE(js_gfx_DeviceCaps_set_maxImageUnits));
    cls->defineProperty("maxVertexTextureUnits", _SE(js_gfx_DeviceCaps_get_maxVertexTextureUnits), _SE(js_gfx_DeviceCaps_set_maxVertexTextureUnits));
    cls->defineProperty("maxColorRenderTargets", _SE(js_gfx_DeviceCaps_get_maxColorRenderTargets), _SE(js_gfx_DeviceCaps_set_maxColorRenderTargets));
    cls->defineProperty("maxShaderStorageBufferBindings", _SE(js_gfx_DeviceCaps_get_maxShaderStorageBufferBindings), _SE(js_gfx_DeviceCaps_set_maxShaderStorageBufferBindings));
    cls->defineProperty("maxShaderStorageBlockSize", _SE(js_gfx_DeviceCaps_get_maxShaderStorageBlockSize), _SE(js_gfx_DeviceCaps_set_maxShaderStorageBlockSize));
    cls->defineProperty("maxUniformBufferBindings", _SE(js_gfx_DeviceCaps_get_maxUniformBufferBindings), _SE(js_gfx_DeviceCaps_set_maxUniformBufferBindings));
    cls->defineProperty("maxUniformBlockSize", _SE(js_gfx_DeviceCaps_get_maxUniformBlockSize), _SE(js_gfx_DeviceCaps_set_maxUniformBlockSize));
    cls->defineProperty("maxTextureSize", _SE(js_gfx_DeviceCaps_get_maxTextureSize), _SE(js_gfx_DeviceCaps_set_maxTextureSize));
    cls->defineProperty("maxCubeMapTextureSize", _SE(js_gfx_DeviceCaps_get_maxCubeMapTextureSize), _SE(js_gfx_DeviceCaps_set_maxCubeMapTextureSize));
    cls->defineProperty("uboOffsetAlignment", _SE(js_gfx_DeviceCaps_get_uboOffsetAlignment), _SE(js_gfx_DeviceCaps_set_uboOffsetAlignment));
    cls->defineProperty("maxComputeSharedMemorySize", _SE(js_gfx_DeviceCaps_get_maxComputeSharedMemorySize), _SE(js_gfx_DeviceCaps_set_maxComputeSharedMemorySize));
    cls->defineProperty("maxComputeWorkGroupInvocations", _SE(js_gfx_DeviceCaps_get_maxComputeWorkGroupInvocations), _SE(js_gfx_DeviceCaps_set_maxComputeWorkGroupInvocations));
    cls->defineProperty("maxComputeWorkGroupSize", _SE(js_gfx_DeviceCaps_get_maxComputeWorkGroupSize), _SE(js_gfx_DeviceCaps_set_maxComputeWorkGroupSize));
    cls->defineProperty("maxComputeWorkGroupCount", _SE(js_gfx_DeviceCaps_get_maxComputeWorkGroupCount), _SE(js_gfx_DeviceCaps_set_maxComputeWorkGroupCount));
    cls->defineProperty("clipSpaceMinZ", _SE(js_gfx_DeviceCaps_get_clipSpaceMinZ), _SE(js_gfx_DeviceCaps_set_clipSpaceMinZ));
    cls->defineProperty("screenSpaceSignY", _SE(js_gfx_DeviceCaps_get_screenSpaceSignY), _SE(js_gfx_DeviceCaps_set_screenSpaceSignY));
    cls->defineProperty("clipSpaceSignY", _SE(js_gfx_DeviceCaps_get_clipSpaceSignY), _SE(js_gfx_DeviceCaps_set_clipSpaceSignY));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DeviceCaps_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DeviceCaps>(cls);

    __jsb_cc_gfx_DeviceCaps_proto = cls->getProto();
    __jsb_cc_gfx_DeviceCaps_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_Offset_proto = nullptr;
se::Class* __jsb_cc_gfx_Offset_class = nullptr;

static bool js_gfx_Offset_get_x(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Offset>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Offset_get_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->x, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->x, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Offset_get_x)

static bool js_gfx_Offset_set_x(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Offset>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Offset_set_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->x, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Offset_set_x : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Offset_set_x)

static bool js_gfx_Offset_get_y(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Offset>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Offset_get_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->y, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->y, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Offset_get_y)

static bool js_gfx_Offset_set_y(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Offset>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Offset_set_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->y, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Offset_set_y : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Offset_set_y)

static bool js_gfx_Offset_get_z(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Offset>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Offset_get_z : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->z, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->z, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Offset_get_z)

static bool js_gfx_Offset_set_z(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Offset>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Offset_set_z : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->z, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Offset_set_z : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Offset_set_z)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::Offset * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::Offset*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("x", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->x), ctx);
    }
    json->getProperty("y", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->y), ctx);
    }
    json->getProperty("z", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->z), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Offset_finalize)

static bool js_gfx_Offset_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::Offset* cobj = JSB_ALLOC(cc::gfx::Offset);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Offset* cobj = JSB_ALLOC(cc::gfx::Offset);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::Offset* cobj = JSB_ALLOC(cc::gfx::Offset);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->x), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->y), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->z), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_Offset_constructor, __jsb_cc_gfx_Offset_class, js_cc_gfx_Offset_finalize)



static bool js_cc_gfx_Offset_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Offset>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::Offset>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Offset_finalize)

bool js_register_gfx_Offset(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Offset", obj, nullptr, _SE(js_gfx_Offset_constructor));

    cls->defineProperty("x", _SE(js_gfx_Offset_get_x), _SE(js_gfx_Offset_set_x));
    cls->defineProperty("y", _SE(js_gfx_Offset_get_y), _SE(js_gfx_Offset_set_y));
    cls->defineProperty("z", _SE(js_gfx_Offset_get_z), _SE(js_gfx_Offset_set_z));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Offset_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Offset>(cls);

    __jsb_cc_gfx_Offset_proto = cls->getProto();
    __jsb_cc_gfx_Offset_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_Rect_proto = nullptr;
se::Class* __jsb_cc_gfx_Rect_class = nullptr;

static bool js_gfx_Rect_get_x(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Rect>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_get_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->x, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->x, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Rect_get_x)

static bool js_gfx_Rect_set_x(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Rect>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_set_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->x, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Rect_set_x : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Rect_set_x)

static bool js_gfx_Rect_get_y(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Rect>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_get_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->y, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->y, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Rect_get_y)

static bool js_gfx_Rect_set_y(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Rect>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_set_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->y, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Rect_set_y : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Rect_set_y)

static bool js_gfx_Rect_get_width(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Rect>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->width, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->width, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Rect_get_width)

static bool js_gfx_Rect_set_width(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Rect>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->width, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Rect_set_width : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Rect_set_width)

static bool js_gfx_Rect_get_height(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Rect>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->height, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->height, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Rect_get_height)

static bool js_gfx_Rect_set_height(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Rect>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->height, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Rect_set_height : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Rect_set_height)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::Rect * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::Rect*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("x", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->x), ctx);
    }
    json->getProperty("y", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->y), ctx);
    }
    json->getProperty("width", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->width), ctx);
    }
    json->getProperty("height", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->height), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Rect_finalize)

static bool js_gfx_Rect_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::Rect* cobj = JSB_ALLOC(cc::gfx::Rect);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Rect* cobj = JSB_ALLOC(cc::gfx::Rect);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::Rect* cobj = JSB_ALLOC(cc::gfx::Rect);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->x), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->y), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->width), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->height), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_Rect_constructor, __jsb_cc_gfx_Rect_class, js_cc_gfx_Rect_finalize)



static bool js_cc_gfx_Rect_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Rect>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::Rect>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Rect_finalize)

bool js_register_gfx_Rect(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Rect", obj, nullptr, _SE(js_gfx_Rect_constructor));

    cls->defineProperty("x", _SE(js_gfx_Rect_get_x), _SE(js_gfx_Rect_set_x));
    cls->defineProperty("y", _SE(js_gfx_Rect_get_y), _SE(js_gfx_Rect_set_y));
    cls->defineProperty("width", _SE(js_gfx_Rect_get_width), _SE(js_gfx_Rect_set_width));
    cls->defineProperty("height", _SE(js_gfx_Rect_get_height), _SE(js_gfx_Rect_set_height));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Rect_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Rect>(cls);

    __jsb_cc_gfx_Rect_proto = cls->getProto();
    __jsb_cc_gfx_Rect_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_Extent_proto = nullptr;
se::Class* __jsb_cc_gfx_Extent_class = nullptr;

static bool js_gfx_Extent_get_width(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Extent>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Extent_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->width, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->width, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Extent_get_width)

static bool js_gfx_Extent_set_width(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Extent>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Extent_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->width, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Extent_set_width : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Extent_set_width)

static bool js_gfx_Extent_get_height(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Extent>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Extent_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->height, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->height, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Extent_get_height)

static bool js_gfx_Extent_set_height(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Extent>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Extent_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->height, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Extent_set_height : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Extent_set_height)

static bool js_gfx_Extent_get_depth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Extent>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Extent_get_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depth, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depth, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Extent_get_depth)

static bool js_gfx_Extent_set_depth(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Extent>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Extent_set_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depth, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Extent_set_depth : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Extent_set_depth)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::Extent * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::Extent*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("width", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->width), ctx);
    }
    json->getProperty("height", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->height), ctx);
    }
    json->getProperty("depth", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depth), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Extent_finalize)

static bool js_gfx_Extent_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::Extent* cobj = JSB_ALLOC(cc::gfx::Extent);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Extent* cobj = JSB_ALLOC(cc::gfx::Extent);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::Extent* cobj = JSB_ALLOC(cc::gfx::Extent);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->width), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->height), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->depth), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_Extent_constructor, __jsb_cc_gfx_Extent_class, js_cc_gfx_Extent_finalize)



static bool js_cc_gfx_Extent_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Extent>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::Extent>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Extent_finalize)

bool js_register_gfx_Extent(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Extent", obj, nullptr, _SE(js_gfx_Extent_constructor));

    cls->defineProperty("width", _SE(js_gfx_Extent_get_width), _SE(js_gfx_Extent_set_width));
    cls->defineProperty("height", _SE(js_gfx_Extent_get_height), _SE(js_gfx_Extent_set_height));
    cls->defineProperty("depth", _SE(js_gfx_Extent_get_depth), _SE(js_gfx_Extent_set_depth));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Extent_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Extent>(cls);

    __jsb_cc_gfx_Extent_proto = cls->getProto();
    __jsb_cc_gfx_Extent_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_TextureSubresLayers_proto = nullptr;
se::Class* __jsb_cc_gfx_TextureSubresLayers_class = nullptr;

static bool js_gfx_TextureSubresLayers_get_mipLevel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubresLayers>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubresLayers_get_mipLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->mipLevel, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->mipLevel, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureSubresLayers_get_mipLevel)

static bool js_gfx_TextureSubresLayers_set_mipLevel(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubresLayers>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubresLayers_set_mipLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->mipLevel, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureSubresLayers_set_mipLevel : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureSubresLayers_set_mipLevel)

static bool js_gfx_TextureSubresLayers_get_baseArrayLayer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubresLayers>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubresLayers_get_baseArrayLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->baseArrayLayer, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->baseArrayLayer, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureSubresLayers_get_baseArrayLayer)

static bool js_gfx_TextureSubresLayers_set_baseArrayLayer(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubresLayers>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubresLayers_set_baseArrayLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->baseArrayLayer, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureSubresLayers_set_baseArrayLayer : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureSubresLayers_set_baseArrayLayer)

static bool js_gfx_TextureSubresLayers_get_layerCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubresLayers>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubresLayers_get_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->layerCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->layerCount, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureSubresLayers_get_layerCount)

static bool js_gfx_TextureSubresLayers_set_layerCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubresLayers>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubresLayers_set_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->layerCount, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureSubresLayers_set_layerCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureSubresLayers_set_layerCount)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::TextureSubresLayers * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::TextureSubresLayers*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("mipLevel", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mipLevel), ctx);
    }
    json->getProperty("baseArrayLayer", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->baseArrayLayer), ctx);
    }
    json->getProperty("layerCount", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->layerCount), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_TextureSubresLayers_finalize)

static bool js_gfx_TextureSubresLayers_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::TextureSubresLayers* cobj = JSB_ALLOC(cc::gfx::TextureSubresLayers);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::TextureSubresLayers* cobj = JSB_ALLOC(cc::gfx::TextureSubresLayers);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::TextureSubresLayers* cobj = JSB_ALLOC(cc::gfx::TextureSubresLayers);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->mipLevel), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->baseArrayLayer), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->layerCount), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_TextureSubresLayers_constructor, __jsb_cc_gfx_TextureSubresLayers_class, js_cc_gfx_TextureSubresLayers_finalize)



static bool js_cc_gfx_TextureSubresLayers_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::TextureSubresLayers>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubresLayers>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_TextureSubresLayers_finalize)

bool js_register_gfx_TextureSubresLayers(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TextureSubresLayers", obj, nullptr, _SE(js_gfx_TextureSubresLayers_constructor));

    cls->defineProperty("mipLevel", _SE(js_gfx_TextureSubresLayers_get_mipLevel), _SE(js_gfx_TextureSubresLayers_set_mipLevel));
    cls->defineProperty("baseArrayLayer", _SE(js_gfx_TextureSubresLayers_get_baseArrayLayer), _SE(js_gfx_TextureSubresLayers_set_baseArrayLayer));
    cls->defineProperty("layerCount", _SE(js_gfx_TextureSubresLayers_get_layerCount), _SE(js_gfx_TextureSubresLayers_set_layerCount));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_TextureSubresLayers_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::TextureSubresLayers>(cls);

    __jsb_cc_gfx_TextureSubresLayers_proto = cls->getProto();
    __jsb_cc_gfx_TextureSubresLayers_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_TextureSubresRange_proto = nullptr;
se::Class* __jsb_cc_gfx_TextureSubresRange_class = nullptr;

static bool js_gfx_TextureSubresRange_get_baseMipLevel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubresRange>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubresRange_get_baseMipLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->baseMipLevel, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->baseMipLevel, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureSubresRange_get_baseMipLevel)

static bool js_gfx_TextureSubresRange_set_baseMipLevel(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubresRange>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubresRange_set_baseMipLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->baseMipLevel, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureSubresRange_set_baseMipLevel : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureSubresRange_set_baseMipLevel)

static bool js_gfx_TextureSubresRange_get_levelCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubresRange>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubresRange_get_levelCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->levelCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->levelCount, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureSubresRange_get_levelCount)

static bool js_gfx_TextureSubresRange_set_levelCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubresRange>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubresRange_set_levelCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->levelCount, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureSubresRange_set_levelCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureSubresRange_set_levelCount)

static bool js_gfx_TextureSubresRange_get_baseArrayLayer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubresRange>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubresRange_get_baseArrayLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->baseArrayLayer, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->baseArrayLayer, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureSubresRange_get_baseArrayLayer)

static bool js_gfx_TextureSubresRange_set_baseArrayLayer(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubresRange>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubresRange_set_baseArrayLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->baseArrayLayer, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureSubresRange_set_baseArrayLayer : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureSubresRange_set_baseArrayLayer)

static bool js_gfx_TextureSubresRange_get_layerCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubresRange>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubresRange_get_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->layerCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->layerCount, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureSubresRange_get_layerCount)

static bool js_gfx_TextureSubresRange_set_layerCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubresRange>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubresRange_set_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->layerCount, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureSubresRange_set_layerCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureSubresRange_set_layerCount)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::TextureSubresRange * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::TextureSubresRange*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("baseMipLevel", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->baseMipLevel), ctx);
    }
    json->getProperty("levelCount", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->levelCount), ctx);
    }
    json->getProperty("baseArrayLayer", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->baseArrayLayer), ctx);
    }
    json->getProperty("layerCount", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->layerCount), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_TextureSubresRange_finalize)

static bool js_gfx_TextureSubresRange_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::TextureSubresRange* cobj = JSB_ALLOC(cc::gfx::TextureSubresRange);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::TextureSubresRange* cobj = JSB_ALLOC(cc::gfx::TextureSubresRange);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::TextureSubresRange* cobj = JSB_ALLOC(cc::gfx::TextureSubresRange);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->baseMipLevel), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->levelCount), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->baseArrayLayer), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->layerCount), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_TextureSubresRange_constructor, __jsb_cc_gfx_TextureSubresRange_class, js_cc_gfx_TextureSubresRange_finalize)



static bool js_cc_gfx_TextureSubresRange_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::TextureSubresRange>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubresRange>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_TextureSubresRange_finalize)

bool js_register_gfx_TextureSubresRange(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TextureSubresRange", obj, nullptr, _SE(js_gfx_TextureSubresRange_constructor));

    cls->defineProperty("baseMipLevel", _SE(js_gfx_TextureSubresRange_get_baseMipLevel), _SE(js_gfx_TextureSubresRange_set_baseMipLevel));
    cls->defineProperty("levelCount", _SE(js_gfx_TextureSubresRange_get_levelCount), _SE(js_gfx_TextureSubresRange_set_levelCount));
    cls->defineProperty("baseArrayLayer", _SE(js_gfx_TextureSubresRange_get_baseArrayLayer), _SE(js_gfx_TextureSubresRange_set_baseArrayLayer));
    cls->defineProperty("layerCount", _SE(js_gfx_TextureSubresRange_get_layerCount), _SE(js_gfx_TextureSubresRange_set_layerCount));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_TextureSubresRange_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::TextureSubresRange>(cls);

    __jsb_cc_gfx_TextureSubresRange_proto = cls->getProto();
    __jsb_cc_gfx_TextureSubresRange_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_TextureCopy_proto = nullptr;
se::Class* __jsb_cc_gfx_TextureCopy_class = nullptr;

static bool js_gfx_TextureCopy_get_srcSubres(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureCopy_get_srcSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->srcSubres, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->srcSubres, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureCopy_get_srcSubres)

static bool js_gfx_TextureCopy_set_srcSubres(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureCopy_set_srcSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->srcSubres, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureCopy_set_srcSubres : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureCopy_set_srcSubres)

static bool js_gfx_TextureCopy_get_srcOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureCopy_get_srcOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->srcOffset, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->srcOffset, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureCopy_get_srcOffset)

static bool js_gfx_TextureCopy_set_srcOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureCopy_set_srcOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->srcOffset, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureCopy_set_srcOffset : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureCopy_set_srcOffset)

static bool js_gfx_TextureCopy_get_dstSubres(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureCopy_get_dstSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->dstSubres, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->dstSubres, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureCopy_get_dstSubres)

static bool js_gfx_TextureCopy_set_dstSubres(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureCopy_set_dstSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->dstSubres, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureCopy_set_dstSubres : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureCopy_set_dstSubres)

static bool js_gfx_TextureCopy_get_dstOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureCopy_get_dstOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->dstOffset, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->dstOffset, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureCopy_get_dstOffset)

static bool js_gfx_TextureCopy_set_dstOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureCopy_set_dstOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->dstOffset, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureCopy_set_dstOffset : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureCopy_set_dstOffset)

static bool js_gfx_TextureCopy_get_extent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureCopy_get_extent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->extent, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->extent, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureCopy_get_extent)

static bool js_gfx_TextureCopy_set_extent(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureCopy_set_extent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->extent, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureCopy_set_extent : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureCopy_set_extent)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::TextureCopy * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::TextureCopy*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("srcSubres", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->srcSubres), ctx);
    }
    json->getProperty("srcOffset", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->srcOffset), ctx);
    }
    json->getProperty("dstSubres", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->dstSubres), ctx);
    }
    json->getProperty("dstOffset", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->dstOffset), ctx);
    }
    json->getProperty("extent", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->extent), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_TextureCopy_finalize)

static bool js_gfx_TextureCopy_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::TextureCopy* cobj = JSB_ALLOC(cc::gfx::TextureCopy);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::TextureCopy* cobj = JSB_ALLOC(cc::gfx::TextureCopy);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::TextureCopy* cobj = JSB_ALLOC(cc::gfx::TextureCopy);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->srcSubres), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->srcOffset), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->dstSubres), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->dstOffset), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->extent), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_TextureCopy_constructor, __jsb_cc_gfx_TextureCopy_class, js_cc_gfx_TextureCopy_finalize)



static bool js_cc_gfx_TextureCopy_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::TextureCopy>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureCopy>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_TextureCopy_finalize)

bool js_register_gfx_TextureCopy(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TextureCopy", obj, nullptr, _SE(js_gfx_TextureCopy_constructor));

    cls->defineProperty("srcSubres", _SE(js_gfx_TextureCopy_get_srcSubres), _SE(js_gfx_TextureCopy_set_srcSubres));
    cls->defineProperty("srcOffset", _SE(js_gfx_TextureCopy_get_srcOffset), _SE(js_gfx_TextureCopy_set_srcOffset));
    cls->defineProperty("dstSubres", _SE(js_gfx_TextureCopy_get_dstSubres), _SE(js_gfx_TextureCopy_set_dstSubres));
    cls->defineProperty("dstOffset", _SE(js_gfx_TextureCopy_get_dstOffset), _SE(js_gfx_TextureCopy_set_dstOffset));
    cls->defineProperty("extent", _SE(js_gfx_TextureCopy_get_extent), _SE(js_gfx_TextureCopy_set_extent));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_TextureCopy_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::TextureCopy>(cls);

    __jsb_cc_gfx_TextureCopy_proto = cls->getProto();
    __jsb_cc_gfx_TextureCopy_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_TextureBlit_proto = nullptr;
se::Class* __jsb_cc_gfx_TextureBlit_class = nullptr;

static bool js_gfx_TextureBlit_get_srcSubres(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBlit>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBlit_get_srcSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->srcSubres, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->srcSubres, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureBlit_get_srcSubres)

static bool js_gfx_TextureBlit_set_srcSubres(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBlit>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBlit_set_srcSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->srcSubres, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureBlit_set_srcSubres : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureBlit_set_srcSubres)

static bool js_gfx_TextureBlit_get_srcOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBlit>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBlit_get_srcOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->srcOffset, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->srcOffset, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureBlit_get_srcOffset)

static bool js_gfx_TextureBlit_set_srcOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBlit>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBlit_set_srcOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->srcOffset, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureBlit_set_srcOffset : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureBlit_set_srcOffset)

static bool js_gfx_TextureBlit_get_srcExtent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBlit>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBlit_get_srcExtent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->srcExtent, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->srcExtent, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureBlit_get_srcExtent)

static bool js_gfx_TextureBlit_set_srcExtent(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBlit>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBlit_set_srcExtent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->srcExtent, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureBlit_set_srcExtent : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureBlit_set_srcExtent)

static bool js_gfx_TextureBlit_get_dstSubres(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBlit>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBlit_get_dstSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->dstSubres, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->dstSubres, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureBlit_get_dstSubres)

static bool js_gfx_TextureBlit_set_dstSubres(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBlit>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBlit_set_dstSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->dstSubres, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureBlit_set_dstSubres : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureBlit_set_dstSubres)

static bool js_gfx_TextureBlit_get_dstOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBlit>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBlit_get_dstOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->dstOffset, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->dstOffset, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureBlit_get_dstOffset)

static bool js_gfx_TextureBlit_set_dstOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBlit>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBlit_set_dstOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->dstOffset, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureBlit_set_dstOffset : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureBlit_set_dstOffset)

static bool js_gfx_TextureBlit_get_dstExtent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBlit>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBlit_get_dstExtent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->dstExtent, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->dstExtent, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureBlit_get_dstExtent)

static bool js_gfx_TextureBlit_set_dstExtent(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBlit>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBlit_set_dstExtent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->dstExtent, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureBlit_set_dstExtent : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureBlit_set_dstExtent)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::TextureBlit * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::TextureBlit*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("srcSubres", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->srcSubres), ctx);
    }
    json->getProperty("srcOffset", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->srcOffset), ctx);
    }
    json->getProperty("srcExtent", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->srcExtent), ctx);
    }
    json->getProperty("dstSubres", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->dstSubres), ctx);
    }
    json->getProperty("dstOffset", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->dstOffset), ctx);
    }
    json->getProperty("dstExtent", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->dstExtent), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_TextureBlit_finalize)

static bool js_gfx_TextureBlit_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::TextureBlit* cobj = JSB_ALLOC(cc::gfx::TextureBlit);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::TextureBlit* cobj = JSB_ALLOC(cc::gfx::TextureBlit);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::TextureBlit* cobj = JSB_ALLOC(cc::gfx::TextureBlit);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->srcSubres), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->srcOffset), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->srcExtent), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->dstSubres), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->dstOffset), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->dstExtent), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_TextureBlit_constructor, __jsb_cc_gfx_TextureBlit_class, js_cc_gfx_TextureBlit_finalize)



static bool js_cc_gfx_TextureBlit_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::TextureBlit>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBlit>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_TextureBlit_finalize)

bool js_register_gfx_TextureBlit(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TextureBlit", obj, nullptr, _SE(js_gfx_TextureBlit_constructor));

    cls->defineProperty("srcSubres", _SE(js_gfx_TextureBlit_get_srcSubres), _SE(js_gfx_TextureBlit_set_srcSubres));
    cls->defineProperty("srcOffset", _SE(js_gfx_TextureBlit_get_srcOffset), _SE(js_gfx_TextureBlit_set_srcOffset));
    cls->defineProperty("srcExtent", _SE(js_gfx_TextureBlit_get_srcExtent), _SE(js_gfx_TextureBlit_set_srcExtent));
    cls->defineProperty("dstSubres", _SE(js_gfx_TextureBlit_get_dstSubres), _SE(js_gfx_TextureBlit_set_dstSubres));
    cls->defineProperty("dstOffset", _SE(js_gfx_TextureBlit_get_dstOffset), _SE(js_gfx_TextureBlit_set_dstOffset));
    cls->defineProperty("dstExtent", _SE(js_gfx_TextureBlit_get_dstExtent), _SE(js_gfx_TextureBlit_set_dstExtent));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_TextureBlit_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::TextureBlit>(cls);

    __jsb_cc_gfx_TextureBlit_proto = cls->getProto();
    __jsb_cc_gfx_TextureBlit_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_BufferTextureCopy_proto = nullptr;
se::Class* __jsb_cc_gfx_BufferTextureCopy_class = nullptr;

static bool js_gfx_BufferTextureCopy_get_buffStride(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_get_buffStride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->buffStride, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->buffStride, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferTextureCopy_get_buffStride)

static bool js_gfx_BufferTextureCopy_set_buffStride(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_set_buffStride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->buffStride, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BufferTextureCopy_set_buffStride : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferTextureCopy_set_buffStride)

static bool js_gfx_BufferTextureCopy_get_buffTexHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_get_buffTexHeight : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->buffTexHeight, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->buffTexHeight, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferTextureCopy_get_buffTexHeight)

static bool js_gfx_BufferTextureCopy_set_buffTexHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_set_buffTexHeight : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->buffTexHeight, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BufferTextureCopy_set_buffTexHeight : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferTextureCopy_set_buffTexHeight)

static bool js_gfx_BufferTextureCopy_get_texOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_get_texOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->texOffset, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->texOffset, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferTextureCopy_get_texOffset)

static bool js_gfx_BufferTextureCopy_set_texOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_set_texOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->texOffset, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BufferTextureCopy_set_texOffset : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferTextureCopy_set_texOffset)

static bool js_gfx_BufferTextureCopy_get_texExtent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_get_texExtent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->texExtent, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->texExtent, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferTextureCopy_get_texExtent)

static bool js_gfx_BufferTextureCopy_set_texExtent(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_set_texExtent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->texExtent, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BufferTextureCopy_set_texExtent : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferTextureCopy_set_texExtent)

static bool js_gfx_BufferTextureCopy_get_texSubres(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_get_texSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->texSubres, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->texSubres, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferTextureCopy_get_texSubres)

static bool js_gfx_BufferTextureCopy_set_texSubres(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_set_texSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->texSubres, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BufferTextureCopy_set_texSubres : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferTextureCopy_set_texSubres)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::BufferTextureCopy * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::BufferTextureCopy*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("buffStride", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->buffStride), ctx);
    }
    json->getProperty("buffTexHeight", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->buffTexHeight), ctx);
    }
    json->getProperty("texOffset", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->texOffset), ctx);
    }
    json->getProperty("texExtent", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->texExtent), ctx);
    }
    json->getProperty("texSubres", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->texSubres), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_BufferTextureCopy_finalize)

static bool js_gfx_BufferTextureCopy_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::BufferTextureCopy* cobj = JSB_ALLOC(cc::gfx::BufferTextureCopy);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::BufferTextureCopy* cobj = JSB_ALLOC(cc::gfx::BufferTextureCopy);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::BufferTextureCopy* cobj = JSB_ALLOC(cc::gfx::BufferTextureCopy);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->buffStride), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->buffTexHeight), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->texOffset), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->texExtent), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->texSubres), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_BufferTextureCopy_constructor, __jsb_cc_gfx_BufferTextureCopy_class, js_cc_gfx_BufferTextureCopy_finalize)



static bool js_cc_gfx_BufferTextureCopy_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_BufferTextureCopy_finalize)

bool js_register_gfx_BufferTextureCopy(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BufferTextureCopy", obj, nullptr, _SE(js_gfx_BufferTextureCopy_constructor));

    cls->defineProperty("buffStride", _SE(js_gfx_BufferTextureCopy_get_buffStride), _SE(js_gfx_BufferTextureCopy_set_buffStride));
    cls->defineProperty("buffTexHeight", _SE(js_gfx_BufferTextureCopy_get_buffTexHeight), _SE(js_gfx_BufferTextureCopy_set_buffTexHeight));
    cls->defineProperty("texOffset", _SE(js_gfx_BufferTextureCopy_get_texOffset), _SE(js_gfx_BufferTextureCopy_set_texOffset));
    cls->defineProperty("texExtent", _SE(js_gfx_BufferTextureCopy_get_texExtent), _SE(js_gfx_BufferTextureCopy_set_texExtent));
    cls->defineProperty("texSubres", _SE(js_gfx_BufferTextureCopy_get_texSubres), _SE(js_gfx_BufferTextureCopy_set_texSubres));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_BufferTextureCopy_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::BufferTextureCopy>(cls);

    __jsb_cc_gfx_BufferTextureCopy_proto = cls->getProto();
    __jsb_cc_gfx_BufferTextureCopy_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_Viewport_proto = nullptr;
se::Class* __jsb_cc_gfx_Viewport_class = nullptr;

static bool js_gfx_Viewport_get_left(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Viewport>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_get_left : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->left, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->left, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Viewport_get_left)

static bool js_gfx_Viewport_set_left(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Viewport>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_set_left : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->left, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Viewport_set_left : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Viewport_set_left)

static bool js_gfx_Viewport_get_top(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Viewport>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_get_top : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->top, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->top, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Viewport_get_top)

static bool js_gfx_Viewport_set_top(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Viewport>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_set_top : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->top, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Viewport_set_top : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Viewport_set_top)

static bool js_gfx_Viewport_get_width(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Viewport>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->width, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->width, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Viewport_get_width)

static bool js_gfx_Viewport_set_width(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Viewport>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->width, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Viewport_set_width : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Viewport_set_width)

static bool js_gfx_Viewport_get_height(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Viewport>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->height, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->height, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Viewport_get_height)

static bool js_gfx_Viewport_set_height(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Viewport>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->height, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Viewport_set_height : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Viewport_set_height)

static bool js_gfx_Viewport_get_minDepth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Viewport>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_get_minDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->minDepth, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->minDepth, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Viewport_get_minDepth)

static bool js_gfx_Viewport_set_minDepth(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Viewport>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_set_minDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->minDepth, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Viewport_set_minDepth : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Viewport_set_minDepth)

static bool js_gfx_Viewport_get_maxDepth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Viewport>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_get_maxDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxDepth, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxDepth, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Viewport_get_maxDepth)

static bool js_gfx_Viewport_set_maxDepth(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Viewport>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Viewport_set_maxDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxDepth, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Viewport_set_maxDepth : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Viewport_set_maxDepth)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::Viewport * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::Viewport*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("left", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->left), ctx);
    }
    json->getProperty("top", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->top), ctx);
    }
    json->getProperty("width", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->width), ctx);
    }
    json->getProperty("height", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->height), ctx);
    }
    json->getProperty("minDepth", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->minDepth), ctx);
    }
    json->getProperty("maxDepth", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxDepth), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Viewport_finalize)

static bool js_gfx_Viewport_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::Viewport* cobj = JSB_ALLOC(cc::gfx::Viewport);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Viewport* cobj = JSB_ALLOC(cc::gfx::Viewport);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::Viewport* cobj = JSB_ALLOC(cc::gfx::Viewport);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->left), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->top), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->width), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->height), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->minDepth), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->maxDepth), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_Viewport_constructor, __jsb_cc_gfx_Viewport_class, js_cc_gfx_Viewport_finalize)



static bool js_cc_gfx_Viewport_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Viewport>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::Viewport>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Viewport_finalize)

bool js_register_gfx_Viewport(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Viewport", obj, nullptr, _SE(js_gfx_Viewport_constructor));

    cls->defineProperty("left", _SE(js_gfx_Viewport_get_left), _SE(js_gfx_Viewport_set_left));
    cls->defineProperty("top", _SE(js_gfx_Viewport_get_top), _SE(js_gfx_Viewport_set_top));
    cls->defineProperty("width", _SE(js_gfx_Viewport_get_width), _SE(js_gfx_Viewport_set_width));
    cls->defineProperty("height", _SE(js_gfx_Viewport_get_height), _SE(js_gfx_Viewport_set_height));
    cls->defineProperty("minDepth", _SE(js_gfx_Viewport_get_minDepth), _SE(js_gfx_Viewport_set_minDepth));
    cls->defineProperty("maxDepth", _SE(js_gfx_Viewport_get_maxDepth), _SE(js_gfx_Viewport_set_maxDepth));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Viewport_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Viewport>(cls);

    __jsb_cc_gfx_Viewport_proto = cls->getProto();
    __jsb_cc_gfx_Viewport_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_Color_proto = nullptr;
se::Class* __jsb_cc_gfx_Color_class = nullptr;

static bool js_gfx_Color_get_x(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_get_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->x, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->x, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Color_get_x)

static bool js_gfx_Color_set_x(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_set_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->x, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Color_set_x : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Color_set_x)

static bool js_gfx_Color_get_y(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_get_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->y, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->y, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Color_get_y)

static bool js_gfx_Color_set_y(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_set_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->y, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Color_set_y : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Color_set_y)

static bool js_gfx_Color_get_z(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_get_z : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->z, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->z, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Color_get_z)

static bool js_gfx_Color_set_z(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_set_z : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->z, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Color_set_z : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Color_set_z)

static bool js_gfx_Color_get_w(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_get_w : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->w, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->w, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Color_get_w)

static bool js_gfx_Color_set_w(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_set_w : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->w, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Color_set_w : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Color_set_w)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::Color * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::Color*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("x", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->x), ctx);
    }
    json->getProperty("y", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->y), ctx);
    }
    json->getProperty("z", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->z), ctx);
    }
    json->getProperty("w", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->w), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Color_finalize)

static bool js_gfx_Color_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::Color* cobj = JSB_ALLOC(cc::gfx::Color);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Color* cobj = JSB_ALLOC(cc::gfx::Color);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::Color* cobj = JSB_ALLOC(cc::gfx::Color);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->x), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->y), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->z), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->w), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_Color_constructor, __jsb_cc_gfx_Color_class, js_cc_gfx_Color_finalize)



static bool js_cc_gfx_Color_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Color>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::Color>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Color_finalize)

bool js_register_gfx_Color(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Color", obj, nullptr, _SE(js_gfx_Color_constructor));

    cls->defineProperty("x", _SE(js_gfx_Color_get_x), _SE(js_gfx_Color_set_x));
    cls->defineProperty("y", _SE(js_gfx_Color_get_y), _SE(js_gfx_Color_set_y));
    cls->defineProperty("z", _SE(js_gfx_Color_get_z), _SE(js_gfx_Color_set_z));
    cls->defineProperty("w", _SE(js_gfx_Color_get_w), _SE(js_gfx_Color_set_w));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Color_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Color>(cls);

    __jsb_cc_gfx_Color_proto = cls->getProto();
    __jsb_cc_gfx_Color_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_BindingMappingInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_BindingMappingInfo_class = nullptr;

static bool js_gfx_BindingMappingInfo_get_bufferOffsets(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BindingMappingInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingMappingInfo_get_bufferOffsets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bufferOffsets, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->bufferOffsets, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BindingMappingInfo_get_bufferOffsets)

static bool js_gfx_BindingMappingInfo_set_bufferOffsets(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BindingMappingInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingMappingInfo_set_bufferOffsets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bufferOffsets, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BindingMappingInfo_set_bufferOffsets : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BindingMappingInfo_set_bufferOffsets)

static bool js_gfx_BindingMappingInfo_get_samplerOffsets(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BindingMappingInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingMappingInfo_get_samplerOffsets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->samplerOffsets, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->samplerOffsets, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BindingMappingInfo_get_samplerOffsets)

static bool js_gfx_BindingMappingInfo_set_samplerOffsets(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BindingMappingInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingMappingInfo_set_samplerOffsets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->samplerOffsets, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BindingMappingInfo_set_samplerOffsets : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BindingMappingInfo_set_samplerOffsets)

static bool js_gfx_BindingMappingInfo_get_flexibleSet(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BindingMappingInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingMappingInfo_get_flexibleSet : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->flexibleSet, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->flexibleSet, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BindingMappingInfo_get_flexibleSet)

static bool js_gfx_BindingMappingInfo_set_flexibleSet(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BindingMappingInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingMappingInfo_set_flexibleSet : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->flexibleSet, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BindingMappingInfo_set_flexibleSet : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BindingMappingInfo_set_flexibleSet)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::BindingMappingInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::BindingMappingInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("bufferOffsets", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bufferOffsets), ctx);
    }
    json->getProperty("samplerOffsets", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->samplerOffsets), ctx);
    }
    json->getProperty("flexibleSet", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->flexibleSet), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_BindingMappingInfo_finalize)

static bool js_gfx_BindingMappingInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::BindingMappingInfo* cobj = JSB_ALLOC(cc::gfx::BindingMappingInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::BindingMappingInfo* cobj = JSB_ALLOC(cc::gfx::BindingMappingInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::BindingMappingInfo* cobj = JSB_ALLOC(cc::gfx::BindingMappingInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->bufferOffsets), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->samplerOffsets), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->flexibleSet), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_BindingMappingInfo_constructor, __jsb_cc_gfx_BindingMappingInfo_class, js_cc_gfx_BindingMappingInfo_finalize)



static bool js_cc_gfx_BindingMappingInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::BindingMappingInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::BindingMappingInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_BindingMappingInfo_finalize)

bool js_register_gfx_BindingMappingInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BindingMappingInfo", obj, nullptr, _SE(js_gfx_BindingMappingInfo_constructor));

    cls->defineProperty("bufferOffsets", _SE(js_gfx_BindingMappingInfo_get_bufferOffsets), _SE(js_gfx_BindingMappingInfo_set_bufferOffsets));
    cls->defineProperty("samplerOffsets", _SE(js_gfx_BindingMappingInfo_get_samplerOffsets), _SE(js_gfx_BindingMappingInfo_set_samplerOffsets));
    cls->defineProperty("flexibleSet", _SE(js_gfx_BindingMappingInfo_get_flexibleSet), _SE(js_gfx_BindingMappingInfo_set_flexibleSet));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_BindingMappingInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::BindingMappingInfo>(cls);

    __jsb_cc_gfx_BindingMappingInfo_proto = cls->getProto();
    __jsb_cc_gfx_BindingMappingInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_SwapchainInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_SwapchainInfo_class = nullptr;

static bool js_gfx_SwapchainInfo_get_windowHandle(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SwapchainInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SwapchainInfo_get_windowHandle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->windowHandle, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->windowHandle, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SwapchainInfo_get_windowHandle)

static bool js_gfx_SwapchainInfo_set_windowHandle(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SwapchainInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SwapchainInfo_set_windowHandle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->windowHandle, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SwapchainInfo_set_windowHandle : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SwapchainInfo_set_windowHandle)

static bool js_gfx_SwapchainInfo_get_vsyncMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SwapchainInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SwapchainInfo_get_vsyncMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->vsyncMode, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->vsyncMode, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SwapchainInfo_get_vsyncMode)

static bool js_gfx_SwapchainInfo_set_vsyncMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SwapchainInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SwapchainInfo_set_vsyncMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->vsyncMode, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SwapchainInfo_set_vsyncMode : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SwapchainInfo_set_vsyncMode)

static bool js_gfx_SwapchainInfo_get_width(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SwapchainInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SwapchainInfo_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->width, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->width, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SwapchainInfo_get_width)

static bool js_gfx_SwapchainInfo_set_width(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SwapchainInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SwapchainInfo_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->width, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SwapchainInfo_set_width : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SwapchainInfo_set_width)

static bool js_gfx_SwapchainInfo_get_height(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SwapchainInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SwapchainInfo_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->height, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->height, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SwapchainInfo_get_height)

static bool js_gfx_SwapchainInfo_set_height(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SwapchainInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SwapchainInfo_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->height, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SwapchainInfo_set_height : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SwapchainInfo_set_height)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::SwapchainInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::SwapchainInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("windowHandle", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->windowHandle), ctx);
    }
    json->getProperty("vsyncMode", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->vsyncMode), ctx);
    }
    json->getProperty("width", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->width), ctx);
    }
    json->getProperty("height", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->height), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_SwapchainInfo_finalize)

static bool js_gfx_SwapchainInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::SwapchainInfo* cobj = JSB_ALLOC(cc::gfx::SwapchainInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::SwapchainInfo* cobj = JSB_ALLOC(cc::gfx::SwapchainInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::SwapchainInfo* cobj = JSB_ALLOC(cc::gfx::SwapchainInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->windowHandle), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->vsyncMode), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->width), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->height), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_SwapchainInfo_constructor, __jsb_cc_gfx_SwapchainInfo_class, js_cc_gfx_SwapchainInfo_finalize)



static bool js_cc_gfx_SwapchainInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::SwapchainInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::SwapchainInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_SwapchainInfo_finalize)

bool js_register_gfx_SwapchainInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SwapchainInfo", obj, nullptr, _SE(js_gfx_SwapchainInfo_constructor));

    cls->defineProperty("windowHandle", _SE(js_gfx_SwapchainInfo_get_windowHandle), _SE(js_gfx_SwapchainInfo_set_windowHandle));
    cls->defineProperty("vsyncMode", _SE(js_gfx_SwapchainInfo_get_vsyncMode), _SE(js_gfx_SwapchainInfo_set_vsyncMode));
    cls->defineProperty("width", _SE(js_gfx_SwapchainInfo_get_width), _SE(js_gfx_SwapchainInfo_set_width));
    cls->defineProperty("height", _SE(js_gfx_SwapchainInfo_get_height), _SE(js_gfx_SwapchainInfo_set_height));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_SwapchainInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::SwapchainInfo>(cls);

    __jsb_cc_gfx_SwapchainInfo_proto = cls->getProto();
    __jsb_cc_gfx_SwapchainInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_DeviceInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_DeviceInfo_class = nullptr;

static bool js_gfx_DeviceInfo_get_bindingMappingInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_get_bindingMappingInfo : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bindingMappingInfo, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->bindingMappingInfo, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceInfo_get_bindingMappingInfo)

static bool js_gfx_DeviceInfo_set_bindingMappingInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_set_bindingMappingInfo : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bindingMappingInfo, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceInfo_set_bindingMappingInfo : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceInfo_set_bindingMappingInfo)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::DeviceInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::DeviceInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("bindingMappingInfo", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bindingMappingInfo), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DeviceInfo_finalize)

static bool js_gfx_DeviceInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::DeviceInfo* cobj = JSB_ALLOC(cc::gfx::DeviceInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::DeviceInfo* cobj = JSB_ALLOC(cc::gfx::DeviceInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->bindingMappingInfo), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_DeviceInfo_constructor, __jsb_cc_gfx_DeviceInfo_class, js_cc_gfx_DeviceInfo_finalize)



static bool js_cc_gfx_DeviceInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::DeviceInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DeviceInfo_finalize)

bool js_register_gfx_DeviceInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DeviceInfo", obj, nullptr, _SE(js_gfx_DeviceInfo_constructor));

    cls->defineProperty("bindingMappingInfo", _SE(js_gfx_DeviceInfo_get_bindingMappingInfo), _SE(js_gfx_DeviceInfo_set_bindingMappingInfo));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DeviceInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DeviceInfo>(cls);

    __jsb_cc_gfx_DeviceInfo_proto = cls->getProto();
    __jsb_cc_gfx_DeviceInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_BufferInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_BufferInfo_class = nullptr;

static bool js_gfx_BufferInfo_get_usage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_get_usage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->usage, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->usage, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferInfo_get_usage)

static bool js_gfx_BufferInfo_set_usage(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_set_usage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->usage, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BufferInfo_set_usage : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferInfo_set_usage)

static bool js_gfx_BufferInfo_get_memUsage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_get_memUsage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->memUsage, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->memUsage, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferInfo_get_memUsage)

static bool js_gfx_BufferInfo_set_memUsage(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_set_memUsage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->memUsage, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BufferInfo_set_memUsage : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferInfo_set_memUsage)

static bool js_gfx_BufferInfo_get_size(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_get_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->size, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->size, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferInfo_get_size)

static bool js_gfx_BufferInfo_set_size(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_set_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->size, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BufferInfo_set_size : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferInfo_set_size)

static bool js_gfx_BufferInfo_get_stride(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_get_stride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stride, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stride, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferInfo_get_stride)

static bool js_gfx_BufferInfo_set_stride(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_set_stride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stride, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BufferInfo_set_stride : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferInfo_set_stride)

static bool js_gfx_BufferInfo_get_flags(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_get_flags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->flags, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->flags, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferInfo_get_flags)

static bool js_gfx_BufferInfo_set_flags(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_set_flags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->flags, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BufferInfo_set_flags : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferInfo_set_flags)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::BufferInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::BufferInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("usage", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->usage), ctx);
    }
    json->getProperty("memUsage", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->memUsage), ctx);
    }
    json->getProperty("size", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->size), ctx);
    }
    json->getProperty("stride", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stride), ctx);
    }
    json->getProperty("flags", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->flags), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_BufferInfo_finalize)

static bool js_gfx_BufferInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::BufferInfo* cobj = JSB_ALLOC(cc::gfx::BufferInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::BufferInfo* cobj = JSB_ALLOC(cc::gfx::BufferInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::BufferInfo* cobj = JSB_ALLOC(cc::gfx::BufferInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->usage), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->memUsage), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->size), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->stride), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->flags), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_BufferInfo_constructor, __jsb_cc_gfx_BufferInfo_class, js_cc_gfx_BufferInfo_finalize)



static bool js_cc_gfx_BufferInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::BufferInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_BufferInfo_finalize)

bool js_register_gfx_BufferInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BufferInfo", obj, nullptr, _SE(js_gfx_BufferInfo_constructor));

    cls->defineProperty("usage", _SE(js_gfx_BufferInfo_get_usage), _SE(js_gfx_BufferInfo_set_usage));
    cls->defineProperty("memUsage", _SE(js_gfx_BufferInfo_get_memUsage), _SE(js_gfx_BufferInfo_set_memUsage));
    cls->defineProperty("size", _SE(js_gfx_BufferInfo_get_size), _SE(js_gfx_BufferInfo_set_size));
    cls->defineProperty("stride", _SE(js_gfx_BufferInfo_get_stride), _SE(js_gfx_BufferInfo_set_stride));
    cls->defineProperty("flags", _SE(js_gfx_BufferInfo_get_flags), _SE(js_gfx_BufferInfo_set_flags));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_BufferInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::BufferInfo>(cls);

    __jsb_cc_gfx_BufferInfo_proto = cls->getProto();
    __jsb_cc_gfx_BufferInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_BufferViewInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_BufferViewInfo_class = nullptr;

static bool js_gfx_BufferViewInfo_get_buffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferViewInfo_get_buffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->buffer, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->buffer, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferViewInfo_get_buffer)

static bool js_gfx_BufferViewInfo_set_buffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferViewInfo_set_buffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->buffer, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BufferViewInfo_set_buffer : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferViewInfo_set_buffer)

static bool js_gfx_BufferViewInfo_get_offset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferViewInfo_get_offset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->offset, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->offset, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferViewInfo_get_offset)

static bool js_gfx_BufferViewInfo_set_offset(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferViewInfo_set_offset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->offset, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BufferViewInfo_set_offset : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferViewInfo_set_offset)

static bool js_gfx_BufferViewInfo_get_range(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferViewInfo_get_range : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->range, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->range, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferViewInfo_get_range)

static bool js_gfx_BufferViewInfo_set_range(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferViewInfo_set_range : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->range, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BufferViewInfo_set_range : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferViewInfo_set_range)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::BufferViewInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::BufferViewInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("buffer", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->buffer), ctx);
    }
    json->getProperty("offset", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->offset), ctx);
    }
    json->getProperty("range", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->range), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_BufferViewInfo_finalize)

static bool js_gfx_BufferViewInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::BufferViewInfo* cobj = JSB_ALLOC(cc::gfx::BufferViewInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::BufferViewInfo* cobj = JSB_ALLOC(cc::gfx::BufferViewInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::BufferViewInfo* cobj = JSB_ALLOC(cc::gfx::BufferViewInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->buffer), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->offset), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->range), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_BufferViewInfo_constructor, __jsb_cc_gfx_BufferViewInfo_class, js_cc_gfx_BufferViewInfo_finalize)



static bool js_cc_gfx_BufferViewInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::BufferViewInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::BufferViewInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_BufferViewInfo_finalize)

bool js_register_gfx_BufferViewInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BufferViewInfo", obj, nullptr, _SE(js_gfx_BufferViewInfo_constructor));

    cls->defineProperty("buffer", _SE(js_gfx_BufferViewInfo_get_buffer), _SE(js_gfx_BufferViewInfo_set_buffer));
    cls->defineProperty("offset", _SE(js_gfx_BufferViewInfo_get_offset), _SE(js_gfx_BufferViewInfo_set_offset));
    cls->defineProperty("range", _SE(js_gfx_BufferViewInfo_get_range), _SE(js_gfx_BufferViewInfo_set_range));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_BufferViewInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::BufferViewInfo>(cls);

    __jsb_cc_gfx_BufferViewInfo_proto = cls->getProto();
    __jsb_cc_gfx_BufferViewInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_DrawInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_DrawInfo_class = nullptr;

static bool js_gfx_DrawInfo_get_vertexCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DrawInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_get_vertexCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->vertexCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->vertexCount, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DrawInfo_get_vertexCount)

static bool js_gfx_DrawInfo_set_vertexCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DrawInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_set_vertexCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->vertexCount, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DrawInfo_set_vertexCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DrawInfo_set_vertexCount)

static bool js_gfx_DrawInfo_get_firstVertex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DrawInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_get_firstVertex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->firstVertex, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->firstVertex, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DrawInfo_get_firstVertex)

static bool js_gfx_DrawInfo_set_firstVertex(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DrawInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_set_firstVertex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->firstVertex, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DrawInfo_set_firstVertex : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DrawInfo_set_firstVertex)

static bool js_gfx_DrawInfo_get_indexCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DrawInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_get_indexCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->indexCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->indexCount, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DrawInfo_get_indexCount)

static bool js_gfx_DrawInfo_set_indexCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DrawInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_set_indexCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->indexCount, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DrawInfo_set_indexCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DrawInfo_set_indexCount)

static bool js_gfx_DrawInfo_get_firstIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DrawInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_get_firstIndex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->firstIndex, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->firstIndex, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DrawInfo_get_firstIndex)

static bool js_gfx_DrawInfo_set_firstIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DrawInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_set_firstIndex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->firstIndex, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DrawInfo_set_firstIndex : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DrawInfo_set_firstIndex)

static bool js_gfx_DrawInfo_get_vertexOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DrawInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_get_vertexOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->vertexOffset, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->vertexOffset, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DrawInfo_get_vertexOffset)

static bool js_gfx_DrawInfo_set_vertexOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DrawInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_set_vertexOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->vertexOffset, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DrawInfo_set_vertexOffset : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DrawInfo_set_vertexOffset)

static bool js_gfx_DrawInfo_get_instanceCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DrawInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_get_instanceCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->instanceCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->instanceCount, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DrawInfo_get_instanceCount)

static bool js_gfx_DrawInfo_set_instanceCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DrawInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_set_instanceCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->instanceCount, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DrawInfo_set_instanceCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DrawInfo_set_instanceCount)

static bool js_gfx_DrawInfo_get_firstInstance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DrawInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_get_firstInstance : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->firstInstance, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->firstInstance, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DrawInfo_get_firstInstance)

static bool js_gfx_DrawInfo_set_firstInstance(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DrawInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DrawInfo_set_firstInstance : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->firstInstance, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DrawInfo_set_firstInstance : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DrawInfo_set_firstInstance)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::DrawInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::DrawInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("vertexCount", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->vertexCount), ctx);
    }
    json->getProperty("firstVertex", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->firstVertex), ctx);
    }
    json->getProperty("indexCount", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->indexCount), ctx);
    }
    json->getProperty("firstIndex", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->firstIndex), ctx);
    }
    json->getProperty("vertexOffset", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->vertexOffset), ctx);
    }
    json->getProperty("instanceCount", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->instanceCount), ctx);
    }
    json->getProperty("firstInstance", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->firstInstance), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DrawInfo_finalize)

static bool js_gfx_DrawInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::DrawInfo* cobj = JSB_ALLOC(cc::gfx::DrawInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::DrawInfo* cobj = JSB_ALLOC(cc::gfx::DrawInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::DrawInfo* cobj = JSB_ALLOC(cc::gfx::DrawInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->vertexCount), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->firstVertex), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->indexCount), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->firstIndex), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->vertexOffset), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->instanceCount), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->firstInstance), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_DrawInfo_constructor, __jsb_cc_gfx_DrawInfo_class, js_cc_gfx_DrawInfo_finalize)



static bool js_cc_gfx_DrawInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::DrawInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::DrawInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DrawInfo_finalize)

bool js_register_gfx_DrawInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DrawInfo", obj, nullptr, _SE(js_gfx_DrawInfo_constructor));

    cls->defineProperty("vertexCount", _SE(js_gfx_DrawInfo_get_vertexCount), _SE(js_gfx_DrawInfo_set_vertexCount));
    cls->defineProperty("firstVertex", _SE(js_gfx_DrawInfo_get_firstVertex), _SE(js_gfx_DrawInfo_set_firstVertex));
    cls->defineProperty("indexCount", _SE(js_gfx_DrawInfo_get_indexCount), _SE(js_gfx_DrawInfo_set_indexCount));
    cls->defineProperty("firstIndex", _SE(js_gfx_DrawInfo_get_firstIndex), _SE(js_gfx_DrawInfo_set_firstIndex));
    cls->defineProperty("vertexOffset", _SE(js_gfx_DrawInfo_get_vertexOffset), _SE(js_gfx_DrawInfo_set_vertexOffset));
    cls->defineProperty("instanceCount", _SE(js_gfx_DrawInfo_get_instanceCount), _SE(js_gfx_DrawInfo_set_instanceCount));
    cls->defineProperty("firstInstance", _SE(js_gfx_DrawInfo_get_firstInstance), _SE(js_gfx_DrawInfo_set_firstInstance));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DrawInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DrawInfo>(cls);

    __jsb_cc_gfx_DrawInfo_proto = cls->getProto();
    __jsb_cc_gfx_DrawInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_DispatchInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_DispatchInfo_class = nullptr;

static bool js_gfx_DispatchInfo_get_groupCountX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DispatchInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DispatchInfo_get_groupCountX : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->groupCountX, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->groupCountX, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DispatchInfo_get_groupCountX)

static bool js_gfx_DispatchInfo_set_groupCountX(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DispatchInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DispatchInfo_set_groupCountX : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->groupCountX, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DispatchInfo_set_groupCountX : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DispatchInfo_set_groupCountX)

static bool js_gfx_DispatchInfo_get_groupCountY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DispatchInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DispatchInfo_get_groupCountY : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->groupCountY, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->groupCountY, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DispatchInfo_get_groupCountY)

static bool js_gfx_DispatchInfo_set_groupCountY(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DispatchInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DispatchInfo_set_groupCountY : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->groupCountY, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DispatchInfo_set_groupCountY : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DispatchInfo_set_groupCountY)

static bool js_gfx_DispatchInfo_get_groupCountZ(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DispatchInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DispatchInfo_get_groupCountZ : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->groupCountZ, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->groupCountZ, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DispatchInfo_get_groupCountZ)

static bool js_gfx_DispatchInfo_set_groupCountZ(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DispatchInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DispatchInfo_set_groupCountZ : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->groupCountZ, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DispatchInfo_set_groupCountZ : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DispatchInfo_set_groupCountZ)

static bool js_gfx_DispatchInfo_get_indirectBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DispatchInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DispatchInfo_get_indirectBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->indirectBuffer, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->indirectBuffer, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DispatchInfo_get_indirectBuffer)

static bool js_gfx_DispatchInfo_set_indirectBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DispatchInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DispatchInfo_set_indirectBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->indirectBuffer, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DispatchInfo_set_indirectBuffer : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DispatchInfo_set_indirectBuffer)

static bool js_gfx_DispatchInfo_get_indirectOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DispatchInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DispatchInfo_get_indirectOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->indirectOffset, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->indirectOffset, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DispatchInfo_get_indirectOffset)

static bool js_gfx_DispatchInfo_set_indirectOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DispatchInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DispatchInfo_set_indirectOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->indirectOffset, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DispatchInfo_set_indirectOffset : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DispatchInfo_set_indirectOffset)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::DispatchInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::DispatchInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("groupCountX", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->groupCountX), ctx);
    }
    json->getProperty("groupCountY", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->groupCountY), ctx);
    }
    json->getProperty("groupCountZ", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->groupCountZ), ctx);
    }
    json->getProperty("indirectBuffer", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->indirectBuffer), ctx);
    }
    json->getProperty("indirectOffset", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->indirectOffset), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DispatchInfo_finalize)

static bool js_gfx_DispatchInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::DispatchInfo* cobj = JSB_ALLOC(cc::gfx::DispatchInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::DispatchInfo* cobj = JSB_ALLOC(cc::gfx::DispatchInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::DispatchInfo* cobj = JSB_ALLOC(cc::gfx::DispatchInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->groupCountX), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->groupCountY), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->groupCountZ), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->indirectBuffer), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->indirectOffset), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_DispatchInfo_constructor, __jsb_cc_gfx_DispatchInfo_class, js_cc_gfx_DispatchInfo_finalize)



static bool js_cc_gfx_DispatchInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::DispatchInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::DispatchInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DispatchInfo_finalize)

bool js_register_gfx_DispatchInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DispatchInfo", obj, nullptr, _SE(js_gfx_DispatchInfo_constructor));

    cls->defineProperty("groupCountX", _SE(js_gfx_DispatchInfo_get_groupCountX), _SE(js_gfx_DispatchInfo_set_groupCountX));
    cls->defineProperty("groupCountY", _SE(js_gfx_DispatchInfo_get_groupCountY), _SE(js_gfx_DispatchInfo_set_groupCountY));
    cls->defineProperty("groupCountZ", _SE(js_gfx_DispatchInfo_get_groupCountZ), _SE(js_gfx_DispatchInfo_set_groupCountZ));
    cls->defineProperty("indirectBuffer", _SE(js_gfx_DispatchInfo_get_indirectBuffer), _SE(js_gfx_DispatchInfo_set_indirectBuffer));
    cls->defineProperty("indirectOffset", _SE(js_gfx_DispatchInfo_get_indirectOffset), _SE(js_gfx_DispatchInfo_set_indirectOffset));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DispatchInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DispatchInfo>(cls);

    __jsb_cc_gfx_DispatchInfo_proto = cls->getProto();
    __jsb_cc_gfx_DispatchInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_IndirectBuffer_proto = nullptr;
se::Class* __jsb_cc_gfx_IndirectBuffer_class = nullptr;

static bool js_gfx_IndirectBuffer_get_drawInfos(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::IndirectBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_IndirectBuffer_get_drawInfos : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->drawInfos, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->drawInfos, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_IndirectBuffer_get_drawInfos)

static bool js_gfx_IndirectBuffer_set_drawInfos(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::IndirectBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_IndirectBuffer_set_drawInfos : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->drawInfos, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_IndirectBuffer_set_drawInfos : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_IndirectBuffer_set_drawInfos)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::IndirectBuffer * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::IndirectBuffer*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("drawInfos", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->drawInfos), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_IndirectBuffer_finalize)

static bool js_gfx_IndirectBuffer_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::IndirectBuffer* cobj = JSB_ALLOC(cc::gfx::IndirectBuffer);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::IndirectBuffer* cobj = JSB_ALLOC(cc::gfx::IndirectBuffer);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->drawInfos), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_IndirectBuffer_constructor, __jsb_cc_gfx_IndirectBuffer_class, js_cc_gfx_IndirectBuffer_finalize)



static bool js_cc_gfx_IndirectBuffer_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::IndirectBuffer>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::IndirectBuffer>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_IndirectBuffer_finalize)

bool js_register_gfx_IndirectBuffer(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IndirectBuffer", obj, nullptr, _SE(js_gfx_IndirectBuffer_constructor));

    cls->defineProperty("drawInfos", _SE(js_gfx_IndirectBuffer_get_drawInfos), _SE(js_gfx_IndirectBuffer_set_drawInfos));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_IndirectBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::IndirectBuffer>(cls);

    __jsb_cc_gfx_IndirectBuffer_proto = cls->getProto();
    __jsb_cc_gfx_IndirectBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_TextureInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_TextureInfo_class = nullptr;

static bool js_gfx_TextureInfo_get_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->type, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_type)

static bool js_gfx_TextureInfo_set_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->type, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_type)

static bool js_gfx_TextureInfo_get_usage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_usage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->usage, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->usage, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_usage)

static bool js_gfx_TextureInfo_set_usage(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_usage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->usage, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_usage : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_usage)

static bool js_gfx_TextureInfo_get_format(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->format, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->format, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_format)

static bool js_gfx_TextureInfo_set_format(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->format, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_format : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_format)

static bool js_gfx_TextureInfo_get_width(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->width, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->width, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_width)

static bool js_gfx_TextureInfo_set_width(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->width, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_width : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_width)

static bool js_gfx_TextureInfo_get_height(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->height, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->height, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_height)

static bool js_gfx_TextureInfo_set_height(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->height, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_height : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_height)

static bool js_gfx_TextureInfo_get_flags(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_flags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->flags, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->flags, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_flags)

static bool js_gfx_TextureInfo_set_flags(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_flags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->flags, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_flags : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_flags)

static bool js_gfx_TextureInfo_get_layerCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->layerCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->layerCount, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_layerCount)

static bool js_gfx_TextureInfo_set_layerCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->layerCount, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_layerCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_layerCount)

static bool js_gfx_TextureInfo_get_levelCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_levelCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->levelCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->levelCount, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_levelCount)

static bool js_gfx_TextureInfo_set_levelCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_levelCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->levelCount, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_levelCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_levelCount)

static bool js_gfx_TextureInfo_get_samples(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_samples : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->samples, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->samples, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_samples)

static bool js_gfx_TextureInfo_set_samples(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_samples : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->samples, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_samples : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_samples)

static bool js_gfx_TextureInfo_get_depth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depth, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depth, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_depth)

static bool js_gfx_TextureInfo_set_depth(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depth, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_depth : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_depth)

static bool js_gfx_TextureInfo_get_externalRes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_externalRes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->externalRes, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->externalRes, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_externalRes)

static bool js_gfx_TextureInfo_set_externalRes(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_externalRes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->externalRes, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_externalRes : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_externalRes)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::TextureInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::TextureInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("type", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    json->getProperty("usage", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->usage), ctx);
    }
    json->getProperty("format", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->format), ctx);
    }
    json->getProperty("width", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->width), ctx);
    }
    json->getProperty("height", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->height), ctx);
    }
    json->getProperty("flags", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->flags), ctx);
    }
    json->getProperty("layerCount", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->layerCount), ctx);
    }
    json->getProperty("levelCount", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->levelCount), ctx);
    }
    json->getProperty("samples", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->samples), ctx);
    }
    json->getProperty("depth", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depth), ctx);
    }
    json->getProperty("externalRes", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->externalRes), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_TextureInfo_finalize)

static bool js_gfx_TextureInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::TextureInfo* cobj = JSB_ALLOC(cc::gfx::TextureInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::TextureInfo* cobj = JSB_ALLOC(cc::gfx::TextureInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::TextureInfo* cobj = JSB_ALLOC(cc::gfx::TextureInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->type), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->usage), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->format), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->width), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->height), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->flags), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->layerCount), nullptr);
    }
    if (argc > 7 && !args[7].isUndefined()) {
        ok &= sevalue_to_native(args[7], &(cobj->levelCount), nullptr);
    }
    if (argc > 8 && !args[8].isUndefined()) {
        ok &= sevalue_to_native(args[8], &(cobj->samples), nullptr);
    }
    if (argc > 9 && !args[9].isUndefined()) {
        ok &= sevalue_to_native(args[9], &(cobj->depth), nullptr);
    }
    if (argc > 10 && !args[10].isUndefined()) {
        ok &= sevalue_to_native(args[10], &(cobj->externalRes), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_TextureInfo_constructor, __jsb_cc_gfx_TextureInfo_class, js_cc_gfx_TextureInfo_finalize)



static bool js_cc_gfx_TextureInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::TextureInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_TextureInfo_finalize)

bool js_register_gfx_TextureInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TextureInfo", obj, nullptr, _SE(js_gfx_TextureInfo_constructor));

    cls->defineProperty("type", _SE(js_gfx_TextureInfo_get_type), _SE(js_gfx_TextureInfo_set_type));
    cls->defineProperty("usage", _SE(js_gfx_TextureInfo_get_usage), _SE(js_gfx_TextureInfo_set_usage));
    cls->defineProperty("format", _SE(js_gfx_TextureInfo_get_format), _SE(js_gfx_TextureInfo_set_format));
    cls->defineProperty("width", _SE(js_gfx_TextureInfo_get_width), _SE(js_gfx_TextureInfo_set_width));
    cls->defineProperty("height", _SE(js_gfx_TextureInfo_get_height), _SE(js_gfx_TextureInfo_set_height));
    cls->defineProperty("flags", _SE(js_gfx_TextureInfo_get_flags), _SE(js_gfx_TextureInfo_set_flags));
    cls->defineProperty("layerCount", _SE(js_gfx_TextureInfo_get_layerCount), _SE(js_gfx_TextureInfo_set_layerCount));
    cls->defineProperty("levelCount", _SE(js_gfx_TextureInfo_get_levelCount), _SE(js_gfx_TextureInfo_set_levelCount));
    cls->defineProperty("samples", _SE(js_gfx_TextureInfo_get_samples), _SE(js_gfx_TextureInfo_set_samples));
    cls->defineProperty("depth", _SE(js_gfx_TextureInfo_get_depth), _SE(js_gfx_TextureInfo_set_depth));
    cls->defineProperty("externalRes", _SE(js_gfx_TextureInfo_get_externalRes), _SE(js_gfx_TextureInfo_set_externalRes));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_TextureInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::TextureInfo>(cls);

    __jsb_cc_gfx_TextureInfo_proto = cls->getProto();
    __jsb_cc_gfx_TextureInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_TextureViewInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_TextureViewInfo_class = nullptr;

static bool js_gfx_TextureViewInfo_get_texture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_texture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->texture, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->texture, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_texture)

static bool js_gfx_TextureViewInfo_set_texture(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_texture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->texture, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_texture : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_texture)

static bool js_gfx_TextureViewInfo_get_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->type, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_type)

static bool js_gfx_TextureViewInfo_set_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->type, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_type)

static bool js_gfx_TextureViewInfo_get_format(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->format, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->format, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_format)

static bool js_gfx_TextureViewInfo_set_format(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->format, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_format : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_format)

static bool js_gfx_TextureViewInfo_get_baseLevel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_baseLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->baseLevel, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->baseLevel, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_baseLevel)

static bool js_gfx_TextureViewInfo_set_baseLevel(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_baseLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->baseLevel, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_baseLevel : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_baseLevel)

static bool js_gfx_TextureViewInfo_get_levelCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_levelCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->levelCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->levelCount, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_levelCount)

static bool js_gfx_TextureViewInfo_set_levelCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_levelCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->levelCount, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_levelCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_levelCount)

static bool js_gfx_TextureViewInfo_get_baseLayer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_baseLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->baseLayer, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->baseLayer, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_baseLayer)

static bool js_gfx_TextureViewInfo_set_baseLayer(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_baseLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->baseLayer, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_baseLayer : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_baseLayer)

static bool js_gfx_TextureViewInfo_get_layerCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->layerCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->layerCount, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_layerCount)

static bool js_gfx_TextureViewInfo_set_layerCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->layerCount, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_layerCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_layerCount)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::TextureViewInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::TextureViewInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("texture", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->texture), ctx);
    }
    json->getProperty("type", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    json->getProperty("format", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->format), ctx);
    }
    json->getProperty("baseLevel", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->baseLevel), ctx);
    }
    json->getProperty("levelCount", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->levelCount), ctx);
    }
    json->getProperty("baseLayer", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->baseLayer), ctx);
    }
    json->getProperty("layerCount", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->layerCount), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_TextureViewInfo_finalize)

static bool js_gfx_TextureViewInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::TextureViewInfo* cobj = JSB_ALLOC(cc::gfx::TextureViewInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::TextureViewInfo* cobj = JSB_ALLOC(cc::gfx::TextureViewInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::TextureViewInfo* cobj = JSB_ALLOC(cc::gfx::TextureViewInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->texture), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->type), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->format), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->baseLevel), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->levelCount), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->baseLayer), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->layerCount), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_TextureViewInfo_constructor, __jsb_cc_gfx_TextureViewInfo_class, js_cc_gfx_TextureViewInfo_finalize)



static bool js_cc_gfx_TextureViewInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_TextureViewInfo_finalize)

bool js_register_gfx_TextureViewInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TextureViewInfo", obj, nullptr, _SE(js_gfx_TextureViewInfo_constructor));

    cls->defineProperty("texture", _SE(js_gfx_TextureViewInfo_get_texture), _SE(js_gfx_TextureViewInfo_set_texture));
    cls->defineProperty("type", _SE(js_gfx_TextureViewInfo_get_type), _SE(js_gfx_TextureViewInfo_set_type));
    cls->defineProperty("format", _SE(js_gfx_TextureViewInfo_get_format), _SE(js_gfx_TextureViewInfo_set_format));
    cls->defineProperty("baseLevel", _SE(js_gfx_TextureViewInfo_get_baseLevel), _SE(js_gfx_TextureViewInfo_set_baseLevel));
    cls->defineProperty("levelCount", _SE(js_gfx_TextureViewInfo_get_levelCount), _SE(js_gfx_TextureViewInfo_set_levelCount));
    cls->defineProperty("baseLayer", _SE(js_gfx_TextureViewInfo_get_baseLayer), _SE(js_gfx_TextureViewInfo_set_baseLayer));
    cls->defineProperty("layerCount", _SE(js_gfx_TextureViewInfo_get_layerCount), _SE(js_gfx_TextureViewInfo_set_layerCount));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_TextureViewInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::TextureViewInfo>(cls);

    __jsb_cc_gfx_TextureViewInfo_proto = cls->getProto();
    __jsb_cc_gfx_TextureViewInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_SamplerInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_SamplerInfo_class = nullptr;

static bool js_gfx_SamplerInfo_get_minFilter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_minFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->minFilter, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->minFilter, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_minFilter)

static bool js_gfx_SamplerInfo_set_minFilter(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_minFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->minFilter, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_minFilter : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_minFilter)

static bool js_gfx_SamplerInfo_get_magFilter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_magFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->magFilter, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->magFilter, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_magFilter)

static bool js_gfx_SamplerInfo_set_magFilter(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_magFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->magFilter, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_magFilter : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_magFilter)

static bool js_gfx_SamplerInfo_get_mipFilter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_mipFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->mipFilter, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->mipFilter, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_mipFilter)

static bool js_gfx_SamplerInfo_set_mipFilter(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_mipFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->mipFilter, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_mipFilter : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_mipFilter)

static bool js_gfx_SamplerInfo_get_addressU(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_addressU : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->addressU, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->addressU, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_addressU)

static bool js_gfx_SamplerInfo_set_addressU(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_addressU : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->addressU, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_addressU : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_addressU)

static bool js_gfx_SamplerInfo_get_addressV(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_addressV : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->addressV, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->addressV, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_addressV)

static bool js_gfx_SamplerInfo_set_addressV(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_addressV : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->addressV, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_addressV : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_addressV)

static bool js_gfx_SamplerInfo_get_addressW(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_addressW : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->addressW, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->addressW, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_addressW)

static bool js_gfx_SamplerInfo_set_addressW(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_addressW : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->addressW, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_addressW : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_addressW)

static bool js_gfx_SamplerInfo_get_maxAnisotropy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_maxAnisotropy : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxAnisotropy, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxAnisotropy, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_maxAnisotropy)

static bool js_gfx_SamplerInfo_set_maxAnisotropy(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_maxAnisotropy : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxAnisotropy, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_maxAnisotropy : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_maxAnisotropy)

static bool js_gfx_SamplerInfo_get_cmpFunc(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_cmpFunc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->cmpFunc, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->cmpFunc, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_cmpFunc)

static bool js_gfx_SamplerInfo_set_cmpFunc(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_cmpFunc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->cmpFunc, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_cmpFunc : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_cmpFunc)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::SamplerInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::SamplerInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("minFilter", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->minFilter), ctx);
    }
    json->getProperty("magFilter", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->magFilter), ctx);
    }
    json->getProperty("mipFilter", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mipFilter), ctx);
    }
    json->getProperty("addressU", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->addressU), ctx);
    }
    json->getProperty("addressV", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->addressV), ctx);
    }
    json->getProperty("addressW", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->addressW), ctx);
    }
    json->getProperty("maxAnisotropy", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxAnisotropy), ctx);
    }
    json->getProperty("cmpFunc", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->cmpFunc), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_SamplerInfo_finalize)

static bool js_gfx_SamplerInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::SamplerInfo* cobj = JSB_ALLOC(cc::gfx::SamplerInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::SamplerInfo* cobj = JSB_ALLOC(cc::gfx::SamplerInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::SamplerInfo* cobj = JSB_ALLOC(cc::gfx::SamplerInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->minFilter), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->magFilter), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->mipFilter), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->addressU), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->addressV), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->addressW), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->maxAnisotropy), nullptr);
    }
    if (argc > 7 && !args[7].isUndefined()) {
        ok &= sevalue_to_native(args[7], &(cobj->cmpFunc), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_SamplerInfo_constructor, __jsb_cc_gfx_SamplerInfo_class, js_cc_gfx_SamplerInfo_finalize)



static bool js_cc_gfx_SamplerInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_SamplerInfo_finalize)

bool js_register_gfx_SamplerInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SamplerInfo", obj, nullptr, _SE(js_gfx_SamplerInfo_constructor));

    cls->defineProperty("minFilter", _SE(js_gfx_SamplerInfo_get_minFilter), _SE(js_gfx_SamplerInfo_set_minFilter));
    cls->defineProperty("magFilter", _SE(js_gfx_SamplerInfo_get_magFilter), _SE(js_gfx_SamplerInfo_set_magFilter));
    cls->defineProperty("mipFilter", _SE(js_gfx_SamplerInfo_get_mipFilter), _SE(js_gfx_SamplerInfo_set_mipFilter));
    cls->defineProperty("addressU", _SE(js_gfx_SamplerInfo_get_addressU), _SE(js_gfx_SamplerInfo_set_addressU));
    cls->defineProperty("addressV", _SE(js_gfx_SamplerInfo_get_addressV), _SE(js_gfx_SamplerInfo_set_addressV));
    cls->defineProperty("addressW", _SE(js_gfx_SamplerInfo_get_addressW), _SE(js_gfx_SamplerInfo_set_addressW));
    cls->defineProperty("maxAnisotropy", _SE(js_gfx_SamplerInfo_get_maxAnisotropy), _SE(js_gfx_SamplerInfo_set_maxAnisotropy));
    cls->defineProperty("cmpFunc", _SE(js_gfx_SamplerInfo_get_cmpFunc), _SE(js_gfx_SamplerInfo_set_cmpFunc));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_SamplerInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::SamplerInfo>(cls);

    __jsb_cc_gfx_SamplerInfo_proto = cls->getProto();
    __jsb_cc_gfx_SamplerInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_Uniform_proto = nullptr;
se::Class* __jsb_cc_gfx_Uniform_class = nullptr;

static bool js_gfx_Uniform_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Uniform>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Uniform_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Uniform_get_name)

static bool js_gfx_Uniform_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Uniform>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Uniform_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Uniform_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Uniform_set_name)

static bool js_gfx_Uniform_get_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Uniform>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Uniform_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->type, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Uniform_get_type)

static bool js_gfx_Uniform_set_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Uniform>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Uniform_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->type, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Uniform_set_type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Uniform_set_type)

static bool js_gfx_Uniform_get_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Uniform>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Uniform_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->count, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Uniform_get_count)

static bool js_gfx_Uniform_set_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Uniform>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Uniform_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Uniform_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Uniform_set_count)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::Uniform * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::Uniform*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("name", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("type", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    json->getProperty("count", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Uniform_finalize)

static bool js_gfx_Uniform_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::Uniform* cobj = JSB_ALLOC(cc::gfx::Uniform);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Uniform* cobj = JSB_ALLOC(cc::gfx::Uniform);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::Uniform* cobj = JSB_ALLOC(cc::gfx::Uniform);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->name), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->type), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->count), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_Uniform_constructor, __jsb_cc_gfx_Uniform_class, js_cc_gfx_Uniform_finalize)



static bool js_cc_gfx_Uniform_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Uniform>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::Uniform>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Uniform_finalize)

bool js_register_gfx_Uniform(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Uniform", obj, nullptr, _SE(js_gfx_Uniform_constructor));

    cls->defineProperty("name", _SE(js_gfx_Uniform_get_name), _SE(js_gfx_Uniform_set_name));
    cls->defineProperty("type", _SE(js_gfx_Uniform_get_type), _SE(js_gfx_Uniform_set_type));
    cls->defineProperty("count", _SE(js_gfx_Uniform_get_count), _SE(js_gfx_Uniform_set_count));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Uniform_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Uniform>(cls);

    __jsb_cc_gfx_Uniform_proto = cls->getProto();
    __jsb_cc_gfx_Uniform_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_UniformBlock_proto = nullptr;
se::Class* __jsb_cc_gfx_UniformBlock_class = nullptr;

static bool js_gfx_UniformBlock_get_set(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_get_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->set, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->set, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformBlock_get_set)

static bool js_gfx_UniformBlock_set_set(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_set_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->set, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformBlock_set_set : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformBlock_set_set)

static bool js_gfx_UniformBlock_get_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->binding, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->binding, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformBlock_get_binding)

static bool js_gfx_UniformBlock_set_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->binding, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformBlock_set_binding : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformBlock_set_binding)

static bool js_gfx_UniformBlock_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformBlock_get_name)

static bool js_gfx_UniformBlock_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformBlock_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformBlock_set_name)

static bool js_gfx_UniformBlock_get_members(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_get_members : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->members, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->members, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformBlock_get_members)

static bool js_gfx_UniformBlock_set_members(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_set_members : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->members, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformBlock_set_members : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformBlock_set_members)

static bool js_gfx_UniformBlock_get_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->count, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformBlock_get_count)

static bool js_gfx_UniformBlock_set_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformBlock_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformBlock_set_count)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::UniformBlock * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::UniformBlock*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("set", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->set), ctx);
    }
    json->getProperty("binding", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->binding), ctx);
    }
    json->getProperty("name", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("members", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->members), ctx);
    }
    json->getProperty("count", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_UniformBlock_finalize)

static bool js_gfx_UniformBlock_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::UniformBlock* cobj = JSB_ALLOC(cc::gfx::UniformBlock);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::UniformBlock* cobj = JSB_ALLOC(cc::gfx::UniformBlock);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::UniformBlock* cobj = JSB_ALLOC(cc::gfx::UniformBlock);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->set), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->binding), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->name), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->members), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->count), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_UniformBlock_constructor, __jsb_cc_gfx_UniformBlock_class, js_cc_gfx_UniformBlock_finalize)



static bool js_cc_gfx_UniformBlock_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::UniformBlock>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_UniformBlock_finalize)

bool js_register_gfx_UniformBlock(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("UniformBlock", obj, nullptr, _SE(js_gfx_UniformBlock_constructor));

    cls->defineProperty("set", _SE(js_gfx_UniformBlock_get_set), _SE(js_gfx_UniformBlock_set_set));
    cls->defineProperty("binding", _SE(js_gfx_UniformBlock_get_binding), _SE(js_gfx_UniformBlock_set_binding));
    cls->defineProperty("name", _SE(js_gfx_UniformBlock_get_name), _SE(js_gfx_UniformBlock_set_name));
    cls->defineProperty("members", _SE(js_gfx_UniformBlock_get_members), _SE(js_gfx_UniformBlock_set_members));
    cls->defineProperty("count", _SE(js_gfx_UniformBlock_get_count), _SE(js_gfx_UniformBlock_set_count));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_UniformBlock_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::UniformBlock>(cls);

    __jsb_cc_gfx_UniformBlock_proto = cls->getProto();
    __jsb_cc_gfx_UniformBlock_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_UniformSamplerTexture_proto = nullptr;
se::Class* __jsb_cc_gfx_UniformSamplerTexture_class = nullptr;

static bool js_gfx_UniformSamplerTexture_get_set(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformSamplerTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSamplerTexture_get_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->set, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->set, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformSamplerTexture_get_set)

static bool js_gfx_UniformSamplerTexture_set_set(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformSamplerTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSamplerTexture_set_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->set, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformSamplerTexture_set_set : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformSamplerTexture_set_set)

static bool js_gfx_UniformSamplerTexture_get_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformSamplerTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSamplerTexture_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->binding, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->binding, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformSamplerTexture_get_binding)

static bool js_gfx_UniformSamplerTexture_set_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformSamplerTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSamplerTexture_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->binding, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformSamplerTexture_set_binding : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformSamplerTexture_set_binding)

static bool js_gfx_UniformSamplerTexture_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformSamplerTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSamplerTexture_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformSamplerTexture_get_name)

static bool js_gfx_UniformSamplerTexture_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformSamplerTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSamplerTexture_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformSamplerTexture_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformSamplerTexture_set_name)

static bool js_gfx_UniformSamplerTexture_get_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformSamplerTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSamplerTexture_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->type, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformSamplerTexture_get_type)

static bool js_gfx_UniformSamplerTexture_set_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformSamplerTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSamplerTexture_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->type, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformSamplerTexture_set_type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformSamplerTexture_set_type)

static bool js_gfx_UniformSamplerTexture_get_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformSamplerTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSamplerTexture_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->count, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformSamplerTexture_get_count)

static bool js_gfx_UniformSamplerTexture_set_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformSamplerTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSamplerTexture_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformSamplerTexture_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformSamplerTexture_set_count)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::UniformSamplerTexture * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::UniformSamplerTexture*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("set", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->set), ctx);
    }
    json->getProperty("binding", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->binding), ctx);
    }
    json->getProperty("name", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("type", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    json->getProperty("count", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_UniformSamplerTexture_finalize)

static bool js_gfx_UniformSamplerTexture_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::UniformSamplerTexture* cobj = JSB_ALLOC(cc::gfx::UniformSamplerTexture);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::UniformSamplerTexture* cobj = JSB_ALLOC(cc::gfx::UniformSamplerTexture);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::UniformSamplerTexture* cobj = JSB_ALLOC(cc::gfx::UniformSamplerTexture);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->set), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->binding), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->name), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->type), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->count), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_UniformSamplerTexture_constructor, __jsb_cc_gfx_UniformSamplerTexture_class, js_cc_gfx_UniformSamplerTexture_finalize)



static bool js_cc_gfx_UniformSamplerTexture_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::UniformSamplerTexture>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformSamplerTexture>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_UniformSamplerTexture_finalize)

bool js_register_gfx_UniformSamplerTexture(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("UniformSamplerTexture", obj, nullptr, _SE(js_gfx_UniformSamplerTexture_constructor));

    cls->defineProperty("set", _SE(js_gfx_UniformSamplerTexture_get_set), _SE(js_gfx_UniformSamplerTexture_set_set));
    cls->defineProperty("binding", _SE(js_gfx_UniformSamplerTexture_get_binding), _SE(js_gfx_UniformSamplerTexture_set_binding));
    cls->defineProperty("name", _SE(js_gfx_UniformSamplerTexture_get_name), _SE(js_gfx_UniformSamplerTexture_set_name));
    cls->defineProperty("type", _SE(js_gfx_UniformSamplerTexture_get_type), _SE(js_gfx_UniformSamplerTexture_set_type));
    cls->defineProperty("count", _SE(js_gfx_UniformSamplerTexture_get_count), _SE(js_gfx_UniformSamplerTexture_set_count));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_UniformSamplerTexture_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::UniformSamplerTexture>(cls);

    __jsb_cc_gfx_UniformSamplerTexture_proto = cls->getProto();
    __jsb_cc_gfx_UniformSamplerTexture_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_UniformSampler_proto = nullptr;
se::Class* __jsb_cc_gfx_UniformSampler_class = nullptr;

static bool js_gfx_UniformSampler_get_set(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformSampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_get_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->set, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->set, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformSampler_get_set)

static bool js_gfx_UniformSampler_set_set(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformSampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_set_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->set, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformSampler_set_set : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformSampler_set_set)

static bool js_gfx_UniformSampler_get_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformSampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->binding, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->binding, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformSampler_get_binding)

static bool js_gfx_UniformSampler_set_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformSampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->binding, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformSampler_set_binding : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformSampler_set_binding)

static bool js_gfx_UniformSampler_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformSampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformSampler_get_name)

static bool js_gfx_UniformSampler_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformSampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformSampler_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformSampler_set_name)

static bool js_gfx_UniformSampler_get_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformSampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->count, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformSampler_get_count)

static bool js_gfx_UniformSampler_set_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformSampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformSampler_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformSampler_set_count)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::UniformSampler * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::UniformSampler*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("set", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->set), ctx);
    }
    json->getProperty("binding", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->binding), ctx);
    }
    json->getProperty("name", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("count", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_UniformSampler_finalize)

static bool js_gfx_UniformSampler_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::UniformSampler* cobj = JSB_ALLOC(cc::gfx::UniformSampler);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::UniformSampler* cobj = JSB_ALLOC(cc::gfx::UniformSampler);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::UniformSampler* cobj = JSB_ALLOC(cc::gfx::UniformSampler);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->set), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->binding), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->name), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->count), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_UniformSampler_constructor, __jsb_cc_gfx_UniformSampler_class, js_cc_gfx_UniformSampler_finalize)



static bool js_cc_gfx_UniformSampler_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::UniformSampler>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformSampler>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_UniformSampler_finalize)

bool js_register_gfx_UniformSampler(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("UniformSampler", obj, nullptr, _SE(js_gfx_UniformSampler_constructor));

    cls->defineProperty("set", _SE(js_gfx_UniformSampler_get_set), _SE(js_gfx_UniformSampler_set_set));
    cls->defineProperty("binding", _SE(js_gfx_UniformSampler_get_binding), _SE(js_gfx_UniformSampler_set_binding));
    cls->defineProperty("name", _SE(js_gfx_UniformSampler_get_name), _SE(js_gfx_UniformSampler_set_name));
    cls->defineProperty("count", _SE(js_gfx_UniformSampler_get_count), _SE(js_gfx_UniformSampler_set_count));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_UniformSampler_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::UniformSampler>(cls);

    __jsb_cc_gfx_UniformSampler_proto = cls->getProto();
    __jsb_cc_gfx_UniformSampler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_UniformTexture_proto = nullptr;
se::Class* __jsb_cc_gfx_UniformTexture_class = nullptr;

static bool js_gfx_UniformTexture_get_set(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformTexture_get_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->set, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->set, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformTexture_get_set)

static bool js_gfx_UniformTexture_set_set(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformTexture_set_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->set, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformTexture_set_set : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformTexture_set_set)

static bool js_gfx_UniformTexture_get_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformTexture_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->binding, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->binding, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformTexture_get_binding)

static bool js_gfx_UniformTexture_set_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformTexture_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->binding, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformTexture_set_binding : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformTexture_set_binding)

static bool js_gfx_UniformTexture_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformTexture_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformTexture_get_name)

static bool js_gfx_UniformTexture_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformTexture_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformTexture_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformTexture_set_name)

static bool js_gfx_UniformTexture_get_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformTexture_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->type, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformTexture_get_type)

static bool js_gfx_UniformTexture_set_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformTexture_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->type, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformTexture_set_type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformTexture_set_type)

static bool js_gfx_UniformTexture_get_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformTexture_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->count, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformTexture_get_count)

static bool js_gfx_UniformTexture_set_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformTexture_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformTexture_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformTexture_set_count)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::UniformTexture * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::UniformTexture*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("set", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->set), ctx);
    }
    json->getProperty("binding", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->binding), ctx);
    }
    json->getProperty("name", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("type", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    json->getProperty("count", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_UniformTexture_finalize)

static bool js_gfx_UniformTexture_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::UniformTexture* cobj = JSB_ALLOC(cc::gfx::UniformTexture);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::UniformTexture* cobj = JSB_ALLOC(cc::gfx::UniformTexture);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::UniformTexture* cobj = JSB_ALLOC(cc::gfx::UniformTexture);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->set), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->binding), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->name), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->type), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->count), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_UniformTexture_constructor, __jsb_cc_gfx_UniformTexture_class, js_cc_gfx_UniformTexture_finalize)



static bool js_cc_gfx_UniformTexture_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::UniformTexture>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformTexture>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_UniformTexture_finalize)

bool js_register_gfx_UniformTexture(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("UniformTexture", obj, nullptr, _SE(js_gfx_UniformTexture_constructor));

    cls->defineProperty("set", _SE(js_gfx_UniformTexture_get_set), _SE(js_gfx_UniformTexture_set_set));
    cls->defineProperty("binding", _SE(js_gfx_UniformTexture_get_binding), _SE(js_gfx_UniformTexture_set_binding));
    cls->defineProperty("name", _SE(js_gfx_UniformTexture_get_name), _SE(js_gfx_UniformTexture_set_name));
    cls->defineProperty("type", _SE(js_gfx_UniformTexture_get_type), _SE(js_gfx_UniformTexture_set_type));
    cls->defineProperty("count", _SE(js_gfx_UniformTexture_get_count), _SE(js_gfx_UniformTexture_set_count));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_UniformTexture_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::UniformTexture>(cls);

    __jsb_cc_gfx_UniformTexture_proto = cls->getProto();
    __jsb_cc_gfx_UniformTexture_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_UniformStorageImage_proto = nullptr;
se::Class* __jsb_cc_gfx_UniformStorageImage_class = nullptr;

static bool js_gfx_UniformStorageImage_get_set(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageImage>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageImage_get_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->set, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->set, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformStorageImage_get_set)

static bool js_gfx_UniformStorageImage_set_set(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageImage>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageImage_set_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->set, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformStorageImage_set_set : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformStorageImage_set_set)

static bool js_gfx_UniformStorageImage_get_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageImage>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageImage_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->binding, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->binding, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformStorageImage_get_binding)

static bool js_gfx_UniformStorageImage_set_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageImage>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageImage_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->binding, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformStorageImage_set_binding : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformStorageImage_set_binding)

static bool js_gfx_UniformStorageImage_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageImage>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageImage_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformStorageImage_get_name)

static bool js_gfx_UniformStorageImage_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageImage>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageImage_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformStorageImage_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformStorageImage_set_name)

static bool js_gfx_UniformStorageImage_get_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageImage>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageImage_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->type, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformStorageImage_get_type)

static bool js_gfx_UniformStorageImage_set_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageImage>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageImage_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->type, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformStorageImage_set_type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformStorageImage_set_type)

static bool js_gfx_UniformStorageImage_get_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageImage>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageImage_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->count, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformStorageImage_get_count)

static bool js_gfx_UniformStorageImage_set_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageImage>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageImage_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformStorageImage_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformStorageImage_set_count)

static bool js_gfx_UniformStorageImage_get_memoryAccess(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageImage>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageImage_get_memoryAccess : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->memoryAccess, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->memoryAccess, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformStorageImage_get_memoryAccess)

static bool js_gfx_UniformStorageImage_set_memoryAccess(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageImage>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageImage_set_memoryAccess : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->memoryAccess, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformStorageImage_set_memoryAccess : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformStorageImage_set_memoryAccess)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::UniformStorageImage * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::UniformStorageImage*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("set", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->set), ctx);
    }
    json->getProperty("binding", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->binding), ctx);
    }
    json->getProperty("name", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("type", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    json->getProperty("count", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    json->getProperty("memoryAccess", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->memoryAccess), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_UniformStorageImage_finalize)

static bool js_gfx_UniformStorageImage_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::UniformStorageImage* cobj = JSB_ALLOC(cc::gfx::UniformStorageImage);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::UniformStorageImage* cobj = JSB_ALLOC(cc::gfx::UniformStorageImage);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::UniformStorageImage* cobj = JSB_ALLOC(cc::gfx::UniformStorageImage);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->set), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->binding), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->name), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->type), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->count), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->memoryAccess), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_UniformStorageImage_constructor, __jsb_cc_gfx_UniformStorageImage_class, js_cc_gfx_UniformStorageImage_finalize)



static bool js_cc_gfx_UniformStorageImage_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::UniformStorageImage>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageImage>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_UniformStorageImage_finalize)

bool js_register_gfx_UniformStorageImage(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("UniformStorageImage", obj, nullptr, _SE(js_gfx_UniformStorageImage_constructor));

    cls->defineProperty("set", _SE(js_gfx_UniformStorageImage_get_set), _SE(js_gfx_UniformStorageImage_set_set));
    cls->defineProperty("binding", _SE(js_gfx_UniformStorageImage_get_binding), _SE(js_gfx_UniformStorageImage_set_binding));
    cls->defineProperty("name", _SE(js_gfx_UniformStorageImage_get_name), _SE(js_gfx_UniformStorageImage_set_name));
    cls->defineProperty("type", _SE(js_gfx_UniformStorageImage_get_type), _SE(js_gfx_UniformStorageImage_set_type));
    cls->defineProperty("count", _SE(js_gfx_UniformStorageImage_get_count), _SE(js_gfx_UniformStorageImage_set_count));
    cls->defineProperty("memoryAccess", _SE(js_gfx_UniformStorageImage_get_memoryAccess), _SE(js_gfx_UniformStorageImage_set_memoryAccess));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_UniformStorageImage_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::UniformStorageImage>(cls);

    __jsb_cc_gfx_UniformStorageImage_proto = cls->getProto();
    __jsb_cc_gfx_UniformStorageImage_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_UniformStorageBuffer_proto = nullptr;
se::Class* __jsb_cc_gfx_UniformStorageBuffer_class = nullptr;

static bool js_gfx_UniformStorageBuffer_get_set(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageBuffer_get_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->set, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->set, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformStorageBuffer_get_set)

static bool js_gfx_UniformStorageBuffer_set_set(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageBuffer_set_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->set, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformStorageBuffer_set_set : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformStorageBuffer_set_set)

static bool js_gfx_UniformStorageBuffer_get_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageBuffer_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->binding, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->binding, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformStorageBuffer_get_binding)

static bool js_gfx_UniformStorageBuffer_set_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageBuffer_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->binding, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformStorageBuffer_set_binding : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformStorageBuffer_set_binding)

static bool js_gfx_UniformStorageBuffer_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageBuffer_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformStorageBuffer_get_name)

static bool js_gfx_UniformStorageBuffer_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageBuffer_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformStorageBuffer_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformStorageBuffer_set_name)

static bool js_gfx_UniformStorageBuffer_get_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageBuffer_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->count, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformStorageBuffer_get_count)

static bool js_gfx_UniformStorageBuffer_set_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageBuffer_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformStorageBuffer_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformStorageBuffer_set_count)

static bool js_gfx_UniformStorageBuffer_get_memoryAccess(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageBuffer_get_memoryAccess : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->memoryAccess, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->memoryAccess, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformStorageBuffer_get_memoryAccess)

static bool js_gfx_UniformStorageBuffer_set_memoryAccess(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformStorageBuffer_set_memoryAccess : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->memoryAccess, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformStorageBuffer_set_memoryAccess : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformStorageBuffer_set_memoryAccess)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::UniformStorageBuffer * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::UniformStorageBuffer*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("set", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->set), ctx);
    }
    json->getProperty("binding", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->binding), ctx);
    }
    json->getProperty("name", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("count", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    json->getProperty("memoryAccess", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->memoryAccess), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_UniformStorageBuffer_finalize)

static bool js_gfx_UniformStorageBuffer_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::UniformStorageBuffer* cobj = JSB_ALLOC(cc::gfx::UniformStorageBuffer);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::UniformStorageBuffer* cobj = JSB_ALLOC(cc::gfx::UniformStorageBuffer);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::UniformStorageBuffer* cobj = JSB_ALLOC(cc::gfx::UniformStorageBuffer);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->set), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->binding), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->name), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->count), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->memoryAccess), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_UniformStorageBuffer_constructor, __jsb_cc_gfx_UniformStorageBuffer_class, js_cc_gfx_UniformStorageBuffer_finalize)



static bool js_cc_gfx_UniformStorageBuffer_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::UniformStorageBuffer>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformStorageBuffer>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_UniformStorageBuffer_finalize)

bool js_register_gfx_UniformStorageBuffer(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("UniformStorageBuffer", obj, nullptr, _SE(js_gfx_UniformStorageBuffer_constructor));

    cls->defineProperty("set", _SE(js_gfx_UniformStorageBuffer_get_set), _SE(js_gfx_UniformStorageBuffer_set_set));
    cls->defineProperty("binding", _SE(js_gfx_UniformStorageBuffer_get_binding), _SE(js_gfx_UniformStorageBuffer_set_binding));
    cls->defineProperty("name", _SE(js_gfx_UniformStorageBuffer_get_name), _SE(js_gfx_UniformStorageBuffer_set_name));
    cls->defineProperty("count", _SE(js_gfx_UniformStorageBuffer_get_count), _SE(js_gfx_UniformStorageBuffer_set_count));
    cls->defineProperty("memoryAccess", _SE(js_gfx_UniformStorageBuffer_get_memoryAccess), _SE(js_gfx_UniformStorageBuffer_set_memoryAccess));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_UniformStorageBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::UniformStorageBuffer>(cls);

    __jsb_cc_gfx_UniformStorageBuffer_proto = cls->getProto();
    __jsb_cc_gfx_UniformStorageBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_UniformInputAttachment_proto = nullptr;
se::Class* __jsb_cc_gfx_UniformInputAttachment_class = nullptr;

static bool js_gfx_UniformInputAttachment_get_set(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformInputAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformInputAttachment_get_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->set, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->set, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformInputAttachment_get_set)

static bool js_gfx_UniformInputAttachment_set_set(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformInputAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformInputAttachment_set_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->set, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformInputAttachment_set_set : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformInputAttachment_set_set)

static bool js_gfx_UniformInputAttachment_get_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformInputAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformInputAttachment_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->binding, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->binding, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformInputAttachment_get_binding)

static bool js_gfx_UniformInputAttachment_set_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformInputAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformInputAttachment_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->binding, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformInputAttachment_set_binding : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformInputAttachment_set_binding)

static bool js_gfx_UniformInputAttachment_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformInputAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformInputAttachment_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformInputAttachment_get_name)

static bool js_gfx_UniformInputAttachment_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformInputAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformInputAttachment_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformInputAttachment_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformInputAttachment_set_name)

static bool js_gfx_UniformInputAttachment_get_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformInputAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformInputAttachment_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->count, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformInputAttachment_get_count)

static bool js_gfx_UniformInputAttachment_set_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformInputAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformInputAttachment_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_UniformInputAttachment_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformInputAttachment_set_count)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::UniformInputAttachment * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::UniformInputAttachment*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("set", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->set), ctx);
    }
    json->getProperty("binding", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->binding), ctx);
    }
    json->getProperty("name", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("count", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_UniformInputAttachment_finalize)

static bool js_gfx_UniformInputAttachment_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::UniformInputAttachment* cobj = JSB_ALLOC(cc::gfx::UniformInputAttachment);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::UniformInputAttachment* cobj = JSB_ALLOC(cc::gfx::UniformInputAttachment);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::UniformInputAttachment* cobj = JSB_ALLOC(cc::gfx::UniformInputAttachment);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->set), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->binding), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->name), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->count), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_UniformInputAttachment_constructor, __jsb_cc_gfx_UniformInputAttachment_class, js_cc_gfx_UniformInputAttachment_finalize)



static bool js_cc_gfx_UniformInputAttachment_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::UniformInputAttachment>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::UniformInputAttachment>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_UniformInputAttachment_finalize)

bool js_register_gfx_UniformInputAttachment(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("UniformInputAttachment", obj, nullptr, _SE(js_gfx_UniformInputAttachment_constructor));

    cls->defineProperty("set", _SE(js_gfx_UniformInputAttachment_get_set), _SE(js_gfx_UniformInputAttachment_set_set));
    cls->defineProperty("binding", _SE(js_gfx_UniformInputAttachment_get_binding), _SE(js_gfx_UniformInputAttachment_set_binding));
    cls->defineProperty("name", _SE(js_gfx_UniformInputAttachment_get_name), _SE(js_gfx_UniformInputAttachment_set_name));
    cls->defineProperty("count", _SE(js_gfx_UniformInputAttachment_get_count), _SE(js_gfx_UniformInputAttachment_set_count));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_UniformInputAttachment_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::UniformInputAttachment>(cls);

    __jsb_cc_gfx_UniformInputAttachment_proto = cls->getProto();
    __jsb_cc_gfx_UniformInputAttachment_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_ShaderStage_proto = nullptr;
se::Class* __jsb_cc_gfx_ShaderStage_class = nullptr;

static bool js_gfx_ShaderStage_get_stage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderStage>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderStage_get_stage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stage, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stage, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderStage_get_stage)

static bool js_gfx_ShaderStage_set_stage(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderStage>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderStage_set_stage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stage, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderStage_set_stage : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderStage_set_stage)

static bool js_gfx_ShaderStage_get_source(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderStage>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderStage_get_source : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->source, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->source, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderStage_get_source)

static bool js_gfx_ShaderStage_set_source(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderStage>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderStage_set_source : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->source, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderStage_set_source : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderStage_set_source)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::ShaderStage * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::ShaderStage*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("stage", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stage), ctx);
    }
    json->getProperty("source", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->source), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_ShaderStage_finalize)

static bool js_gfx_ShaderStage_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::ShaderStage* cobj = JSB_ALLOC(cc::gfx::ShaderStage);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::ShaderStage* cobj = JSB_ALLOC(cc::gfx::ShaderStage);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::ShaderStage* cobj = JSB_ALLOC(cc::gfx::ShaderStage);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->stage), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->source), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_ShaderStage_constructor, __jsb_cc_gfx_ShaderStage_class, js_cc_gfx_ShaderStage_finalize)



static bool js_cc_gfx_ShaderStage_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::ShaderStage>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderStage>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_ShaderStage_finalize)

bool js_register_gfx_ShaderStage(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ShaderStage", obj, nullptr, _SE(js_gfx_ShaderStage_constructor));

    cls->defineProperty("stage", _SE(js_gfx_ShaderStage_get_stage), _SE(js_gfx_ShaderStage_set_stage));
    cls->defineProperty("source", _SE(js_gfx_ShaderStage_get_source), _SE(js_gfx_ShaderStage_set_source));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_ShaderStage_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::ShaderStage>(cls);

    __jsb_cc_gfx_ShaderStage_proto = cls->getProto();
    __jsb_cc_gfx_ShaderStage_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_Attribute_proto = nullptr;
se::Class* __jsb_cc_gfx_Attribute_class = nullptr;

static bool js_gfx_Attribute_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Attribute_get_name)

static bool js_gfx_Attribute_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Attribute_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Attribute_set_name)

static bool js_gfx_Attribute_get_format(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->format, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->format, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Attribute_get_format)

static bool js_gfx_Attribute_set_format(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->format, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Attribute_set_format : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Attribute_set_format)

static bool js_gfx_Attribute_get_isNormalized(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_get_isNormalized : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isNormalized, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isNormalized, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Attribute_get_isNormalized)

static bool js_gfx_Attribute_set_isNormalized(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_set_isNormalized : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isNormalized, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Attribute_set_isNormalized : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Attribute_set_isNormalized)

static bool js_gfx_Attribute_get_stream(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_get_stream : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stream, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stream, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Attribute_get_stream)

static bool js_gfx_Attribute_set_stream(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_set_stream : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stream, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Attribute_set_stream : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Attribute_set_stream)

static bool js_gfx_Attribute_get_isInstanced(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_get_isInstanced : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isInstanced, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isInstanced, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Attribute_get_isInstanced)

static bool js_gfx_Attribute_set_isInstanced(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_set_isInstanced : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isInstanced, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Attribute_set_isInstanced : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Attribute_set_isInstanced)

static bool js_gfx_Attribute_get_location(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_get_location : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->location, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->location, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_Attribute_get_location)

static bool js_gfx_Attribute_set_location(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_set_location : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->location, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_Attribute_set_location : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Attribute_set_location)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::Attribute * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::Attribute*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("name", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("format", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->format), ctx);
    }
    json->getProperty("isNormalized", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isNormalized), ctx);
    }
    json->getProperty("stream", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stream), ctx);
    }
    json->getProperty("isInstanced", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isInstanced), ctx);
    }
    json->getProperty("location", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->location), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Attribute_finalize)

static bool js_gfx_Attribute_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::Attribute* cobj = JSB_ALLOC(cc::gfx::Attribute);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Attribute* cobj = JSB_ALLOC(cc::gfx::Attribute);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::Attribute* cobj = JSB_ALLOC(cc::gfx::Attribute);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->name), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->format), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->isNormalized), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->stream), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->isInstanced), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->location), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_Attribute_constructor, __jsb_cc_gfx_Attribute_class, js_cc_gfx_Attribute_finalize)



static bool js_cc_gfx_Attribute_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Attribute>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Attribute_finalize)

bool js_register_gfx_Attribute(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Attribute", obj, nullptr, _SE(js_gfx_Attribute_constructor));

    cls->defineProperty("name", _SE(js_gfx_Attribute_get_name), _SE(js_gfx_Attribute_set_name));
    cls->defineProperty("format", _SE(js_gfx_Attribute_get_format), _SE(js_gfx_Attribute_set_format));
    cls->defineProperty("isNormalized", _SE(js_gfx_Attribute_get_isNormalized), _SE(js_gfx_Attribute_set_isNormalized));
    cls->defineProperty("stream", _SE(js_gfx_Attribute_get_stream), _SE(js_gfx_Attribute_set_stream));
    cls->defineProperty("isInstanced", _SE(js_gfx_Attribute_get_isInstanced), _SE(js_gfx_Attribute_set_isInstanced));
    cls->defineProperty("location", _SE(js_gfx_Attribute_get_location), _SE(js_gfx_Attribute_set_location));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Attribute_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Attribute>(cls);

    __jsb_cc_gfx_Attribute_proto = cls->getProto();
    __jsb_cc_gfx_Attribute_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_ShaderInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_ShaderInfo_class = nullptr;

static bool js_gfx_ShaderInfo_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderInfo_get_name)

static bool js_gfx_ShaderInfo_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderInfo_set_name)

static bool js_gfx_ShaderInfo_get_stages(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_get_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stages, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stages, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderInfo_get_stages)

static bool js_gfx_ShaderInfo_set_stages(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_set_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stages, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderInfo_set_stages : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderInfo_set_stages)

static bool js_gfx_ShaderInfo_get_attributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_get_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->attributes, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->attributes, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderInfo_get_attributes)

static bool js_gfx_ShaderInfo_set_attributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_set_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->attributes, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderInfo_set_attributes : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderInfo_set_attributes)

static bool js_gfx_ShaderInfo_get_blocks(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_get_blocks : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blocks, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blocks, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderInfo_get_blocks)

static bool js_gfx_ShaderInfo_set_blocks(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_set_blocks : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blocks, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderInfo_set_blocks : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderInfo_set_blocks)

static bool js_gfx_ShaderInfo_get_buffers(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_get_buffers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->buffers, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->buffers, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderInfo_get_buffers)

static bool js_gfx_ShaderInfo_set_buffers(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_set_buffers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->buffers, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderInfo_set_buffers : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderInfo_set_buffers)

static bool js_gfx_ShaderInfo_get_samplerTextures(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_get_samplerTextures : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->samplerTextures, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->samplerTextures, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderInfo_get_samplerTextures)

static bool js_gfx_ShaderInfo_set_samplerTextures(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_set_samplerTextures : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->samplerTextures, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderInfo_set_samplerTextures : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderInfo_set_samplerTextures)

static bool js_gfx_ShaderInfo_get_samplers(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_get_samplers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->samplers, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->samplers, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderInfo_get_samplers)

static bool js_gfx_ShaderInfo_set_samplers(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_set_samplers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->samplers, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderInfo_set_samplers : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderInfo_set_samplers)

static bool js_gfx_ShaderInfo_get_textures(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_get_textures : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->textures, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->textures, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderInfo_get_textures)

static bool js_gfx_ShaderInfo_set_textures(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_set_textures : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->textures, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderInfo_set_textures : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderInfo_set_textures)

static bool js_gfx_ShaderInfo_get_images(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_get_images : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->images, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->images, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderInfo_get_images)

static bool js_gfx_ShaderInfo_set_images(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_set_images : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->images, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderInfo_set_images : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderInfo_set_images)

static bool js_gfx_ShaderInfo_get_subpassInputs(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_get_subpassInputs : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->subpassInputs, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->subpassInputs, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderInfo_get_subpassInputs)

static bool js_gfx_ShaderInfo_set_subpassInputs(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_set_subpassInputs : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->subpassInputs, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderInfo_set_subpassInputs : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderInfo_set_subpassInputs)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::ShaderInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::ShaderInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("name", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("stages", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stages), ctx);
    }
    json->getProperty("attributes", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->attributes), ctx);
    }
    json->getProperty("blocks", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blocks), ctx);
    }
    json->getProperty("buffers", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->buffers), ctx);
    }
    json->getProperty("samplerTextures", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->samplerTextures), ctx);
    }
    json->getProperty("samplers", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->samplers), ctx);
    }
    json->getProperty("textures", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->textures), ctx);
    }
    json->getProperty("images", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->images), ctx);
    }
    json->getProperty("subpassInputs", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->subpassInputs), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_ShaderInfo_finalize)

static bool js_gfx_ShaderInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::ShaderInfo* cobj = JSB_ALLOC(cc::gfx::ShaderInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::ShaderInfo* cobj = JSB_ALLOC(cc::gfx::ShaderInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::ShaderInfo* cobj = JSB_ALLOC(cc::gfx::ShaderInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->name), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->stages), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->attributes), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->blocks), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->buffers), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->samplerTextures), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->samplers), nullptr);
    }
    if (argc > 7 && !args[7].isUndefined()) {
        ok &= sevalue_to_native(args[7], &(cobj->textures), nullptr);
    }
    if (argc > 8 && !args[8].isUndefined()) {
        ok &= sevalue_to_native(args[8], &(cobj->images), nullptr);
    }
    if (argc > 9 && !args[9].isUndefined()) {
        ok &= sevalue_to_native(args[9], &(cobj->subpassInputs), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_ShaderInfo_constructor, __jsb_cc_gfx_ShaderInfo_class, js_cc_gfx_ShaderInfo_finalize)



static bool js_cc_gfx_ShaderInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_ShaderInfo_finalize)

bool js_register_gfx_ShaderInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ShaderInfo", obj, nullptr, _SE(js_gfx_ShaderInfo_constructor));

    cls->defineProperty("name", _SE(js_gfx_ShaderInfo_get_name), _SE(js_gfx_ShaderInfo_set_name));
    cls->defineProperty("stages", _SE(js_gfx_ShaderInfo_get_stages), _SE(js_gfx_ShaderInfo_set_stages));
    cls->defineProperty("attributes", _SE(js_gfx_ShaderInfo_get_attributes), _SE(js_gfx_ShaderInfo_set_attributes));
    cls->defineProperty("blocks", _SE(js_gfx_ShaderInfo_get_blocks), _SE(js_gfx_ShaderInfo_set_blocks));
    cls->defineProperty("buffers", _SE(js_gfx_ShaderInfo_get_buffers), _SE(js_gfx_ShaderInfo_set_buffers));
    cls->defineProperty("samplerTextures", _SE(js_gfx_ShaderInfo_get_samplerTextures), _SE(js_gfx_ShaderInfo_set_samplerTextures));
    cls->defineProperty("samplers", _SE(js_gfx_ShaderInfo_get_samplers), _SE(js_gfx_ShaderInfo_set_samplers));
    cls->defineProperty("textures", _SE(js_gfx_ShaderInfo_get_textures), _SE(js_gfx_ShaderInfo_set_textures));
    cls->defineProperty("images", _SE(js_gfx_ShaderInfo_get_images), _SE(js_gfx_ShaderInfo_set_images));
    cls->defineProperty("subpassInputs", _SE(js_gfx_ShaderInfo_get_subpassInputs), _SE(js_gfx_ShaderInfo_set_subpassInputs));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_ShaderInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::ShaderInfo>(cls);

    __jsb_cc_gfx_ShaderInfo_proto = cls->getProto();
    __jsb_cc_gfx_ShaderInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_InputAssemblerInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_InputAssemblerInfo_class = nullptr;

static bool js_gfx_InputAssemblerInfo_get_attributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssemblerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_get_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->attributes, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->attributes, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_InputAssemblerInfo_get_attributes)

static bool js_gfx_InputAssemblerInfo_set_attributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssemblerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_set_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->attributes, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_InputAssemblerInfo_set_attributes : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_InputAssemblerInfo_set_attributes)

static bool js_gfx_InputAssemblerInfo_get_vertexBuffers(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssemblerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_get_vertexBuffers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->vertexBuffers, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->vertexBuffers, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_InputAssemblerInfo_get_vertexBuffers)

static bool js_gfx_InputAssemblerInfo_set_vertexBuffers(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssemblerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_set_vertexBuffers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->vertexBuffers, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_InputAssemblerInfo_set_vertexBuffers : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_InputAssemblerInfo_set_vertexBuffers)

static bool js_gfx_InputAssemblerInfo_get_indexBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssemblerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_get_indexBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->indexBuffer, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->indexBuffer, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_InputAssemblerInfo_get_indexBuffer)

static bool js_gfx_InputAssemblerInfo_set_indexBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssemblerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_set_indexBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->indexBuffer, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_InputAssemblerInfo_set_indexBuffer : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_InputAssemblerInfo_set_indexBuffer)

static bool js_gfx_InputAssemblerInfo_get_indirectBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssemblerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_get_indirectBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->indirectBuffer, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->indirectBuffer, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_InputAssemblerInfo_get_indirectBuffer)

static bool js_gfx_InputAssemblerInfo_set_indirectBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssemblerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_set_indirectBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->indirectBuffer, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_InputAssemblerInfo_set_indirectBuffer : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_InputAssemblerInfo_set_indirectBuffer)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::InputAssemblerInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::InputAssemblerInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("attributes", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->attributes), ctx);
    }
    json->getProperty("vertexBuffers", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->vertexBuffers), ctx);
    }
    json->getProperty("indexBuffer", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->indexBuffer), ctx);
    }
    json->getProperty("indirectBuffer", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->indirectBuffer), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_InputAssemblerInfo_finalize)

static bool js_gfx_InputAssemblerInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::InputAssemblerInfo* cobj = JSB_ALLOC(cc::gfx::InputAssemblerInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::InputAssemblerInfo* cobj = JSB_ALLOC(cc::gfx::InputAssemblerInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::InputAssemblerInfo* cobj = JSB_ALLOC(cc::gfx::InputAssemblerInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->attributes), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->vertexBuffers), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->indexBuffer), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->indirectBuffer), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_InputAssemblerInfo_constructor, __jsb_cc_gfx_InputAssemblerInfo_class, js_cc_gfx_InputAssemblerInfo_finalize)



static bool js_cc_gfx_InputAssemblerInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::InputAssemblerInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssemblerInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_InputAssemblerInfo_finalize)

bool js_register_gfx_InputAssemblerInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("InputAssemblerInfo", obj, nullptr, _SE(js_gfx_InputAssemblerInfo_constructor));

    cls->defineProperty("attributes", _SE(js_gfx_InputAssemblerInfo_get_attributes), _SE(js_gfx_InputAssemblerInfo_set_attributes));
    cls->defineProperty("vertexBuffers", _SE(js_gfx_InputAssemblerInfo_get_vertexBuffers), _SE(js_gfx_InputAssemblerInfo_set_vertexBuffers));
    cls->defineProperty("indexBuffer", _SE(js_gfx_InputAssemblerInfo_get_indexBuffer), _SE(js_gfx_InputAssemblerInfo_set_indexBuffer));
    cls->defineProperty("indirectBuffer", _SE(js_gfx_InputAssemblerInfo_get_indirectBuffer), _SE(js_gfx_InputAssemblerInfo_set_indirectBuffer));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_InputAssemblerInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::InputAssemblerInfo>(cls);

    __jsb_cc_gfx_InputAssemblerInfo_proto = cls->getProto();
    __jsb_cc_gfx_InputAssemblerInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_ColorAttachment_proto = nullptr;
se::Class* __jsb_cc_gfx_ColorAttachment_class = nullptr;

static bool js_gfx_ColorAttachment_get_format(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->format, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->format, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_ColorAttachment_get_format)

static bool js_gfx_ColorAttachment_set_format(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->format, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_ColorAttachment_set_format : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ColorAttachment_set_format)

static bool js_gfx_ColorAttachment_get_sampleCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_get_sampleCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->sampleCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->sampleCount, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_ColorAttachment_get_sampleCount)

static bool js_gfx_ColorAttachment_set_sampleCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_set_sampleCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->sampleCount, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_ColorAttachment_set_sampleCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ColorAttachment_set_sampleCount)

static bool js_gfx_ColorAttachment_get_loadOp(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_get_loadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->loadOp, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->loadOp, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_ColorAttachment_get_loadOp)

static bool js_gfx_ColorAttachment_set_loadOp(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_set_loadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->loadOp, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_ColorAttachment_set_loadOp : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ColorAttachment_set_loadOp)

static bool js_gfx_ColorAttachment_get_storeOp(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_get_storeOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->storeOp, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->storeOp, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_ColorAttachment_get_storeOp)

static bool js_gfx_ColorAttachment_set_storeOp(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_set_storeOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->storeOp, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_ColorAttachment_set_storeOp : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ColorAttachment_set_storeOp)

static bool js_gfx_ColorAttachment_get_beginAccesses(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_get_beginAccesses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->beginAccesses, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->beginAccesses, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_ColorAttachment_get_beginAccesses)

static bool js_gfx_ColorAttachment_set_beginAccesses(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_set_beginAccesses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->beginAccesses, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_ColorAttachment_set_beginAccesses : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ColorAttachment_set_beginAccesses)

static bool js_gfx_ColorAttachment_get_endAccesses(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_get_endAccesses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->endAccesses, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->endAccesses, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_ColorAttachment_get_endAccesses)

static bool js_gfx_ColorAttachment_set_endAccesses(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_set_endAccesses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->endAccesses, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_ColorAttachment_set_endAccesses : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ColorAttachment_set_endAccesses)

static bool js_gfx_ColorAttachment_get_isGeneralLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_get_isGeneralLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isGeneralLayout, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isGeneralLayout, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_ColorAttachment_get_isGeneralLayout)

static bool js_gfx_ColorAttachment_set_isGeneralLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_set_isGeneralLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isGeneralLayout, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_ColorAttachment_set_isGeneralLayout : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ColorAttachment_set_isGeneralLayout)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::ColorAttachment * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::ColorAttachment*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("format", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->format), ctx);
    }
    json->getProperty("sampleCount", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->sampleCount), ctx);
    }
    json->getProperty("loadOp", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->loadOp), ctx);
    }
    json->getProperty("storeOp", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->storeOp), ctx);
    }
    json->getProperty("beginAccesses", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->beginAccesses), ctx);
    }
    json->getProperty("endAccesses", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->endAccesses), ctx);
    }
    json->getProperty("isGeneralLayout", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isGeneralLayout), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_ColorAttachment_finalize)

static bool js_gfx_ColorAttachment_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::ColorAttachment* cobj = JSB_ALLOC(cc::gfx::ColorAttachment);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::ColorAttachment* cobj = JSB_ALLOC(cc::gfx::ColorAttachment);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::ColorAttachment* cobj = JSB_ALLOC(cc::gfx::ColorAttachment);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->format), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->sampleCount), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->loadOp), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->storeOp), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->beginAccesses), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->endAccesses), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->isGeneralLayout), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_ColorAttachment_constructor, __jsb_cc_gfx_ColorAttachment_class, js_cc_gfx_ColorAttachment_finalize)



static bool js_cc_gfx_ColorAttachment_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_ColorAttachment_finalize)

bool js_register_gfx_ColorAttachment(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ColorAttachment", obj, nullptr, _SE(js_gfx_ColorAttachment_constructor));

    cls->defineProperty("format", _SE(js_gfx_ColorAttachment_get_format), _SE(js_gfx_ColorAttachment_set_format));
    cls->defineProperty("sampleCount", _SE(js_gfx_ColorAttachment_get_sampleCount), _SE(js_gfx_ColorAttachment_set_sampleCount));
    cls->defineProperty("loadOp", _SE(js_gfx_ColorAttachment_get_loadOp), _SE(js_gfx_ColorAttachment_set_loadOp));
    cls->defineProperty("storeOp", _SE(js_gfx_ColorAttachment_get_storeOp), _SE(js_gfx_ColorAttachment_set_storeOp));
    cls->defineProperty("beginAccesses", _SE(js_gfx_ColorAttachment_get_beginAccesses), _SE(js_gfx_ColorAttachment_set_beginAccesses));
    cls->defineProperty("endAccesses", _SE(js_gfx_ColorAttachment_get_endAccesses), _SE(js_gfx_ColorAttachment_set_endAccesses));
    cls->defineProperty("isGeneralLayout", _SE(js_gfx_ColorAttachment_get_isGeneralLayout), _SE(js_gfx_ColorAttachment_set_isGeneralLayout));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_ColorAttachment_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::ColorAttachment>(cls);

    __jsb_cc_gfx_ColorAttachment_proto = cls->getProto();
    __jsb_cc_gfx_ColorAttachment_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_DepthStencilAttachment_proto = nullptr;
se::Class* __jsb_cc_gfx_DepthStencilAttachment_class = nullptr;

static bool js_gfx_DepthStencilAttachment_get_format(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->format, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->format, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_format)

static bool js_gfx_DepthStencilAttachment_set_format(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->format, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_format : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_format)

static bool js_gfx_DepthStencilAttachment_get_sampleCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_sampleCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->sampleCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->sampleCount, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_sampleCount)

static bool js_gfx_DepthStencilAttachment_set_sampleCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_sampleCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->sampleCount, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_sampleCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_sampleCount)

static bool js_gfx_DepthStencilAttachment_get_depthLoadOp(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_depthLoadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthLoadOp, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthLoadOp, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_depthLoadOp)

static bool js_gfx_DepthStencilAttachment_set_depthLoadOp(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_depthLoadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthLoadOp, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_depthLoadOp : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_depthLoadOp)

static bool js_gfx_DepthStencilAttachment_get_depthStoreOp(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_depthStoreOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthStoreOp, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthStoreOp, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_depthStoreOp)

static bool js_gfx_DepthStencilAttachment_set_depthStoreOp(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_depthStoreOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthStoreOp, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_depthStoreOp : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_depthStoreOp)

static bool js_gfx_DepthStencilAttachment_get_stencilLoadOp(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_stencilLoadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilLoadOp, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilLoadOp, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_stencilLoadOp)

static bool js_gfx_DepthStencilAttachment_set_stencilLoadOp(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_stencilLoadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilLoadOp, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_stencilLoadOp : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_stencilLoadOp)

static bool js_gfx_DepthStencilAttachment_get_stencilStoreOp(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_stencilStoreOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilStoreOp, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilStoreOp, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_stencilStoreOp)

static bool js_gfx_DepthStencilAttachment_set_stencilStoreOp(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_stencilStoreOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilStoreOp, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_stencilStoreOp : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_stencilStoreOp)

static bool js_gfx_DepthStencilAttachment_get_beginAccesses(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_beginAccesses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->beginAccesses, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->beginAccesses, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_beginAccesses)

static bool js_gfx_DepthStencilAttachment_set_beginAccesses(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_beginAccesses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->beginAccesses, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_beginAccesses : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_beginAccesses)

static bool js_gfx_DepthStencilAttachment_get_endAccesses(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_endAccesses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->endAccesses, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->endAccesses, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_endAccesses)

static bool js_gfx_DepthStencilAttachment_set_endAccesses(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_endAccesses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->endAccesses, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_endAccesses : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_endAccesses)

static bool js_gfx_DepthStencilAttachment_get_isGeneralLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_isGeneralLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isGeneralLayout, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isGeneralLayout, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_isGeneralLayout)

static bool js_gfx_DepthStencilAttachment_set_isGeneralLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_isGeneralLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isGeneralLayout, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_isGeneralLayout : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_isGeneralLayout)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::DepthStencilAttachment * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::DepthStencilAttachment*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("format", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->format), ctx);
    }
    json->getProperty("sampleCount", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->sampleCount), ctx);
    }
    json->getProperty("depthLoadOp", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthLoadOp), ctx);
    }
    json->getProperty("depthStoreOp", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthStoreOp), ctx);
    }
    json->getProperty("stencilLoadOp", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilLoadOp), ctx);
    }
    json->getProperty("stencilStoreOp", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilStoreOp), ctx);
    }
    json->getProperty("beginAccesses", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->beginAccesses), ctx);
    }
    json->getProperty("endAccesses", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->endAccesses), ctx);
    }
    json->getProperty("isGeneralLayout", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isGeneralLayout), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DepthStencilAttachment_finalize)

static bool js_gfx_DepthStencilAttachment_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::DepthStencilAttachment* cobj = JSB_ALLOC(cc::gfx::DepthStencilAttachment);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::DepthStencilAttachment* cobj = JSB_ALLOC(cc::gfx::DepthStencilAttachment);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::DepthStencilAttachment* cobj = JSB_ALLOC(cc::gfx::DepthStencilAttachment);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->format), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->sampleCount), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->depthLoadOp), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->depthStoreOp), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->stencilLoadOp), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->stencilStoreOp), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->beginAccesses), nullptr);
    }
    if (argc > 7 && !args[7].isUndefined()) {
        ok &= sevalue_to_native(args[7], &(cobj->endAccesses), nullptr);
    }
    if (argc > 8 && !args[8].isUndefined()) {
        ok &= sevalue_to_native(args[8], &(cobj->isGeneralLayout), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_DepthStencilAttachment_constructor, __jsb_cc_gfx_DepthStencilAttachment_class, js_cc_gfx_DepthStencilAttachment_finalize)



static bool js_cc_gfx_DepthStencilAttachment_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DepthStencilAttachment_finalize)

bool js_register_gfx_DepthStencilAttachment(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DepthStencilAttachment", obj, nullptr, _SE(js_gfx_DepthStencilAttachment_constructor));

    cls->defineProperty("format", _SE(js_gfx_DepthStencilAttachment_get_format), _SE(js_gfx_DepthStencilAttachment_set_format));
    cls->defineProperty("sampleCount", _SE(js_gfx_DepthStencilAttachment_get_sampleCount), _SE(js_gfx_DepthStencilAttachment_set_sampleCount));
    cls->defineProperty("depthLoadOp", _SE(js_gfx_DepthStencilAttachment_get_depthLoadOp), _SE(js_gfx_DepthStencilAttachment_set_depthLoadOp));
    cls->defineProperty("depthStoreOp", _SE(js_gfx_DepthStencilAttachment_get_depthStoreOp), _SE(js_gfx_DepthStencilAttachment_set_depthStoreOp));
    cls->defineProperty("stencilLoadOp", _SE(js_gfx_DepthStencilAttachment_get_stencilLoadOp), _SE(js_gfx_DepthStencilAttachment_set_stencilLoadOp));
    cls->defineProperty("stencilStoreOp", _SE(js_gfx_DepthStencilAttachment_get_stencilStoreOp), _SE(js_gfx_DepthStencilAttachment_set_stencilStoreOp));
    cls->defineProperty("beginAccesses", _SE(js_gfx_DepthStencilAttachment_get_beginAccesses), _SE(js_gfx_DepthStencilAttachment_set_beginAccesses));
    cls->defineProperty("endAccesses", _SE(js_gfx_DepthStencilAttachment_get_endAccesses), _SE(js_gfx_DepthStencilAttachment_set_endAccesses));
    cls->defineProperty("isGeneralLayout", _SE(js_gfx_DepthStencilAttachment_get_isGeneralLayout), _SE(js_gfx_DepthStencilAttachment_set_isGeneralLayout));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DepthStencilAttachment_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DepthStencilAttachment>(cls);

    __jsb_cc_gfx_DepthStencilAttachment_proto = cls->getProto();
    __jsb_cc_gfx_DepthStencilAttachment_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_SubpassInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_SubpassInfo_class = nullptr;

static bool js_gfx_SubpassInfo_get_inputs(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassInfo_get_inputs : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->inputs, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->inputs, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubpassInfo_get_inputs)

static bool js_gfx_SubpassInfo_set_inputs(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassInfo_set_inputs : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->inputs, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SubpassInfo_set_inputs : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubpassInfo_set_inputs)

static bool js_gfx_SubpassInfo_get_colors(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassInfo_get_colors : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->colors, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->colors, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubpassInfo_get_colors)

static bool js_gfx_SubpassInfo_set_colors(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassInfo_set_colors : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->colors, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SubpassInfo_set_colors : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubpassInfo_set_colors)

static bool js_gfx_SubpassInfo_get_resolves(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassInfo_get_resolves : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->resolves, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->resolves, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubpassInfo_get_resolves)

static bool js_gfx_SubpassInfo_set_resolves(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassInfo_set_resolves : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->resolves, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SubpassInfo_set_resolves : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubpassInfo_set_resolves)

static bool js_gfx_SubpassInfo_get_preserves(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassInfo_get_preserves : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->preserves, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->preserves, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubpassInfo_get_preserves)

static bool js_gfx_SubpassInfo_set_preserves(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassInfo_set_preserves : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->preserves, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SubpassInfo_set_preserves : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubpassInfo_set_preserves)

static bool js_gfx_SubpassInfo_get_depthStencil(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassInfo_get_depthStencil : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthStencil, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthStencil, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubpassInfo_get_depthStencil)

static bool js_gfx_SubpassInfo_set_depthStencil(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassInfo_set_depthStencil : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthStencil, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SubpassInfo_set_depthStencil : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubpassInfo_set_depthStencil)

static bool js_gfx_SubpassInfo_get_depthStencilResolve(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassInfo_get_depthStencilResolve : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthStencilResolve, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthStencilResolve, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubpassInfo_get_depthStencilResolve)

static bool js_gfx_SubpassInfo_set_depthStencilResolve(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassInfo_set_depthStencilResolve : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthStencilResolve, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SubpassInfo_set_depthStencilResolve : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubpassInfo_set_depthStencilResolve)

static bool js_gfx_SubpassInfo_get_depthResolveMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassInfo_get_depthResolveMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthResolveMode, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthResolveMode, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubpassInfo_get_depthResolveMode)

static bool js_gfx_SubpassInfo_set_depthResolveMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassInfo_set_depthResolveMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthResolveMode, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SubpassInfo_set_depthResolveMode : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubpassInfo_set_depthResolveMode)

static bool js_gfx_SubpassInfo_get_stencilResolveMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassInfo_get_stencilResolveMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilResolveMode, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilResolveMode, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubpassInfo_get_stencilResolveMode)

static bool js_gfx_SubpassInfo_set_stencilResolveMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassInfo_set_stencilResolveMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilResolveMode, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SubpassInfo_set_stencilResolveMode : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubpassInfo_set_stencilResolveMode)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::SubpassInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::SubpassInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("inputs", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->inputs), ctx);
    }
    json->getProperty("colors", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->colors), ctx);
    }
    json->getProperty("resolves", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->resolves), ctx);
    }
    json->getProperty("preserves", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->preserves), ctx);
    }
    json->getProperty("depthStencil", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthStencil), ctx);
    }
    json->getProperty("depthStencilResolve", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthStencilResolve), ctx);
    }
    json->getProperty("depthResolveMode", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthResolveMode), ctx);
    }
    json->getProperty("stencilResolveMode", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilResolveMode), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_SubpassInfo_finalize)

static bool js_gfx_SubpassInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::SubpassInfo* cobj = JSB_ALLOC(cc::gfx::SubpassInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::SubpassInfo* cobj = JSB_ALLOC(cc::gfx::SubpassInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::SubpassInfo* cobj = JSB_ALLOC(cc::gfx::SubpassInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->inputs), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->colors), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->resolves), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->preserves), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->depthStencil), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->depthStencilResolve), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->depthResolveMode), nullptr);
    }
    if (argc > 7 && !args[7].isUndefined()) {
        ok &= sevalue_to_native(args[7], &(cobj->stencilResolveMode), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_SubpassInfo_constructor, __jsb_cc_gfx_SubpassInfo_class, js_cc_gfx_SubpassInfo_finalize)



static bool js_cc_gfx_SubpassInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::SubpassInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_SubpassInfo_finalize)

bool js_register_gfx_SubpassInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SubpassInfo", obj, nullptr, _SE(js_gfx_SubpassInfo_constructor));

    cls->defineProperty("inputs", _SE(js_gfx_SubpassInfo_get_inputs), _SE(js_gfx_SubpassInfo_set_inputs));
    cls->defineProperty("colors", _SE(js_gfx_SubpassInfo_get_colors), _SE(js_gfx_SubpassInfo_set_colors));
    cls->defineProperty("resolves", _SE(js_gfx_SubpassInfo_get_resolves), _SE(js_gfx_SubpassInfo_set_resolves));
    cls->defineProperty("preserves", _SE(js_gfx_SubpassInfo_get_preserves), _SE(js_gfx_SubpassInfo_set_preserves));
    cls->defineProperty("depthStencil", _SE(js_gfx_SubpassInfo_get_depthStencil), _SE(js_gfx_SubpassInfo_set_depthStencil));
    cls->defineProperty("depthStencilResolve", _SE(js_gfx_SubpassInfo_get_depthStencilResolve), _SE(js_gfx_SubpassInfo_set_depthStencilResolve));
    cls->defineProperty("depthResolveMode", _SE(js_gfx_SubpassInfo_get_depthResolveMode), _SE(js_gfx_SubpassInfo_set_depthResolveMode));
    cls->defineProperty("stencilResolveMode", _SE(js_gfx_SubpassInfo_get_stencilResolveMode), _SE(js_gfx_SubpassInfo_set_stencilResolveMode));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_SubpassInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::SubpassInfo>(cls);

    __jsb_cc_gfx_SubpassInfo_proto = cls->getProto();
    __jsb_cc_gfx_SubpassInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_SubpassDependency_proto = nullptr;
se::Class* __jsb_cc_gfx_SubpassDependency_class = nullptr;

static bool js_gfx_SubpassDependency_get_srcSubpass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassDependency>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassDependency_get_srcSubpass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->srcSubpass, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->srcSubpass, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubpassDependency_get_srcSubpass)

static bool js_gfx_SubpassDependency_set_srcSubpass(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassDependency>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassDependency_set_srcSubpass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->srcSubpass, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SubpassDependency_set_srcSubpass : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubpassDependency_set_srcSubpass)

static bool js_gfx_SubpassDependency_get_dstSubpass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassDependency>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassDependency_get_dstSubpass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->dstSubpass, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->dstSubpass, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubpassDependency_get_dstSubpass)

static bool js_gfx_SubpassDependency_set_dstSubpass(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassDependency>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassDependency_set_dstSubpass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->dstSubpass, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SubpassDependency_set_dstSubpass : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubpassDependency_set_dstSubpass)

static bool js_gfx_SubpassDependency_get_srcAccesses(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassDependency>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassDependency_get_srcAccesses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->srcAccesses, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->srcAccesses, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubpassDependency_get_srcAccesses)

static bool js_gfx_SubpassDependency_set_srcAccesses(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassDependency>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassDependency_set_srcAccesses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->srcAccesses, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SubpassDependency_set_srcAccesses : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubpassDependency_set_srcAccesses)

static bool js_gfx_SubpassDependency_get_dstAccesses(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassDependency>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassDependency_get_dstAccesses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->dstAccesses, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->dstAccesses, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubpassDependency_get_dstAccesses)

static bool js_gfx_SubpassDependency_set_dstAccesses(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassDependency>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubpassDependency_set_dstAccesses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->dstAccesses, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_SubpassDependency_set_dstAccesses : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubpassDependency_set_dstAccesses)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::SubpassDependency * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::SubpassDependency*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("srcSubpass", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->srcSubpass), ctx);
    }
    json->getProperty("dstSubpass", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->dstSubpass), ctx);
    }
    json->getProperty("srcAccesses", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->srcAccesses), ctx);
    }
    json->getProperty("dstAccesses", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->dstAccesses), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_SubpassDependency_finalize)

static bool js_gfx_SubpassDependency_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::SubpassDependency* cobj = JSB_ALLOC(cc::gfx::SubpassDependency);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::SubpassDependency* cobj = JSB_ALLOC(cc::gfx::SubpassDependency);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::SubpassDependency* cobj = JSB_ALLOC(cc::gfx::SubpassDependency);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->srcSubpass), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->dstSubpass), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->srcAccesses), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->dstAccesses), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_SubpassDependency_constructor, __jsb_cc_gfx_SubpassDependency_class, js_cc_gfx_SubpassDependency_finalize)



static bool js_cc_gfx_SubpassDependency_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::SubpassDependency>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::SubpassDependency>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_SubpassDependency_finalize)

bool js_register_gfx_SubpassDependency(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SubpassDependency", obj, nullptr, _SE(js_gfx_SubpassDependency_constructor));

    cls->defineProperty("srcSubpass", _SE(js_gfx_SubpassDependency_get_srcSubpass), _SE(js_gfx_SubpassDependency_set_srcSubpass));
    cls->defineProperty("dstSubpass", _SE(js_gfx_SubpassDependency_get_dstSubpass), _SE(js_gfx_SubpassDependency_set_dstSubpass));
    cls->defineProperty("srcAccesses", _SE(js_gfx_SubpassDependency_get_srcAccesses), _SE(js_gfx_SubpassDependency_set_srcAccesses));
    cls->defineProperty("dstAccesses", _SE(js_gfx_SubpassDependency_get_dstAccesses), _SE(js_gfx_SubpassDependency_set_dstAccesses));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_SubpassDependency_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::SubpassDependency>(cls);

    __jsb_cc_gfx_SubpassDependency_proto = cls->getProto();
    __jsb_cc_gfx_SubpassDependency_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_RenderPassInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_RenderPassInfo_class = nullptr;

static bool js_gfx_RenderPassInfo_get_colorAttachments(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RenderPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPassInfo_get_colorAttachments : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->colorAttachments, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->colorAttachments, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_RenderPassInfo_get_colorAttachments)

static bool js_gfx_RenderPassInfo_set_colorAttachments(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RenderPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPassInfo_set_colorAttachments : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->colorAttachments, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_RenderPassInfo_set_colorAttachments : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RenderPassInfo_set_colorAttachments)

static bool js_gfx_RenderPassInfo_get_depthStencilAttachment(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RenderPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPassInfo_get_depthStencilAttachment : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthStencilAttachment, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthStencilAttachment, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_RenderPassInfo_get_depthStencilAttachment)

static bool js_gfx_RenderPassInfo_set_depthStencilAttachment(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RenderPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPassInfo_set_depthStencilAttachment : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthStencilAttachment, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_RenderPassInfo_set_depthStencilAttachment : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RenderPassInfo_set_depthStencilAttachment)

static bool js_gfx_RenderPassInfo_get_subpasses(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RenderPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPassInfo_get_subpasses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->subpasses, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->subpasses, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_RenderPassInfo_get_subpasses)

static bool js_gfx_RenderPassInfo_set_subpasses(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RenderPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPassInfo_set_subpasses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->subpasses, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_RenderPassInfo_set_subpasses : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RenderPassInfo_set_subpasses)

static bool js_gfx_RenderPassInfo_get_dependencies(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RenderPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPassInfo_get_dependencies : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->dependencies, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->dependencies, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_RenderPassInfo_get_dependencies)

static bool js_gfx_RenderPassInfo_set_dependencies(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RenderPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPassInfo_set_dependencies : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->dependencies, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_RenderPassInfo_set_dependencies : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RenderPassInfo_set_dependencies)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::RenderPassInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::RenderPassInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("colorAttachments", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->colorAttachments), ctx);
    }
    json->getProperty("depthStencilAttachment", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthStencilAttachment), ctx);
    }
    json->getProperty("subpasses", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->subpasses), ctx);
    }
    json->getProperty("dependencies", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->dependencies), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_RenderPassInfo_finalize)

static bool js_gfx_RenderPassInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::RenderPassInfo* cobj = JSB_ALLOC(cc::gfx::RenderPassInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::RenderPassInfo* cobj = JSB_ALLOC(cc::gfx::RenderPassInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::RenderPassInfo* cobj = JSB_ALLOC(cc::gfx::RenderPassInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->colorAttachments), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->depthStencilAttachment), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->subpasses), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->dependencies), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_RenderPassInfo_constructor, __jsb_cc_gfx_RenderPassInfo_class, js_cc_gfx_RenderPassInfo_finalize)



static bool js_cc_gfx_RenderPassInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::RenderPassInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::RenderPassInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_RenderPassInfo_finalize)

bool js_register_gfx_RenderPassInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RenderPassInfo", obj, nullptr, _SE(js_gfx_RenderPassInfo_constructor));

    cls->defineProperty("colorAttachments", _SE(js_gfx_RenderPassInfo_get_colorAttachments), _SE(js_gfx_RenderPassInfo_set_colorAttachments));
    cls->defineProperty("depthStencilAttachment", _SE(js_gfx_RenderPassInfo_get_depthStencilAttachment), _SE(js_gfx_RenderPassInfo_set_depthStencilAttachment));
    cls->defineProperty("subpasses", _SE(js_gfx_RenderPassInfo_get_subpasses), _SE(js_gfx_RenderPassInfo_set_subpasses));
    cls->defineProperty("dependencies", _SE(js_gfx_RenderPassInfo_get_dependencies), _SE(js_gfx_RenderPassInfo_set_dependencies));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_RenderPassInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::RenderPassInfo>(cls);

    __jsb_cc_gfx_RenderPassInfo_proto = cls->getProto();
    __jsb_cc_gfx_RenderPassInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_GlobalBarrierInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_GlobalBarrierInfo_class = nullptr;

static bool js_gfx_GlobalBarrierInfo_get_prevAccesses(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::GlobalBarrierInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_GlobalBarrierInfo_get_prevAccesses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->prevAccesses, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->prevAccesses, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_GlobalBarrierInfo_get_prevAccesses)

static bool js_gfx_GlobalBarrierInfo_set_prevAccesses(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::GlobalBarrierInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_GlobalBarrierInfo_set_prevAccesses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->prevAccesses, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_GlobalBarrierInfo_set_prevAccesses : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_GlobalBarrierInfo_set_prevAccesses)

static bool js_gfx_GlobalBarrierInfo_get_nextAccesses(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::GlobalBarrierInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_GlobalBarrierInfo_get_nextAccesses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->nextAccesses, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->nextAccesses, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_GlobalBarrierInfo_get_nextAccesses)

static bool js_gfx_GlobalBarrierInfo_set_nextAccesses(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::GlobalBarrierInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_GlobalBarrierInfo_set_nextAccesses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->nextAccesses, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_GlobalBarrierInfo_set_nextAccesses : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_GlobalBarrierInfo_set_nextAccesses)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::GlobalBarrierInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::GlobalBarrierInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("prevAccesses", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->prevAccesses), ctx);
    }
    json->getProperty("nextAccesses", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->nextAccesses), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GlobalBarrierInfo_finalize)

static bool js_gfx_GlobalBarrierInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::GlobalBarrierInfo* cobj = JSB_ALLOC(cc::gfx::GlobalBarrierInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::GlobalBarrierInfo* cobj = JSB_ALLOC(cc::gfx::GlobalBarrierInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::GlobalBarrierInfo* cobj = JSB_ALLOC(cc::gfx::GlobalBarrierInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->prevAccesses), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->nextAccesses), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GlobalBarrierInfo_constructor, __jsb_cc_gfx_GlobalBarrierInfo_class, js_cc_gfx_GlobalBarrierInfo_finalize)



static bool js_cc_gfx_GlobalBarrierInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::GlobalBarrierInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::GlobalBarrierInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GlobalBarrierInfo_finalize)

bool js_register_gfx_GlobalBarrierInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("GlobalBarrierInfo", obj, nullptr, _SE(js_gfx_GlobalBarrierInfo_constructor));

    cls->defineProperty("prevAccesses", _SE(js_gfx_GlobalBarrierInfo_get_prevAccesses), _SE(js_gfx_GlobalBarrierInfo_set_prevAccesses));
    cls->defineProperty("nextAccesses", _SE(js_gfx_GlobalBarrierInfo_get_nextAccesses), _SE(js_gfx_GlobalBarrierInfo_set_nextAccesses));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GlobalBarrierInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GlobalBarrierInfo>(cls);

    __jsb_cc_gfx_GlobalBarrierInfo_proto = cls->getProto();
    __jsb_cc_gfx_GlobalBarrierInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_TextureBarrierInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_TextureBarrierInfo_class = nullptr;

static bool js_gfx_TextureBarrierInfo_get_prevAccesses(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBarrierInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBarrierInfo_get_prevAccesses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->prevAccesses, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->prevAccesses, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureBarrierInfo_get_prevAccesses)

static bool js_gfx_TextureBarrierInfo_set_prevAccesses(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBarrierInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBarrierInfo_set_prevAccesses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->prevAccesses, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureBarrierInfo_set_prevAccesses : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureBarrierInfo_set_prevAccesses)

static bool js_gfx_TextureBarrierInfo_get_nextAccesses(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBarrierInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBarrierInfo_get_nextAccesses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->nextAccesses, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->nextAccesses, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureBarrierInfo_get_nextAccesses)

static bool js_gfx_TextureBarrierInfo_set_nextAccesses(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBarrierInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBarrierInfo_set_nextAccesses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->nextAccesses, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureBarrierInfo_set_nextAccesses : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureBarrierInfo_set_nextAccesses)

static bool js_gfx_TextureBarrierInfo_get_discardContents(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBarrierInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBarrierInfo_get_discardContents : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->discardContents, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->discardContents, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureBarrierInfo_get_discardContents)

static bool js_gfx_TextureBarrierInfo_set_discardContents(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBarrierInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBarrierInfo_set_discardContents : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->discardContents, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureBarrierInfo_set_discardContents : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureBarrierInfo_set_discardContents)

static bool js_gfx_TextureBarrierInfo_get_srcQueue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBarrierInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBarrierInfo_get_srcQueue : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->srcQueue, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->srcQueue, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureBarrierInfo_get_srcQueue)

static bool js_gfx_TextureBarrierInfo_set_srcQueue(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBarrierInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBarrierInfo_set_srcQueue : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->srcQueue, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureBarrierInfo_set_srcQueue : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureBarrierInfo_set_srcQueue)

static bool js_gfx_TextureBarrierInfo_get_dstQueue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBarrierInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBarrierInfo_get_dstQueue : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->dstQueue, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->dstQueue, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureBarrierInfo_get_dstQueue)

static bool js_gfx_TextureBarrierInfo_set_dstQueue(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBarrierInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBarrierInfo_set_dstQueue : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->dstQueue, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_TextureBarrierInfo_set_dstQueue : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureBarrierInfo_set_dstQueue)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::TextureBarrierInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::TextureBarrierInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("prevAccesses", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->prevAccesses), ctx);
    }
    json->getProperty("nextAccesses", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->nextAccesses), ctx);
    }
    json->getProperty("discardContents", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->discardContents), ctx);
    }
    json->getProperty("srcQueue", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->srcQueue), ctx);
    }
    json->getProperty("dstQueue", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->dstQueue), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_TextureBarrierInfo_finalize)

static bool js_gfx_TextureBarrierInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::TextureBarrierInfo* cobj = JSB_ALLOC(cc::gfx::TextureBarrierInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::TextureBarrierInfo* cobj = JSB_ALLOC(cc::gfx::TextureBarrierInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::TextureBarrierInfo* cobj = JSB_ALLOC(cc::gfx::TextureBarrierInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->prevAccesses), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->nextAccesses), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->discardContents), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->srcQueue), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->dstQueue), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_TextureBarrierInfo_constructor, __jsb_cc_gfx_TextureBarrierInfo_class, js_cc_gfx_TextureBarrierInfo_finalize)



static bool js_cc_gfx_TextureBarrierInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::TextureBarrierInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBarrierInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_TextureBarrierInfo_finalize)

bool js_register_gfx_TextureBarrierInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TextureBarrierInfo", obj, nullptr, _SE(js_gfx_TextureBarrierInfo_constructor));

    cls->defineProperty("prevAccesses", _SE(js_gfx_TextureBarrierInfo_get_prevAccesses), _SE(js_gfx_TextureBarrierInfo_set_prevAccesses));
    cls->defineProperty("nextAccesses", _SE(js_gfx_TextureBarrierInfo_get_nextAccesses), _SE(js_gfx_TextureBarrierInfo_set_nextAccesses));
    cls->defineProperty("discardContents", _SE(js_gfx_TextureBarrierInfo_get_discardContents), _SE(js_gfx_TextureBarrierInfo_set_discardContents));
    cls->defineProperty("srcQueue", _SE(js_gfx_TextureBarrierInfo_get_srcQueue), _SE(js_gfx_TextureBarrierInfo_set_srcQueue));
    cls->defineProperty("dstQueue", _SE(js_gfx_TextureBarrierInfo_get_dstQueue), _SE(js_gfx_TextureBarrierInfo_set_dstQueue));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_TextureBarrierInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::TextureBarrierInfo>(cls);

    __jsb_cc_gfx_TextureBarrierInfo_proto = cls->getProto();
    __jsb_cc_gfx_TextureBarrierInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_FramebufferInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_FramebufferInfo_class = nullptr;

static bool js_gfx_FramebufferInfo_get_renderPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::FramebufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_get_renderPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->renderPass, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->renderPass, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_FramebufferInfo_get_renderPass)

static bool js_gfx_FramebufferInfo_set_renderPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::FramebufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_set_renderPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->renderPass, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_FramebufferInfo_set_renderPass : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_FramebufferInfo_set_renderPass)

static bool js_gfx_FramebufferInfo_get_colorTextures(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::FramebufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_get_colorTextures : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->colorTextures, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->colorTextures, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_FramebufferInfo_get_colorTextures)

static bool js_gfx_FramebufferInfo_set_colorTextures(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::FramebufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_set_colorTextures : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->colorTextures, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_FramebufferInfo_set_colorTextures : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_FramebufferInfo_set_colorTextures)

static bool js_gfx_FramebufferInfo_get_depthStencilTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::FramebufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_get_depthStencilTexture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthStencilTexture, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthStencilTexture, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_FramebufferInfo_get_depthStencilTexture)

static bool js_gfx_FramebufferInfo_set_depthStencilTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::FramebufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_set_depthStencilTexture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthStencilTexture, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_FramebufferInfo_set_depthStencilTexture : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_FramebufferInfo_set_depthStencilTexture)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::FramebufferInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::FramebufferInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("renderPass", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->renderPass), ctx);
    }
    json->getProperty("colorTextures", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->colorTextures), ctx);
    }
    json->getProperty("depthStencilTexture", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthStencilTexture), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_FramebufferInfo_finalize)

static bool js_gfx_FramebufferInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::FramebufferInfo* cobj = JSB_ALLOC(cc::gfx::FramebufferInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::FramebufferInfo* cobj = JSB_ALLOC(cc::gfx::FramebufferInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::FramebufferInfo* cobj = JSB_ALLOC(cc::gfx::FramebufferInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->renderPass), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->colorTextures), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->depthStencilTexture), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_FramebufferInfo_constructor, __jsb_cc_gfx_FramebufferInfo_class, js_cc_gfx_FramebufferInfo_finalize)



static bool js_cc_gfx_FramebufferInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::FramebufferInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::FramebufferInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_FramebufferInfo_finalize)

bool js_register_gfx_FramebufferInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("FramebufferInfo", obj, nullptr, _SE(js_gfx_FramebufferInfo_constructor));

    cls->defineProperty("renderPass", _SE(js_gfx_FramebufferInfo_get_renderPass), _SE(js_gfx_FramebufferInfo_set_renderPass));
    cls->defineProperty("colorTextures", _SE(js_gfx_FramebufferInfo_get_colorTextures), _SE(js_gfx_FramebufferInfo_set_colorTextures));
    cls->defineProperty("depthStencilTexture", _SE(js_gfx_FramebufferInfo_get_depthStencilTexture), _SE(js_gfx_FramebufferInfo_set_depthStencilTexture));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_FramebufferInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::FramebufferInfo>(cls);

    __jsb_cc_gfx_FramebufferInfo_proto = cls->getProto();
    __jsb_cc_gfx_FramebufferInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_DescriptorSetLayoutBinding_proto = nullptr;
se::Class* __jsb_cc_gfx_DescriptorSetLayoutBinding_class = nullptr;

static bool js_gfx_DescriptorSetLayoutBinding_get_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutBinding_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->binding, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->binding, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DescriptorSetLayoutBinding_get_binding)

static bool js_gfx_DescriptorSetLayoutBinding_set_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutBinding_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->binding, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayoutBinding_set_binding : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DescriptorSetLayoutBinding_set_binding)

static bool js_gfx_DescriptorSetLayoutBinding_get_descriptorType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutBinding_get_descriptorType : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->descriptorType, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->descriptorType, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DescriptorSetLayoutBinding_get_descriptorType)

static bool js_gfx_DescriptorSetLayoutBinding_set_descriptorType(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutBinding_set_descriptorType : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->descriptorType, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayoutBinding_set_descriptorType : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DescriptorSetLayoutBinding_set_descriptorType)

static bool js_gfx_DescriptorSetLayoutBinding_get_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutBinding_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->count, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DescriptorSetLayoutBinding_get_count)

static bool js_gfx_DescriptorSetLayoutBinding_set_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutBinding_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayoutBinding_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DescriptorSetLayoutBinding_set_count)

static bool js_gfx_DescriptorSetLayoutBinding_get_stageFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutBinding_get_stageFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stageFlags, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stageFlags, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DescriptorSetLayoutBinding_get_stageFlags)

static bool js_gfx_DescriptorSetLayoutBinding_set_stageFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutBinding_set_stageFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stageFlags, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayoutBinding_set_stageFlags : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DescriptorSetLayoutBinding_set_stageFlags)

static bool js_gfx_DescriptorSetLayoutBinding_get_immutableSamplers(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutBinding_get_immutableSamplers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->immutableSamplers, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->immutableSamplers, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DescriptorSetLayoutBinding_get_immutableSamplers)

static bool js_gfx_DescriptorSetLayoutBinding_set_immutableSamplers(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutBinding_set_immutableSamplers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->immutableSamplers, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayoutBinding_set_immutableSamplers : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DescriptorSetLayoutBinding_set_immutableSamplers)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::DescriptorSetLayoutBinding * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::DescriptorSetLayoutBinding*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("binding", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->binding), ctx);
    }
    json->getProperty("descriptorType", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->descriptorType), ctx);
    }
    json->getProperty("count", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    json->getProperty("stageFlags", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stageFlags), ctx);
    }
    json->getProperty("immutableSamplers", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->immutableSamplers), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DescriptorSetLayoutBinding_finalize)

static bool js_gfx_DescriptorSetLayoutBinding_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::DescriptorSetLayoutBinding* cobj = JSB_ALLOC(cc::gfx::DescriptorSetLayoutBinding);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::DescriptorSetLayoutBinding* cobj = JSB_ALLOC(cc::gfx::DescriptorSetLayoutBinding);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::DescriptorSetLayoutBinding* cobj = JSB_ALLOC(cc::gfx::DescriptorSetLayoutBinding);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->binding), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->descriptorType), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->count), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->stageFlags), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->immutableSamplers), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_DescriptorSetLayoutBinding_constructor, __jsb_cc_gfx_DescriptorSetLayoutBinding_class, js_cc_gfx_DescriptorSetLayoutBinding_finalize)



static bool js_cc_gfx_DescriptorSetLayoutBinding_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DescriptorSetLayoutBinding_finalize)

bool js_register_gfx_DescriptorSetLayoutBinding(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DescriptorSetLayoutBinding", obj, nullptr, _SE(js_gfx_DescriptorSetLayoutBinding_constructor));

    cls->defineProperty("binding", _SE(js_gfx_DescriptorSetLayoutBinding_get_binding), _SE(js_gfx_DescriptorSetLayoutBinding_set_binding));
    cls->defineProperty("descriptorType", _SE(js_gfx_DescriptorSetLayoutBinding_get_descriptorType), _SE(js_gfx_DescriptorSetLayoutBinding_set_descriptorType));
    cls->defineProperty("count", _SE(js_gfx_DescriptorSetLayoutBinding_get_count), _SE(js_gfx_DescriptorSetLayoutBinding_set_count));
    cls->defineProperty("stageFlags", _SE(js_gfx_DescriptorSetLayoutBinding_get_stageFlags), _SE(js_gfx_DescriptorSetLayoutBinding_set_stageFlags));
    cls->defineProperty("immutableSamplers", _SE(js_gfx_DescriptorSetLayoutBinding_get_immutableSamplers), _SE(js_gfx_DescriptorSetLayoutBinding_set_immutableSamplers));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DescriptorSetLayoutBinding_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DescriptorSetLayoutBinding>(cls);

    __jsb_cc_gfx_DescriptorSetLayoutBinding_proto = cls->getProto();
    __jsb_cc_gfx_DescriptorSetLayoutBinding_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_DescriptorSetLayoutInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_DescriptorSetLayoutInfo_class = nullptr;

static bool js_gfx_DescriptorSetLayoutInfo_get_bindings(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutInfo_get_bindings : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bindings, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->bindings, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DescriptorSetLayoutInfo_get_bindings)

static bool js_gfx_DescriptorSetLayoutInfo_set_bindings(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutInfo_set_bindings : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bindings, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayoutInfo_set_bindings : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DescriptorSetLayoutInfo_set_bindings)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::DescriptorSetLayoutInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::DescriptorSetLayoutInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("bindings", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bindings), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DescriptorSetLayoutInfo_finalize)

static bool js_gfx_DescriptorSetLayoutInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::DescriptorSetLayoutInfo* cobj = JSB_ALLOC(cc::gfx::DescriptorSetLayoutInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::DescriptorSetLayoutInfo* cobj = JSB_ALLOC(cc::gfx::DescriptorSetLayoutInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->bindings), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_DescriptorSetLayoutInfo_constructor, __jsb_cc_gfx_DescriptorSetLayoutInfo_class, js_cc_gfx_DescriptorSetLayoutInfo_finalize)



static bool js_cc_gfx_DescriptorSetLayoutInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DescriptorSetLayoutInfo_finalize)

bool js_register_gfx_DescriptorSetLayoutInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DescriptorSetLayoutInfo", obj, nullptr, _SE(js_gfx_DescriptorSetLayoutInfo_constructor));

    cls->defineProperty("bindings", _SE(js_gfx_DescriptorSetLayoutInfo_get_bindings), _SE(js_gfx_DescriptorSetLayoutInfo_set_bindings));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DescriptorSetLayoutInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DescriptorSetLayoutInfo>(cls);

    __jsb_cc_gfx_DescriptorSetLayoutInfo_proto = cls->getProto();
    __jsb_cc_gfx_DescriptorSetLayoutInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_DescriptorSetInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_DescriptorSetInfo_class = nullptr;

static bool js_gfx_DescriptorSetInfo_get_layout(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetInfo_get_layout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->layout, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->layout, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DescriptorSetInfo_get_layout)

static bool js_gfx_DescriptorSetInfo_set_layout(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetInfo_set_layout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->layout, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetInfo_set_layout : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DescriptorSetInfo_set_layout)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::DescriptorSetInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::DescriptorSetInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("layout", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->layout), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DescriptorSetInfo_finalize)

static bool js_gfx_DescriptorSetInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::DescriptorSetInfo* cobj = JSB_ALLOC(cc::gfx::DescriptorSetInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::DescriptorSetInfo* cobj = JSB_ALLOC(cc::gfx::DescriptorSetInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->layout), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_DescriptorSetInfo_constructor, __jsb_cc_gfx_DescriptorSetInfo_class, js_cc_gfx_DescriptorSetInfo_finalize)



static bool js_cc_gfx_DescriptorSetInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::DescriptorSetInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DescriptorSetInfo_finalize)

bool js_register_gfx_DescriptorSetInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DescriptorSetInfo", obj, nullptr, _SE(js_gfx_DescriptorSetInfo_constructor));

    cls->defineProperty("layout", _SE(js_gfx_DescriptorSetInfo_get_layout), _SE(js_gfx_DescriptorSetInfo_set_layout));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DescriptorSetInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DescriptorSetInfo>(cls);

    __jsb_cc_gfx_DescriptorSetInfo_proto = cls->getProto();
    __jsb_cc_gfx_DescriptorSetInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_PipelineLayoutInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_PipelineLayoutInfo_class = nullptr;

static bool js_gfx_PipelineLayoutInfo_get_setLayouts(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineLayoutInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineLayoutInfo_get_setLayouts : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->setLayouts, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->setLayouts, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineLayoutInfo_get_setLayouts)

static bool js_gfx_PipelineLayoutInfo_set_setLayouts(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineLayoutInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineLayoutInfo_set_setLayouts : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->setLayouts, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineLayoutInfo_set_setLayouts : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineLayoutInfo_set_setLayouts)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::PipelineLayoutInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::PipelineLayoutInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("setLayouts", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->setLayouts), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_PipelineLayoutInfo_finalize)

static bool js_gfx_PipelineLayoutInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::PipelineLayoutInfo* cobj = JSB_ALLOC(cc::gfx::PipelineLayoutInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::PipelineLayoutInfo* cobj = JSB_ALLOC(cc::gfx::PipelineLayoutInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->setLayouts), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_PipelineLayoutInfo_constructor, __jsb_cc_gfx_PipelineLayoutInfo_class, js_cc_gfx_PipelineLayoutInfo_finalize)



static bool js_cc_gfx_PipelineLayoutInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::PipelineLayoutInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineLayoutInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_PipelineLayoutInfo_finalize)

bool js_register_gfx_PipelineLayoutInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("PipelineLayoutInfo", obj, nullptr, _SE(js_gfx_PipelineLayoutInfo_constructor));

    cls->defineProperty("setLayouts", _SE(js_gfx_PipelineLayoutInfo_get_setLayouts), _SE(js_gfx_PipelineLayoutInfo_set_setLayouts));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_PipelineLayoutInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::PipelineLayoutInfo>(cls);

    __jsb_cc_gfx_PipelineLayoutInfo_proto = cls->getProto();
    __jsb_cc_gfx_PipelineLayoutInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_InputState_proto = nullptr;
se::Class* __jsb_cc_gfx_InputState_class = nullptr;

static bool js_gfx_InputState_get_attributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputState_get_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->attributes, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->attributes, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_InputState_get_attributes)

static bool js_gfx_InputState_set_attributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputState_set_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->attributes, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_InputState_set_attributes : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_InputState_set_attributes)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::InputState * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::InputState*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("attributes", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->attributes), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_InputState_finalize)

static bool js_gfx_InputState_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::InputState* cobj = JSB_ALLOC(cc::gfx::InputState);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::InputState* cobj = JSB_ALLOC(cc::gfx::InputState);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->attributes), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_InputState_constructor, __jsb_cc_gfx_InputState_class, js_cc_gfx_InputState_finalize)



static bool js_cc_gfx_InputState_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::InputState>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::InputState>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_InputState_finalize)

bool js_register_gfx_InputState(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("InputState", obj, nullptr, _SE(js_gfx_InputState_constructor));

    cls->defineProperty("attributes", _SE(js_gfx_InputState_get_attributes), _SE(js_gfx_InputState_set_attributes));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_InputState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::InputState>(cls);

    __jsb_cc_gfx_InputState_proto = cls->getProto();
    __jsb_cc_gfx_InputState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_RasterizerState_proto = nullptr;
se::Class* __jsb_cc_gfx_RasterizerState_class = nullptr;

static bool js_gfx_RasterizerState_get_isDiscard(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_isDiscard : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isDiscard, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isDiscard, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_isDiscard)

static bool js_gfx_RasterizerState_set_isDiscard(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_isDiscard : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isDiscard, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_isDiscard : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_isDiscard)

static bool js_gfx_RasterizerState_get_polygonMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_polygonMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->polygonMode, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->polygonMode, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_polygonMode)

static bool js_gfx_RasterizerState_set_polygonMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_polygonMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->polygonMode, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_polygonMode : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_polygonMode)

static bool js_gfx_RasterizerState_get_shadeModel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_shadeModel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->shadeModel, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->shadeModel, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_shadeModel)

static bool js_gfx_RasterizerState_set_shadeModel(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_shadeModel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->shadeModel, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_shadeModel : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_shadeModel)

static bool js_gfx_RasterizerState_get_cullMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_cullMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->cullMode, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->cullMode, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_cullMode)

static bool js_gfx_RasterizerState_set_cullMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_cullMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->cullMode, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_cullMode : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_cullMode)

static bool js_gfx_RasterizerState_get_isFrontFaceCCW(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_isFrontFaceCCW : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isFrontFaceCCW, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isFrontFaceCCW, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_isFrontFaceCCW)

static bool js_gfx_RasterizerState_set_isFrontFaceCCW(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_isFrontFaceCCW : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isFrontFaceCCW, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_isFrontFaceCCW : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_isFrontFaceCCW)

static bool js_gfx_RasterizerState_get_depthBiasEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_depthBiasEnabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthBiasEnabled, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthBiasEnabled, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_depthBiasEnabled)

static bool js_gfx_RasterizerState_set_depthBiasEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_depthBiasEnabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthBiasEnabled, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_depthBiasEnabled : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_depthBiasEnabled)

static bool js_gfx_RasterizerState_get_depthBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_depthBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthBias, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthBias, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_depthBias)

static bool js_gfx_RasterizerState_set_depthBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_depthBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthBias, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_depthBias : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_depthBias)

static bool js_gfx_RasterizerState_get_depthBiasClamp(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_depthBiasClamp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthBiasClamp, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthBiasClamp, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_depthBiasClamp)

static bool js_gfx_RasterizerState_set_depthBiasClamp(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_depthBiasClamp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthBiasClamp, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_depthBiasClamp : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_depthBiasClamp)

static bool js_gfx_RasterizerState_get_depthBiasSlop(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_depthBiasSlop : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthBiasSlop, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthBiasSlop, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_depthBiasSlop)

static bool js_gfx_RasterizerState_set_depthBiasSlop(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_depthBiasSlop : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthBiasSlop, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_depthBiasSlop : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_depthBiasSlop)

static bool js_gfx_RasterizerState_get_isDepthClip(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_isDepthClip : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isDepthClip, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isDepthClip, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_isDepthClip)

static bool js_gfx_RasterizerState_set_isDepthClip(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_isDepthClip : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isDepthClip, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_isDepthClip : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_isDepthClip)

static bool js_gfx_RasterizerState_get_isMultisample(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_isMultisample : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isMultisample, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isMultisample, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_isMultisample)

static bool js_gfx_RasterizerState_set_isMultisample(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_isMultisample : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isMultisample, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_isMultisample : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_isMultisample)

static bool js_gfx_RasterizerState_get_lineWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_lineWidth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->lineWidth, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->lineWidth, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_lineWidth)

static bool js_gfx_RasterizerState_set_lineWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_lineWidth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->lineWidth, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_lineWidth : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_lineWidth)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::RasterizerState * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::RasterizerState*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("isDiscard", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isDiscard), ctx);
    }
    json->getProperty("polygonMode", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->polygonMode), ctx);
    }
    json->getProperty("shadeModel", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->shadeModel), ctx);
    }
    json->getProperty("cullMode", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->cullMode), ctx);
    }
    json->getProperty("isFrontFaceCCW", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isFrontFaceCCW), ctx);
    }
    json->getProperty("depthBiasEnabled", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthBiasEnabled), ctx);
    }
    json->getProperty("depthBias", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthBias), ctx);
    }
    json->getProperty("depthBiasClamp", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthBiasClamp), ctx);
    }
    json->getProperty("depthBiasSlop", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthBiasSlop), ctx);
    }
    json->getProperty("isDepthClip", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isDepthClip), ctx);
    }
    json->getProperty("isMultisample", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isMultisample), ctx);
    }
    json->getProperty("lineWidth", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->lineWidth), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_RasterizerState_finalize)

static bool js_gfx_RasterizerState_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::RasterizerState* cobj = JSB_ALLOC(cc::gfx::RasterizerState);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::RasterizerState* cobj = JSB_ALLOC(cc::gfx::RasterizerState);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::RasterizerState* cobj = JSB_ALLOC(cc::gfx::RasterizerState);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->isDiscard), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->polygonMode), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->shadeModel), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->cullMode), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->isFrontFaceCCW), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->depthBiasEnabled), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->depthBias), nullptr);
    }
    if (argc > 7 && !args[7].isUndefined()) {
        ok &= sevalue_to_native(args[7], &(cobj->depthBiasClamp), nullptr);
    }
    if (argc > 8 && !args[8].isUndefined()) {
        ok &= sevalue_to_native(args[8], &(cobj->depthBiasSlop), nullptr);
    }
    if (argc > 9 && !args[9].isUndefined()) {
        ok &= sevalue_to_native(args[9], &(cobj->isDepthClip), nullptr);
    }
    if (argc > 10 && !args[10].isUndefined()) {
        ok &= sevalue_to_native(args[10], &(cobj->isMultisample), nullptr);
    }
    if (argc > 11 && !args[11].isUndefined()) {
        ok &= sevalue_to_native(args[11], &(cobj->lineWidth), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_RasterizerState_constructor, __jsb_cc_gfx_RasterizerState_class, js_cc_gfx_RasterizerState_finalize)



static bool js_cc_gfx_RasterizerState_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::RasterizerState>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_RasterizerState_finalize)

bool js_register_gfx_RasterizerState(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RasterizerState", obj, nullptr, _SE(js_gfx_RasterizerState_constructor));

    cls->defineProperty("isDiscard", _SE(js_gfx_RasterizerState_get_isDiscard), _SE(js_gfx_RasterizerState_set_isDiscard));
    cls->defineProperty("polygonMode", _SE(js_gfx_RasterizerState_get_polygonMode), _SE(js_gfx_RasterizerState_set_polygonMode));
    cls->defineProperty("shadeModel", _SE(js_gfx_RasterizerState_get_shadeModel), _SE(js_gfx_RasterizerState_set_shadeModel));
    cls->defineProperty("cullMode", _SE(js_gfx_RasterizerState_get_cullMode), _SE(js_gfx_RasterizerState_set_cullMode));
    cls->defineProperty("isFrontFaceCCW", _SE(js_gfx_RasterizerState_get_isFrontFaceCCW), _SE(js_gfx_RasterizerState_set_isFrontFaceCCW));
    cls->defineProperty("depthBiasEnabled", _SE(js_gfx_RasterizerState_get_depthBiasEnabled), _SE(js_gfx_RasterizerState_set_depthBiasEnabled));
    cls->defineProperty("depthBias", _SE(js_gfx_RasterizerState_get_depthBias), _SE(js_gfx_RasterizerState_set_depthBias));
    cls->defineProperty("depthBiasClamp", _SE(js_gfx_RasterizerState_get_depthBiasClamp), _SE(js_gfx_RasterizerState_set_depthBiasClamp));
    cls->defineProperty("depthBiasSlop", _SE(js_gfx_RasterizerState_get_depthBiasSlop), _SE(js_gfx_RasterizerState_set_depthBiasSlop));
    cls->defineProperty("isDepthClip", _SE(js_gfx_RasterizerState_get_isDepthClip), _SE(js_gfx_RasterizerState_set_isDepthClip));
    cls->defineProperty("isMultisample", _SE(js_gfx_RasterizerState_get_isMultisample), _SE(js_gfx_RasterizerState_set_isMultisample));
    cls->defineProperty("lineWidth", _SE(js_gfx_RasterizerState_get_lineWidth), _SE(js_gfx_RasterizerState_set_lineWidth));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_RasterizerState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::RasterizerState>(cls);

    __jsb_cc_gfx_RasterizerState_proto = cls->getProto();
    __jsb_cc_gfx_RasterizerState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_DepthStencilState_proto = nullptr;
se::Class* __jsb_cc_gfx_DepthStencilState_class = nullptr;

static bool js_gfx_DepthStencilState_get_depthTest(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_depthTest : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthTest, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthTest, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_depthTest)

static bool js_gfx_DepthStencilState_set_depthTest(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_depthTest : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthTest, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_depthTest : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_depthTest)

static bool js_gfx_DepthStencilState_get_depthWrite(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_depthWrite : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthWrite, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthWrite, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_depthWrite)

static bool js_gfx_DepthStencilState_set_depthWrite(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_depthWrite : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthWrite, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_depthWrite : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_depthWrite)

static bool js_gfx_DepthStencilState_get_depthFunc(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_depthFunc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthFunc, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthFunc, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_depthFunc)

static bool js_gfx_DepthStencilState_set_depthFunc(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_depthFunc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthFunc, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_depthFunc : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_depthFunc)

static bool js_gfx_DepthStencilState_get_stencilTestFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilTestFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilTestFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilTestFront, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilTestFront)

static bool js_gfx_DepthStencilState_set_stencilTestFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilTestFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilTestFront, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilTestFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilTestFront)

static bool js_gfx_DepthStencilState_get_stencilFuncFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilFuncFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilFuncFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilFuncFront, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilFuncFront)

static bool js_gfx_DepthStencilState_set_stencilFuncFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilFuncFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilFuncFront, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilFuncFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilFuncFront)

static bool js_gfx_DepthStencilState_get_stencilReadMaskFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilReadMaskFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilReadMaskFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilReadMaskFront, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilReadMaskFront)

static bool js_gfx_DepthStencilState_set_stencilReadMaskFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilReadMaskFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilReadMaskFront, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilReadMaskFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilReadMaskFront)

static bool js_gfx_DepthStencilState_get_stencilWriteMaskFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilWriteMaskFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilWriteMaskFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilWriteMaskFront, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilWriteMaskFront)

static bool js_gfx_DepthStencilState_set_stencilWriteMaskFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilWriteMaskFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilWriteMaskFront, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilWriteMaskFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilWriteMaskFront)

static bool js_gfx_DepthStencilState_get_stencilFailOpFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilFailOpFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilFailOpFront, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilFailOpFront)

static bool js_gfx_DepthStencilState_set_stencilFailOpFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilFailOpFront, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilFailOpFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilFailOpFront)

static bool js_gfx_DepthStencilState_get_stencilZFailOpFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilZFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilZFailOpFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilZFailOpFront, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilZFailOpFront)

static bool js_gfx_DepthStencilState_set_stencilZFailOpFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilZFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilZFailOpFront, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilZFailOpFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilZFailOpFront)

static bool js_gfx_DepthStencilState_get_stencilPassOpFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilPassOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilPassOpFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilPassOpFront, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilPassOpFront)

static bool js_gfx_DepthStencilState_set_stencilPassOpFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilPassOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilPassOpFront, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilPassOpFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilPassOpFront)

static bool js_gfx_DepthStencilState_get_stencilRefFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilRefFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilRefFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilRefFront, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilRefFront)

static bool js_gfx_DepthStencilState_set_stencilRefFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilRefFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilRefFront, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilRefFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilRefFront)

static bool js_gfx_DepthStencilState_get_stencilTestBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilTestBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilTestBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilTestBack, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilTestBack)

static bool js_gfx_DepthStencilState_set_stencilTestBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilTestBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilTestBack, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilTestBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilTestBack)

static bool js_gfx_DepthStencilState_get_stencilFuncBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilFuncBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilFuncBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilFuncBack, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilFuncBack)

static bool js_gfx_DepthStencilState_set_stencilFuncBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilFuncBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilFuncBack, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilFuncBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilFuncBack)

static bool js_gfx_DepthStencilState_get_stencilReadMaskBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilReadMaskBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilReadMaskBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilReadMaskBack, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilReadMaskBack)

static bool js_gfx_DepthStencilState_set_stencilReadMaskBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilReadMaskBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilReadMaskBack, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilReadMaskBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilReadMaskBack)

static bool js_gfx_DepthStencilState_get_stencilWriteMaskBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilWriteMaskBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilWriteMaskBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilWriteMaskBack, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilWriteMaskBack)

static bool js_gfx_DepthStencilState_set_stencilWriteMaskBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilWriteMaskBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilWriteMaskBack, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilWriteMaskBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilWriteMaskBack)

static bool js_gfx_DepthStencilState_get_stencilFailOpBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilFailOpBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilFailOpBack, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilFailOpBack)

static bool js_gfx_DepthStencilState_set_stencilFailOpBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilFailOpBack, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilFailOpBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilFailOpBack)

static bool js_gfx_DepthStencilState_get_stencilZFailOpBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilZFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilZFailOpBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilZFailOpBack, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilZFailOpBack)

static bool js_gfx_DepthStencilState_set_stencilZFailOpBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilZFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilZFailOpBack, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilZFailOpBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilZFailOpBack)

static bool js_gfx_DepthStencilState_get_stencilPassOpBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilPassOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilPassOpBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilPassOpBack, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilPassOpBack)

static bool js_gfx_DepthStencilState_set_stencilPassOpBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilPassOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilPassOpBack, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilPassOpBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilPassOpBack)

static bool js_gfx_DepthStencilState_get_stencilRefBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilRefBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilRefBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilRefBack, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilRefBack)

static bool js_gfx_DepthStencilState_set_stencilRefBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilRefBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilRefBack, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilRefBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilRefBack)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::DepthStencilState * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::DepthStencilState*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("depthTest", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthTest), ctx);
    }
    json->getProperty("depthWrite", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthWrite), ctx);
    }
    json->getProperty("depthFunc", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthFunc), ctx);
    }
    json->getProperty("stencilTestFront", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilTestFront), ctx);
    }
    json->getProperty("stencilFuncFront", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilFuncFront), ctx);
    }
    json->getProperty("stencilReadMaskFront", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilReadMaskFront), ctx);
    }
    json->getProperty("stencilWriteMaskFront", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilWriteMaskFront), ctx);
    }
    json->getProperty("stencilFailOpFront", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilFailOpFront), ctx);
    }
    json->getProperty("stencilZFailOpFront", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilZFailOpFront), ctx);
    }
    json->getProperty("stencilPassOpFront", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilPassOpFront), ctx);
    }
    json->getProperty("stencilRefFront", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilRefFront), ctx);
    }
    json->getProperty("stencilTestBack", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilTestBack), ctx);
    }
    json->getProperty("stencilFuncBack", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilFuncBack), ctx);
    }
    json->getProperty("stencilReadMaskBack", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilReadMaskBack), ctx);
    }
    json->getProperty("stencilWriteMaskBack", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilWriteMaskBack), ctx);
    }
    json->getProperty("stencilFailOpBack", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilFailOpBack), ctx);
    }
    json->getProperty("stencilZFailOpBack", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilZFailOpBack), ctx);
    }
    json->getProperty("stencilPassOpBack", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilPassOpBack), ctx);
    }
    json->getProperty("stencilRefBack", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilRefBack), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DepthStencilState_finalize)

static bool js_gfx_DepthStencilState_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::DepthStencilState* cobj = JSB_ALLOC(cc::gfx::DepthStencilState);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::DepthStencilState* cobj = JSB_ALLOC(cc::gfx::DepthStencilState);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::DepthStencilState* cobj = JSB_ALLOC(cc::gfx::DepthStencilState);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->depthTest), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->depthWrite), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->depthFunc), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->stencilTestFront), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->stencilFuncFront), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->stencilReadMaskFront), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->stencilWriteMaskFront), nullptr);
    }
    if (argc > 7 && !args[7].isUndefined()) {
        ok &= sevalue_to_native(args[7], &(cobj->stencilFailOpFront), nullptr);
    }
    if (argc > 8 && !args[8].isUndefined()) {
        ok &= sevalue_to_native(args[8], &(cobj->stencilZFailOpFront), nullptr);
    }
    if (argc > 9 && !args[9].isUndefined()) {
        ok &= sevalue_to_native(args[9], &(cobj->stencilPassOpFront), nullptr);
    }
    if (argc > 10 && !args[10].isUndefined()) {
        ok &= sevalue_to_native(args[10], &(cobj->stencilRefFront), nullptr);
    }
    if (argc > 11 && !args[11].isUndefined()) {
        ok &= sevalue_to_native(args[11], &(cobj->stencilTestBack), nullptr);
    }
    if (argc > 12 && !args[12].isUndefined()) {
        ok &= sevalue_to_native(args[12], &(cobj->stencilFuncBack), nullptr);
    }
    if (argc > 13 && !args[13].isUndefined()) {
        ok &= sevalue_to_native(args[13], &(cobj->stencilReadMaskBack), nullptr);
    }
    if (argc > 14 && !args[14].isUndefined()) {
        ok &= sevalue_to_native(args[14], &(cobj->stencilWriteMaskBack), nullptr);
    }
    if (argc > 15 && !args[15].isUndefined()) {
        ok &= sevalue_to_native(args[15], &(cobj->stencilFailOpBack), nullptr);
    }
    if (argc > 16 && !args[16].isUndefined()) {
        ok &= sevalue_to_native(args[16], &(cobj->stencilZFailOpBack), nullptr);
    }
    if (argc > 17 && !args[17].isUndefined()) {
        ok &= sevalue_to_native(args[17], &(cobj->stencilPassOpBack), nullptr);
    }
    if (argc > 18 && !args[18].isUndefined()) {
        ok &= sevalue_to_native(args[18], &(cobj->stencilRefBack), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_DepthStencilState_constructor, __jsb_cc_gfx_DepthStencilState_class, js_cc_gfx_DepthStencilState_finalize)



static bool js_cc_gfx_DepthStencilState_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DepthStencilState_finalize)

bool js_register_gfx_DepthStencilState(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DepthStencilState", obj, nullptr, _SE(js_gfx_DepthStencilState_constructor));

    cls->defineProperty("depthTest", _SE(js_gfx_DepthStencilState_get_depthTest), _SE(js_gfx_DepthStencilState_set_depthTest));
    cls->defineProperty("depthWrite", _SE(js_gfx_DepthStencilState_get_depthWrite), _SE(js_gfx_DepthStencilState_set_depthWrite));
    cls->defineProperty("depthFunc", _SE(js_gfx_DepthStencilState_get_depthFunc), _SE(js_gfx_DepthStencilState_set_depthFunc));
    cls->defineProperty("stencilTestFront", _SE(js_gfx_DepthStencilState_get_stencilTestFront), _SE(js_gfx_DepthStencilState_set_stencilTestFront));
    cls->defineProperty("stencilFuncFront", _SE(js_gfx_DepthStencilState_get_stencilFuncFront), _SE(js_gfx_DepthStencilState_set_stencilFuncFront));
    cls->defineProperty("stencilReadMaskFront", _SE(js_gfx_DepthStencilState_get_stencilReadMaskFront), _SE(js_gfx_DepthStencilState_set_stencilReadMaskFront));
    cls->defineProperty("stencilWriteMaskFront", _SE(js_gfx_DepthStencilState_get_stencilWriteMaskFront), _SE(js_gfx_DepthStencilState_set_stencilWriteMaskFront));
    cls->defineProperty("stencilFailOpFront", _SE(js_gfx_DepthStencilState_get_stencilFailOpFront), _SE(js_gfx_DepthStencilState_set_stencilFailOpFront));
    cls->defineProperty("stencilZFailOpFront", _SE(js_gfx_DepthStencilState_get_stencilZFailOpFront), _SE(js_gfx_DepthStencilState_set_stencilZFailOpFront));
    cls->defineProperty("stencilPassOpFront", _SE(js_gfx_DepthStencilState_get_stencilPassOpFront), _SE(js_gfx_DepthStencilState_set_stencilPassOpFront));
    cls->defineProperty("stencilRefFront", _SE(js_gfx_DepthStencilState_get_stencilRefFront), _SE(js_gfx_DepthStencilState_set_stencilRefFront));
    cls->defineProperty("stencilTestBack", _SE(js_gfx_DepthStencilState_get_stencilTestBack), _SE(js_gfx_DepthStencilState_set_stencilTestBack));
    cls->defineProperty("stencilFuncBack", _SE(js_gfx_DepthStencilState_get_stencilFuncBack), _SE(js_gfx_DepthStencilState_set_stencilFuncBack));
    cls->defineProperty("stencilReadMaskBack", _SE(js_gfx_DepthStencilState_get_stencilReadMaskBack), _SE(js_gfx_DepthStencilState_set_stencilReadMaskBack));
    cls->defineProperty("stencilWriteMaskBack", _SE(js_gfx_DepthStencilState_get_stencilWriteMaskBack), _SE(js_gfx_DepthStencilState_set_stencilWriteMaskBack));
    cls->defineProperty("stencilFailOpBack", _SE(js_gfx_DepthStencilState_get_stencilFailOpBack), _SE(js_gfx_DepthStencilState_set_stencilFailOpBack));
    cls->defineProperty("stencilZFailOpBack", _SE(js_gfx_DepthStencilState_get_stencilZFailOpBack), _SE(js_gfx_DepthStencilState_set_stencilZFailOpBack));
    cls->defineProperty("stencilPassOpBack", _SE(js_gfx_DepthStencilState_get_stencilPassOpBack), _SE(js_gfx_DepthStencilState_set_stencilPassOpBack));
    cls->defineProperty("stencilRefBack", _SE(js_gfx_DepthStencilState_get_stencilRefBack), _SE(js_gfx_DepthStencilState_set_stencilRefBack));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DepthStencilState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DepthStencilState>(cls);

    __jsb_cc_gfx_DepthStencilState_proto = cls->getProto();
    __jsb_cc_gfx_DepthStencilState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_BlendTarget_proto = nullptr;
se::Class* __jsb_cc_gfx_BlendTarget_class = nullptr;

static bool js_gfx_BlendTarget_get_blend(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blend, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blend, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blend)

static bool js_gfx_BlendTarget_set_blend(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blend, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blend : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blend)

static bool js_gfx_BlendTarget_get_blendSrc(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendSrc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendSrc, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blendSrc, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendSrc)

static bool js_gfx_BlendTarget_set_blendSrc(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendSrc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendSrc, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendSrc : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendSrc)

static bool js_gfx_BlendTarget_get_blendDst(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendDst : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendDst, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blendDst, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendDst)

static bool js_gfx_BlendTarget_set_blendDst(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendDst : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendDst, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendDst : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendDst)

static bool js_gfx_BlendTarget_get_blendEq(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendEq, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blendEq, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendEq)

static bool js_gfx_BlendTarget_set_blendEq(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendEq, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendEq : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendEq)

static bool js_gfx_BlendTarget_get_blendSrcAlpha(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendSrcAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendSrcAlpha, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blendSrcAlpha, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendSrcAlpha)

static bool js_gfx_BlendTarget_set_blendSrcAlpha(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendSrcAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendSrcAlpha, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendSrcAlpha : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendSrcAlpha)

static bool js_gfx_BlendTarget_get_blendDstAlpha(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendDstAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendDstAlpha, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blendDstAlpha, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendDstAlpha)

static bool js_gfx_BlendTarget_set_blendDstAlpha(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendDstAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendDstAlpha, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendDstAlpha : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendDstAlpha)

static bool js_gfx_BlendTarget_get_blendAlphaEq(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendAlphaEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendAlphaEq, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blendAlphaEq, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendAlphaEq)

static bool js_gfx_BlendTarget_set_blendAlphaEq(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendAlphaEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendAlphaEq, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendAlphaEq : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendAlphaEq)

static bool js_gfx_BlendTarget_get_blendColorMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendColorMask : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendColorMask, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blendColorMask, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendColorMask)

static bool js_gfx_BlendTarget_set_blendColorMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendColorMask : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendColorMask, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendColorMask : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendColorMask)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::BlendTarget * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::BlendTarget*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("blend", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blend), ctx);
    }
    json->getProperty("blendSrc", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendSrc), ctx);
    }
    json->getProperty("blendDst", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendDst), ctx);
    }
    json->getProperty("blendEq", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendEq), ctx);
    }
    json->getProperty("blendSrcAlpha", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendSrcAlpha), ctx);
    }
    json->getProperty("blendDstAlpha", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendDstAlpha), ctx);
    }
    json->getProperty("blendAlphaEq", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendAlphaEq), ctx);
    }
    json->getProperty("blendColorMask", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendColorMask), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_BlendTarget_finalize)

static bool js_gfx_BlendTarget_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::BlendTarget* cobj = JSB_ALLOC(cc::gfx::BlendTarget);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::BlendTarget* cobj = JSB_ALLOC(cc::gfx::BlendTarget);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::BlendTarget* cobj = JSB_ALLOC(cc::gfx::BlendTarget);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->blend), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->blendSrc), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->blendDst), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->blendEq), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->blendSrcAlpha), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->blendDstAlpha), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->blendAlphaEq), nullptr);
    }
    if (argc > 7 && !args[7].isUndefined()) {
        ok &= sevalue_to_native(args[7], &(cobj->blendColorMask), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_BlendTarget_constructor, __jsb_cc_gfx_BlendTarget_class, js_cc_gfx_BlendTarget_finalize)



static bool js_cc_gfx_BlendTarget_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::BlendTarget>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_BlendTarget_finalize)

bool js_register_gfx_BlendTarget(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BlendTarget", obj, nullptr, _SE(js_gfx_BlendTarget_constructor));

    cls->defineProperty("blend", _SE(js_gfx_BlendTarget_get_blend), _SE(js_gfx_BlendTarget_set_blend));
    cls->defineProperty("blendSrc", _SE(js_gfx_BlendTarget_get_blendSrc), _SE(js_gfx_BlendTarget_set_blendSrc));
    cls->defineProperty("blendDst", _SE(js_gfx_BlendTarget_get_blendDst), _SE(js_gfx_BlendTarget_set_blendDst));
    cls->defineProperty("blendEq", _SE(js_gfx_BlendTarget_get_blendEq), _SE(js_gfx_BlendTarget_set_blendEq));
    cls->defineProperty("blendSrcAlpha", _SE(js_gfx_BlendTarget_get_blendSrcAlpha), _SE(js_gfx_BlendTarget_set_blendSrcAlpha));
    cls->defineProperty("blendDstAlpha", _SE(js_gfx_BlendTarget_get_blendDstAlpha), _SE(js_gfx_BlendTarget_set_blendDstAlpha));
    cls->defineProperty("blendAlphaEq", _SE(js_gfx_BlendTarget_get_blendAlphaEq), _SE(js_gfx_BlendTarget_set_blendAlphaEq));
    cls->defineProperty("blendColorMask", _SE(js_gfx_BlendTarget_get_blendColorMask), _SE(js_gfx_BlendTarget_set_blendColorMask));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_BlendTarget_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::BlendTarget>(cls);

    __jsb_cc_gfx_BlendTarget_proto = cls->getProto();
    __jsb_cc_gfx_BlendTarget_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_BlendState_proto = nullptr;
se::Class* __jsb_cc_gfx_BlendState_class = nullptr;

static bool js_gfx_BlendState_get_isA2C(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_get_isA2C : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isA2C, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isA2C, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendState_get_isA2C)

static bool js_gfx_BlendState_set_isA2C(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_set_isA2C : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isA2C, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BlendState_set_isA2C : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendState_set_isA2C)

static bool js_gfx_BlendState_get_isIndepend(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_get_isIndepend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isIndepend, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isIndepend, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendState_get_isIndepend)

static bool js_gfx_BlendState_set_isIndepend(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_set_isIndepend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isIndepend, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BlendState_set_isIndepend : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendState_set_isIndepend)

static bool js_gfx_BlendState_get_blendColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_get_blendColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendColor, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blendColor, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendState_get_blendColor)

static bool js_gfx_BlendState_set_blendColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_set_blendColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendColor, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BlendState_set_blendColor : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendState_set_blendColor)

static bool js_gfx_BlendState_get_targets(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_get_targets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->targets, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->targets, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendState_get_targets)

static bool js_gfx_BlendState_set_targets(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_set_targets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->targets, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_BlendState_set_targets : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendState_set_targets)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::BlendState * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::BlendState*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("isA2C", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isA2C), ctx);
    }
    json->getProperty("isIndepend", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isIndepend), ctx);
    }
    json->getProperty("blendColor", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendColor), ctx);
    }
    json->getProperty("targets", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->targets), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_BlendState_finalize)

static bool js_gfx_BlendState_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::BlendState* cobj = JSB_ALLOC(cc::gfx::BlendState);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::BlendState* cobj = JSB_ALLOC(cc::gfx::BlendState);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::BlendState* cobj = JSB_ALLOC(cc::gfx::BlendState);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->isA2C), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->isIndepend), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->blendColor), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->targets), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_BlendState_constructor, __jsb_cc_gfx_BlendState_class, js_cc_gfx_BlendState_finalize)



static bool js_cc_gfx_BlendState_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::BlendState>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::BlendState>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_BlendState_finalize)

bool js_register_gfx_BlendState(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BlendState", obj, nullptr, _SE(js_gfx_BlendState_constructor));

    cls->defineProperty("isA2C", _SE(js_gfx_BlendState_get_isA2C), _SE(js_gfx_BlendState_set_isA2C));
    cls->defineProperty("isIndepend", _SE(js_gfx_BlendState_get_isIndepend), _SE(js_gfx_BlendState_set_isIndepend));
    cls->defineProperty("blendColor", _SE(js_gfx_BlendState_get_blendColor), _SE(js_gfx_BlendState_set_blendColor));
    cls->defineProperty("targets", _SE(js_gfx_BlendState_get_targets), _SE(js_gfx_BlendState_set_targets));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_BlendState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::BlendState>(cls);

    __jsb_cc_gfx_BlendState_proto = cls->getProto();
    __jsb_cc_gfx_BlendState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_PipelineStateInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_PipelineStateInfo_class = nullptr;

static bool js_gfx_PipelineStateInfo_get_shader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_shader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->shader, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->shader, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_shader)

static bool js_gfx_PipelineStateInfo_set_shader(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_shader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->shader, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_shader : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_shader)

static bool js_gfx_PipelineStateInfo_get_pipelineLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_pipelineLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->pipelineLayout, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->pipelineLayout, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_pipelineLayout)

static bool js_gfx_PipelineStateInfo_set_pipelineLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_pipelineLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->pipelineLayout, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_pipelineLayout : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_pipelineLayout)

static bool js_gfx_PipelineStateInfo_get_renderPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_renderPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->renderPass, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->renderPass, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_renderPass)

static bool js_gfx_PipelineStateInfo_set_renderPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_renderPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->renderPass, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_renderPass : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_renderPass)

static bool js_gfx_PipelineStateInfo_get_inputState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_inputState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->inputState, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->inputState, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_inputState)

static bool js_gfx_PipelineStateInfo_set_inputState(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_inputState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->inputState, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_inputState : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_inputState)

static bool js_gfx_PipelineStateInfo_get_rasterizerState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_rasterizerState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->rasterizerState, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->rasterizerState, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_rasterizerState)

static bool js_gfx_PipelineStateInfo_set_rasterizerState(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_rasterizerState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->rasterizerState, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_rasterizerState : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_rasterizerState)

static bool js_gfx_PipelineStateInfo_get_depthStencilState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_depthStencilState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthStencilState, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthStencilState, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_depthStencilState)

static bool js_gfx_PipelineStateInfo_set_depthStencilState(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_depthStencilState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthStencilState, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_depthStencilState : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_depthStencilState)

static bool js_gfx_PipelineStateInfo_get_blendState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_blendState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendState, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blendState, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_blendState)

static bool js_gfx_PipelineStateInfo_set_blendState(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_blendState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendState, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_blendState : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_blendState)

static bool js_gfx_PipelineStateInfo_get_primitive(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_primitive : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->primitive, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->primitive, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_primitive)

static bool js_gfx_PipelineStateInfo_set_primitive(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_primitive : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->primitive, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_primitive : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_primitive)

static bool js_gfx_PipelineStateInfo_get_dynamicStates(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_dynamicStates : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->dynamicStates, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->dynamicStates, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_dynamicStates)

static bool js_gfx_PipelineStateInfo_set_dynamicStates(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_dynamicStates : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->dynamicStates, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_dynamicStates : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_dynamicStates)

static bool js_gfx_PipelineStateInfo_get_bindPoint(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_bindPoint : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bindPoint, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->bindPoint, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_bindPoint)

static bool js_gfx_PipelineStateInfo_set_bindPoint(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_bindPoint : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bindPoint, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_bindPoint : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_bindPoint)

static bool js_gfx_PipelineStateInfo_get_subpass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_subpass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->subpass, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->subpass, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_subpass)

static bool js_gfx_PipelineStateInfo_set_subpass(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_subpass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->subpass, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_subpass : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_subpass)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::PipelineStateInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::PipelineStateInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("shader", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->shader), ctx);
    }
    json->getProperty("pipelineLayout", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->pipelineLayout), ctx);
    }
    json->getProperty("renderPass", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->renderPass), ctx);
    }
    json->getProperty("inputState", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->inputState), ctx);
    }
    json->getProperty("rasterizerState", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->rasterizerState), ctx);
    }
    json->getProperty("depthStencilState", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthStencilState), ctx);
    }
    json->getProperty("blendState", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendState), ctx);
    }
    json->getProperty("primitive", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->primitive), ctx);
    }
    json->getProperty("dynamicStates", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->dynamicStates), ctx);
    }
    json->getProperty("bindPoint", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bindPoint), ctx);
    }
    json->getProperty("subpass", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->subpass), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_PipelineStateInfo_finalize)

static bool js_gfx_PipelineStateInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::PipelineStateInfo* cobj = JSB_ALLOC(cc::gfx::PipelineStateInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::PipelineStateInfo* cobj = JSB_ALLOC(cc::gfx::PipelineStateInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::PipelineStateInfo* cobj = JSB_ALLOC(cc::gfx::PipelineStateInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->shader), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->pipelineLayout), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->renderPass), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->inputState), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->rasterizerState), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->depthStencilState), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->blendState), nullptr);
    }
    if (argc > 7 && !args[7].isUndefined()) {
        ok &= sevalue_to_native(args[7], &(cobj->primitive), nullptr);
    }
    if (argc > 8 && !args[8].isUndefined()) {
        ok &= sevalue_to_native(args[8], &(cobj->dynamicStates), nullptr);
    }
    if (argc > 9 && !args[9].isUndefined()) {
        ok &= sevalue_to_native(args[9], &(cobj->bindPoint), nullptr);
    }
    if (argc > 10 && !args[10].isUndefined()) {
        ok &= sevalue_to_native(args[10], &(cobj->subpass), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_PipelineStateInfo_constructor, __jsb_cc_gfx_PipelineStateInfo_class, js_cc_gfx_PipelineStateInfo_finalize)



static bool js_cc_gfx_PipelineStateInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_PipelineStateInfo_finalize)

bool js_register_gfx_PipelineStateInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("PipelineStateInfo", obj, nullptr, _SE(js_gfx_PipelineStateInfo_constructor));

    cls->defineProperty("shader", _SE(js_gfx_PipelineStateInfo_get_shader), _SE(js_gfx_PipelineStateInfo_set_shader));
    cls->defineProperty("pipelineLayout", _SE(js_gfx_PipelineStateInfo_get_pipelineLayout), _SE(js_gfx_PipelineStateInfo_set_pipelineLayout));
    cls->defineProperty("renderPass", _SE(js_gfx_PipelineStateInfo_get_renderPass), _SE(js_gfx_PipelineStateInfo_set_renderPass));
    cls->defineProperty("inputState", _SE(js_gfx_PipelineStateInfo_get_inputState), _SE(js_gfx_PipelineStateInfo_set_inputState));
    cls->defineProperty("rasterizerState", _SE(js_gfx_PipelineStateInfo_get_rasterizerState), _SE(js_gfx_PipelineStateInfo_set_rasterizerState));
    cls->defineProperty("depthStencilState", _SE(js_gfx_PipelineStateInfo_get_depthStencilState), _SE(js_gfx_PipelineStateInfo_set_depthStencilState));
    cls->defineProperty("blendState", _SE(js_gfx_PipelineStateInfo_get_blendState), _SE(js_gfx_PipelineStateInfo_set_blendState));
    cls->defineProperty("primitive", _SE(js_gfx_PipelineStateInfo_get_primitive), _SE(js_gfx_PipelineStateInfo_set_primitive));
    cls->defineProperty("dynamicStates", _SE(js_gfx_PipelineStateInfo_get_dynamicStates), _SE(js_gfx_PipelineStateInfo_set_dynamicStates));
    cls->defineProperty("bindPoint", _SE(js_gfx_PipelineStateInfo_get_bindPoint), _SE(js_gfx_PipelineStateInfo_set_bindPoint));
    cls->defineProperty("subpass", _SE(js_gfx_PipelineStateInfo_get_subpass), _SE(js_gfx_PipelineStateInfo_set_subpass));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_PipelineStateInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::PipelineStateInfo>(cls);

    __jsb_cc_gfx_PipelineStateInfo_proto = cls->getProto();
    __jsb_cc_gfx_PipelineStateInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_CommandBufferInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_CommandBufferInfo_class = nullptr;

static bool js_gfx_CommandBufferInfo_get_queue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBufferInfo_get_queue : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->queue, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->queue, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_CommandBufferInfo_get_queue)

static bool js_gfx_CommandBufferInfo_set_queue(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBufferInfo_set_queue : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->queue, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_CommandBufferInfo_set_queue : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_CommandBufferInfo_set_queue)

static bool js_gfx_CommandBufferInfo_get_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBufferInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->type, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_CommandBufferInfo_get_type)

static bool js_gfx_CommandBufferInfo_set_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBufferInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->type, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_CommandBufferInfo_set_type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_CommandBufferInfo_set_type)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::CommandBufferInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::CommandBufferInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("queue", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->queue), ctx);
    }
    json->getProperty("type", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_CommandBufferInfo_finalize)

static bool js_gfx_CommandBufferInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::CommandBufferInfo* cobj = JSB_ALLOC(cc::gfx::CommandBufferInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::CommandBufferInfo* cobj = JSB_ALLOC(cc::gfx::CommandBufferInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::CommandBufferInfo* cobj = JSB_ALLOC(cc::gfx::CommandBufferInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->queue), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->type), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_CommandBufferInfo_constructor, __jsb_cc_gfx_CommandBufferInfo_class, js_cc_gfx_CommandBufferInfo_finalize)



static bool js_cc_gfx_CommandBufferInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::CommandBufferInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBufferInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_CommandBufferInfo_finalize)

bool js_register_gfx_CommandBufferInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("CommandBufferInfo", obj, nullptr, _SE(js_gfx_CommandBufferInfo_constructor));

    cls->defineProperty("queue", _SE(js_gfx_CommandBufferInfo_get_queue), _SE(js_gfx_CommandBufferInfo_set_queue));
    cls->defineProperty("type", _SE(js_gfx_CommandBufferInfo_get_type), _SE(js_gfx_CommandBufferInfo_set_type));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_CommandBufferInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::CommandBufferInfo>(cls);

    __jsb_cc_gfx_CommandBufferInfo_proto = cls->getProto();
    __jsb_cc_gfx_CommandBufferInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_QueueInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_QueueInfo_class = nullptr;

static bool js_gfx_QueueInfo_get_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::QueueInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_QueueInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->type, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_QueueInfo_get_type)

static bool js_gfx_QueueInfo_set_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::QueueInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_QueueInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->type, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_QueueInfo_set_type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_QueueInfo_set_type)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::QueueInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::QueueInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("type", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_QueueInfo_finalize)

static bool js_gfx_QueueInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::QueueInfo* cobj = JSB_ALLOC(cc::gfx::QueueInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::QueueInfo* cobj = JSB_ALLOC(cc::gfx::QueueInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->type), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_QueueInfo_constructor, __jsb_cc_gfx_QueueInfo_class, js_cc_gfx_QueueInfo_finalize)



static bool js_cc_gfx_QueueInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::QueueInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::QueueInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_QueueInfo_finalize)

bool js_register_gfx_QueueInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("QueueInfo", obj, nullptr, _SE(js_gfx_QueueInfo_constructor));

    cls->defineProperty("type", _SE(js_gfx_QueueInfo_get_type), _SE(js_gfx_QueueInfo_set_type));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_QueueInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::QueueInfo>(cls);

    __jsb_cc_gfx_QueueInfo_proto = cls->getProto();
    __jsb_cc_gfx_QueueInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_MemoryStatus_proto = nullptr;
se::Class* __jsb_cc_gfx_MemoryStatus_class = nullptr;

static bool js_gfx_MemoryStatus_get_bufferSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::MemoryStatus>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_MemoryStatus_get_bufferSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bufferSize, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->bufferSize, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_MemoryStatus_get_bufferSize)

static bool js_gfx_MemoryStatus_set_bufferSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::MemoryStatus>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_MemoryStatus_set_bufferSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bufferSize, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_MemoryStatus_set_bufferSize : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_MemoryStatus_set_bufferSize)

static bool js_gfx_MemoryStatus_get_textureSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::MemoryStatus>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_MemoryStatus_get_textureSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->textureSize, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->textureSize, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gfx_MemoryStatus_get_textureSize)

static bool js_gfx_MemoryStatus_set_textureSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gfx::MemoryStatus>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_MemoryStatus_set_textureSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->textureSize, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_MemoryStatus_set_textureSize : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_MemoryStatus_set_textureSize)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::MemoryStatus * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gfx::MemoryStatus*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("bufferSize", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bufferSize), ctx);
    }
    json->getProperty("textureSize", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->textureSize), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_MemoryStatus_finalize)

static bool js_gfx_MemoryStatus_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::gfx::MemoryStatus* cobj = JSB_ALLOC(cc::gfx::MemoryStatus);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::MemoryStatus* cobj = JSB_ALLOC(cc::gfx::MemoryStatus);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    cc::gfx::MemoryStatus* cobj = JSB_ALLOC(cc::gfx::MemoryStatus);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->bufferSize), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->textureSize), nullptr);
    }

    if(!ok) {
        JSB_FREE(cobj);
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }

    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_MemoryStatus_constructor, __jsb_cc_gfx_MemoryStatus_class, js_cc_gfx_MemoryStatus_finalize)



static bool js_cc_gfx_MemoryStatus_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::MemoryStatus>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::MemoryStatus>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_MemoryStatus_finalize)

bool js_register_gfx_MemoryStatus(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("MemoryStatus", obj, nullptr, _SE(js_gfx_MemoryStatus_constructor));

    cls->defineProperty("bufferSize", _SE(js_gfx_MemoryStatus_get_bufferSize), _SE(js_gfx_MemoryStatus_set_bufferSize));
    cls->defineProperty("textureSize", _SE(js_gfx_MemoryStatus_get_textureSize), _SE(js_gfx_MemoryStatus_set_textureSize));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_MemoryStatus_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::MemoryStatus>(cls);

    __jsb_cc_gfx_MemoryStatus_proto = cls->getProto();
    __jsb_cc_gfx_MemoryStatus_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_GFXObject_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXObject_class = nullptr;

static bool js_gfx_GFXObject_getObjectID(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::GFXObject>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXObject_getObjectID : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getObjectID();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXObject_getObjectID : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXObject_getObjectID)

static bool js_gfx_GFXObject_getObjectType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::GFXObject>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXObject_getObjectType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getObjectType());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXObject_getObjectType : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXObject_getObjectType)

static bool js_gfx_GFXObject_getTypedID(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::GFXObject>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXObject_getTypedID : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getTypedID();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXObject_getTypedID : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXObject_getTypedID)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXObject_finalize)

static bool js_gfx_GFXObject_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::gfx::ObjectType arg0;
    ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_gfx_GFXObject_constructor : Error processing arguments");
    cc::gfx::GFXObject* cobj = JSB_ALLOC(cc::gfx::GFXObject, arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXObject_constructor, __jsb_cc_gfx_GFXObject_class, js_cc_gfx_GFXObject_finalize)



static bool js_cc_gfx_GFXObject_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::GFXObject>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::GFXObject>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXObject_finalize)

bool js_register_gfx_GFXObject(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("GFXObject", obj, nullptr, _SE(js_gfx_GFXObject_constructor));

    cls->defineProperty("objectType", _SE(js_gfx_GFXObject_getObjectType), nullptr);
    cls->defineProperty("objectID", _SE(js_gfx_GFXObject_getObjectID), nullptr);
    cls->defineProperty("typedID", _SE(js_gfx_GFXObject_getTypedID), nullptr);
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXObject_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXObject>(cls);

    __jsb_cc_gfx_GFXObject_proto = cls->getProto();
    __jsb_cc_gfx_GFXObject_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_Buffer_proto = nullptr;
se::Class* __jsb_cc_gfx_Buffer_class = nullptr;

static bool js_gfx_Buffer_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Buffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Buffer_destroy)

static bool js_gfx_Buffer_getCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Buffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_getCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_getCount : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Buffer_getCount)

static bool js_gfx_Buffer_getFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Buffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_getFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getFlags());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_getFlags : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Buffer_getFlags)

static bool js_gfx_Buffer_getMemUsage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Buffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_getMemUsage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getMemUsage());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_getMemUsage : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Buffer_getMemUsage)

static bool js_gfx_Buffer_getSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Buffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_getSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getSize();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_getSize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Buffer_getSize)

static bool js_gfx_Buffer_getStride(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Buffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_getStride : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getStride();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_getStride : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Buffer_getStride)

static bool js_gfx_Buffer_getUsage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Buffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_getUsage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getUsage());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_getUsage : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Buffer_getUsage)

static bool js_gfx_Buffer_isBufferView(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Buffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_isBufferView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isBufferView();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_isBufferView : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Buffer_isBufferView)

static bool js_gfx_Buffer_resize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Buffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_resize : Error processing arguments");
        cobj->resize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Buffer_resize)

static bool js_gfx_Buffer_computeHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::BufferInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_computeHash : Error processing arguments");
        unsigned int result = cc::gfx::Buffer::computeHash(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_computeHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Buffer_computeHash)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Buffer_finalize)

static bool js_gfx_Buffer_constructor(se::State& /*s*/) // NOLINT(readability-identifier-naming) constructor.c
{
    //#3 cc::gfx::Buffer: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Buffer constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Buffer_constructor, __jsb_cc_gfx_Buffer_class, js_cc_gfx_Buffer_finalize)



static bool js_cc_gfx_Buffer_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Buffer>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::Buffer>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Buffer_finalize)

bool js_register_gfx_Buffer(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Buffer", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Buffer_constructor));

    cls->defineProperty("usage", _SE(js_gfx_Buffer_getUsage), nullptr);
    cls->defineProperty("memUsage", _SE(js_gfx_Buffer_getMemUsage), nullptr);
    cls->defineProperty("stride", _SE(js_gfx_Buffer_getStride), nullptr);
    cls->defineProperty("count", _SE(js_gfx_Buffer_getCount), nullptr);
    cls->defineProperty("size", _SE(js_gfx_Buffer_getSize), nullptr);
    cls->defineProperty("flags", _SE(js_gfx_Buffer_getFlags), nullptr);
    cls->defineFunction("destroy", _SE(js_gfx_Buffer_destroy));
    cls->defineFunction("isBufferView", _SE(js_gfx_Buffer_isBufferView));
    cls->defineFunction("resize", _SE(js_gfx_Buffer_resize));
    cls->defineStaticFunction("computeHash", _SE(js_gfx_Buffer_computeHash));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Buffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Buffer>(cls);

    __jsb_cc_gfx_Buffer_proto = cls->getProto();
    __jsb_cc_gfx_Buffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_InputAssembler_proto = nullptr;
se::Class* __jsb_cc_gfx_InputAssembler_class = nullptr;

static bool js_gfx_InputAssembler_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_InputAssembler_destroy)

static bool js_gfx_InputAssembler_getAttributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getAttributes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::Attribute>& result = cobj->getAttributes();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getAttributes : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getAttributes)

static bool js_gfx_InputAssembler_getAttributesHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getAttributesHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getAttributesHash();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getAttributesHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getAttributesHash)

static bool js_gfx_InputAssembler_getDrawInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getDrawInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::DrawInfo& result = cobj->getDrawInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getDrawInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getDrawInfo)

static bool js_gfx_InputAssembler_getFirstIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getFirstIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getFirstIndex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getFirstIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getFirstIndex)

static bool js_gfx_InputAssembler_getFirstInstance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getFirstInstance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getFirstInstance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getFirstInstance : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getFirstInstance)

static bool js_gfx_InputAssembler_getFirstVertex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getFirstVertex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getFirstVertex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getFirstVertex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getFirstVertex)

static bool js_gfx_InputAssembler_getIndexBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getIndexBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Buffer* result = cobj->getIndexBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getIndexBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getIndexBuffer)

static bool js_gfx_InputAssembler_getIndexCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getIndexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getIndexCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getIndexCount : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getIndexCount)

static bool js_gfx_InputAssembler_getIndirectBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getIndirectBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Buffer* result = cobj->getIndirectBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getIndirectBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getIndirectBuffer)

static bool js_gfx_InputAssembler_getInstanceCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getInstanceCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getInstanceCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getInstanceCount : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getInstanceCount)

static bool js_gfx_InputAssembler_getVertexBuffers(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getVertexBuffers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::Buffer *>& result = cobj->getVertexBuffers();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getVertexBuffers : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getVertexBuffers)

static bool js_gfx_InputAssembler_getVertexCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getVertexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getVertexCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getVertexCount : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getVertexCount)

static bool js_gfx_InputAssembler_getVertexOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getVertexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getVertexOffset();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getVertexOffset : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getVertexOffset)

static bool js_gfx_InputAssembler_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::InputAssemblerInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_InputAssembler_initialize)

static bool js_gfx_InputAssembler_setFirstIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setFirstIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setFirstIndex : Error processing arguments");
        cobj->setFirstIndex(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setFirstIndex)

static bool js_gfx_InputAssembler_setFirstInstance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setFirstInstance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setFirstInstance : Error processing arguments");
        cobj->setFirstInstance(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setFirstInstance)

static bool js_gfx_InputAssembler_setFirstVertex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setFirstVertex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setFirstVertex : Error processing arguments");
        cobj->setFirstVertex(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setFirstVertex)

static bool js_gfx_InputAssembler_setIndexCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setIndexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setIndexCount : Error processing arguments");
        cobj->setIndexCount(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setIndexCount)

static bool js_gfx_InputAssembler_setInstanceCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setInstanceCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setInstanceCount : Error processing arguments");
        cobj->setInstanceCount(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setInstanceCount)

static bool js_gfx_InputAssembler_setVertexCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setVertexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setVertexCount : Error processing arguments");
        cobj->setVertexCount(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setVertexCount)

static bool js_gfx_InputAssembler_setVertexOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setVertexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int32_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setVertexOffset : Error processing arguments");
        cobj->setVertexOffset(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setVertexOffset)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_InputAssembler_finalize)

static bool js_gfx_InputAssembler_constructor(se::State& /*s*/) // NOLINT(readability-identifier-naming) constructor.c
{
    //#3 cc::gfx::InputAssembler: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::InputAssembler constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_InputAssembler_constructor, __jsb_cc_gfx_InputAssembler_class, js_cc_gfx_InputAssembler_finalize)



static bool js_cc_gfx_InputAssembler_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::InputAssembler>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_InputAssembler_finalize)

bool js_register_gfx_InputAssembler(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("InputAssembler", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_InputAssembler_constructor));

    cls->defineProperty("vertexBuffers", _SE(js_gfx_InputAssembler_getVertexBuffers), nullptr);
    cls->defineProperty("attributes", _SE(js_gfx_InputAssembler_getAttributes), nullptr);
    cls->defineProperty("indexBuffer", _SE(js_gfx_InputAssembler_getIndexBuffer), nullptr);
    cls->defineProperty("indirectBuffer", _SE(js_gfx_InputAssembler_getIndirectBuffer), nullptr);
    cls->defineProperty("attributesHash", _SE(js_gfx_InputAssembler_getAttributesHash), nullptr);
    cls->defineProperty("drawInfo", _SE(js_gfx_InputAssembler_getDrawInfo), nullptr);
    cls->defineProperty("vertexCount", _SE(js_gfx_InputAssembler_getVertexCount), _SE(js_gfx_InputAssembler_setVertexCount));
    cls->defineProperty("firstVertex", _SE(js_gfx_InputAssembler_getFirstVertex), _SE(js_gfx_InputAssembler_setFirstVertex));
    cls->defineProperty("indexCount", _SE(js_gfx_InputAssembler_getIndexCount), _SE(js_gfx_InputAssembler_setIndexCount));
    cls->defineProperty("firstIndex", _SE(js_gfx_InputAssembler_getFirstIndex), _SE(js_gfx_InputAssembler_setFirstIndex));
    cls->defineProperty("vertexOffset", _SE(js_gfx_InputAssembler_getVertexOffset), _SE(js_gfx_InputAssembler_setVertexOffset));
    cls->defineProperty("instanceCount", _SE(js_gfx_InputAssembler_getInstanceCount), _SE(js_gfx_InputAssembler_setInstanceCount));
    cls->defineProperty("firstInstance", _SE(js_gfx_InputAssembler_getFirstInstance), _SE(js_gfx_InputAssembler_setFirstInstance));
    cls->defineFunction("destroy", _SE(js_gfx_InputAssembler_destroy));
    cls->defineFunction("initialize", _SE(js_gfx_InputAssembler_initialize));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_InputAssembler_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::InputAssembler>(cls);

    __jsb_cc_gfx_InputAssembler_proto = cls->getProto();
    __jsb_cc_gfx_InputAssembler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_CommandBuffer_proto = nullptr;
se::Class* __jsb_cc_gfx_CommandBuffer_class = nullptr;

static bool js_gfx_CommandBuffer_begin(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_CommandBuffer_begin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {

            cobj->begin();
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<cc::gfx::RenderPass*, false> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};
            HolderType<cc::gfx::Framebuffer*, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->begin(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<cc::gfx::RenderPass*, false> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->begin(arg0.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<cc::gfx::RenderPass*, false> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->begin(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_begin)

static bool js_gfx_CommandBuffer_beginRenderPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_CommandBuffer_beginRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 7) {
            HolderType<cc::gfx::RenderPass*, false> arg0 = {};
            HolderType<cc::gfx::Framebuffer*, false> arg1 = {};
            HolderType<cc::gfx::Rect, true> arg2 = {};
            HolderType<std::vector<cc::gfx::Color>, true> arg3 = {};
            HolderType<float, false> arg4 = {};
            HolderType<unsigned int, false> arg5 = {};
            HolderType<std::vector<cc::gfx::CommandBuffer *>, true> arg6 = {};

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
            ok &= sevalue_to_native(args[6], &arg6, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->beginRenderPass(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value(), arg6.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 8) {
            HolderType<cc::gfx::RenderPass*, false> arg0 = {};
            HolderType<cc::gfx::Framebuffer*, false> arg1 = {};
            HolderType<cc::gfx::Rect, true> arg2 = {};
            HolderType<cc::gfx::Color*, false> arg3 = {};
            HolderType<float, false> arg4 = {};
            HolderType<unsigned int, false> arg5 = {};
            HolderType<cc::gfx::CommandBuffer**, false> arg6 = {};
            HolderType<unsigned int, false> arg7 = {};

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
            ok &= sevalue_to_native(args[6], &arg6, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[7], &arg7, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->beginRenderPass(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value(), arg6.value(), arg7.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 6) {
            HolderType<cc::gfx::RenderPass*, false> arg0 = {};
            HolderType<cc::gfx::Framebuffer*, false> arg1 = {};
            HolderType<cc::gfx::Rect, true> arg2 = {};
            HolderType<std::vector<cc::gfx::Color>, true> arg3 = {};
            HolderType<float, false> arg4 = {};
            HolderType<unsigned int, false> arg5 = {};

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
            cobj->beginRenderPass(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 6) {
            HolderType<cc::gfx::RenderPass*, false> arg0 = {};
            HolderType<cc::gfx::Framebuffer*, false> arg1 = {};
            HolderType<cc::gfx::Rect, true> arg2 = {};
            HolderType<cc::gfx::Color*, false> arg3 = {};
            HolderType<float, false> arg4 = {};
            HolderType<unsigned int, false> arg5 = {};

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
            cobj->beginRenderPass(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_beginRenderPass)

static bool js_gfx_CommandBuffer_bindDescriptorSet(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_CommandBuffer_bindDescriptorSet : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<cc::gfx::DescriptorSet*, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->bindDescriptorSet(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 4) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<cc::gfx::DescriptorSet*, false> arg1 = {};
            HolderType<unsigned int, false> arg2 = {};
            HolderType<unsigned int*, false> arg3 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->bindDescriptorSet(arg0.value(), arg1.value(), arg2.value(), arg3.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<cc::gfx::DescriptorSet*, false> arg1 = {};
            HolderType<std::vector<unsigned int>, true> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->bindDescriptorSet(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_bindDescriptorSet)

static bool js_gfx_CommandBuffer_bindInputAssembler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_bindInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::InputAssembler*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_bindInputAssembler : Error processing arguments");
        cobj->bindInputAssembler(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_bindInputAssembler)

static bool js_gfx_CommandBuffer_bindPipelineState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_bindPipelineState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::PipelineState*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_bindPipelineState : Error processing arguments");
        cobj->bindPipelineState(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_bindPipelineState)

static bool js_gfx_CommandBuffer_blitTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_CommandBuffer_blitTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 4) {
            HolderType<cc::gfx::Texture*, false> arg0 = {};
            HolderType<cc::gfx::Texture*, false> arg1 = {};
            HolderType<std::vector<cc::gfx::TextureBlit>, true> arg2 = {};
            HolderType<cc::gfx::Filter, false> arg3 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->blitTexture(arg0.value(), arg1.value(), arg2.value(), arg3.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 5) {
            HolderType<cc::gfx::Texture*, false> arg0 = {};
            HolderType<cc::gfx::Texture*, false> arg1 = {};
            HolderType<cc::gfx::TextureBlit*, false> arg2 = {};
            HolderType<unsigned int, false> arg3 = {};
            HolderType<cc::gfx::Filter, false> arg4 = {};

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
            cobj->blitTexture(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_blitTexture)

static bool js_gfx_CommandBuffer_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_destroy)

static bool js_gfx_CommandBuffer_dispatch(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_dispatch : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::DispatchInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_dispatch : Error processing arguments");
        cobj->dispatch(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_dispatch)

static bool js_gfx_CommandBuffer_draw(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_CommandBuffer_draw : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<cc::gfx::InputAssembler*, false> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->draw(arg0.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<cc::gfx::DrawInfo, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->draw(arg0.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_draw)

static bool js_gfx_CommandBuffer_end(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_end : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->end();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_end)

static bool js_gfx_CommandBuffer_endRenderPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_endRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->endRenderPass();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_endRenderPass)

static bool js_gfx_CommandBuffer_getNumDrawCalls(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_getNumDrawCalls : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumDrawCalls();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_getNumDrawCalls : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_getNumDrawCalls)

static bool js_gfx_CommandBuffer_getNumInstances(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_getNumInstances : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumInstances();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_getNumInstances : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_getNumInstances)

static bool js_gfx_CommandBuffer_getNumTris(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_getNumTris : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumTris();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_getNumTris : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_getNumTris)

static bool js_gfx_CommandBuffer_getQueue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_getQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Queue* result = cobj->getQueue();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_getQueue : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_getQueue)

static bool js_gfx_CommandBuffer_getType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getType());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_getType : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_getType)

static bool js_gfx_CommandBuffer_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::CommandBufferInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_initialize)

static bool js_gfx_CommandBuffer_nextSubpass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_nextSubpass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->nextSubpass();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_nextSubpass)

static bool js_gfx_CommandBuffer_pipelineBarrier(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_CommandBuffer_pipelineBarrier : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<cc::gfx::GlobalBarrier*, false> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->pipelineBarrier(arg0.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 4) {
            HolderType<cc::gfx::GlobalBarrier*, false> arg0 = {};
            HolderType<cc::gfx::TextureBarrier**, false> arg1 = {};
            HolderType<cc::gfx::Texture**, false> arg2 = {};
            HolderType<unsigned int, false> arg3 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->pipelineBarrier(arg0.value(), arg1.value(), arg2.value(), arg3.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<cc::gfx::GlobalBarrier*, false> arg0 = {};
            HolderType<std::vector<cc::gfx::TextureBarrier *>, true> arg1 = {};
            HolderType<std::vector<cc::gfx::Texture *>, true> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->pipelineBarrier(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_pipelineBarrier)

static bool js_gfx_CommandBuffer_setBlendConstants(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setBlendConstants : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Color, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setBlendConstants : Error processing arguments");
        cobj->setBlendConstants(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setBlendConstants)

static bool js_gfx_CommandBuffer_setDepthBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setDepthBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setDepthBias : Error processing arguments");
        cobj->setDepthBias(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setDepthBias)

static bool js_gfx_CommandBuffer_setDepthBound(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setDepthBound : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setDepthBound : Error processing arguments");
        cobj->setDepthBound(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setDepthBound)

static bool js_gfx_CommandBuffer_setLineWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setLineWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setLineWidth : Error processing arguments");
        cobj->setLineWidth(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setLineWidth)

static bool js_gfx_CommandBuffer_setScissor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setScissor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Rect, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setScissor : Error processing arguments");
        cobj->setScissor(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setScissor)

static bool js_gfx_CommandBuffer_setStencilCompareMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setStencilCompareMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<cc::gfx::StencilFace, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setStencilCompareMask : Error processing arguments");
        cobj->setStencilCompareMask(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setStencilCompareMask)

static bool js_gfx_CommandBuffer_setStencilWriteMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setStencilWriteMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::gfx::StencilFace, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setStencilWriteMask : Error processing arguments");
        cobj->setStencilWriteMask(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setStencilWriteMask)

static bool js_gfx_CommandBuffer_setViewport(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setViewport : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Viewport, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setViewport : Error processing arguments");
        cobj->setViewport(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setViewport)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_CommandBuffer_finalize)

static bool js_gfx_CommandBuffer_constructor(se::State& /*s*/) // NOLINT(readability-identifier-naming) constructor.c
{
    //#3 cc::gfx::CommandBuffer: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::CommandBuffer constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_CommandBuffer_constructor, __jsb_cc_gfx_CommandBuffer_class, js_cc_gfx_CommandBuffer_finalize)



static bool js_cc_gfx_CommandBuffer_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_CommandBuffer_finalize)

bool js_register_gfx_CommandBuffer(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("CommandBuffer", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_CommandBuffer_constructor));

    cls->defineFunction("begin", _SE(js_gfx_CommandBuffer_begin));
    cls->defineFunction("beginRenderPass", _SE(js_gfx_CommandBuffer_beginRenderPass));
    cls->defineFunction("bindDescriptorSet", _SE(js_gfx_CommandBuffer_bindDescriptorSet));
    cls->defineFunction("bindInputAssembler", _SE(js_gfx_CommandBuffer_bindInputAssembler));
    cls->defineFunction("bindPipelineState", _SE(js_gfx_CommandBuffer_bindPipelineState));
    cls->defineFunction("blitTexture", _SE(js_gfx_CommandBuffer_blitTexture));
    cls->defineFunction("destroy", _SE(js_gfx_CommandBuffer_destroy));
    cls->defineFunction("dispatch", _SE(js_gfx_CommandBuffer_dispatch));
    cls->defineFunction("draw", _SE(js_gfx_CommandBuffer_draw));
    cls->defineFunction("end", _SE(js_gfx_CommandBuffer_end));
    cls->defineFunction("endRenderPass", _SE(js_gfx_CommandBuffer_endRenderPass));
    cls->defineFunction("getNumDrawCalls", _SE(js_gfx_CommandBuffer_getNumDrawCalls));
    cls->defineFunction("getNumInstances", _SE(js_gfx_CommandBuffer_getNumInstances));
    cls->defineFunction("getNumTris", _SE(js_gfx_CommandBuffer_getNumTris));
    cls->defineFunction("getQueue", _SE(js_gfx_CommandBuffer_getQueue));
    cls->defineFunction("getType", _SE(js_gfx_CommandBuffer_getType));
    cls->defineFunction("initialize", _SE(js_gfx_CommandBuffer_initialize));
    cls->defineFunction("nextSubpass", _SE(js_gfx_CommandBuffer_nextSubpass));
    cls->defineFunction("pipelineBarrier", _SE(js_gfx_CommandBuffer_pipelineBarrier));
    cls->defineFunction("setBlendConstants", _SE(js_gfx_CommandBuffer_setBlendConstants));
    cls->defineFunction("setDepthBias", _SE(js_gfx_CommandBuffer_setDepthBias));
    cls->defineFunction("setDepthBound", _SE(js_gfx_CommandBuffer_setDepthBound));
    cls->defineFunction("setLineWidth", _SE(js_gfx_CommandBuffer_setLineWidth));
    cls->defineFunction("setScissor", _SE(js_gfx_CommandBuffer_setScissor));
    cls->defineFunction("setStencilCompareMask", _SE(js_gfx_CommandBuffer_setStencilCompareMask));
    cls->defineFunction("setStencilWriteMask", _SE(js_gfx_CommandBuffer_setStencilWriteMask));
    cls->defineFunction("setViewport", _SE(js_gfx_CommandBuffer_setViewport));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_CommandBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::CommandBuffer>(cls);

    __jsb_cc_gfx_CommandBuffer_proto = cls->getProto();
    __jsb_cc_gfx_CommandBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_DescriptorSet_proto = nullptr;
se::Class* __jsb_cc_gfx_DescriptorSet_class = nullptr;

static bool js_gfx_DescriptorSet_bindBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_DescriptorSet_bindBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<cc::gfx::Buffer*, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->bindBuffer(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<cc::gfx::Buffer*, false> arg1 = {};
            HolderType<unsigned int, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->bindBuffer(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_bindBuffer)

static bool js_gfx_DescriptorSet_bindBufferJSB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSet_bindBufferJSB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<cc::gfx::Buffer*, false> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_bindBufferJSB : Error processing arguments");
        bool result = cobj->bindBufferJSB(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_bindBufferJSB : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_bindBufferJSB)

static bool js_gfx_DescriptorSet_bindSampler(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_DescriptorSet_bindSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<cc::gfx::Sampler*, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->bindSampler(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<cc::gfx::Sampler*, false> arg1 = {};
            HolderType<unsigned int, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->bindSampler(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_bindSampler)

static bool js_gfx_DescriptorSet_bindSamplerJSB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSet_bindSamplerJSB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<cc::gfx::Sampler*, false> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_bindSamplerJSB : Error processing arguments");
        bool result = cobj->bindSamplerJSB(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_bindSamplerJSB : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_bindSamplerJSB)

static bool js_gfx_DescriptorSet_bindTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_DescriptorSet_bindTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<cc::gfx::Texture*, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->bindTexture(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<cc::gfx::Texture*, false> arg1 = {};
            HolderType<unsigned int, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->bindTexture(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_bindTexture)

static bool js_gfx_DescriptorSet_bindTextureJSB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSet_bindTextureJSB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<cc::gfx::Texture*, false> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_bindTextureJSB : Error processing arguments");
        bool result = cobj->bindTextureJSB(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_bindTextureJSB : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_bindTextureJSB)

static bool js_gfx_DescriptorSet_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSet_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_destroy)

static bool js_gfx_DescriptorSet_getBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_DescriptorSet_getBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<unsigned int, false> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::gfx::Buffer* result = cobj->getBuffer(arg0.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_getBuffer : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::gfx::Buffer* result = cobj->getBuffer(arg0.value(), arg1.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_getBuffer : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_getBuffer)

static bool js_gfx_DescriptorSet_getLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSet_getLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::DescriptorSetLayout* result = cobj->getLayout();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_getLayout : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_getLayout)

static bool js_gfx_DescriptorSet_getSampler(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_DescriptorSet_getSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<unsigned int, false> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::gfx::Sampler* result = cobj->getSampler(arg0.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_getSampler : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::gfx::Sampler* result = cobj->getSampler(arg0.value(), arg1.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_getSampler : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_getSampler)

static bool js_gfx_DescriptorSet_getTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_DescriptorSet_getTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<unsigned int, false> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::gfx::Texture* result = cobj->getTexture(arg0.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_getTexture : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::gfx::Texture* result = cobj->getTexture(arg0.value(), arg1.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_getTexture : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_getTexture)

static bool js_gfx_DescriptorSet_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSet_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::DescriptorSetInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_initialize)

static bool js_gfx_DescriptorSet_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSet_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->update();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_update)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DescriptorSet_finalize)

static bool js_gfx_DescriptorSet_constructor(se::State& /*s*/) // NOLINT(readability-identifier-naming) constructor.c
{
    //#3 cc::gfx::DescriptorSet: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::DescriptorSet constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_DescriptorSet_constructor, __jsb_cc_gfx_DescriptorSet_class, js_cc_gfx_DescriptorSet_finalize)



static bool js_cc_gfx_DescriptorSet_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DescriptorSet_finalize)

bool js_register_gfx_DescriptorSet(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DescriptorSet", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_DescriptorSet_constructor));

    cls->defineFunction("bindBuffer", _SE(js_gfx_DescriptorSet_bindBuffer));
    cls->defineFunction("bindBufferJSB", _SE(js_gfx_DescriptorSet_bindBufferJSB));
    cls->defineFunction("bindSampler", _SE(js_gfx_DescriptorSet_bindSampler));
    cls->defineFunction("bindSamplerJSB", _SE(js_gfx_DescriptorSet_bindSamplerJSB));
    cls->defineFunction("bindTexture", _SE(js_gfx_DescriptorSet_bindTexture));
    cls->defineFunction("bindTextureJSB", _SE(js_gfx_DescriptorSet_bindTextureJSB));
    cls->defineFunction("destroy", _SE(js_gfx_DescriptorSet_destroy));
    cls->defineFunction("getBuffer", _SE(js_gfx_DescriptorSet_getBuffer));
    cls->defineFunction("getLayout", _SE(js_gfx_DescriptorSet_getLayout));
    cls->defineFunction("getSampler", _SE(js_gfx_DescriptorSet_getSampler));
    cls->defineFunction("getTexture", _SE(js_gfx_DescriptorSet_getTexture));
    cls->defineFunction("initialize", _SE(js_gfx_DescriptorSet_initialize));
    cls->defineFunction("update", _SE(js_gfx_DescriptorSet_update));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DescriptorSet_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DescriptorSet>(cls);

    __jsb_cc_gfx_DescriptorSet_proto = cls->getProto();
    __jsb_cc_gfx_DescriptorSet_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_DescriptorSetLayout_proto = nullptr;
se::Class* __jsb_cc_gfx_DescriptorSetLayout_class = nullptr;

static bool js_gfx_DescriptorSetLayout_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayout>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayout_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSetLayout_destroy)

static bool js_gfx_DescriptorSetLayout_getBindings(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayout>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayout_getBindings : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::DescriptorSetLayoutBinding>& result = cobj->getBindings();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayout_getBindings : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSetLayout_getBindings)

static bool js_gfx_DescriptorSetLayout_getDescriptorCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayout>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayout_getDescriptorCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getDescriptorCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayout_getDescriptorCount : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSetLayout_getDescriptorCount)

static bool js_gfx_DescriptorSetLayout_getDynamicBindings(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayout>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayout_getDynamicBindings : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<unsigned int>& result = cobj->getDynamicBindings();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayout_getDynamicBindings : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSetLayout_getDynamicBindings)

static bool js_gfx_DescriptorSetLayout_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayout>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayout_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::DescriptorSetLayoutInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayout_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSetLayout_initialize)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DescriptorSetLayout_finalize)

static bool js_gfx_DescriptorSetLayout_constructor(se::State& /*s*/) // NOLINT(readability-identifier-naming) constructor.c
{
    //#3 cc::gfx::DescriptorSetLayout: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::DescriptorSetLayout constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_DescriptorSetLayout_constructor, __jsb_cc_gfx_DescriptorSetLayout_class, js_cc_gfx_DescriptorSetLayout_finalize)



static bool js_cc_gfx_DescriptorSetLayout_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::DescriptorSetLayout>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayout>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DescriptorSetLayout_finalize)

bool js_register_gfx_DescriptorSetLayout(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DescriptorSetLayout", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_DescriptorSetLayout_constructor));

    cls->defineFunction("destroy", _SE(js_gfx_DescriptorSetLayout_destroy));
    cls->defineFunction("getBindings", _SE(js_gfx_DescriptorSetLayout_getBindings));
    cls->defineFunction("getDescriptorCount", _SE(js_gfx_DescriptorSetLayout_getDescriptorCount));
    cls->defineFunction("getDynamicBindings", _SE(js_gfx_DescriptorSetLayout_getDynamicBindings));
    cls->defineFunction("initialize", _SE(js_gfx_DescriptorSetLayout_initialize));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DescriptorSetLayout_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DescriptorSetLayout>(cls);

    __jsb_cc_gfx_DescriptorSetLayout_proto = cls->getProto();
    __jsb_cc_gfx_DescriptorSetLayout_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_Framebuffer_proto = nullptr;
se::Class* __jsb_cc_gfx_Framebuffer_class = nullptr;

static bool js_gfx_Framebuffer_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Framebuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Framebuffer_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Framebuffer_destroy)

static bool js_gfx_Framebuffer_getColorTextures(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Framebuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Framebuffer_getColorTextures : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::Texture *>& result = cobj->getColorTextures();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Framebuffer_getColorTextures : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Framebuffer_getColorTextures)

static bool js_gfx_Framebuffer_getDepthStencilTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Framebuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Framebuffer_getDepthStencilTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Texture* result = cobj->getDepthStencilTexture();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Framebuffer_getDepthStencilTexture : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Framebuffer_getDepthStencilTexture)

static bool js_gfx_Framebuffer_getRenderPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Framebuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Framebuffer_getRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::RenderPass* result = cobj->getRenderPass();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Framebuffer_getRenderPass : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Framebuffer_getRenderPass)

static bool js_gfx_Framebuffer_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Framebuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Framebuffer_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::FramebufferInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Framebuffer_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Framebuffer_initialize)

static bool js_gfx_Framebuffer_computeHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::FramebufferInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_gfx_Framebuffer_computeHash : Error processing arguments");
        unsigned int result = cc::gfx::Framebuffer::computeHash(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Framebuffer_computeHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Framebuffer_computeHash)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Framebuffer_finalize)

static bool js_gfx_Framebuffer_constructor(se::State& /*s*/) // NOLINT(readability-identifier-naming) constructor.c
{
    //#3 cc::gfx::Framebuffer: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Framebuffer constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Framebuffer_constructor, __jsb_cc_gfx_Framebuffer_class, js_cc_gfx_Framebuffer_finalize)



static bool js_cc_gfx_Framebuffer_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Framebuffer>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::Framebuffer>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Framebuffer_finalize)

bool js_register_gfx_Framebuffer(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Framebuffer", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Framebuffer_constructor));

    cls->defineProperty("renderPass", _SE(js_gfx_Framebuffer_getRenderPass), nullptr);
    cls->defineProperty("colorTextures", _SE(js_gfx_Framebuffer_getColorTextures), nullptr);
    cls->defineProperty("depthStencilTexture", _SE(js_gfx_Framebuffer_getDepthStencilTexture), nullptr);
    cls->defineFunction("destroy", _SE(js_gfx_Framebuffer_destroy));
    cls->defineFunction("initialize", _SE(js_gfx_Framebuffer_initialize));
    cls->defineStaticFunction("computeHash", _SE(js_gfx_Framebuffer_computeHash));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Framebuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Framebuffer>(cls);

    __jsb_cc_gfx_Framebuffer_proto = cls->getProto();
    __jsb_cc_gfx_Framebuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_PipelineLayout_proto = nullptr;
se::Class* __jsb_cc_gfx_PipelineLayout_class = nullptr;

static bool js_gfx_PipelineLayout_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineLayout>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineLayout_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineLayout_destroy)

static bool js_gfx_PipelineLayout_getSetLayouts(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineLayout>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineLayout_getSetLayouts : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::DescriptorSetLayout *>& result = cobj->getSetLayouts();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineLayout_getSetLayouts : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineLayout_getSetLayouts)

static bool js_gfx_PipelineLayout_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineLayout>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineLayout_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::PipelineLayoutInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineLayout_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineLayout_initialize)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_PipelineLayout_finalize)

static bool js_gfx_PipelineLayout_constructor(se::State& /*s*/) // NOLINT(readability-identifier-naming) constructor.c
{
    //#3 cc::gfx::PipelineLayout: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::PipelineLayout constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_PipelineLayout_constructor, __jsb_cc_gfx_PipelineLayout_class, js_cc_gfx_PipelineLayout_finalize)



static bool js_cc_gfx_PipelineLayout_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::PipelineLayout>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineLayout>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_PipelineLayout_finalize)

bool js_register_gfx_PipelineLayout(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("PipelineLayout", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_PipelineLayout_constructor));

    cls->defineFunction("destroy", _SE(js_gfx_PipelineLayout_destroy));
    cls->defineFunction("getSetLayouts", _SE(js_gfx_PipelineLayout_getSetLayouts));
    cls->defineFunction("initialize", _SE(js_gfx_PipelineLayout_initialize));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_PipelineLayout_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::PipelineLayout>(cls);

    __jsb_cc_gfx_PipelineLayout_proto = cls->getProto();
    __jsb_cc_gfx_PipelineLayout_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_PipelineState_proto = nullptr;
se::Class* __jsb_cc_gfx_PipelineState_class = nullptr;

static bool js_gfx_PipelineState_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineState_destroy)

static bool js_gfx_PipelineState_getBindPoint(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getBindPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getBindPoint());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getBindPoint : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getBindPoint)

static bool js_gfx_PipelineState_getBlendState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getBlendState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::BlendState& result = cobj->getBlendState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getBlendState : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getBlendState)

static bool js_gfx_PipelineState_getDepthStencilState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getDepthStencilState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::DepthStencilState& result = cobj->getDepthStencilState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getDepthStencilState : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getDepthStencilState)

static bool js_gfx_PipelineState_getDynamicStates(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getDynamicStates : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getDynamicStates());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getDynamicStates : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineState_getDynamicStates)

static bool js_gfx_PipelineState_getInputState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getInputState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::InputState& result = cobj->getInputState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getInputState : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getInputState)

static bool js_gfx_PipelineState_getPipelineLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getPipelineLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::PipelineLayout* result = cobj->getPipelineLayout();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getPipelineLayout : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineState_getPipelineLayout)

static bool js_gfx_PipelineState_getPrimitive(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getPrimitive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getPrimitive());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getPrimitive : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getPrimitive)

static bool js_gfx_PipelineState_getRasterizerState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getRasterizerState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::RasterizerState& result = cobj->getRasterizerState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getRasterizerState : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getRasterizerState)

static bool js_gfx_PipelineState_getRenderPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::RenderPass* result = cobj->getRenderPass();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getRenderPass : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getRenderPass)

static bool js_gfx_PipelineState_getShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Shader* result = cobj->getShader();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getShader : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getShader)

static bool js_gfx_PipelineState_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::PipelineStateInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineState_initialize)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_PipelineState_finalize)

static bool js_gfx_PipelineState_constructor(se::State& /*s*/) // NOLINT(readability-identifier-naming) constructor.c
{
    //#3 cc::gfx::PipelineState: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::PipelineState constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_PipelineState_constructor, __jsb_cc_gfx_PipelineState_class, js_cc_gfx_PipelineState_finalize)



static bool js_cc_gfx_PipelineState_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::PipelineState>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_PipelineState_finalize)

bool js_register_gfx_PipelineState(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("PipelineState", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_PipelineState_constructor));

    cls->defineProperty("shader", _SE(js_gfx_PipelineState_getShader), nullptr);
    cls->defineProperty("primitive", _SE(js_gfx_PipelineState_getPrimitive), nullptr);
    cls->defineProperty("bindPoint", _SE(js_gfx_PipelineState_getBindPoint), nullptr);
    cls->defineProperty("inputState", _SE(js_gfx_PipelineState_getInputState), nullptr);
    cls->defineProperty("rasterizerState", _SE(js_gfx_PipelineState_getRasterizerState), nullptr);
    cls->defineProperty("depthStencilState", _SE(js_gfx_PipelineState_getDepthStencilState), nullptr);
    cls->defineProperty("blendState", _SE(js_gfx_PipelineState_getBlendState), nullptr);
    cls->defineProperty("renderPass", _SE(js_gfx_PipelineState_getRenderPass), nullptr);
    cls->defineFunction("destroy", _SE(js_gfx_PipelineState_destroy));
    cls->defineFunction("getDynamicStates", _SE(js_gfx_PipelineState_getDynamicStates));
    cls->defineFunction("getPipelineLayout", _SE(js_gfx_PipelineState_getPipelineLayout));
    cls->defineFunction("initialize", _SE(js_gfx_PipelineState_initialize));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_PipelineState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::PipelineState>(cls);

    __jsb_cc_gfx_PipelineState_proto = cls->getProto();
    __jsb_cc_gfx_PipelineState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_Queue_proto = nullptr;
se::Class* __jsb_cc_gfx_Queue_class = nullptr;

static bool js_gfx_Queue_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Queue>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Queue_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Queue_destroy)

static bool js_gfx_Queue_getType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Queue>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Queue_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getType());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Queue_getType : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Queue_getType)

static bool js_gfx_Queue_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Queue>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Queue_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::QueueInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Queue_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Queue_initialize)

static bool js_gfx_Queue_submit(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Queue>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_Queue_submit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<std::vector<cc::gfx::CommandBuffer *>, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->submit(arg0.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<cc::gfx::CommandBuffer**, false> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->submit(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_Queue_submit)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Queue_finalize)

static bool js_gfx_Queue_constructor(se::State& /*s*/) // NOLINT(readability-identifier-naming) constructor.c
{
    //#3 cc::gfx::Queue: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Queue constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Queue_constructor, __jsb_cc_gfx_Queue_class, js_cc_gfx_Queue_finalize)



static bool js_cc_gfx_Queue_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Queue>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::Queue>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Queue_finalize)

bool js_register_gfx_Queue(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Queue", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Queue_constructor));

    cls->defineProperty("type", _SE(js_gfx_Queue_getType), nullptr);
    cls->defineFunction("destroy", _SE(js_gfx_Queue_destroy));
    cls->defineFunction("initialize", _SE(js_gfx_Queue_initialize));
    cls->defineFunction("submit", _SE(js_gfx_Queue_submit));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Queue_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Queue>(cls);

    __jsb_cc_gfx_Queue_proto = cls->getProto();
    __jsb_cc_gfx_Queue_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_RenderPass_proto = nullptr;
se::Class* __jsb_cc_gfx_RenderPass_class = nullptr;

static bool js_gfx_RenderPass_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RenderPass>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPass_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_RenderPass_destroy)

static bool js_gfx_RenderPass_getDependencies(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RenderPass>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPass_getDependencies : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::SubpassDependency>& result = cobj->getDependencies();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_getDependencies : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_RenderPass_getDependencies)

static bool js_gfx_RenderPass_getDepthStencilAttachment(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RenderPass>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPass_getDepthStencilAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::DepthStencilAttachment& result = cobj->getDepthStencilAttachment();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_getDepthStencilAttachment : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_RenderPass_getDepthStencilAttachment)

static bool js_gfx_RenderPass_getHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RenderPass>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPass_getHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHash();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_getHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_RenderPass_getHash)

static bool js_gfx_RenderPass_getSubpasses(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RenderPass>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPass_getSubpasses : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::SubpassInfo>& result = cobj->getSubpasses();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_getSubpasses : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_RenderPass_getSubpasses)

static bool js_gfx_RenderPass_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::RenderPass>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPass_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::RenderPassInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_RenderPass_initialize)

static bool js_gfx_RenderPass_computeHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::RenderPassInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_computeHash : Error processing arguments");
        unsigned int result = cc::gfx::RenderPass::computeHash(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_computeHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_RenderPass_computeHash)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_RenderPass_finalize)

static bool js_gfx_RenderPass_constructor(se::State& /*s*/) // NOLINT(readability-identifier-naming) constructor.c
{
    //#3 cc::gfx::RenderPass: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::RenderPass constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_RenderPass_constructor, __jsb_cc_gfx_RenderPass_class, js_cc_gfx_RenderPass_finalize)



static bool js_cc_gfx_RenderPass_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::RenderPass>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::RenderPass>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_RenderPass_finalize)

bool js_register_gfx_RenderPass(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RenderPass", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_RenderPass_constructor));

    cls->defineProperty("hash", _SE(js_gfx_RenderPass_getHash), nullptr);
    cls->defineFunction("destroy", _SE(js_gfx_RenderPass_destroy));
    cls->defineFunction("getDependencies", _SE(js_gfx_RenderPass_getDependencies));
    cls->defineFunction("getDepthStencilAttachment", _SE(js_gfx_RenderPass_getDepthStencilAttachment));
    cls->defineFunction("getSubpasses", _SE(js_gfx_RenderPass_getSubpasses));
    cls->defineFunction("initialize", _SE(js_gfx_RenderPass_initialize));
    cls->defineStaticFunction("computeHash", _SE(js_gfx_RenderPass_computeHash));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_RenderPass_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::RenderPass>(cls);

    __jsb_cc_gfx_RenderPass_proto = cls->getProto();
    __jsb_cc_gfx_RenderPass_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_Shader_proto = nullptr;
se::Class* __jsb_cc_gfx_Shader_class = nullptr;

static bool js_gfx_Shader_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Shader_destroy)

static bool js_gfx_Shader_getAttributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getAttributes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::Attribute>& result = cobj->getAttributes();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getAttributes : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Shader_getAttributes)

static bool js_gfx_Shader_getBlocks(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getBlocks : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::UniformBlock>& result = cobj->getBlocks();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getBlocks : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Shader_getBlocks)

static bool js_gfx_Shader_getBuffers(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getBuffers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::UniformStorageBuffer>& result = cobj->getBuffers();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getBuffers : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Shader_getBuffers)

static bool js_gfx_Shader_getImages(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getImages : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::UniformStorageImage>& result = cobj->getImages();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getImages : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Shader_getImages)

static bool js_gfx_Shader_getName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::String& result = cobj->getName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Shader_getName)

static bool js_gfx_Shader_getSamplerTextures(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getSamplerTextures : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::UniformSamplerTexture>& result = cobj->getSamplerTextures();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getSamplerTextures : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Shader_getSamplerTextures)

static bool js_gfx_Shader_getSamplers(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getSamplers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::UniformSampler>& result = cobj->getSamplers();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getSamplers : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Shader_getSamplers)

static bool js_gfx_Shader_getStages(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getStages : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::ShaderStage>& result = cobj->getStages();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getStages : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Shader_getStages)

static bool js_gfx_Shader_getSubpassInputs(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getSubpassInputs : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::UniformInputAttachment>& result = cobj->getSubpassInputs();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getSubpassInputs : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Shader_getSubpassInputs)

static bool js_gfx_Shader_getTextures(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getTextures : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::UniformTexture>& result = cobj->getTextures();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getTextures : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Shader_getTextures)

static bool js_gfx_Shader_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::ShaderInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Shader_initialize)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Shader_finalize)

static bool js_gfx_Shader_constructor(se::State& /*s*/) // NOLINT(readability-identifier-naming) constructor.c
{
    //#3 cc::gfx::Shader: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Shader constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Shader_constructor, __jsb_cc_gfx_Shader_class, js_cc_gfx_Shader_finalize)



static bool js_cc_gfx_Shader_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Shader>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Shader_finalize)

bool js_register_gfx_Shader(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Shader", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Shader_constructor));

    cls->defineProperty("name", _SE(js_gfx_Shader_getName), nullptr);
    cls->defineProperty("stages", _SE(js_gfx_Shader_getStages), nullptr);
    cls->defineProperty("attributes", _SE(js_gfx_Shader_getAttributes), nullptr);
    cls->defineProperty("blocks", _SE(js_gfx_Shader_getBlocks), nullptr);
    cls->defineProperty("samplers", _SE(js_gfx_Shader_getSamplers), nullptr);
    cls->defineFunction("destroy", _SE(js_gfx_Shader_destroy));
    cls->defineFunction("getBuffers", _SE(js_gfx_Shader_getBuffers));
    cls->defineFunction("getImages", _SE(js_gfx_Shader_getImages));
    cls->defineFunction("getSamplerTextures", _SE(js_gfx_Shader_getSamplerTextures));
    cls->defineFunction("getSubpassInputs", _SE(js_gfx_Shader_getSubpassInputs));
    cls->defineFunction("getTextures", _SE(js_gfx_Shader_getTextures));
    cls->defineFunction("initialize", _SE(js_gfx_Shader_initialize));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Shader_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Shader>(cls);

    __jsb_cc_gfx_Shader_proto = cls->getProto();
    __jsb_cc_gfx_Shader_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_Texture_proto = nullptr;
se::Class* __jsb_cc_gfx_Texture_class = nullptr;

static bool js_gfx_Texture_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Texture_destroy)

static bool js_gfx_Texture_getFormat(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getFormat());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getFormat : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getFormat)

static bool js_gfx_Texture_getHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHash();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getHash)

static bool js_gfx_Texture_getHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHeight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getHeight : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getHeight)

static bool js_gfx_Texture_getInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::TextureInfo& result = cobj->getInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getInfo)

static bool js_gfx_Texture_getSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getSize();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getSize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getSize)

static bool js_gfx_Texture_getViewInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getViewInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::TextureViewInfo& result = cobj->getViewInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getViewInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getViewInfo)

static bool js_gfx_Texture_getWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getWidth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getWidth : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getWidth)

static bool js_gfx_Texture_isTextureView(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_isTextureView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isTextureView();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_isTextureView : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Texture_isTextureView)

static bool js_gfx_Texture_resize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_resize : Error processing arguments");
        cobj->resize(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_Texture_resize)

static bool js_gfx_Texture_computeHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<cc::gfx::TextureViewInfo, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            unsigned int result = cc::gfx::Texture::computeHash(arg0.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_gfx_Texture_computeHash : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while (false);
    do {
        if (argc == 1) {
            HolderType<cc::gfx::TextureInfo, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            unsigned int result = cc::gfx::Texture::computeHash(arg0.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_gfx_Texture_computeHash : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_Texture_computeHash)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Texture_finalize)

static bool js_gfx_Texture_constructor(se::State& /*s*/) // NOLINT(readability-identifier-naming) constructor.c
{
    //#3 cc::gfx::Texture: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Texture constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Texture_constructor, __jsb_cc_gfx_Texture_class, js_cc_gfx_Texture_finalize)



static bool js_cc_gfx_Texture_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Texture>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Texture_finalize)

bool js_register_gfx_Texture(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Texture", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Texture_constructor));

    cls->defineProperty("info", _SE(js_gfx_Texture_getInfo), nullptr);
    cls->defineProperty("viewInfo", _SE(js_gfx_Texture_getViewInfo), nullptr);
    cls->defineProperty("width", _SE(js_gfx_Texture_getWidth), nullptr);
    cls->defineProperty("height", _SE(js_gfx_Texture_getHeight), nullptr);
    cls->defineProperty("format", _SE(js_gfx_Texture_getFormat), nullptr);
    cls->defineProperty("size", _SE(js_gfx_Texture_getSize), nullptr);
    cls->defineProperty("hash", _SE(js_gfx_Texture_getHash), nullptr);
    cls->defineFunction("destroy", _SE(js_gfx_Texture_destroy));
    cls->defineFunction("isTextureView", _SE(js_gfx_Texture_isTextureView));
    cls->defineFunction("resize", _SE(js_gfx_Texture_resize));
    cls->defineStaticFunction("computeHash", _SE(js_gfx_Texture_computeHash));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Texture_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Texture>(cls);

    __jsb_cc_gfx_Texture_proto = cls->getProto();
    __jsb_cc_gfx_Texture_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_Swapchain_proto = nullptr;
se::Class* __jsb_cc_gfx_Swapchain_class = nullptr;

static bool js_gfx_Swapchain_createSurface(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Swapchain>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Swapchain_createSurface : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<void*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Swapchain_createSurface : Error processing arguments");
        cobj->createSurface(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Swapchain_createSurface)

static bool js_gfx_Swapchain_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Swapchain>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Swapchain_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Swapchain_destroy)

static bool js_gfx_Swapchain_destroySurface(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Swapchain>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Swapchain_destroySurface : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroySurface();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Swapchain_destroySurface)

static bool js_gfx_Swapchain_getColorTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Swapchain>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Swapchain_getColorTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Texture* result = cobj->getColorTexture();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Swapchain_getColorTexture : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Swapchain_getColorTexture)

static bool js_gfx_Swapchain_getDepthStencilTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Swapchain>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Swapchain_getDepthStencilTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Texture* result = cobj->getDepthStencilTexture();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Swapchain_getDepthStencilTexture : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Swapchain_getDepthStencilTexture)

static bool js_gfx_Swapchain_getHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Swapchain>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Swapchain_getHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHeight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Swapchain_getHeight : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Swapchain_getHeight)

static bool js_gfx_Swapchain_getSurfaceTransform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Swapchain>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Swapchain_getSurfaceTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getSurfaceTransform());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Swapchain_getSurfaceTransform : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Swapchain_getSurfaceTransform)

static bool js_gfx_Swapchain_getVSyncMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Swapchain>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Swapchain_getVSyncMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getVSyncMode());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Swapchain_getVSyncMode : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Swapchain_getVSyncMode)

static bool js_gfx_Swapchain_getWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Swapchain>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Swapchain_getWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getWidth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Swapchain_getWidth : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Swapchain_getWidth)

static bool js_gfx_Swapchain_getWindowHandle(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Swapchain>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Swapchain_getWindowHandle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        void* result = cobj->getWindowHandle();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Swapchain_getWindowHandle : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Swapchain_getWindowHandle)

static bool js_gfx_Swapchain_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Swapchain>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Swapchain_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::SwapchainInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Swapchain_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Swapchain_initialize)

static bool js_gfx_Swapchain_resize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Swapchain>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Swapchain_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        HolderType<cc::gfx::SurfaceTransform, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Swapchain_resize : Error processing arguments");
        cobj->resize(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_Swapchain_resize)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Swapchain_finalize)

static bool js_gfx_Swapchain_constructor(se::State& /*s*/) // NOLINT(readability-identifier-naming) constructor.c
{
    //#3 cc::gfx::Swapchain: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Swapchain constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Swapchain_constructor, __jsb_cc_gfx_Swapchain_class, js_cc_gfx_Swapchain_finalize)



static bool js_cc_gfx_Swapchain_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Swapchain>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::Swapchain>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Swapchain_finalize)

bool js_register_gfx_Swapchain(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Swapchain", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Swapchain_constructor));

    cls->defineProperty("width", _SE(js_gfx_Swapchain_getWidth), nullptr);
    cls->defineProperty("height", _SE(js_gfx_Swapchain_getHeight), nullptr);
    cls->defineProperty("surfaceTransform", _SE(js_gfx_Swapchain_getSurfaceTransform), nullptr);
    cls->defineProperty("colorTexture", _SE(js_gfx_Swapchain_getColorTexture), nullptr);
    cls->defineProperty("depthStencilTexture", _SE(js_gfx_Swapchain_getDepthStencilTexture), nullptr);
    cls->defineFunction("createSurface", _SE(js_gfx_Swapchain_createSurface));
    cls->defineFunction("destroy", _SE(js_gfx_Swapchain_destroy));
    cls->defineFunction("destroySurface", _SE(js_gfx_Swapchain_destroySurface));
    cls->defineFunction("getVSyncMode", _SE(js_gfx_Swapchain_getVSyncMode));
    cls->defineFunction("getWindowHandle", _SE(js_gfx_Swapchain_getWindowHandle));
    cls->defineFunction("initialize", _SE(js_gfx_Swapchain_initialize));
    cls->defineFunction("resize", _SE(js_gfx_Swapchain_resize));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Swapchain_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Swapchain>(cls);

    __jsb_cc_gfx_Swapchain_proto = cls->getProto();
    __jsb_cc_gfx_Swapchain_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_GlobalBarrier_proto = nullptr;
se::Class* __jsb_cc_gfx_GlobalBarrier_class = nullptr;

static bool js_gfx_GlobalBarrier_getHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::GlobalBarrier>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_GlobalBarrier_getHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const unsigned int& result = cobj->getHash();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_GlobalBarrier_getHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GlobalBarrier_getHash)

static bool js_gfx_GlobalBarrier_getInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::GlobalBarrier>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_GlobalBarrier_getInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::GlobalBarrierInfo& result = cobj->getInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_GlobalBarrier_getInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_GlobalBarrier_getInfo)

static bool js_gfx_GlobalBarrier_computeHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::GlobalBarrierInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_gfx_GlobalBarrier_computeHash : Error processing arguments");
        unsigned int result = cc::gfx::GlobalBarrier::computeHash(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_GlobalBarrier_computeHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_GlobalBarrier_computeHash)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GlobalBarrier_finalize)

static bool js_gfx_GlobalBarrier_constructor(se::State& /*s*/) // NOLINT(readability-identifier-naming) constructor.c
{
    //#3 cc::gfx::GlobalBarrier: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::GlobalBarrier constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_GlobalBarrier_constructor, __jsb_cc_gfx_GlobalBarrier_class, js_cc_gfx_GlobalBarrier_finalize)



static bool js_cc_gfx_GlobalBarrier_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::GlobalBarrier>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::GlobalBarrier>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GlobalBarrier_finalize)

bool js_register_gfx_GlobalBarrier(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("GlobalBarrier", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_GlobalBarrier_constructor));

    cls->defineFunction("getHash", _SE(js_gfx_GlobalBarrier_getHash));
    cls->defineFunction("getInfo", _SE(js_gfx_GlobalBarrier_getInfo));
    cls->defineStaticFunction("computeHash", _SE(js_gfx_GlobalBarrier_computeHash));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GlobalBarrier_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GlobalBarrier>(cls);

    __jsb_cc_gfx_GlobalBarrier_proto = cls->getProto();
    __jsb_cc_gfx_GlobalBarrier_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_Sampler_proto = nullptr;
se::Class* __jsb_cc_gfx_Sampler_class = nullptr;

static bool js_gfx_Sampler_getHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Sampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const unsigned int& result = cobj->getHash();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Sampler_getHash)

static bool js_gfx_Sampler_getInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Sampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::SamplerInfo& result = cobj->getInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getInfo)

static bool js_gfx_Sampler_computeHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::SamplerInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_computeHash : Error processing arguments");
        unsigned int result = cc::gfx::Sampler::computeHash(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_computeHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Sampler_computeHash)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Sampler_finalize)

static bool js_gfx_Sampler_constructor(se::State& /*s*/) // NOLINT(readability-identifier-naming) constructor.c
{
    //#3 cc::gfx::Sampler: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Sampler constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Sampler_constructor, __jsb_cc_gfx_Sampler_class, js_cc_gfx_Sampler_finalize)



static bool js_cc_gfx_Sampler_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Sampler>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::Sampler>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Sampler_finalize)

bool js_register_gfx_Sampler(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Sampler", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Sampler_constructor));

    cls->defineProperty("info", _SE(js_gfx_Sampler_getInfo), nullptr);
    cls->defineFunction("getHash", _SE(js_gfx_Sampler_getHash));
    cls->defineStaticFunction("computeHash", _SE(js_gfx_Sampler_computeHash));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Sampler_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Sampler>(cls);

    __jsb_cc_gfx_Sampler_proto = cls->getProto();
    __jsb_cc_gfx_Sampler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_TextureBarrier_proto = nullptr;
se::Class* __jsb_cc_gfx_TextureBarrier_class = nullptr;

static bool js_gfx_TextureBarrier_getHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBarrier>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBarrier_getHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const unsigned int& result = cobj->getHash();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_TextureBarrier_getHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_TextureBarrier_getHash)

static bool js_gfx_TextureBarrier_getInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBarrier>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureBarrier_getInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::TextureBarrierInfo& result = cobj->getInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_TextureBarrier_getInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_TextureBarrier_getInfo)

static bool js_gfx_TextureBarrier_computeHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::TextureBarrierInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_gfx_TextureBarrier_computeHash : Error processing arguments");
        unsigned int result = cc::gfx::TextureBarrier::computeHash(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_TextureBarrier_computeHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_TextureBarrier_computeHash)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_TextureBarrier_finalize)

static bool js_gfx_TextureBarrier_constructor(se::State& /*s*/) // NOLINT(readability-identifier-naming) constructor.c
{
    //#3 cc::gfx::TextureBarrier: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::TextureBarrier constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_TextureBarrier_constructor, __jsb_cc_gfx_TextureBarrier_class, js_cc_gfx_TextureBarrier_finalize)



static bool js_cc_gfx_TextureBarrier_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::TextureBarrier>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::TextureBarrier>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_TextureBarrier_finalize)

bool js_register_gfx_TextureBarrier(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TextureBarrier", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_TextureBarrier_constructor));

    cls->defineFunction("getHash", _SE(js_gfx_TextureBarrier_getHash));
    cls->defineFunction("getInfo", _SE(js_gfx_TextureBarrier_getInfo));
    cls->defineStaticFunction("computeHash", _SE(js_gfx_TextureBarrier_computeHash));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_TextureBarrier_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::TextureBarrier>(cls);

    __jsb_cc_gfx_TextureBarrier_proto = cls->getProto();
    __jsb_cc_gfx_TextureBarrier_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_Device_proto = nullptr;
se::Class* __jsb_cc_gfx_Device_class = nullptr;

static bool js_gfx_Device_acquire(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_Device_acquire : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<std::vector<cc::gfx::Swapchain *>, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->acquire(arg0.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<cc::gfx::Swapchain**, false> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->acquire(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_acquire)

static bool js_gfx_Device_bindingMappingInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_bindingMappingInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::BindingMappingInfo& result = cobj->bindingMappingInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_bindingMappingInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_bindingMappingInfo)

static bool js_gfx_Device_createCommandBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createCommandBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::CommandBufferInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createCommandBuffer : Error processing arguments");
        cc::gfx::CommandBuffer* result = cobj->createCommandBuffer(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createCommandBuffer : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createCommandBuffer)

static bool js_gfx_Device_createDescriptorSet(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createDescriptorSet : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::DescriptorSetInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createDescriptorSet : Error processing arguments");
        cc::gfx::DescriptorSet* result = cobj->createDescriptorSet(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createDescriptorSet : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createDescriptorSet)

static bool js_gfx_Device_createDescriptorSetLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createDescriptorSetLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::DescriptorSetLayoutInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createDescriptorSetLayout : Error processing arguments");
        cc::gfx::DescriptorSetLayout* result = cobj->createDescriptorSetLayout(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createDescriptorSetLayout : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createDescriptorSetLayout)

static bool js_gfx_Device_createFramebuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createFramebuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::FramebufferInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createFramebuffer : Error processing arguments");
        cc::gfx::Framebuffer* result = cobj->createFramebuffer(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createFramebuffer : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createFramebuffer)

static bool js_gfx_Device_createInputAssembler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::InputAssemblerInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createInputAssembler : Error processing arguments");
        cc::gfx::InputAssembler* result = cobj->createInputAssembler(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createInputAssembler : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createInputAssembler)

static bool js_gfx_Device_createPipelineLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createPipelineLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::PipelineLayoutInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createPipelineLayout : Error processing arguments");
        cc::gfx::PipelineLayout* result = cobj->createPipelineLayout(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createPipelineLayout : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createPipelineLayout)

static bool js_gfx_Device_createPipelineState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createPipelineState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::PipelineStateInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createPipelineState : Error processing arguments");
        cc::gfx::PipelineState* result = cobj->createPipelineState(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createPipelineState : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createPipelineState)

static bool js_gfx_Device_createQueue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::QueueInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createQueue : Error processing arguments");
        cc::gfx::Queue* result = cobj->createQueue(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createQueue : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createQueue)

static bool js_gfx_Device_createRenderPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::RenderPassInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createRenderPass : Error processing arguments");
        cc::gfx::RenderPass* result = cobj->createRenderPass(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createRenderPass : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createRenderPass)

static bool js_gfx_Device_createShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::ShaderInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createShader : Error processing arguments");
        cc::gfx::Shader* result = cobj->createShader(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createShader : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createShader)

static bool js_gfx_Device_createSwapchain(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createSwapchain : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::SwapchainInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createSwapchain : Error processing arguments");
        cc::gfx::Swapchain* result = cobj->createSwapchain(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createSwapchain : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createSwapchain)

static bool js_gfx_Device_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_destroy)

static bool js_gfx_Device_flushCommands(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_Device_flushCommands : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<std::vector<cc::gfx::CommandBuffer *>, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->flushCommands(arg0.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<cc::gfx::CommandBuffer**, false> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->flushCommands(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_flushCommands)

static bool js_gfx_Device_getCapabilities(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getCapabilities : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::DeviceCaps& result = cobj->getCapabilities();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getCapabilities : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getCapabilities)

static bool js_gfx_Device_getCommandBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getCommandBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::CommandBuffer* result = cobj->getCommandBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getCommandBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getCommandBuffer)

static bool js_gfx_Device_getDeviceName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getDeviceName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::String& result = cobj->getDeviceName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getDeviceName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getDeviceName)

static bool js_gfx_Device_getGfxAPI(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getGfxAPI : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getGfxAPI());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getGfxAPI : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getGfxAPI)

static bool js_gfx_Device_getGlobalBarrier(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getGlobalBarrier : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::GlobalBarrierInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getGlobalBarrier : Error processing arguments");
        cc::gfx::GlobalBarrier* result = cobj->getGlobalBarrier(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getGlobalBarrier : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_getGlobalBarrier)

static bool js_gfx_Device_getMemoryStatus(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMemoryStatus : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::MemoryStatus& result = cobj->getMemoryStatus();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMemoryStatus : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMemoryStatus)

static bool js_gfx_Device_getNumDrawCalls(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getNumDrawCalls : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumDrawCalls();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getNumDrawCalls : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getNumDrawCalls)

static bool js_gfx_Device_getNumInstances(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getNumInstances : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumInstances();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getNumInstances : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getNumInstances)

static bool js_gfx_Device_getNumTris(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getNumTris : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumTris();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getNumTris : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getNumTris)

static bool js_gfx_Device_getQueue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Queue* result = cobj->getQueue();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getQueue : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getQueue)

static bool js_gfx_Device_getRenderer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getRenderer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::String& result = cobj->getRenderer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getRenderer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getRenderer)

static bool js_gfx_Device_getSampler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::SamplerInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getSampler : Error processing arguments");
        cc::gfx::Sampler* result = cobj->getSampler(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getSampler : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_getSampler)

static bool js_gfx_Device_getTextureBarrier(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getTextureBarrier : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::TextureBarrierInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getTextureBarrier : Error processing arguments");
        cc::gfx::TextureBarrier* result = cobj->getTextureBarrier(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getTextureBarrier : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_getTextureBarrier)

static bool js_gfx_Device_getVendor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getVendor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::String& result = cobj->getVendor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getVendor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getVendor)

static bool js_gfx_Device_hasFeature(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_hasFeature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Feature, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_hasFeature : Error processing arguments");
        bool result = cobj->hasFeature(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_hasFeature : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_hasFeature)

static bool js_gfx_Device_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::DeviceInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_initialize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_initialize)

static bool js_gfx_Device_present(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_present : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->present();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_present)



bool js_register_gfx_Device(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Device", obj, nullptr, nullptr);

    cls->defineProperty("gfxAPI", _SE(js_gfx_Device_getGfxAPI), nullptr);
    cls->defineProperty("deviceName", _SE(js_gfx_Device_getDeviceName), nullptr);
    cls->defineProperty("memoryStatus", _SE(js_gfx_Device_getMemoryStatus), nullptr);
    cls->defineProperty("queue", _SE(js_gfx_Device_getQueue), nullptr);
    cls->defineProperty("commandBuffer", _SE(js_gfx_Device_getCommandBuffer), nullptr);
    cls->defineProperty("renderer", _SE(js_gfx_Device_getRenderer), nullptr);
    cls->defineProperty("vendor", _SE(js_gfx_Device_getVendor), nullptr);
    cls->defineProperty("numDrawCalls", _SE(js_gfx_Device_getNumDrawCalls), nullptr);
    cls->defineProperty("numInstances", _SE(js_gfx_Device_getNumInstances), nullptr);
    cls->defineProperty("numTris", _SE(js_gfx_Device_getNumTris), nullptr);
    cls->defineProperty("capabilities", _SE(js_gfx_Device_getCapabilities), nullptr);
    cls->defineFunction("acquire", _SE(js_gfx_Device_acquire));
    cls->defineFunction("bindingMappingInfo", _SE(js_gfx_Device_bindingMappingInfo));
    cls->defineFunction("createCommandBuffer", _SE(js_gfx_Device_createCommandBuffer));
    cls->defineFunction("createDescriptorSet", _SE(js_gfx_Device_createDescriptorSet));
    cls->defineFunction("createDescriptorSetLayout", _SE(js_gfx_Device_createDescriptorSetLayout));
    cls->defineFunction("createFramebuffer", _SE(js_gfx_Device_createFramebuffer));
    cls->defineFunction("createInputAssembler", _SE(js_gfx_Device_createInputAssembler));
    cls->defineFunction("createPipelineLayout", _SE(js_gfx_Device_createPipelineLayout));
    cls->defineFunction("createPipelineState", _SE(js_gfx_Device_createPipelineState));
    cls->defineFunction("createQueue", _SE(js_gfx_Device_createQueue));
    cls->defineFunction("createRenderPass", _SE(js_gfx_Device_createRenderPass));
    cls->defineFunction("createShader", _SE(js_gfx_Device_createShader));
    cls->defineFunction("createSwapchain", _SE(js_gfx_Device_createSwapchain));
    cls->defineFunction("destroy", _SE(js_gfx_Device_destroy));
    cls->defineFunction("flushCommands", _SE(js_gfx_Device_flushCommands));
    cls->defineFunction("getGlobalBarrier", _SE(js_gfx_Device_getGlobalBarrier));
    cls->defineFunction("getSampler", _SE(js_gfx_Device_getSampler));
    cls->defineFunction("getTextureBarrier", _SE(js_gfx_Device_getTextureBarrier));
    cls->defineFunction("hasFeature", _SE(js_gfx_Device_hasFeature));
    cls->defineFunction("initialize", _SE(js_gfx_Device_initialize));
    cls->defineFunction("present", _SE(js_gfx_Device_present));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Device>(cls);

    __jsb_cc_gfx_Device_proto = cls->getProto();
    __jsb_cc_gfx_Device_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gfx_DeviceManager_proto = nullptr;
se::Class* __jsb_cc_gfx_DeviceManager_class = nullptr;

static bool js_gfx_DeviceManager_create(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::DeviceInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_gfx_DeviceManager_create : Error processing arguments");
        cc::gfx::Device* result = cc::gfx::DeviceManager::create(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_DeviceManager_create : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_DeviceManager_create)

static bool js_gfx_DeviceManager_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cc::gfx::DeviceManager::destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_DeviceManager_destroy)

static bool js_gfx_DeviceManager_addSurfaceEventListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cc::gfx::DeviceManager::addSurfaceEventListener();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_DeviceManager_addSurfaceEventListener)


static bool js_cc_gfx_DeviceManager_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::DeviceManager>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::gfx::DeviceManager>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DeviceManager_finalize)

bool js_register_gfx_DeviceManager(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DeviceManager", obj, nullptr, nullptr);

    cls->defineStaticFunction("create", _SE(js_gfx_DeviceManager_create));
    cls->defineStaticFunction("destroy", _SE(js_gfx_DeviceManager_destroy));
    cls->defineStaticFunction("addSurfaceEventListener", _SE(js_gfx_DeviceManager_addSurfaceEventListener));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DeviceManager_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DeviceManager>(cls);

    __jsb_cc_gfx_DeviceManager_proto = cls->getProto();
    __jsb_cc_gfx_DeviceManager_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
bool register_all_gfx(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("gfx", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("gfx", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_gfx_Size(ns);
    js_register_gfx_DeviceCaps(ns);
    js_register_gfx_Offset(ns);
    js_register_gfx_Rect(ns);
    js_register_gfx_Extent(ns);
    js_register_gfx_TextureSubresLayers(ns);
    js_register_gfx_TextureSubresRange(ns);
    js_register_gfx_TextureCopy(ns);
    js_register_gfx_TextureBlit(ns);
    js_register_gfx_BufferTextureCopy(ns);
    js_register_gfx_Viewport(ns);
    js_register_gfx_Color(ns);
    js_register_gfx_BindingMappingInfo(ns);
    js_register_gfx_SwapchainInfo(ns);
    js_register_gfx_DeviceInfo(ns);
    js_register_gfx_BufferInfo(ns);
    js_register_gfx_BufferViewInfo(ns);
    js_register_gfx_DrawInfo(ns);
    js_register_gfx_DispatchInfo(ns);
    js_register_gfx_IndirectBuffer(ns);
    js_register_gfx_TextureInfo(ns);
    js_register_gfx_TextureViewInfo(ns);
    js_register_gfx_SamplerInfo(ns);
    js_register_gfx_Uniform(ns);
    js_register_gfx_UniformBlock(ns);
    js_register_gfx_UniformSamplerTexture(ns);
    js_register_gfx_UniformSampler(ns);
    js_register_gfx_UniformTexture(ns);
    js_register_gfx_UniformStorageImage(ns);
    js_register_gfx_UniformStorageBuffer(ns);
    js_register_gfx_UniformInputAttachment(ns);
    js_register_gfx_ShaderStage(ns);
    js_register_gfx_Attribute(ns);
    js_register_gfx_ShaderInfo(ns);
    js_register_gfx_InputAssemblerInfo(ns);
    js_register_gfx_ColorAttachment(ns);
    js_register_gfx_DepthStencilAttachment(ns);
    js_register_gfx_SubpassInfo(ns);
    js_register_gfx_SubpassDependency(ns);
    js_register_gfx_RenderPassInfo(ns);
    js_register_gfx_GlobalBarrierInfo(ns);
    js_register_gfx_TextureBarrierInfo(ns);
    js_register_gfx_FramebufferInfo(ns);
    js_register_gfx_DescriptorSetLayoutBinding(ns);
    js_register_gfx_DescriptorSetLayoutInfo(ns);
    js_register_gfx_DescriptorSetInfo(ns);
    js_register_gfx_PipelineLayoutInfo(ns);
    js_register_gfx_InputState(ns);
    js_register_gfx_RasterizerState(ns);
    js_register_gfx_DepthStencilState(ns);
    js_register_gfx_BlendTarget(ns);
    js_register_gfx_BlendState(ns);
    js_register_gfx_PipelineStateInfo(ns);
    js_register_gfx_CommandBufferInfo(ns);
    js_register_gfx_QueueInfo(ns);
    js_register_gfx_MemoryStatus(ns);
    js_register_gfx_GFXObject(ns);
    js_register_gfx_Buffer(ns);
    js_register_gfx_InputAssembler(ns);
    js_register_gfx_CommandBuffer(ns);
    js_register_gfx_DescriptorSet(ns);
    js_register_gfx_DescriptorSetLayout(ns);
    js_register_gfx_Framebuffer(ns);
    js_register_gfx_PipelineLayout(ns);
    js_register_gfx_PipelineState(ns);
    js_register_gfx_Queue(ns);
    js_register_gfx_RenderPass(ns);
    js_register_gfx_Shader(ns);
    js_register_gfx_Texture(ns);
    js_register_gfx_Swapchain(ns);
    js_register_gfx_GlobalBarrier(ns);
    js_register_gfx_Sampler(ns);
    js_register_gfx_TextureBarrier(ns);
    js_register_gfx_Device(ns);
    js_register_gfx_DeviceManager(ns);
    return true;
}

