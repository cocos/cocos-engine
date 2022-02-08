
// clang-format off
#include "cocos/bindings/auto/jsb_assets_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "core/assets/AssetsModuleHeader.h"
#include "core/builtin/BuiltinResMgr.h"
#include "3d/assets/Mesh.h"
#include "3d/assets/Morph.h"
#include "3d/assets/MorphRendering.h"
#include "3d/assets/Skeleton.h"
#include "cocos/bindings/auto/jsb_cocos_auto.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_Error_proto = nullptr; // NOLINT
se::Class* __jsb_cc_Error_class = nullptr;  // NOLINT

static bool js_assets_Error_get_msg(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Error>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Error_get_msg : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->msg, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->msg, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_Error_get_msg)

static bool js_assets_Error_set_msg(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Error>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Error_set_msg : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->msg, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_Error_set_msg : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_Error_set_msg)


template<>
bool sevalue_to_native(const se::Value &from, cc::Error * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::Error*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("msg", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->msg), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_Error_finalize)

static bool js_assets_Error_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Error);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Error);
    auto cobj = ptr->get<cc::Error>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->msg), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_Error_constructor, __jsb_cc_Error_class, js_cc_Error_finalize)

static bool js_cc_Error_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_Error_finalize)

bool js_register_assets_Error(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Error", obj, nullptr, _SE(js_assets_Error_constructor));

    cls->defineProperty("msg", _SE(js_assets_Error_get_msg), _SE(js_assets_Error_set_msg));
    cls->defineFinalizeFunction(_SE(js_cc_Error_finalize));
    cls->install();
    JSBClassType::registerClass<cc::Error>(cls);

    __jsb_cc_Error_proto = cls->getProto();
    __jsb_cc_Error_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_BoundingBox_proto = nullptr; // NOLINT
se::Class* __jsb_cc_BoundingBox_class = nullptr;  // NOLINT

static bool js_assets_BoundingBox_get_min(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BoundingBox>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BoundingBox_get_min : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->min, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->min, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_BoundingBox_get_min)

static bool js_assets_BoundingBox_set_min(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::BoundingBox>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BoundingBox_set_min : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->min, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_BoundingBox_set_min : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_BoundingBox_set_min)

static bool js_assets_BoundingBox_get_max(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BoundingBox>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BoundingBox_get_max : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->max, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->max, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_BoundingBox_get_max)

static bool js_assets_BoundingBox_set_max(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::BoundingBox>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BoundingBox_set_max : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->max, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_BoundingBox_set_max : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_BoundingBox_set_max)


template<>
bool sevalue_to_native(const se::Value &from, cc::BoundingBox * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::BoundingBox*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("min", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->min), ctx);
    }
    json->getProperty("max", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->max), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_BoundingBox_finalize)

static bool js_assets_BoundingBox_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::BoundingBox);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::BoundingBox);
        auto cobj = ptr->get<cc::BoundingBox>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::BoundingBox);
    auto cobj = ptr->get<cc::BoundingBox>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->min), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->max), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_BoundingBox_constructor, __jsb_cc_BoundingBox_class, js_cc_BoundingBox_finalize)

static bool js_cc_BoundingBox_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_BoundingBox_finalize)

bool js_register_assets_BoundingBox(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BoundingBox", obj, nullptr, _SE(js_assets_BoundingBox_constructor));

    cls->defineProperty("min", _SE(js_assets_BoundingBox_get_min), _SE(js_assets_BoundingBox_set_min));
    cls->defineProperty("max", _SE(js_assets_BoundingBox_get_max), _SE(js_assets_BoundingBox_set_max));
    cls->defineFinalizeFunction(_SE(js_cc_BoundingBox_finalize));
    cls->install();
    JSBClassType::registerClass<cc::BoundingBox>(cls);

    __jsb_cc_BoundingBox_proto = cls->getProto();
    __jsb_cc_BoundingBox_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_VertexIdChannel_proto = nullptr; // NOLINT
se::Class* __jsb_cc_VertexIdChannel_class = nullptr;  // NOLINT

static bool js_assets_VertexIdChannel_get_stream(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::VertexIdChannel>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_VertexIdChannel_get_stream : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stream, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stream, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_VertexIdChannel_get_stream)

static bool js_assets_VertexIdChannel_set_stream(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::VertexIdChannel>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_VertexIdChannel_set_stream : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stream, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_VertexIdChannel_set_stream : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_VertexIdChannel_set_stream)

static bool js_assets_VertexIdChannel_get_index(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::VertexIdChannel>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_VertexIdChannel_get_index : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->index, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->index, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_VertexIdChannel_get_index)

static bool js_assets_VertexIdChannel_set_index(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::VertexIdChannel>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_VertexIdChannel_set_index : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->index, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_VertexIdChannel_set_index : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_VertexIdChannel_set_index)


template<>
bool sevalue_to_native(const se::Value &from, cc::VertexIdChannel * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::VertexIdChannel*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("stream", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stream), ctx);
    }
    json->getProperty("index", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->index), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_VertexIdChannel_finalize)

static bool js_assets_VertexIdChannel_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::VertexIdChannel);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::VertexIdChannel);
        auto cobj = ptr->get<cc::VertexIdChannel>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::VertexIdChannel);
    auto cobj = ptr->get<cc::VertexIdChannel>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->stream), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->index), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_VertexIdChannel_constructor, __jsb_cc_VertexIdChannel_class, js_cc_VertexIdChannel_finalize)

static bool js_cc_VertexIdChannel_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_VertexIdChannel_finalize)

bool js_register_assets_VertexIdChannel(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("VertexIdChannel", obj, nullptr, _SE(js_assets_VertexIdChannel_constructor));

    cls->defineProperty("stream", _SE(js_assets_VertexIdChannel_get_stream), _SE(js_assets_VertexIdChannel_set_stream));
    cls->defineProperty("index", _SE(js_assets_VertexIdChannel_get_index), _SE(js_assets_VertexIdChannel_set_index));
    cls->defineFinalizeFunction(_SE(js_cc_VertexIdChannel_finalize));
    cls->install();
    JSBClassType::registerClass<cc::VertexIdChannel>(cls);

    __jsb_cc_VertexIdChannel_proto = cls->getProto();
    __jsb_cc_VertexIdChannel_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_Asset_proto = nullptr; // NOLINT
se::Class* __jsb_cc_Asset_class = nullptr;  // NOLINT

static bool js_assets_Asset_addAssetRef(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Asset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Asset_addAssetRef : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->addAssetRef();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_Asset_addAssetRef)

static bool js_assets_Asset_createNode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Asset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Asset_createNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<void (cc::Error, cc::Node *)>, true> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto * thisObj = s.thisObject();
                auto lambda = [=](cc::Error larg0, cc::Node* larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    ok &= nativevalue_to_se(larg1, args[1], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0.data = lambda;
            }
            else
            {
                arg0.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_assets_Asset_createNode : Error processing arguments");
        cobj->createNode(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_Asset_createNode)

static bool js_assets_Asset_decAssetRef(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Asset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Asset_decAssetRef : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->decAssetRef();
        return true;
    }
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Asset_decAssetRef : Error processing arguments");
        cobj->decAssetRef(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_Asset_decAssetRef)

static bool js_assets_Asset_deserialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Asset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Asset_deserialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::any, true> arg0 = {};
        HolderType<cc::any, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Asset_deserialize : Error processing arguments");
        cobj->deserialize(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_assets_Asset_deserialize)

static bool js_assets_Asset_getAssetRefCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Asset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Asset_getAssetRefCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getAssetRefCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Asset_getAssetRefCount : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_Asset_getAssetRefCount)

static bool js_assets_Asset_getNativeAsset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Asset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Asset_getNativeAsset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::any result = cobj->getNativeAsset();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Asset_getNativeAsset : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_Asset_getNativeAsset)

static bool js_assets_Asset_getNativeDep(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Asset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Asset_getNativeDep : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::NativeDep result = cobj->getNativeDep();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Asset_getNativeDep : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_Asset_getNativeDep)

static bool js_assets_Asset_getNativeUrl(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Asset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Asset_getNativeUrl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getNativeUrl();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Asset_getNativeUrl : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_Asset_getNativeUrl)

static bool js_assets_Asset_getUuid(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Asset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Asset_getUuid : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getUuid();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Asset_getUuid : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_Asset_getUuid)

static bool js_assets_Asset_initDefault(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Asset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Asset_initDefault : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<boost::optional<std::string>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Asset_initDefault : Error processing arguments");
        cobj->initDefault(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_Asset_initDefault)

static bool js_assets_Asset_isDefault(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Asset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Asset_isDefault : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isDefault();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Asset_isDefault : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_Asset_isDefault)

static bool js_assets_Asset_onLoaded(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Asset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Asset_onLoaded : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onLoaded();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_Asset_onLoaded)

static bool js_assets_Asset_serialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Asset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Asset_serialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::any, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Asset_serialize : Error processing arguments");
        cc::any result = cobj->serialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Asset_serialize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_Asset_serialize)

static bool js_assets_Asset_setNativeAsset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Asset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Asset_setNativeAsset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::any, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Asset_setNativeAsset : Error processing arguments");
        cobj->setNativeAsset(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_Asset_setNativeAsset)

static bool js_assets_Asset_setUuid(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Asset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Asset_setUuid : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Asset_setUuid : Error processing arguments");
        cobj->setUuid(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_assets_Asset_setUuid)

static bool js_assets_Asset_validate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Asset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Asset_validate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->validate();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Asset_validate : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_Asset_validate)

static bool js_assets_Asset_get__native(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Asset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Asset_get__native : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_native, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_native, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_Asset_get__native)

static bool js_assets_Asset_set__native(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Asset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Asset_set__native : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_native, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_Asset_set__native : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_Asset_set__native)

static bool js_assets_Asset_get__nativeUrl(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Asset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Asset_get__nativeUrl : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_nativeUrl, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_nativeUrl, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_Asset_get__nativeUrl)

static bool js_assets_Asset_set__nativeUrl(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Asset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Asset_set__nativeUrl : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_nativeUrl, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_Asset_set__nativeUrl : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_Asset_set__nativeUrl)

SE_DECLARE_FINALIZE_FUNC(js_cc_Asset_finalize)

static bool js_assets_Asset_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Asset);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_Asset_constructor, __jsb_cc_Asset_class, js_cc_Asset_finalize)

static bool js_cc_Asset_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_Asset_finalize)

bool js_register_assets_Asset(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Asset", obj, __jsb_cc_CCObject_proto, _SE(js_assets_Asset_constructor));

    cls->defineProperty("_native", _SE(js_assets_Asset_get__native), _SE(js_assets_Asset_set__native));
    cls->defineProperty("_nativeUrl", _SE(js_assets_Asset_get__nativeUrl), _SE(js_assets_Asset_set__nativeUrl));
    cls->defineProperty("_uuid", _SE(js_assets_Asset_getUuid_asGetter), _SE(js_assets_Asset_setUuid_asSetter));
    cls->defineProperty("nativeUrl", _SE(js_assets_Asset_getNativeUrl_asGetter), nullptr);
    cls->defineProperty("isDefault", _SE(js_assets_Asset_isDefault_asGetter), nullptr);
    cls->defineProperty("_nativeDep", _SE(js_assets_Asset_getNativeDep_asGetter), nullptr);
    cls->defineFunction("addAssetRef", _SE(js_assets_Asset_addAssetRef));
    cls->defineFunction("createNode", _SE(js_assets_Asset_createNode));
    cls->defineFunction("decAssetRef", _SE(js_assets_Asset_decAssetRef));
    cls->defineFunction("deserialize", _SE(js_assets_Asset_deserialize));
    cls->defineFunction("getAssetRefCount", _SE(js_assets_Asset_getAssetRefCount));
    cls->defineFunction("getNativeAsset", _SE(js_assets_Asset_getNativeAsset));
    cls->defineFunction("initDefault", _SE(js_assets_Asset_initDefault));
    cls->defineFunction("onLoaded", _SE(js_assets_Asset_onLoaded));
    cls->defineFunction("serialize", _SE(js_assets_Asset_serialize));
    cls->defineFunction("setNativeAsset", _SE(js_assets_Asset_setNativeAsset));
    cls->defineFunction("validate", _SE(js_assets_Asset_validate));
    cls->defineFinalizeFunction(_SE(js_cc_Asset_finalize));
    cls->install();
    JSBClassType::registerClass<cc::Asset>(cls);

    __jsb_cc_Asset_proto = cls->getProto();
    __jsb_cc_Asset_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_BufferAsset_proto = nullptr; // NOLINT
se::Class* __jsb_cc_BufferAsset_class = nullptr;  // NOLINT

static bool js_assets_BufferAsset_getBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BufferAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BufferAsset_getBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::ArrayBuffer* result = cobj->getBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_BufferAsset_getBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_BufferAsset_getBuffer)

SE_DECLARE_FINALIZE_FUNC(js_cc_BufferAsset_finalize)

static bool js_assets_BufferAsset_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::BufferAsset);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_BufferAsset_constructor, __jsb_cc_BufferAsset_class, js_cc_BufferAsset_finalize)

static bool js_cc_BufferAsset_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_BufferAsset_finalize)

bool js_register_assets_BufferAsset(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BufferAsset", obj, __jsb_cc_Asset_proto, _SE(js_assets_BufferAsset_constructor));

    cls->defineProperty("buffer", _SE(js_assets_BufferAsset_getBuffer_asGetter), nullptr);
    cls->defineFinalizeFunction(_SE(js_cc_BufferAsset_finalize));
    cls->install();
    JSBClassType::registerClass<cc::BufferAsset>(cls);

    __jsb_cc_BufferAsset_proto = cls->getProto();
    __jsb_cc_BufferAsset_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_TextureBase_proto = nullptr; // NOLINT
se::Class* __jsb_cc_TextureBase_class = nullptr;  // NOLINT

static bool js_assets_TextureBase_getAnisotropy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_getAnisotropy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getAnisotropy();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_TextureBase_getAnisotropy : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_TextureBase_getAnisotropy)

static bool js_assets_TextureBase_getGFXSampler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_getGFXSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Sampler* result = cobj->getGFXSampler();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_TextureBase_getGFXSampler : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_TextureBase_getGFXSampler)

static bool js_assets_TextureBase_getGFXTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_getGFXTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Texture* result = cobj->getGFXTexture();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_TextureBase_getGFXTexture : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_TextureBase_getGFXTexture)

static bool js_assets_TextureBase_getHashForJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_getHashForJS : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        double result = cobj->getHashForJS();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_TextureBase_getHashForJS : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_TextureBase_getHashForJS)

static bool js_assets_TextureBase_getHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_getHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHeight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_TextureBase_getHeight : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_TextureBase_getHeight)

static bool js_assets_TextureBase_getId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_getId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_TextureBase_getId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_TextureBase_getId)

static bool js_assets_TextureBase_getPixelFormat(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_getPixelFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getPixelFormat());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_TextureBase_getPixelFormat : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_TextureBase_getPixelFormat)

static bool js_assets_TextureBase_getSamplerInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_getSamplerInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::SamplerInfo& result = cobj->getSamplerInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_TextureBase_getSamplerInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_TextureBase_getSamplerInfo)

static bool js_assets_TextureBase_getWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_getWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getWidth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_TextureBase_getWidth : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_TextureBase_getWidth)

static bool js_assets_TextureBase_isCompressed(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_isCompressed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isCompressed();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_TextureBase_isCompressed : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_TextureBase_isCompressed)

static bool js_assets_TextureBase_setAnisotropy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_setAnisotropy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_TextureBase_setAnisotropy : Error processing arguments");
        cobj->setAnisotropy(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_TextureBase_setAnisotropy)

static bool js_assets_TextureBase_setFilters(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_setFilters : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::Filter, false> arg0 = {};
        HolderType<cc::Filter, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_TextureBase_setFilters : Error processing arguments");
        cobj->setFilters(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_assets_TextureBase_setFilters)

static bool js_assets_TextureBase_setHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_setHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_TextureBase_setHeight : Error processing arguments");
        cobj->setHeight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_assets_TextureBase_setHeight)

static bool js_assets_TextureBase_setMipFilter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_setMipFilter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Filter, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_TextureBase_setMipFilter : Error processing arguments");
        cobj->setMipFilter(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_TextureBase_setMipFilter)

static bool js_assets_TextureBase_setWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_setWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_TextureBase_setWidth : Error processing arguments");
        cobj->setWidth(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_assets_TextureBase_setWidth)

static bool js_assets_TextureBase_setWrapMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2( cobj, false, "js_assets_TextureBase_setWrapMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<cc::WrapMode, false> arg0 = {};
            HolderType<cc::WrapMode, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->setWrapMode(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<cc::WrapMode, false> arg0 = {};
            HolderType<cc::WrapMode, false> arg1 = {};
            HolderType<cc::WrapMode, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->setWrapMode(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_assets_TextureBase_setWrapMode)

static bool js_assets_TextureBase_get__format(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_get__format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_format, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_format, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_TextureBase_get__format)

static bool js_assets_TextureBase_set__format(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_set__format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_format, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_TextureBase_set__format : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_TextureBase_set__format)

static bool js_assets_TextureBase_get__minFilter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_get__minFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_minFilter, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_minFilter, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_TextureBase_get__minFilter)

static bool js_assets_TextureBase_set__minFilter(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_set__minFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_minFilter, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_TextureBase_set__minFilter : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_TextureBase_set__minFilter)

static bool js_assets_TextureBase_get__magFilter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_get__magFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_magFilter, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_magFilter, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_TextureBase_get__magFilter)

static bool js_assets_TextureBase_set__magFilter(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_set__magFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_magFilter, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_TextureBase_set__magFilter : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_TextureBase_set__magFilter)

static bool js_assets_TextureBase_get__mipFilter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_get__mipFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_mipFilter, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_mipFilter, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_TextureBase_get__mipFilter)

static bool js_assets_TextureBase_set__mipFilter(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_set__mipFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_mipFilter, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_TextureBase_set__mipFilter : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_TextureBase_set__mipFilter)

static bool js_assets_TextureBase_get__wrapS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_get__wrapS : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_wrapS, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_wrapS, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_TextureBase_get__wrapS)

static bool js_assets_TextureBase_set__wrapS(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_set__wrapS : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_wrapS, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_TextureBase_set__wrapS : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_TextureBase_set__wrapS)

static bool js_assets_TextureBase_get__wrapT(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_get__wrapT : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_wrapT, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_wrapT, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_TextureBase_get__wrapT)

static bool js_assets_TextureBase_set__wrapT(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_set__wrapT : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_wrapT, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_TextureBase_set__wrapT : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_TextureBase_set__wrapT)

static bool js_assets_TextureBase_get__wrapR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_get__wrapR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_wrapR, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_wrapR, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_TextureBase_get__wrapR)

static bool js_assets_TextureBase_set__wrapR(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_set__wrapR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_wrapR, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_TextureBase_set__wrapR : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_TextureBase_set__wrapR)

static bool js_assets_TextureBase_get__anisotropy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_get__anisotropy : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_anisotropy, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_anisotropy, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_TextureBase_get__anisotropy)

static bool js_assets_TextureBase_set__anisotropy(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_set__anisotropy : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_anisotropy, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_TextureBase_set__anisotropy : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_TextureBase_set__anisotropy)

static bool js_assets_TextureBase_get__width(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_get__width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_width, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_width, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_TextureBase_get__width)

static bool js_assets_TextureBase_set__width(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_set__width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_width, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_TextureBase_set__width : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_TextureBase_set__width)

static bool js_assets_TextureBase_get__height(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_get__height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_height, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_height, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_TextureBase_get__height)

static bool js_assets_TextureBase_set__height(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureBase_set__height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_height, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_TextureBase_set__height : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_TextureBase_set__height)
static bool js_cc_TextureBase_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_TextureBase_finalize)

bool js_register_assets_TextureBase(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TextureBase", obj, __jsb_cc_Asset_proto, nullptr);

    cls->defineProperty("_format", _SE(js_assets_TextureBase_get__format), _SE(js_assets_TextureBase_set__format));
    cls->defineProperty("_minFilter", _SE(js_assets_TextureBase_get__minFilter), _SE(js_assets_TextureBase_set__minFilter));
    cls->defineProperty("_magFilter", _SE(js_assets_TextureBase_get__magFilter), _SE(js_assets_TextureBase_set__magFilter));
    cls->defineProperty("_mipFilter", _SE(js_assets_TextureBase_get__mipFilter), _SE(js_assets_TextureBase_set__mipFilter));
    cls->defineProperty("_wrapS", _SE(js_assets_TextureBase_get__wrapS), _SE(js_assets_TextureBase_set__wrapS));
    cls->defineProperty("_wrapT", _SE(js_assets_TextureBase_get__wrapT), _SE(js_assets_TextureBase_set__wrapT));
    cls->defineProperty("_wrapR", _SE(js_assets_TextureBase_get__wrapR), _SE(js_assets_TextureBase_set__wrapR));
    cls->defineProperty("_anisotropy", _SE(js_assets_TextureBase_get__anisotropy), _SE(js_assets_TextureBase_set__anisotropy));
    cls->defineProperty("_width", _SE(js_assets_TextureBase_get__width), _SE(js_assets_TextureBase_set__width));
    cls->defineProperty("_height", _SE(js_assets_TextureBase_get__height), _SE(js_assets_TextureBase_set__height));
    cls->defineProperty({"_height", "height"}, _SE(js_assets_TextureBase_getHeight_asGetter), _SE(js_assets_TextureBase_setHeight_asSetter));
    cls->defineProperty("isCompressed", _SE(js_assets_TextureBase_isCompressed_asGetter), nullptr);
    cls->defineProperty({"_width", "width"}, _SE(js_assets_TextureBase_getWidth_asGetter), _SE(js_assets_TextureBase_setWidth_asSetter));
    cls->defineFunction("getAnisotropy", _SE(js_assets_TextureBase_getAnisotropy));
    cls->defineFunction("getGFXSampler", _SE(js_assets_TextureBase_getGFXSampler));
    cls->defineFunction("getGFXTexture", _SE(js_assets_TextureBase_getGFXTexture));
    cls->defineFunction("getHash", _SE(js_assets_TextureBase_getHashForJS));
    cls->defineFunction("getId", _SE(js_assets_TextureBase_getId));
    cls->defineFunction("getPixelFormat", _SE(js_assets_TextureBase_getPixelFormat));
    cls->defineFunction("getSamplerInfo", _SE(js_assets_TextureBase_getSamplerInfo));
    cls->defineFunction("setAnisotropy", _SE(js_assets_TextureBase_setAnisotropy));
    cls->defineFunction("setFilters", _SE(js_assets_TextureBase_setFilters));
    cls->defineFunction("setMipFilter", _SE(js_assets_TextureBase_setMipFilter));
    cls->defineFunction("setWrapMode", _SE(js_assets_TextureBase_setWrapMode));
    cls->defineFinalizeFunction(_SE(js_cc_TextureBase_finalize));
    cls->install();
    JSBClassType::registerClass<cc::TextureBase>(cls);

    __jsb_cc_TextureBase_proto = cls->getProto();
    __jsb_cc_TextureBase_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IPropertyInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IPropertyInfo_class = nullptr;  // NOLINT

static bool js_assets_IPropertyInfo_get_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPropertyInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPropertyInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->type, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPropertyInfo_get_type)

static bool js_assets_IPropertyInfo_set_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPropertyInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPropertyInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->type, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPropertyInfo_set_type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPropertyInfo_set_type)

static bool js_assets_IPropertyInfo_get_handleInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPropertyInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPropertyInfo_get_handleInfo : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->handleInfo, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->handleInfo, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPropertyInfo_get_handleInfo)

static bool js_assets_IPropertyInfo_set_handleInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPropertyInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPropertyInfo_set_handleInfo : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->handleInfo, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPropertyInfo_set_handleInfo : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPropertyInfo_set_handleInfo)

static bool js_assets_IPropertyInfo_get_samplerHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPropertyInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPropertyInfo_get_samplerHash : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->samplerHash, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->samplerHash, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPropertyInfo_get_samplerHash)

static bool js_assets_IPropertyInfo_set_samplerHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPropertyInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPropertyInfo_set_samplerHash : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->samplerHash, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPropertyInfo_set_samplerHash : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPropertyInfo_set_samplerHash)

static bool js_assets_IPropertyInfo_get_value(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPropertyInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPropertyInfo_get_value : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->value, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->value, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPropertyInfo_get_value)

static bool js_assets_IPropertyInfo_set_value(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPropertyInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPropertyInfo_set_value : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->value, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPropertyInfo_set_value : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPropertyInfo_set_value)

static bool js_assets_IPropertyInfo_get_linear(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPropertyInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPropertyInfo_get_linear : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->linear, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->linear, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPropertyInfo_get_linear)

static bool js_assets_IPropertyInfo_set_linear(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPropertyInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPropertyInfo_set_linear : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->linear, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPropertyInfo_set_linear : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPropertyInfo_set_linear)


template<>
bool sevalue_to_native(const se::Value &from, cc::IPropertyInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IPropertyInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("type", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    json->getProperty("handleInfo", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->handleInfo), ctx);
    }
    json->getProperty("samplerHash", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->samplerHash), ctx);
    }
    json->getProperty("value", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->value), ctx);
    }
    json->getProperty("linear", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->linear), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IPropertyInfo_finalize)

static bool js_assets_IPropertyInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IPropertyInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IPropertyInfo);
        auto cobj = ptr->get<cc::IPropertyInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IPropertyInfo);
    auto cobj = ptr->get<cc::IPropertyInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->type), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->handleInfo), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->samplerHash), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->value), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->linear), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IPropertyInfo_constructor, __jsb_cc_IPropertyInfo_class, js_cc_IPropertyInfo_finalize)

static bool js_cc_IPropertyInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IPropertyInfo_finalize)

bool js_register_assets_IPropertyInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IPropertyInfo", obj, nullptr, _SE(js_assets_IPropertyInfo_constructor));

    cls->defineProperty("type", _SE(js_assets_IPropertyInfo_get_type), _SE(js_assets_IPropertyInfo_set_type));
    cls->defineProperty("handleInfo", _SE(js_assets_IPropertyInfo_get_handleInfo), _SE(js_assets_IPropertyInfo_set_handleInfo));
    cls->defineProperty("samplerHash", _SE(js_assets_IPropertyInfo_get_samplerHash), _SE(js_assets_IPropertyInfo_set_samplerHash));
    cls->defineProperty("value", _SE(js_assets_IPropertyInfo_get_value), _SE(js_assets_IPropertyInfo_set_value));
    cls->defineProperty("linear", _SE(js_assets_IPropertyInfo_get_linear), _SE(js_assets_IPropertyInfo_set_linear));
    cls->defineFinalizeFunction(_SE(js_cc_IPropertyInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IPropertyInfo>(cls);

    __jsb_cc_IPropertyInfo_proto = cls->getProto();
    __jsb_cc_IPropertyInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_RasterizerStateInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_RasterizerStateInfo_class = nullptr;  // NOLINT

static bool js_assets_RasterizerStateInfo_get_isDiscard(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_get_isDiscard : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isDiscard, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isDiscard, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_RasterizerStateInfo_get_isDiscard)

static bool js_assets_RasterizerStateInfo_set_isDiscard(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_set_isDiscard : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isDiscard, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_RasterizerStateInfo_set_isDiscard : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_RasterizerStateInfo_set_isDiscard)

static bool js_assets_RasterizerStateInfo_get_isFrontFaceCCW(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_get_isFrontFaceCCW : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isFrontFaceCCW, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isFrontFaceCCW, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_RasterizerStateInfo_get_isFrontFaceCCW)

static bool js_assets_RasterizerStateInfo_set_isFrontFaceCCW(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_set_isFrontFaceCCW : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isFrontFaceCCW, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_RasterizerStateInfo_set_isFrontFaceCCW : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_RasterizerStateInfo_set_isFrontFaceCCW)

static bool js_assets_RasterizerStateInfo_get_depthBiasEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_get_depthBiasEnabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthBiasEnabled, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthBiasEnabled, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_RasterizerStateInfo_get_depthBiasEnabled)

static bool js_assets_RasterizerStateInfo_set_depthBiasEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_set_depthBiasEnabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthBiasEnabled, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_RasterizerStateInfo_set_depthBiasEnabled : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_RasterizerStateInfo_set_depthBiasEnabled)

static bool js_assets_RasterizerStateInfo_get_isDepthClip(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_get_isDepthClip : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isDepthClip, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isDepthClip, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_RasterizerStateInfo_get_isDepthClip)

static bool js_assets_RasterizerStateInfo_set_isDepthClip(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_set_isDepthClip : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isDepthClip, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_RasterizerStateInfo_set_isDepthClip : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_RasterizerStateInfo_set_isDepthClip)

static bool js_assets_RasterizerStateInfo_get_isMultisample(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_get_isMultisample : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isMultisample, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isMultisample, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_RasterizerStateInfo_get_isMultisample)

static bool js_assets_RasterizerStateInfo_set_isMultisample(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_set_isMultisample : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isMultisample, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_RasterizerStateInfo_set_isMultisample : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_RasterizerStateInfo_set_isMultisample)

static bool js_assets_RasterizerStateInfo_get_polygonMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_get_polygonMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->polygonMode, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->polygonMode, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_RasterizerStateInfo_get_polygonMode)

static bool js_assets_RasterizerStateInfo_set_polygonMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_set_polygonMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->polygonMode, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_RasterizerStateInfo_set_polygonMode : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_RasterizerStateInfo_set_polygonMode)

static bool js_assets_RasterizerStateInfo_get_shadeModel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_get_shadeModel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->shadeModel, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->shadeModel, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_RasterizerStateInfo_get_shadeModel)

static bool js_assets_RasterizerStateInfo_set_shadeModel(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_set_shadeModel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->shadeModel, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_RasterizerStateInfo_set_shadeModel : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_RasterizerStateInfo_set_shadeModel)

static bool js_assets_RasterizerStateInfo_get_cullMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_get_cullMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->cullMode, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->cullMode, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_RasterizerStateInfo_get_cullMode)

static bool js_assets_RasterizerStateInfo_set_cullMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_set_cullMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->cullMode, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_RasterizerStateInfo_set_cullMode : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_RasterizerStateInfo_set_cullMode)

static bool js_assets_RasterizerStateInfo_get_depthBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_get_depthBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthBias, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthBias, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_RasterizerStateInfo_get_depthBias)

static bool js_assets_RasterizerStateInfo_set_depthBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_set_depthBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthBias, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_RasterizerStateInfo_set_depthBias : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_RasterizerStateInfo_set_depthBias)

static bool js_assets_RasterizerStateInfo_get_depthBiasClamp(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_get_depthBiasClamp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthBiasClamp, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthBiasClamp, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_RasterizerStateInfo_get_depthBiasClamp)

static bool js_assets_RasterizerStateInfo_set_depthBiasClamp(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_set_depthBiasClamp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthBiasClamp, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_RasterizerStateInfo_set_depthBiasClamp : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_RasterizerStateInfo_set_depthBiasClamp)

static bool js_assets_RasterizerStateInfo_get_depthBiasSlop(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_get_depthBiasSlop : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthBiasSlop, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthBiasSlop, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_RasterizerStateInfo_get_depthBiasSlop)

static bool js_assets_RasterizerStateInfo_set_depthBiasSlop(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_set_depthBiasSlop : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthBiasSlop, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_RasterizerStateInfo_set_depthBiasSlop : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_RasterizerStateInfo_set_depthBiasSlop)

static bool js_assets_RasterizerStateInfo_get_lineWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_get_lineWidth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->lineWidth, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->lineWidth, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_RasterizerStateInfo_get_lineWidth)

static bool js_assets_RasterizerStateInfo_set_lineWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::RasterizerStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RasterizerStateInfo_set_lineWidth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->lineWidth, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_RasterizerStateInfo_set_lineWidth : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_RasterizerStateInfo_set_lineWidth)


template<>
bool sevalue_to_native(const se::Value &from, cc::RasterizerStateInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::RasterizerStateInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("isDiscard", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isDiscard), ctx);
    }
    json->getProperty("isFrontFaceCCW", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isFrontFaceCCW), ctx);
    }
    json->getProperty("depthBiasEnabled", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthBiasEnabled), ctx);
    }
    json->getProperty("isDepthClip", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isDepthClip), ctx);
    }
    json->getProperty("isMultisample", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isMultisample), ctx);
    }
    json->getProperty("polygonMode", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->polygonMode), ctx);
    }
    json->getProperty("shadeModel", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->shadeModel), ctx);
    }
    json->getProperty("cullMode", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->cullMode), ctx);
    }
    json->getProperty("depthBias", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthBias), ctx);
    }
    json->getProperty("depthBiasClamp", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthBiasClamp), ctx);
    }
    json->getProperty("depthBiasSlop", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthBiasSlop), ctx);
    }
    json->getProperty("lineWidth", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->lineWidth), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_RasterizerStateInfo_finalize)

static bool js_assets_RasterizerStateInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::RasterizerStateInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::RasterizerStateInfo);
        auto cobj = ptr->get<cc::RasterizerStateInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::RasterizerStateInfo);
    auto cobj = ptr->get<cc::RasterizerStateInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->isDiscard), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->isFrontFaceCCW), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->depthBiasEnabled), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->isDepthClip), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->isMultisample), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->polygonMode), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->shadeModel), nullptr);
    }
    if (argc > 7 && !args[7].isUndefined()) {
        ok &= sevalue_to_native(args[7], &(cobj->cullMode), nullptr);
    }
    if (argc > 8 && !args[8].isUndefined()) {
        ok &= sevalue_to_native(args[8], &(cobj->depthBias), nullptr);
    }
    if (argc > 9 && !args[9].isUndefined()) {
        ok &= sevalue_to_native(args[9], &(cobj->depthBiasClamp), nullptr);
    }
    if (argc > 10 && !args[10].isUndefined()) {
        ok &= sevalue_to_native(args[10], &(cobj->depthBiasSlop), nullptr);
    }
    if (argc > 11 && !args[11].isUndefined()) {
        ok &= sevalue_to_native(args[11], &(cobj->lineWidth), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_RasterizerStateInfo_constructor, __jsb_cc_RasterizerStateInfo_class, js_cc_RasterizerStateInfo_finalize)

static bool js_cc_RasterizerStateInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_RasterizerStateInfo_finalize)

