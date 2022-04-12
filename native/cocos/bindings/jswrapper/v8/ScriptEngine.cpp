/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "ScriptEngine.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8

    #include "../MappingUtils.h"
    #include "../State.h"
    #include "Class.h"
    #include "MissingSymbols.h"
    #include "Object.h"
    #include "Utils.h"
    #include "platform/FileUtils.h"

    #include <sstream>

    #if SE_ENABLE_INSPECTOR
        #include "debugger/env.h"
        #include "debugger/inspector_agent.h"
        #include "debugger/node.h"

    #endif

    #include <sstream>

    #define EXPOSE_GC "__jsb_gc__"

const unsigned int JSB_STACK_FRAME_LIMIT = 20;

    #ifdef CC_DEBUG
unsigned int                    jsbInvocationCount = 0;
std::map<std::string, unsigned> jsbFunctionInvokedRecords;
    #endif

    #define RETRUN_VAL_IF_FAIL(cond, val) \
        if (!(cond)) return val

namespace se {

Class *__jsb_CCPrivateData_class = nullptr; //NOLINT(readability-identifier-naming)

namespace {
ScriptEngine *gSriptEngineInstance = nullptr;

void seLogCallback(const v8::FunctionCallbackInfo<v8::Value> &info) {
    if (info[0]->IsString()) {
        v8::String::Utf8Value utf8(v8::Isolate::GetCurrent(), info[0]);
        SE_LOGD("JS: %s\n", *utf8);
    }
}

void seForceGC(const v8::FunctionCallbackInfo<v8::Value> & /*info*/) {
    ScriptEngine::getInstance()->garbageCollect();
}

std::string stackTraceToString(v8::Local<v8::StackTrace> stack) {
    std::string stackStr;
    if (stack.IsEmpty()) {
        return stackStr;
    }

    char tmp[100] = {0};
    for (int i = 0, e = stack->GetFrameCount(); i < e; ++i) {
        v8::Local<v8::StackFrame> frame  = stack->GetFrame(v8::Isolate::GetCurrent(), i);
        v8::Local<v8::String>     script = frame->GetScriptName();
        std::string               scriptName;
        if (!script.IsEmpty()) {
            scriptName = *v8::String::Utf8Value(v8::Isolate::GetCurrent(), script);
        }

        v8::Local<v8::String> func = frame->GetFunctionName();
        std::string           funcName;
        if (!func.IsEmpty()) {
            funcName = *v8::String::Utf8Value(v8::Isolate::GetCurrent(), func);
        }

        stackStr += " - [";
        snprintf(tmp, sizeof(tmp), "%d", i);
        stackStr += tmp;
        stackStr += "]";
        stackStr += (funcName.empty() ? "anonymous" : funcName.c_str());
        stackStr += "@";
        stackStr += (scriptName.empty() ? "(no filename)" : scriptName.c_str());
        stackStr += ":";
        snprintf(tmp, sizeof(tmp), "%d", frame->GetLineNumber());
        stackStr += tmp;

        if (i < (e - 1)) {
            stackStr += "\n";
        }
    }

    return stackStr;
}

se::Value oldConsoleLog;
se::Value oldConsoleDebug;
se::Value oldConsoleInfo;
se::Value oldConsoleWarn;
se::Value oldConsoleError;
se::Value oldConsoleAssert;

bool jsbConsoleFormatLog(State &state, const char *prefix, int msgIndex = 0) {
    if (msgIndex < 0) {
        return false;
    }

    const auto &args = state.args();
    int         argc = static_cast<int>(args.size());
    if ((argc - msgIndex) == 1) {
        std::string msg = args[msgIndex].toStringForce();
        SE_LOGD("JS: %s%s\n", prefix, msg.c_str());
    } else if (argc > 1) {
        std::string msg = args[msgIndex].toStringForce();
        size_t      pos;
        for (int i = (msgIndex + 1); i < argc; ++i) {
            pos = msg.find('%');
            if (pos != std::string::npos && pos != (msg.length() - 1) && (msg[pos + 1] == 'd' || msg[pos + 1] == 's' || msg[pos + 1] == 'f')) {
                msg.replace(pos, 2, args[i].toStringForce());
            } else {
                msg += " " + args[i].toStringForce();
            }
        }

        SE_LOGD("JS: %s%s\n", prefix, msg.c_str());
    }

    return true;
}

bool jsbConsoleLog(State &s) {
    jsbConsoleFormatLog(s, "");
    oldConsoleLog.toObject()->call(s.args(), s.thisObject());
    return true;
}
SE_BIND_FUNC(jsbConsoleLog)

bool jsbConsoleDebug(State &s) {
    jsbConsoleFormatLog(s, "[DEBUG]: ");
    oldConsoleDebug.toObject()->call(s.args(), s.thisObject());
    return true;
}
SE_BIND_FUNC(jsbConsoleDebug)

bool jsbConsoleInfo(State &s) {
    jsbConsoleFormatLog(s, "[INFO]: ");
    oldConsoleInfo.toObject()->call(s.args(), s.thisObject());
    return true;
}
SE_BIND_FUNC(jsbConsoleInfo)

bool jsbConsoleWarn(State &s) {
    jsbConsoleFormatLog(s, "[WARN]: ");
    oldConsoleWarn.toObject()->call(s.args(), s.thisObject());
    return true;
}
SE_BIND_FUNC(jsbConsoleWarn)

bool jsbConsoleError(State &s) {
    jsbConsoleFormatLog(s, "[ERROR]: ");
    oldConsoleError.toObject()->call(s.args(), s.thisObject());
    return true;
}
SE_BIND_FUNC(jsbConsoleError)

bool jsbConsoleAssert(State &s) {
    const auto &args = s.args();
    if (!args.empty()) {
        if (args[0].isBoolean() && !args[0].toBoolean()) {
            jsbConsoleFormatLog(s, "[ASSERT]: ", 1);
            oldConsoleAssert.toObject()->call(s.args(), s.thisObject());
        }
    }
    return true;
}
SE_BIND_FUNC(jsbConsoleAssert)

/*
        * The unique V8 platform instance
        */
class ScriptEngineV8Context {
public:
    ScriptEngineV8Context() {
        platform = v8::platform::NewDefaultPlatform().release();
        v8::V8::InitializePlatform(platform);

        std::string flags;
        //NOTICE: spaces are required between flags
        flags.append(" --expose-gc-as=" EXPOSE_GC);
        flags.append(" --no-flush-bytecode --no-lazy"); // for bytecode support
                                                        // flags.append(" --trace-gc"); // v8 trace gc
    #if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
        flags.append(" --jitless");
    #endif
        if (!flags.empty()) {
            v8::V8::SetFlagsFromString(flags.c_str(), static_cast<int>(flags.length()));
        }

        bool ok = v8::V8::Initialize();
        assert(ok);
    }

