/****************************************************************************
 Copyright (c) 2010 cocos2d-x.org
 
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

#include "AppDelegate.h"
#include "cocos2d.h"

USING_NS_CC;

// Hack for binary template.
// It's because cocos2d libraries may be compiled with macOS SDK (>=10.12),
// and there is code of sdk version check in SocketRocket which will trigger 'undefined reference of
// NSStreamNetworkServiceTypeCallSignaling' error while linking. Define a same variable in binrary
// template if SDK version is lower than macOS10.12, iOS10, tvOS10, watchOS3 will be a workaround.
// Please note that, this issue will not exist in 'default' & 'link' template.
#if (__MAC_OS_X_VERSION_MAX_ALLOWED >= 101200 || __IPHONE_OS_VERSION_MAX_ALLOWED >= 100000 || __TV_OS_VERSION_MAX_ALLOWED >= 100000 || __WATCH_OS_VERSION_MAX_ALLOWED >= 30000)
#else
NSString* NSStreamNetworkServiceTypeCallSignaling = @"kCFStreamNetworkServiceTypeCallSignaling";
#endif

int main(int argc, char *argv[])
{
    AppDelegate app;
    return Application::getInstance()->run();
}
