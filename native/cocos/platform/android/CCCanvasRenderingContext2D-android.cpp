#include "platform/CCCanvasRenderingContext2D.h"
#include "base/ccTypes.h"
#include "base/csscolorparser.hpp"

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"


#include <regex>

enum class CanvasTextAlign {
    LEFT,
    CENTER,
    RIGHT
};

enum class CanvasTextBaseline {
    TOP,
    MIDDLE,
    BOTTOM
};

namespace {
    void fillRectWithColor(uint8_t* buf, uint32_t totalWidth, uint32_t totalHeight, uint32_t x, uint32_t y, uint32_t width, uint32_t height, uint8_t r, uint8_t g, uint8_t b)
    {
        assert(x + width <= totalWidth);
        assert(y + height <=  totalHeight);

        uint32_t y0 = totalHeight - (y + height);
        uint32_t y1 = totalHeight - y;
        uint8_t* p;
        for (uint32_t offsetY = y0; offsetY < y1; ++offsetY)
        {
            for (uint32_t offsetX = x; offsetX < (x + width); ++offsetX)
            {
                p = buf + (totalWidth * offsetY + offsetX) * 3;
                *p++ = r;
                *p++ = g;
                *p++ = b;
            }
        }
    }
}

NS_CC_BEGIN

CanvasGradient::CanvasGradient()
{
    SE_LOGD("CanvasGradient constructor: %p\n", this);
}

CanvasGradient::~CanvasGradient()
{
    SE_LOGD("CanvasGradient destructor: %p\n", this);
}

void CanvasGradient::addColorStop(float offset, const std::string& color)
{
    SE_LOGD("CanvasGradient::addColorStop: %p\n", this);
}

// CanvasRenderingContext2D

CanvasRenderingContext2D::CanvasRenderingContext2D(float width, float height)
: __width(width)
, __height(height)
{
    SE_LOGD("CanvasGradient constructor: %p, width: %f, height: %f\n", this, width, height);
    // _impl = [[CanvasRenderingContext2DImpl alloc] init];
}

CanvasRenderingContext2D::~CanvasRenderingContext2D()
{
    SE_LOGD("CanvasGradient destructor: %p\n", this);
    // [_impl release];
}

void CanvasRenderingContext2D::recreateBuffer()
{
    _isBufferSizeDirty = false;
    // [_impl recreateBufferWithWidth: __width height:__height];
}

void CanvasRenderingContext2D::clearRect(float x, float y, float width, float height)
{
    SE_LOGD("CanvasGradient::clearRect: %p, %f, %f, %f, %f\n", this, x, y, width, height);
    // [_impl clearRect:CGRectMake(x, y, width, height)];
}

void CanvasRenderingContext2D::fillRect(float x, float y, float width, float height)
{
    // [_impl fillRect:CGRectMake(x, y, width, height)];

    if (_canvasBufferUpdatedCB != nullptr)
    {
        // _canvasBufferUpdatedCB([_impl getDataRef]);
    }
}

void CanvasRenderingContext2D::fillText(const std::string& text, float x, float y, float maxWidth)
{
    SE_LOGD("CanvasRenderingContext2D::fillText: %s, %f, %f, %f\n", text.c_str(), x, y, maxWidth);
    if (text.empty())
        return;
    if (_isBufferSizeDirty)
        recreateBuffer();

    // [_impl fillText:[NSString stringWithUTF8String:text.c_str()] x:x y:y maxWidth:maxWidth];
    // if (_canvasBufferUpdatedCB != nullptr)
        // _canvasBufferUpdatedCB([_impl getDataRef]);
}

void CanvasRenderingContext2D::strokeText(const std::string& text, float x, float y, float maxWidth)
{
    SE_LOGD("CanvasRenderingContext2D::strokeText: %s, %f, %f, %f\n", text.c_str(), x, y, maxWidth);
    if (text.empty())
        return;
    if (_isBufferSizeDirty)
        recreateBuffer();

//    if (_canvasBufferUpdatedCB != nullptr)
//        _canvasBufferUpdatedCB([_impl getDataRef]);
}

cocos2d::Size CanvasRenderingContext2D::measureText(const std::string& text)
{
    SE_LOGD("CanvasRenderingContext2D::measureText: %s\n", text.c_str());
    // CGSize size = [_impl measureText: [NSString stringWithUTF8String:text.c_str()]];
    // return cocos2d::Size(size.width, size.height);
    return cocos2d::Size(100, 30);
}

