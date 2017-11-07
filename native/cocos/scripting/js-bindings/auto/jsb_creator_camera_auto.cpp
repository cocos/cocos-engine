#include "scripting/js-bindings/auto/jsb_creator_camera_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "editor-support/creator/CCCameraNode.h"

se::Object* __jsb_creator_CameraNode_proto = nullptr;
se::Class* __jsb_creator_CameraNode_class = nullptr;

static bool js_creator_camera_CameraNode_removeTarget(se::State& s)
{
    creator::CameraNode* cobj = (creator::CameraNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_camera_CameraNode_removeTarget : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_camera_CameraNode_removeTarget : Error processing arguments");
        cobj->removeTarget(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_camera_CameraNode_removeTarget)

static bool js_creator_camera_CameraNode_setTransform(se::State& s)
{
    creator::CameraNode* cobj = (creator::CameraNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_camera_CameraNode_setTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        float arg4 = 0;
        float arg5 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        ok &= seval_to_float(args[4], &arg4);
        ok &= seval_to_float(args[5], &arg5);
        SE_PRECONDITION2(ok, false, "js_creator_camera_CameraNode_setTransform : Error processing arguments");
        cobj->setTransform(arg0, arg1, arg2, arg3, arg4, arg5);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_creator_camera_CameraNode_setTransform)

static bool js_creator_camera_CameraNode_getVisibleRect(se::State& s)
{
    creator::CameraNode* cobj = (creator::CameraNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_camera_CameraNode_getVisibleRect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Rect& result = cobj->getVisibleRect();
        ok &= Rect_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_camera_CameraNode_getVisibleRect : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_camera_CameraNode_getVisibleRect)

static bool js_creator_camera_CameraNode_setEnable(se::State& s)
{
    creator::CameraNode* cobj = (creator::CameraNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_camera_CameraNode_setEnable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_camera_CameraNode_setEnable : Error processing arguments");
        cobj->setEnable(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_camera_CameraNode_setEnable)

static bool js_creator_camera_CameraNode_containsNode(se::State& s)
{
    creator::CameraNode* cobj = (creator::CameraNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_camera_CameraNode_containsNode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_camera_CameraNode_containsNode : Error processing arguments");
        bool result = cobj->containsNode(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_camera_CameraNode_containsNode : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_camera_CameraNode_containsNode)

static bool js_creator_camera_CameraNode_addTarget(se::State& s)
{
    creator::CameraNode* cobj = (creator::CameraNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_camera_CameraNode_addTarget : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_camera_CameraNode_addTarget : Error processing arguments");
        cobj->addTarget(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_camera_CameraNode_addTarget)

static bool js_creator_camera_CameraNode_getInstance(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = creator::CameraNode::getInstance();
        se::Value instanceVal;
        native_ptr_to_seval<creator::CameraNode>(result, __jsb_creator_CameraNode_class, &instanceVal);
        instanceVal.toObject()->root();
        s.rval() = instanceVal;
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_camera_CameraNode_getInstance)

SE_DECLARE_FINALIZE_FUNC(js_creator_CameraNode_finalize)

static bool js_creator_camera_CameraNode_constructor(se::State& s)
{
    creator::CameraNode* cobj = new (std::nothrow) creator::CameraNode();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_camera_CameraNode_constructor, __jsb_creator_CameraNode_class, js_creator_CameraNode_finalize)



extern se::Object* __jsb_cocos2d_Node_proto;

static bool js_creator_CameraNode_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (creator::CameraNode)", s.nativeThisObject());
    creator::CameraNode* cobj = (creator::CameraNode*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_CameraNode_finalize)

bool js_register_creator_camera_CameraNode(se::Object* obj)
{
    auto cls = se::Class::create("CameraNode", obj, __jsb_cocos2d_Node_proto, _SE(js_creator_camera_CameraNode_constructor));

    cls->defineFunction("removeTarget", _SE(js_creator_camera_CameraNode_removeTarget));
    cls->defineFunction("setTransform", _SE(js_creator_camera_CameraNode_setTransform));
    cls->defineFunction("getVisibleRect", _SE(js_creator_camera_CameraNode_getVisibleRect));
    cls->defineFunction("setEnable", _SE(js_creator_camera_CameraNode_setEnable));
    cls->defineFunction("containsNode", _SE(js_creator_camera_CameraNode_containsNode));
    cls->defineFunction("addTarget", _SE(js_creator_camera_CameraNode_addTarget));
    cls->defineStaticFunction("getInstance", _SE(js_creator_camera_CameraNode_getInstance));
    cls->defineFinalizeFunction(_SE(js_creator_CameraNode_finalize));
    cls->install();
    JSBClassType::registerClass<creator::CameraNode>(cls);

    __jsb_creator_CameraNode_proto = cls->getProto();
    __jsb_creator_CameraNode_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_creator_camera(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("cc", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("cc", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_creator_camera_CameraNode(ns);
    return true;
}

