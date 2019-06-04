/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.
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

#include "network/CCDownloader-android.h"

#include "network/CCDownloader.h"
#include "platform/android/jni/JniHelper.h"
#include "platform/android/jni/JniImp.h"

#include <mutex>

#ifndef JCLS_DOWNLOADER
#define JCLS_DOWNLOADER "org/cocos2dx/lib/Cocos2dxDownloader"
#endif
#define JARG_STR        "Ljava/lang/String;"
#define JARG_DOWNLOADER "L" JCLS_DOWNLOADER ";"

#ifndef ORG_DOWNLOADER_CLASS_NAME
#define ORG_DOWNLOADER_CLASS_NAME org_cocos2dx_lib_Cocos2dxDownloader
#endif
#define JNI_DOWNLOADER(FUNC) JNI_METHOD1(ORG_DOWNLOADER_CLASS_NAME,FUNC)

std::unordered_map<int, cocos2d::network::DownloaderAndroid*> sDownloaderMap;
std::mutex sDownloaderMutex;

static void _insertDownloaderAndroid(int id, cocos2d::network::DownloaderAndroid* downloaderPtr)
{
    std::lock_guard<std::mutex> guard(sDownloaderMutex);
    sDownloaderMap.insert(std::make_pair(id, downloaderPtr));
}

static void _eraseDownloaderAndroid(int id)
{
    std::lock_guard<std::mutex> guard(sDownloaderMutex);
    sDownloaderMap.erase(id);
}

/**
 * If not found, return nullptr, otherwise return the Downloader
 */
static cocos2d::network::DownloaderAndroid* _findDownloaderAndroid(int id)
{
    std::lock_guard<std::mutex> guard(sDownloaderMutex);
    auto iter = sDownloaderMap.find(id);
    if (sDownloaderMap.end() == iter) {
        return nullptr;
    } else {
        return iter->second;
    }
}

namespace cocos2d { namespace network {

        static int sTaskCounter = 0;
        static int sDownloaderCounter = 0;

        struct DownloadTaskAndroid : public IDownloadTask
        {
            DownloadTaskAndroid()
            :id(++sTaskCounter)
            {
                DLLOG("Construct DownloadTaskAndroid: %p", this);
            }
            virtual  ~DownloadTaskAndroid()
            {
                DLLOG("Destruct DownloadTaskAndroid: %p", this);
            }

            int id;
            std::shared_ptr<const DownloadTask> task;    // reference to DownloadTask, when task finish, release
        };

        DownloaderAndroid::DownloaderAndroid(const DownloaderHints& hints)
        : _id(++sDownloaderCounter)
        , _impl(nullptr)
        {
            DLLOG("Construct DownloaderAndroid: %p", this);
            JniMethodInfo methodInfo;
            if (JniHelper::getStaticMethodInfo(methodInfo,
                                               JCLS_DOWNLOADER,
                                               "createDownloader",
                                               "(II" JARG_STR "I)" JARG_DOWNLOADER))
            {
                jobject jStr = methodInfo.env->NewStringUTF(hints.tempFileNameSuffix.c_str());
                jobject jObj = methodInfo.env->CallStaticObjectMethod(
                        methodInfo.classID,
                        methodInfo.methodID,
                        _id,
                        hints.timeoutInSeconds,
                        jStr,
                        hints.countOfMaxProcessingTasks
                );
                _impl = methodInfo.env->NewGlobalRef(jObj);
                DLLOG("android downloader: jObj: %p, _impl: %p", jObj, _impl);
                //It's not thread-safe here, use thread-safe method instead
                //sDownloaderMap.insert(make_pair(_id, this));
                _insertDownloaderAndroid(_id, this);
                methodInfo.env->DeleteLocalRef(jStr);
                methodInfo.env->DeleteLocalRef(jObj);
                methodInfo.env->DeleteLocalRef(methodInfo.classID);
            }
        }

