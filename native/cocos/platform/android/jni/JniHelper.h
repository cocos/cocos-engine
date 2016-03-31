/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2013-2016 Chukong Technologies Inc.

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
#include "platform/CCPlatformMacros.h"

NS_CC_BEGIN

typedef struct JniMethodInfo_
{
    JNIEnv *    env;
    jclass      classID;
    jmethodID   methodID;
} JniMethodInfo;

class CC_DLL JniHelper
{
public:
    static void setJavaVM(JavaVM *javaVM);
    static JavaVM* getJavaVM();
    static JNIEnv* getEnv();

    static bool setClassLoaderFrom(jobject activityInstance);
    static bool getStaticMethodInfo(JniMethodInfo &methodinfo,
                                    const char *className,
                                    const char *methodName,
                                    const char *paramCode);
    static bool getMethodInfo(JniMethodInfo &methodinfo,
                              const char *className,
                              const char *methodName,
                              const char *paramCode);

    /**
     *  @brief convert jstring to utf8 std::string,  same function with env->getStringUTFChars.
     *         because getStringUTFChars can not pass special emoticon
     *  @param env   The JNI Env
     *  @param srcjStr The jstring which want to convert
     *  @param ret   True if the conversion succeeds and the ret pointer isn't null
     *  @returns the result of utf8 string
     */
    static std::string getStringUTFCharsJNI(JNIEnv* env, jstring srcjStr, bool* ret = nullptr);

    /**
     *  @brief create a jstring with utf8 std::string, same function with env->newStringUTF
     *         because newStringUTF can not convert special emoticon
     *  @param env   The JNI Env
     *  @param srcjStr The std::string which want to convert
     *  @param ret     True if the conversion succeeds and the ret pointer isn't null
     *  @returns the result of jstring,the jstring need to DeleteLocalRef(jstring);
     */
    static jstring newStringUTFJNI(JNIEnv* env, const std::string& utf8Str, bool* ret = nullptr);

    static std::string jstring2string(jstring str);

    static jmethodID loadclassMethod_methodID;
    static jobject classloader;

    template <typename... Ts>
    static void callStaticVoidMethod(const char* className,
                                     const char* methodName,
                                     Ts... xs) {
        std::string methodSignature = "(" + getJNISignature(xs...) + ")V";

        cocos2d::JniMethodInfo t;
        if (cocos2d::JniHelper::getStaticMethodInfo(t, className, methodName, methodSignature.c_str())) {
            t.env->CallStaticVoidMethod(t.classID, t.methodID, convert(t, xs)...);
            t.env->DeleteLocalRef(t.classID);
            deleteLocalRefs(t.env);
        }
    }

    template <typename... Ts>
    static bool callStaticBooleanMethod(const char* className,
                                        const char* methodName,
                                        Ts... xs) {
        std::string methodSignature = "(" + getJNISignature(xs...) + ")Z";

        jboolean jret = JNI_FALSE;
        cocos2d::JniMethodInfo t;
        if (cocos2d::JniHelper::getStaticMethodInfo(t, className, methodName, methodSignature.c_str())) {
            jret = t.env->CallStaticBooleanMethod(t.classID, t.methodID, convert(t, xs)...);
            t.env->DeleteLocalRef(t.classID);
            deleteLocalRefs(t.env);
        }

        return (jret == JNI_TRUE);
    }

    template <typename... Ts>
    static int callStaticIntMethod(const char* className,
                                   const char* methodName,
                                   Ts... xs) {
        std::string methodSignature = "(" + getJNISignature(xs...) + ")I";

        jint ret = 0;
        cocos2d::JniMethodInfo t;
        if (cocos2d::JniHelper::getStaticMethodInfo(t, className, methodName, methodSignature.c_str())) {
            ret = t.env->CallStaticIntMethod(t.classID, t.methodID, convert(t, xs)...);
            t.env->DeleteLocalRef(t.classID);
            deleteLocalRefs(t.env);
        }

        return ret;
    }

    template <typename... Ts>
    static float callStaticFloatMethod(const char* className,
                                       const char* methodName,
                                       Ts... xs) {
        std::string methodSignature = "(" + getJNISignature(xs...) + ")F";

        jfloat ret = 0.0;
        cocos2d::JniMethodInfo t;
        if (cocos2d::JniHelper::getStaticMethodInfo(t, className, methodName, methodSignature.c_str())) {
            ret = t.env->CallStaticFloatMethod(t.classID, t.methodID, convert(t, xs)...);
            t.env->DeleteLocalRef(t.classID);
            deleteLocalRefs(t.env);
        }

        return ret;
    }

    template <typename... Ts>
    static double callStaticDoubleMethod(const char* className,
                                         const char* methodName,
                                         Ts... xs) {
        std::string methodSignature = "(" + getJNISignature(xs...) + ")D";

        jdouble ret = 0.0;
        cocos2d::JniMethodInfo t;
        if (cocos2d::JniHelper::getStaticMethodInfo(t, className, methodName, methodSignature.c_str())) {
            ret = t.env->CallStaticDoubleMethod(t.classID, t.methodID, convert(t, xs)...);
            t.env->DeleteLocalRef(t.classID);
            deleteLocalRefs(t.env);
        }

        return ret;
    }

    template <typename... Ts>
    static std::string callStaticStringMethod(const char* className,
                                              const char* methodName,
                                              Ts... xs) {
        std::string methodSignature = "(" + getJNISignature(xs...) + ")Ljava/lang/String;";

        std::string ret;

        cocos2d::JniMethodInfo t;
        if (cocos2d::JniHelper::getStaticMethodInfo(t, className, methodName, methodSignature.c_str())) {
            jstring jret = (jstring)t.env->CallStaticObjectMethod(t.classID, t.methodID, convert(t, xs)...);
            ret = cocos2d::JniHelper::jstring2string(jret);
            t.env->DeleteLocalRef(t.classID);
            t.env->DeleteLocalRef(jret);
            deleteLocalRefs(t.env);
        }

        return ret;
    }
private:

    static JNIEnv* cacheEnv(JavaVM* jvm);

    static bool getMethodInfo_DefaultClassLoader(JniMethodInfo &methodinfo,
                                                 const char *className,
                                                 const char *methodName,
                                                 const char *paramCode);

    static JavaVM* _psJavaVM;

    static jstring convert(cocos2d::JniMethodInfo& t, const char* x);

    static jstring convert(cocos2d::JniMethodInfo& t, const std::string& x);

    template <typename T>
    static T convert(cocos2d::JniMethodInfo&, T x) {
        return x;
    }

    static std::unordered_map<JNIEnv*, std::vector<jobject>> localRefs;

    static void deleteLocalRefs(JNIEnv* env);

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
};

NS_CC_END

#endif // __ANDROID_JNI_HELPER_H__

