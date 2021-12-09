#include "cocos/bindings/auto/jsb_scene_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "scene/Node.h"
#include "scene/BaseNode.h"
#include "scene/Scene.h"
#include "scene/Light.h"
#include "scene/DirectionalLight.h"
#include "scene/SpotLight.h"
#include "scene/SphereLight.h"
#include "scene/Model.h"
#include "scene/SubModel.h"
#include "scene/Pass.h"
#include "scene/RenderScene.h"
#include "scene/DrawBatch2D.h"
#include "scene/Camera.h"
#include "scene/RenderWindow.h"
#include "scene/Camera.h"
#include "scene/Define.h"
#include "scene/AABB.h"
#include "scene/Sphere.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_scene_BaseNode_proto = nullptr;
se::Class* __jsb_cc_scene_BaseNode_class = nullptr;

static bool js_scene_BaseNode_getChilds(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::BaseNode>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_BaseNode_getChilds : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::scene::BaseNode *>& result = cobj->getChilds();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_BaseNode_getChilds : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_BaseNode_getChilds)

static bool js_scene_BaseNode_setParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::BaseNode>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_BaseNode_setParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::BaseNode*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_BaseNode_setParent : Error processing arguments");
        cobj->setParent(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_BaseNode_setParent)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_BaseNode_finalize)

static bool js_scene_BaseNode_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::scene::BaseNode* cobj = JSB_ALLOC(cc::scene::BaseNode);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_scene_BaseNode_constructor, __jsb_cc_scene_BaseNode_class, js_cc_scene_BaseNode_finalize)



static bool js_cc_scene_BaseNode_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::BaseNode>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::BaseNode>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_BaseNode_finalize)

bool js_register_scene_BaseNode(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BaseNode", obj, nullptr, _SE(js_scene_BaseNode_constructor));

    cls->defineFunction("getChilds", _SE(js_scene_BaseNode_getChilds));
    cls->defineFunction("setParent", _SE(js_scene_BaseNode_setParent));
    cls->defineFinalizeFunction(_SE(js_cc_scene_BaseNode_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::BaseNode>(cls);

    __jsb_cc_scene_BaseNode_proto = cls->getProto();
    __jsb_cc_scene_BaseNode_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Scene_proto = nullptr;
se::Class* __jsb_cc_scene_Scene_class = nullptr;

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Scene_finalize)

static bool js_scene_Scene_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::scene::Scene* cobj = JSB_ALLOC(cc::scene::Scene);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_scene_Scene_constructor, __jsb_cc_scene_Scene_class, js_cc_scene_Scene_finalize)



static bool js_cc_scene_Scene_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::Scene>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::Scene>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Scene_finalize)

bool js_register_scene_Scene(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Scene", obj, __jsb_cc_scene_BaseNode_proto, _SE(js_scene_Scene_constructor));

    cls->defineFinalizeFunction(_SE(js_cc_scene_Scene_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Scene>(cls);

    __jsb_cc_scene_Scene_proto = cls->getProto();
    __jsb_cc_scene_Scene_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Node_proto = nullptr;
se::Class* __jsb_cc_scene_Node_class = nullptr;

static bool js_scene_Node_initWithData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_initWithData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<unsigned char*, false> arg0 = {};
        HolderType<unsigned char*, false> arg1 = {};
        HolderType<se::Value, true> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_initWithData : Error processing arguments");
        cobj->initWithData(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_scene_Node_initWithData)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Node_finalize)

static bool js_scene_Node_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::scene::Node* cobj = JSB_ALLOC(cc::scene::Node);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_scene_Node_constructor, __jsb_cc_scene_Node_class, js_cc_scene_Node_finalize)



static bool js_cc_scene_Node_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::Node>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::Node>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Node_finalize)

bool js_register_scene_Node(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Node", obj, __jsb_cc_scene_BaseNode_proto, _SE(js_scene_Node_constructor));

    cls->defineFunction("initWithData", _SE(js_scene_Node_initWithData));
    cls->defineFinalizeFunction(_SE(js_cc_scene_Node_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Node>(cls);

    __jsb_cc_scene_Node_proto = cls->getProto();
    __jsb_cc_scene_Node_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Light_proto = nullptr;
se::Class* __jsb_cc_scene_Light_class = nullptr;

static bool js_scene_Light_getBaked(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_getBaked : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getBaked();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Light_getBaked : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Light_getBaked)

static bool js_scene_Light_setBaked(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_setBaked : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Light_setBaked : Error processing arguments");
        cobj->setBaked(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Light_setBaked)

static bool js_scene_Light_setColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_setColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Light_setColor : Error processing arguments");
        cobj->setColor(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Light_setColor)

static bool js_scene_Light_setColorTemperatureRGB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_setColorTemperatureRGB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Light_setColorTemperatureRGB : Error processing arguments");
        cobj->setColorTemperatureRGB(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Light_setColorTemperatureRGB)

static bool js_scene_Light_setNode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_setNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Light_setNode : Error processing arguments");
        cobj->setNode(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Light_setNode)

static bool js_scene_Light_setType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_setType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::LightType, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Light_setType : Error processing arguments");
        cobj->setType(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Light_setType)

static bool js_scene_Light_setUseColorTemperature(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_setUseColorTemperature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Light_setUseColorTemperature : Error processing arguments");
        cobj->setUseColorTemperature(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Light_setUseColorTemperature)

static bool js_scene_Light_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->update();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Light_update)



bool js_register_scene_Light(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Light", obj, nullptr, nullptr);

    cls->defineFunction("getBaked", _SE(js_scene_Light_getBaked));
    cls->defineFunction("setBaked", _SE(js_scene_Light_setBaked));
    cls->defineFunction("setColor", _SE(js_scene_Light_setColor));
    cls->defineFunction("setColorTemperatureRGB", _SE(js_scene_Light_setColorTemperatureRGB));
    cls->defineFunction("setNode", _SE(js_scene_Light_setNode));
    cls->defineFunction("setType", _SE(js_scene_Light_setType));
    cls->defineFunction("setUseColorTemperature", _SE(js_scene_Light_setUseColorTemperature));
    cls->defineFunction("update", _SE(js_scene_Light_update));
    cls->install();
    JSBClassType::registerClass<cc::scene::Light>(cls);

    __jsb_cc_scene_Light_proto = cls->getProto();
    __jsb_cc_scene_Light_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_DirectionalLight_proto = nullptr;
se::Class* __jsb_cc_scene_DirectionalLight_class = nullptr;

static bool js_scene_DirectionalLight_setDirection(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_setDirection : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_setDirection : Error processing arguments");
        cobj->setDirection(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_setDirection)

static bool js_scene_DirectionalLight_setIlluminanceHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_setIlluminanceHDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_setIlluminanceHDR : Error processing arguments");
        cobj->setIlluminanceHDR(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_setIlluminanceHDR)

static bool js_scene_DirectionalLight_setIlluminanceLDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_setIlluminanceLDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_setIlluminanceLDR : Error processing arguments");
        cobj->setIlluminanceLDR(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_setIlluminanceLDR)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_DirectionalLight_finalize)

static bool js_scene_DirectionalLight_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::scene::DirectionalLight* cobj = JSB_ALLOC(cc::scene::DirectionalLight);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_scene_DirectionalLight_constructor, __jsb_cc_scene_DirectionalLight_class, js_cc_scene_DirectionalLight_finalize)



static bool js_cc_scene_DirectionalLight_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::DirectionalLight>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_DirectionalLight_finalize)

bool js_register_scene_DirectionalLight(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DirectionalLight", obj, __jsb_cc_scene_Light_proto, _SE(js_scene_DirectionalLight_constructor));

    cls->defineFunction("setDirection", _SE(js_scene_DirectionalLight_setDirection));
    cls->defineFunction("setIlluminanceHDR", _SE(js_scene_DirectionalLight_setIlluminanceHDR));
    cls->defineFunction("setIlluminanceLDR", _SE(js_scene_DirectionalLight_setIlluminanceLDR));
    cls->defineFinalizeFunction(_SE(js_cc_scene_DirectionalLight_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::DirectionalLight>(cls);

    __jsb_cc_scene_DirectionalLight_proto = cls->getProto();
    __jsb_cc_scene_DirectionalLight_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Plane_proto = nullptr;
se::Class* __jsb_cc_scene_Plane_class = nullptr;

static bool js_scene_Plane_clone(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Plane>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Plane_clone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Plane result = cobj->clone();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Plane_clone : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Plane_clone)

static bool js_scene_Plane_define(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::scene::Plane>(s);
    SE_PRECONDITION2( cobj, false, "js_scene_Plane_define : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<cc::Vec3, true> arg0 = {};
            HolderType<cc::Vec3, true> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->define(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<cc::Vec3, true> arg0 = {};
            HolderType<cc::Vec3, true> arg1 = {};
            HolderType<cc::Vec3, true> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->define(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_scene_Plane_define)

static bool js_scene_Plane_distance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Plane>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Plane_distance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Plane_distance : Error processing arguments");
        float result = cobj->distance(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Plane_distance : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Plane_distance)

static bool js_scene_Plane_get_d(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Plane>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Plane_get_d : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->d, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->d, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Plane_get_d)

static bool js_scene_Plane_set_d(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Plane>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Plane_set_d : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->d, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Plane_set_d : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Plane_set_d)

static bool js_scene_Plane_get_n(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Plane>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Plane_get_n : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->n, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->n, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Plane_get_n)

static bool js_scene_Plane_set_n(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Plane>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Plane_set_n : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->n, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Plane_set_n : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Plane_set_n)


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::Plane * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::Plane*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("d", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->d), ctx);
    }
    json->getProperty("n", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->n), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Plane_finalize)

static bool js_scene_Plane_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::scene::Plane* cobj = JSB_ALLOC(cc::scene::Plane);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::scene::Plane* cobj = JSB_ALLOC(cc::scene::Plane);
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

    cc::scene::Plane* cobj = JSB_ALLOC(cc::scene::Plane);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->d), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->n), nullptr);
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
SE_BIND_CTOR(js_scene_Plane_constructor, __jsb_cc_scene_Plane_class, js_cc_scene_Plane_finalize)



static bool js_cc_scene_Plane_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::Plane>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::Plane>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Plane_finalize)

bool js_register_scene_Plane(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Plane", obj, nullptr, _SE(js_scene_Plane_constructor));

    cls->defineProperty("d", _SE(js_scene_Plane_get_d), _SE(js_scene_Plane_set_d));
    cls->defineProperty("n", _SE(js_scene_Plane_get_n), _SE(js_scene_Plane_set_n));
    cls->defineFunction("clone", _SE(js_scene_Plane_clone));
    cls->defineFunction("define", _SE(js_scene_Plane_define));
    cls->defineFunction("distance", _SE(js_scene_Plane_distance));
    cls->defineFinalizeFunction(_SE(js_cc_scene_Plane_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Plane>(cls);

    __jsb_cc_scene_Plane_proto = cls->getProto();
    __jsb_cc_scene_Plane_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Frustum_proto = nullptr;
se::Class* __jsb_cc_scene_Frustum_class = nullptr;

static bool js_scene_Frustum_clone(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Frustum>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Frustum_clone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Frustum result = cobj->clone();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Frustum_clone : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Frustum_clone)

static bool js_scene_Frustum_createOrtho(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Frustum>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Frustum_createOrtho : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<cc::Mat4, true> arg4 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Frustum_createOrtho : Error processing arguments");
        cobj->createOrtho(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_scene_Frustum_createOrtho)

static bool js_scene_Frustum_split(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Frustum>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Frustum_split : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<cc::Mat4, true> arg4 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Frustum_split : Error processing arguments");
        cobj->split(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_scene_Frustum_split)

static bool js_scene_Frustum_transform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Frustum>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Frustum_transform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Mat4, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Frustum_transform : Error processing arguments");
        cobj->transform(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Frustum_transform)

static bool js_scene_Frustum_get_vertices(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Frustum>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Frustum_get_vertices : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->vertices, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->vertices, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Frustum_get_vertices)

static bool js_scene_Frustum_set_vertices(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Frustum>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Frustum_set_vertices : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->vertices, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Frustum_set_vertices : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Frustum_set_vertices)

static bool js_scene_Frustum_get_planes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Frustum>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Frustum_get_planes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->planes, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->planes, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Frustum_get_planes)

static bool js_scene_Frustum_set_planes(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Frustum>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Frustum_set_planes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->planes, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Frustum_set_planes : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Frustum_set_planes)


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::Frustum * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::Frustum*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("vertices", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->vertices), ctx);
    }
    json->getProperty("planes", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->planes), ctx);
    }
    json->getProperty("type", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Frustum_finalize)

static bool js_scene_Frustum_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::scene::Frustum* cobj = JSB_ALLOC(cc::scene::Frustum);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::scene::Frustum* cobj = JSB_ALLOC(cc::scene::Frustum);
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

    cc::scene::Frustum* cobj = JSB_ALLOC(cc::scene::Frustum);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->vertices), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->planes), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->type), nullptr);
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
SE_BIND_CTOR(js_scene_Frustum_constructor, __jsb_cc_scene_Frustum_class, js_cc_scene_Frustum_finalize)



static bool js_cc_scene_Frustum_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::Frustum>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::Frustum>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Frustum_finalize)

bool js_register_scene_Frustum(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Frustum", obj, nullptr, _SE(js_scene_Frustum_constructor));

    cls->defineProperty("vertices", _SE(js_scene_Frustum_get_vertices), _SE(js_scene_Frustum_set_vertices));
    cls->defineProperty("planes", _SE(js_scene_Frustum_get_planes), _SE(js_scene_Frustum_set_planes));
    cls->defineFunction("clone", _SE(js_scene_Frustum_clone));
    cls->defineFunction("createOrtho", _SE(js_scene_Frustum_createOrtho));
    cls->defineFunction("split", _SE(js_scene_Frustum_split));
    cls->defineFunction("transform", _SE(js_scene_Frustum_transform));
    cls->defineFinalizeFunction(_SE(js_cc_scene_Frustum_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Frustum>(cls);

    __jsb_cc_scene_Frustum_proto = cls->getProto();
    __jsb_cc_scene_Frustum_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_AABB_proto = nullptr;
se::Class* __jsb_cc_scene_AABB_class = nullptr;

static bool js_scene_AABB_contain(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AABB>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AABB_contain : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_AABB_contain : Error processing arguments");
        bool result = cobj->contain(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_AABB_contain : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_AABB_contain)

static bool js_scene_AABB_getLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AABB>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AABB_getLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::AABBLayout* result = cobj->getLayout();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_AABB_getLayout : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_AABB_getLayout)

static bool js_scene_AABB_initWithData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AABB>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AABB_initWithData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned char*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_AABB_initWithData : Error processing arguments");
        cobj->initWithData(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_AABB_initWithData)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_AABB_finalize)

static bool js_scene_AABB_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::scene::AABB* cobj = JSB_ALLOC(cc::scene::AABB);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_scene_AABB_constructor, __jsb_cc_scene_AABB_class, js_cc_scene_AABB_finalize)



static bool js_cc_scene_AABB_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::AABB>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::AABB>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_AABB_finalize)