bool js_register_assets_RasterizerStateInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RasterizerStateInfo", obj, nullptr, _SE(js_assets_RasterizerStateInfo_constructor));

    cls->defineProperty("isDiscard", _SE(js_assets_RasterizerStateInfo_get_isDiscard), _SE(js_assets_RasterizerStateInfo_set_isDiscard));
    cls->defineProperty("isFrontFaceCCW", _SE(js_assets_RasterizerStateInfo_get_isFrontFaceCCW), _SE(js_assets_RasterizerStateInfo_set_isFrontFaceCCW));
    cls->defineProperty("depthBiasEnabled", _SE(js_assets_RasterizerStateInfo_get_depthBiasEnabled), _SE(js_assets_RasterizerStateInfo_set_depthBiasEnabled));
    cls->defineProperty("isDepthClip", _SE(js_assets_RasterizerStateInfo_get_isDepthClip), _SE(js_assets_RasterizerStateInfo_set_isDepthClip));
    cls->defineProperty("isMultisample", _SE(js_assets_RasterizerStateInfo_get_isMultisample), _SE(js_assets_RasterizerStateInfo_set_isMultisample));
    cls->defineProperty("polygonMode", _SE(js_assets_RasterizerStateInfo_get_polygonMode), _SE(js_assets_RasterizerStateInfo_set_polygonMode));
    cls->defineProperty("shadeModel", _SE(js_assets_RasterizerStateInfo_get_shadeModel), _SE(js_assets_RasterizerStateInfo_set_shadeModel));
    cls->defineProperty("cullMode", _SE(js_assets_RasterizerStateInfo_get_cullMode), _SE(js_assets_RasterizerStateInfo_set_cullMode));
    cls->defineProperty("depthBias", _SE(js_assets_RasterizerStateInfo_get_depthBias), _SE(js_assets_RasterizerStateInfo_set_depthBias));
    cls->defineProperty("depthBiasClamp", _SE(js_assets_RasterizerStateInfo_get_depthBiasClamp), _SE(js_assets_RasterizerStateInfo_set_depthBiasClamp));
    cls->defineProperty("depthBiasSlop", _SE(js_assets_RasterizerStateInfo_get_depthBiasSlop), _SE(js_assets_RasterizerStateInfo_set_depthBiasSlop));
    cls->defineProperty("lineWidth", _SE(js_assets_RasterizerStateInfo_get_lineWidth), _SE(js_assets_RasterizerStateInfo_set_lineWidth));
    cls->defineFinalizeFunction(_SE(js_cc_RasterizerStateInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::RasterizerStateInfo>(cls);

    __jsb_cc_RasterizerStateInfo_proto = cls->getProto();
    __jsb_cc_RasterizerStateInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_DepthStencilStateInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_DepthStencilStateInfo_class = nullptr;  // NOLINT

static bool js_assets_DepthStencilStateInfo_get_depthTest(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_get_depthTest : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthTest, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthTest, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_DepthStencilStateInfo_get_depthTest)

static bool js_assets_DepthStencilStateInfo_set_depthTest(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_set_depthTest : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthTest, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_DepthStencilStateInfo_set_depthTest : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_DepthStencilStateInfo_set_depthTest)

static bool js_assets_DepthStencilStateInfo_get_depthWrite(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_get_depthWrite : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthWrite, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthWrite, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_DepthStencilStateInfo_get_depthWrite)

static bool js_assets_DepthStencilStateInfo_set_depthWrite(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_set_depthWrite : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthWrite, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_DepthStencilStateInfo_set_depthWrite : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_DepthStencilStateInfo_set_depthWrite)

static bool js_assets_DepthStencilStateInfo_get_stencilTestFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_get_stencilTestFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilTestFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilTestFront, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_DepthStencilStateInfo_get_stencilTestFront)

static bool js_assets_DepthStencilStateInfo_set_stencilTestFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_set_stencilTestFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilTestFront, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_DepthStencilStateInfo_set_stencilTestFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_DepthStencilStateInfo_set_stencilTestFront)

static bool js_assets_DepthStencilStateInfo_get_stencilTestBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_get_stencilTestBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilTestBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilTestBack, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_DepthStencilStateInfo_get_stencilTestBack)

static bool js_assets_DepthStencilStateInfo_set_stencilTestBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_set_stencilTestBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilTestBack, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_DepthStencilStateInfo_set_stencilTestBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_DepthStencilStateInfo_set_stencilTestBack)

static bool js_assets_DepthStencilStateInfo_get_depthFunc(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_get_depthFunc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthFunc, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthFunc, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_DepthStencilStateInfo_get_depthFunc)

static bool js_assets_DepthStencilStateInfo_set_depthFunc(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_set_depthFunc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthFunc, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_DepthStencilStateInfo_set_depthFunc : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_DepthStencilStateInfo_set_depthFunc)

static bool js_assets_DepthStencilStateInfo_get_stencilFuncFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_get_stencilFuncFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilFuncFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilFuncFront, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_DepthStencilStateInfo_get_stencilFuncFront)

static bool js_assets_DepthStencilStateInfo_set_stencilFuncFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_set_stencilFuncFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilFuncFront, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_DepthStencilStateInfo_set_stencilFuncFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_DepthStencilStateInfo_set_stencilFuncFront)

static bool js_assets_DepthStencilStateInfo_get_stencilReadMaskFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_get_stencilReadMaskFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilReadMaskFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilReadMaskFront, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_DepthStencilStateInfo_get_stencilReadMaskFront)

static bool js_assets_DepthStencilStateInfo_set_stencilReadMaskFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_set_stencilReadMaskFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilReadMaskFront, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_DepthStencilStateInfo_set_stencilReadMaskFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_DepthStencilStateInfo_set_stencilReadMaskFront)

static bool js_assets_DepthStencilStateInfo_get_stencilWriteMaskFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_get_stencilWriteMaskFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilWriteMaskFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilWriteMaskFront, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_DepthStencilStateInfo_get_stencilWriteMaskFront)

static bool js_assets_DepthStencilStateInfo_set_stencilWriteMaskFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_set_stencilWriteMaskFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilWriteMaskFront, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_DepthStencilStateInfo_set_stencilWriteMaskFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_DepthStencilStateInfo_set_stencilWriteMaskFront)

static bool js_assets_DepthStencilStateInfo_get_stencilFailOpFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_get_stencilFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilFailOpFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilFailOpFront, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_DepthStencilStateInfo_get_stencilFailOpFront)

static bool js_assets_DepthStencilStateInfo_set_stencilFailOpFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_set_stencilFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilFailOpFront, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_DepthStencilStateInfo_set_stencilFailOpFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_DepthStencilStateInfo_set_stencilFailOpFront)

static bool js_assets_DepthStencilStateInfo_get_stencilZFailOpFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_get_stencilZFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilZFailOpFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilZFailOpFront, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_DepthStencilStateInfo_get_stencilZFailOpFront)

static bool js_assets_DepthStencilStateInfo_set_stencilZFailOpFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_set_stencilZFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilZFailOpFront, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_DepthStencilStateInfo_set_stencilZFailOpFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_DepthStencilStateInfo_set_stencilZFailOpFront)

static bool js_assets_DepthStencilStateInfo_get_stencilPassOpFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_get_stencilPassOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilPassOpFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilPassOpFront, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_DepthStencilStateInfo_get_stencilPassOpFront)

static bool js_assets_DepthStencilStateInfo_set_stencilPassOpFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_set_stencilPassOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilPassOpFront, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_DepthStencilStateInfo_set_stencilPassOpFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_DepthStencilStateInfo_set_stencilPassOpFront)

static bool js_assets_DepthStencilStateInfo_get_stencilRefFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_get_stencilRefFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilRefFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilRefFront, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_DepthStencilStateInfo_get_stencilRefFront)

static bool js_assets_DepthStencilStateInfo_set_stencilRefFront(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_set_stencilRefFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilRefFront, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_DepthStencilStateInfo_set_stencilRefFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_DepthStencilStateInfo_set_stencilRefFront)

static bool js_assets_DepthStencilStateInfo_get_stencilFuncBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_get_stencilFuncBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilFuncBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilFuncBack, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_DepthStencilStateInfo_get_stencilFuncBack)

static bool js_assets_DepthStencilStateInfo_set_stencilFuncBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_set_stencilFuncBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilFuncBack, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_DepthStencilStateInfo_set_stencilFuncBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_DepthStencilStateInfo_set_stencilFuncBack)

static bool js_assets_DepthStencilStateInfo_get_stencilReadMaskBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_get_stencilReadMaskBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilReadMaskBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilReadMaskBack, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_DepthStencilStateInfo_get_stencilReadMaskBack)

static bool js_assets_DepthStencilStateInfo_set_stencilReadMaskBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_set_stencilReadMaskBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilReadMaskBack, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_DepthStencilStateInfo_set_stencilReadMaskBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_DepthStencilStateInfo_set_stencilReadMaskBack)

static bool js_assets_DepthStencilStateInfo_get_stencilWriteMaskBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_get_stencilWriteMaskBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilWriteMaskBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilWriteMaskBack, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_DepthStencilStateInfo_get_stencilWriteMaskBack)

static bool js_assets_DepthStencilStateInfo_set_stencilWriteMaskBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_set_stencilWriteMaskBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilWriteMaskBack, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_DepthStencilStateInfo_set_stencilWriteMaskBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_DepthStencilStateInfo_set_stencilWriteMaskBack)

static bool js_assets_DepthStencilStateInfo_get_stencilFailOpBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_get_stencilFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilFailOpBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilFailOpBack, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_DepthStencilStateInfo_get_stencilFailOpBack)

static bool js_assets_DepthStencilStateInfo_set_stencilFailOpBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_set_stencilFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilFailOpBack, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_DepthStencilStateInfo_set_stencilFailOpBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_DepthStencilStateInfo_set_stencilFailOpBack)

static bool js_assets_DepthStencilStateInfo_get_stencilZFailOpBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_get_stencilZFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilZFailOpBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilZFailOpBack, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_DepthStencilStateInfo_get_stencilZFailOpBack)

static bool js_assets_DepthStencilStateInfo_set_stencilZFailOpBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_set_stencilZFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilZFailOpBack, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_DepthStencilStateInfo_set_stencilZFailOpBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_DepthStencilStateInfo_set_stencilZFailOpBack)

static bool js_assets_DepthStencilStateInfo_get_stencilPassOpBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_get_stencilPassOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilPassOpBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilPassOpBack, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_DepthStencilStateInfo_get_stencilPassOpBack)

static bool js_assets_DepthStencilStateInfo_set_stencilPassOpBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_set_stencilPassOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilPassOpBack, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_DepthStencilStateInfo_set_stencilPassOpBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_DepthStencilStateInfo_set_stencilPassOpBack)

static bool js_assets_DepthStencilStateInfo_get_stencilRefBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_get_stencilRefBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilRefBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stencilRefBack, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_DepthStencilStateInfo_get_stencilRefBack)

static bool js_assets_DepthStencilStateInfo_set_stencilRefBack(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::DepthStencilStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_DepthStencilStateInfo_set_stencilRefBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilRefBack, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_DepthStencilStateInfo_set_stencilRefBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_DepthStencilStateInfo_set_stencilRefBack)


template<>
bool sevalue_to_native(const se::Value &from, cc::DepthStencilStateInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::DepthStencilStateInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("depthTest", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthTest), ctx);
    }
    json->getProperty("depthWrite", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthWrite), ctx);
    }
    json->getProperty("stencilTestFront", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilTestFront), ctx);
    }
    json->getProperty("stencilTestBack", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilTestBack), ctx);
    }
    json->getProperty("depthFunc", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthFunc), ctx);
    }
    json->getProperty("stencilFuncFront", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilFuncFront), ctx);
    }
    json->getProperty("stencilReadMaskFront", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilReadMaskFront), ctx);
    }
    json->getProperty("stencilWriteMaskFront", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilWriteMaskFront), ctx);
    }
    json->getProperty("stencilFailOpFront", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilFailOpFront), ctx);
    }
    json->getProperty("stencilZFailOpFront", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilZFailOpFront), ctx);
    }
    json->getProperty("stencilPassOpFront", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilPassOpFront), ctx);
    }
    json->getProperty("stencilRefFront", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilRefFront), ctx);
    }
    json->getProperty("stencilFuncBack", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilFuncBack), ctx);
    }
    json->getProperty("stencilReadMaskBack", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilReadMaskBack), ctx);
    }
    json->getProperty("stencilWriteMaskBack", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilWriteMaskBack), ctx);
    }
    json->getProperty("stencilFailOpBack", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilFailOpBack), ctx);
    }
    json->getProperty("stencilZFailOpBack", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilZFailOpBack), ctx);
    }
    json->getProperty("stencilPassOpBack", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilPassOpBack), ctx);
    }
    json->getProperty("stencilRefBack", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilRefBack), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_DepthStencilStateInfo_finalize)

static bool js_assets_DepthStencilStateInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::DepthStencilStateInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::DepthStencilStateInfo);
        auto cobj = ptr->get<cc::DepthStencilStateInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::DepthStencilStateInfo);
    auto cobj = ptr->get<cc::DepthStencilStateInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->depthTest), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->depthWrite), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->stencilTestFront), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->stencilTestBack), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->depthFunc), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->stencilFuncFront), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->stencilReadMaskFront), nullptr);
    }
    if (argc > 7 && !args[7].isUndefined()) {
        ok &= sevalue_to_native(args[7], &(cobj->stencilWriteMaskFront), nullptr);
    }
    if (argc > 8 && !args[8].isUndefined()) {
        ok &= sevalue_to_native(args[8], &(cobj->stencilFailOpFront), nullptr);
    }
    if (argc > 9 && !args[9].isUndefined()) {
        ok &= sevalue_to_native(args[9], &(cobj->stencilZFailOpFront), nullptr);
    }
    if (argc > 10 && !args[10].isUndefined()) {
        ok &= sevalue_to_native(args[10], &(cobj->stencilPassOpFront), nullptr);
    }
    if (argc > 11 && !args[11].isUndefined()) {
        ok &= sevalue_to_native(args[11], &(cobj->stencilRefFront), nullptr);
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
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_DepthStencilStateInfo_constructor, __jsb_cc_DepthStencilStateInfo_class, js_cc_DepthStencilStateInfo_finalize)

static bool js_cc_DepthStencilStateInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_DepthStencilStateInfo_finalize)

bool js_register_assets_DepthStencilStateInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DepthStencilStateInfo", obj, nullptr, _SE(js_assets_DepthStencilStateInfo_constructor));

    cls->defineProperty("depthTest", _SE(js_assets_DepthStencilStateInfo_get_depthTest), _SE(js_assets_DepthStencilStateInfo_set_depthTest));
    cls->defineProperty("depthWrite", _SE(js_assets_DepthStencilStateInfo_get_depthWrite), _SE(js_assets_DepthStencilStateInfo_set_depthWrite));
    cls->defineProperty("stencilTestFront", _SE(js_assets_DepthStencilStateInfo_get_stencilTestFront), _SE(js_assets_DepthStencilStateInfo_set_stencilTestFront));
    cls->defineProperty("stencilTestBack", _SE(js_assets_DepthStencilStateInfo_get_stencilTestBack), _SE(js_assets_DepthStencilStateInfo_set_stencilTestBack));
    cls->defineProperty("depthFunc", _SE(js_assets_DepthStencilStateInfo_get_depthFunc), _SE(js_assets_DepthStencilStateInfo_set_depthFunc));
    cls->defineProperty("stencilFuncFront", _SE(js_assets_DepthStencilStateInfo_get_stencilFuncFront), _SE(js_assets_DepthStencilStateInfo_set_stencilFuncFront));
    cls->defineProperty("stencilReadMaskFront", _SE(js_assets_DepthStencilStateInfo_get_stencilReadMaskFront), _SE(js_assets_DepthStencilStateInfo_set_stencilReadMaskFront));
    cls->defineProperty("stencilWriteMaskFront", _SE(js_assets_DepthStencilStateInfo_get_stencilWriteMaskFront), _SE(js_assets_DepthStencilStateInfo_set_stencilWriteMaskFront));
    cls->defineProperty("stencilFailOpFront", _SE(js_assets_DepthStencilStateInfo_get_stencilFailOpFront), _SE(js_assets_DepthStencilStateInfo_set_stencilFailOpFront));
    cls->defineProperty("stencilZFailOpFront", _SE(js_assets_DepthStencilStateInfo_get_stencilZFailOpFront), _SE(js_assets_DepthStencilStateInfo_set_stencilZFailOpFront));
    cls->defineProperty("stencilPassOpFront", _SE(js_assets_DepthStencilStateInfo_get_stencilPassOpFront), _SE(js_assets_DepthStencilStateInfo_set_stencilPassOpFront));
    cls->defineProperty("stencilRefFront", _SE(js_assets_DepthStencilStateInfo_get_stencilRefFront), _SE(js_assets_DepthStencilStateInfo_set_stencilRefFront));
    cls->defineProperty("stencilFuncBack", _SE(js_assets_DepthStencilStateInfo_get_stencilFuncBack), _SE(js_assets_DepthStencilStateInfo_set_stencilFuncBack));
    cls->defineProperty("stencilReadMaskBack", _SE(js_assets_DepthStencilStateInfo_get_stencilReadMaskBack), _SE(js_assets_DepthStencilStateInfo_set_stencilReadMaskBack));
    cls->defineProperty("stencilWriteMaskBack", _SE(js_assets_DepthStencilStateInfo_get_stencilWriteMaskBack), _SE(js_assets_DepthStencilStateInfo_set_stencilWriteMaskBack));
    cls->defineProperty("stencilFailOpBack", _SE(js_assets_DepthStencilStateInfo_get_stencilFailOpBack), _SE(js_assets_DepthStencilStateInfo_set_stencilFailOpBack));
    cls->defineProperty("stencilZFailOpBack", _SE(js_assets_DepthStencilStateInfo_get_stencilZFailOpBack), _SE(js_assets_DepthStencilStateInfo_set_stencilZFailOpBack));
    cls->defineProperty("stencilPassOpBack", _SE(js_assets_DepthStencilStateInfo_get_stencilPassOpBack), _SE(js_assets_DepthStencilStateInfo_set_stencilPassOpBack));
    cls->defineProperty("stencilRefBack", _SE(js_assets_DepthStencilStateInfo_get_stencilRefBack), _SE(js_assets_DepthStencilStateInfo_set_stencilRefBack));
    cls->defineFinalizeFunction(_SE(js_cc_DepthStencilStateInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::DepthStencilStateInfo>(cls);

    __jsb_cc_DepthStencilStateInfo_proto = cls->getProto();
    __jsb_cc_DepthStencilStateInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_BlendTargetInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_BlendTargetInfo_class = nullptr;  // NOLINT

static bool js_assets_BlendTargetInfo_get_blend(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BlendTargetInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendTargetInfo_get_blend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blend, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blend, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_BlendTargetInfo_get_blend)

static bool js_assets_BlendTargetInfo_set_blend(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::BlendTargetInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendTargetInfo_set_blend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blend, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_BlendTargetInfo_set_blend : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_BlendTargetInfo_set_blend)

static bool js_assets_BlendTargetInfo_get_blendSrc(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BlendTargetInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendTargetInfo_get_blendSrc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendSrc, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blendSrc, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_BlendTargetInfo_get_blendSrc)

static bool js_assets_BlendTargetInfo_set_blendSrc(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::BlendTargetInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendTargetInfo_set_blendSrc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendSrc, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_BlendTargetInfo_set_blendSrc : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_BlendTargetInfo_set_blendSrc)

static bool js_assets_BlendTargetInfo_get_blendDst(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BlendTargetInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendTargetInfo_get_blendDst : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendDst, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blendDst, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_BlendTargetInfo_get_blendDst)

static bool js_assets_BlendTargetInfo_set_blendDst(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::BlendTargetInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendTargetInfo_set_blendDst : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendDst, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_BlendTargetInfo_set_blendDst : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_BlendTargetInfo_set_blendDst)

static bool js_assets_BlendTargetInfo_get_blendEq(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BlendTargetInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendTargetInfo_get_blendEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendEq, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blendEq, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_BlendTargetInfo_get_blendEq)

static bool js_assets_BlendTargetInfo_set_blendEq(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::BlendTargetInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendTargetInfo_set_blendEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendEq, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_BlendTargetInfo_set_blendEq : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_BlendTargetInfo_set_blendEq)

static bool js_assets_BlendTargetInfo_get_blendSrcAlpha(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BlendTargetInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendTargetInfo_get_blendSrcAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendSrcAlpha, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blendSrcAlpha, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_BlendTargetInfo_get_blendSrcAlpha)

static bool js_assets_BlendTargetInfo_set_blendSrcAlpha(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::BlendTargetInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendTargetInfo_set_blendSrcAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendSrcAlpha, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_BlendTargetInfo_set_blendSrcAlpha : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_BlendTargetInfo_set_blendSrcAlpha)

static bool js_assets_BlendTargetInfo_get_blendDstAlpha(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BlendTargetInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendTargetInfo_get_blendDstAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendDstAlpha, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blendDstAlpha, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_BlendTargetInfo_get_blendDstAlpha)

static bool js_assets_BlendTargetInfo_set_blendDstAlpha(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::BlendTargetInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendTargetInfo_set_blendDstAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendDstAlpha, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_BlendTargetInfo_set_blendDstAlpha : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_BlendTargetInfo_set_blendDstAlpha)

static bool js_assets_BlendTargetInfo_get_blendAlphaEq(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BlendTargetInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendTargetInfo_get_blendAlphaEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendAlphaEq, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blendAlphaEq, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_BlendTargetInfo_get_blendAlphaEq)

static bool js_assets_BlendTargetInfo_set_blendAlphaEq(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::BlendTargetInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendTargetInfo_set_blendAlphaEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendAlphaEq, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_BlendTargetInfo_set_blendAlphaEq : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_BlendTargetInfo_set_blendAlphaEq)

static bool js_assets_BlendTargetInfo_get_blendColorMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BlendTargetInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendTargetInfo_get_blendColorMask : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendColorMask, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blendColorMask, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_BlendTargetInfo_get_blendColorMask)

static bool js_assets_BlendTargetInfo_set_blendColorMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::BlendTargetInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendTargetInfo_set_blendColorMask : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendColorMask, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_BlendTargetInfo_set_blendColorMask : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_BlendTargetInfo_set_blendColorMask)


template<>
bool sevalue_to_native(const se::Value &from, cc::BlendTargetInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::BlendTargetInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("blend", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blend), ctx);
    }
    json->getProperty("blendSrc", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendSrc), ctx);
    }
    json->getProperty("blendDst", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendDst), ctx);
    }
    json->getProperty("blendEq", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendEq), ctx);
    }
    json->getProperty("blendSrcAlpha", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendSrcAlpha), ctx);
    }
    json->getProperty("blendDstAlpha", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendDstAlpha), ctx);
    }
    json->getProperty("blendAlphaEq", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendAlphaEq), ctx);
    }
    json->getProperty("blendColorMask", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendColorMask), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_BlendTargetInfo_finalize)

static bool js_assets_BlendTargetInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::BlendTargetInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::BlendTargetInfo);
        auto cobj = ptr->get<cc::BlendTargetInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::BlendTargetInfo);
    auto cobj = ptr->get<cc::BlendTargetInfo>();
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
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_BlendTargetInfo_constructor, __jsb_cc_BlendTargetInfo_class, js_cc_BlendTargetInfo_finalize)

static bool js_cc_BlendTargetInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_BlendTargetInfo_finalize)

bool js_register_assets_BlendTargetInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BlendTargetInfo", obj, nullptr, _SE(js_assets_BlendTargetInfo_constructor));

    cls->defineProperty("blend", _SE(js_assets_BlendTargetInfo_get_blend), _SE(js_assets_BlendTargetInfo_set_blend));
    cls->defineProperty("blendSrc", _SE(js_assets_BlendTargetInfo_get_blendSrc), _SE(js_assets_BlendTargetInfo_set_blendSrc));
    cls->defineProperty("blendDst", _SE(js_assets_BlendTargetInfo_get_blendDst), _SE(js_assets_BlendTargetInfo_set_blendDst));
    cls->defineProperty("blendEq", _SE(js_assets_BlendTargetInfo_get_blendEq), _SE(js_assets_BlendTargetInfo_set_blendEq));
    cls->defineProperty("blendSrcAlpha", _SE(js_assets_BlendTargetInfo_get_blendSrcAlpha), _SE(js_assets_BlendTargetInfo_set_blendSrcAlpha));
    cls->defineProperty("blendDstAlpha", _SE(js_assets_BlendTargetInfo_get_blendDstAlpha), _SE(js_assets_BlendTargetInfo_set_blendDstAlpha));
    cls->defineProperty("blendAlphaEq", _SE(js_assets_BlendTargetInfo_get_blendAlphaEq), _SE(js_assets_BlendTargetInfo_set_blendAlphaEq));
    cls->defineProperty("blendColorMask", _SE(js_assets_BlendTargetInfo_get_blendColorMask), _SE(js_assets_BlendTargetInfo_set_blendColorMask));
    cls->defineFinalizeFunction(_SE(js_cc_BlendTargetInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::BlendTargetInfo>(cls);

    __jsb_cc_BlendTargetInfo_proto = cls->getProto();
    __jsb_cc_BlendTargetInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_BlendStateInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_BlendStateInfo_class = nullptr;  // NOLINT

static bool js_assets_BlendStateInfo_get_isA2C(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BlendStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendStateInfo_get_isA2C : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isA2C, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isA2C, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_BlendStateInfo_get_isA2C)

static bool js_assets_BlendStateInfo_set_isA2C(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::BlendStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendStateInfo_set_isA2C : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isA2C, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_BlendStateInfo_set_isA2C : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_BlendStateInfo_set_isA2C)

static bool js_assets_BlendStateInfo_get_isIndepend(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BlendStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendStateInfo_get_isIndepend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isIndepend, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isIndepend, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_BlendStateInfo_get_isIndepend)

static bool js_assets_BlendStateInfo_set_isIndepend(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::BlendStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendStateInfo_set_isIndepend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isIndepend, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_BlendStateInfo_set_isIndepend : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_BlendStateInfo_set_isIndepend)

static bool js_assets_BlendStateInfo_get_blendColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BlendStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendStateInfo_get_blendColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendColor, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blendColor, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_BlendStateInfo_get_blendColor)

static bool js_assets_BlendStateInfo_set_blendColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::BlendStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendStateInfo_set_blendColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendColor, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_BlendStateInfo_set_blendColor : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_BlendStateInfo_set_blendColor)

static bool js_assets_BlendStateInfo_get_targets(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BlendStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendStateInfo_get_targets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->targets, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->targets, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_BlendStateInfo_get_targets)

static bool js_assets_BlendStateInfo_set_targets(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::BlendStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BlendStateInfo_set_targets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->targets, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_BlendStateInfo_set_targets : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_BlendStateInfo_set_targets)


template<>
bool sevalue_to_native(const se::Value &from, cc::BlendStateInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::BlendStateInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("isA2C", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isA2C), ctx);
    }
    json->getProperty("isIndepend", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isIndepend), ctx);
    }
    json->getProperty("blendColor", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendColor), ctx);
    }
    json->getProperty("targets", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->targets), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_BlendStateInfo_finalize)

static bool js_assets_BlendStateInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::BlendStateInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::BlendStateInfo);
        auto cobj = ptr->get<cc::BlendStateInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::BlendStateInfo);
    auto cobj = ptr->get<cc::BlendStateInfo>();
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
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_BlendStateInfo_constructor, __jsb_cc_BlendStateInfo_class, js_cc_BlendStateInfo_finalize)

static bool js_cc_BlendStateInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_BlendStateInfo_finalize)

bool js_register_assets_BlendStateInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BlendStateInfo", obj, nullptr, _SE(js_assets_BlendStateInfo_constructor));

    cls->defineProperty("isA2C", _SE(js_assets_BlendStateInfo_get_isA2C), _SE(js_assets_BlendStateInfo_set_isA2C));
    cls->defineProperty("isIndepend", _SE(js_assets_BlendStateInfo_get_isIndepend), _SE(js_assets_BlendStateInfo_set_isIndepend));
    cls->defineProperty("blendColor", _SE(js_assets_BlendStateInfo_get_blendColor), _SE(js_assets_BlendStateInfo_set_blendColor));
    cls->defineProperty("targets", _SE(js_assets_BlendStateInfo_get_targets), _SE(js_assets_BlendStateInfo_set_targets));
    cls->defineFinalizeFunction(_SE(js_cc_BlendStateInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::BlendStateInfo>(cls);

    __jsb_cc_BlendStateInfo_proto = cls->getProto();
    __jsb_cc_BlendStateInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IPassStates_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IPassStates_class = nullptr;  // NOLINT

static bool js_assets_IPassStates_overrides(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassStates>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassStates_overrides : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::IPassInfoFull, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_IPassStates_overrides : Error processing arguments");
        cobj->overrides(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_IPassStates_overrides)

static bool js_assets_IPassStates_get_priority(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassStates>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassStates_get_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->priority, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->priority, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassStates_get_priority)

static bool js_assets_IPassStates_set_priority(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassStates>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassStates_set_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->priority, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassStates_set_priority : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassStates_set_priority)

static bool js_assets_IPassStates_get_primitive(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassStates>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassStates_get_primitive : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->primitive, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->primitive, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassStates_get_primitive)

static bool js_assets_IPassStates_set_primitive(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassStates>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassStates_set_primitive : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->primitive, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassStates_set_primitive : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassStates_set_primitive)

static bool js_assets_IPassStates_get_stage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassStates>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassStates_get_stage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stage, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stage, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassStates_get_stage)

static bool js_assets_IPassStates_set_stage(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassStates>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassStates_set_stage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stage, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassStates_set_stage : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassStates_set_stage)

static bool js_assets_IPassStates_get_rasterizerState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassStates>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassStates_get_rasterizerState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->rasterizerState, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->rasterizerState, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassStates_get_rasterizerState)

static bool js_assets_IPassStates_set_rasterizerState(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassStates>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassStates_set_rasterizerState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->rasterizerState, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassStates_set_rasterizerState : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassStates_set_rasterizerState)

static bool js_assets_IPassStates_get_depthStencilState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassStates>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassStates_get_depthStencilState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthStencilState, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthStencilState, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassStates_get_depthStencilState)

static bool js_assets_IPassStates_set_depthStencilState(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassStates>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassStates_set_depthStencilState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthStencilState, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassStates_set_depthStencilState : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassStates_set_depthStencilState)

static bool js_assets_IPassStates_get_blendState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassStates>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassStates_get_blendState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendState, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blendState, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassStates_get_blendState)

static bool js_assets_IPassStates_set_blendState(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassStates>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassStates_set_blendState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendState, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassStates_set_blendState : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassStates_set_blendState)

static bool js_assets_IPassStates_get_dynamicStates(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassStates>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassStates_get_dynamicStates : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->dynamicStates, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->dynamicStates, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassStates_get_dynamicStates)

static bool js_assets_IPassStates_set_dynamicStates(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassStates>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassStates_set_dynamicStates : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->dynamicStates, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassStates_set_dynamicStates : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassStates_set_dynamicStates)

static bool js_assets_IPassStates_get_phase(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassStates>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassStates_get_phase : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->phase, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->phase, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassStates_get_phase)

static bool js_assets_IPassStates_set_phase(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassStates>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassStates_set_phase : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->phase, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassStates_set_phase : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassStates_set_phase)


template<>
bool sevalue_to_native(const se::Value &from, cc::IPassStates * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IPassStates*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("priority", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->priority), ctx);
    }
    json->getProperty("primitive", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->primitive), ctx);
    }
    json->getProperty("stage", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stage), ctx);
    }
    json->getProperty("rasterizerState", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->rasterizerState), ctx);
    }
    json->getProperty("depthStencilState", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthStencilState), ctx);
    }
    json->getProperty("blendState", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendState), ctx);
    }
    json->getProperty("dynamicStates", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->dynamicStates), ctx);
    }
    json->getProperty("phase", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->phase), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IPassStates_finalize)

static bool js_assets_IPassStates_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IPassStates);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IPassStates);
        auto cobj = ptr->get<cc::IPassStates>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IPassStates);
    auto cobj = ptr->get<cc::IPassStates>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->priority), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->primitive), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->stage), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->rasterizerState), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->depthStencilState), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->blendState), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->dynamicStates), nullptr);
    }
    if (argc > 7 && !args[7].isUndefined()) {
        ok &= sevalue_to_native(args[7], &(cobj->phase), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IPassStates_constructor, __jsb_cc_IPassStates_class, js_cc_IPassStates_finalize)

static bool js_cc_IPassStates_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IPassStates_finalize)

