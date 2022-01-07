/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
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

/***************************************************************************
* "[WebSocket module] is based in part on the work of the libwebsockets  project
* (http://libwebsockets.org)"
*****************************************************************************/

// clang-format off
#include "base/Macros.h"
#include "uv.h"
// clang-format on

#if __OHOS__ || __LINUX__ || __QNX__
    #include "libwebsockets.h"
#else
    #include "websockets/libwebsockets.h"
#endif

#include <algorithm>
#include <atomic>
#include <cerrno>
#include <condition_variable>
#include <csignal>
#include <list>
#include <memory> // for std::shared_ptr
#include <mutex>
#include <queue>
#include <string>
#include <thread>
#include <vector>
#include "application/ApplicationManager.h"
#include "base/Scheduler.h"
#include "network/Uri.h"
#include "network/WebSocket.h"

#include "platform/FileUtils.h"
#include "platform/StdC.h"

#define NS_NETWORK_BEGIN \
    namespace cc {       \
    namespace network {
#define NS_NETWORK_END \
    }                  \
    }

#define WS_RX_BUFFER_SIZE              (65536)
#define WS_RESERVE_RECEIVE_BUFFER_SIZE (4096)

#if CC_PLATFORM == CC_PLATFORM_ANDROID
    #define WS_ENABLE_LIBUV 1
#else
    #define WS_ENABLE_LIBUV 0
#endif

#ifdef LOG_TAG
    #undef LOG_TAG
#endif
#define LOG_TAG "WebSocket.cpp"

struct lws;
struct LwsProtocols;
struct lws_vhost;

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
// log, CC_LOG_DEBUG aren't threadsafe, since we uses sub threads for parsing pcm data, threadsafe log output
// is needed. Define the following macros (ALOGV, ALOGD, ALOGI, ALOGW, ALOGE) for threadsafe log output.

//IDEA: Move _winLog, winLog to a separated file
static void _winLog(const char *format, va_list args) {
    static const int MAX_LOG_LENGTH = 16 * 1024;
    int              bufferSize     = MAX_LOG_LENGTH;
    char *           buf            = nullptr;

    do {
        buf = new (std::nothrow) char[bufferSize];
        if (buf == nullptr)
            return; // not enough memory

        int ret = vsnprintf(buf, bufferSize - 3, format, args);
        if (ret < 0) {
            bufferSize *= 2;

            delete[] buf;
        } else
            break;

    } while (true);

    strcat(buf, "\n");

    int   pos                         = 0;
    int   len                         = strlen(buf);
    char  tempBuf[MAX_LOG_LENGTH + 1] = {0};
    WCHAR wszBuf[MAX_LOG_LENGTH + 1]  = {0};

    do {
        std::copy(buf + pos, buf + pos + MAX_LOG_LENGTH, tempBuf);

        tempBuf[MAX_LOG_LENGTH] = 0;

        MultiByteToWideChar(CP_UTF8, 0, tempBuf, -1, wszBuf, sizeof(wszBuf));
        OutputDebugStringW(wszBuf);

        pos += MAX_LOG_LENGTH;

    } while (pos < len);

    delete[] buf;
}

static void wsLog(const char *format, ...) {
    va_list args;
    va_start(args, format);
    _winLog(format, args);
    va_end(args);
}

#else
    #define wsLog printf //NOLINT
#endif

#define DO_QUOTEME(x) #x
#define QUOTEME(x)    DO_QUOTEME(x)

// Since CC_LOG_DEBUG isn't thread safe, we uses LOGD for multi-thread logging.
#if CC_PLATFORM == CC_PLATFORM_ANDROID
    #if CC_DEBUG > 0
        #define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, LOG_TAG, __VA_ARGS__)
    #else
        #define LOGD(...)
    #endif

    #define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)
#elif defined(__OHOS__)
    #include "cocos/base/Log.h"
    #define LOGD(...) CC_LOG_DEBUG(__VA_ARGS__)
    #define LOGE(...) CC_LOG_ERROR(__VA_ARGS__)
#else
    #if CC_DEBUG > 0
        #define LOGD(fmt, ...) wsLog("D/" LOG_TAG " (" QUOTEME(__LINE__) "): " fmt "", ##__VA_ARGS__)
    #else
        #define LOGD(fmt, ...)
    #endif

    #define LOGE(fmt, ...) wsLog("E/" LOG_TAG " (" QUOTEME(__LINE__) "): " fmt "", ##__VA_ARGS__)
#endif

static void printWebSocketLog(int level, const char *line) {
#if CC_DEBUG > 0
    static const char *const LOG_LEVEL_NAMES[] = {
        "ERR",
        "WARN",
        "NOTICE",
        "INFO",
        "DEBUG",
        "PARSER",
        "HEADER",
        "EXTENSION",
        "CLIENT",
        "LATENCY",
    };

    char buf[30] = {0};
    int  n;

    for (n = 0; n < LLL_COUNT; n++) {
        if (level != (1 << n)) {
            continue;
        }
        sprintf(buf, "%s: ", LOG_LEVEL_NAMES[n]);
        break;
    }

    LOGD("%s%s\n", buf, line);

#endif // #if CC_DEBUG > 0
}

class WebSocketImpl {
public:
    static void closeAllConnections();
    explicit WebSocketImpl(cc::network::WebSocket *ws);
    ~WebSocketImpl();

    bool init(const cc::network::WebSocket::Delegate &delegate,
              const std::string &                     url,
              const std::vector<std::string> *        protocols  = nullptr,
              const std::string &                     caFilePath = "");

    void                              send(const std::string &message);
    void                              send(const unsigned char *binaryMsg, unsigned int len);
    void                              close();
    void                              closeAsync();
    void                              closeAsync(int code, const std::string &reason);
    cc::network::WebSocket::State     getReadyState() const;
    const std::string &               getUrl() const;
    const std::string &               getProtocol() const;
    cc::network::WebSocket::Delegate *getDelegate() const;

    size_t      getBufferedAmount() const;
    std::string getExtensions() const;

private:
    // The following callback functions are invoked in websocket thread
    void onClientOpenConnectionRequest();
    int  onSocketCallback(struct lws *wsi, enum lws_callback_reasons reason, void *in, ssize_t len);

