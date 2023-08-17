/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

#include <atomic>
#include "WebSocket.h"
#include "application/ApplicationManager.h"
#include "base/Scheduler.h"
#include "base/UTF8.h"
#include "base/memory/Memory.h"
#include "platform/FileUtils.h"
#include "platform/java/jni/JniHelper.h"

#ifdef JAVA_CLASS_WEBSOCKET
    #error "JAVA_CLASS_WEBSOCKET is already defined"
#endif
#ifdef HANDLE_TO_WS_OKHTTP3
    #error "HANDLE_TO_WS_OKHTTP3 is already defined"
#endif

#define JAVA_CLASS_WEBSOCKET "com/cocos/lib/websocket/CocosWebSocket"
#define HANDLE_TO_WS_OKHTTP3(handler) \
    reinterpret_cast<WebSocketImpl *>(static_cast<uintptr_t>(handler))

namespace {
//NOLINTNEXTLINE
void split_string(const std::string &s, std::vector<std::string> &v, const std::string &c) {
    v.clear();
    std::string::size_type pos1;
    std::string::size_type pos2;
    pos2 = s.find(c);
    pos1 = 0;
    while (std::string::npos != pos2) {
        v.push_back(s.substr(pos1, pos2 - pos1));

        pos1 = pos2 + c.size();
        pos2 = s.find(c, pos1);
    }
    if (pos1 != s.length()) {
        v.push_back(s.substr(pos1));
    }
}
} // namespace

using cc::JniHelper;
using cc::network::WebSocket;
class WebSocketImpl final {
public:
    static const char *connectID;
    static const char *removeHandlerID;
    static const char *sendBinaryID;
    static const char *sendStringID;
    static const char *closeID;
    static const char *getBufferedAmountID;
    static std::atomic_int64_t idGenerator;
    static std::unordered_map<int64_t, WebSocketImpl *> allConnections;

    static void closeAllConnections();

    explicit WebSocketImpl(cc::network::WebSocket *websocket);
    ~WebSocketImpl();

    bool init(const cc::network::WebSocket::Delegate &delegate,
              const std::string &url,
              const std::vector<std::string> *protocols = nullptr,
              const std::string &caFilePath = "");

    void send(const std::string &message);
    void send(const unsigned char *binaryMsg, unsigned int len);
    void close();
    void closeAsync();
    void closeAsync(int code, const std::string &reason);
    cc::network::WebSocket::State getReadyState() const { return _readyState; }
    const std::string &getUrl() const { return _url; }
    const std::string &getProtocol() const { return _protocolString; }
    cc::network::WebSocket::Delegate *getDelegate() const { return _delegate; }

    size_t getBufferedAmount() const;
    std::string getExtensions() const { return _extensions; }

    void onOpen(const std::string &protocol, const std::string &headers);
    void onClose(int code, const std::string &reason, bool wasClean);
    void onError(int code, const std::string &reason);
    void onStringMessage(const std::string &message);
    void onBinaryMessage(const uint8_t *buf, size_t len);

private:
    WebSocket *_socket{nullptr};
    WebSocket::Delegate *_delegate{nullptr};
    jobject _javaSocket{nullptr};
    int64_t _identifier{0};
    std::string _protocolString;
    std::string _selectedProtocol;
    std::string _url;
    std::string _extensions;
    WebSocket::State _readyState{WebSocket::State::CONNECTING};
    std::unordered_map<std::string, std::string> _headerMap{};
};

const char *WebSocketImpl::connectID = "_connect";
const char *WebSocketImpl::removeHandlerID = "_removeHander";
const char *WebSocketImpl::sendBinaryID = "_send";
const char *WebSocketImpl::sendStringID = "_send";
const char *WebSocketImpl::closeID = "_close";
const char *WebSocketImpl::getBufferedAmountID = "_getBufferedAmountID";
std::atomic_int64_t WebSocketImpl::idGenerator{0};
std::unordered_map<int64_t, WebSocketImpl *> WebSocketImpl::allConnections{};

void WebSocketImpl::closeAllConnections() {
    std::unordered_map<int64_t, WebSocketImpl *> tmp = std::move(allConnections);
    for (auto &t : tmp) {
        t.second->closeAsync();
    }
}

WebSocketImpl::WebSocketImpl(WebSocket *websocket) : _socket(websocket) {
    _identifier = idGenerator.fetch_add(1);
    allConnections.emplace(_identifier, this);
}

WebSocketImpl::~WebSocketImpl() {
    auto *env = JniHelper::getEnv();
    JniHelper::getEnv()->DeleteGlobalRef(_javaSocket);
    _javaSocket = nullptr;
    allConnections.erase(_identifier);
}

