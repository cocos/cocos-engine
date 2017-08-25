/*
 * Created by Rolando Abarca on 3/14/12.
 * Copyright (c) 2012 Zynga Inc. All rights reserved.
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

#include "scripting/js-bindings/manual/ScriptingCore.h"

#include "js/Initialization.h"
#include "storage/local-storage/LocalStorage.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"
#include "scripting/js-bindings/manual/js_bindings_config.h"
#include "scripting/js-bindings/auto/jsb_cocos2dx_ui_auto.hpp"
#include "network/HttpClient.h"

#include "cocos2d.h" // we used cocos2dVersion() ...

// for debug socket
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32 || CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
#include <io.h>
#include <WS2tcpip.h>
#else
#include <sys/socket.h>
#include <unistd.h>
#include <netdb.h>
#endif

#include <thread>
#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <vector>
#include <map>

#ifdef ANDROID
#include <android/log.h>
#include <jni/JniHelper.h>
#include <netinet/in.h>
#endif

#ifdef ANDROID
#define  LOG_TAG    "ScriptingCore.cpp"
#define  LOGD(...)  __android_log_print(ANDROID_LOG_DEBUG,LOG_TAG,__VA_ARGS__)
#else
#define  LOGD(...) js_log(__VA_ARGS__)
#endif

#if COCOS2D_DEBUG
#define TRACE_DEBUGGER_SERVER(...) CCLOG(__VA_ARGS__)
#else
#define TRACE_DEBUGGER_SERVER(...)
#endif // #if COCOS2D_DEBUG

#define BYTE_CODE_FILE_EXT ".jsc"

using namespace cocos2d;

static std::string inData;
static std::string outData;
static std::vector<std::string> g_queue;
static std::mutex g_qMutex;
static std::mutex g_rwMutex;
static int clientSocket = -1;
static uint32_t s_nestedLoopLevel = 0;

// server entry point for the bg thread
static void serverEntryPoint(unsigned int port);

// global datas
// type name ~> jsb class type
std::unordered_map<std::string, js_type_class_t*> *_js_global_type_map = nullptr;
// native pointer ~> jsb proxy
static std::unordered_map<void*, js_proxy_t*> *_native_js_global_map = nullptr;
// filename ~> JSScript
static std::unordered_map<std::string, JS::PersistentRootedScript*> *_filename_script = nullptr;
// port ~> socket
static std::unordered_map<int,int> ports_sockets;
// callback list for JSB API registration
static std::vector<sc_register_sth> registrationList;

static char *_js_log_buf = nullptr;

const char *ScriptingCore::EVENT_RESET = "scriptingcore_event_reset";

static void cc_closesocket(int fd)
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32 || CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
    closesocket(fd);
#else
    close(fd);
#endif
}

static std::string getTouchesFuncName(EventTouch::EventCode eventCode)
{
    std::string funcName;
    switch(eventCode)
    {
        case EventTouch::EventCode::BEGAN:
            funcName = "onTouchesBegan";
            break;
        case EventTouch::EventCode::ENDED:
            funcName = "onTouchesEnded";
            break;
        case EventTouch::EventCode::MOVED:
            funcName = "onTouchesMoved";
            break;
        case EventTouch::EventCode::CANCELLED:
            funcName = "onTouchesCancelled";
            break;
        default:
            CCASSERT(false, "Invalid event code!");
            break;
    }
    return funcName;
}

static std::string getTouchFuncName(EventTouch::EventCode eventCode)
{
    std::string funcName;
    switch(eventCode) {
        case EventTouch::EventCode::BEGAN:
            funcName = "onTouchBegan";
            break;
        case EventTouch::EventCode::ENDED:
            funcName = "onTouchEnded";
            break;
        case EventTouch::EventCode::MOVED:
            funcName = "onTouchMoved";
            break;
        case EventTouch::EventCode::CANCELLED:
            funcName = "onTouchCancelled";
            break;
        default:
            CCASSERT(false, "Invalid event code!");
    }

    return funcName;
}

static std::string getMouseFuncName(EventMouse::MouseEventType eventType)
{
    std::string funcName;
    switch(eventType) {
        case EventMouse::MouseEventType::MOUSE_DOWN:
            funcName = "onMouseDown";
            break;
        case EventMouse::MouseEventType::MOUSE_UP:
            funcName = "onMouseUp";
            break;
        case EventMouse::MouseEventType::MOUSE_MOVE:
            funcName = "onMouseMove";
            break;
        case EventMouse::MouseEventType::MOUSE_SCROLL:
            funcName = "onMouseScroll";
            break;
        default:
            CCASSERT(false, "Invalid event code!");
    }

    return funcName;
}

void ScriptingCore::executeJSFunctionWithThisObj(JS::HandleValue thisObj, JS::HandleValue callback)
{
    JS::RootedValue retVal(_cx);
    executeJSFunctionWithThisObj(thisObj, callback, JS::HandleValueArray::empty(), &retVal);
}

void ScriptingCore::executeJSFunctionWithThisObj(JS::HandleValue thisObj,
                                                 JS::HandleValue callback,
                                                 const JS::HandleValueArray& vp,
                                                 JS::MutableHandleValue retVal)
{
    if (!callback.isNullOrUndefined() || !thisObj.isNullOrUndefined())
    {
        // Very important: The last parameter 'retVal' passed to 'JS_CallFunctionValue' should not be a NULL pointer.
        // If it's a NULL pointer, crash will be triggered in 'JS_CallFunctionValue'. To find out the reason of this crash is very difficult.
        // So we have to check the availability of 'retVal'.
        JS::RootedObject jsthis(_cx, thisObj.toObjectOrNull());
        JS_CallFunctionValue(_cx, jsthis, callback, vp, retVal);
        if (JS_IsExceptionPending(_cx)) {
            handlePendingException(_cx);
        }
    }
}

static void ReportException(JSContext *cx)
{
    if (JS_IsExceptionPending(cx)) {
        handlePendingException(cx);
    }
}

void js_log(const char *format, ...)
{
#if COCOS2D_DEBUG
    if (_js_log_buf == NULL)
    {
        _js_log_buf = (char *)calloc(sizeof(char), MAX_LOG_LENGTH+1);
        _js_log_buf[MAX_LOG_LENGTH] = '\0';
    }
    va_list vl;
    va_start(vl, format);
    int len = vsnprintf(_js_log_buf, MAX_LOG_LENGTH, format, vl);
    va_end(vl);
    if (len > 0)
    {
        log("%s", _js_log_buf);
    }
#endif
}

bool JSBCore_platform(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    if (argc!=0)
    {
        JS_ReportErrorUTF8(cx, "Invalid number of arguments in __getPlatform");
        return false;
    }
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    Application::Platform platform;

    platform = Application::getInstance()->getTargetPlatform();
    args.rval().set(JS::Int32Value((int)platform));
    return true;
};

bool JSBCore_version(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    if (argc!=0)
    {
        JS_ReportErrorUTF8(cx, "Invalid number of arguments in __getVersion");
        return false;
    }

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    std::string version = cocos2dVersion();
    JS::RootedValue js_version(cx);
    std_string_to_jsval(cx, version, &js_version);

    args.rval().set(js_version);
    return true;
};

bool JSBCore_os(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    if (argc!=0)
    {
        JS_ReportErrorUTF8(cx, "Invalid number of arguments in __getOS");
        return false;
    }

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);

    JS::RootedValue os(cx);

    // osx, ios, android, windows, linux, etc..
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    c_string_to_jsval(cx, "iOS", &os);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    c_string_to_jsval(cx, "Android", &os);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
    c_string_to_jsval(cx, "Windows", &os);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_MARMALADE)
    c_string_to_jsval(cx, "Marmalade", &os);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_LINUX)
    c_string_to_jsval(cx, "Linux", &os);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_BADA)
    c_string_to_jsval(cx, "Bada", &os);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_BLACKBERRY)
    c_string_to_jsval(cx, "Blackberry", &os);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
    c_string_to_jsval(cx, "OS X", &os);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
    c_string_to_jsval(cx, "WINRT", &os);
#else
    c_string_to_jsval(cx, "Unknown", &os);
#endif

    args.rval().set(os);
    return true;
};

bool JSB_cleanScript(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    if (argc != 1)
    {
        JS_ReportErrorUTF8(cx, "Invalid number of arguments in JSB_cleanScript");
        return false;
    }

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedString jsPath(cx, args.get(0).toString());
    JSB_PRECONDITION2(jsPath, cx, false, "Error js file in clean script");
    JSStringWrapper wrapper(jsPath);
    ScriptingCore::getInstance()->cleanScript(wrapper.get());

    args.rval().setUndefined();

    return true;
};

bool JSB_core_restartVM(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JSB_PRECONDITION2(argc==0, cx, false, "Invalid number of arguments in executeScript");
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    ScriptingCore::getInstance()->reset();
    args.rval().setUndefined();
    return true;
};

bool JSB_closeWindow(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    EventListenerCustom* _event = Director::getInstance()->getEventDispatcher()->addCustomEventListener(Director::EVENT_AFTER_DRAW, [&](EventCustom *event) {
        Director::getInstance()->getEventDispatcher()->removeEventListener(_event);
        CC_SAFE_RELEASE(_event);
        
        ScriptingCore::getInstance()->cleanup();
    });
    _event->retain();
    Director::getInstance()->end();
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    exit(0);
#endif
    return true;
};

void registerDefaultClasses(JSContext* cx, JS::HandleObject global)
{
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, global, "cc", &ns);
    JS::RootedValue nsval(cx, JS::ObjectOrNullValue(ns));
    
    // register some global functions
    JS_DefineFunction(cx, global, "require", ScriptingCore::executeScript, 1, JSPROP_PERMANENT);
    JS_DefineFunction(cx, global, "log", ScriptingCore::log, 0, JSPROP_PERMANENT);
    JS_DefineFunction(cx, global, "executeScript", ScriptingCore::executeScript, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, global, "forceGC", ScriptingCore::forceGC, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    
    JS_DefineFunction(cx, global, "__getPlatform", JSBCore_platform, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, global, "__getOS", JSBCore_os, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, global, "__getVersion", JSBCore_version, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, global, "__restartVM", JSB_core_restartVM, 0, JSPROP_READONLY | JSPROP_PERMANENT | JSPROP_ENUMERATE );
    JS_DefineFunction(cx, global, "__cleanScript", JSB_cleanScript, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, global, "__isObjectValid", ScriptingCore::isObjectValid, 1, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, global, "close", JSB_closeWindow, 0, JSPROP_READONLY | JSPROP_PERMANENT);

    //
    // Javascript controller (__jsc__)
    //
    JS::RootedObject jsc(cx, JS_NewPlainObject(cx));
    JS::RootedValue jscVal(cx);
    jscVal = JS::ObjectOrNullValue(jsc);
    JS_SetProperty(cx, global, "__jsc__", jscVal);

#if CC_ENABLE_GC_FOR_NATIVE_OBJECTS
    JS::RootedValue trueVal(cx, JS::TrueHandleValue);
    JS_SetProperty(cx, global, "__ENABLE_GC_FOR_NATIVE_OBJECTS__", trueVal);
#else
    JS::RootedValue falseVal(cx, JS::FalseHandleValue);
    JS_SetProperty(cx, global, "__ENABLE_GC_FOR_NATIVE_OBJECTS__", falseVal);
#endif

    JS_DefineFunction(cx, jsc, "garbageCollect", ScriptingCore::forceGC, 0, JSPROP_READONLY | JSPROP_PERMANENT | JSPROP_ENUMERATE );
    JS_DefineFunction(cx, jsc, "dumpRoot", ScriptingCore::dumpRoot, 0, JSPROP_READONLY | JSPROP_PERMANENT | JSPROP_ENUMERATE );
    JS_DefineFunction(cx, jsc, "executeScript", ScriptingCore::executeScript, 1, JSPROP_READONLY | JSPROP_PERMANENT | JSPROP_ENUMERATE );
}

static const JSClassOps global_classOps = {
    nullptr, nullptr, nullptr, nullptr,
    nullptr, nullptr, nullptr,
    nullptr,
    nullptr, nullptr, nullptr, JS_GlobalObjectTraceHook
};
static const JSClass global_class = {
    "global",
    JSCLASS_GLOBAL_FLAGS,
    &global_classOps
};

// Callbacks

static bool
GetBuildId(JS::BuildIdCharVector* buildId)
{
    const char buildid[] = "cocos_xdr";
    bool ok = buildId->append(buildid, strlen(buildid));
    return ok;
}

void jsbWeakPointerCompartmentCallback(JSContext* cx, JSCompartment* comp, void* data)
{
    auto it_js = _native_js_global_map->begin();
    while (it_js != _native_js_global_map->end())
    {
        js_proxy_t *proxy = it_js->second;
        if (proxy->obj)
        {
            JS_UpdateWeakPointerAfterGC(&proxy->obj);
        }
        it_js++;
    }
}

static void
on_garbage_collect(JSContext* cx, JSGCStatus status, void* data)
{
    /* We finalize any pending toggle refs before doing any garbage collection,
     * so that we can collect the JS wrapper objects, and in order to minimize
     * the chances of objects having a pending toggle up queued when they are
     * garbage collected. */
    if (status == JSGC_BEGIN)
    {
        printf("on_garbage_collect: begin, Native -> JS map count: %d\n", (int)_native_js_global_map->size());
    }
    else if (status == JSGC_END)
    {
        printf("on_garbage_collect: end, Native -> JS map count: %d\n", (int)_native_js_global_map->size());
    }
}

