/****************************************************************************
 Copyright (c) 2015 Chris Hannon http://www.channon.us
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

#include "network/SocketIO.h"
#include <algorithm>
#include <iterator>
#include <sstream>
#include <utility>
#include "application/ApplicationManager.h"
#include "base/memory/Memory.h"
#include "base/Log.h"
#include "base/UTF8.h"
#include "network/HttpClient.h"
#include "network/Uri.h"
#include "network/WebSocket.h"

#include "json/document-wrapper.h"
#include "json/rapidjson.h"
#include "json/stringbuffer.h"
#include "json/writer.h"

namespace cc {

namespace network {

//class declarations

class SocketIOPacketV10x;

class SocketIOPacket {
public:
    enum class SocketIOVersion {
        V09X,
        V10X
    };

    SocketIOPacket();
    virtual ~SocketIOPacket();
    void initWithType(const std::string &packetType);
    void initWithTypeIndex(int index);

    std::string        toString() const;
    virtual int        typeAsNumber() const;
    const std::string &typeForIndex(int index) const;

    void               setEndpoint(const std::string &endpoint) { _endpoint = endpoint; };
    const std::string &getEndpoint() const { return _endpoint; };
    void               setEvent(const std::string &event) { _name = event; };
    const std::string &getEvent() const { return _name; };

    void                     addData(const std::string &data);
    std::vector<std::string> getData() const { return _args; };
    virtual std::string      stringify() const;

    static SocketIOPacket *createPacketWithType(const std::string &type, SocketIOVersion version);
    static SocketIOPacket *createPacketWithTypeIndex(int type, SocketIOVersion version);

protected:
    std::string              _pId;               //id message
    std::string              _ack;               //
    std::string              _name;              //event name
    std::vector<std::string> _args;              //we will be using a vector of strings to store multiple data
    std::string              _endpoint;          //
    std::string              _endpointseparator; //socket.io 1.x requires a ',' between endpoint and payload
    std::string              _type;              //message type
    std::string              _separator;         //for stringify the object
    std::vector<std::string> _types;             //types of messages
};

class SocketIOPacketV10x : public SocketIOPacket {
public:
    SocketIOPacketV10x();
    ~SocketIOPacketV10x() override;
    int         typeAsNumber() const override;
    std::string stringify() const override;

private:
    std::vector<std::string> _typesMessage;
};

SocketIOPacket::SocketIOPacket() : _separator(":") {
    _types.emplace_back("disconnect");
    _types.emplace_back("connect");
    _types.emplace_back("heartbeat");
    _types.emplace_back("message");
    _types.emplace_back("json");
    _types.emplace_back("event");
    _types.emplace_back("ack");
    _types.emplace_back("error");
    _types.emplace_back("noop");
}

SocketIOPacket::~SocketIOPacket() {
    _types.clear();
}

void SocketIOPacket::initWithType(const std::string &packetType) {
    _type = packetType;
}
void SocketIOPacket::initWithTypeIndex(int index) {
    _type = _types.at(index);
}

std::string SocketIOPacket::toString() const {
    std::stringstream encoded;
    encoded << this->typeAsNumber();
    encoded << this->_separator;

    std::string pIdL = _pId;
    if (_ack == "data") {
        pIdL += "+";
    }

    // Do not write pid for acknowledgements
    if (_type != "ack") {
        encoded << pIdL;
    }
    encoded << this->_separator;

    // Add the endpoint for the namespace to be used if not the default namespace "" or "/", and as long as it is not an ACK, heartbeat, or disconnect packet
    if (_endpoint != "/" && !_endpoint.empty() && _type != "ack" && _type != "heartbeat" && _type != "disconnect") {
        encoded << _endpoint << _endpointseparator;
    }
    encoded << this->_separator;

    if (!_args.empty()) {
        std::string ackpId;
        // This is an acknowledgement packet, so, prepend the ack pid to the data
        if (_type == "ack") {
            ackpId += pIdL + "+";
        }

        encoded << ackpId << this->stringify();
    }

    return encoded.str();
}
int SocketIOPacket::typeAsNumber() const {
    std::string::size_type num  = 0;
    auto                   item = std::find(_types.begin(), _types.end(), _type);
    if (item != _types.end()) {
        num = item - _types.begin();
    }
    return static_cast<int>(num);
}
const std::string &SocketIOPacket::typeForIndex(int index) const {
    return _types.at(index);
}

void SocketIOPacket::addData(const std::string &data) {
    this->_args.push_back(data);
}

std::string SocketIOPacket::stringify() const {
    std::string outS;
    if (_type == "message") {
        outS = _args[0];
    } else {
        rapidjson::StringBuffer                    s;
        rapidjson::Writer<rapidjson::StringBuffer> writer(s);

        writer.StartObject();
        writer.String("name");
        writer.String(_name.c_str());

        writer.String("args");

        writer.StartArray();

        for (const auto &item : _args) {
            writer.String(item.c_str());
        }

        writer.EndArray();
        writer.EndObject();

        outS = s.GetString();

        CC_LOG_INFO("create args object: %s:", outS.c_str());
    }

    return outS;
}

SocketIOPacketV10x::SocketIOPacketV10x() {
    _separator         = "";
    _endpointseparator = ",";
    _types.emplace_back("disconnected");
    _types.emplace_back("connected");
    _types.emplace_back("heartbeat");
    _types.emplace_back("pong");
    _types.emplace_back("message");
    _types.emplace_back("upgrade");
    _types.emplace_back("noop");
    _typesMessage.emplace_back("connect");
    _typesMessage.emplace_back("disconnect");
    _typesMessage.emplace_back("event");
    _typesMessage.emplace_back("ack");
    _typesMessage.emplace_back("error");
    _typesMessage.emplace_back("binarevent");
    _typesMessage.emplace_back("binaryack");
}

int SocketIOPacketV10x::typeAsNumber() const {
    std::vector<std::string>::size_type num  = 0;
    auto                                item = std::find(_typesMessage.begin(), _typesMessage.end(), _type);
    if (item != _typesMessage.end()) { //it's a message
        num = item - _typesMessage.begin();
        num += 40;
    } else {
        item = std::find(_types.begin(), _types.end(), _type);
        num += item - _types.begin();
    }
    return static_cast<int>(num);
}

std::string SocketIOPacketV10x::stringify() const {
    std::string outS;

    rapidjson::StringBuffer                    s;
    rapidjson::Writer<rapidjson::StringBuffer> writer(s);

    writer.StartArray();
    writer.String(_name.c_str());

    for (const auto &item : _args) {
        writer.String(item.c_str());
    }

    writer.EndArray();

    outS = s.GetString();

    CC_LOG_INFO("create args object: %s:", outS.c_str());

    return outS;
}

SocketIOPacketV10x::~SocketIOPacketV10x() {
    _types.clear();
    _typesMessage.clear();
}

SocketIOPacket *SocketIOPacket::createPacketWithType(const std::string &type, SocketIOPacket::SocketIOVersion version) {
    SocketIOPacket *ret;
    switch (version) {
        case SocketIOPacket::SocketIOVersion::V09X:
            ret = new (std::nothrow) SocketIOPacket;
            break;
        case SocketIOPacket::SocketIOVersion::V10X:
            ret = new (std::nothrow) SocketIOPacketV10x;
            break;
    }
    ret->initWithType(type);
    return ret;
}

SocketIOPacket *SocketIOPacket::createPacketWithTypeIndex(int type, SocketIOPacket::SocketIOVersion version) {
    SocketIOPacket *ret;
    switch (version) {
        case SocketIOPacket::SocketIOVersion::V09X:
            ret = new (std::nothrow) SocketIOPacket;
            break;
        case SocketIOPacket::SocketIOVersion::V10X:
            return new (std::nothrow) SocketIOPacketV10x;
            break;
    }
    ret->initWithTypeIndex(type);
    return ret;
}

/**
 *  @brief The implementation of the socket.io connection
 *         Clients/endpoints may share the same impl to accomplish multiplexing on the same websocket
 */
