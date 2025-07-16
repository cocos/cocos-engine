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

// clang-format off
#include "base/Macros.h"
#include "uv.h"
// clang-format on

#include "cocos/bindings/manual/jsb_websocket_server.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "cocos/network/WebSocketServer.h"

namespace {
template <typename T>
std::shared_ptr<T> sharedPtrObj(se::State &s) {
    auto *privateObj = s.thisObject()->getPrivateObject();
    assert(privateObj->isSharedPtr());
    return static_cast<se::SharedPtrPrivateObject<T> *>(privateObj)->getData();
}
} // namespace

se::Class *__jsb_WebSocketServer_class = nullptr;            // NOLINT
se::Class *__jsb_WebSocketServer_Connection_class = nullptr; // NOLINT

static int sendIndex = 1;

static ccstd::string genSendIndex() {
    char buf[128] = {0};
    snprintf(buf, 127, "__send_[%d]", sendIndex++);
    return buf;
}

static bool WebSocketServer_finalize(se::State &s) { // NOLINT(readability-identifier-naming)
    auto *cobj = static_cast<cc::network::WebSocketServer *>(s.nativeThisObject());
    CC_LOG_INFO("jsbindings: finalizing JS object %p (WebSocketServer)", cobj);
    return true;
}
SE_BIND_FINALIZE_FUNC(WebSocketServer_finalize)

static bool WebSocketServer_constructor(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    int argc = static_cast<int>(args.size());
    if (argc == 0) {
        se::Object *obj = s.thisObject();
        auto *cobj = ccnew cc::network::WebSocketServer();
        obj->setPrivateData(cobj);
        cobj->setData(obj);

        cobj->setOnBegin([obj]() {
            obj->root();
        });

        cobj->setOnEnd([obj]() {
            obj->unroot();
        });

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 0", argc);
    return false;
}
SE_BIND_CTOR(WebSocketServer_constructor, __jsb_WebSocketServer_class, WebSocketServer_finalize)

static bool WebSocketServer_listen(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    int argc = static_cast<int>(args.size());
    if (argc == 0) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 1,2,3", argc);
        return false;
    }

    auto cobj = sharedPtrObj<cc::network::WebSocketServer>(s);
    int argPort = 0;
    ccstd::string argHost;
    std::function<void(const ccstd::string &)> argCallback;

    bool ok;

    if (argc >= 1) { // port
        ok = sevalue_to_native(args[0], &argPort);
        SE_PRECONDITION2(ok, false, "Convert args[0] to port failed");
    }
    if (argc >= 2) {              // host or callback
        if (args[1].isString()) { //to host
            ok = sevalue_to_native(args[1], &argHost);
            SE_PRECONDITION2(ok, false, "Convert args[1] to host failed");
        }
        se::Object *funObj = nullptr;
        if (args[1].isObject() && args[1].toObject()->isFunction()) {
            funObj = args[1].toObject();
        }

        if (argc > 2 && args[2].isObject() && args[2].toObject()->isFunction()) {
            funObj = args[2].toObject();
        }
        if (funObj) {
            s.thisObject()->setProperty("__onlisten", se::Value(funObj));
            std::weak_ptr<cc::network::WebSocketServer> serverWeak = cobj;
            argCallback = [serverWeak](const ccstd::string &err) {
                se::AutoHandleScope hs;

                auto serverPtr = serverWeak.lock();
                if (!serverPtr) {
                    return;
                }
                auto *sobj = static_cast<se::Object *>(serverPtr->getData());
                if (!sobj) {
                    return;
                }
                se::Value callback;
                if (!sobj->getProperty("__onlisten", &callback)) {
                    SE_REPORT_ERROR("onlisten attribute not set!");
                    return;
                }

                se::ValueArray args;
                if (!err.empty()) {
                    args.push_back(se::Value(err));
                }
                bool success = callback.toObject()->call(args, sobj, nullptr);
                if (!success) {
                    se::ScriptEngine::getInstance()->clearException();
                }
            };
        }
    }

    cc::network::WebSocketServer::listenAsync(cobj, argPort, argHost, argCallback);
    return true;
}
SE_BIND_FUNC(WebSocketServer_listen)

static bool WebSocketServer_onconnection(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    int argc = static_cast<int>(args.size());
    if (!(argc == 1 && args[0].isObject() && args[0].toObject()->isFunction())) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 1 & function", argc);
        return false;
    }

    s.thisObject()->setProperty("__onconnection", args[0]);

    auto cobj = sharedPtrObj<cc::network::WebSocketServer>(s);
    std::weak_ptr<cc::network::WebSocketServer> serverWeak = cobj;

    cobj->setOnConnection([serverWeak](const std::shared_ptr<cc::network::WebSocketServerConnection> &conn) {
        se::AutoHandleScope hs;

        auto server = serverWeak.lock();
        if (!server) {
            return;
        }
        auto *sobj = static_cast<se::Object *>(server->getData());
        if (!sobj) {
            return;
        }
        se::Value callback;
        if (!sobj->getProperty("__onconnection", &callback)) {
            SE_REPORT_ERROR("onconnection callback not found!");
            return;
        }

        se::Object *obj = se::Object::createObjectWithClass(__jsb_WebSocketServer_Connection_class);
        // a connection is dead only if no reference & closed!
        obj->root();
        obj->setPrivateObject(se::shared_ptr_private_object(conn));

        conn->setData(obj);
        std::weak_ptr<cc::network::WebSocketServerConnection> connWeak = conn;
        conn->setOnEnd([connWeak, obj]() {
            // release we connection is gone!
            auto ptr = connWeak.lock();
            if (ptr) {
                auto *sobj = static_cast<se::Object *>(ptr->getData());
                sobj->unroot();
                CC_ASSERT_EQ(obj, sobj);
            }
        });
        se::ValueArray args;
        args.push_back(se::Value(obj));
        bool success = callback.toObject()->call(args, sobj, nullptr);
        ;
        if (!success) {
            se::ScriptEngine::getInstance()->clearException();
        }
    });
    return true;
}
SE_BIND_PROP_SET(WebSocketServer_onconnection)

static bool WebSocketServer_onclose(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    int argc = static_cast<int>(args.size());
    if (argc != 1) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 1", argc);
        return false;
    }
    if (!(args[0].isObject() && args[0].toObject()->isFunction())) {
        SE_REPORT_ERROR("argument type error, function expected!");
    }

    std::function<void(const ccstd::string &)> callback;
    auto cobj = sharedPtrObj<cc::network::WebSocketServer>(s);
    std::weak_ptr<cc::network::WebSocketServer> serverWeak = cobj;
    s.thisObject()->setProperty("__onclose", args[0]);

    callback = [serverWeak](const ccstd::string &err) {
        se::AutoHandleScope hs;

        auto server = serverWeak.lock();
        if (!server) {
            return;
        }
        auto *sobj = static_cast<se::Object *>(server->getData());
        if (!sobj) {
            return;
        }
        se::Value callback;
        if (!sobj->getProperty("__onclose", &callback)) {
            SE_REPORT_ERROR("onclose callback not found!");
            return;
        }

        se::ValueArray args;
        if (!err.empty()) {
            args.push_back(se::Value(err));
        }
        bool success = callback.toObject()->call(args, sobj, nullptr);
        if (!success) {
            se::ScriptEngine::getInstance()->clearException();
        }
    };
    cobj->setOnClose(callback);
    return true;
}
SE_BIND_PROP_SET(WebSocketServer_onclose)

static bool WebSocketServer_close(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    int argc = static_cast<int>(args.size());
    if (argc > 1) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 0, 1", argc);
        return false;
    }

    std::function<void(const ccstd::string &)> callback;
    auto cobj = sharedPtrObj<cc::network::WebSocketServer>(s);

    if (argc == 1) {
        if (args[0].isObject() && args[0].toObject()->isFunction()) {
            s.thisObject()->setProperty("__close", args[0]);
            std::weak_ptr<cc::network::WebSocketServer> serverWeak = cobj;

            callback = [serverWeak](const ccstd::string &err) {
                se::AutoHandleScope hs;

                auto server = serverWeak.lock();
                if (!server) {
                    return;
                }
                auto *sobj = static_cast<se::Object *>(server->getData());
                if (!sobj) {
                    return;
                }
                se::Value callback;
                if (!sobj->getProperty("__close", &callback)) {
                    SE_REPORT_ERROR("onclose callback not found!");
                    return;
                }

                se::ValueArray args;
                if (!err.empty()) {
                    args.push_back(se::Value(err));
                }
                bool success = callback.toObject()->call(args, sobj, nullptr);
                if (!success) {
                    se::ScriptEngine::getInstance()->clearException();
                }
            };
            cobj->closeAsync(callback);
        } else {
            SE_REPORT_ERROR("wrong argument type, function expected");
            return false;
        }
    } else {
        cobj->closeAsync();
    }

    return true;
}
SE_BIND_FUNC(WebSocketServer_close)

