/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#include "Object.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM

    #include "../MappingUtils.h"
    #include "Class.h"
    #include "ScriptEngine.h"
    #include "Utils.h"

namespace se {

std::unordered_map<Object *, void *> __objectMap; // Currently, the value `void*` is always nullptr

namespace {
JSContext *__cx = nullptr;
} // namespace

Object::Object()
: _root(nullptr),
  _privateObject(nullptr),
  _cls(nullptr),
  _finalizeCb(nullptr),
  _rootCount(0) {
    _currentVMId = ScriptEngine::getInstance()->getVMId();
}

Object::~Object() {
    if (_rootCount > 0) {
        unprotect();
    }

    auto iter = __objectMap.find(this);
    if (iter != __objectMap.end()) {
        __objectMap.erase(iter);
    }
}

bool Object::init(Class *cls, JSObject *obj) {
    _cls  = cls;
    _heap = obj;

    assert(__objectMap.find(this) == __objectMap.end());
    __objectMap.emplace(this, nullptr);

    return true;
}

Object *Object::_createJSObject(Class *cls, JSObject *obj) {
    Object *ret = new Object();
    if (!ret->init(cls, obj)) {
        delete ret;
        ret = nullptr;
    }

    return ret;
}

Object *Object::createPlainObject() {
    Object *obj = Object::_createJSObject(nullptr, JS_NewPlainObject(__cx));
    return obj;
}

Object *Object::createObjectWithClass(Class *cls) {
    JSObject *jsobj = Class::_createJSObjectWithClass(cls);
    Object *  obj   = Object::_createJSObject(cls, jsobj);
    return obj;
}

Object *Object::getObjectWithPtr(void *ptr) {
    Object *obj  = nullptr;
    auto    iter = NativePtrToObjectMap::find(ptr);
    if (iter != NativePtrToObjectMap::end()) {
        obj = iter->second;
        obj->incRef();
    }
    return obj;
}

Object *Object::createArrayObject(size_t length) {
    JS::RootedObject jsobj(__cx, JS::NewArrayObject(__cx, length));
    Object *         obj = Object::_createJSObject(nullptr, jsobj);
    return obj;
}

Object *Object::createArrayBufferObject(const void *data, size_t byteLength) {
    Object* obj = nullptr;

    if (byteLength > 0 && data != nullptr)
    {
        mozilla::UniquePtr<uint8_t[], JS::FreePolicy> jsBuf(
            js_pod_arena_malloc<uint8_t>(js::ArrayBufferContentsArena, byteLength)
        );
        if (!jsBuf)
            return nullptr;

        memcpy(jsBuf.get(), data, byteLength);
        JS::RootedObject jsobj(__cx, JS::NewArrayBufferWithContents(__cx, byteLength, jsBuf.get()));
        if (jsobj)
        {
            // If JS::NewArrayBufferWithContents returns non-null, the ownership of
            // the data is transfered to obj, so we release the ownership here.
            mozilla::Unused << jsBuf.release();

            obj = Object::_createJSObject(nullptr, jsobj);
        }
    }
    else
    {
        JS::RootedObject jsobj(__cx, JS::NewArrayBuffer(__cx, byteLength));
        if (jsobj)
        {
            obj = Object::_createJSObject(nullptr, jsobj);
        }
    }

    return obj;
}

Object *Object::createTypedArray(TypedArrayType type, const void *data, size_t byteLength) {
    if (type == TypedArrayType::NONE) {
        SE_LOGE("Don't pass se::Object::TypedArrayType::NONE to createTypedArray API!");
        return nullptr;
    }

    if (type == TypedArrayType::UINT8_CLAMPED) {
        SE_LOGE("Doesn't support to create Uint8ClampedArray with Object::createTypedArray API!");
        return nullptr;
    }


#define CREATE_TYPEDARRAY(_type_, _data, _byteLength, count) { \
        void* tmpData = nullptr; \
        JS::RootedObject arr(__cx, JS_New##_type_##Array(__cx, (uint32_t)(count))); \
        bool isShared = false; \
        { \
            JS::AutoCheckCannotGC nogc; \
            tmpData = JS_Get##_type_##ArrayData(arr, &isShared, nogc); \
            memcpy(tmpData, (const void*)_data, (_byteLength)); \
        } \
        Object* obj = Object::_createJSObject(nullptr, arr); \
        return obj; }

        switch (type) {
            case TypedArrayType::INT8:
                CREATE_TYPEDARRAY(Int8, data, byteLength, byteLength);
            case TypedArrayType::INT16:
                CREATE_TYPEDARRAY(Int16, data, byteLength, byteLength/2);
            case TypedArrayType::INT32:
                CREATE_TYPEDARRAY(Int32, data, byteLength, byteLength/4);
            case TypedArrayType::UINT8:
                CREATE_TYPEDARRAY(Uint8, data, byteLength, byteLength);
            case TypedArrayType::UINT16:
                CREATE_TYPEDARRAY(Uint16, data, byteLength, byteLength/2);
            case TypedArrayType::UINT32:
                CREATE_TYPEDARRAY(Uint32, data, byteLength, byteLength/4);
            case TypedArrayType::FLOAT32:
                CREATE_TYPEDARRAY(Float32, data, byteLength, byteLength/4);
            case TypedArrayType::FLOAT64:
                CREATE_TYPEDARRAY(Float64, data, byteLength, byteLength/8);
            default:
                assert(false); // Should never go here.
                break;
        }

        return nullptr;
#undef CREATE_TYPEDARRAY
}

/* static */
Object *Object::createTypedArrayWithBuffer(TypedArrayType type, const Object *obj) {
    assert(false);
    return nullptr;
}

/* static */
Object *Object::createTypedArrayWithBuffer(TypedArrayType type, const Object *obj, size_t offset) {
    assert(false);
    return nullptr;
}

/* static */
Object *Object::createTypedArrayWithBuffer(TypedArrayType type, const Object *obj, size_t offset, size_t byteLength) {
    assert(false);
    return nullptr;
}

Object *Object::createUint8TypedArray(uint8_t *data, size_t dataCount) {
    return createTypedArray(TypedArrayType::UINT8, data, dataCount);
}

Object *Object::createJSONObject(const std::string &jsonStr) {
    Value           strVal(jsonStr);
    JS::RootedValue jsStr(__cx);
    internal::seToJsValue(__cx, strVal, &jsStr);
    JS::RootedValue  jsObj(__cx);
    JS::RootedString rootedStr(__cx, jsStr.toString());
    Object *         obj = nullptr;
    if (JS_ParseJSON(__cx, rootedStr, &jsObj)) {
        obj = Object::_createJSObject(nullptr, jsObj.toObjectOrNull());
    }
    return obj;
}

void Object::_setFinalizeCallback(JSFinalizeOp finalizeCb) {
    _finalizeCb = finalizeCb;
}

bool Object::getProperty(const char *name, Value *data, bool cachePropertyName) {
    assert(data != nullptr);
    data->setUndefined();

    JSObject *jsobj = _getJSObject();
    if (jsobj == nullptr)
        return false;

    JS::RootedObject object(__cx, jsobj);

    bool found = false;
    bool ok    = JS_HasProperty(__cx, object, name, &found);

    if (!ok || !found) {
        return false;
    }

    JS::RootedValue rcValue(__cx);
    ok = JS_GetProperty(__cx, object, name, &rcValue);

    if (ok && data) {
        internal::jsToSeValue(__cx, rcValue, data);
    }

    return ok;
}

bool Object::setProperty(const char *name, const Value &v) {
    JS::RootedObject object(__cx, _getJSObject());

    JS::RootedValue value(__cx);
    internal::seToJsValue(__cx, v, &value);
    return JS_SetProperty(__cx, object, name, value);
}

bool Object::defineProperty(const char *name, JSNative getter, JSNative setter) {
    JS::RootedObject jsObj(__cx, _getJSObject());
    return JS_DefineProperty(__cx, jsObj, name, getter, setter, JSPROP_PERMANENT | JSPROP_ENUMERATE);
}

bool Object::defineOwnProperty(const char *name, const se::Value &value, bool writable, bool enumerable, bool configurable) {
    assert(false);
    return false;
}

bool Object::call(const ValueArray &args, Object *thisObject, Value *rval /* = nullptr*/) {
    assert(isFunction());

    JS::RootedValueVector jsarr(__cx);
    jsarr.reserve(args.size());
    internal::seToJsArgs(__cx, args, &jsarr);

    JS::RootedObject contextObject(__cx);
    if (thisObject != nullptr) {
        contextObject.set(thisObject->_getJSObject());
    }

    JSObject *      funcObj = _getJSObject();
    JS::RootedValue func(__cx, JS::ObjectValue(*funcObj));
    JS::RootedValue rcValue(__cx);

    bool ok = JS_CallFunctionValue(__cx, contextObject, func, jsarr, &rcValue);

    if (ok) {
        if (rval != nullptr)
            internal::jsToSeValue(__cx, rcValue, rval);
    } else {
        se::ScriptEngine::getInstance()->clearException();
    }

    return ok;
}

bool Object::defineFunction(const char *funcName, JSNative func) {
    JS::RootedObject object(__cx, _getJSObject());
    JSFunction* jsFunc = JS_DefineFunction(__cx, object, funcName, func, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    return jsFunc != nullptr;
}

bool Object::getArrayLength(uint32_t *length) const {
    assert(length != nullptr);
    if (!isArray())
        return false;

    JS::RootedObject object(__cx, _getJSObject());
    if (JS::GetArrayLength(__cx, object, length))
        return true;

    *length = 0;
    return false;
}

bool Object::getArrayElement(uint32_t index, Value *data) const {
    assert(data != nullptr);
    if (!isArray())
        return false;

    JS::RootedObject object(__cx, _getJSObject());
    JS::RootedValue  rcValue(__cx);
    if (JS_GetElement(__cx, object, index, &rcValue)) {
        internal::jsToSeValue(__cx, rcValue, data);
        return true;
    }

    data->setUndefined();
    return false;
}

bool Object::setArrayElement(uint32_t index, const Value &data) {
    if (!isArray())
        return false;

    JS::RootedValue jsval(__cx);
    internal::seToJsValue(__cx, data, &jsval);
    JS::RootedObject thisObj(__cx, _getJSObject());
    return JS_SetElement(__cx, thisObj, index, jsval);
}

bool Object::isFunction() const {
    return JS_ObjectIsFunction(_getJSObject());
}

bool Object::_isNativeFunction(JSNative func) const {
    JSObject *obj = _getJSObject();
    return JS_ObjectIsFunction(obj) && JS_IsNativeFunction(obj, func);
}

bool Object::isTypedArray() const {
    return JS_IsTypedArrayObject(_getJSObject());
}

Object::TypedArrayType Object::getTypedArrayType() const {
    TypedArrayType ret = TypedArrayType::NONE;
    JSObject *     obj = _getJSObject();
    if (JS_IsInt8Array(obj))
        ret = TypedArrayType::INT8;
    else if (JS_IsInt16Array(obj))
        ret = TypedArrayType::INT16;
    else if (JS_IsInt32Array(obj))
        ret = TypedArrayType::INT32;
    else if (JS_IsUint8Array(obj))
        ret = TypedArrayType::UINT8;
    else if (JS_IsUint8ClampedArray(obj))
        ret = TypedArrayType::UINT8_CLAMPED;
    else if (JS_IsUint16Array(obj))
        ret = TypedArrayType::UINT16;
    else if (JS_IsUint32Array(obj))
        ret = TypedArrayType::UINT32;
    else if (JS_IsFloat32Array(obj))
        ret = TypedArrayType::FLOAT32;
    else if (JS_IsFloat64Array(obj))
        ret = TypedArrayType::FLOAT64;

    return ret;
}

bool Object::getTypedArrayData(uint8_t **ptr, size_t *length) const {
    assert(JS_IsArrayBufferViewObject(_getJSObject()));
    bool                  isShared = false;
    JS::AutoCheckCannotGC nogc;
    *ptr    = (uint8_t *)JS_GetArrayBufferViewData(_getJSObject(), &isShared, nogc);
    *length = JS_GetArrayBufferViewByteLength(_getJSObject());
    return (*ptr != nullptr);
}

bool Object::isArray() const {
    JS::RootedValue value(__cx, JS::ObjectValue(*_getJSObject()));
    bool            isArray = false;
    return JS::IsArrayObject(__cx, value, &isArray) && isArray;
}

bool Object::isArrayBuffer() const {
    return JS::IsArrayBufferObject(_getJSObject());
}

bool Object::getArrayBufferData(uint8_t **ptr, size_t *length) const {
    assert(isArrayBuffer());

    bool                  isShared = false;
    JS::AutoCheckCannotGC nogc;
    *ptr    = (uint8_t *)JS::GetArrayBufferData(_getJSObject(), &isShared, nogc);
    *length = JS::GetArrayBufferByteLength(_getJSObject());
    return (*ptr != nullptr);
}

bool Object::getAllKeys(std::vector<std::string> *allKeys) const {
    assert(allKeys != nullptr);
    JS::RootedObject         jsobj(__cx, _getJSObject());
    JS::Rooted<JS::IdVector> props(__cx, JS::IdVector(__cx));
    if (!JS_Enumerate(__cx, jsobj, &props))
        return false;

    std::vector<std::string> keys;
    for (size_t i = 0, length = props.length(); i < length; ++i) {
        JS::RootedId    id(__cx, props[i]);
        JS::RootedValue keyVal(__cx);
        JS_IdToValue(__cx, id, &keyVal);

        if (JSID_IS_STRING(id)) {
            JS::RootedString rootedKeyVal(__cx, keyVal.toString());
            allKeys->push_back(internal::jsToStdString(__cx, rootedKeyVal));
        } else if (JSID_IS_INT(id)) {
            char buf[50] = {0};
            snprintf(buf, sizeof(buf), "%d", keyVal.toInt32());
            allKeys->push_back(buf);
        } else {
            assert(false);
        }
    }

    return true;
}

void Object::setPrivateObject(PrivateObjectBase *data) {
    assert(_privateObject == nullptr);
    #if CC_DEBUG
    //assert(NativePtrToObjectMap::find(data->getRaw()) == NativePtrToObjectMap::end());
    auto it = NativePtrToObjectMap::find(data->getRaw());
    if (it != NativePtrToObjectMap::end()) {
        auto *pri = it->second->getPrivateObject();
        SE_LOGE("Already exists object %s/[%s], trying to add %s/[%s]\n", pri->getName(), typeid(*pri).name(), data->getName(), typeid(*data).name());
        #if JSB_TRACK_OBJECT_CREATION
        SE_LOGE(" previous object created at %s\n", it->second->_objectCreationStackFrame.c_str());
        #endif
        assert(false);
    }
    #endif
    JS::RootedObject obj(__cx, _getJSObject());
    internal::setPrivate(__cx, obj, data, this, &_internalData, _finalizeCb); //TODO(cjh): how to use _internalData?
    NativePtrToObjectMap::emplace(data->getRaw(), this);
    _privateObject = data;
    defineOwnProperty("__native_ptr__", se::Value(static_cast<uint64_t>(reinterpret_cast<uintptr_t>(data->getRaw()))), false, false, false);
}

PrivateObjectBase *Object::getPrivateObject() const {
    if (_privateObject == nullptr) {
        JS::RootedObject obj(__cx, _getJSObject());
        const_cast<Object *>(this)->_privateObject = static_cast<PrivateObjectBase *>(internal::getPrivate(__cx, obj, 0));
    }
    return _privateObject;
}

void Object::clearPrivateData(bool clearMapping) {
    if (_privateObject != nullptr) {
        if (clearMapping) {
            NativePtrToObjectMap::erase(_privateObject->getRaw());
        }
        JS::RootedObject obj(__cx, _getJSObject());
        internal::clearPrivate(__cx, obj);
        defineOwnProperty("__native_ptr__", se::Value(static_cast<uint64_t>(reinterpret_cast<uintptr_t>(nullptr))), false, false, false);
        delete _privateObject;
        _privateObject = nullptr;
    }
}

void Object::setContext(JSContext *cx) {
    __cx = cx;
}

// static
void Object::cleanup() {
    for (const auto &e : __objectMap) {
        e.first->reset();
    }

    ScriptEngine::getInstance()->addAfterCleanupHook([]() {
        __objectMap.clear();
        const auto &instance = NativePtrToObjectMap::instance();
        for (const auto &e : instance) {
            e.second->decRef();
        }
        NativePtrToObjectMap::clear();
        __cx = nullptr;
    });
}

JSObject *Object::_getJSObject() const {
    return isRooted() ? _root->get() : _heap.get();
}

void Object::root() {
    if (_rootCount == 0) {
        protect();
    }
    ++_rootCount;
}

void Object::unroot() {
    if (_rootCount > 0) {
        --_rootCount;
        if (_rootCount == 0) {
            unprotect();
        }
    }
}

void Object::protect() {
    assert(_root == nullptr);
    assert(_heap != JS::SafelyInitialized<JSObject *>::create());

    _root = new JS::PersistentRootedObject(__cx, _heap);
    _heap.set(JS::SafelyInitialized<JSObject *>::create());
}

void Object::unprotect() {
    if (_root == nullptr)
        return;

    assert(_currentVMId == ScriptEngine::getInstance()->getVMId());
    assert(_heap == JS::SafelyInitialized<JSObject *>::create());
    _heap = *_root;
    delete _root;
    _root = nullptr;
}

void Object::reset() {
    if (_root != nullptr) {
        delete _root;
        _root = nullptr;
    }

    _heap = JS::SafelyInitialized<JSObject *>::create();
}

/* Tracing makes no sense in the rooted case, because JS::PersistentRooted
     * already takes care of that. */
void Object::trace(JSTracer *tracer, void *data) {
    assert(!isRooted());
    JS::TraceEdge(tracer, &_heap, "ccobj tracing");
}

/* If not tracing, then you must call this method during GC in order to
     * update the object's location if it was moved, or null it out if it was
     * finalized. If the object was finalized, returns true. */
bool Object::updateAfterGC(JSTracer* trc, void *data) {
    assert(!isRooted());
    bool                   isGarbageCollected = false;
    internal::PrivateData *internalData       = nullptr;

    JSObject *oldPtr = _heap.unbarrieredGet();
    if (_heap.unbarrieredGet() != nullptr)
        JS_UpdateWeakPointerAfterGC(trc, &_heap);

    JSObject *newPtr = _heap.unbarrieredGet();

    // IDEA: test to see ggc
    if (oldPtr != nullptr && newPtr != nullptr) {
        assert(oldPtr == newPtr);
    }
    isGarbageCollected = (newPtr == nullptr);
    if (isGarbageCollected && internalData != nullptr) {
        free(internalData);
    }
    return isGarbageCollected;
}

bool Object::isRooted() const {
    return _rootCount > 0;
}

bool Object::strictEquals(Object *o) const {
    JSObject *thisObj  = _getJSObject();
    JSObject *oThisObj = o->_getJSObject();
    if ((thisObj == nullptr || oThisObj == nullptr) && thisObj != oThisObj)
        return false;

    assert(thisObj);
    assert(oThisObj);
    JS::RootedValue v1(__cx, JS::ObjectValue(*_getJSObject()));
    JS::RootedValue v2(__cx, JS::ObjectValue(*o->_getJSObject()));
    bool            same = false;
    bool            ok   = JS::SameValue(__cx, v1, v2, &same);
    return ok && same;
}

bool Object::attachObject(Object *obj) {
    assert(obj);

    Object *global = ScriptEngine::getInstance()->getGlobalObject();
    Value   jsbVal;
    if (!global->getProperty("jsb", &jsbVal))
        return false;
    Object *jsbObj = jsbVal.toObject();

    Value func;

    if (!jsbObj->getProperty("registerNativeRef", &func))
        return false;

    ValueArray args;
    args.push_back(Value(this));
    args.push_back(Value(obj));
    func.toObject()->call(args, global);
    return true;
}

bool Object::detachObject(Object *obj) {
    assert(obj);
    Object *global = ScriptEngine::getInstance()->getGlobalObject();
    Value   jsbVal;
    if (!global->getProperty("jsb", &jsbVal))
        return false;
    Object *jsbObj = jsbVal.toObject();

    Value func;

    if (!jsbObj->getProperty("unregisterNativeRef", &func))
        return false;

    ValueArray args;
    args.push_back(Value(this));
    args.push_back(Value(obj));
    func.toObject()->call(args, global);
    return true;
}

std::string Object::toString() const {
    std::string ret;
    if (isFunction() || isArray() || isTypedArray()) {
        JS::RootedValue val(__cx, JS::ObjectOrNullValue(_getJSObject()));
        internal::forceConvertJsValueToStdString(__cx, val, &ret);
    } else if (isArrayBuffer()) {
        ret = "[object ArrayBuffer]";
    } else {
        ret = "[object Object]";
    }
    return ret;
}

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM
