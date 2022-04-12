/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#include "base/Macros.h"
#include "base/Ref.h"
#include "platform/StdC.h"

#include <algorithm>
#include <string>
#include <vector>
#ifndef OBJC_CLASS
    #ifdef __OBJC__
        #define OBJC_CLASS(name) @class name
    #else
        #define OBJC_CLASS(name) class name
    #endif
#endif // OBJC_CLASS

OBJC_CLASS(WebSocketImpl);

/**
 * @addtogroup network
 * @{
 */

namespace cc {

namespace network {

/**
 * WebSocket is wrapper of the libwebsockets-protocol, let the develop could call the websocket easily.
 * Please note that all public methods of WebSocket have to be invoked on Cocos Thread.
 */
class CC_DLL WebSocket : public Ref {
public:
    /**
     * Close all connections and wait for all websocket threads to exit
     * @note This method has to be invoked on Cocos Thread
     */
    static void closeAllConnections();

    /**
     * Constructor of WebSocket.
     *
     * @js ctor
     */
    WebSocket();

private:
    /**
     * Destructor of WebSocket.
     *
     * @js NA
     * @lua NA
     */
    ~WebSocket() override;

public:
    /**
     * Data structure for message
     */
    struct Data {
        Data() = default;
        char *  bytes{nullptr};
        ssize_t len{0}, issued{0};
        bool    isBinary{false};
        void *  ext{nullptr};
        ssize_t getRemain() const { return std::max(static_cast<ssize_t>(0), len - issued); }
    };

    /**
     * ErrorCode enum used to represent the error in the websocket.
     */
    enum class ErrorCode {
        TIME_OUT,           /** &lt; value 0 */
        CONNECTION_FAILURE, /** &lt; value 1 */
        UNKNOWN,            /** &lt; value 2 */
    };

    /**
     *  State enum used to represent the Websocket state.
     */
    enum class State {
        CONNECTING, /** &lt; value 0 */
        OPEN,       /** &lt; value 1 */
        CLOSING,    /** &lt; value 2 */
        CLOSED,     /** &lt; value 3 */
    };

    /**
     * The delegate class is used to process websocket events.
     *
     * The most member function are pure virtual functions,they should be implemented the in subclass.
     * @lua NA
     */
    class Delegate {
    public:
        /** Destructor of Delegate. */
        virtual ~Delegate() = default;
        /**
         * This function to be called after the client connection complete a handshake with the remote server.
         * This means that the WebSocket connection is ready to send and receive data.
         * 
         * @param ws The WebSocket object connected
         */
        virtual void onOpen(WebSocket *ws) = 0;
        /**
         * This function to be called when data has appeared from the server for the client connection.
         *
         * @param ws The WebSocket object connected.
         * @param data Data object for message.
         */
        virtual void onMessage(WebSocket *ws, const Data &data) = 0;
        /**
         * When the WebSocket object connected wants to close or the protocol won't get used at all and current _readyState is State::CLOSING,this function is to be called.
         *
         * @param ws The WebSocket object connected.
         */
        virtual void onClose(WebSocket *ws) = 0;
        /**
         * This function is to be called in the following cases:
         * 1. client connection is failed.
         * 2. the request client connection has been unable to complete a handshake with the remote server.
         * 3. the protocol won't get used at all after this callback and current _readyState is State::CONNECTING.
         * 4. when a socket descriptor needs to be removed from an external polling array. in is again the struct libwebsocket_pollargs containing the fd member to be removed. If you are using the internal polling loop, you can just ignore it and current _readyState is State::CONNECTING.
         *
         * @param ws The WebSocket object connected.
         * @param error WebSocket::ErrorCode enum,would be ErrorCode::TIME_OUT or ErrorCode::CONNECTION_FAILURE.
         */
        virtual void onError(WebSocket *ws, const ErrorCode &error) = 0;
    };

    /**
     *  @brief The initialized method for websocket.
     *         It needs to be invoked right after websocket instance is allocated.
     *  @param delegate The delegate which want to receive event from websocket.
     *  @param url The URL of websocket server.
     *  @param protocols The websocket protocols that agree with websocket server
     *  @param caFilePath The ca file path for wss connection
     *  @return true: Success, false: Failure.
     *  @lua NA
     */
    bool init(const Delegate &                delegate,
              const std::string &             url,
              const std::vector<std::string> *protocols  = nullptr,
              const std::string &             caFilePath = "");

    /**
     *  @brief Sends string data to websocket server.
     *  
     *  @param message string data.
     *  @lua sendstring
     */
    void send(const std::string &message);

    /**
     *  @brief Sends binary data to websocket server.
     *  
     *  @param binaryMsg binary string data.
     *  @param len the size of binary string data.
     *  @lua sendstring
     */
    void send(const unsigned char *binaryMsg, unsigned int len);

    /**
     *  @brief Closes the connection to server synchronously.
     *  @note It's a synchronous method, it will not return until websocket thread exits.
     */
    void close();

    /**
     *  @brief Closes the connection to server asynchronously.
     *  @note It's an asynchronous method, it just notifies websocket thread to exit and returns directly,
     *        If using 'closeAsync' to close websocket connection, 
     *        be careful of not using destructed variables in the callback of 'onClose'.
     */
    void closeAsync();

    /**
    *  @brief Closes the connection to server asynchronously.
    *  @note It's an asynchronous method, it just notifies websocket thread to exit and returns directly,
    *        If using 'closeAsync' to close websocket connection,
    *        be careful of not using destructed variables in the callback of 'onClose'.
    *  @param code close reason
    *  @param reason reason text description
    */
    void closeAsync(int code, const std::string &reason);

    /**
     *  @brief Gets current state of connection.
     *  @return State the state value could be State::CONNECTING, State::OPEN, State::CLOSING or State::CLOSED
     */
    State getReadyState() const;

    /**
     *  @brief Gets the URL of websocket connection.
     */
    const std::string &getUrl() const;

    /**
    * @brief Returns the number of bytes of data that have been queued using calls to send() but not yet transmitted to the network.
    */
    size_t getBufferedAmount() const;

    /**
    * @brief Returns the extensions selected by the server.
    */
    std::string getExtensions() const;

    /**
     *  @brief Gets the protocol selected by websocket server.
     */
    const std::string &getProtocol() const;

    Delegate *getDelegate() const;

private:
    WebSocketImpl *_impl;
};

} // namespace network

} // namespace cc

// end group
/// @}