// Promise support

using JobQueue = JS::GCVector<JSObject*, 0, js::SystemAllocPolicy>;

// Per-context shell state.
struct PromiseState
{
    explicit PromiseState(JSContext* cx);
    ~PromiseState();
    
    JS::PersistentRooted<JobQueue> jobQueue;
    bool drainingJobQueue;
    bool quitting;
    EventListenerCustom *drainJobsHook;
};

PromiseState* getPromiseState(JSContext* cx)
{
    PromiseState* sc = static_cast<PromiseState*>(JS_GetContextPrivate(cx));
    assert(sc);
    return sc;
}

JSObject* onGetIncumbentGlobalCallback(JSContext* cx)
{
    return JS::CurrentGlobalOrNull(cx);
}

bool onEnqueuePromiseJobCallback(JSContext* cx, JS::HandleObject job, JS::HandleObject allocationSite,
                                 JS::HandleObject incumbentGlobal, void* data)
{
    PromiseState* sc = getPromiseState(cx);
    assert(job);
    return sc->jobQueue.append(job);
}

bool drainJobQueue()
{
    JSContext* cx = ScriptingCore::getInstance()->getGlobalContext();
    PromiseState* sc = getPromiseState(cx);
    if (sc->quitting || sc->drainingJobQueue)
    return true;
    
    sc->drainingJobQueue = true;
    
    JS::RootedObject job(cx);
    JS::HandleValueArray args(JS::HandleValueArray::empty());
    JS::RootedValue rval(cx);
    // Execute jobs in a loop until we've reached the end of the queue.
    // Since executing a job can trigger enqueuing of additional jobs,
    // it's crucial to re-check the queue length during each iteration.
    for (size_t i = 0; i < sc->jobQueue.length(); i++)
    {
        job = sc->jobQueue[i];
        JSAutoCompartment ac(cx, job);
        JS::Call(cx, JS::UndefinedHandleValue, job, args, &rval);
        if (JS_IsExceptionPending(cx)) {
            handlePendingException(cx);
        }
        sc->jobQueue[i].set(nullptr);
    }
    sc->jobQueue.clear();
    sc->drainingJobQueue = false;
    
    return true;
}

PromiseState::PromiseState(JSContext* cx)
: drainingJobQueue(false)
, quitting(false)
{
    drainJobsHook = Director::getInstance()->getEventDispatcher()->addCustomEventListener(Director::EVENT_AFTER_DRAW, [&](EventCustom *event) {
        drainJobQueue();
    });
    CC_SAFE_RETAIN(drainJobsHook);
}

PromiseState::~PromiseState()
{
    Director::getInstance()->getEventDispatcher()->removeEventListener(drainJobsHook);
    CC_SAFE_RELEASE(drainJobsHook);
}

// Promise support end

ScriptingCore* ScriptingCore::getInstance()
{
    static ScriptingCore* instance = nullptr;
    if (instance == nullptr)
        instance = new (std::nothrow) ScriptingCore();

    return instance;
}

ScriptingCore::ScriptingCore()
: _cx(nullptr)
, _global(nullptr)
, _debugGlobal(nullptr)
, _jsInited(false)
, _needCleanup(false)
, _callFromScript(false)
, _finalizing(nullptr)
{
    // Init global datas
    _js_global_type_map = new (std::nothrow) std::unordered_map<std::string, js_type_class_t*>();
    _native_js_global_map = new (std::nothrow) std::unordered_map<void*, js_proxy_t*>();
    _filename_script = new (std::nothrow) std::unordered_map<std::string, JS::PersistentRootedScript*>();
    
    bool ok = JS_Init();
    if (!ok) {
        CCLOG("System errno : %d", errno);
        CCASSERT(ok, "ScriptingCore: failed to initialize JS engine.");
    }
}

void ScriptingCore::string_report(JS::HandleValue val)
{
    if (val.isNull()) {
        LOGD("val : (JSVAL_IS_NULL(val)");
        // return 1;
    } else if (val.isBoolean() && false == val.toBoolean()) {
        LOGD("val : (return value is false");
        // return 1;
    } else if (val.isString()) {
        JSContext* cx = this->getGlobalContext();
        JS::RootedString str(cx, val.toString());
        if (str.get()) {
            LOGD("val : return string is NULL");
        } else {
            JSStringWrapper wrapper(str);
            LOGD("val : return string =\n%s\n", wrapper.get());
        }
    } else if (val.isNumber()) {
        double number = val.toNumber();
        LOGD("val : return number =\n%f", number);
    }
}

bool ScriptingCore::evalString(const char *string, JS::MutableHandleValue outVal, const char *filename, JSContext* cx, JS::HandleObject global)
{
    JS::PersistentRootedScript script(cx);
    
    JS::CompileOptions op(cx);
    op.setUTF8(true);
    
    std::string content = string;
    
    bool ok = false;
    bool evaluatedOK = false;
    if (!content.empty())
    {
        ok = JS::Compile(cx, op, content.c_str(), content.size(), &(script) );
    }
    if (ok) {
        evaluatedOK = JS_ExecuteScript(cx, script, outVal);
        if (false == evaluatedOK) {
            cocos2d::log("Evaluating %s failed (evaluatedOK == JS_FALSE)", content.c_str());
            handlePendingException(cx);
        }
    }
    else {
        cocos2d::log("ScriptingCore:: evaluateScript fail: %s", content.c_str());
    }
    return evaluatedOK;
}

bool ScriptingCore::evalString(const char *string, JS::MutableHandleValue outVal)
{
    JS::RootedObject global(_cx, _global->get());
    return evalString(string, outVal, nullptr, _cx, global);
}

bool ScriptingCore::evalString(const char *string)
{
    JS::RootedValue retVal(_cx);
    return evalString(string, &retVal);
}

void ScriptingCore::start()
{
    _engineStartTime = std::chrono::steady_clock::now();
    // for now just this
    createGlobalContext();
}

void ScriptingCore::addRegisterCallback(sc_register_sth callback) {
    registrationList.push_back(callback);
}

void ScriptingCore::removeAllProxys(JSContext *cx)
{
    auto it_js = _native_js_global_map->begin();
    while (it_js != _native_js_global_map->end())
    {
        // Erase hook private first in case gc access the proxy again
        auto proxy = it_js->second;
        if (proxy->obj.get())
        {
            JS::RootedObject jsObj(cx, proxy->obj);
            JS::RootedValue hook(cx);
            JS_GetProperty(cx, jsObj, "__hook", &hook);
            
            if (hook.isObject())
            {
                JSObject *hookObj = hook.toObjectOrNull();
                JS_SetPrivate(hookObj, nullptr);
            }
        }
        
        CC_SAFE_DELETE(proxy);
        it_js = _native_js_global_map->erase(it_js);
    }
    _native_js_global_map->clear();
}

void ScriptingCore::createGlobalContext() {
    if (_cx) {
        ScriptingCore::removeAllProxys(_cx);
        JS_DestroyContext(_cx);
        _cx = nullptr;
    }
    
    _cx = JS_NewContext(JS::DefaultHeapMaxBytes);
    if (nullptr == _cx)
    {
        return;
    }

    JS_SetGCParameter(_cx, JSGC_MAX_BYTES, 0xffffffff);
    JS_SetGCParameter(_cx, JSGC_MODE, JSGC_MODE_INCREMENTAL);
    JS_SetNativeStackQuota(_cx, JSB_MAX_STACK_QUOTA);
    // Waiting is allowed on the shell's main thread, for now.
    JS_SetFutexCanWait(_cx);
    JS_SetDefaultLocale(_cx, "UTF-8");
    JS::SetWarningReporter(_cx, ScriptingCore::reportError);
//    JS_SetGCCallback(_cx, on_garbage_collect, nullptr);
    
    if (!JS::InitSelfHostedCode(_cx))
    {
        return;
    }
    
    PromiseState* sc = new (std::nothrow) PromiseState(_cx);
    if (!sc)
    {
        return;
    }
    JS_SetContextPrivate(_cx, sc);
    
    JS_BeginRequest(_cx);
    
    JS::CompartmentOptions options;
    options.behaviors().setVersion(JSVERSION_LATEST);
    options.creationOptions().setSharedMemoryAndAtomicsEnabled(true);
    
#ifdef DEBUG
#ifdef JS_GC_ZEAL
    JS_SetGCZeal(_cx, 2, JS_DEFAULT_ZEAL_FREQ);
#endif
    
    JS::ContextOptionsRef(_cx)
        .setIon(false)
        .setBaseline(false)
        .setAsmJS(false)
        .setNativeRegExp(true);
#else
    JS::ContextOptionsRef(_cx)
        .setIon(true)
        .setBaseline(true)
        .setAsmJS(true)
        .setNativeRegExp(true);
#endif
    
    JS::RootedObject global(_cx, JS_NewGlobalObject(_cx, &global_class, nullptr, JS::DontFireOnNewGlobalHook, options));
    _global = new (std::nothrow) JS::PersistentRootedObject(_cx, global);
    
    _oldCompartment = JS_EnterCompartment(_cx, global);
    JS_InitStandardClasses(_cx, global);
    JS_DefineDebuggerObject(_cx, global);
    
    // Register ScriptingCore system bindings
    registerDefaultClasses(_cx, global);
    
    JS_AddWeakPointerCompartmentCallback(_cx, &jsbWeakPointerCompartmentCallback, nullptr);
    JS_FireOnNewGlobalObject(_cx, global);
    JS::SetBuildIdOp(_cx, GetBuildId);
    
    // Support promise
    sc->jobQueue.init(_cx, JobQueue(js::SystemAllocPolicy()));
    JS::SetEnqueuePromiseJobCallback(_cx, onEnqueuePromiseJobCallback);
    JS::SetGetIncumbentGlobalCallback(_cx, onGetIncumbentGlobalCallback);

    runScript("script/jsb_prepare.js");

    for (std::vector<sc_register_sth>::iterator it = registrationList.begin(); it != registrationList.end(); it++) {
        sc_register_sth callback = *it;
        callback(_cx, global);
        
        if (JS_IsExceptionPending(_cx)) {
            handlePendingException(_cx);
        }
    }
    registrationList.clear();
    
    _jsInited = true;
    _needCleanup = true;
}

