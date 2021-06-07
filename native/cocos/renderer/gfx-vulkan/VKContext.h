/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "VKStd.h"
#include "gfx-base/GFXContext.h"

namespace cc {
namespace gfx {

class CCVKDevice;
class CCVKGPUDevice;
class CCVKGPUContext;
class CCVKGPUSwapchain;
class CCVKGPUSemaphorePool;

class CC_VULKAN_API CCVKContext final : public Context {
public:
    CCVKContext()           = default;
    ~CCVKContext() override = default;

    void present() override {}

    inline bool checkExtension(const String &extension) const {
        return std::any_of(_extensions.begin(), _extensions.end(), [&extension](auto &ext) {
            return std::strcmp(ext, extension.c_str()) == 0;
        });
    }

    inline int                         majorVersion() const { return _majorVersion; }
    inline int                         minorVersion() const { return _minorVersion; }
    inline CCVKGPUContext *            gpuContext() { return _gpuContext; }
    inline const vector<const char *> &getLayers() const { return _layers; }
    inline const vector<const char *> &getExtensions() const { return _extensions; }

    inline bool validationEnabled() const { return _validationEnabled; }

    void releaseSurface(uintptr_t windowHandle);
    void acquireSurface(uintptr_t windowHandle);

protected:
    bool doInit(const ContextInfo &info) override;
    void doDestroy() override;

    CCVKGPUContext *     _gpuContext      = nullptr;
    bool                 _isPrimaryContex = false;
    int                  _majorVersion    = 0;
    int                  _minorVersion    = 0;
    vector<const char *> _layers;
    vector<const char *> _extensions;

    bool _validationEnabled = false;
};

} // namespace gfx
} // namespace cc
