#include "ScriptEngine.hpp"

#ifdef SCRIPT_ENGINE_JSC

#include "Object.hpp"
#include "Class.hpp"
#include "Utils.hpp"

extern "C" JS_EXPORT void JSSynchronousGarbageCollectForDebugging(JSContextRef);

namespace se {

    int AutoHandleScope::__scopeCount = -1;
    std::vector<Object*> AutoHandleScope::__localObjects;

    AutoHandleScope::AutoHandleScope()
    {
        if (__scopeCount == -1)
        {
            __localObjects.reserve(50);
            __scopeCount = 0;
        }

        ++__scopeCount;
    }

    AutoHandleScope::~AutoHandleScope()
    {
        --__scopeCount;
        if (__scopeCount == 0)
        {
            _unrefAllObjects();
        }
    }

    // static
    void AutoHandleScope::_unrefAllObjects()
    {
        if (!__localObjects.empty())
        {
            LOGD("AutoHandleScope::_unrefAllObjects, object count: %d\n", (int)__localObjects.size());
            for (auto obj : __localObjects)
            {
                obj->unref();
            }

            __localObjects.clear();
        }
    }

    // static
    void AutoHandleScope::refObject(Object* obj)
    {
        assert(std::find(__localObjects.begin(), __localObjects.end(), obj) == __localObjects.end());
        __localObjects.push_back(obj);
        obj->ref();
    }

    // static
    void AutoHandleScope::unrefObject(Object* obj)
    {
        auto iter = std::find(__localObjects.begin(), __localObjects.end(), obj);
        if (iter != __localObjects.end())
        {
            __localObjects.erase(iter);
            obj->unref();
        }
    }

    //

    Class* __jsb_CCPrivateData_class = nullptr;
    
    namespace {
        ScriptEngine* __instance = nullptr;

        JSValueRef __forceGC(JSContextRef ctx, JSObjectRef function, JSObjectRef thisObject,
                             size_t argumentCount, const JSValueRef arguments[], JSValueRef* exception)
        {
            LOGD("GC begin ..., (Native -> JS map) count: %d\n", (int)__nativePtrToObjectMap.size());
//            JSGarbageCollect(ctx);
            JSSynchronousGarbageCollectForDebugging(ctx);
            LOGD("GC end ..., (Native -> JS map) count: %d\n", (int)__nativePtrToObjectMap.size());
            return JSValueMakeUndefined(ctx);
        }

        JSValueRef __log(JSContextRef ctx, JSObjectRef function, JSObjectRef thisObject,
                         size_t argumentCount, const JSValueRef arguments[], JSValueRef* exception)
        {
            if (argumentCount > 0)
            {
                std::string ret;
                internal::forceConvertJsValueToStdString(ctx, arguments[0], &ret);
                LOGD("%s\n", ret.c_str());
            }
            return JSValueMakeUndefined(ctx);
        }

        JSObjectRef privateDataContructor(JSContextRef ctx, JSObjectRef constructor, size_t argumentCount, const JSValueRef arguments[], JSValueRef* exception)
        {
            return nullptr;
        }

        void privateDataFinalize(JSObjectRef obj)
        {
            internal::PrivateData* p = (internal::PrivateData*)JSObjectGetPrivate(obj);
            JSObjectSetPrivate(obj, p->data);
            if (p->finalizeCb != nullptr)
                p->finalizeCb(obj);
            free(p);
        }
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
            : _cx(nullptr)
            , _globalObj(nullptr)
            , _isValid(false)
            , _isInCleanup(false)
    {
    }

    bool ScriptEngine::init()
    {
        LOGD("Initializing JavaScriptCore \n");

        _cx = JSGlobalContextCreate(nullptr);

        if (nullptr == _cx)
            return false;

        internal::setContext(_cx);
        Class::setContext(_cx);
        Object::setContext(_cx);

        JSObjectRef globalObj = JSContextGetGlobalObject(_cx);

        if (nullptr == globalObj)
            return false;

        _globalObj = Object::_createJSObject(nullptr, globalObj, true);

        JSStringRef propertyName = JSStringCreateWithUTF8CString("log");
        JSObjectSetProperty(_cx, globalObj, propertyName, JSObjectMakeFunctionWithCallback(_cx, propertyName, __log), kJSPropertyAttributeReadOnly, nullptr);
        JSStringRelease(propertyName);

        propertyName = JSStringCreateWithUTF8CString("forceGC");
        JSObjectSetProperty(_cx, globalObj, propertyName, JSObjectMakeFunctionWithCallback(_cx, propertyName, __forceGC), kJSPropertyAttributeReadOnly, nullptr);
        JSStringRelease(propertyName);

        __jsb_CCPrivateData_class = Class::create("__CCPrivateData", _globalObj, nullptr, privateDataContructor);
        __jsb_CCPrivateData_class->defineFinalizedFunction(privateDataFinalize);
        __jsb_CCPrivateData_class->install();

        _isValid = true;

        return true;
    }