bool js_register_assets_IPassStates(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IPassStates", obj, nullptr, _SE(js_assets_IPassStates_constructor));

    cls->defineProperty("priority", _SE(js_assets_IPassStates_get_priority), _SE(js_assets_IPassStates_set_priority));
    cls->defineProperty("primitive", _SE(js_assets_IPassStates_get_primitive), _SE(js_assets_IPassStates_set_primitive));
    cls->defineProperty("stage", _SE(js_assets_IPassStates_get_stage), _SE(js_assets_IPassStates_set_stage));
    cls->defineProperty("rasterizerState", _SE(js_assets_IPassStates_get_rasterizerState), _SE(js_assets_IPassStates_set_rasterizerState));
    cls->defineProperty("depthStencilState", _SE(js_assets_IPassStates_get_depthStencilState), _SE(js_assets_IPassStates_set_depthStencilState));
    cls->defineProperty("blendState", _SE(js_assets_IPassStates_get_blendState), _SE(js_assets_IPassStates_set_blendState));
    cls->defineProperty("dynamicStates", _SE(js_assets_IPassStates_get_dynamicStates), _SE(js_assets_IPassStates_set_dynamicStates));
    cls->defineProperty("phase", _SE(js_assets_IPassStates_get_phase), _SE(js_assets_IPassStates_set_phase));
    cls->defineFunction("overrides", _SE(js_assets_IPassStates_overrides));
    cls->defineFinalizeFunction(_SE(js_cc_IPassStates_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IPassStates>(cls);

    __jsb_cc_IPassStates_proto = cls->getProto();
    __jsb_cc_IPassStates_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IPassInfoFull_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IPassInfoFull_class = nullptr;  // NOLINT

static bool js_assets_IPassInfoFull_get_priority(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_get_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->priority, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->priority, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassInfoFull_get_priority)

static bool js_assets_IPassInfoFull_set_priority(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_set_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->priority, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassInfoFull_set_priority : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassInfoFull_set_priority)

static bool js_assets_IPassInfoFull_get_primitive(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_get_primitive : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->primitive, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->primitive, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassInfoFull_get_primitive)

static bool js_assets_IPassInfoFull_set_primitive(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_set_primitive : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->primitive, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassInfoFull_set_primitive : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassInfoFull_set_primitive)

static bool js_assets_IPassInfoFull_get_stage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_get_stage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stage, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stage, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassInfoFull_get_stage)

static bool js_assets_IPassInfoFull_set_stage(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_set_stage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stage, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassInfoFull_set_stage : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassInfoFull_set_stage)

static bool js_assets_IPassInfoFull_get_rasterizerState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_get_rasterizerState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->rasterizerState, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->rasterizerState, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassInfoFull_get_rasterizerState)

static bool js_assets_IPassInfoFull_set_rasterizerState(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_set_rasterizerState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->rasterizerState, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassInfoFull_set_rasterizerState : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassInfoFull_set_rasterizerState)

static bool js_assets_IPassInfoFull_get_depthStencilState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_get_depthStencilState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthStencilState, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depthStencilState, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassInfoFull_get_depthStencilState)

static bool js_assets_IPassInfoFull_set_depthStencilState(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_set_depthStencilState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthStencilState, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassInfoFull_set_depthStencilState : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassInfoFull_set_depthStencilState)

static bool js_assets_IPassInfoFull_get_blendState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_get_blendState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendState, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blendState, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassInfoFull_get_blendState)

static bool js_assets_IPassInfoFull_set_blendState(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_set_blendState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendState, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassInfoFull_set_blendState : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassInfoFull_set_blendState)

static bool js_assets_IPassInfoFull_get_dynamicStates(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_get_dynamicStates : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->dynamicStates, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->dynamicStates, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassInfoFull_get_dynamicStates)

static bool js_assets_IPassInfoFull_set_dynamicStates(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_set_dynamicStates : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->dynamicStates, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassInfoFull_set_dynamicStates : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassInfoFull_set_dynamicStates)

static bool js_assets_IPassInfoFull_get_phase(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_get_phase : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->phase, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->phase, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassInfoFull_get_phase)

static bool js_assets_IPassInfoFull_set_phase(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_set_phase : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->phase, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassInfoFull_set_phase : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassInfoFull_set_phase)

static bool js_assets_IPassInfoFull_get_program(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_get_program : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->program, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->program, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassInfoFull_get_program)

static bool js_assets_IPassInfoFull_set_program(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_set_program : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->program, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassInfoFull_set_program : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassInfoFull_set_program)

static bool js_assets_IPassInfoFull_get_embeddedMacros(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_get_embeddedMacros : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->embeddedMacros, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->embeddedMacros, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassInfoFull_get_embeddedMacros)

static bool js_assets_IPassInfoFull_set_embeddedMacros(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_set_embeddedMacros : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->embeddedMacros, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassInfoFull_set_embeddedMacros : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassInfoFull_set_embeddedMacros)

static bool js_assets_IPassInfoFull_get_propertyIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_get_propertyIndex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->propertyIndex, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->propertyIndex, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassInfoFull_get_propertyIndex)

static bool js_assets_IPassInfoFull_set_propertyIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_set_propertyIndex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->propertyIndex, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassInfoFull_set_propertyIndex : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassInfoFull_set_propertyIndex)

static bool js_assets_IPassInfoFull_get_switch_(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_get_switch_ : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->switch_, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->switch_, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassInfoFull_get_switch_)

static bool js_assets_IPassInfoFull_set_switch_(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_set_switch_ : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->switch_, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassInfoFull_set_switch_ : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassInfoFull_set_switch_)

static bool js_assets_IPassInfoFull_get_properties(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_get_properties : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->properties, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->properties, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassInfoFull_get_properties)

static bool js_assets_IPassInfoFull_set_properties(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_set_properties : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->properties, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassInfoFull_set_properties : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassInfoFull_set_properties)

static bool js_assets_IPassInfoFull_get_passIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_get_passIndex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->passIndex, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->passIndex, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassInfoFull_get_passIndex)

static bool js_assets_IPassInfoFull_set_passIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_set_passIndex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->passIndex, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassInfoFull_set_passIndex : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassInfoFull_set_passIndex)

static bool js_assets_IPassInfoFull_get_defines(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_get_defines : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->defines, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->defines, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassInfoFull_get_defines)

static bool js_assets_IPassInfoFull_set_defines(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_set_defines : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->defines, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassInfoFull_set_defines : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassInfoFull_set_defines)

static bool js_assets_IPassInfoFull_get_stateOverrides(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_get_stateOverrides : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stateOverrides, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stateOverrides, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IPassInfoFull_get_stateOverrides)

static bool js_assets_IPassInfoFull_set_stateOverrides(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IPassInfoFull>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IPassInfoFull_set_stateOverrides : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stateOverrides, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IPassInfoFull_set_stateOverrides : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IPassInfoFull_set_stateOverrides)


template<>
bool sevalue_to_native(const se::Value &from, cc::IPassInfoFull * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IPassInfoFull*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("priority", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->priority), ctx);
    }
    json->getProperty("primitive", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->primitive), ctx);
    }
    json->getProperty("stage", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stage), ctx);
    }
    json->getProperty("rasterizerState", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->rasterizerState), ctx);
    }
    json->getProperty("depthStencilState", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthStencilState), ctx);
    }
    json->getProperty("blendState", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendState), ctx);
    }
    json->getProperty("dynamicStates", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->dynamicStates), ctx);
    }
    json->getProperty("phase", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->phase), ctx);
    }
    json->getProperty("program", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->program), ctx);
    }
    json->getProperty("embeddedMacros", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->embeddedMacros), ctx);
    }
    json->getProperty("propertyIndex", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->propertyIndex), ctx);
    }
    json->getProperty("switch", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->switch_), ctx);
    }
    json->getProperty("properties", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->properties), ctx);
    }
    json->getProperty("passIndex", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->passIndex), ctx);
    }
    json->getProperty("defines", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->defines), ctx);
    }
    json->getProperty("stateOverrides", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stateOverrides), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IPassInfoFull_finalize)

static bool js_assets_IPassInfoFull_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IPassInfoFull);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IPassInfoFull);
        auto cobj = ptr->get<cc::IPassInfoFull>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IPassInfoFull);
    auto cobj = ptr->get<cc::IPassInfoFull>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->priority), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->primitive), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->stage), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->rasterizerState), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->depthStencilState), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->blendState), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->dynamicStates), nullptr);
    }
    if (argc > 7 && !args[7].isUndefined()) {
        ok &= sevalue_to_native(args[7], &(cobj->phase), nullptr);
    }
    if (argc > 8 && !args[8].isUndefined()) {
        ok &= sevalue_to_native(args[8], &(cobj->program), nullptr);
    }
    if (argc > 9 && !args[9].isUndefined()) {
        ok &= sevalue_to_native(args[9], &(cobj->embeddedMacros), nullptr);
    }
    if (argc > 10 && !args[10].isUndefined()) {
        ok &= sevalue_to_native(args[10], &(cobj->propertyIndex), nullptr);
    }
    if (argc > 11 && !args[11].isUndefined()) {
        ok &= sevalue_to_native(args[11], &(cobj->switch_), nullptr);
    }
    if (argc > 12 && !args[12].isUndefined()) {
        ok &= sevalue_to_native(args[12], &(cobj->properties), nullptr);
    }
    if (argc > 13 && !args[13].isUndefined()) {
        ok &= sevalue_to_native(args[13], &(cobj->passIndex), nullptr);
    }
    if (argc > 14 && !args[14].isUndefined()) {
        ok &= sevalue_to_native(args[14], &(cobj->defines), nullptr);
    }
    if (argc > 15 && !args[15].isUndefined()) {
        ok &= sevalue_to_native(args[15], &(cobj->stateOverrides), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IPassInfoFull_constructor, __jsb_cc_IPassInfoFull_class, js_cc_IPassInfoFull_finalize)

static bool js_cc_IPassInfoFull_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IPassInfoFull_finalize)

bool js_register_assets_IPassInfoFull(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IPassInfoFull", obj, nullptr, _SE(js_assets_IPassInfoFull_constructor));

    cls->defineProperty("priority", _SE(js_assets_IPassInfoFull_get_priority), _SE(js_assets_IPassInfoFull_set_priority));
    cls->defineProperty("primitive", _SE(js_assets_IPassInfoFull_get_primitive), _SE(js_assets_IPassInfoFull_set_primitive));
    cls->defineProperty("stage", _SE(js_assets_IPassInfoFull_get_stage), _SE(js_assets_IPassInfoFull_set_stage));
    cls->defineProperty("rasterizerState", _SE(js_assets_IPassInfoFull_get_rasterizerState), _SE(js_assets_IPassInfoFull_set_rasterizerState));
    cls->defineProperty("depthStencilState", _SE(js_assets_IPassInfoFull_get_depthStencilState), _SE(js_assets_IPassInfoFull_set_depthStencilState));
    cls->defineProperty("blendState", _SE(js_assets_IPassInfoFull_get_blendState), _SE(js_assets_IPassInfoFull_set_blendState));
    cls->defineProperty("dynamicStates", _SE(js_assets_IPassInfoFull_get_dynamicStates), _SE(js_assets_IPassInfoFull_set_dynamicStates));
    cls->defineProperty("phase", _SE(js_assets_IPassInfoFull_get_phase), _SE(js_assets_IPassInfoFull_set_phase));
    cls->defineProperty("program", _SE(js_assets_IPassInfoFull_get_program), _SE(js_assets_IPassInfoFull_set_program));
    cls->defineProperty("embeddedMacros", _SE(js_assets_IPassInfoFull_get_embeddedMacros), _SE(js_assets_IPassInfoFull_set_embeddedMacros));
    cls->defineProperty("propertyIndex", _SE(js_assets_IPassInfoFull_get_propertyIndex), _SE(js_assets_IPassInfoFull_set_propertyIndex));
    cls->defineProperty("switch", _SE(js_assets_IPassInfoFull_get_switch_), _SE(js_assets_IPassInfoFull_set_switch_));
    cls->defineProperty("properties", _SE(js_assets_IPassInfoFull_get_properties), _SE(js_assets_IPassInfoFull_set_properties));
    cls->defineProperty("passIndex", _SE(js_assets_IPassInfoFull_get_passIndex), _SE(js_assets_IPassInfoFull_set_passIndex));
    cls->defineProperty("defines", _SE(js_assets_IPassInfoFull_get_defines), _SE(js_assets_IPassInfoFull_set_defines));
    cls->defineProperty("stateOverrides", _SE(js_assets_IPassInfoFull_get_stateOverrides), _SE(js_assets_IPassInfoFull_set_stateOverrides));
    cls->defineFinalizeFunction(_SE(js_cc_IPassInfoFull_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IPassInfoFull>(cls);

    __jsb_cc_IPassInfoFull_proto = cls->getProto();
    __jsb_cc_IPassInfoFull_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_ITechniqueInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_ITechniqueInfo_class = nullptr;  // NOLINT

static bool js_assets_ITechniqueInfo_get_passes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITechniqueInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITechniqueInfo_get_passes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->passes, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->passes, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITechniqueInfo_get_passes)

static bool js_assets_ITechniqueInfo_set_passes(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITechniqueInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITechniqueInfo_set_passes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->passes, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITechniqueInfo_set_passes : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITechniqueInfo_set_passes)

static bool js_assets_ITechniqueInfo_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITechniqueInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITechniqueInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITechniqueInfo_get_name)

static bool js_assets_ITechniqueInfo_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITechniqueInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITechniqueInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITechniqueInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITechniqueInfo_set_name)


template<>
bool sevalue_to_native(const se::Value &from, cc::ITechniqueInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::ITechniqueInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("passes", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->passes), ctx);
    }
    json->getProperty("name", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_ITechniqueInfo_finalize)

static bool js_assets_ITechniqueInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITechniqueInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITechniqueInfo);
        auto cobj = ptr->get<cc::ITechniqueInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITechniqueInfo);
    auto cobj = ptr->get<cc::ITechniqueInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->passes), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->name), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_ITechniqueInfo_constructor, __jsb_cc_ITechniqueInfo_class, js_cc_ITechniqueInfo_finalize)

static bool js_cc_ITechniqueInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_ITechniqueInfo_finalize)

bool js_register_assets_ITechniqueInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ITechniqueInfo", obj, nullptr, _SE(js_assets_ITechniqueInfo_constructor));

    cls->defineProperty("passes", _SE(js_assets_ITechniqueInfo_get_passes), _SE(js_assets_ITechniqueInfo_set_passes));
    cls->defineProperty("name", _SE(js_assets_ITechniqueInfo_get_name), _SE(js_assets_ITechniqueInfo_set_name));
    cls->defineFinalizeFunction(_SE(js_cc_ITechniqueInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::ITechniqueInfo>(cls);

    __jsb_cc_ITechniqueInfo_proto = cls->getProto();
    __jsb_cc_ITechniqueInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IBlockInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IBlockInfo_class = nullptr;  // NOLINT

static bool js_assets_IBlockInfo_get_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IBlockInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBlockInfo_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->binding, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->binding, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IBlockInfo_get_binding)

static bool js_assets_IBlockInfo_set_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IBlockInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBlockInfo_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->binding, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IBlockInfo_set_binding : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IBlockInfo_set_binding)

static bool js_assets_IBlockInfo_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IBlockInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBlockInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IBlockInfo_get_name)

static bool js_assets_IBlockInfo_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IBlockInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBlockInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IBlockInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IBlockInfo_set_name)

static bool js_assets_IBlockInfo_get_members(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IBlockInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBlockInfo_get_members : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->members, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->members, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IBlockInfo_get_members)

static bool js_assets_IBlockInfo_set_members(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IBlockInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBlockInfo_set_members : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->members, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IBlockInfo_set_members : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IBlockInfo_set_members)

static bool js_assets_IBlockInfo_get_stageFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IBlockInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBlockInfo_get_stageFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stageFlags, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stageFlags, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IBlockInfo_get_stageFlags)

static bool js_assets_IBlockInfo_set_stageFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IBlockInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBlockInfo_set_stageFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stageFlags, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IBlockInfo_set_stageFlags : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IBlockInfo_set_stageFlags)


template<>
bool sevalue_to_native(const se::Value &from, cc::IBlockInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IBlockInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("binding", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->binding), ctx);
    }
    json->getProperty("name", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("members", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->members), ctx);
    }
    json->getProperty("stageFlags", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stageFlags), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IBlockInfo_finalize)

static bool js_assets_IBlockInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IBlockInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IBlockInfo);
        auto cobj = ptr->get<cc::IBlockInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IBlockInfo);
    auto cobj = ptr->get<cc::IBlockInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->binding), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->name), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->members), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->stageFlags), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IBlockInfo_constructor, __jsb_cc_IBlockInfo_class, js_cc_IBlockInfo_finalize)

static bool js_cc_IBlockInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IBlockInfo_finalize)

bool js_register_assets_IBlockInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IBlockInfo", obj, nullptr, _SE(js_assets_IBlockInfo_constructor));

    cls->defineProperty("binding", _SE(js_assets_IBlockInfo_get_binding), _SE(js_assets_IBlockInfo_set_binding));
    cls->defineProperty("name", _SE(js_assets_IBlockInfo_get_name), _SE(js_assets_IBlockInfo_set_name));
    cls->defineProperty("members", _SE(js_assets_IBlockInfo_get_members), _SE(js_assets_IBlockInfo_set_members));
    cls->defineProperty("stageFlags", _SE(js_assets_IBlockInfo_get_stageFlags), _SE(js_assets_IBlockInfo_set_stageFlags));
    cls->defineFinalizeFunction(_SE(js_cc_IBlockInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IBlockInfo>(cls);

    __jsb_cc_IBlockInfo_proto = cls->getProto();
    __jsb_cc_IBlockInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_ISamplerTextureInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_ISamplerTextureInfo_class = nullptr;  // NOLINT

static bool js_assets_ISamplerTextureInfo_get_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ISamplerTextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISamplerTextureInfo_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->binding, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->binding, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ISamplerTextureInfo_get_binding)

static bool js_assets_ISamplerTextureInfo_set_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ISamplerTextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISamplerTextureInfo_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->binding, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ISamplerTextureInfo_set_binding : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ISamplerTextureInfo_set_binding)

static bool js_assets_ISamplerTextureInfo_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ISamplerTextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISamplerTextureInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ISamplerTextureInfo_get_name)

static bool js_assets_ISamplerTextureInfo_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ISamplerTextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISamplerTextureInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ISamplerTextureInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ISamplerTextureInfo_set_name)

static bool js_assets_ISamplerTextureInfo_get_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ISamplerTextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISamplerTextureInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->type, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ISamplerTextureInfo_get_type)

static bool js_assets_ISamplerTextureInfo_set_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ISamplerTextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISamplerTextureInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->type, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ISamplerTextureInfo_set_type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ISamplerTextureInfo_set_type)

static bool js_assets_ISamplerTextureInfo_get_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ISamplerTextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISamplerTextureInfo_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->count, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ISamplerTextureInfo_get_count)

static bool js_assets_ISamplerTextureInfo_set_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ISamplerTextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISamplerTextureInfo_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ISamplerTextureInfo_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ISamplerTextureInfo_set_count)

static bool js_assets_ISamplerTextureInfo_get_stageFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ISamplerTextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISamplerTextureInfo_get_stageFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stageFlags, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stageFlags, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ISamplerTextureInfo_get_stageFlags)

static bool js_assets_ISamplerTextureInfo_set_stageFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ISamplerTextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISamplerTextureInfo_set_stageFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stageFlags, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ISamplerTextureInfo_set_stageFlags : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ISamplerTextureInfo_set_stageFlags)


template<>
bool sevalue_to_native(const se::Value &from, cc::ISamplerTextureInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::ISamplerTextureInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("binding", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->binding), ctx);
    }
    json->getProperty("name", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("type", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    json->getProperty("count", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    json->getProperty("stageFlags", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stageFlags), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_ISamplerTextureInfo_finalize)

static bool js_assets_ISamplerTextureInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ISamplerTextureInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ISamplerTextureInfo);
        auto cobj = ptr->get<cc::ISamplerTextureInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ISamplerTextureInfo);
    auto cobj = ptr->get<cc::ISamplerTextureInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->binding), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->name), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->type), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->count), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->stageFlags), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_ISamplerTextureInfo_constructor, __jsb_cc_ISamplerTextureInfo_class, js_cc_ISamplerTextureInfo_finalize)

static bool js_cc_ISamplerTextureInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_ISamplerTextureInfo_finalize)

bool js_register_assets_ISamplerTextureInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ISamplerTextureInfo", obj, nullptr, _SE(js_assets_ISamplerTextureInfo_constructor));

    cls->defineProperty("binding", _SE(js_assets_ISamplerTextureInfo_get_binding), _SE(js_assets_ISamplerTextureInfo_set_binding));
    cls->defineProperty("name", _SE(js_assets_ISamplerTextureInfo_get_name), _SE(js_assets_ISamplerTextureInfo_set_name));
    cls->defineProperty("type", _SE(js_assets_ISamplerTextureInfo_get_type), _SE(js_assets_ISamplerTextureInfo_set_type));
    cls->defineProperty("count", _SE(js_assets_ISamplerTextureInfo_get_count), _SE(js_assets_ISamplerTextureInfo_set_count));
    cls->defineProperty("stageFlags", _SE(js_assets_ISamplerTextureInfo_get_stageFlags), _SE(js_assets_ISamplerTextureInfo_set_stageFlags));
    cls->defineFinalizeFunction(_SE(js_cc_ISamplerTextureInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::ISamplerTextureInfo>(cls);

    __jsb_cc_ISamplerTextureInfo_proto = cls->getProto();
    __jsb_cc_ISamplerTextureInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_ITextureInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_ITextureInfo_class = nullptr;  // NOLINT

static bool js_assets_ITextureInfo_get_set(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureInfo_get_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->set, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->set, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureInfo_get_set)

static bool js_assets_ITextureInfo_set_set(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureInfo_set_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->set, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureInfo_set_set : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureInfo_set_set)

static bool js_assets_ITextureInfo_get_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureInfo_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->binding, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->binding, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureInfo_get_binding)

static bool js_assets_ITextureInfo_set_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureInfo_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->binding, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureInfo_set_binding : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureInfo_set_binding)

static bool js_assets_ITextureInfo_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureInfo_get_name)

static bool js_assets_ITextureInfo_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureInfo_set_name)

static bool js_assets_ITextureInfo_get_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->type, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureInfo_get_type)

static bool js_assets_ITextureInfo_set_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->type, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureInfo_set_type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureInfo_set_type)

static bool js_assets_ITextureInfo_get_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureInfo_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->count, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureInfo_get_count)

static bool js_assets_ITextureInfo_set_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureInfo_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureInfo_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureInfo_set_count)

static bool js_assets_ITextureInfo_get_stageFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureInfo_get_stageFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stageFlags, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stageFlags, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureInfo_get_stageFlags)

static bool js_assets_ITextureInfo_set_stageFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureInfo_set_stageFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stageFlags, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureInfo_set_stageFlags : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureInfo_set_stageFlags)


template<>
bool sevalue_to_native(const se::Value &from, cc::ITextureInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::ITextureInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("set", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->set), ctx);
    }
    json->getProperty("binding", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->binding), ctx);
    }
    json->getProperty("name", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("type", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    json->getProperty("count", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    json->getProperty("stageFlags", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stageFlags), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_ITextureInfo_finalize)

static bool js_assets_ITextureInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITextureInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITextureInfo);
        auto cobj = ptr->get<cc::ITextureInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITextureInfo);
    auto cobj = ptr->get<cc::ITextureInfo>();
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
        ok &= sevalue_to_native(args[5], &(cobj->stageFlags), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_ITextureInfo_constructor, __jsb_cc_ITextureInfo_class, js_cc_ITextureInfo_finalize)

static bool js_cc_ITextureInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_ITextureInfo_finalize)

bool js_register_assets_ITextureInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ITextureInfo", obj, nullptr, _SE(js_assets_ITextureInfo_constructor));

    cls->defineProperty("set", _SE(js_assets_ITextureInfo_get_set), _SE(js_assets_ITextureInfo_set_set));
    cls->defineProperty("binding", _SE(js_assets_ITextureInfo_get_binding), _SE(js_assets_ITextureInfo_set_binding));
    cls->defineProperty("name", _SE(js_assets_ITextureInfo_get_name), _SE(js_assets_ITextureInfo_set_name));
    cls->defineProperty("type", _SE(js_assets_ITextureInfo_get_type), _SE(js_assets_ITextureInfo_set_type));
    cls->defineProperty("count", _SE(js_assets_ITextureInfo_get_count), _SE(js_assets_ITextureInfo_set_count));
    cls->defineProperty("stageFlags", _SE(js_assets_ITextureInfo_get_stageFlags), _SE(js_assets_ITextureInfo_set_stageFlags));
    cls->defineFinalizeFunction(_SE(js_cc_ITextureInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::ITextureInfo>(cls);

    __jsb_cc_ITextureInfo_proto = cls->getProto();
    __jsb_cc_ITextureInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_ISamplerInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_ISamplerInfo_class = nullptr;  // NOLINT

static bool js_assets_ISamplerInfo_get_set(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ISamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISamplerInfo_get_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->set, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->set, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ISamplerInfo_get_set)

static bool js_assets_ISamplerInfo_set_set(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ISamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISamplerInfo_set_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->set, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ISamplerInfo_set_set : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ISamplerInfo_set_set)

static bool js_assets_ISamplerInfo_get_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ISamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISamplerInfo_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->binding, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->binding, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ISamplerInfo_get_binding)

static bool js_assets_ISamplerInfo_set_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ISamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISamplerInfo_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->binding, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ISamplerInfo_set_binding : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ISamplerInfo_set_binding)

static bool js_assets_ISamplerInfo_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ISamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISamplerInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ISamplerInfo_get_name)

static bool js_assets_ISamplerInfo_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ISamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISamplerInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ISamplerInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ISamplerInfo_set_name)

static bool js_assets_ISamplerInfo_get_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ISamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISamplerInfo_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->count, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ISamplerInfo_get_count)

static bool js_assets_ISamplerInfo_set_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ISamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISamplerInfo_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ISamplerInfo_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ISamplerInfo_set_count)

static bool js_assets_ISamplerInfo_get_stageFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ISamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISamplerInfo_get_stageFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stageFlags, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stageFlags, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ISamplerInfo_get_stageFlags)

static bool js_assets_ISamplerInfo_set_stageFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ISamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISamplerInfo_set_stageFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stageFlags, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ISamplerInfo_set_stageFlags : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ISamplerInfo_set_stageFlags)


template<>
bool sevalue_to_native(const se::Value &from, cc::ISamplerInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::ISamplerInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("set", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->set), ctx);
    }
    json->getProperty("binding", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->binding), ctx);
    }
    json->getProperty("name", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("count", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    json->getProperty("stageFlags", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stageFlags), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_ISamplerInfo_finalize)

static bool js_assets_ISamplerInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ISamplerInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ISamplerInfo);
        auto cobj = ptr->get<cc::ISamplerInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ISamplerInfo);
    auto cobj = ptr->get<cc::ISamplerInfo>();
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
        ok &= sevalue_to_native(args[4], &(cobj->stageFlags), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_ISamplerInfo_constructor, __jsb_cc_ISamplerInfo_class, js_cc_ISamplerInfo_finalize)

static bool js_cc_ISamplerInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_ISamplerInfo_finalize)

bool js_register_assets_ISamplerInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ISamplerInfo", obj, nullptr, _SE(js_assets_ISamplerInfo_constructor));

    cls->defineProperty("set", _SE(js_assets_ISamplerInfo_get_set), _SE(js_assets_ISamplerInfo_set_set));
    cls->defineProperty("binding", _SE(js_assets_ISamplerInfo_get_binding), _SE(js_assets_ISamplerInfo_set_binding));
    cls->defineProperty("name", _SE(js_assets_ISamplerInfo_get_name), _SE(js_assets_ISamplerInfo_set_name));
    cls->defineProperty("count", _SE(js_assets_ISamplerInfo_get_count), _SE(js_assets_ISamplerInfo_set_count));
    cls->defineProperty("stageFlags", _SE(js_assets_ISamplerInfo_get_stageFlags), _SE(js_assets_ISamplerInfo_set_stageFlags));
    cls->defineFinalizeFunction(_SE(js_cc_ISamplerInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::ISamplerInfo>(cls);

    __jsb_cc_ISamplerInfo_proto = cls->getProto();
    __jsb_cc_ISamplerInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IBufferInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IBufferInfo_class = nullptr;  // NOLINT

static bool js_assets_IBufferInfo_get_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IBufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBufferInfo_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->binding, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->binding, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IBufferInfo_get_binding)

static bool js_assets_IBufferInfo_set_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IBufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBufferInfo_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->binding, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IBufferInfo_set_binding : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IBufferInfo_set_binding)

static bool js_assets_IBufferInfo_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IBufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBufferInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IBufferInfo_get_name)

static bool js_assets_IBufferInfo_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IBufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBufferInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IBufferInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IBufferInfo_set_name)

static bool js_assets_IBufferInfo_get_memoryAccess(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IBufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBufferInfo_get_memoryAccess : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->memoryAccess, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->memoryAccess, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IBufferInfo_get_memoryAccess)

static bool js_assets_IBufferInfo_set_memoryAccess(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IBufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBufferInfo_set_memoryAccess : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->memoryAccess, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IBufferInfo_set_memoryAccess : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IBufferInfo_set_memoryAccess)

static bool js_assets_IBufferInfo_get_stageFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IBufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBufferInfo_get_stageFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stageFlags, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stageFlags, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IBufferInfo_get_stageFlags)

static bool js_assets_IBufferInfo_set_stageFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IBufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBufferInfo_set_stageFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stageFlags, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IBufferInfo_set_stageFlags : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IBufferInfo_set_stageFlags)


template<>
bool sevalue_to_native(const se::Value &from, cc::IBufferInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IBufferInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("binding", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->binding), ctx);
    }
    json->getProperty("name", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("memoryAccess", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->memoryAccess), ctx);
    }
    json->getProperty("stageFlags", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stageFlags), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IBufferInfo_finalize)

static bool js_assets_IBufferInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IBufferInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IBufferInfo);
        auto cobj = ptr->get<cc::IBufferInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IBufferInfo);
    auto cobj = ptr->get<cc::IBufferInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->binding), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->name), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->memoryAccess), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->stageFlags), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IBufferInfo_constructor, __jsb_cc_IBufferInfo_class, js_cc_IBufferInfo_finalize)

static bool js_cc_IBufferInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IBufferInfo_finalize)

bool js_register_assets_IBufferInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IBufferInfo", obj, nullptr, _SE(js_assets_IBufferInfo_constructor));

    cls->defineProperty("binding", _SE(js_assets_IBufferInfo_get_binding), _SE(js_assets_IBufferInfo_set_binding));
    cls->defineProperty("name", _SE(js_assets_IBufferInfo_get_name), _SE(js_assets_IBufferInfo_set_name));
    cls->defineProperty("memoryAccess", _SE(js_assets_IBufferInfo_get_memoryAccess), _SE(js_assets_IBufferInfo_set_memoryAccess));
    cls->defineProperty("stageFlags", _SE(js_assets_IBufferInfo_get_stageFlags), _SE(js_assets_IBufferInfo_set_stageFlags));
    cls->defineFinalizeFunction(_SE(js_cc_IBufferInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IBufferInfo>(cls);

    __jsb_cc_IBufferInfo_proto = cls->getProto();
    __jsb_cc_IBufferInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IImageInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IImageInfo_class = nullptr;  // NOLINT

static bool js_assets_IImageInfo_get_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IImageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IImageInfo_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->binding, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->binding, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IImageInfo_get_binding)

static bool js_assets_IImageInfo_set_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IImageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IImageInfo_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->binding, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IImageInfo_set_binding : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IImageInfo_set_binding)

static bool js_assets_IImageInfo_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IImageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IImageInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IImageInfo_get_name)

static bool js_assets_IImageInfo_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IImageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IImageInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IImageInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IImageInfo_set_name)

static bool js_assets_IImageInfo_get_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IImageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IImageInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->type, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IImageInfo_get_type)

static bool js_assets_IImageInfo_set_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IImageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IImageInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->type, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IImageInfo_set_type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IImageInfo_set_type)

static bool js_assets_IImageInfo_get_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IImageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IImageInfo_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->count, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IImageInfo_get_count)

static bool js_assets_IImageInfo_set_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IImageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IImageInfo_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IImageInfo_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IImageInfo_set_count)

static bool js_assets_IImageInfo_get_memoryAccess(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IImageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IImageInfo_get_memoryAccess : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->memoryAccess, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->memoryAccess, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IImageInfo_get_memoryAccess)

static bool js_assets_IImageInfo_set_memoryAccess(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IImageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IImageInfo_set_memoryAccess : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->memoryAccess, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IImageInfo_set_memoryAccess : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IImageInfo_set_memoryAccess)

static bool js_assets_IImageInfo_get_stageFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IImageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IImageInfo_get_stageFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stageFlags, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stageFlags, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IImageInfo_get_stageFlags)

static bool js_assets_IImageInfo_set_stageFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IImageInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IImageInfo_set_stageFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stageFlags, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IImageInfo_set_stageFlags : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IImageInfo_set_stageFlags)


template<>
bool sevalue_to_native(const se::Value &from, cc::IImageInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IImageInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("binding", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->binding), ctx);
    }
    json->getProperty("name", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("type", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    json->getProperty("count", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    json->getProperty("memoryAccess", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->memoryAccess), ctx);
    }
    json->getProperty("stageFlags", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stageFlags), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IImageInfo_finalize)

static bool js_assets_IImageInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IImageInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IImageInfo);
        auto cobj = ptr->get<cc::IImageInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IImageInfo);
    auto cobj = ptr->get<cc::IImageInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->binding), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->name), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->type), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->count), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->memoryAccess), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->stageFlags), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IImageInfo_constructor, __jsb_cc_IImageInfo_class, js_cc_IImageInfo_finalize)

static bool js_cc_IImageInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IImageInfo_finalize)

bool js_register_assets_IImageInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IImageInfo", obj, nullptr, _SE(js_assets_IImageInfo_constructor));

    cls->defineProperty("binding", _SE(js_assets_IImageInfo_get_binding), _SE(js_assets_IImageInfo_set_binding));
    cls->defineProperty("name", _SE(js_assets_IImageInfo_get_name), _SE(js_assets_IImageInfo_set_name));
    cls->defineProperty("type", _SE(js_assets_IImageInfo_get_type), _SE(js_assets_IImageInfo_set_type));
    cls->defineProperty("count", _SE(js_assets_IImageInfo_get_count), _SE(js_assets_IImageInfo_set_count));
    cls->defineProperty("memoryAccess", _SE(js_assets_IImageInfo_get_memoryAccess), _SE(js_assets_IImageInfo_set_memoryAccess));
    cls->defineProperty("stageFlags", _SE(js_assets_IImageInfo_get_stageFlags), _SE(js_assets_IImageInfo_set_stageFlags));
    cls->defineFinalizeFunction(_SE(js_cc_IImageInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IImageInfo>(cls);

    __jsb_cc_IImageInfo_proto = cls->getProto();
    __jsb_cc_IImageInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IInputAttachmentInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IInputAttachmentInfo_class = nullptr;  // NOLINT

static bool js_assets_IInputAttachmentInfo_get_set(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IInputAttachmentInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IInputAttachmentInfo_get_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->set, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->set, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IInputAttachmentInfo_get_set)

static bool js_assets_IInputAttachmentInfo_set_set(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IInputAttachmentInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IInputAttachmentInfo_set_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->set, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IInputAttachmentInfo_set_set : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IInputAttachmentInfo_set_set)

static bool js_assets_IInputAttachmentInfo_get_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IInputAttachmentInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IInputAttachmentInfo_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->binding, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->binding, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IInputAttachmentInfo_get_binding)

static bool js_assets_IInputAttachmentInfo_set_binding(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IInputAttachmentInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IInputAttachmentInfo_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->binding, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IInputAttachmentInfo_set_binding : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IInputAttachmentInfo_set_binding)

static bool js_assets_IInputAttachmentInfo_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IInputAttachmentInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IInputAttachmentInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IInputAttachmentInfo_get_name)

