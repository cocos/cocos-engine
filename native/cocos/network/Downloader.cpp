/****************************************************************************
 Copyright (c) 2015-2016 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

#include "network/Downloader.h"
#include <memory>
#include "base/memory/Memory.h"

// include platform specific implement class
#if (CC_PLATFORM == CC_PLATFORM_MACOS || CC_PLATFORM == CC_PLATFORM_IOS)

    #include "network/DownloaderImpl-apple.h"
    #define DownloaderImpl DownloaderApple //NOLINT(readability-identifier-naming)

#elif (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_OHOS)

    #include "network/Downloader-java.h"
    #define DownloaderImpl DownloaderJava //NOLINT(readability-identifier-naming)

#else

    #include "network/Downloader-curl.h"
    #define DownloaderImpl DownloaderCURL //NOLINT(readability-identifier-naming)

#endif

namespace cc {
namespace network {

DownloadTask::DownloadTask() {
    DLLOG("Construct DownloadTask %p", this);
}

DownloadTask::~DownloadTask() {
    DLLOG("Destruct DownloadTask %p", this);
}

////////////////////////////////////////////////////////////////////////////////
//  Implement Downloader
Downloader::Downloader() {
    DownloaderHints hints;
    ccnew_placement(this) Downloader(hints);
}

Downloader::Downloader(const DownloaderHints &hints) {
    DLLOG("Construct Downloader %p", this);
    _impl = std::make_unique<DownloaderImpl>(hints);
    _impl->onTaskProgress = [this](const DownloadTask &task,
                                   uint32_t bytesReceived,
                                   uint32_t totalBytesReceived,
                                   uint32_t totalBytesExpected,
                                   std::function<uint32_t(void *buffer, uint32_t len)> & /*transferDataToBuffer*/) {
        if (onTaskProgress) {
            onTaskProgress(task, bytesReceived, totalBytesReceived, totalBytesExpected);
        }
    };

    _impl->onTaskFinish = [this](const DownloadTask &task,
                                 int errorCode,
                                 int errorCodeInternal,
                                 const ccstd::string &errorStr,
                                 const ccstd::vector<unsigned char> &data) {
        if (DownloadTask::ERROR_NO_ERROR != errorCode) {
            if (onTaskError) {
                onTaskError(task, errorCode, errorCodeInternal, errorStr);
            }
            return;
        }

        // success callback
        if (task.storagePath.length()) {
            if (onFileTaskSuccess) {
                onFileTaskSuccess(task);
            }
        } else {
            // data task
            if (onDataTaskSuccess) {
                onDataTaskSuccess(task, data);
            }
        }
    };
}

Downloader::~Downloader() {
    DLLOG("Destruct Downloader %p", this);
}

std::shared_ptr<const DownloadTask> Downloader::createDataTask(const ccstd::string &srcUrl, const ccstd::string &identifier /* = ""*/) {
    auto *iTask = ccnew DownloadTask();
    std::shared_ptr<const DownloadTask> task(iTask);
    do {
        iTask->requestURL = srcUrl;
        iTask->identifier = identifier;
        if (0 == srcUrl.length()) {
            if (onTaskError) {
                onTaskError(*task, DownloadTask::ERROR_INVALID_PARAMS, 0, "URL or is empty.");
            }
            task.reset();
            break;
        }
        iTask->_coTask.reset(_impl->createCoTask(task));
    } while (false);

    return task;
}

std::shared_ptr<const DownloadTask> Downloader::createDownloadTask(const ccstd::string &srcUrl,
                                                                   const ccstd::string &storagePath,
                                                                   const ccstd::unordered_map<ccstd::string, ccstd::string> &header,
                                                                   const ccstd::string &identifier /* = ""*/) {
    auto *iTask = ccnew DownloadTask();
    std::shared_ptr<const DownloadTask> task(iTask);
    do {
        iTask->requestURL = srcUrl;
        iTask->storagePath = storagePath;
        iTask->identifier = identifier;
        iTask->header = header;
        if (0 == srcUrl.length() || 0 == storagePath.length()) {
            if (onTaskError) {
                onTaskError(*task, DownloadTask::ERROR_INVALID_PARAMS, 0, "URL or storage path is empty.");
            }
            task.reset();
            break;
        }
        iTask->_coTask.reset(_impl->createCoTask(task));
    } while (false);

    return task;
}
std::shared_ptr<const DownloadTask> Downloader::createDownloadTask(const ccstd::string &srcUrl,
                                                                   const ccstd::string &storagePath,
                                                                   const ccstd::string &identifier /* = ""*/) {
    const ccstd::unordered_map<ccstd::string, ccstd::string> emptyHeader;
    return createDownloadTask(srcUrl, storagePath, emptyHeader, identifier);
}

void Downloader::abort(const std::shared_ptr<const DownloadTask> &task) {
    _impl->abort(task->_coTask);
}
//ccstd::string Downloader::getFileNameFromUrl(const ccstd::string& srcUrl)
//{
//    // Find file name and file extension
//    ccstd::string filename;
//    unsigned long found = srcUrl.find_last_of("/\\");
//    if (found != ccstd::string::npos)
//        filename = srcUrl.substr(found+1);
//    return filename;
//}

} // namespace network
} // namespace cc