    int onClientWritable();
    int onClientReceivedData(void *in, ssize_t len);
    int onConnectionOpened();
    int onConnectionError();
    int onConnectionClosed();

    struct lws_vhost *createVhost(struct lws_protocols *protocols, int *sslConnection);

    cc::network::WebSocket *      _ws;
    cc::network::WebSocket::State _readyState;
    std::mutex                    _readyStateMutex;
    std::string                   _url;
    std::vector<char>             _receivedData;

    struct lws *          _wsInstance;
    struct lws_protocols *_lwsProtocols;
    std::string           _clientSupportedProtocols;
    std::string           _selectedProtocol;

    std::shared_ptr<std::atomic<bool>> _isDestroyed;
    cc::network::WebSocket::Delegate * _delegate;

    std::mutex              _closeMutex;
    std::condition_variable _closeCondition;

    std::vector<std::string> _enabledExtensions;

    enum class CloseState {
        NONE,
        SYNC_CLOSING,
        SYNC_CLOSED,
        ASYNC_CLOSING
    };
    CloseState _closeState;

    std::string _caFilePath;

    friend class WsThreadHelper;
    friend class WebSocketCallbackWrapper;
};

enum WsMsg {
    WS_MSG_TO_SUBTRHEAD_SENDING_STRING = 0,
    WS_MSG_TO_SUBTRHEAD_SENDING_BINARY,
    WS_MSG_TO_SUBTHREAD_CREATE_CONNECTION
};

class WsThreadHelper;

static std::vector<WebSocketImpl *> *websocketInstances{nullptr};
static std::recursive_mutex          instanceMutex;
static struct lws_context *          wsContext{nullptr};
static WsThreadHelper *              wsHelper{nullptr};
static std::atomic_bool              wsPolling{false};

#if (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_OHOS)
static std::string getFileNameForPath(const std::string &filePath) {
    std::string  fileName     = filePath;
    const size_t lastSlashIdx = fileName.find_last_of("\\/");
    if (std::string::npos != lastSlashIdx) {
        fileName.erase(0, lastSlashIdx + 1);
    }
    return fileName;
}
#endif

static struct lws_protocols defaultProtocols[2];

static lws_context_creation_info convertToContextCreationInfo(const struct lws_protocols *protocols, bool peerServerCert) {
    lws_context_creation_info info;
    memset(&info, 0, sizeof(info));
    /*
     * create the websocket context.  This tracks open connections and
     * knows how to route any traffic and which protocol version to use,
     * and if each connection is client or server side.
     *
     * For this client-only demo, we tell it to not listen on any port.
     */

    info.port      = CONTEXT_PORT_NO_LISTEN;
    info.protocols = protocols;

    // IDEA: Disable 'permessage-deflate' extension temporarily because of issues:
    // https://github.com/cocos2d/cocos2d-x/issues/16045, https://github.com/cocos2d/cocos2d-x/issues/15767
    // libwebsockets issue: https://github.com/warmcat/libwebsockets/issues/593
    // Currently, we couldn't find out the exact reason.
    // libwebsockets official said it's probably an issue of user code
    // since 'libwebsockets' passed AutoBahn stressed Test.

    //    info.extensions = exts;

    info.gid = -1;
    info.uid = -1;
    if (peerServerCert) {
        info.options = LWS_SERVER_OPTION_EXPLICIT_VHOSTS | LWS_SERVER_OPTION_DO_SSL_GLOBAL_INIT;
    } else {
        info.options = LWS_SERVER_OPTION_EXPLICIT_VHOSTS | LWS_SERVER_OPTION_DO_SSL_GLOBAL_INIT | LWS_SERVER_OPTION_PEER_CERT_NOT_REQUIRED;
    }
#if WS_ENABLE_LIBUV
    info.options |= LWS_SERVER_OPTION_LIBUV;
#endif
    info.user = nullptr;

    return info;
}

class WsMessage {
public:
    WsMessage() : id(++idCount) {}
    unsigned int                  id;
    unsigned int                  what{0}; // message type
    cc::network::WebSocket::Data *data{nullptr};
    void *                        user{nullptr};

private:
    static unsigned int idCount;
};

unsigned int WsMessage::idCount = 0;

/**
 *  @brief Websocket thread helper, it's used for sending message between UI thread and websocket thread.
 */
class WsThreadHelper {
public:
    WsThreadHelper();
    ~WsThreadHelper();

    // Creates a new thread
    bool createWebSocketThread();
    // Quits websocket thread.
    void quitWebSocketThread();

    // Sends message to Cocos thread. It's needed to be invoked in Websocket thread.
    static void sendMessageToCocosThread(const std::function<void()> &cb);

    // Sends message to Websocket thread. It's needs to be invoked in Cocos thread.
    void sendMessageToWebSocketThread(WsMessage *msg);

    size_t countBufferedBytes(const WebSocketImpl *ws);

    // Waits the sub-thread (websocket thread) to exit,
    void joinWebSocketThread() const;

    static void onSubThreadStarted();
    static void onSubThreadLoop();
    static void onSubThreadEnded();

protected:
    void wsThreadEntryFunc() const;

public:
    std::list<WsMessage *> *_subThreadWsMessageQueue;
    std::mutex              _subThreadWsMessageQueueMutex;
    std::thread *           _subThreadInstance{nullptr};

private:
    bool _needQuit{false};
};

// Wrapper for converting websocket callback from static function to member function of WebSocket class.
class WebSocketCallbackWrapper {
public:
    static int onSocketCallback(struct lws *wsi, enum lws_callback_reasons reason, void * /*user*/, void *in, size_t len) {
        // Gets the user data from context. We know that it's a 'WebSocket' instance.
        if (wsi == nullptr) {
            return 0;
        }
        int ret = 0;
        {
            std::lock_guard<std::recursive_mutex> lk(instanceMutex);
            auto *                                ws = static_cast<WebSocketImpl *>(lws_wsi_user(wsi));
            if (ws != nullptr && websocketInstances != nullptr) {
                if (std::find(websocketInstances->begin(), websocketInstances->end(), ws) != websocketInstances->end()) {
                    ret = ws->onSocketCallback(wsi, reason, in, len);
                }
            } else {
                //            LOGD("ws instance is nullptr.\n");
            }
        }

        return ret;
    }
};

