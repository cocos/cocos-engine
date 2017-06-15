#pragma once

#include "network/HttpClient.h"
#include "base/CCData.h"

#include <unordered_map>
#include <string>
#include <functional>

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

    unsigned long long _timeout;
    bool _withCredentialsValue;
    bool _errorFlag;
    bool _isAborted;

    std::unordered_map<std::string, std::string> _httpHeader;
    std::unordered_map<std::string, std::string> _requestHeader;

    cocos2d::network::HttpRequest*  _httpRequest;
};


void jsb_register_XMLHttpRequest();

