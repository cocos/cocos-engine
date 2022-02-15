// clang-format off
#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/auto/jsb_gfx_auto.h"
#include "cocos/bindings/auto/jsb_scene_auto.h"
#include "cocos/bindings/auto/jsb_assets_auto.h"
#include "cocos/renderer/pipeline/forward/ForwardPipeline.h"
#include "cocos/renderer/pipeline/forward/ForwardFlow.h"
#include "cocos/renderer/pipeline/forward/ForwardStage.h"
#include "cocos/renderer/pipeline/shadow/ShadowFlow.h"
#include "cocos/renderer/pipeline/shadow/ShadowStage.h"
#include "cocos/renderer/pipeline/RenderPipeline.h"
#include "cocos/renderer/pipeline/RenderFlow.h"
#include "cocos/renderer/pipeline/RenderStage.h"
#include "cocos/renderer/pipeline/Define.h"
#include "cocos/renderer/pipeline/GlobalDescriptorSetManager.h"
#include "cocos/renderer/pipeline/InstancedBuffer.h"
#include "cocos/renderer/pipeline/deferred/DeferredPipeline.h"
#include "cocos/renderer/pipeline/deferred/MainFlow.h"
#include "cocos/renderer/pipeline/deferred/GbufferStage.h"
#include "cocos/renderer/pipeline/deferred/LightingStage.h"
#include "cocos/renderer/pipeline/deferred/BloomStage.h"
#include "cocos/renderer/pipeline/deferred/PostProcessStage.h"
#include "cocos/renderer/pipeline/PipelineSceneData.h"
#include "cocos/renderer/pipeline/BatchedBuffer.h"
#include "cocos/renderer/pipeline/GeometryRenderer.h"

bool register_all_pipeline(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderObject);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderQueueDesc);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderPipelineInfo);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderPipeline);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::ForwardPipeline);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderFlowInfo);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderFlow);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::ForwardFlow);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderStageInfo);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderStage);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::ForwardStage);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::ShadowFlow);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::ShadowStage);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::GlobalDSManager);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::InstancedBuffer);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::DeferredPipeline);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::MainFlow);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::GbufferStage);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::LightingStage);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::BloomStage);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::PostProcessStage);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::PipelineSceneData);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::BatchedItem);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::BatchedBuffer);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::GeometryRenderer);


extern se::Object *__jsb_cc_pipeline_RenderObject_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_RenderObject_class; // NOLINT

bool js_register_cc_pipeline_RenderObject(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::pipeline::RenderObject *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_pipeline_RenderQueueDesc_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_RenderQueueDesc_class; // NOLINT

bool js_register_cc_pipeline_RenderQueueDesc(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::pipeline::RenderQueueDesc *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_pipeline_RenderPipelineInfo_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_RenderPipelineInfo_class; // NOLINT

bool js_register_cc_pipeline_RenderPipelineInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::pipeline::RenderPipelineInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_pipeline_RenderPipeline_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_RenderPipeline_class; // NOLINT

bool js_register_cc_pipeline_RenderPipeline(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_pipeline_RenderPipeline_activate);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_createQuadInputAssembler);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_ensureEnoughSize);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_genQuadVertexData);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getClearcolor);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getDevice);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getGeometryRenderer);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getHeight);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getIAByRenderArea);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getQueryPools);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getRenderstageByName);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getScissor);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getViewport);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getWidth);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_initialize);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_isBloomEnabled);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_isClusterEnabled);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_isEnvmapEnabled);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_isOccluded);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_isOcclusionQueryEnabled);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_render);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_setGeometryRenderer);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_setOcclusionQueryEnabled);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_setValue);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_updateQuadVertexData);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getInstance);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getRenderArea);

extern se::Object *__jsb_cc_pipeline_ForwardPipeline_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_ForwardPipeline_class; // NOLINT

bool js_register_cc_pipeline_ForwardPipeline(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_pipeline_ForwardPipeline_ForwardPipeline);

extern se::Object *__jsb_cc_pipeline_RenderFlowInfo_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_RenderFlowInfo_class; // NOLINT

bool js_register_cc_pipeline_RenderFlowInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::pipeline::RenderFlowInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_pipeline_RenderFlow_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_RenderFlow_class; // NOLINT

