/****************************************************************************
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

#include "cocos/base/CCThreadPool.h"
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_extension_auto.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.h"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"
#include "jsb_cocos2dx_extension_manual.h"

#include "cocos2d.h"
#include "extensions/cocos-ext.h"

using namespace cc;
using namespace cc::extension;

static bool js_cocos2dx_extension_loadRemoteImage(se::State &s) {
    const auto &args = s.args();
    int         argc = (int)args.size();

    if (argc == 2) {
        bool        ok = false;
        std::string url;
        ok = seval_to_std_string(args[0], &url);
        SE_PRECONDITION2(ok, false, "Converting 'url' failed!");

        se::Value func = args[1];
        assert(func.isObject() && func.toObject()->isFunction());

        func.toObject()->root();

        auto onSuccess = [func](Texture2D *tex) -> bool {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.resize(2);

            if (tex != nullptr) {
                args[0].setBoolean(true);
                bool ok = native_ptr_to_seval<Texture2D>(tex, &args[1]);
                SE_PRECONDITION2(ok, false, "Converting 'tex' argument failed!");
            } else {
                args[0].setBoolean(false);
                args[1].setNull();
            }

            return func.toObject()->call(args, nullptr);
        };

        auto onError = [func]() {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.resize(1);
            args[0].setBoolean(false);
            func.toObject()->call(args, nullptr);
        };

        Texture2D *texture = Director::getInstance()->getTextureCache()->getTextureForKey(url);
        if (texture != nullptr) {
            onSuccess(texture);
        } else {
            auto downloader               = new (std::nothrow) cc::network::Downloader();
            downloader->onDataTaskSuccess = [downloader, url, onSuccess, onError](const cc::network::DownloadTask &task, std::vector<unsigned char> &data) {
                Image *    img = new (std::nothrow) Image();
                Texture2D *tex = nullptr;
                do {
                    if (!img->initWithImageData(data.data(), data.size()))
                        break;
                    tex = Director::getInstance()->getTextureCache()->addImage(img, url);
                } while (0);

                CC_SAFE_RELEASE(img);

                if (tex) {
                    onSuccess(tex);
                } else {
                    onError();
                }

                // Downloader may use its member variables after this callback,
                // therefore, we need to execute `delete` operation asynchronously, otherwise crash will be triggered.
                Director::getInstance()->getScheduler()->performFunctionInCocosThread([downloader]() {
                    delete downloader;
                });
            };

            downloader->onTaskError = [downloader, onError](const cc::network::DownloadTask &task, int errorCode, int errorCodeInternal, const std::string &errorStr) {
                onError();

                // Downloader may use its member variables after this callback,
                // therefore, we need to execute `delete` operation asynchronously, otherwise crash will be triggered.
                Director::getInstance()->getScheduler()->performFunctionInCocosThread([downloader]() {
                    delete downloader;
                });
            };

            downloader->createDownloadDataTask(url);
        }
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_extension_loadRemoteImage)

static bool js_cocos2dx_extension_initRemoteImage(se::State &s) {
    const auto &args = s.args();
    int         argc = (int)args.size();
    if (argc != 3) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 3);
        return false;
    }

    bool ok = false;

    // get texture
    cc::Texture2D *texture = nullptr;
    ok                     = seval_to_native_ptr(args[0], &texture);
    SE_PRECONDITION2(ok, false, "Converting 'texture' failed!");

    // get url
    std::string url;
    ok = seval_to_std_string(args[1], &url);
    SE_PRECONDITION2(ok, false, "Converting 'url' failed!");

    // get callback
    se::Value func = args[2];
    assert(func.isObject() && func.toObject()->isFunction());
    func.toObject()->root();

    auto onCallback = [=](bool success) {
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        se::ValueArray args;
        args.resize(1);

        args[0].setBoolean(success);
        func.toObject()->call(args, nullptr);
    };

    auto downloader               = new (std::nothrow) cc::network::Downloader();
    downloader->onDataTaskSuccess = [=](const cc::network::DownloadTask &task, std::vector<unsigned char> &data) {
        bool success = false;

        Image *image = new (std::nothrow) Image();
        if (image->initWithImageData(data.data(), data.size())) {
            if (texture->initWithImage(image)) {
                success = true;
            } else {
                CC_LOG_ERROR("js_extension_loadRemoteImageOn: Failed to initWithImage.");
            }
        }
        CC_SAFE_RELEASE_NULL(image);

        onCallback(success);
        Director::getInstance()->getScheduler()->performFunctionInCocosThread([downloader]() {
            delete downloader;
        });
    };

    downloader->onTaskError = [=](const cc::network::DownloadTask &task, int errorCode, int errorCodeInternal, const std::string &errorStr) {
        onCallback(false);
        Director::getInstance()->getScheduler()->performFunctionInCocosThread([downloader]() {
            delete downloader;
        });
    };

    downloader->createDownloadDataTask(url);
    return true;
}
SE_BIND_FUNC(js_cocos2dx_extension_initRemoteImage)

static ThreadPool *         _threadPool              = nullptr;
static EventListenerCustom *_resetThreadPoolListener = nullptr;
static ThreadPool *         getThreadPool() {
    if (_threadPool == nullptr) {
        _threadPool              = ThreadPool::newSingleThreadPool();
        _resetThreadPoolListener = Director::getInstance()->getEventDispatcher()->addCustomEventListener(Director::EVENT_RESET, [](cc::EventCustom *) {
            CC_SAFE_DELETE(_threadPool);
            cc::Director::getInstance()->getEventDispatcher()->removeEventListener(_resetThreadPoolListener);
            _resetThreadPoolListener = nullptr;
        });
    }
    return _threadPool;
}

bool register_all_cocos2dx_extension_manual(se::Object *obj) {
    __jsbObj->defineFunction("loadRemoteImg", _SE(js_cocos2dx_extension_loadRemoteImage));
    __jsbObj->defineFunction("initRemoteImg", _SE(js_cocos2dx_extension_initRemoteImage));

    se::ScriptEngine::getInstance()->clearException();

    return true;
}
