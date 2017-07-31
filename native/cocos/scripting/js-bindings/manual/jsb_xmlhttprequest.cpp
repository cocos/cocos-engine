//
//  jsb_XMLHttpRequest.cpp
//  cocos2d_js_bindings
//
//  Created by James Chen on 5/15/17.
//
//

#include "jsb_xmlhttprequest.hpp"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/network/HttpClient.h"
#include "cocos/base/CCData.h"

#include <unordered_map>
#include <string>
#include <functional>
#include <algorithm>
#include <sstream>

using namespace cocos2d;
using namespace cocos2d::network;

class XMLHttpRequest
{
public:
    enum class ResponseType
    {
        STRING,
        ARRAY_BUFFER,
        BLOB,
        DOCUMENT,
        JSON
    };

    // Ready States (http://www.w3.org/TR/XMLHttpRequest/#interface-xmlhttprequest)
    static const unsigned short UNSENT = 0;
    static const unsigned short OPENED = 1;
    static const unsigned short HEADERS_RECEIVED = 2;
    static const unsigned short LOADING = 3;
    static const unsigned short DONE = 4;

    std::function<void()> onloadstart;
    std::function<void()> onload;
    std::function<void()> onloadend;
    std::function<void()> onreadystatechange;
    std::function<void()> onabort;
    std::function<void()> onerror;
    std::function<void()> ontimeout;

    XMLHttpRequest();
    ~XMLHttpRequest();

    bool open(const std::string& method, const std::string& url);
    void send();
    void sendString(const std::string& str);
    void sendBinary(const cocos2d::Data& data);

    void setRequestHeader(const std::string& key, const std::string& value);
    std::string getAllResponseHeaders() const;
    std::string getResonpseHeader(const std::string& key) const;

    int getReadyState() const { return _readyState; }
    long getStatus() const { return _status; }
    const std::string& getStatusText() const { return _statusText; }
    const std::string& getResponseText() const { return _responseText; }
    const cocos2d::Data& getResponseData() const { return _responseData; }
    ResponseType getResponseType() const { return _responseType; }
    void setResponseType(ResponseType type) { _responseType = type; }

    void setTimeout(unsigned long timeout) { _timeout = timeout;}
    unsigned long getTimeout() const { return _timeout; }

private:
    void gotHeader(std::string& header);
    void onResponse(cocos2d::network::HttpClient* client, cocos2d::network::HttpResponse* response);

    void setHttpRequestData(const char* data, size_t len);
    void sendRequest();
    void setHttpRequestHeader();

    std::string _url;
    std::string _method;

    ResponseType _responseType;
    std::string _responseText;
    std::string _responseXML;
    cocos2d::Data _responseData;

    int _readyState;
    long _status;
    std::string _statusText;

    unsigned long _timeout;
    bool _withCredentialsValue;
    bool _errorFlag;
    bool _isAborted;

    std::unordered_map<std::string, std::string> _httpHeader;
    std::unordered_map<std::string, std::string> _requestHeader;
    
    cocos2d::network::HttpRequest*  _httpRequest;
};

XMLHttpRequest::XMLHttpRequest()
: onloadstart(nullptr)
, onload(nullptr)
, onloadend(nullptr)
, onreadystatechange(nullptr)
, onabort(nullptr)
, onerror(nullptr)
, ontimeout(nullptr)
, _responseType(ResponseType:: STRING)
, _readyState(UNSENT)
, _status(0)
, _statusText()
, _timeout(0UL)
, _withCredentialsValue(false)
, _errorFlag(false)
, _isAborted(false)
, _httpRequest(new HttpRequest())
{

}

XMLHttpRequest::~XMLHttpRequest()
{
    // We don't need to release _httpRequest here since it will be released in the http callback.
//    CC_SAFE_RELEASE(_httpRequest);
}

bool XMLHttpRequest::open(const std::string& method, const std::string& url)
{
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

    assert(requestType != HttpRequest::Type::UNKNOWN);

    _httpRequest->setRequestType(requestType);
    _httpRequest->setUrl(_url);

    _readyState = OPENED;
    _status = 0;
    _isAborted = false;

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

void XMLHttpRequest::gotHeader(std::string& header)
{
    // Get Header and Set StatusText
    // Split String into Tokens
    char * cstr = new (std::nothrow) char [header.length()+1];

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
        // Seems like we have the response Code! Parse it and check for it.
        char * pch;
        strcpy(cstr, header.c_str());

        pch = strtok(cstr," ");
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
                mystream << pch;

                pch = strtok (nullptr, " ");
                mystream << " " << pch;

                _statusText = mystream.str();
                
            }
            
            pch = strtok (nullptr, " ");
        }
    }
    
    CC_SAFE_DELETE_ARRAY(cstr);
}

