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

#include "network/HttpClient.h"

#include <cerrno>
#include <cstdio>
#include <sstream>
#include "application/ApplicationManager.h"
#include "base/Log.h"
#include "base/ThreadPool.h"
#include "base/UTF8.h"
#include "base/std/container/queue.h"
#include "platform/FileUtils.h"
#include "platform/java/jni/JniHelper.h"

#ifndef JCLS_HTTPCLIENT
    #define JCLS_HTTPCLIENT "com/cocos/lib/CocosHttpURLConnection"
#endif

namespace cc {

namespace network {

using HttpRequestHeaders = ccstd::vector<ccstd::string>;
using HttpRequestHeadersIter = HttpRequestHeaders::iterator;
using HttpCookies = ccstd::vector<ccstd::string>;
using HttpCookiesIter = HttpCookies::iterator;

static HttpClient *gHttpClient = nullptr; // pointer to singleton
static LegacyThreadPool *gThreadPool = nullptr;

struct CookiesInfo {
    ccstd::string domain;
    bool tailmatch;
    ccstd::string path;
    bool secure;
    ccstd::string key;
    ccstd::string value;
    ccstd::string expires;
};

//static size_t writeData(void *ptr, size_t size, size_t nmemb, void *stream)
static size_t writeData(void *buffer, size_t sizes, HttpResponse *response) {
    auto *recvBuffer = static_cast<ccstd::vector<char> *>(response->getResponseData());
    recvBuffer->clear();
    recvBuffer->insert(recvBuffer->end(), static_cast<char *>(buffer), (static_cast<char *>(buffer)) + sizes);
    return sizes;
}

//static size_t writeHeaderData(void *ptr, size_t size, size_t nmemb, void *stream)
size_t writeHeaderData(void *buffer, size_t sizes, HttpResponse *response) {
    auto *recvBuffer = static_cast<ccstd::vector<char> *>(response->getResponseHeader());
    recvBuffer->clear();
    recvBuffer->insert(recvBuffer->end(), static_cast<char *>(buffer), static_cast<char *>(buffer) + sizes);
    return sizes;
}

class HttpURLConnection {
public:
    explicit HttpURLConnection(HttpClient *httpClient)
    : _client(httpClient),
      _httpURLConnection(nullptr),
      _contentLength(0) {
    }

    ~HttpURLConnection() {
        if (_httpURLConnection != nullptr) {
            JniHelper::getEnv()->DeleteGlobalRef(_httpURLConnection);
        }
    }

    void setRequestMethod(const char *method) { // NOLINT
        _requestmethod = method;

        JniMethodInfo methodInfo;
        if (JniHelper::getStaticMethodInfo(methodInfo,
                                           JCLS_HTTPCLIENT,
                                           "setRequestMethod",
                                           "(Ljava/net/HttpURLConnection;Ljava/lang/String;)V")) {
            jstring jstr = methodInfo.env->NewStringUTF(_requestmethod.c_str());
            methodInfo.env->CallStaticVoidMethod(
                methodInfo.classID, methodInfo.methodID, _httpURLConnection, jstr);
            ccDeleteLocalRef(methodInfo.env, jstr);
            ccDeleteLocalRef(methodInfo.env, methodInfo.classID);
        } else {
            CC_LOG_ERROR("HttpClient::%s failed!", __FUNCTION__);
        }
    }

    bool init(HttpRequest *request) {
        createHttpURLConnection(request->getUrl());
        if (!configure(request)) {
            return false;
        }
        /* get custom header data (if set) */
        HttpRequestHeaders headers = request->getHeaders();
        if (!headers.empty()) {
            /* append custom headers one by one */
            for (auto &header : headers) {
                uint32_t len = header.length();
                ccstd::string::size_type pos = header.find(':');
                if (ccstd::string::npos == pos || pos >= len) {
                    continue;
                }
                ccstd::string str1 = header.substr(0, pos);
                ccstd::string str2 = header.substr(pos + 1);
                // trim \n at the end of the string
                if (!str2.empty() && str2[str2.size() - 1] == '\n') {
                    str2.erase(str2.size() - 1);
                }
                // trim leading space (header is field: value format)
                if (!str2.empty() && str2[0] == ' ') {
                    str2.erase(0, 1);
                }
                addRequestHeader(str1.c_str(), str2.c_str());
            }
        }

        addCookiesForRequestHeader();

        return true;
    }

