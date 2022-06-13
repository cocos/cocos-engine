// clang-format off
#pragma once

#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/auto/jsb_scene_auto.h"
#include "cocos/2d/renderer/RenderEntity.h"
#include "cocos/2d/renderer/UIMeshBuffer.h"
#include "cocos/2d/renderer/Batcher2d.h"

bool register_all_2d(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cc::RenderEntity);
JSB_REGISTER_OBJECT_TYPE(cc::UIMeshBuffer);
JSB_REGISTER_OBJECT_TYPE(cc::Batcher2d);


extern se::Object *__jsb_cc_RenderEntity_proto; // NOLINT
extern se::Class * __jsb_cc_RenderEntity_class; // NOLINT

bool js_register_cc_RenderEntity(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_2d_RenderEntity_ItIsDebugFuncInRenderEntity);
SE_DECLARE_FUNC(js_2d_RenderEntity_getCurrIndex);
SE_DECLARE_FUNC(js_2d_RenderEntity_getNextIndex);
SE_DECLARE_FUNC(js_2d_RenderEntity_getRender2dLayout);
SE_DECLARE_FUNC(js_2d_RenderEntity_setCurrIndex);
SE_DECLARE_FUNC(js_2d_RenderEntity_setNextIndex);
SE_DECLARE_FUNC(js_2d_RenderEntity_setRender2dBufferToNative);
SE_DECLARE_FUNC(js_2d_RenderEntity_syncSharedBufferToNative);
SE_DECLARE_FUNC(js_2d_RenderEntity_RenderEntity);

extern se::Object *__jsb_cc_UIMeshBuffer_proto; // NOLINT
extern se::Class * __jsb_cc_UIMeshBuffer_class; // NOLINT

bool js_register_cc_UIMeshBuffer(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_2d_UIMeshBuffer_destroy);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_getByteOffset);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_getDirty);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_getFloatsPerVertex);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_getIndexOffset);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_getVertexOffset);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_initialize);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_parseLayout);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_reset);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_setByteOffset);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_setDirty);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_setFloatsPerVertex);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_setIndexOffset);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_setVertexOffset);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_syncSharedBufferToNative);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_uploadBuffers);
SE_DECLARE_FUNC(js_2d_UIMeshBuffer_UIMeshBuffer);

extern se::Object *__jsb_cc_Batcher2d_proto; // NOLINT
extern se::Class * __jsb_cc_Batcher2d_class; // NOLINT

bool js_register_cc_Batcher2d(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_2d_Batcher2d_ItIsDebugFuncInBatcher2d);
SE_DECLARE_FUNC(js_2d_Batcher2d_addNewRenderEntity);
SE_DECLARE_FUNC(js_2d_Batcher2d_fillBuffersAndMergeBatches);
SE_DECLARE_FUNC(js_2d_Batcher2d_generateBatch);
SE_DECLARE_FUNC(js_2d_Batcher2d_getDevice);
SE_DECLARE_FUNC(js_2d_Batcher2d_getMeshBuffer);
SE_DECLARE_FUNC(js_2d_Batcher2d_initialize);
SE_DECLARE_FUNC(js_2d_Batcher2d_reset);
SE_DECLARE_FUNC(js_2d_Batcher2d_resetRenderStates);
SE_DECLARE_FUNC(js_2d_Batcher2d_syncMeshBuffersToNative);
SE_DECLARE_FUNC(js_2d_Batcher2d_syncRenderEntitiesToNative);
SE_DECLARE_FUNC(js_2d_Batcher2d_update);
SE_DECLARE_FUNC(js_2d_Batcher2d_updateDescriptorSet);
SE_DECLARE_FUNC(js_2d_Batcher2d_uploadBuffers);
SE_DECLARE_FUNC(js_2d_Batcher2d_Batcher2d);
// clang-format on
