/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include "../config.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8

    #include "../Value.h"
    #include "Base.h"

    #include <thread>

    #if SE_ENABLE_INSPECTOR
namespace node {
namespace inspector {
class Agent;
}

class Environment;
class IsolateData;
} // namespace node
    #endif

namespace se {

class Object;
class Class;
class Value;

/**
 * A stack-allocated class that governs a number of local handles.
 * It's only implemented for v8 wrapper now.
 * Other script engine wrappers have empty implementation for this class.
 * It's used at the beginning of executing any wrapper API.
 */
class AutoHandleScope {
public:
    AutoHandleScope();
    ~AutoHandleScope();

private:
    v8::HandleScope _handleScope;
};

/**
 * ScriptEngine is a sington which represents a context of JavaScript VM.
 */
class ScriptEngine final {
public:
    /**
     *  @brief Gets or creates the instance of script engine.
     *  @return The script engine instance.
     */
    static ScriptEngine *getInstance();

    /**
     *  @brief Destroys the instance of script engine.
     */
    CC_DEPRECATED(3.6.0)
    static void destroyInstance();

    ScriptEngine();
    ~ScriptEngine();

    /**
     *  @brief Gets the global object of JavaScript VM.
     *  @return The se::Object stores the global JavaScript object.
     */
    Object *getGlobalObject() const;

    using RegisterCallback = bool (*)(Object *);

    /**
     *  @brief Adds a callback for registering a native binding module.
     *  @param[in] cb A callback for registering a native binding module.
     *  @note This method just add a callback to a vector, callbacks is invoked in `start` method.
     */
    void addRegisterCallback(RegisterCallback cb);

    /**
     *  @brief Adds a callback for registering a native binding module, which will not be removed by ScriptEngine::cleanup.
     *  @param[in] cb A callback for registering a native binding module.
     *  @note This method just add a callback to a vector, callbacks is invoked in `start` method.
     */
    void addPermanentRegisterCallback(RegisterCallback cb);

    /**
     *  @brief Starts the script engine.
     *  @return true if succeed, otherwise false.
     *  @note This method will invoke all callbacks of native binding modules by the order of registration.
     */
    bool start();

    /**
     *  @brief Starts the script engine with isolate.
     *  @return true if succeed, otherwise false.
     *  @note This method will invoke all callbacks of native binding modules by the order of registration.
     */
    bool start(v8::Isolate *isolate);

    /**
     *  @brief Initializes script engine.
     *  @return true if succeed, otherwise false.
     *  @note This method will create JavaScript context and global object.
     */
    bool init();

    /**
     *  @brief Initializes script engine  with isolate.
     *  @return true if succeed, otherwise false.
     *  @note This method will create JavaScript context and global object.
     */
    bool init(v8::Isolate *isolate);
    /**
     *  @brief Adds a hook function before initializing script engine.
     *  @param[in] hook A hook function to be invoked before initializing script engine.
     *  @note Multiple hook functions could be added, they will be invoked by the order of adding.
     */
    void addBeforeInitHook(const std::function<void()> &hook);

    /**
     *  @brief Adds a hook function after initializing script engine.
     *  @param[in] hook A hook function to be invoked before initializing script engine.
     *  @note Multiple hook functions could be added, they will be invoked by the order of adding.
     */
    void addAfterInitHook(const std::function<void()> &hook);

    /**
     *  @brief Cleanups script engine.
     *  @note This method will removes all objects in JavaScript VM even whose are rooted, then shutdown JavaScript VMf.
     */
    void cleanup();

    /**
     *  @brief Adds a hook function before cleanuping script engine.
     *  @param[in] hook A hook function to be invoked before cleanuping script engine.
     *  @note Multiple hook functions could be added, they will be invoked by the order of adding.
     */
    void addBeforeCleanupHook(const std::function<void()> &hook);

    /**
     *  @brief Adds a hook function after cleanuping script engine.
     *  @param[in] hook A hook function to be invoked after cleanuping script engine.
     *  @note Multiple hook functions could be added, they will be invoked by the order of adding.
     */
    void addAfterCleanupHook(const std::function<void()> &hook);

    /**
     *  @brief Executes a utf-8 string buffer which contains JavaScript code.
     *  @param[in] script A utf-8 string buffer, if it isn't null-terminated, parameter `length` should be assigned and > 0.
     *  @param[in] length The length of parameter `scriptStr`, it will be set to string length internally if passing 0 and parameter `scriptStr` is null-terminated.
     *  @param[in] ret The se::Value that results from evaluating script. Passing nullptr if you don't care about the result.
     *  @param[in] fileName A string containing a URL for the script's source file. This is used by debuggers and when reporting exceptions. Pass NULL if you do not care to include source file information.
     *  @return true if succeed, otherwise false.
     */
    bool evalString(const char *script, uint32_t length = 0, Value *ret = nullptr, const char *fileName = nullptr);

