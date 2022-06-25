// clang-format off
#pragma once

#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/auto/jsb_scene_auto.h"
#include "cocos/2d/renderer/RenderDrawInfo.h"
#include "cocos/2d/renderer/UIMeshBuffer.h"
#include "cocos/2d/renderer/Batcher2d.h"
#include "cocos/2d/renderer/RenderEntity.h"
#include "cocos/2d/renderer/GraphicsProxy.h"

bool register_all_2d(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cc::UIMeshBuffer);
JSB_REGISTER_OBJECT_TYPE(cc::RenderDrawInfo);
JSB_REGISTER_OBJECT_TYPE(cc::RenderEntity);
JSB_REGISTER_OBJECT_TYPE(cc::Batcher2d);
JSB_REGISTER_OBJECT_TYPE(cc::GraphicsProxy);


extern se::Object *__jsb_cc_UIMeshBuffer_proto; // NOLINT
extern se::Class * __jsb_cc_UIMeshBuffer_class; // NOLINT

bool js_register_cc_UIMeshBuffer(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_2d_UIMeshBuffer_destroy);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_initialize);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_reset);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_syncSharedBufferToNative);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_uploadBuffers);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_UIMeshBuffer);

extern se::Object *__jsb_cc_RenderDrawInfo_proto; // NOLINT
extern se::Class * __jsb_cc_RenderDrawInfo_class; // NOLINT

bool js_register_cc_RenderDrawInfo(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_2d_RenderDrawInfo_getAttrSharedBufferForJS);
SE_DECLARE_FUNC(js_2d_RenderDrawInfo_getDrawType);
SE_DECLARE_FUNC(js_2d_RenderDrawInfo_getEnabled);
SE_DECLARE_FUNC(js_2d_RenderDrawInfo_getMeshBuffer);
SE_DECLARE_FUNC(js_2d_RenderDrawInfo_setRender2dBufferToNative);
SE_DECLARE_FUNC(js_2d_RenderDrawInfo_syncSharedBufferToNative);
SE_DECLARE_FUNC(js_2d_RenderDrawInfo_RenderDrawInfo);

extern se::Object *__jsb_cc_RenderEntity_proto; // NOLINT
extern se::Class * __jsb_cc_RenderEntity_class; // NOLINT

bool js_register_cc_RenderEntity(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_2d_RenderEntity_addDynamicRenderDrawInfo);
SE_DECLARE_FUNC(js_2d_RenderEntity_getStaticRenderDrawInfo);
SE_DECLARE_FUNC(js_2d_RenderEntity_setDynamicRenderDrawInfo);
SE_DECLARE_FUNC(js_2d_RenderEntity_setRenderEntityType);
SE_DECLARE_FUNC(js_2d_RenderEntity_RenderEntity);

extern se::Object *__jsb_cc_Batcher2d_proto; // NOLINT
extern se::Class * __jsb_cc_Batcher2d_class; // NOLINT

bool js_register_cc_Batcher2d(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_2d_Batcher2d_addRootNode);
SE_DECLARE_FUNC(js_2d_Batcher2d_initialize);
SE_DECLARE_FUNC(js_2d_Batcher2d_reset);
SE_DECLARE_FUNC(js_2d_Batcher2d_syncMeshBuffersToNative);
SE_DECLARE_FUNC(js_2d_Batcher2d_update);
SE_DECLARE_FUNC(js_2d_Batcher2d_uploadBuffers);
SE_DECLARE_FUNC(js_2d_Batcher2d_Batcher2d);

extern se::Object *__jsb_cc_GraphicsProxy_proto; // NOLINT
extern se::Class * __jsb_cc_GraphicsProxy_class; // NOLINT

bool js_register_cc_GraphicsProxy(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_2d_GraphicsProxy_activeSubModel);
SE_DECLARE_FUNC(js_2d_GraphicsProxy_clear);
SE_DECLARE_FUNC(js_2d_GraphicsProxy_destroy);
SE_DECLARE_FUNC(js_2d_GraphicsProxy_initModel);
SE_DECLARE_FUNC(js_2d_GraphicsProxy_uploadData);
SE_DECLARE_FUNC(js_2d_GraphicsProxy_GraphicsProxy);
// clang-format on
