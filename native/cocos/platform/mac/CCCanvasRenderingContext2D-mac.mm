#include "platform/CCCanvasRenderingContext2D.h"
#include "base/ccTypes.h"
#include "base/csscolorparser.hpp"

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_platform.h"

#import <Foundation/Foundation.h>
#import <Cocoa/Cocoa.h>

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

@interface CanvasRenderingContext2DImpl : NSObject {
    NSFont* _font;
    NSMutableDictionary* _tokenAttributesDict;
    NSString* _fontName;
    CGFloat _fontSize;
    NSImage* _image;
    cocos2d::Data _imageData;
    CanvasTextAlign _textAlign;
    CanvasTextBaseline _textBaseLine;
    cocos2d::Color4F _fillStyle;
}

@property (nonatomic, strong) NSFont* font;
@property (nonatomic, strong) NSMutableDictionary* tokenAttributesDict;
@property (nonatomic, strong) NSString* fontName;
@property (nonatomic, strong) NSImage* image;
@property (nonatomic, assign) CanvasTextAlign textAlign;
@property (nonatomic, assign) CanvasTextBaseline textBaseLine;

@end

@implementation CanvasRenderingContext2DImpl

@synthesize font = _font;
@synthesize tokenAttributesDict = _tokenAttributesDict;
@synthesize fontName = _fontName;
@synthesize image = _image;
@synthesize textAlign = _textAlign;
@synthesize textBaseLine = _textBaseLine;

-(id) init {
    if (self = [super init]) {
        _textAlign = CanvasTextAlign::LEFT;
        _textBaseLine = CanvasTextBaseline::BOTTOM;
        [self updateFontWithName:@"Arial" fontSize:30];
    }

    return self;
}

-(void) dealloc {
    self.font = nil;
    self.tokenAttributesDict = nil;
    self.fontName = nil;
    self.image = nil;

    [super dealloc];
}

-(NSFont*) _createSystemFont {
    NSFontTraitMask mask = NSUnboldFontMask | NSUnitalicFontMask;
    NSFont* font = [[NSFontManager sharedFontManager]
                    fontWithFamily:_fontName
                    traits:mask
                    weight:0
                    size:_fontSize];

    if (font == nil) {
        const auto& familyMap = getFontFamilyNameMap();
        auto iter = familyMap.find([_fontName UTF8String]);
        if (iter != familyMap.end()) {
            font = [[NSFontManager sharedFontManager]
               fontWithFamily: [NSString stringWithUTF8String:iter->second.c_str()]
               traits: mask
               weight: 0
               size: _fontSize];
        }
    }

    if (font == nil) {
        font = [[NSFontManager sharedFontManager]
                fontWithFamily: @"Arial"
                traits: mask
                weight: 0
                size: _fontSize];
    }
    return font;
}

-(void) updateFontWithName: (NSString*)fontName fontSize: (CGFloat)fontSize {
    self.fontName = fontName;
    _fontSize = fontSize;
    self.font = [self _createSystemFont];

    NSMutableParagraphStyle* paragraphStyle = [[[NSMutableParagraphStyle alloc] init] autorelease];
    paragraphStyle.lineBreakMode = NSLineBreakByTruncatingTail;
    [paragraphStyle setAlignment:NSTextAlignmentCenter];

    // color
    NSColor* foregroundColor = [NSColor colorWithRed:1.0f
                                               green:1.0f
                                                blue:1.0f
                                               alpha:1.0f];

    // attribute
    self.tokenAttributesDict = [NSMutableDictionary dictionaryWithObjectsAndKeys:
                                                foregroundColor, NSForegroundColorAttributeName,
                                                _font, NSFontAttributeName,
                                                paragraphStyle, NSParagraphStyleAttributeName, nil];
}

-(void) recreateBufferWithWidth:(NSInteger) width height:(NSInteger) height {
    self.image = [[[NSImage alloc] initWithSize:NSMakeSize(width, height)] autorelease];
    [self clear];
}