void XMLHttpRequest::onResponse(HttpClient* client, HttpResponse* response)
{
//    _elapsedTime = 0;
//    _scheduler->unscheduleAllForTarget(this);

    if(_isAborted || _readyState == UNSENT)
    {
        return;
    }

    std::string tag = response->getHttpRequest()->getTag();
    if (!tag.empty())
    {
        CCLOG("%s completed", tag.c_str());
    }

    long statusCode = response->getResponseCode();
    char statusString[64] = {0};
    sprintf(statusString, "HTTP Status Code: %ld, tag = %s", statusCode, tag.c_str());

    _responseText.clear();
    _responseData.clear();

    if (!response->isSucceed())
    {
        std::string errorBuffer = response->getErrorBuffer();
        CCLOG("Response failed, error buffer: %s", errorBuffer.c_str());
        if (statusCode == 0 || statusCode == -1)
        {
            _errorFlag = true;
            _status = 0;
            _statusText.clear();
            if (onerror != nullptr)
            {
                onerror();
            }

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
    while(std::getline(stream, line)) {
        gotHeader(line);
    }

    /** get the response data **/
    std::vector<char>* buffer = response->getResponseData();

    _status = statusCode;
    _readyState = DONE;

    if (_responseType == ResponseType::STRING || _responseType == ResponseType::JSON)
    {
        _responseText.append(buffer->data(), buffer->size());
    }
    else
    {
        _responseData.copy((unsigned char*)buffer->data(), buffer->size());
    }

    if (onreadystatechange != nullptr)
    {
        onreadystatechange();
    }

    if (onload != nullptr)
    {
        onload();
    }

    if (onloadend != nullptr)
    {
        onloadend();
    }
}

void XMLHttpRequest::sendRequest()
{
    setHttpRequestHeader();

    _httpRequest->setResponseCallback(CC_CALLBACK_2(XMLHttpRequest::onResponse, this));
    cocos2d::network::HttpClient::getInstance()->sendImmediate(_httpRequest);
    _httpRequest->release();

    if (onloadstart != nullptr)
    {
        onloadstart();
    }
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
        memset(test, 0,len);

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
    printf("XMLHttpRequest_finalize ... \n");
    if (s.nativeThisObject())
    {
        XMLHttpRequest* request = (XMLHttpRequest*)s.nativeThisObject();
        delete request;
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
        if (thizObj->getProperty(eventName, &func))
        {
            func.toObject()->call(se::EmptyValueArray, thizObj);
        }
    };

    request->onloadstart = [cb, thiz](){
        thiz.toObject()->root();
        cb("onloadstart");
    };
    request->onload = [cb](){
        cb("onload");
    };
    request->onloadend = [cb, thiz](){
        cb("onloadend");
        thiz.toObject()->unroot();
    };
    request->onreadystatechange = [cb](){
        cb("onreadystatechange");
    };
    request->onabort = [cb](){
        cb("onabort");
    };
    request->onerror = [cb](){
        cb("onerror");
    };
    request->ontimeout = [cb](){
        cb("ontimeout");
    };
    return true;
}
SE_BIND_CTOR(XMLHttpRequest_constructor, __jsb_XMLHttpRequest_class, XMLHttpRequest_finalize)

static bool XMLHttpRequest_open(se::State& s)
{
    const auto& args = s.args();
    XMLHttpRequest* request = (XMLHttpRequest*)s.nativeThisObject();
    const std::string& method = args[0].toString();
    const std::string& url = args[1].toString();
    return request->open(method, url);
}
SE_BIND_FUNC(XMLHttpRequest_open)

static bool XMLHttpRequest_abort(se::State& s)
{
    assert(false);
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
        if (args[0].isString())
        {
            request->sendString(args[0].toString());
        }
        else if (args[0].isObject())
        {
            se::Object* obj = args[0].toObject();

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
                    assert(false);
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
                    assert(false);
                }
            }
            else
            {
                assert(false);
            }
        }
    }

    return true;
}
SE_BIND_FUNC(XMLHttpRequest_send)

static bool XMLHttpRequest_setRequestHeader(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    XMLHttpRequest* xhr = (XMLHttpRequest*)s.nativeThisObject();
    assert(argc == 2);
    assert(args[0].isString() && args[1].isString());
    xhr->setRequestHeader(args[0].toString(), args[1].toString());
    return true;
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
    XMLHttpRequest* xhr = (XMLHttpRequest*)s.nativeThisObject();
    assert(argc > 0);
    assert(args[0].isString());
    std::string header = xhr->getResonpseHeader(args[0].toString());
    s.rval().setString(header);
    return true;
}
SE_BIND_FUNC(XMLHttpRequest_getResonpseHeader)

static bool XMLHttpRequest_overrideMimeType(se::State& s)
{
    assert(false); //FIXME:
    return true;
}
SE_BIND_FUNC(XMLHttpRequest_overrideMimeType)

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
        if (xhr->getReadyState() != XMLHttpRequest::DONE)
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
                assert(false); // FIXME:
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
    XMLHttpRequest* cobj = (XMLHttpRequest*)s.nativeThisObject();
    cobj->setTimeout(s.args()[0].toUlong());
    return true;
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

    if (argc == 1)
    {
        assert(args[0].isString());

        XMLHttpRequest* xhr = (XMLHttpRequest*)s.nativeThisObject();

        const std::string& type = args[0].toString();
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
        else
        {
            assert(false);
        }
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(XMLHttpRequest_setResponseType)

static bool XMLHttpRequest_getWithCredentials(se::State& s)
{
    assert(false);
    return true;
}
SE_BIND_PROP_GET(XMLHttpRequest_getWithCredentials)


bool register_all_xmlhttprequest(se::Object* global)
{
    se::Class* cls = se::Class::create("XMLHttpRequest", global, nullptr, _SE(XMLHttpRequest_constructor));
    cls->defineFinalizedFunction(_SE(XMLHttpRequest_finalize));

    cls->defineFunction("open", _SE(XMLHttpRequest_open));
    cls->defineFunction("abort", _SE(XMLHttpRequest_abort));
    cls->defineFunction("send", _SE(XMLHttpRequest_send));
    cls->defineFunction("setRequestHeader", _SE(XMLHttpRequest_setRequestHeader));
    cls->defineFunction("getAllResponseHeaders", _SE(XMLHttpRequest_getAllResponseHeaders));
    cls->defineFunction("getResponseHeader", _SE(XMLHttpRequest_getResonpseHeader));
    cls->defineFunction("overrideMimeType", _SE(XMLHttpRequest_overrideMimeType));

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
