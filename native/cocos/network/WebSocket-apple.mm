//
//  WebSocket-apple.m
//  cocos2d_libs
//
//  Created by James Chen on 7/3/17.
//
//

#include "network/WebSocket.h"
#include "base/CCData.h"
#include "base/CCDirector.h"
#include "base/CCEventDispatcher.h"
#include "base/CCEventListenerCustom.h"

#import "SocketRocket/SocketRocket.h"

#if !__has_feature(objc_arc)
#error WebSocket must be compiled with ARC enabled
#endif

static std::vector<cocos2d::network::WebSocket*>* __websocketInstances = nullptr;

@interface WebSocketImpl : NSObject<SRWebSocketDelegate>
{

}

@property (nonatomic, assign) cocos2d::EventListenerCustom* resetDirectorListener;

@end

//

@implementation WebSocketImpl
{
    SRWebSocket* _ws;
    cocos2d::network::WebSocket* _ccws;
    cocos2d::network::WebSocket::Delegate* _delegate;

    std::string _url;
    std::string _selectedProtocol;
    bool _isDestroyed;
}

-(id) initWithURL:(const std::string&) url protocols:(NSArray<NSString *> *)protocols allowsUntrustedSSLCertificates:(BOOL)allowsUntrustedSSLCertificates ws:(cocos2d::network::WebSocket*) ccws delegate:(const cocos2d::network::WebSocket::Delegate&) delegate
{
    if (self = [super init])
    {
        _ccws = ccws;
        _delegate = const_cast<cocos2d::network::WebSocket::Delegate*>(&delegate);
        _url = url;
        NSURL* nsUrl = [[NSURL alloc] initWithString:[[NSString alloc] initWithUTF8String:_url.c_str()]];
        _ws = [[SRWebSocket alloc] initWithURL:nsUrl protocols:protocols allowsUntrustedSSLCertificates:allowsUntrustedSSLCertificates];
        _ws.delegate = self;
        [_ws open];
        _isDestroyed = false;
        self.resetDirectorListener = nullptr;
    }
    return self;
}

-(void) dealloc
{
    NSLog(@"WebSocketImpl-apple dealloc: %p, SRWebSocket ref: %ld", self, CFGetRetainCount((__bridge CFTypeRef)_ws));
}

-(void) sendString:(NSString*) message
{
    [_ws sendString:message error:nil];
}

-(void) sendData:(NSData*) data
{
    [_ws sendData:data error:nil];
}

-(void) close
{
    _isDestroyed = true;
    _ccws->retain();
    _delegate->onClose(_ccws);
    [_ws close];
    _ccws->release();
}

-(void) closeAsync
{
    [_ws close];
}

-(cocos2d::network::WebSocket::State) getReadyState
{
    cocos2d::network::WebSocket::State ret;
    SRReadyState state = _ws.readyState;
    switch (state) {
        case SR_OPEN:
            ret = cocos2d::network::WebSocket::State::OPEN;
            break;
        case SR_CONNECTING:
            ret = cocos2d::network::WebSocket::State::CONNECTING;
            break;
        case SR_CLOSING:
            ret = cocos2d::network::WebSocket::State::CLOSING;
            break;
        default:
            ret = cocos2d::network::WebSocket::State::CLOSED;
            break;
    }
    return ret;
}

-(const std::string&) getUrl
{
    return _url;
}

-(const std::string&) getProtocol
{
    return _selectedProtocol;
}

-(cocos2d::network::WebSocket::Delegate*) getDelegate
{
    return (cocos2d::network::WebSocket::Delegate*)_delegate;
}

// Delegate methods

-(void)webSocketDidOpen:(SRWebSocket *)webSocket;
{
    if (!_isDestroyed)
    {
        NSLog(@"Websocket Connected");
        if (webSocket.protocol != nil)
            _selectedProtocol = [webSocket.protocol UTF8String];
        _delegate->onOpen(_ccws);
    }
    else
    {
        NSLog(@"WebSocketImpl webSocketDidOpen was destroyed!");
    }
}

- (void)webSocket:(SRWebSocket *)webSocket didFailWithError:(NSError *)error;
{
    if (!_isDestroyed)
    {
        NSLog(@":( Websocket Failed With Error %@", error);
        _delegate->onError(_ccws, cocos2d::network::WebSocket::ErrorCode::UNKNOWN);
        [self webSocket:webSocket didCloseWithCode:0 reason:@"onerror" wasClean:YES];
    }
    else
    {
        NSLog(@"WebSocketImpl didFailWithError was destroyed!");
    }
}

- (void)webSocket:(SRWebSocket *)webSocket didReceiveMessageWithString:(nonnull NSString *)string
{
    if (!_isDestroyed)
    {
        std::string message = [string UTF8String];
        cocos2d::network::WebSocket::Data data;
        data.bytes = (char*)message.c_str();
        data.len = message.length() + 1;
        data.isBinary = false;
        data.issued = 0;
        data.ext = nullptr;

        _delegate->onMessage(_ccws, data);
    }
    else
    {
        NSLog(@"WebSocketImpl didReceiveMessageWithString was destroyed!");
    }
}

