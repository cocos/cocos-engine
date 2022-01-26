// clang-format off
#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/auto/jsb_cocos_auto.h"
#include "cocos/core/geometry/Geometry.h"

bool register_all_geometry(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cc::geometry::ShapeBase);
JSB_REGISTER_OBJECT_TYPE(cc::geometry::AABB);
JSB_REGISTER_OBJECT_TYPE(cc::geometry::Capsule);
JSB_REGISTER_OBJECT_TYPE(cc::geometry::Plane);
JSB_REGISTER_OBJECT_TYPE(cc::geometry::Frustum);
JSB_REGISTER_OBJECT_TYPE(cc::geometry::Line);
JSB_REGISTER_OBJECT_TYPE(cc::geometry::Ray);
JSB_REGISTER_OBJECT_TYPE(cc::geometry::Sphere);
JSB_REGISTER_OBJECT_TYPE(cc::geometry::Triangle);


extern se::Object *__jsb_cc_geometry_ShapeBase_proto; // NOLINT
extern se::Class * __jsb_cc_geometry_ShapeBase_class; // NOLINT

bool js_register_cc_geometry_ShapeBase(se::Object *obj); // NOLINT


extern se::Object *__jsb_cc_geometry_AABB_proto; // NOLINT
extern se::Class * __jsb_cc_geometry_AABB_class; // NOLINT

bool js_register_cc_geometry_AABB(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_geometry_AABB_contain);
SE_DECLARE_FUNC(js_geometry_AABB_create);
SE_DECLARE_FUNC(js_geometry_AABB_toBoundingSphere);
SE_DECLARE_FUNC(js_geometry_AABB_AABB);

extern se::Object *__jsb_cc_geometry_Capsule_proto; // NOLINT
extern se::Class * __jsb_cc_geometry_Capsule_class; // NOLINT

bool js_register_cc_geometry_Capsule(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_geometry_Capsule_transform);
SE_DECLARE_FUNC(js_geometry_Capsule_Capsule);

extern se::Object *__jsb_cc_geometry_Plane_proto; // NOLINT
extern se::Class * __jsb_cc_geometry_Plane_class; // NOLINT

bool js_register_cc_geometry_Plane(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_geometry_Plane_define);
SE_DECLARE_FUNC(js_geometry_Plane_distance);
SE_DECLARE_FUNC(js_geometry_Plane_getW);
SE_DECLARE_FUNC(js_geometry_Plane_getX);
SE_DECLARE_FUNC(js_geometry_Plane_getY);
SE_DECLARE_FUNC(js_geometry_Plane_getZ);
SE_DECLARE_FUNC(js_geometry_Plane_transform);
SE_DECLARE_FUNC(js_geometry_Plane_create);
SE_DECLARE_FUNC(js_geometry_Plane_Plane);

extern se::Object *__jsb_cc_geometry_Frustum_proto; // NOLINT
extern se::Class * __jsb_cc_geometry_Frustum_class; // NOLINT

bool js_register_cc_geometry_Frustum(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_geometry_Frustum_clone);
SE_DECLARE_FUNC(js_geometry_Frustum_createOrtho);
SE_DECLARE_FUNC(js_geometry_Frustum_setAccurate);
SE_DECLARE_FUNC(js_geometry_Frustum_transform);
SE_DECLARE_FUNC(js_geometry_Frustum_clone);
SE_DECLARE_FUNC(js_geometry_Frustum_copy);
SE_DECLARE_FUNC(js_geometry_Frustum_create);
SE_DECLARE_FUNC(js_geometry_Frustum_createFromAABB);
SE_DECLARE_FUNC(js_geometry_Frustum_createOrtho);
SE_DECLARE_FUNC(js_geometry_Frustum_Frustum);

extern se::Object *__jsb_cc_geometry_Line_proto; // NOLINT
extern se::Class * __jsb_cc_geometry_Line_class; // NOLINT

