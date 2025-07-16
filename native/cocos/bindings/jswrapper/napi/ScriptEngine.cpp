/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#include "ScriptEngine.h"
#include <sstream>
#include "../MappingUtils.h"
#include "Class.h"
#include "Utils.h"
#include "CommonHeader.h"
#include <napi/native_api.h>
#include "base/std/container/array.h"

namespace se {
AutoHandleScope::AutoHandleScope() {
    napi_open_handle_scope(ScriptEngine::getEnv(), &_handleScope);
}

AutoHandleScope::~AutoHandleScope() {
    napi_close_handle_scope(ScriptEngine::getEnv(), _handleScope);
}

ScriptEngine *gSriptEngineInstance = nullptr;

ScriptEngine::ScriptEngine() {};

ScriptEngine::~ScriptEngine() = default;

void ScriptEngine::setFileOperationDelegate(const FileOperationDelegate &delegate) {
    _fileOperationDelegate = delegate;
}

const ScriptEngine::FileOperationDelegate &ScriptEngine::getFileOperationDelegate() const {
    return _fileOperationDelegate;
}

ScriptEngine *ScriptEngine::getInstance() {
    if (gSriptEngineInstance == nullptr) {
        gSriptEngineInstance = new ScriptEngine();
    }

    return gSriptEngineInstance;
}

void ScriptEngine::destroyInstance() {
    if (gSriptEngineInstance) {
        gSriptEngineInstance->cleanup();
        delete gSriptEngineInstance;
        gSriptEngineInstance = nullptr;
    }
}

bool ScriptEngine::runScript(const std::string &path, Value *ret /* = nullptr */) {
    assert(!path.empty());
    napi_status status;
    napi_value result = nullptr;
    LOGI("run script : %{public}s", path.c_str());
    //NODE_API_CALL(status, ScriptEngine::getEnv(), napi_run_script_path(ScriptEngine::getEnv(), path.c_str(), &result));
    if (ret && result) {
        internal::jsToSeValue(result, ret);
    }
    return false;
}

bool ScriptEngine::evalString(const char *scriptStr, ssize_t length, Value *ret, const char *fileName) {
    napi_status status;
    napi_value  script;
    napi_value  result;
    length = length < 0 ? NAPI_AUTO_LENGTH : length;
    status = napi_create_string_utf8(ScriptEngine::getEnv(), scriptStr, length, &script);
    LOGI("eval :%{public}s", scriptStr);
    NODE_API_CALL(status, ScriptEngine::getEnv(), napi_run_script(ScriptEngine::getEnv(), script, &result));
    return true;
}

bool ScriptEngine::init() {
    napi_status status;
    napi_value  result;

    for (const auto &hook : _beforeInitHookArray) {
        hook();
    }

    Object::setup();
    NativePtrToObjectMap::init();
    NODE_API_CALL(status, ScriptEngine::getEnv(), napi_get_global(ScriptEngine::getEnv(), &result));
    _globalObj = Object::_createJSObject(ScriptEngine::getEnv(), result, nullptr);
    _globalObj->root();
    _globalObj->setProperty("window", Value(_globalObj));
    _globalObj->setProperty("scriptEngineType", se::Value("napi"));

    _isValid = true;

    for (const auto &hook : _afterInitHookArray) {
        hook();
    }
    _afterInitHookArray.clear();

    return _isValid;
}

Object *ScriptEngine::getGlobalObject() const {
    return _globalObj;
}

bool ScriptEngine::start() {
    bool ok = true;
    if (!init()) {
        return false;
    }
    _startTime = std::chrono::steady_clock::now();
    for (auto cb : _permRegisterCallbackArray) {
        ok = cb(_globalObj);
        assert(ok);
        if (!ok) {
            break;
        }
    }

    for (auto cb : _registerCallbackArray) {
        ok = cb(_globalObj);
        assert(ok);
        if (!ok) {
            break;
        }
    }

    // After ScriptEngine is started, _registerCallbackArray isn't needed. Therefore, clear it here.
    _registerCallbackArray.clear();

    return ok;
}

void ScriptEngine::cleanup() {
    if (!_isValid) {
        return;
    }

    SE_LOGD("ScriptEngine::cleanup begin ...\n");
    _isInCleanup = true;

    for (const auto &hook : _beforeCleanupHookArray) {
        hook();
    }
    _beforeCleanupHookArray.clear();

    SAFE_DEC_REF(_globalObj);
    Object::cleanup();
    Class::cleanup();
    garbageCollect();

    _globalObj = nullptr;
    _isValid   = false;

    _registerCallbackArray.clear();

    for (const auto &hook : _afterCleanupHookArray) {
        hook();
    }
    _afterCleanupHookArray.clear();

    _isInCleanup = false;
    NativePtrToObjectMap::destroy();
    SE_LOGD("ScriptEngine::cleanup end ...\n");
}

void ScriptEngine::addBeforeCleanupHook(const std::function<void()> &hook) {
    _beforeCleanupHookArray.push_back(hook);
    return;
}

void ScriptEngine::addAfterCleanupHook(const std::function<void()> &hook) {
    _afterCleanupHookArray.push_back(hook);
    return;
}

void ScriptEngine::addRegisterCallback(RegisterCallback cb) {
    assert(std::find(_registerCallbackArray.begin(), _registerCallbackArray.end(), cb) == _registerCallbackArray.end());
    _registerCallbackArray.push_back(cb);
}

napi_env ScriptEngine::getEnv() {
    return getInstance()->_env;
}

void ScriptEngine::setEnv(napi_env env) {
    getInstance()->_env = env;
}

void ScriptEngine::addPermanentRegisterCallback(RegisterCallback cb) {
    if (std::find(_permRegisterCallbackArray.begin(), _permRegisterCallbackArray.end(), cb) == _permRegisterCallbackArray.end()) {
        _permRegisterCallbackArray.push_back(cb);
    }
}

void ScriptEngine::setExceptionCallback(const ExceptionCallback &cb) {
    //not impl
    return;
}

const std::chrono::steady_clock::time_point &ScriptEngine::getStartTime() const {
    return _startTime;
}

bool ScriptEngine::isValid() const {
    return _isValid;
}

void ScriptEngine::enableDebugger(const std::string &serverAddr, uint32_t port, bool isWait) {
    //not impl
    return;
}

bool ScriptEngine::saveByteCodeToFile(const std::string &path, const std::string &pathBc) {
    //not impl
    return true;
}

void ScriptEngine::clearException() {
    //not impl
    return;
}

void ScriptEngine::garbageCollect() {
    //not impl
    return;
}

bool ScriptEngine::isGarbageCollecting() const {
    return _isGarbageCollecting;
}

void ScriptEngine::_setGarbageCollecting(bool isGarbageCollecting) { //NOLINT(readability-identifier-naming)
    _isGarbageCollecting = isGarbageCollecting;
}

void ScriptEngine::setJSExceptionCallback(const ExceptionCallback &cb) {
    //not impl
    return;
}

void ScriptEngine::addAfterInitHook(const std::function<void()> &hook) {
    _afterInitHookArray.push_back(hook);
    return;
}

std::string ScriptEngine::getCurrentStackTrace() {
    //not impl
    return "";
}

void ScriptEngine::_setNeedCallConstructor(bool need) {
    _isneedCallConstructor = need;
}

bool ScriptEngine::_needCallConstructor() {
    return _isneedCallConstructor;
}

bool ScriptEngine::callFunction(Object *targetObj, const char *funcName, uint32_t argc, Value *args, Value *rval) {
    Value objFunc;
    if (!targetObj->getProperty(funcName, &objFunc)) {
        return false;
    }

    ValueArray argv;

    for (size_t i = 0; i < argc; ++i) {
        argv.push_back(args[i]);
    }

    objFunc.toObject()->call(argv, targetObj, rval);

    return true;
}

void ScriptEngine::handlePromiseExceptions() {
    //not impl
    assert(true);
    return;
}

void ScriptEngine::mainLoopUpdate() {
    // empty implementation
}

void ScriptEngine::throwException(const std::string &errorMessage) {
    napi_status status;
    NODE_API_CALL_RETURN_VOID(getEnv(), napi_throw_error(getEnv(), nullptr, errorMessage.c_str()));
}
}; // namespace se
