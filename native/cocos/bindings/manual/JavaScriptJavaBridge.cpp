/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

#include "cocos/bindings/manual/JavaScriptJavaBridge.h"
#include "cocos/base/UTF8.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "platform/java/jni/JniHelper.h"

#if CC_PLATFORM == CC_PLATFORM_ANDROID
    #include <android/log.h>
#elif CC_PLATFORM == CC_PLATFORM_OHOS
    #include <hilog/log.h>
#endif
#include <string>
#include <vector>

#ifdef LOG_TAG
    #undef LOG_TAG
#endif

#define LOG_TAG "JavaScriptJavaBridge"

#ifndef ORG_JAVABRIDGE_CLASS_NAME
    #define ORG_JAVABRIDGE_CLASS_NAME com_cocos_lib_CocosJavascriptJavaBridge
#endif
#define JNI_JSJAVABRIDGE(FUNC) JNI_METHOD1(ORG_JAVABRIDGE_CLASS_NAME, FUNC)

extern "C" {

JNIEXPORT jint JNICALL JNI_JSJAVABRIDGE(evalString)(JNIEnv *env, jclass /*cls*/, jstring value) {
    if (!se::ScriptEngine::getInstance()->isValid()) {
        CC_LOG_DEBUG("ScriptEngine has not been initialized");
        return 0;
    }

    se::AutoHandleScope hs;
    bool                strFlag  = false;
    std::string         strValue = cc::StringUtils::getStringUTFCharsJNI(env, value, &strFlag);
    if (!strFlag) {
        CC_LOG_DEBUG("JavaScriptJavaBridge_evalString error, invalid string code");
        return 0;
    }
    se::ScriptEngine::getInstance()->evalString(strValue.c_str());
    return 1;
}

} // extern "C"

#define JSJ_ERR_OK                 (0)
#define JSJ_ERR_TYPE_NOT_SUPPORT   (-1)
#define JSJ_ERR_INVALID_SIGNATURES (-2)
#define JSJ_ERR_METHOD_NOT_FOUND   (-3)
#define JSJ_ERR_EXCEPTION_OCCURRED (-4)
#define JSJ_ERR_VM_THREAD_DETACHED (-5)
#define JSJ_ERR_VM_FAILURE         (-6)
#define JSJ_ERR_CLASS_NOT_FOUND    (-7)

class JavaScriptJavaBridge {
public:
    enum class ValueType : char {
        INVALID,
        VOID,
        INTEGER,
        LONG,
        FLOAT,
        BOOLEAN,
        STRING,
        VECTOR,
        FUNCTION
    };

    using ValueTypes = std::vector<ValueType>;

    using ReturnValue = union {
        int          intValue;
        int64_t      longValue;
        float        floatValue;
        int          boolValue;
        std::string *stringValue;
    };

    class CallInfo {
    public:
        CallInfo(const char *className, const char *methodName, const char *methodSig)
        : _mValid(false),
          _mError(JSJ_ERR_OK),
          _mClassName(className),
          _mMethodName(methodName),
          _mMethodSig(methodSig),
          _mReturnType(ValueType::VOID),
          _mArgumentsCount(0),
          _mRetjstring(nullptr),
          _mEnv(nullptr),
          _mClassID(nullptr),
          _mMethodID(nullptr) {
            memset(&_mRet, 0, sizeof(_mRet));
            _mValid = validateMethodSig() && getMethodInfo();
        }
        ~CallInfo();

        bool isValid() const {
            return _mValid;
        }

        int getErrorCode() const {
            return _mError;
        }

        void tryThrowJSException() const {
            if (_mError != JSJ_ERR_OK) {
                se::ScriptEngine::getInstance()->throwException(getErrorMessage());
            }
        }

        const char *getErrorMessage() const {
            switch (_mError) {
                case JSJ_ERR_TYPE_NOT_SUPPORT:
                    return "argument type is not supported";
                case JSJ_ERR_INVALID_SIGNATURES:
                    return "invalid signature";
                case JSJ_ERR_METHOD_NOT_FOUND:
                    return "method not found";
                case JSJ_ERR_EXCEPTION_OCCURRED:
                    return "excpected occurred";
                case JSJ_ERR_VM_THREAD_DETACHED:
                    return "vm thread detached";
                case JSJ_ERR_VM_FAILURE:
                    return "vm failure";
                case JSJ_ERR_CLASS_NOT_FOUND:
                    return "class not found";
                case JSJ_ERR_OK:
                default:
                    return "NOERROR";
            }
        }

