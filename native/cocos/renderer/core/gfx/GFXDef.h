#ifndef CC_CORE_GFX_DEF_H_
#define CC_CORE_GFX_DEF_H_

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
    uintptr_t          windowHandle = 0;
    uint               width        = 0;
    uint               height       = 0;
    uint               nativeWidth  = 0;
    uint               nativeHeight = 0;
    Context *          sharedCtx    = nullptr;
    BindingMappingInfo bindingMappingInfo;
};

struct WindowInfo {
    String      title;
    int         left            = 0;
    int         top             = 0;
    uint        width           = 800;
    uint        height          = 600;
    Format      colorFmt        = Format::UNKNOWN;
    Format      depthStencilFmt = Format::UNKNOWN;
    bool        isOffscreen     = false;
    bool        isFullscreen    = false;
    VsyncMode   vsyncMode       = VsyncMode::OFF;
    uintptr_t   windowHandle    = 0;
    RenderPass *renderPass      = nullptr;
};

struct ContextInfo {
    uintptr_t windowHandle = 0;
    Context * sharedCtx    = nullptr;
    VsyncMode vsyncMode    = VsyncMode::RELAXED;
};

extern const DescriptorType DESCRIPTOR_BUFFER_TYPE;
extern const DescriptorType DESCRIPTOR_TEXTURE_TYPE;
extern const DescriptorType DESCRIPTOR_DYNAMIC_TYPE;

extern const FormatInfo GFX_FORMAT_INFOS[];
extern const uint       GFX_TYPE_SIZES[];

extern uint FormatSize(Format format, uint width, uint height, uint depth);

extern uint FormatSurfaceSize(Format format, uint width, uint height, uint depth, uint mips);

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_DEF_H_
