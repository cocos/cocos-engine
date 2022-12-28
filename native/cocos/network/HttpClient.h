/****************************************************************************
 Copyright (c) 2012 greathqy
 Copyright (c) 2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

#pragma once

#include <condition_variable>
#include <thread>
#include "base/RefVector.h"
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
    const ccstd::string &getCookieFilename();

    /**
     * Set root certificate path for SSL verification.
     *
     * @param caFile a full path of root certificate.if it is empty, SSL verification is disabled.
     */
    void setSSLVerification(const ccstd::string &caFile);

    /**
     * Get the ssl CA filename
     *
     * @return the ssl CA filename
     */
    const ccstd::string &getSSLVerification();

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

    int _timeoutForConnect;
    std::mutex _timeoutForConnectMutex;

    int _timeoutForRead;
    std::mutex _timeoutForReadMutex;

    int _threadCount;
    std::mutex _threadCountMutex;

    std::weak_ptr<Scheduler> _scheduler;
    std::mutex _schedulerMutex;

    RefVector<HttpRequest *> _requestQueue;
    std::mutex _requestQueueMutex;

    RefVector<HttpResponse *> _responseQueue;
    std::mutex _responseQueueMutex;

    ccstd::string _cookieFilename;
    std::mutex _cookieFileMutex;

    ccstd::string _sslCaFilename;
    std::mutex _sslCaFileMutex;

    HttpCookie *_cookie;

    std::condition_variable_any _sleepCondition;

    char _responseMessage[RESPONSE_BUFFER_SIZE];

    HttpRequest *_requestSentinel;
};

} // namespace network

} // namespace cc

// end group
/// @}