bool js_register_scene_AABB(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("AABB", obj, nullptr, _SE(js_scene_AABB_constructor));

    cls->defineFunction("contain", _SE(js_scene_AABB_contain));
    cls->defineFunction("getLayout", _SE(js_scene_AABB_getLayout));
    cls->defineFunction("initWithData", _SE(js_scene_AABB_initWithData));
    cls->defineFinalizeFunction(_SE(js_cc_scene_AABB_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::AABB>(cls);

    __jsb_cc_scene_AABB_proto = cls->getProto();
    __jsb_cc_scene_AABB_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_SpotLight_proto = nullptr;
se::Class* __jsb_cc_scene_SpotLight_class = nullptr;

static bool js_scene_SpotLight_setAABB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_setAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::AABB*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_setAABB : Error processing arguments");
        cobj->setAABB(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SpotLight_setAABB)

static bool js_scene_SpotLight_setAngle(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_setAngle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_setAngle : Error processing arguments");
        cobj->setAngle(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SpotLight_setAngle)

static bool js_scene_SpotLight_setAspect(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_setAspect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_setAspect : Error processing arguments");
        cobj->setAspect(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SpotLight_setAspect)

static bool js_scene_SpotLight_setDirection(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_setDirection : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_setDirection : Error processing arguments");
        cobj->setDirection(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SpotLight_setDirection)

static bool js_scene_SpotLight_setFrustum(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_setFrustum : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Frustum, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_setFrustum : Error processing arguments");
        cobj->setFrustum(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SpotLight_setFrustum)

static bool js_scene_SpotLight_setLuminanceHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_setLuminanceHDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_setLuminanceHDR : Error processing arguments");
        cobj->setLuminanceHDR(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SpotLight_setLuminanceHDR)

static bool js_scene_SpotLight_setLuminanceLDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_setLuminanceLDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_setLuminanceLDR : Error processing arguments");
        cobj->setLuminanceLDR(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SpotLight_setLuminanceLDR)

static bool js_scene_SpotLight_setNeedUpdate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_setNeedUpdate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_setNeedUpdate : Error processing arguments");
        cobj->setNeedUpdate(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SpotLight_setNeedUpdate)

static bool js_scene_SpotLight_setPosition(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_setPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_setPosition : Error processing arguments");
        cobj->setPosition(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SpotLight_setPosition)

static bool js_scene_SpotLight_setRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_setRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_setRange : Error processing arguments");
        cobj->setRange(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SpotLight_setRange)

static bool js_scene_SpotLight_setSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_setSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_setSize : Error processing arguments");
        cobj->setSize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SpotLight_setSize)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_SpotLight_finalize)

static bool js_scene_SpotLight_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::scene::SpotLight* cobj = JSB_ALLOC(cc::scene::SpotLight);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_scene_SpotLight_constructor, __jsb_cc_scene_SpotLight_class, js_cc_scene_SpotLight_finalize)



static bool js_cc_scene_SpotLight_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::SpotLight>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_SpotLight_finalize)

bool js_register_scene_SpotLight(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SpotLight", obj, __jsb_cc_scene_Light_proto, _SE(js_scene_SpotLight_constructor));

    cls->defineFunction("setAABB", _SE(js_scene_SpotLight_setAABB));
    cls->defineFunction("setAngle", _SE(js_scene_SpotLight_setAngle));
    cls->defineFunction("setAspect", _SE(js_scene_SpotLight_setAspect));
    cls->defineFunction("setDirection", _SE(js_scene_SpotLight_setDirection));
    cls->defineFunction("setFrustum", _SE(js_scene_SpotLight_setFrustum));
    cls->defineFunction("setLuminanceHDR", _SE(js_scene_SpotLight_setLuminanceHDR));
    cls->defineFunction("setLuminanceLDR", _SE(js_scene_SpotLight_setLuminanceLDR));
    cls->defineFunction("setNeedUpdate", _SE(js_scene_SpotLight_setNeedUpdate));
    cls->defineFunction("setPosition", _SE(js_scene_SpotLight_setPosition));
    cls->defineFunction("setRange", _SE(js_scene_SpotLight_setRange));
    cls->defineFunction("setSize", _SE(js_scene_SpotLight_setSize));
    cls->defineFinalizeFunction(_SE(js_cc_scene_SpotLight_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::SpotLight>(cls);

    __jsb_cc_scene_SpotLight_proto = cls->getProto();
    __jsb_cc_scene_SpotLight_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_SphereLight_proto = nullptr;
se::Class* __jsb_cc_scene_SphereLight_class = nullptr;

static bool js_scene_SphereLight_setAABB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SphereLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SphereLight_setAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::AABB*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SphereLight_setAABB : Error processing arguments");
        cobj->setAABB(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SphereLight_setAABB)

static bool js_scene_SphereLight_setLuminanceHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SphereLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SphereLight_setLuminanceHDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SphereLight_setLuminanceHDR : Error processing arguments");
        cobj->setLuminanceHDR(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SphereLight_setLuminanceHDR)

static bool js_scene_SphereLight_setLuminanceLDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SphereLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SphereLight_setLuminanceLDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SphereLight_setLuminanceLDR : Error processing arguments");
        cobj->setLuminanceLDR(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SphereLight_setLuminanceLDR)

static bool js_scene_SphereLight_setPosition(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SphereLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SphereLight_setPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SphereLight_setPosition : Error processing arguments");
        cobj->setPosition(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SphereLight_setPosition)

static bool js_scene_SphereLight_setRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SphereLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SphereLight_setRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SphereLight_setRange : Error processing arguments");
        cobj->setRange(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SphereLight_setRange)

static bool js_scene_SphereLight_setSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SphereLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SphereLight_setSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SphereLight_setSize : Error processing arguments");
        cobj->setSize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SphereLight_setSize)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_SphereLight_finalize)

static bool js_scene_SphereLight_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::scene::SphereLight* cobj = JSB_ALLOC(cc::scene::SphereLight);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_scene_SphereLight_constructor, __jsb_cc_scene_SphereLight_class, js_cc_scene_SphereLight_finalize)



static bool js_cc_scene_SphereLight_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::SphereLight>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::SphereLight>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_SphereLight_finalize)

bool js_register_scene_SphereLight(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SphereLight", obj, __jsb_cc_scene_Light_proto, _SE(js_scene_SphereLight_constructor));

    cls->defineFunction("setAABB", _SE(js_scene_SphereLight_setAABB));
    cls->defineFunction("setLuminanceHDR", _SE(js_scene_SphereLight_setLuminanceHDR));
    cls->defineFunction("setLuminanceLDR", _SE(js_scene_SphereLight_setLuminanceLDR));
    cls->defineFunction("setPosition", _SE(js_scene_SphereLight_setPosition));
    cls->defineFunction("setRange", _SE(js_scene_SphereLight_setRange));
    cls->defineFunction("setSize", _SE(js_scene_SphereLight_setSize));
    cls->defineFinalizeFunction(_SE(js_cc_scene_SphereLight_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::SphereLight>(cls);

    __jsb_cc_scene_SphereLight_proto = cls->getProto();
    __jsb_cc_scene_SphereLight_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Model_proto = nullptr;
se::Class* __jsb_cc_scene_Model_class = nullptr;

static bool js_scene_Model_getCastShadow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getCastShadow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getCastShadow();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getCastShadow : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_getCastShadow)

static bool js_scene_Model_getEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getEnabled();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getEnabled : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_getEnabled)

static bool js_scene_Model_getInstMatWorldIdx(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getInstMatWorldIdx : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int32_t result = cobj->getInstMatWorldIdx();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getInstMatWorldIdx : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_getInstMatWorldIdx)

static bool js_scene_Model_getInstanceAttributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getInstanceAttributes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::Attribute>& result = cobj->getInstanceAttributes();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getInstanceAttributes : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_getInstanceAttributes)

static bool js_scene_Model_getInstancedAttributeBlock(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getInstancedAttributeBlock : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::InstancedAttributeBlock* result = cobj->getInstancedAttributeBlock();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getInstancedAttributeBlock : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_getInstancedAttributeBlock)

static bool js_scene_Model_getInstancedBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getInstancedBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned char* result = cobj->getInstancedBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getInstancedBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_getInstancedBuffer)

static bool js_scene_Model_getInstancedBufferSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getInstancedBufferSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getInstancedBufferSize();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getInstancedBufferSize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_getInstancedBufferSize)

static bool js_scene_Model_getLocalData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getLocalData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float* result = cobj->getLocalData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getLocalData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_getLocalData)

static bool js_scene_Model_getNode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Node* result = cobj->getNode();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getNode : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_getNode)

static bool js_scene_Model_getReceiveShadow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getReceiveShadow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getReceiveShadow();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getReceiveShadow : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_getReceiveShadow)

static bool js_scene_Model_getSubModels(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getSubModels : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::scene::SubModel *>& result = cobj->getSubModels();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getSubModels : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_getSubModels)

static bool js_scene_Model_getTransform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Node* result = cobj->getTransform();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getTransform : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_getTransform)

static bool js_scene_Model_getTransformUpdated(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getTransformUpdated : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getTransformUpdated();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getTransformUpdated : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_getTransformUpdated)

static bool js_scene_Model_getUpdatStamp(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getUpdatStamp : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int32_t result = cobj->getUpdatStamp();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getUpdatStamp : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_getUpdatStamp)

static bool js_scene_Model_getVisFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getVisFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getVisFlags();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getVisFlags : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_getVisFlags)

static bool js_scene_Model_getWorldBoundBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getWorldBoundBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Buffer* result = cobj->getWorldBoundBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getWorldBoundBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_getWorldBoundBuffer)

static bool js_scene_Model_seVisFlag(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_seVisFlag : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_seVisFlag : Error processing arguments");
        cobj->seVisFlag(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Model_seVisFlag)

static bool js_scene_Model_setBounds(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setBounds : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::AABB*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setBounds : Error processing arguments");
        cobj->setBounds(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Model_setBounds)

static bool js_scene_Model_setCastShadow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setCastShadow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setCastShadow : Error processing arguments");
        cobj->setCastShadow(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Model_setCastShadow)

static bool js_scene_Model_setEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setEnabled : Error processing arguments");
        cobj->setEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Model_setEnabled)

static bool js_scene_Model_setInstMatWorldIdx(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setInstMatWorldIdx : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int32_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setInstMatWorldIdx : Error processing arguments");
        cobj->setInstMatWorldIdx(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Model_setInstMatWorldIdx)

static bool js_scene_Model_setLocalBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setLocalBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Buffer*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setLocalBuffer : Error processing arguments");
        cobj->setLocalBuffer(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Model_setLocalBuffer)

static bool js_scene_Model_setNode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setNode : Error processing arguments");
        cobj->setNode(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Model_setNode)

static bool js_scene_Model_setReceiveShadow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setReceiveShadow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setReceiveShadow : Error processing arguments");
        cobj->setReceiveShadow(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Model_setReceiveShadow)

static bool js_scene_Model_setSubModel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setSubModel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<cc::scene::SubModel*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setSubModel : Error processing arguments");
        cobj->setSubModel(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Model_setSubModel)

static bool js_scene_Model_setTransform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setTransform : Error processing arguments");
        cobj->setTransform(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Model_setTransform)

static bool js_scene_Model_setWorldBoundBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setWorldBoundBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Buffer*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setWorldBoundBuffer : Error processing arguments");
        cobj->setWorldBoundBuffer(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Model_setWorldBoundBuffer)

static bool js_scene_Model_updateTransform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_updateTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_updateTransform : Error processing arguments");
        cobj->updateTransform(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Model_updateTransform)

static bool js_scene_Model_updateUBOs(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_updateUBOs : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_updateUBOs : Error processing arguments");
        cobj->updateUBOs(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Model_updateUBOs)

static bool js_scene_Model_updateWorldBoundUBOs(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_updateWorldBoundUBOs : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateWorldBoundUBOs();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_updateWorldBoundUBOs)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Model_finalize)

static bool js_scene_Model_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::scene::Model* cobj = JSB_ALLOC(cc::scene::Model);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_scene_Model_constructor, __jsb_cc_scene_Model_class, js_cc_scene_Model_finalize)



static bool js_cc_scene_Model_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::Model>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Model_finalize)

bool js_register_scene_Model(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Model", obj, nullptr, _SE(js_scene_Model_constructor));

    cls->defineFunction("getCastShadow", _SE(js_scene_Model_getCastShadow));
    cls->defineFunction("getEnabled", _SE(js_scene_Model_getEnabled));
    cls->defineFunction("getInstMatWorldIdx", _SE(js_scene_Model_getInstMatWorldIdx));
    cls->defineFunction("getInstanceAttributes", _SE(js_scene_Model_getInstanceAttributes));
    cls->defineFunction("getInstancedAttributeBlock", _SE(js_scene_Model_getInstancedAttributeBlock));
    cls->defineFunction("getInstancedBuffer", _SE(js_scene_Model_getInstancedBuffer));
    cls->defineFunction("getInstancedBufferSize", _SE(js_scene_Model_getInstancedBufferSize));
    cls->defineFunction("getLocalData", _SE(js_scene_Model_getLocalData));
    cls->defineFunction("getNode", _SE(js_scene_Model_getNode));
    cls->defineFunction("getReceiveShadow", _SE(js_scene_Model_getReceiveShadow));
    cls->defineFunction("getSubModels", _SE(js_scene_Model_getSubModels));
    cls->defineFunction("getTransform", _SE(js_scene_Model_getTransform));
    cls->defineFunction("getTransformUpdated", _SE(js_scene_Model_getTransformUpdated));
    cls->defineFunction("getUpdatStamp", _SE(js_scene_Model_getUpdatStamp));
    cls->defineFunction("getVisFlags", _SE(js_scene_Model_getVisFlags));
    cls->defineFunction("getWorldBoundBuffer", _SE(js_scene_Model_getWorldBoundBuffer));
    cls->defineFunction("seVisFlag", _SE(js_scene_Model_seVisFlag));
    cls->defineFunction("setBounds", _SE(js_scene_Model_setBounds));
    cls->defineFunction("setCastShadow", _SE(js_scene_Model_setCastShadow));
    cls->defineFunction("setEnabled", _SE(js_scene_Model_setEnabled));
    cls->defineFunction("setInstMatWorldIdx", _SE(js_scene_Model_setInstMatWorldIdx));
    cls->defineFunction("setLocalBuffer", _SE(js_scene_Model_setLocalBuffer));
    cls->defineFunction("setNode", _SE(js_scene_Model_setNode));
    cls->defineFunction("setReceiveShadow", _SE(js_scene_Model_setReceiveShadow));
    cls->defineFunction("setSubModel", _SE(js_scene_Model_setSubModel));
    cls->defineFunction("setTransform", _SE(js_scene_Model_setTransform));
    cls->defineFunction("setWorldBoundBuffer", _SE(js_scene_Model_setWorldBoundBuffer));
    cls->defineFunction("updateTransform", _SE(js_scene_Model_updateTransform));
    cls->defineFunction("updateUBOs", _SE(js_scene_Model_updateUBOs));
    cls->defineFunction("updateWorldBoundUBOs", _SE(js_scene_Model_updateWorldBoundUBOs));
    cls->defineFinalizeFunction(_SE(js_cc_scene_Model_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Model>(cls);

    __jsb_cc_scene_Model_proto = cls->getProto();
    __jsb_cc_scene_Model_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Fog_proto = nullptr;
se::Class* __jsb_cc_scene_Fog_class = nullptr;

static bool js_scene_Fog_get_enabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_get_enabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->enabled, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->enabled, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Fog_get_enabled)

static bool js_scene_Fog_set_enabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_set_enabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->enabled, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Fog_set_enabled : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Fog_set_enabled)

static bool js_scene_Fog_get_accurate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_get_accurate : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->accurate, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->accurate, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Fog_get_accurate)

static bool js_scene_Fog_set_accurate(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_set_accurate : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->accurate, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Fog_set_accurate : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Fog_set_accurate)

static bool js_scene_Fog_get_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->type, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Fog_get_type)

static bool js_scene_Fog_set_type(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->type, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Fog_set_type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Fog_set_type)

static bool js_scene_Fog_get_density(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_get_density : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->density, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->density, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Fog_get_density)

static bool js_scene_Fog_set_density(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_set_density : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->density, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Fog_set_density : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Fog_set_density)

static bool js_scene_Fog_get_start(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_get_start : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->start, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->start, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Fog_get_start)

static bool js_scene_Fog_set_start(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_set_start : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->start, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Fog_set_start : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Fog_set_start)

static bool js_scene_Fog_get_end(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_get_end : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->end, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->end, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Fog_get_end)

static bool js_scene_Fog_set_end(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_set_end : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->end, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Fog_set_end : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Fog_set_end)

static bool js_scene_Fog_get_atten(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_get_atten : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->atten, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->atten, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Fog_get_atten)

static bool js_scene_Fog_set_atten(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_set_atten : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->atten, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Fog_set_atten : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Fog_set_atten)

static bool js_scene_Fog_get_top(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_get_top : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->top, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->top, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Fog_get_top)

static bool js_scene_Fog_set_top(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_set_top : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->top, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Fog_set_top : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Fog_set_top)

static bool js_scene_Fog_get_range(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_get_range : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->range, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->range, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Fog_get_range)

static bool js_scene_Fog_set_range(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_set_range : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->range, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Fog_set_range : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Fog_set_range)

static bool js_scene_Fog_get_color(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_get_color : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->color, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->color, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Fog_get_color)

static bool js_scene_Fog_set_color(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_set_color : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->color, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Fog_set_color : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Fog_set_color)


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::Fog * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::Fog*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("enabled", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->enabled), ctx);
    }
    json->getProperty("accurate", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->accurate), ctx);
    }
    json->getProperty("type", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    json->getProperty("density", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->density), ctx);
    }
    json->getProperty("start", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->start), ctx);
    }
    json->getProperty("end", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->end), ctx);
    }
    json->getProperty("atten", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->atten), ctx);
    }
    json->getProperty("top", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->top), ctx);
    }
    json->getProperty("range", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->range), ctx);
    }
    json->getProperty("color", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->color), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Fog_finalize)

static bool js_scene_Fog_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::scene::Fog* cobj = JSB_ALLOC(cc::scene::Fog);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::scene::Fog* cobj = JSB_ALLOC(cc::scene::Fog);
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

    cc::scene::Fog* cobj = JSB_ALLOC(cc::scene::Fog);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->enabled), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->accurate), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->type), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->density), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->start), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->end), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->atten), nullptr);
    }
    if (argc > 7 && !args[7].isUndefined()) {
        ok &= sevalue_to_native(args[7], &(cobj->top), nullptr);
    }
    if (argc > 8 && !args[8].isUndefined()) {
        ok &= sevalue_to_native(args[8], &(cobj->range), nullptr);
    }
    if (argc > 9 && !args[9].isUndefined()) {
        ok &= sevalue_to_native(args[9], &(cobj->color), nullptr);
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
SE_BIND_CTOR(js_scene_Fog_constructor, __jsb_cc_scene_Fog_class, js_cc_scene_Fog_finalize)



static bool js_cc_scene_Fog_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::Fog>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Fog_finalize)

bool js_register_scene_Fog(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Fog", obj, nullptr, _SE(js_scene_Fog_constructor));

    cls->defineProperty("enabled", _SE(js_scene_Fog_get_enabled), _SE(js_scene_Fog_set_enabled));
    cls->defineProperty("accurate", _SE(js_scene_Fog_get_accurate), _SE(js_scene_Fog_set_accurate));
    cls->defineProperty("type", _SE(js_scene_Fog_get_type), _SE(js_scene_Fog_set_type));
    cls->defineProperty("density", _SE(js_scene_Fog_get_density), _SE(js_scene_Fog_set_density));
    cls->defineProperty("start", _SE(js_scene_Fog_get_start), _SE(js_scene_Fog_set_start));
    cls->defineProperty("end", _SE(js_scene_Fog_get_end), _SE(js_scene_Fog_set_end));
    cls->defineProperty("atten", _SE(js_scene_Fog_get_atten), _SE(js_scene_Fog_set_atten));
    cls->defineProperty("top", _SE(js_scene_Fog_get_top), _SE(js_scene_Fog_set_top));
    cls->defineProperty("range", _SE(js_scene_Fog_get_range), _SE(js_scene_Fog_set_range));
    cls->defineProperty("color", _SE(js_scene_Fog_get_color), _SE(js_scene_Fog_set_color));
    cls->defineFinalizeFunction(_SE(js_cc_scene_Fog_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Fog>(cls);

    __jsb_cc_scene_Fog_proto = cls->getProto();
    __jsb_cc_scene_Fog_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Shadow_proto = nullptr;
se::Class* __jsb_cc_scene_Shadow_class = nullptr;

static bool js_scene_Shadow_get_enabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_enabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->enabled, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->enabled, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_enabled)

static bool js_scene_Shadow_set_enabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_enabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->enabled, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_enabled : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_enabled)

static bool js_scene_Shadow_get_dirty(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_dirty : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->dirty, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->dirty, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_dirty)

static bool js_scene_Shadow_set_dirty(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_dirty : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->dirty, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_dirty : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_dirty)

static bool js_scene_Shadow_get_shadowMapDirty(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_shadowMapDirty : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->shadowMapDirty, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->shadowMapDirty, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_shadowMapDirty)

static bool js_scene_Shadow_set_shadowMapDirty(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_shadowMapDirty : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->shadowMapDirty, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_shadowMapDirty : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_shadowMapDirty)

static bool js_scene_Shadow_get_fixedArea(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_fixedArea : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->fixedArea, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->fixedArea, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_fixedArea)

static bool js_scene_Shadow_set_fixedArea(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_fixedArea : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->fixedArea, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_fixedArea : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_fixedArea)

static bool js_scene_Shadow_get_shadowType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_shadowType : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->shadowType, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->shadowType, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_shadowType)

