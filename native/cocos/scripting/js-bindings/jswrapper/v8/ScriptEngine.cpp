/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

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
#include "ScriptEngine.hpp"
#include "platform/CCPlatformConfig.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8

#include "Object.hpp"
#include "Class.hpp"
#include "Utils.hpp"
#include "../State.hpp"
#include "../MappingUtils.hpp"

#if SE_ENABLE_INSPECTOR
#include "debugger/inspector_agent.h"
#include "debugger/env.h"
#include "debugger/node.h"
#endif

uint32_t __jsbInvocationCount = 0;
uint32_t __jsbStackFrameLimit = 20;

#define RETRUN_VAL_IF_FAIL(cond, val) \
    if (!(cond)) return val

namespace se {

    Class* __jsb_CCPrivateData_class = nullptr;

    namespace {
        ScriptEngine* __instance = nullptr;

        void __log(const v8::FunctionCallbackInfo<v8::Value>& info)
        {
            if (info[0]->IsString())
            {
                v8::String::Utf8Value utf8(v8::Isolate::GetCurrent(), info[0]);
                SE_LOGD("JS: %s\n", *utf8);
            }
        }

        void __forceGC(const v8::FunctionCallbackInfo<v8::Value>& info)
        {
            ScriptEngine::getInstance()->garbageCollect();
        }

        std::string stackTraceToString(v8::Local<v8::StackTrace> stack)
        {
            std::string stackStr;
            if (stack.IsEmpty())
                return stackStr;

            char tmp[100] = {0};
            for (int i = 0, e = stack->GetFrameCount(); i < e; ++i)
            {
                v8::Local<v8::StackFrame> frame = stack->GetFrame(v8::Isolate::GetCurrent(), i);
                v8::Local<v8::String> script = frame->GetScriptName();
                std::string scriptName;
                if (!script.IsEmpty())
                {
                    scriptName = *v8::String::Utf8Value(v8::Isolate::GetCurrent(), script);
                }

                v8::Local<v8::String> func = frame->GetFunctionName();
                std::string funcName;
                if (!func.IsEmpty())
                {
                    funcName = *v8::String::Utf8Value(v8::Isolate::GetCurrent(), func);
                }

                stackStr += "[";
                snprintf(tmp, sizeof(tmp), "%d", i);
                stackStr += tmp;
                stackStr += "]";
                stackStr += (funcName.empty() ? "anonymous" : funcName.c_str());
                stackStr += "@";
                stackStr += (scriptName.empty() ? "(no filename)" : scriptName.c_str());
                stackStr += ":";
                snprintf(tmp, sizeof(tmp), "%d", frame->GetLineNumber());
                stackStr += tmp;

                if (i < (e-1))
                {
                    stackStr += "\n";
                }
            }

            return stackStr;
        }

        se::Value __oldConsoleLog;
        se::Value __oldConsoleDebug;
        se::Value __oldConsoleInfo;
        se::Value __oldConsoleWarn;
        se::Value __oldConsoleError;
        se::Value __oldConsoleAssert;

        bool JSB_console_format_log(State& s, const char* prefix, int msgIndex = 0)
        {
            if (msgIndex < 0)
                return false;

            const auto& args = s.args();
            int argc = (int)args.size();
            if ((argc - msgIndex) == 1)
            {
                std::string msg = args[msgIndex].toStringForce();
                SE_LOGD("JS: %s%s\n", prefix, msg.c_str());
            }
            else if (argc > 1)
            {
                std::string msg = args[msgIndex].toStringForce();
                size_t pos;
                for (int i = (msgIndex+1); i < argc; ++i)
                {
                    pos = msg.find("%");
                    if (pos != std::string::npos && pos != (msg.length()-1) && (msg[pos+1] == 'd' || msg[pos+1] == 's' || msg[pos+1] == 'f'))
                    {
                        msg.replace(pos, 2, args[i].toStringForce());
                    }
                    else
                    {
                        msg += " " + args[i].toStringForce();
                    }
                }

                SE_LOGD("JS: %s%s\n", prefix, msg.c_str());
            }

            return true;
        }

