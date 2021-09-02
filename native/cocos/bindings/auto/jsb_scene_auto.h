#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/auto/jsb_gfx_auto.h"
#include "cocos/scene/Node.h"
#include "cocos/scene/BaseNode.h"
#include "cocos/scene/Scene.h"
#include "cocos/scene/Light.h"
#include "cocos/scene/DirectionalLight.h"
#include "cocos/scene/SpotLight.h"
#include "cocos/scene/SphereLight.h"
#include "cocos/scene/Model.h"
#include "cocos/scene/SubModel.h"
#include "cocos/scene/Pass.h"
#include "cocos/scene/RenderScene.h"
#include "cocos/scene/DrawBatch2D.h"
#include "cocos/scene/Camera.h"
#include "cocos/scene/RenderWindow.h"
#include "cocos/scene/Camera.h"
#include "cocos/scene/Define.h"

extern se::Object* __jsb_cc_scene_BaseNode_proto;
extern se::Class* __jsb_cc_scene_BaseNode_class;

bool js_register_cc_scene_BaseNode(se::Object* obj);
bool register_all_scene(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::scene::BaseNode);
SE_DECLARE_FUNC(js_scene_BaseNode_getChilds);
SE_DECLARE_FUNC(js_scene_BaseNode_setParent);
SE_DECLARE_FUNC(js_scene_BaseNode_BaseNode);

extern se::Object* __jsb_cc_scene_Scene_proto;
extern se::Class* __jsb_cc_scene_Scene_class;

bool js_register_cc_scene_Scene(se::Object* obj);
bool register_all_scene(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::scene::Scene);
SE_DECLARE_FUNC(js_scene_Scene_Scene);

extern se::Object* __jsb_cc_scene_Node_proto;
extern se::Class* __jsb_cc_scene_Node_class;

bool js_register_cc_scene_Node(se::Object* obj);
bool register_all_scene(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::scene::Node);
SE_DECLARE_FUNC(js_scene_Node_initWithData);
SE_DECLARE_FUNC(js_scene_Node_Node);

extern se::Object* __jsb_cc_scene_Light_proto;
extern se::Class* __jsb_cc_scene_Light_class;

bool js_register_cc_scene_Light(se::Object* obj);
bool register_all_scene(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::scene::Light);
SE_DECLARE_FUNC(js_scene_Light_setColor);
SE_DECLARE_FUNC(js_scene_Light_setColorTemperatureRGB);
SE_DECLARE_FUNC(js_scene_Light_setNode);
SE_DECLARE_FUNC(js_scene_Light_setType);
SE_DECLARE_FUNC(js_scene_Light_setUseColorTemperature);
SE_DECLARE_FUNC(js_scene_Light_update);

extern se::Object* __jsb_cc_scene_DirectionalLight_proto;
extern se::Class* __jsb_cc_scene_DirectionalLight_class;

bool js_register_cc_scene_DirectionalLight(se::Object* obj);
bool register_all_scene(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::scene::DirectionalLight);
SE_DECLARE_FUNC(js_scene_DirectionalLight_setDirection);
SE_DECLARE_FUNC(js_scene_DirectionalLight_setIlluminance);
SE_DECLARE_FUNC(js_scene_DirectionalLight_DirectionalLight);

extern se::Object* __jsb_cc_scene_Plane_proto;
extern se::Class* __jsb_cc_scene_Plane_class;

bool js_register_cc_scene_Plane(se::Object* obj);
bool register_all_scene(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::scene::Plane *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::scene::Plane);
SE_DECLARE_FUNC(js_scene_Plane_clone);
SE_DECLARE_FUNC(js_scene_Plane_define);
SE_DECLARE_FUNC(js_scene_Plane_distance);

extern se::Object* __jsb_cc_scene_Frustum_proto;
extern se::Class* __jsb_cc_scene_Frustum_class;