    int connect() { // NOLINT
        int suc = 0;
        JniMethodInfo methodInfo;
        if (JniHelper::getStaticMethodInfo(methodInfo,
                                           JCLS_HTTPCLIENT,
                                           "connect",
                                           "(Ljava/net/HttpURLConnection;)I")) {
            suc = methodInfo.env->CallStaticIntMethod(
                methodInfo.classID, methodInfo.methodID, _httpURLConnection);
            ccDeleteLocalRef(methodInfo.env, methodInfo.classID);
        } else {
            CC_LOG_ERROR("HttpClient::%s failed!", __FUNCTION__);
        }

        return suc;
    }

    void disconnect() { // NOLINT
        JniMethodInfo methodInfo;
        if (JniHelper::getStaticMethodInfo(methodInfo,
                                           JCLS_HTTPCLIENT,
                                           "disconnect",
                                           "(Ljava/net/HttpURLConnection;)V")) {
            methodInfo.env->CallStaticVoidMethod(
                methodInfo.classID, methodInfo.methodID, _httpURLConnection);
            ccDeleteLocalRef(methodInfo.env, methodInfo.classID);
        } else {
            CC_LOG_ERROR("HttpClient::%s failed!", __FUNCTION__);
        }
    }

    int getResponseCode() { // NOLINT
        int responseCode = 0;
        JniMethodInfo methodInfo;
        if (JniHelper::getStaticMethodInfo(methodInfo,
                                           JCLS_HTTPCLIENT,
                                           "getResponseCode",
                                           "(Ljava/net/HttpURLConnection;)I")) {
            responseCode = methodInfo.env->CallStaticIntMethod(
                methodInfo.classID, methodInfo.methodID, _httpURLConnection);
            ccDeleteLocalRef(methodInfo.env, methodInfo.classID);
        } else {
            CC_LOG_ERROR("HttpClient::%s failed!", __FUNCTION__);
        }

        return responseCode;
    }

    char *getResponseMessage() { // NOLINT
        char *message = nullptr;
        JniMethodInfo methodInfo;
        if (JniHelper::getStaticMethodInfo(methodInfo,
                                           JCLS_HTTPCLIENT,
                                           "getResponseMessage",
                                           "(Ljava/net/HttpURLConnection;)Ljava/lang/String;")) {
            jobject jObj = methodInfo.env->CallStaticObjectMethod(
                methodInfo.classID, methodInfo.methodID, _httpURLConnection);
            message = getBufferFromJString(static_cast<jstring>(jObj), methodInfo.env);
            if (nullptr != jObj) {
                ccDeleteLocalRef(methodInfo.env, jObj);
            }
            ccDeleteLocalRef(methodInfo.env, methodInfo.classID);
        } else {
            CC_LOG_ERROR("HttpClient::%s failed!", __FUNCTION__);
        }

        return message;
    }

    void sendRequest(HttpRequest *request) { // NOLINT
        JniMethodInfo methodInfo;
        if (JniHelper::getStaticMethodInfo(methodInfo,
                                           JCLS_HTTPCLIENT,
                                           "sendRequest",
                                           "(Ljava/net/HttpURLConnection;[B)V")) {
            jbyteArray bytearray;
            auto dataSize = static_cast<ssize_t>(request->getRequestDataSize());
            bytearray = methodInfo.env->NewByteArray(dataSize);
            methodInfo.env->SetByteArrayRegion(bytearray, 0, dataSize, reinterpret_cast<const jbyte *>(request->getRequestData()));
            methodInfo.env->CallStaticVoidMethod(
                methodInfo.classID, methodInfo.methodID, _httpURLConnection, bytearray);
            ccDeleteLocalRef(methodInfo.env, bytearray);
            ccDeleteLocalRef(methodInfo.env, methodInfo.classID);
        } else {
            CC_LOG_ERROR("HttpClient::%s failed!", __FUNCTION__);
        }
    }

