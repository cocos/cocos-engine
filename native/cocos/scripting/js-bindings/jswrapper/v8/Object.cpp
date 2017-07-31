#include "Object.hpp"

#ifdef SCRIPT_ENGINE_V8
#include "Utils.hpp"
#include "Class.hpp"
#include "ScriptEngine.hpp"

namespace se {

    std::unordered_map<void* /*native*/, Object* /*jsobj*/> __nativePtrToObjectMap;
    std::unordered_map<Object*, void*> __objectMap; // Currently, the value `void*` is always nullptr
    
    namespace {
        v8::Isolate* __isolate = nullptr;
    }

    Object::Object()
    : _cls(nullptr)
    , _isRooted(false)
    , _isKeepRootedUntilDie(false)
    , _hasPrivateData(false)
    , _finalizeCb(nullptr)
    , _internalData(nullptr)
    {
    }

    Object::~Object()
    {
        if (_isRooted)
        {
            _obj.unref();
        }

        auto iter = __objectMap.find(this);
        if (iter != __objectMap.end())
        {
            __objectMap.erase(iter);
        }
    }

    /*static*/
    void Object::nativeObjectFinalizeHook(void* nativeObj)
    {
        if (nativeObj == nullptr)
            return;

        auto iter = __nativePtrToObjectMap.find(nativeObj);
        if (iter != __nativePtrToObjectMap.end())
        {
            Object* obj = iter->second;
            if (obj->_finalizeCb != nullptr)
            {
                obj->_finalizeCb(nativeObj);
            }
            else
            {
                assert(obj->_getClass() != nullptr);
                if (obj->_getClass()->_finalizeFunc != nullptr)
                    obj->_getClass()->_finalizeFunc(nativeObj);
            }
            obj->release();
            __nativePtrToObjectMap.erase(iter);
        }
        else
        {
//            assert(false);
        }
    }

    /* static */
    void Object::setIsolate(v8::Isolate* isolate)
    {
        __isolate = isolate;
    }

    /* static */
    void Object::cleanup()
    {
        void* nativeObj = nullptr;
        Object* obj = nullptr;
        Class* cls = nullptr;

        for (const auto& e : __nativePtrToObjectMap)
        {
            nativeObj = e.first;
            obj = e.second;

            if (obj->_finalizeCb != nullptr)
            {
                obj->_finalizeCb(nativeObj);
            }
            else
            {
                if (obj->_getClass() != nullptr)
                {
                    if (obj->_getClass()->_finalizeFunc != nullptr)
                    {
                        obj->_getClass()->_finalizeFunc(nativeObj);
                    }
                }
            }
            // internal data should only be freed in Object::cleanup, since in other case, it is freed in ScriptEngine::privateDataFinalize
            if (obj->_internalData != nullptr)
            {
                free(obj->_internalData);
                obj->_internalData = nullptr;
            }
            obj->release();
        }

        __nativePtrToObjectMap.clear();

        std::vector<Object*> toReleaseObjects;
        for (const auto& e : __objectMap)
        {
            obj = e.first;
            cls = obj->_getClass();
            obj->_obj.persistent().Reset();
            obj->_isRooted = false;

            if (cls != nullptr && cls->_name == "__CCPrivateData")
            {
                toReleaseObjects.push_back(obj);
            }
        }

        for (auto e : toReleaseObjects)
        {
            e->release();
        }

        __objectMap.clear();
        __isolate = nullptr;
    }

    Object* Object::createPlainObject(bool rooted)
    {
        v8::Local<v8::Object> jsobj = v8::Object::New(__isolate);
        Object* obj = _createJSObject(nullptr, jsobj, rooted);
        return obj;
    }

//    Object* Object::createObject(const char* clsName, bool rooted)
//    {
//        Class* cls = nullptr;
//        auto jsobj = Class::_createJSObject(clsName, &cls);
//        Object* obj = _createJSObject(cls, jsobj, rooted);
//
//        return obj;
//    }

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

    Object* Object::_createJSObject(Class* cls, v8::Local<v8::Object> obj, bool rooted)
    {
        Object* ret = new Object();
        if (!ret->init(cls, obj, rooted))
        {
            delete ret;
            ret = nullptr;
        }
        return ret;
    }

    Object* Object::createObjectWithClass(Class* cls, bool rooted)
    {
        v8::Local<v8::Object> jsobj = Class::_createJSObjectWithClass(cls);
        Object* obj = Object::_createJSObject(cls, jsobj, rooted);
        return obj;
    }

