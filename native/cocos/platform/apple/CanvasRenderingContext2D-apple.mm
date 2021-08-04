/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include "platform/CanvasRenderingContext2D.h"
#include "base/csscolorparser.h"
#include "base/UTF8.h"
#include "math/Math.h"

#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_platform.h"

#import <Foundation/Foundation.h>

#if CC_PLATFORM == CC_PLATFORM_MAC_OSX
    #import <Cocoa/Cocoa.h>
#else
    #import <CoreText/CoreText.h>
    #import <UIKit/UIKit.h>

    #define NSBezierPath UIBezierPath
    #define NSFont       UIFont
    #define NSColor      UIColor
    #define NSSize       CGSize
    #define NSZeroSize   CGSizeZero
    #define NSPoint      CGPoint
    #define NSMakePoint  CGPointMake

#endif

#include <regex>
#include <array>
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

@interface CanvasRenderingContext2DImpl : NSObject {
    NSFont *_font;
    NSMutableDictionary *_tokenAttributesDict;
    NSString *_fontName;
    CGFloat _fontSize;
    CGFloat _width;
    CGFloat _height;
    CGContextRef _context;

#if CC_PLATFORM == CC_PLATFORM_MAC_OSX
    NSGraphicsContext *_currentGraphicsContext;
    NSGraphicsContext *_oldGraphicsContext;
#else
    CGContextRef _oldContext;
#endif

    CGColorSpaceRef _colorSpace;
    cc::Data _imageData;
    NSBezierPath *_path;

    CanvasTextAlign _textAlign;
    CanvasTextBaseline _textBaseLine;
    std::array<float, 4> _fillStyle;
    std::array<float, 4> _strokeStyle;
    float _lineWidth;
    bool _bold;
}

@property (nonatomic, strong) NSFont *font;
@property (nonatomic, strong) NSMutableDictionary *tokenAttributesDict;
@property (nonatomic, strong) NSString *fontName;
@property (nonatomic, assign) CanvasTextAlign textAlign;
@property (nonatomic, assign) CanvasTextBaseline textBaseLine;
@property (nonatomic, assign) float lineWidth;

@end

@implementation CanvasRenderingContext2DImpl

@synthesize font = _font;
@synthesize tokenAttributesDict = _tokenAttributesDict;
@synthesize fontName = _fontName;
@synthesize textAlign = _textAlign;
@synthesize textBaseLine = _textBaseLine;
@synthesize lineWidth = _lineWidth;

- (id)init {
    if (self = [super init]) {
        _lineWidth = 0;
        _textAlign = CanvasTextAlign::LEFT;
        _textBaseLine = CanvasTextBaseline::BOTTOM;
        _width = _height = 0;
        _context = nil;
        _colorSpace = nil;

#if CC_PLATFORM == CC_PLATFORM_MAC_OSX
        _currentGraphicsContext = nil;
        _oldGraphicsContext = nil;
#endif
        _path = [NSBezierPath bezierPath];
        [_path retain];
        [self updateFontWithName:@"Arial" fontSize:30 bold:false];
    }

    return self;
}

- (void)dealloc {
    self.font = nil;
    self.tokenAttributesDict = nil;
    self.fontName = nil;
    CGColorSpaceRelease(_colorSpace);
    // release the context
    CGContextRelease(_context);
    [_path release];
#if CC_PLATFORM == CC_PLATFORM_MAC_OSX
    [_currentGraphicsContext release];
#endif
    [super dealloc];
}

#if CC_PLATFORM == CC_PLATFORM_MAC_OSX

- (NSFont *)_createSystemFont {
    NSFontTraitMask mask = NSUnitalicFontMask;
    if (_bold) {
        mask |= NSBoldFontMask;
    } else {
        mask |= NSUnboldFontMask;
    }

    NSFont *font = [[NSFontManager sharedFontManager]
        fontWithFamily:_fontName
                traits:mask
                weight:0
                  size:_fontSize];

    if (font == nil) {
        const auto &familyMap = getFontFamilyNameMap();
        auto iter = familyMap.find([_fontName UTF8String]);
        if (iter != familyMap.end()) {
            font = [[NSFontManager sharedFontManager]
                fontWithFamily:[NSString stringWithUTF8String:iter->second.c_str()]
                        traits:mask
                        weight:0
                          size:_fontSize];
        }
    }

    if (font == nil) {
        font = [[NSFontManager sharedFontManager]
            fontWithFamily:@"Arial"
                    traits:mask
                    weight:0
                      size:_fontSize];
    }
    return font;
}

