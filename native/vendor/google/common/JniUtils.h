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

#pragma once

#include "platform/java/jni/JniHelper.h"

namespace cc {
std::string callStringMethod(JNIEnv* env, jclass clazz, jobject obj, const char* methodName);
jobject callObjectMethod(JNIEnv* env, jclass clazz, jobject obj, const char* methodName, const char* returnType);
int callIntMethod(JNIEnv* env, jclass clazz, jobject obj, const char* methodName);
bool callBooleanMethod(JNIEnv* env, jclass clazz, jobject obj, const char* methodName);
long callLongMethod(JNIEnv* env, jclass clazz, jobject obj, const char* methodName);

// int -> Integer
jobject intToJObject(JNIEnv* env, int value);
// double -> Double
jobject doubleToJObject(JNIEnv* env, double value);
// bool -> Boolean
jobject boolToJObject(JNIEnv* env, bool value);
// std::string -> jstring
jstring stringToJString(JNIEnv* env, const std::string& str);

int integerObjectToInt(JNIEnv* env, jclass clazz, jobject obj);
double doubleObjectToDouble(JNIEnv* env, jclass clazz, jobject obj);
bool BooleanObjectToBool(JNIEnv* env, jclass clazz, jobject obj);
}