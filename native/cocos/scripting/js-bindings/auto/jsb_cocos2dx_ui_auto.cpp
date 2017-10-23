#include "scripting/js-bindings/auto/jsb_cocos2dx_ui_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "ui/CocosGUI.h"

se::Object* __jsb_cocos2d_ui_Widget_proto = nullptr;
se::Class* __jsb_cocos2d_ui_Widget_class = nullptr;

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
                jsThis.toObject()->attachObject(jsFunc.toObject());
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
                jsThis.toObject()->attachObject(jsFunc.toObject());
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
                jsThis.toObject()->attachObject(jsFunc.toObject());
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
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::ui::Widget)", s.nativeThisObject());
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

    cls->defineFunction("setSizePercent", _SE(js_cocos2dx_ui_Widget_setSizePercent));
    cls->defineFunction("getCustomSize", _SE(js_cocos2dx_ui_Widget_getCustomSize));
    cls->defineFunction("getLeftBoundary", _SE(js_cocos2dx_ui_Widget_getLeftBoundary));
    cls->defineFunction("setFlippedX", _SE(js_cocos2dx_ui_Widget_setFlippedX));
    cls->defineFunction("_init", _SE(js_cocos2dx_ui_Widget_init));
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
    cls->defineFunction("setCallbackName", _SE(js_cocos2dx_ui_Widget_setCallbackName));
    cls->defineFunction("addCCSEventListener", _SE(js_cocos2dx_ui_Widget_addCCSEventListener));
    cls->defineFunction("getPositionType", _SE(js_cocos2dx_ui_Widget_getPositionType));
    cls->defineFunction("getTopBoundary", _SE(js_cocos2dx_ui_Widget_getTopBoundary));
    cls->defineFunction("ignoreContentAdaptWithSize", _SE(js_cocos2dx_ui_Widget_ignoreContentAdaptWithSize));
    cls->defineFunction("isEnabled", _SE(js_cocos2dx_ui_Widget_isEnabled));
    cls->defineFunction("isFocused", _SE(js_cocos2dx_ui_Widget_isFocused));
    cls->defineFunction("getTouchBeganPosition", _SE(js_cocos2dx_ui_Widget_getTouchBeganPosition));
    cls->defineFunction("isTouchEnabled", _SE(js_cocos2dx_ui_Widget_isTouchEnabled));
    cls->defineFunction("getCallbackName", _SE(js_cocos2dx_ui_Widget_getCallbackName));
    cls->defineFunction("getActionTag", _SE(js_cocos2dx_ui_Widget_getActionTag));
    cls->defineFunction("requestFocus", _SE(js_cocos2dx_ui_Widget_requestFocus));
    cls->defineFunction("isFocusEnabled", _SE(js_cocos2dx_ui_Widget_isFocusEnabled));
    cls->defineFunction("setFocused", _SE(js_cocos2dx_ui_Widget_setFocused));
    cls->defineFunction("setActionTag", _SE(js_cocos2dx_ui_Widget_setActionTag));
    cls->defineFunction("setTouchEnabled", _SE(js_cocos2dx_ui_Widget_setTouchEnabled));
    cls->defineFunction("setFlippedY", _SE(js_cocos2dx_ui_Widget_setFlippedY));
    cls->defineFunction("setEnabled", _SE(js_cocos2dx_ui_Widget_setEnabled));
    cls->defineFunction("getRightBoundary", _SE(js_cocos2dx_ui_Widget_getRightBoundary));
    cls->defineFunction("setBrightStyle", _SE(js_cocos2dx_ui_Widget_setBrightStyle));
    cls->defineFunction("getWorldPosition", _SE(js_cocos2dx_ui_Widget_getWorldPosition));
    cls->defineFunction("clone", _SE(js_cocos2dx_ui_Widget_clone));
    cls->defineFunction("setFocusEnabled", _SE(js_cocos2dx_ui_Widget_setFocusEnabled));
    cls->defineFunction("getBottomBoundary", _SE(js_cocos2dx_ui_Widget_getBottomBoundary));
    cls->defineFunction("isBright", _SE(js_cocos2dx_ui_Widget_isBright));
    cls->defineFunction("dispatchFocusEvent", _SE(js_cocos2dx_ui_Widget_dispatchFocusEvent));
    cls->defineFunction("setUnifySizeEnabled", _SE(js_cocos2dx_ui_Widget_setUnifySizeEnabled));
    cls->defineFunction("isPropagateTouchEvents", _SE(js_cocos2dx_ui_Widget_isPropagateTouchEvents));
    cls->defineFunction("hitTest", _SE(js_cocos2dx_ui_Widget_hitTest));
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
    cls->defineFunction("setSizeType", _SE(js_cocos2dx_ui_Widget_setSizeType));
    cls->defineFunction("interceptTouchEvent", _SE(js_cocos2dx_ui_Widget_interceptTouchEvent));
    cls->defineFunction("setBright", _SE(js_cocos2dx_ui_Widget_setBright));
    cls->defineFunction("setCallbackType", _SE(js_cocos2dx_ui_Widget_setCallbackType));
    cls->defineFunction("isSwallowTouches", _SE(js_cocos2dx_ui_Widget_isSwallowTouches));
    cls->defineFunction("ctor", _SE(js_cocos2dx_ui_Widget_ctor));
    cls->defineStaticFunction("getCurrentFocusedWidget", _SE(js_cocos2dx_ui_Widget_getCurrentFocusedWidget));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_ui_Widget_create));
    cls->defineFinalizeFunction(_SE(js_cocos2d_ui_Widget_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::Widget>(cls);

    __jsb_cocos2d_ui_Widget_proto = cls->getProto();
    __jsb_cocos2d_ui_Widget_class = cls;

    jsb_set_extend_property("ccui", "Widget");
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
    cls->install();
    JSBClassType::registerClass<cocos2d::ui::Helper>(cls);

    __jsb_cocos2d_ui_Helper_proto = cls->getProto();
    __jsb_cocos2d_ui_Helper_class = cls;

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
        if (argc == 0) {
            bool result = cobj->init();
            ok &= boolean_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_cocos2dx_ui_Scale9Sprite_init : Error processing arguments");
            return true;
        }
    } while(false);

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
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::ui::Scale9Sprite)", s.nativeThisObject());
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

    jsb_set_extend_property("ccui", "Scale9Sprite");
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
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::ui::EditBox)", s.nativeThisObject());
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

    jsb_set_extend_property("ccui", "EditBox");
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
    js_register_cocos2dx_ui_Scale9Sprite(ns);
    js_register_cocos2dx_ui_Helper(ns);
    js_register_cocos2dx_ui_EditBox(ns);
    return true;
}

