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

#include "base/Data.h"
#include "base/std/container/array.h"
#include "base/std/container/string.h"
#include "math/Geometry.h"
#include "platform/interfaces/OSInterface.h"

namespace cc {

class CC_DLL ICanvasGradient {
public:
    ICanvasGradient() = default;
    virtual ~ICanvasGradient() = default; // NOLINT(performance-trivially-destructible)
    virtual void addColorStop(float offset, const ccstd::string &color) = 0;
};

class CC_DLL ICanvasRenderingContext2D : public OSInterface {
public:
    enum class TextAlign {
        LEFT,
        CENTER,
        RIGHT
    };

    enum class TextBaseline {
        TOP,
        MIDDLE,
        BOTTOM,
        ALPHABETIC
    };

    class Delegate {
    public:
        using Size = ccstd::array<float, 2>;
        virtual ~Delegate() = default;
        virtual void recreateBuffer(float w, float h) = 0;
        virtual void beginPath() = 0;
        virtual void closePath() = 0;
        virtual void moveTo(float x, float y) = 0;
        virtual void lineTo(float x, float y) = 0;
        virtual void stroke() = 0;
        virtual void saveContext() = 0;
        virtual void restoreContext() = 0;
        virtual void clearRect(float /*x*/, float /*y*/, float w, float h) = 0;
        virtual void fill() = 0;
        virtual void rect(float x, float y, float w, float h) = 0;
        virtual void setLineCap(const ccstd::string &lineCap) = 0;
        virtual void setLineJoin(const ccstd::string &lineCap) = 0;
        virtual void fillImageData(const Data &imageData, float imageWidth, float imageHeight, float offsetX, float offsetY) = 0;
        virtual void fillRect(float x, float y, float w, float h) = 0;
        virtual void fillText(const ccstd::string &text, float x, float y, float /*maxWidth*/) = 0;
        virtual void strokeText(const ccstd::string &text, float /*x*/, float /*y*/, float /*maxWidth*/) = 0;
        virtual Size measureText(const ccstd::string &text) = 0;
        virtual void updateFont(const ccstd::string &fontName, float fontSize, bool bold, bool italic, bool oblique, bool smallCaps) = 0;
        virtual void setTextAlign(TextAlign align) = 0;
        virtual void setTextBaseline(TextBaseline baseline) = 0;
        virtual void setFillStyle(uint8_t r, uint8_t g, uint8_t b, uint8_t a) = 0;
        virtual void setStrokeStyle(uint8_t r, uint8_t g, uint8_t b, uint8_t a) = 0;
        virtual void setLineWidth(float lineWidth) = 0;
        virtual void setShadowBlur(float blur) = 0;
        virtual void setShadowColor(uint8_t r, uint8_t g, uint8_t b, uint8_t a) = 0;
        virtual void setShadowOffsetX(float offsetX) = 0;
        virtual void setShadowOffsetY(float offsetY) = 0;
        virtual const cc::Data &getDataRef() const = 0;
        virtual void updateData() = 0;
    };
    //static OSInterface::Ptr getInterface();
    // Rect
    virtual void rect(float x, float y, float width, float height) = 0;
    virtual void clearRect(float x, float y, float width, float height) = 0;
    virtual void fillRect(float x, float y, float width, float height) = 0;

    virtual void fillText(const ccstd::string &text, float x, float y, float maxWidth) = 0;
    virtual void strokeText(const ccstd::string &text, float x, float y, float maxWidth) = 0;
    virtual Size measureText(const ccstd::string &text) = 0;
    virtual ICanvasGradient *createLinearGradient(float x0, float y0, float x1, float y1) = 0;
    virtual void save() = 0;
    // Paths
    virtual void beginPath() = 0;
    virtual void closePath() = 0;
    virtual void moveTo(float x, float y) = 0;
    virtual void lineTo(float x, float y) = 0;
    virtual void fill() = 0;
    virtual void stroke() = 0;
    virtual void restore() = 0;

    // callback
    using CanvasBufferUpdatedCallback = std::function<void(const cc::Data &)>;
    virtual void setCanvasBufferUpdatedCallback(const CanvasBufferUpdatedCallback &cb) = 0;

    // functions for properties
    virtual void setWidth(float width) = 0;
    virtual void setHeight(float height) = 0;
    virtual void setLineWidth(float lineWidth) = 0;
    virtual void setLineJoin(const ccstd::string &lineJoin) = 0;
    virtual void setLineCap(const ccstd::string &lineCap) = 0;
    virtual void setFont(const ccstd::string &font) = 0;
    virtual void setTextAlign(const ccstd::string &textAlign) = 0;
    virtual void setTextBaseline(const ccstd::string &textBaseline) = 0;
    virtual void setFillStyle(const ccstd::string &fillStyle) = 0;
    virtual void setStrokeStyle(const ccstd::string &strokeStyle) = 0;
    virtual void setGlobalCompositeOperation(const ccstd::string &globalCompositeOperation) = 0;
    virtual void setShadowBlur(float blur) = 0;
    virtual void setShadowColor(const ccstd::string &shadowColor) = 0;
    virtual void setShadowOffsetX(float offsetX) = 0;
    virtual void setShadowOffsetY(float offsetY) = 0;

    // fill image data into Context2D
    virtual void fillImageData(const Data &imageData, float imageWidth, float imageHeight, float offsetX, float offsetY) = 0;

    // transform
    virtual void translate(float x, float y) = 0;
    virtual void scale(float x, float y) = 0;
    virtual void rotate(float angle) = 0;

    virtual void transform(float a, float b, float c, float d, float e, float f) = 0;
    virtual void setTransform(float a, float b, float c, float d, float e, float f) = 0;

    virtual void fetchData() = 0;

private:
    virtual void recreateBufferIfNeeded() = 0;
};

} // namespace cc
