/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
#include "base/ccConfig.h"
#include "jsb_xmlhttprequest.hpp"
#if (USE_NET_WORK > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include <unordered_map>
#include <string>
#include <functional>
#include <algorithm>
#include <sstream>
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/network/HttpClient.h"
#include "cocos/base/CCData.h"
#include "platform/CCApplication.h"

using namespace cocos2d;
using namespace cocos2d::network;

class XMLHttpRequest : public Ref
{
public:

    // Ready States: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
    enum class ReadyState : char
    {
        UNSENT = 0, // Client has been created. open() not called yet.
        OPENED = 1, // open() has been called.
        HEADERS_RECEIVED = 2, // send() has been called, and headers and status are available.
        LOADING = 3, // Downloading; responseText holds partial data.
        DONE = 4 // The operation is complete.
    };

    enum class ResponseType : char
    {
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


    bool open(const std::string& method, const std::string& url);
    void send();
    void sendString(const std::string& str);
    void sendBinary(const cocos2d::Data& data);

    void setRequestHeader(const std::string& key, const std::string& value);
    std::string getAllResponseHeaders() const;
    std::string getResonpseHeader(const std::string& key) const;

    ReadyState getReadyState() const { return _readyState; }
    uint16_t getStatus() const { return _status; }
    const std::string& getStatusText() const { return _statusText; }
    const std::string& getResponseText() const { return _responseText; }
    const cocos2d::Data& getResponseData() const { return _responseData; }
    ResponseType getResponseType() const { return _responseType; }
    void setResponseType(ResponseType type) { _responseType = type; }

    void overrideMimeType(const std::string &mimeType);
    std::string getMimeType() const;

    void setTimeout(unsigned long timeoutInMilliseconds);
    unsigned long getTimeout() const;

    void abort();

    bool isDiscardedByReset() const { return _isDiscardedByReset; }

private:
    virtual ~XMLHttpRequest();

    void setReadyState(ReadyState readyState);
    void getHeader(const std::string& header);
    void onResponse(cocos2d::network::HttpClient* client, cocos2d::network::HttpResponse* response);

    void setHttpRequestData(const char* data, size_t len);
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

    cocos2d::Data _responseData;

    cocos2d::network::HttpRequest*  _httpRequest;
//    cocos2d::EventListenerCustom* _resetDirectorListener;

    unsigned long _timeoutInMilliseconds;
    uint16_t _status;

    ResponseType _responseType;
    ReadyState _readyState;