    Object* Object::createArrayObject(size_t length, bool rooted)
    {
        v8::Local<v8::Array> jsobj = v8::Array::New(__isolate, (int)length);
        Object* obj = Object::_createJSObject(nullptr, jsobj, rooted);
        return obj;
    }

    Object* Object::createArrayBufferObject(void* data, size_t byteLength, bool rooted)
    {
        v8::Local<v8::ArrayBuffer> jsobj = v8::ArrayBuffer::New(__isolate, byteLength);
        memcpy(jsobj->GetContents().Data(), data, byteLength);
        Object* obj = Object::_createJSObject(nullptr, jsobj, rooted);
        return obj;
    }
    
    Object* Object::createUint8TypedArray(uint8_t* data, size_t byteLength, bool rooted)
    {
        v8::Local<v8::ArrayBuffer> jsobj = v8::ArrayBuffer::New(__isolate, byteLength);
        memcpy(jsobj->GetContents().Data(), data, byteLength);
        v8::Local<v8::Uint8Array> arr = v8::Uint8Array::New(jsobj, 0, byteLength);
        Object* obj = Object::_createJSObject(nullptr, arr, rooted);
        return obj;
    }

    Object* Object::createJSONObject(const std::string& jsonStr, bool rooted)
    {
        v8::Local<v8::Context> context = __isolate->GetCurrentContext();
        Value strVal(jsonStr);
        v8::Local<v8::Value> jsStr;
        internal::seToJsValue(__isolate, strVal, &jsStr);
        v8::Local<v8::String> v8Str = v8::Local<v8::String>::Cast(jsStr);
        v8::MaybeLocal<v8::Value> ret = v8::JSON::Parse(context, v8Str);
        if (ret.IsEmpty())
            return nullptr;

        v8::Local<v8::Object> jsobj = v8::Local<v8::Object>::Cast(ret.ToLocalChecked());
        return Object::_createJSObject(nullptr, jsobj, rooted);
    }

    bool Object::init(Class* cls, v8::Local<v8::Object> obj, bool rooted)
    {
        _cls = cls;
        _isRooted = rooted;
        _obj.init(obj);
        _obj.setFinalizeCallback(nativeObjectFinalizeHook);

        if (_isRooted)
        {
            _obj.ref();
        }

        assert(__objectMap.find(this) == __objectMap.end());
        __objectMap.emplace(this, nullptr);

        return true;
    }

    bool Object::getProperty(const char *name, Value *data)
    {
        assert(data != nullptr);

        v8::HandleScope handle_scope(__isolate);

        if (_obj.persistent().IsEmpty())
        {
            return false;
        }

        v8::MaybeLocal<v8::String> nameValue = v8::String::NewFromUtf8(__isolate, name, v8::NewStringType::kNormal);
        if (nameValue.IsEmpty())
            return false;

        v8::Local<v8::String> nameValToLocal = nameValue.ToLocalChecked();
        v8::Local<v8::Context> context = __isolate->GetCurrentContext();
        v8::Maybe<bool> maybeExist = _obj.handle(__isolate)->Has(context, nameValToLocal);
        if (maybeExist.IsNothing())
            return false;

        if (!maybeExist.FromJust())
            return false;

        v8::MaybeLocal<v8::Value> result = _obj.handle(__isolate)->Get(context, nameValToLocal);
        if (result.IsEmpty())
            return false;

        internal::jsToSeValue(__isolate, result.ToLocalChecked(), data);

        return true;
    }

    void Object::setProperty(const char *name, const Value& data)
    {
        v8::MaybeLocal<v8::String> nameValue = v8::String::NewFromUtf8(__isolate, name, v8::NewStringType::kNormal);
        if (nameValue.IsEmpty())
            return;

        v8::Local<v8::Value> value;
        internal::seToJsValue(__isolate, data, &value);
        v8::Maybe<bool> ret = _obj.handle(__isolate)->Set(__isolate->GetCurrentContext(), nameValue.ToLocalChecked(), value);
        if (ret.IsNothing())
        {
            LOGD("ERROR: %s, Set return nothing ...\n", __FUNCTION__);
        }
    }