        JNIEnv *getEnv() {
            return _mEnv;
        }

        ValueType argumentTypeAtIndex(size_t index) {
            return _mArgumentsType.at(index);
        }

        int getArgumentsCount() const {
            return _mArgumentsCount;
        }

        ValueType getReturnValueType() {
            return _mReturnType;
        }

        ReturnValue getReturnValue() {
            return _mRet;
        }

        bool execute();
        bool executeWithArgs(jvalue *args);

    private:
        bool _mValid;
        int  _mError;

        std::string _mClassName;
        std::string _mMethodName;
        std::string _mMethodSig;
        int         _mArgumentsCount;
        ValueTypes  _mArgumentsType;
        ValueType   _mReturnType;

        ReturnValue _mRet;
        jstring     _mRetjstring;

        JNIEnv *  _mEnv;
        jclass    _mClassID;
        jmethodID _mMethodID;

        bool      validateMethodSig();
        bool      getMethodInfo();
        ValueType checkType(const std::string &sig, size_t *pos);
    };

    static bool convertReturnValue(ReturnValue retValue, ValueType type, se::Value *ret);
};

JavaScriptJavaBridge::CallInfo::~CallInfo() {
    if (_mReturnType == ValueType::STRING && _mRet.stringValue) {
        delete _mRet.stringValue;
    }
}

bool JavaScriptJavaBridge::CallInfo::execute() {
    switch (_mReturnType) {
        case JavaScriptJavaBridge::ValueType::VOID:
            _mEnv->CallStaticVoidMethod(_mClassID, _mMethodID);
            break;

        case JavaScriptJavaBridge::ValueType::INTEGER:
            _mRet.intValue = _mEnv->CallStaticIntMethod(_mClassID, _mMethodID);
            break;

        case JavaScriptJavaBridge::ValueType::LONG:
            _mRet.longValue = _mEnv->CallStaticLongMethod(_mClassID, _mMethodID);
            break;

        case JavaScriptJavaBridge::ValueType::FLOAT:
            _mRet.floatValue = _mEnv->CallStaticFloatMethod(_mClassID, _mMethodID);
            break;

        case JavaScriptJavaBridge::ValueType::BOOLEAN:
            _mRet.boolValue = _mEnv->CallStaticBooleanMethod(_mClassID, _mMethodID);
            break;

        case JavaScriptJavaBridge::ValueType::STRING: {
            _mRetjstring = static_cast<jstring>(_mEnv->CallStaticObjectMethod(_mClassID, _mMethodID));
            if (_mRetjstring) {
                std::string strValue = cc::StringUtils::getStringUTFCharsJNI(_mEnv, _mRetjstring);
                _mRet.stringValue    = new std::string(strValue);
            } else {
                _mRet.stringValue = nullptr;
            }

            break;
        }

        default:
            _mError = JSJ_ERR_TYPE_NOT_SUPPORT;
            SE_LOGD("Return type '%d' is not supported", static_cast<int>(_mReturnType));
            return false;
    }

    if (_mEnv->ExceptionCheck() == JNI_TRUE) {
        _mEnv->ExceptionDescribe();
        _mEnv->ExceptionClear();
        _mError = JSJ_ERR_EXCEPTION_OCCURRED;
        return false;
    }

    return true;
}

