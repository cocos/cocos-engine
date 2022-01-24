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

#pragma once

#include <functional>
#include <map>
#include <string>
#include <memory>
#include <vector>

#include "base/Macros.h"

namespace cc {
namespace network {

class IDownloadTask;
class IDownloaderImpl;
class Downloader;

class CC_DLL DownloadTask final {
public:
    const static int ERROR_NO_ERROR = 0;
    const static int ERROR_INVALID_PARAMS = -1;
    const static int ERROR_FILE_OP_FAILED = -2;
    const static int ERROR_IMPL_INTERNAL = -3;
    const static int ERROR_ABORT = -4;

    std::string identifier;
    std::string requestURL;
    std::string storagePath;
    std::map<std::string, std::string> header;

    DownloadTask();
    virtual ~DownloadTask();

private:
    friend class Downloader;
    std::unique_ptr<IDownloadTask> _coTask;
};

struct CC_DLL DownloaderHints {
    uint32_t countOfMaxProcessingTasks;
    uint32_t timeoutInSeconds;
    std::string tempFileNameSuffix;
};

class CC_DLL Downloader final {
public:
    Downloader();
    Downloader(const DownloaderHints &hints);
    ~Downloader();

    std::function<void(const DownloadTask &task,
                       const std::vector<unsigned char> &data)>
        onDataTaskSuccess;

    std::function<void(const DownloadTask &task)> onFileTaskSuccess;

    std::function<void(const DownloadTask &task,
                       int64_t bytesReceived,
                       int64_t totalBytesReceived,
                       int64_t totalBytesExpected)>
        onTaskProgress;

    std::function<void(const DownloadTask &task,
                       int errorCode,
                       int errorCodeInternal,
                       const std::string &errorStr)>
        onTaskError;

    void setOnFileTaskSuccess(const std::function<void(const DownloadTask &task)> &callback) { onFileTaskSuccess = callback; };

    void setOnTaskProgress(const std::function<void(const DownloadTask &task,
                                                    int64_t bytesReceived,
                                                    int64_t totalBytesReceived,
                                                    int64_t totalBytesExpected)> &callback) { onTaskProgress = callback; };

    void setOnTaskError(const std::function<void(const DownloadTask &task,
                                                 int errorCode,
                                                 int errorCodeInternal,
                                                 const std::string &errorStr)> &callback) { onTaskError = callback; };

    std::shared_ptr<const DownloadTask> createDownloadDataTask(const std::string &srcUrl, const std::string &identifier = "");

    std::shared_ptr<const DownloadTask> createDownloadFileTask(const std::string &srcUrl, const std::string &storagePath, const std::string &identifier = "");

    std::shared_ptr<const DownloadTask> createDownloadFileTask(const std::string &srcUrl, const std::string &storagePath, const std::map<std::string, std::string> &header, const std::string &identifier = "");

    void abort(const DownloadTask &task);

private:
    std::unique_ptr<IDownloaderImpl> _impl;
};

} // namespace network
} // namespace cc