    bool Object::defineProperty(const char *name, v8::AccessorNameGetterCallback getter, v8::AccessorNameSetterCallback setter)
    {
        v8::MaybeLocal<v8::String> nameValue = v8::String::NewFromUtf8(__isolate, name, v8::NewStringType::kNormal);
        if (nameValue.IsEmpty())
            return false;

        v8::Local<v8::String> nameValChecked = nameValue.ToLocalChecked();
        v8::Local<v8::Name> jsName = v8::Local<v8::Name>::Cast(nameValChecked);
        v8::Maybe<bool> ret = _obj.handle(__isolate)->SetAccessor(__isolate->GetCurrentContext(), jsName, getter, setter);
        return ret.IsJust() && ret.FromJust();
    }

    bool Object::isFunction() const
    {
        return const_cast<Object*>(this)->_obj.handle(__isolate)->IsCallable();
    }

    bool Object::_isNativeFunction() const
    {
        if (isFunction())
        {
            v8::String::Utf8Value utf8(const_cast<Object*>(this)->_obj.handle(__isolate));
            std::string info = *utf8;
            if (info.find("[native code]") != std::string::npos)
            {
                return true;
            }
        }
        return false;
    }

    bool Object::isTypedArray() const
    {
        return const_cast<Object*>(this)->_obj.handle(__isolate)->IsTypedArray();
    }

    bool Object::getTypedArrayData(uint8_t** ptr, size_t* length) const
    {
        assert(isTypedArray());
        v8::Local<v8::Object> obj = const_cast<Object*>(this)->_obj.handle(__isolate);
        v8::Local<v8::Uint8Array> arr = v8::Local<v8::Uint8Array>::Cast(obj);
        v8::ArrayBuffer::Contents content = arr->Buffer()->GetContents();
        *ptr = (uint8_t*)content.Data();
        *length = content.ByteLength();
        return true;
    }

    bool Object::isArrayBuffer() const
    {
        v8::Local<v8::Object> obj = const_cast<Object*>(this)->_obj.handle(__isolate);
        return obj->IsArrayBuffer();
    }

    bool Object::getArrayBufferData(uint8_t** ptr, size_t* length) const
    {
        assert(isArrayBuffer());
        v8::Local<v8::Object> obj = const_cast<Object*>(this)->_obj.handle(__isolate);
        v8::Local<v8::ArrayBuffer> arrBuf = v8::Local<v8::ArrayBuffer>::Cast(obj);
        v8::ArrayBuffer::Contents content = arrBuf->GetContents();
        *ptr = (uint8_t*)content.Data();
        *length = content.ByteLength();
        return true;
    }

    void Object::setPrivateData(void* data)
    {
        assert(!_hasPrivateData);
        assert(__nativePtrToObjectMap.find(data) == __nativePtrToObjectMap.end());
        internal::setPrivate(__isolate, _obj, data, &_internalData);
        __nativePtrToObjectMap.emplace(data, this);
        _hasPrivateData = true;
    }

    void* Object::getPrivateData() const
    {
        return internal::getPrivate(__isolate, const_cast<Object*>(this)->_obj.handle(__isolate));
    }

    void Object::clearPrivateData()
    {
        if (_hasPrivateData)
        {
            void* data = getPrivateData();
            __nativePtrToObjectMap.erase(data);
            internal::clearPrivate(__isolate, _obj);
            _hasPrivateData = false;
        }
    }

    v8::Local<v8::Object> Object::_getJSObject() const
    {
        return const_cast<Object*>(this)->_obj.handle(__isolate);
    }

    ObjectWrap& Object::_getWrap()
    {
        return _obj;
    }

    bool Object::call(const ValueArray& args, Object* thisObject, Value* rval/* = nullptr*/)
    {
        if (_obj.persistent().IsEmpty())
        {
            LOGD("Function object is released!\n");
            return false;
        }
        size_t argc = 0;
        std::vector<v8::Local<v8::Value>> argv;
        argc = args.size();
        internal::seToJsArgs(__isolate, args, &argv);

        v8::Local<v8::Object> thiz = v8::Local<v8::Object>::Cast(v8::Undefined(__isolate));
        if (thisObject != nullptr)
        {
            if (thisObject->_obj.persistent().IsEmpty())
            {
                LOGD("This object is released!\n");
                return false;
            }
            thiz = thisObject->_obj.handle(__isolate);
        }

        for (size_t i = 0; i < argc; ++i)
        {
            if (argv[i].IsEmpty())
            {
                LOGD("%s argv[%d] is released!\n", __FUNCTION__, (int)i);
                return false;
            }
        }

        v8::Local<v8::Context> context = se::ScriptEngine::getInstance()->_getContext();
        v8::MaybeLocal<v8::Value> result = _obj.handle(__isolate)->CallAsFunction(context, thiz, (int)argc, argv.data());

        if (!result.IsEmpty())
        {
            if (rval != nullptr)
            {
                internal::jsToSeValue(__isolate, result.ToLocalChecked(), rval);
            }
            return true;
        }
        else
        {
            SE_REPORT_ERROR("Invoking function (%p) failed!", this);
            se::ScriptEngine::getInstance()->clearException();
        }

//        assert(false);

        return false;
    }

