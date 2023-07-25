// Define module
// target_namespace means the name exported to JS, could be same as which in other modules
// pipeline at the last means the suffix of binding function name, different modules should use unique name
// Note: doesn't support number prefix
%module(target_namespace="nr") pipeline

// Disable some swig warnings, find warning number reference here ( https://www.swig.org/Doc4.1/Warnings.html )
#pragma SWIG nowarn=503,302,401,317,402

// Insert code at the beginning of generated header file (.h)
%insert(header_file) %{
#pragma once
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "renderer/pipeline/forward/ForwardPipeline.h"
#include "renderer/pipeline/forward/ForwardFlow.h"
#include "renderer/pipeline/forward/ForwardStage.h"
#include "renderer/pipeline/shadow/ShadowFlow.h"
#include "renderer/pipeline/shadow/ShadowStage.h"
#include "renderer/pipeline/shadow/CSMLayers.h"
#include "renderer/pipeline/GlobalDescriptorSetManager.h"
#include "renderer/pipeline/InstancedBuffer.h"
#include "renderer/pipeline/deferred/DeferredPipeline.h"
#include "renderer/pipeline/deferred/MainFlow.h"
#include "renderer/pipeline/deferred/GbufferStage.h"
#include "renderer/pipeline/deferred/LightingStage.h"
#include "renderer/pipeline/deferred/BloomStage.h"
#include "renderer/pipeline/deferred/PostProcessStage.h"
#include "renderer/pipeline/PipelineSceneData.h"
#include "renderer/pipeline/GeometryRenderer.h"
#include "renderer/pipeline/DebugView.h"
#include "renderer/pipeline/reflection-probe/ReflectionProbeFlow.h"
#include "renderer/pipeline/reflection-probe/ReflectionProbeStage.h"
%}

// Insert code at the beginning of generated source file (.cpp)
%{
#include "bindings/auto/jsb_pipeline_auto.h"
#include "bindings/auto/jsb_scene_auto.h"
#include "bindings/auto/jsb_gfx_auto.h"
#include "bindings/auto/jsb_assets_auto.h"
#include "bindings/auto/jsb_cocos_auto.h"
#include "renderer/pipeline/PipelineUBO.h"

using namespace cc;
%}

// ----- Ignore Section ------
// Brief: Classes, methods or attributes need to be ignored
//
// Usage:
//
//  %ignore your_namespace::your_class_name;
//  %ignore your_namespace::your_class_name::your_method_name;
//  %ignore your_namespace::your_class_name::your_attribute_name;
//
// Note: 
//  1. 'Ignore Section' should be placed before attribute definition and %import/%include
//  2. namespace is needed
//
%ignore cc::RefCounted;

%ignore cc::pipeline::convertQueueSortFunc;
%ignore cc::pipeline::RenderPipeline::getFrameGraph;
%ignore cc::pipeline::RenderPipeline::setPipelineRuntime;
%ignore cc::pipeline::RenderPipeline::getPipelineRuntime;
%ignore cc::pipeline::PipelineSceneData::getRenderObjects;
%ignore cc::pipeline::PipelineSceneData::setRenderObjects;
%ignore cc::pipeline::PipelineSceneData::getShadowObjects;
%ignore cc::pipeline::PipelineSceneData::setShadowObjects;
%ignore cc::pipeline::PipelineSceneData::getShadowFramebufferMap;
%ignore cc::pipeline::PipelineSceneData::getCSMLayers;
%ignore cc::pipeline::PipelineSceneData::getCSMSupported;
%ignore cc::pipeline::UBOBloom;

//TODO: Use regex to write the following ignore pattern
%ignore cc::pipeline::RenderPipeline::fgStrHandleOutDepthTexture;
%ignore cc::pipeline::RenderPipeline::fgStrHandleOutColorTexture;
%ignore cc::pipeline::RenderPipeline::fgStrHandlePostprocessPass;
%ignore cc::pipeline::RenderPipeline::fgStrHandleBloomOutTexture;

%ignore cc::pipeline::ForwardPipeline::fgStrHandleForwardColorTexture;
%ignore cc::pipeline::ForwardPipeline::fgStrHandleForwardDepthTexture;
%ignore cc::pipeline::ForwardPipeline::fgStrHandleForwardPass;

%ignore cc::pipeline::DeferredPipeline::fgStrHandleGbufferTexture;
%ignore cc::pipeline::DeferredPipeline::fgStrHandleGbufferPass;
%ignore cc::pipeline::DeferredPipeline::fgStrHandleLightingPass;
%ignore cc::pipeline::DeferredPipeline::fgStrHandleTransparentPass;
%ignore cc::pipeline::DeferredPipeline::fgStrHandleSsprPass;

