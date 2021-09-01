#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/auto/jsb_gfx_auto.h"
#include "cocos/bindings/auto/jsb_scene_auto.h"
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
#include "cocos/renderer/pipeline/deferred/PostprocessStage.h"

extern se::Object* __jsb_cc_pipeline_RenderQueueDesc_proto;
extern se::Class* __jsb_cc_pipeline_RenderQueueDesc_class;

bool js_register_cc_pipeline_RenderQueueDesc(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::pipeline::RenderQueueDesc *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderQueueDesc);

extern se::Object* __jsb_cc_pipeline_GlobalDSManager_proto;
extern se::Class* __jsb_cc_pipeline_GlobalDSManager_class;

bool js_register_cc_pipeline_GlobalDSManager(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::GlobalDSManager);
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
SE_DECLARE_FUNC(js_pipeline_GlobalDSManager_GlobalDSManager);

extern se::Object* __jsb_cc_pipeline_RenderPipelineInfo_proto;
extern se::Class* __jsb_cc_pipeline_RenderPipelineInfo_class;

bool js_register_cc_pipeline_RenderPipelineInfo(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::pipeline::RenderPipelineInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderPipelineInfo);

extern se::Object* __jsb_cc_pipeline_RenderPipeline_proto;
extern se::Class* __jsb_cc_pipeline_RenderPipeline_class;

bool js_register_cc_pipeline_RenderPipeline(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderPipeline);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_activate);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_destroy);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getDevice);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getProfiler);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getRenderstageByName);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_initialize);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_render);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_resize);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_setPipelineSharedSceneData);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_setProfiler);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_setValue);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getInstance);

extern se::Object* __jsb_cc_pipeline_ForwardPipeline_proto;
extern se::Class* __jsb_cc_pipeline_ForwardPipeline_class;

bool js_register_cc_pipeline_ForwardPipeline(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::ForwardPipeline);
SE_DECLARE_FUNC(js_pipeline_ForwardPipeline_ForwardPipeline);

extern se::Object* __jsb_cc_pipeline_RenderFlowInfo_proto;
extern se::Class* __jsb_cc_pipeline_RenderFlowInfo_class;

bool js_register_cc_pipeline_RenderFlowInfo(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::pipeline::RenderFlowInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderFlowInfo);

extern se::Object* __jsb_cc_pipeline_RenderFlow_proto;
extern se::Class* __jsb_cc_pipeline_RenderFlow_class;

bool js_register_cc_pipeline_RenderFlow(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderFlow);
SE_DECLARE_FUNC(js_pipeline_RenderFlow_activate);
SE_DECLARE_FUNC(js_pipeline_RenderFlow_getRenderstageByName);
SE_DECLARE_FUNC(js_pipeline_RenderFlow_getTag);
SE_DECLARE_FUNC(js_pipeline_RenderFlow_initialize);

extern se::Object* __jsb_cc_pipeline_ForwardFlow_proto;
extern se::Class* __jsb_cc_pipeline_ForwardFlow_class;

bool js_register_cc_pipeline_ForwardFlow(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::ForwardFlow);
SE_DECLARE_FUNC(js_pipeline_ForwardFlow_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_ForwardFlow_ForwardFlow);

extern se::Object* __jsb_cc_pipeline_RenderStageInfo_proto;
extern se::Class* __jsb_cc_pipeline_RenderStageInfo_class;

bool js_register_cc_pipeline_RenderStageInfo(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::pipeline::RenderStageInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderStageInfo);

extern se::Object* __jsb_cc_pipeline_RenderStage_proto;
extern se::Class* __jsb_cc_pipeline_RenderStage_class;

bool js_register_cc_pipeline_RenderStage(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderStage);
SE_DECLARE_FUNC(js_pipeline_RenderStage_activate);
SE_DECLARE_FUNC(js_pipeline_RenderStage_getFlow);
SE_DECLARE_FUNC(js_pipeline_RenderStage_getTag);
SE_DECLARE_FUNC(js_pipeline_RenderStage_initialize);

extern se::Object* __jsb_cc_pipeline_ForwardStage_proto;
extern se::Class* __jsb_cc_pipeline_ForwardStage_class;

