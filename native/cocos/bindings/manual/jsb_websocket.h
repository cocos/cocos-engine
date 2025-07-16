/****************************************************************************
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

#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/network/WebSocket.h"

namespace se {
class Object;
class Value;
} // namespace se

class JsbWebSocketDelegate : public cc::RefCounted, public cc::network::WebSocket::Delegate {
public:
    JsbWebSocketDelegate();

    void onOpen(cc::network::WebSocket *ws) override;

    void onMessage(cc::network::WebSocket *ws,
                   const cc::network::WebSocket::Data &data) override;

    void onClose(cc::network::WebSocket *ws, uint16_t code, const ccstd::string &reason, bool wasClean) override;

    void onError(cc::network::WebSocket *ws,
                 const cc::network::WebSocket::ErrorCode &error) override;

    void setJSDelegate(const se::Value &jsDelegate);

private:
    ~JsbWebSocketDelegate() override;

    se::Value _JSDelegate; // NOLINT (bugprone-reserved-identifier)
};

SE_DECLARE_FINALIZE_FUNC(WebSocket_finalize);

bool register_all_websocket(se::Object *obj); // NOLINT (readability-identifier-naming)