bool js_register_cc_scene_Frustum(se::Object* obj);
bool register_all_scene(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::scene::Frustum *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::scene::Frustum);
SE_DECLARE_FUNC(js_scene_Frustum_clone);
SE_DECLARE_FUNC(js_scene_Frustum_createOrtho);
SE_DECLARE_FUNC(js_scene_Frustum_split);
SE_DECLARE_FUNC(js_scene_Frustum_transform);

extern se::Object* __jsb_cc_scene_AABB_proto;
extern se::Class* __jsb_cc_scene_AABB_class;

bool js_register_cc_scene_AABB(se::Object* obj);
bool register_all_scene(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::scene::AABB);
SE_DECLARE_FUNC(js_scene_AABB_getLayout);
SE_DECLARE_FUNC(js_scene_AABB_initWithData);
SE_DECLARE_FUNC(js_scene_AABB_AABB);

extern se::Object* __jsb_cc_scene_SpotLight_proto;
extern se::Class* __jsb_cc_scene_SpotLight_class;

bool js_register_cc_scene_SpotLight(se::Object* obj);
bool register_all_scene(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::scene::SpotLight);
SE_DECLARE_FUNC(js_scene_SpotLight_setAABB);
SE_DECLARE_FUNC(js_scene_SpotLight_setAngle);
SE_DECLARE_FUNC(js_scene_SpotLight_setAspect);
SE_DECLARE_FUNC(js_scene_SpotLight_setDirection);
SE_DECLARE_FUNC(js_scene_SpotLight_setFrustum);
SE_DECLARE_FUNC(js_scene_SpotLight_setIlluminance);
SE_DECLARE_FUNC(js_scene_SpotLight_setNeedUpdate);
SE_DECLARE_FUNC(js_scene_SpotLight_setPosition);
SE_DECLARE_FUNC(js_scene_SpotLight_setRange);
SE_DECLARE_FUNC(js_scene_SpotLight_setSize);
SE_DECLARE_FUNC(js_scene_SpotLight_SpotLight);

extern se::Object* __jsb_cc_scene_SphereLight_proto;
extern se::Class* __jsb_cc_scene_SphereLight_class;

bool js_register_cc_scene_SphereLight(se::Object* obj);
bool register_all_scene(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::scene::SphereLight);
SE_DECLARE_FUNC(js_scene_SphereLight_setAABB);
SE_DECLARE_FUNC(js_scene_SphereLight_setIlluminance);
SE_DECLARE_FUNC(js_scene_SphereLight_setPosition);
SE_DECLARE_FUNC(js_scene_SphereLight_setRange);
SE_DECLARE_FUNC(js_scene_SphereLight_setSize);
SE_DECLARE_FUNC(js_scene_SphereLight_SphereLight);

extern se::Object* __jsb_cc_scene_Model_proto;
extern se::Class* __jsb_cc_scene_Model_class;

bool js_register_cc_scene_Model(se::Object* obj);
bool register_all_scene(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::scene::Model);
SE_DECLARE_FUNC(js_scene_Model_getCastShadow);
SE_DECLARE_FUNC(js_scene_Model_getEnabled);
SE_DECLARE_FUNC(js_scene_Model_getInstMatWorldIdx);
SE_DECLARE_FUNC(js_scene_Model_getInstanceAttributes);
SE_DECLARE_FUNC(js_scene_Model_getInstancedAttributeBlock);
SE_DECLARE_FUNC(js_scene_Model_getInstancedBuffer);
SE_DECLARE_FUNC(js_scene_Model_getInstancedBufferSize);
SE_DECLARE_FUNC(js_scene_Model_getLocalData);
SE_DECLARE_FUNC(js_scene_Model_getNode);
SE_DECLARE_FUNC(js_scene_Model_getReceiveShadow);
SE_DECLARE_FUNC(js_scene_Model_getSubModels);
SE_DECLARE_FUNC(js_scene_Model_getTransform);
SE_DECLARE_FUNC(js_scene_Model_getTransformUpdated);
SE_DECLARE_FUNC(js_scene_Model_getUpdatStamp);
SE_DECLARE_FUNC(js_scene_Model_getVisFlags);
SE_DECLARE_FUNC(js_scene_Model_seVisFlag);
SE_DECLARE_FUNC(js_scene_Model_setBounds);
SE_DECLARE_FUNC(js_scene_Model_setCastShadow);
SE_DECLARE_FUNC(js_scene_Model_setEnabled);
SE_DECLARE_FUNC(js_scene_Model_setInstMatWorldIdx);
SE_DECLARE_FUNC(js_scene_Model_setLocalBuffer);
SE_DECLARE_FUNC(js_scene_Model_setNode);
SE_DECLARE_FUNC(js_scene_Model_setReceiveShadow);
SE_DECLARE_FUNC(js_scene_Model_setSubModel);
SE_DECLARE_FUNC(js_scene_Model_setTransform);
SE_DECLARE_FUNC(js_scene_Model_updateTransform);
SE_DECLARE_FUNC(js_scene_Model_updateUBOs);
SE_DECLARE_FUNC(js_scene_Model_Model);