bool JavaScriptJavaBridge::CallInfo::executeWithArgs(jvalue *args) {
    switch (_mReturnType) {
        case JavaScriptJavaBridge::ValueType::VOID:
            _mEnv->CallStaticVoidMethodA(_mClassID, _mMethodID, args);
            break;

        case JavaScriptJavaBridge::ValueType::INTEGER:
            _mRet.intValue = _mEnv->CallStaticIntMethodA(_mClassID, _mMethodID, args);
            break;

        case JavaScriptJavaBridge::ValueType::LONG:
            _mRet.longValue = _mEnv->CallStaticLongMethodA(_mClassID, _mMethodID, args);
            break;

        case JavaScriptJavaBridge::ValueType::FLOAT:
            _mRet.floatValue = _mEnv->CallStaticFloatMethodA(_mClassID, _mMethodID, args);
            break;

        case JavaScriptJavaBridge::ValueType::BOOLEAN:
            _mRet.boolValue = _mEnv->CallStaticBooleanMethodA(_mClassID, _mMethodID, args);
            break;

        case JavaScriptJavaBridge::ValueType::STRING: {
            _mRetjstring         = static_cast<jstring>(_mEnv->CallStaticObjectMethodA(_mClassID, _mMethodID, args));
            std::string strValue = cc::StringUtils::getStringUTFCharsJNI(_mEnv, _mRetjstring);
            _mRet.stringValue    = new std::string(strValue);
            break;
        }

        default:
            _mError = JSJ_ERR_TYPE_NOT_SUPPORT;
            SE_LOGD("Return type '%d' is not supported", static_cast<int>(_mReturnType));
            return false;
    }

    if (_mEnv->ExceptionCheck() == JNI_TRUE) {
        _mEnv->ExceptionDescribe();
        _mEnv->ExceptionClear();
        _mError = JSJ_ERR_EXCEPTION_OCCURRED;
        return false;
    }

    return true;
}

bool JavaScriptJavaBridge::CallInfo::validateMethodSig() {
    size_t len = _mMethodSig.length();
    if (len < 3 || _mMethodSig[0] != '(') // min sig is "()V"
    {
        _mError = JSJ_ERR_INVALID_SIGNATURES;
        return false;
    }

    size_t pos = 1;
    while (pos < len && _mMethodSig[pos] != ')') {
        JavaScriptJavaBridge::ValueType type = checkType(_mMethodSig, &pos);
        if (type == ValueType::INVALID) return false;

        _mArgumentsCount++;
        _mArgumentsType.push_back(type);
        pos++;
    }

    if (pos >= len || _mMethodSig[pos] != ')') {
        _mError = JSJ_ERR_INVALID_SIGNATURES;
        return false;
    }

    pos++;
    _mReturnType = checkType(_mMethodSig, &pos);
    return true;
}

JavaScriptJavaBridge::ValueType JavaScriptJavaBridge::CallInfo::checkType(const std::string &sig, size_t *pos) {
    switch (sig[*pos]) {
        case 'I':
            return JavaScriptJavaBridge::ValueType::INTEGER;
        case 'J':
            return JavaScriptJavaBridge::ValueType::LONG;
        case 'F':
            return JavaScriptJavaBridge::ValueType::FLOAT;
        case 'Z':
            return JavaScriptJavaBridge::ValueType::BOOLEAN;
        case 'V':
            return JavaScriptJavaBridge::ValueType::VOID;
        case 'L':
            size_t pos2 = sig.find_first_of(';', *pos + 1);
            if (pos2 == std::string::npos) {
                _mError = JSJ_ERR_INVALID_SIGNATURES;
                return ValueType::INVALID;
            }

            const std::string t = sig.substr(*pos, pos2 - *pos + 1);
            if (t == "Ljava/lang/String;") {
                *pos = pos2;
                return ValueType::STRING;
            }

            if (t == "Ljava/util/Vector;") {
                *pos = pos2;
                return ValueType::VECTOR;
            }

            _mError = JSJ_ERR_TYPE_NOT_SUPPORT;
            return ValueType::INVALID;
    }

    _mError = JSJ_ERR_TYPE_NOT_SUPPORT;
    return ValueType::INVALID;
}