static bool WebSocketServer_connections(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    int argc = static_cast<int>(args.size());

    if (argc == 0) {
        auto cobj = sharedPtrObj<cc::network::WebSocketServer>(s);
        auto conns = cobj->getConnections();
        se::Object *ret = se::Object::createArrayObject(conns.size());
        for (uint32_t i = 0; i < conns.size(); i++) {
            std::shared_ptr<cc::network::WebSocketServerConnection> &con = conns[i];
            auto *obj = static_cast<se::Object *>(con->getData());
            ret->setArrayElement(i, se::Value(obj));
        }
        s.rval().setObject(ret);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 0", argc);
    return false;
}
SE_BIND_PROP_GET(WebSocketServer_connections)

static bool WebSocketServer_Connection_finalize(se::State &s) { // NOLINT(readability-identifier-naming)
    auto *cobj = static_cast<cc::network::WebSocketServerConnection *>(s.nativeThisObject());
    CC_LOG_INFO("jsbindings: finalizing JS object %p (WebSocketServer_Connection)", cobj);
    return true;
}
SE_BIND_FINALIZE_FUNC(WebSocketServer_Connection_finalize)

static bool WebSocketServer_Connection_constructor(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    int argc = static_cast<int>(args.size());
    if (argc == 0) {
        se::Object *obj = s.thisObject();
        //private data should be set when connected
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 0", argc);
    return false;
}
SE_BIND_CTOR(WebSocketServer_Connection_constructor, __jsb_WebSocketServer_Connection_class, WebSocketServer_Connection_finalize)

static bool WebSocketServer_Connection_send(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    int argc = static_cast<int>(args.size());

    auto cobj = sharedPtrObj<cc::network::WebSocketServerConnection>(s);

    if (!cobj) {
        SE_REPORT_ERROR("Connection is not constructed by WebSocketServer, invalidate format!!");
        return false;
    }

    if (argc >= 1) {
        std::function<void(const ccstd::string &cb)> callback;
        if (args[argc - 1].isObject() && args[argc - 1].toObject()->isFunction()) {
            ccstd::string callbackId = genSendIndex();
            s.thisObject()->setProperty(callbackId.c_str(), args[argc - 1]);
            std::weak_ptr<cc::network::WebSocketServerConnection> connWeak = cobj;

            callback = [callbackId, connWeak](const ccstd::string &err) {
                se::AutoHandleScope hs;
                auto conn = connWeak.lock();
                if (!conn) {
                    return;
                }
                auto *sobj = static_cast<se::Object *>(conn->getData());
                if (!sobj) {
                    return;
                }
                se::Value callback;
                if (!sobj->getProperty(callbackId.c_str(), &callback)) {
                    SE_REPORT_ERROR("send[%s] callback not found!", callbackId.c_str());
                    return;
                }
                se::ValueArray args;
                if (!err.empty()) {
                    args.push_back(se::Value(err));
                }
                bool success = callback.toObject()->call(args, sobj, nullptr);
                if (!success) {
                    se::ScriptEngine::getInstance()->clearException();
                }
                sobj->deleteProperty(callbackId.c_str());
            };
        }

        bool ok = false;
        if (args[0].isString()) {
            ccstd::string data;
            ok = sevalue_to_native(args[0], &data);
            SE_PRECONDITION2(ok, false, "Convert string failed");
            cobj->sendTextAsync(data, callback);
        } else if (args[0].isObject()) {
            se::Object *dataObj = args[0].toObject();
            uint8_t *ptr = nullptr;
            size_t length = 0;
            if (dataObj->isArrayBuffer()) {
                ok = dataObj->getArrayBufferData(&ptr, &length);
                SE_PRECONDITION2(ok, false, "getArrayBufferData failed!");
            } else if (dataObj->isTypedArray()) {
                ok = dataObj->getTypedArrayData(&ptr, &length);
                SE_PRECONDITION2(ok, false, "getTypedArrayData failed!");
            } else {
                CC_ABORT();
            }

            cobj->sendBinaryAsync(ptr, static_cast<unsigned int>(length), callback);
        } else {
            CC_ABORT();
        }

        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 1", argc);
    return false;
}
SE_BIND_FUNC(WebSocketServer_Connection_send)

static bool WebSocketServer_Connection_close(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    int argc = static_cast<int>(args.size());
    if (argc > 1) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 0, 1", argc);
        return false;
    }

    auto *cobj = static_cast<cc::network::WebSocketServerConnection *>(s.nativeThisObject());

    if (!cobj) {
        SE_REPORT_ERROR("Connection is not constructed by WebSocketServer, invalidate format!!");
        return false;
    }

    std::function<void(const ccstd::string &)> callback;
    int argCode = -1;
    ccstd::string argReason;
    bool ok;

    if (argc >= 1) {
        ok = sevalue_to_native(args[0], &argCode);
        SE_PRECONDITION2(ok, false, "Convert args[0] should be a number");

        if (argc >= 2) {
            ok = sevalue_to_native(args[1], &argReason);
            SE_PRECONDITION2(ok, false, "Convert args[1] should be a string");
        }
    }

    if (argCode > 0 && !argReason.empty()) {
        cobj->closeAsync(argCode, argReason);
    } else if (argCode > 0) {
        cobj->closeAsync(argCode, "unknown reason");
    } else {
        cobj->closeAsync(1000, "default close reason");
    }
    return true;
}
SE_BIND_FUNC(WebSocketServer_Connection_close)

static bool WebSocketServer_Connection_onconnect(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    int argc = static_cast<int>(args.size());
    if (!(argc == 1 && args[0].isObject() && args[0].toObject()->isFunction())) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 1 & function", argc);
        return false;
    }

    auto cobj = sharedPtrObj<cc::network::WebSocketServerConnection>(s);

    if (!cobj) {
        SE_REPORT_ERROR("Connection is not constructed by WebSocketServer, invalidate format!!");
        return false;
    }

    s.thisObject()->setProperty("__onconnect", args[0]);

    std::weak_ptr<cc::network::WebSocketServerConnection> connWeak = cobj;

    cobj->setOnConnect([connWeak]() {
        se::AutoHandleScope hs;
        auto conn = connWeak.lock();
        if (!conn) {
            return;
        }
        auto *sobj = static_cast<se::Object *>(conn->getData());
        if (!sobj) {
            return;
        }
        se::Value callback;
        if (!sobj->getProperty("__onconnect", &callback)) {
            SE_REPORT_ERROR("__onconnect callback not found!");
            return;
        }
        se::ValueArray args;
        bool success = callback.toObject()->call(args, sobj, nullptr);
        ;
        if (!success) {
            se::ScriptEngine::getInstance()->clearException();
        }
    });
    return true;
}
SE_BIND_PROP_SET(WebSocketServer_Connection_onconnect)

static bool WebSocketServer_Connection_onerror(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    int argc = static_cast<int>(args.size());
    if (!(argc == 1 && args[0].isObject() && args[0].toObject()->isFunction())) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 1 & function", argc);
        return false;
    }
    auto cobj = sharedPtrObj<cc::network::WebSocketServerConnection>(s);

    if (!cobj) {
        SE_REPORT_ERROR("Connection is not constructed by WebSocketServer, invalidate format!!");
        return false;
    }

    s.thisObject()->setProperty("__onerror", args[0]);
    std::weak_ptr<cc::network::WebSocketServerConnection> connWeak = cobj;

    cobj->setOnError([connWeak](const ccstd::string &err) {
        se::AutoHandleScope hs;
        auto conn = connWeak.lock();
        if (!conn) {
            return;
        }
        auto *sobj = static_cast<se::Object *>(conn->getData());
        if (!sobj) {
            return;
        }
        se::Value callback;
        if (!sobj->getProperty("__onerror", &callback)) {
            SE_REPORT_ERROR("__onerror callback not found!");
            return;
        }
        se::ValueArray args;
        if (!err.empty()) {
            args.push_back(se::Value(err));
        }
        bool success = callback.toObject()->call(args, sobj, nullptr);
        ;
        if (!success) {
            se::ScriptEngine::getInstance()->clearException();
        }
    });
    return true;
}
SE_BIND_PROP_SET(WebSocketServer_Connection_onerror)