// Implementation of WsThreadHelper
WsThreadHelper::WsThreadHelper()

{
    _subThreadWsMessageQueue = new (std::nothrow) std::list<WsMessage *>();
}

WsThreadHelper::~WsThreadHelper() {
    joinWebSocketThread();
    CC_SAFE_DELETE(_subThreadInstance);
    delete _subThreadWsMessageQueue;
}

bool WsThreadHelper::createWebSocketThread() {
    // Creates websocket thread
    _subThreadInstance = new (std::nothrow) std::thread(&WsThreadHelper::wsThreadEntryFunc, this);
    return true;
}

void WsThreadHelper::quitWebSocketThread() {
    _needQuit = true;
}

void WsThreadHelper::onSubThreadLoop() {
    if (wsContext) {
        //        _readyStateMutex.unlock();
        wsHelper->_subThreadWsMessageQueueMutex.lock();
        bool isEmpty = wsHelper->_subThreadWsMessageQueue->empty();

        if (!isEmpty) {
            auto iter = wsHelper->_subThreadWsMessageQueue->begin();
            for (; iter != wsHelper->_subThreadWsMessageQueue->end();) {
                auto *msg = (*iter);
                auto *ws  = static_cast<WebSocketImpl *>(msg->user);
                // REFINE: ws may be a invalid pointer
                if (msg->what == WS_MSG_TO_SUBTHREAD_CREATE_CONNECTION) {
                    ws->onClientOpenConnectionRequest();
                    delete *iter;
                    iter = wsHelper->_subThreadWsMessageQueue->erase(iter);
                } else {
                    ++iter;
                }
            }
        }
        wsHelper->_subThreadWsMessageQueueMutex.unlock();
        // Windows: Cause delay 40ms for event WS_MSG_TO_SUBTHREAD_CREATE_CONNECTION
        // Android: Let libuv lws to decide when to stop
        wsPolling = true;
        lws_service(wsContext, WS_ENABLE_LIBUV ? 40 : 4);
        wsPolling = false;
    }
}

void WsThreadHelper::onSubThreadStarted() {
    int logLevel = LLL_ERR | LLL_WARN | LLL_NOTICE | LLL_INFO /* | LLL_DEBUG | LLL_PARSER | LLL_HEADER*/ | LLL_EXT | LLL_CLIENT | LLL_LATENCY;
    lws_set_log_level(logLevel, printWebSocketLog);

    memset(defaultProtocols, 0, 2 * sizeof(struct lws_protocols));

    defaultProtocols[0].name           = "";
    defaultProtocols[0].callback       = WebSocketCallbackWrapper::onSocketCallback;
    defaultProtocols[0].rx_buffer_size = WS_RX_BUFFER_SIZE;
    defaultProtocols[0].id             = std::numeric_limits<uint32_t>::max();

    lws_context_creation_info creationInfo = convertToContextCreationInfo(defaultProtocols, true);
    wsContext                              = lws_create_context(&creationInfo);
#if WS_ENABLE_LIBUV
    if (lws_uv_initloop(wsContext, nullptr, 0)) {
        LOGE("WsThreadHelper: failed to init libuv");
    }
#endif
}

void WsThreadHelper::onSubThreadEnded() {
    if (wsContext != nullptr) {
        lws_context_destroy(wsContext);
#if WS_ENABLE_LIBUV
        lws_context_destroy2(wsContext);
#endif
    }
}

void WsThreadHelper::wsThreadEntryFunc() const {
    LOGD("WebSocket thread start, helper instance: %p\n", this);
    onSubThreadStarted();

    while (!_needQuit) {
        onSubThreadLoop();
    }

    onSubThreadEnded();

    LOGD("WebSocket thread exit, helper instance: %p\n", this);
}

void WsThreadHelper::sendMessageToCocosThread(const std::function<void()> &cb) {
    if (CC_CURRENT_APPLICATION() != nullptr) {
        CC_CURRENT_APPLICATION()->getEngine()->getScheduler()->performFunctionInCocosThread(cb);
    }
}

void WsThreadHelper::sendMessageToWebSocketThread(WsMessage *msg) {
    std::lock_guard<std::mutex> lk(_subThreadWsMessageQueueMutex);
    _subThreadWsMessageQueue->push_back(msg);
}

size_t WsThreadHelper::countBufferedBytes(const WebSocketImpl *ws) {
    std::lock_guard<std::mutex> lk(_subThreadWsMessageQueueMutex);
    size_t                      total = 0;
    for (auto *msg : *_subThreadWsMessageQueue) {
        if (msg->user == ws && msg->data && (msg->what == WS_MSG_TO_SUBTRHEAD_SENDING_STRING || msg->what == WS_MSG_TO_SUBTRHEAD_SENDING_BINARY)) {
            total += msg->data->getRemain();
        }
    }
    return total;
}

void WsThreadHelper::joinWebSocketThread() const {
    if (_subThreadInstance->joinable()) {
        _subThreadInstance->join();
    }
}

// Define a WebSocket frame
class WebSocketFrame {
public:
    bool init(unsigned char *buf, ssize_t len) {
        if (buf == nullptr && len > 0) {
            return false;
        }

        if (!_data.empty()) {
            LOGD("WebSocketFrame was initialized, should not init it again!\n");
            return false;
        }

        _data.resize(LWS_PRE + len);
        if (len > 0) {
            std::copy(buf, buf + len, _data.begin() + LWS_PRE);
        }

        _payload       = _data.data() + LWS_PRE;
        _payloadLength = len;
        _frameLength   = len;
        return true;
    }

    void update(ssize_t issued) {
        _payloadLength -= issued;
        _payload += issued;
    }

    unsigned char *getPayload() const { return _payload; }
    ssize_t        getPayloadLength() const { return _payloadLength; }
    ssize_t        getFrameLength() const { return _frameLength; }

private:
    unsigned char *_payload{nullptr};
    ssize_t        _payloadLength{0};

    ssize_t                    _frameLength{0};
    std::vector<unsigned char> _data;
};

//