        DownloaderAndroid::~DownloaderAndroid()
        {
            if(_impl != nullptr)
            {
                JniMethodInfo methodInfo;
                if (JniHelper::getStaticMethodInfo(methodInfo,
                                                   JCLS_DOWNLOADER,
                                                   "cancelAllRequests",
                                                   "(" JARG_DOWNLOADER ")V"))
                {
                    methodInfo.env->CallStaticVoidMethod(
                            methodInfo.classID,
                            methodInfo.methodID,
                            _impl
                    );
                    methodInfo.env->DeleteLocalRef(methodInfo.classID);
                }
                //It's not thread-safe here, use thread-safe method instead
                //sDownloaderMap.erase(_id);
                _eraseDownloaderAndroid(_id);
                JniHelper::getEnv()->DeleteGlobalRef(_impl);
            }
            DLLOG("Destruct DownloaderAndroid: %p", this);
        }

        IDownloadTask *DownloaderAndroid::createCoTask(std::shared_ptr<const DownloadTask>& task)
        {
            DownloadTaskAndroid *coTask = new DownloadTaskAndroid;
            coTask->task = task;

            JniMethodInfo methodInfo;
            if (JniHelper::getStaticMethodInfo(methodInfo,
                                               JCLS_DOWNLOADER,
                                               "createTask",
                                               "(" JARG_DOWNLOADER "I" JARG_STR JARG_STR "[" JARG_STR")V"))
            {
                jclass jclassString = methodInfo.env->FindClass("java/lang/String");
                jstring jstrURL = methodInfo.env->NewStringUTF(task->requestURL.c_str());
                jstring jstrPath = methodInfo.env->NewStringUTF(task->storagePath.c_str());
                jobjectArray jarrayHeader = methodInfo.env->NewObjectArray(task->header.size()*2, jclassString, NULL);
                const std::map<std::string, std::string> &headMap = task->header;
                int index = 0;
                for (auto it = headMap.cbegin(); it != headMap.cend(); ++it) {
                    methodInfo.env->SetObjectArrayElement(jarrayHeader, index++, methodInfo.env->NewStringUTF(it->first.c_str()));
                    methodInfo.env->SetObjectArrayElement(jarrayHeader, index++, methodInfo.env->NewStringUTF(it->second.c_str()));
                }
                methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, _impl, coTask->id, jstrURL, jstrPath, jarrayHeader);
                for (int i = 0; i < index; ++i) {
                    methodInfo.env->DeleteLocalRef(methodInfo.env->GetObjectArrayElement(jarrayHeader, i));
                }
                methodInfo.env->DeleteLocalRef(jclassString);
                methodInfo.env->DeleteLocalRef(jstrURL);
                methodInfo.env->DeleteLocalRef(jstrPath);
                methodInfo.env->DeleteLocalRef(jarrayHeader);
                methodInfo.env->DeleteLocalRef(methodInfo.classID);
            }

            DLLOG("DownloaderAndroid::createCoTask id: %d", coTask->id);
            _taskMap.insert(std::make_pair(coTask->id, coTask));
            return coTask;
        }

        void DownloaderAndroid::abort(const std::unique_ptr<IDownloadTask>& task) {
            auto iter = _taskMap.begin();
            for (; iter != _taskMap.end(); iter++) {
                if (task.get() == iter->second) {
                    break;
                }
            }
            if(_impl != nullptr && iter != _taskMap.end())
            {
                JniMethodInfo methodInfo;
                if (JniHelper::getStaticMethodInfo(methodInfo,
                                                   JCLS_DOWNLOADER,
                                                   "abort",
                                                   "(" JARG_DOWNLOADER "I" ")V"))
                {
                    methodInfo.env->CallStaticVoidMethod(
                            methodInfo.classID,
                            methodInfo.methodID,
                            _impl,
                            iter->first
                    );
                    methodInfo.env->DeleteLocalRef(methodInfo.classID);

                    DownloadTaskAndroid *coTask = iter->second;
                    _taskMap.erase(iter);
                    std::vector<unsigned char> emptyBuffer;
                    onTaskFinish(*coTask->task,
                                 DownloadTask::ERROR_ABORT,
                                 DownloadTask::ERROR_ABORT,
                                 "downloadFile:fail abort",
                                 emptyBuffer
                    );
                    coTask->task.reset();
                }
            }
            DLLOG("DownloaderAndroid:abort");
        }