static bool WebSocketServer_Connection_onclose(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    int argc = static_cast<int>(args.size());
    if (!(argc == 1 && args[0].isObject() && args[0].toObject()->isFunction())) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 1 & function", argc);
        return false;
    }
    auto cobj = sharedPtrObj<cc::network::WebSocketServerConnection>(s);

    if (!cobj) {
        SE_REPORT_ERROR("Connection is not constructed by WebSocketServer, invalidate format!!");
        return false;
    }

    s.thisObject()->setProperty("__onclose", args[0]);
    std::weak_ptr<cc::network::WebSocketServerConnection> connWeak = cobj;

    cobj->setOnClose([connWeak](int code, const ccstd::string &err) {
        se::AutoHandleScope hs;

        auto conn = connWeak.lock();
        if (!conn) {
            return;
        }
        auto *sobj = static_cast<se::Object *>(conn->getData());
        if (!sobj) {
            return;
        }
        se::Value callback;
        if (!sobj->getProperty("__onclose", &callback)) {
            SE_REPORT_ERROR("__onclose callback not found!");
            return;
        }

        se::ValueArray args;
        args.push_back(se::Value(code));
        if (!err.empty()) {
            args.push_back(se::Value(err));
        }
        bool success = callback.toObject()->call(args, sobj, nullptr);
        ;
        if (!success) {
            se::ScriptEngine::getInstance()->clearException();
        }
    });
    return true;
}
SE_BIND_PROP_SET(WebSocketServer_Connection_onclose)

