/****************************************************************************
 Copyright (c) 2018-2022 Xiamen Yaji Software Co., Ltd.

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

#include "platform/java/modules/CanvasRenderingContext2DDelegate.h"

namespace {

} // namespace

#define CLAMP(V, HI) std::min((V), (HI))

namespace cc {
CanvasRenderingContext2DDelegate::CanvasRenderingContext2DDelegate() {
    jobject obj = JniHelper::newObject(JCLS_CANVASIMPL);
    _obj        = JniHelper::getEnv()->NewGlobalRef(obj);
    ccDeleteLocalRef(JniHelper::getEnv(), obj);
}

CanvasRenderingContext2DDelegate::~CanvasRenderingContext2DDelegate() {
    JniHelper::getEnv()->DeleteGlobalRef(_obj);
}

void CanvasRenderingContext2DDelegate::recreateBuffer(float w, float h) {
    _bufferWidth  = w;
    _bufferHeight = h;
    if (_bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "recreateBuffer", w, h);
    fillData();
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
    fillData();
}

void CanvasRenderingContext2DDelegate::fill() {
    if (_bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }

    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "fill");
    fillData();
}

void CanvasRenderingContext2DDelegate::rect(float x, float y, float w, float h) {
    if (_bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "rect", x, y, w, h);
    fillData();
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
    fillData();
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
    fillData();
}

void CanvasRenderingContext2DDelegate::fillText(const std::string &text, float x, float y, float maxWidth) {
    if (text.empty() || _bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "fillText", text, x, y, maxWidth);
    fillData();
}

void CanvasRenderingContext2DDelegate::strokeText(const std::string &text, float x, float y, float maxWidth) {
    if (text.empty() || _bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "strokeText", text, x, y, maxWidth);
    fillData();
}

CanvasRenderingContext2DDelegate::Size CanvasRenderingContext2DDelegate::measureText(const std::string &text) {
    if (text.empty()) {
        return std::array<float, 2>{0.0F, 0.0F};
    }
    float measureText1 = JniHelper::callObjectFloatMethod(_obj, JCLS_CANVASIMPL, "measureText", text);
    Size  size{measureText1, 0.0F};
    return size;
}

void CanvasRenderingContext2DDelegate::updateFont(const std::string &fontName, float fontSize, bool bold, bool italic, bool oblique, bool smallCaps) {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "updateFont", fontName, fontSize, bold, italic, oblique, smallCaps);
}

void CanvasRenderingContext2DDelegate::setLineCap(const std::string &lineCap) {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setLineCap", lineCap);
}

void CanvasRenderingContext2DDelegate::setLineJoin(const std::string &lineJoin) {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setLineJoin", lineJoin);
}

void CanvasRenderingContext2DDelegate::setTextAlign(CanvasTextAlign align) {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setTextAlign", static_cast<int>(align));
}

void CanvasRenderingContext2DDelegate::setTextBaseline(CanvasTextBaseline baseline) {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setTextBaseline", static_cast<int>(baseline));
}

void CanvasRenderingContext2DDelegate::setFillStyle(float r, float g, float b, float a) {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setFillStyle", r, g, b, a);
}

void CanvasRenderingContext2DDelegate::setStrokeStyle(float r, float g, float b, float a) {
    JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setStrokeStyle", r, g, b, a);
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

    fillData();
}

void CanvasRenderingContext2DDelegate::fillData() {
    jbyteArray arr = JniHelper::callObjectByteArrayMethod(_obj, JCLS_CANVASIMPL, "getDataRef");
    if (arr == nullptr) {
        SE_LOGE("getDataRef return null in fillData, size: %d, %d", (int)_bufferWidth, (int)_bufferHeight);
        return;
    }
    jsize len     = JniHelper::getEnv()->GetArrayLength(arr);
    auto *jbarray = static_cast<jbyte *>(malloc(len * sizeof(jbyte)));
    JniHelper::getEnv()->GetByteArrayRegion(arr, 0, len, jbarray);
#if CC_PLATFORM != CC_PLATFORM_OHOS
    unMultiplyAlpha(reinterpret_cast<unsigned char *>(jbarray), len);
#endif
    _data.fastSet(reinterpret_cast<unsigned char *>(jbarray), len); //IDEA: DON'T create new jbarray every time.
    ccDeleteLocalRef(JniHelper::getEnv(), arr);
}

void CanvasRenderingContext2DDelegate::unMultiplyAlpha(unsigned char *ptr, ssize_t size) { // NOLINT(readability-convert-member-functions-to-static)
    // Android source data is not premultiplied alpha when API >= 19
    // please refer CanvasRenderingContext2DImpl::recreateBuffer(float w, float h)
    // in CanvasRenderingContext2DImpl.java
    //        if (getAndroidSDKInt() >= 19)
    //            return;

    float alpha;
    for (int i = 0; i < size; i += 4) {
        alpha = static_cast<float>(ptr[i + 3]);
        if (alpha > 0) {
            ptr[i]     = CLAMP((int)((float)ptr[i] / alpha * 255), 255);
            ptr[i + 1] = CLAMP((int)((float)ptr[i + 1] / alpha * 255), 255);
            ptr[i + 2] = CLAMP((int)((float)ptr[i + 2] / alpha * 255), 255);
        }
    }
}
} // namespace cc