#else

- (UIFont *)_createSystemFont {
    UIFont *font = nil;

    if (_bold) {
        font = [UIFont fontWithName:[_fontName stringByAppendingString:@"-Bold"] size:_fontSize];
    } else {
        font = [UIFont fontWithName:_fontName size:_fontSize];
    }

    if (font == nil) {
        const auto &familyMap = getFontFamilyNameMap();
        auto iter = familyMap.find([_fontName UTF8String]);
        if (iter != familyMap.end()) {
            font = [UIFont fontWithName:[NSString stringWithUTF8String:iter->second.c_str()] size:_fontSize];
        }
    }

    if (font == nil) {
        if (_bold) {
            font = [UIFont boldSystemFontOfSize:_fontSize];
        } else {
            font = [UIFont systemFontOfSize:_fontSize];
        }
    }
    return font;
}

#endif

- (void)updateFontWithName:(NSString *)fontName fontSize:(CGFloat)fontSize bold:(bool)bold {
    _fontSize = fontSize;
    _bold = bold;

    self.fontName = fontName;
    self.font = [self _createSystemFont];

    NSMutableParagraphStyle *paragraphStyle = [[[NSMutableParagraphStyle alloc] init] autorelease];
    paragraphStyle.lineBreakMode = NSLineBreakByTruncatingTail;
    [paragraphStyle setAlignment:NSTextAlignmentCenter];

    // color
    NSColor *foregroundColor = [NSColor colorWithRed:1.0f
                                               green:1.0f
                                                blue:1.0f
                                               alpha:1.0f];

    // attribute
    self.tokenAttributesDict = [NSMutableDictionary dictionaryWithObjectsAndKeys:
                                                        foregroundColor, NSForegroundColorAttributeName,
                                                        _font, NSFontAttributeName,
                                                        paragraphStyle, NSParagraphStyleAttributeName, nil];
}

- (void)recreateBufferWithWidth:(NSInteger)width height:(NSInteger)height {
    _width = width = width > 0 ? width : 1;
    _height = height = height > 0 ? height : 1;
    NSUInteger textureSize = width * height * 4;
    unsigned char *data = (unsigned char *)malloc(sizeof(unsigned char) * textureSize);
    memset(data, 0, textureSize);
    _imageData.fastSet(data, textureSize);

    if (_context != nil) {
        CGContextRelease(_context);
        _context = nil;
    }

#if CC_PLATFORM == CC_PLATFORM_MAC_OSX
    if (_currentGraphicsContext != nil) {
        [_currentGraphicsContext release];
        _currentGraphicsContext = nil;
    }
#endif

    // draw text
    _colorSpace = CGColorSpaceCreateDeviceRGB();
    _context = CGBitmapContextCreate(data,
                                     width,
                                     height,
                                     8,
                                     width * 4,
                                     _colorSpace,
                                     kCGImageAlphaPremultipliedLast | kCGBitmapByteOrder32Big);
    if (nil == _context) {
        CGColorSpaceRelease(_colorSpace); //REFINE: HOWTO RELEASE?
        _colorSpace = nil;
    }

#if CC_PLATFORM == CC_PLATFORM_MAC_OSX
    _currentGraphicsContext = [NSGraphicsContext graphicsContextWithCGContext:_context flipped:NO];
    [_currentGraphicsContext retain];
#else
    // move Y rendering to the top of the image
    CGContextTranslateCTM(_context, 0.0f, _height);

    //NOTE: NSString draws in UIKit referential i.e. renders upside-down compared to CGBitmapContext referential
    CGContextScaleCTM(_context, 1.0f, -1.0f);
#endif
}