static bool WebSocketServer_Connection_ontext(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    int argc = static_cast<int>(args.size());
    if (!(argc == 1 && args[0].isObject() && args[0].toObject()->isFunction())) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 1 & function", argc);
        return false;
    }
    auto cobj = sharedPtrObj<cc::network::WebSocketServerConnection>(s);

    if (!cobj) {
        SE_REPORT_ERROR("Connection is not constructed by WebSocketServer, invalidate format!!");
        return false;
    }

    s.thisObject()->setProperty("__ontext", args[0]);
    std::weak_ptr<cc::network::WebSocketServerConnection> connWeak = cobj;

    cobj->setOnText([connWeak](const std::shared_ptr<cc::network::DataFrame> &text) {
        se::AutoHandleScope hs;

        auto conn = connWeak.lock();
        if (!conn) {
            return;
        }
        auto *sobj = static_cast<se::Object *>(conn->getData());
        if (!sobj) {
            return;
        }
        se::Value callback;
        if (!sobj->getProperty("__ontext", &callback)) {
            SE_REPORT_ERROR("__ontext callback not found!");
            return;
        }

        se::ValueArray args;
        args.push_back(se::Value(text->toString()));
        bool success = callback.toObject()->call(args, sobj, nullptr);
        ;
        if (!success) {
            se::ScriptEngine::getInstance()->clearException();
        }
    });
    return true;
}
SE_BIND_PROP_SET(WebSocketServer_Connection_ontext)

static bool WebSocketServer_Connection_onbinary(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    int argc = static_cast<int>(args.size());
    if (!(argc == 1 && args[0].isObject() && args[0].toObject()->isFunction())) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 1 & function", argc);
        return false;
    }
    auto cobj = sharedPtrObj<cc::network::WebSocketServerConnection>(s);

    if (!cobj) {
        SE_REPORT_ERROR("Connection is not constructed by WebSocketServer, invalidate format!!");
        return false;
    }

    s.thisObject()->setProperty("__onbinary", args[0]);
    std::weak_ptr<cc::network::WebSocketServerConnection> connWeak = cobj;

    cobj->setOnBinary([connWeak](const std::shared_ptr<cc::network::DataFrame> &text) {
        se::AutoHandleScope hs;
        auto conn = connWeak.lock();
        if (!conn) {
            return;
        }
        auto *sobj = static_cast<se::Object *>(conn->getData());
        if (!sobj) {
            return;
        }
        se::Value callback;
        if (!sobj->getProperty("__onbinary", &callback)) {
            SE_REPORT_ERROR("__onbinary callback not found!");
            return;
        }

        se::ValueArray args;
        se::Object *buffer = se::Object::createArrayBufferObject(text->getData(), text->size());
        args.push_back(se::Value(buffer));
        bool success = callback.toObject()->call(args, sobj, nullptr);
        ;
        if (!success) {
            se::ScriptEngine::getInstance()->clearException();
        }
    });
    return true;
}
SE_BIND_PROP_SET(WebSocketServer_Connection_onbinary)

