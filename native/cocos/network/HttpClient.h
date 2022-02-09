/****************************************************************************
 Copyright (c) 2012 greathqy
 Copyright (c) 2012 cocos2d-x.org
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

#pragma once

#include <condition_variable>
#include <thread>
#include "base/Vector.h"
#include "network/HttpCookie.h"
#include "network/HttpRequest.h"
#include "network/HttpResponse.h"

/**
 * @addtogroup network
 * @{
 */

namespace cc {
class Scheduler;
namespace network {

/** Singleton that handles asynchronous http requests.
 *
 * Once the request completed, a callback will issued in main thread when it provided during make request.
 *
 * @lua NA
 */
class CC_DLL HttpClient {
public:
    /**
    * The buffer size of _responseMessage
    */
    static const int RESPONSE_BUFFER_SIZE = 256;

    /**
     * Get instance of HttpClient.
     *
     * @return the instance of HttpClient.
     */
    static HttpClient *getInstance();

    /**
     * Release the instance of HttpClient.
     */
    static void destroyInstance();

    /**
     * Enable cookie support.
     *
     * @param cookieFile the filepath of cookie file.
     */
    void enableCookies(const char *cookieFile);

    /**
     * Get the cookie filename
     *
     * @return the cookie filename
     */
    const std::string &getCookieFilename();

    /**
     * Set root certificate path for SSL verification.
     *
     * @param caFile a full path of root certificate.if it is empty, SSL verification is disabled.
     */
    void setSSLVerification(const std::string &caFile);

    /**
     * Get the ssl CA filename
     *
     * @return the ssl CA filename
     */
    const std::string &getSSLVerification();

    /**
     * Add a get request to task queue
     *
     * @param request a HttpRequest object, which includes url, response callback etc.
                      please make sure request->_requestData is clear before calling "send" here.
     */
    void send(HttpRequest *request);

    /**
     * Immediate send a request
     *
     * @param request a HttpRequest object, which includes url, response callback etc.
                      please make sure request->_requestData is clear before calling "sendImmediate" here.
     */
    void sendImmediate(HttpRequest *request);

    /**
     * Set the timeout value for connecting.
     *
     * @param value the timeout value for connecting.
     * @deprecated Please use `HttpRequest.setTimeout` instead.
     */
    CC_DEPRECATED_ATTRIBUTE void setTimeoutForConnect(int value);

    /**
     * Get the timeout value for connecting.
     *
     * @return int the timeout value for connecting.
     * @deprecated Please use `HttpRequest.getTimeout` instead.
     */
    CC_DEPRECATED_ATTRIBUTE int getTimeoutForConnect();

    /**
     * Set the timeout value for reading.
     *
     * @param value the timeout value for reading.
     * @deprecated Please use `HttpRequest.setTimeout` instead.
     */
    CC_DEPRECATED_ATTRIBUTE void setTimeoutForRead(int value);

    /**
     * Get the timeout value for reading.
     *
     * @return int the timeout value for reading.
     * @deprecated Please use `HttpRequest.setTimeout` instead.
     */
    CC_DEPRECATED_ATTRIBUTE int getTimeoutForRead();

    HttpCookie *getCookie() const { return _cookie; }

    std::mutex &getCookieFileMutex() { return _cookieFileMutex; }

    std::mutex &getSSLCaFileMutex() { return _sslCaFileMutex; }

private:
    HttpClient();
    virtual ~HttpClient();
    bool init();

    /**
     * Init pthread mutex, semaphore, and create new thread for http requests
     * @return bool
     */
    bool lazyInitThreadSemaphore();
    void networkThread();
    void networkThreadAlone(HttpRequest *request, HttpResponse *response);
    /** Poll function called from main thread to dispatch callbacks when http requests finished **/
    void dispatchResponseCallbacks();

    void processResponse(HttpResponse *response, char *responseMessage);
    void increaseThreadCount();
    void decreaseThreadCountAndMayDeleteThis();

private: // NOLINT(readability-redundant-access-specifiers)
    bool _isInited;

    int        _timeoutForConnect;
    std::mutex _timeoutForConnectMutex;

    int        _timeoutForRead;
    std::mutex _timeoutForReadMutex;

    int        _threadCount;
    std::mutex _threadCountMutex;

    std::weak_ptr<Scheduler> _scheduler;
    std::mutex               _schedulerMutex;

    Vector<HttpRequest *> _requestQueue;
    std::mutex            _requestQueueMutex;

    Vector<HttpResponse *> _responseQueue;
    std::mutex             _responseQueueMutex;

    std::string _cookieFilename;
    std::mutex  _cookieFileMutex;

    std::string _sslCaFilename;
    std::mutex  _sslCaFileMutex;

    HttpCookie *_cookie;

    std::condition_variable_any _sleepCondition;

    char _responseMessage[RESPONSE_BUFFER_SIZE];

    HttpRequest *_requestSentinel;
};

} // namespace network

} // namespace cc

// end group
/// @}