bool js_register_cc_pipeline_RenderFlow(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_pipeline_RenderFlow_activate);
SE_DECLARE_FUNC(js_pipeline_RenderFlow_getRenderstageByName);
SE_DECLARE_FUNC(js_pipeline_RenderFlow_getTag);
SE_DECLARE_FUNC(js_pipeline_RenderFlow_initialize);

extern se::Object *__jsb_cc_pipeline_ForwardFlow_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_ForwardFlow_class; // NOLINT

bool js_register_cc_pipeline_ForwardFlow(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_pipeline_ForwardFlow_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_ForwardFlow_ForwardFlow);

extern se::Object *__jsb_cc_pipeline_RenderStageInfo_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_RenderStageInfo_class; // NOLINT

bool js_register_cc_pipeline_RenderStageInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::pipeline::RenderStageInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_pipeline_RenderStage_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_RenderStage_class; // NOLINT

bool js_register_cc_pipeline_RenderStage(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_pipeline_RenderStage_activate);
SE_DECLARE_FUNC(js_pipeline_RenderStage_getFlow);
SE_DECLARE_FUNC(js_pipeline_RenderStage_getTag);
SE_DECLARE_FUNC(js_pipeline_RenderStage_initialize);

extern se::Object *__jsb_cc_pipeline_ForwardStage_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_ForwardStage_class; // NOLINT

bool js_register_cc_pipeline_ForwardStage(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_pipeline_ForwardStage_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_ForwardStage_ForwardStage);

extern se::Object *__jsb_cc_pipeline_ShadowFlow_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_ShadowFlow_class; // NOLINT

bool js_register_cc_pipeline_ShadowFlow(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_pipeline_ShadowFlow_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_ShadowFlow_ShadowFlow);

extern se::Object *__jsb_cc_pipeline_ShadowStage_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_ShadowStage_class; // NOLINT

bool js_register_cc_pipeline_ShadowStage(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_pipeline_ShadowStage_setFramebuffer);
SE_DECLARE_FUNC(js_pipeline_ShadowStage_setUsage);
SE_DECLARE_FUNC(js_pipeline_ShadowStage_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_ShadowStage_ShadowStage);

extern se::Object *__jsb_cc_pipeline_GlobalDSManager_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_GlobalDSManager_class; // NOLINT

bool js_register_cc_pipeline_GlobalDSManager(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_pipeline_GlobalDSManager_bindBuffer);
SE_DECLARE_FUNC(js_pipeline_GlobalDSManager_bindSampler);
SE_DECLARE_FUNC(js_pipeline_GlobalDSManager_bindTexture);
SE_DECLARE_FUNC(js_pipeline_GlobalDSManager_getDescriptorSetLayout);
SE_DECLARE_FUNC(js_pipeline_GlobalDSManager_getDescriptorSetMap);
SE_DECLARE_FUNC(js_pipeline_GlobalDSManager_getGlobalDescriptorSet);
SE_DECLARE_FUNC(js_pipeline_GlobalDSManager_getLinearSampler);
SE_DECLARE_FUNC(js_pipeline_GlobalDSManager_getOrCreateDescriptorSet);
SE_DECLARE_FUNC(js_pipeline_GlobalDSManager_getPointSampler);
SE_DECLARE_FUNC(js_pipeline_GlobalDSManager_update);
SE_DECLARE_FUNC(js_pipeline_GlobalDSManager_setDescriptorSetLayout);
SE_DECLARE_FUNC(js_pipeline_GlobalDSManager_GlobalDSManager);

extern se::Object *__jsb_cc_pipeline_InstancedBuffer_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_InstancedBuffer_class; // NOLINT

bool js_register_cc_pipeline_InstancedBuffer(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_pipeline_InstancedBuffer_destroy);
SE_DECLARE_FUNC(js_pipeline_InstancedBuffer_setDynamicOffset);
SE_DECLARE_FUNC(js_pipeline_InstancedBuffer_destroyInstancedBuffer);
SE_DECLARE_FUNC(js_pipeline_InstancedBuffer_get);
SE_DECLARE_FUNC(js_pipeline_InstancedBuffer_InstancedBuffer);

extern se::Object *__jsb_cc_pipeline_DeferredPipeline_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_DeferredPipeline_class; // NOLINT

bool js_register_cc_pipeline_DeferredPipeline(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_pipeline_DeferredPipeline_DeferredPipeline);

