/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#include "bindings/event/CustomEventTypes.h"
#include "bindings/event/EventDispatcher.h"

#include "gfx-agent/DeviceAgent.h"
#include "gfx-validator/DeviceValidator.h"

//#undef CC_USE_NVN
#undef CC_USE_VULKAN
//#undef CC_USE_METAL
#undef CC_USE_GLES3
//#undef CC_USE_GLES2

#ifdef CC_USE_NVN
    #include "gfx-nvn/NVNDevice.h"
#endif

#ifdef CC_USE_VULKAN
    #include "gfx-vulkan/VKDevice.h"
#endif

#ifdef CC_USE_METAL
    #include "gfx-metal/MTLDevice.h"
#endif

#ifdef CC_USE_GLES3
    #include "gfx-gles3/GLES3Device.h"
#endif

#ifdef CC_USE_GLES2
    #include "gfx-gles2/GLES2Device.h"
#endif

#include "gfx-empty/EmptyDevice.h"

namespace cc {
namespace gfx {

class CC_DLL DeviceManager final {
    static constexpr bool DETACH_DEVICE_THREAD{false};
    static constexpr bool FORCE_DISABLE_VALIDATION{false};
    static constexpr bool FORCE_ENABLE_VALIDATION{false};

public:
    static Device *create(const DeviceInfo &info) {
        if (Device::instance) return Device::instance;

        Device *device = nullptr;

#ifdef CC_USE_NVN
        if (tryCreate<CCNVNDevice>(info, &device)) return device;
#endif

#ifdef CC_USE_VULKAN
        if (tryCreate<CCVKDevice>(info, &device)) return device;
#endif

#ifdef CC_USE_METAL
        if (tryCreate<CCMTLDevice>(info, &device)) return device;
#endif

#ifdef CC_USE_GLES3
        if (tryCreate<GLES3Device>(info, &device)) return device;
#endif

#ifdef CC_USE_GLES2
        if (tryCreate<GLES2Device>(info, &device)) return device;
#endif

        if (tryCreate<EmptyDevice>(info, &device)) return device;

        return nullptr;
    }

    static void destroy() {
        CC_SAFE_DESTROY(Device::instance);
    }

    static void addSurfaceEventListener() {
        Device *device = Device::instance;
        EventDispatcher::addCustomEventListener(EVENT_DESTROY_WINDOW, [device](const CustomEvent &e) -> void {
            device->destroySurface(e.args->ptrVal);
        });

        EventDispatcher::addCustomEventListener(EVENT_RECREATE_WINDOW, [device](const CustomEvent &e) -> void {
            device->createSurface(e.args->ptrVal);
        });
    }

private:
    template <typename DeviceCtor, typename Enable = std::enable_if_t<std::is_base_of<Device, DeviceCtor>::value>>
    static bool tryCreate(const DeviceInfo &info, Device **pDevice) {
        Device *device = CC_NEW(DeviceCtor);

        if (DETACH_DEVICE_THREAD) {
            device = CC_NEW(gfx::DeviceAgent(device));
        }

        if (CC_DEBUG > 0 && !FORCE_DISABLE_VALIDATION || FORCE_ENABLE_VALIDATION) {
            device = CC_NEW(gfx::DeviceValidator(device));
        }

        if (!device->initialize(info)) {
            CC_SAFE_DELETE(device);
            return false;
        }

        addSurfaceEventListener();
        *pDevice = device;

        return true;
    }

#ifndef CC_DEBUG
    static constexpr int CC_DEBUG{0};
#endif
};

} // namespace gfx
} // namespace cc