        bool JSB_console_log(State& s)
        {
            JSB_console_format_log(s, "");
            __oldConsoleLog.toObject()->call(s.args(), s.thisObject());
            return true;
        }
        SE_BIND_FUNC(JSB_console_log)

        bool JSB_console_debug(State& s)
        {
            JSB_console_format_log(s, "[DEBUG]: ");
            __oldConsoleDebug.toObject()->call(s.args(), s.thisObject());
            return true;
        }
        SE_BIND_FUNC(JSB_console_debug)

        bool JSB_console_info(State& s)
        {
            JSB_console_format_log(s, "[INFO]: ");
            __oldConsoleInfo.toObject()->call(s.args(), s.thisObject());
            return true;
        }
        SE_BIND_FUNC(JSB_console_info)

        bool JSB_console_warn(State& s)
        {
            JSB_console_format_log(s, "[WARN]: ");
            __oldConsoleWarn.toObject()->call(s.args(), s.thisObject());
            return true;
        }
        SE_BIND_FUNC(JSB_console_warn)

        bool JSB_console_error(State& s)
        {
            JSB_console_format_log(s, "[ERROR]: ");
            __oldConsoleError.toObject()->call(s.args(), s.thisObject());
            return true;
        }
        SE_BIND_FUNC(JSB_console_error)

        bool JSB_console_assert(State& s)
        {
            const auto& args = s.args();
            if (!args.empty())
            {
                if (args[0].isBoolean() && !args[0].toBoolean())
                {
                    JSB_console_format_log(s, "[ASSERT]: ", 1);
                    __oldConsoleAssert.toObject()->call(s.args(), s.thisObject());
                }
            }
            return true;
        }
        SE_BIND_FUNC(JSB_console_assert)

    } // namespace {

    void ScriptEngine::onFatalErrorCallback(const char* location, const char* message)
    {
        std::string errorStr = "[FATAL ERROR] location: ";
        errorStr += location;
        errorStr += ", message: ";
        errorStr += message;

        SE_LOGE("%s\n", errorStr.c_str());
        if (getInstance()->_exceptionCallback != nullptr)
        {
            getInstance()->_exceptionCallback(location, message, "(no stack information)");
        }
    }

    void ScriptEngine::onOOMErrorCallback(const char* location, bool is_heap_oom)
    {
        std::string errorStr = "[OOM ERROR] location: ";
        errorStr += location;
        std::string message;
        message = "is heap out of memory: ";
        if (is_heap_oom)
            message += "true";
        else
            message += "false";

        errorStr += ", " + message;
        SE_LOGE("%s\n", errorStr.c_str());
        if (getInstance()->_exceptionCallback != nullptr)
        {
            getInstance()->_exceptionCallback(location, message.c_str(), "(no stack information)");
        }
    }

