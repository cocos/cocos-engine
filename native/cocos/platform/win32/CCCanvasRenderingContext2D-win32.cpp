#include "platform/CCCanvasRenderingContext2D.h"
#include "base/ccTypes.h"
#include "base/csscolorparser.hpp"

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_platform.h"

#include "platform/CCFileUtils.h"
#include <regex>

using namespace cocos2d;

enum class CanvasTextAlign {
    LEFT,
    CENTER,
    RIGHT
};

enum class CanvasTextBaseline {
    TOP,
    MIDDLE,
    BOTTOM
};

namespace {
    void fillRectWithColor(uint8_t* buf, uint32_t totalWidth, uint32_t totalHeight, uint32_t x, uint32_t y, uint32_t width, uint32_t height, uint8_t r, uint8_t g, uint8_t b)
    {
        assert(x + width <= totalWidth);
        assert(y + height <= totalHeight);

        uint32_t y0 = totalHeight - (y + height);
        uint32_t y1 = totalHeight - y;
        uint8_t* p;
        for (uint32_t offsetY = y0; offsetY < y1; ++offsetY)
        {
            for (uint32_t offsetX = x; offsetX < (x + width); ++offsetX)
            {
                p = buf + (totalWidth * offsetY + offsetX) * 3;
                *p++ = r;
                *p++ = g;
                *p++ = b;
            }
        }
    }
}

class CanvasRenderingContext2DImpl
{
public:
    CanvasRenderingContext2DImpl() : _DC(nullptr)
    , _bmp(nullptr)
    , _font((HFONT)GetStockObject(DEFAULT_GUI_FONT))
    , _wnd(nullptr)
    , _savedDC(0)
    {
        _wnd = nullptr;
        HDC hdc = GetDC(_wnd);
        _DC = CreateCompatibleDC(hdc);
        ReleaseDC(_wnd, hdc);
    }

    ~CanvasRenderingContext2DImpl()
    {
        _prepareBitmap(0, 0);
        if (_DC)
        {
            DeleteDC(_DC);
        }
        _removeCustomFont();
    }

    void recreateBuffer(float w, float h)
    {
        _bufferWidth = w;
        _bufferHeight = h;
        if (_bufferWidth < 1.0f || _bufferHeight < 1.0f)
        {
            _prepareBitmap(0, 0);
            return;
        }

        int textureSize = _bufferWidth * _bufferHeight * 4;
        uint8_t* data = (uint8_t*)malloc(sizeof(uint8_t) * textureSize);
        memset(data, 0x00, textureSize);
        _imageData.fastSet(data, textureSize);

        _prepareBitmap(_bufferWidth, _bufferHeight);
    }

    void beginPath()
    {
        // called: set_lineWidth() -> beginPath() -> moveTo() -> lineTo() -> stroke(), when draw line
        _hpen = CreatePen(PS_SOLID, _lineWidth, RGB(255, 255, 255));
        // the return value of SelectObject is a handle to the object being replaced, so we should delete them to avoid memory leak
        HGDIOBJ hOldPen = SelectObject(_DC, _hpen);
        HGDIOBJ hOldBmp = SelectObject(_DC, _bmp);
        DeleteObject(hOldPen);
        DeleteObject(hOldBmp);

        SetBkMode(_DC, TRANSPARENT);
    }

    void closePath()
    {
    }

    void moveTo(float x, float y)
    {
        MoveToEx(_DC, x, -(y - _bufferHeight - _fontSize), nullptr);
    }

    void lineTo(float x, float y)
    {
        LineTo(_DC, x, -(y - _bufferHeight - _fontSize));
    }

    void stroke()
    {
        DeleteObject(_hpen);
        if (_bufferWidth < 1.0f || _bufferHeight < 1.0f)
            return;
        _imageData = _getTextureData();
    }

    void saveContext()
    {
        _savedDC = SaveDC(_DC);
    }

    void restoreContext()
    {
        BOOL ret = RestoreDC(_DC, _savedDC);
        if (0 == ret)
        {
            SE_LOGD("CanvasRenderingContext2DImpl restore context failed.\n");
        }
    }

