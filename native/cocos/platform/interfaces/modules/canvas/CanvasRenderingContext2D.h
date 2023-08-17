/****************************************************************************
 Copyright (c) 2018-2023 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include "platform/interfaces/modules/canvas/ICanvasRenderingContext2D.h"

namespace cc {

class CC_DLL CanvasGradient : public ICanvasGradient {
public:
    CanvasGradient();
    ~CanvasGradient() override; // NOLINT(performance-trivially-destructible)
    void addColorStop(float offset, const ccstd::string &color) override;
};

class CC_DLL CanvasRenderingContext2D : public ICanvasRenderingContext2D {
public:
    CanvasRenderingContext2D(float width, float height);
    ~CanvasRenderingContext2D() override;

    // Rect
    void rect(float x, float y, float width, float height) override;
    void clearRect(float x, float y, float width, float height) override;
    void fillRect(float x, float y, float width, float height) override;

    void fillText(const ccstd::string &text, float x, float y, float maxWidth) override;
    void strokeText(const ccstd::string &text, float x, float y, float maxWidth) override;
    Size measureText(const ccstd::string &text) override;
    ICanvasGradient *createLinearGradient(float x0, float y0, float x1, float y1) override;
    void save() override;
    // Paths
    void beginPath() override;
    void closePath() override;
    void moveTo(float x, float y) override;
    void lineTo(float x, float y) override;
    void fill() override;
    void stroke() override;
    void restore() override;

    // callback
    using CanvasBufferUpdatedCallback = std::function<void(const cc::Data &)>;
    void setCanvasBufferUpdatedCallback(const CanvasBufferUpdatedCallback &cb) override;
    void fetchData() override;

    // functions for properties
    void setWidth(float width) override;
    void setHeight(float height) override;
    void setLineWidth(float lineWidth) override;
    void setLineJoin(const ccstd::string &lineJoin) override;
    void setLineCap(const ccstd::string &lineCap) override;
    void setFont(const ccstd::string &font) override;
    void setTextAlign(const ccstd::string &textAlign) override;
    void setTextBaseline(const ccstd::string &textBaseline) override;
    void setFillStyle(const ccstd::string &fillStyle) override;
    void setStrokeStyle(const ccstd::string &strokeStyle) override;
    void setGlobalCompositeOperation(const ccstd::string &globalCompositeOperation) override;
    void setShadowBlur(float blur) override;
    void setShadowColor(const ccstd::string &shadowColor) override;
    void setShadowOffsetX(float offsetX) override;
    void setShadowOffsetY(float offsetY) override;

    // fill image data into Context2D
    void fillImageData(const Data &imageData, float imageWidth, float imageHeight, float offsetX, float offsetY) override;

    // transform
    void translate(float x, float y) override;
    void scale(float x, float y) override;
    void rotate(float angle) override;

    void transform(float a, float b, float c, float d, float e, float f) override;
    void setTransform(float a, float b, float c, float d, float e, float f) override;

private:
    void recreateBufferIfNeeded() override;

public:
    float _width = 0.0F;
    float _height = 0.0F;

    // Line styles
    float _lineWidth = 1.0F;
    ccstd::string _lineJoin = "miter";
    ccstd::string _lineCap = "butt";

    // Text styles
    ccstd::string _font = "10px sans-serif";
    ccstd::string _textAlign = "start";
    ccstd::string _textBaseline = "alphabetic";

    // Fill and stroke styles
    ccstd::string _fillStyle = "#000";

    ccstd::string _strokeStyle = "#000";

    // Compositing
    ccstd::string _globalCompositeOperation = "source-over";

private:
    ICanvasRenderingContext2D::Delegate *_delegate;

    CanvasBufferUpdatedCallback _canvasBufferUpdatedCB = nullptr;

    bool _isBufferSizeDirty = true;
};

} // namespace cc
