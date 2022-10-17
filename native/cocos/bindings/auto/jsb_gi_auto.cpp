
// clang-format off
#include "cocos/bindings/auto/jsb_gi_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "gi/light-probe/LightProbe.h"
#include "gi/light-probe/Delaunay.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif

#if CC_DEBUG
static bool js_gi_getter_return_true(se::State& s) // NOLINT(readability-identifier-naming)
{
    s.rval().setBoolean(true);
    return true;
}
SE_BIND_PROP_GET(js_gi_getter_return_true)
#endif
se::Object* __jsb_cc_gi_Vertex_proto = nullptr; // NOLINT
se::Class* __jsb_cc_gi_Vertex_class = nullptr;  // NOLINT

static bool js_gi_Vertex_get_position(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::Vertex>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->position, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->position, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_Vertex_get_position)

static bool js_gi_Vertex_set_position(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::Vertex>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->position, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_Vertex_set_position)

static bool js_gi_Vertex_get_normal(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::Vertex>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->normal, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->normal, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_Vertex_get_normal)

static bool js_gi_Vertex_set_normal(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::Vertex>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->normal, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_Vertex_set_normal)

static bool js_gi_Vertex_get_coefficients(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::Vertex>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->coefficients, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->coefficients, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_Vertex_get_coefficients)

static bool js_gi_Vertex_set_coefficients(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::Vertex>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->coefficients, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_Vertex_set_coefficients)


template<>
bool sevalue_to_native(const se::Value &from, cc::gi::Vertex * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gi::Vertex*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("position", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->position), ctx);
    }
    json->getProperty("normal", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->normal), ctx);
    }
    json->getProperty("coefficients", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->coefficients), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gi_Vertex_finalize)

static bool js_gi_Vertex_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::gi::Vertex);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::gi::Vertex);
        auto cobj = ptr->get<cc::gi::Vertex>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::gi::Vertex);
    auto cobj = ptr->get<cc::gi::Vertex>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->position), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->normal), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->coefficients), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_gi_Vertex_constructor, __jsb_cc_gi_Vertex_class, js_cc_gi_Vertex_finalize)

static bool js_cc_gi_Vertex_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gi_Vertex_finalize)

bool js_register_gi_Vertex(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Vertex", obj, nullptr, _SE(js_gi_Vertex_constructor));

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_gi_getter_return_true), nullptr);
#endif
    cls->defineProperty("position", _SE(js_gi_Vertex_get_position), _SE(js_gi_Vertex_set_position));
    cls->defineProperty("normal", _SE(js_gi_Vertex_get_normal), _SE(js_gi_Vertex_set_normal));
    cls->defineProperty("coefficients", _SE(js_gi_Vertex_get_coefficients), _SE(js_gi_Vertex_set_coefficients));
    cls->defineFinalizeFunction(_SE(js_cc_gi_Vertex_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gi::Vertex>(cls);

    __jsb_cc_gi_Vertex_proto = cls->getProto();
    __jsb_cc_gi_Vertex_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gi_CircumSphere_proto = nullptr; // NOLINT
se::Class* __jsb_cc_gi_CircumSphere_class = nullptr;  // NOLINT

static bool js_gi_CircumSphere_init(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::CircumSphere>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<cc::Vec3, true> arg0 = {};
        HolderType<cc::Vec3, true> arg1 = {};
        HolderType<cc::Vec3, true> arg2 = {};
        HolderType<cc::Vec3, true> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->init(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_gi_CircumSphere_init)

static bool js_gi_CircumSphere_get_center(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::CircumSphere>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->center, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->center, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_CircumSphere_get_center)

static bool js_gi_CircumSphere_set_center(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::CircumSphere>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->center, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_CircumSphere_set_center)

static bool js_gi_CircumSphere_get_radiusSquared(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::CircumSphere>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->radiusSquared, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->radiusSquared, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_CircumSphere_get_radiusSquared)

static bool js_gi_CircumSphere_set_radiusSquared(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::CircumSphere>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->radiusSquared, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_CircumSphere_set_radiusSquared)


template<>
bool sevalue_to_native(const se::Value &from, cc::gi::CircumSphere * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gi::CircumSphere*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("center", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->center), ctx);
    }
    json->getProperty("radiusSquared", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->radiusSquared), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gi_CircumSphere_finalize)

static bool js_gi_CircumSphere_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::gi::CircumSphere);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::gi::CircumSphere);
        auto cobj = ptr->get<cc::gi::CircumSphere>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::gi::CircumSphere);
    auto cobj = ptr->get<cc::gi::CircumSphere>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->center), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->radiusSquared), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_gi_CircumSphere_constructor, __jsb_cc_gi_CircumSphere_class, js_cc_gi_CircumSphere_finalize)

