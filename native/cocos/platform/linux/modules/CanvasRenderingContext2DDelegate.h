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

#include <array>
#include <cstdint>
#include <regex>
#include "base/csscolorparser.h"
#include "cocos/bindings/manual/jsb_platform.h"
#include "math/Math.h"
#include "platform/FileUtils.h"

#include <X11/Xlib.h>
#include <X11/Xos.h>
#include <X11/Xutil.h>

namespace cc {

class CanvasRenderingContext2DDelegate : public ICanvasRenderingContext2D::Delegate {
public:
    using Point   = std::array<float, 2>;
    using Vec2    = std::array<float, 2>;
    using Size    = std::array<float, 2>;
    using Color4F = std::array<float, 4>;

    CanvasRenderingContext2DDelegate();
    ~CanvasRenderingContext2DDelegate() override;

    void            recreateBuffer(float w, float h) override;
    void            beginPath() override;
    void            closePath() override;
    void            moveTo(float x, float y) override;
    void            lineTo(float x, float y) override;
    void            stroke() override;
    void            saveContext() override;
    void            restoreContext() override;
    void            clearRect(float /*x*/, float /*y*/, float w, float h) override;
    void            fillRect(float x, float y, float w, float h) override;
    void            fillText(const std::string &text, float x, float y, float /*maxWidth*/) override;
    void            strokeText(const std::string &text, float /*x*/, float /*y*/, float /*maxWidth*/) const;
    Size            measureText(const std::string &text) override;
    void            updateFont(const std::string &fontName, float fontSize, bool bold, bool italic, bool oblique, bool smallCaps) override;
    void            setTextAlign(CanvasTextAlign align) override;
    void            setTextBaseline(CanvasTextBaseline baseline) override;
    void            setFillStyle(float r, float g, float b, float a) override;
    void            setStrokeStyle(float r, float g, float b, float a) override;
    void            setLineWidth(float lineWidth) override;
    const cc::Data &getDataRef() const override;
    void            fill() override;
    void            setLineCap(const std::string &lineCap) override;
    void            setLineJoin(const std::string &lineCap) override;
    void            fillImageData(const Data &imageData, float imageWidth, float imageHeight, float offsetX, float offsetY) override;
    void            strokeText(const std::string &text, float /*x*/, float /*y*/, float /*maxWidth*/) override;
    void            rect(float x, float y, float w, float h) override;

private:
    static wchar_t *     utf8ToUtf16(const std::string &str, int *pRetLen = nullptr);
    void                 removeCustomFont();
    int                  drawText(const std::string &text, int x, int y);
    Size                 sizeWithText(const wchar_t *pszText, int nLen);
    void                 prepareBitmap(int nWidth, int nHeight);
    void                 deleteBitmap();
    void                 fillTextureData();
    std::array<float, 2> convertDrawPoint(Point point, const std::string &text);

public:
    Display *    _dis{nullptr};
    int          _screen{0};
    Drawable     _win{0};
    Drawable     _pixmap{0};
    XFontStruct *_font{0};
    GC           _gc;

private:
    int32_t _x{0};
    int32_t _y{0};
    int32_t _lineCap{0};
    int32_t _lineJoin{0};

private:
    cc::Data    _imageData;
    std::string _curFontPath;
    int         _savedDC{0};
    float       _lineWidth{0.0F};
    float       _bufferWidth{0.0F};
    float       _bufferHeight{0.0F};

    std::string        _fontName;
    int                _fontSize{0};
    Size               _textSize;
    CanvasTextAlign    _textAlign{CanvasTextAlign::CENTER};
    CanvasTextBaseline _textBaseLine{CanvasTextBaseline::TOP};
    unsigned long      _fillStyle{0};
    unsigned long      _strokeStyle{0};
};

} // namespace cc
