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

#ifndef __HTTP_RESPONSE__
#define __HTTP_RESPONSE__

#include "network/HttpRequest.h"

/**
 * @addtogroup network
 * @{
 */

namespace cc {

namespace network {

/**
 * @brief defines the object which users will receive at onHttpCompleted(sender, HttpResponse) callback.
 * Please refer to samples/TestCpp/Classes/ExtensionTest/NetworkTest/HttpClientTest.cpp as a sample.
 * @since v2.0.2.
 * @lua NA
 */
class CC_DLL HttpResponse : public cc::RefCounted {
public:
    /**
     * Constructor, it's used by HttpClient internal, users don't need to create HttpResponse manually.
     * @param request the corresponding HttpRequest which leads to this response.
     */
    HttpResponse(HttpRequest *request)
    : _pHttpRequest(request),
      _succeed(false),
      _responseDataString("") {
        if (_pHttpRequest) {
            _pHttpRequest->addRef();
        }
    }

    /**
     * Destructor, it will be called in HttpClient internal.
     * Users don't need to destruct HttpResponse object manually.
     */
    virtual ~HttpResponse() {
        if (_pHttpRequest) {
            _pHttpRequest->release();
        }
    }

    // getters, will be called by users

    /**
     * Get the corresponding HttpRequest object which leads to this response.
     * There's no paired setter for it, because it's already set in class constructor
     * @return HttpRequest* the corresponding HttpRequest object which leads to this response.
     */
    inline HttpRequest *getHttpRequest() const {
        return _pHttpRequest;
    }

    /**
     * To see if the http request is returned successfully.
     * Although users can judge if (http response code = 200), we want an easier way.
     * If this getter returns false, you can call getResponseCode and getErrorBuffer to find more details.
     * @return bool the flag that represent whether the http request return successfully or not.
     */
    inline bool isSucceed() const {
        return _succeed;
    }

    /**
     * Get the http response data.
     * @return ccstd::vector<char>* the pointer that point to the _responseData.
     */
    inline ccstd::vector<char> *getResponseData() {
        return &_responseData;
    }

    /**
     * Get the response headers.
     * @return ccstd::vector<char>* the pointer that point to the _responseHeader.
     */
    inline ccstd::vector<char> *getResponseHeader() {
        return &_responseHeader;
    }

    /**
     * Get the http response code to judge whether response is successful or not.
     * I know that you want to see the _responseCode is 200.
     * If _responseCode is not 200, you should check the meaning for _responseCode by the net.
     * @return long the value of _responseCode
     */
    inline long getResponseCode() const {
        return _responseCode;
    }

    /**
     * Get the error buffer which will tell you more about the reason why http request failed.
     * @return const char* the pointer that point to _errorBuffer.
     */
    inline const char *getErrorBuffer() const {
        return _errorBuffer.c_str();
    }

    // setters, will be called by HttpClient
    // users should avoid invoking these methods

    /**
     * Set whether the http request is returned successfully or not,
     * This setter is mainly used in HttpClient, users mustn't set it directly
     * @param value the flag represent whether the http request is successful or not.
     */
    inline void setSucceed(bool value) {
        _succeed = value;
    }

    /**
     * Set the http response data buffer, it is used by HttpClient.
     * @param data the pointer point to the response data buffer.
     */
    inline void setResponseData(ccstd::vector<char> *data) {
        _responseData = *data;
    }

    /**
     * Set the http response headers buffer, it is used by HttpClient.
     * @param data the pointer point to the response headers buffer.
     */
    inline void setResponseHeader(ccstd::vector<char> *data) {
        _responseHeader = *data;
    }

    /**
     * Set the http response code.
     * @param value the http response code that represent whether the request is successful or not.
     */
    inline void setResponseCode(long value) {
        _responseCode = value;
    }

    /**
     * Set the error buffer which will tell you more the reason why http request failed.
     * @param value a string pointer that point to the reason.
     */
    inline void setErrorBuffer(const char *value) {
        _errorBuffer.clear();
        if (value != nullptr)
            _errorBuffer.assign(value);
    }

    /**
     * Set the response data by the string pointer and the defined size.
     * @param value a string pointer that point to response data buffer.
     * @param n the defined size that the response data buffer would be copied.
     */
    inline void setResponseDataString(const char *value, size_t n) {
        _responseDataString.clear();
        _responseDataString.assign(value, n);
    }

    /**
     * Get the string pointer that point to the response data.
     * @return const char* the string pointer that point to the response data.
     */
    inline const char *getResponseDataString() const {
        return _responseDataString.c_str();
    }

protected:
    bool initWithRequest(HttpRequest *request);

    // properties
    HttpRequest *_pHttpRequest;          /// the corresponding HttpRequest pointer who leads to this response
    bool _succeed;                       /// to indicate if the http request is successful simply
    ccstd::vector<char> _responseData;   /// the returned raw data. You can also dump it as a string
    ccstd::vector<char> _responseHeader; /// the returned raw header data. You can also dump it as a string
    long _responseCode;                  /// the status code returned from libcurl, e.g. 200, 404
    ccstd::string _errorBuffer;          /// if _responseCode != 200, please read _errorBuffer to find the reason
    ccstd::string _responseDataString;   // the returned raw data. You can also dump it as a string
};

} // namespace network

} // namespace cc

// end group
/// @}

#endif //__HTTP_RESPONSE_H__