void WebSocketImpl::closeAllConnections() {
    if (websocketInstances != nullptr) {
        ssize_t count = websocketInstances->size();
        for (ssize_t i = count - 1; i >= 0; i--) {
            WebSocketImpl *instance = websocketInstances->at(i);
            instance->close();
        }

        std::lock_guard<std::recursive_mutex> lk(instanceMutex);
        websocketInstances->clear();
        delete websocketInstances;
        websocketInstances = nullptr;
    }
}

WebSocketImpl::WebSocketImpl(cc::network::WebSocket *ws)
: _ws(ws),
  _readyState(cc::network::WebSocket::State::CONNECTING),
  _wsInstance(nullptr),
  _lwsProtocols(nullptr),
  _isDestroyed(std::make_shared<std::atomic<bool>>(false)),
  _delegate(nullptr),
  _closeState(CloseState::NONE) {
    // reserve data buffer to avoid allocate memory frequently
    _receivedData.reserve(WS_RESERVE_RECEIVE_BUFFER_SIZE);

    {
        std::lock_guard<std::recursive_mutex> lk(instanceMutex);
        if (websocketInstances == nullptr) {
            websocketInstances = new (std::nothrow) std::vector<WebSocketImpl *>();
        }
        websocketInstances->push_back(this);
    }

    // NOTE: !!! Be careful while merging cocos2d-x-lite back to cocos2d-x. !!!
    // 'close' is a synchronous operation which may wait some seconds to make sure connection is closed.
    // But JSB doesn't need to listen on EVENT_RESET event to close connection,
    // since finalize callback (refer to 'WebSocket_finalize' function in jsb_websocket.cpp) will invoke 'closeAsync'.
    //
    //    std::shared_ptr<std::atomic<bool>> isDestroyed = _isDestroyed;
    //    _resetDirectorListener = cc::Director::getInstance()->getEventDispatcher()->addCustomEventListener(cc::Director::EVENT_RESET, [this, isDestroyed](cc::EventCustom*){
    //        if (*isDestroyed)
    //            return;
    //        close();
    //    });
}

WebSocketImpl::~WebSocketImpl() {
    LOGD("In the destructor of WebSocket (%p)\n", this);

    std::unique_lock<std::recursive_mutex> lk(instanceMutex);

    if (websocketInstances != nullptr) {
        auto iter = std::find(websocketInstances->begin(), websocketInstances->end(), this);
        if (iter != websocketInstances->end()) {
            websocketInstances->erase(iter);
        } else {
            LOGD("ERROR: WebSocket instance (%p) wasn't added to the container which saves websocket instances!\n", this);
        }
    }

    if (websocketInstances == nullptr || websocketInstances->empty()) {
        lk.unlock();
        wsHelper->quitWebSocketThread();
        LOGD("before join ws thread\n");
        wsHelper->joinWebSocketThread();
        LOGD("after join ws thread\n");

        CC_SAFE_DELETE(wsHelper);
    }

    // NOTE: Refer to the comment in constructor!!!
    //    cc::Director::getInstance()->getEventDispatcher()->removeEventListener(_resetDirectorListener);

    *_isDestroyed = true;
}

bool WebSocketImpl::init(const cc::network::WebSocket::Delegate &delegate,
                         const std::string &                     url,
                         const std::vector<std::string> *        protocols /* = nullptr*/,
                         const std::string &                     caFilePath /* = ""*/) {
    _delegate   = const_cast<cc::network::WebSocket::Delegate *>(&delegate);
    _url        = url;
    _caFilePath = caFilePath;

    if (_url.empty()) {
        return false;
    }

    if (protocols != nullptr && !protocols->empty()) {
        size_t size   = protocols->size();
        _lwsProtocols = static_cast<struct lws_protocols *>(malloc((size + 1) * sizeof(struct lws_protocols)));
        memset(_lwsProtocols, 0, (size + 1) * sizeof(struct lws_protocols));

        static uint32_t wsId = 0;

        for (size_t i = 0; i < size; ++i) {
            _lwsProtocols[i].callback = WebSocketCallbackWrapper::onSocketCallback;
            size_t nameLen            = protocols->at(i).length();
            char * name               = static_cast<char *>(malloc(nameLen + 1));
            name[nameLen]             = '\0';
            strcpy(name, protocols->at(i).c_str());
            _lwsProtocols[i].name                  = name;
            _lwsProtocols[i].id                    = ++wsId;
            _lwsProtocols[i].rx_buffer_size        = WS_RX_BUFFER_SIZE;
            _lwsProtocols[i].per_session_data_size = 0;
            _lwsProtocols[i].user                  = nullptr;

            _clientSupportedProtocols += name;
            if (i < (size - 1)) {
                _clientSupportedProtocols += ",";
            }
        }
    }

    bool isWebSocketThreadCreated = true;
    if (wsHelper == nullptr) {
        wsHelper                 = new (std::nothrow) WsThreadHelper();
        isWebSocketThreadCreated = false;
    }

    auto *msg = new (std::nothrow) WsMessage();
    msg->what = WS_MSG_TO_SUBTHREAD_CREATE_CONNECTION;
    msg->user = this;
    wsHelper->sendMessageToWebSocketThread(msg);

    // fixed https://github.com/cocos2d/cocos2d-x/issues/17433
    // createWebSocketThread has to be after message WS_MSG_TO_SUBTHREAD_CREATE_CONNECTION was sent.
    // And websocket thread should only be created once.
    if (!isWebSocketThreadCreated) {
        wsHelper->createWebSocketThread();
    }

#if WS_ENABLE_LIBUV
    if (wsContext && wsPolling) {
        auto *loop = lws_uv_getloop(wsContext, 0);
        if (loop) {
            uv_stop(loop);
        }
    }
#endif

    return true;
}

size_t WebSocketImpl::getBufferedAmount() const {
    return wsHelper->countBufferedBytes(this);
}

std::string WebSocketImpl::getExtensions() const {
    //join vector with ";"
    if (_enabledExtensions.empty()) return "";
    std::string ret;
    for (const auto &enabledExtension : _enabledExtensions) ret += (enabledExtension + "; ");
    ret += _enabledExtensions[_enabledExtensions.size() - 1];
    return ret;
}