    void clearRect(float x, float y, float w, float h)
    {
        if (_bufferWidth < 1.0f || _bufferHeight < 1.0f)
            return;
        if (_imageData.isNull())
            return;

        recreateBuffer(w, h);
    }

    void fillRect(float x, float y, float w, float h)
    {
        if (_bufferWidth < 1.0f || _bufferHeight < 1.0f)
            return;

        //not filled all Bits in buffer? the buffer length is _bufferWidth * _bufferHeight * 4, but it filled _bufferWidth * _bufferHeight * 3?
        uint8_t* buffer = _imageData.getBytes();
        if (buffer)
        {
            uint8_t r = _fillStyle.r * 255.0f;
            uint8_t g = _fillStyle.g * 255.0f;
            uint8_t b = _fillStyle.b * 255.0f;
            fillRectWithColor(buffer, (uint32_t)_bufferWidth, (uint32_t)_bufferHeight, (uint32_t)x, (uint32_t)y, (uint32_t)w, (uint32_t)h, r, g, b);
        }
    }

    void fillText(const std::string& text, float x, float y, float maxWidth)
    {
        if (text.empty() || _bufferWidth < 1.0f || _bufferHeight < 1.0f)
            return;

        SIZE textSize = { 0, 0 };
        Point offsetPoint = _convertDrawPoint(Point(x, y), text);

        _drawText(text, (int)offsetPoint.x, (int)offsetPoint.y);
        _imageData = _getTextureData();

    }

    void strokeText(const std::string& text, float x, float y, float maxWidth)
    {
        if (text.empty() || _bufferWidth < 1.0f || _bufferHeight < 1.0f)
            return;
        // REFINE
    }

    cocos2d::Size measureText(const std::string& text)
    {
        if (text.empty())
            return Size(0.0f, 0.0f);

        int bufferLen = 0;
        wchar_t * pwszBuffer = _utf8ToUtf16(text, &bufferLen);
        SIZE size = _sizeWithText(pwszBuffer, bufferLen);
        //SE_LOGD("CanvasRenderingContext2DImpl::measureText: %s, %d, %d\n", text.c_str(), size.cx, size.cy);
        CC_SAFE_DELETE_ARRAY(pwszBuffer);
        return Size(size.cx, size.cy);
    }

    void updateFont(const std::string& fontName, float fontSize, bool bold = false)
    {
        bool bRet = false;
        do
        {
            _fontName = fontName;
            _fontSize = fontSize;
            std::string fontPath;
            HFONT       hDefFont = (HFONT)GetStockObject(DEFAULT_GUI_FONT);
            LOGFONTA    tNewFont = { 0 };
            LOGFONTA    tOldFont = { 0 };
            GetObjectA(hDefFont, sizeof(tNewFont), &tNewFont);
            if (!_fontName.empty())
            {
                // firstly, try to create font from ttf file
                const auto& fontInfoMap = getFontFamilyNameMap();
                auto iter = fontInfoMap.find(_fontName);
                if (iter != fontInfoMap.end())
                {
                    fontPath = iter->second;
                    std::string tmpFontPath = fontPath;
                    int nFindPos = tmpFontPath.rfind("/");
                    tmpFontPath = &tmpFontPath[nFindPos + 1];
                    nFindPos = tmpFontPath.rfind(".");
                    // IDEA: draw ttf failed if font file name not equal font face name
                    // for example: "DejaVuSansMono-Oblique" not equal "DejaVu Sans Mono"  when using DejaVuSansMono-Oblique.ttf
                    _fontName = tmpFontPath.substr(0, nFindPos);
                }
                else
                {
                    auto nFindPos = fontName.rfind("/");
                    if (nFindPos != fontName.npos)
                    {
                        if (fontName.length() == nFindPos + 1)
                        {
                            _fontName = "";
                        }
                        else
                        {
                            _fontName = &_fontName[nFindPos + 1];
                        }
                    }
                }
                tNewFont.lfCharSet = DEFAULT_CHARSET;
                strcpy_s(tNewFont.lfFaceName, LF_FACESIZE, _fontName.c_str());
            }

            if (_fontSize)
            {
                tNewFont.lfHeight = -_fontSize;
            }

            if (bold)
            {
                tNewFont.lfWeight = FW_BOLD;
            }
            else
            {
                tNewFont.lfWeight = FW_NORMAL;
            }

            GetObjectA(_font, sizeof(tOldFont), &tOldFont);

            if (tOldFont.lfHeight == tNewFont.lfHeight
                && tOldFont.lfWeight == tNewFont.lfWeight
                && 0 == strcmp(tOldFont.lfFaceName, tNewFont.lfFaceName))
            {
                bRet = true;
                break;
            }

            // delete old font
            _removeCustomFont();

            if (fontPath.size() > 0)
            {
                _curFontPath = fontPath;
                wchar_t * pwszBuffer = _utf8ToUtf16(_curFontPath);
                if (pwszBuffer)
                {
                    if (AddFontResource(pwszBuffer))
                    {
                        SendMessage(_wnd, WM_FONTCHANGE, 0, 0);
                    }
                    delete[] pwszBuffer;
                    pwszBuffer = nullptr;
                }
            }

            _font = nullptr;

            // disable Cleartype
            tNewFont.lfQuality = ANTIALIASED_QUALITY;

            // create new font
            _font = CreateFontIndirectA(&tNewFont);
            if (!_font)
            {
                // create failed, use default font
                _font = hDefFont;
                break;
            }
            else
            {
                SelectObject(_DC, _font);
                SendMessage(_wnd, WM_FONTCHANGE, 0, 0);
            }

            bRet = true;

        } while (0);

    }

