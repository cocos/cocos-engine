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

#pragma once

#include <functional>
#include <memory>
#include "base/Macros.h"
#include "base/std/container/string.h"
#include "base/std/container/unordered_map.h"
#include "base/std/container/vector.h"

namespace cc {
namespace network {

class IDownloadTask;
class IDownloaderImpl;
class Downloader;

class CC_DLL DownloadTask final {
public:
    static const int ERROR_NO_ERROR = 0;
    static const int ERROR_INVALID_PARAMS = -1;
    static const int ERROR_FILE_OP_FAILED = -2;
    static const int ERROR_IMPL_INTERNAL = -3;
    static const int ERROR_ABORT = -4;

    ccstd::string identifier;
    ccstd::string requestURL;
    ccstd::string storagePath;
    ccstd::unordered_map<ccstd::string, ccstd::string> header;

    DownloadTask();
    virtual ~DownloadTask();

private:
    friend class Downloader;
    std::unique_ptr<IDownloadTask> _coTask;
};

struct CC_DLL DownloaderHints {
    uint32_t countOfMaxProcessingTasks{6};
    uint32_t timeoutInSeconds{45};
    ccstd::string tempFileNameSuffix{".tmp"};
};

class CC_DLL Downloader final {
public:
    Downloader();
    explicit Downloader(const DownloaderHints &hints);
    ~Downloader();

    std::function<void(const DownloadTask &task,
                       const ccstd::vector<unsigned char> &data)>
        onDataTaskSuccess;

    std::function<void(const DownloadTask &task)> onFileTaskSuccess;

    std::function<void(const DownloadTask &task,
                       uint32_t bytesReceived,
                       uint32_t totalBytesReceived,
                       uint32_t totalBytesExpected)>
        onTaskProgress;

    std::function<void(const DownloadTask &task,
                       int errorCode,
                       int errorCodeInternal,
                       const ccstd::string &errorStr)>
        onTaskError;

    void setOnSuccess(const std::function<void(const DownloadTask &task)> &callback) { onFileTaskSuccess = callback; };

    void setOnProgress(const std::function<void(const DownloadTask &task,
                                                uint32_t bytesReceived,
                                                uint32_t totalBytesReceived,
                                                uint32_t totalBytesExpected)> &callback) { onTaskProgress = callback; };

    void setOnError(const std::function<void(const DownloadTask &task,
                                             int errorCode,
                                             int errorCodeInternal,
                                             const ccstd::string &errorStr)> &callback) { onTaskError = callback; };

    // CC_DEPRECATED(3.6, "Use setOnProgress instead") // needed for bindings, so not uncomment this line
    void setOnTaskProgress(const std::function<void(const DownloadTask &task,
                                                    uint32_t bytesReceived,
                                                    uint32_t totalBytesReceived,
                                                    uint32_t totalBytesExpected)> &callback) { onTaskProgress = callback; };

    std::shared_ptr<const DownloadTask> createDataTask(const ccstd::string &srcUrl, const ccstd::string &identifier = "");

    std::shared_ptr<const DownloadTask> createDownloadTask(const ccstd::string &srcUrl, const ccstd::string &storagePath, const ccstd::string &identifier = "");

    std::shared_ptr<const DownloadTask> createDownloadTask(const ccstd::string &srcUrl, const ccstd::string &storagePath, const ccstd::unordered_map<ccstd::string, ccstd::string> &header, const ccstd::string &identifier = "");

    void abort(const std::shared_ptr<const DownloadTask> &task);

private:
    std::unique_ptr<IDownloaderImpl> _impl;
};

} // namespace network
} // namespace cc
