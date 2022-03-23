/****************************************************************************
 Copyright (c) 2010-2012 cc-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include <jni.h>
#include <functional>
#include "base/std/container/string.h"
#include "base/Log.h"
#include "base/Macros.h"
#include "base/std/container/unordered_map.h"
#include "base/std/container/vector.h"
#include "math/Vec3.h"

//The macro must be used this way to find the native method. The principle is not well understood.
#define JNI_METHOD2(CLASS2, FUNC2) Java_##CLASS2##_##FUNC2
#define JNI_METHOD1(CLASS1, FUNC1) JNI_METHOD2(CLASS1, FUNC1)

// ccDeleteLocalRef with classid produces warning??
#if 0
    #define ccDeleteLocalRef(jenv, ref)                                                                    \
        do {                                                                                               \
            jenv->DeleteLocalRef(ref);                                                                     \
            CC_LOG_DEBUG("deleteLocalRef file: %s, func: %s, line: %d", __FILE__, __FUNCTION__, __LINE__); \
        } while (0)
#else
    #define ccDeleteLocalRef(jenv, ref) jenv->DeleteLocalRef(ref); //NOLINT
#endif
#define CLEAR_EXCEPTON(env)           \
    do {                              \
        if (env->ExceptionCheck()) {  \
            env->ExceptionDescribe(); \
            env->ExceptionClear();    \
        }                             \
    } while (false)

struct android_app;

namespace cc {

using JniMethodInfo = struct JniMethodInfo_ { //NOLINT(readability-identifier-naming)
    JNIEnv *  env;
    jclass    classID;
    jmethodID methodID;
};

class CC_DLL JniHelper {
public:
    using LocalRefMapType = ccstd::unordered_map<JNIEnv *, ccstd::vector<jobject>>;

    static JavaVM *getJavaVM();
    static JNIEnv *getEnv();
    static jobject getActivity();
    static void    init(JNIEnv *env, jobject activity);

    //NOLINTNEXTLINE
    static bool getStaticMethodInfo(JniMethodInfo &methodInfo,
                                    const char *   className,
                                    const char *   methodName,
                                    const char *   paramCode);

    //NOLINTNEXTLINE
    static bool getMethodInfo(JniMethodInfo &methodInfo,
                              const char *   className,
                              const char *   methodName,
                              const char *   paramCode);

    static ccstd::string jstring2string(jstring str);

    static jmethodID             loadclassMethodMethodId;
    static jobject               classloader;
    static std::function<void()> classloaderCallback;

    template <typename... Ts>
    static jobject newObject(const ccstd::string &className, Ts... xs) {
        jobject            ret        = nullptr;
        static const char *methodName = "<init>";
        cc::JniMethodInfo  t;
        ccstd::string        signature = "(" + ccstd::string(getJNISignature(xs...)) + ")V";
        if (cc::JniHelper::getMethodInfo(t, className.c_str(), methodName, signature.c_str())) {
            LocalRefMapType localRefs;
            ret = t.env->NewObject(t.classID, t.methodID, convert(&localRefs, &t, xs)...);
#ifndef __OHOS__
            ccDeleteLocalRef(t.env, t.classID);
#endif
            deleteLocalRefs(t.env, &localRefs);
        } else {
            reportError(className, methodName, signature);
        }
        return ret;
    }

    template <typename... Ts>
    static void callObjectVoidMethod(jobject            object,
                                     const ccstd::string &className,
                                     const ccstd::string &methodName,
                                     Ts... xs) {
        cc::JniMethodInfo t;
        ccstd::string       signature = "(" + ccstd::string(getJNISignature(xs...)) + ")V";
        if (cc::JniHelper::getMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            t.env->CallVoidMethod(object, t.methodID, convert(&localRefs, &t, xs)...);
#ifndef __OHOS__
            ccDeleteLocalRef(t.env, t.classID);
#endif
            CLEAR_EXCEPTON(t.env);
            deleteLocalRefs(t.env, &localRefs);
        } else {
            reportError(className, methodName, signature);
        }
    }

    template <typename... Ts>
    static float callObjectFloatMethod(jobject            object,
                                       const ccstd::string &className,
                                       const ccstd::string &methodName,
                                       Ts... xs) {
        float             ret = 0.0F;
        cc::JniMethodInfo t;
        ccstd::string       signature = "(" + ccstd::string(getJNISignature(xs...)) + ")F";
        if (cc::JniHelper::getMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            ret = t.env->CallFloatMethod(object, t.methodID, convert(&localRefs, &t, xs)...);
#ifndef __OHOS__
            ccDeleteLocalRef(t.env, t.classID);
#endif
            CLEAR_EXCEPTON(t.env);
            deleteLocalRefs(t.env, &localRefs);
        } else {
            reportError(className, methodName, signature);
        }
        return ret;
    }

    template <typename... Ts>
    static jbyteArray callObjectByteArrayMethod(jobject            object,
                                                const ccstd::string &className,
                                                const ccstd::string &methodName,
                                                Ts... xs) {
        jbyteArray        ret = nullptr;
        cc::JniMethodInfo t;
        ccstd::string       signature = "(" + ccstd::string(getJNISignature(xs...)) + ")[B";
        if (cc::JniHelper::getMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            ret = static_cast<jbyteArray>(t.env->CallObjectMethod(object, t.methodID, convert(&localRefs, &t, xs)...));
#ifndef __OHOS__
            ccDeleteLocalRef(t.env, t.classID);
#endif
            CLEAR_EXCEPTON(t.env);
            deleteLocalRefs(t.env, &localRefs);
        } else {
            reportError(className, methodName, signature);
        }
        return ret;
    }

    template <typename... Ts>
    static void callStaticVoidMethod(const ccstd::string &className,
                                     const ccstd::string &methodName,
                                     Ts... xs) {
        cc::JniMethodInfo t;
        ccstd::string       signature = "(" + ccstd::string(getJNISignature(xs...)) + ")V";
        if (cc::JniHelper::getStaticMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            t.env->CallStaticVoidMethod(t.classID, t.methodID, convert(&localRefs, &t, xs)...);
#ifndef __OHOS__
            ccDeleteLocalRef(t.env, t.classID);
#endif
            CLEAR_EXCEPTON(t.env);
            deleteLocalRefs(t.env, &localRefs);
        } else {
            reportError(className, methodName, signature);
        }
    }

    template <typename... Ts>
    static bool callStaticBooleanMethod(const ccstd::string &className,
                                        const ccstd::string &methodName,
                                        Ts... xs) {
        jboolean          jret = JNI_FALSE;
        cc::JniMethodInfo t;
        ccstd::string       signature = "(" + ccstd::string(getJNISignature(xs...)) + ")Z";
        if (cc::JniHelper::getStaticMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            jret = t.env->CallStaticBooleanMethod(t.classID, t.methodID, convert(&localRefs, &t, xs)...);
#ifndef __OHOS__
            ccDeleteLocalRef(t.env, t.classID);
#endif
            CLEAR_EXCEPTON(t.env);
            deleteLocalRefs(t.env, &localRefs);
        } else {
            reportError(className, methodName, signature);
        }
        return (jret == JNI_TRUE);
    }

    template <typename... Ts>
    static int callStaticIntMethod(const ccstd::string &className,
                                   const ccstd::string &methodName,
                                   Ts... xs) {
        jint              ret = 0;
        cc::JniMethodInfo t;
        ccstd::string       signature = "(" + ccstd::string(getJNISignature(xs...)) + ")I";
        if (cc::JniHelper::getStaticMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            ret = t.env->CallStaticIntMethod(t.classID, t.methodID, convert(&localRefs, &t, xs)...);
#ifndef __OHOS__
            ccDeleteLocalRef(t.env, t.classID);
#endif
            CLEAR_EXCEPTON(t.env);
            deleteLocalRefs(t.env, &localRefs);
        } else {
            reportError(className, methodName, signature);
        }
        return ret;
    }

    template <typename... Ts>
    static float callStaticFloatMethod(const ccstd::string &className,
                                       const ccstd::string &methodName,
                                       Ts... xs) {
        jfloat            ret = 0.0;
        cc::JniMethodInfo t;
        ccstd::string       signature = "(" + ccstd::string(getJNISignature(xs...)) + ")F";
        if (cc::JniHelper::getStaticMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            ret = t.env->CallStaticFloatMethod(t.classID, t.methodID, convert(&localRefs, &t, xs)...);
#ifndef __OHOS__
            ccDeleteLocalRef(t.env, t.classID);
#endif
            CLEAR_EXCEPTON(t.env);
            deleteLocalRefs(t.env, &localRefs);
        } else {
            reportError(className, methodName, signature);
        }
        return ret;
    }

    template <typename... Ts>
    static float *callStaticFloatArrayMethod(const ccstd::string &className,
                                             const ccstd::string &methodName,
                                             Ts... xs) {
        static float      ret[32];
        cc::JniMethodInfo t;
        ccstd::string       signature = "(" + ccstd::string(getJNISignature(xs...)) + ")[F";
        if (cc::JniHelper::getStaticMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            auto *          array = static_cast<jfloatArray>(t.env->CallStaticObjectMethod(t.classID, t.methodID, convert(&localRefs, &t, xs)...));
            CLEAR_EXCEPTON(t.env);
            jsize len = t.env->GetArrayLength(array);
            if (len <= 32) {
                jfloat *elems = t.env->GetFloatArrayElements(array, nullptr);
                if (elems) {
                    memcpy(ret, elems, sizeof(float) * len);
                    t.env->ReleaseFloatArrayElements(array, elems, 0);
                };
            }
            CLEAR_EXCEPTON(t.env);
#ifndef __OHOS__
            ccDeleteLocalRef(t.env, t.classID);
#endif
            ccDeleteLocalRef(t.env, array);
            deleteLocalRefs(t.env, &localRefs);
            return &ret[0];
        }
        reportError(className, methodName, signature);
        return nullptr;
    }

    template <typename... Ts>
    static Vec3 callStaticVec3Method(const ccstd::string &className,
                                     const ccstd::string &methodName,
                                     Ts... xs) {
        Vec3              ret;
        cc::JniMethodInfo t;
        ccstd::string       signature = "(" + ccstd::string(getJNISignature(xs...)) + ")[F";
        if (cc::JniHelper::getStaticMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            auto *          array = static_cast<jfloatArray>(t.env->CallStaticObjectMethod(t.classID, t.methodID, convert(&localRefs, &t, xs)...));
            CLEAR_EXCEPTON(t.env);
            jsize len = t.env->GetArrayLength(array);
            if (len == 3) {
                jfloat *elems = t.env->GetFloatArrayElements(array, nullptr);
                ret.x         = elems[0];
                ret.y         = elems[1];
                ret.z         = elems[2];
                t.env->ReleaseFloatArrayElements(array, elems, 0);
            }
            CLEAR_EXCEPTON(t.env);
#ifndef __OHOS__
            ccDeleteLocalRef(t.env, t.classID);
#endif
            ccDeleteLocalRef(t.env, array);
            deleteLocalRefs(t.env, &localRefs);
        } else {
            reportError(className, methodName, signature);
        }
        return ret;
    }

    template <typename... Ts>
    static double callStaticDoubleMethod(const ccstd::string &className,
                                         const ccstd::string &methodName,
                                         Ts... xs) {
        jdouble           ret = 0.0;
        cc::JniMethodInfo t;
        ccstd::string       signature = "(" + ccstd::string(getJNISignature(xs...)) + ")D";
        if (cc::JniHelper::getStaticMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            ret = t.env->CallStaticDoubleMethod(t.classID, t.methodID, convert(&localRefs, &t, xs)...);
            CLEAR_EXCEPTON(t.env);
#ifndef __OHOS__
            ccDeleteLocalRef(t.env, t.classID);
#endif
            deleteLocalRefs(t.env, &localRefs);
        } else {
            reportError(className, methodName, signature);
        }
        return ret;
    }

    template <typename... Ts>
    static ccstd::string callStaticStringMethod(const ccstd::string &className,
                                              const ccstd::string &methodName,
                                              Ts... xs) {
        ccstd::string ret;

        cc::JniMethodInfo t;
        ccstd::string       signature = "(" + ccstd::string(getJNISignature(xs...)) + ")Ljava/lang/String;";
        if (cc::JniHelper::getStaticMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            auto *          jret = static_cast<jstring>(t.env->CallStaticObjectMethod(t.classID, t.methodID, convert(&localRefs, &t, xs)...));
            CLEAR_EXCEPTON(t.env);
            ret = cc::JniHelper::jstring2string(jret);
            ccDeleteLocalRef(t.env, jret);
            deleteLocalRefs(t.env, &localRefs);
        } else {
            reportError(className, methodName, signature);
        }
        return ret;
    }
    static bool setClassLoaderFrom(jobject activityInstance);

private:
    static jobject sActivity;
    static JavaVM *sJavaVM;

    static JNIEnv *cacheEnv();
    //NOLINTNEXTLINE
    static bool getMethodInfoDefaultClassLoader(JniMethodInfo &methodinfo,
                                                const char *   className,
                                                const char *   methodName,
                                                const char *   paramCode);

    static jstring convert(LocalRefMapType *localRefs, cc::JniMethodInfo *t, const char *x);

    static jstring convert(LocalRefMapType *localRefs, cc::JniMethodInfo *t, const ccstd::string &x);

    template <typename T>
    static T convert(LocalRefMapType * /*localRefs*/, cc::JniMethodInfo * /*t*/, T x) {
        return x;
    }

    static void deleteLocalRefs(JNIEnv *env, LocalRefMapType *localRefs);

    static ccstd::string getJNISignature() {
        return "";
    }

    static ccstd::string getJNISignature(bool /*unused*/) {
        return "Z";
    }

    static ccstd::string getJNISignature(char /*unused*/) {
        return "C";
    }

    static ccstd::string getJNISignature(int16_t /*unused*/) {
        return "S";
    }

    static ccstd::string getJNISignature(int32_t /*unused*/) {
        return "I";
    }

    static ccstd::string getJNISignature(int64_t /*unused*/) {
        return "J";
    }

    static ccstd::string getJNISignature(float /*unused*/) {
        return "F";
    }

    static ccstd::string getJNISignature(double /*unused*/) {
        return "D";
    }

    static ccstd::string getJNISignature(jbyteArray /*unused*/) {
        return "[B";
    }

    static ccstd::string getJNISignature(jintArray /*unused*/) {
        return "[I";
    }

    static ccstd::string getJNISignature(const char * /*unused*/) {
        return "Ljava/lang/String;";
    }

    static ccstd::string getJNISignature(const ccstd::string & /*unused*/) {
        return "Ljava/lang/String;";
    }

    template <typename T>
    static ccstd::string getJNISignature(T x) {
        // This template should never be instantiated
        static_assert(sizeof(x) == 0, "Unsupported argument type");
        return "";
    }

    template <typename T, typename... Ts>
    static ccstd::string getJNISignature(T x, Ts... xs) {
        return getJNISignature(x) + getJNISignature(xs...);
    }

    static void reportError(const ccstd::string &className, const ccstd::string &methodName, const ccstd::string &signature);
};

} // namespace cc