static bool js_scene_Shadow_set_shadowType(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_shadowType : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->shadowType, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_shadowType : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_shadowType)

static bool js_scene_Shadow_get_invisibleOcclusionRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_invisibleOcclusionRange : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->invisibleOcclusionRange, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->invisibleOcclusionRange, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_invisibleOcclusionRange)

static bool js_scene_Shadow_set_invisibleOcclusionRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_invisibleOcclusionRange : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->invisibleOcclusionRange, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_invisibleOcclusionRange : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_invisibleOcclusionRange)

static bool js_scene_Shadow_get_shadowDistance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_shadowDistance : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->shadowDistance, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->shadowDistance, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_shadowDistance)

static bool js_scene_Shadow_set_shadowDistance(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_shadowDistance : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->shadowDistance, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_shadowDistance : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_shadowDistance)

static bool js_scene_Shadow_get_distance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_distance : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->distance, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->distance, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_distance)

static bool js_scene_Shadow_set_distance(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_distance : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->distance, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_distance : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_distance)

static bool js_scene_Shadow_get_instancePass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_instancePass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->instancePass, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->instancePass, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_instancePass)

static bool js_scene_Shadow_set_instancePass(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_instancePass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->instancePass, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_instancePass : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_instancePass)

static bool js_scene_Shadow_get_planarPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_planarPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->planarPass, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->planarPass, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_planarPass)

static bool js_scene_Shadow_set_planarPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_planarPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->planarPass, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_planarPass : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_planarPass)

static bool js_scene_Shadow_get_nearValue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_nearValue : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->nearValue, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->nearValue, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_nearValue)

static bool js_scene_Shadow_set_nearValue(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_nearValue : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->nearValue, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_nearValue : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_nearValue)

static bool js_scene_Shadow_get_farValue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_farValue : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->farValue, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->farValue, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_farValue)

static bool js_scene_Shadow_set_farValue(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_farValue : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->farValue, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_farValue : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_farValue)

static bool js_scene_Shadow_get_pcfType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_pcfType : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->pcfType, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->pcfType, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_pcfType)

static bool js_scene_Shadow_set_pcfType(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_pcfType : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->pcfType, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_pcfType : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_pcfType)

static bool js_scene_Shadow_get_bias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_bias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bias, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->bias, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_bias)

static bool js_scene_Shadow_set_bias(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_bias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bias, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_bias : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_bias)

static bool js_scene_Shadow_get_normalBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_normalBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->normalBias, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->normalBias, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_normalBias)

static bool js_scene_Shadow_set_normalBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_normalBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->normalBias, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_normalBias : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_normalBias)

static bool js_scene_Shadow_get_saturation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_saturation : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->saturation, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->saturation, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_saturation)

static bool js_scene_Shadow_set_saturation(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_saturation : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->saturation, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_saturation : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_saturation)

static bool js_scene_Shadow_get_orthoSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_orthoSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->orthoSize, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->orthoSize, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_orthoSize)

static bool js_scene_Shadow_set_orthoSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_orthoSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->orthoSize, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_orthoSize : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_orthoSize)

static bool js_scene_Shadow_get_color(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_color : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->color, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->color, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_color)

static bool js_scene_Shadow_set_color(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_color : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->color, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_color : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_color)

static bool js_scene_Shadow_get_size(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->size, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->size, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_size)

static bool js_scene_Shadow_set_size(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->size, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_size : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_size)

static bool js_scene_Shadow_get_normal(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_normal : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->normal, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->normal, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_normal)

static bool js_scene_Shadow_set_normal(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_normal : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->normal, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_normal : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_normal)

static bool js_scene_Shadow_get_matLight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_get_matLight : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->matLight, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->matLight, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadow_get_matLight)

static bool js_scene_Shadow_set_matLight(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadow_set_matLight : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->matLight, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Shadow_set_matLight : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Shadow_set_matLight)


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::Shadow * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::Shadow*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("enabled", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->enabled), ctx);
    }
    json->getProperty("dirty", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->dirty), ctx);
    }
    json->getProperty("shadowMapDirty", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->shadowMapDirty), ctx);
    }
    json->getProperty("fixedArea", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->fixedArea), ctx);
    }
    json->getProperty("shadowType", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->shadowType), ctx);
    }
    json->getProperty("invisibleOcclusionRange", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->invisibleOcclusionRange), ctx);
    }
    json->getProperty("shadowDistance", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->shadowDistance), ctx);
    }
    json->getProperty("distance", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->distance), ctx);
    }
    json->getProperty("instancePass", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->instancePass), ctx);
    }
    json->getProperty("planarPass", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->planarPass), ctx);
    }
    json->getProperty("nearValue", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->nearValue), ctx);
    }
    json->getProperty("farValue", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->farValue), ctx);
    }
    json->getProperty("pcfType", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->pcfType), ctx);
    }
    json->getProperty("bias", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bias), ctx);
    }
    json->getProperty("normalBias", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->normalBias), ctx);
    }
    json->getProperty("saturation", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->saturation), ctx);
    }
    json->getProperty("orthoSize", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->orthoSize), ctx);
    }
    json->getProperty("color", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->color), ctx);
    }
    json->getProperty("size", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->size), ctx);
    }
    json->getProperty("normal", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->normal), ctx);
    }
    json->getProperty("matLight", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->matLight), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Shadow_finalize)

static bool js_scene_Shadow_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::scene::Shadow* cobj = JSB_ALLOC(cc::scene::Shadow);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::scene::Shadow* cobj = JSB_ALLOC(cc::scene::Shadow);
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

    cc::scene::Shadow* cobj = JSB_ALLOC(cc::scene::Shadow);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->enabled), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->dirty), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->shadowMapDirty), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->fixedArea), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->shadowType), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->invisibleOcclusionRange), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->shadowDistance), nullptr);
    }
    if (argc > 7 && !args[7].isUndefined()) {
        ok &= sevalue_to_native(args[7], &(cobj->distance), nullptr);
    }
    if (argc > 8 && !args[8].isUndefined()) {
        ok &= sevalue_to_native(args[8], &(cobj->instancePass), nullptr);
    }
    if (argc > 9 && !args[9].isUndefined()) {
        ok &= sevalue_to_native(args[9], &(cobj->planarPass), nullptr);
    }
    if (argc > 10 && !args[10].isUndefined()) {
        ok &= sevalue_to_native(args[10], &(cobj->nearValue), nullptr);
    }
    if (argc > 11 && !args[11].isUndefined()) {
        ok &= sevalue_to_native(args[11], &(cobj->farValue), nullptr);
    }
    if (argc > 12 && !args[12].isUndefined()) {
        ok &= sevalue_to_native(args[12], &(cobj->pcfType), nullptr);
    }
    if (argc > 13 && !args[13].isUndefined()) {
        ok &= sevalue_to_native(args[13], &(cobj->bias), nullptr);
    }
    if (argc > 14 && !args[14].isUndefined()) {
        ok &= sevalue_to_native(args[14], &(cobj->normalBias), nullptr);
    }
    if (argc > 15 && !args[15].isUndefined()) {
        ok &= sevalue_to_native(args[15], &(cobj->saturation), nullptr);
    }
    if (argc > 16 && !args[16].isUndefined()) {
        ok &= sevalue_to_native(args[16], &(cobj->orthoSize), nullptr);
    }
    if (argc > 17 && !args[17].isUndefined()) {
        ok &= sevalue_to_native(args[17], &(cobj->color), nullptr);
    }
    if (argc > 18 && !args[18].isUndefined()) {
        ok &= sevalue_to_native(args[18], &(cobj->size), nullptr);
    }
    if (argc > 19 && !args[19].isUndefined()) {
        ok &= sevalue_to_native(args[19], &(cobj->normal), nullptr);
    }
    if (argc > 20 && !args[20].isUndefined()) {
        ok &= sevalue_to_native(args[20], &(cobj->matLight), nullptr);
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
SE_BIND_CTOR(js_scene_Shadow_constructor, __jsb_cc_scene_Shadow_class, js_cc_scene_Shadow_finalize)



static bool js_cc_scene_Shadow_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::Shadow>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::Shadow>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Shadow_finalize)

bool js_register_scene_Shadow(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Shadow", obj, nullptr, _SE(js_scene_Shadow_constructor));

    cls->defineProperty("enabled", _SE(js_scene_Shadow_get_enabled), _SE(js_scene_Shadow_set_enabled));
    cls->defineProperty("dirty", _SE(js_scene_Shadow_get_dirty), _SE(js_scene_Shadow_set_dirty));
    cls->defineProperty("shadowMapDirty", _SE(js_scene_Shadow_get_shadowMapDirty), _SE(js_scene_Shadow_set_shadowMapDirty));
    cls->defineProperty("fixedArea", _SE(js_scene_Shadow_get_fixedArea), _SE(js_scene_Shadow_set_fixedArea));
    cls->defineProperty("shadowType", _SE(js_scene_Shadow_get_shadowType), _SE(js_scene_Shadow_set_shadowType));
    cls->defineProperty("invisibleOcclusionRange", _SE(js_scene_Shadow_get_invisibleOcclusionRange), _SE(js_scene_Shadow_set_invisibleOcclusionRange));
    cls->defineProperty("shadowDistance", _SE(js_scene_Shadow_get_shadowDistance), _SE(js_scene_Shadow_set_shadowDistance));
    cls->defineProperty("distance", _SE(js_scene_Shadow_get_distance), _SE(js_scene_Shadow_set_distance));
    cls->defineProperty("instancePass", _SE(js_scene_Shadow_get_instancePass), _SE(js_scene_Shadow_set_instancePass));
    cls->defineProperty("planarPass", _SE(js_scene_Shadow_get_planarPass), _SE(js_scene_Shadow_set_planarPass));
    cls->defineProperty("nearValue", _SE(js_scene_Shadow_get_nearValue), _SE(js_scene_Shadow_set_nearValue));
    cls->defineProperty("farValue", _SE(js_scene_Shadow_get_farValue), _SE(js_scene_Shadow_set_farValue));
    cls->defineProperty("pcfType", _SE(js_scene_Shadow_get_pcfType), _SE(js_scene_Shadow_set_pcfType));
    cls->defineProperty("bias", _SE(js_scene_Shadow_get_bias), _SE(js_scene_Shadow_set_bias));
    cls->defineProperty("normalBias", _SE(js_scene_Shadow_get_normalBias), _SE(js_scene_Shadow_set_normalBias));
    cls->defineProperty("saturation", _SE(js_scene_Shadow_get_saturation), _SE(js_scene_Shadow_set_saturation));
    cls->defineProperty("orthoSize", _SE(js_scene_Shadow_get_orthoSize), _SE(js_scene_Shadow_set_orthoSize));
    cls->defineProperty("color", _SE(js_scene_Shadow_get_color), _SE(js_scene_Shadow_set_color));
    cls->defineProperty("size", _SE(js_scene_Shadow_get_size), _SE(js_scene_Shadow_set_size));
    cls->defineProperty("normal", _SE(js_scene_Shadow_get_normal), _SE(js_scene_Shadow_set_normal));
    cls->defineProperty("matLight", _SE(js_scene_Shadow_get_matLight), _SE(js_scene_Shadow_set_matLight));
    cls->defineFinalizeFunction(_SE(js_cc_scene_Shadow_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Shadow>(cls);

    __jsb_cc_scene_Shadow_proto = cls->getProto();
    __jsb_cc_scene_Shadow_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Skybox_proto = nullptr;
se::Class* __jsb_cc_scene_Skybox_class = nullptr;

static bool js_scene_Skybox_get_enabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_get_enabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->enabled, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->enabled, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Skybox_get_enabled)

static bool js_scene_Skybox_set_enabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_set_enabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->enabled, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Skybox_set_enabled : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Skybox_set_enabled)

static bool js_scene_Skybox_get_isRGBE(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_get_isRGBE : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isRGBE, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isRGBE, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Skybox_get_isRGBE)

static bool js_scene_Skybox_set_isRGBE(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_set_isRGBE : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isRGBE, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Skybox_set_isRGBE : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Skybox_set_isRGBE)

static bool js_scene_Skybox_get_useIBL(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_get_useIBL : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->useIBL, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->useIBL, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Skybox_get_useIBL)

static bool js_scene_Skybox_set_useIBL(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_set_useIBL : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->useIBL, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Skybox_set_useIBL : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Skybox_set_useIBL)

static bool js_scene_Skybox_get_useHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_get_useHDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->useHDR, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->useHDR, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Skybox_get_useHDR)

static bool js_scene_Skybox_set_useHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_set_useHDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->useHDR, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Skybox_set_useHDR : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Skybox_set_useHDR)

static bool js_scene_Skybox_get_useDiffuseMap(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_get_useDiffuseMap : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->useDiffuseMap, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->useDiffuseMap, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Skybox_get_useDiffuseMap)

static bool js_scene_Skybox_set_useDiffuseMap(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_set_useDiffuseMap : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->useDiffuseMap, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Skybox_set_useDiffuseMap : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Skybox_set_useDiffuseMap)

static bool js_scene_Skybox_get_model(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_get_model : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->model, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->model, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Skybox_get_model)

static bool js_scene_Skybox_set_model(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_set_model : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->model, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Skybox_set_model : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Skybox_set_model)


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::Skybox * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::Skybox*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("enabled", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->enabled), ctx);
    }
    json->getProperty("isRGBE", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isRGBE), ctx);
    }
    json->getProperty("useIBL", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->useIBL), ctx);
    }
    json->getProperty("useHDR", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->useHDR), ctx);
    }
    json->getProperty("useDiffuseMap", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->useDiffuseMap), ctx);
    }
    json->getProperty("model", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->model), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Skybox_finalize)

static bool js_scene_Skybox_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::scene::Skybox* cobj = JSB_ALLOC(cc::scene::Skybox);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::scene::Skybox* cobj = JSB_ALLOC(cc::scene::Skybox);
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

    cc::scene::Skybox* cobj = JSB_ALLOC(cc::scene::Skybox);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->enabled), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->isRGBE), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->useIBL), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->useHDR), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->useDiffuseMap), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->model), nullptr);
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
SE_BIND_CTOR(js_scene_Skybox_constructor, __jsb_cc_scene_Skybox_class, js_cc_scene_Skybox_finalize)



static bool js_cc_scene_Skybox_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::Skybox>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Skybox_finalize)

bool js_register_scene_Skybox(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Skybox", obj, nullptr, _SE(js_scene_Skybox_constructor));

    cls->defineProperty("enabled", _SE(js_scene_Skybox_get_enabled), _SE(js_scene_Skybox_set_enabled));
    cls->defineProperty("isRGBE", _SE(js_scene_Skybox_get_isRGBE), _SE(js_scene_Skybox_set_isRGBE));
    cls->defineProperty("useIBL", _SE(js_scene_Skybox_get_useIBL), _SE(js_scene_Skybox_set_useIBL));
    cls->defineProperty("useHDR", _SE(js_scene_Skybox_get_useHDR), _SE(js_scene_Skybox_set_useHDR));
    cls->defineProperty("useDiffuseMap", _SE(js_scene_Skybox_get_useDiffuseMap), _SE(js_scene_Skybox_set_useDiffuseMap));
    cls->defineProperty("model", _SE(js_scene_Skybox_get_model), _SE(js_scene_Skybox_set_model));
    cls->defineFinalizeFunction(_SE(js_cc_scene_Skybox_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Skybox>(cls);

    __jsb_cc_scene_Skybox_proto = cls->getProto();
    __jsb_cc_scene_Skybox_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Ambient_proto = nullptr;
se::Class* __jsb_cc_scene_Ambient_class = nullptr;

static bool js_scene_Ambient_get_enabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Ambient>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Ambient_get_enabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->enabled, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->enabled, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Ambient_get_enabled)

static bool js_scene_Ambient_set_enabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Ambient>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Ambient_set_enabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->enabled, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Ambient_set_enabled : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Ambient_set_enabled)

static bool js_scene_Ambient_get_skyIllum(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Ambient>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Ambient_get_skyIllum : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->skyIllum, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->skyIllum, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Ambient_get_skyIllum)

static bool js_scene_Ambient_set_skyIllum(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Ambient>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Ambient_set_skyIllum : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->skyIllum, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Ambient_set_skyIllum : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Ambient_set_skyIllum)

static bool js_scene_Ambient_get_skyColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Ambient>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Ambient_get_skyColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->skyColor, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->skyColor, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Ambient_get_skyColor)

static bool js_scene_Ambient_set_skyColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Ambient>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Ambient_set_skyColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->skyColor, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Ambient_set_skyColor : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Ambient_set_skyColor)

