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

#include "network/HttpClient.h"

#include <errno.h>

#import "network/HttpAsynConnection-apple.h"
#include "network/HttpCookie.h"
#include "platform/FileUtils.h"
#include "application/ApplicationManager.h"
#include "base/Scheduler.h"
#include "base/memory/Memory.h"
#include "base/ThreadPool.h"

namespace cc {

namespace network {

static HttpClient *_httpClient = nullptr; // pointer to singleton
static LegacyThreadPool *gThreadPool = nullptr;

static int processTask(HttpClient *client, HttpRequest *request, NSString *requestType, void *stream, long *errorCode, void *headerStream, char *errorBuffer);

// Worker thread
void HttpClient::networkThread() {
    increaseThreadCount();

    while (true) @autoreleasepool {
            HttpRequest *request;

            // step 1: send http request if the requestQueue isn't empty
            {
                std::lock_guard<std::mutex> lock(_requestQueueMutex);
                while (_requestQueue.empty()) {
                    _sleepCondition.wait(_requestQueueMutex);
                }
                request = _requestQueue.at(0);
                _requestQueue.erase(0);
            }

            if (request == _requestSentinel) {
                break;
            }

            // Create a HttpResponse object, the default setting is http access failed
            HttpResponse *response = ccnew HttpResponse(request);
            response->addRef();

            processResponse(response, _responseMessage);

            // add response packet into queue
            _responseQueueMutex.lock();
            _responseQueue.pushBack(response);
            _responseQueueMutex.unlock();

            _schedulerMutex.lock();
            if (auto sche = _scheduler.lock()) {
                sche->performFunctionInCocosThread(CC_CALLBACK_0(HttpClient::dispatchResponseCallbacks, this));
            }
            _schedulerMutex.unlock();
        }

    // cleanup: if worker thread received quit signal, clean up un-completed request queue
    _requestQueueMutex.lock();
    _requestQueue.clear();
    _requestQueueMutex.unlock();

    _responseQueueMutex.lock();
    _responseQueue.clear();
    _responseQueueMutex.unlock();

    decreaseThreadCountAndMayDeleteThis();
}

// Worker thread
void HttpClient::networkThreadAlone(HttpRequest *request, HttpResponse *response) {
    increaseThreadCount();

    char responseMessage[RESPONSE_BUFFER_SIZE] = {0};
    processResponse(response, responseMessage);

    _schedulerMutex.lock();
    if (auto sche = _scheduler.lock()) {
        sche->performFunctionInCocosThread([this, response, request] {
            const ccHttpRequestCallback &callback = request->getResponseCallback();

            if (callback != nullptr) {
                callback(this, response);
            }

            response->release();
            // do not release in other thread
            request->release();
        });
    }
    _schedulerMutex.unlock();
    decreaseThreadCountAndMayDeleteThis();
}

//Process Request
static int processTask(HttpClient *client, HttpRequest *request, NSString *requestType, void *stream, long *responseCode, void *headerStream, char *errorBuffer) {
    if (nullptr == client) {
        strcpy(errorBuffer, "client object is invalid");
        return 0;
    }

    //create request with url
    NSString *urlstring = [NSString stringWithUTF8String:request->getUrl()];
    NSURL *url = [NSURL URLWithString:urlstring];

    NSMutableURLRequest *nsrequest = [NSMutableURLRequest requestWithURL:url
                                                             cachePolicy:NSURLRequestReloadIgnoringLocalAndRemoteCacheData
                                                         timeoutInterval:request->getTimeout()];

    //set request type
    [nsrequest setHTTPMethod:requestType];

    /* get custom header data (if set) */
    ccstd::vector<ccstd::string> headers = request->getHeaders();
    if (!headers.empty()) {
        /* append custom headers one by one */
        for (auto &header : headers) {
            unsigned long i = header.find(':', 0);
            unsigned long length = header.size();
            ccstd::string field = header.substr(0, i);
            ccstd::string value = header.substr(i + 1);
            // trim \n at the end of the string
            if (!value.empty() && value[value.size() - 1] == '\n') {
                value.erase(value.size() - 1);
            }
            // trim leading space (header is field: value format)
            if (!value.empty() && value[0] == ' ') {
                value.erase(0, 1);
            }
            NSString *headerField = [NSString stringWithUTF8String:field.c_str()];
            NSString *headerValue = [NSString stringWithUTF8String:value.c_str()];
            [nsrequest setValue:headerValue forHTTPHeaderField:headerField];
        }
    }

    //if request type is post or put,set header and data
    if ([requestType isEqual:@"POST"] || [requestType isEqual:@"PUT"]) {
        char *requestDataBuffer = request->getRequestData();
        if (nullptr != requestDataBuffer && 0 != request->getRequestDataSize()) {
            NSData *postData = [NSData dataWithBytes:requestDataBuffer length:request->getRequestDataSize()];
            [nsrequest setHTTPBody:postData];
        }
    }

    //read cookie properties from file and set cookie
    ccstd::string cookieFilename = client->getCookieFilename();
    if (!cookieFilename.empty() && nullptr != client->getCookie()) {
        const CookiesInfo *cookieInfo = client->getCookie()->getMatchCookie(request->getUrl());
        if (cookieInfo != nullptr) {
            NSString *domain = [NSString stringWithCString:cookieInfo->domain.c_str() encoding:[NSString defaultCStringEncoding]];
            NSString *path = [NSString stringWithCString:cookieInfo->path.c_str() encoding:[NSString defaultCStringEncoding]];
            NSString *value = [NSString stringWithCString:cookieInfo->value.c_str() encoding:[NSString defaultCStringEncoding]];
            NSString *name = [NSString stringWithCString:cookieInfo->name.c_str() encoding:[NSString defaultCStringEncoding]];

            // create the properties for a cookie
            NSDictionary *properties = [NSDictionary dictionaryWithObjectsAndKeys:name, NSHTTPCookieName,
                                                                                  value, NSHTTPCookieValue, path, NSHTTPCookiePath,
                                                                                  domain, NSHTTPCookieDomain,
                                                                                  nil];

            // create the cookie from the properties
            NSHTTPCookie *cookie = [NSHTTPCookie cookieWithProperties:properties];

            // add the cookie to the cookie storage
            [[NSHTTPCookieStorage sharedHTTPCookieStorage] setCookie:cookie];
        }
    }

    HttpAsynConnection *httpAsynConn = [[HttpAsynConnection new] autorelease];
    httpAsynConn.srcURL = urlstring;
    httpAsynConn.sslFile = nil;

    ccstd::string sslCaFileName = client->getSSLVerification();
    if (!sslCaFileName.empty()) {
        long len = sslCaFileName.length();
        long pos = sslCaFileName.rfind('.', len - 1);

        httpAsynConn.sslFile = [NSString stringWithUTF8String:sslCaFileName.substr(0, pos).c_str()];
    }
    [httpAsynConn startRequest:nsrequest];

    while (httpAsynConn.finish != true) {
        [[NSRunLoop currentRunLoop] runMode:NSDefaultRunLoopMode beforeDate:[NSDate distantFuture]];
    }

    //if http connection return error
    if (httpAsynConn.connError != nil) {
        NSString *errorString = [httpAsynConn.connError localizedDescription];
        strcpy(errorBuffer, [errorString UTF8String]);
        return 0;
    }

    //if http response got error, just log the error
    if (httpAsynConn.responseError != nil) {
        NSString *errorString = [httpAsynConn.responseError localizedDescription];
        strcpy(errorBuffer, [errorString UTF8String]);
    }

    *responseCode = httpAsynConn.responseCode;

    //add cookie to cookies vector
    if (!cookieFilename.empty()) {
        NSArray *cookies = [NSHTTPCookie cookiesWithResponseHeaderFields:httpAsynConn.responseHeader forURL:url];
        for (NSHTTPCookie *cookie in cookies) {
            //NSLog(@"Cookie: %@", cookie);
            NSString *domain = cookie.domain;
            //BOOL session = cookie.sessionOnly;
            NSString *path = cookie.path;
            BOOL secure = cookie.isSecure;
            NSDate *date = cookie.expiresDate;
            NSString *name = cookie.name;
            NSString *value = cookie.value;

            CookiesInfo cookieInfo;
            cookieInfo.domain = [domain cStringUsingEncoding:NSUTF8StringEncoding];
            cookieInfo.path = [path cStringUsingEncoding:NSUTF8StringEncoding];
            cookieInfo.secure = (secure == YES) ? true : false;
            cookieInfo.expires = [[NSString stringWithFormat:@"%ld", (long)[date timeIntervalSince1970]] cStringUsingEncoding:NSUTF8StringEncoding];
            cookieInfo.name = [name cStringUsingEncoding:NSUTF8StringEncoding];
            cookieInfo.value = [value cStringUsingEncoding:NSUTF8StringEncoding];
            cookieInfo.tailmatch = true;

            client->getCookie()->updateOrAddCookie(&cookieInfo);
        }
    }

    //handle response header
    NSMutableString *header = [NSMutableString string];
    [header appendFormat:@"HTTP/1.1 %ld %@\n", (long)httpAsynConn.responseCode, httpAsynConn.statusString];
    for (id key in httpAsynConn.responseHeader) {
        [header appendFormat:@"%@: %@\n", key, [httpAsynConn.responseHeader objectForKey:key]];
    }
    if (header.length > 0) {
        NSRange range = NSMakeRange(header.length - 1, 1);
        [header deleteCharactersInRange:range];
    }
    NSData *headerData = [header dataUsingEncoding:NSUTF8StringEncoding];
    ccstd::vector<char> *headerBuffer = (ccstd::vector<char> *)headerStream;
    const void *headerptr = [headerData bytes];
    long headerlen = [headerData length];
    headerBuffer->insert(headerBuffer->end(), (char *)headerptr, (char *)headerptr + headerlen);

    //handle response data
    ccstd::vector<char> *recvBuffer = (ccstd::vector<char> *)stream;
    const void *ptr = [httpAsynConn.responseData bytes];
    long len = [httpAsynConn.responseData length];
    recvBuffer->insert(recvBuffer->end(), (char *)ptr, (char *)ptr + len);

    return 1;
}

// HttpClient implementation
HttpClient *HttpClient::getInstance() {
    if (_httpClient == nullptr) {
        _httpClient = ccnew HttpClient();
    }

    return _httpClient;
}

void HttpClient::destroyInstance() {
    if (nullptr == _httpClient) {
        CC_LOG_DEBUG("HttpClient singleton is nullptr");
        return;
    }

    CC_LOG_DEBUG("HttpClient::destroyInstance begin");

    auto thiz = _httpClient;
    _httpClient = nullptr;

    if (auto sche = thiz->_scheduler.lock()) {
        sche->unscheduleAllForTarget(thiz);
    }
    thiz->_schedulerMutex.lock();
    thiz->_scheduler.reset();
    thiz->_schedulerMutex.unlock();

    thiz->_requestQueueMutex.lock();
    thiz->_requestQueue.pushBack(thiz->_requestSentinel);
    thiz->_requestQueueMutex.unlock();

    thiz->_sleepCondition.notify_one();
    thiz->decreaseThreadCountAndMayDeleteThis();

    CC_LOG_DEBUG("HttpClient::destroyInstance() finished!");
}

void HttpClient::enableCookies(const char *cookieFile) {
    _cookieFileMutex.lock();
    if (cookieFile) {
        _cookieFilename = ccstd::string(cookieFile);
        _cookieFilename = FileUtils::getInstance()->fullPathForFilename(_cookieFilename);
    } else {
        _cookieFilename = (FileUtils::getInstance()->getWritablePath() + "cookieFile.txt");
    }
    _cookieFileMutex.unlock();

    if (nullptr == _cookie) {
        _cookie = ccnew HttpCookie;
    }
    _cookie->setCookieFileName(_cookieFilename);
    _cookie->readFile();
}

void HttpClient::setSSLVerification(const ccstd::string &caFile) {
    std::lock_guard<std::mutex> lock(_sslCaFileMutex);
    _sslCaFilename = caFile;
}

HttpClient::HttpClient()
: _isInited(false),
  _timeoutForConnect(30),
  _timeoutForRead(60),
  _threadCount(0),
  _cookie(nullptr) {
    CC_LOG_DEBUG("In the constructor of HttpClient!");
    if (gThreadPool == nullptr) {
        gThreadPool = LegacyThreadPool::newFixedThreadPool(4);
    }
    _requestSentinel = ccnew HttpRequest();
    _requestSentinel->addRef();
    memset(_responseMessage, 0, sizeof(char) * RESPONSE_BUFFER_SIZE);
    _scheduler = CC_CURRENT_ENGINE()->getScheduler();
    increaseThreadCount();
}

HttpClient::~HttpClient() {
    CC_SAFE_RELEASE(_requestSentinel);
    if (!_cookieFilename.empty() && nullptr != _cookie) {
        _cookie->writeFile();
        CC_SAFE_DELETE(_cookie);
    }
    CC_LOG_DEBUG("HttpClient destructor");
}

//Lazy create semaphore & mutex & thread
bool HttpClient::lazyInitThreadSemaphore() {
    if (_isInited) {
        return true;
    } else {
        auto t = std::thread(CC_CALLBACK_0(HttpClient::networkThread, this));
        t.detach();
        _isInited = true;
    }

    return true;
}

//Add a get task to queue
void HttpClient::send(HttpRequest *request) {
    if (false == lazyInitThreadSemaphore()) {
        return;
    }

    if (!request) {
        return;
    }

    request->addRef();

    _requestQueueMutex.lock();
    _requestQueue.pushBack(request);
    _requestQueueMutex.unlock();

    // Notify thread start to work
    _sleepCondition.notify_one();
}

void HttpClient::sendImmediate(HttpRequest *request) {
    if (!request) {
        return;
    }

    request->addRef();
    // Create a HttpResponse object, the default setting is http access failed
    HttpResponse *response = ccnew HttpResponse(request);
    response->addRef(); // NOTE: RefCounted object's reference count is changed to 0 now. so needs to addRef after ccnew.

    gThreadPool->pushTask([this, request, response](int /*tid*/) { HttpClient::networkThreadAlone(request, response); });
}

// Poll and notify main thread if responses exists in queue
void HttpClient::dispatchResponseCallbacks() {
    // log("CCHttpClient::dispatchResponseCallbacks is running");
    //occurs when cocos thread fires but the network thread has already quited
    HttpResponse *response = nullptr;
    _responseQueueMutex.lock();
    if (!_responseQueue.empty()) {
        response = _responseQueue.at(0);
        _responseQueue.erase(0);
    }
    _responseQueueMutex.unlock();

    if (response) {
        HttpRequest *request = response->getHttpRequest();
        const ccHttpRequestCallback &callback = request->getResponseCallback();

        if (callback != nullptr) {
            callback(this, response);
        }

        response->release();
        // do not release in other thread
        request->release();
    }
}

// Process Response
void HttpClient::processResponse(HttpResponse *response, char *responseMessage) {
    auto request = response->getHttpRequest();
    long responseCode = -1;
    int retValue = 0;
    NSString *requestType = nil;

    // Process the request -> get response packet
    switch (request->getRequestType()) {
        case HttpRequest::Type::GET: // HTTP GET
            requestType = @"GET";
            break;

        case HttpRequest::Type::POST: // HTTP POST
            requestType = @"POST";
            break;

        case HttpRequest::Type::PUT:
            requestType = @"PUT";
            break;

        case HttpRequest::Type::HEAD:
            requestType = @"HEAD";
            break;

        case HttpRequest::Type::DELETE:
            requestType = @"DELETE";
            break;

        default:
            CC_ABORT();
            break;
    }

    retValue = processTask(this,
                           request,
                           requestType,
                           response->getResponseData(),
                           &responseCode,
                           response->getResponseHeader(),
                           responseMessage);

    // write data to HttpResponse
    response->setResponseCode(responseCode);

    if (retValue != 0) {
        response->setSucceed(true);
    } else {
        response->setSucceed(false);
        response->setErrorBuffer(responseMessage);
    }
}

void HttpClient::increaseThreadCount() {
    _threadCountMutex.lock();
    ++_threadCount;
    _threadCountMutex.unlock();
}

void HttpClient::decreaseThreadCountAndMayDeleteThis() {
    bool needDeleteThis = false;
    _threadCountMutex.lock();
    --_threadCount;
    if (0 == _threadCount) {
        needDeleteThis = true;
    }

    _threadCountMutex.unlock();
    if (needDeleteThis) {
        delete this;
    }
}

const ccstd::string &HttpClient::getCookieFilename() {
    std::lock_guard<std::mutex> lock(_cookieFileMutex);
    return _cookieFilename;
}

const ccstd::string &HttpClient::getSSLVerification() {
    std::lock_guard<std::mutex> lock(_sslCaFileMutex);
    return _sslCaFilename;
}

} // namespace network

} // namespace cc
