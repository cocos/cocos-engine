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
#include "v8/HelperMacros.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8
    #include "../MappingUtils.h"
    #include "Class.h"
    #include "ScriptEngine.h"
    #include "Utils.h"
    #include "base/std/container/unordered_map.h"

    #include <memory>
    #include <sstream>
    #include "base/std/container/array.h"

    #define JSB_FUNC_DEFAULT_MAX_ARG_COUNT (10)

namespace se {
//NOLINTNEXTLINE
std::unique_ptr<ccstd::unordered_map<Object *, void *>> __objectMap; // Currently, the value `void*` is always nullptr

namespace {
v8::Isolate *__isolate = nullptr; //NOLINT
    #if CC_DEBUG_JS_OBJECT_ID && CC_DEBUG
uint32_t nativeObjectId = 0;
    #endif
} // namespace

class JSBPersistentHandleVisitor : public v8::PersistentHandleVisitor {
public:
    JSBPersistentHandleVisitor() = default;

    void VisitPersistentHandle(v8::Persistent<v8::Value> *value, uint16_t classId) override {
        if (value == nullptr || classId != ObjectWrap::MAGIC_CLASS_ID_JSB) {
            return;
        }

        auto &persistObj = v8::Persistent<v8::Object>::Cast(*value);
        const int fieldCount = v8::Object::InternalFieldCount(persistObj);
        if (fieldCount != 1) {
            return;
        }

        void *ptr = v8::Object::GetAlignedPointerFromInternalField(persistObj, 0);
        if (ptr == nullptr) {
            return;
        }

        auto *obj = reinterpret_cast<Object *>(ptr);
        auto *nativeObj = obj->getPrivateData();
        if (nativeObj == nullptr) {
            // Not a JSB binding object
            return;
        }

        // Remove mapping
        auto iter = se::NativePtrToObjectMap::find(nativeObj);
        if (iter != se::NativePtrToObjectMap::end()) {
            se::NativePtrToObjectMap::erase(iter);
        }

        // Invoke finalize callback
        if (obj->_finalizeCb != nullptr) {
            obj->_finalizeCb(obj);
        } else {
            if (obj->_getClass() != nullptr) {
                if (obj->_getClass()->_finalizeFunc != nullptr) {
                    obj->_getClass()->_finalizeFunc(obj);
                }
            }
        }

        if (obj->getRefCount() != 1) {
            CC_LOG_WARNING("se::Object (%p) reference count (%u) is not 1", obj, obj->getRefCount());
        }
        obj->decRef();
    }
};

Object::Object() { //NOLINT
    #if JSB_TRACK_OBJECT_CREATION
    _objectCreationStackFrame = se::ScriptEngine::getInstance()->getCurrentStackTrace();
    #endif
}

Object::~Object() {
    if (_rootCount > 0) {
        _obj.unref();
    }

    if (__objectMap) {
        __objectMap->erase(this);
    }
    delete _privateObject;
    _privateObject = nullptr;
}

/* static */
void Object::nativeObjectFinalizeHook(Object *seObj) {
    if (seObj == nullptr) {
        return;
    }

    if (seObj->_clearMappingInFinalizer && seObj->_privateData != nullptr) {
        void *nativeObj = seObj->_privateData;
        auto iter = NativePtrToObjectMap::find(nativeObj);
        if (iter != NativePtrToObjectMap::end()) {
            NativePtrToObjectMap::erase(iter);
        }
    }

    if (seObj->_finalizeCb != nullptr) {
        seObj->_finalizeCb(seObj);
    } else {
        if (seObj->_getClass() != nullptr && seObj->_getClass()->_finalizeFunc != nullptr) {
            seObj->_getClass()->_finalizeFunc(seObj);
        }
    }

    seObj->decRef();
}

/* static */
void Object::setIsolate(v8::Isolate *isolate) {
    __isolate = isolate;
}

void Object::setup() {
    __objectMap = std::make_unique<ccstd::unordered_map<Object *, void *>>();
}

void Object::cleanup() {
    JSBPersistentHandleVisitor jsbVisitor;
    __isolate->VisitHandlesWithClassIds(&jsbVisitor);
    SE_ASSERT(NativePtrToObjectMap::size() == 0, "NativePtrToObjectMap should be empty!");

    if (__objectMap) {
        for (const auto &e : *__objectMap) {
            auto *obj = e.first;
            obj->_obj.persistent().Reset();
            // NOTE: Set _rootCount to 0 to avoid invoking _obj.unref in Object's destructor which may cause crash.
            obj->_rootCount = 0;
        }
    }

    __objectMap.reset();
    __isolate = nullptr;
}

Object *Object::createPlainObject() {
    v8::Local<v8::Object> jsobj = v8::Object::New(__isolate);
    Object *obj = _createJSObject(nullptr, jsobj);
    return obj;
}

Object *Object::getObjectWithPtr(void *ptr) {
    Object *obj = nullptr;
    auto iter = NativePtrToObjectMap::find(ptr);
    if (iter != NativePtrToObjectMap::end()) {
        obj = iter->second;
        obj->incRef();
    }
    return obj;
}

Object *Object::_createJSObject(Class *cls, v8::Local<v8::Object> obj) { // NOLINT(readability-identifier-naming)
    auto *ret = ccnew Object();
    if (!ret->init(cls, obj)) {
        delete ret;
        ret = nullptr;
    }
    return ret;
}

Object *Object::createObjectWithClass(Class *cls) {
    v8::Local<v8::Object> jsobj = Class::_createJSObjectWithClass(cls);
    Object *obj = Object::_createJSObject(cls, jsobj);
    return obj;
}

Object *Object::createArrayObject(size_t length) {
    v8::Local<v8::Array> jsobj = v8::Array::New(__isolate, static_cast<int>(length));
    Object *obj = Object::_createJSObject(nullptr, jsobj);
    return obj;
}

Object *Object::createArrayBufferObject(const void *data, size_t byteLength) {
    v8::Local<v8::ArrayBuffer> jsobj = v8::ArrayBuffer::New(__isolate, byteLength);
    if (data) {
        memcpy(jsobj->GetBackingStore()->Data(), data, byteLength);
    } else {
        memset(jsobj->GetBackingStore()->Data(), 0, byteLength);
    }
    Object *obj = Object::_createJSObject(nullptr, jsobj);
    return obj;
}

/* static */
Object *Object::createExternalArrayBufferObject(void *contents, size_t byteLength, BufferContentsFreeFunc freeFunc, void *freeUserData /* = nullptr*/) {
    std::shared_ptr<v8::BackingStore> backingStore = v8::ArrayBuffer::NewBackingStore(contents, byteLength, freeFunc, freeUserData);
    Object *obj = nullptr;
    v8::Local<v8::ArrayBuffer> jsobj = v8::ArrayBuffer::New(__isolate, backingStore);
    if (!jsobj.IsEmpty()) {
        obj = Object::_createJSObject(nullptr, jsobj);
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
            CC_ASSERT(false); // Should never go here.
            break;
    }

    Object *obj = Object::_createJSObject(nullptr, arr);
    return obj;
}

Object *Object::createTypedArrayWithBuffer(TypedArrayType type, const Object *obj) {
    return Object::createTypedArrayWithBuffer(type, obj, 0);
}

Object *Object::createTypedArrayWithBuffer(TypedArrayType type, const Object *obj, size_t offset) {
    size_t byteLength{0};
    uint8_t *skip{nullptr};
    obj->getTypedArrayData(&skip, &byteLength);
    return Object::createTypedArrayWithBuffer(type, obj, offset, byteLength - offset);
}

Object *Object::createTypedArrayWithBuffer(TypedArrayType type, const Object *obj, size_t offset, size_t byteLength) {
    if (type == TypedArrayType::NONE) {
        SE_LOGE("Don't pass se::Object::TypedArrayType::NONE to createTypedArray API!");
        return nullptr;
    }

    if (type == TypedArrayType::UINT8_CLAMPED) {
        SE_LOGE("Doesn't support to create Uint8ClampedArray with Object::createTypedArray API!");
        return nullptr;
    }

    v8::Local<v8::Object> typedArray;
    CC_ASSERT(obj->isArrayBuffer());
    v8::Local<v8::ArrayBuffer> jsobj = obj->_getJSObject().As<v8::ArrayBuffer>();
    switch (type) {
        case TypedArrayType::INT8:
            typedArray = v8::Int8Array::New(jsobj, offset, byteLength);
            break;
        case TypedArrayType::INT16:
            typedArray = v8::Int16Array::New(jsobj, offset, byteLength / 2);
            break;
        case TypedArrayType::INT32:
            typedArray = v8::Int32Array::New(jsobj, offset, byteLength / 4);
            break;
        case TypedArrayType::UINT8:
            typedArray = v8::Uint8Array::New(jsobj, offset, byteLength);
            break;
        case TypedArrayType::UINT16:
            typedArray = v8::Uint16Array::New(jsobj, offset, byteLength / 2);
            break;
        case TypedArrayType::UINT32:
            typedArray = v8::Uint32Array::New(jsobj, offset, byteLength / 4);
            break;
        case TypedArrayType::FLOAT32:
            typedArray = v8::Float32Array::New(jsobj, offset, byteLength / 4);
            break;
        case TypedArrayType::FLOAT64:
            typedArray = v8::Float64Array::New(jsobj, offset, byteLength / 8);
            break;
        default:
            CC_ASSERT(false); // Should never go here.
            break;
    }

    return Object::_createJSObject(nullptr, typedArray);
}

Object *Object::createUint8TypedArray(uint8_t *bytes, size_t byteLength) {
    return createTypedArray(TypedArrayType::UINT8, bytes, byteLength);
}

Object *Object::createJSONObject(const ccstd::string &jsonStr) {
    v8::Local<v8::Context> context = __isolate->GetCurrentContext();
    Value strVal(jsonStr);
    v8::Local<v8::Value> jsStr;
    internal::seToJsValue(__isolate, strVal, &jsStr);
    v8::Local<v8::String> v8Str = v8::Local<v8::String>::Cast(jsStr);
    v8::MaybeLocal<v8::Value> ret = v8::JSON::Parse(context, v8Str);
    if (ret.IsEmpty()) {
        return nullptr;
    }

    v8::Local<v8::Object> jsobj = v8::Local<v8::Object>::Cast(ret.ToLocalChecked());
    return Object::_createJSObject(nullptr, jsobj);
}

bool Object::init(Class *cls, v8::Local<v8::Object> obj) {
    _cls = cls;

    _obj.init(obj, this, _cls != nullptr);
    _obj.setFinalizeCallback(nativeObjectFinalizeHook);

    if (__objectMap) {
        CC_ASSERT(__objectMap->find(this) == __objectMap->end());
        __objectMap->emplace(this, nullptr);
    }

    #if CC_DEBUG && CC_DEBUG_JS_OBJECT_ID
    //    this->_objectId = ++nativeObjectId;
    //    defineOwnProperty("__object_id__", se::Value(this->_objectId), false, false, false);
    //    defineOwnProperty("__native_class_name__", se::Value(cls ? cls->getName() : "[noname]"), false, false, false);
    #endif

    return true;
}

bool Object::getProperty(const char *name, Value *data, bool cachePropertyName) {
    CC_ASSERT(data != nullptr);
    data->setUndefined();

    v8::HandleScope handleScope(__isolate);

    if (_obj.persistent().IsEmpty()) {
        return false;
    }

    v8::MaybeLocal<v8::String> nameValue;

    if (cachePropertyName) {
        nameValue = ScriptEngine::getInstance()->_getStringPool().get(__isolate, name);
    } else {
        nameValue = v8::String::NewFromUtf8(__isolate, name, v8::NewStringType::kNormal);
    }

    if (nameValue.IsEmpty()) {
        return false;
    }

    v8::Local<v8::String> nameValToLocal = nameValue.ToLocalChecked();
    v8::Local<v8::Context> context = __isolate->GetCurrentContext();
    v8::Local<v8::Object> localObj = _obj.handle(__isolate);
    v8::Maybe<bool> maybeExist = localObj->Has(context, nameValToLocal);
    if (maybeExist.IsNothing()) {
        return false;
    }

    if (!maybeExist.FromJust()) {
        return false;
    }

    v8::MaybeLocal<v8::Value> result = localObj->Get(context, nameValToLocal);
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

    v8::Local<v8::String> nameValToLocal = nameValue.ToLocalChecked();
    v8::Local<v8::Context> context = __isolate->GetCurrentContext();
    v8::Maybe<bool> maybeExist = _obj.handle(__isolate)->Delete(context, nameValToLocal);
    if (maybeExist.IsNothing()) {
        return false;
    }

    if (!maybeExist.FromJust()) {
        return false;
    }

    return true;
}

bool Object::setProperty(const char *name, const Value &data) {
    v8::MaybeLocal<v8::String> nameValue = ScriptEngine::getInstance()->_getStringPool().get(__isolate, name);
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
    v8::Local<v8::Name> jsName = v8::Local<v8::Name>::Cast(nameValChecked);
    v8::Maybe<bool> ret = _obj.handle(__isolate)->SetAccessor(__isolate->GetCurrentContext(), jsName, getter, setter);
    return ret.IsJust() && ret.FromJust();
}

bool Object::defineOwnProperty(const char *name, const se::Value &value, bool writable, bool enumerable, bool configurable) {
    v8::MaybeLocal<v8::String> nameValue = v8::String::NewFromUtf8(__isolate, name, v8::NewStringType::kNormal);
    if (nameValue.IsEmpty()) {
        return false;
    }

    int flag{v8::PropertyAttribute::None};
    if (!writable) {
        flag |= v8::PropertyAttribute::ReadOnly;
    }
    if (!enumerable) {
        flag |= v8::PropertyAttribute::DontEnum;
    }
    if (!configurable) {
        flag |= v8::PropertyAttribute::DontDelete;
    }

    v8::Local<v8::Value> v8Value;
    internal::seToJsValue(__isolate, value, &v8Value);

    v8::Local<v8::String> nameValChecked = nameValue.ToLocalChecked();
    v8::Local<v8::Name> jsName = v8::Local<v8::Name>::Cast(nameValChecked);
    v8::Maybe<bool> ret = _obj.handle(__isolate)->DefineOwnProperty(__isolate->GetCurrentContext(), jsName, v8Value, static_cast<v8::PropertyAttribute>(flag));
    return ret.IsJust() && ret.FromJust();
}

bool Object::isFunction() const {
    return const_cast<Object *>(this)->_obj.handle(__isolate)->IsCallable();
}

bool Object::_isNativeFunction() const { // NOLINT(readability-identifier-naming)
    if (isFunction()) {
        ccstd::string info = toString();
        if (info.find("[native code]") != ccstd::string::npos) {
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
    TypedArrayType ret = TypedArrayType::NONE;
    if (value->IsFloat32Array()) {
        ret = TypedArrayType::FLOAT32;
    } else if (value->IsUint32Array()) {
        ret = TypedArrayType::UINT32;
    } else if (value->IsUint16Array()) {
        ret = TypedArrayType::UINT16;
    } else if (value->IsUint8Array()) {
        ret = TypedArrayType::UINT8;
    } else if (value->IsInt32Array()) {
        ret = TypedArrayType::INT32;
    } else if (value->IsInt16Array()) {
        ret = TypedArrayType::INT16;
    } else if (value->IsInt8Array()) {
        ret = TypedArrayType::INT8;
    } else if (value->IsUint8ClampedArray()) {
        ret = TypedArrayType::UINT8_CLAMPED;
    } else if (value->IsFloat64Array()) {
        ret = TypedArrayType::FLOAT64;
    }

    return ret;
}

bool Object::getTypedArrayData(uint8_t **ptr, size_t *length) const {
    CC_ASSERT(isTypedArray());
    v8::Local<v8::Object> obj = const_cast<Object *>(this)->_obj.handle(__isolate);
    v8::Local<v8::TypedArray> arr = v8::Local<v8::TypedArray>::Cast(obj);
    const auto &backingStore = arr->Buffer()->GetBackingStore();
    *ptr = static_cast<uint8_t *>(backingStore->Data()) + arr->ByteOffset();
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
    CC_ASSERT(isArrayBuffer());
    v8::Local<v8::Object> obj = const_cast<Object *>(this)->_obj.handle(__isolate);
    v8::Local<v8::ArrayBuffer> arrBuf = v8::Local<v8::ArrayBuffer>::Cast(obj);
    const auto &backingStore = arrBuf->GetBackingStore();
    *ptr = static_cast<uint8_t *>(backingStore->Data());
    if (length) {
        *length = backingStore->ByteLength();
    }

    return true;
}

void Object::setPrivateObject(PrivateObjectBase *data) {
    CC_ASSERT(_privateObject == nullptr);
    #if CC_DEBUG
    //CC_ASSERT(NativePtrToObjectMap::find(data->getRaw()) == NativePtrToObjectMap::end());
    if (data != nullptr) {
        auto it = NativePtrToObjectMap::find(data->getRaw());
        if (it != NativePtrToObjectMap::end()) {
            auto *pri = it->second->getPrivateObject();
            SE_LOGE("Already exists object %s/[%s], trying to add %s/[%s]\n", pri->getName(), typeid(*pri).name(), data->getName(), typeid(*data).name());
        #if JSB_TRACK_OBJECT_CREATION
            SE_LOGE(" previous object created at %s\n", it->second->_objectCreationStackFrame.c_str());
        #endif
            CC_ASSERT(false);
        }
    }
    #endif
    internal::setPrivate(__isolate, _obj, this);
    _privateObject = data;

    if (data != nullptr) {
        _privateData = data->getRaw();
        NativePtrToObjectMap::emplace(_privateData, this);
    } else {
        _privateData = nullptr;
    }
}

PrivateObjectBase *Object::getPrivateObject() const {
    return _privateObject;
}

void Object::clearPrivateData(bool clearMapping) {
    if (_privateObject != nullptr) {
        if (clearMapping) {
            NativePtrToObjectMap::erase(_privateData);
        }
        internal::clearPrivate(__isolate, _obj);
        delete _privateObject;
        _privateObject = nullptr;
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
    size_t argc = args.size();

    ccstd::array<v8::Local<v8::Value>, JSB_FUNC_DEFAULT_MAX_ARG_COUNT> argv;
    std::unique_ptr<ccstd::vector<v8::Local<v8::Value>>> vecArgs;
    v8::Local<v8::Value> *pArgv = argv.data();

    if (argc > JSB_FUNC_DEFAULT_MAX_ARG_COUNT) {
        vecArgs = std::make_unique<ccstd::vector<v8::Local<v8::Value>>>();
        vecArgs->resize(argc);
        pArgv = vecArgs->data();
    }

    internal::seToJsArgs(__isolate, args, pArgv);

    v8::Local<v8::Object> thiz = v8::Local<v8::Object>::Cast(v8::Undefined(__isolate));
    if (thisObject != nullptr) {
        if (thisObject->_obj.persistent().IsEmpty()) {
            SE_LOGD("This object is released!\n");
            return false;
        }
        thiz = thisObject->_obj.handle(__isolate);
    }

    for (size_t i = 0; i < argc; ++i) {
        if (pArgv[i].IsEmpty()) {
            SE_LOGD("%s argv[%d] is released!\n", __FUNCTION__, (int)i);
            return false;
        }
    }

    v8::Local<v8::Context> context = se::ScriptEngine::getInstance()->_getContext();
    #if CC_DEBUG
    v8::TryCatch tryCatch(__isolate);
    #endif
    v8::MaybeLocal<v8::Value> result = _obj.handle(__isolate)->CallAsFunction(context, thiz, static_cast<int>(argc), pArgv);

    #if CC_DEBUG
    if (tryCatch.HasCaught()) {
        v8::String::Utf8Value stack(__isolate, tryCatch.StackTrace(__isolate->GetCurrentContext()).ToLocalChecked());
        SE_REPORT_ERROR("Invoking function failed, %s", *stack);
    }
    #endif

    if (!result.IsEmpty()) {
        if (rval != nullptr) {
            internal::jsToSeValue(__isolate, result.ToLocalChecked(), rval);
        }
        return true;
    }
    SE_REPORT_ERROR("Invoking function (%p) failed!", this);
    se::ScriptEngine::getInstance()->clearException();

    //        CC_ASSERT(false);

    return false;
}

bool Object::defineFunction(const char *funcName, void (*func)(const v8::FunctionCallbackInfo<v8::Value> &args)) {
    v8::MaybeLocal<v8::String> maybeFuncName = v8::String::NewFromUtf8(__isolate, funcName, v8::NewStringType::kNormal);
    if (maybeFuncName.IsEmpty()) {
        return false;
    }

    v8::Local<v8::Context> context = __isolate->GetCurrentContext();
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
    CC_ASSERT(isArray());
    CC_ASSERT(length != nullptr);
    auto *thiz = const_cast<Object *>(this);

    v8::Local<v8::Array> v8Arr = v8::Local<v8::Array>::Cast(thiz->_obj.handle(__isolate));
    *length = v8Arr->Length();
    return true;
}

bool Object::getArrayElement(uint32_t index, Value *data) const {
    CC_ASSERT(isArray());
    CC_ASSERT(data != nullptr);
    auto *thiz = const_cast<Object *>(this);
    v8::MaybeLocal<v8::Value> result = thiz->_obj.handle(__isolate)->Get(__isolate->GetCurrentContext(), index);

    if (result.IsEmpty()) {
        return false;
    }

    internal::jsToSeValue(__isolate, result.ToLocalChecked(), data);
    return true;
}

bool Object::setArrayElement(uint32_t index, const Value &data) {
    CC_ASSERT(isArray());

    v8::Local<v8::Value> jsval;
    internal::seToJsValue(__isolate, data, &jsval);
    v8::Maybe<bool> ret = _obj.handle(__isolate)->Set(__isolate->GetCurrentContext(), index, jsval);

    return ret.IsJust() && ret.FromJust();
}

bool Object::getAllKeys(ccstd::vector<ccstd::string> *allKeys) const {
    CC_ASSERT(allKeys != nullptr);
    auto *thiz = const_cast<Object *>(this);
    v8::Local<v8::Context> context = __isolate->GetCurrentContext();
    v8::MaybeLocal<v8::Array> keys = thiz->_obj.handle(__isolate)->GetOwnPropertyNames(context);
    if (keys.IsEmpty()) {
        return false;
    }

    v8::Local<v8::Array> keysChecked = keys.ToLocalChecked();
    Value keyVal;
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
    CC_ASSERT(finalizeCb != nullptr);
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
    CC_ASSERT(obj);

    Object *global = ScriptEngine::getInstance()->getGlobalObject();
    Value jsbVal;
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
    CC_ASSERT(obj);

    Object *global = ScriptEngine::getInstance()->getGlobalObject();
    Value jsbVal;
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

ccstd::string Object::toString() const {
    ccstd::string ret;
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

ccstd::string Object::toStringExt() const {
    if (isFunction()) return "[function]";
    if (isArray()) return "[array]";
    if (isArrayBuffer()) return "[arraybuffer]";
    if (isTypedArray()) return "[typedarray]";

    ccstd::vector<ccstd::string> keys;
    getAllKeys(&keys);
    std::stringstream ss;
    ss << "{";
    for (auto &k : keys) {
        ss << k << ", ";
    }
    ss << "}";
    return ss.str();
}

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8
