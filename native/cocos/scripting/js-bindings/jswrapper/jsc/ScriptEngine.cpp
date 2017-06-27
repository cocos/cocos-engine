#include "ScriptEngine.hpp"

#ifdef SCRIPT_ENGINE_JSC

#include "Object.hpp"
#include "Class.hpp"
#include "Utils.hpp"

extern "C" JS_EXPORT void JSSynchronousGarbageCollectForDebugging(JSContextRef);

namespace se {

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
        SAFE_RELEASE(_globalObj);

        Class::cleanup();
        
        JSGlobalContextRelease(_cx);
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

    bool ScriptEngine::executeScriptFile(const std::string &filePath, Value *rval/* = nullptr*/)
    {
        bool ret = false;
        FILE* fp = fopen(filePath.c_str(), "rb");
        if (fp != nullptr)
        {
            fseek(fp, 0, SEEK_END);
            long fileSize = ftell(fp);
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