static bool js_assets_IInputAttachmentInfo_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IInputAttachmentInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IInputAttachmentInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IInputAttachmentInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IInputAttachmentInfo_set_name)

static bool js_assets_IInputAttachmentInfo_get_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IInputAttachmentInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IInputAttachmentInfo_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->count, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IInputAttachmentInfo_get_count)

static bool js_assets_IInputAttachmentInfo_set_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IInputAttachmentInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IInputAttachmentInfo_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IInputAttachmentInfo_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IInputAttachmentInfo_set_count)

static bool js_assets_IInputAttachmentInfo_get_stageFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IInputAttachmentInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IInputAttachmentInfo_get_stageFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stageFlags, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stageFlags, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IInputAttachmentInfo_get_stageFlags)

static bool js_assets_IInputAttachmentInfo_set_stageFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IInputAttachmentInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IInputAttachmentInfo_set_stageFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stageFlags, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IInputAttachmentInfo_set_stageFlags : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IInputAttachmentInfo_set_stageFlags)


template<>
bool sevalue_to_native(const se::Value &from, cc::IInputAttachmentInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IInputAttachmentInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("set", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->set), ctx);
    }
    json->getProperty("binding", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->binding), ctx);
    }
    json->getProperty("name", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("count", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    json->getProperty("stageFlags", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stageFlags), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IInputAttachmentInfo_finalize)

static bool js_assets_IInputAttachmentInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IInputAttachmentInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IInputAttachmentInfo);
        auto cobj = ptr->get<cc::IInputAttachmentInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IInputAttachmentInfo);
    auto cobj = ptr->get<cc::IInputAttachmentInfo>();
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
        ok &= sevalue_to_native(args[4], &(cobj->stageFlags), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IInputAttachmentInfo_constructor, __jsb_cc_IInputAttachmentInfo_class, js_cc_IInputAttachmentInfo_finalize)

static bool js_cc_IInputAttachmentInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IInputAttachmentInfo_finalize)

bool js_register_assets_IInputAttachmentInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IInputAttachmentInfo", obj, nullptr, _SE(js_assets_IInputAttachmentInfo_constructor));

    cls->defineProperty("set", _SE(js_assets_IInputAttachmentInfo_get_set), _SE(js_assets_IInputAttachmentInfo_set_set));
    cls->defineProperty("binding", _SE(js_assets_IInputAttachmentInfo_get_binding), _SE(js_assets_IInputAttachmentInfo_set_binding));
    cls->defineProperty("name", _SE(js_assets_IInputAttachmentInfo_get_name), _SE(js_assets_IInputAttachmentInfo_set_name));
    cls->defineProperty("count", _SE(js_assets_IInputAttachmentInfo_get_count), _SE(js_assets_IInputAttachmentInfo_set_count));
    cls->defineProperty("stageFlags", _SE(js_assets_IInputAttachmentInfo_get_stageFlags), _SE(js_assets_IInputAttachmentInfo_set_stageFlags));
    cls->defineFinalizeFunction(_SE(js_cc_IInputAttachmentInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IInputAttachmentInfo>(cls);

    __jsb_cc_IInputAttachmentInfo_proto = cls->getProto();
    __jsb_cc_IInputAttachmentInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IAttributeInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IAttributeInfo_class = nullptr;  // NOLINT

static bool js_assets_IAttributeInfo_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IAttributeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IAttributeInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IAttributeInfo_get_name)

static bool js_assets_IAttributeInfo_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IAttributeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IAttributeInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IAttributeInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IAttributeInfo_set_name)

static bool js_assets_IAttributeInfo_get_format(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IAttributeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IAttributeInfo_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->format, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->format, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IAttributeInfo_get_format)

static bool js_assets_IAttributeInfo_set_format(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IAttributeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IAttributeInfo_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->format, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IAttributeInfo_set_format : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IAttributeInfo_set_format)

static bool js_assets_IAttributeInfo_get_isNormalized(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IAttributeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IAttributeInfo_get_isNormalized : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isNormalized, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isNormalized, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IAttributeInfo_get_isNormalized)

static bool js_assets_IAttributeInfo_set_isNormalized(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IAttributeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IAttributeInfo_set_isNormalized : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isNormalized, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IAttributeInfo_set_isNormalized : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IAttributeInfo_set_isNormalized)

static bool js_assets_IAttributeInfo_get_stream(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IAttributeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IAttributeInfo_get_stream : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stream, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stream, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IAttributeInfo_get_stream)

static bool js_assets_IAttributeInfo_set_stream(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IAttributeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IAttributeInfo_set_stream : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stream, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IAttributeInfo_set_stream : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IAttributeInfo_set_stream)

static bool js_assets_IAttributeInfo_get_isInstanced(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IAttributeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IAttributeInfo_get_isInstanced : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isInstanced, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isInstanced, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IAttributeInfo_get_isInstanced)

static bool js_assets_IAttributeInfo_set_isInstanced(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IAttributeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IAttributeInfo_set_isInstanced : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isInstanced, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IAttributeInfo_set_isInstanced : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IAttributeInfo_set_isInstanced)

static bool js_assets_IAttributeInfo_get_location(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IAttributeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IAttributeInfo_get_location : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->location, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->location, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IAttributeInfo_get_location)

static bool js_assets_IAttributeInfo_set_location(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IAttributeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IAttributeInfo_set_location : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->location, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IAttributeInfo_set_location : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IAttributeInfo_set_location)

static bool js_assets_IAttributeInfo_get_defines(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IAttributeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IAttributeInfo_get_defines : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->defines, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->defines, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IAttributeInfo_get_defines)

static bool js_assets_IAttributeInfo_set_defines(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IAttributeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IAttributeInfo_set_defines : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->defines, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IAttributeInfo_set_defines : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IAttributeInfo_set_defines)


template<>
bool sevalue_to_native(const se::Value &from, cc::IAttributeInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IAttributeInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("name", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("format", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->format), ctx);
    }
    json->getProperty("isNormalized", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isNormalized), ctx);
    }
    json->getProperty("stream", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stream), ctx);
    }
    json->getProperty("isInstanced", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isInstanced), ctx);
    }
    json->getProperty("location", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->location), ctx);
    }
    json->getProperty("defines", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->defines), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IAttributeInfo_finalize)

static bool js_assets_IAttributeInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IAttributeInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IAttributeInfo);
        auto cobj = ptr->get<cc::IAttributeInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IAttributeInfo);
    auto cobj = ptr->get<cc::IAttributeInfo>();
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
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->defines), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IAttributeInfo_constructor, __jsb_cc_IAttributeInfo_class, js_cc_IAttributeInfo_finalize)

static bool js_cc_IAttributeInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IAttributeInfo_finalize)

bool js_register_assets_IAttributeInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IAttributeInfo", obj, nullptr, _SE(js_assets_IAttributeInfo_constructor));

    cls->defineProperty("name", _SE(js_assets_IAttributeInfo_get_name), _SE(js_assets_IAttributeInfo_set_name));
    cls->defineProperty("format", _SE(js_assets_IAttributeInfo_get_format), _SE(js_assets_IAttributeInfo_set_format));
    cls->defineProperty("isNormalized", _SE(js_assets_IAttributeInfo_get_isNormalized), _SE(js_assets_IAttributeInfo_set_isNormalized));
    cls->defineProperty("stream", _SE(js_assets_IAttributeInfo_get_stream), _SE(js_assets_IAttributeInfo_set_stream));
    cls->defineProperty("isInstanced", _SE(js_assets_IAttributeInfo_get_isInstanced), _SE(js_assets_IAttributeInfo_set_isInstanced));
    cls->defineProperty("location", _SE(js_assets_IAttributeInfo_get_location), _SE(js_assets_IAttributeInfo_set_location));
    cls->defineProperty("defines", _SE(js_assets_IAttributeInfo_get_defines), _SE(js_assets_IAttributeInfo_set_defines));
    cls->defineFinalizeFunction(_SE(js_cc_IAttributeInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IAttributeInfo>(cls);

    __jsb_cc_IAttributeInfo_proto = cls->getProto();
    __jsb_cc_IAttributeInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IDefineInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IDefineInfo_class = nullptr;  // NOLINT

static bool js_assets_IDefineInfo_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IDefineInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IDefineInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IDefineInfo_get_name)

static bool js_assets_IDefineInfo_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IDefineInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IDefineInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IDefineInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IDefineInfo_set_name)

static bool js_assets_IDefineInfo_get_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IDefineInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IDefineInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->type, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IDefineInfo_get_type)

static bool js_assets_IDefineInfo_set_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IDefineInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IDefineInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->type, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IDefineInfo_set_type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IDefineInfo_set_type)

static bool js_assets_IDefineInfo_get_range(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IDefineInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IDefineInfo_get_range : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->range, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->range, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IDefineInfo_get_range)

static bool js_assets_IDefineInfo_set_range(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IDefineInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IDefineInfo_set_range : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->range, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IDefineInfo_set_range : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IDefineInfo_set_range)

static bool js_assets_IDefineInfo_get_options(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IDefineInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IDefineInfo_get_options : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->options, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->options, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IDefineInfo_get_options)

static bool js_assets_IDefineInfo_set_options(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IDefineInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IDefineInfo_set_options : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->options, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IDefineInfo_set_options : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IDefineInfo_set_options)

static bool js_assets_IDefineInfo_get_defaultVal(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IDefineInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IDefineInfo_get_defaultVal : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->defaultVal, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->defaultVal, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IDefineInfo_get_defaultVal)

static bool js_assets_IDefineInfo_set_defaultVal(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IDefineInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IDefineInfo_set_defaultVal : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->defaultVal, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IDefineInfo_set_defaultVal : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IDefineInfo_set_defaultVal)


template<>
bool sevalue_to_native(const se::Value &from, cc::IDefineInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IDefineInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("name", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("type", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    json->getProperty("range", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->range), ctx);
    }
    json->getProperty("options", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->options), ctx);
    }
    json->getProperty("defaultVal", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->defaultVal), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IDefineInfo_finalize)

static bool js_assets_IDefineInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IDefineInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IDefineInfo);
        auto cobj = ptr->get<cc::IDefineInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IDefineInfo);
    auto cobj = ptr->get<cc::IDefineInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->name), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->type), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->range), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->options), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->defaultVal), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IDefineInfo_constructor, __jsb_cc_IDefineInfo_class, js_cc_IDefineInfo_finalize)

static bool js_cc_IDefineInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IDefineInfo_finalize)

bool js_register_assets_IDefineInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IDefineInfo", obj, nullptr, _SE(js_assets_IDefineInfo_constructor));

    cls->defineProperty("name", _SE(js_assets_IDefineInfo_get_name), _SE(js_assets_IDefineInfo_set_name));
    cls->defineProperty("type", _SE(js_assets_IDefineInfo_get_type), _SE(js_assets_IDefineInfo_set_type));
    cls->defineProperty("range", _SE(js_assets_IDefineInfo_get_range), _SE(js_assets_IDefineInfo_set_range));
    cls->defineProperty("options", _SE(js_assets_IDefineInfo_get_options), _SE(js_assets_IDefineInfo_set_options));
    cls->defineProperty("defaultVal", _SE(js_assets_IDefineInfo_get_defaultVal), _SE(js_assets_IDefineInfo_set_defaultVal));
    cls->defineFinalizeFunction(_SE(js_cc_IDefineInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IDefineInfo>(cls);

    __jsb_cc_IDefineInfo_proto = cls->getProto();
    __jsb_cc_IDefineInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IBuiltin_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IBuiltin_class = nullptr;  // NOLINT

static bool js_assets_IBuiltin_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IBuiltin>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBuiltin_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IBuiltin_get_name)

static bool js_assets_IBuiltin_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IBuiltin>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBuiltin_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IBuiltin_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IBuiltin_set_name)

static bool js_assets_IBuiltin_get_defines(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IBuiltin>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBuiltin_get_defines : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->defines, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->defines, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IBuiltin_get_defines)

static bool js_assets_IBuiltin_set_defines(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IBuiltin>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBuiltin_set_defines : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->defines, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IBuiltin_set_defines : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IBuiltin_set_defines)


template<>
bool sevalue_to_native(const se::Value &from, cc::IBuiltin * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IBuiltin*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("name", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("defines", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->defines), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IBuiltin_finalize)

static bool js_assets_IBuiltin_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IBuiltin);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IBuiltin);
        auto cobj = ptr->get<cc::IBuiltin>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IBuiltin);
    auto cobj = ptr->get<cc::IBuiltin>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->name), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->defines), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IBuiltin_constructor, __jsb_cc_IBuiltin_class, js_cc_IBuiltin_finalize)

static bool js_cc_IBuiltin_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IBuiltin_finalize)

bool js_register_assets_IBuiltin(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IBuiltin", obj, nullptr, _SE(js_assets_IBuiltin_constructor));

    cls->defineProperty("name", _SE(js_assets_IBuiltin_get_name), _SE(js_assets_IBuiltin_set_name));
    cls->defineProperty("defines", _SE(js_assets_IBuiltin_get_defines), _SE(js_assets_IBuiltin_set_defines));
    cls->defineFinalizeFunction(_SE(js_cc_IBuiltin_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IBuiltin>(cls);

    __jsb_cc_IBuiltin_proto = cls->getProto();
    __jsb_cc_IBuiltin_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IBuiltinInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IBuiltinInfo_class = nullptr;  // NOLINT

static bool js_assets_IBuiltinInfo_get_buffers(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IBuiltinInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBuiltinInfo_get_buffers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->buffers, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->buffers, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IBuiltinInfo_get_buffers)

static bool js_assets_IBuiltinInfo_set_buffers(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IBuiltinInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBuiltinInfo_set_buffers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->buffers, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IBuiltinInfo_set_buffers : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IBuiltinInfo_set_buffers)

static bool js_assets_IBuiltinInfo_get_blocks(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IBuiltinInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBuiltinInfo_get_blocks : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blocks, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blocks, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IBuiltinInfo_get_blocks)

static bool js_assets_IBuiltinInfo_set_blocks(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IBuiltinInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBuiltinInfo_set_blocks : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blocks, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IBuiltinInfo_set_blocks : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IBuiltinInfo_set_blocks)

static bool js_assets_IBuiltinInfo_get_samplerTextures(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IBuiltinInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBuiltinInfo_get_samplerTextures : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->samplerTextures, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->samplerTextures, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IBuiltinInfo_get_samplerTextures)

static bool js_assets_IBuiltinInfo_set_samplerTextures(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IBuiltinInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBuiltinInfo_set_samplerTextures : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->samplerTextures, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IBuiltinInfo_set_samplerTextures : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IBuiltinInfo_set_samplerTextures)

static bool js_assets_IBuiltinInfo_get_images(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IBuiltinInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBuiltinInfo_get_images : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->images, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->images, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IBuiltinInfo_get_images)

static bool js_assets_IBuiltinInfo_set_images(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IBuiltinInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBuiltinInfo_set_images : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->images, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IBuiltinInfo_set_images : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IBuiltinInfo_set_images)


template<>
bool sevalue_to_native(const se::Value &from, cc::IBuiltinInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IBuiltinInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("buffers", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->buffers), ctx);
    }
    json->getProperty("blocks", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blocks), ctx);
    }
    json->getProperty("samplerTextures", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->samplerTextures), ctx);
    }
    json->getProperty("images", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->images), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IBuiltinInfo_finalize)

static bool js_assets_IBuiltinInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IBuiltinInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IBuiltinInfo);
        auto cobj = ptr->get<cc::IBuiltinInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IBuiltinInfo);
    auto cobj = ptr->get<cc::IBuiltinInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->buffers), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->blocks), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->samplerTextures), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->images), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IBuiltinInfo_constructor, __jsb_cc_IBuiltinInfo_class, js_cc_IBuiltinInfo_finalize)

static bool js_cc_IBuiltinInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IBuiltinInfo_finalize)

bool js_register_assets_IBuiltinInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IBuiltinInfo", obj, nullptr, _SE(js_assets_IBuiltinInfo_constructor));

    cls->defineProperty("buffers", _SE(js_assets_IBuiltinInfo_get_buffers), _SE(js_assets_IBuiltinInfo_set_buffers));
    cls->defineProperty("blocks", _SE(js_assets_IBuiltinInfo_get_blocks), _SE(js_assets_IBuiltinInfo_set_blocks));
    cls->defineProperty("samplerTextures", _SE(js_assets_IBuiltinInfo_get_samplerTextures), _SE(js_assets_IBuiltinInfo_set_samplerTextures));
    cls->defineProperty("images", _SE(js_assets_IBuiltinInfo_get_images), _SE(js_assets_IBuiltinInfo_set_images));
    cls->defineFinalizeFunction(_SE(js_cc_IBuiltinInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IBuiltinInfo>(cls);

    __jsb_cc_IBuiltinInfo_proto = cls->getProto();
    __jsb_cc_IBuiltinInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IBuiltins_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IBuiltins_class = nullptr;  // NOLINT

static bool js_assets_IBuiltins_get_globals(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IBuiltins>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBuiltins_get_globals : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->globals, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->globals, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IBuiltins_get_globals)

static bool js_assets_IBuiltins_set_globals(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IBuiltins>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBuiltins_set_globals : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->globals, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IBuiltins_set_globals : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IBuiltins_set_globals)

static bool js_assets_IBuiltins_get_locals(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IBuiltins>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBuiltins_get_locals : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->locals, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->locals, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IBuiltins_get_locals)

static bool js_assets_IBuiltins_set_locals(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IBuiltins>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBuiltins_set_locals : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->locals, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IBuiltins_set_locals : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IBuiltins_set_locals)

static bool js_assets_IBuiltins_get_statistics(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IBuiltins>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBuiltins_get_statistics : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->statistics, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->statistics, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IBuiltins_get_statistics)

static bool js_assets_IBuiltins_set_statistics(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IBuiltins>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IBuiltins_set_statistics : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->statistics, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IBuiltins_set_statistics : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IBuiltins_set_statistics)


template<>
bool sevalue_to_native(const se::Value &from, cc::IBuiltins * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IBuiltins*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("globals", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->globals), ctx);
    }
    json->getProperty("locals", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->locals), ctx);
    }
    json->getProperty("statistics", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->statistics), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IBuiltins_finalize)

static bool js_assets_IBuiltins_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IBuiltins);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IBuiltins);
        auto cobj = ptr->get<cc::IBuiltins>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IBuiltins);
    auto cobj = ptr->get<cc::IBuiltins>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->globals), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->locals), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->statistics), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IBuiltins_constructor, __jsb_cc_IBuiltins_class, js_cc_IBuiltins_finalize)

static bool js_cc_IBuiltins_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IBuiltins_finalize)

bool js_register_assets_IBuiltins(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IBuiltins", obj, nullptr, _SE(js_assets_IBuiltins_constructor));

    cls->defineProperty("globals", _SE(js_assets_IBuiltins_get_globals), _SE(js_assets_IBuiltins_set_globals));
    cls->defineProperty("locals", _SE(js_assets_IBuiltins_get_locals), _SE(js_assets_IBuiltins_set_locals));
    cls->defineProperty("statistics", _SE(js_assets_IBuiltins_get_statistics), _SE(js_assets_IBuiltins_set_statistics));
    cls->defineFinalizeFunction(_SE(js_cc_IBuiltins_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IBuiltins>(cls);

    __jsb_cc_IBuiltins_proto = cls->getProto();
    __jsb_cc_IBuiltins_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IShaderSource_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IShaderSource_class = nullptr;  // NOLINT

static bool js_assets_IShaderSource_get_vert(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IShaderSource>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderSource_get_vert : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->vert, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->vert, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IShaderSource_get_vert)

static bool js_assets_IShaderSource_set_vert(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IShaderSource>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderSource_set_vert : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->vert, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IShaderSource_set_vert : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IShaderSource_set_vert)

static bool js_assets_IShaderSource_get_frag(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IShaderSource>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderSource_get_frag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->frag, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->frag, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IShaderSource_get_frag)

static bool js_assets_IShaderSource_set_frag(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IShaderSource>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderSource_set_frag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->frag, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IShaderSource_set_frag : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IShaderSource_set_frag)


template<>
bool sevalue_to_native(const se::Value &from, cc::IShaderSource * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IShaderSource*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("vert", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->vert), ctx);
    }
    json->getProperty("frag", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->frag), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IShaderSource_finalize)

static bool js_assets_IShaderSource_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IShaderSource);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IShaderSource);
        auto cobj = ptr->get<cc::IShaderSource>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IShaderSource);
    auto cobj = ptr->get<cc::IShaderSource>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->vert), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->frag), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IShaderSource_constructor, __jsb_cc_IShaderSource_class, js_cc_IShaderSource_finalize)

static bool js_cc_IShaderSource_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IShaderSource_finalize)

bool js_register_assets_IShaderSource(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IShaderSource", obj, nullptr, _SE(js_assets_IShaderSource_constructor));

    cls->defineProperty("vert", _SE(js_assets_IShaderSource_get_vert), _SE(js_assets_IShaderSource_set_vert));
    cls->defineProperty("frag", _SE(js_assets_IShaderSource_get_frag), _SE(js_assets_IShaderSource_set_frag));
    cls->defineFinalizeFunction(_SE(js_cc_IShaderSource_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IShaderSource>(cls);

    __jsb_cc_IShaderSource_proto = cls->getProto();
    __jsb_cc_IShaderSource_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IShaderInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IShaderInfo_class = nullptr;  // NOLINT

static bool js_assets_IShaderInfo_getSource(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_getSource : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_IShaderInfo_getSource : Error processing arguments");
        const cc::IShaderSource* result = cobj->getSource(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_IShaderInfo_getSource : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_IShaderInfo_getSource)

static bool js_assets_IShaderInfo_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IShaderInfo_get_name)

static bool js_assets_IShaderInfo_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IShaderInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IShaderInfo_set_name)

static bool js_assets_IShaderInfo_get_hash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_get_hash : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->hash, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->hash, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IShaderInfo_get_hash)

static bool js_assets_IShaderInfo_set_hash(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_set_hash : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->hash, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IShaderInfo_set_hash : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IShaderInfo_set_hash)

static bool js_assets_IShaderInfo_get_glsl4(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_get_glsl4 : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->glsl4, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->glsl4, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IShaderInfo_get_glsl4)

static bool js_assets_IShaderInfo_set_glsl4(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_set_glsl4 : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->glsl4, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IShaderInfo_set_glsl4 : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IShaderInfo_set_glsl4)

static bool js_assets_IShaderInfo_get_glsl3(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_get_glsl3 : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->glsl3, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->glsl3, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IShaderInfo_get_glsl3)

static bool js_assets_IShaderInfo_set_glsl3(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_set_glsl3 : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->glsl3, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IShaderInfo_set_glsl3 : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IShaderInfo_set_glsl3)

static bool js_assets_IShaderInfo_get_glsl1(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_get_glsl1 : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->glsl1, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->glsl1, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IShaderInfo_get_glsl1)

static bool js_assets_IShaderInfo_set_glsl1(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_set_glsl1 : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->glsl1, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IShaderInfo_set_glsl1 : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IShaderInfo_set_glsl1)

static bool js_assets_IShaderInfo_get_builtins(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_get_builtins : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->builtins, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->builtins, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IShaderInfo_get_builtins)

static bool js_assets_IShaderInfo_set_builtins(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_set_builtins : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->builtins, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IShaderInfo_set_builtins : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IShaderInfo_set_builtins)

static bool js_assets_IShaderInfo_get_defines(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_get_defines : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->defines, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->defines, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IShaderInfo_get_defines)

static bool js_assets_IShaderInfo_set_defines(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_set_defines : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->defines, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IShaderInfo_set_defines : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IShaderInfo_set_defines)

static bool js_assets_IShaderInfo_get_attributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_get_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->attributes, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->attributes, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IShaderInfo_get_attributes)

static bool js_assets_IShaderInfo_set_attributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_set_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->attributes, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IShaderInfo_set_attributes : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IShaderInfo_set_attributes)

static bool js_assets_IShaderInfo_get_blocks(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_get_blocks : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blocks, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->blocks, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IShaderInfo_get_blocks)

static bool js_assets_IShaderInfo_set_blocks(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_set_blocks : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blocks, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IShaderInfo_set_blocks : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IShaderInfo_set_blocks)

static bool js_assets_IShaderInfo_get_samplerTextures(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_get_samplerTextures : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->samplerTextures, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->samplerTextures, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IShaderInfo_get_samplerTextures)

static bool js_assets_IShaderInfo_set_samplerTextures(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_set_samplerTextures : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->samplerTextures, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IShaderInfo_set_samplerTextures : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IShaderInfo_set_samplerTextures)

static bool js_assets_IShaderInfo_get_samplers(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_get_samplers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->samplers, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->samplers, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IShaderInfo_get_samplers)

static bool js_assets_IShaderInfo_set_samplers(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_set_samplers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->samplers, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IShaderInfo_set_samplers : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IShaderInfo_set_samplers)

static bool js_assets_IShaderInfo_get_textures(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_get_textures : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->textures, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->textures, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IShaderInfo_get_textures)

static bool js_assets_IShaderInfo_set_textures(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_set_textures : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->textures, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IShaderInfo_set_textures : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IShaderInfo_set_textures)

static bool js_assets_IShaderInfo_get_buffers(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_get_buffers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->buffers, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->buffers, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IShaderInfo_get_buffers)

static bool js_assets_IShaderInfo_set_buffers(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_set_buffers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->buffers, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IShaderInfo_set_buffers : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IShaderInfo_set_buffers)

static bool js_assets_IShaderInfo_get_images(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_get_images : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->images, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->images, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IShaderInfo_get_images)

static bool js_assets_IShaderInfo_set_images(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_set_images : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->images, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IShaderInfo_set_images : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IShaderInfo_set_images)

static bool js_assets_IShaderInfo_get_subpassInputs(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_get_subpassInputs : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->subpassInputs, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->subpassInputs, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IShaderInfo_get_subpassInputs)

static bool js_assets_IShaderInfo_set_subpassInputs(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IShaderInfo_set_subpassInputs : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->subpassInputs, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IShaderInfo_set_subpassInputs : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IShaderInfo_set_subpassInputs)


template<>
bool sevalue_to_native(const se::Value &from, cc::IShaderInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IShaderInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("name", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("hash", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->hash), ctx);
    }
    json->getProperty("glsl4", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->glsl4), ctx);
    }
    json->getProperty("glsl3", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->glsl3), ctx);
    }
    json->getProperty("glsl1", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->glsl1), ctx);
    }
    json->getProperty("builtins", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->builtins), ctx);
    }
    json->getProperty("defines", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->defines), ctx);
    }
    json->getProperty("attributes", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->attributes), ctx);
    }
    json->getProperty("blocks", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blocks), ctx);
    }
    json->getProperty("samplerTextures", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->samplerTextures), ctx);
    }
    json->getProperty("samplers", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->samplers), ctx);
    }
    json->getProperty("textures", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->textures), ctx);
    }
    json->getProperty("buffers", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->buffers), ctx);
    }
    json->getProperty("images", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->images), ctx);
    }
    json->getProperty("subpassInputs", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->subpassInputs), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IShaderInfo_finalize)

static bool js_assets_IShaderInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IShaderInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IShaderInfo);
        auto cobj = ptr->get<cc::IShaderInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IShaderInfo);
    auto cobj = ptr->get<cc::IShaderInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->name), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->hash), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->glsl4), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->glsl3), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->glsl1), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->builtins), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->defines), nullptr);
    }
    if (argc > 7 && !args[7].isUndefined()) {
        ok &= sevalue_to_native(args[7], &(cobj->attributes), nullptr);
    }
    if (argc > 8 && !args[8].isUndefined()) {
        ok &= sevalue_to_native(args[8], &(cobj->blocks), nullptr);
    }
    if (argc > 9 && !args[9].isUndefined()) {
        ok &= sevalue_to_native(args[9], &(cobj->samplerTextures), nullptr);
    }
    if (argc > 10 && !args[10].isUndefined()) {
        ok &= sevalue_to_native(args[10], &(cobj->samplers), nullptr);
    }
    if (argc > 11 && !args[11].isUndefined()) {
        ok &= sevalue_to_native(args[11], &(cobj->textures), nullptr);
    }
    if (argc > 12 && !args[12].isUndefined()) {
        ok &= sevalue_to_native(args[12], &(cobj->buffers), nullptr);
    }
    if (argc > 13 && !args[13].isUndefined()) {
        ok &= sevalue_to_native(args[13], &(cobj->images), nullptr);
    }
    if (argc > 14 && !args[14].isUndefined()) {
        ok &= sevalue_to_native(args[14], &(cobj->subpassInputs), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IShaderInfo_constructor, __jsb_cc_IShaderInfo_class, js_cc_IShaderInfo_finalize)

static bool js_cc_IShaderInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IShaderInfo_finalize)

bool js_register_assets_IShaderInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IShaderInfo", obj, nullptr, _SE(js_assets_IShaderInfo_constructor));

    cls->defineProperty("name", _SE(js_assets_IShaderInfo_get_name), _SE(js_assets_IShaderInfo_set_name));
    cls->defineProperty("hash", _SE(js_assets_IShaderInfo_get_hash), _SE(js_assets_IShaderInfo_set_hash));
    cls->defineProperty("glsl4", _SE(js_assets_IShaderInfo_get_glsl4), _SE(js_assets_IShaderInfo_set_glsl4));
    cls->defineProperty("glsl3", _SE(js_assets_IShaderInfo_get_glsl3), _SE(js_assets_IShaderInfo_set_glsl3));
    cls->defineProperty("glsl1", _SE(js_assets_IShaderInfo_get_glsl1), _SE(js_assets_IShaderInfo_set_glsl1));
    cls->defineProperty("builtins", _SE(js_assets_IShaderInfo_get_builtins), _SE(js_assets_IShaderInfo_set_builtins));
    cls->defineProperty("defines", _SE(js_assets_IShaderInfo_get_defines), _SE(js_assets_IShaderInfo_set_defines));
    cls->defineProperty("attributes", _SE(js_assets_IShaderInfo_get_attributes), _SE(js_assets_IShaderInfo_set_attributes));
    cls->defineProperty("blocks", _SE(js_assets_IShaderInfo_get_blocks), _SE(js_assets_IShaderInfo_set_blocks));
    cls->defineProperty("samplerTextures", _SE(js_assets_IShaderInfo_get_samplerTextures), _SE(js_assets_IShaderInfo_set_samplerTextures));
    cls->defineProperty("samplers", _SE(js_assets_IShaderInfo_get_samplers), _SE(js_assets_IShaderInfo_set_samplers));
    cls->defineProperty("textures", _SE(js_assets_IShaderInfo_get_textures), _SE(js_assets_IShaderInfo_set_textures));
    cls->defineProperty("buffers", _SE(js_assets_IShaderInfo_get_buffers), _SE(js_assets_IShaderInfo_set_buffers));
    cls->defineProperty("images", _SE(js_assets_IShaderInfo_get_images), _SE(js_assets_IShaderInfo_set_images));
    cls->defineProperty("subpassInputs", _SE(js_assets_IShaderInfo_get_subpassInputs), _SE(js_assets_IShaderInfo_set_subpassInputs));
    cls->defineFunction("getSource", _SE(js_assets_IShaderInfo_getSource));
    cls->defineFinalizeFunction(_SE(js_cc_IShaderInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IShaderInfo>(cls);

    __jsb_cc_IShaderInfo_proto = cls->getProto();
    __jsb_cc_IShaderInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_EffectAsset_proto = nullptr; // NOLINT
se::Class* __jsb_cc_EffectAsset_class = nullptr;  // NOLINT

static bool js_assets_EffectAsset_getCombinations(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::EffectAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_EffectAsset_getCombinations : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<std::unordered_map<std::string, boost::variant2::variant<std::vector<bool>, std::vector<int>, std::vector<std::string>>>>& result = cobj->getCombinations();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_EffectAsset_getCombinations : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_EffectAsset_getCombinations)

static bool js_assets_EffectAsset_getShaders(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::EffectAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_EffectAsset_getShaders : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::IShaderInfo>& result = cobj->getShaders();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_EffectAsset_getShaders : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_EffectAsset_getShaders)

static bool js_assets_EffectAsset_getTechniques(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::EffectAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_EffectAsset_getTechniques : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::ITechniqueInfo>& result = cobj->getTechniques();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_EffectAsset_getTechniques : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_EffectAsset_getTechniques)

static bool js_assets_EffectAsset_setCombinations(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::EffectAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_EffectAsset_setCombinations : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<std::unordered_map<std::string, boost::variant2::variant<std::vector<bool>, std::vector<int>, std::vector<std::string>>>>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_EffectAsset_setCombinations : Error processing arguments");
        cobj->setCombinations(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_assets_EffectAsset_setCombinations)

static bool js_assets_EffectAsset_setShaders(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::EffectAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_EffectAsset_setShaders : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::IShaderInfo>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_EffectAsset_setShaders : Error processing arguments");
        cobj->setShaders(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_assets_EffectAsset_setShaders)

static bool js_assets_EffectAsset_setTechniques(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::EffectAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_EffectAsset_setTechniques : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::ITechniqueInfo>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_EffectAsset_setTechniques : Error processing arguments");
        cobj->setTechniques(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_assets_EffectAsset_setTechniques)

static bool js_assets_EffectAsset_get_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_assets_EffectAsset_get_static : Error processing arguments");
        cc::EffectAsset* result = cc::EffectAsset::get(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_EffectAsset_get_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_EffectAsset_get_static)

static bool js_assets_EffectAsset_getAll_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::unordered_map<std::string, cc::IntrusivePtr<cc::EffectAsset>>& result = cc::EffectAsset::getAll();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_EffectAsset_getAll_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_EffectAsset_getAll_static)

static bool js_assets_EffectAsset_registerAsset_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::EffectAsset*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_assets_EffectAsset_registerAsset_static : Error processing arguments");
        cc::EffectAsset::registerAsset(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_EffectAsset_registerAsset_static)

static bool js_assets_EffectAsset_remove_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<cc::EffectAsset*, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::EffectAsset::remove(arg0.value());
            return true;
        }
    } while (false);
    do {
        if (argc == 1) {
            HolderType<std::string, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::EffectAsset::remove(arg0.value());
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_assets_EffectAsset_remove_static)

SE_DECLARE_FINALIZE_FUNC(js_cc_EffectAsset_finalize)

static bool js_assets_EffectAsset_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::EffectAsset);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_EffectAsset_constructor, __jsb_cc_EffectAsset_class, js_cc_EffectAsset_finalize)

static bool js_cc_EffectAsset_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_EffectAsset_finalize)