class SIOClientImpl : public cc::RefCounted,
                      public WebSocket::Delegate {
private:
    int                             _heartbeat, _timeout;
    std::string                     _sid;
    Uri                             _uri;
    std::string                     _caFilePath;
    bool                            _connected;
    SocketIOPacket::SocketIOVersion _version;

    WebSocket *_ws;

    Map<std::string, SIOClient *> _clients;

public:
    SIOClientImpl(Uri uri, std::string caFilePath);
    ~SIOClientImpl() override;

    static SIOClientImpl *create(const Uri &uri, const std::string &caFilePath);

    void onOpen(WebSocket *ws) override;
    void onMessage(WebSocket *ws, const WebSocket::Data &data) override;
    void onClose(WebSocket *ws) override;
    void onError(WebSocket *ws, const WebSocket::ErrorCode &error) override;

    void        connect();
    void        disconnect();
    static bool init();
    void        handshake();
    void        handshakeResponse(HttpClient *sender, HttpResponse *response);
    void        openSocket();
    void        heartbeat(float dt);

    SIOClient *getClient(const std::string &endpoint);
    void       addClient(const std::string &endpoint, SIOClient *client);

    void connectToEndpoint(const std::string &endpoint);
    void disconnectFromEndpoint(const std::string &endpoint);

    void send(const std::string &endpoint, const std::string &s);
    void send(SocketIOPacket *packet);
    void emit(const std::string &endpoint, const std::string &eventname, const std::string &args);
};