void WebSocketImpl::send(const std::string &message) {
    if (_readyState == cc::network::WebSocket::State::OPEN) {
        // In main thread
        auto *data  = new (std::nothrow) cc::network::WebSocket::Data();
        data->bytes = static_cast<char *>(malloc(message.length() + 1));
        // Make sure the last byte is '\0'
        data->bytes[message.length()] = '\0';
        strcpy(data->bytes, message.c_str());
        data->len = static_cast<ssize_t>(message.length());

        auto *msg = new (std::nothrow) WsMessage();
        msg->what = WS_MSG_TO_SUBTRHEAD_SENDING_STRING;
        msg->data = data;
        msg->user = this;
        wsHelper->sendMessageToWebSocketThread(msg);
    } else {
        LOGD("Couldn't send message since websocket wasn't opened!\n");
    }
}

void WebSocketImpl::send(const unsigned char *binaryMsg, unsigned int len) {
    if (_readyState == cc::network::WebSocket::State::OPEN) {
        // In main thread
        auto *data = new (std::nothrow) cc::network::WebSocket::Data();
        if (len == 0) {
            // If data length is zero, allocate 1 byte for safe.
            data->bytes    = static_cast<char *>(malloc(1));
            data->bytes[0] = '\0';
        } else {
            data->bytes = static_cast<char *>(malloc(len));
            memcpy(data->bytes, binaryMsg, len);
        }
        data->len = len;

        auto *msg = new (std::nothrow) WsMessage();
        msg->what = WS_MSG_TO_SUBTRHEAD_SENDING_BINARY;
        msg->data = data;
        msg->user = this;
        wsHelper->sendMessageToWebSocketThread(msg);
    } else {
        LOGD("Couldn't send message since websocket wasn't opened!\n");
    }
}

void WebSocketImpl::close() {
    if (_closeState != CloseState::NONE) {
        LOGD("close was invoked, don't invoke it again!\n");
        return;
    }

    _closeState = CloseState::SYNC_CLOSING;
    LOGD("close: WebSocket (%p) is closing...\n", this);
    {
        _readyStateMutex.lock();
        if (_readyState == cc::network::WebSocket::State::CLOSED) {
            // If readState is closed, it means that onConnectionClosed was invoked in websocket thread,
            // but the callback of performInCocosThread has not been triggered. We need to invoke
            // onClose to release the websocket instance.
            _readyStateMutex.unlock();
            _delegate->onClose(_ws);
            return;
        }

        _readyState = cc::network::WebSocket::State::CLOSING;
        _readyStateMutex.unlock();
    }

    {
        std::unique_lock<std::mutex> lkClose(_closeMutex);
        _closeCondition.wait(lkClose);
        _closeState = CloseState::SYNC_CLOSED;
    }

    // Wait 5 milliseconds for onConnectionClosed to exit!
    std::this_thread::sleep_for(std::chrono::milliseconds(5));
    _delegate->onClose(_ws);
}

void WebSocketImpl::closeAsync(int code, const std::string &reason) {
    lws_close_reason(_wsInstance, static_cast<lws_close_status>(code), reinterpret_cast<unsigned char *>(const_cast<char *>(reason.c_str())), reason.length());
    closeAsync();
}

void WebSocketImpl::closeAsync() {
    if (_closeState != CloseState::NONE) {
        LOGD("close was invoked, don't invoke it again!\n");
        return;
    }

    _closeState = CloseState::ASYNC_CLOSING;

    LOGD("closeAsync: WebSocket (%p) is closing...\n", this);
    std::lock_guard<std::mutex> lk(_readyStateMutex);
    if (_readyState == cc::network::WebSocket::State::CLOSED || _readyState == cc::network::WebSocket::State::CLOSING) {
        LOGD("closeAsync: WebSocket (%p) was closed, no need to close it again!\n", this);
        return;
    }

    _readyState = cc::network::WebSocket::State::CLOSING;
}

cc::network::WebSocket::State WebSocketImpl::getReadyState() const {
    std::lock_guard<std::mutex> lk(const_cast<WebSocketImpl *>(this)->_readyStateMutex);
    return _readyState;
}

const std::string &WebSocketImpl::getUrl() const {
    return _url;
}

const std::string &WebSocketImpl::getProtocol() const {
    return _selectedProtocol;
}

cc::network::WebSocket::Delegate *WebSocketImpl::getDelegate() const {
    return _delegate;
}

struct lws_vhost *WebSocketImpl::createVhost(struct lws_protocols *protocols, int *sslConnectionOut) {
    auto *fileUtils     = cc::FileUtils::getInstance();
    bool  isCAFileExist = fileUtils->isFileExist(_caFilePath);
    if (isCAFileExist) {
        _caFilePath = fileUtils->fullPathForFilename(_caFilePath);
    }

    lws_context_creation_info info = convertToContextCreationInfo(protocols, isCAFileExist);

    int sslConnection = *sslConnectionOut;
    if (sslConnection != 0) {
        if (isCAFileExist) {
#if (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_OHOS)
            // if ca file is in the apk, try to extract it to writable path
            std::string writablePath  = fileUtils->getWritablePath();
            std::string caFileName    = getFileNameForPath(_caFilePath);
            std::string newCaFilePath = writablePath + caFileName;

            if (fileUtils->isFileExist(newCaFilePath)) {
                LOGD("CA file (%s) in writable path exists!", newCaFilePath.c_str());
                _caFilePath          = newCaFilePath;
                info.ssl_ca_filepath = _caFilePath.c_str();
            } else {
                if (fileUtils->isFileExist(_caFilePath)) {
                    std::string fullPath = fileUtils->fullPathForFilename(_caFilePath);
                    LOGD("Found CA file: %s", fullPath.c_str());
                    if (fullPath[0] != '/') {
                        LOGD("CA file is in APK");
                        auto caData = fileUtils->getDataFromFile(fullPath);
                        if (!caData.isNull()) {
                            FILE *fp = fopen(newCaFilePath.c_str(), "wb");
                            if (fp != nullptr) {
                                LOGD("New CA file path: %s", newCaFilePath.c_str());
                                fwrite(caData.getBytes(), caData.getSize(), 1, fp);
                                fclose(fp);
                                _caFilePath          = newCaFilePath;
                                info.ssl_ca_filepath = _caFilePath.c_str();
                            } else {
                                CCASSERT(false, "Open new CA file failed");
                            }
                        } else {
                            CCASSERT(false, "CA file is empty!");
                        }
                    } else {
                        LOGD("CA file isn't in APK!");
                        _caFilePath          = fullPath;
                        info.ssl_ca_filepath = _caFilePath.c_str();
                    }
                } else {
                    CCASSERT(false, "CA file doesn't exist!");
                }
            }
#else
            info.ssl_ca_filepath = _caFilePath.c_str();
#endif
        } else {
            LOGD("WARNING: CA Root file isn't set. SSL connection will not peer server certificate\n");
            *sslConnectionOut = sslConnection | LCCSCF_ALLOW_SELFSIGNED | LCCSCF_SKIP_SERVER_CERT_HOSTNAME_CHECK;
        }
    }

