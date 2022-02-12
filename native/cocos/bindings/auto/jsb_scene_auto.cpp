
// clang-format off
#include "cocos/bindings/auto/jsb_scene_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "core/data/Object.h"
#include "core/scene-graph/Node.h"
#include "core/scene-graph/Scene.h"
#include "core/scene-graph/SceneGlobals.h"
#include "scene/Light.h"
#include "scene/Fog.h"
#include "scene/Shadow.h"
#include "scene/Skybox.h"
#include "scene/DirectionalLight.h"
#include "scene/SpotLight.h"
#include "scene/SphereLight.h"
#include "scene/Model.h"
#include "scene/SubModel.h"
#include "scene/Pass.h"
#include "scene/RenderScene.h"
#include "scene/DrawBatch2D.h"
#include "scene/RenderWindow.h"
#include "scene/Camera.h"
#include "scene/Define.h"
#include "scene/Ambient.h"
#include "renderer/core/PassInstance.h"
#include "renderer/core/MaterialInstance.h"
#include "3d/models/MorphModel.h"
#include "3d/models/SkinningModel.h"
#include "3d/models/BakedSkinningModel.h"
#include "core/Root.h"
#include "renderer/core/ProgramLib.h"
#include "scene/Octree.h"
#include "cocos/bindings/auto/jsb_pipeline_auto.h"
#include "cocos/bindings/auto/jsb_cocos_auto.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_cc_BaseNode_proto = nullptr; // NOLINT
se::Class* __jsb_cc_BaseNode_class = nullptr;  // NOLINT
static bool js_cc_BaseNode_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_BaseNode_finalize)

bool js_register_scene_BaseNode(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BaseNode", obj, __jsb_cc_CCObject_proto, nullptr);

    cls->defineFinalizeFunction(_SE(js_cc_BaseNode_finalize));
    cls->install();
    JSBClassType::registerClass<cc::BaseNode>(cls);

    __jsb_cc_BaseNode_proto = cls->getProto();
    __jsb_cc_BaseNode_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_Node_proto = nullptr; // NOLINT
se::Class* __jsb_cc_Node_class = nullptr;  // NOLINT

static bool js_scene_Node__setChildren(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node__setChildren : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::IntrusivePtr<cc::Node>>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node__setChildren : Error processing arguments");
        cobj->_setChildren(std::move(arg0.value()));
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Node__setChildren)

static bool js_scene_Node_addChild(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_addChild : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_addChild : Error processing arguments");
        cobj->addChild(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Node_addChild)

static bool js_scene_Node_destroyAllChildren(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_destroyAllChildren : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroyAllChildren();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Node_destroyAllChildren)

static bool js_scene_Node_getAngle(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_getAngle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getAngle();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Node_getAngle : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Node_getAngle)

static bool js_scene_Node_getChangedFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_getChangedFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getChangedFlags();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Node_getChangedFlags : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Node_getChangedFlags)

static bool js_scene_Node_getChildByName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_getChildByName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_getChildByName : Error processing arguments");
        cc::Node* result = cobj->getChildByName(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Node_getChildByName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Node_getChildByName)

static bool js_scene_Node_getChildByPath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_getChildByPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_getChildByPath : Error processing arguments");
        cc::Node* result = cobj->getChildByPath(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Node_getChildByPath : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Node_getChildByPath)

static bool js_scene_Node_getChildByUuid(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_getChildByUuid : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_getChildByUuid : Error processing arguments");
        cc::Node* result = cobj->getChildByUuid(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Node_getChildByUuid : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Node_getChildByUuid)

static bool js_scene_Node_getDirtyFlag(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_getDirtyFlag : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getDirtyFlag();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Node_getDirtyFlag : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Node_getDirtyFlag)

static bool js_scene_Node_getEventMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_getEventMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getEventMask();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Node_getEventMask : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Node_getEventMask)

static bool js_scene_Node_getLayer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_getLayer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getLayer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Node_getLayer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Node_getLayer)

static bool js_scene_Node_getParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Node* result = cobj->getParent();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Node_getParent : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Node_getParent)

static bool js_scene_Node_getScene(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_getScene : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Scene* result = cobj->getScene();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Node_getScene : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Node_getScene)

static bool js_scene_Node_getSiblingIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_getSiblingIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getSiblingIndex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Node_getSiblingIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Node_getSiblingIndex)

static bool js_scene_Node_getUuid(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_getUuid : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getUuid();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Node_getUuid : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Node_getUuid)

static bool js_scene_Node_insertChild(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_insertChild : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::Node*, false> arg0 = {};
        HolderType<int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_insertChild : Error processing arguments");
        cobj->insertChild(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Node_insertChild)

static bool js_scene_Node_invalidateChildren(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_invalidateChildren : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::TransformBit, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_invalidateChildren : Error processing arguments");
        cobj->invalidateChildren(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Node_invalidateChildren)

static bool js_scene_Node_inverseTransformPoint(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_inverseTransformPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::Vec3, true> arg0 = {};
        HolderType<cc::Vec3, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_inverseTransformPoint : Error processing arguments");
        cobj->inverseTransformPoint(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Node_inverseTransformPoint)

static bool js_scene_Node_isActive(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_isActive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isActive();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Node_isActive : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Node_isActive)

static bool js_scene_Node_isChildOf(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_isChildOf : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_isChildOf : Error processing arguments");
        bool result = cobj->isChildOf(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Node_isChildOf : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Node_isChildOf)

static bool js_scene_Node_isPersistNode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_isPersistNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isPersistNode();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Node_isPersistNode : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Node_isPersistNode)

static bool js_scene_Node_lookAt(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_lookAt : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_lookAt : Error processing arguments");
        cobj->lookAt(arg0.value());
        return true;
    }
    if (argc == 2) {
        HolderType<cc::Vec3, true> arg0 = {};
        HolderType<cc::Vec3, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_lookAt : Error processing arguments");
        cobj->lookAt(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Node_lookAt)

static bool js_scene_Node_off(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2( cobj, false, "js_scene_Node_off : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<unsigned int, true> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->off(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<unsigned int, true> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};
            HolderType<bool, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            cobj->off(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<unsigned int, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->off(arg0.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<unsigned int, true> arg0 = {};
            HolderType<bool, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            cobj->off(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<unsigned int, true> arg0 = {};
            HolderType<void*, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->off(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<unsigned int, true> arg0 = {};
            HolderType<void*, false> arg1 = {};
            HolderType<bool, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            cobj->off(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_scene_Node_off)

static bool js_scene_Node_onPostActivated(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_onPostActivated : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_onPostActivated : Error processing arguments");
        cobj->onPostActivated(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Node_onPostActivated)

static bool js_scene_Node_pauseSystemEvents(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_pauseSystemEvents : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_pauseSystemEvents : Error processing arguments");
        cobj->pauseSystemEvents(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Node_pauseSystemEvents)

static bool js_scene_Node_removeAllChildren(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_removeAllChildren : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->removeAllChildren();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Node_removeAllChildren)

static bool js_scene_Node_removeChild(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_removeChild : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_removeChild : Error processing arguments");
        cobj->removeChild(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Node_removeChild)

static bool js_scene_Node_removeFromParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_removeFromParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->removeFromParent();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Node_removeFromParent)

static bool js_scene_Node_resumeSystemEvents(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_resumeSystemEvents : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_resumeSystemEvents : Error processing arguments");
        cobj->resumeSystemEvents(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Node_resumeSystemEvents)

static bool js_scene_Node_setActive(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_setActive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_setActive : Error processing arguments");
        cobj->setActive(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Node_setActive)

static bool js_scene_Node_setAngle(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_setAngle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_setAngle : Error processing arguments");
        cobj->setAngle(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Node_setAngle)

static bool js_scene_Node_setChangedFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_setChangedFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_setChangedFlags : Error processing arguments");
        cobj->setChangedFlags(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Node_setChangedFlags)

static bool js_scene_Node_setDirtyFlag(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_setDirtyFlag : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_setDirtyFlag : Error processing arguments");
        cobj->setDirtyFlag(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Node_setDirtyFlag)

static bool js_scene_Node_setEulerAngles(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_setEulerAngles : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_setEulerAngles : Error processing arguments");
        cobj->setEulerAngles(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setEulerAngles)

static bool js_scene_Node_setEventMask(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_setEventMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_setEventMask : Error processing arguments");
        cobj->setEventMask(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setEventMask)

static bool js_scene_Node_setForward(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_setForward : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_setForward : Error processing arguments");
        cobj->setForward(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setForward)

static bool js_scene_Node_setLayer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_setLayer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_setLayer : Error processing arguments");
        cobj->setLayer(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setLayer)

static bool js_scene_Node_setMatrix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_setMatrix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Mat4, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_setMatrix : Error processing arguments");
        cobj->setMatrix(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Node_setMatrix)

static bool js_scene_Node_setParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_setParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_setParent : Error processing arguments");
        cobj->setParent(arg0.value());
        return true;
    }
    if (argc == 2) {
        HolderType<cc::Node*, false> arg0 = {};
        HolderType<bool, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_setParent : Error processing arguments");
        cobj->setParent(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setParent)

static bool js_scene_Node_setPersistNode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_setPersistNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_setPersistNode : Error processing arguments");
        cobj->setPersistNode(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Node_setPersistNode)

static bool js_scene_Node_setPositionForJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_setPositionForJS : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_scene_Node_setPositionForJS : Error processing arguments");
        cobj->setPositionForJS(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setPositionForJS)

static bool js_scene_Node_setPositionInternal(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2( cobj, false, "js_scene_Node_setPositionInternal : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 4) {
            HolderType<float, false> arg0 = {};
            HolderType<float, false> arg1 = {};
            HolderType<float, false> arg2 = {};
            HolderType<bool, false> arg3 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            cobj->setPositionInternal(arg0.value(), arg1.value(), arg2.value(), arg3.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<float, false> arg0 = {};
            HolderType<float, false> arg1 = {};
            HolderType<bool, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            cobj->setPositionInternal(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setPositionInternal)

static bool js_scene_Node_setRTSInternal(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_setRTSInternal : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<cc::Quaternion*, false> arg0 = {};
        HolderType<cc::Vec3*, false> arg1 = {};
        HolderType<cc::Vec3*, false> arg2 = {};
        HolderType<bool, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_setRTSInternal : Error processing arguments");
        cobj->setRTSInternal(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setRTSInternal)

static bool js_scene_Node_setRotationForJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_setRotationForJS : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_setRotationForJS : Error processing arguments");
        cobj->setRotationForJS(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setRotationForJS)

static bool js_scene_Node_setRotationFromEulerForJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_setRotationFromEulerForJS : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_scene_Node_setRotationFromEulerForJS : Error processing arguments");
        cobj->setRotationFromEulerForJS(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setRotationFromEulerForJS)

static bool js_scene_Node_setRotationInternal(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_setRotationInternal : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<bool, false> arg4 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_setRotationInternal : Error processing arguments");
        cobj->setRotationInternal(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setRotationInternal)

static bool js_scene_Node_setScaleForJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_setScaleForJS : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_scene_Node_setScaleForJS : Error processing arguments");
        cobj->setScaleForJS(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setScaleForJS)

static bool js_scene_Node_setScaleInternal(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2( cobj, false, "js_scene_Node_setScaleInternal : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 4) {
            HolderType<float, false> arg0 = {};
            HolderType<float, false> arg1 = {};
            HolderType<float, false> arg2 = {};
            HolderType<bool, false> arg3 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            cobj->setScaleInternal(arg0.value(), arg1.value(), arg2.value(), arg3.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<float, false> arg0 = {};
            HolderType<float, false> arg1 = {};
            HolderType<bool, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            cobj->setScaleInternal(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setScaleInternal)

static bool js_scene_Node_setSiblingIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_setSiblingIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_setSiblingIndex : Error processing arguments");
        cobj->setSiblingIndex(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setSiblingIndex)

static bool js_scene_Node_setUIPropsTransformDirtyPtr(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_setUIPropsTransformDirtyPtr : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_setUIPropsTransformDirtyPtr : Error processing arguments");
        cobj->setUIPropsTransformDirtyPtr(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setUIPropsTransformDirtyPtr)

static bool js_scene_Node_setWorldPosition(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2( cobj, false, "js_scene_Node_setWorldPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 3) {
            HolderType<float, false> arg0 = {};
            HolderType<float, false> arg1 = {};
            HolderType<float, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->setWorldPosition(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<cc::Vec3, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->setWorldPosition(arg0.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setWorldPosition)

static bool js_scene_Node_setWorldRotation(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2( cobj, false, "js_scene_Node_setWorldRotation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 4) {
            HolderType<float, false> arg0 = {};
            HolderType<float, false> arg1 = {};
            HolderType<float, false> arg2 = {};
            HolderType<float, false> arg3 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->setWorldRotation(arg0.value(), arg1.value(), arg2.value(), arg3.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<cc::Quaternion, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->setWorldRotation(arg0.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setWorldRotation)

static bool js_scene_Node_setWorldRotationFromEuler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_setWorldRotationFromEuler : Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "js_scene_Node_setWorldRotationFromEuler : Error processing arguments");
        cobj->setWorldRotationFromEuler(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setWorldRotationFromEuler)

static bool js_scene_Node_setWorldScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2( cobj, false, "js_scene_Node_setWorldScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 3) {
            HolderType<float, false> arg0 = {};
            HolderType<float, false> arg1 = {};
            HolderType<float, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->setWorldScale(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<cc::Vec3, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->setWorldScale(arg0.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setWorldScale)

static bool js_scene_Node_targetOff(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_targetOff : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_targetOff : Error processing arguments");
        cobj->targetOff(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Node_targetOff)

static bool js_scene_Node_translate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_translate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_translate : Error processing arguments");
        cobj->translate(arg0.value());
        return true;
    }
    if (argc == 2) {
        HolderType<cc::Vec3, true> arg0 = {};
        HolderType<cc::NodeSpace, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Node_translate : Error processing arguments");
        cobj->translate(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Node_translate)

static bool js_scene_Node_updateSiblingIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_updateSiblingIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateSiblingIndex();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Node_updateSiblingIndex)

static bool js_scene_Node_updateWorldTransform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_updateWorldTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateWorldTransform();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Node_updateWorldTransform)

static bool js_scene_Node_walk(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2( cobj, false, "js_scene_Node_walk : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<std::function<void (cc::Node *)>, true> arg0 = {};
            HolderType<std::function<void (cc::Node *)>, true> arg1 = {};

            do {
                if (args[0].isObject() && args[0].toObject()->isFunction())
                {
                    se::Value jsThis(s.thisObject());
                    se::Value jsFunc(args[0]);
                    jsThis.toObject()->attachObject(jsFunc.toObject());
                    auto * thisObj = s.thisObject();
                    auto lambda = [=](cc::Node* larg0) -> void {
                        se::ScriptEngine::getInstance()->clearException();
                        se::AutoHandleScope hs;
            
                        CC_UNUSED bool ok = true;
                        se::ValueArray args;
                        args.resize(1);
                        ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
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
            if (!ok) { ok = true; break; }
            do {
                if (args[1].isObject() && args[1].toObject()->isFunction())
                {
                    se::Value jsThis(s.thisObject());
                    se::Value jsFunc(args[1]);
                    jsThis.toObject()->attachObject(jsFunc.toObject());
                    auto * thisObj = s.thisObject();
                    auto lambda = [=](cc::Node* larg0) -> void {
                        se::ScriptEngine::getInstance()->clearException();
                        se::AutoHandleScope hs;
            
                        CC_UNUSED bool ok = true;
                        se::ValueArray args;
                        args.resize(1);
                        ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                        se::Value rval;
                        se::Object* funcObj = jsFunc.toObject();
                        bool succeed = funcObj->call(args, thisObj, &rval);
                        if (!succeed) {
                            se::ScriptEngine::getInstance()->clearException();
                        }
                    };
                    arg1.data = lambda;
                }
                else
                {
                    arg1.data = nullptr;
                }
            } while(false)
            ;
            if (!ok) { ok = true; break; }
            cobj->walk(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<std::function<void (cc::Node *)>, true> arg0 = {};

            do {
                if (args[0].isObject() && args[0].toObject()->isFunction())
                {
                    se::Value jsThis(s.thisObject());
                    se::Value jsFunc(args[0]);
                    jsThis.toObject()->attachObject(jsFunc.toObject());
                    auto * thisObj = s.thisObject();
                    auto lambda = [=](cc::Node* larg0) -> void {
                        se::ScriptEngine::getInstance()->clearException();
                        se::AutoHandleScope hs;
            
                        CC_UNUSED bool ok = true;
                        se::ValueArray args;
                        args.resize(1);
                        ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
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
            if (!ok) { ok = true; break; }
            cobj->walk(arg0.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_scene_Node_walk)

static bool js_scene_Node_clearNodeArray_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cc::Node::clearNodeArray();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Node_clearNodeArray_static)

static bool js_scene_Node_getIdxOfChild_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::vector<cc::IntrusivePtr<cc::Node>>, true> arg0 = {};
        HolderType<cc::Node*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_scene_Node_getIdxOfChild_static : Error processing arguments");
        int result = cc::Node::getIdxOfChild(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Node_getIdxOfChild_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Node_getIdxOfChild_static)

static bool js_scene_Node_instantiate_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::Node*, false> arg0 = {};
        HolderType<bool, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_scene_Node_instantiate_static : Error processing arguments");
        cc::Node* result = cc::Node::instantiate(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Node_instantiate_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Node_instantiate_static)

static bool js_scene_Node_resetChangedFlags_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cc::Node::resetChangedFlags();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Node_resetChangedFlags_static)

static bool js_scene_Node_setScene_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_scene_Node_setScene_static : Error processing arguments");
        cc::Node::setScene(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setScene_static)

static bool js_scene_Node_get__siblingIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_get__siblingIndex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_siblingIndex, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_siblingIndex, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Node_get__siblingIndex)

static bool js_scene_Node_set__siblingIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_set__siblingIndex : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_siblingIndex, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Node_set__siblingIndex : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Node_set__siblingIndex)

static bool js_scene_Node_get__id(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_get__id : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_id, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_id, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Node_get__id)

static bool js_scene_Node_set__id(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_set__id : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_id, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Node_set__id : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Node_set__id)

static bool js_scene_Node_get__parent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_get__parent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_parent, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_parent, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Node_get__parent)

static bool js_scene_Node_set__parent(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_set__parent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_parent, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Node_set__parent : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Node_set__parent)

static bool js_scene_Node_get__active(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_get__active : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_active, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_active, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Node_get__active)

static bool js_scene_Node_set__active(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_set__active : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_active, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Node_set__active : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_Node_set__active)

SE_DECLARE_FINALIZE_FUNC(js_cc_Node_finalize)

static bool js_scene_Node_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<std::string, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Node, arg0.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Node);
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_scene_Node_constructor, __jsb_cc_Node_class, js_cc_Node_finalize)

static bool js_cc_Node_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_Node_finalize)

bool js_register_scene_Node(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Node", obj, __jsb_cc_BaseNode_proto, _SE(js_scene_Node_constructor));

    cls->defineProperty("_siblingIndex", _SE(js_scene_Node_get__siblingIndex), _SE(js_scene_Node_set__siblingIndex));
    cls->defineProperty("_id", _SE(js_scene_Node_get__id), _SE(js_scene_Node_set__id));
    cls->defineProperty("_parentInternal", _SE(js_scene_Node_get__parent), _SE(js_scene_Node_set__parent));
    cls->defineProperty("_active", _SE(js_scene_Node_get__active), _SE(js_scene_Node_set__active));
    cls->defineProperty("uuid", _SE(js_scene_Node_getUuid_asGetter), nullptr);
    cls->defineProperty("angle", _SE(js_scene_Node_getAngle_asGetter), _SE(js_scene_Node_setAngle_asSetter));
    cls->defineProperty("matrix", nullptr, _SE(js_scene_Node_setMatrix_asSetter));
    cls->defineProperty("hasChangedFlags", _SE(js_scene_Node_getChangedFlags_asGetter), _SE(js_scene_Node_setChangedFlags_asSetter));
    cls->defineProperty("active", _SE(js_scene_Node_isActive_asGetter), _SE(js_scene_Node_setActive_asSetter));
    cls->defineProperty("_persistNode", _SE(js_scene_Node_isPersistNode_asGetter), _SE(js_scene_Node_setPersistNode_asSetter));
    cls->defineProperty("_dirtyFlags", _SE(js_scene_Node_getDirtyFlag_asGetter), _SE(js_scene_Node_setDirtyFlag_asSetter));
    cls->defineFunction("_setChildren", _SE(js_scene_Node__setChildren));
    cls->defineFunction("addChild", _SE(js_scene_Node_addChild));
    cls->defineFunction("destroyAllChildren", _SE(js_scene_Node_destroyAllChildren));
    cls->defineFunction("getChildByName", _SE(js_scene_Node_getChildByName));
    cls->defineFunction("getChildByPath", _SE(js_scene_Node_getChildByPath));
    cls->defineFunction("getChildByUuid", _SE(js_scene_Node_getChildByUuid));
    cls->defineFunction("getEventMask", _SE(js_scene_Node_getEventMask));
    cls->defineFunction("getLayer", _SE(js_scene_Node_getLayer));
    cls->defineFunction("getParent", _SE(js_scene_Node_getParent));
    cls->defineFunction("getScene", _SE(js_scene_Node_getScene));
    cls->defineFunction("getSiblingIndex", _SE(js_scene_Node_getSiblingIndex));
    cls->defineFunction("insertChild", _SE(js_scene_Node_insertChild));
    cls->defineFunction("invalidateChildren", _SE(js_scene_Node_invalidateChildren));
    cls->defineFunction("inverseTransformPoint", _SE(js_scene_Node_inverseTransformPoint));
    cls->defineFunction("isChildOf", _SE(js_scene_Node_isChildOf));
    cls->defineFunction("lookAt", _SE(js_scene_Node_lookAt));
    cls->defineFunction("off", _SE(js_scene_Node_off));
    cls->defineFunction("onPostActivated", _SE(js_scene_Node_onPostActivated));
    cls->defineFunction("pauseSystemEvents", _SE(js_scene_Node_pauseSystemEvents));
    cls->defineFunction("removeAllChildren", _SE(js_scene_Node_removeAllChildren));
    cls->defineFunction("removeChild", _SE(js_scene_Node_removeChild));
    cls->defineFunction("removeFromParent", _SE(js_scene_Node_removeFromParent));
    cls->defineFunction("resumeSystemEvents", _SE(js_scene_Node_resumeSystemEvents));
    cls->defineFunction("setEulerAngles", _SE(js_scene_Node_setEulerAngles));
    cls->defineFunction("setEventMask", _SE(js_scene_Node_setEventMask));
    cls->defineFunction("setForward", _SE(js_scene_Node_setForward));
    cls->defineFunction("setLayer", _SE(js_scene_Node_setLayer));
    cls->defineFunction("setParent", _SE(js_scene_Node_setParent));
    cls->defineFunction("setPositionForJS", _SE(js_scene_Node_setPositionForJS));
    cls->defineFunction("setPositionInternal", _SE(js_scene_Node_setPositionInternal));
    cls->defineFunction("setRTSInternal", _SE(js_scene_Node_setRTSInternal));
    cls->defineFunction("setRotationForJS", _SE(js_scene_Node_setRotationForJS));
    cls->defineFunction("setRotationFromEulerForJS", _SE(js_scene_Node_setRotationFromEulerForJS));
    cls->defineFunction("setRotationInternal", _SE(js_scene_Node_setRotationInternal));
    cls->defineFunction("setScaleForJS", _SE(js_scene_Node_setScaleForJS));
    cls->defineFunction("setScaleInternal", _SE(js_scene_Node_setScaleInternal));
    cls->defineFunction("setSiblingIndex", _SE(js_scene_Node_setSiblingIndex));
    cls->defineFunction("setUIPropsTransformDirtyPtr", _SE(js_scene_Node_setUIPropsTransformDirtyPtr));
    cls->defineFunction("setWorldPosition", _SE(js_scene_Node_setWorldPosition));
    cls->defineFunction("setWorldRotation", _SE(js_scene_Node_setWorldRotation));
    cls->defineFunction("setWorldRotationFromEuler", _SE(js_scene_Node_setWorldRotationFromEuler));
    cls->defineFunction("setWorldScale", _SE(js_scene_Node_setWorldScale));
    cls->defineFunction("targetOff", _SE(js_scene_Node_targetOff));
    cls->defineFunction("translate", _SE(js_scene_Node_translate));
    cls->defineFunction("_updateSiblingIndex", _SE(js_scene_Node_updateSiblingIndex));
    cls->defineFunction("updateWorldTransform", _SE(js_scene_Node_updateWorldTransform));
    cls->defineFunction("walk", _SE(js_scene_Node_walk));
    cls->defineStaticFunction("clearNodeArray", _SE(js_scene_Node_clearNodeArray_static));
    cls->defineStaticFunction("getIdxOfChild", _SE(js_scene_Node_getIdxOfChild_static));
    cls->defineStaticFunction("instantiate", _SE(js_scene_Node_instantiate_static));
    cls->defineStaticFunction("resetHasChangedFlags", _SE(js_scene_Node_resetChangedFlags_static));
    cls->defineStaticFunction("setScene", _SE(js_scene_Node_setScene_static));
    cls->defineFinalizeFunction(_SE(js_cc_Node_finalize));
    cls->install();
    JSBClassType::registerClass<cc::Node>(cls);

    __jsb_cc_Node_proto = cls->getProto();
    __jsb_cc_Node_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_Scene_proto = nullptr; // NOLINT
se::Class* __jsb_cc_Scene_class = nullptr;  // NOLINT

static bool js_scene_Scene_activate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Scene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Scene_activate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->activate();
        return true;
    }
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Scene_activate : Error processing arguments");
        cobj->activate(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Scene_activate)

static bool js_scene_Scene_getRenderScene(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Scene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Scene_getRenderScene : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::RenderScene* result = cobj->getRenderScene();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Scene_getRenderScene : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Scene_getRenderScene)

static bool js_scene_Scene_getSceneGlobals(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Scene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Scene_getSceneGlobals : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::SceneGlobals* result = cobj->getSceneGlobals();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Scene_getSceneGlobals : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Scene_getSceneGlobals)

static bool js_scene_Scene_isAutoReleaseAssets(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Scene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Scene_isAutoReleaseAssets : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isAutoReleaseAssets();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Scene_isAutoReleaseAssets : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Scene_isAutoReleaseAssets)

static bool js_scene_Scene_load(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Scene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Scene_load : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->load();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Scene_load)

static bool js_scene_Scene_onBatchCreated(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Scene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Scene_onBatchCreated : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Scene_onBatchCreated : Error processing arguments");
        cobj->onBatchCreated(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Scene_onBatchCreated)

static bool js_scene_Scene_setAutoReleaseAssets(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Scene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Scene_setAutoReleaseAssets : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Scene_setAutoReleaseAssets : Error processing arguments");
        cobj->setAutoReleaseAssets(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Scene_setAutoReleaseAssets)

static bool js_scene_Scene_setSceneGlobals(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Scene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Scene_setSceneGlobals : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::SceneGlobals*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Scene_setSceneGlobals : Error processing arguments");
        cobj->setSceneGlobals(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Scene_setSceneGlobals)

SE_DECLARE_FINALIZE_FUNC(js_cc_Scene_finalize)

static bool js_scene_Scene_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Scene);
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 1) {
            HolderType<std::string, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Scene, arg0.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_scene_Scene_constructor, __jsb_cc_Scene_class, js_cc_Scene_finalize)

static bool js_cc_Scene_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_Scene_finalize)

bool js_register_scene_Scene(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Scene", obj, __jsb_cc_Node_proto, _SE(js_scene_Scene_constructor));

    cls->defineProperty("autoReleaseAssets", _SE(js_scene_Scene_isAutoReleaseAssets_asGetter), _SE(js_scene_Scene_setAutoReleaseAssets_asSetter));
    cls->defineFunction("_activate", _SE(js_scene_Scene_activate));
    cls->defineFunction("getRenderScene", _SE(js_scene_Scene_getRenderScene));
    cls->defineFunction("getSceneGlobals", _SE(js_scene_Scene_getSceneGlobals));
    cls->defineFunction("_load", _SE(js_scene_Scene_load));
    cls->defineFunction("onBatchCreated", _SE(js_scene_Scene_onBatchCreated));
    cls->defineFunction("setSceneGlobals", _SE(js_scene_Scene_setSceneGlobals));
    cls->defineFinalizeFunction(_SE(js_cc_Scene_finalize));
    cls->install();
    JSBClassType::registerClass<cc::Scene>(cls);

    __jsb_cc_Scene_proto = cls->getProto();
    __jsb_cc_Scene_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_SceneGlobals_proto = nullptr; // NOLINT
se::Class* __jsb_cc_SceneGlobals_class = nullptr;  // NOLINT

static bool js_scene_SceneGlobals_activate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SceneGlobals>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SceneGlobals_activate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->activate();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SceneGlobals_activate)

static bool js_scene_SceneGlobals_getAmbientInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SceneGlobals>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SceneGlobals_getAmbientInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::AmbientInfo* result = cobj->getAmbientInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SceneGlobals_getAmbientInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SceneGlobals_getAmbientInfo)

static bool js_scene_SceneGlobals_getFogInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SceneGlobals>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SceneGlobals_getFogInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::FogInfo* result = cobj->getFogInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SceneGlobals_getFogInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SceneGlobals_getFogInfo)

static bool js_scene_SceneGlobals_getOctreeInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SceneGlobals>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SceneGlobals_getOctreeInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::OctreeInfo* result = cobj->getOctreeInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SceneGlobals_getOctreeInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SceneGlobals_getOctreeInfo)

static bool js_scene_SceneGlobals_getShadowsInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SceneGlobals>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SceneGlobals_getShadowsInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::ShadowsInfo* result = cobj->getShadowsInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SceneGlobals_getShadowsInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SceneGlobals_getShadowsInfo)

static bool js_scene_SceneGlobals_getSkyboxInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SceneGlobals>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SceneGlobals_getSkyboxInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::SkyboxInfo* result = cobj->getSkyboxInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SceneGlobals_getSkyboxInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SceneGlobals_getSkyboxInfo)

static bool js_scene_SceneGlobals_setAmbientInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SceneGlobals>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SceneGlobals_setAmbientInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::AmbientInfo*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SceneGlobals_setAmbientInfo : Error processing arguments");
        cobj->setAmbientInfo(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SceneGlobals_setAmbientInfo)

static bool js_scene_SceneGlobals_setFogInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SceneGlobals>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SceneGlobals_setFogInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::FogInfo*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SceneGlobals_setFogInfo : Error processing arguments");
        cobj->setFogInfo(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SceneGlobals_setFogInfo)

static bool js_scene_SceneGlobals_setOctreeInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SceneGlobals>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SceneGlobals_setOctreeInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::OctreeInfo*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SceneGlobals_setOctreeInfo : Error processing arguments");
        cobj->setOctreeInfo(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SceneGlobals_setOctreeInfo)

static bool js_scene_SceneGlobals_setShadowsInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SceneGlobals>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SceneGlobals_setShadowsInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::ShadowsInfo*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SceneGlobals_setShadowsInfo : Error processing arguments");
        cobj->setShadowsInfo(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SceneGlobals_setShadowsInfo)

static bool js_scene_SceneGlobals_setSkyboxInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SceneGlobals>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SceneGlobals_setSkyboxInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::SkyboxInfo*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SceneGlobals_setSkyboxInfo : Error processing arguments");
        cobj->setSkyboxInfo(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SceneGlobals_setSkyboxInfo)

SE_DECLARE_FINALIZE_FUNC(js_cc_SceneGlobals_finalize)

static bool js_scene_SceneGlobals_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::SceneGlobals);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_SceneGlobals_constructor, __jsb_cc_SceneGlobals_class, js_cc_SceneGlobals_finalize)

static bool js_cc_SceneGlobals_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_SceneGlobals_finalize)

bool js_register_scene_SceneGlobals(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SceneGlobals", obj, nullptr, _SE(js_scene_SceneGlobals_constructor));

    cls->defineFunction("activate", _SE(js_scene_SceneGlobals_activate));
    cls->defineFunction("getAmbientInfo", _SE(js_scene_SceneGlobals_getAmbientInfo));
    cls->defineFunction("getFogInfo", _SE(js_scene_SceneGlobals_getFogInfo));
    cls->defineFunction("getOctreeInfo", _SE(js_scene_SceneGlobals_getOctreeInfo));
    cls->defineFunction("getShadowsInfo", _SE(js_scene_SceneGlobals_getShadowsInfo));
    cls->defineFunction("getSkyboxInfo", _SE(js_scene_SceneGlobals_getSkyboxInfo));
    cls->defineFunction("setAmbientInfo", _SE(js_scene_SceneGlobals_setAmbientInfo));
    cls->defineFunction("setFogInfo", _SE(js_scene_SceneGlobals_setFogInfo));
    cls->defineFunction("setOctreeInfo", _SE(js_scene_SceneGlobals_setOctreeInfo));
    cls->defineFunction("setShadowsInfo", _SE(js_scene_SceneGlobals_setShadowsInfo));
    cls->defineFunction("setSkyboxInfo", _SE(js_scene_SceneGlobals_setSkyboxInfo));
    cls->defineFinalizeFunction(_SE(js_cc_SceneGlobals_finalize));
    cls->install();
    JSBClassType::registerClass<cc::SceneGlobals>(cls);

    __jsb_cc_SceneGlobals_proto = cls->getProto();
    __jsb_cc_SceneGlobals_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Light_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_Light_class = nullptr;  // NOLINT

static bool js_scene_Light_attachToScene(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_attachToScene : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::RenderScene*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Light_attachToScene : Error processing arguments");
        cobj->attachToScene(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Light_attachToScene)

static bool js_scene_Light_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Light_destroy)

static bool js_scene_Light_detachFromScene(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_detachFromScene : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->detachFromScene();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Light_detachFromScene)

static bool js_scene_Light_getColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_getColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec3& result = cobj->getColor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Light_getColor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Light_getColor)

static bool js_scene_Light_getColorTemperature(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_getColorTemperature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getColorTemperature();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Light_getColorTemperature : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Light_getColorTemperature)

static bool js_scene_Light_getColorTemperatureRGB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_getColorTemperatureRGB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec3& result = cobj->getColorTemperatureRGB();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Light_getColorTemperatureRGB : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Light_getColorTemperatureRGB)

static bool js_scene_Light_getName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Light_getName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Light_getName)

static bool js_scene_Light_getNode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_getNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Node* result = cobj->getNode();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Light_getNode : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Light_getNode)

static bool js_scene_Light_getScene(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_getScene : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::RenderScene* result = cobj->getScene();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Light_getScene : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Light_getScene)

static bool js_scene_Light_getType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getType());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Light_getType : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Light_getType)

static bool js_scene_Light_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->initialize();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Light_initialize)

static bool js_scene_Light_isBaked(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_isBaked : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isBaked();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Light_isBaked : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Light_isBaked)

static bool js_scene_Light_isUseColorTemperature(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_isUseColorTemperature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isUseColorTemperature();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Light_isUseColorTemperature : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Light_isUseColorTemperature)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_Light_setBaked)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_Light_setColor)

static bool js_scene_Light_setColorTemperature(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_setColorTemperature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Light_setColorTemperature : Error processing arguments");
        cobj->setColorTemperature(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Light_setColorTemperature)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_Light_setColorTemperatureRGB)

static bool js_scene_Light_setName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_setName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Light_setName : Error processing arguments");
        cobj->setName(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Light_setName)

static bool js_scene_Light_setNode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Light>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Light_setNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Light_setNode : Error processing arguments");
        cobj->setNode(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Light_setNode)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_Light_setType)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_Light_setUseColorTemperature)

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

static bool js_scene_Light_nt2lm_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_scene_Light_nt2lm_static : Error processing arguments");
        float result = cc::scene::Light::nt2lm(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Light_nt2lm_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Light_nt2lm_static)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Light_finalize)

static bool js_scene_Light_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::Light);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_Light_constructor, __jsb_cc_scene_Light_class, js_cc_scene_Light_finalize)

static bool js_cc_scene_Light_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Light_finalize)

bool js_register_scene_Light(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Light", obj, nullptr, _SE(js_scene_Light_constructor));

    cls->defineProperty("baked", _SE(js_scene_Light_isBaked_asGetter), _SE(js_scene_Light_setBaked_asSetter));
    cls->defineProperty("color", _SE(js_scene_Light_getColor_asGetter), _SE(js_scene_Light_setColor_asSetter));
    cls->defineProperty("useColorTemperature", _SE(js_scene_Light_isUseColorTemperature_asGetter), _SE(js_scene_Light_setUseColorTemperature_asSetter));
    cls->defineProperty("colorTemperature", _SE(js_scene_Light_getColorTemperature_asGetter), _SE(js_scene_Light_setColorTemperature_asSetter));
    cls->defineProperty("colorTemperatureRGB", _SE(js_scene_Light_getColorTemperatureRGB_asGetter), _SE(js_scene_Light_setColorTemperatureRGB_asSetter));
    cls->defineProperty("node", _SE(js_scene_Light_getNode_asGetter), _SE(js_scene_Light_setNode_asSetter));
    cls->defineProperty("type", _SE(js_scene_Light_getType_asGetter), _SE(js_scene_Light_setType_asSetter));
    cls->defineProperty("name", _SE(js_scene_Light_getName_asGetter), _SE(js_scene_Light_setName_asSetter));
    cls->defineProperty("scene", _SE(js_scene_Light_getScene_asGetter), nullptr);
    cls->defineFunction("attachToScene", _SE(js_scene_Light_attachToScene));
    cls->defineFunction("destroy", _SE(js_scene_Light_destroy));
    cls->defineFunction("detachFromScene", _SE(js_scene_Light_detachFromScene));
    cls->defineFunction("initialize", _SE(js_scene_Light_initialize));
    cls->defineFunction("update", _SE(js_scene_Light_update));
    cls->defineStaticFunction("nt2lm", _SE(js_scene_Light_nt2lm_static));
    cls->defineFinalizeFunction(_SE(js_cc_scene_Light_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Light>(cls);

    __jsb_cc_scene_Light_proto = cls->getProto();
    __jsb_cc_scene_Light_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Fog_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_Fog_class = nullptr;  // NOLINT

static bool js_scene_Fog_activate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_activate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->activate();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Fog_activate)

static bool js_scene_Fog_getColorArray(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_getColorArray : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec4& result = cobj->getColorArray();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Fog_getColorArray : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Fog_getColorArray)

static bool js_scene_Fog_getFogAtten(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_getFogAtten : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFogAtten();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Fog_getFogAtten : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Fog_getFogAtten)

static bool js_scene_Fog_getFogColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_getFogColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Color& result = cobj->getFogColor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Fog_getFogColor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Fog_getFogColor)

static bool js_scene_Fog_getFogDensity(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_getFogDensity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFogDensity();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Fog_getFogDensity : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Fog_getFogDensity)

static bool js_scene_Fog_getFogEnd(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_getFogEnd : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFogEnd();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Fog_getFogEnd : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Fog_getFogEnd)

static bool js_scene_Fog_getFogRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_getFogRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFogRange();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Fog_getFogRange : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Fog_getFogRange)

static bool js_scene_Fog_getFogStart(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_getFogStart : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFogStart();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Fog_getFogStart : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Fog_getFogStart)

static bool js_scene_Fog_getFogTop(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_getFogTop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFogTop();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Fog_getFogTop : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Fog_getFogTop)

static bool js_scene_Fog_getType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getType());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Fog_getType : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Fog_getType)

static bool js_scene_Fog_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::FogInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Fog_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Fog_initialize)

static bool js_scene_Fog_isAccurate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_isAccurate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isAccurate();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Fog_isAccurate : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Fog_isAccurate)

static bool js_scene_Fog_isEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_isEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isEnabled();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Fog_isEnabled : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Fog_isEnabled)

static bool js_scene_Fog_setAccurate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_setAccurate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Fog_setAccurate : Error processing arguments");
        cobj->setAccurate(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Fog_setAccurate)

static bool js_scene_Fog_setEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_setEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Fog_setEnabled : Error processing arguments");
        cobj->setEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Fog_setEnabled)

static bool js_scene_Fog_setFogAtten(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_setFogAtten : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Fog_setFogAtten : Error processing arguments");
        cobj->setFogAtten(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Fog_setFogAtten)

static bool js_scene_Fog_setFogColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_setFogColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Color, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Fog_setFogColor : Error processing arguments");
        cobj->setFogColor(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Fog_setFogColor)

static bool js_scene_Fog_setFogDensity(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_setFogDensity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Fog_setFogDensity : Error processing arguments");
        cobj->setFogDensity(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Fog_setFogDensity)

static bool js_scene_Fog_setFogEnd(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_setFogEnd : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Fog_setFogEnd : Error processing arguments");
        cobj->setFogEnd(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Fog_setFogEnd)

static bool js_scene_Fog_setFogStart(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_setFogStart : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Fog_setFogStart : Error processing arguments");
        cobj->setFogStart(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Fog_setFogStart)

static bool js_scene_Fog_setFogTop(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_setFogTop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Fog_setFogTop : Error processing arguments");
        cobj->setFogTop(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Fog_setFogTop)

static bool js_scene_Fog_setType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_setType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::FogType, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Fog_setType : Error processing arguments");
        cobj->setType(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Fog_setType)

static bool js_scene_Fog_setfogRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Fog>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Fog_setfogRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Fog_setfogRange : Error processing arguments");
        cobj->setfogRange(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Fog_setfogRange)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Fog_finalize)

static bool js_scene_Fog_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::Fog);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_Fog_constructor, __jsb_cc_scene_Fog_class, js_cc_scene_Fog_finalize)

static bool js_cc_scene_Fog_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Fog_finalize)

bool js_register_scene_Fog(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Fog", obj, nullptr, _SE(js_scene_Fog_constructor));

    cls->defineProperty("enabled", _SE(js_scene_Fog_isEnabled_asGetter), _SE(js_scene_Fog_setEnabled_asSetter));
    cls->defineProperty("fogColor", _SE(js_scene_Fog_getFogColor_asGetter), _SE(js_scene_Fog_setFogColor_asSetter));
    cls->defineProperty("type", _SE(js_scene_Fog_getType_asGetter), _SE(js_scene_Fog_setType_asSetter));
    cls->defineProperty("fogDensity", _SE(js_scene_Fog_getFogDensity_asGetter), _SE(js_scene_Fog_setFogDensity_asSetter));
    cls->defineProperty("fogStart", _SE(js_scene_Fog_getFogStart_asGetter), _SE(js_scene_Fog_setFogStart_asSetter));
    cls->defineProperty("fogEnd", _SE(js_scene_Fog_getFogEnd_asGetter), _SE(js_scene_Fog_setFogEnd_asSetter));
    cls->defineProperty("fogAtten", _SE(js_scene_Fog_getFogAtten_asGetter), _SE(js_scene_Fog_setFogAtten_asSetter));
    cls->defineProperty("fogTop", _SE(js_scene_Fog_getFogTop_asGetter), _SE(js_scene_Fog_setFogTop_asSetter));
    cls->defineProperty("fogRange", _SE(js_scene_Fog_getFogRange_asGetter), nullptr);
    cls->defineProperty("colorArray", _SE(js_scene_Fog_getColorArray_asGetter), nullptr);
    cls->defineFunction("activate", _SE(js_scene_Fog_activate));
    cls->defineFunction("initialize", _SE(js_scene_Fog_initialize));
    cls->defineFunction("isAccurate", _SE(js_scene_Fog_isAccurate));
    cls->defineFunction("setAccurate", _SE(js_scene_Fog_setAccurate));
    cls->defineFunction("setfogRange", _SE(js_scene_Fog_setfogRange));
    cls->defineFinalizeFunction(_SE(js_cc_scene_Fog_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Fog>(cls);

    __jsb_cc_scene_Fog_proto = cls->getProto();
    __jsb_cc_scene_Fog_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_FogInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_FogInfo_class = nullptr;  // NOLINT

static bool js_scene_FogInfo_activate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_activate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Fog*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_activate : Error processing arguments");
        cobj->activate(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_FogInfo_activate)

static bool js_scene_FogInfo_getFogAtten(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_getFogAtten : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFogAtten();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_getFogAtten : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_FogInfo_getFogAtten)

static bool js_scene_FogInfo_getFogColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_getFogColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Color& result = cobj->getFogColor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_getFogColor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_FogInfo_getFogColor)

static bool js_scene_FogInfo_getFogDensity(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_getFogDensity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFogDensity();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_getFogDensity : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_FogInfo_getFogDensity)

static bool js_scene_FogInfo_getFogEnd(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_getFogEnd : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFogEnd();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_getFogEnd : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_FogInfo_getFogEnd)

static bool js_scene_FogInfo_getFogRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_getFogRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFogRange();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_getFogRange : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_FogInfo_getFogRange)

static bool js_scene_FogInfo_getFogStart(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_getFogStart : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFogStart();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_getFogStart : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_FogInfo_getFogStart)

static bool js_scene_FogInfo_getFogTop(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_getFogTop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFogTop();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_getFogTop : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_FogInfo_getFogTop)

static bool js_scene_FogInfo_getType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getType());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_getType : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_FogInfo_getType)

static bool js_scene_FogInfo_isAccurate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_isAccurate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isAccurate();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_isAccurate : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_FogInfo_isAccurate)

static bool js_scene_FogInfo_isEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_isEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isEnabled();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_isEnabled : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_FogInfo_isEnabled)

static bool js_scene_FogInfo_setAccurate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_setAccurate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_setAccurate : Error processing arguments");
        cobj->setAccurate(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_FogInfo_setAccurate)

static bool js_scene_FogInfo_setEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_setEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_setEnabled : Error processing arguments");
        cobj->setEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_FogInfo_setEnabled)

static bool js_scene_FogInfo_setFogAtten(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_setFogAtten : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_setFogAtten : Error processing arguments");
        cobj->setFogAtten(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_FogInfo_setFogAtten)

static bool js_scene_FogInfo_setFogColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_setFogColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Color, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_setFogColor : Error processing arguments");
        cobj->setFogColor(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_FogInfo_setFogColor)

static bool js_scene_FogInfo_setFogDensity(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_setFogDensity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_setFogDensity : Error processing arguments");
        cobj->setFogDensity(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_FogInfo_setFogDensity)

static bool js_scene_FogInfo_setFogEnd(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_setFogEnd : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_setFogEnd : Error processing arguments");
        cobj->setFogEnd(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_FogInfo_setFogEnd)

static bool js_scene_FogInfo_setFogRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_setFogRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_setFogRange : Error processing arguments");
        cobj->setFogRange(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_FogInfo_setFogRange)

static bool js_scene_FogInfo_setFogStart(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_setFogStart : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_setFogStart : Error processing arguments");
        cobj->setFogStart(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_FogInfo_setFogStart)

static bool js_scene_FogInfo_setFogTop(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_setFogTop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_setFogTop : Error processing arguments");
        cobj->setFogTop(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_FogInfo_setFogTop)

static bool js_scene_FogInfo_setType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_setType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::FogType, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_FogInfo_setType : Error processing arguments");
        cobj->setType(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_FogInfo_setType)

static bool js_scene_FogInfo_get__type(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_get__type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_type, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_FogInfo_get__type)

static bool js_scene_FogInfo_set__type(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_set__type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_type, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_FogInfo_set__type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_FogInfo_set__type)

static bool js_scene_FogInfo_get__fogColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_get__fogColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_fogColor, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_fogColor, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_FogInfo_get__fogColor)

static bool js_scene_FogInfo_set__fogColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_set__fogColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_fogColor, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_FogInfo_set__fogColor : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_FogInfo_set__fogColor)

static bool js_scene_FogInfo_get__isEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_get__isEnabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_isEnabled, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_isEnabled, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_FogInfo_get__isEnabled)

static bool js_scene_FogInfo_set__isEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_set__isEnabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_isEnabled, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_FogInfo_set__isEnabled : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_FogInfo_set__isEnabled)

static bool js_scene_FogInfo_get__fogDensity(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_get__fogDensity : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_fogDensity, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_fogDensity, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_FogInfo_get__fogDensity)

static bool js_scene_FogInfo_set__fogDensity(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_set__fogDensity : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_fogDensity, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_FogInfo_set__fogDensity : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_FogInfo_set__fogDensity)

static bool js_scene_FogInfo_get__fogStart(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_get__fogStart : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_fogStart, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_fogStart, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_FogInfo_get__fogStart)

static bool js_scene_FogInfo_set__fogStart(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_set__fogStart : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_fogStart, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_FogInfo_set__fogStart : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_FogInfo_set__fogStart)

static bool js_scene_FogInfo_get__fogEnd(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_get__fogEnd : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_fogEnd, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_fogEnd, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_FogInfo_get__fogEnd)

static bool js_scene_FogInfo_set__fogEnd(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_set__fogEnd : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_fogEnd, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_FogInfo_set__fogEnd : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_FogInfo_set__fogEnd)

static bool js_scene_FogInfo_get__fogAtten(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_get__fogAtten : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_fogAtten, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_fogAtten, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_FogInfo_get__fogAtten)

static bool js_scene_FogInfo_set__fogAtten(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_set__fogAtten : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_fogAtten, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_FogInfo_set__fogAtten : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_FogInfo_set__fogAtten)

static bool js_scene_FogInfo_get__fogTop(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_get__fogTop : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_fogTop, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_fogTop, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_FogInfo_get__fogTop)

static bool js_scene_FogInfo_set__fogTop(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_set__fogTop : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_fogTop, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_FogInfo_set__fogTop : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_FogInfo_set__fogTop)

static bool js_scene_FogInfo_get__fogRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_get__fogRange : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_fogRange, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_fogRange, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_FogInfo_get__fogRange)

static bool js_scene_FogInfo_set__fogRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_set__fogRange : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_fogRange, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_FogInfo_set__fogRange : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_FogInfo_set__fogRange)

static bool js_scene_FogInfo_get__accurate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_get__accurate : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_accurate, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_accurate, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_FogInfo_get__accurate)

static bool js_scene_FogInfo_set__accurate(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::FogInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_FogInfo_set__accurate : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_accurate, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_FogInfo_set__accurate : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_FogInfo_set__accurate)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_FogInfo_finalize)

static bool js_scene_FogInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::FogInfo);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_FogInfo_constructor, __jsb_cc_scene_FogInfo_class, js_cc_scene_FogInfo_finalize)

