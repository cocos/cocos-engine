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
#include "cocos/2d/renderer/UIModelProxy.h"

bool register_all_2d(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cc::UIMeshBuffer);
JSB_REGISTER_OBJECT_TYPE(cc::RenderDrawInfo);
JSB_REGISTER_OBJECT_TYPE(cc::RenderEntity);
JSB_REGISTER_OBJECT_TYPE(cc::Batcher2d);
JSB_REGISTER_OBJECT_TYPE(cc::UIModelProxy);


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

SE_DECLARE_FUNC(js_2d_RenderDrawInfo_changeMeshBuffer);
SE_DECLARE_FUNC(js_2d_RenderDrawInfo_getAttrSharedBufferForJS);
SE_DECLARE_FUNC(js_2d_RenderDrawInfo_getLocalDes);
SE_DECLARE_FUNC(js_2d_RenderDrawInfo_getMeshBuffer);
SE_DECLARE_FUNC(js_2d_RenderDrawInfo_requestIA);
SE_DECLARE_FUNC(js_2d_RenderDrawInfo_resetMeshIA);
SE_DECLARE_FUNC(js_2d_RenderDrawInfo_setRender2dBufferToNative);
SE_DECLARE_FUNC(js_2d_RenderDrawInfo_updateLocalDescriptorSet);
SE_DECLARE_FUNC(js_2d_RenderDrawInfo_uploadBuffers);
SE_DECLARE_FUNC(js_2d_RenderDrawInfo_RenderDrawInfo);

extern se::Object *__jsb_cc_RenderEntity_proto; // NOLINT
extern se::Class * __jsb_cc_RenderEntity_class; // NOLINT

bool js_register_cc_RenderEntity(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_2d_RenderEntity_addDynamicRenderDrawInfo);
SE_DECLARE_FUNC(js_2d_RenderEntity_clearDynamicRenderDrawInfos);
SE_DECLARE_FUNC(js_2d_RenderEntity_clearStaticRenderDrawInfos);
SE_DECLARE_FUNC(js_2d_RenderEntity_getEntitySharedBufferForJS);
SE_DECLARE_FUNC(js_2d_RenderEntity_getIsMask);
SE_DECLARE_FUNC(js_2d_RenderEntity_getIsMaskInverted);
SE_DECLARE_FUNC(js_2d_RenderEntity_getIsSubMask);
SE_DECLARE_FUNC(js_2d_RenderEntity_getLocalOpacity);
SE_DECLARE_FUNC(js_2d_RenderEntity_getOpacity);
SE_DECLARE_FUNC(js_2d_RenderEntity_getRenderDrawInfoAt);
SE_DECLARE_FUNC(js_2d_RenderEntity_getRenderDrawInfosSize);
SE_DECLARE_FUNC(js_2d_RenderEntity_getStaticRenderDrawInfo);
SE_DECLARE_FUNC(js_2d_RenderEntity_getStaticRenderDrawInfos);
SE_DECLARE_FUNC(js_2d_RenderEntity_getUseLocal);
SE_DECLARE_FUNC(js_2d_RenderEntity_removeDynamicRenderDrawInfo);
SE_DECLARE_FUNC(js_2d_RenderEntity_setColorDirty);
SE_DECLARE_FUNC(js_2d_RenderEntity_setDynamicRenderDrawInfo);
SE_DECLARE_FUNC(js_2d_RenderEntity_setOpacity);
SE_DECLARE_FUNC(js_2d_RenderEntity_setUseLocal);
SE_DECLARE_FUNC(js_2d_RenderEntity_RenderEntity);

extern se::Object *__jsb_cc_Batcher2d_proto; // NOLINT
extern se::Class * __jsb_cc_Batcher2d_class; // NOLINT

bool js_register_cc_Batcher2d(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_2d_Batcher2d_getDefaultAttribute);
SE_DECLARE_FUNC(js_2d_Batcher2d_handlePostRender);
SE_DECLARE_FUNC(js_2d_Batcher2d_initialize);
SE_DECLARE_FUNC(js_2d_Batcher2d_releaseDescriptorSetCache);
SE_DECLARE_FUNC(js_2d_Batcher2d_reset);
SE_DECLARE_FUNC(js_2d_Batcher2d_syncMeshBuffersToNative);
SE_DECLARE_FUNC(js_2d_Batcher2d_syncRootNodesToNative);
SE_DECLARE_FUNC(js_2d_Batcher2d_update);
SE_DECLARE_FUNC(js_2d_Batcher2d_uploadBuffers);
SE_DECLARE_FUNC(js_2d_Batcher2d_Batcher2d);

extern se::Object *__jsb_cc_UIModelProxy_proto; // NOLINT
extern se::Class * __jsb_cc_UIModelProxy_class; // NOLINT

bool js_register_cc_UIModelProxy(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_2d_UIModelProxy_activeSubModels);
SE_DECLARE_FUNC(js_2d_UIModelProxy_attachDrawInfo);
SE_DECLARE_FUNC(js_2d_UIModelProxy_attachNode);
SE_DECLARE_FUNC(js_2d_UIModelProxy_clear);
SE_DECLARE_FUNC(js_2d_UIModelProxy_destroy);
SE_DECLARE_FUNC(js_2d_UIModelProxy_getModel);
SE_DECLARE_FUNC(js_2d_UIModelProxy_initModel);
SE_DECLARE_FUNC(js_2d_UIModelProxy_updateModels);
SE_DECLARE_FUNC(js_2d_UIModelProxy_uploadData);
SE_DECLARE_FUNC(js_2d_UIModelProxy_UIModelProxy);
// clang-format on
