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

#include "base/Macros.h"
#include "base/Data.h"
#include "math/Geometry.h"

#include <string>

#ifndef OBJC_CLASS
    #ifdef __OBJC__
        #define OBJC_CLASS(name) @class name
    #else
        #define OBJC_CLASS(name) class name
    #endif
#endif // OBJC_CLASS

OBJC_CLASS(CanvasRenderingContext2DImpl);

namespace cc {

class CC_DLL CanvasGradient {
public:
    CanvasGradient();
    ~CanvasGradient(); // NOLINT(performance-trivially-destructible)
    void addColorStop(float offset, const std::string &color);
};

class CC_DLL CanvasRenderingContext2D {
public:
    CanvasRenderingContext2D(float width, float height);
    ~CanvasRenderingContext2D();

    // Rect
    void rect(float x, float y, float width, float height);
    void clearRect(float x, float y, float width, float height);
    void fillRect(float x, float y, float width, float height);

    void fillText(const std::string &text, float x, float y, float maxWidth = -1.0F);
    void strokeText(const std::string &text, float x, float y, float maxWidth = -1.0F);
    Size measureText(const std::string &text);
    CanvasGradient *createLinearGradient(float x0, float y0, float x1, float y1);
    void save();
    // Paths
    void beginPath();
    void closePath();
    void moveTo(float x, float y);
    void lineTo(float x, float y);
    void fill();
    void stroke();
    void restore();

    // callback
    using CanvasBufferUpdatedCallback = std::function<void(const cc::Data &)>;
    void setCanvasBufferUpdatedCallback(const CanvasBufferUpdatedCallback &cb);

    // functions for properties
    void setWidth(float width);
    void setHeight(float height);
    void setLineWidth(float lineWidth);
    void setLineJoin(const std::string &lineJoin);
    void setLineCap(const std::string &lineCap);
    void setFont(const std::string &font);
    void setTextAlign(const std::string &textAlign);
    void setTextBaseline(const std::string &textBaseline);
    void setFillStyle(const std::string &fillStyle);
    void setStrokeStyle(const std::string &strokeStyle);
    void setGlobalCompositeOperation(const std::string &globalCompositeOperation);

    // fill image data into Context2D
    void fillImageData(const Data &imageData, float imageWidth, float imageHeight, float offsetX, float offsetY);

    // transform
    void translate(float x, float y);
    void scale(float x, float y);
    void rotate(float angle);

    void transform(float a, float b, float c, float d, float e, float f);
    void setTransform(float a, float b, float c, float d, float e, float f);

private:
    void recreateBufferIfNeeded();

public:
    float _width = 0.0F;
    float _height = 0.0F;

    // Line styles
    float _lineWidth = 1.0F;
    std::string _lineJoin = "miter";
    std::string _lineCap = "butt";

    // Text styles
    std::string _font = "10px sans-serif";
    std::string _textAlign = "start";
    std::string _textBaseline = "alphabetic";

    // Fill and stroke styles
    std::string _fillStyle = "#000";
    
    std::string _strokeStyle = "#000";

    // Compositing
    std::string _globalCompositeOperation = "source-over";

private:
    CanvasBufferUpdatedCallback _canvasBufferUpdatedCB = nullptr;
    CanvasRenderingContext2DImpl *_impl = nullptr;

    bool _isBufferSizeDirty = true;
};

} // namespace cc