%ignore cc::pipeline::CSMLayers::update;
%ignore cc::pipeline::CSMLayers::getCastShadowObjects;
%ignore cc::pipeline::CSMLayers::setCastShadowObjects;
%ignore cc::pipeline::CSMLayers::addCastShadowObject;
%ignore cc::pipeline::CSMLayers::clearCastShadowObjects;
%ignore cc::pipeline::CSMLayers::getLayerObjects;
%ignore cc::pipeline::CSMLayers::setLayerObjects;
%ignore cc::pipeline::CSMLayers::addLayerObject;
%ignore cc::pipeline::CSMLayers::clearLayerObjects;
%ignore cc::pipeline::CSMLayers::getLayers;
%ignore cc::pipeline::CSMLayers::getSpecialLayer;

%ignore cc::pipeline::GeometryRendererInfo;
%ignore cc::pipeline::GeometryRenderer::activate;
%ignore cc::pipeline::GeometryRenderer::render;
%ignore cc::pipeline::GeometryRenderer::destroy;

// ----- Rename Section ------
// Brief: Classes, methods or attributes needs to be renamed
//
// Usage:
//
//  %rename(rename_to_name) your_namespace::original_class_name;
//  %rename(rename_to_name) your_namespace::original_class_name::method_name;
//  %rename(rename_to_name) your_namespace::original_class_name::attribute_name;
// 
// Note:
//  1. 'Rename Section' should be placed before attribute definition and %import/%include
//  2. namespace is needed

// ----- Module Macro Section ------
// Brief: Generated code should be wrapped inside a macro
// Usage:
//  1. Configure for class
//    %module_macro(CC_USE_GEOMETRY_RENDERER) cc::pipeline::GeometryRenderer;
//  2. Configure for member function or attribute
//    %module_macro(CC_USE_GEOMETRY_RENDERER) cc::pipeline::RenderPipeline::geometryRenderer;
// Note: Should be placed before 'Attribute Section'
%module_macro(CC_USE_GEOMETRY_RENDERER) cc::pipeline::GeometryRenderer;
%module_macro(CC_USE_GEOMETRY_RENDERER) cc::pipeline::RenderPipeline::geometryRenderer;

// ----- Attribute Section ------
// Brief: Define attributes ( JS properties with getter and setter )
// Usage:
//  1. Define an attribute without setter
//    %attribute(your_namespace::your_class_name, cpp_member_variable_type, js_property_name, cpp_getter_name)
//  2. Define an attribute with getter and setter
//    %attribute(your_namespace::your_class_name, cpp_member_variable_type, js_property_name, cpp_getter_name, cpp_setter_name)
//  3. Define an attribute without getter
//    %attribute_writeonly(your_namespace::your_class_name, cpp_member_variable_type, js_property_name, cpp_setter_name)
//
// Note:
//  1. Don't need to add 'const' prefix for cpp_member_variable_type 
//  2. The return type of getter should keep the same as the type of setter's parameter
//  3. If using reference, add '&' suffix for cpp_member_variable_type to avoid generated code using value assignment
//  4. 'Attribute Section' should be placed before 'Import Section' and 'Include Section'
//
%attribute(cc::pipeline::RenderPipeline, cc::pipeline::GlobalDSManager*, globalDSManager, getGlobalDSManager);
%attribute(cc::pipeline::RenderPipeline, cc::gfx::DescriptorSet*, descriptorSet, getDescriptorSet);
%attribute(cc::pipeline::RenderPipeline, cc::gfx::DescriptorSetLayout*, descriptorSetLayout, getDescriptorSetLayout);
%attribute(cc::pipeline::RenderPipeline, ccstd::string&, constantMacros, getConstantMacros);

%attribute(cc::pipeline::RenderPipeline, bool, clusterEnabled, isClusterEnabled, setClusterEnabled);
%attribute(cc::pipeline::RenderPipeline, bool, bloomEnabled, isBloomEnabled, setBloomEnabled);
%attribute(cc::pipeline::RenderPipeline, cc::pipeline::PipelineSceneData*, pipelineSceneData, getPipelineSceneData);
%attribute(cc::pipeline::RenderPipeline, cc::pipeline::GeometryRenderer*, geometryRenderer, getGeometryRenderer);
%attribute(cc::pipeline::RenderPipeline, cc::scene::Model*, profiler, getProfiler, setProfiler);
%attribute(cc::pipeline::RenderPipeline, float, shadingScale, getShadingScale, setShadingScale);

%attribute(cc::pipeline::RenderPipeline, uint32_t, _tag, getTag, setTag);
%attribute(cc::pipeline::RenderPipeline, cc::pipeline::RenderFlowList , _flows, getFlows, setFlows);