-(NSSize) measureText:(NSString*) text {

    NSAttributedString* stringWithAttributes = [[[NSAttributedString alloc] initWithString:text
                                                             attributes:_tokenAttributesDict] autorelease];

    NSSize textRect = NSZeroSize;
    textRect.width = CGFLOAT_MAX;
    textRect.height = CGFLOAT_MAX;

    NSSize dim;
#ifdef __MAC_10_11
#if __MAC_OS_X_VERSION_MAX_ALLOWED >= __MAC_10_11
    dim = [stringWithAttributes boundingRectWithSize:textRect options:(NSStringDrawingOptions)(NSStringDrawingUsesLineFragmentOrigin) context:nil].size;
#else
    dim = [stringWithAttributes boundingRectWithSize:textRect options:(NSStringDrawingOptions)(NSStringDrawingUsesLineFragmentOrigin)].size;
#endif
#else
    dim = [stringWithAttributes boundingRectWithSize:textRect options:(NSStringDrawingOptions)(NSStringDrawingUsesLineFragmentOrigin)].size;
#endif


    dim.width = ceilf(dim.width);
    dim.height = ceilf(dim.height);

    return dim;
}

-(NSPoint) convertDrawPoint:(NSPoint) point text:(NSString*) text {
    NSSize textSize = [self measureText:text];
//    NSLog(@"textSize: %f, %f", textSize.width, textSize.height);

    if (_textAlign == CanvasTextAlign::CENTER)
    {
        point.x -= textSize.width / 2;
    }
    else if (_textAlign == CanvasTextAlign::RIGHT)
    {
        point.x -= textSize.width;
    }

    if (_textBaseLine == CanvasTextBaseline::TOP)
    {
        point.y += textSize.height;
    }
    else if (_textBaseLine == CanvasTextBaseline::MIDDLE)
    {
        point.y += textSize.height / 2;
    }

    return point;
}

-(void) fillText:(NSString*) text x:(CGFloat) x y:(CGFloat) y maxWidth:(CGFloat) maxWidth {

    if (text.length == 0)
        return;

    NSPoint drawPoint = [self convertDrawPoint:NSMakePoint(x, y) text:text];

    NSMutableParagraphStyle* paragraphStyle = [[[NSMutableParagraphStyle alloc] init] autorelease];
    paragraphStyle.lineBreakMode = NSLineBreakByTruncatingTail;

    [_tokenAttributesDict setObject:paragraphStyle forKey:NSParagraphStyleAttributeName];
    [_tokenAttributesDict setObject:[NSColor colorWithRed:_fillStyle.r green:_fillStyle.g blue:_fillStyle.b alpha:_fillStyle.a]
                             forKey:NSForegroundColorAttributeName];

    [[NSGraphicsContext currentContext] setShouldAntialias:NO];

    [_image lockFocus];
    // patch for mac retina display and lableTTF
    [[NSAffineTransform transform] set];
    NSAttributedString *stringWithAttributes =[[[NSAttributedString alloc] initWithString:text
                                                                               attributes:_tokenAttributesDict] autorelease];

    drawPoint.y = _image.size.height - drawPoint.y;
    [stringWithAttributes drawAtPoint:drawPoint];

    NSBitmapImageRep *bitmap = [[NSBitmapImageRep alloc] initWithFocusedViewRect:NSMakeRect (0.0f, 0.0f, _image.size.width, _image.size.height)];
    [_image unlockFocus];

    unsigned char* data = [bitmap bitmapData];  //Use the same buffer to improve the performance.

    NSUInteger textureSize = _image.size.width * _image.size.height * 4;

    // For text debugging ...
//    for (int i = 0; i < textureSize; i += 4) {
//        if (data[i+3] == 0)
//        {
//            data[i+3] = 255;
//        }
//    }
    //

    uint8_t* buffer = (uint8_t*)malloc(sizeof(uint8_t) * textureSize);
    if (buffer) {
        memcpy(buffer, data, textureSize);
        _imageData.fastSet(buffer, textureSize);
    }
    [bitmap release];
}

