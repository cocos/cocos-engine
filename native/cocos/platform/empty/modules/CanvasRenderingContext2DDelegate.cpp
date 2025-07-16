/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "platform/empty/modules/CanvasRenderingContext2DDelegate.h"
#include "platform/empty/EmptyPlatform.h"

namespace {
#define RGB(r, g, b)     (int)((int)r | (((int)g) << 8) | (((int)b) << 16))
#define RGBA(r, g, b, a) (int)((int)r | (((int)g) << 8) | (((int)b) << 16) | (((int)a) << 24))
} // namespace

namespace cc {

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
    //
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

void CanvasRenderingContext2DDelegate::fillText(const ccstd::string &text, float x, float y, float /*maxWidth*/) {
}

void CanvasRenderingContext2DDelegate::strokeText(const ccstd::string &text, float /*x*/, float /*y*/, float /*maxWidth*/) const {
}

CanvasRenderingContext2DDelegate::Size CanvasRenderingContext2DDelegate::measureText(const ccstd::string &text) {
    return Size{0, 0};
}

void CanvasRenderingContext2DDelegate::updateFont(const ccstd::string &fontName,
                                                  float fontSize,
                                                  bool bold,
                                                  bool italic,
                                                  bool oblique,
                                                  bool /* smallCaps */) {
}

void CanvasRenderingContext2DDelegate::setTextAlign(TextAlign align) {
}

void CanvasRenderingContext2DDelegate::setTextBaseline(TextBaseline baseline) {
    //
}

void CanvasRenderingContext2DDelegate::setFillStyle(uint8_t r, uint8_t g, uint8_t b, uint8_t a) {
    //
}

void CanvasRenderingContext2DDelegate::setStrokeStyle(uint8_t r, uint8_t g, uint8_t b, uint8_t a) {
    //
}

void CanvasRenderingContext2DDelegate::setLineWidth(float lineWidth) {
    //
}

const cc::Data &CanvasRenderingContext2DDelegate::getDataRef() const {
    return _imageData;
}

void CanvasRenderingContext2DDelegate::fill() {
}

void CanvasRenderingContext2DDelegate::setLineCap(const ccstd::string &lineCap) {
}

void CanvasRenderingContext2DDelegate::setLineJoin(const ccstd::string &lineJoin) {
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
