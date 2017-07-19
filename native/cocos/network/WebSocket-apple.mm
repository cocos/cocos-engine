//
//  WebSocket-apple.m
//  cocos2d_libs
//
//  Created by James Chen on 7/3/17.
//
//

#include "network/WebSocket.h"
#include "base/CCData.h"

#import "SocketRocket/SocketRocket.h"

@interface WebSocketImpl : NSObject<SRWebSocketDelegate>
{

}

@end

//

@implementation WebSocketImpl
{
    SRWebSocket* _ws;
    cocos2d::network::WebSocket* _ccws;
    cocos2d::network::WebSocket::Delegate* _delegate;
    std::string _url;
    std::string _selectedProtocol;
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
    [_ws close];
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
    NSLog(@"Websocket Connected");
    if (webSocket.protocol != nil)
        _selectedProtocol = [webSocket.protocol UTF8String];
    _delegate->onOpen(_ccws);
}

- (void)webSocket:(SRWebSocket *)webSocket didFailWithError:(NSError *)error;
{
    NSLog(@":( Websocket Failed With Error %@", error);
    _delegate->onError(_ccws, cocos2d::network::WebSocket::ErrorCode::UNKNOWN);
    [self webSocket:webSocket didCloseWithCode:0 reason:@"onerror" wasClean:YES];
}

- (void)webSocket:(SRWebSocket *)webSocket didReceiveMessageWithString:(nonnull NSString *)string
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

- (void)webSocket:(SRWebSocket *)webSocket didReceiveMessageWithData:(NSData *)nsData
{
    cocos2d::network::WebSocket::Data data;
    data.bytes = (char*)nsData.bytes;
    data.len = nsData.length;
    data.isBinary = true;
    data.issued = 0;
    data.ext = nullptr;
    _delegate->onMessage(_ccws, data);
}

- (void)webSocket:(SRWebSocket *)webSocket didCloseWithCode:(NSInteger)code reason:(NSString *)reason wasClean:(BOOL)wasClean
{
    _delegate->onClose(_ccws);
}

@end


NS_CC_BEGIN

namespace network {

void WebSocket::closeAllConnections()
{

}

WebSocket::WebSocket()
: _impl(nil)
{

}

WebSocket::~WebSocket()
{
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
        printf("Couldn't send message since websocket wasn't opened!\n");
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
        printf("Couldn't send message since websocket wasn't opened!\n");
    }
}


void WebSocket::close()
{
    if ([_impl getReadyState] == State::CLOSING || [_impl getReadyState] == State::CLOSED)
    {
        printf("WebSocket (%p) was closed, no need to close it again!\n", this);
        return;
    }

    [_impl close];
}

void WebSocket::closeAsync()
{
    if ([_impl getReadyState] == State::CLOSING || [_impl getReadyState] == State::CLOSED)
    {
        printf("WebSocket (%p) was closed, no need to close it again!\n", this);
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
