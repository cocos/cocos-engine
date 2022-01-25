// clang-format off
#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/editor-support/middleware-adapter.h"
#include "cocos/editor-support/MiddlewareManager.h"
#include "cocos/editor-support/SharedBufferManager.h"

bool register_all_editor_support(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cc::middleware::Texture2D);
JSB_REGISTER_OBJECT_TYPE(cc::middleware::SharedBufferManager);
JSB_REGISTER_OBJECT_TYPE(cc::middleware::MiddlewareManager);


extern se::Object *__jsb_cc_middleware_Texture2D_proto; // NOLINT
extern se::Class * __jsb_cc_middleware_Texture2D_class; // NOLINT

bool js_register_cc_middleware_Texture2D(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_editor_support_Texture2D_getPixelsHigh);
SE_DECLARE_FUNC(js_editor_support_Texture2D_getPixelsWide);
SE_DECLARE_FUNC(js_editor_support_Texture2D_getRealTextureIndex);
SE_DECLARE_FUNC(js_editor_support_Texture2D_setPixelsHigh);
SE_DECLARE_FUNC(js_editor_support_Texture2D_setPixelsWide);
SE_DECLARE_FUNC(js_editor_support_Texture2D_setRealTextureIndex);
SE_DECLARE_FUNC(js_editor_support_Texture2D_setTexParamCallback);
SE_DECLARE_FUNC(js_editor_support_Texture2D_Texture2D);

extern se::Object *__jsb_cc_middleware_SharedBufferManager_proto; // NOLINT
extern se::Class * __jsb_cc_middleware_SharedBufferManager_class; // NOLINT

bool js_register_cc_middleware_SharedBufferManager(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_editor_support_SharedBufferManager_getSharedBuffer);
SE_DECLARE_FUNC(js_editor_support_SharedBufferManager_setResizeCallback);
SE_DECLARE_FUNC(js_editor_support_SharedBufferManager_SharedBufferManager);

extern se::Object *__jsb_cc_middleware_MiddlewareManager_proto; // NOLINT
extern se::Class * __jsb_cc_middleware_MiddlewareManager_class; // NOLINT

bool js_register_cc_middleware_MiddlewareManager(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_getAttachInfoMgr);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_getBufferCount);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_getIBTypedArray);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_getIBTypedArrayLength);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_getRenderInfoMgr);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_getVBTypedArray);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_getVBTypedArrayLength);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_render);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_update);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_destroyInstance);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_generateModuleID);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_getInstance);
SE_DECLARE_FUNC(js_editor_support_MiddlewareManager_MiddlewareManager);
// clang-format on