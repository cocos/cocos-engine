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
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include "platform/interfaces/modules/canvas/ICanvasRenderingContext2D.h"

namespace cc {

class CanvasGradient : public ICanvasGradient {
public:
    CanvasGradient();
    ~CanvasGradient() override; // NOLINT(performance-trivially-destructible)
    void addColorStop(float offset, const std::string &color) override;
};

class CanvasRenderingContext2D : public ICanvasRenderingContext2D {
public:
    CanvasRenderingContext2D(float width, float height);
    ~CanvasRenderingContext2D() override;

    // Rect
    void rect(float x, float y, float width, float height) override;
    void clearRect(float x, float y, float width, float height) override;
    void fillRect(float x, float y, float width, float height) override;

    void             fillText(const std::string &text, float x, float y, float maxWidth) override;
    void             strokeText(const std::string &text, float x, float y, float maxWidth) override;
    Size             measureText(const std::string &text) override;
    ICanvasGradient *createLinearGradient(float x0, float y0, float x1, float y1) override;
    void             save() override;
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

    // functions for properties
    void setWidth(float width) override;
    void setHeight(float height) override;
    void setLineWidth(float lineWidth) override;
    void setLineJoin(const std::string &lineJoin) override;
    void setLineCap(const std::string &lineCap) override;
    void setFont(const std::string &font) override;
    void setTextAlign(const std::string &textAlign) override;
    void setTextBaseline(const std::string &textBaseline) override;
    void setFillStyle(const std::string &fillStyle) override;
    void setStrokeStyle(const std::string &strokeStyle) override;
    void setGlobalCompositeOperation(const std::string &globalCompositeOperation) override;

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
    float _width  = 0.0F;
    float _height = 0.0F;

    // Line styles
    float       _lineWidth = 1.0F;
    std::string _lineJoin  = "miter";
    std::string _lineCap   = "butt";

    // Text styles
    std::string _font         = "10px sans-serif";
    std::string _textAlign    = "start";
    std::string _textBaseline = "alphabetic";

    // Fill and stroke styles
    std::string _fillStyle = "#000";

    std::string _strokeStyle = "#000";

    // Compositing
    std::string _globalCompositeOperation = "source-over";

private:
    ICanvasRenderingContext2D::Delegate *_delegate;

    CanvasBufferUpdatedCallback _canvasBufferUpdatedCB = nullptr;

    bool _isBufferSizeDirty = true;
};

} // namespace cc
