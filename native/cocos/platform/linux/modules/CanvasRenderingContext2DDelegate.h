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

#include "platform/interfaces/modules/canvas/ICanvasRenderingContext2D.h"

#include <cstdint>
#include <regex>
#include "base/csscolorparser.h"
#include "base/std/container/array.h"
#include "cocos/bindings/manual/jsb_platform.h"
#include "math/Math.h"
#include "platform/FileUtils.h"

#include <X11/Xlib.h>
#include <X11/Xos.h>
#include <X11/Xutil.h>

namespace cc {

class CC_DLL CanvasRenderingContext2DDelegate : public ICanvasRenderingContext2D::Delegate {
public:
    using Point = ccstd::array<float, 2>;
    using Vec2 = ccstd::array<float, 2>;
    using Size = ccstd::array<float, 2>;
    using Color4F = ccstd::array<float, 4>;
    using TextAlign = ICanvasRenderingContext2D::TextAlign;
    using TextBaseline = ICanvasRenderingContext2D::TextBaseline;
    CanvasRenderingContext2DDelegate();
    ~CanvasRenderingContext2DDelegate() override;

    void recreateBuffer(float w, float h) override;
    void beginPath() override;
    void closePath() override;
    void moveTo(float x, float y) override;
    void lineTo(float x, float y) override;
    void stroke() override;
    void saveContext() override;
    void restoreContext() override;
    void clearRect(float /*x*/, float /*y*/, float w, float h) override;
    void fillRect(float x, float y, float w, float h) override;
    void fillText(const ccstd::string &text, float x, float y, float /*maxWidth*/) override;
    void strokeText(const ccstd::string &text, float /*x*/, float /*y*/, float /*maxWidth*/) const;
    Size measureText(const ccstd::string &text) override;
    void updateFont(const ccstd::string &fontName, float fontSize, bool bold, bool italic, bool oblique, bool smallCaps) override;
    void setTextAlign(TextAlign align) override;
    void setTextBaseline(TextBaseline baseline) override;
    void setFillStyle(uint8_t r, uint8_t g, uint8_t b, uint8_t a) override;
    void setStrokeStyle(uint8_t r, uint8_t g, uint8_t b, uint8_t a) override;
    void setLineWidth(float lineWidth) override;
    const cc::Data &getDataRef() const override;
    void fill() override;
    void setLineCap(const ccstd::string &lineCap) override;
    void setLineJoin(const ccstd::string &lineCap) override;
    void fillImageData(const Data &imageData, float imageWidth, float imageHeight, float offsetX, float offsetY) override;
    void strokeText(const ccstd::string &text, float /*x*/, float /*y*/, float /*maxWidth*/) override;
    void rect(float x, float y, float w, float h) override;
    void updateData() override {}
    void setShadowBlur(float blur) override {}
    void setShadowColor(uint8_t r, uint8_t g, uint8_t b, uint8_t a) override {}
    void setShadowOffsetX(float offsetX) override {}
    void setShadowOffsetY(float offsetY) override {}

private:
    static wchar_t *utf8ToUtf16(const ccstd::string &str, int *pRetLen = nullptr);
    void removeCustomFont();
    int drawText(const ccstd::string &text, int x, int y);
    Size sizeWithText(const wchar_t *pszText, int nLen);
    void prepareBitmap(int nWidth, int nHeight);
    void deleteBitmap();
    void fillTextureData();
    ccstd::array<float, 2> convertDrawPoint(Point point, const ccstd::string &text);

public:
    Display *_dis{nullptr};
    int _screen{0};
    Drawable _win{0};
    Drawable _pixmap{0};
    XFontStruct *_font{0};
    GC _gc;

private:
    int32_t _x{0};
    int32_t _y{0};
    int32_t _lineCap{0};
    int32_t _lineJoin{0};

private:
    cc::Data _imageData;
    ccstd::string _curFontPath;
    int _savedDC{0};
    float _lineWidth{0.0F};
    float _bufferWidth{0.0F};
    float _bufferHeight{0.0F};

    ccstd::string _fontName;
    int _fontSize{0};
    Size _textSize;
    TextAlign _textAlign{TextAlign::CENTER};
    TextBaseline _textBaseLine{TextBaseline::TOP};
    unsigned long _fillStyle{0};
    unsigned long _strokeStyle{0};
};

} // namespace cc
