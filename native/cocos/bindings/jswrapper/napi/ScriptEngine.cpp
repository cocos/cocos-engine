#include "ScriptEngine.h"
#include <sstream>
#include "../MappingUtils.h"
#include "Class.h"
#include "CommonHeader.h"
#include "Utils.h"
#if USE_NODE_NAPI
    #include "../State.h"
    #include "js_native_api.h"
    #include "js_native_api_v8.h"

    #if SE_ENABLE_INSPECTOR
        #include "../v8/debugger/env.h"
        #include "../v8/debugger/inspector_agent.h"
        #include "../v8/debugger/node.h"
    #endif

#else
    #include <napi/native_api.h>
#endif
#define EXPOSE_GC "__jsb_gc__"
#if USE_NODE_NAPI
    #include "v8/libplatform/libplatform.h"
    #include "v8/v8.h"
namespace {
class ScriptEngineV8Context {
public:
    ScriptEngineV8Context() {
        platform = v8::platform::NewDefaultPlatform().release();
        v8::V8::InitializePlatform(platform);
        std::string flags;
        //NOTICE: spaces are required between flags
        flags.append(" --expose-gc-as=" EXPOSE_GC);
        flags.append(" --no-flush-bytecode --no-lazy"); // for bytecode support
        //flags.append(" --print-all-exceptions");
        //flags.append(" --detailed-error-stack-trace");
        //flags.append(" --jitless");
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

std::unique_ptr<ScriptEngineV8Context> gSharedV8;
se::Value                              oldConsoleLog;
se::Value                              oldConsoleDebug;
se::Value                              oldConsoleInfo;
se::Value                              oldConsoleWarn;
se::Value                              oldConsoleError;
se::Value                              oldConsoleAssert;

bool jsbConsoleFormatLog(se::State &state, const char *prefix, int msgIndex = 0) {
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

bool jsbConsoleLog(se::State &s) {
    jsbConsoleFormatLog(s, "");
    oldConsoleLog.toObject()->call(s.args(), s.thisObject());
    return true;
}
SE_BIND_FUNC(jsbConsoleLog)

bool jsbConsoleDebug(se::State &s) {
    jsbConsoleFormatLog(s, "[DEBUG]: ");
    oldConsoleDebug.toObject()->call(s.args(), s.thisObject());
    return true;
}
SE_BIND_FUNC(jsbConsoleDebug)

bool jsbConsoleInfo(se::State &s) {
    jsbConsoleFormatLog(s, "[INFO]: ");
    oldConsoleInfo.toObject()->call(s.args(), s.thisObject());
    return true;
}
SE_BIND_FUNC(jsbConsoleInfo)

bool jsbConsoleWarn(se::State &s) {
    jsbConsoleFormatLog(s, "[WARN]: ");
    oldConsoleWarn.toObject()->call(s.args(), s.thisObject());
    return true;
}
SE_BIND_FUNC(jsbConsoleWarn)

bool jsbConsoleError(se::State &s) {
    jsbConsoleFormatLog(s, "[ERROR]: ");
    oldConsoleError.toObject()->call(s.args(), s.thisObject());
    auto trace = se::ScriptEngine::getInstance()->getCurrentStackTrace();
    SE_LOGE("[stack]: %s\n", trace.c_str());
    return true;
}
SE_BIND_FUNC(jsbConsoleError)

bool jsbConsoleAssert(se::State &s) {
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

void rewriteConsoleFunctions(napi_env env) {
    se::AutoHandleScope scope;
    napi_value          global;
    napi_get_global(env, &global);
    se::Object *globalObj = se::Object::_createJSObject(env, global, nullptr);
    globalObj->root();
    se::Value consoleVal;
    if (globalObj->getProperty("console", &consoleVal) && consoleVal.isObject()) {
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

void onPromiseRejectCallback(v8::PromiseRejectMessage msg) {
    v8::Isolate *     isolate = se::ScriptEngine::getInstance()->getEnv()->isolate;
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

    auto stackStr = se::ScriptEngine::getInstance()->getCurrentStackTrace();
    ss << "stacktrace: " << std::endl;
    ss << stackStr << std::endl;
    SE_LOGE("unhandled exception: %s \n", ss.str().c_str());
    //getInstance()->callExceptionCallback("", eventName, ss.str().c_str());
}
void onMessageCallback(v8::Local<v8::Message> message, v8::Local<v8::Value> /*data*/) {
    auto *                thiz   = se::ScriptEngine::getInstance();
    auto *                env    = thiz->getEnv();
    v8::Local<v8::String> msg    = message->Get();
    v8::ScriptOrigin      origin = message->GetScriptOrigin();

    v8::String::Utf8Value resouceName(env->isolate, origin.ResourceName());
    v8::String::Utf8Value msgStr(env->isolate, msg);

    std::stringstream errorStr;
    errorStr << *msgStr << ", location: ";
    errorStr << *resouceName << ":" << origin.LineOffset() << ":" << origin.ColumnOffset();

    std::string stackStr = stackTraceToString(message->GetStackTrace());
    if (!stackStr.empty()) {
        errorStr << std::endl
                 << "STACK:" << std::endl
                 << stackStr;
    }
    SE_LOGE("ERROR: %s\n", errorStr.str().c_str());
}
} // namespace

#endif

namespace se {

AutoHandleScope::AutoHandleScope() {
    napi_open_handle_scope(ScriptEngine::getInstance()->getEnv(), &_handleScope);
}

AutoHandleScope::~AutoHandleScope() {
    napi_close_handle_scope(ScriptEngine::getInstance()->getEnv(), _handleScope);
}

ScriptEngine *gSriptEngineInstance = nullptr;

ScriptEngine::ScriptEngine() {
#if USE_NODE_NAPI
    if (!gSharedV8) {
        gSharedV8.reset(new ScriptEngineV8Context());
    }
#endif
} // namespace se

ScriptEngine::~ScriptEngine() = default;

void ScriptEngine::setFileOperationDelegate(const FileOperationDelegate &delegate) {
    _fileOperationDelegate = delegate;
}

const ScriptEngine::FileOperationDelegate &ScriptEngine::getFileOperationDelegate() const {
    return _fileOperationDelegate;
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

bool ScriptEngine::runScript(const std::string &path, Value *ret /* = nullptr */) {
    AutoHandleScope scope;

    assert(!path.empty());
    napi_status status;
    napi_value  result = nullptr;
    SE_LOGD("run script : %s\n", path.c_str());
#if USE_NODE_NAPI
    std::string content = _fileOperationDelegate.onGetStringFromFile(path);
    if (content.empty()) {
        SE_LOGE("file content of %s is empty!\n", path.c_str());
        return false;
    }
    return evalString(content.data(), content.length(), ret, path.c_str());
#else
    //NODE_API_CALL(status, ScriptEngine::getEnv(), napi_run_script_path(ScriptEngine::getEnv(), path.c_str(), &result));
    if (ret && result) {
        internal::jsToSeValue(result, ret);
    }
    return false;
#endif
}

bool ScriptEngine::evalString(const char *scriptStr, ssize_t length, Value *ret, const char *fileName) {
    AutoHandleScope scope;

    napi_status status;
    napi_value  script;
    napi_value  result;
    length = length < 0 ? NAPI_AUTO_LENGTH : length;
    status = napi_create_string_utf8(ScriptEngine::getEnv(), scriptStr, length, &script);
    //SE_LOGD("eval :%s\n", scriptStr);

#if USE_NODE_NAPI
    status = napi_run_script_with_filename(getEnv(), script, fileName, &result);
#else
    NODE_API_CALL(status, ScriptEngine::getEnv(), napi_run_script(ScriptEngine::getEnv(), script, &result));
#endif
    if (status == napi_ok) {
        if (ret) {
            internal::jsToSeValue(result, ret);
        }
        return true;
    }
    return false;
}

bool ScriptEngine::init() {
    napi_status status;
    napi_value  result;

    for (const auto &hook : _beforeInitHookArray) {
        hook();
    }

#if USE_NODE_NAPI
    v8::Isolate::CreateParams createParams;
    createParams.array_buffer_allocator = v8::ArrayBuffer::Allocator::NewDefaultAllocator();
    _isolate                            = v8::Isolate::New(createParams);
    v8::HandleScope hs(_isolate);
    _isolate->Enter();

    _isolate->SetCaptureStackTraceForUncaughtExceptions(true, 20, v8::StackTrace::kDetailed);
    /* _isolate->SetFatalErrorHandler(onFatalErrorCallback);
    _isolate->SetOOMErrorHandler(onOOMErrorCallback);
    */
    _isolate->AddMessageListener(onMessageCallback);
    _isolate->SetPromiseRejectCallback(onPromiseRejectCallback);
    _context.Reset(_isolate, v8::Context::New(_isolate));
    _context.Get(_isolate)->Enter();
    setEnv(new napi_env__{_context.Get(_isolate)});

    rewriteConsoleFunctions(_env);

#endif

    Object::setup();
    NativePtrToObjectMap::init();
    NonRefNativePtrCreatedByCtorMap::init();

    NODE_API_CALL(status, ScriptEngine::getEnv(), napi_get_global(ScriptEngine::getEnv(), &result));
    _globalObj = Object::_createJSObject(ScriptEngine::getEnv(), result, nullptr);
    _globalObj->root();
    _globalObj->setProperty("window", Value(_globalObj));
    _globalObj->setProperty("scriptEngineType", se::Value("napi"));

    _isValid = true;

    for (const auto &hook : _afterInitHookArray) {
        hook();
    }
    _afterInitHookArray.clear();

    return _isValid;
}

Object *ScriptEngine::getGlobalObject() const {
    return _globalObj;
}

bool ScriptEngine::start() {
    bool ok = true;
    if (!init()) {
        return false;
    }
    _startTime = std::chrono::steady_clock::now();

    AutoHandleScope scope;

    // V8 inspector stuff, most code are taken from NodeJS.
    if (isDebuggerEnabled()) {
#if SE_ENABLE_INSPECTOR
        uv_loop_t *new_loop = uv_loop_new();
        _isolateData        = node::CreateIsolateData(_isolate, new_loop);
        _debuggerEnv        = node::CreateEnvironment(_isolateData, _context.Get(_isolate), 0, nullptr, 0, nullptr);

        node::DebugOptions options;
        options.set_wait_for_connect(_debuggerSyncWait); // the program will be hung up until debug attach if _isWaitForConnect = true
        options.set_inspector_enabled(true);
        options.set_port(_debuggerPort);
        options.set_host_name(_debuggerHost);
        bool debuggerBooted = _debuggerEnv->inspector_agent()->Start(gSharedV8->platform, "", options);
        assert(debuggerBooted);
#endif
    }

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

void ScriptEngine::cleanup() {
    if (!_isValid) {
        return;
    }

    SE_LOGD("ScriptEngine::cleanup begin ...\n");
    _isInCleanup = true;

    for (const auto &hook : _beforeCleanupHookArray) {
        hook();
    }
    _beforeCleanupHookArray.clear();

    SAFE_DEC_REF(_globalObj);
    Object::cleanup();
    Class::cleanup();
    garbageCollect();

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
    SE_LOGD("ScriptEngine::cleanup end ...\n");
}

void ScriptEngine::addBeforeCleanupHook(const std::function<void()> &hook) {
    _beforeCleanupHookArray.push_back(hook);
    return;
}

void ScriptEngine::addAfterCleanupHook(const std::function<void()> &hook) {
    _afterCleanupHookArray.push_back(hook);
    return;
}

void ScriptEngine::addRegisterCallback(RegisterCallback cb) {
    assert(std::find(_registerCallbackArray.begin(), _registerCallbackArray.end(), cb) == _registerCallbackArray.end());
    _registerCallbackArray.push_back(cb);
}

napi_env ScriptEngine::getEnv() {
    return getInstance()->_env;
}

void ScriptEngine::setEnv(napi_env env) {
    getInstance()->_env = env;
}

void ScriptEngine::addPermanentRegisterCallback(RegisterCallback cb) {
    if (std::find(_permRegisterCallbackArray.begin(), _permRegisterCallbackArray.end(), cb) == _permRegisterCallbackArray.end()) {
        _permRegisterCallbackArray.push_back(cb);
    }
}

void ScriptEngine::setExceptionCallback(const ExceptionCallback &cb) {
    //not impl
    return;
}

const std::chrono::steady_clock::time_point &ScriptEngine::getStartTime() const {
    return _startTime;
}

bool ScriptEngine::isValid() const {
    return _isValid;
}

void ScriptEngine::enableDebugger(const std::string &serverAddr, uint32_t port, bool isWait) {
    _debuggerHost     = serverAddr;
    _debuggerPort     = port;
    _debuggerSyncWait = isWait;
    return;
}

bool ScriptEngine::isDebuggerEnabled() const {
    return !_debuggerHost.empty() && _debuggerPort > 0;
}

bool ScriptEngine::saveByteCodeToFile(const std::string &path, const std::string &pathBc) {
    //not impl
    return true;
}

void ScriptEngine::throwException(const std::string &errorMessage) {
    napi_status status;
    NODE_API_CALL(status, env_, napi_throw_error(_env, "js error", errorMessage.c_str()));
}

void ScriptEngine::clearException() {
    //not impl
    return;
}

void ScriptEngine::garbageCollect() {
    //not impl
    return;
}

void ScriptEngine::setJSExceptionCallback(const ExceptionCallback &cb) {
    //not impl
    return;
}

void ScriptEngine::addAfterInitHook(const std::function<void()> &hook) {
    _afterInitHookArray.push_back(hook);
    return;
}

std::string ScriptEngine::getCurrentStackTrace() {
//not impl
#if USE_NODE_NAPI
    if (!_isValid) {
        return std::string();
    }

    v8::HandleScope           hs(_isolate);
    v8::Local<v8::StackTrace> stack = v8::StackTrace::CurrentStackTrace(_isolate, 20, v8::StackTrace::kOverview);
    return stackTraceToString(stack);
#else
    return "";
#endif
}

void ScriptEngine::_setNeedCallConstructor(bool need) {
    _isneedCallConstructor = need;
}

bool ScriptEngine::_needCallConstructor() {
    return _isneedCallConstructor;
}
}; // namespace se