bool js_register_cc_pipeline_ForwardStage(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::ForwardStage);
SE_DECLARE_FUNC(js_pipeline_ForwardStage_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_ForwardStage_ForwardStage);

extern se::Object* __jsb_cc_pipeline_ShadowFlow_proto;
extern se::Class* __jsb_cc_pipeline_ShadowFlow_class;

bool js_register_cc_pipeline_ShadowFlow(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::ShadowFlow);
SE_DECLARE_FUNC(js_pipeline_ShadowFlow_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_ShadowFlow_ShadowFlow);

extern se::Object* __jsb_cc_pipeline_ShadowStage_proto;
extern se::Class* __jsb_cc_pipeline_ShadowStage_class;

bool js_register_cc_pipeline_ShadowStage(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::ShadowStage);
SE_DECLARE_FUNC(js_pipeline_ShadowStage_setFramebuffer);
SE_DECLARE_FUNC(js_pipeline_ShadowStage_setUseData);
SE_DECLARE_FUNC(js_pipeline_ShadowStage_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_ShadowStage_ShadowStage);

extern se::Object* __jsb_cc_pipeline_InstancedBuffer_proto;
extern se::Class* __jsb_cc_pipeline_InstancedBuffer_class;

bool js_register_cc_pipeline_InstancedBuffer(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::InstancedBuffer);
SE_DECLARE_FUNC(js_pipeline_InstancedBuffer_destroy);
SE_DECLARE_FUNC(js_pipeline_InstancedBuffer_setDynamicOffset);
SE_DECLARE_FUNC(js_pipeline_InstancedBuffer_destroyInstancedBuffer);
SE_DECLARE_FUNC(js_pipeline_InstancedBuffer_get);
SE_DECLARE_FUNC(js_pipeline_InstancedBuffer_InstancedBuffer);

extern se::Object* __jsb_cc_pipeline_DeferredPipeline_proto;
extern se::Class* __jsb_cc_pipeline_DeferredPipeline_class;

bool js_register_cc_pipeline_DeferredPipeline(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::DeferredPipeline);
SE_DECLARE_FUNC(js_pipeline_DeferredPipeline_getClearcolor);
SE_DECLARE_FUNC(js_pipeline_DeferredPipeline_getFrameGraph);
SE_DECLARE_FUNC(js_pipeline_DeferredPipeline_getFrameGraphCamera);
SE_DECLARE_FUNC(js_pipeline_DeferredPipeline_getHeight);
SE_DECLARE_FUNC(js_pipeline_DeferredPipeline_getWidth);
SE_DECLARE_FUNC(js_pipeline_DeferredPipeline_DeferredPipeline);

extern se::Object* __jsb_cc_pipeline_MainFlow_proto;
extern se::Class* __jsb_cc_pipeline_MainFlow_class;

bool js_register_cc_pipeline_MainFlow(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::MainFlow);
SE_DECLARE_FUNC(js_pipeline_MainFlow_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_MainFlow_MainFlow);

extern se::Object* __jsb_cc_pipeline_GbufferStage_proto;
extern se::Class* __jsb_cc_pipeline_GbufferStage_class;

bool js_register_cc_pipeline_GbufferStage(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::GbufferStage);
SE_DECLARE_FUNC(js_pipeline_GbufferStage_dispenseRenderObject2Queues);
SE_DECLARE_FUNC(js_pipeline_GbufferStage_recordCommands);
SE_DECLARE_FUNC(js_pipeline_GbufferStage_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_GbufferStage_GbufferStage);

extern se::Object* __jsb_cc_pipeline_LightingStage_proto;
extern se::Class* __jsb_cc_pipeline_LightingStage_class;

bool js_register_cc_pipeline_LightingStage(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::LightingStage);
SE_DECLARE_FUNC(js_pipeline_LightingStage_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_LightingStage_LightingStage);

extern se::Object* __jsb_cc_pipeline_PostprocessStage_proto;
extern se::Class* __jsb_cc_pipeline_PostprocessStage_class;

bool js_register_cc_pipeline_PostprocessStage(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::PostprocessStage);
SE_DECLARE_FUNC(js_pipeline_PostprocessStage_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_PostprocessStage_PostprocessStage);