extern se::Object* __jsb_cc_scene_Fog_proto;
extern se::Class* __jsb_cc_scene_Fog_class;

bool js_register_cc_scene_Fog(se::Object* obj);
bool register_all_scene(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::scene::Fog *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::scene::Fog);

extern se::Object* __jsb_cc_scene_Shadow_proto;
extern se::Class* __jsb_cc_scene_Shadow_class;

bool js_register_cc_scene_Shadow(se::Object* obj);
bool register_all_scene(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::scene::Shadow *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::scene::Shadow);

extern se::Object* __jsb_cc_scene_Skybox_proto;
extern se::Class* __jsb_cc_scene_Skybox_class;

bool js_register_cc_scene_Skybox(se::Object* obj);
bool register_all_scene(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::scene::Skybox *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::scene::Skybox);

extern se::Object* __jsb_cc_scene_Ambient_proto;
extern se::Class* __jsb_cc_scene_Ambient_class;

bool js_register_cc_scene_Ambient(se::Object* obj);
bool register_all_scene(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::scene::Ambient *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::scene::Ambient);

extern se::Object* __jsb_cc_scene_PipelineSharedSceneData_proto;
extern se::Class* __jsb_cc_scene_PipelineSharedSceneData_class;

bool js_register_cc_scene_PipelineSharedSceneData(se::Object* obj);
bool register_all_scene(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::scene::PipelineSharedSceneData *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::scene::PipelineSharedSceneData);

extern se::Object* __jsb_cc_scene_Root_proto;
extern se::Class* __jsb_cc_scene_Root_class;

bool js_register_cc_scene_Root(se::Object* obj);
bool register_all_scene(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::scene::Root *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::scene::Root);

extern se::Object* __jsb_cc_scene_SubModel_proto;
extern se::Class* __jsb_cc_scene_SubModel_class;

bool js_register_cc_scene_SubModel(se::Object* obj);
bool register_all_scene(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::scene::SubModel);
SE_DECLARE_FUNC(js_scene_SubModel_getPass);
SE_DECLARE_FUNC(js_scene_SubModel_getPasses);
SE_DECLARE_FUNC(js_scene_SubModel_getPlanarInstanceShader);
SE_DECLARE_FUNC(js_scene_SubModel_getPlanarShader);
SE_DECLARE_FUNC(js_scene_SubModel_getPriority);
SE_DECLARE_FUNC(js_scene_SubModel_getShader);
SE_DECLARE_FUNC(js_scene_SubModel_setDescriptorSet);
SE_DECLARE_FUNC(js_scene_SubModel_setInputAssembler);
SE_DECLARE_FUNC(js_scene_SubModel_setPasses);
SE_DECLARE_FUNC(js_scene_SubModel_setPlanarInstanceShader);
SE_DECLARE_FUNC(js_scene_SubModel_setPlanarShader);
SE_DECLARE_FUNC(js_scene_SubModel_setPriority);
SE_DECLARE_FUNC(js_scene_SubModel_setShaders);
SE_DECLARE_FUNC(js_scene_SubModel_update);
SE_DECLARE_FUNC(js_scene_SubModel_SubModel);