bool js_register_assets_EffectAsset(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("EffectAsset", obj, __jsb_cc_Asset_proto, _SE(js_assets_EffectAsset_constructor));

    cls->defineProperty("combinations", _SE(js_assets_EffectAsset_getCombinations_asGetter), _SE(js_assets_EffectAsset_setCombinations_asSetter));
    cls->defineProperty("shaders", _SE(js_assets_EffectAsset_getShaders_asGetter), _SE(js_assets_EffectAsset_setShaders_asSetter));
    cls->defineProperty("techniques", _SE(js_assets_EffectAsset_getTechniques_asGetter), _SE(js_assets_EffectAsset_setTechniques_asSetter));
    cls->defineStaticFunction("get", _SE(js_assets_EffectAsset_get_static));
    cls->defineStaticFunction("getAll", _SE(js_assets_EffectAsset_getAll_static));
    cls->defineStaticFunction("register", _SE(js_assets_EffectAsset_registerAsset_static));
    cls->defineStaticFunction("remove", _SE(js_assets_EffectAsset_remove_static));
    cls->defineFinalizeFunction(_SE(js_cc_EffectAsset_finalize));
    cls->install();
    JSBClassType::registerClass<cc::EffectAsset>(cls);

    __jsb_cc_EffectAsset_proto = cls->getProto();
    __jsb_cc_EffectAsset_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IMemoryImageSource_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IMemoryImageSource_class = nullptr;  // NOLINT

static bool js_assets_IMemoryImageSource_get_data(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IMemoryImageSource>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMemoryImageSource_get_data : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->data, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->data, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IMemoryImageSource_get_data)

static bool js_assets_IMemoryImageSource_set_data(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IMemoryImageSource>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMemoryImageSource_set_data : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->data, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IMemoryImageSource_set_data : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IMemoryImageSource_set_data)

static bool js_assets_IMemoryImageSource_get_compressed(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IMemoryImageSource>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMemoryImageSource_get_compressed : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->compressed, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->compressed, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IMemoryImageSource_get_compressed)

static bool js_assets_IMemoryImageSource_set_compressed(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IMemoryImageSource>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMemoryImageSource_set_compressed : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->compressed, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IMemoryImageSource_set_compressed : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IMemoryImageSource_set_compressed)

static bool js_assets_IMemoryImageSource_get_width(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IMemoryImageSource>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMemoryImageSource_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->width, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->width, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IMemoryImageSource_get_width)

static bool js_assets_IMemoryImageSource_set_width(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IMemoryImageSource>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMemoryImageSource_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->width, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IMemoryImageSource_set_width : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IMemoryImageSource_set_width)

static bool js_assets_IMemoryImageSource_get_height(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IMemoryImageSource>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMemoryImageSource_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->height, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->height, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IMemoryImageSource_get_height)

static bool js_assets_IMemoryImageSource_set_height(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IMemoryImageSource>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMemoryImageSource_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->height, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IMemoryImageSource_set_height : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IMemoryImageSource_set_height)

static bool js_assets_IMemoryImageSource_get_format(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IMemoryImageSource>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMemoryImageSource_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->format, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->format, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IMemoryImageSource_get_format)

static bool js_assets_IMemoryImageSource_set_format(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IMemoryImageSource>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMemoryImageSource_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->format, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IMemoryImageSource_set_format : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IMemoryImageSource_set_format)


template<>
bool sevalue_to_native(const se::Value &from, cc::IMemoryImageSource * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IMemoryImageSource*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("data", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->data), ctx);
    }
    json->getProperty("compressed", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->compressed), ctx);
    }
    json->getProperty("width", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->width), ctx);
    }
    json->getProperty("height", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->height), ctx);
    }
    json->getProperty("format", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->format), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IMemoryImageSource_finalize)

static bool js_assets_IMemoryImageSource_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IMemoryImageSource);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IMemoryImageSource);
        auto cobj = ptr->get<cc::IMemoryImageSource>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IMemoryImageSource);
    auto cobj = ptr->get<cc::IMemoryImageSource>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->data), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->compressed), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->width), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->height), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->format), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IMemoryImageSource_constructor, __jsb_cc_IMemoryImageSource_class, js_cc_IMemoryImageSource_finalize)

static bool js_cc_IMemoryImageSource_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IMemoryImageSource_finalize)

bool js_register_assets_IMemoryImageSource(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IMemoryImageSource", obj, nullptr, _SE(js_assets_IMemoryImageSource_constructor));

    cls->defineProperty("data", _SE(js_assets_IMemoryImageSource_get_data), _SE(js_assets_IMemoryImageSource_set_data));
    cls->defineProperty("compressed", _SE(js_assets_IMemoryImageSource_get_compressed), _SE(js_assets_IMemoryImageSource_set_compressed));
    cls->defineProperty("width", _SE(js_assets_IMemoryImageSource_get_width), _SE(js_assets_IMemoryImageSource_set_width));
    cls->defineProperty("height", _SE(js_assets_IMemoryImageSource_get_height), _SE(js_assets_IMemoryImageSource_set_height));
    cls->defineProperty("format", _SE(js_assets_IMemoryImageSource_get_format), _SE(js_assets_IMemoryImageSource_set_format));
    cls->defineFinalizeFunction(_SE(js_cc_IMemoryImageSource_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IMemoryImageSource>(cls);

    __jsb_cc_IMemoryImageSource_proto = cls->getProto();
    __jsb_cc_IMemoryImageSource_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_ImageAsset_proto = nullptr; // NOLINT
se::Class* __jsb_cc_ImageAsset_class = nullptr;  // NOLINT

static bool js_assets_ImageAsset_getData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ImageAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ImageAsset_getData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const unsigned char* result = cobj->getData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_ImageAsset_getData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_ImageAsset_getData)

static bool js_assets_ImageAsset_getFormat(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ImageAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ImageAsset_getFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getFormat());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_ImageAsset_getFormat : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_ImageAsset_getFormat)

static bool js_assets_ImageAsset_getHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ImageAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ImageAsset_getHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHeight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_ImageAsset_getHeight : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_ImageAsset_getHeight)

static bool js_assets_ImageAsset_getUrl(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ImageAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ImageAsset_getUrl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getUrl();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_ImageAsset_getUrl : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_ImageAsset_getUrl)
SE_BIND_FUNC(js_assets_ImageAsset_getUrl)

static bool js_assets_ImageAsset_getWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ImageAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ImageAsset_getWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getWidth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_ImageAsset_getWidth : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_ImageAsset_getWidth)

static bool js_assets_ImageAsset_isCompressed(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ImageAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ImageAsset_isCompressed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isCompressed();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_ImageAsset_isCompressed : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_ImageAsset_isCompressed)

static bool js_assets_ImageAsset_setFormat(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ImageAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ImageAsset_setFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::PixelFormat, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_ImageAsset_setFormat : Error processing arguments");
        cobj->setFormat(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_assets_ImageAsset_setFormat)

static bool js_assets_ImageAsset_setHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ImageAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ImageAsset_setHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_ImageAsset_setHeight : Error processing arguments");
        cobj->setHeight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_ImageAsset_setHeight)

static bool js_assets_ImageAsset_setUrl(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ImageAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ImageAsset_setUrl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_ImageAsset_setUrl : Error processing arguments");
        cobj->setUrl(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_assets_ImageAsset_setUrl)
SE_BIND_FUNC(js_assets_ImageAsset_setUrl)

static bool js_assets_ImageAsset_setWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ImageAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ImageAsset_setWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_ImageAsset_setWidth : Error processing arguments");
        cobj->setWidth(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_ImageAsset_setWidth)

SE_DECLARE_FINALIZE_FUNC(js_cc_ImageAsset_finalize)

static bool js_assets_ImageAsset_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ImageAsset);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_ImageAsset_constructor, __jsb_cc_ImageAsset_class, js_cc_ImageAsset_finalize)

static bool js_cc_ImageAsset_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_ImageAsset_finalize)

bool js_register_assets_ImageAsset(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ImageAsset", obj, __jsb_cc_Asset_proto, _SE(js_assets_ImageAsset_constructor));

    cls->defineProperty("url", _SE(js_assets_ImageAsset_getUrl_asGetter), _SE(js_assets_ImageAsset_setUrl_asSetter));
    cls->defineProperty("format", _SE(js_assets_ImageAsset_getFormat_asGetter), _SE(js_assets_ImageAsset_setFormat_asSetter));
    cls->defineFunction("getData", _SE(js_assets_ImageAsset_getData));
    cls->defineFunction("getHeight", _SE(js_assets_ImageAsset_getHeight));
    cls->defineFunction("getUrl", _SE(js_assets_ImageAsset_getUrl));
    cls->defineFunction("getWidth", _SE(js_assets_ImageAsset_getWidth));
    cls->defineFunction("isCompressed", _SE(js_assets_ImageAsset_isCompressed));
    cls->defineFunction("setHeight", _SE(js_assets_ImageAsset_setHeight));
    cls->defineFunction("setUrl", _SE(js_assets_ImageAsset_setUrl));
    cls->defineFunction("setWidth", _SE(js_assets_ImageAsset_setWidth));
    cls->defineFinalizeFunction(_SE(js_cc_ImageAsset_finalize));
    cls->install();
    JSBClassType::registerClass<cc::ImageAsset>(cls);

    __jsb_cc_ImageAsset_proto = cls->getProto();
    __jsb_cc_ImageAsset_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IMaterialInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IMaterialInfo_class = nullptr;  // NOLINT

static bool js_assets_IMaterialInfo_get_effectAsset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IMaterialInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMaterialInfo_get_effectAsset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->effectAsset, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->effectAsset, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IMaterialInfo_get_effectAsset)

static bool js_assets_IMaterialInfo_set_effectAsset(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IMaterialInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMaterialInfo_set_effectAsset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->effectAsset, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IMaterialInfo_set_effectAsset : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IMaterialInfo_set_effectAsset)

static bool js_assets_IMaterialInfo_get_effectName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IMaterialInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMaterialInfo_get_effectName : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->effectName, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->effectName, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IMaterialInfo_get_effectName)

static bool js_assets_IMaterialInfo_set_effectName(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IMaterialInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMaterialInfo_set_effectName : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->effectName, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IMaterialInfo_set_effectName : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IMaterialInfo_set_effectName)

static bool js_assets_IMaterialInfo_get_technique(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IMaterialInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMaterialInfo_get_technique : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->technique, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->technique, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IMaterialInfo_get_technique)

static bool js_assets_IMaterialInfo_set_technique(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IMaterialInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMaterialInfo_set_technique : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->technique, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IMaterialInfo_set_technique : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IMaterialInfo_set_technique)

static bool js_assets_IMaterialInfo_get_defines(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IMaterialInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMaterialInfo_get_defines : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->defines, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->defines, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IMaterialInfo_get_defines)

static bool js_assets_IMaterialInfo_set_defines(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IMaterialInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMaterialInfo_set_defines : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->defines, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IMaterialInfo_set_defines : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IMaterialInfo_set_defines)

static bool js_assets_IMaterialInfo_get_states(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IMaterialInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMaterialInfo_get_states : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->states, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->states, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IMaterialInfo_get_states)

static bool js_assets_IMaterialInfo_set_states(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IMaterialInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMaterialInfo_set_states : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->states, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IMaterialInfo_set_states : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IMaterialInfo_set_states)


template<>
bool sevalue_to_native(const se::Value &from, cc::IMaterialInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IMaterialInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("effectAsset", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->effectAsset), ctx);
    }
    json->getProperty("effectName", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->effectName), ctx);
    }
    json->getProperty("technique", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->technique), ctx);
    }
    json->getProperty("defines", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->defines), ctx);
    }
    json->getProperty("states", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->states), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IMaterialInfo_finalize)

static bool js_assets_IMaterialInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IMaterialInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IMaterialInfo);
        auto cobj = ptr->get<cc::IMaterialInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IMaterialInfo);
    auto cobj = ptr->get<cc::IMaterialInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->effectAsset), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->effectName), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->technique), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->defines), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->states), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IMaterialInfo_constructor, __jsb_cc_IMaterialInfo_class, js_cc_IMaterialInfo_finalize)

static bool js_cc_IMaterialInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IMaterialInfo_finalize)

bool js_register_assets_IMaterialInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IMaterialInfo", obj, nullptr, _SE(js_assets_IMaterialInfo_constructor));

    cls->defineProperty("effectAsset", _SE(js_assets_IMaterialInfo_get_effectAsset), _SE(js_assets_IMaterialInfo_set_effectAsset));
    cls->defineProperty("effectName", _SE(js_assets_IMaterialInfo_get_effectName), _SE(js_assets_IMaterialInfo_set_effectName));
    cls->defineProperty("technique", _SE(js_assets_IMaterialInfo_get_technique), _SE(js_assets_IMaterialInfo_set_technique));
    cls->defineProperty("defines", _SE(js_assets_IMaterialInfo_get_defines), _SE(js_assets_IMaterialInfo_set_defines));
    cls->defineProperty("states", _SE(js_assets_IMaterialInfo_get_states), _SE(js_assets_IMaterialInfo_set_states));
    cls->defineFinalizeFunction(_SE(js_cc_IMaterialInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IMaterialInfo>(cls);

    __jsb_cc_IMaterialInfo_proto = cls->getProto();
    __jsb_cc_IMaterialInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_Material_proto = nullptr; // NOLINT
se::Class* __jsb_cc_Material_class = nullptr;  // NOLINT

static bool js_assets_Material_copy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_copy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<const cc::Material*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_copy : Error processing arguments");
        cobj->copy(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_Material_copy)

static bool js_assets_Material_getEffectAsset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_getEffectAsset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::EffectAsset* result = cobj->getEffectAsset();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Material_getEffectAsset : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_Material_getEffectAsset)

static bool js_assets_Material_getEffectName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_getEffectName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getEffectName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Material_getEffectName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_Material_getEffectName)

static bool js_assets_Material_getHashForJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_getHashForJS : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        double result = cobj->getHashForJS();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Material_getHashForJS : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_Material_getHashForJS)

static bool js_assets_Material_getParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Material* result = cobj->getParent();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Material_getParent : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_Material_getParent)

static bool js_assets_Material_getPasses(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_getPasses : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::shared_ptr<std::vector<cc::IntrusivePtr<cc::scene::Pass>>>& result = cobj->getPasses();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Material_getPasses : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_Material_getPasses)

static bool js_assets_Material_getProperty(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_getProperty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_getProperty : Error processing arguments");
        const boost::variant2::variant<boost::variant2::monostate, boost::variant2::variant<boost::variant2::monostate, float, int, cc::Vec2, cc::Vec3, cc::Vec4, cc::Color, cc::Mat3, cc::Mat4, cc::Quaternion, cc::IntrusivePtr<cc::TextureBase>, cc::IntrusivePtr<cc::gfx::Texture>>, std::vector<boost::variant2::variant<boost::variant2::monostate, float, int, cc::Vec2, cc::Vec3, cc::Vec4, cc::Color, cc::Mat3, cc::Mat4, cc::Quaternion, cc::IntrusivePtr<cc::TextureBase>, cc::IntrusivePtr<cc::gfx::Texture>>>>* result = cobj->getProperty(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Material_getProperty : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_getProperty : Error processing arguments");
        const boost::variant2::variant<boost::variant2::monostate, boost::variant2::variant<boost::variant2::monostate, float, int, cc::Vec2, cc::Vec3, cc::Vec4, cc::Color, cc::Mat3, cc::Mat4, cc::Quaternion, cc::IntrusivePtr<cc::TextureBase>, cc::IntrusivePtr<cc::gfx::Texture>>, std::vector<boost::variant2::variant<boost::variant2::monostate, float, int, cc::Vec2, cc::Vec3, cc::Vec4, cc::Color, cc::Mat3, cc::Mat4, cc::Quaternion, cc::IntrusivePtr<cc::TextureBase>, cc::IntrusivePtr<cc::gfx::Texture>>>>* result = cobj->getProperty(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Material_getProperty : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_assets_Material_getProperty)

static bool js_assets_Material_getTechniqueIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_getTechniqueIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getTechniqueIndex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Material_getTechniqueIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_Material_getTechniqueIndex)

static bool js_assets_Material_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::IMaterialInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_Material_initialize)

static bool js_assets_Material_overridePipelineStates(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2( cobj, false, "js_assets_Material_overridePipelineStates : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<cc::IPassStates, true> arg0 = {};
            HolderType<int, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->overridePipelineStates(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<cc::IPassStates, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->overridePipelineStates(arg0.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_assets_Material_overridePipelineStates)

static bool js_assets_Material_recompileShaders(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2( cobj, false, "js_assets_Material_recompileShaders : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<std::unordered_map<std::string, boost::variant2::variant<int, bool, std::string>>, true> arg0 = {};
            HolderType<int, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->recompileShaders(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<std::unordered_map<std::string, boost::variant2::variant<int, bool, std::string>>, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->recompileShaders(arg0.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_assets_Material_recompileShaders)

static bool js_assets_Material_reset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_reset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::IMaterialInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_reset : Error processing arguments");
        cobj->reset(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_Material_reset)

static bool js_assets_Material_resetUniforms(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_resetUniforms : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->resetUniforms();
        return true;
    }
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_resetUniforms : Error processing arguments");
        cobj->resetUniforms(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_Material_resetUniforms)

static bool js_assets_Material_setEffectAsset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setEffectAsset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::EffectAsset*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setEffectAsset : Error processing arguments");
        cobj->setEffectAsset(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_assets_Material_setEffectAsset)

static bool js_assets_Material_setPropertyColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::Color, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyColor : Error processing arguments");
        cobj->setPropertyColor(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::Color, true> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyColor : Error processing arguments");
        cobj->setPropertyColor(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyColor)

static bool js_assets_Material_setPropertyColorArray(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyColorArray : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<cc::Color>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyColorArray : Error processing arguments");
        cobj->setPropertyColorArray(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<cc::Color>, true> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyColorArray : Error processing arguments");
        cobj->setPropertyColorArray(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyColorArray)

static bool js_assets_Material_setPropertyFloat32(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyFloat32 : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyFloat32 : Error processing arguments");
        cobj->setPropertyFloat32(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyFloat32 : Error processing arguments");
        cobj->setPropertyFloat32(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyFloat32)

static bool js_assets_Material_setPropertyFloat32Array(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyFloat32Array : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<float>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyFloat32Array : Error processing arguments");
        cobj->setPropertyFloat32Array(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<float>, true> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyFloat32Array : Error processing arguments");
        cobj->setPropertyFloat32Array(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyFloat32Array)

static bool js_assets_Material_setPropertyGFXTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyGFXTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::gfx::Texture*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyGFXTexture : Error processing arguments");
        cobj->setPropertyGFXTexture(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::gfx::Texture*, false> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyGFXTexture : Error processing arguments");
        cobj->setPropertyGFXTexture(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyGFXTexture)

static bool js_assets_Material_setPropertyGFXTextureArray(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyGFXTextureArray : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<cc::gfx::Texture *>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyGFXTextureArray : Error processing arguments");
        cobj->setPropertyGFXTextureArray(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<cc::gfx::Texture *>, true> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyGFXTextureArray : Error processing arguments");
        cobj->setPropertyGFXTextureArray(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyGFXTextureArray)

static bool js_assets_Material_setPropertyInt32(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyInt32 : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<int32_t, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyInt32 : Error processing arguments");
        cobj->setPropertyInt32(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<int32_t, false> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyInt32 : Error processing arguments");
        cobj->setPropertyInt32(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyInt32)

static bool js_assets_Material_setPropertyInt32Array(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyInt32Array : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<int>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyInt32Array : Error processing arguments");
        cobj->setPropertyInt32Array(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<int>, true> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyInt32Array : Error processing arguments");
        cobj->setPropertyInt32Array(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyInt32Array)

static bool js_assets_Material_setPropertyMat3(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyMat3 : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::Mat3, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyMat3 : Error processing arguments");
        cobj->setPropertyMat3(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::Mat3, true> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyMat3 : Error processing arguments");
        cobj->setPropertyMat3(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyMat3)

static bool js_assets_Material_setPropertyMat3Array(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyMat3Array : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<cc::Mat3>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyMat3Array : Error processing arguments");
        cobj->setPropertyMat3Array(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<cc::Mat3>, true> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyMat3Array : Error processing arguments");
        cobj->setPropertyMat3Array(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyMat3Array)

static bool js_assets_Material_setPropertyMat4(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyMat4 : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::Mat4, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyMat4 : Error processing arguments");
        cobj->setPropertyMat4(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::Mat4, true> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyMat4 : Error processing arguments");
        cobj->setPropertyMat4(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyMat4)

static bool js_assets_Material_setPropertyMat4Array(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyMat4Array : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<cc::Mat4>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyMat4Array : Error processing arguments");
        cobj->setPropertyMat4Array(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<cc::Mat4>, true> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyMat4Array : Error processing arguments");
        cobj->setPropertyMat4Array(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyMat4Array)

static bool js_assets_Material_setPropertyQuaternion(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyQuaternion : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::Quaternion, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyQuaternion : Error processing arguments");
        cobj->setPropertyQuaternion(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::Quaternion, true> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyQuaternion : Error processing arguments");
        cobj->setPropertyQuaternion(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyQuaternion)

static bool js_assets_Material_setPropertyQuaternionArray(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyQuaternionArray : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<cc::Quaternion>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyQuaternionArray : Error processing arguments");
        cobj->setPropertyQuaternionArray(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<cc::Quaternion>, true> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyQuaternionArray : Error processing arguments");
        cobj->setPropertyQuaternionArray(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyQuaternionArray)

static bool js_assets_Material_setPropertyTextureBase(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyTextureBase : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::TextureBase*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyTextureBase : Error processing arguments");
        cobj->setPropertyTextureBase(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::TextureBase*, false> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyTextureBase : Error processing arguments");
        cobj->setPropertyTextureBase(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyTextureBase)

static bool js_assets_Material_setPropertyTextureBaseArray(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyTextureBaseArray : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<cc::TextureBase *>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyTextureBaseArray : Error processing arguments");
        cobj->setPropertyTextureBaseArray(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<cc::TextureBase *>, true> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyTextureBaseArray : Error processing arguments");
        cobj->setPropertyTextureBaseArray(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyTextureBaseArray)

static bool js_assets_Material_setPropertyVec2(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyVec2 : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::Vec2, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyVec2 : Error processing arguments");
        cobj->setPropertyVec2(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::Vec2, true> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyVec2 : Error processing arguments");
        cobj->setPropertyVec2(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyVec2)

static bool js_assets_Material_setPropertyVec2Array(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyVec2Array : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<cc::Vec2>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyVec2Array : Error processing arguments");
        cobj->setPropertyVec2Array(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<cc::Vec2>, true> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyVec2Array : Error processing arguments");
        cobj->setPropertyVec2Array(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyVec2Array)

static bool js_assets_Material_setPropertyVec3(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyVec3 : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::Vec3, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyVec3 : Error processing arguments");
        cobj->setPropertyVec3(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::Vec3, true> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyVec3 : Error processing arguments");
        cobj->setPropertyVec3(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyVec3)

static bool js_assets_Material_setPropertyVec3Array(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyVec3Array : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<cc::Vec3>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyVec3Array : Error processing arguments");
        cobj->setPropertyVec3Array(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<cc::Vec3>, true> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyVec3Array : Error processing arguments");
        cobj->setPropertyVec3Array(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyVec3Array)

static bool js_assets_Material_setPropertyVec4(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyVec4 : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::Vec4, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyVec4 : Error processing arguments");
        cobj->setPropertyVec4(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<cc::Vec4, true> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyVec4 : Error processing arguments");
        cobj->setPropertyVec4(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyVec4)

static bool js_assets_Material_setPropertyVec4Array(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_setPropertyVec4Array : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<cc::Vec4>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyVec4Array : Error processing arguments");
        cobj->setPropertyVec4Array(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::vector<cc::Vec4>, true> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Material_setPropertyVec4Array : Error processing arguments");
        cobj->setPropertyVec4Array(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Material_setPropertyVec4Array)

static bool js_assets_Material_getHashForMaterialForJS_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Material*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_assets_Material_getHashForMaterialForJS_static : Error processing arguments");
        double result = cc::Material::getHashForMaterialForJS(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Material_getHashForMaterialForJS_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_Material_getHashForMaterialForJS_static)

static bool js_assets_Material_get__effectAsset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_get__effectAsset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_effectAsset, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_effectAsset, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_Material_get__effectAsset)

static bool js_assets_Material_set__effectAsset(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_set__effectAsset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_effectAsset, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_Material_set__effectAsset : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_Material_set__effectAsset)

static bool js_assets_Material_get__techIdx(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_get__techIdx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_techIdx, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_techIdx, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_Material_get__techIdx)

static bool js_assets_Material_set__techIdx(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_set__techIdx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_techIdx, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_Material_set__techIdx : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_Material_set__techIdx)

static bool js_assets_Material_get__defines(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_get__defines : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_defines, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_defines, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_Material_get__defines)

static bool js_assets_Material_set__defines(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_set__defines : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_defines, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_Material_set__defines : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_Material_set__defines)

static bool js_assets_Material_get__states(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_get__states : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_states, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_states, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_Material_get__states)

static bool js_assets_Material_set__states(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_set__states : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_states, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_Material_set__states : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_Material_set__states)

static bool js_assets_Material_get__props(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_get__props : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_props, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_props, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_Material_get__props)

static bool js_assets_Material_set__props(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Material_set__props : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_props, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_Material_set__props : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_Material_set__props)

SE_DECLARE_FINALIZE_FUNC(js_cc_Material_finalize)

static bool js_assets_Material_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Material);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_Material_constructor, __jsb_cc_Material_class, js_cc_Material_finalize)

static bool js_cc_Material_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_Material_finalize)

bool js_register_assets_Material(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Material", obj, __jsb_cc_Asset_proto, _SE(js_assets_Material_constructor));

    cls->defineProperty("_effectAsset", _SE(js_assets_Material_get__effectAsset), _SE(js_assets_Material_set__effectAsset));
    cls->defineProperty("_techIdx", _SE(js_assets_Material_get__techIdx), _SE(js_assets_Material_set__techIdx));
    cls->defineProperty("_defines", _SE(js_assets_Material_get__defines), _SE(js_assets_Material_set__defines));
    cls->defineProperty("_states", _SE(js_assets_Material_get__states), _SE(js_assets_Material_set__states));
    cls->defineProperty("_propsInternal", _SE(js_assets_Material_get__props), _SE(js_assets_Material_set__props));
    cls->defineProperty("hash", _SE(js_assets_Material_getHashForJS_asGetter), nullptr);
    cls->defineProperty("technique", _SE(js_assets_Material_getTechniqueIndex_asGetter), nullptr);
    cls->defineProperty("effectName", _SE(js_assets_Material_getEffectName_asGetter), nullptr);
    cls->defineProperty("parent", _SE(js_assets_Material_getParent_asGetter), nullptr);
    cls->defineProperty("effectAsset", _SE(js_assets_Material_getEffectAsset_asGetter), _SE(js_assets_Material_setEffectAsset_asSetter));
    cls->defineFunction("copy", _SE(js_assets_Material_copy));
    cls->defineFunction("getPasses", _SE(js_assets_Material_getPasses));
    cls->defineFunction("_getProperty", _SE(js_assets_Material_getProperty));
    cls->defineFunction("initialize", _SE(js_assets_Material_initialize));
    cls->defineFunction("overridePipelineStates", _SE(js_assets_Material_overridePipelineStates));
    cls->defineFunction("recompileShaders", _SE(js_assets_Material_recompileShaders));
    cls->defineFunction("reset", _SE(js_assets_Material_reset));
    cls->defineFunction("resetUniforms", _SE(js_assets_Material_resetUniforms));
    cls->defineFunction("setPropertyColor", _SE(js_assets_Material_setPropertyColor));
    cls->defineFunction("setPropertyColorArray", _SE(js_assets_Material_setPropertyColorArray));
    cls->defineFunction("setPropertyFloat32", _SE(js_assets_Material_setPropertyFloat32));
    cls->defineFunction("setPropertyFloat32Array", _SE(js_assets_Material_setPropertyFloat32Array));
    cls->defineFunction("setPropertyGFXTexture", _SE(js_assets_Material_setPropertyGFXTexture));
    cls->defineFunction("setPropertyGFXTextureArray", _SE(js_assets_Material_setPropertyGFXTextureArray));
    cls->defineFunction("setPropertyInt32", _SE(js_assets_Material_setPropertyInt32));
    cls->defineFunction("setPropertyInt32Array", _SE(js_assets_Material_setPropertyInt32Array));
    cls->defineFunction("setPropertyMat3", _SE(js_assets_Material_setPropertyMat3));
    cls->defineFunction("setPropertyMat3Array", _SE(js_assets_Material_setPropertyMat3Array));
    cls->defineFunction("setPropertyMat4", _SE(js_assets_Material_setPropertyMat4));
    cls->defineFunction("setPropertyMat4Array", _SE(js_assets_Material_setPropertyMat4Array));
    cls->defineFunction("setPropertyQuaternion", _SE(js_assets_Material_setPropertyQuaternion));
    cls->defineFunction("setPropertyQuaternionArray", _SE(js_assets_Material_setPropertyQuaternionArray));
    cls->defineFunction("setPropertyTextureBase", _SE(js_assets_Material_setPropertyTextureBase));
    cls->defineFunction("setPropertyTextureBaseArray", _SE(js_assets_Material_setPropertyTextureBaseArray));
    cls->defineFunction("setPropertyVec2", _SE(js_assets_Material_setPropertyVec2));
    cls->defineFunction("setPropertyVec2Array", _SE(js_assets_Material_setPropertyVec2Array));
    cls->defineFunction("setPropertyVec3", _SE(js_assets_Material_setPropertyVec3));
    cls->defineFunction("setPropertyVec3Array", _SE(js_assets_Material_setPropertyVec3Array));
    cls->defineFunction("setPropertyVec4", _SE(js_assets_Material_setPropertyVec4));
    cls->defineFunction("setPropertyVec4Array", _SE(js_assets_Material_setPropertyVec4Array));
    cls->defineStaticFunction("getHashForMaterial", _SE(js_assets_Material_getHashForMaterialForJS_static));
    cls->defineFinalizeFunction(_SE(js_cc_Material_finalize));
    cls->install();
    JSBClassType::registerClass<cc::Material>(cls);

    __jsb_cc_Material_proto = cls->getProto();
    __jsb_cc_Material_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IRenderTextureCreateInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IRenderTextureCreateInfo_class = nullptr;  // NOLINT

static bool js_assets_IRenderTextureCreateInfo_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IRenderTextureCreateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IRenderTextureCreateInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IRenderTextureCreateInfo_get_name)

static bool js_assets_IRenderTextureCreateInfo_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IRenderTextureCreateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IRenderTextureCreateInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IRenderTextureCreateInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IRenderTextureCreateInfo_set_name)

static bool js_assets_IRenderTextureCreateInfo_get_width(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IRenderTextureCreateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IRenderTextureCreateInfo_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->width, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->width, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IRenderTextureCreateInfo_get_width)

static bool js_assets_IRenderTextureCreateInfo_set_width(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IRenderTextureCreateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IRenderTextureCreateInfo_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->width, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IRenderTextureCreateInfo_set_width : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IRenderTextureCreateInfo_set_width)

static bool js_assets_IRenderTextureCreateInfo_get_height(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IRenderTextureCreateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IRenderTextureCreateInfo_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->height, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->height, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IRenderTextureCreateInfo_get_height)

static bool js_assets_IRenderTextureCreateInfo_set_height(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IRenderTextureCreateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IRenderTextureCreateInfo_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->height, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IRenderTextureCreateInfo_set_height : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IRenderTextureCreateInfo_set_height)

static bool js_assets_IRenderTextureCreateInfo_get_passInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IRenderTextureCreateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IRenderTextureCreateInfo_get_passInfo : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->passInfo, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->passInfo, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IRenderTextureCreateInfo_get_passInfo)

static bool js_assets_IRenderTextureCreateInfo_set_passInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IRenderTextureCreateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IRenderTextureCreateInfo_set_passInfo : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->passInfo, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IRenderTextureCreateInfo_set_passInfo : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IRenderTextureCreateInfo_set_passInfo)


template<>
bool sevalue_to_native(const se::Value &from, cc::IRenderTextureCreateInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IRenderTextureCreateInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("name", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("width", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->width), ctx);
    }
    json->getProperty("height", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->height), ctx);
    }
    json->getProperty("passInfo", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->passInfo), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IRenderTextureCreateInfo_finalize)

static bool js_assets_IRenderTextureCreateInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IRenderTextureCreateInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IRenderTextureCreateInfo);
        auto cobj = ptr->get<cc::IRenderTextureCreateInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IRenderTextureCreateInfo);
    auto cobj = ptr->get<cc::IRenderTextureCreateInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->name), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->width), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->height), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->passInfo), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IRenderTextureCreateInfo_constructor, __jsb_cc_IRenderTextureCreateInfo_class, js_cc_IRenderTextureCreateInfo_finalize)

static bool js_cc_IRenderTextureCreateInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IRenderTextureCreateInfo_finalize)

bool js_register_assets_IRenderTextureCreateInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IRenderTextureCreateInfo", obj, nullptr, _SE(js_assets_IRenderTextureCreateInfo_constructor));

    cls->defineProperty("name", _SE(js_assets_IRenderTextureCreateInfo_get_name), _SE(js_assets_IRenderTextureCreateInfo_set_name));
    cls->defineProperty("width", _SE(js_assets_IRenderTextureCreateInfo_get_width), _SE(js_assets_IRenderTextureCreateInfo_set_width));
    cls->defineProperty("height", _SE(js_assets_IRenderTextureCreateInfo_get_height), _SE(js_assets_IRenderTextureCreateInfo_set_height));
    cls->defineProperty("passInfo", _SE(js_assets_IRenderTextureCreateInfo_get_passInfo), _SE(js_assets_IRenderTextureCreateInfo_set_passInfo));
    cls->defineFinalizeFunction(_SE(js_cc_IRenderTextureCreateInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IRenderTextureCreateInfo>(cls);

    __jsb_cc_IRenderTextureCreateInfo_proto = cls->getProto();
    __jsb_cc_IRenderTextureCreateInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_RenderTexture_proto = nullptr; // NOLINT
se::Class* __jsb_cc_RenderTexture_class = nullptr;  // NOLINT

static bool js_assets_RenderTexture_getWindow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderTexture_getWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::RenderWindow* result = cobj->getWindow();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_RenderTexture_getWindow : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_RenderTexture_getWindow)

static bool js_assets_RenderTexture_initWindow(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::RenderTexture>(s);
    SE_PRECONDITION2( cobj, false, "js_assets_RenderTexture_initWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<cc::IRenderTextureCreateInfo, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->initWindow(arg0.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {

            cobj->initWindow();
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_assets_RenderTexture_initWindow)

static bool js_assets_RenderTexture_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderTexture_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::IRenderTextureCreateInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_RenderTexture_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_RenderTexture_initialize)

static bool js_assets_RenderTexture_readPixels(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderTexture_readPixels : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        HolderType<unsigned int, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_RenderTexture_readPixels : Error processing arguments");
        std::vector<unsigned char> result = cobj->readPixels(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_RenderTexture_readPixels : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_assets_RenderTexture_readPixels)

static bool js_assets_RenderTexture_reset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderTexture_reset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::IRenderTextureCreateInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_RenderTexture_reset : Error processing arguments");
        cobj->reset(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_RenderTexture_reset)

static bool js_assets_RenderTexture_resize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderTexture_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_RenderTexture_resize : Error processing arguments");
        cobj->resize(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_assets_RenderTexture_resize)

SE_DECLARE_FINALIZE_FUNC(js_cc_RenderTexture_finalize)

static bool js_assets_RenderTexture_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::RenderTexture);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_RenderTexture_constructor, __jsb_cc_RenderTexture_class, js_cc_RenderTexture_finalize)

static bool js_cc_RenderTexture_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_RenderTexture_finalize)

bool js_register_assets_RenderTexture(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RenderTexture", obj, __jsb_cc_TextureBase_proto, _SE(js_assets_RenderTexture_constructor));

    cls->defineProperty("window", _SE(js_assets_RenderTexture_getWindow_asGetter), nullptr);
    cls->defineFunction("initWindow", _SE(js_assets_RenderTexture_initWindow));
    cls->defineFunction("initialize", _SE(js_assets_RenderTexture_initialize));
    cls->defineFunction("readPixels", _SE(js_assets_RenderTexture_readPixels));
    cls->defineFunction("reset", _SE(js_assets_RenderTexture_reset));
    cls->defineFunction("resize", _SE(js_assets_RenderTexture_resize));
    cls->defineFinalizeFunction(_SE(js_cc_RenderTexture_finalize));
    cls->install();
    JSBClassType::registerClass<cc::RenderTexture>(cls);

    __jsb_cc_RenderTexture_proto = cls->getProto();
    __jsb_cc_RenderTexture_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IMeshBufferView_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IMeshBufferView_class = nullptr;  // NOLINT

static bool js_assets_IMeshBufferView_get_offset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IMeshBufferView>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMeshBufferView_get_offset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->offset, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->offset, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IMeshBufferView_get_offset)

static bool js_assets_IMeshBufferView_set_offset(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IMeshBufferView>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMeshBufferView_set_offset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->offset, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IMeshBufferView_set_offset : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IMeshBufferView_set_offset)

static bool js_assets_IMeshBufferView_get_length(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IMeshBufferView>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMeshBufferView_get_length : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->length, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->length, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IMeshBufferView_get_length)

static bool js_assets_IMeshBufferView_set_length(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IMeshBufferView>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMeshBufferView_set_length : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->length, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IMeshBufferView_set_length : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IMeshBufferView_set_length)

static bool js_assets_IMeshBufferView_get_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IMeshBufferView>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMeshBufferView_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->count, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IMeshBufferView_get_count)

static bool js_assets_IMeshBufferView_set_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IMeshBufferView>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMeshBufferView_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IMeshBufferView_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IMeshBufferView_set_count)

static bool js_assets_IMeshBufferView_get_stride(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IMeshBufferView>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMeshBufferView_get_stride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stride, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stride, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IMeshBufferView_get_stride)

static bool js_assets_IMeshBufferView_set_stride(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IMeshBufferView>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IMeshBufferView_set_stride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stride, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IMeshBufferView_set_stride : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IMeshBufferView_set_stride)


template<>
bool sevalue_to_native(const se::Value &from, cc::IMeshBufferView * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IMeshBufferView*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("offset", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->offset), ctx);
    }
    json->getProperty("length", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->length), ctx);
    }
    json->getProperty("count", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    json->getProperty("stride", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stride), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IMeshBufferView_finalize)

static bool js_assets_IMeshBufferView_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IMeshBufferView);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IMeshBufferView);
        auto cobj = ptr->get<cc::IMeshBufferView>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IMeshBufferView);
    auto cobj = ptr->get<cc::IMeshBufferView>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->offset), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->length), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->count), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->stride), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IMeshBufferView_constructor, __jsb_cc_IMeshBufferView_class, js_cc_IMeshBufferView_finalize)

static bool js_cc_IMeshBufferView_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IMeshBufferView_finalize)

bool js_register_assets_IMeshBufferView(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IMeshBufferView", obj, nullptr, _SE(js_assets_IMeshBufferView_constructor));

    cls->defineProperty("offset", _SE(js_assets_IMeshBufferView_get_offset), _SE(js_assets_IMeshBufferView_set_offset));
    cls->defineProperty("length", _SE(js_assets_IMeshBufferView_get_length), _SE(js_assets_IMeshBufferView_set_length));
    cls->defineProperty("count", _SE(js_assets_IMeshBufferView_get_count), _SE(js_assets_IMeshBufferView_set_count));
    cls->defineProperty("stride", _SE(js_assets_IMeshBufferView_get_stride), _SE(js_assets_IMeshBufferView_set_stride));
    cls->defineFinalizeFunction(_SE(js_cc_IMeshBufferView_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IMeshBufferView>(cls);

    __jsb_cc_IMeshBufferView_proto = cls->getProto();
    __jsb_cc_IMeshBufferView_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_MorphTarget_proto = nullptr; // NOLINT
se::Class* __jsb_cc_MorphTarget_class = nullptr;  // NOLINT

static bool js_assets_MorphTarget_get_displacements(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::MorphTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_MorphTarget_get_displacements : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->displacements, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->displacements, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_MorphTarget_get_displacements)

static bool js_assets_MorphTarget_set_displacements(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::MorphTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_MorphTarget_set_displacements : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->displacements, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_MorphTarget_set_displacements : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_MorphTarget_set_displacements)


template<>
bool sevalue_to_native(const se::Value &from, cc::MorphTarget * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::MorphTarget*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("displacements", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->displacements), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_MorphTarget_finalize)

static bool js_assets_MorphTarget_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::MorphTarget);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::MorphTarget);
    auto cobj = ptr->get<cc::MorphTarget>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->displacements), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_MorphTarget_constructor, __jsb_cc_MorphTarget_class, js_cc_MorphTarget_finalize)

static bool js_cc_MorphTarget_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_MorphTarget_finalize)

bool js_register_assets_MorphTarget(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("MorphTarget", obj, nullptr, _SE(js_assets_MorphTarget_constructor));

    cls->defineProperty("displacements", _SE(js_assets_MorphTarget_get_displacements), _SE(js_assets_MorphTarget_set_displacements));
    cls->defineFinalizeFunction(_SE(js_cc_MorphTarget_finalize));
    cls->install();
    JSBClassType::registerClass<cc::MorphTarget>(cls);

    __jsb_cc_MorphTarget_proto = cls->getProto();
    __jsb_cc_MorphTarget_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_SubMeshMorph_proto = nullptr; // NOLINT
se::Class* __jsb_cc_SubMeshMorph_class = nullptr;  // NOLINT

static bool js_assets_SubMeshMorph_get_attributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SubMeshMorph>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_SubMeshMorph_get_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->attributes, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->attributes, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_SubMeshMorph_get_attributes)

static bool js_assets_SubMeshMorph_set_attributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::SubMeshMorph>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_SubMeshMorph_set_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->attributes, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_SubMeshMorph_set_attributes : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_SubMeshMorph_set_attributes)

static bool js_assets_SubMeshMorph_get_targets(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SubMeshMorph>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_SubMeshMorph_get_targets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->targets, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->targets, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_SubMeshMorph_get_targets)

static bool js_assets_SubMeshMorph_set_targets(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::SubMeshMorph>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_SubMeshMorph_set_targets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->targets, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_SubMeshMorph_set_targets : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_SubMeshMorph_set_targets)

static bool js_assets_SubMeshMorph_get_weights(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SubMeshMorph>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_SubMeshMorph_get_weights : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->weights, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->weights, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_SubMeshMorph_get_weights)

static bool js_assets_SubMeshMorph_set_weights(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::SubMeshMorph>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_SubMeshMorph_set_weights : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->weights, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_SubMeshMorph_set_weights : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_SubMeshMorph_set_weights)


template<>
bool sevalue_to_native(const se::Value &from, cc::SubMeshMorph * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::SubMeshMorph*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("attributes", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->attributes), ctx);
    }
    json->getProperty("targets", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->targets), ctx);
    }
    json->getProperty("weights", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->weights), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_SubMeshMorph_finalize)

static bool js_assets_SubMeshMorph_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::SubMeshMorph);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::SubMeshMorph);
        auto cobj = ptr->get<cc::SubMeshMorph>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::SubMeshMorph);
    auto cobj = ptr->get<cc::SubMeshMorph>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->attributes), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->targets), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->weights), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_SubMeshMorph_constructor, __jsb_cc_SubMeshMorph_class, js_cc_SubMeshMorph_finalize)

static bool js_cc_SubMeshMorph_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_SubMeshMorph_finalize)

