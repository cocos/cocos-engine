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

#include "platform/java/modules/CommonScreen.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "platform/java/jni/JniImp.h"

namespace {
// constant from Android API:
// reference: https://developer.android.com/reference/android/view/Surface#ROTATION_0
enum Rotation {
    ROTATION_0 = 0,
    ROTATION_90,
    ROTATION_180,
    ROTATION_270
};
} // namespace

namespace cc {

// int Screen::getDPI() {
//     static int dpi = -1;
//     if (dpi == -1) {
//         AConfiguration *config = AConfiguration_new();
//         //AConfiguration_fromAssetManager(config, cocosApp.assetManager);
//         int32_t density = AConfiguration_getDensity(config);
//         AConfiguration_delete(config);
//         const int stdDpi = 160;
//         dpi              = density * stdDpi;
//     }
//     return dpi;
// }

float CommonScreen::getDevicePixelRatio() const {
    return 1;
}

void CommonScreen::setKeepScreenOn(bool keepScreenOn) {
    // JniHelper::callStaticVoidMethod(JCLS_HELPER, "setKeepScreenOn", value);
    //    ANativeActivity_setWindowFlags(JniHelper::getAndroidApp()->activity, AWINDOW_FLAG_KEEP_SCREEN_ON, 0);
    //CC_UNUSED_PARAM(keepScreenOn);
    return setKeepScreenOnJNI(keepScreenOn);
}

IScreen::Orientation CommonScreen::getDeviceOrientation() const {
    int rotation = getDeviceRotationJNI();
    switch (rotation) {
        case ROTATION_0:
            return Orientation::PORTRAIT;
        case ROTATION_90:
            return Orientation::LANDSCAPE_RIGHT;
        case ROTATION_180:
            return Orientation::PORTRAIT_UPSIDE_DOWN;
        case ROTATION_270:
            return Orientation::LANDSCAPE_LEFT;
        default:
            break;
    }
    return Orientation::PORTRAIT;
}

Vec4 CommonScreen::getSafeAreaEdge() const {
    float *data = getSafeAreaEdgeJNI();
    return cc::Vec4(data[0], data[1], data[2], data[3]);
}

bool CommonScreen::isDisplayStats() { //NOLINT
    se::AutoHandleScope hs;
    se::Value ret;
    char commandBuf[100] = "cc.debug.isDisplayStats();";
    se::ScriptEngine::getInstance()->evalString(commandBuf, 100, &ret);
    return ret.toBoolean();
}

void CommonScreen::setDisplayStats(bool isShow) { //NOLINT
    se::AutoHandleScope hs;
    char commandBuf[100] = {0};
    sprintf(commandBuf, "cc.debug.setDisplayStats(%s);", isShow ? "true" : "false");
    se::ScriptEngine::getInstance()->evalString(commandBuf);
}

} // namespace cc