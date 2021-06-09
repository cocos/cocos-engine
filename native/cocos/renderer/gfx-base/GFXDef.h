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

#include "GFXDef-common.h"

namespace cc {
namespace gfx {

enum class VsyncMode {
    // The application does not synchronizes with the vertical sync.
    // If application renders faster than the display refreshes, frames are wasted and tearing may be observed.
    // FPS is uncapped. Maximum power consumption. If unsupported, "ON" value will be used instead. Minimum latency.
    OFF,
    // The application is always synchronized with the vertical sync. Tearing does not happen.
    // FPS is capped to the display's refresh rate. For fast applications, battery life is improved. Always supported.
    ON,
    // The application synchronizes with the vertical sync, but only if the application rendering speed is greater than refresh rate.
    // Compared to OFF, there is no tearing. Compared to ON, the FPS will be improved for "slower" applications.
    // If unsupported, "ON" value will be used instead. Recommended for most applications. Default if supported.
    RELAXED,
    // The presentation engine will always use the latest fully rendered image.
    // Compared to OFF, no tearing will be observed.
    // Compared to ON, battery power will be worse, especially for faster applications.
    // If unsupported,  "OFF" will be attempted next.
    MAILBOX,
    // The application is capped to using half the vertical sync time.
    // FPS artificially capped to Half the display speed (usually 30fps) to maintain battery.
    // Best possible battery savings. Worst possible performance.
    // Recommended for specific applications where battery saving is critical.
    HALF,
};

struct DeviceInfo {
    bool               isAntiAlias  = false;
    uintptr_t          windowHandle = 0U;
    uint               width        = 0U;
    uint               height       = 0U;
    float              pixelRatio   = 1.0F;
    BindingMappingInfo bindingMappingInfo;
};

enum class Performance {
    HIGH_QUALITY,
    LOW_POWER,
    //BALANCE,
};

struct ContextInfo {
    bool        msaaEnabled  = false;
    Performance performance  = Performance::LOW_POWER;
    VsyncMode   vsyncMode    = VsyncMode::RELAXED;
    uintptr_t   windowHandle = 0;
    Context*    sharedCtx    = nullptr;
};

constexpr TextureUsage TEXTURE_USAGE_TRANSIENT = static_cast<TextureUsage>(
    static_cast<uint>(TextureUsageBit::COLOR_ATTACHMENT) |
    static_cast<uint>(TextureUsageBit::DEPTH_STENCIL_ATTACHMENT) |
    static_cast<uint>(TextureUsageBit::INPUT_ATTACHMENT));

constexpr DescriptorType DESCRIPTOR_BUFFER_TYPE = static_cast<DescriptorType>(
    static_cast<uint>(DescriptorType::STORAGE_BUFFER) |
    static_cast<uint>(DescriptorType::DYNAMIC_STORAGE_BUFFER) |
    static_cast<uint>(DescriptorType::UNIFORM_BUFFER) |
    static_cast<uint>(DescriptorType::DYNAMIC_UNIFORM_BUFFER));

constexpr DescriptorType DESCRIPTOR_TEXTURE_TYPE = static_cast<DescriptorType>(
    static_cast<uint>(DescriptorType::SAMPLER_TEXTURE) |
    static_cast<uint>(DescriptorType::SAMPLER) |
    static_cast<uint>(DescriptorType::TEXTURE) |
    static_cast<uint>(DescriptorType::STORAGE_IMAGE) |
    static_cast<uint>(DescriptorType::INPUT_ATTACHMENT));

constexpr DescriptorType DESCRIPTOR_DYNAMIC_TYPE = static_cast<DescriptorType>(
    static_cast<uint>(DescriptorType::DYNAMIC_STORAGE_BUFFER) |
    static_cast<uint>(DescriptorType::DYNAMIC_UNIFORM_BUFFER));

constexpr uint DRAW_INFO_SIZE = 28U;

extern const FormatInfo GFX_FORMAT_INFOS[];
extern const uint       GFX_TYPE_SIZES[];

extern uint formatSize(Format format, uint width, uint height, uint depth);

extern uint formatSurfaceSize(Format format, uint width, uint height, uint depth, uint mips);

} // namespace gfx
} // namespace cc