bool js_register_assets_SubMeshMorph(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SubMeshMorph", obj, nullptr, _SE(js_assets_SubMeshMorph_constructor));

    cls->defineProperty("attributes", _SE(js_assets_SubMeshMorph_get_attributes), _SE(js_assets_SubMeshMorph_set_attributes));
    cls->defineProperty("targets", _SE(js_assets_SubMeshMorph_get_targets), _SE(js_assets_SubMeshMorph_set_targets));
    cls->defineProperty("weights", _SE(js_assets_SubMeshMorph_get_weights), _SE(js_assets_SubMeshMorph_set_weights));
    cls->defineFinalizeFunction(_SE(js_cc_SubMeshMorph_finalize));
    cls->install();
    JSBClassType::registerClass<cc::SubMeshMorph>(cls);

    __jsb_cc_SubMeshMorph_proto = cls->getProto();
    __jsb_cc_SubMeshMorph_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_Morph_proto = nullptr; // NOLINT
se::Class* __jsb_cc_Morph_class = nullptr;  // NOLINT

static bool js_assets_Morph_get_subMeshMorphs(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Morph>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Morph_get_subMeshMorphs : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->subMeshMorphs, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->subMeshMorphs, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_Morph_get_subMeshMorphs)

static bool js_assets_Morph_set_subMeshMorphs(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Morph>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Morph_set_subMeshMorphs : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->subMeshMorphs, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_Morph_set_subMeshMorphs : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_Morph_set_subMeshMorphs)

static bool js_assets_Morph_get_weights(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Morph>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Morph_get_weights : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->weights, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->weights, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_Morph_get_weights)

static bool js_assets_Morph_set_weights(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Morph>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Morph_set_weights : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->weights, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_Morph_set_weights : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_Morph_set_weights)

static bool js_assets_Morph_get_targetNames(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Morph>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Morph_get_targetNames : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->targetNames, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->targetNames, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_Morph_get_targetNames)

static bool js_assets_Morph_set_targetNames(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Morph>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Morph_set_targetNames : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->targetNames, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_Morph_set_targetNames : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_Morph_set_targetNames)


template<>
bool sevalue_to_native(const se::Value &from, cc::Morph * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::Morph*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("subMeshMorphs", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->subMeshMorphs), ctx);
    }
    json->getProperty("weights", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->weights), ctx);
    }
    json->getProperty("targetNames", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->targetNames), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_Morph_finalize)

static bool js_assets_Morph_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Morph);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Morph);
        auto cobj = ptr->get<cc::Morph>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Morph);
    auto cobj = ptr->get<cc::Morph>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->subMeshMorphs), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->weights), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->targetNames), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_Morph_constructor, __jsb_cc_Morph_class, js_cc_Morph_finalize)

static bool js_cc_Morph_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_Morph_finalize)

bool js_register_assets_Morph(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Morph", obj, nullptr, _SE(js_assets_Morph_constructor));

    cls->defineProperty("subMeshMorphs", _SE(js_assets_Morph_get_subMeshMorphs), _SE(js_assets_Morph_set_subMeshMorphs));
    cls->defineProperty("weights", _SE(js_assets_Morph_get_weights), _SE(js_assets_Morph_set_weights));
    cls->defineProperty("targetNames", _SE(js_assets_Morph_get_targetNames), _SE(js_assets_Morph_set_targetNames));
    cls->defineFinalizeFunction(_SE(js_cc_Morph_finalize));
    cls->install();
    JSBClassType::registerClass<cc::Morph>(cls);

    __jsb_cc_Morph_proto = cls->getProto();
    __jsb_cc_Morph_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IGeometricInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IGeometricInfo_class = nullptr;  // NOLINT

static bool js_assets_IGeometricInfo_get_positions(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IGeometricInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IGeometricInfo_get_positions : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->positions, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->positions, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IGeometricInfo_get_positions)

static bool js_assets_IGeometricInfo_set_positions(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IGeometricInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IGeometricInfo_set_positions : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->positions, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IGeometricInfo_set_positions : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IGeometricInfo_set_positions)

static bool js_assets_IGeometricInfo_get_indices(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IGeometricInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IGeometricInfo_get_indices : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->indices, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->indices, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IGeometricInfo_get_indices)

static bool js_assets_IGeometricInfo_set_indices(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IGeometricInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IGeometricInfo_set_indices : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->indices, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IGeometricInfo_set_indices : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IGeometricInfo_set_indices)

static bool js_assets_IGeometricInfo_get_doubleSided(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IGeometricInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IGeometricInfo_get_doubleSided : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->doubleSided, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->doubleSided, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IGeometricInfo_get_doubleSided)

static bool js_assets_IGeometricInfo_set_doubleSided(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IGeometricInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IGeometricInfo_set_doubleSided : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->doubleSided, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IGeometricInfo_set_doubleSided : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IGeometricInfo_set_doubleSided)

static bool js_assets_IGeometricInfo_get_boundingBox(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IGeometricInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IGeometricInfo_get_boundingBox : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->boundingBox, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->boundingBox, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IGeometricInfo_get_boundingBox)

static bool js_assets_IGeometricInfo_set_boundingBox(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IGeometricInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IGeometricInfo_set_boundingBox : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->boundingBox, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IGeometricInfo_set_boundingBox : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IGeometricInfo_set_boundingBox)


template<>
bool sevalue_to_native(const se::Value &from, cc::IGeometricInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IGeometricInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("positions", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->positions), ctx);
    }
    json->getProperty("indices", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->indices), ctx);
    }
    json->getProperty("doubleSided", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->doubleSided), ctx);
    }
    json->getProperty("boundingBox", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->boundingBox), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IGeometricInfo_finalize)

static bool js_assets_IGeometricInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IGeometricInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IGeometricInfo);
        auto cobj = ptr->get<cc::IGeometricInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IGeometricInfo);
    auto cobj = ptr->get<cc::IGeometricInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->positions), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->indices), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->doubleSided), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->boundingBox), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IGeometricInfo_constructor, __jsb_cc_IGeometricInfo_class, js_cc_IGeometricInfo_finalize)

static bool js_cc_IGeometricInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IGeometricInfo_finalize)

bool js_register_assets_IGeometricInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IGeometricInfo", obj, nullptr, _SE(js_assets_IGeometricInfo_constructor));

    cls->defineProperty("positions", _SE(js_assets_IGeometricInfo_get_positions), _SE(js_assets_IGeometricInfo_set_positions));
    cls->defineProperty("indices", _SE(js_assets_IGeometricInfo_get_indices), _SE(js_assets_IGeometricInfo_set_indices));
    cls->defineProperty("doubleSided", _SE(js_assets_IGeometricInfo_get_doubleSided), _SE(js_assets_IGeometricInfo_set_doubleSided));
    cls->defineProperty("boundingBox", _SE(js_assets_IGeometricInfo_get_boundingBox), _SE(js_assets_IGeometricInfo_set_boundingBox));
    cls->defineFinalizeFunction(_SE(js_cc_IGeometricInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IGeometricInfo>(cls);

    __jsb_cc_IGeometricInfo_proto = cls->getProto();
    __jsb_cc_IGeometricInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IFlatBuffer_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IFlatBuffer_class = nullptr;  // NOLINT

static bool js_assets_IFlatBuffer_get_stride(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IFlatBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IFlatBuffer_get_stride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stride, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->stride, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IFlatBuffer_get_stride)

static bool js_assets_IFlatBuffer_set_stride(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IFlatBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IFlatBuffer_set_stride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stride, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IFlatBuffer_set_stride : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IFlatBuffer_set_stride)

static bool js_assets_IFlatBuffer_get_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IFlatBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IFlatBuffer_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->count, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IFlatBuffer_get_count)

static bool js_assets_IFlatBuffer_set_count(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IFlatBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IFlatBuffer_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IFlatBuffer_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IFlatBuffer_set_count)

static bool js_assets_IFlatBuffer_get_buffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IFlatBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IFlatBuffer_get_buffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->buffer, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->buffer, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IFlatBuffer_get_buffer)

static bool js_assets_IFlatBuffer_set_buffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IFlatBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IFlatBuffer_set_buffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->buffer, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IFlatBuffer_set_buffer : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IFlatBuffer_set_buffer)


template<>
bool sevalue_to_native(const se::Value &from, cc::IFlatBuffer * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IFlatBuffer*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("stride", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stride), ctx);
    }
    json->getProperty("count", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    json->getProperty("buffer", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->buffer), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IFlatBuffer_finalize)

static bool js_assets_IFlatBuffer_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IFlatBuffer);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IFlatBuffer);
        auto cobj = ptr->get<cc::IFlatBuffer>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IFlatBuffer);
    auto cobj = ptr->get<cc::IFlatBuffer>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->stride), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->count), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->buffer), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IFlatBuffer_constructor, __jsb_cc_IFlatBuffer_class, js_cc_IFlatBuffer_finalize)

static bool js_cc_IFlatBuffer_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IFlatBuffer_finalize)

bool js_register_assets_IFlatBuffer(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IFlatBuffer", obj, nullptr, _SE(js_assets_IFlatBuffer_constructor));

    cls->defineProperty("stride", _SE(js_assets_IFlatBuffer_get_stride), _SE(js_assets_IFlatBuffer_set_stride));
    cls->defineProperty("count", _SE(js_assets_IFlatBuffer_get_count), _SE(js_assets_IFlatBuffer_set_count));
    cls->defineProperty("buffer", _SE(js_assets_IFlatBuffer_get_buffer), _SE(js_assets_IFlatBuffer_set_buffer));
    cls->defineFinalizeFunction(_SE(js_cc_IFlatBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IFlatBuffer>(cls);

    __jsb_cc_IFlatBuffer_proto = cls->getProto();
    __jsb_cc_IFlatBuffer_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_RenderingSubMesh_proto = nullptr; // NOLINT
se::Class* __jsb_cc_RenderingSubMesh_class = nullptr;  // NOLINT

static bool js_assets_RenderingSubMesh_enableVertexIdChannel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderingSubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderingSubMesh_enableVertexIdChannel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Device*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_RenderingSubMesh_enableVertexIdChannel : Error processing arguments");
        cobj->enableVertexIdChannel(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_RenderingSubMesh_enableVertexIdChannel)

static bool js_assets_RenderingSubMesh_genFlatBuffers(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderingSubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderingSubMesh_genFlatBuffers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->genFlatBuffers();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_RenderingSubMesh_genFlatBuffers)

static bool js_assets_RenderingSubMesh_getAttributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderingSubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderingSubMesh_getAttributes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::Attribute>& result = cobj->getAttributes();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_RenderingSubMesh_getAttributes : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_RenderingSubMesh_getAttributes)

static bool js_assets_RenderingSubMesh_getFlatBuffers(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderingSubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderingSubMesh_getFlatBuffers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::IFlatBuffer>& result = cobj->getFlatBuffers();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_RenderingSubMesh_getFlatBuffers : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_RenderingSubMesh_getFlatBuffers)

static bool js_assets_RenderingSubMesh_getGeometricInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderingSubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderingSubMesh_getGeometricInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::IGeometricInfo& result = cobj->getGeometricInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_RenderingSubMesh_getGeometricInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_RenderingSubMesh_getGeometricInfo)

static bool js_assets_RenderingSubMesh_getIaInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderingSubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderingSubMesh_getIaInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::InputAssemblerInfo& result = cobj->getIaInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_RenderingSubMesh_getIaInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_RenderingSubMesh_getIaInfo)

static bool js_assets_RenderingSubMesh_getIndexBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderingSubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderingSubMesh_getIndexBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Buffer* result = cobj->getIndexBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_RenderingSubMesh_getIndexBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_RenderingSubMesh_getIndexBuffer)

static bool js_assets_RenderingSubMesh_getJointMappedBuffers(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderingSubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderingSubMesh_getJointMappedBuffers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::Buffer *>& result = cobj->getJointMappedBuffers();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_RenderingSubMesh_getJointMappedBuffers : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_RenderingSubMesh_getJointMappedBuffers)

static bool js_assets_RenderingSubMesh_getMesh(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderingSubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderingSubMesh_getMesh : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Mesh* result = cobj->getMesh();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_RenderingSubMesh_getMesh : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_RenderingSubMesh_getMesh)

static bool js_assets_RenderingSubMesh_getPrimitiveMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderingSubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderingSubMesh_getPrimitiveMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getPrimitiveMode());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_RenderingSubMesh_getPrimitiveMode : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_RenderingSubMesh_getPrimitiveMode)

static bool js_assets_RenderingSubMesh_getSubMeshIdx(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderingSubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderingSubMesh_getSubMeshIdx : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const boost::optional<unsigned int>& result = cobj->getSubMeshIdx();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_RenderingSubMesh_getSubMeshIdx : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_RenderingSubMesh_getSubMeshIdx)

static bool js_assets_RenderingSubMesh_getVertexBuffers(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderingSubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderingSubMesh_getVertexBuffers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::Buffer *>& result = cobj->getVertexBuffers();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_RenderingSubMesh_getVertexBuffers : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_RenderingSubMesh_getVertexBuffers)

static bool js_assets_RenderingSubMesh_indirectBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderingSubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderingSubMesh_indirectBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Buffer* result = cobj->indirectBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_RenderingSubMesh_indirectBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_RenderingSubMesh_indirectBuffer)

static bool js_assets_RenderingSubMesh_setFlatBuffers(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderingSubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderingSubMesh_setFlatBuffers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::IFlatBuffer>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_RenderingSubMesh_setFlatBuffers : Error processing arguments");
        cobj->setFlatBuffers(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_assets_RenderingSubMesh_setFlatBuffers)

static bool js_assets_RenderingSubMesh_setMesh(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderingSubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderingSubMesh_setMesh : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Mesh*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_RenderingSubMesh_setMesh : Error processing arguments");
        cobj->setMesh(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_assets_RenderingSubMesh_setMesh)

static bool js_assets_RenderingSubMesh_setSubMeshIdx(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::RenderingSubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_RenderingSubMesh_setSubMeshIdx : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_RenderingSubMesh_setSubMeshIdx : Error processing arguments");
        cobj->setSubMeshIdx(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_assets_RenderingSubMesh_setSubMeshIdx)

SE_DECLARE_FINALIZE_FUNC(js_cc_RenderingSubMesh_finalize)

static bool js_assets_RenderingSubMesh_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 4) {
            HolderType<std::vector<cc::gfx::Buffer *>, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<std::vector<cc::gfx::Attribute>, true> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<cc::gfx::PrimitiveMode, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<cc::gfx::Buffer*, false> arg3 = {};
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::RenderingSubMesh, arg0.value(), arg1.value(), arg2.value(), arg3.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 3) {
            HolderType<std::vector<cc::gfx::Buffer *>, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<std::vector<cc::gfx::Attribute>, true> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<cc::gfx::PrimitiveMode, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::RenderingSubMesh, arg0.value(), arg1.value(), arg2.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 5) {
            HolderType<std::vector<cc::gfx::Buffer *>, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<std::vector<cc::gfx::Attribute>, true> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<cc::gfx::PrimitiveMode, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<cc::gfx::Buffer*, false> arg3 = {};
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<cc::gfx::Buffer*, false> arg4 = {};
            ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::RenderingSubMesh, arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_assets_RenderingSubMesh_constructor, __jsb_cc_RenderingSubMesh_class, js_cc_RenderingSubMesh_finalize)

static bool js_cc_RenderingSubMesh_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_RenderingSubMesh_finalize)

bool js_register_assets_RenderingSubMesh(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RenderingSubMesh", obj, __jsb_cc_Asset_proto, _SE(js_assets_RenderingSubMesh_constructor));

    cls->defineProperty("primitiveMode", _SE(js_assets_RenderingSubMesh_getPrimitiveMode_asGetter), nullptr);
    cls->defineProperty({"iaInfo", "_iaInfo"}, _SE(js_assets_RenderingSubMesh_getIaInfo_asGetter), nullptr);
    cls->defineProperty("jointMappedBuffers", _SE(js_assets_RenderingSubMesh_getJointMappedBuffers_asGetter), nullptr);
    cls->defineProperty({"flatBuffers", "_flatBuffers"}, _SE(js_assets_RenderingSubMesh_getFlatBuffers_asGetter), _SE(js_assets_RenderingSubMesh_setFlatBuffers_asSetter));
    cls->defineProperty("mesh", _SE(js_assets_RenderingSubMesh_getMesh_asGetter), _SE(js_assets_RenderingSubMesh_setMesh_asSetter));
    cls->defineProperty("subMeshIdx", _SE(js_assets_RenderingSubMesh_getSubMeshIdx_asGetter), _SE(js_assets_RenderingSubMesh_setSubMeshIdx_asSetter));
    cls->defineFunction("enableVertexIdChannel", _SE(js_assets_RenderingSubMesh_enableVertexIdChannel));
    cls->defineFunction("genFlatBuffers", _SE(js_assets_RenderingSubMesh_genFlatBuffers));
    cls->defineFunction("getAttributes", _SE(js_assets_RenderingSubMesh_getAttributes));
    cls->defineFunction("getGeometricInfo", _SE(js_assets_RenderingSubMesh_getGeometricInfo));
    cls->defineFunction("getIndexBuffer", _SE(js_assets_RenderingSubMesh_getIndexBuffer));
    cls->defineFunction("getVertexBuffers", _SE(js_assets_RenderingSubMesh_getVertexBuffers));
    cls->defineFunction("indirectBuffer", _SE(js_assets_RenderingSubMesh_indirectBuffer));
    cls->defineFinalizeFunction(_SE(js_cc_RenderingSubMesh_finalize));
    cls->install();
    JSBClassType::registerClass<cc::RenderingSubMesh>(cls);

    __jsb_cc_RenderingSubMesh_proto = cls->getProto();
    __jsb_cc_RenderingSubMesh_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_SceneAsset_proto = nullptr; // NOLINT
se::Class* __jsb_cc_SceneAsset_class = nullptr;  // NOLINT

static bool js_assets_SceneAsset_getScene(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SceneAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_SceneAsset_getScene : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Scene* result = cobj->getScene();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_SceneAsset_getScene : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_SceneAsset_getScene)

static bool js_assets_SceneAsset_setScene(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SceneAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_SceneAsset_setScene : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Scene*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_SceneAsset_setScene : Error processing arguments");
        cobj->setScene(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_SceneAsset_setScene)

SE_DECLARE_FINALIZE_FUNC(js_cc_SceneAsset_finalize)

static bool js_assets_SceneAsset_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::SceneAsset);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_SceneAsset_constructor, __jsb_cc_SceneAsset_class, js_cc_SceneAsset_finalize)

static bool js_cc_SceneAsset_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_SceneAsset_finalize)

bool js_register_assets_SceneAsset(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SceneAsset", obj, __jsb_cc_Asset_proto, _SE(js_assets_SceneAsset_constructor));

    cls->defineFunction("getScene", _SE(js_assets_SceneAsset_getScene));
    cls->defineFunction("setScene", _SE(js_assets_SceneAsset_setScene));
    cls->defineFinalizeFunction(_SE(js_cc_SceneAsset_finalize));
    cls->install();
    JSBClassType::registerClass<cc::SceneAsset>(cls);

    __jsb_cc_SceneAsset_proto = cls->getProto();
    __jsb_cc_SceneAsset_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_TextAsset_proto = nullptr; // NOLINT
se::Class* __jsb_cc_TextAsset_class = nullptr;  // NOLINT

static bool js_assets_TextAsset_get_text(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextAsset_get_text : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->text, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->text, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_TextAsset_get_text)

static bool js_assets_TextAsset_set_text(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::TextAsset>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextAsset_set_text : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->text, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_TextAsset_set_text : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_TextAsset_set_text)

SE_DECLARE_FINALIZE_FUNC(js_cc_TextAsset_finalize)

static bool js_assets_TextAsset_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::TextAsset);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_TextAsset_constructor, __jsb_cc_TextAsset_class, js_cc_TextAsset_finalize)

static bool js_cc_TextAsset_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_TextAsset_finalize)

bool js_register_assets_TextAsset(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TextAsset", obj, __jsb_cc_Asset_proto, _SE(js_assets_TextAsset_constructor));

    cls->defineProperty("text", _SE(js_assets_TextAsset_get_text), _SE(js_assets_TextAsset_set_text));
    cls->defineFinalizeFunction(_SE(js_cc_TextAsset_finalize));
    cls->install();
    JSBClassType::registerClass<cc::TextAsset>(cls);

    __jsb_cc_TextAsset_proto = cls->getProto();
    __jsb_cc_TextAsset_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_SimpleTexture_proto = nullptr; // NOLINT
se::Class* __jsb_cc_SimpleTexture_class = nullptr;  // NOLINT

static bool js_assets_SimpleTexture_assignImage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SimpleTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_SimpleTexture_assignImage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::ImageAsset*, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_SimpleTexture_assignImage : Error processing arguments");
        cobj->assignImage(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<cc::ImageAsset*, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_SimpleTexture_assignImage : Error processing arguments");
        cobj->assignImage(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_SimpleTexture_assignImage)

static bool js_assets_SimpleTexture_checkTextureLoaded(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SimpleTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_SimpleTexture_checkTextureLoaded : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->checkTextureLoaded();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_SimpleTexture_checkTextureLoaded)

static bool js_assets_SimpleTexture_mipmapLevel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SimpleTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_SimpleTexture_mipmapLevel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->mipmapLevel();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_SimpleTexture_mipmapLevel : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_SimpleTexture_mipmapLevel)

static bool js_assets_SimpleTexture_setMipmapLevel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SimpleTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_SimpleTexture_setMipmapLevel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_SimpleTexture_setMipmapLevel : Error processing arguments");
        cobj->setMipmapLevel(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_assets_SimpleTexture_setMipmapLevel)

static bool js_assets_SimpleTexture_updateImage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SimpleTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_SimpleTexture_updateImage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateImage();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_SimpleTexture_updateImage)

