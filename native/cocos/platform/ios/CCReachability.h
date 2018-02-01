/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
#pragma once

#include "base/CCRef.h"

#include <string>
#include <functional>
#include <SystemConfiguration/SystemConfiguration.h>

struct sockaddr;

NS_CC_BEGIN

class Reachability final : public Ref
{
public:
    enum class NetworkStatus : uint8_t
    {
        NOT_REACHABLE,
        REACHABLE_VIA_WIFI,
        REACHABLE_VIA_WWAN
    };

    /*!
     * Use to check the reachability of a given host name.
     */
    static Reachability* createWithHostName(const std::string& hostName);

    /*!
     * Use to check the reachability of a given IP address.
     */
    static Reachability* createWithAddress(const struct sockaddr* hostAddress);

    /*!
     * Checks whether the default route is available. Should be used by applications that do not connect to a particular host.
     */
    static Reachability* createForInternetConnection();

    using ReachabilityCallback = std::function<void(Reachability*, NetworkStatus, void*)>;

    /*!
     * Start listening for reachability notifications on the current run loop.
     */
    bool startNotifier(const ReachabilityCallback& cb, void* userData);
    void stopNotifier();

    NetworkStatus getCurrentReachabilityStatus()const;

    /*!
     * WWAN may be available, but not active until a connection has been established. WiFi may require a connection for VPN on Demand.
     */
    bool isConnectionRequired() const;

private:

    Reachability();
    ~Reachability();

    static void onReachabilityCallback(SCNetworkReachabilityRef target, SCNetworkReachabilityFlags flags, void* info);

    ReachabilityCallback _callback;
    void* _userData;
    SCNetworkReachabilityRef _reachabilityRef;
};

NS_CC_END

