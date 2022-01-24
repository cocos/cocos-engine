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

#include "platform/qnx/modules/CanvasRenderingContext2DDelegate.h"
#include <iostream>

namespace {
#define RGB(r, g, b)     (int)((int)r | (((int)g) << 8) | (((int)b) << 16))
#define RGBA(r, g, b, a) (int)((int)r | (((int)g) << 8) | (((int)b) << 16) | (((int)a) << 24))
} // namespace

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
//static const char gdefaultFontName[] = "-*-helvetica-medium-o-*-*-24-*-*-*-*-*-iso8859-*";
//static const char gdefaultFontName[] = "lucidasanstypewriter-bold-24";
static const char gdefaultFontName[]  = "lucidasans-24";
static const char gdefaultFontName1[] = "lucidasans";

CanvasRenderingContext2DDelegate::CanvasRenderingContext2DDelegate() {
    //_surface = cairo_image_surface_create_for_data(pointer , CAIRO_FORMAT_ARGB32,size[0], size[1], stride);
    //_cr = cairo_create (_surface);
}

CanvasRenderingContext2DDelegate::~CanvasRenderingContext2DDelegate() {
    if (_cr != nullptr) {
        cairo_destroy(_cr);
    }
    if (_surface) {
        cairo_surface_destroy(_surface);
    }
}

void CanvasRenderingContext2DDelegate::recreateBuffer(float w, float h) {
    _bufferWidth  = w;
    _bufferHeight = h;
    if (_bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }
    auto  textureSize = static_cast<int>(_bufferWidth * _bufferHeight * 4);
    auto *data        = static_cast<int8_t *>(malloc(sizeof(int8_t) * textureSize));
    memset(data, 0x00, textureSize);
    _imageData.fastSet((unsigned char *)data, textureSize);

    if (_cr) {
        cairo_destroy(_cr);
    }
    if (_surface) {
        cairo_surface_destroy(_surface);
    }
    _surface = cairo_image_surface_create_for_data((unsigned char *)data, CAIRO_FORMAT_ARGB32, _bufferWidth, _bufferHeight, _bufferWidth * 4);
    _cr      = cairo_create(_surface);
}

void CanvasRenderingContext2DDelegate::beginPath() {
}

void CanvasRenderingContext2DDelegate::closePath() {
}

void CanvasRenderingContext2DDelegate::moveTo(float x, float y) {
    CCASSERT(_cr != nullptr, "Cr pointer cannot be empty");
    cairo_move_to(_cr, x, y);
}

void CanvasRenderingContext2DDelegate::lineTo(float x, float y) {
    CCASSERT(_cr != nullptr, "Cr pointer cannot be empty");
    cairo_line_to(_cr, x, y);
}

void CanvasRenderingContext2DDelegate::stroke() {
}

void CanvasRenderingContext2DDelegate::saveContext() {
}

void CanvasRenderingContext2DDelegate::restoreContext() {
}

void CanvasRenderingContext2DDelegate::clearRect(float x, float y, float w, float h) {
    if (_bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }

    if (_imageData.isNull()) {
        return;
    }

    recreateBuffer(w, h);
}

void CanvasRenderingContext2DDelegate::fillRect(float x, float y, float w, float h) {
    if (_bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }
    CCASSERT(_cr != nullptr, "Cr pointer cannot be empty");
    cairo_set_source_rgba(_cr, _fillStyle[0], _fillStyle[1], _fillStyle[2], _fillStyle[3]);
    cairo_rectangle(_cr, x, y, w, h);
    cairo_fill(_cr);
}

void CanvasRenderingContext2DDelegate::fillText(const std::string &text, float x, float y, float /*maxWidth*/) {
    if (text.empty() || _bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }
    // cairo_font_weight_t fontWeight = CAIRO_FONT_WEIGHT_NORMAL; // bold ? CAIRO_FONT_WEIGHT_BOLD : CAIRO_FONT_WEIGHT_NORMAL;
    // cairo_font_slant_t fontSlant = CAIRO_FONT_SLANT_NORMAL;
    // cairo_select_font_face (_cr, "Arial", fontSlant, fontWeight);
    cairo_set_font_size(_cr, _fontSize);
    Point offsetPoint = convertDrawPoint(Point{x, y}, text);
    cairo_set_source_rgba(_cr, _fillStyle[0], _fillStyle[1], _fillStyle[2], _fillStyle[3]);
    cairo_move_to(_cr, offsetPoint[0], offsetPoint[1]);
    cairo_show_text(_cr, text.c_str());
}

void CanvasRenderingContext2DDelegate::strokeText(const std::string &text, float /*x*/, float /*y*/, float /*maxWidth*/) const {
    if (text.empty() || _bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }
}

CanvasRenderingContext2DDelegate::Size CanvasRenderingContext2DDelegate::measureText(const std::string &text) {
    if (text.empty())
        return std::array<float, 2>{0.0f, 0.0f};
    cairo_text_extents_t extents;
    cairo_text_extents(_cr, text.c_str(), &extents);
    return std::array<float, 2>{static_cast<float>(extents.x_advance),
                                static_cast<float>(extents.height)};
}

