//
//  jsb_cocos2dx_extension_manual.cpp
//  cocos2d_js_bindings
//
//  Created by James Chen on 6/7/17.
//
//

#include "jsb_cocos2dx_extension_manual.hpp"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_extension_auto.hpp"
#include "cocos/base/CCThreadPool.h"

#include "cocos2d.h"
#include "extensions/cocos-ext.h"

using namespace cocos2d;
using namespace cocos2d::extension;
using namespace cocos2d::experimental;

static bool jsb_cocos2d_extension_empty_func(se::State& s)
{
    return true;
}
SE_BIND_FUNC(jsb_cocos2d_extension_empty_func)


static bool js_cocos2dx_extension_loadRemoteImage(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 2)
    {
        bool ok = false;
        std::string url;
        ok = seval_to_std_string(args[0], &url);
        SE_PRECONDITION2(ok, false, "Converting 'url' failed!");

        se::Value func = args[1];
        assert(func.isObject() && func.toObject()->isFunction());

        func.toObject()->root();

        auto onSuccess = [func](Texture2D* tex) -> bool {

            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.resize(2);

            if (tex != nullptr)
            {
                args[0].setBoolean(true);
                bool ok = native_ptr_to_seval<Texture2D>(tex, &args[1]);
                SE_PRECONDITION2(ok, false, "Converting 'tex' argument failed!");
            }
            else
            {
                args[0].setBoolean(false);
                args[1].setNull();
            }

            return func.toObject()->call(args, nullptr);
        };

        auto onError = [func](){

            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.resize(1);
            args[0].setBoolean(false);
            func.toObject()->call(args, nullptr);
        };

        Texture2D* texture = Director::getInstance()->getTextureCache()->getTextureForKey(url);
        if (texture != nullptr)
        {
            onSuccess(texture);
        }
        else
        {
            auto downloader = new (std::nothrow) cocos2d::network::Downloader();
            downloader->onDataTaskSuccess = [downloader, url, onSuccess, onError](const cocos2d::network::DownloadTask& task, std::vector<unsigned char>& data){
                Image* img = new (std::nothrow) Image();
                Texture2D* tex = nullptr;
                do
                {
                    if (!img->initWithImageData(data.data(), data.size()))
                        break;
                    tex = Director::getInstance()->getTextureCache()->addImage(img, url);
                } while (0);

                CC_SAFE_RELEASE(img);

                if (tex)
                {
                    onSuccess(tex);
                }
                else
                {
                    onError();
                }

                // Downloader may use its member variables after this callback,
                // therefore, we need to execute `delete` operation asynchronously, otherwise crash will be triggered.
                Director::getInstance()->getScheduler()->performFunctionInCocosThread([downloader](){
                    delete downloader;
                });
            };

            downloader->onTaskError = [downloader, onError](const cocos2d::network::DownloadTask& task, int errorCode, int errorCodeInternal, const std::string& errorStr)
            {
                onError();

                // Downloader may use its member variables after this callback,
                // therefore, we need to execute `delete` operation asynchronously, otherwise crash will be triggered.
                Director::getInstance()->getScheduler()->performFunctionInCocosThread([downloader](){
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

static bool js_cocos2dx_extension_initRemoteImage(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc != 3)
    {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 3);
        return false;
    }

    bool ok = false;

    // get texture
    cocos2d::Texture2D* texture = nullptr;
    ok = seval_to_native_ptr(args[0], &texture);
    SE_PRECONDITION2(ok, false, "Converting 'texture' failed!");

    // get url
    std::string url;
    ok = seval_to_std_string(args[1], &url);
    SE_PRECONDITION2(ok, false, "Converting 'url' failed!");

    // get callback
    se::Value func = args[2];
    assert(func.isObject() && func.toObject()->isFunction());
    func.toObject()->root();

    auto onCallback = [=](bool success){
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        se::ValueArray args;
        args.resize(1);

        args[0].setBoolean(success);
        func.toObject()->call(args, nullptr);
    };

    auto downloader = new (std::nothrow) cocos2d::network::Downloader();
    downloader->onDataTaskSuccess = [=](const cocos2d::network::DownloadTask& task, std::vector<unsigned char>& data)
    {
        bool success = false;

        Image* image = new (std::nothrow) Image();
        if (image->initWithImageData(data.data(), data.size()))
        {
            if (texture->initWithImage(image))
            {
                success = true;
            }
            else
            {
                CCLOGERROR("js_cocos2dx_extension_loadRemoteImageOn: Failed to initWithImage.");
            }
        }
        CC_SAFE_RELEASE_NULL(image);

        onCallback(success);
        Director::getInstance()->getScheduler()->performFunctionInCocosThread([downloader](){
            delete downloader;
        });
    };

    downloader->onTaskError = [=](const cocos2d::network::DownloadTask& task, int errorCode, int errorCodeInternal, const std::string& errorStr)
    {
        onCallback(false);
        Director::getInstance()->getScheduler()->performFunctionInCocosThread([downloader](){
            delete downloader;
        });
    };

    downloader->createDownloadDataTask(url);
    return true;
}
SE_BIND_FUNC(js_cocos2dx_extension_initRemoteImage)

static ThreadPool* _threadPool = nullptr;
static EventListenerCustom* _resetThreadPoolListener = nullptr;
static ThreadPool* getThreadPool()
{
    if (_threadPool == nullptr)
    {
        _threadPool = ThreadPool::newSingleThreadPool();
        _resetThreadPoolListener = Director::getInstance()->getEventDispatcher()->addCustomEventListener(Director::EVENT_RESET, [](cocos2d::EventCustom*){
            CC_SAFE_DELETE(_threadPool);
            cocos2d::Director::getInstance()->getEventDispatcher()->removeEventListener(_resetThreadPoolListener);
            _resetThreadPoolListener = nullptr;
        });
    }
    return _threadPool;
}

static bool js_cocos2dx_extension_initTextureAsync(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc != 3)
    {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 3);
        return false;
    }

    bool ok = false;

    // get texture
    cocos2d::Texture2D* texture = nullptr;
    ok = seval_to_native_ptr(args[0], &texture);
    SE_PRECONDITION2(ok, false, "Converting 'texture' failed!");

    // get url
    std::string url;
    ok = seval_to_std_string(args[1], &url);
    SE_PRECONDITION2(ok, false, "Converting 'url' failed!");

    // get callback
    se::Value func = args[2];
    assert(func.isObject() && func.toObject()->isFunction());
    func.toObject()->root();

    auto onCallback = [=](bool success){
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        se::ValueArray args;
        args.resize(1);

        args[0].setBoolean(success);
        func.toObject()->call(args, nullptr);
    };

    // getDataFromFile isn't thread safe since fullPathForFilename usage in getDataFromFile isn't.
    // So we should pass full path to getDataFromFile to avoid multi-thread issues.
    std::string fullPath = FileUtils::getInstance()->fullPathForFilename(url);

    getThreadPool()->pushTask([texture, onCallback, fullPath](int tid){
        Data data = FileUtils::getInstance()->getDataFromFile(fullPath);
        if (!data.isNull())
        {
            Image* image = new (std::nothrow) Image();
            if (image->initWithImageData(data.getBytes(), data.getSize()))
            {
                Director::getInstance()->getScheduler()->performFunctionInCocosThread([=]() {
                    if (texture->initWithImage(image))
                    {
                        onCallback(true);
                    }
                    else
                    {
                        CCLOGERROR("js_cocos2dx_extension_initTextureAsync: Failed to init texture with image.");
                        onCallback(false);
                    }
                    CC_SAFE_RELEASE(image);
                });
                return;
            }
            else
            {
                CCLOGERROR("js_cocos2dx_extension_initTextureAsync: Failed to load image.");
                CC_SAFE_RELEASE(image);
            }
        }
        else
        {
            CCLOGERROR("js_cocos2dx_extension_initTextureAsync: Failed to load file.");
        }

        Director::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
            onCallback(false);
        });
    });

    return true;
}
SE_BIND_FUNC(js_cocos2dx_extension_initTextureAsync)

bool register_all_cocos2dx_extension_manual(se::Object* obj)
{

    // empty 'retain' 'release' implementation
    se::Object* protosNeedEmptyRetainRelease[] = {
        __jsb_cocos2d_extension_AssetsManagerEx_proto,
        __jsb_cocos2d_extension_Manifest_proto
    };

    for (const auto& e : protosNeedEmptyRetainRelease)
    {
        e->defineFunction("retain", _SE(jsb_cocos2d_extension_empty_func));
        e->defineFunction("release", _SE(jsb_cocos2d_extension_empty_func));
    }
    __jsbObj->defineFunction("loadRemoteImg", _SE(js_cocos2dx_extension_loadRemoteImage));
    __jsbObj->defineFunction("initRemoteImg", _SE(js_cocos2dx_extension_initRemoteImage));
    __jsbObj->defineFunction("initTextureAsync", _SE(js_cocos2dx_extension_initTextureAsync));

    se::ScriptEngine::getInstance()->clearException();

    return true;
}
