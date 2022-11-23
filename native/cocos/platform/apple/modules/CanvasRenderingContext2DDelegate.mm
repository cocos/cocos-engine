/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#include "platform/apple/modules/CanvasRenderingContext2DDelegate.h"
#include "base/UTF8.h"
#include "base/csscolorparser.h"
#include "math/Math.h"

#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_platform.h"

#import <Foundation/Foundation.h>

#if CC_PLATFORM == CC_PLATFORM_MACOS
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

@interface CanvasRenderingContext2DDelegateImpl : NSObject {
    NSFont *_font;
    NSMutableDictionary *_tokenAttributesDict;
    NSString *_fontName;
    CGFloat _fontSize;
    CGFloat _width;
    CGFloat _height;
    CGContextRef _context;

#if CC_PLATFORM == CC_PLATFORM_MACOS
    NSGraphicsContext *_currentGraphicsContext;
    NSGraphicsContext *_oldGraphicsContext;
#else
    CGContextRef _oldContext;
#endif

    CGColorSpaceRef _colorSpace;
    cc::Data _imageData;
    NSBezierPath *_path;

    cc::ICanvasRenderingContext2D::TextAlign _textAlign;
    cc::ICanvasRenderingContext2D::TextBaseline _textBaseLine;
    ccstd::array<float, 4> _fillStyle;
    ccstd::array<float, 4> _strokeStyle;
    NSColor *_shadowColor;
    float _lineWidth;
    bool _bold;
    bool _italic;
}

@property (nonatomic, strong) NSFont *font;
@property (nonatomic, strong) NSMutableDictionary *tokenAttributesDict;
@property (nonatomic, strong) NSString *fontName;
@property (nonatomic, assign) cc::ICanvasRenderingContext2D::TextAlign textAlign;
@property (nonatomic, assign) cc::ICanvasRenderingContext2D::TextBaseline textBaseLine;
@property (nonatomic, assign) float lineWidth;
@property (nonatomic, assign) float shadowBlur;
@property (nonatomic, assign) float shadowOffsetX;
@property (nonatomic, assign) float shadowOffsetY;

@end

@implementation CanvasRenderingContext2DDelegateImpl

@synthesize font = _font;
@synthesize tokenAttributesDict = _tokenAttributesDict;
@synthesize fontName = _fontName;
@synthesize textAlign = _textAlign;
@synthesize textBaseLine = _textBaseLine;
@synthesize lineWidth = _lineWidth;

- (id)init {
    if (self = [super init]) {
        _lineWidth = 0;
        _textAlign = cc::ICanvasRenderingContext2D::TextAlign::LEFT;
        _textBaseLine = cc::ICanvasRenderingContext2D::TextBaseline::BOTTOM;
        _width = _height = 0;
        _shadowBlur = _shadowOffsetX = _shadowOffsetY = 0;
        _shadowColor = nil;
        _context = nil;
        _colorSpace = nil;

#if CC_PLATFORM == CC_PLATFORM_MACOS
        _currentGraphicsContext = nil;
        _oldGraphicsContext = nil;
#endif
        _path = [NSBezierPath bezierPath];
        [_path retain];
        [self updateFontWithName:@"Arial" fontSize:30 bold:false italic:false];
    }

    return self;
}

- (void)dealloc {
    self.font = nil;
    self.tokenAttributesDict = nil;
    self.fontName = nil;
    if (_shadowColor) {
        [_shadowColor release];
    }
    _shadowColor = nil;
    CGColorSpaceRelease(_colorSpace);
    // release the context
    CGContextRelease(_context);
    [_path release];
#if CC_PLATFORM == CC_PLATFORM_MACOS
    [_currentGraphicsContext release];
#endif
    [super dealloc];
}

#if CC_PLATFORM == CC_PLATFORM_MACOS

