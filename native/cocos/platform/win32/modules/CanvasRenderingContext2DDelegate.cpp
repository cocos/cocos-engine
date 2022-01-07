/****************************************************************************
 Copyright (c) 2018-2021 Xiamen Yaji Software Co., Ltd.

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

#include "platform/win32/modules/CanvasRenderingContext2DDelegate.h"

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
CanvasRenderingContext2DDelegate::CanvasRenderingContext2DDelegate() {
    HDC hdc = GetDC(_wnd);
    _DC     = CreateCompatibleDC(hdc);
    ReleaseDC(_wnd, hdc);
}

CanvasRenderingContext2DDelegate::~CanvasRenderingContext2DDelegate() {
    deleteBitmap();
    removeCustomFont();
    if (_DC)
        DeleteDC(_DC);
}

void CanvasRenderingContext2DDelegate::recreateBuffer(float w, float h) {
    _bufferWidth  = w;
    _bufferHeight = h;
    if (_bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        deleteBitmap();
        return;
    }

    auto  textureSize = static_cast<int>(_bufferWidth * _bufferHeight * 4);
    auto *data        = static_cast<uint8_t *>(malloc(sizeof(uint8_t) * textureSize));
    memset(data, 0x00, textureSize);
    _imageData.fastSet(data, textureSize);

    prepareBitmap(static_cast<int>(_bufferWidth), static_cast<int>(_bufferHeight));
}

void CanvasRenderingContext2DDelegate::beginPath() {
    // called: set_lineWidth() -> beginPath() -> moveTo() -> lineTo() -> stroke(), when draw line
    _hpen = CreatePen(PS_SOLID, static_cast<int>(_lineWidth), RGB(255, 255, 255));
    // the return value of SelectObject is a handle to the object being replaced, so we should delete them to avoid memory leak
    HGDIOBJ hOldPen = SelectObject(_DC, _hpen);
    HGDIOBJ hOldBmp = SelectObject(_DC, _bmp);
    DeleteObject(hOldPen);
    DeleteObject(hOldBmp);

    SetBkMode(_DC, TRANSPARENT);
}

void CanvasRenderingContext2DDelegate::closePath() {
}

void CanvasRenderingContext2DDelegate::moveTo(float x, float y) {
    MoveToEx(_DC, static_cast<int>(x), static_cast<int>(-(y - _bufferHeight - _fontSize)), nullptr);
}

void CanvasRenderingContext2DDelegate::lineTo(float x, float y) {
    LineTo(_DC, static_cast<int>(x), static_cast<int>(-(y - _bufferHeight - _fontSize)));
}

void CanvasRenderingContext2DDelegate::stroke() {
    DeleteObject(_hpen);
    if (_bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }

    fillTextureData();
}

void CanvasRenderingContext2DDelegate::saveContext() {
    _savedDC = SaveDC(_DC);
}

void CanvasRenderingContext2DDelegate::restoreContext() {
    BOOL ret = RestoreDC(_DC, _savedDC);
    if (0 == ret) {
        SE_LOGD("CanvasRenderingContext2DImpl restore context failed.\n");
    }
}

void CanvasRenderingContext2DDelegate::clearRect(float /*x*/, float /*y*/, float w, float h) {
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

    //not filled all Bits in buffer? the buffer length is _bufferWidth * _bufferHeight * 4, but it filled _bufferWidth * _bufferHeight * 3?
    uint8_t *buffer = _imageData.getBytes();
    if (buffer) {
        uint8_t r = static_cast<uint8_t>(_fillStyle[0] * 255.0f);
        uint8_t g = static_cast<uint8_t>(_fillStyle[1] * 255.0f);
        uint8_t b = static_cast<uint8_t>(_fillStyle[2] * 255.0f);
        uint8_t a = static_cast<uint8_t>(_fillStyle[3] * 255.0f);
        fillRectWithColor(buffer,
                          static_cast<uint32_t>(_bufferWidth),
                          static_cast<uint32_t>(_bufferHeight),
                          static_cast<uint32_t>(x),
                          static_cast<uint32_t>(y),
                          static_cast<uint32_t>(w),
                          static_cast<uint32_t>(h), r, g, b, a);
    }
}

