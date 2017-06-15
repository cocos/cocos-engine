#include "ScriptEngine.hpp"

#ifdef SCRIPT_ENGINE_V8

#include "Object.hpp"
#include "Class.hpp"
#include "Utils.hpp"

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
                v8::String::Utf8Value utf8(info[0]);
                printf("JS: %s\n", *utf8);
            }
        }

        void __forceGC(const v8::FunctionCallbackInfo<v8::Value>& info)
        {
            ScriptEngine::getInstance()->gc();
        }

        void privateDataContructor(const v8::FunctionCallbackInfo<v8::Value>& info)
        {
        }

        void myFatalErrorCallback(const char* location, const char* message)
        {
            printf("[FATAL ERROR] location: %s, message: %s\n", location, message);
        }

        void myOOMErrorCallback(const char* location, bool is_heap_oom)
        {
            printf("[OOM ERROR] location: %s, is_heap_oom: %d", location, is_heap_oom);
        }

        void printStackTrace(v8::Local<v8::StackTrace> stack) {
            printf("Stack Trace (length %d):\n", stack->GetFrameCount());
            for (int i = 0, e = stack->GetFrameCount(); i != e; ++i) {
                v8::Local<v8::StackFrame> frame = stack->GetFrame(i);
                v8::Local<v8::String> script = frame->GetScriptName();
                v8::Local<v8::String> func = frame->GetFunctionName();
                printf("[%d] (%s) %s:%d:%d\n", i,
                       script.IsEmpty() ? "<null>" : *v8::String::Utf8Value(script),
                       func.IsEmpty() ? "<null>" : *v8::String::Utf8Value(func),
                       frame->GetLineNumber(), frame->GetColumn());
            }
        }

        void myMessageCallback(v8::Local<v8::Message> message, v8::Local<v8::Value> data)
        {
            v8::Local<v8::String> msg = message->Get();
            se::Value msgVal;
            internal::jsToSeValue(v8::Isolate::GetCurrent(), msg, &msgVal);
            assert(msgVal.isString());
            printf("ERROR: %s\n", msgVal.toString().c_str());
            printStackTrace(message->GetStackTrace());
        }
    }

    void ScriptEngine::privateDataFinalize(void* nativeObj)
    {
        internal::PrivateData* p = (internal::PrivateData*)nativeObj;

        Object::nativeObjectFinalizeHook(p->data);

        assert(p->seObj->getReferenceCount() == 1);

        p->seObj->release();

        free(p);
    }

    ScriptEngine *ScriptEngine::getInstance()
    {
        if (__instance == nullptr)
        {
            __instance = new ScriptEngine();
            if (!__instance->init())
            {
                delete __instance;
                __instance = nullptr;
            }
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
    , _globalObj(nullptr)
    , _isValid(false)
    , _nodeEventListener(nullptr)
    {

    }

    ScriptEngine::~ScriptEngine()
    {
        cleanup();
    }

    bool ScriptEngine::init()
    {
        printf("Initializing V8\n");

//        RETRUN_VAL_IF_FAIL(v8::V8::InitializeICUDefaultLocation(nullptr, "/Users/james/Project/v8/out.gn/x64.debug/icudtl.dat"), false);
//        v8::V8::InitializeExternalStartupData("/Users/james/Project/v8/out.gn/x64.debug/natives_blob.bin", "/Users/james/Project/v8/out.gn/x64.debug/snapshot_blob.bin"); //TODO
        _platform = v8::platform::CreateDefaultPlatform();
        v8::V8::InitializePlatform(_platform);
        RETRUN_VAL_IF_FAIL(v8::V8::Initialize(), false);

        // Create a new Isolate and make it the current one.
        _createParams.array_buffer_allocator = &_allocator;
        _isolate = v8::Isolate::New(_createParams);
        v8::HandleScope hs(_isolate);
        _isolate->Enter();

        _isolate->SetCaptureStackTraceForUncaughtExceptions(true, 20, v8::StackTrace::kOverview);

        _isolate->SetFatalErrorHandler(myFatalErrorCallback);
        _isolate->SetOOMErrorHandler(myOOMErrorCallback);
        _isolate->AddMessageListener(myMessageCallback);

        _context.Reset(_isolate, v8::Context::New(_isolate));
        _context.Get(_isolate)->Enter();

        Class::setIsolate(_isolate);
        Object::setIsolate(_isolate);

        _globalObj = Object::_createJSObject(nullptr, _context.Get(_isolate)->Global(), true);

        _globalObj->defineFunction("log", __log);
        _globalObj->defineFunction("forceGC", __forceGC);

        __jsb_CCPrivateData_class = Class::create("__CCPrivateData", _globalObj, nullptr, privateDataContructor);
        __jsb_CCPrivateData_class->defineFinalizedFunction(privateDataFinalize);
        __jsb_CCPrivateData_class->install();

        _isValid = true;

        return _isValid;
    }

    void ScriptEngine::cleanup()
    {
        SAFE_RELEASE(_globalObj);

        Class::cleanup();
        _context.Get(_isolate)->Exit();
        _context.Reset();
        _isolate->Exit();

        _isolate->Dispose();

        v8::V8::Dispose();
        v8::V8::ShutdownPlatform();
        delete _platform;
    }

    Object* ScriptEngine::getGlobalObject() const
    {
        return _globalObj;
    }

    void ScriptEngine::gc()
    {
        printf("GC begin ..., (js->native map) size: %d\n", (int)__nativePtrToObjectMap.size());
        const double kLongIdlePauseInSeconds = 1.0;
        _isolate->ContextDisposedNotification();
        _isolate->IdleNotificationDeadline(_platform->MonotonicallyIncreasingTime() + kLongIdlePauseInSeconds);
        // By sending a low memory notifications, we will try hard to collect all
        // garbage and will therefore also invoke all weak callbacks of actually
        // unreachable persistent handles.
        _isolate->LowMemoryNotification();
        printf("GC end ..., (js->native map) size: %d\n", (int)__nativePtrToObjectMap.size());
    }

    bool ScriptEngine::isValid() const
    {
        return _isValid;
    }


    bool ScriptEngine::executeScriptBuffer(const char* string, Value *data, const char *fileName)
    {
        return executeScriptBuffer(string, strlen(string), data, fileName);
    }

    bool ScriptEngine::executeScriptBuffer(const char* script, size_t length, Value *data, const char *fileName)
    {
        std::string scriptStr(script, length);

        v8::MaybeLocal<v8::String> source = v8::String::NewFromUtf8(_isolate, scriptStr.c_str(), v8::NewStringType::kNormal);
        if (source.IsEmpty())
            return false;

        v8::MaybeLocal<v8::String> originStr = v8::String::NewFromUtf8(_isolate, fileName ? fileName : "Unknown", v8::NewStringType::kNormal);
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

                if (!result->IsUndefined() && data != nullptr)
                {
                    internal::jsToSeValue(_isolate, result, data);
                }

                success = true;
            }
        }

        return success;
    }

    bool ScriptEngine::executeScriptFile(const std::string& filePath, Value* rval/* = nullptr*/)
    {
        bool ret = false;
        FILE* fp = fopen(filePath.c_str(), "rb");
        if (fp != nullptr)
        {
            fseek(fp, 0, SEEK_END);
            size_t fileSize = (size_t)ftell(fp);
            fseek(fp, 0, SEEK_SET);
            char* buffer = (char*) malloc(fileSize);
            fread(buffer, fileSize, 1, fp);
            ret = executeScriptBuffer(buffer, fileSize, rval, filePath.c_str());
            free(buffer);
            fclose(fp);
        }

        return ret;
    }

    void ScriptEngine::_retainScriptObject(void* owner, void* target)
    {
        auto iterOwner = __nativePtrToObjectMap.find(owner);
        if (iterOwner == __nativePtrToObjectMap.end())
        {
            return;
        }

        auto iterTarget = __nativePtrToObjectMap.find(target);
        if (iterTarget == __nativePtrToObjectMap.end())
        {
            return;
        }

        clearException();
        AutoHandleScope hs;
        iterOwner->second->attachChild(iterTarget->second);
    }

    void ScriptEngine::_releaseScriptObject(void* owner, void* target)
    {
        auto iterOwner = __nativePtrToObjectMap.find(owner);
        if (iterOwner == __nativePtrToObjectMap.end())
        {
            return;
        }

        auto iterTarget = __nativePtrToObjectMap.find(target);
        if (iterTarget == __nativePtrToObjectMap.end())
        {
            return;
        }

        clearException();
        AutoHandleScope hs;
        iterOwner->second->detachChild(iterTarget->second);
    }

    bool ScriptEngine::_onReceiveNodeEvent(void* node, NodeEventType type)
    {
        assert(_nodeEventListener != nullptr);
        return _nodeEventListener(node, type);
    }

    bool ScriptEngine::_setNodeEventListener(NodeEventListener listener)
    {
        _nodeEventListener = listener;
        return true;
    }

    void ScriptEngine::clearException()
    {
        //FIXME:
    }

    v8::Local<v8::Context> ScriptEngine::_getContext() const
    {
        return _context.Get(_isolate);
    }

} // namespace se {

#endif // SCRIPT_ENGINE_V8
