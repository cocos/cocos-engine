/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.
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
#include <memory>
#include "base/Log.h"
#include "base/Macros.h"
#include "base/std/container/string.h"
#include "base/std/container/unordered_map.h"
#include "base/std/container/vector.h"

//#define CC_DOWNLOADER_DEBUG
#ifdef CC_DOWNLOADER_DEBUG
    #define DLLOG(format, ...) CC_LOG_DEBUG(format, ##__VA_ARGS__)
#else
    #define DLLOG(...) \
        do {           \
        } while (0)
#endif

namespace cc {
namespace network {
class DownloadTask;

class CC_DLL IDownloadTask {
public:
    virtual ~IDownloadTask() = default;
};

class IDownloaderImpl {
public:
    virtual ~IDownloaderImpl() = default;

    std::function<void(const DownloadTask &task,
                       uint32_t bytesReceived,
                       uint32_t totalBytesReceived,
                       uint32_t totalBytesExpected,
                       std::function<uint32_t(void *buffer, uint32_t len)> &transferDataToBuffer)>
        onTaskProgress;

    std::function<void(const DownloadTask &task,
                       int errorCode,
                       int errorCodeInternal,
                       const ccstd::string &errorStr,
                       const ccstd::vector<unsigned char> &data)>
        onTaskFinish;

    virtual IDownloadTask *createCoTask(std::shared_ptr<const DownloadTask> &task) = 0;

    virtual void abort(const std::unique_ptr<IDownloadTask> &task) = 0;
};

} // namespace network
} // namespace cc