%attribute(cc::pipeline::PipelineSceneData, bool, isHDR, isHDR, setHDR);
%attribute(cc::pipeline::PipelineSceneData, float, shadingScale, getShadingScale, setShadingScale);
%attribute(cc::pipeline::PipelineSceneData, cc::scene::Fog*, fog, getFog);
%attribute(cc::pipeline::PipelineSceneData, cc::scene::Ambient*, ambient, getAmbient);
%attribute(cc::pipeline::PipelineSceneData, cc::scene::Skybox*, skybox, getSkybox);
%attribute(cc::pipeline::PipelineSceneData, cc::scene::Shadows*, shadows, getShadows);
%attribute(cc::pipeline::PipelineSceneData, cc::scene::Skin*, skin, getSkin);
%attribute(cc::pipeline::PipelineSceneData, cc::scene::PostSettings*, postSettings, getPostSettings);
%attribute(cc::pipeline::PipelineSceneData, cc::gi::LightProbes*, lightProbes, getLightProbes);
%attribute(cc::pipeline::PipelineSceneData, ccstd::vector<const cc::scene::Light *>, validPunctualLights, getValidPunctualLights, setValidPunctualLights);
%attribute(cc::pipeline::PipelineSceneData, bool, csmSupported, getCSMSupported);
%attribute(cc::pipeline::PipelineSceneData, cc::scene::Model*, standardSkinModel, getStandardSkinModel, setStandardSkinModel);
%attribute(cc::pipeline::PipelineSceneData, cc::scene::Model*, skinMaterialModel, getSkinMaterialModel, setSkinMaterialModel);

%attribute(cc::pipeline::RenderStage, ccstd::string&, _name, getName, setName);
%attribute(cc::pipeline::RenderStage, uint32_t, _priority, getPriority, setPriority);
%attribute(cc::pipeline::RenderStage, uint32_t, _tag, getTag, setTag);

%attribute(cc::pipeline::BloomStage, float, threshold, getThreshold, setThreshold);
%attribute(cc::pipeline::BloomStage, float, intensity, getIntensity, setIntensity);
%attribute(cc::pipeline::BloomStage, int, iterations, getIterations, setIterations);

%attribute(cc::pipeline::RenderFlow, ccstd::string&, _name, getName, setName);
%attribute(cc::pipeline::RenderFlow, uint32_t, _priority, getPriority, setPriority);
%attribute(cc::pipeline::RenderFlow, uint32_t, _tag, getTag, setTag);
%attribute(cc::pipeline::RenderFlow, cc::pipeline::RenderStageList, _stages, getStages, setStages);

%attribute(cc::pipeline::DebugView, cc::pipeline::DebugViewSingleType, singleMode, getSingleMode, setSingleMode);
%attribute(cc::pipeline::DebugView, bool, lightingWithAlbedo, isLightingWithAlbedo, setLightingWithAlbedo);
%attribute(cc::pipeline::DebugView, bool, csmLayerColoration, isCsmLayerColoration, setCsmLayerColoration);

#define CC_USE_GEOMETRY_RENDERER 1

// ----- Import Section ------
// Brief: Import header files which are depended by 'Include Section'
// Note: 
//   %import "your_header_file.h" will not generate code for that header file
//

%import "base/Macros.h"
%import "base/RefCounted.h"
%import "base/TypeDef.h"
%import "base/memory/Memory.h"
%import "base/Ptr.h"

%import "math/MathBase.h"
%import "math/Vec2.h"
%import "math/Vec3.h"
%import "math/Vec4.h"
%import "math/Color.h"
%import "math/Mat3.h"
%import "math/Mat4.h"
%import "math/Quaternion.h"

%import "core/event/Event.h"

%import "core/assets/Asset.h"
%import "core/assets/Material.h"

%import "renderer/gfx-base/GFXDef-common.h"
%import "renderer/core/PassUtils.h"

// ----- Include Section ------
// Brief: Include header files in which classes and methods will be bound

%include "renderer/pipeline/Define.h"

%include "renderer/pipeline/RenderPipeline.h"
%include "renderer/pipeline/RenderFlow.h"
%include "renderer/pipeline/RenderStage.h"
%include "renderer/pipeline/DebugView.h"

%include "renderer/pipeline/forward/ForwardPipeline.h"
%include "renderer/pipeline/forward/ForwardFlow.h"
%include "renderer/pipeline/forward/ForwardStage.h"

%include "renderer/pipeline/shadow/ShadowFlow.h"
%include "renderer/pipeline/shadow/ShadowStage.h"
%include "renderer/pipeline/shadow/CSMLayers.h"

%include "renderer/pipeline/GlobalDescriptorSetManager.h"
%include "renderer/pipeline/InstancedBuffer.h"
%include "renderer/pipeline/deferred/DeferredPipeline.h"
%include "renderer/pipeline/deferred/MainFlow.h"
%include "renderer/pipeline/deferred/GbufferStage.h"
%include "renderer/pipeline/deferred/LightingStage.h"
%include "renderer/pipeline/deferred/BloomStage.h"
%include "renderer/pipeline/deferred/PostProcessStage.h"
%include "renderer/pipeline/PipelineSceneData.h"
%include "renderer/pipeline/GeometryRenderer.h"

%include "renderer/pipeline/reflection-probe/ReflectionProbeFlow.h"
%include "renderer/pipeline/reflection-probe/ReflectionProbeStage.h"

