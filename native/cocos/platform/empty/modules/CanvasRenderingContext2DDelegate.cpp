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

#include "platform/empty/modules/CanvasRenderingContext2DDelegate.h"
#include "platform/empty/EmptyPlatform.h"

namespace {
#define RGB(r, g, b)     (int)((int)r | (((int)g) << 8) | (((int)b) << 16))
#define RGBA(r, g, b, a) (int)((int)r | (((int)g) << 8) | (((int)b) << 16) | (((int)a) << 24))
} // namespace

namespace cc {
//static const char gdefaultFontName[] = "-*-helvetica-medium-o-*-*-24-*-*-*-*-*-iso8859-*";
//static const char gdefaultFontName[] = "lucidasanstypewriter-bold-24";
static const char gdefaultFontName[]  = "lucidasans-24";

CanvasRenderingContext2DDelegate::CanvasRenderingContext2DDelegate() {
}

CanvasRenderingContext2DDelegate::~CanvasRenderingContext2DDelegate() {
}

void CanvasRenderingContext2DDelegate::recreateBuffer(float w, float h) {
}

void CanvasRenderingContext2DDelegate::beginPath() {
}

void CanvasRenderingContext2DDelegate::closePath() {
}

void CanvasRenderingContext2DDelegate::moveTo(float x, float y) {
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
}

void CanvasRenderingContext2DDelegate::fillText(const std::string &text, float x, float y, float /*maxWidth*/) {
}

void CanvasRenderingContext2DDelegate::strokeText(const std::string &text, float /*x*/, float /*y*/, float /*maxWidth*/) const {
}

CanvasRenderingContext2DDelegate::Size CanvasRenderingContext2DDelegate::measureText(const std::string &text) {
}

void CanvasRenderingContext2DDelegate::updateFont(const std::string &fontName,
                                                  float              fontSize,
                                                  bool               bold,
                                                  bool               italic,
                                                  bool               oblique,
                                                  bool /* smallCaps */) {
}

void CanvasRenderingContext2DDelegate::setTextAlign(CanvasTextAlign align) {
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
    return _imageData;
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
    //XCreateImage(display, visual, DefaultDepth(display,DefaultScreen(display)), ZPixmap, 0, image32, width, height, 32, 0);
    //XPutImage(dpy, w, gc, image, 0, 0, 50, 60, 40, 30);
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