static bool js_scene_Ambient_get_groundAlbedo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Ambient>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Ambient_get_groundAlbedo : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->groundAlbedo, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->groundAlbedo, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Ambient_get_groundAlbedo)

static bool js_scene_Ambient_set_groundAlbedo(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Ambient>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Ambient_set_groundAlbedo : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->groundAlbedo, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Ambient_set_groundAlbedo : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Ambient_set_groundAlbedo)


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::Ambient * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::Ambient*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("enabled", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->enabled), ctx);
    }
    json->getProperty("skyIllum", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->skyIllum), ctx);
    }
    json->getProperty("skyColor", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->skyColor), ctx);
    }
    json->getProperty("groundAlbedo", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->groundAlbedo), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Ambient_finalize)

static bool js_scene_Ambient_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::scene::Ambient* cobj = JSB_ALLOC(cc::scene::Ambient);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::scene::Ambient* cobj = JSB_ALLOC(cc::scene::Ambient);
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

    cc::scene::Ambient* cobj = JSB_ALLOC(cc::scene::Ambient);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->enabled), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->skyIllum), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->skyColor), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->groundAlbedo), nullptr);
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
SE_BIND_CTOR(js_scene_Ambient_constructor, __jsb_cc_scene_Ambient_class, js_cc_scene_Ambient_finalize)



static bool js_cc_scene_Ambient_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::Ambient>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::Ambient>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Ambient_finalize)

bool js_register_scene_Ambient(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Ambient", obj, nullptr, _SE(js_scene_Ambient_constructor));

    cls->defineProperty("enabled", _SE(js_scene_Ambient_get_enabled), _SE(js_scene_Ambient_set_enabled));
    cls->defineProperty("skyIllum", _SE(js_scene_Ambient_get_skyIllum), _SE(js_scene_Ambient_set_skyIllum));
    cls->defineProperty("skyColor", _SE(js_scene_Ambient_get_skyColor), _SE(js_scene_Ambient_set_skyColor));
    cls->defineProperty("groundAlbedo", _SE(js_scene_Ambient_get_groundAlbedo), _SE(js_scene_Ambient_set_groundAlbedo));
    cls->defineFinalizeFunction(_SE(js_cc_scene_Ambient_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Ambient>(cls);

    __jsb_cc_scene_Ambient_proto = cls->getProto();
    __jsb_cc_scene_Ambient_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_OctreeInfo_proto = nullptr;
se::Class* __jsb_cc_scene_OctreeInfo_class = nullptr;

static bool js_scene_OctreeInfo_get_enabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_get_enabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->enabled, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->enabled, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_OctreeInfo_get_enabled)

static bool js_scene_OctreeInfo_set_enabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_set_enabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->enabled, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_OctreeInfo_set_enabled : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_OctreeInfo_set_enabled)

static bool js_scene_OctreeInfo_get_minPos(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_get_minPos : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->minPos, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->minPos, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_OctreeInfo_get_minPos)

static bool js_scene_OctreeInfo_set_minPos(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_set_minPos : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->minPos, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_OctreeInfo_set_minPos : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_OctreeInfo_set_minPos)

static bool js_scene_OctreeInfo_get_maxPos(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_get_maxPos : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxPos, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->maxPos, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_OctreeInfo_get_maxPos)

static bool js_scene_OctreeInfo_set_maxPos(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_set_maxPos : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxPos, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_OctreeInfo_set_maxPos : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_OctreeInfo_set_maxPos)

static bool js_scene_OctreeInfo_get_depth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_get_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depth, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->depth, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_OctreeInfo_get_depth)

static bool js_scene_OctreeInfo_set_depth(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_set_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depth, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_OctreeInfo_set_depth : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_OctreeInfo_set_depth)


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::OctreeInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::OctreeInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("enabled", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->enabled), ctx);
    }
    json->getProperty("minPos", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->minPos), ctx);
    }
    json->getProperty("maxPos", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxPos), ctx);
    }
    json->getProperty("depth", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depth), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_OctreeInfo_finalize)

static bool js_scene_OctreeInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::scene::OctreeInfo* cobj = JSB_ALLOC(cc::scene::OctreeInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::scene::OctreeInfo* cobj = JSB_ALLOC(cc::scene::OctreeInfo);
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

    cc::scene::OctreeInfo* cobj = JSB_ALLOC(cc::scene::OctreeInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->enabled), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->minPos), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->maxPos), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->depth), nullptr);
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
SE_BIND_CTOR(js_scene_OctreeInfo_constructor, __jsb_cc_scene_OctreeInfo_class, js_cc_scene_OctreeInfo_finalize)



static bool js_cc_scene_OctreeInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::OctreeInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_OctreeInfo_finalize)

bool js_register_scene_OctreeInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("OctreeInfo", obj, nullptr, _SE(js_scene_OctreeInfo_constructor));

    cls->defineProperty("enabled", _SE(js_scene_OctreeInfo_get_enabled), _SE(js_scene_OctreeInfo_set_enabled));
    cls->defineProperty("minPos", _SE(js_scene_OctreeInfo_get_minPos), _SE(js_scene_OctreeInfo_set_minPos));
    cls->defineProperty("maxPos", _SE(js_scene_OctreeInfo_get_maxPos), _SE(js_scene_OctreeInfo_set_maxPos));
    cls->defineProperty("depth", _SE(js_scene_OctreeInfo_get_depth), _SE(js_scene_OctreeInfo_set_depth));
    cls->defineFinalizeFunction(_SE(js_cc_scene_OctreeInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::OctreeInfo>(cls);

    __jsb_cc_scene_OctreeInfo_proto = cls->getProto();
    __jsb_cc_scene_OctreeInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_PipelineSharedSceneData_proto = nullptr;
se::Class* __jsb_cc_scene_PipelineSharedSceneData_class = nullptr;

static bool js_scene_PipelineSharedSceneData_get_isHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_isHDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isHDR, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->isHDR, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_isHDR)

static bool js_scene_PipelineSharedSceneData_set_isHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_isHDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isHDR, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_isHDR : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_isHDR)

static bool js_scene_PipelineSharedSceneData_get_shadingScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_shadingScale : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->shadingScale, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->shadingScale, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_shadingScale)

static bool js_scene_PipelineSharedSceneData_set_shadingScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_shadingScale : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->shadingScale, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_shadingScale : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_shadingScale)

static bool js_scene_PipelineSharedSceneData_get_ambient(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_ambient : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->ambient, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->ambient, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_ambient)

static bool js_scene_PipelineSharedSceneData_set_ambient(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_ambient : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->ambient, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_ambient : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_ambient)

static bool js_scene_PipelineSharedSceneData_get_shadow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_shadow : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->shadow, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->shadow, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_shadow)

static bool js_scene_PipelineSharedSceneData_set_shadow(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_shadow : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->shadow, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_shadow : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_shadow)

static bool js_scene_PipelineSharedSceneData_get_skybox(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_skybox : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->skybox, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->skybox, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_skybox)

static bool js_scene_PipelineSharedSceneData_set_skybox(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_skybox : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->skybox, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_skybox : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_skybox)

static bool js_scene_PipelineSharedSceneData_get_fog(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_fog : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->fog, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->fog, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_fog)

static bool js_scene_PipelineSharedSceneData_set_fog(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_fog : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->fog, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_fog : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_fog)

static bool js_scene_PipelineSharedSceneData_get_octree(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_octree : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->octree, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->octree, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_octree)

static bool js_scene_PipelineSharedSceneData_set_octree(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_octree : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->octree, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_octree : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_octree)

static bool js_scene_PipelineSharedSceneData_get_geometryRendererPasses(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_geometryRendererPasses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->geometryRendererPasses, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->geometryRendererPasses, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_geometryRendererPasses)

static bool js_scene_PipelineSharedSceneData_set_geometryRendererPasses(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_geometryRendererPasses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->geometryRendererPasses, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_geometryRendererPasses : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_geometryRendererPasses)

static bool js_scene_PipelineSharedSceneData_get_geometryRendererShaders(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_geometryRendererShaders : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->geometryRendererShaders, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->geometryRendererShaders, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_geometryRendererShaders)

static bool js_scene_PipelineSharedSceneData_set_geometryRendererShaders(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_geometryRendererShaders : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->geometryRendererShaders, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_geometryRendererShaders : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_geometryRendererShaders)

static bool js_scene_PipelineSharedSceneData_get_occlusionQueryInputAssembler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_occlusionQueryInputAssembler : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->occlusionQueryInputAssembler, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->occlusionQueryInputAssembler, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_occlusionQueryInputAssembler)

static bool js_scene_PipelineSharedSceneData_set_occlusionQueryInputAssembler(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_occlusionQueryInputAssembler : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->occlusionQueryInputAssembler, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_occlusionQueryInputAssembler : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_occlusionQueryInputAssembler)

static bool js_scene_PipelineSharedSceneData_get_occlusionQueryPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_occlusionQueryPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->occlusionQueryPass, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->occlusionQueryPass, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_occlusionQueryPass)

static bool js_scene_PipelineSharedSceneData_set_occlusionQueryPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_occlusionQueryPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->occlusionQueryPass, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_occlusionQueryPass : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_occlusionQueryPass)

static bool js_scene_PipelineSharedSceneData_get_occlusionQueryShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_occlusionQueryShader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->occlusionQueryShader, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->occlusionQueryShader, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_occlusionQueryShader)

static bool js_scene_PipelineSharedSceneData_set_occlusionQueryShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_occlusionQueryShader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->occlusionQueryShader, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_occlusionQueryShader : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_occlusionQueryShader)

static bool js_scene_PipelineSharedSceneData_get_deferredLightPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_deferredLightPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->deferredLightPass, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->deferredLightPass, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_deferredLightPass)

static bool js_scene_PipelineSharedSceneData_set_deferredLightPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_deferredLightPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->deferredLightPass, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_deferredLightPass : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_deferredLightPass)

static bool js_scene_PipelineSharedSceneData_get_deferredLightPassShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_deferredLightPassShader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->deferredLightPassShader, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->deferredLightPassShader, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_deferredLightPassShader)

static bool js_scene_PipelineSharedSceneData_set_deferredLightPassShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_deferredLightPassShader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->deferredLightPassShader, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_deferredLightPassShader : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_deferredLightPassShader)

static bool js_scene_PipelineSharedSceneData_get_bloomPrefilterPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_bloomPrefilterPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bloomPrefilterPass, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->bloomPrefilterPass, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_bloomPrefilterPass)

static bool js_scene_PipelineSharedSceneData_set_bloomPrefilterPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_bloomPrefilterPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bloomPrefilterPass, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_bloomPrefilterPass : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_bloomPrefilterPass)

static bool js_scene_PipelineSharedSceneData_get_bloomPrefilterPassShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_bloomPrefilterPassShader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bloomPrefilterPassShader, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->bloomPrefilterPassShader, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_bloomPrefilterPassShader)

static bool js_scene_PipelineSharedSceneData_set_bloomPrefilterPassShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_bloomPrefilterPassShader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bloomPrefilterPassShader, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_bloomPrefilterPassShader : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_bloomPrefilterPassShader)

static bool js_scene_PipelineSharedSceneData_get_bloomDownsamplePass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_bloomDownsamplePass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bloomDownsamplePass, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->bloomDownsamplePass, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_bloomDownsamplePass)

static bool js_scene_PipelineSharedSceneData_set_bloomDownsamplePass(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_bloomDownsamplePass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bloomDownsamplePass, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_bloomDownsamplePass : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_bloomDownsamplePass)

static bool js_scene_PipelineSharedSceneData_get_bloomDownsamplePassShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_bloomDownsamplePassShader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bloomDownsamplePassShader, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->bloomDownsamplePassShader, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_bloomDownsamplePassShader)

static bool js_scene_PipelineSharedSceneData_set_bloomDownsamplePassShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_bloomDownsamplePassShader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bloomDownsamplePassShader, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_bloomDownsamplePassShader : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_bloomDownsamplePassShader)

static bool js_scene_PipelineSharedSceneData_get_bloomUpsamplePass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_bloomUpsamplePass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bloomUpsamplePass, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->bloomUpsamplePass, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_bloomUpsamplePass)

static bool js_scene_PipelineSharedSceneData_set_bloomUpsamplePass(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_bloomUpsamplePass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bloomUpsamplePass, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_bloomUpsamplePass : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_bloomUpsamplePass)

static bool js_scene_PipelineSharedSceneData_get_bloomUpsamplePassShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_bloomUpsamplePassShader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bloomUpsamplePassShader, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->bloomUpsamplePassShader, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_bloomUpsamplePassShader)

static bool js_scene_PipelineSharedSceneData_set_bloomUpsamplePassShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_bloomUpsamplePassShader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bloomUpsamplePassShader, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_bloomUpsamplePassShader : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_bloomUpsamplePassShader)

static bool js_scene_PipelineSharedSceneData_get_bloomCombinePass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_bloomCombinePass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bloomCombinePass, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->bloomCombinePass, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_bloomCombinePass)

static bool js_scene_PipelineSharedSceneData_set_bloomCombinePass(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_bloomCombinePass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bloomCombinePass, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_bloomCombinePass : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_bloomCombinePass)

static bool js_scene_PipelineSharedSceneData_get_bloomCombinePassShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_bloomCombinePassShader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bloomCombinePassShader, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->bloomCombinePassShader, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_bloomCombinePassShader)

static bool js_scene_PipelineSharedSceneData_set_bloomCombinePassShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_bloomCombinePassShader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bloomCombinePassShader, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_bloomCombinePassShader : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_bloomCombinePassShader)

static bool js_scene_PipelineSharedSceneData_get_pipelinePostPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_pipelinePostPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->pipelinePostPass, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->pipelinePostPass, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_pipelinePostPass)

static bool js_scene_PipelineSharedSceneData_set_pipelinePostPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_pipelinePostPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->pipelinePostPass, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_pipelinePostPass : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_pipelinePostPass)

static bool js_scene_PipelineSharedSceneData_get_pipelinePostPassShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_get_pipelinePostPassShader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->pipelinePostPassShader, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->pipelinePostPassShader, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PipelineSharedSceneData_get_pipelinePostPassShader)

static bool js_scene_PipelineSharedSceneData_set_pipelinePostPassShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PipelineSharedSceneData_set_pipelinePostPassShader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->pipelinePostPassShader, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PipelineSharedSceneData_set_pipelinePostPassShader : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PipelineSharedSceneData_set_pipelinePostPassShader)


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::PipelineSharedSceneData * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::PipelineSharedSceneData*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("isHDR", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isHDR), ctx);
    }
    json->getProperty("shadingScale", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->shadingScale), ctx);
    }
    json->getProperty("ambient", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->ambient), ctx);
    }
    json->getProperty("shadow", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->shadow), ctx);
    }
    json->getProperty("skybox", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->skybox), ctx);
    }
    json->getProperty("fog", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->fog), ctx);
    }
    json->getProperty("octree", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->octree), ctx);
    }
    json->getProperty("geometryRendererPasses", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->geometryRendererPasses), ctx);
    }
    json->getProperty("geometryRendererShaders", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->geometryRendererShaders), ctx);
    }
    json->getProperty("occlusionQueryInputAssembler", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->occlusionQueryInputAssembler), ctx);
    }
    json->getProperty("occlusionQueryPass", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->occlusionQueryPass), ctx);
    }
    json->getProperty("occlusionQueryShader", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->occlusionQueryShader), ctx);
    }
    json->getProperty("deferredLightPass", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->deferredLightPass), ctx);
    }
    json->getProperty("deferredLightPassShader", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->deferredLightPassShader), ctx);
    }
    json->getProperty("bloomPrefilterPass", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bloomPrefilterPass), ctx);
    }
    json->getProperty("bloomPrefilterPassShader", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bloomPrefilterPassShader), ctx);
    }
    json->getProperty("bloomDownsamplePass", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bloomDownsamplePass), ctx);
    }
    json->getProperty("bloomDownsamplePassShader", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bloomDownsamplePassShader), ctx);
    }
    json->getProperty("bloomUpsamplePass", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bloomUpsamplePass), ctx);
    }
    json->getProperty("bloomUpsamplePassShader", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bloomUpsamplePassShader), ctx);
    }
    json->getProperty("bloomCombinePass", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bloomCombinePass), ctx);
    }
    json->getProperty("bloomCombinePassShader", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bloomCombinePassShader), ctx);
    }
    json->getProperty("pipelinePostPass", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->pipelinePostPass), ctx);
    }
    json->getProperty("pipelinePostPassShader", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->pipelinePostPassShader), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_PipelineSharedSceneData_finalize)

