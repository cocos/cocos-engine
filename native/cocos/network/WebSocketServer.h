/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#if (USE_SOCKET > 0) && (USE_WEBSOCKET_SERVER > 0)

    // clang-format off
    #include "base/Macros.h"
    #include "uv.h"
// clang-format on

    #include <algorithm>
    #include <atomic>
    #include <functional>
    #include <list>
    #include <map>
    #include <memory>
    #include <mutex>
    #include <string>
    #include <thread>
    #include <unordered_map>
    #include <vector>

    #if CC_PLATFORM == CC_PLATFORM_OHOS
        #include "libwebsockets.h"
    #else
        #include "websockets/libwebsockets.h"
    #endif

    #include "cocos/base/Macros.h"

namespace cc {
namespace network {

class WebSocketServer;
class WebSocketServerConnection;

/**
        * receive/send data buffer with reserved bytes
        */
class DataFrame {
public:
    DataFrame(const std::string &data);

    DataFrame(const void *data, int len, bool isBinary = true);

    virtual ~DataFrame();

    void append(unsigned char *p, int len);

    int slice(unsigned char **p, int len);

    int consume(int len);

    int remain() const;

    inline bool isBinary() const { return _isBinary; }
    inline bool isString() const { return !_isBinary; }
    inline bool isFront() const { return _consumed == 0; }

    void setCallback(std::function<void(const std::string &)> callback) {
        _callback = callback;
    }

    void onFinish(const std::string &message) {
        if (_callback) {
            _callback(message);
        }
    }

    inline int size() const { return _underlyingData.size() - LWS_PRE; }

    std::string toString();

    unsigned char *getData() { return _underlyingData.data() + LWS_PRE; }

private:
    std::vector<unsigned char>               _underlyingData;
    int                                      _consumed = 0;
    bool                                     _isBinary = false;
    std::function<void(const std::string &)> _callback;
};

class CC_DLL WebSocketServerConnection {
public:
    WebSocketServerConnection(struct lws *wsi);
    virtual ~WebSocketServerConnection();

    enum ReadyState {
        CONNECTING = 1,
        OPEN       = 2,
        CLOSING    = 3,
        CLOSED     = 4
    };

    void sendTextAsync(const std::string &, std::function<void(const std::string &)> callback);

    void sendBinaryAsync(const void *, size_t len, std::function<void(const std::string &)> callback);

    void closeAsync(int code, std::string reasson);

    /** stream is not implemented*/
    //bool beginBinary();

    /** should implement in JS */
    // bool send();
    // bool sendPing(std::string)

    //int getSocket();
    //std::shared_ptr<WebSocketServer>& getServer();
    //std::string& getPath();

    inline int getReadyState() const {
        return (int)_readyState;
    }

    std::map<std::string, std::string> getHeaders();

    std::vector<std::string> getProtocols();

    inline void setOnClose(std::function<void(int, const std::string &)> cb) {
        _onclose = cb;
    }

    inline void setOnError(std::function<void(const std::string &)> cb) {
        _onerror = cb;
    }

    inline void setOnText(std::function<void(std::shared_ptr<DataFrame>)> cb) {
        _ontext = cb;
    }

    inline void setOnBinary(std::function<void(std::shared_ptr<DataFrame>)> cb) {
        _onbinary = cb;
    }

    inline void setOnData(std::function<void(std::shared_ptr<DataFrame>)> cb) {
        _ondata = cb;
    }

    inline void setOnConnect(std::function<void()> cb) {
        _onconnect = cb;
    }

    inline void setOnEnd(std::function<void()> cb) {
        _onend = cb;
    }

    void onClientCloseInit();

    inline void  setData(void *d) { _data = d; }
    inline void *getData() const { return _data; }

private:
    bool send(std::shared_ptr<DataFrame> data);
    bool close(int code, std::string reasson);

    inline void scheduleSend() {
        if (_wsi)
            lws_callback_on_writable(_wsi);
    }

    void onConnected();
    void onDataReceive(void *in, int len);
    int  onDrainData();
    void onHTTP();
    void onClientCloseInit(int code, const std::string &msg);

    void onDestroyClient();

