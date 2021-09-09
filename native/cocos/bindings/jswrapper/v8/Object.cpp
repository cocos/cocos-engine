/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8
    #include "../MappingUtils.h"
    #include "Class.h"
    #include "ScriptEngine.h"
    #include "Utils.h"

    #include <memory>
    #include <unordered_map>

namespace se {
//NOLINTNEXTLINE
std::unique_ptr<std::unordered_map<Object *, void *>> __objectMap; // Currently, the value `void*` is always nullptr

namespace {
v8::Isolate *__isolate = nullptr; //NOLINT
    #if CC_DEBUG_JS_OBJECT_ID && CC_DEBUG
uint32_t nativeObjectId = 0;
    #endif
} // namespace

Object::Object()
: _cls(nullptr),
  _rootCount(0),
  _privateData(nullptr),
  _finalizeCb(nullptr),
  _internalData(nullptr) {
}

Object::~Object() {
    if (_rootCount > 0) {
        _obj.unref();
    }

    if (__objectMap) {
        __objectMap->erase(this);
    }
}

/*static*/
void Object::nativeObjectFinalizeHook(void *nativeObj) {
    if (nativeObj == nullptr) {
        return;
    }

    auto iter = NativePtrToObjectMap::find(nativeObj);
    if (iter != NativePtrToObjectMap::end()) {
        Object *obj = iter->second;
        if (obj->_finalizeCb != nullptr) {
            obj->_finalizeCb(nativeObj);
        } else {
            assert(obj->_getClass() != nullptr);
            if (obj->_getClass()->_finalizeFunc != nullptr) {
                obj->_getClass()->_finalizeFunc(nativeObj);
            }
        }
        obj->decRef();
        NativePtrToObjectMap::erase(iter);
    } else {
        //            assert(false);
    }
}

/* static */
void Object::setIsolate(v8::Isolate *isolate) {
    __isolate = isolate;
}

void Object::setup() {
    __objectMap = std::make_unique<std::unordered_map<Object *, void *>>();
}

/* static */
void Object::cleanup() {
    void *  nativeObj = nullptr;
    Object *obj       = nullptr;
    Class * cls       = nullptr;

    const auto &nativePtrToObjectMap = NativePtrToObjectMap::instance();
    for (const auto &e : nativePtrToObjectMap) {
        nativeObj = e.first;
        obj       = e.second;

        if (obj->_finalizeCb != nullptr) {
            obj->_finalizeCb(nativeObj);
        } else {
            if (obj->_getClass() != nullptr) {
                if (obj->_getClass()->_finalizeFunc != nullptr) {
                    obj->_getClass()->_finalizeFunc(nativeObj);
                }
            }
        }
        // internal data should only be freed in Object::cleanup, since in other case, it is freed in ScriptEngine::privateDataFinalize
        if (obj->_internalData != nullptr) {
            free(obj->_internalData);
            obj->_internalData = nullptr;
        }
        obj->decRef();
    }

    NativePtrToObjectMap::clear();
    NonRefNativePtrCreatedByCtorMap::clear();

    if (__objectMap) {
        std::vector<Object *> toReleaseObjects;
        for (const auto &e : *__objectMap) {
            obj = e.first;
            cls = obj->_getClass();
            obj->_obj.persistent().Reset();
            obj->_rootCount = 0;

            if (cls != nullptr && cls->_name == "__PrivateData") {
                toReleaseObjects.push_back(obj);
            }
        }
        for (auto *e : toReleaseObjects) {
            e->decRef();
        }
    }

    __objectMap.reset();
    __isolate = nullptr;
}

Object *Object::createPlainObject() {
    v8::Local<v8::Object> jsobj = v8::Object::New(__isolate);
    Object *              obj   = _createJSObject(nullptr, jsobj);
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

Object *Object::_createJSObject(Class *cls, v8::Local<v8::Object> obj) { // NOLINT(readability-identifier-naming)
    auto *ret = new Object();
    if (!ret->init(cls, obj)) {
        delete ret;
        ret = nullptr;
    }
    return ret;
}

Object *Object::createObjectWithClass(Class *cls) {
    v8::Local<v8::Object> jsobj = Class::_createJSObjectWithClass(cls);
    Object *              obj   = Object::_createJSObject(cls, jsobj);
    return obj;
}

Object *Object::createArrayObject(size_t length) {
    v8::Local<v8::Array> jsobj = v8::Array::New(__isolate, static_cast<int>(length));
    Object *             obj   = Object::_createJSObject(nullptr, jsobj);
    return obj;
}

Object *Object::createArrayBufferObject(void *data, size_t byteLength) {
    v8::Local<v8::ArrayBuffer> jsobj = v8::ArrayBuffer::New(__isolate, byteLength);
    if (data) {
        memcpy(jsobj->GetBackingStore()->Data(), data, byteLength);
    } else {
        memset(jsobj->GetBackingStore()->Data(), 0, byteLength);
    }
    Object *obj = Object::_createJSObject(nullptr, jsobj);
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

    v8::Local<v8::ArrayBuffer> jsobj = v8::ArrayBuffer::New(__isolate, byteLength);
    //If data has content,then will copy data into buffer,or will only clear buffer.
    if (data) {
        memcpy(jsobj->GetBackingStore()->Data(), data, byteLength);
    } else {
        memset(jsobj->GetBackingStore()->Data(), 0, byteLength);
    }

    v8::Local<v8::Object> arr;
    switch (type) {
        case TypedArrayType::INT8:
            arr = v8::Int8Array::New(jsobj, 0, byteLength);
            break;
        case TypedArrayType::INT16:
            arr = v8::Int16Array::New(jsobj, 0, byteLength / 2);
            break;
        case TypedArrayType::INT32:
            arr = v8::Int32Array::New(jsobj, 0, byteLength / 4);
            break;
        case TypedArrayType::UINT8:
            arr = v8::Uint8Array::New(jsobj, 0, byteLength);
            break;
        case TypedArrayType::UINT16:
            arr = v8::Uint16Array::New(jsobj, 0, byteLength / 2);
            break;
        case TypedArrayType::UINT32:
            arr = v8::Uint32Array::New(jsobj, 0, byteLength / 4);
            break;
        case TypedArrayType::FLOAT32:
            arr = v8::Float32Array::New(jsobj, 0, byteLength / 4);
            break;
        case TypedArrayType::FLOAT64:
            arr = v8::Float64Array::New(jsobj, 0, byteLength / 8);
            break;
        default:
            assert(false); // Should never go here.
            break;
    }

    Object *obj = Object::_createJSObject(nullptr, arr);
    return obj;
}

Object *Object::createUint8TypedArray(uint8_t *bytes, size_t byteLength) {
    return createTypedArray(TypedArrayType::UINT8, bytes, byteLength);
}

Object *Object::createJSONObject(const std::string &jsonStr) {
    v8::Local<v8::Context> context = __isolate->GetCurrentContext();
    Value                  strVal(jsonStr);
    v8::Local<v8::Value>   jsStr;
    internal::seToJsValue(__isolate, strVal, &jsStr);
    v8::Local<v8::String>     v8Str = v8::Local<v8::String>::Cast(jsStr);
    v8::MaybeLocal<v8::Value> ret   = v8::JSON::Parse(context, v8Str);
    if (ret.IsEmpty()) {
        return nullptr;
    }

    v8::Local<v8::Object> jsobj = v8::Local<v8::Object>::Cast(ret.ToLocalChecked());
    return Object::_createJSObject(nullptr, jsobj);
}

bool Object::init(Class *cls, v8::Local<v8::Object> obj) {
    _cls = cls;

    _obj.init(obj);
    _obj.setFinalizeCallback(nativeObjectFinalizeHook);

    if (__objectMap) {
        assert(__objectMap->find(this) == __objectMap->end());
        __objectMap->emplace(this, nullptr);
    }

    #if CC_DEBUG && CC_DEBUG_JS_OBJECT_ID
    this->_objectId = ++nativeObjectId;
    this->setProperty("__object_id__", se::Value(this->_objectId));
    this->setProperty("__native_class_name__", se::Value(cls ? cls->getName() : "[noname]"));
    #endif

    return true;
}

bool Object::getProperty(const char *name, Value *data) {
    assert(data != nullptr);
    data->setUndefined();

    v8::HandleScope handleScope(__isolate);

    if (_obj.persistent().IsEmpty()) {
        return false;
    }

    v8::MaybeLocal<v8::String> nameValue = v8::String::NewFromUtf8(__isolate, name, v8::NewStringType::kNormal);
    if (nameValue.IsEmpty()) {
        return false;
    }

    v8::Local<v8::String>  nameValToLocal = nameValue.ToLocalChecked();
    v8::Local<v8::Context> context        = __isolate->GetCurrentContext();
    v8::Maybe<bool>        maybeExist     = _obj.handle(__isolate)->Has(context, nameValToLocal);
    if (maybeExist.IsNothing()) {
        return false;
    }

    if (!maybeExist.FromJust()) {
        return false;
    }

    v8::MaybeLocal<v8::Value> result = _obj.handle(__isolate)->Get(context, nameValToLocal);
    if (result.IsEmpty()) {
        return false;
    }

    internal::jsToSeValue(__isolate, result.ToLocalChecked(), data);

    return true;
}

bool Object::deleteProperty(const char *name) {
    v8::HandleScope handleScope(__isolate);

    if (_obj.persistent().IsEmpty()) {
        return false;
    }

    v8::MaybeLocal<v8::String> nameValue = v8::String::NewFromUtf8(__isolate, name, v8::NewStringType::kNormal);
    if (nameValue.IsEmpty()) {
        return false;
    }

    v8::Local<v8::String>  nameValToLocal = nameValue.ToLocalChecked();
    v8::Local<v8::Context> context        = __isolate->GetCurrentContext();
    v8::Maybe<bool>        maybeExist     = _obj.handle(__isolate)->Delete(context, nameValToLocal);
    if (maybeExist.IsNothing()) {
        return false;
    }

    if (!maybeExist.FromJust()) {
        return false;
    }

    return true;
}

bool Object::setProperty(const char *name, const Value &data) {
    v8::MaybeLocal<v8::String> nameValue = v8::String::NewFromUtf8(__isolate, name, v8::NewStringType::kNormal);
    if (nameValue.IsEmpty()) {
        return false;
    }

    v8::Local<v8::Value> value;
    internal::seToJsValue(__isolate, data, &value);
    v8::Maybe<bool> ret = _obj.handle(__isolate)->Set(__isolate->GetCurrentContext(), nameValue.ToLocalChecked(), value);
    if (ret.IsNothing()) {
        SE_LOGD("ERROR: %s, Set return nothing ...\n", __FUNCTION__);
        return false;
    }
    return true;
}

bool Object::defineProperty(const char *name, v8::AccessorNameGetterCallback getter, v8::AccessorNameSetterCallback setter) {
    v8::MaybeLocal<v8::String> nameValue = v8::String::NewFromUtf8(__isolate, name, v8::NewStringType::kNormal);
    if (nameValue.IsEmpty()) {
        return false;
    }

    v8::Local<v8::String> nameValChecked = nameValue.ToLocalChecked();
    v8::Local<v8::Name>   jsName         = v8::Local<v8::Name>::Cast(nameValChecked);
    v8::Maybe<bool>       ret            = _obj.handle(__isolate)->SetAccessor(__isolate->GetCurrentContext(), jsName, getter, setter);
    return ret.IsJust() && ret.FromJust();
}

bool Object::isFunction() const {
    return const_cast<Object *>(this)->_obj.handle(__isolate)->IsCallable();
}

bool Object::_isNativeFunction() const { // NOLINT(readability-identifier-naming)
    if (isFunction()) {
        std::string info = toString();
        if (info.find("[native code]") != std::string::npos) {
            return true;
        }
    }
    return false;
}

bool Object::isTypedArray() const {
    return const_cast<Object *>(this)->_obj.handle(__isolate)->IsTypedArray();
}

Object::TypedArrayType Object::getTypedArrayType() const {
    v8::Local<v8::Value> value = const_cast<Object *>(this)->_obj.handle(__isolate);
    TypedArrayType       ret   = TypedArrayType::NONE;
    if (value->IsInt8Array()) {
        ret = TypedArrayType::INT8;
    } else if (value->IsInt16Array()) {
        ret = TypedArrayType::INT16;
    } else if (value->IsInt32Array()) {
        ret = TypedArrayType::INT32;
    } else if (value->IsUint8Array()) {
        ret = TypedArrayType::UINT8;
    } else if (value->IsUint8ClampedArray()) {
        ret = TypedArrayType::UINT8_CLAMPED;
    } else if (value->IsUint16Array()) {
        ret = TypedArrayType::UINT16;
    } else if (value->IsUint32Array()) {
        ret = TypedArrayType::UINT32;
    } else if (value->IsFloat32Array()) {
        ret = TypedArrayType::FLOAT32;
    } else if (value->IsFloat64Array()) {
        ret = TypedArrayType::FLOAT64;
    }

    return ret;
}

bool Object::getTypedArrayData(uint8_t **ptr, size_t *length) const {
    assert(isTypedArray());
    v8::Local<v8::Object>     obj          = const_cast<Object *>(this)->_obj.handle(__isolate);
    v8::Local<v8::TypedArray> arr          = v8::Local<v8::TypedArray>::Cast(obj);
    const auto &              backingStore = arr->Buffer()->GetBackingStore();
    *ptr                                   = static_cast<uint8_t *>(backingStore->Data()) + arr->ByteOffset();
    if (length) {
        *length = arr->ByteLength();
    }
    return true;
}

bool Object::isArrayBuffer() const {
    v8::Local<v8::Object> obj = const_cast<Object *>(this)->_obj.handle(__isolate);
    return obj->IsArrayBuffer();
}

bool Object::getArrayBufferData(uint8_t **ptr, size_t *length) const {
    assert(isArrayBuffer());
    v8::Local<v8::Object>      obj          = const_cast<Object *>(this)->_obj.handle(__isolate);
    v8::Local<v8::ArrayBuffer> arrBuf       = v8::Local<v8::ArrayBuffer>::Cast(obj);
    const auto &               backingStore = arrBuf->GetBackingStore();
    *ptr                                    = static_cast<uint8_t *>(backingStore->Data());
    if (length) {
        *length = backingStore->ByteLength();
    }

    return true;
}

void Object::setPrivateData(void *data) {
    assert(_privateData == nullptr);
    assert(NativePtrToObjectMap::find(data) == NativePtrToObjectMap::end());
    internal::setPrivate(__isolate, _obj, data, &_internalData);
    NativePtrToObjectMap::emplace(data, this);
    _privateData = data;
    setProperty("__native_ptr__", se::Value(static_cast<uint64_t>(reinterpret_cast<uintptr_t>(data))));
}

void *Object::getPrivateData() const {
    if (_privateData == nullptr) {
        const_cast<Object *>(this)->_privateData = internal::getPrivate(__isolate, const_cast<Object *>(this)->_obj.handle(__isolate));
    }
    return _privateData;
}

void Object::clearPrivateData(bool clearMapping) {
    if (_privateData != nullptr) {
        if (clearMapping) {
            NativePtrToObjectMap::erase(_privateData);
        }
        internal::clearPrivate(__isolate, _obj);
        setProperty("__native_ptr__", se::Value(static_cast<uint64_t>(reinterpret_cast<uintptr_t>(nullptr))));
        _privateData = nullptr;
    }
}

v8::Local<v8::Object> Object::_getJSObject() const { // NOLINT(readability-identifier-naming)
    return const_cast<Object *>(this)->_obj.handle(__isolate);
}

ObjectWrap &Object::_getWrap() { // NOLINT(readability-identifier-naming)
    return _obj;
}

bool Object::call(const ValueArray &args, Object *thisObject, Value *rval /* = nullptr*/) {
    if (_obj.persistent().IsEmpty()) {
        SE_LOGD("Function object is released!\n");
        return false;
    }
    size_t                            argc = 0;
    std::vector<v8::Local<v8::Value>> argv;
    argv.reserve(10);
    argc = args.size();
    internal::seToJsArgs(__isolate, args, &argv);

    v8::Local<v8::Object> thiz = v8::Local<v8::Object>::Cast(v8::Undefined(__isolate));
    if (thisObject != nullptr) {
        if (thisObject->_obj.persistent().IsEmpty()) {
            SE_LOGD("This object is released!\n");
            return false;
        }
        thiz = thisObject->_obj.handle(__isolate);
    }

    for (size_t i = 0; i < argc; ++i) {
        if (argv[i].IsEmpty()) {
            SE_LOGD("%s argv[%d] is released!\n", __FUNCTION__, (int)i);
            return false;
        }
    }

    v8::Local<v8::Context>    context = se::ScriptEngine::getInstance()->_getContext();
    v8::MaybeLocal<v8::Value> result  = _obj.handle(__isolate)->CallAsFunction(context, thiz, static_cast<int>(argc), argv.data());

    if (!result.IsEmpty()) {
        if (rval != nullptr) {
            internal::jsToSeValue(__isolate, result.ToLocalChecked(), rval);
        }
        return true;
    }
    SE_REPORT_ERROR("Invoking function (%p) failed!", this);
    se::ScriptEngine::getInstance()->clearException();

    //        assert(false);

    return false;
}

bool Object::defineFunction(const char *funcName, void (*func)(const v8::FunctionCallbackInfo<v8::Value> &args)) {
    v8::MaybeLocal<v8::String> maybeFuncName = v8::String::NewFromUtf8(__isolate, funcName, v8::NewStringType::kNormal);
    if (maybeFuncName.IsEmpty()) {
        return false;
    }

    v8::Local<v8::Context>       context   = __isolate->GetCurrentContext();
    v8::MaybeLocal<v8::Function> maybeFunc = v8::FunctionTemplate::New(__isolate, func)->GetFunction(context);
    if (maybeFunc.IsEmpty()) {
        return false;
    }

    v8::Maybe<bool> ret = _obj.handle(__isolate)->Set(context,
                                                      v8::Local<v8::Name>::Cast(maybeFuncName.ToLocalChecked()),
                                                      maybeFunc.ToLocalChecked());

    return ret.IsJust() && ret.FromJust();
}

bool Object::isArray() const {
    return const_cast<Object *>(this)->_obj.handle(__isolate)->IsArray();
}

bool Object::getArrayLength(uint32_t *length) const {
    assert(isArray());
    assert(length != nullptr);
    auto *thiz = const_cast<Object *>(this);

    v8::MaybeLocal<v8::String> lengthStr = v8::String::NewFromUtf8(__isolate, "length", v8::NewStringType::kNormal);
    if (lengthStr.IsEmpty()) {
        *length = 0;
        return false;
    }
    v8::Local<v8::Context> context = __isolate->GetCurrentContext();

    v8::MaybeLocal<v8::Value> val = thiz->_obj.handle(__isolate)->Get(context, lengthStr.ToLocalChecked());
    if (val.IsEmpty()) {
        return false;
    }

    v8::MaybeLocal<v8::Object> obj = val.ToLocalChecked()->ToObject(context);
    if (obj.IsEmpty()) {
        return false;
    }

    v8::Maybe<uint32_t> mbLen = obj.ToLocalChecked()->Uint32Value(context);
    if (mbLen.IsNothing()) {
        return false;
    }

    *length = mbLen.FromJust();
    return true;
}

bool Object::getArrayElement(uint32_t index, Value *data) const {
    assert(isArray());
    assert(data != nullptr);
    auto *                    thiz   = const_cast<Object *>(this);
    v8::MaybeLocal<v8::Value> result = thiz->_obj.handle(__isolate)->Get(__isolate->GetCurrentContext(), index);

    if (result.IsEmpty()) {
        return false;
    }

    internal::jsToSeValue(__isolate, result.ToLocalChecked(), data);
    return true;
}

bool Object::setArrayElement(uint32_t index, const Value &data) {
    assert(isArray());

    v8::Local<v8::Value> jsval;
    internal::seToJsValue(__isolate, data, &jsval);
    v8::Maybe<bool> ret = _obj.handle(__isolate)->Set(__isolate->GetCurrentContext(), index, jsval);

    return ret.IsJust() && ret.FromJust();
}

bool Object::getAllKeys(std::vector<std::string> *allKeys) const {
    assert(allKeys != nullptr);
    auto *                    thiz    = const_cast<Object *>(this);
    v8::Local<v8::Context>    context = __isolate->GetCurrentContext();
    v8::MaybeLocal<v8::Array> keys    = thiz->_obj.handle(__isolate)->GetOwnPropertyNames(context);
    if (keys.IsEmpty()) {
        return false;
    }

    v8::Local<v8::Array> keysChecked = keys.ToLocalChecked();
    Value                keyVal;
    for (uint32_t i = 0, len = keysChecked->Length(); i < len; ++i) {
        v8::MaybeLocal<v8::Value> key = keysChecked->Get(context, i);
        if (key.IsEmpty()) {
            allKeys->clear();
            return false;
        }
        internal::jsToSeValue(__isolate, key.ToLocalChecked(), &keyVal);
        if (keyVal.isString()) {
            allKeys->push_back(keyVal.toString());
        } else if (keyVal.isNumber()) {
            char buf[50] = {0};
            snprintf(buf, sizeof(buf), "%d", keyVal.toInt32());
            allKeys->push_back(buf);
        } else {
            assert(false);
        }
    }
    return true;
}

Class *Object::_getClass() const { // NOLINT(readability-identifier-naming)
    return _cls;
}

void Object::_setFinalizeCallback(V8FinalizeFunc finalizeCb) { // NOLINT(readability-identifier-naming)
    assert(finalizeCb != nullptr);
    _finalizeCb = finalizeCb;
}

void Object::root() {
    if (_rootCount == 0) {
        _obj.ref();
    }
    ++_rootCount;
}

void Object::unroot() {
    if (_rootCount > 0) {
        --_rootCount;
        if (_rootCount == 0) {
            _obj.unref();
        }
    }
}

bool Object::isRooted() const {
    return _rootCount > 0;
}

bool Object::strictEquals(Object *o) const {
    auto *a = const_cast<Object *>(this);
    return a->_obj.handle(__isolate) == o->_obj.handle(__isolate);
}

bool Object::attachObject(Object *obj) {
    assert(obj);

    Object *global = ScriptEngine::getInstance()->getGlobalObject();
    Value   jsbVal;
    if (!global->getProperty("jsb", &jsbVal)) {
        return false;
    }
    Object *jsbObj = jsbVal.toObject();

    Value func;

    if (!jsbObj->getProperty("registerNativeRef", &func)) {
        return false;
    }

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
    if (!global->getProperty("jsb", &jsbVal)) {
        return false;
    }
    Object *jsbObj = jsbVal.toObject();

    Value func;

    if (!jsbObj->getProperty("unregisterNativeRef", &func)) {
        return false;
    }

    ValueArray args;
    args.push_back(Value(this));
    args.push_back(Value(obj));
    func.toObject()->call(args, global);
    return true;
}

std::string Object::toString() const {
    std::string ret;
    if (isFunction() || isArray() || isTypedArray()) {
        v8::String::Utf8Value utf8(__isolate, const_cast<Object *>(this)->_obj.handle(__isolate));
        ret = *utf8;
    } else if (isArrayBuffer()) {
        ret = "[object ArrayBuffer]";
    } else {
        ret = "[object Object]";
    }
    return ret;
}

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8