static bool js_scene_PipelineSharedSceneData_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::scene::PipelineSharedSceneData* cobj = JSB_ALLOC(cc::scene::PipelineSharedSceneData);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::scene::PipelineSharedSceneData* cobj = JSB_ALLOC(cc::scene::PipelineSharedSceneData);
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

    cc::scene::PipelineSharedSceneData* cobj = JSB_ALLOC(cc::scene::PipelineSharedSceneData);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->isHDR), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->shadingScale), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->ambient), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->shadow), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->skybox), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->fog), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->octree), nullptr);
    }
    if (argc > 7 && !args[7].isUndefined()) {
        ok &= sevalue_to_native(args[7], &(cobj->geometryRendererPasses), nullptr);
    }
    if (argc > 8 && !args[8].isUndefined()) {
        ok &= sevalue_to_native(args[8], &(cobj->geometryRendererShaders), nullptr);
    }
    if (argc > 9 && !args[9].isUndefined()) {
        ok &= sevalue_to_native(args[9], &(cobj->occlusionQueryInputAssembler), nullptr);
    }
    if (argc > 10 && !args[10].isUndefined()) {
        ok &= sevalue_to_native(args[10], &(cobj->occlusionQueryPass), nullptr);
    }
    if (argc > 11 && !args[11].isUndefined()) {
        ok &= sevalue_to_native(args[11], &(cobj->occlusionQueryShader), nullptr);
    }
    if (argc > 12 && !args[12].isUndefined()) {
        ok &= sevalue_to_native(args[12], &(cobj->deferredLightPass), nullptr);
    }
    if (argc > 13 && !args[13].isUndefined()) {
        ok &= sevalue_to_native(args[13], &(cobj->deferredLightPassShader), nullptr);
    }
    if (argc > 14 && !args[14].isUndefined()) {
        ok &= sevalue_to_native(args[14], &(cobj->bloomPrefilterPass), nullptr);
    }
    if (argc > 15 && !args[15].isUndefined()) {
        ok &= sevalue_to_native(args[15], &(cobj->bloomPrefilterPassShader), nullptr);
    }
    if (argc > 16 && !args[16].isUndefined()) {
        ok &= sevalue_to_native(args[16], &(cobj->bloomDownsamplePass), nullptr);
    }
    if (argc > 17 && !args[17].isUndefined()) {
        ok &= sevalue_to_native(args[17], &(cobj->bloomDownsamplePassShader), nullptr);
    }
    if (argc > 18 && !args[18].isUndefined()) {
        ok &= sevalue_to_native(args[18], &(cobj->bloomUpsamplePass), nullptr);
    }
    if (argc > 19 && !args[19].isUndefined()) {
        ok &= sevalue_to_native(args[19], &(cobj->bloomUpsamplePassShader), nullptr);
    }
    if (argc > 20 && !args[20].isUndefined()) {
        ok &= sevalue_to_native(args[20], &(cobj->bloomCombinePass), nullptr);
    }
    if (argc > 21 && !args[21].isUndefined()) {
        ok &= sevalue_to_native(args[21], &(cobj->bloomCombinePassShader), nullptr);
    }
    if (argc > 22 && !args[22].isUndefined()) {
        ok &= sevalue_to_native(args[22], &(cobj->pipelinePostPass), nullptr);
    }
    if (argc > 23 && !args[23].isUndefined()) {
        ok &= sevalue_to_native(args[23], &(cobj->pipelinePostPassShader), nullptr);
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
SE_BIND_CTOR(js_scene_PipelineSharedSceneData_constructor, __jsb_cc_scene_PipelineSharedSceneData_class, js_cc_scene_PipelineSharedSceneData_finalize)



static bool js_cc_scene_PipelineSharedSceneData_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::PipelineSharedSceneData>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_PipelineSharedSceneData_finalize)

bool js_register_scene_PipelineSharedSceneData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("PipelineSharedSceneData", obj, nullptr, _SE(js_scene_PipelineSharedSceneData_constructor));

    cls->defineProperty("isHDR", _SE(js_scene_PipelineSharedSceneData_get_isHDR), _SE(js_scene_PipelineSharedSceneData_set_isHDR));
    cls->defineProperty("shadingScale", _SE(js_scene_PipelineSharedSceneData_get_shadingScale), _SE(js_scene_PipelineSharedSceneData_set_shadingScale));
    cls->defineProperty("ambient", _SE(js_scene_PipelineSharedSceneData_get_ambient), _SE(js_scene_PipelineSharedSceneData_set_ambient));
    cls->defineProperty("shadow", _SE(js_scene_PipelineSharedSceneData_get_shadow), _SE(js_scene_PipelineSharedSceneData_set_shadow));
    cls->defineProperty("skybox", _SE(js_scene_PipelineSharedSceneData_get_skybox), _SE(js_scene_PipelineSharedSceneData_set_skybox));
    cls->defineProperty("fog", _SE(js_scene_PipelineSharedSceneData_get_fog), _SE(js_scene_PipelineSharedSceneData_set_fog));
    cls->defineProperty("octree", _SE(js_scene_PipelineSharedSceneData_get_octree), _SE(js_scene_PipelineSharedSceneData_set_octree));
    cls->defineProperty("geometryRendererPasses", _SE(js_scene_PipelineSharedSceneData_get_geometryRendererPasses), _SE(js_scene_PipelineSharedSceneData_set_geometryRendererPasses));
    cls->defineProperty("geometryRendererShaders", _SE(js_scene_PipelineSharedSceneData_get_geometryRendererShaders), _SE(js_scene_PipelineSharedSceneData_set_geometryRendererShaders));
    cls->defineProperty("occlusionQueryInputAssembler", _SE(js_scene_PipelineSharedSceneData_get_occlusionQueryInputAssembler), _SE(js_scene_PipelineSharedSceneData_set_occlusionQueryInputAssembler));
    cls->defineProperty("occlusionQueryPass", _SE(js_scene_PipelineSharedSceneData_get_occlusionQueryPass), _SE(js_scene_PipelineSharedSceneData_set_occlusionQueryPass));
    cls->defineProperty("occlusionQueryShader", _SE(js_scene_PipelineSharedSceneData_get_occlusionQueryShader), _SE(js_scene_PipelineSharedSceneData_set_occlusionQueryShader));
    cls->defineProperty("deferredLightPass", _SE(js_scene_PipelineSharedSceneData_get_deferredLightPass), _SE(js_scene_PipelineSharedSceneData_set_deferredLightPass));
    cls->defineProperty("deferredLightPassShader", _SE(js_scene_PipelineSharedSceneData_get_deferredLightPassShader), _SE(js_scene_PipelineSharedSceneData_set_deferredLightPassShader));
    cls->defineProperty("bloomPrefilterPass", _SE(js_scene_PipelineSharedSceneData_get_bloomPrefilterPass), _SE(js_scene_PipelineSharedSceneData_set_bloomPrefilterPass));
    cls->defineProperty("bloomPrefilterPassShader", _SE(js_scene_PipelineSharedSceneData_get_bloomPrefilterPassShader), _SE(js_scene_PipelineSharedSceneData_set_bloomPrefilterPassShader));
    cls->defineProperty("bloomDownsamplePass", _SE(js_scene_PipelineSharedSceneData_get_bloomDownsamplePass), _SE(js_scene_PipelineSharedSceneData_set_bloomDownsamplePass));
    cls->defineProperty("bloomDownsamplePassShader", _SE(js_scene_PipelineSharedSceneData_get_bloomDownsamplePassShader), _SE(js_scene_PipelineSharedSceneData_set_bloomDownsamplePassShader));
    cls->defineProperty("bloomUpsamplePass", _SE(js_scene_PipelineSharedSceneData_get_bloomUpsamplePass), _SE(js_scene_PipelineSharedSceneData_set_bloomUpsamplePass));
    cls->defineProperty("bloomUpsamplePassShader", _SE(js_scene_PipelineSharedSceneData_get_bloomUpsamplePassShader), _SE(js_scene_PipelineSharedSceneData_set_bloomUpsamplePassShader));
    cls->defineProperty("bloomCombinePass", _SE(js_scene_PipelineSharedSceneData_get_bloomCombinePass), _SE(js_scene_PipelineSharedSceneData_set_bloomCombinePass));
    cls->defineProperty("bloomCombinePassShader", _SE(js_scene_PipelineSharedSceneData_get_bloomCombinePassShader), _SE(js_scene_PipelineSharedSceneData_set_bloomCombinePassShader));
    cls->defineProperty("pipelinePostPass", _SE(js_scene_PipelineSharedSceneData_get_pipelinePostPass), _SE(js_scene_PipelineSharedSceneData_set_pipelinePostPass));
    cls->defineProperty("pipelinePostPassShader", _SE(js_scene_PipelineSharedSceneData_get_pipelinePostPassShader), _SE(js_scene_PipelineSharedSceneData_set_pipelinePostPassShader));
    cls->defineFinalizeFunction(_SE(js_cc_scene_PipelineSharedSceneData_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::PipelineSharedSceneData>(cls);

    __jsb_cc_scene_PipelineSharedSceneData_proto = cls->getProto();
    __jsb_cc_scene_PipelineSharedSceneData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Root_proto = nullptr;
se::Class* __jsb_cc_scene_Root_class = nullptr;

static bool js_scene_Root_get_cumulativeTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_get_cumulativeTime : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->cumulativeTime, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->cumulativeTime, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Root_get_cumulativeTime)

static bool js_scene_Root_set_cumulativeTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_set_cumulativeTime : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->cumulativeTime, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Root_set_cumulativeTime : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Root_set_cumulativeTime)

static bool js_scene_Root_get_frameTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_get_frameTime : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->frameTime, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->frameTime, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Root_get_frameTime)

static bool js_scene_Root_set_frameTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_set_frameTime : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->frameTime, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Root_set_frameTime : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Root_set_frameTime)


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::Root * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::Root*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("cumulativeTime", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->cumulativeTime), ctx);
    }
    json->getProperty("frameTime", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->frameTime), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Root_finalize)

static bool js_scene_Root_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::scene::Root* cobj = JSB_ALLOC(cc::scene::Root);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::scene::Root* cobj = JSB_ALLOC(cc::scene::Root);
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

    cc::scene::Root* cobj = JSB_ALLOC(cc::scene::Root);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->cumulativeTime), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->frameTime), nullptr);
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
SE_BIND_CTOR(js_scene_Root_constructor, __jsb_cc_scene_Root_class, js_cc_scene_Root_finalize)



static bool js_cc_scene_Root_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::Root>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::Root>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Root_finalize)

bool js_register_scene_Root(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Root", obj, nullptr, _SE(js_scene_Root_constructor));

    cls->defineProperty("cumulativeTime", _SE(js_scene_Root_get_cumulativeTime), _SE(js_scene_Root_set_cumulativeTime));
    cls->defineProperty("frameTime", _SE(js_scene_Root_get_frameTime), _SE(js_scene_Root_set_frameTime));
    cls->defineFinalizeFunction(_SE(js_cc_scene_Root_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Root>(cls);

    __jsb_cc_scene_Root_proto = cls->getProto();
    __jsb_cc_scene_Root_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_SubModel_proto = nullptr;
se::Class* __jsb_cc_scene_SubModel_class = nullptr;

static bool js_scene_SubModel_getId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_getId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_getId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_getId)

static bool js_scene_SubModel_getOwner(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_getOwner : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Model* result = cobj->getOwner();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_getOwner : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_getOwner)

static bool js_scene_SubModel_getPass(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_getPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_getPass : Error processing arguments");
        cc::scene::Pass* result = cobj->getPass(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_getPass : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_getPass)

static bool js_scene_SubModel_getPasses(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_getPasses : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::scene::Pass *>& result = cobj->getPasses();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_getPasses : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_getPasses)

static bool js_scene_SubModel_getPlanarInstanceShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_getPlanarInstanceShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Shader* result = cobj->getPlanarInstanceShader();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_getPlanarInstanceShader : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_getPlanarInstanceShader)

static bool js_scene_SubModel_getPlanarShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_getPlanarShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Shader* result = cobj->getPlanarShader();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_getPlanarShader : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_getPlanarShader)

static bool js_scene_SubModel_getPriority(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_getPriority : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getPriority());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_getPriority : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_getPriority)

static bool js_scene_SubModel_getShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_getShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_getShader : Error processing arguments");
        cc::gfx::Shader* result = cobj->getShader(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_getShader : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_getShader)

static bool js_scene_SubModel_getShaders(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_getShaders : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::vector<cc::gfx::Shader *>& result = cobj->getShaders();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_getShaders : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_getShaders)

static bool js_scene_SubModel_getWorldBoundDescriptorSet(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_getWorldBoundDescriptorSet : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::DescriptorSet* result = cobj->getWorldBoundDescriptorSet();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_getWorldBoundDescriptorSet : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_getWorldBoundDescriptorSet)

static bool js_scene_SubModel_setDescriptorSet(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_setDescriptorSet : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::DescriptorSet*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_setDescriptorSet : Error processing arguments");
        cobj->setDescriptorSet(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_setDescriptorSet)

static bool js_scene_SubModel_setInputAssembler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_setInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::InputAssembler*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_setInputAssembler : Error processing arguments");
        cobj->setInputAssembler(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_setInputAssembler)

static bool js_scene_SubModel_setOwner(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_setOwner : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Model*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_setOwner : Error processing arguments");
        cobj->setOwner(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_setOwner)

static bool js_scene_SubModel_setPasses(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_setPasses : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::scene::Pass *>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_setPasses : Error processing arguments");
        cobj->setPasses(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_setPasses)

static bool js_scene_SubModel_setPlanarInstanceShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_setPlanarInstanceShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Shader*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_setPlanarInstanceShader : Error processing arguments");
        cobj->setPlanarInstanceShader(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_setPlanarInstanceShader)

static bool js_scene_SubModel_setPlanarShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_setPlanarShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Shader*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_setPlanarShader : Error processing arguments");
        cobj->setPlanarShader(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_setPlanarShader)

static bool js_scene_SubModel_setPriority(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_setPriority : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::RenderPriority, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_setPriority : Error processing arguments");
        cobj->setPriority(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_setPriority)

static bool js_scene_SubModel_setShaders(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_setShaders : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::gfx::Shader *>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_setShaders : Error processing arguments");
        cobj->setShaders(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_setShaders)

static bool js_scene_SubModel_setWorldBoundDescriptorSet(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_setWorldBoundDescriptorSet : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::DescriptorSet*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_setWorldBoundDescriptorSet : Error processing arguments");
        cobj->setWorldBoundDescriptorSet(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_setWorldBoundDescriptorSet)

static bool js_scene_SubModel_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->update();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_update)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_SubModel_finalize)

static bool js_scene_SubModel_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::scene::SubModel* cobj = JSB_ALLOC(cc::scene::SubModel);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_scene_SubModel_constructor, __jsb_cc_scene_SubModel_class, js_cc_scene_SubModel_finalize)



static bool js_cc_scene_SubModel_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::SubModel>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_SubModel_finalize)

bool js_register_scene_SubModel(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SubModel", obj, nullptr, _SE(js_scene_SubModel_constructor));

    cls->defineFunction("getId", _SE(js_scene_SubModel_getId));
    cls->defineFunction("getOwner", _SE(js_scene_SubModel_getOwner));
    cls->defineFunction("getPass", _SE(js_scene_SubModel_getPass));
    cls->defineFunction("getPasses", _SE(js_scene_SubModel_getPasses));
    cls->defineFunction("getPlanarInstanceShader", _SE(js_scene_SubModel_getPlanarInstanceShader));
    cls->defineFunction("getPlanarShader", _SE(js_scene_SubModel_getPlanarShader));
    cls->defineFunction("getPriority", _SE(js_scene_SubModel_getPriority));
    cls->defineFunction("getShader", _SE(js_scene_SubModel_getShader));
    cls->defineFunction("getShaders", _SE(js_scene_SubModel_getShaders));
    cls->defineFunction("getWorldBoundDescriptorSet", _SE(js_scene_SubModel_getWorldBoundDescriptorSet));
    cls->defineFunction("setDescriptorSet", _SE(js_scene_SubModel_setDescriptorSet));
    cls->defineFunction("setInputAssembler", _SE(js_scene_SubModel_setInputAssembler));
    cls->defineFunction("setOwner", _SE(js_scene_SubModel_setOwner));
    cls->defineFunction("setPasses", _SE(js_scene_SubModel_setPasses));
    cls->defineFunction("setPlanarInstanceShader", _SE(js_scene_SubModel_setPlanarInstanceShader));
    cls->defineFunction("setPlanarShader", _SE(js_scene_SubModel_setPlanarShader));
    cls->defineFunction("setPriority", _SE(js_scene_SubModel_setPriority));
    cls->defineFunction("setShaders", _SE(js_scene_SubModel_setShaders));
    cls->defineFunction("setWorldBoundDescriptorSet", _SE(js_scene_SubModel_setWorldBoundDescriptorSet));
    cls->defineFunction("update", _SE(js_scene_SubModel_update));
    cls->defineFinalizeFunction(_SE(js_cc_scene_SubModel_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::SubModel>(cls);

    __jsb_cc_scene_SubModel_proto = cls->getProto();
    __jsb_cc_scene_SubModel_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Pass_proto = nullptr;
se::Class* __jsb_cc_scene_Pass_class = nullptr;

static bool js_scene_Pass_getBatchingScheme(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getBatchingScheme : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getBatchingScheme());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getBatchingScheme : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getBatchingScheme)

static bool js_scene_Pass_getBlendState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getBlendState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::BlendState* result = cobj->getBlendState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getBlendState : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getBlendState)

static bool js_scene_Pass_getDepthStencilState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getDepthStencilState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::DepthStencilState* result = cobj->getDepthStencilState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getDepthStencilState : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getDepthStencilState)

static bool js_scene_Pass_getDescriptorSet(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getDescriptorSet : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::DescriptorSet* result = cobj->getDescriptorSet();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getDescriptorSet : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getDescriptorSet)

static bool js_scene_Pass_getDynamicState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getDynamicState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getDynamicState());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getDynamicState : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getDynamicState)

static bool js_scene_Pass_getHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHash();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getHash)

static bool js_scene_Pass_getPhase(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getPhase : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getPhase();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getPhase : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getPhase)

static bool js_scene_Pass_getPipelineLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getPipelineLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::PipelineLayout* result = cobj->getPipelineLayout();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getPipelineLayout : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getPipelineLayout)

static bool js_scene_Pass_getPrimitive(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getPrimitive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getPrimitive());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getPrimitive : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getPrimitive)

static bool js_scene_Pass_getPriority(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getPriority : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getPriority());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getPriority : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getPriority)

static bool js_scene_Pass_getRasterizerState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getRasterizerState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::RasterizerState* result = cobj->getRasterizerState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getRasterizerState : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getRasterizerState)

static bool js_scene_Pass_getStage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getStage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getStage());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getStage : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getStage)

static bool js_scene_Pass_initWithData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_initWithData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned char*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_initWithData : Error processing arguments");
        cobj->initWithData(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_initWithData)

