#include "Class.hpp"

#ifdef SCRIPT_ENGINE_JSC

#include "Object.hpp"
#include "Utils.hpp"
#include "ScriptEngine.hpp"
#include "State.hpp"

namespace se {

#define JS_FN(name, func, attr) {name, func, attr}
#define JS_FS_END JS_FN(0, 0, 0)
#define JS_PSGS(name, getter, setter, attr) {name, getter, setter, attr}
#define JS_PS_END JS_PSGS(0, 0, 0, 0)

    // --- Global Lookup for Constructor Functions

    namespace {
//        std::unordered_map<std::string, Class *> __clsMap;
        JSContextRef __cx = nullptr;

        JSValueRef _getPropertyCallback(JSContextRef context, JSObjectRef object, JSStringRef propertyName, JSValueRef* exception)
        {
            std::string name;
            internal::jsStringToStdString(context, propertyName, &name);
            LOGD("propertyName: %s\n", name.c_str());
            return JSValueMakeUndefined(__cx);
        }

        bool _setPropertyCallback(JSContextRef context, JSObjectRef object, JSStringRef propertyName, JSValueRef value, JSValueRef* exception)
        {
            std::string name;
            internal::jsStringToStdString(context, propertyName, &name);
            LOGD("propertyName: %s\n", name.c_str());
            assert(false);
            return false;
        }

        bool _hasPropertyCallback(JSContextRef context, JSObjectRef object, JSStringRef propertyName)
        {
            std::string name;
            internal::jsStringToStdString(context, propertyName, &name);
            LOGD("propertyName: %s\n", name.c_str());
//            assert(false);
            return true;
        }

        void defaultFinalizeCallback(JSObjectRef _obj)
        {
            void* nativeThisObject = JSObjectGetPrivate(_obj);
            if (nativeThisObject != nullptr)
            {
                State state(nativeThisObject);
                Object* _thisObject = state.thisObject();
                if (_thisObject) _thisObject->_cleanup(nativeThisObject);
                JSObjectSetPrivate(_obj, nullptr);
                SAFE_RELEASE(_thisObject);
            }
        }
    }

    Class::Class()
    : _parent(nullptr)
    , _proto(nullptr)
    , _parentProto(nullptr)
    , _ctor(nullptr)
    , _jsCls(nullptr)
    , _finalizeOp(nullptr)
    {
        _jsClsDef = kJSClassDefinitionEmpty;
    }

    Class::~Class()
    {
        SAFE_RELEASE(_parent);
        SAFE_RELEASE(_proto);
        SAFE_RELEASE(_parentProto);

        JSClassRelease(_jsCls);
    }

    Class* Class::create(const std::string& className, Object* obj, Object* parentProto, JSObjectCallAsConstructorCallback ctor)
    {
        Class* cls = new Class();
        if (cls != nullptr && !cls->init(className, obj, parentProto, ctor))
        {
            delete cls;
            cls = nullptr;
        }
        return cls;
    }

    bool Class::init(const std::string &clsName, Object* parent, Object *parentProto, JSObjectCallAsConstructorCallback ctor)
    {
        _name = clsName;
        _parent = parent;
        SAFE_ADD_REF(_parent);
        _parentProto = parentProto;
        SAFE_ADD_REF(_parentProto);
        _ctor = ctor;
        return true;
    }

