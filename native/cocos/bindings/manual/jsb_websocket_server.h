/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

    #include "cocos/bindings/jswrapper/SeApi.h"
namespace se {
class Object;
class Value;
} // namespace se

SE_DECLARE_FINALIZE_FUNC(WebSocketServer_finalize);
SE_DECLARE_FUNC(WebSocketServer_constructor);
SE_DECLARE_FUNC(WebSocketServer_listen);
SE_DECLARE_FUNC(WebSocketServer_close);
SE_DECLARE_FUNC(WebSocketServer_onconnection);
SE_DECLARE_FUNC(WebSocketServer_onclose);
SE_DECLARE_FUNC(WebSocketServer_connections);
SE_DECLARE_FUNC(WebSocketServer_Connection_constructor);

SE_DECLARE_FUNC(WebSocketServer_Connection_finalize);
SE_DECLARE_FUNC(WebSocketServer_Connection_close);
SE_DECLARE_FUNC(WebSocketServer_Connection_send);

SE_DECLARE_FUNC(WebSocketServer_Connection_ontext);
SE_DECLARE_FUNC(WebSocketServer_Connection_onbinary);
SE_DECLARE_FUNC(WebSocketServer_Connection_onconnect);
SE_DECLARE_FUNC(WebSocketServer_Connection_onerror);
SE_DECLARE_FUNC(WebSocketServer_Connection_onclose);
SE_DECLARE_FUNC(WebSocketServer_Connection_ondata);

SE_DECLARE_FUNC(WebSocketServer_Connection_headers);
SE_DECLARE_FUNC(WebSocketServer_Connection_protocols);
SE_DECLARE_FUNC(WebSocketServer_Connection_protocol);
SE_DECLARE_FUNC(WebSocketServer_Connection_readyState);

bool register_all_websocket_server(se::Object *obj);

#endif //#if (USE_SOCKET > 0) && (USE_WEBSOCKET_SERVER > 0)