//method implementations

//begin SIOClientImpl methods
SIOClientImpl::SIOClientImpl(Uri uri, std::string caFilePath) : _uri(std::move(uri)),
                                                                _caFilePath(std::move(caFilePath)),
                                                                _connected(false),
                                                                _ws(nullptr) {
}

SIOClientImpl::~SIOClientImpl() {
    assert(!_connected);

    CC_SAFE_RELEASE(_ws);
}

void SIOClientImpl::handshake() {
    CC_LOG_INFO("SIOClientImpl::handshake() called");

    std::stringstream pre;

    if (_uri.isSecure()) {
        pre << "https://";
    } else {
        pre << "http://";
    }

    pre << _uri.getAuthority() << "/socket.io/1/?EIO=2&transport=polling&b64=true";

    auto *request = new (std::nothrow) HttpRequest();
    request->setUrl(pre.str());
    request->setRequestType(HttpRequest::Type::GET);

    request->setResponseCallback([this](auto &&pH1, auto &&pH2) { this->handshakeResponse(std::forward<decltype(pH1)>(pH1), std::forward<decltype(pH2)>(pH2)); });
    request->setTag("handshake");

    CC_LOG_INFO("SIOClientImpl::handshake() waiting");

    if (_uri.isSecure() && !_caFilePath.empty()) {
        HttpClient::getInstance()->setSSLVerification(_caFilePath);
    }
    HttpClient::getInstance()->send(request);

    request->release();
}