- (NSSize)measureText:(NSString *)text {

    NSAttributedString *stringWithAttributes = [[[NSAttributedString alloc] initWithString:text
                                                                                attributes:_tokenAttributesDict] autorelease];

    NSSize textRect = NSZeroSize;
    textRect.width = CGFLOAT_MAX;
    textRect.height = CGFLOAT_MAX;

    NSSize dim = [stringWithAttributes boundingRectWithSize:textRect options:(NSStringDrawingOptions)(NSStringDrawingUsesLineFragmentOrigin)context:nil].size;

    dim.width = ceilf(dim.width);
    dim.height = ceilf(dim.height);

    return dim;
}

- (NSPoint)convertDrawPoint:(NSPoint)point text:(NSString *)text {
    // The parameter 'point' is located at left-bottom position.
    // Need to adjust 'point' according 'text align' & 'text base line'.
    NSSize textSize = [self measureText:text];

    if (_textAlign == CanvasTextAlign::CENTER) {
        point.x -= textSize.width / 2.0f;
    } else if (_textAlign == CanvasTextAlign::RIGHT) {
        point.x -= textSize.width;
    }

#if CC_PLATFORM == CC_PLATFORM_MAC_OSX
    // The origin on macOS is bottom-left by default,
    // so we need to convert y from top-left origin to bottom-left origin.
    point.y = _height - point.y;
    if (_textBaseLine == CanvasTextBaseline::TOP) {
        point.y += -textSize.height;
    } else if (_textBaseLine == CanvasTextBaseline::MIDDLE) {
        point.y += -textSize.height / 2.0f;
    } else if (_textBaseLine == CanvasTextBaseline::BOTTOM) {
        // drawAtPoint default
    } else if (_textBaseLine == CanvasTextBaseline::ALPHABETIC) {
        point.y += _font.descender;
    }
#else
    if (_textBaseLine == CanvasTextBaseline::TOP) {
        // drawAtPoint default
    } else if (_textBaseLine == CanvasTextBaseline::MIDDLE) {
        point.y += -textSize.height / 2.0f;
    } else if (_textBaseLine == CanvasTextBaseline::BOTTOM) {
        point.y += -textSize.height;
    } else if (_textBaseLine == CanvasTextBaseline::ALPHABETIC) {
        point.y -= _font.ascender;
    }
#endif

    return point;
}

- (void)fillText:(NSString *)text x:(CGFloat)x y:(CGFloat)y maxWidth:(CGFloat)maxWidth {
    if (text.length == 0)
        return;

    NSPoint drawPoint = [self convertDrawPoint:NSMakePoint(x, y) text:text];

    NSMutableParagraphStyle *paragraphStyle = [[[NSMutableParagraphStyle alloc] init] autorelease];
    paragraphStyle.lineBreakMode = NSLineBreakByTruncatingTail;

    [_tokenAttributesDict removeObjectForKey:NSStrokeColorAttributeName];

    [_tokenAttributesDict setObject:paragraphStyle forKey:NSParagraphStyleAttributeName];
    [_tokenAttributesDict setObject:[NSColor colorWithRed:_fillStyle[0] green:_fillStyle[1] blue:_fillStyle[2] alpha:_fillStyle[3]]
                             forKey:NSForegroundColorAttributeName];

    [self saveContext];

    // text color
    CGContextSetRGBFillColor(_context, _fillStyle[0], _fillStyle[1], _fillStyle[2], _fillStyle[3]);
    CGContextSetShouldSubpixelQuantizeFonts(_context, false);
    CGContextBeginTransparencyLayerWithRect(_context, CGRectMake(0, 0, _width, _height), nullptr);
    CGContextSetTextDrawingMode(_context, kCGTextFill);

    NSAttributedString *stringWithAttributes = [[[NSAttributedString alloc] initWithString:text
                                                                                attributes:_tokenAttributesDict] autorelease];

    [stringWithAttributes drawAtPoint:drawPoint];

    CGContextEndTransparencyLayer(_context);

    [self restoreContext];
}