static bool js_scene_Pass_setBatchingScheme(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_setBatchingScheme : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::BatchingSchemes, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_setBatchingScheme : Error processing arguments");
        cobj->setBatchingScheme(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_setBatchingScheme)

static bool js_scene_Pass_setBlendState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_setBlendState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::BlendState*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_setBlendState : Error processing arguments");
        cobj->setBlendState(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_setBlendState)

static bool js_scene_Pass_setDepthStencilState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_setDepthStencilState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::DepthStencilState*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_setDepthStencilState : Error processing arguments");
        cobj->setDepthStencilState(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_setDepthStencilState)

static bool js_scene_Pass_setDescriptorSet(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_setDescriptorSet : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::DescriptorSet*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_setDescriptorSet : Error processing arguments");
        cobj->setDescriptorSet(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_setDescriptorSet)

static bool js_scene_Pass_setDynamicState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_setDynamicState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::DynamicStateFlagBit, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_setDynamicState : Error processing arguments");
        cobj->setDynamicState(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_setDynamicState)

static bool js_scene_Pass_setHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_setHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_setHash : Error processing arguments");
        cobj->setHash(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_setHash)

static bool js_scene_Pass_setPhase(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_setPhase : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_setPhase : Error processing arguments");
        cobj->setPhase(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_setPhase)

static bool js_scene_Pass_setPipelineLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_setPipelineLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::PipelineLayout*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_setPipelineLayout : Error processing arguments");
        cobj->setPipelineLayout(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_setPipelineLayout)

static bool js_scene_Pass_setPrimitive(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_setPrimitive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::PrimitiveMode, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_setPrimitive : Error processing arguments");
        cobj->setPrimitive(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_setPrimitive)

static bool js_scene_Pass_setPriority(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_setPriority : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::RenderPriority, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_setPriority : Error processing arguments");
        cobj->setPriority(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_setPriority)

static bool js_scene_Pass_setRasterizerState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_setRasterizerState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::RasterizerState*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_setRasterizerState : Error processing arguments");
        cobj->setRasterizerState(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_setRasterizerState)

static bool js_scene_Pass_setRootBufferDirty(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_setRootBufferDirty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_setRootBufferDirty : Error processing arguments");
        cobj->setRootBufferDirty(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_setRootBufferDirty)

static bool js_scene_Pass_setStage(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_setStage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::RenderPassStage, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_setStage : Error processing arguments");
        cobj->setStage(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_setStage)

static bool js_scene_Pass_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->update();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_update)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Pass_finalize)

static bool js_scene_Pass_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::scene::Pass* cobj = JSB_ALLOC(cc::scene::Pass);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_scene_Pass_constructor, __jsb_cc_scene_Pass_class, js_cc_scene_Pass_finalize)



static bool js_cc_scene_Pass_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::Pass>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Pass_finalize)

bool js_register_scene_Pass(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Pass", obj, nullptr, _SE(js_scene_Pass_constructor));

    cls->defineFunction("getBatchingScheme", _SE(js_scene_Pass_getBatchingScheme));
    cls->defineFunction("getBlendState", _SE(js_scene_Pass_getBlendState));
    cls->defineFunction("getDepthStencilState", _SE(js_scene_Pass_getDepthStencilState));
    cls->defineFunction("getDescriptorSet", _SE(js_scene_Pass_getDescriptorSet));
    cls->defineFunction("getDynamicState", _SE(js_scene_Pass_getDynamicState));
    cls->defineFunction("getHash", _SE(js_scene_Pass_getHash));
    cls->defineFunction("getPhase", _SE(js_scene_Pass_getPhase));
    cls->defineFunction("getPipelineLayout", _SE(js_scene_Pass_getPipelineLayout));
    cls->defineFunction("getPrimitive", _SE(js_scene_Pass_getPrimitive));
    cls->defineFunction("getPriority", _SE(js_scene_Pass_getPriority));
    cls->defineFunction("getRasterizerState", _SE(js_scene_Pass_getRasterizerState));
    cls->defineFunction("getStage", _SE(js_scene_Pass_getStage));
    cls->defineFunction("initWithData", _SE(js_scene_Pass_initWithData));
    cls->defineFunction("setBatchingScheme", _SE(js_scene_Pass_setBatchingScheme));
    cls->defineFunction("setBlendState", _SE(js_scene_Pass_setBlendState));
    cls->defineFunction("setDepthStencilState", _SE(js_scene_Pass_setDepthStencilState));
    cls->defineFunction("setDescriptorSet", _SE(js_scene_Pass_setDescriptorSet));
    cls->defineFunction("setDynamicState", _SE(js_scene_Pass_setDynamicState));
    cls->defineFunction("setHash", _SE(js_scene_Pass_setHash));
    cls->defineFunction("setPhase", _SE(js_scene_Pass_setPhase));
    cls->defineFunction("setPipelineLayout", _SE(js_scene_Pass_setPipelineLayout));
    cls->defineFunction("setPrimitive", _SE(js_scene_Pass_setPrimitive));
    cls->defineFunction("setPriority", _SE(js_scene_Pass_setPriority));
    cls->defineFunction("setRasterizerState", _SE(js_scene_Pass_setRasterizerState));
    cls->defineFunction("setRootBufferDirty", _SE(js_scene_Pass_setRootBufferDirty));
    cls->defineFunction("setStage", _SE(js_scene_Pass_setStage));
    cls->defineFunction("update", _SE(js_scene_Pass_update));
    cls->defineFinalizeFunction(_SE(js_cc_scene_Pass_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Pass>(cls);

    __jsb_cc_scene_Pass_proto = cls->getProto();
    __jsb_cc_scene_Pass_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_BakedAnimInfo_proto = nullptr;
se::Class* __jsb_cc_scene_BakedAnimInfo_class = nullptr;

static bool js_scene_BakedAnimInfo_getDirty(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::BakedAnimInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_BakedAnimInfo_getDirty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getDirty();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_BakedAnimInfo_getDirty : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_BakedAnimInfo_getDirty)


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::BakedAnimInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::BakedAnimInfo*>(json->getPrivateData());
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
    json->getProperty("data", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->data), ctx);
    }
    json->getProperty("dirty", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->dirty), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_BakedAnimInfo_finalize)

static bool js_scene_BakedAnimInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::scene::BakedAnimInfo* cobj = JSB_ALLOC(cc::scene::BakedAnimInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::scene::BakedAnimInfo* cobj = JSB_ALLOC(cc::scene::BakedAnimInfo);
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

    cc::scene::BakedAnimInfo* cobj = JSB_ALLOC(cc::scene::BakedAnimInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->buffer), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->data), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->dirty), nullptr);
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
SE_BIND_CTOR(js_scene_BakedAnimInfo_constructor, __jsb_cc_scene_BakedAnimInfo_class, js_cc_scene_BakedAnimInfo_finalize)



static bool js_cc_scene_BakedAnimInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::BakedAnimInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::BakedAnimInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_BakedAnimInfo_finalize)

bool js_register_scene_BakedAnimInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BakedAnimInfo", obj, nullptr, _SE(js_scene_BakedAnimInfo_constructor));

    cls->defineFunction("getDirty", _SE(js_scene_BakedAnimInfo_getDirty));
    cls->defineFinalizeFunction(_SE(js_cc_scene_BakedAnimInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::BakedAnimInfo>(cls);

    __jsb_cc_scene_BakedAnimInfo_proto = cls->getProto();
    __jsb_cc_scene_BakedAnimInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_BakedJointInfo_proto = nullptr;
se::Class* __jsb_cc_scene_BakedJointInfo_class = nullptr;


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::BakedJointInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::BakedJointInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("boundsInfo", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->boundsInfo), ctx);
    }
    json->getProperty("jointTextureInfo", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->jointTextureInfo), ctx);
    }
    json->getProperty("animInfo", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->animInfo), ctx);
    }
    json->getProperty("buffer", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->buffer), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_BakedJointInfo_finalize)

static bool js_scene_BakedJointInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::scene::BakedJointInfo* cobj = JSB_ALLOC(cc::scene::BakedJointInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::scene::BakedJointInfo* cobj = JSB_ALLOC(cc::scene::BakedJointInfo);
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

    cc::scene::BakedJointInfo* cobj = JSB_ALLOC(cc::scene::BakedJointInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->boundsInfo), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->jointTextureInfo), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->animInfo), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->buffer), nullptr);
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
SE_BIND_CTOR(js_scene_BakedJointInfo_constructor, __jsb_cc_scene_BakedJointInfo_class, js_cc_scene_BakedJointInfo_finalize)



static bool js_cc_scene_BakedJointInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::BakedJointInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::BakedJointInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_BakedJointInfo_finalize)

bool js_register_scene_BakedJointInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BakedJointInfo", obj, nullptr, _SE(js_scene_BakedJointInfo_constructor));

    cls->defineFinalizeFunction(_SE(js_cc_scene_BakedJointInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::BakedJointInfo>(cls);

    __jsb_cc_scene_BakedJointInfo_proto = cls->getProto();
    __jsb_cc_scene_BakedJointInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_BakedSkinningModel_proto = nullptr;
se::Class* __jsb_cc_scene_BakedSkinningModel_class = nullptr;

static bool js_scene_BakedSkinningModel_setAnimInfoIdx(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::BakedSkinningModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_BakedSkinningModel_setAnimInfoIdx : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int32_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_BakedSkinningModel_setAnimInfoIdx : Error processing arguments");
        cobj->setAnimInfoIdx(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_BakedSkinningModel_setAnimInfoIdx)

static bool js_scene_BakedSkinningModel_setJointMedium(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::BakedSkinningModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_BakedSkinningModel_setJointMedium : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<bool, false> arg0 = {};
        HolderType<cc::scene::BakedJointInfo, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_BakedSkinningModel_setJointMedium : Error processing arguments");
        cobj->setJointMedium(arg0.value(), std::move(arg1.value()));
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_BakedSkinningModel_setJointMedium)

static bool js_scene_BakedSkinningModel_updateModelBounds(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::BakedSkinningModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_BakedSkinningModel_updateModelBounds : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::AABB*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_BakedSkinningModel_updateModelBounds : Error processing arguments");
        cobj->updateModelBounds(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_BakedSkinningModel_updateModelBounds)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_BakedSkinningModel_finalize)

static bool js_scene_BakedSkinningModel_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::scene::BakedSkinningModel* cobj = JSB_ALLOC(cc::scene::BakedSkinningModel);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_scene_BakedSkinningModel_constructor, __jsb_cc_scene_BakedSkinningModel_class, js_cc_scene_BakedSkinningModel_finalize)



static bool js_cc_scene_BakedSkinningModel_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::BakedSkinningModel>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::BakedSkinningModel>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_BakedSkinningModel_finalize)

bool js_register_scene_BakedSkinningModel(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BakedSkinningModel", obj, __jsb_cc_scene_Model_proto, _SE(js_scene_BakedSkinningModel_constructor));

    cls->defineFunction("setAnimInfoIdx", _SE(js_scene_BakedSkinningModel_setAnimInfoIdx));
    cls->defineFunction("setJointMedium", _SE(js_scene_BakedSkinningModel_setJointMedium));
    cls->defineFunction("updateModelBounds", _SE(js_scene_BakedSkinningModel_updateModelBounds));
    cls->defineFinalizeFunction(_SE(js_cc_scene_BakedSkinningModel_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::BakedSkinningModel>(cls);

    __jsb_cc_scene_BakedSkinningModel_proto = cls->getProto();
    __jsb_cc_scene_BakedSkinningModel_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_DrawCall_proto = nullptr;
se::Class* __jsb_cc_scene_DrawCall_class = nullptr;

static bool js_scene_DrawCall_setDynamicOffsets(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawCall>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawCall_setDynamicOffsets : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_DrawCall_setDynamicOffsets : Error processing arguments");
        cobj->setDynamicOffsets(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_DrawCall_setDynamicOffsets)

static bool js_scene_DrawCall_get_bufferView(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawCall>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawCall_get_bufferView : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bufferView, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->bufferView, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_DrawCall_get_bufferView)

static bool js_scene_DrawCall_set_bufferView(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawCall>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawCall_set_bufferView : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bufferView, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_DrawCall_set_bufferView : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_DrawCall_set_bufferView)

static bool js_scene_DrawCall_get_descriptorSet(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawCall>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawCall_get_descriptorSet : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->descriptorSet, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->descriptorSet, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_DrawCall_get_descriptorSet)

static bool js_scene_DrawCall_set_descriptorSet(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawCall>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawCall_set_descriptorSet : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->descriptorSet, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_DrawCall_set_descriptorSet : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_DrawCall_set_descriptorSet)

static bool js_scene_DrawCall_get_dynamicOffsets(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawCall>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawCall_get_dynamicOffsets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->dynamicOffsets, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->dynamicOffsets, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_DrawCall_get_dynamicOffsets)

static bool js_scene_DrawCall_set_dynamicOffsets(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawCall>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawCall_set_dynamicOffsets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->dynamicOffsets, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_DrawCall_set_dynamicOffsets : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_DrawCall_set_dynamicOffsets)

static bool js_scene_DrawCall_get_drawInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawCall>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawCall_get_drawInfo : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->drawInfo, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->drawInfo, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_DrawCall_get_drawInfo)

static bool js_scene_DrawCall_set_drawInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawCall>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawCall_set_drawInfo : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->drawInfo, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_DrawCall_set_drawInfo : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_DrawCall_set_drawInfo)


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::DrawCall * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::DrawCall*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("bufferView", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bufferView), ctx);
    }
    json->getProperty("descriptorSet", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->descriptorSet), ctx);
    }
    json->getProperty("dynamicOffsets", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->dynamicOffsets), ctx);
    }
    json->getProperty("drawInfo", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->drawInfo), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_DrawCall_finalize)

static bool js_scene_DrawCall_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::scene::DrawCall* cobj = JSB_ALLOC(cc::scene::DrawCall);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::scene::DrawCall* cobj = JSB_ALLOC(cc::scene::DrawCall);
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

    cc::scene::DrawCall* cobj = JSB_ALLOC(cc::scene::DrawCall);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->bufferView), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->descriptorSet), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->dynamicOffsets), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->drawInfo), nullptr);
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
SE_BIND_CTOR(js_scene_DrawCall_constructor, __jsb_cc_scene_DrawCall_class, js_cc_scene_DrawCall_finalize)



static bool js_cc_scene_DrawCall_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::DrawCall>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::DrawCall>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_DrawCall_finalize)

bool js_register_scene_DrawCall(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DrawCall", obj, nullptr, _SE(js_scene_DrawCall_constructor));

    cls->defineProperty("bufferView", _SE(js_scene_DrawCall_get_bufferView), _SE(js_scene_DrawCall_set_bufferView));
    cls->defineProperty("descriptorSet", _SE(js_scene_DrawCall_get_descriptorSet), _SE(js_scene_DrawCall_set_descriptorSet));
    cls->defineProperty("dynamicOffsets", _SE(js_scene_DrawCall_get_dynamicOffsets), _SE(js_scene_DrawCall_set_dynamicOffsets));
    cls->defineProperty("drawInfo", _SE(js_scene_DrawCall_get_drawInfo), _SE(js_scene_DrawCall_set_drawInfo));
    cls->defineFunction("setDynamicOffsets", _SE(js_scene_DrawCall_setDynamicOffsets));
    cls->defineFinalizeFunction(_SE(js_cc_scene_DrawCall_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::DrawCall>(cls);

    __jsb_cc_scene_DrawCall_proto = cls->getProto();
    __jsb_cc_scene_DrawCall_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_DrawBatch2D_proto = nullptr;
se::Class* __jsb_cc_scene_DrawBatch2D_class = nullptr;

static bool js_scene_DrawBatch2D_clearDrawCalls(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawBatch2D>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawBatch2D_clearDrawCalls : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clearDrawCalls();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_DrawBatch2D_clearDrawCalls)

static bool js_scene_DrawBatch2D_pushDrawCall(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawBatch2D>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawBatch2D_pushDrawCall : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::DrawCall*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_DrawBatch2D_pushDrawCall : Error processing arguments");
        cobj->pushDrawCall(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_DrawBatch2D_pushDrawCall)

static bool js_scene_DrawBatch2D_get_drawCalls(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawBatch2D>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawBatch2D_get_drawCalls : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->drawCalls, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->drawCalls, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_DrawBatch2D_get_drawCalls)

static bool js_scene_DrawBatch2D_set_drawCalls(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawBatch2D>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawBatch2D_set_drawCalls : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->drawCalls, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_DrawBatch2D_set_drawCalls : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_DrawBatch2D_set_drawCalls)


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::DrawBatch2D * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::DrawBatch2D*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("visFlags", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->visFlags), ctx);
    }
    json->getProperty("descriptorSet", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->descriptorSet), ctx);
    }
    json->getProperty("inputAssembler", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->inputAssembler), ctx);
    }
    json->getProperty("passes", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->passes), ctx);
    }
    json->getProperty("shaders", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->shaders), ctx);
    }
    json->getProperty("drawCalls", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->drawCalls), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_DrawBatch2D_finalize)

static bool js_scene_DrawBatch2D_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::scene::DrawBatch2D* cobj = JSB_ALLOC(cc::scene::DrawBatch2D);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::scene::DrawBatch2D* cobj = JSB_ALLOC(cc::scene::DrawBatch2D);
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

    cc::scene::DrawBatch2D* cobj = JSB_ALLOC(cc::scene::DrawBatch2D);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->visFlags), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->descriptorSet), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->inputAssembler), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->passes), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->shaders), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->drawCalls), nullptr);
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
SE_BIND_CTOR(js_scene_DrawBatch2D_constructor, __jsb_cc_scene_DrawBatch2D_class, js_cc_scene_DrawBatch2D_finalize)



static bool js_cc_scene_DrawBatch2D_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::DrawBatch2D>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::DrawBatch2D>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_DrawBatch2D_finalize)

