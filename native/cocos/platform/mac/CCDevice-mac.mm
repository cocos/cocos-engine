/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2013-2016 Chukong Technologies Inc.

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

#include "platform/CCPlatformConfig.h"
#if CC_TARGET_PLATFORM == CC_PLATFORM_MAC

#include "platform/CCDevice.h"
#include <Foundation/Foundation.h>
#include <Cocoa/Cocoa.h>
#include <string>
#include "base/ccTypes.h"
#include "platform/apple/CCDevice-apple.h"

#include "CCReachability.h"

NS_CC_BEGIN

using FontUtils::tImageInfo;

static NSAttributedString* __attributedStringWithFontSize(NSMutableAttributedString* attributedString, CGFloat fontSize)
{
    {
        [attributedString beginEditing];
        
        [attributedString enumerateAttribute:NSFontAttributeName inRange:NSMakeRange(0, attributedString.length) options:0 usingBlock:^(id value, NSRange range, BOOL *stop) {
            
            NSFont* font = value;
            font = [[NSFontManager sharedFontManager] convertFont:font toSize:fontSize];
            
            [attributedString removeAttribute:NSFontAttributeName range:range];
            [attributedString addAttribute:NSFontAttributeName value:font range:range];
        }];
        
        [attributedString endEditing];
    }
    
    return [[attributedString copy] autorelease];
}

int Device::getDPI()
{
    NSScreen *screen = [NSScreen mainScreen];
    NSDictionary *description = [screen deviceDescription];
    NSSize displayPixelSize = [[description objectForKey:NSDeviceSize] sizeValue];
    CGSize displayPhysicalSize = CGDisplayScreenSize([[description objectForKey:@"NSScreenNumber"] unsignedIntValue]);
    
    return ((displayPixelSize.width / displayPhysicalSize.width) * 25.4f);
}

void Device::setAccelerometerEnabled(bool isEnabled)
{

}

void Device::setAccelerometerInterval(float interval)
{

}

static NSSize _calculateStringSize(NSAttributedString *str, id font, CGSize *constrainSize, bool enableWrap, int overflow)
{
    NSSize textRect = NSZeroSize;
    textRect.width = constrainSize->width > 0 ? constrainSize->width
    : CGFLOAT_MAX;
    textRect.height = constrainSize->height > 0 ? constrainSize->height
    : CGFLOAT_MAX;
    
    if (overflow == 1) {
        if (!enableWrap) {
            textRect.width = CGFLOAT_MAX;
            textRect.height = CGFLOAT_MAX;
        } else {
            textRect.height = CGFLOAT_MAX;
        }
    }
    
    NSSize dim;
#ifdef __MAC_10_11
    #if __MAC_OS_X_VERSION_MAX_ALLOWED >= __MAC_10_11
    dim = [str boundingRectWithSize:textRect options:(NSStringDrawingOptions)(NSStringDrawingUsesLineFragmentOrigin) context:nil].size;
    #else
    dim = [str boundingRectWithSize:textRect options:(NSStringDrawingOptions)(NSStringDrawingUsesLineFragmentOrigin)].size;
    #endif
#else
    dim = [str boundingRectWithSize:textRect options:(NSStringDrawingOptions)(NSStringDrawingUsesLineFragmentOrigin)].size;
#endif
    
    
    dim.width = ceilf(dim.width);
    dim.height = ceilf(dim.height);

    return dim;
}

