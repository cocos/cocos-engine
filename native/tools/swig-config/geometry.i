// Define module
// target_namespace means the name exported to JS, could be same as which in other modules
// geometry at the last means the suffix of binding function name, different modules should use unique name
// Note: doesn't support number prefix
%module(target_namespace="ns") geometry

// Insert code at the beginning of generated header file (.h)
%insert(header_file) %{
#pragma once
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "core/geometry/Geometry.h"
%}

// Insert code at the beginning of generated source file (.cpp)
%{
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
%ignore cc::geometry::AABB::getBoundary;
%ignore cc::geometry::AABB::aabbAabb;
%ignore cc::geometry::AABB::aabbFrustum;
%ignore cc::geometry::AABB::aabbPlan;
%ignore cc::geometry::AABB::merge;
%ignore cc::geometry::AABB::transform;
%ignore cc::geometry::AABB::transformExtentM4;
%ignore cc::geometry::AABB::isValid;
%ignore cc::geometry::AABB::setValid;
%ignore cc::geometry::AABB::set;
%ignore cc::geometry::AABB::fromPoints;
%ignore cc::geometry::AABB::getCenter;
%ignore cc::geometry::AABB::setCenter;
%ignore cc::geometry::AABB::getHalfExtents;
%ignore cc::geometry::AABB::setHalfExtents;

%ignore cc::geometry::Frustum::update;
%ignore cc::geometry::Frustum::type;
%ignore cc::geometry::Frustum::split;

%ignore cc::geometry::Plane::clone;
%ignore cc::geometry::Plane::copy;
%ignore cc::geometry::Plane::normalize;
%ignore cc::geometry::Plane::getSpotAngle;
%ignore cc::geometry::Plane::fromNormalAndPoint;
%ignore cc::geometry::Plane::fromPoints;
%ignore cc::geometry::Plane::set;

%ignore cc::geometry::Ray::computeHit;

%ignore cc::geometry::Sphere::getBoundary;

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

%import "math/MathBase.h"
%import "math/Vec2.h"
%import "math/Vec3.h"
%import "math/Vec4.h"
%import "math/Color.h"
%import "math/Mat3.h"
%import "math/Mat4.h"
%import "math/Quaternion.h"

// ----- Include Section ------
// Brief: Include header files in which classes and methods will be bound

%include "core/geometry/Enums.h"
%include "core/geometry/AABB.h"
// %include "core/geometry/Obb.h"
%include "core/geometry/Line.h"
%include "core/geometry/Plane.h"
%include "core/geometry/Frustum.h"
%include "core/geometry/Capsule.h"
%include "core/geometry/Sphere.h"
%include "core/geometry/Triangle.h"
%include "core/geometry/Ray.h"
%include "core/geometry/Spline.h"
