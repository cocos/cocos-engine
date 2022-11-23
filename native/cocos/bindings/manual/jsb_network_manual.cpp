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

#include "jsb_network_manual.h"
#include "base/Config.h"
#include "bindings/auto/jsb_network_auto.h"
#include "bindings/manual/jsb_conversions.h"
#include "bindings/manual/jsb_global.h"
#include "network/Downloader.h"

// deprecated since v3.6
static bool js_network_Downloader_createDownloadFileTask(se::State &s) { // NOLINT(readability-identifier-naming)
    auto *cobj = static_cast<cc::network::Downloader *>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false,
                     "js_network_Downloader_createDownloadFileTask : Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        ccstd::string arg0;
        ccstd::string arg1;
        ok &= sevalue_to_native(args[0], &arg0);
        ok &= sevalue_to_native(args[1], &arg1);
        SE_PRECONDITION2(ok, false,
                         "js_network_Downloader_createDownloadFileTask : Error processing arguments");
        std::shared_ptr<const cc::network::DownloadTask> result = cobj->createDownloadTask(
            arg0, arg1);
        ok &= nativevalue_to_se(result, s.rval());
        //ROOT downloader object
        s.thisObject()->root();

        SE_PRECONDITION2(ok, false,
                         "js_network_Downloader_createDownloadFileTask : Error processing arguments");
        return true;
    }
    if (argc == 3) {
        ccstd::string arg0;
        ccstd::string arg1;
        ccstd::string arg2;
        ok &= sevalue_to_native(args[0], &arg0);
        ok &= sevalue_to_native(args[1], &arg1);
        ok &= sevalue_to_native(args[2], &arg2);
        SE_PRECONDITION2(ok, false,
                         "js_network_Downloader_createDownloadFileTask : Error processing arguments");
        std::shared_ptr<const cc::network::DownloadTask> result = cobj->createDownloadTask(
            arg0, arg1, arg2);
        ok &= nativevalue_to_se(result, s.rval());
        //ROOT downloader object
        s.thisObject()->root();

        SE_PRECONDITION2(ok, false,
                         "js_network_Downloader_createDownloadFileTask : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}

SE_BIND_FUNC(js_network_Downloader_createDownloadFileTask)

static bool js_network_Downloader_createDownloadTask(se::State &s) { // NOLINT(readability-identifier-naming)
    auto *cobj = static_cast<cc::network::Downloader *>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false,
                     "js_network_Downloader_createDownloadFileTask : Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        ccstd::string arg0;
        ccstd::string arg1;
        ok &= sevalue_to_native(args[0], &arg0);
        ok &= sevalue_to_native(args[1], &arg1);
        SE_PRECONDITION2(ok, false,
                         "js_network_Downloader_createDownloadTask : Error processing arguments");
        std::shared_ptr<const cc::network::DownloadTask> result = cobj->createDownloadTask(
            arg0, arg1);
        ok &= nativevalue_to_se(result, s.rval());
        //ROOT downloader object
        s.thisObject()->root();

        SE_PRECONDITION2(ok, false,
                         "js_network_Downloader_createDownloadTask : Error processing arguments");
        return true;
    }
    if (argc == 3) {
        ccstd::string arg0;
        ccstd::string arg1;
        ccstd::string arg2;
        ok &= sevalue_to_native(args[0], &arg0);
        ok &= sevalue_to_native(args[1], &arg1);
        ok &= sevalue_to_native(args[2], &arg2);
        SE_PRECONDITION2(ok, false,
                         "js_network_Downloader_createDownloadTask : Error processing arguments");
        std::shared_ptr<const cc::network::DownloadTask> result = cobj->createDownloadTask(
            arg0, arg1, arg2);
        ok &= nativevalue_to_se(result, s.rval());
        //ROOT downloader object
        s.thisObject()->root();

        SE_PRECONDITION2(ok, false,
                         "js_network_Downloader_createDownloadTask : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}

SE_BIND_FUNC(js_network_Downloader_createDownloadTask)

// deprecated since v3.6
static bool js_network_Downloader_setOnFileTaskSuccess(se::State &s) { // NOLINT(readability-identifier-naming)
    auto *cobj = static_cast<cc::network::Downloader *>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");
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
                auto *thisObj = s.thisObject();
                auto lambda = [=](const cc::network::DownloadTask &larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;

                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0]);
                    se::Value rval;
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setOnSuccess(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_network_Downloader_setOnFileTaskSuccess) // NOLINT(readability-identifier-naming)

static bool js_network_Downloader_setOnSuccess(se::State &s) { // NOLINT(readability-identifier-naming)
    auto *cobj = static_cast<cc::network::Downloader *>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");
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
                auto *thisObj = s.thisObject();
                auto lambda = [=](const cc::network::DownloadTask &larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;

                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0]);
                    se::Value rval;
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setOnSuccess(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_network_Downloader_setOnSuccess)

// deprecated in v3.6
static bool js_network_Downloader_setOnTaskError(se::State &s) { // NOLINT(readability-identifier-naming)
    auto *cobj = static_cast<cc::network::Downloader *>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void(const cc::network::DownloadTask &, int, int, const ccstd::string &)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction()) {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto *thisObj = s.thisObject();
                auto lambda = [=](const cc::network::DownloadTask &larg0, int larg1, int larg2, const ccstd::string &larg3) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;

                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(4);
                    ok &= nativevalue_to_se(larg0, args[0]);
                    ok &= nativevalue_to_se(larg1, args[1]);
                    ok &= nativevalue_to_se(larg2, args[2]);
                    ok &= nativevalue_to_se(larg3, args[3]);
                    se::Value rval;
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setOnError(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_network_Downloader_setOnTaskError) // NOLINT(readability-identifier-naming)

static bool js_network_Downloader_setOnError(se::State &s) { // NOLINT(readability-identifier-naming)
    auto *cobj = static_cast<cc::network::Downloader *>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void(const cc::network::DownloadTask &, int, int, const ccstd::string &)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction()) {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto *thisObj = s.thisObject();
                auto lambda = [=](const cc::network::DownloadTask &larg0, int larg1, int larg2, const ccstd::string &larg3) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;

                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(4);
                    ok &= nativevalue_to_se(larg0, args[0]);
                    ok &= nativevalue_to_se(larg1, args[1]);
                    ok &= nativevalue_to_se(larg2, args[2]);
                    ok &= nativevalue_to_se(larg3, args[3]);
                    se::Value rval;
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->setOnError(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC_AS_PROP_SET(js_network_Downloader_setOnError)

bool register_all_network_manual(se::Object * /*obj*/) { // NOLINT(readability-identifier-naming)
    __jsb_cc_network_Downloader_proto->defineProperty("onSuccess", nullptr, _SE(js_network_Downloader_setOnSuccess_asSetter));
    __jsb_cc_network_Downloader_proto->defineProperty("onError", nullptr, _SE(js_network_Downloader_setOnError_asSetter));
    __jsb_cc_network_Downloader_proto->defineFunction("createDownloadTask",
                                                      _SE(js_network_Downloader_createDownloadTask));
    __jsb_cc_network_Downloader_proto->defineFunction("createDownloadFileTask",
                                                      _SE(js_network_Downloader_createDownloadFileTask)); // deprecated since v3.6
    __jsb_cc_network_Downloader_proto->defineFunction("setOnTaskError",
                                                      _SE(js_network_Downloader_setOnTaskError)); // deprecated since v3.6
    __jsb_cc_network_Downloader_proto->defineFunction("setOnFileTaskSuccess",
                                                      _SE(js_network_Downloader_setOnFileTaskSuccess)); // deprecated since v3.6
    return true;
}