bool JavaScriptJavaBridge::CallInfo::getMethodInfo() {
    _mMethodID = nullptr;
    _mEnv      = nullptr;

    JavaVM *jvm = cc::JniHelper::getJavaVM();
    jint    ret = jvm->GetEnv(reinterpret_cast<void **>(&_mEnv), JNI_VERSION_1_4);
    switch (ret) {
        case JNI_OK:
            break;

        case JNI_EDETACHED:
#if CC_PLATFORM == CC_PLATFORM_ANDROID
            if (jvm->AttachCurrentThread(&_mEnv, nullptr) < 0) {
#else
            if (jvm->AttachCurrentThread(reinterpret_cast<void **>(&_mEnv), nullptr) < 0) {
#endif
                SE_LOGD("%s", "Failed to get the environment using AttachCurrentThread()");
                _mError = JSJ_ERR_VM_THREAD_DETACHED;
                return false;
            }
            break;

        case JNI_EVERSION:
        default:
            SE_LOGD("%s", "Failed to get the environment using GetEnv()");
            _mError = JSJ_ERR_VM_FAILURE;
            return false;
    }
    jstring jstrClassName = _mEnv->NewStringUTF(_mClassName.c_str());
    _mClassID             = static_cast<jclass>(_mEnv->CallObjectMethod(cc::JniHelper::classloader,
                                                            cc::JniHelper::loadclassMethodMethodId,
                                                            jstrClassName));

    if (nullptr == _mClassID) {
        SE_LOGD("Classloader failed to find class of %s", _mClassName.c_str());
        ccDeleteLocalRef(_mEnv, jstrClassName);
        _mEnv->ExceptionClear();
        _mError = JSJ_ERR_CLASS_NOT_FOUND;
        return false;
    }

    ccDeleteLocalRef(_mEnv, jstrClassName);
    _mMethodID = _mEnv->GetStaticMethodID(_mClassID, _mMethodName.c_str(), _mMethodSig.c_str());
    if (!_mMethodID) {
        _mEnv->ExceptionClear();
        SE_LOGD("Failed to find method id of %s.%s %s",
                _mClassName.c_str(),
                _mMethodName.c_str(),
                _mMethodSig.c_str());
        _mError = JSJ_ERR_METHOD_NOT_FOUND;
        return false;
    }

    return true;
}

bool JavaScriptJavaBridge::convertReturnValue(ReturnValue retValue, ValueType type, se::Value *ret) {
    assert(ret != nullptr);
    switch (type) {
        case JavaScriptJavaBridge::ValueType::INTEGER:
            ret->setInt32(retValue.intValue);
            break;
        case JavaScriptJavaBridge::ValueType::LONG:
            ret->setDouble(static_cast<double>(retValue.longValue));
            break;
        case JavaScriptJavaBridge::ValueType::FLOAT:
            ret->setFloat(retValue.floatValue);
            break;
        case JavaScriptJavaBridge::ValueType::BOOLEAN:
            ret->setBoolean(retValue.boolValue);
            break;
        case JavaScriptJavaBridge::ValueType::STRING:
            if (retValue.stringValue) {
                ret->setString(*retValue.stringValue);
            } else {
                ret->setNull();
            }
            break;
        default:
            ret->setUndefined();
            break;
    }

    return true;
}

se::Class *__jsb_JavaScriptJavaBridge_class = nullptr; // NOLINT

static bool JavaScriptJavaBridge_finalize(se::State &s) { //NOLINT(readability-identifier-naming)
    auto *cobj = static_cast<JavaScriptJavaBridge *>(s.nativeThisObject());
    delete cobj;
    return true;
}
SE_BIND_FINALIZE_FUNC(JavaScriptJavaBridge_finalize)

static bool JavaScriptJavaBridge_constructor(se::State &s) { //NOLINT(readability-identifier-naming)
    auto *cobj = new (std::nothrow) JavaScriptJavaBridge();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(JavaScriptJavaBridge_constructor, __jsb_JavaScriptJavaBridge_class, JavaScriptJavaBridge_finalize)

static bool JavaScriptJavaBridge_callStaticMethod(se::State &s) { //NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    auto        argc = static_cast<int>(args.size());

    if (argc == 3) {
        bool        ok = false;
        std::string clsName;
        std::string methodName;
        std::string methodSig;
        ok = seval_to_std_string(args[0], &clsName);
        SE_PRECONDITION2(ok, false, "Converting class name failed!");

        ok = seval_to_std_string(args[1], &methodName);
        SE_PRECONDITION2(ok, false, "Converting method name failed!");

        ok = seval_to_std_string(args[2], &methodSig);
        SE_PRECONDITION2(ok, false, "Converting method signature failed!");

        JavaScriptJavaBridge::CallInfo call(clsName.c_str(), methodName.c_str(), methodSig.c_str());
        if (call.isValid()) {
            ok            = call.execute();
            int errorCode = call.getErrorCode();
            if (!ok || errorCode < 0) {
                call.tryThrowJSException();
                SE_REPORT_ERROR("call result code: %d", call.getErrorCode());
                return false;
            }
            JavaScriptJavaBridge::convertReturnValue(call.getReturnValue(), call.getReturnValueType(), &s.rval());
            return true;
        }
        call.tryThrowJSException();
        SE_REPORT_ERROR("JavaScriptJavaBridge::CallInfo isn't valid!");
        return false;
    }

    if (argc > 3) {
        bool        ok = false;
        std::string clsName;
        std::string methodName;
        std::string methodSig;
        ok = seval_to_std_string(args[0], &clsName);
        SE_PRECONDITION2(ok, false, "Converting class name failed!");

        ok = seval_to_std_string(args[1], &methodName);
        SE_PRECONDITION2(ok, false, "Converting method name failed!");

        ok = seval_to_std_string(args[2], &methodSig);
        SE_PRECONDITION2(ok, false, "Converting method signature failed!");

        JavaScriptJavaBridge::CallInfo call(clsName.c_str(), methodName.c_str(), methodSig.c_str());
        if (call.isValid() && call.getArgumentsCount() == (argc - 3)) {
            int                  count = argc - 3;
            auto *               jargs = new jvalue[count];
            std::vector<jobject> toReleaseObjects;
            for (int i = 0; i < count; ++i) {
                int index = i + 3;
                switch (call.argumentTypeAtIndex(i)) {
                    case JavaScriptJavaBridge::ValueType::INTEGER: {
                        int integer = 0;
                        seval_to_int32(args[index], &integer);
                        jargs[i].i = integer;
                        break;
                    }
                    case JavaScriptJavaBridge::ValueType::LONG: {
                        int64_t longVal = 0L;
                        sevalue_to_native(args[index], &longVal, nullptr);
                        jargs[i].j = longVal;
                        break;
                    }
                    case JavaScriptJavaBridge::ValueType::FLOAT: {
                        float floatNumber = 0.0F;
                        seval_to_float(args[index], &floatNumber);
                        jargs[i].f = floatNumber;
                        break;
                    }
                    case JavaScriptJavaBridge::ValueType::BOOLEAN: {
                        jargs[i].z = args[index].isBoolean() && args[index].toBoolean() ? JNI_TRUE : JNI_FALSE;
                        break;
                    }
                    case JavaScriptJavaBridge::ValueType::STRING: {
                        const auto &arg = args[index];
                        if (arg.isNull() || arg.isUndefined()) {
                            jargs[i].l = nullptr;
                        } else {
                            std::string str;
                            seval_to_std_string(args[index], &str);
                            jargs[i].l = call.getEnv()->NewStringUTF(str.c_str());
                            toReleaseObjects.push_back(jargs[i].l);
                        }

                        break;
                    }
                    default:
                        SE_REPORT_ERROR("Unsupport type of parameter %d", i);
                        break;
                }
            }
            ok = call.executeWithArgs(jargs);
            for (const auto &obj : toReleaseObjects) {
                ccDeleteLocalRef(call.getEnv(), obj);
            }
            delete[] jargs;
            int errorCode = call.getErrorCode();
            if (!ok || errorCode < 0) {
                call.tryThrowJSException();
                SE_REPORT_ERROR("js_JSJavaBridge : call result code: %d", errorCode);
                return false;
            }

            JavaScriptJavaBridge::convertReturnValue(call.getReturnValue(), call.getReturnValueType(), &s.rval());
            return true;
        }
        call.tryThrowJSException();
        SE_REPORT_ERROR("call valid: %d, call.getArgumentsCount()= %d", call.isValid(), call.getArgumentsCount());
        return false;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting >=3", argc);
    return false;
}
SE_BIND_FUNC(JavaScriptJavaBridge_callStaticMethod)

bool register_javascript_java_bridge(se::Object *obj) { //NOLINT(readability-identifier-naming)
    se::Class *cls = se::Class::create("JavascriptJavaBridge", obj, nullptr, _SE(JavaScriptJavaBridge_constructor));
    cls->defineFinalizeFunction(_SE(JavaScriptJavaBridge_finalize));

    cls->defineFunction("callStaticMethod", _SE(JavaScriptJavaBridge_callStaticMethod));

    cls->install();
    __jsb_JavaScriptJavaBridge_class = cls;

    se::ScriptEngine::getInstance()->clearException();

    return true;
}
