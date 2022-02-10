/****************************************************************************
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

//
//  jsb_XMLHttpRequest.cpp
//  cocos2d_js_bindings
//
//  Created by James Chen on 5/15/17.
//
//
#include "jsb_xmlhttprequest.h"
#include <algorithm>
#include <functional>
#include <sstream>
#include <string>
#include <unordered_map>
#include "base/Config.h"
#include "cocos/base/Data.h"
#include "cocos/base/DeferredReleasePool.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/network/HttpClient.h"

#include "application/ApplicationManager.h"

using namespace cc;          //NOLINT
using namespace cc::network; //NOLINT

namespace {
// NOLINTNEXTLINE(readability-identifier-naming)
std::unordered_map<int, std::string> _httpStatusCodeMap = {
    {100, "Continue"},
    {101, "Switching Protocols"},
    {102, "Processing"},
    {200, "OK"},
    {201, "Created"},
    {202, "Accepted"},
    {203, "Non-authoritative Information"},
    {204, "No Content"},
    {205, "Reset Content"},
    {206, "Partial Content"},
    {207, "Multi-Status"},
    {208, "Already Reported"},
    {226, "IM Used"},
    {300, "Multiple Choices"},
    {301, "Moved Permanently"},
    {302, "Found"},
    {303, "See Other"},
    {304, "Not Modified"},
    {305, "Use Proxy"},
    {307, "Temporary Redirect"},
    {308, "Permanent Redirect"},
    {400, "Bad Request"},
    {401, "Unauthorized"},
    {402, "Payment Required"},
    {403, "Forbidden"},
    {404, "Not Found"},
    {405, "Method Not Allowed"},
    {406, "Not Acceptable"},
    {407, "Proxy Authentication Required"},
    {408, "Request Timeout"},
    {409, "Conflict"},
    {410, "Gone"},
    {411, "Length Required"},
    {412, "Precondition Failed"},
    {413, "Payload Too Large"},
    {414, "Request-URI Too Long"},
    {415, "Unsupported Media Type"},
    {416, "Requested Range Not Satisfiable"},
    {417, "Expectation Failed"},
    {418, "I'm a teapot"},
    {421, "Misdirected Request"},
    {422, "Unprocessable Entity"},
    {423, "Locked"},
    {424, "Failed Dependency"},
    {426, "Upgrade Required"},
    {428, "Precondition Required"},
    {429, "Too Many Requests"},
    {431, "Request Header Fields Too Large"},
    {444, "Connection Closed Without Response"},
    {451, "Unavailable For Legal Reasons"},
    {499, "Client Closed Request"},
    {500, "Internal Server Error"},
    {501, "Not Implemented"},
    {502, "Bad Gateway"},
    {503, "Service Unavailable"},
    {504, "Gateway Timeout"},
    {505, "HTTP Version Not Supported"},
    {506, "Variant Also Negotiates"},
    {507, "Insufficient Storage"},
    {508, "Loop Detected"},
    {510, "Not Extended"},
    {511, "Network Authentication Required"},
    {599, "Network Connect Timeout Error"}};
} // namespace

class XMLHttpRequest : public RefCounted {
public:
    // Ready States: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
    enum class ReadyState : char {
        UNSENT           = 0, // Client has been created. open() not called yet.
        OPENED           = 1, // open() has been called.
        HEADERS_RECEIVED = 2, // send() has been called, and headers and status are available.
        LOADING          = 3, // Downloading; responseText holds partial data.
        DONE             = 4  // The operation is complete.
    };

    enum class ResponseType : char {
        STRING,
        ARRAY_BUFFER,
        BLOB,
        DOCUMENT,
        JSON
    };

    std::function<void()> onloadstart;
    std::function<void()> onload;
    std::function<void()> onloadend;
    std::function<void()> onreadystatechange;
    std::function<void()> onabort;
    std::function<void()> onerror;
    std::function<void()> ontimeout;

    XMLHttpRequest();

    bool open(const std::string &method, const std::string &url);
    void send();
    void sendString(const std::string &str);
    void sendBinary(const cc::Data &data);

    void        setRequestHeader(const std::string &key, const std::string &value);
    std::string getAllResponseHeaders() const;
    std::string getResponseHeader(const std::string &key) const;

    ReadyState         getReadyState() const { return _readyState; }
    uint16_t           getStatus() const { return _status; }
    const std::string &getStatusText() const { return _statusText; }
    const std::string &getResponseText() const { return _responseText; }
    const cc::Data &   getResponseData() const { return _responseData; }
    ResponseType       getResponseType() const { return _responseType; }
    void               setResponseType(ResponseType type) { _responseType = type; }

    void        overrideMimeType(const std::string &mimeType);
    std::string getMimeType() const;

    void     setTimeout(uint32_t timeoutInMilliseconds);
    uint32_t getTimeout() const;

    void abort();

    bool isDiscardedByReset() const { return _isDiscardedByReset; }

private:
    ~XMLHttpRequest() override;

    void setReadyState(ReadyState readyState);
    void getHeader(const std::string &header);
    void onResponse(cc::network::HttpClient *client, cc::network::HttpResponse *response);

    void setHttpRequestData(const char *data, size_t len);
    void sendRequest();
    void setHttpRequestHeader();

    std::unordered_map<std::string, std::string> _httpHeader;
    std::unordered_map<std::string, std::string> _requestHeader;

    std::string _url;
    std::string _method;
    std::string _responseText;
    std::string _responseXML;
    std::string _statusText;
    std::string _overrideMimeType;

    cc::Data _responseData;

    cc::network::HttpRequest *_httpRequest;
    //    cc::EventListenerCustom* _resetDirectorListener;

    uint32_t _timeoutInMilliseconds{};
    uint16_t _status{};

    ResponseType _responseType{};
    ReadyState   _readyState{};

    bool _withCredentialsValue{false};
    bool _errorFlag{false};
    bool _isAborted{false};
    bool _isLoadStart{false};
    bool _isLoadEnd{false};
    bool _isDiscardedByReset{false};
    bool _isTimeout{false};
    bool _isSending{false};
};

XMLHttpRequest::XMLHttpRequest()
: onloadstart(nullptr),
  onload(nullptr),
  onloadend(nullptr),
  onreadystatechange(nullptr),
  onabort(nullptr),
  onerror(nullptr),
  ontimeout(nullptr),
  _httpRequest(new (std::nothrow) HttpRequest()),
  _responseType(ResponseType::STRING),
  _readyState(ReadyState::UNSENT) {
}

XMLHttpRequest::~XMLHttpRequest() {
    CC_CURRENT_ENGINE()->getScheduler()->unscheduleAllForTarget(this);
    // Avoid HttpClient response call a released object!
    _httpRequest->setResponseCallback(nullptr);
    CC_SAFE_RELEASE(_httpRequest);
}

bool XMLHttpRequest::open(const std::string &method, const std::string &url) {
    if (_readyState != ReadyState::UNSENT) {
        return false;
    }

    _method = method;
    _url    = url;

    HttpRequest::Type requestType = HttpRequest::Type::UNKNOWN;

    if (_method == "get" || _method == "GET") {
        requestType = HttpRequest::Type::GET;
    } else if (_method == "post" || _method == "POST") {
        requestType = HttpRequest::Type::POST;
    } else if (_method == "put" || _method == "PUT") {
        requestType = HttpRequest::Type::PUT;
    } else if (_method == "head" || _method == "HEAD") {
        requestType = HttpRequest::Type::HEAD;
    } else if (_method == "delete" || _method == "DELETE") {
        requestType = HttpRequest::Type::DELETE;
    }

    CCASSERT(requestType != HttpRequest::Type::UNKNOWN, (std::string("XMLHttpRequest.open: Unknown method: ") + method).c_str());

    _httpRequest->setRequestType(requestType);
    _httpRequest->setUrl(_url);

    _status    = 0;
    _isAborted = false;
    _isTimeout = false;

    setReadyState(ReadyState::OPENED);

    return true;
}

void XMLHttpRequest::send() {
    sendRequest();
}

void XMLHttpRequest::sendString(const std::string &str) {
    setHttpRequestData(str.c_str(), str.length());
    sendRequest();
}

void XMLHttpRequest::sendBinary(const Data &data) {
    setHttpRequestData(reinterpret_cast<const char *>(data.getBytes()), data.getSize());
    sendRequest();
}

void XMLHttpRequest::setTimeout(uint32_t timeoutInMilliseconds) {
    _timeoutInMilliseconds = timeoutInMilliseconds;
    _httpRequest->setTimeout(static_cast<float>(timeoutInMilliseconds) / 1000.0F + 2.0F); // Add 2 seconds more to ensure the timeout scheduler is invoked before http response.
}

uint32_t XMLHttpRequest::getTimeout() const {
    return static_cast<uint32_t>(_httpRequest->getTimeout() * 1000);
}

void XMLHttpRequest::abort() {
    if (!_isLoadStart) {
        return;
    }

    _isAborted = true;
    _isSending = false;

    setReadyState(ReadyState::DONE);

    if (onabort != nullptr) {
        onabort();
    }

    _isLoadEnd = true;
    if (onloadend != nullptr) {
        onloadend();
    }

    _readyState = ReadyState::UNSENT;

    //request is aborted, no more callback needed.
    _httpRequest->setResponseCallback(nullptr);
}

void XMLHttpRequest::setReadyState(ReadyState readyState) {
    if (_readyState != readyState) {
        _readyState = readyState;
        if (onreadystatechange != nullptr) {
            onreadystatechange();
        }
    }
}

void XMLHttpRequest::getHeader(const std::string &header) {
    // check for colon.
    size_t found_header_field = header.find_first_of(':'); // NOLINT(readability-identifier-naming)

    if (found_header_field != std::string::npos) {
        // Found a header field.
        std::string http_field; // NOLINT(readability-identifier-naming)
        std::string http_value; // NOLINT(readability-identifier-naming)

        http_field = header.substr(0, found_header_field);
        http_value = header.substr(found_header_field + 1, header.length());

        // Get rid of all \n
        if (!http_value.empty() && http_value[http_value.size() - 1] == '\n') {
            http_value.erase(http_value.size() - 1);
        }

        // Get rid of leading space (header is field: value format)
        if (!http_value.empty() && http_value[0] == ' ') {
            http_value.erase(0, 1);
        }

        // Transform field name to lower case as they are case-insensitive
        std::transform(http_field.begin(), http_field.end(), http_field.begin(), ::tolower);

        _httpHeader[http_field] = http_value;

    } else {
        // Get Header and Set StatusText
        // Split String into Tokens
        if (header.find("HTTP") == 0) {
            int  _v1; // NOLINT(readability-identifier-naming)
            int  _v2; // NOLINT(readability-identifier-naming)
            int  code           = 0;
            char statusText[64] = {0};
            sscanf(header.c_str(), "HTTP/%d.%d %d %63[^\n]", &_v1, &_v2, &code, statusText);
            _statusText = statusText;
            if (_statusText.empty()) {
                auto itCode = _httpStatusCodeMap.find(code);
                if (itCode != _httpStatusCodeMap.end()) {
                    _statusText = itCode->second;
                } else {
                    CC_LOG_DEBUG("XMLHTTPRequest invalid response code %d", code);
                }
            }
        }
    }
}

void XMLHttpRequest::onResponse(HttpClient * /*client*/, HttpResponse *response) {
    CC_CURRENT_ENGINE()->getScheduler()->unscheduleAllForTarget(this);
    _isSending = false;

    if (_isTimeout) {
        _isLoadEnd = true;
        if (onloadend) {
            onloadend();
        }
        return;
    }

    if (_isAborted || _readyState == ReadyState::UNSENT) {
        return;
    }

    std::string tag = response->getHttpRequest()->getTag();
    if (!tag.empty()) {
        SE_LOGD("XMLHttpRequest::onResponse, %s completed\n", tag.c_str());
    }

    auto statusCode       = response->getResponseCode();
    char statusString[64] = {0};
    sprintf(statusString, "HTTP Status Code: %ld, tag = %s", statusCode, tag.c_str());

    _responseText.clear();
    _responseData.clear();

    if (!response->isSucceed()) {
        std::string errorBuffer = response->getErrorBuffer();
        SE_LOGD("Response failed, error buffer: %s\n", errorBuffer.c_str());
        if (statusCode == 0 || statusCode == -1) {
            _errorFlag = true;
            _status    = 0;
            _statusText.clear();
            if (onerror != nullptr) {
                onerror();
            }

            _isLoadEnd = true;
            if (onloadend != nullptr) {
                onloadend();
            }
            return;
        }
    }

    // set header
    std::vector<char> *headers = response->getResponseHeader();

    std::string header(headers->begin(), headers->end());

    std::istringstream stream(header);
    std::string        line;
    while (std::getline(stream, line)) {
        getHeader(line);
    }

    /** get the response data **/
    std::vector<char> *buffer = response->getResponseData();

    if (_responseType == ResponseType::STRING || _responseType == ResponseType::JSON) {
        _responseText.append(buffer->data(), buffer->size());
    } else {
        _responseData.copy(reinterpret_cast<unsigned char *>(buffer->data()), static_cast<ssize_t>(buffer->size()));
    }

    _status = statusCode;

    setReadyState(ReadyState::DONE);

    if (onload != nullptr) {
        onload();
    }

    _isLoadEnd = true;
    if (onloadend != nullptr) {
        onloadend();
    }
}

