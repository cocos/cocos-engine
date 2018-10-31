#include "platform/CCCanvasRenderingContext2D.h"
#include "base/ccTypes.h"
#include "base/csscolorparser.hpp"

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "platform/android/jni/JniHelper.h"

#include <regex>

#ifndef JCLS_CANVASIMPL
#define JCLS_CANVASIMPL  "org/cocos2dx/lib/CanvasRenderingContext2DImpl"
#endif

using namespace cocos2d;

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

class CanvasRenderingContext2DImpl
{
public:
    CanvasRenderingContext2DImpl()
    {
        jobject obj = JniHelper::newObject(JCLS_CANVASIMPL);
        _obj = JniHelper::getEnv()->NewGlobalRef(obj);
        JniHelper::getEnv()->DeleteLocalRef(obj);
    }

    ~CanvasRenderingContext2DImpl()
    {
        JniHelper::getEnv()->DeleteGlobalRef(_obj);
    }

    void recreateBuffer(float w, float h)
    {
        _bufferWidth = w;
        _bufferHeight = h;
        if (_bufferWidth < 1.0f || _bufferHeight < 1.0f)
            return;
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "recreateBuffer", w, h);
        fillData();
    }

    void beginPath()
    {
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "beginPath");
    }

    void closePath()
    {
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "closePath");
    }

    void moveTo(float x, float y)
    {
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "moveTo", x, y);
    }

    void lineTo(float x, float y)
    {
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "lineTo", x, y);
    }

    void stroke()
    {
        if (_bufferWidth < 1.0f || _bufferHeight < 1.0f)
            return;

        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "stroke");
        fillData();
    }

    void fill()
    {
        if (_bufferWidth < 1.0f || _bufferHeight < 1.0f)
            return;

        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "fill");
        fillData();
    }

    void saveContext()
    {
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "saveContext");
    }

    void restoreContext()
    {
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "restoreContext");
    }

    void rect(float x, float y, float w, float h)
    {
        if (_bufferWidth < 1.0f || _bufferHeight < 1.0f)
            return;
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "rect", x, y, w, h);
        fillData();
    }

    void clearRect(float x, float y, float w, float h)
    {
        if (_bufferWidth < 1.0f || _bufferHeight < 1.0f)
            return;
        if (x >= _bufferWidth || y >= _bufferHeight)
            return;
        if (x + w > _bufferWidth)
            w = _bufferWidth - x;
        if (y + h > _bufferHeight)
            h = _bufferHeight - y;
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "clearRect", x, y, w, h);
        fillData();
    }

    void fillRect(float x, float y, float w, float h)
    {
        if (_bufferWidth < 1.0f || _bufferHeight < 1.0f)
            return;
        if (x >= _bufferWidth || y >= _bufferHeight)
            return;
        if (x + w > _bufferWidth)
            w = _bufferWidth - x;
        if (y + h > _bufferHeight)
            h = _bufferHeight - y;
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "fillRect", x, y, w, h);
        fillData();
    }

    void fillText(const std::string& text, float x, float y, float maxWidth)
    {
        if (text.empty() || _bufferWidth < 1.0f || _bufferHeight < 1.0f)
            return;
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "fillText", text, x, y, maxWidth);
        fillData();
    }

    void strokeText(const std::string& text, float x, float y, float maxWidth)
    {
        if (text.empty() || _bufferWidth < 1.0f || _bufferHeight < 1.0f)
            return;
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "strokeText", text, x, y, maxWidth);
        fillData();
    }

    float measureText(const std::string& text)
    {
        if (text.empty())
            return 0.0f;
        return JniHelper::callObjectFloatMethod(_obj, JCLS_CANVASIMPL, "measureText", text);
    }

    void updateFont(const std::string& fontName, float fontSize, bool bold, bool italic, bool oblique, bool smallCaps)
    {
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "updateFont", fontName, fontSize, bold, italic, oblique, smallCaps);
    }

    void setLineCap(const std::string& lineCap) {
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setLineCap", lineCap);
    }

    void setLineJoin(const std::string& lineJoin) {
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setLineJoin", lineJoin);
    }

    void setTextAlign(CanvasTextAlign align)
    {
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setTextAlign", (int)align);
    }

    void setTextBaseline(CanvasTextBaseline baseline)
    {
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setTextBaseline", (int)baseline);
    }

    void setFillStyle(float r, float g, float b, float a)
    {
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setFillStyle", r, g, b, a);
    }

    void setStrokeStyle(float r, float g, float b, float a)
    {
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setStrokeStyle", r, g, b, a);
    }

    void setLineWidth(float lineWidth)
    {
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "setLineWidth", lineWidth);
    }

    void _fillImageData(const Data &imageData, float imageWidth, float imageHeight, float offsetX, float offsetY) {
        if (_bufferWidth < 1.0f || _bufferHeight < 1.0f)
            return;

        jbyteArray arr = JniHelper::getEnv()->NewByteArray(imageData.getSize());
        JniHelper::getEnv()->SetByteArrayRegion(arr, 0, imageData.getSize(),
                                                (const jbyte *) imageData.getBytes());
        JniHelper::callObjectVoidMethod(_obj, JCLS_CANVASIMPL, "_fillImageData", arr, imageWidth,
                                        imageHeight, offsetX, offsetY);
        JniHelper::getEnv()->DeleteLocalRef(arr);

        fillData();
    }

    const Data& getDataRef() const
    {
        return _data;
    }

    void fillData()
    {
        jbyteArray arr = JniHelper::callObjectByteArrayMethod(_obj, JCLS_CANVASIMPL, "getDataRef");
        jsize len  = JniHelper::getEnv()->GetArrayLength(arr);
        jbyte* jbarray = (jbyte *)malloc(len * sizeof(jbyte));
        JniHelper::getEnv()->GetByteArrayRegion(arr,0,len,jbarray);
        _data.fastSet((unsigned char*) jbarray, len); //IDEA: DON'T create new jbarray every time.
        JniHelper::getEnv()->DeleteLocalRef(arr);
    }