bool WebSocketImpl::init(const cc::network::WebSocket::Delegate &delegate, const std::string &url,
                         const std::vector<std::string> *protocols, const std::string &caFilePath) {
    auto *env = JniHelper::getEnv();
    auto handler = static_cast<int64_t>(reinterpret_cast<uintptr_t>(this));
    bool tcpNoDelay = false;
    bool perMessageDeflate = true;
    int64_t timeout = 60 * 60 * 1000 /*ms*/; //TODO(PatriceJiang): set timeout
    std::vector<std::string> headers;        //TODO(PatriceJiang): allow set headers
    _url = url;
    _delegate = const_cast<WebSocket::Delegate *>(&delegate);
    if (protocols != nullptr && !protocols->empty()) {
        // protocol should add to Request Header as part of the original handshake for key
        // Sec-WebSocket-Protocol, use ',' to separate more than one.
        // https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers
        std::string item;
        auto it = protocols->begin();
        while (it != protocols->end()) {
            item = *it++;
            _protocolString.append(item);
            if (it != protocols->end()) {
                _protocolString.append(", ");
            }
        }
    }
    // header
    jobject jObj = JniHelper::newObject(JAVA_CLASS_WEBSOCKET, _identifier, handler, headers, tcpNoDelay, perMessageDeflate, timeout);
    _javaSocket = env->NewGlobalRef(jObj);
    JniHelper::callObjectVoidMethod(jObj, JAVA_CLASS_WEBSOCKET, connectID, url, _protocolString, caFilePath);
    env->DeleteLocalRef(jObj);
    _readyState = WebSocket::State::CONNECTING;
    return true;
}

void WebSocketImpl::send(const std::string &message) {
    if (_readyState == WebSocket::State::OPEN) {
        JniHelper::callObjectVoidMethod(_javaSocket, JAVA_CLASS_WEBSOCKET, sendStringID, message);
    } else {
        CC_LOG_ERROR("Couldn't send message since WebSocket wasn't opened!");
    }
}

void WebSocketImpl::send(const unsigned char *binaryMsg, unsigned int len) {
    if (_readyState == WebSocket::State::OPEN) {
        JniHelper::callObjectVoidMethod(_javaSocket, JAVA_CLASS_WEBSOCKET, sendBinaryID, std::make_pair(binaryMsg, static_cast<size_t>(len)));
    } else {
        CC_LOG_ERROR("Couldn't send message since WebSocket wasn't opened!");
    }
}

void WebSocketImpl::close() {
    closeAsync(); // close only run in async mode
}

void WebSocketImpl::closeAsync() {
    closeAsync(1000, "normal closure");
}

void WebSocketImpl::closeAsync(int code, const std::string &reason) {
    CC_LOG_DEBUG("close WebSocket: %p, code: %d, reason: %s",
                 this,
                 code,
                 reason.c_str());
    if (_readyState == WebSocket::State::CLOSED ||
        _readyState == WebSocket::State::CLOSING) {
        CC_LOG_ERROR("close: WebSocket (%p) was closed, no need to close it again!", this);
        return;
    }
    _readyState = WebSocket::State::CLOSING; // update state -> CLOSING
    JniHelper::callObjectVoidMethod(_javaSocket, JAVA_CLASS_WEBSOCKET, closeID, code, reason);
}

size_t WebSocketImpl::getBufferedAmount() const {
    jlong buffAmount = JniHelper::callObjectLongMethod(_javaSocket, JAVA_CLASS_WEBSOCKET, getBufferedAmountID);
    return static_cast<size_t>(buffAmount);
}

void WebSocketImpl::onOpen(const std::string &protocol, const std::string &headers) {
    _selectedProtocol = protocol;
    std::vector<std::string> headerTokens;
    split_string(headers, headerTokens, "\n");
    std::vector<std::string> headerKV;
    for (auto &kv : headerTokens) {
        split_string(kv, headerKV, ": ");
        _headerMap.insert(std::pair<std::string, std::string>(headerKV[0],
                                                              headerKV[1]));
        if (headerKV[0] == "Sec-WebSocket-Extensions") {
            _extensions = headerKV[1];
        }
    }
    if (_readyState == WebSocket::State::CLOSING || _readyState == WebSocket::State::CLOSED) {
        CC_LOG_DEBUG("websocket is closing");
    } else {
        _readyState = WebSocket::State::OPEN; // update state -> OPEN
        _delegate->onOpen(_socket);
    }
}

void WebSocketImpl::onClose(int code, const std::string &reason, bool wasClean) {
    _readyState = WebSocket::State::CLOSED; // update state -> CLOSED
    _delegate->onClose(_socket, code, reason, wasClean);
}

void WebSocketImpl::onError(int code, const std::string &reason) {
    CC_LOG_DEBUG("WebSocket (%p) onError, state: %d ...", this, (int)_readyState);
    if (_readyState != WebSocket::State::CLOSED) {
        _readyState = WebSocket::State::CLOSED; // update state -> CLOSED
        _delegate->onError(_socket, static_cast<WebSocket::ErrorCode>(code));
    }
    onClose(code, reason, false);
}

void WebSocketImpl::onBinaryMessage(const uint8_t *buf, size_t len) {
    WebSocket::Data data;
    data.bytes = reinterpret_cast<char *>(const_cast<uint8_t *>(buf));
    data.len = static_cast<ssize_t>(len);
    data.isBinary = true;
    _delegate->onMessage(_socket, data);
}

