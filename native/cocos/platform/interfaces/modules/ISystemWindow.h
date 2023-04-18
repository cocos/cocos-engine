/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#include <iostream>
#include "base/std/container/array.h"
#include "math/Geometry.h"
#include "platform/interfaces/OSInterface.h"

namespace cc {

class CC_DLL ISystemWindow : public OSInterface {
public:
    static constexpr uint32_t mainWindowId = 1;

    using Size = cc::Size;
    enum WindowFlags {
        /* !!! FIXME: change this to name = (1<<x). */
        CC_WINDOW_FULLSCREEN = 0x00000001,    /**< fullscreen window */
        CC_WINDOW_OPENGL = 0x00000002,        /**< window usable with OpenGL context */
        CC_WINDOW_SHOWN = 0x00000004,         /**< window is visible */
        CC_WINDOW_HIDDEN = 0x00000008,        /**< window is not visible */
        CC_WINDOW_BORDERLESS = 0x00000010,    /**< no window decoration */
        CC_WINDOW_RESIZABLE = 0x00000020,     /**< window can be resized */
        CC_WINDOW_MINIMIZED = 0x00000040,     /**< window is minimized */
        CC_WINDOW_MAXIMIZED = 0x00000080,     /**< window is maximized */
        CC_WINDOW_INPUT_GRABBED = 0x00000100, /**< window has grabbed input focus */
        CC_WINDOW_INPUT_FOCUS = 0x00000200,   /**< window has input focus */
        CC_WINDOW_MOUSE_FOCUS = 0x00000400,   /**< window has mouse focus */
        CC_WINDOW_FULLSCREEN_DESKTOP = (CC_WINDOW_FULLSCREEN | 0x00001000),
        CC_WINDOW_FOREIGN = 0x00000800,       /**< window not created by SDL */
        CC_WINDOW_ALLOW_HIGHDPI = 0x00002000, /**< window should be created in high-DPI mode if supported.
                                                     On macOS NSHighResolutionCapable must be set true in the
                                                     application's Info.plist for this to have any effect. */
        CC_WINDOW_MOUSE_CAPTURE = 0x00004000, /**< window has mouse captured (unrelated to INPUT_GRABBED) */
        CC_WINDOW_ALWAYS_ON_TOP = 0x00008000, /**< window should always be above others */
        CC_WINDOW_SKIP_TASKBAR = 0x00010000,  /**< window should not be added to the taskbar */
        CC_WINDOW_UTILITY = 0x00020000,       /**< window should be treated as a utility window */
        CC_WINDOW_TOOLTIP = 0x00040000,       /**< window should be treated as a tooltip */
        CC_WINDOW_POPUP_MENU = 0x00080000,    /**< window should be treated as a popup menu */
        CC_WINDOW_VULKAN = 0x10000000         /**< window usable for Vulkan surface */
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
    virtual bool createWindow(const char* title,
                              int x, int y, int w,
                              int h, int flags) {
        return true;
    }
    /**
     * @brief Create a window displayed in the bottom left.
     *@param title: Window title
     *@param w: Window width
     *@param h: Window height
     *@param flags: Window flag
     */
    virtual bool createWindow(const char* title,
                              int w, int h, int flags) {
        return true;
    }

    /**
     * Get the window's unique ID
     */
    virtual uint32_t getWindowId() const = 0;

    virtual void closeWindow() {}
    virtual uintptr_t getWindowHandle() const = 0;
    virtual Size getViewSize() const = 0;
    virtual void setViewSize(uint32_t width, uint32_t height) {}
    /**
     @brief enable/disable(lock) the cursor, default is enabled
     */
    virtual void setCursorEnabled(bool value) = 0;
};

} // namespace cc
