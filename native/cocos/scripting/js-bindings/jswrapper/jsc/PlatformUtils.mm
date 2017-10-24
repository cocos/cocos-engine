#include "PlatformUtils.h"
#include "../config.hpp"

#if defined(__APPLE__)
#include <TargetConditionals.h>
#endif

#if TARGET_OS_IPHONE
#import <UIKit/UIKit.h>
#elif TARGET_OS_MAC
#import <Foundation/Foundation.h>
#endif

namespace se {

    bool isSupportTypedArrayAPI()
    {
#if TARGET_OS_IPHONE
        float version = [[UIDevice currentDevice].systemVersion floatValue];
        if (version >= 10.0)
            return true;
#elif TARGET_OS_MAC
        NSOperatingSystemVersion minimumSupportedOSVersion = { .majorVersion = 10, .minorVersion = 12, .patchVersion = 0 };
        return [NSProcessInfo.processInfo isOperatingSystemAtLeastVersion:minimumSupportedOSVersion] ? true : false;
#else
        LOGE("isSupportTypedArrayAPI: Unknown system!");
#endif

        return false;
    }

} // namespace se