    void setTextAlign(CanvasTextAlign align)
    {
        _textAlign = align;
    }

    void setTextBaseline(CanvasTextBaseline baseline)
    {
        _textBaseLine = baseline;
    }

    void setFillStyle(float r, float g, float b, float a)
    {
        _fillStyle.r = r;
        _fillStyle.g = g;
        _fillStyle.b = b;
        _fillStyle.a = a;
    }

    void setStrokeStyle(float r, float g, float b, float a)
    {
        _strokeStyle.r = r;
        _strokeStyle.g = g;
        _strokeStyle.b = b;
        _strokeStyle.a = a;
    }

    void setLineWidth(float lineWidth)
    {
        _lineWidth = lineWidth;
    }

    const Data& getDataRef() const
    {
        return _imageData;
    }

    HDC _DC;
    HBITMAP _bmp;
private:

    Data _imageData;
    HFONT   _font;
    HWND    _wnd;
    HPEN _hpen;
    PAINTSTRUCT _paintStruct;
    std::string _curFontPath;
    int _savedDC;
    float _lineWidth = 0.0f;
    float _bufferWidth = 0.0f;
    float _bufferHeight = 0.0f;

    std::string _fontName;
    int _fontSize;
    SIZE _textSize;
    CanvasTextAlign _textAlign;
    CanvasTextBaseline _textBaseLine;
    cocos2d::Color4F _fillStyle;
    cocos2d::Color4F _strokeStyle;

    // change utf-8 string to utf-16, pRetLen is the string length after changing
    wchar_t * _utf8ToUtf16(const std::string& str, int * pRetLen = nullptr)
    {
        wchar_t * pwszBuffer = nullptr;
        do
        {
            if (str.empty())
            {
                break;
            }
            int nLen = str.size();
            int nBufLen = nLen + 1;
            pwszBuffer = new wchar_t[nBufLen];
            CC_BREAK_IF(!pwszBuffer);
            memset(pwszBuffer, 0, sizeof(wchar_t) * nBufLen);
            // str.size() not equal actuallyLen for Chinese char
            int actuallyLen = MultiByteToWideChar(CP_UTF8, 0, str.c_str(), nLen, pwszBuffer, nBufLen);
            // SE_LOGE("_utf8ToUtf16, str:%s, strLen:%d, retLen:%d\n", str.c_str(), str.size(), actuallyLen);
            if (pRetLen != nullptr) {
                *pRetLen = actuallyLen;
            }
        } while (0);
        return pwszBuffer;

    }