static bool js_cc_gi_CircumSphere_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gi_CircumSphere_finalize)

bool js_register_gi_CircumSphere(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("CircumSphere", obj, nullptr, _SE(js_gi_CircumSphere_constructor));

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_gi_getter_return_true), nullptr);
#endif
    cls->defineProperty("center", _SE(js_gi_CircumSphere_get_center), _SE(js_gi_CircumSphere_set_center));
    cls->defineProperty("radiusSquared", _SE(js_gi_CircumSphere_get_radiusSquared), _SE(js_gi_CircumSphere_set_radiusSquared));
    cls->defineFunction("init", _SE(js_gi_CircumSphere_init));
    cls->defineFinalizeFunction(_SE(js_cc_gi_CircumSphere_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gi::CircumSphere>(cls);

    __jsb_cc_gi_CircumSphere_proto = cls->getProto();
    __jsb_cc_gi_CircumSphere_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gi_Tetrahedron_proto = nullptr; // NOLINT
se::Class* __jsb_cc_gi_Tetrahedron_class = nullptr;  // NOLINT

static bool js_gi_Tetrahedron_contain(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int32_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        bool result = cobj->contain(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gi_Tetrahedron_contain)

static bool js_gi_Tetrahedron_isInCircumSphere(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        bool result = cobj->isInCircumSphere(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gi_Tetrahedron_isInCircumSphere)

static bool js_gi_Tetrahedron_isInnerTetrahedron(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isInnerTetrahedron();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gi_Tetrahedron_isInnerTetrahedron)

static bool js_gi_Tetrahedron_isOuterCell(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isOuterCell();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gi_Tetrahedron_isOuterCell)

static bool js_gi_Tetrahedron_get_invalid(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->invalid, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->invalid, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_Tetrahedron_get_invalid)

static bool js_gi_Tetrahedron_set_invalid(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->invalid, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_Tetrahedron_set_invalid)

static bool js_gi_Tetrahedron_get_vertex0(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->vertex0, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->vertex0, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_Tetrahedron_get_vertex0)

static bool js_gi_Tetrahedron_set_vertex0(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->vertex0, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_Tetrahedron_set_vertex0)

static bool js_gi_Tetrahedron_get_vertex1(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->vertex1, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->vertex1, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_Tetrahedron_get_vertex1)

static bool js_gi_Tetrahedron_set_vertex1(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->vertex1, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_Tetrahedron_set_vertex1)

static bool js_gi_Tetrahedron_get_vertex2(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->vertex2, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->vertex2, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_Tetrahedron_get_vertex2)

static bool js_gi_Tetrahedron_set_vertex2(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->vertex2, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_Tetrahedron_set_vertex2)

static bool js_gi_Tetrahedron_get_vertex3(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->vertex3, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->vertex3, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_Tetrahedron_get_vertex3)

static bool js_gi_Tetrahedron_set_vertex3(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->vertex3, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_Tetrahedron_set_vertex3)

static bool js_gi_Tetrahedron_get_neighbours(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->neighbours, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->neighbours, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_Tetrahedron_get_neighbours)

static bool js_gi_Tetrahedron_set_neighbours(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->neighbours, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_Tetrahedron_set_neighbours)

static bool js_gi_Tetrahedron_get_matrix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->matrix, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->matrix, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_Tetrahedron_get_matrix)

static bool js_gi_Tetrahedron_set_matrix(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->matrix, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_Tetrahedron_set_matrix)

static bool js_gi_Tetrahedron_get_offset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->offset, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->offset, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_Tetrahedron_get_offset)

static bool js_gi_Tetrahedron_set_offset(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->offset, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_Tetrahedron_set_offset)

static bool js_gi_Tetrahedron_get_sphere(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->sphere, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->sphere, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_Tetrahedron_get_sphere)

static bool js_gi_Tetrahedron_set_sphere(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::Tetrahedron>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->sphere, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_Tetrahedron_set_sphere)


template<>
bool sevalue_to_native(const se::Value &from, cc::gi::Tetrahedron * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::gi::Tetrahedron*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("invalid", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->invalid), ctx);
    }
    json->getProperty("vertex0", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->vertex0), ctx);
    }
    json->getProperty("vertex1", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->vertex1), ctx);
    }
    json->getProperty("vertex2", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->vertex2), ctx);
    }
    json->getProperty("vertex3", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->vertex3), ctx);
    }
    json->getProperty("neighbours", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->neighbours), ctx);
    }
    json->getProperty("matrix", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->matrix), ctx);
    }
    json->getProperty("offset", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->offset), ctx);
    }
    json->getProperty("sphere", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->sphere), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gi_Tetrahedron_finalize)

