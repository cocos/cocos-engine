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

#include "platform/interfaces/modules/canvas/ICanvasRenderingContext2D.h"

#include "base/csscolorparser.h"
#include "bindings/jswrapper/config.h"
#include "math/Math.h"

#ifdef __OBJC__
@class CanvasRenderingContext2DDelegateImpl;
#else
class CanvasRenderingContext2DDelegateImpl;
#endif

namespace cc {

class CanvasRenderingContext2DDelegate : public ICanvasRenderingContext2D::Delegate {
public:
    using Size = std::array<float, 2>;
    CanvasRenderingContext2DDelegate();
    ~CanvasRenderingContext2DDelegate() override;

    void            recreateBuffer(float w, float h) override;
    void            beginPath() override;
    void            closePath() override;
    void            moveTo(float x, float y) override;
    void            lineTo(float x, float y) override;
    void            stroke() override;
    void            saveContext() override;
    void            restoreContext() override;
    void            clearRect(float /*x*/, float /*y*/, float w, float h) override;
    void            fill() override;
    void            setLineCap(const std::string &lineCap) override;
    void            setLineJoin(const std::string &lineJoin) override;
    void            rect(float x, float y, float w, float h) override;
    void            fillRect(float x, float y, float w, float h) override;
    void            fillText(const std::string &text, float x, float y, float /*maxWidth*/) override;
    void            strokeText(const std::string &text, float /*x*/, float /*y*/, float /*maxWidth*/) override;
    Size            measureText(const std::string &text) override;
    void            updateFont(const std::string &fontName, float fontSize, bool bold, bool italic, bool oblique, bool smallCaps) override;
    void            setTextAlign(CanvasTextAlign align) override;
    void            setTextBaseline(CanvasTextBaseline baseline) override;
    void            setFillStyle(float r, float g, float b, float a) override;
    void            setStrokeStyle(float r, float g, float b, float a) override;
    void            setLineWidth(float lineWidth) override;
    const cc::Data &getDataRef() const override;
    void            fillImageData(const Data &imageData, float imageWidth, float imageHeight, float offsetX, float offsetY) override;

private:
    void fillData();
    void unMultiplyAlpha(unsigned char *ptr, ssize_t size) const;

public:
private:
    CanvasRenderingContext2DDelegateImpl *_impl;
};

} // namespace cc
