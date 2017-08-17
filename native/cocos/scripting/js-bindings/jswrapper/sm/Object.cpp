#include "Object.hpp"

#ifdef SCRIPT_ENGINE_SM

#include "Utils.hpp"
#include "Class.hpp"
#include "ScriptEngine.hpp"
#include "../MappingUtils.hpp"

namespace se {
 
    std::unordered_map<Object*, void*> __objectMap; // Currently, the value `void*` is always nullptr

    namespace {
        JSContext *__cx = nullptr;

        void get_or_create_js_obj(JSContext* cx, JS::HandleObject obj, const std::string &name, JS::MutableHandleObject jsObj)
        {
            JS::RootedValue nsval(cx);
            JS_GetProperty(cx, obj, name.c_str(), &nsval);
            if (nsval.isNullOrUndefined()) {
                jsObj.set(JS_NewPlainObject(cx));
                nsval = JS::ObjectValue(*jsObj);
                JS_SetProperty(cx, obj, name.c_str(), nsval);
            } else {
                jsObj.set(nsval.toObjectOrNull());
            }
        }
    }

    // ------------------------------------------------------- Object

    Object::Object()
    : _rootCount(0)
    , _root(nullptr)
    , _privateData(nullptr)
    , _cls(nullptr)
    , _finalizeCb(nullptr)
    {
    }

    Object::~Object()
    {
        if (_rootCount > 0)
        {
            unprotect();
        }

        auto iter = __objectMap.find(this);
        if (iter != __objectMap.end())
        {
            __objectMap.erase(iter);
        }
    }

    bool Object::init(Class* cls, JSObject* obj)
    {
        _cls = cls;
        _heap = obj;

        assert(__objectMap.find(this) == __objectMap.end());
        __objectMap.emplace(this, nullptr);

        return true;
    }

    Object* Object::_createJSObject(Class* cls, JSObject* obj)
    {
        Object* ret = new Object();
        if (!ret->init(cls, obj))
        {
            delete ret;
            ret = nullptr;
        }

        return ret;
    }

    Object* Object::createPlainObject()
    {
        Object* obj = Object::_createJSObject(nullptr, JS_NewPlainObject(__cx));
        return obj;
    }

    Object* Object::createObjectWithClass(Class* cls)
    {
        JSObject* jsobj = Class::_createJSObjectWithClass(cls);
        Object* obj = Object::_createJSObject(cls, jsobj);
        return obj;
    }

    Object* Object::getObjectWithPtr(void* ptr)
    {
        Object* obj = nullptr;
        auto iter = NativePtrToObjectMap::find(ptr);
        if (iter != NativePtrToObjectMap::end())
        {
            obj = iter->second;
            obj->addRef();
        }
        return obj;
    }

    Object* Object::createArrayObject(size_t length)
    {
        JS::RootedObject jsobj(__cx, JS_NewArrayObject(__cx, length));
        Object* obj = Object::_createJSObject(nullptr, jsobj);
        return obj;
    }

    Object* Object::createArrayBufferObject(void* data, size_t byteLength)
    {
        JS::RootedObject jsobj(__cx, JS_NewArrayBuffer(__cx, (uint32_t)byteLength));
        bool isShared = false;
        JS::AutoCheckCannotGC nogc;
        uint8_t* tmpData = JS_GetArrayBufferData(jsobj, &isShared, nogc);
        memcpy((void*)tmpData, (const void*)data, byteLength);
        Object* obj = Object::_createJSObject(nullptr, jsobj);
        return obj;
    }

    Object* Object::createUint8TypedArray(uint8_t* data, size_t byteLength)
    {
        JS::RootedObject jsobj(__cx, JS_NewUint8Array(__cx, (uint32_t)byteLength));
        bool isShared = false;
        JS::AutoCheckCannotGC nogc;
        uint8_t* tmpData = JS_GetUint8ArrayData(jsobj, &isShared, nogc);
        memcpy((void*)tmpData, (const void*)data, byteLength);
        Object* obj = Object::_createJSObject(nullptr, jsobj);
        return obj;
    }

    Object* Object::createJSONObject(const std::string& jsonStr)
    {
        Value strVal(jsonStr);
        JS::RootedValue jsStr(__cx);
        internal::seToJsValue(__cx, strVal, &jsStr);
        JS::RootedValue jsObj(__cx);
        JS::RootedString rootedStr(__cx, jsStr.toString());
        Object* obj = nullptr;
        if (JS_ParseJSON(__cx, rootedStr, &jsObj))
        {
            obj = Object::_createJSObject(nullptr, jsObj.toObjectOrNull());
        }
        return obj;
    }

