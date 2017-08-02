#pragma once

#include "../config.hpp"

#ifdef SCRIPT_ENGINE_SM

#include "Base.h"

namespace se {

    class Object;

    class Class final
    {
    private:
        Class();
        ~Class();
    public:

        static Class* create(const char* className, Object* obj, Object* parentProto, JSNative ctor);

        bool install();
        Object* getProto();
        JSFinalizeOp _getFinalizeCb() const;

        bool defineFunction(const char *name, JSNative func);
        bool defineProperty(const char *name, JSNative getter, JSNative setter);
        bool defineStaticFunction(const char *name, JSNative func);
        bool defineStaticProperty(const char *name, JSNative getter, JSNative setter);
        bool defineFinalizedFunction(JSFinalizeOp func);

        const char* getName() const { return _name; }

    private:
        bool init(const char* clsName, Object* obj, Object* parentProto, JSNative ctor);
        void destroy();

//        static JSObject* _createJSObject(const std::string &clsName, Class** outCls);
        static JSObject* _createJSObjectWithClass(Class* cls);

        static void setContext(JSContext* cx);
        static void cleanup();

        const char* _name;
        Object* _parent;
        Object* _proto;
        Object* _parentProto;

        JSNative _ctor;

        JSClass _jsCls;
        JSClassOps _classOps;

        std::vector<JSFunctionSpec> _funcs;
        std::vector<JSFunctionSpec> _staticFuncs;
        std::vector<JSPropertySpec> _properties;
        std::vector<JSPropertySpec> _staticProperties;
        JSFinalizeOp _finalizeOp;

        friend class ScriptEngine;
        friend class Object;
    };

} // namespace se {

#endif // SCRIPT_ENGINE_SM

