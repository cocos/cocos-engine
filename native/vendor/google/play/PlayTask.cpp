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
#include "vendor/google/play/PlayTask.h"
#include "base/UTF8.h"
#include "bindings/jswrapper/SeApi.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/jswrapper/Value.h"
#include "cocos/bindings/manual/jsb_conversions.h"

#include "vendor/google/play/PlayTaskManager.h"
#include "vendor/google/play/TResult.h"
#include "vendor/google/common/JsUtils.h"
#include "vendor/google/common/JniUtils.h"

namespace cc {

template se::Value callJSfunc<cc::AuthenticationResult*>(se::Object* obj, const char*, cc::AuthenticationResult*&&);
template se::Value callJSfunc<cc::PlayTask*>(se::Object* obj, const char*, cc::PlayTask*&&);
namespace {
#ifndef JCLS_GOOGLE_PLAY_TASK_MANAGER
    #define JCLS_GOOGLE_PLAY_TASK_MANAGER "google/play/TaskManager"
#endif
} // namespace

TaskException::~TaskException() {
    JniHelper::callStaticVoidMethod(JCLS_GOOGLE_PLAY_TASK_MANAGER, "removeTaskException", _exceptionId);
}

void TaskException::printStackTrace() {
    JniHelper::callStaticVoidMethod(JCLS_GOOGLE_PLAY_TASK_MANAGER, "printExceptStackTrace", _exceptionId);
}

int PlayTask::_nextListnerId = 0;

PlayTask::PlayTask(int taskId) : _taskId(taskId) {
}

PlayTask::~PlayTask() {
    PlayTaskManager::getInstance()->removeTask(_taskId);
    JniHelper::callStaticVoidMethod(JCLS_GOOGLE_PLAY_TASK_MANAGER, "removeTask", _taskId);
}

int PlayTask::getNextListenerId() {
    return _nextListnerId++;
}

PlayTask* PlayTask::addOnCanceledListener(se::Object* listener) {
    int listenerId = addListener(listener);
    int taskId = JniHelper::callStaticIntMethod(JCLS_GOOGLE_PLAY_TASK_MANAGER, "addOnCanceledListener", _taskId, listenerId);
    return PlayTaskManager::getInstance()->addTask(taskId);
}

PlayTask* PlayTask::addOnCompleteListener(se::Object* listener) {
    int listenerId = addListener(listener);
    int taskId = JniHelper::callStaticIntMethod(JCLS_GOOGLE_PLAY_TASK_MANAGER, "addOnCompleteListener", _taskId, listenerId);
    return PlayTaskManager::getInstance()->addTask(taskId);
}

PlayTask* PlayTask::addOnFailureListener(se::Object* listener) {
    int listenerId = addListener(listener);
    int taskId = JniHelper::callStaticIntMethod(JCLS_GOOGLE_PLAY_TASK_MANAGER, "addOnFailureListener", _taskId, listenerId);
    return PlayTaskManager::getInstance()->addTask(taskId);
}

PlayTask* PlayTask::addOnSuccessListener(se::Object* listener) {
    int listenerId = addListener(listener);
    int taskId = JniHelper::callStaticIntMethod(JCLS_GOOGLE_PLAY_TASK_MANAGER, "addOnSuccessListener", _taskId, listenerId);
    return PlayTaskManager::getInstance()->addTask(taskId);
}

PlayTask* PlayTask::continueWith(se::Object* listener) {
    int listenerId = addListener(listener);
    int taskId = JniHelper::callStaticIntMethod(JCLS_GOOGLE_PLAY_TASK_MANAGER, "continueWith", _taskId, listenerId);
    return PlayTaskManager::getInstance()->addTask(taskId);
}


void PlayTask::getResult(se::Object* listener) {
    auto* env = JniHelper::getEnv();
    cc::JniMethodInfo t;
    if (cc::JniHelper::getStaticMethodInfo(t, JCLS_GOOGLE_PLAY_TASK_MANAGER, "getResult", "(I)Ljava/lang/Object;")) {
        jobject obj = t.env->CallStaticObjectMethod(t.classID, t.methodID, _taskId);
        callJSfuncWithJObject(listener, "onSuccess", reinterpret_cast<void*>(obj));
    } else {
        callJSfuncWithJObject(listener, "onSuccess", nullptr);
    }
    return;
}

bool PlayTask::isCanceled() {
    return JniHelper::callStaticBooleanMethod(JCLS_GOOGLE_PLAY_TASK_MANAGER, "isCanceled", _taskId);
}

bool PlayTask::isComplete() {
    return JniHelper::callStaticBooleanMethod(JCLS_GOOGLE_PLAY_TASK_MANAGER, "isComplete", _taskId);
}

bool PlayTask::isSuccessful() {
    return JniHelper::callStaticBooleanMethod(JCLS_GOOGLE_PLAY_TASK_MANAGER, "isSuccessful", _taskId);
}

int PlayTask::addListener(se::Object* listener) {
    int listenerId = getNextListenerId();
    _listeners[listenerId].reset(listener);
    return listenerId;
}

void PlayTask::onTaskCanceled(int listerId) {
    auto it = _listeners.find(listerId);
    if (it != _listeners.end()) {
        // When calling the JavaScript onComplete function, there is a possibility that PlayTask might be garbage collected.
        // Therefore, it should be removed first.
        scopedListener listener(it->second.get());
        _listeners.erase(it);
        cc::callJSfunc(listener.get(), "onCanceled");
    }
}

void PlayTask::onTaskComplete(int listerId, int nextTaskId) {
    auto it = _listeners.find(listerId);
    if (it != _listeners.end()) {
        // When calling the JavaScript onComplete function, there is a possibility that PlayTask might be garbage collected.
        // Therefore, it should be removed first.
        scopedListener listener(it->second.get());
        _listeners.erase(it);
        PlayTask* newTask = PlayTaskManager::getInstance()->addTask(nextTaskId);
        cc::callJSfunc(listener.get(), "onComplete", newTask);
    }
}

void PlayTask::onTaskFailure(int listerId, void* obj, int exceptionId) {
    auto it = _listeners.find(listerId);
    if (it != _listeners.end()) {
        // When calling the JavaScript onComplete function, there is a possibility that PlayTask might be garbage collected.
        // Therefore, it should be removed first.
        scopedListener listener(it->second.get());
        _listeners.erase(it);
        auto* env = JniHelper::getEnv();
        jobject jobj = reinterpret_cast<jobject>(obj);
        jclass objClass = env->GetObjectClass(jobj);
        jmethodID getNameMethod = env->GetMethodID(env->FindClass("java/lang/Class"), "getName", "()Ljava/lang/String;");
        jstring className = (jstring)env->CallObjectMethod(objClass, getNameMethod);
        std::string name = cc::StringUtils::getStringUTFCharsJNI(env, className);
        if(name == "java.lang.Exception") {
            auto* taskException = new TaskException;
            taskException->_detailMessage = callStringMethod(env, objClass, jobj, "getMessage");
            taskException->_toString = callStringMethod(env, objClass, jobj, "toString");
            cc::callJSfunc(listener.get(), "onFailure", taskException);
        }
    }
}

void PlayTask::onTaskSuccess(int listerId, void* obj) {
    auto it = _listeners.find(listerId);
    if (it != _listeners.end()) {
        // When calling the JavaScript onComplete function, there is a possibility that PlayTask might be garbage collected.
        // Therefore, it should be removed first.
        scopedListener listener(it->second.get());
        _listeners.erase(it);
        callJSfuncWithJObject(it->second.get(), "onSuccess", obj);
    }
}

void* PlayTask::onTaskContinueWith(int listerId, int nextTaskId) {
    void * ptr = nullptr;
    auto it = _listeners.find(listerId);
    if (it != _listeners.end()) {
        // When calling the JavaScript onComplete function, there is a possibility that PlayTask might be garbage collected.
        // Therefore, it should be removed first.
        scopedListener listener(it->second.get());
        _listeners.erase(it);

        se::Value result = callJSfunc(listener.get(), "then");
        if(result.isNumber()) {
            ptr = reinterpret_cast<void*>(intToJObject(JniHelper::getEnv(), result.toInt32()));
        } else if(result.isBoolean()) {
            ptr = reinterpret_cast<void*>(boolToJObject(JniHelper::getEnv(), result.toBoolean()));
        } else if(result.isString()) {
            ptr = reinterpret_cast<void*>(stringToJString(JniHelper::getEnv(), result.toString()));
        } else if(result.isObject()) {
            // Currently, there is no need to parse objects, and the implemented functional objects (such as AuthenticationResult) do not provide constructors.
            // If needed in the future, they can be parsed as follows :
            // se::Object* obj = r.toObject();
            // std::string name = obj->_getClass()->getName();
            // if(name == "AuthenticationResult") {
            //     auto* result = reinterpret_cast<cc::AuthenticationResult*>(obj->getPrivateData());
            // }
        }
    }
    return ptr;
}

void PlayTask::callJSfuncWithJObject(se::Object* listener, const char* functionName, void* obj) {
    jobject jobj = reinterpret_cast<jobject>(obj);
    if(jobj != nullptr) {
        auto* env = JniHelper::getEnv();
        jclass objClass = env->GetObjectClass(jobj);
        jmethodID getNameMethod = env->GetMethodID(env->FindClass("java/lang/Class"), "getName", "()Ljava/lang/String;");
        jstring className = (jstring)env->CallObjectMethod(objClass, getNameMethod);
        std::string name = cc::StringUtils::getStringUTFCharsJNI(env, className);
        if (name == "com.google.android.gms.games.AuthenticationResult") {
            auto* authenticationResult = new AuthenticationResult;
            authenticationResult->_isAuthenticated = callBooleanMethod(env, objClass, jobj, "isAuthenticated");
            cc::callJSfunc(listener, functionName, authenticationResult);
        } else if (name == "com.google.android.gms.games.RecallAccess") {
            auto* recallAccess = new RecallAccess;
            recallAccess->_hashCode = callIntMethod(env, objClass, jobj, "hashCode");
            recallAccess->_sessionId = callStringMethod(env, objClass, jobj, "getSessionId");
            cc::callJSfunc(listener, functionName, recallAccess);
        } else if(name == "com.google.android.gms.games.AnnotatedData") {
            auto* annotatedData = new AnnotatedData;
            annotatedData->_isStale = callBooleanMethod(env,  objClass, jobj, "isStale");
            jmethodID methodId = env->GetMethodID(objClass, "get", "()Ljava/lang/Object;");
            jobject achievementBufferObj = env->CallObjectMethod(jobj, methodId);
            if (achievementBufferObj != nullptr) {
                auto& achievementBuffer = annotatedData->_achievementBuffer;
                jclass achievementBufferObjClass = env->GetObjectClass(achievementBufferObj);
                int count = callIntMethod(env,  achievementBufferObjClass, achievementBufferObj, "getCount");
                jmethodID methodId = env->GetMethodID(achievementBufferObjClass, "get", "(I)Ljava/lang/Object;");
                for(int i = 0; i < count; ++i) {
                    jobject achievementObj = env->CallObjectMethod(achievementBufferObj, methodId, i);
                    jclass achievementObjClass = env->GetObjectClass(achievementObj);
                    if (achievementObj != nullptr) {
                        auto* achievement = achievementBuffer.createAchievement();
                        achievement->_type = callIntMethod(env, achievementObjClass, achievementObj, "getType");
                        if(achievement->_type == Achievement::TYPE_INCREMENTAL) {
                            // Incremental achievements
                            achievement->_currentSteps = callIntMethod(env, achievementObjClass, achievementObj, "getCurrentSteps");
                            achievement->_totalSteps = callIntMethod(env, achievementObjClass, achievementObj, "getTotalSteps");
                            achievement->_formattedCurrentSteps = callStringMethod(env, achievementObjClass, achievementObj, "getFormattedCurrentSteps");
                            achievement->_formattedTotalSteps = callStringMethod(env, achievementObjClass, achievementObj, "getFormattedTotalSteps");
                        } else {
                            // Standard achievements
                            achievement->_currentSteps = 0;
                            achievement->_totalSteps = 0;
                            achievement->_formattedCurrentSteps = "";
                            achievement->_formattedTotalSteps = "";
                        }
                        achievement->_state = callIntMethod(env, achievementObjClass, achievementObj, "getState");
                        achievement->_lastUpdatedTimestamp = callLongMethod(env, achievementObjClass, achievementObj, "getLastUpdatedTimestamp");
                        achievement->_xpValue = callLongMethod(env, achievementObjClass, achievementObj, "getXpValue");
                        achievement->_achievementId = callStringMethod(env, achievementObjClass, achievementObj, "getAchievementId");
                        achievement->_description = callStringMethod(env, achievementObjClass, achievementObj, "getDescription");
                        achievement->_name = callStringMethod(env, achievementObjClass, achievementObj, "getName");
                        achievement->_revealedImageUrl = callStringMethod(env, achievementObjClass, achievementObj, "getRevealedImageUrl");
                        achievement->_unlockedImageUrl = callStringMethod(env, achievementObjClass, achievementObj, "getUnlockedImageUrl");
                        ccDeleteLocalRef(env, achievementObjClass);
                        ccDeleteLocalRef(env, achievementObj);
                    }
                }
                callVoidMethod(env, achievementBufferObjClass, achievementBufferObj, "release");
                ccDeleteLocalRef(env, achievementBufferObjClass);
                ccDeleteLocalRef(env, achievementBufferObj);
            }
            cc::callJSfunc(listener, functionName, annotatedData);
        }
        else if(name == "java.lang.Integer") {
            int value = integerObjectToInt(env, objClass, jobj);
            cc::callJSfunc(listener, functionName, value);
        } else if(name == "java.lang.Double") {
            double value = doubleObjectToDouble(env, objClass, jobj);
            cc::callJSfunc(listener, functionName, value);
        } else if(name == "java.lang.Boolean") {
            bool value = BooleanObjectToBool(env, objClass, jobj);
            cc::callJSfunc(listener, functionName, value);
        } else if(name == "java.lang.String") {
            std::string value = cc::StringUtils::getStringUTFCharsJNI(env, static_cast<jstring>(jobj));
            cc::callJSfunc(listener, functionName, value);
        } else {
            CC_LOG_WARNING("Unsupported types");
            cc::callJSfunc(listener, functionName);
        }
    } else {
        cc::callJSfunc(listener, functionName);
    }
}

} // namespace cc