void SIOClientImpl::handshakeResponse(HttpClient * /*sender*/, HttpResponse *response) {
    CC_LOG_INFO("SIOClientImpl::handshakeResponse() called");

    if (0 != strlen(response->getHttpRequest()->getTag())) {
        CC_LOG_INFO("%s completed", response->getHttpRequest()->getTag());
    }

    auto statusCode       = static_cast<int32_t>(response->getResponseCode());
    char statusString[64] = {};
    sprintf(statusString, "HTTP Status Code: %d, tag = %s", statusCode, response->getHttpRequest()->getTag());
    CC_LOG_INFO("response code: %ld", statusCode);

    if (!response->isSucceed() || statusCode >= 400) {
        CC_LOG_ERROR("SIOClientImpl::handshake() failed");
        CC_LOG_ERROR("error buffer: %s", response->getErrorBuffer());

        for (auto &client : _clients) {
            client.second->getDelegate()->onError(client.second, response->getErrorBuffer());
        }

        onClose(nullptr);
        return;
    }

    CC_LOG_INFO("SIOClientImpl::handshake() succeeded");

    std::vector<char> *buffer = response->getResponseData();
    std::stringstream  s;
    s.str("");

    for (const auto &iter : *buffer) {
        s << iter;
    }

    CC_LOG_INFO("SIOClientImpl::handshake() dump data: %s", s.str().c_str());

    std::string res = s.str();
    std::string sid;
    int         heartbeat = 0;
    int         timeout   = 0;

    if (res.find('}') != std::string::npos) {
        CC_LOG_INFO("SIOClientImpl::handshake() Socket.IO 1.x detected");
        _version = SocketIOPacket::SocketIOVersion::V10X;
        // sample: 97:0{"sid":"GMkL6lzCmgMvMs9bAAAA","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":60000}
        //         96:0{"sid":"jzrjDlQusSUxLTd3AAAV","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":5000}2:40
        std::string::size_type a;
        std::string::size_type b;
        a                = res.find('{');
        std::string temp = res.substr(a, res.size() - a);

        // find the sid
        a = temp.find(':');
        b = temp.find(',');

        sid = temp.substr(a + 2, b - (a + 3));

        temp = temp.erase(0, b + 1);

        // chomp past the upgrades
        b = temp.find(',');

        temp = temp.erase(0, b + 1);

        // get the pingInterval / heartbeat
        a = temp.find(':');
        b = temp.find(',');

        std::string heartbeatStr = temp.substr(a + 1, b - a);
        heartbeat                = atoi(heartbeatStr.c_str()) / 1000;
        temp                     = temp.erase(0, b + 1);

        // get the timeout
        a = temp.find(':');
        b = temp.find('}');

        std::string timeoutStr = temp.substr(a + 1, b - a);
        timeout                = atoi(timeoutStr.c_str()) / 1000;
        CC_LOG_INFO("done parsing 1.x");

    } else {
        CC_LOG_INFO("SIOClientImpl::handshake() Socket.IO 0.9.x detected");
        _version = SocketIOPacket::SocketIOVersion::V09X;
        // sample: 3GYzE9md2Ig-lm3cf8Rv:60:60:websocket,htmlfile,xhr-polling,jsonp-polling
        size_t pos = 0;

        pos = res.find(':');
        if (pos != std::string::npos) {
            sid = res.substr(0, pos);
            res.erase(0, pos + 1);
        }

        pos = res.find(':');
        if (pos != std::string::npos) {
            heartbeat = atoi(res.substr(pos + 1, res.size()).c_str());
        }

        pos = res.find(':');
        if (pos != std::string::npos) {
            timeout = atoi(res.substr(pos + 1, res.size()).c_str());
        }
    }

    _sid       = sid;
    _heartbeat = heartbeat;
    _timeout   = timeout;

    openSocket();
}

void SIOClientImpl::openSocket() {
    CC_LOG_INFO("SIOClientImpl::openSocket() called");

    std::stringstream s;

    if (_uri.isSecure()) {
        s << "wss://";
    } else {
        s << "ws://";
    }

    switch (_version) {
        case SocketIOPacket::SocketIOVersion::V09X:
            s << _uri.getAuthority() << "/socket.io/1/websocket/" << _sid;
            break;
        case SocketIOPacket::SocketIOVersion::V10X:
            s << _uri.getAuthority() << "/socket.io/1/websocket/?EIO=2&transport=websocket&sid=" << _sid;
            break;
    }

    _ws = new (std::nothrow) WebSocket();
    if (!_ws->init(*this, s.str(), nullptr, _caFilePath)) {
        CC_SAFE_RELEASE_NULL(_ws);
    }
}

bool SIOClientImpl::init() {
    CC_LOG_INFO("SIOClientImpl::init() successful");
    return true;
}

void SIOClientImpl::connect() {
    this->handshake();
}