static bool js_cc_scene_FogInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_FogInfo_finalize)

bool js_register_scene_FogInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("FogInfo", obj, nullptr, _SE(js_scene_FogInfo_constructor));

    cls->defineProperty("_type", _SE(js_scene_FogInfo_get__type), _SE(js_scene_FogInfo_set__type));
    cls->defineProperty("_fogColor", _SE(js_scene_FogInfo_get__fogColor), _SE(js_scene_FogInfo_set__fogColor));
    cls->defineProperty("_enabled", _SE(js_scene_FogInfo_get__isEnabled), _SE(js_scene_FogInfo_set__isEnabled));
    cls->defineProperty("_fogDensity", _SE(js_scene_FogInfo_get__fogDensity), _SE(js_scene_FogInfo_set__fogDensity));
    cls->defineProperty("_fogStart", _SE(js_scene_FogInfo_get__fogStart), _SE(js_scene_FogInfo_set__fogStart));
    cls->defineProperty("_fogEnd", _SE(js_scene_FogInfo_get__fogEnd), _SE(js_scene_FogInfo_set__fogEnd));
    cls->defineProperty("_fogAtten", _SE(js_scene_FogInfo_get__fogAtten), _SE(js_scene_FogInfo_set__fogAtten));
    cls->defineProperty("_fogTop", _SE(js_scene_FogInfo_get__fogTop), _SE(js_scene_FogInfo_set__fogTop));
    cls->defineProperty("_fogRange", _SE(js_scene_FogInfo_get__fogRange), _SE(js_scene_FogInfo_set__fogRange));
    cls->defineProperty("_accurate", _SE(js_scene_FogInfo_get__accurate), _SE(js_scene_FogInfo_set__accurate));
    cls->defineProperty("type", _SE(js_scene_FogInfo_getType_asGetter), _SE(js_scene_FogInfo_setType_asSetter));
    cls->defineProperty("fogColor", _SE(js_scene_FogInfo_getFogColor_asGetter), _SE(js_scene_FogInfo_setFogColor_asSetter));
    cls->defineProperty("enable", _SE(js_scene_FogInfo_isEnabled_asGetter), _SE(js_scene_FogInfo_setEnabled_asSetter));
    cls->defineProperty("accurate", _SE(js_scene_FogInfo_isAccurate_asGetter), _SE(js_scene_FogInfo_setAccurate_asSetter));
    cls->defineProperty("fogDensity", _SE(js_scene_FogInfo_getFogDensity_asGetter), _SE(js_scene_FogInfo_setFogDensity_asSetter));
    cls->defineProperty("fogStart", _SE(js_scene_FogInfo_getFogStart_asGetter), _SE(js_scene_FogInfo_setFogStart_asSetter));
    cls->defineProperty("fogEnd", _SE(js_scene_FogInfo_getFogEnd_asGetter), _SE(js_scene_FogInfo_setFogEnd_asSetter));
    cls->defineProperty("fogAtten", _SE(js_scene_FogInfo_getFogAtten_asGetter), _SE(js_scene_FogInfo_setFogAtten_asSetter));
    cls->defineProperty("fogTop", _SE(js_scene_FogInfo_getFogTop_asGetter), _SE(js_scene_FogInfo_setFogTop_asSetter));
    cls->defineProperty("fogRange", _SE(js_scene_FogInfo_getFogRange_asGetter), _SE(js_scene_FogInfo_setFogRange_asSetter));
    cls->defineFunction("activate", _SE(js_scene_FogInfo_activate));
    cls->defineFinalizeFunction(_SE(js_cc_scene_FogInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::FogInfo>(cls);

    __jsb_cc_scene_FogInfo_proto = cls->getProto();
    __jsb_cc_scene_FogInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_IMacroPatch_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_IMacroPatch_class = nullptr;  // NOLINT

static bool js_scene_IMacroPatch_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::IMacroPatch>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IMacroPatch_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_IMacroPatch_get_name)

static bool js_scene_IMacroPatch_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::IMacroPatch>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IMacroPatch_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_IMacroPatch_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_IMacroPatch_set_name)

static bool js_scene_IMacroPatch_get_value(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::IMacroPatch>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IMacroPatch_get_value : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->value, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->value, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_IMacroPatch_get_value)

static bool js_scene_IMacroPatch_set_value(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::IMacroPatch>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IMacroPatch_set_value : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->value, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_IMacroPatch_set_value : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_IMacroPatch_set_value)


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::IMacroPatch * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::IMacroPatch*>(json->getPrivateData());
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
    json->getProperty("value", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->value), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_IMacroPatch_finalize)

static bool js_scene_IMacroPatch_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::IMacroPatch);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::IMacroPatch);
        auto cobj = ptr->get<cc::scene::IMacroPatch>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::IMacroPatch);
    auto cobj = ptr->get<cc::scene::IMacroPatch>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->name), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->value), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_IMacroPatch_constructor, __jsb_cc_scene_IMacroPatch_class, js_cc_scene_IMacroPatch_finalize)

static bool js_cc_scene_IMacroPatch_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_IMacroPatch_finalize)

bool js_register_scene_IMacroPatch(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IMacroPatch", obj, nullptr, _SE(js_scene_IMacroPatch_constructor));

    cls->defineProperty("name", _SE(js_scene_IMacroPatch_get_name), _SE(js_scene_IMacroPatch_set_name));
    cls->defineProperty("value", _SE(js_scene_IMacroPatch_get_value), _SE(js_scene_IMacroPatch_set_value));
    cls->defineFinalizeFunction(_SE(js_cc_scene_IMacroPatch_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::IMacroPatch>(cls);

    __jsb_cc_scene_IMacroPatch_proto = cls->getProto();
    __jsb_cc_scene_IMacroPatch_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_ShadowsInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_ShadowsInfo_class = nullptr;  // NOLINT

static bool js_scene_ShadowsInfo_activate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_activate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Shadows*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_activate : Error processing arguments");
        cobj->activate(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_ShadowsInfo_activate)

static bool js_scene_ShadowsInfo_getBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_getBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getBias();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_getBias : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_ShadowsInfo_getBias)

static bool js_scene_ShadowsInfo_getDistance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_getDistance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getDistance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_getDistance : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_ShadowsInfo_getDistance)

static bool js_scene_ShadowsInfo_getFar(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_getFar : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFar();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_getFar : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_ShadowsInfo_getFar)

static bool js_scene_ShadowsInfo_getInvisibleOcclusionRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_getInvisibleOcclusionRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getInvisibleOcclusionRange();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_getInvisibleOcclusionRange : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_ShadowsInfo_getInvisibleOcclusionRange)

static bool js_scene_ShadowsInfo_getMaxReceived(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_getMaxReceived : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMaxReceived();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_getMaxReceived : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_ShadowsInfo_getMaxReceived)

static bool js_scene_ShadowsInfo_getNear(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_getNear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getNear();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_getNear : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_ShadowsInfo_getNear)

static bool js_scene_ShadowsInfo_getNormal(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_getNormal : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec3& result = cobj->getNormal();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_getNormal : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_ShadowsInfo_getNormal)

static bool js_scene_ShadowsInfo_getNormalBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_getNormalBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getNormalBias();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_getNormalBias : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_ShadowsInfo_getNormalBias)

static bool js_scene_ShadowsInfo_getOrthoSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_getOrthoSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getOrthoSize();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_getOrthoSize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_ShadowsInfo_getOrthoSize)

static bool js_scene_ShadowsInfo_getPcf(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_getPcf : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getPcf());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_getPcf : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_ShadowsInfo_getPcf)

static bool js_scene_ShadowsInfo_getSaturation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_getSaturation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getSaturation();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_getSaturation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_ShadowsInfo_getSaturation)

static bool js_scene_ShadowsInfo_getShadowColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_getShadowColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Color& result = cobj->getShadowColor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_getShadowColor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_ShadowsInfo_getShadowColor)

static bool js_scene_ShadowsInfo_getShadowDistance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_getShadowDistance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowDistance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_getShadowDistance : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_ShadowsInfo_getShadowDistance)

static bool js_scene_ShadowsInfo_getShadowMapSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_getShadowMapSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowMapSize();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_getShadowMapSize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_ShadowsInfo_getShadowMapSize)

static bool js_scene_ShadowsInfo_getSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_getSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec2& result = cobj->getSize();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_getSize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_ShadowsInfo_getSize)

static bool js_scene_ShadowsInfo_getType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getType());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_getType : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_ShadowsInfo_getType)

static bool js_scene_ShadowsInfo_isEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_isEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isEnabled();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_isEnabled : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_ShadowsInfo_isEnabled)

static bool js_scene_ShadowsInfo_isFixedArea(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_isFixedArea : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isFixedArea();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_isFixedArea : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_ShadowsInfo_isFixedArea)
SE_BIND_FUNC_AS_PROP_SET(js_scene_ShadowsInfo_isFixedArea)

static bool js_scene_ShadowsInfo_setBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_setBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_setBias : Error processing arguments");
        cobj->setBias(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_ShadowsInfo_setBias)

static bool js_scene_ShadowsInfo_setDistance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_setDistance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_setDistance : Error processing arguments");
        cobj->setDistance(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_ShadowsInfo_setDistance)

static bool js_scene_ShadowsInfo_setEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_setEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_setEnabled : Error processing arguments");
        cobj->setEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_ShadowsInfo_setEnabled)

static bool js_scene_ShadowsInfo_setFar(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_setFar : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_setFar : Error processing arguments");
        cobj->setFar(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_ShadowsInfo_setFar)

static bool js_scene_ShadowsInfo_setFixedArea(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_setFixedArea : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_setFixedArea : Error processing arguments");
        cobj->setFixedArea(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_ShadowsInfo_setFixedArea)

static bool js_scene_ShadowsInfo_setInvisibleOcclusionRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_setInvisibleOcclusionRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_setInvisibleOcclusionRange : Error processing arguments");
        cobj->setInvisibleOcclusionRange(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_ShadowsInfo_setInvisibleOcclusionRange)

static bool js_scene_ShadowsInfo_setMaxReceived(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_setMaxReceived : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_setMaxReceived : Error processing arguments");
        cobj->setMaxReceived(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_ShadowsInfo_setMaxReceived)

static bool js_scene_ShadowsInfo_setNear(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_setNear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_setNear : Error processing arguments");
        cobj->setNear(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_ShadowsInfo_setNear)

static bool js_scene_ShadowsInfo_setNormal(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_setNormal : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_setNormal : Error processing arguments");
        cobj->setNormal(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_ShadowsInfo_setNormal)

static bool js_scene_ShadowsInfo_setNormalBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_setNormalBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_setNormalBias : Error processing arguments");
        cobj->setNormalBias(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_ShadowsInfo_setNormalBias)

static bool js_scene_ShadowsInfo_setOrthoSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_setOrthoSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_setOrthoSize : Error processing arguments");
        cobj->setOrthoSize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_ShadowsInfo_setOrthoSize)

static bool js_scene_ShadowsInfo_setPcf(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_setPcf : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::PCFType, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_setPcf : Error processing arguments");
        cobj->setPcf(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_ShadowsInfo_setPcf)

static bool js_scene_ShadowsInfo_setPlaneFromNode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_setPlaneFromNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_setPlaneFromNode : Error processing arguments");
        cobj->setPlaneFromNode(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_ShadowsInfo_setPlaneFromNode)

static bool js_scene_ShadowsInfo_setSaturation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_setSaturation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_setSaturation : Error processing arguments");
        cobj->setSaturation(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_ShadowsInfo_setSaturation)

static bool js_scene_ShadowsInfo_setShadowColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_setShadowColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Color, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_setShadowColor : Error processing arguments");
        cobj->setShadowColor(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_ShadowsInfo_setShadowColor)

static bool js_scene_ShadowsInfo_setShadowDistance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_setShadowDistance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_setShadowDistance : Error processing arguments");
        cobj->setShadowDistance(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_ShadowsInfo_setShadowDistance)

static bool js_scene_ShadowsInfo_setShadowMapSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_setShadowMapSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_setShadowMapSize : Error processing arguments");
        cobj->setShadowMapSize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_ShadowsInfo_setShadowMapSize)

static bool js_scene_ShadowsInfo_setType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_setType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::ShadowType, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_setType : Error processing arguments");
        cobj->setType(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_ShadowsInfo_setType)

static bool js_scene_ShadowsInfo_get__distance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_get__distance : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_distance, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_distance, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ShadowsInfo_get__distance)

static bool js_scene_ShadowsInfo_set__distance(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_set__distance : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_distance, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_set__distance : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ShadowsInfo_set__distance)

static bool js_scene_ShadowsInfo_get__bias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_get__bias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_bias, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_bias, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ShadowsInfo_get__bias)

static bool js_scene_ShadowsInfo_set__bias(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_set__bias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_bias, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_set__bias : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ShadowsInfo_set__bias)

static bool js_scene_ShadowsInfo_get__normalBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_get__normalBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_normalBias, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_normalBias, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ShadowsInfo_get__normalBias)

static bool js_scene_ShadowsInfo_set__normalBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_set__normalBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_normalBias, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_set__normalBias : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ShadowsInfo_set__normalBias)

static bool js_scene_ShadowsInfo_get__near(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_get__near : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_near, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_near, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ShadowsInfo_get__near)

static bool js_scene_ShadowsInfo_set__near(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_set__near : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_near, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_set__near : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ShadowsInfo_set__near)

static bool js_scene_ShadowsInfo_get__far(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_get__far : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_far, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_far, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ShadowsInfo_get__far)

static bool js_scene_ShadowsInfo_set__far(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_set__far : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_far, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_set__far : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ShadowsInfo_set__far)

static bool js_scene_ShadowsInfo_get__shadowDistance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_get__shadowDistance : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_shadowDistance, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_shadowDistance, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ShadowsInfo_get__shadowDistance)

static bool js_scene_ShadowsInfo_set__shadowDistance(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_set__shadowDistance : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_shadowDistance, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_set__shadowDistance : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ShadowsInfo_set__shadowDistance)

static bool js_scene_ShadowsInfo_get__invisibleOcclusionRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_get__invisibleOcclusionRange : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_invisibleOcclusionRange, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_invisibleOcclusionRange, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ShadowsInfo_get__invisibleOcclusionRange)

static bool js_scene_ShadowsInfo_set__invisibleOcclusionRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_set__invisibleOcclusionRange : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_invisibleOcclusionRange, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_set__invisibleOcclusionRange : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ShadowsInfo_set__invisibleOcclusionRange)

static bool js_scene_ShadowsInfo_get__orthoSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_get__orthoSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_orthoSize, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_orthoSize, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ShadowsInfo_get__orthoSize)

static bool js_scene_ShadowsInfo_set__orthoSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_set__orthoSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_orthoSize, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_set__orthoSize : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ShadowsInfo_set__orthoSize)

static bool js_scene_ShadowsInfo_get__saturation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_get__saturation : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_saturation, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_saturation, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ShadowsInfo_get__saturation)

static bool js_scene_ShadowsInfo_set__saturation(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_set__saturation : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_saturation, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_set__saturation : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ShadowsInfo_set__saturation)

static bool js_scene_ShadowsInfo_get__maxReceived(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_get__maxReceived : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_maxReceived, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_maxReceived, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ShadowsInfo_get__maxReceived)

static bool js_scene_ShadowsInfo_set__maxReceived(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_set__maxReceived : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_maxReceived, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_set__maxReceived : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ShadowsInfo_set__maxReceived)

static bool js_scene_ShadowsInfo_get__pcf(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_get__pcf : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_pcf, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_pcf, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ShadowsInfo_get__pcf)

static bool js_scene_ShadowsInfo_set__pcf(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_set__pcf : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_pcf, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_set__pcf : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ShadowsInfo_set__pcf)

static bool js_scene_ShadowsInfo_get__type(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_get__type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_type, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ShadowsInfo_get__type)

static bool js_scene_ShadowsInfo_set__type(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_set__type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_type, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_set__type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ShadowsInfo_set__type)

static bool js_scene_ShadowsInfo_get__shadowColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_get__shadowColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_shadowColor, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_shadowColor, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ShadowsInfo_get__shadowColor)

static bool js_scene_ShadowsInfo_set__shadowColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_set__shadowColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_shadowColor, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_set__shadowColor : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ShadowsInfo_set__shadowColor)

static bool js_scene_ShadowsInfo_get__normal(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_get__normal : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_normal, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_normal, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ShadowsInfo_get__normal)

static bool js_scene_ShadowsInfo_set__normal(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_set__normal : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_normal, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_set__normal : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ShadowsInfo_set__normal)

static bool js_scene_ShadowsInfo_get__size(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_get__size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_size, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_size, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ShadowsInfo_get__size)

static bool js_scene_ShadowsInfo_set__size(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_set__size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_size, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_set__size : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ShadowsInfo_set__size)

static bool js_scene_ShadowsInfo_get__firstSetCSM(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_get__firstSetCSM : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_firstSetCSM, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_firstSetCSM, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ShadowsInfo_get__firstSetCSM)

static bool js_scene_ShadowsInfo_set__firstSetCSM(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_set__firstSetCSM : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_firstSetCSM, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_set__firstSetCSM : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ShadowsInfo_set__firstSetCSM)

static bool js_scene_ShadowsInfo_get__fixedArea(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_get__fixedArea : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_fixedArea, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_fixedArea, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ShadowsInfo_get__fixedArea)

static bool js_scene_ShadowsInfo_set__fixedArea(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_set__fixedArea : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_fixedArea, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_set__fixedArea : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ShadowsInfo_set__fixedArea)

static bool js_scene_ShadowsInfo_get__enabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_get__enabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_enabled, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_enabled, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ShadowsInfo_get__enabled)

static bool js_scene_ShadowsInfo_set__enabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ShadowsInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ShadowsInfo_set__enabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_enabled, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ShadowsInfo_set__enabled : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ShadowsInfo_set__enabled)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_ShadowsInfo_finalize)

static bool js_scene_ShadowsInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::ShadowsInfo);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_ShadowsInfo_constructor, __jsb_cc_scene_ShadowsInfo_class, js_cc_scene_ShadowsInfo_finalize)

static bool js_cc_scene_ShadowsInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_ShadowsInfo_finalize)

