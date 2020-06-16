/****************************************************************************
Copyright (c) 2010-2012 cc-x.org
Copyright (c) 2013-2016 Chukong Technologies Inc.
Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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
#ifndef __ANDROID_JNI_HELPER_H__
#define __ANDROID_JNI_HELPER_H__

#include <jni.h>
#include <string>
#include <vector>
#include <unordered_map>
#include <functional>
#include "base/ccMacros.h"
#include "math/Vec3.h"

//The macro must be used this way to find the native method. The principle is not well understood.
#define JNI_METHOD2(CLASS2,FUNC2) Java_##CLASS2##_##FUNC2
#define JNI_METHOD1(CLASS1,FUNC1) JNI_METHOD2(CLASS1,FUNC1)

struct android_app;

namespace cc {

typedef struct JniMethodInfo_
{
    JNIEnv *    env;
    jclass      classID;
    jmethodID   methodID;
} JniMethodInfo;

class CC_DLL JniHelper
{
public:
    typedef std::unordered_map<JNIEnv*, std::vector<jobject>> LocalRefMapType;

    static JavaVM* getJavaVM();
    static JNIEnv* getEnv();
    static jobject getActivity();
    static void setAndroidApp(android_app* app);
    static android_app* getAndroidApp();

    static bool getStaticMethodInfo(JniMethodInfo &methodinfo,
                                    const char *className,
                                    const char *methodName,
                                    const char *paramCode);
    static bool getMethodInfo(JniMethodInfo &methodinfo,
                              const char *className,
                              const char *methodName,
                              const char *paramCode);

    static std::string jstring2string(jstring str);

    static jmethodID loadclassMethod_methodID;
    static jobject classloader;
    static std::function<void()> classloaderCallback;

    template <typename... Ts>
    static jobject newObject(const std::string& className, Ts... xs)
    {
        jobject ret = nullptr;
        static const char* methodName = "<init>";
        cc::JniMethodInfo t;
        std::string signature = "(" + std::string(getJNISignature(xs...)) + ")V";
        if (cc::JniHelper::getMethodInfo(t, className.c_str(), methodName, signature.c_str())) {
            LocalRefMapType localRefs;
            ret = t.env->NewObject(t.classID, t.methodID, convert(localRefs, t, xs)...);
            t.env->DeleteLocalRef(t.classID);
            deleteLocalRefs(t.env, localRefs);
        } else {
            reportError(className, methodName, signature);
        }
        return ret;
    }

    template <typename... Ts>
    static void callObjectVoidMethod(jobject object,
                                     const std::string& className,
                                     const std::string& methodName,
                                     Ts... xs) {
        cc::JniMethodInfo t;
        std::string signature = "(" + std::string(getJNISignature(xs...)) + ")V";
        if (cc::JniHelper::getMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            t.env->CallVoidMethod(object, t.methodID, convert(localRefs, t, xs)...);
            t.env->DeleteLocalRef(t.classID);
            deleteLocalRefs(t.env, localRefs);
        } else {
            reportError(className, methodName, signature);
        }
    }

    template <typename... Ts>
    static float callObjectFloatMethod(jobject object,
                                     const std::string& className,
                                     const std::string& methodName,
                                     Ts... xs) {
        float ret = 0.0f;
        cc::JniMethodInfo t;
        std::string signature = "(" + std::string(getJNISignature(xs...)) + ")F";
        if (cc::JniHelper::getMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            ret = t.env->CallFloatMethod(object, t.methodID, convert(localRefs, t, xs)...);
            t.env->DeleteLocalRef(t.classID);
            deleteLocalRefs(t.env, localRefs);
        } else {
            reportError(className, methodName, signature);
        }
        return ret;
    }

    template <typename... Ts>
    static jbyteArray callObjectByteArrayMethod(jobject object,
                                     const std::string& className,
                                     const std::string& methodName,
                                     Ts... xs) {
        jbyteArray ret = nullptr;
        cc::JniMethodInfo t;
        std::string signature = "(" + std::string(getJNISignature(xs...)) + ")[B";
        if (cc::JniHelper::getMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            ret = (jbyteArray)t.env->CallObjectMethod(object, t.methodID, convert(localRefs, t, xs)...);
            t.env->DeleteLocalRef(t.classID);
            deleteLocalRefs(t.env, localRefs);
        } else {
            reportError(className, methodName, signature);
        }
        return ret;
    }

    template <typename... Ts>
    static void callStaticVoidMethod(const std::string& className,
                                     const std::string& methodName,
                                     Ts... xs) {
        cc::JniMethodInfo t;
        std::string signature = "(" + std::string(getJNISignature(xs...)) + ")V";
        if (cc::JniHelper::getStaticMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            t.env->CallStaticVoidMethod(t.classID, t.methodID, convert(localRefs, t, xs)...);
            t.env->DeleteLocalRef(t.classID);
            deleteLocalRefs(t.env, localRefs);
        } else {
            reportError(className, methodName, signature);
        }
    }

    template <typename... Ts>
    static bool callStaticBooleanMethod(const std::string& className,
                                        const std::string& methodName,
                                        Ts... xs) {
        jboolean jret = JNI_FALSE;
        cc::JniMethodInfo t;
        std::string signature = "(" + std::string(getJNISignature(xs...)) + ")Z";
        if (cc::JniHelper::getStaticMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            jret = t.env->CallStaticBooleanMethod(t.classID, t.methodID, convert(localRefs, t, xs)...);
            t.env->DeleteLocalRef(t.classID);
            deleteLocalRefs(t.env, localRefs);
        } else {
            reportError(className, methodName, signature);
        }
        return (jret == JNI_TRUE);
    }

    template <typename... Ts>
    static int callStaticIntMethod(const std::string& className,
                                   const std::string& methodName,
                                   Ts... xs) {
        jint ret = 0;
        cc::JniMethodInfo t;
        std::string signature = "(" + std::string(getJNISignature(xs...)) + ")I";
        if (cc::JniHelper::getStaticMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            ret = t.env->CallStaticIntMethod(t.classID, t.methodID, convert(localRefs, t, xs)...);
            t.env->DeleteLocalRef(t.classID);
            deleteLocalRefs(t.env, localRefs);
        } else {
            reportError(className, methodName, signature);
        }
        return ret;
    }

    template <typename... Ts>
    static float callStaticFloatMethod(const std::string& className,
                                       const std::string& methodName,
                                       Ts... xs) {
        jfloat ret = 0.0;
        cc::JniMethodInfo t;
        std::string signature = "(" + std::string(getJNISignature(xs...)) + ")F";
        if (cc::JniHelper::getStaticMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            ret = t.env->CallStaticFloatMethod(t.classID, t.methodID, convert(localRefs, t, xs)...);
            t.env->DeleteLocalRef(t.classID);
            deleteLocalRefs(t.env, localRefs);
        } else {
            reportError(className, methodName, signature);
        }
        return ret;
    }

    template <typename... Ts>
    static float* callStaticFloatArrayMethod(const std::string& className,
                                       const std::string& methodName,
                                       Ts... xs) {
        static float ret[32];
        cc::JniMethodInfo t;
        std::string signature = "(" + std::string(getJNISignature(xs...)) + ")[F";
        if (cc::JniHelper::getStaticMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            jfloatArray array = (jfloatArray) t.env->CallStaticObjectMethod(t.classID, t.methodID, convert(localRefs, t, xs)...);
            jsize len = t.env->GetArrayLength(array);
            if (len <= 32) {
                jfloat* elems = t.env->GetFloatArrayElements(array, 0);
                if (elems) {
                    memcpy(ret, elems, sizeof(float) * len);
                    t.env->ReleaseFloatArrayElements(array, elems, 0);
                };
            }
            t.env->DeleteLocalRef(t.classID);
            deleteLocalRefs(t.env, localRefs);
            return &ret[0];
        } else {
            reportError(className, methodName, signature);
        }
        return nullptr;
    }

    template <typename... Ts>
    static Vec3 callStaticVec3Method(const std::string& className,
                                       const std::string& methodName,
                                       Ts... xs) {
        Vec3 ret;
        cc::JniMethodInfo t;
        std::string signature = "(" + std::string(getJNISignature(xs...)) + ")[F";
        if (cc::JniHelper::getStaticMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            jfloatArray array = (jfloatArray) t.env->CallStaticObjectMethod(t.classID, t.methodID, convert(localRefs, t, xs)...);
            jsize len = t.env->GetArrayLength(array);
            if (len == 3) {
                jfloat* elems = t.env->GetFloatArrayElements(array, 0);
                ret.x = elems[0];
                ret.y = elems[1];
                ret.z = elems[2];
                t.env->ReleaseFloatArrayElements(array, elems, 0);
            }
            t.env->DeleteLocalRef(t.classID);
            deleteLocalRefs(t.env, localRefs);
        } else {
            reportError(className, methodName, signature);
        }
        return ret;
    }

    template <typename... Ts>
    static double callStaticDoubleMethod(const std::string& className,
                                         const std::string& methodName,
                                         Ts... xs) {
        jdouble ret = 0.0;
        cc::JniMethodInfo t;
        std::string signature = "(" + std::string(getJNISignature(xs...)) + ")D";
        if (cc::JniHelper::getStaticMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            ret = t.env->CallStaticDoubleMethod(t.classID, t.methodID, convert(localRefs, t, xs)...);
            t.env->DeleteLocalRef(t.classID);
            deleteLocalRefs(t.env, localRefs);
        } else {
            reportError(className, methodName, signature);
        }
        return ret;
    }

    template <typename... Ts>
    static std::string callStaticStringMethod(const std::string& className,
                                              const std::string& methodName,
                                              Ts... xs) {
        std::string ret;

        cc::JniMethodInfo t;
        std::string signature = "(" + std::string(getJNISignature(xs...)) + ")Ljava/lang/String;";
        if (cc::JniHelper::getStaticMethodInfo(t, className.c_str(), methodName.c_str(), signature.c_str())) {
            LocalRefMapType localRefs;
            jstring jret = (jstring)t.env->CallStaticObjectMethod(t.classID, t.methodID, convert(localRefs, t, xs)...);
            ret = cc::JniHelper::jstring2string(jret);
            t.env->DeleteLocalRef(t.classID);
            t.env->DeleteLocalRef(jret);
            deleteLocalRefs(t.env, localRefs);
        } else {
            reportError(className, methodName, signature);
        }
        return ret;
    }
private:
    static jobject _activity;
    static android_app* _app;

    static JNIEnv* cacheEnv();
    static bool setClassLoaderFrom(jobject activityInstance);
    static bool getMethodInfo_DefaultClassLoader(JniMethodInfo &methodinfo,
                                                 const char *className,
                                                 const char *methodName,
                                                 const char *paramCode);

    static jstring convert(LocalRefMapType &localRefs, cc::JniMethodInfo& t, const char* x);

    static jstring convert(LocalRefMapType &localRefs, cc::JniMethodInfo& t, const std::string& x);

    template <typename T>
    static T convert(LocalRefMapType &localRefs, cc::JniMethodInfo&, T x) {
        return x;
    }

    static void deleteLocalRefs(JNIEnv* env, LocalRefMapType &localRefs);

    static std::string getJNISignature() {
        return "";
    }

    static std::string getJNISignature(bool) {
        return "Z";
    }

    static std::string getJNISignature(char) {
        return "C";
    }

    static std::string getJNISignature(short) {
        return "S";
    }

    static std::string getJNISignature(int) {
        return "I";
    }

    static std::string getJNISignature(long) {
        return "J";
    }

    static std::string getJNISignature(float) {
        return "F";
    }

    static std::string getJNISignature(double) {
        return "D";
    }

    static std::string getJNISignature(jbyteArray) {
        return "[B";
    }

    static std::string getJNISignature(const char*) {
        return "Ljava/lang/String;";
    }

    static std::string getJNISignature(const std::string&) {
        return "Ljava/lang/String;";
    }

    template <typename T>
    static std::string getJNISignature(T x) {
        // This template should never be instantiated
        static_assert(sizeof(x) == 0, "Unsupported argument type");
        return "";
    }

    template <typename T, typename... Ts>
    static std::string getJNISignature(T x, Ts... xs) {
        return getJNISignature(x) + getJNISignature(xs...);
    }

    static void reportError(const std::string& className, const std::string& methodName, const std::string& signature);
};

}

#endif // __ANDROID_JNI_HELPER_H__