    void Object::_setFinalizeCallback(JSFinalizeOp finalizeCb)
    {
        _finalizeCb = finalizeCb;
    }

    bool Object::getProperty(const char* name, Value* data)
    {
        JSObject* jsobj = _getJSObject();
        if (jsobj == nullptr)
            return false;

        JS::RootedObject object(__cx, jsobj);

        bool found = false;
        bool ok = JS_HasProperty(__cx, object, name, &found);

        if (!ok || !found)
        {
            return false;
        }

        JS::RootedValue rcValue(__cx);
        ok = JS_GetProperty(__cx, object, name, &rcValue);

        if (ok && data)
        {
            internal::jsToSeValue(__cx, rcValue, data);
        }

        return ok;
    }

    void Object::setProperty(const char* name, const Value& v)
    {
        JS::RootedObject object(__cx, _getJSObject());

        JS::RootedValue value(__cx);
        internal::seToJsValue(__cx, v, &value);
        JS_SetProperty(__cx, object, name, value);
    }

    bool Object::defineProperty(const char *name, JSNative getter, JSNative setter)
    {
        JS::RootedObject jsObj(__cx, _getJSObject());
        return JS_DefineProperty(__cx, jsObj, name, JS::UndefinedHandleValue, JSPROP_PERMANENT | JSPROP_ENUMERATE | JSPROP_SHARED, getter, setter);
    }

    bool Object::call(const ValueArray& args, Object* thisObject, Value* rval/* = nullptr*/)
    {
        assert(isFunction());

        JS::AutoValueVector jsarr(__cx);
        jsarr.reserve(args.size());
        internal::seToJsArgs(__cx, args, &jsarr);

        JS::RootedObject contextObject(__cx);
        if (thisObject != nullptr)
        {
            contextObject.set(thisObject->_getJSObject());
        }

        JSObject* funcObj = _getJSObject();
        JS::RootedValue func(__cx, JS::ObjectValue(*funcObj));
        JS::RootedValue rcValue(__cx);

        bool ok = JS_CallFunctionValue(__cx, contextObject, func, jsarr, &rcValue);

        if (ok)
        {
            if (rval != nullptr)
                internal::jsToSeValue(__cx, rcValue, rval);
        }
        else
        {
            se::ScriptEngine::getInstance()->clearException();
        }

        return ok;
    }

    bool Object::defineFunction(const char *funcName, JSNative func, int minArgs)
    {
        JS::RootedObject object(__cx, _getJSObject());
        bool ok = JS_DefineFunction(__cx, object, funcName, func, minArgs, 0);
        return ok;
    }

    bool Object::getArrayLength(uint32_t* length) const
    {
        assert(length != nullptr);
        if (!isArray())
            return false;

        JS::RootedObject object(__cx, _getJSObject());
        if (JS_GetArrayLength(__cx, object, length))
            return true;

        *length = 0;
        return false;
    }

    bool Object::getArrayElement(uint32_t index, Value* data) const 
    {
        assert(data != nullptr);
        if (!isArray())
            return false;

        JS::RootedObject object(__cx, _getJSObject());
        JS::RootedValue rcValue(__cx);
        if (JS_GetElement(__cx, object, index, &rcValue))
        {
            internal::jsToSeValue(__cx, rcValue, data);
            return true;
        }

        data->setUndefined();
        return false;
    }

    bool Object::setArrayElement(uint32_t index, const Value& data)
    {
        if (!isArray())
            return false;

        JS::RootedValue jsval(__cx);
        internal::seToJsValue(__cx, data, &jsval);
        JS::RootedObject thisObj(__cx, _getJSObject());
        return JS_SetElement(__cx, thisObj, index, jsval);
    }

    bool Object::isFunction() const
    {
        return JS_ObjectIsFunction(__cx, _getJSObject());
    }

    bool Object::_isNativeFunction(JSNative func) const
    {
        JSObject* obj = _getJSObject();
        return JS_ObjectIsFunction(__cx, obj) && JS_IsNativeFunction(obj, func);
    }

    bool Object::isTypedArray() const
    {
        return JS_IsTypedArrayObject( _getJSObject());
    }