bool js_register_scene_ShadowsInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ShadowsInfo", obj, nullptr, _SE(js_scene_ShadowsInfo_constructor));

    cls->defineProperty("_distance", _SE(js_scene_ShadowsInfo_get__distance), _SE(js_scene_ShadowsInfo_set__distance));
    cls->defineProperty("_bias", _SE(js_scene_ShadowsInfo_get__bias), _SE(js_scene_ShadowsInfo_set__bias));
    cls->defineProperty("_normalBias", _SE(js_scene_ShadowsInfo_get__normalBias), _SE(js_scene_ShadowsInfo_set__normalBias));
    cls->defineProperty("_near", _SE(js_scene_ShadowsInfo_get__near), _SE(js_scene_ShadowsInfo_set__near));
    cls->defineProperty("_far", _SE(js_scene_ShadowsInfo_get__far), _SE(js_scene_ShadowsInfo_set__far));
    cls->defineProperty("_shadowDistance", _SE(js_scene_ShadowsInfo_get__shadowDistance), _SE(js_scene_ShadowsInfo_set__shadowDistance));
    cls->defineProperty("_invisibleOcclusionRange", _SE(js_scene_ShadowsInfo_get__invisibleOcclusionRange), _SE(js_scene_ShadowsInfo_set__invisibleOcclusionRange));
    cls->defineProperty("_orthoSize", _SE(js_scene_ShadowsInfo_get__orthoSize), _SE(js_scene_ShadowsInfo_set__orthoSize));
    cls->defineProperty("_saturation", _SE(js_scene_ShadowsInfo_get__saturation), _SE(js_scene_ShadowsInfo_set__saturation));
    cls->defineProperty("_maxReceived", _SE(js_scene_ShadowsInfo_get__maxReceived), _SE(js_scene_ShadowsInfo_set__maxReceived));
    cls->defineProperty("_pcf", _SE(js_scene_ShadowsInfo_get__pcf), _SE(js_scene_ShadowsInfo_set__pcf));
    cls->defineProperty("_type", _SE(js_scene_ShadowsInfo_get__type), _SE(js_scene_ShadowsInfo_set__type));
    cls->defineProperty("_shadowColor", _SE(js_scene_ShadowsInfo_get__shadowColor), _SE(js_scene_ShadowsInfo_set__shadowColor));
    cls->defineProperty("_normal", _SE(js_scene_ShadowsInfo_get__normal), _SE(js_scene_ShadowsInfo_set__normal));
    cls->defineProperty("_size", _SE(js_scene_ShadowsInfo_get__size), _SE(js_scene_ShadowsInfo_set__size));
    cls->defineProperty("_firstSetCSM", _SE(js_scene_ShadowsInfo_get__firstSetCSM), _SE(js_scene_ShadowsInfo_set__firstSetCSM));
    cls->defineProperty("_fixedArea", _SE(js_scene_ShadowsInfo_get__fixedArea), _SE(js_scene_ShadowsInfo_set__fixedArea));
    cls->defineProperty("_enabled", _SE(js_scene_ShadowsInfo_get__enabled), _SE(js_scene_ShadowsInfo_set__enabled));
    cls->defineProperty("type", _SE(js_scene_ShadowsInfo_getType_asGetter), _SE(js_scene_ShadowsInfo_setType_asSetter));
    cls->defineProperty("enabled", _SE(js_scene_ShadowsInfo_isEnabled_asGetter), _SE(js_scene_ShadowsInfo_setEnabled_asSetter));
    cls->defineProperty("normal", _SE(js_scene_ShadowsInfo_getNormal_asGetter), _SE(js_scene_ShadowsInfo_setNormal_asSetter));
    cls->defineProperty("distance", _SE(js_scene_ShadowsInfo_getDistance_asGetter), _SE(js_scene_ShadowsInfo_setDistance_asSetter));
    cls->defineProperty("shadowDistance", _SE(js_scene_ShadowsInfo_getShadowDistance_asGetter), _SE(js_scene_ShadowsInfo_setShadowDistance_asSetter));
    cls->defineProperty("shadowColor", _SE(js_scene_ShadowsInfo_getShadowColor_asGetter), _SE(js_scene_ShadowsInfo_setShadowColor_asSetter));
    cls->defineProperty("invisibleOcclusionRange", _SE(js_scene_ShadowsInfo_getInvisibleOcclusionRange_asGetter), _SE(js_scene_ShadowsInfo_setInvisibleOcclusionRange_asSetter));
    cls->defineProperty("fixedArea", _SE(js_scene_ShadowsInfo_isFixedArea_asGetter), _SE(js_scene_ShadowsInfo_isFixedArea_asSetter));
    cls->defineProperty("pcf", _SE(js_scene_ShadowsInfo_getPcf_asGetter), _SE(js_scene_ShadowsInfo_setPcf_asSetter));
    cls->defineProperty("bias", _SE(js_scene_ShadowsInfo_getBias_asGetter), _SE(js_scene_ShadowsInfo_setBias_asSetter));
    cls->defineProperty("normalBias", _SE(js_scene_ShadowsInfo_getNormalBias_asGetter), _SE(js_scene_ShadowsInfo_setNormalBias_asSetter));
    cls->defineProperty("near", _SE(js_scene_ShadowsInfo_getNear_asGetter), _SE(js_scene_ShadowsInfo_setNear_asSetter));
    cls->defineProperty("far", _SE(js_scene_ShadowsInfo_getFar_asGetter), _SE(js_scene_ShadowsInfo_setFar_asSetter));
    cls->defineProperty("orthoSize", _SE(js_scene_ShadowsInfo_getOrthoSize_asGetter), _SE(js_scene_ShadowsInfo_setOrthoSize_asSetter));
    cls->defineProperty("maxReceived", _SE(js_scene_ShadowsInfo_getMaxReceived_asGetter), _SE(js_scene_ShadowsInfo_setMaxReceived_asSetter));
    cls->defineProperty("size", _SE(js_scene_ShadowsInfo_getSize_asGetter), nullptr);
    cls->defineProperty("saturation", _SE(js_scene_ShadowsInfo_getSaturation_asGetter), _SE(js_scene_ShadowsInfo_setSaturation_asSetter));
    cls->defineFunction("activate", _SE(js_scene_ShadowsInfo_activate));
    cls->defineFunction("getShadowMapSize", _SE(js_scene_ShadowsInfo_getShadowMapSize));
    cls->defineFunction("setFixedArea", _SE(js_scene_ShadowsInfo_setFixedArea));
    cls->defineFunction("setPlaneFromNode", _SE(js_scene_ShadowsInfo_setPlaneFromNode));
    cls->defineFunction("setShadowMapSize", _SE(js_scene_ShadowsInfo_setShadowMapSize));
    cls->defineFinalizeFunction(_SE(js_cc_scene_ShadowsInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::ShadowsInfo>(cls);

    __jsb_cc_scene_ShadowsInfo_proto = cls->getProto();
    __jsb_cc_scene_ShadowsInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Shadows_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_Shadows_class = nullptr;  // NOLINT

static bool js_scene_Shadows_activate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_activate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->activate();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Shadows_activate)

static bool js_scene_Shadows_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Shadows_destroy)

static bool js_scene_Shadows_getBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getBias();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getBias : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Shadows_getBias)

static bool js_scene_Shadows_getDistance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getDistance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getDistance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getDistance : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Shadows_getDistance)

static bool js_scene_Shadows_getFar(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getFar : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFar();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getFar : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Shadows_getFar)

static bool js_scene_Shadows_getInstancingMaterial(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getInstancingMaterial : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Material* result = cobj->getInstancingMaterial();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getInstancingMaterial : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Shadows_getInstancingMaterial)

static bool js_scene_Shadows_getInvisibleOcclusionRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getInvisibleOcclusionRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getInvisibleOcclusionRange();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getInvisibleOcclusionRange : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Shadows_getInvisibleOcclusionRange)

static bool js_scene_Shadows_getMatLight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getMatLight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Mat4& result = cobj->getMatLight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getMatLight : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Shadows_getMatLight)

static bool js_scene_Shadows_getMaterial(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getMaterial : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Material* result = cobj->getMaterial();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getMaterial : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Shadows_getMaterial)

static bool js_scene_Shadows_getMaxReceived(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getMaxReceived : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMaxReceived();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getMaxReceived : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Shadows_getMaxReceived)

static bool js_scene_Shadows_getNear(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getNear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getNear();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getNear : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Shadows_getNear)

static bool js_scene_Shadows_getNormal(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getNormal : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec3& result = cobj->getNormal();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getNormal : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Shadows_getNormal)

static bool js_scene_Shadows_getNormalBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getNormalBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getNormalBias();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getNormalBias : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Shadows_getNormalBias)

static bool js_scene_Shadows_getOrthoSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getOrthoSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getOrthoSize();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getOrthoSize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Shadows_getOrthoSize)

static bool js_scene_Shadows_getPcf(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getPcf : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getPcf());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getPcf : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Shadows_getPcf)

static bool js_scene_Shadows_getPlanarInstanceShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getPlanarInstanceShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::scene::IMacroPatch>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getPlanarInstanceShader : Error processing arguments");
        cc::gfx::Shader* result = cobj->getPlanarInstanceShader(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getPlanarInstanceShader : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Shadows_getPlanarInstanceShader)

static bool js_scene_Shadows_getPlanarShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getPlanarShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::scene::IMacroPatch>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getPlanarShader : Error processing arguments");
        cc::gfx::Shader* result = cobj->getPlanarShader(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getPlanarShader : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Shadows_getPlanarShader)

static bool js_scene_Shadows_getSaturation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getSaturation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getSaturation();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getSaturation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Shadows_getSaturation)

static bool js_scene_Shadows_getShadowColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getShadowColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Color& result = cobj->getShadowColor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getShadowColor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Shadows_getShadowColor)

static bool js_scene_Shadows_getShadowColor4f(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getShadowColor4f : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::array<float, 4>& result = cobj->getShadowColor4f();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getShadowColor4f : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Shadows_getShadowColor4f)

static bool js_scene_Shadows_getShadowDistance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getShadowDistance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowDistance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getShadowDistance : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Shadows_getShadowDistance)

static bool js_scene_Shadows_getShadowMapSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getShadowMapSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowMapSize();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getShadowMapSize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Shadows_getShadowMapSize)

static bool js_scene_Shadows_getSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec2& result = cobj->getSize();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getSize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Shadows_getSize)

static bool js_scene_Shadows_getType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getType());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_getType : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Shadows_getType)

static bool js_scene_Shadows_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::ShadowsInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Shadows_initialize)

static bool js_scene_Shadows_isEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_isEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isEnabled();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_isEnabled : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Shadows_isEnabled)

static bool js_scene_Shadows_isFixedArea(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_isFixedArea : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isFixedArea();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_isFixedArea : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Shadows_isFixedArea)

static bool js_scene_Shadows_isShadowMapDirty(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_isShadowMapDirty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isShadowMapDirty();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_isShadowMapDirty : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Shadows_isShadowMapDirty)

static bool js_scene_Shadows_setBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_setBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_setBias : Error processing arguments");
        cobj->setBias(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Shadows_setBias)

static bool js_scene_Shadows_setDistance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_setDistance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_setDistance : Error processing arguments");
        cobj->setDistance(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Shadows_setDistance)

static bool js_scene_Shadows_setEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_setEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_setEnabled : Error processing arguments");
        cobj->setEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Shadows_setEnabled)

static bool js_scene_Shadows_setFar(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_setFar : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_setFar : Error processing arguments");
        cobj->setFar(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Shadows_setFar)

static bool js_scene_Shadows_setFixedArea(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_setFixedArea : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_setFixedArea : Error processing arguments");
        cobj->setFixedArea(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Shadows_setFixedArea)

static bool js_scene_Shadows_setInvisibleOcclusionRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_setInvisibleOcclusionRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_setInvisibleOcclusionRange : Error processing arguments");
        cobj->setInvisibleOcclusionRange(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Shadows_setInvisibleOcclusionRange)

static bool js_scene_Shadows_setMaxReceived(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_setMaxReceived : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_setMaxReceived : Error processing arguments");
        cobj->setMaxReceived(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Shadows_setMaxReceived)

static bool js_scene_Shadows_setNear(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_setNear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_setNear : Error processing arguments");
        cobj->setNear(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Shadows_setNear)

static bool js_scene_Shadows_setNormal(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_setNormal : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_setNormal : Error processing arguments");
        cobj->setNormal(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Shadows_setNormal)

static bool js_scene_Shadows_setNormalBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_setNormalBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_setNormalBias : Error processing arguments");
        cobj->setNormalBias(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Shadows_setNormalBias)

static bool js_scene_Shadows_setOrthoSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_setOrthoSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_setOrthoSize : Error processing arguments");
        cobj->setOrthoSize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Shadows_setOrthoSize)

static bool js_scene_Shadows_setPcf(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_setPcf : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::PCFType, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_setPcf : Error processing arguments");
        cobj->setPcf(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Shadows_setPcf)

static bool js_scene_Shadows_setSaturation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_setSaturation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_setSaturation : Error processing arguments");
        cobj->setSaturation(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Shadows_setSaturation)

static bool js_scene_Shadows_setShadowColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_setShadowColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Color, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_setShadowColor : Error processing arguments");
        cobj->setShadowColor(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Shadows_setShadowColor)

static bool js_scene_Shadows_setShadowDistance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_setShadowDistance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_setShadowDistance : Error processing arguments");
        cobj->setShadowDistance(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Shadows_setShadowDistance)

static bool js_scene_Shadows_setShadowMapDirty(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_setShadowMapDirty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_setShadowMapDirty : Error processing arguments");
        cobj->setShadowMapDirty(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Shadows_setShadowMapDirty)

static bool js_scene_Shadows_setShadowMapSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_setShadowMapSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_setShadowMapSize : Error processing arguments");
        cobj->setShadowMapSize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Shadows_setShadowMapSize)

static bool js_scene_Shadows_setSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_setSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec2, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_setSize : Error processing arguments");
        cobj->setSize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Shadows_setSize)

static bool js_scene_Shadows_setType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Shadows>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Shadows_setType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::ShadowType, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Shadows_setType : Error processing arguments");
        cobj->setType(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Shadows_setType)

static bool js_scene_Shadows_get_MAX_FAR(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cc::scene::Shadows::MAX_FAR, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    // SE_HOLD_RETURN_VALUE(cobj->MAX_FAR, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadows_get_MAX_FAR)


static bool js_scene_Shadows_get_COEFFICIENT_OF_EXPANSION(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cc::scene::Shadows::COEFFICIENT_OF_EXPANSION, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    // SE_HOLD_RETURN_VALUE(cobj->COEFFICIENT_OF_EXPANSION, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Shadows_get_COEFFICIENT_OF_EXPANSION)


SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Shadows_finalize)

static bool js_scene_Shadows_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::Shadows);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_Shadows_constructor, __jsb_cc_scene_Shadows_class, js_cc_scene_Shadows_finalize)

static bool js_cc_scene_Shadows_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Shadows_finalize)

bool js_register_scene_Shadows(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Shadows", obj, nullptr, _SE(js_scene_Shadows_constructor));

    cls->defineProperty("enabled", _SE(js_scene_Shadows_isEnabled_asGetter), _SE(js_scene_Shadows_setEnabled_asSetter));
    cls->defineProperty("normal", _SE(js_scene_Shadows_getNormal_asGetter), _SE(js_scene_Shadows_setNormal_asSetter));
    cls->defineProperty("distance", _SE(js_scene_Shadows_getDistance_asGetter), _SE(js_scene_Shadows_setDistance_asSetter));
    cls->defineProperty("shadowColor", _SE(js_scene_Shadows_getShadowColor_asGetter), _SE(js_scene_Shadows_setShadowColor_asSetter));
    cls->defineProperty("type", _SE(js_scene_Shadows_getType_asGetter), _SE(js_scene_Shadows_setType_asSetter));
    cls->defineProperty("near", _SE(js_scene_Shadows_getNear_asGetter), _SE(js_scene_Shadows_setNear_asSetter));
    cls->defineProperty("far", _SE(js_scene_Shadows_getFar_asGetter), _SE(js_scene_Shadows_setFar_asSetter));
    cls->defineProperty("orthoSize", _SE(js_scene_Shadows_getOrthoSize_asGetter), _SE(js_scene_Shadows_setOrthoSize_asSetter));
    cls->defineProperty("size", _SE(js_scene_Shadows_getSize_asGetter), _SE(js_scene_Shadows_setSize_asSetter));
    cls->defineProperty("pcf", _SE(js_scene_Shadows_getPcf_asGetter), _SE(js_scene_Shadows_setPcf_asSetter));
    cls->defineProperty("shadowMapDirty", _SE(js_scene_Shadows_isShadowMapDirty_asGetter), _SE(js_scene_Shadows_setShadowMapDirty_asSetter));
    cls->defineProperty("bias", _SE(js_scene_Shadows_getBias_asGetter), _SE(js_scene_Shadows_setBias_asSetter));
    cls->defineProperty("normalBias", _SE(js_scene_Shadows_getNormalBias_asGetter), _SE(js_scene_Shadows_setNormalBias_asSetter));
    cls->defineProperty("saturation", _SE(js_scene_Shadows_getSaturation_asGetter), _SE(js_scene_Shadows_setSaturation_asSetter));
    cls->defineProperty("fixedArea", nullptr, _SE(js_scene_Shadows_setFixedArea_asSetter));
    cls->defineProperty("shadowDistance", _SE(js_scene_Shadows_getShadowDistance_asGetter), _SE(js_scene_Shadows_setShadowDistance_asSetter));
    cls->defineProperty("invisibleOcclusionRange", _SE(js_scene_Shadows_getInvisibleOcclusionRange_asGetter), _SE(js_scene_Shadows_setInvisibleOcclusionRange_asSetter));
    cls->defineProperty("matLight", _SE(js_scene_Shadows_getMatLight_asGetter), nullptr);
    cls->defineProperty("instancingMaterial", _SE(js_scene_Shadows_getInstancingMaterial_asGetter), nullptr);
    cls->defineFunction("activate", _SE(js_scene_Shadows_activate));
    cls->defineFunction("destroy", _SE(js_scene_Shadows_destroy));
    cls->defineFunction("getMaterial", _SE(js_scene_Shadows_getMaterial));
    cls->defineFunction("getMaxReceived", _SE(js_scene_Shadows_getMaxReceived));
    cls->defineFunction("getPlanarInstanceShader", _SE(js_scene_Shadows_getPlanarInstanceShader));
    cls->defineFunction("getPlanarShader", _SE(js_scene_Shadows_getPlanarShader));
    cls->defineFunction("getShadowColor4f", _SE(js_scene_Shadows_getShadowColor4f));
    cls->defineFunction("getShadowMapSize", _SE(js_scene_Shadows_getShadowMapSize));
    cls->defineFunction("initialize", _SE(js_scene_Shadows_initialize));
    cls->defineFunction("isFixedArea", _SE(js_scene_Shadows_isFixedArea));
    cls->defineFunction("setMaxReceived", _SE(js_scene_Shadows_setMaxReceived));
    cls->defineFunction("setShadowMapSize", _SE(js_scene_Shadows_setShadowMapSize));
    // static fields
    cls->defineStaticProperty("MAX_FAR", _SE(js_scene_Shadows_get_MAX_FAR), nullptr);
    cls->defineStaticProperty("COEFFICIENT_OF_EXPANSION", _SE(js_scene_Shadows_get_COEFFICIENT_OF_EXPANSION), nullptr);
    cls->defineFinalizeFunction(_SE(js_cc_scene_Shadows_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Shadows>(cls);

    __jsb_cc_scene_Shadows_proto = cls->getProto();
    __jsb_cc_scene_Shadows_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_PassDynamicsValue_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_PassDynamicsValue_class = nullptr;  // NOLINT

static bool js_scene_PassDynamicsValue_get_dirty(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PassDynamicsValue>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PassDynamicsValue_get_dirty : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->dirty, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->dirty, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PassDynamicsValue_get_dirty)

static bool js_scene_PassDynamicsValue_set_dirty(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PassDynamicsValue>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PassDynamicsValue_set_dirty : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->dirty, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PassDynamicsValue_set_dirty : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PassDynamicsValue_set_dirty)

static bool js_scene_PassDynamicsValue_get_value(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::PassDynamicsValue>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PassDynamicsValue_get_value : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->value, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->value, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_PassDynamicsValue_get_value)

static bool js_scene_PassDynamicsValue_set_value(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::PassDynamicsValue>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PassDynamicsValue_set_value : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->value, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PassDynamicsValue_set_value : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_PassDynamicsValue_set_value)


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::PassDynamicsValue * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::PassDynamicsValue*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("dirty", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->dirty), ctx);
    }
    json->getProperty("value", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->value), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_PassDynamicsValue_finalize)

static bool js_scene_PassDynamicsValue_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::PassDynamicsValue);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::PassDynamicsValue);
        auto cobj = ptr->get<cc::scene::PassDynamicsValue>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::PassDynamicsValue);
    auto cobj = ptr->get<cc::scene::PassDynamicsValue>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->dirty), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->value), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_PassDynamicsValue_constructor, __jsb_cc_scene_PassDynamicsValue_class, js_cc_scene_PassDynamicsValue_finalize)

static bool js_cc_scene_PassDynamicsValue_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_PassDynamicsValue_finalize)

bool js_register_scene_PassDynamicsValue(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("PassDynamicsValue", obj, nullptr, _SE(js_scene_PassDynamicsValue_constructor));

    cls->defineProperty("dirty", _SE(js_scene_PassDynamicsValue_get_dirty), _SE(js_scene_PassDynamicsValue_set_dirty));
    cls->defineProperty("value", _SE(js_scene_PassDynamicsValue_get_value), _SE(js_scene_PassDynamicsValue_set_value));
    cls->defineFinalizeFunction(_SE(js_cc_scene_PassDynamicsValue_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::PassDynamicsValue>(cls);

    __jsb_cc_scene_PassDynamicsValue_proto = cls->getProto();
    __jsb_cc_scene_PassDynamicsValue_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Pass_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_Pass_class = nullptr;  // NOLINT

static bool js_scene_Pass__setRootBufferDirty(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass__setRootBufferDirty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass__setRootBufferDirty : Error processing arguments");
        cobj->_setRootBufferDirty(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Pass__setRootBufferDirty)

static bool js_scene_Pass_beginChangeStatesSilently(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_beginChangeStatesSilently : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->beginChangeStatesSilently();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_beginChangeStatesSilently)

static bool js_scene_Pass_bindSampler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_bindSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<cc::gfx::Sampler*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_bindSampler : Error processing arguments");
        cobj->bindSampler(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<cc::gfx::Sampler*, false> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_bindSampler : Error processing arguments");
        cobj->bindSampler(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_bindSampler)

static bool js_scene_Pass_bindTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_bindTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<cc::gfx::Texture*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_bindTexture : Error processing arguments");
        cobj->bindTexture(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<cc::gfx::Texture*, false> arg1 = {};
        HolderType<int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_bindTexture : Error processing arguments");
        cobj->bindTexture(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_bindTexture)

static bool js_scene_Pass_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_destroy)

static bool js_scene_Pass_endChangeStatesSilently(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_endChangeStatesSilently : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->endChangeStatesSilently();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_endChangeStatesSilently)

static bool js_scene_Pass_getBatchedBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getBatchedBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::pipeline::BatchedBuffer* result = cobj->getBatchedBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getBatchedBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 1) {
        HolderType<int32_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getBatchedBuffer : Error processing arguments");
        cc::pipeline::BatchedBuffer* result = cobj->getBatchedBuffer(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getBatchedBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getBatchedBuffer)

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
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getBatchingScheme)

static bool js_scene_Pass_getBinding(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getBinding : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getBinding : Error processing arguments");
        unsigned int result = cobj->getBinding(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getBinding : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getBinding)

static bool js_scene_Pass_getBlendState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getBlendState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::BlendState* result = cobj->getBlendState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getBlendState : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getBlendState)

static bool js_scene_Pass_getDefines(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getDefines : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::unordered_map<std::string, boost::variant2::variant<int, bool, std::string>>& result = cobj->getDefines();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getDefines : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getDefines)

static bool js_scene_Pass_getDepthStencilState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getDepthStencilState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::DepthStencilState* result = cobj->getDepthStencilState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getDepthStencilState : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getDepthStencilState)

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
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getDescriptorSet)

static bool js_scene_Pass_getDevice(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Device* result = cobj->getDevice();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getDevice : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getDevice)

static bool js_scene_Pass_getDynamicStates(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getDynamicStates : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getDynamicStates());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getDynamicStates : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getDynamicStates)

static bool js_scene_Pass_getDynamics(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getDynamics : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::unordered_map<unsigned int, cc::scene::PassDynamicsValue>& result = cobj->getDynamics();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getDynamics : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getDynamics)

static bool js_scene_Pass_getHandle(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getHandle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getHandle : Error processing arguments");
        unsigned int result = cobj->getHandle(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getHandle : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getHandle : Error processing arguments");
        unsigned int result = cobj->getHandle(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getHandle : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        HolderType<cc::gfx::Type, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getHandle : Error processing arguments");
        unsigned int result = cobj->getHandle(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getHandle : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getHandle)

static bool js_scene_Pass_getHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uint64_t result = cobj->getHash();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getHash)

static bool js_scene_Pass_getHashForJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getHashForJS : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        double result = cobj->getHashForJS();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getHashForJS : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getHashForJS)

static bool js_scene_Pass_getInstancedBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getInstancedBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::pipeline::InstancedBuffer* result = cobj->getInstancedBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getInstancedBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 1) {
        HolderType<int32_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getInstancedBuffer : Error processing arguments");
        cc::pipeline::InstancedBuffer* result = cobj->getInstancedBuffer(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getInstancedBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getInstancedBuffer)

static bool js_scene_Pass_getLocalSetLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getLocalSetLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::DescriptorSetLayout* result = cobj->getLocalSetLayout();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getLocalSetLayout : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getLocalSetLayout)

static bool js_scene_Pass_getPassIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getPassIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPassIndex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getPassIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getPassIndex)

static bool js_scene_Pass_getPassInfoFull(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getPassInfoFull : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::IPassInfoFull result = cobj->getPassInfoFull();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getPassInfoFull : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getPassInfoFull)

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
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getPhase)

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
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getPipelineLayout)

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
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getPrimitive)

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
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getPriority)

static bool js_scene_Pass_getProgram(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getProgram : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getProgram();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getProgram : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getProgram)

static bool js_scene_Pass_getProperties(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getProperties : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::unordered_map<std::string, cc::IPropertyInfo>& result = cobj->getProperties();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getProperties : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getProperties)

static bool js_scene_Pass_getPropertyIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getPropertyIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPropertyIndex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getPropertyIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getPropertyIndex)

static bool js_scene_Pass_getRasterizerState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getRasterizerState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::RasterizerState* result = cobj->getRasterizerState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getRasterizerState : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getRasterizerState)

static bool js_scene_Pass_getRoot(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getRoot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Root* result = cobj->getRoot();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getRoot : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getRoot)

static bool js_scene_Pass_getRootBlock(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getRootBlock : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::ArrayBuffer* result = cobj->getRootBlock();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getRootBlock : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getRootBlock)

static bool js_scene_Pass_getShaderInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getShaderInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::IProgramInfo* result = cobj->getShaderInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getShaderInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getShaderInfo)

static bool js_scene_Pass_getShaderVariant(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2( cobj, false, "js_scene_Pass_getShaderVariant : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<std::vector<cc::scene::IMacroPatch>, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cc::gfx::Shader* result = cobj->getShaderVariant(arg0.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_scene_Pass_getShaderVariant : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {

            cc::gfx::Shader* result = cobj->getShaderVariant();
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_scene_Pass_getShaderVariant : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getShaderVariant)

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
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_getStage)

static bool js_scene_Pass_getUniform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_getUniform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<boost::variant2::variant<boost::variant2::monostate, float, int, cc::Vec2, cc::Vec3, cc::Vec4, cc::Color, cc::Mat3, cc::Mat4, cc::Quaternion, cc::IntrusivePtr<cc::TextureBase>, cc::IntrusivePtr<cc::gfx::Texture>>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getUniform : Error processing arguments");
        boost::variant2::variant<boost::variant2::monostate, float, int, cc::Vec2, cc::Vec3, cc::Vec4, cc::Color, cc::Mat3, cc::Mat4, cc::Quaternion, cc::IntrusivePtr<cc::TextureBase>, cc::IntrusivePtr<cc::gfx::Texture>>& result = cobj->getUniform(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getUniform : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getUniform)

static bool js_scene_Pass_initPassFromTarget(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_initPassFromTarget : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<cc::scene::Pass*, false> arg0 = {};
        HolderType<cc::gfx::DepthStencilState, true> arg1 = {};
        HolderType<cc::gfx::BlendState, true> arg2 = {};
        HolderType<uint64_t, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_initPassFromTarget : Error processing arguments");
        cobj->initPassFromTarget(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_initPassFromTarget)

static bool js_scene_Pass_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::IPassInfoFull, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_initialize)

static bool js_scene_Pass_isRootBufferDirty(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_isRootBufferDirty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isRootBufferDirty();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_isRootBufferDirty : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Pass_isRootBufferDirty)

static bool js_scene_Pass_overridePipelineStates(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_overridePipelineStates : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::IPassInfoFull, true> arg0 = {};
        HolderType<cc::IPassStates, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_overridePipelineStates : Error processing arguments");
        cobj->overridePipelineStates(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_overridePipelineStates)

static bool js_scene_Pass_resetTexture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_resetTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_resetTexture : Error processing arguments");
        cobj->resetTexture(arg0.value());
        return true;
    }
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_resetTexture : Error processing arguments");
        cobj->resetTexture(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_resetTexture)

static bool js_scene_Pass_resetTextures(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_resetTextures : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->resetTextures();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_resetTextures)

static bool js_scene_Pass_resetUBOs(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_resetUBOs : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->resetUBOs();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_resetUBOs)

static bool js_scene_Pass_resetUniform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_resetUniform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_resetUniform : Error processing arguments");
        cobj->resetUniform(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_resetUniform)

static bool js_scene_Pass_setDynamicState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_setDynamicState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::gfx::DynamicStateFlagBit, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_setDynamicState : Error processing arguments");
        cobj->setDynamicState(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_setDynamicState)

static bool js_scene_Pass_setUniform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_setUniform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<boost::variant2::variant<boost::variant2::monostate, float, int, cc::Vec2, cc::Vec3, cc::Vec4, cc::Color, cc::Mat3, cc::Mat4, cc::Quaternion, cc::IntrusivePtr<cc::TextureBase>, cc::IntrusivePtr<cc::gfx::Texture>>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_setUniform : Error processing arguments");
        cobj->setUniform(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_setUniform)

static bool js_scene_Pass_setUniformArray(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Pass_setUniformArray : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<std::vector<boost::variant2::variant<boost::variant2::monostate, float, int, cc::Vec2, cc::Vec3, cc::Vec4, cc::Color, cc::Mat3, cc::Mat4, cc::Quaternion, cc::IntrusivePtr<cc::TextureBase>, cc::IntrusivePtr<cc::gfx::Texture>>>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Pass_setUniformArray : Error processing arguments");
        cobj->setUniformArray(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_setUniformArray)

static bool js_scene_Pass_tryCompile(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2( cobj, false, "js_scene_Pass_tryCompile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<boost::optional<std::unordered_map<std::string, boost::variant2::variant<int, bool, std::string>>>, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            bool result = cobj->tryCompile(arg0.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_scene_Pass_tryCompile : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {

            bool result = cobj->tryCompile();
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_scene_Pass_tryCompile : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_tryCompile)

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

static bool js_scene_Pass_fillPipelineInfo_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::scene::Pass*, false> arg0 = {};
        HolderType<cc::IPassInfoFull, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_fillPipelineInfo_static : Error processing arguments");
        cc::scene::Pass::fillPipelineInfo(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_fillPipelineInfo_static)

static bool js_scene_Pass_getBindingFromHandle_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getBindingFromHandle_static : Error processing arguments");
        unsigned int result = cc::scene::Pass::getBindingFromHandle(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getBindingFromHandle_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getBindingFromHandle_static)

static bool js_scene_Pass_getCountFromHandle_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getCountFromHandle_static : Error processing arguments");
        unsigned int result = cc::scene::Pass::getCountFromHandle(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getCountFromHandle_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getCountFromHandle_static)

static bool js_scene_Pass_getOffsetFromHandle_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getOffsetFromHandle_static : Error processing arguments");
        unsigned int result = cc::scene::Pass::getOffsetFromHandle(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getOffsetFromHandle_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getOffsetFromHandle_static)

static bool js_scene_Pass_getPassHash_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Pass*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getPassHash_static : Error processing arguments");
        uint64_t result = cc::scene::Pass::getPassHash(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getPassHash_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getPassHash_static)

static bool js_scene_Pass_getTypeFromHandle_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getTypeFromHandle_static : Error processing arguments");
        auto result = static_cast<int>(cc::scene::Pass::getTypeFromHandle(arg0.value()));
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Pass_getTypeFromHandle_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Pass_getTypeFromHandle_static)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Pass_finalize)

static bool js_scene_Pass_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<cc::Root*, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::Pass, arg0.value());
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::Pass);
            s.thisObject()->setPrivateObject(ptr);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_scene_Pass_constructor, __jsb_cc_scene_Pass_class, js_cc_scene_Pass_finalize)

static bool js_cc_scene_Pass_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Pass_finalize)