    bool _withCredentialsValue;
    bool _errorFlag;
    bool _isAborted;
    bool _isLoadStart;
    bool _isLoadEnd;
    bool _isDiscardedByReset;
};

XMLHttpRequest::XMLHttpRequest()
: onloadstart(nullptr)
, onload(nullptr)
, onloadend(nullptr)
, onreadystatechange(nullptr)
, onabort(nullptr)
, onerror(nullptr)
, ontimeout(nullptr)
, _httpRequest(new (std::nothrow) HttpRequest())
, _timeoutInMilliseconds(0UL)
, _status(0)
, _responseType(ResponseType:: STRING)
, _readyState(ReadyState::UNSENT)
, _withCredentialsValue(false)
, _errorFlag(false)
, _isAborted(false)
, _isLoadStart(false)
, _isLoadEnd(false)
, _isDiscardedByReset(false)
{
}

XMLHttpRequest::~XMLHttpRequest()
{
    Application::getInstance()->getScheduler()->unscheduleAllForTarget(this);

    CC_SAFE_RELEASE(_httpRequest);
}

bool XMLHttpRequest::open(const std::string& method, const std::string& url)
{
    if (_readyState != ReadyState::UNSENT)
        return false;

    _method = method;
    _url = url;

    HttpRequest::Type requestType = HttpRequest::Type::UNKNOWN;

    if (_method == "get" || _method == "GET")
        requestType = HttpRequest::Type::GET;
    else if (_method == "post" || _method == "POST")
        requestType = HttpRequest::Type::POST;
    else if (_method == "put" || _method == "PUT")
        requestType = HttpRequest::Type::PUT;
    else if (_method == "delete" || _method == "DELETE")
        requestType = HttpRequest::Type::DELETE;

    CCASSERT(requestType != HttpRequest::Type::UNKNOWN, (std::string("XMLHttpRequest.open: Unknown method: ") + method).c_str());

    _httpRequest->setRequestType(requestType);
    _httpRequest->setUrl(_url);

    _status = 0;
    _isAborted = false;

    setReadyState(ReadyState::OPENED);

    return true;
}

void XMLHttpRequest::send()
{
    sendRequest();
}

void XMLHttpRequest::sendString(const std::string& str)
{
    setHttpRequestData(str.c_str(), str.length());
    sendRequest();
}

void XMLHttpRequest::sendBinary(const Data& data)
{
    setHttpRequestData((const char*)data.getBytes(), data.getSize());
    sendRequest();
}

void XMLHttpRequest::setTimeout(unsigned long timeoutInMilliseconds)
{
    _timeoutInMilliseconds = timeoutInMilliseconds;
    _httpRequest->setTimeout(timeoutInMilliseconds / 1000.0f + 2.0f); // Add 2 seconds more to ensure the timeout scheduler is invoked before http response.
}

unsigned long XMLHttpRequest::getTimeout() const
{
    return _httpRequest->getTimeout() * 1000.0f;
}

void XMLHttpRequest::abort()
{
    if (!_isLoadStart)
        return;

    _isAborted = true;

    setReadyState(ReadyState::DONE);

    if (onabort != nullptr)
    {
        onabort();
    }

    _isLoadEnd = true;
    if (onloadend != nullptr)
    {
        onloadend();
    }

    _readyState = ReadyState::UNSENT;
}

void XMLHttpRequest::setReadyState(ReadyState readyState)
{
    if (_readyState != readyState)
    {
        _readyState = readyState;
        if (onreadystatechange != nullptr)
        {
            onreadystatechange();
        }
    }
}

void XMLHttpRequest::getHeader(const std::string& header)
{
    // check for colon.
    size_t found_header_field = header.find_first_of(":");

    if (found_header_field != std::string::npos)
    {
        // Found a header field.
        std::string http_field;
        std::string http_value;

        http_field = header.substr(0,found_header_field);
        http_value = header.substr(found_header_field+1, header.length());

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

    }
    else
    {
        // Get Header and Set StatusText
        // Split String into Tokens
        char* cstr = new (std::nothrow) char [header.length()+1];

        // Seems like we have the response Code! Parse it and check for it.
        char* pch;
        strncpy(cstr, header.c_str(), header.length());
        cstr[header.length()] = '\0';

        pch = strtok(cstr, " ");
        while (pch != nullptr)
        {
            std::stringstream ss;
            std::string val;

            ss << pch;
            val = ss.str();
            size_t found_http = val.find("HTTP");

            // Check for HTTP Header to set statusText
            if (found_http != std::string::npos) {

                std::stringstream mystream;

                // Get Response Status
                pch = strtok (nullptr, " ");
                //mystream << pch;    //ignore HTTP statusCode 

                pch = strtok (nullptr, " ");
                mystream << pch;

                _statusText = mystream.str();
                
            }
            
            pch = strtok (nullptr, " ");
        }

        CC_SAFE_DELETE_ARRAY(cstr);
    }
}

void XMLHttpRequest::onResponse(HttpClient* client, HttpResponse* response)
{
    Application::getInstance()->getScheduler()->unscheduleAllForTarget(this);

    if (_isAborted || _readyState == ReadyState::UNSENT)
    {
        return;
    }

    std::string tag = response->getHttpRequest()->getTag();
    if (!tag.empty())
    {
        SE_LOGD("XMLHttpRequest::onResponse, %s completed\n", tag.c_str());
    }

    long statusCode = response->getResponseCode();
    char statusString[64] = {0};
    sprintf(statusString, "HTTP Status Code: %ld, tag = %s", statusCode, tag.c_str());

    _responseText.clear();
    _responseData.clear();

    if (!response->isSucceed())
    {
        std::string errorBuffer = response->getErrorBuffer();
        SE_LOGD("Response failed, error buffer: %s\n", errorBuffer.c_str());
        if (statusCode == 0 || statusCode == -1)
        {
            _errorFlag = true;
            _status = 0;
            _statusText.clear();
            if (onerror != nullptr)
            {
                onerror();
            }

            _isLoadEnd = true;
            if (onloadend != nullptr)
            {
                onloadend();
            }
            return;
        }
    }

    // set header
    std::vector<char> *headers = response->getResponseHeader();

    std::string header(headers->begin(), headers->end());

    std::istringstream stream(header);
    std::string line;
    while(std::getline(stream, line))
    {
        getHeader(line);
    }

    /** get the response data **/
    std::vector<char>* buffer = response->getResponseData();

    if (_responseType == ResponseType::STRING || _responseType == ResponseType::JSON)
    {
        _responseText.append(buffer->data(), buffer->size());
    }
    else
    {
        _responseData.copy((unsigned char*)buffer->data(), buffer->size());
    }

    _status = statusCode;

    setReadyState(ReadyState::DONE);

    if (onload != nullptr)
    {
        onload();
    }

    _isLoadEnd = true;
    if (onloadend != nullptr)
    {
        onloadend();
    }
}

void XMLHttpRequest::overrideMimeType(const std::string &mimeType)
{
    _overrideMimeType = mimeType;
}

std::string XMLHttpRequest::getMimeType() const
{
    if (!_overrideMimeType.empty()) {
        return _overrideMimeType;
    }
    auto contentType = getResonpseHeader("Content-Type");
    return contentType.empty() ? "text" : contentType;
}

void XMLHttpRequest::sendRequest()
{
    if (_timeoutInMilliseconds > 0)
    {
        Application::getInstance()->getScheduler()->schedule([this](float dt){
            if (ontimeout != nullptr)
                ontimeout();

            _readyState = ReadyState::UNSENT;

            _isLoadEnd = true;
            if (onloadend != nullptr)
                onloadend();

        }, this, _timeoutInMilliseconds / 1000.0f, 0, 0.0f, false, "XMLHttpRequest");
    }
    setHttpRequestHeader();

    _httpRequest->setResponseCallback(CC_CALLBACK_2(XMLHttpRequest::onResponse, this));
    cocos2d::network::HttpClient::getInstance()->sendImmediate(_httpRequest);

    if (onloadstart != nullptr)
    {
        onloadstart();
    }

    _isLoadStart = true;
}

void XMLHttpRequest::setHttpRequestData(const char* data, size_t len)
{
    if (len > 0 &&
        (_method == "post" || _method == "POST" || _method == "put" || _method == "PUT"))
    {
        _httpRequest->setRequestData(data, len);
    }
}

void XMLHttpRequest::setRequestHeader(const std::string& key, const std::string& value)
{
    std::stringstream header_s;
    std::stringstream value_s;
    std::string header;

    auto iter = _requestHeader.find(key);

    // Concatenate values when header exists.
    if (iter != _requestHeader.end())
    {
        value_s << iter->second << "," << value;
    }
    else
    {
        value_s << value;
    }

    _requestHeader[key] = value_s.str();
}

std::string XMLHttpRequest::getAllResponseHeaders() const
{
    std::stringstream responseheaders;
    std::string responseheader;

    for (auto it = _httpHeader.begin(); it != _httpHeader.end(); ++it)
    {
        responseheaders << it->first << ": " << it->second << "\n";
    }

    responseheader = responseheaders.str();
    return responseheader;
}

std::string XMLHttpRequest::getResonpseHeader(const std::string& key) const
{
    std::string ret;
    std::string value = key;
    std::transform(value.begin(), value.end(), value.begin(), ::tolower);

    auto iter = _httpHeader.find(value);
    if (iter != _httpHeader.end())
    {
        ret = iter->second;
    }
    return ret;
}

void XMLHttpRequest::setHttpRequestHeader()
{
    std::vector<std::string> header;

    for (auto it = _requestHeader.begin(); it != _requestHeader.end(); ++it)
    {
        const char* first = it->first.c_str();
        const char* second = it->second.c_str();
        size_t len = sizeof(char) * (strlen(first) + 3 + strlen(second));
        char* test = (char*) malloc(len);
        memset(test, 0, len);

        strcpy(test, first);
        strcpy(test + strlen(first) , ": ");
        strcpy(test + strlen(first) + 2, second);

        header.push_back(test);

        free(test);

    }

    if (!header.empty())
    {
        _httpRequest->setHeaders(header);
    }
}


se::Class* __jsb_XMLHttpRequest_class = nullptr;


static bool XMLHttpRequest_finalize(se::State& s)
{
    XMLHttpRequest* request = (XMLHttpRequest*)s.nativeThisObject();
    SE_LOGD("XMLHttpRequest_finalize, %p ... \n", request);
    if (request->getReferenceCount() == 1)
    {
        request->autorelease();
    }
    else
    {
        request->release();
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(XMLHttpRequest_finalize)


static bool XMLHttpRequest_constructor(se::State& s)
{
    XMLHttpRequest* request = new XMLHttpRequest();
    s.thisObject()->setPrivateData(request);

    se::Value thiz(s.thisObject());

    auto cb = [thiz](const char* eventName){
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;
        
        se::Object* thizObj = thiz.toObject();

        se::Value func;
        if (thizObj->getProperty(eventName, &func) && func.isObject() && func.toObject()->isFunction())
        {
            func.toObject()->call(se::EmptyValueArray, thizObj);
        }
    };

    request->onloadstart = [=](){
        if (!request->isDiscardedByReset())
        {
            thiz.toObject()->root();
            cb("onloadstart");
        }
    };
    request->onload = [=](){
        if (!request->isDiscardedByReset())
        {
            cb("onload");
        }
    };
    request->onloadend = [=](){
        if (!request->isDiscardedByReset())
        {
//            SE_LOGD("XMLHttpRequest (%p) onloadend ...\n", request);
            cb("onloadend");
            thiz.toObject()->unroot();
        }
        else
        {
            SE_LOGD("XMLHttpRequest (%p) onloadend after restart ScriptEngine.\n", request);
            request->release();
        }
    };
    request->onreadystatechange = [=](){
        if (!request->isDiscardedByReset())
        {
            cb("onreadystatechange");
        }
    };
    request->onabort = [=](){
        if (!request->isDiscardedByReset())
        {
            cb("onabort");
        }
    };
    request->onerror = [=](){
        if (!request->isDiscardedByReset())
        {
            cb("onerror");
        }
    };
    request->ontimeout = [=](){
        if (!request->isDiscardedByReset())
        {
            cb("ontimeout");
        }
    };
    return true;
}
SE_BIND_CTOR(XMLHttpRequest_constructor, __jsb_XMLHttpRequest_class, XMLHttpRequest_finalize)

static bool XMLHttpRequest_open(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc >= 2)
    {
        XMLHttpRequest* request = (XMLHttpRequest*)s.nativeThisObject();
        bool ok = false;
        std::string method;
        ok = seval_to_std_string(args[0], &method);
        SE_PRECONDITION2(ok, false, "args[0] isn't a string.");
        std::string url;
        ok = seval_to_std_string(args[1], &url);
        SE_PRECONDITION2(ok, false, "args[1] isn't a string.");
        bool ret = request->open(method, url);
        s.rval().setBoolean(ret);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting >=2", (int)argc);
    return false;
}
SE_BIND_FUNC(XMLHttpRequest_open)

static bool XMLHttpRequest_abort(se::State& s)
{
    XMLHttpRequest* request = (XMLHttpRequest*)s.nativeThisObject();
    request->abort();
    return true;
}
SE_BIND_FUNC(XMLHttpRequest_abort)

static bool XMLHttpRequest_send(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    XMLHttpRequest* request = (XMLHttpRequest*)s.nativeThisObject();

    if (argc == 0)
    {
        request->send();
    }
    else if (argc > 0)
    {
        const auto& arg0 = args[0];
        if (arg0.isNullOrUndefined())
        {
            request->send();
        }
        else if (arg0.isString())
        {
            request->sendString(arg0.toString());
        }
        else if (arg0.isObject())
        {
            se::Object* obj = arg0.toObject();

            if (obj->isTypedArray())
            {
                uint8_t* ptr = nullptr;
                size_t len = 0;
                if (obj->getTypedArrayData(&ptr, &len))
                {
                    Data data;
                    data.copy(ptr, len);
                    request->sendBinary(data);
                }
                else
                {
                    SE_REPORT_ERROR("Failed to get data of TypedArray!");
                    return false;
                }
            }
            else if (obj->isArrayBuffer())
            {
                uint8_t* ptr = nullptr;
                size_t len = 0;
                if (obj->getArrayBufferData(&ptr, &len))
                {
                    Data data;
                    data.copy(ptr, len);
                    request->sendBinary(data);
                }
                else
                {
                    SE_REPORT_ERROR("Failed to get data of ArrayBufferObject!");
                    return false;
                }
            }
            else
            {
                SE_REPORT_ERROR("args[0] isn't a typed array or an array buffer");
                return false;
            }
        }
        else
        {
            const char* typeName = "UNKNOWN";
            if (arg0.isBoolean())
                typeName = "boolean";
            else if (arg0.isNumber())
                typeName = "number";

            SE_REPORT_ERROR("args[0] type: %s isn't supported!", typeName);
            return false;
        }
    }

    return true;
}
SE_BIND_FUNC(XMLHttpRequest_send)

static bool XMLHttpRequest_setRequestHeader(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();

    if (argc >= 2)
    {
        XMLHttpRequest* xhr = (XMLHttpRequest*)s.nativeThisObject();
        std::string key;
        bool ok = seval_to_std_string(args[0], &key);
        SE_PRECONDITION2(ok, false, "args[0] couldn't be converted to string.");
        std::string value;
        ok = seval_to_std_string(args[1], &value);
        SE_PRECONDITION2(ok, false, "args[1] couldn't be converted to string.");
        xhr->setRequestHeader(key, value);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting >=2", (int)argc);
    return false;
}
SE_BIND_FUNC(XMLHttpRequest_setRequestHeader)

static bool XMLHttpRequest_getAllResponseHeaders(se::State& s)
{
    XMLHttpRequest* xhr = (XMLHttpRequest*)s.nativeThisObject();
    std::string headers = xhr->getAllResponseHeaders();
    s.rval().setString(headers);
    return true;
}
SE_BIND_FUNC(XMLHttpRequest_getAllResponseHeaders)

static bool XMLHttpRequest_getResonpseHeader(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc > 0)
    {
        XMLHttpRequest* xhr = (XMLHttpRequest*)s.nativeThisObject();
        std::string key;
        bool ok = seval_to_std_string(args[0], &key);
        SE_PRECONDITION2(ok, false, "args[0] couldn't be converted to string.");
        std::string header = xhr->getResonpseHeader(key);
        s.rval().setString(header);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting > 0", (int)argc);
    return false;
}
SE_BIND_FUNC(XMLHttpRequest_getResonpseHeader)

static bool XMLHttpRequest_overrideMimeType(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if(argc > 0 && args[0].isString())
    {
        std::string mimeType;
        seval_to_std_string(args[0], &mimeType);
        XMLHttpRequest* xhr = (XMLHttpRequest*)s.nativeThisObject();
        xhr->overrideMimeType(mimeType);
    }
    return true;
}
SE_BIND_FUNC(XMLHttpRequest_overrideMimeType)

static bool XMLHttpRequest_getMIMEType(se::State& s)
{
    XMLHttpRequest* xhr = (XMLHttpRequest*)s.nativeThisObject();
    auto type = xhr->getMimeType();
    s.rval().setString(type);
    return true;
}
SE_BIND_PROP_GET(XMLHttpRequest_getMIMEType)

// getter

static bool XMLHttpRequest_getReadyState(se::State& s)
{
    XMLHttpRequest* xhr = (XMLHttpRequest*)s.nativeThisObject();
    s.rval().setInt32((int32_t)xhr->getReadyState());
    return true;
}
SE_BIND_PROP_GET(XMLHttpRequest_getReadyState)

static bool XMLHttpRequest_getStatus(se::State& s)
{
    XMLHttpRequest* xhr = (XMLHttpRequest*)s.nativeThisObject();
    s.rval().setInt32((int32_t)xhr->getStatus());
    return true;
}
SE_BIND_PROP_GET(XMLHttpRequest_getStatus)

static bool XMLHttpRequest_getStatusText(se::State& s)
{
    XMLHttpRequest* xhr = (XMLHttpRequest*)s.nativeThisObject();
    s.rval().setString(xhr->getStatusText());
    return true;
}
SE_BIND_PROP_GET(XMLHttpRequest_getStatusText)

static bool XMLHttpRequest_getResponseText(se::State& s)
{
    XMLHttpRequest* xhr = (XMLHttpRequest*)s.nativeThisObject();
    s.rval().setString(xhr->getResponseText());
    return true;
}
SE_BIND_PROP_GET(XMLHttpRequest_getResponseText)

static bool XMLHttpRequest_getResponseXML(se::State& s)
{
    // DOM API is not fully supported in cocos2d-x-lite.
    // `.responseXML` requires a document object that is not possible to fulfill. 
    s.rval().setNull();
    return true;
}
SE_BIND_PROP_GET(XMLHttpRequest_getResponseXML)

static bool XMLHttpRequest_getResponse(se::State& s)
{
    XMLHttpRequest* xhr = (XMLHttpRequest*)s.nativeThisObject();

    if (xhr->getResponseType() == XMLHttpRequest::ResponseType::STRING)
    {
        s.rval().setString(xhr->getResponseText());
    }
    else
    {
        if (xhr->getReadyState() != XMLHttpRequest::ReadyState::DONE)
        {
            s.rval().setNull();
        }
        else
        {
            if (xhr->getResponseType() == XMLHttpRequest::ResponseType::JSON)
            {
                const std::string& jsonText = xhr->getResponseText();
                se::HandleObject seObj(se::Object::createJSONObject(jsonText));
                if (!seObj.isEmpty())
                {
                    s.rval().setObject(seObj);
                }
                else
                {
                    s.rval().setNull();
                }
            }
            else if (xhr->getResponseType() == XMLHttpRequest::ResponseType::ARRAY_BUFFER)
            {
                const Data& data = xhr->getResponseData();
                se::HandleObject seObj(se::Object::createArrayBufferObject(data.getBytes(), data.getSize()));
                if (!seObj.isEmpty())
                {
                    s.rval().setObject(seObj);
                }
                else
                {
                    s.rval().setNull();
                }
            }
            else
            {
                SE_PRECONDITION2(false, false, "Invalid response type");
            }
        }
    }
    return true;
}
SE_BIND_PROP_GET(XMLHttpRequest_getResponse)

static bool XMLHttpRequest_getTimeout(se::State& s)
{
    XMLHttpRequest* cobj = (XMLHttpRequest*)s.nativeThisObject();
    s.rval().setUlong(cobj->getTimeout());
    return true;
}
SE_BIND_PROP_GET(XMLHttpRequest_getTimeout)

static bool XMLHttpRequest_setTimeout(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc > 0)
    {
        XMLHttpRequest* cobj = (XMLHttpRequest*)s.nativeThisObject();
        unsigned long timeoutInMilliseconds = 0;
        bool ok = seval_to_ulong(args[0], &timeoutInMilliseconds);
        SE_PRECONDITION2(ok, false, "args[0] isn't a number");
        if (timeoutInMilliseconds < 50)
        {
            SE_LOGE("The timeout value (%lu ms) is too small, please note that timeout unit is milliseconds!", timeoutInMilliseconds);
        }
        cobj->setTimeout(timeoutInMilliseconds);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting > 0", argc);
    return false;
}
SE_BIND_PROP_SET(XMLHttpRequest_setTimeout)

static bool XMLHttpRequest_getResponseType(se::State& s)
{
    XMLHttpRequest* xhr = (XMLHttpRequest*)s.nativeThisObject();
    switch(xhr->getResponseType())
    {
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

static bool XMLHttpRequest_setResponseType(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();

    if (argc > 0)
    {
        std::string type;
        bool ok = seval_to_std_string(args[0], &type);
        SE_PRECONDITION2(ok, false, "args[0] couldn't be converted to string!");

        XMLHttpRequest* xhr = (XMLHttpRequest*)s.nativeThisObject();
        if (type == "text")
        {
            xhr->setResponseType(XMLHttpRequest::ResponseType::STRING);
        }
        else if (type == "arraybuffer")
        {
            xhr->setResponseType(XMLHttpRequest::ResponseType::ARRAY_BUFFER);
        }
        else if (type == "json")
        {
            xhr->setResponseType(XMLHttpRequest::ResponseType::JSON);
        }
        else if (type == "document")
        {
            xhr->setResponseType(XMLHttpRequest::ResponseType::DOCUMENT);
        }
        else
        {
            SE_PRECONDITION2(false, false, "The response type isn't supported!");
        }
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting > 0", (int)argc);
    return false;
}
SE_BIND_PROP_SET(XMLHttpRequest_setResponseType)

static bool XMLHttpRequest_getWithCredentials(se::State& s)
{
    SE_LOGD("XMLHttpRequest.withCredentials isn't implemented on JSB!");
    return true;
}
SE_BIND_PROP_GET(XMLHttpRequest_getWithCredentials)

bool register_all_xmlhttprequest(se::Object* global)
{
    se::Class* cls = se::Class::create("XMLHttpRequest", global, nullptr, _SE(XMLHttpRequest_constructor));
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
#endif //#if (USE_NET_WORK > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