bool js_register_scene_DrawBatch2D(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DrawBatch2D", obj, nullptr, _SE(js_scene_DrawBatch2D_constructor));

    cls->defineProperty("drawCalls", _SE(js_scene_DrawBatch2D_get_drawCalls), _SE(js_scene_DrawBatch2D_set_drawCalls));
    cls->defineFunction("clearDrawCalls", _SE(js_scene_DrawBatch2D_clearDrawCalls));
    cls->defineFunction("pushDrawCall", _SE(js_scene_DrawBatch2D_pushDrawCall));
    cls->defineFinalizeFunction(_SE(js_cc_scene_DrawBatch2D_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::DrawBatch2D>(cls);

    __jsb_cc_scene_DrawBatch2D_proto = cls->getProto();
    __jsb_cc_scene_DrawBatch2D_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_JointTransform_proto = nullptr;
se::Class* __jsb_cc_scene_JointTransform_class = nullptr;


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::JointTransform * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::JointTransform*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("node", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->node), ctx);
    }
    json->getProperty("local", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->local), ctx);
    }
    json->getProperty("world", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->world), ctx);
    }
    json->getProperty("stamp", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stamp), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_JointTransform_finalize)

static bool js_scene_JointTransform_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::scene::JointTransform* cobj = JSB_ALLOC(cc::scene::JointTransform);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::scene::JointTransform* cobj = JSB_ALLOC(cc::scene::JointTransform);
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

    cc::scene::JointTransform* cobj = JSB_ALLOC(cc::scene::JointTransform);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->node), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->local), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->world), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->stamp), nullptr);
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
SE_BIND_CTOR(js_scene_JointTransform_constructor, __jsb_cc_scene_JointTransform_class, js_cc_scene_JointTransform_finalize)



static bool js_cc_scene_JointTransform_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::JointTransform>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::JointTransform>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_JointTransform_finalize)

bool js_register_scene_JointTransform(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("JointTransform", obj, nullptr, _SE(js_scene_JointTransform_constructor));

    cls->defineFinalizeFunction(_SE(js_cc_scene_JointTransform_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::JointTransform>(cls);

    __jsb_cc_scene_JointTransform_proto = cls->getProto();
    __jsb_cc_scene_JointTransform_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_JointInfo_proto = nullptr;
se::Class* __jsb_cc_scene_JointInfo_class = nullptr;


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::JointInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::JointInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("bound", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bound), ctx);
    }
    json->getProperty("target", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->target), ctx);
    }
    json->getProperty("bindpose", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bindpose), ctx);
    }
    json->getProperty("transform", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->transform), ctx);
    }
    json->getProperty("parents", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->parents), ctx);
    }
    json->getProperty("buffers", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->buffers), ctx);
    }
    json->getProperty("indices", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->indices), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_JointInfo_finalize)

static bool js_scene_JointInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::scene::JointInfo* cobj = JSB_ALLOC(cc::scene::JointInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::scene::JointInfo* cobj = JSB_ALLOC(cc::scene::JointInfo);
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

    cc::scene::JointInfo* cobj = JSB_ALLOC(cc::scene::JointInfo);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->bound), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->target), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->bindpose), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->transform), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->parents), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->buffers), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->indices), nullptr);
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
SE_BIND_CTOR(js_scene_JointInfo_constructor, __jsb_cc_scene_JointInfo_class, js_cc_scene_JointInfo_finalize)



static bool js_cc_scene_JointInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::JointInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::JointInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_JointInfo_finalize)

bool js_register_scene_JointInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("JointInfo", obj, nullptr, _SE(js_scene_JointInfo_constructor));

    cls->defineFinalizeFunction(_SE(js_cc_scene_JointInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::JointInfo>(cls);

    __jsb_cc_scene_JointInfo_proto = cls->getProto();
    __jsb_cc_scene_JointInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_SkinningModel_proto = nullptr;
se::Class* __jsb_cc_scene_SkinningModel_class = nullptr;

static bool js_scene_SkinningModel_setBuffers(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkinningModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkinningModel_setBuffers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::gfx::Buffer *>, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SkinningModel_setBuffers : Error processing arguments");
        cobj->setBuffers(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SkinningModel_setBuffers)

static bool js_scene_SkinningModel_setIndicesAndJoints(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkinningModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkinningModel_setIndicesAndJoints : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::vector<unsigned int>, false> arg0 = {};
        HolderType<std::vector<cc::scene::JointInfo>, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SkinningModel_setIndicesAndJoints : Error processing arguments");
        cobj->setIndicesAndJoints(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_SkinningModel_setIndicesAndJoints)

static bool js_scene_SkinningModel_setNeedUpdate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkinningModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkinningModel_setNeedUpdate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SkinningModel_setNeedUpdate : Error processing arguments");
        cobj->setNeedUpdate(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SkinningModel_setNeedUpdate)

static bool js_scene_SkinningModel_updateLocalDescriptors(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkinningModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkinningModel_updateLocalDescriptors : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<cc::gfx::DescriptorSet*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SkinningModel_updateLocalDescriptors : Error processing arguments");
        cobj->updateLocalDescriptors(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_SkinningModel_updateLocalDescriptors)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_SkinningModel_finalize)

static bool js_scene_SkinningModel_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::scene::SkinningModel* cobj = JSB_ALLOC(cc::scene::SkinningModel);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_scene_SkinningModel_constructor, __jsb_cc_scene_SkinningModel_class, js_cc_scene_SkinningModel_finalize)



static bool js_cc_scene_SkinningModel_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::SkinningModel>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::SkinningModel>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_SkinningModel_finalize)

bool js_register_scene_SkinningModel(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SkinningModel", obj, __jsb_cc_scene_Model_proto, _SE(js_scene_SkinningModel_constructor));

    cls->defineFunction("setBuffers", _SE(js_scene_SkinningModel_setBuffers));
    cls->defineFunction("setIndicesAndJoints", _SE(js_scene_SkinningModel_setIndicesAndJoints));
    cls->defineFunction("setNeedUpdate", _SE(js_scene_SkinningModel_setNeedUpdate));
    cls->defineFunction("updateLocalDescriptors", _SE(js_scene_SkinningModel_updateLocalDescriptors));
    cls->defineFinalizeFunction(_SE(js_cc_scene_SkinningModel_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::SkinningModel>(cls);

    __jsb_cc_scene_SkinningModel_proto = cls->getProto();
    __jsb_cc_scene_SkinningModel_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_RenderScene_proto = nullptr;
se::Class* __jsb_cc_scene_RenderScene_class = nullptr;

static bool js_scene_RenderScene_activate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_activate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->activate();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_activate)

static bool js_scene_RenderScene_addBakedSkinningModel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_addBakedSkinningModel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::BakedSkinningModel*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_addBakedSkinningModel : Error processing arguments");
        cobj->addBakedSkinningModel(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_addBakedSkinningModel)

static bool js_scene_RenderScene_addBatch(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_addBatch : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::DrawBatch2D*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_addBatch : Error processing arguments");
        cobj->addBatch(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_addBatch)

static bool js_scene_RenderScene_addModel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_addModel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Model*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_addModel : Error processing arguments");
        cobj->addModel(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_addModel)

static bool js_scene_RenderScene_addSkinningModel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_addSkinningModel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::SkinningModel*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_addSkinningModel : Error processing arguments");
        cobj->addSkinningModel(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_addSkinningModel)

static bool js_scene_RenderScene_addSphereLight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_addSphereLight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::SphereLight*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_addSphereLight : Error processing arguments");
        cobj->addSphereLight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_addSphereLight)

static bool js_scene_RenderScene_addSpotLight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_addSpotLight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::SpotLight*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_addSpotLight : Error processing arguments");
        cobj->addSpotLight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_addSpotLight)

static bool js_scene_RenderScene_getDrawBatch2Ds(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_getDrawBatch2Ds : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::scene::DrawBatch2D *>& result = cobj->getDrawBatch2Ds();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_getDrawBatch2Ds : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_getDrawBatch2Ds)

static bool js_scene_RenderScene_getMainLight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_getMainLight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::DirectionalLight* result = cobj->getMainLight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_getMainLight : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_getMainLight)

static bool js_scene_RenderScene_getModels(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_getModels : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::scene::Model *>& result = cobj->getModels();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_getModels : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_getModels)

static bool js_scene_RenderScene_getSphereLights(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_getSphereLights : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::scene::SphereLight *>& result = cobj->getSphereLights();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_getSphereLights : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_getSphereLights)

static bool js_scene_RenderScene_getSpotLights(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_getSpotLights : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::scene::SpotLight *>& result = cobj->getSpotLights();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_getSpotLights : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_getSpotLights)

static bool js_scene_RenderScene_removeBatch(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2( cobj, false, "js_scene_RenderScene_removeBatch : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<unsigned int, false> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->removeBatch(arg0.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<cc::scene::DrawBatch2D*, false> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->removeBatch(arg0.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_removeBatch)

static bool js_scene_RenderScene_removeBatches(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_removeBatches : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->removeBatches();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_removeBatches)

static bool js_scene_RenderScene_removeModel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_removeModel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_removeModel : Error processing arguments");
        cobj->removeModel(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_removeModel)

static bool js_scene_RenderScene_removeModels(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_removeModels : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->removeModels();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_removeModels)

static bool js_scene_RenderScene_removeSphereLight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_removeSphereLight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::SphereLight*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_removeSphereLight : Error processing arguments");
        cobj->removeSphereLight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_removeSphereLight)

static bool js_scene_RenderScene_removeSphereLights(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_removeSphereLights : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->removeSphereLights();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_removeSphereLights)

static bool js_scene_RenderScene_removeSpotLight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_removeSpotLight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::SpotLight*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_removeSpotLight : Error processing arguments");
        cobj->removeSpotLight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_removeSpotLight)

static bool js_scene_RenderScene_removeSpotLights(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_removeSpotLights : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->removeSpotLights();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_removeSpotLights)

static bool js_scene_RenderScene_setMainLight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_setMainLight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::DirectionalLight*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_setMainLight : Error processing arguments");
        cobj->setMainLight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_setMainLight)

static bool js_scene_RenderScene_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_update : Error processing arguments");
        cobj->update(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_update)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_RenderScene_finalize)

static bool js_scene_RenderScene_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::scene::RenderScene* cobj = JSB_ALLOC(cc::scene::RenderScene);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_scene_RenderScene_constructor, __jsb_cc_scene_RenderScene_class, js_cc_scene_RenderScene_finalize)



static bool js_cc_scene_RenderScene_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::RenderScene>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_RenderScene_finalize)

bool js_register_scene_RenderScene(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RenderScene", obj, nullptr, _SE(js_scene_RenderScene_constructor));

    cls->defineFunction("activate", _SE(js_scene_RenderScene_activate));
    cls->defineFunction("addBakedSkinningModel", _SE(js_scene_RenderScene_addBakedSkinningModel));
    cls->defineFunction("addBatch", _SE(js_scene_RenderScene_addBatch));
    cls->defineFunction("addModel", _SE(js_scene_RenderScene_addModel));
    cls->defineFunction("addSkinningModel", _SE(js_scene_RenderScene_addSkinningModel));
    cls->defineFunction("addSphereLight", _SE(js_scene_RenderScene_addSphereLight));
    cls->defineFunction("addSpotLight", _SE(js_scene_RenderScene_addSpotLight));
    cls->defineFunction("getDrawBatch2Ds", _SE(js_scene_RenderScene_getDrawBatch2Ds));
    cls->defineFunction("getMainLight", _SE(js_scene_RenderScene_getMainLight));
    cls->defineFunction("getModels", _SE(js_scene_RenderScene_getModels));
    cls->defineFunction("getSphereLights", _SE(js_scene_RenderScene_getSphereLights));
    cls->defineFunction("getSpotLights", _SE(js_scene_RenderScene_getSpotLights));
    cls->defineFunction("removeBatch", _SE(js_scene_RenderScene_removeBatch));
    cls->defineFunction("removeBatches", _SE(js_scene_RenderScene_removeBatches));
    cls->defineFunction("removeModel", _SE(js_scene_RenderScene_removeModel));
    cls->defineFunction("removeModels", _SE(js_scene_RenderScene_removeModels));
    cls->defineFunction("removeSphereLight", _SE(js_scene_RenderScene_removeSphereLight));
    cls->defineFunction("removeSphereLights", _SE(js_scene_RenderScene_removeSphereLights));
    cls->defineFunction("removeSpotLight", _SE(js_scene_RenderScene_removeSpotLight));
    cls->defineFunction("removeSpotLights", _SE(js_scene_RenderScene_removeSpotLights));
    cls->defineFunction("setMainLight", _SE(js_scene_RenderScene_setMainLight));
    cls->defineFunction("update", _SE(js_scene_RenderScene_update));
    cls->defineFinalizeFunction(_SE(js_cc_scene_RenderScene_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::RenderScene>(cls);

    __jsb_cc_scene_RenderScene_proto = cls->getProto();
    __jsb_cc_scene_RenderScene_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_RenderWindow_proto = nullptr;
se::Class* __jsb_cc_scene_RenderWindow_class = nullptr;

static bool js_scene_RenderWindow_getHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderWindow_getHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHeight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_RenderWindow_getHeight : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderWindow_getHeight)

static bool js_scene_RenderWindow_getWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderWindow_getWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getWidth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_RenderWindow_getWidth : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderWindow_getWidth)

static bool js_scene_RenderWindow_get_swapchain(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderWindow_get_swapchain : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->swapchain, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->swapchain, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_RenderWindow_get_swapchain)

static bool js_scene_RenderWindow_set_swapchain(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderWindow_set_swapchain : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->swapchain, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_RenderWindow_set_swapchain : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_RenderWindow_set_swapchain)

static bool js_scene_RenderWindow_get_frameBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderWindow_get_frameBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->frameBuffer, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->frameBuffer, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_RenderWindow_get_frameBuffer)

static bool js_scene_RenderWindow_set_frameBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderWindow_set_frameBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->frameBuffer, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_RenderWindow_set_frameBuffer : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_RenderWindow_set_frameBuffer)


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::RenderWindow * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::RenderWindow*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("swapchain", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->swapchain), ctx);
    }
    json->getProperty("frameBuffer", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->frameBuffer), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_RenderWindow_finalize)

static bool js_scene_RenderWindow_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::scene::RenderWindow* cobj = JSB_ALLOC(cc::scene::RenderWindow);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::scene::RenderWindow* cobj = JSB_ALLOC(cc::scene::RenderWindow);
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

    cc::scene::RenderWindow* cobj = JSB_ALLOC(cc::scene::RenderWindow);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->swapchain), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->frameBuffer), nullptr);
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
SE_BIND_CTOR(js_scene_RenderWindow_constructor, __jsb_cc_scene_RenderWindow_class, js_cc_scene_RenderWindow_finalize)



static bool js_cc_scene_RenderWindow_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::RenderWindow>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::RenderWindow>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_RenderWindow_finalize)

bool js_register_scene_RenderWindow(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RenderWindow", obj, nullptr, _SE(js_scene_RenderWindow_constructor));

    cls->defineProperty("swapchain", _SE(js_scene_RenderWindow_get_swapchain), _SE(js_scene_RenderWindow_set_swapchain));
    cls->defineProperty("frameBuffer", _SE(js_scene_RenderWindow_get_frameBuffer), _SE(js_scene_RenderWindow_set_frameBuffer));
    cls->defineFunction("getHeight", _SE(js_scene_RenderWindow_getHeight));
    cls->defineFunction("getWidth", _SE(js_scene_RenderWindow_getWidth));
    cls->defineFinalizeFunction(_SE(js_cc_scene_RenderWindow_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::RenderWindow>(cls);

    __jsb_cc_scene_RenderWindow_proto = cls->getProto();
    __jsb_cc_scene_RenderWindow_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Camera_proto = nullptr;
se::Class* __jsb_cc_scene_Camera_class = nullptr;

static bool js_scene_Camera_get_width(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->width, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->width, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_width)

static bool js_scene_Camera_set_width(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->width, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_width : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_width)

static bool js_scene_Camera_get_height(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->height, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->height, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_height)

static bool js_scene_Camera_set_height(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->height, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_height : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_height)

static bool js_scene_Camera_get_nearClip(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_nearClip : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->nearClip, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->nearClip, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_nearClip)

static bool js_scene_Camera_set_nearClip(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_nearClip : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->nearClip, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_nearClip : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_nearClip)

static bool js_scene_Camera_get_farClip(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_farClip : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->farClip, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->farClip, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_farClip)

static bool js_scene_Camera_set_farClip(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_farClip : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->farClip, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_farClip : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_farClip)

static bool js_scene_Camera_get_clearFlag(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_clearFlag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->clearFlag, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->clearFlag, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_clearFlag)

static bool js_scene_Camera_set_clearFlag(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_clearFlag : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->clearFlag, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_clearFlag : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_clearFlag)

static bool js_scene_Camera_get_exposure(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_exposure : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->exposure, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->exposure, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_exposure)

static bool js_scene_Camera_set_exposure(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_exposure : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->exposure, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_exposure : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_exposure)

static bool js_scene_Camera_get_clearDepth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_clearDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->clearDepth, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->clearDepth, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_clearDepth)

static bool js_scene_Camera_set_clearDepth(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_clearDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->clearDepth, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_clearDepth : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_clearDepth)

static bool js_scene_Camera_get_fov(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_fov : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->fov, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->fov, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_fov)

static bool js_scene_Camera_set_fov(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_fov : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->fov, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_fov : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_fov)

static bool js_scene_Camera_get_aspect(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_aspect : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->aspect, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->aspect, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_aspect)

static bool js_scene_Camera_set_aspect(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_aspect : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->aspect, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_aspect : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_aspect)

static bool js_scene_Camera_get_viewPort(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_viewPort : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->viewPort, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->viewPort, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_viewPort)

static bool js_scene_Camera_set_viewPort(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_viewPort : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->viewPort, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_viewPort : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_viewPort)

static bool js_scene_Camera_get_clearStencil(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_clearStencil : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->clearStencil, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->clearStencil, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_clearStencil)

static bool js_scene_Camera_set_clearStencil(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_clearStencil : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->clearStencil, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_clearStencil : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_clearStencil)

static bool js_scene_Camera_get_visibility(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_visibility : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->visibility, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->visibility, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_visibility)

static bool js_scene_Camera_set_visibility(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_visibility : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->visibility, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_visibility : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_visibility)

static bool js_scene_Camera_get_node(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_node : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->node, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->node, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_node)

static bool js_scene_Camera_set_node(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_node : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->node, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_node : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_node)

static bool js_scene_Camera_get_scene(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_scene : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->scene, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->scene, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_scene)

static bool js_scene_Camera_set_scene(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_scene : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->scene, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_scene : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_scene)

static bool js_scene_Camera_get_window(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_window : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->window, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->window, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_window)

static bool js_scene_Camera_set_window(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_window : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->window, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_window : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_window)

static bool js_scene_Camera_get_frustum(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_frustum : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->frustum, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->frustum, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_frustum)

static bool js_scene_Camera_set_frustum(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_frustum : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->frustum, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_frustum : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_frustum)

static bool js_scene_Camera_get_forward(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_forward : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->forward, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->forward, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_forward)

static bool js_scene_Camera_set_forward(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_forward : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->forward, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_forward : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_forward)

static bool js_scene_Camera_get_position(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_position : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->position, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->position, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_position)

static bool js_scene_Camera_set_position(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_position : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->position, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_position : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_position)

static bool js_scene_Camera_get_clearColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_clearColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->clearColor, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->clearColor, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_clearColor)

static bool js_scene_Camera_set_clearColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_clearColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->clearColor, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_clearColor : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_clearColor)