    size_t saveResponseCookies(const char *responseCookies, size_t count) { // NOLINT
        if (nullptr == responseCookies || strlen(responseCookies) == 0 || count == 0) {
            return 0;
        }

        if (_cookieFileName.empty()) {
            _cookieFileName = FileUtils::getInstance()->getWritablePath() + "cookieFile.txt";
        }

        FILE *fp = fopen(_cookieFileName.c_str(), "w");
        if (nullptr == fp) {
            CC_LOG_DEBUG("can't create or open response cookie files");
            return 0;
        }

        fwrite(responseCookies, sizeof(char), count, fp);

        fclose(fp);

        return count;
    }

    char *getResponseHeaders() { // NOLINT
        char *headers = nullptr;
        JniMethodInfo methodInfo;
        if (JniHelper::getStaticMethodInfo(methodInfo,
                                           JCLS_HTTPCLIENT,
                                           "getResponseHeaders",
                                           "(Ljava/net/HttpURLConnection;)Ljava/lang/String;")) {
            jobject jObj = methodInfo.env->CallStaticObjectMethod(
                methodInfo.classID, methodInfo.methodID, _httpURLConnection);
            headers = getBufferFromJString(static_cast<jstring>(jObj), methodInfo.env);
            if (nullptr != jObj) {
                ccDeleteLocalRef(methodInfo.env, jObj);
            }
            ccDeleteLocalRef(methodInfo.env, methodInfo.classID);
        } else {
            CC_LOG_ERROR("HttpClient::%s failed!", __FUNCTION__);
        }

        return headers;
    }

    char *getResponseContent(HttpResponse *response) { // NOLINT
        if (nullptr == response) {
            return nullptr;
        }

        char *content = nullptr;
        JniMethodInfo methodInfo;
        if (JniHelper::getStaticMethodInfo(methodInfo,
                                           JCLS_HTTPCLIENT,
                                           "getResponseContent",
                                           "(Ljava/net/HttpURLConnection;)[B")) {
            jobject jObj = methodInfo.env->CallStaticObjectMethod(
                methodInfo.classID, methodInfo.methodID, _httpURLConnection);

            _contentLength = getCStrFromJByteArray(static_cast<jbyteArray>(jObj), methodInfo.env, &content);
            if (nullptr != jObj) {
                ccDeleteLocalRef(methodInfo.env, jObj);
            }
            ccDeleteLocalRef(methodInfo.env, methodInfo.classID);
        } else {
            CC_LOG_ERROR("HttpClient::%s failed!", __FUNCTION__);
        }

        return content;
    }

    char *getResponseHeaderByKey(const char *key) {
        char *value = nullptr;
        JniMethodInfo methodInfo;
        if (JniHelper::getStaticMethodInfo(methodInfo,
                                           JCLS_HTTPCLIENT,
                                           "getResponseHeaderByKey",
                                           "(Ljava/net/HttpURLConnection;Ljava/lang/String;)Ljava/lang/String;")) {
            jstring jstrKey = methodInfo.env->NewStringUTF(key);
            jobject jObj = methodInfo.env->CallStaticObjectMethod(
                methodInfo.classID, methodInfo.methodID, _httpURLConnection, jstrKey);
            value = getBufferFromJString(static_cast<jstring>(jObj), methodInfo.env);
            ccDeleteLocalRef(methodInfo.env, jstrKey);
            if (nullptr != jObj) {
                ccDeleteLocalRef(methodInfo.env, jObj);
            }
            ccDeleteLocalRef(methodInfo.env, methodInfo.classID);
        } else {
            CC_LOG_ERROR("HttpClient::%s failed!", __FUNCTION__);
        }

        return value;
    }

    int getResponseHeaderByKeyInt(const char *key) {
        int contentLength = 0;
        JniMethodInfo methodInfo;
        if (JniHelper::getStaticMethodInfo(methodInfo,
                                           JCLS_HTTPCLIENT,
                                           "getResponseHeaderByKeyInt",
                                           "(Ljava/net/HttpURLConnection;Ljava/lang/String;)I")) {
            jstring jstrKey = methodInfo.env->NewStringUTF(key);
            contentLength = methodInfo.env->CallStaticIntMethod(
                methodInfo.classID, methodInfo.methodID, _httpURLConnection, jstrKey);
            ccDeleteLocalRef(methodInfo.env, jstrKey);
            ccDeleteLocalRef(methodInfo.env, methodInfo.classID);
        } else {
            CC_LOG_ERROR("HttpClient::%s failed!", __FUNCTION__);
        }

        return contentLength;
    }