static std::string RemoveFileExt(const std::string& filePath) {
    size_t pos = filePath.rfind('.');
    if (0 < pos) {
        return filePath.substr(0, pos);
    }
    else {
        return filePath;
    }
}

bool ScriptingCore::getScript(const std::string& path, JS::MutableHandleScript script)
{
    // a) check jsc file first
    std::string byteCodePath = RemoveFileExt(std::string(path)) + BYTE_CODE_FILE_EXT;
    if (_filename_script->find(byteCodePath) != _filename_script->end())
    {
        script.set((*_filename_script)[byteCodePath]->get());
        return true;
    }

    // b) no jsc file, check js file
    std::string fullPath = cocos2d::FileUtils::getInstance()->fullPathForFilename(path);
    if (_filename_script->find(fullPath) != _filename_script->end())
    {
        script.set((*_filename_script)[fullPath]->get());
        return true;
    }

    return false;
}

bool ScriptingCore::compileScript(const std::string& path, JS::HandleObject global, JS::MutableHandleScript script)
{
    if (path.empty()) {
        return false;
    }
    
    bool ok = getScript(path, script);
    if (ok) {
        return true;
    }

    cocos2d::FileUtils *futil = cocos2d::FileUtils::getInstance();
    bool isPopupNotify = futil->isPopupNotify();
    futil->setPopupNotify(false);

    JS::RootedObject obj(_cx, global);
    bool compileSucceed = false;

    // a) check jsc file first
    std::string byteCodePath = RemoveFileExt(std::string(path)) + BYTE_CODE_FILE_EXT;

    // Check whether '.jsc' files exist to avoid outputting log which says 'couldn't find .jsc file'.
    if (futil->isFileExist(byteCodePath))
    {
        Data data = futil->getDataFromFile(byteCodePath);
        if (!data.isNull())
        {
            JS::TranscodeBuffer buffer;
            bool appended = buffer.append((uint8_t*)data.getBytes(), data.getSize());
            JS::TranscodeResult result = JS::DecodeScript(_cx, buffer, script);
            if (appended && result == JS::TranscodeResult::TranscodeResult_Ok)
            {
                compileSucceed = true;
                (*_filename_script)[byteCodePath] = new (std::nothrow) JS::PersistentRootedScript(_cx, script.get());
            }
        }
    }
    futil->setPopupNotify(isPopupNotify);

    // b) no jsc file, check js file
    if (!compileSucceed)
    {
        /* Clear any pending exception from previous failed decoding.  */
        ReportException(_cx);

        JS::CompileOptions op(_cx);
        op.setUTF8(true);
        std::string fullPath = futil->fullPathForFilename(path);
        op.setFileAndLine(fullPath.c_str(), 1);

        ok = false;
        std::string jsFileContent = futil->getStringFromFile(fullPath);
        if (!jsFileContent.empty())
        {
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
            ok = JS::Compile(_cx, op, jsFileContent.c_str(), jsFileContent.size(), script);
#else
            ok = JS::Compile(_cx, op, fullPath.c_str(), script);
#endif
        }
        if (ok) {
            compileSucceed = true;
            (*_filename_script)[fullPath] = new (std::nothrow) JS::PersistentRootedScript(_cx, script.get());
        }
    }
    
    if (JS_IsExceptionPending(_cx)) {
        handlePendingException(_cx);
    }
    
    if (compileSucceed) {
        return true;
    } else {
        LOGD("ScriptingCore::compileScript fail:%s", path.c_str());
        return false;
    }
}

void ScriptingCore::cleanScript(const char *path)
{
    std::string byteCodePath = RemoveFileExt(std::string(path)) + BYTE_CODE_FILE_EXT;
    auto it = _filename_script->find(byteCodePath);
    if (it != _filename_script->end())
    {
        _filename_script->erase(it);
    }

    std::string fullPath = cocos2d::FileUtils::getInstance()->fullPathForFilename(path);
    it = _filename_script->find(fullPath);
    if (it != _filename_script->end())
    {
        _filename_script->erase(it);
    }
}

std::unordered_map<std::string, JS::PersistentRootedScript*>* ScriptingCore::getFileScript()
{
    return _filename_script;
}

void ScriptingCore::cleanAllScript()
{
    _filename_script->clear();
}

bool ScriptingCore::runScript(const std::string& path)
{
    JS::RootedObject global(_cx, _global->get());
    return runScript(path, global, _cx);
}

bool ScriptingCore::runScript(const std::string& path, JS::HandleObject global, JSContext* cx)
{
    if (cx == nullptr) {
        cx = _cx;
    }
    
    JS::RootedScript script(cx);
    bool ok = compileScript(path, global, &script);
    if (ok) {
        JS::RootedValue rval(cx);
        ok = JS_ExecuteScript(cx, script, &rval);
        if (false == ok) {
            cocos2d::log("Evaluating %s failed (evaluatedOK == JS_FALSE)", path.c_str());
            handlePendingException(cx);
        }
    }

    return ok;
}

bool ScriptingCore::requireScript(const char *path, JS::MutableHandleValue jsvalRet)
{
    JS::RootedObject global(_cx, _global->get());
    return requireScript(path, global, _cx, jsvalRet);
}

bool ScriptingCore::requireScript(const char *path, JS::HandleObject global, JSContext* cx, JS::MutableHandleValue jsvalRet)
{
    if (cx == nullptr)
    {
        cx = _cx;
    }

    JS::RootedScript script(cx);
    bool ok = compileScript(path, global, &script);

    if (ok)
    {
        ok = JS_ExecuteScript(cx, script, jsvalRet);
        if (!ok)
        {
            cocos2d::log("(evaluatedOK == JS_FALSE)");
            handlePendingException(cx);
        }
    }

    return ok;
}

void ScriptingCore::reset()
{
    Director::getInstance()->getEventDispatcher()->dispatchCustomEvent(EVENT_RESET);
    
    // Cleanup js objects
    JS::RootedObject global(_cx, _global->get());
    JS::RootedValue globalVal(_cx, JS::ObjectOrNullValue(global));
    executeFunctionWithOwner(globalVal, "__cleanup", JS::HandleValueArray::empty());
    
    Director::getInstance()->restart();
}

void ScriptingCore::restartVM()
{
    cleanup();
    Application::getInstance()->applicationDidFinishLaunching();
}

ScriptingCore::~ScriptingCore()
{
    cleanup();
    JS_ShutDown();
    
    // clear datas
    CC_SAFE_DELETE(_js_global_type_map);
    CC_SAFE_DELETE(_native_js_global_map);
    CC_SAFE_DELETE(_filename_script);
}

void ScriptingCore::cleanup()
{
    if (!_needCleanup) {
        return;
    }
    
    localStorageFree();
    
    // clear http client callbacks
    network::HttpClient::destroyInstance();
    
    // Clear all cached script
    cleanAllScript();
    
    // Cleanup jsb type map
    for (auto iter = _js_global_type_map->begin(); iter != _js_global_type_map->end(); ++iter)
    {
        CC_SAFE_DELETE(iter->second->proto);
        free(iter->second);
    }
    _js_global_type_map->clear();
    
    // Release promise state
    auto sc = getPromiseState(_cx);
    sc->quitting = true;
    delete sc;
    
    // force gc
    JS_GC(_cx);
    PoolManager::getInstance()->getCurrentPool()->clear();
    CC_SAFE_DELETE(_global);
    JS_GC(_cx);
    JS_GC(_cx);
    
    // Remove tracker to object ref, remove all jsb objects proxy
    JS_RemoveWeakPointerCompartmentCallback(_cx, jsbWeakPointerCompartmentCallback);
    removeAllProxys(_cx);

    // Remove log buf
    if (_js_log_buf) {
        free(_js_log_buf);
        _js_log_buf = nullptr;
    }

    if (_cx)
    {
        JS_LeaveCompartment(_cx, _oldCompartment);
        JS::SetGetIncumbentGlobalCallback(_cx, nullptr);
        JS::SetEnqueuePromiseJobCallback(_cx, nullptr);
        JS_EndRequest(_cx);
        JS_DestroyContext(_cx);
    }
    
    _cx = nullptr;
    _global = nullptr;
    _oldCompartment = nullptr;
    _needCleanup = false;
}

void ScriptingCore::reportError(JSContext *cx, JSErrorReport *report)
{
    if (cx && report)
    {
        std::string fileName = report->filename ? report->filename : "<no filename=\"filename\">";
        int32_t lineno = report->lineno;
        std::string msg = report->message().c_str();

#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
        __android_log_print(ANDROID_LOG_ERROR, "cocos js error:", "%s line:%u msg:%s",
                            fileName.c_str(), report->lineno, msg.c_str());
#else
        cocos2d::log("%s:%u:%s\n", fileName.c_str(), report->lineno, msg.c_str());
#endif
        // Should clear pending exception, otherwise it will trigger infinite loop
        if (JS_IsExceptionPending(cx)) {
            JS_ClearPendingException(cx);
        }
        
        JS::AutoValueVector valArr(cx);
        JS::RootedValue argv(cx);
        std_string_to_jsval(cx, fileName, &argv);
        valArr.append(argv);
        valArr.append(JS::Int32Value(lineno));
        std_string_to_jsval(cx, msg, &argv);
        valArr.append(argv);
        JS::HandleValueArray args(valArr);
        
        JS::RootedValue rval(cx);
        JS::RootedValue global(cx, JS::ObjectOrNullValue(getInstance()->getGlobalObject()));
        getInstance()->executeFunctionWithOwner(global, "__errorHandler", args, &rval);
    }
};


bool ScriptingCore::log(JSContext* cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
#if COCOS2D_DEBUG
    if (argc > 0) {
        JS::RootedString string(cx, args.get(0).toString());
        if (string) {
            JSStringWrapper wrapper(string);
            js_log("%s", wrapper.get());
        }
    }
#endif
    args.rval().setUndefined();
    return true;
}


