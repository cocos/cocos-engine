/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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
 THE SOFTWARE.                                                                    \
 ****************************************************************************/

#include "platform/openharmony/modules/CanvasRenderingContext2DDelegate.h"
#include "platform/openharmony/OpenHarmonyPlatform.h"

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
}

CanvasRenderingContext2DDelegate::~CanvasRenderingContext2DDelegate() {
#if defined(OPENHARMONY_DRAW)
    if(_typographyStyle != nullptr) {
        OH_Drawing_DestroyTypographyStyle(_typographyStyle);
    }
#endif
}

void CanvasRenderingContext2DDelegate::recreateBuffer(float w, float h) {
    _bufferWidth  = w;
    _bufferHeight = h;
#if defined(OPENHARMONY_DRAW)
    if (_bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        OH_Drawing_CanvasDestory(_canvas);
        OH_Drawing_BitmapDestory(_bitmap);
        return;
    }

    _bufferSize = static_cast<int>(_bufferWidth * _bufferHeight * 4);
    auto *data        = static_cast<uint8_t *>(malloc(sizeof(uint8_t) * _bufferSize));
    memset(data, 0x00, _bufferSize);
    _imageData.fastSet(data, _bufferSize);

    // 创建一个bitmap对象
    _bitmap = OH_Drawing_BitmapCreate();
    // 构造对应格式的bitmap
    OH_Drawing_BitmapBuild(_bitmap, width, height, &_format);
       // 创建一个canvas对象
    _canvas = OH_Drawing_CanvasCreate();
    // 将画布与bitmap绑定，画布画的内容会画到绑定的bitmap内存中
    OH_Drawing_CanvasBind(_canvas, _bitmap);

    _typographyStyle = OH_Drawing_CreateTypographyStyle();
#endif
}

void CanvasRenderingContext2DDelegate::beginPath() {
}

void CanvasRenderingContext2DDelegate::closePath() {
}

void CanvasRenderingContext2DDelegate::moveTo(float x, float y) {
    //MoveToEx(_DC, static_cast<int>(x), static_cast<int>(-(y - _bufferHeight - _fontSize)), nullptr);
    _x = x;
    _y = y;
}

void CanvasRenderingContext2DDelegate::lineTo(float x, float y) {
}

void CanvasRenderingContext2DDelegate::stroke() {
}

void CanvasRenderingContext2DDelegate::saveContext() {
}

void CanvasRenderingContext2DDelegate::restoreContext() {
}

void CanvasRenderingContext2DDelegate::clearRect(float x, float y, float w, float h) {
}

void CanvasRenderingContext2DDelegate::fillRect(float x, float y, float w, float h) {
#if defined(OPENHARMONY_DRAW)
    // 使用白色清除画布内容
    OH_Drawing_CanvasClear(_canvas, OH_Drawing_ColorSetArgb(0xFF, 0xFF, 0xFF, 0xFF));
#endif
}

void CanvasRenderingContext2DDelegate::fillText(const std::string &text, float x, float y, float /*maxWidth*/) {
    if (text.empty() || _bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }
#if defined(OPENHARMONY_DRAW)
    SIZE  textSize    = {0, 0};
    Point offsetPoint = convertDrawPoint(Point{x, y}, text);
    drawText(text, (int)offsetPoint[0], (int)offsetPoint[1]);
#endif
}

void CanvasRenderingContext2DDelegate::strokeText(const std::string &text, float /*x*/, float /*y*/, float /*maxWidth*/) const {
}

CanvasRenderingContext2DDelegate::Size CanvasRenderingContext2DDelegate::measureText(const std::string &text) {
#if defined(OPENHARMONY_DRAW)
    return std::array<float, 2>{static_cast<float>(OH_Drawing_TypographyGetMaxWidth(_typographyStyle)),
                                static_cast<float>(OH_Drawing_TypographyGetHeight(_typographyStyle))};
#endif
}