static bool js_gi_Tetrahedron_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::gi::Tetrahedron);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::gi::Tetrahedron);
        auto cobj = ptr->get<cc::gi::Tetrahedron>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::gi::Tetrahedron);
    auto cobj = ptr->get<cc::gi::Tetrahedron>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->invalid), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->vertex0), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->vertex1), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->vertex2), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->vertex3), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->neighbours), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->matrix), nullptr);
    }
    if (argc > 7 && !args[7].isUndefined()) {
        ok &= sevalue_to_native(args[7], &(cobj->offset), nullptr);
    }
    if (argc > 8 && !args[8].isUndefined()) {
        ok &= sevalue_to_native(args[8], &(cobj->sphere), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_gi_Tetrahedron_constructor, __jsb_cc_gi_Tetrahedron_class, js_cc_gi_Tetrahedron_finalize)

static bool js_cc_gi_Tetrahedron_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gi_Tetrahedron_finalize)

bool js_register_gi_Tetrahedron(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Tetrahedron", obj, nullptr, _SE(js_gi_Tetrahedron_constructor));

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_gi_getter_return_true), nullptr);
#endif
    cls->defineProperty("invalid", _SE(js_gi_Tetrahedron_get_invalid), _SE(js_gi_Tetrahedron_set_invalid));
    cls->defineProperty("vertex0", _SE(js_gi_Tetrahedron_get_vertex0), _SE(js_gi_Tetrahedron_set_vertex0));
    cls->defineProperty("vertex1", _SE(js_gi_Tetrahedron_get_vertex1), _SE(js_gi_Tetrahedron_set_vertex1));
    cls->defineProperty("vertex2", _SE(js_gi_Tetrahedron_get_vertex2), _SE(js_gi_Tetrahedron_set_vertex2));
    cls->defineProperty("vertex3", _SE(js_gi_Tetrahedron_get_vertex3), _SE(js_gi_Tetrahedron_set_vertex3));
    cls->defineProperty("neighbours", _SE(js_gi_Tetrahedron_get_neighbours), _SE(js_gi_Tetrahedron_set_neighbours));
    cls->defineProperty("matrix", _SE(js_gi_Tetrahedron_get_matrix), _SE(js_gi_Tetrahedron_set_matrix));
    cls->defineProperty("offset", _SE(js_gi_Tetrahedron_get_offset), _SE(js_gi_Tetrahedron_set_offset));
    cls->defineProperty("sphere", _SE(js_gi_Tetrahedron_get_sphere), _SE(js_gi_Tetrahedron_set_sphere));
    cls->defineFunction("contain", _SE(js_gi_Tetrahedron_contain));
    cls->defineFunction("isInCircumSphere", _SE(js_gi_Tetrahedron_isInCircumSphere));
    cls->defineFunction("isInnerTetrahedron", _SE(js_gi_Tetrahedron_isInnerTetrahedron));
    cls->defineFunction("isOuterCell", _SE(js_gi_Tetrahedron_isOuterCell));
    cls->defineFinalizeFunction(_SE(js_cc_gi_Tetrahedron_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gi::Tetrahedron>(cls);

    __jsb_cc_gi_Tetrahedron_proto = cls->getProto();
    __jsb_cc_gi_Tetrahedron_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gi_LightProbesData_proto = nullptr; // NOLINT
se::Class* __jsb_cc_gi_LightProbesData_class = nullptr;  // NOLINT

static bool js_gi_LightProbesData_available(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbesData>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->available();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gi_LightProbesData_available)

static bool js_gi_LightProbesData_build(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbesData>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::Vec3>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->build(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gi_LightProbesData_build)

static bool js_gi_LightProbesData_empty(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbesData>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->empty();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gi_LightProbesData_empty)

static bool js_gi_LightProbesData_getInterpolationSHCoefficients(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbesData>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<cc::Vec3, true> arg0 = {};
        HolderType<int32_t, false> arg1 = {};
        HolderType<std::vector<cc::Vec3>, true> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        int32_t result = cobj->getInterpolationSHCoefficients(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gi_LightProbesData_getInterpolationSHCoefficients)

static bool js_gi_LightProbesData_getProbes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbesData>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::vector<cc::gi::Vertex>& result = cobj->getProbes();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_gi_LightProbesData_getProbes)

static bool js_gi_LightProbesData_getTetrahedrons(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbesData>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::vector<cc::gi::Tetrahedron> result = cobj->getTetrahedrons();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_gi_LightProbesData_getTetrahedrons)

static bool js_gi_LightProbesData_setProbes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbesData>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::gi::Vertex>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setProbes(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_gi_LightProbesData_setProbes)

static bool js_gi_LightProbesData_setTetrahedrons(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbesData>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::gi::Tetrahedron>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setTetrahedrons(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_gi_LightProbesData_setTetrahedrons)

static bool js_gi_LightProbesData_get__probes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbesData>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_probes, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_probes, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_LightProbesData_get__probes)

static bool js_gi_LightProbesData_set__probes(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbesData>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_probes, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_LightProbesData_set__probes)

static bool js_gi_LightProbesData_get__tetrahedrons(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbesData>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_tetrahedrons, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_tetrahedrons, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_LightProbesData_get__tetrahedrons)

static bool js_gi_LightProbesData_set__tetrahedrons(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbesData>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_tetrahedrons, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_LightProbesData_set__tetrahedrons)

SE_DECLARE_FINALIZE_FUNC(js_cc_gi_LightProbesData_finalize)

static bool js_gi_LightProbesData_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::gi::LightProbesData);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_gi_LightProbesData_constructor, __jsb_cc_gi_LightProbesData_class, js_cc_gi_LightProbesData_finalize)

static bool js_cc_gi_LightProbesData_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gi_LightProbesData_finalize)