bool js_register_scene_Pass(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Pass", obj, nullptr, _SE(js_scene_Pass_constructor));

    cls->defineProperty("root", _SE(js_scene_Pass_getRoot_asGetter), nullptr);
    cls->defineProperty("device", _SE(js_scene_Pass_getDevice_asGetter), nullptr);
    cls->defineProperty("shaderInfo", _SE(js_scene_Pass_getShaderInfo_asGetter), nullptr);
    cls->defineProperty("localSetLayout", _SE(js_scene_Pass_getLocalSetLayout_asGetter), nullptr);
    cls->defineProperty("program", _SE(js_scene_Pass_getProgram_asGetter), nullptr);
    cls->defineProperty("properties", _SE(js_scene_Pass_getProperties_asGetter), nullptr);
    cls->defineProperty("defines", _SE(js_scene_Pass_getDefines_asGetter), nullptr);
    cls->defineProperty("passIndex", _SE(js_scene_Pass_getPassIndex_asGetter), nullptr);
    cls->defineProperty("propertyIndex", _SE(js_scene_Pass_getPropertyIndex_asGetter), nullptr);
    cls->defineProperty("dynamics", _SE(js_scene_Pass_getDynamics_asGetter), nullptr);
    cls->defineProperty("rootBufferDirty", _SE(js_scene_Pass_isRootBufferDirty_asGetter), nullptr);
    cls->defineProperty("_rootBufferDirty", _SE(js_scene_Pass_isRootBufferDirty_asGetter), _SE(js_scene_Pass__setRootBufferDirty_asSetter));
    cls->defineProperty("priority", _SE(js_scene_Pass_getPriority_asGetter), nullptr);
    cls->defineProperty("primitive", _SE(js_scene_Pass_getPrimitive_asGetter), nullptr);
    cls->defineProperty("stage", _SE(js_scene_Pass_getStage_asGetter), nullptr);
    cls->defineProperty("phase", _SE(js_scene_Pass_getPhase_asGetter), nullptr);
    cls->defineProperty("rasterizerState", _SE(js_scene_Pass_getRasterizerState_asGetter), nullptr);
    cls->defineProperty("depthStencilState", _SE(js_scene_Pass_getDepthStencilState_asGetter), nullptr);
    cls->defineProperty("blendState", _SE(js_scene_Pass_getBlendState_asGetter), nullptr);
    cls->defineProperty("dynamicStates", _SE(js_scene_Pass_getDynamicStates_asGetter), nullptr);
    cls->defineProperty("batchingScheme", _SE(js_scene_Pass_getBatchingScheme_asGetter), nullptr);
    cls->defineProperty("descriptorSet", _SE(js_scene_Pass_getDescriptorSet_asGetter), nullptr);
    cls->defineProperty("hash", _SE(js_scene_Pass_getHashForJS_asGetter), nullptr);
    cls->defineProperty("pipelineLayout", _SE(js_scene_Pass_getPipelineLayout_asGetter), nullptr);
    cls->defineFunction("beginChangeStatesSilently", _SE(js_scene_Pass_beginChangeStatesSilently));
    cls->defineFunction("bindSampler", _SE(js_scene_Pass_bindSampler));
    cls->defineFunction("bindTexture", _SE(js_scene_Pass_bindTexture));
    cls->defineFunction("destroy", _SE(js_scene_Pass_destroy));
    cls->defineFunction("endChangeStatesSilently", _SE(js_scene_Pass_endChangeStatesSilently));
    cls->defineFunction("getBatchedBuffer", _SE(js_scene_Pass_getBatchedBuffer));
    cls->defineFunction("getBinding", _SE(js_scene_Pass_getBinding));
    cls->defineFunction("getHandle", _SE(js_scene_Pass_getHandle));
    cls->defineFunction("getHash", _SE(js_scene_Pass_getHash));
    cls->defineFunction("getInstancedBuffer", _SE(js_scene_Pass_getInstancedBuffer));
    cls->defineFunction("getPassInfoFull", _SE(js_scene_Pass_getPassInfoFull));
    cls->defineFunction("getRootBlock", _SE(js_scene_Pass_getRootBlock));
    cls->defineFunction("getShaderVariant", _SE(js_scene_Pass_getShaderVariant));
    cls->defineFunction("getUniform", _SE(js_scene_Pass_getUniform));
    cls->defineFunction("_initPassFromTarget", _SE(js_scene_Pass_initPassFromTarget));
    cls->defineFunction("initialize", _SE(js_scene_Pass_initialize));
    cls->defineFunction("overridePipelineStates", _SE(js_scene_Pass_overridePipelineStates));
    cls->defineFunction("resetTexture", _SE(js_scene_Pass_resetTexture));
    cls->defineFunction("resetTextures", _SE(js_scene_Pass_resetTextures));
    cls->defineFunction("resetUBOs", _SE(js_scene_Pass_resetUBOs));
    cls->defineFunction("resetUniform", _SE(js_scene_Pass_resetUniform));
    cls->defineFunction("setDynamicState", _SE(js_scene_Pass_setDynamicState));
    cls->defineFunction("setUniform", _SE(js_scene_Pass_setUniform));
    cls->defineFunction("setUniformArray", _SE(js_scene_Pass_setUniformArray));
    cls->defineFunction("tryCompile", _SE(js_scene_Pass_tryCompile));
    cls->defineFunction("update", _SE(js_scene_Pass_update));
    cls->defineStaticFunction("fillPipelineInfo", _SE(js_scene_Pass_fillPipelineInfo_static));
    cls->defineStaticFunction("getBindingFromHandle", _SE(js_scene_Pass_getBindingFromHandle_static));
    cls->defineStaticFunction("getCountFromHandle", _SE(js_scene_Pass_getCountFromHandle_static));
    cls->defineStaticFunction("getOffsetFromHandle", _SE(js_scene_Pass_getOffsetFromHandle_static));
    cls->defineStaticFunction("getPassHash", _SE(js_scene_Pass_getPassHash_static));
    cls->defineStaticFunction("getTypeFromHandle", _SE(js_scene_Pass_getTypeFromHandle_static));
    cls->defineFinalizeFunction(_SE(js_cc_scene_Pass_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Pass>(cls);

    __jsb_cc_scene_Pass_proto = cls->getProto();
    __jsb_cc_scene_Pass_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_ICameraInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_ICameraInfo_class = nullptr;  // NOLINT

static bool js_scene_ICameraInfo_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ICameraInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ICameraInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ICameraInfo_get_name)

static bool js_scene_ICameraInfo_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ICameraInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ICameraInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ICameraInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ICameraInfo_set_name)

static bool js_scene_ICameraInfo_get_node(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ICameraInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ICameraInfo_get_node : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->node, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->node, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ICameraInfo_get_node)

static bool js_scene_ICameraInfo_set_node(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ICameraInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ICameraInfo_set_node : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->node, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ICameraInfo_set_node : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ICameraInfo_set_node)

static bool js_scene_ICameraInfo_get_projection(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ICameraInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ICameraInfo_get_projection : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->projection, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->projection, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ICameraInfo_get_projection)

static bool js_scene_ICameraInfo_set_projection(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ICameraInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ICameraInfo_set_projection : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->projection, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ICameraInfo_set_projection : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ICameraInfo_set_projection)

static bool js_scene_ICameraInfo_get_targetDisplay(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ICameraInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ICameraInfo_get_targetDisplay : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->targetDisplay, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->targetDisplay, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ICameraInfo_get_targetDisplay)

static bool js_scene_ICameraInfo_set_targetDisplay(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ICameraInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ICameraInfo_set_targetDisplay : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->targetDisplay, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ICameraInfo_set_targetDisplay : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ICameraInfo_set_targetDisplay)

static bool js_scene_ICameraInfo_get_window(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ICameraInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ICameraInfo_get_window : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->window, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->window, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ICameraInfo_get_window)

static bool js_scene_ICameraInfo_set_window(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ICameraInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ICameraInfo_set_window : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->window, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ICameraInfo_set_window : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ICameraInfo_set_window)

static bool js_scene_ICameraInfo_get_priority(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ICameraInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ICameraInfo_get_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->priority, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->priority, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ICameraInfo_get_priority)

static bool js_scene_ICameraInfo_set_priority(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ICameraInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ICameraInfo_set_priority : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->priority, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ICameraInfo_set_priority : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ICameraInfo_set_priority)

static bool js_scene_ICameraInfo_get_pipeline(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::ICameraInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ICameraInfo_get_pipeline : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->pipeline, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->pipeline, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_ICameraInfo_get_pipeline)

static bool js_scene_ICameraInfo_set_pipeline(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::ICameraInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ICameraInfo_set_pipeline : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->pipeline, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_ICameraInfo_set_pipeline : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_ICameraInfo_set_pipeline)


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::ICameraInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::ICameraInfo*>(json->getPrivateData());
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
    json->getProperty("node", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->node), ctx);
    }
    json->getProperty("projection", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->projection), ctx);
    }
    json->getProperty("targetDisplay", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->targetDisplay), ctx);
    }
    json->getProperty("window", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->window), ctx);
    }
    json->getProperty("priority", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->priority), ctx);
    }
    json->getProperty("pipeline", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->pipeline), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_ICameraInfo_finalize)

static bool js_scene_ICameraInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::ICameraInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::ICameraInfo);
        auto cobj = ptr->get<cc::scene::ICameraInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::ICameraInfo);
    auto cobj = ptr->get<cc::scene::ICameraInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->name), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->node), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->projection), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->targetDisplay), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->window), nullptr);
    }
    if (argc > 5 && !args[5].isUndefined()) {
        ok &= sevalue_to_native(args[5], &(cobj->priority), nullptr);
    }
    if (argc > 6 && !args[6].isUndefined()) {
        ok &= sevalue_to_native(args[6], &(cobj->pipeline), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_ICameraInfo_constructor, __jsb_cc_scene_ICameraInfo_class, js_cc_scene_ICameraInfo_finalize)

static bool js_cc_scene_ICameraInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_ICameraInfo_finalize)

bool js_register_scene_ICameraInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ICameraInfo", obj, nullptr, _SE(js_scene_ICameraInfo_constructor));

    cls->defineProperty("name", _SE(js_scene_ICameraInfo_get_name), _SE(js_scene_ICameraInfo_set_name));
    cls->defineProperty("node", _SE(js_scene_ICameraInfo_get_node), _SE(js_scene_ICameraInfo_set_node));
    cls->defineProperty("projection", _SE(js_scene_ICameraInfo_get_projection), _SE(js_scene_ICameraInfo_set_projection));
    cls->defineProperty("targetDisplay", _SE(js_scene_ICameraInfo_get_targetDisplay), _SE(js_scene_ICameraInfo_set_targetDisplay));
    cls->defineProperty("window", _SE(js_scene_ICameraInfo_get_window), _SE(js_scene_ICameraInfo_set_window));
    cls->defineProperty("priority", _SE(js_scene_ICameraInfo_get_priority), _SE(js_scene_ICameraInfo_set_priority));
    cls->defineProperty("pipeline", _SE(js_scene_ICameraInfo_get_pipeline), _SE(js_scene_ICameraInfo_set_pipeline));
    cls->defineFinalizeFunction(_SE(js_cc_scene_ICameraInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::ICameraInfo>(cls);

    __jsb_cc_scene_ICameraInfo_proto = cls->getProto();
    __jsb_cc_scene_ICameraInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Camera_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_Camera_class = nullptr;  // NOLINT

static bool js_scene_Camera_attachToScene(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_attachToScene : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::RenderScene*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_attachToScene : Error processing arguments");
        cobj->attachToScene(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Camera_attachToScene)

static bool js_scene_Camera_changeTargetWindow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_changeTargetWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::RenderWindow*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_changeTargetWindow : Error processing arguments");
        cobj->changeTargetWindow(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Camera_changeTargetWindow)

static bool js_scene_Camera_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Camera_destroy)

static bool js_scene_Camera_detachCamera(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_detachCamera : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->detachCamera();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Camera_detachCamera)

static bool js_scene_Camera_detachFromScene(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_detachFromScene : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->detachFromScene();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Camera_detachFromScene)

static bool js_scene_Camera_getAperture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getAperture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getAperture());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getAperture : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getAperture)

static bool js_scene_Camera_getApertureValue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getApertureValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getApertureValue();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getApertureValue : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getApertureValue)

static bool js_scene_Camera_getAspect(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getAspect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getAspect();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getAspect : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getAspect)

static bool js_scene_Camera_getClearColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getClearColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::Color& result = cobj->getClearColor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getClearColor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getClearColor)

static bool js_scene_Camera_getClearDepth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getClearDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getClearDepth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getClearDepth : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getClearDepth)

static bool js_scene_Camera_getClearFlag(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getClearFlag : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getClearFlag());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getClearFlag : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getClearFlag)

static bool js_scene_Camera_getClearStencil(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getClearStencil : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getClearStencil();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getClearStencil : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getClearStencil)

static bool js_scene_Camera_getEc(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getEc : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getEc();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getEc : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getEc)

static bool js_scene_Camera_getExposure(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getExposure : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getExposure();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getExposure : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getExposure)

static bool js_scene_Camera_getFarClip(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getFarClip : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFarClip();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getFarClip : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getFarClip)

static bool js_scene_Camera_getForward(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getForward : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec3& result = cobj->getForward();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getForward : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getForward)

static bool js_scene_Camera_getFov(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getFov : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFov();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getFov : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getFov)

static bool js_scene_Camera_getFovAxis(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getFovAxis : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getFovAxis());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getFovAxis : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getFovAxis)

static bool js_scene_Camera_getFrustum(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getFrustum : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::geometry::Frustum& result = cobj->getFrustum();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getFrustum : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getFrustum)

static bool js_scene_Camera_getHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHeight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getHeight : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getHeight)

static bool js_scene_Camera_getIso(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getIso : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getIso());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getIso : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getIso)

static bool js_scene_Camera_getIsoValue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getIsoValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getIsoValue();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getIsoValue : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getIsoValue)

static bool js_scene_Camera_getMatProj(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getMatProj : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Mat4& result = cobj->getMatProj();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getMatProj : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getMatProj)

static bool js_scene_Camera_getMatProjInv(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getMatProjInv : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Mat4& result = cobj->getMatProjInv();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getMatProjInv : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getMatProjInv)

static bool js_scene_Camera_getMatView(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getMatView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Mat4& result = cobj->getMatView();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getMatView : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getMatView)

static bool js_scene_Camera_getMatViewProj(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getMatViewProj : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Mat4& result = cobj->getMatViewProj();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getMatViewProj : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getMatViewProj)

static bool js_scene_Camera_getMatViewProjInv(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getMatViewProjInv : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Mat4& result = cobj->getMatViewProjInv();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getMatViewProjInv : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getMatViewProjInv)

static bool js_scene_Camera_getName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getName)

static bool js_scene_Camera_getNearClip(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getNearClip : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getNearClip();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getNearClip : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getNearClip)

static bool js_scene_Camera_getNode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Node* result = cobj->getNode();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getNode : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getNode)

static bool js_scene_Camera_getOrthoHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getOrthoHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getOrthoHeight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getOrthoHeight : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getOrthoHeight)

static bool js_scene_Camera_getPosition(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec3& result = cobj->getPosition();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getPosition : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getPosition)

static bool js_scene_Camera_getPriority(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getPriority : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getPriority();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getPriority : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getPriority)

static bool js_scene_Camera_getProjectionType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getProjectionType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getProjectionType());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getProjectionType : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getProjectionType)

static bool js_scene_Camera_getScene(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getScene : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::RenderScene* result = cobj->getScene();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getScene : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getScene)

static bool js_scene_Camera_getScreenScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getScreenScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getScreenScale();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getScreenScale : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getScreenScale)

static bool js_scene_Camera_getShutter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getShutter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getShutter());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getShutter : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getShutter)

static bool js_scene_Camera_getShutterValue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getShutterValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShutterValue();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getShutterValue : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getShutterValue)

static bool js_scene_Camera_getViewport(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getViewport : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec4& result = cobj->getViewport();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getViewport : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getViewport)

static bool js_scene_Camera_getVisibility(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getVisibility : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getVisibility();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getVisibility : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getVisibility)

static bool js_scene_Camera_getWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getWidth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getWidth : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getWidth)

static bool js_scene_Camera_getWindow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_getWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::RenderWindow* result = cobj->getWindow();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getWindow : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_getWindow)

static bool js_scene_Camera_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::ICameraInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_initialize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Camera_initialize)

static bool js_scene_Camera_isEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_isEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isEnabled();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_isEnabled : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_isEnabled)

static bool js_scene_Camera_isWindowSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_isWindowSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isWindowSize();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_isWindowSize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Camera_isWindowSize)

static bool js_scene_Camera_resize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_resize : Error processing arguments");
        cobj->resize(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Camera_resize)

static bool js_scene_Camera_setAperture(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setAperture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::CameraAperture, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setAperture : Error processing arguments");
        cobj->setAperture(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setAperture)

static bool js_scene_Camera_setClearColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setClearColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Color, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setClearColor : Error processing arguments");
        cobj->setClearColor(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setClearColor)

static bool js_scene_Camera_setClearDepth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setClearDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setClearDepth : Error processing arguments");
        cobj->setClearDepth(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setClearDepth)

static bool js_scene_Camera_setClearFlag(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setClearFlag : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::ClearFlagBit, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setClearFlag : Error processing arguments");
        cobj->setClearFlag(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setClearFlag)

static bool js_scene_Camera_setClearStencil(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setClearStencil : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setClearStencil : Error processing arguments");
        cobj->setClearStencil(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setClearStencil)

static bool js_scene_Camera_setEc(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setEc : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setEc : Error processing arguments");
        cobj->setEc(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setEc)

static bool js_scene_Camera_setEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setEnabled : Error processing arguments");
        cobj->setEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setEnabled)

static bool js_scene_Camera_setFarClip(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setFarClip : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setFarClip : Error processing arguments");
        cobj->setFarClip(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setFarClip)

static bool js_scene_Camera_setFixedSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setFixedSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setFixedSize : Error processing arguments");
        cobj->setFixedSize(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Camera_setFixedSize)

static bool js_scene_Camera_setForward(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setForward : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setForward : Error processing arguments");
        cobj->setForward(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setForward)

static bool js_scene_Camera_setFov(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setFov : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setFov : Error processing arguments");
        cobj->setFov(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setFov)

static bool js_scene_Camera_setFovAxis(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setFovAxis : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::CameraFOVAxis, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setFovAxis : Error processing arguments");
        cobj->setFovAxis(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setFovAxis)

static bool js_scene_Camera_setFrustum(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setFrustum : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::geometry::Frustum, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setFrustum : Error processing arguments");
        cobj->setFrustum(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setFrustum)

static bool js_scene_Camera_setIso(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setIso : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::CameraISO, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setIso : Error processing arguments");
        cobj->setIso(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setIso)

static bool js_scene_Camera_setNearClip(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setNearClip : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setNearClip : Error processing arguments");
        cobj->setNearClip(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setNearClip)

static bool js_scene_Camera_setNode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setNode : Error processing arguments");
        cobj->setNode(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setNode)

static bool js_scene_Camera_setOrthoHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setOrthoHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setOrthoHeight : Error processing arguments");
        cobj->setOrthoHeight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setOrthoHeight)

static bool js_scene_Camera_setPosition(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setPosition : Error processing arguments");
        cobj->setPosition(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setPosition)

static bool js_scene_Camera_setPriority(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setPriority : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setPriority : Error processing arguments");
        cobj->setPriority(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setPriority)

static bool js_scene_Camera_setProjectionType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setProjectionType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::CameraProjection, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setProjectionType : Error processing arguments");
        cobj->setProjectionType(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setProjectionType)

static bool js_scene_Camera_setScreenScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setScreenScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setScreenScale : Error processing arguments");
        cobj->setScreenScale(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setScreenScale)

static bool js_scene_Camera_setShutter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setShutter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::CameraShutter, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setShutter : Error processing arguments");
        cobj->setShutter(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setShutter)

static bool js_scene_Camera_setViewport(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setViewport : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec4, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setViewport : Error processing arguments");
        cobj->setViewport(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setViewport)

static bool js_scene_Camera_setViewportInOrientedSpace(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setViewportInOrientedSpace : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec4, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setViewportInOrientedSpace : Error processing arguments");
        cobj->setViewportInOrientedSpace(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Camera_setViewportInOrientedSpace)

static bool js_scene_Camera_setVisibility(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setVisibility : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setVisibility : Error processing arguments");
        cobj->setVisibility(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setVisibility)

static bool js_scene_Camera_setWindow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::RenderWindow*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setWindow : Error processing arguments");
        cobj->setWindow(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setWindow)

static bool js_scene_Camera_setWindowSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_setWindowSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_setWindowSize : Error processing arguments");
        cobj->setWindowSize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Camera_setWindowSize)

static bool js_scene_Camera_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Camera>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Camera_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->update();
        return true;
    }
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Camera_update : Error processing arguments");
        cobj->update(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Camera_update)

static bool js_scene_Camera_getStandardExposureValue_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cc::scene::Camera::getStandardExposureValue();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getStandardExposureValue_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Camera_getStandardExposureValue_static)

static bool js_scene_Camera_getStandardLightMeterScale_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cc::scene::Camera::getStandardLightMeterScale();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Camera_getStandardLightMeterScale_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Camera_getStandardLightMeterScale_static)

static bool js_scene_Camera_get_SKYBOX_FLAG(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cc::scene::Camera::SKYBOX_FLAG, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    // SE_HOLD_RETURN_VALUE(cobj->SKYBOX_FLAG, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Camera_get_SKYBOX_FLAG)


SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Camera_finalize)

static bool js_scene_Camera_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::gfx::Device* arg0 = nullptr;
    ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Camera_constructor : Error processing arguments");
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::Camera, arg0);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_Camera_constructor, __jsb_cc_scene_Camera_class, js_cc_scene_Camera_finalize)

static bool js_cc_scene_Camera_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Camera_finalize)

bool js_register_scene_Camera(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Camera", obj, nullptr, _SE(js_scene_Camera_constructor));

    cls->defineProperty("iso", _SE(js_scene_Camera_getIso_asGetter), _SE(js_scene_Camera_setIso_asSetter));
    cls->defineProperty("isoValue", _SE(js_scene_Camera_getIsoValue_asGetter), nullptr);
    cls->defineProperty("ec", _SE(js_scene_Camera_getEc_asGetter), _SE(js_scene_Camera_setEc_asSetter));
    cls->defineProperty("exposure", _SE(js_scene_Camera_getExposure_asGetter), nullptr);
    cls->defineProperty("shutter", _SE(js_scene_Camera_getShutter_asGetter), _SE(js_scene_Camera_setShutter_asSetter));
    cls->defineProperty("shutterValue", _SE(js_scene_Camera_getShutterValue_asGetter), nullptr);
    cls->defineProperty("apertureValue", _SE(js_scene_Camera_getApertureValue_asGetter), nullptr);
    cls->defineProperty("width", _SE(js_scene_Camera_getWidth_asGetter), nullptr);
    cls->defineProperty("height", _SE(js_scene_Camera_getHeight_asGetter), nullptr);
    cls->defineProperty("aspect", _SE(js_scene_Camera_getAspect_asGetter), nullptr);
    cls->defineProperty("matView", _SE(js_scene_Camera_getMatView_asGetter), nullptr);
    cls->defineProperty("matProj", _SE(js_scene_Camera_getMatProj_asGetter), nullptr);
    cls->defineProperty("matProjInv", _SE(js_scene_Camera_getMatProjInv_asGetter), nullptr);
    cls->defineProperty("matViewProj", _SE(js_scene_Camera_getMatViewProj_asGetter), nullptr);
    cls->defineProperty("matViewProjInv", _SE(js_scene_Camera_getMatViewProjInv_asGetter), nullptr);
    cls->defineProperty("scene", _SE(js_scene_Camera_getScene_asGetter), nullptr);
    cls->defineProperty("name", _SE(js_scene_Camera_getName_asGetter), nullptr);
    cls->defineProperty("window", _SE(js_scene_Camera_getWindow_asGetter), _SE(js_scene_Camera_setWindow_asSetter));
    cls->defineProperty("forward", _SE(js_scene_Camera_getForward_asGetter), _SE(js_scene_Camera_setForward_asSetter));
    cls->defineProperty("aperture", _SE(js_scene_Camera_getAperture_asGetter), _SE(js_scene_Camera_setAperture_asSetter));
    cls->defineProperty("position", _SE(js_scene_Camera_getPosition_asGetter), _SE(js_scene_Camera_setPosition_asSetter));
    cls->defineProperty("projectionType", _SE(js_scene_Camera_getProjectionType_asGetter), _SE(js_scene_Camera_setProjectionType_asSetter));
    cls->defineProperty("fovAxis", _SE(js_scene_Camera_getFovAxis_asGetter), _SE(js_scene_Camera_setFovAxis_asSetter));
    cls->defineProperty("fov", _SE(js_scene_Camera_getFov_asGetter), _SE(js_scene_Camera_setFov_asSetter));
    cls->defineProperty("nearClip", _SE(js_scene_Camera_getNearClip_asGetter), _SE(js_scene_Camera_setNearClip_asSetter));
    cls->defineProperty("farClip", _SE(js_scene_Camera_getFarClip_asGetter), _SE(js_scene_Camera_setFarClip_asSetter));
    cls->defineProperty("viewport", _SE(js_scene_Camera_getViewport_asGetter), _SE(js_scene_Camera_setViewport_asSetter));
    cls->defineProperty("orthoHeight", _SE(js_scene_Camera_getOrthoHeight_asGetter), _SE(js_scene_Camera_setOrthoHeight_asSetter));
    cls->defineProperty("clearColor", _SE(js_scene_Camera_getClearColor_asGetter), _SE(js_scene_Camera_setClearColor_asSetter));
    cls->defineProperty("clearDepth", _SE(js_scene_Camera_getClearDepth_asGetter), _SE(js_scene_Camera_setClearDepth_asSetter));
    cls->defineProperty("clearFlag", _SE(js_scene_Camera_getClearFlag_asGetter), _SE(js_scene_Camera_setClearFlag_asSetter));
    cls->defineProperty("clearStencil", _SE(js_scene_Camera_getClearStencil_asGetter), _SE(js_scene_Camera_setClearStencil_asSetter));
    cls->defineProperty("enabled", _SE(js_scene_Camera_isEnabled_asGetter), _SE(js_scene_Camera_setEnabled_asSetter));
    cls->defineProperty("frustum", _SE(js_scene_Camera_getFrustum_asGetter), _SE(js_scene_Camera_setFrustum_asSetter));
    cls->defineProperty("isWindowSize", _SE(js_scene_Camera_isWindowSize_asGetter), _SE(js_scene_Camera_setWindowSize_asSetter));
    cls->defineProperty("priority", _SE(js_scene_Camera_getPriority_asGetter), _SE(js_scene_Camera_setPriority_asSetter));
    cls->defineProperty("screenScale", _SE(js_scene_Camera_getScreenScale_asGetter), _SE(js_scene_Camera_setScreenScale_asSetter));
    cls->defineProperty("visibility", _SE(js_scene_Camera_getVisibility_asGetter), _SE(js_scene_Camera_setVisibility_asSetter));
    cls->defineProperty("node", _SE(js_scene_Camera_getNode_asGetter), _SE(js_scene_Camera_setNode_asSetter));
    cls->defineFunction("attachToScene", _SE(js_scene_Camera_attachToScene));
    cls->defineFunction("changeTargetWindow", _SE(js_scene_Camera_changeTargetWindow));
    cls->defineFunction("destroy", _SE(js_scene_Camera_destroy));
    cls->defineFunction("detachCamera", _SE(js_scene_Camera_detachCamera));
    cls->defineFunction("detachFromScene", _SE(js_scene_Camera_detachFromScene));
    cls->defineFunction("initialize", _SE(js_scene_Camera_initialize));
    cls->defineFunction("resize", _SE(js_scene_Camera_resize));
    cls->defineFunction("setFixedSize", _SE(js_scene_Camera_setFixedSize));
    cls->defineFunction("setViewportInOrientedSpace", _SE(js_scene_Camera_setViewportInOrientedSpace));
    cls->defineFunction("update", _SE(js_scene_Camera_update));
    cls->defineStaticFunction("getStandardExposureValue", _SE(js_scene_Camera_getStandardExposureValue_static));
    cls->defineStaticFunction("getStandardLightMeterScale", _SE(js_scene_Camera_getStandardLightMeterScale_static));
    // static fields
    cls->defineStaticProperty("SKYBOX_FLAG", _SE(js_scene_Camera_get_SKYBOX_FLAG), nullptr);
    cls->defineFinalizeFunction(_SE(js_cc_scene_Camera_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Camera>(cls);

    __jsb_cc_scene_Camera_proto = cls->getProto();
    __jsb_cc_scene_Camera_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_SubModel_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_SubModel_class = nullptr;  // NOLINT

static bool js_scene_SubModel_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_destroy)

static bool js_scene_SubModel_getDescriptorSet(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_getDescriptorSet : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::DescriptorSet* result = cobj->getDescriptorSet();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_getDescriptorSet : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SubModel_getDescriptorSet)

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

static bool js_scene_SubModel_getInputAssembler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_getInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::InputAssembler* result = cobj->getInputAssembler();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_getInputAssembler : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SubModel_getInputAssembler)

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
        const std::vector<cc::IntrusivePtr<cc::scene::Pass>>& result = cobj->getPasses();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_getPasses : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SubModel_getPasses)

static bool js_scene_SubModel_getPatches(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_getPatches : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::scene::IMacroPatch>& result = cobj->getPatches();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_getPatches : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SubModel_getPatches)

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
SE_BIND_FUNC_AS_PROP_GET(js_scene_SubModel_getPlanarInstanceShader)

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
SE_BIND_FUNC_AS_PROP_GET(js_scene_SubModel_getPlanarShader)

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
SE_BIND_FUNC_AS_PROP_GET(js_scene_SubModel_getPriority)

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
        const std::vector<cc::IntrusivePtr<cc::gfx::Shader>>& result = cobj->getShaders();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_getShaders : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SubModel_getShaders)

static bool js_scene_SubModel_getSubMesh(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_getSubMesh : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::RenderingSubMesh* result = cobj->getSubMesh();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_getSubMesh : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SubModel_getSubMesh)

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

static bool js_scene_SubModel_initPlanarShadowInstanceShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_initPlanarShadowInstanceShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->initPlanarShadowInstanceShader();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_initPlanarShadowInstanceShader)

static bool js_scene_SubModel_initPlanarShadowShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_initPlanarShadowShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->initPlanarShadowShader();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_initPlanarShadowShader)

static bool js_scene_SubModel_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<cc::RenderingSubMesh*, false> arg0 = {};
        HolderType<std::shared_ptr<std::vector<cc::IntrusivePtr<cc::scene::Pass>>>, true> arg1 = {};
        HolderType<std::vector<cc::scene::IMacroPatch>, true> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_initialize : Error processing arguments");
        cobj->initialize(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_initialize)

static bool js_scene_SubModel_onMacroPatchesStateChanged(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_onMacroPatchesStateChanged : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::scene::IMacroPatch>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_onMacroPatchesStateChanged : Error processing arguments");
        cobj->onMacroPatchesStateChanged(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_onMacroPatchesStateChanged)

static bool js_scene_SubModel_onPipelineStateChanged(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_onPipelineStateChanged : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onPipelineStateChanged();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SubModel_onPipelineStateChanged)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_SubModel_setDescriptorSet)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_SubModel_setInputAssembler)

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
        HolderType<std::shared_ptr<std::vector<cc::IntrusivePtr<cc::scene::Pass>>>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_setPasses : Error processing arguments");
        cobj->setPasses(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_SubModel_setPasses)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_SubModel_setPlanarInstanceShader)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_SubModel_setPlanarShader)

static bool js_scene_SubModel_setPriority(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_setPriority : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::pipeline::RenderPriority, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_setPriority : Error processing arguments");
        cobj->setPriority(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_SubModel_setPriority)

static bool js_scene_SubModel_setShaders(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_setShaders : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::IntrusivePtr<cc::gfx::Shader>>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_setShaders : Error processing arguments");
        cobj->setShaders(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_SubModel_setShaders)

static bool js_scene_SubModel_setSubMesh(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SubModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SubModel_setSubMesh : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::RenderingSubMesh*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SubModel_setSubMesh : Error processing arguments");
        cobj->setSubMesh(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_SubModel_setSubMesh)

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
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::SubModel);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_SubModel_constructor, __jsb_cc_scene_SubModel_class, js_cc_scene_SubModel_finalize)

static bool js_cc_scene_SubModel_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_SubModel_finalize)

bool js_register_scene_SubModel(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SubModel", obj, nullptr, _SE(js_scene_SubModel_constructor));

    cls->defineProperty("passes", _SE(js_scene_SubModel_getPasses_asGetter), _SE(js_scene_SubModel_setPasses_asSetter));
    cls->defineProperty("shaders", _SE(js_scene_SubModel_getShaders_asGetter), _SE(js_scene_SubModel_setShaders_asSetter));
    cls->defineProperty("subMesh", _SE(js_scene_SubModel_getSubMesh_asGetter), _SE(js_scene_SubModel_setSubMesh_asSetter));
    cls->defineProperty("priority", _SE(js_scene_SubModel_getPriority_asGetter), _SE(js_scene_SubModel_setPriority_asSetter));
    cls->defineProperty("inputAssembler", _SE(js_scene_SubModel_getInputAssembler_asGetter), _SE(js_scene_SubModel_setInputAssembler_asSetter));
    cls->defineProperty("descriptorSet", _SE(js_scene_SubModel_getDescriptorSet_asGetter), _SE(js_scene_SubModel_setDescriptorSet_asSetter));
    cls->defineProperty("patches", _SE(js_scene_SubModel_getPatches_asGetter), nullptr);
    cls->defineProperty("planarInstanceShader", _SE(js_scene_SubModel_getPlanarInstanceShader_asGetter), _SE(js_scene_SubModel_setPlanarInstanceShader_asSetter));
    cls->defineProperty("planarShader", _SE(js_scene_SubModel_getPlanarShader_asGetter), _SE(js_scene_SubModel_setPlanarShader_asSetter));
    cls->defineFunction("destroy", _SE(js_scene_SubModel_destroy));
    cls->defineFunction("getId", _SE(js_scene_SubModel_getId));
    cls->defineFunction("getOwner", _SE(js_scene_SubModel_getOwner));
    cls->defineFunction("getPass", _SE(js_scene_SubModel_getPass));
    cls->defineFunction("getShader", _SE(js_scene_SubModel_getShader));
    cls->defineFunction("getWorldBoundDescriptorSet", _SE(js_scene_SubModel_getWorldBoundDescriptorSet));
    cls->defineFunction("initPlanarShadowInstanceShader", _SE(js_scene_SubModel_initPlanarShadowInstanceShader));
    cls->defineFunction("initPlanarShadowShader", _SE(js_scene_SubModel_initPlanarShadowShader));
    cls->defineFunction("initialize", _SE(js_scene_SubModel_initialize));
    cls->defineFunction("onMacroPatchesStateChanged", _SE(js_scene_SubModel_onMacroPatchesStateChanged));
    cls->defineFunction("onPipelineStateChanged", _SE(js_scene_SubModel_onPipelineStateChanged));
    cls->defineFunction("setOwner", _SE(js_scene_SubModel_setOwner));
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
se::Object* __jsb_cc_scene_InstancedAttributeBlock_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_InstancedAttributeBlock_class = nullptr;  // NOLINT

static bool js_scene_InstancedAttributeBlock_get_buffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::InstancedAttributeBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_InstancedAttributeBlock_get_buffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->buffer, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->buffer, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_InstancedAttributeBlock_get_buffer)

static bool js_scene_InstancedAttributeBlock_set_buffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::InstancedAttributeBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_InstancedAttributeBlock_set_buffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->buffer, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_InstancedAttributeBlock_set_buffer : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_InstancedAttributeBlock_set_buffer)

static bool js_scene_InstancedAttributeBlock_get_views(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::InstancedAttributeBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_InstancedAttributeBlock_get_views : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->views, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->views, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_InstancedAttributeBlock_get_views)

static bool js_scene_InstancedAttributeBlock_set_views(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::InstancedAttributeBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_InstancedAttributeBlock_set_views : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->views, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_InstancedAttributeBlock_set_views : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_InstancedAttributeBlock_set_views)

static bool js_scene_InstancedAttributeBlock_get_attributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::InstancedAttributeBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_InstancedAttributeBlock_get_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->attributes, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->attributes, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_InstancedAttributeBlock_get_attributes)

