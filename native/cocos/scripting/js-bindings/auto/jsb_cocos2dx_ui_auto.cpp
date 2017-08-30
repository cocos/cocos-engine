#include "scripting/js-bindings/auto/jsb_cocos2dx_ui_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "ui/CocosGUI.h"

se::Object* __jsb_cocos2d_ui_LayoutParameter_proto = nullptr;
se::Class* __jsb_cocos2d_ui_LayoutParameter_class = nullptr;

static bool js_cocos2dx_ui_LayoutParameter_clone(se::State& s)
{
    cocos2d::ui::LayoutParameter* cobj = (cocos2d::ui::LayoutParameter*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutParameter_clone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ui::LayoutParameter* result = cobj->clone();
        ok &= native_ptr_to_seval<cocos2d::ui::LayoutParameter>((cocos2d::ui::LayoutParameter*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutParameter_clone : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutParameter_clone)

static bool js_cocos2dx_ui_LayoutParameter_getLayoutType(se::State& s)
{
    cocos2d::ui::LayoutParameter* cobj = (cocos2d::ui::LayoutParameter*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutParameter_getLayoutType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getLayoutType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutParameter_getLayoutType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutParameter_getLayoutType)

static bool js_cocos2dx_ui_LayoutParameter_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = cocos2d::ui::LayoutParameter::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_LayoutParameter_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutParameter_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_LayoutParameter_finalize)

static bool js_cocos2dx_ui_LayoutParameter_constructor(se::State& s)
{
    cocos2d::ui::LayoutParameter* cobj = new (std::nothrow) cocos2d::ui::LayoutParameter();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_LayoutParameter_constructor, __jsb_cocos2d_ui_LayoutParameter_class, js_cocos2d_ui_LayoutParameter_finalize)




static bool js_cocos2d_ui_LayoutParameter_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::LayoutParameter)", s.nativeThisObject());
    cocos2d::ui::LayoutParameter* cobj = (cocos2d::ui::LayoutParameter*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_LayoutParameter_finalize)

bool js_register_cocos2dx_ui_LayoutParameter(se::Object* obj)
{
    auto cls = se::Class::create("LayoutParameter", obj, nullptr, _SE(js_cocos2dx_ui_LayoutParameter_constructor));

    cls->defineFunction("clone", _SE(js_cocos2dx_ui_LayoutParameter_clone));
    cls->defineFunction("getLayoutType", _SE(js_cocos2dx_ui_LayoutParameter_getLayoutType));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_LayoutParameter_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_LayoutParameter_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::LayoutParameter>(cls);

    __jsb_cocos2d_ui_LayoutParameter_proto = cls->getProto();
    __jsb_cocos2d_ui_LayoutParameter_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_LinearLayoutParameter_proto = nullptr;
se::Class* __jsb_cocos2d_ui_LinearLayoutParameter_class = nullptr;

static bool js_cocos2dx_ui_LinearLayoutParameter_setGravity(se::State& s)
{
    cocos2d::ui::LinearLayoutParameter* cobj = (cocos2d::ui::LinearLayoutParameter*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LinearLayoutParameter_setGravity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::LinearLayoutParameter::LinearGravity arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LinearLayoutParameter_setGravity : Error processing arguments");
        cobj->setGravity(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LinearLayoutParameter_setGravity)

static bool js_cocos2dx_ui_LinearLayoutParameter_getGravity(se::State& s)
{
    cocos2d::ui::LinearLayoutParameter* cobj = (cocos2d::ui::LinearLayoutParameter*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LinearLayoutParameter_getGravity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getGravity();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LinearLayoutParameter_getGravity : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LinearLayoutParameter_getGravity)

static bool js_cocos2dx_ui_LinearLayoutParameter_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = cocos2d::ui::LinearLayoutParameter::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_LinearLayoutParameter_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LinearLayoutParameter_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_LinearLayoutParameter_finalize)

static bool js_cocos2dx_ui_LinearLayoutParameter_constructor(se::State& s)
{
    cocos2d::ui::LinearLayoutParameter* cobj = new (std::nothrow) cocos2d::ui::LinearLayoutParameter();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_LinearLayoutParameter_constructor, __jsb_cocos2d_ui_LinearLayoutParameter_class, js_cocos2d_ui_LinearLayoutParameter_finalize)



extern se::Object* __jsb_cocos2d_ui_LayoutParameter_proto;

static bool js_cocos2d_ui_LinearLayoutParameter_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::LinearLayoutParameter)", s.nativeThisObject());
    cocos2d::ui::LinearLayoutParameter* cobj = (cocos2d::ui::LinearLayoutParameter*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_LinearLayoutParameter_finalize)

bool js_register_cocos2dx_ui_LinearLayoutParameter(se::Object* obj)
{
    auto cls = se::Class::create("LinearLayoutParameter", obj, __jsb_cocos2d_ui_LayoutParameter_proto, _SE(js_cocos2dx_ui_LinearLayoutParameter_constructor));

    cls->defineFunction("setGravity", _SE(js_cocos2dx_ui_LinearLayoutParameter_setGravity));
    cls->defineFunction("getGravity", _SE(js_cocos2dx_ui_LinearLayoutParameter_getGravity));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_LinearLayoutParameter_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_LinearLayoutParameter_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::LinearLayoutParameter>(cls);

    __jsb_cocos2d_ui_LinearLayoutParameter_proto = cls->getProto();
    __jsb_cocos2d_ui_LinearLayoutParameter_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_RelativeLayoutParameter_proto = nullptr;
se::Class* __jsb_cocos2d_ui_RelativeLayoutParameter_class = nullptr;

static bool js_cocos2dx_ui_RelativeLayoutParameter_setAlign(se::State& s)
{
    cocos2d::ui::RelativeLayoutParameter* cobj = (cocos2d::ui::RelativeLayoutParameter*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RelativeLayoutParameter_setAlign : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::RelativeLayoutParameter::RelativeAlign arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RelativeLayoutParameter_setAlign : Error processing arguments");
        cobj->setAlign(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RelativeLayoutParameter_setAlign)

static bool js_cocos2dx_ui_RelativeLayoutParameter_setRelativeToWidgetName(se::State& s)
{
    cocos2d::ui::RelativeLayoutParameter* cobj = (cocos2d::ui::RelativeLayoutParameter*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RelativeLayoutParameter_setRelativeToWidgetName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RelativeLayoutParameter_setRelativeToWidgetName : Error processing arguments");
        cobj->setRelativeToWidgetName(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RelativeLayoutParameter_setRelativeToWidgetName)

static bool js_cocos2dx_ui_RelativeLayoutParameter_getRelativeName(se::State& s)
{
    cocos2d::ui::RelativeLayoutParameter* cobj = (cocos2d::ui::RelativeLayoutParameter*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RelativeLayoutParameter_getRelativeName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getRelativeName();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RelativeLayoutParameter_getRelativeName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RelativeLayoutParameter_getRelativeName)

static bool js_cocos2dx_ui_RelativeLayoutParameter_getRelativeToWidgetName(se::State& s)
{
    cocos2d::ui::RelativeLayoutParameter* cobj = (cocos2d::ui::RelativeLayoutParameter*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RelativeLayoutParameter_getRelativeToWidgetName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getRelativeToWidgetName();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RelativeLayoutParameter_getRelativeToWidgetName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RelativeLayoutParameter_getRelativeToWidgetName)

static bool js_cocos2dx_ui_RelativeLayoutParameter_setRelativeName(se::State& s)
{
    cocos2d::ui::RelativeLayoutParameter* cobj = (cocos2d::ui::RelativeLayoutParameter*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RelativeLayoutParameter_setRelativeName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RelativeLayoutParameter_setRelativeName : Error processing arguments");
        cobj->setRelativeName(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RelativeLayoutParameter_setRelativeName)

static bool js_cocos2dx_ui_RelativeLayoutParameter_getAlign(se::State& s)
{
    cocos2d::ui::RelativeLayoutParameter* cobj = (cocos2d::ui::RelativeLayoutParameter*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RelativeLayoutParameter_getAlign : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getAlign();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RelativeLayoutParameter_getAlign : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RelativeLayoutParameter_getAlign)

static bool js_cocos2dx_ui_RelativeLayoutParameter_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = cocos2d::ui::RelativeLayoutParameter::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_RelativeLayoutParameter_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RelativeLayoutParameter_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_RelativeLayoutParameter_finalize)

static bool js_cocos2dx_ui_RelativeLayoutParameter_constructor(se::State& s)
{
    cocos2d::ui::RelativeLayoutParameter* cobj = new (std::nothrow) cocos2d::ui::RelativeLayoutParameter();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_RelativeLayoutParameter_constructor, __jsb_cocos2d_ui_RelativeLayoutParameter_class, js_cocos2d_ui_RelativeLayoutParameter_finalize)



extern se::Object* __jsb_cocos2d_ui_LayoutParameter_proto;

static bool js_cocos2d_ui_RelativeLayoutParameter_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::RelativeLayoutParameter)", s.nativeThisObject());
    cocos2d::ui::RelativeLayoutParameter* cobj = (cocos2d::ui::RelativeLayoutParameter*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_RelativeLayoutParameter_finalize)

bool js_register_cocos2dx_ui_RelativeLayoutParameter(se::Object* obj)
{
    auto cls = se::Class::create("RelativeLayoutParameter", obj, __jsb_cocos2d_ui_LayoutParameter_proto, _SE(js_cocos2dx_ui_RelativeLayoutParameter_constructor));

    cls->defineFunction("setAlign", _SE(js_cocos2dx_ui_RelativeLayoutParameter_setAlign));
    cls->defineFunction("setRelativeToWidgetName", _SE(js_cocos2dx_ui_RelativeLayoutParameter_setRelativeToWidgetName));
    cls->defineFunction("getRelativeName", _SE(js_cocos2dx_ui_RelativeLayoutParameter_getRelativeName));
    cls->defineFunction("getRelativeToWidgetName", _SE(js_cocos2dx_ui_RelativeLayoutParameter_getRelativeToWidgetName));
    cls->defineFunction("setRelativeName", _SE(js_cocos2dx_ui_RelativeLayoutParameter_setRelativeName));
    cls->defineFunction("getAlign", _SE(js_cocos2dx_ui_RelativeLayoutParameter_getAlign));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_RelativeLayoutParameter_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_RelativeLayoutParameter_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::RelativeLayoutParameter>(cls);

    __jsb_cocos2d_ui_RelativeLayoutParameter_proto = cls->getProto();
    __jsb_cocos2d_ui_RelativeLayoutParameter_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_Widget_proto = nullptr;
se::Class* __jsb_cocos2d_ui_Widget_class = nullptr;

static bool js_cocos2dx_ui_Widget_setLayoutComponentEnabled(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setLayoutComponentEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setLayoutComponentEnabled : Error processing arguments");
        cobj->setLayoutComponentEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setLayoutComponentEnabled)

static bool js_cocos2dx_ui_Widget_setSizePercent(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setSizePercent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setSizePercent : Error processing arguments");
        cobj->setSizePercent(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setSizePercent)

static bool js_cocos2dx_ui_Widget_getCustomSize(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_getCustomSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Size& result = cobj->getCustomSize();
        ok &= Size_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getCustomSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getCustomSize)

static bool js_cocos2dx_ui_Widget_getLeftBoundary(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_getLeftBoundary : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getLeftBoundary();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getLeftBoundary : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getLeftBoundary)

static bool js_cocos2dx_ui_Widget_setFlippedX(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setFlippedX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setFlippedX : Error processing arguments");
        cobj->setFlippedX(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setFlippedX)

static bool js_cocos2dx_ui_Widget_setCallbackName(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setCallbackName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setCallbackName : Error processing arguments");
        cobj->setCallbackName(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setCallbackName)

static bool js_cocos2dx_ui_Widget_getVirtualRenderer(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_getVirtualRenderer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Node* result = cobj->getVirtualRenderer();
        ok &= native_ptr_to_seval<cocos2d::Node>((cocos2d::Node*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getVirtualRenderer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getVirtualRenderer)

static bool js_cocos2dx_ui_Widget_setPropagateTouchEvents(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setPropagateTouchEvents : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setPropagateTouchEvents : Error processing arguments");
        cobj->setPropagateTouchEvents(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setPropagateTouchEvents)

static bool js_cocos2dx_ui_Widget_isUnifySizeEnabled(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_isUnifySizeEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isUnifySizeEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_isUnifySizeEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_isUnifySizeEnabled)

static bool js_cocos2dx_ui_Widget_getSizePercent(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_getSizePercent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Vec2& result = cobj->getSizePercent();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getSizePercent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getSizePercent)

static bool js_cocos2dx_ui_Widget_setPositionPercent(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setPositionPercent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setPositionPercent : Error processing arguments");
        cobj->setPositionPercent(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setPositionPercent)

static bool js_cocos2dx_ui_Widget_setSwallowTouches(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setSwallowTouches : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setSwallowTouches : Error processing arguments");
        cobj->setSwallowTouches(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setSwallowTouches)

static bool js_cocos2dx_ui_Widget_getLayoutSize(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_getLayoutSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Size& result = cobj->getLayoutSize();
        ok &= Size_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getLayoutSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getLayoutSize)

static bool js_cocos2dx_ui_Widget_setHighlighted(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setHighlighted : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setHighlighted : Error processing arguments");
        cobj->setHighlighted(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setHighlighted)

static bool js_cocos2dx_ui_Widget_setPositionType(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setPositionType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::Widget::PositionType arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setPositionType : Error processing arguments");
        cobj->setPositionType(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setPositionType)

static bool js_cocos2dx_ui_Widget_isIgnoreContentAdaptWithSize(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_isIgnoreContentAdaptWithSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isIgnoreContentAdaptWithSize();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_isIgnoreContentAdaptWithSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_isIgnoreContentAdaptWithSize)

static bool js_cocos2dx_ui_Widget_getVirtualRendererSize(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_getVirtualRendererSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Size result = cobj->getVirtualRendererSize();
        ok &= Size_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getVirtualRendererSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getVirtualRendererSize)

static bool js_cocos2dx_ui_Widget_isHighlighted(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_isHighlighted : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isHighlighted();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_isHighlighted : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_isHighlighted)

static bool js_cocos2dx_ui_Widget_getLayoutParameter(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_getLayoutParameter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ui::LayoutParameter* result = cobj->getLayoutParameter();
        ok &= native_ptr_to_seval<cocos2d::ui::LayoutParameter>((cocos2d::ui::LayoutParameter*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getLayoutParameter : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getLayoutParameter)

static bool js_cocos2dx_ui_Widget_addCCSEventListener(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_addCCSEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (cocos2d::Ref *, int)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachChild(jsFunc.toObject());
                auto lambda = [=](cocos2d::Ref* larg0, int larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= native_ptr_to_seval<cocos2d::Ref>((cocos2d::Ref*)larg0, &args[0]);
                    ok &= int32_to_seval(larg1, &args[1]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_addCCSEventListener : Error processing arguments");
        cobj->addCCSEventListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_addCCSEventListener)

static bool js_cocos2dx_ui_Widget_getPositionType(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_getPositionType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getPositionType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getPositionType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getPositionType)

static bool js_cocos2dx_ui_Widget_getTopBoundary(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_getTopBoundary : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTopBoundary();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getTopBoundary : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getTopBoundary)

static bool js_cocos2dx_ui_Widget_ignoreContentAdaptWithSize(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_ignoreContentAdaptWithSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_ignoreContentAdaptWithSize : Error processing arguments");
        cobj->ignoreContentAdaptWithSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_ignoreContentAdaptWithSize)

static bool js_cocos2dx_ui_Widget_findNextFocusedWidget(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_findNextFocusedWidget : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::ui::Widget::FocusDirection arg0;
        cocos2d::ui::Widget* arg1 = nullptr;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_findNextFocusedWidget : Error processing arguments");
        cocos2d::ui::Widget* result = cobj->findNextFocusedWidget(arg0, arg1);
        ok &= native_ptr_to_seval<cocos2d::ui::Widget>((cocos2d::ui::Widget*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_findNextFocusedWidget : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_findNextFocusedWidget)

static bool js_cocos2dx_ui_Widget_isEnabled(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_isEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_isEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_isEnabled)

static bool js_cocos2dx_ui_Widget_isFocused(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_isFocused : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isFocused();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_isFocused : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_isFocused)

static bool js_cocos2dx_ui_Widget_getTouchBeganPosition(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_getTouchBeganPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Vec2& result = cobj->getTouchBeganPosition();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getTouchBeganPosition : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getTouchBeganPosition)

static bool js_cocos2dx_ui_Widget_isTouchEnabled(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_isTouchEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isTouchEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_isTouchEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_isTouchEnabled)

static bool js_cocos2dx_ui_Widget_getCallbackName(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_getCallbackName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getCallbackName();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getCallbackName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getCallbackName)

static bool js_cocos2dx_ui_Widget_getActionTag(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_getActionTag : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getActionTag();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getActionTag : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getActionTag)

static bool js_cocos2dx_ui_Widget_getWorldPosition(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_getWorldPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Vec2 result = cobj->getWorldPosition();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getWorldPosition : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getWorldPosition)

static bool js_cocos2dx_ui_Widget_isFocusEnabled(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_isFocusEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isFocusEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_isFocusEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_isFocusEnabled)

static bool js_cocos2dx_ui_Widget_setFocused(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setFocused : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setFocused : Error processing arguments");
        cobj->setFocused(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setFocused)

static bool js_cocos2dx_ui_Widget_setActionTag(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setActionTag : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setActionTag : Error processing arguments");
        cobj->setActionTag(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setActionTag)

static bool js_cocos2dx_ui_Widget_setTouchEnabled(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setTouchEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setTouchEnabled : Error processing arguments");
        cobj->setTouchEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setTouchEnabled)

static bool js_cocos2dx_ui_Widget_setFlippedY(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setFlippedY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setFlippedY : Error processing arguments");
        cobj->setFlippedY(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setFlippedY)

static bool js_cocos2dx_ui_Widget_init(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->init();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_init : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_init)

static bool js_cocos2dx_ui_Widget_setEnabled(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setEnabled : Error processing arguments");
        cobj->setEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setEnabled)

static bool js_cocos2dx_ui_Widget_getRightBoundary(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_getRightBoundary : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRightBoundary();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getRightBoundary : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getRightBoundary)

static bool js_cocos2dx_ui_Widget_setBrightStyle(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setBrightStyle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::Widget::BrightStyle arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setBrightStyle : Error processing arguments");
        cobj->setBrightStyle(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setBrightStyle)

static bool js_cocos2dx_ui_Widget_setLayoutParameter(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setLayoutParameter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::LayoutParameter* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setLayoutParameter : Error processing arguments");
        cobj->setLayoutParameter(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setLayoutParameter)

static bool js_cocos2dx_ui_Widget_clone(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_clone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ui::Widget* result = cobj->clone();
        ok &= native_ptr_to_seval<cocos2d::ui::Widget>((cocos2d::ui::Widget*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_clone : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_clone)

static bool js_cocos2dx_ui_Widget_setFocusEnabled(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setFocusEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setFocusEnabled : Error processing arguments");
        cobj->setFocusEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setFocusEnabled)

static bool js_cocos2dx_ui_Widget_getBottomBoundary(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_getBottomBoundary : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getBottomBoundary();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getBottomBoundary : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getBottomBoundary)

static bool js_cocos2dx_ui_Widget_isBright(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_isBright : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isBright();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_isBright : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_isBright)

static bool js_cocos2dx_ui_Widget_dispatchFocusEvent(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_dispatchFocusEvent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::ui::Widget* arg0 = nullptr;
        cocos2d::ui::Widget* arg1 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_dispatchFocusEvent : Error processing arguments");
        cobj->dispatchFocusEvent(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_dispatchFocusEvent)

static bool js_cocos2dx_ui_Widget_setUnifySizeEnabled(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setUnifySizeEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setUnifySizeEnabled : Error processing arguments");
        cobj->setUnifySizeEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setUnifySizeEnabled)

static bool js_cocos2dx_ui_Widget_isPropagateTouchEvents(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_isPropagateTouchEvents : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isPropagateTouchEvents();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_isPropagateTouchEvents : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_isPropagateTouchEvents)

static bool js_cocos2dx_ui_Widget_hitTest(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_hitTest : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_hitTest : Error processing arguments");
        bool result = cobj->hitTest(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_hitTest : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_hitTest)

static bool js_cocos2dx_ui_Widget_isLayoutComponentEnabled(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_isLayoutComponentEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isLayoutComponentEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_isLayoutComponentEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_isLayoutComponentEnabled)

static bool js_cocos2dx_ui_Widget_requestFocus(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_requestFocus : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->requestFocus();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_requestFocus)

static bool js_cocos2dx_ui_Widget_updateSizeAndPosition(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ui_Widget_updateSizeAndPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            cocos2d::Size arg0;
            ok &= seval_to_Size(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cobj->updateSizeAndPosition(arg0);
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            cobj->updateSizeAndPosition();
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_updateSizeAndPosition)

static bool js_cocos2dx_ui_Widget_onFocusChange(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_onFocusChange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::ui::Widget* arg0 = nullptr;
        cocos2d::ui::Widget* arg1 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_onFocusChange : Error processing arguments");
        cobj->onFocusChange(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_onFocusChange)

static bool js_cocos2dx_ui_Widget_getTouchMovePosition(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_getTouchMovePosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Vec2& result = cobj->getTouchMovePosition();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getTouchMovePosition : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getTouchMovePosition)

static bool js_cocos2dx_ui_Widget_getSizeType(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_getSizeType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getSizeType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getSizeType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getSizeType)

static bool js_cocos2dx_ui_Widget_getCallbackType(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_getCallbackType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getCallbackType();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getCallbackType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getCallbackType)

static bool js_cocos2dx_ui_Widget_addTouchEventListener(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_addTouchEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (cocos2d::Ref *, cocos2d::ui::Widget::TouchEventType)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachChild(jsFunc.toObject());
                auto lambda = [=](cocos2d::Ref* larg0, cocos2d::ui::Widget::TouchEventType larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= native_ptr_to_seval<cocos2d::Ref>((cocos2d::Ref*)larg0, &args[0]);
                    ok &= int32_to_seval((int32_t)larg1, &args[1]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_addTouchEventListener : Error processing arguments");
        cobj->addTouchEventListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_addTouchEventListener)

static bool js_cocos2dx_ui_Widget_getTouchEndPosition(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_getTouchEndPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Vec2& result = cobj->getTouchEndPosition();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getTouchEndPosition : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getTouchEndPosition)

static bool js_cocos2dx_ui_Widget_getPositionPercent(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_getPositionPercent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Vec2& result = cobj->getPositionPercent();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getPositionPercent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getPositionPercent)

static bool js_cocos2dx_ui_Widget_propagateTouchEvent(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_propagateTouchEvent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::ui::Widget::TouchEventType arg0;
        cocos2d::ui::Widget* arg1 = nullptr;
        cocos2d::Touch* arg2 = nullptr;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_native_ptr(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_propagateTouchEvent : Error processing arguments");
        cobj->propagateTouchEvent(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_propagateTouchEvent)

static bool js_cocos2dx_ui_Widget_addClickEventListener(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_addClickEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (cocos2d::Ref *)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachChild(jsFunc.toObject());
                auto lambda = [=](cocos2d::Ref* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= native_ptr_to_seval<cocos2d::Ref>((cocos2d::Ref*)larg0, &args[0]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_addClickEventListener : Error processing arguments");
        cobj->addClickEventListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_addClickEventListener)

static bool js_cocos2dx_ui_Widget_isFlippedX(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_isFlippedX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isFlippedX();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_isFlippedX : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_isFlippedX)

static bool js_cocos2dx_ui_Widget_isFlippedY(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_isFlippedY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isFlippedY();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_isFlippedY : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_isFlippedY)

static bool js_cocos2dx_ui_Widget_isClippingParentContainsPoint(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_isClippingParentContainsPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_isClippingParentContainsPoint : Error processing arguments");
        bool result = cobj->isClippingParentContainsPoint(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_isClippingParentContainsPoint : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_isClippingParentContainsPoint)

static bool js_cocos2dx_ui_Widget_setSizeType(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setSizeType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::Widget::SizeType arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setSizeType : Error processing arguments");
        cobj->setSizeType(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setSizeType)

static bool js_cocos2dx_ui_Widget_interceptTouchEvent(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_interceptTouchEvent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::ui::Widget::TouchEventType arg0;
        cocos2d::ui::Widget* arg1 = nullptr;
        cocos2d::Touch* arg2 = nullptr;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_native_ptr(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_interceptTouchEvent : Error processing arguments");
        cobj->interceptTouchEvent(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_interceptTouchEvent)

static bool js_cocos2dx_ui_Widget_setBright(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setBright : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setBright : Error processing arguments");
        cobj->setBright(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setBright)

static bool js_cocos2dx_ui_Widget_setCallbackType(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_setCallbackType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_setCallbackType : Error processing arguments");
        cobj->setCallbackType(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_setCallbackType)

static bool js_cocos2dx_ui_Widget_isSwallowTouches(se::State& s)
{
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Widget_isSwallowTouches : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isSwallowTouches();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_isSwallowTouches : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_isSwallowTouches)

static bool js_cocos2dx_ui_Widget_enableDpadNavigation(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_enableDpadNavigation : Error processing arguments");
        cocos2d::ui::Widget::enableDpadNavigation(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_enableDpadNavigation)

static bool js_cocos2dx_ui_Widget_getCurrentFocusedWidget(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ui::Widget* result = cocos2d::ui::Widget::getCurrentFocusedWidget();
        ok &= native_ptr_to_seval<cocos2d::ui::Widget>((cocos2d::ui::Widget*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Widget_getCurrentFocusedWidget : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_getCurrentFocusedWidget)

static bool js_cocos2dx_ui_Widget_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = cocos2d::ui::Widget::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_Widget_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Widget_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_Widget_finalize)

static bool js_cocos2dx_ui_Widget_constructor(se::State& s)
{
    cocos2d::ui::Widget* cobj = new (std::nothrow) cocos2d::ui::Widget();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_Widget_constructor, __jsb_cocos2d_ui_Widget_class, js_cocos2d_ui_Widget_finalize)

static bool js_cocos2dx_ui_Widget_ctor(se::State& s)
{
    cocos2d::ui::Widget* cobj = new (std::nothrow) cocos2d::ui::Widget();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_Widget_ctor, __jsb_cocos2d_ui_Widget_class, js_cocos2d_ui_Widget_finalize)


    

extern se::Object* __jsb_cocos2d_ProtectedNode_proto;

static bool js_cocos2d_ui_Widget_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::Widget)", s.nativeThisObject());
    cocos2d::ui::Widget* cobj = (cocos2d::ui::Widget*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_Widget_finalize)

bool js_register_cocos2dx_ui_Widget(se::Object* obj)
{
    auto cls = se::Class::create("Widget", obj, __jsb_cocos2d_ProtectedNode_proto, _SE(js_cocos2dx_ui_Widget_constructor));

    cls->defineFunction("setLayoutComponentEnabled", _SE(js_cocos2dx_ui_Widget_setLayoutComponentEnabled));
    cls->defineFunction("setSizePercent", _SE(js_cocos2dx_ui_Widget_setSizePercent));
    cls->defineFunction("getCustomSize", _SE(js_cocos2dx_ui_Widget_getCustomSize));
    cls->defineFunction("getLeftBoundary", _SE(js_cocos2dx_ui_Widget_getLeftBoundary));
    cls->defineFunction("setFlippedX", _SE(js_cocos2dx_ui_Widget_setFlippedX));
    cls->defineFunction("setCallbackName", _SE(js_cocos2dx_ui_Widget_setCallbackName));
    cls->defineFunction("getVirtualRenderer", _SE(js_cocos2dx_ui_Widget_getVirtualRenderer));
    cls->defineFunction("setPropagateTouchEvents", _SE(js_cocos2dx_ui_Widget_setPropagateTouchEvents));
    cls->defineFunction("isUnifySizeEnabled", _SE(js_cocos2dx_ui_Widget_isUnifySizeEnabled));
    cls->defineFunction("getSizePercent", _SE(js_cocos2dx_ui_Widget_getSizePercent));
    cls->defineFunction("setPositionPercent", _SE(js_cocos2dx_ui_Widget_setPositionPercent));
    cls->defineFunction("setSwallowTouches", _SE(js_cocos2dx_ui_Widget_setSwallowTouches));
    cls->defineFunction("getLayoutSize", _SE(js_cocos2dx_ui_Widget_getLayoutSize));
    cls->defineFunction("setHighlighted", _SE(js_cocos2dx_ui_Widget_setHighlighted));
    cls->defineFunction("setPositionType", _SE(js_cocos2dx_ui_Widget_setPositionType));
    cls->defineFunction("isIgnoreContentAdaptWithSize", _SE(js_cocos2dx_ui_Widget_isIgnoreContentAdaptWithSize));
    cls->defineFunction("getVirtualRendererSize", _SE(js_cocos2dx_ui_Widget_getVirtualRendererSize));
    cls->defineFunction("isHighlighted", _SE(js_cocos2dx_ui_Widget_isHighlighted));
    cls->defineFunction("getLayoutParameter", _SE(js_cocos2dx_ui_Widget_getLayoutParameter));
    cls->defineFunction("addCCSEventListener", _SE(js_cocos2dx_ui_Widget_addCCSEventListener));
    cls->defineFunction("getPositionType", _SE(js_cocos2dx_ui_Widget_getPositionType));
    cls->defineFunction("getTopBoundary", _SE(js_cocos2dx_ui_Widget_getTopBoundary));
    cls->defineFunction("ignoreContentAdaptWithSize", _SE(js_cocos2dx_ui_Widget_ignoreContentAdaptWithSize));
    cls->defineFunction("findNextFocusedWidget", _SE(js_cocos2dx_ui_Widget_findNextFocusedWidget));
    cls->defineFunction("isEnabled", _SE(js_cocos2dx_ui_Widget_isEnabled));
    cls->defineFunction("isFocused", _SE(js_cocos2dx_ui_Widget_isFocused));
    cls->defineFunction("getTouchBeganPosition", _SE(js_cocos2dx_ui_Widget_getTouchBeganPosition));
    cls->defineFunction("isTouchEnabled", _SE(js_cocos2dx_ui_Widget_isTouchEnabled));
    cls->defineFunction("getCallbackName", _SE(js_cocos2dx_ui_Widget_getCallbackName));
    cls->defineFunction("getActionTag", _SE(js_cocos2dx_ui_Widget_getActionTag));
    cls->defineFunction("getWorldPosition", _SE(js_cocos2dx_ui_Widget_getWorldPosition));
    cls->defineFunction("isFocusEnabled", _SE(js_cocos2dx_ui_Widget_isFocusEnabled));
    cls->defineFunction("setFocused", _SE(js_cocos2dx_ui_Widget_setFocused));
    cls->defineFunction("setActionTag", _SE(js_cocos2dx_ui_Widget_setActionTag));
    cls->defineFunction("setTouchEnabled", _SE(js_cocos2dx_ui_Widget_setTouchEnabled));
    cls->defineFunction("setFlippedY", _SE(js_cocos2dx_ui_Widget_setFlippedY));
    cls->defineFunction("_init", _SE(js_cocos2dx_ui_Widget_init));
    cls->defineFunction("setEnabled", _SE(js_cocos2dx_ui_Widget_setEnabled));
    cls->defineFunction("getRightBoundary", _SE(js_cocos2dx_ui_Widget_getRightBoundary));
    cls->defineFunction("setBrightStyle", _SE(js_cocos2dx_ui_Widget_setBrightStyle));
    cls->defineFunction("setLayoutParameter", _SE(js_cocos2dx_ui_Widget_setLayoutParameter));
    cls->defineFunction("clone", _SE(js_cocos2dx_ui_Widget_clone));
    cls->defineFunction("setFocusEnabled", _SE(js_cocos2dx_ui_Widget_setFocusEnabled));
    cls->defineFunction("getBottomBoundary", _SE(js_cocos2dx_ui_Widget_getBottomBoundary));
    cls->defineFunction("isBright", _SE(js_cocos2dx_ui_Widget_isBright));
    cls->defineFunction("dispatchFocusEvent", _SE(js_cocos2dx_ui_Widget_dispatchFocusEvent));
    cls->defineFunction("setUnifySizeEnabled", _SE(js_cocos2dx_ui_Widget_setUnifySizeEnabled));
    cls->defineFunction("isPropagateTouchEvents", _SE(js_cocos2dx_ui_Widget_isPropagateTouchEvents));
    cls->defineFunction("hitTest", _SE(js_cocos2dx_ui_Widget_hitTest));
    cls->defineFunction("isLayoutComponentEnabled", _SE(js_cocos2dx_ui_Widget_isLayoutComponentEnabled));
    cls->defineFunction("requestFocus", _SE(js_cocos2dx_ui_Widget_requestFocus));
    cls->defineFunction("updateSizeAndPosition", _SE(js_cocos2dx_ui_Widget_updateSizeAndPosition));
    cls->defineFunction("onFocusChange", _SE(js_cocos2dx_ui_Widget_onFocusChange));
    cls->defineFunction("getTouchMovePosition", _SE(js_cocos2dx_ui_Widget_getTouchMovePosition));
    cls->defineFunction("getSizeType", _SE(js_cocos2dx_ui_Widget_getSizeType));
    cls->defineFunction("getCallbackType", _SE(js_cocos2dx_ui_Widget_getCallbackType));
    cls->defineFunction("addTouchEventListener", _SE(js_cocos2dx_ui_Widget_addTouchEventListener));
    cls->defineFunction("getTouchEndPosition", _SE(js_cocos2dx_ui_Widget_getTouchEndPosition));
    cls->defineFunction("getPositionPercent", _SE(js_cocos2dx_ui_Widget_getPositionPercent));
    cls->defineFunction("propagateTouchEvent", _SE(js_cocos2dx_ui_Widget_propagateTouchEvent));
    cls->defineFunction("addClickEventListener", _SE(js_cocos2dx_ui_Widget_addClickEventListener));
    cls->defineFunction("isFlippedX", _SE(js_cocos2dx_ui_Widget_isFlippedX));
    cls->defineFunction("isFlippedY", _SE(js_cocos2dx_ui_Widget_isFlippedY));
    cls->defineFunction("isClippingParentContainsPoint", _SE(js_cocos2dx_ui_Widget_isClippingParentContainsPoint));
    cls->defineFunction("setSizeType", _SE(js_cocos2dx_ui_Widget_setSizeType));
    cls->defineFunction("interceptTouchEvent", _SE(js_cocos2dx_ui_Widget_interceptTouchEvent));
    cls->defineFunction("setBright", _SE(js_cocos2dx_ui_Widget_setBright));
    cls->defineFunction("setCallbackType", _SE(js_cocos2dx_ui_Widget_setCallbackType));
    cls->defineFunction("isSwallowTouches", _SE(js_cocos2dx_ui_Widget_isSwallowTouches));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_Widget_ctor));
    cls->defineStaticFunction("enableDpadNavigation", _SE(js_cocos2dx_ui_Widget_enableDpadNavigation));
    cls->defineStaticFunction("getCurrentFocusedWidget", _SE(js_cocos2dx_ui_Widget_getCurrentFocusedWidget));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_Widget_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_Widget_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::Widget>(cls);

    __jsb_cocos2d_ui_Widget_proto = cls->getProto();
    __jsb_cocos2d_ui_Widget_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.Widget.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_Layout_proto = nullptr;
se::Class* __jsb_cocos2d_ui_Layout_class = nullptr;

static bool js_cocos2dx_ui_Layout_setBackGroundColorVector(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_setBackGroundColorVector : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_setBackGroundColorVector : Error processing arguments");
        cobj->setBackGroundColorVector(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_setBackGroundColorVector)

static bool js_cocos2dx_ui_Layout_setClippingType(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_setClippingType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::Layout::ClippingType arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_setClippingType : Error processing arguments");
        cobj->setClippingType(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_setClippingType)

static bool js_cocos2dx_ui_Layout_setBackGroundColorType(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_setBackGroundColorType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::Layout::BackGroundColorType arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_setBackGroundColorType : Error processing arguments");
        cobj->setBackGroundColorType(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_setBackGroundColorType)

static bool js_cocos2dx_ui_Layout_setLoopFocus(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_setLoopFocus : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_setLoopFocus : Error processing arguments");
        cobj->setLoopFocus(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_setLoopFocus)

static bool js_cocos2dx_ui_Layout_setBackGroundImageColor(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_setBackGroundImageColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Color3B arg0;
        ok &= seval_to_Color3B(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_setBackGroundImageColor : Error processing arguments");
        cobj->setBackGroundImageColor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_setBackGroundImageColor)

static bool js_cocos2dx_ui_Layout_getBackGroundColorVector(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_getBackGroundColorVector : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Vec2& result = cobj->getBackGroundColorVector();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_getBackGroundColorVector : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_getBackGroundColorVector)

static bool js_cocos2dx_ui_Layout_getClippingType(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_getClippingType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getClippingType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_getClippingType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_getClippingType)

static bool js_cocos2dx_ui_Layout_getRenderFile(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_getRenderFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ResourceData result = cobj->getRenderFile();
        ok &= ResourceData_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_getRenderFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_getRenderFile)

static bool js_cocos2dx_ui_Layout_isLoopFocus(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_isLoopFocus : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isLoopFocus();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_isLoopFocus : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_isLoopFocus)

static bool js_cocos2dx_ui_Layout_removeBackGroundImage(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_removeBackGroundImage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->removeBackGroundImage();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_removeBackGroundImage)

static bool js_cocos2dx_ui_Layout_getBackGroundColorOpacity(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_getBackGroundColorOpacity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uint8_t result = cobj->getBackGroundColorOpacity();
        ok &= uint8_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_getBackGroundColorOpacity : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_getBackGroundColorOpacity)

static bool js_cocos2dx_ui_Layout_isClippingEnabled(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_isClippingEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isClippingEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_isClippingEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_isClippingEnabled)

static bool js_cocos2dx_ui_Layout_setBackGroundImageOpacity(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_setBackGroundImageOpacity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        uint8_t arg0;
        ok &= seval_to_uint8(args[0], (uint8_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_setBackGroundImageOpacity : Error processing arguments");
        cobj->setBackGroundImageOpacity(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_setBackGroundImageOpacity)

static bool js_cocos2dx_ui_Layout_setBackGroundImage(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_setBackGroundImage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_setBackGroundImage : Error processing arguments");
        cobj->setBackGroundImage(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        cocos2d::ui::Widget::TextureResType arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_setBackGroundImage : Error processing arguments");
        cobj->setBackGroundImage(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_setBackGroundImage)

static bool js_cocos2dx_ui_Layout_setBackGroundColor(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ui_Layout_setBackGroundColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            cocos2d::Color3B arg0;
            ok &= seval_to_Color3B(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Color3B arg1;
            ok &= seval_to_Color3B(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cobj->setBackGroundColor(arg0, arg1);
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            cocos2d::Color3B arg0;
            ok &= seval_to_Color3B(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cobj->setBackGroundColor(arg0);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_setBackGroundColor)

static bool js_cocos2dx_ui_Layout_requestDoLayout(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_requestDoLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->requestDoLayout();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_requestDoLayout)

static bool js_cocos2dx_ui_Layout_getBackGroundImageCapInsets(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_getBackGroundImageCapInsets : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Rect& result = cobj->getBackGroundImageCapInsets();
        ok &= Rect_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_getBackGroundImageCapInsets : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_getBackGroundImageCapInsets)

static bool js_cocos2dx_ui_Layout_getBackGroundColor(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_getBackGroundColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Color3B& result = cobj->getBackGroundColor();
        ok &= Color3B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_getBackGroundColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_getBackGroundColor)

static bool js_cocos2dx_ui_Layout_setClippingEnabled(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_setClippingEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_setClippingEnabled : Error processing arguments");
        cobj->setClippingEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_setClippingEnabled)

static bool js_cocos2dx_ui_Layout_getBackGroundImageColor(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_getBackGroundImageColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Color3B& result = cobj->getBackGroundImageColor();
        ok &= Color3B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_getBackGroundImageColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_getBackGroundImageColor)

static bool js_cocos2dx_ui_Layout_isBackGroundImageScale9Enabled(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_isBackGroundImageScale9Enabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isBackGroundImageScale9Enabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_isBackGroundImageScale9Enabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_isBackGroundImageScale9Enabled)

static bool js_cocos2dx_ui_Layout_getBackGroundColorType(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_getBackGroundColorType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getBackGroundColorType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_getBackGroundColorType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_getBackGroundColorType)

static bool js_cocos2dx_ui_Layout_getBackGroundEndColor(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_getBackGroundEndColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Color3B& result = cobj->getBackGroundEndColor();
        ok &= Color3B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_getBackGroundEndColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_getBackGroundEndColor)

static bool js_cocos2dx_ui_Layout_setBackGroundColorOpacity(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_setBackGroundColorOpacity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        uint8_t arg0;
        ok &= seval_to_uint8(args[0], (uint8_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_setBackGroundColorOpacity : Error processing arguments");
        cobj->setBackGroundColorOpacity(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_setBackGroundColorOpacity)

static bool js_cocos2dx_ui_Layout_getBackGroundImageOpacity(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_getBackGroundImageOpacity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uint8_t result = cobj->getBackGroundImageOpacity();
        ok &= uint8_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_getBackGroundImageOpacity : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_getBackGroundImageOpacity)

static bool js_cocos2dx_ui_Layout_isPassFocusToChild(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_isPassFocusToChild : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isPassFocusToChild();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_isPassFocusToChild : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_isPassFocusToChild)

static bool js_cocos2dx_ui_Layout_setBackGroundImageCapInsets(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_setBackGroundImageCapInsets : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Rect arg0;
        ok &= seval_to_Rect(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_setBackGroundImageCapInsets : Error processing arguments");
        cobj->setBackGroundImageCapInsets(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_setBackGroundImageCapInsets)

static bool js_cocos2dx_ui_Layout_getBackGroundImageTextureSize(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_getBackGroundImageTextureSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Size& result = cobj->getBackGroundImageTextureSize();
        ok &= Size_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_getBackGroundImageTextureSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_getBackGroundImageTextureSize)

static bool js_cocos2dx_ui_Layout_forceDoLayout(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_forceDoLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->forceDoLayout();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_forceDoLayout)

static bool js_cocos2dx_ui_Layout_getLayoutType(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_getLayoutType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getLayoutType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_getLayoutType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_getLayoutType)

static bool js_cocos2dx_ui_Layout_setPassFocusToChild(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_setPassFocusToChild : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_setPassFocusToChild : Error processing arguments");
        cobj->setPassFocusToChild(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_setPassFocusToChild)

static bool js_cocos2dx_ui_Layout_getBackGroundStartColor(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_getBackGroundStartColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Color3B& result = cobj->getBackGroundStartColor();
        ok &= Color3B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_getBackGroundStartColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_getBackGroundStartColor)

static bool js_cocos2dx_ui_Layout_setBackGroundImageScale9Enabled(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_setBackGroundImageScale9Enabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_setBackGroundImageScale9Enabled : Error processing arguments");
        cobj->setBackGroundImageScale9Enabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_setBackGroundImageScale9Enabled)

static bool js_cocos2dx_ui_Layout_setLayoutType(se::State& s)
{
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Layout_setLayoutType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::Layout::Type arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Layout_setLayoutType : Error processing arguments");
        cobj->setLayoutType(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_setLayoutType)

static bool js_cocos2dx_ui_Layout_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = cocos2d::ui::Layout::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_Layout_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Layout_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_Layout_finalize)

static bool js_cocos2dx_ui_Layout_constructor(se::State& s)
{
    cocos2d::ui::Layout* cobj = new (std::nothrow) cocos2d::ui::Layout();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_Layout_constructor, __jsb_cocos2d_ui_Layout_class, js_cocos2d_ui_Layout_finalize)

static bool js_cocos2dx_ui_Layout_ctor(se::State& s)
{
    cocos2d::ui::Layout* cobj = new (std::nothrow) cocos2d::ui::Layout();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_Layout_ctor, __jsb_cocos2d_ui_Layout_class, js_cocos2d_ui_Layout_finalize)


    

extern se::Object* __jsb_cocos2d_ui_Widget_proto;

static bool js_cocos2d_ui_Layout_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::Layout)", s.nativeThisObject());
    cocos2d::ui::Layout* cobj = (cocos2d::ui::Layout*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_Layout_finalize)

bool js_register_cocos2dx_ui_Layout(se::Object* obj)
{
    auto cls = se::Class::create("Layout", obj, __jsb_cocos2d_ui_Widget_proto, _SE(js_cocos2dx_ui_Layout_constructor));

    cls->defineFunction("setBackGroundColorVector", _SE(js_cocos2dx_ui_Layout_setBackGroundColorVector));
    cls->defineFunction("setClippingType", _SE(js_cocos2dx_ui_Layout_setClippingType));
    cls->defineFunction("setBackGroundColorType", _SE(js_cocos2dx_ui_Layout_setBackGroundColorType));
    cls->defineFunction("setLoopFocus", _SE(js_cocos2dx_ui_Layout_setLoopFocus));
    cls->defineFunction("setBackGroundImageColor", _SE(js_cocos2dx_ui_Layout_setBackGroundImageColor));
    cls->defineFunction("getBackGroundColorVector", _SE(js_cocos2dx_ui_Layout_getBackGroundColorVector));
    cls->defineFunction("getClippingType", _SE(js_cocos2dx_ui_Layout_getClippingType));
    cls->defineFunction("getRenderFile", _SE(js_cocos2dx_ui_Layout_getRenderFile));
    cls->defineFunction("isLoopFocus", _SE(js_cocos2dx_ui_Layout_isLoopFocus));
    cls->defineFunction("removeBackGroundImage", _SE(js_cocos2dx_ui_Layout_removeBackGroundImage));
    cls->defineFunction("getBackGroundColorOpacity", _SE(js_cocos2dx_ui_Layout_getBackGroundColorOpacity));
    cls->defineFunction("isClippingEnabled", _SE(js_cocos2dx_ui_Layout_isClippingEnabled));
    cls->defineFunction("setBackGroundImageOpacity", _SE(js_cocos2dx_ui_Layout_setBackGroundImageOpacity));
    cls->defineFunction("setBackGroundImage", _SE(js_cocos2dx_ui_Layout_setBackGroundImage));
    cls->defineFunction("setBackGroundColor", _SE(js_cocos2dx_ui_Layout_setBackGroundColor));
    cls->defineFunction("requestDoLayout", _SE(js_cocos2dx_ui_Layout_requestDoLayout));
    cls->defineFunction("getBackGroundImageCapInsets", _SE(js_cocos2dx_ui_Layout_getBackGroundImageCapInsets));
    cls->defineFunction("getBackGroundColor", _SE(js_cocos2dx_ui_Layout_getBackGroundColor));
    cls->defineFunction("setClippingEnabled", _SE(js_cocos2dx_ui_Layout_setClippingEnabled));
    cls->defineFunction("getBackGroundImageColor", _SE(js_cocos2dx_ui_Layout_getBackGroundImageColor));
    cls->defineFunction("isBackGroundImageScale9Enabled", _SE(js_cocos2dx_ui_Layout_isBackGroundImageScale9Enabled));
    cls->defineFunction("getBackGroundColorType", _SE(js_cocos2dx_ui_Layout_getBackGroundColorType));
    cls->defineFunction("getBackGroundEndColor", _SE(js_cocos2dx_ui_Layout_getBackGroundEndColor));
    cls->defineFunction("setBackGroundColorOpacity", _SE(js_cocos2dx_ui_Layout_setBackGroundColorOpacity));
    cls->defineFunction("getBackGroundImageOpacity", _SE(js_cocos2dx_ui_Layout_getBackGroundImageOpacity));
    cls->defineFunction("isPassFocusToChild", _SE(js_cocos2dx_ui_Layout_isPassFocusToChild));
    cls->defineFunction("setBackGroundImageCapInsets", _SE(js_cocos2dx_ui_Layout_setBackGroundImageCapInsets));
    cls->defineFunction("getBackGroundImageTextureSize", _SE(js_cocos2dx_ui_Layout_getBackGroundImageTextureSize));
    cls->defineFunction("forceDoLayout", _SE(js_cocos2dx_ui_Layout_forceDoLayout));
    cls->defineFunction("getLayoutType", _SE(js_cocos2dx_ui_Layout_getLayoutType));
    cls->defineFunction("setPassFocusToChild", _SE(js_cocos2dx_ui_Layout_setPassFocusToChild));
    cls->defineFunction("getBackGroundStartColor", _SE(js_cocos2dx_ui_Layout_getBackGroundStartColor));
    cls->defineFunction("setBackGroundImageScale9Enabled", _SE(js_cocos2dx_ui_Layout_setBackGroundImageScale9Enabled));
    cls->defineFunction("setLayoutType", _SE(js_cocos2dx_ui_Layout_setLayoutType));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_Layout_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_Layout_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_Layout_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::Layout>(cls);

    __jsb_cocos2d_ui_Layout_proto = cls->getProto();
    __jsb_cocos2d_ui_Layout_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.Layout.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_Button_proto = nullptr;
se::Class* __jsb_cocos2d_ui_Button_class = nullptr;

static bool js_cocos2dx_ui_Button_getNormalTextureSize(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_getNormalTextureSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Size result = cobj->getNormalTextureSize();
        ok &= Size_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_getNormalTextureSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_getNormalTextureSize)

static bool js_cocos2dx_ui_Button_getTitleText(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_getTitleText : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getTitleText();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_getTitleText : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_getTitleText)

static bool js_cocos2dx_ui_Button_setTitleFontSize(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_setTitleFontSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_setTitleFontSize : Error processing arguments");
        cobj->setTitleFontSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_setTitleFontSize)

static bool js_cocos2dx_ui_Button_resetPressedRender(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_resetPressedRender : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->resetPressedRender();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_resetPressedRender)

static bool js_cocos2dx_ui_Button_setScale9Enabled(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_setScale9Enabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_setScale9Enabled : Error processing arguments");
        cobj->setScale9Enabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_setScale9Enabled)

static bool js_cocos2dx_ui_Button_resetDisabledRender(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_resetDisabledRender : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->resetDisabledRender();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_resetDisabledRender)

static bool js_cocos2dx_ui_Button_getTitleRenderer(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_getTitleRenderer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Label* result = cobj->getTitleRenderer();
        ok &= native_ptr_to_seval<cocos2d::Label>((cocos2d::Label*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_getTitleRenderer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_getTitleRenderer)

static bool js_cocos2dx_ui_Button_getRendererClicked(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_getRendererClicked : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ui::Scale9Sprite* result = cobj->getRendererClicked();
        ok &= native_ptr_to_seval<cocos2d::ui::Scale9Sprite>((cocos2d::ui::Scale9Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_getRendererClicked : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_getRendererClicked)

static bool js_cocos2dx_ui_Button_getDisabledFile(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_getDisabledFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ResourceData result = cobj->getDisabledFile();
        ok &= ResourceData_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_getDisabledFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_getDisabledFile)

static bool js_cocos2dx_ui_Button_getZoomScale(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_getZoomScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getZoomScale();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_getZoomScale : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_getZoomScale)

static bool js_cocos2dx_ui_Button_getCapInsetsDisabledRenderer(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_getCapInsetsDisabledRenderer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Rect& result = cobj->getCapInsetsDisabledRenderer();
        ok &= Rect_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_getCapInsetsDisabledRenderer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_getCapInsetsDisabledRenderer)

static bool js_cocos2dx_ui_Button_setTitleColor(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_setTitleColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Color3B arg0;
        ok &= seval_to_Color3B(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_setTitleColor : Error processing arguments");
        cobj->setTitleColor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_setTitleColor)

static bool js_cocos2dx_ui_Button_getNormalFile(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_getNormalFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ResourceData result = cobj->getNormalFile();
        ok &= ResourceData_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_getNormalFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_getNormalFile)

static bool js_cocos2dx_ui_Button_resetNormalRender(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_resetNormalRender : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->resetNormalRender();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_resetNormalRender)

static bool js_cocos2dx_ui_Button_getRendererDisabled(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_getRendererDisabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ui::Scale9Sprite* result = cobj->getRendererDisabled();
        ok &= native_ptr_to_seval<cocos2d::ui::Scale9Sprite>((cocos2d::ui::Scale9Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_getRendererDisabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_getRendererDisabled)

static bool js_cocos2dx_ui_Button_setCapInsetsDisabledRenderer(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_setCapInsetsDisabledRenderer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Rect arg0;
        ok &= seval_to_Rect(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_setCapInsetsDisabledRenderer : Error processing arguments");
        cobj->setCapInsetsDisabledRenderer(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_setCapInsetsDisabledRenderer)

static bool js_cocos2dx_ui_Button_setCapInsets(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_setCapInsets : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Rect arg0;
        ok &= seval_to_Rect(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_setCapInsets : Error processing arguments");
        cobj->setCapInsets(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_setCapInsets)

static bool js_cocos2dx_ui_Button_loadTextureDisabled(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_loadTextureDisabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_loadTextureDisabled : Error processing arguments");
        cobj->loadTextureDisabled(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        cocos2d::ui::Widget::TextureResType arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_loadTextureDisabled : Error processing arguments");
        cobj->loadTextureDisabled(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_loadTextureDisabled)

static bool js_cocos2dx_ui_Button_init(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_init : Error processing arguments");
        bool result = cobj->init(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_init : Error processing arguments");
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_init : Error processing arguments");
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1, arg2);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_init : Error processing arguments");
        return true;
    }
    if (argc == 4) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        cocos2d::ui::Widget::TextureResType arg3;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        ok &= seval_to_int32(args[3], (int32_t*)&arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1, arg2, arg3);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_init : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_init)

static bool js_cocos2dx_ui_Button_setTitleText(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_setTitleText : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_setTitleText : Error processing arguments");
        cobj->setTitleText(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_setTitleText)

static bool js_cocos2dx_ui_Button_setCapInsetsNormalRenderer(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_setCapInsetsNormalRenderer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Rect arg0;
        ok &= seval_to_Rect(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_setCapInsetsNormalRenderer : Error processing arguments");
        cobj->setCapInsetsNormalRenderer(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_setCapInsetsNormalRenderer)

static bool js_cocos2dx_ui_Button_loadTexturePressed(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_loadTexturePressed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_loadTexturePressed : Error processing arguments");
        cobj->loadTexturePressed(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        cocos2d::ui::Widget::TextureResType arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_loadTexturePressed : Error processing arguments");
        cobj->loadTexturePressed(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_loadTexturePressed)

static bool js_cocos2dx_ui_Button_setTitleFontName(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_setTitleFontName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_setTitleFontName : Error processing arguments");
        cobj->setTitleFontName(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_setTitleFontName)

static bool js_cocos2dx_ui_Button_getCapInsetsNormalRenderer(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_getCapInsetsNormalRenderer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Rect& result = cobj->getCapInsetsNormalRenderer();
        ok &= Rect_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_getCapInsetsNormalRenderer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_getCapInsetsNormalRenderer)

static bool js_cocos2dx_ui_Button_setTitleAlignment(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ui_Button_setTitleAlignment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            cocos2d::TextHAlignment arg0;
            ok &= seval_to_int8(args[0], (int8_t*)&arg0);
            if (!ok) { ok = true; break; }
            cocos2d::TextVAlignment arg1;
            ok &= seval_to_int8(args[1], (int8_t*)&arg1);
            if (!ok) { ok = true; break; }
            cobj->setTitleAlignment(arg0, arg1);
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            cocos2d::TextHAlignment arg0;
            ok &= seval_to_int8(args[0], (int8_t*)&arg0);
            if (!ok) { ok = true; break; }
            cobj->setTitleAlignment(arg0);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_setTitleAlignment)

static bool js_cocos2dx_ui_Button_getCapInsetsPressedRenderer(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_getCapInsetsPressedRenderer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Rect& result = cobj->getCapInsetsPressedRenderer();
        ok &= Rect_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_getCapInsetsPressedRenderer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_getCapInsetsPressedRenderer)

static bool js_cocos2dx_ui_Button_loadTextures(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_loadTextures : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_loadTextures : Error processing arguments");
        cobj->loadTextures(arg0, arg1);
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_loadTextures : Error processing arguments");
        cobj->loadTextures(arg0, arg1, arg2);
        return true;
    }
    if (argc == 4) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        cocos2d::ui::Widget::TextureResType arg3;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        ok &= seval_to_int32(args[3], (int32_t*)&arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_loadTextures : Error processing arguments");
        cobj->loadTextures(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_loadTextures)

static bool js_cocos2dx_ui_Button_isScale9Enabled(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_isScale9Enabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isScale9Enabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_isScale9Enabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_isScale9Enabled)

static bool js_cocos2dx_ui_Button_loadTextureNormal(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_loadTextureNormal : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_loadTextureNormal : Error processing arguments");
        cobj->loadTextureNormal(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        cocos2d::ui::Widget::TextureResType arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_loadTextureNormal : Error processing arguments");
        cobj->loadTextureNormal(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_loadTextureNormal)

static bool js_cocos2dx_ui_Button_setCapInsetsPressedRenderer(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_setCapInsetsPressedRenderer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Rect arg0;
        ok &= seval_to_Rect(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_setCapInsetsPressedRenderer : Error processing arguments");
        cobj->setCapInsetsPressedRenderer(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_setCapInsetsPressedRenderer)

static bool js_cocos2dx_ui_Button_getPressedFile(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_getPressedFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ResourceData result = cobj->getPressedFile();
        ok &= ResourceData_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_getPressedFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_getPressedFile)

static bool js_cocos2dx_ui_Button_getTitleFontSize(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_getTitleFontSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTitleFontSize();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_getTitleFontSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_getTitleFontSize)

static bool js_cocos2dx_ui_Button_getRendererNormal(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_getRendererNormal : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ui::Scale9Sprite* result = cobj->getRendererNormal();
        ok &= native_ptr_to_seval<cocos2d::ui::Scale9Sprite>((cocos2d::ui::Scale9Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_getRendererNormal : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_getRendererNormal)

static bool js_cocos2dx_ui_Button_getTitleFontName(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_getTitleFontName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getTitleFontName();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_getTitleFontName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_getTitleFontName)

static bool js_cocos2dx_ui_Button_getTitleColor(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_getTitleColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Color3B result = cobj->getTitleColor();
        ok &= Color3B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_getTitleColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_getTitleColor)

static bool js_cocos2dx_ui_Button_setPressedActionEnabled(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_setPressedActionEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_setPressedActionEnabled : Error processing arguments");
        cobj->setPressedActionEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_setPressedActionEnabled)

static bool js_cocos2dx_ui_Button_setZoomScale(se::State& s)
{
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Button_setZoomScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_setZoomScale : Error processing arguments");
        cobj->setZoomScale(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_setZoomScale)

static bool js_cocos2dx_ui_Button_create(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Button* result = cocos2d::ui::Button::create(arg0);
            ok &= native_ptr_to_seval<cocos2d::ui::Button>((cocos2d::ui::Button*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Button* result = cocos2d::ui::Button::create(arg0, arg1);
            ok &= native_ptr_to_seval<cocos2d::ui::Button>((cocos2d::ui::Button*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            std::string arg2;
            ok &= seval_to_std_string(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Button* result = cocos2d::ui::Button::create(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<cocos2d::ui::Button>((cocos2d::ui::Button*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 4) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            std::string arg2;
            ok &= seval_to_std_string(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Widget::TextureResType arg3;
            ok &= seval_to_int32(args[3], (int32_t*)&arg3);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Button* result = cocos2d::ui::Button::create(arg0, arg1, arg2, arg3);
            ok &= native_ptr_to_seval<cocos2d::ui::Button>((cocos2d::ui::Button*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 0) {
            cocos2d::ui::Button* result = cocos2d::ui::Button::create();
            ok &= native_ptr_to_seval<cocos2d::ui::Button>((cocos2d::ui::Button*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Button_create : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Button_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_Button_finalize)

static bool js_cocos2dx_ui_Button_constructor(se::State& s)
{
    cocos2d::ui::Button* cobj = new (std::nothrow) cocos2d::ui::Button();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_Button_constructor, __jsb_cocos2d_ui_Button_class, js_cocos2d_ui_Button_finalize)

static bool js_cocos2dx_ui_Button_ctor(se::State& s)
{
    cocos2d::ui::Button* cobj = new (std::nothrow) cocos2d::ui::Button();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_Button_ctor, __jsb_cocos2d_ui_Button_class, js_cocos2d_ui_Button_finalize)


    

extern se::Object* __jsb_cocos2d_ui_Widget_proto;

static bool js_cocos2d_ui_Button_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::Button)", s.nativeThisObject());
    cocos2d::ui::Button* cobj = (cocos2d::ui::Button*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_Button_finalize)

bool js_register_cocos2dx_ui_Button(se::Object* obj)
{
    auto cls = se::Class::create("Button", obj, __jsb_cocos2d_ui_Widget_proto, _SE(js_cocos2dx_ui_Button_constructor));

    cls->defineFunction("getNormalTextureSize", _SE(js_cocos2dx_ui_Button_getNormalTextureSize));
    cls->defineFunction("getTitleText", _SE(js_cocos2dx_ui_Button_getTitleText));
    cls->defineFunction("setTitleFontSize", _SE(js_cocos2dx_ui_Button_setTitleFontSize));
    cls->defineFunction("resetPressedRender", _SE(js_cocos2dx_ui_Button_resetPressedRender));
    cls->defineFunction("setScale9Enabled", _SE(js_cocos2dx_ui_Button_setScale9Enabled));
    cls->defineFunction("resetDisabledRender", _SE(js_cocos2dx_ui_Button_resetDisabledRender));
    cls->defineFunction("getTitleRenderer", _SE(js_cocos2dx_ui_Button_getTitleRenderer));
    cls->defineFunction("getRendererClicked", _SE(js_cocos2dx_ui_Button_getRendererClicked));
    cls->defineFunction("getDisabledFile", _SE(js_cocos2dx_ui_Button_getDisabledFile));
    cls->defineFunction("getZoomScale", _SE(js_cocos2dx_ui_Button_getZoomScale));
    cls->defineFunction("getCapInsetsDisabledRenderer", _SE(js_cocos2dx_ui_Button_getCapInsetsDisabledRenderer));
    cls->defineFunction("setTitleColor", _SE(js_cocos2dx_ui_Button_setTitleColor));
    cls->defineFunction("getNormalFile", _SE(js_cocos2dx_ui_Button_getNormalFile));
    cls->defineFunction("resetNormalRender", _SE(js_cocos2dx_ui_Button_resetNormalRender));
    cls->defineFunction("getRendererDisabled", _SE(js_cocos2dx_ui_Button_getRendererDisabled));
    cls->defineFunction("setCapInsetsDisabledRenderer", _SE(js_cocos2dx_ui_Button_setCapInsetsDisabledRenderer));
    cls->defineFunction("setCapInsets", _SE(js_cocos2dx_ui_Button_setCapInsets));
    cls->defineFunction("loadTextureDisabled", _SE(js_cocos2dx_ui_Button_loadTextureDisabled));
    cls->defineFunction("init", _SE(js_cocos2dx_ui_Button_init));
    cls->defineFunction("setTitleText", _SE(js_cocos2dx_ui_Button_setTitleText));
    cls->defineFunction("setCapInsetsNormalRenderer", _SE(js_cocos2dx_ui_Button_setCapInsetsNormalRenderer));
    cls->defineFunction("loadTexturePressed", _SE(js_cocos2dx_ui_Button_loadTexturePressed));
    cls->defineFunction("setTitleFontName", _SE(js_cocos2dx_ui_Button_setTitleFontName));
    cls->defineFunction("getCapInsetsNormalRenderer", _SE(js_cocos2dx_ui_Button_getCapInsetsNormalRenderer));
    cls->defineFunction("setTitleAlignment", _SE(js_cocos2dx_ui_Button_setTitleAlignment));
    cls->defineFunction("getCapInsetsPressedRenderer", _SE(js_cocos2dx_ui_Button_getCapInsetsPressedRenderer));
    cls->defineFunction("loadTextures", _SE(js_cocos2dx_ui_Button_loadTextures));
    cls->defineFunction("isScale9Enabled", _SE(js_cocos2dx_ui_Button_isScale9Enabled));
    cls->defineFunction("loadTextureNormal", _SE(js_cocos2dx_ui_Button_loadTextureNormal));
    cls->defineFunction("setCapInsetsPressedRenderer", _SE(js_cocos2dx_ui_Button_setCapInsetsPressedRenderer));
    cls->defineFunction("getPressedFile", _SE(js_cocos2dx_ui_Button_getPressedFile));
    cls->defineFunction("getTitleFontSize", _SE(js_cocos2dx_ui_Button_getTitleFontSize));
    cls->defineFunction("getRendererNormal", _SE(js_cocos2dx_ui_Button_getRendererNormal));
    cls->defineFunction("getTitleFontName", _SE(js_cocos2dx_ui_Button_getTitleFontName));
    cls->defineFunction("getTitleColor", _SE(js_cocos2dx_ui_Button_getTitleColor));
    cls->defineFunction("setPressedActionEnabled", _SE(js_cocos2dx_ui_Button_setPressedActionEnabled));
    cls->defineFunction("setZoomScale", _SE(js_cocos2dx_ui_Button_setZoomScale));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_Button_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_Button_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_Button_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::Button>(cls);

    __jsb_cocos2d_ui_Button_proto = cls->getProto();
    __jsb_cocos2d_ui_Button_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.Button.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_AbstractCheckButton_proto = nullptr;
se::Class* __jsb_cocos2d_ui_AbstractCheckButton_class = nullptr;

static bool js_cocos2dx_ui_AbstractCheckButton_getCrossDisabledFile(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_getCrossDisabledFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ResourceData result = cobj->getCrossDisabledFile();
        ok &= ResourceData_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_getCrossDisabledFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_getCrossDisabledFile)

static bool js_cocos2dx_ui_AbstractCheckButton_getBackDisabledFile(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_getBackDisabledFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ResourceData result = cobj->getBackDisabledFile();
        ok &= ResourceData_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_getBackDisabledFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_getBackDisabledFile)

static bool js_cocos2dx_ui_AbstractCheckButton_loadTextureBackGroundSelected(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_loadTextureBackGroundSelected : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_loadTextureBackGroundSelected : Error processing arguments");
        cobj->loadTextureBackGroundSelected(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        cocos2d::ui::Widget::TextureResType arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_loadTextureBackGroundSelected : Error processing arguments");
        cobj->loadTextureBackGroundSelected(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_loadTextureBackGroundSelected)

static bool js_cocos2dx_ui_AbstractCheckButton_loadTextureBackGroundDisabled(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_loadTextureBackGroundDisabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_loadTextureBackGroundDisabled : Error processing arguments");
        cobj->loadTextureBackGroundDisabled(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        cocos2d::ui::Widget::TextureResType arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_loadTextureBackGroundDisabled : Error processing arguments");
        cobj->loadTextureBackGroundDisabled(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_loadTextureBackGroundDisabled)

static bool js_cocos2dx_ui_AbstractCheckButton_getCrossNormalFile(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_getCrossNormalFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ResourceData result = cobj->getCrossNormalFile();
        ok &= ResourceData_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_getCrossNormalFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_getCrossNormalFile)

static bool js_cocos2dx_ui_AbstractCheckButton_setSelected(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_setSelected : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_setSelected : Error processing arguments");
        cobj->setSelected(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_setSelected)

static bool js_cocos2dx_ui_AbstractCheckButton_getBackPressedFile(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_getBackPressedFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ResourceData result = cobj->getBackPressedFile();
        ok &= ResourceData_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_getBackPressedFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_getBackPressedFile)

static bool js_cocos2dx_ui_AbstractCheckButton_getRendererFrontCrossDisabled(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_getRendererFrontCrossDisabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Sprite* result = cobj->getRendererFrontCrossDisabled();
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_getRendererFrontCrossDisabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_getRendererFrontCrossDisabled)

static bool js_cocos2dx_ui_AbstractCheckButton_getRendererBackground(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_getRendererBackground : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Sprite* result = cobj->getRendererBackground();
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_getRendererBackground : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_getRendererBackground)

static bool js_cocos2dx_ui_AbstractCheckButton_loadTextureFrontCross(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_loadTextureFrontCross : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_loadTextureFrontCross : Error processing arguments");
        cobj->loadTextureFrontCross(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        cocos2d::ui::Widget::TextureResType arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_loadTextureFrontCross : Error processing arguments");
        cobj->loadTextureFrontCross(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_loadTextureFrontCross)

static bool js_cocos2dx_ui_AbstractCheckButton_getRendererBackgroundDisabled(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_getRendererBackgroundDisabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Sprite* result = cobj->getRendererBackgroundDisabled();
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_getRendererBackgroundDisabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_getRendererBackgroundDisabled)

static bool js_cocos2dx_ui_AbstractCheckButton_isSelected(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_isSelected : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isSelected();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_isSelected : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_isSelected)

static bool js_cocos2dx_ui_AbstractCheckButton_init(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        std::string arg3;
        std::string arg4;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1, arg2, arg3, arg4);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_init : Error processing arguments");
        return true;
    }
    if (argc == 6) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        std::string arg3;
        std::string arg4;
        cocos2d::ui::Widget::TextureResType arg5;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_int32(args[5], (int32_t*)&arg5);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1, arg2, arg3, arg4, arg5);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_init : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_init)

static bool js_cocos2dx_ui_AbstractCheckButton_getBackNormalFile(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_getBackNormalFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ResourceData result = cobj->getBackNormalFile();
        ok &= ResourceData_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_getBackNormalFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_getBackNormalFile)

static bool js_cocos2dx_ui_AbstractCheckButton_loadTextures(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_loadTextures : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        std::string arg3;
        std::string arg4;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_loadTextures : Error processing arguments");
        cobj->loadTextures(arg0, arg1, arg2, arg3, arg4);
        return true;
    }
    if (argc == 6) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        std::string arg3;
        std::string arg4;
        cocos2d::ui::Widget::TextureResType arg5;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_int32(args[5], (int32_t*)&arg5);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_loadTextures : Error processing arguments");
        cobj->loadTextures(arg0, arg1, arg2, arg3, arg4, arg5);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_loadTextures)

static bool js_cocos2dx_ui_AbstractCheckButton_getZoomScale(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_getZoomScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getZoomScale();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_getZoomScale : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_getZoomScale)

static bool js_cocos2dx_ui_AbstractCheckButton_getRendererFrontCross(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_getRendererFrontCross : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Sprite* result = cobj->getRendererFrontCross();
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_getRendererFrontCross : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_getRendererFrontCross)

static bool js_cocos2dx_ui_AbstractCheckButton_getRendererBackgroundSelected(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_getRendererBackgroundSelected : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Sprite* result = cobj->getRendererBackgroundSelected();
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_getRendererBackgroundSelected : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_getRendererBackgroundSelected)

static bool js_cocos2dx_ui_AbstractCheckButton_loadTextureBackGround(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_loadTextureBackGround : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_loadTextureBackGround : Error processing arguments");
        cobj->loadTextureBackGround(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        cocos2d::ui::Widget::TextureResType arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_loadTextureBackGround : Error processing arguments");
        cobj->loadTextureBackGround(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_loadTextureBackGround)

static bool js_cocos2dx_ui_AbstractCheckButton_setZoomScale(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_setZoomScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_setZoomScale : Error processing arguments");
        cobj->setZoomScale(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_setZoomScale)

static bool js_cocos2dx_ui_AbstractCheckButton_loadTextureFrontCrossDisabled(se::State& s)
{
    cocos2d::ui::AbstractCheckButton* cobj = (cocos2d::ui::AbstractCheckButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_AbstractCheckButton_loadTextureFrontCrossDisabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_loadTextureFrontCrossDisabled : Error processing arguments");
        cobj->loadTextureFrontCrossDisabled(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        cocos2d::ui::Widget::TextureResType arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_AbstractCheckButton_loadTextureFrontCrossDisabled : Error processing arguments");
        cobj->loadTextureFrontCrossDisabled(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_AbstractCheckButton_loadTextureFrontCrossDisabled)


extern se::Object* __jsb_cocos2d_ui_Widget_proto;


bool js_register_cocos2dx_ui_AbstractCheckButton(se::Object* obj)
{
    auto cls = se::Class::create("AbstractCheckButton", obj, __jsb_cocos2d_ui_Widget_proto, nullptr);

    cls->defineFunction("getCrossDisabledFile", _SE(js_cocos2dx_ui_AbstractCheckButton_getCrossDisabledFile));
    cls->defineFunction("getBackDisabledFile", _SE(js_cocos2dx_ui_AbstractCheckButton_getBackDisabledFile));
    cls->defineFunction("loadTextureBackGroundSelected", _SE(js_cocos2dx_ui_AbstractCheckButton_loadTextureBackGroundSelected));
    cls->defineFunction("loadTextureBackGroundDisabled", _SE(js_cocos2dx_ui_AbstractCheckButton_loadTextureBackGroundDisabled));
    cls->defineFunction("getCrossNormalFile", _SE(js_cocos2dx_ui_AbstractCheckButton_getCrossNormalFile));
    cls->defineFunction("setSelected", _SE(js_cocos2dx_ui_AbstractCheckButton_setSelected));
    cls->defineFunction("getBackPressedFile", _SE(js_cocos2dx_ui_AbstractCheckButton_getBackPressedFile));
    cls->defineFunction("getRendererFrontCrossDisabled", _SE(js_cocos2dx_ui_AbstractCheckButton_getRendererFrontCrossDisabled));
    cls->defineFunction("getRendererBackground", _SE(js_cocos2dx_ui_AbstractCheckButton_getRendererBackground));
    cls->defineFunction("loadTextureFrontCross", _SE(js_cocos2dx_ui_AbstractCheckButton_loadTextureFrontCross));
    cls->defineFunction("getRendererBackgroundDisabled", _SE(js_cocos2dx_ui_AbstractCheckButton_getRendererBackgroundDisabled));
    cls->defineFunction("isSelected", _SE(js_cocos2dx_ui_AbstractCheckButton_isSelected));
    cls->defineFunction("init", _SE(js_cocos2dx_ui_AbstractCheckButton_init));
    cls->defineFunction("getBackNormalFile", _SE(js_cocos2dx_ui_AbstractCheckButton_getBackNormalFile));
    cls->defineFunction("loadTextures", _SE(js_cocos2dx_ui_AbstractCheckButton_loadTextures));
    cls->defineFunction("getZoomScale", _SE(js_cocos2dx_ui_AbstractCheckButton_getZoomScale));
    cls->defineFunction("getRendererFrontCross", _SE(js_cocos2dx_ui_AbstractCheckButton_getRendererFrontCross));
    cls->defineFunction("getRendererBackgroundSelected", _SE(js_cocos2dx_ui_AbstractCheckButton_getRendererBackgroundSelected));
    cls->defineFunction("loadTextureBackGround", _SE(js_cocos2dx_ui_AbstractCheckButton_loadTextureBackGround));
    cls->defineFunction("setZoomScale", _SE(js_cocos2dx_ui_AbstractCheckButton_setZoomScale));
    cls->defineFunction("loadTextureFrontCrossDisabled", _SE(js_cocos2dx_ui_AbstractCheckButton_loadTextureFrontCrossDisabled));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::AbstractCheckButton>(cls);

    __jsb_cocos2d_ui_AbstractCheckButton_proto = cls->getProto();
    __jsb_cocos2d_ui_AbstractCheckButton_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_CheckBox_proto = nullptr;
se::Class* __jsb_cocos2d_ui_CheckBox_class = nullptr;

static bool js_cocos2dx_ui_CheckBox_addEventListener(se::State& s)
{
    cocos2d::ui::CheckBox* cobj = (cocos2d::ui::CheckBox*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_CheckBox_addEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (cocos2d::Ref *, cocos2d::ui::CheckBox::EventType)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachChild(jsFunc.toObject());
                auto lambda = [=](cocos2d::Ref* larg0, cocos2d::ui::CheckBox::EventType larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= native_ptr_to_seval<cocos2d::Ref>((cocos2d::Ref*)larg0, &args[0]);
                    ok &= int32_to_seval((int32_t)larg1, &args[1]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_CheckBox_addEventListener : Error processing arguments");
        cobj->addEventListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_CheckBox_addEventListener)

static bool js_cocos2dx_ui_CheckBox_create(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 5) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            std::string arg2;
            ok &= seval_to_std_string(args[2], &arg2);
            if (!ok) { ok = true; break; }
            std::string arg3;
            ok &= seval_to_std_string(args[3], &arg3);
            if (!ok) { ok = true; break; }
            std::string arg4;
            ok &= seval_to_std_string(args[4], &arg4);
            if (!ok) { ok = true; break; }
            cocos2d::ui::CheckBox* result = cocos2d::ui::CheckBox::create(arg0, arg1, arg2, arg3, arg4);
            ok &= native_ptr_to_seval<cocos2d::ui::CheckBox>((cocos2d::ui::CheckBox*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_CheckBox_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 6) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            std::string arg2;
            ok &= seval_to_std_string(args[2], &arg2);
            if (!ok) { ok = true; break; }
            std::string arg3;
            ok &= seval_to_std_string(args[3], &arg3);
            if (!ok) { ok = true; break; }
            std::string arg4;
            ok &= seval_to_std_string(args[4], &arg4);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Widget::TextureResType arg5;
            ok &= seval_to_int32(args[5], (int32_t*)&arg5);
            if (!ok) { ok = true; break; }
            cocos2d::ui::CheckBox* result = cocos2d::ui::CheckBox::create(arg0, arg1, arg2, arg3, arg4, arg5);
            ok &= native_ptr_to_seval<cocos2d::ui::CheckBox>((cocos2d::ui::CheckBox*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_CheckBox_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 0) {
            cocos2d::ui::CheckBox* result = cocos2d::ui::CheckBox::create();
            ok &= native_ptr_to_seval<cocos2d::ui::CheckBox>((cocos2d::ui::CheckBox*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_CheckBox_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::CheckBox* result = cocos2d::ui::CheckBox::create(arg0, arg1);
            ok &= native_ptr_to_seval<cocos2d::ui::CheckBox>((cocos2d::ui::CheckBox*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_CheckBox_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Widget::TextureResType arg2;
            ok &= seval_to_int32(args[2], (int32_t*)&arg2);
            if (!ok) { ok = true; break; }
            cocos2d::ui::CheckBox* result = cocos2d::ui::CheckBox::create(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<cocos2d::ui::CheckBox>((cocos2d::ui::CheckBox*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_CheckBox_create : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_CheckBox_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_CheckBox_finalize)

static bool js_cocos2dx_ui_CheckBox_constructor(se::State& s)
{
    cocos2d::ui::CheckBox* cobj = new (std::nothrow) cocos2d::ui::CheckBox();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_CheckBox_constructor, __jsb_cocos2d_ui_CheckBox_class, js_cocos2d_ui_CheckBox_finalize)

static bool js_cocos2dx_ui_CheckBox_ctor(se::State& s)
{
    cocos2d::ui::CheckBox* cobj = new (std::nothrow) cocos2d::ui::CheckBox();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_CheckBox_ctor, __jsb_cocos2d_ui_CheckBox_class, js_cocos2d_ui_CheckBox_finalize)


    

extern se::Object* __jsb_cocos2d_ui_AbstractCheckButton_proto;

static bool js_cocos2d_ui_CheckBox_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::CheckBox)", s.nativeThisObject());
    cocos2d::ui::CheckBox* cobj = (cocos2d::ui::CheckBox*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_CheckBox_finalize)

bool js_register_cocos2dx_ui_CheckBox(se::Object* obj)
{
    auto cls = se::Class::create("CheckBox", obj, __jsb_cocos2d_ui_AbstractCheckButton_proto, _SE(js_cocos2dx_ui_CheckBox_constructor));

    cls->defineFunction("addEventListener", _SE(js_cocos2dx_ui_CheckBox_addEventListener));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_CheckBox_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_CheckBox_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_CheckBox_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::CheckBox>(cls);

    __jsb_cocos2d_ui_CheckBox_proto = cls->getProto();
    __jsb_cocos2d_ui_CheckBox_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.CheckBox.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_RadioButton_proto = nullptr;
se::Class* __jsb_cocos2d_ui_RadioButton_class = nullptr;

static bool js_cocos2dx_ui_RadioButton_addEventListener(se::State& s)
{
    cocos2d::ui::RadioButton* cobj = (cocos2d::ui::RadioButton*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RadioButton_addEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (cocos2d::ui::RadioButton *, cocos2d::ui::RadioButton::EventType)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachChild(jsFunc.toObject());
                auto lambda = [=](cocos2d::ui::RadioButton* larg0, cocos2d::ui::RadioButton::EventType larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= native_ptr_to_seval<cocos2d::ui::RadioButton>((cocos2d::ui::RadioButton*)larg0, &args[0]);
                    ok &= int32_to_seval((int32_t)larg1, &args[1]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RadioButton_addEventListener : Error processing arguments");
        cobj->addEventListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RadioButton_addEventListener)

static bool js_cocos2dx_ui_RadioButton_create(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 5) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            std::string arg2;
            ok &= seval_to_std_string(args[2], &arg2);
            if (!ok) { ok = true; break; }
            std::string arg3;
            ok &= seval_to_std_string(args[3], &arg3);
            if (!ok) { ok = true; break; }
            std::string arg4;
            ok &= seval_to_std_string(args[4], &arg4);
            if (!ok) { ok = true; break; }
            cocos2d::ui::RadioButton* result = cocos2d::ui::RadioButton::create(arg0, arg1, arg2, arg3, arg4);
            ok &= native_ptr_to_seval<cocos2d::ui::RadioButton>((cocos2d::ui::RadioButton*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RadioButton_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 6) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            std::string arg2;
            ok &= seval_to_std_string(args[2], &arg2);
            if (!ok) { ok = true; break; }
            std::string arg3;
            ok &= seval_to_std_string(args[3], &arg3);
            if (!ok) { ok = true; break; }
            std::string arg4;
            ok &= seval_to_std_string(args[4], &arg4);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Widget::TextureResType arg5;
            ok &= seval_to_int32(args[5], (int32_t*)&arg5);
            if (!ok) { ok = true; break; }
            cocos2d::ui::RadioButton* result = cocos2d::ui::RadioButton::create(arg0, arg1, arg2, arg3, arg4, arg5);
            ok &= native_ptr_to_seval<cocos2d::ui::RadioButton>((cocos2d::ui::RadioButton*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RadioButton_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 0) {
            cocos2d::ui::RadioButton* result = cocos2d::ui::RadioButton::create();
            ok &= native_ptr_to_seval<cocos2d::ui::RadioButton>((cocos2d::ui::RadioButton*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RadioButton_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::RadioButton* result = cocos2d::ui::RadioButton::create(arg0, arg1);
            ok &= native_ptr_to_seval<cocos2d::ui::RadioButton>((cocos2d::ui::RadioButton*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RadioButton_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Widget::TextureResType arg2;
            ok &= seval_to_int32(args[2], (int32_t*)&arg2);
            if (!ok) { ok = true; break; }
            cocos2d::ui::RadioButton* result = cocos2d::ui::RadioButton::create(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<cocos2d::ui::RadioButton>((cocos2d::ui::RadioButton*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RadioButton_create : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RadioButton_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_RadioButton_finalize)

static bool js_cocos2dx_ui_RadioButton_constructor(se::State& s)
{
    cocos2d::ui::RadioButton* cobj = new (std::nothrow) cocos2d::ui::RadioButton();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_RadioButton_constructor, __jsb_cocos2d_ui_RadioButton_class, js_cocos2d_ui_RadioButton_finalize)

static bool js_cocos2dx_ui_RadioButton_ctor(se::State& s)
{
    cocos2d::ui::RadioButton* cobj = new (std::nothrow) cocos2d::ui::RadioButton();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_RadioButton_ctor, __jsb_cocos2d_ui_RadioButton_class, js_cocos2d_ui_RadioButton_finalize)


    

extern se::Object* __jsb_cocos2d_ui_AbstractCheckButton_proto;

static bool js_cocos2d_ui_RadioButton_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::RadioButton)", s.nativeThisObject());
    cocos2d::ui::RadioButton* cobj = (cocos2d::ui::RadioButton*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_RadioButton_finalize)

bool js_register_cocos2dx_ui_RadioButton(se::Object* obj)
{
    auto cls = se::Class::create("RadioButton", obj, __jsb_cocos2d_ui_AbstractCheckButton_proto, _SE(js_cocos2dx_ui_RadioButton_constructor));

    cls->defineFunction("addEventListener", _SE(js_cocos2dx_ui_RadioButton_addEventListener));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_RadioButton_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_RadioButton_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_RadioButton_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::RadioButton>(cls);

    __jsb_cocos2d_ui_RadioButton_proto = cls->getProto();
    __jsb_cocos2d_ui_RadioButton_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.RadioButton.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_RadioButtonGroup_proto = nullptr;
se::Class* __jsb_cocos2d_ui_RadioButtonGroup_class = nullptr;

static bool js_cocos2dx_ui_RadioButtonGroup_removeRadioButton(se::State& s)
{
    cocos2d::ui::RadioButtonGroup* cobj = (cocos2d::ui::RadioButtonGroup*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RadioButtonGroup_removeRadioButton : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::RadioButton* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RadioButtonGroup_removeRadioButton : Error processing arguments");
        cobj->removeRadioButton(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RadioButtonGroup_removeRadioButton)

static bool js_cocos2dx_ui_RadioButtonGroup_isAllowedNoSelection(se::State& s)
{
    cocos2d::ui::RadioButtonGroup* cobj = (cocos2d::ui::RadioButtonGroup*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RadioButtonGroup_isAllowedNoSelection : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isAllowedNoSelection();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RadioButtonGroup_isAllowedNoSelection : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RadioButtonGroup_isAllowedNoSelection)

static bool js_cocos2dx_ui_RadioButtonGroup_getSelectedButtonIndex(se::State& s)
{
    cocos2d::ui::RadioButtonGroup* cobj = (cocos2d::ui::RadioButtonGroup*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RadioButtonGroup_getSelectedButtonIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getSelectedButtonIndex();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RadioButtonGroup_getSelectedButtonIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RadioButtonGroup_getSelectedButtonIndex)

static bool js_cocos2dx_ui_RadioButtonGroup_setAllowedNoSelection(se::State& s)
{
    cocos2d::ui::RadioButtonGroup* cobj = (cocos2d::ui::RadioButtonGroup*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RadioButtonGroup_setAllowedNoSelection : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RadioButtonGroup_setAllowedNoSelection : Error processing arguments");
        cobj->setAllowedNoSelection(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RadioButtonGroup_setAllowedNoSelection)

static bool js_cocos2dx_ui_RadioButtonGroup_setSelectedButtonWithoutEvent(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::ui::RadioButtonGroup* cobj = (cocos2d::ui::RadioButtonGroup*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ui_RadioButtonGroup_setSelectedButtonWithoutEvent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            cocos2d::ui::RadioButton* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cobj->setSelectedButtonWithoutEvent(arg0);
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            int arg0 = 0;
            ok &= seval_to_int32(args[0], (int32_t*)&arg0);
            if (!ok) { ok = true; break; }
            cobj->setSelectedButtonWithoutEvent(arg0);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RadioButtonGroup_setSelectedButtonWithoutEvent)

static bool js_cocos2dx_ui_RadioButtonGroup_addEventListener(se::State& s)
{
    cocos2d::ui::RadioButtonGroup* cobj = (cocos2d::ui::RadioButtonGroup*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RadioButtonGroup_addEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (cocos2d::ui::RadioButton *, int, cocos2d::ui::RadioButtonGroup::EventType)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachChild(jsFunc.toObject());
                auto lambda = [=](cocos2d::ui::RadioButton* larg0, int larg1, cocos2d::ui::RadioButtonGroup::EventType larg2) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(3);
                    ok &= native_ptr_to_seval<cocos2d::ui::RadioButton>((cocos2d::ui::RadioButton*)larg0, &args[0]);
                    ok &= int32_to_seval(larg1, &args[1]);
                    ok &= int32_to_seval((int32_t)larg2, &args[2]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RadioButtonGroup_addEventListener : Error processing arguments");
        cobj->addEventListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RadioButtonGroup_addEventListener)

static bool js_cocos2dx_ui_RadioButtonGroup_removeAllRadioButtons(se::State& s)
{
    cocos2d::ui::RadioButtonGroup* cobj = (cocos2d::ui::RadioButtonGroup*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RadioButtonGroup_removeAllRadioButtons : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->removeAllRadioButtons();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RadioButtonGroup_removeAllRadioButtons)

static bool js_cocos2dx_ui_RadioButtonGroup_getRadioButtonByIndex(se::State& s)
{
    cocos2d::ui::RadioButtonGroup* cobj = (cocos2d::ui::RadioButtonGroup*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RadioButtonGroup_getRadioButtonByIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RadioButtonGroup_getRadioButtonByIndex : Error processing arguments");
        cocos2d::ui::RadioButton* result = cobj->getRadioButtonByIndex(arg0);
        ok &= native_ptr_to_seval<cocos2d::ui::RadioButton>((cocos2d::ui::RadioButton*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RadioButtonGroup_getRadioButtonByIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RadioButtonGroup_getRadioButtonByIndex)

static bool js_cocos2dx_ui_RadioButtonGroup_getNumberOfRadioButtons(se::State& s)
{
    cocos2d::ui::RadioButtonGroup* cobj = (cocos2d::ui::RadioButtonGroup*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RadioButtonGroup_getNumberOfRadioButtons : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        ssize_t result = cobj->getNumberOfRadioButtons();
        ok &= ssize_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RadioButtonGroup_getNumberOfRadioButtons : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RadioButtonGroup_getNumberOfRadioButtons)

static bool js_cocos2dx_ui_RadioButtonGroup_addRadioButton(se::State& s)
{
    cocos2d::ui::RadioButtonGroup* cobj = (cocos2d::ui::RadioButtonGroup*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RadioButtonGroup_addRadioButton : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::RadioButton* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RadioButtonGroup_addRadioButton : Error processing arguments");
        cobj->addRadioButton(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RadioButtonGroup_addRadioButton)

static bool js_cocos2dx_ui_RadioButtonGroup_setSelectedButton(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::ui::RadioButtonGroup* cobj = (cocos2d::ui::RadioButtonGroup*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ui_RadioButtonGroup_setSelectedButton : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            cocos2d::ui::RadioButton* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cobj->setSelectedButton(arg0);
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            int arg0 = 0;
            ok &= seval_to_int32(args[0], (int32_t*)&arg0);
            if (!ok) { ok = true; break; }
            cobj->setSelectedButton(arg0);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RadioButtonGroup_setSelectedButton)

static bool js_cocos2dx_ui_RadioButtonGroup_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = cocos2d::ui::RadioButtonGroup::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_RadioButtonGroup_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RadioButtonGroup_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_RadioButtonGroup_finalize)

static bool js_cocos2dx_ui_RadioButtonGroup_constructor(se::State& s)
{
    cocos2d::ui::RadioButtonGroup* cobj = new (std::nothrow) cocos2d::ui::RadioButtonGroup();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_RadioButtonGroup_constructor, __jsb_cocos2d_ui_RadioButtonGroup_class, js_cocos2d_ui_RadioButtonGroup_finalize)

static bool js_cocos2dx_ui_RadioButtonGroup_ctor(se::State& s)
{
    cocos2d::ui::RadioButtonGroup* cobj = new (std::nothrow) cocos2d::ui::RadioButtonGroup();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_RadioButtonGroup_ctor, __jsb_cocos2d_ui_RadioButtonGroup_class, js_cocos2d_ui_RadioButtonGroup_finalize)


    

extern se::Object* __jsb_cocos2d_ui_Widget_proto;

static bool js_cocos2d_ui_RadioButtonGroup_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::RadioButtonGroup)", s.nativeThisObject());
    cocos2d::ui::RadioButtonGroup* cobj = (cocos2d::ui::RadioButtonGroup*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_RadioButtonGroup_finalize)

bool js_register_cocos2dx_ui_RadioButtonGroup(se::Object* obj)
{
    auto cls = se::Class::create("RadioButtonGroup", obj, __jsb_cocos2d_ui_Widget_proto, _SE(js_cocos2dx_ui_RadioButtonGroup_constructor));

    cls->defineFunction("removeRadioButton", _SE(js_cocos2dx_ui_RadioButtonGroup_removeRadioButton));
    cls->defineFunction("isAllowedNoSelection", _SE(js_cocos2dx_ui_RadioButtonGroup_isAllowedNoSelection));
    cls->defineFunction("getSelectedButtonIndex", _SE(js_cocos2dx_ui_RadioButtonGroup_getSelectedButtonIndex));
    cls->defineFunction("setAllowedNoSelection", _SE(js_cocos2dx_ui_RadioButtonGroup_setAllowedNoSelection));
    cls->defineFunction("setSelectedButtonWithoutEvent", _SE(js_cocos2dx_ui_RadioButtonGroup_setSelectedButtonWithoutEvent));
    cls->defineFunction("addEventListener", _SE(js_cocos2dx_ui_RadioButtonGroup_addEventListener));
    cls->defineFunction("removeAllRadioButtons", _SE(js_cocos2dx_ui_RadioButtonGroup_removeAllRadioButtons));
    cls->defineFunction("getRadioButtonByIndex", _SE(js_cocos2dx_ui_RadioButtonGroup_getRadioButtonByIndex));
    cls->defineFunction("getNumberOfRadioButtons", _SE(js_cocos2dx_ui_RadioButtonGroup_getNumberOfRadioButtons));
    cls->defineFunction("addRadioButton", _SE(js_cocos2dx_ui_RadioButtonGroup_addRadioButton));
    cls->defineFunction("setSelectedButton", _SE(js_cocos2dx_ui_RadioButtonGroup_setSelectedButton));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_RadioButtonGroup_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_RadioButtonGroup_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_RadioButtonGroup_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::RadioButtonGroup>(cls);

    __jsb_cocos2d_ui_RadioButtonGroup_proto = cls->getProto();
    __jsb_cocos2d_ui_RadioButtonGroup_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.RadioButtonGroup.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_ImageView_proto = nullptr;
se::Class* __jsb_cocos2d_ui_ImageView_class = nullptr;

static bool js_cocos2dx_ui_ImageView_loadTexture(se::State& s)
{
    cocos2d::ui::ImageView* cobj = (cocos2d::ui::ImageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ImageView_loadTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ImageView_loadTexture : Error processing arguments");
        cobj->loadTexture(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        cocos2d::ui::Widget::TextureResType arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ImageView_loadTexture : Error processing arguments");
        cobj->loadTexture(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ImageView_loadTexture)

static bool js_cocos2dx_ui_ImageView_init(se::State& s)
{
    cocos2d::ui::ImageView* cobj = (cocos2d::ui::ImageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ImageView_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ImageView_init : Error processing arguments");
        bool result = cobj->init(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ImageView_init : Error processing arguments");
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        cocos2d::ui::Widget::TextureResType arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ImageView_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ImageView_init : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ImageView_init)

static bool js_cocos2dx_ui_ImageView_setScale9Enabled(se::State& s)
{
    cocos2d::ui::ImageView* cobj = (cocos2d::ui::ImageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ImageView_setScale9Enabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ImageView_setScale9Enabled : Error processing arguments");
        cobj->setScale9Enabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ImageView_setScale9Enabled)

static bool js_cocos2dx_ui_ImageView_setTextureRect(se::State& s)
{
    cocos2d::ui::ImageView* cobj = (cocos2d::ui::ImageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ImageView_setTextureRect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Rect arg0;
        ok &= seval_to_Rect(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ImageView_setTextureRect : Error processing arguments");
        cobj->setTextureRect(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ImageView_setTextureRect)

static bool js_cocos2dx_ui_ImageView_setCapInsets(se::State& s)
{
    cocos2d::ui::ImageView* cobj = (cocos2d::ui::ImageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ImageView_setCapInsets : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Rect arg0;
        ok &= seval_to_Rect(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ImageView_setCapInsets : Error processing arguments");
        cobj->setCapInsets(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ImageView_setCapInsets)

static bool js_cocos2dx_ui_ImageView_getRenderFile(se::State& s)
{
    cocos2d::ui::ImageView* cobj = (cocos2d::ui::ImageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ImageView_getRenderFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ResourceData result = cobj->getRenderFile();
        ok &= ResourceData_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ImageView_getRenderFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ImageView_getRenderFile)

static bool js_cocos2dx_ui_ImageView_getCapInsets(se::State& s)
{
    cocos2d::ui::ImageView* cobj = (cocos2d::ui::ImageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ImageView_getCapInsets : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Rect& result = cobj->getCapInsets();
        ok &= Rect_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ImageView_getCapInsets : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ImageView_getCapInsets)

static bool js_cocos2dx_ui_ImageView_isScale9Enabled(se::State& s)
{
    cocos2d::ui::ImageView* cobj = (cocos2d::ui::ImageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ImageView_isScale9Enabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isScale9Enabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ImageView_isScale9Enabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ImageView_isScale9Enabled)

static bool js_cocos2dx_ui_ImageView_create(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::ui::ImageView* result = cocos2d::ui::ImageView::create(arg0);
            ok &= native_ptr_to_seval<cocos2d::ui::ImageView>((cocos2d::ui::ImageView*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ImageView_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Widget::TextureResType arg1;
            ok &= seval_to_int32(args[1], (int32_t*)&arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::ImageView* result = cocos2d::ui::ImageView::create(arg0, arg1);
            ok &= native_ptr_to_seval<cocos2d::ui::ImageView>((cocos2d::ui::ImageView*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ImageView_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 0) {
            cocos2d::ui::ImageView* result = cocos2d::ui::ImageView::create();
            ok &= native_ptr_to_seval<cocos2d::ui::ImageView>((cocos2d::ui::ImageView*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ImageView_create : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ImageView_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_ImageView_finalize)

static bool js_cocos2dx_ui_ImageView_constructor(se::State& s)
{
    cocos2d::ui::ImageView* cobj = new (std::nothrow) cocos2d::ui::ImageView();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_ImageView_constructor, __jsb_cocos2d_ui_ImageView_class, js_cocos2d_ui_ImageView_finalize)

static bool js_cocos2dx_ui_ImageView_ctor(se::State& s)
{
    cocos2d::ui::ImageView* cobj = new (std::nothrow) cocos2d::ui::ImageView();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_ImageView_ctor, __jsb_cocos2d_ui_ImageView_class, js_cocos2d_ui_ImageView_finalize)


    

extern se::Object* __jsb_cocos2d_ui_Widget_proto;

static bool js_cocos2d_ui_ImageView_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::ImageView)", s.nativeThisObject());
    cocos2d::ui::ImageView* cobj = (cocos2d::ui::ImageView*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_ImageView_finalize)

bool js_register_cocos2dx_ui_ImageView(se::Object* obj)
{
    auto cls = se::Class::create("ImageView", obj, __jsb_cocos2d_ui_Widget_proto, _SE(js_cocos2dx_ui_ImageView_constructor));

    cls->defineFunction("loadTexture", _SE(js_cocos2dx_ui_ImageView_loadTexture));
    cls->defineFunction("_init", _SE(js_cocos2dx_ui_ImageView_init));
    cls->defineFunction("setScale9Enabled", _SE(js_cocos2dx_ui_ImageView_setScale9Enabled));
    cls->defineFunction("setTextureRect", _SE(js_cocos2dx_ui_ImageView_setTextureRect));
    cls->defineFunction("setCapInsets", _SE(js_cocos2dx_ui_ImageView_setCapInsets));
    cls->defineFunction("getRenderFile", _SE(js_cocos2dx_ui_ImageView_getRenderFile));
    cls->defineFunction("getCapInsets", _SE(js_cocos2dx_ui_ImageView_getCapInsets));
    cls->defineFunction("isScale9Enabled", _SE(js_cocos2dx_ui_ImageView_isScale9Enabled));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_ImageView_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_ImageView_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_ImageView_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::ImageView>(cls);

    __jsb_cocos2d_ui_ImageView_proto = cls->getProto();
    __jsb_cocos2d_ui_ImageView_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.ImageView.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_Text_proto = nullptr;
se::Class* __jsb_cocos2d_ui_Text_class = nullptr;

static bool js_cocos2dx_ui_Text_enableShadow(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_enableShadow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->enableShadow();
        return true;
    }
    if (argc == 1) {
        cocos2d::Color4B arg0;
        ok &= seval_to_Color4B(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_enableShadow : Error processing arguments");
        cobj->enableShadow(arg0);
        return true;
    }
    if (argc == 2) {
        cocos2d::Color4B arg0;
        cocos2d::Size arg1;
        ok &= seval_to_Color4B(args[0], &arg0);
        ok &= seval_to_Size(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_enableShadow : Error processing arguments");
        cobj->enableShadow(arg0, arg1);
        return true;
    }
    if (argc == 3) {
        cocos2d::Color4B arg0;
        cocos2d::Size arg1;
        int arg2 = 0;
        ok &= seval_to_Color4B(args[0], &arg0);
        ok &= seval_to_Size(args[1], &arg1);
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_enableShadow : Error processing arguments");
        cobj->enableShadow(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_enableShadow)

static bool js_cocos2dx_ui_Text_getFontSize(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_getFontSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFontSize();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_getFontSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_getFontSize)

static bool js_cocos2dx_ui_Text_getString(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_getString : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getString();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_getString : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_getString)

static bool js_cocos2dx_ui_Text_disableEffect(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ui_Text_disableEffect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            cocos2d::LabelEffect arg0;
            ok &= seval_to_int8(args[0], (int8_t*)&arg0);
            if (!ok) { ok = true; break; }
            cobj->disableEffect(arg0);
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            cobj->disableEffect();
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_disableEffect)

static bool js_cocos2dx_ui_Text_getLabelEffectType(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_getLabelEffectType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        char result = (char)cobj->getLabelEffectType();
        ok &= int8_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_getLabelEffectType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_getLabelEffectType)

static bool js_cocos2dx_ui_Text_getTextColor(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_getTextColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Color4B& result = cobj->getTextColor();
        ok &= Color4B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_getTextColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_getTextColor)

static bool js_cocos2dx_ui_Text_setTextVerticalAlignment(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_setTextVerticalAlignment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::TextVAlignment arg0;
        ok &= seval_to_int8(args[0], (int8_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_setTextVerticalAlignment : Error processing arguments");
        cobj->setTextVerticalAlignment(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_setTextVerticalAlignment)

static bool js_cocos2dx_ui_Text_setFontName(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_setFontName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_setFontName : Error processing arguments");
        cobj->setFontName(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_setFontName)

static bool js_cocos2dx_ui_Text_setTouchScaleChangeEnabled(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_setTouchScaleChangeEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_setTouchScaleChangeEnabled : Error processing arguments");
        cobj->setTouchScaleChangeEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_setTouchScaleChangeEnabled)

static bool js_cocos2dx_ui_Text_getShadowOffset(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_getShadowOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Size result = cobj->getShadowOffset();
        ok &= Size_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_getShadowOffset : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_getShadowOffset)

static bool js_cocos2dx_ui_Text_setString(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_setString : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_setString : Error processing arguments");
        cobj->setString(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_setString)

static bool js_cocos2dx_ui_Text_getOutlineSize(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_getOutlineSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getOutlineSize();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_getOutlineSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_getOutlineSize)

static bool js_cocos2dx_ui_Text_init(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        float arg2 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1, arg2);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_init : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_init)

static bool js_cocos2dx_ui_Text_getShadowBlurRadius(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_getShadowBlurRadius : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShadowBlurRadius();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_getShadowBlurRadius : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_getShadowBlurRadius)

static bool js_cocos2dx_ui_Text_isTouchScaleChangeEnabled(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_isTouchScaleChangeEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isTouchScaleChangeEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_isTouchScaleChangeEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_isTouchScaleChangeEnabled)

static bool js_cocos2dx_ui_Text_getFontName(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_getFontName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getFontName();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_getFontName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_getFontName)

static bool js_cocos2dx_ui_Text_setTextAreaSize(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_setTextAreaSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Size arg0;
        ok &= seval_to_Size(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_setTextAreaSize : Error processing arguments");
        cobj->setTextAreaSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_setTextAreaSize)

static bool js_cocos2dx_ui_Text_getStringLength(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_getStringLength : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        ssize_t result = cobj->getStringLength();
        ok &= ssize_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_getStringLength : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_getStringLength)

static bool js_cocos2dx_ui_Text_getAutoRenderSize(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_getAutoRenderSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Size result = cobj->getAutoRenderSize();
        ok &= Size_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_getAutoRenderSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_getAutoRenderSize)

static bool js_cocos2dx_ui_Text_enableOutline(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_enableOutline : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Color4B arg0;
        ok &= seval_to_Color4B(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_enableOutline : Error processing arguments");
        cobj->enableOutline(arg0);
        return true;
    }
    if (argc == 2) {
        cocos2d::Color4B arg0;
        int arg1 = 0;
        ok &= seval_to_Color4B(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_enableOutline : Error processing arguments");
        cobj->enableOutline(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_enableOutline)

static bool js_cocos2dx_ui_Text_getEffectColor(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_getEffectColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Color4B result = cobj->getEffectColor();
        ok &= Color4B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_getEffectColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_getEffectColor)

static bool js_cocos2dx_ui_Text_getType(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_getType)

static bool js_cocos2dx_ui_Text_getTextHorizontalAlignment(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_getTextHorizontalAlignment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        char result = (char)cobj->getTextHorizontalAlignment();
        ok &= int8_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_getTextHorizontalAlignment : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_getTextHorizontalAlignment)

static bool js_cocos2dx_ui_Text_isShadowEnabled(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_isShadowEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isShadowEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_isShadowEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_isShadowEnabled)

static bool js_cocos2dx_ui_Text_setFontSize(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_setFontSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_setFontSize : Error processing arguments");
        cobj->setFontSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_setFontSize)

static bool js_cocos2dx_ui_Text_getShadowColor(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_getShadowColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Color4B result = cobj->getShadowColor();
        ok &= Color4B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_getShadowColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_getShadowColor)

static bool js_cocos2dx_ui_Text_setTextColor(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_setTextColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Color4B arg0;
        ok &= seval_to_Color4B(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_setTextColor : Error processing arguments");
        cobj->setTextColor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_setTextColor)

static bool js_cocos2dx_ui_Text_enableGlow(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_enableGlow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Color4B arg0;
        ok &= seval_to_Color4B(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_enableGlow : Error processing arguments");
        cobj->enableGlow(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_enableGlow)

static bool js_cocos2dx_ui_Text_getTextVerticalAlignment(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_getTextVerticalAlignment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        char result = (char)cobj->getTextVerticalAlignment();
        ok &= int8_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_getTextVerticalAlignment : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_getTextVerticalAlignment)

static bool js_cocos2dx_ui_Text_getTextAreaSize(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_getTextAreaSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Size& result = cobj->getTextAreaSize();
        ok &= Size_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_getTextAreaSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_getTextAreaSize)

static bool js_cocos2dx_ui_Text_setTextHorizontalAlignment(se::State& s)
{
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Text_setTextHorizontalAlignment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::TextHAlignment arg0;
        ok &= seval_to_int8(args[0], (int8_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_setTextHorizontalAlignment : Error processing arguments");
        cobj->setTextHorizontalAlignment(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_setTextHorizontalAlignment)

static bool js_cocos2dx_ui_Text_create(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= seval_to_float(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Text* result = cocos2d::ui::Text::create(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<cocos2d::ui::Text>((cocos2d::ui::Text*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 0) {
            cocos2d::ui::Text* result = cocos2d::ui::Text::create();
            ok &= native_ptr_to_seval<cocos2d::ui::Text>((cocos2d::ui::Text*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Text_create : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Text_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_Text_finalize)

static bool js_cocos2dx_ui_Text_constructor(se::State& s)
{
    cocos2d::ui::Text* cobj = new (std::nothrow) cocos2d::ui::Text();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_Text_constructor, __jsb_cocos2d_ui_Text_class, js_cocos2d_ui_Text_finalize)

static bool js_cocos2dx_ui_Text_ctor(se::State& s)
{
    cocos2d::ui::Text* cobj = new (std::nothrow) cocos2d::ui::Text();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_Text_ctor, __jsb_cocos2d_ui_Text_class, js_cocos2d_ui_Text_finalize)


    

extern se::Object* __jsb_cocos2d_ui_Widget_proto;

static bool js_cocos2d_ui_Text_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::Text)", s.nativeThisObject());
    cocos2d::ui::Text* cobj = (cocos2d::ui::Text*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_Text_finalize)

bool js_register_cocos2dx_ui_Text(se::Object* obj)
{
    auto cls = se::Class::create("Text", obj, __jsb_cocos2d_ui_Widget_proto, _SE(js_cocos2dx_ui_Text_constructor));

    cls->defineFunction("enableShadow", _SE(js_cocos2dx_ui_Text_enableShadow));
    cls->defineFunction("getFontSize", _SE(js_cocos2dx_ui_Text_getFontSize));
    cls->defineFunction("getString", _SE(js_cocos2dx_ui_Text_getString));
    cls->defineFunction("disableEffect", _SE(js_cocos2dx_ui_Text_disableEffect));
    cls->defineFunction("getLabelEffectType", _SE(js_cocos2dx_ui_Text_getLabelEffectType));
    cls->defineFunction("getTextColor", _SE(js_cocos2dx_ui_Text_getTextColor));
    cls->defineFunction("setTextVerticalAlignment", _SE(js_cocos2dx_ui_Text_setTextVerticalAlignment));
    cls->defineFunction("setFontName", _SE(js_cocos2dx_ui_Text_setFontName));
    cls->defineFunction("setTouchScaleChangeEnabled", _SE(js_cocos2dx_ui_Text_setTouchScaleChangeEnabled));
    cls->defineFunction("getShadowOffset", _SE(js_cocos2dx_ui_Text_getShadowOffset));
    cls->defineFunction("setString", _SE(js_cocos2dx_ui_Text_setString));
    cls->defineFunction("getOutlineSize", _SE(js_cocos2dx_ui_Text_getOutlineSize));
    cls->defineFunction("init", _SE(js_cocos2dx_ui_Text_init));
    cls->defineFunction("getShadowBlurRadius", _SE(js_cocos2dx_ui_Text_getShadowBlurRadius));
    cls->defineFunction("isTouchScaleChangeEnabled", _SE(js_cocos2dx_ui_Text_isTouchScaleChangeEnabled));
    cls->defineFunction("getFontName", _SE(js_cocos2dx_ui_Text_getFontName));
    cls->defineFunction("setTextAreaSize", _SE(js_cocos2dx_ui_Text_setTextAreaSize));
    cls->defineFunction("getStringLength", _SE(js_cocos2dx_ui_Text_getStringLength));
    cls->defineFunction("getAutoRenderSize", _SE(js_cocos2dx_ui_Text_getAutoRenderSize));
    cls->defineFunction("enableOutline", _SE(js_cocos2dx_ui_Text_enableOutline));
    cls->defineFunction("getEffectColor", _SE(js_cocos2dx_ui_Text_getEffectColor));
    cls->defineFunction("getType", _SE(js_cocos2dx_ui_Text_getType));
    cls->defineFunction("getTextHorizontalAlignment", _SE(js_cocos2dx_ui_Text_getTextHorizontalAlignment));
    cls->defineFunction("isShadowEnabled", _SE(js_cocos2dx_ui_Text_isShadowEnabled));
    cls->defineFunction("setFontSize", _SE(js_cocos2dx_ui_Text_setFontSize));
    cls->defineFunction("getShadowColor", _SE(js_cocos2dx_ui_Text_getShadowColor));
    cls->defineFunction("setTextColor", _SE(js_cocos2dx_ui_Text_setTextColor));
    cls->defineFunction("enableGlow", _SE(js_cocos2dx_ui_Text_enableGlow));
    cls->defineFunction("getTextVerticalAlignment", _SE(js_cocos2dx_ui_Text_getTextVerticalAlignment));
    cls->defineFunction("getTextAreaSize", _SE(js_cocos2dx_ui_Text_getTextAreaSize));
    cls->defineFunction("setTextHorizontalAlignment", _SE(js_cocos2dx_ui_Text_setTextHorizontalAlignment));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_Text_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_Text_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_Text_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::Text>(cls);

    __jsb_cocos2d_ui_Text_proto = cls->getProto();
    __jsb_cocos2d_ui_Text_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.Text.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_TextAtlas_proto = nullptr;
se::Class* __jsb_cocos2d_ui_TextAtlas_class = nullptr;

static bool js_cocos2dx_ui_TextAtlas_getStringLength(se::State& s)
{
    cocos2d::ui::TextAtlas* cobj = (cocos2d::ui::TextAtlas*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextAtlas_getStringLength : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        ssize_t result = cobj->getStringLength();
        ok &= ssize_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextAtlas_getStringLength : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextAtlas_getStringLength)

static bool js_cocos2dx_ui_TextAtlas_getString(se::State& s)
{
    cocos2d::ui::TextAtlas* cobj = (cocos2d::ui::TextAtlas*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextAtlas_getString : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getString();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextAtlas_getString : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextAtlas_getString)

static bool js_cocos2dx_ui_TextAtlas_setString(se::State& s)
{
    cocos2d::ui::TextAtlas* cobj = (cocos2d::ui::TextAtlas*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextAtlas_setString : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextAtlas_setString : Error processing arguments");
        cobj->setString(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextAtlas_setString)

static bool js_cocos2dx_ui_TextAtlas_getRenderFile(se::State& s)
{
    cocos2d::ui::TextAtlas* cobj = (cocos2d::ui::TextAtlas*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextAtlas_getRenderFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ResourceData result = cobj->getRenderFile();
        ok &= ResourceData_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextAtlas_getRenderFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextAtlas_getRenderFile)

static bool js_cocos2dx_ui_TextAtlas_setProperty(se::State& s)
{
    cocos2d::ui::TextAtlas* cobj = (cocos2d::ui::TextAtlas*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextAtlas_setProperty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        std::string arg0;
        std::string arg1;
        int arg2 = 0;
        int arg3 = 0;
        std::string arg4;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        ok &= seval_to_int32(args[3], (int32_t*)&arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextAtlas_setProperty : Error processing arguments");
        cobj->setProperty(arg0, arg1, arg2, arg3, arg4);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextAtlas_setProperty)

static bool js_cocos2dx_ui_TextAtlas_adaptRenderers(se::State& s)
{
    cocos2d::ui::TextAtlas* cobj = (cocos2d::ui::TextAtlas*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextAtlas_adaptRenderers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->adaptRenderers();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextAtlas_adaptRenderers)

static bool js_cocos2dx_ui_TextAtlas_create(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 5) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            int arg2 = 0;
            ok &= seval_to_int32(args[2], (int32_t*)&arg2);
            if (!ok) { ok = true; break; }
            int arg3 = 0;
            ok &= seval_to_int32(args[3], (int32_t*)&arg3);
            if (!ok) { ok = true; break; }
            std::string arg4;
            ok &= seval_to_std_string(args[4], &arg4);
            if (!ok) { ok = true; break; }
            cocos2d::ui::TextAtlas* result = cocos2d::ui::TextAtlas::create(arg0, arg1, arg2, arg3, arg4);
            ok &= native_ptr_to_seval<cocos2d::ui::TextAtlas>((cocos2d::ui::TextAtlas*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextAtlas_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 0) {
            cocos2d::ui::TextAtlas* result = cocos2d::ui::TextAtlas::create();
            ok &= native_ptr_to_seval<cocos2d::ui::TextAtlas>((cocos2d::ui::TextAtlas*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextAtlas_create : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextAtlas_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_TextAtlas_finalize)

static bool js_cocos2dx_ui_TextAtlas_constructor(se::State& s)
{
    cocos2d::ui::TextAtlas* cobj = new (std::nothrow) cocos2d::ui::TextAtlas();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_TextAtlas_constructor, __jsb_cocos2d_ui_TextAtlas_class, js_cocos2d_ui_TextAtlas_finalize)

static bool js_cocos2dx_ui_TextAtlas_ctor(se::State& s)
{
    cocos2d::ui::TextAtlas* cobj = new (std::nothrow) cocos2d::ui::TextAtlas();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_TextAtlas_ctor, __jsb_cocos2d_ui_TextAtlas_class, js_cocos2d_ui_TextAtlas_finalize)


    

extern se::Object* __jsb_cocos2d_ui_Widget_proto;

static bool js_cocos2d_ui_TextAtlas_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::TextAtlas)", s.nativeThisObject());
    cocos2d::ui::TextAtlas* cobj = (cocos2d::ui::TextAtlas*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_TextAtlas_finalize)

bool js_register_cocos2dx_ui_TextAtlas(se::Object* obj)
{
    auto cls = se::Class::create("TextAtlas", obj, __jsb_cocos2d_ui_Widget_proto, _SE(js_cocos2dx_ui_TextAtlas_constructor));

    cls->defineFunction("getStringLength", _SE(js_cocos2dx_ui_TextAtlas_getStringLength));
    cls->defineFunction("getString", _SE(js_cocos2dx_ui_TextAtlas_getString));
    cls->defineFunction("setString", _SE(js_cocos2dx_ui_TextAtlas_setString));
    cls->defineFunction("getRenderFile", _SE(js_cocos2dx_ui_TextAtlas_getRenderFile));
    cls->defineFunction("setProperty", _SE(js_cocos2dx_ui_TextAtlas_setProperty));
    cls->defineFunction("adaptRenderers", _SE(js_cocos2dx_ui_TextAtlas_adaptRenderers));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_TextAtlas_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_TextAtlas_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_TextAtlas_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::TextAtlas>(cls);

    __jsb_cocos2d_ui_TextAtlas_proto = cls->getProto();
    __jsb_cocos2d_ui_TextAtlas_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.TextAtlas.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_LoadingBar_proto = nullptr;
se::Class* __jsb_cocos2d_ui_LoadingBar_class = nullptr;

static bool js_cocos2dx_ui_LoadingBar_setPercent(se::State& s)
{
    cocos2d::ui::LoadingBar* cobj = (cocos2d::ui::LoadingBar*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LoadingBar_setPercent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LoadingBar_setPercent : Error processing arguments");
        cobj->setPercent(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LoadingBar_setPercent)

static bool js_cocos2dx_ui_LoadingBar_loadTexture(se::State& s)
{
    cocos2d::ui::LoadingBar* cobj = (cocos2d::ui::LoadingBar*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LoadingBar_loadTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LoadingBar_loadTexture : Error processing arguments");
        cobj->loadTexture(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        cocos2d::ui::Widget::TextureResType arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LoadingBar_loadTexture : Error processing arguments");
        cobj->loadTexture(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LoadingBar_loadTexture)

static bool js_cocos2dx_ui_LoadingBar_setDirection(se::State& s)
{
    cocos2d::ui::LoadingBar* cobj = (cocos2d::ui::LoadingBar*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LoadingBar_setDirection : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::LoadingBar::Direction arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LoadingBar_setDirection : Error processing arguments");
        cobj->setDirection(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LoadingBar_setDirection)

static bool js_cocos2dx_ui_LoadingBar_getRenderFile(se::State& s)
{
    cocos2d::ui::LoadingBar* cobj = (cocos2d::ui::LoadingBar*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LoadingBar_getRenderFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ResourceData result = cobj->getRenderFile();
        ok &= ResourceData_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LoadingBar_getRenderFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LoadingBar_getRenderFile)

static bool js_cocos2dx_ui_LoadingBar_setScale9Enabled(se::State& s)
{
    cocos2d::ui::LoadingBar* cobj = (cocos2d::ui::LoadingBar*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LoadingBar_setScale9Enabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LoadingBar_setScale9Enabled : Error processing arguments");
        cobj->setScale9Enabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LoadingBar_setScale9Enabled)

static bool js_cocos2dx_ui_LoadingBar_setCapInsets(se::State& s)
{
    cocos2d::ui::LoadingBar* cobj = (cocos2d::ui::LoadingBar*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LoadingBar_setCapInsets : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Rect arg0;
        ok &= seval_to_Rect(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LoadingBar_setCapInsets : Error processing arguments");
        cobj->setCapInsets(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LoadingBar_setCapInsets)

static bool js_cocos2dx_ui_LoadingBar_getDirection(se::State& s)
{
    cocos2d::ui::LoadingBar* cobj = (cocos2d::ui::LoadingBar*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LoadingBar_getDirection : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getDirection();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LoadingBar_getDirection : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LoadingBar_getDirection)

static bool js_cocos2dx_ui_LoadingBar_getCapInsets(se::State& s)
{
    cocos2d::ui::LoadingBar* cobj = (cocos2d::ui::LoadingBar*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LoadingBar_getCapInsets : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Rect& result = cobj->getCapInsets();
        ok &= Rect_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LoadingBar_getCapInsets : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LoadingBar_getCapInsets)

static bool js_cocos2dx_ui_LoadingBar_isScale9Enabled(se::State& s)
{
    cocos2d::ui::LoadingBar* cobj = (cocos2d::ui::LoadingBar*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LoadingBar_isScale9Enabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isScale9Enabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LoadingBar_isScale9Enabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LoadingBar_isScale9Enabled)

static bool js_cocos2dx_ui_LoadingBar_getPercent(se::State& s)
{
    cocos2d::ui::LoadingBar* cobj = (cocos2d::ui::LoadingBar*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LoadingBar_getPercent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getPercent();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LoadingBar_getPercent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LoadingBar_getPercent)

static bool js_cocos2dx_ui_LoadingBar_create(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::ui::LoadingBar* result = cocos2d::ui::LoadingBar::create(arg0);
            ok &= native_ptr_to_seval<cocos2d::ui::LoadingBar>((cocos2d::ui::LoadingBar*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LoadingBar_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            float arg1 = 0;
            ok &= seval_to_float(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::LoadingBar* result = cocos2d::ui::LoadingBar::create(arg0, arg1);
            ok &= native_ptr_to_seval<cocos2d::ui::LoadingBar>((cocos2d::ui::LoadingBar*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LoadingBar_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 0) {
            cocos2d::ui::LoadingBar* result = cocos2d::ui::LoadingBar::create();
            ok &= native_ptr_to_seval<cocos2d::ui::LoadingBar>((cocos2d::ui::LoadingBar*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LoadingBar_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Widget::TextureResType arg1;
            ok &= seval_to_int32(args[1], (int32_t*)&arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::LoadingBar* result = cocos2d::ui::LoadingBar::create(arg0, arg1);
            ok &= native_ptr_to_seval<cocos2d::ui::LoadingBar>((cocos2d::ui::LoadingBar*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LoadingBar_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Widget::TextureResType arg1;
            ok &= seval_to_int32(args[1], (int32_t*)&arg1);
            if (!ok) { ok = true; break; }
            float arg2 = 0;
            ok &= seval_to_float(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cocos2d::ui::LoadingBar* result = cocos2d::ui::LoadingBar::create(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<cocos2d::ui::LoadingBar>((cocos2d::ui::LoadingBar*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LoadingBar_create : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LoadingBar_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_LoadingBar_finalize)

static bool js_cocos2dx_ui_LoadingBar_constructor(se::State& s)
{
    cocos2d::ui::LoadingBar* cobj = new (std::nothrow) cocos2d::ui::LoadingBar();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_LoadingBar_constructor, __jsb_cocos2d_ui_LoadingBar_class, js_cocos2d_ui_LoadingBar_finalize)

static bool js_cocos2dx_ui_LoadingBar_ctor(se::State& s)
{
    cocos2d::ui::LoadingBar* cobj = new (std::nothrow) cocos2d::ui::LoadingBar();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_LoadingBar_ctor, __jsb_cocos2d_ui_LoadingBar_class, js_cocos2d_ui_LoadingBar_finalize)


    

extern se::Object* __jsb_cocos2d_ui_Widget_proto;

static bool js_cocos2d_ui_LoadingBar_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::LoadingBar)", s.nativeThisObject());
    cocos2d::ui::LoadingBar* cobj = (cocos2d::ui::LoadingBar*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_LoadingBar_finalize)

bool js_register_cocos2dx_ui_LoadingBar(se::Object* obj)
{
    auto cls = se::Class::create("LoadingBar", obj, __jsb_cocos2d_ui_Widget_proto, _SE(js_cocos2dx_ui_LoadingBar_constructor));

    cls->defineFunction("setPercent", _SE(js_cocos2dx_ui_LoadingBar_setPercent));
    cls->defineFunction("loadTexture", _SE(js_cocos2dx_ui_LoadingBar_loadTexture));
    cls->defineFunction("setDirection", _SE(js_cocos2dx_ui_LoadingBar_setDirection));
    cls->defineFunction("getRenderFile", _SE(js_cocos2dx_ui_LoadingBar_getRenderFile));
    cls->defineFunction("setScale9Enabled", _SE(js_cocos2dx_ui_LoadingBar_setScale9Enabled));
    cls->defineFunction("setCapInsets", _SE(js_cocos2dx_ui_LoadingBar_setCapInsets));
    cls->defineFunction("getDirection", _SE(js_cocos2dx_ui_LoadingBar_getDirection));
    cls->defineFunction("getCapInsets", _SE(js_cocos2dx_ui_LoadingBar_getCapInsets));
    cls->defineFunction("isScale9Enabled", _SE(js_cocos2dx_ui_LoadingBar_isScale9Enabled));
    cls->defineFunction("getPercent", _SE(js_cocos2dx_ui_LoadingBar_getPercent));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_LoadingBar_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_LoadingBar_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_LoadingBar_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::LoadingBar>(cls);

    __jsb_cocos2d_ui_LoadingBar_proto = cls->getProto();
    __jsb_cocos2d_ui_LoadingBar_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.LoadingBar.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_ScrollView_proto = nullptr;
se::Class* __jsb_cocos2d_ui_ScrollView_class = nullptr;

static bool js_cocos2dx_ui_ScrollView_scrollToTop(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_scrollToTop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        bool arg1;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_scrollToTop : Error processing arguments");
        cobj->scrollToTop(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_scrollToTop)

static bool js_cocos2dx_ui_ScrollView_scrollToPercentHorizontal(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_scrollToPercentHorizontal : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        float arg0 = 0;
        float arg1 = 0;
        bool arg2;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_boolean(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_scrollToPercentHorizontal : Error processing arguments");
        cobj->scrollToPercentHorizontal(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_scrollToPercentHorizontal)

static bool js_cocos2dx_ui_ScrollView_setScrollBarOpacity(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_setScrollBarOpacity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        uint8_t arg0;
        ok &= seval_to_uint8(args[0], (uint8_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_setScrollBarOpacity : Error processing arguments");
        cobj->setScrollBarOpacity(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_setScrollBarOpacity)

static bool js_cocos2dx_ui_ScrollView_setScrollBarEnabled(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_setScrollBarEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_setScrollBarEnabled : Error processing arguments");
        cobj->setScrollBarEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_setScrollBarEnabled)

static bool js_cocos2dx_ui_ScrollView_isInertiaScrollEnabled(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_isInertiaScrollEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isInertiaScrollEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_isInertiaScrollEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_isInertiaScrollEnabled)

static bool js_cocos2dx_ui_ScrollView_scrollToBottom(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_scrollToBottom : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        bool arg1;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_scrollToBottom : Error processing arguments");
        cobj->scrollToBottom(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_scrollToBottom)

static bool js_cocos2dx_ui_ScrollView_getDirection(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_getDirection : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getDirection();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_getDirection : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_getDirection)

static bool js_cocos2dx_ui_ScrollView_setScrollBarColor(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_setScrollBarColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Color3B arg0;
        ok &= seval_to_Color3B(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_setScrollBarColor : Error processing arguments");
        cobj->setScrollBarColor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_setScrollBarColor)

static bool js_cocos2dx_ui_ScrollView_scrollToBottomLeft(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_scrollToBottomLeft : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        bool arg1;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_scrollToBottomLeft : Error processing arguments");
        cobj->scrollToBottomLeft(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_scrollToBottomLeft)

static bool js_cocos2dx_ui_ScrollView_getInnerContainer(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_getInnerContainer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ui::Layout* result = cobj->getInnerContainer();
        ok &= native_ptr_to_seval<cocos2d::ui::Layout>((cocos2d::ui::Layout*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_getInnerContainer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_getInnerContainer)

static bool js_cocos2dx_ui_ScrollView_jumpToBottom(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_jumpToBottom : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->jumpToBottom();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_jumpToBottom)

static bool js_cocos2dx_ui_ScrollView_setInnerContainerPosition(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_setInnerContainerPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_setInnerContainerPosition : Error processing arguments");
        cobj->setInnerContainerPosition(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_setInnerContainerPosition)

static bool js_cocos2dx_ui_ScrollView_setDirection(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_setDirection : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::ScrollView::Direction arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_setDirection : Error processing arguments");
        cobj->setDirection(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_setDirection)

static bool js_cocos2dx_ui_ScrollView_scrollToTopLeft(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_scrollToTopLeft : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        bool arg1;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_scrollToTopLeft : Error processing arguments");
        cobj->scrollToTopLeft(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_scrollToTopLeft)

static bool js_cocos2dx_ui_ScrollView_jumpToTopRight(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_jumpToTopRight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->jumpToTopRight();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_jumpToTopRight)

static bool js_cocos2dx_ui_ScrollView_scrollToPercentBothDirection(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_scrollToPercentBothDirection : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::Vec2 arg0;
        float arg1 = 0;
        bool arg2;
        ok &= seval_to_Vec2(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_boolean(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_scrollToPercentBothDirection : Error processing arguments");
        cobj->scrollToPercentBothDirection(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_scrollToPercentBothDirection)

static bool js_cocos2dx_ui_ScrollView_setInnerContainerSize(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_setInnerContainerSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Size arg0;
        ok &= seval_to_Size(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_setInnerContainerSize : Error processing arguments");
        cobj->setInnerContainerSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_setInnerContainerSize)

static bool js_cocos2dx_ui_ScrollView_getInnerContainerPosition(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_getInnerContainerPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Vec2& result = cobj->getInnerContainerPosition();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_getInnerContainerPosition : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_getInnerContainerPosition)

static bool js_cocos2dx_ui_ScrollView_getInnerContainerSize(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_getInnerContainerSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Size& result = cobj->getInnerContainerSize();
        ok &= Size_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_getInnerContainerSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_getInnerContainerSize)

static bool js_cocos2dx_ui_ScrollView_isBounceEnabled(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_isBounceEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isBounceEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_isBounceEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_isBounceEnabled)

static bool js_cocos2dx_ui_ScrollView_jumpToPercentVertical(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_jumpToPercentVertical : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_jumpToPercentVertical : Error processing arguments");
        cobj->jumpToPercentVertical(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_jumpToPercentVertical)

static bool js_cocos2dx_ui_ScrollView_addEventListener(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_addEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (cocos2d::Ref *, cocos2d::ui::ScrollView::EventType)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachChild(jsFunc.toObject());
                auto lambda = [=](cocos2d::Ref* larg0, cocos2d::ui::ScrollView::EventType larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= native_ptr_to_seval<cocos2d::Ref>((cocos2d::Ref*)larg0, &args[0]);
                    ok &= int32_to_seval((int32_t)larg1, &args[1]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_addEventListener : Error processing arguments");
        cobj->addEventListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_addEventListener)

static bool js_cocos2dx_ui_ScrollView_setScrollBarAutoHideTime(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_setScrollBarAutoHideTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_setScrollBarAutoHideTime : Error processing arguments");
        cobj->setScrollBarAutoHideTime(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_setScrollBarAutoHideTime)

static bool js_cocos2dx_ui_ScrollView_setScrollBarPositionFromCornerForHorizontal(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_setScrollBarPositionFromCornerForHorizontal : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_setScrollBarPositionFromCornerForHorizontal : Error processing arguments");
        cobj->setScrollBarPositionFromCornerForHorizontal(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_setScrollBarPositionFromCornerForHorizontal)

static bool js_cocos2dx_ui_ScrollView_setInertiaScrollEnabled(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_setInertiaScrollEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_setInertiaScrollEnabled : Error processing arguments");
        cobj->setInertiaScrollEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_setInertiaScrollEnabled)

static bool js_cocos2dx_ui_ScrollView_setScrollBarAutoHideEnabled(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_setScrollBarAutoHideEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_setScrollBarAutoHideEnabled : Error processing arguments");
        cobj->setScrollBarAutoHideEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_setScrollBarAutoHideEnabled)

static bool js_cocos2dx_ui_ScrollView_getScrollBarColor(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_getScrollBarColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Color3B& result = cobj->getScrollBarColor();
        ok &= Color3B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_getScrollBarColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_getScrollBarColor)

static bool js_cocos2dx_ui_ScrollView_jumpToTopLeft(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_jumpToTopLeft : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->jumpToTopLeft();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_jumpToTopLeft)

static bool js_cocos2dx_ui_ScrollView_jumpToPercentHorizontal(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_jumpToPercentHorizontal : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_jumpToPercentHorizontal : Error processing arguments");
        cobj->jumpToPercentHorizontal(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_jumpToPercentHorizontal)

static bool js_cocos2dx_ui_ScrollView_jumpToBottomRight(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_jumpToBottomRight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->jumpToBottomRight();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_jumpToBottomRight)

static bool js_cocos2dx_ui_ScrollView_setTouchTotalTimeThreshold(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_setTouchTotalTimeThreshold : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_setTouchTotalTimeThreshold : Error processing arguments");
        cobj->setTouchTotalTimeThreshold(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_setTouchTotalTimeThreshold)

static bool js_cocos2dx_ui_ScrollView_getTouchTotalTimeThreshold(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_getTouchTotalTimeThreshold : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTouchTotalTimeThreshold();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_getTouchTotalTimeThreshold : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_getTouchTotalTimeThreshold)

static bool js_cocos2dx_ui_ScrollView_getScrollBarPositionFromCornerForHorizontal(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_getScrollBarPositionFromCornerForHorizontal : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Vec2 result = cobj->getScrollBarPositionFromCornerForHorizontal();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_getScrollBarPositionFromCornerForHorizontal : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_getScrollBarPositionFromCornerForHorizontal)

static bool js_cocos2dx_ui_ScrollView_setScrollBarWidth(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_setScrollBarWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_setScrollBarWidth : Error processing arguments");
        cobj->setScrollBarWidth(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_setScrollBarWidth)

static bool js_cocos2dx_ui_ScrollView_setBounceEnabled(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_setBounceEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_setBounceEnabled : Error processing arguments");
        cobj->setBounceEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_setBounceEnabled)

static bool js_cocos2dx_ui_ScrollView_stopAutoScroll(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_stopAutoScroll : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stopAutoScroll();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_stopAutoScroll)

static bool js_cocos2dx_ui_ScrollView_jumpToTop(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_jumpToTop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->jumpToTop();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_jumpToTop)

static bool js_cocos2dx_ui_ScrollView_scrollToLeft(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_scrollToLeft : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        bool arg1;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_scrollToLeft : Error processing arguments");
        cobj->scrollToLeft(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_scrollToLeft)

static bool js_cocos2dx_ui_ScrollView_jumpToPercentBothDirection(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_jumpToPercentBothDirection : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_jumpToPercentBothDirection : Error processing arguments");
        cobj->jumpToPercentBothDirection(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_jumpToPercentBothDirection)

static bool js_cocos2dx_ui_ScrollView_getScrollBarPositionFromCornerForVertical(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_getScrollBarPositionFromCornerForVertical : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Vec2 result = cobj->getScrollBarPositionFromCornerForVertical();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_getScrollBarPositionFromCornerForVertical : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_getScrollBarPositionFromCornerForVertical)

static bool js_cocos2dx_ui_ScrollView_scrollToPercentVertical(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_scrollToPercentVertical : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        float arg0 = 0;
        float arg1 = 0;
        bool arg2;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_boolean(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_scrollToPercentVertical : Error processing arguments");
        cobj->scrollToPercentVertical(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_scrollToPercentVertical)

static bool js_cocos2dx_ui_ScrollView_getScrollBarOpacity(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_getScrollBarOpacity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        uint8_t result = cobj->getScrollBarOpacity();
        ok &= uint8_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_getScrollBarOpacity : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_getScrollBarOpacity)

static bool js_cocos2dx_ui_ScrollView_scrollToBottomRight(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_scrollToBottomRight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        bool arg1;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_scrollToBottomRight : Error processing arguments");
        cobj->scrollToBottomRight(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_scrollToBottomRight)

static bool js_cocos2dx_ui_ScrollView_setScrollBarPositionFromCorner(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_setScrollBarPositionFromCorner : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_setScrollBarPositionFromCorner : Error processing arguments");
        cobj->setScrollBarPositionFromCorner(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_setScrollBarPositionFromCorner)

static bool js_cocos2dx_ui_ScrollView_setScrollBarPositionFromCornerForVertical(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_setScrollBarPositionFromCornerForVertical : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_setScrollBarPositionFromCornerForVertical : Error processing arguments");
        cobj->setScrollBarPositionFromCornerForVertical(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_setScrollBarPositionFromCornerForVertical)

static bool js_cocos2dx_ui_ScrollView_getScrollBarAutoHideTime(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_getScrollBarAutoHideTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getScrollBarAutoHideTime();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_getScrollBarAutoHideTime : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_getScrollBarAutoHideTime)

static bool js_cocos2dx_ui_ScrollView_jumpToLeft(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_jumpToLeft : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->jumpToLeft();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_jumpToLeft)

static bool js_cocos2dx_ui_ScrollView_scrollToRight(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_scrollToRight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        bool arg1;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_scrollToRight : Error processing arguments");
        cobj->scrollToRight(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_scrollToRight)

static bool js_cocos2dx_ui_ScrollView_isScrollBarEnabled(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_isScrollBarEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isScrollBarEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_isScrollBarEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_isScrollBarEnabled)

static bool js_cocos2dx_ui_ScrollView_getScrollBarWidth(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_getScrollBarWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getScrollBarWidth();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_getScrollBarWidth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_getScrollBarWidth)

static bool js_cocos2dx_ui_ScrollView_isScrollBarAutoHideEnabled(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_isScrollBarAutoHideEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isScrollBarAutoHideEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_isScrollBarAutoHideEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_isScrollBarAutoHideEnabled)

static bool js_cocos2dx_ui_ScrollView_jumpToBottomLeft(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_jumpToBottomLeft : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->jumpToBottomLeft();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_jumpToBottomLeft)

static bool js_cocos2dx_ui_ScrollView_jumpToRight(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_jumpToRight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->jumpToRight();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_jumpToRight)

static bool js_cocos2dx_ui_ScrollView_scrollToTopRight(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ScrollView_scrollToTopRight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        bool arg1;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ScrollView_scrollToTopRight : Error processing arguments");
        cobj->scrollToTopRight(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_scrollToTopRight)

static bool js_cocos2dx_ui_ScrollView_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = cocos2d::ui::ScrollView::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_ScrollView_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ScrollView_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_ScrollView_finalize)

static bool js_cocos2dx_ui_ScrollView_constructor(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = new (std::nothrow) cocos2d::ui::ScrollView();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_ScrollView_constructor, __jsb_cocos2d_ui_ScrollView_class, js_cocos2d_ui_ScrollView_finalize)

static bool js_cocos2dx_ui_ScrollView_ctor(se::State& s)
{
    cocos2d::ui::ScrollView* cobj = new (std::nothrow) cocos2d::ui::ScrollView();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_ScrollView_ctor, __jsb_cocos2d_ui_ScrollView_class, js_cocos2d_ui_ScrollView_finalize)


    

extern se::Object* __jsb_cocos2d_ui_Layout_proto;

static bool js_cocos2d_ui_ScrollView_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::ScrollView)", s.nativeThisObject());
    cocos2d::ui::ScrollView* cobj = (cocos2d::ui::ScrollView*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_ScrollView_finalize)

bool js_register_cocos2dx_ui_ScrollView(se::Object* obj)
{
    auto cls = se::Class::create("ScrollView", obj, __jsb_cocos2d_ui_Layout_proto, _SE(js_cocos2dx_ui_ScrollView_constructor));

    cls->defineFunction("scrollToTop", _SE(js_cocos2dx_ui_ScrollView_scrollToTop));
    cls->defineFunction("scrollToPercentHorizontal", _SE(js_cocos2dx_ui_ScrollView_scrollToPercentHorizontal));
    cls->defineFunction("setScrollBarOpacity", _SE(js_cocos2dx_ui_ScrollView_setScrollBarOpacity));
    cls->defineFunction("setScrollBarEnabled", _SE(js_cocos2dx_ui_ScrollView_setScrollBarEnabled));
    cls->defineFunction("isInertiaScrollEnabled", _SE(js_cocos2dx_ui_ScrollView_isInertiaScrollEnabled));
    cls->defineFunction("scrollToBottom", _SE(js_cocos2dx_ui_ScrollView_scrollToBottom));
    cls->defineFunction("getDirection", _SE(js_cocos2dx_ui_ScrollView_getDirection));
    cls->defineFunction("setScrollBarColor", _SE(js_cocos2dx_ui_ScrollView_setScrollBarColor));
    cls->defineFunction("scrollToBottomLeft", _SE(js_cocos2dx_ui_ScrollView_scrollToBottomLeft));
    cls->defineFunction("getInnerContainer", _SE(js_cocos2dx_ui_ScrollView_getInnerContainer));
    cls->defineFunction("jumpToBottom", _SE(js_cocos2dx_ui_ScrollView_jumpToBottom));
    cls->defineFunction("setInnerContainerPosition", _SE(js_cocos2dx_ui_ScrollView_setInnerContainerPosition));
    cls->defineFunction("setDirection", _SE(js_cocos2dx_ui_ScrollView_setDirection));
    cls->defineFunction("scrollToTopLeft", _SE(js_cocos2dx_ui_ScrollView_scrollToTopLeft));
    cls->defineFunction("jumpToTopRight", _SE(js_cocos2dx_ui_ScrollView_jumpToTopRight));
    cls->defineFunction("scrollToPercentBothDirection", _SE(js_cocos2dx_ui_ScrollView_scrollToPercentBothDirection));
    cls->defineFunction("setInnerContainerSize", _SE(js_cocos2dx_ui_ScrollView_setInnerContainerSize));
    cls->defineFunction("getInnerContainerPosition", _SE(js_cocos2dx_ui_ScrollView_getInnerContainerPosition));
    cls->defineFunction("getInnerContainerSize", _SE(js_cocos2dx_ui_ScrollView_getInnerContainerSize));
    cls->defineFunction("isBounceEnabled", _SE(js_cocos2dx_ui_ScrollView_isBounceEnabled));
    cls->defineFunction("jumpToPercentVertical", _SE(js_cocos2dx_ui_ScrollView_jumpToPercentVertical));
    cls->defineFunction("addEventListener", _SE(js_cocos2dx_ui_ScrollView_addEventListener));
    cls->defineFunction("setScrollBarAutoHideTime", _SE(js_cocos2dx_ui_ScrollView_setScrollBarAutoHideTime));
    cls->defineFunction("setScrollBarPositionFromCornerForHorizontal", _SE(js_cocos2dx_ui_ScrollView_setScrollBarPositionFromCornerForHorizontal));
    cls->defineFunction("setInertiaScrollEnabled", _SE(js_cocos2dx_ui_ScrollView_setInertiaScrollEnabled));
    cls->defineFunction("setScrollBarAutoHideEnabled", _SE(js_cocos2dx_ui_ScrollView_setScrollBarAutoHideEnabled));
    cls->defineFunction("getScrollBarColor", _SE(js_cocos2dx_ui_ScrollView_getScrollBarColor));
    cls->defineFunction("jumpToTopLeft", _SE(js_cocos2dx_ui_ScrollView_jumpToTopLeft));
    cls->defineFunction("jumpToPercentHorizontal", _SE(js_cocos2dx_ui_ScrollView_jumpToPercentHorizontal));
    cls->defineFunction("jumpToBottomRight", _SE(js_cocos2dx_ui_ScrollView_jumpToBottomRight));
    cls->defineFunction("setTouchTotalTimeThreshold", _SE(js_cocos2dx_ui_ScrollView_setTouchTotalTimeThreshold));
    cls->defineFunction("getTouchTotalTimeThreshold", _SE(js_cocos2dx_ui_ScrollView_getTouchTotalTimeThreshold));
    cls->defineFunction("getScrollBarPositionFromCornerForHorizontal", _SE(js_cocos2dx_ui_ScrollView_getScrollBarPositionFromCornerForHorizontal));
    cls->defineFunction("setScrollBarWidth", _SE(js_cocos2dx_ui_ScrollView_setScrollBarWidth));
    cls->defineFunction("setBounceEnabled", _SE(js_cocos2dx_ui_ScrollView_setBounceEnabled));
    cls->defineFunction("stopAutoScroll", _SE(js_cocos2dx_ui_ScrollView_stopAutoScroll));
    cls->defineFunction("jumpToTop", _SE(js_cocos2dx_ui_ScrollView_jumpToTop));
    cls->defineFunction("scrollToLeft", _SE(js_cocos2dx_ui_ScrollView_scrollToLeft));
    cls->defineFunction("jumpToPercentBothDirection", _SE(js_cocos2dx_ui_ScrollView_jumpToPercentBothDirection));
    cls->defineFunction("getScrollBarPositionFromCornerForVertical", _SE(js_cocos2dx_ui_ScrollView_getScrollBarPositionFromCornerForVertical));
    cls->defineFunction("scrollToPercentVertical", _SE(js_cocos2dx_ui_ScrollView_scrollToPercentVertical));
    cls->defineFunction("getScrollBarOpacity", _SE(js_cocos2dx_ui_ScrollView_getScrollBarOpacity));
    cls->defineFunction("scrollToBottomRight", _SE(js_cocos2dx_ui_ScrollView_scrollToBottomRight));
    cls->defineFunction("setScrollBarPositionFromCorner", _SE(js_cocos2dx_ui_ScrollView_setScrollBarPositionFromCorner));
    cls->defineFunction("setScrollBarPositionFromCornerForVertical", _SE(js_cocos2dx_ui_ScrollView_setScrollBarPositionFromCornerForVertical));
    cls->defineFunction("getScrollBarAutoHideTime", _SE(js_cocos2dx_ui_ScrollView_getScrollBarAutoHideTime));
    cls->defineFunction("jumpToLeft", _SE(js_cocos2dx_ui_ScrollView_jumpToLeft));
    cls->defineFunction("scrollToRight", _SE(js_cocos2dx_ui_ScrollView_scrollToRight));
    cls->defineFunction("isScrollBarEnabled", _SE(js_cocos2dx_ui_ScrollView_isScrollBarEnabled));
    cls->defineFunction("getScrollBarWidth", _SE(js_cocos2dx_ui_ScrollView_getScrollBarWidth));
    cls->defineFunction("isScrollBarAutoHideEnabled", _SE(js_cocos2dx_ui_ScrollView_isScrollBarAutoHideEnabled));
    cls->defineFunction("jumpToBottomLeft", _SE(js_cocos2dx_ui_ScrollView_jumpToBottomLeft));
    cls->defineFunction("jumpToRight", _SE(js_cocos2dx_ui_ScrollView_jumpToRight));
    cls->defineFunction("scrollToTopRight", _SE(js_cocos2dx_ui_ScrollView_scrollToTopRight));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_ScrollView_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_ScrollView_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_ScrollView_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::ScrollView>(cls);

    __jsb_cocos2d_ui_ScrollView_proto = cls->getProto();
    __jsb_cocos2d_ui_ScrollView_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.ScrollView.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_ListView_proto = nullptr;
se::Class* __jsb_cocos2d_ui_ListView_class = nullptr;

static bool js_cocos2dx_ui_ListView_setGravity(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_setGravity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::ListView::Gravity arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_setGravity : Error processing arguments");
        cobj->setGravity(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_setGravity)

static bool js_cocos2dx_ui_ListView_removeLastItem(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_removeLastItem : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->removeLastItem();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_removeLastItem)

static bool js_cocos2dx_ui_ListView_getCenterItemInCurrentView(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_getCenterItemInCurrentView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ui::Widget* result = cobj->getCenterItemInCurrentView();
        ok &= native_ptr_to_seval<cocos2d::ui::Widget>((cocos2d::ui::Widget*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_getCenterItemInCurrentView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_getCenterItemInCurrentView)

static bool js_cocos2dx_ui_ListView_getCurSelectedIndex(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_getCurSelectedIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        ssize_t result = cobj->getCurSelectedIndex();
        ok &= ssize_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_getCurSelectedIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_getCurSelectedIndex)

static bool js_cocos2dx_ui_ListView_getScrollDuration(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_getScrollDuration : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getScrollDuration();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_getScrollDuration : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_getScrollDuration)

static bool js_cocos2dx_ui_ListView_getItemsMargin(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_getItemsMargin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getItemsMargin();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_getItemsMargin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_getItemsMargin)

static bool js_cocos2dx_ui_ListView_jumpToItem(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_jumpToItem : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        ssize_t arg0 = 0;
        cocos2d::Vec2 arg1;
        cocos2d::Vec2 arg2;
        ok &= seval_to_ssize(args[0], &arg0);
        ok &= seval_to_Vec2(args[1], &arg1);
        ok &= seval_to_Vec2(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_jumpToItem : Error processing arguments");
        cobj->jumpToItem(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_jumpToItem)

static bool js_cocos2dx_ui_ListView_setMagneticType(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_setMagneticType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::ListView::MagneticType arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_setMagneticType : Error processing arguments");
        cobj->setMagneticType(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_setMagneticType)

static bool js_cocos2dx_ui_ListView_getIndex(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_getIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::Widget* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_getIndex : Error processing arguments");
        ssize_t result = cobj->getIndex(arg0);
        ok &= ssize_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_getIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_getIndex)

static bool js_cocos2dx_ui_ListView_pushBackCustomItem(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_pushBackCustomItem : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::Widget* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_pushBackCustomItem : Error processing arguments");
        cobj->pushBackCustomItem(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_pushBackCustomItem)

static bool js_cocos2dx_ui_ListView_setCurSelectedIndex(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_setCurSelectedIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_setCurSelectedIndex : Error processing arguments");
        cobj->setCurSelectedIndex(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_setCurSelectedIndex)

static bool js_cocos2dx_ui_ListView_insertDefaultItem(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_insertDefaultItem : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        ssize_t arg0 = 0;
        ok &= seval_to_ssize(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_insertDefaultItem : Error processing arguments");
        cobj->insertDefaultItem(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_insertDefaultItem)

static bool js_cocos2dx_ui_ListView_setMagneticAllowedOutOfBoundary(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_setMagneticAllowedOutOfBoundary : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_setMagneticAllowedOutOfBoundary : Error processing arguments");
        cobj->setMagneticAllowedOutOfBoundary(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_setMagneticAllowedOutOfBoundary)

static bool js_cocos2dx_ui_ListView_addEventListener(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_addEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (cocos2d::Ref *, cocos2d::ui::ListView::EventType)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachChild(jsFunc.toObject());
                auto lambda = [=](cocos2d::Ref* larg0, cocos2d::ui::ListView::EventType larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= native_ptr_to_seval<cocos2d::Ref>((cocos2d::Ref*)larg0, &args[0]);
                    ok &= int32_to_seval((int32_t)larg1, &args[1]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_addEventListener : Error processing arguments");
        cobj->addEventListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_addEventListener)

static bool js_cocos2dx_ui_ListView_doLayout(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_doLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->doLayout();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_doLayout)

static bool js_cocos2dx_ui_ListView_getTopmostItemInCurrentView(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_getTopmostItemInCurrentView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ui::Widget* result = cobj->getTopmostItemInCurrentView();
        ok &= native_ptr_to_seval<cocos2d::ui::Widget>((cocos2d::ui::Widget*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_getTopmostItemInCurrentView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_getTopmostItemInCurrentView)

static bool js_cocos2dx_ui_ListView_removeAllItems(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_removeAllItems : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->removeAllItems();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_removeAllItems)

static bool js_cocos2dx_ui_ListView_getBottommostItemInCurrentView(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_getBottommostItemInCurrentView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ui::Widget* result = cobj->getBottommostItemInCurrentView();
        ok &= native_ptr_to_seval<cocos2d::ui::Widget>((cocos2d::ui::Widget*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_getBottommostItemInCurrentView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_getBottommostItemInCurrentView)

static bool js_cocos2dx_ui_ListView_getItems(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_getItems : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Vector<cocos2d::ui::Widget *>& result = cobj->getItems();
        ok &= Vector_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_getItems : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_getItems)

static bool js_cocos2dx_ui_ListView_getLeftmostItemInCurrentView(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_getLeftmostItemInCurrentView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ui::Widget* result = cobj->getLeftmostItemInCurrentView();
        ok &= native_ptr_to_seval<cocos2d::ui::Widget>((cocos2d::ui::Widget*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_getLeftmostItemInCurrentView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_getLeftmostItemInCurrentView)

static bool js_cocos2dx_ui_ListView_setItemsMargin(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_setItemsMargin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_setItemsMargin : Error processing arguments");
        cobj->setItemsMargin(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_setItemsMargin)

static bool js_cocos2dx_ui_ListView_getMagneticType(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_getMagneticType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getMagneticType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_getMagneticType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_getMagneticType)

static bool js_cocos2dx_ui_ListView_getItem(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_getItem : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        ssize_t arg0 = 0;
        ok &= seval_to_ssize(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_getItem : Error processing arguments");
        cocos2d::ui::Widget* result = cobj->getItem(arg0);
        ok &= native_ptr_to_seval<cocos2d::ui::Widget>((cocos2d::ui::Widget*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_getItem : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_getItem)

static bool js_cocos2dx_ui_ListView_removeItem(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_removeItem : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        ssize_t arg0 = 0;
        ok &= seval_to_ssize(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_removeItem : Error processing arguments");
        cobj->removeItem(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_removeItem)

static bool js_cocos2dx_ui_ListView_scrollToItem(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ui_ListView_scrollToItem : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 4) {
            ssize_t arg0 = 0;
            ok &= seval_to_ssize(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Vec2 arg1;
            ok &= seval_to_Vec2(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::Vec2 arg2;
            ok &= seval_to_Vec2(args[2], &arg2);
            if (!ok) { ok = true; break; }
            float arg3 = 0;
            ok &= seval_to_float(args[3], &arg3);
            if (!ok) { ok = true; break; }
            cobj->scrollToItem(arg0, arg1, arg2, arg3);
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            ssize_t arg0 = 0;
            ok &= seval_to_ssize(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Vec2 arg1;
            ok &= seval_to_Vec2(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::Vec2 arg2;
            ok &= seval_to_Vec2(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cobj->scrollToItem(arg0, arg1, arg2);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_scrollToItem)

static bool js_cocos2dx_ui_ListView_pushBackDefaultItem(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_pushBackDefaultItem : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->pushBackDefaultItem();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_pushBackDefaultItem)

static bool js_cocos2dx_ui_ListView_getMagneticAllowedOutOfBoundary(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_getMagneticAllowedOutOfBoundary : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getMagneticAllowedOutOfBoundary();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_getMagneticAllowedOutOfBoundary : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_getMagneticAllowedOutOfBoundary)

static bool js_cocos2dx_ui_ListView_getClosestItemToPosition(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_getClosestItemToPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::Vec2 arg0;
        cocos2d::Vec2 arg1;
        ok &= seval_to_Vec2(args[0], &arg0);
        ok &= seval_to_Vec2(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_getClosestItemToPosition : Error processing arguments");
        cocos2d::ui::Widget* result = cobj->getClosestItemToPosition(arg0, arg1);
        ok &= native_ptr_to_seval<cocos2d::ui::Widget>((cocos2d::ui::Widget*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_getClosestItemToPosition : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_getClosestItemToPosition)

static bool js_cocos2dx_ui_ListView_getRightmostItemInCurrentView(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_getRightmostItemInCurrentView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ui::Widget* result = cobj->getRightmostItemInCurrentView();
        ok &= native_ptr_to_seval<cocos2d::ui::Widget>((cocos2d::ui::Widget*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_getRightmostItemInCurrentView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_getRightmostItemInCurrentView)

static bool js_cocos2dx_ui_ListView_setScrollDuration(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_setScrollDuration : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_setScrollDuration : Error processing arguments");
        cobj->setScrollDuration(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_setScrollDuration)

static bool js_cocos2dx_ui_ListView_getClosestItemToPositionInCurrentView(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_getClosestItemToPositionInCurrentView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::Vec2 arg0;
        cocos2d::Vec2 arg1;
        ok &= seval_to_Vec2(args[0], &arg0);
        ok &= seval_to_Vec2(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_getClosestItemToPositionInCurrentView : Error processing arguments");
        cocos2d::ui::Widget* result = cobj->getClosestItemToPositionInCurrentView(arg0, arg1);
        ok &= native_ptr_to_seval<cocos2d::ui::Widget>((cocos2d::ui::Widget*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_getClosestItemToPositionInCurrentView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_getClosestItemToPositionInCurrentView)

static bool js_cocos2dx_ui_ListView_setItemModel(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_setItemModel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::Widget* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_setItemModel : Error processing arguments");
        cobj->setItemModel(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_setItemModel)

static bool js_cocos2dx_ui_ListView_insertCustomItem(se::State& s)
{
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_ListView_insertCustomItem : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::ui::Widget* arg0 = nullptr;
        ssize_t arg1 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_ssize(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_ListView_insertCustomItem : Error processing arguments");
        cobj->insertCustomItem(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_insertCustomItem)

static bool js_cocos2dx_ui_ListView_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = cocos2d::ui::ListView::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_ListView_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_ListView_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_ListView_finalize)

static bool js_cocos2dx_ui_ListView_constructor(se::State& s)
{
    cocos2d::ui::ListView* cobj = new (std::nothrow) cocos2d::ui::ListView();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_ListView_constructor, __jsb_cocos2d_ui_ListView_class, js_cocos2d_ui_ListView_finalize)

static bool js_cocos2dx_ui_ListView_ctor(se::State& s)
{
    cocos2d::ui::ListView* cobj = new (std::nothrow) cocos2d::ui::ListView();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_ListView_ctor, __jsb_cocos2d_ui_ListView_class, js_cocos2d_ui_ListView_finalize)


    

extern se::Object* __jsb_cocos2d_ui_ScrollView_proto;

static bool js_cocos2d_ui_ListView_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::ListView)", s.nativeThisObject());
    cocos2d::ui::ListView* cobj = (cocos2d::ui::ListView*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_ListView_finalize)

bool js_register_cocos2dx_ui_ListView(se::Object* obj)
{
    auto cls = se::Class::create("ListView", obj, __jsb_cocos2d_ui_ScrollView_proto, _SE(js_cocos2dx_ui_ListView_constructor));

    cls->defineFunction("setGravity", _SE(js_cocos2dx_ui_ListView_setGravity));
    cls->defineFunction("removeLastItem", _SE(js_cocos2dx_ui_ListView_removeLastItem));
    cls->defineFunction("getCenterItemInCurrentView", _SE(js_cocos2dx_ui_ListView_getCenterItemInCurrentView));
    cls->defineFunction("getCurSelectedIndex", _SE(js_cocos2dx_ui_ListView_getCurSelectedIndex));
    cls->defineFunction("getScrollDuration", _SE(js_cocos2dx_ui_ListView_getScrollDuration));
    cls->defineFunction("getItemsMargin", _SE(js_cocos2dx_ui_ListView_getItemsMargin));
    cls->defineFunction("jumpToItem", _SE(js_cocos2dx_ui_ListView_jumpToItem));
    cls->defineFunction("setMagneticType", _SE(js_cocos2dx_ui_ListView_setMagneticType));
    cls->defineFunction("getIndex", _SE(js_cocos2dx_ui_ListView_getIndex));
    cls->defineFunction("pushBackCustomItem", _SE(js_cocos2dx_ui_ListView_pushBackCustomItem));
    cls->defineFunction("setCurSelectedIndex", _SE(js_cocos2dx_ui_ListView_setCurSelectedIndex));
    cls->defineFunction("insertDefaultItem", _SE(js_cocos2dx_ui_ListView_insertDefaultItem));
    cls->defineFunction("setMagneticAllowedOutOfBoundary", _SE(js_cocos2dx_ui_ListView_setMagneticAllowedOutOfBoundary));
    cls->defineFunction("addEventListener", _SE(js_cocos2dx_ui_ListView_addEventListener));
    cls->defineFunction("doLayout", _SE(js_cocos2dx_ui_ListView_doLayout));
    cls->defineFunction("getTopmostItemInCurrentView", _SE(js_cocos2dx_ui_ListView_getTopmostItemInCurrentView));
    cls->defineFunction("removeAllItems", _SE(js_cocos2dx_ui_ListView_removeAllItems));
    cls->defineFunction("getBottommostItemInCurrentView", _SE(js_cocos2dx_ui_ListView_getBottommostItemInCurrentView));
    cls->defineFunction("getItems", _SE(js_cocos2dx_ui_ListView_getItems));
    cls->defineFunction("getLeftmostItemInCurrentView", _SE(js_cocos2dx_ui_ListView_getLeftmostItemInCurrentView));
    cls->defineFunction("setItemsMargin", _SE(js_cocos2dx_ui_ListView_setItemsMargin));
    cls->defineFunction("getMagneticType", _SE(js_cocos2dx_ui_ListView_getMagneticType));
    cls->defineFunction("getItem", _SE(js_cocos2dx_ui_ListView_getItem));
    cls->defineFunction("removeItem", _SE(js_cocos2dx_ui_ListView_removeItem));
    cls->defineFunction("scrollToItem", _SE(js_cocos2dx_ui_ListView_scrollToItem));
    cls->defineFunction("pushBackDefaultItem", _SE(js_cocos2dx_ui_ListView_pushBackDefaultItem));
    cls->defineFunction("getMagneticAllowedOutOfBoundary", _SE(js_cocos2dx_ui_ListView_getMagneticAllowedOutOfBoundary));
    cls->defineFunction("getClosestItemToPosition", _SE(js_cocos2dx_ui_ListView_getClosestItemToPosition));
    cls->defineFunction("getRightmostItemInCurrentView", _SE(js_cocos2dx_ui_ListView_getRightmostItemInCurrentView));
    cls->defineFunction("setScrollDuration", _SE(js_cocos2dx_ui_ListView_setScrollDuration));
    cls->defineFunction("getClosestItemToPositionInCurrentView", _SE(js_cocos2dx_ui_ListView_getClosestItemToPositionInCurrentView));
    cls->defineFunction("setItemModel", _SE(js_cocos2dx_ui_ListView_setItemModel));
    cls->defineFunction("insertCustomItem", _SE(js_cocos2dx_ui_ListView_insertCustomItem));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_ListView_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_ListView_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_ListView_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::ListView>(cls);

    __jsb_cocos2d_ui_ListView_proto = cls->getProto();
    __jsb_cocos2d_ui_ListView_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.ListView.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_Slider_proto = nullptr;
se::Class* __jsb_cocos2d_ui_Slider_class = nullptr;

static bool js_cocos2dx_ui_Slider_setPercent(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_setPercent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_setPercent : Error processing arguments");
        cobj->setPercent(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_setPercent)

static bool js_cocos2dx_ui_Slider_getMaxPercent(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_getMaxPercent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxPercent();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_getMaxPercent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_getMaxPercent)

static bool js_cocos2dx_ui_Slider_loadSlidBallTextureNormal(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_loadSlidBallTextureNormal : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_loadSlidBallTextureNormal : Error processing arguments");
        cobj->loadSlidBallTextureNormal(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        cocos2d::ui::Widget::TextureResType arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_loadSlidBallTextureNormal : Error processing arguments");
        cobj->loadSlidBallTextureNormal(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_loadSlidBallTextureNormal)

static bool js_cocos2dx_ui_Slider_loadProgressBarTexture(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_loadProgressBarTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_loadProgressBarTexture : Error processing arguments");
        cobj->loadProgressBarTexture(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        cocos2d::ui::Widget::TextureResType arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_loadProgressBarTexture : Error processing arguments");
        cobj->loadProgressBarTexture(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_loadProgressBarTexture)

static bool js_cocos2dx_ui_Slider_getBallNormalFile(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_getBallNormalFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ResourceData result = cobj->getBallNormalFile();
        ok &= ResourceData_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_getBallNormalFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_getBallNormalFile)

static bool js_cocos2dx_ui_Slider_setScale9Enabled(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_setScale9Enabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_setScale9Enabled : Error processing arguments");
        cobj->setScale9Enabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_setScale9Enabled)

static bool js_cocos2dx_ui_Slider_getBallPressedFile(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_getBallPressedFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ResourceData result = cobj->getBallPressedFile();
        ok &= ResourceData_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_getBallPressedFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_getBallPressedFile)

static bool js_cocos2dx_ui_Slider_getZoomScale(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_getZoomScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getZoomScale();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_getZoomScale : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_getZoomScale)

static bool js_cocos2dx_ui_Slider_setCapInsetProgressBarRenderer(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_setCapInsetProgressBarRenderer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Rect arg0;
        ok &= seval_to_Rect(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_setCapInsetProgressBarRenderer : Error processing arguments");
        cobj->setCapInsetProgressBarRenderer(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_setCapInsetProgressBarRenderer)

static bool js_cocos2dx_ui_Slider_loadSlidBallTextures(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_loadSlidBallTextures : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_loadSlidBallTextures : Error processing arguments");
        cobj->loadSlidBallTextures(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_loadSlidBallTextures : Error processing arguments");
        cobj->loadSlidBallTextures(arg0, arg1);
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_loadSlidBallTextures : Error processing arguments");
        cobj->loadSlidBallTextures(arg0, arg1, arg2);
        return true;
    }
    if (argc == 4) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        cocos2d::ui::Widget::TextureResType arg3;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        ok &= seval_to_int32(args[3], (int32_t*)&arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_loadSlidBallTextures : Error processing arguments");
        cobj->loadSlidBallTextures(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_loadSlidBallTextures)

static bool js_cocos2dx_ui_Slider_addEventListener(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_addEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (cocos2d::Ref *, cocos2d::ui::Slider::EventType)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachChild(jsFunc.toObject());
                auto lambda = [=](cocos2d::Ref* larg0, cocos2d::ui::Slider::EventType larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= native_ptr_to_seval<cocos2d::Ref>((cocos2d::Ref*)larg0, &args[0]);
                    ok &= int32_to_seval((int32_t)larg1, &args[1]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_addEventListener : Error processing arguments");
        cobj->addEventListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_addEventListener)

static bool js_cocos2dx_ui_Slider_setMaxPercent(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_setMaxPercent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_setMaxPercent : Error processing arguments");
        cobj->setMaxPercent(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_setMaxPercent)

static bool js_cocos2dx_ui_Slider_loadBarTexture(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_loadBarTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_loadBarTexture : Error processing arguments");
        cobj->loadBarTexture(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        cocos2d::ui::Widget::TextureResType arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_loadBarTexture : Error processing arguments");
        cobj->loadBarTexture(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_loadBarTexture)

static bool js_cocos2dx_ui_Slider_getProgressBarFile(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_getProgressBarFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ResourceData result = cobj->getProgressBarFile();
        ok &= ResourceData_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_getProgressBarFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_getProgressBarFile)

static bool js_cocos2dx_ui_Slider_getCapInsetsBarRenderer(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_getCapInsetsBarRenderer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Rect& result = cobj->getCapInsetsBarRenderer();
        ok &= Rect_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_getCapInsetsBarRenderer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_getCapInsetsBarRenderer)

static bool js_cocos2dx_ui_Slider_getCapInsetsProgressBarRenderer(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_getCapInsetsProgressBarRenderer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Rect& result = cobj->getCapInsetsProgressBarRenderer();
        ok &= Rect_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_getCapInsetsProgressBarRenderer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_getCapInsetsProgressBarRenderer)

static bool js_cocos2dx_ui_Slider_loadSlidBallTexturePressed(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_loadSlidBallTexturePressed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_loadSlidBallTexturePressed : Error processing arguments");
        cobj->loadSlidBallTexturePressed(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        cocos2d::ui::Widget::TextureResType arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_loadSlidBallTexturePressed : Error processing arguments");
        cobj->loadSlidBallTexturePressed(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_loadSlidBallTexturePressed)

static bool js_cocos2dx_ui_Slider_getBackFile(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_getBackFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ResourceData result = cobj->getBackFile();
        ok &= ResourceData_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_getBackFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_getBackFile)

static bool js_cocos2dx_ui_Slider_isScale9Enabled(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_isScale9Enabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isScale9Enabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_isScale9Enabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_isScale9Enabled)

static bool js_cocos2dx_ui_Slider_getBallDisabledFile(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_getBallDisabledFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ResourceData result = cobj->getBallDisabledFile();
        ok &= ResourceData_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_getBallDisabledFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_getBallDisabledFile)

static bool js_cocos2dx_ui_Slider_setCapInsetsBarRenderer(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_setCapInsetsBarRenderer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Rect arg0;
        ok &= seval_to_Rect(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_setCapInsetsBarRenderer : Error processing arguments");
        cobj->setCapInsetsBarRenderer(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_setCapInsetsBarRenderer)

static bool js_cocos2dx_ui_Slider_getPercent(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_getPercent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPercent();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_getPercent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_getPercent)

static bool js_cocos2dx_ui_Slider_setCapInsets(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_setCapInsets : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Rect arg0;
        ok &= seval_to_Rect(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_setCapInsets : Error processing arguments");
        cobj->setCapInsets(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_setCapInsets)

static bool js_cocos2dx_ui_Slider_loadSlidBallTextureDisabled(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_loadSlidBallTextureDisabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_loadSlidBallTextureDisabled : Error processing arguments");
        cobj->loadSlidBallTextureDisabled(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        cocos2d::ui::Widget::TextureResType arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_loadSlidBallTextureDisabled : Error processing arguments");
        cobj->loadSlidBallTextureDisabled(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_loadSlidBallTextureDisabled)

static bool js_cocos2dx_ui_Slider_setZoomScale(se::State& s)
{
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Slider_setZoomScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_setZoomScale : Error processing arguments");
        cobj->setZoomScale(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_setZoomScale)

static bool js_cocos2dx_ui_Slider_create(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Slider* result = cocos2d::ui::Slider::create(arg0, arg1);
            ok &= native_ptr_to_seval<cocos2d::ui::Slider>((cocos2d::ui::Slider*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Widget::TextureResType arg2;
            ok &= seval_to_int32(args[2], (int32_t*)&arg2);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Slider* result = cocos2d::ui::Slider::create(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<cocos2d::ui::Slider>((cocos2d::ui::Slider*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 0) {
            cocos2d::ui::Slider* result = cocos2d::ui::Slider::create();
            ok &= native_ptr_to_seval<cocos2d::ui::Slider>((cocos2d::ui::Slider*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Slider_create : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Slider_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_Slider_finalize)

static bool js_cocos2dx_ui_Slider_constructor(se::State& s)
{
    cocos2d::ui::Slider* cobj = new (std::nothrow) cocos2d::ui::Slider();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_Slider_constructor, __jsb_cocos2d_ui_Slider_class, js_cocos2d_ui_Slider_finalize)

static bool js_cocos2dx_ui_Slider_ctor(se::State& s)
{
    cocos2d::ui::Slider* cobj = new (std::nothrow) cocos2d::ui::Slider();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_Slider_ctor, __jsb_cocos2d_ui_Slider_class, js_cocos2d_ui_Slider_finalize)


    

extern se::Object* __jsb_cocos2d_ui_Widget_proto;

static bool js_cocos2d_ui_Slider_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::Slider)", s.nativeThisObject());
    cocos2d::ui::Slider* cobj = (cocos2d::ui::Slider*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_Slider_finalize)

bool js_register_cocos2dx_ui_Slider(se::Object* obj)
{
    auto cls = se::Class::create("Slider", obj, __jsb_cocos2d_ui_Widget_proto, _SE(js_cocos2dx_ui_Slider_constructor));

    cls->defineFunction("setPercent", _SE(js_cocos2dx_ui_Slider_setPercent));
    cls->defineFunction("getMaxPercent", _SE(js_cocos2dx_ui_Slider_getMaxPercent));
    cls->defineFunction("loadSlidBallTextureNormal", _SE(js_cocos2dx_ui_Slider_loadSlidBallTextureNormal));
    cls->defineFunction("loadProgressBarTexture", _SE(js_cocos2dx_ui_Slider_loadProgressBarTexture));
    cls->defineFunction("getBallNormalFile", _SE(js_cocos2dx_ui_Slider_getBallNormalFile));
    cls->defineFunction("setScale9Enabled", _SE(js_cocos2dx_ui_Slider_setScale9Enabled));
    cls->defineFunction("getBallPressedFile", _SE(js_cocos2dx_ui_Slider_getBallPressedFile));
    cls->defineFunction("getZoomScale", _SE(js_cocos2dx_ui_Slider_getZoomScale));
    cls->defineFunction("setCapInsetProgressBarRenderer", _SE(js_cocos2dx_ui_Slider_setCapInsetProgressBarRenderer));
    cls->defineFunction("loadSlidBallTextures", _SE(js_cocos2dx_ui_Slider_loadSlidBallTextures));
    cls->defineFunction("addEventListener", _SE(js_cocos2dx_ui_Slider_addEventListener));
    cls->defineFunction("setMaxPercent", _SE(js_cocos2dx_ui_Slider_setMaxPercent));
    cls->defineFunction("loadBarTexture", _SE(js_cocos2dx_ui_Slider_loadBarTexture));
    cls->defineFunction("getProgressBarFile", _SE(js_cocos2dx_ui_Slider_getProgressBarFile));
    cls->defineFunction("getCapInsetsBarRenderer", _SE(js_cocos2dx_ui_Slider_getCapInsetsBarRenderer));
    cls->defineFunction("getCapInsetsProgressBarRenderer", _SE(js_cocos2dx_ui_Slider_getCapInsetsProgressBarRenderer));
    cls->defineFunction("loadSlidBallTexturePressed", _SE(js_cocos2dx_ui_Slider_loadSlidBallTexturePressed));
    cls->defineFunction("getBackFile", _SE(js_cocos2dx_ui_Slider_getBackFile));
    cls->defineFunction("isScale9Enabled", _SE(js_cocos2dx_ui_Slider_isScale9Enabled));
    cls->defineFunction("getBallDisabledFile", _SE(js_cocos2dx_ui_Slider_getBallDisabledFile));
    cls->defineFunction("setCapInsetsBarRenderer", _SE(js_cocos2dx_ui_Slider_setCapInsetsBarRenderer));
    cls->defineFunction("getPercent", _SE(js_cocos2dx_ui_Slider_getPercent));
    cls->defineFunction("setCapInsets", _SE(js_cocos2dx_ui_Slider_setCapInsets));
    cls->defineFunction("loadSlidBallTextureDisabled", _SE(js_cocos2dx_ui_Slider_loadSlidBallTextureDisabled));
    cls->defineFunction("setZoomScale", _SE(js_cocos2dx_ui_Slider_setZoomScale));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_Slider_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_Slider_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_Slider_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::Slider>(cls);

    __jsb_cocos2d_ui_Slider_proto = cls->getProto();
    __jsb_cocos2d_ui_Slider_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.Slider.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_UICCTextField_proto = nullptr;
se::Class* __jsb_cocos2d_ui_UICCTextField_class = nullptr;

static bool js_cocos2dx_ui_UICCTextField_onTextFieldAttachWithIME(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_onTextFieldAttachWithIME : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::TextFieldTTF* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_onTextFieldAttachWithIME : Error processing arguments");
        bool result = cobj->onTextFieldAttachWithIME(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_onTextFieldAttachWithIME : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_onTextFieldAttachWithIME)

static bool js_cocos2dx_ui_UICCTextField_setPasswordText(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_setPasswordText : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_setPasswordText : Error processing arguments");
        cobj->setPasswordText(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_setPasswordText)

static bool js_cocos2dx_ui_UICCTextField_setAttachWithIME(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_setAttachWithIME : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_setAttachWithIME : Error processing arguments");
        cobj->setAttachWithIME(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_setAttachWithIME)

static bool js_cocos2dx_ui_UICCTextField_getDeleteBackward(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_getDeleteBackward : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getDeleteBackward();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_getDeleteBackward : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_getDeleteBackward)

static bool js_cocos2dx_ui_UICCTextField_getAttachWithIME(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_getAttachWithIME : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getAttachWithIME();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_getAttachWithIME : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_getAttachWithIME)

static bool js_cocos2dx_ui_UICCTextField_onTextFieldDeleteBackward(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_onTextFieldDeleteBackward : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::TextFieldTTF* arg0 = nullptr;
        const char* arg1 = nullptr;
        unsigned long arg2 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        std::string arg1_tmp; ok &= seval_to_std_string(args[1], &arg1_tmp); arg1 = arg1_tmp.c_str();
        ok &= seval_to_ulong(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_onTextFieldDeleteBackward : Error processing arguments");
        bool result = cobj->onTextFieldDeleteBackward(arg0, arg1, arg2);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_onTextFieldDeleteBackward : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_onTextFieldDeleteBackward)

static bool js_cocos2dx_ui_UICCTextField_getInsertText(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_getInsertText : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getInsertText();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_getInsertText : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_getInsertText)

static bool js_cocos2dx_ui_UICCTextField_deleteBackward(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_deleteBackward : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->deleteBackward();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_deleteBackward)

static bool js_cocos2dx_ui_UICCTextField_setInsertText(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_setInsertText : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_setInsertText : Error processing arguments");
        cobj->setInsertText(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_setInsertText)

static bool js_cocos2dx_ui_UICCTextField_getDetachWithIME(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_getDetachWithIME : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getDetachWithIME();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_getDetachWithIME : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_getDetachWithIME)

static bool js_cocos2dx_ui_UICCTextField_getCharCount(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_getCharCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned long result = cobj->getCharCount();
        ok &= ulong_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_getCharCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_getCharCount)

static bool js_cocos2dx_ui_UICCTextField_closeIME(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_closeIME : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->closeIME();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_closeIME)

static bool js_cocos2dx_ui_UICCTextField_setPasswordEnabled(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_setPasswordEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_setPasswordEnabled : Error processing arguments");
        cobj->setPasswordEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_setPasswordEnabled)

static bool js_cocos2dx_ui_UICCTextField_setMaxLengthEnabled(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_setMaxLengthEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_setMaxLengthEnabled : Error processing arguments");
        cobj->setMaxLengthEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_setMaxLengthEnabled)

static bool js_cocos2dx_ui_UICCTextField_isPasswordEnabled(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_isPasswordEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isPasswordEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_isPasswordEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_isPasswordEnabled)

static bool js_cocos2dx_ui_UICCTextField_insertText(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_insertText : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        const char* arg0 = nullptr;
        unsigned long arg1 = 0;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        ok &= seval_to_ulong(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_insertText : Error processing arguments");
        cobj->insertText(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_insertText)

static bool js_cocos2dx_ui_UICCTextField_setPasswordStyleText(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_setPasswordStyleText : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_setPasswordStyleText : Error processing arguments");
        cobj->setPasswordStyleText(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_setPasswordStyleText)

static bool js_cocos2dx_ui_UICCTextField_onTextFieldInsertText(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_onTextFieldInsertText : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::TextFieldTTF* arg0 = nullptr;
        const char* arg1 = nullptr;
        unsigned long arg2 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        std::string arg1_tmp; ok &= seval_to_std_string(args[1], &arg1_tmp); arg1 = arg1_tmp.c_str();
        ok &= seval_to_ulong(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_onTextFieldInsertText : Error processing arguments");
        bool result = cobj->onTextFieldInsertText(arg0, arg1, arg2);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_onTextFieldInsertText : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_onTextFieldInsertText)

static bool js_cocos2dx_ui_UICCTextField_onTextFieldDetachWithIME(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_onTextFieldDetachWithIME : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::TextFieldTTF* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_onTextFieldDetachWithIME : Error processing arguments");
        bool result = cobj->onTextFieldDetachWithIME(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_onTextFieldDetachWithIME : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_onTextFieldDetachWithIME)

static bool js_cocos2dx_ui_UICCTextField_getMaxLength(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_getMaxLength : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxLength();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_getMaxLength : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_getMaxLength)

static bool js_cocos2dx_ui_UICCTextField_isMaxLengthEnabled(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_isMaxLengthEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isMaxLengthEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_isMaxLengthEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_isMaxLengthEnabled)

static bool js_cocos2dx_ui_UICCTextField_openIME(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_openIME : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->openIME();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_openIME)

static bool js_cocos2dx_ui_UICCTextField_setDetachWithIME(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_setDetachWithIME : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_setDetachWithIME : Error processing arguments");
        cobj->setDetachWithIME(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_setDetachWithIME)

static bool js_cocos2dx_ui_UICCTextField_setMaxLength(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_setMaxLength : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_setMaxLength : Error processing arguments");
        cobj->setMaxLength(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_setMaxLength)

static bool js_cocos2dx_ui_UICCTextField_setDeleteBackward(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_UICCTextField_setDeleteBackward : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_setDeleteBackward : Error processing arguments");
        cobj->setDeleteBackward(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_setDeleteBackward)

static bool js_cocos2dx_ui_UICCTextField_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        float arg2 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_UICCTextField_create : Error processing arguments");
        auto result = cocos2d::ui::UICCTextField::create(arg0, arg1, arg2);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_UICCTextField_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_UICCTextField_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_UICCTextField_finalize)

static bool js_cocos2dx_ui_UICCTextField_constructor(se::State& s)
{
    cocos2d::ui::UICCTextField* cobj = new (std::nothrow) cocos2d::ui::UICCTextField();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_UICCTextField_constructor, __jsb_cocos2d_ui_UICCTextField_class, js_cocos2d_ui_UICCTextField_finalize)



extern se::Object* __jsb_cocos2d_TextFieldTTF_proto;

static bool js_cocos2d_ui_UICCTextField_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::UICCTextField)", s.nativeThisObject());
    cocos2d::ui::UICCTextField* cobj = (cocos2d::ui::UICCTextField*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_UICCTextField_finalize)

bool js_register_cocos2dx_ui_UICCTextField(se::Object* obj)
{
    auto cls = se::Class::create("UICCTextField", obj, __jsb_cocos2d_TextFieldTTF_proto, _SE(js_cocos2dx_ui_UICCTextField_constructor));

    cls->defineFunction("onTextFieldAttachWithIME", _SE(js_cocos2dx_ui_UICCTextField_onTextFieldAttachWithIME));
    cls->defineFunction("setPasswordText", _SE(js_cocos2dx_ui_UICCTextField_setPasswordText));
    cls->defineFunction("setAttachWithIME", _SE(js_cocos2dx_ui_UICCTextField_setAttachWithIME));
    cls->defineFunction("getDeleteBackward", _SE(js_cocos2dx_ui_UICCTextField_getDeleteBackward));
    cls->defineFunction("getAttachWithIME", _SE(js_cocos2dx_ui_UICCTextField_getAttachWithIME));
    cls->defineFunction("onTextFieldDeleteBackward", _SE(js_cocos2dx_ui_UICCTextField_onTextFieldDeleteBackward));
    cls->defineFunction("getInsertText", _SE(js_cocos2dx_ui_UICCTextField_getInsertText));
    cls->defineFunction("deleteBackward", _SE(js_cocos2dx_ui_UICCTextField_deleteBackward));
    cls->defineFunction("setInsertText", _SE(js_cocos2dx_ui_UICCTextField_setInsertText));
    cls->defineFunction("getDetachWithIME", _SE(js_cocos2dx_ui_UICCTextField_getDetachWithIME));
    cls->defineFunction("getCharCount", _SE(js_cocos2dx_ui_UICCTextField_getCharCount));
    cls->defineFunction("closeIME", _SE(js_cocos2dx_ui_UICCTextField_closeIME));
    cls->defineFunction("setPasswordEnabled", _SE(js_cocos2dx_ui_UICCTextField_setPasswordEnabled));
    cls->defineFunction("setMaxLengthEnabled", _SE(js_cocos2dx_ui_UICCTextField_setMaxLengthEnabled));
    cls->defineFunction("isPasswordEnabled", _SE(js_cocos2dx_ui_UICCTextField_isPasswordEnabled));
    cls->defineFunction("insertText", _SE(js_cocos2dx_ui_UICCTextField_insertText));
    cls->defineFunction("setPasswordStyleText", _SE(js_cocos2dx_ui_UICCTextField_setPasswordStyleText));
    cls->defineFunction("onTextFieldInsertText", _SE(js_cocos2dx_ui_UICCTextField_onTextFieldInsertText));
    cls->defineFunction("onTextFieldDetachWithIME", _SE(js_cocos2dx_ui_UICCTextField_onTextFieldDetachWithIME));
    cls->defineFunction("getMaxLength", _SE(js_cocos2dx_ui_UICCTextField_getMaxLength));
    cls->defineFunction("isMaxLengthEnabled", _SE(js_cocos2dx_ui_UICCTextField_isMaxLengthEnabled));
    cls->defineFunction("openIME", _SE(js_cocos2dx_ui_UICCTextField_openIME));
    cls->defineFunction("setDetachWithIME", _SE(js_cocos2dx_ui_UICCTextField_setDetachWithIME));
    cls->defineFunction("setMaxLength", _SE(js_cocos2dx_ui_UICCTextField_setMaxLength));
    cls->defineFunction("setDeleteBackward", _SE(js_cocos2dx_ui_UICCTextField_setDeleteBackward));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_UICCTextField_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_UICCTextField_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::UICCTextField>(cls);

    __jsb_cocos2d_ui_UICCTextField_proto = cls->getProto();
    __jsb_cocos2d_ui_UICCTextField_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_TextField_proto = nullptr;
se::Class* __jsb_cocos2d_ui_TextField_class = nullptr;

static bool js_cocos2dx_ui_TextField_setAttachWithIME(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setAttachWithIME : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setAttachWithIME : Error processing arguments");
        cobj->setAttachWithIME(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setAttachWithIME)

static bool js_cocos2dx_ui_TextField_getFontSize(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_getFontSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getFontSize();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_getFontSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_getFontSize)

static bool js_cocos2dx_ui_TextField_getString(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_getString : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getString();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_getString : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_getString)

static bool js_cocos2dx_ui_TextField_setPasswordStyleText(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setPasswordStyleText : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setPasswordStyleText : Error processing arguments");
        cobj->setPasswordStyleText(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setPasswordStyleText)

static bool js_cocos2dx_ui_TextField_getDeleteBackward(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_getDeleteBackward : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getDeleteBackward();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_getDeleteBackward : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_getDeleteBackward)

static bool js_cocos2dx_ui_TextField_getTextColor(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_getTextColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Color4B& result = cobj->getTextColor();
        ok &= Color4B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_getTextColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_getTextColor)

static bool js_cocos2dx_ui_TextField_getPlaceHolder(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_getPlaceHolder : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getPlaceHolder();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_getPlaceHolder : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_getPlaceHolder)

static bool js_cocos2dx_ui_TextField_getAttachWithIME(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_getAttachWithIME : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getAttachWithIME();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_getAttachWithIME : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_getAttachWithIME)

static bool js_cocos2dx_ui_TextField_setFontName(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setFontName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setFontName : Error processing arguments");
        cobj->setFontName(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setFontName)

static bool js_cocos2dx_ui_TextField_getInsertText(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_getInsertText : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getInsertText();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_getInsertText : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_getInsertText)

static bool js_cocos2dx_ui_TextField_setInsertText(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setInsertText : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setInsertText : Error processing arguments");
        cobj->setInsertText(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setInsertText)

static bool js_cocos2dx_ui_TextField_setString(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setString : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setString : Error processing arguments");
        cobj->setString(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setString)

static bool js_cocos2dx_ui_TextField_getDetachWithIME(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_getDetachWithIME : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getDetachWithIME();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_getDetachWithIME : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_getDetachWithIME)

static bool js_cocos2dx_ui_TextField_setTextVerticalAlignment(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setTextVerticalAlignment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::TextVAlignment arg0;
        ok &= seval_to_int8(args[0], (int8_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setTextVerticalAlignment : Error processing arguments");
        cobj->setTextVerticalAlignment(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setTextVerticalAlignment)

static bool js_cocos2dx_ui_TextField_addEventListener(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_addEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (cocos2d::Ref *, cocos2d::ui::TextField::EventType)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachChild(jsFunc.toObject());
                auto lambda = [=](cocos2d::Ref* larg0, cocos2d::ui::TextField::EventType larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= native_ptr_to_seval<cocos2d::Ref>((cocos2d::Ref*)larg0, &args[0]);
                    ok &= int32_to_seval((int32_t)larg1, &args[1]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_addEventListener : Error processing arguments");
        cobj->addEventListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_addEventListener)

static bool js_cocos2dx_ui_TextField_didNotSelectSelf(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_didNotSelectSelf : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->didNotSelectSelf();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_didNotSelectSelf)

static bool js_cocos2dx_ui_TextField_getFontName(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_getFontName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getFontName();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_getFontName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_getFontName)

static bool js_cocos2dx_ui_TextField_setTextAreaSize(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setTextAreaSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Size arg0;
        ok &= seval_to_Size(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setTextAreaSize : Error processing arguments");
        cobj->setTextAreaSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setTextAreaSize)

static bool js_cocos2dx_ui_TextField_attachWithIME(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_attachWithIME : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->attachWithIME();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_attachWithIME)

static bool js_cocos2dx_ui_TextField_getStringLength(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_getStringLength : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getStringLength();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_getStringLength : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_getStringLength)

static bool js_cocos2dx_ui_TextField_getAutoRenderSize(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_getAutoRenderSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Size result = cobj->getAutoRenderSize();
        ok &= Size_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_getAutoRenderSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_getAutoRenderSize)

static bool js_cocos2dx_ui_TextField_setPasswordEnabled(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setPasswordEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setPasswordEnabled : Error processing arguments");
        cobj->setPasswordEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setPasswordEnabled)

static bool js_cocos2dx_ui_TextField_getPlaceHolderColor(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_getPlaceHolderColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Color4B& result = cobj->getPlaceHolderColor();
        ok &= Color4B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_getPlaceHolderColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_getPlaceHolderColor)

static bool js_cocos2dx_ui_TextField_getPasswordStyleText(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_getPasswordStyleText : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const char* result = cobj->getPasswordStyleText();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_getPasswordStyleText : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_getPasswordStyleText)

static bool js_cocos2dx_ui_TextField_setMaxLengthEnabled(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setMaxLengthEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setMaxLengthEnabled : Error processing arguments");
        cobj->setMaxLengthEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setMaxLengthEnabled)

static bool js_cocos2dx_ui_TextField_isPasswordEnabled(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_isPasswordEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isPasswordEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_isPasswordEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_isPasswordEnabled)

static bool js_cocos2dx_ui_TextField_setDeleteBackward(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setDeleteBackward : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setDeleteBackward : Error processing arguments");
        cobj->setDeleteBackward(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setDeleteBackward)

static bool js_cocos2dx_ui_TextField_setCursorPosition(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setCursorPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned long arg0 = 0;
        ok &= seval_to_ulong(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setCursorPosition : Error processing arguments");
        cobj->setCursorPosition(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setCursorPosition)

static bool js_cocos2dx_ui_TextField_getTextHorizontalAlignment(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_getTextHorizontalAlignment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        char result = (char)cobj->getTextHorizontalAlignment();
        ok &= int8_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_getTextHorizontalAlignment : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_getTextHorizontalAlignment)

static bool js_cocos2dx_ui_TextField_setFontSize(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setFontSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setFontSize : Error processing arguments");
        cobj->setFontSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setFontSize)

static bool js_cocos2dx_ui_TextField_setPlaceHolder(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setPlaceHolder : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setPlaceHolder : Error processing arguments");
        cobj->setPlaceHolder(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setPlaceHolder)

static bool js_cocos2dx_ui_TextField_setCursorFromPoint(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setCursorFromPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setCursorFromPoint : Error processing arguments");
        cobj->setCursorFromPoint(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setCursorFromPoint)

static bool js_cocos2dx_ui_TextField_setPlaceHolderColor(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ui_TextField_setPlaceHolderColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            cocos2d::Color4B arg0;
            ok &= seval_to_Color4B(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cobj->setPlaceHolderColor(arg0);
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            cocos2d::Color3B arg0;
            ok &= seval_to_Color3B(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cobj->setPlaceHolderColor(arg0);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setPlaceHolderColor)

static bool js_cocos2dx_ui_TextField_setTextHorizontalAlignment(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setTextHorizontalAlignment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::TextHAlignment arg0;
        ok &= seval_to_int8(args[0], (int8_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setTextHorizontalAlignment : Error processing arguments");
        cobj->setTextHorizontalAlignment(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setTextHorizontalAlignment)

static bool js_cocos2dx_ui_TextField_setTextColor(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setTextColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Color4B arg0;
        ok &= seval_to_Color4B(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setTextColor : Error processing arguments");
        cobj->setTextColor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setTextColor)

static bool js_cocos2dx_ui_TextField_setCursorChar(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setCursorChar : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int8_t arg0;
        ok &= seval_to_int8(args[0], (int8_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setCursorChar : Error processing arguments");
        cobj->setCursorChar(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setCursorChar)

static bool js_cocos2dx_ui_TextField_getMaxLength(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_getMaxLength : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxLength();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_getMaxLength : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_getMaxLength)

static bool js_cocos2dx_ui_TextField_isMaxLengthEnabled(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_isMaxLengthEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isMaxLengthEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_isMaxLengthEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_isMaxLengthEnabled)

static bool js_cocos2dx_ui_TextField_setDetachWithIME(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setDetachWithIME : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setDetachWithIME : Error processing arguments");
        cobj->setDetachWithIME(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setDetachWithIME)

static bool js_cocos2dx_ui_TextField_getTextVerticalAlignment(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_getTextVerticalAlignment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        char result = (char)cobj->getTextVerticalAlignment();
        ok &= int8_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_getTextVerticalAlignment : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_getTextVerticalAlignment)

static bool js_cocos2dx_ui_TextField_setTouchAreaEnabled(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setTouchAreaEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setTouchAreaEnabled : Error processing arguments");
        cobj->setTouchAreaEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setTouchAreaEnabled)

static bool js_cocos2dx_ui_TextField_setMaxLength(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setMaxLength : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setMaxLength : Error processing arguments");
        cobj->setMaxLength(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setMaxLength)

static bool js_cocos2dx_ui_TextField_setCursorEnabled(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setCursorEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setCursorEnabled : Error processing arguments");
        cobj->setCursorEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setCursorEnabled)

static bool js_cocos2dx_ui_TextField_setTouchSize(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_setTouchSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Size arg0;
        ok &= seval_to_Size(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_setTouchSize : Error processing arguments");
        cobj->setTouchSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_setTouchSize)

static bool js_cocos2dx_ui_TextField_getTouchSize(se::State& s)
{
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextField_getTouchSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Size result = cobj->getTouchSize();
        ok &= Size_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_getTouchSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_getTouchSize)

static bool js_cocos2dx_ui_TextField_create(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            int arg2 = 0;
            ok &= seval_to_int32(args[2], (int32_t*)&arg2);
            if (!ok) { ok = true; break; }
            cocos2d::ui::TextField* result = cocos2d::ui::TextField::create(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<cocos2d::ui::TextField>((cocos2d::ui::TextField*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 0) {
            cocos2d::ui::TextField* result = cocos2d::ui::TextField::create();
            ok &= native_ptr_to_seval<cocos2d::ui::TextField>((cocos2d::ui::TextField*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextField_create : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextField_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_TextField_finalize)

static bool js_cocos2dx_ui_TextField_constructor(se::State& s)
{
    cocos2d::ui::TextField* cobj = new (std::nothrow) cocos2d::ui::TextField();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_TextField_constructor, __jsb_cocos2d_ui_TextField_class, js_cocos2d_ui_TextField_finalize)

static bool js_cocos2dx_ui_TextField_ctor(se::State& s)
{
    cocos2d::ui::TextField* cobj = new (std::nothrow) cocos2d::ui::TextField();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_TextField_ctor, __jsb_cocos2d_ui_TextField_class, js_cocos2d_ui_TextField_finalize)


    

extern se::Object* __jsb_cocos2d_ui_Widget_proto;

static bool js_cocos2d_ui_TextField_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::TextField)", s.nativeThisObject());
    cocos2d::ui::TextField* cobj = (cocos2d::ui::TextField*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_TextField_finalize)

bool js_register_cocos2dx_ui_TextField(se::Object* obj)
{
    auto cls = se::Class::create("TextField", obj, __jsb_cocos2d_ui_Widget_proto, _SE(js_cocos2dx_ui_TextField_constructor));

    cls->defineFunction("setAttachWithIME", _SE(js_cocos2dx_ui_TextField_setAttachWithIME));
    cls->defineFunction("getFontSize", _SE(js_cocos2dx_ui_TextField_getFontSize));
    cls->defineFunction("getString", _SE(js_cocos2dx_ui_TextField_getString));
    cls->defineFunction("setPasswordStyleText", _SE(js_cocos2dx_ui_TextField_setPasswordStyleText));
    cls->defineFunction("getDeleteBackward", _SE(js_cocos2dx_ui_TextField_getDeleteBackward));
    cls->defineFunction("getTextColor", _SE(js_cocos2dx_ui_TextField_getTextColor));
    cls->defineFunction("getPlaceHolder", _SE(js_cocos2dx_ui_TextField_getPlaceHolder));
    cls->defineFunction("getAttachWithIME", _SE(js_cocos2dx_ui_TextField_getAttachWithIME));
    cls->defineFunction("setFontName", _SE(js_cocos2dx_ui_TextField_setFontName));
    cls->defineFunction("getInsertText", _SE(js_cocos2dx_ui_TextField_getInsertText));
    cls->defineFunction("setInsertText", _SE(js_cocos2dx_ui_TextField_setInsertText));
    cls->defineFunction("setString", _SE(js_cocos2dx_ui_TextField_setString));
    cls->defineFunction("getDetachWithIME", _SE(js_cocos2dx_ui_TextField_getDetachWithIME));
    cls->defineFunction("setTextVerticalAlignment", _SE(js_cocos2dx_ui_TextField_setTextVerticalAlignment));
    cls->defineFunction("addEventListener", _SE(js_cocos2dx_ui_TextField_addEventListener));
    cls->defineFunction("didNotSelectSelf", _SE(js_cocos2dx_ui_TextField_didNotSelectSelf));
    cls->defineFunction("getFontName", _SE(js_cocos2dx_ui_TextField_getFontName));
    cls->defineFunction("setTextAreaSize", _SE(js_cocos2dx_ui_TextField_setTextAreaSize));
    cls->defineFunction("attachWithIME", _SE(js_cocos2dx_ui_TextField_attachWithIME));
    cls->defineFunction("getStringLength", _SE(js_cocos2dx_ui_TextField_getStringLength));
    cls->defineFunction("getAutoRenderSize", _SE(js_cocos2dx_ui_TextField_getAutoRenderSize));
    cls->defineFunction("setPasswordEnabled", _SE(js_cocos2dx_ui_TextField_setPasswordEnabled));
    cls->defineFunction("getPlaceHolderColor", _SE(js_cocos2dx_ui_TextField_getPlaceHolderColor));
    cls->defineFunction("getPasswordStyleText", _SE(js_cocos2dx_ui_TextField_getPasswordStyleText));
    cls->defineFunction("setMaxLengthEnabled", _SE(js_cocos2dx_ui_TextField_setMaxLengthEnabled));
    cls->defineFunction("isPasswordEnabled", _SE(js_cocos2dx_ui_TextField_isPasswordEnabled));
    cls->defineFunction("setDeleteBackward", _SE(js_cocos2dx_ui_TextField_setDeleteBackward));
    cls->defineFunction("setCursorPosition", _SE(js_cocos2dx_ui_TextField_setCursorPosition));
    cls->defineFunction("getTextHorizontalAlignment", _SE(js_cocos2dx_ui_TextField_getTextHorizontalAlignment));
    cls->defineFunction("setFontSize", _SE(js_cocos2dx_ui_TextField_setFontSize));
    cls->defineFunction("setPlaceHolder", _SE(js_cocos2dx_ui_TextField_setPlaceHolder));
    cls->defineFunction("setCursorFromPoint", _SE(js_cocos2dx_ui_TextField_setCursorFromPoint));
    cls->defineFunction("setPlaceHolderColor", _SE(js_cocos2dx_ui_TextField_setPlaceHolderColor));
    cls->defineFunction("setTextHorizontalAlignment", _SE(js_cocos2dx_ui_TextField_setTextHorizontalAlignment));
    cls->defineFunction("setTextColor", _SE(js_cocos2dx_ui_TextField_setTextColor));
    cls->defineFunction("setCursorChar", _SE(js_cocos2dx_ui_TextField_setCursorChar));
    cls->defineFunction("getMaxLength", _SE(js_cocos2dx_ui_TextField_getMaxLength));
    cls->defineFunction("isMaxLengthEnabled", _SE(js_cocos2dx_ui_TextField_isMaxLengthEnabled));
    cls->defineFunction("setDetachWithIME", _SE(js_cocos2dx_ui_TextField_setDetachWithIME));
    cls->defineFunction("getTextVerticalAlignment", _SE(js_cocos2dx_ui_TextField_getTextVerticalAlignment));
    cls->defineFunction("setTouchAreaEnabled", _SE(js_cocos2dx_ui_TextField_setTouchAreaEnabled));
    cls->defineFunction("setMaxLength", _SE(js_cocos2dx_ui_TextField_setMaxLength));
    cls->defineFunction("setCursorEnabled", _SE(js_cocos2dx_ui_TextField_setCursorEnabled));
    cls->defineFunction("setTouchSize", _SE(js_cocos2dx_ui_TextField_setTouchSize));
    cls->defineFunction("getTouchSize", _SE(js_cocos2dx_ui_TextField_getTouchSize));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_TextField_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_TextField_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_TextField_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::TextField>(cls);

    __jsb_cocos2d_ui_TextField_proto = cls->getProto();
    __jsb_cocos2d_ui_TextField_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.TextField.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_TextBMFont_proto = nullptr;
se::Class* __jsb_cocos2d_ui_TextBMFont_class = nullptr;

static bool js_cocos2dx_ui_TextBMFont_getStringLength(se::State& s)
{
    cocos2d::ui::TextBMFont* cobj = (cocos2d::ui::TextBMFont*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextBMFont_getStringLength : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        ssize_t result = cobj->getStringLength();
        ok &= ssize_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextBMFont_getStringLength : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextBMFont_getStringLength)

static bool js_cocos2dx_ui_TextBMFont_getString(se::State& s)
{
    cocos2d::ui::TextBMFont* cobj = (cocos2d::ui::TextBMFont*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextBMFont_getString : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getString();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextBMFont_getString : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextBMFont_getString)

static bool js_cocos2dx_ui_TextBMFont_setString(se::State& s)
{
    cocos2d::ui::TextBMFont* cobj = (cocos2d::ui::TextBMFont*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextBMFont_setString : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextBMFont_setString : Error processing arguments");
        cobj->setString(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextBMFont_setString)

static bool js_cocos2dx_ui_TextBMFont_getRenderFile(se::State& s)
{
    cocos2d::ui::TextBMFont* cobj = (cocos2d::ui::TextBMFont*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextBMFont_getRenderFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ResourceData result = cobj->getRenderFile();
        ok &= ResourceData_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextBMFont_getRenderFile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextBMFont_getRenderFile)

static bool js_cocos2dx_ui_TextBMFont_setFntFile(se::State& s)
{
    cocos2d::ui::TextBMFont* cobj = (cocos2d::ui::TextBMFont*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextBMFont_setFntFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextBMFont_setFntFile : Error processing arguments");
        cobj->setFntFile(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextBMFont_setFntFile)

static bool js_cocos2dx_ui_TextBMFont_resetRender(se::State& s)
{
    cocos2d::ui::TextBMFont* cobj = (cocos2d::ui::TextBMFont*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TextBMFont_resetRender : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->resetRender();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextBMFont_resetRender)

static bool js_cocos2dx_ui_TextBMFont_create(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::TextBMFont* result = cocos2d::ui::TextBMFont::create(arg0, arg1);
            ok &= native_ptr_to_seval<cocos2d::ui::TextBMFont>((cocos2d::ui::TextBMFont*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextBMFont_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 0) {
            cocos2d::ui::TextBMFont* result = cocos2d::ui::TextBMFont::create();
            ok &= native_ptr_to_seval<cocos2d::ui::TextBMFont>((cocos2d::ui::TextBMFont*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TextBMFont_create : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TextBMFont_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_TextBMFont_finalize)

static bool js_cocos2dx_ui_TextBMFont_constructor(se::State& s)
{
    cocos2d::ui::TextBMFont* cobj = new (std::nothrow) cocos2d::ui::TextBMFont();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_TextBMFont_constructor, __jsb_cocos2d_ui_TextBMFont_class, js_cocos2d_ui_TextBMFont_finalize)

static bool js_cocos2dx_ui_TextBMFont_ctor(se::State& s)
{
    cocos2d::ui::TextBMFont* cobj = new (std::nothrow) cocos2d::ui::TextBMFont();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_TextBMFont_ctor, __jsb_cocos2d_ui_TextBMFont_class, js_cocos2d_ui_TextBMFont_finalize)


    

extern se::Object* __jsb_cocos2d_ui_Widget_proto;

static bool js_cocos2d_ui_TextBMFont_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::TextBMFont)", s.nativeThisObject());
    cocos2d::ui::TextBMFont* cobj = (cocos2d::ui::TextBMFont*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_TextBMFont_finalize)

bool js_register_cocos2dx_ui_TextBMFont(se::Object* obj)
{
    auto cls = se::Class::create("TextBMFont", obj, __jsb_cocos2d_ui_Widget_proto, _SE(js_cocos2dx_ui_TextBMFont_constructor));

    cls->defineFunction("getStringLength", _SE(js_cocos2dx_ui_TextBMFont_getStringLength));
    cls->defineFunction("getString", _SE(js_cocos2dx_ui_TextBMFont_getString));
    cls->defineFunction("setString", _SE(js_cocos2dx_ui_TextBMFont_setString));
    cls->defineFunction("getRenderFile", _SE(js_cocos2dx_ui_TextBMFont_getRenderFile));
    cls->defineFunction("setFntFile", _SE(js_cocos2dx_ui_TextBMFont_setFntFile));
    cls->defineFunction("resetRender", _SE(js_cocos2dx_ui_TextBMFont_resetRender));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_TextBMFont_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_TextBMFont_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_TextBMFont_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::TextBMFont>(cls);

    __jsb_cocos2d_ui_TextBMFont_proto = cls->getProto();
    __jsb_cocos2d_ui_TextBMFont_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.TextBMFont.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_PageView_proto = nullptr;
se::Class* __jsb_cocos2d_ui_PageView_class = nullptr;

static bool js_cocos2dx_ui_PageView_setIndicatorSpaceBetweenIndexNodes(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_setIndicatorSpaceBetweenIndexNodes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_setIndicatorSpaceBetweenIndexNodes : Error processing arguments");
        cobj->setIndicatorSpaceBetweenIndexNodes(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_setIndicatorSpaceBetweenIndexNodes)

static bool js_cocos2dx_ui_PageView_insertPage(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_insertPage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::ui::Widget* arg0 = nullptr;
        int arg1 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_insertPage : Error processing arguments");
        cobj->insertPage(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_insertPage)

static bool js_cocos2dx_ui_PageView_removeAllPages(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_removeAllPages : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->removeAllPages();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_removeAllPages)

static bool js_cocos2dx_ui_PageView_setAutoScrollStopEpsilon(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_setAutoScrollStopEpsilon : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_setAutoScrollStopEpsilon : Error processing arguments");
        cobj->setAutoScrollStopEpsilon(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_setAutoScrollStopEpsilon)

static bool js_cocos2dx_ui_PageView_setIndicatorIndexNodesScale(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_setIndicatorIndexNodesScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_setIndicatorIndexNodesScale : Error processing arguments");
        cobj->setIndicatorIndexNodesScale(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_setIndicatorIndexNodesScale)

static bool js_cocos2dx_ui_PageView_setIndicatorEnabled(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_setIndicatorEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_setIndicatorEnabled : Error processing arguments");
        cobj->setIndicatorEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_setIndicatorEnabled)

static bool js_cocos2dx_ui_PageView_setIndicatorSelectedIndexColor(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_setIndicatorSelectedIndexColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Color3B arg0;
        ok &= seval_to_Color3B(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_setIndicatorSelectedIndexColor : Error processing arguments");
        cobj->setIndicatorSelectedIndexColor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_setIndicatorSelectedIndexColor)

static bool js_cocos2dx_ui_PageView_addEventListener(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_addEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (cocos2d::Ref *, cocos2d::ui::PageView::EventType)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachChild(jsFunc.toObject());
                auto lambda = [=](cocos2d::Ref* larg0, cocos2d::ui::PageView::EventType larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= native_ptr_to_seval<cocos2d::Ref>((cocos2d::Ref*)larg0, &args[0]);
                    ok &= int32_to_seval((int32_t)larg1, &args[1]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_addEventListener : Error processing arguments");
        cobj->addEventListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_addEventListener)

static bool js_cocos2dx_ui_PageView_getIndicatorPosition(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_getIndicatorPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Vec2& result = cobj->getIndicatorPosition();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_getIndicatorPosition : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_getIndicatorPosition)

static bool js_cocos2dx_ui_PageView_setCurrentPageIndex(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_setCurrentPageIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        ssize_t arg0 = 0;
        ok &= seval_to_ssize(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_setCurrentPageIndex : Error processing arguments");
        cobj->setCurrentPageIndex(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_setCurrentPageIndex)

static bool js_cocos2dx_ui_PageView_getIndicatorIndexNodesColor(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_getIndicatorIndexNodesColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Color3B& result = cobj->getIndicatorIndexNodesColor();
        ok &= Color3B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_getIndicatorIndexNodesColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_getIndicatorIndexNodesColor)

static bool js_cocos2dx_ui_PageView_getIndicatorSelectedIndexColor(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_getIndicatorSelectedIndexColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Color3B& result = cobj->getIndicatorSelectedIndexColor();
        ok &= Color3B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_getIndicatorSelectedIndexColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_getIndicatorSelectedIndexColor)

static bool js_cocos2dx_ui_PageView_getIndicatorIndexNodesScale(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_getIndicatorIndexNodesScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getIndicatorIndexNodesScale();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_getIndicatorIndexNodesScale : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_getIndicatorIndexNodesScale)

static bool js_cocos2dx_ui_PageView_setIndicatorPosition(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_setIndicatorPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_setIndicatorPosition : Error processing arguments");
        cobj->setIndicatorPosition(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_setIndicatorPosition)

static bool js_cocos2dx_ui_PageView_scrollToPage(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_scrollToPage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        ssize_t arg0 = 0;
        ok &= seval_to_ssize(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_scrollToPage : Error processing arguments");
        cobj->scrollToPage(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_scrollToPage)

static bool js_cocos2dx_ui_PageView_setIndicatorPositionAsAnchorPoint(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_setIndicatorPositionAsAnchorPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_setIndicatorPositionAsAnchorPoint : Error processing arguments");
        cobj->setIndicatorPositionAsAnchorPoint(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_setIndicatorPositionAsAnchorPoint)

static bool js_cocos2dx_ui_PageView_scrollToItem(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_scrollToItem : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        ssize_t arg0 = 0;
        ok &= seval_to_ssize(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_scrollToItem : Error processing arguments");
        cobj->scrollToItem(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_scrollToItem)

static bool js_cocos2dx_ui_PageView_setIndicatorIndexNodesColor(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_setIndicatorIndexNodesColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Color3B arg0;
        ok &= seval_to_Color3B(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_setIndicatorIndexNodesColor : Error processing arguments");
        cobj->setIndicatorIndexNodesColor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_setIndicatorIndexNodesColor)

static bool js_cocos2dx_ui_PageView_getIndicatorPositionAsAnchorPoint(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_getIndicatorPositionAsAnchorPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Vec2& result = cobj->getIndicatorPositionAsAnchorPoint();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_getIndicatorPositionAsAnchorPoint : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_getIndicatorPositionAsAnchorPoint)

static bool js_cocos2dx_ui_PageView_getCurrentPageIndex(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_getCurrentPageIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        ssize_t result = cobj->getCurrentPageIndex();
        ok &= ssize_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_getCurrentPageIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_getCurrentPageIndex)

static bool js_cocos2dx_ui_PageView_removePage(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_removePage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::Widget* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_removePage : Error processing arguments");
        cobj->removePage(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_removePage)

static bool js_cocos2dx_ui_PageView_setIndicatorIndexNodesTexture(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_setIndicatorIndexNodesTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_setIndicatorIndexNodesTexture : Error processing arguments");
        cobj->setIndicatorIndexNodesTexture(arg0);
        return true;
    }
    if (argc == 2) {
        std::string arg0;
        cocos2d::ui::Widget::TextureResType arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_setIndicatorIndexNodesTexture : Error processing arguments");
        cobj->setIndicatorIndexNodesTexture(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_setIndicatorIndexNodesTexture)

static bool js_cocos2dx_ui_PageView_getIndicatorEnabled(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_getIndicatorEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getIndicatorEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_getIndicatorEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_getIndicatorEnabled)

static bool js_cocos2dx_ui_PageView_removePageAtIndex(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_removePageAtIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        ssize_t arg0 = 0;
        ok &= seval_to_ssize(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_removePageAtIndex : Error processing arguments");
        cobj->removePageAtIndex(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_removePageAtIndex)

static bool js_cocos2dx_ui_PageView_getIndicatorSpaceBetweenIndexNodes(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_getIndicatorSpaceBetweenIndexNodes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getIndicatorSpaceBetweenIndexNodes();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_getIndicatorSpaceBetweenIndexNodes : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_getIndicatorSpaceBetweenIndexNodes)

static bool js_cocos2dx_ui_PageView_addPage(se::State& s)
{
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_PageView_addPage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::Widget* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_PageView_addPage : Error processing arguments");
        cobj->addPage(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_addPage)

static bool js_cocos2dx_ui_PageView_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = cocos2d::ui::PageView::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_PageView_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_PageView_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_PageView_finalize)

static bool js_cocos2dx_ui_PageView_constructor(se::State& s)
{
    cocos2d::ui::PageView* cobj = new (std::nothrow) cocos2d::ui::PageView();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_PageView_constructor, __jsb_cocos2d_ui_PageView_class, js_cocos2d_ui_PageView_finalize)

static bool js_cocos2dx_ui_PageView_ctor(se::State& s)
{
    cocos2d::ui::PageView* cobj = new (std::nothrow) cocos2d::ui::PageView();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_PageView_ctor, __jsb_cocos2d_ui_PageView_class, js_cocos2d_ui_PageView_finalize)


    

extern se::Object* __jsb_cocos2d_ui_ListView_proto;

static bool js_cocos2d_ui_PageView_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::PageView)", s.nativeThisObject());
    cocos2d::ui::PageView* cobj = (cocos2d::ui::PageView*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_PageView_finalize)

bool js_register_cocos2dx_ui_PageView(se::Object* obj)
{
    auto cls = se::Class::create("PageView", obj, __jsb_cocos2d_ui_ListView_proto, _SE(js_cocos2dx_ui_PageView_constructor));

    cls->defineFunction("setIndicatorSpaceBetweenIndexNodes", _SE(js_cocos2dx_ui_PageView_setIndicatorSpaceBetweenIndexNodes));
    cls->defineFunction("insertPage", _SE(js_cocos2dx_ui_PageView_insertPage));
    cls->defineFunction("removeAllPages", _SE(js_cocos2dx_ui_PageView_removeAllPages));
    cls->defineFunction("setAutoScrollStopEpsilon", _SE(js_cocos2dx_ui_PageView_setAutoScrollStopEpsilon));
    cls->defineFunction("setIndicatorIndexNodesScale", _SE(js_cocos2dx_ui_PageView_setIndicatorIndexNodesScale));
    cls->defineFunction("setIndicatorEnabled", _SE(js_cocos2dx_ui_PageView_setIndicatorEnabled));
    cls->defineFunction("setIndicatorSelectedIndexColor", _SE(js_cocos2dx_ui_PageView_setIndicatorSelectedIndexColor));
    cls->defineFunction("addEventListener", _SE(js_cocos2dx_ui_PageView_addEventListener));
    cls->defineFunction("getIndicatorPosition", _SE(js_cocos2dx_ui_PageView_getIndicatorPosition));
    cls->defineFunction("setCurrentPageIndex", _SE(js_cocos2dx_ui_PageView_setCurrentPageIndex));
    cls->defineFunction("getIndicatorIndexNodesColor", _SE(js_cocos2dx_ui_PageView_getIndicatorIndexNodesColor));
    cls->defineFunction("getIndicatorSelectedIndexColor", _SE(js_cocos2dx_ui_PageView_getIndicatorSelectedIndexColor));
    cls->defineFunction("getIndicatorIndexNodesScale", _SE(js_cocos2dx_ui_PageView_getIndicatorIndexNodesScale));
    cls->defineFunction("setIndicatorPosition", _SE(js_cocos2dx_ui_PageView_setIndicatorPosition));
    cls->defineFunction("scrollToPage", _SE(js_cocos2dx_ui_PageView_scrollToPage));
    cls->defineFunction("setIndicatorPositionAsAnchorPoint", _SE(js_cocos2dx_ui_PageView_setIndicatorPositionAsAnchorPoint));
    cls->defineFunction("scrollToItem", _SE(js_cocos2dx_ui_PageView_scrollToItem));
    cls->defineFunction("setIndicatorIndexNodesColor", _SE(js_cocos2dx_ui_PageView_setIndicatorIndexNodesColor));
    cls->defineFunction("getIndicatorPositionAsAnchorPoint", _SE(js_cocos2dx_ui_PageView_getIndicatorPositionAsAnchorPoint));
    cls->defineFunction("getCurrentPageIndex", _SE(js_cocos2dx_ui_PageView_getCurrentPageIndex));
    cls->defineFunction("removePage", _SE(js_cocos2dx_ui_PageView_removePage));
    cls->defineFunction("setIndicatorIndexNodesTexture", _SE(js_cocos2dx_ui_PageView_setIndicatorIndexNodesTexture));
    cls->defineFunction("getIndicatorEnabled", _SE(js_cocos2dx_ui_PageView_getIndicatorEnabled));
    cls->defineFunction("removePageAtIndex", _SE(js_cocos2dx_ui_PageView_removePageAtIndex));
    cls->defineFunction("getIndicatorSpaceBetweenIndexNodes", _SE(js_cocos2dx_ui_PageView_getIndicatorSpaceBetweenIndexNodes));
    cls->defineFunction("addPage", _SE(js_cocos2dx_ui_PageView_addPage));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_PageView_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_PageView_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_PageView_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::PageView>(cls);

    __jsb_cocos2d_ui_PageView_proto = cls->getProto();
    __jsb_cocos2d_ui_PageView_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.PageView.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_Helper_proto = nullptr;
se::Class* __jsb_cocos2d_ui_Helper_class = nullptr;

static bool js_cocos2dx_ui_Helper_getSubStringOfUTF8String(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        std::string arg0;
        unsigned long arg1 = 0;
        unsigned long arg2 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_ulong(args[1], &arg1);
        ok &= seval_to_ulong(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Helper_getSubStringOfUTF8String : Error processing arguments");
        std::string result = cocos2d::ui::Helper::getSubStringOfUTF8String(arg0, arg1, arg2);
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Helper_getSubStringOfUTF8String : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Helper_getSubStringOfUTF8String)

static bool js_cocos2dx_ui_Helper_convertBoundingBoxToScreen(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Helper_convertBoundingBoxToScreen : Error processing arguments");
        cocos2d::Rect result = cocos2d::ui::Helper::convertBoundingBoxToScreen(arg0);
        ok &= Rect_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Helper_convertBoundingBoxToScreen : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Helper_convertBoundingBoxToScreen)

static bool js_cocos2dx_ui_Helper_changeLayoutSystemActiveState(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Helper_changeLayoutSystemActiveState : Error processing arguments");
        cocos2d::ui::Helper::changeLayoutSystemActiveState(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Helper_changeLayoutSystemActiveState)

static bool js_cocos2dx_ui_Helper_seekActionWidgetByActionTag(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::ui::Widget* arg0 = nullptr;
        int arg1 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Helper_seekActionWidgetByActionTag : Error processing arguments");
        cocos2d::ui::Widget* result = cocos2d::ui::Helper::seekActionWidgetByActionTag(arg0, arg1);
        ok &= native_ptr_to_seval<cocos2d::ui::Widget>((cocos2d::ui::Widget*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Helper_seekActionWidgetByActionTag : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Helper_seekActionWidgetByActionTag)

static bool js_cocos2dx_ui_Helper_seekWidgetByName(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::ui::Widget* arg0 = nullptr;
        std::string arg1;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Helper_seekWidgetByName : Error processing arguments");
        cocos2d::ui::Widget* result = cocos2d::ui::Helper::seekWidgetByName(arg0, arg1);
        ok &= native_ptr_to_seval<cocos2d::ui::Widget>((cocos2d::ui::Widget*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Helper_seekWidgetByName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Helper_seekWidgetByName)

static bool js_cocos2dx_ui_Helper_seekWidgetByTag(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::ui::Widget* arg0 = nullptr;
        int arg1 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Helper_seekWidgetByTag : Error processing arguments");
        cocos2d::ui::Widget* result = cocos2d::ui::Helper::seekWidgetByTag(arg0, arg1);
        ok &= native_ptr_to_seval<cocos2d::ui::Widget>((cocos2d::ui::Widget*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Helper_seekWidgetByTag : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Helper_seekWidgetByTag)

static bool js_cocos2dx_ui_Helper_restrictCapInsetRect(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::Rect arg0;
        cocos2d::Size arg1;
        ok &= seval_to_Rect(args[0], &arg0);
        ok &= seval_to_Size(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Helper_restrictCapInsetRect : Error processing arguments");
        cocos2d::Rect result = cocos2d::ui::Helper::restrictCapInsetRect(arg0, arg1);
        ok &= Rect_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Helper_restrictCapInsetRect : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Helper_restrictCapInsetRect)

static bool js_cocos2dx_ui_Helper_doLayout(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Helper_doLayout : Error processing arguments");
        cocos2d::ui::Helper::doLayout(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Helper_doLayout)




bool js_register_cocos2dx_ui_Helper(se::Object* obj)
{
    auto cls = se::Class::create("Helper", obj, nullptr, nullptr);

    cls->defineStaticFunction("getSubStringOfUTF8String", _SE(js_cocos2dx_ui_Helper_getSubStringOfUTF8String));
    cls->defineStaticFunction("convertBoundingBoxToScreen", _SE(js_cocos2dx_ui_Helper_convertBoundingBoxToScreen));
    cls->defineStaticFunction("changeLayoutSystemActiveState", _SE(js_cocos2dx_ui_Helper_changeLayoutSystemActiveState));
    cls->defineStaticFunction("seekActionWidgetByActionTag", _SE(js_cocos2dx_ui_Helper_seekActionWidgetByActionTag));
    cls->defineStaticFunction("seekWidgetByName", _SE(js_cocos2dx_ui_Helper_seekWidgetByName));
    cls->defineStaticFunction("seekWidgetByTag", _SE(js_cocos2dx_ui_Helper_seekWidgetByTag));
    cls->defineStaticFunction("restrictCapInsetRect", _SE(js_cocos2dx_ui_Helper_restrictCapInsetRect));
    cls->defineStaticFunction("doLayout", _SE(js_cocos2dx_ui_Helper_doLayout));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::Helper>(cls);

    __jsb_cocos2d_ui_Helper_proto = cls->getProto();
    __jsb_cocos2d_ui_Helper_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_RichElement_proto = nullptr;
se::Class* __jsb_cocos2d_ui_RichElement_class = nullptr;

static bool js_cocos2dx_ui_RichElement_equalType(se::State& s)
{
    cocos2d::ui::RichElement* cobj = (cocos2d::ui::RichElement*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichElement_equalType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::RichElement::Type arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElement_equalType : Error processing arguments");
        bool result = cobj->equalType(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElement_equalType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichElement_equalType)

static bool js_cocos2dx_ui_RichElement_init(se::State& s)
{
    cocos2d::ui::RichElement* cobj = (cocos2d::ui::RichElement*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichElement_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElement_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1, arg2);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElement_init : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichElement_init)

static bool js_cocos2dx_ui_RichElement_setColor(se::State& s)
{
    cocos2d::ui::RichElement* cobj = (cocos2d::ui::RichElement*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichElement_setColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Color3B arg0;
        ok &= seval_to_Color3B(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElement_setColor : Error processing arguments");
        cobj->setColor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichElement_setColor)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_RichElement_finalize)

static bool js_cocos2dx_ui_RichElement_constructor(se::State& s)
{
    cocos2d::ui::RichElement* cobj = new (std::nothrow) cocos2d::ui::RichElement();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_RichElement_constructor, __jsb_cocos2d_ui_RichElement_class, js_cocos2d_ui_RichElement_finalize)

static bool js_cocos2dx_ui_RichElement_ctor(se::State& s)
{
    cocos2d::ui::RichElement* cobj = new (std::nothrow) cocos2d::ui::RichElement();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_RichElement_ctor, __jsb_cocos2d_ui_RichElement_class, js_cocos2d_ui_RichElement_finalize)


    


static bool js_cocos2d_ui_RichElement_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::RichElement)", s.nativeThisObject());
    cocos2d::ui::RichElement* cobj = (cocos2d::ui::RichElement*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_RichElement_finalize)

bool js_register_cocos2dx_ui_RichElement(se::Object* obj)
{
    auto cls = se::Class::create("RichElement", obj, nullptr, _SE(js_cocos2dx_ui_RichElement_constructor));

    cls->defineFunction("equalType", _SE(js_cocos2dx_ui_RichElement_equalType));
    cls->defineFunction("init", _SE(js_cocos2dx_ui_RichElement_init));
    cls->defineFunction("setColor", _SE(js_cocos2dx_ui_RichElement_setColor));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_RichElement_ctor));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_RichElement_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::RichElement>(cls);

    __jsb_cocos2d_ui_RichElement_proto = cls->getProto();
    __jsb_cocos2d_ui_RichElement_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.RichElement.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_RichElementText_proto = nullptr;
se::Class* __jsb_cocos2d_ui_RichElementText_class = nullptr;

static bool js_cocos2dx_ui_RichElementText_init(se::State& s)
{
    cocos2d::ui::RichElementText* cobj = (cocos2d::ui::RichElementText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichElementText_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 8) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        std::string arg3;
        std::string arg4;
        float arg5 = 0;
        unsigned int arg6 = 0;
        std::string arg7;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_float(args[5], &arg5);
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
        ok &= seval_to_std_string(args[7], &arg7);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_init : Error processing arguments");
        return true;
    }
    if (argc == 9) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        std::string arg3;
        std::string arg4;
        float arg5 = 0;
        unsigned int arg6 = 0;
        std::string arg7;
        cocos2d::Color3B arg8;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_float(args[5], &arg5);
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
        ok &= seval_to_std_string(args[7], &arg7);
        ok &= seval_to_Color3B(args[8], &arg8);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_init : Error processing arguments");
        return true;
    }
    if (argc == 10) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        std::string arg3;
        std::string arg4;
        float arg5 = 0;
        unsigned int arg6 = 0;
        std::string arg7;
        cocos2d::Color3B arg8;
        int arg9 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_float(args[5], &arg5);
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
        ok &= seval_to_std_string(args[7], &arg7);
        ok &= seval_to_Color3B(args[8], &arg8);
        ok &= seval_to_int32(args[9], (int32_t*)&arg9);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_init : Error processing arguments");
        return true;
    }
    if (argc == 11) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        std::string arg3;
        std::string arg4;
        float arg5 = 0;
        unsigned int arg6 = 0;
        std::string arg7;
        cocos2d::Color3B arg8;
        int arg9 = 0;
        cocos2d::Color3B arg10;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_float(args[5], &arg5);
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
        ok &= seval_to_std_string(args[7], &arg7);
        ok &= seval_to_Color3B(args[8], &arg8);
        ok &= seval_to_int32(args[9], (int32_t*)&arg9);
        ok &= seval_to_Color3B(args[10], &arg10);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_init : Error processing arguments");
        return true;
    }
    if (argc == 12) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        std::string arg3;
        std::string arg4;
        float arg5 = 0;
        unsigned int arg6 = 0;
        std::string arg7;
        cocos2d::Color3B arg8;
        int arg9 = 0;
        cocos2d::Color3B arg10;
        cocos2d::Size arg11;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_float(args[5], &arg5);
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
        ok &= seval_to_std_string(args[7], &arg7);
        ok &= seval_to_Color3B(args[8], &arg8);
        ok &= seval_to_int32(args[9], (int32_t*)&arg9);
        ok &= seval_to_Color3B(args[10], &arg10);
        ok &= seval_to_Size(args[11], &arg11);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_init : Error processing arguments");
        return true;
    }
    if (argc == 13) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        std::string arg3;
        std::string arg4;
        float arg5 = 0;
        unsigned int arg6 = 0;
        std::string arg7;
        cocos2d::Color3B arg8;
        int arg9 = 0;
        cocos2d::Color3B arg10;
        cocos2d::Size arg11;
        int arg12 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_float(args[5], &arg5);
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
        ok &= seval_to_std_string(args[7], &arg7);
        ok &= seval_to_Color3B(args[8], &arg8);
        ok &= seval_to_int32(args[9], (int32_t*)&arg9);
        ok &= seval_to_Color3B(args[10], &arg10);
        ok &= seval_to_Size(args[11], &arg11);
        ok &= seval_to_int32(args[12], (int32_t*)&arg12);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_init : Error processing arguments");
        return true;
    }
    if (argc == 14) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        std::string arg3;
        std::string arg4;
        float arg5 = 0;
        unsigned int arg6 = 0;
        std::string arg7;
        cocos2d::Color3B arg8;
        int arg9 = 0;
        cocos2d::Color3B arg10;
        cocos2d::Size arg11;
        int arg12 = 0;
        cocos2d::Color3B arg13;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_float(args[5], &arg5);
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
        ok &= seval_to_std_string(args[7], &arg7);
        ok &= seval_to_Color3B(args[8], &arg8);
        ok &= seval_to_int32(args[9], (int32_t*)&arg9);
        ok &= seval_to_Color3B(args[10], &arg10);
        ok &= seval_to_Size(args[11], &arg11);
        ok &= seval_to_int32(args[12], (int32_t*)&arg12);
        ok &= seval_to_Color3B(args[13], &arg13);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_init : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 14);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichElementText_init)

static bool js_cocos2dx_ui_RichElementText_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        std::string arg3;
        std::string arg4;
        float arg5 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_float(args[5], &arg5);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_create : Error processing arguments");
        auto result = cocos2d::ui::RichElementText::create(arg0, arg1, arg2, arg3, arg4, arg5);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_RichElementText_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    if (argc == 7) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        std::string arg3;
        std::string arg4;
        float arg5 = 0;
        unsigned int arg6 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_float(args[5], &arg5);
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_create : Error processing arguments");
        auto result = cocos2d::ui::RichElementText::create(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_RichElementText_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    if (argc == 8) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        std::string arg3;
        std::string arg4;
        float arg5 = 0;
        unsigned int arg6 = 0;
        std::string arg7;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_float(args[5], &arg5);
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
        ok &= seval_to_std_string(args[7], &arg7);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_create : Error processing arguments");
        auto result = cocos2d::ui::RichElementText::create(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_RichElementText_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    if (argc == 9) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        std::string arg3;
        std::string arg4;
        float arg5 = 0;
        unsigned int arg6 = 0;
        std::string arg7;
        cocos2d::Color3B arg8;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_float(args[5], &arg5);
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
        ok &= seval_to_std_string(args[7], &arg7);
        ok &= seval_to_Color3B(args[8], &arg8);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_create : Error processing arguments");
        auto result = cocos2d::ui::RichElementText::create(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_RichElementText_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    if (argc == 10) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        std::string arg3;
        std::string arg4;
        float arg5 = 0;
        unsigned int arg6 = 0;
        std::string arg7;
        cocos2d::Color3B arg8;
        int arg9 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_float(args[5], &arg5);
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
        ok &= seval_to_std_string(args[7], &arg7);
        ok &= seval_to_Color3B(args[8], &arg8);
        ok &= seval_to_int32(args[9], (int32_t*)&arg9);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_create : Error processing arguments");
        auto result = cocos2d::ui::RichElementText::create(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_RichElementText_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    if (argc == 11) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        std::string arg3;
        std::string arg4;
        float arg5 = 0;
        unsigned int arg6 = 0;
        std::string arg7;
        cocos2d::Color3B arg8;
        int arg9 = 0;
        cocos2d::Color3B arg10;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_float(args[5], &arg5);
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
        ok &= seval_to_std_string(args[7], &arg7);
        ok &= seval_to_Color3B(args[8], &arg8);
        ok &= seval_to_int32(args[9], (int32_t*)&arg9);
        ok &= seval_to_Color3B(args[10], &arg10);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_create : Error processing arguments");
        auto result = cocos2d::ui::RichElementText::create(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_RichElementText_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    if (argc == 12) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        std::string arg3;
        std::string arg4;
        float arg5 = 0;
        unsigned int arg6 = 0;
        std::string arg7;
        cocos2d::Color3B arg8;
        int arg9 = 0;
        cocos2d::Color3B arg10;
        cocos2d::Size arg11;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_float(args[5], &arg5);
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
        ok &= seval_to_std_string(args[7], &arg7);
        ok &= seval_to_Color3B(args[8], &arg8);
        ok &= seval_to_int32(args[9], (int32_t*)&arg9);
        ok &= seval_to_Color3B(args[10], &arg10);
        ok &= seval_to_Size(args[11], &arg11);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_create : Error processing arguments");
        auto result = cocos2d::ui::RichElementText::create(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_RichElementText_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    if (argc == 13) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        std::string arg3;
        std::string arg4;
        float arg5 = 0;
        unsigned int arg6 = 0;
        std::string arg7;
        cocos2d::Color3B arg8;
        int arg9 = 0;
        cocos2d::Color3B arg10;
        cocos2d::Size arg11;
        int arg12 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_float(args[5], &arg5);
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
        ok &= seval_to_std_string(args[7], &arg7);
        ok &= seval_to_Color3B(args[8], &arg8);
        ok &= seval_to_int32(args[9], (int32_t*)&arg9);
        ok &= seval_to_Color3B(args[10], &arg10);
        ok &= seval_to_Size(args[11], &arg11);
        ok &= seval_to_int32(args[12], (int32_t*)&arg12);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_create : Error processing arguments");
        auto result = cocos2d::ui::RichElementText::create(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_RichElementText_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    if (argc == 14) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        std::string arg3;
        std::string arg4;
        float arg5 = 0;
        unsigned int arg6 = 0;
        std::string arg7;
        cocos2d::Color3B arg8;
        int arg9 = 0;
        cocos2d::Color3B arg10;
        cocos2d::Size arg11;
        int arg12 = 0;
        cocos2d::Color3B arg13;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        ok &= seval_to_float(args[5], &arg5);
        ok &= seval_to_uint32(args[6], (uint32_t*)&arg6);
        ok &= seval_to_std_string(args[7], &arg7);
        ok &= seval_to_Color3B(args[8], &arg8);
        ok &= seval_to_int32(args[9], (int32_t*)&arg9);
        ok &= seval_to_Color3B(args[10], &arg10);
        ok &= seval_to_Size(args[11], &arg11);
        ok &= seval_to_int32(args[12], (int32_t*)&arg12);
        ok &= seval_to_Color3B(args[13], &arg13);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementText_create : Error processing arguments");
        auto result = cocos2d::ui::RichElementText::create(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_RichElementText_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 14);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichElementText_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_RichElementText_finalize)

static bool js_cocos2dx_ui_RichElementText_constructor(se::State& s)
{
    cocos2d::ui::RichElementText* cobj = new (std::nothrow) cocos2d::ui::RichElementText();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_RichElementText_constructor, __jsb_cocos2d_ui_RichElementText_class, js_cocos2d_ui_RichElementText_finalize)

static bool js_cocos2dx_ui_RichElementText_ctor(se::State& s)
{
    cocos2d::ui::RichElementText* cobj = new (std::nothrow) cocos2d::ui::RichElementText();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_RichElementText_ctor, __jsb_cocos2d_ui_RichElementText_class, js_cocos2d_ui_RichElementText_finalize)


    

extern se::Object* __jsb_cocos2d_ui_RichElement_proto;

static bool js_cocos2d_ui_RichElementText_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::RichElementText)", s.nativeThisObject());
    cocos2d::ui::RichElementText* cobj = (cocos2d::ui::RichElementText*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_RichElementText_finalize)

bool js_register_cocos2dx_ui_RichElementText(se::Object* obj)
{
    auto cls = se::Class::create("RichElementText", obj, __jsb_cocos2d_ui_RichElement_proto, _SE(js_cocos2dx_ui_RichElementText_constructor));

    cls->defineFunction("init", _SE(js_cocos2dx_ui_RichElementText_init));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_RichElementText_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_RichElementText_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_RichElementText_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::RichElementText>(cls);

    __jsb_cocos2d_ui_RichElementText_proto = cls->getProto();
    __jsb_cocos2d_ui_RichElementText_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.RichElementText.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_RichElementImage_proto = nullptr;
se::Class* __jsb_cocos2d_ui_RichElementImage_class = nullptr;

static bool js_cocos2dx_ui_RichElementImage_setHeight(se::State& s)
{
    cocos2d::ui::RichElementImage* cobj = (cocos2d::ui::RichElementImage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichElementImage_setHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementImage_setHeight : Error processing arguments");
        cobj->setHeight(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichElementImage_setHeight)

static bool js_cocos2dx_ui_RichElementImage_init(se::State& s)
{
    cocos2d::ui::RichElementImage* cobj = (cocos2d::ui::RichElementImage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichElementImage_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        std::string arg3;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementImage_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1, arg2, arg3);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementImage_init : Error processing arguments");
        return true;
    }
    if (argc == 5) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        std::string arg3;
        std::string arg4;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementImage_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1, arg2, arg3, arg4);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementImage_init : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichElementImage_init)

static bool js_cocos2dx_ui_RichElementImage_setWidth(se::State& s)
{
    cocos2d::ui::RichElementImage* cobj = (cocos2d::ui::RichElementImage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichElementImage_setWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementImage_setWidth : Error processing arguments");
        cobj->setWidth(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichElementImage_setWidth)

static bool js_cocos2dx_ui_RichElementImage_setUrl(se::State& s)
{
    cocos2d::ui::RichElementImage* cobj = (cocos2d::ui::RichElementImage*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichElementImage_setUrl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementImage_setUrl : Error processing arguments");
        cobj->setUrl(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichElementImage_setUrl)

static bool js_cocos2dx_ui_RichElementImage_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        std::string arg3;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementImage_create : Error processing arguments");
        auto result = cocos2d::ui::RichElementImage::create(arg0, arg1, arg2, arg3);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_RichElementImage_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    if (argc == 5) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        std::string arg3;
        std::string arg4;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_std_string(args[3], &arg3);
        ok &= seval_to_std_string(args[4], &arg4);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementImage_create : Error processing arguments");
        auto result = cocos2d::ui::RichElementImage::create(arg0, arg1, arg2, arg3, arg4);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_RichElementImage_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichElementImage_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_RichElementImage_finalize)

static bool js_cocos2dx_ui_RichElementImage_constructor(se::State& s)
{
    cocos2d::ui::RichElementImage* cobj = new (std::nothrow) cocos2d::ui::RichElementImage();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_RichElementImage_constructor, __jsb_cocos2d_ui_RichElementImage_class, js_cocos2d_ui_RichElementImage_finalize)

static bool js_cocos2dx_ui_RichElementImage_ctor(se::State& s)
{
    cocos2d::ui::RichElementImage* cobj = new (std::nothrow) cocos2d::ui::RichElementImage();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_RichElementImage_ctor, __jsb_cocos2d_ui_RichElementImage_class, js_cocos2d_ui_RichElementImage_finalize)


    

extern se::Object* __jsb_cocos2d_ui_RichElement_proto;

static bool js_cocos2d_ui_RichElementImage_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::RichElementImage)", s.nativeThisObject());
    cocos2d::ui::RichElementImage* cobj = (cocos2d::ui::RichElementImage*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_RichElementImage_finalize)

bool js_register_cocos2dx_ui_RichElementImage(se::Object* obj)
{
    auto cls = se::Class::create("RichElementImage", obj, __jsb_cocos2d_ui_RichElement_proto, _SE(js_cocos2dx_ui_RichElementImage_constructor));

    cls->defineFunction("setHeight", _SE(js_cocos2dx_ui_RichElementImage_setHeight));
    cls->defineFunction("init", _SE(js_cocos2dx_ui_RichElementImage_init));
    cls->defineFunction("setWidth", _SE(js_cocos2dx_ui_RichElementImage_setWidth));
    cls->defineFunction("setUrl", _SE(js_cocos2dx_ui_RichElementImage_setUrl));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_RichElementImage_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_RichElementImage_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_RichElementImage_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::RichElementImage>(cls);

    __jsb_cocos2d_ui_RichElementImage_proto = cls->getProto();
    __jsb_cocos2d_ui_RichElementImage_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.RichElementImage.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_RichElementCustomNode_proto = nullptr;
se::Class* __jsb_cocos2d_ui_RichElementCustomNode_class = nullptr;

static bool js_cocos2dx_ui_RichElementCustomNode_init(se::State& s)
{
    cocos2d::ui::RichElementCustomNode* cobj = (cocos2d::ui::RichElementCustomNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichElementCustomNode_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        cocos2d::Node* arg3 = nullptr;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_native_ptr(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementCustomNode_init : Error processing arguments");
        bool result = cobj->init(arg0, arg1, arg2, arg3);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementCustomNode_init : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichElementCustomNode_init)

static bool js_cocos2dx_ui_RichElementCustomNode_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        cocos2d::Node* arg3 = nullptr;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        ok &= seval_to_native_ptr(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementCustomNode_create : Error processing arguments");
        auto result = cocos2d::ui::RichElementCustomNode::create(arg0, arg1, arg2, arg3);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_RichElementCustomNode_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichElementCustomNode_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_RichElementCustomNode_finalize)

static bool js_cocos2dx_ui_RichElementCustomNode_constructor(se::State& s)
{
    cocos2d::ui::RichElementCustomNode* cobj = new (std::nothrow) cocos2d::ui::RichElementCustomNode();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_RichElementCustomNode_constructor, __jsb_cocos2d_ui_RichElementCustomNode_class, js_cocos2d_ui_RichElementCustomNode_finalize)

static bool js_cocos2dx_ui_RichElementCustomNode_ctor(se::State& s)
{
    cocos2d::ui::RichElementCustomNode* cobj = new (std::nothrow) cocos2d::ui::RichElementCustomNode();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_RichElementCustomNode_ctor, __jsb_cocos2d_ui_RichElementCustomNode_class, js_cocos2d_ui_RichElementCustomNode_finalize)


    

extern se::Object* __jsb_cocos2d_ui_RichElement_proto;

static bool js_cocos2d_ui_RichElementCustomNode_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::RichElementCustomNode)", s.nativeThisObject());
    cocos2d::ui::RichElementCustomNode* cobj = (cocos2d::ui::RichElementCustomNode*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_RichElementCustomNode_finalize)

bool js_register_cocos2dx_ui_RichElementCustomNode(se::Object* obj)
{
    auto cls = se::Class::create("RichElementCustomNode", obj, __jsb_cocos2d_ui_RichElement_proto, _SE(js_cocos2dx_ui_RichElementCustomNode_constructor));

    cls->defineFunction("init", _SE(js_cocos2dx_ui_RichElementCustomNode_init));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_RichElementCustomNode_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_RichElementCustomNode_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_RichElementCustomNode_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::RichElementCustomNode>(cls);

    __jsb_cocos2d_ui_RichElementCustomNode_proto = cls->getProto();
    __jsb_cocos2d_ui_RichElementCustomNode_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.RichElementCustomNode.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_RichElementNewLine_proto = nullptr;
se::Class* __jsb_cocos2d_ui_RichElementNewLine_class = nullptr;

static bool js_cocos2dx_ui_RichElementNewLine_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        int arg0 = 0;
        cocos2d::Color3B arg1;
        uint8_t arg2;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_uint8(args[2], (uint8_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichElementNewLine_create : Error processing arguments");
        auto result = cocos2d::ui::RichElementNewLine::create(arg0, arg1, arg2);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_RichElementNewLine_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichElementNewLine_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_RichElementNewLine_finalize)

static bool js_cocos2dx_ui_RichElementNewLine_constructor(se::State& s)
{
    cocos2d::ui::RichElementNewLine* cobj = new (std::nothrow) cocos2d::ui::RichElementNewLine();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_RichElementNewLine_constructor, __jsb_cocos2d_ui_RichElementNewLine_class, js_cocos2d_ui_RichElementNewLine_finalize)

static bool js_cocos2dx_ui_RichElementNewLine_ctor(se::State& s)
{
    cocos2d::ui::RichElementNewLine* cobj = new (std::nothrow) cocos2d::ui::RichElementNewLine();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_RichElementNewLine_ctor, __jsb_cocos2d_ui_RichElementNewLine_class, js_cocos2d_ui_RichElementNewLine_finalize)


    

extern se::Object* __jsb_cocos2d_ui_RichElement_proto;

static bool js_cocos2d_ui_RichElementNewLine_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::RichElementNewLine)", s.nativeThisObject());
    cocos2d::ui::RichElementNewLine* cobj = (cocos2d::ui::RichElementNewLine*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_RichElementNewLine_finalize)

bool js_register_cocos2dx_ui_RichElementNewLine(se::Object* obj)
{
    auto cls = se::Class::create("RichElementNewLine", obj, __jsb_cocos2d_ui_RichElement_proto, _SE(js_cocos2dx_ui_RichElementNewLine_constructor));

    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_RichElementNewLine_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_RichElementNewLine_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_RichElementNewLine_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::RichElementNewLine>(cls);

    __jsb_cocos2d_ui_RichElementNewLine_proto = cls->getProto();
    __jsb_cocos2d_ui_RichElementNewLine_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.RichElementNewLine.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_RichText_proto = nullptr;
se::Class* __jsb_cocos2d_ui_RichText_class = nullptr;

static bool js_cocos2dx_ui_RichText_insertElement(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_insertElement : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::ui::RichElement* arg0 = nullptr;
        int arg1 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_insertElement : Error processing arguments");
        cobj->insertElement(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_insertElement)

static bool js_cocos2dx_ui_RichText_setAnchorTextOutline(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_setAnchorTextOutline : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_setAnchorTextOutline : Error processing arguments");
        cobj->setAnchorTextOutline(arg0);
        return true;
    }
    if (argc == 2) {
        bool arg0;
        cocos2d::Color3B arg1;
        ok &= seval_to_boolean(args[0], &arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_setAnchorTextOutline : Error processing arguments");
        cobj->setAnchorTextOutline(arg0, arg1);
        return true;
    }
    if (argc == 3) {
        bool arg0;
        cocos2d::Color3B arg1;
        int arg2 = 0;
        ok &= seval_to_boolean(args[0], &arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_setAnchorTextOutline : Error processing arguments");
        cobj->setAnchorTextOutline(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_setAnchorTextOutline)

static bool js_cocos2dx_ui_RichText_getFontSize(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_getFontSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFontSize();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_getFontSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_getFontSize)

static bool js_cocos2dx_ui_RichText_pushBackElement(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_pushBackElement : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::RichElement* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_pushBackElement : Error processing arguments");
        cobj->pushBackElement(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_pushBackElement)

static bool js_cocos2dx_ui_RichText_setAnchorTextBold(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_setAnchorTextBold : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_setAnchorTextBold : Error processing arguments");
        cobj->setAnchorTextBold(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_setAnchorTextBold)

static bool js_cocos2dx_ui_RichText_getAnchorFontColor(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_getAnchorFontColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getAnchorFontColor();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_getAnchorFontColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_getAnchorFontColor)

static bool js_cocos2dx_ui_RichText_getAnchorTextShadowBlurRadius(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_getAnchorTextShadowBlurRadius : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getAnchorTextShadowBlurRadius();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_getAnchorTextShadowBlurRadius : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_getAnchorTextShadowBlurRadius)

static bool js_cocos2dx_ui_RichText_setAnchorTextShadow(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_setAnchorTextShadow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_setAnchorTextShadow : Error processing arguments");
        cobj->setAnchorTextShadow(arg0);
        return true;
    }
    if (argc == 2) {
        bool arg0;
        cocos2d::Color3B arg1;
        ok &= seval_to_boolean(args[0], &arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_setAnchorTextShadow : Error processing arguments");
        cobj->setAnchorTextShadow(arg0, arg1);
        return true;
    }
    if (argc == 3) {
        bool arg0;
        cocos2d::Color3B arg1;
        cocos2d::Size arg2;
        ok &= seval_to_boolean(args[0], &arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_Size(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_setAnchorTextShadow : Error processing arguments");
        cobj->setAnchorTextShadow(arg0, arg1, arg2);
        return true;
    }
    if (argc == 4) {
        bool arg0;
        cocos2d::Color3B arg1;
        cocos2d::Size arg2;
        int arg3 = 0;
        ok &= seval_to_boolean(args[0], &arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        ok &= seval_to_Size(args[2], &arg2);
        ok &= seval_to_int32(args[3], (int32_t*)&arg3);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_setAnchorTextShadow : Error processing arguments");
        cobj->setAnchorTextShadow(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_setAnchorTextShadow)

static bool js_cocos2dx_ui_RichText_isAnchorTextItalicEnabled(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_isAnchorTextItalicEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isAnchorTextItalicEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_isAnchorTextItalicEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_isAnchorTextItalicEnabled)

static bool js_cocos2dx_ui_RichText_setAnchorFontColor(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_setAnchorFontColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_setAnchorFontColor : Error processing arguments");
        cobj->setAnchorFontColor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_setAnchorFontColor)

static bool js_cocos2dx_ui_RichText_setFontFace(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_setFontFace : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_setFontFace : Error processing arguments");
        cobj->setFontFace(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_setFontFace)

static bool js_cocos2dx_ui_RichText_setAnchorTextGlow(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_setAnchorTextGlow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_setAnchorTextGlow : Error processing arguments");
        cobj->setAnchorTextGlow(arg0);
        return true;
    }
    if (argc == 2) {
        bool arg0;
        cocos2d::Color3B arg1;
        ok &= seval_to_boolean(args[0], &arg0);
        ok &= seval_to_Color3B(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_setAnchorTextGlow : Error processing arguments");
        cobj->setAnchorTextGlow(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_setAnchorTextGlow)

static bool js_cocos2dx_ui_RichText_setAnchorTextDel(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_setAnchorTextDel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_setAnchorTextDel : Error processing arguments");
        cobj->setAnchorTextDel(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_setAnchorTextDel)

static bool js_cocos2dx_ui_RichText_getAnchorTextOutlineColor3B(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_getAnchorTextOutlineColor3B : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Color3B result = cobj->getAnchorTextOutlineColor3B();
        ok &= Color3B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_getAnchorTextOutlineColor3B : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_getAnchorTextOutlineColor3B)

static bool js_cocos2dx_ui_RichText_stringWithColor4B(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_stringWithColor4B : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Color4B arg0;
        ok &= seval_to_Color4B(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_stringWithColor4B : Error processing arguments");
        std::string result = cobj->stringWithColor4B(arg0);
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_stringWithColor4B : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_stringWithColor4B)

static bool js_cocos2dx_ui_RichText_initWithXML(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_initWithXML : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        cocos2d::ValueMap arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_ccvaluemap(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_initWithXML : Error processing arguments");
        bool result = cobj->initWithXML(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_initWithXML : Error processing arguments");
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        cocos2d::ValueMap arg1;
        std::function<void (const std::basic_string<char> &)> arg2;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_ccvaluemap(args[1], &arg1);
        do {
            if (args[2].isObject() && args[2].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[2]);
                jsThis.toObject()->attachChild(jsFunc.toObject());
                auto lambda = [=](const std::basic_string<char> & larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= std_string_to_seval(larg0, &args[0]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg2 = lambda;
            }
            else
            {
                arg2 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_initWithXML : Error processing arguments");
        bool result = cobj->initWithXML(arg0, arg1, arg2);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_initWithXML : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_initWithXML)

static bool js_cocos2dx_ui_RichText_getAnchorFontColor3B(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_getAnchorFontColor3B : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Color3B result = cobj->getAnchorFontColor3B();
        ok &= Color3B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_getAnchorFontColor3B : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_getAnchorFontColor3B)

static bool js_cocos2dx_ui_RichText_formatText(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_formatText : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->formatText();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_formatText)

static bool js_cocos2dx_ui_RichText_getAnchorTextGlowColor3B(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_getAnchorTextGlowColor3B : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Color3B result = cobj->getAnchorTextGlowColor3B();
        ok &= Color3B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_getAnchorTextGlowColor3B : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_getAnchorTextGlowColor3B)

static bool js_cocos2dx_ui_RichText_openUrl(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_openUrl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_openUrl : Error processing arguments");
        cobj->openUrl(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_openUrl)

static bool js_cocos2dx_ui_RichText_getFontFace(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_getFontFace : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getFontFace();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_getFontFace : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_getFontFace)

static bool js_cocos2dx_ui_RichText_setFontColor(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_setFontColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_setFontColor : Error processing arguments");
        cobj->setFontColor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_setFontColor)

static bool js_cocos2dx_ui_RichText_isAnchorTextGlowEnabled(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_isAnchorTextGlowEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isAnchorTextGlowEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_isAnchorTextGlowEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_isAnchorTextGlowEnabled)

static bool js_cocos2dx_ui_RichText_getDefaults(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_getDefaults : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ValueMap result = cobj->getDefaults();
        ok &= ccvaluemap_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_getDefaults : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_getDefaults)

static bool js_cocos2dx_ui_RichText_isAnchorTextUnderlineEnabled(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_isAnchorTextUnderlineEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isAnchorTextUnderlineEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_isAnchorTextUnderlineEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_isAnchorTextUnderlineEnabled)

static bool js_cocos2dx_ui_RichText_getFontColor(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_getFontColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        std::string result = cobj->getFontColor();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_getFontColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_getFontColor)

static bool js_cocos2dx_ui_RichText_isAnchorTextShadowEnabled(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_isAnchorTextShadowEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isAnchorTextShadowEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_isAnchorTextShadowEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_isAnchorTextShadowEnabled)

static bool js_cocos2dx_ui_RichText_getAnchorTextOutlineSize(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_getAnchorTextOutlineSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getAnchorTextOutlineSize();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_getAnchorTextOutlineSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_getAnchorTextOutlineSize)

static bool js_cocos2dx_ui_RichText_setVerticalSpace(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_setVerticalSpace : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_setVerticalSpace : Error processing arguments");
        cobj->setVerticalSpace(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_setVerticalSpace)

static bool js_cocos2dx_ui_RichText_isAnchorTextDelEnabled(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_isAnchorTextDelEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isAnchorTextDelEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_isAnchorTextDelEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_isAnchorTextDelEnabled)

static bool js_cocos2dx_ui_RichText_setDefaults(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_setDefaults : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ValueMap arg0;
        ok &= seval_to_ccvaluemap(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_setDefaults : Error processing arguments");
        cobj->setDefaults(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_setDefaults)

static bool js_cocos2dx_ui_RichText_setWrapMode(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_setWrapMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::RichText::WrapMode arg0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_setWrapMode : Error processing arguments");
        cobj->setWrapMode(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_setWrapMode)

static bool js_cocos2dx_ui_RichText_setFontSize(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_setFontSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_setFontSize : Error processing arguments");
        cobj->setFontSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_setFontSize)

static bool js_cocos2dx_ui_RichText_removeElement(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ui_RichText_removeElement : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            cocos2d::ui::RichElement* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cobj->removeElement(arg0);
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            int arg0 = 0;
            ok &= seval_to_int32(args[0], (int32_t*)&arg0);
            if (!ok) { ok = true; break; }
            cobj->removeElement(arg0);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_removeElement)

static bool js_cocos2dx_ui_RichText_setAnchorTextItalic(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_setAnchorTextItalic : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_setAnchorTextItalic : Error processing arguments");
        cobj->setAnchorTextItalic(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_setAnchorTextItalic)

static bool js_cocos2dx_ui_RichText_getAnchorTextShadowOffset(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_getAnchorTextShadowOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Size result = cobj->getAnchorTextShadowOffset();
        ok &= Size_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_getAnchorTextShadowOffset : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_getAnchorTextShadowOffset)

static bool js_cocos2dx_ui_RichText_isAnchorTextBoldEnabled(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_isAnchorTextBoldEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isAnchorTextBoldEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_isAnchorTextBoldEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_isAnchorTextBoldEnabled)

static bool js_cocos2dx_ui_RichText_getAnchorTextShadowColor3B(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_getAnchorTextShadowColor3B : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Color3B result = cobj->getAnchorTextShadowColor3B();
        ok &= Color3B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_getAnchorTextShadowColor3B : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_getAnchorTextShadowColor3B)

static bool js_cocos2dx_ui_RichText_stringWithColor3B(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_stringWithColor3B : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Color3B arg0;
        ok &= seval_to_Color3B(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_stringWithColor3B : Error processing arguments");
        std::string result = cobj->stringWithColor3B(arg0);
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_stringWithColor3B : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_stringWithColor3B)

static bool js_cocos2dx_ui_RichText_isAnchorTextOutlineEnabled(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_isAnchorTextOutlineEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isAnchorTextOutlineEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_isAnchorTextOutlineEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_isAnchorTextOutlineEnabled)

static bool js_cocos2dx_ui_RichText_getFontColor3B(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_getFontColor3B : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Color3B result = cobj->getFontColor3B();
        ok &= Color3B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_getFontColor3B : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_getFontColor3B)

static bool js_cocos2dx_ui_RichText_getWrapMode(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_getWrapMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = (unsigned int)cobj->getWrapMode();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_getWrapMode : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_getWrapMode)

static bool js_cocos2dx_ui_RichText_setAnchorTextUnderline(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_setAnchorTextUnderline : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_setAnchorTextUnderline : Error processing arguments");
        cobj->setAnchorTextUnderline(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_setAnchorTextUnderline)

static bool js_cocos2dx_ui_RichText_color3BWithString(se::State& s)
{
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RichText_color3BWithString : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_color3BWithString : Error processing arguments");
        cocos2d::Color3B result = cobj->color3BWithString(arg0);
        ok &= Color3B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_color3BWithString : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_color3BWithString)

static bool js_cocos2dx_ui_RichText_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = cocos2d::ui::RichText::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_RichText_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_create)

static bool js_cocos2dx_ui_RichText_createWithXML(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        cocos2d::ValueMap arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_ccvaluemap(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_createWithXML : Error processing arguments");
        auto result = cocos2d::ui::RichText::createWithXML(arg0, arg1);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_RichText_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        cocos2d::ValueMap arg1;
        std::function<void (const std::basic_string<char> &)> arg2;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_ccvaluemap(args[1], &arg1);
        do {
            if (args[2].isObject() && args[2].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[2]);
                jsFunc.toObject()->root();
                auto lambda = [=](const std::basic_string<char> & larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= std_string_to_seval(larg0, &args[0]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg2 = lambda;
            }
            else
            {
                arg2 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RichText_createWithXML : Error processing arguments");
        auto result = cocos2d::ui::RichText::createWithXML(arg0, arg1, arg2);
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_RichText_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RichText_createWithXML)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_RichText_finalize)

static bool js_cocos2dx_ui_RichText_constructor(se::State& s)
{
    cocos2d::ui::RichText* cobj = new (std::nothrow) cocos2d::ui::RichText();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_RichText_constructor, __jsb_cocos2d_ui_RichText_class, js_cocos2d_ui_RichText_finalize)

static bool js_cocos2dx_ui_RichText_ctor(se::State& s)
{
    cocos2d::ui::RichText* cobj = new (std::nothrow) cocos2d::ui::RichText();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_RichText_ctor, __jsb_cocos2d_ui_RichText_class, js_cocos2d_ui_RichText_finalize)


    

extern se::Object* __jsb_cocos2d_ui_Widget_proto;

static bool js_cocos2d_ui_RichText_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::RichText)", s.nativeThisObject());
    cocos2d::ui::RichText* cobj = (cocos2d::ui::RichText*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_RichText_finalize)

bool js_register_cocos2dx_ui_RichText(se::Object* obj)
{
    auto cls = se::Class::create("RichText", obj, __jsb_cocos2d_ui_Widget_proto, _SE(js_cocos2dx_ui_RichText_constructor));

    cls->defineFunction("insertElement", _SE(js_cocos2dx_ui_RichText_insertElement));
    cls->defineFunction("setAnchorTextOutline", _SE(js_cocos2dx_ui_RichText_setAnchorTextOutline));
    cls->defineFunction("getFontSize", _SE(js_cocos2dx_ui_RichText_getFontSize));
    cls->defineFunction("pushBackElement", _SE(js_cocos2dx_ui_RichText_pushBackElement));
    cls->defineFunction("setAnchorTextBold", _SE(js_cocos2dx_ui_RichText_setAnchorTextBold));
    cls->defineFunction("getAnchorFontColor", _SE(js_cocos2dx_ui_RichText_getAnchorFontColor));
    cls->defineFunction("getAnchorTextShadowBlurRadius", _SE(js_cocos2dx_ui_RichText_getAnchorTextShadowBlurRadius));
    cls->defineFunction("setAnchorTextShadow", _SE(js_cocos2dx_ui_RichText_setAnchorTextShadow));
    cls->defineFunction("isAnchorTextItalicEnabled", _SE(js_cocos2dx_ui_RichText_isAnchorTextItalicEnabled));
    cls->defineFunction("setAnchorFontColor", _SE(js_cocos2dx_ui_RichText_setAnchorFontColor));
    cls->defineFunction("setFontFace", _SE(js_cocos2dx_ui_RichText_setFontFace));
    cls->defineFunction("setAnchorTextGlow", _SE(js_cocos2dx_ui_RichText_setAnchorTextGlow));
    cls->defineFunction("setAnchorTextDel", _SE(js_cocos2dx_ui_RichText_setAnchorTextDel));
    cls->defineFunction("getAnchorTextOutlineColor3B", _SE(js_cocos2dx_ui_RichText_getAnchorTextOutlineColor3B));
    cls->defineFunction("stringWithColor4B", _SE(js_cocos2dx_ui_RichText_stringWithColor4B));
    cls->defineFunction("initWithXML", _SE(js_cocos2dx_ui_RichText_initWithXML));
    cls->defineFunction("getAnchorFontColor3B", _SE(js_cocos2dx_ui_RichText_getAnchorFontColor3B));
    cls->defineFunction("formatText", _SE(js_cocos2dx_ui_RichText_formatText));
    cls->defineFunction("getAnchorTextGlowColor3B", _SE(js_cocos2dx_ui_RichText_getAnchorTextGlowColor3B));
    cls->defineFunction("openUrl", _SE(js_cocos2dx_ui_RichText_openUrl));
    cls->defineFunction("getFontFace", _SE(js_cocos2dx_ui_RichText_getFontFace));
    cls->defineFunction("setFontColor", _SE(js_cocos2dx_ui_RichText_setFontColor));
    cls->defineFunction("isAnchorTextGlowEnabled", _SE(js_cocos2dx_ui_RichText_isAnchorTextGlowEnabled));
    cls->defineFunction("getDefaults", _SE(js_cocos2dx_ui_RichText_getDefaults));
    cls->defineFunction("isAnchorTextUnderlineEnabled", _SE(js_cocos2dx_ui_RichText_isAnchorTextUnderlineEnabled));
    cls->defineFunction("getFontColor", _SE(js_cocos2dx_ui_RichText_getFontColor));
    cls->defineFunction("isAnchorTextShadowEnabled", _SE(js_cocos2dx_ui_RichText_isAnchorTextShadowEnabled));
    cls->defineFunction("getAnchorTextOutlineSize", _SE(js_cocos2dx_ui_RichText_getAnchorTextOutlineSize));
    cls->defineFunction("setVerticalSpace", _SE(js_cocos2dx_ui_RichText_setVerticalSpace));
    cls->defineFunction("isAnchorTextDelEnabled", _SE(js_cocos2dx_ui_RichText_isAnchorTextDelEnabled));
    cls->defineFunction("setDefaults", _SE(js_cocos2dx_ui_RichText_setDefaults));
    cls->defineFunction("setWrapMode", _SE(js_cocos2dx_ui_RichText_setWrapMode));
    cls->defineFunction("setFontSize", _SE(js_cocos2dx_ui_RichText_setFontSize));
    cls->defineFunction("removeElement", _SE(js_cocos2dx_ui_RichText_removeElement));
    cls->defineFunction("setAnchorTextItalic", _SE(js_cocos2dx_ui_RichText_setAnchorTextItalic));
    cls->defineFunction("getAnchorTextShadowOffset", _SE(js_cocos2dx_ui_RichText_getAnchorTextShadowOffset));
    cls->defineFunction("isAnchorTextBoldEnabled", _SE(js_cocos2dx_ui_RichText_isAnchorTextBoldEnabled));
    cls->defineFunction("getAnchorTextShadowColor3B", _SE(js_cocos2dx_ui_RichText_getAnchorTextShadowColor3B));
    cls->defineFunction("stringWithColor3B", _SE(js_cocos2dx_ui_RichText_stringWithColor3B));
    cls->defineFunction("isAnchorTextOutlineEnabled", _SE(js_cocos2dx_ui_RichText_isAnchorTextOutlineEnabled));
    cls->defineFunction("getFontColor3B", _SE(js_cocos2dx_ui_RichText_getFontColor3B));
    cls->defineFunction("getWrapMode", _SE(js_cocos2dx_ui_RichText_getWrapMode));
    cls->defineFunction("setAnchorTextUnderline", _SE(js_cocos2dx_ui_RichText_setAnchorTextUnderline));
    cls->defineFunction("color3BWithString", _SE(js_cocos2dx_ui_RichText_color3BWithString));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_RichText_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_RichText_create));
    cls->defineStaticFunction("createWithXML", _SE(js_cocos2dx_ui_RichText_createWithXML));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_RichText_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::RichText>(cls);

    __jsb_cocos2d_ui_RichText_proto = cls->getProto();
    __jsb_cocos2d_ui_RichText_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.RichText.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_HBox_proto = nullptr;
se::Class* __jsb_cocos2d_ui_HBox_class = nullptr;

static bool js_cocos2dx_ui_HBox_initWithSize(se::State& s)
{
    cocos2d::ui::HBox* cobj = (cocos2d::ui::HBox*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_HBox_initWithSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Size arg0;
        ok &= seval_to_Size(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_HBox_initWithSize : Error processing arguments");
        bool result = cobj->initWithSize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_HBox_initWithSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_HBox_initWithSize)

static bool js_cocos2dx_ui_HBox_create(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            cocos2d::Size arg0;
            ok &= seval_to_Size(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::ui::HBox* result = cocos2d::ui::HBox::create(arg0);
            ok &= native_ptr_to_seval<cocos2d::ui::HBox>((cocos2d::ui::HBox*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_HBox_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 0) {
            cocos2d::ui::HBox* result = cocos2d::ui::HBox::create();
            ok &= native_ptr_to_seval<cocos2d::ui::HBox>((cocos2d::ui::HBox*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_HBox_create : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_HBox_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_HBox_finalize)

static bool js_cocos2dx_ui_HBox_constructor(se::State& s)
{
    cocos2d::ui::HBox* cobj = new (std::nothrow) cocos2d::ui::HBox();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_HBox_constructor, __jsb_cocos2d_ui_HBox_class, js_cocos2d_ui_HBox_finalize)

static bool js_cocos2dx_ui_HBox_ctor(se::State& s)
{
    cocos2d::ui::HBox* cobj = new (std::nothrow) cocos2d::ui::HBox();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_HBox_ctor, __jsb_cocos2d_ui_HBox_class, js_cocos2d_ui_HBox_finalize)


    

extern se::Object* __jsb_cocos2d_ui_Layout_proto;

static bool js_cocos2d_ui_HBox_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::HBox)", s.nativeThisObject());
    cocos2d::ui::HBox* cobj = (cocos2d::ui::HBox*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_HBox_finalize)

bool js_register_cocos2dx_ui_HBox(se::Object* obj)
{
    auto cls = se::Class::create("HBox", obj, __jsb_cocos2d_ui_Layout_proto, _SE(js_cocos2dx_ui_HBox_constructor));

    cls->defineFunction("initWithSize", _SE(js_cocos2dx_ui_HBox_initWithSize));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_HBox_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_HBox_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_HBox_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::HBox>(cls);

    __jsb_cocos2d_ui_HBox_proto = cls->getProto();
    __jsb_cocos2d_ui_HBox_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.HBox.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_VBox_proto = nullptr;
se::Class* __jsb_cocos2d_ui_VBox_class = nullptr;

static bool js_cocos2dx_ui_VBox_initWithSize(se::State& s)
{
    cocos2d::ui::VBox* cobj = (cocos2d::ui::VBox*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_VBox_initWithSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Size arg0;
        ok &= seval_to_Size(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_VBox_initWithSize : Error processing arguments");
        bool result = cobj->initWithSize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_VBox_initWithSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_VBox_initWithSize)

static bool js_cocos2dx_ui_VBox_create(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            cocos2d::Size arg0;
            ok &= seval_to_Size(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::ui::VBox* result = cocos2d::ui::VBox::create(arg0);
            ok &= native_ptr_to_seval<cocos2d::ui::VBox>((cocos2d::ui::VBox*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_VBox_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 0) {
            cocos2d::ui::VBox* result = cocos2d::ui::VBox::create();
            ok &= native_ptr_to_seval<cocos2d::ui::VBox>((cocos2d::ui::VBox*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_VBox_create : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_VBox_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_VBox_finalize)

static bool js_cocos2dx_ui_VBox_constructor(se::State& s)
{
    cocos2d::ui::VBox* cobj = new (std::nothrow) cocos2d::ui::VBox();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_VBox_constructor, __jsb_cocos2d_ui_VBox_class, js_cocos2d_ui_VBox_finalize)

static bool js_cocos2dx_ui_VBox_ctor(se::State& s)
{
    cocos2d::ui::VBox* cobj = new (std::nothrow) cocos2d::ui::VBox();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_VBox_ctor, __jsb_cocos2d_ui_VBox_class, js_cocos2d_ui_VBox_finalize)


    

extern se::Object* __jsb_cocos2d_ui_Layout_proto;

static bool js_cocos2d_ui_VBox_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::VBox)", s.nativeThisObject());
    cocos2d::ui::VBox* cobj = (cocos2d::ui::VBox*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_VBox_finalize)

bool js_register_cocos2dx_ui_VBox(se::Object* obj)
{
    auto cls = se::Class::create("VBox", obj, __jsb_cocos2d_ui_Layout_proto, _SE(js_cocos2dx_ui_VBox_constructor));

    cls->defineFunction("initWithSize", _SE(js_cocos2dx_ui_VBox_initWithSize));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_VBox_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_VBox_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_VBox_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::VBox>(cls);

    __jsb_cocos2d_ui_VBox_proto = cls->getProto();
    __jsb_cocos2d_ui_VBox_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.VBox.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_RelativeBox_proto = nullptr;
se::Class* __jsb_cocos2d_ui_RelativeBox_class = nullptr;

static bool js_cocos2dx_ui_RelativeBox_initWithSize(se::State& s)
{
    cocos2d::ui::RelativeBox* cobj = (cocos2d::ui::RelativeBox*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_RelativeBox_initWithSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Size arg0;
        ok &= seval_to_Size(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RelativeBox_initWithSize : Error processing arguments");
        bool result = cobj->initWithSize(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RelativeBox_initWithSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RelativeBox_initWithSize)

static bool js_cocos2dx_ui_RelativeBox_create(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            cocos2d::Size arg0;
            ok &= seval_to_Size(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::ui::RelativeBox* result = cocos2d::ui::RelativeBox::create(arg0);
            ok &= native_ptr_to_seval<cocos2d::ui::RelativeBox>((cocos2d::ui::RelativeBox*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RelativeBox_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 0) {
            cocos2d::ui::RelativeBox* result = cocos2d::ui::RelativeBox::create();
            ok &= native_ptr_to_seval<cocos2d::ui::RelativeBox>((cocos2d::ui::RelativeBox*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_RelativeBox_create : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_RelativeBox_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_RelativeBox_finalize)

static bool js_cocos2dx_ui_RelativeBox_constructor(se::State& s)
{
    cocos2d::ui::RelativeBox* cobj = new (std::nothrow) cocos2d::ui::RelativeBox();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_RelativeBox_constructor, __jsb_cocos2d_ui_RelativeBox_class, js_cocos2d_ui_RelativeBox_finalize)

static bool js_cocos2dx_ui_RelativeBox_ctor(se::State& s)
{
    cocos2d::ui::RelativeBox* cobj = new (std::nothrow) cocos2d::ui::RelativeBox();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_RelativeBox_ctor, __jsb_cocos2d_ui_RelativeBox_class, js_cocos2d_ui_RelativeBox_finalize)


    

extern se::Object* __jsb_cocos2d_ui_Layout_proto;

static bool js_cocos2d_ui_RelativeBox_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::RelativeBox)", s.nativeThisObject());
    cocos2d::ui::RelativeBox* cobj = (cocos2d::ui::RelativeBox*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_RelativeBox_finalize)

bool js_register_cocos2dx_ui_RelativeBox(se::Object* obj)
{
    auto cls = se::Class::create("RelativeBox", obj, __jsb_cocos2d_ui_Layout_proto, _SE(js_cocos2dx_ui_RelativeBox_constructor));

    cls->defineFunction("initWithSize", _SE(js_cocos2dx_ui_RelativeBox_initWithSize));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_RelativeBox_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_RelativeBox_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_RelativeBox_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::RelativeBox>(cls);

    __jsb_cocos2d_ui_RelativeBox_proto = cls->getProto();
    __jsb_cocos2d_ui_RelativeBox_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.RelativeBox.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_Scale9Sprite_proto = nullptr;
se::Class* __jsb_cocos2d_ui_Scale9Sprite_class = nullptr;

static bool js_cocos2dx_ui_Scale9Sprite_disableCascadeColor(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_disableCascadeColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->disableCascadeColor();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_disableCascadeColor)

static bool js_cocos2dx_ui_Scale9Sprite_updateWithSprite(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ui_Scale9Sprite_updateWithSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 6) {
            cocos2d::Sprite* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Rect arg1;
            ok &= seval_to_Rect(args[1], &arg1);
            if (!ok) { ok = true; break; }
            bool arg2;
            ok &= seval_to_boolean(args[2], &arg2);
            cocos2d::Vec2 arg3;
            ok &= seval_to_Vec2(args[3], &arg3);
            if (!ok) { ok = true; break; }
            cocos2d::Size arg4;
            ok &= seval_to_Size(args[4], &arg4);
            if (!ok) { ok = true; break; }
            cocos2d::Rect arg5;
            ok &= seval_to_Rect(args[5], &arg5);
            if (!ok) { ok = true; break; }
            bool result = cobj->updateWithSprite(arg0, arg1, arg2, arg3, arg4, arg5);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_updateWithSprite : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 4) {
            cocos2d::Sprite* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Rect arg1;
            ok &= seval_to_Rect(args[1], &arg1);
            if (!ok) { ok = true; break; }
            bool arg2;
            ok &= seval_to_boolean(args[2], &arg2);
            cocos2d::Rect arg3;
            ok &= seval_to_Rect(args[3], &arg3);
            if (!ok) { ok = true; break; }
            bool result = cobj->updateWithSprite(arg0, arg1, arg2, arg3);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_updateWithSprite : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_updateWithSprite)

static bool js_cocos2dx_ui_Scale9Sprite_isFlippedX(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_isFlippedX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isFlippedX();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_isFlippedX : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_isFlippedX)

static bool js_cocos2dx_ui_Scale9Sprite_setScale9Enabled(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_setScale9Enabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_setScale9Enabled : Error processing arguments");
        cobj->setScale9Enabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_setScale9Enabled)

static bool js_cocos2dx_ui_Scale9Sprite_setFlippedY(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_setFlippedY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_setFlippedY : Error processing arguments");
        cobj->setFlippedY(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_setFlippedY)

static bool js_cocos2dx_ui_Scale9Sprite_setFlippedX(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_setFlippedX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_setFlippedX : Error processing arguments");
        cobj->setFlippedX(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_setFlippedX)

static bool js_cocos2dx_ui_Scale9Sprite_resizableSpriteWithCapInsets(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_resizableSpriteWithCapInsets : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Rect arg0;
        ok &= seval_to_Rect(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_resizableSpriteWithCapInsets : Error processing arguments");
        cocos2d::ui::Scale9Sprite* result = cobj->resizableSpriteWithCapInsets(arg0);
        ok &= native_ptr_to_seval<cocos2d::ui::Scale9Sprite>((cocos2d::ui::Scale9Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_resizableSpriteWithCapInsets : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_resizableSpriteWithCapInsets)

static bool js_cocos2dx_ui_Scale9Sprite_disableCascadeOpacity(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_disableCascadeOpacity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->disableCascadeOpacity();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_disableCascadeOpacity)

static bool js_cocos2dx_ui_Scale9Sprite_getState(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_getState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getState();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_getState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_getState)

static bool js_cocos2dx_ui_Scale9Sprite_setState(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_setState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::Scale9Sprite::State arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_setState : Error processing arguments");
        cobj->setState(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_setState)

static bool js_cocos2dx_ui_Scale9Sprite_setInsetBottom(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_setInsetBottom : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_setInsetBottom : Error processing arguments");
        cobj->setInsetBottom(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_setInsetBottom)

static bool js_cocos2dx_ui_Scale9Sprite_initWithSpriteFrameName(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ui_Scale9Sprite_initWithSpriteFrameName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            bool result = cobj->initWithSpriteFrameName(arg0);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_initWithSpriteFrameName : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Rect arg1;
            ok &= seval_to_Rect(args[1], &arg1);
            if (!ok) { ok = true; break; }
            bool result = cobj->initWithSpriteFrameName(arg0, arg1);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_initWithSpriteFrameName : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_initWithSpriteFrameName)

static bool js_cocos2dx_ui_Scale9Sprite_getSprite(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_getSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Sprite* result = cobj->getSprite();
        ok &= native_ptr_to_seval<cocos2d::Sprite>((cocos2d::Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_getSprite : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_getSprite)

static bool js_cocos2dx_ui_Scale9Sprite_setInsetTop(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_setInsetTop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_setInsetTop : Error processing arguments");
        cobj->setInsetTop(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_setInsetTop)

static bool js_cocos2dx_ui_Scale9Sprite_setRenderingType(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_setRenderingType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::Scale9Sprite::RenderingType arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_setRenderingType : Error processing arguments");
        cobj->setRenderingType(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_setRenderingType)

static bool js_cocos2dx_ui_Scale9Sprite_init(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ui_Scale9Sprite_init : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 3) {
            cocos2d::Sprite* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Rect arg1;
            ok &= seval_to_Rect(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::Rect arg2;
            ok &= seval_to_Rect(args[2], &arg2);
            if (!ok) { ok = true; break; }
            bool result = cobj->init(arg0, arg1, arg2);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_init : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 4) {
            cocos2d::Sprite* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Rect arg1;
            ok &= seval_to_Rect(args[1], &arg1);
            if (!ok) { ok = true; break; }
            bool arg2;
            ok &= seval_to_boolean(args[2], &arg2);
            cocos2d::Rect arg3;
            ok &= seval_to_Rect(args[3], &arg3);
            if (!ok) { ok = true; break; }
            bool result = cobj->init(arg0, arg1, arg2, arg3);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_init : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 6) {
            cocos2d::Sprite* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Rect arg1;
            ok &= seval_to_Rect(args[1], &arg1);
            if (!ok) { ok = true; break; }
            bool arg2;
            ok &= seval_to_boolean(args[2], &arg2);
            cocos2d::Vec2 arg3;
            ok &= seval_to_Vec2(args[3], &arg3);
            if (!ok) { ok = true; break; }
            cocos2d::Size arg4;
            ok &= seval_to_Size(args[4], &arg4);
            if (!ok) { ok = true; break; }
            cocos2d::Rect arg5;
            ok &= seval_to_Rect(args[5], &arg5);
            if (!ok) { ok = true; break; }
            bool result = cobj->init(arg0, arg1, arg2, arg3, arg4, arg5);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_init : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_init)

static bool js_cocos2dx_ui_Scale9Sprite_setPreferredSize(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_setPreferredSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Size arg0;
        ok &= seval_to_Size(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_setPreferredSize : Error processing arguments");
        cobj->setPreferredSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_setPreferredSize)

static bool js_cocos2dx_ui_Scale9Sprite_setSpriteFrame(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_setSpriteFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::SpriteFrame* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_setSpriteFrame : Error processing arguments");
        cobj->setSpriteFrame(arg0);
        return true;
    }
    if (argc == 2) {
        cocos2d::SpriteFrame* arg0 = nullptr;
        cocos2d::Rect arg1;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_Rect(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_setSpriteFrame : Error processing arguments");
        cobj->setSpriteFrame(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_setSpriteFrame)

static bool js_cocos2dx_ui_Scale9Sprite_getBlendFunc(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_getBlendFunc : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::BlendFunc& result = cobj->getBlendFunc();
        ok &= blendfunc_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_getBlendFunc : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_getBlendFunc)

static bool js_cocos2dx_ui_Scale9Sprite_getInsetBottom(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_getInsetBottom : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getInsetBottom();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_getInsetBottom : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_getInsetBottom)

static bool js_cocos2dx_ui_Scale9Sprite_getCapInsets(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_getCapInsets : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Rect result = cobj->getCapInsets();
        ok &= Rect_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_getCapInsets : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_getCapInsets)

static bool js_cocos2dx_ui_Scale9Sprite_isScale9Enabled(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_isScale9Enabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isScale9Enabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_isScale9Enabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_isScale9Enabled)

static bool js_cocos2dx_ui_Scale9Sprite_resetRender(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_resetRender : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->resetRender();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_resetRender)

static bool js_cocos2dx_ui_Scale9Sprite_getRenderingType(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_getRenderingType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getRenderingType();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_getRenderingType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_getRenderingType)

static bool js_cocos2dx_ui_Scale9Sprite_getInsetRight(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_getInsetRight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getInsetRight();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_getInsetRight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_getInsetRight)

static bool js_cocos2dx_ui_Scale9Sprite_getOriginalSize(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_getOriginalSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Size result = cobj->getOriginalSize();
        ok &= Size_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_getOriginalSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_getOriginalSize)

static bool js_cocos2dx_ui_Scale9Sprite_initWithFile(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ui_Scale9Sprite_initWithFile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Rect arg1;
            ok &= seval_to_Rect(args[1], &arg1);
            if (!ok) { ok = true; break; }
            bool result = cobj->initWithFile(arg0, arg1);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_initWithFile : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Rect arg1;
            ok &= seval_to_Rect(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::Rect arg2;
            ok &= seval_to_Rect(args[2], &arg2);
            if (!ok) { ok = true; break; }
            bool result = cobj->initWithFile(arg0, arg1, arg2);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_initWithFile : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            cocos2d::Rect arg0;
            ok &= seval_to_Rect(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            bool result = cobj->initWithFile(arg0, arg1);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_initWithFile : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            bool result = cobj->initWithFile(arg0);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_initWithFile : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_initWithFile)

static bool js_cocos2dx_ui_Scale9Sprite_setBlendFunc(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_setBlendFunc : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::BlendFunc arg0;
        ok &= seval_to_blendfunc(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_setBlendFunc : Error processing arguments");
        cobj->setBlendFunc(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_setBlendFunc)

static bool js_cocos2dx_ui_Scale9Sprite_getInsetTop(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_getInsetTop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getInsetTop();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_getInsetTop : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_getInsetTop)

static bool js_cocos2dx_ui_Scale9Sprite_setInsetLeft(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_setInsetLeft : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_setInsetLeft : Error processing arguments");
        cobj->setInsetLeft(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_setInsetLeft)

static bool js_cocos2dx_ui_Scale9Sprite_initWithSpriteFrame(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ui_Scale9Sprite_initWithSpriteFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            cocos2d::SpriteFrame* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            bool result = cobj->initWithSpriteFrame(arg0);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_initWithSpriteFrame : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            cocos2d::SpriteFrame* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Rect arg1;
            ok &= seval_to_Rect(args[1], &arg1);
            if (!ok) { ok = true; break; }
            bool result = cobj->initWithSpriteFrame(arg0, arg1);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_initWithSpriteFrame : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_initWithSpriteFrame)

static bool js_cocos2dx_ui_Scale9Sprite_getPreferredSize(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_getPreferredSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Size result = cobj->getPreferredSize();
        ok &= Size_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_getPreferredSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_getPreferredSize)

static bool js_cocos2dx_ui_Scale9Sprite_setCapInsets(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_setCapInsets : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Rect arg0;
        ok &= seval_to_Rect(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_setCapInsets : Error processing arguments");
        cobj->setCapInsets(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_setCapInsets)

static bool js_cocos2dx_ui_Scale9Sprite_isFlippedY(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_isFlippedY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isFlippedY();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_isFlippedY : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_isFlippedY)

static bool js_cocos2dx_ui_Scale9Sprite_getInsetLeft(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_getInsetLeft : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getInsetLeft();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_getInsetLeft : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_getInsetLeft)

static bool js_cocos2dx_ui_Scale9Sprite_setInsetRight(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_Scale9Sprite_setInsetRight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_setInsetRight : Error processing arguments");
        cobj->setInsetRight(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_setInsetRight)

static bool js_cocos2dx_ui_Scale9Sprite_create(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Rect arg1;
            ok &= seval_to_Rect(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::Rect arg2;
            ok &= seval_to_Rect(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Scale9Sprite* result = cocos2d::ui::Scale9Sprite::create(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<cocos2d::ui::Scale9Sprite>((cocos2d::ui::Scale9Sprite*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 0) {
            cocos2d::ui::Scale9Sprite* result = cocos2d::ui::Scale9Sprite::create();
            ok &= native_ptr_to_seval<cocos2d::ui::Scale9Sprite>((cocos2d::ui::Scale9Sprite*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 2) {
            cocos2d::Rect arg0;
            ok &= seval_to_Rect(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Scale9Sprite* result = cocos2d::ui::Scale9Sprite::create(arg0, arg1);
            ok &= native_ptr_to_seval<cocos2d::ui::Scale9Sprite>((cocos2d::ui::Scale9Sprite*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Rect arg1;
            ok &= seval_to_Rect(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Scale9Sprite* result = cocos2d::ui::Scale9Sprite::create(arg0, arg1);
            ok &= native_ptr_to_seval<cocos2d::ui::Scale9Sprite>((cocos2d::ui::Scale9Sprite*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 1) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Scale9Sprite* result = cocos2d::ui::Scale9Sprite::create(arg0);
            ok &= native_ptr_to_seval<cocos2d::ui::Scale9Sprite>((cocos2d::ui::Scale9Sprite*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_create : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_create)

static bool js_cocos2dx_ui_Scale9Sprite_createWithSpriteFrameName(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Rect arg1;
            ok &= seval_to_Rect(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Scale9Sprite* result = cocos2d::ui::Scale9Sprite::createWithSpriteFrameName(arg0, arg1);
            ok &= native_ptr_to_seval<cocos2d::ui::Scale9Sprite>((cocos2d::ui::Scale9Sprite*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_createWithSpriteFrameName : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 1) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Scale9Sprite* result = cocos2d::ui::Scale9Sprite::createWithSpriteFrameName(arg0);
            ok &= native_ptr_to_seval<cocos2d::ui::Scale9Sprite>((cocos2d::ui::Scale9Sprite*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_createWithSpriteFrameName : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_createWithSpriteFrameName)

static bool js_cocos2dx_ui_Scale9Sprite_createWithSpriteFrame(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            cocos2d::SpriteFrame* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::Rect arg1;
            ok &= seval_to_Rect(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Scale9Sprite* result = cocos2d::ui::Scale9Sprite::createWithSpriteFrame(arg0, arg1);
            ok &= native_ptr_to_seval<cocos2d::ui::Scale9Sprite>((cocos2d::ui::Scale9Sprite*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_createWithSpriteFrame : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 1) {
            cocos2d::SpriteFrame* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Scale9Sprite* result = cocos2d::ui::Scale9Sprite::createWithSpriteFrame(arg0);
            ok &= native_ptr_to_seval<cocos2d::ui::Scale9Sprite>((cocos2d::ui::Scale9Sprite*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_createWithSpriteFrame : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_Scale9Sprite_createWithSpriteFrame)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_Scale9Sprite_finalize)

static bool js_cocos2dx_ui_Scale9Sprite_constructor(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = new (std::nothrow) cocos2d::ui::Scale9Sprite();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_Scale9Sprite_constructor, __jsb_cocos2d_ui_Scale9Sprite_class, js_cocos2d_ui_Scale9Sprite_finalize)

static bool js_cocos2dx_ui_Scale9Sprite_ctor(se::State& s)
{
    cocos2d::ui::Scale9Sprite* cobj = new (std::nothrow) cocos2d::ui::Scale9Sprite();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_Scale9Sprite_ctor, __jsb_cocos2d_ui_Scale9Sprite_class, js_cocos2d_ui_Scale9Sprite_finalize)


    

extern se::Object* __jsb_cocos2d_Node_proto;

static bool js_cocos2d_ui_Scale9Sprite_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::Scale9Sprite)", s.nativeThisObject());
    cocos2d::ui::Scale9Sprite* cobj = (cocos2d::ui::Scale9Sprite*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_Scale9Sprite_finalize)

bool js_register_cocos2dx_ui_Scale9Sprite(se::Object* obj)
{
    auto cls = se::Class::create("Scale9Sprite", obj, __jsb_cocos2d_Node_proto, _SE(js_cocos2dx_ui_Scale9Sprite_constructor));

    cls->defineFunction("disableCascadeColor", _SE(js_cocos2dx_ui_Scale9Sprite_disableCascadeColor));
    cls->defineFunction("updateWithSprite", _SE(js_cocos2dx_ui_Scale9Sprite_updateWithSprite));
    cls->defineFunction("isFlippedX", _SE(js_cocos2dx_ui_Scale9Sprite_isFlippedX));
    cls->defineFunction("setScale9Enabled", _SE(js_cocos2dx_ui_Scale9Sprite_setScale9Enabled));
    cls->defineFunction("setFlippedY", _SE(js_cocos2dx_ui_Scale9Sprite_setFlippedY));
    cls->defineFunction("setFlippedX", _SE(js_cocos2dx_ui_Scale9Sprite_setFlippedX));
    cls->defineFunction("resizableSpriteWithCapInsets", _SE(js_cocos2dx_ui_Scale9Sprite_resizableSpriteWithCapInsets));
    cls->defineFunction("disableCascadeOpacity", _SE(js_cocos2dx_ui_Scale9Sprite_disableCascadeOpacity));
    cls->defineFunction("getState", _SE(js_cocos2dx_ui_Scale9Sprite_getState));
    cls->defineFunction("setState", _SE(js_cocos2dx_ui_Scale9Sprite_setState));
    cls->defineFunction("setInsetBottom", _SE(js_cocos2dx_ui_Scale9Sprite_setInsetBottom));
    cls->defineFunction("initWithSpriteFrameName", _SE(js_cocos2dx_ui_Scale9Sprite_initWithSpriteFrameName));
    cls->defineFunction("getSprite", _SE(js_cocos2dx_ui_Scale9Sprite_getSprite));
    cls->defineFunction("setInsetTop", _SE(js_cocos2dx_ui_Scale9Sprite_setInsetTop));
    cls->defineFunction("setRenderingType", _SE(js_cocos2dx_ui_Scale9Sprite_setRenderingType));
    cls->defineFunction("init", _SE(js_cocos2dx_ui_Scale9Sprite_init));
    cls->defineFunction("setPreferredSize", _SE(js_cocos2dx_ui_Scale9Sprite_setPreferredSize));
    cls->defineFunction("setSpriteFrame", _SE(js_cocos2dx_ui_Scale9Sprite_setSpriteFrame));
    cls->defineFunction("getBlendFunc", _SE(js_cocos2dx_ui_Scale9Sprite_getBlendFunc));
    cls->defineFunction("getInsetBottom", _SE(js_cocos2dx_ui_Scale9Sprite_getInsetBottom));
    cls->defineFunction("getCapInsets", _SE(js_cocos2dx_ui_Scale9Sprite_getCapInsets));
    cls->defineFunction("isScale9Enabled", _SE(js_cocos2dx_ui_Scale9Sprite_isScale9Enabled));
    cls->defineFunction("resetRender", _SE(js_cocos2dx_ui_Scale9Sprite_resetRender));
    cls->defineFunction("getRenderingType", _SE(js_cocos2dx_ui_Scale9Sprite_getRenderingType));
    cls->defineFunction("getInsetRight", _SE(js_cocos2dx_ui_Scale9Sprite_getInsetRight));
    cls->defineFunction("getOriginalSize", _SE(js_cocos2dx_ui_Scale9Sprite_getOriginalSize));
    cls->defineFunction("initWithFile", _SE(js_cocos2dx_ui_Scale9Sprite_initWithFile));
    cls->defineFunction("setBlendFunc", _SE(js_cocos2dx_ui_Scale9Sprite_setBlendFunc));
    cls->defineFunction("getInsetTop", _SE(js_cocos2dx_ui_Scale9Sprite_getInsetTop));
    cls->defineFunction("setInsetLeft", _SE(js_cocos2dx_ui_Scale9Sprite_setInsetLeft));
    cls->defineFunction("initWithSpriteFrame", _SE(js_cocos2dx_ui_Scale9Sprite_initWithSpriteFrame));
    cls->defineFunction("getPreferredSize", _SE(js_cocos2dx_ui_Scale9Sprite_getPreferredSize));
    cls->defineFunction("setCapInsets", _SE(js_cocos2dx_ui_Scale9Sprite_setCapInsets));
    cls->defineFunction("isFlippedY", _SE(js_cocos2dx_ui_Scale9Sprite_isFlippedY));
    cls->defineFunction("getInsetLeft", _SE(js_cocos2dx_ui_Scale9Sprite_getInsetLeft));
    cls->defineFunction("setInsetRight", _SE(js_cocos2dx_ui_Scale9Sprite_setInsetRight));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_Scale9Sprite_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_Scale9Sprite_create));
    cls->defineStaticFunction("createWithSpriteFrameName", _SE(js_cocos2dx_ui_Scale9Sprite_createWithSpriteFrameName));
    cls->defineStaticFunction("createWithSpriteFrame", _SE(js_cocos2dx_ui_Scale9Sprite_createWithSpriteFrame));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_Scale9Sprite_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::Scale9Sprite>(cls);

    __jsb_cocos2d_ui_Scale9Sprite_proto = cls->getProto();
    __jsb_cocos2d_ui_Scale9Sprite_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.Scale9Sprite.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_EditBox_proto = nullptr;
se::Class* __jsb_cocos2d_ui_EditBox_class = nullptr;

static bool js_cocos2dx_ui_EditBox_getText(se::State& s)
{
    cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_EditBox_getText : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const char* result = cobj->getText();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_getText : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_EditBox_getText)

static bool js_cocos2dx_ui_EditBox_setFontSize(se::State& s)
{
    cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_EditBox_setFontSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_setFontSize : Error processing arguments");
        cobj->setFontSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_EditBox_setFontSize)

static bool js_cocos2dx_ui_EditBox_getBackgroundSprite(se::State& s)
{
    cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_EditBox_getBackgroundSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::ui::Scale9Sprite* result = cobj->getBackgroundSprite();
        ok &= native_ptr_to_seval<cocos2d::ui::Scale9Sprite>((cocos2d::ui::Scale9Sprite*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_getBackgroundSprite : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_EditBox_getBackgroundSprite)

static bool js_cocos2dx_ui_EditBox_setPlaceholderFontName(se::State& s)
{
    cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_EditBox_setPlaceholderFontName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_setPlaceholderFontName : Error processing arguments");
        cobj->setPlaceholderFontName(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_EditBox_setPlaceholderFontName)

static bool js_cocos2dx_ui_EditBox_getPlaceHolder(se::State& s)
{
    cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_EditBox_getPlaceHolder : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const char* result = cobj->getPlaceHolder();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_getPlaceHolder : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_EditBox_getPlaceHolder)

static bool js_cocos2dx_ui_EditBox_setFontName(se::State& s)
{
    cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_EditBox_setFontName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_setFontName : Error processing arguments");
        cobj->setFontName(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_EditBox_setFontName)

static bool js_cocos2dx_ui_EditBox_setText(se::State& s)
{
    cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_EditBox_setText : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_setText : Error processing arguments");
        cobj->setText(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_EditBox_setText)

static bool js_cocos2dx_ui_EditBox_setPlaceholderFontSize(se::State& s)
{
    cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_EditBox_setPlaceholderFontSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_setPlaceholderFontSize : Error processing arguments");
        cobj->setPlaceholderFontSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_EditBox_setPlaceholderFontSize)

static bool js_cocos2dx_ui_EditBox_setInputMode(se::State& s)
{
    cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_EditBox_setInputMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::EditBox::InputMode arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_setInputMode : Error processing arguments");
        cobj->setInputMode(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_EditBox_setInputMode)

static bool js_cocos2dx_ui_EditBox_setPlaceholderFontColor(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ui_EditBox_setPlaceholderFontColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            cocos2d::Color4B arg0;
            ok &= seval_to_Color4B(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cobj->setPlaceholderFontColor(arg0);
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            cocos2d::Color3B arg0;
            ok &= seval_to_Color3B(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cobj->setPlaceholderFontColor(arg0);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_EditBox_setPlaceholderFontColor)

static bool js_cocos2dx_ui_EditBox_setFontColor(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ui_EditBox_setFontColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            cocos2d::Color4B arg0;
            ok &= seval_to_Color4B(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cobj->setFontColor(arg0);
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            cocos2d::Color3B arg0;
            ok &= seval_to_Color3B(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cobj->setFontColor(arg0);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_EditBox_setFontColor)

static bool js_cocos2dx_ui_EditBox_setPlaceholderFont(se::State& s)
{
    cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_EditBox_setPlaceholderFont : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        const char* arg0 = nullptr;
        int arg1 = 0;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_setPlaceholderFont : Error processing arguments");
        cobj->setPlaceholderFont(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_EditBox_setPlaceholderFont)

static bool js_cocos2dx_ui_EditBox_initWithSizeAndBackgroundSprite(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ui_EditBox_initWithSizeAndBackgroundSprite : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            cocos2d::Size arg0;
            ok &= seval_to_Size(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Scale9Sprite* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);
            if (!ok) { ok = true; break; }
            bool result = cobj->initWithSizeAndBackgroundSprite(arg0, arg1);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_initWithSizeAndBackgroundSprite : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            cocos2d::Size arg0;
            ok &= seval_to_Size(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            bool result = cobj->initWithSizeAndBackgroundSprite(arg0, arg1);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_initWithSizeAndBackgroundSprite : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            cocos2d::Size arg0;
            ok &= seval_to_Size(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Widget::TextureResType arg2;
            ok &= seval_to_int32(args[2], (int32_t*)&arg2);
            if (!ok) { ok = true; break; }
            bool result = cobj->initWithSizeAndBackgroundSprite(arg0, arg1, arg2);
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_initWithSizeAndBackgroundSprite : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_EditBox_initWithSizeAndBackgroundSprite)

static bool js_cocos2dx_ui_EditBox_setPlaceHolder(se::State& s)
{
    cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_EditBox_setPlaceHolder : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const char* arg0 = nullptr;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_setPlaceHolder : Error processing arguments");
        cobj->setPlaceHolder(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_EditBox_setPlaceHolder)

static bool js_cocos2dx_ui_EditBox_setReturnType(se::State& s)
{
    cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_EditBox_setReturnType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::EditBox::KeyboardReturnType arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_setReturnType : Error processing arguments");
        cobj->setReturnType(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_EditBox_setReturnType)

static bool js_cocos2dx_ui_EditBox_setInputFlag(se::State& s)
{
    cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_EditBox_setInputFlag : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::EditBox::InputFlag arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_setInputFlag : Error processing arguments");
        cobj->setInputFlag(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_EditBox_setInputFlag)

static bool js_cocos2dx_ui_EditBox_getMaxLength(se::State& s)
{
    cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_EditBox_getMaxLength : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxLength();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_getMaxLength : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_EditBox_getMaxLength)

static bool js_cocos2dx_ui_EditBox_setMaxLength(se::State& s)
{
    cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_EditBox_setMaxLength : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_setMaxLength : Error processing arguments");
        cobj->setMaxLength(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_EditBox_setMaxLength)

static bool js_cocos2dx_ui_EditBox_setFont(se::State& s)
{
    cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_EditBox_setFont : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        const char* arg0 = nullptr;
        int arg1 = 0;
        std::string arg0_tmp; ok &= seval_to_std_string(args[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_setFont : Error processing arguments");
        cobj->setFont(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_EditBox_setFont)

static bool js_cocos2dx_ui_EditBox_create(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            cocos2d::Size arg0;
            ok &= seval_to_Size(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::EditBox* result = cocos2d::ui::EditBox::create(arg0, arg1);
            ok &= native_ptr_to_seval<cocos2d::ui::EditBox>((cocos2d::ui::EditBox*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 3) {
            cocos2d::Size arg0;
            ok &= seval_to_Size(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Widget::TextureResType arg2;
            ok &= seval_to_int32(args[2], (int32_t*)&arg2);
            if (!ok) { ok = true; break; }
            cocos2d::ui::EditBox* result = cocos2d::ui::EditBox::create(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<cocos2d::ui::EditBox>((cocos2d::ui::EditBox*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 2) {
            cocos2d::Size arg0;
            ok &= seval_to_Size(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Scale9Sprite* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::EditBox* result = cocos2d::ui::EditBox::create(arg0, arg1);
            ok &= native_ptr_to_seval<cocos2d::ui::EditBox>((cocos2d::ui::EditBox*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 3) {
            cocos2d::Size arg0;
            ok &= seval_to_Size(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Scale9Sprite* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Scale9Sprite* arg2 = nullptr;
            ok &= seval_to_native_ptr(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cocos2d::ui::EditBox* result = cocos2d::ui::EditBox::create(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<cocos2d::ui::EditBox>((cocos2d::ui::EditBox*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 4) {
            cocos2d::Size arg0;
            ok &= seval_to_Size(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Scale9Sprite* arg1 = nullptr;
            ok &= seval_to_native_ptr(args[1], &arg1);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Scale9Sprite* arg2 = nullptr;
            ok &= seval_to_native_ptr(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Scale9Sprite* arg3 = nullptr;
            ok &= seval_to_native_ptr(args[3], &arg3);
            if (!ok) { ok = true; break; }
            cocos2d::ui::EditBox* result = cocos2d::ui::EditBox::create(arg0, arg1, arg2, arg3);
            ok &= native_ptr_to_seval<cocos2d::ui::EditBox>((cocos2d::ui::EditBox*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_EditBox_create : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_EditBox_create)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_EditBox_finalize)

static bool js_cocos2dx_ui_EditBox_constructor(se::State& s)
{
    cocos2d::ui::EditBox* cobj = new (std::nothrow) cocos2d::ui::EditBox();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_EditBox_constructor, __jsb_cocos2d_ui_EditBox_class, js_cocos2d_ui_EditBox_finalize)

static bool js_cocos2dx_ui_EditBox_ctor(se::State& s)
{
    cocos2d::ui::EditBox* cobj = new (std::nothrow) cocos2d::ui::EditBox();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_EditBox_ctor, __jsb_cocos2d_ui_EditBox_class, js_cocos2d_ui_EditBox_finalize)


    

extern se::Object* __jsb_cocos2d_ui_Widget_proto;

static bool js_cocos2d_ui_EditBox_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::EditBox)", s.nativeThisObject());
    cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_EditBox_finalize)

bool js_register_cocos2dx_ui_EditBox(se::Object* obj)
{
    auto cls = se::Class::create("EditBox", obj, __jsb_cocos2d_ui_Widget_proto, _SE(js_cocos2dx_ui_EditBox_constructor));

    cls->defineFunction("getString", _SE(js_cocos2dx_ui_EditBox_getText));
    cls->defineFunction("setFontSize", _SE(js_cocos2dx_ui_EditBox_setFontSize));
    cls->defineFunction("getBackgroundSprite", _SE(js_cocos2dx_ui_EditBox_getBackgroundSprite));
    cls->defineFunction("setPlaceholderFontName", _SE(js_cocos2dx_ui_EditBox_setPlaceholderFontName));
    cls->defineFunction("getPlaceHolder", _SE(js_cocos2dx_ui_EditBox_getPlaceHolder));
    cls->defineFunction("setFontName", _SE(js_cocos2dx_ui_EditBox_setFontName));
    cls->defineFunction("setString", _SE(js_cocos2dx_ui_EditBox_setText));
    cls->defineFunction("setPlaceholderFontSize", _SE(js_cocos2dx_ui_EditBox_setPlaceholderFontSize));
    cls->defineFunction("setInputMode", _SE(js_cocos2dx_ui_EditBox_setInputMode));
    cls->defineFunction("setPlaceholderFontColor", _SE(js_cocos2dx_ui_EditBox_setPlaceholderFontColor));
    cls->defineFunction("setFontColor", _SE(js_cocos2dx_ui_EditBox_setFontColor));
    cls->defineFunction("setPlaceholderFont", _SE(js_cocos2dx_ui_EditBox_setPlaceholderFont));
    cls->defineFunction("initWithSizeAndBackgroundSprite", _SE(js_cocos2dx_ui_EditBox_initWithSizeAndBackgroundSprite));
    cls->defineFunction("setPlaceHolder", _SE(js_cocos2dx_ui_EditBox_setPlaceHolder));
    cls->defineFunction("setReturnType", _SE(js_cocos2dx_ui_EditBox_setReturnType));
    cls->defineFunction("setInputFlag", _SE(js_cocos2dx_ui_EditBox_setInputFlag));
    cls->defineFunction("getMaxLength", _SE(js_cocos2dx_ui_EditBox_getMaxLength));
    cls->defineFunction("setMaxLength", _SE(js_cocos2dx_ui_EditBox_setMaxLength));
    cls->defineFunction("setFont", _SE(js_cocos2dx_ui_EditBox_setFont));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_EditBox_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_EditBox_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_EditBox_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::EditBox>(cls);

    __jsb_cocos2d_ui_EditBox_proto = cls->getProto();
    __jsb_cocos2d_ui_EditBox_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.EditBox.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_LayoutComponent_proto = nullptr;
se::Class* __jsb_cocos2d_ui_LayoutComponent_class = nullptr;

static bool js_cocos2dx_ui_LayoutComponent_setStretchWidthEnabled(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setStretchWidthEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setStretchWidthEnabled : Error processing arguments");
        cobj->setStretchWidthEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setStretchWidthEnabled)

static bool js_cocos2dx_ui_LayoutComponent_setPercentWidth(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setPercentWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setPercentWidth : Error processing arguments");
        cobj->setPercentWidth(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setPercentWidth)

static bool js_cocos2dx_ui_LayoutComponent_getAnchorPosition(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_getAnchorPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Point& result = cobj->getAnchorPosition();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_getAnchorPosition : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_getAnchorPosition)

static bool js_cocos2dx_ui_LayoutComponent_setPositionPercentXEnabled(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setPositionPercentXEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setPositionPercentXEnabled : Error processing arguments");
        cobj->setPositionPercentXEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setPositionPercentXEnabled)

static bool js_cocos2dx_ui_LayoutComponent_setStretchHeightEnabled(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setStretchHeightEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setStretchHeightEnabled : Error processing arguments");
        cobj->setStretchHeightEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setStretchHeightEnabled)

static bool js_cocos2dx_ui_LayoutComponent_setActiveEnabled(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setActiveEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setActiveEnabled : Error processing arguments");
        cobj->setActiveEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setActiveEnabled)

static bool js_cocos2dx_ui_LayoutComponent_getRightMargin(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_getRightMargin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRightMargin();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_getRightMargin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_getRightMargin)

static bool js_cocos2dx_ui_LayoutComponent_getSize(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_getSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Size& result = cobj->getSize();
        ok &= Size_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_getSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_getSize)

static bool js_cocos2dx_ui_LayoutComponent_setAnchorPosition(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setAnchorPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Point arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setAnchorPosition : Error processing arguments");
        cobj->setAnchorPosition(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setAnchorPosition)

static bool js_cocos2dx_ui_LayoutComponent_refreshLayout(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_refreshLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->refreshLayout();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_refreshLayout)

static bool js_cocos2dx_ui_LayoutComponent_isPercentWidthEnabled(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_isPercentWidthEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isPercentWidthEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_isPercentWidthEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_isPercentWidthEnabled)

static bool js_cocos2dx_ui_LayoutComponent_setVerticalEdge(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setVerticalEdge : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::LayoutComponent::VerticalEdge arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setVerticalEdge : Error processing arguments");
        cobj->setVerticalEdge(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setVerticalEdge)

static bool js_cocos2dx_ui_LayoutComponent_getTopMargin(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_getTopMargin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTopMargin();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_getTopMargin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_getTopMargin)

static bool js_cocos2dx_ui_LayoutComponent_setSizeWidth(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setSizeWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setSizeWidth : Error processing arguments");
        cobj->setSizeWidth(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setSizeWidth)

static bool js_cocos2dx_ui_LayoutComponent_getPercentContentSize(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_getPercentContentSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Vec2 result = cobj->getPercentContentSize();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_getPercentContentSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_getPercentContentSize)

static bool js_cocos2dx_ui_LayoutComponent_getVerticalEdge(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_getVerticalEdge : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getVerticalEdge();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_getVerticalEdge : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_getVerticalEdge)

static bool js_cocos2dx_ui_LayoutComponent_setPercentWidthEnabled(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setPercentWidthEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setPercentWidthEnabled : Error processing arguments");
        cobj->setPercentWidthEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setPercentWidthEnabled)

static bool js_cocos2dx_ui_LayoutComponent_isStretchWidthEnabled(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_isStretchWidthEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isStretchWidthEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_isStretchWidthEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_isStretchWidthEnabled)

static bool js_cocos2dx_ui_LayoutComponent_setLeftMargin(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setLeftMargin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setLeftMargin : Error processing arguments");
        cobj->setLeftMargin(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setLeftMargin)

static bool js_cocos2dx_ui_LayoutComponent_getSizeWidth(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_getSizeWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getSizeWidth();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_getSizeWidth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_getSizeWidth)

static bool js_cocos2dx_ui_LayoutComponent_setPositionPercentYEnabled(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setPositionPercentYEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setPositionPercentYEnabled : Error processing arguments");
        cobj->setPositionPercentYEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setPositionPercentYEnabled)

static bool js_cocos2dx_ui_LayoutComponent_getSizeHeight(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_getSizeHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getSizeHeight();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_getSizeHeight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_getSizeHeight)

static bool js_cocos2dx_ui_LayoutComponent_getPositionPercentY(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_getPositionPercentY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getPositionPercentY();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_getPositionPercentY : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_getPositionPercentY)

static bool js_cocos2dx_ui_LayoutComponent_getPositionPercentX(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_getPositionPercentX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getPositionPercentX();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_getPositionPercentX : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_getPositionPercentX)

static bool js_cocos2dx_ui_LayoutComponent_setTopMargin(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setTopMargin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setTopMargin : Error processing arguments");
        cobj->setTopMargin(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setTopMargin)

static bool js_cocos2dx_ui_LayoutComponent_getPercentHeight(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_getPercentHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getPercentHeight();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_getPercentHeight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_getPercentHeight)

static bool js_cocos2dx_ui_LayoutComponent_getUsingPercentContentSize(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_getUsingPercentContentSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getUsingPercentContentSize();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_getUsingPercentContentSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_getUsingPercentContentSize)

static bool js_cocos2dx_ui_LayoutComponent_setPositionPercentY(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setPositionPercentY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setPositionPercentY : Error processing arguments");
        cobj->setPositionPercentY(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setPositionPercentY)

static bool js_cocos2dx_ui_LayoutComponent_setPositionPercentX(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setPositionPercentX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setPositionPercentX : Error processing arguments");
        cobj->setPositionPercentX(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setPositionPercentX)

static bool js_cocos2dx_ui_LayoutComponent_setRightMargin(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setRightMargin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setRightMargin : Error processing arguments");
        cobj->setRightMargin(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setRightMargin)

static bool js_cocos2dx_ui_LayoutComponent_isPositionPercentYEnabled(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_isPositionPercentYEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isPositionPercentYEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_isPositionPercentYEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_isPositionPercentYEnabled)

static bool js_cocos2dx_ui_LayoutComponent_setPercentHeight(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setPercentHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setPercentHeight : Error processing arguments");
        cobj->setPercentHeight(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setPercentHeight)

static bool js_cocos2dx_ui_LayoutComponent_setPercentOnlyEnabled(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setPercentOnlyEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setPercentOnlyEnabled : Error processing arguments");
        cobj->setPercentOnlyEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setPercentOnlyEnabled)

static bool js_cocos2dx_ui_LayoutComponent_setHorizontalEdge(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setHorizontalEdge : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::LayoutComponent::HorizontalEdge arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setHorizontalEdge : Error processing arguments");
        cobj->setHorizontalEdge(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setHorizontalEdge)

static bool js_cocos2dx_ui_LayoutComponent_setPosition(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Point arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setPosition : Error processing arguments");
        cobj->setPosition(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setPosition)

static bool js_cocos2dx_ui_LayoutComponent_setUsingPercentContentSize(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setUsingPercentContentSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setUsingPercentContentSize : Error processing arguments");
        cobj->setUsingPercentContentSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setUsingPercentContentSize)

static bool js_cocos2dx_ui_LayoutComponent_getLeftMargin(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_getLeftMargin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getLeftMargin();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_getLeftMargin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_getLeftMargin)

static bool js_cocos2dx_ui_LayoutComponent_getPosition(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_getPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Point& result = cobj->getPosition();
        ok &= Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_getPosition : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_getPosition)

static bool js_cocos2dx_ui_LayoutComponent_setSizeHeight(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setSizeHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setSizeHeight : Error processing arguments");
        cobj->setSizeHeight(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setSizeHeight)

static bool js_cocos2dx_ui_LayoutComponent_isPositionPercentXEnabled(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_isPositionPercentXEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isPositionPercentXEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_isPositionPercentXEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_isPositionPercentXEnabled)

static bool js_cocos2dx_ui_LayoutComponent_getBottomMargin(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_getBottomMargin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getBottomMargin();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_getBottomMargin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_getBottomMargin)

static bool js_cocos2dx_ui_LayoutComponent_setPercentHeightEnabled(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setPercentHeightEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setPercentHeightEnabled : Error processing arguments");
        cobj->setPercentHeightEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setPercentHeightEnabled)

static bool js_cocos2dx_ui_LayoutComponent_setPercentContentSize(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setPercentContentSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec2 arg0;
        ok &= seval_to_Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setPercentContentSize : Error processing arguments");
        cobj->setPercentContentSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setPercentContentSize)

static bool js_cocos2dx_ui_LayoutComponent_isPercentHeightEnabled(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_isPercentHeightEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isPercentHeightEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_isPercentHeightEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_isPercentHeightEnabled)

static bool js_cocos2dx_ui_LayoutComponent_getPercentWidth(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_getPercentWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getPercentWidth();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_getPercentWidth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_getPercentWidth)

static bool js_cocos2dx_ui_LayoutComponent_getHorizontalEdge(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_getHorizontalEdge : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getHorizontalEdge();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_getHorizontalEdge : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_getHorizontalEdge)

static bool js_cocos2dx_ui_LayoutComponent_isStretchHeightEnabled(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_isStretchHeightEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isStretchHeightEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_isStretchHeightEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_isStretchHeightEnabled)

static bool js_cocos2dx_ui_LayoutComponent_setBottomMargin(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setBottomMargin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setBottomMargin : Error processing arguments");
        cobj->setBottomMargin(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setBottomMargin)

static bool js_cocos2dx_ui_LayoutComponent_setSize(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_LayoutComponent_setSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Size arg0;
        ok &= seval_to_Size(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_setSize : Error processing arguments");
        cobj->setSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_setSize)

static bool js_cocos2dx_ui_LayoutComponent_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = cocos2d::ui::LayoutComponent::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_LayoutComponent_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_create)

static bool js_cocos2dx_ui_LayoutComponent_bindLayoutComponent(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_bindLayoutComponent : Error processing arguments");
        cocos2d::ui::LayoutComponent* result = cocos2d::ui::LayoutComponent::bindLayoutComponent(arg0);
        ok &= native_ptr_to_seval<cocos2d::ui::LayoutComponent>((cocos2d::ui::LayoutComponent*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_LayoutComponent_bindLayoutComponent : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_LayoutComponent_bindLayoutComponent)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_ui_LayoutComponent_finalize)

static bool js_cocos2dx_ui_LayoutComponent_constructor(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = new (std::nothrow) cocos2d::ui::LayoutComponent();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_ui_LayoutComponent_constructor, __jsb_cocos2d_ui_LayoutComponent_class, js_cocos2d_ui_LayoutComponent_finalize)

static bool js_cocos2dx_ui_LayoutComponent_ctor(se::State& s)
{
    cocos2d::ui::LayoutComponent* cobj = new (std::nothrow) cocos2d::ui::LayoutComponent();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_ui_LayoutComponent_ctor, __jsb_cocos2d_ui_LayoutComponent_class, js_cocos2d_ui_LayoutComponent_finalize)


    

extern se::Object* __jsb_cocos2d_Component_proto;

static bool js_cocos2d_ui_LayoutComponent_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::LayoutComponent)", s.nativeThisObject());
    cocos2d::ui::LayoutComponent* cobj = (cocos2d::ui::LayoutComponent*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_LayoutComponent_finalize)

bool js_register_cocos2dx_ui_LayoutComponent(se::Object* obj)
{
    auto cls = se::Class::create("LayoutComponent", obj, __jsb_cocos2d_Component_proto, _SE(js_cocos2dx_ui_LayoutComponent_constructor));

    cls->defineFunction("setStretchWidthEnabled", _SE(js_cocos2dx_ui_LayoutComponent_setStretchWidthEnabled));
    cls->defineFunction("setPercentWidth", _SE(js_cocos2dx_ui_LayoutComponent_setPercentWidth));
    cls->defineFunction("getAnchorPosition", _SE(js_cocos2dx_ui_LayoutComponent_getAnchorPosition));
    cls->defineFunction("setPositionPercentXEnabled", _SE(js_cocos2dx_ui_LayoutComponent_setPositionPercentXEnabled));
    cls->defineFunction("setStretchHeightEnabled", _SE(js_cocos2dx_ui_LayoutComponent_setStretchHeightEnabled));
    cls->defineFunction("setActiveEnabled", _SE(js_cocos2dx_ui_LayoutComponent_setActiveEnabled));
    cls->defineFunction("getRightMargin", _SE(js_cocos2dx_ui_LayoutComponent_getRightMargin));
    cls->defineFunction("getSize", _SE(js_cocos2dx_ui_LayoutComponent_getSize));
    cls->defineFunction("setAnchorPosition", _SE(js_cocos2dx_ui_LayoutComponent_setAnchorPosition));
    cls->defineFunction("refreshLayout", _SE(js_cocos2dx_ui_LayoutComponent_refreshLayout));
    cls->defineFunction("isPercentWidthEnabled", _SE(js_cocos2dx_ui_LayoutComponent_isPercentWidthEnabled));
    cls->defineFunction("setVerticalEdge", _SE(js_cocos2dx_ui_LayoutComponent_setVerticalEdge));
    cls->defineFunction("getTopMargin", _SE(js_cocos2dx_ui_LayoutComponent_getTopMargin));
    cls->defineFunction("setSizeWidth", _SE(js_cocos2dx_ui_LayoutComponent_setSizeWidth));
    cls->defineFunction("getPercentContentSize", _SE(js_cocos2dx_ui_LayoutComponent_getPercentContentSize));
    cls->defineFunction("getVerticalEdge", _SE(js_cocos2dx_ui_LayoutComponent_getVerticalEdge));
    cls->defineFunction("setPercentWidthEnabled", _SE(js_cocos2dx_ui_LayoutComponent_setPercentWidthEnabled));
    cls->defineFunction("isStretchWidthEnabled", _SE(js_cocos2dx_ui_LayoutComponent_isStretchWidthEnabled));
    cls->defineFunction("setLeftMargin", _SE(js_cocos2dx_ui_LayoutComponent_setLeftMargin));
    cls->defineFunction("getSizeWidth", _SE(js_cocos2dx_ui_LayoutComponent_getSizeWidth));
    cls->defineFunction("setPositionPercentYEnabled", _SE(js_cocos2dx_ui_LayoutComponent_setPositionPercentYEnabled));
    cls->defineFunction("getSizeHeight", _SE(js_cocos2dx_ui_LayoutComponent_getSizeHeight));
    cls->defineFunction("getPositionPercentY", _SE(js_cocos2dx_ui_LayoutComponent_getPositionPercentY));
    cls->defineFunction("getPositionPercentX", _SE(js_cocos2dx_ui_LayoutComponent_getPositionPercentX));
    cls->defineFunction("setTopMargin", _SE(js_cocos2dx_ui_LayoutComponent_setTopMargin));
    cls->defineFunction("getPercentHeight", _SE(js_cocos2dx_ui_LayoutComponent_getPercentHeight));
    cls->defineFunction("getUsingPercentContentSize", _SE(js_cocos2dx_ui_LayoutComponent_getUsingPercentContentSize));
    cls->defineFunction("setPositionPercentY", _SE(js_cocos2dx_ui_LayoutComponent_setPositionPercentY));
    cls->defineFunction("setPositionPercentX", _SE(js_cocos2dx_ui_LayoutComponent_setPositionPercentX));
    cls->defineFunction("setRightMargin", _SE(js_cocos2dx_ui_LayoutComponent_setRightMargin));
    cls->defineFunction("isPositionPercentYEnabled", _SE(js_cocos2dx_ui_LayoutComponent_isPositionPercentYEnabled));
    cls->defineFunction("setPercentHeight", _SE(js_cocos2dx_ui_LayoutComponent_setPercentHeight));
    cls->defineFunction("setPercentOnlyEnabled", _SE(js_cocos2dx_ui_LayoutComponent_setPercentOnlyEnabled));
    cls->defineFunction("setHorizontalEdge", _SE(js_cocos2dx_ui_LayoutComponent_setHorizontalEdge));
    cls->defineFunction("setPosition", _SE(js_cocos2dx_ui_LayoutComponent_setPosition));
    cls->defineFunction("setUsingPercentContentSize", _SE(js_cocos2dx_ui_LayoutComponent_setUsingPercentContentSize));
    cls->defineFunction("getLeftMargin", _SE(js_cocos2dx_ui_LayoutComponent_getLeftMargin));
    cls->defineFunction("getPosition", _SE(js_cocos2dx_ui_LayoutComponent_getPosition));
    cls->defineFunction("setSizeHeight", _SE(js_cocos2dx_ui_LayoutComponent_setSizeHeight));
    cls->defineFunction("isPositionPercentXEnabled", _SE(js_cocos2dx_ui_LayoutComponent_isPositionPercentXEnabled));
    cls->defineFunction("getBottomMargin", _SE(js_cocos2dx_ui_LayoutComponent_getBottomMargin));
    cls->defineFunction("setPercentHeightEnabled", _SE(js_cocos2dx_ui_LayoutComponent_setPercentHeightEnabled));
    cls->defineFunction("setPercentContentSize", _SE(js_cocos2dx_ui_LayoutComponent_setPercentContentSize));
    cls->defineFunction("isPercentHeightEnabled", _SE(js_cocos2dx_ui_LayoutComponent_isPercentHeightEnabled));
    cls->defineFunction("getPercentWidth", _SE(js_cocos2dx_ui_LayoutComponent_getPercentWidth));
    cls->defineFunction("getHorizontalEdge", _SE(js_cocos2dx_ui_LayoutComponent_getHorizontalEdge));
    cls->defineFunction("isStretchHeightEnabled", _SE(js_cocos2dx_ui_LayoutComponent_isStretchHeightEnabled));
    cls->defineFunction("setBottomMargin", _SE(js_cocos2dx_ui_LayoutComponent_setBottomMargin));
    cls->defineFunction("setSize", _SE(js_cocos2dx_ui_LayoutComponent_setSize));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_LayoutComponent_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_LayoutComponent_create));
    cls->defineStaticFunction("bindLayoutComponent", _SE(js_cocos2dx_ui_LayoutComponent_bindLayoutComponent));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_LayoutComponent_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::LayoutComponent>(cls);

    __jsb_cocos2d_ui_LayoutComponent_proto = cls->getProto();
    __jsb_cocos2d_ui_LayoutComponent_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.LayoutComponent.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_TabHeader_proto = nullptr;
se::Class* __jsb_cocos2d_ui_TabHeader_class = nullptr;

static bool js_cocos2dx_ui_TabHeader_getIndexInTabControl(se::State& s)
{
    cocos2d::ui::TabHeader* cobj = (cocos2d::ui::TabHeader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabHeader_getIndexInTabControl : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getIndexInTabControl();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabHeader_getIndexInTabControl : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabHeader_getIndexInTabControl)

static bool js_cocos2dx_ui_TabHeader_getTitleText(se::State& s)
{
    cocos2d::ui::TabHeader* cobj = (cocos2d::ui::TabHeader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabHeader_getTitleText : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string result = cobj->getTitleText();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabHeader_getTitleText : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabHeader_getTitleText)

static bool js_cocos2dx_ui_TabHeader_setTitleFontSize(se::State& s)
{
    cocos2d::ui::TabHeader* cobj = (cocos2d::ui::TabHeader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabHeader_setTitleFontSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabHeader_setTitleFontSize : Error processing arguments");
        cobj->setTitleFontSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabHeader_setTitleFontSize)

static bool js_cocos2dx_ui_TabHeader_setTitleFontName(se::State& s)
{
    cocos2d::ui::TabHeader* cobj = (cocos2d::ui::TabHeader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabHeader_setTitleFontName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabHeader_setTitleFontName : Error processing arguments");
        cobj->setTitleFontName(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabHeader_setTitleFontName)

static bool js_cocos2dx_ui_TabHeader_getTitleFontSize(se::State& s)
{
    cocos2d::ui::TabHeader* cobj = (cocos2d::ui::TabHeader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabHeader_getTitleFontSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTitleFontSize();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabHeader_getTitleFontSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabHeader_getTitleFontSize)

static bool js_cocos2dx_ui_TabHeader_getTitleFontName(se::State& s)
{
    cocos2d::ui::TabHeader* cobj = (cocos2d::ui::TabHeader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabHeader_getTitleFontName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string result = cobj->getTitleFontName();
        ok &= std_string_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabHeader_getTitleFontName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabHeader_getTitleFontName)

static bool js_cocos2dx_ui_TabHeader_getTitleColor(se::State& s)
{
    cocos2d::ui::TabHeader* cobj = (cocos2d::ui::TabHeader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabHeader_getTitleColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cocos2d::Color4B& result = cobj->getTitleColor();
        ok &= Color4B_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabHeader_getTitleColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabHeader_getTitleColor)

static bool js_cocos2dx_ui_TabHeader_getTitleRenderer(se::State& s)
{
    cocos2d::ui::TabHeader* cobj = (cocos2d::ui::TabHeader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabHeader_getTitleRenderer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Label* result = cobj->getTitleRenderer();
        ok &= native_ptr_to_seval<cocos2d::Label>((cocos2d::Label*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabHeader_getTitleRenderer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabHeader_getTitleRenderer)

static bool js_cocos2dx_ui_TabHeader_setTitleText(se::State& s)
{
    cocos2d::ui::TabHeader* cobj = (cocos2d::ui::TabHeader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabHeader_setTitleText : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabHeader_setTitleText : Error processing arguments");
        cobj->setTitleText(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabHeader_setTitleText)

static bool js_cocos2dx_ui_TabHeader_setTitleColor(se::State& s)
{
    cocos2d::ui::TabHeader* cobj = (cocos2d::ui::TabHeader*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabHeader_setTitleColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Color4B arg0;
        ok &= seval_to_Color4B(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabHeader_setTitleColor : Error processing arguments");
        cobj->setTitleColor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabHeader_setTitleColor)

static bool js_cocos2dx_ui_TabHeader_create(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 3) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            std::string arg2;
            ok &= seval_to_std_string(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cocos2d::ui::TabHeader* result = cocos2d::ui::TabHeader::create(arg0, arg1, arg2);
            ok &= native_ptr_to_seval<cocos2d::ui::TabHeader>((cocos2d::ui::TabHeader*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabHeader_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 4) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            std::string arg2;
            ok &= seval_to_std_string(args[2], &arg2);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Widget::TextureResType arg3;
            ok &= seval_to_int32(args[3], (int32_t*)&arg3);
            if (!ok) { ok = true; break; }
            cocos2d::ui::TabHeader* result = cocos2d::ui::TabHeader::create(arg0, arg1, arg2, arg3);
            ok &= native_ptr_to_seval<cocos2d::ui::TabHeader>((cocos2d::ui::TabHeader*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabHeader_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 0) {
            cocos2d::ui::TabHeader* result = cocos2d::ui::TabHeader::create();
            ok &= native_ptr_to_seval<cocos2d::ui::TabHeader>((cocos2d::ui::TabHeader*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabHeader_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 6) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            std::string arg2;
            ok &= seval_to_std_string(args[2], &arg2);
            if (!ok) { ok = true; break; }
            std::string arg3;
            ok &= seval_to_std_string(args[3], &arg3);
            if (!ok) { ok = true; break; }
            std::string arg4;
            ok &= seval_to_std_string(args[4], &arg4);
            if (!ok) { ok = true; break; }
            std::string arg5;
            ok &= seval_to_std_string(args[5], &arg5);
            if (!ok) { ok = true; break; }
            cocos2d::ui::TabHeader* result = cocos2d::ui::TabHeader::create(arg0, arg1, arg2, arg3, arg4, arg5);
            ok &= native_ptr_to_seval<cocos2d::ui::TabHeader>((cocos2d::ui::TabHeader*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabHeader_create : Error processing arguments");
            return true;
        }
    } while (false);
    do {
        if (argc == 7) {
            std::string arg0;
            ok &= seval_to_std_string(args[0], &arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= seval_to_std_string(args[1], &arg1);
            if (!ok) { ok = true; break; }
            std::string arg2;
            ok &= seval_to_std_string(args[2], &arg2);
            if (!ok) { ok = true; break; }
            std::string arg3;
            ok &= seval_to_std_string(args[3], &arg3);
            if (!ok) { ok = true; break; }
            std::string arg4;
            ok &= seval_to_std_string(args[4], &arg4);
            if (!ok) { ok = true; break; }
            std::string arg5;
            ok &= seval_to_std_string(args[5], &arg5);
            if (!ok) { ok = true; break; }
            cocos2d::ui::Widget::TextureResType arg6;
            ok &= seval_to_int32(args[6], (int32_t*)&arg6);
            if (!ok) { ok = true; break; }
            cocos2d::ui::TabHeader* result = cocos2d::ui::TabHeader::create(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
            ok &= native_ptr_to_seval<cocos2d::ui::TabHeader>((cocos2d::ui::TabHeader*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabHeader_create : Error processing arguments");
            return true;
        }
    } while (false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabHeader_create)


extern se::Object* __jsb_cocos2d_ui_AbstractCheckButton_proto;

static bool js_cocos2d_ui_TabHeader_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::TabHeader)", s.nativeThisObject());
    cocos2d::ui::TabHeader* cobj = (cocos2d::ui::TabHeader*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_TabHeader_finalize)

bool js_register_cocos2dx_ui_TabHeader(se::Object* obj)
{
    auto cls = se::Class::create("TabHeader", obj, __jsb_cocos2d_ui_AbstractCheckButton_proto, nullptr);

    cls->defineFunction("getIndexInTabControl", _SE(js_cocos2dx_ui_TabHeader_getIndexInTabControl));
    cls->defineFunction("getTitleText", _SE(js_cocos2dx_ui_TabHeader_getTitleText));
    cls->defineFunction("setTitleFontSize", _SE(js_cocos2dx_ui_TabHeader_setTitleFontSize));
    cls->defineFunction("setTitleFontName", _SE(js_cocos2dx_ui_TabHeader_setTitleFontName));
    cls->defineFunction("getTitleFontSize", _SE(js_cocos2dx_ui_TabHeader_getTitleFontSize));
    cls->defineFunction("getTitleFontName", _SE(js_cocos2dx_ui_TabHeader_getTitleFontName));
    cls->defineFunction("getTitleColor", _SE(js_cocos2dx_ui_TabHeader_getTitleColor));
    cls->defineFunction("getTitleRenderer", _SE(js_cocos2dx_ui_TabHeader_getTitleRenderer));
    cls->defineFunction("setTitleText", _SE(js_cocos2dx_ui_TabHeader_setTitleText));
    cls->defineFunction("setTitleColor", _SE(js_cocos2dx_ui_TabHeader_setTitleColor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_TabHeader_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_TabHeader_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::TabHeader>(cls);

    __jsb_cocos2d_ui_TabHeader_proto = cls->getProto();
    __jsb_cocos2d_ui_TabHeader_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.TabHeader.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cocos2d_ui_TabControl_proto = nullptr;
se::Class* __jsb_cocos2d_ui_TabControl_class = nullptr;

static bool js_cocos2dx_ui_TabControl_setHeaderWidth(se::State& s)
{
    cocos2d::ui::TabControl* cobj = (cocos2d::ui::TabControl*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabControl_setHeaderWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_setHeaderWidth : Error processing arguments");
        cobj->setHeaderWidth(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabControl_setHeaderWidth)

static bool js_cocos2dx_ui_TabControl_removeTab(se::State& s)
{
    cocos2d::ui::TabControl* cobj = (cocos2d::ui::TabControl*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabControl_removeTab : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_removeTab : Error processing arguments");
        cobj->removeTab(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabControl_removeTab)

static bool js_cocos2dx_ui_TabControl_getTabCount(se::State& s)
{
    cocos2d::ui::TabControl* cobj = (cocos2d::ui::TabControl*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabControl_getTabCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned long result = cobj->getTabCount();
        ok &= ulong_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_getTabCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabControl_getTabCount)

static bool js_cocos2dx_ui_TabControl_getHeaderDockPlace(se::State& s)
{
    cocos2d::ui::TabControl* cobj = (cocos2d::ui::TabControl*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabControl_getHeaderDockPlace : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getHeaderDockPlace();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_getHeaderDockPlace : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabControl_getHeaderDockPlace)

static bool js_cocos2dx_ui_TabControl_getSelectedTabIndex(se::State& s)
{
    cocos2d::ui::TabControl* cobj = (cocos2d::ui::TabControl*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabControl_getSelectedTabIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getSelectedTabIndex();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_getSelectedTabIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabControl_getSelectedTabIndex)

static bool js_cocos2dx_ui_TabControl_insertTab(se::State& s)
{
    cocos2d::ui::TabControl* cobj = (cocos2d::ui::TabControl*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabControl_insertTab : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        int arg0 = 0;
        cocos2d::ui::TabHeader* arg1 = nullptr;
        cocos2d::ui::Layout* arg2 = nullptr;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_native_ptr(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_insertTab : Error processing arguments");
        cobj->insertTab(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabControl_insertTab)

static bool js_cocos2dx_ui_TabControl_ignoreHeadersTextureSize(se::State& s)
{
    cocos2d::ui::TabControl* cobj = (cocos2d::ui::TabControl*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabControl_ignoreHeadersTextureSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_ignoreHeadersTextureSize : Error processing arguments");
        cobj->ignoreHeadersTextureSize(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabControl_ignoreHeadersTextureSize)

static bool js_cocos2dx_ui_TabControl_getHeaderWidth(se::State& s)
{
    cocos2d::ui::TabControl* cobj = (cocos2d::ui::TabControl*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabControl_getHeaderWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getHeaderWidth();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_getHeaderWidth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabControl_getHeaderWidth)

static bool js_cocos2dx_ui_TabControl_setHeaderDockPlace(se::State& s)
{
    cocos2d::ui::TabControl* cobj = (cocos2d::ui::TabControl*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabControl_setHeaderDockPlace : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::ui::TabControl::Dock arg0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_setHeaderDockPlace : Error processing arguments");
        cobj->setHeaderDockPlace(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabControl_setHeaderDockPlace)

static bool js_cocos2dx_ui_TabControl_setSelectTab(se::State& s)
{
    CC_UNUSED bool ok = true;
    cocos2d::ui::TabControl* cobj = (cocos2d::ui::TabControl*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ui_TabControl_setSelectTab : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            cocos2d::ui::TabHeader* arg0 = nullptr;
            ok &= seval_to_native_ptr(args[0], &arg0);
            if (!ok) { ok = true; break; }
            cobj->setSelectTab(arg0);
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            int arg0 = 0;
            ok &= seval_to_int32(args[0], (int32_t*)&arg0);
            if (!ok) { ok = true; break; }
            cobj->setSelectTab(arg0);
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabControl_setSelectTab)

static bool js_cocos2dx_ui_TabControl_getTabHeader(se::State& s)
{
    cocos2d::ui::TabControl* cobj = (cocos2d::ui::TabControl*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabControl_getTabHeader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_getTabHeader : Error processing arguments");
        cocos2d::ui::TabHeader* result = cobj->getTabHeader(arg0);
        ok &= native_ptr_to_seval<cocos2d::ui::TabHeader>((cocos2d::ui::TabHeader*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_getTabHeader : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabControl_getTabHeader)

static bool js_cocos2dx_ui_TabControl_isIgnoreHeadersTextureSize(se::State& s)
{
    cocos2d::ui::TabControl* cobj = (cocos2d::ui::TabControl*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabControl_isIgnoreHeadersTextureSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isIgnoreHeadersTextureSize();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_isIgnoreHeadersTextureSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabControl_isIgnoreHeadersTextureSize)

static bool js_cocos2dx_ui_TabControl_setTabChangedEventListener(se::State& s)
{
    cocos2d::ui::TabControl* cobj = (cocos2d::ui::TabControl*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabControl_setTabChangedEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void (int, cocos2d::ui::TabControl::EventType)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachChild(jsFunc.toObject());
                auto lambda = [=](int larg0, cocos2d::ui::TabControl::EventType larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= int32_to_seval(larg0, &args[0]);
                    ok &= int32_to_seval((int32_t)larg1, &args[1]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_setTabChangedEventListener : Error processing arguments");
        cobj->setTabChangedEventListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabControl_setTabChangedEventListener)

static bool js_cocos2dx_ui_TabControl_setHeaderSelectedZoom(se::State& s)
{
    cocos2d::ui::TabControl* cobj = (cocos2d::ui::TabControl*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabControl_setHeaderSelectedZoom : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_setHeaderSelectedZoom : Error processing arguments");
        cobj->setHeaderSelectedZoom(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabControl_setHeaderSelectedZoom)

static bool js_cocos2dx_ui_TabControl_setHeaderHeight(se::State& s)
{
    cocos2d::ui::TabControl* cobj = (cocos2d::ui::TabControl*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabControl_setHeaderHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_setHeaderHeight : Error processing arguments");
        cobj->setHeaderHeight(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabControl_setHeaderHeight)

static bool js_cocos2dx_ui_TabControl_indexOfTabHeader(se::State& s)
{
    cocos2d::ui::TabControl* cobj = (cocos2d::ui::TabControl*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabControl_indexOfTabHeader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const cocos2d::ui::TabHeader* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_indexOfTabHeader : Error processing arguments");
        int result = cobj->indexOfTabHeader(arg0);
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_indexOfTabHeader : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabControl_indexOfTabHeader)

static bool js_cocos2dx_ui_TabControl_getTabContainer(se::State& s)
{
    cocos2d::ui::TabControl* cobj = (cocos2d::ui::TabControl*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabControl_getTabContainer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_getTabContainer : Error processing arguments");
        cocos2d::ui::Layout* result = cobj->getTabContainer(arg0);
        ok &= native_ptr_to_seval<cocos2d::ui::Layout>((cocos2d::ui::Layout*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_getTabContainer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabControl_getTabContainer)

static bool js_cocos2dx_ui_TabControl_getHeaderSelectedZoom(se::State& s)
{
    cocos2d::ui::TabControl* cobj = (cocos2d::ui::TabControl*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabControl_getHeaderSelectedZoom : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getHeaderSelectedZoom();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_getHeaderSelectedZoom : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabControl_getHeaderSelectedZoom)

static bool js_cocos2dx_ui_TabControl_getHeaderHeight(se::State& s)
{
    cocos2d::ui::TabControl* cobj = (cocos2d::ui::TabControl*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_cocos2dx_ui_TabControl_getHeaderHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getHeaderHeight();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_TabControl_getHeaderHeight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabControl_getHeaderHeight)

static bool js_cocos2dx_ui_TabControl_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = cocos2d::ui::TabControl::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2d_ui_TabControl_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ui_TabControl_create)


extern se::Object* __jsb_cocos2d_ui_Widget_proto;

static bool js_cocos2d_ui_TabControl_finalize(se::State& s)
{
    cocos2d::log("jsbindings: finalizing JS object %p (cocos2d::ui::TabControl)", s.nativeThisObject());
    cocos2d::ui::TabControl* cobj = (cocos2d::ui::TabControl*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_ui_TabControl_finalize)

bool js_register_cocos2dx_ui_TabControl(se::Object* obj)
{
    auto cls = se::Class::create("TabControl", obj, __jsb_cocos2d_ui_Widget_proto, nullptr);

    cls->defineFunction("setHeaderWidth", _SE(js_cocos2dx_ui_TabControl_setHeaderWidth));
    cls->defineFunction("removeTab", _SE(js_cocos2dx_ui_TabControl_removeTab));
    cls->defineFunction("getTabCount", _SE(js_cocos2dx_ui_TabControl_getTabCount));
    cls->defineFunction("getHeaderDockPlace", _SE(js_cocos2dx_ui_TabControl_getHeaderDockPlace));
    cls->defineFunction("getSelectedTabIndex", _SE(js_cocos2dx_ui_TabControl_getSelectedTabIndex));
    cls->defineFunction("insertTab", _SE(js_cocos2dx_ui_TabControl_insertTab));
    cls->defineFunction("ignoreHeadersTextureSize", _SE(js_cocos2dx_ui_TabControl_ignoreHeadersTextureSize));
    cls->defineFunction("getHeaderWidth", _SE(js_cocos2dx_ui_TabControl_getHeaderWidth));
    cls->defineFunction("setHeaderDockPlace", _SE(js_cocos2dx_ui_TabControl_setHeaderDockPlace));
    cls->defineFunction("setSelectTab", _SE(js_cocos2dx_ui_TabControl_setSelectTab));
    cls->defineFunction("getTabHeader", _SE(js_cocos2dx_ui_TabControl_getTabHeader));
    cls->defineFunction("isIgnoreHeadersTextureSize", _SE(js_cocos2dx_ui_TabControl_isIgnoreHeadersTextureSize));
    cls->defineFunction("setTabChangedEventListener", _SE(js_cocos2dx_ui_TabControl_setTabChangedEventListener));
    cls->defineFunction("setHeaderSelectedZoom", _SE(js_cocos2dx_ui_TabControl_setHeaderSelectedZoom));
    cls->defineFunction("setHeaderHeight", _SE(js_cocos2dx_ui_TabControl_setHeaderHeight));
    cls->defineFunction("indexOfTabHeader", _SE(js_cocos2dx_ui_TabControl_indexOfTabHeader));
    cls->defineFunction("getTabContainer", _SE(js_cocos2dx_ui_TabControl_getTabContainer));
    cls->defineFunction("getHeaderSelectedZoom", _SE(js_cocos2dx_ui_TabControl_getHeaderSelectedZoom));
    cls->defineFunction("getHeaderHeight", _SE(js_cocos2dx_ui_TabControl_getHeaderHeight));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_TabControl_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_TabControl_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::TabControl>(cls);

    __jsb_cocos2d_ui_TabControl_proto = cls->getProto();
    __jsb_cocos2d_ui_TabControl_class = cls;

    se::ScriptEngine::getInstance()->executeScriptBuffer("(function () { ccui.TabControl.extend = cc.Class.extend; })()");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_cocos2dx_ui(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("ccui", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("ccui", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_cocos2dx_ui_Widget(ns);
    js_register_cocos2dx_ui_Layout(ns);
    js_register_cocos2dx_ui_RelativeBox(ns);
    js_register_cocos2dx_ui_AbstractCheckButton(ns);
    js_register_cocos2dx_ui_CheckBox(ns);
    js_register_cocos2dx_ui_TextAtlas(ns);
    js_register_cocos2dx_ui_TextBMFont(ns);
    js_register_cocos2dx_ui_LoadingBar(ns);
    js_register_cocos2dx_ui_TextField(ns);
    js_register_cocos2dx_ui_RichText(ns);
    js_register_cocos2dx_ui_Scale9Sprite(ns);
    js_register_cocos2dx_ui_RichElement(ns);
    js_register_cocos2dx_ui_RichElementCustomNode(ns);
    js_register_cocos2dx_ui_VBox(ns);
    js_register_cocos2dx_ui_Slider(ns);
    js_register_cocos2dx_ui_RadioButtonGroup(ns);
    js_register_cocos2dx_ui_TabControl(ns);
    js_register_cocos2dx_ui_ScrollView(ns);
    js_register_cocos2dx_ui_ListView(ns);
    js_register_cocos2dx_ui_TabHeader(ns);
    js_register_cocos2dx_ui_RichElementNewLine(ns);
    js_register_cocos2dx_ui_LayoutComponent(ns);
    js_register_cocos2dx_ui_Button(ns);
    js_register_cocos2dx_ui_LayoutParameter(ns);
    js_register_cocos2dx_ui_LinearLayoutParameter(ns);
    js_register_cocos2dx_ui_RadioButton(ns);
    js_register_cocos2dx_ui_ImageView(ns);
    js_register_cocos2dx_ui_HBox(ns);
    js_register_cocos2dx_ui_RichElementText(ns);
    js_register_cocos2dx_ui_PageView(ns);
    js_register_cocos2dx_ui_Helper(ns);
    js_register_cocos2dx_ui_EditBox(ns);
    js_register_cocos2dx_ui_Text(ns);
    js_register_cocos2dx_ui_RichElementImage(ns);
    js_register_cocos2dx_ui_RelativeLayoutParameter(ns);
    js_register_cocos2dx_ui_UICCTextField(ns);
    return true;
}

