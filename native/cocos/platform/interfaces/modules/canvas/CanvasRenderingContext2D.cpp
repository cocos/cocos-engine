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

#include "platform/interfaces/modules/canvas/CanvasRenderingContext2D.h"

#include <array>
#include <cstdint>
#include <regex>
#include "base/csscolorparser.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_platform.h"
#include "math/Math.h"
#include "platform/FileUtils.h"

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #include "platform/win32/modules/CanvasRenderingContext2DDelegate.h"
#elif (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_OHOS)
    #include "platform/java/modules/CanvasRenderingContext2DDelegate.h"
#elif (CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_MAC_IOS)
    #include "platform/apple/modules/CanvasRenderingContext2DDelegate.h"
#elif (CC_PLATFORM == CC_PLATFORM_LINUX)
    #include "platform/linux/modules/CanvasRenderingContext2DDelegate.h"
#elif (CC_PLATFORM == CC_PLATFORM_QNX)
    #include "platform/qnx/modules/CanvasRenderingContext2DDelegate.h"
#endif

using Vec2    = std::array<float, 2>;
using Color4F = std::array<float, 4>;

namespace {
void fillRectWithColor(uint8_t *buf, uint32_t totalWidth, uint32_t totalHeight, uint32_t x, uint32_t y, uint32_t width, uint32_t height, uint8_t r, uint8_t g, uint8_t b, uint8_t a) {
    assert(x + width <= totalWidth);
    assert(y + height <= totalHeight);

    uint32_t y0 = y;
    uint32_t y1 = y + height;
    uint8_t *p;
    for (uint32_t offsetY = y0; offsetY < y1; ++offsetY) {
        for (uint32_t offsetX = x; offsetX < (x + width); ++offsetX) {
            p    = buf + (totalWidth * offsetY + offsetX) * 4;
            *p++ = r;
            *p++ = g;
            *p++ = b;
            *p++ = a;
        }
    }
}
} // namespace