    lws_vhost *vhost = lws_create_vhost(wsContext, &info);

    return vhost;
}

void WebSocketImpl::onClientOpenConnectionRequest() {
    if (nullptr != wsContext) {
        static const struct lws_extension EXTS[] = {
            {"permessage-deflate",
             lws_extension_callback_pm_deflate,
             // client_no_context_takeover extension is not supported in the current version, it will cause connection fail
             // It may be a bug of lib websocket build
             //            "permessage-deflate; client_no_context_takeover; client_max_window_bits"
             "permessage-deflate; client_max_window_bits"},
            {"deflate-frame",
             lws_extension_callback_pm_deflate,
             "deflate_frame"},
            {nullptr, nullptr, nullptr /* terminator */}};

        _readyStateMutex.lock();
        _readyState = cc::network::WebSocket::State::CONNECTING;
        _readyStateMutex.unlock();

        cc::network::Uri uri = cc::network::Uri::parse(_url);
        LOGD("scheme: %s, host: %s, port: %d, path: %s\n", uri.getScheme().c_str(), uri.getHostName().c_str(), static_cast<int>(uri.getPort()), uri.getPathEtc().c_str());

        int sslConnection = 0;
        if (uri.isSecure()) {
            sslConnection = LCCSCF_USE_SSL;
        }

        struct lws_vhost *vhost = nullptr;
        if (_lwsProtocols != nullptr) {
            vhost = createVhost(_lwsProtocols, &sslConnection);
        } else {
            vhost = createVhost(defaultProtocols, &sslConnection);
        }

        int port = static_cast<int>(uri.getPort());
        if (port == 0) {
            port = uri.isSecure() ? 443 : 80;
        }

        const std::string &hostName  = uri.getHostName();
        std::string        path      = uri.getPathEtc();
        const std::string &authority = uri.getAuthority();
        if (path.empty()) {
            path = "/";
        }

        struct lws_client_connect_info connectInfo;
        memset(&connectInfo, 0, sizeof(connectInfo));
        connectInfo.context                   = wsContext;
        connectInfo.address                   = hostName.c_str();
        connectInfo.port                      = port;
        connectInfo.ssl_connection            = sslConnection;
        connectInfo.path                      = path.c_str();
        connectInfo.host                      = hostName.c_str();
        connectInfo.origin                    = authority.c_str();
        connectInfo.protocol                  = _clientSupportedProtocols.empty() ? nullptr : _clientSupportedProtocols.c_str();
        connectInfo.ietf_version_or_minus_one = -1;
        connectInfo.userdata                  = this;
        connectInfo.client_exts               = EXTS;
        connectInfo.vhost                     = vhost;

        _wsInstance = lws_client_connect_via_info(&connectInfo);

        if (nullptr == _wsInstance) {
            onConnectionError();
            return;
        }
    } else {
        LOGE("Create websocket context failed!");
    }
}