- (NSFont *)_createSystemFont {
    NSFontTraitMask mask = NSUnitalicFontMask;
    if (_italic) {
        mask = NSItalicFontMask;
    }
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

- (void)updateFontWithName:(NSString *)fontName fontSize:(CGFloat)fontSize bold:(bool)bold italic:(bool)italic {
    _fontSize = fontSize;
    _bold = bold;
    _italic = italic;

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
    if (_italic) {
        self.tokenAttributesDict = [NSMutableDictionary dictionaryWithObjectsAndKeys:
                                                        foregroundColor, NSForegroundColorAttributeName,
                                                        _font, NSFontAttributeName,
                                                        @(0.25f), NSObliquenessAttributeName,
                                                        paragraphStyle, NSParagraphStyleAttributeName, nil];
    } else {
        self.tokenAttributesDict = [NSMutableDictionary dictionaryWithObjectsAndKeys:
                                                        foregroundColor, NSForegroundColorAttributeName,
                                                        _font, NSFontAttributeName,
                                                        paragraphStyle, NSParagraphStyleAttributeName, nil];
    }
    
}

- (void)recreateBufferWithWidth:(NSInteger)width height:(NSInteger)height {
    _width = width = width > 0 ? width : 1;
    _height = height = height > 0 ? height : 1;
    NSUInteger textureSize = width * height * 4;
    unsigned char *data = (unsigned char *)malloc(sizeof(unsigned char) * textureSize);
    memset(data, 0, textureSize);
    _imageData.fastSet(data, static_cast<uint32_t>(textureSize));

    if (_context != nil) {
        CGContextRelease(_context);
        _context = nil;
    }

#if CC_PLATFORM == CC_PLATFORM_MACOS
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

#if CC_PLATFORM == CC_PLATFORM_MACOS
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

    if (_textAlign == cc::ICanvasRenderingContext2D::TextAlign::CENTER) {
        point.x -= textSize.width / 2.0f;
    } else if (_textAlign == cc::ICanvasRenderingContext2D::TextAlign::RIGHT) {
        point.x -= textSize.width;
    }

#if CC_PLATFORM == CC_PLATFORM_MACOS
    // The origin on macOS is bottom-left by default,
    // so we need to convert y from top-left origin to bottom-left origin.
    point.y = _height - point.y;
    if (_textBaseLine == cc::ICanvasRenderingContext2D::TextBaseline::TOP) {
        point.y += -textSize.height;
    } else if (_textBaseLine == cc::ICanvasRenderingContext2D::TextBaseline::MIDDLE) {
        point.y += -textSize.height / 2.0f;
    } else if (_textBaseLine == cc::ICanvasRenderingContext2D::TextBaseline::BOTTOM) {
        // drawAtPoint default
    } else if (_textBaseLine == cc::ICanvasRenderingContext2D::TextBaseline::ALPHABETIC) {
        point.y += _font.descender;
    }
#else
    if (_textBaseLine == cc::ICanvasRenderingContext2D::TextBaseline::TOP) {
        // drawAtPoint default
    } else if (_textBaseLine == cc::ICanvasRenderingContext2D::TextBaseline::MIDDLE) {
        point.y += -textSize.height / 2.0f;
    } else if (_textBaseLine == cc::ICanvasRenderingContext2D::TextBaseline::BOTTOM) {
        point.y += -textSize.height;
    } else if (_textBaseLine == cc::ICanvasRenderingContext2D::TextBaseline::ALPHABETIC) {
        point.y -= _font.ascender;
    }
#endif

    return point;
}

- (bool) isShadowEnabled {
    if (_shadowColor && (_shadowBlur > 0 || _shadowOffsetX > 0 || _shadowOffsetY > 0)) {
        return true;
    }
    return false;
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
    if ([self isShadowEnabled]) {
        // https://developer.apple.com/library/archive/documentation/2DDrawing/Conceptual/DrawingPrintingiOS/GraphicsDrawingOverview/GraphicsDrawingOverview.html
        /*  Core Graphics uses lower-left-origin coordinate system;
            but the api CGContextSetShadowWithColor's parameter 'offset' accept base space(relative to view: upper-left-origin coordinate system),
            and _shadowOffsetY is edited by lower-left-origin coordinate system, so here we need to multiply the change in y direction by -1
        */
        CGContextSetShadowWithColor(_context, CGSizeMake(_shadowOffsetX, -_shadowOffsetY), _shadowBlur, _shadowColor.CGColor);
    }

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
    if ([self isShadowEnabled]) {
        // https://developer.apple.com/library/archive/documentation/2DDrawing/Conceptual/DrawingPrintingiOS/GraphicsDrawingOverview/GraphicsDrawingOverview.html
        /*  Core Graphics uses lower-left-origin coordinate system;
            but the api CGContextSetShadowWithColor's parameter 'offset' accept base space(relative to view: upper-left-origin coordinate system),
            and _shadowOffsetY is edited by lower-left-origin coordinate system, so here we need to multiply the change in y direction by -1
        */
        CGContextSetShadowWithColor(_context, CGSizeMake(_shadowOffsetX, -_shadowOffsetY), _shadowBlur, _shadowColor.CGColor);
    }

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

- (void)setShadowColorWithRed:(CGFloat)r green:(CGFloat)g blue:(CGFloat)b alpha:(CGFloat)a {
    _shadowColor = [NSColor colorWithRed:r green:g blue:b alpha:a];
    [_shadowColor retain];
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
    //    CC_ASSERT(rect.origin.x == 0 && rect.origin.y == 0);
    memset((void *)_imageData.getBytes(), 0x00, _imageData.getSize());
}

- (void)fillRect:(CGRect)rect {
    [self saveContext];

    NSColor *color = [NSColor colorWithRed:_fillStyle[0] green:_fillStyle[1] blue:_fillStyle[2] alpha:_fillStyle[3]];
    [color setFill];
#if CC_PLATFORM == CC_PLATFORM_MACOS
    CGRect tmpRect = CGRectMake(rect.origin.x, _height - rect.origin.y - rect.size.height, rect.size.width, rect.size.height);
    [NSBezierPath fillRect:tmpRect];
#else
    NSBezierPath *path = [NSBezierPath bezierPathWithRect:rect];
    [path fill];
#endif
    [self restoreContext];
}

- (void)saveContext {
#if CC_PLATFORM == CC_PLATFORM_MACOS
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
#if CC_PLATFORM == CC_PLATFORM_MACOS
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
#if CC_PLATFORM == CC_PLATFORM_MACOS
    [_path moveToPoint:NSMakePoint(x, _height - y)];
#else
    [_path moveToPoint:NSMakePoint(x, y)];
#endif
}

- (void)lineToX:(float)x y:(float)y {
#if CC_PLATFORM == CC_PLATFORM_MACOS
    [_path lineToPoint:NSMakePoint(x, _height - y)];
#else
    [_path addLineToPoint:NSMakePoint(x, y)];
#endif
}

@end

namespace cc {
CanvasRenderingContext2DDelegate::CanvasRenderingContext2DDelegate() {
    _impl = [[CanvasRenderingContext2DDelegateImpl alloc] init];
}

CanvasRenderingContext2DDelegate::~CanvasRenderingContext2DDelegate() {
    [_impl release];
}

void CanvasRenderingContext2DDelegate::recreateBuffer(float w, float h) {
    [_impl recreateBufferWithWidth:w height:h];
}

const cc::Data &CanvasRenderingContext2DDelegate::getDataRef() const {
    static Data data;
    data = [_impl getDataRef];
    unMultiplyAlpha(data.getBytes(), data.getSize());
    return data;
}

void CanvasRenderingContext2DDelegate::beginPath() {
    [_impl beginPath];
}

void CanvasRenderingContext2DDelegate::closePath() {
}

void CanvasRenderingContext2DDelegate::moveTo(float x, float y) {
    [_impl moveToX:x y:y];
}

void CanvasRenderingContext2DDelegate::lineTo(float x, float y) {
    [_impl lineToX:x y:y];
}

void CanvasRenderingContext2DDelegate::stroke() {
    [_impl stroke];
}

void CanvasRenderingContext2DDelegate::saveContext() {
    [_impl saveContext];
}

void CanvasRenderingContext2DDelegate::restoreContext() {
    [_impl restoreContext];
}

void CanvasRenderingContext2DDelegate::clearRect(float x, float y, float w, float h) {
    [_impl clearRect:CGRectMake(x, y, w, h)];
}

void CanvasRenderingContext2DDelegate::fill() {
}

void CanvasRenderingContext2DDelegate::setLineCap(const ccstd::string &lineCap) {
}

void CanvasRenderingContext2DDelegate::setLineJoin(const ccstd::string &lineJoin) {
}

void CanvasRenderingContext2DDelegate::rect(float x, float y, float w, float h) {
}

void CanvasRenderingContext2DDelegate::fillRect(float x, float y, float w, float h) {
    [_impl fillRect:CGRectMake(x, y, w, h)];
}

void CanvasRenderingContext2DDelegate::fillText(const ccstd::string &text, float x, float y, float maxWidth) {
    [_impl fillText:[NSString stringWithUTF8String:text.c_str()] x:x y:y maxWidth:maxWidth];
}

void CanvasRenderingContext2DDelegate::strokeText(const ccstd::string &text, float x, float y, float maxWidth) {
    [_impl strokeText:[NSString stringWithUTF8String:text.c_str()] x:x y:y maxWidth:maxWidth];
}

CanvasRenderingContext2DDelegate::Size CanvasRenderingContext2DDelegate::measureText(const ccstd::string &text) {
    NSString *str = [NSString stringWithUTF8String:text.c_str()];
    if (str == nil) {
        ccstd::string textNew;
        cc::StringUtils::UTF8LooseFix(text, textNew);
        str = [NSString stringWithUTF8String:textNew.c_str()];
    }
    CGSize size = [_impl measureText:str];
    return CanvasRenderingContext2DDelegate::Size{(float)size.width, (float)size.height};
}

void CanvasRenderingContext2DDelegate::updateFont(const ccstd::string &fontName, float fontSize, bool bold, bool italic, bool oblique, bool smallCaps) {
    CGFloat gfloatFontSize = fontSize;
    [_impl updateFontWithName:[NSString stringWithUTF8String:fontName.c_str()] fontSize:gfloatFontSize bold:bold italic:italic];
}

void CanvasRenderingContext2DDelegate::setTextAlign(TextAlign align) {
    _impl.textAlign = align;
}

void CanvasRenderingContext2DDelegate::setTextBaseline(TextBaseline baseline) {
    _impl.textBaseLine = baseline;
}

void CanvasRenderingContext2DDelegate::setFillStyle(uint8_t r, uint8_t g, uint8_t b, uint8_t a) {
    [_impl setFillStyleWithRed:r / 255.0f green:g / 255.0f blue:b / 255.0f alpha:a / 255.0f];
}

void CanvasRenderingContext2DDelegate::setStrokeStyle(uint8_t r, uint8_t g, uint8_t b, uint8_t a) {
    [_impl setStrokeStyleWithRed:r / 255.0f green:g / 255.0f blue:b / 255.0f alpha:a / 255.0f];
}

void CanvasRenderingContext2DDelegate::setLineWidth(float lineWidth) {
    _impl.lineWidth = lineWidth;
}

void CanvasRenderingContext2DDelegate::fillImageData(const Data &imageData, float imageWidth, float imageHeight, float offsetX, float offsetY) {
}

void CanvasRenderingContext2DDelegate::fillData() {
}

#define CLAMP(V, HI) std::min((V), (HI))
void CanvasRenderingContext2DDelegate::unMultiplyAlpha(unsigned char *ptr, uint32_t size) const {
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

void CanvasRenderingContext2DDelegate::setShadowBlur(float blur) {
    _impl.shadowBlur = blur * 0.5f;
}

void CanvasRenderingContext2DDelegate::setShadowColor(uint8_t r, uint8_t g, uint8_t b, uint8_t a) {
    [_impl setShadowColorWithRed:r / 255.0f green:g / 255.0f blue:b / 255.0f alpha:a / 255.0f];
}

void CanvasRenderingContext2DDelegate::setShadowOffsetX(float offsetX) {
    _impl.shadowOffsetX = offsetX;
}

void CanvasRenderingContext2DDelegate::setShadowOffsetY(float offsetY) {
    _impl.shadowOffsetY = offsetY;
}

} // namespace cc