    /**
     *  @brief Compile script file into v8::ScriptCompiler::CachedData and save to file.
     *  @param[in] path The path of script file.
     *  @param[in] pathBc The location where bytecode file should be written to. The path should be ends with ".bc", which indicates a bytecode file.
     *  @return true if succeed, otherwise false.
     */
    bool saveByteCodeToFile(const ccstd::string &path, const ccstd::string &pathBc);

    /**
     * @brief Grab a snapshot of the current JavaScript execution stack.
     * @return current stack trace string
     */
    ccstd::string getCurrentStackTrace();

    /**
     *  Delegate class for file operation
     */
    class FileOperationDelegate {
    public:
        FileOperationDelegate()
        : onGetDataFromFile(nullptr),
          onGetStringFromFile(nullptr),
          onCheckFileExist(nullptr),
          onGetFullPath(nullptr) {}

        /**
         *  @brief Tests whether delegate is valid.
         */
        bool isValid() const {
            return onGetDataFromFile != nullptr && onGetStringFromFile != nullptr && onCheckFileExist != nullptr && onGetFullPath != nullptr;
        }

        // path, buffer, buffer size
        std::function<void(const ccstd::string &, const std::function<void(const uint8_t *, size_t)> &)> onGetDataFromFile;
        // path, return file string content.
        std::function<ccstd::string(const ccstd::string &)> onGetStringFromFile;
        // path
        std::function<bool(const ccstd::string &)> onCheckFileExist;
        // path, return full path
        std::function<ccstd::string(const ccstd::string &)> onGetFullPath;
    };

    /**
     *  @brief Sets the delegate for file operation.
     *  @param delegate[in] The delegate instance for file operation.
     */
    void setFileOperationDelegate(const FileOperationDelegate &delegate);

    /**
     *  @brief Gets the delegate for file operation.
     *  @return The delegate for file operation
     */
    const FileOperationDelegate &getFileOperationDelegate() const;

    /**
     *  @brief Executes a file which contains JavaScript code.
     *  @param[in] path Script file path.
     *  @param[in] ret The se::Value that results from evaluating script. Passing nullptr if you don't care about the result.
     *  @return true if succeed, otherwise false.
     */
    bool runScript(const ccstd::string &path, Value *ret = nullptr);

    /**
     *  @brief Tests whether script engine is doing garbage collection.
     *  @return true if it's in garbage collection, otherwise false.
     */
    bool isGarbageCollecting() const;

    /**
     *  @brief Performs a JavaScript garbage collection.
     */
    void garbageCollect();

    /**
     *  @brief Tests whether script engine is being cleaned up.
     *  @return true if it's in cleaning up, otherwise false.
     */
    bool isInCleanup() const { return _isInCleanup; }

    /**
     *  @brief Tests whether script engine is valid.
     *  @return true if it's valid, otherwise false.
     */
    bool isValid() const;

    /**
     * @brief Throw JS exception
     */
    void throwException(const ccstd::string &errorMessage);

    /**
     *  @brief Clears all exceptions.
     */
    void clearException();

    using ExceptionCallback = std::function<void(const char *, const char *, const char *)>; // location, message, stack

    /**
     *  @brief Sets the callback function while an exception is fired.
     *  @param[in] cb The callback function to notify that an exception is fired.
     */
    void setExceptionCallback(const ExceptionCallback &cb);

    /**
     *  @brief Sets the callback function while an exception is fired in JS.
     *  @param[in] cb The callback function to notify that an exception is fired.
     */
    void setJSExceptionCallback(const ExceptionCallback &cb);

    /**
     *  @brief Gets the start time of script engine.
     *  @return The start time of script engine.
     */
    const std::chrono::steady_clock::time_point &getStartTime() const { return _startTime; }

    /**
     *  @brief Enables JavaScript debugger
     *  @param[in] serverAddr The address of debugger server.
     *  @param[in] isWait Whether wait debugger attach when loading.
     */
    void enableDebugger(const ccstd::string &serverAddr, uint32_t port, bool isWait = false);

    /**
     *  @brief Tests whether JavaScript debugger is enabled
     *  @return true if JavaScript debugger is enabled, otherwise false.
     */
    bool isDebuggerEnabled() const;

    /**
     *  @brief Main loop update trigger, it's need to invoked in main thread every frame.
     */
    void mainLoopUpdate();

    /**
     *  @brief Gets script virtual machine instance ID. Default value is 1, increase by 1 if `init` is invoked.
     */
    uint32_t getVMId() const { return _vmId; }

