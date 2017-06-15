#include "Object.hpp"
#include "Utils.hpp"
#include "Class.hpp"
#include "ScriptEngine.hpp"

#ifdef SCRIPT_ENGINE_SM

namespace se {
 
    std::unordered_map<void* /*native*/, Object* /*jsobj*/> __nativePtrToObjectMap;

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

//        void on_context_destroy(void* data)
//        {
//            auto self = static_cast<Object*>(data);
//            self->invalidate();
//        }
    }

    // ------------------------------------------------------- Object

    Object::Object()
    : _isRooted(false)
    , _hasWeakRef(false)
    , _root(nullptr)
    , _isKeepRootedUntilDie(false)
    , m_notify(nullptr)
    , m_data(nullptr)
    , _hasPrivateData(false)
    , _cls(nullptr)
    , _finalizeCb(nullptr)
    {

    }

    Object::~Object()
    {
//FIXME:        if (_hasPrivateData)
//        {
//            JSObject* jsobj = _getJSObject();
//            if (jsobj != nullptr)
//            {
//                void* nativeObj = JS_GetPrivate(jsobj);
//                auto iter = __nativePtrToObjectMap.find(nativeObj);
//                if (iter != __nativePtrToObjectMap.end())
//                {
//                    __nativePtrToObjectMap.erase(iter);
//                }
//            }
//        }

        if (_isRooted)
            teardownRooting();
    }

    bool Object::init(Class* cls, JSObject* obj, bool rooted)
    {
        debug("created");
        _cls = cls;
        if (rooted)
            putToRoot(obj);
        else
            putToHeap(obj);

        return true;
    }

    Object* Object::_createJSObject(Class* cls, JSObject* obj, bool rooted)
    {
        Object* ret = new Object();
        if (!ret->init(cls, obj, rooted))
        {
            delete ret;
            ret = nullptr;
        }

        return ret;
    }

    Object* Object::createPlainObject(bool rooted)
    {
        Object* obj = Object::_createJSObject(nullptr, JS_NewPlainObject(__cx), rooted);
        return obj;
    }

//    Object* Object::createObject(const char* clsName, bool rooted)
//    {
//        Class* cls = nullptr;
//        JSObject* jsobj = Class::_createJSObject(clsName, &cls);
//        Object* obj = Object::_createJSObject(cls, jsobj, rooted);
//        return obj;
//    }

    Object* Object::createObjectWithClass(Class* cls, bool rooted)
    {
        JSObject* jsobj = Class::_createJSObjectWithClass(cls);
        Object* obj = Object::_createJSObject(cls, jsobj, rooted);
        return obj;
    }

    Object* Object::getObjectWithPtr(void* ptr)
    {
        Object* obj = nullptr;
        auto iter = __nativePtrToObjectMap.find(ptr);
        if (iter != __nativePtrToObjectMap.end())
        {
            obj = iter->second;
            obj->addRef();
        }
        return obj;
    }

//    Object* Object::getOrCreateObjectWithPtr(void* ptr, const char* clsName, bool rooted)
//    {
//        Object* obj = getObjectWithPtr(ptr);
//        if (obj == nullptr)
//        {
//            obj = createObject(clsName, rooted);
//            obj->setPrivateData(ptr);
//        }
//        return obj;
//    }

    Object* Object::createArrayObject(size_t length, bool rooted)
    {
        JS::RootedObject jsobj(__cx, JS_NewArrayObject(__cx, length));
        Object* obj = Object::_createJSObject(nullptr, jsobj, rooted);
        return obj;
    }

    Object* Object::createArrayBufferObject(void* data, size_t byteLength, bool rooted)
    {
        JS::RootedObject jsobj(__cx, JS_NewArrayBuffer(__cx, (uint32_t)byteLength));
        bool isShared = false;
        JS::AutoCheckCannotGC nogc;
        uint8_t* tmpData = JS_GetArrayBufferData(jsobj, &isShared, nogc);
        memcpy((void*)tmpData, (const void*)data, byteLength);
        Object* obj = Object::_createJSObject(nullptr, jsobj, rooted);
        return obj;
    }

    Object* Object::createUint8TypedArray(uint8_t* data, size_t byteLength, bool rooted)
    {
        JS::RootedObject jsobj(__cx, JS_NewUint8Array(__cx, (uint32_t)byteLength));
        bool isShared = false;
        JS::AutoCheckCannotGC nogc;
        uint8_t* tmpData = JS_GetUint8ArrayData(jsobj, &isShared, nogc);
        memcpy((void*)tmpData, (const void*)data, byteLength);
        Object* obj = Object::_createJSObject(nullptr, jsobj, rooted);
        return obj;
    }

    Object* Object::createJSONObject(const std::string& jsonStr, bool rooted)
    {
        Value strVal(jsonStr);
        JS::RootedValue jsStr(__cx);
        internal::seToJsValue(__cx, strVal, &jsStr);
        JS::RootedValue jsObj(__cx);
        JS::RootedString rootedStr(__cx, jsStr.toString());
        Object* obj = nullptr;
        if (JS_ParseJSON(__cx, rootedStr, &jsObj))
        {
            obj = Object::_createJSObject(nullptr, jsObj.toObjectOrNull(), rooted);
        }
        return obj;
    }

    void Object::_setFinalizeCallback(JSFinalizeOp finalizeCb)
    {
        _finalizeCb = finalizeCb;
    }

    // --- Getter/Setter

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

    // --- call

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

    // --- Register Function

    bool Object::defineFunction(const char *funcName, JSNative func, int minArgs)
    {
        JS::RootedObject object(__cx, _getJSObject());
        bool ok = JS_DefineFunction(__cx, object, funcName, func, minArgs, 0);
        return ok;
    }

    // --- Arrays

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

