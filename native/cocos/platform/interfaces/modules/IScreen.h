/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#include "math/Vec4.h"
#include "platform/interfaces/OSInterface.h"

namespace cc {
class IScreen : public OSInterface {
public:
    virtual int   getDPI() const              = 0;
    virtual float getDevicePixelRatio() const = 0;

    // https://developer.mozilla.org/en-US/docs/Web/API/Window/orientation
    enum class Orientation {
        PORTRAIT             = 0,
        LANDSCAPE_LEFT       = -90,
        PORTRAIT_UPSIDE_DOWN = 180,
        LANDSCAPE_RIGHT      = 90
    };
    virtual Orientation getDeviceOrientation() const = 0;

    /**
     @brief Get current display stats.
     @return bool, is displaying stats or not.
     */
    virtual bool isDisplayStats() = 0;

    /**
     @brief set display stats information.
     */
    virtual void setDisplayStats(bool isShow) = 0;

    /**
     * Controls whether the screen should remain on.
     *
     * @param keepScreenOn One flag indicating that the screen should remain on.
     */
    virtual void setKeepScreenOn(bool keepScreenOn) = 0;

    virtual Vec4 getSafeAreaEdge() const = 0;
    /**
     @brief Create default screen interface.
     @return screen interface.
     */
    static OSInterface::Ptr createScreenInterface();

private:
};
} // namespace cc