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
#include "platform/ios/modules/Network.h"
#include <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#include "platform/apple/Reachability.h"

namespace cc {

INetwork::NetworkType Network::getNetworkType() const {
    static Reachability *__reachability = nullptr;
    if (__reachability == nullptr) {
        __reachability = Reachability::createForInternetConnection();
        __reachability->addRef();
    }

    NetworkType                 ret    = NetworkType::NONE;
    Reachability::NetworkStatus status = __reachability->getCurrentReachabilityStatus();
    switch (status) {
        case Reachability::NetworkStatus::REACHABLE_VIA_WIFI:
            ret = NetworkType::LAN;
            break;
        case Reachability::NetworkStatus::REACHABLE_VIA_WWAN:
            ret = NetworkType::WWAN;
            break;
        default:
            ret = NetworkType::NONE;
            break;
    }

    return ret;
}

} // namespace cc