extern se::Object* __jsb_cc_scene_Pass_proto;
extern se::Class* __jsb_cc_scene_Pass_class;

bool js_register_cc_scene_Pass(se::Object* obj);
bool register_all_scene(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::scene::Pass);
SE_DECLARE_FUNC(js_scene_Pass_getBatchingScheme);
SE_DECLARE_FUNC(js_scene_Pass_getBlendState);
SE_DECLARE_FUNC(js_scene_Pass_getDepthStencilState);
SE_DECLARE_FUNC(js_scene_Pass_getDescriptorSet);
SE_DECLARE_FUNC(js_scene_Pass_getDynamicState);
SE_DECLARE_FUNC(js_scene_Pass_getHash);
SE_DECLARE_FUNC(js_scene_Pass_getPhase);
SE_DECLARE_FUNC(js_scene_Pass_getPipelineLayout);
SE_DECLARE_FUNC(js_scene_Pass_getPrimitive);
SE_DECLARE_FUNC(js_scene_Pass_getPriority);
SE_DECLARE_FUNC(js_scene_Pass_getRasterizerState);
SE_DECLARE_FUNC(js_scene_Pass_getStage);
SE_DECLARE_FUNC(js_scene_Pass_initWithData);
SE_DECLARE_FUNC(js_scene_Pass_setBatchingScheme);
SE_DECLARE_FUNC(js_scene_Pass_setBlendState);
SE_DECLARE_FUNC(js_scene_Pass_setDepthStencilState);
SE_DECLARE_FUNC(js_scene_Pass_setDescriptorSet);
SE_DECLARE_FUNC(js_scene_Pass_setDynamicState);
SE_DECLARE_FUNC(js_scene_Pass_setHash);
SE_DECLARE_FUNC(js_scene_Pass_setPhase);
SE_DECLARE_FUNC(js_scene_Pass_setPipelineLayout);
SE_DECLARE_FUNC(js_scene_Pass_setPrimitive);
SE_DECLARE_FUNC(js_scene_Pass_setPriority);
SE_DECLARE_FUNC(js_scene_Pass_setRasterizerState);
SE_DECLARE_FUNC(js_scene_Pass_setRootBufferDirty);
SE_DECLARE_FUNC(js_scene_Pass_setStage);
SE_DECLARE_FUNC(js_scene_Pass_update);
SE_DECLARE_FUNC(js_scene_Pass_Pass);

extern se::Object* __jsb_cc_scene_BakedAnimInfo_proto;
extern se::Class* __jsb_cc_scene_BakedAnimInfo_class;

bool js_register_cc_scene_BakedAnimInfo(se::Object* obj);
bool register_all_scene(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::scene::BakedAnimInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::scene::BakedAnimInfo);
SE_DECLARE_FUNC(js_scene_BakedAnimInfo_getDirty);

extern se::Object* __jsb_cc_scene_BakedJointInfo_proto;
extern se::Class* __jsb_cc_scene_BakedJointInfo_class;

bool js_register_cc_scene_BakedJointInfo(se::Object* obj);
bool register_all_scene(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::scene::BakedJointInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::scene::BakedJointInfo);

extern se::Object* __jsb_cc_scene_BakedSkinningModel_proto;
extern se::Class* __jsb_cc_scene_BakedSkinningModel_class;

bool js_register_cc_scene_BakedSkinningModel(se::Object* obj);
bool register_all_scene(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::scene::BakedSkinningModel);
SE_DECLARE_FUNC(js_scene_BakedSkinningModel_setAnimInfoIdx);
SE_DECLARE_FUNC(js_scene_BakedSkinningModel_setJointMedium);
SE_DECLARE_FUNC(js_scene_BakedSkinningModel_updateModelBounds);
SE_DECLARE_FUNC(js_scene_BakedSkinningModel_BakedSkinningModel);

extern se::Object* __jsb_cc_scene_DrawBatch2D_proto;
extern se::Class* __jsb_cc_scene_DrawBatch2D_class;