        void DownloaderAndroid::_onProcess(int taskId, int64_t dl, int64_t dlNow, int64_t dlTotal)
        {
            DLLOG("DownloaderAndroid::onProgress(taskId: %d, dl: %lld, dlnow: %lld, dltotal: %lld)", taskId, dl, dlNow, dlTotal);
            auto iter = _taskMap.find(taskId);
            if (_taskMap.end() == iter)
            {
                DLLOG("DownloaderAndroid::onProgress can't find task with id: %d", taskId);
                return;
            }
            DownloadTaskAndroid *coTask = iter->second;
            std::function<int64_t(void*, int64_t)> transferDataToBuffer;
            onTaskProgress(*coTask->task, dl, dlNow, dlTotal, transferDataToBuffer);
        }

        void DownloaderAndroid::_onFinish(int taskId, int errCode, const char *errStr, std::vector<unsigned char>& data)
        {
            DLLOG("DownloaderAndroid::_onFinish(taskId: %d, errCode: %d, errStr: %s)", taskId, errCode, (errStr)?errStr:"null");
            auto iter = _taskMap.find(taskId);
            if (_taskMap.end() == iter)
            {
                DLLOG("DownloaderAndroid::_onFinish can't find task with id: %d", taskId);
                return;
            }
            DownloadTaskAndroid *coTask = iter->second;
            std::string str = (errStr ? errStr : "");
            _taskMap.erase(iter);
            onTaskFinish(*coTask->task,
                         errStr ? DownloadTask::ERROR_IMPL_INTERNAL : DownloadTask::ERROR_NO_ERROR,
                         errCode,
                         str,
                         data
            );
            coTask->task.reset();
        }
    }
}  // namespace cocos2d::network

extern "C" {

JNIEXPORT void JNICALL JNI_DOWNLOADER(nativeOnProgress)(JNIEnv *env, jclass clazz, jint id, jint taskId, jlong dl, jlong dlnow, jlong dltotal)
{
    if(getApplicationExited()) {
        return;
    }

    DLLOG("_nativeOnProgress(id: %d, taskId: %d, dl: %lld, dlnow: %lld, dltotal: %lld)", id, taskId, dl, dlnow, dltotal);
    //It's not thread-safe here, use thread-safe method instead
    cocos2d::network::DownloaderAndroid *downloader = _findDownloaderAndroid(id);
    if (nullptr == downloader)
    {
        DLLOG("_nativeOnProgress can't find downloader by key: %p for task: %d", clazz, id);
        return;
    }
    downloader->_onProcess((int)taskId, (int64_t)dl, (int64_t)dlnow, (int64_t)dltotal);
}

JNIEXPORT void JNICALL JNI_DOWNLOADER(nativeOnFinish)(JNIEnv *env, jclass clazz, jint id, jint taskId, jint errCode, jstring errStr, jbyteArray data)
{
    if(getApplicationExited())
    {
        return;
    }
    DLLOG("_nativeOnFinish(id: %d, taskId: %d)", id, taskId);
    //It's not thread-safe here, use thread-safe method instead
    cocos2d::network::DownloaderAndroid *downloader = _findDownloaderAndroid(id);
    if (nullptr == downloader)
    {
        DLLOG("_nativeOnFinish can't find downloader id: %d for task: %d", id, taskId);
        return;
    }
    std::vector<unsigned char> buf;
    if (errStr)
    {
        // failure
        const char *nativeErrStr = env->GetStringUTFChars(errStr, JNI_FALSE);
        downloader->_onFinish((int)taskId, (int)errCode, nativeErrStr, buf);
        env->ReleaseStringUTFChars(errStr, nativeErrStr);
        return;
    }

    // success
    if (data)
    {
        int len = env->GetArrayLength(data);
        if (len)
        {
            buf.resize(len);
            env->GetByteArrayRegion(data, 0, len, reinterpret_cast<jbyte*>(buf.data()));
        }
    }
    downloader->_onFinish((int)taskId, (int)errCode, nullptr, buf);
}

} // extern "C" {