-(void) setFillStyleWithRed:(CGFloat) r green:(CGFloat) g blue:(CGFloat) b alpha:(CGFloat) a {
    _fillStyle.r = r;
    _fillStyle.g = g;
    _fillStyle.b = b;
    _fillStyle.a = a;
}

-(const cocos2d::Data&) getDataRef {
    return _imageData;
}

-(void) clearRect:(CGRect) rect {
    if (_image == nil)
        return;

    rect.origin.x = floor(rect.origin.x);
    rect.origin.y = floor(rect.origin.y);
    rect.size.width = floor(rect.size.width);
    rect.size.height = floor(rect.size.height);

    if (rect.origin.x < 0) rect.origin.x = 0;
    if (rect.origin.y < 0) rect.origin.y = 0;

    if (rect.size.width < 1 || rect.size.height < 1)
        return;
    //TODO:
    assert(rect.origin.x == 0 && rect.origin.y == 0);
//    NSLog(@"clearRect, image:%f, %f", _image.size.width, _image.size.height);
    assert(rect.size.width <= _image.size.width && rect.size.height <= _image.size.height);

    [_image lockFocus];
    [[NSColor clearColor] set];
    NSRectFill(rect);
    [_image unlockFocus];
}

-(void) fillRect:(CGRect) rect {
    NSUInteger textureSize = _image.size.width * _image.size.height * 4;
    uint8_t* buffer = nullptr;
    if (_imageData.isNull())
    {
        buffer = (uint8_t*)malloc(sizeof(uint8_t) * textureSize);
        _imageData.fastSet(buffer, textureSize);
    }

    if (buffer)
    {
        uint8_t r = _fillStyle.r * 255.0f;
        uint8_t g = _fillStyle.g * 255.0f;
        uint8_t b = _fillStyle.b * 255.0f;
        fillRectWithColor(buffer, (uint32_t)_image.size.width, (uint32_t)_image.size.height, (uint32_t)rect.origin.x, (uint32_t)rect.origin.y, (uint32_t)rect.size.width, (uint32_t)rect.size.height, r, g, b);
    }
}

-(void) clear {
    NSUInteger textureSize = _image.size.width * _image.size.height * 4;
    uint8_t* buffer = nullptr;
    buffer = (uint8_t*)malloc(sizeof(uint8_t) * textureSize);
    if (buffer)
    {
        memset(buffer, 0x00, textureSize);
        _imageData.fastSet(buffer, textureSize);
    }
}

@end

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
    _impl = [[CanvasRenderingContext2DImpl alloc] init];
    [_impl recreateBufferWithWidth:width height:height];
}

CanvasRenderingContext2D::~CanvasRenderingContext2D()
{
    SE_LOGD("CanvasRenderingContext2D destructor: %p\n", this);
    [_impl release];
}

void CanvasRenderingContext2D::recreateBuffer()
{
    _isBufferSizeDirty = false;
    [_impl recreateBufferWithWidth: __width height:__height];
    if (_canvasBufferUpdatedCB != nullptr)
        _canvasBufferUpdatedCB([_impl getDataRef]);
}

void CanvasRenderingContext2D::clearRect(float x, float y, float width, float height)
{
//    SE_LOGD("CanvasGradient::clearRect: %p, %f, %f, %f, %f\n", this, x, y, width, height);
    [_impl clearRect:CGRectMake(x, y, width, height)];
}

void CanvasRenderingContext2D::fillRect(float x, float y, float width, float height)
{
    [_impl fillRect:CGRectMake(x, y, width, height)];

    if (_canvasBufferUpdatedCB != nullptr)
    {
        _canvasBufferUpdatedCB([_impl getDataRef]);
    }
}

void CanvasRenderingContext2D::fillText(const std::string& text, float x, float y, float maxWidth)
{
//    SE_LOGD("CanvasRenderingContext2D::fillText: %s, %f, %f, %f\n", text.c_str(), x, y, maxWidth);
    if (text.empty())
        return;
    if (_isBufferSizeDirty)
        recreateBuffer();

    [_impl fillText:[NSString stringWithUTF8String:text.c_str()] x:x y:y maxWidth:maxWidth];
    if (_canvasBufferUpdatedCB != nullptr)
        _canvasBufferUpdatedCB([_impl getDataRef]);
}