    bool Object::getTypedArrayData(uint8_t** ptr, size_t* length) const
    {
        assert(JS_IsArrayBufferViewObject(_getJSObject()));
        bool isShared = false;
        JS::AutoCheckCannotGC nogc;
        *ptr = (uint8_t*)JS_GetArrayBufferViewData(_getJSObject(), &isShared, nogc);
        *length = JS_GetArrayBufferViewByteLength(_getJSObject());
        return (*ptr != nullptr);
    }

    bool Object::isArray() const
    {
        JS::RootedValue value(__cx, JS::ObjectValue(*_getJSObject()));
        bool isArray = false;
        return JS_IsArrayObject(__cx, value, &isArray) && isArray;
    }

    bool Object::isArrayBuffer() const
    {
        return JS_IsArrayBufferObject(_getJSObject());
    }

    bool Object::getArrayBufferData(uint8_t** ptr, size_t* length) const
    {
        assert(isArrayBuffer());

        bool isShared = false;
        JS::AutoCheckCannotGC nogc;
        *ptr = (uint8_t*)JS_GetArrayBufferData(_getJSObject(), &isShared, nogc);
        *length = JS_GetArrayBufferByteLength(_getJSObject());
        return (*ptr != nullptr);
    }

    bool Object::getAllKeys(std::vector<std::string>* allKeys) const
    {
        assert(allKeys != nullptr);
        JS::RootedObject jsobj(__cx, _getJSObject());
        JS::Rooted<JS::IdVector> props(__cx, JS::IdVector(__cx));
        if (!JS_Enumerate(__cx, jsobj, &props))
            return false;

        std::vector<std::string> keys;
        for (size_t i = 0, length = props.length(); i < length; ++i)
        {
            JS::RootedId id(__cx, props[i]);
            JS::RootedValue keyVal(__cx);
            JS_IdToValue(__cx, id, &keyVal);

            if (JSID_IS_STRING(id))
            {
                JS::RootedString rootedKeyVal(__cx, keyVal.toString());
                allKeys->push_back(internal::jsToStdString(__cx, rootedKeyVal));
            }
            else if (JSID_IS_INT(id))
            {
                char buf[50] = {0};
                snprintf(buf, sizeof(buf), "%d", keyVal.toInt32());
                allKeys->push_back(buf);
            }
            else
            {
                assert(false);
            }
        }

        return true;
    }

    void* Object::getPrivateData() const
    {
        if (_privateData == nullptr)
        {
            JS::RootedObject obj(__cx, _getJSObject());
            const_cast<Object*>(this)->_privateData = internal::getPrivate(__cx, obj);
        }
        return _privateData;
    }

    void Object::setPrivateData(void* data)
    {
        assert(_privateData == nullptr);
        assert(NativePtrToObjectMap::find(data) == NativePtrToObjectMap::end());
        assert(_cls != nullptr);
        JS::RootedObject obj(__cx, _getJSObject());
        internal::setPrivate(__cx, obj, data, _finalizeCb);

        NativePtrToObjectMap::emplace(data, this);
        _privateData = data;
    }

    void Object::clearPrivateData()
    {
        if (_privateData != nullptr)
        {
            void* data = getPrivateData();
            NativePtrToObjectMap::erase(data);
            JS::RootedObject obj(__cx, _getJSObject());
            internal::clearPrivate(__cx, obj);
            _privateData = nullptr;
        }
    }

    void Object::setContext(JSContext *cx)
    {
        __cx = cx;
    }

    // static
    void Object::cleanup()
    {
        for (const auto& e : __objectMap)
        {
            e.first->reset();
        }

        ScriptEngine::getInstance()->addAfterCleanupHook([](){
            __objectMap.clear();
            NativePtrToObjectMap::clear();
            NonRefNativePtrCreatedByCtorMap::clear();
            __cx = nullptr;
        });
    }

    JSObject* Object::_getJSObject() const
    {
        return isRooted() ? _root->get() : _heap.get();
    }

    void Object::root()
    {
        if (_rootCount == 0)
        {
            protect();
        }
        ++_rootCount;
    }

    void Object::unroot()
    {
        if (_rootCount > 0)
        {
            --_rootCount;
            if (_rootCount == 0)
            {
                unprotect();
            }
        }
    }

    void Object::protect()
    {
        assert(_root == nullptr);
        assert(_heap != JS::GCPolicy<JSObject*>::initial());

        _root = new JS::PersistentRootedObject(__cx, _heap);
        _heap = JS::GCPolicy<JSObject*>::initial();
    }