void SIOClientImpl::disconnect() {
    if (_ws->getReadyState() == WebSocket::State::OPEN) {
        std::string s;
        std::string endpoint;
        s        = "";
        endpoint = "";

        if (_version == SocketIOPacket::SocketIOVersion::V09X) {
            s = "0::" + endpoint;
        } else {
            s = "41" + endpoint;
        }
        _ws->send(s);
    }

    CC_CURRENT_ENGINE()->getScheduler()->unscheduleAllForTarget(this);

    _connected = false;

    SocketIO::getInstance()->removeSocket(_uri.getAuthority());

    // Close websocket connection should be at last.
    _ws->closeAsync();
}

SIOClientImpl *SIOClientImpl::create(const Uri &uri, const std::string &caFilePath) {
    auto *s = new (std::nothrow) SIOClientImpl(uri, caFilePath);

    if (s && s->init()) {
        return s;
    }

    return nullptr;
}

SIOClient *SIOClientImpl::getClient(const std::string &endpoint) {
    return _clients.at(endpoint);
}

void SIOClientImpl::addClient(const std::string &endpoint, SIOClient *client) {
    _clients.insert(endpoint, client);
}

void SIOClientImpl::connectToEndpoint(const std::string &endpoint) {
    SocketIOPacket *packet = SocketIOPacket::createPacketWithType("connect", _version);
    packet->setEndpoint(endpoint);
    this->send(packet);
    delete packet;
}

void SIOClientImpl::disconnectFromEndpoint(const std::string &endpoint) {
    size_t clientCount = _clients.size();

    if (clientCount == 1 || endpoint == "/") {
        CC_LOG_INFO("SIOClientImpl::disconnectFromEndpoint out of endpoints, checking for disconnect");

        if (_connected) {
            this->disconnect();
        }
    } else {
        std::string path = endpoint == "/" ? "" : endpoint;

        std::string s = "0::" + path;

        _ws->send(s);
        _clients.erase(endpoint);
    }
}

void SIOClientImpl::heartbeat(float /*dt*/) {
    SocketIOPacket *packet = SocketIOPacket::createPacketWithType("heartbeat", _version);

    this->send(packet);
    delete packet;

    CC_LOG_INFO("Heartbeat sent");
}

void SIOClientImpl::send(const std::string &endpoint, const std::string &s) {
    switch (_version) {
        case SocketIOPacket::SocketIOVersion::V09X: {
            SocketIOPacket *packet = SocketIOPacket::createPacketWithType("message", _version);
            packet->setEndpoint(endpoint);
            packet->addData(s);
            this->send(packet);
            delete packet;
            break;
        }
        case SocketIOPacket::SocketIOVersion::V10X: {
            this->emit(endpoint, "message", s);
            break;
        }
    }
}

void SIOClientImpl::send(SocketIOPacket *packet) {
    std::string req = packet->toString();
    if (_connected) {
        CC_LOG_INFO("-->SEND:%s", req.data());
        _ws->send(req);
    } else
        CC_LOG_INFO("Cant send the message (%s) because disconnected", req.c_str());
}

void SIOClientImpl::emit(const std::string &endpoint, const std::string &eventname, const std::string &args) {
    CC_LOG_INFO("Emitting event \"%s\"", eventname.c_str());
    SocketIOPacket *packet = SocketIOPacket::createPacketWithType("event", _version);
    packet->setEndpoint(endpoint == "/" ? "" : endpoint);
    packet->setEvent(eventname);
    packet->addData(args);
    this->send(packet);
    delete packet;
}

void SIOClientImpl::onOpen(WebSocket * /*ws*/) {
    _connected = true;

    SocketIO::getInstance()->addSocket(_uri.getAuthority(), this);

    if (_version == SocketIOPacket::SocketIOVersion::V10X) {
        std::string s = "5"; //That's a ping https://github.com/Automattic/engine.io-parser/blob/1b8e077b2218f4947a69f5ad18be2a512ed54e93/lib/index.js#L21
        _ws->send(s);
    }

    CC_CURRENT_ENGINE()->getScheduler()->schedule([this](auto &&pH1) { this->heartbeat(std::forward<decltype(pH1)>(pH1)); }, this, (static_cast<float>(_heartbeat) * .9F), false, "heartbeat");

    for (auto &client : _clients) {
        client.second->onOpen();
    }

    CC_LOG_INFO("SIOClientImpl::onOpen socket connected!");
}

