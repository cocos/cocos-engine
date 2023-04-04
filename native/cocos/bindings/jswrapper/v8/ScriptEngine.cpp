/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "ScriptEngine.h"
#include "engine/EngineEvents.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8

    #include "../MappingUtils.h"
    #include "../State.h"
    #include "Class.h"
    #include "MissingSymbols.h"
    #include "Object.h"
    #include "Utils.h"
    #include "base/Log.h"
    #include "base/std/container/unordered_map.h"
    #include "platform/FileUtils.h"
    #include "plugins/bus/EventBus.h"

    #include <sstream>

    #if SE_ENABLE_INSPECTOR
        #include "debugger/env.h"
        #include "debugger/inspector_agent.h"
        #include "debugger/node.h"

    #endif

    #include "base/std/container/array.h"

    #define EXPOSE_GC "__jsb_gc__"

const unsigned int JSB_STACK_FRAME_LIMIT = 20;

    #ifdef CC_DEBUG
unsigned int jsbInvocationCount = 0;
ccstd::unordered_map<ccstd::string, unsigned> jsbFunctionInvokedRecords;
    #endif

    #define RETRUN_VAL_IF_FAIL(cond, val) \
        if (!(cond)) return val

namespace se {
AutoHandleScope::AutoHandleScope()
: _handleScope(v8::Isolate::GetCurrent()) {
    #if CC_EDITOR
    ScriptEngine::getInstance()->_getContext()->Enter();
    #endif
}

AutoHandleScope::~AutoHandleScope() { // NOLINT
    #if CC_EDITOR
    ScriptEngine::getInstance()->_getContext()->Exit();
    #endif
}

namespace {

void seLogCallback(const v8::FunctionCallbackInfo<v8::Value> &info) {
    if (info[0]->IsString()) {
        v8::String::Utf8Value utf8(v8::Isolate::GetCurrent(), info[0]);
        cc::Log::logMessage(cc::LogType::KERNEL, cc::LogLevel::LEVEL_DEBUG
            , "JS: %s", *utf8);
    }
}

void seForceGC(const v8::FunctionCallbackInfo<v8::Value> & /*info*/) {
    ScriptEngine::getInstance()->garbageCollect();
}

ccstd::string stackTraceToString(v8::Local<v8::StackTrace> stack) {
    ccstd::string stackStr;
    if (stack.IsEmpty()) {
        return stackStr;
    }

    char tmp[100] = {0};
    for (int i = 0, e = stack->GetFrameCount(); i < e; ++i) {
        v8::Local<v8::StackFrame> frame = stack->GetFrame(v8::Isolate::GetCurrent(), i);
        v8::Local<v8::String> script = frame->GetScriptName();
        ccstd::string scriptName;
        if (!script.IsEmpty()) {
            scriptName = *v8::String::Utf8Value(v8::Isolate::GetCurrent(), script);
        }

        v8::Local<v8::String> func = frame->GetFunctionName();
        ccstd::string funcName;
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

bool jsbConsoleFormatLog(State &state, cc::LogLevel level, int msgIndex = 0) {
    if (msgIndex < 0) {
        return false;
    }

    const auto &args = state.args();
    int argc = static_cast<int>(args.size());
    if ((argc - msgIndex) == 1) {
        ccstd::string msg = args[msgIndex].toStringForce();
        cc::Log::logMessage(cc::LogType::KERNEL, level 
            ,"JS: %s", msg.c_str());
    } else if (argc > 1) {
        ccstd::string msg = args[msgIndex].toStringForce();
        size_t pos;
        for (int i = (msgIndex + 1); i < argc; ++i) {
            pos = msg.find('%');
            if (pos != ccstd::string::npos && pos != (msg.length() - 1) && (msg[pos + 1] == 'd' || msg[pos + 1] == 's' || msg[pos + 1] == 'f')) {
                msg.replace(pos, 2, args[i].toStringForce());
            } else {
                msg += " " + args[i].toStringForce();
            }
        }
        cc::Log::logMessage(cc::LogType::KERNEL, level
            ,"JS: %s", msg.c_str());
    }

    return true;
}

bool jsbConsoleLog(State &s) {
    jsbConsoleFormatLog(s, cc::LogLevel::LEVEL_DEBUG);
    oldConsoleLog.toObject()->call(s.args(), s.thisObject());
    return true;
}
SE_BIND_FUNC(jsbConsoleLog)

bool jsbConsoleDebug(State &s) {
    jsbConsoleFormatLog(s, cc::LogLevel::LEVEL_DEBUG);
    oldConsoleDebug.toObject()->call(s.args(), s.thisObject());
    return true;
}
SE_BIND_FUNC(jsbConsoleDebug)

bool jsbConsoleInfo(State &s) {
    jsbConsoleFormatLog(s, cc::LogLevel::INFO);
    oldConsoleInfo.toObject()->call(s.args(), s.thisObject());
    return true;
}
SE_BIND_FUNC(jsbConsoleInfo)

bool jsbConsoleWarn(State &s) {
    jsbConsoleFormatLog(s, cc::LogLevel::WARN);
    oldConsoleWarn.toObject()->call(s.args(), s.thisObject());
    return true;
}
SE_BIND_FUNC(jsbConsoleWarn)

bool jsbConsoleError(State &s) {
    jsbConsoleFormatLog(s, cc::LogLevel::ERR);
    oldConsoleError.toObject()->call(s.args(), s.thisObject());
    return true;
}
SE_BIND_FUNC(jsbConsoleError)

bool jsbConsoleAssert(State &s) {
    const auto &args = s.args();
    if (!args.empty()) {
        if (args[0].isBoolean() && !args[0].toBoolean()) {
            jsbConsoleFormatLog(s, cc::LogLevel::WARN, 1);
            oldConsoleAssert.toObject()->call(s.args(), s.thisObject());
        }
    }
    return true;
}
SE_BIND_FUNC(jsbConsoleAssert)

    /*
     * The unique V8 platform instance
     */
    #if !CC_EDITOR
class ScriptEngineV8Context {
public:
    ScriptEngineV8Context() {
        platform = v8::platform::NewDefaultPlatform().release();
        v8::V8::InitializePlatform(platform);
        ccstd::string flags;
        // NOTICE: spaces are required between flags
        flags.append(" --expose-gc-as=" EXPOSE_GC);
        // for bytecode support
        flags.append(" --no-flush-bytecode --no-lazy");
        // v8 trace gc
        // flags.append(" --trace-gc");

        // NOTICE: should be remove flag --no-turbo-escape after upgrade v8 to 10.x
        // https://github.com/cocos/cocos-engine/issues/13342
        flags.append(" --no-turbo-escape");

        #if (CC_PLATFORM == CC_PLATFORM_IOS)
        flags.append(" --jitless");
        #endif
        if (!flags.empty()) {
            v8::V8::SetFlagsFromString(flags.c_str(), static_cast<int>(flags.length()));
        }

        bool ok = v8::V8::Initialize();
        CC_ASSERT(ok);
    }

    ~ScriptEngineV8Context() {
        v8::V8::Dispose();
        v8::V8::ShutdownPlatform();
        delete platform;
    }
    v8::Platform *platform = nullptr;
};

ScriptEngineV8Context *gSharedV8 = nullptr;
    #endif // CC_EDITOR
} // namespace

ScriptEngine *ScriptEngine::instance = nullptr;
ScriptEngine::DebuggerInfo ScriptEngine::debuggerInfo;

void ScriptEngine::callExceptionCallback(const char *location, const char *message, const char *stack) {
    if (_nativeExceptionCallback) {
        _nativeExceptionCallback(location, message, stack);
    }
    if (_jsExceptionCallback) {
        _jsExceptionCallback(location, message, stack);
    }
}

void ScriptEngine::onFatalErrorCallback(const char *location, const char *message) {
    ccstd::string errorStr = "[FATAL ERROR] location: ";
    errorStr += location;
    errorStr += ", message: ";
    errorStr += message;

    SE_LOGE("%s\n", errorStr.c_str());

    getInstance()->callExceptionCallback(location, message, "(no stack information)");
}

void ScriptEngine::onOOMErrorCallback(const char *location, bool isHeapOom) {
    ccstd::string errorStr = "[OOM ERROR] location: ";
    errorStr += location;
    ccstd::string message;
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
    ScriptEngine *thiz = getInstance();
    v8::Local<v8::String> msg = message->Get();
    Value msgVal;
    internal::jsToSeValue(v8::Isolate::GetCurrent(), msg, &msgVal);
    CC_ASSERT(msgVal.isString());
    v8::ScriptOrigin origin = message->GetScriptOrigin();
    Value resouceNameVal;
    internal::jsToSeValue(v8::Isolate::GetCurrent(), origin.ResourceName(), &resouceNameVal);
    Value line(origin.LineOffset());
    Value column(origin.ColumnOffset());

    ccstd::string location = resouceNameVal.toStringForce() + ":" + line.toStringForce() + ":" + column.toStringForce();

    ccstd::string errorStr = msgVal.toString() + ", location: " + location;
    ccstd::string stackStr = stackTraceToString(message->GetStackTrace());
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
/**
 * Bug in v8 stacktrace:
 * "handlerAddedAfterPromiseRejected" event is triggered if a resolve handler is added.
 * But if no reject handler is added, then "unhandledRejectedPromise" exception will be called again, but the stacktrace this time become empty
 * LastStackTrace is used to store it.
 */
void ScriptEngine::pushPromiseExeception(const v8::Local<v8::Promise> &promise, const char *event, const char *stackTrace) {
    using element_type = decltype(_promiseArray)::value_type;
    element_type *current;

    auto itr = std::find_if(_promiseArray.begin(), _promiseArray.end(), [&](const auto &e) -> bool {
        return std::get<0>(e)->Get(_isolate) == promise;
    });

    if (itr == _promiseArray.end()) { // Not found, create one
        _promiseArray.emplace_back(std::make_unique<v8::Persistent<v8::Promise>>(), ccstd::vector<PromiseExceptionMsg>{});
        std::get<0>(_promiseArray.back())->Reset(_isolate, promise);
        current = &_promiseArray.back();
    } else {
        current = &(*itr);
    }

    auto &exceptions = std::get<1>(*current);
    if (std::strcmp(event, "handlerAddedAfterPromiseRejected") == 0) {
        for (int i = 0; i < exceptions.size(); i++) {
            if (exceptions[i].event == "unhandledRejectedPromise") {
                _lastStackTrace = exceptions[i].stackTrace;
                exceptions.erase(exceptions.begin() + i);
                return;
            }
        }
    }
    exceptions.push_back(PromiseExceptionMsg{event, stackTrace});
}

void ScriptEngine::handlePromiseExceptions() {
    if (_promiseArray.empty()) {
        return;
    }
    for (auto &exceptionsPair : _promiseArray) {
        auto &exceptionVector = std::get<1>(exceptionsPair);
        for (const auto &exceptions : exceptionVector) {
            getInstance()->callExceptionCallback("", exceptions.event.c_str(), exceptions.stackTrace.c_str());
        }
        std::get<0>(exceptionsPair).get()->Reset();
    }
    _promiseArray.clear();
    _lastStackTrace.clear();
}

void ScriptEngine::onPromiseRejectCallback(v8::PromiseRejectMessage msg) {
    /* Reject message contains different types, yet not every type will lead to the exception in the end.
     * A detection is needed: if the reject handler is added after the promise is triggered, it's actually valid.*/
    v8::Isolate *isolate = getInstance()->_isolate;
    v8::HandleScope scope(isolate);
    v8::TryCatch tryCatch(isolate);
    std::stringstream ss;
    auto event = msg.GetEvent();
    v8::Local<v8::Value> value = msg.GetValue();
    auto promiseName = msg.GetPromise()->GetConstructorName();

    if (!value.IsEmpty()) {
        // prepend error object to stack message
        // v8::MaybeLocal<v8::String> maybeStr = value->ToString(isolate->GetCurrentContext());
        if (value->IsString()) {
            v8::Local<v8::String> str = value->ToString(isolate->GetCurrentContext()).ToLocalChecked();

            v8::String::Utf8Value valueUtf8(isolate, str);
            auto *strp = *valueUtf8;
            if (strp == nullptr) {
                ss << "value: null" << std::endl;
                auto tn = value->TypeOf(isolate);
                v8::String::Utf8Value tnUtf8(isolate, tn);
                strp = *tnUtf8;
                ss << " type: " << strp << std::endl;
            }

        } else if (value->IsObject()) {
            v8::MaybeLocal<v8::String> json = v8::JSON::Stringify(isolate->GetCurrentContext(), value);
            if (!json.IsEmpty()) {
                v8::String::Utf8Value jsonStr(isolate, json.ToLocalChecked());
                auto *strp = *jsonStr;
                if (strp) {
                    ss << " obj: " << strp << std::endl;
                } else {
                    ss << " obj: null" << std::endl;
                }
            } else {
                v8::Local<v8::Object> obj = value->ToObject(isolate->GetCurrentContext()).ToLocalChecked();
                v8::Local<v8::Array> attrNames = obj->GetOwnPropertyNames(isolate->GetCurrentContext()).ToLocalChecked();

                if (!attrNames.IsEmpty()) {
                    uint32_t size = attrNames->Length();
                    for (uint32_t i = 0; i < size; i++) {
                        se::Value e;
                        v8::Local<v8::String> attrName = attrNames->Get(isolate->GetCurrentContext(), i)
                                                             .ToLocalChecked()
                                                             ->ToString(isolate->GetCurrentContext())
                                                             .ToLocalChecked();
                        v8::String::Utf8Value attrUtf8(isolate, attrName);
                        auto *strp = *attrUtf8;
                        ss << " obj.property " << strp << std::endl;
                    }
                    ss << " obj: JSON.parse failed!" << std::endl;
                }
            }
        }
        v8::String::Utf8Value valuePromiseConstructor(isolate, promiseName);
        auto *strp = *valuePromiseConstructor;
        if (strp) {
            ss << "PromiseConstructor " << strp;
        }
    }
    auto stackStr = getInstance()->getCurrentStackTrace();
    ss << "stacktrace: " << std::endl;
    if (stackStr.empty()) {
        ss << getInstance()->_lastStackTrace << std::endl;
    } else {
        ss << stackStr << std::endl;
    }
    // Check event immediately, for certain case throw exception.
    switch (event) {
        case v8::kPromiseRejectWithNoHandler:
            getInstance()->pushPromiseExeception(msg.GetPromise(), "unhandledRejectedPromise", ss.str().c_str());
            break;
        case v8::kPromiseHandlerAddedAfterReject:
            getInstance()->pushPromiseExeception(msg.GetPromise(), "handlerAddedAfterPromiseRejected", ss.str().c_str());
            break;
        case v8::kPromiseRejectAfterResolved:
            getInstance()->callExceptionCallback("", "rejectAfterPromiseResolved", stackStr.c_str());
            break;
        case v8::kPromiseResolveAfterResolved:
            getInstance()->callExceptionCallback("", "resolveAfterPromiseResolved", stackStr.c_str());
            break;
    }
}

ScriptEngine *ScriptEngine::getInstance() {
    return ScriptEngine::instance;
}

void ScriptEngine::destroyInstance() {
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
    #if !CC_EDITOR
    if (!gSharedV8) {
        gSharedV8 = ccnew ScriptEngineV8Context();
    }
    #endif

    ScriptEngine::instance = this;
}

ScriptEngine::~ScriptEngine() { // NOLINT(bugprone-exception-escape)
    cleanup();
    /**
     * v8::V8::Initialize() can only be called once for a process.
     * Engine::restart() will delete ScriptEngine and re-create it.
     * So gSharedV8 variable should not be released and it will be re-used.
     */
    //    if (gSharedV8) {
    //        delete gSharedV8;
    //        gSharedV8 = nullptr;
    //    }
    ScriptEngine::instance = nullptr;
}

bool ScriptEngine::postInit() {
    v8::HandleScope hs(_isolate);
    // editor has it's own isolate,no need to enter and set callback.
    #if !CC_EDITOR
    _isolate->Enter();
    _isolate->SetCaptureStackTraceForUncaughtExceptions(true, JSB_STACK_FRAME_LIMIT, v8::StackTrace::kOverview);
    _isolate->SetFatalErrorHandler(onFatalErrorCallback);
    _isolate->SetOOMErrorHandler(onOOMErrorCallback);
    _isolate->AddMessageListener(onMessageCallback);
    _isolate->SetPromiseRejectCallback(onPromiseRejectCallback);
    #endif
    NativePtrToObjectMap::init();

    Class::setIsolate(_isolate);
    Object::setIsolate(_isolate);

    _globalObj = Object::_createJSObject(nullptr, _isolate->GetCurrentContext()->Global());
    _globalObj->root();
    _globalObj->setProperty("window", Value(_globalObj));

    #if !CC_EDITOR
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
    #endif
    _globalObj->setProperty("scriptEngineType", se::Value("V8"));

    _globalObj->defineFunction("log", seLogCallback);
    _globalObj->defineFunction("forceGC", seForceGC);

    _globalObj->getProperty(EXPOSE_GC, &_gcFuncValue);
    if (_gcFuncValue.isObject() && _gcFuncValue.toObject()->isFunction()) {
        _gcFunc = _gcFuncValue.toObject();
    } else {
        _gcFunc = nullptr;
    }

    _isValid = true;

    // @deprecated since 3.7.0
    cc::plugin::send(cc::plugin::BusType::SCRIPT_ENGINE, cc::plugin::ScriptEngineEvent::POST_INIT);

    cc::events::ScriptEngine::broadcast(cc::ScriptEngineEvent::AFTER_INIT);

    for (const auto &hook : _afterInitHookArray) {
        hook();
    }
    _afterInitHookArray.clear();

    return _isValid;
}

bool ScriptEngine::init() {
    return init(nullptr);
}

bool ScriptEngine::init(v8::Isolate *isolate) {
    cleanup();
    SE_LOGD("Initializing V8, version: %s\n", v8::V8::GetVersion());
    ++_vmId;

    _engineThreadId = std::this_thread::get_id();

    cc::events::ScriptEngine::broadcast(cc::ScriptEngineEvent::BEFORE_INIT);

    for (const auto &hook : _beforeInitHookArray) {
        hook();
    }
    _beforeInitHookArray.clear();

    if (isolate != nullptr) {
        _isolate = isolate;
        v8::Local<v8::Context> context = _isolate->GetCurrentContext();
        _context.Reset(_isolate, context);
    } else {
        static v8::ArrayBuffer::Allocator *arrayBufferAllocator{nullptr};
        if (arrayBufferAllocator == nullptr) {
            arrayBufferAllocator = v8::ArrayBuffer::Allocator::NewDefaultAllocator();
        }
        v8::Isolate::CreateParams createParams;
        createParams.array_buffer_allocator = arrayBufferAllocator;
        _isolate = v8::Isolate::New(createParams);
        v8::HandleScope hs(_isolate);
        _context.Reset(_isolate, v8::Context::New(_isolate));
        _context.Get(_isolate)->Enter();
    }

    return postInit();
}

void ScriptEngine::cleanup() {
    if (!_isValid) {
        return;
    }

    SE_LOGD("ScriptEngine::cleanup begin ...\n");
    _isInCleanup = true;

    cc::events::ScriptEngine::broadcast(cc::ScriptEngineEvent::BEFORE_CLEANUP);

    {
        AutoHandleScope hs;
        for (const auto &hook : _beforeCleanupHookArray) {
            hook();
        }
        _beforeCleanupHookArray.clear();

        _stringPool.clear();

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
    _isolate = nullptr;
    Object::setIsolate(nullptr);

    _globalObj = nullptr;
    _isValid = false;

    _registerCallbackArray.clear();

    for (const auto &hook : _afterCleanupHookArray) {
        hook();
    }

    // Cleanup all hooks
    _beforeInitHookArray.clear();
    _afterInitHookArray.clear();
    _beforeCleanupHookArray.clear();
    _afterCleanupHookArray.clear();

    _isInCleanup = false;
    NativePtrToObjectMap::destroy();
    _gcFuncValue.setUndefined();
    _gcFunc = nullptr;
    cc::events::ScriptEngine::broadcast(cc::ScriptEngineEvent::AFTER_CLEANUP);
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
    CC_ASSERT(std::find(_registerCallbackArray.begin(), _registerCallbackArray.end(), cb) == _registerCallbackArray.end());
    _registerCallbackArray.push_back(cb);
}

void ScriptEngine::addPermanentRegisterCallback(RegisterCallback cb) {
    if (std::find(_permRegisterCallbackArray.begin(), _permRegisterCallbackArray.end(), cb) == _permRegisterCallbackArray.end()) {
        _permRegisterCallbackArray.push_back(cb);
    }
}

bool ScriptEngine::callRegisteredCallback() {
    se::AutoHandleScope hs;
    bool ok = false;
    _startTime = std::chrono::steady_clock::now();

    for (auto cb : _permRegisterCallbackArray) {
        ok = cb(_globalObj);
        CC_ASSERT(ok);
        if (!ok) {
            break;
        }
    }

    for (auto cb : _registerCallbackArray) {
        ok = cb(_globalObj);
        CC_ASSERT(ok);
        if (!ok) {
            break;
        }
    }

    // After ScriptEngine is started, _registerCallbackArray isn't needed. Therefore, clear it here.
    _registerCallbackArray.clear();

    return ok;
}

bool ScriptEngine::start() {
    if (!init()) {
        return false;
    }
    se::AutoHandleScope hs;

    // Check the cache of debuggerInfo. Enable debugger if it's valid.
    if (debuggerInfo.isValid()) {
        enableDebugger(debuggerInfo.serverAddr, debuggerInfo.port, debuggerInfo.isWait);
        debuggerInfo.reset();
    }

    // debugger
    if (isDebuggerEnabled()) {
    #if SE_ENABLE_INSPECTOR && !CC_EDITOR
        // V8 inspector stuff, most code are taken from NodeJS.
        _isolateData = node::CreateIsolateData(_isolate, uv_default_loop());
        _env = node::CreateEnvironment(_isolateData, _context.Get(_isolate), 0, nullptr, 0, nullptr);

        node::DebugOptions options;
        options.set_wait_for_connect(_isWaitForConnect); // the program will be hung up until debug attach if _isWaitForConnect = true
        options.set_inspector_enabled(true);
        options.set_port(static_cast<int>(_debuggerServerPort));
        options.set_host_name(_debuggerServerAddr);
        bool ok = _env->inspector_agent()->Start(gSharedV8->platform, "", options);
        CC_ASSERT(ok);
    #endif
    }

    return callRegisteredCallback();
}

bool ScriptEngine::start(v8::Isolate *isolate) {
    if (!init(isolate)) {
        return false;
    }
    return callRegisteredCallback();
}

void ScriptEngine::garbageCollect() {
    SE_LOGD("GC begin ..., (js->native map) size: %d\n", (int)NativePtrToObjectMap::size());
    _gcFunc->call({}, nullptr);
    SE_LOGD("GC end ..., (js->native map) size: %d\n", (int)NativePtrToObjectMap::size());
}

bool ScriptEngine::isGarbageCollecting() const {
    return _isGarbageCollecting;
}

void ScriptEngine::_setGarbageCollecting(bool isGarbageCollecting) { // NOLINT(readability-identifier-naming)
    _isGarbageCollecting = isGarbageCollecting;
}

/* static */
void ScriptEngine::_setDebuggerInfo(const DebuggerInfo &info) {
    debuggerInfo = info;
}

bool ScriptEngine::isValid() const {
    return _isValid;
}

bool ScriptEngine::evalString(const char *script, uint32_t length /* = 0 */, Value *ret /* = nullptr */, const char *fileName /* = nullptr */) {
    if (_engineThreadId != std::this_thread::get_id()) {
        // `evalString` should run in main thread
        CC_ABORT();
        return false;
    }

    CC_ASSERT_NOT_NULL(script);
    if (length == 0) {
        length = static_cast<uint32_t>(strlen(script));
    }

    if (fileName == nullptr) {
        fileName = "(no filename)";
    }

    // Fix the source url is too long displayed in Chrome debugger.
    ccstd::string sourceUrl = fileName;
    static const ccstd::string PREFIX_KEY = "/temp/quick-scripts/";
    size_t prefixPos = sourceUrl.find(PREFIX_KEY);
    if (prefixPos != ccstd::string::npos) {
        sourceUrl = sourceUrl.substr(prefixPos + PREFIX_KEY.length());
    }

    // It is needed, or will crash if invoked from non C++ context, such as invoked from objective-c context(for example, handler of UIKit).
    v8::HandleScope handleScope(_isolate);

    ccstd::string scriptStr(script, length);
    v8::MaybeLocal<v8::String> source = v8::String::NewFromUtf8(_isolate, scriptStr.c_str(), v8::NewStringType::kNormal);
    if (source.IsEmpty()) {
        return false;
    }

    v8::MaybeLocal<v8::String> originStr = v8::String::NewFromUtf8(_isolate, sourceUrl.c_str(), v8::NewStringType::kNormal);
    if (originStr.IsEmpty()) {
        return false;
    }

    v8::ScriptOrigin origin(_isolate, originStr.ToLocalChecked());
    v8::MaybeLocal<v8::Script> maybeScript = v8::Script::Compile(_context.Get(_isolate), source.ToLocalChecked(), &origin);

    bool success = false;

    if (!maybeScript.IsEmpty()) {
        v8::TryCatch block(_isolate);

        v8::Local<v8::Script> v8Script = maybeScript.ToLocalChecked();
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

ccstd::string ScriptEngine::getCurrentStackTrace() {
    if (!_isValid) {
        return ccstd::string();
    }

    v8::HandleScope hs(_isolate);
    v8::Local<v8::StackTrace> stack = v8::StackTrace::CurrentStackTrace(_isolate, JSB_STACK_FRAME_LIMIT, v8::StackTrace::kOverview);
    return stackTraceToString(stack);
}

void ScriptEngine::setFileOperationDelegate(const FileOperationDelegate &delegate) {
    _fileOperationDelegate = delegate;
}

const ScriptEngine::FileOperationDelegate &ScriptEngine::getFileOperationDelegate() const {
    return _fileOperationDelegate;
}

bool ScriptEngine::saveByteCodeToFile(const ccstd::string &path, const ccstd::string &pathBc) {
    bool success = false;
    auto *fu = cc::FileUtils::getInstance();

    if (pathBc.length() > 3 && pathBc.substr(pathBc.length() - 3) != ".bc") {
        SE_LOGE("ScriptEngine::generateByteCode bytecode file path should endwith \".bc\"\n");
        ;
        return false;
    }

    if (fu->isFileExist(pathBc)) {
        SE_LOGE("ScriptEngine::generateByteCode file already exists, it will be rewrite!\n");
    }

    // create directory for .bc file
    {
        auto lastSep = static_cast<int>(pathBc.size()) - 1;
        while (lastSep >= 0 && pathBc[lastSep] != '/') {
            lastSep -= 1;
        }

        if (lastSep == 0) {
            SE_LOGE("ScriptEngine::generateByteCode no directory component found in path %s\n", path.c_str());
            return false;
        }
        ccstd::string pathBcDir = pathBc.substr(0, lastSep);
        success = fu->createDirectory(pathBcDir);
        if (!success) {
            SE_LOGE("ScriptEngine::generateByteCode failed to create bytecode for %s\n", path.c_str());
            return success;
        }
    }

    // load script file
    ccstd::string scriptBuffer = _fileOperationDelegate.onGetStringFromFile(path);
    v8::Local<v8::String> code = v8::String::NewFromUtf8(_isolate, scriptBuffer.c_str(), v8::NewStringType::kNormal, static_cast<int>(scriptBuffer.length())).ToLocalChecked();
    v8::Local<v8::Value> scriptPath = v8::String::NewFromUtf8(_isolate, path.data(), v8::NewStringType::kNormal).ToLocalChecked();
    // create unbound script
    v8::ScriptOrigin origin(_isolate, scriptPath);
    v8::ScriptCompiler::Source source(code, origin);
    v8::Local<v8::Context> parsingContext = v8::Local<v8::Context>::New(_isolate, _context);
    v8::Context::Scope parsingScope(parsingContext);
    v8::TryCatch tryCatch(_isolate);
    v8::Local<v8::UnboundScript> v8Script = v8::ScriptCompiler::CompileUnboundScript(_isolate, &source, v8::ScriptCompiler::kEagerCompile)
                                                .ToLocalChecked();
    // create CachedData
    v8::ScriptCompiler::CachedData *cd = v8::ScriptCompiler::CreateCodeCache(v8Script);

    if (cd != nullptr) {
        // save to file
        cc::Data writeData;
        writeData.copy(cd->data, cd->length);
        success = fu->writeDataToFile(writeData, pathBc);
        if (!success) {
            SE_LOGE("ScriptEngine::generateByteCode write %s\n", pathBc.c_str());
        }

        // TODO(PatriceJiang): v8 on windows is built with dynamic library (dll),
        // Invoking `delete` for the memory allocated in v8.dll will cause crash.
        // Need to modify v8 source code and add v8::ScriptCompiler::DestroyCodeCache(v8::ScriptCompiler::CachedData *cd).
    #if CC_PLATFORM != CC_PLATFORM_WINDOWS
        delete cd;
    #endif
    } else {
        success = false;
    }

    return success;
}

bool ScriptEngine::runByteCodeFile(const ccstd::string &pathBc, Value *ret /* = nullptr */) {
    auto *fu = cc::FileUtils::getInstance();

    cc::Data cachedData;
    fu->getContents(pathBc, &cachedData);

    // read origin source file length from .bc file
    uint8_t *p = cachedData.getBytes() + 8;
    int filesize = p[0] + (p[1] << 8) + (p[2] << 16) + (p[3] << 24);

    {
        // fix bytecode
        v8::HandleScope scope(_isolate);
        v8::Local<v8::String> dummyBytecodeSource = v8::String::NewFromUtf8(_isolate, "\" \"", v8::NewStringType::kNormal).ToLocalChecked();
        v8::ScriptCompiler::Source dummySource(dummyBytecodeSource);
        v8::Local<v8::UnboundScript> dummyFunction = v8::ScriptCompiler::CompileUnboundScript(_isolate, &dummySource, v8::ScriptCompiler::kEagerCompile).ToLocalChecked();
        v8::ScriptCompiler::CachedData *dummyData = v8::ScriptCompiler::CreateCodeCache(dummyFunction);
        memcpy(p + 4, dummyData->data + 12, 4);

        // TODO(PatriceJiang): v8 on windows is built with dynamic library (dll),
        // Invoking `delete` for the memory allocated in v8.dll will cause crash.
        // Need to modify v8 source code and add v8::ScriptCompiler::DestroyCodeCache(v8::ScriptCompiler::CachedData *cd).
    #if CC_PLATFORM != CC_PLATFORM_WINDOWS
        delete dummyData;
    #endif
    }

    // setup ScriptOrigin
    v8::Local<v8::Value> scriptPath = v8::String::NewFromUtf8(_isolate, pathBc.data(), v8::NewStringType::kNormal).ToLocalChecked();
    v8::ScriptOrigin origin(_isolate, scriptPath, 0, 0, true);

    // restore CacheData
    auto *v8CacheData = ccnew v8::ScriptCompiler::CachedData(cachedData.getBytes(), static_cast<int>(cachedData.getSize()));
    v8::Local<v8::String> dummyCode;

    // generate dummy code
    if (filesize > 0) {
        ccstd::vector<char> codeBuffer;
        codeBuffer.resize(filesize + 1);
        std::fill(codeBuffer.begin(), codeBuffer.end(), ' ');
        codeBuffer[0] = '\"';
        codeBuffer[filesize - 1] = '\"';
        codeBuffer[filesize] = '\0';
        dummyCode = v8::String::NewFromUtf8(_isolate, codeBuffer.data(), v8::NewStringType::kNormal, filesize).ToLocalChecked();

        CC_ASSERT(dummyCode->Length() == filesize);
    }

    v8::ScriptCompiler::Source source(dummyCode, origin, v8CacheData);

    if (source.GetCachedData() == nullptr) {
        SE_LOGE("ScriptEngine::runByteCodeFile can not load cacheData for %s", pathBc.c_str());
        return false;
    }

    v8::TryCatch tryCatch(_isolate);
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

    v8::Local<v8::Script> runnableScript = v8Script->BindToCurrentContext();
    v8::MaybeLocal<v8::Value> result = runnableScript->Run(_context.Get(_isolate));

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

bool ScriptEngine::runScript(const ccstd::string &path, Value *ret /* = nullptr */) {
    CC_ASSERT(!path.empty());
    CC_ASSERT(_fileOperationDelegate.isValid());

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

    ccstd::string scriptBuffer = _fileOperationDelegate.onGetStringFromFile(path);

    if (!scriptBuffer.empty()) {
        return evalString(scriptBuffer.c_str(), static_cast<uint32_t>(scriptBuffer.length()), ret, path.c_str());
    }

    SE_LOGE("ScriptEngine::runScript script %s, buffer is empty!\n", path.c_str());
    return false;
}

void ScriptEngine::clearException() {
    // IDEA:
}

void ScriptEngine::throwException(const ccstd::string &errorMessage) {
    v8::HandleScope scope(_isolate);
    v8::Local<v8::String> message = v8::String::NewFromUtf8(_isolate, errorMessage.data()).ToLocalChecked();
    v8::Local<v8::Value> error = v8::Exception::Error(message);
    _isolate->ThrowException(error);
}

void ScriptEngine::setExceptionCallback(const ExceptionCallback &cb) {
    _nativeExceptionCallback = cb;
}

void ScriptEngine::setJSExceptionCallback(const ExceptionCallback &cb) {
    _jsExceptionCallback = cb;
}

v8::Local<v8::Context> ScriptEngine::_getContext() const { // NOLINT(readability-identifier-naming)
    return _context.Get(_isolate);
}

void ScriptEngine::enableDebugger(const ccstd::string &serverAddr, uint32_t port, bool isWait) {
    _debuggerServerAddr = serverAddr;
    _debuggerServerPort = port;
    _isWaitForConnect = isWait;
}

bool ScriptEngine::isDebuggerEnabled() const {
    return !_debuggerServerAddr.empty() && _debuggerServerPort > 0;
}

void ScriptEngine::mainLoopUpdate() {
    // empty implementation
}

bool ScriptEngine::callFunction(Object *targetObj, const char *funcName, uint32_t argc, Value *args, Value *rval /* = nullptr*/) {
    v8::HandleScope handleScope(_isolate);

    v8::MaybeLocal<v8::String> nameValue = _getStringPool().get(_isolate, funcName);

    if (nameValue.IsEmpty()) {
        if (rval != nullptr) {
            rval->setUndefined();
        }
        return false;
    }

    v8::Local<v8::String> nameValToLocal = nameValue.ToLocalChecked();
    v8::Local<v8::Context> context = _isolate->GetCurrentContext();
    v8::Local<v8::Object> localObj = targetObj->_obj.handle(_isolate);

    v8::MaybeLocal<v8::Value> funcVal = localObj->Get(context, nameValToLocal);
    if (funcVal.IsEmpty()) {
        if (rval != nullptr) {
            rval->setUndefined();
        }
        return false;
    }

    SE_ASSERT(argc < 11, "Only support argument count that less than 11"); // NOLINT
    ccstd::array<v8::Local<v8::Value>, 10> argv;

    for (size_t i = 0; i < argc; ++i) {
        internal::seToJsValue(_isolate, args[i], &argv[i]);
    }

    #if CC_DEBUG
    v8::TryCatch tryCatch(_isolate);
    #endif

    CC_ASSERT(!funcVal.IsEmpty());
    if (!funcVal.ToLocalChecked()->IsFunction()) {
        v8::String::Utf8Value funcStr(_isolate, funcVal.ToLocalChecked());
        SE_REPORT_ERROR("%s is not a function: %s", funcName, *funcStr);
        return false;
    }

    v8::MaybeLocal<v8::Object> funcObj = funcVal.ToLocalChecked()->ToObject(context);
    v8::MaybeLocal<v8::Value> result = funcObj.ToLocalChecked()->CallAsFunction(_getContext(), localObj, argc, argv.data());

    #if CC_DEBUG
    if (tryCatch.HasCaught()) {
        v8::String::Utf8Value stack(_isolate, tryCatch.StackTrace(context).ToLocalChecked());
        SE_REPORT_ERROR("Invoking function failed, %s", *stack);
        if (rval != nullptr) {
            rval->setUndefined();
        }
        tryCatch.ReThrow();
        return false;
    }
    #endif

    if (!result.IsEmpty()) {
        if (rval != nullptr) {
            internal::jsToSeValue(_isolate, result.ToLocalChecked(), rval);
        }
    }
    return true;
}

// VMStringPool
ScriptEngine::VMStringPool::VMStringPool() = default;

ScriptEngine::VMStringPool::~VMStringPool() = default;

v8::MaybeLocal<v8::String> ScriptEngine::VMStringPool::get(v8::Isolate *isolate, const char *name) {
    v8::Local<v8::String> ret;
    auto iter = _vmStringPoolMap.find(name);
    if (iter == _vmStringPoolMap.end()) {
        v8::MaybeLocal<v8::String> nameValue = v8::String::NewFromUtf8(isolate, name, v8::NewStringType::kNormal);
        if (!nameValue.IsEmpty()) {
            auto *persistentName = ccnew v8::Persistent<v8::String>();
            persistentName->Reset(isolate, nameValue.ToLocalChecked());
            _vmStringPoolMap.emplace(name, persistentName);
            ret = v8::Local<v8::String>::New(isolate, *persistentName);
        }
    } else {
        ret = v8::Local<v8::String>::New(isolate, *iter->second);
    }

    return ret;
}

void ScriptEngine::VMStringPool::clear() {
    for (auto &e : _vmStringPoolMap) {
        e.second->Reset();
        delete e.second;
    }
    _vmStringPoolMap.clear();
}

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8