static bool js_scene_InstancedAttributeBlock_set_attributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::InstancedAttributeBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_InstancedAttributeBlock_set_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->attributes, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_InstancedAttributeBlock_set_attributes : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_InstancedAttributeBlock_set_attributes)


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::InstancedAttributeBlock * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::InstancedAttributeBlock*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("buffer", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->buffer), ctx);
    }
    json->getProperty("views", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->views), ctx);
    }
    json->getProperty("attributes", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->attributes), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_InstancedAttributeBlock_finalize)

static bool js_scene_InstancedAttributeBlock_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::InstancedAttributeBlock);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::InstancedAttributeBlock);
        auto cobj = ptr->get<cc::scene::InstancedAttributeBlock>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::InstancedAttributeBlock);
    auto cobj = ptr->get<cc::scene::InstancedAttributeBlock>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->buffer), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->views), nullptr);
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
SE_BIND_CTOR(js_scene_InstancedAttributeBlock_constructor, __jsb_cc_scene_InstancedAttributeBlock_class, js_cc_scene_InstancedAttributeBlock_finalize)

static bool js_cc_scene_InstancedAttributeBlock_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_InstancedAttributeBlock_finalize)

bool js_register_scene_InstancedAttributeBlock(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IInstancedAttributeBlock", obj, nullptr, _SE(js_scene_InstancedAttributeBlock_constructor));

    cls->defineProperty("buffer", _SE(js_scene_InstancedAttributeBlock_get_buffer), _SE(js_scene_InstancedAttributeBlock_set_buffer));
    cls->defineProperty("views", _SE(js_scene_InstancedAttributeBlock_get_views), _SE(js_scene_InstancedAttributeBlock_set_views));
    cls->defineProperty("attributes", _SE(js_scene_InstancedAttributeBlock_get_attributes), _SE(js_scene_InstancedAttributeBlock_set_attributes));
    cls->defineFinalizeFunction(_SE(js_cc_scene_InstancedAttributeBlock_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::InstancedAttributeBlock>(cls);

    __jsb_cc_scene_InstancedAttributeBlock_proto = cls->getProto();
    __jsb_cc_scene_InstancedAttributeBlock_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Model_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_Model_class = nullptr;  // NOLINT

static bool js_scene_Model_attachToScene(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_attachToScene : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::RenderScene*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_attachToScene : Error processing arguments");
        cobj->attachToScene(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Model_attachToScene)

static bool js_scene_Model_createBoundingShape(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_createBoundingShape : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<boost::optional<cc::Vec3>, true> arg0 = {};
        HolderType<boost::optional<cc::Vec3>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_createBoundingShape : Error processing arguments");
        cobj->createBoundingShape(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Model_createBoundingShape)

static bool js_scene_Model_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_destroy)

static bool js_scene_Model_detachFromScene(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_detachFromScene : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->detachFromScene();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_detachFromScene)

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
SE_BIND_FUNC_AS_PROP_GET(js_scene_Model_getInstancedAttributeBlock)

static bool js_scene_Model_getInstancedAttributeIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getInstancedAttributeIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_getInstancedAttributeIndex : Error processing arguments");
        int32_t result = cobj->getInstancedAttributeIndex(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getInstancedAttributeIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Model_getInstancedAttributeIndex)

static bool js_scene_Model_getInstancedBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getInstancedBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const unsigned char* result = cobj->getInstancedBuffer();
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

static bool js_scene_Model_getLocalBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getLocalBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Buffer* result = cobj->getLocalBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getLocalBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Model_getLocalBuffer)

static bool js_scene_Model_getLocalData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getLocalData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::TypedArrayTemp<float> result = cobj->getLocalData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getLocalData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_getLocalData)

static bool js_scene_Model_getMacroPatches(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getMacroPatches : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_getMacroPatches : Error processing arguments");
        std::vector<cc::scene::IMacroPatch>& result = cobj->getMacroPatches(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getMacroPatches : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Model_getMacroPatches)

static bool js_scene_Model_getModelBounds(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getModelBounds : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::geometry::AABB* result = cobj->getModelBounds();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getModelBounds : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Model_getModelBounds)

static bool js_scene_Model_getNode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Node* result = cobj->getNode();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getNode : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Model_getNode)

static bool js_scene_Model_getScene(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getScene : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::RenderScene* result = cobj->getScene();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getScene : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Model_getScene)

static bool js_scene_Model_getSubModels(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getSubModels : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::IntrusivePtr<cc::scene::SubModel>>& result = cobj->getSubModels();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getSubModels : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Model_getSubModels)

static bool js_scene_Model_getTransform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Node* result = cobj->getTransform();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getTransform : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Model_getTransform)

static bool js_scene_Model_getType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getType());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getType : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Model_getType)

static bool js_scene_Model_getUpdateStamp(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getUpdateStamp : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getUpdateStamp();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getUpdateStamp : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Model_getUpdateStamp)

static bool js_scene_Model_getVisFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getVisFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getVisFlags());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getVisFlags : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Model_getVisFlags)

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
SE_BIND_FUNC_AS_PROP_GET(js_scene_Model_getWorldBoundBuffer)

static bool js_scene_Model_getWorldBounds(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_getWorldBounds : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::geometry::AABB* result = cobj->getWorldBounds();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_getWorldBounds : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Model_getWorldBounds)

static bool js_scene_Model_initLocalDescriptors(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_initLocalDescriptors : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_initLocalDescriptors : Error processing arguments");
        cobj->initLocalDescriptors(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Model_initLocalDescriptors)

static bool js_scene_Model_initSubModel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_initSubModel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<int, false> arg0 = {};
        HolderType<cc::RenderingSubMesh*, false> arg1 = {};
        HolderType<cc::Material*, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_initSubModel : Error processing arguments");
        cobj->initSubModel(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_scene_Model_initSubModel)

static bool js_scene_Model_initWorldBoundDescriptors(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_initWorldBoundDescriptors : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_initWorldBoundDescriptors : Error processing arguments");
        cobj->initWorldBoundDescriptors(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Model_initWorldBoundDescriptors)

static bool js_scene_Model_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->initialize();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_initialize)

static bool js_scene_Model_isCastShadow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_isCastShadow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isCastShadow();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_isCastShadow : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Model_isCastShadow)

static bool js_scene_Model_isDynamicBatching(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_isDynamicBatching : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isDynamicBatching();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_isDynamicBatching : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Model_isDynamicBatching)

static bool js_scene_Model_isEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_isEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isEnabled();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_isEnabled : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Model_isEnabled)

static bool js_scene_Model_isInited(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_isInited : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isInited();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_isInited : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Model_isInited)

static bool js_scene_Model_isInstancingEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_isInstancingEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isInstancingEnabled();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_isInstancingEnabled : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Model_isInstancingEnabled)

static bool js_scene_Model_isLocalDataUpdated(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_isLocalDataUpdated : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isLocalDataUpdated();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_isLocalDataUpdated : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Model_isLocalDataUpdated)

static bool js_scene_Model_isModelImplementedInJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_isModelImplementedInJS : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isModelImplementedInJS();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_isModelImplementedInJS : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_isModelImplementedInJS)

static bool js_scene_Model_isReceiveShadow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_isReceiveShadow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isReceiveShadow();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Model_isReceiveShadow : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Model_isReceiveShadow)

static bool js_scene_Model_onGlobalPipelineStateChanged(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_onGlobalPipelineStateChanged : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onGlobalPipelineStateChanged();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_onGlobalPipelineStateChanged)

static bool js_scene_Model_onMacroPatchesStateChanged(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_onMacroPatchesStateChanged : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onMacroPatchesStateChanged();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_onMacroPatchesStateChanged)

static bool js_scene_Model_setBounds(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setBounds : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::geometry::AABB*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setBounds : Error processing arguments");
        cobj->setBounds(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Model_setBounds)

static bool js_scene_Model_setCalledFromJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setCalledFromJS : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setCalledFromJS : Error processing arguments");
        cobj->setCalledFromJS(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Model_setCalledFromJS)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_Model_setCastShadow)

static bool js_scene_Model_setDynamicBatching(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setDynamicBatching : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setDynamicBatching : Error processing arguments");
        cobj->setDynamicBatching(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Model_setDynamicBatching)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_Model_setEnabled)

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

static bool js_scene_Model_setInstancedAttributeBlock(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setInstancedAttributeBlock : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::InstancedAttributeBlock, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setInstancedAttributeBlock : Error processing arguments");
        cobj->setInstancedAttributeBlock(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Model_setInstancedAttributeBlock)

static bool js_scene_Model_setInstancedAttributesViewData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setInstancedAttributesViewData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<int, false> arg0 = {};
        HolderType<int, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setInstancedAttributesViewData : Error processing arguments");
        cobj->setInstancedAttributesViewData(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_scene_Model_setInstancedAttributesViewData)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_Model_setLocalBuffer)

static bool js_scene_Model_setLocalDataUpdated(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setLocalDataUpdated : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setLocalDataUpdated : Error processing arguments");
        cobj->setLocalDataUpdated(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Model_setLocalDataUpdated)

static bool js_scene_Model_setModelBounds(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setModelBounds : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::geometry::AABB*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setModelBounds : Error processing arguments");
        cobj->setModelBounds(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Model_setModelBounds)

static bool js_scene_Model_setNode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setNode : Error processing arguments");
        cobj->setNode(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Model_setNode)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_Model_setReceiveShadow)

static bool js_scene_Model_setScene(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setScene : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::RenderScene*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setScene : Error processing arguments");
        cobj->setScene(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Model_setScene)

static bool js_scene_Model_setSubModelMaterial(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setSubModelMaterial : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<int, false> arg0 = {};
        HolderType<cc::Material*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setSubModelMaterial : Error processing arguments");
        cobj->setSubModelMaterial(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Model_setSubModelMaterial)

static bool js_scene_Model_setSubModelMesh(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setSubModelMesh : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<int, false> arg0 = {};
        HolderType<cc::RenderingSubMesh*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setSubModelMesh : Error processing arguments");
        cobj->setSubModelMesh(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Model_setSubModelMesh)

static bool js_scene_Model_setTransform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Node*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setTransform : Error processing arguments");
        cobj->setTransform(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Model_setTransform)

static bool js_scene_Model_setType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Model::Type, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setType : Error processing arguments");
        cobj->setType(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Model_setType)

static bool js_scene_Model_setVisFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setVisFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Layers::LayerList, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setVisFlags : Error processing arguments");
        cobj->setVisFlags(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Model_setVisFlags)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_Model_setWorldBoundBuffer)

static bool js_scene_Model_setWorldBounds(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_setWorldBounds : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::geometry::AABB*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_setWorldBounds : Error processing arguments");
        cobj->setWorldBounds(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Model_setWorldBounds)

static bool js_scene_Model_updateInstancedAttributes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_updateInstancedAttributes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::vector<cc::gfx::Attribute>, true> arg0 = {};
        HolderType<cc::scene::Pass*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_updateInstancedAttributes : Error processing arguments");
        cobj->updateInstancedAttributes(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Model_updateInstancedAttributes)

static bool js_scene_Model_updateLightingmap(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_updateLightingmap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::Texture2D*, false> arg0 = {};
        HolderType<cc::Vec4, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_updateLightingmap : Error processing arguments");
        cobj->updateLightingmap(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Model_updateLightingmap)

static bool js_scene_Model_updateLocalDescriptors(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_updateLocalDescriptors : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<int, false> arg0 = {};
        HolderType<cc::gfx::DescriptorSet*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_updateLocalDescriptors : Error processing arguments");
        cobj->updateLocalDescriptors(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Model_updateLocalDescriptors)

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

static bool js_scene_Model_updateWorldBound(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_updateWorldBound : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateWorldBound();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Model_updateWorldBound)

static bool js_scene_Model_updateWorldBoundDescriptors(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_updateWorldBoundDescriptors : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<int, false> arg0 = {};
        HolderType<cc::gfx::DescriptorSet*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_updateWorldBoundDescriptors : Error processing arguments");
        cobj->updateWorldBoundDescriptors(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Model_updateWorldBoundDescriptors)

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

static bool js_scene_Model_updateWorldBoundsForJSBakedSkinningModel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_updateWorldBoundsForJSBakedSkinningModel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::geometry::AABB*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_updateWorldBoundsForJSBakedSkinningModel : Error processing arguments");
        cobj->updateWorldBoundsForJSBakedSkinningModel(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Model_updateWorldBoundsForJSBakedSkinningModel)

static bool js_scene_Model_updateWorldBoundsForJSSkinningModel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Model_updateWorldBoundsForJSSkinningModel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::Vec3, true> arg0 = {};
        HolderType<cc::Vec3, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Model_updateWorldBoundsForJSSkinningModel : Error processing arguments");
        cobj->updateWorldBoundsForJSSkinningModel(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Model_updateWorldBoundsForJSSkinningModel)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Model_finalize)

static bool js_scene_Model_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::Model);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_Model_constructor, __jsb_cc_scene_Model_class, js_cc_scene_Model_finalize)

static bool js_cc_scene_Model_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Model_finalize)

bool js_register_scene_Model(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Model", obj, nullptr, _SE(js_scene_Model_constructor));

    cls->defineProperty("scene", _SE(js_scene_Model_getScene_asGetter), _SE(js_scene_Model_setScene_asSetter));
    cls->defineProperty({"_subModels", "subModels"}, _SE(js_scene_Model_getSubModels_asGetter), nullptr);
    cls->defineProperty("inited", _SE(js_scene_Model_isInited_asGetter), nullptr);
    cls->defineProperty("_localDataUpdated", _SE(js_scene_Model_isLocalDataUpdated_asGetter), _SE(js_scene_Model_setLocalDataUpdated_asSetter));
    cls->defineProperty({"_worldBounds", "worldBounds"}, _SE(js_scene_Model_getWorldBounds_asGetter), _SE(js_scene_Model_setWorldBounds_asSetter));
    cls->defineProperty({"_modelBounds", "modelBounds"}, _SE(js_scene_Model_getModelBounds_asGetter), _SE(js_scene_Model_setModelBounds_asSetter));
    cls->defineProperty("worldBoundBuffer", _SE(js_scene_Model_getWorldBoundBuffer_asGetter), _SE(js_scene_Model_setWorldBoundBuffer_asSetter));
    cls->defineProperty("localBuffer", _SE(js_scene_Model_getLocalBuffer_asGetter), _SE(js_scene_Model_setLocalBuffer_asSetter));
    cls->defineProperty("updateStamp", _SE(js_scene_Model_getUpdateStamp_asGetter), nullptr);
    cls->defineProperty("isInstancingEnabled", _SE(js_scene_Model_isInstancingEnabled_asGetter), nullptr);
    cls->defineProperty("receiveShadow", _SE(js_scene_Model_isReceiveShadow_asGetter), _SE(js_scene_Model_setReceiveShadow_asSetter));
    cls->defineProperty("castShadow", _SE(js_scene_Model_isCastShadow_asGetter), _SE(js_scene_Model_setCastShadow_asSetter));
    cls->defineProperty("node", _SE(js_scene_Model_getNode_asGetter), _SE(js_scene_Model_setNode_asSetter));
    cls->defineProperty("transform", _SE(js_scene_Model_getTransform_asGetter), _SE(js_scene_Model_setTransform_asSetter));
    cls->defineProperty("visFlags", _SE(js_scene_Model_getVisFlags_asGetter), _SE(js_scene_Model_setVisFlags_asSetter));
    cls->defineProperty("enabled", _SE(js_scene_Model_isEnabled_asGetter), _SE(js_scene_Model_setEnabled_asSetter));
    cls->defineProperty("type", _SE(js_scene_Model_getType_asGetter), _SE(js_scene_Model_setType_asSetter));
    cls->defineProperty("instancedAttributes", _SE(js_scene_Model_getInstancedAttributeBlock_asGetter), _SE(js_scene_Model_setInstancedAttributeBlock_asSetter));
    cls->defineProperty("isDynamicBatching", _SE(js_scene_Model_isDynamicBatching_asGetter), _SE(js_scene_Model_setDynamicBatching_asSetter));
    cls->defineFunction("attachToScene", _SE(js_scene_Model_attachToScene));
    cls->defineFunction("createBoundingShape", _SE(js_scene_Model_createBoundingShape));
    cls->defineFunction("destroy", _SE(js_scene_Model_destroy));
    cls->defineFunction("detachFromScene", _SE(js_scene_Model_detachFromScene));
    cls->defineFunction("getInstMatWorldIdx", _SE(js_scene_Model_getInstMatWorldIdx));
    cls->defineFunction("getInstanceAttributes", _SE(js_scene_Model_getInstanceAttributes));
    cls->defineFunction("_getInstancedAttributeIndex", _SE(js_scene_Model_getInstancedAttributeIndex));
    cls->defineFunction("getInstancedBuffer", _SE(js_scene_Model_getInstancedBuffer));
    cls->defineFunction("getInstancedBufferSize", _SE(js_scene_Model_getInstancedBufferSize));
    cls->defineFunction("getLocalData", _SE(js_scene_Model_getLocalData));
    cls->defineFunction("getMacroPatches", _SE(js_scene_Model_getMacroPatches));
    cls->defineFunction("_initLocalDescriptors", _SE(js_scene_Model_initLocalDescriptors));
    cls->defineFunction("initSubModel", _SE(js_scene_Model_initSubModel));
    cls->defineFunction("initWorldBoundDescriptors", _SE(js_scene_Model_initWorldBoundDescriptors));
    cls->defineFunction("initialize", _SE(js_scene_Model_initialize));
    cls->defineFunction("isModelImplementedInJS", _SE(js_scene_Model_isModelImplementedInJS));
    cls->defineFunction("onGlobalPipelineStateChanged", _SE(js_scene_Model_onGlobalPipelineStateChanged));
    cls->defineFunction("onMacroPatchesStateChanged", _SE(js_scene_Model_onMacroPatchesStateChanged));
    cls->defineFunction("setBounds", _SE(js_scene_Model_setBounds));
    cls->defineFunction("setCalledFromJS", _SE(js_scene_Model_setCalledFromJS));
    cls->defineFunction("setInstMatWorldIdx", _SE(js_scene_Model_setInstMatWorldIdx));
    cls->defineFunction("setInstancedAttributesViewData", _SE(js_scene_Model_setInstancedAttributesViewData));
    cls->defineFunction("setSubModelMaterial", _SE(js_scene_Model_setSubModelMaterial));
    cls->defineFunction("setSubModelMesh", _SE(js_scene_Model_setSubModelMesh));
    cls->defineFunction("_updateInstancedAttributes", _SE(js_scene_Model_updateInstancedAttributes));
    cls->defineFunction("updateLightingmap", _SE(js_scene_Model_updateLightingmap));
    cls->defineFunction("_updateLocalDescriptors", _SE(js_scene_Model_updateLocalDescriptors));
    cls->defineFunction("updateTransform", _SE(js_scene_Model_updateTransform));
    cls->defineFunction("updateUBOs", _SE(js_scene_Model_updateUBOs));
    cls->defineFunction("updateWorldBound", _SE(js_scene_Model_updateWorldBound));
    cls->defineFunction("updateWorldBoundDescriptors", _SE(js_scene_Model_updateWorldBoundDescriptors));
    cls->defineFunction("updateWorldBoundUBOs", _SE(js_scene_Model_updateWorldBoundUBOs));
    cls->defineFunction("updateWorldBoundsForJSBakedSkinningModel", _SE(js_scene_Model_updateWorldBoundsForJSBakedSkinningModel));
    cls->defineFunction("updateWorldBoundsForJSSkinningModel", _SE(js_scene_Model_updateWorldBoundsForJSSkinningModel));
    cls->defineFinalizeFunction(_SE(js_cc_scene_Model_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Model>(cls);

    __jsb_cc_scene_Model_proto = cls->getProto();
    __jsb_cc_scene_Model_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_IRenderSceneInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_IRenderSceneInfo_class = nullptr;  // NOLINT

static bool js_scene_IRenderSceneInfo_get_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::IRenderSceneInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IRenderSceneInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->name, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_IRenderSceneInfo_get_name)

static bool js_scene_IRenderSceneInfo_set_name(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::IRenderSceneInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IRenderSceneInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_IRenderSceneInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_IRenderSceneInfo_set_name)


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::IRenderSceneInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::IRenderSceneInfo*>(json->getPrivateData());
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
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_IRenderSceneInfo_finalize)

static bool js_scene_IRenderSceneInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::IRenderSceneInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::IRenderSceneInfo);
    auto cobj = ptr->get<cc::scene::IRenderSceneInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->name), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_IRenderSceneInfo_constructor, __jsb_cc_scene_IRenderSceneInfo_class, js_cc_scene_IRenderSceneInfo_finalize)

static bool js_cc_scene_IRenderSceneInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_IRenderSceneInfo_finalize)

bool js_register_scene_IRenderSceneInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IRenderSceneInfo", obj, nullptr, _SE(js_scene_IRenderSceneInfo_constructor));

    cls->defineProperty("name", _SE(js_scene_IRenderSceneInfo_get_name), _SE(js_scene_IRenderSceneInfo_set_name));
    cls->defineFinalizeFunction(_SE(js_cc_scene_IRenderSceneInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::IRenderSceneInfo>(cls);

    __jsb_cc_scene_IRenderSceneInfo_proto = cls->getProto();
    __jsb_cc_scene_IRenderSceneInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_RenderScene_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_RenderScene_class = nullptr;  // NOLINT

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

static bool js_scene_RenderScene_addCamera(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_addCamera : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Camera*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_addCamera : Error processing arguments");
        cobj->addCamera(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_addCamera)

static bool js_scene_RenderScene_addDirectionalLight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_addDirectionalLight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::DirectionalLight*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_addDirectionalLight : Error processing arguments");
        cobj->addDirectionalLight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_addDirectionalLight)

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

static bool js_scene_RenderScene_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_destroy)

static bool js_scene_RenderScene_generateModelId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_generateModelId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uint64_t result = cobj->generateModelId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_generateModelId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_generateModelId)

static bool js_scene_RenderScene_getBatches(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_getBatches : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::scene::DrawBatch2D *>& result = cobj->getBatches();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_getBatches : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_getBatches)

static bool js_scene_RenderScene_getCameras(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_getCameras : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::IntrusivePtr<cc::scene::Camera>>& result = cobj->getCameras();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_getCameras : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_RenderScene_getCameras)
SE_BIND_FUNC(js_scene_RenderScene_getCameras)

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
SE_BIND_FUNC_AS_PROP_GET(js_scene_RenderScene_getMainLight)
SE_BIND_FUNC(js_scene_RenderScene_getMainLight)

static bool js_scene_RenderScene_getModels(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_getModels : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::IntrusivePtr<cc::scene::Model>>& result = cobj->getModels();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_getModels : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_RenderScene_getModels)

static bool js_scene_RenderScene_getName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_getName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_RenderScene_getName)

static bool js_scene_RenderScene_getOctree(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_getOctree : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Octree* result = cobj->getOctree();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_getOctree : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_getOctree)

static bool js_scene_RenderScene_getSphereLights(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_getSphereLights : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::IntrusivePtr<cc::scene::SphereLight>>& result = cobj->getSphereLights();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_getSphereLights : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_RenderScene_getSphereLights)
SE_BIND_FUNC(js_scene_RenderScene_getSphereLights)

static bool js_scene_RenderScene_getSpotLights(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_getSpotLights : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::IntrusivePtr<cc::scene::SpotLight>>& result = cobj->getSpotLights();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_getSpotLights : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_RenderScene_getSpotLights)
SE_BIND_FUNC(js_scene_RenderScene_getSpotLights)

static bool js_scene_RenderScene_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::IRenderSceneInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_initialize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_initialize)

static bool js_scene_RenderScene_onGlobalPipelineStateChanged(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_onGlobalPipelineStateChanged : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onGlobalPipelineStateChanged();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_onGlobalPipelineStateChanged)

static bool js_scene_RenderScene_removeBatch(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_removeBatch : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::DrawBatch2D*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_removeBatch : Error processing arguments");
        cobj->removeBatch(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
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

static bool js_scene_RenderScene_removeCamera(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_removeCamera : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Camera*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_removeCamera : Error processing arguments");
        cobj->removeCamera(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_removeCamera)

static bool js_scene_RenderScene_removeCameras(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_removeCameras : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->removeCameras();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_removeCameras)

static bool js_scene_RenderScene_removeDirectionalLight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_removeDirectionalLight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::DirectionalLight*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_removeDirectionalLight : Error processing arguments");
        cobj->removeDirectionalLight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_removeDirectionalLight)

static bool js_scene_RenderScene_removeModel(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2( cobj, false, "js_scene_RenderScene_removeModel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<cc::scene::Model*, false> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->removeModel(arg0.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<int, false> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->removeModel(arg0.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
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
SE_BIND_FUNC_AS_PROP_SET(js_scene_RenderScene_setMainLight)
SE_BIND_FUNC(js_scene_RenderScene_setMainLight)

static bool js_scene_RenderScene_unsetMainLight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_unsetMainLight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::DirectionalLight*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_unsetMainLight : Error processing arguments");
        cobj->unsetMainLight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_unsetMainLight)

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

static bool js_scene_RenderScene_updateOctree(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderScene>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderScene_updateOctree : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Model*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderScene_updateOctree : Error processing arguments");
        cobj->updateOctree(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderScene_updateOctree)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_RenderScene_finalize)

static bool js_scene_RenderScene_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::RenderScene);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_RenderScene_constructor, __jsb_cc_scene_RenderScene_class, js_cc_scene_RenderScene_finalize)

static bool js_cc_scene_RenderScene_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_RenderScene_finalize)

bool js_register_scene_RenderScene(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RenderScene", obj, nullptr, _SE(js_scene_RenderScene_constructor));

    cls->defineProperty("name", _SE(js_scene_RenderScene_getName_asGetter), nullptr);
    cls->defineProperty("cameras", _SE(js_scene_RenderScene_getCameras_asGetter), nullptr);
    cls->defineProperty("mainLight", _SE(js_scene_RenderScene_getMainLight_asGetter), _SE(js_scene_RenderScene_setMainLight_asSetter));
    cls->defineProperty("sphereLights", _SE(js_scene_RenderScene_getSphereLights_asGetter), nullptr);
    cls->defineProperty("spotLights", _SE(js_scene_RenderScene_getSpotLights_asGetter), nullptr);
    cls->defineProperty("models", _SE(js_scene_RenderScene_getModels_asGetter), nullptr);
    cls->defineFunction("activate", _SE(js_scene_RenderScene_activate));
    cls->defineFunction("addBatch", _SE(js_scene_RenderScene_addBatch));
    cls->defineFunction("addCamera", _SE(js_scene_RenderScene_addCamera));
    cls->defineFunction("addDirectionalLight", _SE(js_scene_RenderScene_addDirectionalLight));
    cls->defineFunction("addModel", _SE(js_scene_RenderScene_addModel));
    cls->defineFunction("addSphereLight", _SE(js_scene_RenderScene_addSphereLight));
    cls->defineFunction("addSpotLight", _SE(js_scene_RenderScene_addSpotLight));
    cls->defineFunction("destroy", _SE(js_scene_RenderScene_destroy));
    cls->defineFunction("generateModelId", _SE(js_scene_RenderScene_generateModelId));
    cls->defineFunction("getBatches", _SE(js_scene_RenderScene_getBatches));
    cls->defineFunction("getCameras", _SE(js_scene_RenderScene_getCameras));
    cls->defineFunction("getDrawBatch2Ds", _SE(js_scene_RenderScene_getDrawBatch2Ds));
    cls->defineFunction("getMainLight", _SE(js_scene_RenderScene_getMainLight));
    cls->defineFunction("getOctree", _SE(js_scene_RenderScene_getOctree));
    cls->defineFunction("getSphereLights", _SE(js_scene_RenderScene_getSphereLights));
    cls->defineFunction("getSpotLights", _SE(js_scene_RenderScene_getSpotLights));
    cls->defineFunction("initialize", _SE(js_scene_RenderScene_initialize));
    cls->defineFunction("onGlobalPipelineStateChanged", _SE(js_scene_RenderScene_onGlobalPipelineStateChanged));
    cls->defineFunction("removeBatch", _SE(js_scene_RenderScene_removeBatch));
    cls->defineFunction("removeBatches", _SE(js_scene_RenderScene_removeBatches));
    cls->defineFunction("removeCamera", _SE(js_scene_RenderScene_removeCamera));
    cls->defineFunction("removeCameras", _SE(js_scene_RenderScene_removeCameras));
    cls->defineFunction("removeDirectionalLight", _SE(js_scene_RenderScene_removeDirectionalLight));
    cls->defineFunction("removeModel", _SE(js_scene_RenderScene_removeModel));
    cls->defineFunction("removeModels", _SE(js_scene_RenderScene_removeModels));
    cls->defineFunction("removeSphereLight", _SE(js_scene_RenderScene_removeSphereLight));
    cls->defineFunction("removeSphereLights", _SE(js_scene_RenderScene_removeSphereLights));
    cls->defineFunction("removeSpotLight", _SE(js_scene_RenderScene_removeSpotLight));
    cls->defineFunction("removeSpotLights", _SE(js_scene_RenderScene_removeSpotLights));
    cls->defineFunction("setMainLight", _SE(js_scene_RenderScene_setMainLight));
    cls->defineFunction("unsetMainLight", _SE(js_scene_RenderScene_unsetMainLight));
    cls->defineFunction("update", _SE(js_scene_RenderScene_update));
    cls->defineFunction("updateOctree", _SE(js_scene_RenderScene_updateOctree));
    cls->defineFinalizeFunction(_SE(js_cc_scene_RenderScene_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::RenderScene>(cls);

    __jsb_cc_scene_RenderScene_proto = cls->getProto();
    __jsb_cc_scene_RenderScene_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_IRenderWindowInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_IRenderWindowInfo_class = nullptr;  // NOLINT

static bool js_scene_IRenderWindowInfo_get_title(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::IRenderWindowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IRenderWindowInfo_get_title : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->title, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->title, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_IRenderWindowInfo_get_title)

static bool js_scene_IRenderWindowInfo_set_title(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::IRenderWindowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IRenderWindowInfo_set_title : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->title, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_IRenderWindowInfo_set_title : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_IRenderWindowInfo_set_title)

static bool js_scene_IRenderWindowInfo_get_width(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::IRenderWindowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IRenderWindowInfo_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->width, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->width, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_IRenderWindowInfo_get_width)

static bool js_scene_IRenderWindowInfo_set_width(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::IRenderWindowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IRenderWindowInfo_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->width, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_IRenderWindowInfo_set_width : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_IRenderWindowInfo_set_width)

static bool js_scene_IRenderWindowInfo_get_height(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::IRenderWindowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IRenderWindowInfo_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->height, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->height, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_IRenderWindowInfo_get_height)

static bool js_scene_IRenderWindowInfo_set_height(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::IRenderWindowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IRenderWindowInfo_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->height, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_IRenderWindowInfo_set_height : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_IRenderWindowInfo_set_height)

static bool js_scene_IRenderWindowInfo_get_renderPassInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::IRenderWindowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IRenderWindowInfo_get_renderPassInfo : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->renderPassInfo, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->renderPassInfo, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_IRenderWindowInfo_get_renderPassInfo)

static bool js_scene_IRenderWindowInfo_set_renderPassInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::IRenderWindowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IRenderWindowInfo_set_renderPassInfo : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->renderPassInfo, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_IRenderWindowInfo_set_renderPassInfo : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_IRenderWindowInfo_set_renderPassInfo)

static bool js_scene_IRenderWindowInfo_get_swapchain(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::IRenderWindowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IRenderWindowInfo_get_swapchain : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->swapchain, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->swapchain, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_IRenderWindowInfo_get_swapchain)

static bool js_scene_IRenderWindowInfo_set_swapchain(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::IRenderWindowInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IRenderWindowInfo_set_swapchain : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->swapchain, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_IRenderWindowInfo_set_swapchain : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_IRenderWindowInfo_set_swapchain)


template<>
bool sevalue_to_native(const se::Value &from, cc::scene::IRenderWindowInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::scene::IRenderWindowInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("title", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->title), ctx);
    }
    json->getProperty("width", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->width), ctx);
    }
    json->getProperty("height", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->height), ctx);
    }
    json->getProperty("renderPassInfo", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->renderPassInfo), ctx);
    }
    json->getProperty("swapchain", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->swapchain), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_IRenderWindowInfo_finalize)

static bool js_scene_IRenderWindowInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::IRenderWindowInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::IRenderWindowInfo);
        auto cobj = ptr->get<cc::scene::IRenderWindowInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::IRenderWindowInfo);
    auto cobj = ptr->get<cc::scene::IRenderWindowInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->title), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->width), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->height), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->renderPassInfo), nullptr);
    }
    if (argc > 4 && !args[4].isUndefined()) {
        ok &= sevalue_to_native(args[4], &(cobj->swapchain), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_IRenderWindowInfo_constructor, __jsb_cc_scene_IRenderWindowInfo_class, js_cc_scene_IRenderWindowInfo_finalize)

static bool js_cc_scene_IRenderWindowInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_IRenderWindowInfo_finalize)