static NSSize _calculateShrinkedSizeForString(NSAttributedString **str,
                                              id font,
                                              NSSize
                                              constrainSize,
                                              bool enableWrap,
                                              int& newFontSize)
{
    CGRect actualSize = CGRectMake(0, 0, constrainSize.width + 1, constrainSize.height + 1);
    int fontSize = [font pointSize];
    fontSize = fontSize + 1;

    if (!enableWrap) {
        while (actualSize.size.width > constrainSize.width ||
               actualSize.size.height > constrainSize.height) {
            fontSize = fontSize - 1;
            if (fontSize < 0) {
                actualSize = CGRectMake(0, 0, 0, 0);
                break;
            }
            NSMutableAttributedString *mutableString = [[*str mutableCopy] autorelease];
            *str = __attributedStringWithFontSize(mutableString, fontSize);

#ifdef __MAC_10_11
    #if __MAC_OS_X_VERSION_MAX_ALLOWED >= __MAC_10_11
            CGSize fitSize = [*str boundingRectWithSize:CGSizeMake( CGFLOAT_MAX, CGFLOAT_MAX) options:NSStringDrawingUsesLineFragmentOrigin context:nil].size;
    #else
            CGSize fitSize = [*str boundingRectWithSize:CGSizeMake( CGFLOAT_MAX, CGFLOAT_MAX) options:NSStringDrawingUsesLineFragmentOrigin].size;
    #endif
#else
            CGSize fitSize = [*str boundingRectWithSize:CGSizeMake( CGFLOAT_MAX, CGFLOAT_MAX) options:NSStringDrawingUsesLineFragmentOrigin].size;
#endif

            if(fitSize.width == 0 || fitSize.height == 0) continue;
            actualSize.size = fitSize;

            if (constrainSize.width <= 0) {
                constrainSize.width = fitSize.width;
            }
            if (constrainSize.height <= 0){
                constrainSize.height = fitSize.height;
            }
            if(fontSize <= 0){
                break;
            }
        }

    }
    else {
        while (actualSize.size.height > constrainSize.height
               ||actualSize.size.width > constrainSize.width) {
            fontSize = fontSize - 1;
            if (fontSize < 0) {
                actualSize = CGRectMake(0, 0, 0, 0);
                break;
            }
            NSMutableAttributedString *mutableString = [[*str mutableCopy] autorelease];
            *str = __attributedStringWithFontSize(mutableString, fontSize);

#ifdef __MAC_10_11
    #if __MAC_OS_X_VERSION_MAX_ALLOWED >= __MAC_10_11
            CGSize fitSize = [*str boundingRectWithSize:CGSizeMake( constrainSize.width, CGFLOAT_MAX) options:NSStringDrawingUsesLineFragmentOrigin context:nil].size;
    #else
            CGSize fitSize = [*str boundingRectWithSize:CGSizeMake( constrainSize.width, CGFLOAT_MAX) options:NSStringDrawingUsesLineFragmentOrigin].size;
    #endif
#else
            CGSize fitSize = [*str boundingRectWithSize:CGSizeMake( constrainSize.width, CGFLOAT_MAX) options:NSStringDrawingUsesLineFragmentOrigin].size;
#endif
            
            if(fitSize.width == 0 || fitSize.height == 0) continue;
            actualSize.size = fitSize;
            
            if (constrainSize.width <= 0) {
                constrainSize.width = fitSize.width;
            }
            if (constrainSize.height <= 0){
                constrainSize.height = fitSize.height;
            }
            if(fontSize <= 0){
                break;
            }
        }

    }
    
    newFontSize = fontSize;

    return CGSizeMake(actualSize.size.width, actualSize.size.height);
}

static NSFont* _createSystemFont(const char* fontName, int size, bool enableBold)
{
    NSString * fntName = [NSString stringWithUTF8String:fontName];
    fntName = [[fntName lastPathComponent] stringByDeletingPathExtension];
    NSFontTraitMask mask = NSUnboldFontMask | NSUnitalicFontMask;
    if (enableBold) {
        mask = NSBoldFontMask | NSUnitalicFontMask;
    }
    // font
    NSFont *font = [[NSFontManager sharedFontManager]
                    fontWithFamily:fntName
                    traits:mask
                    weight:0
                    size:size];
    
    if (font == nil) {
        font = [[NSFontManager sharedFontManager]
                fontWithFamily:@"Arial"
                traits: mask
                weight:0
                size:size];
    }
    return font;
}


static CGFloat _calculateTextDrawStartHeight(cocos2d::Device::TextAlign align, CGSize realDimensions, CGSize dimensions)
{
    float startH = 0;
    // vertical alignment
    unsigned int vAlignment = ((int)align >> 4) & 0x0F;
    switch (vAlignment) {
            //bottom
        case 1:startH = dimensions.height - realDimensions.height;break;
            //top
        case 2:startH = 0;break;
            //center
        case 3: startH = (dimensions.height - realDimensions.height) / 2;break;
        default:
            break;
    }
    return startH;
}

