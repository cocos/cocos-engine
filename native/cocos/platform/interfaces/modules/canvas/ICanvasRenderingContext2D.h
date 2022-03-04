/****************************************************************************
 Copyright (c) 2018-2022 Xiamen Yaji Software Co., Ltd.

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

#include "platform/interfaces/OSInterface.h"

#include "base/Data.h"
#include "math/Geometry.h"

#include <string>

enum class CanvasTextAlign {
    LEFT,
    CENTER,
    RIGHT
};

enum class CanvasTextBaseline {
    TOP,
    MIDDLE,
    BOTTOM,
    ALPHABETIC
};

namespace cc {

//class CanvasGradient {
//public:
//    CanvasGradient();
//    ~CanvasGradient(); // NOLINT(performance-trivially-destructible)
//    void addColorStop(float offset, const std::string &color);
//};

class ICanvasGradient {
public:
    ICanvasGradient()                                                 = default;
    virtual ~ICanvasGradient()                                        = default; // NOLINT(performance-trivially-destructible)
    virtual void addColorStop(float offset, const std::string &color) = 0;
};

class ICanvasRenderingContext2D : public OSInterface {
public:
    class Delegate {
    public:
        using Size                                                                                                                            = std::array<float, 2>;
        virtual ~Delegate()                                                                                                                   = default;
        virtual void            recreateBuffer(float w, float h)                                                                              = 0;
        virtual void            beginPath()                                                                                                   = 0;
        virtual void            closePath()                                                                                                   = 0;
        virtual void            moveTo(float x, float y)                                                                                      = 0;
        virtual void            lineTo(float x, float y)                                                                                      = 0;
        virtual void            stroke()                                                                                                      = 0;
        virtual void            saveContext()                                                                                                 = 0;
        virtual void            restoreContext()                                                                                              = 0;
        virtual void            clearRect(float /*x*/, float /*y*/, float w, float h)                                                         = 0;
        virtual void            fill()                                                                                                        = 0;
        virtual void            rect(float x, float y, float w, float h)                                                                      = 0;
        virtual void            setLineCap(const std::string &lineCap)                                                                        = 0;
        virtual void            setLineJoin(const std::string &lineCap)                                                                       = 0;
        virtual void            fillImageData(const Data &imageData, float imageWidth, float imageHeight, float offsetX, float offsetY)       = 0;
        virtual void            fillRect(float x, float y, float w, float h)                                                                  = 0;
        virtual void            fillText(const std::string &text, float x, float y, float /*maxWidth*/)                                       = 0;
        virtual void            strokeText(const std::string &text, float /*x*/, float /*y*/, float /*maxWidth*/)                             = 0;
        virtual Size            measureText(const std::string &text)                                                                          = 0;
        virtual void            updateFont(const std::string &fontName, float fontSize, bool bold, bool italic, bool oblique, bool smallCaps) = 0;
        virtual void            setTextAlign(CanvasTextAlign align)                                                                           = 0;
        virtual void            setTextBaseline(CanvasTextBaseline baseline)                                                                  = 0;
        virtual void            setFillStyle(float r, float g, float b, float a)                                                              = 0;
        virtual void            setStrokeStyle(float r, float g, float b, float a)                                                            = 0;
        virtual void            setLineWidth(float lineWidth)                                                                                 = 0;
        virtual const cc::Data &getDataRef() const                                                                                            = 0;
    };
    //static OSInterface::Ptr getInterface();
    // Rect
    virtual void rect(float x, float y, float width, float height)      = 0;
    virtual void clearRect(float x, float y, float width, float height) = 0;
    virtual void fillRect(float x, float y, float width, float height)  = 0;

    virtual void             fillText(const std::string &text, float x, float y, float maxWidth)   = 0;
    virtual void             strokeText(const std::string &text, float x, float y, float maxWidth) = 0;
    virtual Size             measureText(const std::string &text)                                  = 0;
    virtual ICanvasGradient *createLinearGradient(float x0, float y0, float x1, float y1)          = 0;
    virtual void             save()                                                                = 0;
    // Paths
    virtual void beginPath()              = 0;
    virtual void closePath()              = 0;
    virtual void moveTo(float x, float y) = 0;
    virtual void lineTo(float x, float y) = 0;
    virtual void fill()                   = 0;
    virtual void stroke()                 = 0;
    virtual void restore()                = 0;

    // callback
    using CanvasBufferUpdatedCallback                                                  = std::function<void(const cc::Data &)>;
    virtual void setCanvasBufferUpdatedCallback(const CanvasBufferUpdatedCallback &cb) = 0;

    // functions for properties
    virtual void setWidth(float width)                                                    = 0;
    virtual void setHeight(float height)                                                  = 0;
    virtual void setLineWidth(float lineWidth)                                            = 0;
    virtual void setLineJoin(const std::string &lineJoin)                                 = 0;
    virtual void setLineCap(const std::string &lineCap)                                   = 0;
    virtual void setFont(const std::string &font)                                         = 0;
    virtual void setTextAlign(const std::string &textAlign)                               = 0;
    virtual void setTextBaseline(const std::string &textBaseline)                         = 0;
    virtual void setFillStyle(const std::string &fillStyle)                               = 0;
    virtual void setStrokeStyle(const std::string &strokeStyle)                           = 0;
    virtual void setGlobalCompositeOperation(const std::string &globalCompositeOperation) = 0;

    // fill image data into Context2D
    virtual void fillImageData(const Data &imageData, float imageWidth, float imageHeight, float offsetX, float offsetY) = 0;

    // transform
    virtual void translate(float x, float y) = 0;
    virtual void scale(float x, float y)     = 0;
    virtual void rotate(float angle)         = 0;

    virtual void transform(float a, float b, float c, float d, float e, float f)    = 0;
    virtual void setTransform(float a, float b, float c, float d, float e, float f) = 0;

private:
    virtual void recreateBufferIfNeeded() = 0;
};

} // namespace cc