bool js_register_scene_IRenderWindowInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IRenderWindowInfo", obj, nullptr, _SE(js_scene_IRenderWindowInfo_constructor));

    cls->defineProperty("title", _SE(js_scene_IRenderWindowInfo_get_title), _SE(js_scene_IRenderWindowInfo_set_title));
    cls->defineProperty("width", _SE(js_scene_IRenderWindowInfo_get_width), _SE(js_scene_IRenderWindowInfo_set_width));
    cls->defineProperty("height", _SE(js_scene_IRenderWindowInfo_get_height), _SE(js_scene_IRenderWindowInfo_set_height));
    cls->defineProperty("renderPassInfo", _SE(js_scene_IRenderWindowInfo_get_renderPassInfo), _SE(js_scene_IRenderWindowInfo_set_renderPassInfo));
    cls->defineProperty("swapchain", _SE(js_scene_IRenderWindowInfo_get_swapchain), _SE(js_scene_IRenderWindowInfo_set_swapchain));
    cls->defineFinalizeFunction(_SE(js_cc_scene_IRenderWindowInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::IRenderWindowInfo>(cls);

    __jsb_cc_scene_IRenderWindowInfo_proto = cls->getProto();
    __jsb_cc_scene_IRenderWindowInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_RenderWindow_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_RenderWindow_class = nullptr;  // NOLINT

static bool js_scene_RenderWindow_attachCamera(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderWindow_attachCamera : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Camera*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderWindow_attachCamera : Error processing arguments");
        cobj->attachCamera(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderWindow_attachCamera)

static bool js_scene_RenderWindow_clearCameras(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderWindow_clearCameras : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clearCameras();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderWindow_clearCameras)

static bool js_scene_RenderWindow_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderWindow_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderWindow_destroy)

static bool js_scene_RenderWindow_detachCamera(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderWindow_detachCamera : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Camera*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderWindow_detachCamera : Error processing arguments");
        cobj->detachCamera(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderWindow_detachCamera)

static bool js_scene_RenderWindow_extractRenderCameras(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderWindow_extractRenderCameras : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::vector<cc::scene::Camera *>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderWindow_extractRenderCameras : Error processing arguments");
        cobj->extractRenderCameras(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_RenderWindow_extractRenderCameras)

static bool js_scene_RenderWindow_getCameras(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderWindow_getCameras : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::IntrusivePtr<cc::scene::Camera>>& result = cobj->getCameras();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_RenderWindow_getCameras : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_RenderWindow_getCameras)

static bool js_scene_RenderWindow_getFramebuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderWindow_getFramebuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Framebuffer* result = cobj->getFramebuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_RenderWindow_getFramebuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_RenderWindow_getFramebuffer)

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
SE_BIND_FUNC_AS_PROP_GET(js_scene_RenderWindow_getHeight)

static bool js_scene_RenderWindow_getSwapchain(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderWindow_getSwapchain : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Swapchain* result = cobj->getSwapchain();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_RenderWindow_getSwapchain : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_RenderWindow_getSwapchain)

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
SE_BIND_FUNC_AS_PROP_GET(js_scene_RenderWindow_getWidth)

static bool js_scene_RenderWindow_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderWindow_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::gfx::Device*, false> arg0 = {};
        HolderType<cc::scene::IRenderWindowInfo, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderWindow_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_RenderWindow_initialize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_RenderWindow_initialize)

static bool js_scene_RenderWindow_resize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderWindow_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_RenderWindow_resize : Error processing arguments");
        cobj->resize(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_RenderWindow_resize)

static bool js_scene_RenderWindow_sortCameras(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::RenderWindow>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_RenderWindow_sortCameras : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->sortCameras();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_RenderWindow_sortCameras)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_RenderWindow_finalize)

static bool js_scene_RenderWindow_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::RenderWindow);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_RenderWindow_constructor, __jsb_cc_scene_RenderWindow_class, js_cc_scene_RenderWindow_finalize)

static bool js_cc_scene_RenderWindow_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_RenderWindow_finalize)

bool js_register_scene_RenderWindow(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RenderWindow", obj, nullptr, _SE(js_scene_RenderWindow_constructor));

    cls->defineProperty("width", _SE(js_scene_RenderWindow_getWidth_asGetter), nullptr);
    cls->defineProperty("height", _SE(js_scene_RenderWindow_getHeight_asGetter), nullptr);
    cls->defineProperty("framebuffer", _SE(js_scene_RenderWindow_getFramebuffer_asGetter), nullptr);
    cls->defineProperty("cameras", _SE(js_scene_RenderWindow_getCameras_asGetter), nullptr);
    cls->defineProperty("swapchain", _SE(js_scene_RenderWindow_getSwapchain_asGetter), nullptr);
    cls->defineFunction("attachCamera", _SE(js_scene_RenderWindow_attachCamera));
    cls->defineFunction("clearCameras", _SE(js_scene_RenderWindow_clearCameras));
    cls->defineFunction("destroy", _SE(js_scene_RenderWindow_destroy));
    cls->defineFunction("detachCamera", _SE(js_scene_RenderWindow_detachCamera));
    cls->defineFunction("extractRenderCameras", _SE(js_scene_RenderWindow_extractRenderCameras));
    cls->defineFunction("initialize", _SE(js_scene_RenderWindow_initialize));
    cls->defineFunction("resize", _SE(js_scene_RenderWindow_resize));
    cls->defineFunction("sortCameras", _SE(js_scene_RenderWindow_sortCameras));
    cls->defineFinalizeFunction(_SE(js_cc_scene_RenderWindow_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::RenderWindow>(cls);

    __jsb_cc_scene_RenderWindow_proto = cls->getProto();
    __jsb_cc_scene_RenderWindow_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_SphereLight_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_SphereLight_class = nullptr;  // NOLINT

static bool js_scene_SphereLight_getAABB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SphereLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SphereLight_getAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::geometry::AABB& result = cobj->getAABB();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SphereLight_getAABB : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SphereLight_getAABB)

static bool js_scene_SphereLight_getLuminance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SphereLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SphereLight_getLuminance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getLuminance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SphereLight_getLuminance : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SphereLight_getLuminance)

static bool js_scene_SphereLight_getLuminanceHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SphereLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SphereLight_getLuminanceHDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getLuminanceHDR();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SphereLight_getLuminanceHDR : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SphereLight_getLuminanceHDR)

static bool js_scene_SphereLight_getLuminanceLDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SphereLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SphereLight_getLuminanceLDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getLuminanceLDR();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SphereLight_getLuminanceLDR : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SphereLight_getLuminanceLDR)

static bool js_scene_SphereLight_getPosition(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SphereLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SphereLight_getPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec3& result = cobj->getPosition();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SphereLight_getPosition : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SphereLight_getPosition)

static bool js_scene_SphereLight_getRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SphereLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SphereLight_getRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRange();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SphereLight_getRange : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SphereLight_getRange)

static bool js_scene_SphereLight_getSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SphereLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SphereLight_getSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getSize();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SphereLight_getSize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SphereLight_getSize)

static bool js_scene_SphereLight_setLuminance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SphereLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SphereLight_setLuminance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SphereLight_setLuminance : Error processing arguments");
        cobj->setLuminance(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_SphereLight_setLuminance)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_SphereLight_setLuminanceHDR)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_SphereLight_setLuminanceLDR)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_SphereLight_setPosition)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_SphereLight_setRange)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_SphereLight_setSize)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_SphereLight_finalize)

static bool js_scene_SphereLight_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::SphereLight);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_SphereLight_constructor, __jsb_cc_scene_SphereLight_class, js_cc_scene_SphereLight_finalize)

static bool js_cc_scene_SphereLight_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_SphereLight_finalize)

bool js_register_scene_SphereLight(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SphereLight", obj, __jsb_cc_scene_Light_proto, _SE(js_scene_SphereLight_constructor));

    cls->defineProperty("position", _SE(js_scene_SphereLight_getPosition_asGetter), _SE(js_scene_SphereLight_setPosition_asSetter));
    cls->defineProperty("size", _SE(js_scene_SphereLight_getSize_asGetter), _SE(js_scene_SphereLight_setSize_asSetter));
    cls->defineProperty("range", _SE(js_scene_SphereLight_getRange_asGetter), _SE(js_scene_SphereLight_setRange_asSetter));
    cls->defineProperty("luminance", _SE(js_scene_SphereLight_getLuminance_asGetter), _SE(js_scene_SphereLight_setLuminance_asSetter));
    cls->defineProperty("luminanceHDR", _SE(js_scene_SphereLight_getLuminanceHDR_asGetter), _SE(js_scene_SphereLight_setLuminanceHDR_asSetter));
    cls->defineProperty("luminanceLDR", _SE(js_scene_SphereLight_getLuminanceLDR_asGetter), _SE(js_scene_SphereLight_setLuminanceLDR_asSetter));
    cls->defineProperty("aabb", _SE(js_scene_SphereLight_getAABB_asGetter), nullptr);
    cls->defineFinalizeFunction(_SE(js_cc_scene_SphereLight_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::SphereLight>(cls);

    __jsb_cc_scene_SphereLight_proto = cls->getProto();
    __jsb_cc_scene_SphereLight_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_Root_proto = nullptr; // NOLINT
se::Class* __jsb_cc_Root_class = nullptr;  // NOLINT

static bool js_scene_Root_activeWindow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_activeWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::RenderWindow*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Root_activeWindow : Error processing arguments");
        cobj->activeWindow(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Root_activeWindow)

static bool js_scene_Root_createCamera(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_createCamera : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Camera* result = cobj->createCamera();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_createCamera : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Root_createCamera)

static bool js_scene_Root_createScene(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_createScene : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::IRenderSceneInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Root_createScene : Error processing arguments");
        cc::scene::RenderScene* result = cobj->createScene(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_createScene : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Root_createScene)

static bool js_scene_Root_createWindow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_createWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::IRenderWindowInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Root_createWindow : Error processing arguments");
        cc::scene::RenderWindow* result = cobj->createWindow(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_createWindow : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Root_createWindow)

static bool js_scene_Root_destroy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Root_destroy)

static bool js_scene_Root_destroyLight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_destroyLight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Light*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Root_destroyLight : Error processing arguments");
        cobj->destroyLight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Root_destroyLight)

static bool js_scene_Root_destroyModel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_destroyModel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Model*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Root_destroyModel : Error processing arguments");
        cobj->destroyModel(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Root_destroyModel)

static bool js_scene_Root_destroyScene(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_destroyScene : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::RenderScene*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Root_destroyScene : Error processing arguments");
        cobj->destroyScene(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Root_destroyScene)

static bool js_scene_Root_destroyScenes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_destroyScenes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroyScenes();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Root_destroyScenes)

static bool js_scene_Root_destroyWindow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_destroyWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::RenderWindow*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Root_destroyWindow : Error processing arguments");
        cobj->destroyWindow(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Root_destroyWindow)

static bool js_scene_Root_destroyWindows(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_destroyWindows : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroyWindows();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Root_destroyWindows)

static bool js_scene_Root_frameMove(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_frameMove : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<int32_t, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Root_frameMove : Error processing arguments");
        cobj->frameMove(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Root_frameMove)

static bool js_scene_Root_getBatcher2D(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_getBatcher2D : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::DrawBatch2D* result = cobj->getBatcher2D();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_getBatcher2D : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Root_getBatcher2D)

static bool js_scene_Root_getCumulativeTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_getCumulativeTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getCumulativeTime();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_getCumulativeTime : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Root_getCumulativeTime)

static bool js_scene_Root_getCurWindow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_getCurWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::RenderWindow* result = cobj->getCurWindow();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_getCurWindow : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Root_getCurWindow)

static bool js_scene_Root_getDevice(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Device* result = cobj->getDevice();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_getDevice : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Root_getDevice)

static bool js_scene_Root_getEventProcessor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_getEventProcessor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::CallbacksInvoker* result = cobj->getEventProcessor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_getEventProcessor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Root_getEventProcessor)

static bool js_scene_Root_getFixedFPS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_getFixedFPS : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getFixedFPS();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_getFixedFPS : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Root_getFixedFPS)

static bool js_scene_Root_getFps(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_getFps : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getFps();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_getFps : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Root_getFps)

static bool js_scene_Root_getFrameCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_getFrameCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getFrameCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_getFrameCount : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Root_getFrameCount)

static bool js_scene_Root_getFrameTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_getFrameTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFrameTime();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_getFrameTime : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Root_getFrameTime)

static bool js_scene_Root_getMainWindow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_getMainWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::RenderWindow* result = cobj->getMainWindow();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_getMainWindow : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Root_getMainWindow)

static bool js_scene_Root_getPipeline(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_getPipeline : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::pipeline::RenderPipeline* result = cobj->getPipeline();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_getPipeline : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Root_getPipeline)

static bool js_scene_Root_getScenes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_getScenes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::IntrusivePtr<cc::scene::RenderScene>>& result = cobj->getScenes();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_getScenes : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Root_getScenes)

static bool js_scene_Root_getTempWindow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_getTempWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::RenderWindow* result = cobj->getTempWindow();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_getTempWindow : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Root_getTempWindow)

static bool js_scene_Root_getWindows(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_getWindows : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::IntrusivePtr<cc::scene::RenderWindow>>& result = cobj->getWindows();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_getWindows : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Root_getWindows)

static bool js_scene_Root_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Swapchain*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Root_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Root_initialize)

static bool js_scene_Root_isUsingDeferredPipeline(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_isUsingDeferredPipeline : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isUsingDeferredPipeline();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_isUsingDeferredPipeline : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Root_isUsingDeferredPipeline)

static bool js_scene_Root_onGlobalPipelineStateChanged(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_onGlobalPipelineStateChanged : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onGlobalPipelineStateChanged();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Root_onGlobalPipelineStateChanged)

static bool js_scene_Root_resetCumulativeTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_resetCumulativeTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->resetCumulativeTime();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Root_resetCumulativeTime)

static bool js_scene_Root_resize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Root_resize : Error processing arguments");
        cobj->resize(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Root_resize)

static bool js_scene_Root_setCurWindow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_setCurWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::RenderWindow*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Root_setCurWindow : Error processing arguments");
        cobj->setCurWindow(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Root_setCurWindow)

static bool js_scene_Root_setFixedFPS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_setFixedFPS : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Root_setFixedFPS : Error processing arguments");
        cobj->setFixedFPS(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Root_setFixedFPS)

static bool js_scene_Root_setRenderPipeline(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_setRenderPipeline : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->setRenderPipeline();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_setRenderPipeline : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 1) {
        HolderType<cc::pipeline::RenderPipeline*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Root_setRenderPipeline : Error processing arguments");
        bool result = cobj->setRenderPipeline(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_setRenderPipeline : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Root_setRenderPipeline)

static bool js_scene_Root_setTempWindow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Root_setTempWindow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::RenderWindow*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Root_setTempWindow : Error processing arguments");
        cobj->setTempWindow(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Root_setTempWindow)

static bool js_scene_Root_getInstance_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Root* result = cc::Root::getInstance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Root_getInstance_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Root_getInstance_static)

SE_DECLARE_FINALIZE_FUNC(js_cc_Root_finalize)

static bool js_scene_Root_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::gfx::Device* arg0 = nullptr;
    ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_Root_constructor : Error processing arguments");
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::Root, arg0);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_Root_constructor, __jsb_cc_Root_class, js_cc_Root_finalize)

static bool js_cc_Root_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_Root_finalize)

bool js_register_scene_Root(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Root", obj, nullptr, _SE(js_scene_Root_constructor));

    cls->defineProperty({"device", "_device"}, _SE(js_scene_Root_getDevice_asGetter), nullptr);
    cls->defineProperty("mainWindow", _SE(js_scene_Root_getMainWindow_asGetter), nullptr);
    cls->defineProperty("curWindow", _SE(js_scene_Root_getCurWindow_asGetter), _SE(js_scene_Root_setCurWindow_asSetter));
    cls->defineProperty("tempWindow", _SE(js_scene_Root_getTempWindow_asGetter), _SE(js_scene_Root_setTempWindow_asSetter));
    cls->defineProperty("windows", _SE(js_scene_Root_getWindows_asGetter), nullptr);
    cls->defineProperty("scenes", _SE(js_scene_Root_getScenes_asGetter), nullptr);
    cls->defineProperty("cumulativeTime", _SE(js_scene_Root_getCumulativeTime_asGetter), nullptr);
    cls->defineProperty("frameTime", _SE(js_scene_Root_getFrameTime_asGetter), nullptr);
    cls->defineProperty("frameCount", _SE(js_scene_Root_getFrameCount_asGetter), nullptr);
    cls->defineProperty("fps", _SE(js_scene_Root_getFps_asGetter), nullptr);
    cls->defineProperty("fixedFPS", _SE(js_scene_Root_getFixedFPS_asGetter), _SE(js_scene_Root_setFixedFPS_asSetter));
    cls->defineProperty("useDeferredPipeline", _SE(js_scene_Root_isUsingDeferredPipeline_asGetter), nullptr);
    cls->defineFunction("activeWindow", _SE(js_scene_Root_activeWindow));
    cls->defineFunction("createCamera", _SE(js_scene_Root_createCamera));
    cls->defineFunction("createScene", _SE(js_scene_Root_createScene));
    cls->defineFunction("createWindow", _SE(js_scene_Root_createWindow));
    cls->defineFunction("destroy", _SE(js_scene_Root_destroy));
    cls->defineFunction("destroyLight", _SE(js_scene_Root_destroyLight));
    cls->defineFunction("destroyModel", _SE(js_scene_Root_destroyModel));
    cls->defineFunction("destroyScene", _SE(js_scene_Root_destroyScene));
    cls->defineFunction("destroyScenes", _SE(js_scene_Root_destroyScenes));
    cls->defineFunction("destroyWindow", _SE(js_scene_Root_destroyWindow));
    cls->defineFunction("destroyWindows", _SE(js_scene_Root_destroyWindows));
    cls->defineFunction("frameMove", _SE(js_scene_Root_frameMove));
    cls->defineFunction("getBatcher2D", _SE(js_scene_Root_getBatcher2D));
    cls->defineFunction("getEventProcessor", _SE(js_scene_Root_getEventProcessor));
    cls->defineFunction("getPipeline", _SE(js_scene_Root_getPipeline));
    cls->defineFunction("_initialize", _SE(js_scene_Root_initialize));
    cls->defineFunction("onGlobalPipelineStateChanged", _SE(js_scene_Root_onGlobalPipelineStateChanged));
    cls->defineFunction("resetCumulativeTime", _SE(js_scene_Root_resetCumulativeTime));
    cls->defineFunction("resize", _SE(js_scene_Root_resize));
    cls->defineFunction("setRenderPipeline", _SE(js_scene_Root_setRenderPipeline));
    cls->defineStaticFunction("getInstance", _SE(js_scene_Root_getInstance_static));
    cls->defineFinalizeFunction(_SE(js_cc_Root_finalize));
    cls->install();
    JSBClassType::registerClass<cc::Root>(cls);

    __jsb_cc_Root_proto = cls->getProto();
    __jsb_cc_Root_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_SkyboxInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_SkyboxInfo_class = nullptr;  // NOLINT

static bool js_scene_SkyboxInfo_activate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_activate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Skybox*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_activate : Error processing arguments");
        cobj->activate(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SkyboxInfo_activate)

static bool js_scene_SkyboxInfo_getDiffuseMap(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_getDiffuseMap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::TextureCube* result = cobj->getDiffuseMap();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_getDiffuseMap : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SkyboxInfo_getDiffuseMap)

static bool js_scene_SkyboxInfo_getEnvLightingType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_getEnvLightingType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<int>(cobj->getEnvLightingType());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_getEnvLightingType : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_SkyboxInfo_getEnvLightingType)

static bool js_scene_SkyboxInfo_getEnvmap(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_getEnvmap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::TextureCube* result = cobj->getEnvmap();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_getEnvmap : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SkyboxInfo_getEnvmap)

static bool js_scene_SkyboxInfo_getEnvmapForJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_getEnvmapForJS : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::TextureCube* result = cobj->getEnvmapForJS();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_getEnvmapForJS : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SkyboxInfo_getEnvmapForJS)

static bool js_scene_SkyboxInfo_isApplyDiffuseMap(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_isApplyDiffuseMap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isApplyDiffuseMap();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_isApplyDiffuseMap : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SkyboxInfo_isApplyDiffuseMap)

static bool js_scene_SkyboxInfo_isEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_isEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isEnabled();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_isEnabled : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SkyboxInfo_isEnabled)

static bool js_scene_SkyboxInfo_isUseHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_isUseHDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isUseHDR();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_isUseHDR : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SkyboxInfo_isUseHDR)

static bool js_scene_SkyboxInfo_isUseIBL(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_isUseIBL : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isUseIBL();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_isUseIBL : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SkyboxInfo_isUseIBL)

static bool js_scene_SkyboxInfo_setApplyDiffuseMap(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_setApplyDiffuseMap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_setApplyDiffuseMap : Error processing arguments");
        cobj->setApplyDiffuseMap(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_SkyboxInfo_setApplyDiffuseMap)

static bool js_scene_SkyboxInfo_setDiffuseMap(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_setDiffuseMap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::TextureCube*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_setDiffuseMap : Error processing arguments");
        cobj->setDiffuseMap(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SkyboxInfo_setDiffuseMap)

static bool js_scene_SkyboxInfo_setEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_setEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_setEnabled : Error processing arguments");
        cobj->setEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_SkyboxInfo_setEnabled)

static bool js_scene_SkyboxInfo_setEnvLightingType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_setEnvLightingType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::EnvironmentLightingType, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_setEnvLightingType : Error processing arguments");
        cobj->setEnvLightingType(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SkyboxInfo_setEnvLightingType)

static bool js_scene_SkyboxInfo_setEnvmap(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_setEnvmap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::TextureCube*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_setEnvmap : Error processing arguments");
        cobj->setEnvmap(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_SkyboxInfo_setEnvmap)

static bool js_scene_SkyboxInfo_setEnvmapForJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_setEnvmapForJS : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::TextureCube*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_setEnvmapForJS : Error processing arguments");
        cobj->setEnvmapForJS(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_SkyboxInfo_setEnvmapForJS)

static bool js_scene_SkyboxInfo_setUseHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_setUseHDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_setUseHDR : Error processing arguments");
        cobj->setUseHDR(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_SkyboxInfo_setUseHDR)

static bool js_scene_SkyboxInfo_setUseIBL(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_setUseIBL : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_setUseIBL : Error processing arguments");
        cobj->setUseIBL(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_SkyboxInfo_setUseIBL)

static bool js_scene_SkyboxInfo_get__envmapHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_get__envmapHDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_envmapHDR, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_envmapHDR, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_SkyboxInfo_get__envmapHDR)

static bool js_scene_SkyboxInfo_set__envmapHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_set__envmapHDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_envmapHDR, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_set__envmapHDR : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_SkyboxInfo_set__envmapHDR)

static bool js_scene_SkyboxInfo_get__envmapLDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_get__envmapLDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_envmapLDR, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_envmapLDR, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_SkyboxInfo_get__envmapLDR)

static bool js_scene_SkyboxInfo_set__envmapLDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_set__envmapLDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_envmapLDR, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_set__envmapLDR : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_SkyboxInfo_set__envmapLDR)

static bool js_scene_SkyboxInfo_get__diffuseMapHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_get__diffuseMapHDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_diffuseMapHDR, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_diffuseMapHDR, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_SkyboxInfo_get__diffuseMapHDR)

static bool js_scene_SkyboxInfo_set__diffuseMapHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_set__diffuseMapHDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_diffuseMapHDR, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_set__diffuseMapHDR : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_SkyboxInfo_set__diffuseMapHDR)

static bool js_scene_SkyboxInfo_get__diffuseMapLDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_get__diffuseMapLDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_diffuseMapLDR, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_diffuseMapLDR, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_SkyboxInfo_get__diffuseMapLDR)

static bool js_scene_SkyboxInfo_set__diffuseMapLDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_set__diffuseMapLDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_diffuseMapLDR, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_set__diffuseMapLDR : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_SkyboxInfo_set__diffuseMapLDR)

static bool js_scene_SkyboxInfo_get__enabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_get__enabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_enabled, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_enabled, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_SkyboxInfo_get__enabled)

static bool js_scene_SkyboxInfo_set__enabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_set__enabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_enabled, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_set__enabled : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_SkyboxInfo_set__enabled)

static bool js_scene_SkyboxInfo_get__useHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_get__useHDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_useHDR, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_useHDR, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_SkyboxInfo_get__useHDR)

static bool js_scene_SkyboxInfo_set__useHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_set__useHDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_useHDR, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_set__useHDR : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_SkyboxInfo_set__useHDR)

static bool js_scene_SkyboxInfo_get__envLightingType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_get__envLightingType : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_envLightingType, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_envLightingType, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_SkyboxInfo_get__envLightingType)

static bool js_scene_SkyboxInfo_set__envLightingType(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::SkyboxInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkyboxInfo_set__envLightingType : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_envLightingType, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_SkyboxInfo_set__envLightingType : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_SkyboxInfo_set__envLightingType)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_SkyboxInfo_finalize)

static bool js_scene_SkyboxInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::SkyboxInfo);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_SkyboxInfo_constructor, __jsb_cc_scene_SkyboxInfo_class, js_cc_scene_SkyboxInfo_finalize)

static bool js_cc_scene_SkyboxInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_SkyboxInfo_finalize)

bool js_register_scene_SkyboxInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SkyboxInfo", obj, nullptr, _SE(js_scene_SkyboxInfo_constructor));

    cls->defineProperty("_envmapHDR", _SE(js_scene_SkyboxInfo_get__envmapHDR), _SE(js_scene_SkyboxInfo_set__envmapHDR));
    cls->defineProperty("_envmapLDR", _SE(js_scene_SkyboxInfo_get__envmapLDR), _SE(js_scene_SkyboxInfo_set__envmapLDR));
    cls->defineProperty("_diffuseMapHDR", _SE(js_scene_SkyboxInfo_get__diffuseMapHDR), _SE(js_scene_SkyboxInfo_set__diffuseMapHDR));
    cls->defineProperty("_diffuseMapLDR", _SE(js_scene_SkyboxInfo_get__diffuseMapLDR), _SE(js_scene_SkyboxInfo_set__diffuseMapLDR));
    cls->defineProperty("_enabled", _SE(js_scene_SkyboxInfo_get__enabled), _SE(js_scene_SkyboxInfo_set__enabled));
    cls->defineProperty("_useHDR", _SE(js_scene_SkyboxInfo_get__useHDR), _SE(js_scene_SkyboxInfo_set__useHDR));
    cls->defineProperty("_envLightingType", _SE(js_scene_SkyboxInfo_get__envLightingType), _SE(js_scene_SkyboxInfo_set__envLightingType));
    cls->defineProperty("_envmap", _SE(js_scene_SkyboxInfo_getEnvmapForJS_asGetter), _SE(js_scene_SkyboxInfo_setEnvmapForJS_asSetter));
    cls->defineProperty("applyDiffuseMap", _SE(js_scene_SkyboxInfo_isApplyDiffuseMap_asGetter), _SE(js_scene_SkyboxInfo_setApplyDiffuseMap_asSetter));
    cls->defineProperty("enabled", _SE(js_scene_SkyboxInfo_isEnabled_asGetter), _SE(js_scene_SkyboxInfo_setEnabled_asSetter));
    cls->defineProperty("useIBL", _SE(js_scene_SkyboxInfo_isUseIBL_asGetter), _SE(js_scene_SkyboxInfo_setUseIBL_asSetter));
    cls->defineProperty("useHDR", _SE(js_scene_SkyboxInfo_isUseHDR_asGetter), _SE(js_scene_SkyboxInfo_setUseHDR_asSetter));
    cls->defineProperty("envmap", _SE(js_scene_SkyboxInfo_getEnvmap_asGetter), _SE(js_scene_SkyboxInfo_setEnvmap_asSetter));
    cls->defineProperty("diffuseMap", _SE(js_scene_SkyboxInfo_setEnvLightingType_asGetter), _SE(js_scene_SkyboxInfo_getEnvLightingType_asSetter));
    cls->defineFunction("activate", _SE(js_scene_SkyboxInfo_activate));
    cls->defineFunction("getDiffuseMap", _SE(js_scene_SkyboxInfo_getDiffuseMap));
    cls->defineFunction("setDiffuseMap", _SE(js_scene_SkyboxInfo_setDiffuseMap));
    cls->defineFinalizeFunction(_SE(js_cc_scene_SkyboxInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::SkyboxInfo>(cls);

    __jsb_cc_scene_SkyboxInfo_proto = cls->getProto();
    __jsb_cc_scene_SkyboxInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Skybox_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_Skybox_class = nullptr;  // NOLINT

static bool js_scene_Skybox_activate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_activate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->activate();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Skybox_activate)

static bool js_scene_Skybox_getDiffuseMap(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_getDiffuseMap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::TextureCube* result = cobj->getDiffuseMap();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Skybox_getDiffuseMap : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Skybox_getDiffuseMap)

static bool js_scene_Skybox_getEnvmap(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_getEnvmap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::TextureCube* result = cobj->getEnvmap();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Skybox_getEnvmap : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Skybox_getEnvmap)

static bool js_scene_Skybox_getModel(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_getModel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Model* result = cobj->getModel();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Skybox_getModel : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Skybox_getModel)

static bool js_scene_Skybox_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::SkyboxInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Skybox_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Skybox_initialize)

static bool js_scene_Skybox_isEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_isEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isEnabled();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Skybox_isEnabled : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Skybox_isEnabled)

static bool js_scene_Skybox_isRGBE(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_isRGBE : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isRGBE();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Skybox_isRGBE : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Skybox_isRGBE)

static bool js_scene_Skybox_isUseDiffuseMap(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_isUseDiffuseMap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isUseDiffuseMap();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Skybox_isUseDiffuseMap : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Skybox_isUseDiffuseMap)

static bool js_scene_Skybox_isUseHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_isUseHDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isUseHDR();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Skybox_isUseHDR : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Skybox_isUseHDR)

static bool js_scene_Skybox_isUseIBL(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_isUseIBL : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isUseIBL();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Skybox_isUseIBL : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Skybox_isUseIBL)

static bool js_scene_Skybox_setDiffuseMap(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_setDiffuseMap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::TextureCube*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Skybox_setDiffuseMap : Error processing arguments");
        cobj->setDiffuseMap(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Skybox_setDiffuseMap)

static bool js_scene_Skybox_setDiffuseMaps(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_setDiffuseMaps : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::TextureCube*, false> arg0 = {};
        HolderType<cc::TextureCube*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Skybox_setDiffuseMaps : Error processing arguments");
        cobj->setDiffuseMaps(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Skybox_setDiffuseMaps)

static bool js_scene_Skybox_setEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_setEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Skybox_setEnabled : Error processing arguments");
        cobj->setEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Skybox_setEnabled)

static bool js_scene_Skybox_setEnvMaps(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_setEnvMaps : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::TextureCube*, false> arg0 = {};
        HolderType<cc::TextureCube*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Skybox_setEnvMaps : Error processing arguments");
        cobj->setEnvMaps(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_Skybox_setEnvMaps)

static bool js_scene_Skybox_setEnvmap(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_setEnvmap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::TextureCube*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Skybox_setEnvmap : Error processing arguments");
        cobj->setEnvmap(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Skybox_setEnvmap)

static bool js_scene_Skybox_setUseDiffuseMap(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_setUseDiffuseMap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Skybox_setUseDiffuseMap : Error processing arguments");
        cobj->setUseDiffuseMap(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Skybox_setUseDiffuseMap)

static bool js_scene_Skybox_setUseHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_setUseHDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Skybox_setUseHDR : Error processing arguments");
        cobj->setUseHDR(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Skybox_setUseHDR)

static bool js_scene_Skybox_setUseIBL(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Skybox>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Skybox_setUseIBL : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Skybox_setUseIBL : Error processing arguments");
        cobj->setUseIBL(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Skybox_setUseIBL)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Skybox_finalize)

static bool js_scene_Skybox_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::Skybox);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_Skybox_constructor, __jsb_cc_scene_Skybox_class, js_cc_scene_Skybox_finalize)

static bool js_cc_scene_Skybox_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Skybox_finalize)

bool js_register_scene_Skybox(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Skybox", obj, nullptr, _SE(js_scene_Skybox_constructor));

    cls->defineProperty("model", _SE(js_scene_Skybox_getModel_asGetter), nullptr);
    cls->defineProperty("enabled", _SE(js_scene_Skybox_isEnabled_asGetter), _SE(js_scene_Skybox_setEnabled_asSetter));
    cls->defineProperty("useIBL", _SE(js_scene_Skybox_isUseIBL_asGetter), _SE(js_scene_Skybox_setUseIBL_asSetter));
    cls->defineProperty("isRGBE", _SE(js_scene_Skybox_isRGBE_asGetter), nullptr);
    cls->defineProperty("envmap", _SE(js_scene_Skybox_getEnvmap_asGetter), _SE(js_scene_Skybox_setEnvmap_asSetter));
    cls->defineFunction("activate", _SE(js_scene_Skybox_activate));
    cls->defineFunction("getDiffuseMap", _SE(js_scene_Skybox_getDiffuseMap));
    cls->defineFunction("initialize", _SE(js_scene_Skybox_initialize));
    cls->defineFunction("isUseDiffuseMap", _SE(js_scene_Skybox_isUseDiffuseMap));
    cls->defineFunction("isUseHDR", _SE(js_scene_Skybox_isUseHDR));
    cls->defineFunction("setDiffuseMap", _SE(js_scene_Skybox_setDiffuseMap));
    cls->defineFunction("setDiffuseMaps", _SE(js_scene_Skybox_setDiffuseMaps));
    cls->defineFunction("setEnvMaps", _SE(js_scene_Skybox_setEnvMaps));
    cls->defineFunction("setUseDiffuseMap", _SE(js_scene_Skybox_setUseDiffuseMap));
    cls->defineFunction("setUseHDR", _SE(js_scene_Skybox_setUseHDR));
    cls->defineFinalizeFunction(_SE(js_cc_scene_Skybox_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Skybox>(cls);

    __jsb_cc_scene_Skybox_proto = cls->getProto();
    __jsb_cc_scene_Skybox_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Ambient_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_Ambient_class = nullptr;  // NOLINT

static bool js_scene_Ambient_getGroundAlbedo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Ambient>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Ambient_getGroundAlbedo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec4& result = cobj->getGroundAlbedo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Ambient_getGroundAlbedo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Ambient_getGroundAlbedo)

static bool js_scene_Ambient_getSkyColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Ambient>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Ambient_getSkyColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Vec4& result = cobj->getSkyColor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Ambient_getSkyColor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Ambient_getSkyColor)

static bool js_scene_Ambient_getSkyIllum(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Ambient>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Ambient_getSkyIllum : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getSkyIllum();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Ambient_getSkyIllum : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Ambient_getSkyIllum)

static bool js_scene_Ambient_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Ambient>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Ambient_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::AmbientInfo*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Ambient_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Ambient_initialize)

static bool js_scene_Ambient_isEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Ambient>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Ambient_isEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isEnabled();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Ambient_isEnabled : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_Ambient_isEnabled)

static bool js_scene_Ambient_setEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Ambient>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Ambient_setEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Ambient_setEnabled : Error processing arguments");
        cobj->setEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Ambient_setEnabled)

static bool js_scene_Ambient_setGroundAlbedo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Ambient>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Ambient_setGroundAlbedo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec4, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Ambient_setGroundAlbedo : Error processing arguments");
        cobj->setGroundAlbedo(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Ambient_setGroundAlbedo)

static bool js_scene_Ambient_setSkyColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Ambient>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Ambient_setSkyColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec4, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Ambient_setSkyColor : Error processing arguments");
        cobj->setSkyColor(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Ambient_setSkyColor)

static bool js_scene_Ambient_setSkyIllum(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Ambient>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Ambient_setSkyIllum : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Ambient_setSkyIllum : Error processing arguments");
        cobj->setSkyIllum(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_Ambient_setSkyIllum)

static bool js_scene_Ambient_get_SUN_ILLUM(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cc::scene::Ambient::SUN_ILLUM, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    // SE_HOLD_RETURN_VALUE(cobj->SUN_ILLUM, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Ambient_get_SUN_ILLUM)


static bool js_scene_Ambient_get_SKY_ILLUM(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cc::scene::Ambient::SKY_ILLUM, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    // SE_HOLD_RETURN_VALUE(cobj->SKY_ILLUM, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_Ambient_get_SKY_ILLUM)


SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Ambient_finalize)

static bool js_scene_Ambient_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::Ambient);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_Ambient_constructor, __jsb_cc_scene_Ambient_class, js_cc_scene_Ambient_finalize)