void XMLHttpRequest::overrideMimeType(const std::string &mimeType) {
    _overrideMimeType = mimeType;
}

std::string XMLHttpRequest::getMimeType() const {
    if (!_overrideMimeType.empty()) {
        return _overrideMimeType;
    }
    auto contentType = getResponseHeader("Content-Type");
    return contentType.empty() ? "text" : contentType;
}

void XMLHttpRequest::sendRequest() {
    if (_isSending) {
        //ref https://xhr.spec.whatwg.org/#the-send()-method
        // TODO(unknown): if send() flag is set, an exception should be thrown out.
        return;
    }
    _isSending = true;
    _isTimeout = false;
    if (_timeoutInMilliseconds > 0) {
        CC_CURRENT_ENGINE()->getScheduler()->schedule([this](float /* dt */) {
            if (ontimeout != nullptr) {
                ontimeout();
            }
            _isTimeout  = true;
            _readyState = ReadyState::UNSENT;
        },
                                                      this, static_cast<float>(_timeoutInMilliseconds) / 1000.0F, 0, 0.0F, false, "XMLHttpRequest");
    }
    setHttpRequestHeader();

    _httpRequest->setResponseCallback(CC_CALLBACK_2(XMLHttpRequest::onResponse, this)); //NOLINT
    cc::network::HttpClient::getInstance()->sendImmediate(_httpRequest);

    if (onloadstart != nullptr) {
        onloadstart();
    }

    _isLoadStart = true;
}

