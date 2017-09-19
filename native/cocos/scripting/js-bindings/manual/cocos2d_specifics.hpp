/*
 * Copyright (c) 2012 Zynga Inc.
 * Copyright (c) 2013-2016 Chukong Technologies Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

#ifndef __JS_COCOS2D_X_SPECIFICS_H__
#define __JS_COCOS2D_X_SPECIFICS_H__

#include "scripting/js-bindings/manual/ScriptingCore.h"

#include "2d/CCScene.h"
#include "2d/CCSprite.h"
#include "base/CCEventListenerTouch.h"
#include "base/CCRef.h"
#include "base/uthash.h"
#include "platform/CCSAXParser.h"

extern JSClass  *jsb_RefFinalizeHook_class;
extern JSObject *jsb_RefFinalizeHook_prototype;
extern JSClass  *jsb_ObjFinalizeHook_class;
extern JSObject *jsb_ObjFinalizeHook_prototype;
extern JSClass  *jsb_PrivateHook_class;
extern JSObject *jsb_PrivateHook_prototype;
extern JSClass *jsb_cocos2d_EventKeyboard_class;
extern JS::PersistentRootedObject *jsb_cocos2d_EventKeyboard_prototype;

class JSScheduleWrapper;

template<class T>
static bool dummy_constructor(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS_ReportErrorUTF8(cx, "Constructor for the requested class is not available, please refer to the API reference.");
    return false;
}

static bool empty_constructor(JSContext *cx, uint32_t argc, JS::Value *vp) {
    return false;
}

namespace jsb
{
    class Object
    {
    private:
        js_proxy_t *_proxy;
        std::string _jsRef;
    public:
        Object(const std::string &jsRef = "")
        : _jsRef(jsRef)
        , _proxy(nullptr)
        {
        }
        Object(JSContext *cx, JS::HandleObject jsobj, const std::string &jsRef = "")
        : _jsRef(jsRef)
        , _proxy(nullptr)
        {
            setObj(cx, jsobj);
        }
        ~Object()
        {
            if (_proxy)
            {
#if COCOS2D_DEBUG > 1
                CCLOG("Release JSBObject %p, with proxy: %p", this, _proxy);
#endif // COCOS2D_DEBUG
                jsb_remove_proxy(_proxy);
            }
        }
        void setObj(JSContext *cx, JS::HandleObject jsobj)
        {
            if (_proxy)
            {
#if COCOS2D_DEBUG > 1
                CCLOG("Release JSBObject %p, with proxy: %p", this, _proxy);
#endif // COCOS2D_DEBUG
                jsb_remove_proxy(_proxy);
            }
            JS::RootedValue val(cx, JS::ObjectOrNullValue(jsobj));
            if (val.isNullOrUndefined())
            {
                _proxy = nullptr;
            }
            else
            {
                _proxy = jsb_bind_proxy(cx, this, jsobj);
                
                if (_jsRef.size() > 0)
                {
                    JS::RootedObject proto(cx, jsb_PrivateHook_prototype);
                    JS::RootedObject hook(cx, JS_NewObjectWithGivenProto(cx, jsb_PrivateHook_class, proto));
                    JS::RootedValue hookVal(cx, JS::ObjectOrNullValue(hook));
                    JS_SetProperty(cx, jsobj, _jsRef.c_str(), hookVal);
                    JS_SetPrivate(hook.get(), this);
                }
            }
        }
        bool getObj(JS::MutableHandleObject obj)
        {
            if (_proxy)
            {
                obj.set(_proxy->obj);
                return true;
            }
            else
            {
                return false;
            }
        }
        
        static Object *getJSBObject(JSContext *cx, JS::HandleObject jsobj, const std::string &jsRefName)
        {
            JS::RootedValue obj(cx, JS::ObjectOrNullValue(jsobj));
            bool found = false;
            if (obj.isObject() && JS_HasProperty(cx, jsobj, jsRefName.c_str(), &found) && found)
            {
                JS::RootedValue ref(cx);
                JS_GetProperty(cx, jsobj, jsRefName.c_str(), &ref);
                JS::RootedObject refObj(cx, ref.toObjectOrNull());
                if (JS_GetClass(refObj) == jsb_PrivateHook_class)
                {
                    return (Object *)JS_GetPrivate(refObj);
                }
            }
            return nullptr;
        }
    };
}

// wraps a function and "this" object
class JSFunctionWrapper
{
public:
    JSFunctionWrapper(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func);
    JSFunctionWrapper(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func, JS::HandleObject owner);
    ~JSFunctionWrapper();
    
    void setOwner(JSContext* cx, JS::HandleObject owner);
    void setData(JSContext* cx, JS::HandleObject data);
    void getData(JSContext* cx, JS::MutableHandleObject data);
    void setJSCallback(JSContext* cx, JS::HandleObject callback);
    void getJSCallback(JSContext* cx, JS::MutableHandleObject callback);
    void setJSTarget(JSContext* cx, JS::HandleObject target);
    void getJSTarget(JSContext* cx, JS::MutableHandleObject target);
    
    bool invoke(JS::HandleValueArray args, JS::MutableHandleValue rval);
private:
    JSContext *_cx;
    jsb::Object *_jsthis;
    jsb::Object *_func;
    jsb::Object *_owner;
    jsb::Object *_data;
    void* _cppOwner;
    
    CC_DISALLOW_COPY_AND_ASSIGN(JSFunctionWrapper);
};


// JSScheduleWrapper* --> Array* since one js function may correspond to many targets.
// To debug this, you could refer to JSScheduleWrapper::dump function.
// It will prove that i'm right. :)
typedef struct jsScheduleFunc_proxy {
    jsb::Object *jsfuncObj;
    cocos2d::Vector<JSScheduleWrapper*>* targets;
    UT_hash_handle hh;
} schedFunc_proxy_t;

typedef struct jsScheduleTarget_proxy {
    jsb::Object *jsTargetObj;
    cocos2d::Vector<JSScheduleWrapper*>* targets;
    UT_hash_handle hh;
} schedTarget_proxy_t;

extern schedFunc_proxy_t *_schedFunc_target_ht;
extern schedTarget_proxy_t *_schedObj_target_ht;


class JSScheduleWrapper: public JSFunctionWrapper, public cocos2d::Ref {
    
public:
    JSScheduleWrapper(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func);
    JSScheduleWrapper(JSContext* cx, JS::HandleObject jsthis, JS::HandleObject func, JS::HandleObject owner);
    
    static void setTargetForSchedule(JSContext* cx, JS::HandleValue sched, JSScheduleWrapper *target);
    static cocos2d::Vector<JSScheduleWrapper*>* getTargetForSchedule(JSContext *cx, JS::HandleValue sched);
    static void setTargetForJSObject(JSContext* cx, JS::HandleObject jsTargetObj, JSScheduleWrapper *target);
    static cocos2d::Vector<JSScheduleWrapper*>* getTargetForJSObject(JSContext *cx, JS::HandleObject jsTargetObj);
    
    // Remove all targets.
    static void removeAllTargets();
    // Remove all targets for priority.
    static void removeAllTargetsForMinPriority(int minPriority);
    // Remove all targets by js object from hash table(_schedFunc_target_ht and _schedObj_target_ht).
    static void removeAllTargetsForJSObject(JSContext *cx, JS::HandleObject jsTargetObj);
    // Remove the target by js object and the wrapper for native schedule.
    static void removeTargetForJSObject(JSContext *cx, JS::HandleObject jsTargetObj, JSScheduleWrapper* target);
    static void dump();
    
    void pause();
    
    void scheduleFunc(float dt);
    void update(float dt);
    
    Ref* getTarget();
    void setTarget(Ref* pTarget);
    
    void setPriority(int priority);
    int  getPriority();
    
    void setUpdateSchedule(bool isUpdateSchedule);
    bool isUpdateSchedule();
    
protected:
    static std::string _jsRefName;
    
    Ref* _pTarget;
    int _priority;
    bool _isUpdateSchedule;
};

/**
 * Gets or creates a JSObject based on native_obj.
 * If native_obj is subclass of Ref, it will use the jsb_ref functions.
 * Otherwise it will Root the newly created JSObject
 */
