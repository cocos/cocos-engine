/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "platform/openharmony/modules/Screen.h"
#include "platform/openharmony/napi/NapiHelper.h"

#include "bindings/jswrapper/SeApi.h"

namespace cc {

int Screen::getDPI() const {
    auto dpi = NapiHelper::napiCallFunction("getDPI");
    if (dpi.IsNumber()) {
        return dpi.As<Napi::Number>().Int32Value();
    }
    return 0;
}

float Screen::getDevicePixelRatio() const {
    // float value;
    // NapiHelper::napiCallFunction("getPixelRation", &value);
    // return value;
    // TODO(qgh):openharmony does support this interface, but returning a value of 1.5 will cause the entire page to zoom in.
    return 1;
}

Screen::Orientation Screen::getDeviceOrientation() const {
    auto dpi = NapiHelper::napiCallFunction("getDeviceOrientation");
    int32_t value = 0;
    if (dpi.IsNumber()) {
        value = dpi.As<Napi::Number>().Int32Value();
    }

    if(value == 0) {
        return Orientation::PORTRAIT;
    } else if(value == 1) {
        return Orientation::LANDSCAPE_LEFT;
    } else if(value == 2) {
        return Orientation::PORTRAIT_UPSIDE_DOWN;
    } else if(value == 3) {
        return Orientation::LANDSCAPE_RIGHT;
    }
    CC_ASSERT(false);
    return Orientation::PORTRAIT;
}

void Screen::setKeepScreenOn(bool value) {
    CC_UNUSED_PARAM(value);
}

Vec4 Screen::getSafeAreaEdge() const {
    // screen with enabled cutout area
    auto value = NapiHelper::napiCallFunction("getDeviceOrientation");
    auto height = NapiHelper::napiCallFunction("getCutoutHeight");
    auto width = NapiHelper::napiCallFunction("getCutoutWidth");
    int32_t orientation = 0;
    int32_t cutout_height = 0;
    int32_t cutout_width = 0;

    if (value.IsNumber()) {
        orientation = value.As<Napi::Number>().Int32Value();
    }
    if (height.IsNumber()) {
        cutout_height = height.As<Napi::Number>().Int32Value();
    }
    if (width.IsNumber()) {
        cutout_width = width.As<Napi::Number>().Int32Value();
    }
    float safearea_top = 0.0f;
    float safearea_left = 0.0f;
    float safearea_bottom = 0.0f;
    float safearea_right = 0.0f;
    if(0 == orientation) {
        safearea_top += cutout_height;
    } else if(1 == orientation) {
        safearea_right += cutout_width;
    } else if(2 == orientation) {
        safearea_bottom += cutout_height;
    } else if(3 == orientation) {
        safearea_left += cutout_width;
    }

    return Vec4(safearea_top, safearea_left, safearea_bottom, safearea_right);
}

bool Screen::isDisplayStats() {
    se::AutoHandleScope hs;
    se::Value ret;
    const char commandBuf[100] = "cc.profiler.isShowingStats();";
    se::ScriptEngine::getInstance()->evalString(commandBuf, 100, &ret);
    return ret.toBoolean();
}

void Screen::setDisplayStats(bool isShow) {
    se::AutoHandleScope hs;
    char commandBuf[100] = {0};
    sprintf(commandBuf, isShow ? "cc.profiler.showStats();" : "cc.profiler.hideStats();");
    se::ScriptEngine::getInstance()->evalString(commandBuf);
}


} // namespace cc