    void ScriptEngine::onMessageCallback(v8::Local<v8::Message> message, v8::Local<v8::Value> data)
    {
        ScriptEngine* thiz = getInstance();
        v8::Local<v8::String> msg = message->Get();
        Value msgVal;
        internal::jsToSeValue(v8::Isolate::GetCurrent(), msg, &msgVal);
        assert(msgVal.isString());
        v8::ScriptOrigin origin = message->GetScriptOrigin();
        Value resouceNameVal;
        internal::jsToSeValue(v8::Isolate::GetCurrent(), origin.ResourceName(), &resouceNameVal);
        Value line;
        internal::jsToSeValue(v8::Isolate::GetCurrent(), origin.ResourceLineOffset(), &line);
        Value column;
        internal::jsToSeValue(v8::Isolate::GetCurrent(), origin.ResourceColumnOffset(), &column);

        std::string location = resouceNameVal.toStringForce() + ":" + line.toStringForce() + ":" + column.toStringForce();

        std::string errorStr = msgVal.toString() + ", location: " + location;
        std::string stackStr = stackTraceToString(message->GetStackTrace());
        if (!stackStr.empty())
        {
            if (line.toInt32() == 0)
            {
                location = "(see stack)";
            }
            errorStr += "\nSTACK:\n" + stackStr;
        }
        SE_LOGE("ERROR: %s\n", errorStr.c_str());

        if (thiz->_exceptionCallback != nullptr)
        {
            thiz->_exceptionCallback(location.c_str(), msgVal.toString().c_str(), stackStr.c_str());
        }

        if (!thiz->_isErrorHandleWorking)
        {
            thiz->_isErrorHandleWorking = true;

            Value errorHandler;
            if (thiz->_globalObj->getProperty("__errorHandler", &errorHandler) && errorHandler.isObject() && errorHandler.toObject()->isFunction())
            {
                ValueArray args;
                args.push_back(resouceNameVal);
                args.push_back(line);
                args.push_back(msgVal);
                args.push_back(Value(stackStr));
                errorHandler.toObject()->call(args, thiz->_globalObj);
            }

            thiz->_isErrorHandleWorking = false;
        }
        else
        {
            SE_LOGE("ERROR: __errorHandler has exception\n");
        }
    }

    void ScriptEngine::privateDataFinalize(void* nativeObj)
    {
        internal::PrivateData* p = (internal::PrivateData*)nativeObj;

        Object::nativeObjectFinalizeHook(p->data);

        assert(p->seObj->getRefCount() == 1);

        p->seObj->decRef();

        free(p);
    }

    ScriptEngine *ScriptEngine::getInstance()
    {
        if (__instance == nullptr)
        {
            __instance = new ScriptEngine();
        }

        return __instance;
    }

    void ScriptEngine::destroyInstance()
    {
        delete __instance;
        __instance = nullptr;
    }

    ScriptEngine::ScriptEngine()
    : _platform(nullptr)
    , _isolate(nullptr)
    , _handleScope(nullptr)
    , _globalObj(nullptr)
    , _exceptionCallback(nullptr)
#if SE_ENABLE_INSPECTOR
    , _env(nullptr)
    , _isolateData(nullptr)
#endif
    , _debuggerServerPort(0)
    , _vmId(0)
    , _isValid(false)
    , _isGarbageCollecting(false)
    , _isInCleanup(false)
    , _isErrorHandleWorking(false)
    {
        //        RETRUN_VAL_IF_FAIL(v8::V8::InitializeICUDefaultLocation(nullptr, "/Users/james/Project/v8/out.gn/x64.debug/icudtl.dat"), false);
        //        v8::V8::InitializeExternalStartupData("/Users/james/Project/v8/out.gn/x64.debug/natives_blob.bin", "/Users/james/Project/v8/out.gn/x64.debug/snapshot_blob.bin"); //REFINE
        _platform = v8::platform::NewDefaultPlatform().release();
        v8::V8::InitializePlatform(_platform);
        bool ok = v8::V8::Initialize();
        assert(ok);
    }

    ScriptEngine::~ScriptEngine()
    {
        cleanup();
        v8::V8::Dispose();
        v8::V8::ShutdownPlatform();
        delete _platform;
    }

