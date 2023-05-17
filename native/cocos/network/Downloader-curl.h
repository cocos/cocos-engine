/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.
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

#include "network/DownloaderImpl.h"

namespace cc {
class Scheduler;
}

namespace cc {
namespace network {
class DownloadTaskCURL;
struct DownloaderHints;

class DownloaderCURL : public IDownloaderImpl {
public:
    explicit DownloaderCURL(const DownloaderHints &hints);
    ~DownloaderCURL() override;

    IDownloadTask *createCoTask(std::shared_ptr<const DownloadTask> &task) override;

    void abort(const std::unique_ptr<IDownloadTask> &task) override;

protected:
    class Impl;
    std::shared_ptr<Impl> _impl;

    // for transfer data on schedule
    DownloadTaskCURL *_currTask; // temp ref
    std::function<uint32_t(void *, uint32_t)> _transferDataToBuffer;

    // scheduler for update processing and finished task in main schedule
    void onSchedule(float);
    ccstd::string _schedulerKey;
    std::weak_ptr<Scheduler> _scheduler;
};

} // namespace network
} // namespace cc