bool js_register_cc_scene_DrawBatch2D(se::Object* obj);
bool register_all_scene(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::scene::DrawBatch2D *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::scene::DrawBatch2D);

extern se::Object* __jsb_cc_scene_JointTransform_proto;
extern se::Class* __jsb_cc_scene_JointTransform_class;

bool js_register_cc_scene_JointTransform(se::Object* obj);
bool register_all_scene(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::scene::JointTransform *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::scene::JointTransform);

extern se::Object* __jsb_cc_scene_JointInfo_proto;
extern se::Class* __jsb_cc_scene_JointInfo_class;

bool js_register_cc_scene_JointInfo(se::Object* obj);
bool register_all_scene(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::scene::JointInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::scene::JointInfo);

extern se::Object* __jsb_cc_scene_SkinningModel_proto;
extern se::Class* __jsb_cc_scene_SkinningModel_class;

bool js_register_cc_scene_SkinningModel(se::Object* obj);
bool register_all_scene(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::scene::SkinningModel);
SE_DECLARE_FUNC(js_scene_SkinningModel_setBuffers);
SE_DECLARE_FUNC(js_scene_SkinningModel_setIndicesAndJoints);
SE_DECLARE_FUNC(js_scene_SkinningModel_setNeedUpdate);
SE_DECLARE_FUNC(js_scene_SkinningModel_updateLocalDescriptors);
SE_DECLARE_FUNC(js_scene_SkinningModel_SkinningModel);

extern se::Object* __jsb_cc_scene_RenderScene_proto;
extern se::Class* __jsb_cc_scene_RenderScene_class;

bool js_register_cc_scene_RenderScene(se::Object* obj);
bool register_all_scene(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::scene::RenderScene);
SE_DECLARE_FUNC(js_scene_RenderScene_addBakedSkinningModel);
SE_DECLARE_FUNC(js_scene_RenderScene_addBatch);
SE_DECLARE_FUNC(js_scene_RenderScene_addModel);
SE_DECLARE_FUNC(js_scene_RenderScene_addSkinningModel);
SE_DECLARE_FUNC(js_scene_RenderScene_addSphereLight);
SE_DECLARE_FUNC(js_scene_RenderScene_addSpotLight);
SE_DECLARE_FUNC(js_scene_RenderScene_getDrawBatch2Ds);
SE_DECLARE_FUNC(js_scene_RenderScene_getMainLight);
SE_DECLARE_FUNC(js_scene_RenderScene_getModels);
SE_DECLARE_FUNC(js_scene_RenderScene_getSphereLights);
SE_DECLARE_FUNC(js_scene_RenderScene_getSpotLights);
SE_DECLARE_FUNC(js_scene_RenderScene_removeBatch);
SE_DECLARE_FUNC(js_scene_RenderScene_removeBatches);
SE_DECLARE_FUNC(js_scene_RenderScene_removeModel);
SE_DECLARE_FUNC(js_scene_RenderScene_removeModels);
SE_DECLARE_FUNC(js_scene_RenderScene_removeSphereLight);
SE_DECLARE_FUNC(js_scene_RenderScene_removeSphereLights);
SE_DECLARE_FUNC(js_scene_RenderScene_removeSpotLight);
SE_DECLARE_FUNC(js_scene_RenderScene_removeSpotLights);
SE_DECLARE_FUNC(js_scene_RenderScene_setMainLight);
SE_DECLARE_FUNC(js_scene_RenderScene_update);
SE_DECLARE_FUNC(js_scene_RenderScene_RenderScene);

extern se::Object* __jsb_cc_scene_RenderWindow_proto;
extern se::Class* __jsb_cc_scene_RenderWindow_class;

bool js_register_cc_scene_RenderWindow(se::Object* obj);
bool register_all_scene(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::scene::RenderWindow *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::scene::RenderWindow);

extern se::Object* __jsb_cc_scene_Camera_proto;
extern se::Class* __jsb_cc_scene_Camera_class;

bool js_register_cc_scene_Camera(se::Object* obj);
bool register_all_scene(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::scene::Camera *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::scene::Camera);

