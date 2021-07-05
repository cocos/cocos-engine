/****************************************************************************
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

#include "base/Config.h"
#include "jsb_network_manual.h"
#include "bindings/manual/jsb_conversions.h"
#include "bindings/manual/jsb_global.h"
#include "network/Downloader.h"
#include "bindings/auto/jsb_network_auto.h"

static bool js_cocos2dx_network_Downloader_createDownloadFileTask(se::State &s) { // NOLINT(google-runtime-references,readability-identifier-naming)
    auto *cobj = static_cast<cc::network::Downloader *>(s.nativeThisObject());
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
        std::shared_ptr<const cc::network::DownloadTask> result = cobj->createDownloadFileTask(
            arg0, arg1);
        ok &= DownloadTask_to_seval(*result, &s.rval());
        //ROOT downloader object
        s.thisObject()->root();

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
        std::shared_ptr<const cc::network::DownloadTask> result = cobj->createDownloadFileTask(
            arg0, arg1, arg2);
        ok &= DownloadTask_to_seval(*result, &s.rval());
        //ROOT downloader object
        s.thisObject()->root();

        SE_PRECONDITION2(ok, false,
                         "js_network_Downloader_createDownloadFileTask : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}

SE_BIND_FUNC(js_cocos2dx_network_Downloader_createDownloadFileTask)

static bool js_network_Downloader_setOnFileTaskSuccess(se::State &s) { // NOLINT(google-runtime-references,readability-identifier-naming)
    auto *cobj = static_cast<cc::network::Downloader *>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false, "js_network_Downloader_setOnFileTaskSuccess : Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void(const cc::network::DownloadTask &)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction()) {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](const cc::network::DownloadTask &larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;

                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= DownloadTask_to_seval(larg0, &args[0]);
                    se::Value rval;
                    se::Object *funcObj = jsFunc.toObject();
                    se::Object *thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                    if (thisObj) {
                        thisObj->unroot();
                    }
                };
                arg0 = lambda;
            } else {
                arg0 = nullptr;
            }
        } while (false);
        SE_PRECONDITION2(ok, false, "js_network_Downloader_setOnFileTaskSuccess : Error processing arguments");
        cobj->setOnFileTaskSuccess(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_network_Downloader_setOnFileTaskSuccess) // NOLINT(google-runtime-references,readability-identifier-naming)

static bool js_network_Downloader_setOnTaskError(se::State &s) { // NOLINT(google-runtime-references,readability-identifier-naming)
    auto *cobj = static_cast<cc::network::Downloader *>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false, "js_network_Downloader_setOnTaskError : Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void(const cc::network::DownloadTask &, int, int, const std::string &)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction()) {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](const cc::network::DownloadTask &larg0, int larg1, int larg2, const std::string &larg3) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;

                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(4);
                    ok &= DownloadTask_to_seval(larg0, &args[0]);
                    ok &= int32_to_seval(larg1, &args[1]);
                    ok &= int32_to_seval(larg2, &args[2]);
                    ok &= std_string_to_seval(larg3, &args[3]);
                    se::Value rval;
                    se::Object *thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object *funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                    if (thisObj) {
                        thisObj->unroot();
                    }
                };
                arg0 = lambda;
            } else {
                arg0 = nullptr;
            }
        } while (false);
        SE_PRECONDITION2(ok, false, "js_network_Downloader_setOnTaskError : Error processing arguments");
        cobj->setOnTaskError(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_network_Downloader_setOnTaskError) // NOLINT(google-runtime-references,readability-identifier-naming)

bool register_all_network_manual(se::Object * /*obj*/) {
    __jsb_cc_network_Downloader_proto->defineFunction("createDownloadFileTask",
                                                      _SE(js_cocos2dx_network_Downloader_createDownloadFileTask));
    __jsb_cc_network_Downloader_proto->defineFunction("setOnTaskError",
                                                      _SE(js_network_Downloader_setOnTaskError));
    __jsb_cc_network_Downloader_proto->defineFunction("setOnFileTaskSuccess",
                                                      _SE(js_network_Downloader_setOnFileTaskSuccess));
    return true;
}