private:
    jobject _obj = nullptr;
    Data _data;
    float _bufferWidth = 0.0f;
    float _bufferHeight = 0.0f;
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
    // SE_LOGD("CanvasGradient constructor: %p\n", this);
}

CanvasGradient::~CanvasGradient()
{
    // SE_LOGD("CanvasGradient destructor: %p\n", this);
}

void CanvasGradient::addColorStop(float offset, const std::string& color)
{
    // SE_LOGD("CanvasGradient::addColorStop: %p\n", this);
}

// CanvasRenderingContext2D

CanvasRenderingContext2D::CanvasRenderingContext2D(float width, float height)
: __width(width)
, __height(height)
{
    // SE_LOGD("CanvasRenderingContext2D constructor: %p, width: %f, height: %f\n", this, width, height);
    _impl = new CanvasRenderingContext2DImpl();
    recreateBufferIfNeeded();
}

CanvasRenderingContext2D::~CanvasRenderingContext2D()
{
    // SE_LOGD("CanvasRenderingContext2D destructor: %p\n", this);
    delete _impl;
}

void CanvasRenderingContext2D::recreateBufferIfNeeded()
{
    if (_isBufferSizeDirty)
    {
        _isBufferSizeDirty = false;
//        SE_LOGD("Recreate buffer %p, w: %f, h:%f\n", this, __width, __height);
        _impl->recreateBuffer(__width, __height);
        if (_canvasBufferUpdatedCB != nullptr)
            _canvasBufferUpdatedCB(_impl->getDataRef());
    }
}

void CanvasRenderingContext2D::rect(float x, float y, float width, float height)
{
//    SE_LOGD("CanvasRenderingContext2D::rect: %p, %f, %f, %f, %f\n", this, x, y, width, height);
    recreateBufferIfNeeded();
    _impl->rect(x, y, width, height);
}

void CanvasRenderingContext2D::clearRect(float x, float y, float width, float height)
{
//    SE_LOGD("CanvasRenderingContext2D::clearRect: %p, %f, %f, %f, %f\n", this, x, y, width, height);
    recreateBufferIfNeeded();
    _impl->clearRect(x, y, width, height);
}

void CanvasRenderingContext2D::fillRect(float x, float y, float width, float height)
{
    recreateBufferIfNeeded();
    _impl->fillRect(x, y, width, height);

    if (_canvasBufferUpdatedCB != nullptr)
        _canvasBufferUpdatedCB(_impl->getDataRef());
}