void ScriptingCore::retainScriptObject(cocos2d::Ref* owner, cocos2d::Ref* target)
{
    if (!_global)
    {
        return;
    }
    JS::RootedObject global(_cx, _global->get());
    JS::RootedObject jsbObj(_cx);
    get_or_create_js_obj(_cx, global, "jsb", &jsbObj);
    JS::RootedValue jsbVal(_cx, JS::ObjectOrNullValue(jsbObj));
    if (jsbVal.isNullOrUndefined())
    {
        return;
    }

    js_proxy_t *pOwner = jsb_get_native_proxy(owner);
    js_proxy_t *pTarget = jsb_get_native_proxy(target);
    if (!pOwner || !pTarget)
    {
        return;
    }
    JS::RootedValue valOwner(_cx, JS::ObjectOrNullValue(pOwner->obj));
    JS::RootedValue valTarget(_cx, JS::ObjectOrNullValue(pTarget->obj));
    if (valTarget.isPrimitive())
    {
        return;
    }

    JS::RootedValue retval(_cx);
    JS::AutoValueVector valArr(_cx);
    valArr.append(valOwner);
    valArr.append(valTarget);
    JS::HandleValueArray args(valArr);

    executeFunctionWithOwner(jsbVal, "registerNativeRef", args, &retval);
}

void ScriptingCore::rootScriptObject(cocos2d::Ref* target)
{
    if (!_global)
    {
        return;
    }
    JS::RootedObject global(_cx, _global->get());
    JS::RootedObject jsbObj(_cx);
    get_or_create_js_obj(_cx, global, "jsb", &jsbObj);
    JS::RootedValue jsbVal(_cx, JS::ObjectOrNullValue(jsbObj));
    if (jsbVal.isNullOrUndefined())
    {
        return;
    }
    js_proxy_t *pTarget = jsb_get_native_proxy(target);
    if (!pTarget)
    {
        return;
    }
    JS::RootedValue valTarget(_cx, JS::ObjectOrNullValue(pTarget->obj));
    if (valTarget.isPrimitive())
    {
        return;
    }

    JS::RootedObject root(_cx);
    get_or_create_js_obj(_cx, jsbObj, "_root", &root);
    JS::RootedValue valRoot(_cx, JS::ObjectOrNullValue(root));

    JS::RootedValue retval(_cx);
    JS::AutoValueVector valArr(_cx);
    valArr.append(valRoot);
    valArr.append(valTarget);
    JS::HandleValueArray args(valArr);

    executeFunctionWithOwner(jsbVal, "registerNativeRef", args, &retval);
}

void ScriptingCore::releaseScriptObject(cocos2d::Ref* owner, cocos2d::Ref* target)
{
    JS::RootedObject global(_cx, _global->get());
    JS::RootedObject jsbObj(_cx);
    get_or_create_js_obj(_cx, global, "jsb", &jsbObj);
    JS::RootedValue jsbVal(_cx, JS::ObjectOrNullValue(jsbObj));
    if (jsbVal.isNullOrUndefined())
    {
        return;
    }

    js_proxy_t *pOwner = jsb_get_native_proxy(owner);
    js_proxy_t *pTarget = jsb_get_native_proxy(target);
    if (!pOwner || !pTarget)
    {
        return;
    }
    JS::RootedValue valOwner(_cx, JS::ObjectOrNullValue(pOwner->obj));
    JS::RootedValue valTarget(_cx, JS::ObjectOrNullValue(pTarget->obj));
    if (valTarget.isPrimitive())
    {
        return;
    }

    JS::RootedValue retval(_cx);
    JS::AutoValueVector valArr(_cx);
    valArr.append(valOwner);
    valArr.append(valTarget);
    JS::HandleValueArray args(valArr);

    executeFunctionWithOwner(jsbVal, "unregisterNativeRef", args, &retval);
}

void ScriptingCore::unrootScriptObject(cocos2d::Ref* target)
{
    JS::RootedObject global(_cx, _global->get());
    JS::RootedObject jsbObj(_cx);
    get_or_create_js_obj(_cx, global, "jsb", &jsbObj);
    JS::RootedValue jsbVal(_cx, JS::ObjectOrNullValue(jsbObj));
    if (jsbVal.isNullOrUndefined())
    {
        return;
    }
    js_proxy_t *pTarget = jsb_get_native_proxy(target);
    if (!pTarget)
    {
        return;
    }
    JS::RootedValue valTarget(_cx, JS::ObjectOrNullValue(pTarget->obj));
    if (valTarget.isPrimitive())
    {
        return;
    }

    JS::RootedObject root(_cx);
    get_or_create_js_obj(_cx, jsbObj, "_root", &root);
    JS::RootedValue valRoot(_cx, JS::ObjectOrNullValue(root));

    JS::RootedValue retval(_cx);
    JS::AutoValueVector valArr(_cx);
    valArr.append(valRoot);
    valArr.append(valTarget);
    JS::HandleValueArray args(valArr);

    executeFunctionWithOwner(jsbVal, "unregisterNativeRef", args, &retval);
}

void ScriptingCore::releaseAllChildrenRecursive(cocos2d::Node *node)
{
    const Vector<Node*>& children = node->getChildren();
    for (auto child : children)
    {
        releaseScriptObject(node, child);
        releaseAllChildrenRecursive(child);
    }
}

void ScriptingCore::releaseAllNativeRefs(cocos2d::Ref* owner)
{
    JS::RootedObject global(_cx, _global->get());
    JS::RootedObject jsbObj(_cx);
    get_or_create_js_obj(_cx, global, "jsb", &jsbObj);
    JS::RootedValue jsbVal(_cx, JS::ObjectOrNullValue(jsbObj));
    if (jsbVal.isNullOrUndefined())
    {
        return;
    }

    js_proxy_t *pOwner = jsb_get_native_proxy(owner);
    if (!pOwner)
    {
        return;
    }
    JS::RootedValue valOwner(_cx, JS::ObjectOrNullValue(pOwner->obj));

    JS::RootedValue retval(_cx);
    JS::HandleValueArray args(valOwner);
    executeFunctionWithOwner(jsbVal, "unregisterAllNativeRefs", args, &retval);
}


void ScriptingCore::removeScriptObjectByObject(Ref* pObj)
{
    auto proxy = jsb_get_native_proxy(pObj);
    if (proxy)
    {
//        JSContext *cx = getGlobalContext();
//        JS::RemoveObjectRoot(cx, &proxy->obj);
        jsb_remove_proxy(proxy);
    }
}

bool ScriptingCore::executeScript(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    ScriptingCore *engine = ScriptingCore::getInstance();
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc >= 1) {
        JS::RootedValue jsstr(cx, args.get(0));
        JS::RootedString str(cx, jsstr.toString());
        JSStringWrapper path(str);
        bool res = false;
        JS::RootedValue jsret(cx);
        if (argc == 2 && args.get(1).isString()) {
            JS::RootedString globalName(cx, args.get(1).toString());
            JSStringWrapper name(globalName);

            JS::RootedObject debugObj(cx, engine->getDebugGlobal());
            if (debugObj) {
                res = engine->requireScript(path.get(), debugObj, cx, &jsret);
            } else {
                JS_ReportErrorUTF8(cx, "Invalid global object: %s", name.get());
                args.rval().setUndefined();
                return false;
            }
        } else {
            JS::RootedObject glob(cx, JS::CurrentGlobalOrNull(cx));
            res = engine->requireScript(path.get(), glob, cx, &jsret);
        }
        args.rval().set(jsret);
        return res;
    }
    args.rval().setUndefined();
    return true;
}

bool ScriptingCore::forceGC(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS_GC(cx);
    return true;
}

bool ScriptingCore::dumpRoot(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    // JS_DumpNamedRoots is only available on DEBUG versions of SpiderMonkey.
    // Mac and Simulator versions were compiled with DEBUG.
#if COCOS2D_DEBUG
//    JSContext *_cx = ScriptingCore::getInstance()->getGlobalContext();
//    JSRuntime *rt = JS_GetRuntime(_cx);
//    JS_DumpNamedRoots(rt, dumpNamedRoot, NULL);
//    JS_DumpHeap(rt, stdout, NULL, JSTRACE_OBJECT, NULL, 2, NULL);
#endif
    return true;
}

void ScriptingCore::pauseSchedulesAndActions(js_proxy_t* p)
{
    JS::RootedObject obj(_cx, p->obj.get());
    auto arr = JSScheduleWrapper::getTargetForJSObject(_cx, obj);
    if (! arr) return;

    Node* node = (Node*)p->ptr;
    for(ssize_t i = 0; i < arr->size(); ++i) {
        if (arr->at(i)) {
            node->getScheduler()->pauseTarget(arr->at(i));
        }
    }
}


void ScriptingCore::resumeSchedulesAndActions(js_proxy_t* p)
{
    JS::RootedObject obj(_cx, p->obj.get());
    auto arr = JSScheduleWrapper::getTargetForJSObject(_cx, obj);
    if (!arr) return;

    Node* node = (Node*)p->ptr;
    for(ssize_t i = 0; i < arr->size(); ++i) {
        if (!arr->at(i)) continue;
        node->getScheduler()->resumeTarget(arr->at(i));
    }
}

void ScriptingCore::cleanupSchedulesAndActions(js_proxy_t* p)
{
    JS::RootedObject obj(_cx, p->obj.get());
    auto targetArray = JSScheduleWrapper::getTargetForJSObject(_cx, obj);
    if (targetArray)
    {
        Node* node = (Node*)p->ptr;
        auto scheduler = node->getScheduler();
        for (auto&& target : *targetArray)
        {
            scheduler->unscheduleAllForTarget(target);
        }

        JSScheduleWrapper::removeAllTargetsForJSObject(_cx, obj);
    }
}

bool ScriptingCore::isFunctionOverridedInJS(JS::HandleObject obj, const std::string& name, JSNative native)
{
    JS::RootedObject jsobj(_cx, obj);
    JS::RootedValue value(_cx);
    bool ok = JS_GetProperty(_cx, jsobj, name.c_str(), &value);
    if (ok && !value.isNullOrUndefined() && !JS_IsNativeFunction(value.toObjectOrNull(), native))
    {
        return true;
    }

    return false;
}

int ScriptingCore::handleActionEvent(void* data)
{
    if (NULL == data)
        return 0;

    ActionObjectScriptData* actionObjectScriptData = static_cast<ActionObjectScriptData*>(data);
    if (NULL == actionObjectScriptData->nativeObject || NULL == actionObjectScriptData->eventType)
        return 0;

    Action* actionObject = static_cast<Action*>(actionObjectScriptData->nativeObject);
    int eventType = *((int*)(actionObjectScriptData->eventType));

    js_proxy_t * p = jsb_get_native_proxy(actionObject);
    if (!p) return 0;

    int ret = 0;
    JS::RootedValue retval(_cx);

    if (eventType == kActionUpdate)
    {
        JS::RootedObject jstarget(_cx, p->obj);
        if (isFunctionOverridedInJS(jstarget, "update", js_cocos2dx_Action_update))
        {
            JS::RootedValue dataVal(_cx, JS::DoubleValue(*((float *)actionObjectScriptData->param)));
            JS::HandleValueArray args(dataVal);
            JS::RootedValue objVal(_cx, JS::ObjectOrNullValue(p->obj));
            ret = executeFunctionWithOwner(objVal, "update", args, &retval);
        }
    }
    return ret;
}