void XMLHttpRequest::setHttpRequestData(const char *data, size_t len) {
    if (len > 0 &&
        (_method == "post" || _method == "POST" || _method == "put" || _method == "PUT")) {
        _httpRequest->setRequestData(data, len);
    }
}

void XMLHttpRequest::setRequestHeader(const std::string &key, const std::string &value) {
    std::stringstream header_s; // NOLINT(readability-identifier-naming)
    std::stringstream value_s;  // NOLINT(readability-identifier-naming)
    std::string       header;

    auto iter = _requestHeader.find(key);

    // Concatenate values when header exists.
    if (iter != _requestHeader.end()) {
        value_s << iter->second << "," << value;
    } else {
        value_s << value;
    }

    _requestHeader[key] = value_s.str();
}

std::string XMLHttpRequest::getAllResponseHeaders() const {
    std::stringstream responseheaders;
    std::string       responseheader;

    for (const auto &it : _httpHeader) {
        responseheaders << it.first << ": " << it.second << "\n";
    }

    responseheader = responseheaders.str();
    return responseheader;
}

std::string XMLHttpRequest::getResponseHeader(const std::string &key) const {
    std::string ret;
    std::string value = key;
    std::transform(value.begin(), value.end(), value.begin(), ::tolower);

    auto iter = _httpHeader.find(value);
    if (iter != _httpHeader.end()) {
        ret = iter->second;
    }
    return ret;
}