static bool js_assets_SimpleTexture_updateMipmaps(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SimpleTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_SimpleTexture_updateMipmaps : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_SimpleTexture_updateMipmaps : Error processing arguments");
        cobj->updateMipmaps(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_assets_SimpleTexture_updateMipmaps)

static bool js_assets_SimpleTexture_uploadData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SimpleTexture>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_SimpleTexture_uploadData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<const unsigned char*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_SimpleTexture_uploadData : Error processing arguments");
        cobj->uploadData(arg0.value());
        return true;
    }
    if (argc == 2) {
        HolderType<const unsigned char*, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_SimpleTexture_uploadData : Error processing arguments");
        cobj->uploadData(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<const unsigned char*, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_SimpleTexture_uploadData : Error processing arguments");
        cobj->uploadData(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_SimpleTexture_uploadData)
static bool js_cc_SimpleTexture_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_SimpleTexture_finalize)

bool js_register_assets_SimpleTexture(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SimpleTexture", obj, __jsb_cc_TextureBase_proto, nullptr);

    cls->defineProperty("mipmapLevel", _SE(js_assets_SimpleTexture_mipmapLevel_asGetter), _SE(js_assets_SimpleTexture_setMipmapLevel_asSetter));
    cls->defineFunction("assignImage", _SE(js_assets_SimpleTexture_assignImage));
    cls->defineFunction("checkTextureLoaded", _SE(js_assets_SimpleTexture_checkTextureLoaded));
    cls->defineFunction("updateImage", _SE(js_assets_SimpleTexture_updateImage));
    cls->defineFunction("updateMipmaps", _SE(js_assets_SimpleTexture_updateMipmaps));
    cls->defineFunction("uploadData", _SE(js_assets_SimpleTexture_uploadData));
    cls->defineFinalizeFunction(_SE(js_cc_SimpleTexture_finalize));
    cls->install();
    JSBClassType::registerClass<cc::SimpleTexture>(cls);

    __jsb_cc_SimpleTexture_proto = cls->getProto();
    __jsb_cc_SimpleTexture_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_ITexture2DSerializeData_proto = nullptr; // NOLINT
se::Class* __jsb_cc_ITexture2DSerializeData_class = nullptr;  // NOLINT

static bool js_assets_ITexture2DSerializeData_get_base(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITexture2DSerializeData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITexture2DSerializeData_get_base : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->base, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->base, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITexture2DSerializeData_get_base)

static bool js_assets_ITexture2DSerializeData_set_base(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITexture2DSerializeData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITexture2DSerializeData_set_base : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->base, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITexture2DSerializeData_set_base : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITexture2DSerializeData_set_base)

static bool js_assets_ITexture2DSerializeData_get_mipmaps(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITexture2DSerializeData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITexture2DSerializeData_get_mipmaps : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->mipmaps, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->mipmaps, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITexture2DSerializeData_get_mipmaps)

static bool js_assets_ITexture2DSerializeData_set_mipmaps(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITexture2DSerializeData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITexture2DSerializeData_set_mipmaps : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->mipmaps, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITexture2DSerializeData_set_mipmaps : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITexture2DSerializeData_set_mipmaps)


template<>
bool sevalue_to_native(const se::Value &from, cc::ITexture2DSerializeData * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::ITexture2DSerializeData*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("base", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->base), ctx);
    }
    json->getProperty("mipmaps", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mipmaps), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_ITexture2DSerializeData_finalize)

static bool js_assets_ITexture2DSerializeData_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITexture2DSerializeData);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITexture2DSerializeData);
        auto cobj = ptr->get<cc::ITexture2DSerializeData>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITexture2DSerializeData);
    auto cobj = ptr->get<cc::ITexture2DSerializeData>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->base), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->mipmaps), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_ITexture2DSerializeData_constructor, __jsb_cc_ITexture2DSerializeData_class, js_cc_ITexture2DSerializeData_finalize)

static bool js_cc_ITexture2DSerializeData_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_ITexture2DSerializeData_finalize)

bool js_register_assets_ITexture2DSerializeData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ITexture2DSerializeData", obj, nullptr, _SE(js_assets_ITexture2DSerializeData_constructor));

    cls->defineProperty("base", _SE(js_assets_ITexture2DSerializeData_get_base), _SE(js_assets_ITexture2DSerializeData_set_base));
    cls->defineProperty("mipmaps", _SE(js_assets_ITexture2DSerializeData_get_mipmaps), _SE(js_assets_ITexture2DSerializeData_set_mipmaps));
    cls->defineFinalizeFunction(_SE(js_cc_ITexture2DSerializeData_finalize));
    cls->install();
    JSBClassType::registerClass<cc::ITexture2DSerializeData>(cls);

    __jsb_cc_ITexture2DSerializeData_proto = cls->getProto();
    __jsb_cc_ITexture2DSerializeData_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_ITexture2DCreateInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_ITexture2DCreateInfo_class = nullptr;  // NOLINT

static bool js_assets_ITexture2DCreateInfo_get_width(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITexture2DCreateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITexture2DCreateInfo_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->width, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->width, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITexture2DCreateInfo_get_width)

static bool js_assets_ITexture2DCreateInfo_set_width(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITexture2DCreateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITexture2DCreateInfo_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->width, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITexture2DCreateInfo_set_width : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITexture2DCreateInfo_set_width)

static bool js_assets_ITexture2DCreateInfo_get_height(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITexture2DCreateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITexture2DCreateInfo_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->height, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->height, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITexture2DCreateInfo_get_height)

static bool js_assets_ITexture2DCreateInfo_set_height(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITexture2DCreateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITexture2DCreateInfo_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->height, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITexture2DCreateInfo_set_height : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITexture2DCreateInfo_set_height)

static bool js_assets_ITexture2DCreateInfo_get_format(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITexture2DCreateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITexture2DCreateInfo_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->format, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->format, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITexture2DCreateInfo_get_format)

static bool js_assets_ITexture2DCreateInfo_set_format(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITexture2DCreateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITexture2DCreateInfo_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->format, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITexture2DCreateInfo_set_format : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITexture2DCreateInfo_set_format)

static bool js_assets_ITexture2DCreateInfo_get_mipmapLevel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITexture2DCreateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITexture2DCreateInfo_get_mipmapLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->mipmapLevel, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->mipmapLevel, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITexture2DCreateInfo_get_mipmapLevel)

static bool js_assets_ITexture2DCreateInfo_set_mipmapLevel(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITexture2DCreateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITexture2DCreateInfo_set_mipmapLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->mipmapLevel, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITexture2DCreateInfo_set_mipmapLevel : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITexture2DCreateInfo_set_mipmapLevel)


template<>
bool sevalue_to_native(const se::Value &from, cc::ITexture2DCreateInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::ITexture2DCreateInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("width", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->width), ctx);
    }
    json->getProperty("height", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->height), ctx);
    }
    json->getProperty("format", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->format), ctx);
    }
    json->getProperty("mipmapLevel", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mipmapLevel), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_ITexture2DCreateInfo_finalize)

static bool js_assets_ITexture2DCreateInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITexture2DCreateInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITexture2DCreateInfo);
        auto cobj = ptr->get<cc::ITexture2DCreateInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITexture2DCreateInfo);
    auto cobj = ptr->get<cc::ITexture2DCreateInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->width), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->height), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->format), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->mipmapLevel), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_ITexture2DCreateInfo_constructor, __jsb_cc_ITexture2DCreateInfo_class, js_cc_ITexture2DCreateInfo_finalize)

static bool js_cc_ITexture2DCreateInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_ITexture2DCreateInfo_finalize)

bool js_register_assets_ITexture2DCreateInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ITexture2DCreateInfo", obj, nullptr, _SE(js_assets_ITexture2DCreateInfo_constructor));

    cls->defineProperty("width", _SE(js_assets_ITexture2DCreateInfo_get_width), _SE(js_assets_ITexture2DCreateInfo_set_width));
    cls->defineProperty("height", _SE(js_assets_ITexture2DCreateInfo_get_height), _SE(js_assets_ITexture2DCreateInfo_set_height));
    cls->defineProperty("format", _SE(js_assets_ITexture2DCreateInfo_get_format), _SE(js_assets_ITexture2DCreateInfo_set_format));
    cls->defineProperty("mipmapLevel", _SE(js_assets_ITexture2DCreateInfo_get_mipmapLevel), _SE(js_assets_ITexture2DCreateInfo_set_mipmapLevel));
    cls->defineFinalizeFunction(_SE(js_cc_ITexture2DCreateInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::ITexture2DCreateInfo>(cls);

    __jsb_cc_ITexture2DCreateInfo_proto = cls->getProto();
    __jsb_cc_ITexture2DCreateInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_Texture2D_proto = nullptr; // NOLINT
se::Class* __jsb_cc_Texture2D_class = nullptr;  // NOLINT

static bool js_assets_Texture2D_create(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Texture2D>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Texture2D_create : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Texture2D_create : Error processing arguments");
        cobj->create(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        HolderType<cc::PixelFormat, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Texture2D_create : Error processing arguments");
        cobj->create(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    if (argc == 4) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        HolderType<cc::PixelFormat, false> arg2 = {};
        HolderType<unsigned int, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Texture2D_create : Error processing arguments");
        cobj->create(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_assets_Texture2D_create)

static bool js_assets_Texture2D_description(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Texture2D>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Texture2D_description : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->description();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Texture2D_description : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_Texture2D_description)

static bool js_assets_Texture2D_getGfxTextureCreateInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Texture2D>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Texture2D_getGfxTextureCreateInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<cc::gfx::TextureUsageBit, false> arg0 = {};
        HolderType<cc::gfx::Format, false> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        HolderType<cc::gfx::TextureFlagBit, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Texture2D_getGfxTextureCreateInfo : Error processing arguments");
        cc::gfx::TextureInfo result = cobj->getGfxTextureCreateInfo(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Texture2D_getGfxTextureCreateInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_assets_Texture2D_getGfxTextureCreateInfo)

static bool js_assets_Texture2D_getHtmlElementObj(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Texture2D>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Texture2D_getHtmlElementObj : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        void** result = cobj->getHtmlElementObj();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Texture2D_getHtmlElementObj : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_Texture2D_getHtmlElementObj)

static bool js_assets_Texture2D_getImage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Texture2D>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Texture2D_getImage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::ImageAsset* result = cobj->getImage();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Texture2D_getImage : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_Texture2D_getImage)

static bool js_assets_Texture2D_getMipmaps(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Texture2D>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Texture2D_getMipmaps : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::IntrusivePtr<cc::ImageAsset>>& result = cobj->getMipmaps();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Texture2D_getMipmaps : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_Texture2D_getMipmaps)

static bool js_assets_Texture2D_getMipmapsUuids(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Texture2D>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Texture2D_getMipmapsUuids : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<std::string>& result = cobj->getMipmapsUuids();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Texture2D_getMipmapsUuids : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_Texture2D_getMipmapsUuids)

static bool js_assets_Texture2D_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Texture2D>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Texture2D_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->initialize();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_Texture2D_initialize)

static bool js_assets_Texture2D_releaseTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Texture2D>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Texture2D_releaseTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->releaseTexture();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_Texture2D_releaseTexture)

static bool js_assets_Texture2D_reset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Texture2D>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Texture2D_reset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::ITexture2DCreateInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Texture2D_reset : Error processing arguments");
        cobj->reset(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_Texture2D_reset)

static bool js_assets_Texture2D_setImage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Texture2D>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Texture2D_setImage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::ImageAsset*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Texture2D_setImage : Error processing arguments");
        cobj->setImage(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_Texture2D_setImage)

static bool js_assets_Texture2D_setMipmaps(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Texture2D>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Texture2D_setMipmaps : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::IntrusivePtr<cc::ImageAsset>>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Texture2D_setMipmaps : Error processing arguments");
        cobj->setMipmaps(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_Texture2D_setMipmaps)

static bool js_assets_Texture2D_syncMipmapsForJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Texture2D>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Texture2D_syncMipmapsForJS : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::IntrusivePtr<cc::ImageAsset>>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Texture2D_syncMipmapsForJS : Error processing arguments");
        cobj->syncMipmapsForJS(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_Texture2D_syncMipmapsForJS)

SE_DECLARE_FINALIZE_FUNC(js_cc_Texture2D_finalize)

static bool js_assets_Texture2D_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Texture2D);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_Texture2D_constructor, __jsb_cc_Texture2D_class, js_cc_Texture2D_finalize)

static bool js_cc_Texture2D_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_Texture2D_finalize)

bool js_register_assets_Texture2D(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Texture2D", obj, __jsb_cc_SimpleTexture_proto, _SE(js_assets_Texture2D_constructor));

    cls->defineFunction("create", _SE(js_assets_Texture2D_create));
    cls->defineFunction("description", _SE(js_assets_Texture2D_description));
    cls->defineFunction("getGfxTextureCreateInfo", _SE(js_assets_Texture2D_getGfxTextureCreateInfo));
    cls->defineFunction("getHtmlElementObj", _SE(js_assets_Texture2D_getHtmlElementObj));
    cls->defineFunction("getImage", _SE(js_assets_Texture2D_getImage));
    cls->defineFunction("getMipmaps", _SE(js_assets_Texture2D_getMipmaps));
    cls->defineFunction("getMipmapsUuids", _SE(js_assets_Texture2D_getMipmapsUuids));
    cls->defineFunction("initialize", _SE(js_assets_Texture2D_initialize));
    cls->defineFunction("releaseTexture", _SE(js_assets_Texture2D_releaseTexture));
    cls->defineFunction("reset", _SE(js_assets_Texture2D_reset));
    cls->defineFunction("setImage", _SE(js_assets_Texture2D_setImage));
    cls->defineFunction("setMipmaps", _SE(js_assets_Texture2D_setMipmaps));
    cls->defineFunction("syncMipmapsForJS", _SE(js_assets_Texture2D_syncMipmapsForJS));
    cls->defineFinalizeFunction(_SE(js_cc_Texture2D_finalize));
    cls->install();
    JSBClassType::registerClass<cc::Texture2D>(cls);

    __jsb_cc_Texture2D_proto = cls->getProto();
    __jsb_cc_Texture2D_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_ITextureCubeMipmap_proto = nullptr; // NOLINT
se::Class* __jsb_cc_ITextureCubeMipmap_class = nullptr;  // NOLINT

static bool js_assets_ITextureCubeMipmap_get_front(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeMipmap>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeMipmap_get_front : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->front, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->front, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureCubeMipmap_get_front)

static bool js_assets_ITextureCubeMipmap_set_front(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeMipmap>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeMipmap_set_front : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->front, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureCubeMipmap_set_front : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureCubeMipmap_set_front)

static bool js_assets_ITextureCubeMipmap_get_back(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeMipmap>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeMipmap_get_back : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->back, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->back, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureCubeMipmap_get_back)

static bool js_assets_ITextureCubeMipmap_set_back(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeMipmap>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeMipmap_set_back : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->back, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureCubeMipmap_set_back : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureCubeMipmap_set_back)

static bool js_assets_ITextureCubeMipmap_get_left(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeMipmap>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeMipmap_get_left : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->left, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->left, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureCubeMipmap_get_left)

static bool js_assets_ITextureCubeMipmap_set_left(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeMipmap>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeMipmap_set_left : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->left, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureCubeMipmap_set_left : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureCubeMipmap_set_left)

static bool js_assets_ITextureCubeMipmap_get_right(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeMipmap>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeMipmap_get_right : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->right, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->right, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureCubeMipmap_get_right)

static bool js_assets_ITextureCubeMipmap_set_right(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeMipmap>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeMipmap_set_right : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->right, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureCubeMipmap_set_right : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureCubeMipmap_set_right)

static bool js_assets_ITextureCubeMipmap_get_top(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeMipmap>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeMipmap_get_top : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->top, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->top, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureCubeMipmap_get_top)

static bool js_assets_ITextureCubeMipmap_set_top(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeMipmap>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeMipmap_set_top : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->top, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureCubeMipmap_set_top : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureCubeMipmap_set_top)

static bool js_assets_ITextureCubeMipmap_get_bottom(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeMipmap>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeMipmap_get_bottom : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bottom, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->bottom, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureCubeMipmap_get_bottom)

static bool js_assets_ITextureCubeMipmap_set_bottom(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeMipmap>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeMipmap_set_bottom : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bottom, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureCubeMipmap_set_bottom : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureCubeMipmap_set_bottom)


template<>
bool sevalue_to_native(const se::Value &from, cc::ITextureCubeMipmap * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::ITextureCubeMipmap*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("front", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->front), ctx);
    }
    json->getProperty("back", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->back), ctx);
    }
    json->getProperty("left", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->left), ctx);
    }
    json->getProperty("right", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->right), ctx);
    }
    json->getProperty("top", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->top), ctx);
    }
    json->getProperty("bottom", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bottom), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_ITextureCubeMipmap_finalize)

static bool js_assets_ITextureCubeMipmap_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITextureCubeMipmap);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITextureCubeMipmap);
        auto cobj = ptr->get<cc::ITextureCubeMipmap>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITextureCubeMipmap);
    auto cobj = ptr->get<cc::ITextureCubeMipmap>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->front), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->back), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->left), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->right), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->top), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->bottom), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_ITextureCubeMipmap_constructor, __jsb_cc_ITextureCubeMipmap_class, js_cc_ITextureCubeMipmap_finalize)

static bool js_cc_ITextureCubeMipmap_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_ITextureCubeMipmap_finalize)

bool js_register_assets_ITextureCubeMipmap(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ITextureCubeMipmap", obj, nullptr, _SE(js_assets_ITextureCubeMipmap_constructor));

    cls->defineProperty("front", _SE(js_assets_ITextureCubeMipmap_get_front), _SE(js_assets_ITextureCubeMipmap_set_front));
    cls->defineProperty("back", _SE(js_assets_ITextureCubeMipmap_get_back), _SE(js_assets_ITextureCubeMipmap_set_back));
    cls->defineProperty("left", _SE(js_assets_ITextureCubeMipmap_get_left), _SE(js_assets_ITextureCubeMipmap_set_left));
    cls->defineProperty("right", _SE(js_assets_ITextureCubeMipmap_get_right), _SE(js_assets_ITextureCubeMipmap_set_right));
    cls->defineProperty("top", _SE(js_assets_ITextureCubeMipmap_get_top), _SE(js_assets_ITextureCubeMipmap_set_top));
    cls->defineProperty("bottom", _SE(js_assets_ITextureCubeMipmap_get_bottom), _SE(js_assets_ITextureCubeMipmap_set_bottom));
    cls->defineFinalizeFunction(_SE(js_cc_ITextureCubeMipmap_finalize));
    cls->install();
    JSBClassType::registerClass<cc::ITextureCubeMipmap>(cls);

    __jsb_cc_ITextureCubeMipmap_proto = cls->getProto();
    __jsb_cc_ITextureCubeMipmap_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_ITextureCubeSerializeMipmapData_proto = nullptr; // NOLINT
se::Class* __jsb_cc_ITextureCubeSerializeMipmapData_class = nullptr;  // NOLINT

static bool js_assets_ITextureCubeSerializeMipmapData_get_front(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeSerializeMipmapData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeSerializeMipmapData_get_front : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->front, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->front, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureCubeSerializeMipmapData_get_front)

static bool js_assets_ITextureCubeSerializeMipmapData_set_front(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeSerializeMipmapData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeSerializeMipmapData_set_front : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->front, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureCubeSerializeMipmapData_set_front : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureCubeSerializeMipmapData_set_front)

static bool js_assets_ITextureCubeSerializeMipmapData_get_back(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeSerializeMipmapData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeSerializeMipmapData_get_back : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->back, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->back, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureCubeSerializeMipmapData_get_back)

static bool js_assets_ITextureCubeSerializeMipmapData_set_back(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeSerializeMipmapData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeSerializeMipmapData_set_back : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->back, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureCubeSerializeMipmapData_set_back : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureCubeSerializeMipmapData_set_back)

static bool js_assets_ITextureCubeSerializeMipmapData_get_left(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeSerializeMipmapData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeSerializeMipmapData_get_left : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->left, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->left, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureCubeSerializeMipmapData_get_left)

static bool js_assets_ITextureCubeSerializeMipmapData_set_left(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeSerializeMipmapData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeSerializeMipmapData_set_left : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->left, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureCubeSerializeMipmapData_set_left : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureCubeSerializeMipmapData_set_left)

static bool js_assets_ITextureCubeSerializeMipmapData_get_right(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeSerializeMipmapData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeSerializeMipmapData_get_right : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->right, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->right, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureCubeSerializeMipmapData_get_right)

static bool js_assets_ITextureCubeSerializeMipmapData_set_right(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeSerializeMipmapData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeSerializeMipmapData_set_right : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->right, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureCubeSerializeMipmapData_set_right : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureCubeSerializeMipmapData_set_right)

static bool js_assets_ITextureCubeSerializeMipmapData_get_top(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeSerializeMipmapData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeSerializeMipmapData_get_top : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->top, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->top, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureCubeSerializeMipmapData_get_top)

static bool js_assets_ITextureCubeSerializeMipmapData_set_top(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeSerializeMipmapData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeSerializeMipmapData_set_top : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->top, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureCubeSerializeMipmapData_set_top : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureCubeSerializeMipmapData_set_top)

static bool js_assets_ITextureCubeSerializeMipmapData_get_bottom(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeSerializeMipmapData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeSerializeMipmapData_get_bottom : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bottom, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->bottom, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureCubeSerializeMipmapData_get_bottom)

static bool js_assets_ITextureCubeSerializeMipmapData_set_bottom(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeSerializeMipmapData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeSerializeMipmapData_set_bottom : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bottom, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureCubeSerializeMipmapData_set_bottom : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureCubeSerializeMipmapData_set_bottom)


template<>
bool sevalue_to_native(const se::Value &from, cc::ITextureCubeSerializeMipmapData * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::ITextureCubeSerializeMipmapData*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("front", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->front), ctx);
    }
    json->getProperty("back", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->back), ctx);
    }
    json->getProperty("left", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->left), ctx);
    }
    json->getProperty("right", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->right), ctx);
    }
    json->getProperty("top", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->top), ctx);
    }
    json->getProperty("bottom", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bottom), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_ITextureCubeSerializeMipmapData_finalize)

static bool js_assets_ITextureCubeSerializeMipmapData_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITextureCubeSerializeMipmapData);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITextureCubeSerializeMipmapData);
        auto cobj = ptr->get<cc::ITextureCubeSerializeMipmapData>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITextureCubeSerializeMipmapData);
    auto cobj = ptr->get<cc::ITextureCubeSerializeMipmapData>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->front), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->back), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->left), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->right), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->top), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->bottom), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_ITextureCubeSerializeMipmapData_constructor, __jsb_cc_ITextureCubeSerializeMipmapData_class, js_cc_ITextureCubeSerializeMipmapData_finalize)

static bool js_cc_ITextureCubeSerializeMipmapData_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_ITextureCubeSerializeMipmapData_finalize)

bool js_register_assets_ITextureCubeSerializeMipmapData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ITextureCubeSerializeMipmapData", obj, nullptr, _SE(js_assets_ITextureCubeSerializeMipmapData_constructor));

    cls->defineProperty("front", _SE(js_assets_ITextureCubeSerializeMipmapData_get_front), _SE(js_assets_ITextureCubeSerializeMipmapData_set_front));
    cls->defineProperty("back", _SE(js_assets_ITextureCubeSerializeMipmapData_get_back), _SE(js_assets_ITextureCubeSerializeMipmapData_set_back));
    cls->defineProperty("left", _SE(js_assets_ITextureCubeSerializeMipmapData_get_left), _SE(js_assets_ITextureCubeSerializeMipmapData_set_left));
    cls->defineProperty("right", _SE(js_assets_ITextureCubeSerializeMipmapData_get_right), _SE(js_assets_ITextureCubeSerializeMipmapData_set_right));
    cls->defineProperty("top", _SE(js_assets_ITextureCubeSerializeMipmapData_get_top), _SE(js_assets_ITextureCubeSerializeMipmapData_set_top));
    cls->defineProperty("bottom", _SE(js_assets_ITextureCubeSerializeMipmapData_get_bottom), _SE(js_assets_ITextureCubeSerializeMipmapData_set_bottom));
    cls->defineFinalizeFunction(_SE(js_cc_ITextureCubeSerializeMipmapData_finalize));
    cls->install();
    JSBClassType::registerClass<cc::ITextureCubeSerializeMipmapData>(cls);

    __jsb_cc_ITextureCubeSerializeMipmapData_proto = cls->getProto();
    __jsb_cc_ITextureCubeSerializeMipmapData_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_ITextureCubeSerializeData_proto = nullptr; // NOLINT
se::Class* __jsb_cc_ITextureCubeSerializeData_class = nullptr;  // NOLINT

static bool js_assets_ITextureCubeSerializeData_get_base(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeSerializeData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeSerializeData_get_base : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->base, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->base, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureCubeSerializeData_get_base)

static bool js_assets_ITextureCubeSerializeData_set_base(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeSerializeData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeSerializeData_set_base : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->base, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureCubeSerializeData_set_base : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureCubeSerializeData_set_base)

static bool js_assets_ITextureCubeSerializeData_get_rgbe(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeSerializeData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeSerializeData_get_rgbe : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->rgbe, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->rgbe, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureCubeSerializeData_get_rgbe)

static bool js_assets_ITextureCubeSerializeData_set_rgbe(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeSerializeData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeSerializeData_set_rgbe : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->rgbe, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureCubeSerializeData_set_rgbe : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureCubeSerializeData_set_rgbe)

static bool js_assets_ITextureCubeSerializeData_get_mipmaps(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeSerializeData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeSerializeData_get_mipmaps : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->mipmaps, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->mipmaps, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ITextureCubeSerializeData_get_mipmaps)

static bool js_assets_ITextureCubeSerializeData_set_mipmaps(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::ITextureCubeSerializeData>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ITextureCubeSerializeData_set_mipmaps : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->mipmaps, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ITextureCubeSerializeData_set_mipmaps : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ITextureCubeSerializeData_set_mipmaps)


template<>
bool sevalue_to_native(const se::Value &from, cc::ITextureCubeSerializeData * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::ITextureCubeSerializeData*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("base", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->base), ctx);
    }
    json->getProperty("rgbe", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->rgbe), ctx);
    }
    json->getProperty("mipmaps", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mipmaps), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_ITextureCubeSerializeData_finalize)

static bool js_assets_ITextureCubeSerializeData_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITextureCubeSerializeData);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITextureCubeSerializeData);
        auto cobj = ptr->get<cc::ITextureCubeSerializeData>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::ITextureCubeSerializeData);
    auto cobj = ptr->get<cc::ITextureCubeSerializeData>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->base), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->rgbe), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->mipmaps), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_ITextureCubeSerializeData_constructor, __jsb_cc_ITextureCubeSerializeData_class, js_cc_ITextureCubeSerializeData_finalize)

static bool js_cc_ITextureCubeSerializeData_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_ITextureCubeSerializeData_finalize)

bool js_register_assets_ITextureCubeSerializeData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ITextureCubeSerializeData", obj, nullptr, _SE(js_assets_ITextureCubeSerializeData_constructor));

    cls->defineProperty("base", _SE(js_assets_ITextureCubeSerializeData_get_base), _SE(js_assets_ITextureCubeSerializeData_set_base));
    cls->defineProperty("rgbe", _SE(js_assets_ITextureCubeSerializeData_get_rgbe), _SE(js_assets_ITextureCubeSerializeData_set_rgbe));
    cls->defineProperty("mipmaps", _SE(js_assets_ITextureCubeSerializeData_get_mipmaps), _SE(js_assets_ITextureCubeSerializeData_set_mipmaps));
    cls->defineFinalizeFunction(_SE(js_cc_ITextureCubeSerializeData_finalize));
    cls->install();
    JSBClassType::registerClass<cc::ITextureCubeSerializeData>(cls);

    __jsb_cc_ITextureCubeSerializeData_proto = cls->getProto();
    __jsb_cc_ITextureCubeSerializeData_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_TextureCube_proto = nullptr; // NOLINT
se::Class* __jsb_cc_TextureCube_class = nullptr;  // NOLINT

static bool js_assets_TextureCube_getGfxTextureCreateInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureCube>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureCube_getGfxTextureCreateInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<cc::gfx::TextureUsageBit, false> arg0 = {};
        HolderType<cc::gfx::Format, false> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        HolderType<cc::gfx::TextureFlagBit, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_TextureCube_getGfxTextureCreateInfo : Error processing arguments");
        cc::gfx::TextureInfo result = cobj->getGfxTextureCreateInfo(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_TextureCube_getGfxTextureCreateInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_assets_TextureCube_getGfxTextureCreateInfo)

static bool js_assets_TextureCube_getImage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureCube>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureCube_getImage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::ITextureCubeMipmap* result = cobj->getImage();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_TextureCube_getImage : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_TextureCube_getImage)

static bool js_assets_TextureCube_getMipmaps(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureCube>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureCube_getMipmaps : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::ITextureCubeMipmap>& result = cobj->getMipmaps();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_TextureCube_getMipmaps : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_TextureCube_getMipmaps)

static bool js_assets_TextureCube_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureCube>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureCube_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->initialize();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_TextureCube_initialize)

static bool js_assets_TextureCube_releaseTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureCube>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureCube_releaseTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->releaseTexture();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_TextureCube_releaseTexture)

static bool js_assets_TextureCube_reset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureCube>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureCube_reset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::ITexture2DCreateInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_TextureCube_reset : Error processing arguments");
        cobj->reset(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_TextureCube_reset)

static bool js_assets_TextureCube_setImage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureCube>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureCube_setImage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::ITextureCubeMipmap, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_TextureCube_setImage : Error processing arguments");
        cobj->setImage(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_TextureCube_setImage)

static bool js_assets_TextureCube_setMipmaps(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureCube>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureCube_setMipmaps : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::ITextureCubeMipmap>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_TextureCube_setMipmaps : Error processing arguments");
        cobj->setMipmaps(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_TextureCube_setMipmaps)

static bool js_assets_TextureCube_setMipmapsForJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::TextureCube>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_TextureCube_setMipmapsForJS : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::ITextureCubeMipmap>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_TextureCube_setMipmapsForJS : Error processing arguments");
        cobj->setMipmapsForJS(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_TextureCube_setMipmapsForJS)

static bool js_assets_TextureCube_fromTexture2DArray_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::Texture2D *>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_assets_TextureCube_fromTexture2DArray_static : Error processing arguments");
        cc::TextureCube* result = cc::TextureCube::fromTexture2DArray(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_TextureCube_fromTexture2DArray_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_TextureCube_fromTexture2DArray_static)

SE_DECLARE_FINALIZE_FUNC(js_cc_TextureCube_finalize)

static bool js_assets_TextureCube_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::TextureCube);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_TextureCube_constructor, __jsb_cc_TextureCube_class, js_cc_TextureCube_finalize)

static bool js_cc_TextureCube_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_TextureCube_finalize)

bool js_register_assets_TextureCube(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TextureCube", obj, __jsb_cc_SimpleTexture_proto, _SE(js_assets_TextureCube_constructor));

    cls->defineFunction("getGfxTextureCreateInfo", _SE(js_assets_TextureCube_getGfxTextureCreateInfo));
    cls->defineFunction("getImage", _SE(js_assets_TextureCube_getImage));
    cls->defineFunction("getMipmaps", _SE(js_assets_TextureCube_getMipmaps));
    cls->defineFunction("initialize", _SE(js_assets_TextureCube_initialize));
    cls->defineFunction("releaseTexture", _SE(js_assets_TextureCube_releaseTexture));
    cls->defineFunction("reset", _SE(js_assets_TextureCube_reset));
    cls->defineFunction("setImage", _SE(js_assets_TextureCube_setImage));
    cls->defineFunction("setMipmaps", _SE(js_assets_TextureCube_setMipmaps));
    cls->defineFunction("setMipmapsForJS", _SE(js_assets_TextureCube_setMipmapsForJS));
    cls->defineStaticFunction("fromTexture2DArray", _SE(js_assets_TextureCube_fromTexture2DArray_static));
    cls->defineFinalizeFunction(_SE(js_cc_TextureCube_finalize));
    cls->install();
    JSBClassType::registerClass<cc::TextureCube>(cls);

    __jsb_cc_TextureCube_proto = cls->getProto();
    __jsb_cc_TextureCube_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_BuiltinResMgr_proto = nullptr; // NOLINT
se::Class* __jsb_cc_BuiltinResMgr_class = nullptr;  // NOLINT

static bool js_assets_BuiltinResMgr_getAsset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BuiltinResMgr>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BuiltinResMgr_getAsset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_BuiltinResMgr_getAsset : Error processing arguments");
        cc::Asset* result = cobj->getAsset(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_BuiltinResMgr_getAsset : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_BuiltinResMgr_getAsset)

static bool js_assets_BuiltinResMgr_initBuiltinRes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BuiltinResMgr>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_BuiltinResMgr_initBuiltinRes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Device*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_BuiltinResMgr_initBuiltinRes : Error processing arguments");
        bool result = cobj->initBuiltinRes(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_BuiltinResMgr_initBuiltinRes : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_BuiltinResMgr_initBuiltinRes)

static bool js_assets_BuiltinResMgr_destroyInstance_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cc::BuiltinResMgr::destroyInstance();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_BuiltinResMgr_destroyInstance_static)

static bool js_assets_BuiltinResMgr_getInstance_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::BuiltinResMgr* result = cc::BuiltinResMgr::getInstance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_BuiltinResMgr_getInstance_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_BuiltinResMgr_getInstance_static)
static bool js_cc_BuiltinResMgr_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_BuiltinResMgr_finalize)

bool js_register_assets_BuiltinResMgr(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BuiltinResMgr", obj, nullptr, nullptr);

    cls->defineFunction("getAsset", _SE(js_assets_BuiltinResMgr_getAsset));
    cls->defineFunction("initBuiltinRes", _SE(js_assets_BuiltinResMgr_initBuiltinRes));
    cls->defineStaticFunction("destroyInstance", _SE(js_assets_BuiltinResMgr_destroyInstance_static));
    cls->defineStaticFunction("getInstance", _SE(js_assets_BuiltinResMgr_getInstance_static));
    cls->defineFinalizeFunction(_SE(js_cc_BuiltinResMgr_finalize));
    cls->install();
    JSBClassType::registerClass<cc::BuiltinResMgr>(cls);

    __jsb_cc_BuiltinResMgr_proto = cls->getProto();
    __jsb_cc_BuiltinResMgr_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_MorphRendering_proto = nullptr; // NOLINT
se::Class* __jsb_cc_MorphRendering_class = nullptr;  // NOLINT

static bool js_assets_MorphRendering_createInstance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::MorphRendering>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_MorphRendering_createInstance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::MorphRenderingInstance* result = cobj->createInstance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_MorphRendering_createInstance : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_MorphRendering_createInstance)
static bool js_cc_MorphRendering_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_MorphRendering_finalize)

bool js_register_assets_MorphRendering(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("MorphRendering", obj, nullptr, nullptr);

    cls->defineFunction("createInstance", _SE(js_assets_MorphRendering_createInstance));
    cls->defineFinalizeFunction(_SE(js_cc_MorphRendering_finalize));
    cls->install();
    JSBClassType::registerClass<cc::MorphRendering>(cls);

    __jsb_cc_MorphRendering_proto = cls->getProto();
    __jsb_cc_MorphRendering_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_MorphRenderingInstance_proto = nullptr; // NOLINT
se::Class* __jsb_cc_MorphRenderingInstance_class = nullptr;  // NOLINT

static bool js_assets_MorphRenderingInstance_adaptPipelineState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::MorphRenderingInstance>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_MorphRenderingInstance_adaptPipelineState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<int, false> arg0 = {};
        HolderType<cc::gfx::DescriptorSet*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_MorphRenderingInstance_adaptPipelineState : Error processing arguments");
        cobj->adaptPipelineState(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_assets_MorphRenderingInstance_adaptPipelineState)

static bool js_assets_MorphRenderingInstance_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::MorphRenderingInstance>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_MorphRenderingInstance_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_MorphRenderingInstance_destroy)