- (void)webSocket:(SRWebSocket *)webSocket didReceiveMessageWithData:(NSData *)nsData
{
    if (!_isDestroyed)
    {
        cocos2d::network::WebSocket::Data data;
        data.bytes = (char*)nsData.bytes;
        data.len = nsData.length;
        data.isBinary = true;
        data.issued = 0;
        data.ext = nullptr;
        _delegate->onMessage(_ccws, data);
    }
    else
    {
        NSLog(@"WebSocketImpl didReceiveMessageWithData was destroyed!");
    }
}

- (void)webSocket:(SRWebSocket *)webSocket didCloseWithCode:(NSInteger)code reason:(NSString *)reason wasClean:(BOOL)wasClean
{
    if (!_isDestroyed)
        _delegate->onClose(_ccws);
    else
        NSLog(@"WebSocketImpl didCloseWithCode was destroyed!");
}

@end


NS_CC_BEGIN

namespace network {

void WebSocket::closeAllConnections()
{
    if (__websocketInstances != nullptr)
    {
        ssize_t count = __websocketInstances->size();
        for (ssize_t i = count-1; i >=0 ; i--)
        {
            WebSocket* instance = __websocketInstances->at(i);
            instance->close();
        }

        __websocketInstances->clear();
        delete __websocketInstances;
        __websocketInstances = nullptr;
    }
}

WebSocket::WebSocket()
: _impl(nil)
{
    if (__websocketInstances == nullptr)
    {
        __websocketInstances = new (std::nothrow) std::vector<WebSocket*>();
    }

    __websocketInstances->push_back(this);
}

WebSocket::~WebSocket()
{
    NSLog(@"In the destructor of WebSocket-apple (%p).", this);

    if (__websocketInstances != nullptr)
    {
        auto iter = std::find(__websocketInstances->begin(), __websocketInstances->end(), this);
        if (iter != __websocketInstances->end())
        {
            __websocketInstances->erase(iter);
        }
        else
        {
            NSLog(@"ERROR: WebSocket instance wasn't added to the container which saves websocket instances!");
        }
    }

    if (_impl != nil)
    {
        cocos2d::Director::getInstance()->getEventDispatcher()->removeEventListener(_impl.resetDirectorListener);
    }
}


bool WebSocket::init(const Delegate& delegate,
                     const std::string& url,
                     const std::vector<std::string>* protocols/* = nullptr*/,
                     const std::string& caFilePath/* = ""*/)
{
    if (url.empty())
        return false;

    NSMutableArray* nsProtocols = [[NSMutableArray alloc] init];
    if (protocols != nullptr)
    {
        for (const auto& protocol : *protocols)
        {
            [nsProtocols addObject:[[NSString alloc] initWithUTF8String:protocol.c_str()]];
        }
    }
    _impl = [[WebSocketImpl alloc] initWithURL: url protocols:nsProtocols allowsUntrustedSSLCertificates:NO ws: this delegate:delegate];

    if (_impl != nil)
    {
        _impl.resetDirectorListener = cocos2d::Director::getInstance()->getEventDispatcher()->addCustomEventListener(cocos2d::Director::EVENT_RESET, [this](cocos2d::EventCustom*){
            close();
        });
    }

    return _impl != nil;
}


void WebSocket::send(const std::string& message)
{
    if ([_impl getReadyState] == State::OPEN)
    {
        NSString* str = [[NSString alloc] initWithUTF8String:message.c_str()];
        [_impl sendString:str];
    }
    else
    {
        NSLog(@"Couldn't send message since websocket wasn't opened!");
    }
}


void WebSocket::send(const unsigned char* binaryMsg, unsigned int len)
{
    if ([_impl getReadyState] == State::OPEN)
    {
        NSData* data = [[NSData alloc] initWithBytes:binaryMsg length:(NSUInteger)len];
        [_impl sendData:data];
    }
    else
    {
        NSLog(@"Couldn't send message since websocket wasn't opened!");
    }
}


void WebSocket::close()
{
    if ([_impl getReadyState] == State::CLOSING || [_impl getReadyState] == State::CLOSED)
    {
        NSLog(@"WebSocket (%p) was closed, no need to close it again!", this);
        return;
    }

    [_impl close];
}

void WebSocket::closeAsync()
{
    if ([_impl getReadyState] == State::CLOSING || [_impl getReadyState] == State::CLOSED)
    {
        NSLog(@"WebSocket (%p) was closed, no need to close it again!", this);
        return;
    }

    [_impl closeAsync];
}

WebSocket::State WebSocket::getReadyState() const
{
    return [_impl getReadyState];
}

const std::string& WebSocket::getUrl() const
{
    return [_impl getUrl];
}

const std::string& WebSocket::getProtocol() const
{
    return [_impl getProtocol];
}

WebSocket::Delegate* WebSocket::getDelegate() const
{
    return [_impl getDelegate];
}

} // namespace network {

NS_CC_END
