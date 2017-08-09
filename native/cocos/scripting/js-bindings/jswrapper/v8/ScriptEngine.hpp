#pragma once

#include "../config.hpp"

#ifdef SCRIPT_ENGINE_V8

#include "Base.h"
#include "../Value.hpp"

#include <chrono>

#if SE_ENABLE_INSPECTOR
namespace node {
    namespace inspector {
        class Agent;
    }

    class Environment;
    class IsolateData;
}
#endif

namespace se {

    class Object;
    class Class;
    class Value;

    extern Class* __jsb_CCPrivateData_class;

    class AutoHandleScope
    {
    public:
        AutoHandleScope()
        : _handleScope(v8::Isolate::GetCurrent())
        {
        }
        ~AutoHandleScope()
        {
        }
    private:
        v8::HandleScope _handleScope;
    };

    class ScriptEngine final
    {
    private:
        ScriptEngine();
        ~ScriptEngine();
    public:

        static ScriptEngine* getInstance();
        static void destroyInstance();

        Object* getGlobalObject() const;

        typedef bool (*RegisterCallback)(Object*);
        void addRegisterCallback(RegisterCallback cb);
        bool start();

        bool init();
        void cleanup();
        void addBeforeCleanupHook(const std::function<void()>& hook);
        void addAfterCleanupHook(const std::function<void()>& hook);

        bool executeScriptBuffer(const char *string, Value *data = nullptr, const char *fileName = nullptr);
        bool executeScriptBuffer(const char *string, size_t length, Value *data = nullptr, const char *fileName = nullptr);

        bool isInGC();
        void _setInGC(bool isInGC);
        void gc();

        bool isValid() const;

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

        v8::Local<v8::Context> _getContext() const;
    private:

        static void privateDataFinalize(void* nativeObj);

        v8::Platform* _platform;
        v8::Isolate* _isolate;

        v8::Persistent<v8::Context> _context;

        v8::HandleScope* _handleScope;

        v8::ArrayBuffer::Allocator* _allocator;
        v8::Isolate::CreateParams _createParams;
        Object* _globalObj;

        bool _isValid;
        bool _isInGC;
        NodeEventListener _nodeEventListener;

        std::vector<RegisterCallback> _registerCallbackArray;
        std::chrono::steady_clock::time_point _startTime;
        std::vector<std::function<void()>> _beforeCleanupHookArray;
        std::vector<std::function<void()>> _afterCleanupHookArray;

#if SE_ENABLE_INSPECTOR
        node::Environment* _env;
        node::IsolateData* _isolateData;
#endif
    };

} // namespace se {

#endif // SCRIPT_ENGINE_V8