    void _removeCustomFont()
    {
        HFONT hDefFont = (HFONT)GetStockObject(DEFAULT_GUI_FONT);
        if (hDefFont != _font)
        {
            DeleteObject(_font);
            _font = hDefFont;
        }
        // release temp font resource
        if (_curFontPath.size() > 0)
        {
            wchar_t * pwszBuffer = _utf8ToUtf16(_curFontPath);
            if (pwszBuffer)
            {
                RemoveFontResource(pwszBuffer);
                SendMessage(_wnd, WM_FONTCHANGE, 0, 0);
                delete[] pwszBuffer;
                pwszBuffer = nullptr;
            }
            _curFontPath.clear();
        }
    }

    // x, y offset value
    int _drawText(const std::string& text, int x, int y)
    {
        int nRet = 0;
        wchar_t * pwszBuffer = nullptr;
        do
        {
            CC_BREAK_IF(text.empty());

            DWORD dwFmt = DT_SINGLELINE;

            int bufferLen = 0;
            pwszBuffer = _utf8ToUtf16(text, &bufferLen);

            SIZE newSize = _sizeWithText(pwszBuffer, bufferLen);

            _textSize = newSize;

            RECT rcText = { 0 };

            rcText.right = newSize.cx;
            rcText.bottom = newSize.cy;

            LONG offsetX = x;
            LONG offsetY = y;
            if (offsetX || offsetY)
            {
                OffsetRect(&rcText, offsetX, offsetY);
            }

            // SE_LOGE("_drawText text,%s size: (%d, %d) offset after convert: (%d, %d) \n", text.c_str(), newSize.cx, newSize.cy, offsetX, offsetY);

            // draw text
            HGDIOBJ hOldFont = SelectObject(_DC, _font);
            HGDIOBJ hOldBmp = SelectObject(_DC, _bmp);

            SetBkMode(_DC, TRANSPARENT);
            SetTextColor(_DC, RGB(255, 255, 255)); // white color

            // draw text
            nRet = DrawTextW(_DC, pwszBuffer, bufferLen, &rcText, dwFmt);

            DeleteObject(hOldBmp);
            DeleteObject(hOldFont);
        } while (0);
        CC_SAFE_DELETE_ARRAY(pwszBuffer);

        return nRet;
    }

    SIZE _sizeWithText(const wchar_t * pszText, int nLen)
    {
        SIZE tRet = { 0 };
        do
        {
            CC_BREAK_IF(!pszText || nLen <= 0);

            RECT rc = { 0, 0, 0, 0 };
            DWORD dwCalcFmt = DT_CALCRECT;

            // use current font to measure text extent
            HGDIOBJ hOld = SelectObject(_DC, _font);

            // measure text size
            DrawTextW(_DC, pszText, nLen, &rc, dwCalcFmt);

            tRet.cx = rc.right;
            tRet.cy = rc.bottom;

            DeleteObject(hOld);

        } while (0);

        return tRet;
    }

    bool _prepareBitmap(int nWidth, int nHeight)
    {
        // release bitmap
        if (_bmp)
        {
            DeleteObject(_bmp);
            _bmp = nullptr;
        }
        if (nWidth > 0 && nHeight > 0)
        {
            _bmp = CreateBitmap(nWidth, nHeight, 1, 32, nullptr);
            if (!_bmp)
            {
                return false;
            }
        }
        return true;
    }