void SIOClientImpl::onMessage(WebSocket * /*ws*/, const WebSocket::Data &data) {
    CC_LOG_INFO("SIOClientImpl::onMessage received: %s", data.bytes);

    std::string payload = data.bytes;
    int         control = atoi(payload.substr(0, 1).c_str());
    payload             = payload.substr(1, payload.size() - 1);

    SIOClient *c = nullptr;

    switch (_version) {
        case SocketIOPacket::SocketIOVersion::V09X: {
            std::string msgid;
            std::string endpoint;
            std::string sData;
            std::string eventname;

            std::string::size_type pos;
            std::string::size_type pos2;

            pos = payload.find(':');
            if (pos != std::string::npos) {
                payload.erase(0, pos + 1);
            }

            pos = payload.find(':');
            if (pos != std::string::npos) {
                msgid = std::to_string(atoi(payload.substr(0, pos + 1).c_str()));
            }
            payload.erase(0, pos + 1);

            pos = payload.find(':');
            if (pos != std::string::npos) {
                endpoint = payload.substr(0, pos);
                payload.erase(0, pos + 1);
            } else {
                endpoint = payload;
            }

            if (endpoint.empty()) endpoint = "/";

            c = getClient(endpoint);

            sData = payload;

            if (c == nullptr) CC_LOG_INFO("SIOClientImpl::onMessage client lookup returned nullptr");

            switch (control) {
                case 0:
                    CC_LOG_INFO("Received Disconnect Signal for Endpoint: %s\n", endpoint.c_str());
                    disconnectFromEndpoint(endpoint);
                    if (c) {
                        c->fireEvent("disconnect", payload);
                    }
                    break;
                case 1:
                    CC_LOG_INFO("Connected to endpoint: %s \n", endpoint.c_str());
                    if (c) {
                        c->onConnect();
                        c->fireEvent("connect", payload);
                    }
                    break;
                case 2:
                    CC_LOG_INFO("Heartbeat received\n");
                    break;
                case 3:
                    CC_LOG_INFO("Message received: %s \n", sData.c_str());
                    if (c) c->getDelegate()->onMessage(c, sData);
                    if (c) c->fireEvent("message", sData);
                    break;
                case 4:
                    CC_LOG_INFO("JSON Message Received: %s \n", sData.c_str());
                    if (c) c->getDelegate()->onMessage(c, sData);
                    if (c) c->fireEvent("json", sData);
                    break;
                case 5:
                    CC_LOG_INFO("Event Received with data: %s \n", sData.c_str());

                    if (c) {
                        eventname = "";
                        pos       = sData.find(':');
                        pos2      = sData.find(',');
                        if (pos2 > pos) {
                            eventname = sData.substr(pos + 2, pos2 - (pos + 3));
                            sData     = sData.substr(pos2 + 9, sData.size() - (pos2 + 11));
                        }

                        c->fireEvent(eventname, sData);
                    }

                    break;
                case 6:
                    CC_LOG_INFO("Message Ack\n");
                    break;
                case 7:
                    CC_LOG_ERROR("Error\n");
                    //if (c) c->getDelegate()->onError(c, s_data);
                    if (c) c->fireEvent("error", sData);
                    break;
                case 8:
                    CC_LOG_INFO("Noop\n");
                    break;
            }
        } break;
        case SocketIOPacket::SocketIOVersion::V10X: {
            switch (control) {
                case 0:
                    CC_LOG_INFO("Not supposed to receive control 0 for websocket");
                    CC_LOG_INFO("That's not good");
                    break;
                case 1:
                    CC_LOG_INFO("Not supposed to receive control 1 for websocket");
                    break;
                case 2:
                    CC_LOG_INFO("Ping received, send pong");
                    payload = "3" + payload;
                    _ws->send(payload);
                    break;
                case 3:
                    CC_LOG_INFO("Pong received");
                    if (payload == "probe") {
                        CC_LOG_INFO("Request Update");
                        _ws->send("5");
                    }
                    break;
                case 4: {
                    int control2 = payload.at(0) - '0';
                    CC_LOG_INFO("Message code: [%i]", control2);

                    std::string endpoint;

                    std::string::size_type a = payload.find('/');
                    std::string::size_type b = payload.find('[');

                    if (b != std::string::npos) {
                        if (a != std::string::npos && a < b) {
                            //we have an endpoint and a payload
                            endpoint = payload.substr(a, b - (a + 1));
                        }
                    } else if (a != std::string::npos) {
                        //we have an endpoint with no payload
                        endpoint = payload.substr(a, payload.size() - a);
                    }

                    // we didn't find and endpoint and we are in the default namespace
                    if (endpoint.empty()) endpoint = "/";

                    c = getClient(endpoint);

                    payload = payload.substr(1);

                    if (endpoint != "/") payload = payload.substr(endpoint.size());
                    if (endpoint != "/" && !payload.empty()) payload = payload.substr(1);

                    switch (control2) {
                        case 0:
                            CC_LOG_INFO("Socket Connected");
                            if (c) {
                                c->onConnect();
                                c->fireEvent("connect", payload);
                            }
                            break;
                        case 1:
                            CC_LOG_INFO("Socket Disconnected");
                            disconnectFromEndpoint(endpoint);
                            c->fireEvent("disconnect", payload);
                            break;
                        case 2: {
                            CC_LOG_INFO("Event Received (%s)", payload.c_str());

                            std::string::size_type payloadFirstSlashPos  = payload.find('\"');
                            std::string::size_type payloadSecondSlashPos = payload.substr(payloadFirstSlashPos + 1).find('\"');

                            std::string eventname = payload.substr(payloadFirstSlashPos + 1,
                                                                   payloadSecondSlashPos - payloadFirstSlashPos + 1);

                            CC_LOG_INFO("event name %s between %i and %i", eventname.c_str(),
                                        payloadFirstSlashPos, payloadSecondSlashPos);

                            payload = payload.substr(payloadSecondSlashPos + 4,
                                                     payload.size() - (payloadSecondSlashPos + 5));

                            if (c) c->fireEvent(eventname, payload);
                            if (c) c->getDelegate()->onMessage(c, payload);

                        } break;
                        case 3:
                            CC_LOG_INFO("Message Ack");
                            break;
                        case 4:
                            CC_LOG_ERROR("Error");
                            if (c) c->fireEvent("error", payload);
                            break;
                        case 5:
                            CC_LOG_INFO("Binary Event");
                            break;
                        case 6:
                            CC_LOG_INFO("Binary Ack");
                            break;
                    }
                } break;
                case 5:
                    CC_LOG_INFO("Upgrade required");
                    break;
                case 6:
                    CC_LOG_INFO("Noop\n");
                    break;
            }
        } break;
    }
}