void CanvasRenderingContext2DDelegate::updateFont(const std::string &fontName,
                                                  float              fontSize,
                                                  bool               bold,
                                                  bool               italic,
                                                  bool               oblique,
                                                  bool /* smallCaps */) {
    do {
        _fontName                      = fontName;
        _fontSize                      = static_cast<int>(fontSize);
        cairo_font_weight_t fontWeight = bold ? CAIRO_FONT_WEIGHT_BOLD : CAIRO_FONT_WEIGHT_NORMAL;
        cairo_font_slant_t  fontSlant  = CAIRO_FONT_SLANT_NORMAL;
        if (italic) {
            fontSlant = CAIRO_FONT_SLANT_ITALIC;
        } else if (oblique) {
            fontSlant = CAIRO_FONT_SLANT_OBLIQUE;
        }
        std::cout << _fontName << std::endl;
        cairo_select_font_face(_cr, _fontName.c_str(), fontSlant, fontWeight);
        cairo_set_font_size(_cr, _fontSize);
    } while (false);
}

void CanvasRenderingContext2DDelegate::setTextAlign(CanvasTextAlign align) {
    _textAlign = align;
}

void CanvasRenderingContext2DDelegate::setTextBaseline(CanvasTextBaseline baseline) {
    _textBaseLine = baseline;
}

void CanvasRenderingContext2DDelegate::setFillStyle(float r, float g, float b, float a) {
    _fillStyle = {r, g, b, a};
}

void CanvasRenderingContext2DDelegate::setStrokeStyle(float r, float g, float b, float a) {
    _strokeStyle = {r, g, b, a};
}

void CanvasRenderingContext2DDelegate::setLineWidth(float lineWidth) {
    _lineWidth = lineWidth;
}

const cc::Data &CanvasRenderingContext2DDelegate::getDataRef() const {
    return _imageData;
}

void CanvasRenderingContext2DDelegate::removeCustomFont() {
}

// x, y offset value
int CanvasRenderingContext2DDelegate::drawText(const std::string &text, int x, int y) {
    cairo_move_to(_cr, x, y);
    cairo_show_text(_cr, text.c_str());
    return 0;
}

CanvasRenderingContext2DDelegate::Size CanvasRenderingContext2DDelegate::sizeWithText(const wchar_t *pszText, int nLen) {
    return std::array<float, 2>{0.0F, 0.0F};
}

void CanvasRenderingContext2DDelegate::prepareBitmap(int nWidth, int nHeight) {
}

void CanvasRenderingContext2DDelegate::deleteBitmap() {
}

void CanvasRenderingContext2DDelegate::fillTextureData() {
}

std::array<float, 2> CanvasRenderingContext2DDelegate::convertDrawPoint(Point point, const std::string &text) {
    int                  font_ascent  = 0;
    int                  font_descent = 0;
    int                  direction    = 0;
    cairo_text_extents_t extents;
    cairo_text_extents(_cr, text.c_str(), &extents);

    int width = extents.width;
    if (_textAlign == CanvasTextAlign::CENTER) {
        point[0] -= width / 2.0f;
    } else if (_textAlign == CanvasTextAlign::RIGHT) {
        point[0] -= width;
    }

    if (_textBaseLine == CanvasTextBaseline::TOP) {
        point[1] += -extents.y_bearing;
    } else if (_textBaseLine == CanvasTextBaseline::MIDDLE) {
        point[1] += extents.height / 2;
    } else if (_textBaseLine == CanvasTextBaseline::BOTTOM) {
        point[1] += extents.height;
    }
    if (text == ".") {
		// The calculation of points is not the same as the calculation of numbers, 
		// which will cause the drawing of points and numbers to be different from the same horizontal line.
		// Therefore, here is manually adjusted to calculate the drawing coordinates of 
		// the point according to the numerical calculation method
        cairo_text_extents_t extentNumber;
        cairo_text_extents(_cr, "1", &extentNumber);
        point[1] += extents.y_bearing - extentNumber.y_bearing;
    }

    return point;
}

void CanvasRenderingContext2DDelegate::fill() {
}

void CanvasRenderingContext2DDelegate::setLineCap(const std::string &lineCap) {
}

void CanvasRenderingContext2DDelegate::setLineJoin(const std::string &lineJoin) {
}

void CanvasRenderingContext2DDelegate::fillImageData(const Data & /* imageData */,
                                                     float /* imageWidth */,
                                                     float /* imageHeight */,
                                                     float /* offsetX */,
                                                     float /* offsetY */) {
}

void CanvasRenderingContext2DDelegate::strokeText(const std::string & /* text */,
                                                  float /* x */,
                                                  float /* y */,
                                                  float /* maxWidth */) {
}

void CanvasRenderingContext2DDelegate::rect(float /* x */,
                                            float /* y */,
                                            float /* w */,
                                            float /* h */) {
}

} // namespace cc