void WebSocketImpl::onStringMessage(const std::string &message) {
    WebSocket::Data data;
    data.bytes = const_cast<char *>(message.c_str());
    data.len = static_cast<ssize_t>(message.length());
    data.isBinary = false;
    _delegate->onMessage(_socket, data);
}

namespace cc {
namespace network {
/*static*/
void WebSocket::closeAllConnections() {
    WebSocketImpl::closeAllConnections();
}

WebSocket::WebSocket() {
    _impl = ccnew WebSocketImpl(this);
}

WebSocket::~WebSocket() {
    delete _impl;
}

bool WebSocket::init(const Delegate &delegate,
                     const std::string &url,
                     const std::vector<std::string> *protocols /* = nullptr*/,
                     const std::string &caFilePath /* = ""*/) {
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

} // namespace network
} // namespace cc

extern "C" {
#ifdef JNI_PATH
    #error "JNI_PATH is already defined"
#endif

#ifdef RUN_IN_GAMETHREAD
    #error "RUN_IN_GAMETHREAD is already defined"
#endif

#define JNI_PATH(methodName) Java_com_cocos_lib_websocket_CocosWebSocket_##methodName
#define RUN_IN_GAMETHREAD(task)                                                       \
    do {                                                                              \
        if (CC_CURRENT_APPLICATION()) {                                               \
            CC_CURRENT_ENGINE()->getScheduler()->performFunctionInCocosThread([=]() { \
                task;                                                                 \
            });                                                                       \
        }                                                                             \
    } while (0)

JNIEXPORT void JNICALL JNI_PATH(NativeInit)(JNIEnv * /*env*/, jclass /*clazz*/) {
    // nop
    // may cache jni objects in the future
}

JNIEXPORT void JNICALL
JNI_PATH(nativeOnStringMessage)(JNIEnv * /*env*/,
                                jobject /*ctx*/,
                                jstring msg,
                                jlong /*identifier*/,
                                jlong handler) {
    auto *wsOkHttp3 = HANDLE_TO_WS_OKHTTP3(handler); // NOLINT(performance-no-int-to-ptr)
    std::string msgStr = JniHelper::jstring2string(msg);
    RUN_IN_GAMETHREAD(wsOkHttp3->onStringMessage(msgStr));
}

JNIEXPORT void JNICALL
JNI_PATH(nativeOnBinaryMessage)(JNIEnv *env,
                                jobject /*ctx*/,
                                jbyteArray msg,
                                jlong /*identifier*/,
                                jlong handler) {
    auto *wsOkHttp3 = HANDLE_TO_WS_OKHTTP3(handler); // NOLINT(performance-no-int-to-ptr)
    jobject strongRef = env->NewGlobalRef(msg);
    RUN_IN_GAMETHREAD(do {
        auto *env = JniHelper::getEnv();
        auto len = env->GetArrayLength(static_cast<jbyteArray>(strongRef));
        jboolean isCopy = JNI_FALSE;
        jbyte *array = env->GetByteArrayElements(static_cast<jbyteArray>(strongRef), &isCopy);
        wsOkHttp3->onBinaryMessage(reinterpret_cast<uint8_t *>(array), len);
        env->DeleteGlobalRef(strongRef);
    } while (false));
}

JNIEXPORT void JNICALL
JNI_PATH(nativeOnOpen)(JNIEnv * /*env*/,
                       jobject /*ctx*/,
                       jstring protocol,
                       jstring header,
                       jlong /*identifier*/,
                       jlong handler) {
    auto *wsOkHttp3 = HANDLE_TO_WS_OKHTTP3(handler); // NOLINT(performance-no-int-to-ptr)
    auto protocolStr = JniHelper::jstring2string(protocol);
    auto headerStr = JniHelper::jstring2string(header);
    RUN_IN_GAMETHREAD(wsOkHttp3->onOpen(protocolStr, headerStr));
}

JNIEXPORT void JNICALL
JNI_PATH(nativeOnClosed)(JNIEnv * /*env*/,
                         jobject /*ctx*/,
                         jint code,
                         jstring reason,
                         jlong /*identifier*/,
                         jlong handler) {
    auto *wsOkHttp3 = HANDLE_TO_WS_OKHTTP3(handler); // NOLINT(performance-no-int-to-ptr)
    auto closeReason = JniHelper::jstring2string(reason);
    RUN_IN_GAMETHREAD(wsOkHttp3->onClose(static_cast<int>(code), closeReason, true));
}

JNIEXPORT void JNICALL
JNI_PATH(nativeOnError)(JNIEnv * /*env*/,
                        jobject /*ctx*/,
                        jstring reason,
                        jlong /*identifier*/,
                        jlong handler) {
    auto *wsOkHttp3 = HANDLE_TO_WS_OKHTTP3(handler); // NOLINT(performance-no-int-to-ptr)
    int unknownError = static_cast<int>(cc::network::WebSocket::ErrorCode::UNKNOWN);
    auto errorReason = JniHelper::jstring2string(reason);
    RUN_IN_GAMETHREAD(wsOkHttp3->onError(unknownError, errorReason));
}

#undef JNI_PATH
}

#undef HANDLE_TO_WS_OKHTTP3
