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
#include "cocos/bindings/auto/jsb_gfx_auto.h"
#include "cocos/bindings/auto/jsb_scene_auto.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/renderer/pipeline/Define.h"
#include "cocos/renderer/pipeline/GeometryRenderer.h"
#include "cocos/renderer/pipeline/GlobalDescriptorSetManager.h"
#include "cocos/renderer/pipeline/InstancedBuffer.h"
#include "cocos/renderer/pipeline/RenderFlow.h"
#include "cocos/renderer/pipeline/RenderPipeline.h"
#include "cocos/renderer/pipeline/RenderStage.h"
#include "cocos/renderer/pipeline/deferred/BloomStage.h"
#include "cocos/renderer/pipeline/deferred/DeferredPipeline.h"
#include "cocos/renderer/pipeline/deferred/GbufferStage.h"
#include "cocos/renderer/pipeline/deferred/LightingStage.h"
#include "cocos/renderer/pipeline/deferred/MainFlow.h"
#include "cocos/renderer/pipeline/deferred/PostProcessStage.h"
#include "cocos/renderer/pipeline/forward/ForwardFlow.h"
#include "cocos/renderer/pipeline/forward/ForwardPipeline.h"
#include "cocos/renderer/pipeline/forward/ForwardStage.h"
#include "cocos/renderer/pipeline/shadow/ShadowFlow.h"
#include "cocos/renderer/pipeline/shadow/ShadowStage.h"

extern se::Object* __jsb_cc_pipeline_RenderQueueDesc_proto;
extern se::Class*  __jsb_cc_pipeline_RenderQueueDesc_class;

bool js_register_cc_pipeline_RenderQueueDesc(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

template <>
bool sevalue_to_native(const se::Value&, cc::pipeline::RenderQueueDesc*, se::Object* ctx);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderQueueDesc);

extern se::Object* __jsb_cc_pipeline_GlobalDSManager_proto;
extern se::Class*  __jsb_cc_pipeline_GlobalDSManager_class;

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
extern se::Class*  __jsb_cc_pipeline_RenderPipelineInfo_class;

bool js_register_cc_pipeline_RenderPipelineInfo(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

template <>
bool sevalue_to_native(const se::Value&, cc::pipeline::RenderPipelineInfo*, se::Object* ctx);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderPipelineInfo);

extern se::Object* __jsb_cc_pipeline_RenderPipeline_proto;
extern se::Class*  __jsb_cc_pipeline_RenderPipeline_class;

bool js_register_cc_pipeline_RenderPipeline(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderPipeline);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_activate);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_createQuadInputAssembler);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_destroy);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_ensureEnoughSize);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_genQuadVertexData);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getClearcolor);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getDevice);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getFrameGraph);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getGeometryRenderer);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getHeight);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getIAByRenderArea);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getOcclusionQueryEnabled);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getProfiler);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getQueryPools);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getRenderstageByName);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getScissor);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getViewport);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getWidth);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_initialize);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_isEnvmapEnabled);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_isOccluded);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_render);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_setGeometryRenderer);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_setOcclusionQueryEnabled);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_setPipelineSharedSceneData);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_setProfiler);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_setValue);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_updateQuadVertexData);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getInstance);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getRenderArea);

extern se::Object* __jsb_cc_pipeline_ForwardPipeline_proto;
extern se::Class*  __jsb_cc_pipeline_ForwardPipeline_class;

bool js_register_cc_pipeline_ForwardPipeline(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::ForwardPipeline);
SE_DECLARE_FUNC(js_pipeline_ForwardPipeline_ForwardPipeline);

extern se::Object* __jsb_cc_pipeline_RenderFlowInfo_proto;
extern se::Class*  __jsb_cc_pipeline_RenderFlowInfo_class;

bool js_register_cc_pipeline_RenderFlowInfo(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

template <>
bool sevalue_to_native(const se::Value&, cc::pipeline::RenderFlowInfo*, se::Object* ctx);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderFlowInfo);

extern se::Object* __jsb_cc_pipeline_RenderFlow_proto;
extern se::Class*  __jsb_cc_pipeline_RenderFlow_class;

bool js_register_cc_pipeline_RenderFlow(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderFlow);
SE_DECLARE_FUNC(js_pipeline_RenderFlow_activate);
SE_DECLARE_FUNC(js_pipeline_RenderFlow_getRenderstageByName);
SE_DECLARE_FUNC(js_pipeline_RenderFlow_getTag);
SE_DECLARE_FUNC(js_pipeline_RenderFlow_initialize);

extern se::Object* __jsb_cc_pipeline_ForwardFlow_proto;
extern se::Class*  __jsb_cc_pipeline_ForwardFlow_class;

bool js_register_cc_pipeline_ForwardFlow(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::ForwardFlow);
SE_DECLARE_FUNC(js_pipeline_ForwardFlow_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_ForwardFlow_ForwardFlow);

extern se::Object* __jsb_cc_pipeline_RenderStageInfo_proto;
extern se::Class*  __jsb_cc_pipeline_RenderStageInfo_class;

bool js_register_cc_pipeline_RenderStageInfo(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

template <>
bool sevalue_to_native(const se::Value&, cc::pipeline::RenderStageInfo*, se::Object* ctx);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderStageInfo);

