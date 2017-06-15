#pragma once

#include "../config.hpp"

#ifdef SCRIPT_ENGINE_SM

#include "Base.h"

namespace se {

    class Object;
    class Class;
    class Value;

    extern Class* __jsb_CCPrivateData_class;
    
    class AutoHandleScope
    {
    public:
        AutoHandleScope() {}
        ~AutoHandleScope() {}
    };
    
    class ScriptEngine
    {
    private:
        ScriptEngine();
        ~ScriptEngine();

    public:
        static ScriptEngine* getInstance();
        static void destroyInstance();

        // --- Global Object
        Object* getGlobalObject();

        // --- Execute
        bool executeScriptBuffer(const char *string, Value *data = nullptr, const char *fileName = nullptr);
        bool executeScriptBuffer(const char *string, size_t length, Value *data = nullptr, const char *fileName = nullptr);
        bool executeScriptFile(const std::string &filePath, Value *rval = nullptr);

        JSContext* _getContext() { return _cx; }

        // --- Run GC
        void gc() { JS_GC( _cx );  }

        bool isValid() { return _isValid; }

        void clearException();

        void _retainScriptObject(void* owner, void* target);
        void _releaseScriptObject(void* owner, void* target);

        enum class NodeEventType
        {
            ENTER,
            EXIT,
            ENTER_TRANSITION_DID_FINISH,
            EXIT_TRANSITION_DID_START,
            CLEANUP
        };
        bool _onReceiveNodeEvent(void* node, NodeEventType type);

        using NodeEventListener = bool(*)(void*/*node*/, NodeEventType);
        bool _setNodeEventListener(NodeEventListener listener);

    private:
        static void myWeakPointerCompartmentCallback(JSContext* cx, JSCompartment* comp, void* data);
        static void myWeakPointerZoneGroupCallback(JSContext* cx, void* data);
        static void myExtraGCRootsTracer(JSTracer* trc, void* data);

        bool init();
        void cleanup();

        JSContext* _cx;
        JSCompartment* _oldCompartment;

        Object* _globalObj;

        bool _isValid;
        NodeEventListener _nodeEventListener;
    };

 } // namespace se {

#endif // SCRIPT_ENGINE_SM


