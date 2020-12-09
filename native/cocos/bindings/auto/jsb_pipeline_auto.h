#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/auto/jsb_gfx_auto.h"
#include "cocos/renderer/pipeline/forward/ForwardPipeline.h"
#include "cocos/renderer/pipeline/forward/ForwardFlow.h"
#include "cocos/renderer/pipeline/forward/ForwardStage.h"
#include "cocos/renderer/pipeline/shadow/ShadowFlow.h"
#include "cocos/renderer/pipeline/shadow/ShadowStage.h"
#include "cocos/renderer/pipeline/ui/UIFlow.h"
#include "cocos/renderer/pipeline/ui/UIStage.h"
#include "cocos/renderer/pipeline/RenderPipeline.h"
#include "cocos/renderer/pipeline/RenderFlow.h"
#include "cocos/renderer/pipeline/RenderStage.h"
#include "cocos/renderer/pipeline/Define.h"
#include "cocos/renderer/pipeline/RenderView.h"
#include "cocos/renderer/pipeline/helper/SharedMemory.h"
#include "cocos/renderer/pipeline/InstancedBuffer.h"

extern se::Object* __jsb_cc_pipeline_RenderQueueDesc_proto;
extern se::Class* __jsb_cc_pipeline_RenderQueueDesc_class;

bool js_register_cc_pipeline_RenderQueueDesc(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::pipeline::RenderQueueDesc *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderQueueDesc);

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
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_render);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_setValue);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_initialize);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_destroy);
SE_DECLARE_FUNC(js_pipeline_RenderPipeline_getInstance);

extern se::Object* __jsb_cc_pipeline_Light_proto;
extern se::Class* __jsb_cc_pipeline_Light_class;

bool js_register_cc_pipeline_Light(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::pipeline::Light *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::Light);
SE_DECLARE_FUNC(js_pipeline_Light_getType);
SE_DECLARE_FUNC(js_pipeline_Light_getFrustum);
SE_DECLARE_FUNC(js_pipeline_Light_getAABB);
SE_DECLARE_FUNC(js_pipeline_Light_getNode);

extern se::Object* __jsb_cc_pipeline_PassView_proto;
extern se::Class* __jsb_cc_pipeline_PassView_class;

bool js_register_cc_pipeline_PassView(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::pipeline::PassView *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::PassView);
SE_DECLARE_FUNC(js_pipeline_PassView_getRasterizerState);
SE_DECLARE_FUNC(js_pipeline_PassView_getDynamicState);
SE_DECLARE_FUNC(js_pipeline_PassView_getPrimitive);
SE_DECLARE_FUNC(js_pipeline_PassView_getDepthStencilState);
SE_DECLARE_FUNC(js_pipeline_PassView_getBlendState);
SE_DECLARE_FUNC(js_pipeline_PassView_getPipelineLayout);
SE_DECLARE_FUNC(js_pipeline_PassView_getBatchingScheme);
SE_DECLARE_FUNC(js_pipeline_PassView_getDescriptorSet);

extern se::Object* __jsb_cc_pipeline_RenderWindow_proto;
extern se::Class* __jsb_cc_pipeline_RenderWindow_class;

bool js_register_cc_pipeline_RenderWindow(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::pipeline::RenderWindow *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderWindow);
SE_DECLARE_FUNC(js_pipeline_RenderWindow_getFramebuffer);

extern se::Object* __jsb_cc_pipeline_ForwardPipeline_proto;
extern se::Class* __jsb_cc_pipeline_ForwardPipeline_class;

bool js_register_cc_pipeline_ForwardPipeline(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::ForwardPipeline);
SE_DECLARE_FUNC(js_pipeline_ForwardPipeline_setFog);
SE_DECLARE_FUNC(js_pipeline_ForwardPipeline_getSphere);
SE_DECLARE_FUNC(js_pipeline_ForwardPipeline_setRenderObjects);
SE_DECLARE_FUNC(js_pipeline_ForwardPipeline_setShadows);
SE_DECLARE_FUNC(js_pipeline_ForwardPipeline_setSkybox);
SE_DECLARE_FUNC(js_pipeline_ForwardPipeline_setAmbient);
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
SE_DECLARE_FUNC(js_pipeline_RenderFlow_initialize);
SE_DECLARE_FUNC(js_pipeline_RenderFlow_getTag);

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
SE_DECLARE_FUNC(js_pipeline_RenderStage_initialize);
SE_DECLARE_FUNC(js_pipeline_RenderStage_getTag);

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
SE_DECLARE_FUNC(js_pipeline_ShadowStage_setUseData);
SE_DECLARE_FUNC(js_pipeline_ShadowStage_setFramebuffer);
SE_DECLARE_FUNC(js_pipeline_ShadowStage_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_ShadowStage_ShadowStage);

extern se::Object* __jsb_cc_pipeline_UIFlow_proto;
extern se::Class* __jsb_cc_pipeline_UIFlow_class;

bool js_register_cc_pipeline_UIFlow(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::UIFlow);
SE_DECLARE_FUNC(js_pipeline_UIFlow_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_UIFlow_UIFlow);

extern se::Object* __jsb_cc_pipeline_UIStage_proto;
extern se::Class* __jsb_cc_pipeline_UIStage_class;

bool js_register_cc_pipeline_UIStage(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::UIStage);
SE_DECLARE_FUNC(js_pipeline_UIStage_getInitializeInfo);
SE_DECLARE_FUNC(js_pipeline_UIStage_UIStage);

extern se::Object* __jsb_cc_pipeline_RenderViewInfo_proto;
extern se::Class* __jsb_cc_pipeline_RenderViewInfo_class;

bool js_register_cc_pipeline_RenderViewInfo(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::pipeline::RenderViewInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderViewInfo);

extern se::Object* __jsb_cc_pipeline_RenderView_proto;
extern se::Class* __jsb_cc_pipeline_RenderView_class;

bool js_register_cc_pipeline_RenderView(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::RenderView);
SE_DECLARE_FUNC(js_pipeline_RenderView_setEnable);
SE_DECLARE_FUNC(js_pipeline_RenderView_setExecuteFlows);
SE_DECLARE_FUNC(js_pipeline_RenderView_onGlobalPipelineStateChanged);
SE_DECLARE_FUNC(js_pipeline_RenderView_getVisibility);
SE_DECLARE_FUNC(js_pipeline_RenderView_setVisibility);
SE_DECLARE_FUNC(js_pipeline_RenderView_getWindow);
SE_DECLARE_FUNC(js_pipeline_RenderView_initialize);
SE_DECLARE_FUNC(js_pipeline_RenderView_destroy);
SE_DECLARE_FUNC(js_pipeline_RenderView_getFlows);
SE_DECLARE_FUNC(js_pipeline_RenderView_setWindow);
SE_DECLARE_FUNC(js_pipeline_RenderView_RenderView);

extern se::Object* __jsb_cc_pipeline_InstancedBuffer_proto;
extern se::Class* __jsb_cc_pipeline_InstancedBuffer_class;

bool js_register_cc_pipeline_InstancedBuffer(se::Object* obj);
bool register_all_pipeline(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::pipeline::InstancedBuffer);
SE_DECLARE_FUNC(js_pipeline_InstancedBuffer_destroy);
SE_DECLARE_FUNC(js_pipeline_InstancedBuffer_setDynamicOffset);
SE_DECLARE_FUNC(js_pipeline_InstancedBuffer_get);
SE_DECLARE_FUNC(js_pipeline_InstancedBuffer_InstancedBuffer);

