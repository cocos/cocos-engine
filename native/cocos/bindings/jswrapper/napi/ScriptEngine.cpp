#include "ScriptEngine.h"
#include <sstream>
#include "../MappingUtils.h"
#include "Class.h"
#include "Utils.h"
#include "CommonHeader.h"
#include <napi/native_api.h>

namespace se {
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
    LOGI("run script : %s", path.c_str());
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
    NonRefNativePtrCreatedByCtorMap::init();
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
    NonRefNativePtrCreatedByCtorMap::destroy();
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
}; // namespace se