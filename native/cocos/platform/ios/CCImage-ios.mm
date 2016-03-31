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
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS

#import "platform/CCImage.h"
#import "platform/CCCommon.h"
#import <string>

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#include <math.h>

NS_CC_BEGIN

bool cocos2d::Image::saveToFile(const std::string& filename, bool isToRGB)
{
    bool saveToPNG = false;
    bool needToCopyPixels = false;

    std::string basename(filename);
    std::transform(basename.begin(), basename.end(), basename.begin(), ::tolower);
    if (std::string::npos != basename.find(".png"))
    {
        saveToPNG = true;
    }

    int bitsPerComponent = 8;
    int bitsPerPixel = hasAlpha() ? 32 : 24;
    if ((! saveToPNG) || isToRGB)
    {
        bitsPerPixel = 24;
    }

    int bytesPerRow    = (bitsPerPixel/8) * _width;
    int myDataLength = bytesPerRow * _height;

    unsigned char *pixels    = _data;

    // The data has alpha channel, and want to save it with an RGB png file,
    // or want to save as jpg,  remove the alpha channel.
    if (hasAlpha() && bitsPerPixel == 24)
    {
        pixels = new (std::nothrow) unsigned char[myDataLength];

        for (int i = 0; i < _height; ++i)
        {
            for (int j = 0; j < _width; ++j)
            {
                pixels[(i * _width + j) * 3] = _data[(i * _width + j) * 4];
                pixels[(i * _width + j) * 3 + 1] = _data[(i * _width + j) * 4 + 1];
                pixels[(i * _width + j) * 3 + 2] = _data[(i * _width + j) * 4 + 2];
            }
        }

        needToCopyPixels = true;
    }

    // make data provider with data.
    CGBitmapInfo bitmapInfo = kCGBitmapByteOrderDefault;
    if (saveToPNG && hasAlpha() && (! isToRGB))
    {
        bitmapInfo |= kCGImageAlphaPremultipliedLast;
    }
    CGDataProviderRef provider        = CGDataProviderCreateWithData(nullptr, pixels, myDataLength, nullptr);
    CGColorSpaceRef colorSpaceRef    = CGColorSpaceCreateDeviceRGB();
    CGImageRef iref                    = CGImageCreate(_width, _height,
                                                        bitsPerComponent, bitsPerPixel, bytesPerRow,
                                                        colorSpaceRef, bitmapInfo, provider,
                                                        nullptr, false,
                                                        kCGRenderingIntentDefault);

    UIImage* image                    = [[UIImage alloc] initWithCGImage:iref];

    CGImageRelease(iref);
    CGColorSpaceRelease(colorSpaceRef);
    CGDataProviderRelease(provider);

    NSData *data;

    if (saveToPNG)
    {
        data = UIImagePNGRepresentation(image);
    }
    else
    {
        data = UIImageJPEGRepresentation(image, 1.0f);
    }

    [data writeToFile:[NSString stringWithUTF8String:filename.c_str()] atomically:YES];

    [image release];

    if (needToCopyPixels)
    {
        delete [] pixels;
    }

    return true;
}

bool cocos2d::Image::initWithJpgData(const unsigned char *  data, ssize_t dataLen)
{
    return initWithPngData(data, dataLen);
}

bool cocos2d::Image::initWithTiffData(const unsigned char * data, ssize_t dataLen)
{
    return initWithPngData(data, dataLen);
}

bool cocos2d::Image::initWithPngData(const unsigned char * data, ssize_t dataLen)
{
    // create CGImage and get CGImageRef
    NSData *nsData = [NSData dataWithBytes:data length:dataLen];
    UIImage *uiImage = [UIImage imageWithData:nsData];
    if (!uiImage)
        return false;

    // get width and height
    CGImageRef cgimageRef = uiImage.CGImage;
    _width = (int)CGImageGetWidth(cgimageRef);
    _height = (int)CGImageGetHeight(cgimageRef);

    // get data length and data
    CFDataRef rawData = CGDataProviderCopyData(CGImageGetDataProvider(cgimageRef));
    _dataLen = CFDataGetLength(rawData);
    _data = static_cast<unsigned char*>(malloc(_dataLen * sizeof(unsigned char)));
    CFDataGetBytes(rawData, CFRangeMake(0, _dataLen), _data);
    CFRelease(rawData);

    // check if it is alpha premultified
    CGImageAlphaInfo alphaInfo = CGImageGetAlphaInfo(cgimageRef);
    _hasPremultipliedAlpha = alphaInfo == kCGImageAlphaPremultipliedLast || alphaInfo == kCGImageAlphaPremultipliedFirst;

    // get render format
    size_t bitsPerComponent = CGImageGetBitsPerComponent(cgimageRef);
    size_t bitsPerPixel = CGImageGetBitsPerPixel(cgimageRef);
    size_t channels = bitsPerPixel / bitsPerComponent;
    bool   hasAlpha = ((alphaInfo == kCGImageAlphaPremultipliedLast) ||
                       (alphaInfo == kCGImageAlphaPremultipliedFirst) ||
                       (alphaInfo == kCGImageAlphaLast) ||
                       (alphaInfo == kCGImageAlphaFirst)
                      ? true : false);

    CGColorSpaceRef colorSpace = CGImageGetColorSpace(cgimageRef);
    if (colorSpace)
    {
        switch (CGColorSpaceGetModel(colorSpace))
        {
            case kCGColorSpaceModelMonochrome:
                if (hasAlpha && channels == 2 && bitsPerComponent == 8)
                {
                    _renderFormat = cocos2d::Texture2D::PixelFormat::AI88;
                    break;
                }
                // other situations continue
            case kCGColorSpaceModelRGB:
                if (hasAlpha && channels == 4 && bitsPerComponent == 8)
                {
                    _renderFormat = cocos2d::Texture2D::PixelFormat::RGBA8888;
                    break;
                }
                if (!hasAlpha && channels == 3 && bitsPerComponent == 8)
                {
                    _renderFormat = cocos2d::Texture2D::PixelFormat::RGB888;
                    break;
                }
                // other situations continue
            default:
            {
                colorSpace = CGColorSpaceCreateDeviceRGB();
                free(_data);
                _data = static_cast<unsigned char*>(malloc(_height * _width * 4));
                CGContextRef context = CGBitmapContextCreate(_data, _width, _height, 8, 4 * _width, colorSpace, kCGImageAlphaPremultipliedLast);
                CGColorSpaceRelease(colorSpace);
                CGContextClearRect(context, CGRectMake(0, 0, _width, _height));
                CGContextTranslateCTM(context, 0, 0);
                CGContextDrawImage(context, CGRectMake(0, 0, _width, _height), cgimageRef);
                CGContextRelease(context);

                _renderFormat = cocos2d::Texture2D::PixelFormat::RGBA8888;
                _hasPremultipliedAlpha = true;
                break;
            }
        }
    }
    else
    {
        // it is a mask
        _renderFormat = cocos2d::Texture2D::PixelFormat::A8;
    }


    return true;
}

NS_CC_END

#endif // CC_PLATFORM_IOS

