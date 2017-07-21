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

#include "cocos2d.h"
#include "extensions/cocos-ext.h"

using namespace cocos2d;
using namespace cocos2d::extension;

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
        JSB_PRECONDITION2(ok, false, "Converting 'url' failed!");

        se::Value func = args[1];
        assert(func.isObject() && func.toObject()->isFunction());

        func.toObject()->setKeepRootedUntilDie(true);

        auto onSuccess = [func](Texture2D* tex) -> bool {

            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.resize(2);

            if (tex != nullptr)
            {
                args[0].setBoolean(true);
                bool ok = native_ptr_to_seval<Texture2D>(tex, &args[1]);
                JSB_PRECONDITION2(ok, false, "Converting 'tex' argument failed!");
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
                Director::getInstance()->getScheduler()->performFunctionInCocosThread([downloader](){
                    delete downloader;
                });
            };

            downloader->onTaskError = [downloader, onError](const cocos2d::network::DownloadTask& task, int errorCode, int errorCodeInternal, const std::string& errorStr)
            {
                onError();
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

    se::ScriptEngine::getInstance()->clearException();

    return true;
}
