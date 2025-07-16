// Define module
// target_namespace means the name exported to JS, could be same as which in other modules
// physics at the last means the suffix of binding function name, different modules should use unique name
// Note: doesn't support number prefix
%module(target_namespace="jsb.physics") physics

// Disable some swig warnings, find warning number reference here ( https://www.swig.org/Doc4.1/Warnings.html )
#pragma SWIG nowarn=503,302,401,317,402

// Insert code at the beginning of generated header file (.h)
%insert(header_file) %{
#pragma once
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "physics/PhysicsSDK.h"
#include "bindings/auto/jsb_scene_auto.h"
%}

// Insert code at the beginning of generated source file (.cpp)
%{
#include "bindings/auto/jsb_physics_auto.h"
#include "bindings/auto/jsb_cocos_auto.h"
#include "bindings/auto/jsb_geometry_auto.h"
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

%rename("$ignore", regextarget=1, fullname=1) "cc::physics::I[A-Za-z0-9]*(?:Body|World|Shape|Joint|CharacterController|Lifecycle)$";

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

// ----- Import Section ------
// Brief: Import header files which are depended by 'Include Section'
// Note: 
//   %import "your_header_file.h" will not generate code for that header file
//
%import "base/Macros.h"
%import "base/RefCounted.h"

%import "core/event/Event.h"
%import "core/scene-graph/Node.h"

%import "core/geometry/Enums.h"
%import "core/geometry/AABB.h"
// %import "core/geometry/Obb.h"
%import "core/geometry/Line.h"
%import "core/geometry/Plane.h"
%import "core/geometry/Frustum.h"
%import "core/geometry/Capsule.h"
%import "core/geometry/Sphere.h"
%import "core/geometry/Triangle.h"
%import "core/geometry/Ray.h"
%import "core/geometry/Spline.h"

// ----- Include Section ------
// Brief: Include header files in which classes and methods will be bound
%import "physics/spec/ILifecycle.h"
%import "physics/spec/IWorld.h"
%import "physics/spec/IBody.h"
%import "physics/spec/IShape.h"
%import "physics/spec/IJoint.h"
%import "physics/spec/ICharacterController.h"

%include "physics/sdk/World.h"
%include "physics/sdk/RigidBody.h"
%include "physics/sdk/Shape.h"
%include "physics/sdk/Joint.h"
%include "physics/sdk/CharacterController.h"