bool js_register_gi_LightProbesData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("LightProbesData", obj, nullptr, _SE(js_gi_LightProbesData_constructor));

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_gi_getter_return_true), nullptr);
#endif
    cls->defineProperty("_probes", _SE(js_gi_LightProbesData_get__probes), _SE(js_gi_LightProbesData_set__probes));
    cls->defineProperty("_tetrahedrons", _SE(js_gi_LightProbesData_get__tetrahedrons), _SE(js_gi_LightProbesData_set__tetrahedrons));
    cls->defineProperty("probes", _SE(js_gi_LightProbesData_getProbes_asGetter), _SE(js_gi_LightProbesData_setProbes_asSetter));
    cls->defineProperty("tetrahedrons", _SE(js_gi_LightProbesData_getTetrahedrons_asGetter), _SE(js_gi_LightProbesData_setTetrahedrons_asSetter));
    cls->defineFunction("available", _SE(js_gi_LightProbesData_available));
    cls->defineFunction("build", _SE(js_gi_LightProbesData_build));
    cls->defineFunction("empty", _SE(js_gi_LightProbesData_empty));
    cls->defineFunction("getInterpolationSHCoefficients", _SE(js_gi_LightProbesData_getInterpolationSHCoefficients));
    cls->defineFinalizeFunction(_SE(js_cc_gi_LightProbesData_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gi::LightProbesData>(cls);

    __jsb_cc_gi_LightProbesData_proto = cls->getProto();
    __jsb_cc_gi_LightProbesData_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gi_LightProbes_proto = nullptr; // NOLINT
se::Class* __jsb_cc_gi_LightProbes_class = nullptr;  // NOLINT

static bool js_gi_LightProbes_available(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbes>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->available();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gi_LightProbes_available)

static bool js_gi_LightProbes_getData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbes>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gi::LightProbesData& result = cobj->getData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_gi_LightProbes_getData)

static bool js_gi_LightProbes_getReduceRinging(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbes>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getReduceRinging();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_gi_LightProbes_getReduceRinging)

static bool js_gi_LightProbes_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbes>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gi::LightProbeInfo*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gi_LightProbes_initialize)