void CanvasRenderingContext2DDelegate::fillText(const std::string &text, float x, float y, float /*maxWidth*/) {
    if (text.empty() || _bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }

    SIZE  textSize    = {0, 0};
    Point offsetPoint = convertDrawPoint(Point{x, y}, text);

    drawText(text, (int)offsetPoint[0], (int)offsetPoint[1]);
    fillTextureData();
}

void CanvasRenderingContext2DDelegate::strokeText(const std::string &text, float /*x*/, float /*y*/, float /*maxWidth*/) const {
    if (text.empty() || _bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }
}

CanvasRenderingContext2DDelegate::Size CanvasRenderingContext2DDelegate::measureText(const std::string &text) {
    if (text.empty())
        return std::array<float, 2>{0.0f, 0.0f};

    int      bufferLen  = 0;
    wchar_t *pwszBuffer = CanvasRenderingContext2DDelegate::utf8ToUtf16(text, &bufferLen);
    Size     size       = sizeWithText(pwszBuffer, bufferLen);
    //SE_LOGD("CanvasRenderingContext2DImpl::measureText: %s, %d, %d\n", text.c_str(), size.cx, size.cy);
    CC_SAFE_DELETE_ARRAY(pwszBuffer);
    return size;
}

void CanvasRenderingContext2DDelegate::updateFont(const std::string &fontName,
                                                  float              fontSize,
                                                  bool               bold,
                                                  bool /* italic */,
                                                  bool /* oblique */,
                                                  bool /* smallCaps */) {
    do {
        _fontName = fontName;
        _fontSize = static_cast<int>(fontSize);
        std::string fontPath;
        LOGFONTA    tFont = {0};
        if (!_fontName.empty()) {
            // firstly, try to create font from ttf file
            const auto &fontInfoMap = getFontFamilyNameMap();
            auto        iter        = fontInfoMap.find(_fontName);
            if (iter != fontInfoMap.end()) {
                fontPath                = iter->second;
                std::string tmpFontPath = fontPath;
                size_t      nFindPos    = tmpFontPath.rfind("/");
                tmpFontPath             = &tmpFontPath[nFindPos + 1];
                nFindPos                = tmpFontPath.rfind(".");
                // IDEA: draw ttf failed if font file name not equal font face name
                // for example: "DejaVuSansMono-Oblique" not equal "DejaVu Sans Mono"  when using DejaVuSansMono-Oblique.ttf
                _fontName = tmpFontPath.substr(0, nFindPos);
            } else {
                auto nFindPos = fontName.rfind("/");
                if (nFindPos != fontName.npos) {
                    if (fontName.length() == nFindPos + 1) {
                        _fontName = "";
                    } else {
                        _fontName = &_fontName[nFindPos + 1];
                    }
                }
            }
            tFont.lfCharSet = DEFAULT_CHARSET;
            strcpy_s(tFont.lfFaceName, LF_FACESIZE, _fontName.c_str());
        }

        if (_fontSize)
            tFont.lfHeight = -_fontSize;

        if (bold)
            tFont.lfWeight = FW_BOLD;
        else
            tFont.lfWeight = FW_NORMAL;

        // disable Cleartype
        tFont.lfQuality = ANTIALIASED_QUALITY;

        // delete old font
        removeCustomFont();

        if (!fontPath.empty()) {
            _curFontPath        = fontPath;
            wchar_t *pwszBuffer = utf8ToUtf16(_curFontPath);
            if (pwszBuffer) {
                if (AddFontResource(pwszBuffer)) {
                    SendMessage(_wnd, WM_FONTCHANGE, 0, 0);
                }
                delete[] pwszBuffer;
                pwszBuffer = nullptr;
            }
        }

        // create new font
        _font = CreateFontIndirectA(&tFont);
        if (!_font) {
            // create failed, use default font
            SE_LOGE("Failed to create custom font(font name: %s, font size: %f), use default font.\n",
                    _fontName.c_str(), fontSize);
        } else {
            SelectObject(_DC, _font);
            SendMessage(_wnd, WM_FONTCHANGE, 0, 0);
        }
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

// change utf-8 string to utf-16, pRetLen is the string length after changing
wchar_t *CanvasRenderingContext2DDelegate::utf8ToUtf16(const std::string &str, int *pRetLen /* = nullptr*/) {
    wchar_t *pwszBuffer = nullptr;
    do {
        if (str.empty()) {
            break;
        }
        int nLen    = static_cast<int>(str.size());
        int nBufLen = nLen + 1;
        pwszBuffer  = new wchar_t[nBufLen];
        CC_BREAK_IF(!pwszBuffer);
        memset(pwszBuffer, 0, sizeof(wchar_t) * nBufLen);
        // str.size() not equal actuallyLen for Chinese char
        int actuallyLen = MultiByteToWideChar(CP_UTF8, 0, str.c_str(), nLen, pwszBuffer, nBufLen);
        // SE_LOGE("_utf8ToUtf16, str:%s, strLen:%d, retLen:%d\n", str.c_str(), str.size(), actuallyLen);
        if (pRetLen != nullptr) {
            *pRetLen = actuallyLen;
        }
    } while (false);
    return pwszBuffer;
}

void CanvasRenderingContext2DDelegate::removeCustomFont() {
    HFONT hDefFont = (HFONT)GetStockObject(DEFAULT_GUI_FONT);
    if (hDefFont != _font) {
        DeleteObject(SelectObject(_DC, hDefFont));
    }
    // release temp font resource
    if (!_curFontPath.empty()) {
        wchar_t *pwszBuffer = utf8ToUtf16(_curFontPath);
        if (pwszBuffer) {
            RemoveFontResource(pwszBuffer);
            SendMessage(_wnd, WM_FONTCHANGE, 0, 0);
            delete[] pwszBuffer;
            pwszBuffer = nullptr;
        }
        _curFontPath.clear();
    }
}

// x, y offset value
int CanvasRenderingContext2DDelegate::drawText(const std::string &text, int x, int y) {
    int      nRet       = 0;
    wchar_t *pwszBuffer = nullptr;
    do {
        CC_BREAK_IF(text.empty());

        DWORD dwFmt = DT_SINGLELINE | DT_NOPREFIX;

        int bufferLen = 0;
        pwszBuffer    = utf8ToUtf16(text, &bufferLen);

        Size newSize = sizeWithText(pwszBuffer, bufferLen);

        _textSize = newSize;

        RECT rcText = {0};

        rcText.right  = static_cast<int>(newSize[0]);
        rcText.bottom = static_cast<int>(newSize[1]);

        LONG offsetX = x;
        LONG offsetY = y;
        if (offsetX || offsetY) {
            OffsetRect(&rcText, offsetX, offsetY);
        }

        // SE_LOGE("_drawText text,%s size: (%d, %d) offset after convert: (%d, %d) \n", text.c_str(), newSize.cx, newSize.cy, offsetX, offsetY);

        SetBkMode(_DC, TRANSPARENT);
        SetTextColor(_DC, RGB(255, 255, 255)); // white color

        // draw text
        nRet = DrawTextW(_DC, pwszBuffer, bufferLen, &rcText, dwFmt);
    } while (false);
    CC_SAFE_DELETE_ARRAY(pwszBuffer);

    return nRet;
}

CanvasRenderingContext2DDelegate::Size CanvasRenderingContext2DDelegate::sizeWithText(const wchar_t *pszText, int nLen) {
    Size tRet{0, 0};
    do {
        CC_BREAK_IF(!pszText || nLen <= 0);

        RECT  rc        = {0, 0, 0, 0};
        DWORD dwCalcFmt = DT_CALCRECT | DT_NOPREFIX;

        // measure text size
        DrawTextW(_DC, pszText, nLen, &rc, dwCalcFmt);

        tRet[0] = static_cast<float>(rc.right);
        tRet[1] = static_cast<float>(rc.bottom);
    } while (false);

    return tRet;
}

void CanvasRenderingContext2DDelegate::prepareBitmap(int nWidth, int nHeight) {
    // release bitmap
    deleteBitmap();

    if (nWidth > 0 && nHeight > 0) {
        _bmp = CreateBitmap(nWidth, nHeight, 1, 32, nullptr);
        SelectObject(_DC, _bmp);
    }
}

void CanvasRenderingContext2DDelegate::deleteBitmap() {
    if (_bmp) {
        DeleteObject(_bmp);
        _bmp = nullptr;
    }
}

void CanvasRenderingContext2DDelegate::fillTextureData() {
    do {
        auto  dataLen = static_cast<int>(_bufferWidth * _bufferHeight * 4);
        auto *dataBuf = static_cast<unsigned char *>(malloc(sizeof(unsigned char) * dataLen));
        CC_BREAK_IF(!dataBuf);
        unsigned char *imageBuf = _imageData.getBytes();
        CC_BREAK_IF(!imageBuf);

        struct
        {
            BITMAPINFOHEADER bmiHeader;
            int              mask[4];
        } bi                = {0};
        bi.bmiHeader.biSize = sizeof(bi.bmiHeader);
        CC_BREAK_IF(!GetDIBits(_DC, _bmp, 0, 0,
                               nullptr, (LPBITMAPINFO)&bi, DIB_RGB_COLORS));

        // copy pixel data
        bi.bmiHeader.biHeight = (bi.bmiHeader.biHeight > 0) ? -bi.bmiHeader.biHeight : bi.bmiHeader.biHeight;
        GetDIBits(_DC, _bmp, 0, static_cast<UINT>(_bufferHeight), dataBuf,
                  (LPBITMAPINFO)&bi, DIB_RGB_COLORS);

        uint8_t   r            = static_cast<uint8_t>(round(_fillStyle[0] * 255));
        uint8_t   g            = static_cast<uint8_t>(round(_fillStyle[1] * 255));
        uint8_t   b            = static_cast<uint8_t>(round(_fillStyle[2] * 255));
        COLORREF  textColor    = (b << 16 | g << 8 | r) & 0x00ffffff;
        COLORREF *pPixel       = nullptr;
        COLORREF *pImage       = nullptr;
        int       bufferHeight = static_cast<int>(_bufferHeight);
        int       bufferWidth  = static_cast<int>(_bufferWidth);
        for (int y = 0; y < bufferHeight; ++y) {
            pPixel = (COLORREF *)dataBuf + y * bufferWidth;
            pImage = (COLORREF *)imageBuf + y * bufferWidth;
            for (int x = 0; x < bufferWidth; ++x) {
                COLORREF &clr = *pPixel;
                COLORREF &val = *pImage;
                // Because text is drawn in white color, and background color is black,
                // so the red value is equal to alpha value. And we should keep this value
                // as it includes anti-atlas information.
                uint8_t alpha = GetRValue(clr);
                if (alpha > 0) {
                    val = (alpha << 24) | textColor;
                }
                ++pPixel;
                ++pImage;
            }
        }
        free(dataBuf);
    } while (false);
}

std::array<float, 2> CanvasRenderingContext2DDelegate::convertDrawPoint(Point point, const std::string &text) {
    Size textSize = measureText(text);
    if (_textAlign == CanvasTextAlign::CENTER) {
        point[0] -= textSize[0] / 2.0f;
    } else if (_textAlign == CanvasTextAlign::RIGHT) {
        point[0] -= textSize[0];
    }

    if (_textBaseLine == CanvasTextBaseline::TOP) {
        // DrawText default
        GetTextMetrics(_DC, &_tm);
        point[1] += -_tm.tmInternalLeading;
    } else if (_textBaseLine == CanvasTextBaseline::MIDDLE) {
        point[1] += -textSize[1] / 2.0f;
    } else if (_textBaseLine == CanvasTextBaseline::BOTTOM) {
        point[1] += -textSize[1];
    } else if (_textBaseLine == CanvasTextBaseline::ALPHABETIC) {
        GetTextMetrics(_DC, &_tm);
        point[1] -= _tm.tmAscent;
    }

    return point;
}

void CanvasRenderingContext2DDelegate::fill() {
}

void CanvasRenderingContext2DDelegate::setLineCap(const std::string & /* lineCap */) {
}

void CanvasRenderingContext2DDelegate::setLineJoin(const std::string & /* lineCap */) {
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