void SIOClientImpl::onClose(WebSocket * /*ws*/) {
    if (!_clients.empty()) {
        for (auto &client : _clients) {
            client.second->socketClosed();
        }
        // discard this client
        _connected = false;
        if (CC_CURRENT_APPLICATION() != nullptr) {
            CC_CURRENT_APPLICATION()->getEngine()->getScheduler()->unscheduleAllForTarget(this);
        }

        SocketIO::getInstance()->removeSocket(_uri.getAuthority());
        _clients.clear();
    }

    this->release();
}

void SIOClientImpl::onError(WebSocket * /*ws*/, const WebSocket::ErrorCode &error) {
    CC_LOG_ERROR("Websocket error received: %d", static_cast<int>(error));
}

//begin SIOClient methods
SIOClient::SIOClient(std::string path, SIOClientImpl *impl, SocketIO::SIODelegate &delegate)
: _path(std::move(path)),
  _connected(false),
  _socket(impl),
  _delegate(&delegate) {
    static uint32_t instanceIdCounter = 0;
    _instanceId                       = instanceIdCounter++;
}

SIOClient::~SIOClient() {
    assert(!_connected);
}

void SIOClient::onOpen() {
    if (_path != "/") {
        _socket->connectToEndpoint(_path);
    }
}

void SIOClient::onConnect() {
    _connected = true;
}