void XMLHttpRequest::setHttpRequestHeader() {
    std::vector<std::string> header;

    for (auto &it : _requestHeader) {
        const char *first  = it.first.c_str();
        const char *second = it.second.c_str();
        size_t      len    = sizeof(char) * (strlen(first) + 3 + strlen(second));
        char *      test   = static_cast<char *>(malloc(len));
        memset(test, 0, len);

        strcpy(test, first);
        strcpy(test + strlen(first), ": ");
        strcpy(test + strlen(first) + 2, second);

        header.emplace_back(test);

        free(test);
    }

    if (!header.empty()) {
        _httpRequest->setHeaders(header);
    }
}

se::Class *__jsb_XMLHttpRequest_class = nullptr; //NOLINT(readability-identifier-naming, bugprone-reserved-identifier)

static bool XMLHttpRequest_finalize(se::State &s) { //NOLINT(readability-identifier-naming, google-runtime-references)
    auto *request = static_cast<XMLHttpRequest *>(s.nativeThisObject());
    SE_LOGD("XMLHttpRequest_finalize, %p ... \n", request);
    return true;
}
SE_BIND_FINALIZE_FUNC(XMLHttpRequest_finalize)

static bool XMLHttpRequest_constructor(se::State &s) { //NOLINT(readability-identifier-naming, google-runtime-references)
    auto *request = new XMLHttpRequest();
    s.thisObject()->setPrivateData(request);

    se::Value thiz(s.thisObject());

    auto cb = [thiz](const char *eventName) {
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        se::Object *thizObj = thiz.toObject();

        se::Value func;
        if (thizObj->getProperty(eventName, &func) && func.isObject() && func.toObject()->isFunction()) {
            func.toObject()->call(se::EmptyValueArray, thizObj);
        }
    };

    request->onloadstart = [=]() {
        if (!request->isDiscardedByReset()) {
            thiz.toObject()->root();
            cb("onloadstart");
        }
    };
    request->onload = [=]() {
        if (!request->isDiscardedByReset()) {
            cb("onload");
        }
    };
    request->onloadend = [=]() {
        if (!request->isDiscardedByReset()) {
            //            SE_LOGD("XMLHttpRequest (%p) onloadend ...\n", request);
            cb("onloadend");
            thiz.toObject()->unroot();
        } else {
            SE_LOGD("XMLHttpRequest (%p) onloadend after restart ScriptEngine.\n", request);
            request->release();
        }
    };
    request->onreadystatechange = [=]() {
        if (!request->isDiscardedByReset()) {
            cb("onreadystatechange");
        }
    };
    request->onabort = [=]() {
        if (!request->isDiscardedByReset()) {
            cb("onabort");
        }
    };
    request->onerror = [=]() {
        if (!request->isDiscardedByReset()) {
            cb("onerror");
        }
    };
    request->ontimeout = [=]() {
        if (!request->isDiscardedByReset()) {
            cb("ontimeout");
        }
    };
    return true;
}
SE_BIND_CTOR(XMLHttpRequest_constructor, __jsb_XMLHttpRequest_class, XMLHttpRequest_finalize)