    struct lws *                          _wsi = nullptr;
    std::map<std::string, std::string>    _headers;
    std::list<std::shared_ptr<DataFrame>> _sendQueue;
    std::shared_ptr<DataFrame>            _prevPkg;
    bool                                  _closed      = false;
    std::string                           _closeReason = "close connection";
    int                                   _closeCode   = 1000;
    std::atomic<ReadyState>               _readyState{ReadyState::CLOSED};

    // Attention: do not reference **this** in callbacks
    std::function<void(int, const std::string &)>   _onclose;
    std::function<void(const std::string &)>        _onerror;
    std::function<void(std::shared_ptr<DataFrame>)> _ontext;
    std::function<void(std::shared_ptr<DataFrame>)> _onbinary;
    std::function<void(std::shared_ptr<DataFrame>)> _ondata;
    std::function<void()>                           _onconnect;
    std::function<void()>                           _onend;
    uv_async_t                                      _async = {0};
    void *                                          _data  = nullptr;

    friend class WebSocketServer;
};

class CC_DLL WebSocketServer {
public:
    WebSocketServer();
    virtual ~WebSocketServer();

    static void listenAsync(std::shared_ptr<WebSocketServer> &server, int port, const std::string &host, std::function<void(const std::string &errorMsg)> callback);
    void        closeAsync(std::function<void(const std::string &errorMsg)> callback = nullptr);

    std::vector<std::shared_ptr<WebSocketServerConnection>> getConnections() const;

    void setOnListening(std::function<void(const std::string &)> cb) {
        _onlistening = cb;
    }

    void setOnError(std::function<void(const std::string &)> cb) {
        _onerror = cb;
    }

    void setOnClose(std::function<void(const std::string &)> cb) {
        _onclose = cb;
    }

    void setOnConnection(std::function<void(std::shared_ptr<WebSocketServerConnection>)> cb) {
        _onconnection = cb;
    }

    inline void setOnEnd(std::function<void()> cb) {
        _onend = cb;
    }

    inline void setOnBegin(std::function<void()> cb) {
        _onbegin = cb;
    }

    inline void  setData(void *d) { _data = d; }
    inline void *getData() const { return _data; }

protected:
    static void listen(std::shared_ptr<WebSocketServer> server, int port, const std::string &host, std::function<void(const std::string &errorMsg)> callback);
    bool        close(std::function<void(const std::string &errorMsg)> callback = nullptr);

    void onCreateClient(struct lws *wsi);
    void onDestroyClient(struct lws *wsi);
    void onCloseClient(struct lws *wsi);
    void onCloseClientInit(struct lws *wsi, void *in, int len);
    void onClientReceive(struct lws *wsi, void *in, int len);
    int  onServerWritable(struct lws *wsi);
    void onClientHTTP(struct lws *wsi);

private:
    std::shared_ptr<WebSocketServerConnection> findConnection(struct lws *wsi);
    void                                       destroyContext();

    std::string  _host;
    lws_context *_ctx   = nullptr;
    uv_async_t   _async = {0};

    mutable std::mutex                                                           _connsMtx;
    std::unordered_map<struct lws *, std::shared_ptr<WebSocketServerConnection>> _conns;

    // Attention: do not reference **this** in callbacks
    std::function<void(const std::string &)>                        _onlistening;
    std::function<void(const std::string &)>                        _onerror;
    std::function<void(const std::string &)>                        _onclose;
    std::function<void(const std::string &)>                        _onclose_cb;
    std::function<void()>                                           _onend;
    std::function<void()>                                           _onbegin;
    std::function<void(std::shared_ptr<WebSocketServerConnection>)> _onconnection;

    enum class ServerThreadState {
        NOT_BOOTED,
        ST_ERROR,
        RUNNING,
        STOPPED,
        DESTROIED
    };
    std::atomic<ServerThreadState> _serverState{ServerThreadState::NOT_BOOTED};
    std::mutex                     _serverLock;
    void *                         _data = nullptr;

public:
    static int _websocketServerCallback(struct lws *wsi, enum lws_callback_reasons reason,
                                        void *user, void *in, size_t len);
};
} // namespace network
} // namespace cc

#endif //#if (USE_SOCKET > 0) && (USE_WEBSOCKET_SERVER > 0)