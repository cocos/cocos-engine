/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

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

#include "engine/EngineEvents.h"

#include "gfx-agent/DeviceAgent.h"
#include "gfx-validator/DeviceValidator.h"
#include "platform/BasePlatform.h"

// #undef CC_USE_NVN
// #undef CC_USE_VULKAN
// #undef CC_USE_METAL
// #undef CC_USE_GLES3
// #undef CC_USE_GLES2
#include "renderer/pipeline/Define.h"

namespace cc {
namespace gfx {
class CC_DLL DeviceManager final {
public:
    static Device *create() {
        DeviceInfo deviceInfo{pipeline::bindingMappingInfo};
        return DeviceManager::create(deviceInfo);
    }
    static bool isDetachDeviceThread();
    static bool isValidationSupported();
    static Device *create(const DeviceInfo &info);

    static ccstd::string getGFXName() {
        ccstd::string gfx = "unknown";
#ifdef CC_USE_NVN
        gfx = "NVN";
#elif defined(CC_USE_VULKAN)
        gfx = "Vulkan";
#elif defined(CC_USE_METAL)
        gfx = "Metal";
#elif defined(CC_USE_GLES3)
        gfx = "GLES3";
#elif defined(CC_USE_GLES2)
        gfx = "GLES2";
#else
        gfx = "Empty";
#endif

        return gfx;
    }

private:
    template <typename DeviceCtor, typename Enable = std::enable_if_t<std::is_base_of<Device, DeviceCtor>::value>>
    static bool tryCreate(const DeviceInfo &info, Device **pDevice) {
        Device *device = ccnew DeviceCtor;

        if (isDetachDeviceThread()) {
            device = ccnew gfx::DeviceAgent(device);
        }

#if !defined(CC_SERVER_MODE)
        if (CC_DEBUG > 0 && isValidationSupported()) {
            device = ccnew gfx::DeviceValidator(device);
        }
#endif

        if (!device->initialize(info)) {
            CC_SAFE_DELETE(device);
            return false;
        }
        *pDevice = device;

        return true;
    }

#ifndef CC_DEBUG
    static constexpr int CC_DEBUG{0};
#endif
};

} // namespace gfx
} // namespace cc