int ScriptingCore::handleNodeEvent(void* data)
{
    if (NULL == data)
        return 0;

    BasicScriptData* basicScriptData = static_cast<BasicScriptData*>(data);
    if (NULL == basicScriptData->nativeObject || NULL == basicScriptData->value)
        return 0;

    Node* node = static_cast<Node*>(basicScriptData->nativeObject);
    int action = *((int*)(basicScriptData->value));

    js_proxy_t * p = jsb_get_native_proxy(node);
    if (!p) return 0;

    int ret = 0;
    JS::RootedValue retval(_cx);
    JS::RootedValue dataVal(_cx, JS::Int32Value(1));
    JS::HandleValueArray args(dataVal);

    JS::RootedObject jstarget(_cx, p->obj);
    JS::RootedValue targetVal(_cx, JS::ObjectOrNullValue(p->obj));
    if (action == kNodeOnEnter)
    {
        if (isFunctionOverridedInJS(jstarget, "onEnter", js_cocos2dx_Node_onEnter))
        {
            ret = executeFunctionWithOwner(targetVal, "onEnter", args, &retval);
        }
        resumeSchedulesAndActions(p);
    }
    else if (action == kNodeOnExit)
    {
        if (isFunctionOverridedInJS(jstarget, "onExit", js_cocos2dx_Node_onExit))
        {
            ret = executeFunctionWithOwner(targetVal, "onExit", args, &retval);
        }
        pauseSchedulesAndActions(p);
    }
    else if (action == kNodeOnEnterTransitionDidFinish)
    {
        if (isFunctionOverridedInJS(jstarget, "onEnterTransitionDidFinish", js_cocos2dx_Node_onEnterTransitionDidFinish))
        {
            ret = executeFunctionWithOwner(targetVal, "onEnterTransitionDidFinish", args, &retval);
        }
    }
    else if (action == kNodeOnExitTransitionDidStart)
    {
        if (isFunctionOverridedInJS(jstarget, "onExitTransitionDidStart", js_cocos2dx_Node_onExitTransitionDidStart))
        {
            ret = executeFunctionWithOwner(targetVal, "onExitTransitionDidStart", args, &retval);
        }
    }
    else if (action == kNodeOnCleanup) {
        cleanupSchedulesAndActions(p);

        if (isFunctionOverridedInJS(jstarget, "cleanup", js_cocos2dx_Node_cleanup))
        {
            ret = executeFunctionWithOwner(targetVal, "cleanup", args, &retval);
        }
    }

    return ret;
}

int ScriptingCore::handleComponentEvent(void* data)
{
    if (NULL == data)
        return 0;

    BasicScriptData* basicScriptData = static_cast<BasicScriptData*>(data);
    if (NULL == basicScriptData->nativeObject || NULL == basicScriptData->value)
        return 0;

    Component* node = static_cast<Component*>(basicScriptData->nativeObject);
    int action = *((int*)(basicScriptData->value));

    js_proxy_t * p = jsb_get_native_proxy(node);
    if (!p) return 0;

    int ret = 0;
    JS::RootedValue retval(_cx);
    JS::RootedValue dataVal(_cx, JS::Int32Value(1));
    JS::HandleValueArray args(dataVal);
    JS::RootedValue nodeValue(_cx, JS::ObjectOrNullValue(p->obj));

    if (action == kComponentOnAdd)
    {
        ret = executeFunctionWithOwner(nodeValue, "onAdd", args, &retval);
    }
    else if (action == kComponentOnRemove)
    {
        ret = executeFunctionWithOwner(nodeValue, "onRemove", args, &retval);
    }
    else if (action == kComponentOnEnter)
    {
        ret = executeFunctionWithOwner(nodeValue, "onEnter", args, &retval);
        resumeSchedulesAndActions(p);
    }
    else if (action == kComponentOnExit)
    {
        ret = executeFunctionWithOwner(nodeValue, "onExit", args, &retval);
        pauseSchedulesAndActions(p);
    }
    else if (action == kComponentOnUpdate)
    {
        ret = executeFunctionWithOwner(nodeValue, "update", args, &retval);
    }

    return ret;
}

bool ScriptingCore::handleTouchesEvent(void* nativeObj, cocos2d::EventTouch::EventCode eventCode, const std::vector<cocos2d::Touch*>& touches, cocos2d::Event* event)
{
    JS::RootedValue ret(_cx);
    return handleTouchesEvent(nativeObj, eventCode, touches, event, &ret);
}

bool ScriptingCore::handleTouchesEvent(void* nativeObj, cocos2d::EventTouch::EventCode eventCode, const std::vector<cocos2d::Touch*>& touches, cocos2d::Event* event, JS::MutableHandleValue jsvalRet)
{
    bool ret = false;
    std::string funcName = getTouchesFuncName(eventCode);
    JS::RootedObject jsretArr(_cx, JS_NewArrayObject(_cx, 0));
    int count = 0;

    for (const auto& touch : touches)
    {
        JS::RootedObject touchObj(_cx);
        JS::RootedObject proto(_cx, jsb_cocos2d_Touch_prototype->get());
        jsb_get_or_create_weak_jsobject(_cx, touch, jsb_cocos2d_Touch_class, proto, &touchObj, "Touch");
        JS::RootedValue jsret(_cx, JS::ObjectOrNullValue(touchObj));
        if (!JS_SetElement(_cx, jsretArr, count, jsret))
        {
            break;
        }
        ++count;
    }

    js_proxy_t* p = jsb_get_native_proxy(nativeObj);
    if (p)
    {
        JS::RootedObject eventObj(_cx);
        JS::RootedObject proto(_cx, jsb_cocos2d_EventTouch_prototype->get());
        jsb_get_or_create_weak_jsobject(_cx, event, jsb_cocos2d_EventTouch_class, proto, &eventObj, "EventTouch");
        JS::RootedValue eventVal(_cx, JS::ObjectOrNullValue(eventObj));
        
        JS::AutoValueVector valArr(_cx);
        valArr.append(JS::ObjectOrNullValue(jsretArr));
        valArr.append(eventVal);
        JS::HandleValueArray args(valArr);
        JS::RootedValue objVal(_cx, JS::ObjectOrNullValue(p->obj));
        
        ret = executeFunctionWithOwner(objVal, funcName.c_str(), args, jsvalRet);
    }

    return ret;
}

bool ScriptingCore::handleTouchEvent(void* nativeObj, cocos2d::EventTouch::EventCode eventCode, cocos2d::Touch* touch, cocos2d::Event* event)
{
    JS::RootedValue ret(_cx);
    return handleTouchEvent(nativeObj, eventCode, touch, event, &ret);
}

bool ScriptingCore::handleTouchEvent(void* nativeObj, cocos2d::EventTouch::EventCode eventCode, cocos2d::Touch* touch, cocos2d::Event* event, JS::MutableHandleValue jsvalRet)
{
    std::string funcName = getTouchFuncName(eventCode);
    bool ret = false;

    js_proxy_t * p = jsb_get_native_proxy(nativeObj);
    if (p)
    {
        JS::RootedObject touchObj(_cx);
        JS::RootedObject proto(_cx, jsb_cocos2d_Touch_prototype->get());
        jsb_get_or_create_weak_jsobject(_cx, touch, jsb_cocos2d_Touch_class, proto, &touchObj, "Touch");
        
        JS::RootedObject eventObj(_cx);
        proto.set(jsb_cocos2d_EventTouch_prototype->get());
        jsb_get_or_create_weak_jsobject(_cx, event, jsb_cocos2d_EventTouch_class, proto, &eventObj, "EventTouch");
        JS::RootedValue eventVal(_cx, JS::ObjectOrNullValue(eventObj));
        
        JS::AutoValueVector valArr(_cx);
        valArr.append(JS::ObjectOrNullValue(touchObj));
        valArr.append(eventVal);
        JS::HandleValueArray args(valArr);
        JS::RootedValue objVal(_cx, JS::ObjectOrNullValue(p->obj));

        ret = executeFunctionWithOwner(objVal, funcName.c_str(), args, jsvalRet);
    }

    return ret;
}

bool ScriptingCore::handleMouseEvent(void* nativeObj, cocos2d::EventMouse::MouseEventType eventType, cocos2d::Event* event)
{
    JS::RootedValue ret(_cx);
    return handleMouseEvent(nativeObj, eventType, event, &ret);
}

bool ScriptingCore::handleMouseEvent(void* nativeObj, cocos2d::EventMouse::MouseEventType eventType, cocos2d::Event* event, JS::MutableHandleValue jsvalRet)
{
    std::string funcName = getMouseFuncName(eventType);
    bool ret = false;

    js_proxy_t * p = jsb_get_native_proxy(nativeObj);
    if (p)
    {
        JS::RootedObject eventObj(_cx);
        JS::RootedObject proto(_cx, jsb_cocos2d_EventMouse_prototype->get());
        jsb_get_or_create_weak_jsobject(_cx, event, jsb_cocos2d_EventMouse_class, proto, &eventObj);
        JS::RootedValue eventVal(_cx, JS::ObjectOrNullValue(eventObj));
        
        JS::HandleValueArray args(eventVal);
        JS::RootedValue objVal(_cx, JS::ObjectOrNullValue(p->obj));
        ret = executeFunctionWithOwner(objVal, funcName.c_str(), args, jsvalRet);
    }
    else CCLOG("ScriptingCore::handleMouseEvent native proxy NOT found");

    return ret;
}

bool ScriptingCore::executeFunctionWithObjectData(void* nativeObj, const char *name, JS::HandleValue data)
{
    js_proxy_t * p = jsb_get_native_proxy(nativeObj);
    if (!p) return false;

    JS::RootedValue retval(_cx);
    JS::RootedValue dataVal(_cx, data);
    JS::HandleValueArray args(dataVal);
    JS::RootedValue objVal(_cx, JS::ObjectOrNullValue(p->obj));

    executeFunctionWithOwner(objVal, name, args, &retval);
    if (retval.isNull()) {
        return false;
    }
    else if (retval.isBoolean()) {
        return retval.toBoolean();
    }
    return false;
}

bool ScriptingCore::executeFunctionWithOwner(JS::HandleValue owner, const char *name, const JS::HandleValueArray& args)
{
    JS::RootedValue ret(_cx);
    return executeFunctionWithOwner(owner, name, args, &ret);
}

bool ScriptingCore::executeFunctionWithOwner(JS::HandleValue owner, const char *name, const JS::HandleValueArray& args, JS::MutableHandleValue retVal)
{
    bool bRet = false;
    bool hasFunc;
    JSContext* cx = this->_cx;
    JS::RootedValue funcVal(cx);
    JS::RootedValue ownerval(cx, owner);
    JS::RootedObject obj(cx);
    if (ownerval.isObject())
        obj = ownerval.toObjectOrNull();

    do
    {
        if (JS_HasProperty(cx, obj, name, &hasFunc) && hasFunc) {
            if (!JS_GetProperty(cx, obj, name, &funcVal)) {
                break;
            }
            if (funcVal.isNullOrUndefined()) {
                break;
            }

            bRet = JS_CallFunctionValue(cx, obj, funcVal, args, retVal);
            if (JS_IsExceptionPending(cx)) {
                handlePendingException(cx);
            }
        }
    }while(0);
    return bRet;
}