    Data _getTextureData()
    {
        Data ret;
        do
        {
            int dataLen = _bufferWidth * _bufferHeight * 4;
            unsigned char* dataBuf = (unsigned char*)malloc(sizeof(unsigned char) * dataLen);
            CC_BREAK_IF(!dataBuf);

            struct
            {
                BITMAPINFOHEADER bmiHeader;
                int mask[4];
            } bi = { 0 };
            bi.bmiHeader.biSize = sizeof(bi.bmiHeader);
            CC_BREAK_IF(!GetDIBits(_DC, _bmp, 0, 0,
                                   nullptr, (LPBITMAPINFO)&bi, DIB_RGB_COLORS));

            // copy pixel data
            bi.bmiHeader.biHeight = (bi.bmiHeader.biHeight > 0) ? -bi.bmiHeader.biHeight : bi.bmiHeader.biHeight;
            GetDIBits(_DC, _bmp, 0, _bufferHeight, dataBuf,
                      (LPBITMAPINFO)&bi, DIB_RGB_COLORS);


            uint8_t r, g, b;
            float alpha = _fillStyle.a;
            COLORREF * pPixel = nullptr;
            for (int y = 0; y < _bufferHeight; ++y)
            {
                pPixel = (COLORREF *)dataBuf + y * (int)_bufferWidth;
                for (int x = 0; x < _bufferWidth; ++x)
                {
                    COLORREF& clr = *pPixel;
                    uint8_t dirtyValue = GetRValue(clr);
                    // "dirtyValue > 0" means pixel was covered when drawing text
                    if (dirtyValue > 0)
                    {
                        // r = _fillStyle.r * 255 * (dirtyValue / 255) * alpha;
                        r = _fillStyle.r * dirtyValue * alpha;
                        g = _fillStyle.g * dirtyValue * alpha;
                        b = _fillStyle.b * dirtyValue * alpha;
                        COLORREF textColor = (b << 16 | g << 8 | r) & 0x00ffffff;
                        clr = ((BYTE)(dirtyValue * alpha) << 24) | textColor;
                    }
                    ++pPixel;
                }
            }

            ret.fastSet(dataBuf, dataLen);
        } while (0);

        return ret;
    }

    Point _convertDrawPoint(Point point, std::string text) {
        Size textSize = measureText(text);
        if (_textAlign == CanvasTextAlign::CENTER)
        {
            point.x -= textSize.width / 2.0f;
        }
        else if (_textAlign == CanvasTextAlign::RIGHT)
        {
            point.x -= textSize.width;
        }

        if (_textBaseLine == CanvasTextBaseline::TOP)
        {
            point.y += _fontSize;
        }
        else if (_textBaseLine == CanvasTextBaseline::MIDDLE)
        {
            point.y += _fontSize / 2.0f;
        }
        // The origin of drawing text on win32 is from top-left, but now we get bottom-left,
        // So, we need to substract the font size to convert 'point' to top-left.
        point.y -= _fontSize;

        // We use font size to calculate text height, but draw text on win32 is based on
        // the real font height and in top-left position, substract the adjust value to make text inside text rectangle.
        // check
        // point.y -= (textSize.height - _fontSize) / 2.0f;

        return point;
    }
};

NS_CC_BEGIN

CanvasGradient::CanvasGradient()
{
    //SE_LOGD("CanvasGradient constructor: %p\n", this);
}

CanvasGradient::~CanvasGradient()
{
    //SE_LOGD("CanvasGradient destructor: %p\n", this);
}

void CanvasGradient::addColorStop(float offset, const std::string& color)
{
    //SE_LOGD("CanvasGradient::addColorStop: %p\n", this);
}

// CanvasRenderingContext2D

CanvasRenderingContext2D::CanvasRenderingContext2D(float width, float height)
: __width(width)
, __height(height)
{
    //SE_LOGD("CanvasRenderingContext2D constructor: %p, width: %f, height: %f\n", this, width, height);
    _impl = new CanvasRenderingContext2DImpl();
    recreateBufferIfNeeded();
}

CanvasRenderingContext2D::~CanvasRenderingContext2D()
{
    //SE_LOGD("CanvasRenderingContext2D destructor: %p\n", this);
    delete _impl;
}

void CanvasRenderingContext2D::recreateBufferIfNeeded()
{
    if (_isBufferSizeDirty)
    {
        _isBufferSizeDirty = false;
        //SE_LOGD("Recreate buffer %p, w: %f, h:%f\n", this, __width, __height);
        _impl->recreateBuffer(__width, __height);
        if (_canvasBufferUpdatedCB != nullptr)
            _canvasBufferUpdatedCB(_impl->getDataRef());
    }
}

