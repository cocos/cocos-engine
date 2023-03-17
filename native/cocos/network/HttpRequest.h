/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
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

#ifndef __HTTP_REQUEST_H__
#define __HTTP_REQUEST_H__

#include "base/Macros.h"
#include "base/RefCounted.h"

#include <functional>
#include "base/std/container/string.h"

/**
 * @addtogroup network
 * @{
 */

namespace cc {

namespace network {

class HttpClient;
class HttpResponse;

using ccHttpRequestCallback = std::function<void(HttpClient *, HttpResponse *)>;

/**
 * Defines the object which users must packed for HttpClient::send(HttpRequest*) method.
 * Please refer to tests/test-cpp/Classes/ExtensionTest/NetworkTest/HttpClientTest.cpp as a sample
 * @since v2.0.2
 *
 * @lua NA
 */

#if (CC_PLATFORM == CC_PLATFORM_WINRT)
    #ifdef DELETE
        #undef DELETE
    #endif
#endif

class CC_DLL HttpRequest : public RefCounted {
public:
    /**
     * The HttpRequest type enum used in the HttpRequest::setRequestType.
     */
    enum class Type {
        GET,
        POST,
        PUT,
        DELETE,
        HEAD,
        UNKNOWN,
    };

    /**
     *  Constructor.
     *   Because HttpRequest object will be used between UI thread and network thread,
         requestObj->autorelease() is forbidden to avoid crashes in AutoreleasePool
         new/retain/release still works, which means you need to release it manually
         Please refer to HttpRequestTest.cpp to find its usage.
     */
    HttpRequest()
    : _callback(nullptr) {}

    /** Destructor. */
    ~HttpRequest() override = default;

    // setter/getters for properties

    /**
     * Set request type of HttpRequest object before being sent,now it support the enum value of HttpRequest::Type.
     *
     * @param type the request type.
     */
    inline void setRequestType(Type type) {
        _requestType = type;
    }

    /**
     * Get the request type of HttpRequest object.
     *
     * @return HttpRequest::Type.
     */
    inline Type getRequestType() const {
        return _requestType;
    }

    /**
     * Set the url address of HttpRequest object.
     * The url value could be like these: "http://httpbin.org/ip" or "https://httpbin.org/get"
     *
     * @param url the string object.
     */
    inline void setUrl(const ccstd::string &url) {
        _url = url;
    }

    /**
     * Get the url address of HttpRequest object.
     *
     * @return const char* the pointer of _url.
     */
    inline const char *getUrl() const {
        return _url.c_str();
    }

    /**
     * Set the request data of HttpRequest object.
     *
     * @param buffer the buffer of request data, it support binary data.
     * @param len    the size of request data.
     */
    inline void setRequestData(const char *buffer, size_t len) {
        _requestData.assign(buffer, buffer + len);
    }

    /**
     * Get the request data pointer of HttpRequest object.
     *
     * @return char* the request data pointer.
     */
    inline char *getRequestData() {
        if (!_requestData.empty()) {
            return _requestData.data();
        }

        return nullptr;
    }

    /**
     * Get the size of request data
     *
     * @return uint32_t the size of request data
     */
    inline uint32_t getRequestDataSize() const {
        return static_cast<uint32_t>(_requestData.size());
    }

    /**
     * Set a string tag to identify your request.
     * This tag can be found in HttpResponse->getHttpRequest->getTag().
     *
     * @param tag the string object.
     */
    inline void setTag(const ccstd::string &tag) {
        _tag = tag;
    }

    /**
     * Get the string tag to identify the request.
     * The best practice is to use it in your MyClass::onMyHttpRequestCompleted(sender, HttpResponse*) callback.
     *
     * @return const char* the pointer of _tag
     */
    inline const char *getTag() const {
        return _tag.c_str();
    }

    /**
     * Set user-customed data of HttpRequest object.
     * You can attach a customed data in each request, and get it back in response callback.
     * But you need to new/delete the data pointer manully.
     *
     * @param userData the string pointer
     */
    inline void setUserData(void *userData) {
        _userData = userData;
    }

    /**
     * Get the user-customed data pointer which were pre-setted.
     * Don't forget to delete it. HttpClient/HttpResponse/HttpRequest will do nothing with this pointer.
     *
     * @return void* the pointer of user-customed data.
     */
    inline void *getUserData() const {
        return _userData;
    }

    /**
     * Set response callback function of HttpRequest object.
     * When response come back, we would call _pCallback to process response data.
     *
     * @param callback the ccHttpRequestCallback function.
     */
    inline void setResponseCallback(const ccHttpRequestCallback &callback) {
        _callback = callback;
    }

    /**
     * Get ccHttpRequestCallback callback function.
     *
     * @return const ccHttpRequestCallback& ccHttpRequestCallback callback function.
     */
    inline const ccHttpRequestCallback &getResponseCallback() const {
        return _callback;
    }

    /**
     * Set custom-defined headers.
     *
     * @param pHeaders the string vector of custom-defined headers.
     */
    inline void setHeaders(const ccstd::vector<ccstd::string> &headers) {
        _headers = headers;
    }

    /**
     * Get custom headers.
     *
     * @return ccstd::vector<ccstd::string> the string vector of custom-defined headers.
     */
    inline ccstd::vector<ccstd::string> getHeaders() const {
        return _headers;
    }

    inline void setTimeout(float timeoutInSeconds) {
        _timeoutInSeconds = timeoutInSeconds;
    }

    inline float getTimeout() const {
        return _timeoutInSeconds;
    }

protected:
    // properties
    Type _requestType{Type::UNKNOWN};      /// kHttpRequestGet, kHttpRequestPost or other enums
    ccstd::string _url;                    /// target url that this request is sent to
    ccstd::vector<char> _requestData;      /// used for POST
    ccstd::string _tag;                    /// user defined tag, to identify different requests in response callback
    ccHttpRequestCallback _callback;       /// C++11 style callbacks
    void *_userData{nullptr};              /// You can add your customed data here
    ccstd::vector<ccstd::string> _headers; /// custom http headers
    float _timeoutInSeconds{10.F};
};

} // namespace network

} // namespace cc

// end group
/// @}

#endif //__HTTP_REQUEST_H__