CanvasGradient* CanvasRenderingContext2D::createLinearGradient(float x0, float y0, float x1, float y1)
{
    return nullptr;
}

void CanvasRenderingContext2D::save()
{

}

void CanvasRenderingContext2D::beginPath()
{

}

void CanvasRenderingContext2D::closePath()
{

}

void CanvasRenderingContext2D::moveTo(float x, float y)
{

}

void CanvasRenderingContext2D::lineTo(float x, float y)
{

}

void CanvasRenderingContext2D::stroke()
{

}

void CanvasRenderingContext2D::restore()
{

}

void CanvasRenderingContext2D::setCanvasBufferUpdatedCallback(const CanvasBufferUpdatedCallback& cb)
{
    _canvasBufferUpdatedCB = cb;
}

void CanvasRenderingContext2D::set__width(float width)
{
    SE_LOGD("CanvasRenderingContext2D::set__width: %f\n", width);
    __width = width;
    _isBufferSizeDirty = true;
    recreateBuffer();
}

void CanvasRenderingContext2D::set__height(float height)
{
    SE_LOGD("CanvasRenderingContext2D::set__height: %f\n", height);
    __height = height;
    _isBufferSizeDirty = true;
    recreateBuffer();
}

void CanvasRenderingContext2D::set_lineWidth(float lineWidth)
{

}

void CanvasRenderingContext2D::set_lineJoin(const std::string& lineJoin)
{

}

void CanvasRenderingContext2D::set_font(const std::string& font)
{
    if (_font != font)
    {
        _font = font;

        // TODO: cjh implements bold
        std::string bold;
        std::string fontName = "Arial";
        std::string fontSizeStr = "30";

        std::regex re("(bold)?\\s*(\\d+)px\\s+(\\w+)");
        std::match_results<std::string::const_iterator> results;
        if (std::regex_search(_font.cbegin(), _font.cend(), results, re))
        {
            bold = results[1].str();
            fontSizeStr = results[2].str();
            fontName = results[3].str();
        }

        // CGFloat fontSize = atof(fontSizeStr.c_str());
        // [_impl updateFontWithName:[NSString stringWithUTF8String:fontName.c_str()] fontSize:fontSize];
    }
}

void CanvasRenderingContext2D::set_textAlign(const std::string& textAlign)
{
    SE_LOGD("CanvasRenderingContext2D::set_textAlign: %s\n", textAlign.c_str());
    if (textAlign == "left")
    {
        // _impl.textAlign = CanvasTextAlign::LEFT;
    }
    else if (textAlign == "center")
    {
        // _impl.textAlign = CanvasTextAlign::CENTER;
    }
    else if (textAlign == "right")
    {
        // _impl.textAlign = CanvasTextAlign::RIGHT;
    }
    else
    {
        assert(false);
    }
}

void CanvasRenderingContext2D::set_textBaseline(const std::string& textBaseline)
{
    SE_LOGD("CanvasRenderingContext2D::set_textBaseline: %s\n", textBaseline.c_str());
    if (textBaseline == "top")
    {
        // _impl.textBaseLine = CanvasTextBaseline::TOP;
    }
    else if (textBaseline == "middle")
    {
        // _impl.textBaseLine = CanvasTextBaseline::MIDDLE;
    }
    else if (textBaseline == "bottom")
    {
        // _impl.textBaseLine = CanvasTextBaseline::BOTTOM;
    }
    else
    {
        assert(false);
    }
}

void CanvasRenderingContext2D::set_fillStyle(const std::string& fillStyle)
{
    CSSColorParser::Color color = CSSColorParser::parse(fillStyle);
    // [_impl setFillStyleWithRed:color.r/255.0f green:color.g/255.0f blue:color.b/255.0f alpha:color.a];
    SE_LOGD("CanvasRenderingContext2D::set_fillStyle: %s, (%d, %d, %d, %f)\n", fillStyle.c_str(), color.r, color.g, color.b, color.a);
}

void CanvasRenderingContext2D::set_strokeStyle(const std::string& strokeStyle)
{

}

void CanvasRenderingContext2D::set_globalCompositeOperation(const std::string& globalCompositeOperation)
{
    
}

NS_CC_END