    bool ScriptEngine::init()
    {
        cleanup();
        SE_LOGD("Initializing V8, version: %s\n", v8::V8::GetVersion());
        ++_vmId;

        for (const auto& hook : _beforeInitHookArray)
        {
            hook();
        }
        _beforeInitHookArray.clear();

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
        std::string flags("--jitless");
        v8::V8::SetFlagsFromString(flags.c_str(), (int)flags.length());
#endif
        v8::Isolate::CreateParams create_params;
        create_params.array_buffer_allocator = v8::ArrayBuffer::Allocator::NewDefaultAllocator();
        _isolate = v8::Isolate::New(create_params);
        v8::HandleScope hs(_isolate);
        _isolate->Enter();

        _isolate->SetCaptureStackTraceForUncaughtExceptions(true, __jsbStackFrameLimit, v8::StackTrace::kOverview);

        _isolate->SetFatalErrorHandler(onFatalErrorCallback);
        _isolate->SetOOMErrorHandler(onOOMErrorCallback);
        _isolate->AddMessageListener(onMessageCallback);

        _context.Reset(_isolate, v8::Context::New(_isolate));
        _context.Get(_isolate)->Enter();

        NativePtrToObjectMap::init();
        NonRefNativePtrCreatedByCtorMap::init();

        Class::setIsolate(_isolate);
        Object::setIsolate(_isolate);

        _globalObj = Object::_createJSObject(nullptr, _context.Get(_isolate)->Global());
        _globalObj->root();
        _globalObj->setProperty("window", Value(_globalObj));

        se::Value consoleVal;
        if (_globalObj->getProperty("console", &consoleVal) && consoleVal.isObject())
        {
            consoleVal.toObject()->getProperty("log", &__oldConsoleLog);
            consoleVal.toObject()->defineFunction("log", _SE(JSB_console_log));

            consoleVal.toObject()->getProperty("debug", &__oldConsoleDebug);
            consoleVal.toObject()->defineFunction("debug", _SE(JSB_console_debug));

            consoleVal.toObject()->getProperty("info", &__oldConsoleInfo);
            consoleVal.toObject()->defineFunction("info", _SE(JSB_console_info));

            consoleVal.toObject()->getProperty("warn", &__oldConsoleWarn);
            consoleVal.toObject()->defineFunction("warn", _SE(JSB_console_warn));

            consoleVal.toObject()->getProperty("error", &__oldConsoleError);
            consoleVal.toObject()->defineFunction("error", _SE(JSB_console_error));

            consoleVal.toObject()->getProperty("assert", &__oldConsoleAssert);
            consoleVal.toObject()->defineFunction("assert", _SE(JSB_console_assert));
        }

        _globalObj->setProperty("scriptEngineType", se::Value("V8"));

        _globalObj->defineFunction("log", __log);
        _globalObj->defineFunction("forceGC", __forceGC);

        __jsb_CCPrivateData_class = Class::create("__PrivateData", _globalObj, nullptr, nullptr);
        __jsb_CCPrivateData_class->defineFinalizeFunction(privateDataFinalize);
        __jsb_CCPrivateData_class->setCreateProto(false);
        __jsb_CCPrivateData_class->install();

        _isValid = true;

        for (const auto& hook : _afterInitHookArray)
        {
            hook();
        }
        _afterInitHookArray.clear();

        return _isValid;
    }

