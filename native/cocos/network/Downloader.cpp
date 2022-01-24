/****************************************************************************
 Copyright (c) 2015-2016 cocos2d-x.org
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

#include <memory>

#include "network/Downloader.h"

// include platform specific implement class
#if (CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_MAC_IOS)

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
    DownloaderHints hints =
        {
            6,
            45,
            ".tmp"};
    new (this) Downloader(hints);
}

Downloader::Downloader(const DownloaderHints &hints) {
    DLLOG("Construct Downloader %p", this);
    _impl                 = std::make_unique<DownloaderImpl>(hints);
    _impl->onTaskProgress = [this](const DownloadTask &task,
                                   int64_t             bytesReceived,
                                   int64_t             totalBytesReceived,
                                   int64_t             totalBytesExpected,
                                   std::function<int64_t(void *buffer, int64_t len)> & /*transferDataToBuffer*/) {
        if (onTaskProgress) {
            onTaskProgress(task, bytesReceived, totalBytesReceived, totalBytesExpected);
        }
    };

    _impl->onTaskFinish = [this](const DownloadTask &              task,
                                 int                               errorCode,
                                 int                               errorCodeInternal,
                                 const std::string &               errorStr,
                                 const std::vector<unsigned char> &data) {
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

std::shared_ptr<const DownloadTask> Downloader::createDownloadDataTask(const std::string &srcUrl, const std::string &identifier /* = ""*/) {
    auto *                              iTask = new (std::nothrow) DownloadTask();
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

std::shared_ptr<const DownloadTask> Downloader::createDownloadFileTask(const std::string &                       srcUrl,
                                                                       const std::string &                       storagePath,
                                                                       const std::map<std::string, std::string> &header,
                                                                       const std::string &                       identifier /* = ""*/) {
    auto *                              iTask = new (std::nothrow) DownloadTask();
    std::shared_ptr<const DownloadTask> task(iTask);
    do {
        iTask->requestURL  = srcUrl;
        iTask->storagePath = storagePath;
        iTask->identifier  = identifier;
        iTask->header      = header;
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
std::shared_ptr<const DownloadTask> Downloader::createDownloadFileTask(const std::string &srcUrl,
                                                                       const std::string &storagePath,
                                                                       const std::string &identifier /* = ""*/) {
    const std::map<std::string, std::string> emptyHeader;
    return createDownloadFileTask(srcUrl, storagePath, emptyHeader, identifier);
}

void Downloader::abort(const DownloadTask &task) {
    _impl->abort(task._coTask);
}
//std::string Downloader::getFileNameFromUrl(const std::string& srcUrl)
//{
//    // Find file name and file extension
//    std::string filename;
//    unsigned long found = srcUrl.find_last_of("/\\");
//    if (found != std::string::npos)
//        filename = srcUrl.substr(found+1);
//    return filename;
//}

} // namespace network
} // namespace cc
