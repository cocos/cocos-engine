/****************************************************************************
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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
#include "math/Vec2.h"
#include <array>
#include <iostream>

namespace cc {

class ISystemWindow : public OSInterface {
public:
    using Size = cc::Vec2;
    using WindowFlags = enum {
        /* !!! FIXME: change this to name = (1<<x). */
        CC_WINDOW_FULLSCREEN         = 0x00000001, /**< fullscreen window */
        CC_WINDOW_OPENGL             = 0x00000002, /**< window usable with OpenGL context */
        CC_WINDOW_SHOWN              = 0x00000004, /**< window is visible */
        CC_WINDOW_HIDDEN             = 0x00000008, /**< window is not visible */
        CC_WINDOW_BORDERLESS         = 0x00000010, /**< no window decoration */
        CC_WINDOW_RESIZABLE          = 0x00000020, /**< window can be resized */
        CC_WINDOW_MINIMIZED          = 0x00000040, /**< window is minimized */
        CC_WINDOW_MAXIMIZED          = 0x00000080, /**< window is maximized */
        CC_WINDOW_INPUT_GRABBED      = 0x00000100, /**< window has grabbed input focus */
        CC_WINDOW_INPUT_FOCUS        = 0x00000200, /**< window has input focus */
        CC_WINDOW_MOUSE_FOCUS        = 0x00000400, /**< window has mouse focus */
        CC_WINDOW_FULLSCREEN_DESKTOP = (CC_WINDOW_FULLSCREEN | 0x00001000),
        CC_WINDOW_FOREIGN            = 0x00000800, /**< window not created by SDL */
        CC_WINDOW_ALLOW_HIGHDPI      = 0x00002000, /**< window should be created in high-DPI mode if supported.
                                                     On macOS NSHighResolutionCapable must be set true in the
                                                     application's Info.plist for this to have any effect. */
        CC_WINDOW_MOUSE_CAPTURE      = 0x00004000, /**< window has mouse captured (unrelated to INPUT_GRABBED) */
        CC_WINDOW_ALWAYS_ON_TOP      = 0x00008000, /**< window should always be above others */
        CC_WINDOW_SKIP_TASKBAR       = 0x00010000, /**< window should not be added to the taskbar */
        CC_WINDOW_UTILITY            = 0x00020000, /**< window should be treated as a utility window */
        CC_WINDOW_TOOLTIP            = 0x00040000, /**< window should be treated as a tooltip */
        CC_WINDOW_POPUP_MENU         = 0x00080000, /**< window should be treated as a popup menu */
        CC_WINDOW_VULKAN             = 0x10000000  /**< window usable for Vulkan surface */
    };

    /**
     * @brief Create window.
     *@param title: Window title
     *@param x: x-axis coordinate
     *@param y: y-axis coordinate
     *@param w: Window width
     *@param h: Window height
     *@param flags: Window flag
     */
    virtual bool       createWindow(const char* title,
                                    int x, int y, int w,
                                    int h, int flags) = 0;
    virtual uintptr_t  getWindowHandler() const       = 0;
    virtual Size getViewSize() const            = 0;
    /**
     @brief enable/disable(lock) the cursor, default is enabled
     */
    virtual void setCursorEnabled(bool value) = 0;

    virtual void copyTextToClipboard(const std::string& text) = 0;
    /**
     @brief Create default sytem window interface.
     @return sytem window interface.
     */
    static OSInterface::Ptr createSystemWindowInterface();

private:
};

} // namespace cc