static bool js_gi_LightProbes_isEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbes>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isEnabled();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_gi_LightProbes_isEnabled)

static bool js_gi_LightProbes_isShowConvex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbes>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isShowConvex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_gi_LightProbes_isShowConvex)

static bool js_gi_LightProbes_isShowProbe(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbes>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isShowProbe();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_gi_LightProbes_isShowProbe)

static bool js_gi_LightProbes_isShowWireframe(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbes>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isShowWireframe();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_gi_LightProbes_isShowWireframe)

static bool js_gi_LightProbes_setData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbes>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gi::LightProbesData, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setData(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_gi_LightProbes_setData)

static bool js_gi_LightProbes_setEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbes>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_gi_LightProbes_setEnabled)

static bool js_gi_LightProbes_setReduceRinging(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbes>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setReduceRinging(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_gi_LightProbes_setReduceRinging)

static bool js_gi_LightProbes_setShowConvex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbes>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setShowConvex(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_gi_LightProbes_setShowConvex)

static bool js_gi_LightProbes_setShowProbe(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbes>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setShowProbe(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_gi_LightProbes_setShowProbe)

static bool js_gi_LightProbes_setShowWireframe(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbes>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setShowWireframe(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_gi_LightProbes_setShowWireframe)

SE_DECLARE_FINALIZE_FUNC(js_cc_gi_LightProbes_finalize)

static bool js_gi_LightProbes_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::gi::LightProbes);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_gi_LightProbes_constructor, __jsb_cc_gi_LightProbes_class, js_cc_gi_LightProbes_finalize)

static bool js_cc_gi_LightProbes_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gi_LightProbes_finalize)