static bool js_cc_scene_Ambient_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Ambient_finalize)

bool js_register_scene_Ambient(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Ambient", obj, nullptr, _SE(js_scene_Ambient_constructor));

    cls->defineProperty("skyColor", _SE(js_scene_Ambient_getSkyColor_asGetter), _SE(js_scene_Ambient_setSkyColor_asSetter));
    cls->defineProperty("skyIllum", _SE(js_scene_Ambient_getSkyIllum_asGetter), _SE(js_scene_Ambient_setSkyIllum_asSetter));
    cls->defineProperty("groundAlbedo", _SE(js_scene_Ambient_getGroundAlbedo_asGetter), _SE(js_scene_Ambient_setGroundAlbedo_asSetter));
    cls->defineProperty("enabled", _SE(js_scene_Ambient_isEnabled_asGetter), _SE(js_scene_Ambient_setEnabled_asSetter));
    cls->defineFunction("initialize", _SE(js_scene_Ambient_initialize));
    // static fields
    cls->defineStaticProperty("SUN_ILLUM", _SE(js_scene_Ambient_get_SUN_ILLUM), nullptr);
    cls->defineStaticProperty("SKY_ILLUM", _SE(js_scene_Ambient_get_SKY_ILLUM), nullptr);
    cls->defineFinalizeFunction(_SE(js_cc_scene_Ambient_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Ambient>(cls);

    __jsb_cc_scene_Ambient_proto = cls->getProto();
    __jsb_cc_scene_Ambient_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_AmbientInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_AmbientInfo_class = nullptr;  // NOLINT

static bool js_scene_AmbientInfo_getGroundAlbedoHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_getGroundAlbedoHDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec4& result = cobj->getGroundAlbedoHDR();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_getGroundAlbedoHDR : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_AmbientInfo_getGroundAlbedoHDR)
SE_BIND_FUNC(js_scene_AmbientInfo_getGroundAlbedoHDR)

static bool js_scene_AmbientInfo_getGroundAlbedoLDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_getGroundAlbedoLDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec4& result = cobj->getGroundAlbedoLDR();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_getGroundAlbedoLDR : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_AmbientInfo_getGroundAlbedoLDR)

static bool js_scene_AmbientInfo_getGroundLightingColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_getGroundLightingColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Color& result = cobj->getGroundLightingColor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_getGroundLightingColor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_AmbientInfo_getGroundLightingColor)

static bool js_scene_AmbientInfo_getSkyColorHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_getSkyColorHDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec4& result = cobj->getSkyColorHDR();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_getSkyColorHDR : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_AmbientInfo_getSkyColorHDR)
SE_BIND_FUNC(js_scene_AmbientInfo_getSkyColorHDR)

static bool js_scene_AmbientInfo_getSkyColorLDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_getSkyColorLDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec4& result = cobj->getSkyColorLDR();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_getSkyColorLDR : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_AmbientInfo_getSkyColorLDR)

static bool js_scene_AmbientInfo_getSkyIllum(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_getSkyIllum : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getSkyIllum();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_getSkyIllum : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_AmbientInfo_getSkyIllum)

static bool js_scene_AmbientInfo_getSkyIllumHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_getSkyIllumHDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const float& result = cobj->getSkyIllumHDR();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_getSkyIllumHDR : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_AmbientInfo_getSkyIllumHDR)
SE_BIND_FUNC(js_scene_AmbientInfo_getSkyIllumHDR)

static bool js_scene_AmbientInfo_getSkyIllumLDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_getSkyIllumLDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const float& result = cobj->getSkyIllumLDR();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_getSkyIllumLDR : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_AmbientInfo_getSkyIllumLDR)

static bool js_scene_AmbientInfo_getSkyLightingColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_getSkyLightingColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Color& result = cobj->getSkyLightingColor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_getSkyLightingColor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_AmbientInfo_getSkyLightingColor)

static bool js_scene_AmbientInfo_setGroundAlbedo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_setGroundAlbedo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec4, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_setGroundAlbedo : Error processing arguments");
        cobj->setGroundAlbedo(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_AmbientInfo_setGroundAlbedo)

static bool js_scene_AmbientInfo_setGroundAlbedoHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_setGroundAlbedoHDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec4, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_setGroundAlbedoHDR : Error processing arguments");
        cobj->setGroundAlbedoHDR(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_AmbientInfo_setGroundAlbedoHDR)

static bool js_scene_AmbientInfo_setGroundLightingColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_setGroundLightingColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Color, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_setGroundLightingColor : Error processing arguments");
        cobj->setGroundLightingColor(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_AmbientInfo_setGroundLightingColor)

static bool js_scene_AmbientInfo_setSkyColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_setSkyColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec4, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_setSkyColor : Error processing arguments");
        cobj->setSkyColor(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_AmbientInfo_setSkyColor)

static bool js_scene_AmbientInfo_setSkyColorHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_setSkyColorHDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec4, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_setSkyColorHDR : Error processing arguments");
        cobj->setSkyColorHDR(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_AmbientInfo_setSkyColorHDR)

static bool js_scene_AmbientInfo_setSkyIllum(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_setSkyIllum : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_setSkyIllum : Error processing arguments");
        cobj->setSkyIllum(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_AmbientInfo_setSkyIllum)

static bool js_scene_AmbientInfo_setSkyIllumHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_setSkyIllumHDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_setSkyIllumHDR : Error processing arguments");
        cobj->setSkyIllumHDR(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_AmbientInfo_setSkyIllumHDR)

static bool js_scene_AmbientInfo_setSkyLightingColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_setSkyLightingColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Color, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_setSkyLightingColor : Error processing arguments");
        cobj->setSkyLightingColor(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_AmbientInfo_setSkyLightingColor)

static bool js_scene_AmbientInfo_get__skyColorHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_get__skyColorHDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_skyColorHDR, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_skyColorHDR, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_AmbientInfo_get__skyColorHDR)

static bool js_scene_AmbientInfo_set__skyColorHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_set__skyColorHDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_skyColorHDR, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_set__skyColorHDR : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_AmbientInfo_set__skyColorHDR)

static bool js_scene_AmbientInfo_get__skyIllumHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_get__skyIllumHDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_skyIllumHDR, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_skyIllumHDR, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_AmbientInfo_get__skyIllumHDR)

static bool js_scene_AmbientInfo_set__skyIllumHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_set__skyIllumHDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_skyIllumHDR, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_set__skyIllumHDR : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_AmbientInfo_set__skyIllumHDR)

static bool js_scene_AmbientInfo_get__groundAlbedoHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_get__groundAlbedoHDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_groundAlbedoHDR, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_groundAlbedoHDR, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_AmbientInfo_get__groundAlbedoHDR)

static bool js_scene_AmbientInfo_set__groundAlbedoHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_set__groundAlbedoHDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_groundAlbedoHDR, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_set__groundAlbedoHDR : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_AmbientInfo_set__groundAlbedoHDR)

static bool js_scene_AmbientInfo_get__skyColorLDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_get__skyColorLDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_skyColorLDR, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_skyColorLDR, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_AmbientInfo_get__skyColorLDR)

static bool js_scene_AmbientInfo_set__skyColorLDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_set__skyColorLDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_skyColorLDR, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_set__skyColorLDR : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_AmbientInfo_set__skyColorLDR)

static bool js_scene_AmbientInfo_get__skyIllumLDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_get__skyIllumLDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_skyIllumLDR, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_skyIllumLDR, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_AmbientInfo_get__skyIllumLDR)

static bool js_scene_AmbientInfo_set__skyIllumLDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_set__skyIllumLDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_skyIllumLDR, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_set__skyIllumLDR : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_AmbientInfo_set__skyIllumLDR)

static bool js_scene_AmbientInfo_get__groundAlbedoLDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_get__groundAlbedoLDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_groundAlbedoLDR, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_groundAlbedoLDR, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_AmbientInfo_get__groundAlbedoLDR)

static bool js_scene_AmbientInfo_set__groundAlbedoLDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::AmbientInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_AmbientInfo_set__groundAlbedoLDR : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_groundAlbedoLDR, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_AmbientInfo_set__groundAlbedoLDR : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_AmbientInfo_set__groundAlbedoLDR)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_AmbientInfo_finalize)

static bool js_scene_AmbientInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::AmbientInfo);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_AmbientInfo_constructor, __jsb_cc_scene_AmbientInfo_class, js_cc_scene_AmbientInfo_finalize)

static bool js_cc_scene_AmbientInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_AmbientInfo_finalize)

bool js_register_scene_AmbientInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("AmbientInfo", obj, nullptr, _SE(js_scene_AmbientInfo_constructor));

    cls->defineProperty("_skyColorHDR", _SE(js_scene_AmbientInfo_get__skyColorHDR), _SE(js_scene_AmbientInfo_set__skyColorHDR));
    cls->defineProperty("_skyIllumHDR", _SE(js_scene_AmbientInfo_get__skyIllumHDR), _SE(js_scene_AmbientInfo_set__skyIllumHDR));
    cls->defineProperty("_groundAlbedoHDR", _SE(js_scene_AmbientInfo_get__groundAlbedoHDR), _SE(js_scene_AmbientInfo_set__groundAlbedoHDR));
    cls->defineProperty("_skyColorLDR", _SE(js_scene_AmbientInfo_get__skyColorLDR), _SE(js_scene_AmbientInfo_set__skyColorLDR));
    cls->defineProperty("_skyIllumLDR", _SE(js_scene_AmbientInfo_get__skyIllumLDR), _SE(js_scene_AmbientInfo_set__skyIllumLDR));
    cls->defineProperty("_groundAlbedoLDR", _SE(js_scene_AmbientInfo_get__groundAlbedoLDR), _SE(js_scene_AmbientInfo_set__groundAlbedoLDR));
    cls->defineProperty("skyColor", nullptr, _SE(js_scene_AmbientInfo_setSkyColor_asSetter));
    cls->defineProperty("skyIllum", _SE(js_scene_AmbientInfo_getSkyIllum_asGetter), _SE(js_scene_AmbientInfo_setSkyIllum_asSetter));
    cls->defineProperty("groundAlbedo", nullptr, _SE(js_scene_AmbientInfo_setGroundAlbedo_asSetter));
    cls->defineProperty("_skyColor", _SE(js_scene_AmbientInfo_getSkyColorHDR_asGetter), _SE(js_scene_AmbientInfo_setSkyColorHDR_asSetter));
    cls->defineProperty("_skyIllum", _SE(js_scene_AmbientInfo_getSkyIllumHDR_asGetter), _SE(js_scene_AmbientInfo_setSkyIllumHDR_asSetter));
    cls->defineProperty("_groundAlbedo", _SE(js_scene_AmbientInfo_getGroundAlbedoHDR_asGetter), _SE(js_scene_AmbientInfo_setGroundAlbedoHDR_asSetter));
    cls->defineFunction("getGroundAlbedoHDR", _SE(js_scene_AmbientInfo_getGroundAlbedoHDR));
    cls->defineFunction("getGroundAlbedoLDR", _SE(js_scene_AmbientInfo_getGroundAlbedoLDR));
    cls->defineFunction("getGroundLightingColor", _SE(js_scene_AmbientInfo_getGroundLightingColor));
    cls->defineFunction("getSkyColorHDR", _SE(js_scene_AmbientInfo_getSkyColorHDR));
    cls->defineFunction("getSkyColorLDR", _SE(js_scene_AmbientInfo_getSkyColorLDR));
    cls->defineFunction("getSkyIllumHDR", _SE(js_scene_AmbientInfo_getSkyIllumHDR));
    cls->defineFunction("getSkyIllumLDR", _SE(js_scene_AmbientInfo_getSkyIllumLDR));
    cls->defineFunction("getSkyLightingColor", _SE(js_scene_AmbientInfo_getSkyLightingColor));
    cls->defineFunction("setGroundLightingColor", _SE(js_scene_AmbientInfo_setGroundLightingColor));
    cls->defineFunction("setSkyLightingColor", _SE(js_scene_AmbientInfo_setSkyLightingColor));
    cls->defineFinalizeFunction(_SE(js_cc_scene_AmbientInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::AmbientInfo>(cls);

    __jsb_cc_scene_AmbientInfo_proto = cls->getProto();
    __jsb_cc_scene_AmbientInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_DirectionalLight_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_DirectionalLight_class = nullptr;  // NOLINT

static bool js_scene_DirectionalLight_getDirection(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_getDirection : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec3& result = cobj->getDirection();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_getDirection : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_DirectionalLight_getDirection)

static bool js_scene_DirectionalLight_getIlluminance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_getIlluminance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getIlluminance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_getIlluminance : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_DirectionalLight_getIlluminance)

static bool js_scene_DirectionalLight_getIlluminanceHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_getIlluminanceHDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getIlluminanceHDR();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_getIlluminanceHDR : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_DirectionalLight_getIlluminanceHDR)

static bool js_scene_DirectionalLight_getIlluminanceLDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_getIlluminanceLDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getIlluminanceLDR();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_getIlluminanceLDR : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_DirectionalLight_getIlluminanceLDR)

static bool js_scene_DirectionalLight_getShadowBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_getShadowBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowBias();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_getShadowBias : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_getShadowBias)

static bool js_scene_DirectionalLight_getShadowDistance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_getShadowDistance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowDistance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_getShadowDistance : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_getShadowDistance)

static bool js_scene_DirectionalLight_getShadowEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_getShadowEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getShadowEnabled();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_getShadowEnabled : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_getShadowEnabled)

static bool js_scene_DirectionalLight_getShadowFar(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_getShadowFar : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowFar();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_getShadowFar : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_getShadowFar)

static bool js_scene_DirectionalLight_getShadowFixedArea(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_getShadowFixedArea : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getShadowFixedArea();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_getShadowFixedArea : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_getShadowFixedArea)

static bool js_scene_DirectionalLight_getShadowInvisibleOcclusionRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_getShadowInvisibleOcclusionRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowInvisibleOcclusionRange();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_getShadowInvisibleOcclusionRange : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_getShadowInvisibleOcclusionRange)

static bool js_scene_DirectionalLight_getShadowNear(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_getShadowNear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowNear();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_getShadowNear : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_getShadowNear)

static bool js_scene_DirectionalLight_getShadowNormalBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_getShadowNormalBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowNormalBias();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_getShadowNormalBias : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_getShadowNormalBias)

static bool js_scene_DirectionalLight_getShadowOrthoSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_getShadowOrthoSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowOrthoSize();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_getShadowOrthoSize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_getShadowOrthoSize)

static bool js_scene_DirectionalLight_getShadowPcf(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_getShadowPcf : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowPcf();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_getShadowPcf : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_getShadowPcf)

static bool js_scene_DirectionalLight_getShadowSaturation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_getShadowSaturation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowSaturation();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_getShadowSaturation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_getShadowSaturation)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_DirectionalLight_setDirection)

static bool js_scene_DirectionalLight_setIlluminance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_setIlluminance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_setIlluminance : Error processing arguments");
        cobj->setIlluminance(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_DirectionalLight_setIlluminance)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_DirectionalLight_setIlluminanceHDR)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_DirectionalLight_setIlluminanceLDR)

static bool js_scene_DirectionalLight_setShadowBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_setShadowBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_setShadowBias : Error processing arguments");
        cobj->setShadowBias(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_setShadowBias)

static bool js_scene_DirectionalLight_setShadowDistance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_setShadowDistance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_setShadowDistance : Error processing arguments");
        cobj->setShadowDistance(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_setShadowDistance)

static bool js_scene_DirectionalLight_setShadowEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_setShadowEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_setShadowEnabled : Error processing arguments");
        cobj->setShadowEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_setShadowEnabled)

static bool js_scene_DirectionalLight_setShadowFar(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_setShadowFar : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_setShadowFar : Error processing arguments");
        cobj->setShadowFar(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_setShadowFar)

static bool js_scene_DirectionalLight_setShadowFixedArea(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_setShadowFixedArea : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_setShadowFixedArea : Error processing arguments");
        cobj->setShadowFixedArea(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_setShadowFixedArea)

static bool js_scene_DirectionalLight_setShadowInvisibleOcclusionRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_setShadowInvisibleOcclusionRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_setShadowInvisibleOcclusionRange : Error processing arguments");
        cobj->setShadowInvisibleOcclusionRange(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_setShadowInvisibleOcclusionRange)

static bool js_scene_DirectionalLight_setShadowNear(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_setShadowNear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_setShadowNear : Error processing arguments");
        cobj->setShadowNear(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_setShadowNear)

static bool js_scene_DirectionalLight_setShadowNormalBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_setShadowNormalBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_setShadowNormalBias : Error processing arguments");
        cobj->setShadowNormalBias(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_setShadowNormalBias)

static bool js_scene_DirectionalLight_setShadowOrthoSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_setShadowOrthoSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_setShadowOrthoSize : Error processing arguments");
        cobj->setShadowOrthoSize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_setShadowOrthoSize)

static bool js_scene_DirectionalLight_setShadowPcf(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_setShadowPcf : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_setShadowPcf : Error processing arguments");
        cobj->setShadowPcf(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_setShadowPcf)

static bool js_scene_DirectionalLight_setShadowSaturation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DirectionalLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DirectionalLight_setShadowSaturation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_DirectionalLight_setShadowSaturation : Error processing arguments");
        cobj->setShadowSaturation(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_DirectionalLight_setShadowSaturation)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_DirectionalLight_finalize)

static bool js_scene_DirectionalLight_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::DirectionalLight);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_DirectionalLight_constructor, __jsb_cc_scene_DirectionalLight_class, js_cc_scene_DirectionalLight_finalize)

static bool js_cc_scene_DirectionalLight_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_DirectionalLight_finalize)

bool js_register_scene_DirectionalLight(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DirectionalLight", obj, __jsb_cc_scene_Light_proto, _SE(js_scene_DirectionalLight_constructor));

    cls->defineProperty("direction", _SE(js_scene_DirectionalLight_getDirection_asGetter), _SE(js_scene_DirectionalLight_setDirection_asSetter));
    cls->defineProperty("illuminance", _SE(js_scene_DirectionalLight_getIlluminance_asGetter), _SE(js_scene_DirectionalLight_setIlluminance_asSetter));
    cls->defineProperty("illuminanceHDR", _SE(js_scene_DirectionalLight_getIlluminanceHDR_asGetter), _SE(js_scene_DirectionalLight_setIlluminanceHDR_asSetter));
    cls->defineProperty("illuminanceLDR", _SE(js_scene_DirectionalLight_getIlluminanceLDR_asGetter), _SE(js_scene_DirectionalLight_setIlluminanceLDR_asSetter));
    cls->defineFunction("getShadowBias", _SE(js_scene_DirectionalLight_getShadowBias));
    cls->defineFunction("getShadowDistance", _SE(js_scene_DirectionalLight_getShadowDistance));
    cls->defineFunction("getShadowEnabled", _SE(js_scene_DirectionalLight_getShadowEnabled));
    cls->defineFunction("getShadowFar", _SE(js_scene_DirectionalLight_getShadowFar));
    cls->defineFunction("getShadowFixedArea", _SE(js_scene_DirectionalLight_getShadowFixedArea));
    cls->defineFunction("getShadowInvisibleOcclusionRange", _SE(js_scene_DirectionalLight_getShadowInvisibleOcclusionRange));
    cls->defineFunction("getShadowNear", _SE(js_scene_DirectionalLight_getShadowNear));
    cls->defineFunction("getShadowNormalBias", _SE(js_scene_DirectionalLight_getShadowNormalBias));
    cls->defineFunction("getShadowOrthoSize", _SE(js_scene_DirectionalLight_getShadowOrthoSize));
    cls->defineFunction("getShadowPcf", _SE(js_scene_DirectionalLight_getShadowPcf));
    cls->defineFunction("getShadowSaturation", _SE(js_scene_DirectionalLight_getShadowSaturation));
    cls->defineFunction("setShadowBias", _SE(js_scene_DirectionalLight_setShadowBias));
    cls->defineFunction("setShadowDistance", _SE(js_scene_DirectionalLight_setShadowDistance));
    cls->defineFunction("setShadowEnabled", _SE(js_scene_DirectionalLight_setShadowEnabled));
    cls->defineFunction("setShadowFar", _SE(js_scene_DirectionalLight_setShadowFar));
    cls->defineFunction("setShadowFixedArea", _SE(js_scene_DirectionalLight_setShadowFixedArea));
    cls->defineFunction("setShadowInvisibleOcclusionRange", _SE(js_scene_DirectionalLight_setShadowInvisibleOcclusionRange));
    cls->defineFunction("setShadowNear", _SE(js_scene_DirectionalLight_setShadowNear));
    cls->defineFunction("setShadowNormalBias", _SE(js_scene_DirectionalLight_setShadowNormalBias));
    cls->defineFunction("setShadowOrthoSize", _SE(js_scene_DirectionalLight_setShadowOrthoSize));
    cls->defineFunction("setShadowPcf", _SE(js_scene_DirectionalLight_setShadowPcf));
    cls->defineFunction("setShadowSaturation", _SE(js_scene_DirectionalLight_setShadowSaturation));
    cls->defineFinalizeFunction(_SE(js_cc_scene_DirectionalLight_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::DirectionalLight>(cls);

    __jsb_cc_scene_DirectionalLight_proto = cls->getProto();
    __jsb_cc_scene_DirectionalLight_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_SpotLight_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_SpotLight_class = nullptr;  // NOLINT

static bool js_scene_SpotLight_getAABB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_getAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::geometry::AABB& result = cobj->getAABB();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_getAABB : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SpotLight_getAABB)

static bool js_scene_SpotLight_getAngle(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_getAngle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getAngle();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_getAngle : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SpotLight_getAngle)

static bool js_scene_SpotLight_getAspect(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_getAspect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getAspect();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_getAspect : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SpotLight_getAspect)

static bool js_scene_SpotLight_getDirection(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_getDirection : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec3& result = cobj->getDirection();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_getDirection : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SpotLight_getDirection)

static bool js_scene_SpotLight_getFrustum(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_getFrustum : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::geometry::Frustum& result = cobj->getFrustum();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_getFrustum : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SpotLight_getFrustum)

static bool js_scene_SpotLight_getLuminance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_getLuminance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getLuminance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_getLuminance : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SpotLight_getLuminance)

static bool js_scene_SpotLight_getLuminanceHDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_getLuminanceHDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getLuminanceHDR();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_getLuminanceHDR : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SpotLight_getLuminanceHDR)

static bool js_scene_SpotLight_getLuminanceLDR(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_getLuminanceLDR : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getLuminanceLDR();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_getLuminanceLDR : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SpotLight_getLuminanceLDR)

static bool js_scene_SpotLight_getPosition(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_getPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec3& result = cobj->getPosition();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_getPosition : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SpotLight_getPosition)

static bool js_scene_SpotLight_getRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_getRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRange();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_getRange : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SpotLight_getRange)

static bool js_scene_SpotLight_getShadowBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_getShadowBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowBias();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_getShadowBias : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SpotLight_getShadowBias)

static bool js_scene_SpotLight_getShadowEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_getShadowEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getShadowEnabled();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_getShadowEnabled : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SpotLight_getShadowEnabled)

static bool js_scene_SpotLight_getShadowNormalBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_getShadowNormalBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowNormalBias();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_getShadowNormalBias : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SpotLight_getShadowNormalBias)

static bool js_scene_SpotLight_getShadowPcf(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_getShadowPcf : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowPcf();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_getShadowPcf : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_SpotLight_getShadowPcf)

static bool js_scene_SpotLight_getSize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_getSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getSize();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_getSize : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SpotLight_getSize)

static bool js_scene_SpotLight_getSpotAngle(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_getSpotAngle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getSpotAngle();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_getSpotAngle : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_SpotLight_getSpotAngle)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_SpotLight_setAspect)

static bool js_scene_SpotLight_setFrustum(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_setFrustum : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::geometry::Frustum, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_setFrustum : Error processing arguments");
        cobj->setFrustum(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_SpotLight_setFrustum)

static bool js_scene_SpotLight_setLuminance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_setLuminance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_setLuminance : Error processing arguments");
        cobj->setLuminance(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_SpotLight_setLuminance)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_SpotLight_setLuminanceHDR)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_SpotLight_setLuminanceLDR)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_SpotLight_setRange)

static bool js_scene_SpotLight_setShadowBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_setShadowBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_setShadowBias : Error processing arguments");
        cobj->setShadowBias(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SpotLight_setShadowBias)

static bool js_scene_SpotLight_setShadowEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_setShadowEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_setShadowEnabled : Error processing arguments");
        cobj->setShadowEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SpotLight_setShadowEnabled)

static bool js_scene_SpotLight_setShadowNormalBias(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_setShadowNormalBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_setShadowNormalBias : Error processing arguments");
        cobj->setShadowNormalBias(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SpotLight_setShadowNormalBias)

static bool js_scene_SpotLight_setShadowPcf(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_setShadowPcf : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_setShadowPcf : Error processing arguments");
        cobj->setShadowPcf(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_SpotLight_setShadowPcf)

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
SE_BIND_FUNC_AS_PROP_SET(js_scene_SpotLight_setSize)

static bool js_scene_SpotLight_setSpotAngle(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::SpotLight>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SpotLight_setSpotAngle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SpotLight_setSpotAngle : Error processing arguments");
        cobj->setSpotAngle(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_SpotLight_setSpotAngle)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_SpotLight_finalize)

static bool js_scene_SpotLight_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::SpotLight);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_SpotLight_constructor, __jsb_cc_scene_SpotLight_class, js_cc_scene_SpotLight_finalize)

static bool js_cc_scene_SpotLight_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_SpotLight_finalize)

bool js_register_scene_SpotLight(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SpotLight", obj, __jsb_cc_scene_Light_proto, _SE(js_scene_SpotLight_constructor));

    cls->defineProperty("position", _SE(js_scene_SpotLight_getPosition_asGetter), nullptr);
    cls->defineProperty("size", _SE(js_scene_SpotLight_getSize_asGetter), _SE(js_scene_SpotLight_setSize_asSetter));
    cls->defineProperty("range", _SE(js_scene_SpotLight_getRange_asGetter), _SE(js_scene_SpotLight_setRange_asSetter));
    cls->defineProperty("luminance", _SE(js_scene_SpotLight_getLuminance_asGetter), _SE(js_scene_SpotLight_setLuminance_asSetter));
    cls->defineProperty("luminanceHDR", _SE(js_scene_SpotLight_getLuminanceHDR_asGetter), _SE(js_scene_SpotLight_setLuminanceHDR_asSetter));
    cls->defineProperty("luminanceLDR", _SE(js_scene_SpotLight_getLuminanceLDR_asGetter), _SE(js_scene_SpotLight_setLuminanceLDR_asSetter));
    cls->defineProperty("direction", _SE(js_scene_SpotLight_getDirection_asGetter), nullptr);
    cls->defineProperty("spotAngle", _SE(js_scene_SpotLight_getSpotAngle_asGetter), _SE(js_scene_SpotLight_setSpotAngle_asSetter));
    cls->defineProperty("angle", _SE(js_scene_SpotLight_getAngle_asGetter), nullptr);
    cls->defineProperty("aspect", _SE(js_scene_SpotLight_getAspect_asGetter), _SE(js_scene_SpotLight_setAspect_asSetter));
    cls->defineProperty("aabb", _SE(js_scene_SpotLight_getAABB_asGetter), nullptr);
    cls->defineProperty("frustum", _SE(js_scene_SpotLight_getFrustum_asGetter), _SE(js_scene_SpotLight_setFrustum_asSetter));
    cls->defineFunction("getShadowBias", _SE(js_scene_SpotLight_getShadowBias));
    cls->defineFunction("getShadowEnabled", _SE(js_scene_SpotLight_getShadowEnabled));
    cls->defineFunction("getShadowNormalBias", _SE(js_scene_SpotLight_getShadowNormalBias));
    cls->defineFunction("getShadowPcf", _SE(js_scene_SpotLight_getShadowPcf));
    cls->defineFunction("setShadowBias", _SE(js_scene_SpotLight_setShadowBias));
    cls->defineFunction("setShadowEnabled", _SE(js_scene_SpotLight_setShadowEnabled));
    cls->defineFunction("setShadowNormalBias", _SE(js_scene_SpotLight_setShadowNormalBias));
    cls->defineFunction("setShadowPcf", _SE(js_scene_SpotLight_setShadowPcf));
    cls->defineFinalizeFunction(_SE(js_cc_scene_SpotLight_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::SpotLight>(cls);

    __jsb_cc_scene_SpotLight_proto = cls->getProto();
    __jsb_cc_scene_SpotLight_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_DrawBatch2D_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_DrawBatch2D_class = nullptr;  // NOLINT

static bool js_scene_DrawBatch2D_get_visFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawBatch2D>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawBatch2D_get_visFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->visFlags, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->visFlags, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_DrawBatch2D_get_visFlags)

static bool js_scene_DrawBatch2D_set_visFlags(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawBatch2D>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawBatch2D_set_visFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->visFlags, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_DrawBatch2D_set_visFlags : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_DrawBatch2D_set_visFlags)

static bool js_scene_DrawBatch2D_get_descriptorSet(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawBatch2D>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawBatch2D_get_descriptorSet : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->descriptorSet, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->descriptorSet, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_DrawBatch2D_get_descriptorSet)

static bool js_scene_DrawBatch2D_set_descriptorSet(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawBatch2D>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawBatch2D_set_descriptorSet : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->descriptorSet, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_DrawBatch2D_set_descriptorSet : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_DrawBatch2D_set_descriptorSet)

static bool js_scene_DrawBatch2D_get_inputAssembler(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawBatch2D>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawBatch2D_get_inputAssembler : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->inputAssembler, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->inputAssembler, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_DrawBatch2D_get_inputAssembler)

static bool js_scene_DrawBatch2D_set_inputAssembler(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawBatch2D>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawBatch2D_set_inputAssembler : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->inputAssembler, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_DrawBatch2D_set_inputAssembler : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_DrawBatch2D_set_inputAssembler)

static bool js_scene_DrawBatch2D_get_passes(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawBatch2D>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawBatch2D_get_passes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->passes, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->passes, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_DrawBatch2D_get_passes)

static bool js_scene_DrawBatch2D_set_passes(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawBatch2D>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawBatch2D_set_passes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->passes, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_DrawBatch2D_set_passes : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_DrawBatch2D_set_passes)

static bool js_scene_DrawBatch2D_get_shaders(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawBatch2D>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawBatch2D_get_shaders : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->shaders, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->shaders, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_DrawBatch2D_get_shaders)

static bool js_scene_DrawBatch2D_set_shaders(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::DrawBatch2D>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_DrawBatch2D_set_shaders : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->shaders, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_DrawBatch2D_set_shaders : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_DrawBatch2D_set_shaders)


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
    json->getProperty("visFlags", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->visFlags), ctx);
    }
    json->getProperty("descriptorSet", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->descriptorSet), ctx);
    }
    json->getProperty("inputAssembler", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->inputAssembler), ctx);
    }
    json->getProperty("passes", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->passes), ctx);
    }
    json->getProperty("shaders", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->shaders), ctx);
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
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::DrawBatch2D);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::DrawBatch2D);
        auto cobj = ptr->get<cc::scene::DrawBatch2D>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::DrawBatch2D);
    auto cobj = ptr->get<cc::scene::DrawBatch2D>();
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

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_DrawBatch2D_constructor, __jsb_cc_scene_DrawBatch2D_class, js_cc_scene_DrawBatch2D_finalize)

static bool js_cc_scene_DrawBatch2D_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_DrawBatch2D_finalize)

bool js_register_scene_DrawBatch2D(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DrawBatch2D", obj, nullptr, _SE(js_scene_DrawBatch2D_constructor));

    cls->defineProperty("visFlags", _SE(js_scene_DrawBatch2D_get_visFlags), _SE(js_scene_DrawBatch2D_set_visFlags));
    cls->defineProperty("descriptorSet", _SE(js_scene_DrawBatch2D_get_descriptorSet), _SE(js_scene_DrawBatch2D_set_descriptorSet));
    cls->defineProperty("inputAssembler", _SE(js_scene_DrawBatch2D_get_inputAssembler), _SE(js_scene_DrawBatch2D_set_inputAssembler));
    cls->defineProperty("passes", _SE(js_scene_DrawBatch2D_get_passes), _SE(js_scene_DrawBatch2D_set_passes));
    cls->defineProperty("shaders", _SE(js_scene_DrawBatch2D_get_shaders), _SE(js_scene_DrawBatch2D_set_shaders));
    cls->defineFinalizeFunction(_SE(js_cc_scene_DrawBatch2D_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::DrawBatch2D>(cls);

    __jsb_cc_scene_DrawBatch2D_proto = cls->getProto();
    __jsb_cc_scene_DrawBatch2D_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_PassInstance_proto = nullptr; // NOLINT
se::Class* __jsb_cc_PassInstance_class = nullptr;  // NOLINT

static bool js_scene_PassInstance_getParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::PassInstance>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_PassInstance_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::scene::Pass* result = cobj->getParent();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_PassInstance_getParent : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_PassInstance_getParent)

SE_DECLARE_FINALIZE_FUNC(js_cc_PassInstance_finalize)

static bool js_scene_PassInstance_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::scene::Pass* arg0 = nullptr;
    cc::MaterialInstance* arg1 = nullptr;
    ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
    ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_PassInstance_constructor : Error processing arguments");
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::PassInstance, arg0, arg1);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_PassInstance_constructor, __jsb_cc_PassInstance_class, js_cc_PassInstance_finalize)

static bool js_cc_PassInstance_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_PassInstance_finalize)

bool js_register_scene_PassInstance(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("PassInstance", obj, __jsb_cc_scene_Pass_proto, _SE(js_scene_PassInstance_constructor));

    cls->defineProperty("parent", _SE(js_scene_PassInstance_getParent_asGetter), nullptr);
    cls->defineFinalizeFunction(_SE(js_cc_PassInstance_finalize));
    cls->install();
    JSBClassType::registerClass<cc::PassInstance>(cls);

    __jsb_cc_PassInstance_proto = cls->getProto();
    __jsb_cc_PassInstance_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IMaterialInstanceInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IMaterialInstanceInfo_class = nullptr;  // NOLINT

static bool js_scene_IMaterialInstanceInfo_get_parent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IMaterialInstanceInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IMaterialInstanceInfo_get_parent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->parent, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->parent, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_IMaterialInstanceInfo_get_parent)

static bool js_scene_IMaterialInstanceInfo_set_parent(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IMaterialInstanceInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IMaterialInstanceInfo_set_parent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->parent, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_IMaterialInstanceInfo_set_parent : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_IMaterialInstanceInfo_set_parent)

