/****************************************************************************
 Copyright (c) 2025 Xiamen Yaji Software Co., Ltd.

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

#include "vendor/google/common/JniUtils.h"
#include "base/UTF8.h"

namespace cc {
std::string callStringMethod(JNIEnv* env, jclass clazz, jobject obj, const char* methodName) {
    jmethodID methodId = env->GetMethodID(clazz, methodName, "()Ljava/lang/String;");
    jobject jStringObj = env->CallObjectMethod(obj, methodId);
    if (jStringObj != nullptr) {
        return cc::StringUtils::getStringUTFCharsJNI(env, static_cast<jstring>(jStringObj));
    }
    return "";
}
jobject callObjectMethod(JNIEnv* env, jclass clazz, jobject obj, const char* methodName, const char* returnType) {
    std::string returnSign = cc::StringUtils::format("()L%s", returnType);
    jmethodID methodId = env->GetMethodID(clazz, methodName, returnSign.c_str());
    return env->CallObjectMethod(obj, methodId);
}

int callIntMethod(JNIEnv* env, jclass clazz, jobject obj, const char* methodName) {
    jmethodID methodId = env->GetMethodID(clazz, methodName, "()I");
    return env->CallIntMethod(obj, methodId);
}

bool callBooleanMethod(JNIEnv* env, jclass clazz, jobject obj, const char* methodName) {
    jmethodID methodId = env->GetMethodID(clazz, methodName, "()Z");
    return env->CallBooleanMethod(obj, methodId);
}

long callLongMethod(JNIEnv* env, jclass clazz, jobject obj, const char* methodName) {
    jmethodID methodId = env->GetMethodID(clazz, methodName, "()J");
    return env->CallLongMethod(obj, methodId);
}

template <typename T>
jobject convertToJObject(JNIEnv* env, T value, const char* className, const char* methodSig) {
    jclass clazz = env->FindClass(className);
    if (!clazz) {
        return nullptr;
    }

    jmethodID valueOfMethod = env->GetStaticMethodID(clazz, "valueOf", methodSig);
    if (!valueOfMethod) {
        return nullptr;
    }
    return env->CallStaticObjectMethod(clazz, valueOfMethod, value);
}

jobject intToJObject(JNIEnv* env, int value) {
    return convertToJObject(env, value, "java/lang/Integer", "(I)Ljava/lang/Integer;");
}

jobject doubleToJObject(JNIEnv* env, double value) {
    return convertToJObject(env, value, "java/lang/Double", "(D)Ljava/lang/Double;");
}

jobject boolToJObject(JNIEnv* env, bool value) {
    return convertToJObject(env, value, "java/lang/Boolean", "(Z)Ljava/lang/Boolean;");
}

jstring stringToJString(JNIEnv* env, const std::string& str) {
    return env->NewStringUTF(str.c_str());
}

int integerObjectToInt(JNIEnv* env, jclass clazz, jobject obj) {
    jmethodID valueMethod = env->GetMethodID(clazz, "intValue", "()I");
    if (!valueMethod) {
        return 0;
    }
    return env->CallIntMethod(obj, valueMethod);
}

double doubleObjectToDouble(JNIEnv* env, jclass clazz, jobject obj) {
    jmethodID valueMethod = env->GetMethodID(clazz, "doubleValue", "()D");
    if (!valueMethod) {
        return 0.0f;
    }
    return env->CallDoubleMethod(obj, valueMethod);
}

bool BooleanObjectToBool(JNIEnv* env, jclass clazz, jobject obj) {
    jmethodID valueMethod = env->GetMethodID(clazz, "booleanValue", "()Z");
    if (!valueMethod) {
        return false;
    }
    return env->CallBooleanMethod(obj, valueMethod);
}

} // namespace cc
