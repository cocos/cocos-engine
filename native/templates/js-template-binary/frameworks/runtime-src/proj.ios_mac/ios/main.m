//
//  main.m
//  simulator
//
//  Copyright __MyCompanyName__ 2011. All rights reserved.
//

#import <UIKit/UIKit.h>

// Hack for binary template.
// It's because cocos2d libraries may be compiled with iOS SDK (>=10.0),
// and there is code of sdk version check in SocketRocket which will trigger 'undefined reference of
// NSStreamNetworkServiceTypeCallSignaling' error while linking. Define a same variable in binrary
// template if SDK version is lower than macOS10.12, iOS10, tvOS10, watchOS3 will be a workaround.
// Please note that, this issue will not exist in 'default' & 'link' template.
#if (__MAC_OS_X_VERSION_MAX_ALLOWED >= 101200 || __IPHONE_OS_VERSION_MAX_ALLOWED >= 100000 || __TV_OS_VERSION_MAX_ALLOWED >= 100000 || __WATCH_OS_VERSION_MAX_ALLOWED >= 30000)
#else
NSString* NSStreamNetworkServiceTypeCallSignaling = @"kCFStreamNetworkServiceTypeCallSignaling";
#endif

int main(int argc, char *argv[]) {
    
    NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];
    int retVal = UIApplicationMain(argc, argv, nil, @"AppController");
    [pool release];
    return retVal;
}