static bool XMLHttpRequest_open(se::State &s) { //NOLINT(readability-identifier-naming, google-runtime-references)
    const auto &args = s.args();
    int         argc = static_cast<int>(args.size());
    if (argc >= 2) {
        auto *      request = static_cast<XMLHttpRequest *>(s.nativeThisObject());
        bool        ok      = false;
        std::string method;
        ok = sevalue_to_native(args[0], &method);
        SE_PRECONDITION2(ok, false, "args[0] isn't a string.");
        std::string url;
        ok = sevalue_to_native(args[1], &url);
        SE_PRECONDITION2(ok, false, "args[1] isn't a string.");
        bool ret = request->open(method, url);
        s.rval().setBoolean(ret);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting >=2", (int)argc);
    return false;
}
SE_BIND_FUNC(XMLHttpRequest_open)

static bool XMLHttpRequest_abort(se::State &s) { //NOLINT(readability-identifier-naming, google-runtime-references)
    auto *request = static_cast<XMLHttpRequest *>(s.nativeThisObject());
    request->abort();
    return true;
}
SE_BIND_FUNC(XMLHttpRequest_abort)

static bool XMLHttpRequest_send(se::State &s) { //NOLINT(readability-identifier-naming, google-runtime-references)
    const auto &args    = s.args();
    size_t      argc    = args.size();
    auto *      request = static_cast<XMLHttpRequest *>(s.nativeThisObject());

    if (argc == 0) {
        request->send();
    } else if (argc > 0) {
        const auto &arg0 = args[0];
        if (arg0.isNullOrUndefined()) {
            request->send();
        } else if (arg0.isString()) {
            request->sendString(arg0.toString());
        } else if (arg0.isObject()) {
            se::Object *obj = arg0.toObject();

            if (obj->isTypedArray()) {
                uint8_t *ptr = nullptr;
                size_t   len = 0;
                if (obj->getTypedArrayData(&ptr, &len)) {
                    Data data;
                    data.copy(ptr, static_cast<ssize_t>(len));
                    request->sendBinary(data);
                } else {
                    SE_REPORT_ERROR("Failed to get data of TypedArray!");
                    return false;
                }
            } else if (obj->isArrayBuffer()) {
                uint8_t *ptr = nullptr;
                size_t   len = 0;
                if (obj->getArrayBufferData(&ptr, &len)) {
                    Data data;
                    data.copy(ptr, static_cast<ssize_t>(len));
                    request->sendBinary(data);
                } else {
                    SE_REPORT_ERROR("Failed to get data of ArrayBufferObject!");
                    return false;
                }
            } else {
                SE_REPORT_ERROR("args[0] isn't a typed array or an array buffer");
                return false;
            }
        } else {
            const char *typeName = "UNKNOWN";
            if (arg0.isBoolean()) {
                typeName = "boolean";
            } else if (arg0.isNumber()) {
                typeName = "number";
            }

            SE_REPORT_ERROR("args[0] type: %s isn't supported!", typeName);
            return false;
        }
    }

    return true;
}
SE_BIND_FUNC(XMLHttpRequest_send)

static bool XMLHttpRequest_setRequestHeader(se::State &s) { //NOLINT(readability-identifier-naming, google-runtime-references)
    const auto &args = s.args();
    size_t      argc = args.size();

    if (argc >= 2) {
        auto *      xhr = static_cast<XMLHttpRequest *>(s.nativeThisObject());
        std::string key;
        bool        ok = sevalue_to_native(args[0], &key);
        SE_PRECONDITION2(ok, false, "args[0] couldn't be converted to string.");
        std::string value;
        ok = sevalue_to_native(args[1], &value);
        SE_PRECONDITION2(ok, false, "args[1] couldn't be converted to string.");
        xhr->setRequestHeader(key, value);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting >=2", (int)argc);
    return false;
}
SE_BIND_FUNC(XMLHttpRequest_setRequestHeader)

static bool XMLHttpRequest_getAllResponseHeaders(se::State &s) { //NOLINT(readability-identifier-naming, google-runtime-references)
    auto *      xhr     = static_cast<XMLHttpRequest *>(s.nativeThisObject());
    std::string headers = xhr->getAllResponseHeaders();
    s.rval().setString(headers);
    return true;
}
SE_BIND_FUNC(XMLHttpRequest_getAllResponseHeaders)

static bool XMLHttpRequest_getResonpseHeader(se::State &s) { //NOLINT(readability-identifier-naming, google-runtime-references)
    const auto &args = s.args();
    size_t      argc = args.size();
    if (argc > 0) {
        auto *      xhr = static_cast<XMLHttpRequest *>(s.nativeThisObject());
        std::string key;
        bool        ok = sevalue_to_native(args[0], &key);
        SE_PRECONDITION2(ok, false, "args[0] couldn't be converted to string.");
        std::string header = xhr->getResponseHeader(key);
        s.rval().setString(header);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting > 0", (int)argc);
    return false;
}
SE_BIND_FUNC(XMLHttpRequest_getResonpseHeader)

static bool XMLHttpRequest_overrideMimeType(se::State &s) { //NOLINT(readability-identifier-naming, google-runtime-references)
    const auto &args = s.args();
    int         argc = static_cast<int>(args.size());
    if (argc > 0 && args[0].isString()) {
        std::string mimeType;
        sevalue_to_native(args[0], &mimeType);
        auto *xhr = static_cast<XMLHttpRequest *>(s.nativeThisObject());
        xhr->overrideMimeType(mimeType);
    }
    return true;
}
SE_BIND_FUNC(XMLHttpRequest_overrideMimeType)

static bool XMLHttpRequest_getMIMEType(se::State &s) { //NOLINT(readability-identifier-naming, google-runtime-references)
    auto *xhr  = static_cast<XMLHttpRequest *>(s.nativeThisObject());
    auto  type = xhr->getMimeType();
    s.rval().setString(type);
    return true;
}
SE_BIND_PROP_GET(XMLHttpRequest_getMIMEType)

// getter

static bool XMLHttpRequest_getReadyState(se::State &s) { //NOLINT(readability-identifier-naming, google-runtime-references)
    auto *xhr = static_cast<XMLHttpRequest *>(s.nativeThisObject());
    s.rval().setInt32(static_cast<int32_t>(xhr->getReadyState()));
    return true;
}
SE_BIND_PROP_GET(XMLHttpRequest_getReadyState)

static bool XMLHttpRequest_getStatus(se::State &s) { //NOLINT(readability-identifier-naming, google-runtime-references)
    auto *xhr = static_cast<XMLHttpRequest *>(s.nativeThisObject());
    s.rval().setUint16(xhr->getStatus());
    return true;
}
SE_BIND_PROP_GET(XMLHttpRequest_getStatus)

static bool XMLHttpRequest_getStatusText(se::State &s) { //NOLINT(readability-identifier-naming, google-runtime-references)
    auto *xhr = static_cast<XMLHttpRequest *>(s.nativeThisObject());
    s.rval().setString(xhr->getStatusText());
    return true;
}
SE_BIND_PROP_GET(XMLHttpRequest_getStatusText)

static bool XMLHttpRequest_getResponseText(se::State &s) { //NOLINT(readability-identifier-naming, google-runtime-references)
    auto *xhr = static_cast<XMLHttpRequest *>(s.nativeThisObject());
    s.rval().setString(xhr->getResponseText());
    return true;
}
SE_BIND_PROP_GET(XMLHttpRequest_getResponseText)

static bool XMLHttpRequest_getResponseXML(se::State &s) { //NOLINT(readability-identifier-naming, google-runtime-references)
    // DOM API is not fully supported in cocos2d-x-lite.
    // `.responseXML` requires a document object that is not possible to fulfill.
    s.rval().setNull();
    return true;
}
SE_BIND_PROP_GET(XMLHttpRequest_getResponseXML)

static bool XMLHttpRequest_getResponse(se::State &s) { //NOLINT(readability-identifier-naming, google-runtime-references)
    auto *xhr = static_cast<XMLHttpRequest *>(s.nativeThisObject());

    if (xhr->getResponseType() == XMLHttpRequest::ResponseType::STRING) {
        s.rval().setString(xhr->getResponseText());
    } else {
        if (xhr->getReadyState() != XMLHttpRequest::ReadyState::DONE) {
            s.rval().setNull();
        } else {
            if (xhr->getResponseType() == XMLHttpRequest::ResponseType::JSON) {
                const std::string &jsonText = xhr->getResponseText();
                se::HandleObject   seObj(se::Object::createJSONObject(jsonText));
                if (!seObj.isEmpty()) {
                    s.rval().setObject(seObj);
                } else {
                    s.rval().setNull();
                }
            } else if (xhr->getResponseType() == XMLHttpRequest::ResponseType::ARRAY_BUFFER) {
                const Data &     data = xhr->getResponseData();
                se::HandleObject seObj(se::Object::createArrayBufferObject(data.getBytes(), data.getSize()));
                if (!seObj.isEmpty()) {
                    s.rval().setObject(seObj);
                } else {
                    s.rval().setNull();
                }
            } else {
                SE_PRECONDITION2(false, false, "Invalid response type");
            }
        }
    }
    return true;
}
SE_BIND_PROP_GET(XMLHttpRequest_getResponse)

static bool XMLHttpRequest_getTimeout(se::State &s) { //NOLINT(readability-identifier-naming, google-runtime-references)
    auto *cobj = static_cast<XMLHttpRequest *>(s.nativeThisObject());
    s.rval().setUint32(cobj->getTimeout());
    return true;
}
SE_BIND_PROP_GET(XMLHttpRequest_getTimeout)

static bool XMLHttpRequest_setTimeout(se::State &s) { //NOLINT(readability-identifier-naming, google-runtime-references)
    const auto &args = s.args();
    int         argc = static_cast<int>(args.size());
    if (argc > 0) {
        auto *   cobj                  = static_cast<XMLHttpRequest *>(s.nativeThisObject());
        uint32_t timeoutInMilliseconds = 0;
        bool     ok                    = sevalue_to_native(args[0], &timeoutInMilliseconds);
        SE_PRECONDITION2(ok, false, "args[0] isn't a number");
        if (timeoutInMilliseconds < 50) {
            SE_LOGE("The timeout value (%u ms) is too small, please note that timeout unit is milliseconds!", timeoutInMilliseconds);
        }
        cobj->setTimeout(timeoutInMilliseconds);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting > 0", argc);
    return false;
}
SE_BIND_PROP_SET(XMLHttpRequest_setTimeout)

static bool XMLHttpRequest_getResponseType(se::State &s) { //NOLINT(readability-identifier-naming, google-runtime-references)
    auto *xhr = static_cast<XMLHttpRequest *>(s.nativeThisObject());
    switch (xhr->getResponseType()) {
        case XMLHttpRequest::ResponseType::STRING:
            s.rval().setString("text");
            break;
        case XMLHttpRequest::ResponseType::ARRAY_BUFFER:
            s.rval().setString("arraybuffer");
            break;
        case XMLHttpRequest::ResponseType::JSON:
            s.rval().setString("json");
            break;
        default:
            break;
    }
    return true;
}
SE_BIND_PROP_GET(XMLHttpRequest_getResponseType)

static bool XMLHttpRequest_setResponseType(se::State &s) { //NOLINT(readability-identifier-naming, google-runtime-references)
    const auto &args = s.args();
    size_t      argc = args.size();

    if (argc > 0) {
        std::string type;
        bool        ok = sevalue_to_native(args[0], &type);
        SE_PRECONDITION2(ok, false, "args[0] couldn't be converted to string!");

        auto *xhr = static_cast<XMLHttpRequest *>(s.nativeThisObject());
        if (type == "text") {
            xhr->setResponseType(XMLHttpRequest::ResponseType::STRING);
        } else if (type == "arraybuffer") {
            xhr->setResponseType(XMLHttpRequest::ResponseType::ARRAY_BUFFER);
        } else if (type == "json") {
            xhr->setResponseType(XMLHttpRequest::ResponseType::JSON);
        } else if (type == "document") {
            xhr->setResponseType(XMLHttpRequest::ResponseType::DOCUMENT);
        } else if (type == "blob") {
            xhr->setResponseType(XMLHttpRequest::ResponseType::BLOB);
        } else {
            SE_PRECONDITION2(false, false, "The response type isn't supported!");
        }
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting > 0", (int)argc);
    return false;
}
SE_BIND_PROP_SET(XMLHttpRequest_setResponseType)

static bool XMLHttpRequest_getWithCredentials(se::State & /*s*/) { //NOLINT(readability-identifier-naming, google-runtime-references)
    SE_LOGD("XMLHttpRequest.withCredentials isn't implemented on JSB!");
    return true;
}
SE_BIND_PROP_GET(XMLHttpRequest_getWithCredentials)

bool register_all_xmlhttprequest(se::Object *global) { //NOLINT(readability-identifier-naming)
    se::Class *cls = se::Class::create("XMLHttpRequest", global, nullptr, _SE(XMLHttpRequest_constructor));
    cls->defineFinalizeFunction(_SE(XMLHttpRequest_finalize));

    cls->defineFunction("open", _SE(XMLHttpRequest_open));
    cls->defineFunction("abort", _SE(XMLHttpRequest_abort));
    cls->defineFunction("send", _SE(XMLHttpRequest_send));
    cls->defineFunction("setRequestHeader", _SE(XMLHttpRequest_setRequestHeader));
    cls->defineFunction("getAllResponseHeaders", _SE(XMLHttpRequest_getAllResponseHeaders));
    cls->defineFunction("getResponseHeader", _SE(XMLHttpRequest_getResonpseHeader));
    cls->defineFunction("overrideMimeType", _SE(XMLHttpRequest_overrideMimeType));
    cls->defineProperty("__mimeType", _SE(XMLHttpRequest_getMIMEType), nullptr);

    cls->defineProperty("readyState", _SE(XMLHttpRequest_getReadyState), nullptr);
    cls->defineProperty("status", _SE(XMLHttpRequest_getStatus), nullptr);
    cls->defineProperty("statusText", _SE(XMLHttpRequest_getStatusText), nullptr);
    cls->defineProperty("responseText", _SE(XMLHttpRequest_getResponseText), nullptr);
    cls->defineProperty("responseXML", _SE(XMLHttpRequest_getResponseXML), nullptr);
    cls->defineProperty("response", _SE(XMLHttpRequest_getResponse), nullptr);
    cls->defineProperty("timeout", _SE(XMLHttpRequest_getTimeout), _SE(XMLHttpRequest_setTimeout));
    cls->defineProperty("responseType", _SE(XMLHttpRequest_getResponseType), _SE(XMLHttpRequest_setResponseType));
    cls->defineProperty("withCredentials", _SE(XMLHttpRequest_getWithCredentials), nullptr);

    cls->install();

    JSBClassType::registerClass<XMLHttpRequest>(cls);

    __jsb_XMLHttpRequest_class = cls;

    se::ScriptEngine::getInstance()->clearException();

    return true;
}
