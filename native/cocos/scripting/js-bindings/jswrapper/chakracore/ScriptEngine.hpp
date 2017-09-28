#pragma once

#include "../config.hpp"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_CHAKRACORE

#include "Base.h"
#include <chrono>

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
    
    class ScriptEngine final
    {
    private:
        ScriptEngine();
        ~ScriptEngine();

    public:
        static ScriptEngine* getInstance();
        static void destroyInstance();

        Object* getGlobalObject();

        typedef bool (*RegisterCallback)(Object*);
        void addRegisterCallback(RegisterCallback cb);
        bool start();

        bool init();
        void cleanup();

        /**
         *  @brief Adds a hook function before initializing script engine.
         *  @param[in] hook A hook function to be invoked before initializing script engine.
         *  @note Multiple hook functions could be added, they will be invoked by the order of adding.
         */
        void addBeforeInitHook(const std::function<void()>& hook);

        /**
         *  @brief Adds a hook function after initializing script engine.
         *  @param[in] hook A hook function to be invoked before initializing script engine.
         *  @note Multiple hook functions could be added, they will be invoked by the order of adding.
         */
        void addAfterInitHook(const std::function<void()>& hook);

        void addBeforeCleanupHook(const std::function<void()>& hook);
        void addAfterCleanupHook(const std::function<void()>& hook);

        bool evalString(const char* script, ssize_t length = -1, Value* ret = nullptr, const char* fileName = nullptr);

        /**
         *  Delegate class for file operation
         */
        class FileOperationDelegate
        {
        public:
            FileOperationDelegate()
            : onGetDataFromFile(nullptr)
            , onGetStringFromFile(nullptr)
            , onCheckFileExist(nullptr)
            , onGetFullPath(nullptr)
            {}

            /**
             *  @brief Tests whether delegate is valid.
             */
            bool isValid() {
                return onGetDataFromFile != nullptr
                && onGetStringFromFile != nullptr
                && onCheckFileExist != nullptr
                && onGetFullPath != nullptr; }

            // path, buffer, buffer size
            std::function<void(const std::string&, const std::function<void(const uint8_t*, size_t)>& )> onGetDataFromFile;
            // path, return file string content.
            std::function<std::string(const std::string&)> onGetStringFromFile;
            // path
            std::function<bool(const std::string&)> onCheckFileExist;
            // path, return full path
            std::function<std::string(const std::string&)> onGetFullPath;
        };

        /**
         *  @brief Sets the delegate for file operation.
         *  @param delegate[in] The delegate instance for file operation.
         */
        void setFileOperationDelegate(const FileOperationDelegate& delegate);

        /**
         *  @brief Executes a file which contains JavaScript code.
         *  @param[in] path Script file path.
         *  @param[in] rval The se::Value that results from evaluating script. Passing nullptr if you don't care about the result.
         *  @return true if succeed, otherwise false.
         */
        bool runScript(const std::string& path, Value* ret = nullptr);

        bool isGarbageCollecting();
        void _setGarbageCollecting(bool isGarbageCollecting);
        void garbageCollect();

        bool isValid() { return _isValid; }
        bool isInCleanup() { return _isInCleanup; }

        void clearException();

        using ExceptionCallback = std::function<void(const char*, const char*, const char*)>; // location, message, stack

        void setExceptionCallback(const ExceptionCallback& cb);

        const std::chrono::steady_clock::time_point& getStartTime() const { return _startTime; }
        void enableDebugger(unsigned int port = 5086);
        void mainLoopUpdate();

        uint32_t getVMId() const { return _vmId; }

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
        using NodeEventListener = bool(*)(void*, NodeEventType);
        bool _setNodeEventListener(NodeEventListener listener);

    private:
        struct ExceptionInfo
        {
            std::string location;
            std::string message;
            std::string stack;

            bool isValid() const
            {
                return !message.empty();
            }
        };
        ExceptionInfo formatException(JsValueRef exception);

        std::chrono::steady_clock::time_point _startTime;
        std::vector<RegisterCallback> _registerCallbackArray;
        std::vector<std::function<void()>> _beforeInitHookArray;
        std::vector<std::function<void()>> _afterInitHookArray;
        std::vector<std::function<void()>> _beforeCleanupHookArray;
        std::vector<std::function<void()>> _afterCleanupHookArray;

        JsRuntimeHandle _rt;
        JsContextRef _cx;
        Object* _globalObj;

        NodeEventListener _nodeEventListener;
        FileOperationDelegate _fileOperationDelegate;
        ExceptionCallback _exceptionCallback;

        uint32_t _currentSourceContext;
        uint32_t _vmId;

        bool _isValid;
        bool _isInCleanup;
        bool _isGarbageCollecting;
        bool _isErrorHandleWorking;
    };

 } // namespace se {

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_CHAKRACORE