void CanvasRenderingContext2D::fillText(const std::string& text, float x, float y, float maxWidth)
{
//    SE_LOGD("CanvasRenderingContext2D::fillText: %s, %f, %f, %f\n", text.c_str(), x, y, maxWidth);
    if (text.empty())
        return;
    recreateBufferIfNeeded();

    _impl->fillText(text, x, y, maxWidth);
    if (_canvasBufferUpdatedCB != nullptr)
        _canvasBufferUpdatedCB(_impl->getDataRef());
}

void CanvasRenderingContext2D::strokeText(const std::string& text, float x, float y, float maxWidth)
{
//    SE_LOGD("CanvasRenderingContext2D::strokeText: %s, %f, %f, %f\n", text.c_str(), x, y, maxWidth);
    if (text.empty())
        return;
    recreateBufferIfNeeded();

    _impl->strokeText(text, x, y, maxWidth);

   if (_canvasBufferUpdatedCB != nullptr)
       _canvasBufferUpdatedCB(_impl->getDataRef());
}

cocos2d::Size CanvasRenderingContext2D::measureText(const std::string& text)
{
//    SE_LOGD("CanvasRenderingContext2D::measureText: %s\n", text.c_str());
    return cocos2d::Size(_impl->measureText(text), 0);
}

CanvasGradient* CanvasRenderingContext2D::createLinearGradient(float x0, float y0, float x1, float y1)
{
    return nullptr;
}

void CanvasRenderingContext2D::save()
{
    _impl->saveContext();
}

void CanvasRenderingContext2D::beginPath()
{
    _impl->beginPath();
}

void CanvasRenderingContext2D::closePath()
{
    _impl->closePath();
}

void CanvasRenderingContext2D::moveTo(float x, float y)
{
    _impl->moveTo(x, y);
}

void CanvasRenderingContext2D::lineTo(float x, float y)
{
    _impl->lineTo(x, y);
}

void CanvasRenderingContext2D::stroke()
{
    _impl->stroke();

    if (_canvasBufferUpdatedCB != nullptr)
        _canvasBufferUpdatedCB(_impl->getDataRef());
}

void CanvasRenderingContext2D::fill()
{
    _impl->fill();

    if (_canvasBufferUpdatedCB != nullptr)
        _canvasBufferUpdatedCB(_impl->getDataRef());
}

void CanvasRenderingContext2D::restore()
{
    _impl->restoreContext();
}

void CanvasRenderingContext2D::setCanvasBufferUpdatedCallback(const CanvasBufferUpdatedCallback& cb)
{
    _canvasBufferUpdatedCB = cb;
}

void CanvasRenderingContext2D::set__width(float width)
{
//    SE_LOGD("CanvasRenderingContext2D::set__width: %f\n", width);
    __width = width;
    _isBufferSizeDirty = true;
    recreateBufferIfNeeded();
}

void CanvasRenderingContext2D::set__height(float height)
{
//    SE_LOGD("CanvasRenderingContext2D::set__height: %f\n", height);
    __height = height;
    _isBufferSizeDirty = true;
    recreateBufferIfNeeded();
}

void CanvasRenderingContext2D::set_lineWidth(float lineWidth)
{
    _lineWidth = lineWidth;
    _impl->setLineWidth(lineWidth);
}

void CanvasRenderingContext2D::set_lineJoin(const std::string& lineJoin)
{
    if(lineJoin.empty()) return ;
    _impl->setLineJoin(lineJoin);
}

void CanvasRenderingContext2D::set_lineCap(const std::string& lineCap)
{
    if(lineCap.empty()) return ;
    _impl->setLineCap(lineCap);
}

/*
 * support format e.g.: "oblique bold small-caps 18px Arial"
 *                      "italic bold small-caps 25px Arial"
 *                      "italic 25px Arial"
 * */
