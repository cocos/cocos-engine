/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

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

// clang-format on

#include <algorithm>
#include <atomic>
#include <functional>
#include <memory>
#include <mutex>
#include <thread>
#include "base/Macros.h"
#include "base/std/container/list.h"
#include "base/std/container/string.h"
#include "base/std/container/vector.h"

#include "base/std/container/unordered_map.h"
#include "uv.h"

#if CC_PLATFORM == CC_PLATFORM_OHOS
    #include "libwebsockets.h"
#else
    #include "websockets/libwebsockets.h"
#endif

namespace cc {
namespace network {

class WebSocketServer;
class WebSocketServerConnection;

/**
        * receive/send data buffer with reserved bytes
        */
class DataFrame {
public:
    explicit DataFrame(const ccstd::string &data);

    DataFrame(const void *data, int len, bool isBinary = true);

    virtual ~DataFrame() = default;

    void append(unsigned char *p, int len);

    int slice(unsigned char **p, int len);

    int consume(int len);

    int remain() const;

    inline bool isBinary() const { return _isBinary; }
    inline bool isString() const { return !_isBinary; }
    inline bool isFront() const { return _consumed == 0; }

    void setCallback(const std::function<void(const ccstd::string &)> &callback) {
        _callback = callback;
    }

    void onFinish(const ccstd::string &message) {
        if (_callback) {
            _callback(message);
        }
    }

    inline int size() const { return static_cast<int>(_underlyingData.size() - LWS_PRE); }

    ccstd::string toString();

    unsigned char *getData() { return _underlyingData.data() + LWS_PRE; }

private:
    ccstd::vector<unsigned char> _underlyingData;
    int _consumed = 0;
    bool _isBinary = false;
    std::function<void(const ccstd::string &)> _callback;
};

class CC_DLL WebSocketServerConnection {
public:
    explicit WebSocketServerConnection(struct lws *wsi);
    virtual ~WebSocketServerConnection();

    enum ReadyState {
        CONNECTING = 1,
        OPEN = 2,
        CLOSING = 3,
        CLOSED = 4
    };

    void sendTextAsync(const ccstd::string &, const std::function<void(const ccstd::string &)> &callback);

    void sendBinaryAsync(const void *, size_t len, const std::function<void(const ccstd::string &)> &callback);

    void closeAsync(int code, const ccstd::string &reason);

    /** stream is not implemented*/
    //bool beginBinary();

    /** should implement in JS */
    // bool send();
    // bool sendPing(ccstd::string)

    //int getSocket();
    //std::shared_ptr<WebSocketServer>& getServer();
    //ccstd::string& getPath();

    inline int getReadyState() const {
        return static_cast<int>(_readyState);
    }

    ccstd::unordered_map<ccstd::string, ccstd::string> getHeaders();

    ccstd::vector<ccstd::string> getProtocols();

    inline void setOnClose(const std::function<void(int, const ccstd::string &)> &cb) {
        _onclose = cb;
    }

    inline void setOnError(const std::function<void(const ccstd::string &)> &cb) {
        _onerror = cb;
    }

    inline void setOnText(const std::function<void(std::shared_ptr<DataFrame>)> &cb) {
        _ontext = cb;
    }

    inline void setOnBinary(const std::function<void(std::shared_ptr<DataFrame>)> &cb) {
        _onbinary = cb;
    }

    inline void setOnMessage(const std::function<void(std::shared_ptr<DataFrame>)> &cb) {
        _onmessage = cb;
    }

    inline void setOnConnect(const std::function<void()> &cb) {
        _onconnect = cb;
    }

    inline void setOnEnd(const std::function<void()> &cb) {
        _onend = cb;
    }

    void onClientCloseInit();

    inline void setData(void *data) { _data = data; }
    inline void *getData() const { return _data; }

private:
    bool send(std::shared_ptr<DataFrame> data);
    bool close(int code, const ccstd::string &reason);

    inline void scheduleSend() {
        if (_wsi) {
            lws_callback_on_writable(_wsi);
        }
    }

    void onConnected();
    void onMessageReceive(void *in, int len);
    int onDrainMessage();
    void onHTTP();
    void onClientCloseInit(int code, const ccstd::string &msg);

    void onDestroyClient();