- (void)strokeText:(NSString *)text x:(CGFloat)x y:(CGFloat)y maxWidth:(CGFloat)maxWidth {
    if (text.length == 0)
        return;

    NSPoint drawPoint = [self convertDrawPoint:NSMakePoint(x, y) text:text];

    NSMutableParagraphStyle *paragraphStyle = [[[NSMutableParagraphStyle alloc] init] autorelease];
    paragraphStyle.lineBreakMode = NSLineBreakByTruncatingTail;

    [_tokenAttributesDict removeObjectForKey:NSForegroundColorAttributeName];

    [_tokenAttributesDict setObject:paragraphStyle forKey:NSParagraphStyleAttributeName];
    [_tokenAttributesDict setObject:[NSColor colorWithRed:_strokeStyle[0]
                                                    green:_strokeStyle[1]
                                                     blue:_strokeStyle[2]
                                                    alpha:_strokeStyle[3]]
                             forKey:NSStrokeColorAttributeName];

    [self saveContext];

    // text color
    CGContextSetRGBStrokeColor(_context, _strokeStyle[0], _strokeStyle[1], _strokeStyle[2], _strokeStyle[3]);
    CGContextSetRGBFillColor(_context, _fillStyle[0], _fillStyle[1], _fillStyle[2], _fillStyle[3]);
    CGContextSetLineWidth(_context, _lineWidth);
    CGContextSetLineJoin(_context, kCGLineJoinRound);
    CGContextSetShouldSubpixelQuantizeFonts(_context, false);
    CGContextBeginTransparencyLayerWithRect(_context, CGRectMake(0, 0, _width, _height), nullptr);

    CGContextSetTextDrawingMode(_context, kCGTextStroke);

    NSAttributedString *stringWithAttributes = [[[NSAttributedString alloc] initWithString:text
                                                                                attributes:_tokenAttributesDict] autorelease];

    [stringWithAttributes drawAtPoint:drawPoint];

    CGContextEndTransparencyLayer(_context);

    [self restoreContext];
}

- (void)setFillStyleWithRed:(CGFloat)r green:(CGFloat)g blue:(CGFloat)b alpha:(CGFloat)a {
    _fillStyle[0] = r;
    _fillStyle[1] = g;
    _fillStyle[2] = b;
    _fillStyle[3] = a;
}

- (void)setStrokeStyleWithRed:(CGFloat)r green:(CGFloat)g blue:(CGFloat)b alpha:(CGFloat)a {
    _strokeStyle[0] = r;
    _strokeStyle[1] = g;
    _strokeStyle[2] = b;
    _strokeStyle[3] = a;
}

- (const cc::Data &)getDataRef {
    return _imageData;
}

- (void)clearRect:(CGRect)rect {
    if (_imageData.isNull())
        return;

    rect.origin.x = floor(rect.origin.x);
    rect.origin.y = floor(rect.origin.y);
    rect.size.width = floor(rect.size.width);
    rect.size.height = floor(rect.size.height);

    if (rect.origin.x < 0) rect.origin.x = 0;
    if (rect.origin.y < 0) rect.origin.y = 0;

    if (rect.size.width < 1 || rect.size.height < 1)
        return;
    //REFINE:
    //    assert(rect.origin.x == 0 && rect.origin.y == 0);
    memset((void *)_imageData.getBytes(), 0x00, _imageData.getSize());
}

- (void)fillRect:(CGRect)rect {
    [self saveContext];

    NSColor *color = [NSColor colorWithRed:_fillStyle[0] green:_fillStyle[1] blue:_fillStyle[2] alpha:_fillStyle[3]];
    [color setFill];
#if CC_PLATFORM == CC_PLATFORM_MAC_OSX
    CGRect tmpRect = CGRectMake(rect.origin.x, _height - rect.origin.y - rect.size.height, rect.size.width, rect.size.height);
    [NSBezierPath fillRect:tmpRect];
#else
    NSBezierPath *path = [NSBezierPath bezierPathWithRect:rect];
    [path fill];
#endif
    [self restoreContext];
}