    char *getResponseHeaderByIdx(int idx) {
        char *header = nullptr;
        JniMethodInfo methodInfo;
        if (JniHelper::getStaticMethodInfo(methodInfo,
                                           JCLS_HTTPCLIENT,
                                           "getResponseHeaderByIdx",
                                           "(Ljava/net/HttpURLConnection;I)Ljava/lang/String;")) {
            jobject jObj = methodInfo.env->CallStaticObjectMethod(
                methodInfo.classID, methodInfo.methodID, _httpURLConnection, idx);
            header = getBufferFromJString(static_cast<jstring>(jObj), methodInfo.env);
            if (nullptr != jObj) {
                ccDeleteLocalRef(methodInfo.env, jObj);
            }
            ccDeleteLocalRef(methodInfo.env, methodInfo.classID);
        } else {
            CC_LOG_ERROR("HttpClient::%s failed!", __FUNCTION__);
        }

        return header;
    }

    const ccstd::string &getCookieFileName() const {
        return _cookieFileName;
    }

    void setCookieFileName(ccstd::string &filename) { //NOLINT
        _cookieFileName = filename;
    }

    int getContentLength() const {
        return _contentLength;
    }

private:
    void createHttpURLConnection(const ccstd::string &url) {
        JniMethodInfo methodInfo;
        if (JniHelper::getStaticMethodInfo(methodInfo,
                                           JCLS_HTTPCLIENT,
                                           "createHttpURLConnection",
                                           "(Ljava/lang/String;)Ljava/net/HttpURLConnection;")) {
            _url = url;
            jstring jurl = methodInfo.env->NewStringUTF(url.c_str());
            jobject jObj = methodInfo.env->CallStaticObjectMethod(methodInfo.classID, methodInfo.methodID, jurl);
            _httpURLConnection = methodInfo.env->NewGlobalRef(jObj);
            ccDeleteLocalRef(methodInfo.env, jurl);
            ccDeleteLocalRef(methodInfo.env, jObj);
            ccDeleteLocalRef(methodInfo.env, methodInfo.classID);
        } else {
            CC_LOG_ERROR("HttpClient::%s failed!", __FUNCTION__);
        }
    }

    void addRequestHeader(const char *key, const char *value) {
        JniMethodInfo methodInfo;
        if (JniHelper::getStaticMethodInfo(methodInfo,
                                           JCLS_HTTPCLIENT,
                                           "addRequestHeader",
                                           "(Ljava/net/HttpURLConnection;Ljava/lang/String;Ljava/lang/String;)V")) {
            jstring jstrKey = methodInfo.env->NewStringUTF(key);
            jstring jstrVal = methodInfo.env->NewStringUTF(value);
            methodInfo.env->CallStaticVoidMethod(
                methodInfo.classID, methodInfo.methodID, _httpURLConnection, jstrKey, jstrVal);
            ccDeleteLocalRef(methodInfo.env, jstrKey);
            ccDeleteLocalRef(methodInfo.env, jstrVal);
            ccDeleteLocalRef(methodInfo.env, methodInfo.classID);
        } else {
            CC_LOG_ERROR("HttpClient::%s failed!", __FUNCTION__);
        }
    }