//deprecated since v3.7, please use WebSocketServer_Connection_onmessage to instead.
static bool WebSocketServer_Connection_ondata(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    int argc = static_cast<int>(args.size());
    if (!(argc == 1 && args[0].isObject() && args[0].toObject()->isFunction())) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 1 & function", argc);
        return false;
    }
    auto cobj = sharedPtrObj<cc::network::WebSocketServerConnection>(s);

    if (!cobj) {
        SE_REPORT_ERROR("Connection is not constructed by WebSocketServer, invalidate format!!");
        return false;
    }

    s.thisObject()->setProperty("__ondata", args[0]);
    std::weak_ptr<cc::network::WebSocketServerConnection> connWeak = cobj;

    cobj->setOnMessage([connWeak](const std::shared_ptr<cc::network::DataFrame> &text) {
        se::AutoHandleScope hs;

        auto connPtr = connWeak.lock();
        if (!connPtr) {
            return;
        }
        auto *sobj = static_cast<se::Object *>(connPtr->getData());
        if (!sobj) {
            return;
        }

        se::Value callback;
        if (!sobj->getProperty("__ondata", &callback)) {
            return;
        }

        se::ValueArray args;
        if (text->isBinary()) {
            se::Object *buffer = se::Object::createArrayBufferObject(text->getData(), text->size());
            args.push_back(se::Value(buffer));
        } else if (text->isString()) {
            args.push_back(se::Value(text->toString()));
        }
        bool success = callback.toObject()->call(args, sobj, nullptr);
        ;
        if (!success) {
            se::ScriptEngine::getInstance()->clearException();
        }
    });
    SE_REPORT_ERROR("Deprecated callback function ondata since v3.7, please use onmessage to instead.");
    return true;
}
SE_BIND_PROP_SET(WebSocketServer_Connection_ondata)

static bool WebSocketServer_Connection_onmessage(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    int argc = static_cast<int>(args.size());
    if (!(argc == 1 && args[0].isObject() && args[0].toObject()->isFunction())) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 1 & function", argc);
        return false;
    }
    auto cobj = sharedPtrObj<cc::network::WebSocketServerConnection>(s);

    if (!cobj) {
        SE_REPORT_ERROR("Connection is not constructed by WebSocketServer, invalidate format!!");
        return false;
    }

    s.thisObject()->setProperty("__onmessage", args[0]);
    std::weak_ptr<cc::network::WebSocketServerConnection> connWeak = cobj;

    cobj->setOnMessage([connWeak](const std::shared_ptr<cc::network::DataFrame> &text) {
        se::AutoHandleScope hs;

        auto connPtr = connWeak.lock();
        if (!connPtr) {
            return;
        }
        auto *sobj = static_cast<se::Object *>(connPtr->getData());
        if (!sobj) {
            return;
        }

        se::Value callback;
        if (!sobj->getProperty("__onmessage", &callback)) {
            return;
        }

        se::ValueArray args;
        if (text->isBinary()) {
            se::Object *buffer = se::Object::createArrayBufferObject(text->getData(), text->size());
            args.push_back(se::Value(buffer));
        } else if (text->isString()) {
            args.push_back(se::Value(text->toString()));
        }
        bool success = callback.toObject()->call(args, sobj, nullptr);
        ;
        if (!success) {
            se::ScriptEngine::getInstance()->clearException();
        }
    });
    return true;
}
SE_BIND_PROP_SET(WebSocketServer_Connection_onmessage)