std::chrono::steady_clock::time_point ScriptingCore::getEngineStartTime() const
{
	return _engineStartTime;
}


bool ScriptingCore::handleKeyboardEvent(void* nativeObj, cocos2d::EventKeyboard::KeyCode keyCode, bool isPressed, cocos2d::Event* event)
{
    js_proxy_t * p = jsb_get_native_proxy(nativeObj);
    if (nullptr == p)
        return false;
    
    JS::RootedObject listener(_cx, p->obj);

    bool ret = false;

    JS::AutoValueVector valArr(_cx);
    valArr.append( JS::Int32Value((int32_t)keyCode));
    JS::RootedObject eventObj(_cx);
    JS::RootedObject proto(_cx, jsb_cocos2d_EventKeyboard_prototype->get());
    jsb_get_or_create_weak_jsobject(_cx, event, jsb_cocos2d_EventKeyboard_class, proto, &eventObj, "EventKeyboard");
    valArr.append( JS::ObjectOrNullValue(eventObj));
    JS::HandleValueArray args(valArr);
    JS::RootedValue objVal(_cx, JS::ObjectOrNullValue(p->obj));

    if (isPressed)
    {
        ret = executeFunctionWithOwner(objVal, "_onKeyPressed", args);
    }
    else
    {
        ret = executeFunctionWithOwner(objVal, "_onKeyReleased", args);
    }
    return ret;
}

bool ScriptingCore::handleFocusEvent(void* nativeObj, cocos2d::ui::Widget* widgetLoseFocus, cocos2d::ui::Widget* widgetGetFocus)
{
    js_proxy_t * p = jsb_get_native_proxy(nativeObj);
    if (nullptr == p)
        return false;
    
    JS::RootedObject proto(_cx, jsb_cocos2d_ui_Widget_prototype->get());
    
    JS::AutoValueVector valArr(_cx);
    JS::RootedObject widgetObj(_cx);
    jsb_get_or_create_weak_jsobject(_cx, widgetLoseFocus, jsb_cocos2d_ui_Widget_class, proto, &widgetObj, "cocos2d::ui::Widget");
    valArr.append(JS::ObjectOrNullValue(widgetObj));
    jsb_get_or_create_weak_jsobject(_cx, widgetGetFocus, jsb_cocos2d_ui_Widget_class, proto, &widgetObj, "cocos2d::ui::Widget");
    valArr.append(JS::ObjectOrNullValue(widgetObj));
    JS::HandleValueArray args(valArr);
    JS::RootedValue objVal(_cx, JS::ObjectOrNullValue(p->obj));

    bool ret = executeFunctionWithOwner(objVal, "onFocusChanged", args);

    return ret;
}


int ScriptingCore::executeCustomTouchesEvent(EventTouch::EventCode eventType,
                                       const std::vector<Touch*>& touches, JS::HandleObject obj)
{
    std::string funcName = getTouchesFuncName(eventType);

    JS::RootedObject jsretArr(_cx, JS_NewArrayObject(_cx, 0));
    JS::RootedValue jsval(_cx);
    int count = 0;
    for (auto& touch : touches)
    {
        JS::RootedObject touchObj(_cx);
        JS::RootedObject proto(_cx, jsb_cocos2d_Touch_prototype->get());
        jsb_get_or_create_weak_jsobject(_cx, touch, jsb_cocos2d_Touch_class, proto, &touchObj, "Touch");
        jsval = JS::ObjectOrNullValue(touchObj);
        if (!JS_SetElement(this->_cx, jsretArr, count, jsval)) {
            break;
        }
        ++count;
    }
    JS::RootedValue retArrVal(_cx, JS::ObjectOrNullValue(jsretArr));
    JS::HandleValueArray args(retArrVal);
    JS::RootedValue objVal(_cx, JS::ObjectOrNullValue(obj));

    executeFunctionWithOwner(objVal, funcName.c_str(), args);
    return 1;
}


int ScriptingCore::executeCustomTouchEvent(EventTouch::EventCode eventType, Touch *touch, JS::HandleObject obj)
{
    JS::RootedValue retval(_cx);
    std::string funcName = getTouchFuncName(eventType);
    JS::RootedObject touchObj(_cx);
    JS::RootedObject proto(_cx, jsb_cocos2d_Touch_prototype->get());
    jsb_get_or_create_weak_jsobject(_cx, touch, jsb_cocos2d_Touch_class, proto, &touchObj, "Touch");
    JS::RootedValue arg(_cx, JS::ObjectOrNullValue(touchObj));
    JS::HandleValueArray args(arg);
    JS::RootedValue objVal(_cx, JS::ObjectOrNullValue(obj));

    executeFunctionWithOwner(objVal, funcName.c_str(), args, &retval);
    return 1;
}

int ScriptingCore::executeCustomTouchEvent(EventTouch::EventCode eventType,
                                           Touch *touch, JS::HandleObject obj,
                                           JS::MutableHandleValue retval)
{    
    std::string funcName = getTouchFuncName(eventType);
    JS::RootedObject touchObj(_cx);
    JS::RootedObject proto(_cx, jsb_cocos2d_Touch_prototype->get());
    jsb_get_or_create_weak_jsobject(_cx, touch, jsb_cocos2d_Touch_class, proto, &touchObj, "Touch");
    JS::RootedValue arg(_cx, JS::ObjectOrNullValue(touchObj));
    JS::HandleValueArray args(arg);
    JS::RootedValue objVal(_cx, JS::ObjectOrNullValue(obj));

    executeFunctionWithOwner(objVal, funcName.c_str(), args, retval);
    return 1;
}

int ScriptingCore::executeGlobalFunction(const char* functionName)
{    
    std::string evalStr = functionName;
    JS::RootedValue globalVal(_cx, JS::ObjectOrNullValue(_global->get()));
    return executeFunctionWithOwner(globalVal, functionName, JS::HandleValueArray::empty());
}

int ScriptingCore::sendEvent(ScriptEvent* evt)
{
    if (NULL == evt)
        return 0;

    if (evt->type == kRestartGame)
    {
        restartVM();
        return 0;
    }

    switch (evt->type)
    {
        case kNodeEvent:
            {
                return handleNodeEvent(evt->data);
            }
            break;
        case kScriptActionEvent:
            {
                return handleActionEvent(evt->data);
            }
            break;
        case kMenuClickedEvent:
            break;
        case kTouchEvent:
            {
                TouchScriptData* data = (TouchScriptData*)evt->data;
                return handleTouchEvent(data->nativeObject, data->actionType, data->touch, data->event);
            }
            break;
        case kTouchesEvent:
            {
                TouchesScriptData* data = (TouchesScriptData*)evt->data;
                return handleTouchesEvent(data->nativeObject, data->actionType, data->touches, data->event);
            }
            break;
        case kComponentEvent:
            {
                return handleComponentEvent(evt->data);
            }
            break;
        default:
            CCASSERT(false, "Invalid script event.");
            break;
    }

    return 0;
}

bool ScriptingCore::parseConfig(ConfigType type, const std::string &str)
{
    JS::AutoValueVector valArr(_cx);
    valArr.append(JS::Int32Value(static_cast<int>(type)));
    JS::RootedValue argv(_cx);
    std_string_to_jsval(_cx, str, &argv);
    valArr.append(argv);
    JS::HandleValueArray args(valArr);
    JS::RootedValue globalVal(_cx, JS::ObjectOrNullValue(_global->get()));
    return (true == executeFunctionWithOwner(globalVal, "__onParseConfig", args));
}

bool ScriptingCore::isObjectValid(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    args.rval().set(JS::FalseHandleValue);
    if (argc >= 1) {
        if (args.get(0).isObject()) {
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            js_proxy_t *proxy = jsb_get_js_proxy(cx, tmpObj);
            if (proxy && proxy->ptr) {
                args.rval().set(JS::TrueHandleValue);
            }
        }
    }
    return true;
}

void ScriptingCore::rootObject(Ref* ref)
{
    auto proxy = jsb_get_native_proxy(ref);
    if (proxy) {
//        JSContext *cx = getGlobalContext();
//        JS::AddNamedObjectRoot(cx, &proxy->obj, typeid(*ref).name());
        ref->_rooted = true;
    }
    else CCLOG("rootObject: BUG. native not found: %p (%s)",  ref, typeid(*ref).name());
}

void ScriptingCore::unrootObject(Ref* ref)
{
    auto proxy = jsb_get_native_proxy(ref);
    if (proxy) {
//        JSContext *cx = getGlobalContext();
//        JS::RemoveObjectRoot(cx, &proxy->obj);
        ref->_rooted = false;
    }
    else CCLOG("unrootObject: BUG. native not found: %p (%s)",  ref, typeid(*ref).name());
}

void ScriptingCore::removeObjectProxy(Ref* obj)
{
    auto proxy = jsb_get_native_proxy(obj);
    if (proxy)
    {
#if ! CC_ENABLE_GC_FOR_NATIVE_OBJECTS
        JS::RemoveObjectRoot(_cx, &proxy->obj);
#endif
#if COCOS2D_DEBUG > 1
        CCLOG("------RELEASED------ Cpp: %p - Proxy: %p", obj, proxy);
#endif // COCOS2D_DEBUG
        
        if (!getFinalizing())
        {
            JS::RootedObject jsObj(_cx, proxy->obj);
            JS::RootedValue hook(_cx);
            JS_GetProperty(_cx, jsObj, "__hook", &hook);
            
            if (hook.isObject())
            {
                JSObject *hookObj = hook.toObjectOrNull();
                JS_SetPrivate(hookObj, nullptr);
            }
        }
        // remove the proxy here, since this was a "stack" object, not heap
        // when js_finalize is called, it will fail, but
        // the correct solution is to have a new finalize for event
        jsb_remove_proxy(proxy);
    }
}

void ScriptingCore::garbageCollect()
{
#if CC_TARGET_PLATFORM != CC_PLATFORM_WIN32
    JS_MaybeGC(_cx);
    JS_MaybeGC(_cx);
#endif
}

#pragma mark - Debug

void SimpleRunLoop::update(float dt)
{
    std::string message;
    size_t messageCount = 0;
    while (true)
    {
        g_qMutex.lock();
        messageCount = g_queue.size();
        if (messageCount > 0)
        {
            auto first = g_queue.begin();
            message = *first;
            g_queue.erase(first);
            --messageCount;
        }
        g_qMutex.unlock();
        
        if (!message.empty())
            ScriptingCore::getInstance()->debugProcessInput(message);
        
        if (messageCount == 0)
            break;
    }
}

void ScriptingCore::debugProcessInput(const std::string& str)
{
    JS::RootedObject debugGlobal(_cx, _debugGlobal->get());
    JSCompartment *globalCpt = JS_EnterCompartment(_cx, debugGlobal);

    JS::RootedValue globalVal(_cx, JS::ObjectOrNullValue(debugGlobal));
    JS::RootedValue argv(_cx);
    std_string_to_jsval(_cx, str, &argv);
    JS::HandleValueArray args(argv);
    JS::RootedValue outval(_cx);
    
    executeFunctionWithOwner(globalVal, "processInput", args, &outval);
    
    JS_LeaveCompartment(_cx, globalCpt);
}