void CanvasRenderingContext2D::strokeText(const std::string& text, float x, float y, float maxWidth)
{
//    SE_LOGD("CanvasRenderingContext2D::strokeText: %s, %f, %f, %f\n", text.c_str(), x, y, maxWidth);
    if (text.empty())
        return;
    if (_isBufferSizeDirty)
        recreateBuffer();

//    if (_canvasBufferUpdatedCB != nullptr)
//        _canvasBufferUpdatedCB([_impl getDataRef]);
}

cocos2d::Size CanvasRenderingContext2D::measureText(const std::string& text)
{
//    SE_LOGD("CanvasRenderingContext2D::measureText: %s\n", text.c_str());
    CGSize size = [_impl measureText: [NSString stringWithUTF8String:text.c_str()]];
    return cocos2d::Size(size.width, size.height);
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
//    SE_LOGD("CanvasRenderingContext2D::set__width: %f\n", width);
    __width = width;
    _isBufferSizeDirty = true;
    recreateBuffer();
}

void CanvasRenderingContext2D::set__height(float height)
{
//    SE_LOGD("CanvasRenderingContext2D::set__height: %f\n", height);
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

        CGFloat fontSize = atof(fontSizeStr.c_str());
        [_impl updateFontWithName:[NSString stringWithUTF8String:fontName.c_str()] fontSize:fontSize];
    }
}

void CanvasRenderingContext2D::set_textAlign(const std::string& textAlign)
{
//    SE_LOGD("CanvasRenderingContext2D::set_textAlign: %s\n", textAlign.c_str());
    if (textAlign == "left")
    {
        _impl.textAlign = CanvasTextAlign::LEFT;
    }
    else if (textAlign == "center" || textAlign == "middle")
    {
        _impl.textAlign = CanvasTextAlign::CENTER;
    }
    else if (textAlign == "right")
    {
        _impl.textAlign = CanvasTextAlign::RIGHT;
    }
    else
    {
        assert(false);
    }
}

void CanvasRenderingContext2D::set_textBaseline(const std::string& textBaseline)
{
//    SE_LOGD("CanvasRenderingContext2D::set_textBaseline: %s\n", textBaseline.c_str());
    if (textBaseline == "top")
    {
        _impl.textBaseLine = CanvasTextBaseline::TOP;
    }
    else if (textBaseline == "middle")
    {
        _impl.textBaseLine = CanvasTextBaseline::MIDDLE;
    }
    else if (textBaseline == "bottom" || textBaseline == "alphabetic") //TODO:cjh, how to deal with alphabetic, currently we handle it as bottom mode.
    {
        _impl.textBaseLine = CanvasTextBaseline::BOTTOM;
    }
    else
    {
        assert(false);
    }
}

void CanvasRenderingContext2D::set_fillStyle(const std::string& fillStyle)
{
    CSSColorParser::Color color = CSSColorParser::parse(fillStyle);
    [_impl setFillStyleWithRed:color.r/255.0f green:color.g/255.0f blue:color.b/255.0f alpha:color.a];
//    SE_LOGD("CanvasRenderingContext2D::set_fillStyle: %s, (%d, %d, %d, %f)\n", fillStyle.c_str(), color.r, color.g, color.b, color.a);
}

void CanvasRenderingContext2D::set_strokeStyle(const std::string& strokeStyle)
{

}

void CanvasRenderingContext2D::set_globalCompositeOperation(const std::string& globalCompositeOperation)
{
    
}

// transform

void CanvasRenderingContext2D::translate(float x, float y)
{

}

void CanvasRenderingContext2D::scale(float x, float y)
{

}

void CanvasRenderingContext2D::rotate(float angle)
{

}

void CanvasRenderingContext2D::transform(float a, float b, float c, float d, float e, float f)
{

}

void CanvasRenderingContext2D::setTransform(float a, float b, float c, float d, float e, float f)
{

}

NS_CC_END