void CanvasRenderingContext2D::set_font(const std::string& font)
{
    if (_font != font)
    {
        _font = font;
        std::string fontName = "sans-serif";
        std::string fontSizeStr = "30";
        std::regex re("\\s*((\\d+)([\\.]\\d+)?)px\\s+([^\\r\\n]*)");
        std::match_results<std::string::const_iterator> results;
        if (std::regex_search(_font.cbegin(), _font.cend(), results, re))
        {
            fontSizeStr = results[2].str();
            // support get font name from `60px American` or `60px "American abc-abc_abc"`
            // support get font name contain space,example `times new roman`
            // if regex rule that does not conform to the rules,such as Chinese,it defaults to sans-serif
            std::match_results<std::string::const_iterator> fontResults;
            std::regex fontRe("([\\w\\s-]+|\"[\\w\\s-]+\"$)");
            if(std::regex_match(results[4].str(), fontResults, fontRe))
            {
                fontName = results[4].str();
            }
        }

        float fontSize = atof(fontSizeStr.c_str());
        bool isBold = font.find("bold", 0) != std::string::npos;
        bool isItalic = font.find("italic", 0) != std::string::npos;
        bool isSmallCaps = font.find("small-caps", 0) != std::string::npos;
        bool isOblique = font.find("oblique", 0) != std::string::npos;
        //font-style: italic, oblique, normal
        //font-weight: normal, bold
        //font-variant: normal, small-caps
        _impl->updateFont(fontName, fontSize, isBold, isItalic, isOblique, isSmallCaps);

    }
}

void CanvasRenderingContext2D::set_textAlign(const std::string& textAlign)
{
    // SE_LOGD("CanvasRenderingContext2D::set_textAlign: %s\n", textAlign.c_str());
    if (textAlign == "left")
    {
        _impl->setTextAlign(CanvasTextAlign::LEFT);
    }
    else if (textAlign == "center" || textAlign == "middle")
    {
        _impl->setTextAlign(CanvasTextAlign::CENTER);
    }
    else if (textAlign == "right")
    {
        _impl->setTextAlign(CanvasTextAlign::RIGHT);
    }
    else
    {
        assert(false);
    }
}

void CanvasRenderingContext2D::set_textBaseline(const std::string& textBaseline)
{
    // SE_LOGD("CanvasRenderingContext2D::set_textBaseline: %s\n", textBaseline.c_str());
    if (textBaseline == "top")
    {
        _impl->setTextBaseline(CanvasTextBaseline::TOP);
    }
    else if (textBaseline == "middle")
    {
        _impl->setTextBaseline(CanvasTextBaseline::MIDDLE);
    }
    else if (textBaseline == "bottom" || textBaseline == "alphabetic") //REFINE:, how to deal with alphabetic, currently we handle it as bottom mode.
    {
        _impl->setTextBaseline(CanvasTextBaseline::BOTTOM);
    }
    else
    {
        assert(false);
    }
}

void CanvasRenderingContext2D::set_fillStyle(const std::string& fillStyle)
{
    CSSColorParser::Color color = CSSColorParser::parse(fillStyle);
    _impl->setFillStyle(color.r/255.0f, color.g/255.0f, color.b/255.0f, color.a);
    // SE_LOGD("CanvasRenderingContext2D::set_fillStyle: %s, (%d, %d, %d, %f)\n", fillStyle.c_str(), color.r, color.g, color.b, color.a);
}

void CanvasRenderingContext2D::set_strokeStyle(const std::string& strokeStyle)
{
    CSSColorParser::Color color = CSSColorParser::parse(strokeStyle);
    _impl->setStrokeStyle(color.r/255.0f, color.g/255.0f, color.b/255.0f, color.a);
}

void CanvasRenderingContext2D::set_globalCompositeOperation(const std::string& globalCompositeOperation)
{
    // SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::_fillImageData(const Data& imageData, float imageWidth, float imageHeight, float offsetX, float offsetY)
{
    _impl->_fillImageData(imageData, imageWidth, imageHeight, offsetX, offsetY);
    if (_canvasBufferUpdatedCB != nullptr)
        _canvasBufferUpdatedCB(_impl->getDataRef());
}
// transform
//REFINE:

void CanvasRenderingContext2D::translate(float x, float y)
{
    // SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::scale(float x, float y)
{
    // SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::rotate(float angle)
{
    // SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::transform(float a, float b, float c, float d, float e, float f)
{
    // SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::setTransform(float a, float b, float c, float d, float e, float f)
{
    // SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

NS_CC_END
