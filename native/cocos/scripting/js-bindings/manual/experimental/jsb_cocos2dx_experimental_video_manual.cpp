#include "scripting/js-bindings/manual/experimental/jsb_cocos2dx_experimental_video_manual.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS)

#include "ui/UIVideoPlayer.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"


using namespace cocos2d;


static bool jsb_cocos2dx_experimental_ui_VideoPlayer_addEventListener(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    experimental::ui::VideoPlayer* cobj = (experimental::ui::VideoPlayer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");

    if(argc == 1){
        JS::RootedObject jsfunc(cx, args.get(0).toObjectOrNull());
        std::shared_ptr<JSFunctionWrapper> func(new JSFunctionWrapper(cx, obj, jsfunc, obj));
        cobj->addEventListener([=](Ref* widget, experimental::ui::VideoPlayer::EventType type)->void{
            JS::AutoValueVector arg(cx);
            JS::RootedObject jsobj(cx);
            js_get_or_create_jsobject<Ref>(cx, widget, &jsobj);
            arg.append(JS::ObjectOrNullValue(jsobj));
            arg.append(JS::Int32Value((int32_t)type));
            JS::HandleValueArray argsv(arg);
            JS::RootedValue rval(cx);

            bool ok = func->invoke(argsv, &rval);
            if (!ok && JS_IsExceptionPending(cx)) {
                handlePendingException(cx);
            }
        });
        return true;
    }

    JS_ReportErrorUTF8(cx, "jsb_cocos2dx_experimental_ui_VideoPlayer_addEventListener : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

extern JS::PersistentRootedObject* jsb_cocos2d_experimental_ui_VideoPlayer_prototype;

void register_all_cocos2dx_experimental_video_manual(JSContext* cx, JS::HandleObject global)
{
    JS::RootedObject proto(cx, jsb_cocos2d_experimental_ui_VideoPlayer_prototype->get());
    JS_DefineFunction(cx, proto, "addEventListener", jsb_cocos2dx_experimental_ui_VideoPlayer_addEventListener, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
}

#endif
