/****************************************************************************
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "Reachability.h"
#include <SystemConfiguration/SystemConfiguration.h>
#include <arpa/inet.h>
#include <ifaddrs.h>
#include <netdb.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include "base/DeferredReleasePool.h"
#include "base/Macros.h"
#include "base/memory/Memory.h"

namespace {

#define ShouldPrintReachabilityFlags 0

static void PrintReachabilityFlags(SCNetworkReachabilityFlags flags, const char *comment) {
#if ShouldPrintReachabilityFlags

    printf("Reachability Flag Status: %c%c %c%c%c%c%c%c%c %s\n",
    #if CC_PLATFORM == CC_PLATFORM_IOS
           (flags & kSCNetworkReachabilityFlagsIsWWAN) ? 'W' : '-',
    #else
           '-',
    #endif
           (flags & kSCNetworkReachabilityFlagsReachable) ? 'R' : '-',

           (flags & kSCNetworkReachabilityFlagsTransientConnection) ? 't' : '-',
           (flags & kSCNetworkReachabilityFlagsConnectionRequired) ? 'c' : '-',
           (flags & kSCNetworkReachabilityFlagsConnectionOnTraffic) ? 'C' : '-',
           (flags & kSCNetworkReachabilityFlagsInterventionRequired) ? 'i' : '-',
           (flags & kSCNetworkReachabilityFlagsConnectionOnDemand) ? 'D' : '-',
           (flags & kSCNetworkReachabilityFlagsIsLocalAddress) ? 'l' : '-',
           (flags & kSCNetworkReachabilityFlagsIsDirect) ? 'd' : '-',
           comment);
#endif
}

cc::Reachability::NetworkStatus getNetworkStatusForFlags(SCNetworkReachabilityFlags flags) {
    PrintReachabilityFlags(flags, "networkStatusForFlags");
    if ((flags & kSCNetworkReachabilityFlagsReachable) == 0) {
        // The target host is not reachable.
        return cc::Reachability::NetworkStatus::NOT_REACHABLE;
    }

    cc::Reachability::NetworkStatus returnValue = cc::Reachability::NetworkStatus::NOT_REACHABLE;

    if ((flags & kSCNetworkReachabilityFlagsConnectionRequired) == 0) {
        /*
             If the target host is reachable and no connection is required then we'll assume (for now) that you're on Wi-Fi...
             */
        returnValue = cc::Reachability::NetworkStatus::REACHABLE_VIA_WIFI;
    }

    if ((((flags & kSCNetworkReachabilityFlagsConnectionOnDemand) != 0) ||
         (flags & kSCNetworkReachabilityFlagsConnectionOnTraffic) != 0)) {
        /*
             ... and the connection is on-demand (or on-traffic) if the calling application is using the CFSocketStream or higher APIs...
             */

        if ((flags & kSCNetworkReachabilityFlagsInterventionRequired) == 0) {
            /*
                 ... and no [user] intervention is needed...
                 */
            returnValue = cc::Reachability::NetworkStatus::REACHABLE_VIA_WIFI;
        }
    }

#if CC_PLATFORM == CC_PLATFORM_IOS
    if ((flags & kSCNetworkReachabilityFlagsIsWWAN) == kSCNetworkReachabilityFlagsIsWWAN) {
        /*
             ... but WWAN connections are OK if the calling application is using the CFNetwork APIs.
             */
        returnValue = cc::Reachability::NetworkStatus::REACHABLE_VIA_WWAN;
    }
#endif

    return returnValue;
}
} // namespace

namespace cc {

Reachability *Reachability::createWithHostName(const ccstd::string &hostName) {
    Reachability *returnValue = nullptr;
    SCNetworkReachabilityRef reachability = SCNetworkReachabilityCreateWithName(nullptr, hostName.c_str());
    if (reachability != nullptr) {
        returnValue = ccnew Reachability();
        returnValue->addRef();
        if (returnValue != nullptr) {
            cc::DeferredReleasePool::add(returnValue);
            returnValue->_reachabilityRef = reachability;
        } else {
            CFRelease(reachability);
        }
    }
    return returnValue;
}

Reachability *Reachability::createWithAddress(const struct sockaddr *hostAddress) {
    SCNetworkReachabilityRef reachability = SCNetworkReachabilityCreateWithAddress(kCFAllocatorDefault, hostAddress);

    Reachability *returnValue = nullptr;

    if (reachability != nullptr) {
        returnValue = ccnew Reachability();
        returnValue->addRef();
        if (returnValue != nullptr) {
            cc::DeferredReleasePool::add(returnValue);
            returnValue->_reachabilityRef = reachability;
        } else {
            CFRelease(reachability);
        }
    }
    return returnValue;
}

Reachability *Reachability::createForInternetConnection() {
    struct sockaddr_in zeroAddress;
    bzero(&zeroAddress, sizeof(zeroAddress));
    zeroAddress.sin_len = sizeof(zeroAddress);
    zeroAddress.sin_family = AF_INET;

    return createWithAddress((const struct sockaddr *)&zeroAddress);
}

Reachability::Reachability()
: _callback(nullptr),
  _userData(nullptr),
  _reachabilityRef(nullptr) {
}

Reachability::~Reachability() {
    stopNotifier();
    if (_reachabilityRef != nullptr) {
        CFRelease(_reachabilityRef);
    }
}

void Reachability::onReachabilityCallback(SCNetworkReachabilityRef target, SCNetworkReachabilityFlags flags, void *info) {
    CC_ASSERT_NOT_NULL(info);

    cc::Reachability *thiz = reinterpret_cast<cc::Reachability *>(info);
    if (thiz->_callback != nullptr) {
        NetworkStatus status = getNetworkStatusForFlags(flags);
        thiz->_callback(thiz, status, thiz->_userData);
    }
}

bool Reachability::startNotifier(const ReachabilityCallback &cb, void *userData) {
    _callback = cb;
    _userData = userData;

    bool returnValue = false;
    SCNetworkReachabilityContext context = {0, this, nullptr, nullptr, nullptr};

    if (SCNetworkReachabilitySetCallback(_reachabilityRef, onReachabilityCallback, &context)) {
        if (SCNetworkReachabilityScheduleWithRunLoop(_reachabilityRef, CFRunLoopGetCurrent(), kCFRunLoopDefaultMode)) {
            returnValue = true;
        }
    }

    return returnValue;
}

void Reachability::stopNotifier() {
    if (_reachabilityRef != nullptr) {
        SCNetworkReachabilityUnscheduleFromRunLoop(_reachabilityRef, CFRunLoopGetCurrent(), kCFRunLoopDefaultMode);
    }
}

bool Reachability::isConnectionRequired() const {
    CC_ASSERT_NOT_NULL(_reachabilityRef);
    SCNetworkReachabilityFlags flags;

    if (SCNetworkReachabilityGetFlags(_reachabilityRef, &flags)) {
        return (flags & kSCNetworkReachabilityFlagsConnectionRequired);
    }

    return false;
}

Reachability::NetworkStatus Reachability::getCurrentReachabilityStatus() const {
    CC_ASSERT_NOT_NULL(_reachabilityRef);
    NetworkStatus returnValue = NetworkStatus::NOT_REACHABLE;
    SCNetworkReachabilityFlags flags;

    if (SCNetworkReachabilityGetFlags(_reachabilityRef, &flags)) {
        returnValue = getNetworkStatusForFlags(flags);
    }

    return returnValue;
}

} // namespace cc