void SIOClient::send(const std::string &s) {
    if (_connected) {
        _socket->send(_path, s);
    } else {
        _delegate->onError(this, "Client not yet connected");
    }
}

void SIOClient::emit(const std::string &eventname, const std::string &args) {
    if (_connected) {
        _socket->emit(_path, eventname, args);
    } else {
        _delegate->onError(this, "Client not yet connected");
    }
}

void SIOClient::disconnect() {
    if (_connected) {
        _connected = false;
        _socket->disconnectFromEndpoint(_path);
    }
}

void SIOClient::socketClosed() {
    _connected = false;

    _delegate->onClose(this);

    this->release();
}

void SIOClient::on(const std::string &eventName, SIOEvent e) {
    _eventRegistry[eventName] = std::move(e);
}

void SIOClient::fireEvent(const std::string &eventName, const std::string &data) {
    CC_LOG_INFO("SIOClient::fireEvent called with event name: %s and data: %s", eventName.c_str(), data.c_str());

    _delegate->fireEventToScript(this, eventName, data);

    if (_eventRegistry[eventName]) {
        SIOEvent e = _eventRegistry[eventName];

        e(this, data);

        return;
    }

    CC_LOG_INFO("SIOClient::fireEvent no native event with name %s found", eventName.c_str());
}

void SIOClient::setTag(const char *tag) {
    _tag = tag;
}

uint32_t SIOClient::getInstanceId() const {
    return _instanceId;
}

//begin SocketIO methods
SocketIO *SocketIO::inst = nullptr;

SocketIO::SocketIO() = default;

SocketIO::~SocketIO() = default;

SocketIO *SocketIO::getInstance() {
    if (nullptr == inst) {
        inst = new (std::nothrow) SocketIO();
    }

    return inst;
}

void SocketIO::destroyInstance() {
    CC_SAFE_DELETE(inst);
}

SIOClient *SocketIO::connect(SIODelegate &delegate, const std::string &uri) {
    return SocketIO::connect(uri, delegate);
}

SIOClient *SocketIO::connect(const std::string &uri, SIODelegate &delegate) {
    return SocketIO::connect(uri, delegate, "");
}

SIOClient *SocketIO::connect(const std::string &uri, SIODelegate &delegate, const std::string &caFilePath) {
    Uri uriObj = Uri::parse(uri);

    SIOClientImpl *socket = SocketIO::getInstance()->getSocket(uriObj.getAuthority());
    SIOClient *    c      = nullptr;

    std::string path = uriObj.getPath();
    if (path.empty()) {
        path = "/";
    }

    if (socket == nullptr) {
        //create a new socket, new client, connect
        socket = SIOClientImpl::create(uriObj, caFilePath);

        c = new (std::nothrow) SIOClient(path, socket, delegate);

        socket->addClient(path, c);

        socket->connect();
    } else {
        //check if already connected to endpoint, handle
        c = socket->getClient(path);

        if (c == nullptr) {
            c = new (std::nothrow) SIOClient(path, socket, delegate);

            socket->addClient(path, c);

            socket->connectToEndpoint(path);
        } else {
            CC_LOG_DEBUG("SocketIO: disconnect previous client");
            c->disconnect();

            CC_LOG_DEBUG("SocketIO: recreate a new socket, new client, connect");
            SIOClientImpl *newSocket = SIOClientImpl::create(uriObj, caFilePath);
            auto *         newC      = new (std::nothrow) SIOClient(path, newSocket, delegate);

            newSocket->addClient(path, newC);
            newSocket->connect();

            return newC;
        }
    }

    return c;
}

SIOClientImpl *SocketIO::getSocket(const std::string &uri) {
    return _sockets.at(uri);
}

void SocketIO::addSocket(const std::string &uri, SIOClientImpl *socket) {
    _sockets.insert(uri, socket);
}

void SocketIO::removeSocket(const std::string &uri) {
    _sockets.erase(uri);
}

} // namespace network

} // namespace cc