//    bool Object::getAsUint8Array(uint8_t** ptr, size_t* length) const
//    {
//        uint8_t* pt = nullptr;
//        uint32_t len = 0;
//        bool isSharedMemory = false;
//        JSObject* obj = JS_GetObjectAsUint8Array(_getJSObject(), &len, &isSharedMemory, &pt);
//        if (obj != nullptr)
//        {
//            *ptr = pt;
//            *length = len;
//            return true;
//        }
//        *ptr = nullptr;
//        *length = 0;
//        return false;
//    }
//
//    bool Object::getAsUint16Array(uint16_t** ptr, size_t* length) const
//    {
//        assert(ptr && length);
//        uint16_t* pt = nullptr;
//        uint32_t len = 0;
//        bool isSharedMemory = false;
//        JSObject* obj = JS_GetObjectAsUint16Array(_getJSObject(), &len, &isSharedMemory, &pt);
//        if (obj != nullptr)
//        {
//            *ptr = pt;
//            *length = len;
//            return true;
//        }
//        *ptr = nullptr;
//        *length = 0;
//        return false;
//    }
//
//    bool Object::getAsUint32Array(uint32_t** ptr, size_t* length) const
//    {
//        *ptr = nullptr;
//        *length = 0;
//        unsigned int *pt; uint32_t len;
//        bool isSharedMemory = false;
//        JSObject* obj = JS_GetObjectAsUint32Array(_getJSObject(), &len, &isSharedMemory, &pt);
//        if (obj != nullptr)
//        {
//            *ptr = pt;
//            *length = len;
//            return true;
//        }
//        *ptr = nullptr;
//        *length = 0;
//        return false;
//    }
//
//    bool Object::getAsFloat32Array(float **ptr, size_t* length) const
//    {
//        *ptr = nullptr;
//        *length = 0;
//        float *pt; unsigned int len;
//        bool isSharedMemory = false;
//        JSObject* obj = JS_GetObjectAsFloat32Array( _getJSObject(), &len, &isSharedMemory, &pt);
//        if (obj != nullptr)
//        {
//            *ptr = pt;
//            *length = len;
//            return true;
//        }
//        *ptr = nullptr;
//        *length = 0;
//        return false;
//    }

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

    void* Object::getPrivateData()
    {
        JS::RootedObject obj(__cx, _getJSObject());
        return internal::getPrivate(__cx, obj);
    }

    void Object::setPrivateData(void* data)
    {
        assert(!_hasPrivateData);
        JS::RootedObject obj(__cx, _getJSObject());
        internal::setPrivate(__cx, obj, data, _finalizeCb);

        __nativePtrToObjectMap.emplace(data, this);
        _hasPrivateData = true;
    }

    void Object::clearPrivateData()
    {
        if (_hasPrivateData)
        {
            void* data = getPrivateData();
            __nativePtrToObjectMap.erase(data);
            JS::RootedObject obj(__cx, _getJSObject());
            internal::clearPrivate(__cx, obj);
            _hasPrivateData = false;
        }
    }

    void Object::setContext(JSContext *cx)
    {
        __cx = cx;
    }

    void Object::debug(const char *what)
    {
//        printf("Object %p %s\n", this,
//               what);
    }

    void Object::teardownRooting()
    {
        debug("teardownRooting()");
        assert(_isRooted);

        delete _root;
        _root = nullptr;
        _isRooted = false;

        if (!_hasWeakRef)
            return;

        //cjh        auto gjs_cx = static_cast<GjsContext *>(JS_GetContextPrivate(__cx));
        //        g_object_weak_unref(G_OBJECT(gjs_cx), on_context_destroy, this);
        _hasWeakRef = false;
    }

    /* Called for a rooted wrapper when the JSContext is about to be destroyed.
     * This calls the destroy-notify callback if one was passed to root(), and
     * then removes all rooting from the object. */
    void Object::invalidate()
    {
        debug("invalidate()");
        assert(_isRooted);

        /* The weak ref is already gone because the context is dead, so no need
         * to remove it. */
        _hasWeakRef = false;

        /* The object is still live across this callback. */
        if (m_notify)
        {
            JS::RootedObject rootedObj(__cx, _getJSObject());
            m_notify(rootedObj, m_data);
        }
        
        reset();
    }

    /* To access the GC thing, call get(). In many cases you can just use the
     * MaybeOwned wrapper in place of the GC thing itself due to the implicit
     * cast operator. But if you want to call methods on the GC thing, for
     * example if it's a JS::Value, you have to use get(). */
    JSObject* Object::_getJSObject() const
    {
        return _isRooted ? _root->get() : _heap.get();
    }

    /* Roots the GC thing. You must not use this if you're already using the
     * wrapper to store a non-rooted GC thing. */
    void Object::putToRoot(JSObject* thing, DestroyNotify notify/* = nullptr*/, void* data/* = nullptr*/)
    {
        debug("root()");
        assert(!_isRooted);
        assert(_heap.get() == JS::GCPolicy<JSObject*>::initial());
        _isRooted = true;
        m_notify = notify;
        m_data = data;
        _root = new JS::PersistentRootedObject(__cx, thing);

        //cjh        auto gjs_cx = static_cast<GjsContext *>(JS_GetContextPrivate(__cx));
        //        assert(GJS_IS_CONTEXT(gjs_cx));
        //        g_object_weak_ref(G_OBJECT(gjs_cx), on_context_destroy, this);
        _hasWeakRef = true;
    }

    void Object::putToHeap(JSObject* thing)
    {
        _heap = thing;
        _heap.get();
        _isRooted = false;
    }

    void Object::reset()
    {
        debug("reset()");
        if (!_isRooted) {
            _heap = JS::GCPolicy<JSObject*>::initial();
            return;
        }

        teardownRooting();
        m_notify = nullptr;
        m_data = nullptr;
    }

    void Object::switchToRooted(DestroyNotify notify/* = nullptr*/, void *data/* = nullptr*/)
    {
        debug("switch to rooted");
        assert(!_isRooted);

        /* Prevent the thing from being garbage collected while it is in neither
         * _heap nor _root */
        JSAutoRequest ar(__cx);
        JS::RootedObject thing(__cx, _heap);

        reset();
        putToRoot(thing, notify, data);
        assert(_isRooted);
    }

    void Object::switchToUnrooted()
    {
        assert(_isRooted);

        if (_isKeepRootedUntilDie)
            return;

        debug("switch to unrooted");
        /* Prevent the thing from being garbage collected while it is in neither
         * _heap nor _root */
        JSAutoRequest ar(__cx);
        JS::RootedObject rootedThing(__cx, *_root);
        reset();
        putToHeap(rootedThing);
        assert(!_isRooted);
    }

    void Object::setKeepRootedUntilDie(bool keepRooted)
    {
        _isKeepRootedUntilDie = keepRooted;

        if (_isKeepRootedUntilDie)
        {
            if (!_isRooted)
                switchToRooted();
        }
    }

    /* Tracing makes no sense in the rooted case, because JS::PersistentRooted
     * already takes care of that. */
    void Object::trace(JSTracer* tracer, void* data)
    {
        debug("trace()");
        assert(!_isRooted);
        JS::TraceEdge(tracer, &_heap, "ccobj tracing");
    }

    /* If not tracing, then you must call this method during GC in order to
     * update the object's location if it was moved, or null it out if it was
     * finalized. If the object was finalized, returns true. */
    bool Object::updateAfterGC(void* data)
    {
        debug("updateAfterGC()");
        assert(!_isRooted);
        JSObject* oldPtr = _heap.unbarrieredGet();
        if (_heap.unbarrieredGet() != nullptr)
            JS_UpdateWeakPointerAfterGC(&_heap);

        JSObject* newPtr = _heap.unbarrieredGet();
        if (newPtr == nullptr)
        {
            _isRooted = false;
        }

        // FIXME: test to see ggc
        if (oldPtr != nullptr && newPtr != nullptr)
        {
            assert(oldPtr == newPtr);
        }
        return (newPtr == nullptr);
    }
    
    bool Object::isRooted() const
    {
        return _isRooted;
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
            printf("%s: try to detach on invalid object, owner: %p, target: %p\n", __FUNCTION__, ownerObj, targetObj);
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