bool js_register_gi_LightProbes(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("LightProbes", obj, nullptr, _SE(js_gi_LightProbes_constructor));

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_gi_getter_return_true), nullptr);
#endif
    cls->defineProperty("enabled", _SE(js_gi_LightProbes_isEnabled_asGetter), _SE(js_gi_LightProbes_setEnabled_asSetter));
    cls->defineProperty("reduceRinging", _SE(js_gi_LightProbes_getReduceRinging_asGetter), _SE(js_gi_LightProbes_setReduceRinging_asSetter));
    cls->defineProperty("showProbe", _SE(js_gi_LightProbes_isShowProbe_asGetter), _SE(js_gi_LightProbes_setShowProbe_asSetter));
    cls->defineProperty("showWireframe", _SE(js_gi_LightProbes_isShowWireframe_asGetter), _SE(js_gi_LightProbes_setShowWireframe_asSetter));
    cls->defineProperty("showConvex", _SE(js_gi_LightProbes_isShowConvex_asGetter), _SE(js_gi_LightProbes_setShowConvex_asSetter));
    cls->defineProperty("data", _SE(js_gi_LightProbes_getData_asGetter), _SE(js_gi_LightProbes_setData_asSetter));
    cls->defineFunction("available", _SE(js_gi_LightProbes_available));
    cls->defineFunction("initialize", _SE(js_gi_LightProbes_initialize));
    cls->defineFinalizeFunction(_SE(js_cc_gi_LightProbes_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gi::LightProbes>(cls);

    __jsb_cc_gi_LightProbes_proto = cls->getProto();
    __jsb_cc_gi_LightProbes_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_gi_LightProbeInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_gi_LightProbeInfo_class = nullptr;  // NOLINT

static bool js_gi_LightProbeInfo_activate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gi::LightProbes*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->activate(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gi_LightProbeInfo_activate)

static bool js_gi_LightProbeInfo_getData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gi::LightProbesData& result = cobj->getData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_gi_LightProbeInfo_getData)

static bool js_gi_LightProbeInfo_getReduceRinging(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getReduceRinging();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_gi_LightProbeInfo_getReduceRinging)

static bool js_gi_LightProbeInfo_isEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isEnabled();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_gi_LightProbeInfo_isEnabled)

static bool js_gi_LightProbeInfo_isShowConvex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isShowConvex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_gi_LightProbeInfo_isShowConvex)

static bool js_gi_LightProbeInfo_isShowProbe(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isShowProbe();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_gi_LightProbeInfo_isShowProbe)

static bool js_gi_LightProbeInfo_isShowWireframe(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isShowWireframe();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_gi_LightProbeInfo_isShowWireframe)

static bool js_gi_LightProbeInfo_setData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gi::LightProbesData, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setData(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_gi_LightProbeInfo_setData)

static bool js_gi_LightProbeInfo_setEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_gi_LightProbeInfo_setEnabled)

static bool js_gi_LightProbeInfo_setReduceRinging(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setReduceRinging(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gi_LightProbeInfo_setReduceRinging)

static bool js_gi_LightProbeInfo_setShowConvex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setShowConvex(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_gi_LightProbeInfo_setShowConvex)

static bool js_gi_LightProbeInfo_setShowProbe(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setShowProbe(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_gi_LightProbeInfo_setShowProbe)

static bool js_gi_LightProbeInfo_setShowWireframe(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setShowWireframe(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_gi_LightProbeInfo_setShowWireframe)

static bool js_gi_LightProbeInfo_get__enabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_enabled, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_enabled, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_LightProbeInfo_get__enabled)

static bool js_gi_LightProbeInfo_set__enabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_enabled, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_LightProbeInfo_set__enabled)

static bool js_gi_LightProbeInfo_get__reduceRinging(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_reduceRinging, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_reduceRinging, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_LightProbeInfo_get__reduceRinging)

static bool js_gi_LightProbeInfo_set__reduceRinging(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_reduceRinging, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_LightProbeInfo_set__reduceRinging)

static bool js_gi_LightProbeInfo_get__showProbe(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_showProbe, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_showProbe, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_LightProbeInfo_get__showProbe)

static bool js_gi_LightProbeInfo_set__showProbe(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_showProbe, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_LightProbeInfo_set__showProbe)

static bool js_gi_LightProbeInfo_get__showWireframe(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_showWireframe, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_showWireframe, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_LightProbeInfo_get__showWireframe)

static bool js_gi_LightProbeInfo_set__showWireframe(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_showWireframe, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_LightProbeInfo_set__showWireframe)

static bool js_gi_LightProbeInfo_get__showConvex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_showConvex, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_showConvex, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_LightProbeInfo_get__showConvex)

static bool js_gi_LightProbeInfo_set__showConvex(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_showConvex, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_LightProbeInfo_set__showConvex)

