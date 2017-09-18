#pragma once

#include "../config.hpp"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_CHAKRACORE

#include "Base.h"

namespace se {

    class Object;

    class Class final
    {
    private:
        Class();
        ~Class();
    public:

        static Class* create(const std::string& className, Object* obj, Object* parentProto, JsNativeFunction ctor);

        bool install();
        Object* getProto();

        bool defineFunction(const char *name, JsNativeFunction func);
        bool defineProperty(const char *name, JsNativeFunction getter, JsNativeFunction setter);
        bool defineStaticFunction(const char *name, JsNativeFunction func);
        bool defineStaticProperty(const char *name, JsNativeFunction getter, JsNativeFunction setter);
        bool defineFinalizeFunction(JsFinalizeCallback func);

        const char* getName() const { return _name.c_str(); }

    private:
        bool init(const std::string& clsName, Object* obj, Object* parentProto, JsNativeFunction ctor);
        void destroy();

//        static JsValueRef _createJSObject(const std::string &clsName, Class** outCls);
        static JsValueRef _createJSObjectWithClass(Class* cls);

        static void cleanup();

        struct JSFunctionSpec
        {
            const char* name;
            JsNativeFunction func;
        };

        struct JSPropertySpec
        {
            const char* name;
            JsNativeFunction getter;
            JsNativeFunction setter;
        };

        std::string _name;
        Object* _parent;
        Object* _proto;
        Object* _parentProto;

        JsNativeFunction _ctor;

        std::vector<JSFunctionSpec> _funcs;
        std::vector<JSFunctionSpec> _staticFuncs;
        std::vector<JSPropertySpec> _properties;
        std::vector<JSPropertySpec> _staticProperties;
        JsFinalizeCallback _finalizeOp;

        friend class ScriptEngine;
        friend class Object;
    };

} // namespace se {

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_CHAKRACORE