static bool NS_ProcessNextEvent()
{
    std::string message;
    size_t messageCount = 0;
    while (true)
    {
        g_qMutex.lock();
        messageCount = g_queue.size();
        if (messageCount > 0)
        {
            auto first = g_queue.begin();
            message = *first;
            g_queue.erase(first);
            --messageCount;
        }
        g_qMutex.unlock();
        
        if (!message.empty())
            ScriptingCore::getInstance()->debugProcessInput(message);
        
        if (messageCount == 0)
            break;
    }
//    std::this_thread::yield();
    std::this_thread::sleep_for(std::chrono::milliseconds(10));

    return true;
}

bool JSBDebug_enterNestedEventLoop(JSContext* cx, unsigned argc, JS::Value* vp)
{
    enum {
        NS_OK = 0,
        NS_ERROR_UNEXPECTED
    };

#define NS_SUCCEEDED(v) ((v) == NS_OK)

    int rv = NS_OK;

    uint32_t nestLevel = ++s_nestedLoopLevel;

    while (NS_SUCCEEDED(rv) && s_nestedLoopLevel >= nestLevel) {
        drainJobQueue();
        if (!NS_ProcessNextEvent())
            rv = NS_ERROR_UNEXPECTED;
    }

    CCASSERT(s_nestedLoopLevel <= nestLevel,
             "nested event didn't unwind properly");

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    args.rval().set(JS::Int32Value(s_nestedLoopLevel));
    return true;
}

bool JSBDebug_exitNestedEventLoop(JSContext* cx, unsigned argc, JS::Value* vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (s_nestedLoopLevel > 0) {
        --s_nestedLoopLevel;
    } else {
        args.rval().set(JS::Int32Value(0));
        return true;
    }
    args.rval().setUndefined();
    return true;
}

bool JSBDebug_getEventLoopNestLevel(JSContext* cx, unsigned argc, JS::Value* vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    args.rval().set(JS::Int32Value(s_nestedLoopLevel));
    return true;
}

//#pragma mark - Debugger

static void _clientSocketWriteAndClearString(std::string& s)
{
    ::send(clientSocket, s.c_str(), s.length(), 0);
    s.clear();
}

static void processInput(const std::string& data) {
    std::lock_guard<std::mutex> lk(g_qMutex);
    g_queue.push_back(data);
}

static void clearBuffers() {
    std::lock_guard<std::mutex> lk(g_rwMutex);
    // only process input if there's something and we're not locked
    if (!inData.empty()) {
        processInput(inData);
        inData.clear();
    }
    if (!outData.empty()) {
        _clientSocketWriteAndClearString(outData);
    }
}

static void serverEntryPoint(unsigned int port)
{
    // start a server, accept the connection and keep reading data from it
    struct addrinfo hints, *result = nullptr, *rp = nullptr;
    int s = 0;
    memset(&hints, 0, sizeof(struct addrinfo));
    hints.ai_family = AF_UNSPEC;
    hints.ai_socktype = SOCK_STREAM; // TCP stream sockets
    hints.ai_flags = AI_PASSIVE;     // fill in my IP for me

    std::stringstream portstr;
    portstr << port;

    int err = 0;

#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32 || CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
    WSADATA wsaData;
    err = WSAStartup(MAKEWORD(2, 2),&wsaData);
#endif

    if ((err = getaddrinfo(NULL, portstr.str().c_str(), &hints, &result)) != 0) {
        LOGD("getaddrinfo error : %s\n", gai_strerror(err));
    }

    for (rp = result; rp != NULL; rp = rp->ai_next) {
        if ((s = socket(rp->ai_family, rp->ai_socktype, 0)) < 0) {
            continue;
        }
        int optval = 1;
        if ((setsockopt(s, SOL_SOCKET, SO_REUSEADDR, (char*)&optval, sizeof(optval))) < 0) {
            cc_closesocket(s);
            TRACE_DEBUGGER_SERVER("debug server : error setting socket option SO_REUSEADDR");
            return;
        }

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
        if ((setsockopt(s, SOL_SOCKET, SO_NOSIGPIPE, &optval, sizeof(optval))) < 0) {
            close(s);
            TRACE_DEBUGGER_SERVER("debug server : error setting socket option SO_NOSIGPIPE");
            return;
        }
#endif //(CC_TARGET_PLATFORM == CC_PLATFORM_IOS)

        if ((::bind(s, rp->ai_addr, rp->ai_addrlen)) == 0) {
            break;
        }
        cc_closesocket(s);
        s = -1;
    }
    if (s < 0 || rp == NULL) {
        TRACE_DEBUGGER_SERVER("debug server : error creating/binding socket");
        return;
    }

    freeaddrinfo(result);

    listen(s, 1);

#define MAX_RECEIVED_SIZE 1024
#define BUF_SIZE MAX_RECEIVED_SIZE + 1
    
    char buf[BUF_SIZE] = {0};
    int readBytes = 0;
    while (true) {
        clientSocket = accept(s, NULL, NULL);

        if (clientSocket < 0)
        {
            TRACE_DEBUGGER_SERVER("debug server : error on accept");
            return;
        }
        else
        {
            // read/write data
            TRACE_DEBUGGER_SERVER("debug server : client connected");

            inData = "connected";
            // process any input, send any output
            clearBuffers();
            
            while ((readBytes = (int)::recv(clientSocket, buf, MAX_RECEIVED_SIZE, 0)) > 0)
            {
                buf[readBytes] = '\0';
                // TRACE_DEBUGGER_SERVER("debug server : received command >%s", buf);

                // no other thread is using this
                inData.append(buf);
                // process any input, send any output
                clearBuffers();
            } // while(read)

            cc_closesocket(clientSocket);
        }
    } // while(true)
    
#undef BUF_SIZE
#undef MAX_RECEIVED_SIZE
}

bool JSBDebug_BufferWrite(JSContext* cx, unsigned argc, JS::Value* vp)
{
    if (argc == 1) {
        JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
        JS::RootedString jsstr(cx, args.get(0).toString());
        JSStringWrapper strWrapper(jsstr);
        // this is safe because we're already inside a lock (from clearBuffers)
        outData.append(strWrapper.get());
        _clientSocketWriteAndClearString(outData);
    }
    return true;
}

void ScriptingCore::enableDebugger(unsigned int port)
{
    if (!_debugGlobal)
    {
        JS::CompartmentOptions options;
        options.behaviors().setVersion(JSVERSION_LATEST);
        options.creationOptions().setSharedMemoryAndAtomicsEnabled(true);

        JS::RootedObject debugGlobal(_cx, JS_NewGlobalObject(_cx, &global_class, nullptr, JS::DontFireOnNewGlobalHook, options));
        _debugGlobal = new (std::nothrow) JS::PersistentRootedObject(_cx, debugGlobal);
        
        JSCompartment *globalCpt = JS_EnterCompartment(_cx, debugGlobal);
        JS_InitStandardClasses(_cx, debugGlobal);
        registerDefaultClasses(_cx, debugGlobal);
        JS_FireOnNewGlobalObject(_cx, debugGlobal);
        JS_DefineDebuggerObject(_cx, debugGlobal);
        
        // these are used in the debug program
        JS_DefineFunction(_cx, debugGlobal, "log", ScriptingCore::log, 0, JSPROP_PERMANENT);
//        JS_DefineFunction(_cx, debugGlobal, "require", ScriptingCore::executeScript, 2, JSPROP_PERMANENT);
        JS_DefineFunction(_cx, debugGlobal, "_bufferWrite", JSBDebug_BufferWrite, 1, JSPROP_READONLY | JSPROP_PERMANENT);
        JS_DefineFunction(_cx, debugGlobal, "_enterNestedEventLoop", JSBDebug_enterNestedEventLoop, 0, JSPROP_READONLY | JSPROP_PERMANENT);
        JS_DefineFunction(_cx, debugGlobal, "_exitNestedEventLoop", JSBDebug_exitNestedEventLoop, 0, JSPROP_READONLY | JSPROP_PERMANENT);
        JS_DefineFunction(_cx, debugGlobal, "_getEventLoopNestLevel", JSBDebug_getEventLoopNestLevel, 0, JSPROP_READONLY | JSPROP_PERMANENT);

        JS::RootedObject globalObj(_cx, _global->get());
        JS_WrapObject(_cx, &globalObj);

        runScript("script/jsb_debugger.js", debugGlobal);

        // prepare the debugger
        JS::RootedValue owner(_cx, JS::ObjectOrNullValue(debugGlobal));
        JS::RootedValue argv(_cx, JS::ObjectOrNullValue(globalObj));
        JS::HandleValueArray args(argv);
        JS::RootedValue outval(_cx);
        executeFunctionWithOwner(owner, "_prepareDebugger", args, &outval);

        // start bg thread
        auto t = std::thread(&serverEntryPoint, port);
        t.detach();

        Scheduler* scheduler = Director::getInstance()->getScheduler();
        scheduler->scheduleUpdate(this->_runLoop, 0, false);
        
        JS_LeaveCompartment(_cx, globalCpt);
    }
}

void handlePendingException(JSContext *cx)
{
    JS::RootedValue err(cx);
    if (JS_GetPendingException(cx, &err) && err.isObject())
    {
        JS_ClearPendingException(cx);
        
        JS::RootedObject errObj(cx, err.toObjectOrNull());
        JSErrorReport *report = JS_ErrorFromException(cx, errObj);
        CCLOGERROR("JS Exception: %s, file: %s, lineno: %u\n", report->message().c_str(), report->filename, report->lineno);
        
        JS::RootedValue stack(cx);
        if (JS_GetProperty(cx, errObj, "stack", &stack) && stack.isString())
        {
            JS::RootedString jsstackStr(cx, stack.toString());
            char *stackStr = JS_EncodeStringToUTF8(cx, jsstackStr);
            CCLOGERROR("Stack: %s\n", stackStr);
        }
    }
}

void make_class_extend(JSContext *cx, JS::HandleObject proto)
{
    JS::RootedValue classVal(cx);
    if (JS_GetProperty(cx, proto, "constructor", &classVal) && !classVal.isNullOrUndefined())
    {
        JS::RootedObject extendObj(cx);
        get_or_create_js_obj("cc.Class.extend", &extendObj);
        JS::RootedValue extendVal(cx, JS::ObjectOrNullValue(extendObj));
        if (!extendVal.isNullOrUndefined()) {
            JS::RootedObject classObj(cx, classVal.toObjectOrNull());
            JS_SetProperty(cx, classObj, "extend", extendVal);
        }
    }
}

js_proxy_t* jsb_new_proxy(JSContext *cx, void* nativeObj, JS::HandleObject jsObj)
{
    js_proxy_t* proxy = nullptr;
    JS::RootedValue objVal(cx, JS::ObjectOrNullValue(jsObj));

    if (nativeObj && objVal.isObject())
    {
        JS::RootedValue hook(cx);
        bool hasHook = JS_GetProperty(cx, jsObj, "__hook", &hook);

        if (!hasHook || !hook.isObject())
        {
            CCLOG("BUG: JS object(%p) doesn't have __hook property, can't set private data.", jsObj.get());
            return nullptr;
        }
        JS::RootedObject hookObj(cx, hook.toObjectOrNull());
        
        // native to JS index
        proxy = new js_proxy_t();
        CC_ASSERT(proxy && "not enough memory");
        CC_ASSERT(_native_js_global_map->find(nativeObj) == _native_js_global_map->end() && "Native Key should not be present");
        
        proxy->ptr = nativeObj;
        proxy->obj = jsObj.get();

        // One Proxy in two entries
        (*_native_js_global_map)[nativeObj] = proxy;
        JS_SetPrivate(hookObj, proxy);
    }
    else CCLOG("jsb_new_proxy: Invalid keys");

    return proxy;
}