void CanvasRenderingContext2DDelegate::updateFont(const std::string &fontName,
                                                  float              fontSize,
                                                  bool               bold,
                                                  bool               italic,
                                                  bool               oblique,
                                                  bool /* smallCaps */) {
    _fontName = fontName;
    _fontSize = static_cast<int>(fontSize);
    std::string fontPath;
#if defined(OPENHARMONY_DRAW)
    LOGFONTA    tFont = {0};
    if (!_fontName.empty()) {
         const char* fontFamilies[1];
         fontFamilies[0] = fontName.c_str();
        OH_Drawing_SetTextStyleFontFamilies((_typographyStyle, 1, fontFamilies);
        OH_Drawing_SetTextStyleLocale(_typographyStyle, "en");
    }
    if (_fontSize)
        OH_Drawing_SetTextStyleFontSize(_typographyStyle, _fontSize);
    if (bold)
        OH_Drawing_SetTextStyleFontWeight(_typographyStyle, FONT_WEIGHT_700);
    else 
        OH_Drawing_SetTextStyleFontWeight(_typographyStyle, FONT_WEIGHT_400);
    if(italic) 
        OH_Drawing_SetTextStyleFontStyle(_typographyStyle, FONT_STYLE_ITALIC);
    else 
        OH_Drawing_SetTextStyleFontStyle(_typographyStyle, FONT_STYLE_NORMAL);
#endif
}

void CanvasRenderingContext2DDelegate::setTextAlign(CanvasTextAlign align) {
    _textAlign = align;
}

void CanvasRenderingContext2DDelegate::setTextBaseline(CanvasTextBaseline baseline) {
    _textBaseLine = baseline;
}

void CanvasRenderingContext2DDelegate::setFillStyle(float r, float g, float b, float a) {
    _fillStyle = RGBA(r * 255, g * 255, b * 255, a * 255);
}

void CanvasRenderingContext2DDelegate::setStrokeStyle(float r, float g, float b, float a) {
    _strokeStyle = RGBA(r * 255, g * 255, b * 255, a * 255);
}

void CanvasRenderingContext2DDelegate::setLineWidth(float lineWidth) {
    _lineWidth = lineWidth;
}

const cc::Data &CanvasRenderingContext2DDelegate::getDataRef() const {
     // 画完后获取Bitmap的地址，地址指向bitmap的内存，内存包含画布画的像素数据
#if defined(OPENHARMONY_DRAW)
    void* bitmapAddr = OH_Drawing_BitmapGetPixels(_bitmap);
    auto ret = memcpy_s(addr, _bufferSize, bitmapAddr, _bufferSize);
    if (ret != EOK) {
        LOGI("memcpy_s failed");
    }
#endif
    return _imageData;
}

void CanvasRenderingContext2DDelegate::removeCustomFont() {
}

// x, y offset value
int CanvasRenderingContext2DDelegate::drawText(const std::string &text, int x, int y) {
#if defined(OPENHARMONY_DRAW)
    OH_Drawing_SetTextStyleColor(_typographyStyle, _fillStyle);
    OH_Drawing_TypographyHandlerAddText(_typographyStyle, text.c_str());
#endif
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
    Size textSize = measureText(text);
    if (_textAlign == CanvasTextAlign::CENTER) {
        point[0] -= textSize[0] / 2.0f;
    } else if (_textAlign == CanvasTextAlign::RIGHT) {
        point[0] -= textSize[0];
    }

    if (_textBaseLine == CanvasTextBaseline::TOP) {
#if defined(OPENHARMONY_DRAW)
        // DrawText default
        GetTextMetrics(_DC, &_tm);
        point[1] += -_tm.tmInternalLeading;
#endif
    } else if (_textBaseLine == CanvasTextBaseline::MIDDLE) {
        point[1] += -textSize[1] / 2.0f;
    } else if (_textBaseLine == CanvasTextBaseline::BOTTOM) {
        point[1] += -textSize[1];
    } else if (_textBaseLine == CanvasTextBaseline::ALPHABETIC) {
        //GetTextMetrics(_DC, &_tm);
        //point[1] -= _tm.tmAscent;
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

void CanvasRenderingContext2DDelegate::updateData() {

}

} // namespace cc