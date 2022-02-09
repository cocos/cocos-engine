/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#ifndef __HTTPASYNCONNECTION_H__
#define __HTTPASYNCONNECTION_H__
/// @cond DO_NOT_SHOW

#if (CC_PLATFORM == CC_PLATFORM_MAC_OSX) || (CC_PLATFORM == CC_PLATFORM_MAC_IOS)

    #import <Foundation/Foundation.h>
    #import <Security/Security.h>
/// @cond
@interface HttpAsynConnection : NSObject <NSURLConnectionDelegate, NSURLConnectionDataDelegate> {
}

// The original URL to download.  Due to redirects the actual content may come from another URL
@property (strong) NSString *srcURL;

@property (strong) NSString *sslFile;

@property (copy) NSDictionary *responseHeader;

@property (strong) NSMutableData *responseData;

@property (readonly) NSInteger getDataTime;

@property (readonly) NSInteger responseCode;
@property (readonly) NSString *statusString;

@property (strong) NSError *responseError;
@property (strong) NSError *connError;

@property (strong) NSURLConnection *conn;

@property bool finish;

@property (strong) NSRunLoop *runLoop;

// instructs the class to start the request.
- (void)startRequest:(NSURLRequest *)request;

@end

#endif // #if (CC_PLATFORM == CC_PLATFORM_MAC_OSX) || (CC_PLATFORM == CC_PLATFORM_MAC_IOS)

/// @endcond
#endif //__HTTPASYNCONNECTION_H__
