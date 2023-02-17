/****************************************************************************
 Copyright (c) 2015 Chris Hannon http://www.channon.us
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

#include <functional>
#include "base/Macros.h"
#include "base/RefMap.h"
#include "base/std/container/string.h"
#include "base/std/container/unordered_map.h"

/**
 * @addtogroup network
 * @{
 */

namespace cc {

namespace network {

//forward declarations
class SIOClientImpl;
class SIOClient;

/**
 * Singleton and wrapper class to provide static creation method as well as registry of all sockets.
 *
 * @lua NA
 */
class CC_DLL SocketIO {
public:
    /**
     * Get instance of SocketIO.
     *
     * @return SocketIO* the instance of SocketIO.
     */
    static SocketIO *getInstance();
    static void destroyInstance();

    /**
     * The delegate class to process socket.io events.
     * @lua NA
     */
    class SIODelegate {
    public:
        /** Destructor of SIODelegate. */
        virtual ~SIODelegate() = default;
        /**
         * This is kept for backwards compatibility, connect is now fired as a socket.io event "connect"
         *
         * This function would be called when the related SIOClient object receive messages that mean it have connected to endpoint successfully.
         *
         * @param client the connected SIOClient object.
         */
        virtual void onConnect(SIOClient * /*client*/) { CC_LOG_DEBUG("SIODelegate onConnect fired"); };
        /**
         * This is kept for backwards compatibility, message is now fired as a socket.io event "message"
         *
         * This function would be called when the related SIOClient object receive message or json message.
         *
         * @param client the connected SIOClient object.
         * @param data the message,it could be json message
         */
        virtual void onMessage(SIOClient * /*client*/, const ccstd::string &data) { CC_LOG_DEBUG("SIODelegate onMessage fired with data: %s", data.c_str()); };
        /**
         * Pure virtual callback function, this function should be overridden by the subclass.
         *
         * This function would be called when the related SIOClient object disconnect or receive disconnect signal.
         *
         * @param client the connected SIOClient object.
         */
        virtual void onClose(SIOClient *client) = 0;
        /**
         * Pure virtual callback function, this function should be overridden by the subclass.
         *
         * This function would be called when the related SIOClient object receive error signal or didn't connect the endpoint but do some network operation, eg.,send and emit,etc.
         *
         * @param client the connected SIOClient object.
         * @param data the error message
         */
        virtual void onError(SIOClient *client, const ccstd::string &data) = 0;
        /**
         * Fire event to script when the related SIOClient object receive the fire event signal.
         *
         * @param client the connected SIOClient object.
         * @param eventName the event's name.
         * @param data the event's data information.
         */
        virtual void fireEventToScript(SIOClient * /*client*/, const ccstd::string &eventName, const ccstd::string &data) { CC_LOG_DEBUG("SIODelegate event '%s' fired with data: %s", eventName.c_str(), data.c_str()); };
    };

    /**
     *  Static client creation method, similar to socketio.connect(uri) in JS.
     *  @param  uri      the URI of the socket.io server.
     *  @param  delegate the delegate which want to receive events from the socket.io client.
     *  @return SIOClient* an initialized SIOClient if connected successfully, otherwise nullptr.
     */
    static SIOClient *connect(const ccstd::string &uri, SIODelegate &delegate);

    /**
     *  Static client creation method, similar to socketio.connect(uri) in JS.
     *  @param  uri      the URI of the socket.io server.
     *  @param  delegate the delegate which want to receive events from the socket.io client.
     *  @param caFilePath The ca file path for wss connection
     *  @return SIOClient* an initialized SIOClient if connected successfully, otherwise nullptr.
     */
    static SIOClient *connect(const ccstd::string &uri, SIODelegate &delegate, const ccstd::string &caFilePath);

    /**
     *  Static client creation method, similar to socketio.connect(uri) in JS.
     *  @param  delegate the delegate which want to receive events from the socket.io client.
     *  @param  uri      the URI of the socket.io server.
     *  @return SIOClient* an initialized SIOClient if connected successfully, otherwise nullptr.
     */
    CC_DEPRECATED_ATTRIBUTE static SIOClient *connect(SIODelegate &delegate, const ccstd::string &uri);

private:
    SocketIO();
    virtual ~SocketIO();

    static SocketIO *inst;

    cc::RefMap<ccstd::string, SIOClientImpl *> _sockets;

    SIOClientImpl *getSocket(const ccstd::string &uri);
    void addSocket(const ccstd::string &uri, SIOClientImpl *socket);
    void removeSocket(const ccstd::string &uri);

    friend class SIOClientImpl;

    CC_DISALLOW_COPY_MOVE_ASSIGN(SocketIO)
};

//c++11 style callbacks entities will be created using CC_CALLBACK (which uses std::bind)
using SIOEvent = std::function<void(SIOClient *, const ccstd::string &)>;
//c++11 map to callbacks
using EventRegistry = ccstd::unordered_map<ccstd::string, SIOEvent>;

/**
 * A single connection to a socket.io endpoint.
 *
 * @lua NA
 */
class CC_DLL SIOClient
: public cc::RefCounted {
private:
    friend class SocketIO; // Only SocketIO class could contruct a SIOClient instance.

    ccstd::string _path, _tag;
    bool _connected;
    SIOClientImpl *_socket;

    SocketIO::SIODelegate *_delegate;

    EventRegistry _eventRegistry;
    uint32_t _instanceId;

    void fireEvent(const ccstd::string &eventName, const ccstd::string &data);

    void onOpen();
    void onConnect();
    void socketClosed();

    friend class SIOClientImpl;

    /**
     * Constructor of SIOClient class.
     *
     * @param host the string that represent the host address.
     * @param port the int value represent the port number.
     * @param path the string that represent endpoint.
     * @param impl the SIOClientImpl object.
     * @param delegate the SIODelegate object.
     */
    SIOClient(ccstd::string path, SIOClientImpl *impl, SocketIO::SIODelegate &delegate);
    /**
     * Destructor of SIOClient class.
     */
    ~SIOClient() override;

public:
    /**
     * Get the delegate for the client
     * @return the delegate object for the client
     */
    SocketIO::SIODelegate *getDelegate() { return _delegate; };

    /**
     * Disconnect from the endpoint, onClose will be called for the delegate when complete
     */
    void disconnect();
    /**
     * Send a message to the socket.io server.
     *
     * @param s message.
     */
    void send(const ccstd::string &s);
    /**
     *  Emit the eventname and the args to the endpoint that _path point to.
     * @param eventname
     * @param args
     */
    void emit(const ccstd::string &eventname, const ccstd::string &args);
    /**
     * Used to register a socket.io event callback.
     * Event argument should be passed using CC_CALLBACK2(&Base::function, this).
     * @param eventName the name of event.
     * @param e the callback function.
     */
    void on(const ccstd::string &eventName, SIOEvent e);

    /**
     * Set tag of SIOClient.
     * The tag is used to distinguish the various SIOClient objects.
     * @param tag string object.
     */
    void setTag(const char *tag);

    /**
     * Get tag of SIOClient.
     * @return const char* the pointer point to the _tag.
     */
    const char *getTag() {
        return _tag.c_str();
    }

    /**
     * Gets instance id
     */
    uint32_t getInstanceId() const;
};

} // namespace network

} // namespace cc

// end group
/// @}
