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

#ifndef CC_GFXVULKAN_CONTEXT_H_
#define CC_GFXVULKAN_CONTEXT_H_

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
    CCVKContext(Device *device);
    ~CCVKContext();

public:
    bool initialize(const ContextInfo &info);
    void destroy();
    void present() {}

    CC_INLINE bool checkExtension(const String &extension) const {
        return std::find_if(_extensions.begin(), _extensions.end(),
                            [extension](const char *device_extension) {
                                return std::strcmp(device_extension, extension.c_str()) == 0;
                            }) != _extensions.end();
    }

    CC_INLINE int majorVersion() const { return _majorVersion; }
    CC_INLINE int minorVersion() const { return _minorVersion; }
    CC_INLINE CCVKGPUContext *gpuContext() { return _gpuContext; }
    CC_INLINE const vector<const char *> &getLayers() const { return _layers; }
    CC_INLINE const vector<const char *> &getExtensions() const { return _extensions; }

private:
    CCVKGPUContext *_gpuContext = nullptr;
    bool _isPrimaryContex = false;
    int _majorVersion = 0;
    int _minorVersion = 0;
    vector<const char *> _layers;
    vector<const char *> _extensions;
};

} // namespace gfx
} // namespace cc

#endif // CC_GFXVULKAN_CONTEXT_H_
