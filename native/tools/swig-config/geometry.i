// Define module
// target_namespace means the name exported to JS, could be same as which in other modules
// geometry at the last means the suffix of binding function name, different modules should use unique name
// Note: doesn't support number prefix
%module(target_namespace="ns") geometry

// Disable some swig warnings, find warning number reference here ( https://www.swig.org/Doc4.1/Warnings.html )
#pragma SWIG nowarn=503,302,401,317,402

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
#include "bindings/auto/jsb_cocos_auto.h"
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

namespace cc::geometry {
%ignore Line::create;
%ignore Line::length;
%ignore Line::clone;
%ignore Line::copy;
%ignore Line::fromPoints;
%ignore Line::set;
%ignore Line::len;
// %ignore Line::s;
// %ignore Line::e;

%ignore Plane::setX;
%ignore Plane::getX; 
%ignore Plane::setY; 
%ignore Plane::getY; 
%ignore Plane::setZ; 
%ignore Plane::getZ; 
%ignore Plane::setW; 
%ignore Plane::getW; 
%ignore Plane::transform; 
%ignore Plane::define; 
%ignore Plane::distance; 
%ignore Plane::clone; 
%ignore Plane::create; 
%ignore Plane::copy; 
%ignore Plane::fromPoints; 
%ignore Plane::set; 
%ignore Plane::fromNormalAndPoint; 
%ignore Plane::normalize; 
// %ignore Plane::n; 
// %ignore Plane::d; 

%ignore Ray::create; 
%ignore Ray::clone; 
%ignore Ray::copy; 
%ignore Ray::fromPoints; 
%ignore Ray::set; 
%ignore Ray::computeHit;
// %ignore Ray::o; 
// %ignore Ray::d; 

%ignore Triangle::create; 
%ignore Triangle::clone; 
%ignore Triangle::copy; 
%ignore Triangle::fromPoints; 
%ignore Triangle::set; 
// %ignore Triangle::a; 
// %ignore Triangle::b; 
// %ignore Triangle::c; 

%ignore Sphere::getRadius; 
%ignore Sphere::getCenter; 
%ignore Sphere::setCenter; 
%ignore Sphere::setRadius; 
%ignore Sphere::clone; 
%ignore Sphere::copy; 
%ignore Sphere::define; 
%ignore Sphere::mergeAABB; 
%ignore Sphere::mergePoint; 
%ignore Sphere::mergeFrustum; 
%ignore Sphere::merge; 
%ignore Sphere::interset; 
%ignore Sphere::spherePlane; 
%ignore Sphere::sphereFrustum; 
%ignore Sphere::transform; 
%ignore Sphere::translateAndRotate; 
%ignore Sphere::setScale; 
%ignore Sphere::create; 
%ignore Sphere::fromPoints; 
%ignore Sphere::set; 
%ignore Sphere::getBoundary;
// %ignore Sphere::_center; 
// %ignore Sphere::_radius; 
    
%ignore AABB::aabbPlane; 
%ignore AABB::contain; 
%ignore AABB::create; 
%ignore AABB::toBoundingSphere; 
%ignore AABB::getBoundary;
%ignore AABB::aabbAabb;
%ignore AABB::aabbFrustum;
%ignore AABB::aabbPlan;
%ignore AABB::merge;
%ignore AABB::transform;
%ignore AABB::transformExtentM4;
%ignore AABB::isValid;
%ignore AABB::setValid;
%ignore AABB::set;
%ignore AABB::fromPoints;
%ignore AABB::getCenter;
%ignore AABB::setCenter;
%ignore AABB::getHalfExtents;
%ignore AABB::setHalfExtents;
// %ignore AABB::center;
// %ignore AABB::halfExtents;

// %ignore Capsule::radius; 
// %ignore Capsule::halfHeight; 
// %ignore Capsule::axis; 
// %ignore Capsule::center; 
// %ignore Capsule::rotation; 
// %ignore Capsule::ellipseCenter0; 
// %ignore Capsule::ellipseCenter1; 
%ignore Capsule::transform; 

%ignore Frustum::update;
%ignore Frustum::transform; 
%ignore Frustum::createOrtho; 
%ignore Frustum::split; 
%ignore Frustum::updatePlanes; 
%ignore Frustum::setAccurate; 
%ignore Frustum::createFromAABB; 
%ignore Frustum::create; 
%ignore Frustum::clone; 
%ignore Frustum::copy; 
// %ignore Frustum::vertices; 
// %ignore Frustum::planes; 

}
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


%attribute(cc::geometry::ShapeBase, cc::geometry::ShapeEnum, _type, getType, setType);

// ----- Import Section ------
// Brief: Import header files which are depended by 'Include Section'
// Note: 
//   %import "your_header_file.h" will not generate code for that header file
//
%import "base/Macros.h"
%import "base/RefCounted.h"

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