static bool js_gi_LightProbeInfo_get__data(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_data, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_data, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_gi_LightProbeInfo_get__data)

static bool js_gi_LightProbeInfo_set__data(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::gi::LightProbeInfo>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_data, s.thisObject());
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gi_LightProbeInfo_set__data)

SE_DECLARE_FINALIZE_FUNC(js_cc_gi_LightProbeInfo_finalize)

static bool js_gi_LightProbeInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::gi::LightProbeInfo);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_gi_LightProbeInfo_constructor, __jsb_cc_gi_LightProbeInfo_class, js_cc_gi_LightProbeInfo_finalize)

static bool js_cc_gi_LightProbeInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gi_LightProbeInfo_finalize)

bool js_register_gi_LightProbeInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("LightProbeInfo", obj, nullptr, _SE(js_gi_LightProbeInfo_constructor));

#if CC_DEBUG
    cls->defineStaticProperty("isJSBClass", _SE(js_gi_getter_return_true), nullptr);
#endif
    cls->defineProperty("_enabled", _SE(js_gi_LightProbeInfo_get__enabled), _SE(js_gi_LightProbeInfo_set__enabled));
    cls->defineProperty("_reduceRinging", _SE(js_gi_LightProbeInfo_get__reduceRinging), _SE(js_gi_LightProbeInfo_set__reduceRinging));
    cls->defineProperty("_showProbe", _SE(js_gi_LightProbeInfo_get__showProbe), _SE(js_gi_LightProbeInfo_set__showProbe));
    cls->defineProperty("_showWireframe", _SE(js_gi_LightProbeInfo_get__showWireframe), _SE(js_gi_LightProbeInfo_set__showWireframe));
    cls->defineProperty("_showConvex", _SE(js_gi_LightProbeInfo_get__showConvex), _SE(js_gi_LightProbeInfo_set__showConvex));
    cls->defineProperty("_data", _SE(js_gi_LightProbeInfo_get__data), _SE(js_gi_LightProbeInfo_set__data));
    cls->defineProperty("enabled", _SE(js_gi_LightProbeInfo_isEnabled_asGetter), _SE(js_gi_LightProbeInfo_setEnabled_asSetter));
    cls->defineProperty("reduceRinging", _SE(js_gi_LightProbeInfo_getReduceRinging_asGetter), nullptr);
    cls->defineProperty("showProbe", _SE(js_gi_LightProbeInfo_isShowProbe_asGetter), _SE(js_gi_LightProbeInfo_setShowProbe_asSetter));
    cls->defineProperty("showWireframe", _SE(js_gi_LightProbeInfo_isShowWireframe_asGetter), _SE(js_gi_LightProbeInfo_setShowWireframe_asSetter));
    cls->defineProperty("showConvex", _SE(js_gi_LightProbeInfo_isShowConvex_asGetter), _SE(js_gi_LightProbeInfo_setShowConvex_asSetter));
    cls->defineProperty("data", _SE(js_gi_LightProbeInfo_getData_asGetter), _SE(js_gi_LightProbeInfo_setData_asSetter));
    cls->defineFunction("activate", _SE(js_gi_LightProbeInfo_activate));
    cls->defineFunction("setReduceRinging", _SE(js_gi_LightProbeInfo_setReduceRinging));
    cls->defineFinalizeFunction(_SE(js_cc_gi_LightProbeInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gi::LightProbeInfo>(cls);

    __jsb_cc_gi_LightProbeInfo_proto = cls->getProto();
    __jsb_cc_gi_LightProbeInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
bool register_all_gi(se::Object* obj)    // NOLINT
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

    js_register_gi_CircumSphere(ns);
    js_register_gi_LightProbeInfo(ns);
    js_register_gi_LightProbes(ns);
    js_register_gi_LightProbesData(ns);
    js_register_gi_Tetrahedron(ns);
    js_register_gi_Vertex(ns);
    return true;
}

// clang-format on