    void ScriptEngine::cleanup()
    {
        if (!_isValid)
            return;

        SE_LOGD("ScriptEngine::cleanup begin ...\n");
        _isInCleanup = true;

        {
            AutoHandleScope hs;
            for (const auto& hook : _beforeCleanupHookArray)
            {
                hook();
            }
            _beforeCleanupHookArray.clear();

            SAFE_DEC_REF(_globalObj);
            Object::cleanup();
            Class::cleanup();
            garbageCollect();

            __oldConsoleLog.setUndefined();
            __oldConsoleDebug.setUndefined();
            __oldConsoleInfo.setUndefined();
            __oldConsoleWarn.setUndefined();
            __oldConsoleError.setUndefined();
            __oldConsoleAssert.setUndefined();

#if SE_ENABLE_INSPECTOR
            if (_isolateData != nullptr)
            {
                node::FreeIsolateData(_isolateData);
                _isolateData = nullptr;
            }

            if (_env != nullptr)
            {
                _env->inspector_agent()->Stop();
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
        _globalObj = nullptr;
        _isValid = false;

        _registerCallbackArray.clear();

        for (const auto& hook : _afterCleanupHookArray)
        {
            hook();
        }
        _afterCleanupHookArray.clear();

        _isInCleanup = false;
        NativePtrToObjectMap::destroy();
        NonRefNativePtrCreatedByCtorMap::destroy();

        SE_LOGD("ScriptEngine::cleanup end ...\n");
    }

    Object* ScriptEngine::getGlobalObject() const
    {
        return _globalObj;
    }

    void ScriptEngine::addBeforeInitHook(const std::function<void()>& hook)
    {
        _beforeInitHookArray.push_back(hook);
    }

    void ScriptEngine::addAfterInitHook(const std::function<void()>& hook)
    {
        _afterInitHookArray.push_back(hook);
    }

    void ScriptEngine::addBeforeCleanupHook(const std::function<void()>& hook)
    {
        _beforeCleanupHookArray.push_back(hook);
    }

    void ScriptEngine::addAfterCleanupHook(const std::function<void()>& hook)
    {
        _afterCleanupHookArray.push_back(hook);
    }

    void ScriptEngine::addRegisterCallback(RegisterCallback cb)
    {
        assert(std::find(_registerCallbackArray.begin(), _registerCallbackArray.end(), cb) == _registerCallbackArray.end());
        _registerCallbackArray.push_back(cb);
    }

    bool ScriptEngine::start()
    {
        if (!init())
            return false;

        se::AutoHandleScope hs;

        // debugger
        if (isDebuggerEnabled())
        {
#if SE_ENABLE_INSPECTOR
            // V8 inspector stuff, most code are taken from NodeJS.
            _isolateData = node::CreateIsolateData(_isolate, uv_default_loop());
            _env = node::CreateEnvironment(_isolateData, _context.Get(_isolate), 0, nullptr, 0, nullptr);

            node::DebugOptions options;
            options.set_wait_for_connect(_isWaitForConnect);// the program will be hung up until debug attach if _isWaitForConnect = true
            options.set_inspector_enabled(true);
            options.set_port((int)_debuggerServerPort);
            options.set_host_name(_debuggerServerAddr.c_str());
            bool ok = _env->inspector_agent()->Start(_platform, "", options);
            assert(ok);
#endif
        }
        //
        bool ok = false;
        _startTime = std::chrono::steady_clock::now();

        for (auto cb : _registerCallbackArray)
        {
            ok = cb(_globalObj);
            assert(ok);
            if (!ok)
                break;
        }

        // After ScriptEngine is started, _registerCallbackArray isn't needed. Therefore, clear it here.
        _registerCallbackArray.clear();

        return ok;
    }

    void ScriptEngine::garbageCollect()
    {
        SE_LOGD("GC begin ..., (js->native map) size: %d, all objects: %d\n", (int)NativePtrToObjectMap::size(), (int)__objectMap.size());
        const double kLongIdlePauseInSeconds = 1.0;
        _isolate->ContextDisposedNotification();
        _isolate->IdleNotificationDeadline(_platform->MonotonicallyIncreasingTime() + kLongIdlePauseInSeconds);
        // By sending a low memory notifications, we will try hard to collect all
        // garbage and will therefore also invoke all weak callbacks of actually
        // unreachable persistent handles.
        _isolate->LowMemoryNotification();
        SE_LOGD("GC end ..., (js->native map) size: %d, all objects: %d\n", (int)NativePtrToObjectMap::size(), (int)__objectMap.size());
    }

    bool ScriptEngine::isGarbageCollecting()
    {
        return _isGarbageCollecting;
    }

    void ScriptEngine::_setGarbageCollecting(bool isGarbageCollecting)
    {
        _isGarbageCollecting = isGarbageCollecting;
    }

    bool ScriptEngine::isValid() const
    {
        return _isValid;
    }

    bool ScriptEngine::evalString(const char* script, ssize_t length/* = -1 */, Value* ret/* = nullptr */, const char* fileName/* = nullptr */)
    {
        assert(script != nullptr);
        if (length < 0)
            length = strlen(script);

        if (fileName == nullptr)
            fileName = "(no filename)";

        // Fix the source url is too long displayed in Chrome debugger.
        std::string sourceUrl = fileName;
        static const std::string prefixKey = "/temp/quick-scripts/";
        size_t prefixPos = sourceUrl.find(prefixKey);
        if (prefixPos != std::string::npos)
        {
            sourceUrl = sourceUrl.substr(prefixPos + prefixKey.length());
        }

        // It is needed, or will crash if invoked from non C++ context, such as invoked from objective-c context(for example, handler of UIKit).
        v8::HandleScope handle_scope(_isolate);

        std::string scriptStr(script, length);
        v8::MaybeLocal<v8::String> source = v8::String::NewFromUtf8(_isolate, scriptStr.c_str(), v8::NewStringType::kNormal);
        if (source.IsEmpty())
            return false;

        v8::MaybeLocal<v8::String> originStr = v8::String::NewFromUtf8(_isolate, sourceUrl.c_str(), v8::NewStringType::kNormal);
        if (originStr.IsEmpty())
            return false;

        v8::ScriptOrigin origin(originStr.ToLocalChecked());
        v8::MaybeLocal<v8::Script> maybeScript = v8::Script::Compile(_context.Get(_isolate), source.ToLocalChecked(), &origin);

        bool success = false;

        if (!maybeScript.IsEmpty())
        {
            v8::Local<v8::Script> v8Script = maybeScript.ToLocalChecked();
            v8::MaybeLocal<v8::Value> maybeResult = v8Script->Run(_context.Get(_isolate));

            if (!maybeResult.IsEmpty())
            {
                v8::Local<v8::Value> result = maybeResult.ToLocalChecked();

                if (!result->IsUndefined() && ret != nullptr)
                {
                    internal::jsToSeValue(_isolate, result, ret);
                }

                success = true;
            }
        }

        if (!success)
        {
            SE_LOGE("ScriptEngine::evalString script %s, failed!\n", fileName);
        }
        return success;
    }

    std::string ScriptEngine::getCurrentStackTrace()
    {
        if (!_isValid)
            return std::string();

        v8::HandleScope hs(_isolate);
        v8::Local<v8::StackTrace> stack = v8::StackTrace::CurrentStackTrace(_isolate, __jsbStackFrameLimit, v8::StackTrace::kOverview);
        return stackTraceToString(stack);
    }

    void ScriptEngine::setFileOperationDelegate(const FileOperationDelegate& delegate)
    {
        _fileOperationDelegate = delegate;
    }

    const ScriptEngine::FileOperationDelegate& ScriptEngine::getFileOperationDelegate() const
    {
        return _fileOperationDelegate;
    }

    bool ScriptEngine::runScript(const std::string& path, Value* ret/* = nullptr */)
    {
        assert(!path.empty());
        assert(_fileOperationDelegate.isValid());

        std::string scriptBuffer = _fileOperationDelegate.onGetStringFromFile(path);

        if (!scriptBuffer.empty())
        {
            return evalString(scriptBuffer.c_str(), scriptBuffer.length(), ret, path.c_str());
        }

        SE_LOGE("ScriptEngine::runScript script %s, buffer is empty!\n", path.c_str());
        return false;
    }

    void ScriptEngine::clearException()
    {
        //IDEA:
    }

    void ScriptEngine::setExceptionCallback(const ExceptionCallback& cb)
    {
        _exceptionCallback = cb;
    }

    v8::Local<v8::Context> ScriptEngine::_getContext() const
    {
        return _context.Get(_isolate);
    }

    void ScriptEngine::enableDebugger(const std::string& serverAddr, uint32_t port, bool isWait)
    {
        _debuggerServerAddr = serverAddr;
        _debuggerServerPort = port;
        _isWaitForConnect = isWait;
    }

    bool ScriptEngine::isDebuggerEnabled() const
    {
        return !_debuggerServerAddr.empty() && _debuggerServerPort > 0;
    }

    void ScriptEngine::mainLoopUpdate()
    {
        // empty implementation
    }

} // namespace se {

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8