    void Object::unprotect()
    {
        if (_root == nullptr)
            return;

        assert(_heap == JS::GCPolicy<JSObject*>::initial());
        _heap = *_root;
        delete _root;
        _root = nullptr;
    }

    void Object::reset()
    {
        if (_root != nullptr)
        {
            delete _root;
            _root = nullptr;
        }

        _heap = JS::GCPolicy<JSObject*>::initial();
    }

    /* Tracing makes no sense in the rooted case, because JS::PersistentRooted
     * already takes care of that. */
    void Object::trace(JSTracer* tracer, void* data)
    {
        assert(!isRooted());
        JS::TraceEdge(tracer, &_heap, "ccobj tracing");
    }

    /* If not tracing, then you must call this method during GC in order to
     * update the object's location if it was moved, or null it out if it was
     * finalized. If the object was finalized, returns true. */
    bool Object::updateAfterGC(void* data)
    {
        assert(!isRooted());
        bool isGarbageCollected = false;
        internal::PrivateData* internalData = nullptr;

        JSObject* oldPtr = _heap.unbarrieredGet();
        if (_heap.unbarrieredGet() != nullptr)
            JS_UpdateWeakPointerAfterGC(&_heap);

        JSObject* newPtr = _heap.unbarrieredGet();

        // FIXME: test to see ggc
        if (oldPtr != nullptr && newPtr != nullptr)
        {
            assert(oldPtr == newPtr);
        }
        isGarbageCollected = (newPtr == nullptr);
        if (isGarbageCollected && internalData != nullptr)
        {
            free(internalData);
        }
        return isGarbageCollected;
    }
    
    bool Object::isRooted() const
    {
        return _rootCount > 0;
    }

    bool Object::isSame(Object* o) const
    {
        JSObject* thisObj = _getJSObject();
        JSObject* oThisObj = o->_getJSObject();
        if ((thisObj == nullptr || oThisObj == nullptr) && thisObj != oThisObj)
            return false;

        assert(thisObj);
        assert(oThisObj);
        JS::RootedValue v1(__cx, JS::ObjectValue(*_getJSObject()));
        JS::RootedValue v2(__cx, JS::ObjectValue(*o->_getJSObject()));
        bool same = false;
        bool ok = JS_SameValue(__cx, v1, v2, &same);
        return ok && same;
    }

    bool Object::attachChild(Object* child)
    {
        assert(child);
        JSObject* ownerObj = _getJSObject();
        JSObject* targetObj = child->_getJSObject();
        if (ownerObj == nullptr || targetObj == nullptr)
            return false;

        JS::RootedValue valOwner(__cx, JS::ObjectValue(*ownerObj));
        JS::RootedValue valTarget(__cx, JS::ObjectValue(*targetObj));

        JS::RootedObject jsbObj(__cx);
        JS::RootedObject globalObj(__cx, ScriptEngine::getInstance()->getGlobalObject()->_getJSObject());
        get_or_create_js_obj(__cx, globalObj, "jsb", &jsbObj);

        JS::AutoValueVector args(__cx);
        args.resize(2);
        args[0].set(valOwner);
        args[1].set(valTarget);

        JS::RootedValue rval(__cx);

        return JS_CallFunctionName(__cx, jsbObj, "registerNativeRef", args, &rval);
    }

    bool Object::detachChild(Object* child)
    {
        assert(child);
        JSObject* ownerObj = _getJSObject();
        JSObject* targetObj = child->_getJSObject();
        if (ownerObj == nullptr || targetObj == nullptr)
        {
            LOGD("%s: try to detach on invalid object, owner: %p, target: %p\n", __FUNCTION__, ownerObj, targetObj);
            return false;
        }

        JS::RootedValue valOwner(__cx, JS::ObjectValue(*ownerObj));
        JS::RootedValue valTarget(__cx, JS::ObjectValue(*targetObj));

        JS::RootedObject jsbObj(__cx);
        JS::RootedObject globalObj(__cx, ScriptEngine::getInstance()->getGlobalObject()->_getJSObject());
        get_or_create_js_obj(__cx, globalObj, "jsb", &jsbObj);

        JS::AutoValueVector args(__cx);
        args.resize(2);
        args[0].set(valOwner);
        args[1].set(valTarget);

        JS::RootedValue rval(__cx);

        return JS_CallFunctionName(__cx, jsbObj, "unregisterNativeRef", args, &rval);
    }

} // namespace se {

#endif // SCRIPT_ENGINE_SM