    void addCookiesForRequestHeader() {
        if (_client->getCookieFilename().empty()) {
            return;
        }

        _cookieFileName = FileUtils::getInstance()->fullPathForFilename(_client->getCookieFilename());

        ccstd::string cookiesInfo = FileUtils::getInstance()->getStringFromFile(_cookieFileName);

        if (cookiesInfo.empty()) {
            return;
        }

        HttpCookies cookiesVec;
        cookiesVec.clear();

        std::stringstream stream(cookiesInfo);
        ccstd::string item;
        while (std::getline(stream, item, '\n')) {
            cookiesVec.push_back(item);
        }

        if (cookiesVec.empty()) {
            return;
        }

        ccstd::vector<CookiesInfo> cookiesInfoVec;
        cookiesInfoVec.clear();

        for (auto &cookies : cookiesVec) {
            if (cookies.find("#HttpOnly_") != ccstd::string::npos) {
                cookies = cookies.substr(10);
            }

            if (cookies.at(0) == '#') {
                continue;
            }

            CookiesInfo co;
            std::stringstream streamInfo(cookies);
            ccstd::string item;
            ccstd::vector<ccstd::string> elems;

            while (std::getline(streamInfo, item, '\t')) {
                elems.push_back(item);
            }

            co.domain = elems[0];
            if (co.domain.at(0) == '.') {
                co.domain = co.domain.substr(1);
            }
            co.tailmatch = strcmp("TRUE", elems.at(1).c_str()) != 0;
            co.path = elems.at(2);
            co.secure = strcmp("TRUE", elems.at(3).c_str()) != 0;
            co.expires = elems.at(4);
            co.key = elems.at(5);
            co.value = elems.at(6);
            cookiesInfoVec.push_back(co);
        }

        ccstd::string sendCookiesInfo;
        int cookiesCount = 0;
        for (auto &cookieInfo : cookiesInfoVec) {
            if (_url.find(cookieInfo.domain) != ccstd::string::npos) {
                ccstd::string keyValue = cookieInfo.key;
                keyValue.append("=");
                keyValue.append(cookieInfo.value);
                if (cookiesCount != 0) {
                    sendCookiesInfo.append(";");
                }

                sendCookiesInfo.append(keyValue);
            }
            cookiesCount++;
        }

        //set Cookie
        addRequestHeader("Cookie", sendCookiesInfo.c_str());
    }

    void setReadAndConnectTimeout(int readMiliseconds, int connectMiliseconds) {
        JniMethodInfo methodInfo;
        if (JniHelper::getStaticMethodInfo(methodInfo,
                                           JCLS_HTTPCLIENT,
                                           "setReadAndConnectTimeout",
                                           "(Ljava/net/HttpURLConnection;II)V")) {
            methodInfo.env->CallStaticVoidMethod(
                methodInfo.classID, methodInfo.methodID, _httpURLConnection, readMiliseconds, connectMiliseconds);
            ccDeleteLocalRef(methodInfo.env, methodInfo.classID);
        } else {
            CC_LOG_ERROR("HttpClient::%s failed!", __FUNCTION__);
        }
    }

    void setVerifySSL() {
        if (_client->getSSLVerification().empty()) {
            return;
        }

        ccstd::string fullpath = FileUtils::getInstance()->fullPathForFilename(_client->getSSLVerification());

        JniMethodInfo methodInfo;
        if (JniHelper::getStaticMethodInfo(methodInfo,
                                           JCLS_HTTPCLIENT,
                                           "setVerifySSL",
                                           "(Ljava/net/HttpURLConnection;Ljava/lang/String;)V")) {
            jstring jstrfullpath = methodInfo.env->NewStringUTF(fullpath.c_str());
            methodInfo.env->CallStaticVoidMethod(
                methodInfo.classID, methodInfo.methodID, _httpURLConnection, jstrfullpath);
            ccDeleteLocalRef(methodInfo.env, jstrfullpath);
            ccDeleteLocalRef(methodInfo.env, methodInfo.classID);
        } else {
            CC_LOG_ERROR("HttpClient::%s failed!", __FUNCTION__);
        }
    }

    bool configure(HttpRequest *request) {
        if (nullptr == _httpURLConnection) {
            return false;
        }

        if (nullptr == _client) {
            return false;
        }

        setReadAndConnectTimeout(static_cast<int>(request->getTimeout() * 1000),
                                 static_cast<int>(request->getTimeout() * 1000));

        setVerifySSL();

        return true;
    }