static bool js_assets_MorphRenderingInstance_requiredPatches(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::MorphRenderingInstance>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_MorphRenderingInstance_requiredPatches : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_MorphRenderingInstance_requiredPatches : Error processing arguments");
        std::vector<cc::scene::IMacroPatch> result = cobj->requiredPatches(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_MorphRenderingInstance_requiredPatches : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_MorphRenderingInstance_requiredPatches)

static bool js_assets_MorphRenderingInstance_setWeights(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::MorphRenderingInstance>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_MorphRenderingInstance_setWeights : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<int, false> arg0 = {};
        HolderType<std::vector<float>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_MorphRenderingInstance_setWeights : Error processing arguments");
        cobj->setWeights(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_assets_MorphRenderingInstance_setWeights)
static bool js_cc_MorphRenderingInstance_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_MorphRenderingInstance_finalize)

bool js_register_assets_MorphRenderingInstance(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("MorphRenderingInstance", obj, nullptr, nullptr);

    cls->defineFunction("adaptPipelineState", _SE(js_assets_MorphRenderingInstance_adaptPipelineState));
    cls->defineFunction("destroy", _SE(js_assets_MorphRenderingInstance_destroy));
    cls->defineFunction("requiredPatches", _SE(js_assets_MorphRenderingInstance_requiredPatches));
    cls->defineFunction("setWeights", _SE(js_assets_MorphRenderingInstance_setWeights));
    cls->defineFinalizeFunction(_SE(js_cc_MorphRenderingInstance_finalize));
    cls->install();
    JSBClassType::registerClass<cc::MorphRenderingInstance>(cls);

    __jsb_cc_MorphRenderingInstance_proto = cls->getProto();
    __jsb_cc_MorphRenderingInstance_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_StdMorphRendering_proto = nullptr; // NOLINT
se::Class* __jsb_cc_StdMorphRendering_class = nullptr;  // NOLINT

SE_DECLARE_FINALIZE_FUNC(js_cc_StdMorphRendering_finalize)

static bool js_assets_StdMorphRendering_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::Mesh* arg0 = nullptr;
    cc::gfx::Device* arg1 = nullptr;
    ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
    ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_StdMorphRendering_constructor : Error processing arguments");
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::StdMorphRendering, arg0, arg1);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_StdMorphRendering_constructor, __jsb_cc_StdMorphRendering_class, js_cc_StdMorphRendering_finalize)

static bool js_cc_StdMorphRendering_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_StdMorphRendering_finalize)

bool js_register_assets_StdMorphRendering(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("StdMorphRendering", obj, __jsb_cc_MorphRendering_proto, _SE(js_assets_StdMorphRendering_constructor));

    cls->defineFinalizeFunction(_SE(js_cc_StdMorphRendering_finalize));
    cls->install();
    JSBClassType::registerClass<cc::StdMorphRendering>(cls);

    __jsb_cc_StdMorphRendering_proto = cls->getProto();
    __jsb_cc_StdMorphRendering_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_Mesh_IVertexBundle_proto = nullptr; // NOLINT
se::Class* __jsb_cc_Mesh_IVertexBundle_class = nullptr;  // NOLINT

static bool js_assets_IVertexBundle_get__padding(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::IVertexBundle>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IVertexBundle_get__padding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_padding, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_padding, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IVertexBundle_get__padding)

static bool js_assets_IVertexBundle_set__padding(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::IVertexBundle>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IVertexBundle_set__padding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_padding, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IVertexBundle_set__padding : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IVertexBundle_set__padding)

static bool js_assets_IVertexBundle_get_view(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::IVertexBundle>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IVertexBundle_get_view : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->view, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->view, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IVertexBundle_get_view)

static bool js_assets_IVertexBundle_set_view(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::IVertexBundle>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IVertexBundle_set_view : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->view, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IVertexBundle_set_view : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IVertexBundle_set_view)

static bool js_assets_IVertexBundle_get_attributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::IVertexBundle>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IVertexBundle_get_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->attributes, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->attributes, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IVertexBundle_get_attributes)

static bool js_assets_IVertexBundle_set_attributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::IVertexBundle>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IVertexBundle_set_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->attributes, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IVertexBundle_set_attributes : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IVertexBundle_set_attributes)


template<>
bool sevalue_to_native(const se::Value &from, cc::Mesh::IVertexBundle * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::Mesh::IVertexBundle*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("_padding", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->_padding), ctx);
    }
    json->getProperty("view", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->view), ctx);
    }
    json->getProperty("attributes", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->attributes), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_Mesh_IVertexBundle_finalize)

static bool js_assets_IVertexBundle_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Mesh::IVertexBundle);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Mesh::IVertexBundle);
        auto cobj = ptr->get<cc::Mesh::IVertexBundle>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Mesh::IVertexBundle);
    auto cobj = ptr->get<cc::Mesh::IVertexBundle>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->_padding), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->view), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->attributes), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IVertexBundle_constructor, __jsb_cc_Mesh_IVertexBundle_class, js_cc_Mesh_IVertexBundle_finalize)

static bool js_cc_Mesh_IVertexBundle_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_Mesh_IVertexBundle_finalize)

bool js_register_assets_Mesh_IVertexBundle(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create({"Mesh","IVertexBundle"}, obj, nullptr, _SE(js_assets_IVertexBundle_constructor));

    cls->defineProperty("_padding", _SE(js_assets_IVertexBundle_get__padding), _SE(js_assets_IVertexBundle_set__padding));
    cls->defineProperty("view", _SE(js_assets_IVertexBundle_get_view), _SE(js_assets_IVertexBundle_set_view));
    cls->defineProperty("attributes", _SE(js_assets_IVertexBundle_get_attributes), _SE(js_assets_IVertexBundle_set_attributes));
    cls->defineFinalizeFunction(_SE(js_cc_Mesh_IVertexBundle_finalize));
    cls->install();
    JSBClassType::registerClass<cc::Mesh::IVertexBundle>(cls);

    __jsb_cc_Mesh_IVertexBundle_proto = cls->getProto();
    __jsb_cc_Mesh_IVertexBundle_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_Mesh_ISubMesh_proto = nullptr; // NOLINT
se::Class* __jsb_cc_Mesh_ISubMesh_class = nullptr;  // NOLINT

static bool js_assets_ISubMesh_get_vertexBundelIndices(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::ISubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISubMesh_get_vertexBundelIndices : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->vertexBundelIndices, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->vertexBundelIndices, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ISubMesh_get_vertexBundelIndices)

static bool js_assets_ISubMesh_set_vertexBundelIndices(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::ISubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISubMesh_set_vertexBundelIndices : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->vertexBundelIndices, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ISubMesh_set_vertexBundelIndices : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ISubMesh_set_vertexBundelIndices)

static bool js_assets_ISubMesh_get_primitiveMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::ISubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISubMesh_get_primitiveMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->primitiveMode, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->primitiveMode, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ISubMesh_get_primitiveMode)

static bool js_assets_ISubMesh_set_primitiveMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::ISubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISubMesh_set_primitiveMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->primitiveMode, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ISubMesh_set_primitiveMode : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ISubMesh_set_primitiveMode)

static bool js_assets_ISubMesh_get_indexView(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::ISubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISubMesh_get_indexView : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->indexView, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->indexView, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ISubMesh_get_indexView)

static bool js_assets_ISubMesh_set_indexView(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::ISubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISubMesh_set_indexView : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->indexView, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ISubMesh_set_indexView : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ISubMesh_set_indexView)

static bool js_assets_ISubMesh_get_jointMapIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::ISubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISubMesh_get_jointMapIndex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->jointMapIndex, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->jointMapIndex, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ISubMesh_get_jointMapIndex)

static bool js_assets_ISubMesh_set_jointMapIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::ISubMesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ISubMesh_set_jointMapIndex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->jointMapIndex, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ISubMesh_set_jointMapIndex : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ISubMesh_set_jointMapIndex)


template<>
bool sevalue_to_native(const se::Value &from, cc::Mesh::ISubMesh * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::Mesh::ISubMesh*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("vertexBundelIndices", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->vertexBundelIndices), ctx);
    }
    json->getProperty("primitiveMode", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->primitiveMode), ctx);
    }
    json->getProperty("indexView", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->indexView), ctx);
    }
    json->getProperty("jointMapIndex", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->jointMapIndex), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_Mesh_ISubMesh_finalize)

static bool js_assets_ISubMesh_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Mesh::ISubMesh);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Mesh::ISubMesh);
        auto cobj = ptr->get<cc::Mesh::ISubMesh>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Mesh::ISubMesh);
    auto cobj = ptr->get<cc::Mesh::ISubMesh>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->vertexBundelIndices), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->primitiveMode), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->indexView), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->jointMapIndex), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_ISubMesh_constructor, __jsb_cc_Mesh_ISubMesh_class, js_cc_Mesh_ISubMesh_finalize)

static bool js_cc_Mesh_ISubMesh_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_Mesh_ISubMesh_finalize)

bool js_register_assets_Mesh_ISubMesh(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create({"Mesh","ISubMesh"}, obj, nullptr, _SE(js_assets_ISubMesh_constructor));

    cls->defineProperty("vertexBundelIndices", _SE(js_assets_ISubMesh_get_vertexBundelIndices), _SE(js_assets_ISubMesh_set_vertexBundelIndices));
    cls->defineProperty("primitiveMode", _SE(js_assets_ISubMesh_get_primitiveMode), _SE(js_assets_ISubMesh_set_primitiveMode));
    cls->defineProperty("indexView", _SE(js_assets_ISubMesh_get_indexView), _SE(js_assets_ISubMesh_set_indexView));
    cls->defineProperty("jointMapIndex", _SE(js_assets_ISubMesh_get_jointMapIndex), _SE(js_assets_ISubMesh_set_jointMapIndex));
    cls->defineFinalizeFunction(_SE(js_cc_Mesh_ISubMesh_finalize));
    cls->install();
    JSBClassType::registerClass<cc::Mesh::ISubMesh>(cls);

    __jsb_cc_Mesh_ISubMesh_proto = cls->getProto();
    __jsb_cc_Mesh_ISubMesh_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_Mesh_IStruct_proto = nullptr; // NOLINT
se::Class* __jsb_cc_Mesh_IStruct_class = nullptr;  // NOLINT

static bool js_assets_IStruct_get_vertexBundles(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::IStruct>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IStruct_get_vertexBundles : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->vertexBundles, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->vertexBundles, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IStruct_get_vertexBundles)

static bool js_assets_IStruct_set_vertexBundles(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::IStruct>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IStruct_set_vertexBundles : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->vertexBundles, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IStruct_set_vertexBundles : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IStruct_set_vertexBundles)

static bool js_assets_IStruct_get_primitives(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::IStruct>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IStruct_get_primitives : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->primitives, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->primitives, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IStruct_get_primitives)

static bool js_assets_IStruct_set_primitives(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::IStruct>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IStruct_set_primitives : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->primitives, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IStruct_set_primitives : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IStruct_set_primitives)

static bool js_assets_IStruct_get_minPosition(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::IStruct>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IStruct_get_minPosition : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->minPosition, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->minPosition, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IStruct_get_minPosition)

static bool js_assets_IStruct_set_minPosition(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::IStruct>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IStruct_set_minPosition : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->minPosition, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IStruct_set_minPosition : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IStruct_set_minPosition)

static bool js_assets_IStruct_get_maxPosition(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::IStruct>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IStruct_get_maxPosition : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxPosition, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxPosition, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IStruct_get_maxPosition)

static bool js_assets_IStruct_set_maxPosition(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::IStruct>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IStruct_set_maxPosition : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxPosition, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IStruct_set_maxPosition : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IStruct_set_maxPosition)

static bool js_assets_IStruct_get_jointMaps(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::IStruct>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IStruct_get_jointMaps : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->jointMaps, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->jointMaps, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IStruct_get_jointMaps)

static bool js_assets_IStruct_set_jointMaps(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::IStruct>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IStruct_set_jointMaps : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->jointMaps, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IStruct_set_jointMaps : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IStruct_set_jointMaps)

static bool js_assets_IStruct_get_morph(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::IStruct>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IStruct_get_morph : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->morph, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->morph, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_IStruct_get_morph)

static bool js_assets_IStruct_set_morph(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::IStruct>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_IStruct_set_morph : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->morph, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_IStruct_set_morph : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_IStruct_set_morph)


template<>
bool sevalue_to_native(const se::Value &from, cc::Mesh::IStruct * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::Mesh::IStruct*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("vertexBundles", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->vertexBundles), ctx);
    }
    json->getProperty("primitives", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->primitives), ctx);
    }
    json->getProperty("minPosition", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->minPosition), ctx);
    }
    json->getProperty("maxPosition", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxPosition), ctx);
    }
    json->getProperty("jointMaps", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->jointMaps), ctx);
    }
    json->getProperty("morph", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->morph), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_Mesh_IStruct_finalize)

static bool js_assets_IStruct_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Mesh::IStruct);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Mesh::IStruct);
        auto cobj = ptr->get<cc::Mesh::IStruct>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Mesh::IStruct);
    auto cobj = ptr->get<cc::Mesh::IStruct>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->vertexBundles), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->primitives), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->minPosition), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->maxPosition), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->jointMaps), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->morph), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_IStruct_constructor, __jsb_cc_Mesh_IStruct_class, js_cc_Mesh_IStruct_finalize)

static bool js_cc_Mesh_IStruct_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_Mesh_IStruct_finalize)

bool js_register_assets_Mesh_IStruct(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create({"Mesh","IStruct"}, obj, nullptr, _SE(js_assets_IStruct_constructor));

    cls->defineProperty("vertexBundles", _SE(js_assets_IStruct_get_vertexBundles), _SE(js_assets_IStruct_set_vertexBundles));
    cls->defineProperty("primitives", _SE(js_assets_IStruct_get_primitives), _SE(js_assets_IStruct_set_primitives));
    cls->defineProperty("minPosition", _SE(js_assets_IStruct_get_minPosition), _SE(js_assets_IStruct_set_minPosition));
    cls->defineProperty("maxPosition", _SE(js_assets_IStruct_get_maxPosition), _SE(js_assets_IStruct_set_maxPosition));
    cls->defineProperty("jointMaps", _SE(js_assets_IStruct_get_jointMaps), _SE(js_assets_IStruct_set_jointMaps));
    cls->defineProperty("morph", _SE(js_assets_IStruct_get_morph), _SE(js_assets_IStruct_set_morph));
    cls->defineFinalizeFunction(_SE(js_cc_Mesh_IStruct_finalize));
    cls->install();
    JSBClassType::registerClass<cc::Mesh::IStruct>(cls);

    __jsb_cc_Mesh_IStruct_proto = cls->getProto();
    __jsb_cc_Mesh_IStruct_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_Mesh_ICreateInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_Mesh_ICreateInfo_class = nullptr;  // NOLINT

static bool js_assets_ICreateInfo_get_structInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::ICreateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ICreateInfo_get_structInfo : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->structInfo, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->structInfo, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ICreateInfo_get_structInfo)

static bool js_assets_ICreateInfo_set_structInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::ICreateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ICreateInfo_set_structInfo : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->structInfo, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ICreateInfo_set_structInfo : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ICreateInfo_set_structInfo)

static bool js_assets_ICreateInfo_get_data(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::ICreateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ICreateInfo_get_data : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->data, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->data, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_ICreateInfo_get_data)

static bool js_assets_ICreateInfo_set_data(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Mesh::ICreateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_ICreateInfo_set_data : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->data, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_ICreateInfo_set_data : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_ICreateInfo_set_data)


template<>
bool sevalue_to_native(const se::Value &from, cc::Mesh::ICreateInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::Mesh::ICreateInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("struct", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->structInfo), ctx);
    }
    json->getProperty("data", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->data), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_Mesh_ICreateInfo_finalize)

static bool js_assets_ICreateInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Mesh::ICreateInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Mesh::ICreateInfo);
        auto cobj = ptr->get<cc::Mesh::ICreateInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Mesh::ICreateInfo);
    auto cobj = ptr->get<cc::Mesh::ICreateInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->structInfo), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->data), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_ICreateInfo_constructor, __jsb_cc_Mesh_ICreateInfo_class, js_cc_Mesh_ICreateInfo_finalize)

static bool js_cc_Mesh_ICreateInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_Mesh_ICreateInfo_finalize)

bool js_register_assets_Mesh_ICreateInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create({"Mesh","ICreateInfo"}, obj, nullptr, _SE(js_assets_ICreateInfo_constructor));

    cls->defineProperty("struct", _SE(js_assets_ICreateInfo_get_structInfo), _SE(js_assets_ICreateInfo_set_structInfo));
    cls->defineProperty("data", _SE(js_assets_ICreateInfo_get_data), _SE(js_assets_ICreateInfo_set_data));
    cls->defineFinalizeFunction(_SE(js_cc_Mesh_ICreateInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::Mesh::ICreateInfo>(cls);

    __jsb_cc_Mesh_ICreateInfo_proto = cls->getProto();
    __jsb_cc_Mesh_ICreateInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_Mesh_proto = nullptr; // NOLINT
se::Class* __jsb_cc_Mesh_class = nullptr;  // NOLINT

static bool js_assets_Mesh_assign(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_assign : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::Mesh::IStruct, true> arg0 = {};
        HolderType<cc::TypedArrayTemp<unsigned char>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_assign : Error processing arguments");
        cobj->assign(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_assets_Mesh_assign)

static bool js_assets_Mesh_copyAttribute(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_copyAttribute : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        HolderType<int, false> arg0 = {};
        HolderType<const char*, false> arg1 = {};
        HolderType<cc::ArrayBuffer*, false> arg2 = {};
        HolderType<unsigned int, false> arg3 = {};
        HolderType<unsigned int, false> arg4 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_copyAttribute : Error processing arguments");
        bool result = cobj->copyAttribute(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_copyAttribute : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_assets_Mesh_copyAttribute)

static bool js_assets_Mesh_copyIndices(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_copyIndices : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<int, false> arg0 = {};
        HolderType<boost::variant2::variant<boost::variant2::monostate, cc::TypedArrayTemp<signed char>, cc::TypedArrayTemp<short>, cc::TypedArrayTemp<int>, cc::TypedArrayTemp<unsigned char>, cc::TypedArrayTemp<unsigned short>, cc::TypedArrayTemp<unsigned int>, cc::TypedArrayTemp<float>, cc::TypedArrayTemp<double>>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_copyIndices : Error processing arguments");
        bool result = cobj->copyIndices(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_copyIndices : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_assets_Mesh_copyIndices)

static bool js_assets_Mesh_destroyRenderingMesh(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_destroyRenderingMesh : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroyRenderingMesh();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_Mesh_destroyRenderingMesh)

static bool js_assets_Mesh_getAssetData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_getAssetData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::TypedArrayTemp<unsigned char>& result = cobj->getAssetData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_getAssetData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_Mesh_getAssetData)

static bool js_assets_Mesh_getBoneSpaceBounds(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_getBoneSpaceBounds : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Skeleton*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_getBoneSpaceBounds : Error processing arguments");
        std::vector<cc::IntrusivePtr<cc::geometry::AABB>> result = cobj->getBoneSpaceBounds(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_getBoneSpaceBounds : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_Mesh_getBoneSpaceBounds)

static bool js_assets_Mesh_getData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_getData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::TypedArrayTemp<unsigned char>& result = cobj->getData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_getData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_Mesh_getData)

static bool js_assets_Mesh_getHashForJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_getHashForJS : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        double result = cobj->getHashForJS();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_getHashForJS : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_Mesh_getHashForJS)

static bool js_assets_Mesh_getJointBufferIndices(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_getJointBufferIndices : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<int>& result = cobj->getJointBufferIndices();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_getJointBufferIndices : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_Mesh_getJointBufferIndices)

static bool js_assets_Mesh_getMaxPosition(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_getMaxPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec3& result = cobj->getMaxPosition();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_getMaxPosition : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_Mesh_getMaxPosition)

static bool js_assets_Mesh_getMinPosition(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_getMinPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec3& result = cobj->getMinPosition();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_getMinPosition : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_Mesh_getMinPosition)

static bool js_assets_Mesh_getRenderingSubMeshes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_getRenderingSubMeshes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::IntrusivePtr<cc::RenderingSubMesh>>& result = cobj->getRenderingSubMeshes();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_getRenderingSubMeshes : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_Mesh_getRenderingSubMeshes)

static bool js_assets_Mesh_getStruct(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_getStruct : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Mesh::IStruct& result = cobj->getStruct();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_getStruct : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_Mesh_getStruct)

static bool js_assets_Mesh_getSubMeshCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_getSubMeshCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getSubMeshCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_getSubMeshCount : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_Mesh_getSubMeshCount)

static bool js_assets_Mesh_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->initialize();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_Mesh_initialize)

static bool js_assets_Mesh_merge(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_merge : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Mesh*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_merge : Error processing arguments");
        bool result = cobj->merge(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_merge : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 2) {
        HolderType<cc::Mesh*, false> arg0 = {};
        HolderType<const cc::Mat4*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_merge : Error processing arguments");
        bool result = cobj->merge(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_merge : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 3) {
        HolderType<cc::Mesh*, false> arg0 = {};
        HolderType<const cc::Mat4*, false> arg1 = {};
        HolderType<bool, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_merge : Error processing arguments");
        bool result = cobj->merge(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_merge : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_assets_Mesh_merge)

static bool js_assets_Mesh_readAttribute(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_readAttribute : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<int, false> arg0 = {};
        HolderType<const char*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_readAttribute : Error processing arguments");
        boost::variant2::variant<boost::variant2::monostate, cc::TypedArrayTemp<signed char>, cc::TypedArrayTemp<short>, cc::TypedArrayTemp<int>, cc::TypedArrayTemp<unsigned char>, cc::TypedArrayTemp<unsigned short>, cc::TypedArrayTemp<unsigned int>, cc::TypedArrayTemp<float>, cc::TypedArrayTemp<double>> result = cobj->readAttribute(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_readAttribute : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_assets_Mesh_readAttribute)

static bool js_assets_Mesh_readIndices(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_readIndices : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_readIndices : Error processing arguments");
        boost::variant2::variant<cc::TypedArrayTemp<unsigned char>, cc::TypedArrayTemp<unsigned short>, cc::TypedArrayTemp<unsigned int>> result = cobj->readIndices(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_readIndices : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_Mesh_readIndices)

static bool js_assets_Mesh_reset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_reset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Mesh::ICreateInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_reset : Error processing arguments");
        cobj->reset(std::move(arg0.value()));
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_Mesh_reset)

static bool js_assets_Mesh_setAssetData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_setAssetData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::ArrayBuffer*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_setAssetData : Error processing arguments");
        cobj->setAssetData(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_assets_Mesh_setAssetData)

static bool js_assets_Mesh_setData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_setData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::TypedArrayTemp<unsigned char>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_setData : Error processing arguments");
        cobj->setData(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_assets_Mesh_setData)

static bool js_assets_Mesh_setHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_setHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<uint64_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_setHash : Error processing arguments");
        cobj->setHash(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_assets_Mesh_setHash)

static bool js_assets_Mesh_setStruct(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_setStruct : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Mesh::IStruct, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_setStruct : Error processing arguments");
        cobj->setStruct(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_Mesh_setStruct)

static bool js_assets_Mesh_validateMergingMesh(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_validateMergingMesh : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Mesh*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_validateMergingMesh : Error processing arguments");
        bool result = cobj->validateMergingMesh(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Mesh_validateMergingMesh : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_Mesh_validateMergingMesh)

static bool js_assets_Mesh_get_morphRendering(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_get_morphRendering : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->morphRendering, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->morphRendering, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_assets_Mesh_get_morphRendering)

static bool js_assets_Mesh_set_morphRendering(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Mesh>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Mesh_set_morphRendering : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->morphRendering, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_assets_Mesh_set_morphRendering : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_assets_Mesh_set_morphRendering)

SE_DECLARE_FINALIZE_FUNC(js_cc_Mesh_finalize)

static bool js_assets_Mesh_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Mesh);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_Mesh_constructor, __jsb_cc_Mesh_class, js_cc_Mesh_finalize)

static bool js_cc_Mesh_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_Mesh_finalize)

bool js_register_assets_Mesh(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Mesh", obj, __jsb_cc_Asset_proto, _SE(js_assets_Mesh_constructor));

    cls->defineProperty("morphRendering", _SE(js_assets_Mesh_get_morphRendering), _SE(js_assets_Mesh_set_morphRendering));
    cls->defineProperty("subMeshCount", _SE(js_assets_Mesh_getSubMeshCount_asGetter), nullptr);
    cls->defineProperty("maxPosition", _SE(js_assets_Mesh_getMaxPosition_asGetter), nullptr);
    cls->defineProperty("renderingSubMeshes", _SE(js_assets_Mesh_getRenderingSubMeshes_asGetter), nullptr);
    cls->defineProperty("_nativeAsset", _SE(js_assets_Mesh_getAssetData_asGetter), _SE(js_assets_Mesh_setAssetData_asSetter));
    cls->defineProperty({"_hash", "hash"}, _SE(js_assets_Mesh_getHashForJS_asGetter), _SE(js_assets_Mesh_setHash_asSetter));
    cls->defineProperty("jointBufferIndices", _SE(js_assets_Mesh_getJointBufferIndices_asGetter), nullptr);
    cls->defineProperty({"data", "_data"}, _SE(js_assets_Mesh_getData_asGetter), _SE(js_assets_Mesh_setData_asSetter));
    cls->defineProperty("minPosition", _SE(js_assets_Mesh_getMinPosition_asGetter), nullptr);
    cls->defineFunction("assign", _SE(js_assets_Mesh_assign));
    cls->defineFunction("copyAttribute", _SE(js_assets_Mesh_copyAttribute));
    cls->defineFunction("copyIndices", _SE(js_assets_Mesh_copyIndices));
    cls->defineFunction("destroyRenderingMesh", _SE(js_assets_Mesh_destroyRenderingMesh));
    cls->defineFunction("getBoneSpaceBounds", _SE(js_assets_Mesh_getBoneSpaceBounds));
    cls->defineFunction("getStruct", _SE(js_assets_Mesh_getStruct));
    cls->defineFunction("initialize", _SE(js_assets_Mesh_initialize));
    cls->defineFunction("merge", _SE(js_assets_Mesh_merge));
    cls->defineFunction("readAttribute", _SE(js_assets_Mesh_readAttribute));
    cls->defineFunction("readIndices", _SE(js_assets_Mesh_readIndices));
    cls->defineFunction("reset", _SE(js_assets_Mesh_reset));
    cls->defineFunction("setStruct", _SE(js_assets_Mesh_setStruct));
    cls->defineFunction("validateMergingMesh", _SE(js_assets_Mesh_validateMergingMesh));
    cls->defineFinalizeFunction(_SE(js_cc_Mesh_finalize));
    cls->install();
    JSBClassType::registerClass<cc::Mesh>(cls);

    __jsb_cc_Mesh_proto = cls->getProto();
    __jsb_cc_Mesh_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_Skeleton_proto = nullptr; // NOLINT
se::Class* __jsb_cc_Skeleton_class = nullptr;  // NOLINT

static bool js_assets_Skeleton_getBindposes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Skeleton_getBindposes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::Mat4>& result = cobj->getBindposes();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Skeleton_getBindposes : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_Skeleton_getBindposes)

static bool js_assets_Skeleton_getHashForJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Skeleton_getHashForJS : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        double result = cobj->getHashForJS();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Skeleton_getHashForJS : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_Skeleton_getHashForJS)
SE_BIND_FUNC(js_assets_Skeleton_getHashForJS)

static bool js_assets_Skeleton_getInverseBindposes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Skeleton_getInverseBindposes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::Mat4>& result = cobj->getInverseBindposes();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Skeleton_getInverseBindposes : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_Skeleton_getInverseBindposes)

static bool js_assets_Skeleton_getJoints(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Skeleton_getJoints : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<std::string>& result = cobj->getJoints();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_assets_Skeleton_getJoints : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_assets_Skeleton_getJoints)
SE_BIND_FUNC(js_assets_Skeleton_getJoints)

static bool js_assets_Skeleton_setBindposes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Skeleton_setBindposes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::Mat4>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Skeleton_setBindposes : Error processing arguments");
        cobj->setBindposes(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_assets_Skeleton_setBindposes)

static bool js_assets_Skeleton_setHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Skeleton_setHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<uint64_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Skeleton_setHash : Error processing arguments");
        cobj->setHash(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_assets_Skeleton_setHash)
SE_BIND_FUNC(js_assets_Skeleton_setHash)

static bool js_assets_Skeleton_setJoints(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_Skeleton_setJoints : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<std::string>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_assets_Skeleton_setJoints : Error processing arguments");
        cobj->setJoints(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_assets_Skeleton_setJoints)
SE_BIND_FUNC(js_assets_Skeleton_setJoints)

SE_DECLARE_FINALIZE_FUNC(js_cc_Skeleton_finalize)

static bool js_assets_Skeleton_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Skeleton);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_assets_Skeleton_constructor, __jsb_cc_Skeleton_class, js_cc_Skeleton_finalize)

static bool js_cc_Skeleton_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_Skeleton_finalize)

bool js_register_assets_Skeleton(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Skeleton", obj, __jsb_cc_Asset_proto, _SE(js_assets_Skeleton_constructor));

    cls->defineProperty({"_joints", "joints"}, _SE(js_assets_Skeleton_getJoints_asGetter), _SE(js_assets_Skeleton_setJoints_asSetter));
    cls->defineProperty({"_hash", "hash"}, _SE(js_assets_Skeleton_getHashForJS_asGetter), _SE(js_assets_Skeleton_setHash_asSetter));
    cls->defineFunction("_getBindposes", _SE(js_assets_Skeleton_getBindposes));
    cls->defineFunction("getHash", _SE(js_assets_Skeleton_getHashForJS));
    cls->defineFunction("getInverseBindposes", _SE(js_assets_Skeleton_getInverseBindposes));
    cls->defineFunction("getJoints", _SE(js_assets_Skeleton_getJoints));
    cls->defineFunction("_setBindposes", _SE(js_assets_Skeleton_setBindposes));
    cls->defineFunction("setHash", _SE(js_assets_Skeleton_setHash));
    cls->defineFunction("setJoints", _SE(js_assets_Skeleton_setJoints));
    cls->defineFinalizeFunction(_SE(js_cc_Skeleton_finalize));
    cls->install();
    JSBClassType::registerClass<cc::Skeleton>(cls);

    __jsb_cc_Skeleton_proto = cls->getProto();
    __jsb_cc_Skeleton_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
bool register_all_assets(se::Object* obj)    // NOLINT
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("jsb", &nsVal, true))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("jsb", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_assets_Asset(ns);
    js_register_assets_BlendStateInfo(ns);
    js_register_assets_BlendTargetInfo(ns);
    js_register_assets_BoundingBox(ns);
    js_register_assets_BufferAsset(ns);
    js_register_assets_BuiltinResMgr(ns);
    js_register_assets_DepthStencilStateInfo(ns);
    js_register_assets_EffectAsset(ns);
    js_register_assets_Error(ns);
    js_register_assets_IAttributeInfo(ns);
    js_register_assets_IBlockInfo(ns);
    js_register_assets_IBufferInfo(ns);
    js_register_assets_IBuiltin(ns);
    js_register_assets_IBuiltinInfo(ns);
    js_register_assets_IBuiltins(ns);
    js_register_assets_Mesh(ns);
    js_register_assets_Mesh_ICreateInfo(ns);
    js_register_assets_IDefineInfo(ns);
    js_register_assets_IFlatBuffer(ns);
    js_register_assets_IGeometricInfo(ns);
    js_register_assets_IImageInfo(ns);
    js_register_assets_IInputAttachmentInfo(ns);
    js_register_assets_IMaterialInfo(ns);
    js_register_assets_IMemoryImageSource(ns);
    js_register_assets_IMeshBufferView(ns);
    js_register_assets_IPassInfoFull(ns);
    js_register_assets_IPassStates(ns);
    js_register_assets_IPropertyInfo(ns);
    js_register_assets_IRenderTextureCreateInfo(ns);
    js_register_assets_ISamplerInfo(ns);
    js_register_assets_ISamplerTextureInfo(ns);
    js_register_assets_IShaderInfo(ns);
    js_register_assets_IShaderSource(ns);
    js_register_assets_Mesh_IStruct(ns);
    js_register_assets_Mesh_ISubMesh(ns);
    js_register_assets_ITechniqueInfo(ns);
    js_register_assets_ITexture2DCreateInfo(ns);
    js_register_assets_ITexture2DSerializeData(ns);
    js_register_assets_ITextureCubeMipmap(ns);
    js_register_assets_ITextureCubeSerializeData(ns);
    js_register_assets_ITextureCubeSerializeMipmapData(ns);
    js_register_assets_ITextureInfo(ns);
    js_register_assets_Mesh_IVertexBundle(ns);
    js_register_assets_ImageAsset(ns);
    js_register_assets_Material(ns);
    js_register_assets_Morph(ns);
    js_register_assets_MorphRendering(ns);
    js_register_assets_MorphRenderingInstance(ns);
    js_register_assets_MorphTarget(ns);
    js_register_assets_RasterizerStateInfo(ns);
    js_register_assets_TextureBase(ns);
    js_register_assets_RenderTexture(ns);
    js_register_assets_RenderingSubMesh(ns);
    js_register_assets_SceneAsset(ns);
    js_register_assets_SimpleTexture(ns);
    js_register_assets_Skeleton(ns);
    js_register_assets_StdMorphRendering(ns);
    js_register_assets_SubMeshMorph(ns);
    js_register_assets_TextAsset(ns);
    js_register_assets_Texture2D(ns);
    js_register_assets_TextureCube(ns);
    js_register_assets_VertexIdChannel(ns);
    return true;
}

// clang-format on