    struct lws *_wsi = nullptr;
    ccstd::unordered_map<ccstd::string, ccstd::string> _headers;
    ccstd::list<std::shared_ptr<DataFrame>> _sendQueue;
    std::shared_ptr<DataFrame> _prevPkg;
    bool _closed = false;
    ccstd::string _closeReason = "close connection";
    int _closeCode = 1000;
    std::atomic<ReadyState> _readyState{ReadyState::CLOSED};

    // Attention: do not reference **this** in callbacks
    std::function<void(int, const ccstd::string &)> _onclose;
    std::function<void(const ccstd::string &)> _onerror;
    std::function<void(std::shared_ptr<DataFrame>)> _ontext;
    std::function<void(std::shared_ptr<DataFrame>)> _onbinary;
    std::function<void(std::shared_ptr<DataFrame>)> _onmessage;
    std::function<void()> _onconnect;
    std::function<void()> _onend;
    uv_async_t _async = {};
    void *_data = nullptr;

    friend class WebSocketServer;
};

class CC_DLL WebSocketServer {
public:
    WebSocketServer();
    virtual ~WebSocketServer();

    static void listenAsync(std::shared_ptr<WebSocketServer> &server, int port, const ccstd::string &host, const std::function<void(const ccstd::string &errorMsg)> &callback);
    void closeAsync(const std::function<void(const ccstd::string &errorMsg)> &callback = nullptr);

    ccstd::vector<std::shared_ptr<WebSocketServerConnection>> getConnections() const;

    void setOnListening(const std::function<void(const ccstd::string &)> &cb) {
        _onlistening = cb;
    }

    void setOnError(const std::function<void(const ccstd::string &)> &cb) {
        _onerror = cb;
    }

    void setOnClose(const std::function<void(const ccstd::string &)> &cb) {
        _onclose = cb;
    }

    void setOnConnection(const std::function<void(std::shared_ptr<WebSocketServerConnection>)> &cb) {
        _onconnection = cb;
    }

    inline void setOnEnd(const std::function<void()> &cb) {
        _onend = cb;
    }

    inline void setOnBegin(const std::function<void()> &cb) {
        _onbegin = cb;
    }

    inline void setData(void *d) { _data = d; }
    inline void *getData() const { return _data; }

protected:
    static void listen(const std::shared_ptr<WebSocketServer> &server, int port, const ccstd::string &host, const std::function<void(const ccstd::string &errorMsg)> &callback);
    bool close(const std::function<void(const ccstd::string &errorMsg)> &callback = nullptr);

    void onCreateClient(struct lws *wsi);
    void onDestroyClient(struct lws *wsi);
    void onCloseClient(struct lws *wsi);
    void onCloseClientInit(struct lws *wsi, void *in, int len);
    void onClientReceive(struct lws *wsi, void *in, int len);
    int onServerWritable(struct lws *wsi);
    void onClientHTTP(struct lws *wsi);

private:
    std::shared_ptr<WebSocketServerConnection> findConnection(struct lws *wsi);
    void destroyContext();

    ccstd::string _host;
    lws_context *_ctx = nullptr;
    uv_async_t _async = {};

    mutable std::mutex _connsMtx;
    ccstd::unordered_map<struct lws *, std::shared_ptr<WebSocketServerConnection>> _conns;

    // Attention: do not reference **this** in callbacks
    std::function<void(const ccstd::string &)> _onlistening;
    std::function<void(const ccstd::string &)> _onerror;
    std::function<void(const ccstd::string &)> _onclose;
    std::function<void(const ccstd::string &)> _onclose_cb;
    std::function<void()> _onend;
    std::function<void()> _onbegin;
    std::function<void(std::shared_ptr<WebSocketServerConnection>)> _onconnection;

    enum class ServerThreadState {
        NOT_BOOTED,
        ST_ERROR,
        RUNNING,
        STOPPED,
        DESTROYED
    };
    std::atomic<ServerThreadState> _serverState{ServerThreadState::NOT_BOOTED};
    std::mutex _serverLock;
    void *_data = nullptr;

public:
    static int websocketServerCallback(struct lws *wsi, enum lws_callback_reasons reason,
                                       void *user, void *in, size_t len);
};
} // namespace network
} // namespace cc