int WebSocketImpl::onClientWritable() {
    //    LOGD("onClientWritable ... \n");
    {
        std::lock_guard<std::mutex> readMutex(_readyStateMutex);
        if (_readyState == cc::network::WebSocket::State::CLOSING) {
            LOGD("Closing websocket (%p) connection.\n", this);
            return -1;
        }
    }

    do {
        std::lock_guard<std::mutex> lk(wsHelper->_subThreadWsMessageQueueMutex);

        if (wsHelper->_subThreadWsMessageQueue->empty()) {
            break;
        }

        auto iter = wsHelper->_subThreadWsMessageQueue->begin();

        while (iter != wsHelper->_subThreadWsMessageQueue->end()) {
            WsMessage *msg = *iter;
            if (msg->user == this) {
                break;
            }
            ++iter;
        }

        ssize_t bytesWrite = 0;
        if (iter != wsHelper->_subThreadWsMessageQueue->end()) {
            WsMessage *subThreadMsg = *iter;

            auto *data = subThreadMsg->data;

            const ssize_t cBufferSize = WS_RX_BUFFER_SIZE;

            const ssize_t remaining = data->len - data->issued;
            const ssize_t n         = std::min(remaining, cBufferSize);

            WebSocketFrame *frame = nullptr;

            if (data->ext) {
                frame = static_cast<WebSocketFrame *>(data->ext);
            } else {
                frame        = new (std::nothrow) WebSocketFrame();
                bool success = frame && frame->init(reinterpret_cast<unsigned char *>(data->bytes + data->issued), n);
                if (success) {
                    data->ext = frame;
                } else { // If frame initialization failed, delete the frame and drop the sending data
                         // These codes should never be called.
                    LOGD("WebSocketFrame initialization failed, drop the sending data, msg(%d)\n", (int)subThreadMsg->id);
                    delete frame;
                    CC_SAFE_FREE(data->bytes);
                    CC_SAFE_DELETE(data);
                    wsHelper->_subThreadWsMessageQueue->erase(iter);
                    CC_SAFE_DELETE(subThreadMsg);
                    break;
                }
            }

            int writeProtocol;

            if (data->issued == 0) {
                if (WS_MSG_TO_SUBTRHEAD_SENDING_STRING == subThreadMsg->what) {
                    writeProtocol = LWS_WRITE_TEXT;
                } else {
                    writeProtocol = LWS_WRITE_BINARY;
                }

                // If we have more than 1 fragment
                if (data->len > cBufferSize) {
                    writeProtocol |= LWS_WRITE_NO_FIN;
                }
            } else {
                // we are in the middle of fragments
                writeProtocol = LWS_WRITE_CONTINUATION;
                // and if not in the last fragment
                if (remaining != n) {
                    writeProtocol |= LWS_WRITE_NO_FIN;
                }
            }

            bytesWrite = lws_write(_wsInstance, frame->getPayload(), frame->getPayloadLength(), static_cast<lws_write_protocol>(writeProtocol));

            // Handle the result of lws_write
            // Buffer overrun?
            if (bytesWrite < 0) {
                LOGD("ERROR: msg(%u), lws_write return: %d, but it should be %d, drop this message.\n", subThreadMsg->id, (int)bytesWrite, (int)n);
                // socket error, we need to close the socket connection
                CC_SAFE_FREE(data->bytes);
                delete (static_cast<WebSocketFrame *>(data->ext));
                data->ext = nullptr;
                CC_SAFE_DELETE(data);
                wsHelper->_subThreadWsMessageQueue->erase(iter);
                CC_SAFE_DELETE(subThreadMsg);

                closeAsync();
            } else if (bytesWrite < frame->getPayloadLength()) {
                frame->update(bytesWrite);
                LOGD("frame wasn't sent completely, bytesWrite: %d, remain: %d\n", (int)bytesWrite, (int)frame->getPayloadLength());
            }
            // Do we have another fragments to send?
            else if (remaining > frame->getFrameLength() && bytesWrite == frame->getPayloadLength()) {
                // A frame was totally sent, plus data->issued to send next frame
                LOGD("msg(%u) append: %d + %d = %d\n", subThreadMsg->id, (int)data->issued, (int)frame->getFrameLength(), (int)(data->issued + frame->getFrameLength()));
                data->issued += frame->getFrameLength();
                delete (static_cast<WebSocketFrame *>(data->ext));
                data->ext = nullptr;
            }
            // Safely done!
            else {
                LOGD("Safely done, msg(%d)!\n", subThreadMsg->id);
                if (remaining == frame->getFrameLength()) {
                    LOGD("msg(%u) append: %d + %d = %d\n", subThreadMsg->id, (int)data->issued, (int)frame->getFrameLength(), (int)(data->issued + frame->getFrameLength()));
                    LOGD("msg(%u) was totally sent!\n", subThreadMsg->id);
                } else {
                    LOGD("ERROR: msg(%u), remaining(%d) < bytesWrite(%d)\n", subThreadMsg->id, (int)remaining, (int)frame->getFrameLength());
                    LOGD("Drop the msg(%u)\n", subThreadMsg->id);
                    closeAsync();
                }

                CC_SAFE_FREE(data->bytes);
                delete (static_cast<WebSocketFrame *>(data->ext));
                data->ext = nullptr;
                CC_SAFE_DELETE(data);
                wsHelper->_subThreadWsMessageQueue->erase(iter);
                CC_SAFE_DELETE(subThreadMsg);

                LOGD("-----------------------------------------------------------\n");
            }
        }

    } while (false);

    if (_wsInstance != nullptr) {
        lws_callback_on_writable(_wsInstance);
    }

    return 0;
}

int WebSocketImpl::onClientReceivedData(void *in, ssize_t len) {
    // In websocket thread
    static int packageIndex = 0;
    packageIndex++;
    if (in != nullptr && len > 0) {
        LOGD("Receiving data:index:%d, len=%d\n", packageIndex, (int)len);

        auto *inData = static_cast<unsigned char *>(in);
        _receivedData.insert(_receivedData.end(), inData, inData + len);
    } else {
        LOGD("Empty message received, index=%d!\n", packageIndex);
    }

    // If no more data pending, send it to the client thread
    size_t remainingSize   = lws_remaining_packet_payload(_wsInstance);
    int    isFinalFragment = lws_is_final_fragment(_wsInstance);
    //    LOGD("remainingSize: %d, isFinalFragment: %d\n", (int)remainingSize, isFinalFragment);

    if (remainingSize == 0 && isFinalFragment) {
        auto *frameData = new (std::nothrow) std::vector<char>(std::move(_receivedData));

        // reset capacity of received data buffer
        _receivedData.reserve(WS_RESERVE_RECEIVE_BUFFER_SIZE);

        ssize_t frameSize = frameData->size();

        bool isBinary = (lws_frame_is_binary(_wsInstance) != 0);

        if (!isBinary) {
            frameData->push_back('\0');
        }

        std::shared_ptr<std::atomic<bool>> isDestroyed = _isDestroyed;
        wsHelper->sendMessageToCocosThread([this, frameData, frameSize, isBinary, isDestroyed]() {
            // In UI thread
            LOGD("Notify data len %d to Cocos thread.\n", (int)frameSize);

            cc::network::WebSocket::Data data;
            data.isBinary = isBinary;
            data.bytes    = static_cast<char *>(frameData->data());
            data.len      = frameSize;

            if (*isDestroyed) {
                LOGD("WebSocket instance was destroyed!\n");
            } else {
                _delegate->onMessage(_ws, data);
            }

            delete frameData;
        });
    }

    return 0;
}

int WebSocketImpl::onConnectionOpened() {
    const lws_protocols *lwsSelectedProtocol = lws_get_protocol(_wsInstance);
    _selectedProtocol                        = lwsSelectedProtocol->name;
    LOGD("onConnectionOpened...: %p, client protocols: %s, server selected protocol: %s\n", this, _clientSupportedProtocols.c_str(), _selectedProtocol.c_str());
    /*
     * start the ball rolling,
     * LWS_CALLBACK_CLIENT_WRITEABLE will come next service
     */
    lws_callback_on_writable(_wsInstance);

    {
        std::lock_guard<std::mutex> lk(_readyStateMutex);
        if (_readyState == cc::network::WebSocket::State::CLOSING || _readyState == cc::network::WebSocket::State::CLOSED) {
            return 0;
        }
        _readyState = cc::network::WebSocket::State::OPEN;
    }

    std::shared_ptr<std::atomic<bool>> isDestroyed = _isDestroyed;
    wsHelper->sendMessageToCocosThread([this, isDestroyed]() {
        if (*isDestroyed) {
            LOGD("WebSocket instance was destroyed!\n");
        } else {
            _delegate->onOpen(_ws);
        }
    });
    return 0;
}