    char *getBufferFromJString(jstring jstr, JNIEnv *env) { //NOLINT(readability-convert-member-functions-to-static)
        if (nullptr == jstr) {
            return nullptr;
        }
        ccstd::string strValue = cc::StringUtils::getStringUTFCharsJNI(env, jstr);
        size_t size = strValue.size() + 1;
        char *retVal = static_cast<char *>(malloc(size));
        if (retVal == nullptr) {
            return nullptr;
        }
        memcpy(retVal, strValue.c_str(), size);
        return retVal;
    }

    int getCStrFromJByteArray(jbyteArray jba, JNIEnv *env, char **ppData) { //NOLINT(readability-convert-member-functions-to-static)
        if (nullptr == jba) {
            *ppData = nullptr;
            return 0;
        }

        int len = env->GetArrayLength(jba);
        auto *str = static_cast<jbyte *>(malloc(sizeof(jbyte) * len));
        env->GetByteArrayRegion(jba, 0, len, str);

        *ppData = reinterpret_cast<char *>(str);
        return len;
    }

    const ccstd::string &getCookieString() const {
        return _responseCookies;
    }

private: // NOLINT(readability-redundant-access-specifiers)
    HttpClient *_client;
    jobject _httpURLConnection;
    ccstd::string _requestmethod;
    ccstd::string _responseCookies;
    ccstd::string _cookieFileName;
    ccstd::string _url;
    int _contentLength;
};

// Process Response
void HttpClient::processResponse(HttpResponse *response, char *responseMessage) {
    auto *request = response->getHttpRequest();
    HttpRequest::Type requestType = request->getRequestType();

    if (HttpRequest::Type::GET != requestType &&
        HttpRequest::Type::POST != requestType &&
        HttpRequest::Type::PUT != requestType &&
        HttpRequest::Type::HEAD != requestType &&
        HttpRequest::Type::DELETE != requestType) {
        CC_ABORT();
        return;
    }

    long responseCode = -1L; // NOLINT
    int retValue = 0;

    HttpURLConnection urlConnection(this);
    if (!urlConnection.init(request)) {
        response->setSucceed(false);
        response->setErrorBuffer("HttpURLConnection init failed");
        return;
    }

    switch (requestType) {
        case HttpRequest::Type::GET:
            urlConnection.setRequestMethod("GET");
            break;

        case HttpRequest::Type::POST:
            urlConnection.setRequestMethod("POST");
            break;

        case HttpRequest::Type::PUT:
            urlConnection.setRequestMethod("PUT");
            break;

        case HttpRequest::Type::HEAD:
            urlConnection.setRequestMethod("HEAD");
            break;

        case HttpRequest::Type::DELETE:
            urlConnection.setRequestMethod("DELETE");
            break;

        case HttpRequest::Type::PATCH:
            urlConnection.setRequestMethod("PATCH");
            break;

        default:
            break;
    }

    int suc = urlConnection.connect();
    if (0 != suc) {
        response->setSucceed(false);
        response->setErrorBuffer("connect failed");
        response->setResponseCode(responseCode);
        return;
    }

    if (HttpRequest::Type::POST == requestType ||
        HttpRequest::Type::PUT == requestType ||
        HttpRequest::Type::PATCH == requestType) {
        urlConnection.sendRequest(request);
    }

    responseCode = urlConnection.getResponseCode();

    if (0 == responseCode) {
        response->setSucceed(false);
        response->setErrorBuffer("connect failed");
        response->setResponseCode(-1);
        return;
    }

    char *headers = urlConnection.getResponseHeaders();
    if (nullptr != headers) {
        writeHeaderData(headers, strlen(headers), response);
    }
    free(headers);

    //get and save cookies
    char *cookiesInfo = urlConnection.getResponseHeaderByKey("set-cookie");
    if (nullptr != cookiesInfo) {
        urlConnection.saveResponseCookies(cookiesInfo, strlen(cookiesInfo));
    }
    free(cookiesInfo);

    //content len
    int contentLength = urlConnection.getResponseHeaderByKeyInt("Content-Length");
    char *contentInfo = urlConnection.getResponseContent(response);
    if (nullptr != contentInfo) {
        auto *recvBuffer = static_cast<ccstd::vector<char> *>(response->getResponseData());
        recvBuffer->clear();
        recvBuffer->insert(recvBuffer->begin(), contentInfo, contentInfo + urlConnection.getContentLength());
    }
    free(contentInfo);

    char *messageInfo = urlConnection.getResponseMessage();
    if (messageInfo) {
        strcpy(responseMessage, messageInfo);
        free(messageInfo);
    }

    urlConnection.disconnect();

    // write data to HttpResponse
    response->setResponseCode(responseCode);

    if (responseCode == -1) {
        response->setSucceed(false);
        if (responseMessage != nullptr) {
            response->setErrorBuffer(responseMessage);
        } else {
            response->setErrorBuffer("response code error!");
        }
    } else {
        response->setSucceed(true);
    }
}

// Worker thread
void HttpClient::networkThread() {
    increaseThreadCount();

    while (true) {
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
        auto *response = ccnew HttpResponse(request);
        response->addRef(); // NOTE: RefCounted object's reference count is changed to 0 now. so needs to addRef after ccnew.
        processResponse(response, _responseMessage);

        // add response packet into queue
        _responseQueueMutex.lock();
        _responseQueue.pushBack(response);
        _responseQueueMutex.unlock();

        _schedulerMutex.lock();
        if (auto sche = _scheduler.lock()) {
            sche->performFunctionInCocosThread(CC_CALLBACK_0(HttpClient::dispatchResponseCallbacks, this)); // NOLINT
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

// HttpClient implementation
HttpClient *HttpClient::getInstance() {
    if (gHttpClient == nullptr) {
        gHttpClient = ccnew HttpClient();
    }

    return gHttpClient;
}

void HttpClient::destroyInstance() {
    if (gHttpClient == nullptr) {
        CC_LOG_DEBUG("HttpClient singleton is nullptr");
        return;
    }

    CC_LOG_DEBUG("HttpClient::destroyInstance ...");

    auto *thiz = gHttpClient;
    gHttpClient = nullptr;

    if (auto sche = thiz->_scheduler.lock()) {
        sche->unscheduleAllForTarget(thiz);
    }
    thiz->_schedulerMutex.lock();
    thiz->_scheduler.reset();
    thiz->_schedulerMutex.unlock();

    {
        std::lock_guard<std::mutex> lock(thiz->_requestQueueMutex);
        thiz->_requestQueue.pushBack(thiz->_requestSentinel);
    }
    thiz->_sleepCondition.notify_one();

    thiz->decreaseThreadCountAndMayDeleteThis();
    CC_LOG_DEBUG("HttpClient::destroyInstance() finished!");
}

void HttpClient::enableCookies(const char *cookieFile) {
    std::lock_guard<std::mutex> lock(_cookieFileMutex);
    if (cookieFile) {
        _cookieFilename = ccstd::string(cookieFile);
    } else {
        _cookieFilename = (FileUtils::getInstance()->getWritablePath() + "cookieFile.txt");
    }
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
  _cookie(nullptr),
  _requestSentinel(ccnew HttpRequest()) {
    CC_LOG_DEBUG("In the constructor of HttpClient!");
    _requestSentinel->addRef();
    if (gThreadPool == nullptr) {
        gThreadPool = LegacyThreadPool::newFixedThreadPool(4);
    }
    increaseThreadCount();
    _scheduler = CC_CURRENT_ENGINE()->getScheduler();
}

HttpClient::~HttpClient() {
    CC_LOG_DEBUG("In the destructor of HttpClient!");
    CC_SAFE_RELEASE(_requestSentinel);
}

//Lazy create semaphore & mutex & thread
bool HttpClient::lazyInitThreadSemaphore() {
    if (_isInited) {
        return true;
    }

    auto t = std::thread(CC_CALLBACK_0(HttpClient::networkThread, this)); // NOLINT
    t.detach();
    _isInited = true;

    return true;
}

//Add a get task to queue
void HttpClient::send(HttpRequest *request) {
    if (!lazyInitThreadSemaphore()) {
        return;
    }

    if (nullptr == request) {
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
    if (nullptr == request) {
        return;
    }

    request->addRef();
    // Create a HttpResponse object, the default setting is http access failed
    auto *response = ccnew HttpResponse(request);
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