extern se::Object *__jsb_cc_pipeline_MainFlow_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_MainFlow_class; // NOLINT

bool js_register_cc_pipeline_MainFlow(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_pipeline_MainFlow_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_MainFlow_MainFlow);

extern se::Object *__jsb_cc_pipeline_GbufferStage_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_GbufferStage_class; // NOLINT

bool js_register_cc_pipeline_GbufferStage(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_pipeline_GbufferStage_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_GbufferStage_GbufferStage);

extern se::Object *__jsb_cc_pipeline_LightingStage_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_LightingStage_class; // NOLINT

bool js_register_cc_pipeline_LightingStage(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_pipeline_LightingStage_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_LightingStage_LightingStage);

extern se::Object *__jsb_cc_pipeline_BloomStage_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_BloomStage_class; // NOLINT

bool js_register_cc_pipeline_BloomStage(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_pipeline_BloomStage_getCombineUBO);
SE_DECLARE_FUNC(js_pipeline_BloomStage_getDownsampleUBO);
SE_DECLARE_FUNC(js_pipeline_BloomStage_getPrefilterUBO);
SE_DECLARE_FUNC(js_pipeline_BloomStage_getSampler);
SE_DECLARE_FUNC(js_pipeline_BloomStage_getUpsampleUBO);
SE_DECLARE_FUNC(js_pipeline_BloomStage_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_BloomStage_BloomStage);

extern se::Object *__jsb_cc_pipeline_PostProcessStage_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_PostProcessStage_class; // NOLINT

bool js_register_cc_pipeline_PostProcessStage(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_pipeline_PostProcessStage_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_PostProcessStage_PostProcessStage);

extern se::Object *__jsb_cc_pipeline_PipelineSceneData_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_PipelineSceneData_class; // NOLINT

bool js_register_cc_pipeline_PipelineSceneData(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_activate);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_addRenderObject);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_addValidPunctualLight);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_clearRenderObjects);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_clearValidPunctualLights);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_destroy);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_getDirShadowObjects);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_getGeometryRendererMaterials);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_getGeometryRendererPasses);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_getGeometryRendererShaders);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_getMatShadowProj);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_getMatShadowView);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_getMatShadowViewProj);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_getOcclusionQueryInputAssembler);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_getOcclusionQueryPass);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_getOcclusionQueryShader);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_getOctree);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_getShadowCameraFar);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_getValidPunctualLights);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_isCastShadowObjects);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_onGlobalPipelineStateChanged);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_setCastShadowObjects);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_setDirShadowObjects);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_setMatShadowProj);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_setMatShadowView);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_setMatShadowViewProj);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_setShadowCameraFar);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_setShadowFramebuffer);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_setValidPunctualLights);
SE_DECLARE_FUNC(js_pipeline_PipelineSceneData_PipelineSceneData);

extern se::Object *__jsb_cc_pipeline_BatchedItem_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_BatchedItem_class; // NOLINT

bool js_register_cc_pipeline_BatchedItem(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::pipeline::BatchedItem *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_pipeline_BatchedBuffer_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_BatchedBuffer_class; // NOLINT

bool js_register_cc_pipeline_BatchedBuffer(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_pipeline_BatchedBuffer_clear);
SE_DECLARE_FUNC(js_pipeline_BatchedBuffer_destroy);
SE_DECLARE_FUNC(js_pipeline_BatchedBuffer_getBatches);
SE_DECLARE_FUNC(js_pipeline_BatchedBuffer_getDynamicOffset);
SE_DECLARE_FUNC(js_pipeline_BatchedBuffer_getPass);
SE_DECLARE_FUNC(js_pipeline_BatchedBuffer_merge);
SE_DECLARE_FUNC(js_pipeline_BatchedBuffer_setDynamicOffset);
SE_DECLARE_FUNC(js_pipeline_BatchedBuffer_destroyBatchedBuffer);
SE_DECLARE_FUNC(js_pipeline_BatchedBuffer_get);
SE_DECLARE_FUNC(js_pipeline_BatchedBuffer_BatchedBuffer);

extern se::Object *__jsb_cc_pipeline_GeometryRenderer_proto; // NOLINT
extern se::Class * __jsb_cc_pipeline_GeometryRenderer_class; // NOLINT

bool js_register_cc_pipeline_GeometryRenderer(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_pipeline_GeometryRenderer_GeometryRenderer);
    // clang-format on