static bool _initWithString(const char * text,
                            Device::TextAlign align,
                            const char * fontName,
                            int size,
                            tImageInfo* info,
                            bool enableWrap,
                            int overflow,
                            bool enableBold)
{
    bool ret = false;
    
    do {
        CC_BREAK_IF(! text || ! info);
        
        id font = _createSystemFont(fontName, size, enableBold);
        CC_BREAK_IF(!font);
        
        NSString * string  = [NSString stringWithUTF8String:text];
        CC_BREAK_IF(!string);
        
        
        CGSize dimensions = CGSizeMake(info->width, info->height);
        
        
        // alignment
        NSTextAlignment textAlign = FontUtils::_calculateTextAlignment(align);
        
        NSMutableParagraphStyle *paragraphStyle = FontUtils::_calculateParagraphStyle(enableWrap, overflow);
        [paragraphStyle setAlignment:textAlign];
        
        // color
        NSColor* foregroundColor = [NSColor colorWithRed:info->tintColorR
                                                   green:info->tintColorG
                                                    blue:info->tintColorB
                                                   alpha:info->tintColorA];

        
        // attribute
        NSMutableDictionary* tokenAttributesDict = [NSMutableDictionary dictionaryWithObjectsAndKeys:
                                             foregroundColor,NSForegroundColorAttributeName,
                                             font, NSFontAttributeName,
                                             
                                             paragraphStyle, NSParagraphStyleAttributeName, nil];
        
        NSAttributedString *stringWithAttributes =[[[NSAttributedString alloc] initWithString:string
                                                                                   attributes:tokenAttributesDict] autorelease];
        
        

        NSSize realDimensions;
        int shrinkFontSize = size;
        if (overflow == 2) {
            realDimensions = _calculateShrinkedSizeForString(&stringWithAttributes,
                                                         font,
                                                         dimensions,
                                                         enableWrap,
                                                         shrinkFontSize);
        } else {
            realDimensions = _calculateStringSize(stringWithAttributes,
                                                  font,
                                                  &dimensions,
                                                  enableWrap,
                                                  overflow);
        }
        

        // Mac crashes if the width or height is 0
        CC_BREAK_IF(realDimensions.width <= 0 || realDimensions.height <= 0);
        
       
        if(dimensions.width <= 0.f) {
            dimensions.width = realDimensions.width;
        }
        if (dimensions.height <= 0.f) {
            dimensions.height = realDimensions.height;
        }
        
        NSAttributedString *drawString = stringWithAttributes;
        
        if (info->hasStroke) {
            NSColor *strokeColor = [NSColor colorWithRed:info->strokeColorR
                                                   green:info->strokeColorG
                                                    blue:info->strokeColorB
                                                   alpha:info->strokeColorA];
            
            
            [tokenAttributesDict setObject:[NSNumber numberWithFloat: -info->strokeSize]
                                    forKey:NSStrokeWidthAttributeName];
            [tokenAttributesDict setObject:strokeColor forKey:NSStrokeColorAttributeName];
            
            drawString = [[[NSAttributedString alloc] initWithString:string
                                                           attributes:tokenAttributesDict] autorelease];
            if (overflow == 2) {
                _calculateShrinkedSizeForString(&drawString, font, dimensions, enableWrap, shrinkFontSize);
            }
        }
      
        
        //Alignment
        CGFloat xPadding = FontUtils::_calculateTextDrawStartWidth(align, realDimensions, dimensions);
        
        CGFloat yPadding = _calculateTextDrawStartHeight(align, realDimensions, dimensions);
        
        NSInteger POTWide = dimensions.width;
        NSInteger POTHigh = dimensions.height;
        NSRect textRect = NSMakeRect(xPadding, POTHigh - dimensions.height + yPadding,
                                     realDimensions.width, realDimensions.height);
        
        
        [[NSGraphicsContext currentContext] setShouldAntialias:NO];
        
        NSImage *image = [[NSImage alloc] initWithSize:NSMakeSize(POTWide, POTHigh)];
        [image lockFocus];
        // patch for mac retina display and lableTTF
        [[NSAffineTransform transform] set];
        [drawString drawInRect:textRect];
        NSBitmapImageRep *bitmap = [[NSBitmapImageRep alloc] initWithFocusedViewRect:NSMakeRect (0.0f, 0.0f, POTWide, POTHigh)];
        [image unlockFocus];
        
        auto data = (unsigned char*) [bitmap bitmapData];  //Use the same buffer to improve the performance.
        
        NSUInteger textureSize = POTWide * POTHigh * 4;
        auto dataNew = (unsigned char*)malloc(sizeof(unsigned char) * textureSize);
        if (dataNew) {
            memcpy(dataNew, data, textureSize);
            // output params
            info->width = static_cast<int>(POTWide);
            info->height = static_cast<int>(POTHigh);
            info->data = dataNew;
            info->isPremultipliedAlpha = true;
            ret = true;
        }
        [bitmap release];
        [image release];
    } while (0);
    return ret;
}