    bool Object::defineFunction(const char *funcName, void (*func)(const v8::FunctionCallbackInfo<v8::Value> &args))
    {
        v8::MaybeLocal<v8::String> maybeFuncName = v8::String::NewFromUtf8(__isolate, funcName, v8::NewStringType::kNormal);
        if (maybeFuncName.IsEmpty())
            return false;

        v8::Local<v8::Context> context = __isolate->GetCurrentContext();
        v8::MaybeLocal<v8::Function> maybeFunc = v8::FunctionTemplate::New(__isolate, func)->GetFunction(context);
        if (maybeFunc.IsEmpty())
            return false;

        v8::Maybe<bool> ret = _obj.handle(__isolate)->Set(context,
                                    v8::Local<v8::Name>::Cast(maybeFuncName.ToLocalChecked()),
                                    maybeFunc.ToLocalChecked());

        return ret.IsJust() && ret.FromJust();
    }

    bool Object::isArray() const
    {
        return const_cast<Object*>(this)->_obj.handle(__isolate)->IsArray();
    }

    bool Object::getArrayLength(uint32_t* length) const
    {
        assert(isArray());
        assert(length != nullptr);
        Object* thiz = const_cast<Object*>(this);

        v8::MaybeLocal<v8::String> lengthStr = v8::String::NewFromUtf8(__isolate, "length", v8::NewStringType::kNormal);
        if (lengthStr.IsEmpty())
        {
            *length = 0;
            return false;
        }
        v8::Local<v8::Context> context = __isolate->GetCurrentContext();

        v8::MaybeLocal<v8::Value> val = thiz->_obj.handle(__isolate)->Get(context, lengthStr.ToLocalChecked());
        if (val.IsEmpty())
            return false;

        v8::MaybeLocal<v8::Object> obj = val.ToLocalChecked()->ToObject(context);
        if (obj.IsEmpty())
            return false;

        v8::Maybe<uint32_t> mbLen= obj.ToLocalChecked()->Uint32Value(context);
        if (mbLen.IsNothing())
            return false;

        *length = mbLen.FromJust();
        return true;
    }

    bool Object::getArrayElement(uint32_t index, Value* data) const
    {
        assert(isArray());
        assert(data != nullptr);
        Object* thiz = const_cast<Object*>(this);
        v8::MaybeLocal<v8::Value> result = thiz->_obj.handle(__isolate)->Get(__isolate->GetCurrentContext(), index);

        if (result.IsEmpty())
            return false;

        internal::jsToSeValue(__isolate, result.ToLocalChecked(), data);
        return true;
    }

    bool Object::setArrayElement(uint32_t index, const Value& data)
    {
        assert(isArray());

        v8::Local<v8::Value> jsval;
        internal::seToJsValue(__isolate, data, &jsval);
        v8::Maybe<bool> ret = _obj.handle(__isolate)->Set(__isolate->GetCurrentContext(), index, jsval);

        return ret.IsJust() && ret.FromJust();
    }

//    void Object::getAsFloat32Array(float **ptr, unsigned int *length) {
//        float *pt;
//        unsigned int len;
//
//        v8::Local<v8::Value> value = _obj.handle(__isolate);
//
//        v8::Local<v8::Float32Array> myarr = _obj.handle(__isolate).As<v8::Float32Array>();
//        len = myarr->Length();
//        pt = (float *) ((char *) myarr->Buffer()->GetContents().Data() + myarr->ByteOffset());
//
//        *length = len;
//        *ptr = pt;
//    }
//
//    void Object::getAsUint8Array(unsigned char **ptr, unsigned int *length) {
//        unsigned char *pt;
//        unsigned int len;
//
//        v8::Local<v8::Value> value = _obj.handle(__isolate);
//
//        v8::Local<v8::Uint8Array> myarr = _obj.handle(__isolate).As<v8::Uint8Array>();
//
//        len = myarr->Length();
//        pt = (unsigned char *) myarr->Buffer()->GetContents().Data() + myarr->ByteOffset();
//
//        *length = len;
//        *ptr = pt;
//    }
//
//    void Object::getAsUint16Array(unsigned short **ptr, unsigned int *length) {
//        unsigned short *pt;
//        unsigned int len;
//
//        v8::Local<v8::Value> value = _obj.handle(__isolate);
//
//        v8::Local<v8::Uint16Array> myarr = _obj.handle(__isolate).As<v8::Uint16Array>();
//
//        len = myarr->Length();
//        pt = (unsigned short *) myarr->Buffer()->GetContents().Data();
//
//        *length = len;
//        *ptr = pt;
//    }
//
//    void Object::getAsUint32Array(unsigned int **ptr, unsigned int *length) {
//        unsigned int *pt;
//        unsigned int len;
//
//        v8::Local<v8::Value> value = _obj.handle(__isolate);
//
//        v8::Local<v8::Uint32Array> myarr = _obj.handle(__isolate).As<v8::Uint32Array>();
//
//        len = myarr->Length();
//
//        //ArrayBuffer::Contents float_c=pt=myarr->Buffer()->GetContents();
//        pt = (unsigned int *) myarr->Buffer()->GetContents().Data();
//
//        *length = len;
//        *ptr = pt;
//    }

