#pragma once

#include "../config.hpp"

#ifdef SCRIPT_ENGINE_V8

#include "Base.h"

namespace se {

	class Object;

	class Class final
    {
    private:
        Class();
        ~Class();
    public:

        static Class* create(const std::string& clsName, Object* parent, Object* parentProto, v8::FunctionCallback ctor);

		bool install();
        void destroy();

        bool defineFunction(const char *name, v8::FunctionCallback func);
        bool defineProperty(const char *name, v8::AccessorNameGetterCallback getter, v8::AccessorNameSetterCallback setter);
        bool defineStaticFunction(const char *name, v8::FunctionCallback func);
        bool defineStaticProperty(const char *name, v8::AccessorNameGetterCallback getter, v8::AccessorNameSetterCallback setter);
        bool defineFinalizedFunction(V8FinalizeFunc finalizeFunc);

        Object* getProto() const;

        V8FinalizeFunc _getFinalizeFunction() const;

        const char* getName() const { return _name.c_str(); }

	private:
        void setCreateProto(bool createProto);

        bool init(const std::string& clsName, Object* parent, Object* parentProto, v8::FunctionCallback ctor);
        static void cleanup();
//        static v8::Local<v8::Object> _createJSObject(const std::string &clsName, Class** outCls);
        static v8::Local<v8::Object> _createJSObjectWithClass(Class* cls);
        static void setIsolate(v8::Isolate* isolate);
		
		std::string _name;
		Object* _parent;
        Object* _parentProto;
        Object* _proto;

        v8::FunctionCallback _ctor;
		v8::UniquePersistent<v8::FunctionTemplate> _ctorTemplate;
        V8FinalizeFunc _finalizeFunc;
        bool _createProto;

        friend class ScriptEngine;
        friend class Object;
	};

} // namespace se {

#endif // SCRIPT_ENGINE_V8
