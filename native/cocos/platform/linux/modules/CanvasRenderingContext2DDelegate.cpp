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

#include "platform/linux/modules/CanvasRenderingContext2DDelegate.h"
#include "platform/linux/LinuxPlatform.h"
#include "platform/linux/modules/SystemWindow.h"

namespace {
#define RGB(r, g, b)     (int)((int)r | (((int)g) << 8) | (((int)b) << 16))
#define RGBA(r, g, b, a) (int)((int)r | (((int)g) << 8) | (((int)b) << 16) | (((int)a) << 24))
} // namespace

namespace cc {
//static const char gdefaultFontName[] = "-*-helvetica-medium-o-*-*-24-*-*-*-*-*-iso8859-*";
//static const char gdefaultFontName[] = "lucidasanstypewriter-bold-24";
static const char gdefaultFontName[] = "lucidasans-24";

CanvasRenderingContext2DDelegate::CanvasRenderingContext2DDelegate() {
    SystemWindow *window = BasePlatform::getPlatform()->getInterface<SystemWindow>();
    CC_ASSERT_NOT_NULL(window);
    _dis = reinterpret_cast<Display *>(window->getDisplay());
    _win = reinterpret_cast<Drawable>(window->getWindowHandle());
}

CanvasRenderingContext2DDelegate::~CanvasRenderingContext2DDelegate() {
    XFreePixmap(_dis, _pixmap);
    XFreeGC(_dis, _gc);
}

void CanvasRenderingContext2DDelegate::recreateBuffer(float w, float h) {
    _bufferWidth = w;
    _bufferHeight = h;
    if (_bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }
    auto textureSize = static_cast<int>(_bufferWidth * _bufferHeight * 4);
    auto *data = static_cast<int8_t *>(malloc(sizeof(int8_t) * textureSize));
    memset(data, 0x00, textureSize);
    _imageData.fastSet((uint8_t *)data, textureSize);

    if (_pixmap) {
        XFreePixmap(_dis, _pixmap);
        _pixmap = 0;
    }
    if (!_win) {
        return;
    }
    //Screen *scr = DefaultScreenOfDisplay(_dis);
    _pixmap = XCreatePixmap(_dis, _win, w, h, 32);
    _gc = XCreateGC(_dis, _pixmap, 0, 0);
}

void CanvasRenderingContext2DDelegate::beginPath() {
    // called: set_lineWidth() -> beginPath() -> moveTo() -> lineTo() -> stroke(), when draw line
    XSetLineAttributes(_dis, _gc, static_cast<int>(_lineWidth), LineSolid, _lineCap, _lineJoin);
    XSetForeground(_dis, _gc, RGB(255, 255, 255));
}

void CanvasRenderingContext2DDelegate::closePath() {
}

void CanvasRenderingContext2DDelegate::moveTo(float x, float y) {
    //MoveToEx(_DC, static_cast<int>(x), static_cast<int>(-(y - _bufferHeight - _fontSize)), nullptr);
    _x = x;
    _y = y;
}

void CanvasRenderingContext2DDelegate::lineTo(float x, float y) {
    //LineTo(_DC,  static_cast<int>(x),  static_cast<int>(-(y - _bufferHeight - _fontSize)));
    XDrawLine(_dis, _pixmap, _gc, _x, _y, x, y);
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

    XSetForeground(_dis, _gc, _fillStyle);
    XFillRectangle(_dis, _pixmap, _gc, x, y, w, h);
}

void CanvasRenderingContext2DDelegate::fillText(const ccstd::string &text, float x, float y, float /*maxWidth*/) {
    if (text.empty() || _bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }

    Point offsetPoint = convertDrawPoint(Point{x, y}, text);
    XSetForeground(_dis, _gc, 0xff000000 | _fillStyle);
    XSetFont(_dis, _gc, _font->fid);
    XDrawString(_dis, _pixmap, _gc, offsetPoint[0], offsetPoint[1], text.c_str(), (int)(text.length()));
    XImage *image = XGetImage(_dis, _pixmap, 0, 0, _bufferWidth, _bufferHeight, AllPlanes, ZPixmap);
    int width = image->width;
    int height = image->height;
    unsigned char *data = _imageData.getBytes();
    for (int y = 0; y < height; ++y) {
        for (int x = 0; x < width; x++) {
            *(((int *)data + (y * width) + x)) = static_cast<int>(XGetPixel(image, x, y));
        }
    }
}

void CanvasRenderingContext2DDelegate::strokeText(const ccstd::string &text, float /*x*/, float /*y*/, float /*maxWidth*/) const {
    if (text.empty() || _bufferWidth < 1.0F || _bufferHeight < 1.0F) {
        return;
    }
}

CanvasRenderingContext2DDelegate::Size CanvasRenderingContext2DDelegate::measureText(const ccstd::string &text) {
    if (text.empty())
        return ccstd::array<float, 2>{0.0f, 0.0f};
    int font_ascent = 0;
    int font_descent = 0;
    int direction = 0;
    XCharStruct overall;
    XQueryTextExtents(_dis, _font->fid, text.c_str(), text.length(), &direction, &font_ascent, &font_descent, &overall);
    return ccstd::array<float, 2>{static_cast<float>(overall.width),
                                  static_cast<float>(overall.ascent + overall.descent)};
}

void CanvasRenderingContext2DDelegate::updateFont(const ccstd::string &fontName,
                                                  float fontSize,
                                                  bool bold,
                                                  bool italic,
                                                  bool oblique,
                                                  bool /* smallCaps */) {
    do {
        _fontName = fontName;
        _fontSize = static_cast<int>(fontSize);
        /// TODO(bug):Remove default settings
        ccstd::string fontName = "helvetica"; // default
        char serv[1024] = {0};
        ccstd::string slant = "";
        if (italic) {
            slant = "*I";
        } else if (oblique) {
            slant = "*o";
        }
        // *name-bold*Italic(Oblique)*size
        snprintf(serv, sizeof(serv) - 1, "*%s%s%s*--%d*", fontName.c_str(),
                 bold ? "*Bold" : "",
                 slant.c_str(),
                 _fontSize);
        if (_font) {
            XFreeFont(_dis, _font);
            _font = 0;
        }

        _font = XLoadQueryFont(_dis, serv);
        if (!_font) {
            static int fontSizes[] = {8, 10, 12, 14, 18, 24};
            int i = 0;
            int size = sizeof(fontSizes) / sizeof(fontSizes[0]);
            for (i = 0; i < size; ++i) {
                if (_fontSize < fontSizes[i]) {
                    break;
                }
            }
            if (i == 0) {
                _fontSize = fontSizes[0];
            } else if (i > 1 && i < size) {
                _fontSize = fontSizes[i - 1];
            } else {
                _fontSize = fontSizes[size - 1];
            }
            snprintf(serv, sizeof(serv) - 1, "*%s*%d*", "lucidasans", _fontSize);
            _font = XLoadQueryFont(_dis, serv);
            if (!_font) {
                _font = XLoadQueryFont(_dis, serv);
            }
        }
    } while (false);
}

void CanvasRenderingContext2DDelegate::setTextAlign(TextAlign align) {
    _textAlign = align;
}

void CanvasRenderingContext2DDelegate::setTextBaseline(TextBaseline baseline) {
    _textBaseLine = baseline;
}

void CanvasRenderingContext2DDelegate::setFillStyle(uint8_t r, uint8_t g, uint8_t b, uint8_t a) {
    _fillStyle = RGBA(r, g, b, a);
}

void CanvasRenderingContext2DDelegate::setStrokeStyle(uint8_t r, uint8_t g, uint8_t b, uint8_t a) {
    _strokeStyle = RGBA(r, g, b, a);
}

void CanvasRenderingContext2DDelegate::setLineWidth(float lineWidth) {
    _lineWidth = lineWidth;
}

const cc::Data &CanvasRenderingContext2DDelegate::getDataRef() const {
    return _imageData;
}

void CanvasRenderingContext2DDelegate::removeCustomFont() {
    XFreeFont(_dis, None);
}

// x, y offset value
int CanvasRenderingContext2DDelegate::drawText(const ccstd::string &text, int x, int y) {
    XTextItem item{const_cast<char *>(text.c_str()), static_cast<int>(text.length()), 0, None};
    return XDrawText(_dis, _pixmap, _gc, x, y, &item, 1);
}

CanvasRenderingContext2DDelegate::Size CanvasRenderingContext2DDelegate::sizeWithText(const wchar_t *pszText, int nLen) {
    // if (text.empty())
    //     return ccstd::array<float, 2>{0.0f, 0.0f};
    // XFontStruct *fs = XLoadQueryFont(dpy, "cursor");
    // CC_ASSERT(fs);
    // int font_ascent = 0;
    // int font_descent = 0;
    // XCharStruct overall;
    // XQueryTextExtents(_dis, fs -> fid, text.c_str(), text.length(), nullptr, &font_ascent, &font_descent, &overall);
    // return ccstd::array<float, 2>{static_cast<float>(overall.lbearing),
    //                             static_cast<float>(overall.rbearing)};
    return ccstd::array<float, 2>{0.0F, 0.0F};
}

void CanvasRenderingContext2DDelegate::prepareBitmap(int nWidth, int nHeight) {
}

void CanvasRenderingContext2DDelegate::deleteBitmap() {
}

void CanvasRenderingContext2DDelegate::fillTextureData() {
}

ccstd::array<float, 2> CanvasRenderingContext2DDelegate::convertDrawPoint(Point point, const ccstd::string &text) {
    int font_ascent = 0;
    int font_descent = 0;
    int direction = 0;
    XCharStruct overall;
    XQueryTextExtents(_dis, _font->fid, text.c_str(), text.length(), &direction, &font_ascent, &font_descent, &overall);
    int width = overall.width;
    if (_textAlign == TextAlign::CENTER) {
        point[0] -= width / 2.0f;
    } else if (_textAlign == TextAlign::RIGHT) {
        point[0] -= width;
    }

    if (_textBaseLine == TextBaseline::TOP) {
        point[1] += overall.ascent;
    } else if (_textBaseLine == TextBaseline::MIDDLE) {
        point[1] += (overall.descent - overall.ascent) / 2 - overall.descent;
    } else if (_textBaseLine == TextBaseline::BOTTOM) {
        point[1] += -overall.descent;
    } else if (_textBaseLine == TextBaseline::ALPHABETIC) {
        //point[1] -= overall.ascent;
        // X11 The default way of drawing text
    }

    return point;
}

void CanvasRenderingContext2DDelegate::fill() {
}

void CanvasRenderingContext2DDelegate::setLineCap(const ccstd::string &lineCap) {
    _lineCap = LineSolid;
}

void CanvasRenderingContext2DDelegate::setLineJoin(const ccstd::string &lineJoin) {
    _lineJoin = JoinRound;
}

void CanvasRenderingContext2DDelegate::fillImageData(const Data & /* imageData */,
                                                     float /* imageWidth */,
                                                     float /* imageHeight */,
                                                     float /* offsetX */,
                                                     float /* offsetY */) {
    //XCreateImage(display, visual, DefaultDepth(display,DefaultScreen(display)), ZPixmap, 0, image32, width, height, 32, 0);
    //XPutImage(dpy, w, gc, image, 0, 0, 50, 60, 40, 30);
}

void CanvasRenderingContext2DDelegate::strokeText(const ccstd::string & /* text */,
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
