/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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
#include "gfx-empty/EmptyDevice.h"

#ifdef CC_USE_VULKAN
    #include "gfx-vulkan/GFXVulkan.h"
#endif

#ifdef CC_USE_METAL
    #include "gfx-metal/GFXMTL.h"
#endif

#ifdef CC_USE_GLES3
    #include "gfx-gles3/GFXGLES3.h"
#endif

#ifdef CC_USE_GLES2
    #include "gfx-gles2/GFXGLES2.h"
#endif

namespace cc {
namespace gfx {

class CC_DLL DeviceCreator final {
public:
    static Device *createDevice(const DeviceInfo &info) {
        Device *device = nullptr;

#ifdef CC_USE_VULKAN
        if (tryCreate<CCVKDevice>(info, device)) return device;
#endif

#ifdef CC_USE_METAL
        if (tryCreate<CCMTLDevice>(info, device)) return device;
#endif

#ifdef CC_USE_GLES3
        if (tryCreate<GLES3Device>(info, device)) return device;
#endif

#ifdef CC_USE_GLES2
        if (tryCreate<GLES2Device>(info, device)) return device;
#endif

        if (tryCreate<EmptyDevice>(info, device)) return device;

        return nullptr;
    }

private:
    template <typename DeviceCtor, typename Enable = std::enable_if_t<std::is_base_of<Device, DeviceCtor>::value>>
    static bool tryCreate(const DeviceInfo &info, Device *&device) {
        device = CC_NEW(DeviceCtor);

        device = CC_NEW(gfx::DeviceAgent(device));

        if (!device->initialize(info)) {
            CC_SAFE_DELETE(device);
            return false;
        }

        EventDispatcher::addCustomEventListener(EVENT_DESTROY_WINDOW, [device](const CustomEvent &e) -> void {
            DeviceCreator::releaseSurface(device, reinterpret_cast<uintptr_t>(e.args->ptrVal));
        });

        EventDispatcher::addCustomEventListener(EVENT_RECREATE_WINDOW, [device](const CustomEvent &e) -> void {
            DeviceCreator::acquireSurface(device, reinterpret_cast<uintptr_t>(e.args->ptrVal));
        });

        return true;
    }

    static void releaseSurface(Device *device, uintptr_t windowHandle) { device->releaseSurface(windowHandle); }
    static void acquireSurface(Device *device, uintptr_t windowHandle) { device->acquireSurface(windowHandle); }
};

} // namespace gfx
} // namespace cc