extern se::Object* __jsb_cc_pipeline_RenderStage_proto;
extern se::Class*  __jsb_cc_pipeline_RenderStage_class;

bool js_register_cc_pipeline_RenderStage(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderStage);
SE_DECLARE_FUNC(js_pipeline_RenderStage_activate);
SE_DECLARE_FUNC(js_pipeline_RenderStage_getFlow);
SE_DECLARE_FUNC(js_pipeline_RenderStage_getTag);
SE_DECLARE_FUNC(js_pipeline_RenderStage_initialize);

extern se::Object* __jsb_cc_pipeline_ForwardStage_proto;
extern se::Class*  __jsb_cc_pipeline_ForwardStage_class;

bool js_register_cc_pipeline_ForwardStage(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::ForwardStage);
SE_DECLARE_FUNC(js_pipeline_ForwardStage_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_ForwardStage_ForwardStage);

extern se::Object* __jsb_cc_pipeline_ShadowFlow_proto;
extern se::Class*  __jsb_cc_pipeline_ShadowFlow_class;

bool js_register_cc_pipeline_ShadowFlow(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::ShadowFlow);
SE_DECLARE_FUNC(js_pipeline_ShadowFlow_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_ShadowFlow_ShadowFlow);

extern se::Object* __jsb_cc_pipeline_ShadowStage_proto;
extern se::Class*  __jsb_cc_pipeline_ShadowStage_class;

bool js_register_cc_pipeline_ShadowStage(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::ShadowStage);
SE_DECLARE_FUNC(js_pipeline_ShadowStage_setFramebuffer);
SE_DECLARE_FUNC(js_pipeline_ShadowStage_setUsage);
SE_DECLARE_FUNC(js_pipeline_ShadowStage_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_ShadowStage_ShadowStage);

extern se::Object* __jsb_cc_pipeline_InstancedBuffer_proto;
extern se::Class*  __jsb_cc_pipeline_InstancedBuffer_class;

bool js_register_cc_pipeline_InstancedBuffer(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::InstancedBuffer);
SE_DECLARE_FUNC(js_pipeline_InstancedBuffer_destroy);
SE_DECLARE_FUNC(js_pipeline_InstancedBuffer_setDynamicOffset);
SE_DECLARE_FUNC(js_pipeline_InstancedBuffer_get);
SE_DECLARE_FUNC(js_pipeline_InstancedBuffer_destroyInstancedBuffer);
SE_DECLARE_FUNC(js_pipeline_InstancedBuffer_InstancedBuffer);

extern se::Object* __jsb_cc_pipeline_DeferredPipeline_proto;
extern se::Class*  __jsb_cc_pipeline_DeferredPipeline_class;

bool js_register_cc_pipeline_DeferredPipeline(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::DeferredPipeline);
SE_DECLARE_FUNC(js_pipeline_DeferredPipeline_DeferredPipeline);

extern se::Object* __jsb_cc_pipeline_MainFlow_proto;
extern se::Class*  __jsb_cc_pipeline_MainFlow_class;

bool js_register_cc_pipeline_MainFlow(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::MainFlow);
SE_DECLARE_FUNC(js_pipeline_MainFlow_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_MainFlow_MainFlow);

extern se::Object* __jsb_cc_pipeline_GbufferStage_proto;
extern se::Class*  __jsb_cc_pipeline_GbufferStage_class;

bool js_register_cc_pipeline_GbufferStage(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::GbufferStage);
SE_DECLARE_FUNC(js_pipeline_GbufferStage_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_GbufferStage_GbufferStage);

extern se::Object* __jsb_cc_pipeline_LightingStage_proto;
extern se::Class*  __jsb_cc_pipeline_LightingStage_class;

bool js_register_cc_pipeline_LightingStage(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::LightingStage);
SE_DECLARE_FUNC(js_pipeline_LightingStage_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_LightingStage_LightingStage);

extern se::Object* __jsb_cc_pipeline_BloomStage_proto;
extern se::Class*  __jsb_cc_pipeline_BloomStage_class;

bool js_register_cc_pipeline_BloomStage(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::BloomStage);
SE_DECLARE_FUNC(js_pipeline_BloomStage_getCombineUBO);
SE_DECLARE_FUNC(js_pipeline_BloomStage_getDownsampelUBO);
SE_DECLARE_FUNC(js_pipeline_BloomStage_getPrefilterUBO);
SE_DECLARE_FUNC(js_pipeline_BloomStage_getSampler);
SE_DECLARE_FUNC(js_pipeline_BloomStage_getUpsampleUBO);
SE_DECLARE_FUNC(js_pipeline_BloomStage_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_BloomStage_BloomStage);

extern se::Object* __jsb_cc_pipeline_PostProcessStage_proto;
extern se::Class*  __jsb_cc_pipeline_PostProcessStage_class;

bool js_register_cc_pipeline_PostProcessStage(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::PostProcessStage);
SE_DECLARE_FUNC(js_pipeline_PostProcessStage_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_PostProcessStage_PostProcessStage);

extern se::Object* __jsb_cc_pipeline_GeometryRenderer_proto;
extern se::Class*  __jsb_cc_pipeline_GeometryRenderer_class;

bool js_register_cc_pipeline_GeometryRenderer(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::GeometryRenderer);
SE_DECLARE_FUNC(js_pipeline_GeometryRenderer_GeometryRenderer);