namespace cc {
//using Size    = std::array<float, 2>;
CanvasGradient::CanvasGradient() = default;

CanvasGradient::~CanvasGradient() = default;

void CanvasGradient::addColorStop(float offset, const std::string &color) {
    //SE_LOGD("CanvasGradient::addColorStop: %p\n", this);
}

// CanvasRenderingContext2D

CanvasRenderingContext2D::CanvasRenderingContext2D(float width, float height)
: _width(width),
  _height(height) {
    _delegate = new CanvasRenderingContext2DDelegate();
    //SE_LOGD("CanvasRenderingContext2D constructor: %p, width: %f, height: %f\n", this, width, height);
}

CanvasRenderingContext2D::~CanvasRenderingContext2D() {
    delete _delegate;
}

void CanvasRenderingContext2D::clearRect(float x, float y, float width, float height) {
    //SE_LOGD("CanvasRenderingContext2D::clearRect: %p, %f, %f, %f, %f\n", this, x, y, width, height);
    recreateBufferIfNeeded();
    _delegate->clearRect(x, y, width, height);
}

void CanvasRenderingContext2D::fillRect(float x, float y, float width, float height) {
    recreateBufferIfNeeded();
    _delegate->fillRect(x, y, width, height);

    if (_canvasBufferUpdatedCB != nullptr) {
        _canvasBufferUpdatedCB(_delegate->getDataRef());
    }
}

void CanvasRenderingContext2D::fillText(const std::string &text, float x, float y, float maxWidth) {
    //SE_LOGD("CanvasRenderingContext2D::fillText: %s, offset: (%f, %f), %f\n", text.c_str(), x, y, maxWidth);
    if (text.empty()) {
        return;
    }

    recreateBufferIfNeeded();

    _delegate->fillText(text, x, y, maxWidth);
    if (_canvasBufferUpdatedCB != nullptr) {
        _canvasBufferUpdatedCB(_delegate->getDataRef());
    }
}

void CanvasRenderingContext2D::strokeText(const std::string &text, float x, float y, float maxWidth) {
    //SE_LOGD("CanvasRenderingContext2D::strokeText: %s, %f, %f, %f\n", text.c_str(), x, y, maxWidth);
    if (text.empty()) {
        return;
    }

    recreateBufferIfNeeded();

    _delegate->strokeText(text, x, y, maxWidth);

    if (_canvasBufferUpdatedCB != nullptr) {
        _canvasBufferUpdatedCB(_delegate->getDataRef());
    }
}

cc::Size CanvasRenderingContext2D::measureText(const std::string &text) {
    //SE_LOGD("CanvasRenderingContext2D::measureText: %s\n", text.c_str());
    auto s = _delegate->measureText(text);
    return cc::Size(s[0], s[1]);
}

ICanvasGradient *CanvasRenderingContext2D::createLinearGradient(float /*x0*/, float /*y0*/, float /*x1*/, float /*y1*/) {
    return nullptr;
}

void CanvasRenderingContext2D::save() {
    //SE_LOGD("CanvasRenderingContext2D::save\n");
    _delegate->saveContext();
}

void CanvasRenderingContext2D::beginPath() {
    //SE_LOGD("\n-----------begin------------------\nCanvasRenderingContext2D::beginPath\n");
    _delegate->beginPath();
}

void CanvasRenderingContext2D::closePath() {
    //SE_LOGD("CanvasRenderingContext2D::closePath\n");
    _delegate->closePath();
}

void CanvasRenderingContext2D::moveTo(float x, float y) {
    //SE_LOGD("CanvasRenderingContext2D::moveTo\n");
    _delegate->moveTo(x, y);
}

void CanvasRenderingContext2D::lineTo(float x, float y) {
    //SE_LOGD("CanvasRenderingContext2D::lineTo\n");
    _delegate->lineTo(x, y);
}

void CanvasRenderingContext2D::stroke() {
    //SE_LOGD("CanvasRenderingContext2D::stroke\n");
    _delegate->stroke();

    if (_canvasBufferUpdatedCB != nullptr) {
        _canvasBufferUpdatedCB(_delegate->getDataRef());
    }
}

void CanvasRenderingContext2D::restore() {
    //SE_LOGD("CanvasRenderingContext2D::restore\n");
    _delegate->restoreContext();
}

void CanvasRenderingContext2D::setCanvasBufferUpdatedCallback(const CanvasBufferUpdatedCallback &cb) {
    _canvasBufferUpdatedCB = cb;
    recreateBufferIfNeeded();
}

void CanvasRenderingContext2D::setWidth(float width) {
    //SE_LOGD("CanvasRenderingContext2D::set__width: %f\n", width);
    if (math::IsEqualF(width, _width)) return;
    _width             = width;
    _isBufferSizeDirty = true;
    recreateBufferIfNeeded();
}

void CanvasRenderingContext2D::setHeight(float height) {
    //SE_LOGD("CanvasRenderingContext2D::set__height: %f\n", height);
    if (math::IsEqualF(height, _height)) return;
    _height            = height;
    _isBufferSizeDirty = true;
    recreateBufferIfNeeded();
}

void CanvasRenderingContext2D::setLineWidth(float lineWidth) {
    //SE_LOGD("CanvasRenderingContext2D::set_lineWidth %d\n", lineWidth);
    _lineWidth = lineWidth;
    _delegate->setLineWidth(lineWidth);
}

void CanvasRenderingContext2D::setLineCap(const std::string &lineCap) {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
#if CC_PLATFORM == CC_PLATFORM_WINDOWS

#elif CC_PLATFORM == CC_PLATFORM_ANDROID
    if (lineCap.empty()) return;
    _delegate->setLineCap(lineCap);
#endif
}

void CanvasRenderingContext2D::setLineJoin(const std::string &lineJoin) {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
    _delegate->setLineJoin(lineJoin);
}

void CanvasRenderingContext2D::fill() {
    // SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
#if CC_PLATFORM == CC_PLATFORM_WINDOWS

#elif CC_PLATFORM == CC_PLATFORM_ANDROID
    _delegate->fill();

    if (_canvasBufferUpdatedCB != nullptr) {
        _canvasBufferUpdatedCB(_delegate->getDataRef());
    }
#endif
}

void CanvasRenderingContext2D::rect(float x, float y, float w, float h) {
#if CC_PLATFORM == CC_PLATFORM_WINDOWS
    // SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
#elif CC_PLATFORM == CC_PLATFORM_ANDROID
    // SE_LOGD("CanvasRenderingContext2D::rect: %p, %f, %f, %f, %f\n", this, x, y, width, height);
    recreateBufferIfNeeded();
    _delegate->rect(x, y, w, h);
#endif
}

void CanvasRenderingContext2D::setFont(const std::string &font) {
#if CC_PLATFORM == CC_PLATFORM_WINDOWS
    if (_font != font) {
        _font = font;

        std::string boldStr;
        std::string fontName    = "Arial";
        std::string fontSizeStr = "30";

        // support get font name from `60px American` or `60px "American abc-abc_abc"`
        std::regex                                      re("(bold)?\\s*((\\d+)([\\.]\\d+)?)px\\s+([\\w-]+|\"[\\w -]+\"$)");
        std::match_results<std::string::const_iterator> results;
        if (std::regex_search(_font.cbegin(), _font.cend(), results, re)) {
            boldStr     = results[1].str();
            fontSizeStr = results[2].str();
            fontName    = results[5].str();
        }

        auto fontSize = static_cast<float>(atof(fontSizeStr.c_str()));
        //SE_LOGD("CanvasRenderingContext2D::set_font: %s, Size: %f, isBold: %b\n", fontName.c_str(), fontSize, !boldStr.empty());
        _delegate->updateFont(fontName, fontSize, !boldStr.empty(), false, false, false);
    }
#elif CC_PLATFORM == CC_PLATFORM_QNX
    if (_font != font) {
        _font = font;

        std::string boldStr;
        std::string fontName    = "Arial";
        std::string fontSizeStr = "30";

        // support get font name from `60px American` or `60px "American abc-abc_abc"`
        std::regex                                      re("(bold)?\\s*((\\d+)([\\.]\\d+)?)px\\s+([\\w-]+|\"[\\w -]+\"$)");
        std::match_results<std::string::const_iterator> results;
        if (std::regex_search(_font.cbegin(), _font.cend(), results, re)) {
            boldStr     = results[1].str();
            fontSizeStr = results[2].str();
            fontName    = results[5].str();
        }
        bool isItalic = font.find("italic", 0) != std::string::npos;
        auto fontSize = static_cast<float>(atof(fontSizeStr.c_str()));
        //SE_LOGD("CanvasRenderingContext2D::set_font: %s, Size: %f, isBold: %b\n", fontName.c_str(), fontSize, !boldStr.empty());
        _delegate->updateFont(fontName, fontSize, !boldStr.empty(), isItalic, false, false);
    }
#elif CC_PLATFORM == CC_PLATFORM_LINUX
    if (_font != font) {
        _font = font;

        std::string                                     fontName    = "sans-serif";
        std::string                                     fontSizeStr = "30";
        std::regex                                      re(R"(\s*((\d+)([\.]\d+)?)px\s+([^\r\n]*))");
        std::match_results<std::string::const_iterator> results;
        if (std::regex_search(_font.cbegin(), _font.cend(), results, re)) {
            fontSizeStr = results[2].str();
            // support get font name from `60px American` or `60px "American abc-abc_abc"`
            // support get font name contain space,example `times new roman`
            // if regex rule that does not conform to the rules,such as Chinese,it defaults to sans-serif
            std::match_results<std::string::const_iterator> fontResults;
            std::regex                                      fontRe(R"(([\w\s-]+|"[\w\s-]+"$))");
            std::string                                     tmp(results[4].str());
            if (std::regex_match(tmp, fontResults, fontRe)) {
                //fontName = results[4].str();
            }
        }

        bool  isBold   = font.find("bold", 0) != std::string::npos;
        bool  isItalic = font.find("italic", 0) != std::string::npos;
        float fontSize = static_cast<float>(atof(fontSizeStr.c_str()));
        //SE_LOGD("CanvasRenderingContext2D::set_font: %s, Size: %f, isBold: %b\n", fontName.c_str(), fontSize, !boldStr.empty());
        _delegate->updateFont(fontName, fontSize, isBold, isItalic, false, false);
    }
#elif CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_OHOS
    if (_font != font) {
        _font                                                       = font;
        std::string                                     fontName    = "sans-serif";
        std::string                                     fontSizeStr = "30";
        std::regex                                      re(R"(\s*((\d+)([\.]\d+)?)px\s+([^\r\n]*))");
        std::match_results<std::string::const_iterator> results;
        if (std::regex_search(_font.cbegin(), _font.cend(), results, re)) {
            fontSizeStr = results[2].str();
            // support get font name from `60px American` or `60px "American abc-abc_abc"`
            // support get font name contain space,example `times new roman`
            // if regex rule that does not conform to the rules,such as Chinese,it defaults to sans-serif
            std::match_results<std::string::const_iterator> fontResults;
            std::regex                                      fontRe(R"(([\w\s-]+|"[\w\s-]+"$))");
            std::string                                     tmp(results[4].str());
            if (std::regex_match(tmp, fontResults, fontRe)) {
                fontName = results[4].str();
            }
        }

        double fontSize    = atof(fontSizeStr.c_str());
        bool   isBold      = font.find("bold", 0) != std::string::npos;
        bool   isItalic    = font.find("italic", 0) != std::string::npos;
        bool   isSmallCaps = font.find("small-caps", 0) != std::string::npos;
        bool   isOblique   = font.find("oblique", 0) != std::string::npos;
        //font-style: italic, oblique, normal
        //font-weight: normal, bold
        //font-variant: normal, small-caps
        _delegate->updateFont(fontName, static_cast<float>(fontSize), isBold, isItalic, isOblique, isSmallCaps);
    }
#elif CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_MAC_IOS
    if (_font != font) {
        _font = font;

        std::string boldStr;
        std::string fontName    = "Arial";
        std::string fontSizeStr = "30";

        // support get font name from `60px American` or `60px "American abc-abc_abc"`
        std::regex                                      re("(bold)?\\s*((\\d+)([\\.]\\d+)?)px\\s+([\\w-]+|\"[\\w -]+\"$)");
        std::match_results<std::string::const_iterator> results;
        if (std::regex_search(_font.cbegin(), _font.cend(), results, re)) {
            boldStr     = results[1].str();
            fontSizeStr = results[2].str();
            fontName    = results[5].str();
        }
        float fontSize = atof(fontSizeStr.c_str());
        bool  isBold   = !boldStr.empty();
        _delegate->updateFont(fontName, static_cast<float>(fontSize), isBold, false, false, false);
    }
#endif
}

void CanvasRenderingContext2D::setTextAlign(const std::string &textAlign) {
    //SE_LOGD("CanvasRenderingContext2D::set_textAlign: %s\n", textAlign.c_str());
    if (textAlign == "left") {
        _delegate->setTextAlign(CanvasTextAlign::LEFT);
    } else if (textAlign == "center" || textAlign == "middle") {
        _delegate->setTextAlign(CanvasTextAlign::CENTER);
    } else if (textAlign == "right") {
        _delegate->setTextAlign(CanvasTextAlign::RIGHT);
    } else {
        assert(false);
    }
}

void CanvasRenderingContext2D::setTextBaseline(const std::string &textBaseline) {
    //SE_LOGD("CanvasRenderingContext2D::set_textBaseline: %s\n", textBaseline.c_str());
    if (textBaseline == "top") {
        _delegate->setTextBaseline(CanvasTextBaseline::TOP);
    } else if (textBaseline == "middle") {
        _delegate->setTextBaseline(CanvasTextBaseline::MIDDLE);
    } else if (textBaseline == "bottom") //REFINE:, how to deal with alphabetic, currently we handle it as bottom mode.
    {
        _delegate->setTextBaseline(CanvasTextBaseline::BOTTOM);
    } else if (textBaseline == "alphabetic") {
        _delegate->setTextBaseline(CanvasTextBaseline::ALPHABETIC);
    } else {
        assert(false);
    }
}

void CanvasRenderingContext2D::setFillStyle(const std::string &fillStyle) {
    CSSColorParser::Color color = CSSColorParser::parse(fillStyle);
    _delegate->setFillStyle(static_cast<float>(color.r) / 255.0F,
                            static_cast<float>(color.g) / 255.0F,
                            static_cast<float>(color.b) / 255.0F,
                            color.a);
    //SE_LOGD("CanvasRenderingContext2D::set_fillStyle: %s, (%d, %d, %d, %f)\n", fillStyle.c_str(), color.r, color.g, color.b, color.a);
}

void CanvasRenderingContext2D::setStrokeStyle(const std::string &strokeStyle) {
    CSSColorParser::Color color = CSSColorParser::parse(strokeStyle);
    _delegate->setStrokeStyle(static_cast<float>(color.r) / 255.0F,
                              static_cast<float>(color.g) / 255.0F,
                              static_cast<float>(color.b) / 255.0F,
                              color.a);
}

void CanvasRenderingContext2D::setGlobalCompositeOperation(const std::string &globalCompositeOperation) {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::fillImageData(const Data &imageData, float imageWidth, float imageHeight, float offsetX, float offsetY) {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
#if CC_PLATFORM == CC_PLATFORM_WINDOWS
#elif CC_PLATFORM == CC_PLATFORM_ANDROID
    _delegate->fillImageData(imageData, imageWidth, imageHeight, offsetX, offsetY);
    if (_canvasBufferUpdatedCB != nullptr) {
        _canvasBufferUpdatedCB(_delegate->getDataRef());
    }
#endif
}
// transform
//REFINE:

void CanvasRenderingContext2D::translate(float x, float y) {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::scale(float x, float y) {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::rotate(float angle) {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::transform(float a, float b, float c, float d, float e, float f) {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::setTransform(float a, float b, float c, float d, float e, float f) {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::recreateBufferIfNeeded() {
    if (_isBufferSizeDirty) {
        _isBufferSizeDirty = false;
        //SE_LOGD("Recreate buffer %p, w: %f, h:%f\n", this, __width, __height);
        _delegate->recreateBuffer(_width, _height);
        if (_canvasBufferUpdatedCB != nullptr) {
            _canvasBufferUpdatedCB(_delegate->getDataRef());
        }
    }
}

} // namespace cc