    ~ScriptEngineV8Context() {
        v8::V8::Dispose();
        v8::V8::ShutdownPlatform();
        delete platform;
    }
    v8::Platform *platform = nullptr;
};

ScriptEngineV8Context *gSharedV8 = nullptr;

} // namespace

void ScriptEngine::callExceptionCallback(const char *location, const char *message, const char *stack) {
    if (_nativeExceptionCallback) {
        _nativeExceptionCallback(location, message, stack);
    }
    if (_jsExceptionCallback) {
        _jsExceptionCallback(location, message, stack);
    }
}

void ScriptEngine::onFatalErrorCallback(const char *location, const char *message) {
    std::string errorStr = "[FATAL ERROR] location: ";
    errorStr += location;
    errorStr += ", message: ";
    errorStr += message;

    SE_LOGE("%s\n", errorStr.c_str());

    getInstance()->callExceptionCallback(location, message, "(no stack information)");
}

void ScriptEngine::onOOMErrorCallback(const char *location, bool isHeapOom) {
    std::string errorStr = "[OOM ERROR] location: ";
    errorStr += location;
    std::string message;
    message = "is heap out of memory: ";
    if (isHeapOom) {
        message += "true";
    } else {
        message += "false";
    }

    errorStr += ", " + message;
    SE_LOGE("%s\n", errorStr.c_str());
    getInstance()->callExceptionCallback(location, message.c_str(), "(no stack information)");
}

void ScriptEngine::onMessageCallback(v8::Local<v8::Message> message, v8::Local<v8::Value> /*data*/) {
    ScriptEngine *        thiz = getInstance();
    v8::Local<v8::String> msg  = message->Get();
    Value                 msgVal;
    internal::jsToSeValue(v8::Isolate::GetCurrent(), msg, &msgVal);
    assert(msgVal.isString());
    v8::ScriptOrigin origin = message->GetScriptOrigin();
    Value            resouceNameVal;
    internal::jsToSeValue(v8::Isolate::GetCurrent(), origin.ResourceName(), &resouceNameVal);
    Value line(origin.LineOffset());
    Value column(origin.ColumnOffset());

    std::string location = resouceNameVal.toStringForce() + ":" + line.toStringForce() + ":" + column.toStringForce();

    std::string errorStr = msgVal.toString() + ", location: " + location;
    std::string stackStr = stackTraceToString(message->GetStackTrace());
    if (!stackStr.empty()) {
        if (line.toInt32() == 0) {
            location = "(see stack)";
        }
        errorStr += "\nSTACK:\n" + stackStr;
    }
    SE_LOGE("ERROR: %s\n", errorStr.c_str());

    thiz->callExceptionCallback(location.c_str(), msgVal.toString().c_str(), stackStr.c_str());

    if (!thiz->_isErrorHandleWorking) {
        thiz->_isErrorHandleWorking = true;

        Value errorHandler;
        if (thiz->_globalObj && thiz->_globalObj->getProperty("__errorHandler", &errorHandler) && errorHandler.isObject() && errorHandler.toObject()->isFunction()) {
            ValueArray args;
            args.push_back(resouceNameVal);
            args.push_back(line);
            args.push_back(msgVal);
            args.push_back(Value(stackStr));
            errorHandler.toObject()->call(args, thiz->_globalObj);
        }

        thiz->_isErrorHandleWorking = false;
    } else {
        SE_LOGE("ERROR: __errorHandler has exception\n");
    }
}

void ScriptEngine::onPromiseRejectCallback(v8::PromiseRejectMessage msg) {
    v8::Isolate *     isolate = getInstance()->_isolate;
    v8::HandleScope   scope(isolate);
    std::stringstream ss;
    auto              event       = msg.GetEvent();
    auto              value       = msg.GetValue();
    auto              promiseName = msg.GetPromise()->GetConstructorName();
    const char *      eventName   = "[invalidatePromiseEvent]";

    if (event == v8::kPromiseRejectWithNoHandler) {
        eventName = "unhandledRejectedPromise";
    } else if (event == v8::kPromiseHandlerAddedAfterReject) {
        eventName = "handlerAddedAfterPromiseRejected";
    } else if (event == v8::kPromiseRejectAfterResolved) {
        eventName = "rejectAfterPromiseResolved";
    } else if (event == v8::kPromiseResolveAfterResolved) {
        eventName = "resolveAfterPromiseResolved";
    }

    if (!value.IsEmpty()) {
        // prepend error object to stack message
        v8::MaybeLocal<v8::String> maybeStr = value->ToString(isolate->GetCurrentContext());
        v8::Local<v8::String>      str      = maybeStr.IsEmpty() ? v8::String::NewFromUtf8(isolate, "[empty string]").ToLocalChecked() : maybeStr.ToLocalChecked();
        v8::String::Utf8Value      valueUtf8(isolate, str);
        auto *                     strp = *valueUtf8;
        if (strp == nullptr) {
            ss << "value: null" << std::endl;
            auto                  tn = value->TypeOf(isolate);
            v8::String::Utf8Value tnUtf8(isolate, tn);
            strp = *tnUtf8;
            if (strp) {
                ss << " type: " << strp << std::endl;
            }
            if (value->IsObject()) {
                v8::MaybeLocal<v8::String> json = v8::JSON::Stringify(isolate->GetCurrentContext(), value);
                if (!json.IsEmpty()) {
                    v8::String::Utf8Value jsonStr(isolate, json.ToLocalChecked());
                    strp = *jsonStr;
                    if (strp) {
                        ss << " obj: " << strp << std::endl;
                    } else {
                        ss << " obj: null" << std::endl;
                    }
                } else {
                    v8::Local<v8::Object> obj       = value->ToObject(isolate->GetCurrentContext()).ToLocalChecked();
                    v8::Local<v8::Array>  attrNames = obj->GetOwnPropertyNames(isolate->GetCurrentContext()).ToLocalChecked();

                    if (!attrNames.IsEmpty()) {
                        uint32_t size = attrNames->Length();

                        for (uint32_t i = 0; i < size; i++) {
                            se::Value             e;
                            v8::Local<v8::String> attrName = attrNames->Get(isolate->GetCurrentContext(), i)
                                                                 .ToLocalChecked()
                                                                 ->ToString(isolate->GetCurrentContext())
                                                                 .ToLocalChecked();
                            v8::String::Utf8Value attrUtf8(isolate, attrName);
                            strp = *attrUtf8;
                            ss << " obj.property " << strp << std::endl;
                        }
                        ss << " obj: JSON.parse failed!" << std::endl;
                    }
                }
            }

        } else {
            ss << *valueUtf8 << std::endl;
        }

        v8::String::Utf8Value valuePromiseConstructor(isolate, promiseName);
        strp = *valuePromiseConstructor;
        if (strp) {
            ss << "PromiseConstructor " << strp;
        }
    }

    auto stackStr = getInstance()->getCurrentStackTrace();
    ss << "stacktrace: " << std::endl;
    ss << stackStr << std::endl;
    getInstance()->callExceptionCallback("", eventName, ss.str().c_str());
}

void ScriptEngine::privateDataFinalize(void *nativeObj) {
    auto *p = static_cast<internal::PrivateData *>(nativeObj);

    Object::nativeObjectFinalizeHook(p->data);

    assert(p->seObj->getRefCount() == 1);

    p->seObj->decRef();

    free(p);
}

ScriptEngine *ScriptEngine::getInstance() {
    if (gSriptEngineInstance == nullptr) {
        gSriptEngineInstance = new ScriptEngine();
    }

    return gSriptEngineInstance;
}

void ScriptEngine::destroyInstance() {
    if (gSriptEngineInstance) {
        gSriptEngineInstance->cleanup();
        delete gSriptEngineInstance;
        gSriptEngineInstance = nullptr;
    }
}

ScriptEngine::ScriptEngine()
: _isolate(nullptr),
  _handleScope(nullptr),
  _globalObj(nullptr)
    #if SE_ENABLE_INSPECTOR
  ,
  _env(nullptr),
  _isolateData(nullptr)
    #endif
  ,
  _debuggerServerPort(0),
  _vmId(0),
  _isValid(false),
  _isGarbageCollecting(false),
  _isInCleanup(false),
  _isErrorHandleWorking(false) {

    if (!gSharedV8) {
        gSharedV8 = new ScriptEngineV8Context();
    }
}

ScriptEngine::~ScriptEngine() = default;

bool ScriptEngine::init() {
    cleanup();
    SE_LOGD("Initializing V8, version: %s\n", v8::V8::GetVersion());
    ++_vmId;

    _engineThreadId = std::this_thread::get_id();

    for (const auto &hook : _beforeInitHookArray) {
        hook();
    }
    _beforeInitHookArray.clear();
    v8::Isolate::CreateParams createParams;
    createParams.array_buffer_allocator = v8::ArrayBuffer::Allocator::NewDefaultAllocator();
    _isolate                            = v8::Isolate::New(createParams);
    v8::HandleScope hs(_isolate);
    _isolate->Enter();

    _isolate->SetCaptureStackTraceForUncaughtExceptions(true, JSB_STACK_FRAME_LIMIT, v8::StackTrace::kOverview);

    _isolate->SetFatalErrorHandler(onFatalErrorCallback);
    _isolate->SetOOMErrorHandler(onOOMErrorCallback);
    _isolate->AddMessageListener(onMessageCallback);
    _isolate->SetPromiseRejectCallback(onPromiseRejectCallback);

    _context.Reset(_isolate, v8::Context::New(_isolate));
    _context.Get(_isolate)->Enter();

    NativePtrToObjectMap::init();
    NonRefNativePtrCreatedByCtorMap::init();

    Object::setup();
    Class::setIsolate(_isolate);
    Object::setIsolate(_isolate);

    _globalObj = Object::_createJSObject(nullptr, _context.Get(_isolate)->Global());
    _globalObj->root();
    _globalObj->setProperty("window", Value(_globalObj));

    se::Value consoleVal;
    if (_globalObj->getProperty("console", &consoleVal) && consoleVal.isObject()) {
        consoleVal.toObject()->getProperty("log", &oldConsoleLog);
        consoleVal.toObject()->defineFunction("log", _SE(jsbConsoleLog));

        consoleVal.toObject()->getProperty("debug", &oldConsoleDebug);
        consoleVal.toObject()->defineFunction("debug", _SE(jsbConsoleDebug));

        consoleVal.toObject()->getProperty("info", &oldConsoleInfo);
        consoleVal.toObject()->defineFunction("info", _SE(jsbConsoleInfo));

        consoleVal.toObject()->getProperty("warn", &oldConsoleWarn);
        consoleVal.toObject()->defineFunction("warn", _SE(jsbConsoleWarn));

        consoleVal.toObject()->getProperty("error", &oldConsoleError);
        consoleVal.toObject()->defineFunction("error", _SE(jsbConsoleError));

        consoleVal.toObject()->getProperty("assert", &oldConsoleAssert);
        consoleVal.toObject()->defineFunction("assert", _SE(jsbConsoleAssert));
    }

    _globalObj->setProperty("scriptEngineType", se::Value("V8"));

    _globalObj->defineFunction("log", seLogCallback);
    _globalObj->defineFunction("forceGC", seForceGC);

    _globalObj->getProperty(EXPOSE_GC, &_gcFuncValue);
    if (_gcFuncValue.isObject() && _gcFuncValue.toObject()->isFunction()) {
        _gcFunc = _gcFuncValue.toObject();
    } else {
        _gcFunc = nullptr;
    }

    __jsb_CCPrivateData_class = Class::create("__PrivateData", _globalObj, nullptr, nullptr);
    __jsb_CCPrivateData_class->defineFinalizeFunction(privateDataFinalize);
    __jsb_CCPrivateData_class->setCreateProto(false);
    __jsb_CCPrivateData_class->install();

    _isValid = true;

    for (const auto &hook : _afterInitHookArray) {
        hook();
    }
    _afterInitHookArray.clear();

    return _isValid;
}

void ScriptEngine::cleanup() {
    if (!_isValid) {
        return;
    }

    SE_LOGD("ScriptEngine::cleanup begin ...\n");
    _isInCleanup = true;

    {
        AutoHandleScope hs;
        for (const auto &hook : _beforeCleanupHookArray) {
            hook();
        }
        _beforeCleanupHookArray.clear();

        SAFE_DEC_REF(_globalObj);
        Object::cleanup();
        Class::cleanup();
        garbageCollect();

        oldConsoleLog.setUndefined();
        oldConsoleDebug.setUndefined();
        oldConsoleInfo.setUndefined();
        oldConsoleWarn.setUndefined();
        oldConsoleError.setUndefined();
        oldConsoleAssert.setUndefined();

    #if SE_ENABLE_INSPECTOR

        if (_env != nullptr) {
            _env->inspector_agent()->Disconnect();
            _env->inspector_agent()->Stop();
        }

        if (_isolateData != nullptr) {
            node::FreeIsolateData(_isolateData);
            _isolateData = nullptr;
        }

        if (_env != nullptr) {
            _env->CleanupHandles();
            node::FreeEnvironment(_env);
            _env = nullptr;
        }
    #endif

        _context.Get(_isolate)->Exit();
        _context.Reset();
        _isolate->Exit();
    }
    _isolate->Dispose();

    _isolate   = nullptr;
    _globalObj = nullptr;
    _isValid   = false;

    _registerCallbackArray.clear();

    for (const auto &hook : _afterCleanupHookArray) {
        hook();
    }
    _afterCleanupHookArray.clear();

    _isInCleanup = false;
    NativePtrToObjectMap::destroy();
    NonRefNativePtrCreatedByCtorMap::destroy();
    _gcFunc = nullptr;
    SE_LOGD("ScriptEngine::cleanup end ...\n");
}

Object *ScriptEngine::getGlobalObject() const {
    return _globalObj;
}

void ScriptEngine::addBeforeInitHook(const std::function<void()> &hook) {
    _beforeInitHookArray.push_back(hook);
}

void ScriptEngine::addAfterInitHook(const std::function<void()> &hook) {
    _afterInitHookArray.push_back(hook);
}

void ScriptEngine::addBeforeCleanupHook(const std::function<void()> &hook) {
    _beforeCleanupHookArray.push_back(hook);
}

void ScriptEngine::addAfterCleanupHook(const std::function<void()> &hook) {
    _afterCleanupHookArray.push_back(hook);
}

void ScriptEngine::addRegisterCallback(RegisterCallback cb) {
    assert(std::find(_registerCallbackArray.begin(), _registerCallbackArray.end(), cb) == _registerCallbackArray.end());
    _registerCallbackArray.push_back(cb);
}

void ScriptEngine::addPermanentRegisterCallback(RegisterCallback cb) {
    if (std::find(_permRegisterCallbackArray.begin(), _permRegisterCallbackArray.end(), cb) == _permRegisterCallbackArray.end()) {
        _permRegisterCallbackArray.push_back(cb);
    }
}

bool ScriptEngine::start() {
    if (!init()) {
        return false;
    }

    se::AutoHandleScope hs;

    // debugger
    if (isDebuggerEnabled()) {
    #if SE_ENABLE_INSPECTOR
        // V8 inspector stuff, most code are taken from NodeJS.
        _isolateData = node::CreateIsolateData(_isolate, uv_default_loop());
        _env         = node::CreateEnvironment(_isolateData, _context.Get(_isolate), 0, nullptr, 0, nullptr);

        node::DebugOptions options;
        options.set_wait_for_connect(_isWaitForConnect); // the program will be hung up until debug attach if _isWaitForConnect = true
        options.set_inspector_enabled(true);
        options.set_port(static_cast<int>(_debuggerServerPort));
        options.set_host_name(_debuggerServerAddr);
        bool ok = _env->inspector_agent()->Start(gSharedV8->platform, "", options);
        assert(ok);
    #endif
    }
    //
    bool ok    = false;
    _startTime = std::chrono::steady_clock::now();

    for (auto cb : _permRegisterCallbackArray) {
        ok = cb(_globalObj);
        assert(ok);
        if (!ok) {
            break;
        }
    }

    for (auto cb : _registerCallbackArray) {
        ok = cb(_globalObj);
        assert(ok);
        if (!ok) {
            break;
        }
    }

    // After ScriptEngine is started, _registerCallbackArray isn't needed. Therefore, clear it here.
    _registerCallbackArray.clear();

    return ok;
}

void ScriptEngine::garbageCollect() {
    int objSize = __objectMap ? static_cast<int>(__objectMap->size()) : -1;
    SE_LOGD("GC begin ..., (js->native map) size: %d, all objects: %d\n", (int)NativePtrToObjectMap::size(), objSize);

    if (_gcFunc == nullptr) {
        const double kLongIdlePauseInSeconds = 1.0;
        _isolate->ContextDisposedNotification();
        _isolate->IdleNotificationDeadline(gSharedV8->platform->MonotonicallyIncreasingTime() + kLongIdlePauseInSeconds);
        // By sending a low memory notifications, we will try hard to collect all
        // garbage and will therefore also invoke all weak callbacks of actually
        // unreachable persistent handles.
        _isolate->LowMemoryNotification();
    } else {
        _gcFunc->call({}, nullptr);
    }
    objSize = __objectMap ? static_cast<int>(__objectMap->size()) : -1;

    SE_LOGD("GC end ..., (js->native map) size: %d, all objects: %d\n", (int)NativePtrToObjectMap::size(), objSize);
}

bool ScriptEngine::isGarbageCollecting() const {
    return _isGarbageCollecting;
}

void ScriptEngine::_setGarbageCollecting(bool isGarbageCollecting) { //NOLINT(readability-identifier-naming)
    _isGarbageCollecting = isGarbageCollecting;
}

bool ScriptEngine::isValid() const {
    return _isValid;
}

bool ScriptEngine::evalString(const char *script, ssize_t length /* = -1 */, Value *ret /* = nullptr */, const char *fileName /* = nullptr */) {
    if (_engineThreadId != std::this_thread::get_id()) {
        // `evalString` should run in main thread
        assert(false);
        return false;
    }

    assert(script != nullptr);
    if (length < 0) {
        length = static_cast<ssize_t>(strlen(script));
    }

    if (fileName == nullptr) {
        fileName = "(no filename)";
    }

    // Fix the source url is too long displayed in Chrome debugger.
    std::string              sourceUrl  = fileName;
    static const std::string PREFIX_KEY = "/temp/quick-scripts/";
    size_t                   prefixPos  = sourceUrl.find(PREFIX_KEY);
    if (prefixPos != std::string::npos) {
        sourceUrl = sourceUrl.substr(prefixPos + PREFIX_KEY.length());
    }

    #if CC_PLATFORM == CC_PLATFORM_MAC_OSX
    if (strncmp("(no filename)", sourceUrl.c_str(), sizeof("(no filename)")) != 0) {
        sourceUrl = cc::FileUtils::getInstance()->fullPathForFilename(sourceUrl);
    }
    #endif

    // It is needed, or will crash if invoked from non C++ context, such as invoked from objective-c context(for example, handler of UIKit).
    v8::HandleScope handleScope(_isolate);

    std::string                scriptStr(script, length);
    v8::MaybeLocal<v8::String> source = v8::String::NewFromUtf8(_isolate, scriptStr.c_str(), v8::NewStringType::kNormal);
    if (source.IsEmpty()) {
        return false;
    }

    v8::MaybeLocal<v8::String> originStr = v8::String::NewFromUtf8(_isolate, sourceUrl.c_str(), v8::NewStringType::kNormal);
    if (originStr.IsEmpty()) {
        return false;
    }

    v8::ScriptOrigin           origin(_isolate, originStr.ToLocalChecked());
    v8::MaybeLocal<v8::Script> maybeScript = v8::Script::Compile(_context.Get(_isolate), source.ToLocalChecked(), &origin);

    bool success = false;

    if (!maybeScript.IsEmpty()) {
        v8::TryCatch block(_isolate);

        v8::Local<v8::Script>     v8Script    = maybeScript.ToLocalChecked();
        v8::MaybeLocal<v8::Value> maybeResult = v8Script->Run(_context.Get(_isolate));

        if (!maybeResult.IsEmpty()) {
            v8::Local<v8::Value> result = maybeResult.ToLocalChecked();

            if (!result->IsUndefined() && ret != nullptr) {
                internal::jsToSeValue(_isolate, result, ret);
            }

            success = true;
        }

        if (block.HasCaught()) {
            v8::Local<v8::Message> message = block.Message();
            SE_LOGE("ScriptEngine::evalString catch exception:\n");
            onMessageCallback(message, v8::Undefined(_isolate));
        }
    }

    if (!success) {
        SE_LOGE("ScriptEngine::evalString script %s, failed!\n", fileName);
    }
    return success;
}

std::string ScriptEngine::getCurrentStackTrace() {
    if (!_isValid) {
        return std::string();
    }

    v8::HandleScope           hs(_isolate);
    v8::Local<v8::StackTrace> stack = v8::StackTrace::CurrentStackTrace(_isolate, JSB_STACK_FRAME_LIMIT, v8::StackTrace::kOverview);
    return stackTraceToString(stack);
}

void ScriptEngine::setFileOperationDelegate(const FileOperationDelegate &delegate) {
    _fileOperationDelegate = delegate;
}

const ScriptEngine::FileOperationDelegate &ScriptEngine::getFileOperationDelegate() const {
    return _fileOperationDelegate;
}

bool ScriptEngine::saveByteCodeToFile(const std::string &path, const std::string &pathBc) {
    bool  success = false;
    auto *fu      = cc::FileUtils::getInstance();

    if (pathBc.length() > 3 && pathBc.substr(pathBc.length() - 3) != ".bc") {
        SE_LOGE("ScriptEngine::generateByteCode bytecode file path should endwith \".bc\"\n");
        ;
        return false;
    }

    if (fu->isFileExist(pathBc)) {
        SE_LOGE("ScriptEngine::generateByteCode file already exists, it will be rewrite!\n");
    }

    //create directory for .bc file
    {
        auto lastSep = static_cast<int>(pathBc.size()) - 1;
        while (lastSep >= 0 && pathBc[lastSep] != '/') {
            lastSep -= 1;
        }

        if (lastSep == 0) {
            SE_LOGE("ScriptEngine::generateByteCode no directory component found in path %s\n", path.c_str());
            return false;
        }
        std::string pathBcDir = pathBc.substr(0, lastSep);
        success               = fu->createDirectory(pathBcDir);
        if (!success) {
            SE_LOGE("ScriptEngine::generateByteCode failed to create bytecode for %s\n", path.c_str());
            return success;
        }
    }

    // load script file
    std::string           scriptBuffer = _fileOperationDelegate.onGetStringFromFile(path);
    v8::Local<v8::String> code         = v8::String::NewFromUtf8(_isolate, scriptBuffer.c_str(), v8::NewStringType::kNormal, static_cast<int>(scriptBuffer.length())).ToLocalChecked();
    v8::Local<v8::Value>  scriptPath   = v8::String::NewFromUtf8(_isolate, path.data(), v8::NewStringType::kNormal).ToLocalChecked();
    // create unbound script
    v8::ScriptOrigin             origin(_isolate, scriptPath);
    v8::ScriptCompiler::Source   source(code, origin);
    v8::Local<v8::Context>       parsingContext = v8::Local<v8::Context>::New(_isolate, _context);
    v8::Context::Scope           parsingScope(parsingContext);
    v8::TryCatch                 tryCatch(_isolate);
    v8::Local<v8::UnboundScript> v8Script = v8::ScriptCompiler::CompileUnboundScript(_isolate, &source, v8::ScriptCompiler::kEagerCompile)
                                                .ToLocalChecked();
    // create CachedData
    v8::ScriptCompiler::CachedData *cd = v8::ScriptCompiler::CreateCodeCache(v8Script);
    // save to file
    cc::Data writeData;
    writeData.copy(cd->data, cd->length);
    success = fu->writeDataToFile(writeData, pathBc);
    if (!success) {
        SE_LOGE("ScriptEngine::generateByteCode write %s\n", pathBc.c_str());
    }
    return success;
}

bool ScriptEngine::runByteCodeFile(const std::string &pathBc, Value *ret /* = nullptr */) {
    auto *fu = cc::FileUtils::getInstance();

    cc::Data cachedData;
    fu->getContents(pathBc, &cachedData);

    // read origin source file length from .bc file
    uint8_t *p        = cachedData.getBytes() + 8;
    int      filesize = p[0] + (p[1] << 8) + (p[2] << 16) + (p[3] << 24);

    {
        // fix bytecode
        v8::HandleScope                 scope(_isolate);
        v8::Local<v8::String>           dummyBytecodeSource = v8::String::NewFromUtf8(_isolate, "\" \"", v8::NewStringType::kNormal).ToLocalChecked();
        v8::ScriptCompiler::Source      dummySource(dummyBytecodeSource);
        v8::Local<v8::UnboundScript>    dummyFunction = v8::ScriptCompiler::CompileUnboundScript(_isolate, &dummySource, v8::ScriptCompiler::kEagerCompile).ToLocalChecked();
        v8::ScriptCompiler::CachedData *dummyData     = v8::ScriptCompiler::CreateCodeCache(dummyFunction);
        memcpy(p + 4, dummyData->data + 12, 4);
        // delete dummyData; //NOTE: managed by v8
    }

    // setup ScriptOrigin
    v8::Local<v8::Value> scriptPath = v8::String::NewFromUtf8(_isolate, pathBc.data(), v8::NewStringType::kNormal).ToLocalChecked();

    v8::ScriptOrigin origin(_isolate, scriptPath, 0, 0, true);

    // restore CacheData
    auto *                v8CacheData = new v8::ScriptCompiler::CachedData(cachedData.getBytes(), static_cast<int>(cachedData.getSize()));
    v8::Local<v8::String> dummyCode;

    // generate dummy code
    if (filesize > 0) {
        std::vector<char> codeBuffer;
        codeBuffer.resize(filesize + 1);
        std::fill(codeBuffer.begin(), codeBuffer.end(), ' ');
        codeBuffer[0]            = '\"';
        codeBuffer[filesize - 1] = '\"';
        codeBuffer[filesize]     = '\0';
        dummyCode                = v8::String::NewFromUtf8(_isolate, codeBuffer.data(), v8::NewStringType::kNormal, filesize).ToLocalChecked();

        assert(dummyCode->Length() == filesize);
    }

    v8::ScriptCompiler::Source source(dummyCode, origin, v8CacheData);

    if (source.GetCachedData() == nullptr) {
        SE_LOGE("ScriptEngine::runByteCodeFile can not load cacheData for %s", pathBc.c_str());
        return false;
    }

    v8::TryCatch                 tryCatch(_isolate);
    v8::Local<v8::UnboundScript> v8Script = v8::ScriptCompiler::CompileUnboundScript(_isolate, &source, v8::ScriptCompiler::kConsumeCodeCache)
                                                .ToLocalChecked();

    if (v8Script.IsEmpty()) {
        SE_LOGE("ScriptEngine::runByteCodeFile can not compile %s!\n", pathBc.c_str());
        return false;
    }

    if (source.GetCachedData()->rejected) {
        SE_LOGE("ScriptEngine::runByteCodeFile cache rejected %s!\n", pathBc.c_str());
        return false;
    }

    v8::Local<v8::Script>     runnableScript = v8Script->BindToCurrentContext();
    v8::MaybeLocal<v8::Value> result         = runnableScript->Run(_context.Get(_isolate));

    if (result.IsEmpty()) {
        SE_LOGE("ScriptEngine::runByteCodeFile script %s, failed!\n", pathBc.c_str());
        return false;
    }

    if (!result.ToLocalChecked()->IsUndefined() && ret != nullptr) {
        internal::jsToSeValue(_isolate, result.ToLocalChecked(), ret);
    }

    SE_LOGE("ScriptEngine::runByteCodeFile success %s!\n", pathBc.c_str());

    return true;
}

bool ScriptEngine::runScript(const std::string &path, Value *ret /* = nullptr */) {
    assert(!path.empty());
    assert(_fileOperationDelegate.isValid());

    if (!cc::FileUtils::getInstance()->isFileExist(path)) {
        std::stringstream ss;
        ss << "throw new Error(\"Failed to require file '"
           << path << "', not found!\");";
        evalString(ss.str().c_str());
        return false;
    }

    if (path.length() > 3 && path.substr(path.length() - 3) == ".bc") {
        return runByteCodeFile(path, ret);
    }

    std::string scriptBuffer = _fileOperationDelegate.onGetStringFromFile(path);

    if (!scriptBuffer.empty()) {
        return evalString(scriptBuffer.c_str(), static_cast<ssize_t>(scriptBuffer.length()), ret, path.c_str());
    }

    SE_LOGE("ScriptEngine::runScript script %s, buffer is empty!\n", path.c_str());
    return false;
}

void ScriptEngine::clearException() {
    //IDEA:
}

void ScriptEngine::throwException(const std::string &errorMessage) {
    v8::HandleScope       scope(_isolate);
    v8::Local<v8::String> message = v8::String::NewFromUtf8(_isolate, errorMessage.data()).ToLocalChecked();
    v8::Local<v8::Value>  error   = v8::Exception::Error(message);
    _isolate->ThrowException(error);
}

void ScriptEngine::setExceptionCallback(const ExceptionCallback &cb) {
    _nativeExceptionCallback = cb;
}

void ScriptEngine::setJSExceptionCallback(const ExceptionCallback &cb) {
    _jsExceptionCallback = cb;
}

v8::Local<v8::Context> ScriptEngine::_getContext() const { //NOLINT(readability-identifier-naming)
    return _context.Get(_isolate);
}

void ScriptEngine::enableDebugger(const std::string &serverAddr, uint32_t port, bool isWait) {
    _debuggerServerAddr = serverAddr;
    _debuggerServerPort = port;
    _isWaitForConnect   = isWait;
}

bool ScriptEngine::isDebuggerEnabled() const {
    return !_debuggerServerAddr.empty() && _debuggerServerPort > 0;
}

void ScriptEngine::mainLoopUpdate() {
    // empty implementation
}

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8
