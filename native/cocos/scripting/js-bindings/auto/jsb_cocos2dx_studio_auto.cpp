#include "scripting/js-bindings/auto/jsb_cocos2dx_studio_auto.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "editor-support/cocostudio/CocoStudio.h"

template<class T>
static bool dummy_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS_ReportError(cx, "Constructor for the requested class is not available, please refer to the API reference.");
    return false;
}

static bool empty_constructor(JSContext *cx, uint32_t argc, JS::Value *vp) {
    return false;
}

static bool js_is_native_obj(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    args.rval().setBoolean(true);
    return true;
}
void register_all_cocos2dx_studio(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "ccs", &ns);

}