    bool Object::getAllKeys(std::vector<std::string>* allKeys) const
    {
        assert(allKeys != nullptr);
        Object* thiz = const_cast<Object*>(this);
        v8::Local<v8::Context> context = __isolate->GetCurrentContext();
        v8::MaybeLocal<v8::Array> keys = thiz->_obj.handle(__isolate)->GetOwnPropertyNames(context);
        if (keys.IsEmpty())
            return false;

        v8::Local<v8::Array> keysChecked = keys.ToLocalChecked();
        Value keyVal;
        for (uint32_t i = 0, len = keysChecked->Length(); i < len; ++i)
        {
            v8::MaybeLocal<v8::Value> key = keysChecked->Get(context, i);
            if (key.IsEmpty())
            {
                allKeys->clear();
                return false;
            }
            internal::jsToSeValue(__isolate, key.ToLocalChecked(), &keyVal);
            if (keyVal.isString())
            {
                allKeys->push_back(keyVal.toString());
            }
            else if (keyVal.isNumber())
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

    Class* Object::_getClass() const
    {
        return _cls;
    }

    void Object::_setFinalizeCallback(V8FinalizeFunc finalizeCb)
    {
        assert(finalizeCb != nullptr);
        _finalizeCb = finalizeCb;
    }

    void Object::root()
    {
        if (_isRooted)
            return;

        _obj.ref();
        _isRooted = true;
    }

    void Object::unroot()
    {
        if (!_isRooted)
            return;

        if (_isKeepRootedUntilDie)
            return;

        _obj.unref();
        _isRooted = false;
    }

    void Object::setKeepRootedUntilDie(bool keepRooted)
    {
        _isKeepRootedUntilDie = keepRooted;

        if (_isKeepRootedUntilDie)
        {
            if (!_isRooted)
                root();
        }
    }

    bool Object::isRooted() const
    {
        return _isRooted;
    }

    bool Object::isSame(Object *o) const
    {
        Object* a = const_cast<Object*>(this);
        return a->_obj.handle(__isolate) == o->_obj.handle(__isolate);
    }

    bool Object::attachChild(Object *child)
    {
        assert(child);

        Object* global = ScriptEngine::getInstance()->getGlobalObject();
        Value jsbVal;
        if (!global->getProperty("jsb", &jsbVal))
            return false;
        Object* jsbObj = jsbVal.toObject();

        Value func;

        if (!jsbObj->getProperty("registerNativeRef", &func))
            return false;

        ValueArray args;
        args.push_back(Value(this));
        args.push_back(Value(child));
        func.toObject()->call(args, global);
        return true;
    }

    bool Object::detachChild(Object *child)
    {
        assert(child);

        Object* global = ScriptEngine::getInstance()->getGlobalObject();
        Value jsbVal;
        if (!global->getProperty("jsb", &jsbVal))
            return false;
        Object* jsbObj = jsbVal.toObject();

        Value func;

        if (!jsbObj->getProperty("unregisterNativeRef", &func))
            return false;

        ValueArray args;
        args.push_back(Value(this));
        args.push_back(Value(child));
        func.toObject()->call(args, global);
        return true;
    }


} // namespace se {

#endif // SCRIPT_ENGINE_V8