bool js_register_cc_geometry_Line(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_geometry_Line_length);
SE_DECLARE_FUNC(js_geometry_Line_clone);
SE_DECLARE_FUNC(js_geometry_Line_copy);
SE_DECLARE_FUNC(js_geometry_Line_create);
SE_DECLARE_FUNC(js_geometry_Line_fromPoints);
SE_DECLARE_FUNC(js_geometry_Line_len);
SE_DECLARE_FUNC(js_geometry_Line_set);
SE_DECLARE_FUNC(js_geometry_Line_Line);

extern se::Object *__jsb_cc_geometry_Ray_proto; // NOLINT
extern se::Class * __jsb_cc_geometry_Ray_class; // NOLINT

bool js_register_cc_geometry_Ray(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_geometry_Ray_clone);
SE_DECLARE_FUNC(js_geometry_Ray_copy);
SE_DECLARE_FUNC(js_geometry_Ray_create);
SE_DECLARE_FUNC(js_geometry_Ray_fromPoints);
SE_DECLARE_FUNC(js_geometry_Ray_set);
SE_DECLARE_FUNC(js_geometry_Ray_Ray);

extern se::Object *__jsb_cc_geometry_Sphere_proto; // NOLINT
extern se::Class * __jsb_cc_geometry_Sphere_class; // NOLINT

bool js_register_cc_geometry_Sphere(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_geometry_Sphere_clone);
SE_DECLARE_FUNC(js_geometry_Sphere_copy);
SE_DECLARE_FUNC(js_geometry_Sphere_define);
SE_DECLARE_FUNC(js_geometry_Sphere_getCenter);
SE_DECLARE_FUNC(js_geometry_Sphere_getRadius);
SE_DECLARE_FUNC(js_geometry_Sphere_interset);
SE_DECLARE_FUNC(js_geometry_Sphere_merge);
SE_DECLARE_FUNC(js_geometry_Sphere_mergeAABB);
SE_DECLARE_FUNC(js_geometry_Sphere_mergeFrustum);
SE_DECLARE_FUNC(js_geometry_Sphere_mergePoint);
SE_DECLARE_FUNC(js_geometry_Sphere_setCenter);
SE_DECLARE_FUNC(js_geometry_Sphere_setRadius);
SE_DECLARE_FUNC(js_geometry_Sphere_setScale);
SE_DECLARE_FUNC(js_geometry_Sphere_sphereFrustum);
SE_DECLARE_FUNC(js_geometry_Sphere_spherePlane);
SE_DECLARE_FUNC(js_geometry_Sphere_transform);
SE_DECLARE_FUNC(js_geometry_Sphere_translateAndRotate);
SE_DECLARE_FUNC(js_geometry_Sphere_clone);
SE_DECLARE_FUNC(js_geometry_Sphere_copy);
SE_DECLARE_FUNC(js_geometry_Sphere_create);
SE_DECLARE_FUNC(js_geometry_Sphere_fromPoints);
SE_DECLARE_FUNC(js_geometry_Sphere_mergeAABB);
SE_DECLARE_FUNC(js_geometry_Sphere_mergePoint);
SE_DECLARE_FUNC(js_geometry_Sphere_set);
SE_DECLARE_FUNC(js_geometry_Sphere_Sphere);

extern se::Object *__jsb_cc_geometry_Triangle_proto; // NOLINT
extern se::Class * __jsb_cc_geometry_Triangle_class; // NOLINT

bool js_register_cc_geometry_Triangle(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_geometry_Triangle_clone);
SE_DECLARE_FUNC(js_geometry_Triangle_copy);
SE_DECLARE_FUNC(js_geometry_Triangle_create);
SE_DECLARE_FUNC(js_geometry_Triangle_fromPoints);
SE_DECLARE_FUNC(js_geometry_Triangle_set);
SE_DECLARE_FUNC(js_geometry_Triangle_Triangle);
    // clang-format on