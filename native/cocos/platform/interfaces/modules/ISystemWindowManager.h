/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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
#include "platform/interfaces/OSInterface.h"

namespace cc {
class ISystemWindow;
class OSEvent;

struct ISystemWindowInfo {
    ccstd::string title;
    int32_t x{-1};
    int32_t y{-1};
    int32_t width{-1};
    int32_t height{-1};
    int32_t flags{-1};
    void *externalHandle{nullptr};
};

using SystemWindowMap = ccstd::unordered_map<uint32_t, std::shared_ptr<ISystemWindow>>;

/**
 * 负责创建、查找 ISystemWindow 及消息处理
 */
class ISystemWindowManager : public OSInterface {
public:
    /**
     * 初始化 NativeWindow 环境
     * @return 0 成功 -1 失败
     */
    virtual int init() = 0;

    /**
     * 处理 PAL 层的消息
     */
    virtual void processEvent(bool *quit) = 0;

    /**
     * 交换窗口后台缓冲区
     */
    virtual void swapWindows() = 0;

    /**
     * 创建一个ISystemWindow对象
     * @param info 窗口描述
     * @return 创建的ISystemWindow对象，如失败返回nullptr
     */
    virtual ISystemWindow *createWindow(const ISystemWindowInfo &info) = 0;

    /**
     * 获取一个ISystemWindow窗口对象
     * @param windowId 窗口Id
     */
    virtual ISystemWindow *getWindow(uint32_t windowId) const = 0;

    /**
     * 获取所有窗口
     */
    virtual const SystemWindowMap &getWindows() const = 0;
};
}