    bool Class::install()
    {
//        assert(__clsMap.find(_name) == __clsMap.end());
//
//        __clsMap.emplace(_name, this);

        _jsClsDef.version = 0;
        _jsClsDef.attributes = kJSClassAttributeNone;
        _jsClsDef.className = _name.c_str();
        if (_parentProto != nullptr)
        {
            _jsClsDef.parentClass = _parentProto->_getClass()->_jsCls;
        }

        _funcs.push_back(JS_FS_END);
//        _properties.push_back(JS_PS_END);

//        _jsClsDef.staticValues = _properties.data();
        _jsClsDef.staticFunctions = _funcs.data();

//        _jsClsDef.getProperty = _getPropertyCallback;
//        _jsClsDef.setProperty = _setPropertyCallback;
//        _jsClsDef.hasProperty = _hasPropertyCallback;

        if (_finalizeOp != nullptr)
            _jsClsDef.finalize = _finalizeOp;
        else
            _jsClsDef.finalize = defaultFinalizeCallback;

        _jsCls = JSClassCreate(&_jsClsDef);

        JSObjectRef jsCtor = JSObjectMakeConstructor(__cx, _jsCls, _ctor);
        Object* ctorObj = Object::_createJSObject(this, jsCtor, false);

        for (const auto& staticfunc : _staticFuncs)
        {
            JSStringRef name = JSStringCreateWithUTF8CString(staticfunc.name);
            JSObjectRef func = JSObjectMakeFunctionWithCallback(__cx, nullptr, staticfunc.callAsFunction);
            JSObjectSetProperty(__cx, jsCtor, name, func, kJSPropertyAttributeNone, nullptr);
            JSStringRelease(name);
        }

        JSValueRef prototypeObj = nullptr;
        JSStringRef prototypeName = JSStringCreateWithUTF8CString("prototype");
        bool exist = JSObjectHasProperty(__cx, jsCtor, prototypeName);
        if (exist)
        {
            prototypeObj = JSObjectGetProperty(__cx, jsCtor, prototypeName, nullptr);
        }
        JSStringRelease(prototypeName);
        assert(prototypeObj != nullptr);

        // FIXME: how to release ctor?
        _proto = Object::_createJSObject(this, JSValueToObject(__cx, prototypeObj, nullptr), true); // FIXME: release me in cleanup method

        // reset constructor
        _proto->setProperty("constructor", se::Value(ctorObj));

        // Set instance properties
        for (const auto& property : _properties)
        {
            internal::defineProperty(_proto, property.name, property.getter, property.setter);
        }

        // Set class properties
        for (const auto& property : _staticProperties)
        {
            internal::defineProperty(ctorObj, property.name, property.getter, property.setter);
        }

        _parent->setProperty(_name.c_str(), Value(ctorObj));

        ctorObj->release();

        return true;
    }

    bool Class::defineFunction(const char *name, JSObjectCallAsFunctionCallback func)
    {
        JSStaticFunction cb = JS_FN(name, func, kJSPropertyAttributeNone);
        _funcs.push_back(cb);
        return true;
    }

    bool Class::defineProperty(const char *name, JSObjectCallAsFunctionCallback getter, JSObjectCallAsFunctionCallback setter)
    {
        JSPropertySpec property = JS_PSGS(name, getter, setter, kJSPropertyAttributeNone);
        _properties.push_back(property);
        return true;
    }

    bool Class::defineStaticFunction(const char *name, JSObjectCallAsFunctionCallback func)
    {
        JSStaticFunction cb = JS_FN(name, func, kJSPropertyAttributeNone);
        _staticFuncs.push_back(cb);
        return true;
    }

    bool Class::defineStaticProperty(const char *name, JSObjectCallAsFunctionCallback getter, JSObjectCallAsFunctionCallback setter)
    {
        JSPropertySpec property = JS_PSGS(name, getter, setter, kJSPropertyAttributeNone);
        _staticProperties.push_back(property);
        return true;
    }

    bool Class::defineFinalizedFunction(JSObjectFinalizeCallback func)
    {
        _finalizeOp = func;
        return true;
    }

//    JSObjectRef Class::_createJSObject(const std::string &clsName, Class** outCls)
//    {
//        auto iter = __clsMap.find(clsName);
//        if (iter == __clsMap.end())
//        {
//            *outCls = nullptr;
//            return nullptr;
//        }
//
//        Class* thiz = iter->second;
//        *outCls = thiz;
//
//        return _createJSObjectWithClass(thiz);
//    }

    JSObjectRef Class::_createJSObjectWithClass(Class* cls)
    {
        return JSObjectMake(__cx, cls->_jsCls, nullptr);
    }

    void Class::setContext(JSContextRef cx)
    {
        __cx = cx;
    }

    Object *Class::getProto()
    {
        return _proto;
    }

    void Class::cleanup()
    {// TODO:

    }

} // namespace se {

#endif // SCRIPT_ENGINE_JSC
