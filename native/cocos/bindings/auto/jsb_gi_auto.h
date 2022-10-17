// clang-format off
#pragma once

#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/gi/light-probe/LightProbe.h"
#include "cocos/gi/light-probe/Delaunay.h"

bool register_all_gi(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cc::gi::Vertex);
JSB_REGISTER_OBJECT_TYPE(cc::gi::CircumSphere);
JSB_REGISTER_OBJECT_TYPE(cc::gi::Tetrahedron);
JSB_REGISTER_OBJECT_TYPE(cc::gi::LightProbesData);
JSB_REGISTER_OBJECT_TYPE(cc::gi::LightProbes);
JSB_REGISTER_OBJECT_TYPE(cc::gi::LightProbeInfo);


extern se::Object *__jsb_cc_gi_Vertex_proto;   // NOLINT
extern se::Class *__jsb_cc_gi_Vertex_class;    // NOLINT

bool js_register_cc_gi_Vertex(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gi::Vertex *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gi_CircumSphere_proto;   // NOLINT
extern se::Class *__jsb_cc_gi_CircumSphere_class;    // NOLINT

bool js_register_cc_gi_CircumSphere(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gi::CircumSphere *, se::Object *ctx); //NOLINT
SE_DECLARE_FUNC(js_gi_CircumSphere_init);

extern se::Object *__jsb_cc_gi_Tetrahedron_proto;   // NOLINT
extern se::Class *__jsb_cc_gi_Tetrahedron_class;    // NOLINT

bool js_register_cc_gi_Tetrahedron(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gi::Tetrahedron *, se::Object *ctx); //NOLINT
SE_DECLARE_FUNC(js_gi_Tetrahedron_contain);
SE_DECLARE_FUNC(js_gi_Tetrahedron_isInCircumSphere);
SE_DECLARE_FUNC(js_gi_Tetrahedron_isInnerTetrahedron);
SE_DECLARE_FUNC(js_gi_Tetrahedron_isOuterCell);

extern se::Object *__jsb_cc_gi_LightProbesData_proto;   // NOLINT
extern se::Class *__jsb_cc_gi_LightProbesData_class;    // NOLINT

bool js_register_cc_gi_LightProbesData(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gi_LightProbesData_available);
SE_DECLARE_FUNC(js_gi_LightProbesData_build);
SE_DECLARE_FUNC(js_gi_LightProbesData_empty);
SE_DECLARE_FUNC(js_gi_LightProbesData_getInterpolationSHCoefficients);
SE_DECLARE_FUNC(js_gi_LightProbesData_LightProbesData);

extern se::Object *__jsb_cc_gi_LightProbes_proto;   // NOLINT
extern se::Class *__jsb_cc_gi_LightProbes_class;    // NOLINT

bool js_register_cc_gi_LightProbes(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gi_LightProbes_available);
SE_DECLARE_FUNC(js_gi_LightProbes_initialize);
SE_DECLARE_FUNC(js_gi_LightProbes_LightProbes);

extern se::Object *__jsb_cc_gi_LightProbeInfo_proto;   // NOLINT
extern se::Class *__jsb_cc_gi_LightProbeInfo_class;    // NOLINT

bool js_register_cc_gi_LightProbeInfo(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gi_LightProbeInfo_activate);
SE_DECLARE_FUNC(js_gi_LightProbeInfo_setReduceRinging);
SE_DECLARE_FUNC(js_gi_LightProbeInfo_LightProbeInfo);
// clang-format on