int WebSocketImpl::onConnectionError() {
    {
        std::lock_guard<std::mutex> lk(_readyStateMutex);
        LOGD("WebSocket (%p) onConnectionError, state: %d ...\n", this, (int)_readyState);
        if (_readyState == cc::network::WebSocket::State::CLOSED) {
            return 0;
        }
        _readyState = cc::network::WebSocket::State::CLOSING;
    }

    std::shared_ptr<std::atomic<bool>> isDestroyed = _isDestroyed;
    wsHelper->sendMessageToCocosThread([this, isDestroyed]() {
        if (*isDestroyed) {
            LOGD("WebSocket instance was destroyed!\n");
        } else {
            _delegate->onError(_ws, cc::network::WebSocket::ErrorCode::CONNECTION_FAILURE);
        }
    });

    onConnectionClosed();

    return 0;
}

int WebSocketImpl::onConnectionClosed() {
    {
        std::lock_guard<std::mutex> lk(_readyStateMutex);
        LOGD("WebSocket (%p) onConnectionClosed, state: %d ...\n", this, (int)_readyState);
        if (_readyState == cc::network::WebSocket::State::CLOSED) {
            return 0;
        }

        if (_readyState == cc::network::WebSocket::State::CLOSING) {
            if (_closeState == CloseState::SYNC_CLOSING) {
                LOGD("onConnectionClosed, WebSocket (%p) is closing by client synchronously.\n", this);
                for (;;) {
                    std::lock_guard<std::mutex> lkClose(_closeMutex);
                    _closeCondition.notify_one();
                    if (_closeState == CloseState::SYNC_CLOSED) {
                        break;
                    }
                    std::this_thread::sleep_for(std::chrono::milliseconds(1));
                }

                return 0;
            }

            if (_closeState == CloseState::ASYNC_CLOSING) {
                LOGD("onConnectionClosed, WebSocket (%p) is closing by client asynchronously.\n", this);
            } else {
                LOGD("onConnectionClosed, WebSocket (%p) is closing by server.\n", this);
            }
        } else {
            LOGD("onConnectionClosed, WebSocket (%p) is closing by server.\n", this);
        }

        _readyState = cc::network::WebSocket::State::CLOSED;
    }

    std::shared_ptr<std::atomic<bool>> isDestroyed = _isDestroyed;
    wsHelper->sendMessageToCocosThread([this, isDestroyed]() {
        if (*isDestroyed) {
            LOGD("WebSocket instance (%p) was destroyed!\n", this);
        } else {
            _delegate->onClose(_ws);
        }
    });

    LOGD("WebSocket (%p) onConnectionClosed DONE!\n", this);
    return 0;
}

int WebSocketImpl::onSocketCallback(struct lws * /*wsi*/, enum lws_callback_reasons reason, void *in, ssize_t len) {
    //LOGD("socket callback for %d reason\n", reason);

    int ret = 0;
    switch (reason) {
        case LWS_CALLBACK_CLIENT_ESTABLISHED:
            ret = onConnectionOpened();
            break;

        case LWS_CALLBACK_CLIENT_CONNECTION_ERROR:
            ret = onConnectionError();
            break;

        case LWS_CALLBACK_WSI_DESTROY:
            ret = onConnectionClosed();
            break;

        case LWS_CALLBACK_CLIENT_RECEIVE:
            ret = onClientReceivedData(in, len);
            break;

        case LWS_CALLBACK_CLIENT_WRITEABLE:
            ret = onClientWritable();
            break;
        case LWS_CALLBACK_CHANGE_MODE_POLL_FD:
        case LWS_CALLBACK_LOCK_POLL:
        case LWS_CALLBACK_UNLOCK_POLL:
            break;
        case LWS_CALLBACK_PROTOCOL_INIT:
            LOGD("protocol init...");
            break;
        case LWS_CALLBACK_PROTOCOL_DESTROY:
            LOGD("protocol destroy...");
            break;
        case LWS_CALLBACK_CONFIRM_EXTENSION_OKAY:
            if (in && len > 0) {
                _enabledExtensions.emplace_back(static_cast<char *>(in), 0, len);
            }
            break;
        default:
            LOGD("WebSocket (%p) Unhandled websocket event: %d\n", this, reason);
            break;
    }

    return ret;
}

NS_NETWORK_BEGIN

/*static*/
void WebSocket::closeAllConnections() {
    WebSocketImpl::closeAllConnections();
}

WebSocket::WebSocket() {
    _impl = new (std::nothrow) WebSocketImpl(this);
}

WebSocket::~WebSocket() {
    delete _impl;
}

bool WebSocket::init(const Delegate &                delegate,
                     const std::string &             url,
                     const std::vector<std::string> *protocols /* = nullptr*/,
                     const std::string &             caFilePath /* = ""*/) {
    return _impl->init(delegate, url, protocols, caFilePath);
}

void WebSocket::send(const std::string &message) {
    _impl->send(message);
}

void WebSocket::send(const unsigned char *binaryMsg, unsigned int len) {
    _impl->send(binaryMsg, len);
}

void WebSocket::close() {
    _impl->close();
}

void WebSocket::closeAsync() {
    _impl->closeAsync();
}
void WebSocket::closeAsync(int code, const std::string &reason) {
    _impl->closeAsync(code, reason);
}

WebSocket::State WebSocket::getReadyState() const {
    return _impl->getReadyState();
}

std::string WebSocket::getExtensions() const {
    return _impl->getExtensions();
}

size_t WebSocket::getBufferedAmount() const {
    return _impl->getBufferedAmount();
}

const std::string &WebSocket::getUrl() const {
    return _impl->getUrl();
}

const std::string &WebSocket::getProtocol() const {
    return _impl->getProtocol();
}

WebSocket::Delegate *WebSocket::getDelegate() const {
    return _impl->getDelegate();
}

NS_NETWORK_END