static bool js_scene_Camera_get_matView(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_matView : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->matView, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->matView, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_matView)

static bool js_scene_Camera_set_matView(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_matView : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->matView, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_matView : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_matView)

static bool js_scene_Camera_get_matViewProj(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_matViewProj : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->matViewProj, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->matViewProj, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_matViewProj)

static bool js_scene_Camera_set_matViewProj(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_matViewProj : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->matViewProj, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_matViewProj : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_matViewProj)

static bool js_scene_Camera_get_matViewProjInv(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_matViewProjInv : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->matViewProjInv, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->matViewProjInv, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_matViewProjInv)

static bool js_scene_Camera_set_matViewProjInv(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_matViewProjInv : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->matViewProjInv, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_matViewProjInv : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_matViewProjInv)

static bool js_scene_Camera_get_matProj(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_matProj : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->matProj, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->matProj, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_matProj)

static bool js_scene_Camera_set_matProj(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_matProj : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->matProj, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_matProj : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_matProj)

static bool js_scene_Camera_get_matProjInv(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_matProjInv : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->matProjInv, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->matProjInv, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_matProjInv)

static bool js_scene_Camera_set_matProjInv(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_matProjInv : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->matProjInv, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_matProjInv : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_matProjInv)

static bool js_scene_Camera_get_matViewProjOffscreen(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_matViewProjOffscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->matViewProjOffscreen, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->matViewProjOffscreen, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_matViewProjOffscreen)

static bool js_scene_Camera_set_matViewProjOffscreen(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_matViewProjOffscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->matViewProjOffscreen, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_matViewProjOffscreen : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_matViewProjOffscreen)

static bool js_scene_Camera_get_matViewProjInvOffscreen(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_matViewProjInvOffscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->matViewProjInvOffscreen, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->matViewProjInvOffscreen, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_matViewProjInvOffscreen)

static bool js_scene_Camera_set_matViewProjInvOffscreen(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_matViewProjInvOffscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->matViewProjInvOffscreen, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_matViewProjInvOffscreen : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_matViewProjInvOffscreen)

static bool js_scene_Camera_get_matProjOffscreen(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_matProjOffscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->matProjOffscreen, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->matProjOffscreen, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_matProjOffscreen)

static bool js_scene_Camera_set_matProjOffscreen(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_matProjOffscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->matProjOffscreen, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_matProjOffscreen : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_matProjOffscreen)

static bool js_scene_Camera_get_matProjInvOffscreen(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_get_matProjInvOffscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->matProjInvOffscreen, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->matProjInvOffscreen, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_matProjInvOffscreen)

static bool js_scene_Camera_set_matProjInvOffscreen(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_set_matProjInvOffscreen : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->matProjInvOffscreen, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_set_matProjInvOffscreen : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Camera_set_matProjInvOffscreen)


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::Camera * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::Camera*>(json->getPrivateData());
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
    json->getProperty("nearClip", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->nearClip), ctx);
    }
    json->getProperty("farClip", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->farClip), ctx);
    }
    json->getProperty("clearFlag", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->clearFlag), ctx);
    }
    json->getProperty("exposure", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->exposure), ctx);
    }
    json->getProperty("clearDepth", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->clearDepth), ctx);
    }
    json->getProperty("fov", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->fov), ctx);
    }
    json->getProperty("aspect", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->aspect), ctx);
    }
    json->getProperty("viewPort", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->viewPort), ctx);
    }
    json->getProperty("clearStencil", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->clearStencil), ctx);
    }
    json->getProperty("visibility", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->visibility), ctx);
    }
    json->getProperty("node", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->node), ctx);
    }
    json->getProperty("scene", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->scene), ctx);
    }
    json->getProperty("window", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->window), ctx);
    }
    json->getProperty("frustum", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->frustum), ctx);
    }
    json->getProperty("forward", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->forward), ctx);
    }
    json->getProperty("position", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->position), ctx);
    }
    json->getProperty("clearColor", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->clearColor), ctx);
    }
    json->getProperty("matView", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->matView), ctx);
    }
    json->getProperty("matViewProj", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->matViewProj), ctx);
    }
    json->getProperty("matViewProjInv", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->matViewProjInv), ctx);
    }
    json->getProperty("matProj", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->matProj), ctx);
    }
    json->getProperty("matProjInv", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->matProjInv), ctx);
    }
    json->getProperty("matViewProjOffscreen", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->matViewProjOffscreen), ctx);
    }
    json->getProperty("matViewProjInvOffscreen", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->matViewProjInvOffscreen), ctx);
    }
    json->getProperty("matProjOffscreen", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->matProjOffscreen), ctx);
    }
    json->getProperty("matProjInvOffscreen", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->matProjInvOffscreen), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Camera_finalize)

static bool js_scene_Camera_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        cc::scene::Camera* cobj = JSB_ALLOC(cc::scene::Camera);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::scene::Camera* cobj = JSB_ALLOC(cc::scene::Camera);
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

    cc::scene::Camera* cobj = JSB_ALLOC(cc::scene::Camera);
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->width), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->height), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->nearClip), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->farClip), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->clearFlag), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->exposure), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->clearDepth), nullptr);
    }
    if (argc > 7 && !args[7].isUndefined()) {
        ok &= sevalue_to_native(args[7], &(cobj->fov), nullptr);
    }
    if (argc > 8 && !args[8].isUndefined()) {
        ok &= sevalue_to_native(args[8], &(cobj->aspect), nullptr);
    }
    if (argc > 9 && !args[9].isUndefined()) {
        ok &= sevalue_to_native(args[9], &(cobj->viewPort), nullptr);
    }
    if (argc > 10 && !args[10].isUndefined()) {
        ok &= sevalue_to_native(args[10], &(cobj->clearStencil), nullptr);
    }
    if (argc > 11 && !args[11].isUndefined()) {
        ok &= sevalue_to_native(args[11], &(cobj->visibility), nullptr);
    }
    if (argc > 12 && !args[12].isUndefined()) {
        ok &= sevalue_to_native(args[12], &(cobj->node), nullptr);
    }
    if (argc > 13 && !args[13].isUndefined()) {
        ok &= sevalue_to_native(args[13], &(cobj->scene), nullptr);
    }
    if (argc > 14 && !args[14].isUndefined()) {
        ok &= sevalue_to_native(args[14], &(cobj->window), nullptr);
    }
    if (argc > 15 && !args[15].isUndefined()) {
        ok &= sevalue_to_native(args[15], &(cobj->frustum), nullptr);
    }
    if (argc > 16 && !args[16].isUndefined()) {
        ok &= sevalue_to_native(args[16], &(cobj->forward), nullptr);
    }
    if (argc > 17 && !args[17].isUndefined()) {
        ok &= sevalue_to_native(args[17], &(cobj->position), nullptr);
    }
    if (argc > 18 && !args[18].isUndefined()) {
        ok &= sevalue_to_native(args[18], &(cobj->clearColor), nullptr);
    }
    if (argc > 19 && !args[19].isUndefined()) {
        ok &= sevalue_to_native(args[19], &(cobj->matView), nullptr);
    }
    if (argc > 20 && !args[20].isUndefined()) {
        ok &= sevalue_to_native(args[20], &(cobj->matViewProj), nullptr);
    }
    if (argc > 21 && !args[21].isUndefined()) {
        ok &= sevalue_to_native(args[21], &(cobj->matViewProjInv), nullptr);
    }
    if (argc > 22 && !args[22].isUndefined()) {
        ok &= sevalue_to_native(args[22], &(cobj->matProj), nullptr);
    }
    if (argc > 23 && !args[23].isUndefined()) {
        ok &= sevalue_to_native(args[23], &(cobj->matProjInv), nullptr);
    }
    if (argc > 24 && !args[24].isUndefined()) {
        ok &= sevalue_to_native(args[24], &(cobj->matViewProjOffscreen), nullptr);
    }
    if (argc > 25 && !args[25].isUndefined()) {
        ok &= sevalue_to_native(args[25], &(cobj->matViewProjInvOffscreen), nullptr);
    }
    if (argc > 26 && !args[26].isUndefined()) {
        ok &= sevalue_to_native(args[26], &(cobj->matProjOffscreen), nullptr);
    }
    if (argc > 27 && !args[27].isUndefined()) {
        ok &= sevalue_to_native(args[27], &(cobj->matProjInvOffscreen), nullptr);
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
SE_BIND_CTOR(js_scene_Camera_constructor, __jsb_cc_scene_Camera_class, js_cc_scene_Camera_finalize)



static bool js_cc_scene_Camera_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::Camera>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Camera_finalize)

bool js_register_scene_Camera(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Camera", obj, nullptr, _SE(js_scene_Camera_constructor));

    cls->defineProperty("width", _SE(js_scene_Camera_get_width), _SE(js_scene_Camera_set_width));
    cls->defineProperty("height", _SE(js_scene_Camera_get_height), _SE(js_scene_Camera_set_height));
    cls->defineProperty("nearClip", _SE(js_scene_Camera_get_nearClip), _SE(js_scene_Camera_set_nearClip));
    cls->defineProperty("farClip", _SE(js_scene_Camera_get_farClip), _SE(js_scene_Camera_set_farClip));
    cls->defineProperty("clearFlag", _SE(js_scene_Camera_get_clearFlag), _SE(js_scene_Camera_set_clearFlag));
    cls->defineProperty("exposure", _SE(js_scene_Camera_get_exposure), _SE(js_scene_Camera_set_exposure));
    cls->defineProperty("clearDepth", _SE(js_scene_Camera_get_clearDepth), _SE(js_scene_Camera_set_clearDepth));
    cls->defineProperty("fov", _SE(js_scene_Camera_get_fov), _SE(js_scene_Camera_set_fov));
    cls->defineProperty("aspect", _SE(js_scene_Camera_get_aspect), _SE(js_scene_Camera_set_aspect));
    cls->defineProperty("viewPort", _SE(js_scene_Camera_get_viewPort), _SE(js_scene_Camera_set_viewPort));
    cls->defineProperty("clearStencil", _SE(js_scene_Camera_get_clearStencil), _SE(js_scene_Camera_set_clearStencil));
    cls->defineProperty("visibility", _SE(js_scene_Camera_get_visibility), _SE(js_scene_Camera_set_visibility));
    cls->defineProperty("node", _SE(js_scene_Camera_get_node), _SE(js_scene_Camera_set_node));
    cls->defineProperty("scene", _SE(js_scene_Camera_get_scene), _SE(js_scene_Camera_set_scene));
    cls->defineProperty("window", _SE(js_scene_Camera_get_window), _SE(js_scene_Camera_set_window));
    cls->defineProperty("frustum", _SE(js_scene_Camera_get_frustum), _SE(js_scene_Camera_set_frustum));
    cls->defineProperty("forward", _SE(js_scene_Camera_get_forward), _SE(js_scene_Camera_set_forward));
    cls->defineProperty("position", _SE(js_scene_Camera_get_position), _SE(js_scene_Camera_set_position));
    cls->defineProperty("clearColor", _SE(js_scene_Camera_get_clearColor), _SE(js_scene_Camera_set_clearColor));
    cls->defineProperty("matView", _SE(js_scene_Camera_get_matView), _SE(js_scene_Camera_set_matView));
    cls->defineProperty("matViewProj", _SE(js_scene_Camera_get_matViewProj), _SE(js_scene_Camera_set_matViewProj));
    cls->defineProperty("matViewProjInv", _SE(js_scene_Camera_get_matViewProjInv), _SE(js_scene_Camera_set_matViewProjInv));
    cls->defineProperty("matProj", _SE(js_scene_Camera_get_matProj), _SE(js_scene_Camera_set_matProj));
    cls->defineProperty("matProjInv", _SE(js_scene_Camera_get_matProjInv), _SE(js_scene_Camera_set_matProjInv));
    cls->defineProperty("matViewProjOffscreen", _SE(js_scene_Camera_get_matViewProjOffscreen), _SE(js_scene_Camera_set_matViewProjOffscreen));
    cls->defineProperty("matViewProjInvOffscreen", _SE(js_scene_Camera_get_matViewProjInvOffscreen), _SE(js_scene_Camera_set_matViewProjInvOffscreen));
    cls->defineProperty("matProjOffscreen", _SE(js_scene_Camera_get_matProjOffscreen), _SE(js_scene_Camera_set_matProjOffscreen));
    cls->defineProperty("matProjInvOffscreen", _SE(js_scene_Camera_get_matProjInvOffscreen), _SE(js_scene_Camera_set_matProjInvOffscreen));
    cls->defineFinalizeFunction(_SE(js_cc_scene_Camera_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Camera>(cls);

    __jsb_cc_scene_Camera_proto = cls->getProto();
    __jsb_cc_scene_Camera_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Sphere_proto = nullptr;
se::Class* __jsb_cc_scene_Sphere_class = nullptr;

static bool js_scene_Sphere_getCenter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Sphere>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Sphere_getCenter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec3& result = cobj->getCenter();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Sphere_getCenter : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Sphere_getCenter)

static bool js_scene_Sphere_getRadius(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Sphere>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Sphere_getRadius : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRadius();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Sphere_getRadius : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Sphere_getRadius)

static bool js_scene_Sphere_setCenter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Sphere>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Sphere_setCenter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Sphere_setCenter : Error processing arguments");
        cobj->setCenter(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Sphere_setCenter)

static bool js_scene_Sphere_setRadius(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Sphere>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Sphere_setRadius : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Sphere_setRadius : Error processing arguments");
        cobj->setRadius(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Sphere_setRadius)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Sphere_finalize)

static bool js_scene_Sphere_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    cc::scene::Sphere* cobj = JSB_ALLOC(cc::scene::Sphere);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_scene_Sphere_constructor, __jsb_cc_scene_Sphere_class, js_cc_scene_Sphere_finalize)



static bool js_cc_scene_Sphere_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::scene::Sphere>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<cc::scene::Sphere>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Sphere_finalize)

bool js_register_scene_Sphere(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Sphere", obj, nullptr, _SE(js_scene_Sphere_constructor));

    cls->defineFunction("getCenter", _SE(js_scene_Sphere_getCenter));
    cls->defineFunction("getRadius", _SE(js_scene_Sphere_getRadius));
    cls->defineFunction("setCenter", _SE(js_scene_Sphere_setCenter));
    cls->defineFunction("setRadius", _SE(js_scene_Sphere_setRadius));
    cls->defineFinalizeFunction(_SE(js_cc_scene_Sphere_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Sphere>(cls);

    __jsb_cc_scene_Sphere_proto = cls->getProto();
    __jsb_cc_scene_Sphere_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
bool register_all_scene(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("ns", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("ns", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_scene_BaseNode(ns);
    js_register_scene_Scene(ns);
    js_register_scene_Node(ns);
    js_register_scene_Light(ns);
    js_register_scene_DirectionalLight(ns);
    js_register_scene_Plane(ns);
    js_register_scene_Frustum(ns);
    js_register_scene_AABB(ns);
    js_register_scene_SpotLight(ns);
    js_register_scene_SphereLight(ns);
    js_register_scene_Model(ns);
    js_register_scene_Fog(ns);
    js_register_scene_Shadow(ns);
    js_register_scene_Skybox(ns);
    js_register_scene_Ambient(ns);
    js_register_scene_OctreeInfo(ns);
    js_register_scene_PipelineSharedSceneData(ns);
    js_register_scene_Root(ns);
    js_register_scene_SubModel(ns);
    js_register_scene_Pass(ns);
    js_register_scene_BakedAnimInfo(ns);
    js_register_scene_BakedJointInfo(ns);
    js_register_scene_BakedSkinningModel(ns);
    js_register_scene_DrawCall(ns);
    js_register_scene_DrawBatch2D(ns);
    js_register_scene_JointTransform(ns);
    js_register_scene_JointInfo(ns);
    js_register_scene_SkinningModel(ns);
    js_register_scene_RenderScene(ns);
    js_register_scene_RenderWindow(ns);
    js_register_scene_Camera(ns);
    js_register_scene_Sphere(ns);
    return true;
}

