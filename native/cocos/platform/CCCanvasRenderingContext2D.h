/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

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

#include "platform/CCPlatformMacros.h"
#include "math/CCGeometry.h"
#include "base/CCData.h"

#include <string>

#ifndef OBJC_CLASS
#ifdef __OBJC__
#define OBJC_CLASS(name) @class name
#else
#define OBJC_CLASS(name) class name
#endif
#endif // OBJC_CLASS

OBJC_CLASS(CanvasRenderingContext2DImpl);

NS_CC_BEGIN

class CC_DLL CanvasGradient
{
public:
    CanvasGradient();
    ~CanvasGradient();
    void addColorStop(float offset, const std::string& color);
};

class CC_DLL CanvasRenderingContext2D
{
public:
    CanvasRenderingContext2D(float width, float height);
    ~CanvasRenderingContext2D();

    void clearRect(float x, float y, float width, float height);
//    Data getImageData(float sx, float sy, float sw, float sh);
    void fillText(const std::string& text, float x, float y, float maxWidth = -1.0f);
    void strokeText(const std::string& text, float x, float y, float maxWidth = -1.0f);
    Size measureText(const std::string& text);
    CanvasGradient* createLinearGradient(float x0, float y0, float x1, float y1);
    void save();
    // Paths
    void beginPath();
    void closePath();
    void moveTo(float x, float y);
    void lineTo(float x, float y);
    void stroke();
    void restore();

    // callback
    using CanvasBufferUpdatedCallback = std::function<void(const Data&)>;
    void setCanvasBufferUpdatedCallback(const CanvasBufferUpdatedCallback& cb);

    // functions for properties
    void set__width(float width);
    void set__height(float height);
    void set_lineWidth(float lineWidth);
    void set_lineJoin(const std::string& lineJoin);
    void set_font(const std::string& font);
    void set_textAlign(const std::string& textAlign);
    void set_textBaseline(const std::string& textBaseline);
    void set_fillStyle(const std::string& fillStyle);
    void set_strokeStyle(const std::string& strokeStyle);
    void set_globalCompositeOperation(const std::string& globalCompositeOperation);

private:
    void recreateBuffer();

public:

    float __width = 0.0f;
    float __height = 0.0f;

    // Line styles
    float _lineWidth = 1.0f;
    std::string _lineJoin = "miter";

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
    CanvasRenderingContext2DImpl* _impl = nullptr;

    bool _isBufferSizeDirty = true;
};

NS_CC_END
