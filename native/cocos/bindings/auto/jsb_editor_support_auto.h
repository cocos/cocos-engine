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
#include <type_traits>
#include "base/Config.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/editor-support/MiddlewareManager.h"
#include "cocos/editor-support/SharedBufferManager.h"
#include "cocos/editor-support/middleware-adapter.h"

extern se::Object* __jsb_cc_middleware_Texture2D_proto;
extern se::Class*  __jsb_cc_middleware_Texture2D_class;

bool js_register_cc_middleware_Texture2D(se::Object* obj);
bool register_all_editor_support(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::middleware::Texture2D);
SE_DECLARE_FUNC(js_editor_support_Texture2D_getPixelsHigh);
SE_DECLARE_FUNC(js_editor_support_Texture2D_getPixelsWide);
SE_DECLARE_FUNC(js_editor_support_Texture2D_getRealTextureIndex);
SE_DECLARE_FUNC(js_editor_support_Texture2D_setPixelsHigh);
SE_DECLARE_FUNC(js_editor_support_Texture2D_setPixelsWide);
SE_DECLARE_FUNC(js_editor_support_Texture2D_setRealTextureIndex);
SE_DECLARE_FUNC(js_editor_support_Texture2D_setTexParamCallback);
SE_DECLARE_FUNC(js_editor_support_Texture2D_Texture2D);

extern se::Object* __jsb_cc_middleware_SharedBufferManager_proto;
extern se::Class*  __jsb_cc_middleware_SharedBufferManager_class;

bool js_register_cc_middleware_SharedBufferManager(se::Object* obj);
bool register_all_editor_support(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::middleware::SharedBufferManager);
SE_DECLARE_FUNC(js_editor_support_SharedBufferManager_getSharedBuffer);
SE_DECLARE_FUNC(js_editor_support_SharedBufferManager_setResizeCallback);
SE_DECLARE_FUNC(js_editor_support_SharedBufferManager_SharedBufferManager);

extern se::Object* __jsb_cc_middleware_MiddlewareManager_proto;
extern se::Class*  __jsb_cc_middleware_MiddlewareManager_class;

bool js_register_cc_middleware_MiddlewareManager(se::Object* obj);
bool register_all_editor_support(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::middleware::MiddlewareManager);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_getAttachInfoMgr);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_getBufferCount);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_getIBTypedArray);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_getIBTypedArrayLength);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_getRenderInfoMgr);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_getVBTypedArray);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_getVBTypedArrayLength);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_render);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_update);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_getInstance);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_destroyInstance);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_generateModuleID);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_MiddlewareManager);
