/****************************************************************************
 Copyright (c) 2018-2023 Xiamen Yaji Software Co., Ltd.

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

#include "platform/java/modules/CanvasRenderingContext2DDelegate.h"

#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include <android/bitmap.h>
#else
    #include <multimedia/image/image_pixel_map.h>
#endif

namespace {

} // namespace

#define CLAMP(V, HI) std::min((V), (HI))

namespace cc {
CanvasRenderingContext2DDelegate::CanvasRenderingContext2DDelegate() {
    jobject obj = JniHelper::newObject(JCLS_CANVASIMPL);
    _obj = JniHelper::getEnv()->NewGlobalRef(obj);
    ccDeleteLocalRef(JniHelper::getEnv(), obj);
}

CanvasRenderingContext2DDelegate::~CanvasRenderingContext2DDelegate() {
    JniHelper::getEnv()->DeleteGlobalRef(_obj);
}

void CanvasRenderingContext2DDelegate::recreateBuffer(float w, float h) {
    _bufferWidth = w;
    _bufferHeight = h;
    if (_bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "recreateBuffer", w, h);
}

void CanvasRenderingContext2DDelegate::beginPath() {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "beginPath");
}

void CanvasRenderingContext2DDelegate::closePath() {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "closePath");
}

void CanvasRenderingContext2DDelegate::moveTo(float x, float y) {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "moveTo", x, y);
}

void CanvasRenderingContext2DDelegate::lineTo(float x, float y) {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "lineTo", x, y);
}

void CanvasRenderingContext2DDelegate::stroke() {
    if (_bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }

    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "stroke");
}

void CanvasRenderingContext2DDelegate::fill() {
    if (_bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }

    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "fill");
}

void CanvasRenderingContext2DDelegate::rect(float x, float y, float w, float h) {
    if (_bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "rect", x, y, w, h);
}

void CanvasRenderingContext2DDelegate::saveContext() {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "saveContext");
}

void CanvasRenderingContext2DDelegate::restoreContext() {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "restoreContext");
}

void CanvasRenderingContext2DDelegate::clearRect(float x, float y, float w, float h) {
    if (_bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }
    if (x >= _bufferWidth || y >= _bufferHeight) {
        return;
    }
    if (x + w > _bufferWidth) {
        w = _bufferWidth - x;
    }
    if (y + h > _bufferHeight) {
        h = _bufferHeight - y;
    }
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "clearRect", x, y, w, h);
}

void CanvasRenderingContext2DDelegate::fillRect(float x, float y, float w, float h) {
    if (_bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }
    if (x >= _bufferWidth || y >= _bufferHeight) {
        return;
    }
    if (x + w > _bufferWidth) {
        w = _bufferWidth - x;
    }
    if (y + h > _bufferHeight) {
        h = _bufferHeight - y;
    }
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "fillRect", x, y, w, h);
}

void CanvasRenderingContext2DDelegate::fillText(const ccstd::string &text, float x, float y, float maxWidth) {
    if (text.empty() || _bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "fillText", text, x, y, maxWidth);
}

void CanvasRenderingContext2DDelegate::strokeText(const ccstd::string &text, float x, float y, float maxWidth) {
    if (text.empty() || _bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "strokeText", text, x, y, maxWidth);
}

CanvasRenderingContext2DDelegate::Size CanvasRenderingContext2DDelegate::measureText(const ccstd::string &text) {
    if (text.empty()) {
        return ccstd::array<float, 2>{0.0F, 0.0F};
    }
    float measureText1 = JniHelper::callObjectFloatMethod(_obj, JCLS_CANVASIMPL, "measureText", text);
    Size size{measureText1, 0.0F};
    return size;
}

void CanvasRenderingContext2DDelegate::updateFont(const ccstd::string &fontName, float fontSize, bool bold, bool italic, bool oblique, bool smallCaps) {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "updateFont", fontName, fontSize, bold, italic, oblique, smallCaps);
}

void CanvasRenderingContext2DDelegate::setLineCap(const ccstd::string &lineCap) {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setLineCap", lineCap);
}

void CanvasRenderingContext2DDelegate::setLineJoin(const ccstd::string &lineJoin) {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setLineJoin", lineJoin);
}

void CanvasRenderingContext2DDelegate::setTextAlign(TextAlign align) {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setTextAlign", static_cast<int>(align));
}

void CanvasRenderingContext2DDelegate::setTextBaseline(TextBaseline baseline) {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setTextBaseline", static_cast<int>(baseline));
}

void CanvasRenderingContext2DDelegate::setFillStyle(uint8_t r, uint8_t g, uint8_t b, uint8_t a) {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setFillStyle",
                                    static_cast<jint>(r),
                                    static_cast<jint>(g),
                                    static_cast<jint>(b),
                                    static_cast<jint>(a));
}

void CanvasRenderingContext2DDelegate::setStrokeStyle(uint8_t r, uint8_t g, uint8_t b, uint8_t a) {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setStrokeStyle",
                                    static_cast<jint>(r),
                                    static_cast<jint>(g),
                                    static_cast<jint>(b),
                                    static_cast<jint>(a));
}

void CanvasRenderingContext2DDelegate::setLineWidth(float lineWidth) {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setLineWidth", lineWidth);
}

const cc::Data &CanvasRenderingContext2DDelegate::getDataRef() const {
    return _data;
}

void CanvasRenderingContext2DDelegate::fillImageData(const Data &imageData, float imageWidth, float imageHeight, float offsetX, float offsetY) {
    if (_bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }

    auto *arr = JniHelper::getEnv()->NewIntArray(imageData.getSize() / 4);
    JniHelper::getEnv()->SetIntArrayRegion(arr, 0, imageData.getSize() / 4,
                                           reinterpret_cast<const jint *>(imageData.getBytes()));
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "_fillImageData", arr, imageWidth,
                                    imageHeight, offsetX, offsetY);
    ccDeleteLocalRef(JniHelper::getEnv(), arr);
}

void CanvasRenderingContext2DDelegate::updateData() {
    jobject bmpObj = nullptr;
    JniMethodInfo methodInfo;
#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    if (JniHelper::getMethodInfo(methodInfo, JCLS_CANVASIMPL, "getBitmap", "()Landroid/graphics/Bitmap;")) {
        bmpObj = methodInfo.env->CallObjectMethod(_obj, methodInfo.methodID);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    }
#else
    if (JniHelper::getMethodInfo(methodInfo, JCLS_CANVASIMPL, "getBitmap", "()Lohos/media/image/PixelMap;")) {
        bmpObj = methodInfo.env->CallObjectMethod(_obj, methodInfo.methodID);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    }
#endif
    JNIEnv *env = JniHelper::getEnv();
    do {
        if (nullptr == bmpObj) {
            break;
        }
#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
        AndroidBitmapInfo bmpInfo;
        if (AndroidBitmap_getInfo(env, bmpObj, &bmpInfo) != ANDROID_BITMAP_RESULT_SUCCESS) {
            CC_LOG_ERROR("AndroidBitmap_getInfo() failed ! error");
            break;
        }
        if (bmpInfo.width < 1 || bmpInfo.height < 1) {
            break;
        }

        void *pixelData;
        if (AndroidBitmap_lockPixels(env, bmpObj, &pixelData) != ANDROID_BITMAP_RESULT_SUCCESS) {
            CC_LOG_ERROR("AndroidBitmap_lockPixels() failed ! error");
            break;
        }

        uint32_t size = bmpInfo.stride * bmpInfo.height;
#else
        OhosPixelMapInfo bmpInfo;
        void *pixelData = nullptr;
        if (GetImageInfo(env, bmpObj, bmpInfo) ==
                OHOS_IMAGE_RESULT_SUCCESS &&
            bmpInfo.width > 0 &&
            bmpInfo.height > 0 &&
            bmpInfo.pixelFormat == OHOS_PIXEL_MAP_FORMAT_RGBA_8888) {
            if (AccessPixels(env, bmpObj, &pixelData) != OHOS_IMAGE_RESULT_SUCCESS) {
                CC_LOG_ERROR("AccessPixels() failed ! error");
                break;
            }
        } else {
            break;
        }
        uint32_t size = bmpInfo.rowSize * bmpInfo.height;
#endif
        auto *bmpData = static_cast<jbyte *>(malloc(size));
        memcpy(bmpData, pixelData, size);
#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
        unMultiplyAlpha(reinterpret_cast<unsigned char *>(bmpData), size);
#endif
        _data.fastSet(reinterpret_cast<unsigned char *>(bmpData), size);

#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
        AndroidBitmap_unlockPixels(env, bmpObj);
#else
        UnAccessPixels(env, bmpObj);
#endif
    } while (false);
    if (bmpObj) {
        env->DeleteLocalRef(bmpObj);
    }
}

void CanvasRenderingContext2DDelegate::unMultiplyAlpha(unsigned char *ptr, uint32_t size) { // NOLINT(readability-convert-member-functions-to-static)
    // Android source data is not premultiplied alpha when API >= 19
    // please refer CanvasRenderingContext2DImpl::recreateBuffer(float w, float h)
    // in CanvasRenderingContext2DImpl.java
    //        if (getAndroidSDKInt() >= 19)
    //            return;

    float alpha;
    for (int i = 0; i < size; i += 4) {
        alpha = static_cast<float>(ptr[i + 3]);
        if (alpha > 0) {
            ptr[i] = CLAMP((int)((float)ptr[i] / alpha * 255), 255);
            ptr[i + 1] = CLAMP((int)((float)ptr[i + 1] / alpha * 255), 255);
            ptr[i + 2] = CLAMP((int)((float)ptr[i + 2] / alpha * 255), 255);
        }
    }
}

void CanvasRenderingContext2DDelegate::setShadowBlur(float blur) {
#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setShadowBlur", blur);
#else
    CC_LOG_WARNING("shadowBlur not implemented");
#endif
}

void CanvasRenderingContext2DDelegate::setShadowColor(uint8_t r, uint8_t g, uint8_t b, uint8_t a) {
#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setShadowColor",
                                    static_cast<jint>(r),
                                    static_cast<jint>(g),
                                    static_cast<jint>(b),
                                    static_cast<jint>(a));
#else
    CC_LOG_WARNING("shadowColor not implemented");
#endif
}

void CanvasRenderingContext2DDelegate::setShadowOffsetX(float offsetX) {
#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setShadowOffsetX", offsetX);
#else
    CC_LOG_WARNING("shadowOffsetX not implemented");
#endif
}

void CanvasRenderingContext2DDelegate::setShadowOffsetY(float offsetY) {
#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setShadowOffsetY", offsetY);
#else
    CC_LOG_WARNING("shadowOffsetY not implemented");
#endif
}

} // namespace cc
