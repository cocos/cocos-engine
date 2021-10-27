
#include <iostream>

#include "platform/BasePlatform.h"

int main(int argc, const char * argv[]) {
    // cc::BasePlatform* platform = cc::BasePlatform::getPlatform();
    // if (platform->init()) {
    //     CC_LOG_FATAL("Platform initialization failed");
    //     return -1;
    // }
    // return platform->run(argc, argv);
    START_PLATFORM(argc, (const char**)argv);
}

/*
#import <UIKit/UIKit.h>

int main(int argc, char *argv[]) {
    NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];
    int retVal = UIApplicationMain(argc, argv, nil, @"AppDelegate");
    [pool release];
    return retVal;
}
 */
