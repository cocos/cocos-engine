// Define module
// target_namespace means the name exported to JS, could be same as which in other modules
// 'your_module' at the last means the suffix of binding function name, different modules should use unique name
// Note: doesn't support number prefix
%module(target_namespace="jsb") gi

// Disable some swig warnings, find warning number reference here ( https://www.swig.org/Doc4.1/Warnings.html )
#pragma SWIG nowarn=503,302,401,317,402

// Insert code at the beginning of generated header file (.h)
%insert(header_file) %{
#pragma once
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "gi/light-probe/Delaunay.h"
#include "gi/light-probe/LightProbe.h"
%}

// Insert code at the beginning of generated source file (.cpp)
%{
#include "bindings/auto/jsb_geometry_auto.h"
#include "bindings/auto/jsb_cocos_auto.h"
#include "bindings/auto/jsb_scene_auto.h"
#include "bindings/auto/jsb_gi_auto.h"

using namespace cc;
using namespace cc::gi;
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
%ignore cc::gi::Edge;
%ignore cc::gi::Triangle;
%ignore cc::gi::ILightProbeNode;


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

// Write your code bellow


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
%attribute(cc::gi::LightProbesData, ccstd::vector<cc::gi::Vertex>&, probes, getProbes, setProbes);
%attribute(cc::gi::LightProbesData, ccstd::vector<cc::gi::Tetrahedron>&, tetrahedrons, getTetrahedrons, setTetrahedrons);

%attribute(cc::gi::LightProbes, float, giScale, getGIScale, setGIScale);
%attribute(cc::gi::LightProbes, uint32_t, giSamples, getGISamples, setGISamples);
%attribute(cc::gi::LightProbes, uint32_t, bounces, getBounces, setBounces);
%attribute(cc::gi::LightProbes, float, reduceRinging, getReduceRinging, setReduceRinging);
%attribute(cc::gi::LightProbes, bool, showProbe, isShowProbe, setShowProbe);
%attribute(cc::gi::LightProbes, bool, showWireframe, isShowWireframe, setShowWireframe);
%attribute(cc::gi::LightProbes, float, lightProbeSphereVolume, getLightProbeSphereVolume, setLightProbeSphereVolume);
%attribute(cc::gi::LightProbes, bool, showConvex, isShowConvex, setShowConvex);
%attribute(cc::gi::LightProbes, cc::gi::LightProbesData*, data, getData, setData);

%attribute(cc::gi::LightProbeInfo, float, giScale, getGIScale, setGIScale);
%attribute(cc::gi::LightProbeInfo, uint32_t, giSamples, getGISamples, setGISamples);
%attribute(cc::gi::LightProbeInfo, uint32_t, bounces, getBounces, setBounces);
%attribute(cc::gi::LightProbeInfo, float, lightProbeSphereVolume, getLightProbeSphereVolume, setLightProbeSphereVolume);
%attribute(cc::gi::LightProbeInfo, float, reduceRinging, getReduceRinging, setReduceRinging);
%attribute(cc::gi::LightProbeInfo, bool, showProbe, isShowProbe, setShowProbe);
%attribute(cc::gi::LightProbeInfo, bool, showWireframe, isShowWireframe, setShowWireframe);
%attribute(cc::gi::LightProbeInfo, bool, showConvex, isShowConvex, setShowConvex);
%attribute(cc::gi::LightProbeInfo, cc::gi::LightProbesData*, data, getData, setData);

// ----- Import Section ------
// Brief: Import header files which are depended by 'Include Section'
// Note: 
//   %import "your_header_file.h" will not generate code for that header file
//


// ----- Include Section ------
// Brief: Include header files in which classes and methods will be bound
%include "gi/light-probe/Delaunay.h"
%include "gi/light-probe/LightProbe.h"