template<class T>
bool js_get_or_create_jsobject(JSContext *cx, typename std::enable_if<!std::is_base_of<cocos2d::Ref,T>::value,T>::type *native_obj, JS::MutableHandleObject ret)
{
    auto proxy = jsb_get_native_proxy(native_obj);
    if (proxy)
    {
        ret.set(proxy->obj);
        return true;
    }
    else
    {
        js_type_class_t* typeClass = js_get_type_from_native<T>(native_obj);
        JS::RootedObject proto(cx, typeClass->proto->get());
#if COCOS2D_DEBUG > 1
        return jsb_get_or_create_weak_jsobject(cx, native_obj, typeClass->jsclass, proto, ret, typeid(*native_obj).name());
#else
        return jsb_get_or_create_weak_jsobject(cx, native_obj, typeClass->jsclass, proto, ret);
#endif // COCOS2D_DEBUG
    }
}

/**
 * Gets or creates a JSObject based on native_obj.
 * If native_obj is subclass of Ref, it will use the jsb_ref functions.
 * Otherwise it will Root the newly created JSObject
 */
template<class T>
bool js_get_or_create_jsobject(JSContext *cx, typename std::enable_if<std::is_base_of<cocos2d::Ref,T>::value,T>::type *native_obj, JS::MutableHandleObject ret)
{
    auto proxy = jsb_get_native_proxy(native_obj);
    if (proxy)
    {
        ret.set(proxy->obj);
        return true;
    }
    else
    {
        js_type_class_t* typeClass = js_get_type_from_native<T>(native_obj);
        JS::RootedObject proto(cx, typeClass->proto->get());
#if COCOS2D_DEBUG > 1
        return jsb_ref_get_or_create_jsobject(cx, native_obj, typeClass->jsclass, proto, ret, typeid(*native_obj).name());
#else
        return jsb_ref_get_or_create_jsobject(cx, native_obj, typeClass->jsclass, proto, ret);
#endif // COCOS2D_DEBUG
    }
}