void CanvasRenderingContext2D::clearRect(float x, float y, float width, float height)
{
    //SE_LOGD("CanvasRenderingContext2D::clearRect: %p, %f, %f, %f, %f\n", this, x, y, width, height);
    recreateBufferIfNeeded();
    _impl->clearRect(x, y, width, height);
}

void CanvasRenderingContext2D::fillRect(float x, float y, float width, float height)
{
    recreateBufferIfNeeded();
    _impl->fillRect(x, y, width, height);

    if (_canvasBufferUpdatedCB != nullptr)
        _canvasBufferUpdatedCB(_impl->getDataRef());
}

void CanvasRenderingContext2D::fillText(const std::string& text, float x, float y, float maxWidth)
{
    //SE_LOGD("CanvasRenderingContext2D::fillText: %s, offset: (%f, %f), %f\n", text.c_str(), x, y, maxWidth);
    if (text.empty())
        return;
    recreateBufferIfNeeded();

    _impl->fillText(text, x, y, maxWidth);
    if (_canvasBufferUpdatedCB != nullptr)
        _canvasBufferUpdatedCB(_impl->getDataRef());
}

void CanvasRenderingContext2D::strokeText(const std::string& text, float x, float y, float maxWidth)
{
    //SE_LOGD("CanvasRenderingContext2D::strokeText: %s, %f, %f, %f\n", text.c_str(), x, y, maxWidth);
    if (text.empty())
        return;
    recreateBufferIfNeeded();

    _impl->strokeText(text, x, y, maxWidth);

    if (_canvasBufferUpdatedCB != nullptr)
        _canvasBufferUpdatedCB(_impl->getDataRef());
}

cocos2d::Size CanvasRenderingContext2D::measureText(const std::string& text)
{
    //SE_LOGD("CanvasRenderingContext2D::measureText: %s\n", text.c_str());
    return _impl->measureText(text);
}

CanvasGradient* CanvasRenderingContext2D::createLinearGradient(float x0, float y0, float x1, float y1)
{
    return nullptr;
}

void CanvasRenderingContext2D::save()
{
    //SE_LOGD("CanvasRenderingContext2D::save\n");
    _impl->saveContext();
}

void CanvasRenderingContext2D::beginPath()
{
    //SE_LOGD("\n-----------begin------------------\nCanvasRenderingContext2D::beginPath\n");
    _impl->beginPath();
}

void CanvasRenderingContext2D::closePath()
{
    //SE_LOGD("CanvasRenderingContext2D::closePath\n");
    _impl->closePath();
}

void CanvasRenderingContext2D::moveTo(float x, float y)
{
    //SE_LOGD("CanvasRenderingContext2D::moveTo\n");
    _impl->moveTo(x, y);
}

void CanvasRenderingContext2D::lineTo(float x, float y)
{
    //SE_LOGD("CanvasRenderingContext2D::lineTo\n");
    _impl->lineTo(x, y);
}

void CanvasRenderingContext2D::stroke()
{
    //SE_LOGD("CanvasRenderingContext2D::stroke\n");
    _impl->stroke();

    if (_canvasBufferUpdatedCB != nullptr)
        _canvasBufferUpdatedCB(_impl->getDataRef());
}

void CanvasRenderingContext2D::restore()
{
    //SE_LOGD("CanvasRenderingContext2D::restore\n");
    _impl->restoreContext();
}

void CanvasRenderingContext2D::setCanvasBufferUpdatedCallback(const CanvasBufferUpdatedCallback& cb)
{
    _canvasBufferUpdatedCB = cb;
}

void CanvasRenderingContext2D::set__width(float width)
{
    //SE_LOGD("CanvasRenderingContext2D::set__width: %f\n", width);
    __width = width;
    _isBufferSizeDirty = true;
    recreateBufferIfNeeded();
}

void CanvasRenderingContext2D::set__height(float height)
{
    //SE_LOGD("CanvasRenderingContext2D::set__height: %f\n", height);
    __height = height;
    _isBufferSizeDirty = true;
    recreateBufferIfNeeded();
}

void CanvasRenderingContext2D::set_lineWidth(float lineWidth)
{
    //SE_LOGD("CanvasRenderingContext2D::set_lineWidth %d\n", lineWidth);
    _lineWidth = lineWidth;
    _impl->setLineWidth(lineWidth);
}