- (void)saveContext {
#if CC_PLATFORM == CC_PLATFORM_MAC_OSX
    // save the old graphics context
    _oldGraphicsContext = [NSGraphicsContext currentContext];
    // store the current context
    [NSGraphicsContext setCurrentContext:_currentGraphicsContext];
    // push graphics state to stack
    [NSGraphicsContext saveGraphicsState];
    [[NSGraphicsContext currentContext] setShouldAntialias:YES];
#else
    // save the old graphics context
    _oldContext = UIGraphicsGetCurrentContext();
    // store the current context
    UIGraphicsPushContext(_context);
    CGContextSaveGState(_context);
#endif
}

- (void)restoreContext {
#if CC_PLATFORM == CC_PLATFORM_MAC_OSX
    // pop the context
    [NSGraphicsContext restoreGraphicsState];
    // reset the old graphics context
    [NSGraphicsContext setCurrentContext:_oldGraphicsContext];
    _oldGraphicsContext = nil;
#else
    // pop the context
    CGContextRestoreGState(_context);
    // reset the old graphics context
    UIGraphicsPopContext();
    _oldContext = nil;
#endif
}

- (void)beginPath {
}

- (void)stroke {
    NSColor *color = [NSColor colorWithRed:_strokeStyle[0] green:_strokeStyle[1] blue:_strokeStyle[2] alpha:_strokeStyle[3]];
    [color setStroke];
    [_path setLineWidth:_lineWidth];
    [_path stroke];
}

- (void)moveToX:(float)x y:(float)y {
#if CC_PLATFORM == CC_PLATFORM_MAC_OSX
    [_path moveToPoint:NSMakePoint(x, _height - y)];
#else
    [_path moveToPoint:NSMakePoint(x, y)];
#endif
}

- (void)lineToX:(float)x y:(float)y {
#if CC_PLATFORM == CC_PLATFORM_MAC_OSX
    [_path lineToPoint:NSMakePoint(x, _height - y)];
#else
    [_path addLineToPoint:NSMakePoint(x, y)];
#endif
}

@end

