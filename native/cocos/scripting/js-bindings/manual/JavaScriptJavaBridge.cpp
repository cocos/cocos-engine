/*
 * Copyright (c) 2013-2016 Chukong Technologies Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

#include "scripting/js-bindings/manual/JavaScriptJavaBridge.h"
#include "platform/android/jni/JniHelper.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/base/ccUTF8.h"

#include <android/log.h>
#include <vector>
#include <string>

#ifdef LOG_TAG
#undef LOG_TAG
#endif

#define LOG_TAG "JavaScriptJavaBridge"

extern "C" {

JNIEXPORT jint JNICALL Java_org_cocos2dx_lib_Cocos2dxJavascriptJavaBridge_evalString
        (JNIEnv *env, jclass cls, jstring value)
{
    se::AutoHandleScope hs;
    bool strFlag = false;
    std::string strValue = cocos2d::StringUtils::getStringUTFCharsJNI(env, value, &strFlag);
    if (!strFlag)
    {
        CCLOG("Cocos2dxJavaScriptJavaBridge_evalString error, invalid string code");
        return 0;
    }
    se::ScriptEngine::getInstance()->executeScriptBuffer(strValue.c_str());
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

class JavaScriptJavaBridge
{
public:
    typedef enum : char
    {
        TypeInvalid = -1,
        TypeVoid    = 0,
        TypeInteger = 1,
        TypeFloat   = 2,
        TypeBoolean = 3,
        TypeString  = 4,
        TypeVector  = 5,
        TypeFunction= 6,
    } ValueType;

    typedef std::vector<ValueType> ValueTypes;

    typedef union
    {
        int     intValue;
        float   floatValue;
        int     boolValue;
        std::string *stringValue;
    } ReturnValue;

    class CallInfo
    {
    public:
        CallInfo(const char *className, const char *methodName, const char *methodSig)
        : m_valid(false)
        , m_error(JSJ_ERR_OK)
        , m_className(className)
        , m_methodName(methodName)
        , m_methodSig(methodSig)
        , m_returnType(TypeVoid)
        , m_argumentsCount(0)
        , m_retjstring(NULL)
        , m_env(NULL)
        , m_classID(NULL)
        , m_methodID(NULL)
        {
            memset(&m_ret, 0, sizeof(m_ret));
            m_valid =  validateMethodSig() && getMethodInfo();
        }
        ~CallInfo();

        bool isValid() {
            return m_valid;
        }

        int getErrorCode() {
            return m_error;
        }

        JNIEnv *getEnv() {
            return m_env;
        }

        int argumentTypeAtIndex(size_t index) {
            return m_argumentsType.at(index);
        }

        int getArgumentsCount(){
            return m_argumentsCount;
        }

        ValueType getReturnValueType(){
            return m_returnType;
        }

        ReturnValue getReturnValue(){
            return m_ret;
        }

        bool execute();
        bool executeWithArgs(jvalue *args);


    private:
        bool        m_valid;
        int         m_error;

        std::string      m_className;
        std::string      m_methodName;
        std::string      m_methodSig;
        int         m_argumentsCount;
        ValueTypes  m_argumentsType;
        ValueType   m_returnType;

        ReturnValue m_ret;
        jstring     m_retjstring;

        JNIEnv     *m_env;
        jclass      m_classID;
        jmethodID   m_methodID;

        bool validateMethodSig();
        bool getMethodInfo();
        ValueType checkType(const std::string& sig, size_t *pos);
    };

    static bool convertReturnValue(ReturnValue retValue, ValueType type, se::Value* ret);
};

JavaScriptJavaBridge::CallInfo::~CallInfo()
{
    if (m_returnType == TypeString && m_ret.stringValue)
    {
        delete m_ret.stringValue;
    }
}

bool JavaScriptJavaBridge::CallInfo::execute()
{
    switch (m_returnType)
    {
        case JavaScriptJavaBridge::TypeVoid:
            m_env->CallStaticVoidMethod(m_classID, m_methodID);
            break;

        case JavaScriptJavaBridge::TypeInteger:
            m_ret.intValue = m_env->CallStaticIntMethod(m_classID, m_methodID);
            break;

        case JavaScriptJavaBridge::TypeFloat:
            m_ret.floatValue = m_env->CallStaticFloatMethod(m_classID, m_methodID);
            break;

        case JavaScriptJavaBridge::TypeBoolean:
            m_ret.boolValue = m_env->CallStaticBooleanMethod(m_classID, m_methodID);
            break;

        case JavaScriptJavaBridge::TypeString:
        {
            m_retjstring = (jstring)m_env->CallStaticObjectMethod(m_classID, m_methodID);
            std::string strValue = cocos2d::StringUtils::getStringUTFCharsJNI(m_env, m_retjstring);

            m_ret.stringValue = new std::string(strValue);
            break;
        }

        default:
            m_error = JSJ_ERR_TYPE_NOT_SUPPORT;
            LOGD("Return type '%d' is not supported", static_cast<int>(m_returnType));
            return false;
    }

    if (m_env->ExceptionCheck() == JNI_TRUE)
    {
        m_env->ExceptionDescribe();
        m_env->ExceptionClear();
        m_error = JSJ_ERR_EXCEPTION_OCCURRED;
        return false;
    }

    return true;
}


bool JavaScriptJavaBridge::CallInfo::executeWithArgs(jvalue *args)
{
    switch (m_returnType)
    {
        case JavaScriptJavaBridge::TypeVoid:
            m_env->CallStaticVoidMethodA(m_classID, m_methodID, args);
            break;

        case JavaScriptJavaBridge::TypeInteger:
            m_ret.intValue = m_env->CallStaticIntMethodA(m_classID, m_methodID, args);
            break;

        case JavaScriptJavaBridge::TypeFloat:
            m_ret.floatValue = m_env->CallStaticFloatMethodA(m_classID, m_methodID, args);
            break;

        case JavaScriptJavaBridge::TypeBoolean:
            m_ret.boolValue = m_env->CallStaticBooleanMethodA(m_classID, m_methodID, args);
            break;

        case JavaScriptJavaBridge::TypeString:
        {
            m_retjstring = (jstring)m_env->CallStaticObjectMethodA(m_classID, m_methodID, args);
            std::string strValue = cocos2d::StringUtils::getStringUTFCharsJNI(m_env, m_retjstring);
            m_ret.stringValue = new std::string(strValue);
            break;
        }

        default:
            m_error = JSJ_ERR_TYPE_NOT_SUPPORT;
            LOGD("Return type '%d' is not supported", static_cast<int>(m_returnType));
            return false;
    }

    if (m_env->ExceptionCheck() == JNI_TRUE)
    {
        m_env->ExceptionDescribe();
        m_env->ExceptionClear();
        m_error = JSJ_ERR_EXCEPTION_OCCURRED;
        return false;
    }

    return true;
}

bool JavaScriptJavaBridge::CallInfo::validateMethodSig()
{
    size_t len = m_methodSig.length();
    if (len < 3 || m_methodSig[0] != '(') // min sig is "()V"
    {
        m_error = JSJ_ERR_INVALID_SIGNATURES;
        return false;
    }

    size_t pos = 1;
    while (pos < len && m_methodSig[pos] != ')')
    {
        JavaScriptJavaBridge::ValueType type = checkType(m_methodSig, &pos);
        if (type == TypeInvalid) return false;

        m_argumentsCount++;
        m_argumentsType.push_back(type);
        pos++;
    }

    if (pos >= len || m_methodSig[pos] != ')')
    {
        m_error = JSJ_ERR_INVALID_SIGNATURES;
        return false;
    }

    pos++;
    m_returnType = checkType(m_methodSig, &pos);
    return true;
}

JavaScriptJavaBridge::ValueType JavaScriptJavaBridge::CallInfo::checkType(const std::string& sig, size_t *pos)
{
    switch (sig[*pos])
    {
        case 'I':
            return JavaScriptJavaBridge::TypeInteger;
        case 'F':
            return JavaScriptJavaBridge::TypeFloat;
        case 'Z':
            return JavaScriptJavaBridge::TypeBoolean;
        case 'V':
            return JavaScriptJavaBridge::TypeVoid;
        case 'L':
            size_t pos2 = sig.find_first_of(';', *pos + 1);
            if (pos2 == std::string::npos)
            {
                m_error = JSJ_ERR_INVALID_SIGNATURES;
                return TypeInvalid;
            }

            const std::string t = sig.substr(*pos, pos2 - *pos + 1);
            if (t.compare("Ljava/lang/String;") == 0)
            {
                *pos = pos2;
                return TypeString;
            }
            else if (t.compare("Ljava/util/Vector;") == 0)
            {
                *pos = pos2;
                return TypeVector;
            }
            else
            {
                m_error = JSJ_ERR_TYPE_NOT_SUPPORT;
                return TypeInvalid;
            }
    }

    m_error = JSJ_ERR_TYPE_NOT_SUPPORT;
    return TypeInvalid;
}


bool JavaScriptJavaBridge::CallInfo::getMethodInfo()
{
    m_methodID = 0;
    m_env = 0;

    JavaVM* jvm = cocos2d::JniHelper::getJavaVM();
    jint ret = jvm->GetEnv((void**)&m_env, JNI_VERSION_1_4);
    switch (ret) {
        case JNI_OK:
            break;

        case JNI_EDETACHED :
            if (jvm->AttachCurrentThread(&m_env, NULL) < 0)
            {
                LOGD("%s", "Failed to get the environment using AttachCurrentThread()");
                m_error = JSJ_ERR_VM_THREAD_DETACHED;
                return false;
            }
            break;

        case JNI_EVERSION :
        default :
            LOGD("%s", "Failed to get the environment using GetEnv()");
            m_error = JSJ_ERR_VM_FAILURE;
            return false;
    }
    jstring _jstrClassName = m_env->NewStringUTF(m_className.c_str());
    m_classID = (jclass) m_env->CallObjectMethod(cocos2d::JniHelper::classloader,
                                                 cocos2d::JniHelper::loadclassMethod_methodID,
                                                 _jstrClassName);

    if (NULL == m_classID) {
        LOGD("Classloader failed to find class of %s", m_className.c_str());
    }

    m_env->DeleteLocalRef(_jstrClassName);
    m_methodID = m_env->GetStaticMethodID(m_classID, m_methodName.c_str(), m_methodSig.c_str());
    if (!m_methodID)
    {
        m_env->ExceptionClear();
        LOGD("Failed to find method id of %s.%s %s",
             m_className.c_str(),
             m_methodName.c_str(),
             m_methodSig.c_str());
        m_error = JSJ_ERR_METHOD_NOT_FOUND;
        return false;
    }

    return true;
}

bool JavaScriptJavaBridge::convertReturnValue(ReturnValue retValue, ValueType type, se::Value* ret)
{
    if (ret == nullptr)
        return false;

    switch (type)
    {
        case JavaScriptJavaBridge::TypeInteger:
            ret->setInt32(retValue.intValue);
            break;
        case JavaScriptJavaBridge::TypeFloat:
            ret->setFloat(retValue.floatValue);
            break;
        case JavaScriptJavaBridge::TypeBoolean:
            ret->setBoolean(retValue.boolValue);
            break;
        case JavaScriptJavaBridge::TypeString:
            ret->setString(*retValue.stringValue);
            break;
        default:
            return false;
    }

    return true;
}

se::Class* __jsb_JavaScriptJavaBridge_class = nullptr;

static bool JavaScriptJavaBridge_finalize(se::State& s)
{
    JavaScriptJavaBridge* cobj = (JavaScriptJavaBridge*)s.nativeThisObject();
    delete cobj;
    return true;
}
SE_BIND_FINALIZE_FUNC(JavaScriptJavaBridge_finalize)

static bool JavaScriptJavaBridge_constructor(se::State& s)
{
    JavaScriptJavaBridge* cobj = new (std::nothrow) JavaScriptJavaBridge();
    s.thisObject()->setPrivateData(cobj);
    s.thisObject()->addRef(); //FIXME: remove this
    return true;
}
SE_BIND_CTOR(JavaScriptJavaBridge_constructor, __jsb_JavaScriptJavaBridge_class, JavaScriptJavaBridge_finalize)

static bool JavaScriptJavaBridge_callStaticMethod(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 3)
    {
        bool ok = false;
        std::string clsName, methodName, methodSig;
        ok = seval_to_std_string(args[0], &clsName);
        JSB_PRECONDITION2(ok, false, "Converting class name failed!");

        ok = seval_to_std_string(args[1], &methodName);
        JSB_PRECONDITION2(ok, false, "Converting method name failed!");

        ok = seval_to_std_string(args[2], &methodSig);
        JSB_PRECONDITION2(ok, false, "Converting method signature failed!");

        JavaScriptJavaBridge::CallInfo call(clsName.c_str(), methodName.c_str(), methodSig.c_str());
        if (call.isValid())
        {
            ok = call.execute();
            int errorCode = call.getErrorCode();
            if (!ok || errorCode < 0)
            {
                SE_REPORT_ERROR("call result code: %d", call.getErrorCode());
                return false;
            }
            ok = JavaScriptJavaBridge::convertReturnValue(call.getReturnValue(), call.getReturnValueType(), &s.rval());
            return ok;
        }
        SE_REPORT_ERROR("JavaScriptJavaBridge::CallInfo isn't valid!");
        return false;
    }
    else if (argc > 3)
    {
        bool ok = false;
        std::string clsName, methodName, methodSig;
        ok = seval_to_std_string(args[0], &clsName);
        JSB_PRECONDITION2(ok, false, "Converting class name failed!");

        ok = seval_to_std_string(args[1], &methodName);
        JSB_PRECONDITION2(ok, false, "Converting method name failed!");

        ok = seval_to_std_string(args[2], &methodSig);
        JSB_PRECONDITION2(ok, false, "Converting method signature failed!");

        JavaScriptJavaBridge::CallInfo call(clsName.c_str(), methodName.c_str(), methodSig.c_str());
        if (call.isValid() && call.getArgumentsCount() == (argc - 3))
        {
            int count = argc - 3;
            jvalue* jargs = new jvalue[count];
            for (int i = 0; i < count; ++i)
            {
                int index = i + 3;
                switch (call.argumentTypeAtIndex(i))
                {
                    case JavaScriptJavaBridge::TypeInteger:
                    {
                        int integer = 0;
                        seval_to_int32(args[index], &integer);
                        jargs[i].i = integer;
                        break;
                    }
                    case JavaScriptJavaBridge::TypeFloat:
                    {
                        float floatNumber = 0.0f;
                        seval_to_float(args[index], &floatNumber);
                        jargs[i].f = floatNumber;
                        break;
                    }
                    case JavaScriptJavaBridge::TypeBoolean:
                    {
                        jargs[i].z = args[index].isBoolean() && args[index].toBoolean() ? JNI_TRUE : JNI_FALSE;
                        break;
                    }
                    case JavaScriptJavaBridge::TypeString:
                    default:
                        std::string str;
                        seval_to_std_string(args[index], &str);
                        jargs[i].l = call.getEnv()->NewStringUTF(str.c_str());
                        break;
                }
            }
            ok = call.executeWithArgs(jargs);
            if (jargs)
                delete[] jargs;
            int errorCode = call.getErrorCode();
            if (!ok || errorCode < 0)
            {
                SE_REPORT_ERROR("js_cocos2dx_JSJavaBridge : call result code: %d", errorCode);
                return false;
            }

            ok = JavaScriptJavaBridge::convertReturnValue(call.getReturnValue(), call.getReturnValueType(), &s.rval());
            return ok;
        }
        SE_REPORT_ERROR("call valid: %d, call.getArgumentsCount()= %d", call.isValid(), call.getArgumentsCount());
        return false;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting >=3", argc);
    return false;
}
SE_BIND_FUNC(JavaScriptJavaBridge_callStaticMethod)

bool register_javascript_java_bridge(se::Object* obj)
{
    se::Class* cls = se::Class::create("JavascriptJavaBridge", obj, nullptr, _SE(JavaScriptJavaBridge_constructor));
    cls->defineFinalizedFunction(_SE(JavaScriptJavaBridge_finalize));

    cls->defineFunction("callStaticMethod", _SE(JavaScriptJavaBridge_callStaticMethod));

    cls->install();
    __jsb_JavaScriptJavaBridge_class = cls;

    se::ScriptEngine::getInstance()->clearException();

    return true;
}