js_proxy_t* jsb_bind_proxy(JSContext *cx, void* nativeObj, JS::HandleObject jsObj)
{
    js_proxy_t* proxy = nullptr;
    JS::RootedValue objVal(cx, JS::ObjectOrNullValue(jsObj));
    
    if (nativeObj && objVal.isObject())
    {
        // native to JS index
        proxy = new js_proxy_t();
        CC_ASSERT(proxy && "not enough memory");
        CC_ASSERT(_native_js_global_map->find(nativeObj) == _native_js_global_map->end() && "Native Key should not be present");
        
        proxy->ptr = nativeObj;
        proxy->obj = jsObj;
        (*_native_js_global_map)[nativeObj] = proxy;
    }
    else CCLOG("jsb_bind_proxy: Invalid keys");
    return proxy;
}

js_proxy_t* jsb_get_native_proxy(void* nativeObj)
{
    auto search = _native_js_global_map->find(nativeObj);
    if(search != _native_js_global_map->end())
        return search->second;
    return nullptr;
}

js_proxy_t* jsb_get_js_proxy(JSContext *cx, JS::HandleObject jsObj)
{
    JS::RootedValue hook(cx);
    JS_GetProperty(cx, jsObj, "__hook", &hook);
    
    if (hook.isObject())
    {
        JSObject *hookObj = hook.toObjectOrNull();
        const JSClass *jsClass = JS_GetClass(hookObj);
        if (jsClass == jsb_RefFinalizeHook_class || jsClass == jsb_ObjFinalizeHook_class)
        {
            js_proxy_t *proxy = (js_proxy_t *)JS_GetPrivate(hookObj);
            return proxy;
        }
    }
    
    return nullptr;
}

bool jsb_remove_proxy(js_proxy_t* proxy)
{
    bool ok = jsb_unbind_proxy(proxy);
    if (ok)
    {
        CC_SAFE_DELETE(proxy);
    }
    return ok;
}

bool jsb_unbind_proxy(js_proxy_t* proxy)
{
    void* nativeKey = proxy->ptr;
#if COCOS2D_DEBUG > 1
    CC_ASSERT(nativeKey && "Invalid nativeKey");
#else
    if (!nativeKey)
        return false;
#endif // COCOS2D_DEBUG
    
    // delete entry in native proxy map
    auto it_nat = _native_js_global_map->find(nativeKey);
    if (it_nat != _native_js_global_map->end())
    {
        _native_js_global_map->erase(it_nat);
        return true;
    }
    else
    {
#if COCOS2D_DEBUG > 1
        CCLOG("------UNBINDING------ failed, requested proxy is not present, Cpp: %p - Proxy: %p", nativeKey, proxy);
#endif // COCOS2D_DEBUG
        return false;
    }
}

//
// Ref functions
//

// ref_create
bool jsb_ref_create_jsobject(JSContext *cx, cocos2d::Ref *ref, JSClass *jsclass, JS::HandleObject proto, JS::MutableHandleObject jsObj, const char* debug)
{
    jsObj.set(JS_NewObjectWithGivenProto(cx, jsclass, proto));
    jsb_ref_init(cx, jsObj, ref, debug);
    jsb_new_proxy(cx, ref, jsObj);
    return true;
}

bool jsb_ref_autoreleased_create_jsobject(JSContext *cx, cocos2d::Ref *ref, JSClass *jsclass, JS::HandleObject proto, JS::MutableHandleObject jsObj, const char* debug)
{
    jsObj.set(JS_NewObjectWithGivenProto(cx, jsclass, proto));
    jsb_ref_autoreleased_init(cx, jsObj, ref, debug);
    jsb_new_proxy(cx, ref, jsObj);
    return true;
}

bool jsb_create_weak_jsobject(JSContext *cx, void *native, JSClass *jsclass, JS::HandleObject proto, JS::MutableHandleObject jsObj, const char* debug)
{
    jsObj.set(JS_NewObjectWithGivenProto(cx, jsclass, proto));
    js_add_FinalizeHook(cx, jsObj, false);
    auto proxy = jsb_new_proxy(cx, native, jsObj);
    (void)proxy;

#if ! CC_ENABLE_GC_FOR_NATIVE_OBJECTS
//    JS::AddNamedObjectRoot(cx, &proxy->obj, debug);
#else
#if COCOS2D_DEBUG > 1
    if (debug != nullptr)
    {
        CCLOG("++++++WEAK_REF++++++ Cpp(%s): %p - Proxy: %p", debug, native, proxy);
    }
#endif // COCOS2D_DEBUG
#endif // CC_ENABLE_GC_FOR_NATIVE_OBJECTS
    return true;
}

// get_or_create
bool jsb_ref_get_or_create_jsobject(JSContext *cx, cocos2d::Ref *ref, JSClass *jsclass, JS::HandleObject proto, JS::MutableHandleObject jsObj, const char* debug)
{
    auto proxy = jsb_get_native_proxy(ref);
    if (proxy)
    {
        jsObj.set(proxy->obj);
        return true;
    }

    jsObj.set(JS_NewObjectWithGivenProto(cx, jsclass, proto));
    
    JS::RootedObject obj(cx, jsObj);
#if CC_ENABLE_GC_FOR_NATIVE_OBJECTS
    ref->retain();
    js_add_FinalizeHook(cx, jsObj, true);
    proxy = jsb_new_proxy(cx, ref, obj);
#if COCOS2D_DEBUG > 1
    if (debug != nullptr)
    {
        CCLOG("++++++RETAINED++++++ Cpp(%s): %p - Proxy: %p obj: %p", debug, ref, proxy, jsObj.get());
    }
#endif // COCOS2D_DEBUG
#else
    // don't auto-release, don't retain.
    JS::AddNamedObjectRoot(cx, &newproxy->obj, debug);
    jsb_new_proxy(cx, ref, obj);
#endif // CC_ENABLE_GC_FOR_NATIVE_OBJECTS

    return true;
}

// get_or_create: Ref is already autoreleased (or created)
bool jsb_ref_autoreleased_get_or_create_jsobject(JSContext *cx, cocos2d::Ref *ref, JSClass *jsclass, JS::HandleObject proto, JS::MutableHandleObject jsObj, const char* debug)
{
    auto proxy = jsb_get_native_proxy(ref);
    if (proxy)
    {
        jsObj.set(proxy->obj);
        return true;
    }
    // else
    return jsb_ref_autoreleased_create_jsobject(cx, ref, jsclass, proto, jsObj, debug);
}

// get_or_create: when native object isn't a ref object or when the native object life cycle don't need to be managed by js object
bool jsb_get_or_create_weak_jsobject(JSContext *cx, void *native, JSClass *jsclass, JS::HandleObject proto, JS::MutableHandleObject jsObj, const char* debug)
{
    auto proxy = jsb_get_native_proxy(native);
    if (proxy)
    {
        jsObj.set(proxy->obj);
        return true;
    }

    // don't auto-release, don't retain.
    jsObj.set(JS_NewObjectWithGivenProto(cx, jsclass, proto));

#if ! CC_ENABLE_GC_FOR_NATIVE_OBJECTS
//    JS::AddNamedObjectRoot(cx, &proxy->obj, debug);
    jsb_new_proxy(cx, native, jsObj);
#else
    js_add_FinalizeHook(cx, jsObj, false);
    proxy = jsb_new_proxy(cx, native, jsObj);
#if COCOS2D_DEBUG > 1
    if (debug != nullptr)
    {
        CCLOG("++++++WEAK_REF++++++ Cpp(%s): %p - Proxy: %p", debug, native, proxy);
    }
#endif // COCOS2D_DEBUG
#endif // CC_ENABLE_GC_FOR_NATIVE_OBJECTS
    return true;
}

// ref_init
void jsb_ref_init(JSContext* cx, JS::HandleObject obj, Ref* ref, const char* debug)
{
//    CCLOG("jsb_ref_init: JSObject address =  %p. %s", obj->get(), debug);
#if CC_ENABLE_GC_FOR_NATIVE_OBJECTS
    (void)ref;
    JS::RootedObject jsObj(cx, obj);
    js_add_FinalizeHook(cx, jsObj, true);
    // don't retain it, already retained
#if COCOS2D_DEBUG > 1
    CCLOG("++++++RETAINED++++++ Cpp(%s): %p - JS: %p", debug, ref, jsObj.get());
#endif // COCOS2D_DEBUG
#else
    // autorelease it
    ref->autorelease();
//    JS::AddNamedObjectRoot(cx, obj, debug);
#endif
}

void jsb_ref_autoreleased_init(JSContext* cx, JS::HandleObject obj, Ref* ref, const char* debug)
{
    //    CCLOG("jsb_ref_init: JSObject address =  %p. %s", obj->get(), debug);
#if CC_ENABLE_GC_FOR_NATIVE_OBJECTS
    (void)cx;
    (void)obj;
    ref->retain();
    JS::RootedObject jsObj(cx, obj);
    js_add_FinalizeHook(cx, jsObj, true);
#if COCOS2D_DEBUG > 1
    CCLOG("++++++RETAINED++++++ Cpp(%s): %p - JS: %p", debug, ref, jsObj.get());
#endif // COCOS2D_DEBUG
#else
    // don't autorelease it, since it is already autoreleased
//    JS::AddNamedObjectRoot(cx, obj, debug);
#endif
}

// rebind
void jsb_ref_rebind(JSContext* cx, JS::HandleObject jsobj, js_proxy_t *proxy, cocos2d::Ref* oldRef, cocos2d::Ref* newRef, const char* debug)
{
#if CC_ENABLE_GC_FOR_NATIVE_OBJECTS
    // Release the old reference as it have been retained by jsobj previously,
    // and the jsobj won't have any chance to release it in the future
    oldRef->release();
#else
//    JS::RemoveObjectRoot(cx, &proxy->obj);
#endif
    
    jsb_remove_proxy(proxy);
    // Rebind js obj with new action
    jsb_new_proxy(cx, newRef, jsobj);
    
#if !CC_ENABLE_GC_FOR_NATIVE_OBJECTS
//    JS::AddNamedObjectRoot(cx, &newProxy->obj, debug);
#endif
}

void jsb_non_ref_init(JSContext* cx, JS::HandleObject obj, void* native, const char* debug)
{
//    CCLOG("jsb_non_ref_init: JSObject address =  %p. %s", obj->get(), debug);
#if CC_ENABLE_GC_FOR_NATIVE_OBJECTS
    JS::RootedObject jsObj(cx, obj);
    js_add_FinalizeHook(cx, jsObj, false);
    // don't retain it, already retained
#if COCOS2D_DEBUG > 1
    CCLOG("++++++RETAINED++++++ Cpp(%s): %p - JS: %p", debug, native, jsObj.get());
#endif // COCOS2D_DEBUG
#endif
}