/**
 * Add a FinalizeHook object to the target object.
 * When the target object get garbage collected, its FinalizeHook's finalize function will be invoked.
 * In the finalize function, it mainly remove native/js proxys, release/delete the native object.
 * IMPORTANT: For Ref objects, please remember to retain the native object to correctly manage its reference count.
 */
void js_add_FinalizeHook(JSContext *cx, JS::HandleObject target, bool isRef=true);

void js_add_object_reference(JS::HandleValue owner, JS::HandleValue target);
void js_remove_object_reference(JS::HandleValue owner, JS::HandleValue target);
void js_add_object_root(JS::HandleValue target);
void js_remove_object_root(JS::HandleValue target);

bool anonEvaluate(JSContext *cx, JS::HandleObject thisObj, const char* string, JS::MutableHandleValue out);
void register_cocos2dx_js_core(JSContext* cx, JS::HandleObject obj);


class __JSPlistDelegator: public cocos2d::SAXDelegator
{
public:
    static __JSPlistDelegator* getInstance() {
        static __JSPlistDelegator* pInstance = NULL;
        if (pInstance == NULL) {
            pInstance = new (std::nothrow) __JSPlistDelegator();
        }
        return pInstance;
    };

    ~__JSPlistDelegator();

    cocos2d::SAXParser* getParser();

    std::string parse(const std::string& path);
    std::string parseText(const std::string& text);

    // implement pure virtual methods of SAXDelegator
    void startElement(void *ctx, const char *name, const char **atts);
    void endElement(void *ctx, const char *name);
    void textHandler(void *ctx, const char *ch, int len);

private:
    cocos2d::SAXParser _parser;
    std::string _result;
    bool _isStoringCharacters;
    std::string _currentValue;
};

bool js_cocos2dx_Node_onEnter(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_onExit(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_onEnterTransitionDidFinish(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_onExitTransitionDidStart(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Node_cleanup(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Component_onEnter(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_Component_onExit(JSContext *cx, uint32_t argc, JS::Value *vp);

bool js_cocos2dx_retain(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_release(JSContext *cx, uint32_t argc, JS::Value *vp);

void get_or_create_js_obj(JSContext* cx, JS::HandleObject obj, const std::string &name, JS::MutableHandleObject jsObj);
void get_or_create_js_obj(const std::string &name, JS::MutableHandleObject jsObj);

#endif
