/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
#include "base/ccConfig.h"
#include "jsb_cocos2dx_network_manual.h"
#if (USE_NET_WORK > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "network/CCDownloader.h"
#include "scripting/js-bindings/auto/jsb_cocos2dx_network_auto.hpp"

static bool js_cocos2dx_network_Downloader_createDownloadFileTask(se::State &s) {
    cocos2d::network::Downloader *cobj = (cocos2d::network::Downloader *) s.nativeThisObject();
    SE_PRECONDITION2(cobj, false,
                     "js_network_Downloader_createDownloadFileTask : Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        SE_PRECONDITION2(ok, false,
                         "js_network_Downloader_createDownloadFileTask : Error processing arguments");
        std::shared_ptr<const cocos2d::network::DownloadTask> result = cobj->createDownloadFileTask(
                arg0, arg1);
        ok &= DownloadTask_to_seval(*result, &s.rval());
        SE_PRECONDITION2(ok, false,
                         "js_network_Downloader_createDownloadFileTask : Error processing arguments");
        return true;
    }
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_std_string(args[1], &arg1);
        ok &= seval_to_std_string(args[2], &arg2);
        SE_PRECONDITION2(ok, false,
                         "js_network_Downloader_createDownloadFileTask : Error processing arguments");
        std::shared_ptr<const cocos2d::network::DownloadTask> result = cobj->createDownloadFileTask(
                arg0, arg1, arg2);
        ok &= DownloadTask_to_seval(*result, &s.rval());
        SE_PRECONDITION2(ok, false,
                         "js_network_Downloader_createDownloadFileTask : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int) argc, 3);
    return false;
}

SE_BIND_FUNC(js_cocos2dx_network_Downloader_createDownloadFileTask)

bool register_all_cocos2dx_network_manual(se::Object *obj) {
    __jsb_cocos2d_network_Downloader_proto->defineFunction("createDownloadFileTask",
                                                           _SE(js_cocos2dx_network_Downloader_createDownloadFileTask));
    return true;
}
#endif //#if (USE_NET_WORK > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
