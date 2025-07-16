// Define module
// target_namespace means the name exported to JS, could be same as which in other modules
// native2d at the last means the suffix of binding function name, different modules should use unique name
// Note: doesn't support number prefix
%module(target_namespace="render") render

// Disable some swig warnings, find warning number reference here ( https://www.swig.org/Doc4.1/Warnings.html )
#pragma SWIG nowarn=503,302,401,317,402

// Insert code at the beginning of generated header file (.h)
%insert(header_file) %{
#pragma once
#include <type_traits>
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "renderer/pipeline/custom/RenderInterfaceTypes.h"
%}

// Insert code at the beginning of generated source file (.cpp)
%{
#include "bindings/auto/jsb_render_auto.h"
#include "bindings/auto/jsb_scene_auto.h"
#include "bindings/auto/jsb_gfx_auto.h"
#include "bindings/auto/jsb_assets_auto.h"
#include "renderer/pipeline/GeometryRenderer.h"
#include "renderer/pipeline/GlobalDescriptorSetManager.h"
#include "renderer/pipeline/custom/RenderCommonJsb.h"

using namespace cc;
using namespace cc::render;
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
%ignore cc::render::PipelineRuntime::setValue;
%ignore cc::render::PipelineRuntime::isOcclusionQueryEnabled;
%ignore cc::render::PipelineRuntime::resetRenderQueue;
%ignore cc::render::PipelineRuntime::isRenderQueueReset;

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
%module_macro(CC_USE_GEOMETRY_RENDERER) cc::render::PipelineRuntime::geometryRenderer;

// ----- Release Returned Cpp Object in GC Section ------
%release_returned_cpp_object_in_gc(cc::render::BasicRenderPassBuilder::addQueue);
%release_returned_cpp_object_in_gc(cc::render::BasicPipeline::addRenderPass);
%release_returned_cpp_object_in_gc(cc::render::BasicPipeline::addMultisampleRenderPass);
%release_returned_cpp_object_in_gc(cc::render::RenderSubpassBuilder::addQueue);
%release_returned_cpp_object_in_gc(cc::render::ComputeSubpassBuilder::addQueue);
%release_returned_cpp_object_in_gc(cc::render::RenderPassBuilder::addRenderSubpass);
%release_returned_cpp_object_in_gc(cc::render::RenderPassBuilder::addMultisampleRenderSubpass);
%release_returned_cpp_object_in_gc(cc::render::RenderPassBuilder::addComputeSubpass);
%release_returned_cpp_object_in_gc(cc::render::ComputePassBuilder::addQueue);
%release_returned_cpp_object_in_gc(cc::render::RenderQueueBuilder::addScene);
%release_returned_cpp_object_in_gc(cc::render::Pipeline::addRenderPass);
%release_returned_cpp_object_in_gc(cc::render::Pipeline::addComputePass);

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
%attribute(cc::render::PipelineRuntime, cc::gfx::Device*, device, getDevice);
%attribute(cc::render::PipelineRuntime, cc::MacroRecord&, macros, getMacros);
%attribute(cc::render::PipelineRuntime, cc::pipeline::GlobalDSManager*, globalDSManager, getGlobalDSManager);
%attribute(cc::render::PipelineRuntime, cc::gfx::DescriptorSetLayout*, descriptorSetLayout, getDescriptorSetLayout);
%attribute(cc::render::PipelineRuntime, cc::gfx::DescriptorSet*, descriptorSet, getDescriptorSet);
%attribute(cc::render::PipelineRuntime, ccstd::vector<cc::gfx::CommandBuffer*>&, commandBuffers, getCommandBuffers);
%attribute(cc::render::PipelineRuntime, cc::pipeline::PipelineSceneData*, pipelineSceneData, getPipelineSceneData);
%attribute(cc::render::PipelineRuntime, ccstd::string&, constantMacros, getConstantMacros);
%attribute(cc::render::PipelineRuntime, cc::scene::Model*, profiler, getProfiler, setProfiler);
%attribute(cc::render::PipelineRuntime, cc::pipeline::GeometryRenderer*, geometryRenderer, getGeometryRenderer);
%attribute(cc::render::PipelineRuntime, float, shadingScale, getShadingScale, setShadingScale);
%attribute(cc::render::RenderNode, ccstd::string, name, getName, setName);
%attribute(cc::render::BasicRenderPassBuilder, bool, showStatistics, getShowStatistics, setShowStatistics);
%attribute(cc::render::BasicPipeline, cc::render::PipelineType, type, getType);
%attribute(cc::render::BasicPipeline, cc::render::PipelineCapabilities, capabilities, getCapabilities);
%attribute(cc::render::BasicPipeline, bool, enableCpuLightCulling, getEnableCpuLightCulling, setEnableCpuLightCulling);
%attribute(cc::render::RenderSubpassBuilder, bool, showStatistics, getShowStatistics, setShowStatistics);

// ----- Import Section ------
// Brief: Import header files which are depended by 'Include Section'
// Note: 
//   %import "your_header_file.h" will not generate code for that header file
//

// ----- Include Section ------
// Brief: Include header files in which classes and methods will be bound
%include "renderer/pipeline/custom/RenderInterfaceTypes.h"