Data Device::getTextureDataForText(const char * text,
                                   const FontDefinition& textDefinition,
                                   TextAlign align,
                                   int &width,
                                   int &height,
                                   bool& hasPremultipliedAlpha)
{
    Data ret;
    do {
        tImageInfo info = {0};
        info.width = textDefinition._dimensions.width;
        info.height = textDefinition._dimensions.height;
        info.hasShadow              = textDefinition._shadow._shadowEnabled;
        info.shadowOffset.width     = textDefinition._shadow._shadowOffset.width;
        info.shadowOffset.height    = textDefinition._shadow._shadowOffset.height;
        info.shadowBlur             = textDefinition._shadow._shadowBlur;
        info.shadowOpacity          = textDefinition._shadow._shadowOpacity;
        info.hasStroke              = textDefinition._stroke._strokeEnabled;
        info.strokeColorR           = textDefinition._stroke._strokeColor.r / 255.0f;
        info.strokeColorG           = textDefinition._stroke._strokeColor.g / 255.0f;
        info.strokeColorB           = textDefinition._stroke._strokeColor.b / 255.0f;
        info.strokeColorA           = textDefinition._stroke._strokeAlpha / 255.0f;
        info.strokeSize             = textDefinition._stroke._strokeSize;
        info.tintColorR             = textDefinition._fontFillColor.r / 255.0f;
        info.tintColorG             = textDefinition._fontFillColor.g / 255.0f;
        info.tintColorB             = textDefinition._fontFillColor.b / 255.0f;
        info.tintColorA             = textDefinition._fontAlpha / 255.0f;


        if (! _initWithString(text,
                              align,
                              textDefinition._fontName.c_str(),
                              textDefinition._fontSize,
                              &info,
                              textDefinition._enableWrap,
                              textDefinition._overflow,
                              textDefinition._enableBold))
        {
            break;
        }
        height = (short)info.height;
        width = (short)info.width;
        ret.fastSet(info.data,width * height * 4);
        hasPremultipliedAlpha = true;
    } while (0);

    return ret;
}

void Device::setKeepScreenOn(bool value)
{
    CC_UNUSED_PARAM(value);
}

void Device::vibrate(float duration)
{
    CC_UNUSED_PARAM(duration);
}

float Device::getBatteryLevel()
{
    return 1.0f;
}

Device::NetworkType Device::getNetworkType()
{
    static Reachability* __reachability = nullptr;
    if (__reachability == nullptr)
    {
        __reachability = Reachability::createForInternetConnection();
        __reachability->retain();
    }

    NetworkType ret = NetworkType::NONE;
    Reachability::NetworkStatus status = __reachability->getCurrentReachabilityStatus();
    switch (status) {
        case Reachability::NetworkStatus::REACHABLE_VIA_WIFI:
            ret = NetworkType::LAN;
            break;
        case Reachability::NetworkStatus::REACHABLE_VIA_WWAN:
            ret = NetworkType::WWAN;
        default:
            ret = NetworkType::NONE;
            break;
    }

    return ret;
}

NS_CC_END

#endif // CC_TARGET_PLATFORM == CC_PLATFORM_MAC
