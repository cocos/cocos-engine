/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
#include <ace/xcomponent/native_interface_xcomponent.h>
#include "bindings/jswrapper/SeApi.h"
#include "platform/openharmony/OpenHarmonyPlatform.h"

/*
 * function for module exports
 */
static napi_value Init(napi_env env, napi_value exports) {
    napi_property_descriptor desc[] = {
        DECLARE_NAPI_FUNCTION("getContext", cc::OpenHarmonyPlatform::GetContext),
    };
    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc));

    cc::OpenHarmonyPlatform* platform = dynamic_cast<cc::OpenHarmonyPlatform*>(cc::BasePlatform::getPlatform());
    CCASSERT(platform != nullptr, "Only supports openharmony platform");
    bool ret = platform->Export(env, exports);
    if (!ret) {
        LOGE("Init failed");
    }
    return exports;
}

/*
 * Napi Module define
 */
static napi_module cocos2dModule = {
    .nm_version       = 1,
    .nm_flags         = 0,
    .nm_filename      = nullptr,
    .nm_register_func = Init, // called by ACE XComponent
    .nm_modname       = "cocos2d",
    .nm_priv          = ((void*)0),
    .reserved         = {0},
};
/*
 * Module register function
 */
extern "C" __attribute__((constructor)) void RegisterModule(void) {
    napi_module_register(&cocos2dModule);
}