void CanvasRenderingContext2D::set_lineCap(const std::string& lineCap)
{
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::set_lineJoin(const std::string& lineJoin)
{
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::fill()
{
    // SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}
void CanvasRenderingContext2D::rect(float x, float y, float w, float h)
{
    // SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::set_font(const std::string& font)
{
    if (_font != font)
    {
        _font = font;

        std::string boldStr;
        std::string fontName = "Arial";
        std::string fontSizeStr = "30";

        // support get font name from `60px American` or `60px "American abc-abc_abc"`
        std::regex re("(bold)?\\s*((\\d+)([\\.]\\d+)?)px\\s+([\\w-]+|\"[\\w -]+\"$)");
        std::match_results<std::string::const_iterator> results;
        if (std::regex_search(_font.cbegin(), _font.cend(), results, re))
        {
            boldStr = results[1].str();
            fontSizeStr = results[2].str();
            fontName = results[5].str();
        }

        float fontSize = atof(fontSizeStr.c_str());
        //SE_LOGD("CanvasRenderingContext2D::set_font: %s, Size: %f, isBold: %b\n", fontName.c_str(), fontSize, !boldStr.empty());
        _impl->updateFont(fontName, fontSize, !boldStr.empty());
    }
}

void CanvasRenderingContext2D::set_textAlign(const std::string& textAlign)
{
    //SE_LOGD("CanvasRenderingContext2D::set_textAlign: %s\n", textAlign.c_str());
    if (textAlign == "left")
    {
        _impl->setTextAlign(CanvasTextAlign::LEFT);
    }
    else if (textAlign == "center" || textAlign == "middle")
    {
        _impl->setTextAlign(CanvasTextAlign::CENTER);
    }
    else if (textAlign == "right")
    {
        _impl->setTextAlign(CanvasTextAlign::RIGHT);
    }
    else
    {
        assert(false);
    }
}

void CanvasRenderingContext2D::set_textBaseline(const std::string& textBaseline)
{
    //SE_LOGD("CanvasRenderingContext2D::set_textBaseline: %s\n", textBaseline.c_str());
    if (textBaseline == "top")
    {
        _impl->setTextBaseline(CanvasTextBaseline::TOP);
    }
    else if (textBaseline == "middle")
    {
        _impl->setTextBaseline(CanvasTextBaseline::MIDDLE);
    }
    else if (textBaseline == "bottom" || textBaseline == "alphabetic") //REFINE:, how to deal with alphabetic, currently we handle it as bottom mode.
    {
        _impl->setTextBaseline(CanvasTextBaseline::BOTTOM);
    }
    else
    {
        assert(false);
    }
}

void CanvasRenderingContext2D::set_fillStyle(const std::string& fillStyle)
{
    CSSColorParser::Color color = CSSColorParser::parse(fillStyle);
    _impl->setFillStyle(color.r/255.0f, color.g/255.0f, color.b/255.0f, color.a);
    //SE_LOGD("CanvasRenderingContext2D::set_fillStyle: %s, (%d, %d, %d, %f)\n", fillStyle.c_str(), color.r, color.g, color.b, color.a);
}

void CanvasRenderingContext2D::set_strokeStyle(const std::string& strokeStyle)
{
    CSSColorParser::Color color = CSSColorParser::parse(strokeStyle);
    _impl->setStrokeStyle(color.r/255.0f, color.g/255.0f, color.b/255.0f, color.a);
}

void CanvasRenderingContext2D::set_globalCompositeOperation(const std::string& globalCompositeOperation)
{
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::_fillImageData(const Data& imageData, float imageWidth, float imageHeight, float offsetX, float offsetY)
{
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}
// transform
//REFINE:

void CanvasRenderingContext2D::translate(float x, float y)
{
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::scale(float x, float y)
{
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::rotate(float angle)
{
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::transform(float a, float b, float c, float d, float e, float f)
{
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::setTransform(float a, float b, float c, float d, float e, float f)
{
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

NS_CC_END