static bool WebSocketServer_Connection_headers(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    int argc = static_cast<int>(args.size());

    if (argc == 0) {
        auto *cobj = static_cast<cc::network::WebSocketServerConnection *>(s.nativeThisObject());
        auto headers = cobj->getHeaders();
        se::Object *ret = se::Object::createPlainObject();
        for (auto &itr : headers) {
            ret->setProperty(itr.first.c_str(), se::Value(itr.second));
        }
        s.rval().setObject(ret);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 0", argc);
    return false;
}
SE_BIND_PROP_GET(WebSocketServer_Connection_headers)

static bool WebSocketServer_Connection_protocols(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    int argc = static_cast<int>(args.size());

    if (argc == 0) {
        auto *cobj = static_cast<cc::network::WebSocketServerConnection *>(s.nativeThisObject());
        auto protocols = cobj->getProtocols();
        se::Object *ret = se::Object::createArrayObject(protocols.size());
        for (uint32_t i = 0; i < protocols.size(); i++) {
            ret->setArrayElement(i, se::Value(protocols[i]));
        }
        s.rval().setObject(ret);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 0", argc);
    return false;
}
SE_BIND_PROP_GET(WebSocketServer_Connection_protocols)

static bool WebSocketServer_Connection_protocol(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    int argc = static_cast<int>(args.size());

    if (argc == 0) {
        auto *cobj = static_cast<cc::network::WebSocketServerConnection *>(s.nativeThisObject());
        auto protocols = cobj->getProtocols();
        if (!protocols.empty()) {
            s.rval().setString(protocols[0]);
        } else {
            s.rval().setUndefined();
        }
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 0", argc);
    return false;
}
SE_BIND_PROP_GET(WebSocketServer_Connection_protocol)

static bool WebSocketServer_Connection_readyState(se::State &s) { // NOLINT(readability-identifier-naming)
    const auto &args = s.args();
    int argc = static_cast<int>(args.size());

    if (argc == 0) {
        auto *cobj = static_cast<cc::network::WebSocketServerConnection *>(s.nativeThisObject());
        auto state = cobj->getReadyState();
        s.rval().setInt32(state);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting 0", argc);
    return false;
}
SE_BIND_PROP_GET(WebSocketServer_Connection_readyState)

bool register_all_websocket_server(se::Object *obj) {
    se::Class *cls = se::Class::create("WebSocketServer", obj, nullptr, _SE(WebSocketServer_constructor));
    cls->defineFinalizeFunction(_SE(WebSocketServer_finalize));

    cls->defineFunction("close", _SE(WebSocketServer_close));
    cls->defineFunction("listen", _SE(WebSocketServer_listen));
    cls->defineProperty("onconnection", nullptr, _SE(WebSocketServer_onconnection));
    cls->defineProperty("onclose", nullptr, _SE(WebSocketServer_onclose));
    cls->defineProperty("connections", _SE(WebSocketServer_connections), nullptr);
    cls->install();

    JSBClassType::registerClass<cc::network::WebSocketServer>(cls);
    __jsb_WebSocketServer_class = cls;
    se::ScriptEngine::getInstance()->clearException();

    cls = se::Class::create("WebSocketServerConnection", obj, nullptr, _SE(WebSocketServer_Connection_constructor));
    cls->defineFinalizeFunction(_SE(WebSocketServer_Connection_finalize));
    cls->defineFunction("close", _SE(WebSocketServer_Connection_close));
    cls->defineFunction("send", _SE(WebSocketServer_Connection_send));

    cls->defineProperty("ontext", nullptr, _SE(WebSocketServer_Connection_ontext));
    cls->defineProperty("onbinary", nullptr, _SE(WebSocketServer_Connection_onbinary));
    cls->defineProperty("onconnect", nullptr, _SE(WebSocketServer_Connection_onconnect));
    cls->defineProperty("onerror", nullptr, _SE(WebSocketServer_Connection_onerror));
    cls->defineProperty("onclose", nullptr, _SE(WebSocketServer_Connection_onclose));
    cls->defineProperty("ondata", nullptr, _SE(WebSocketServer_Connection_ondata)); //deprecated since v3.7, please use onmessage to instead.
    cls->defineProperty("onmessage", nullptr, _SE(WebSocketServer_Connection_onmessage));

    cls->defineProperty("headers", _SE(WebSocketServer_Connection_headers), nullptr);
    cls->defineProperty("protocols", _SE(WebSocketServer_Connection_protocols), nullptr);
    cls->defineProperty("protocol", _SE(WebSocketServer_Connection_protocol), nullptr);
    cls->defineProperty("readyState", _SE(WebSocketServer_Connection_readyState), nullptr);

    cls->install();

    se::Value tmp;
    obj->getProperty("WebSocketServerConnection", &tmp);
    tmp.toObject()->setProperty("CONNECTING", se::Value(cc::network::WebSocketServerConnection::CONNECTING));
    tmp.toObject()->setProperty("OPEN", se::Value(cc::network::WebSocketServerConnection::OPEN));
    tmp.toObject()->setProperty("CLOSING", se::Value(cc::network::WebSocketServerConnection::CLOSING));
    tmp.toObject()->setProperty("CLOSED", se::Value(cc::network::WebSocketServerConnection::CLOSED));

    JSBClassType::registerClass<cc::network::WebSocketServerConnection>(cls);
    __jsb_WebSocketServer_Connection_class = cls;
    se::ScriptEngine::getInstance()->clearException();

    return true;
}