static bool js_scene_IMaterialInstanceInfo_get_subModelIdx(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IMaterialInstanceInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IMaterialInstanceInfo_get_subModelIdx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->subModelIdx, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->subModelIdx, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_IMaterialInstanceInfo_get_subModelIdx)

static bool js_scene_IMaterialInstanceInfo_set_subModelIdx(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IMaterialInstanceInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IMaterialInstanceInfo_set_subModelIdx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->subModelIdx, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_IMaterialInstanceInfo_set_subModelIdx : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_IMaterialInstanceInfo_set_subModelIdx)


template<>
bool sevalue_to_native(const se::Value &from, cc::IMaterialInstanceInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IMaterialInstanceInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("parent", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->parent), ctx);
    }
    json->getProperty("subModelIdx", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->subModelIdx), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IMaterialInstanceInfo_finalize)

static bool js_scene_IMaterialInstanceInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IMaterialInstanceInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IMaterialInstanceInfo);
        auto cobj = ptr->get<cc::IMaterialInstanceInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IMaterialInstanceInfo);
    auto cobj = ptr->get<cc::IMaterialInstanceInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->parent), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->subModelIdx), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_IMaterialInstanceInfo_constructor, __jsb_cc_IMaterialInstanceInfo_class, js_cc_IMaterialInstanceInfo_finalize)

static bool js_cc_IMaterialInstanceInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IMaterialInstanceInfo_finalize)

bool js_register_scene_IMaterialInstanceInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IMaterialInstanceInfo", obj, nullptr, _SE(js_scene_IMaterialInstanceInfo_constructor));

    cls->defineProperty("parent", _SE(js_scene_IMaterialInstanceInfo_get_parent), _SE(js_scene_IMaterialInstanceInfo_set_parent));
    cls->defineProperty("subModelIdx", _SE(js_scene_IMaterialInstanceInfo_get_subModelIdx), _SE(js_scene_IMaterialInstanceInfo_set_subModelIdx));
    cls->defineFinalizeFunction(_SE(js_cc_IMaterialInstanceInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IMaterialInstanceInfo>(cls);

    __jsb_cc_IMaterialInstanceInfo_proto = cls->getProto();
    __jsb_cc_IMaterialInstanceInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_MaterialInstance_proto = nullptr; // NOLINT
se::Class* __jsb_cc_MaterialInstance_class = nullptr;  // NOLINT

static bool js_scene_MaterialInstance_onPassStateChange(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::MaterialInstance>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_MaterialInstance_onPassStateChange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_MaterialInstance_onPassStateChange : Error processing arguments");
        cobj->onPassStateChange(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_MaterialInstance_onPassStateChange)

static bool js_scene_MaterialInstance_setRebuildPSOCallback(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::MaterialInstance>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_MaterialInstance_setRebuildPSOCallback : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<void (int, cc::Material *)>, true> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto * thisObj = s.thisObject();
                auto lambda = [=](int larg0, cc::Material* larg1) -> void {
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
        SE_PRECONDITION2(ok, false, "js_scene_MaterialInstance_setRebuildPSOCallback : Error processing arguments");
        cobj->setRebuildPSOCallback(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_MaterialInstance_setRebuildPSOCallback)

SE_DECLARE_FINALIZE_FUNC(js_cc_MaterialInstance_finalize)

static bool js_scene_MaterialInstance_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::IMaterialInstanceInfo arg0;
    ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_MaterialInstance_constructor : Error processing arguments");
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::MaterialInstance, arg0);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_MaterialInstance_constructor, __jsb_cc_MaterialInstance_class, js_cc_MaterialInstance_finalize)

static bool js_cc_MaterialInstance_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_MaterialInstance_finalize)

bool js_register_scene_MaterialInstance(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("MaterialInstance", obj, __jsb_cc_Material_proto, _SE(js_scene_MaterialInstance_constructor));

    cls->defineFunction("onPassStateChange", _SE(js_scene_MaterialInstance_onPassStateChange));
    cls->defineFunction("setRebuildPSOCallback", _SE(js_scene_MaterialInstance_setRebuildPSOCallback));
    cls->defineFinalizeFunction(_SE(js_cc_MaterialInstance_finalize));
    cls->install();
    JSBClassType::registerClass<cc::MaterialInstance>(cls);

    __jsb_cc_MaterialInstance_proto = cls->getProto();
    __jsb_cc_MaterialInstance_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_MorphModel_proto = nullptr; // NOLINT
se::Class* __jsb_cc_MorphModel_class = nullptr;  // NOLINT

static bool js_scene_MorphModel_setMorphRendering(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::MorphModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_MorphModel_setMorphRendering : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::MorphRenderingInstance*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_MorphModel_setMorphRendering : Error processing arguments");
        cobj->setMorphRendering(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_MorphModel_setMorphRendering)

SE_DECLARE_FINALIZE_FUNC(js_cc_MorphModel_finalize)

static bool js_scene_MorphModel_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::MorphModel);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_MorphModel_constructor, __jsb_cc_MorphModel_class, js_cc_MorphModel_finalize)

static bool js_cc_MorphModel_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_MorphModel_finalize)

bool js_register_scene_MorphModel(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("MorphModel", obj, __jsb_cc_scene_Model_proto, _SE(js_scene_MorphModel_constructor));

    cls->defineFunction("setMorphRendering", _SE(js_scene_MorphModel_setMorphRendering));
    cls->defineFinalizeFunction(_SE(js_cc_MorphModel_finalize));
    cls->install();
    JSBClassType::registerClass<cc::MorphModel>(cls);

    __jsb_cc_MorphModel_proto = cls->getProto();
    __jsb_cc_MorphModel_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_SkinningModel_proto = nullptr; // NOLINT
se::Class* __jsb_cc_SkinningModel_class = nullptr;  // NOLINT

static bool js_scene_SkinningModel_bindSkeleton(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::SkinningModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_SkinningModel_bindSkeleton : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<cc::Skeleton*, false> arg0 = {};
        HolderType<cc::Node*, false> arg1 = {};
        HolderType<cc::Mesh*, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_SkinningModel_bindSkeleton : Error processing arguments");
        cobj->bindSkeleton(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_scene_SkinningModel_bindSkeleton)

SE_DECLARE_FINALIZE_FUNC(js_cc_SkinningModel_finalize)

static bool js_scene_SkinningModel_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::SkinningModel);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_SkinningModel_constructor, __jsb_cc_SkinningModel_class, js_cc_SkinningModel_finalize)

static bool js_cc_SkinningModel_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_SkinningModel_finalize)

bool js_register_scene_SkinningModel(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SkinningModel", obj, __jsb_cc_MorphModel_proto, _SE(js_scene_SkinningModel_constructor));

    cls->defineFunction("bindSkeleton", _SE(js_scene_SkinningModel_bindSkeleton));
    cls->defineFinalizeFunction(_SE(js_cc_SkinningModel_finalize));
    cls->install();
    JSBClassType::registerClass<cc::SkinningModel>(cls);

    __jsb_cc_SkinningModel_proto = cls->getProto();
    __jsb_cc_SkinningModel_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_BakedSkinningModel_proto = nullptr; // NOLINT
se::Class* __jsb_cc_BakedSkinningModel_class = nullptr;  // NOLINT

static bool js_scene_BakedSkinningModel_bindSkeleton(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BakedSkinningModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_BakedSkinningModel_bindSkeleton : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<cc::Skeleton*, false> arg0 = {};
        HolderType<cc::Node*, false> arg1 = {};
        HolderType<cc::Mesh*, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_BakedSkinningModel_bindSkeleton : Error processing arguments");
        cobj->bindSkeleton(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_scene_BakedSkinningModel_bindSkeleton)

static bool js_scene_BakedSkinningModel_setUploadedAnimForJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BakedSkinningModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_BakedSkinningModel_setUploadedAnimForJS : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_BakedSkinningModel_setUploadedAnimForJS : Error processing arguments");
        cobj->setUploadedAnimForJS(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_BakedSkinningModel_setUploadedAnimForJS)

static bool js_scene_BakedSkinningModel_syncAnimInfoForJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BakedSkinningModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_BakedSkinningModel_syncAnimInfoForJS : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<cc::gfx::Buffer*, false> arg0 = {};
        HolderType<cc::TypedArrayTemp<float>, true> arg1 = {};
        HolderType<cc::TypedArrayTemp<unsigned char>, true> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_BakedSkinningModel_syncAnimInfoForJS : Error processing arguments");
        cobj->syncAnimInfoForJS(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_scene_BakedSkinningModel_syncAnimInfoForJS)

static bool js_scene_BakedSkinningModel_syncDataForJS(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::BakedSkinningModel>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_BakedSkinningModel_syncDataForJS : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 8) {
        HolderType<std::vector<boost::optional<cc::geometry::AABB>>, true> arg0 = {};
        HolderType<boost::optional<cc::geometry::AABB>, true> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        HolderType<float, false> arg5 = {};
        HolderType<cc::gfx::Texture*, false> arg6 = {};
        HolderType<cc::TypedArrayTemp<float>, true> arg7 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        ok &= sevalue_to_native(args[6], &arg6, s.thisObject());
        ok &= sevalue_to_native(args[7], &arg7, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_BakedSkinningModel_syncDataForJS : Error processing arguments");
        cobj->syncDataForJS(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value(), arg6.value(), arg7.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 8);
    return false;
}
SE_BIND_FUNC(js_scene_BakedSkinningModel_syncDataForJS)

SE_DECLARE_FINALIZE_FUNC(js_cc_BakedSkinningModel_finalize)

static bool js_scene_BakedSkinningModel_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::BakedSkinningModel);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_BakedSkinningModel_constructor, __jsb_cc_BakedSkinningModel_class, js_cc_BakedSkinningModel_finalize)

static bool js_cc_BakedSkinningModel_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_BakedSkinningModel_finalize)

bool js_register_scene_BakedSkinningModel(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BakedSkinningModel", obj, __jsb_cc_MorphModel_proto, _SE(js_scene_BakedSkinningModel_constructor));

    cls->defineFunction("bindSkeleton", _SE(js_scene_BakedSkinningModel_bindSkeleton));
    cls->defineFunction("setUploadedAnimForJS", _SE(js_scene_BakedSkinningModel_setUploadedAnimForJS));
    cls->defineFunction("syncAnimInfoForJS", _SE(js_scene_BakedSkinningModel_syncAnimInfoForJS));
    cls->defineFunction("syncDataForJS", _SE(js_scene_BakedSkinningModel_syncDataForJS));
    cls->defineFinalizeFunction(_SE(js_cc_BakedSkinningModel_finalize));
    cls->install();
    JSBClassType::registerClass<cc::BakedSkinningModel>(cls);

    __jsb_cc_BakedSkinningModel_proto = cls->getProto();
    __jsb_cc_BakedSkinningModel_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IDefineRecord_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IDefineRecord_class = nullptr;  // NOLINT

static bool js_scene_IDefineRecord_get_offset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IDefineRecord>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IDefineRecord_get_offset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->offset, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->offset, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_IDefineRecord_get_offset)

static bool js_scene_IDefineRecord_set_offset(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IDefineRecord>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IDefineRecord_set_offset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->offset, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_IDefineRecord_set_offset : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_IDefineRecord_set_offset)


template<>
bool sevalue_to_native(const se::Value &from, cc::IDefineRecord * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IDefineRecord*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    ok &= sevalue_to_native<cc::IDefineInfo>(from, to, ctx);
    json->getProperty("offset", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->offset), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IDefineRecord_finalize)

static bool js_scene_IDefineRecord_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IDefineRecord);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IDefineRecord);
        auto cobj = ptr->get<cc::IDefineRecord>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        sevalue_to_native<cc::IDefineInfo>(args[0], cobj, s.thisObject()); // skip ok
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IDefineRecord);
    auto cobj = ptr->get<cc::IDefineRecord>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->offset), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_IDefineRecord_constructor, __jsb_cc_IDefineRecord_class, js_cc_IDefineRecord_finalize)

static bool js_cc_IDefineRecord_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IDefineRecord_finalize)

bool js_register_scene_IDefineRecord(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IDefineRecord", obj, __jsb_cc_IDefineInfo_proto, _SE(js_scene_IDefineRecord_constructor));

    cls->defineProperty("offset", _SE(js_scene_IDefineRecord_get_offset), _SE(js_scene_IDefineRecord_set_offset));
    cls->defineFinalizeFunction(_SE(js_cc_IDefineRecord_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IDefineRecord>(cls);

    __jsb_cc_IDefineRecord_proto = cls->getProto();
    __jsb_cc_IDefineRecord_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_IProgramInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_IProgramInfo_class = nullptr;  // NOLINT

static bool js_scene_IProgramInfo_copyFrom(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IProgramInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IProgramInfo_copyFrom : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::IShaderInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_IProgramInfo_copyFrom : Error processing arguments");
        cobj->copyFrom(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_IProgramInfo_copyFrom)

static bool js_scene_IProgramInfo_get_effectName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IProgramInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IProgramInfo_get_effectName : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->effectName, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->effectName, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_IProgramInfo_get_effectName)

static bool js_scene_IProgramInfo_set_effectName(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IProgramInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IProgramInfo_set_effectName : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->effectName, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_IProgramInfo_set_effectName : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_IProgramInfo_set_effectName)

static bool js_scene_IProgramInfo_get_defines(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IProgramInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IProgramInfo_get_defines : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->defines, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->defines, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_IProgramInfo_get_defines)

static bool js_scene_IProgramInfo_set_defines(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IProgramInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IProgramInfo_set_defines : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->defines, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_IProgramInfo_set_defines : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_IProgramInfo_set_defines)

static bool js_scene_IProgramInfo_get_constantMacros(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IProgramInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IProgramInfo_get_constantMacros : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->constantMacros, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->constantMacros, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_IProgramInfo_get_constantMacros)

static bool js_scene_IProgramInfo_set_constantMacros(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IProgramInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IProgramInfo_set_constantMacros : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->constantMacros, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_IProgramInfo_set_constantMacros : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_IProgramInfo_set_constantMacros)

static bool js_scene_IProgramInfo_get_uber(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::IProgramInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IProgramInfo_get_uber : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->uber, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->uber, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_IProgramInfo_get_uber)

static bool js_scene_IProgramInfo_set_uber(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::IProgramInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_IProgramInfo_set_uber : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->uber, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_IProgramInfo_set_uber : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_IProgramInfo_set_uber)


template<>
bool sevalue_to_native(const se::Value &from, cc::IProgramInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = reinterpret_cast<cc::IProgramInfo*>(json->getPrivateData());
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    ok &= sevalue_to_native<cc::IShaderInfo>(from, to, ctx);
    json->getProperty("effectName", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->effectName), ctx);
    }
    json->getProperty("defines", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->defines), ctx);
    }
    json->getProperty("constantMacros", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->constantMacros), ctx);
    }
    json->getProperty("uber", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->uber), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_IProgramInfo_finalize)

static bool js_scene_IProgramInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0)
    {
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IProgramInfo);
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }

    if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;
        auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IProgramInfo);
        auto cobj = ptr->get<cc::IProgramInfo>();
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            delete ptr;
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }
        sevalue_to_native<cc::IShaderInfo>(args[0], cobj, s.thisObject()); // skip ok
        s.thisObject()->setPrivateObject(ptr);
        return true;
    }
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::IProgramInfo);
    auto cobj = ptr->get<cc::IProgramInfo>();
    if (argc > 0 && !args[0].isUndefined()) {
        ok &= sevalue_to_native(args[0], &(cobj->effectName), nullptr);
    }
    if (argc > 1 && !args[1].isUndefined()) {
        ok &= sevalue_to_native(args[1], &(cobj->defines), nullptr);
    }
    if (argc > 2 && !args[2].isUndefined()) {
        ok &= sevalue_to_native(args[2], &(cobj->constantMacros), nullptr);
    }
    if (argc > 3 && !args[3].isUndefined()) {
        ok &= sevalue_to_native(args[3], &(cobj->uber), nullptr);
    }

    if(!ok) {
        delete ptr;
        SE_REPORT_ERROR("Argument convertion error");
        return false;
    }
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_IProgramInfo_constructor, __jsb_cc_IProgramInfo_class, js_cc_IProgramInfo_finalize)

static bool js_cc_IProgramInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_IProgramInfo_finalize)

bool js_register_scene_IProgramInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IProgramInfo", obj, __jsb_cc_IShaderInfo_proto, _SE(js_scene_IProgramInfo_constructor));

    cls->defineProperty("effectName", _SE(js_scene_IProgramInfo_get_effectName), _SE(js_scene_IProgramInfo_set_effectName));
    cls->defineProperty("defines", _SE(js_scene_IProgramInfo_get_defines), _SE(js_scene_IProgramInfo_set_defines));
    cls->defineProperty("constantMacros", _SE(js_scene_IProgramInfo_get_constantMacros), _SE(js_scene_IProgramInfo_set_constantMacros));
    cls->defineProperty("uber", _SE(js_scene_IProgramInfo_get_uber), _SE(js_scene_IProgramInfo_set_uber));
    cls->defineFunction("copyFrom", _SE(js_scene_IProgramInfo_copyFrom));
    cls->defineFinalizeFunction(_SE(js_cc_IProgramInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::IProgramInfo>(cls);

    __jsb_cc_IProgramInfo_proto = cls->getProto();
    __jsb_cc_IProgramInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_ProgramLib_proto = nullptr; // NOLINT
se::Class* __jsb_cc_ProgramLib_class = nullptr;  // NOLINT

static bool js_scene_ProgramLib_define(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ProgramLib>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ProgramLib_define : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::IShaderInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_define : Error processing arguments");
        cc::IProgramInfo* result = cobj->define(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_define : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_ProgramLib_define)

static bool js_scene_ProgramLib_destroyShaderByDefines(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ProgramLib>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ProgramLib_destroyShaderByDefines : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::unordered_map<std::string, boost::variant2::variant<int, bool, std::string>>, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_destroyShaderByDefines : Error processing arguments");
        cobj->destroyShaderByDefines(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_ProgramLib_destroyShaderByDefines)

static bool js_scene_ProgramLib_getDescriptorSetLayout(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ProgramLib>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ProgramLib_getDescriptorSetLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::gfx::Device*, false> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_getDescriptorSetLayout : Error processing arguments");
        cc::gfx::DescriptorSetLayout* result = cobj->getDescriptorSetLayout(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_getDescriptorSetLayout : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 3) {
        HolderType<cc::gfx::Device*, false> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        HolderType<bool, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_getDescriptorSetLayout : Error processing arguments");
        cc::gfx::DescriptorSetLayout* result = cobj->getDescriptorSetLayout(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_getDescriptorSetLayout : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_scene_ProgramLib_getDescriptorSetLayout)

static bool js_scene_ProgramLib_getGFXShader(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ProgramLib>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ProgramLib_getGFXShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<cc::gfx::Device*, false> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        HolderType<std::unordered_map<std::string, boost::variant2::variant<int, bool, std::string>>, true> arg2 = {};
        HolderType<cc::pipeline::RenderPipeline*, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_getGFXShader : Error processing arguments");
        cc::gfx::Shader* result = cobj->getGFXShader(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_getGFXShader : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 5) {
        HolderType<cc::gfx::Device*, false> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        HolderType<std::unordered_map<std::string, boost::variant2::variant<int, bool, std::string>>, true> arg2 = {};
        HolderType<cc::pipeline::RenderPipeline*, false> arg3 = {};
        HolderType<std::string*, false> arg4 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_getGFXShader : Error processing arguments");
        cc::gfx::Shader* result = cobj->getGFXShader(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_getGFXShader : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_scene_ProgramLib_getGFXShader)

static bool js_scene_ProgramLib_getKey(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ProgramLib>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ProgramLib_getKey : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::unordered_map<std::string, boost::variant2::variant<int, bool, std::string>>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_getKey : Error processing arguments");
        std::string result = cobj->getKey(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_getKey : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_scene_ProgramLib_getKey)

static bool js_scene_ProgramLib_getTemplate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ProgramLib>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ProgramLib_getTemplate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_getTemplate : Error processing arguments");
        cc::IProgramInfo* result = cobj->getTemplate(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_getTemplate : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_ProgramLib_getTemplate)

static bool js_scene_ProgramLib_getTemplateInfo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ProgramLib>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ProgramLib_getTemplateInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_getTemplateInfo : Error processing arguments");
        cc::ITemplateInfo* result = cobj->getTemplateInfo(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_getTemplateInfo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_ProgramLib_getTemplateInfo)

static bool js_scene_ProgramLib_hasProgram(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ProgramLib>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ProgramLib_hasProgram : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_hasProgram : Error processing arguments");
        bool result = cobj->hasProgram(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_hasProgram : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_ProgramLib_hasProgram)

static bool js_scene_ProgramLib_registerEffect(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::ProgramLib>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_ProgramLib_registerEffect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::EffectAsset*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_registerEffect : Error processing arguments");
        cobj->registerEffect(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_ProgramLib_registerEffect)

static bool js_scene_ProgramLib_destroyInstance_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cc::ProgramLib::destroyInstance();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_ProgramLib_destroyInstance_static)

static bool js_scene_ProgramLib_getInstance_static(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::ProgramLib* result = cc::ProgramLib::getInstance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_ProgramLib_getInstance_static : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_ProgramLib_getInstance_static)

bool js_register_scene_ProgramLib(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ProgramLib", obj, nullptr, nullptr);

    cls->defineFunction("define", _SE(js_scene_ProgramLib_define));
    cls->defineFunction("destroyShaderByDefines", _SE(js_scene_ProgramLib_destroyShaderByDefines));
    cls->defineFunction("getDescriptorSetLayout", _SE(js_scene_ProgramLib_getDescriptorSetLayout));
    cls->defineFunction("getGFXShader", _SE(js_scene_ProgramLib_getGFXShader));
    cls->defineFunction("getKey", _SE(js_scene_ProgramLib_getKey));
    cls->defineFunction("getTemplate", _SE(js_scene_ProgramLib_getTemplate));
    cls->defineFunction("getTemplateInfo", _SE(js_scene_ProgramLib_getTemplateInfo));
    cls->defineFunction("hasProgram", _SE(js_scene_ProgramLib_hasProgram));
    cls->defineFunction("register", _SE(js_scene_ProgramLib_registerEffect));
    cls->defineStaticFunction("destroyInstance", _SE(js_scene_ProgramLib_destroyInstance_static));
    cls->defineStaticFunction("getInstance", _SE(js_scene_ProgramLib_getInstance_static));
    cls->install();
    JSBClassType::registerClass<cc::ProgramLib>(cls);

    __jsb_cc_ProgramLib_proto = cls->getProto();
    __jsb_cc_ProgramLib_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_OctreeInfo_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_OctreeInfo_class = nullptr;  // NOLINT

static bool js_scene_OctreeInfo_activate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_activate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Octree*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_OctreeInfo_activate : Error processing arguments");
        cobj->activate(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_OctreeInfo_activate)

static bool js_scene_OctreeInfo_getDepth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_getDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getDepth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_OctreeInfo_getDepth : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_OctreeInfo_getDepth)

static bool js_scene_OctreeInfo_getMaxPos(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_getMaxPos : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec3& result = cobj->getMaxPos();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_OctreeInfo_getMaxPos : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_OctreeInfo_getMaxPos)

static bool js_scene_OctreeInfo_getMinPos(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_getMinPos : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec3& result = cobj->getMinPos();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_OctreeInfo_getMinPos : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_OctreeInfo_getMinPos)

static bool js_scene_OctreeInfo_isEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_isEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isEnabled();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_OctreeInfo_isEnabled : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC_AS_PROP_GET(js_scene_OctreeInfo_isEnabled)

static bool js_scene_OctreeInfo_setDepth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_setDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_OctreeInfo_setDepth : Error processing arguments");
        cobj->setDepth(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_OctreeInfo_setDepth)

static bool js_scene_OctreeInfo_setEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_setEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_OctreeInfo_setEnabled : Error processing arguments");
        cobj->setEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_OctreeInfo_setEnabled)

static bool js_scene_OctreeInfo_setMaxPos(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_setMaxPos : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_OctreeInfo_setMaxPos : Error processing arguments");
        cobj->setMaxPos(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_OctreeInfo_setMaxPos)

static bool js_scene_OctreeInfo_setMinPos(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_setMinPos : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_OctreeInfo_setMinPos : Error processing arguments");
        cobj->setMinPos(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_scene_OctreeInfo_setMinPos)

static bool js_scene_OctreeInfo_get__enabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_get__enabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_enabled, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_enabled, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_OctreeInfo_get__enabled)

static bool js_scene_OctreeInfo_set__enabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_set__enabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_enabled, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_OctreeInfo_set__enabled : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_OctreeInfo_set__enabled)

static bool js_scene_OctreeInfo_get__minPos(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_get__minPos : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_minPos, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_minPos, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_OctreeInfo_get__minPos)

static bool js_scene_OctreeInfo_set__minPos(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_set__minPos : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_minPos, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_OctreeInfo_set__minPos : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_OctreeInfo_set__minPos)

static bool js_scene_OctreeInfo_get__maxPos(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_get__maxPos : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_maxPos, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_maxPos, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_OctreeInfo_get__maxPos)

static bool js_scene_OctreeInfo_set__maxPos(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_set__maxPos : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_maxPos, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_OctreeInfo_set__maxPos : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_OctreeInfo_set__maxPos)

static bool js_scene_OctreeInfo_get__depth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_get__depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->_depth, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->_depth, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_OctreeInfo_get__depth)

static bool js_scene_OctreeInfo_set__depth(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<cc::scene::OctreeInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_OctreeInfo_set__depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->_depth, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_scene_OctreeInfo_set__depth : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_scene_OctreeInfo_set__depth)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_OctreeInfo_finalize)

static bool js_scene_OctreeInfo_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::OctreeInfo);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_OctreeInfo_constructor, __jsb_cc_scene_OctreeInfo_class, js_cc_scene_OctreeInfo_finalize)

static bool js_cc_scene_OctreeInfo_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_OctreeInfo_finalize)

bool js_register_scene_OctreeInfo(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("OctreeInfo", obj, nullptr, _SE(js_scene_OctreeInfo_constructor));

    cls->defineProperty("_enabled", _SE(js_scene_OctreeInfo_get__enabled), _SE(js_scene_OctreeInfo_set__enabled));
    cls->defineProperty("_minPos", _SE(js_scene_OctreeInfo_get__minPos), _SE(js_scene_OctreeInfo_set__minPos));
    cls->defineProperty("_maxPos", _SE(js_scene_OctreeInfo_get__maxPos), _SE(js_scene_OctreeInfo_set__maxPos));
    cls->defineProperty("_depth", _SE(js_scene_OctreeInfo_get__depth), _SE(js_scene_OctreeInfo_set__depth));
    cls->defineProperty("enabled", _SE(js_scene_OctreeInfo_isEnabled_asGetter), _SE(js_scene_OctreeInfo_setEnabled_asSetter));
    cls->defineProperty("minPos", _SE(js_scene_OctreeInfo_getMinPos_asGetter), _SE(js_scene_OctreeInfo_setMinPos_asSetter));
    cls->defineProperty("maxPos", _SE(js_scene_OctreeInfo_getMaxPos_asGetter), _SE(js_scene_OctreeInfo_setMaxPos_asSetter));
    cls->defineProperty("depth", _SE(js_scene_OctreeInfo_getDepth_asGetter), _SE(js_scene_OctreeInfo_setDepth_asSetter));
    cls->defineFunction("activate", _SE(js_scene_OctreeInfo_activate));
    cls->defineFinalizeFunction(_SE(js_cc_scene_OctreeInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::OctreeInfo>(cls);

    __jsb_cc_scene_OctreeInfo_proto = cls->getProto();
    __jsb_cc_scene_OctreeInfo_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_cc_scene_Octree_proto = nullptr; // NOLINT
se::Class* __jsb_cc_scene_Octree_class = nullptr;  // NOLINT

static bool js_scene_Octree_getMaxDepth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Octree>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Octree_getMaxDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMaxDepth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Octree_getMaxDepth : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Octree_getMaxDepth)

static bool js_scene_Octree_getMaxPos(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Octree>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Octree_getMaxPos : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec3& result = cobj->getMaxPos();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Octree_getMaxPos : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Octree_getMaxPos)

static bool js_scene_Octree_getMinPos(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Octree>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Octree_getMinPos : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::Vec3& result = cobj->getMinPos();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Octree_getMinPos : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Octree_getMinPos)

static bool js_scene_Octree_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Octree>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Octree_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::OctreeInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Octree_initialize : Error processing arguments");
        cobj->initialize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Octree_initialize)

static bool js_scene_Octree_insert(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Octree>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Octree_insert : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Model*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Octree_insert : Error processing arguments");
        cobj->insert(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Octree_insert)

static bool js_scene_Octree_isEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Octree>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Octree_isEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isEnabled();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_scene_Octree_isEnabled : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_scene_Octree_isEnabled)

static bool js_scene_Octree_queryVisibility(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Octree>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Octree_queryVisibility : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<cc::scene::Camera*, false> arg0 = {};
        HolderType<cc::geometry::Frustum, true> arg1 = {};
        HolderType<bool, false> arg2 = {};
        HolderType<std::vector<cc::scene::Model *>, true> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Octree_queryVisibility : Error processing arguments");
        cobj->queryVisibility(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_scene_Octree_queryVisibility)

static bool js_scene_Octree_remove(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Octree>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Octree_remove : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Model*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Octree_remove : Error processing arguments");
        cobj->remove(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Octree_remove)

static bool js_scene_Octree_resize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Octree>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Octree_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<cc::Vec3, true> arg0 = {};
        HolderType<cc::Vec3, true> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Octree_resize : Error processing arguments");
        cobj->resize(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_scene_Octree_resize)

static bool js_scene_Octree_setEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Octree>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Octree_setEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Octree_setEnabled : Error processing arguments");
        cobj->setEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Octree_setEnabled)

static bool js_scene_Octree_setMaxDepth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Octree>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Octree_setMaxDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Octree_setMaxDepth : Error processing arguments");
        cobj->setMaxDepth(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Octree_setMaxDepth)

static bool js_scene_Octree_setMaxPos(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Octree>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Octree_setMaxPos : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Octree_setMaxPos : Error processing arguments");
        cobj->setMaxPos(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Octree_setMaxPos)

static bool js_scene_Octree_setMinPos(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Octree>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Octree_setMinPos : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::Vec3, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Octree_setMinPos : Error processing arguments");
        cobj->setMinPos(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Octree_setMinPos)

static bool js_scene_Octree_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<cc::scene::Octree>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Octree_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::scene::Model*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_scene_Octree_update : Error processing arguments");
        cobj->update(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Octree_update)

SE_DECLARE_FINALIZE_FUNC(js_cc_scene_Octree_finalize)

static bool js_scene_Octree_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    auto *ptr = JSB_MAKE_PRIVATE_OBJECT(cc::scene::Octree);
    s.thisObject()->setPrivateObject(ptr);
    return true;
}
SE_BIND_CTOR(js_scene_Octree_constructor, __jsb_cc_scene_Octree_class, js_cc_scene_Octree_finalize)

static bool js_cc_scene_Octree_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_scene_Octree_finalize)

bool js_register_scene_Octree(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Octree", obj, nullptr, _SE(js_scene_Octree_constructor));

    cls->defineFunction("getMaxDepth", _SE(js_scene_Octree_getMaxDepth));
    cls->defineFunction("getMaxPos", _SE(js_scene_Octree_getMaxPos));
    cls->defineFunction("getMinPos", _SE(js_scene_Octree_getMinPos));
    cls->defineFunction("initialize", _SE(js_scene_Octree_initialize));
    cls->defineFunction("insert", _SE(js_scene_Octree_insert));
    cls->defineFunction("isEnabled", _SE(js_scene_Octree_isEnabled));
    cls->defineFunction("queryVisibility", _SE(js_scene_Octree_queryVisibility));
    cls->defineFunction("remove", _SE(js_scene_Octree_remove));
    cls->defineFunction("resize", _SE(js_scene_Octree_resize));
    cls->defineFunction("setEnabled", _SE(js_scene_Octree_setEnabled));
    cls->defineFunction("setMaxDepth", _SE(js_scene_Octree_setMaxDepth));
    cls->defineFunction("setMaxPos", _SE(js_scene_Octree_setMaxPos));
    cls->defineFunction("setMinPos", _SE(js_scene_Octree_setMinPos));
    cls->defineFunction("update", _SE(js_scene_Octree_update));
    cls->defineFinalizeFunction(_SE(js_cc_scene_Octree_finalize));
    cls->install();
    JSBClassType::registerClass<cc::scene::Octree>(cls);

    __jsb_cc_scene_Octree_proto = cls->getProto();
    __jsb_cc_scene_Octree_class = cls;


    se::ScriptEngine::getInstance()->clearException();
    return true;
}
bool register_all_scene(se::Object* obj)    // NOLINT
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

    js_register_scene_Ambient(ns);
    js_register_scene_AmbientInfo(ns);
    js_register_scene_Model(ns);
    js_register_scene_MorphModel(ns);
    js_register_scene_BakedSkinningModel(ns);
    js_register_scene_BaseNode(ns);
    js_register_scene_Camera(ns);
    js_register_scene_Light(ns);
    js_register_scene_DirectionalLight(ns);
    js_register_scene_DrawBatch2D(ns);
    js_register_scene_Fog(ns);
    js_register_scene_FogInfo(ns);
    js_register_scene_ICameraInfo(ns);
    js_register_scene_IDefineRecord(ns);
    js_register_scene_IMacroPatch(ns);
    js_register_scene_IMaterialInstanceInfo(ns);
    js_register_scene_IProgramInfo(ns);
    js_register_scene_IRenderSceneInfo(ns);
    js_register_scene_IRenderWindowInfo(ns);
    js_register_scene_InstancedAttributeBlock(ns);
    js_register_scene_MaterialInstance(ns);
    js_register_scene_Node(ns);
    js_register_scene_Octree(ns);
    js_register_scene_OctreeInfo(ns);
    js_register_scene_Pass(ns);
    js_register_scene_PassDynamicsValue(ns);
    js_register_scene_PassInstance(ns);
    js_register_scene_ProgramLib(ns);
    js_register_scene_RenderScene(ns);
    js_register_scene_RenderWindow(ns);
    js_register_scene_Root(ns);
    js_register_scene_Scene(ns);
    js_register_scene_SceneGlobals(ns);
    js_register_scene_Shadows(ns);
    js_register_scene_ShadowsInfo(ns);
    js_register_scene_SkinningModel(ns);
    js_register_scene_Skybox(ns);
    js_register_scene_SkyboxInfo(ns);
    js_register_scene_SphereLight(ns);
    js_register_scene_SpotLight(ns);
    js_register_scene_SubModel(ns);
    return true;
}

// clang-format on