    /**
     * @brief Fast version of call script function, faster than Object::call
     */
    bool callFunction(Object *targetObj, const char *funcName, uint32_t argc, Value *args, Value *rval = nullptr);

    /**
     * @brief Handle all exceptions throwed by promise
     */
    void handlePromiseExceptions();

    // Private API used in wrapper
    class VMStringPool final {
    public:
        VMStringPool();
        ~VMStringPool();
        v8::MaybeLocal<v8::String> get(v8::Isolate *isolate, const char *name);
        void clear();

    private:
        ccstd::unordered_map<ccstd::string, v8::Persistent<v8::String> *> _vmStringPoolMap;
    };

    inline VMStringPool &_getStringPool() { return _stringPool; } // NOLINT(readability-identifier-naming)
    void _retainScriptObject(void *owner, void *target);          // NOLINT(readability-identifier-naming)
    void _releaseScriptObject(void *owner, void *target);         // NOLINT(readability-identifier-naming)
    v8::Local<v8::Context> _getContext() const;                   // NOLINT(readability-identifier-naming)
    void _setGarbageCollecting(bool isGarbageCollecting);         // NOLINT(readability-identifier-naming)

    struct DebuggerInfo {
        ccstd::string serverAddr;
        uint32_t port{0};
        bool isWait{false};
        inline bool isValid() const { return !serverAddr.empty() && port != 0; }
        inline void reset() {
            serverAddr.clear();
            port = 0;
            isWait = false;
        }
    };
    static void _setDebuggerInfo(const DebuggerInfo &info); // NOLINT(readability-identifier-naming)
    //
private:
    static void privateDataFinalize(PrivateObjectBase *privateObj);
    static void onFatalErrorCallback(const char *location, const char *message);

    static void onOOMErrorCallback(const char *location,
#if V8_MAJOR_VERSION > 10 || (V8_MAJOR_VERSION == 10 && V8_MINOR_VERSION > 4)
                                      const v8::OOMDetails& details
#else
                                      bool isHeapOom
#endif
                                   );
    static void onMessageCallback(v8::Local<v8::Message> message, v8::Local<v8::Value> data);
    static void onPromiseRejectCallback(v8::PromiseRejectMessage msg);

    /**
     *  @brief Load the bytecode file and set the return value
     *  @param[in] path_bc The path of bytecode file.
     *  @param[in] ret The se::Value that results from evaluating script. Passing nullptr if you don't care about the result.
     *  @return true if succeed, otherwise false.
     */
    bool runByteCodeFile(const ccstd::string &pathBc, Value *ret /* = nullptr */);
    void callExceptionCallback(const char *, const char *, const char *);
    bool callRegisteredCallback();
    bool postInit();
    // Struct to save exception info
    struct PromiseExceptionMsg {
        ccstd::string event;
        ccstd::string stackTrace;
    };
    // Push promise and exception msg to _promiseArray
    void pushPromiseExeception(const v8::Local<v8::Promise> &promise, const char *event, const char *stackTrace);

    static ScriptEngine *instance;

    static DebuggerInfo debuggerInfo;

    ccstd::vector<std::tuple<std::unique_ptr<v8::Persistent<v8::Promise>>, ccstd::vector<PromiseExceptionMsg>>> _promiseArray;

    std::chrono::steady_clock::time_point _startTime;
    ccstd::vector<RegisterCallback> _registerCallbackArray;
    ccstd::vector<RegisterCallback> _permRegisterCallbackArray;
    ccstd::vector<std::function<void()>> _beforeInitHookArray;
    ccstd::vector<std::function<void()>> _afterInitHookArray;
    ccstd::vector<std::function<void()>> _beforeCleanupHookArray;
    ccstd::vector<std::function<void()>> _afterCleanupHookArray;

    v8::Persistent<v8::Context> _context;

    v8::Isolate *_isolate;
    v8::HandleScope *_handleScope;
    Object *_globalObj;
    Value _gcFuncValue;
    Object *_gcFunc = nullptr;

    FileOperationDelegate _fileOperationDelegate;
    ExceptionCallback _nativeExceptionCallback = nullptr;
    ExceptionCallback _jsExceptionCallback = nullptr;

    #if SE_ENABLE_INSPECTOR
    node::Environment *_env;
    node::IsolateData *_isolateData;
    #endif
    VMStringPool _stringPool;

    std::thread::id _engineThreadId;
    ccstd::string _lastStackTrace;
    ccstd::string _debuggerServerAddr;
    uint32_t _debuggerServerPort;
    bool _isWaitForConnect;

    uint32_t _vmId;

    bool _isValid;
    bool _isGarbageCollecting;
    bool _isInCleanup;
    bool _isErrorHandleWorking;
};

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8