namespace cc {

CanvasGradient::CanvasGradient() {
    SE_LOGD("CanvasGradient constructor: %p\n", this);
}

CanvasGradient::~CanvasGradient() {
    SE_LOGD("CanvasGradient destructor: %p\n", this);
}

void CanvasGradient::addColorStop(float offset, const std::string &color) {
    SE_LOGD("CanvasGradient::addColorStop: %p\n", this);
}

// CanvasRenderingContext2D

namespace {
#define CLAMP(V, HI) std::min((V), (HI))
void unMultiplyAlpha(unsigned char *ptr, ssize_t size) {
    float alpha;
    for (int i = 0; i < size; i += 4) {
        alpha = (float)ptr[i + 3];
        if (alpha > 0) {
            ptr[i] = CLAMP((int)((float)ptr[i] / alpha * 255), 255);
            ptr[i + 1] = CLAMP((int)((float)ptr[i + 1] / alpha * 255), 255);
            ptr[i + 2] = CLAMP((int)((float)ptr[i + 2] / alpha * 255), 255);
        }
    }
}
} // namespace

#define SEND_DATA_TO_JS(CB, IMPL)                         \
    if (CB) {                                             \
        Data data([IMPL getDataRef]);                     \
        unMultiplyAlpha(data.getBytes(), data.getSize()); \
        CB(data);                                         \
    }

CanvasRenderingContext2D::CanvasRenderingContext2D(float width, float height)
: _width(width),
  _height(height) {
    //    SE_LOGD("CanvasRenderingContext2D constructor: %p, width: %f, height: %f\n", this, width, height);
    _impl = [[CanvasRenderingContext2DImpl alloc] init];
}

CanvasRenderingContext2D::~CanvasRenderingContext2D() {
    //    SE_LOGD("CanvasRenderingContext2D destructor: %p\n", this);
    [_impl release];
}

void CanvasRenderingContext2D::recreateBufferIfNeeded() {
    if (_isBufferSizeDirty) {
        _isBufferSizeDirty = false;
        //        SE_LOGD("CanvasRenderingContext2D::recreateBufferIfNeeded %p, w: %f, h:%f\n", this, __width, __height);
        [_impl recreateBufferWithWidth:_width height:_height];
        SEND_DATA_TO_JS(_canvasBufferUpdatedCB, _impl);
    }
}

void CanvasRenderingContext2D::clearRect(float x, float y, float width, float height) {
    //    SE_LOGD("CanvasGradient::clearRect: %p, %f, %f, %f, %f\n", this, x, y, width, height);
    recreateBufferIfNeeded();
    [_impl clearRect:CGRectMake(x, y, width, height)];
}

void CanvasRenderingContext2D::fillRect(float x, float y, float width, float height) {
    recreateBufferIfNeeded();
    [_impl fillRect:CGRectMake(x, y, width, height)];
    SEND_DATA_TO_JS(_canvasBufferUpdatedCB, _impl);
}

void CanvasRenderingContext2D::fillText(const std::string &text, float x, float y, float maxWidth) {
    //    SE_LOGD("CanvasRenderingContext2D(%p)::fillText: %s, %f, %f, %f\n", this, text.c_str(), x, y, maxWidth);
    if (text.empty())
        return;

    recreateBufferIfNeeded();

    [_impl fillText:[NSString stringWithUTF8String:text.c_str()] x:x y:y maxWidth:maxWidth];
    SEND_DATA_TO_JS(_canvasBufferUpdatedCB, _impl);
}

void CanvasRenderingContext2D::strokeText(const std::string &text, float x, float y, float maxWidth) {
    //    SE_LOGD("CanvasRenderingContext2D(%p)::strokeText: %s, %f, %f, %f\n", this, text.c_str(), x, y, maxWidth);
    if (text.empty())
        return;
    recreateBufferIfNeeded();

    [_impl strokeText:[NSString stringWithUTF8String:text.c_str()] x:x y:y maxWidth:maxWidth];
    SEND_DATA_TO_JS(_canvasBufferUpdatedCB, _impl);
}

cc::Size CanvasRenderingContext2D::measureText(const std::string &text) {
    NSString *str = [NSString stringWithUTF8String:text.c_str()];
    if (str == nil) {
        std::string textNew;
        cc::StringUtils::UTF8LooseFix(text, textNew);
        str = [NSString stringWithUTF8String:textNew.c_str()];
    }
    CGSize size = [_impl measureText:str];
    return cc::Size(size.width, size.height);
}

CanvasGradient *CanvasRenderingContext2D::createLinearGradient(float x0, float y0, float x1, float y1) {
    return nullptr;
}

void CanvasRenderingContext2D::save() {
    [_impl saveContext];
}

void CanvasRenderingContext2D::beginPath() {
    [_impl beginPath];
}

void CanvasRenderingContext2D::closePath() {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::moveTo(float x, float y) {
    [_impl moveToX:x y:y];
}

void CanvasRenderingContext2D::lineTo(float x, float y) {
    [_impl lineToX:x y:y];
}

void CanvasRenderingContext2D::stroke() {
    [_impl stroke];
    SEND_DATA_TO_JS(_canvasBufferUpdatedCB, _impl);
}

void CanvasRenderingContext2D::fill() {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::rect(float x, float y, float w, float h) {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::restore() {
    [_impl restoreContext];
}

void CanvasRenderingContext2D::setCanvasBufferUpdatedCallback(const CanvasBufferUpdatedCallback &cb) {
    _canvasBufferUpdatedCB = cb;
    recreateBufferIfNeeded();
}

void CanvasRenderingContext2D::setWidth(float width) {
    //    SE_LOGD("CanvasRenderingContext2D::set__width: %f\n", width);
    if (math::IsEqualF(width, _width)) return;
    _width = width;
    _isBufferSizeDirty = true;
    recreateBufferIfNeeded();
}

void CanvasRenderingContext2D::setHeight(float height) {
    //    SE_LOGD("CanvasRenderingContext2D::set__height: %f\n", height);
    if (math::IsEqualF(height, _height)) return;
    _height = height;
    _isBufferSizeDirty = true;
    recreateBufferIfNeeded();
}

void CanvasRenderingContext2D::setLineWidth(float lineWidth) {
    _lineWidth = lineWidth;
    _impl.lineWidth = _lineWidth;
}

void CanvasRenderingContext2D::setLineCap(const std::string &lineCap) {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::setLineJoin(const std::string &lineJoin) {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::setFont(const std::string &font) {
    if (_font != font) {
        _font = font;

        std::string boldStr;
        std::string fontName = "Arial";
        std::string fontSizeStr = "30";

        // support get font name from `60px American` or `60px "American abc-abc_abc"`
        std::regex re("(bold)?\\s*((\\d+)([\\.]\\d+)?)px\\s+([\\w-]+|\"[\\w -]+\"$)");
        std::match_results<std::string::const_iterator> results;
        if (std::regex_search(_font.cbegin(), _font.cend(), results, re)) {
            boldStr = results[1].str();
            fontSizeStr = results[2].str();
            fontName = results[5].str();
        }

        CGFloat fontSize = atof(fontSizeStr.c_str());
        [_impl updateFontWithName:[NSString stringWithUTF8String:fontName.c_str()] fontSize:fontSize bold:!boldStr.empty()];
    }
}

void CanvasRenderingContext2D::setTextAlign(const std::string &textAlign) {
    //    SE_LOGD("CanvasRenderingContext2D::set_textAlign: %s\n", textAlign.c_str());
    if (textAlign == "left") {
        _impl.textAlign = CanvasTextAlign::LEFT;
    } else if (textAlign == "center" || textAlign == "middle") {
        _impl.textAlign = CanvasTextAlign::CENTER;
    } else if (textAlign == "right") {
        _impl.textAlign = CanvasTextAlign::RIGHT;
    } else {
        assert(false);
    }
}

void CanvasRenderingContext2D::setTextBaseline(const std::string &textBaseline) {
    //    SE_LOGD("CanvasRenderingContext2D::set_textBaseline: %s\n", textBaseline.c_str());
    if (textBaseline == "top") {
        _impl.textBaseLine = CanvasTextBaseline::TOP;
    } else if (textBaseline == "middle") {
        _impl.textBaseLine = CanvasTextBaseline::MIDDLE;
    } else if (textBaseline == "bottom") //REFINE:, how to deal with alphabetic, currently we handle it as bottom mode.
    {
        _impl.textBaseLine = CanvasTextBaseline::BOTTOM;
    } else if (textBaseline == "alphabetic") {
        _impl.textBaseLine = CanvasTextBaseline::ALPHABETIC;
    } else {
        assert(false);
    }
}

void CanvasRenderingContext2D::setFillStyle(const std::string &fillStyle) {
    CSSColorParser::Color color = CSSColorParser::parse(fillStyle);
    [_impl setFillStyleWithRed:color.r / 255.0f green:color.g / 255.0f blue:color.b / 255.0f alpha:color.a];
    //    SE_LOGD("CanvasRenderingContext2D::set_fillStyle: %s, (%d, %d, %d, %f)\n", fillStyle.c_str(), color.r, color.g, color.b, color.a);
}

void CanvasRenderingContext2D::setStrokeStyle(const std::string &strokeStyle) {
    CSSColorParser::Color color = CSSColorParser::parse(strokeStyle);
    [_impl setStrokeStyleWithRed:color.r / 255.0f green:color.g / 255.0f blue:color.b / 255.0f alpha:color.a];
}

void CanvasRenderingContext2D::setGlobalCompositeOperation(const std::string &globalCompositeOperation) {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::fillImageData(const Data &imageData, float imageWidth, float imageHeight, float offsetX, float offsetY) {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

// transform

void CanvasRenderingContext2D::translate(float x, float y) {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::scale(float x, float y) {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::rotate(float angle) {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::transform(float a, float b, float c, float d, float e, float f) {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

void CanvasRenderingContext2D::setTransform(float a, float b, float c, float d, float e, float f) {
    //SE_LOGE("%s isn't implemented!\n", __FUNCTION__);
}

} // namespace cc