    ScriptEngine::~ScriptEngine()
    {
        cleanup();
    }

    void ScriptEngine::cleanup()
    {
        if (!_isValid)
            return;

        _isInCleanup = true;
        for (const auto& hook : _beforeCleanupHookArray)
        {
            hook();
        }
        _beforeCleanupHookArray.clear();

        SAFE_RELEASE(_globalObj);
        Object::cleanup();
        Class::cleanup();
        gc();

        JSGlobalContextRelease(_cx);

        _cx = nullptr;
        _globalObj = nullptr;
        _isValid = false;
        _nodeEventListener = nullptr;

        _registerCallbackArray.clear();

        for (const auto& hook : _afterCleanupHookArray)
        {
            hook();
        }
        _afterCleanupHookArray.clear();
        _isInCleanup = false;
    }

    std::string ScriptEngine::_formatException(JSValueRef exception)
    {
        std::string ret;
        internal::forceConvertJsValueToStdString(_cx, exception, &ret);

        JSType type = JSValueGetType(_cx, exception);

        if (type == kJSTypeObject)
        {
            JSObjectRef obj = JSValueToObject(_cx, exception, nullptr);
            JSPropertyNameArrayRef nameArr = JSObjectCopyPropertyNames(_cx, obj);

            size_t count =JSPropertyNameArrayGetCount(nameArr);
            for (size_t i = 0; i < count; ++i)
            {
                JSStringRef jsName = JSPropertyNameArrayGetNameAtIndex(nameArr, i);
                JSValueRef jsValue = JSObjectGetProperty(_cx, obj, jsName, nullptr);

                std::string name;
                internal::jsStringToStdString(_cx, jsName, &name);
                std::string value;
                internal::forceConvertJsValueToStdString(_cx, jsValue, &value);

                if (name == "line")
                {
                    ret += ", line: " + value;
                }
                else if (name == "sourceURL")
                {
                    ret += ", sourceURL: " + value;
                }
            }

            JSPropertyNameArrayRelease(nameArr);
        }

        return ret;
    }

    Object* ScriptEngine::getGlobalObject()
    {
        return _globalObj;
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

    void ScriptEngine::gc()
    {
        LOGD("GC begin ..., (Native -> JS map) count: %d\n", (int)__nativePtrToObjectMap.size());
        // JSGarbageCollect(_cx);
        JSSynchronousGarbageCollectForDebugging(_cx);
        LOGD("GC end ..., (Native -> JS map) count: %d\n", (int)__nativePtrToObjectMap.size());
    }

    bool ScriptEngine::executeScriptBuffer(const char *string, Value *data, const char *fileName)
    {
        return executeScriptBuffer(string, strlen(string), data, fileName);
    }

    bool ScriptEngine::executeScriptBuffer(const char *script, size_t length, Value *data, const char *fileName)
    {
        std::string exceptionStr;
        std::string scriptStr(script, length);

        JSValueRef exception = nullptr;
        JSStringRef jsSourceUrl = JSStringCreateWithUTF8CString(fileName);
        JSStringRef jsScript = JSStringCreateWithUTF8CString(scriptStr.c_str());
        JSValueRef result = nullptr;

        bool ok = JSCheckScriptSyntax(_cx, jsScript, jsSourceUrl, 1, &exception);;
        if (ok)
        {
            result = JSEvaluateScript(_cx, jsScript, nullptr, jsSourceUrl, 1, &exception);

            if (exception)
            {
                exceptionStr = _formatException(exception);
                clearException();
                ok = false;
            }
        }
        else
        {
            if (exception)
            {
                exceptionStr = _formatException(exception);
                clearException();
            }
            else
            {
                LOGD("Unknown syntax error parsing file %s\n", fileName);
            }
        }

        JSStringRelease(jsScript);
        JSStringRelease(jsSourceUrl);

        if (ok)
        {
            if (data != nullptr)
                internal::jsToSeValue(_cx, result, data); //FIXME: result is rooted, when to unrooted, it probably cause memory leak
        }
        else if (!exceptionStr.empty())
        {
            LOGD("%s\n", exceptionStr.c_str());
        }

        return ok;
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

} // namespace se {

#endif // SCRIPT_ENGINE_JSC
